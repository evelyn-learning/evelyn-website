import { createHash } from "node:crypto";
import { Types } from "mongoose";
import { SECTIONS, STAGE_LABEL, VERDICTS, canJudgeSolution, normaliseCourse, releasedVersionOf, type SectionKind, type Stage, type Verdict } from "./config";
import { ks, type ActivityDoc, type BatchRow, type Flag, type ItemDoc, type PipelineDoc, type RunDoc, type SectionDoc } from "./db";
import { renderInline, renderMarkdown } from "./render";
import { assetUrl, readAsset, saveAsset } from "./assets";
import type { QtiItem } from "./qti";

// Domain operations shared by pages, route handlers and the seed script.
// No next/* imports here so scripts can use it.

export type Actor = { username: string; name: string; role: ActivityDoc["role"] };

/** Image paths in markdown resolve to the item's assets. */
const imageResolver = (itemId: string) => (src: string) => (/^(https?:|\/)/.test(src) ? src : assetUrl(itemId, src.split("/").pop()!));

export function renderSections(itemId: string, sections: { kind: SectionKind; md: string }[]): SectionDoc[] {
  const resolveImage = imageResolver(itemId);
  return SECTIONS.flatMap((kind) => {
    const s = sections.find((x) => x.kind === kind);
    if (!s || !s.md.trim()) return [];
    return [{ kind, md: s.md.trim(), html: renderMarkdown(s.md, { resolveImage }) }];
  });
}

export async function log(entry: Omit<ActivityDoc, "createdAt"> & { createdAt?: Date }) {
  const { Activity, Item } = await ks();
  const createdAt = entry.createdAt ?? new Date();
  await Activity.create({ ...entry, createdAt });
  await Item.updateOne({ itemId: entry.itemId }, { $set: { lastActivityAt: createdAt } });
}

/** The item as a pipeline run found it; a write made "if unchanged" matches these three fields. */
export type Expect = { stage: Stage; version: number; updatedAt: Date };

/** Thrown by a conditional ("if unchanged") write when the item changed since `Expect` was read. Nothing was written. */
export class SupersededError extends Error {
  constructor(itemId: string) {
    super(`item ${itemId} changed during the run`);
    this.name = "SupersededError";
  }
}

/** Mongo filter for "the item is still as `expect` found it, and not approved or delivered". */
export function unchangedFilter(itemId: string, expect: Expect) {
  return {
    itemId,
    stage: { $eq: expect.stage, $nin: ["approved", "delivered"] },
    // version 0 also matches a legacy row without the field
    version: expect.version ? expect.version : { $in: [0, null] },
    updatedAt: expect.updatedAt,
  };
}

/**
 * Saves a new solution version. `submit` sends it for review at once
 * (releases it); otherwise it stays a draft that Castle Rock cannot see.
 * `stage: "ready"` holds it after our checks: saved, not released, until
 * releaseSolution is called.
 *
 * `expect` (the pipeline): the item update is made only if the item is still as
 * `expect` found it, in one conditional update that also sets `set` (answer,
 * pipeline record) and the stage; on a mismatch the new solution row is removed
 * again and SupersededError is thrown. Never combined with `submit`.
 */
export async function saveSolution(
  itemId: string,
  sections: { kind: SectionKind; md: string }[],
  actor: Actor,
  opts: { note?: string; submit: boolean; stage?: Stage; expect?: Expect; set?: Partial<Pick<ItemDoc, "evelynAnswer" | "pipeline" | "topic">>; runId?: string },
) {
  const { Item, Solution } = await ks();
  const item = await Item.findOne({ itemId }).lean();
  if (!item) throw new Error(`item ${itemId} not found`);
  if (opts.expect) return saveSolutionIfUnchanged(item, sections, actor, { ...opts, expect: opts.expect });
  await clearOrphans(itemId, item.version || 0);
  const version = (item.version || 0) + 1;
  await Solution.create({
    itemId,
    version,
    sections: renderSections(itemId, sections),
    author: actor.name,
    note: opts.note,
  });
  // A row from before releasedVersion existed counts as released up to its current version; pin that before moving on.
  const legacy = item.releasedVersion === undefined ? { releasedVersion: item.version || 0, releasedAnswer: item.version ? item.evelynAnswer || "" : "" } : {};
  // A version written by hand never inherits the pipeline's release time or claim: the timer releases only
  // what the pipeline itself wrote and passed (release.ts timerMayRelease), and a stale time must not linger.
  await Item.updateOne({ itemId }, { $set: { version, ...legacy, updatedAt: new Date() }, $unset: { "pipeline.releaseAt": "", "pipeline.releaseClaim": "" } });
  // The revision row below is the log entry for the release too.
  if (opts.submit && opts.stage !== "ready") await releaseSolution(itemId, actor, { log: false });
  const stage: Stage = opts.stage ?? (opts.submit ? "in_review" : "drafting");
  await Item.updateOne({ itemId }, { $set: { stage, updatedAt: new Date() } });
  await log({
    itemId,
    version,
    type: "revision",
    body: opts.note || (version === 1 ? "Solution written." : `Revised to version ${version}.`),
    username: actor.username,
    name: actor.name,
    role: actor.role,
  });
  return version;
}

/** A solution row above the item's version younger than this may be a write in flight; older ones are orphans. */
export const ORPHAN_AGE_MS = 10 * 60 * 1000;

/**
 * A crash between creating a solution row and moving the item to its version leaves an
 * orphan row above item.version, and every later save of that version would die on the
 * (itemId, version) unique index. Removes such rows when no revision row refers to them
 * and they are older than ORPHAN_AGE_MS. A row written by `ownRunId` (that run finishing
 * its own write) is kept and returned instead.
 */
