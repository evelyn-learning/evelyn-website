// The timed release (spec §7). A solution that passed every check waits at stage `ready` (hidden from
// Castle Rock) and goes to review by itself about two days after its batch arrived, inside Castle Rock's
// working day (Mon–Fri 08:00–17:00 America/Edmonton), spread over 0–90 minutes per item. Anything
// flagged, and a sample of each batch, waits for Praveen instead and is never released here.
//
// Safety, by construction:
//   - the sample invariant (sampleNeed) is enforced at release time: before anything of a batch is
//     released, under a per-batch guard, the batch's sample is topped up to requiredSample(n) for the n
//     that includes every item that is or was eligible, so later arrivals are sampled at the right rate;
//     an item with no batch is always held as sample; a blocked batch releases nothing and says why;
//   - each release is one claim (a conditional update that only one caller can win) followed by
//     store.releaseClaimed, whose own conditional update is the single point that moves the item;
//     a claim left by a crash is taken over after STALE_MS, a half-finished release is completed once;
//   - outside the window, or on a read-only connection, nothing is written;
//   - the client sees only the ordinary "set the status to In review" row by Evelyn Learning.
// No holiday calendar: only weekends are skipped.
// No `next/*` imports: this runs from tsx scripts on the server.

import { createHash, randomUUID } from "node:crypto";
import { releasedVersionOf } from "../config";
import { isReadOnly, ks, READ_ONLY_MESSAGE, type BatchDoc, type ItemDoc } from "../db";
import { finishRelease, releaseClaimed, type Actor } from "../store";
import { suggestFor } from "./outbox";

export const TZ = "America/Edmonton";
const MIN = 60_000;
const OPEN = 8 * 60; // minutes after local midnight
const CLOSE = 17 * 60; // the window is [08:00, 17:00)
const WORK_WAIT_MS = 4 * 60 * MIN; // "at least 4 working hours after it passes"
const MAX_OFFSET = 90;

/** A claim (on an item or a batch) older than this is taken to belong to a caller that died. */
export const STALE_MS = 15 * MIN;

/** Who the release row is by: the same actor as the run's own rows. */
export const RELEASE_ACTOR: Actor = { username: "pipeline", name: "Evelyn Learning", role: "evelyn" };

// --- local time (America/Edmonton) via Intl: no fixed offsets, correct across both clock changes ---

const FMT = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ, hourCycle: "h23", weekday: "short", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
});
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
type Parts = { y: number; mo: number; d: number; h: number; mi: number; s: number; wd: number };

function parts(date: Date): Parts {
  const p: Record<string, string> = {};
  for (const x of FMT.formatToParts(date)) p[x.type] = x.value;
  return { y: +p.year, mo: +p.month, d: +p.day, h: +p.hour % 24, mi: +p.minute, s: +p.second, wd: WEEKDAYS.indexOf(p.weekday) };
}

/** Milliseconds the local wall clock is ahead of UTC at `t`. */
function offsetAt(t: number): number {
  const p = parts(new Date(t));
  return Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, p.s) - (t - (((t % 1000) + 1000) % 1000));
}

/** The instant whose local wall time is the given one (day overflow normalised, e.g. d = 32). */
function fromLocal(y: number, mo: number, d: number, h: number, mi: number, s = 0, ms = 0): Date {
  const wall = Date.UTC(y, mo - 1, d, h, mi, s, ms);
  const first = wall - offsetAt(wall);
  return new Date(wall - offsetAt(first));
}

/** Same local wall time `n` calendar days later in America/Edmonton (not n × 24 h). */
export function addLocalDays(date: Date, n: number): Date {
  const p = parts(date);
  return fromLocal(p.y, p.mo, p.d + n, p.h, p.mi, p.s, date.getUTCMilliseconds());
}

const isWorkday = (wd: number) => wd >= 1 && wd <= 5;
const weekdayOf = (y: number, mo: number, d: number) => new Date(Date.UTC(y, mo - 1, d)).getUTCDay();

/** Mon–Fri, 08:00 ≤ local time < 17:00, America/Edmonton. */
export function inWindow(now: Date): boolean {
  const p = parts(now);
  const m = p.h * 60 + p.mi;
  return isWorkday(p.wd) && m >= OPEN && m < CLOSE;
}

