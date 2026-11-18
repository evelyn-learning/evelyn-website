import { STAGES, answerSeenBy, releasedVersionOf, visibleStage, type Role, type Stage } from "./config";
import { ks, type ActivityDoc, type Flag, type ItemDoc, type PipelineDoc, type RunDoc, type RunStep, type SolutionDoc } from "./db";
import { FLAG_WORDS, noteText } from "./pipeline/status";
import { HELD_BEFORE_SOLUTION_FILTER, NEEDS_OWNER_FILTER, WAITING_ON_OWNER_FILTER } from "./pipeline/holds";
import { blockedBatches, type BlockedBatch } from "./pipeline/release";

export type ItemRow = Pick<
  ItemDoc,
  "itemId" | "subject" | "course" | "itemType" | "topic" | "stage" | "version" | "keySource" | "evelynAnswer" | "key" | "showcase" | "reviewNote" | "priorStatus" | "lastActivityAt" | "order" | "player" | "releasedVersion" | "releasedAnswer"
>;

const ROW_FIELDS = "itemId subject course itemType topic stage version releasedVersion releasedAnswer keySource evelynAnswer key showcase reviewNote priorStatus lastActivityAt order player.entry";

// Hidden until released: Castle Rock (reviewer, tech) never sees a solution
// version above Item.releasedVersion, and sees stage `ready` as `drafting`.
// Rows from before releasedVersion existed count as fully released.

const seesUnreleased = (role?: Role) => !role || role === "evelyn";

/** Highest version this role may see. */
export function releasedFor(item: Pick<ItemDoc, "version" | "releasedVersion">, role?: Role): number {
  return seesUnreleased(role) ? item.version || 0 : releasedVersionOf(item);
}

/**
 * The item as this role sees it: stage via visibleStage, version capped at the released one, the released
 * answer. For Castle Rock the pipeline record (flags, hold, release time, the owner's note) is removed, so no
 * page or client component built from it can pass it on.
 */
export function asSeenBy<T extends Pick<ItemDoc, "stage" | "version" | "releasedVersion" | "evelynAnswer" | "releasedAnswer">>(item: T, role?: Role): T {
  if (seesUnreleased(role)) return item;
  const { pipeline: _internal, ...rest } = item as T & { pipeline?: unknown }; // eslint-disable-line @typescript-eslint/no-unused-vars
  return { ...(rest as T), stage: visibleStage(item.stage, role!), version: releasedFor(item, role), evelynAnswer: answerSeenBy(item, role!) };
}

/** Stages a stage filter matches for this role: `drafting` includes `ready` for Castle Rock; `ready` is no filter for them. */
export function stagesFor(stage: Stage | Stage[] | undefined, role?: Role): Stage[] | undefined {
  if (!stage) return undefined;
  const list = Array.isArray(stage) ? stage : [stage];
  if (seesUnreleased(role)) return list;
  const out: Stage[] = list.filter((s) => s !== "ready");
  if (out.includes("drafting")) out.push("ready");
  return out.length ? out : undefined;
}

/** Items per stage. For reviewer/tech, `ready` is folded into `drafting` (and reads 0). */
export async function stageCounts(role?: Role): Promise<Record<Stage, number>> {
  const { Item } = await ks();
  const rows = await Item.aggregate<{ _id: Stage; n: number }>([{ $group: { _id: "$stage", n: { $sum: 1 } } }]);
  const out = Object.fromEntries(STAGES.map((s) => [s, 0])) as Record<Stage, number>;
  for (const r of rows) if (r._id in out) out[role ? visibleStage(r._id, role) : r._id] += r.n;
  return out;
}

/** `role` makes the filter and the rows read as that role sees them. */
export type ListFilter = { stage?: Stage | Stage[]; subject?: string; search?: string; role?: Role };

