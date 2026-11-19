// Tests for bulk mode (bulk.ts): the real run and the real steps, with every vendor endpoint faked through an
// injected fetch (Anthropic Message Batches, OpenAI files + batches, and the live endpoints of all four vendors)
// and an in-memory item store. No network, no mongod. Run: npx tsx src/lib/keystone/pipeline/bulk.test.ts
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import type { SectionKind } from "../config";
import type { ItemDoc, LessonDoc, PipelineDoc, RunDoc } from "../db";
import { SupersededError, type Expect } from "../store";
import { MAX_REQUESTS_PER_RUN, bulkReportLines, consumedIds, fileBulkStore, runBulk, waveOf, type BulkReport, type BulkStore } from "./bulk";
import { BATCH_RATE, MODEL_FOR, costOf } from "./models";
import { parseArgs, realSteps, runPipeline, type Reader, type Writer } from "./run";
import { loadRules } from "./write";

const ok = (value: unknown, message: string) => assert.ok(value, message);
const equal = (a: unknown, b: unknown, message: string) => assert.equal(a, b, message);
const deepEqual = (a: unknown, b: unknown, message: string) => assert.deepEqual(a, b, message);
const near = (a: number, b: number, message: string) => assert.ok(Math.abs(a - b) < 1e-9, `${message}: ${a} vs ${b}`);

for (const k of ["ANTHROPIC_API_KEY", "OPENAI_API_KEY", "DEEPSEEK_API_KEY", "GEMINI_API_KEY"]) process.env[k] = "test-key";
delete process.env.KEYSTONE_PIPELINE_LIVE;
delete process.env.KEYSTONE_MODEL_TIER;

const RULES = loadRules();
const T0 = new Date("2026-11-10T10:00:00Z");
const item = (itemId: string, p: Partial<ItemDoc> = {}): ItemDoc => ({
  itemId, subject: "Mathematics", course: "Math 30-1", courseSource: "sheet", itemType: "MC", topic: "", standards: [], key: "A",
  evelynAnswer: "", keySource: "castle-rock", questionHtml: `<p>Item ${itemId}. How many arrangements of RED DEER begin with R?</p>`,
  options: [{ label: "A", html: "60" }, { label: "B", html: "30" }, { label: "C", html: "120" }, { label: "D", html: "20" }],
  interactions: [{ kind: "choice", responseId: "RESPONSE", maxChoices: 1, options: ["A", "B", "C", "D"].map((label) => ({ label, html: label })) }],
  keys: { RESPONSE: ["A"] }, castleRockSolutionHtml: "", stage: "received", version: 0, releasedVersion: 0, releasedAnswer: "",
  batchId: "b1", showcase: false, source: "upload", order: 1, createdAt: T0, updatedAt: T0, lastActivityAt: T0, ...p,
} as ItemDoc);

/** The item store (as run.test.ts's): Reader and Writer in memory, every item write conditional. */
class FakeStore implements Reader, Writer {
  items = new Map<string, ItemDoc>();
  runs = new Map<string, RunDoc>();
  solutions: { itemId: string; version: number; sections: { kind: SectionKind; md: string }[]; runId?: string }[] = [];
  suggestions: string[] = [];
  sampled: { batchIds: string[]; unbatched: string[] }[] = [];
  itemWrites = 0;
  constructor(items: ItemDoc[]) { for (const i of items) this.items.set(i.itemId, structuredClone(i)); }
  async item(id: string) { const i = this.items.get(id); return i ? structuredClone(i) : null; }
  async run(itemId: string, runId: string) { const r = this.runs.get(`${itemId}|${runId}`); return r ? structuredClone(r) : null; }
  async latestRun(itemId: string) {
    const all = [...this.runs.values()].filter((r) => r.itemId === itemId).sort((a, b) => +b.startedAt - +a.startedAt);
    return all[0] ? structuredClone(all[0]) : null;
  }
  async lastVerdict() { return null; }
  async latestSections() { return null; }
  async failedAttempts(id: string) { return [...this.runs.values()].filter((r) => r.itemId === id).reduce((n, r) => n + (r.failedAttempts ?? 0), 0); }
  async solutionRunId(id: string, version: number) { const r = this.solutions.find((x) => x.itemId === id && x.version === version); return r ? { runId: r.runId } : null; }
  async candidates(q: { only?: string[]; batch?: string }) {
    return [...this.items.values()].filter((i) => (!q.only || q.only.includes(i.itemId)) && (!q.batch || i.batchId === q.batch)).map((i) => structuredClone(i));
  }
  private unchanged(id: string, e: Expect): ItemDoc {
    const i = this.items.get(id);
    if (!i || i.stage !== e.stage || (i.version || 0) !== e.version || i.updatedAt.getTime() !== new Date(e.updatedAt).getTime()) throw new SupersededError(id);
    return i;
  }
  async saveRun(run: RunDoc) { this.runs.set(`${run.itemId}|${run.runId}`, structuredClone(run)); }
  async flagItemData(id: string, _note: string, e: Expect, runId: string) {
    const i = this.unchanged(id, e);
    this.itemWrites++;
    Object.assign(i, { stage: "item_data", updatedAt: new Date(i.updatedAt.getTime() + 1), pipeline: { flags: [], runId, wroteStage: "item_data" } });
  }
  async raiseKeyQuery(id: string, ourAnswer: string, workingMd: string, e: Expect, runId: string) {
    const i = this.unchanged(id, e);
    this.itemWrites++;
    Object.assign(i, { stage: "key_query", keyQuery: { ourAnswer, workingHtml: workingMd, raisedAt: new Date() }, updatedAt: new Date(i.updatedAt.getTime() + 1), pipeline: { flags: [], runId, wroteStage: "key_query" } });
  }
  async saveSolution(id: string, s: { sections: { kind: SectionKind; md: string }[]; evelynAnswer: string; pipeline: PipelineDoc; runId: string }, e: Expect) {
    const i = this.unchanged(id, e);
    this.itemWrites++;
    const version = (i.version || 0) + 1;
    this.solutions.push({ itemId: id, version, sections: s.sections, runId: s.runId });
    Object.assign(i, { version, stage: "ready", evelynAnswer: s.evelynAnswer, pipeline: s.pipeline, updatedAt: new Date(i.updatedAt.getTime() + 1) });
    return version;
  }
  async setPipeline(id: string, pipeline: PipelineDoc, e: Expect) {
    const i = this.unchanged(id, e);
    this.itemWrites++;
    i.pipeline = pipeline;
  }
  async suggest(kind: string, itemIds: string[]) { this.suggestions.push(`${kind}:${itemIds.join(",")}`); }
  async saveLesson(_l: LessonDoc) { /* not used here */ }
  async sample(batchIds: string[], unbatched: string[]) { this.sampled.push({ batchIds, unbatched }); }
}