export async function clearOrphans(itemId: string, itemVersion: number, ownRunId?: string, now = new Date()): Promise<{ ownId?: unknown }> {
  const { Solution, Activity } = await ks();
  const rows = await Solution.find({ itemId, version: { $gt: itemVersion } }).select("_id version runId createdAt").lean();
  let ownId: unknown;
  for (const row of rows) {
    if (ownRunId && row.runId === ownRunId && row.version === itemVersion + 1) { ownId = row._id; continue; }
    if (await Activity.exists({ itemId, version: row.version, type: "revision" })) continue;
    // A missing or unreadable createdAt (NaN age) counts as young: kept.
    const age = now.getTime() - new Date(row.createdAt as Date).getTime();
    if (!(age >= ORPHAN_AGE_MS)) continue;
    await Solution.deleteOne({ _id: row._id });
  }
  return { ownId };
}

async function saveSolutionIfUnchanged(
  item: ItemDoc,
  sections: { kind: SectionKind; md: string }[],
  actor: Actor,
  opts: { note?: string; submit: boolean; stage?: Stage; expect: Expect; set?: Partial<ItemDoc>; runId?: string },
): Promise<number> {
  if (opts.submit) throw new Error("a conditional save never releases");
  const { Item, Solution } = await ks();
  const itemId = item.itemId;
  const expect = opts.expect;
  const same = item.stage === expect.stage && (item.version || 0) === expect.version && item.updatedAt?.getTime() === new Date(expect.updatedAt).getTime();
  if (!same || item.stage === "approved" || item.stage === "delivered") throw new SupersededError(itemId);
  const version = (item.version || 0) + 1;
  // Idempotent per run: a row this run already created for this version (a crash before the item
  // update) is completed rather than collided with; another run's old orphan is removed first.
  const rendered = renderSections(itemId, sections);
  const { ownId } = await clearOrphans(itemId, item.version || 0, opts.runId);
  if (ownId) await Solution.updateOne({ _id: ownId }, { $set: { sections: rendered, author: actor.name, note: opts.note } });
  // The (itemId, version) unique index also stops a concurrent save of the same version.
  const created = ownId
    ? { _id: ownId }
    : await Solution.create({ itemId, version, sections: rendered, author: actor.name, note: opts.note, ...(opts.runId ? { runId: opts.runId } : {}) });
  const legacy = item.releasedVersion === undefined ? { releasedVersion: item.version || 0, releasedAnswer: item.version ? item.evelynAnswer || "" : "" } : {};
  const stage: Stage = opts.stage ?? "drafting";
  const now = new Date();
  const r = await Item.updateOne(unchangedFilter(itemId, expect), { $set: { ...opts.set, version, ...legacy, stage, updatedAt: now } });
  if (r.matchedCount !== 1) {
    await Solution.deleteOne({ _id: created._id });
    throw new SupersededError(itemId);
  }
  await log({
    itemId,
    version,
    type: "revision",
    body: opts.note || (version === 1 ? "Solution written." : `Revised to version ${version}.`),
    username: actor.username,
    name: actor.name,
    role: actor.role,
    createdAt: now,
  });
  return version;
}

/**
 * Releases the item's latest solution version to review: Castle Rock can see
 * it from now on. Logs a "Sent for review." revision unless `log: false`
 * (saveSolution logs its own row).
 */
export async function releaseSolution(itemId: string, actor: Actor, opts: { log?: boolean } = {}) {
  const { Item, Solution } = await ks();
  const item = await Item.findOne({ itemId }).lean();
  if (!item) throw new Error(`item ${itemId} not found`);
  if (!item.version) throw new Error(`item ${itemId} has no solution to release`);
  const row = await Solution.findOne({ itemId, version: item.version }).select("staleAt").lean();
  if (row?.staleAt) throw new Error(STALE_SOLUTION);
  const now = new Date();
  await Solution.updateOne({ itemId, version: item.version, releasedAt: { $exists: false }, staleAt: { $exists: false } }, { $set: { releasedAt: now } });
  // Released by hand: no longer waiting on the owner and never released again by the timer (flags kept as history).
  await Item.updateOne(
    { itemId },
    {
      $set: { releasedVersion: item.version, releasedAnswer: item.evelynAnswer || "", stage: "in_review", updatedAt: now },
      $unset: { "pipeline.heldFor": "", "pipeline.heldWhy": "", "pipeline.releaseAt": "", "pipeline.releaseClaim": "" },
    },
  );
  if (opts.log ?? true) {
    await log({ itemId, version: item.version, type: "revision", body: SENT_FOR_REVIEW, username: actor.username, name: actor.name, role: actor.role });
  }
}

/** Why a solution written for an earlier version of a re-sent question is refused by every release path. */
export const STALE_SOLUTION = "This solution was written for an earlier version of the question (it was re-sent); a new one must be written first.";

/** The revision row releaseSolution logs. */
export const SENT_FOR_REVIEW = "Sent for review.";

/** The row the timed release logs: exactly what Evelyn's own "set status to In review" writes (actions.ts setStage). */
export const IN_REVIEW_BODY = `Status set to ${STAGE_LABEL.in_review}.`;

