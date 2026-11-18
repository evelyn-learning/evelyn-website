// Database test for Praveen's queue (the owner's final look): the queries' role refusal, the four owner
// operations' guards (double release, the timer at the same moment, send-back, keep holding, hold), and what
// Castle Rock's roles get for a held item. Not part of test:keystone (needs a mongod):
//   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses castle_rock_review_test and only item ids 9921xx / runs "dbtest-q-*"; deletes only what it created.
// The server actions' own role check (actions.ts) needs a request; scripts/keystone-pipeline-e2e.ts covers it.
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import path from "node:path";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri)) {
  console.error(`queue.dbtest refused to run: KEYSTONE_MONGODB_URI must be mongodb://127.0.0.1:27017 or mongodb://localhost:27017 (got "${uri || "unset"}"). It must never point at the production tunnel.`);
  process.exit(1);
}
const DB = "castle_rock_review_test";
process.env.KEYSTONE_DB_NAME = DB;
process.env.KEYSTONE_DATA_DIR = path.join(tmpdir(), "ks-test-data");
delete process.env.KEYSTONE_READONLY;

const id = (n: number) => String(992100 + n);
const ALL = Array.from({ length: 40 }, (_, n) => id(n));
const T0 = new Date("2026-11-16T17:00:00Z");
const OWNER = { username: "qa-owner", name: "QA owner", role: "evelyn" as const };

