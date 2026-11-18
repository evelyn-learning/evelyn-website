// Database test (M5): in the reviewer's overview feed a timer release and the owner's "Send to review" read and
// sort exactly like a manual submit: one row, the write's own body, at the release time. Query level.
// Not part of test:keystone (needs a mongod):  KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses its own database castle_rock_review_feed_test (the feed reads every row); drops it before and after.
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import path from "node:path";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri)) {
  console.error(`feed.dbtest refused to run: KEYSTONE_MONGODB_URI must be mongodb://127.0.0.1:27017 or mongodb://localhost:27017 (got "${uri || "unset"}"). It must never point at the production tunnel.`);
  process.exit(1);
}
const DB = "castle_rock_review_feed_test";
process.env.KEYSTONE_DB_NAME = DB;
process.env.KEYSTONE_DATA_DIR = path.join(tmpdir(), "ks-test-data-feed");
delete process.env.KEYSTONE_READONLY;

const equal = (a: unknown, b: unknown, message: string) => assert.equal(a, b, message);
const deepEqual = (a: unknown, b: unknown, message: string) => assert.deepEqual(a, b, message);

const H = 3_600_000;
const T0 = new Date("2026-11-15T17:00:00Z"); // written two days before
const T1 = new Date("2026-11-17T16:00:00Z"); // manual submit
const T2 = new Date("2026-11-17T17:00:00Z"); // timer release
const T3 = new Date("2026-11-17T18:00:00Z"); // owner's send

(async () => {
  const { ks, closeKs } = await import("./db");
  const q = await import("./queries");
  const { SENT_FOR_REVIEW, IN_REVIEW_BODY } = await import("./store");
  const { Item, Solution, Activity } = await ks();
  equal(Item.db.name, DB, "must run against the feed test database");
  await Item.db.db!.dropDatabase();
  try {
    const EV = { username: "praveen", name: "Evelyn Learning", role: "evelyn" as const };
    const PIPE = { username: "pipeline", name: "Evelyn Learning", role: "evelyn" as const };
    const mkItem = (itemId: string, stage = "in_review") =>
      Item.create({ itemId, subject: "Mathematics", course: "Math 30-1", itemType: "MC", topic: "", standards: [], key: "B", evelynAnswer: "B", keySource: "castle-rock",
        questionHtml: "<p>q</p>", options: [], stage, version: 1, releasedVersion: 1, releasedAnswer: "B", showcase: false, source: "upload", order: 1, createdAt: T0, updatedAt: T3, lastActivityAt: T3 });
    // manual submit (saveSolution submit): one revision row written at the release
    await mkItem("f-manual");
    await Solution.create({ itemId: "f-manual", version: 1, sections: [], author: "Evelyn Learning", releasedAt: T1 });
    await Activity.create({ itemId: "f-manual", version: 1, type: "revision", body: "Solution written.", ...EV, createdAt: T1 });
    // timer: written two days before, released by the timer (its stage row is not in the reviewer's feed types)
    await mkItem("f-timer");
    await Solution.create({ itemId: "f-timer", version: 1, sections: [], author: "Evelyn Learning", runId: "r", releasedAt: T2 });
    await Activity.create({ itemId: "f-timer", version: 1, type: "revision", body: "Solution written.", ...PIPE, createdAt: T0 });
    await Activity.create({ itemId: "f-timer", type: "stage", stage: "in_review", body: IN_REVIEW_BODY, ...PIPE, createdAt: T2 });
    // owner: written two days before, sent by Praveen ("Sent for review." row at the send)
    await mkItem("f-owner");
    await Solution.create({ itemId: "f-owner", version: 1, sections: [], author: "Evelyn Learning", runId: "r", releasedAt: T3 });
    await Activity.create({ itemId: "f-owner", version: 1, type: "revision", body: "Solution written.", ...PIPE, createdAt: T0 });
    await Activity.create({ itemId: "f-owner", version: 1, type: "revision", body: SENT_FOR_REVIEW, ...EV, createdAt: T3 });
    // noise: a comment, older rows filling the window, and a version written but not released (hidden)
    await mkItem("f-hidden", "ready");
    await Item.updateOne({ itemId: "f-hidden" }, { $set: { version: 2, releasedVersion: 1 } });
    await Solution.create({ itemId: "f-hidden", version: 1, sections: [], author: "Evelyn Learning", releasedAt: new Date(T0.getTime() - 10 * H) });
    await Solution.create({ itemId: "f-hidden", version: 2, sections: [], author: "Evelyn Learning", runId: "r" });
    await Activity.create({ itemId: "f-hidden", version: 2, type: "revision", body: "Revised to version 2.", ...PIPE, createdAt: new Date(T3.getTime() + H) });
    for (let k = 0; k < 30; k++) await Activity.create({ itemId: "f-manual", type: "comment", body: `old ${k}`, ...EV, createdAt: new Date(T0.getTime() + k * 60_000 + 3 * H) });

    const feed = await q.recentActivity({ roles: ["evelyn"], types: ["revision", "comment"], limit: 4, viewer: "reviewer" });
    const shape = (r: { itemId: string; type: string; version?: number; body?: string; name: string; role: string; createdAt: Date }) =>
      ({ itemId: r.itemId, type: r.type, version: r.version, body: r.body, name: r.name, role: r.role, at: new Date(r.createdAt).toISOString() });
    deepEqual(
      feed.slice(0, 3).map(shape),
      [
        { itemId: "f-owner", type: "revision", version: 1, body: "Solution written.", name: "Evelyn Learning", role: "evelyn", at: T3.toISOString() },
        { itemId: "f-timer", type: "revision", version: 1, body: "Solution written.", name: "Evelyn Learning", role: "evelyn", at: T2.toISOString() },
        { itemId: "f-manual", type: "revision", version: 1, body: "Solution written.", name: "Evelyn Learning", role: "evelyn", at: T1.toISOString() },
      ],
      "M5: timer and owner releases read and sort like the manual submit, at the release time",
    );
    equal(feed.filter((r) => r.body === SENT_FOR_REVIEW).length, 0, "M5: the owner's separate row is folded in (one row per version)");
    equal(feed.filter((r) => r.itemId === "f-hidden").length, 0, "M5: an unreleased version stays hidden");
    equal(feed.length, 4, "M5: the limit holds");
    // Evelyn's own feed is unchanged (write times, every row)
    const mine = await q.recentActivity({ roles: ["evelyn"], types: ["revision"], limit: 10 });
    equal(mine.filter((r) => r.itemId === "f-owner").length, 2, "Evelyn still sees both of her rows");
    console.log("feed.dbtest ok");
  } finally {
    await Item.db.db!.dropDatabase();
    await closeKs();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