/**
 * The timed release's guarded form of releaseSolution (pipeline/release.ts): the same writes, logged as the
 * status change to In review that Evelyn makes by hand (so the feed reads "wrote" then "set the status to
 * in review"), safe for two callers and for a crash at any point.
 *   1. One conditional update moves the item to review, only while it is still `ready` at `version`, clean,
 *      and claimed by `owner`; it also stamps the claim with releasedAt (the one point that decides).
 *   2. finishRelease: the solution row gets releasedAt, the row is logged unless one with this exact time
 *      exists, the claim is cleared. It can be run again after a crash and writes each thing once.
 * Returns false when the claim was lost or the item changed (nothing written).
 */
export async function releaseClaimed(itemId: string, version: number, owner: string, actor: Actor, at: Date): Promise<boolean> {
  const { Item } = await ks();
  const r = await Item.updateOne(
    { itemId, version, stage: "ready", "pipeline.releaseClaim.owner": owner, "pipeline.heldFor": { $exists: false }, "pipeline.flags": { $size: 0 } },
    [{ $set: { stage: "in_review", releasedVersion: version, releasedAnswer: { $ifNull: ["$evelynAnswer", ""] }, updatedAt: at, "pipeline.releaseClaim.releasedAt": at, "pipeline.timerReleasedAt": at } }],
  );
  if (r.modifiedCount !== 1) return false;
  await finishRelease(itemId, version, owner, actor, at);
  return true;
}

/** Step 2 of releaseClaimed; also what a later call runs for a claim whose item moved to review before a crash. */
export async function finishRelease(itemId: string, version: number, owner: string, actor: Actor, at: Date) {
  const { Item, Solution, Activity } = await ks();
  await Solution.updateOne({ itemId, version, releasedAt: { $exists: false } }, { $set: { releasedAt: at } });
  if (!(await Activity.exists({ itemId, type: "stage", stage: "in_review", createdAt: at }))) {
    await log({ itemId, type: "stage", stage: "in_review", body: IN_REVIEW_BODY, username: actor.username, name: actor.name, role: actor.role, createdAt: at });
  }
  await Item.updateOne({ itemId, "pipeline.releaseClaim.owner": owner }, { $unset: { "pipeline.releaseClaim": "" } });
}

/**
 * Our working reaches `ourAnswer`, not the key: puts the item to the reviewer
 * as a key query instead of writing a solution. The working is stored as HTML.
 * Nothing here releases a solution.
 */
export async function raiseKeyQuery(itemId: string, ourAnswer: string, workingMd: string, actor: Actor, opts: { expect?: Expect; runId?: string } = {}) {
  const { Item } = await ks();
  const item = await Item.findOne({ itemId }).select("itemId").lean();
  if (!item) throw new Error(`item ${itemId} not found`);
  const now = new Date();
  const keyQuery = { ourAnswer: ourAnswer.trim(), workingHtml: renderMarkdown(workingMd, { resolveImage: imageResolver(itemId) }), raisedAt: now };
  // With `expect` (the pipeline): only if the item is still as the run found it.
  // The pipeline's key query: the item now waits on the client, not on Praveen (flags kept as history).
  // With runId, the same update marks the write as that run's (pipeline.runId / wroteStage), so a resume can
  // tell its own landed write from a person's identical change.
  const unset = opts.expect ? { $unset: { "pipeline.heldFor": "" } } : {};
  const mark = opts.runId ? { "pipeline.runId": opts.runId, "pipeline.wroteStage": "key_query" } : {};
  const r = await Item.updateOne(opts.expect ? unchangedFilter(itemId, opts.expect) : { itemId }, { $set: { stage: "key_query", keyQuery, updatedAt: now, ...mark }, ...unset });
  if (opts.expect && r.matchedCount !== 1) throw new SupersededError(itemId);
  await log({ itemId, type: "stage", stage: "key_query", body: "Queried the key.", username: actor.username, name: actor.name, role: actor.role, createdAt: now });
}

export async function setVerdict(itemId: string, verdict: Verdict, comment: string, actor: Actor) {
  const { Item } = await ks();
  const item = await Item.findOne({ itemId }).lean();
  if (!item) throw new Error(`item ${itemId} not found`);
  const rule = VERDICTS[verdict];
  if (!rule) throw new Error("Unknown decision.");
  // A key query is not a solution: it is answered by confirming the key, flagging the item data or rejecting the item.
  if (item.stage === "key_query" && rule.needsSolution) throw new Error("This item is a key query: confirm the key, flag the item data or reject the item.");
  if (verdict === "key_right" && item.stage !== "key_query") throw new Error("There is no key query on this item.");
  // A question can be flagged or rejected before any solution exists; a solution verdict needs one.
  if (rule.needsSolution && !item.version) throw new Error("There is no solution to review yet.");
  // Never judge a version Castle Rock cannot see.
  if (rule.needsSolution && !canJudgeSolution(item)) throw new Error("A new version is being prepared; there is nothing to review yet.");
  if (rule.needsNote && !comment.trim()) throw new Error(rule.needsNote);
  const stage: Stage = rule.stage;
  const now = new Date();
  const answered =
    item.stage === "key_query"
      ? { "keyQuery.answeredAt": now, ...(verdict === "key_right" ? { "keyQuery.reviewerReason": comment.trim() } : {}) }
      : {};
  await Item.updateOne({ itemId }, { $set: { stage, updatedAt: now, ...answered } });
  await log({
    itemId,
    version: item.version,
    type: "verdict",
    verdict,
    body: comment.trim() || undefined,
    username: actor.username,
    name: actor.name,
    role: actor.role,
  });
  return stage;
}

/**
 * The pipeline's intake check found the question incomplete: Item data needed,
 * with a verdict row by Evelyn carrying the note for Castle Rock's technical
 * person. Only if the item is still as `expect` found it (else SupersededError).
 */
