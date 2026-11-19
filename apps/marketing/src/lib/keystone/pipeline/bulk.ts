// Bulk mode of the solutions pipeline: the same run (run.ts processItem: same prompts, same checks, same holds,
// same writes), with the model calls that can wait sent through the vendors' batch endpoints at half price
// (vendors/batch.ts) instead of live. Slower: a run stops at a call that is out in a batch and a later invocation
// of the script continues it.
//
// How it stays the same run. Nothing of the flow is copied here. Each invocation calls processItem for every
// selected item, exactly as a live run does; the only difference is inside callModel (models.ts), which asks this
// module's port before making a call:
//   - the reply is here (collected from a batch)        → it is used, priced at the batch rate;
//   - the request is out in a batch, or new             → BatchPending: the run is saved unfinished and stops;
//   - the batch gave nothing usable for it              → the live call is made, once, and its reply kept.
// Finished steps are on the RunDoc as in a live run, so the next invocation replays them from the record and
// arrives at the next call. The waves fall out of the flow:
//   wave 1  the two blind solves (solver 1 Anthropic, solver 2 OpenAI), after the live intake check;
//           then in code: key compare, course, disagreement (the third solver is a live call, see below);
//   wave 2  the write (author, Anthropic);
//   wave 3  the working check and the rules audit (both OpenAI; the audit is sent along with the working check
//           for the same draft, and used when the working check passes);
//   wave 4  the ONE correction (author), and after it the re-check of the corrected draft.
//
// What stays a live call in bulk mode, and why:
//   - intake and compare (Gemini) and the third solver (DeepSeek for text, Gemini with images): see the note on
//     Gemini and DeepSeek at the top of vendors/batch.ts. The third solver runs only for the few items whose two
//     solvers disagree; a live call costs cents there and saves those items a whole batch round trip;
//   - the code checks (calc, render) cost nothing.
//
// A request that does not come back usable never drops the item and is never retried without end: an errored,
// expired, canceled or lost request, and a refusal (a batch has no refusal fallback; the live call has), is made
// again as ONE live call whose reply is stored on the request (a later invocation reuses it, never calls again);
// if that call fails too the step fails as in a live run (held for the owner, counted by the attempt limit).
// A reply that came back but does not fit (empty, cut off, not the schema) is treated exactly as the live run
// treats such a reply: the step fails and the item is held.
//
// The release hold is untouched: release times are computed by run.ts when the run passes, from the arrival time
// and the passing time, so waiting on a batch can only make them later; an item whose batch is not back is still
// Received, which also keeps its client batch from being sampled or released (release.ts readBatch).
// No `next/*` imports: this runs from tsx scripts on a laptop too.

import { createHash } from "node:crypto";
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import type { BulkCallDoc, BulkJobDoc, ItemDoc, RunDoc, RunStep } from "../db";
import { ks } from "../db";
import { SupersededError } from "../store";
import { MODEL_FOR, costOf, pollBulk, redact, specOfModel, submitBulk } from "./models";
import {
  ATTEMPT_LIMIT_WHY, DEFAULT_MAX_COST, DryRunWriter, asReceivedReader, fromOf, processItem, selectItems,
  type Deps, type DryAction, type Reader, type RunArgs, type Steps, type Writer,
} from "./run";
import { BatchPending, type BatchPort, type BatchServe, type ModelDeps, type ModelSpec, type Role, type StoredReply, type Vendor } from "./types";
import { isBatchVendor, type BatchRequest, type BatchVendor } from "./vendors/batch";
import { TransportError } from "./vendors/common";
import type { Rule } from "./write";

export type { BulkCallDoc, BulkJobDoc } from "../db";

/** The roles whose calls go through a batch (their vendors have a batch endpoint we use). Everything else is live. */
export const BULK_ROLES: ReadonlySet<Role> = new Set<Role>(["solver1", "solver2", "author", "working", "audit"]);

/**
 * A job still not over this long after it was submitted is given up (marked lost; its requests are made as live
 * calls). Both vendors end a batch themselves within 24 h (expiry), so this only catches a job we can no longer ask about.
 */
export const JOB_GIVE_UP_MS = 30 * 60 * 60 * 1000;

/**
 * The most one vendor batch carries here; more is split over several batches of the same wave. Well inside both
 * vendors' limits (Anthropic: 100,000 requests or 256 MB; OpenAI: 50,000 requests and a 200 MB file; see the doc
 * pages named in vendors/batch.ts).
 */
/**
 * The most batch requests one run of one item may have (a normal run needs about ten: two solves, the write, working
 * check and audit, and the same again for a correction or a restart). Past it nothing more is sent for the run: the
 * call is made live. A bound on spend should a request ever fail to be recognised from one invocation to the next.
 */
export const MAX_REQUESTS_PER_RUN = 30;

export const BATCH_LIMITS = { requests: 10_000, bytes: 100 * 1024 * 1024 };

