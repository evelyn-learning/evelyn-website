// Database test for the timed release (real store). Not part of test:keystone (needs a mongod):
//   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses castle_rock_review_test and only item ids 9914xx / batches "dbtest-rel-*" / lock "dbtest-rel-lock";
// deletes only what it created.
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
const ALL_IDS = Array.from({ length: 100 }, (_, n) => id(n));
const B = (s: string) => `dbtest-rel-${s}`;
const ALL_BATCHES = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "J2", "J3", "L"].map(B);
const NOW = new Date("2026-11-18T17:00:00Z"); // Wed 10:00 MT
const DUE = new Date(NOW.getTime() - 60 * 60 * 1000);
const LATER = new Date(NOW.getTime() + 24 * 60 * 60 * 1000);

(async () => {
  const { ks, closeKs } = await import("../db");
  const { resetOutboxInit } = await import("./outbox");
  const rel = await import("./release");
  const { Item, Solution, Activity, Outbox, Batch, Lock } = await ks();
  equal(Item.db.name, DB, "must run against the test database");
  const clean = async () => {
    await Item.deleteMany({ itemId: { $in: ALL_IDS } });
    await Solution.deleteMany({ itemId: { $in: ALL_IDS } });
    await Activity.deleteMany({ itemId: { $in: ALL_IDS } });
    await Outbox.deleteMany({ batchId: { $in: ALL_BATCHES } });
    await Batch.deleteMany({ batchId: { $in: ALL_BATCHES } });
    await Lock.deleteMany({ _id: "dbtest-rel-lock" });
  };
  const T0 = new Date("2026-11-16T17:00:00Z");
  type P = { stage?: string; flags?: string[]; heldFor?: "praveen"; releaseAt?: Date | null; batchId?: string | null; solution?: "unreleased" | "released" | "none"; extra?: Record<string, unknown> };
  const mk = async (itemId: string, p: P = {}) => {
    const stage = p.stage ?? "ready";
    const hasSolution = stage !== "received";
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
  const mkBatch = (batchId: string, itemIds: string[], extra: Record<string, unknown> = {}) =>
    Batch.create({ batchId, filename: `${batchId}.xlsx`, itemIds, rows: itemIds.map((itemId) => ({ itemId })), receivedAt: T0, uploadedBy: "t", ...extra });
  const item = async (itemId: string) => (await Item.findOne({ itemId }).lean())!;
  const sentRows = (itemId: string) => Activity.countDocuments({ itemId, type: "revision", body: "Sent for review." });
  const inReviewSuggestions = (batchId: string) => Outbox.countDocuments({ kind: "batch_in_review", batchId });

  await clean();
  try {
    // --- outside the window: nothing at all ---
    await mk(id(90), { batchId: B("H") });
    await mkBatch(B("H"), [id(90)], { sampledAt: T0 });
    const saturday = new Date("2026-11-21T17:00:00Z");
    deepEqual(await rel.releaseDue(saturday), [], "outside the window releaseDue returns []");
    equal((await item(id(90))).stage, "ready", "still ready");
    equal((await Batch.findOne({ batchId: B("A") }).lean()), null, "no batch touched");
    await Item.deleteOne({ itemId: id(90) });
    await Solution.deleteMany({ itemId: id(90) });

    // --- batch not done (an item still received): not sampled, so nothing released ---
    const aIds = [id(0), id(1), id(2), id(3)];
    for (const i of aIds) await mk(i, { batchId: B("A") });
    await mk(id(4), { batchId: B("A"), stage: "received" });
    await mkBatch(B("A"), [...aIds, id(4)]);
    deepEqual(await rel.releaseDue(NOW), [], "batch not sampled → nothing released");
    for (const i of aIds) {
      const it = await item(i);
      ok(it.stage === "ready" && !it.pipeline?.heldFor && it.pipeline?.flags.length === 0, `${i} untouched`);
    }
    equal((await Batch.findOne({ batchId: B("A") }).lean())!.sampledAt, undefined, "batch A not sampled");
    // an item listed in the batch's sheet that has not arrived also keeps the batch open
    await Item.deleteOne({ itemId: id(4) });
    equal((await rel.applySample(B("A"), NOW)).status, "not_done", "a listed item not yet uploaded keeps the batch open");
    // a received item held for Praveen counts as done
    await mk(id(4), { batchId: B("A"), stage: "received", flags: ["type_not_supported"], heldFor: "praveen" });

    // --- batch B: 5 clean, due → 3 sampled (at least 3), 2 released, batch_in_review once ---
    const bIds = [id(10), id(11), id(12), id(13), id(14)];
    for (const i of bIds) await mk(i, { batchId: B("B") });
    await mkBatch(B("B"), bIds);
    const expectedSample = rel.pickSample(bIds, B("B"));
    equal(expectedSample.length, 3, "5 → sample of 3");
    const releasedB = await rel.releaseDue(NOW);
    const releasedHere = releasedB.filter((i) => bIds.includes(i)).sort();
    deepEqual(releasedHere, bIds.filter((i) => !expectedSample.includes(i)).sort(), "the two not sampled are released");
    for (const i of expectedSample) {
      const it = await item(i);
      ok(it.stage === "ready" && it.pipeline?.heldFor === "praveen" && it.pipeline.flags.join() === "sample" && it.pipeline.releaseAt === undefined, `${i} held as sample, releaseAt unset`);
      equal(await sentRows(i), 0, `${i} not released`);
    }
    for (const i of releasedHere) {
      const it = await item(i);
      ok(it.stage === "in_review" && it.releasedVersion === 1 && it.releasedAnswer === "B", `${i} in review, version 1 released`);
      ok((await Solution.findOne({ itemId: i, version: 1 }).lean())!.releasedAt, `${i} solution releasedAt`);
      equal(await sentRows(i), 1, `${i}: one activity row`);
      const row = (await Activity.findOne({ itemId: i, type: "revision" }).lean())!;
      ok(row.name === "Evelyn Learning" && row.role === "evelyn" && row.version === 1, "the row reads as Evelyn's submission");
      ok(!/pipeline|timer|automat|model|release/i.test(`${row.body}`), `row body mentions no machinery: ${row.body}`);
      equal(it.pipeline?.releaseClaim, undefined, "claim cleared");
    }
    ok((await Batch.findOne({ batchId: B("B") }).lean())!.sampledAt, "batch B sampled");
    equal(await inReviewSuggestions(B("B")), 1, "batch_in_review suggested once");
    const sug = (await Outbox.findOne({ kind: "batch_in_review", batchId: B("B") }).lean())!;
    ok(!/pipeline|timer|automat|model|keystone-release/i.test(`${sug.subject} ${sug.bodyMd}`), `suggestion reads plainly: ${sug.subject}`);
    // again: nothing more, still one row each, still one suggestion
    const again = (await rel.releaseDue(NOW)).filter((i) => bIds.includes(i));
    deepEqual(again, [], "second call releases nothing more");
    for (const i of releasedHere) equal(await sentRows(i), 1, `${i}: still one activity row`);
    equal(await inReviewSuggestions(B("B")), 1, "still one suggestion");

    // --- flagged / held never released (batch C sampled already) ---
    await mk(id(20), { batchId: B("C"), flags: ["solvers_split"], heldFor: "praveen" });
    await mk(id(21), { batchId: B("C"), heldFor: "praveen" });
    await mk(id(22), { batchId: B("C"), flags: ["answer_to_confirm"] });
    await mk(id(23), { batchId: B("C"), releaseAt: LATER });
    await mk(id(24), { batchId: B("C"), releaseAt: null });
    await mkBatch(B("C"), [id(20), id(21), id(22), id(23), id(24)], { sampledAt: T0 });
    // --- unreleased solution required (batch D sampled) ---
    await mk(id(30), { batchId: B("D"), solution: "none" });
    await mk(id(31), { batchId: B("D"), solution: "released" });
    await mkBatch(B("D"), [id(30), id(31)], { sampledAt: T0 });
    const cd = await rel.releaseDue(NOW);
    for (const i of [id(20), id(21), id(22), id(23), id(24), id(30), id(31)]) {
      ok(!cd.includes(i), `${i} not released`);
      equal((await item(i)).stage, "ready", `${i} still ready`);
      equal(await sentRows(i), 0, `${i}: no activity row`);
    }

    // --- an item without a batch is always held as sample ---
    await mk(id(40), { batchId: null });
    const nb = await rel.releaseDue(NOW);
    ok(!nb.includes(id(40)), "no batch → not released");
    const it40 = await item(id(40));
    ok(it40.pipeline?.heldFor === "praveen" && it40.pipeline.flags.join() === "sample" && it40.pipeline.releaseAt === undefined, "no batch → held as sample");

    // --- two calls at the same instant: each item released once, one activity row each ---
    const eIds = [id(50), id(51), id(52), id(53), id(54), id(55)];
    for (const i of eIds) await mk(i, { batchId: B("E") });
    await mkBatch(B("E"), eIds, { sampledAt: T0 });
    const [r1, r2] = await Promise.all([rel.releaseDue(NOW), rel.releaseDue(NOW)]);
    const e1 = r1.filter((i) => eIds.includes(i));
    const e2 = r2.filter((i) => eIds.includes(i));
    deepEqual([...e1, ...e2].sort(), eIds, `every item released exactly once across both calls (${e1.length} + ${e2.length})`);
    for (const i of eIds) {
      equal(await sentRows(i), 1, `${i}: one activity row`);
      equal((await item(i)).stage, "in_review", `${i} in review`);
    }
    equal(await inReviewSuggestions(B("E")), 1, "concurrent: batch_in_review suggested once");

    // --- crash between claim and release: picked up after the stale period, released once ---
    await mk(id(60), { batchId: B("F"), extra: {} });
    await Item.updateOne({ itemId: id(60) }, { $set: { "pipeline.releaseClaim": { owner: "dead", at: NOW } } });
    await mkBatch(B("F"), [id(60)], { sampledAt: T0 });
    ok(!(await rel.releaseDue(NOW)).includes(id(60)), "a fresh claim is respected");
    equal((await item(id(60))).stage, "ready", "still ready while claimed");
    const afterStale = new Date(NOW.getTime() + rel.STALE_MS + 60_000);
    ok((await rel.releaseDue(afterStale)).includes(id(60)), "stale claim → released by the next call");
    equal(await sentRows(id(60)), 1, "one activity row");
    ok(!(await rel.releaseDue(new Date(afterStale.getTime() + rel.STALE_MS * 2))).includes(id(60)), "and never again");
    equal(await sentRows(id(60)), 1, "still one activity row");

    // --- crash after the item moved to review: the next call finishes the bookkeeping once ---
    const at = new Date(NOW.getTime() - 60 * 60 * 1000);
    await mk(id(70), { batchId: B("G"), stage: "in_review", extra: { releasedVersion: 1, releasedAnswer: "B" } });
    await Item.updateOne({ itemId: id(70) }, { $set: { "pipeline.releaseClaim": { owner: "dead", at, releasedAt: at } } });
    await mk(id(71), { batchId: B("G"), stage: "in_review", extra: { releasedVersion: 1, releasedAnswer: "B" } });
    await Item.updateOne({ itemId: id(71) }, { $set: { "pipeline.releaseClaim": { owner: "dead", at, releasedAt: at } } });
    await Activity.create({ itemId: id(71), version: 1, type: "revision", body: "Sent for review.", username: "pipeline", name: "Evelyn Learning", role: "evelyn", createdAt: at });
    await mkBatch(B("G"), [id(70), id(71)], { sampledAt: T0 });
    await rel.releaseDue(NOW);
    for (const i of [id(70), id(71)]) {
      ok((await Solution.findOne({ itemId: i, version: 1 }).lean())!.releasedAt, `${i}: solution marked released`);
      equal(await sentRows(i), 1, `${i}: exactly one activity row`);
      equal((await item(i)).pipeline?.releaseClaim, undefined, `${i}: claim cleared`);
    }

    // --- applySample: idempotent and safe against a concurrent caller ---
    const jIds = Array.from({ length: 12 }, (_, n) => id(80 + n));
    for (const i of jIds) await mk(i, { batchId: B("J"), releaseAt: LATER });
    await mkBatch(B("J"), jIds);
    const [s1, s2] = await Promise.all([rel.applySample(B("J"), NOW), rel.applySample(B("J"), NOW)]);
    const flagged = await Item.find({ itemId: { $in: jIds }, "pipeline.flags": "sample" }).lean();
    equal(flagged.length, 3, `two concurrent calls → one sample of 3 (${s1.status}/${s2.status})`);
    deepEqual(flagged.map((x) => x.itemId).sort(), rel.pickSample(jIds, B("J")), "the deterministic sample");
    ok([s1.status, s2.status].includes("sampled"), "one call sampled");
    equal((await rel.applySample(B("J"), NOW)).status, "already", "a third call: already sampled");
    equal(await Item.countDocuments({ itemId: { $in: jIds }, "pipeline.flags": "sample" }), 3, "still 3");
    const bj = (await Batch.findOne({ batchId: B("J") }).lean())!;
    ok(bj.sampledAt && bj.sampledIds?.length === 3 && !bj.sampling, "sampledAt and the sample recorded, claim cleared");
    // a crash after the batch claim: the next caller after the stale period reuses the stored pick
    const j2 = [id(92), id(93), id(94), id(95)];
    for (const i of j2) await mk(i, { batchId: B("J2"), releaseAt: LATER });
    await mkBatch(B("J2"), j2, { sampling: { owner: "dead", at: NOW, ids: [id(92), id(93), id(94)] } });
    await Item.updateOne({ itemId: id(92) }, { $set: { "pipeline.flags": ["sample"], "pipeline.heldFor": "praveen" }, $unset: { "pipeline.releaseAt": "" } });
    equal((await rel.applySample(B("J2"), NOW)).status, "busy", "a fresh claim by another caller is respected");
    const sj2 = await rel.applySample(B("J2"), afterStale);
    equal(sj2.status, "sampled", "stale claim taken over");
    deepEqual((await Item.find({ itemId: { $in: j2 }, "pipeline.flags": "sample" }).lean()).map((x) => x.itemId).sort(), [id(92), id(93), id(94)], "the stored pick is finished, not a new one");
    // an empty batch (nothing clean) is still marked sampled
    await mk(id(96), { batchId: B("J3"), flags: ["no_agreement"], heldFor: "praveen" });
    await mkBatch(B("J3"), [id(96)]);
    equal((await rel.applySample(B("J3"), NOW)).status, "sampled", "nothing clean: sampled with no pick");

    // --- read-only mode: releaseDue refuses before any write ---
    await mk(id(97), { batchId: B("E") });
    process.env.KEYSTONE_READONLY = "1";
    await assert.rejects(() => rel.releaseDue(NOW), /read-only/, "read-only → releaseDue throws");
    delete process.env.KEYSTONE_READONLY;
    equal((await item(id(97))).stage, "ready", "nothing written in read-only mode");
    await Item.deleteOne({ itemId: id(97) });
    await Solution.deleteMany({ itemId: id(97) });

    // --- the lock: one holder at a time; an expired lock is taken over ---
    equal(await rel.acquireLock("dbtest-rel-lock", "one", NOW, 60_000), true, "first caller gets the lock");
    equal(await rel.acquireLock("dbtest-rel-lock", "two", NOW, 60_000), false, "second caller does not");
    equal(await rel.acquireLock("dbtest-rel-lock", "two", new Date(NOW.getTime() + 61_000), 60_000), true, "expired lock taken over");
    await rel.releaseLock("dbtest-rel-lock", "one");
    equal((await Lock.findById("dbtest-rel-lock").lean())?.owner, "two", "releasing someone else's lock does nothing");
    await rel.releaseLock("dbtest-rel-lock", "two");
    equal(await Lock.findById("dbtest-rel-lock").lean(), null, "released");

    // --- the script's dry run writes nothing (snapshot of every collection before and after) ---
    const lIds = [id(98), id(99)];
    for (const i of lIds) await mk(i, { batchId: B("L") });
    await mkBatch(B("L"), lIds);
    const snapshot = async () => {
      const out: Record<string, unknown[]> = {};
      const db = Item.db.db!;
      for (const c of (await db.listCollections().toArray()).map((x) => x.name).sort()) {
        out[c] = await db.collection(c).find({}).sort({ _id: 1 }).toArray();
      }
      return JSON.stringify(out);
    };
    const before = await snapshot();
    const script = path.join(__dirname, "../../../../scripts/keystone-release.ts");
    const res = spawnSync("npx", ["tsx", script, "--dry-run", "--now", NOW.toISOString()], {
      cwd: path.join(__dirname, "../../../.."),
      env: { ...process.env, KEYSTONE_MONGODB_URI: uri, KEYSTONE_DB_NAME: DB },
      encoding: "utf8",
      timeout: 120_000,
    });
    equal(res.status, 0, `dry run exits 0 (stderr: ${res.stderr})`);
    ok(/castle_rock_review_test on 127\.0\.0\.1:27017|castle_rock_review_test on localhost:27017/.test(res.stdout), `prints the database and host: ${res.stdout.split("\n")[0]}`);
    ok(/DRY RUN/.test(res.stdout), "says it is a dry run");
    ok(res.stdout.includes(id(98)) && res.stdout.includes(id(99)), "names the waiting items");
    ok(/sample/i.test(res.stdout), "says what would be sampled");
    ok(/Wed 2026-11-18/.test(res.stdout), "times in Mountain time");
    equal(res.stdout.trim().split("\n").filter((l) => /^release:/.test(l)).length, 1, "one summary line");
    equal(await snapshot(), before, "dry run: every collection unchanged");
    // an unsafe invocation is refused
    const bad = spawnSync("npx", ["tsx", script, "--now", NOW.toISOString()], { cwd: path.join(__dirname, "../../../.."), env: { ...process.env, KEYSTONE_MONGODB_URI: uri, KEYSTONE_DB_NAME: DB }, encoding: "utf8", timeout: 120_000 });
    ok(bad.status !== 0 && /--now/.test(bad.stderr), `--now without --dry-run refused (${bad.stderr.trim()})`);
    const noUri = spawnSync("npx", ["tsx", script, "--dry-run"], { cwd: path.join(__dirname, "../../../.."), env: { ...process.env, KEYSTONE_MONGODB_URI: "", MONGODB_URI: "mongodb://127.0.0.1:27017" }, encoding: "utf8", timeout: 120_000 });
    ok(noUri.status !== 0 && /KEYSTONE_MONGODB_URI/.test(noUri.stderr), "KEYSTONE_MONGODB_URI is required explicitly");
    equal(await snapshot(), before, "refused runs wrote nothing");

    console.log("release.dbtest ok");
  } finally {
    await clean();
    await closeKs();
    resetOutboxInit();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