export async function flagItemDataIfUnchanged(itemId: string, note: string, actor: Actor, expect: Expect, runId?: string) {
  const { Item } = await ks();
  const now = new Date();
  // Now waiting on the client, not on Praveen: heldFor cleared, flags kept as history.
  const r = await Item.updateOne(unchangedFilter(itemId, expect), {
    $set: { stage: "item_data", updatedAt: now, ...(runId ? { "pipeline.runId": runId, "pipeline.wroteStage": "item_data" } : {}) },
    $unset: { "pipeline.heldFor": "" },
  });
  if (r.matchedCount !== 1) throw new SupersededError(itemId);
  await log({ itemId, version: expect.version || undefined, type: "verdict", verdict: "item_data", body: note, username: actor.username, name: actor.name, role: actor.role, createdAt: now });
}

/** Records the pipeline's flags / hold on an item and nothing else (stage and updatedAt unchanged). Only if unchanged (else SupersededError). */
export async function setPipelineIfUnchanged(itemId: string, pipeline: PipelineDoc, expect: Expect) {
  const { Item } = await ks();
  const r = await Item.updateOne(unchangedFilter(itemId, expect), { $set: { pipeline } });
  if (r.matchedCount !== 1) throw new SupersededError(itemId);
}

/** Records the level the pipeline read from the question and nothing else (stage and updatedAt unchanged). Only if unchanged (else SupersededError). */
export async function setLevelIfUnchanged(itemId: string, level: string, why: string, expect: Expect) {
  const { Item } = await ks();
  const r = await Item.updateOne(unchangedFilter(itemId, expect), { $set: { course: level, courseSource: "pipeline", levelWhy: why } });
  if (r.matchedCount !== 1) throw new SupersededError(itemId);
}

/** The stages at which a person may correct an item's level (afterwards the item is settled: send it back first). */
export const LEVEL_OPEN_STAGES: Stage[] = ["received", "drafting", "ready", "in_review", "changes_requested", "item_data", "key_query"];

/**
 * A person corrects the level a solution is written to. The item changes (updatedAt), so a run in flight is
 * superseded and the next one writes to the new level. A solution the reviewer can see was written to the old
 * level: it goes back to Evelyn as "Solution changes" with the correction as the note, like any send-back.
 */
export async function correctLevel(itemId: string, level: string, note: string, actor: Actor): Promise<Stage> {
  const { Item } = await ks();
  const item = await Item.findOne({ itemId }).lean();
  if (!item) throw new Error(`item ${itemId} not found`);
  const to = normaliseCourse(level.replace(/\s+/g, " ").trim());
  if (!to) throw new Error("Please write the level, for example Math 30-1 or Grade 7 Science.");
  if (Array.from(to).length > 40 || /[<>]/.test(to)) throw new Error("Please keep the level to a short name, for example Math 30-1.");
  if (!LEVEL_OPEN_STAGES.includes(item.stage)) throw new Error("This item is settled. Send it back first if its level needs to change.");
  const from = (item.course ?? "").trim();
  if (to === from && item.courseSource === "person") throw new Error(`The level is already ${to}.`);
  const now = new Date();
  // Only a solution Castle Rock can see is sent back; one still being prepared is simply written again.
  const sendBack = item.stage === "in_review" && !!item.version && canJudgeSolution(item);
  const stage: Stage = sendBack ? "changes_requested" : item.stage;
  await Item.updateOne({ itemId }, { $set: { course: to, courseSource: "person", stage, updatedAt: now }, $unset: { levelWhy: "" } });
  const said = `Level ${from && from !== to ? `changed from ${from} to ${to}` : `set to ${to}`}.${note.trim() ? ` ${note.trim()}` : ""}`;
  await log({
    itemId,
    version: item.version || undefined,
    ...(sendBack ? { type: "verdict" as const, verdict: "changes" as const, body: `${said} Please write the solution to this level.` } : { type: "comment" as const, body: said }),
    username: actor.username,
    name: actor.name,
    role: actor.role,
  });
  return stage;
}

/** The latest reviewer verdict on an item (pipeline: key confirmed, changes asked). */
export async function lastVerdict(itemId: string): Promise<Pick<ActivityDoc, "verdict" | "body" | "createdAt"> | null> {
  const { Activity } = await ks();
  return Activity.findOne({ itemId, type: "verdict" }).sort({ createdAt: -1, _id: -1 }).select("verdict body createdAt").lean();
}

/** The run that wrote solution `version` of the item (undefined when written by a person), or null when there is no such row. */
export async function solutionRunId(itemId: string, version: number): Promise<{ runId?: string } | null> {
  const { Solution } = await ks();
  const s = await Solution.findOne({ itemId, version }).select("runId").lean();
  return s ? { runId: s.runId } : null;
}

/** The sections of the item's latest solution version, or null. */
export async function latestSections(itemId: string): Promise<{ kind: SectionKind; md: string }[] | null> {
  const { Solution } = await ks();
  const s = await Solution.findOne({ itemId }).sort({ version: -1 }).lean();
  return s ? s.sections.map((x) => ({ kind: x.kind, md: x.md })) : null;
}

// --- pipeline runs ---

/** Inserts or replaces the run record (itemId, runId). */
export async function saveRun(run: RunDoc) {
  const { Run } = await ks();
  await Run.replaceOne({ itemId: run.itemId, runId: run.runId }, run, { upsert: true });
}

export async function getRun(itemId: string, runId: string): Promise<RunDoc | null> {
  const { Run } = await ks();
  return Run.findOne({ itemId, runId }).select("-_id -__v").lean<RunDoc>();
}