/** Where bulk mode keeps its state between invocations: the database for a writing run, a local file for a dry run. */
export interface BulkStore {
  /** Jobs not collected yet (submitting or submitted). */
  openJobs(): Promise<BulkJobDoc[]>;
  saveJob(job: BulkJobDoc): Promise<void>;
  /** Every request sent for this run of this item, oldest first. */
  calls(itemId: string, runId: string): Promise<BulkCallDoc[]>;
  callsOfJob(jobId: string): Promise<BulkCallDoc[]>;
  saveCalls(calls: BulkCallDoc[]): Promise<void>;
  /** Dry run only: the run records and the would-be writes are kept here too (a dry run writes nothing to the database). */
  dry?: {
    run(itemId: string, runId: string): RunDoc | null;
    latestRun(itemId: string): RunDoc | null;
    saveRun(run: RunDoc): void;
    actions(): DryAction[];
    addActions(a: DryAction[]): void;
  };
}

// --- the port: one per item and invocation ---------------------------------------------------------------

type Queued = { call: BulkCallDoc; body: Record<string, unknown> };

const sha = (s: string) => createHash("sha256").update(s, "utf8").digest("hex");

/** The ids of the batch requests the run's finished steps used (RunStep.batch.ids): such a request is never served again. */
export function consumedIds(run: Pick<RunDoc, "steps"> | null | undefined): Set<string> {
  const out = new Set<string>();
  for (const st of run?.steps ?? []) for (const id of st.batch?.ids ?? []) out.add(id);
  return out;
}

/** The wave a new request belongs to, from its role and how far the run has come (labels for the record and the report). */
export function waveOf(role: Role, steps: Pick<RunStep, "step">[]): number {
  if (role === "solver1" || role === "solver2") return 1;
  const writes = steps.filter((s) => s.step === "write").length;
  if (role === "author") return writes === 0 ? 2 : 4;
  // working / audit: the cause of a send-back is classified (role audit) before anything is written or solved.
  if (role === "audit" && !steps.some((s) => s.step === "cause") && !steps.some((s) => s.step === "solve" || s.step === "write")) return 0;
  return writes <= 1 ? 3 : 4;
}

export class ItemPort implements BatchPort {
  queued: Queued[] = [];
  /** Live calls made in place of a batch request during this invocation, each with the reason. */
  fellBack: { customId: string; role: string; why: string }[] = [];
  private handed = new Set<string>();
  private uses: { id: string; batch: boolean; saved: number }[] = [];
  private speculative = false;

  constructor(
    private readonly at: { itemId: string; runId: string },
    private readonly calls: BulkCallDoc[],
    private readonly consumed: Set<string>,
    private readonly o: {
      save: (c: BulkCallDoc) => Promise<void>;
      steps: () => Pick<RunStep, "step">[];
      now: () => Date;
      /** false: no new request is queued (spend cap reached); the run just waits. */
      maySubmit: boolean;
      dryRun?: boolean;
    },
  ) {}

  takes(role: Role, vendor: Vendor): boolean {
    return BULK_ROLES.has(role) && isBatchVendor(vendor);
  }

  serve(role: Role, spec: ModelSpec, body: Record<string, unknown>): BatchServe {
    // The id is the request itself: the same call of the same run finds its request again at every invocation.
    const hash = sha(JSON.stringify([this.at.itemId, this.at.runId, spec.vendor, spec.model, body]));
    const free = (c: BulkCallDoc) => c.hash === hash && !this.consumed.has(c.customId) && !this.handed.has(c.customId);
    const c = this.calls.find(free) ?? this.queued.find((q) => free(q.call))?.call;
    if (!c) {
      if (this.speculative) {
        if (this.o.maySubmit && this.calls.length + this.queued.length < MAX_REQUESTS_PER_RUN) this.enqueue(role, spec, body, hash);
        throw new BatchPending();
      }
      if (this.calls.length + this.queued.length >= MAX_REQUESTS_PER_RUN) {
        // A run never sends without end: past the bound the call is made live, once, and kept like any other fallback.
        const why = `more than ${MAX_REQUESTS_PER_RUN} batch requests for one run: made as a live call`;
        const over: BulkCallDoc = { ...this.blank(role, spec, hash), state: "errored", detail: why, collectedAt: this.o.now() };
        this.calls.push(over);
        this.handed.add(over.customId);
        return {
          kind: "live", id: over.customId, why, extraCost: 0,
          settle: async (reply: StoredReply, cost: number) => {
            over.live = { why, reply, cost, at: this.o.now() };
            this.fellBack.push({ customId: over.customId, role, why });
            await this.o.save(over);
          },
        };
      }
      if (this.o.maySubmit) this.enqueue(role, spec, body, hash);
      throw new BatchPending();
    }
    if (this.speculative || c.state === "pending") throw new BatchPending();
    this.handed.add(c.customId);
    if (c.live) return { kind: "reply", id: c.customId, reply: c.live.reply, pricing: "live", extraCost: c.cost };
    if (c.state === "succeeded" && c.reply && c.reply.refusal === undefined) return { kind: "reply", id: c.customId, reply: c.reply, pricing: "batch", extraCost: 0 };
    const why = c.state === "succeeded" ? `refused in the batch${c.reply?.refusal ? ` (${c.reply.refusal})` : ""}` : `${c.state}${c.detail ? `: ${c.detail}` : ""}`;
    return {
      kind: "live", id: c.customId, why, extraCost: c.cost,
      settle: async (reply: StoredReply, cost: number) => {
        c.live = { why, reply, cost, at: this.o.now() };
        this.fellBack.push({ customId: c.customId, role: c.role, why });
        await this.o.save(c);
      },
    };
  }