// --- the fake vendors ----------------------------------------------------------------------------------------

type RoleName = "intake" | "solver" | "author" | "working" | "audit";
type Ask = { vendor: "anthropic" | "openai" | "deepseek" | "gemini"; role: RoleName; itemId: string; system: string; user: string; via: "live" | "batch" };

const DIPLOMA = "Fix R first; $\\dfrac{6!}{3!\\,2!} = 60$. Sixty arrangements begin with R. So the answer is A.";
const DRAFT = (tag = "") => ({
  topic: "Permutations with repeated letters",
  sections: [
    { kind: "short", md: "Sixty arrangements of RED DEER begin with R. So the answer is A." },
    { kind: "diploma", md: tag ? DIPLOMA.replace("Sixty arrangements begin with R.", `Sixty arrangements begin with R, ${tag}.`) : DIPLOMA },
    { kind: "errors", md: "- Dividing by $2!$ for the R's. Only one R is left, so divide only for E and D." },
  ],
  statedAnswer: { kind: "choice", letters: ["A"], value: "", values: [] },
  calc: [],
});
const SOLVE = (letter: string) => ({ answer: { kind: "choice", letters: [letter], value: "", values: [], responses: [] }, working: `Counted the arrangements: ${letter}.`, confidence: "high" });
const WORKING_OK = { sections: ["short", "diploma", "errors"].map((kind) => ({ kind, follows: true, firstBadLine: "", why: "" })), alternateEndsAtAgreedAnswer: "no_alternate", answerIsWrong: false, answerWhy: "" };
const WORKING_BAD = { ...WORKING_OK, sections: WORKING_OK.sections.map((s) => (s.kind === "diploma" ? { ...s, follows: false, firstBadLine: "Sixty arrangements begin with R.", why: "The count is asserted before it is derived." } : s)) };
const AUDIT_OK = { verdicts: RULES.map((r) => ({ id: r.id, verdict: "pass", quote: "", why: "" })) };

/** What every "model" answers. The same function serves the live endpoints and the batches, so a bulk run and a live run see the same replies. */
type Brain = (a: Ask) => unknown | { refuse: string } | { raw: string };
const brain: Brain = (a) => {
  if (a.role === "intake") return { complete: true, missing: [] };
  if (a.role === "solver") {
    // 102: the two solvers disagree; the third (DeepSeek) sides with solver 1 and the key.
    if (a.itemId === "102" && a.vendor === "openai") return SOLVE("B");
    return SOLVE("A");
  }
  if (a.role === "author") return a.user.includes("<findings>") ? DRAFT("as derived above") : DRAFT();
  if (a.role === "working") return a.itemId === "103" && !a.user.includes("as derived above") ? WORKING_BAD : WORKING_OK;
  return AUDIT_OK;
};

const roleOf = (system: string): RoleName =>
  system.startsWith("You are solving one exam question") ? "solver"
  : system.includes("writing a worked solution") ? "author"
  : system.startsWith("You are checking another writer's worked solution") ? "working"
  : system.startsWith("You are auditing one worked solution") ? "audit"
  : "intake";
const itemOf = (user: string) => /Item (\d+)\./.exec(user)?.[1] ?? "?";
const A_USAGE = { input_tokens: 1000, output_tokens: 500 };
const O_USAGE = { prompt_tokens: 2000, completion_tokens: 300 };

type FakeBatch = { id: string; vendor: "anthropic" | "openai"; requests: { custom_id: string; body: any }[]; state: "running" | "done" | "expired"; createdAt: number };

class Vendors {
  batches: FakeBatch[] = [];
  asks: Ask[] = [];
  /** A batch request for which this returns a string comes back errored (that string) instead of answered. */
  errorFor: (a: Ask) => string | null = () => null;
  /** HTTP status every new batch submission gets (default: accepted). */
  refuseSubmit: number | null = null;
  files = new Map<string, string>();
  constructor(private think: Brain = brain) {}

  live = (vendor: Ask["vendor"]) => this.asks.filter((a) => a.via === "live" && a.vendor === vendor);
  running = () => this.batches.filter((b) => b.state === "running");
  finishAll(state: FakeBatch["state"] = "done") { for (const b of this.running()) b.state = state; }