function listWhere(filter: ListFilter): Record<string, unknown> {
  const q: Record<string, unknown> = {};
  const stages = stagesFor(filter.stage, filter.role);
  if (stages) q.stage = stages.length === 1 ? stages[0] : { $in: stages };
  if (filter.subject) q.subject = filter.subject;
  const term = filter.search?.trim();
  if (term) {
    // Digits: item number (any part of it). Words: topic or course.
    const rx = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    q.$or = /^\d+$/.test(term) ? [{ itemId: { $regex: rx } }] : [{ topic: { $regex: rx } }, { course: { $regex: rx } }, { itemId: { $regex: rx } }];
  }
  return q;
}

export async function listItems(filter: ListFilter = {}, page?: { skip: number; limit: number }): Promise<ItemRow[]> {
  const { Item } = await ks();
  let cur = Item.find(listWhere(filter)).select(ROW_FIELDS).sort({ order: 1, itemId: 1 });
  if (page) cur = cur.skip(page.skip).limit(page.limit);
  const rows = await cur.lean<ItemRow[]>();
  return rows.map((r) => asSeenBy(r, filter.role));
}

export async function countItems(filter: ListFilter = {}): Promise<number> {
  const { Item } = await ks();
  return Item.countDocuments(listWhere(filter));
}

export async function itemExists(itemId: string): Promise<boolean> {
  const { Item } = await ks();
  return !!(await Item.exists({ itemId }));
}

/** The review queue: everything waiting for Castle Rock, in item order. */
export async function reviewQueue(): Promise<string[]> {
  const rows = await listItems({ stage: "in_review" });
  return rows.map((r) => r.itemId);
}

type OrderFilter = { stage?: Stage; subject?: string; role?: Role };

/** A stage filter as this role means it (`ready` is no filter for Castle Rock). */
const effectiveStage = (f: OrderFilter) => (f.stage === "ready" && !seesUnreleased(f.role) ? undefined : f.stage);

/** Items of a list in order; the current item is kept in place even if it has just left the list (e.g. after a verdict). */
async function listOrder(filter: OrderFilter, keep?: string) {
  const { Item } = await ks();
  const q: Record<string, unknown> = {};
  const stages = stagesFor(effectiveStage(filter), filter.role);
  if (stages) q.stage = stages.length === 1 ? stages[0] : { $in: stages };
  if (filter.subject) q.subject = filter.subject;
  const where = keep ? { $or: [q, { itemId: keep }] } : q;
  return Item.find(where).select("itemId order stage subject").sort({ order: 1, itemId: 1 }).lean();
}

const inFilter = (r: { stage?: Stage; subject?: string }, f: OrderFilter) => {
  const stage = effectiveStage(f);
  const seen = r.stage && f.role ? visibleStage(r.stage, f.role) : r.stage;
  return (!stage || seen === stage) && (!f.subject || r.subject === f.subject);
};

/**
 * Where to go after a verdict. In a filtered list: the next item still in
 * that list. Otherwise: the next item waiting for review (wrapping round).
 * Null when there is nothing further.
 */
export async function nextInQueue(itemId: string, filter: OrderFilter = {}): Promise<string | null> {
  if (effectiveStage(filter) || filter.subject) {
    const all = await listOrder(filter, itemId);
    const i = all.findIndex((r) => r.itemId === itemId);
    return all.slice(i + 1).find((r) => inFilter(r, filter))?.itemId ?? null;
  }
  const all = await listOrder({});
  const i = all.findIndex((r) => r.itemId === itemId);
  const ordered = [...all.slice(i + 1), ...all.slice(0, Math.max(i, 0))];
  return ordered.find((r) => r.stage === "in_review" && r.itemId !== itemId)?.itemId ?? null;
}

/**
 * Prev/next and position within the list being browsed (all items when no
 * filter). An item that has just left the list (approved from "In review")
 * keeps its place so prev/next still make sense; `inList` says so.
 */
