import { Types } from "mongoose";
import { SECTIONS, VERDICTS, canJudgeSolution, releasedVersionOf, type SectionKind, type Stage, type Verdict } from "./config";
import { ks, type ActivityDoc, type BatchRow, type ItemDoc, type PipelineDoc, type RunDoc, type SectionDoc } from "./db";
import { renderInline, renderMarkdown } from "./render";
import { assetUrl, saveAsset } from "./assets";
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
  await Item.updateOne({ itemId }, { $set: { version, ...legacy, updatedAt: new Date() } });
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
    if (now.getTime() - new Date(row.createdAt).getTime() < ORPHAN_AGE_MS) continue;
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
  const now = new Date();
  await Solution.updateOne({ itemId, version: item.version, releasedAt: { $exists: false } }, { $set: { releasedAt: now } });
  await Item.updateOne({ itemId }, { $set: { releasedVersion: item.version, releasedAnswer: item.evelynAnswer || "", stage: "in_review", updatedAt: now } });
  if (opts.log ?? true) {
    await log({ itemId, version: item.version, type: "revision", body: "Sent for review.", username: actor.username, name: actor.name, role: actor.role });
  }
}

/**
 * Our working reaches `ourAnswer`, not the key: puts the item to the reviewer
 * as a key query instead of writing a solution. The working is stored as HTML.
 * Nothing here releases a solution.
 */
export async function raiseKeyQuery(itemId: string, ourAnswer: string, workingMd: string, actor: Actor, opts: { expect?: Expect } = {}) {
  const { Item } = await ks();
  const item = await Item.findOne({ itemId }).select("itemId").lean();
  if (!item) throw new Error(`item ${itemId} not found`);
  const now = new Date();
  const keyQuery = { ourAnswer: ourAnswer.trim(), workingHtml: renderMarkdown(workingMd, { resolveImage: imageResolver(itemId) }), raisedAt: now };
  // With `expect` (the pipeline): only if the item is still as the run found it.
  // The pipeline's key query: the item now waits on the client, not on Praveen (flags kept as history).
  const unset = opts.expect ? { $unset: { "pipeline.heldFor": "" } } : {};
  const r = await Item.updateOne(opts.expect ? unchangedFilter(itemId, opts.expect) : { itemId }, { $set: { stage: "key_query", keyQuery, updatedAt: now }, ...unset });
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
export async function flagItemDataIfUnchanged(itemId: string, note: string, actor: Actor, expect: Expect) {
  const { Item } = await ks();
  const now = new Date();
  // Now waiting on the client, not on Praveen: heldFor cleared, flags kept as history.
  const r = await Item.updateOne(unchangedFilter(itemId, expect), { $set: { stage: "item_data", updatedAt: now }, $unset: { "pipeline.heldFor": "" } });
  if (r.matchedCount !== 1) throw new SupersededError(itemId);
  await log({ itemId, version: expect.version || undefined, type: "verdict", verdict: "item_data", body: note, username: actor.username, name: actor.name, role: actor.role, createdAt: now });
}

/** Records the pipeline's flags / hold on an item and nothing else (stage and updatedAt unchanged). Only if unchanged (else SupersededError). */
export async function setPipelineIfUnchanged(itemId: string, pipeline: PipelineDoc, expect: Expect) {
  const { Item } = await ks();
  const r = await Item.updateOne(unchangedFilter(itemId, expect), { $set: { pipeline } });
  if (r.matchedCount !== 1) throw new SupersededError(itemId);
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

export async function addComment(itemId: string, body: string, actor: Actor) {
  const { Item } = await ks();
  const item = await Item.findOne({ itemId }).lean();
  if (!item) throw new Error(`item ${itemId} not found`);
  if (!body.trim()) return;
  await log({ itemId, version: item.version || undefined, type: "comment", body: body.trim(), ...actor });
}

export async function setStage(itemId: string, stage: Stage, actor: Actor, note?: string) {
  const { Item } = await ks();
  await Item.updateOne({ itemId }, { $set: { stage, updatedAt: new Date() } });
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

/** Adds or refreshes items from a QTI upload. Existing solutions and stages are kept. */
export async function ingestQtiItems(items: QtiItem[], actor: Actor, uploadId: string) {
  const { Item, Batch } = await ks();
  const created: string[] = [];
  const updated: string[] = [];
  const maxOrder = (await Item.findOne().sort({ order: -1 }).lean())?.order ?? 0;
  let order = maxOrder;
  for (const q of items) {
    let questionHtml = q.questionHtml;
    let castleRockSolutionHtml = q.castleRockSolutionHtml;
    for (const [ref, data] of q.resources) {
      const url = await saveAsset(q.itemId, ref.split("/").pop()!, data);
      questionHtml = questionHtml.split(`src="${ref}"`).join(`src="${url}"`);
      castleRockSolutionHtml = castleRockSolutionHtml.split(`src="${ref}"`).join(`src="${url}"`);
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
      options: q.options.map((o) => ({ label: o.label, html: o.html })),
      interactions: q.interactions,
      keys: q.keys,
      castleRockSolutionHtml,
      qti: { apip: q.raw.apip, metadata: q.raw.metadata, resources: [...q.resources.keys()], passages: q.raw.passages },
      uploadId,
      updatedAt: new Date(),
    };
    const existing = await Item.findOne({ itemId: q.itemId }).lean();
    // Re-sending an item that was waiting on its data (or was rejected, or its key queried) hands it back to Evelyn.
    const reopened = !!existing && (existing.stage === "item_data" || existing.stage === "rejected" || existing.stage === "key_query");
    // A re-sent key query stays on the item for the record, answered by the re-send.
    const answered = existing?.stage === "key_query" ? { "keyQuery.answeredAt": new Date(), "keyQuery.reviewerReason": "Item re-sent." } : {};
    if (existing) {
      const stage: Stage = reopened ? (existing.version ? "drafting" : "received") : existing.stage;
      // Only a course that itself came from metadata is refreshed from it; a sheet course, or a row from before
      // courseSource existed (undefined, possibly a sheet course), is kept as it is.
      const { course: metadataCourse, ...withoutCourse } = fields;
      const keep = existing.courseSource === "metadata" ? { ...withoutCourse, course: metadataCourse } : withoutCourse;
      await Item.updateOne({ itemId: q.itemId }, { $set: { ...keep, ...answered, stage, receivedAt: new Date() } });
      updated.push(q.itemId);
    } else {
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
