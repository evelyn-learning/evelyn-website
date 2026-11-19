// Review of animated solutions: reads and writes (no Next import, so the scripts and db tests use it directly).
// KEYSTONE_READONLY=1 refuses every write here before it reaches the models (which refuse too).
//
// WHO SEES AND DOES WHAT (every rule is enforced here, whatever the page or the route sends):
// - Evelyn (the owner) sees every version and every flag, and is the only one who accepts, publishes, decides.
// - Castle Rock (reviewer, tech) see one version only, the released one (the latest with status "released"),
//   and only flags raised by Castle Rock users. They never get an owner flag, its reply or its pictures, an
//   unreleased version, or the fix of their own flag before the version carrying it is released (until then
//   their flag reads as open, "with Evelyn"). They flag the released version; it stays released.
// - A flag is edited or deleted only by the person who raised it, and confirmed or reopened only by the side
//   that raised it.
//
// WHAT AN OPEN FLAG BLOCKS:
// - An open OWNER flag on version v or earlier blocks accepting v, sending the item to review and releasing
//   v: the owner's own review of what is about to go out is not finished.
// - An open CASTLE ROCK flag blocks nothing. It can only sit on a version that is already out, so holding the
//   next version back would not take the flawed one away from them; it would only keep back the fixes of
//   every other flag until this one is addressed too, and a flag raised while the owner is reviewing the next
//   version would lock his Accept. Nothing unreviewed goes out because of this: a version is still released
//   only after the owner accepted it with no open flag of his own. The Castle Rock flag stays open and in
//   front of him (item page, queue note, status email) and in front of them ("with Evelyn") until a later
//   version addresses it.
import { cp, mkdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { Types } from "mongoose";
import { isReadOnly, ks, READ_ONLY_MESSAGE, type AnimationDoc, type AnimFlagDoc } from "../db";
import type { Role } from "../config";
import { canSeeFlag, cleanComment, cleanPosition, excerpt, flagSide, isCastleRock, isFlagId, isItemId, MAX_REPLY, shotsProblem } from "./pure";
import { animatedDir, shotDir } from "./files";
import { DATA_DIR } from "../assets";

export type Who = { username: string; role: Role; name?: string };
/** `pending`: only in Castle Rock's view, a flag of theirs whose fix is in a version not released yet (shown as open, not editable). */
export type Flag = AnimFlagDoc & { id: string; pending?: boolean };
export type Animation = AnimationDoc & { id: string };
export type Outcome<T = true> = { ok: T } | { error: string };

const OWNER_ONLY = "Only Evelyn can do that.";
const NO_FLAG = "No such flag.";
const CR_ROLES = ["reviewer", "tech"];
/** Mongo filters for the two sides. A flag with no createdByRole (older than Castle Rock's tool) is the owner's. */
const BY_CASTLE_ROCK = { createdByRole: { $in: CR_ROLES } };
const BY_OWNER = { createdByRole: { $nin: CR_ROLES } };
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

/** `openFlags`: the owner's open flags (they block accepting); `castleRockOpen`: open flags raised by Castle Rock (they need him, and block nothing). */
export type AnimRow = { itemId: string; latest: number; status: AnimationDoc["status"]; openFlags: number; castleRockOpen: number; versions: number; updatedAt: Date };

/** Items with an animated version: latest version, its status, open flags on the item by side. Null for any role but Evelyn. */
export async function listAnimations(role: Role | undefined): Promise<AnimRow[] | null> {
  if (role !== "evelyn") return null;
  const { Animation, AnimFlag } = await ks();
  const all = await Animation.find({}).sort({ itemId: 1, version: -1 }).lean();
  const { owner, castleRock } = await openBySide();
  const rows = new Map<string, AnimRow>();
  for (const a of all) {
    const r = rows.get(a.itemId);
    if (r) r.versions += 1;
    else rows.set(a.itemId, { itemId: a.itemId, latest: a.version, status: a.status, openFlags: owner.get(a.itemId) ?? 0, castleRockOpen: castleRock.get(a.itemId) ?? 0, versions: 1, updatedAt: a.createdAt });
  }
  return [...rows.values()];
}

/** Open flags per item, split by who raised them. */
async function openBySide(): Promise<{ owner: Map<string, number>; castleRock: Map<string, number> }> {
  const { AnimFlag } = await ks();
  const count = async (side: object) =>
    new Map((await AnimFlag.aggregate<{ _id: string; n: number }>([{ $match: { status: "open", ...side } }, { $group: { _id: "$itemId", n: { $sum: 1 } } }])).map((o) => [o._id, o.n]));
  return { owner: await count(BY_OWNER), castleRock: await count(BY_CASTLE_ROCK) };
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
  /** Whose view this is: the lists above hold only what that side may see. */
  viewer: "owner" | "castle-rock";
};

/**
 * One version of an item for the review panel. The owner gets the version asked for (latest when omitted) with
 * every flag. Castle Rock get the released version whatever `version` says, with Castle Rock's flags only (see
 * castleRockReview). Null for no role, or when there is nothing that role may see.
 */
export async function getReview(itemId: string, version: number | null, role: Role | undefined): Promise<Review | null> {
  if (!isItemId(itemId)) return null;
  if (isCastleRock(role)) return castleRockReview(itemId);
  if (role !== "evelyn") return null;
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
    viewer: "owner",
  };
}

