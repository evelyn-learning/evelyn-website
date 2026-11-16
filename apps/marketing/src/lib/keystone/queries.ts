import { STAGES, type Stage } from "./config";
import { ks, type ActivityDoc, type ItemDoc, type SolutionDoc } from "./db";

export type ItemRow = Pick<
  ItemDoc,
  "itemId" | "subject" | "course" | "itemType" | "topic" | "stage" | "version" | "keySource" | "evelynAnswer" | "key" | "showcase" | "reviewNote" | "priorStatus" | "lastActivityAt" | "order"
>;

const ROW_FIELDS = "itemId subject course itemType topic stage version keySource evelynAnswer key showcase reviewNote priorStatus lastActivityAt order";

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

/** Next item waiting for review after `itemId` (wraps round); null when the queue is empty. */
export async function nextInQueue(itemId: string): Promise<string | null> {
  const { Item } = await ks();
  const all = await Item.find().select("itemId order stage").sort({ order: 1, itemId: 1 }).lean();
  const i = all.findIndex((r) => r.itemId === itemId);
  const ordered = [...all.slice(i + 1), ...all.slice(0, Math.max(i, 0))];
  return ordered.find((r) => r.stage === "in_review" && r.itemId !== itemId)?.itemId ?? null;
}

/** Previous/next in the full item order, for browsing. */
export async function neighbours(itemId: string): Promise<{ prev: string | null; next: string | null; index: number; total: number }> {
  const { Item } = await ks();
  const all = await Item.find().select("itemId order").sort({ order: 1, itemId: 1 }).lean();
  const i = all.findIndex((r) => r.itemId === itemId);
  return {
    prev: i > 0 ? all[i - 1].itemId : null,
    next: i >= 0 && i < all.length - 1 ? all[i + 1].itemId : null,
    index: i + 1,
    total: all.length,
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