/** `date` if it is inside the window, else the next opening (08:00 of the next working day, or of today if before 08:00). */
function openAtOrAfter(date: Date): Date {
  if (inWindow(date)) return date;
  const p = parts(date);
  const startDay = isWorkday(p.wd) && p.h * 60 + p.mi < OPEN ? 0 : 1;
  for (let k = startDay; k < startDay + 8; k++) {
    if (isWorkday(weekdayOf(p.y, p.mo, p.d + k))) return fromLocal(p.y, p.mo, p.d + k, 8, 0);
  }
  throw new Error("no working day within a week");
}

/** `ms` of working time after `date`, counting only time inside the window; never lands outside it (17:00 is outside). */
function addWorking(date: Date, ms: number): Date {
  let t = openAtOrAfter(date);
  for (;;) {
    const p = parts(t);
    const close = fromLocal(p.y, p.mo, p.d, 17, 0).getTime();
    const left = close - t.getTime();
    if (ms < left) return new Date(t.getTime() + ms);
    ms -= left;
    t = openAtOrAfter(new Date(close));
  }
}

/** Per-item spread, 0–90 minutes, from the item id (deterministic). */
export function offsetMinutes(itemId: string): number {
  return createHash("sha256").update(itemId).digest().readUInt32BE(0) % (MAX_OFFSET + 1);
}

/**
 * When a clean solution goes to review: the later of `receivedAt` + 2 days (1 when `corrected`, same local
 * wall time) and `passedAt` + 4 working hours, moved forward into the window, plus the item's offset of
 * 0–90 minutes counted in working time (past 17:00 it carries into the next working day from 08:00).
 * Without an item id the offset is 0.
 */
export function releaseAt(receivedAt: Date, passedAt: Date, corrected: boolean, itemId?: string): Date {
  const byArrival = addLocalDays(receivedAt, corrected ? 1 : 2);
  const byPass = addWorking(passedAt, WORK_WAIT_MS);
  const base = byArrival.getTime() > byPass.getTime() ? byArrival : byPass;
  return addWorking(base, itemId ? offsetMinutes(itemId) * MIN : 0);
}

/** Local time for people: "Wed 2026-11-18 10:00" (Mountain time). */
export function mountain(d: Date): string {
  const p = parts(d);
  const two = (n: number) => String(n).padStart(2, "0");
  return `${WEEKDAYS[p.wd]} ${p.y}-${two(p.mo)}-${two(p.d)} ${two(p.h)}:${two(p.mi)}`;
}

/** The sample a batch needs when `n` of its items are or were eligible: ceil(10%), at least 3, at most all. */
export function requiredSample(n: number): number {
  return n <= 0 ? 0 : Math.min(n, Math.max(3, Math.ceil(n / 10)));
}

/** The order the sample is drawn in: a hash of (seed, id), so it is deterministic and independent of input order. */
export function sampleOrder(ids: string[], seed: string): string[] {
  const rank = (id: string) => createHash("sha256").update(`${seed}\u0000${id}`).digest("hex");
  return [...new Set(ids)]
    .map((id) => ({ id, r: rank(id) }))
    .sort((a, b) => (a.r < b.r ? -1 : a.r > b.r ? 1 : a.id < b.id ? -1 : 1))
    .map((x) => x.id);
}

/** The sample of a batch for Praveen, drawn at once: the first requiredSample(n) of sampleOrder, sorted. */
export function pickSample(batchItemIds: string[], seed: string): string[] {
  const ids = [...new Set(batchItemIds)];
  return sampleOrder(ids, seed).slice(0, requiredSample(ids.length)).sort();
}

/**
 * The sample invariant of a batch. n = items clean-ready + items ever held as sample (flag `sample`, held or
 * since sent to review by the owner) + items the timer released; h = items ever held as sample. Before any
 * release, h must reach requiredSample(n); `topUp` is what to hold next (from the clean-ready items, in
 * sampleOrder). Releasing a clean item leaves n and h unchanged, so after a top-up every release keeps it.
 */
