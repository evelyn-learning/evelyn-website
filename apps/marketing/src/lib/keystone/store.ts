import { Types } from "mongoose";
import { SECTIONS, VERDICTS, canJudgeSolution, releasedVersionOf, type SectionKind, type Stage, type Verdict } from "./config";
import { ks, type ActivityDoc, type BatchRow, type ItemDoc, type SectionDoc } from "./db";
import { renderInline, renderMarkdown } from "./render";
import { assetUrl, saveAsset } from "./assets";
import type { QtiItem } from "./qti";

// Domain operations shared by pages, route handlers and the seed script.
// No next/* imports here so scripts can use it.

export type Actor = { username: string; name: string; role: ActivityDoc["role"] };

export function renderSections(itemId: string, sections: { kind: SectionKind; md: string }[]): SectionDoc[] {
  const resolveImage = (src: string) => (/^(https?:|\/)/.test(src) ? src : assetUrl(itemId, src.split("/").pop()!));
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

/**
 * Saves a new solution version. `submit` sends it for review at once
 * (releases it); otherwise it stays a draft that Castle Rock cannot see.
 * `stage: "ready"` holds it after our checks: saved, not released, until
 * releaseSolution is called.
 */
export async function saveSolution(
  itemId: string,
  sections: { kind: SectionKind; md: string }[],
  actor: Actor,
  opts: { note?: string; submit: boolean; stage?: Stage },
) {
  const { Item, Solution } = await ks();
  const item = await Item.findOne({ itemId }).lean();
  if (!item) throw new Error(`item ${itemId} not found`);
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

export async function setVerdict(itemId: string, verdict: Verdict, comment: string, actor: Actor) {
  const { Item } = await ks();
  const item = await Item.findOne({ itemId }).lean();
  if (!item) throw new Error(`item ${itemId} not found`);
  const rule = VERDICTS[verdict];
  if (!rule) throw new Error("Unknown decision.");
  // A question can be flagged or rejected before any solution exists; a solution verdict needs one.
  if (rule.needsSolution && !item.version) throw new Error("There is no solution to review yet.");
  // Never judge a version Castle Rock cannot see.
  if (rule.needsSolution && !canJudgeSolution(item)) throw new Error("A new version is being prepared; there is nothing to review yet.");
  if (rule.needsNote && !comment.trim()) throw new Error(rule.needsNote);
  const stage: Stage = rule.stage;
  await Item.updateOne({ itemId }, { $set: { stage, updatedAt: new Date() } });
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
    // Re-sending an item that was waiting on its data (or was rejected) hands it back to Evelyn.
    const reopened = !!existing && (existing.stage === "item_data" || existing.stage === "rejected");
    if (existing) {
      const stage: Stage = reopened ? (existing.version ? "drafting" : "received") : existing.stage;
      // A course that came from the spreadsheet is not overwritten by QTI metadata.
      const { course: _metadataCourse, ...withoutCourse } = fields;
      const keep = existing.courseSource === "sheet" ? withoutCourse : { ...fields, courseSource: "metadata" as const };
      await Item.updateOne({ itemId: q.itemId }, { $set: { ...keep, stage, receivedAt: new Date() } });
      updated.push(q.itemId);
    } else {
      // A spreadsheet row that arrived before the item applies now (the latest batch listing it wins).
      const batch = await Batch.findOne({ itemIds: q.itemId }).sort({ receivedAt: -1 }).lean();
      const row = batch?.rows.find((r) => r.itemId === q.itemId);
      const now = new Date();
      await Item.create({
        itemId: q.itemId,
        ...fields,
        ...(row?.subject ? { subject: row.subject } : {}),
        ...(row?.course ? { course: row.course } : {}),
        courseSource: row?.course ? "sheet" : "metadata",
        ...(batch ? { batchId: batch.batchId } : {}),
        receivedAt: batch ? new Date(Math.max(batch.receivedAt.getTime(), now.getTime())) : now,
        evelynAnswer: "",
        keySource: q.key ? "castle-rock" : "evelyn",
        stage: "received",
        version: 0,
        releasedVersion: 0,
        releasedAnswer: "",
        showcase: row?.showcase ?? false,
        source: "upload",
        order: ++order,
        createdAt: new Date(),
        lastActivityAt: new Date(),
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

/** Records a spreadsheet upload as a batch; its parsed rows are kept so rows for items not uploaded yet can be applied later. */
export async function createBatch(filename: string, uploadedBy: string, rows: BatchRow[], batchId?: string): Promise<string> {
  const { Batch } = await ks();
  const id = batchId ?? new Types.ObjectId().toString();
  await Batch.create({ batchId: id, filename, itemIds: rows.map((r) => r.itemId), rows, receivedAt: new Date(), uploadedBy });
  return id;
}

/** Applies a manifest spreadsheet row: the course (which now counts as the sheet's), subject, showcase flag and batch. */
export async function applySheetRow(row: BatchRow, actor: Actor, batchId?: string): Promise<"updated" | "missing"> {
  const { Item } = await ks();
  const item = await Item.findOne({ itemId: row.itemId }).select("createdAt").lean();
  if (!item) return "missing";
  const set: Partial<ItemDoc> = {};
  if (row.subject) set.subject = row.subject;
  if (row.course) {
    set.course = row.course;
    set.courseSource = "sheet";
  }
  if (row.showcase !== undefined) set.showcase = row.showcase;
  if (batchId) {
    set.batchId = batchId;
    set.receivedAt = new Date(Math.max(Date.now(), item.createdAt?.getTime() ?? 0));
  }
  await Item.updateOne({ itemId: row.itemId }, { $set: set });
  void actor;
  return "updated";
}

export { renderInline };