/** The version Castle Rock see: the latest one with status "released" (null when none is out). */
export async function releasedVersion(itemId: string): Promise<number | null> {
  if (!isItemId(itemId)) return null;
  const { Animation } = await ks();
  return (await Animation.findOne({ itemId, status: "released" }, { version: 1 }).sort({ version: -1 }).lean())?.version ?? null;
}

/**
 * Castle Rock's view: the released version, and Castle Rock's flags as far as that version tells the story.
 * - `flags`: theirs on the released version.
 * - `fixedHere`: theirs from an earlier version whose fix is in a version that is out (to Confirm or Reopen,
 *   and the ones already answered in this version).
 * - `stillOpen`: theirs from an earlier version not fixed in anything they can see.
 * A flag whose fix sits in a version not released yet is handed over as open with `pending`, without the
 * reply and the version number: they must not learn of an unreleased version, and cannot judge a fix they
 * cannot play. The owner's notes on the version and the list of versions are left out.
 */
async function castleRockReview(itemId: string): Promise<Review | null> {
  const { Animation, AnimFlag } = await ks();
  const a = await Animation.findOne({ itemId, status: "released" }).sort({ version: -1 }).lean();
  if (!a) return null;
  const v = a.version;
  const mine = (await AnimFlag.find({ itemId, version: { $lte: v }, ...BY_CASTLE_ROCK }).sort({ createdAt: 1 }).lean()).map(asFlag).map((f) => asCastleRockSees(f, v));
  return {
    animation: { ...asAnim(a), notes: undefined, addresses: [], createdBy: "" },
    versions: [{ version: v, status: "released", createdAt: a.createdAt }],
    flags: mine.filter((f) => f.version === v),
    fixedHere: mine.filter((f) => f.version < v && f.fixedInVersion !== undefined && (f.status === "fixed" || f.fixedInVersion === v)),
    stillOpen: mine.filter((f) => f.version < v && f.status === "open"),
    canAccept: false,
    viewer: "castle-rock",
  };
}

/** A Castle Rock flag as Castle Rock may see it while `released` is the version that is out. */
function asCastleRockSees(f: Flag, released: number): Flag {
  if (f.fixedInVersion === undefined || f.fixedInVersion <= released) return f;
  return { ...f, status: "open", fixedInVersion: undefined, reply: undefined, pending: true };
}

/**
 * The owner's open flags that block accepting, sending and releasing version v: open on v or on any earlier
 * version. Castle Rock's open flags are not counted (the rule and its reason are at the top of this file).
 */
export async function openFlagCount(itemId: string, v: number): Promise<number> {
  const { AnimFlag } = await ks();
  return AnimFlag.countDocuments({ itemId, version: { $lte: v }, status: "open", ...BY_OWNER });
}