export function sampleNeed(counts: { clean: string[]; sampled: number; timerReleased: number }, batchId: string): { n: number; h: number; required: number; topUp: string[] } {
  const n = counts.clean.length + counts.sampled + counts.timerReleased;
  const required = requiredSample(n);
  const need = Math.max(0, required - counts.sampled);
  return { n, h: counts.sampled, required, topUp: sampleOrder(counts.clean, batchId).slice(0, need) };
}

// --- the database part ---

/**
 * The timer releases a solution row only when it is unreleased, not stale (written for a question since
 * re-sent), and written by the very run whose clean pass the item's pipeline record holds: a version saved by
 * hand (no runId) or by another run never goes out by itself.
 */
export function timerMayRelease(sol: { releasedAt?: Date; runId?: string; staleAt?: Date } | null | undefined, pipelineRunId: string | undefined): boolean {
  return !!sol && !sol.releasedAt && !sol.staleAt && !!sol.runId && sol.runId === pipelineRunId;
}

/** Ready, passed clean, not held: the only items the timer may release. */
const CLEAN = { stage: "ready", "pipeline.heldFor": { $exists: false }, "pipeline.flags": { $size: 0 } } as const;
const NO_BATCH = { $or: [{ batchId: { $exists: false } }, { batchId: null }, { batchId: "" }] };
const hasBatch = (b?: string | null): b is string => typeof b === "string" && b !== "";
const isClean = (i: Pick<ItemDoc, "stage" | "pipeline">) => i.stage === "ready" && !i.pipeline?.heldFor && Array.isArray(i.pipeline?.flags) && i.pipeline.flags.length === 0;
/** No release claim, or a stale one that never moved its item (cleared by the hold that matches it). */
const unclaimed = (staleBefore: Date) => ({
  $or: [{ "pipeline.releaseClaim": { $exists: false } }, { "pipeline.releaseClaim.at": { $lt: staleBefore }, "pipeline.releaseClaim.releasedAt": { $exists: false } }],
});
const HOLD_AS_SAMPLE = { $set: { "pipeline.flags": ["sample"], "pipeline.heldFor": "praveen" }, $unset: { "pipeline.releaseAt": "", "pipeline.releaseClaim": "" } };

function refuseReadOnly() {
  if (isReadOnly()) throw new Error(`${READ_ONLY_MESSAGE}; the release writes, use the dry-run plan instead`);
}

type Member = Pick<ItemDoc, "itemId" | "stage" | "pipeline" | "version" | "releasedVersion">;
type BatchRead = { batch: BatchDoc | null; blocked?: string; members: Member[]; need: ReturnType<typeof sampleNeed> };

/**
 * Read-only: the batch, why nothing of it may be released (if so), and its sample need. Blocked while the
 * Batch record is missing, an item its sheet lists was never uploaded, or an item is still received or
 * drafting with no hold (the pipeline has not finished it, or a person is writing it by hand). Items waiting
 * on the client (item_data, key_query, changes_requested) do not block: the invariant samples them when they return.
 */
async function readBatch(batchId: string): Promise<BatchRead> {
  const { Batch, Item } = await ks();
  const batch = await Batch.findOne({ batchId }).lean<BatchDoc>();
  const members = await Item.find({ batchId }).select("itemId stage pipeline version releasedVersion").lean<Member[]>();
  const clean = members.filter(isClean).map((m) => m.itemId);
  const sampled = members.filter((m) => m.pipeline?.flags?.includes("sample")).length;
  const timerReleased = members.filter((m) => !isClean(m) && !m.pipeline?.flags?.includes("sample") && m.pipeline?.timerReleasedAt).length;
  const need = sampleNeed({ clean, sampled, timerReleased }, batchId);
  if (!batch) return { batch, blocked: "no batch record", members, need };
  const present = new Set(members.map((m) => m.itemId));
  // Listed in the batch's sheet but not uploaded yet (an item since moved to a newer batch counts there).
  const missing = (batch.itemIds ?? []).filter((i) => !present.has(i));
  const elsewhere = missing.length ? await Item.countDocuments({ itemId: { $in: missing } }) : 0;
  const why: string[] = [];
  if (elsewhere < missing.length) why.push(`${missing.length - elsewhere} listed item(s) never uploaded`);
  const received = members.filter((m) => m.stage === "received" && !m.pipeline?.heldFor).length;
  if (received) why.push(`${received} item(s) not yet through the pipeline`);
  const drafting = members.filter((m) => m.stage === "drafting" && !m.pipeline?.heldFor).length;
  if (drafting) why.push(`${drafting} item(s) in drafting with no hold`);
  return { batch, ...(why.length ? { blocked: why.join("; ") } : {}), members, need };
}

