// The timed release (spec §7). A solution that passed every check waits at stage `ready` (hidden from
// Castle Rock) and goes to review by itself about two days after its batch arrived, inside Castle Rock's
// working day (Mon–Fri 08:00–17:00 America/Edmonton), spread over 0–90 minutes per item. Anything
// flagged, and a sample of each batch, waits for Praveen instead and is never released here.
//
// Safety, by construction:
//   - nothing of a batch is released before the batch's sample was taken (applySample), and an item
//     with no batch is always held as sample;
//   - each release is one claim (a conditional update that only one caller can win) followed by
//     store.releaseClaimed, whose own conditional update is the single point that moves the item;
//     a claim left by a crash is taken over after STALE_MS, a half-finished release is completed once;
//   - outside the window, or on a read-only connection, nothing is written;
//   - the client sees only the ordinary "Sent for review." row by Evelyn Learning.
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

/** The sample of a batch for Praveen: ceil(10%), at least 3, at most all; deterministic for (ids, seed), any input order. */
export function pickSample(batchItemIds: string[], seed: string): string[] {
  const ids = [...new Set(batchItemIds)].sort();
  const k = Math.min(ids.length, Math.max(3, Math.ceil(ids.length / 10)));
  const rank = (id: string) => createHash("sha256").update(`${seed}\u0000${id}`).digest("hex");
  return ids
    .map((id) => ({ id, r: rank(id) }))
    .sort((a, b) => (a.r < b.r ? -1 : a.r > b.r ? 1 : a.id < b.id ? -1 : 1))
    .slice(0, k)
    .map((x) => x.id)
    .sort();
}

// --- the database part ---

/** The pipeline's working stages: an item here (and not held) is still on its way to a decision. */
const WORKING = ["received", "drafting"];
/** Ready, passed clean, not held: the only items the timer may release. */
const CLEAN = { stage: "ready", "pipeline.heldFor": { $exists: false }, "pipeline.flags": { $size: 0 } } as const;
const NO_BATCH = { $or: [{ batchId: { $exists: false } }, { batchId: null }, { batchId: "" }] };
const hasBatch = (b?: string | null): b is string => typeof b === "string" && b !== "";
const isClean = (i: Pick<ItemDoc, "stage" | "pipeline">) => i.stage === "ready" && !i.pipeline?.heldFor && Array.isArray(i.pipeline?.flags) && i.pipeline.flags.length === 0;

function refuseReadOnly() {
  if (isReadOnly()) throw new Error(`${READ_ONLY_MESSAGE}; the release writes, use the dry-run plan instead`);
}

type BatchRead = { batch: BatchDoc | null; done: boolean; why?: string; clean: string[]; pick: string[] };

/** Read-only: whether every item of the batch has left the working stages, and the sample it would take. */
async function readBatch(batchId: string): Promise<BatchRead> {
  const { Batch, Item } = await ks();
  const batch = await Batch.findOne({ batchId }).lean<BatchDoc>();
  if (!batch) return { batch: null, done: false, why: "no batch record", clean: [], pick: [] };
  const members = await Item.find({ batchId }).select("itemId stage pipeline").lean<Pick<ItemDoc, "itemId" | "stage" | "pipeline">[]>();
  const present = new Set(members.map((m) => m.itemId));
  // Listed in the batch's sheet but not uploaded yet (an item since moved to a newer batch counts there).
  const missing = (batch.itemIds ?? []).filter((i) => !present.has(i));
  const elsewhere = missing.length ? await Item.countDocuments({ itemId: { $in: missing } }) : 0;
  const clean = members.filter(isClean).map((m) => m.itemId);
  const pick = pickSample(clean, batchId);
  if (elsewhere < missing.length) return { batch, done: false, why: `${missing.length - elsewhere} item(s) of the sheet not uploaded yet`, clean, pick };
  const working = members.filter((m) => WORKING.includes(m.stage) && !m.pipeline?.heldFor).length;
  if (working) return { batch, done: false, why: `${working} item(s) still in the pipeline`, clean, pick };
  return { batch, done: true, clean, pick };
}

export type SampleStatus = "sampled" | "already" | "not_done" | "busy" | "no_batch";

/**
 * Takes the batch's sample for Praveen once every item of it has left the working stages: the picked
 * clean items get flag `sample`, heldFor praveen and no releaseAt (each by a conditional update: only
 * while still ready, clean and unclaimed). Once per batch: a claim on the batch first (only one caller
 * wins; a claim older than STALE_MS is taken over and its stored pick finished), sampledAt last.
 */
