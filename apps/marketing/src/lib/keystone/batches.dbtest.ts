// Database test for sheet courses and batches. Not part of test:keystone (needs a mongod):
//   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses its own database (castle_rock_review_test) and only item ids 9900xx; deletes only what it created.
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import path from "node:path";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri)) {
  console.error(`batches.dbtest refused to run: KEYSTONE_MONGODB_URI must be mongodb://127.0.0.1:27017 or mongodb://localhost:27017 (got "${uri || "unset"}"). It must never point at the production tunnel.`);
  process.exit(1);
}
process.env.KEYSTONE_DB_NAME = "castle_rock_review_test";
process.env.KEYSTONE_DATA_DIR = path.join(tmpdir(), "ks-test-data");

const ids = ["990001", "990002", "990003", "990004", "990005"];

(async () => {
  const { ks, closeKs } = await import("./db");
  const { applySheetRow, createBatch, ingestQtiItems } = await import("./store");
  const { Item, Batch, Activity, Upload } = await ks();
  assert.equal(Item.db.name, "castle_rock_review_test", "must run against the test database");
  const clean = async () => {
    await Item.deleteMany({ itemId: { $in: ids } });
    await Activity.deleteMany({ itemId: { $in: ids } });
    await Batch.deleteMany({ batchId: /^dbtest-/ });
    await Upload.deleteMany({ filename: /^dbtest-/ });
  };
  const actor = { username: "t", name: "T", role: "evelyn" as const };
  const q = (itemId: string, course: string) => ({
    itemId, subject: "Mathematics", course, itemType: "MC", key: "A", standards: [], topic: "t", questionHtml: "<p>q</p>",
    options: [], castleRockSolutionHtml: "", resources: new Map<string, Uint8Array>(), raw: { apip: "", metadata: "", passages: [] },
  }) as unknown as Parameters<typeof ingestQtiItems>[0][number];
  const get = (id: string) => Item.findOne({ itemId: id }).lean();
  await clean();
  try {
    // new item from metadata
    await ingestQtiItems([q("990001", "Meta course")], actor, "up1");
    let it = await get("990001");
    assert.equal(it?.courseSource, "metadata");
    assert.equal(it?.releasedVersion, 0);
    const t0 = it!.createdAt;

    // receivedAt = max(batch time, createdAt): batch later than creation
    const t1 = new Date(Date.now() + 3600_000);
    const b1 = await createBatch("dbtest-1.csv", "t", [{ itemId: "990001", course: "Math 30-1", showcase: true }, { itemId: "990002", course: "Biology 30" }], { batchId: "dbtest-1", receivedAt: t1 });
    const b = await Batch.findOne({ batchId: "dbtest-1" }).lean();
    assert.deepEqual(b?.itemIds, ["990001", "990002"]);
    assert.equal(b?.rows.length, 2);
    assert.equal(await applySheetRow({ itemId: "990001", course: "Math 30-1", showcase: true }, b1), "updated");
    assert.equal(await applySheetRow({ itemId: "990002", course: "Biology 30" }, b1), "missing");
    it = await get("990001");
    assert.equal(it?.course, "Math 30-1");
    assert.equal(it?.courseSource, "sheet");
    assert.equal(it?.batchId, "dbtest-1");
    assert.equal(it?.showcase, true);
    assert.ok(t0 < t1);
    assert.equal(it?.receivedAt?.getTime(), t1.getTime(), "sheet later than creation: receivedAt = sheet time");

    // batch older than the item: receivedAt = createdAt
    const old = await createBatch("dbtest-old.csv", "t", [{ itemId: "990001", course: "Math 30-1" }], { batchId: "dbtest-old", receivedAt: new Date(t0.getTime() - 3600_000) });
    await applySheetRow({ itemId: "990001", course: "Math 30-1" }, old);
    it = await get("990001");
    assert.equal(it?.receivedAt?.getTime(), t0.getTime(), "sheet earlier than creation: receivedAt = createdAt");

    // re-send keeps the sheet course and bumps receivedAt
    const before = (await get("990001"))!.receivedAt!;
    await new Promise((r) => setTimeout(r, 15));
    await ingestQtiItems([q("990001", "Meta again")], actor, "up2");
    it = await get("990001");
    assert.equal(it?.course, "Math 30-1");
    assert.equal(it?.courseSource, "sheet");
    assert.ok(it!.receivedAt! > before, "re-send: receivedAt moves forward");

    // legacy row (courseSource undefined) keeps its course on re-send
    await Item.updateOne({ itemId: "990001" }, { $set: { course: "Legacy Sheet Course" }, $unset: { courseSource: 1 } });
    await ingestQtiItems([q("990001", "Meta again")], actor, "up3");
    it = await get("990001");
    assert.equal(it?.course, "Legacy Sheet Course");
    assert.equal(it?.courseSource, undefined);

    // a metadata course is refreshed on re-send
    await Item.updateOne({ itemId: "990001" }, { $set: { courseSource: "metadata" } });
    await ingestQtiItems([q("990001", "Fresh meta")], actor, "up4");
    it = await get("990001");
    assert.equal(it?.course, "Fresh meta");
    assert.equal(it?.courseSource, "metadata");

    // item arriving after its sheet row picks it up; receivedAt is its own creation time
    await ingestQtiItems([q("990002", "Meta course")], actor, "up5");
    const late = await get("990002");
    assert.equal(late?.course, "Biology 30");
    assert.equal(late?.courseSource, "sheet");
    assert.equal(late?.batchId, "dbtest-1");
    assert.ok(late!.receivedAt!.getTime() >= late!.createdAt.getTime());

    // item in two sheets: each field from the newest sheet that carries it, batchId from the newest listing it
    await createBatch("dbtest-a.csv", "t", [{ itemId: "990003", course: "Math 30-1", subject: "Mathematics" }], { batchId: "dbtest-a", receivedAt: new Date(Date.now() - 2000) });
    await createBatch("dbtest-b.csv", "t", [{ itemId: "990003", subject: "Maths B" }], { batchId: "dbtest-b", receivedAt: new Date(Date.now() - 1000) });
    await ingestQtiItems([q("990003", "Meta course")], actor, "up6");
    const two = await get("990003");
    assert.equal(two?.course, "Math 30-1");
    assert.equal(two?.courseSource, "sheet");
    assert.equal(two?.subject, "Maths B");
    assert.equal(two?.batchId, "dbtest-b");
    console.log("batches dbtest passed");
  } finally {
    await clean();
    await closeKs();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