/** Runs `fn` holding the batch's guard (one caller per batch; a guard older than STALE_MS is taken over). "busy" when another caller has it. */
async function withBatchGuard<T>(batchId: string, now: Date, fn: () => Promise<T>): Promise<T | "busy"> {
  const { Batch } = await ks();
  const owner = randomUUID();
  const got = await Batch.findOneAndUpdate(
    { batchId, $or: [{ releasing: { $exists: false } }, { "releasing.at": { $lt: new Date(now.getTime() - STALE_MS) } }] },
    { $set: { releasing: { owner, at: now } } },
  ).lean();
  if (!got) return "busy";
  try {
    return await fn();
  } finally {
    await Batch.updateOne({ batchId, "releasing.owner": owner }, { $unset: { releasing: "" } });
  }
}

/** Holds the batch's next sample items until h reaches the required number. Call under the batch guard. Returns the ids held and whether the invariant now holds. */
const WHY_CLAIMED = "the sample could not be completed (an item is being released by another call); retrying next run";
const WHY_CHANGED = "an item changed while the sample was being drawn; retrying next run";

async function topUp(batchId: string, r: BatchRead, now: Date): Promise<{ held: string[]; ok: boolean; why?: string }> {
  const { Item, Batch } = await ks();
  const staleBefore = new Date(now.getTime() - STALE_MS);
  const need = r.need.required - r.need.h;
  if (need <= 0) return { held: [], ok: true };
  const held: string[] = [];
  let claimed = 0;
  let changed = 0;
  // Every clean item in sample order: one that cannot be held is passed over for the next, and the miss says why.
  for (const itemId of sampleOrder(r.members.filter(isClean).map((m) => m.itemId), batchId)) {
    if (held.length >= need) break;
    const u = await Item.updateOne({ itemId, batchId, ...CLEAN, ...unclaimed(staleBefore) }, HOLD_AS_SAMPLE);
    if (u.modifiedCount === 1) { held.push(itemId); continue; }
    const cur = await Item.findOne({ itemId }).select("stage pipeline batchId").lean<ItemDoc>();
    const live = cur?.pipeline?.releaseClaim && !(new Date(cur.pipeline.releaseClaim.at).getTime() < staleBefore.getTime() && !cur.pipeline.releaseClaim.releasedAt);
    if (cur && cur.batchId === batchId && isClean(cur) && live) claimed++;
    else changed++;
  }
  if (held.length) await Batch.updateOne({ batchId, sampledAt: { $exists: false } }, { $set: { sampledAt: now } });
  // Short with every clean item held: nothing is left to release, so nothing can break the invariant.
  if (held.length >= need || claimed + changed === 0) return { held, ok: true };
  return { held, ok: false, why: claimed ? WHY_CLAIMED : WHY_CHANGED };
}

async function recordBlocked(batchId: string, why: string | undefined, now: Date) {
  const { Batch } = await ks();
  if (why) {
    await Batch.updateOne({ batchId, blockedAt: { $exists: false } }, { $set: { blockedAt: now } });
    await Batch.updateOne({ batchId }, { $set: { blockedWhy: why } });
  } else {
    await Batch.updateOne({ batchId, blockedWhy: { $exists: true } }, { $unset: { blockedWhy: "", blockedAt: "" } });
  }
}

export type SampleStatus = "sampled" | "blocked" | "busy" | "no_batch";

/**
 * Tops the batch's sample up to its invariant (under the batch guard) unless the batch is blocked.
 * "sampled": the invariant holds now. Called by the run after a writing run, and by releaseDue.
 */