  private anthropicAsk(body: any, via: Ask["via"]): Ask {
    const system = typeof body.system === "string" ? body.system : (body.system as { text: string }[]).map((p) => p.text).join("\n\n");
    const user = (body.messages[0].content as { type: string; text?: string }[]).filter((b) => b.type === "text").map((b) => b.text).join("");
    return { vendor: "anthropic", role: roleOf(system), itemId: itemOf(user), system, user, via };
  }
  private openaiAsk(body: any, via: Ask["via"], vendor: "openai" | "deepseek" = "openai"): Ask {
    const system = String(body.messages[0].content);
    const u = body.messages[1].content;
    const user = typeof u === "string" ? u : (u as { type: string; text?: string }[]).filter((p) => p.type === "text").map((p) => p.text).join("");
    return { vendor, role: roleOf(system), itemId: itemOf(user), system, user, via };
  }
  private anthropicMessage(a: Ask) {
    this.asks.push(a);
    const r = this.think(a) as { refuse?: string; raw?: string };
    const base = { id: "msg_1", type: "message", role: "assistant", model: MODEL_FOR.solver1.model, stop_sequence: null, usage: A_USAGE };
    if (r && typeof r === "object" && typeof r.refuse === "string") return { ...base, content: [], stop_reason: "refusal", stop_details: { type: "refusal", category: r.refuse, explanation: "declined" } };
    return { ...base, content: [{ type: "text", text: r && typeof r.raw === "string" ? r.raw : JSON.stringify(r) }], stop_reason: "end_turn" };
  }
  private openaiCompletion(a: Ask) {
    this.asks.push(a);
    const r = this.think(a) as { raw?: string };
    const content = r && typeof r.raw === "string" ? r.raw : JSON.stringify(r);
    return { id: "c1", object: "chat.completion", created: 1, model: a.vendor === "deepseek" ? MODEL_FOR.solver3Text.model : MODEL_FOR.solver2.model, choices: [{ index: 0, message: { role: "assistant", content }, finish_reason: "stop" }], usage: O_USAGE };
  }

  fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    const method = (init?.method ?? "GET").toUpperCase();
    const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
    const text = (body: string) => new Response(body, { status: 200, headers: { "content-type": "application/binary" } });
    const p = url.pathname;

    if (url.host.includes("generativelanguage")) {
      const body = JSON.parse(String(init?.body));
      const user = (body.contents[0].parts as { text?: string }[]).map((x) => x.text ?? "").join("");
      const a: Ask = { vendor: "gemini", role: "intake", itemId: itemOf(user), system: body.systemInstruction.parts[0].text, user, via: "live" };
      this.asks.push(a);
      return json({ candidates: [{ content: { role: "model", parts: [{ text: JSON.stringify(this.think(a)) }] }, finishReason: "STOP" }], usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 20, thoughtsTokenCount: 30 }, modelVersion: MODEL_FOR.intake.model });
    }
    if (url.host.includes("deepseek")) return json(this.openaiCompletion(this.openaiAsk(JSON.parse(String(init?.body)), "live", "deepseek")));

    if (url.host.includes("anthropic")) {
      if (method === "POST" && p === "/v1/messages") return json(this.anthropicMessage(this.anthropicAsk(JSON.parse(String(init?.body)), "live")));
      if (method === "POST" && p === "/v1/messages/batches") {
        if (this.refuseSubmit) return json({ type: "error", error: { type: "invalid_request_error", message: "batch refused" } }, this.refuseSubmit);
        const body = JSON.parse(String(init?.body));
        const b: FakeBatch = { id: `msgbatch_${this.batches.length + 1}`, vendor: "anthropic", requests: body.requests.map((r: any) => ({ custom_id: r.custom_id, body: r.params })), state: "running", createdAt: Date.now() };
        this.batches.push(b);
        return json(this.anthropicBatch(b));
      }
      const m = /^\/v1\/messages\/batches\/([^/]+)(\/results)?$/.exec(p);
      const b = m && this.batches.find((x) => x.id === m[1]);
      if (!m || !b) return json({ type: "error", error: { type: "not_found_error", message: "no such batch" } }, 404);
      if (!m[2]) return json(this.anthropicBatch(b));
      return text(b.requests.map((r) => {
        const a = this.anthropicAsk(r.body, "batch");
        const err = this.errorFor(a);
        const result = b.state === "expired" ? { type: "expired" }
          : err ? { type: "errored", error: { type: "error", error: { type: "api_error", message: err } } }
          : { type: "succeeded", message: this.anthropicMessage(a) };
        return JSON.stringify({ custom_id: r.custom_id, result });
      }).reverse().join("\n") + "\n");
    }

    if (url.host.includes("openai")) {
      if (method === "POST" && p === "/v1/chat/completions") return json(this.openaiCompletion(this.openaiAsk(JSON.parse(String(init?.body)), "live")));
      if (method === "POST" && p === "/v1/files") {
        const id = `file-in-${this.files.size + 1}`;
        this.files.set(id, await uploadText(init));
        return json({ id, object: "file", purpose: "batch", filename: "keystone-bulk.jsonl", bytes: 1, created_at: 1, status: "processed" });
      }
      if (method === "POST" && p === "/v1/batches") {
        if (this.refuseSubmit) return json({ error: { message: "batch refused", type: "invalid_request_error" } }, this.refuseSubmit);
        const body = JSON.parse(String(init?.body));
        equal(body.endpoint, "/v1/chat/completions", "openai batch endpoint");
        equal(body.completion_window, "24h", "openai completion window");
        const lines = (this.files.get(body.input_file_id) ?? "").split("\n").filter(Boolean).map((l) => JSON.parse(l));
        for (const l of lines) { equal(l.method, "POST", "line method"); equal(l.url, "/v1/chat/completions", "line url"); }
        const b: FakeBatch = { id: `batch_${this.batches.length + 1}`, vendor: "openai", requests: lines.map((l) => ({ custom_id: l.custom_id, body: l.body })), state: "running", createdAt: Date.now() };
        this.batches.push(b);
        return json(this.openaiBatch(b));
      }
      const m = /^\/v1\/batches\/([^/]+)$/.exec(p);
      if (m) {
        const b = this.batches.find((x) => x.id === m[1]);
        return b ? json(this.openaiBatch(b)) : json({ error: { message: "no such batch" } }, 404);
      }
      const f = /^\/v1\/files\/([^/]+)\/content$/.exec(p);
      if (f) {
        const [kind, id] = f[1].split("--");
        const b = this.batches.find((x) => x.id === id)!;
        const out: string[] = [];
        for (const r of b.requests) {
          const a = this.openaiAsk(r.body, "batch");
          const err = b.state === "expired" ? "expired" : this.errorFor(a);
          if (kind === "out" && !err) out.push(JSON.stringify({ id: "br_1", custom_id: r.custom_id, response: { status_code: 200, request_id: "r", body: this.openaiCompletion(a) }, error: null }));
          if (kind === "err" && err) out.push(JSON.stringify({ id: "br_2", custom_id: r.custom_id, response: null, error: b.state === "expired" ? { code: "batch_expired", message: "This request could not be executed before the completion window expired." } : { code: "server_error", message: err } }));
        }
        return text(out.reverse().join("\n") + (out.length ? "\n" : ""));
      }
    }
    throw new Error(`unexpected request ${method} ${url.href}`);
  }) as typeof fetch;

  private anthropicBatch(b: FakeBatch) {
    const n = b.requests.length;
    const over = b.state !== "running";
    return {
      id: b.id, type: "message_batch", processing_status: over ? "ended" : "in_progress",
      request_counts: { processing: over ? 0 : n, succeeded: b.state === "done" ? n : 0, errored: 0, canceled: 0, expired: b.state === "expired" ? n : 0 },
      ended_at: over ? new Date(b.createdAt + 60_000).toISOString() : null, created_at: new Date(b.createdAt).toISOString(), expires_at: new Date(b.createdAt + 86_400_000).toISOString(),
      cancel_initiated_at: null, archived_at: null, results_url: over ? `https://api.anthropic.com/v1/messages/batches/${b.id}/results` : null,
    };
  }
  private openaiBatch(b: FakeBatch) {
    const n = b.requests.length;
    return {
      id: b.id, object: "batch", endpoint: "/v1/chat/completions", errors: null, input_file_id: "file-in", completion_window: "24h",
      status: b.state === "running" ? "in_progress" : b.state === "expired" ? "expired" : "completed",
      output_file_id: b.state === "done" ? `out--${b.id}` : null, error_file_id: b.state === "running" ? null : `err--${b.id}`,
      created_at: Math.floor(b.createdAt / 1000), completed_at: b.state === "done" ? Math.floor(b.createdAt / 1000) + 60 : null, expired_at: b.state === "expired" ? Math.floor(b.createdAt / 1000) + 86400 : null,
      request_counts: { total: n, completed: b.state === "done" ? n : 0, failed: 0 },
    };
  }
}