export async function neighbours(
  itemId: string,
  filter: OrderFilter = {},
): Promise<{ prev: string | null; next: string | null; index: number; total: number; inList: boolean }> {
  const all = await listOrder(filter, itemId);
  const i = all.findIndex((r) => r.itemId === itemId);
  const members = all.filter((r) => inFilter(r, filter));
  const inList = i >= 0 && inFilter(all[i], filter);
  const before = all.slice(0, Math.max(i, 0)).filter((r) => inFilter(r, filter));
  const after = all.slice(i + 1).filter((r) => inFilter(r, filter));
  return {
    prev: before.length ? before[before.length - 1].itemId : null,
    next: after[0]?.itemId ?? null,
    index: inList ? before.length + 1 : 0,
    total: members.length,
    inList,
  };
}

/**
 * Activity as this role may see it: for Castle Rock, revisions of a version
 * not yet released and moves to Ready are dropped, and other rows above the
 * released version lose their version number.
 */
export function activitySeenBy(rows: ActivityDoc[], released: (itemId: string) => number, role?: Role): ActivityDoc[] {
  if (seesUnreleased(role)) return rows;
  const toReady = (a: ActivityDoc) => a.type === "stage" && (a.stage ? a.stage === "ready" : /\bReady\b/.test(a.body ?? ""));
  return rows.flatMap((a) => {
    if (toReady(a)) return [];
    if (!a.version || a.version <= released(a.itemId)) return [a];
    return a.type === "revision" ? [] : [{ ...a, version: undefined }];
  });
}

/**
 * One item with a solution version (default: the latest this role may see).
 * For reviewer/tech: only versions up to releasedVersion, `solution` null
 * when none is released, and `item` as they see it (stage via visibleStage,
 * version = the released one).
 */
export async function getItem(itemId: string, version?: number, role?: Role) {
  const { Item, Solution, Activity } = await ks();
  const raw = await Item.findOne({ itemId }).lean<ItemDoc>();
  if (!raw) return null;
  const top = releasedFor(raw, role);
  const v = Math.min(version ?? top, top);
  const [solution, activity, versions] = await Promise.all([
    v > 0 ? Solution.findOne({ itemId, version: v }).lean<SolutionDoc>() : null,
    Activity.find({ itemId }).sort({ createdAt: -1 }).limit(50).lean<ActivityDoc[]>(),
    Solution.find({ itemId, version: { $lte: top } }).select("version createdAt author").sort({ version: -1 }).lean(),
  ]);
  return {
    item: asSeenBy(raw, role),
    solution,
    activity: activitySeenBy(activity, () => top, role),
    versions: versions.map((x) => x.version),
  };
}

export async function recentActivity(opts: { limit?: number; roles?: string[]; types?: string[]; viewer?: Role } = {}) {
  const { Activity, Item } = await ks();
  const q: Record<string, unknown> = {};
  if (opts.roles) q.role = { $in: opts.roles };
  if (opts.types) q.type = { $in: opts.types };
  const limit = opts.limit ?? 12;
  if (seesUnreleased(opts.viewer)) return Activity.find(q).sort({ createdAt: -1 }).limit(limit).lean<ActivityDoc[]>();
  // Over-fetch: unreleased revisions are dropped below.
  const rows = await Activity.find(q).sort({ createdAt: -1 }).limit(limit * 3).lean<ActivityDoc[]>();
  const items = await Item.find({ itemId: { $in: [...new Set(rows.map((r) => r.itemId))] } })
    .select("itemId version releasedVersion")
    .lean<Pick<ItemDoc, "itemId" | "version" | "releasedVersion">[]>();
  const top = new Map(items.map((i) => [i.itemId, releasedFor(i, opts.viewer)]));
  return activitySeenBy(rows, (id) => top.get(id) ?? 0, opts.viewer).slice(0, limit);
}

export async function recentUploads(limit = 8) {
  const { Upload } = await ks();
  return Upload.find().sort({ createdAt: -1 }).limit(limit).lean();
}

/** Latest verdict per item (for "what did the reviewer say" columns). */
export async function latestVerdicts(itemIds: string[]) {
  const { Activity } = await ks();
  const rows = await Activity.aggregate<{ _id: string; verdict: string; body?: string; createdAt: Date }>([
    { $match: { itemId: { $in: itemIds }, type: "verdict" } },
    { $sort: { createdAt: -1 } },
    { $group: { _id: "$itemId", verdict: { $first: "$verdict" }, body: { $first: "$body" }, createdAt: { $first: "$createdAt" } } },
  ]);
  return new Map(rows.map((r) => [r._id, r]));
}

