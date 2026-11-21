// Database test for the review of animated solutions: role gate, version numbering, the flag lifecycle
// (open → fixed → confirmed / reopened), accept, pictures on disk, read-only refusal, and Castle Rock's own
// flags on the released version (what each side sees, who may change what, what blocks an accept or a release,
// the status email's group). Needs a local mongod:
//   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses castle_rock_review_test and only item ids 9931xx; deletes only what it created.
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri)) {
  console.error(`animreview.dbtest refused to run: KEYSTONE_MONGODB_URI must be mongodb://127.0.0.1:27017 or mongodb://localhost:27017 (got "${uri || "unset"}"). It must never point at the production tunnel.`);
  process.exit(1);
}
const DB = "castle_rock_review_test";
process.env.KEYSTONE_DB_NAME = DB;
const DATA = path.join(tmpdir(), "ks-anim-dbtest");
process.env.KEYSTONE_DATA_DIR = DATA;
delete process.env.KEYSTONE_READONLY;

const A = "993101";
const B = "993102";
const C = "993103";
const D = "993104";
const E = "993105";
const OWNER = { username: "qa-owner", role: "evelyn" as const };
const OTHER = { username: "qa-owner-2", role: "evelyn" as const };
const REVIEWER = { username: "qa-rev", role: "reviewer" as const, name: "QA Reviewer" };
const TECH = { username: "qa-tech", role: "tech" as const, name: "QA Tech" };
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);