  private blank(role: Role, spec: ModelSpec, hash: string): BulkCallDoc {
    const n = this.calls.filter((x) => x.hash === hash).length + this.queued.filter((q) => q.call.hash === hash).length;
    return {
      customId: `ks-${hash.slice(0, 48)}-${n}`, jobId: "", itemId: this.at.itemId, runId: this.at.runId, role, vendor: spec.vendor as BatchVendor, model: spec.model,
      wave: waveOf(role, this.o.steps()), hash, state: "pending", cost: 0, listCost: 0, createdAt: this.o.now(), ...(this.o.dryRun ? { dryRun: true } : {}),
    };
  }
  private enqueue(role: Role, spec: ModelSpec, body: Record<string, unknown>, hash: string): void {
    this.queued.push({ body, call: this.blank(role, spec, hash) });
  }

  record(use: { id: string; batch: boolean; saved: number }): void {
    this.uses.push(use);
  }

  // run.ts step(): which of the step's calls went through a batch.
  begin(): void {
    this.uses = [];
  }
  end(): RunStep["batch"] | undefined {
    const u = this.uses;
    this.uses = [];
    if (!u.length) return undefined;
    return { ids: u.map((x) => x.id), calls: u.filter((x) => x.batch).length, live: u.filter((x) => !x.batch).length, saved: u.reduce((s, x) => s + x.saved, 0) };
  }

  /**
   * Queues the requests `fn` would make, without using any reply and without any live call: the audit of a draft
   * is sent in the same batch as its working check. Whatever `fn` returns or throws is dropped.
   */
  async alsoQueue(fn: () => Promise<unknown>): Promise<void> {
    this.speculative = true;
    try {
      await fn();
    } catch {
      // BatchPending (queued) or anything else: nothing of a speculative call is used
    } finally {
      this.speculative = false;
    }
  }
}

/** The steps of a bulk run: the real ones, plus sending the audit along with the working check of the same draft. */
export function bulkSteps(inner: Steps, port: ItemPort, rules: Rule[]): Steps {
  return {
    ...inner,
    workingCheck: async (item, draft, answer) => {
      try {
        return await inner.workingCheck(item, draft, answer);
      } catch (e) {
        // The working check was just queued: the audit of this same draft (the flow's next model call when the
        // working check passes; same item, course, draft and rules, so the same request) goes in the same batch.
        const course = item.course?.trim();
        if (e instanceof BatchPending && course && port.queued.length) await port.alsoQueue(() => inner.rulesAudit(item, course, draft, rules));
        throw e;
      }
    },
  };
}

// --- one invocation ----------------------------------------------------------------------------------------

export type BulkEnv = {
  reader: Reader;
  /** Called only for a writing run. */
  makeRealWriter: () => Writer;
  deps: Omit<Deps, "reader" | "writer" | "steps" | "bulk">;
  /** The steps for one item, built on model deps that carry the item's port (default in the script: realSteps). */
  makeSteps: (modelDeps: ModelDeps) => Steps;
  store: BulkStore;
  /** Injected HTTP for tests (also lifts the live switch). */
  modelDeps?: ModelDeps;
  concurrency?: number;
  log?: (line: string) => void;
  now?: () => Date;
  /** The most one vendor batch carries (default BATCH_LIMITS); tests set small ones. */
  limits?: { requests: number; bytes: number };
};

export type BulkItemLine = {
  itemId: string;
  runId: string;
  /** done: the run reached its result; waiting: out in a batch; stalled: could not go on (spend cap). */
  state: "done" | "waiting" | "stalled";
  result?: RunDoc["result"];
  flags: string[];
  error?: string;
  /** waiting: the waves of the requests it waits on, and since when. */
  waves: number[];
  since?: Date;
  /** Paid so far for this run (batch replies at the batch rate; requests collected but not used included), and what a live run would have paid for the same steps. */
  paid: number;
  live: number;
  /** Of `paid`: replies collected that no step used (so far). */
  unused: number;
};