// --- Praveen's queue and the Checks panel. Evelyn only: every function below returns nothing for any other role. ---
// The queue's rows carry flags, hold reasons, solver answers and model ids: internal, never for Castle Rock.

const isOwner = (role?: Role): role is "evelyn" => role === "evelyn";

/** An answer in a few plain characters for a table cell (no markup, no option wording). */
export function answerShort(a: unknown): string {
  if (!a || typeof a !== "object") return "–";
  const x = a as { kind?: string; letters?: unknown; value?: unknown; values?: unknown };
  const list = (v: unknown) => (Array.isArray(v) ? v.map(String).filter(Boolean) : []);
  const clip = (s: string) => (s.length > 60 ? `${s.slice(0, 59).trimEnd()}…` : s);
  switch (x.kind) {
    case "choice": return list(x.letters).join(", ") || "–";
    case "number": return clip(String(x.value ?? "")) || "–";
    case "labels": return clip(list(x.values).join("; ")) || "–";
    case "text": return clip(String(x.value ?? "").replace(/\s+/g, " ").trim()) || "–";
    default: return "–";
  }
}

export type SolverLine = { who: string; answer: string; ok: boolean; model?: string };
export type FindingLine = { code: string; ruleId?: string; quote?: string; detail: string; section?: string };
export type StepView = {
  step: string;
  key: string;
  ok: boolean;
  model?: string;
  at?: Date;
  /** solve: each solver's answer and the decision. */
  solvers?: SolverLine[];
  decision?: string;
  /** calc / working / audit / render: what the check found. */
  findings?: FindingLine[];
  /** a step that could not run */
  failed?: string;
  /** anything else: the raw output, clipped, for a collapsed view */
  raw?: string;
};
export type RunView = {
  runId: string;
  startedAt?: Date;
  finishedAt?: Date;
  mode?: string;
  result?: string;
  wouldBe?: string;
  error?: string;
  flags: string[];
  corrections: number;
  cost: number;
  steps: StepView[];
  /** solver answers of the last solve step */
  solvers: SolverLine[];
  /** findings of the last run of each check */
  findingsCount: number;
  /** checks whose last run could not run */
  checksFailed: number;
  /** the record could not be read (safeRunView) */
  unreadable?: boolean;
};

const SOLVER_NAMES: Record<string, string> = { solver1: "Solver 1", solver2: "Solver 2", solver3: "Solver 3" };
const CHECK_STEPS = ["calc", "working", "audit", "render"];
const DECISION_WORDS: Record<string, string> = {
  pass: "agreed",
  key_query: "differs from the key: key query",
  need_third: "needs a third solver",
  hold: "held",
};

function solverLines(solves: unknown): SolverLine[] {
  if (!solves || typeof solves !== "object") return [];
  const out: SolverLine[] = [];
  for (const k of ["solver1", "solver2", "solver3"]) {
    const r = (solves as Record<string, unknown>)[k] as { ok?: boolean; value?: { answer?: unknown }; reason?: string; model?: string } | undefined;
    if (!r || typeof r !== "object") continue;
    out.push({ who: SOLVER_NAMES[k], ok: !!r.ok, answer: r.ok ? answerShort(r.value?.answer) : `no answer (${r.reason ?? "failed"})`, ...(r.model ? { model: r.model } : {}) });
  }
  return out;
}

function decisionText(d: unknown): string | undefined {
  if (!d || typeof d !== "object") return undefined;
  const x = d as { outcome?: string; answer?: unknown; why?: string; flag?: string; confirm?: boolean };
  if (!x.outcome) return undefined;
  const parts = [DECISION_WORDS[x.outcome] ?? x.outcome];
  if (x.answer) parts.push(answerShort(x.answer));
  if (x.why) parts.push(x.why.replace(/_/g, " "));
  if (x.flag) parts.push(x.flag.replace(/_/g, " "));
  if (x.confirm) parts.push("answer to confirm");
  return parts.join(" · ");
}