export async function applySample(batchId: string, now = new Date()): Promise<{ status: SampleStatus; held: string[]; why?: string }> {
  refuseReadOnly();
  const out = await withBatchGuard(batchId, now, async () => {
    const r = await readBatch(batchId);
    if (!r.batch) return { status: "no_batch" as const, held: [], why: r.blocked };
    if (r.blocked) return { status: "blocked" as const, held: [], why: r.blocked };
    const t = await topUp(batchId, r, now);
    return t.ok ? { status: "sampled" as const, held: t.held } : { status: "blocked" as const, held: t.held, why: t.why };
  });
  return out === "busy" ? { status: "busy", held: [] } : out;
}

/** Items with no batch are always held as sample (a batch of one is all sample). Returns the ids held. */
export async function holdUnbatched(itemIds?: string[], now = new Date()): Promise<string[]> {
  refuseReadOnly();
  const { Item } = await ks();
  const staleBefore = new Date(now.getTime() - STALE_MS);
  const filter = { ...CLEAN, ...NO_BATCH, ...(itemIds ? { itemId: { $in: itemIds } } : {}) };
  const found = await Item.find(filter).select("itemId").lean<{ itemId: string }[]>();
  const held: string[] = [];
  for (const { itemId } of found) {
    const r = await Item.updateOne({ $and: [{ ...filter, itemId }, unclaimed(staleBefore)] }, HOLD_AS_SAMPLE);
    if (r.modifiedCount === 1) held.push(itemId);
  }
  return held;
}

/** A clean ready item with no release time would wait forever: held for Praveen with the reason. Returns the ids held. */
export async function holdNoReleaseTime(now = new Date()): Promise<string[]> {
  refuseReadOnly();
  const { Item } = await ks();
  const staleBefore = new Date(now.getTime() - STALE_MS);
  const filter = { ...CLEAN, "pipeline.releaseAt": { $exists: false } };
  const found = await Item.find(filter).select("itemId").lean<{ itemId: string }[]>();
  const held: string[] = [];
  for (const { itemId } of found) {
    const r = await Item.updateOne(
      { $and: [{ ...filter, itemId }, unclaimed(staleBefore)] },
      { $set: { "pipeline.heldFor": "praveen", "pipeline.heldWhy": "no release time" }, $unset: { "pipeline.releaseClaim": "" } },
    );
    if (r.modifiedCount === 1) held.push(itemId);
  }
  return held;
}

/** After a run: top up the sample of every batch it touched and hold its items without a batch. */
export async function sampleAfterRun(batchIds: string[], unbatchedItemIds: string[], now = new Date()): Promise<{ batchId: string; status: SampleStatus; held: string[]; why?: string }[]> {
  const out = [];
  for (const batchId of [...new Set(batchIds.filter(hasBatch))]) out.push({ batchId, ...(await applySample(batchId, now)) });
  if (unbatchedItemIds.length) await holdUnbatched(unbatchedItemIds, now);
  return out;
}

/**
 * "Ready for review", once per wave: called after a pass released (or recovered) something of the batch, it
 * suggests when no clean item whose time has come is left, and again for a later wave: only when an item of
 * the batch was released after the previous suggestion (Batch.inReviewSuggestedAt). suggestFor merges into an
 * open suggestion, so the owner gets one draft per wave. Call under the batch guard.
 */