export type BulkReport = {
  /** Runs that reached a result in this invocation. */
  runs: RunDoc[];
  items: BulkItemLine[];
  collected: { job: BulkJobDoc; counts: Record<string, number> }[];
  pending: { job: BulkJobDoc; detail: string }[];
  submitted: BulkJobDoc[];
  fellBack: { itemId: string; customId: string; role: string; why: string }[];
  refused: { itemId: string; why: string }[];
  skipped: { itemId: string; why: string }[];
  paid: number;
  live: number;
  dry?: { actions: DryAction[] };
};

/** What the run of an item has cost so far, and what the same steps cost live. */
export function spendOf(run: RunDoc | null | undefined, calls: BulkCallDoc[]): { paid: number; live: number; unused: number } {
  const used = consumedIds(run);
  const stepCost = (run?.steps ?? []).reduce((s, x) => s + (x.cost || 0), 0);
  const saved = (run?.steps ?? []).reduce((s, x) => s + (x.batch?.saved ?? 0), 0);
  const unused = calls.filter((c) => !used.has(c.customId)).reduce((s, c) => s + (c.cost || 0) + (c.live?.cost ?? 0), 0);
  return { paid: stepCost + unused, live: stepCost + saved, unused };
}

const errLine = (e: unknown) => redact(e instanceof Error ? e.message : String(e)).slice(0, 300);

/**
 * One invocation of bulk mode: collects the batches that finished, continues every selected item's run as far as
 * it goes, submits the next requests (one batch per vendor and model), and reports. Safe to call again at any
 * time: with nothing finished it changes nothing and submits nothing.
 */