const clipRaw = (v: unknown) => {
  try {
    const s = JSON.stringify(v, null, 1) ?? "";
    return s.length > 4000 ? `${s.slice(0, 4000)}…` : s;
  } catch {
    return String(v);
  }
};

/** The run record as the queue and the Checks panel show it. Pure. */
export function runView(run: RunDoc): RunView {
  const steps: StepView[] = (Array.isArray(run.steps) ? run.steps : []).map((raw, n) => {
    const s = (raw && typeof raw === "object" ? raw : { step: "unknown", key: `step#${n + 1}`, ok: false, output: raw }) as RunStep;
    const isObj = !!s.output && typeof s.output === "object" && !Array.isArray(s.output);
    const out = (isObj ? s.output : {}) as Record<string, unknown>;
    const base: StepView = {
      step: String(s.step), key: String(s.key ?? s.step), ok: !!s.ok,
      ...(typeof s.model === "string" && s.model ? { model: s.model } : {}),
      ...(s.at ? { at: s.at } : {}),
    };
    // Anything that is not an object (a string, number, null, an array) is shown raw.
    if (!isObj) return { ...base, raw: clipRaw(s.output) };
    if (typeof out.failed === "string") return { ...base, failed: out.failed };
    if (s.step === "solve" && ("solves" in out || "decision" in out)) return { ...base, solvers: solverLines(out.solves), decision: decisionText(out.decision) };
    if (CHECK_STEPS.includes(s.step) && Array.isArray(out.findings)) {
      return {
        ...base,
        findings: (out.findings as unknown[]).map((x) => (x && typeof x === "object" ? (x as Record<string, unknown>) : { code: "?", detail: String(x) })).map((f) => ({
          code: String(f.code ?? ""),
          detail: String(f.detail ?? ""),
          ...(f.ruleId ? { ruleId: String(f.ruleId) } : {}),
          ...(f.quote ? { quote: String(f.quote) } : {}),
          ...(f.section ? { section: String(f.section) } : {}),
        })),
      };
    }
    return { ...base, raw: clipRaw(s.output) };
  });
  const lastSolve = [...steps].reverse().find((s) => s.step === "solve" && s.solvers);
  let findingsCount = 0;
  let checksFailed = 0;
  for (const c of CHECK_STEPS) {
    const last = [...steps].reverse().find((s) => s.step === c);
    findingsCount += last?.findings?.length ?? 0;
    if (last && last.failed !== undefined) checksFailed++;
  }
  return {
    runId: run.runId,
    startedAt: run.startedAt,
    finishedAt: run.finishedAt,
    mode: run.mode,
    result: run.result,
    wouldBe: run.wouldBe,
    error: run.error,
    flags: Array.isArray(run.flags) ? run.flags : [],
    corrections: run.corrections ?? 0,
    cost: run.cost ?? 0,
    steps,
    solvers: lastSolve?.solvers ?? [],
    findingsCount,
    checksFailed,
  };
}

/** What a queue row reads of a run (runView's solvers, findings count, checks that could not run): never the whole record. */
const QUEUE_RUN_FIELDS = [
  "itemId", "runId", "startedAt", "finishedAt", "mode", "result", "error", "flags", "corrections", "cost",
  "steps.step", "steps.key", "steps.ok", "steps.at", "steps.model", "steps.output.failed", "steps.output.findings",
  ...["solver1", "solver2", "solver3"].flatMap((k) => ["ok", "reason", "model", "value.answer"].map((f) => `steps.output.solves.${k}.${f}`)),
].join(" ");

