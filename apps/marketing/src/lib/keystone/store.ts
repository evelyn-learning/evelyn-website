import { SECTIONS, type SectionKind, type Stage } from "./config";
import { ks, type ActivityDoc, type ItemDoc, type SectionDoc } from "./db";
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

/** Saves a new solution version. `submit` sends it for review; otherwise it stays a draft. */
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
  const stage: Stage = opts.stage ?? (opts.submit ? "in_review" : "drafting");
  await Item.updateOne({ itemId }, { $set: { version, stage, updatedAt: new Date() } });
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

export async function setVerdict(itemId: string, verdict: "approved" | "changes", comment: string, actor: Actor) {
  const { Item } = await ks();
  const item = await Item.findOne({ itemId }).lean();
  if (!item) throw new Error(`item ${itemId} not found`);
  if (!item.version) throw new Error("There is no solution to review yet.");
  if (verdict === "changes" && !comment.trim()) throw new Error("Please say what needs to change.");
  const stage: Stage = verdict === "approved" ? "approved" : "changes_requested";
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
  await log({ itemId, type: "stage", body: note || stage, ...actor });
}

/** Adds or refreshes items from a QTI upload. Existing solutions and stages are kept. */
export async function ingestQtiItems(items: QtiItem[], actor: Actor, uploadId: string) {
  const { Item } = await ks();
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
      castleRockSolutionHtml,
      uploadId,
      updatedAt: new Date(),
    };
    const existing = await Item.findOne({ itemId: q.itemId }).lean();
    if (existing) {
      await Item.updateOne({ itemId: q.itemId }, { $set: fields });
      updated.push(q.itemId);
    } else {
      await Item.create({
        itemId: q.itemId,
        ...fields,
        evelynAnswer: "",
        keySource: q.key ? "castle-rock" : "evelyn",
        stage: "received",
        version: 0,
        showcase: false,
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
      body: existing ? "Question refreshed from an upload." : "Question received.",
      ...actor,
    });
  }
  return { created, updated };
}

/** Applies a manifest spreadsheet row: course/subject hints and the showcase flag. */
export async function applySheetRow(
  row: { itemId: string; subject?: string; course?: string; showcase?: boolean },
  actor: Actor,
): Promise<"updated" | "missing"> {
  const { Item } = await ks();
  const set: Partial<ItemDoc> = {};
  if (row.subject) set.subject = row.subject;
  if (row.course) set.course = row.course;
  if (row.showcase !== undefined) set.showcase = row.showcase;
  const res = await Item.updateOne({ itemId: row.itemId }, { $set: set });
  if (!res.matchedCount) return "missing";
  void actor;
  return "updated";
}

export { renderInline };