/** The latest run of the item that can be resumed: not finished, or ended in an error of ours ("failed"). */
export async function resumableRun(itemId: string): Promise<RunDoc | null> {
  const last = await latestRun(itemId);
  return last && (!last.result || last.result === "failed") ? last : null;
}

/** The item's latest run (any result), or null. */
export async function latestRun(itemId: string): Promise<RunDoc | null> {
  const { Run } = await ks();
  return Run.findOne({ itemId }).sort({ startedAt: -1 }).select("-_id -__v").lean<RunDoc>();
}

// --- Praveen's final look (the queue page). Evelyn only: the actions check the role; these do not. ---
//
// Fields these write that the pipeline schema (db.ts) does not declare yet: pipeline.fixNote,
// fixRequestedAt, sentBackBy, seenAt. They are written through the native collection (mongoose's strict
// mode would drop them) and read back by .lean(), which returns the stored document as it is.

/** The owner's send-back flag: the next run rewrites the solution with pipeline.fixNote as an instruction. */
export const OWNER_SENT_BACK = "owner_sent_back";
/** heldWhy when the owner holds a clean item himself. */
export const HELD_BY_YOU = "Held by you";
export const FIX_NOTE_MAX = 2000;

export type OwnerPipeline = PipelineDoc & { fixNote?: string; fixRequestedAt?: Date; sentBackBy?: string; seenAt?: Date };
export type OwnerOutcome = { done: true } | { already: true } | { error: string };

async function readHeld(itemId: string) {
  const { Item, Solution } = await ks();
  const item = await Item.findOne({ itemId }).select("itemId stage version releasedVersion evelynAnswer pipeline").lean<ItemDoc>();
  if (!item) return { error: "There is no such item." } as const;
  const unreleased = !!item.version && releasedVersionOf(item) < item.version;
  const row = item.version ? await Solution.findOne({ itemId, version: item.version }).select("releasedAt staleAt").lean() : null;
  // A row written for an earlier version of a re-sent question is never sendable.
  return { item, unreleased: unreleased && !!row && !row.releasedAt && !row.staleAt } as const;
}

const NOT_WAITING = "This item is no longer waiting for you.";

/**
 * Sends a held solution to Castle Rock's review. One conditional update moves the item from `ready`
 * (at the version read) to `in_review` with the released version and answer; only the caller that wins it
 * writes the rest, so a double click or the timer releasing at the same moment gives `already`. Then the
 * same writes as releaseSolution: the solution row's releasedAt and the ordinary "Sent for review." row.
 * The hold and the owner's note are cleared; `pipeline.flags` is kept (history; the batch's sample count
 * reads the `sample` flag).
 */
export async function sendToReviewByOwner(itemId: string, actor: Actor, now = new Date()): Promise<OwnerOutcome> {
  const r = await readHeld(itemId);
  if ("error" in r) return { error: r.error! };
  const { item } = r;
  if (item.stage !== "ready") return item.stage === "in_review" && canJudgeSolution(item) ? { already: true } : { error: NOT_WAITING };
  if (!r.unreleased) return { error: "There is no unreleased solution to send." };
  // The animation goes out with the written solution: one approval for both.
  const { animationBlocksSend, releaseAnimation } = await import("./animreview/store");
  const blocked = await animationBlocksSend(itemId);
  if (blocked) return { error: blocked };
  const { Item, Solution } = await ks();
  const moved = await Item.collection.updateOne(
    { itemId, stage: "ready", version: item.version },
    {
      $set: { stage: "in_review", releasedVersion: item.version, releasedAnswer: item.evelynAnswer || "", updatedAt: now },
      $unset: { "pipeline.heldFor": "", "pipeline.heldWhy": "", "pipeline.releaseClaim": "", "pipeline.fixNote": "", "pipeline.fixRequestedAt": "", "pipeline.sentBackBy": "", "pipeline.seenAt": "" },
    },
  );
  if (moved.modifiedCount !== 1) {
    const again = await Item.findOne({ itemId }).select("stage version releasedVersion").lean();
    return again?.stage === "in_review" && canJudgeSolution(again) ? { already: true } : { error: NOT_WAITING };
  }
  await Solution.updateOne({ itemId, version: item.version, releasedAt: { $exists: false }, staleAt: { $exists: false } }, { $set: { releasedAt: now } });
  await log({ itemId, version: item.version, type: "revision", body: SENT_FOR_REVIEW, username: actor.username, name: actor.name, role: actor.role, createdAt: now });
  const anim = await releaseAnimation(itemId);
  if ("error" in anim) return { error: `The solution was sent, but the animation was not attached: ${anim.error}` };
  return { done: true };
}

/**
 * The owner sends a held solution back to the pipeline with a note the author must address. The stage
 * stays `ready` (Castle Rock keeps seeing Drafting); the item stays held, gains the flag OWNER_SENT_BACK
 * and pipeline.fixNote / fixRequestedAt / sentBackBy. No activity row: a row cannot be hidden from
 * Castle Rock by its type. updatedAt moves, so a run in flight on the item loses its conditional write.
 */