export async function runBulk(opts: Pick<RunArgs, "only" | "batch" | "limit" | "dryRun" | "asReceived" | "maxCost">, env: BulkEnv): Promise<BulkReport> {
  if (opts.asReceived && !opts.dryRun) throw new Error("--as-received is allowed only together with --dry-run");
  if (opts.dryRun && !env.store.dry) throw new Error("a dry bulk run needs a state file (--state): nothing is written to the database");
  const log = env.log ?? ((l: string) => console.log(l));
  const now = env.now ?? (() => new Date());
  const md = env.modelDeps ?? {};
  const store = env.store;
  const dryState = opts.dryRun ? store.dry! : undefined;
  const dry = opts.dryRun ? new DryRunWriter() : undefined;
  const realWriter: Writer | undefined = dry ? undefined : env.makeRealWriter();
  // Dry: the would-be writes are only recorded (DryRunWriter) and the run records go to the state file.
  const writer: Writer = dry ? Object.assign(dry, { saveRun: async (run: RunDoc) => dryState!.saveRun(JSON.parse(JSON.stringify(run))) }) : realWriter!;
  const base = opts.asReceived && opts.only ? asReceivedReader(env.reader, opts.only) : env.reader;
  const reader: Reader = dryState
    ? { ...base, run: async (itemId, runId) => dryState.run(itemId, runId), latestRun: async (itemId) => dryState.latestRun(itemId), failedAttempts: async () => 0 }
    : base;

  // [1] Collect what came back.
  const collected: BulkReport["collected"] = [];
  const pending: BulkReport["pending"] = [];
  for (const job of await store.openJobs()) {
    const calls = await store.callsOfJob(job.jobId);
    const close = async (status: BulkJobDoc["status"], detail: string, state: BulkCallDoc["state"]) => {
      for (const c of calls) if (c.state === "pending") Object.assign(c, { state, detail, collectedAt: now() });
      Object.assign(job, { status, detail, finishedAt: job.finishedAt ?? now(), collectedAt: now() });
      await store.saveCalls(calls);
      await store.saveJob(job);
      collected.push({ job, counts: { [state]: calls.length } });
    };
    if (job.status === "submitting" || !job.vendorBatchId) {
      // Saved just before the vendor call and never confirmed: whether the vendor took it is unknown. Never sent twice:
      // its requests are made as live calls.
      await close("lost", "the submission was never confirmed (the invocation stopped during it)", "lost");
      log(`!! bulk job ${job.jobId} (${job.vendor}) was never confirmed as submitted: marked lost, its ${calls.length} request(s) will be made as live calls`);
      continue;
    }
    let poll;
    try {
      poll = await pollBulk(job.vendor, job.model, job.vendorBatchId, md);
    } catch (e) {
      const age = now().getTime() - new Date(job.submittedAt ?? job.createdAt).getTime();
      const gone = e instanceof TransportError && e.status === 404;
      if (gone || age > JOB_GIVE_UP_MS) {
        await close("lost", gone ? "the vendor no longer knows this batch" : `could not be asked about for ${Math.round(age / 3600000)} h: ${errLine(e)}`, "lost");
        log(`!! bulk job ${job.jobId} (${job.vendor} ${job.vendorBatchId}) is given up: ${job.detail}; its request(s) will be made as live calls`);
      } else {
        pending.push({ job, detail: `could not be asked: ${errLine(e)}` });
      }
      continue;
    }
    if (poll.state === "running") {
      pending.push({ job, detail: poll.detail });
      continue;
    }
    const byId = new Map(poll.lines.map((l) => [l.customId, l]));
    const counts: Record<string, number> = {};
    for (const c of calls) {
      if (c.state !== "pending") continue;
      const line = byId.get(c.customId);
      const spec = specOfModel(c.model) ?? MODEL_FOR[c.role as Role];
      if (line?.type === "succeeded") {
        const r = line.reply;
        const cache = { write: r.cacheWriteTokens ?? 0, read: r.cacheReadTokens ?? 0 };
        c.state = "succeeded";
        c.reply = { ...r, ...(r.refusal !== undefined ? { refusal: redact(r.refusal) } : {}) };
        c.listCost = costOf(spec, r.tokensIn, r.tokensOut, md.now, cache);
        c.cost = costOf(spec, r.tokensIn, r.tokensOut, md.now, cache, { batch: true });
      } else if (line) {
        c.state = line.type;
        c.detail = redact(line.detail).slice(0, 300);
      } else {
        // No line for a request of a batch that is over: never read as a pass, never waited for again.
        c.state = poll.outcome === "expired" ? "expired" : poll.outcome === "canceled" ? "canceled" : "errored";
        c.detail = redact(poll.why ?? `the batch is over (${poll.outcome}) with no result for this request`).slice(0, 300);
      }
      c.collectedAt = now();
      counts[c.state] = (counts[c.state] ?? 0) + 1;
    }
    Object.assign(job, { status: poll.outcome, finishedAt: poll.finishedAt ?? now(), collectedAt: now(), ...(poll.why ? { detail: redact(poll.why).slice(0, 300) } : {}) });
    // Requests first: a job is marked collected only once every outcome is stored (a stop in between collects it again).
    await store.saveCalls(calls);
    await store.saveJob(job);
    collected.push({ job, counts });
  }

  // [2] The same selection a live run makes.
  const candidates = await reader.candidates({ only: opts.only, batch: opts.batch });
  const latest = new Map<string, RunDoc>();
  const attempts = new Map<string, number>();
  for (const c of candidates) {
    const r = await reader.latestRun(c.itemId);
    if (r) latest.set(c.itemId, r);
    const n = await reader.failedAttempts(c.itemId, fromOf(c));
    if (n) attempts.set(c.itemId, n);
  }
  const sel = selectItems(candidates, latest, { ...opts, attempts });
  for (const r of sel.refused) log(`${r.itemId}: refused (${r.why})`);
  if (!opts.dryRun) {
    // Over the attempt limit: the same plain hold a live run writes.
    for (const it of sel.limited) {
      if (it.pipeline?.heldFor === "praveen" && it.pipeline?.heldWhy === ATTEMPT_LIMIT_WHY) continue;
      const { wroteStage: _w, releaseClaim: _c, ...kept } = it.pipeline ?? { flags: [] };
      void _w; void _c;
      try {
        await writer.setPipeline(it.itemId, { ...kept, flags: Array.isArray(kept.flags) ? kept.flags : [], heldFor: "praveen", heldWhy: ATTEMPT_LIMIT_WHY }, fromOf(it));
      } catch (e) {
        if (!(e instanceof SupersededError)) log(`${it.itemId}: !! the attempt-limit hold could not be written: ${errLine(e)}`);
      }
    }
  }

  // [3] Continue each item's run as far as it goes.
  const freshId = `bulk-${now().toISOString().replace(/[:.]/g, "-")}`;
  const maxCost = opts.maxCost ?? DEFAULT_MAX_COST;
  const plan: { item: ItemDoc; runId: string; calls: BulkCallDoc[] }[] = [];
  for (const item of sel.take) {
    const last = latest.get(item.itemId);
    // Continue the item's unfinished (or failed) run, as a live run does; otherwise a new one.
    const runId = last && (!last.result || last.result === "failed") ? last.runId : freshId;
    plan.push({ item, runId, calls: await store.calls(item.itemId, runId) });
  }
  let spent = plan.reduce((s, p) => s + spendOf(latest.get(p.item.itemId)?.runId === p.runId ? latest.get(p.item.itemId) : null, p.calls).paid, 0);
  const capped = () => spent >= maxCost;
  const runs: RunDoc[] = [];
  const items: BulkItemLine[] = [];
  const queued: Queued[] = [];
  const fellBack: BulkReport["fellBack"] = [];
  const todo = [...plan];
  const worker = async () => {
    for (let p = todo.shift(); p; p = todo.shift()) {
      const { item, runId, calls } = p;
      const before = latest.get(item.itemId)?.runId === runId ? latest.get(item.itemId)! : null;
      const line = (state: BulkItemLine["state"], run: RunDoc | null, extra: Partial<BulkItemLine> = {}): BulkItemLine =>
        ({ itemId: item.itemId, runId, state, flags: run?.flags ?? [], waves: [], ...spendOf(run, calls), ...extra });
      const used = consumedIds(before);
      const out = calls.filter((c) => c.state === "pending" && !used.has(c.customId));
      if (out.length) {
        // Requests of this run are still out: nothing is run until they are all back (no step is paid for twice).
        items.push(line("waiting", before, { waves: [...new Set(out.map((c) => c.wave))].sort(), since: before?.waitingOnBatch }));
        continue;
      }
      // The wave of a new request is told from the steps recorded so far: the run as it was last saved.
      let saved: RunDoc | null = before;
      const port = new ItemPort({ itemId: item.itemId, runId }, calls, used, {
        save: (c) => store.saveCalls([c]),
        steps: () => saved?.steps ?? [],
        now, maySubmit: !capped(), dryRun: opts.dryRun,
      });
      const deps: Deps = {
        ...env.deps, reader,
        writer: bindWriter(writer, async (r) => { saved = r; await writer.saveRun(r); }),
        steps: bulkSteps(env.makeSteps({ ...md, batch: port }), port, env.deps.rules),
        bulk: port, ...(env.now ? { now: env.now } : {}), ...(opts.dryRun ? { dryRun: true } : {}),
      };
      const costBefore = spendOf(before, calls).paid;
      let run: RunDoc;
      try {
        run = await processItem(item.itemId, runId, deps, { startedFrom: fromOf(item) });
      } catch (e) {
        run = {
          itemId: item.itemId, runId, startedAt: now(), finishedAt: now(), mode: "fresh", startedFrom: fromOf(item), steps: [], corrections: 0,
          result: "failed", flags: [], cost: 0, assetsChecked: !!env.deps.assetExists, error: errLine(e),
        };
      }
      spent += spendOf(run, calls).paid - costBefore;
      for (const f of port.fellBack) fellBack.push({ itemId: item.itemId, ...f });
      if (run.result) {
        runs.push(run);
        items.push(line("done", run, { result: run.result, error: run.error }));
        log(`${run.itemId}: ${run.result}${run.flags.length ? ` [${run.flags.join(", ")}]` : ""}${run.error ? ` — ${run.error}` : ""} · $${run.cost.toFixed(4)}`);
      } else if (port.queued.length) {
        queued.push(...port.queued);
        items.push(line("waiting", run, { waves: [...new Set(port.queued.map((q) => q.call.wave))].sort(), since: run.waitingOnBatch }));
      } else {
        items.push(line("stalled", run, { since: run.waitingOnBatch }));
        log(`!! ${run.itemId}: not continued: spend cap $${maxCost.toFixed(2)} reached ($${spent.toFixed(4)} so far); nothing new was sent for it`);
      }
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, env.concurrency ?? 4) }, worker));

  // [4] Submit the next requests: one batch per vendor and model.
  const submitted: BulkJobDoc[] = [];
  const byVendor = new Map<string, Queued[]>();
  for (const q of queued) {
    const k = `${q.call.vendor}|${q.call.model}`;
    byVendor.set(k, [...(byVendor.get(k) ?? []), q]);
  }
  // …split only when one batch would pass the size limits.
  const limits = env.limits ?? BATCH_LIMITS;
  const groups: Queued[][] = [];
  for (const [, all] of [...byVendor].sort(([a], [b]) => (a < b ? -1 : 1))) {
    let part: Queued[] = [];
    let bytes = 0;
    for (const q of all) {
      const size = JSON.stringify(q.body).length;
      if (part.length && (part.length >= limits.requests || bytes + size > limits.bytes)) {
        groups.push(part);
        part = [];
        bytes = 0;
      }
      part.push(q);
      bytes += size;
    }
    if (part.length) groups.push(part);
  }
  let n = 0;
  for (const group of groups) {
    const { vendor, model } = group[0].call;
    const job: BulkJobDoc = {
      jobId: `${freshId}-${vendor}-${++n}`, vendor, model, status: "submitting",
      waves: [...new Set(group.map((q) => q.call.wave))].sort(), itemIds: [...new Set(group.map((q) => q.call.itemId))].sort(),
      customIds: group.map((q) => q.call.customId), createdAt: now(), ...(opts.dryRun ? { dryRun: true } : {}),
    };
    for (const q of group) q.call.jobId = job.jobId;
    // Saved before the vendor call: an invocation that stops in between leaves a job the next one marks lost, never a second submission.
    await store.saveCalls(group.map((q) => q.call));
    await store.saveJob(job);
    try {
      const requests: BatchRequest[] = group.map((q) => ({ customId: q.call.customId, body: q.body }));
      const r = await submitBulk(vendor, requests, md);
      Object.assign(job, { vendorBatchId: r.vendorBatchId, status: "submitted", submittedAt: now() });
      await store.saveJob(job);
      submitted.push(job);
    } catch (e) {
      // Refused or unreachable: nothing is out. Its requests are made as live calls at the next invocation.
      const detail = `could not be submitted: ${errLine(e)}`;
      for (const q of group) Object.assign(q.call, { state: "errored", detail, collectedAt: now() });
      Object.assign(job, { status: "failed", detail, finishedAt: now(), collectedAt: now() });
      await store.saveCalls(group.map((q) => q.call));
      await store.saveJob(job);
      log(`!! ${vendor} batch of ${group.length} request(s) ${detail}; they will be made as live calls at the next invocation`);
    }
  }

  // [5] The sample, for the items that reached a result now (release.ts applySample does nothing for a client batch
  // that still has an item waiting, so the sample is never taken by the order the items finish).
  if (!opts.dryRun && writer.sample && runs.length) {
    const done = new Set(runs.map((r) => r.itemId));
    const finished = sel.take.filter((i) => done.has(i.itemId));
    try {
      await writer.sample([...new Set(finished.map((i) => i.batchId).filter((b): b is string => !!b))], finished.filter((i) => !i.batchId).map((i) => i.itemId));
    } catch (e) {
      log(`!! sample step failed (nothing is released before a batch is sampled; the release job retries): ${errLine(e)}`);
    }
  }
  if (dry && dryState) dryState.addActions(dry.actions);

  return {
    runs, items: items.sort((a, b) => (a.itemId < b.itemId ? -1 : 1)), collected, pending, submitted, fellBack,
    refused: sel.refused, skipped: sel.skipped,
    paid: items.reduce((s, i) => s + i.paid, 0), live: items.reduce((s, i) => s + i.live, 0),
    ...(dryState ? { dry: { actions: dryState.actions() } } : {}),
  };
}

