// Database test for the run (real store, faked models). Not part of test:keystone (needs a mongod):
//   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses castle_rock_review_test and only item ids 9913xx / batch "dbtest-run-1"; deletes only what it created.
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import path from "node:path";
import type { Steps } from "./run";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri)) {
  console.error(`run.dbtest refused to run: KEYSTONE_MONGODB_URI must be mongodb://127.0.0.1:27017 or mongodb://localhost:27017 (got "${uri || "unset"}"). It must never point at the production tunnel.`);
  process.exit(1);
}
process.env.KEYSTONE_DB_NAME = "castle_rock_review_test";
process.env.KEYSTONE_DATA_DIR = path.join(tmpdir(), "ks-test-data");
delete process.env.KEYSTONE_PIPELINE_LIVE;

const ok = (value: unknown, message: string) => assert.ok(value, message);
const equal = (a: unknown, b: unknown, message: string) => assert.equal(a, b, message);
const ids = ["991301", "991302", "991303", "991304", "991305"];
const BATCH = "dbtest-run-1";

(async () => {
  const { ks, closeKs } = await import("../db");
  const store = await import("../store");
  const { resetOutboxInit } = await import("./outbox");
  const { processItem, mongoReader, mongoWriter } = await import("./run");
  const { Item, Solution, Activity, Outbox, Run } = await ks();
  equal(Item.db.name, "castle_rock_review_test", "must run against the test database");
  const clean = async () => {
    await Item.deleteMany({ itemId: { $in: ids } });
    await Solution.deleteMany({ itemId: { $in: ids } });
    await Activity.deleteMany({ itemId: { $in: ids } });
    await Run.deleteMany({ itemId: { $in: ids } });
    await Outbox.deleteMany({ batchId: BATCH });
  };
  const T0 = new Date("2026-11-17T10:00:00Z");
  const mk = (itemId: string, p: Record<string, unknown> = {}) =>
    Item.create({
      itemId, subject: "Mathematics", course: "Math 30-1", courseSource: "sheet", itemType: "MC", topic: "", standards: [], key: "B",
      evelynAnswer: "", keySource: "castle-rock", questionHtml: "<p>Which value is right?</p>",
      options: ["A", "B", "C", "D"].map((label) => ({ label, html: label })),
      interactions: [{ kind: "choice", responseId: "RESPONSE", maxChoices: 1, options: ["A", "B", "C", "D"].map((label) => ({ label, html: label })) }],
      keys: { RESPONSE: ["B"] }, stage: "received", version: 0, releasedVersion: 0, releasedAnswer: "", batchId: BATCH,
      showcase: false, source: "upload", order: 1, createdAt: T0, updatedAt: T0, lastActivityAt: T0, ...p,
    });
  const B = { kind: "choice" as const, letters: ["B"] };
  const reply = <T,>(value: T) => ({ ok: true as const, value, cost: 0.1, model: "m", ms: 1, fellBack: false });
  let solveCalls = 0;
  let throwInWrite = false;
  const steps = {
    intakeModel: async () => ({ complete: true, missing: [] }),
    agreeOnAnswer: async () => {
      solveCalls++;
      return { decision: { outcome: "pass" as const, answer: B, confirm: false }, solves: { solver1: reply({ answer: B, working: "w", confidence: "high" as const }) }, cost: 0.2 };
    },
    writeSolution: async () => {
      if (throwInWrite) throw new Error("killed");
      return reply({ topic: "Values", sections: [{ kind: "short" as const, md: "Short. So the answer is B." }, { kind: "diploma" as const, md: "Work.\nSo the answer is B." }] });
    },
    calcCheck: async () => [],
    workingCheck: async () => ({ findings: [], cost: 0.05, model: "m" }),
    rulesAudit: async () => ({ findings: [], cost: 0.05, model: "m" }),
    renderCheck: async () => [],
    classifyCause: async () => reply({ cause: "style" as const, why: "" }),
  } as unknown as Steps;
  const actor = { username: "pipeline", name: "Evelyn Learning", role: "evelyn" as const };
  const deps = () => ({ reader: mongoReader(), writer: mongoWriter(actor), steps, rules: [], images: async () => [], assetExists: () => true });

  await clean();
  try {
    // happy path: stage ready, v1 hidden (no releasedAt), pipeline record, run record
    await mk("991301");
    const r1 = await processItem("991301", "run-a", deps());
    equal(r1.result, "ready", `ready (${r1.error ?? ""})`);
    const it1 = (await Item.findOne({ itemId: "991301" }).lean())!;
    equal(it1.stage, "ready", "stage ready");
    equal(it1.version, 1, "version 1");
    equal(it1.evelynAnswer, "B", "answer");
    equal(it1.releasedVersion, 0, "not released");
    ok(it1.pipeline?.passedAt, "passedAt");
    equal(it1.pipeline?.heldFor, undefined, "not held");
    const sol = (await Solution.findOne({ itemId: "991301", version: 1 }).lean())!;
    equal(sol.releasedAt, undefined, "solution has no releasedAt");
    const runRow = (await Run.findOne({ itemId: "991301", runId: "run-a" }).lean())!;
    equal(runRow.result, "ready", "run stored");
    ok(runRow.steps.length >= 7, `steps stored (${runRow.steps.length})`);
    ok(Math.abs(runRow.cost - 0.4) < 1e-9, `cost ${runRow.cost}`);

    // intake finding: item_data + verdict row + one suggestion for the batch
    await mk("991302", { questionHtml: "" });
    const r2 = await processItem("991302", "run-a", deps());
    equal(r2.result, "item_data", "item_data");
    equal((await Item.findOne({ itemId: "991302" }).lean())!.stage, "item_data", "stage item_data");
    const v = (await Activity.findOne({ itemId: "991302", type: "verdict" }).lean())!;
    equal(v.verdict, "item_data", "verdict row");
    equal(v.name, "Evelyn Learning", "by Evelyn");
    const sug = await Outbox.find({ batchId: BATCH, kind: "items_need_data" }).lean();
    equal(sug.length, 1, "one suggestion");
    ok(sug[0].itemIds.includes("991302"), "names the item");

    // resume: crash in write, then again with the same runId → solvers not called again
    await mk("991303");
    throwInWrite = true;
    solveCalls = 0;
    const r3a = await processItem("991303", "run-b", deps());
    equal(r3a.result, "failed", "crashed");
    equal((await store.resumableRun("991303"))?.runId, "run-b", "resumable run found");
    throwInWrite = false;
    const r3b = await processItem("991303", "run-b", deps());
    equal(r3b.result, "ready", "finished on resume");
    equal(solveCalls, 1, "solve not repeated");
    equal(await store.resumableRun("991303"), null, "nothing left to resume");

    // conditional writes: a stale expect writes nothing
    await mk("991304");
    const w = mongoWriter(actor);
    const stale = { stage: "received" as const, version: 0, updatedAt: new Date(T0.getTime() - 1) };
    const sections = [{ kind: "short" as const, md: "x" }];
    await assert.rejects(() => w.saveSolution("991304", { sections, evelynAnswer: "B", pipeline: { flags: [] } }, stale), store.SupersededError, "stale save rejected");
    equal(await Solution.countDocuments({ itemId: "991304" }), 0, "no solution row left behind");
    await assert.rejects(() => w.raiseKeyQuery("991304", "C", "w", stale), store.SupersededError, "stale key query rejected");
    await assert.rejects(() => w.flagItemData("991304", "n", stale), store.SupersededError, "stale item_data rejected");
    await assert.rejects(() => w.setPipeline("991304", { flags: ["step_failed"], heldFor: "praveen" }, stale), store.SupersededError, "stale pipeline rejected");
    const after = (await Item.findOne({ itemId: "991304" }).lean())!;
    ok(after.stage === "received" && after.version === 0 && !after.keyQuery && !after.pipeline, "item untouched");
    // approved with a matching expect is refused too
    await Item.updateOne({ itemId: "991304" }, { $set: { stage: "approved" } });
    const fresh = { stage: "approved" as const, version: 0, updatedAt: T0 };
    await assert.rejects(() => w.saveSolution("991304", { sections, evelynAnswer: "B", pipeline: { flags: [] } }, fresh), store.SupersededError, "approved refused");
    await assert.rejects(() => w.setPipeline("991304", { flags: [] }, fresh), store.SupersededError, "approved refused (pipeline)");

    // existing callers unchanged: saveSolution without expect still saves and releases on submit
    await mk("991305");
    const ver = await store.saveSolution("991305", sections, actor, { submit: true });
    equal(ver, 1, "saved");
    const it5 = (await Item.findOne({ itemId: "991305" }).lean())!;
    equal(it5.stage, "in_review", "submitted");
    equal(it5.releasedVersion, 1, "released");
    console.log("run.dbtest ok");
  } finally {
    await clean();
    await closeKs();
    resetOutboxInit();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