async function suggestInReview(batchId: string, now: Date): Promise<void> {
  const { Batch, Item } = await ks();
  if (await Item.exists({ batchId, ...CLEAN, "pipeline.releaseAt": { $lte: now } })) return; // this wave is not finished
  const last = await Item.findOne({ batchId, "pipeline.timerReleasedAt": { $exists: true } }).sort({ "pipeline.timerReleasedAt": -1 }).select("pipeline").lean<ItemDoc>();
  const lastAt = last?.pipeline?.timerReleasedAt;
  if (!lastAt) return;
  const b = await Batch.findOneAndUpdate(
    { batchId, $or: [{ inReviewSuggestedAt: { $exists: false } }, { inReviewSuggestedAt: { $lt: lastAt } }] },
    { $set: { inReviewSuggestedAt: now } },
    { new: false },
  ).lean<BatchDoc>();
  if (!b) return;
  const count = await Item.countDocuments({ batchId, stage: "in_review" });
  const batchName = (b.filename || batchId).replace(/\.(xlsx|xls|csv)$/i, "");
  try {
    await suggestFor("batch_in_review", { batchName, count }, batchId);
  } catch (e) {
    // Put the previous mark back, so the next pass suggests this wave again.
    await Batch.updateOne({ batchId, inReviewSuggestedAt: now }, b.inReviewSuggestedAt ? { $set: { inReviewSuggestedAt: b.inReviewSuggestedAt } } : { $unset: { inReviewSuggestedAt: "" } });
    throw e;
  }
}

export type BlockedBatch = { batchId: string; why: string; since?: Date };
export type ReleaseReport = { released: string[]; blocked: BlockedBatch[]; sampled: string[]; heldNoTime: string[]; heldUnbatched: string[]; busy: string[] };

/**
 * Everything one release pass does (inside the window; outside it nothing is written and the report is empty):
 *   0. finishes the bookkeeping of a release that moved its item and then died;
 *   1. holds clean items with no batch (always sample) and with no release time (heldWhy);
 *   2. per batch with clean items, under the batch guard: records / clears why it is blocked; tops the
 *      sample up to the invariant; then releases each clean item whose releaseAt has come (claim, then
 *      store.releaseClaimed) — only items this pass counted — and suggests "batch_in_review" once per wave.
 */
export async function releaseDueReport(
  now: Date,
  /** Tests only: afterRead runs after a batch was read (before its top-up); afterBatchRead after the top-up, before its claims. */
  opts: { actor?: Actor; staleMs?: number; afterRead?: (batchId: string) => Promise<void>; afterBatchRead?: (batchId: string) => Promise<void> } = {},
): Promise<ReleaseReport> {
  refuseReadOnly();
  const report: ReleaseReport = { released: [], blocked: [], sampled: [], heldNoTime: [], heldUnbatched: [], busy: [] };
  if (!inWindow(now)) return report;
  const actor = opts.actor ?? RELEASE_ACTOR;
  const staleBefore = new Date(now.getTime() - (opts.staleMs ?? STALE_MS));
  const { Item, Solution, Batch } = await ks();

  // 0. Recovery.
  const half = await Item.find({ "pipeline.releaseClaim.releasedAt": { $exists: true }, "pipeline.releaseClaim.at": { $lt: staleBefore } })
    .select("itemId batchId releasedVersion pipeline").lean<ItemDoc[]>();
  const recovered = new Set<string>();
  for (const h of half) {
    const c = h.pipeline!.releaseClaim!;
    await finishRelease(h.itemId, h.releasedVersion ?? 0, c.owner, actor, new Date(c.releasedAt!));
    if (hasBatch(h.batchId)) recovered.add(h.batchId);
  }

  // 1. Never released by the timer.
  report.heldUnbatched = await holdUnbatched(undefined, now);
  report.heldNoTime = await holdNoReleaseTime(now);

  // 2. Per batch.
  // Batches with clean items, plus those recovered, plus those still recorded as blocked (so a block clears).
  const recorded = ((await Batch.distinct("batchId", { blockedWhy: { $exists: true } })) as string[]).filter(hasBatch);
  const batchIds = [...new Set([...((await Item.distinct("batchId", CLEAN)) as string[]).filter(hasBatch), ...recovered, ...recorded])].sort();
  for (const batchId of batchIds) {
    const done = await withBatchGuard(batchId, now, async () => {
      const r = await readBatch(batchId);
      const cleanIds = r.members.filter(isClean).map((m) => m.itemId);
      if (!cleanIds.length && !recovered.has(batchId)) {
        await recordBlocked(batchId, undefined, now); // nothing left to release: nothing is blocked
        return;
      }
      if (r.blocked) {
        await recordBlocked(batchId, r.blocked, now);
        report.blocked.push({ batchId, why: r.blocked, since: r.batch?.blockedAt ?? now });
        return;
      }
      if (opts.afterRead) await opts.afterRead(batchId);
      const t = await topUp(batchId, r, now);
      report.sampled.push(...t.held);
      if (!t.ok) {
        const why = t.why ?? WHY_CHANGED;
        await recordBlocked(batchId, why, now);
        report.blocked.push({ batchId, why, since: r.batch?.blockedAt ?? now });
        return;
      }
      await recordBlocked(batchId, undefined, now);
      if (opts.afterBatchRead) await opts.afterBatchRead(batchId);
      // Only the items this pass counted (clean when read, not just held as sample): one that became clean
      // after the read is left for the next pass, which counts it.
      const counted = cleanIds.filter((i) => !t.held.includes(i));
      const due = await Item.find({ batchId, itemId: { $in: counted }, ...CLEAN, "pipeline.releaseAt": { $lte: now } }).sort({ "pipeline.releaseAt": 1, itemId: 1 })
        .select("itemId version releasedVersion pipeline.runId").lean<Member[]>();
      let any = recovered.has(batchId);
      for (const it of due) {
        if (!it.version || releasedVersionOf(it) >= it.version) continue;
        const sol = await Solution.findOne({ itemId: it.itemId, version: it.version }).select("releasedAt runId staleAt").lean();
        if (!timerMayRelease(sol, it.pipeline?.runId)) continue;
        const owner = randomUUID();
        const claimed = await Item.findOneAndUpdate(
          // The claim also requires the pipeline record to be the run that wrote this row (a hand-saved version never goes by the timer).
          { $and: [{ itemId: it.itemId, version: it.version, batchId, ...CLEAN, "pipeline.releaseAt": { $lte: now }, "pipeline.runId": sol!.runId }, unclaimed(staleBefore)] },
          // (the item is one of `counted`: the claim never reaches an item this pass did not count)
          { $set: { "pipeline.releaseClaim": { owner, at: now } } },
        ).lean();
        if (!claimed) continue;
        if (await releaseClaimed(it.itemId, it.version, owner, actor, now)) {
          report.released.push(it.itemId);
          any = true;
        }
      }
      if (any) await suggestInReview(batchId, now);
    });
    if (done === "busy") {
      // No Batch document: nothing to guard, nothing to record it on; reported (and listed live by blockedBatches).
      if (!(await Batch.exists({ batchId }))) report.blocked.push({ batchId, why: "no batch record" });
      else report.busy.push(batchId);
    }
  }
  return report;
}