/** The writer with its saveRun replaced (methods stay bound to the writer they belong to). */
function bindWriter(w: Writer, saveRun: Writer["saveRun"]): Writer {
  return {
    saveRun,
    flagItemData: (...a) => w.flagItemData(...a),
    raiseKeyQuery: (...a) => w.raiseKeyQuery(...a),
    saveSolution: (...a) => w.saveSolution(...a),
    setPipeline: (...a) => w.setPipeline(...a),
    suggest: (...a) => w.suggest(...a),
    saveLesson: (...a) => w.saveLesson(...a),
    ...(w.sample ? { sample: (...a: Parameters<NonNullable<Writer["sample"]>>) => w.sample!(...a) } : {}),
  };
}

// --- the report --------------------------------------------------------------------------------------------

const age = (from: Date | undefined, now: Date) => {
  if (!from) return "?";
  const min = Math.max(0, Math.round((now.getTime() - new Date(from).getTime()) / 60000));
  return min < 90 ? `${min} min` : `${(min / 60).toFixed(1)} h`;
};

/** The lines the script prints after a bulk invocation. */
export function bulkReportLines(r: BulkReport, now: Date = new Date()): string[] {
  const out: string[] = [];
  const jobLine = (j: BulkJobDoc) => `${j.vendor} ${j.vendorBatchId ?? "(no vendor id)"} · ${j.customIds.length} request(s) · wave ${j.waves.join("+") || "?"} · items ${j.itemIds.join(", ")}`;
  out.push("=== Bulk: finished and collected ===");
  if (!r.collected.length) out.push("nothing");
  for (const c of r.collected) out.push(`${jobLine(c.job)} · ${c.job.status} after ${age(c.job.submittedAt ?? c.job.createdAt, new Date(c.job.finishedAt ?? now))} · ${Object.entries(c.counts).map(([k, v]) => `${k} ${v}`).join(", ") || "no requests"}`);
  out.push("=== Bulk: still out ===");
  if (!r.pending.length) out.push("nothing");
  for (const p of r.pending) out.push(`${jobLine(p.job)} · submitted ${age(p.job.submittedAt, now)} ago · ${p.detail}`);
  out.push("=== Bulk: submitted now ===");
  if (!r.submitted.length) out.push("nothing");
  for (const j of r.submitted) out.push(jobLine(j));
  if (r.fellBack.length) {
    out.push("=== Bulk: made as live calls instead ===");
    for (const f of r.fellBack) out.push(`${f.itemId} ${f.role} (${f.customId}): ${f.why}`);
  }
  out.push("=== Items ===");
  out.push("item       state     result / waiting on            paid     live price  flags");
  for (const i of r.items) {
    const what = i.state === "done" ? (i.result ?? "") : i.state === "waiting" ? `wave ${i.waves.join("+") || "?"}${i.since ? `, ${age(i.since, now)}` : ""}` : "spend cap";
    out.push(`${i.itemId.padEnd(10)} ${i.state.padEnd(9)} ${what.padEnd(30)} $${i.paid.toFixed(4).padStart(7)} $${i.live.toFixed(4).padStart(7)}    ${i.flags.join(", ")}${i.error ? `  (${i.error})` : ""}`);
  }
  const unused = r.items.reduce((s, i) => s + i.unused, 0);
  out.push(`cost so far: $${r.paid.toFixed(4)} at batch prices; the same steps live: $${r.live.toFixed(4)}${unused > 0 ? ` (of the $${r.paid.toFixed(4)}, $${unused.toFixed(4)} is for replies no step has used)` : ""}`);
  const waiting = r.items.filter((i) => i.state !== "done").length;
  out.push(waiting ? `${waiting} item(s) not finished: run the same command again later to collect and continue` : "every selected item is finished");
  return out;
}

