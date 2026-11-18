// Database test for the timed release (real store). Not part of test:keystone (needs a mongod):
//   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses castle_rock_review_test and only item ids 9914xx–9919xx / batches "dbtest-rel-*" / lock "dbtest-rel-lock";
// deletes only what it created (the "keystone-release" heartbeat is put back as it was).
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri)) {
  console.error(`release.dbtest refused to run: KEYSTONE_MONGODB_URI must be mongodb://127.0.0.1:27017 or mongodb://localhost:27017 (got "${uri || "unset"}"). It must never point at the production tunnel.`);
  process.exit(1);
}
const DB = "castle_rock_review_test";
process.env.KEYSTONE_DB_NAME = DB;
process.env.KEYSTONE_DATA_DIR = path.join(tmpdir(), "ks-test-data");
delete process.env.KEYSTONE_READONLY;
delete process.env.KEYSTONE_PIPELINE_LIVE;

const ok = (value: unknown, message: string) => assert.ok(value, message);
const equal = (a: unknown, b: unknown, message: string) => assert.equal(a, b, message);
const deepEqual = (a: unknown, b: unknown, message: string) => assert.deepEqual(a, b, message);

const id = (n: number) => String(991400 + n);
const ALL_IDS = Array.from({ length: 600 }, (_, n) => id(n));
const B = (s: string) => `dbtest-rel-${s}`;
const NOW = new Date("2026-11-18T17:00:00Z"); // Wed 10:00 MT
const DUE = new Date(NOW.getTime() - 60 * 60 * 1000);
const LATER = new Date(NOW.getTime() + 24 * 60 * 60 * 1000);
const MIN = 60_000;