/** Open flags raised by Castle Rock on the item (any version). They block nothing; the owner is shown them. */
export async function castleRockOpenCount(itemId: string): Promise<number> {
  const { AnimFlag } = await ks();
  return AnimFlag.countDocuments({ itemId, status: "open", ...BY_CASTLE_ROCK });
}

/** For the picture route: whether this role may see the pictures of this flag (false when the flag does not exist). */
export async function canSeeShots(flagId: string, role: Role | undefined): Promise<boolean> {
  if (!role || !isFlagId(flagId)) return false;
  const { AnimFlag } = await ks();
  const f = await AnimFlag.findById(flagId, { createdByRole: 1 }).lean();
  return !!f && canSeeFlag(role, f.createdByRole);
}

/** For the file route: the status of a version (undefined when it was never published). */
export async function animationStatus(itemId: string, version: number): Promise<AnimationDoc["status"] | undefined> {
  if (!isItemId(itemId)) return undefined;
  const { Animation } = await ks();
  return (await Animation.findOne({ itemId, version }, { status: 1 }).lean())?.status;
}

/** For the session script: open flags of both sides (each carries who raised it and their role), all items or one. No role: run by hand, read-only. */
export async function openFlags(itemId?: string): Promise<Flag[]> {
  const { AnimFlag } = await ks();
  const q = { status: "open", ...(itemId ? { itemId } : {}) };
  return (await AnimFlag.find(q).sort({ itemId: 1, version: 1, createdAt: 1 }).lean()).map(asFlag);
}

// ---------- flag lifecycle ----------

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

/**
 * Raise a flag. The owner: on any version. Castle Rock: only on the released version (any other version is
 * "No such version", the same answer as for one that does not exist), and the version stays released.
 */
export async function createFlag(input: NewFlag, shots: Uint8Array[], who: Who): Promise<Outcome<Flag>> {
  const castleRock = isCastleRock(who.role);
  if (who.role !== "evelyn" && !castleRock) return { error: OWNER_ONLY };
  writable();
  if (!isItemId(input.itemId)) return { error: "No such item." };
  const { Animation, AnimFlag } = await ks();
  if (castleRock && (await releasedVersion(input.itemId)) !== input.version) return { error: "No such version." };
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
    createdByRole: who.role,
    ...(who.name ? { createdByName: who.name } : {}),
    createdAt: now,
    updatedAt: now,
  };
  await AnimFlag.create({ _id, ...doc });
  // The owner's flag on a version that was already accepted reopens it too: "Accepted" never sits beside an
  // open flag. A released version stays released for either side: Castle Rock must keep seeing it.
  if (!castleRock && (a.status === "review" || a.status === "accepted")) await Animation.updateOne({ itemId: a.itemId, version: a.version, status: a.status }, { $set: { status: "fixing" } });
  return { ok: { ...doc, id: String(_id) } };
}

/** The flag, if this person may see it at all. A flag of the other side is "no such flag" for Castle Rock. */
async function seenFlag(flagId: string, who: Who) {
  if (who.role !== "evelyn" && !isCastleRock(who.role)) return { error: OWNER_ONLY } as const;
  if (!isFlagId(flagId)) return { error: NO_FLAG } as const;
  const { AnimFlag } = await ks();
  const f = await AnimFlag.findById(flagId).lean();
  if (!f || !canSeeFlag(who.role, f.createdByRole)) return { error: NO_FLAG } as const;
  return { f } as const;
}

async function ownOpen(flagId: string, who: Who) {
  const seen = await seenFlag(flagId, who);
  if (seen.error !== undefined) return seen;
  const { f } = seen;
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
  if (!(await AnimFlag.exists({ itemId: r.f.itemId, version: r.f.version, status: "open", ...BY_OWNER })))
    await Animation.updateOne({ itemId: r.f.itemId, version: r.f.version, status: "fixing" }, { $set: { status: "review" } });
  return { ok: true };
}

const THEIRS_TO_JUDGE = "Castle Rock raised this flag: they confirm the fix or reopen it once the version is released.";
const NOT_FIXED = (verb: string) => `Only a flag marked fixed can be ${verb}.`;