/** The latest real (not dry) run of each item; `fields` narrows what is read (default: the whole record, minus ids). */
async function latestRealRuns(itemIds: string[], fields = "-_id -__v"): Promise<Map<string, RunDoc>> {
  if (!itemIds.length) return new Map();
  const { Run } = await ks();
  const rows = await Run.find({ itemId: { $in: itemIds }, dryRun: { $ne: true } }).sort({ startedAt: -1 }).select(fields).lean<RunDoc[]>();
  const out = new Map<string, RunDoc>();
  for (const r of rows) if (!out.has(r.itemId)) out.set(r.itemId, r);
  return out;
}

/** The Checks panel of the item page: the latest real run. Null for any role but Evelyn, or when no run exists. */
/** runView that never throws: an unreadable record becomes a view that says so (one bad record must not take a page down). */
export function safeRunView(run: RunDoc): RunView {
  try {
    return runView(run);
  } catch (e) {
    return {
      runId: String(run?.runId ?? "?"), flags: [], corrections: 0, cost: 0, steps: [], solvers: [], findingsCount: 0, checksFailed: 0,
      error: `${RUN_UNREADABLE} (${(e as Error).message})`,
      unreadable: true,
    };
  }
}
export const RUN_UNREADABLE = "Run record unreadable";

export async function itemChecks(itemId: string, role?: Role): Promise<RunView | null> {
  if (!isOwner(role)) return null;
  const run = (await latestRealRuns([itemId])).get(itemId);
  return run ? safeRunView(run) : null;
}

type OwnerItem = Pick<ItemDoc, "itemId" | "course" | "subject" | "itemType" | "stage" | "key" | "keySource" | "evelynAnswer" | "receivedAt" | "createdAt" | "version" | "releasedVersion"> & {
  pipeline?: PipelineDoc & { fixNote?: string; seenAt?: Date };
};
export type QueueRow = {
  itemId: string;
  course: string;
  itemType: string;
  stage: Stage;
  reasons: string[];
  key: string;
  solvers: SolverLine[];
  findings: number | null;
  checksFailed: number;
  receivedAt?: Date;
  seenAt?: Date;
  releaseAt?: Date;
  /** flagged: anything other than a sample-only hold */
  flagged: boolean;
  /** held for the owner (pipeline.heldFor) */
  held: boolean;
  /** "Send to review": a ready item whose current version has an unreleased, sendable row */
  canSend: boolean;
  /** "Send back with a note": a held ready version, or a held send-back of Castle Rock's (changes_requested) */
  canSendBack: boolean;
  /** "Seen: clear the hold": a hold that is information only (a re-sent question mid-review or after approval) */
  canClear: boolean;
};
export type OwnerQueue = { waiting: QueueRow[]; beforeSolution: QueueRow[]; going: QueueRow[]; blocked: BlockedBatch[] };

const OWNER_FIELDS = "itemId course subject itemType stage key keySource evelynAnswer receivedAt createdAt version releasedVersion pipeline";
const clip120 = (s: string) => (s.length > 120 ? `${s.slice(0, 119).trimEnd()}…` : s);

/** Why the item is held, in plain words: the owner's own send-back first, then each flag, else heldWhy. Pure. */
export function holdReasons(p: OwnerItem["pipeline"]): string[] {
  const flags = Array.isArray(p?.flags) ? (p!.flags as string[]) : [];
  const out: string[] = [];
  if (flags.includes("owner_sent_back")) out.push(`Sent back by you: ${clip120((p?.fixNote ?? "").replace(/\s+/g, " ").trim())}`);
  for (const f of flags) if (f !== "owner_sent_back") out.push(FLAG_WORDS[f as Flag] ?? f.replace(/_/g, " "));
  if (!out.length) out.push(p?.heldWhy || "Held, no reason recorded");
  return out;
}

/** Waiting-for-you order: unseen first; then flagged before sample-only; then oldest arrival first. Pure. */
export function queueOrder(a: QueueRow, b: QueueRow): number {
  const seen = Number(!!a.seenAt) - Number(!!b.seenAt);
  if (seen) return seen;
  const flagged = Number(b.flagged) - Number(a.flagged);
  if (flagged) return flagged;
  return (a.receivedAt ? new Date(a.receivedAt).getTime() : 0) - (b.receivedAt ? new Date(b.receivedAt).getTime() : 0) || a.itemId.localeCompare(b.itemId);
}

