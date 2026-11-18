// Database test: a dry run (KEYSTONE_READONLY=1) creates no collection and no index, and any model write
// throws. Not part of test:keystone (needs a mongod):
//   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses its own throw-away database castle_rock_review_test_ro, dropped before and after.
import assert from "node:assert/strict";
import type { Steps } from "./run";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri)) {
  console.error(`readonly.dbtest refused to run: KEYSTONE_MONGODB_URI must be mongodb://127.0.0.1:27017 or mongodb://localhost:27017 (got "${uri || "unset"}"). It must never point at the production tunnel.`);
  process.exit(1);
}
const DB = "castle_rock_review_test_ro";
process.env.KEYSTONE_DB_NAME = DB;
delete process.env.KEYSTONE_READONLY;
delete process.env.KEYSTONE_PIPELINE_LIVE;

const ok = (value: unknown, message: string) => assert.ok(value, message);
const equal = (a: unknown, b: unknown, message: string) => assert.equal(a, b, message);

(async () => {
  const { ks, closeKs, READ_ONLY_MESSAGE } = await import("../db");
  const { resetOutboxInit } = await import("./outbox");
  const { runPipeline, mongoReader } = await import("./run");
  const T0 = new Date("2026-11-17T10:00:00Z");
  const B = { kind: "choice" as const, letters: ["B"] };
  const reply = <T,>(value: T) => ({ ok: true as const, value, cost: 0.1, model: "m", ms: 1, fellBack: false });
  const steps = {
    intakeModel: async () => ({ complete: true, missing: [], cost: 0.01, model: "m" }),
    agreeOnAnswer: async () => ({ decision: { outcome: "pass" as const, answer: B, confirm: false }, solves: { solver1: reply({ answer: B, working: "w", confidence: "high" as const }) }, cost: 0.2 }),
    writeSolution: async () => reply({ topic: "T", sections: [{ kind: "short" as const, md: "So the answer is B." }] }),
    calcCheck: async () => [],
    workingCheck: async () => ({ findings: [], cost: 0.05, model: "m" }),
    rulesAudit: async () => ({ findings: [], cost: 0.05, model: "m" }),
    renderCheck: async () => [],
    classifyCause: async () => reply({ cause: "style" as const, why: "" }),
  } as unknown as Steps;

  const drop = async () => {
    delete process.env.KEYSTONE_READONLY;
    const { Item } = await ks();
    equal(Item.db.name, DB, "throw-away database only");
    await Item.db.dropDatabase();
    await closeKs();
    resetOutboxInit();
  };

  await drop();
  try {
    // Seed with a normal (writing) connection, then remove the runs collection it created.
    {
      const { Item } = await ks();
      await Item.init();
      await Item.create({
        itemId: "991401", subject: "Mathematics", course: "Math 30-1", courseSource: "sheet", itemType: "MC", topic: "", standards: [], key: "B",
        evelynAnswer: "", keySource: "castle-rock", questionHtml: "<p>Which?</p>", options: ["A", "B"].map((label) => ({ label, html: label })),
        interactions: [{ kind: "choice", responseId: "RESPONSE", maxChoices: 1, options: ["A", "B"].map((label) => ({ label, html: label })) }],
        keys: { RESPONSE: ["B"] }, stage: "received", version: 0, releasedVersion: 0, releasedAnswer: "", showcase: false, source: "upload",
        order: 1, createdAt: T0, updatedAt: T0, lastActivityAt: T0,
      });
      const names = (await Item.db.db!.listCollections().toArray()).map((c) => c.name);
      if (names.includes("runs")) await Item.db.db!.dropCollection("runs");
      await closeKs();
      resetOutboxInit();
    }

    // Read-only connection: the dry run.
    process.env.KEYSTONE_READONLY = "1";
    const { Item, Run, Solution } = await ks();
    equal(Item.db.name, DB, "throw-away database only");
    const db = Item.db.db!;
    const indexesBefore = JSON.stringify(await db.collection("items").indexes());
    const collectionsBefore = (await db.listCollections().toArray()).map((c) => c.name).sort();
    ok(!collectionsBefore.includes("runs"), "no runs collection before");

    const out = await runPipeline(
      { dryRun: true },
      { reader: mongoReader(), makeRealWriter: () => { throw new Error("real writer built in a dry run"); }, deps: { steps, rules: [], images: async () => [], assetExists: () => true }, log: () => {} },
    );
    equal(out.runs.length, 1, "one item run");
    equal(out.runs[0].result, "ready", `would be ready (${out.runs[0].error ?? ""})`);

    const collectionsAfter = (await db.listCollections().toArray()).map((c) => c.name).sort();
    ok(!collectionsAfter.includes("runs"), "the dry run created no runs collection");
    equal(JSON.stringify(collectionsAfter), JSON.stringify(collectionsBefore), "no collection created");
    equal(JSON.stringify(await db.collection("items").indexes()), indexesBefore, "item indexes unchanged");
    equal((await Item.findOne({ itemId: "991401" }).lean())!.stage, "received", "item untouched");

    // The belt: a deliberate write through any model entry point fails loudly.
    const ro = new RegExp(READ_ONLY_MESSAGE.slice(0, 13));
    await assert.rejects(() => Item.updateOne({ itemId: "991401" }, { $set: { stage: "ready" } }), ro, "updateOne blocked");
    await assert.rejects(() => Item.updateMany({}, { $set: { stage: "ready" } }), ro, "updateMany blocked");
    await assert.rejects(() => Item.findOneAndUpdate({ itemId: "991401" }, { $set: { stage: "ready" } }), ro, "findOneAndUpdate blocked");
    await assert.rejects(() => Item.replaceOne({ itemId: "991401" }, { itemId: "991401" }), ro, "replaceOne blocked");
    await assert.rejects(() => Item.deleteOne({ itemId: "991401" }), ro, "deleteOne blocked");
    await assert.rejects(() => Item.deleteMany({}), ro, "deleteMany blocked");
    await assert.rejects(() => Run.create({ itemId: "991401", runId: "x" }), ro, "create blocked");
    await assert.rejects(() => Solution.insertMany([{ itemId: "991401", version: 1 }]), ro, "insertMany blocked");
    await assert.rejects(() => Item.bulkWrite([{ deleteOne: { filter: { itemId: "991401" } } }]), ro, "bulkWrite blocked");
    const doc = await Item.findOne({ itemId: "991401" });
    doc!.stage = "ready";
    await assert.rejects(() => doc!.save(), ro, "document save blocked");
    equal((await Item.findOne({ itemId: "991401" }).lean())!.stage, "received", "still untouched");
    ok(!(await db.listCollections().toArray()).some((c) => c.name === "runs"), "still no runs collection");
    await closeKs();
    resetOutboxInit();
    console.log("readonly.dbtest ok");
  } finally {
    await closeKs();
    await drop();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