export async function applySample(batchId: string, now = new Date()): Promise<{ status: SampleStatus; sampled: string[]; why?: string }> {
  refuseReadOnly();
  const { Batch, Item } = await ks();
  const r = await readBatch(batchId);
  if (!r.batch) return { status: "no_batch", sampled: [], why: r.why };
  if (r.batch.sampledAt) return { status: "already", sampled: r.batch.sampledIds ?? [] };
  if (!r.done) return { status: "not_done", sampled: [], why: r.why };
  const owner = randomUUID();
  const prev = await Batch.findOneAndUpdate(
    { batchId, sampledAt: { $exists: false }, $or: [{ sampling: { $exists: false } }, { "sampling.at": { $lt: new Date(now.getTime() - STALE_MS) } }] },
    { $set: { "sampling.owner": owner, "sampling.at": now } },
    { new: false },
  ).lean<BatchDoc>();
  if (!prev) {
    const cur = await Batch.findOne({ batchId }).select("sampledAt sampledIds").lean<BatchDoc>();
    return cur?.sampledAt ? { status: "already", sampled: cur.sampledIds ?? [] } : { status: "busy", sampled: [] };
  }
  // A caller that died after picking: its pick is finished, never a second one (its items are no longer clean).
  const ids = prev.sampling?.ids ?? r.pick;
  await Batch.updateOne({ batchId, "sampling.owner": owner }, { $set: { "sampling.ids": ids } });
  for (const itemId of ids) {
    await Item.updateOne(
      { itemId, batchId, ...CLEAN, "pipeline.releaseClaim": { $exists: false } },
      { $set: { "pipeline.flags": ["sample"], "pipeline.heldFor": "praveen" }, $unset: { "pipeline.releaseAt": "" } },
    );
  }
  const done = await Batch.updateOne({ batchId, "sampling.owner": owner }, { $set: { sampledAt: now, sampledIds: ids }, $unset: { sampling: "" } });
  return done.modifiedCount === 1 ? { status: "sampled", sampled: ids } : { status: "busy", sampled: [] };
}

/** Items with no batch are always held as sample (a batch of one is all sample). Returns the ids held. */
export async function holdUnbatched(itemIds?: string[]): Promise<string[]> {
  refuseReadOnly();
  const { Item } = await ks();
  const filter = { ...CLEAN, ...NO_BATCH, "pipeline.releaseClaim": { $exists: false }, ...(itemIds ? { itemId: { $in: itemIds } } : {}) };
  const found = await Item.find(filter).select("itemId").lean<{ itemId: string }[]>();
  const held: string[] = [];
  for (const { itemId } of found) {
    const r = await Item.updateOne({ ...filter, itemId }, { $set: { "pipeline.flags": ["sample"], "pipeline.heldFor": "praveen" }, $unset: { "pipeline.releaseAt": "" } });
    if (r.modifiedCount === 1) held.push(itemId);
  }
  return held;
}

/** After a run: sample every batch it touched (each that is finished) and hold its items without a batch. */
export async function sampleAfterRun(batchIds: string[], unbatchedItemIds: string[], now = new Date()): Promise<{ batchId: string; status: SampleStatus; sampled: string[]; why?: string }[]> {
  const out = [];
  for (const batchId of [...new Set(batchIds.filter(hasBatch))]) out.push({ batchId, ...(await applySample(batchId, now)) });
  if (unbatchedItemIds.length) await holdUnbatched(unbatchedItemIds);
  return out;
}

/** Once per batch, when nothing releasable is left in it: the "ready for review" suggestion. */
async function suggestInReview(batchId: string, now: Date): Promise<void> {
  const { Batch, Item } = await ks();
  if (await Item.exists({ batchId, ...CLEAN })) return; // more to come (claimed ones in flight count too)
  const b = await Batch.findOneAndUpdate({ batchId, inReviewSuggestedAt: { $exists: false } }, { $set: { inReviewSuggestedAt: now } }, { new: true }).lean<BatchDoc>();
  if (!b) return;
  const count = await Item.countDocuments({ batchId, stage: "in_review" });
  const batchName = (b.filename || batchId).replace(/\.(xlsx|xls|csv)$/i, "");
  try {
    await suggestFor("batch_in_review", { batchName, count }, batchId);
  } catch (e) {
    await Batch.updateOne({ batchId, inReviewSuggestedAt: now }, { $unset: { inReviewSuggestedAt: "" } });
    throw e;
  }
}

/**
 * Releases every solution whose time has come: stage ready, not held, no flag, releaseAt <= now, its batch
 * sampled, its current version's solution row present and unreleased. Outside the window: [] and nothing
 * written. Returns the ids released by this call.
 */