function queueRow(i: OwnerItem, run: RunDoc | undefined, reasons: string[]): QueueRow {
  const v = run ? safeRunView(run) : null;
  if (v?.unreadable) reasons = [...reasons, RUN_UNREADABLE];
  const flags = Array.isArray(i.pipeline?.flags) ? i.pipeline!.flags : [];
  return {
    itemId: i.itemId,
    course: i.course || i.subject || "",
    itemType: i.itemType,
    stage: i.stage,
    reasons,
    key: i.key || (i.keySource === "evelyn" ? "none supplied" : "–"),
    solvers: v?.solvers ?? [],
    findings: v ? v.findingsCount : null,
    checksFailed: v?.checksFailed ?? 0,
    receivedAt: i.receivedAt ?? i.createdAt,
    ...(i.pipeline?.seenAt ? { seenAt: i.pipeline.seenAt } : {}),
    ...(i.pipeline?.releaseAt ? { releaseAt: i.pipeline.releaseAt } : {}),
    flagged: !(flags.length > 0 && flags.every((f) => f === "sample")),
    held: i.pipeline?.heldFor === "praveen",
    canSend: false,
    canSendBack: false,
    canClear: false,
  };
}

/** Number of items waiting for the owner (the top bar's count). 0 for any other role. */
export async function waitingForOwnerCount(role?: Role): Promise<number> {
  if (!isOwner(role)) return 0;
  const { Item } = await ks();
  // pipeline/holds.ts: the same definition as the queue's two held sections and the email's "waiting on you".
  return Item.countDocuments(NEEDS_OWNER_FILTER);
}

/**
 * The owner's queue. Null for any role but Evelyn. The two held sections are pipeline/holds.ts's predicates.
 *   waiting: held for Praveen with a solution stage: ready (incl. his own send-backs until the run rewrites
 *     them), a send-back of Castle Rock's the pipeline held (changes_requested, with the reviewer's note), and
 *     a question re-sent mid-review or after approval (information);
 *   beforeSolution: held while still received / drafting; ready with no sendable row; or whose latest real run failed;
 *   going: ready, not held, no flags: the timer sends them (release time in Pacific on the page);
 *   blocked: batches nothing of which can be released.
 */