/**
 * A fixed flag this person may judge: one of their own side (the owner's flags for the owner, Castle Rock's
 * for any Castle Rock user), and for Castle Rock only once the version carrying the fix is released (before
 * that it reads as open to them). `released`: the version Castle Rock see now (null for the owner).
 */
async function judgeable(flagId: string, who: Who, verb: string) {
  const seen = await seenFlag(flagId, who);
  if (seen.error !== undefined) return seen;
  const { f } = seen;
  if (who.role === "evelyn") return flagSide(f.createdByRole) === "castle-rock" ? ({ error: THEIRS_TO_JUDGE } as const) : ({ f, released: null } as const);
  const released = await releasedVersion(f.itemId);
  if (f.status !== "fixed" || !f.fixedInVersion || released === null || f.fixedInVersion > released) return { error: NOT_FIXED(verb) } as const;
  return { f, released } as const;
}

/** The fix works: fixed → confirmed. By the side that raised the flag. */
export async function confirmFlag(flagId: string, who: Who): Promise<Outcome> {
  const j = await judgeable(flagId, who, "confirmed");
  if (j.error !== undefined) return { error: j.error };
  writable();
  const { AnimFlag } = await ks();
  const r = await AnimFlag.updateOne({ _id: flagId, status: "fixed" }, { $set: { status: "confirmed", updatedAt: new Date() } });
  return r.modifiedCount ? { ok: true } : { error: NOT_FIXED("confirmed") };
}

/**
 * The fix does not work: fixed → reopened, and a new open flag linked to the old one (reopenOf), carrying the
 * comment. The comment is required. By the side that raised the flag. The owner's new flag sits on the version
 * that claimed the fix (and puts it back in "fixing"); Castle Rock's sits on the released version, the one
 * they are looking at, which stays released.
 */
export async function reopenFlag(flagId: string, comment: unknown, who: Who): Promise<Outcome<Flag>> {
  const j = await judgeable(flagId, who, "reopened");
  if (j.error !== undefined) return { error: j.error };
  const text = cleanComment(comment);
  if (!text) return { error: "Say what is still wrong." };
  writable();
  const { AnimFlag, Animation } = await ks();
  const old = await AnimFlag.findOneAndUpdate({ _id: flagId, status: "fixed" }, { $set: { status: "reopened", updatedAt: new Date() } }, { new: true }).lean();
  if (!old || !old.fixedInVersion) return { error: NOT_FIXED("reopened") };
  const _id = new Types.ObjectId();
  const now = new Date();
  const doc: AnimFlagDoc = {
    itemId: old.itemId,
    version: j.released ?? old.fixedInVersion,
    step: old.step,
    line: old.line,
    timeMs: old.timeMs,
    comment: text,
    spoken: false,
    shots: [],
    status: "open",
    reopenOf: flagId,
    createdBy: who.username,
    createdByRole: who.role,
    ...(who.name ? { createdByName: who.name } : {}),
    createdAt: now,
    updatedAt: now,
  };
  await AnimFlag.create({ _id, ...doc });
  if (j.released === null) await Animation.updateOne({ itemId: old.itemId, version: old.fixedInVersion, status: { $in: ["review", "accepted"] } }, { $set: { status: "fixing" } });
  return { ok: { ...doc, id: String(_id) } };
}

/**
 * Accept a version (owner only): none of his own flags open on it or any earlier version. Castle Rock's open
 * flags do not stand in the way, whether or not this version addresses them (see the top of this file).
 */
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

/**
 * Why the item cannot be sent to review because of its animation (the owner's open flags up to the latest
 * version), or null. Castle Rock's open flags never hold a send: they are about an animation already out,
 * and a revised written solution must not wait for them.
 */
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
 * version's status becomes "released". Refused while a flag of the owner is open (Castle Rock's open flags
 * stay open across the release and show under the new version until a version addresses them). `ok: null`
 * when the item has no animation or the latest version is already the released one.
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

export type AnimateChoice = "api" | "hand" | "none" | "undecided";
export type ToAnimate = { itemId: string; course: string; stage: string; route: AnimateChoice; requestedAt?: Date; reason?: string; by?: string; askedBy?: string };
const ROUTES = ["api", "hand", "none"];