// --- stores ------------------------------------------------------------------------------------------------

/** The Keystone database (collections bulkjobs, bulkcalls). For a writing run. */
export function mongoBulkStore(): BulkStore {
  const plain = "-_id -__v";
  return {
    openJobs: async () => (await ks()).BulkJob.find({ status: { $in: ["submitting", "submitted"] } }).sort({ createdAt: 1 }).select(plain).lean<BulkJobDoc[]>(),
    saveJob: async (job) => { await (await ks()).BulkJob.replaceOne({ jobId: job.jobId }, job, { upsert: true }); },
    calls: async (itemId, runId) => (await ks()).BulkCall.find({ itemId, runId }).sort({ createdAt: 1, customId: 1 }).select(plain).lean<BulkCallDoc[]>(),
    callsOfJob: async (jobId) => (await ks()).BulkCall.find({ jobId }).sort({ createdAt: 1, customId: 1 }).select(plain).lean<BulkCallDoc[]>(),
    saveCalls: async (calls) => {
      const { BulkCall } = await ks();
      for (const c of calls) await BulkCall.replaceOne({ customId: c.customId }, c, { upsert: true });
    },
  };
}

const DATE_KEYS = new Set(["at", "startedAt", "finishedAt", "updatedAt", "createdAt", "submittedAt", "collectedAt", "waitingOnBatch", "passedAt", "releaseAt", "timerReleasedAt", "questionChangedAt"]);
const ISO = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/;