export async function ownerQueue(role?: Role): Promise<OwnerQueue | null> {
  if (!isOwner(role)) return null;
  const { Item, Run } = await ks();
  const [held, early, going, failedIds, blocked] = await Promise.all([
    Item.find(WAITING_ON_OWNER_FILTER).select(OWNER_FIELDS).lean<OwnerItem[]>(),
    Item.find(HELD_BEFORE_SOLUTION_FILTER).select(OWNER_FIELDS).lean<OwnerItem[]>(),
    Item.find({ stage: "ready", "pipeline.heldFor": { $exists: false } }).select(OWNER_FIELDS).sort({ "pipeline.releaseAt": 1, itemId: 1 }).lean<OwnerItem[]>(),
    Run.aggregate<{ _id: string; result?: string; error?: string }>([
      { $match: { dryRun: { $ne: true } } },
      { $sort: { itemId: 1, startedAt: -1 } },
      { $group: { _id: "$itemId", result: { $first: "$result" }, error: { $first: "$error" } } },
      { $match: { result: "failed" } },
    ]),
    blockedBatches(),
  ]);
  const { Solution } = await ks();
  // An item can be sent only when the current version's solution row exists and is unreleased.
  const pairs = [...held, ...going].filter((i) => i.version).map((i) => ({ itemId: i.itemId, version: i.version }));
  const rows = pairs.length ? await Solution.find({ $or: pairs }).select("itemId version releasedAt").lean() : [];
  const open = new Set(rows.filter((r) => !r.releasedAt).map((r) => r.itemId));
  const sendable = (i: OwnerItem) => !!i.version && releasedVersionOf(i) < i.version && open.has(i.itemId);
  const NO_SOLUTION = "No unreleased solution for the current version: nothing to send";

  const failedErr = new Map(failedIds.map((f) => [f._id, f.error]));
  const failReason = (id: string) => `The last run stopped: ${clip120(failedErr.get(id) || "no error recorded")}`;
  const failNote = (id: string) => (failedErr.has(id) ? [failReason(id)] : []);
  const known = new Set([...held, ...early, ...going].map((i) => i.itemId));
  const failedItems = failedIds.length
    ? await Item.find({ itemId: { $in: failedIds.map((f) => f._id).filter((id) => !known.has(id)) }, stage: { $nin: ["approved", "delivered", "rejected", "in_review"] } })
        .select(OWNER_FIELDS)
        .lean<OwnerItem[]>()
    : [];
  const runs = await latestRealRuns([...held, ...early, ...failedItems, ...going].map((i) => i.itemId), QUEUE_RUN_FIELDS);
  // A send-back the pipeline held: the reviewer's note is shown with the hold.
  const sentBack = held.filter((i) => i.stage === "changes_requested").map((i) => i.itemId);
  const notes = sentBack.length ? await latestVerdicts(sentBack) : new Map<string, { verdict: string; body?: string }>();
  const reviewerNote = (i: OwnerItem) => {
    const v = notes.get(i.itemId);
    return i.stage === "changes_requested" && v?.verdict === "changes" && v.body ? [`Castle Rock's note: ${noteText(v.body)}`] : [];
  };

  // The timer releases only ready items with an empty flags list (release.ts CLEAN); anything else here waits forever.
  const goingWhy = (i: OwnerItem): string[] => {
    const flags = i.pipeline?.flags;
    if (!Array.isArray(flags)) return ["No pipeline record: it will not go out by itself. Hold it to send it yourself."];
    if (flags.length) return [`Flagged but not held (${flags.join(", ")}): it will not go out by itself. Hold it to look.`];
    if (!i.pipeline?.releaseAt) return ["No release time yet: the timer will hold it for you."];
    return [];
  };
  const byArrival = (a: QueueRow, b: QueueRow) =>
    (a.receivedAt ? new Date(a.receivedAt).getTime() : 0) - (b.receivedAt ? new Date(b.receivedAt).getTime() : 0) || a.itemId.localeCompare(b.itemId);

  // A held ready item with nothing to send is listed before a solution (nothing in "Waiting for you" is unsendable at ready).
  const waitingNow = (i: OwnerItem) => i.stage !== "ready" || sendable(i);
  const waiting = held
    .filter(waitingNow)
    .map((i) => {
      const canSend = i.stage === "ready" && sendable(i);
      const reasons = [...holdReasons(i.pipeline), ...reviewerNote(i), ...failNote(i.itemId)];
      return {
        ...queueRow(i, runs.get(i.itemId), reasons),
        canSend,
        canSendBack: canSend || i.stage === "changes_requested",
        canClear: i.stage !== "ready" && i.stage !== "changes_requested",
      };
    })
    .sort(queueOrder);
  const before = [
    ...held.filter((i) => !waitingNow(i)).map((i) => queueRow(i, runs.get(i.itemId), [...holdReasons(i.pipeline), NO_SOLUTION, ...failNote(i.itemId)])),
    ...going.filter((i) => !sendable(i)).map((i) => queueRow(i, runs.get(i.itemId), [NO_SOLUTION, ...failNote(i.itemId)])),
    ...early.map((i) => queueRow(i, runs.get(i.itemId), [...holdReasons(i.pipeline), ...failNote(i.itemId)])),
    ...failedItems.map((i) => queueRow(i, runs.get(i.itemId), [failReason(i.itemId)])),
  ].sort(byArrival);
  const goingRows = going.filter(sendable).map((i) => queueRow(i, runs.get(i.itemId), [...goingWhy(i), ...(failedErr.has(i.itemId) ? ["Last run failed; this version passed an earlier run"] : [])]));
  return {
    waiting,
    beforeSolution: before,
    going: goingRows,
    blocked,
  };
}