/** The JSONL an OpenAI file upload carries (multipart body, as the SDK sends it). */
async function uploadText(init?: RequestInit): Promise<string> {
  const body = init?.body as unknown;
  let raw: string;
  if (body instanceof FormData) return await (body.get("file") as File).text();
  if (typeof body === "string") raw = body;
  else {
    const chunks: Buffer[] = [];
    for await (const c of body as AsyncIterable<Uint8Array | string>) chunks.push(Buffer.from(c));
    raw = Buffer.concat(chunks).toString("utf8");
  }
  const lines = raw.split(/\r?\n/).filter((l) => l.startsWith('{"custom_id"'));
  ok(lines.length > 0, "the upload carries JSONL lines");
  return lines.join("\n");
}

// --- harness ---------------------------------------------------------------------------------------------------

const dir = mkdtempSync(path.join(tmpdir(), "keystone-bulk-test-"));
let nFile = 0;
const stateFile = () => path.join(dir, `state-${++nFile}.json`);

function world(items: ItemDoc[], think?: Brain) {
  const store = new FakeStore(items);
  const vendors = new Vendors(think);
  const file = stateFile();
  const logs: string[] = [];
  const env = (bulk: BulkStore, writer: () => Writer = () => store) => ({
    reader: store, makeRealWriter: writer,
    deps: { rules: RULES, images: async () => [], assetExists: () => true },
    makeSteps: (md: Parameters<typeof realSteps>[0]) => realSteps(md),
    store: bulk, modelDeps: { fetch: vendors.fetch, backoffMs: 0 }, log: (l: string) => { logs.push(l); },
  });
  /** One invocation, with the state read from the file again each time (as a new process would). */
  const invoke = (opts: Partial<Parameters<typeof runBulk>[0]> = {}) => runBulk({ dryRun: false, ...opts }, env(fileBulkStore(file)));
  const state = () => JSON.parse(readFileSync(file, "utf8")) as { jobs: any[]; calls: any[]; runs: any[]; actions: any[] };
  return { store, vendors, file, logs, env, invoke, state };
}

/** Invokes until every item is done (finishing every batch in between), at most `max` times. */
async function drive(w: ReturnType<typeof world>, max = 12): Promise<BulkReport[]> {
  const reports: BulkReport[] = [];
  for (let i = 0; i < max; i++) {
    const r = await w.invoke();
    reports.push(r);
    if (r.items.every((x) => x.state === "done") && !r.submitted.length) return reports;
    w.vendors.finishAll();
  }
  throw new Error(`not finished after ${max} invocations`);
}

const lineOf = (r: BulkReport, id: string) => r.items.find((x) => x.itemId === id)!;
const stepKeys = (run: RunDoc) => run.steps.map((s) => `${s.key}:${s.ok ? "ok" : "no"}`);

