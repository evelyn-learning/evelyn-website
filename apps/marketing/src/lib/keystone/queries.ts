import { STAGES, visibleStage, type Role, type Stage } from "./config";
import { ks, type ActivityDoc, type ItemDoc, type SolutionDoc } from "./db";

export type ItemRow = Pick<
  ItemDoc,
  "itemId" | "subject" | "course" | "itemType" | "topic" | "stage" | "version" | "keySource" | "evelynAnswer" | "key" | "showcase" | "reviewNote" | "priorStatus" | "lastActivityAt" | "order" | "player" | "releasedVersion"
>;

const ROW_FIELDS = "itemId subject course itemType topic stage version releasedVersion keySource evelynAnswer key showcase reviewNote priorStatus lastActivityAt order player.entry";

// Hidden until released: Castle Rock (reviewer, tech) never sees a solution
// version above Item.releasedVersion, and sees stage `ready` as `drafting`.
// Rows from before releasedVersion existed count as fully released.

const seesUnreleased = (role?: Role) => !role || role === "evelyn";

/** Highest version this role may see. */
export function releasedFor(item: Pick<ItemDoc, "version" | "releasedVersion">, role?: Role): number {
  if (seesUnreleased(role)) return item.version || 0;
  return Math.min(item.releasedVersion ?? item.version ?? 0, item.version || 0);
}

/** The item as this role sees it: stage via visibleStage, version capped at the released one. */
function asSeenBy<T extends Pick<ItemDoc, "stage" | "version" | "releasedVersion">>(item: T, role?: Role): T {
  if (seesUnreleased(role)) return item;
  return { ...item, stage: visibleStage(item.stage, role!), version: releasedFor(item, role) };
}

/** Stages a stage filter matches for this role: `drafting` includes `ready` for Castle Rock; `ready` is no filter for them. */
function stagesFor(stage: Stage | Stage[] | undefined, role?: Role): Stage[] | undefined {
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
 * not yet released are dropped, and other rows above the released version
 * lose their version number.
 */
function activitySeenBy(rows: ActivityDoc[], released: (itemId: string) => number, role?: Role): ActivityDoc[] {
  if (seesUnreleased(role)) return rows;
  return rows.flatMap((a) => {
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
