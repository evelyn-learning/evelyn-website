// Database test for the owner review of animated solutions: role gate, version numbering, the flag lifecycle
// (open → fixed → confirmed / reopened), accept, pictures on disk, read-only refusal. Needs a local mongod:
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
const OWNER = { username: "qa-owner", role: "evelyn" as const };
const OTHER = { username: "qa-owner-2", role: "evelyn" as const };
const REVIEWER = { username: "qa-rev", role: "reviewer" as const };
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);

(async () => {
  const { ks, closeKs } = await import("../db");
  const s = await import("./store");
  const { shotDir } = await import("./files");
  const { Animation, AnimFlag } = await ks();
  assert.equal(Animation.db.name, DB, "must run against the test database");
  await Promise.all([Animation.init(), AnimFlag.init()]);
  const clean = async () => {
    await Animation.deleteMany({ itemId: { $in: [A, B, C, D] } });
    await AnimFlag.deleteMany({ itemId: { $in: [A, B, C, D] } });
    await (await ks()).Item.deleteMany({ itemId: { $in: [C, D] } });
    await rm(DATA, { recursive: true, force: true });
  };
  const ok = <T>(r: { ok: T } | { error: string }): T => {
    if ("error" in r) assert.fail(r.error);
    return r.ok;
  };
  const err = (r: { ok: unknown } | { error: string }, re: RegExp) => {
    assert.ok("error" in r, `expected an error matching ${re}`);
    assert.match(r.error, re);
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
    err(await s.createFlag({ itemId: A, version: 1, comment: "x" }, [], REVIEWER), /Only Evelyn/);
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

    console.log("animreview.dbtest: ok");
  } finally {
    await clean();
    await closeKs();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