(async () => {
  const { ks, closeKs } = await import("../db");
  const s = await import("./store");
  const { shotDir } = await import("./files");
  const { Animation, AnimFlag } = await ks();
  assert.equal(Animation.db.name, DB, "must run against the test database");
  await Promise.all([Animation.init(), AnimFlag.init()]);
  const clean = async () => {
    await Animation.deleteMany({ itemId: { $in: [A, B, C, D, E] } });
    await AnimFlag.deleteMany({ itemId: { $in: [A, B, C, D, E] } });
    await (await ks()).Item.deleteMany({ itemId: { $in: [C, D, E] } });
    await rm(DATA, { recursive: true, force: true });
  };
  const ok = <T>(r: { ok: T } | { error: string }): T => {
    if ("error" in r) assert.fail(r.error);
    return r.ok;
  };
  const err = (r: { ok: unknown } | { error: string }, re: RegExp, why = "") => {
    assert.ok("error" in r, `expected an error matching ${re}${why && `: ${why}`}`);
    assert.match(r.error, re, why || undefined);
  };
  const pub = (itemId: string, addresses: string[] = [], replies: Record<string, string> = {}, expect?: number) =>
    s.planPublish({ itemId, addresses, replies }).then((p) => s.recordPublish({ itemId, height: 900, addresses, replies, createdBy: "qa" }, expect ?? p.version));

  await clean();
  try {
    // --- version numbering ---
    assert.equal((await s.planPublish({ itemId: A, addresses: [], replies: {} })).version, 1);
    assert.equal(ok(await pub(A)).version, 1);
    assert.equal((await s.planPublish({ itemId: A, addresses: [], replies: {} })).version, 2);
    err(await pub(A, [], {}, 5), /version moved/);
    await assert.rejects(Animation.create({ itemId: A, version: 1, status: "review", height: 1, addresses: [], createdBy: "x" }), /duplicate key/, "unique (itemId, version)");
    assert.equal(ok(await pub(B)).version, 1, "numbering is per item");

    // --- role gate ---
    for (const role of ["reviewer", "tech", undefined] as const) {
      assert.equal(await s.listAnimations(role), null, `list refuses ${role}`);
      assert.equal(await s.getReview(A, null, role), null, `review refuses ${role}`);
    }
    err(await s.createFlag({ itemId: A, version: 1, comment: "x" }, [], REVIEWER), /No such version/, "Castle Rock cannot flag a version that is not released");
    assert.equal(await AnimFlag.countDocuments({ itemId: A }), 0);
    err(await s.acceptVersion(A, 1, REVIEWER), /Only Evelyn/);
    assert.equal(await s.animationStatus(A, 1), "review");
    assert.equal(await s.animationStatus(A, 9), undefined);
    const rows = (await s.listAnimations("evelyn"))!.filter((r) => r.itemId === A || r.itemId === B);
    assert.equal(rows.length, 2);

    // --- flags on v1 ---
    err(await s.createFlag({ itemId: A, version: 7, comment: "x" }, [], OWNER), /No such version/);
    err(await s.createFlag({ itemId: A, version: 1, comment: "  " }, [], OWNER), /Write what is wrong/);
    err(await s.createFlag({ itemId: A, version: 1, comment: "x" }, [new Uint8Array(20)], OWNER), /PNG/);
    const f1 = ok(await s.createFlag({ itemId: A, version: 1, step: "1", line: "2", timeMs: "15300", comment: " arrow too short ", spoken: "1" }, [PNG, PNG], OWNER));
    assert.deepEqual([f1.step, f1.line, f1.timeMs, f1.comment, f1.spoken, f1.status], [1, 2, 15300, "arrow too short", true, "open"]);
    assert.equal((await AnimFlag.findById(f1.id).lean())!.createdByRole, "evelyn", "the role of who raised it is stored");
    assert.deepEqual(f1.shots, ["1.png", "2.png"]);
    assert.ok(existsSync(path.join(shotDir(f1.id), "2.png")), "pictures on disk");
    const f2 = ok(await s.createFlag({ itemId: A, version: 1, step: "", comment: "legacy page: no position" }, [], OWNER));
    assert.deepEqual([f2.step, f2.line, f2.timeMs], [null, null, null], "no esPlayer: position unknown");
    const f3 = ok(await s.createFlag({ itemId: A, version: 1, comment: "to delete" }, [PNG], OWNER));
    assert.equal(await s.animationStatus(A, 1), "fixing", "a flag puts the version in fixing");

    // edit / delete: own open flag only
    err(await s.updateFlag(f1.id, "theirs", [], OTHER), /Only the person/);
    ok(await s.updateFlag(f1.id, "arrow too short at the collision", [PNG], OWNER));
    assert.deepEqual((await AnimFlag.findById(f1.id).lean())!.shots, ["1.png", "2.png", "3.png"]);
    err(await s.updateFlag(f1.id, undefined, Array(6).fill(PNG), OWNER), /At most 8/);
    err(await s.deleteFlag(f3.id, OTHER), /Only the person/);
    ok(await s.deleteFlag(f3.id, OWNER));
    assert.ok(!existsSync(shotDir(f3.id)), "pictures removed with the flag");

    // accept is blocked while flags are open
    err(await s.acceptVersion(A, 1, OWNER), /2 flags are still open/);
    assert.equal((await s.getReview(A, 1, "evelyn"))!.canAccept, false);
    assert.equal((await s.listAnimations("evelyn"))!.find((r) => r.itemId === A)!.openFlags, 2);

    // --- publish v2 addressing f1 only ---
    const bad = await s.planPublish({ itemId: B, addresses: [f1.id], replies: {} });
    assert.match(bad.errors.join(), /belongs to item/);
    assert.match((await s.planPublish({ itemId: A, addresses: [], replies: { [f1.id]: "x" } })).errors.join(), /not in --addresses/);
    const v2 = ok(await pub(A, [f1.id], { [f1.id]: "Longer arrow, drawn after the bounce" }));
    assert.deepEqual(v2, { version: 2, fixed: 1 });
    const f1fixed = (await AnimFlag.findById(f1.id).lean())!;
    assert.deepEqual([f1fixed.status, f1fixed.fixedInVersion, f1fixed.reply], ["fixed", 2, "Longer arrow, drawn after the bounce"]);
    assert.match((await s.planPublish({ itemId: A, addresses: [f1.id], replies: {} })).errors.join(), /status is fixed/, "a fixed flag cannot be addressed again");
    err(await s.updateFlag(f1.id, "late edit", [], OWNER), /Only an open flag/);

    const r2 = (await s.getReview(A, null, "evelyn"))!;
    assert.equal(r2.animation.version, 2, "latest by default");
    assert.deepEqual(r2.fixedHere.map((f) => f.id), [f1.id]);
    assert.deepEqual(r2.stillOpen.map((f) => f.id), [f2.id]);
    assert.equal(r2.canAccept, false, "f2 still open on v1 blocks v2");
    assert.deepEqual(r2.versions.map((v) => v.version), [1, 2]);

    // --- reopen: needs a comment, creates an open flag on v2 linked to f1 ---
    err(await s.reopenFlag(f1.id, " ", OWNER), /still wrong/);
    err(await s.reopenFlag(f2.id, "x", OWNER), /Only a flag marked fixed/);
    const f1b = ok(await s.reopenFlag(f1.id, "still short on the phone", OWNER));
    assert.deepEqual([f1b.version, f1b.status, f1b.reopenOf, f1b.step], [2, "open", f1.id, 1]);
    assert.equal((await AnimFlag.findById(f1.id).lean())!.status, "reopened");
    err(await s.confirmFlag(f1.id, OWNER), /Only a flag marked fixed/);
    assert.equal(await s.animationStatus(A, 2), "fixing");
    // deleting the reopen flag puts the old one back to fixed
    ok(await s.deleteFlag(f1b.id, OWNER));
    assert.equal((await AnimFlag.findById(f1.id).lean())!.status, "fixed");
    assert.equal(await s.animationStatus(A, 2), "review", "no open flag left on v2");

    // --- v3 fixes f2; confirm both; accept ---
    const v3 = ok(await pub(A, [f2.id], { [f2.id]: "Position now recorded" }));
    assert.equal(v3.version, 3);
    ok(await s.confirmFlag(f1.id, OWNER));
    ok(await s.confirmFlag(f2.id, OWNER));
    assert.equal((await AnimFlag.findById(f2.id).lean())!.status, "confirmed");
    assert.equal((await s.getReview(A, 3, "evelyn"))!.canAccept, true);
    assert.equal((await s.getReview(A, 2, "evelyn"))!.canAccept, false, "an earlier version is not acceptable");
    err(await s.acceptVersion(A, 2, OWNER), /Only the latest/);
    ok(await s.acceptVersion(A, 3, OWNER));
    assert.equal(await s.animationStatus(A, 3), "accepted");
    err(await s.acceptVersion(A, 3, OWNER), /cannot be accepted/);
    assert.equal((await s.openFlags(A)).length, 0);

    // --- read-only mode refuses writes ---
    process.env.KEYSTONE_READONLY = "1";
    await assert.rejects(s.createFlag({ itemId: A, version: 3, comment: "x" }, [], OWNER), /read-only/);
    await assert.rejects(s.recordPublish({ itemId: A, height: 1, addresses: [], replies: {}, createdBy: "qa" }, 4), /read-only/);
    delete process.env.KEYSTONE_READONLY;
    assert.equal(await Animation.countDocuments({ itemId: A }), 3);

    // --- release to Castle Rock: the files become the item's player; a ready item is held when published ---
    const { Item } = await ks();
    const { mkdir, writeFile, readFile } = await import("node:fs/promises");
    const { animatedDir } = await import("./files");
    await Item.deleteMany({ itemId: { $in: [C, D] } });
    await Item.create({ itemId: C, stage: "ready", version: 1, course: "Physics 30", pipeline: { flags: [] } });
    ok(await s.recordPublish({ itemId: C, height: 1000, voice: "V", addresses: [], replies: {}, createdBy: "qa-owner" }, 1));
    let b = await Item.findOne({ itemId: C }).lean();
    assert.equal(b?.pipeline?.heldFor, "praveen", "publishing holds a ready item for the owner");
    assert.equal(b?.pipeline?.heldWhy, s.ANIMATION_TO_REVIEW);
    await mkdir(path.join(animatedDir(C, 1), "audio"), { recursive: true });
    await writeFile(path.join(animatedDir(C, 1), "solution.html"), "<p>v1</p>");
    const fl = ok(await s.createFlag({ itemId: C, version: 1, comment: "wrong word" }, [], OWNER));
    assert.match((await s.animationBlocksSend(C)) ?? "", /1 open flag/);
    err(await s.releaseAnimation(C), /still open/);
    ok(await s.deleteFlag(fl.id, OWNER));
    assert.equal(await s.animationBlocksSend(C), null);
    // accepted while the written solution is not out yet: not released by the accept
    ok(await s.acceptVersion(C, 1, OWNER));
    assert.equal((await Animation.findOne({ itemId: C, version: 1 }).lean())?.status, "accepted");
    assert.deepEqual(ok(await s.releaseAnimation(C)), { version: 1 });
    assert.equal(await readFile(path.join(DATA, "assets", C, "player", "solution.html"), "utf8"), "<p>v1</p>");
    b = await Item.findOne({ itemId: C }).lean();
    assert.equal(b?.player?.entry, "solution.html");
    assert.equal(b?.player?.version, 1);
    assert.equal((await Animation.findOne({ itemId: C, version: 1 }).lean())?.status, "released");
    assert.equal(ok(await s.releaseAnimation(C)), null, "nothing new to release");
    // v2 after the written solution is with Castle Rock: accepting it releases it and keeps the old player once
    await Item.updateOne({ itemId: C }, { $set: { stage: "in_review", releasedVersion: 1 } });
    ok(await s.recordPublish({ itemId: C, height: 1000, addresses: [], replies: {}, createdBy: "qa-owner" }, 2));
    await mkdir(animatedDir(C, 2), { recursive: true });
    await writeFile(path.join(animatedDir(C, 2), "solution.html"), "<p>v2</p>");
    ok(await s.acceptVersion(C, 2, OWNER));
    assert.equal(await readFile(path.join(DATA, "assets", C, "player", "solution.html"), "utf8"), "<p>v2</p>");
    assert.equal(await readFile(path.join(DATA, "assets", C, "player.prev", "solution.html"), "utf8"), "<p>v1</p>");
    assert.equal((await Item.findOne({ itemId: C }).lean())?.player?.version, 2);
    // the To animate list and the route choice
    await Item.create({ itemId: D, stage: "approved", version: 1, course: "Math 30-1" });
    await Animation.deleteMany({ itemId: D });
    assert.equal(await s.toAnimate("reviewer"), null);
    assert.deepEqual((await s.toAnimate("evelyn"))!.filter((t) => t.itemId === D).map((t) => t.route), ["undecided"]);
    err(await s.setAnimateRoute([D], "api", REVIEWER), /Only Evelyn/);
    ok(await s.setAnimateRoute([D], "api", OWNER));
    assert.deepEqual((await s.toAnimate("evelyn"))!.filter((t) => t.itemId === D).map((t) => t.route), ["api"]);
    assert.ok((await s.queuedForApi()).includes(D));
    ok(await s.setAnimateRoute([D], "hand", OWNER));
    assert.ok(!(await s.queuedForApi()).includes(D));
    assert.deepEqual(await s.queuedFor("hand"), [D]);
    ok(await s.setAnimateRoute([D], "none", OWNER));
    assert.deepEqual((await s.toAnimate("evelyn"))!.filter((t) => t.itemId === D).map((t) => t.route), ["none"]);
    assert.deepEqual(await s.queuedFor("hand"), []);
    ok(await s.setAnimateRoute([D], "undecided", OWNER));
    assert.deepEqual((await s.toAnimate("evelyn"))!.filter((t) => t.itemId === D).map((t) => t.route), ["undecided"]);
    // the automatic decision never overrides a person; put back = "wanted", so it is not decided again
    assert.ok(!(await s.needsDecision()).includes(D));
    assert.equal(await s.recordTriage(D, false, "Only algebra."), false);
    await Item.updateOne({ itemId: D }, { $unset: { animate: "" } });
    assert.ok((await s.needsDecision()).includes(D));
    assert.equal(await s.recordTriage(D, false, "Only algebra."), true);
    let t = (await s.toAnimate("evelyn"))!.find((x) => x.itemId === D)!;
    assert.deepEqual([t.route, t.reason, t.by], ["none", "Only algebra.", "auto"]);
    assert.equal(await s.recordTriage(D, false, "Three lines of algebra.", true), true);
    // Castle Rock asks for one: back on the list, marked as theirs
    ok(await s.askForAnimation(D, REVIEWER));
    t = (await s.toAnimate("evelyn"))!.find((x) => x.itemId === D)!;
    assert.deepEqual([t.route, t.askedBy], ["undecided", "qa-rev"]);
    err(await s.askForAnimation(D, REVIEWER), /not marked/);
    ok(await s.setAnimateRoute([D], "none", OWNER, "  My own   reason. "));
    assert.equal((await s.toAnimate("evelyn"))!.find((x) => x.itemId === D)!.reason, "My own reason.");
    await Item.deleteMany({ itemId: { $in: [C, D] } });

    // ================= Castle Rock's own flags on the released animation =================
    const file = async (v: number) => {
      await mkdir(animatedDir(E, v), { recursive: true });
      await writeFile(path.join(animatedDir(E, v), "solution.html"), `<p>v${v}</p>`);
    };
    const ids = (fs: { id: string }[]) => fs.map((f) => f.id);
    const status = async (id: string) => (await AnimFlag.findById(id).lean())?.status;
    const digestE = async () => {
      const d = await s.animationDigest(new Date(0));
      return { toReview: d.toReview.filter((x) => x.itemId === E), beingFixed: d.beingFixed.filter((x) => x.itemId === E), castleRock: d.castleRock.filter((x) => x.itemId === E) };
    };
    await Item.create({ itemId: E, stage: "in_review", version: 1, releasedVersion: 1, course: "Physics 30" });
    ok(await s.recordPublish({ itemId: E, height: 1000, notes: "internal: rebuilt the timing by hand", addresses: [], replies: {}, createdBy: "qa-owner" }, 1));
    await file(1);

    // --- nothing released yet: Castle Rock see nothing and can flag nothing ---
    for (const role of ["reviewer", "tech"] as const) assert.equal(await s.getReview(E, null, role), null, `${role}: no review before a release`);
    assert.equal(await s.releasedVersion(E), null);
    err(await s.createFlag({ itemId: E, version: 1, comment: "x" }, [], REVIEWER), /No such version/);
    ok(await s.acceptVersion(E, 1, OWNER)); // the written solution is out: accepting releases
    assert.equal(await s.animationStatus(E, 1), "released");
    assert.equal(await s.releasedVersion(E), 1);

    // an owner flag from before the role field existed (no createdByRole), with a picture, on the released version
    const o1 = ok(await s.createFlag({ itemId: E, version: 1, comment: "owner only: timing is off" }, [PNG], OWNER));
    await AnimFlag.updateOne({ _id: o1.id }, { $unset: { createdByRole: "" } });
    assert.equal(await s.animationStatus(E, 1), "released", "a flag never un-releases a version");

    // --- isolation: Castle Rock never get an owner flag, its pictures, the owner's notes or the version list ---
    for (const role of ["reviewer", "tech"] as const) {
      const r = (await s.getReview(E, null, role))!;
      assert.equal(r.viewer, "castle-rock");
      assert.equal(r.animation.version, 1);
      assert.deepEqual([r.flags, r.fixedHere, r.stillOpen], [[], [], []], `${role}: the owner's flag is not listed`);
      assert.deepEqual([r.animation.notes, r.animation.addresses, r.animation.createdBy, r.canAccept], [undefined, [], "", false]);
      assert.ok(!JSON.stringify(r).includes("internal") && !JSON.stringify(r).includes("owner only"), `${role}: nothing internal in the view`);
      assert.equal(await s.canSeeShots(o1.id, role), false, `${role}: no picture of an owner flag`);
    }
    assert.equal(await s.canSeeShots(o1.id, "evelyn"), true);
    assert.equal(await s.canSeeShots(o1.id, undefined), false);
    assert.equal(await s.canSeeShots("0123456789abcdef01234567", "evelyn"), false, "no such flag");
    assert.equal(await s.canSeeShots("../x", "evelyn"), false);
    // an owner flag does not exist for them: no edit, delete, confirm or reopen, and it stays as it was
    err(await s.updateFlag(o1.id, "hijack", [], REVIEWER), /No such flag/);
    err(await s.deleteFlag(o1.id, TECH), /No such flag/);
    err(await s.confirmFlag(o1.id, REVIEWER), /No such flag/);
    err(await s.reopenFlag(o1.id, "x", REVIEWER), /No such flag/);
    const o1now = (await AnimFlag.findById(o1.id).lean())!;
    assert.deepEqual([o1now.comment, o1now.status], ["owner only: timing is off", "open"]);
    assert.ok(existsSync(path.join(shotDir(o1.id), "1.png")));

    // --- Castle Rock flag the released version; it stays released ---
    err(await s.createFlag({ itemId: E, version: 2, comment: "x" }, [], REVIEWER), /No such version/);
    const c1 = ok(await s.createFlag({ itemId: E, version: 1, step: "2", line: "0", timeMs: "41000", comment: "The arrow points the wrong way" }, [PNG], REVIEWER));
    assert.deepEqual([c1.createdBy, c1.createdByRole, c1.createdByName, c1.status, c1.version], ["qa-rev", "reviewer", "QA Reviewer", "open", 1]);
    const long = `Unaddressed: ${"the label is cut off ".repeat(10)}`.trim();
    const c2 = ok(await s.createFlag({ itemId: E, version: 1, comment: long }, [], TECH));
    const c3 = ok(await s.createFlag({ itemId: E, version: 1, comment: "raised by mistake" }, [PNG], REVIEWER));
    assert.equal(await s.animationStatus(E, 1), "released", "Castle Rock's flag leaves the version released");
    // the team sees each other's flags and pictures; only the person who raised one changes it
    assert.deepEqual(ids((await s.getReview(E, null, "tech"))!.flags), [c1.id, c2.id, c3.id]);
    assert.deepEqual(ids((await s.getReview(E, 7, "reviewer"))!.flags), [c1.id, c2.id, c3.id], "the version asked for is ignored for Castle Rock");
    assert.equal(await s.canSeeShots(c1.id, "tech"), true);
    assert.equal(await s.canSeeShots(c1.id, "reviewer"), true);
    err(await s.updateFlag(c1.id, "theirs", [], TECH), /Only the person/);
    err(await s.deleteFlag(c1.id, TECH), /Only the person/);
    err(await s.updateFlag(c1.id, "mine now", [], OWNER), /Only the person/, "the owner does not rewrite Castle Rock's words");
    ok(await s.updateFlag(c1.id, "The arrow points the wrong way at the collision", [PNG], REVIEWER));
    ok(await s.deleteFlag(c3.id, REVIEWER));
    assert.ok(!existsSync(shotDir(c3.id)));
    assert.equal(await s.animationStatus(E, 1), "released");
    err(await s.acceptVersion(E, 1, REVIEWER), /Only Evelyn/);

    // --- the owner sees all of it, Castle Rock's marked by role, and is told ---
    const own1 = (await s.getReview(E, 1, "evelyn"))!;
    assert.equal(own1.viewer, "owner");
    assert.deepEqual(ids(own1.flags), [o1.id, c1.id, c2.id]);
    assert.deepEqual(own1.flags.map((f) => f.createdByRole), [undefined, "reviewer", "tech"]);
    let row = (await s.listAnimations("evelyn"))!.find((r) => r.itemId === E)!;
    assert.deepEqual([row.openFlags, row.castleRockOpen], [1, 2], "the list counts the two sides apart");
    assert.deepEqual([await s.openFlagCount(E, 1), await s.castleRockOpenCount(E)], [1, 2]);
    let dg = await digestE();
    assert.deepEqual(dg.castleRock.map((f) => [f.version, f.who, f.role]), [[1, "QA Reviewer", "reviewer"], [1, "QA Tech", "tech"]]);
    assert.equal(dg.castleRock[0].comment, "The arrow points the wrong way at the collision");
    assert.equal(dg.castleRock[1].comment, `${long.slice(0, 120)}…`, "the email gets the first 120 characters");
    assert.deepEqual(dg.beingFixed.map((b) => b.openFlags), [1], "being fixed counts the owner's flags only");
    assert.deepEqual((await s.openFlags(E)).map((f) => f.createdByRole), [undefined, "reviewer", "tech"], "the session script gets both sides with the role");

    // --- the fix: v2 addresses the owner's flag and c1, not c2 ---
    assert.deepEqual(ok(await pub(E, [o1.id, c1.id], { [o1.id]: "internal reply: retimed", [c1.id]: "The arrow now points right" })), { version: 2, fixed: 2 });
    await file(2);
    // not released yet: Castle Rock still see v1, their flag as open ("with Evelyn"), no reply, no v2 anywhere
    for (const role of ["reviewer", "tech"] as const) {
      const r = (await s.getReview(E, 2, role))!;
      assert.equal(r.animation.version, 1);
      assert.deepEqual(r.versions.map((v) => v.version), [1], `${role}: the unreleased version is not in the list`);
      assert.deepEqual(r.flags.map((f) => [f.id, f.status, f.pending ?? false, f.fixedInVersion, f.reply]), [[c1.id, "open", true, undefined, undefined], [c2.id, "open", false, undefined, undefined]]);
      assert.deepEqual([r.fixedHere, r.stillOpen], [[], []]);
      assert.ok(!JSON.stringify(r).includes("now points right") && !JSON.stringify(r).includes("retimed"), `${role}: no reply before the release`);
    }
    err(await s.createFlag({ itemId: E, version: 2, comment: "x" }, [], REVIEWER), /No such version/, "the unreleased version cannot be flagged");
    err(await s.confirmFlag(c1.id, REVIEWER), /Only a flag marked fixed/, "a fix they cannot play yet cannot be confirmed");
    err(await s.reopenFlag(c1.id, "x", REVIEWER), /Only a flag marked fixed/);
    err(await s.updateFlag(c1.id, "late", [], REVIEWER), /Only an open flag/);
    assert.equal(await status(c1.id), "fixed");

    // the owner on v2: both fixes listed, c2 still open from v1; each side judges its own flags
    const own2 = (await s.getReview(E, null, "evelyn"))!;
    assert.deepEqual([own2.animation.version, ids(own2.fixedHere), ids(own2.stillOpen)], [2, [o1.id, c1.id], [c2.id]]);
    err(await s.confirmFlag(c1.id, OWNER), /Castle Rock raised this flag/);
    err(await s.reopenFlag(c1.id, "not fixed", OWNER), /Castle Rock raised this flag/);
    assert.equal(await status(c1.id), "fixed");
    ok(await s.confirmFlag(o1.id, OWNER));

    // --- THE BLOCKING RULE ---
    // An open Castle Rock flag (c2, on the released v1, not addressed by v2) does not block accepting v2 ...
    assert.deepEqual([await s.openFlagCount(E, 2), await s.castleRockOpenCount(E)], [0, 1]);
    assert.equal(own2.canAccept, true, "an unaddressed Castle Rock flag leaves Accept available");
    assert.equal(await s.animationBlocksSend(E), null, "nor does it hold a send of the written solution");
    // ... the owner's own open flag does, on this version or an earlier one ...
    const o2 = ok(await s.createFlag({ itemId: E, version: 2, comment: "owner: one more thing" }, [], OWNER));
    assert.equal((await s.getReview(E, 2, "evelyn"))!.canAccept, false);
    err(await s.acceptVersion(E, 2, OWNER), /1 flag is still open/);
    assert.match((await s.animationBlocksSend(E)) ?? "", /1 open flag/);
    err(await s.releaseAnimation(E), /1 flag is still open/, "nothing the owner has not finished reviewing is released");
    assert.equal(await s.releasedVersion(E), 1);
    ok(await s.deleteFlag(o2.id, OWNER));
    assert.equal(await s.animationStatus(E, 2), "review");
    // ... and a Castle Rock flag raised while he reviews v2 does not lock him out either.
    const c4 = ok(await s.createFlag({ itemId: E, version: 1, comment: "also: the last line is hard to read" }, [], REVIEWER));
    dg = await digestE();
    assert.deepEqual(dg.toReview.map((r) => [r.version, r.fixes]), [[2, 2]], "v2 is still his to review while Castle Rock's flags are open");
    assert.deepEqual(dg.beingFixed, []);
    assert.equal(dg.castleRock.length, 2);
    ok(await s.acceptVersion(E, 2, OWNER));
    assert.equal(await s.animationStatus(E, 2), "released", "the written solution is out: accepting releases at once");
    assert.equal(await readFile(path.join(DATA, "assets", E, "player", "solution.html"), "utf8"), "<p>v2</p>");
    assert.equal(await s.releasedVersion(E), 2);
    assert.deepEqual([await status(c2.id), await status(c4.id)], ["open", "open"], "their unaddressed flags stay open across the release");

    // --- after the release: "Fixed in v2" with our reply; Confirm or Reopen is theirs ---
    const rel = (await s.getReview(E, null, "reviewer"))!;
    assert.deepEqual([rel.animation.version, rel.versions.map((v) => v.version)], [2, [2]]);
    assert.deepEqual(rel.flags, []);
    assert.deepEqual(rel.fixedHere.map((f) => [f.id, f.status, f.fixedInVersion, f.reply, f.pending ?? false]), [[c1.id, "fixed", 2, "The arrow now points right", false]]);
    assert.deepEqual(ids(rel.stillOpen), [c2.id, c4.id], "what v2 did not address is still with Evelyn");
    assert.ok(!JSON.stringify(rel).includes("retimed") && !JSON.stringify(rel).includes("owner"), "still nothing of the owner's flags");
    row = (await s.listAnimations("evelyn"))!.find((r) => r.itemId === E)!;
    assert.deepEqual([row.latest, row.status, row.openFlags, row.castleRockOpen], [2, "released", 0, 2]);
    err(await s.reopenFlag(c1.id, "  ", TECH), /still wrong/);
    const c1b = ok(await s.reopenFlag(c1.id, "Still pointing left on the phone", TECH));
    assert.deepEqual([c1b.version, c1b.status, c1b.reopenOf, c1b.createdByRole, c1b.createdBy, c1b.step], [2, "open", c1.id, "tech", "qa-tech", 2], "the reopen is a new Castle Rock flag on the released version");
    assert.equal(await status(c1.id), "reopened");
    assert.equal(await s.animationStatus(E, 2), "released", "a reopen by Castle Rock leaves the version released");
    assert.deepEqual(ids((await s.getReview(E, null, "reviewer"))!.flags), [c1b.id]);
    err(await s.confirmFlag(c1.id, REVIEWER), /Only a flag marked fixed/);
    ok(await s.deleteFlag(c1b.id, TECH));
    assert.equal(await status(c1.id), "fixed", "deleting the reopen puts the fix back to be judged");
    ok(await s.confirmFlag(c1.id, REVIEWER));
    assert.equal(await status(c1.id), "confirmed");
    err(await s.confirmFlag(c1.id, REVIEWER), /Only a flag marked fixed/);

    // --- v3 addresses c2 only; c4 stays open across another accept; an old released version is no longer theirs ---
    ok(await pub(E, [c2.id], { [c2.id]: "Label moved inside the frame" }));
    await file(3);
    ok(await s.acceptVersion(E, 3, OWNER));
    assert.equal(await s.releasedVersion(E), 3, "the released version is the latest released one");
    const rel3 = (await s.getReview(E, null, "tech"))!;
    assert.deepEqual([rel3.animation.version, ids(rel3.fixedHere), ids(rel3.stillOpen)], [3, [c2.id], [c4.id]]);
    dg = await digestE();
    assert.deepEqual(dg.castleRock.map((f) => f.comment), ["also: the last line is hard to read"]);
    assert.deepEqual([dg.toReview, dg.beingFixed], [[], []]);
    await Item.deleteMany({ itemId: E });

    console.log("animreview.dbtest: ok");
  } finally {
    await clean();
    await closeKs();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