(async () => {
  const { ks, closeKs } = await import("../db");
  const { IN_REVIEW_BODY } = await import("../store");
  const { resetOutboxInit } = await import("./outbox");
  const rel = await import("./release");
  const { Item, Solution, Activity, Outbox, Batch, Lock } = await ks();
  equal(Item.db.name, DB, "must run against the test database");
  const heartbeats = Item.db.collection("heartbeats");
  const beatBefore = await heartbeats.findOne({ _id: "keystone-release" as never });
  const clean = async () => {
    await Item.deleteMany({ itemId: { $in: ALL_IDS } });
    await Solution.deleteMany({ itemId: { $in: ALL_IDS } });
    await Activity.deleteMany({ itemId: { $in: ALL_IDS } });
    await Outbox.deleteMany({ batchId: { $regex: /^dbtest-rel-/ } });
    await Batch.deleteMany({ batchId: { $regex: /^dbtest-rel-/ } });
    await Lock.deleteMany({ _id: "dbtest-rel-lock" });
  };
  const T0 = new Date("2026-11-16T17:00:00Z");
  type P = { stage?: string; flags?: string[]; heldFor?: "praveen"; releaseAt?: Date | null; batchId?: string | null; solution?: "unreleased" | "released" | "none"; extra?: Record<string, unknown> };
  const mk = async (itemId: string, p: P = {}) => {
    const stage = p.stage ?? "ready";
    const hasSolution = !["received", "item_data"].includes(stage);
    await Item.create({
      itemId, subject: "Mathematics", course: "Math 30-1", courseSource: "sheet", itemType: "MC", topic: "", standards: [], key: "B",
      evelynAnswer: hasSolution ? "B" : "", keySource: "castle-rock", questionHtml: "<p>q</p>", options: [], stage,
      version: hasSolution ? 1 : 0, releasedVersion: 0, releasedAnswer: "", ...(p.batchId === null ? {} : { batchId: p.batchId ?? B("A") }),
      receivedAt: T0, showcase: false, source: "upload", order: 1, createdAt: T0, updatedAt: T0, lastActivityAt: T0,
      pipeline: {
        flags: p.flags ?? [], runId: "run-x", ...(stage === "ready" ? { passedAt: T0 } : {}),
        ...(p.heldFor ? { heldFor: p.heldFor } : {}), ...(p.releaseAt === null ? {} : stage === "ready" ? { releaseAt: p.releaseAt ?? DUE } : {}),
      },
      ...p.extra,
    });
    const sol = p.solution ?? (hasSolution ? "unreleased" : "none");
    if (sol !== "none") await Solution.create({ itemId, version: 1, sections: [], author: "Evelyn Learning", runId: "run-x", ...(sol === "released" ? { releasedAt: T0 } : {}) });
  };
  /** An item_data item comes back and passes clean (what ingest + the run would leave). */
  const comesBackClean = async (itemId: string) => {
    await Item.updateOne({ itemId }, { $set: { stage: "ready", version: 1, evelynAnswer: "B", pipeline: { flags: [], runId: "run-y", passedAt: T0, releaseAt: DUE } } });
    await Solution.create({ itemId, version: 1, sections: [], author: "Evelyn Learning", runId: "run-y" });
  };
  const mkBatch = (batchId: string, itemIds: string[], extra: Record<string, unknown> = {}) =>
    Batch.create({ batchId, filename: `${batchId}.xlsx`, itemIds, rows: itemIds.map((itemId) => ({ itemId })), receivedAt: T0, uploadedBy: "t", ...extra });
  const arrives = async (batchId: string, itemId: string) => {
    await mk(itemId, { batchId });
    await Batch.updateOne({ batchId }, { $push: { itemIds: itemId } });
  };
  const item = async (itemId: string) => (await Item.findOne({ itemId }).lean())!;
  const sentRows = (itemId: string) => Activity.countDocuments({ itemId, type: "stage", stage: "in_review" });
  const inReviewSuggestions = (batchId: string) => Outbox.countDocuments({ kind: "batch_in_review", batchId });
  const range = (from: number, n: number) => Array.from({ length: n }, (_, i) => id(from + i));
  const tally = async (ids: string[]) => ({
    held: await Item.countDocuments({ itemId: { $in: ids }, "pipeline.flags": "sample" }),
    released: await Item.countDocuments({ itemId: { $in: ids }, "pipeline.timerReleasedAt": { $exists: true } }),
    inReview: await Item.countDocuments({ itemId: { $in: ids }, stage: "in_review" }),
  });
  const onePerItem = async (ids: string[]) => {
    for (const i of ids) ok((await sentRows(i)) <= 1, `${i}: at most one release row`);
  };

  await clean();
  try {
    // --- outside the window: nothing at all ---
    await mk(id(90), { batchId: B("H") });
    await mkBatch(B("H"), [id(90)]);
    const saturday = new Date("2026-11-21T17:00:00Z");
    deepEqual(await rel.releaseDue(saturday), [], "outside the window releaseDue returns []");
    const h90 = await item(id(90));
    ok(h90.stage === "ready" && h90.pipeline?.flags.length === 0 && !h90.pipeline?.heldFor, "outside the window: not even sampled");

    // --- blocked batches: nothing released, why recorded every pass, cleared once unblocked ---
    const aIds = range(0, 4);
    for (const i of aIds) await mk(i, { batchId: B("A") });
    await mk(id(4), { batchId: B("A"), stage: "received" });
    await mkBatch(B("A"), [...aIds, id(4), id(5)]); // id(5) listed, never uploaded
    await mk(id(6), { batchId: B("A2"), stage: "drafting" });
    await mk(id(7), { batchId: B("A2") });
    await mkBatch(B("A2"), [id(6), id(7)]);
    await mk(id(8), { batchId: B("A3-no-record") });
    const rep1 = await rel.releaseDueReport(NOW);
    for (const i of [...aIds, id(7), id(8)]) ok(!rep1.released.includes(i), `${i}: blocked batch, not released`);
    for (const i of [...aIds, id(7), id(8)]) equal((await item(i)).pipeline?.flags.length, 0, `${i}: blocked batch, not sampled`);
    const why = (b: string) => rep1.blocked.find((x) => x.batchId === b)?.why ?? "";
    ok(/never uploaded/.test(why(B("A"))) && /not yet through the pipeline/.test(why(B("A"))), `A blocked: ${why(B("A"))}`);
    ok(/drafting with no hold/.test(why(B("A2"))), `A2 blocked: ${why(B("A2"))}`);
    ok(/no batch record/.test(why(B("A3-no-record"))), `missing record blocked: ${why(B("A3-no-record"))}`);
    const ba = (await Batch.findOne({ batchId: B("A") }).lean())!;
    ok(ba.blockedWhy && ba.blockedAt, "recorded on the Batch document");
    const listed = await rel.blockedBatches();
    for (const b of [B("A"), B("A2"), B("A3-no-record")]) ok(listed.some((x) => x.batchId === b), `blockedBatches lists ${b}`);
    // blockedAt is "since": kept on the next pass
    const later = new Date(NOW.getTime() + 5 * MIN);
    await rel.releaseDueReport(later);
    equal((await Batch.findOne({ batchId: B("A") }).lean())!.blockedAt?.getTime(), ba.blockedAt!.getTime(), "blockedAt kept while still blocked");
    // unblock A: the listed item arrives held, the received one is held → the pass samples and releases, the block clears
    await mk(id(5), { batchId: B("A"), stage: "item_data" });
    await Item.updateOne({ itemId: id(4) }, { $set: { "pipeline.heldFor": "praveen", "pipeline.flags": ["type_not_supported"] } });
    const rep2 = await rel.releaseDueReport(later);
    const ta = await tally(aIds);
    ok(ta.held === 3 && ta.released === 1 && rep2.released.filter((i) => aIds.includes(i)).length === 1, `A unblocked: 3 held, 1 released (${JSON.stringify(ta)})`);
    const ba2 = (await Batch.findOne({ batchId: B("A") }).lean())!;
    ok(!ba2.blockedWhy && !ba2.blockedAt, "block cleared on the Batch document");
    ok(!(await rel.blockedBatches()).some((x) => x.batchId === B("A")), "no longer listed");

    // --- batch B: 5 clean, due → 3 held, 2 released with the ordinary status row, batch_in_review once ---
    const bIds = range(10, 5);
    for (const i of bIds) await mk(i, { batchId: B("B") });
    await mkBatch(B("B"), bIds);
    const expectedSample = rel.pickSample(bIds, B("B"));
    const releasedB = (await rel.releaseDue(NOW)).filter((i) => bIds.includes(i)).sort();
    deepEqual(releasedB, bIds.filter((i) => !expectedSample.includes(i)).sort(), "the two not sampled are released");
    for (const i of expectedSample) {
      const it = await item(i);
      ok(it.stage === "ready" && it.pipeline?.heldFor === "praveen" && it.pipeline.flags.join() === "sample" && it.pipeline.releaseAt === undefined, `${i} held as sample, releaseAt unset`);
      equal(await sentRows(i), 0, `${i} not released`);
    }
    for (const i of releasedB) {
      const it = await item(i);
      ok(it.stage === "in_review" && it.releasedVersion === 1 && it.releasedAnswer === "B" && it.pipeline?.timerReleasedAt, `${i} in review, version 1 released, marked`);
      ok((await Solution.findOne({ itemId: i, version: 1 }).lean())!.releasedAt, `${i} solution releasedAt`);
      const rows = await Activity.find({ itemId: i }).lean();
      equal(rows.length, 1, `${i}: one activity row`);
      ok(rows[0].type === "stage" && rows[0].stage === "in_review" && rows[0].body === IN_REVIEW_BODY && rows[0].name === "Evelyn Learning" && rows[0].role === "evelyn", `the row is Evelyn's status change to In review (${rows[0].type} ${rows[0].body})`);
      equal(it.pipeline?.releaseClaim, undefined, "claim cleared");
    }
    ok((await Batch.findOne({ batchId: B("B") }).lean())!.sampledAt, "sampledAt kept for information");
    equal(await inReviewSuggestions(B("B")), 1, "batch_in_review suggested once");
    const sug = (await Outbox.findOne({ kind: "batch_in_review", batchId: B("B") }).lean())!;
    ok(!/pipeline|timer|automat|model|keystone-release/i.test(`${sug.subject} ${sug.bodyMd}`), `suggestion reads plainly: ${sug.subject}`);
    deepEqual((await rel.releaseDue(NOW)).filter((i) => bIds.includes(i)), [], "second call releases nothing more");
    for (const i of releasedB) equal(await sentRows(i), 1, `${i}: still one row`);
    equal(await inReviewSuggestions(B("B")), 1, "still one suggestion");

    // --- flagged / held / not due / no unreleased solution: never released ---
    await mkBatch(B("C"), range(20, 9));
    await mk(id(20), { batchId: B("C"), flags: ["solvers_split"], heldFor: "praveen" });
    await mk(id(21), { batchId: B("C"), heldFor: "praveen" });
    await mk(id(22), { batchId: B("C"), flags: ["answer_to_confirm"] });
    await mk(id(23), { batchId: B("C"), releaseAt: LATER });
    await mk(id(24), { batchId: B("C"), flags: ["sample"], heldFor: "praveen" });
    await mk(id(25), { batchId: B("C"), flags: ["sample"], heldFor: "praveen" });
    await mk(id(26), { batchId: B("C"), flags: ["sample"], heldFor: "praveen" });
    await mk(id(27), { batchId: B("C"), solution: "none" });
    await mk(id(28), { batchId: B("C"), solution: "released" });
    const cd = await rel.releaseDue(NOW);
    for (const i of [id(20), id(21), id(22), id(23), id(27), id(28)]) {
      ok(!cd.includes(i), `${i} not released`);
      equal((await item(i)).stage, "ready", `${i} still ready`);
      equal(await sentRows(i), 0, `${i}: no row`);
    }

    // --- a clean ready item with no release time is held for Praveen with the reason (and a stale claim cleared) ---
    await mk(id(30), { batchId: B("C"), releaseAt: null, extra: {} });
    await Item.updateOne({ itemId: id(30) }, { $set: { "pipeline.releaseClaim": { owner: "dead", at: new Date(NOW.getTime() - 2 * rel.STALE_MS) } } });
    const rep3 = await rel.releaseDueReport(NOW);
    ok(rep3.heldNoTime.includes(id(30)), "reported as held: no release time");
    const it30 = await item(id(30));
    ok(it30.pipeline?.heldFor === "praveen" && it30.pipeline.heldWhy === "no release time" && it30.pipeline.flags.length === 0, "held with heldWhy, no flag");
    equal(it30.pipeline?.releaseClaim, undefined, "the stale claim is cleared by the hold");

    // --- an item without a batch is always held as sample ---
    await mk(id(40), { batchId: null });
    ok(!(await rel.releaseDue(NOW)).includes(id(40)), "no batch → not released");
    const it40 = await item(id(40));
    ok(it40.pipeline?.heldFor === "praveen" && it40.pipeline.flags.join() === "sample" && it40.pipeline.releaseAt === undefined, "no batch → held as sample");

    // --- all at item_data when first seen: nothing; when the 10 return clean: 3 held, 7 released, never 10 ---
    const dIds = range(100, 10);
    for (const i of dIds) await mk(i, { batchId: B("D"), stage: "item_data" });
    await mkBatch(B("D"), dIds);
    await rel.releaseDue(NOW);
    deepEqual(await tally(dIds), { held: 0, released: 0, inReview: 0 }, "all at item_data: nothing");
    for (const i of dIds) await comesBackClean(i);
    await rel.releaseDue(NOW);
    deepEqual(await tally(dIds), { held: 3, released: 7, inReview: 7 }, "10 return clean: 3 held, 7 released");

    // --- 40 with 30 at item_data: 3 held + 7 released now; when the 30 return: 4 held in total ---
    const eIds = range(120, 40);
    for (const [k, i] of eIds.entries()) await mk(i, { batchId: B("E"), ...(k < 30 ? { stage: "item_data" } : {}) });
    await mkBatch(B("E"), eIds);
    await rel.releaseDue(NOW);
    deepEqual(await tally(eIds), { held: 3, released: 7, inReview: 7 }, "first 10 clean: 3 held, 7 released");
    for (const i of eIds.slice(0, 30)) await comesBackClean(i);
    await rel.releaseDue(NOW);
    deepEqual(await tally(eIds), { held: 4, released: 36, inReview: 36 }, "all 40 through: 4 held in total");
    await onePerItem(eIds);

    // --- late single arrivals ---
    const nine = range(200, 9);
    for (const i of nine) await mk(i, { batchId: B("F9") });
    await mkBatch(B("F9"), nine);
    await rel.releaseDue(NOW);
    deepEqual(await tally(nine), { held: 3, released: 6, inReview: 6 }, "9: 3 held, 6 released");
    await arrives(B("F9"), id(209));
    ok((await rel.releaseDue(NOW)).includes(id(209)), "n 10 → still 3 required → the late arrival is released");
    const thirty = range(220, 30);
    for (const i of thirty) await mk(i, { batchId: B("F30") });
    await mkBatch(B("F30"), thirty);
    await rel.releaseDue(NOW);
    deepEqual(await tally(thirty), { held: 3, released: 27, inReview: 27 }, "30: 3 held, 27 released");
    await arrives(B("F30"), id(250));
    ok(!(await rel.releaseDue(NOW)).includes(id(250)), "n 31 → 4 required → not released");
    const it250 = await item(id(250));
    ok(it250.pipeline?.flags.join() === "sample" && it250.pipeline.heldFor === "praveen", "the late arrival is held as sample");
    // the owner sends a sampled item to review: it still counts toward h
    const heldNine = (await Item.find({ itemId: { $in: nine }, "pipeline.flags": "sample" }).lean()).map((x) => x.itemId);
    ok(heldNine.length === 3, "three sample items in F9");
    await Item.updateOne({ itemId: heldNine[0] }, { $set: { stage: "in_review", releasedVersion: 1 }, $unset: { "pipeline.heldFor": "" } });
    await arrives(B("F9"), id(210));
    ok((await rel.releaseDue(NOW)).includes(id(210)), "n 11, h 3 (one sent to review by the owner) → released, not held");

    // --- 5 parallel passes across the returns: invariant holds, each item released once ---
    const gIds = range(300, 20);
    for (const [k, i] of gIds.entries()) await mk(i, { batchId: B("G"), ...(k < 10 ? { stage: "item_data" } : {}) });
    await mkBatch(B("G"), gIds);
    const par = async () => (await Promise.all(Array.from({ length: 5 }, () => rel.releaseDue(NOW)))).flat().filter((i) => gIds.includes(i));
    const p1 = await par();
    equal(new Set(p1).size, p1.length, "first parallel round: no item released twice");
    deepEqual(await tally(gIds), { held: 3, released: 7, inReview: 7 }, "first parallel round: 3 held, 7 released");
    for (const i of gIds.slice(0, 10)) await comesBackClean(i);
    const p2 = await par();
    equal(new Set([...p1, ...p2]).size, p1.length + p2.length, "second round: no item released twice");
    const tg = await tally(gIds);
    ok(tg.held >= rel.requiredSample(20) && tg.held + tg.released === 20, `20 through: invariant holds (${JSON.stringify(tg)})`);
    deepEqual(tg, { held: 3, released: 17, inReview: 17 }, "20 through: 3 held, 17 released");
    await onePerItem(gIds);
    equal(await inReviewSuggestions(B("G")), 1, "parallel: batch_in_review suggested once");

    // --- crash between claim and release: picked up after the stale period, released once ---
    await mkBatch(B("K"), range(400, 4));
    for (const i of range(400, 3)) await mk(i, { batchId: B("K"), flags: ["sample"], heldFor: "praveen" });
    await mk(id(403), { batchId: B("K") });
    await Item.updateOne({ itemId: id(403) }, { $set: { "pipeline.releaseClaim": { owner: "dead", at: NOW } } });
    ok(!(await rel.releaseDue(NOW)).includes(id(403)), "a fresh claim is respected");
    equal((await item(id(403))).stage, "ready", "still ready while claimed");
    const afterStale = new Date(NOW.getTime() + rel.STALE_MS + MIN);
    ok((await rel.releaseDue(afterStale)).includes(id(403)), "stale claim → released by the next call");
    equal(await sentRows(id(403)), 1, "one row");
    ok(!(await rel.releaseDue(new Date(afterStale.getTime() + rel.STALE_MS * 2))).includes(id(403)), "and never again");
    equal(await sentRows(id(403)), 1, "still one row");

    // --- crash after the item moved to review: the next call finishes the bookkeeping once ---
    const at = new Date(NOW.getTime() - 60 * MIN);
    await mkBatch(B("R"), [id(410), id(411)]);
    for (const i of [id(410), id(411)]) {
      await mk(i, { batchId: B("R"), stage: "in_review", extra: { releasedVersion: 1, releasedAnswer: "B" } });
      await Item.updateOne({ itemId: i }, { $set: { "pipeline.releaseClaim": { owner: "dead", at, releasedAt: at }, "pipeline.timerReleasedAt": at } });
    }
    await Activity.create({ itemId: id(411), type: "stage", stage: "in_review", body: IN_REVIEW_BODY, username: "pipeline", name: "Evelyn Learning", role: "evelyn", createdAt: at });
    await rel.releaseDue(NOW);
    for (const i of [id(410), id(411)]) {
      ok((await Solution.findOne({ itemId: i, version: 1 }).lean())!.releasedAt, `${i}: solution marked released`);
      equal(await sentRows(i), 1, `${i}: exactly one row`);
      equal((await item(i)).pipeline?.releaseClaim, undefined, `${i}: claim cleared`);
    }

    // --- applySample: two concurrent calls take one sample; a later call holds nothing more ---
    const jIds = range(420, 12);
    for (const i of jIds) await mk(i, { batchId: B("J"), releaseAt: LATER });
    await mkBatch(B("J"), jIds);
    const [s1, s2] = await Promise.all([rel.applySample(B("J"), NOW), rel.applySample(B("J"), NOW)]);
    const flagged = (await Item.find({ itemId: { $in: jIds }, "pipeline.flags": "sample" }).lean()).map((x) => x.itemId).sort();
    deepEqual(flagged, rel.pickSample(jIds, B("J")), `two concurrent calls → the one deterministic sample of 3 (${s1.status}/${s2.status})`);
    const s3 = await rel.applySample(B("J"), NOW);
    ok(s3.status === "sampled" && s3.held.length === 0, "a third call: invariant already holds, nothing more held");
    await mk(id(440), { batchId: B("J2"), stage: "received" });
    await mk(id(441), { batchId: B("J2") }); // clean and due, but its batch is blocked: never released
    await mkBatch(B("J2"), [id(440), id(441)]);
    equal((await rel.applySample(B("J2"), NOW)).status, "blocked", "a blocked batch is not sampled");

    // --- read-only mode: refuses before any write ---
    await mk(id(450), { batchId: B("B") });
    process.env.KEYSTONE_READONLY = "1";
    await assert.rejects(() => rel.releaseDue(NOW), /read-only/, "read-only → releaseDue throws");
    await assert.rejects(() => rel.applySample(B("B"), NOW), /read-only/, "read-only → applySample throws");
    delete process.env.KEYSTONE_READONLY;
    equal((await item(id(450))).stage, "ready", "nothing written in read-only mode");
    await Item.deleteOne({ itemId: id(450) });
    await Solution.deleteMany({ itemId: id(450) });

    // --- the lock ---
    equal(await rel.acquireLock("dbtest-rel-lock", "one", NOW, 60_000), true, "first caller gets the lock");
    equal(await rel.acquireLock("dbtest-rel-lock", "two", NOW, 60_000), false, "second caller does not");
    equal(await rel.acquireLock("dbtest-rel-lock", "two", new Date(NOW.getTime() + 61_000), 60_000), true, "expired lock taken over");
    await rel.releaseLock("dbtest-rel-lock", "one");
    equal((await Lock.findById("dbtest-rel-lock").lean())?.owner, "two", "releasing someone else's lock does nothing");
    await rel.releaseLock("dbtest-rel-lock", "two");
    equal(await Lock.findById("dbtest-rel-lock").lean(), null, "released");

    // --- the script: the dry run writes nothing; a writing run prints blocked batches and beats ---
    for (const i of range(460, 4)) await mk(i, { batchId: B("L") });
    await mkBatch(B("L"), range(460, 4));
    const snapshot = async () => {
      const out: Record<string, unknown[]> = {};
      const db = Item.db.db!;
      for (const c of (await db.listCollections().toArray()).map((x) => x.name).sort()) {
        out[c] = await db.collection(c).find({}).sort({ _id: 1 }).toArray();
      }
      return JSON.stringify(out);
    };
    const before = await snapshot();
    const appDir = path.join(__dirname, "../../../..");
    const script = path.join(appDir, "scripts/keystone-release.ts");
    const env = { ...process.env, KEYSTONE_MONGODB_URI: uri, KEYSTONE_DB_NAME: DB };
    const res = spawnSync("npx", ["tsx", script, "--dry-run", "--now", NOW.toISOString()], { cwd: appDir, env, encoding: "utf8", timeout: 120_000 });
    equal(res.status, 0, `dry run exits 0 (stderr: ${res.stderr})`);
    ok(/castle_rock_review_test on (127\.0\.0\.1|localhost):27017/.test(res.stdout), `prints the database and host: ${res.stdout.split("\n")[0]}`);
    ok(/DRY RUN/.test(res.stdout), "says it is a dry run");
    ok(range(460, 4).every((i) => res.stdout.includes(i)), "names the waiting items");
    ok(/would hold for Praveen as sample/.test(res.stdout), "says what would be sampled");
    ok(/blocked: batch dbtest-rel-J2/.test(res.stdout), "prints the blocked batch");
    ok(/Wed 2026-11-18/.test(res.stdout), "times in Mountain time");
    equal(res.stdout.trim().split("\n").filter((l) => /^release:/.test(l)).length, 1, "one summary line");
    equal(await snapshot(), before, "dry run: every collection unchanged");
    const bad = spawnSync("npx", ["tsx", script, "--now", NOW.toISOString()], { cwd: appDir, env, encoding: "utf8", timeout: 120_000 });
    ok(bad.status !== 0 && /--now/.test(bad.stderr), `--now without --dry-run refused (${bad.stderr.trim()})`);
    const noUri = spawnSync("npx", ["tsx", script, "--dry-run"], { cwd: appDir, env: { ...process.env, KEYSTONE_MONGODB_URI: "", MONGODB_URI: "mongodb://127.0.0.1:27017" }, encoding: "utf8", timeout: 120_000 });
    ok(noUri.status !== 0 && /KEYSTONE_MONGODB_URI/.test(noUri.stderr), "KEYSTONE_MONGODB_URI is required explicitly");
    equal(await snapshot(), before, "refused runs wrote nothing");
    // a writing run (real clock, test database): exit 0, the blocked batch printed, the heartbeat written
    await rel.releaseDueReport(NOW); // records J2's block, so it is listed outside the window too
    const startedAt = Date.now();
    const w = spawnSync("npx", ["tsx", script], { cwd: appDir, env, encoding: "utf8", timeout: 120_000 });
    equal(w.status, 0, `writing run exits 0 (stderr: ${w.stderr})`);
    ok(/blocked: batch dbtest-rel-J2: .*not yet through the pipeline/.test(w.stdout), `writing run prints the blocked batch: ${w.stdout}`);
    equal(w.stdout.trim().split("\n").filter((l) => /^release:/.test(l)).length, 1, "writing run: one summary line");
    const hb = await heartbeats.findOne({ _id: "keystone-release" as never });
    ok(hb && new Date(hb.at).getTime() >= startedAt - 1000, "heartbeat written by the writing run");
    equal((await item(id(441))).stage, "ready", "the blocked batch's clean item was never released");

    console.log("release.dbtest ok");
  } finally {
    await clean();
    if (beatBefore) await heartbeats.replaceOne({ _id: "keystone-release" as never }, beatBefore, { upsert: true });
    else await heartbeats.deleteOne({ _id: "keystone-release" as never });
    await closeKs();
    resetOutboxInit();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