/**
 * Items whose written solution exists (ready, in review or approved) and that have no animation, with the owner's
 * decision on each: undecided, queued for API credits, queued for a by-hand build, or no animation needed.
 * Null for any role but Evelyn.
 */
export async function toAnimate(role: Role | undefined): Promise<ToAnimate[] | null> {
  if (role !== "evelyn") return null;
  const { Animation, Item } = await ks();
  const have = await Animation.distinct("itemId");
  const items = await Item.find({ stage: { $in: ["ready", "in_review", "approved"] }, version: { $gt: 0 }, itemId: { $nin: have }, player: { $exists: false } })
    .select("itemId course stage animate")
    .sort({ itemId: 1 })
    .lean();
  return items.map((i) => ({
    itemId: i.itemId,
    course: i.course || "",
    stage: i.stage,
    route: ROUTES.includes(i.animate?.route ?? "") ? (i.animate!.route as AnimateChoice) : "undecided",
    requestedAt: i.animate?.requestedAt,
    reason: i.animate?.reason,
    by: i.animate?.requestedBy,
    askedBy: i.animate?.askedBy,
  }));
}

export const AUTO = "auto";
export const NO_ANIMATION_DEFAULT = "This solution is worked in a few written steps with nothing to show on a board.";

/**
 * The owner's decision for the ticked items. "undecided" (clear the choice / put back on the list) is stored as
 * "wanted", so the automatic decision never marks the item "no animation" again. `reason` goes with "none".
 */
export async function setAnimateRoute(itemIds: string[], route: AnimateChoice, who: Who, reason?: string): Promise<Outcome<number>> {
  if (who.role !== "evelyn") return { error: OWNER_ONLY };
  writable();
  const ids = itemIds.filter(isItemId);
  if (!ids.length) return { error: "Tick at least one item." };
  const { Item } = await ks();
  const why = (reason ?? "").replace(/\s+/g, " ").trim().slice(0, 240);
  const animate = { route: route === "undecided" ? "wanted" : route, requestedAt: new Date(), requestedBy: who.username, ...(route === "none" && why ? { reason: why } : {}) };
  const r = await Item.updateMany({ itemId: { $in: ids } }, { $set: { animate } });
  return { ok: r.modifiedCount };
}

/** Items the automatic decision has not looked at: a written solution, no animation, no player, no decision at all. */
export async function needsDecision(): Promise<string[]> {
  const { Animation, Item } = await ks();
  const have = await Animation.distinct("itemId");
  return (
    await Item.find({ stage: { $in: ["ready", "in_review", "approved"] }, version: { $gt: 0 }, itemId: { $nin: have }, player: { $exists: false }, animate: { $exists: false } })
      .select("itemId")
      .sort({ itemId: 1 })
      .lean()
  ).map((i) => i.itemId);
}

/**
 * Records the automatic decision. It never overrides a person: it writes only where there is no decision yet,
 * except `reasonOnly`, which fills the reason of an item already marked "No animation needed".
 */
export async function recordTriage(itemId: string, animate: boolean, reason: string, reasonOnly = false): Promise<boolean> {
  writable();
  if (!isItemId(itemId)) return false;
  const { Item } = await ks();
  const r = reasonOnly
    ? await Item.updateOne({ itemId, "animate.route": "none" }, { $set: { "animate.reason": reason } })
    : await Item.updateOne({ itemId, animate: { $exists: false } }, { $set: { animate: { route: animate ? "wanted" : "none", requestedAt: new Date(), requestedBy: AUTO, reason } } });
  return r.modifiedCount === 1;
}

/**
 * Castle Rock asks for an animation on an item marked "No animation needed": it goes back on the owner's To
 * animate list, marked as their request. Any signed-in user may ask; the item's review status does not change.
 */
export async function askForAnimation(itemId: string, who: Who): Promise<Outcome> {
  writable();
  if (!isItemId(itemId)) return { error: "No such item." };
  const { Item } = await ks();
  const r = await Item.updateOne({ itemId, "animate.route": "none" }, { $set: { "animate.route": "wanted", "animate.askedBy": who.username, "animate.requestedAt": new Date() } });
  return r.modifiedCount ? { ok: true } : { error: "This item is not marked as needing no animation." };
}