(async () => {
  const { ks, closeKs } = await import("./db");
  const store = await import("./store");
  const q = await import("./queries");
  const { Item, Solution, Activity, Run } = await ks();
  assert.equal(Item.db.name, DB, "must run against the test database");
  const clean = async () => {
    await Item.deleteMany({ itemId: { $in: ALL } });
    await Solution.deleteMany({ itemId: { $in: ALL } });
    await Activity.deleteMany({ itemId: { $in: ALL } });
    await Run.deleteMany({ runId: /^dbtest-q-/ });
  };
  type P = { stage?: string; flags?: string[] | null; heldFor?: boolean; heldWhy?: string; releaseAt?: Date; receivedAt?: Date; extra?: Record<string, unknown> };
  const mk = async (itemId: string, p: P = {}) => {
    const stage = p.stage ?? "ready";
    const has = !["received"].includes(stage);
    await Item.create({
      itemId, subject: "Mathematics", course: "Math 30-1", itemType: "MC", topic: "", standards: [], key: "B", evelynAnswer: has ? "B" : "",
      keySource: "castle-rock", questionHtml: "<p>QA</p>", options: [], stage, version: has ? 1 : 0, releasedVersion: 0, releasedAnswer: "",
      receivedAt: p.receivedAt ?? T0, showcase: false, source: "upload", order: 1, createdAt: T0, updatedAt: T0, lastActivityAt: T0,
      ...(p.flags === null ? {} : {
        pipeline: {
          flags: p.flags ?? [], ...(p.heldFor ? { heldFor: "praveen" } : {}), ...(p.heldWhy ? { heldWhy: p.heldWhy } : {}),
          ...(p.releaseAt ? { releaseAt: p.releaseAt } : {}), passedAt: T0,
        },
      }),
    });
    // Fields the db.ts schema does not declare (seenAt …) are written natively, as the store does.
    if (p.extra) await Item.collection.updateOne({ itemId }, { $set: Object.fromEntries(Object.entries(p.extra).map(([k, v]) => [`pipeline.${k}`, v])) });
    if (has) await Solution.create({ itemId, version: 1, sections: [{ kind: "short", md: "SECRET SOLUTION TEXT", html: "<p>SECRET SOLUTION TEXT</p>" }], author: "Evelyn Learning", createdAt: T0 });
  };
  const get = (itemId: string) => Item.findOne({ itemId }).lean<Record<string, any>>(); // eslint-disable-line @typescript-eslint/no-explicit-any
  const sentRows = (itemId: string) => Activity.countDocuments({ itemId, type: "revision", body: store.SENT_FOR_REVIEW });

  await clean();
  try {
    // --- queries refuse every role but Evelyn ---
    await mk(id(0), { flags: ["second_failure"], heldFor: true });
    for (const role of ["reviewer", "tech"] as const) {
      assert.equal(await q.ownerQueue(role), null, `ownerQueue refuses ${role}`);
      assert.equal(await q.itemChecks(id(0), role), null, `itemChecks refuses ${role}`);
      assert.equal(await q.waitingForOwnerCount(role), 0, `waitingForOwnerCount is 0 for ${role}`);
    }
    assert.equal(await q.ownerQueue(undefined), null, "ownerQueue refuses no role");
    assert.ok((await q.waitingForOwnerCount("evelyn")) >= 1, "Evelyn's count includes the held item");

    // --- what Castle Rock receives for a held item: Drafting, no solution, nothing from the pipeline in what the page uses ---
    {
      const seen = await q.getItem(id(0), undefined, "reviewer");
      assert.equal(seen?.item.stage, "drafting", "reviewer sees Drafting");
      assert.equal(seen?.solution, null, "reviewer gets no solution");
      assert.deepEqual(seen?.versions, [], "reviewer sees no version");
      const own = await q.getItem(id(0), undefined, "evelyn");
      assert.equal(own?.solution?.version, 1, "Evelyn sees the held version");
    }

    // --- send to review: once, a double click, two at once ---
    await store.sendBackByOwner(id(0), "QA first look", OWNER); // gives it owner_sent_back + fixNote, then send clears the note
    let out = await store.sendToReviewByOwner(id(0), OWNER);
    assert.deepEqual(out, { done: true }, "send to review");
    let it = await get(id(0));
    assert.equal(it?.stage, "in_review");
    assert.equal(it?.releasedVersion, 1);
    assert.equal(it?.releasedAnswer, "B");
    assert.equal(it?.pipeline?.heldFor, undefined, "hold cleared");
    assert.equal(it?.pipeline?.fixNote, undefined, "send-back note cleared");
    assert.deepEqual(it?.pipeline?.flags, ["second_failure", "owner_sent_back"], "flags kept as history");
    assert.ok((await Solution.findOne({ itemId: id(0), version: 1 }).lean())?.releasedAt, "solution row released");
    assert.equal(await sentRows(id(0)), 1, "one ordinary 'Sent for review.' row");
    assert.equal((await Activity.findOne({ itemId: id(0), body: store.SENT_FOR_REVIEW }).lean())?.version, 1, "the row names the released version");
    out = await store.sendToReviewByOwner(id(0), OWNER);
    assert.deepEqual(out, { already: true }, "second send is harmless");
    assert.equal(await sentRows(id(0)), 1, "still one row");
    {
      const seen = await q.getItem(id(0), undefined, "reviewer");
      assert.equal(seen?.item.stage, "in_review");
      assert.match(seen?.solution?.sections[0].html ?? "", /SECRET SOLUTION TEXT/, "reviewer now sees the solution");
    }

    await mk(id(1), { flags: ["sample"], heldFor: true });
    const both = await Promise.all([store.sendToReviewByOwner(id(1), OWNER), store.sendToReviewByOwner(id(1), OWNER)]);
    assert.equal(both.filter((x) => "done" in x).length, 1, "two at once: one sends");
    assert.equal(both.filter((x) => "already" in x).length, 1, "two at once: the other is told it is already sent");
    assert.equal(await sentRows(id(1)), 1, "two at once: one row");
    assert.deepEqual((await get(id(1)))?.pipeline?.flags, ["sample"], "the sample flag stays (the batch's sample count reads it)");

    // the timer released first (clean item): the owner's send is harmless
    await mk(id(2), { releaseAt: T0 });
    await Item.updateOne({ itemId: id(2) }, { $set: { "pipeline.releaseClaim": { owner: "timer", at: new Date() } } });
    assert.equal(await store.releaseClaimed(id(2), 1, "timer", { username: "pipeline", name: "Evelyn Learning", role: "evelyn" }, new Date()), true);
    assert.deepEqual(await store.sendToReviewByOwner(id(2), OWNER), { already: true }, "after the timer: already");
    assert.equal(await sentRows(id(2)), 0, "no second row");
    // the owner first: the timer's claimed release then does nothing
    await mk(id(3), { releaseAt: T0 });
    await Item.updateOne({ itemId: id(3) }, { $set: { "pipeline.releaseClaim": { owner: "timer", at: new Date() } } });
    assert.deepEqual(await store.sendToReviewByOwner(id(3), OWNER), { done: true });
    assert.equal(await store.releaseClaimed(id(3), 1, "timer", { username: "pipeline", name: "Evelyn Learning", role: "evelyn" }, new Date()), false, "timer after the owner: nothing");
    assert.equal((await get(id(3)))?.pipeline?.releaseClaim, undefined, "claim cleared");
    assert.equal(await Activity.countDocuments({ itemId: id(3) }), 1, "one row in all");

    // not waiting: refused
    await mk(id(4), { stage: "drafting", flags: ["step_failed"], heldFor: true });
    assert.ok("error" in (await store.sendToReviewByOwner(id(4), OWNER)), "drafting: refused");
    assert.ok("error" in (await store.sendToReviewByOwner("992199", OWNER)), "missing item: refused");

    // --- send back ---
    await mk(id(5), { flags: ["sample"], heldFor: true, extra: { seenAt: T0 } });
    assert.ok("error" in (await store.sendBackByOwner(id(5), "   ", OWNER)), "empty note refused");
    assert.ok("error" in (await store.sendBackByOwner(id(5), "x".repeat(2001), OWNER)), "note over 2000 refused");
    assert.deepEqual(await store.sendBackByOwner(id(5), "  Say the units in the short answer.  ", OWNER), { done: true });
    it = await get(id(5));
    assert.equal(it?.stage, "ready", "stage stays ready (Castle Rock keeps seeing Drafting)");
    assert.equal(it?.pipeline?.heldFor, "praveen");
    assert.equal(it?.pipeline?.fixNote, "Say the units in the short answer.");
    assert.ok(it?.pipeline?.fixRequestedAt instanceof Date);
    assert.equal(it?.pipeline?.sentBackBy, "qa-owner");
    assert.equal(it?.pipeline?.seenAt, undefined, "seen cleared: it is new again once rewritten");
    assert.deepEqual(it?.pipeline?.flags, ["sample", "owner_sent_back"]);
    assert.ok(it!.updatedAt > T0, "updatedAt moved (a run in flight loses its conditional write)");
    assert.equal(await Activity.countDocuments({ itemId: id(5) }), 0, "no activity row (cannot be hidden from Castle Rock)");
    assert.deepEqual(await store.sendBackByOwner(id(5), "again", OWNER), { done: true }, "a second send-back replaces the note");
    assert.deepEqual((await get(id(5)))?.pipeline?.flags, ["sample", "owner_sent_back"], "flag added once");
    assert.ok("error" in (await store.sendBackByOwner(id(0), "too late", OWNER)), "in review: refused");
    assert.equal((await q.getItem(id(5), undefined, "reviewer"))?.item.stage, "drafting", "sent back: reviewer still sees Drafting");

    // --- keep holding ---
    await mk(id(6), { flags: ["solvers_split"], heldFor: true });
    assert.deepEqual(await store.keepHoldingByOwner(id(6)), { done: true });
    it = await get(id(6));
    assert.ok(it?.pipeline?.seenAt instanceof Date, "seenAt set");
    assert.equal(it?.pipeline?.heldFor, "praveen", "still held");
    assert.equal(it?.updatedAt.getTime(), T0.getTime(), "nothing else changed");
    assert.ok("error" in (await store.keepHoldingByOwner(id(0))), "in review: refused");

    // --- hold this one ---
    await mk(id(7), { releaseAt: new Date(Date.now() + 86400_000) });
    await Item.updateOne({ itemId: id(7) }, { $set: { "pipeline.releaseClaim": { owner: "timer", at: new Date() } } });
    assert.deepEqual(await store.holdByOwner(id(7)), { done: true });
    it = await get(id(7));
    assert.equal(it?.pipeline?.heldFor, "praveen");
    assert.equal(it?.pipeline?.heldWhy, store.HELD_BY_YOU);
    assert.equal(it?.pipeline?.releaseClaim, undefined, "claim removed");
    assert.equal(await store.releaseClaimed(id(7), 1, "timer", { username: "pipeline", name: "Evelyn Learning", role: "evelyn" }, new Date()), false, "the timer cannot release a held item");
    assert.deepEqual(await store.holdByOwner(id(7)), { already: true }, "holding twice is harmless");
    assert.ok("error" in (await store.holdByOwner(id(0))), "in review: refused");
    assert.ok("error" in (await store.holdByOwner(id(4))), "drafting: refused");

    // --- the queue ---
    await mk(id(10), { flags: ["sample"], heldFor: true, receivedAt: new Date("2026-11-10T00:00:00Z") }); // sample-only, oldest
    await mk(id(11), { flags: ["no_agreement"], heldFor: true, receivedAt: new Date("2026-11-12T00:00:00Z") }); // flagged
    await mk(id(12), { flags: ["second_failure"], heldFor: true, receivedAt: new Date("2026-11-01T00:00:00Z"), extra: { seenAt: T0 } }); // seen
    await mk(id(13), { flags: [], heldFor: true, heldWhy: "no release time" }); // no flag: heldWhy
    await mk(id(14), { releaseAt: new Date("2026-11-18T17:00:00Z") }); // going out
    await mk(id(15), { stage: "drafting" }); // latest real run failed
    await mk(id(16), { stage: "ready", flags: null }); // ready, no pipeline record
    const run = (itemId: string, runId: string, extra: Record<string, unknown>) =>
      Run.create({ itemId, runId, startedAt: new Date(), mode: "fresh", startedFrom: { stage: "received", version: 0, updatedAt: T0 }, steps: [], corrections: 0, flags: [], cost: 0.12, assetsChecked: true, ...extra });
    await run(id(11), "dbtest-q-1", {
      result: "held",
      flags: ["no_agreement"],
      corrections: 1,
      steps: [
        { step: "solve", key: "solve#1", at: T0, ok: true, cost: 0.1, model: "model-a+model-b", output: {
          decision: { outcome: "hold", why: "no_agreement" },
          solves: { solver1: { ok: true, value: { answer: { kind: "choice", letters: ["A"] } }, model: "model-a" }, solver2: { ok: true, value: { answer: { kind: "choice", letters: ["C"] } }, model: "model-b" } },
        } },
        { step: "audit", key: "audit#1", at: T0, ok: true, cost: 0.01, output: { findings: [{ check: "audit", code: "rule", ruleId: "R7", quote: "the answer is", detail: "says the answer twice" }] } },
        { step: "render", key: "render#1", at: T0, ok: true, cost: 0, output: { findings: [] } },
        { step: "write", key: "write#1", at: T0, ok: true, cost: 0.01, output: { sections: { short: "draft" } } },
      ],
    });
    await new Promise((r) => setTimeout(r, 5));
    await run(id(11), "dbtest-q-2", { result: "failed", dryRun: true, error: "dry run only" }); // dry runs are ignored
    await run(id(15), "dbtest-q-3", { result: "failed", error: "solver call timed out" });

    const Q = (await q.ownerQueue("evelyn"))!;
    const mine = (rows: { itemId: string }[]) => rows.filter((r) => ALL.includes(r.itemId)).map((r) => r.itemId);
    // unseen flagged (oldest first, then id): 11, 5 (sample + sent back), 7, 13; unseen sample-only: 10; seen: 12, 6
    assert.deepEqual(mine(Q.waiting), [id(11), id(5), id(7), id(13), id(10), id(12), id(6)], "waiting: unseen first, flagged before sample-only, oldest first");
    const row = (rows: import("./queries").QueueRow[], x: string) => rows.find((r) => r.itemId === x)!;
    assert.deepEqual(row(Q.waiting, id(12)).reasons, ["Failed a check twice"]);
    assert.ok(row(Q.waiting, id(12)).seenAt, "seen row carries seenAt");
    assert.deepEqual(row(Q.waiting, id(13)).reasons, ["no release time"], "no flag: heldWhy as written");
    assert.deepEqual(row(Q.waiting, id(7)).reasons, ["Held by you"]);
    assert.deepEqual(row(Q.waiting, id(5)).reasons, ["Sent back by you: again", "Random sample"]);
    const r11 = row(Q.waiting, id(11));
    assert.deepEqual(r11.solvers.map((s) => `${s.who} ${s.answer}`), ["Solver 1 A", "Solver 2 C"], "solver answers from the latest real run");
    assert.equal(r11.key, "B");
    assert.equal(r11.findings, 1, "findings counted across the checks");
    assert.equal(row(Q.waiting, id(10)).findings, null, "no run: null");
    assert.deepEqual(mine(Q.beforeSolution).sort(), [id(15), id(4)].sort(), "before a solution: held while drafting, and the failed run");
    assert.match(row(Q.beforeSolution, id(15)).reasons[0], /The last run stopped: solver call timed out/);
    assert.deepEqual(mine(Q.going).sort(), [id(14), id(16)].sort(), "going out: ready, not held");
    assert.equal(row(Q.going, id(14)).releaseAt?.toISOString(), "2026-11-18T17:00:00.000Z");
    assert.deepEqual(row(Q.going, id(14)).reasons, []);
    assert.match(row(Q.going, id(16)).reasons[0], /will not go out by itself/, "a ready item the timer will never send says so");

    // --- the Checks panel ---
    const checks = (await q.itemChecks(id(11), "evelyn"))!;
    assert.equal(checks.runId, "dbtest-q-1", "latest real run (the dry run is skipped)");
    assert.equal(checks.corrections, 1);
    assert.deepEqual(checks.steps.map((s) => s.step), ["solve", "audit", "render", "write"], "every step in order");
    assert.match(checks.steps[0].decision ?? "", /held · no agreement/);
    assert.deepEqual(checks.steps[1].findings, [{ code: "rule", ruleId: "R7", quote: "the answer is", detail: "says the answer twice" }]);
    assert.ok(checks.steps[3].raw?.includes("draft"), "unrecognised output kept raw");
    assert.equal(await q.itemChecks(id(10), "evelyn"), null, "no run: null");

    // --- pure helpers ---
    assert.equal(q.answerShort({ kind: "number", value: "3.5" }), "3.5");
    assert.equal(q.answerShort({ kind: "labels", values: ["a", "b"] }), "a; b");
    assert.equal(q.answerShort(null), "–");
    assert.deepEqual(q.holdReasons(undefined), ["Held, no reason recorded"]);
    assert.deepEqual(q.holdReasons({ flags: ["owner_sent_back"], fixNote: "y".repeat(200) } as never)[0].length, "Sent back by you: ".length + 120);

    console.log("queue.dbtest: all passed");
  } finally {
    await clean();
    await closeKs();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