export async function sendBackByOwner(itemId: string, note: string, actor: Actor, now = new Date()): Promise<OwnerOutcome> {
  const text = note.trim();
  if (!text) return { error: "Write what the author must change first." };
  if (text.length > FIX_NOTE_MAX) return { error: `Keep the note under ${FIX_NOTE_MAX} characters.` };
  const r = await readHeld(itemId);
  if ("error" in r) return { error: r.error! };
  // A held ready version, or a send-back of Castle Rock's the pipeline held (changes_requested): the run rewrites it
  // with this note (for a send-back, together with the reviewer's note).
  const heldSendBack = r.item.stage === "changes_requested" && r.item.pipeline?.heldFor === "praveen";
  if (!heldSendBack && (r.item.stage !== "ready" || !r.unreleased)) return { error: NOT_WAITING };
  const { Item } = await ks();
  const u = await Item.collection.updateOne(
    heldSendBack ? { itemId, stage: "changes_requested", version: r.item.version, "pipeline.heldFor": "praveen" } : { itemId, stage: "ready", version: r.item.version },
    {
      $set: { "pipeline.heldFor": "praveen", "pipeline.fixNote": text, "pipeline.fixRequestedAt": now, "pipeline.sentBackBy": actor.username, updatedAt: now },
      $addToSet: { "pipeline.flags": OWNER_SENT_BACK },
      $unset: { "pipeline.seenAt": "", "pipeline.releaseClaim": "" },
    },
  );
  return u.matchedCount === 1 ? { done: true } : { error: NOT_WAITING };
}

/** Keep holding: records that the owner has seen it (pipeline.seenAt) and nothing else. Any held item (pipeline/holds.ts). */
export async function keepHoldingByOwner(itemId: string, now = new Date()): Promise<OwnerOutcome> {
  const { Item } = await ks();
  const u = await Item.collection.updateOne({ itemId, "pipeline.heldFor": "praveen" }, { $set: { "pipeline.seenAt": now } });
  return u.matchedCount === 1 ? { done: true } : { error: NOT_WAITING };
}

/** Stages whose hold is information only (a question re-sent mid-review or after approval): the owner clears it once seen. */
const CLEARABLE: Stage[] = ["in_review", "approved", "delivered", "rejected"];

/**
 * "Seen: clear the hold" for an information-only hold (CLEARABLE stages). The flags stay as history; the hold, its
 * reason and any note go. A later correction is then treated as any other (carriedOver no longer carries the flag).
 */
export async function clearHoldByOwner(itemId: string, now = new Date()): Promise<OwnerOutcome> {
  const { Item } = await ks();
  const u = await Item.collection.updateOne(
    { itemId, stage: { $in: CLEARABLE }, "pipeline.heldFor": "praveen" },
    { $set: { "pipeline.seenAt": now }, $unset: { "pipeline.heldFor": "", "pipeline.heldWhy": "" } },
  );
  return u.matchedCount === 1 ? { done: true } : { error: NOT_WAITING };
}

/**
 * The owner holds a clean ready item that would go out by itself. Same writes as release.ts's hold paths
 * (heldFor, heldWhy, release claim removed). Safe against the timer: its deciding update requires no hold
 * and its own claim, so either it moved the item first (then this finds no `ready` item) or it cannot.
 */
export async function holdByOwner(itemId: string): Promise<OwnerOutcome> {
  const r = await readHeld(itemId);
  if ("error" in r) return { error: r.error! };
  if (r.item.stage !== "ready" || !r.unreleased) return { error: "This item is not waiting to go out." };
  if (r.item.pipeline?.heldFor) return { already: true };
  const { Item } = await ks();
  const u = await Item.collection.updateOne(
    { itemId, stage: "ready", version: r.item.version, "pipeline.heldFor": { $exists: false } },
    { $set: { "pipeline.heldFor": "praveen", "pipeline.heldWhy": HELD_BY_YOU }, $unset: { "pipeline.releaseClaim": "" } },
  );
  if (u.modifiedCount === 1) return { done: true };
  const again = await Item.findOne({ itemId }).select("stage pipeline").lean();
  return again?.stage === "ready" && again.pipeline?.heldFor ? { already: true } : { error: "This item is not waiting to go out." };
}

export async function addComment(itemId: string, body: string, actor: Actor) {
  const { Item } = await ks();
  const item = await Item.findOne({ itemId }).lean();
  if (!item) throw new Error(`item ${itemId} not found`);
  if (!body.trim()) return;
  await log({ itemId, version: item.version || undefined, type: "comment", body: body.trim(), ...actor });
}

export async function setStage(itemId: string, stage: Stage, actor: Actor, note?: string) {
  const { Item } = await ks();
  // A status set by hand: whatever release time or claim the pipeline gave is void (the timer never acts on a hand move).
  await Item.updateOne({ itemId }, { $set: { stage, updatedAt: new Date() }, $unset: { "pipeline.releaseAt": "", "pipeline.releaseClaim": "" } });
  await log({ itemId, type: "stage", stage, body: note || stage, ...actor });
}

/**
 * Releases the latest version if it is held (not yet released). For a hand-set
 * status that puts the solution in front of Castle Rock (in review, approved,
 * delivered); no activity row of its own (the stage row says what happened).
 */
export async function releaseIfHeld(itemId: string, actor: Actor): Promise<void> {
  const { Item } = await ks();
  const item = await Item.findOne({ itemId }).select("version releasedVersion").lean();
  if (item?.version && releasedVersionOf(item) < item.version) await releaseSolution(itemId, actor, { log: false });
}

/** The object without its undefined fields (top level). */
const definedOnly = <T extends Record<string, unknown>>(o: T): Partial<T> => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;