(async () => {
  // --- small parts ---
  {
    equal(waveOf("solver1", []), 1, "solvers are wave 1");
    equal(waveOf("author", [{ step: "solve" }]), 2, "the first write is wave 2");
    equal(waveOf("working", [{ step: "solve" }, { step: "write" }]), 3, "the checks of the first draft are wave 3");
    equal(waveOf("author", [{ step: "solve" }, { step: "write" }, { step: "calc" }, { step: "working" }]), 4, "the correction is wave 4");
    equal(waveOf("audit", [{ step: "write" }, { step: "write" }]), 4, "the re-check is wave 4");
    equal(waveOf("audit", []), 0, "the cause of a send-back comes before everything");
    near(costOf(MODEL_FOR.author, 1000, 500, undefined, {}, { batch: true }), costOf(MODEL_FOR.author, 1000, 500) * BATCH_RATE, "batch price is the batch rate of the list price");
    near(costOf(MODEL_FOR.author, 1000, 500, undefined, { write: 400, read: 200 }, { batch: true }), costOf(MODEL_FOR.author, 1000, 500, undefined, { write: 400, read: 200 }) / 2, "the cache multipliers stack with it");
    equal(BATCH_RATE, 0.5, "half price");
    deepEqual([...consumedIds({ steps: [{ step: "solve", key: "solve#0", at: T0, ok: true, output: 1, cost: 0, batch: { ids: ["a", "b"], calls: 2, live: 0, saved: 0 } }] })], ["a", "b"], "consumed ids come off the steps");
    // the command line
    ok(parseArgs(["--bulk"]).bulk === true, "--bulk");
    assert.throws(() => parseArgs(["--batch"]), /--bulk/, "--batch without a batch id points at --bulk");
    assert.throws(() => parseArgs(["--batch", "--dry-run"]), /--bulk/, "--batch never swallows an option");
    equal(parseArgs(["--batch", "b7", "--bulk"]).batch, "b7", "--batch <id> is still the client's batch");
    assert.throws(() => parseArgs(["--bulk", "--dry-run"]), /--state/, "a dry bulk run needs a state file");
    assert.throws(() => parseArgs(["--state", "x.json", "--bulk"]), /--dry-run/, "--state is for the dry run");
    assert.throws(() => parseArgs(["--bulk", "--run-id", "r1"]), /--run-id/, "no --run-id in bulk mode");
    equal(parseArgs(["--bulk", "--dry-run", "--state", "s.json", "--only", "1,2", "--as-received"]).state, "s.json", "the trial's command line parses");
  }

  // --- the four waves: clean item, a disagreement, a failed check with its one correction, an errored batch result ---
  const reference = new Map<string, { result?: string; flags: string[]; steps: string[]; answer: string; sections: unknown; cost: number; corrections: number }>();
  {
    const ids = ["101", "102", "103", "104"];
    // The live run of the same items with the same replies: what bulk mode has to equal.
    {
      const store = new FakeStore(ids.map((id) => item(id)));
      const vendors = new Vendors();
      const out = await runPipeline({ dryRun: false }, { reader: store, makeRealWriter: () => store, deps: { steps: realSteps({ fetch: vendors.fetch, backoffMs: 0 }), rules: RULES, images: async () => [], assetExists: () => true }, log: () => {} });
      for (const r of out.runs) {
        reference.set(r.itemId, { result: r.result, flags: r.flags, steps: stepKeys(r), answer: store.items.get(r.itemId)!.evelynAnswer, sections: store.solutions.find((s) => s.itemId === r.itemId)?.sections, cost: r.cost, corrections: r.corrections });
      }
      deepEqual(ids.map((id) => [reference.get(id)!.result, reference.get(id)!.flags.join()]), [["ready", ""], ["held", "solvers_split"], ["ready", ""], ["ready", ""]], "the live reference run (the split item is settled by the third solver and held for the owner)");
      equal(reference.get("103")!.corrections, 1, "live: 103 takes its one correction");
      equal(vendors.batches.length, 0, "a live run submits no batch");
    }

    const w = world(ids.map((id) => item(id)));
    w.vendors.errorFor = (a) => (a.itemId === "104" && a.role === "author" ? "overloaded" : null);

    // 1: intake live, then the two blind solves go out, one batch per vendor
    let r = await w.invoke();
    equal(w.vendors.live("gemini").length, 4, "intake is a live call for each item");
    equal(r.submitted.length, 2, "one batch per vendor");
    deepEqual(r.submitted.map((j) => [j.vendor, j.customIds.length, j.waves, j.itemIds]), [["anthropic", 4, [1], ids], ["openai", 4, [1], ids]], "wave 1: four solves each");
    ok(r.submitted.every((j) => j.status === "submitted" && j.vendorBatchId && j.submittedAt instanceof Date), "jobs carry the vendor batch id and the time");
    ok(r.items.every((i) => i.state === "waiting" && i.waves.join() === "1"), "every item waits on wave 1");
    equal(w.store.itemWrites, 0, "nothing is written to an item while it waits");
    ok([...w.store.runs.values()].every((x) => !x.result && !x.finishedAt && x.waitingOnBatch instanceof Date), "the runs are saved unfinished, marked as waiting on a batch");
    ok(/^ks-[0-9a-f]{48}-0$/.test(r.submitted[0].customIds[0]), `custom id shape: ${r.submitted[0].customIds[0]}`);
    equal(new Set(w.state().calls.map((c) => c.customId)).size, 8, "eight requests, eight ids");
    {
      const sent = w.vendors.batches[0].requests[0].body;
      equal(sent.fallbacks, undefined, "a batch request carries no fallbacks");
      equal(sent.betas, undefined, "nor betas");
      equal(sent.output_config.effort, "high", "the same effort as live");
      ok(sent.output_config.format.schema && sent.model === MODEL_FOR.solver1.model, "the same schema and model as live");
    }

    // again with nothing finished: nothing is submitted, nothing changes
    const before = readFileSync(w.file, "utf8");
    const asksBefore = w.vendors.asks.length;
    r = await w.invoke();
    equal(r.submitted.length, 0, "nothing finished: nothing submitted");
    equal(r.pending.length, 2, "both batches reported as still out");
    equal(w.vendors.batches.length, 2, "no duplicate submission");
    equal(w.vendors.asks.length, asksBefore, "no model call either (intake is on the record)");
    equal(readFileSync(w.file, "utf8"), before, "the state did not change");
    ok(bulkReportLines(r).some((l) => /msgbatch_1 .* submitted \d+ min ago/.test(l)), `pending line with vendor id and age: ${bulkReportLines(r).join(" | ")}`);

    // only one vendor back: nothing is run for an item until all its requests are back (no live call is thrown away)
    w.vendors.batches[0].state = "done";
    r = await w.invoke();
    equal(r.collected.length, 1, "the Anthropic batch is collected");
    equal(r.submitted.length, 0, "still waiting on OpenAI: nothing new");
    equal(w.vendors.live("deepseek").length, 0, "no third solver yet");

    // 2: solves back → key compare in code, third solver live for the split, the write goes out
    w.vendors.finishAll();
    r = await w.invoke();
    equal(w.vendors.live("deepseek").length, 1, "the third solver is one live call, for the one split item");
    equal(w.vendors.live("deepseek")[0].itemId, "102", "…item 102");
    deepEqual(r.submitted.map((j) => [j.vendor, j.customIds.length, j.waves]), [["anthropic", 4, [2]]], "wave 2: four writes in one Anthropic batch");

    // 3: the write back (104's errored → one live call); working check + audit go out together
    w.vendors.finishAll();
    r = await w.invoke();
    deepEqual(r.collected[0].counts, { succeeded: 3, errored: 1 }, "three writes back, one errored");
    deepEqual(w.vendors.live("anthropic").map((a) => [a.itemId, a.role]), [["104", "author"]], "104's write is made as one live call");
    deepEqual(r.fellBack.map((f) => [f.itemId, f.role]), [["104", "author"]], "…and reported");
    ok(/errored: api_error: overloaded/.test(r.fellBack[0].why), `with the reason: ${r.fellBack[0].why}`);
    deepEqual(r.submitted.map((j) => [j.vendor, j.customIds.length, j.waves]), [["openai", 8, [3]]], "wave 3: working check and audit for each of the four, one OpenAI batch");

    // a stop right here, then the same invocation again: the live fallback is not made twice
    r = await w.invoke();
    equal(w.vendors.live("anthropic").length, 1, "the live call's reply is kept: never made again");

    // 4: checks back → three items done; 103's working check failed → its one correction goes out
    w.vendors.finishAll();
    r = await w.invoke();
    deepEqual(["101", "102", "104"].map((id) => lineOf(r, id).result), ["ready", "held", "ready"], "three items reach their result (the split one held, as live)");
    deepEqual(r.submitted.map((j) => [j.vendor, j.customIds.length, j.waves, j.itemIds]), [["anthropic", 1, [4], ["103"]]], "wave 4: the correction of 103");
    deepEqual(w.store.sampled, [{ batchIds: ["b1"], unbatched: [] }], "the sample step ran for the items that finished");
    equal(w.store.items.get("103")!.stage, "received", "103 is still Received: not ready before its batch is back");

    // 5 and 6: the corrected draft's re-check, then done
    w.vendors.finishAll();
    r = await w.invoke();
    deepEqual(r.submitted.map((j) => [j.vendor, j.customIds.length, j.waves]), [["openai", 2, [4]]], "the re-check of the corrected draft (working + audit)");
    w.vendors.finishAll();
    r = await w.invoke();
    equal(lineOf(r, "103").result, "ready", "103 ready after its one correction");
    equal(r.submitted.length + r.pending.length, 0, "nothing left out");
    ok(bulkReportLines(r).some((l) => l === "every selected item is finished"), "the report says so");
    r = await w.invoke();
    deepEqual([r.items.length, r.submitted.length, r.runs.length], [0, 0, 0], "a further invocation finds nothing to do");

    // the same decisions as the live run, item by item
    const runs = new Map([...w.store.runs.values()].map((x) => [x.itemId, x]));
    for (const id of ids) {
      const ref = reference.get(id)!;
      const run = runs.get(id)!;
      equal(run.result, ref.result, `${id}: same result as live`);
      deepEqual(run.flags, ref.flags, `${id}: same flags as live`);
      deepEqual(stepKeys(run), ref.steps, `${id}: the same steps in the same order as live`);
      equal(run.corrections, ref.corrections, `${id}: same corrections`);
      equal(w.store.items.get(id)!.evelynAnswer, ref.answer, `${id}: same answer`);
      deepEqual(w.store.solutions.find((s) => s.itemId === id)?.sections, ref.sections, `${id}: the same solution text`);
      equal(run.waitingOnBatch, undefined, `${id}: no longer marked as waiting`);
      const pl = w.store.items.get(id)!.pipeline!;
      equal(pl.releaseAt instanceof Date, ref.result === "ready", `${id}: a release time exactly when it passed clean`);
      equal(pl.heldFor, ref.result === "held" ? "praveen" : undefined, `${id}: held for the owner exactly when live holds it`);
      if (pl.releaseAt) ok(pl.releaseAt.getTime() >= pl.passedAt!.getTime() && pl.passedAt!.getTime() >= w.store.runs.get(`${id}|${run.runId}`)!.startedAt.getTime(), `${id}: the release time counts from when it passed (after the batches came back), never earlier`);
    }

    // cost: batch replies at half price, marked on the step; live calls at the list price
    const a = costOf(MODEL_FOR.author, A_USAGE.input_tokens, A_USAGE.output_tokens);
    const o = costOf(MODEL_FOR.working, O_USAGE.prompt_tokens, O_USAGE.completion_tokens);
    const step = (id: string, key: string) => runs.get(id)!.steps.find((s) => s.key === key)!;
    near(step("101", "write#0").cost, a / 2, "a batch write costs half");
    deepEqual({ ...step("101", "write#0").batch, ids: 1 }, { ids: 1, calls: 1, live: 0, saved: a / 2 }, "…and the step says it came from a batch and what that saved");
    near(step("101", "solve#0").cost, (a + o) / 2, "both solves at half price");
    equal(step("101", "solve#0").batch!.calls, 2, "two batch calls on the solve step");
    near(step("104", "write#0").cost, a, "the live fallback write costs the list price");
    deepEqual({ ...step("104", "write#0").batch, ids: 1 }, { ids: 1, calls: 0, live: 1, saved: 0 }, "…and is marked as a live call");
    equal(step("101", "intake#0").batch, undefined, "a step with no batch call carries no mark");
    near(step("102", "solve#0").cost, (a + o) / 2 + costOf(MODEL_FOR.solver3Text, O_USAGE.prompt_tokens, O_USAGE.completion_tokens), "the split item: two batch solves and one live third solver");
    for (const id of ["101", "102"]) {
      const run = runs.get(id)!;
      const saved = run.steps.reduce((s, x) => s + (x.batch?.saved ?? 0), 0);
      near(run.cost + saved, reference.get(id)!.cost, `${id}: batch cost plus what it saved is the live cost`);
      ok(run.cost < reference.get(id)!.cost * 0.6, `${id}: about half the live price (${run.cost} vs ${reference.get(id)!.cost})`);
    }
    // 103: the audit sent along with the failed working check was not used: paid, reported, never on a step
    const st = w.state();
    const used = consumedIds(runs.get("103")!);
    const unused = st.calls.filter((c) => c.itemId === "103" && !used.has(c.customId));
    deepEqual(unused.map((c) => [c.role, c.state, c.wave]), [["audit", "succeeded", 3]], "103: one audit reply unused (its draft was corrected)");
    equal(st.calls.filter((c) => c.state === "pending").length, 0, "no request left pending");
    ok(st.jobs.every((j) => ["ended"].includes(j.status) && j.finishedAt && j.collectedAt && j.customIds.length), "every job is closed, with its times and ids");
  }

  // --- an expired batch: its requests are made live, the item still gets its decision ---
  {
    const w = world([item("201")]);
    await w.invoke();
    w.vendors.batches.find((b) => b.vendor === "anthropic")!.state = "done";
    w.vendors.batches.find((b) => b.vendor === "openai")!.state = "expired";
    const r = await w.invoke();
    deepEqual(r.collected.map((c) => [c.job.vendor, c.job.status, c.counts]).sort(), [["anthropic", "ended", { succeeded: 1 }], ["openai", "expired", { expired: 1 }]], "one ended, one expired");
    deepEqual(w.vendors.live("openai").map((a) => a.role), ["solver"], "the expired solve is made as a live call");
    ok(/expired/.test(r.fellBack[0].why), "reported as expired");
    const reports = await drive(w);
    equal(lineOf(reports[reports.length - 1], "201").result ?? [...w.store.runs.values()][0].result, "ready", "the item finishes");
    equal([...w.store.runs.values()][0].result, "ready", "ready");
    equal(w.vendors.live("openai").length, 1, "one live call in all");
    // the Anthropic side expired too, in a later wave
    const w2 = world([item("202")]);
    await w2.invoke();
    w2.vendors.finishAll();
    await w2.invoke(); // write out
    w2.vendors.finishAll("expired");
    const r2 = await w2.invoke();
    deepEqual(r2.collected.map((c) => [c.job.vendor, c.job.status, c.counts]), [["anthropic", "expired", { expired: 1 }]], "the write batch expired");
    deepEqual(w2.vendors.live("anthropic").map((a) => a.role), ["author"], "the write is made live");
    await drive(w2);
    equal([...w2.store.runs.values()][0].result, "ready", "and the item finishes");
  }

  // --- a refusal in a batch (no fallback there): one live call, which has the fallback ---
  {
    const think: Brain = (a) => (a.role === "solver" && a.vendor === "anthropic" && a.via === "batch" ? { refuse: "bio" } : brain(a));
    const w = world([item("301")], think);
    await w.invoke();
    w.vendors.finishAll();
    const r = await w.invoke();
    deepEqual(w.vendors.live("anthropic").map((a) => a.role), ["solver"], "the refused solve is made as a live call");
    ok(/refused in the batch \(bio/.test(r.fellBack[0].why), `why: ${r.fellBack[0].why}`);
    await drive(w);
    const run = [...w.store.runs.values()][0];
    equal(run.result, "ready", "the item finishes");
    const solve = run.steps.find((s) => s.key === "solve#0")!;
    const a = costOf(MODEL_FOR.author, A_USAGE.input_tokens, A_USAGE.output_tokens);
    const o = costOf(MODEL_FOR.working, O_USAGE.prompt_tokens, O_USAGE.completion_tokens);
    near(solve.cost, a / 2 + a + o / 2, "the refused batch call (billed at the batch rate), the live call, and the other solver's batch call");
    deepEqual([solve.batch!.calls, solve.batch!.live], [1, 1], "one from the batch, one live");
  }

  // --- a reply that came back but does not fit: treated as the live run treats it (the step fails, the item is held) ---
  {
    const think: Brain = (a) => (a.role === "author" ? { raw: "Here is the solution: it is A." } : brain(a));
    const live = new FakeStore([item("401")]);
    const lv = new Vendors(think);
    const ref = (await runPipeline({ dryRun: false }, { reader: live, makeRealWriter: () => live, deps: { steps: realSteps({ fetch: lv.fetch, backoffMs: 0 }), rules: RULES, images: async () => [], assetExists: () => true }, log: () => {} })).runs[0];
    const w = world([item("401")], think);
    await drive(w);
    const run = [...w.store.runs.values()][0];
    deepEqual([run.result, run.flags], [ref.result, ref.flags], "the same hold as live");
    deepEqual([run.result, run.flags], ["held", ["step_failed"]], "held, step_failed");
    equal(w.vendors.live("anthropic").length, 0, "no live retry of a reply that did come back");
    equal(w.store.items.get("401")!.pipeline?.heldFor, "praveen", "in the owner's queue");
  }

  // --- a submission that was never confirmed: marked lost, never sent twice; and a refused submission ---
  {
    const w = world([item("501")]);
    await w.invoke();
    const st = w.state();
    const j = st.jobs.find((x) => x.vendor === "anthropic");
    j.status = "submitting";
    delete j.vendorBatchId;
    writeFileSync(w.file, JSON.stringify(st));
    w.vendors.finishAll();
    const r = await w.invoke();
    ok(r.collected.some((c) => c.job.status === "lost"), "the unconfirmed job is marked lost");
    equal(w.vendors.batches.filter((b) => b.vendor === "anthropic").length, 2, "its requests are not submitted again (the second Anthropic batch is the write)");
    deepEqual(w.vendors.live("anthropic").map((a) => a.role), ["solver"], "the lost solve is made as a live call");
    await drive(w);
    equal([...w.store.runs.values()][0].result, "ready", "the item finishes");

    const w2 = world([item("502")]);
    w2.vendors.refuseSubmit = 400;
    let r2 = await w2.invoke();
    equal(r2.submitted.length, 0, "refused: nothing is out");
    ok(w2.logs.some((l) => /could not be submitted/.test(l)), "said loudly");
    deepEqual(w2.state().jobs.map((x) => x.status), ["failed", "failed"], "both jobs recorded as failed");
    w2.vendors.refuseSubmit = null;
    r2 = await w2.invoke();
    deepEqual([w2.vendors.live("anthropic").length, w2.vendors.live("openai").length], [1, 1], "the two solves are made as live calls at the next invocation");
    await drive(w2);
    equal([...w2.store.runs.values()][0].result, "ready", "the item finishes");
  }

  // --- a batch the vendor no longer knows: given up, live ---
  {
    const w = world([item("601")]);
    await w.invoke();
    w.vendors.batches.splice(0, 1); // the Anthropic batch vanishes: 404
    w.vendors.finishAll();
    const r = await w.invoke();
    ok(r.collected.some((c) => c.job.status === "lost" && /no longer knows/.test(c.job.detail ?? "")), "a 404 gives the job up");
    equal(w.vendors.live("anthropic").length, 1, "live instead");
  }

  // --- the spend cap: once reached nothing new is sent; the item waits, it is not dropped ---
  {
    const w = world([item("701")]);
    await w.invoke({ maxCost: 0.000001 });
    w.vendors.finishAll();
    const r = await w.invoke({ maxCost: 0.000001 });
    deepEqual([lineOf(r, "701").state, r.submitted.length], ["stalled", 0], "over the cap: the write is not sent");
    ok(w.logs.some((l) => /spend cap/.test(l)), "said loudly");
    equal([...w.store.runs.values()][0].steps.some((s) => s.key === "solve#0"), true, "what was already paid for is used and recorded");
    await drive(w);
    equal([...w.store.runs.values()][0].result, "ready", "with the cap lifted it continues from there");
  }

  // --- a run never sends without end: past the bound the call is made live ---
  {
    const w = world([item("951")]);
    await w.invoke();
    w.vendors.finishAll();
    // 30 requests already on this run's record (as if its requests had not been recognised again and again)
    const st = w.state();
    const one = st.calls[0];
    for (let i = 0; i < MAX_REQUESTS_PER_RUN; i++) st.calls.push({ ...one, customId: `ks-filler-${i}`, hash: `filler-${i}`, state: "succeeded", jobId: "old", reply: { text: "{}", tokensIn: 1, tokensOut: 1 } });
    writeFileSync(w.file, JSON.stringify(st));
    const r = await w.invoke();
    equal(r.submitted.length, 0, "past the bound nothing more is submitted");
    deepEqual(w.vendors.live("anthropic").map((a) => a.role), ["author"], "the write is made as a live call instead");
    ok(/more than 30 batch requests/.test(r.fellBack[0].why), "and reported with the reason");
  }

  // --- more than one batch carries: the wave is split, every request still goes out exactly once ---
  {
    const w = world(["901", "902", "903"].map((id) => item(id)));
    const r = await runBulk({ dryRun: false }, { ...w.env(fileBulkStore(w.file)), limits: { requests: 2, bytes: 1e9 } });
    deepEqual(r.submitted.map((j) => [j.vendor, j.customIds.length]), [["anthropic", 2], ["anthropic", 1], ["openai", 2], ["openai", 1]], "three requests per vendor, two to a batch");
    equal(new Set(r.submitted.flatMap((j) => j.customIds)).size, 6, "each request in exactly one batch");
    await drive(w);
    deepEqual([...w.store.runs.values()].map((x) => x.result), ["ready", "ready", "ready"], "all three finish");
  }

  // --- a dry run: no writer exists, the state is the file, and it ends with what each item would become ---
  {
    const w = world([item("801", { stage: "in_review", version: 2 })]);
    const never = () => { throw new Error("a dry run must never build the real writer"); };
    const frozen = JSON.stringify([...w.store.items.values()]);
    let last: BulkReport | undefined;
    for (let i = 0; i < 8; i++) {
      last = await runBulk({ dryRun: true, only: ["801"], asReceived: true }, w.env(fileBulkStore(w.file), never));
      if (last.items.every((x) => x.state === "done") && !last.submitted.length) break;
      w.vendors.finishAll();
    }
    equal(lineOf(last!, "801").result, "ready", "the dry run reaches its decision");
    equal(w.store.itemWrites + w.store.runs.size, 0, "nothing was written: no item, no run record");
    equal(JSON.stringify([...w.store.items.values()]), frozen, "the items are untouched");
    const act = last!.dry!.actions.find((a) => a.action === "saveSolution")!;
    equal((act.detail as { evelynAnswer: string }).evelynAnswer, "A", "the would-be solution and its answer are reported");
    const st = w.state();
    ok(st.runs.length === 1 && st.runs[0].dryRun === true && st.runs[0].result === "ready", "the run record lives in the state file, marked dry");
    ok(st.jobs.every((j) => j.dryRun) && st.calls.every((c) => c.dryRun), "jobs and requests are marked dry");
    await assert.rejects(runBulk({ dryRun: true }, { ...w.env(fileBulkStore(w.file), never), store: { ...fileBulkStore(w.file), dry: undefined } }), /state file/, "a dry bulk run without a state file is refused");
  }

  rmSync(dir, { recursive: true, force: true });
  console.log("bulk.test: ok");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
