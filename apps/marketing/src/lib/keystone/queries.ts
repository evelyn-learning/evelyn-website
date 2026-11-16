import { STAGES, type Stage } from "./config";
import { ks, type ActivityDoc, type ItemDoc, type SolutionDoc } from "./db";

export type ItemRow = Pick<
  ItemDoc,
  "itemId" | "subject" | "course" | "itemType" | "topic" | "stage" | "version" | "keySource" | "evelynAnswer" | "key" | "showcase" | "reviewNote" | "priorStatus" | "lastActivityAt" | "order" | "player"
>;

const ROW_FIELDS = "itemId subject course itemType topic stage version keySource evelynAnswer key showcase reviewNote priorStatus lastActivityAt order player.entry";

export async function stageCounts(): Promise<Record<Stage, number>> {
  const { Item } = await ks();
  const rows = await Item.aggregate<{ _id: Stage; n: number }>([{ $group: { _id: "$stage", n: { $sum: 1 } } }]);
  const out = Object.fromEntries(STAGES.map((s) => [s, 0])) as Record<Stage, number>;
  for (const r of rows) if (r._id in out) out[r._id] = r.n;
  return out;
}

export async function listItems(filter: { stage?: Stage | Stage[]; subject?: string } = {}): Promise<ItemRow[]> {
  const { Item } = await ks();
  const q: Record<string, unknown> = {};
  if (filter.stage) q.stage = Array.isArray(filter.stage) ? { $in: filter.stage } : filter.stage;
  if (filter.subject) q.subject = filter.subject;
  return Item.find(q).select(ROW_FIELDS).sort({ order: 1, itemId: 1 }).lean<ItemRow[]>();
}

/** The review queue: everything waiting for Castle Rock, in item order. */
export async function reviewQueue(): Promise<string[]> {
  const rows = await listItems({ stage: "in_review" });
  return rows.map((r) => r.itemId);
}

/** Items of a list in order; the current item is kept in place even if it has just left the list (e.g. after a verdict). */
async function listOrder(filter: { stage?: Stage; subject?: string }, keep?: string) {
  const { Item } = await ks();
  const q: Record<string, unknown> = {};
  if (filter.stage) q.stage = filter.stage;
  if (filter.subject) q.subject = filter.subject;
  const where = keep ? { $or: [q, { itemId: keep }] } : q;
  return Item.find(where).select("itemId order stage subject").sort({ order: 1, itemId: 1 }).lean();
}

const inFilter = (r: { stage?: string; subject?: string }, f: { stage?: Stage; subject?: string }) =>
  (!f.stage || r.stage === f.stage) && (!f.subject || r.subject === f.subject);

/**
 * Where to go after a verdict. In a filtered list: the next item still in
 * that list. Otherwise: the next item waiting for review (wrapping round).
 * Null when there is nothing further.
 */
export async function nextInQueue(itemId: string, filter: { stage?: Stage; subject?: string } = {}): Promise<string | null> {
  if (filter.stage || filter.subject) {
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
  filter: { stage?: Stage; subject?: string } = {},
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

export async function getItem(itemId: string, version?: number) {
  const { Item, Solution, Activity } = await ks();
  const item = await Item.findOne({ itemId }).lean<ItemDoc>();
  if (!item) return null;
  const v = version ?? item.version;
  const [solution, activity, versions] = await Promise.all([
    v ? Solution.findOne({ itemId, version: v }).lean<SolutionDoc>() : null,
    Activity.find({ itemId }).sort({ createdAt: -1 }).limit(50).lean<ActivityDoc[]>(),
    Solution.find({ itemId }).select("version createdAt author").sort({ version: -1 }).lean(),
  ]);
  return { item, solution, activity, versions: versions.map((x) => x.version) };
}

export async function recentActivity(opts: { limit?: number; roles?: string[]; types?: string[] } = {}) {
  const { Activity } = await ks();
  const q: Record<string, unknown> = {};
  if (opts.roles) q.role = { $in: opts.roles };
  if (opts.types) q.type = { $in: opts.types };
  return Activity.find(q).sort({ createdAt: -1 }).limit(opts.limit ?? 12).lean<ActivityDoc[]>();
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
