// Database test for bulk mode's state: the bulkjobs / bulkcalls collections (mongoBulkStore), the bulk marks on a
// run record (steps[].batch, waitingOnBatch), the daily status's reading of a run that waits on a batch, and the
// read-only mode. Not part of test:keystone (needs a mongod):
//   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses its own database castle_rock_review_bulk_test; drops it before and after.
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import path from "node:path";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri)) {
  console.error(`bulk.dbtest refused to run: KEYSTONE_MONGODB_URI must be mongodb://127.0.0.1:27017 or mongodb://localhost:27017 (got "${uri || "unset"}"). It must never point at the production tunnel.`);
  process.exit(1);
}
const DB = "castle_rock_review_bulk_test";
process.env.KEYSTONE_DB_NAME = DB;
process.env.KEYSTONE_DATA_DIR = path.join(tmpdir(), "ks-test-data-bulk");
delete process.env.KEYSTONE_READONLY;

const ok = (value: unknown, message: string) => assert.ok(value, message);
const equal = (a: unknown, b: unknown, message: string) => assert.equal(a, b, message);
const deepEqual = (a: unknown, b: unknown, message: string) => assert.deepEqual(a, b, message);

const NOW = new Date("2026-11-18T18:00:00Z");
const HOUR = 3_600_000;

(async () => {
  const { ks, closeKs } = await import("../db");
  const store = await import("../store");
  const { mongoBulkStore } = await import("./bulk");
  const { buildStatus, bulkLateLine } = await import("./status");
  const { BulkJob, BulkCall, Run } = await ks();
  equal(BulkJob.db.name, DB, "must run against the bulk test database");
  await BulkJob.db.db!.dropDatabase();
  try {
    const bulk = mongoBulkStore();
    const at = new Date("2026-11-18T10:00:00Z");
    const job = { jobId: "j1", vendor: "anthropic" as const, model: "claude-opus-5-5", status: "submitting" as const, waves: [1], itemIds: ["1", "2"], customIds: ["ks-a-0", "ks-b-0"], createdAt: at };
    const call = (customId: string, itemId: string) => ({ customId, jobId: "j1", itemId, runId: "r1", role: "solver1", vendor: "anthropic" as const, model: "claude-opus-5-5", wave: 1, hash: customId, state: "pending" as const, cost: 0, listCost: 0, createdAt: at });
    await bulk.saveCalls([call("ks-a-0", "1"), call("ks-b-0", "2")]);
    await bulk.saveJob(job);
    deepEqual((await bulk.openJobs()).map((j) => [j.jobId, j.status, j.customIds, j.waves, j.itemIds]), [["j1", "submitting", ["ks-a-0", "ks-b-0"], [1], ["1", "2"]]], "a job is stored and found open");
    await bulk.saveJob({ ...job, status: "submitted", vendorBatchId: "msgbatch_x", submittedAt: at });
    const open = await bulk.openJobs();
    deepEqual([open.length, open[0].vendorBatchId, open[0].submittedAt?.getTime()], [1, "msgbatch_x", at.getTime()], "saving again replaces it (one row), with the vendor id and time");
    equal(await BulkJob.countDocuments({}), 1, "one job row");
    const reply = { text: "{\"a\":1}", tokensIn: 10, tokensOut: 5, model: "claude-opus-5-5", fellBack: false };
    await bulk.saveCalls([{ ...call("ks-a-0", "1"), state: "succeeded", reply, cost: 0.01, listCost: 0.02, collectedAt: NOW }]);
    const mine = await bulk.calls("1", "r1");
    deepEqual([mine.length, mine[0].state, mine[0].reply, mine[0].cost, mine[0].listCost], [1, "succeeded", reply, 0.01, 0.02], "a request's outcome is stored with its reply and both prices");
    equal((await bulk.calls("1", "other-run")).length, 0, "requests belong to one run of one item");
    deepEqual((await bulk.callsOfJob("j1")).map((c) => [c.customId, c.state]), [["ks-a-0", "succeeded"], ["ks-b-0", "pending"]], "the job's requests");
    await bulk.saveCalls([{ ...mine[0], live: { why: "refused in the batch", reply, cost: 0.02, at: NOW } }]);
    equal((await bulk.calls("1", "r1"))[0].live?.why, "refused in the batch", "the live call made in its place is kept on the request");
    await bulk.saveJob({ ...open[0], status: "ended", finishedAt: NOW, collectedAt: NOW });
    equal((await bulk.openJobs()).length, 0, "a collected job is no longer open");
    equal(await BulkCall.countDocuments({}), 2, "two request rows");
    await assert.rejects(BulkCall.create(call("ks-a-0", "9")), /duplicate key/, "a custom id is unique");

    // The run record keeps the bulk marks.
    const from = { stage: "received" as const, version: 0, updatedAt: at };
    await store.saveRun({
      itemId: "1", runId: "r1", startedAt: new Date(NOW.getTime() - 5 * HOUR), mode: "fresh", startedFrom: from, corrections: 0, flags: [], cost: 0.01, assetsChecked: true,
      steps: [{ step: "solve", key: "solve#0", at, ok: true, output: {}, cost: 0.01, batch: { ids: ["ks-a-0"], calls: 1, live: 0, saved: 0.01 } }],
      waitingOnBatch: new Date(NOW.getTime() - 4 * HOUR),
    });
    const back = (await store.getRun("1", "r1"))!;
    deepEqual(back.steps[0].batch, { ids: ["ks-a-0"], calls: 1, live: 0, saved: 0.01 }, "the step's batch mark is stored");
    equal(back.waitingOnBatch?.getTime(), NOW.getTime() - 4 * HOUR, "so is since when the run waits on a batch");

    // The daily status: a run waiting on a batch is not "never finished"; one that has waited over 26 h is reported.
    let f = (await buildStatus(NOW, { env: {} })).failures;
    ok(!f.some((x) => /never finished/.test(x)), `a run waiting on a batch is not reported as stopped (${f})`);
    ok(!f.includes(bulkLateLine(1)), "and not as late after 4 hours");
    await Run.updateOne({ itemId: "1", runId: "r1" }, { $set: { waitingOnBatch: new Date(NOW.getTime() - 27 * HOUR) } });
    f = (await buildStatus(NOW, { env: {} })).failures;
    ok(f.includes(bulkLateLine(1)), `after 27 hours it is reported, with what to do (${f})`);
    await Run.updateOne({ itemId: "1", runId: "r1" }, { $set: { result: "ready", finishedAt: NOW }, $unset: { waitingOnBatch: "" } });
    f = (await buildStatus(NOW, { env: {} })).failures;
    ok(!f.includes(bulkLateLine(1)), "a finished run is not");

    // Read-only (a dry run): the two collections refuse every write.
    await closeKs();
    process.env.KEYSTONE_READONLY = "1";
    const ro = mongoBulkStore();
    await assert.rejects(ro.saveJob({ ...job, jobId: "j2" }), /read-only/, "read-only: no job is written");
    await assert.rejects(ro.saveCalls([call("ks-c-0", "3")]), /read-only/, "read-only: no request is written");
    equal((await ro.calls("1", "r1")).length, 1, "read-only: reading still works");
    delete process.env.KEYSTONE_READONLY;
    await closeKs();
    console.log("bulk.dbtest ok");
  } finally {
    delete process.env.KEYSTONE_READONLY;
    await closeKs();
    const { ks: again, closeKs: close } = await import("../db");
    const m = await again();
    equal(m.BulkJob.db.name, DB, "dropping only the test database");
    await m.BulkJob.db.db!.dropDatabase();
    await close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