export async function releaseDue(now: Date, opts: { actor?: Actor; staleMs?: number } = {}): Promise<string[]> {
  refuseReadOnly();
  if (!inWindow(now)) return [];
  const actor = opts.actor ?? RELEASE_ACTOR;
  const staleBefore = new Date(now.getTime() - (opts.staleMs ?? STALE_MS));
  const { Item, Batch, Solution } = await ks();

  // 0. A release that moved its item to review and then died: finish its bookkeeping once.
  const half = await Item.find({ "pipeline.releaseClaim.releasedAt": { $exists: true }, "pipeline.releaseClaim.at": { $lt: staleBefore } })
    .select("itemId batchId releasedVersion pipeline").lean<ItemDoc[]>();
  const touched = new Set<string>();
  for (const h of half) {
    const c = h.pipeline!.releaseClaim!;
    await finishRelease(h.itemId, h.releasedVersion ?? 0, c.owner, actor, new Date(c.releasedAt!));
    if (hasBatch(h.batchId)) touched.add(h.batchId);
  }

  const dueFilter = { ...CLEAN, "pipeline.releaseAt": { $lte: now } };
  const due0 = await Item.find(dueFilter).select("itemId batchId").lean<Pick<ItemDoc, "itemId" | "batchId">[]>();
  // 1. No batch: always held as sample, never released.
  const unbatched = due0.filter((i) => !hasBatch(i.batchId)).map((i) => i.itemId);
  if (unbatched.length) await holdUnbatched(unbatched);
  // 2. Sample every batch with releasable items that is not sampled yet; release nothing of one that is not.
  const batchIds = [...new Set(due0.map((i) => i.batchId).filter(hasBatch))];
  const unsampled = await Batch.find({ batchId: { $in: batchIds }, sampledAt: { $exists: false } }).select("batchId").lean<{ batchId: string }[]>();
  for (const b of unsampled) await applySample(b.batchId, now);
  const sampled = (await Batch.find({ batchId: { $in: batchIds }, sampledAt: { $exists: true } }).select("batchId").lean<{ batchId: string }[]>()).map((b) => b.batchId);

  // 3. One guarded claim per item, then the guarded release.
  const due = await Item.find({ ...dueFilter, batchId: { $in: sampled } }).sort({ "pipeline.releaseAt": 1, itemId: 1 })
    .select("itemId batchId version releasedVersion").lean<Pick<ItemDoc, "itemId" | "batchId" | "version" | "releasedVersion">[]>();
  const released: string[] = [];
  for (const it of due) {
    if (!it.version || releasedVersionOf(it) >= it.version) continue;
    const sol = await Solution.findOne({ itemId: it.itemId, version: it.version }).select("releasedAt").lean();
    if (!sol || sol.releasedAt) continue;
    const owner = randomUUID();
    const claimed = await Item.findOneAndUpdate(
      {
        itemId: it.itemId, version: it.version, batchId: it.batchId, ...dueFilter,
        $or: [{ "pipeline.releaseClaim": { $exists: false } }, { "pipeline.releaseClaim.at": { $lt: staleBefore }, "pipeline.releaseClaim.releasedAt": { $exists: false } }],
      },
      { $set: { "pipeline.releaseClaim": { owner, at: now } } },
    ).lean();
    if (!claimed) continue; // another caller has it
    if (await releaseClaimed(it.itemId, it.version, owner, actor, now)) {
      released.push(it.itemId);
      touched.add(it.batchId!);
    }
  }

  // 4. "Ready for review", once per batch, after its last releasable item.
  for (const b of touched) await suggestInReview(b, now);
  return released;
}

// --- dry run: read only ---

export type PlanRow = { itemId: string; batchId?: string; releaseAt?: Date; state: string };
export type Plan = { now: Date; inWindow: boolean; rows: PlanRow[]; samples: { batchId: string; ids: string[]; why?: string }[] };

/** What releaseDue(now) would do, and when each waiting item is due. Reads only (safe on a read-only connection). */
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
    if (!at) { row("no release time: waits for Praveen"); continue; }
    if (!hasBatch(it.batchId)) { row("no batch: would be held as sample"); continue; }
    const r = reads.get(it.batchId)!;
    if (!r.batch?.sampledAt) {
      if (!r.done) { row(`batch not sampled yet (${r.why}): waits`); continue; }
      if (r.pick.includes(it.itemId)) { row("would be held as sample"); continue; }
    }
    if (it.pipeline?.releaseClaim) { row("being released by another call"); continue; }
    const sol = await Solution.findOne({ itemId: it.itemId, version: it.version }).select("releasedAt").lean();
    if (!it.version || releasedVersionOf(it) >= it.version || !sol || sol.releasedAt) { row("no unreleased solution row: skipped"); continue; }
    if (at.getTime() > now.getTime()) { row(`waiting until ${mountain(at)}`); continue; }
    row(open ? "would release now" : `due; outside the window, goes at ${mountain(openAtOrAfter(now))}`);
  }
  const samples = [...reads].filter(([, r]) => r.batch && !r.batch.sampledAt).map(([batchId, r]) => ({ batchId, ids: r.done ? r.pick : [], ...(r.done ? {} : { why: r.why }) }));
  return { now, inWindow: open, rows, samples };
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

export async function releaseLock(name: string, owner: string): Promise<void> {
  const { Lock } = await ks();
  await Lock.deleteOne({ _id: name, owner });
}
