// Database test: "waiting on the owner" is one definition (pipeline/holds.ts) — the queue, the top bar's count and
// the email's "waiting on you" agree on a seeded mix (I3). Not part of test:keystone (needs a mongod):
//   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses its own database castle_rock_review_holds_test (the counts read every row); drops it before and after.
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import path from "node:path";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri)) {
  console.error(`holds.dbtest refused to run: KEYSTONE_MONGODB_URI must be mongodb://127.0.0.1:27017 or mongodb://localhost:27017 (got "${uri || "unset"}"). It must never point at the production tunnel.`);
  process.exit(1);
}
const DB = "castle_rock_review_holds_test";
process.env.KEYSTONE_DB_NAME = DB;
process.env.KEYSTONE_DATA_DIR = path.join(tmpdir(), "ks-test-data-holds");
delete process.env.KEYSTONE_READONLY;

const ok = (value: unknown, message: string) => assert.ok(value, message);
const equal = (a: unknown, b: unknown, message: string) => assert.equal(a, b, message);

const T0 = new Date("2026-11-16T17:00:00Z");
const NOW = new Date("2026-11-17T15:00:00Z");

(async () => {
  const { ks, closeKs } = await import("../db");
  const q = await import("../queries");
  const store = await import("../store");
  const { buildStatus } = await import("./status");
  const { Item, Solution, Activity } = await ks();
  equal(Item.db.name, DB, "must run against the holds test database");
  await Item.db.db!.dropDatabase();
  try {
    let order = 0;
    const mk = async (itemId: string, stage: string, pipeline: Record<string, unknown> | undefined, version = 0, released = 0) => {
      await Item.create({
        itemId, subject: "Mathematics", course: "Math 30-1", courseSource: "sheet", itemType: "MC", topic: "", standards: [], key: "B", evelynAnswer: version ? "B" : "",
        keySource: "castle-rock", questionHtml: "<p>q</p>", options: [], stage, version, releasedVersion: released, releasedAnswer: released ? "B" : "", batchId: "b",
        receivedAt: T0, showcase: false, source: "upload", order: order++, createdAt: T0, updatedAt: T0, lastActivityAt: T0, ...(pipeline ? { pipeline } : {}),
      });
      for (let v = 1; v <= version; v++) await Solution.create({ itemId, version: v, sections: [], author: "pipeline", runId: "r", ...(v <= released ? { releasedAt: T0 } : {}) });
    };
    await mk("h-ready-held", "ready", { flags: ["no_agreement"], heldFor: "praveen", runId: "r" }, 1);
    await mk("h-ready-held-nosol", "ready", { flags: ["sample"], heldFor: "praveen", runId: "r" }, 1, 1);
    await mk("h-changes-held", "changes_requested", { flags: ["step_failed"], heldFor: "praveen", runId: "r" }, 1, 1);
    await Activity.create({ itemId: "h-changes-held", version: 1, type: "verdict", verdict: "changes", body: "Please show the unit conversion.", username: "julie", name: "Julie", role: "reviewer", createdAt: T0 });
    await mk("h-received-held", "received", { flags: ["type_not_supported"], heldFor: "praveen" });
    await mk("h-drafting-held", "drafting", { flags: ["step_failed"], heldFor: "praveen" });
    await mk("h-review-resent", "in_review", { flags: ["question_resent"], heldFor: "praveen", questionChangedAt: T0 }, 1, 1);
    await mk("h-approved-resent", "approved", { flags: ["question_resent"], heldFor: "praveen" }, 1, 1);
    await mk("h-ready-clean", "ready", { flags: [], runId: "r", releaseAt: NOW }, 1);
    await mk("h-review", "in_review", { flags: [] }, 1, 1);

    const badge = await q.waitingForOwnerCount("evelyn");
    const status = await buildStatus(NOW);
    const queue = (await q.ownerQueue("evelyn"))!;
    const heldInQueue = queue.waiting.length + queue.beforeSolution.filter((r) => r.held).length;
    equal(badge, 7, "the top bar counts every held item");
    equal(status.waitingOnPraveen.length, badge, "the email's waiting-on-you equals the top bar");
    equal(heldInQueue, badge, "the queue's held rows equal the top bar");
    ok(status.waitingOnPraveen.some((w) => w.itemId === "h-changes-held"), "the held send-back is in the email");
    const sb = queue.waiting.find((r) => r.itemId === "h-changes-held");
    ok(sb, "the held send-back is in Waiting for you");
    ok(sb!.reasons.some((r) => /Castle Rock's note: Please show the unit conversion/.test(r)), "with the reviewer's note");
    ok(sb!.reasons.some((r) => /A check could not run/.test(r)), "and its reason");
    equal(sb!.canSend, false, "no Send to review without an unreleased corrected version");
    equal(sb!.canSendBack, true, "Send back with a note");
    equal(sb!.canClear, false, "not an information-only hold");
    const rs = queue.waiting.find((r) => r.itemId === "h-review-resent")!;
    ok(rs && rs.canClear && !rs.canSend && !rs.canSendBack, "re-sent question mid-review: information, clearable");
    ok(queue.waiting.find((r) => r.itemId === "h-ready-held")?.canSend, "a held ready version can be sent");
    ok(queue.beforeSolution.some((r) => r.itemId === "h-ready-held-nosol" && r.held), "a held ready item with nothing to send is before a solution, counted as held");

    // The owner's actions on the held send-back: Keep holding, Send back with a note (→ the run rewrites it).
    equal("done" in (await store.keepHoldingByOwner("h-changes-held", NOW)), true, "Keep holding works on a held send-back");
    const back = await store.sendBackByOwner("h-changes-held", "Also round to 2 decimals.", { username: "praveen", name: "Praveen", role: "evelyn" }, NOW);
    ok("done" in back, `Send back works on a held send-back (${JSON.stringify(back)})`);
    const after = (await Item.findOne({ itemId: "h-changes-held" }).lean())!;
    equal(after.stage, "changes_requested", "stays a send-back");
    ok(after.pipeline?.flags.includes("owner_sent_back"), "owner_sent_back set");
    equal(after.pipeline?.fixNote, "Also round to 2 decimals.", "his note stored");
    // Seen: clear the hold (information only).
    ok("done" in (await store.clearHoldByOwner("h-review-resent", NOW)), "clear the hold");
    const cleared = (await Item.findOne({ itemId: "h-review-resent" }).lean())!;
    equal(cleared.pipeline?.heldFor, undefined, "hold cleared");
    ok(cleared.pipeline?.flags.includes("question_resent"), "flag kept as history");
    ok("error" in (await store.clearHoldByOwner("h-ready-held", NOW)), "a real hold cannot be cleared this way");
    equal(await q.waitingForOwnerCount("evelyn"), badge - 1, "the count follows");
    equal((await buildStatus(NOW)).waitingOnPraveen.length, badge - 1, "and the email");

    console.log("holds.dbtest ok");
  } finally {
    await Item.db.db!.dropDatabase();
    await closeKs();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