type FileState = { version: 1; jobs: BulkJobDoc[]; calls: BulkCallDoc[]; runs: RunDoc[]; actions: DryAction[] };

/**
 * A local JSON file, for a dry run: jobs, requests, the run records and the would-be writes. Rewritten whole
 * (to a temporary file, then renamed) at every change. Holds model output and model ids: internal, keep it out of git.
 */
export function fileBulkStore(file: string): BulkStore {
  const state: FileState = existsSync(file)
    ? JSON.parse(readFileSync(file, "utf8"), (k, v) => (DATE_KEYS.has(k) && typeof v === "string" && ISO.test(v) ? new Date(v) : v))
    : { version: 1, jobs: [], calls: [], runs: [], actions: [] };
  if (state.version !== 1 || !Array.isArray(state.jobs) || !Array.isArray(state.calls) || !Array.isArray(state.runs)) throw new Error(`${file} is not a bulk state file`);
  state.actions ??= [];
  const flush = () => {
    const tmp = `${file}.tmp-${process.pid}`;
    writeFileSync(tmp, JSON.stringify(state, null, 1));
    renameSync(tmp, file);
  };
  const copy = <T>(v: T): T => structuredClone(v);
  const put = <T>(list: T[], same: (x: T) => boolean, v: T) => {
    const i = list.findIndex(same);
    if (i >= 0) list[i] = copy(v);
    else list.push(copy(v));
  };
  const byAge = (a: BulkCallDoc, b: BulkCallDoc) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() || (a.customId < b.customId ? -1 : 1);
  return {
    openJobs: async () => copy(state.jobs.filter((j) => j.status === "submitting" || j.status === "submitted")),
    saveJob: async (job) => { put(state.jobs, (x) => x.jobId === job.jobId, job); flush(); },
    calls: async (itemId, runId) => copy(state.calls.filter((c) => c.itemId === itemId && c.runId === runId).sort(byAge)),
    callsOfJob: async (jobId) => copy(state.calls.filter((c) => c.jobId === jobId).sort(byAge)),
    saveCalls: async (calls) => { for (const c of calls) put(state.calls, (x) => x.customId === c.customId, c); flush(); },
    dry: {
      run: (itemId, runId) => copy(state.runs.find((r) => r.itemId === itemId && r.runId === runId) ?? null),
      latestRun: (itemId) => copy(state.runs.filter((r) => r.itemId === itemId).sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0] ?? null),
      saveRun: (run) => { put(state.runs, (x) => x.itemId === run.itemId && x.runId === run.runId, run); flush(); },
      actions: () => copy(state.actions),
      addActions: (a) => { if (a.length) { state.actions.push(...copy(a)); flush(); } },
    },
  };
}
