// Owner review of animated solutions: reads and writes (no Next import, so the scripts and db tests use it
// directly). Every function that takes a role refuses anyone but Evelyn: the review is hers until a version
// is released. KEYSTONE_READONLY=1 refuses every write here before it reaches the models (which refuse too).
import { cp, mkdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { Types } from "mongoose";
import { isReadOnly, ks, READ_ONLY_MESSAGE, type AnimationDoc, type AnimFlagDoc } from "../db";
import type { Role } from "../config";
import { cleanComment, cleanPosition, isFlagId, isItemId, MAX_REPLY, shotsProblem } from "./pure";
import { animatedDir, shotDir } from "./files";
import { DATA_DIR } from "../assets";

export type Who = { username: string; role: Role };
export type Flag = AnimFlagDoc & { id: string };
export type Animation = AnimationDoc & { id: string };
export type Outcome<T = true> = { ok: T } | { error: string };

const OWNER_ONLY = "Only Evelyn can do that.";
const OPEN = ["open"] as const;
/** heldWhy of a ready item held because its animation was published. */
export const ANIMATION_TO_REVIEW = "Animation to review";

function writable() {
  if (isReadOnly()) throw new Error(READ_ONLY_MESSAGE);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const asFlag = (d: any): Flag => ({ ...d, id: String(d._id), _id: undefined });
const asAnim = (d: any): Animation => ({ ...d, id: String(d._id), _id: undefined });
/* eslint-enable @typescript-eslint/no-explicit-any */

// ---------- reads ----------

export type AnimRow = { itemId: string; latest: number; status: AnimationDoc["status"]; openFlags: number; versions: number; updatedAt: Date };

/** Items with an animated version: latest version, its status, open flags on the item. Null for any role but Evelyn. */
export async function listAnimations(role: Role | undefined): Promise<AnimRow[] | null> {
  if (role !== "evelyn") return null;
  const { Animation, AnimFlag } = await ks();
  const all = await Animation.find({}).sort({ itemId: 1, version: -1 }).lean();
  const open = await AnimFlag.aggregate<{ _id: string; n: number }>([{ $match: { status: "open" } }, { $group: { _id: "$itemId", n: { $sum: 1 } } }]);
  const openBy = new Map(open.map((o) => [o._id, o.n]));
  const rows = new Map<string, AnimRow>();
  for (const a of all) {
    const r = rows.get(a.itemId);
    if (r) r.versions += 1;
    else rows.set(a.itemId, { itemId: a.itemId, latest: a.version, status: a.status, openFlags: openBy.get(a.itemId) ?? 0, versions: 1, updatedAt: a.createdAt });
  }
  return [...rows.values()];
}

export type Review = {
  animation: Animation;
  versions: { version: number; status: AnimationDoc["status"]; createdAt: Date }[];
  /** Flags raised on this version. */
  flags: Flag[];
  /** Flags of earlier versions marked fixed in this one (Confirm / Reopen). */
  fixedHere: Flag[];
  /** Flags of earlier versions still open (not addressed by any later version). */
  stillOpen: Flag[];
  canAccept: boolean;
};

/** One version of an item for the review page (latest when version is omitted). Null for any role but Evelyn or when absent. */
export async function getReview(itemId: string, version: number | null, role: Role | undefined): Promise<Review | null> {
  if (role !== "evelyn" || !isItemId(itemId)) return null;
  const { Animation, AnimFlag } = await ks();
  const versions = await Animation.find({ itemId }, { version: 1, status: 1, createdAt: 1 }).sort({ version: 1 }).lean();
  if (!versions.length) return null;
  const v = version ?? versions[versions.length - 1].version;
  const a = await Animation.findOne({ itemId, version: v }).lean();
  if (!a) return null;
  const flags = (await AnimFlag.find({ itemId, version: v }).sort({ createdAt: 1 }).lean()).map(asFlag);
  const fixedHere = (await AnimFlag.find({ itemId, version: { $lt: v }, fixedInVersion: v }).sort({ createdAt: 1 }).lean()).map(asFlag);
  const stillOpen = (await AnimFlag.find({ itemId, version: { $lt: v }, status: "open" }).sort({ createdAt: 1 }).lean()).map(asFlag);
  return {
    animation: asAnim(a),
    versions: versions.map((x) => ({ version: x.version, status: x.status, createdAt: x.createdAt })),
    flags,
    fixedHere,
    stillOpen,
    // only the latest version can be accepted; an earlier one is history
    canAccept: v === versions[versions.length - 1].version && (await openFlagCount(itemId, v)) === 0 && a.status !== "accepted" && a.status !== "released",
  };
}

/** Open flags that block accepting version v: open on v or on any earlier version. */
export async function openFlagCount(itemId: string, v: number): Promise<number> {
  const { AnimFlag } = await ks();
  return AnimFlag.countDocuments({ itemId, version: { $lte: v }, status: { $in: OPEN } });
}

/** For the file route: the status of a version (undefined when it was never published). */
export async function animationStatus(itemId: string, version: number): Promise<AnimationDoc["status"] | undefined> {
  if (!isItemId(itemId)) return undefined;
  const { Animation } = await ks();
  return (await Animation.findOne({ itemId, version }, { status: 1 }).lean())?.status;
}

/** For the session script: open flags (newest version first), all items or one. No role: run by hand, read-only. */
export async function openFlags(itemId?: string): Promise<Flag[]> {
  const { AnimFlag } = await ks();
  const q = { status: "open", ...(itemId ? { itemId } : {}) };
  return (await AnimFlag.find(q).sort({ itemId: 1, version: 1, createdAt: 1 }).lean()).map(asFlag);
}

// ---------- flag lifecycle (Evelyn only) ----------

export type NewFlag = { itemId: string; version: number; step?: unknown; line?: unknown; timeMs?: unknown; comment?: unknown; spoken?: unknown };

async function saveShots(flagId: string, shots: Uint8Array[], have: string[]): Promise<string[]> {
  if (!shots.length) return have;
  const dir = shotDir(flagId);
  await mkdir(dir, { recursive: true });
  const used = new Set(have);
  const out = [...have];
  let n = 1;
  for (const s of shots) {
    while (used.has(`${n}.png`)) n++;
    const name = `${n}.png`;
    used.add(name);
    await writeFile(path.join(dir, name), s);
    out.push(name);
  }
  return out;
}

export async function createFlag(input: NewFlag, shots: Uint8Array[], who: Who): Promise<Outcome<Flag>> {
  if (who.role !== "evelyn") return { error: OWNER_ONLY };
  writable();
  if (!isItemId(input.itemId)) return { error: "No such item." };
  const { Animation, AnimFlag } = await ks();
  const a = await Animation.findOne({ itemId: input.itemId, version: input.version }).lean();
  if (!a) return { error: "No such version." };
  const comment = cleanComment(input.comment);
  if (!comment && !shots.length) return { error: "Write what is wrong, or add a picture." };
  const bad = shotsProblem(shots);
  if (bad) return { error: bad };
  const _id = new Types.ObjectId();
  const now = new Date();
  const doc: AnimFlagDoc = {
    itemId: input.itemId,
    version: input.version,
    step: cleanPosition(input.step),
    line: cleanPosition(input.line),
    timeMs: cleanPosition(input.timeMs),
    comment,
    spoken: input.spoken === true || input.spoken === "1" || input.spoken === "true",
    shots: await saveShots(String(_id), shots, []),
    status: "open",
    createdBy: who.username,
    createdAt: now,
    updatedAt: now,
  };
  await AnimFlag.create({ _id, ...doc });
  // A flag on a version that was already accepted reopens it too: "Accepted" never sits beside an open flag.
  if (a.status === "review" || a.status === "accepted") await Animation.updateOne({ itemId: a.itemId, version: a.version, status: a.status }, { $set: { status: "fixing" } });
  return { ok: { ...doc, id: String(_id) } };
}

async function ownOpen(flagId: string, who: Who) {
  if (who.role !== "evelyn") return { error: OWNER_ONLY } as const;
  if (!isFlagId(flagId)) return { error: "No such flag." } as const;
  const { AnimFlag } = await ks();
  const f = await AnimFlag.findById(flagId).lean();
  if (!f) return { error: "No such flag." } as const;
  if (f.createdBy !== who.username) return { error: "Only the person who raised a flag can change it." } as const;
  if (f.status !== "open") return { error: "Only an open flag can be changed." } as const;
  return { f } as const;
}

/** Edit own open flag: new comment and/or more pictures. */
export async function updateFlag(flagId: string, comment: unknown, shots: Uint8Array[], who: Who): Promise<Outcome> {
  const r = await ownOpen(flagId, who);
  if (r.error !== undefined) return { error: r.error };
  writable();
  const bad = shotsProblem(shots, r.f.shots.length);
  if (bad) return { error: bad };
  const text = comment === undefined ? r.f.comment : cleanComment(comment);
  const names = await saveShots(flagId, shots, r.f.shots);
  if (!text && !names.length) return { error: "Write what is wrong, or add a picture." };
  const { AnimFlag } = await ks();
  await AnimFlag.updateOne({ _id: flagId, status: "open" }, { $set: { comment: text, shots: names, updatedAt: new Date() } });
  return { ok: true };
}

/** Delete own open flag and its pictures. A version with no open flag left goes back to "review". */
export async function deleteFlag(flagId: string, who: Who): Promise<Outcome> {
  const r = await ownOpen(flagId, who);
  if (r.error !== undefined) return { error: r.error };
  writable();
  const { AnimFlag, Animation } = await ks();
  const gone = await AnimFlag.deleteOne({ _id: flagId, status: "open" });
  if (!gone.deletedCount) return { error: "The flag changed meanwhile; reload the page." };
  await rm(shotDir(flagId), { recursive: true, force: true });
  if (r.f.reopenOf) await AnimFlag.updateOne({ _id: r.f.reopenOf, status: "reopened" }, { $set: { status: "fixed", updatedAt: new Date() } });
  if (!(await AnimFlag.exists({ itemId: r.f.itemId, version: r.f.version, status: "open" })))
    await Animation.updateOne({ itemId: r.f.itemId, version: r.f.version, status: "fixing" }, { $set: { status: "review" } });
  return { ok: true };
}

/** The fix works: fixed → confirmed. */
export async function confirmFlag(flagId: string, who: Who): Promise<Outcome> {
  if (who.role !== "evelyn") return { error: OWNER_ONLY };
  if (!isFlagId(flagId)) return { error: "No such flag." };
  writable();
  const { AnimFlag } = await ks();
  const r = await AnimFlag.updateOne({ _id: flagId, status: "fixed" }, { $set: { status: "confirmed", updatedAt: new Date() } });
  return r.modifiedCount ? { ok: true } : { error: "Only a flag marked fixed can be confirmed." };
}

/**
 * The fix does not work: fixed → reopened, and a new open flag on the version that claimed the fix,
 * linked to the old one (reopenOf), carrying the comment. The comment is required.
 */
export async function reopenFlag(flagId: string, comment: unknown, who: Who): Promise<Outcome<Flag>> {
  if (who.role !== "evelyn") return { error: OWNER_ONLY };
  if (!isFlagId(flagId)) return { error: "No such flag." };
  const text = cleanComment(comment);
  if (!text) return { error: "Say what is still wrong." };
  writable();
  const { AnimFlag, Animation } = await ks();
  const old = await AnimFlag.findOneAndUpdate({ _id: flagId, status: "fixed" }, { $set: { status: "reopened", updatedAt: new Date() } }, { new: true }).lean();
  if (!old || !old.fixedInVersion) return { error: "Only a flag marked fixed can be reopened." };
  const _id = new Types.ObjectId();
  const now = new Date();
  const doc: AnimFlagDoc = {
    itemId: old.itemId,
    version: old.fixedInVersion,
    step: old.step,
    line: old.line,
    timeMs: old.timeMs,
    comment: text,
    spoken: false,
    shots: [],
    status: "open",
    reopenOf: flagId,
    createdBy: who.username,
    createdAt: now,
    updatedAt: now,
  };
  await AnimFlag.create({ _id, ...doc });
  await Animation.updateOne({ itemId: old.itemId, version: old.fixedInVersion, status: { $in: ["review", "accepted"] } }, { $set: { status: "fixing" } });
  return { ok: { ...doc, id: String(_id) } };
}

/** Accept a version: no open flag on it or any earlier version. */
export async function acceptVersion(itemId: string, version: number, who: Who): Promise<Outcome> {
  if (who.role !== "evelyn") return { error: OWNER_ONLY };
  if (!isItemId(itemId)) return { error: "No such item." };
  writable();
  const n = await openFlagCount(itemId, version);
  if (n) return { error: `${n} flag${n === 1 ? " is" : "s are"} still open.` };
  const { Animation } = await ks();
  const latest = await Animation.findOne({ itemId }, { version: 1 }).sort({ version: -1 }).lean();
  if (latest && latest.version !== version) return { error: `Only the latest version (v${latest.version}) can be accepted.` };
  const r = await Animation.updateOne({ itemId, version, status: { $in: ["review", "fixing"] } }, { $set: { status: "accepted" } });
  if (!r.modifiedCount) return { error: "This version cannot be accepted (already accepted, released or missing)." };
  // The written solution is already with Castle Rock: the accepted animation joins it now. Otherwise it goes
  // out with the written solution, when that is sent to review.
  if (await writtenIsOut(itemId)) {
    const out = await releaseAnimation(itemId);
    if ("error" in out) return out;
  }
  return { ok: true };
}

// ---------- release to Castle Rock ----------

/** Whether the item's current written solution has been released to Castle Rock's review. */
async function writtenIsOut(itemId: string): Promise<boolean> {
  const { Item } = await ks();
  const i = await Item.findOne({ itemId }).select("version releasedVersion stage").lean();
  if (!i || !i.version) return false;
  return i.stage !== "ready" && (i.releasedVersion ?? i.version) >= i.version;
}

/** Why the item cannot be sent to review because of its animation (open flags on the latest version), or null. */
export async function animationBlocksSend(itemId: string): Promise<string | null> {
  const { Animation } = await ks();
  const latest = await Animation.findOne({ itemId }, { version: 1 }).sort({ version: -1 }).lean();
  if (!latest) return null;
  const n = await openFlagCount(itemId, latest.version);
  return n ? `The animation has ${n} open flag${n === 1 ? "" : "s"}. It goes out with the solution, so the flag${n === 1 ? "" : "s"} must be fixed first.` : null;
}

/** Copies one published version into the item's player folder (what Castle Rock's page and the SOLARO download read). */
export type PlayerCopy = (itemId: string, version: number) => Promise<void>;

/** On this machine: copy beside the player folder, then swap; the folder it replaces is kept once as player.prev. */
export const copyToPlayerLocal: PlayerCopy = async (itemId, version) => {
  const from = animatedDir(itemId, version);
  if (!(await stat(from).catch(() => null))?.isDirectory()) throw new Error(`The files of v${version} are missing.`);
  const root = path.join(DATA_DIR, "assets", itemId);
  const live = path.join(root, "player");
  const next = path.join(root, `player.next-${process.pid}-${Date.now()}`);
  await cp(from, next, { recursive: true });
  if (await stat(live).catch(() => null)) {
    await rm(path.join(root, "player.prev"), { recursive: true, force: true });
    await rename(live, path.join(root, "player.prev"));
  }
  await rename(next, live);
};

/**
 * Releases the item's latest animated version to Castle Rock: its files become the item's player (the
 * "Play animated solution" button on the item page, and the animated folder of the SOLARO download) and the
 * version's status becomes "released". Refused while a flag is open. `ok: null` when the item has no
 * animation or the latest version is already the released one.
 */
export async function releaseAnimation(itemId: string, copy: PlayerCopy = copyToPlayerLocal): Promise<Outcome<{ version: number } | null>> {
  if (!isItemId(itemId)) return { error: "No such item." };
  writable();
  const { Animation, Item } = await ks();
  const a = await Animation.findOne({ itemId }).sort({ version: -1 }).lean();
  if (!a || a.status === "released") return { ok: null };
  const n = await openFlagCount(itemId, a.version);
  if (n) return { error: `${n} flag${n === 1 ? " is" : "s are"} still open on the animation.` };
  await copy(itemId, a.version);
  await Item.updateOne({ itemId }, { $set: { player: { entry: a.entry || "solution.html", voice: a.voice, height: a.height || 1100, attachedAt: new Date(), version: a.version } } });
  await Animation.updateOne({ itemId, version: a.version }, { $set: { status: "released" } });
  return { ok: { version: a.version } };
}

// ---------- publishing (scripts/keystone-animated-publish.ts) ----------

export type PublishInput = {
  itemId: string;
  entry?: string;
  height: number;
  voice?: string;
  notes?: string;
  addresses: string[];
  replies: Record<string, string>;
  createdBy: string;
};

export type PublishPlan = { version: number; addresses: Flag[]; errors: string[] };

/** What a publish would do: the next version number and the flags it addresses (each must be an open flag of the item). */
export async function planPublish(input: Pick<PublishInput, "itemId" | "addresses" | "replies">): Promise<PublishPlan> {
  const errors: string[] = [];
  if (!isItemId(input.itemId)) return { version: 0, addresses: [], errors: ["--item must be a numeric item id"] };
  const { Animation, AnimFlag } = await ks();
  const last = await Animation.findOne({ itemId: input.itemId }, { version: 1 }).sort({ version: -1 }).lean();
  const version = (last?.version ?? 0) + 1;
  const addresses: Flag[] = [];
  for (const id of input.addresses) {
    if (!isFlagId(id)) {
      errors.push(`${id}: not a flag id`);
      continue;
    }
    const f = await AnimFlag.findById(id).lean();
    if (!f) errors.push(`${id}: no such flag`);
    else if (f.itemId !== input.itemId) errors.push(`${id}: belongs to item ${f.itemId}`);
    else if (f.status !== "open") errors.push(`${id}: status is ${f.status}, not open`);
    else addresses.push(asFlag(f));
  }
  for (const id of Object.keys(input.replies)) if (!input.addresses.includes(id)) errors.push(`--reply for ${id}, which is not in --addresses`);
  return { version, addresses, errors };
}

/**
 * Records a published version (the files are already in place): inserts the animations row (version = last + 1)
 * and marks the addressed flags fixed in it with the reply. The unique index on (itemId, version) stops two
 * publishes from taking the same number.
 */
export async function recordPublish(input: PublishInput, expectVersion: number): Promise<Outcome<{ version: number; fixed: number }>> {
  writable();
  const plan = await planPublish(input);
  if (plan.errors.length) return { error: plan.errors.join("; ") };
  if (plan.version !== expectVersion) return { error: `version moved: expected v${expectVersion}, the next is v${plan.version}` };
  const { Animation, AnimFlag } = await ks();
  await Animation.create({
    itemId: input.itemId,
    version: plan.version,
    entry: input.entry || "solution.html",
    height: input.height,
    voice: input.voice,
    status: "review",
    notes: input.notes,
    addresses: plan.addresses.map((f) => f.id),
    createdAt: new Date(),
    createdBy: input.createdBy,
  });
  // Every animation gets the owner's look: a ready item that would go out by itself now waits for him.
  const { Item } = await ks();
  await Item.collection.updateOne(
    { itemId: input.itemId, stage: "ready", "pipeline.heldFor": { $exists: false } },
    { $set: { "pipeline.heldFor": "praveen", "pipeline.heldWhy": ANIMATION_TO_REVIEW }, $unset: { "pipeline.releaseClaim": "" } },
  );
  let fixed = 0;
  for (const f of plan.addresses) {
    const reply = input.replies[f.id] ? input.replies[f.id].slice(0, MAX_REPLY) : undefined;
    const r = await AnimFlag.updateOne(
      { _id: f.id, status: "open" },
      { $set: { status: "fixed", fixedInVersion: plan.version, ...(reply ? { reply } : {}), updatedAt: new Date() } },
    );
    fixed += r.modifiedCount;
  }
  return { ok: { version: plan.version, fixed } };
}


// ---------- the "To animate" list (owner's queue) ----------

export type ToAnimate = { itemId: string; course: string; stage: string; route: "api" | "hand"; requestedAt?: Date };

/** Items whose written solution exists (ready, in review or approved) and that have no animation yet. Null for any role but Evelyn. */
export async function toAnimate(role: Role | undefined): Promise<ToAnimate[] | null> {
  if (role !== "evelyn") return null;
  const { Animation, Item } = await ks();
  const have = await Animation.distinct("itemId");
  const items = await Item.find({ stage: { $in: ["ready", "in_review", "approved"] }, version: { $gt: 0 }, itemId: { $nin: have }, player: { $exists: false } })
    .select("itemId course stage animate")
    .sort({ itemId: 1 })
    .lean();
  return items.map((i) => ({ itemId: i.itemId, course: i.course || "", stage: i.stage, route: i.animate?.route === "api" ? "api" : "hand", requestedAt: i.animate?.requestedAt }));
}

/** The owner's choice of route for the ticked items: "api" queues them for the API build, "hand" takes them off it. */
export async function setAnimateRoute(itemIds: string[], route: "api" | "hand", who: Who): Promise<Outcome<number>> {
  if (who.role !== "evelyn") return { error: OWNER_ONLY };
  writable();
  const ids = itemIds.filter(isItemId);
  if (!ids.length) return { error: "Tick at least one item." };
  const { Item } = await ks();
  const r =
    route === "api"
      ? await Item.updateMany({ itemId: { $in: ids } }, { $set: { animate: { route: "api", requestedAt: new Date(), requestedBy: who.username } } })
      : await Item.updateMany({ itemId: { $in: ids } }, { $unset: { animate: "" } });
  return { ok: r.modifiedCount };
}

/** For the API build script: item ids queued for the API route that still have no animation. */
export async function queuedForApi(): Promise<string[]> {
  const { Animation, Item } = await ks();
  const have = await Animation.distinct("itemId");
  return (await Item.find({ "animate.route": "api", itemId: { $nin: have } }).select("itemId").sort({ "animate.requestedAt": 1 }).lean()).map((i) => i.itemId);
}