/** JSON with object keys sorted, so the same content always gives the same text. */
function stableJson(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stableJson).join(",")}]`;
  if (v && typeof v === "object" && !(v instanceof Date)) {
    return `{${Object.keys(v as object).filter((k) => (v as Record<string, unknown>)[k] !== undefined && k !== "_id").sort().map((k) => `${JSON.stringify(k)}:${stableJson((v as Record<string, unknown>)[k])}`).join(",")}}`;
  }
  return JSON.stringify(v ?? null);
}

/**
 * A stable hash of what the solvers see of an item: the question HTML (with its passage), the options /
 * choices, the interactions and the key(s). An identical re-send has the same hash and is not an event.
 */
export function questionHash(i: Pick<ItemDoc, "questionHtml" | "options" | "interactions" | "key" | "keys">): string {
  const content = {
    questionHtml: i.questionHtml ?? "",
    options: (i.options ?? []).map((o) => ({ label: o.label, html: o.html })),
    interactions: i.interactions ?? [],
    key: i.key ?? "",
    keys: i.keys ?? {},
  };
  return createHash("sha256").update(stableJson(content)).digest("hex");
}

/** Whether an image the (new) question shows has different bytes from the file already stored (or none was). */
async function shownBytesChanged(itemId: string, fields: Pick<ItemDoc, "questionHtml" | "options" | "interactions">, files: Map<string, Uint8Array>): Promise<boolean> {
  const visible = `${fields.questionHtml}\n${JSON.stringify(fields.options ?? [])}\n${JSON.stringify(fields.interactions ?? [])}`;
  for (const [file, data] of files) {
    if (!visible.includes(assetUrl(itemId, file))) continue;
    const old = await readAsset(itemId, file);
    if (!old || !Buffer.from(data).equals(old)) return true;
  }
  return false;
}

/** heldWhy is not set for a re-sent question: the flag's words say it (status.ts FLAG_WORDS.question_resent). */
export const QUESTION_RESENT: Flag = "question_resent";
const MID_REVIEW: Stage[] = ["in_review", "changes_requested"];
const FINISHED: Stage[] = ["approved", "delivered"];

type ResendPlan = { stage: Stage; set: Record<string, unknown>; addFlag?: Flag; unset?: Record<string, ""> };

/**
 * What a re-send whose question content changed does to the item (spec: "a re-sent item starts its own clock"):
 *   - mid-review (in_review / changes_requested) or finished (approved / delivered): the stage is kept (the
 *     client is reviewing, or has decided); flag question_resent, held for Praveen, questionChangedAt;
 *   - anything else: back to `received` when it has an unreleased version or is at `ready` (else the stage the
 *     re-send gives it as before), and the pipeline record starts again ({ flags: [], resentAt }): the release
 *     time, any claim, hold, sample flag and owner's note go with the old question.
 * The caller marks the unreleased solution rows stale in the same pass.
 */
function resendPlan(existing: ItemDoc, now: Date): ResendPlan {
  const unreleased = (existing.version || 0) > releasedVersionOf(existing);
  if (MID_REVIEW.includes(existing.stage) || FINISHED.includes(existing.stage)) {
    return {
      stage: existing.stage,
      set: { "pipeline.questionChangedAt": now, "pipeline.heldFor": "praveen", updatedAt: now },
      addFlag: QUESTION_RESENT,
      unset: { "pipeline.releaseAt": "", "pipeline.releaseClaim": "" },
    };
  }
  const reopened = existing.stage === "item_data" || existing.stage === "rejected" || existing.stage === "key_query";
  const stage: Stage = unreleased || existing.stage === "ready" ? "received" : reopened ? (existing.version ? "drafting" : "received") : existing.stage;
  return { stage, set: { pipeline: { flags: [], resentAt: now }, updatedAt: now } };
}

/**
 * Adds or refreshes items from a QTI upload. Existing solutions are kept. A re-send whose question content
 * changed (questionHash, or the bytes of an image the question shows) follows resendPlan; an identical re-send
 * keeps the stage and the pipeline record exactly as they were.
 */
export async function ingestQtiItems(items: QtiItem[], actor: Actor, uploadId: string) {
  const { Item, Batch, Solution } = await ks();
  const created: string[] = [];
  const updated: string[] = [];
  const maxOrder = (await Item.findOne().sort({ order: -1 }).lean())?.order ?? 0;
  let order = maxOrder;
  for (const q of items) {
    let questionHtml = q.questionHtml;
    let castleRockSolutionHtml = q.castleRockSolutionHtml;
    let options = q.options.map((o) => ({ label: o.label, html: o.html }));
    // Interactions carry HTML too (choices, gaps, premises): rewritten in their JSON form, where a quote is \".
    let interactionsJson = JSON.stringify(q.interactions ?? []);
    const newBytes = new Map<string, Uint8Array>();
    for (const [ref, data] of q.resources) {
      const file = ref.split("/").pop()!;
      const url = assetUrl(q.itemId, file);
      newBytes.set(file, data);
      // Every place a student or reviewer sees the image: the question, every choice, every interaction, their solution.
      const swap = (h: string) => h.split(`src="${ref}"`).join(`src="${url}"`);
      questionHtml = swap(questionHtml);
      castleRockSolutionHtml = swap(castleRockSolutionHtml);
      options = options.map((o) => ({ ...o, html: swap(o.html) }));
      interactionsJson = interactionsJson.split(`src=\\"${ref}\\"`).join(`src=\\"${url}\\"`);
    }
    const fields = {
      subject: q.subject,
      course: q.course,
      grade: q.grade,
      itemType: q.itemType,
      topic: q.topic,
      standards: q.standards,
      key: q.key,
      questionHtml,
      options,
      interactions: JSON.parse(interactionsJson) as typeof q.interactions,
      keys: q.keys,
      castleRockSolutionHtml,
      qti: { apip: q.raw.apip, metadata: q.raw.metadata, resources: [...q.resources.keys()], passages: q.raw.passages },
      sourceFindings: q.sourceFindings ?? [],
      sourceNotes: q.sourceNotes ?? [],
      uploadId,
      updatedAt: new Date(),
    };
    const existing = await Item.findOne({ itemId: q.itemId }).lean();
    // Re-sending an item that was waiting on its data (or was rejected, or its key queried) hands it back to Evelyn.
    const reopened = !!existing && (existing.stage === "item_data" || existing.stage === "rejected" || existing.stage === "key_query");
    // A re-sent key query stays on the item for the record, answered by the re-send.
    const answered = existing?.stage === "key_query" ? { "keyQuery.answeredAt": new Date(), "keyQuery.reviewerReason": "Item re-sent." } : {};
    if (existing) {
      // Read before the new files overwrite them: an image the question shows that changed is a changed question.
      const changed = questionHash(existing) !== questionHash(fields) || (await shownBytesChanged(q.itemId, fields, newBytes));
      const now = new Date();
      const plan = changed ? resendPlan(existing, now) : null;
      for (const [file, data] of newBytes) await saveAsset(q.itemId, file, data);
      const stage: Stage = plan?.stage ?? (reopened ? (existing.version ? "drafting" : "received") : existing.stage);
      // Only a course that itself came from metadata is refreshed from it; a sheet course, or a row from before
      // courseSource existed (undefined, possibly a sheet course), is kept as it is.
      const { course: metadataCourse, ...withoutCourse } = fields;
      const keep = existing.courseSource === "metadata" ? { ...withoutCourse, course: metadataCourse } : withoutCourse;
      // The question, the stage and the pipeline record change in ONE update: a timer claim or a run in flight
      // that read the old item can no longer match it (stage / updatedAt moved, flags no longer empty).
      await Item.collection.updateOne(
        { itemId: q.itemId },
        // (the native driver would store an undefined field as null: dropped here, as mongoose did)
        { $set: definedOnly({ ...keep, ...answered, stage, receivedAt: now, ...(plan?.set ?? {}) }), ...(plan?.addFlag ? { $addToSet: { "pipeline.flags": plan.addFlag } } : {}), ...(plan?.unset ? { $unset: plan.unset } : {}) },
      );
      // The unreleased version was written for the old question: it can never be released by any path.
      if (plan) await Solution.updateMany({ itemId: q.itemId, version: { $gt: releasedVersionOf(existing) }, releasedAt: { $exists: false } }, { $set: { staleAt: now } });
      updated.push(q.itemId);
    } else {
      for (const [file, data] of newBytes) await saveAsset(q.itemId, file, data);
      // Spreadsheet rows that arrived before the item: every batch listing it, newest first; each field comes
      // from the newest batch whose row carries it, batchId from the newest batch listing the item.
      const batches = await Batch.find({ itemIds: q.itemId }).sort({ receivedAt: -1 }).lean();
      const rows = batches.map((b) => b.rows.find((r) => r.itemId === q.itemId)).filter((r) => !!r);
      const subject = rows.find((r) => r.subject)?.subject;
      const course = rows.find((r) => r.course)?.course;
      const showcase = rows.find((r) => r.showcase !== undefined)?.showcase;
      const now = new Date();
      await Item.create({
        itemId: q.itemId,
        ...fields,
        ...(subject ? { subject } : {}),
        ...(course ? { course } : {}),
        courseSource: course ? "sheet" : "metadata",
        ...(batches[0] ? { batchId: batches[0].batchId } : {}),
        receivedAt: now,
        evelynAnswer: "",
        keySource: q.key ? "castle-rock" : "evelyn",
        stage: "received",
        version: 0,
        releasedVersion: 0,
        releasedAnswer: "",
        showcase: showcase ?? false,
        source: "upload",
        order: ++order,
        createdAt: now,
        lastActivityAt: now,
      });
      created.push(q.itemId);
    }
    await log({
      itemId: q.itemId,
      type: "upload",
      body: reopened ? "Item re-sent; back with Evelyn." : existing ? "Question refreshed from an upload." : "Question received.",
      ...actor,
    });
  }
  return { created, updated };
}

export type BatchRef = { batchId: string; receivedAt: Date };

/** Records a spreadsheet upload as a batch; its parsed rows are kept so rows for items not uploaded yet can be applied later. */
export async function createBatch(filename: string, uploadedBy: string, rows: BatchRow[], opts: { batchId?: string; receivedAt?: Date } = {}): Promise<BatchRef> {
  const { Batch } = await ks();
  const batchId = opts.batchId ?? new Types.ObjectId().toString();
  const receivedAt = opts.receivedAt ?? new Date();
  await Batch.create({ batchId, filename, itemIds: rows.map((r) => r.itemId), rows, receivedAt, uploadedBy });
  return { batchId, receivedAt };
}

/** Applies a manifest spreadsheet row: the course (which now counts as the sheet's), subject, showcase flag and batch. */
export async function applySheetRow(row: BatchRow, batch: BatchRef): Promise<"updated" | "missing"> {
  const { Item } = await ks();
  const item = await Item.findOne({ itemId: row.itemId }).select("createdAt").lean();
  if (!item) return "missing";
  const set: Partial<ItemDoc> = { batchId: batch.batchId, receivedAt: new Date(Math.max(batch.receivedAt.getTime(), item.createdAt?.getTime() ?? 0)) };
  if (row.subject) set.subject = row.subject;
  if (row.course) {
    set.course = row.course;
    set.courseSource = "sheet";
  }
  if (row.showcase !== undefined) set.showcase = row.showcase;
  await Item.updateOne({ itemId: row.itemId }, { $set: set });
  return "updated";
}

export { renderInline };