/** The ids releaseDueReport(now) released. */
export async function releaseDue(now: Date, opts: Parameters<typeof releaseDueReport>[1] = {}): Promise<string[]> {
  return (await releaseDueReport(now, opts)).released;
}

/**
 * Read-only: the batches nothing of which can be released, with why and since when. Recorded ones (Batch.blockedWhy,
 * written by each release pass and cleared by it once the batch can release or has nothing left to release), plus,
 * live, batch ids that clean items carry with no Batch record.
 */
export async function blockedBatches(): Promise<BlockedBatch[]> {
  const { Batch, Item } = await ks();
  const ids = ((await Item.distinct("batchId", CLEAN)) as string[]).filter(hasBatch);
  const out: BlockedBatch[] = (await Batch.find({ blockedWhy: { $exists: true } }).select("batchId blockedWhy blockedAt").sort({ batchId: 1 }).lean<BatchDoc[]>())
    .map((b) => ({ batchId: b.batchId, why: b.blockedWhy!, ...(b.blockedAt ? { since: b.blockedAt } : {}) }));
  const known = new Set((await Batch.find({ batchId: { $in: ids } }).select("batchId").lean<{ batchId: string }[]>()).map((b) => b.batchId));
  for (const batchId of ids.filter((b) => !known.has(b)).sort()) {
    const first = await Item.findOne({ batchId, ...CLEAN }).sort({ "pipeline.passedAt": 1 }).select("pipeline").lean<ItemDoc>();
    out.push({ batchId, why: "no batch record", ...(first?.pipeline?.passedAt ? { since: first.pipeline.passedAt } : {}) });
  }
  return out;
}