/** For the build scripts and the session: item ids queued for a route that still have no animation, oldest request first. */
export async function queuedFor(route: "api" | "hand"): Promise<string[]> {
  const { Animation, Item } = await ks();
  const have = await Animation.distinct("itemId");
  return (await Item.find({ "animate.route": route, itemId: { $nin: have } }).select("itemId").sort({ "animate.requestedAt": 1 }).lean()).map((i) => i.itemId);
}
export const queuedForApi = () => queuedFor("api");


// ---------- the daily status email ----------

export type AnimationDigest = {
  /** Latest version published and not looked at yet (a new animation, or a fix to confirm). */
  toReview: { itemId: string; version: number; fixes: number }[];
  /** Latest version with open flags of the owner: with Evelyn's session to fix. */
  beingFixed: { itemId: string; version: number; openFlags: number }[];
  /** Open flags raised by Castle Rock on a released animation, oldest first per item: each needs a fix published. */
  castleRock: { itemId: string; version: number; who: string; role: string; comment: string }[];
  /** On the To animate list with no route chosen; askedBy = the Castle Rock user who asked for it. */
  undecided: { itemId: string; askedBy?: string }[];
  /** Route chosen, not built yet: built when a session is told to. */
  queuedApi: string[];
  queuedHand: string[];
  /** Sorted out as "No animation needed" since `since`, with who decided and the reason Castle Rock reads. */
  newlySkipped: { itemId: string; by: string; reason: string }[];
};

/** What the owner needs to know about animations today. `since`: start of the "new" window (the last 24 hours). */
export async function animationDigest(since: Date): Promise<AnimationDigest> {
  const { Animation, AnimFlag, Item } = await ks();
  const all = await Animation.find({}).sort({ itemId: 1, version: -1 }).lean();
  const latest = new Map<string, (typeof all)[number]>();
  for (const a of all) if (!latest.has(a.itemId)) latest.set(a.itemId, a);
  // Only the owner's own open flags make a version "being fixed": a Castle Rock flag leaves it reviewable and
  // acceptable, and is listed in its own group.
  const openBy = (await openBySide()).owner;
  const theirs = await AnimFlag.find({ status: "open", ...BY_CASTLE_ROCK }).sort({ itemId: 1, createdAt: 1 }).lean();
  const toReview: AnimationDigest["toReview"] = [];
  const beingFixed: AnimationDigest["beingFixed"] = [];
  for (const a of latest.values()) {
    const n = openBy.get(a.itemId) ?? 0;
    if (n) beingFixed.push({ itemId: a.itemId, version: a.version, openFlags: n });
    else if (a.status === "review" || a.status === "fixing") toReview.push({ itemId: a.itemId, version: a.version, fixes: (a.addresses ?? []).length });
  }
  const todo = (await toAnimate("evelyn")) ?? [];
  const skipped = await Item.find({ "animate.route": "none", "animate.requestedAt": { $gte: since }, player: { $exists: false } }).select("itemId animate").sort({ itemId: 1 }).lean();
  return {
    toReview,
    beingFixed,
    castleRock: theirs.map((f) => ({ itemId: f.itemId, version: f.version, who: f.createdByName || f.createdBy, role: f.createdByRole ?? "", comment: excerpt(f.comment) || (f.shots.length ? "(picture only)" : "") })),
    undecided: todo.filter((t) => t.route === "undecided").map((t) => ({ itemId: t.itemId, ...(t.askedBy ? { askedBy: t.askedBy } : {}) })),
    queuedApi: todo.filter((t) => t.route === "api").map((t) => t.itemId),
    queuedHand: todo.filter((t) => t.route === "hand").map((t) => t.itemId),
    newlySkipped: skipped.map((i) => ({ itemId: i.itemId, by: i.animate?.requestedBy === AUTO ? "automatically" : `by ${i.animate?.requestedBy ?? "?"}`, reason: i.animate?.reason || NO_ANIMATION_DEFAULT })),
  };
}
