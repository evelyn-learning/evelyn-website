// Database test for the level of an item (read from the question by the pipeline, corrected by a person).
// Not part of test:keystone (needs a mongod):
//   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses its own database (castle_rock_review_test) and only item ids 9902xx; deletes only what it created.
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import path from "node:path";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri)) {
  console.error(`level.dbtest refused to run: KEYSTONE_MONGODB_URI must be mongodb://127.0.0.1:27017 or mongodb://localhost:27017 (got "${uri || "unset"}"). It must never point at the production tunnel.`);
  process.exit(1);
}
process.env.KEYSTONE_DB_NAME = "castle_rock_review_test";
process.env.KEYSTONE_DATA_DIR = path.join(tmpdir(), "ks-test-data");

const ids = ["990201", "990202", "990203", "990204"];

(async () => {
  const { ks, closeKs } = await import("./db");
  const { SupersededError, correctLevel, ingestQtiItems, setLevelIfUnchanged } = await import("./store");
  const { Item, Activity } = await ks();
  assert.equal(Item.db.name, "castle_rock_review_test", "must run against the test database");
  const clean = async () => {
    await Item.deleteMany({ itemId: { $in: ids } });
    await Activity.deleteMany({ itemId: { $in: ids } });
  };
  const reviewer = { username: "r", name: "R", role: "reviewer" as const };
  const q = (itemId: string, course: string) => ({
    itemId, subject: "Mathematics", course, itemType: "MC", key: "A", standards: [], topic: "t", questionHtml: "<p>q</p>",
    options: [], castleRockSolutionHtml: "", resources: new Map<string, Uint8Array>(), raw: { apip: "", metadata: "", passages: [] },
  }) as unknown as Parameters<typeof ingestQtiItems>[0][number];
  const get = async (id: string) => (await Item.findOne({ itemId: id }).lean())!;
  const expectOf = (i: { stage: string; version?: number; updatedAt: Date }) => ({ stage: i.stage, version: i.version || 0, updatedAt: i.updatedAt }) as Parameters<typeof setLevelIfUnchanged>[3];
  await clean();
  try {
    // The pipeline's level: stored without moving the item, so the same run can still write to it.
    await ingestQtiItems([q("990201", "Pure Math 30")], reviewer, "up-level");
    let it = await get("990201");
    assert.equal(it.courseSource, "metadata");
    const from = expectOf(it);
    await setLevelIfUnchanged("990201", "Math 30-2", "odds", from);
    it = await get("990201");
    assert.equal(it.course, "Math 30-2");
    assert.equal(it.courseSource, "pipeline");
    assert.equal(it.levelWhy, "odds");
    assert.equal(it.updatedAt.getTime(), from.updatedAt.getTime(), "updatedAt unchanged");
    await setLevelIfUnchanged("990201", "Math 30-2", "odds", from); // the run's later writes still match

    // Re-sending the item keeps the level (only a course that came from the file's data is refreshed from it).
    await ingestQtiItems([q("990201", "Pure Math 30")], reviewer, "up-level-2");
    it = await get("990201");
    assert.equal(it.course, "Math 30-2", "level kept on a re-send");
    assert.equal(it.courseSource, "pipeline");

    // A person corrects it before any solution: the item changes (a run in flight is superseded), no send-back.
    const before = expectOf(it);
    const stage = await correctLevel("990201", "  mathematics 30–1 ", "It uses the binomial theorem.", reviewer);
    it = await get("990201");
    assert.equal(stage, "received");
    assert.equal(it.course, "Math 30-1", "written in the canonical spelling");
    assert.equal(it.courseSource, "person");
    assert.equal(it.levelWhy, undefined, "the pipeline's reason is dropped");
    await assert.rejects(() => setLevelIfUnchanged("990201", "Math 30-2", "x", before), SupersededError);
    let acts = await Activity.find({ itemId: "990201", type: "comment" }).lean();
    assert.equal(acts.length, 1);
    assert.equal(acts[0].body, "Level changed from Math 30-2 to Math 30-1. It uses the binomial theorem.");

    // A solution in review was written to the old level: it goes back to Evelyn with the correction as the note.
    await ingestQtiItems([q("990202", "Science 7")], reviewer, "up-level");
    await Item.updateOne({ itemId: "990202" }, { $set: { stage: "in_review", version: 1, releasedVersion: 1, course: "Grade 7 Science", courseSource: "pipeline" } });
    assert.equal(await correctLevel("990202", "Grade 8 Science", "", reviewer), "changes_requested");
    it = await get("990202");
    assert.equal(it.stage, "changes_requested");
    assert.equal(it.course, "Grade 8 Science");
    acts = await Activity.find({ itemId: "990202", type: "verdict" }).lean();
    assert.equal(acts.length, 1);
    assert.equal(acts[0].verdict, "changes");
    assert.equal(acts[0].body, "Level changed from Grade 7 Science to Grade 8 Science. Please write the solution to this level.");

    // A solution Castle Rock cannot see yet (ready, unreleased) is not sent back: it is simply written again.
    await ingestQtiItems([q("990203", "x")], reviewer, "up-level");
    await Item.updateOne({ itemId: "990203" }, { $set: { stage: "ready", version: 1, releasedVersion: 0, course: "Math 30-1", courseSource: "pipeline" } });
    assert.equal(await correctLevel("990203", "Math 30-2", "", reviewer), "ready");
    assert.equal(await Activity.countDocuments({ itemId: "990203", type: "verdict" }), 0);

    // Refusals: empty, too long, markup, a settled item, no change.
    await ingestQtiItems([q("990204", "x")], reviewer, "up-level");
    await assert.rejects(() => correctLevel("990204", "   ", "", reviewer), /write the level/);
    await assert.rejects(() => correctLevel("990204", "x".repeat(41), "", reviewer), /short name/);
    await assert.rejects(() => correctLevel("990204", "<b>Math</b>", "", reviewer), /short name/);
    await correctLevel("990204", "Math 30-1", "", reviewer);
    await assert.rejects(() => correctLevel("990204", "Math 30-1", "", reviewer), /already Math 30-1/);
    await Item.updateOne({ itemId: "990204" }, { $set: { stage: "approved" } });
    await assert.rejects(() => correctLevel("990204", "Math 30-2", "", reviewer), /settled/);
    assert.equal((await get("990204")).course, "Math 30-1");

    console.log("level.dbtest ok");
  } finally {
    await clean();
    await closeKs();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