// --- dry run: read only ---

export type PlanRow = { itemId: string; batchId?: string; releaseAt?: Date; state: string };
export type Plan = { now: Date; inWindow: boolean; rows: PlanRow[]; samples: { batchId: string; ids: string[] }[]; blocked: BlockedBatch[] };

/** What releaseDueReport(now) would do, and when each waiting item is due. Reads only (safe on a read-only connection). */
export async function planRelease(now: Date): Promise<Plan> {
  const { Item, Solution } = await ks();
  const open = inWindow(now);
  const items = await Item.find(CLEAN).sort({ "pipeline.releaseAt": 1, itemId: 1 })
    .select("itemId batchId version releasedVersion pipeline").lean<ItemDoc[]>();
  const reads = new Map<string, BatchRead>();
  for (const b of new Set(items.map((i) => i.batchId).filter(hasBatch))) reads.set(b, await readBatch(b));
  const rows: PlanRow[] = [];
  for (const it of items) {
    const at = it.pipeline?.releaseAt ? new Date(it.pipeline.releaseAt) : undefined;
    const row = (state: string) => rows.push({ itemId: it.itemId, ...(it.batchId ? { batchId: it.batchId } : {}), ...(at ? { releaseAt: at } : {}), state });
    if (!hasBatch(it.batchId)) { row("no batch: would be held as sample"); continue; }
    if (!at) { row("no release time: would be held for Praveen"); continue; }
    const r = reads.get(it.batchId)!;
    if (r.blocked) { row(`batch blocked (${r.blocked}): waits`); continue; }
    if (r.need.topUp.includes(it.itemId)) { row("would be held as sample"); continue; }
    if (it.pipeline?.releaseClaim) { row("being released by another call"); continue; }
    const sol = await Solution.findOne({ itemId: it.itemId, version: it.version }).select("releasedAt runId staleAt").lean();
    if (!it.version || releasedVersionOf(it) >= it.version || !sol || sol.releasedAt) { row("no unreleased solution row: skipped"); continue; }
    if (!timerMayRelease(sol, it.pipeline?.runId)) { row("not written by the run that passed it (or written for an earlier question): never released by the timer"); continue; }
    if (at.getTime() > now.getTime()) { row(`waiting until ${mountain(at)}`); continue; }
    row(open ? "would release now" : `due; outside the window, goes at ${mountain(openAtOrAfter(now))}`);
  }
  const samples = [...reads].filter(([, r]) => !r.blocked && r.need.topUp.length).map(([batchId, r]) => ({ batchId, ids: [...r.need.topUp].sort() }));
  const blocked: BlockedBatch[] = [...reads].filter(([, r]) => r.blocked).map(([batchId, r]) => ({ batchId, why: r.blocked!, ...(r.batch?.blockedAt ? { since: r.batch.blockedAt } : {}) }));
  return { now, inWindow: open, rows, samples, blocked };
}

// --- the cron job's lock ---

/** Takes the named lock until now + ttlMs unless someone else holds an unexpired one. */
export async function acquireLock(name: string, owner: string, now: Date, ttlMs: number): Promise<boolean> {
  refuseReadOnly();
  const { Lock } = await ks();
  try {
    const r = await Lock.findOneAndUpdate({ _id: name, expiresAt: { $lte: now } }, { $set: { owner, expiresAt: new Date(now.getTime() + ttlMs) } }, { upsert: true, new: true }).lean();
    return r?.owner === owner;
  } catch (e) {
    if ((e as { code?: number }).code === 11000) return false; // held, not expired
    throw e;
  }
}

/** Extends a lock this owner still holds to now + ttlMs. False when it is no longer ours (expired and taken). */
export async function renewLock(name: string, owner: string, now: Date, ttlMs: number): Promise<boolean> {
  const { Lock } = await ks();
  const r = await Lock.updateOne({ _id: name, owner }, { $set: { expiresAt: new Date(now.getTime() + ttlMs) } });
  return r.matchedCount === 1;
}

export async function releaseLock(name: string, owner: string): Promise<void> {
  const { Lock } = await ks();
  await Lock.deleteOne({ _id: name, owner });
}
