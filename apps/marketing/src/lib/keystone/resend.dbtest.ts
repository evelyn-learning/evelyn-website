// Database test: a re-sent item (store.ingestQtiItems) and every release path (C2), and hand-written versions
// never released by the timer (I4). Not part of test:keystone (needs a mongod):
//   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses castle_rock_review_test and only item ids 9921xx / batches "dbtest-rs-*"; deletes only what it created.
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import path from "node:path";
import type { QtiItem } from "./qti";
import type { Steps } from "./pipeline/run";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri)) {
  console.error(`resend.dbtest refused to run: KEYSTONE_MONGODB_URI must be mongodb://127.0.0.1:27017 or mongodb://localhost:27017 (got "${uri || "unset"}"). It must never point at the production tunnel.`);
  process.exit(1);
}
const DB = "castle_rock_review_test";
process.env.KEYSTONE_DB_NAME = DB;
process.env.KEYSTONE_DATA_DIR = path.join(tmpdir(), "ks-test-data-resend");
delete process.env.KEYSTONE_READONLY;
delete process.env.KEYSTONE_PIPELINE_LIVE;

const ok = (value: unknown, message: string) => assert.ok(value, message);
const equal = (a: unknown, b: unknown, message: string) => assert.equal(a, b, message);
const deepEqual = (a: unknown, b: unknown, message: string) => assert.deepEqual(a, b, message);

const id = (n: number) => String(992100 + n);
const ALL = Array.from({ length: 100 }, (_, n) => id(n));
const BATCH = (s: string) => `dbtest-rs-${s}`;
const NOW = new Date("2026-11-18T17:00:00Z"); // Wed 10:00 MT: inside the release window
const DUE = new Date(NOW.getTime() - 60 * 60 * 1000);
const T0 = new Date("2026-11-16T17:00:00Z");
const ACTOR = { username: "praveen", name: "Evelyn Learning", role: "evelyn" as const };

const choice = (labels: string[]) => [{ kind: "choice" as const, responseId: "RESPONSE", maxChoices: 1, options: labels.map((label) => ({ label, html: `<p>${label}</p>` })) }];
const qti = (itemId: string, question: string, key: string): QtiItem => ({
  itemId, subject: "Mathematics", course: "Math 30-1", itemType: "MC", key, standards: [], topic: "",
  questionHtml: `<p>${question}</p>`, options: ["A", "B", "C", "D"].map((label) => ({ label, html: `<p>${label}</p>` })),
  interactions: choice(["A", "B", "C", "D"]), keys: { RESPONSE: [key] }, castleRockSolutionHtml: "<p>theirs</p>",
  resources: new Map(), raw: { apip: "<assessmentItem/>", metadata: "", passages: [] },
});

(async () => {
  const { ks, closeKs } = await import("./db");
  const store = await import("./store");
  const rel = await import("./pipeline/release");
  const { processItem, mongoReader, mongoWriter } = await import("./pipeline/run");
  const { resetOutboxInit } = await import("./pipeline/outbox");
  const { Item, Solution, Activity, Outbox, Batch, Run } = await ks();
  equal(Item.db.name, DB, "must run against the test database");
  const clean = async () => {
    await Item.deleteMany({ itemId: { $in: ALL } });
    await Solution.deleteMany({ itemId: { $in: ALL } });
    await Activity.deleteMany({ itemId: { $in: ALL } });
    await Run.deleteMany({ itemId: { $in: ALL } });
    await Outbox.deleteMany({ batchId: { $regex: /^dbtest-rs-/ } });
    await Batch.deleteMany({ batchId: { $regex: /^dbtest-rs-/ } });
  };
  const item = async (itemId: string) => (await Item.findOne({ itemId }).lean())!;
  const sol = async (itemId: string, version: number) => Solution.findOne({ itemId, version }).lean();

  /** An item as the pipeline leaves it: ready, clean v1 by run `runId`, due; or another stage. */
  type Mk = { stage?: string; flags?: string[]; heldFor?: "praveen"; released?: boolean; batchId?: string; runId?: string; question?: string; key?: string };
  const mk = async (itemId: string, p: Mk = {}) => {
    const stage = p.stage ?? "ready";
    const q = qti(itemId, p.question ?? "Which value is right?", p.key ?? "B");
    const runId = p.runId ?? "run-a";
    await Item.create({
      itemId, subject: q.subject, course: q.course, courseSource: "sheet", itemType: q.itemType, topic: "", standards: [], key: q.key,
      evelynAnswer: "B", keySource: "castle-rock", questionHtml: q.questionHtml, options: q.options, interactions: q.interactions, keys: q.keys,
      castleRockSolutionHtml: q.castleRockSolutionHtml, stage, version: 1, releasedVersion: p.released ? 1 : 0, releasedAnswer: p.released ? "B" : "",
      batchId: p.batchId ?? BATCH("A"), receivedAt: T0, showcase: false, source: "upload", order: 1, createdAt: T0, updatedAt: T0, lastActivityAt: T0,
      pipeline: { flags: p.flags ?? [], runId, passedAt: T0, ...(p.heldFor ? { heldFor: p.heldFor } : {}), ...(stage === "ready" && !p.heldFor && !(p.flags ?? []).length ? { releaseAt: DUE } : {}) },
    });
    await Solution.create({ itemId, version: 1, sections: [], author: "Evelyn Learning", runId, ...(p.released ? { releasedAt: T0 } : {}) });
  };
  /** A batch whose sample is already complete (three held as sample), so a clean member can go by the timer. */
  const sampledBatch = async (batchId: string, base: number, members: string[]) => {
    const samples = [id(base), id(base + 1), id(base + 2)];
    for (const s of samples) await mk(s, { batchId, flags: ["sample"], heldFor: "praveen" });
    await Batch.create({ batchId, filename: `${batchId}.xlsx`, itemIds: [...samples, ...members], rows: [...samples, ...members].map((itemId) => ({ itemId })), receivedAt: T0, uploadedBy: "t" });
  };
  const resend = (q: QtiItem) => store.ingestQtiItems([q], ACTOR, "upload-test");

  const reply = <T,>(value: T) => ({ ok: true as const, value, cost: 0.1, model: "m", ms: 1, fellBack: false });
  const answerC = { kind: "choice" as const, letters: ["C"] };
  const steps = {
    intakeModel: async () => ({ complete: true, missing: [] }),
    agreeOnAnswer: async () => ({ decision: { outcome: "pass" as const, answer: answerC, confirm: false }, solves: { solver1: reply({ answer: answerC, working: "w", confidence: "high" as const }) }, cost: 0.2 }),
    writeSolution: async () => reply({ topic: "Values", sections: [{ kind: "short" as const, md: "Short. So the answer is C." }, { kind: "diploma" as const, md: "Work.\nSo the answer is C." }] }),
    calcCheck: async () => [],
    workingCheck: async () => ({ findings: [], cost: 0.05, model: "m" }),
    rulesAudit: async () => ({ findings: [], cost: 0.05, model: "m" }),
    renderCheck: async () => [],
    classifyCause: async () => reply({ cause: "style" as const, why: "" }),
  } as unknown as Steps;
  const runDeps = () => ({ reader: mongoReader(), writer: mongoWriter({ username: "pipeline", name: "Evelyn Learning", role: "evelyn" as const }), steps, rules: [], images: async () => [], assetExists: () => true });

  await clean();
  resetOutboxInit();
  try {
    // --- C2 probe: ready + clean answering B, re-sent with a different question and key C ---
    {
      const it = id(10);
      await sampledBatch(BATCH("P"), 0, [it]);
      await mk(it, { batchId: BATCH("P") });
      const before = await item(it);
      await resend(qti(it, "A different question entirely?", "C"));
      const after = await item(it);
      equal(after.stage, "received", "C2 probe: back to received");
      ok(after.receivedAt && after.receivedAt.getTime() > before.receivedAt!.getTime(), "C2 probe: receivedAt restarts the clock");
      deepEqual(after.pipeline?.flags, [], "C2 probe: pipeline record starts again");
      ok(after.pipeline?.resentAt instanceof Date, "C2 probe: resentAt recorded");
      equal(after.pipeline?.releaseAt, undefined, "C2 probe: no release time");
      equal(after.pipeline?.runId, undefined, "C2 probe: no run owns the record");
      ok(!("grade" in after), "C2 probe: an absent field is not stored as null by the re-send");
      ok((await sol(it, 1))?.staleAt instanceof Date, "C2 probe: the old unreleased row is stale");
      await rel.releaseDue(NOW);
      equal((await item(it)).stage, "received", "C2 probe: the timer released nothing");
      equal((await sol(it, 1))?.releasedAt, undefined, "C2 probe: the old solution was never released");
      // The next run takes it as fresh and writes a new version; only that one can be released.
      const r = await processItem(it, "run-b", runDeps());
      equal(r.mode, "fresh", "C2 probe: the next run is fresh");
      equal(r.result, "ready", `C2 probe: the run passes it (${r.error ?? ""})`);
      const v2 = await item(it);
      equal(v2.version, 2, "C2 probe: new version 2");
      equal(v2.evelynAnswer, "C", "C2 probe: answer for the new question");
      await Item.updateOne({ itemId: it }, { $set: { "pipeline.releaseAt": DUE } });
      const released = await rel.releaseDue(NOW);
      ok(released.includes(it), `C2 probe: v2 released by the timer (${released.join(",")})`);
      const done = await item(it);
      equal(done.releasedVersion, 2, "C2 probe: released version is the new one");
      equal(done.releasedAnswer, "C", "C2 probe: released answer is the new one");
      equal((await sol(it, 1))?.releasedAt, undefined, "C2 probe: v1 still never released");
      ok((await sol(it, 2))?.releasedAt instanceof Date, "C2 probe: v2 row released");
    }

    // --- identical re-send: nothing about the pipeline changes ---
    {
      const it = id(20);
      await mk(it);
      const before = await item(it);
      await resend(qti(it, "Which value is right?", "B"));
      const after = await item(it);
      equal(after.stage, "ready", "identical: stage kept");
      deepEqual(after.pipeline, before.pipeline, "identical: pipeline record unchanged (releaseAt, runId, flags)");
      equal((await sol(it, 1))?.staleAt, undefined, "identical: the solution row is not stale");
    }

    // --- a held sample item re-sent: back to received, the sample flag dropped (the batch recounts) ---
    {
      const it = id(21);
      await mk(it, { flags: ["sample"], heldFor: "praveen" });
      await resend(qti(it, "Changed wording?", "B"));
      const after = await item(it);
      equal(after.stage, "received", "sample: back to received");
      deepEqual(after.pipeline?.flags, [], "sample: flag dropped");
      equal(after.pipeline?.heldFor, undefined, "sample: no hold");
    }

    // --- in_review item re-sent: flag + hold, stage unchanged; approved likewise ---
    {
      const it = id(22);
      await mk(it, { stage: "in_review", released: true });
      await resend(qti(it, "Changed after review?", "B"));
      const after = await item(it);
      equal(after.stage, "in_review", "in_review: stage kept");
      ok(after.pipeline?.flags.includes("question_resent"), "in_review: flag question_resent");
      equal(after.pipeline?.heldFor, "praveen", "in_review: held for Praveen");
      ok(after.pipeline?.questionChangedAt instanceof Date, "in_review: questionChangedAt");
      const it2 = id(23);
      await mk(it2, { stage: "approved", released: true });
      await resend(qti(it2, "Changed after approval?", "B"));
      const a2 = await item(it2);
      equal(a2.stage, "approved", "approved: stage kept");
      ok(a2.pipeline?.flags.includes("question_resent") && a2.pipeline?.heldFor === "praveen", "approved: flagged and held (information)");
    }

    // --- a stale row is refused by all four release paths ---
    {
      const it = id(30);
      await sampledBatch(BATCH("S"), 40, [it]);
      await mk(it, { batchId: BATCH("S") });
      await Solution.updateOne({ itemId: it, version: 1 }, { $set: { staleAt: NOW } });
      const released = await rel.releaseDue(NOW);
      ok(!released.includes(it), "stale: the timer does not release it");
      equal((await item(it)).stage, "ready", "stale: still ready after the timer");
      const sent = await store.sendToReviewByOwner(it, ACTOR, NOW);
      ok("error" in sent, "stale: the owner's send-to-review refuses");
      await assert.rejects(() => store.releaseSolution(it, ACTOR), /earlier version of the question/, "stale: releaseSolution refuses");
      await assert.rejects(() => store.releaseIfHeld(it, ACTOR), /earlier version of the question/, "stale: releaseIfHeld refuses");
      equal((await sol(it, 1))?.releasedAt, undefined, "stale: never released");
      equal((await item(it)).releasedVersion, 0, "stale: released version unchanged");
    }

    // --- a timer claim in flight loses to a re-send ---
    {
      const it = id(31);
      await mk(it);
      await Item.updateOne({ itemId: it }, { $set: { "pipeline.releaseClaim": { owner: "claim-1", at: NOW } } });
      await resend(qti(it, "Re-sent mid-claim?", "C"));
      const okRelease = await store.releaseClaimed(it, 1, "claim-1", ACTOR, NOW);
      equal(okRelease, false, "claim: releaseClaimed loses");
      const after = await item(it);
      equal(after.stage, "received", "claim: item stays received");
      equal(after.pipeline?.releaseClaim, undefined, "claim: the claim went with the old question");
      equal((await sol(it, 1))?.releasedAt, undefined, "claim: nothing released");
    }

    // --- I4: after a timer release, a hand draft v2 set to Ready by hand is never timer-released ---
    {
      const it = id(50);
      await sampledBatch(BATCH("H"), 60, [it]);
      await mk(it, { batchId: BATCH("H") });
      ok((await rel.releaseDue(NOW)).includes(it), "I4: v1 released by the timer");
      equal((await item(it)).pipeline?.flags.length, 0, "I4: record clean after release");
      await store.saveSolution(it, [{ kind: "short", md: "Hand draft." }], ACTOR, { submit: false });
      await store.setStage(it, "ready", ACTOR, "Status set to Ready.");
      const handReady = await item(it);
      equal(handReady.version, 2, "I4: hand v2");
      equal(handReady.pipeline?.releaseAt, undefined, "I4: the old release time is gone");
      // Even with a release time put back, the row has no runId of the pipeline's: never by the timer.
      await Item.updateOne({ itemId: it }, { $set: { "pipeline.releaseAt": DUE } });
      const r = await rel.releaseDue(NOW);
      ok(!r.includes(it), "I4: the hand draft is not released by the timer");
      equal((await sol(it, 2))?.releasedAt, undefined, "I4: v2 unreleased");
      equal((await item(it)).releasedVersion, 1, "I4: released version still 1");
    }

    // --- I4: a hand release of a held item leaves no hold behind (not waiting in the email) ---
    {
      const it = id(51);
      await mk(it, { flags: ["second_failure"], heldFor: "praveen" });
      await Item.updateOne({ itemId: it }, { $set: { "pipeline.heldWhy": "x" } });
      await store.releaseIfHeld(it, ACTOR);
      await store.setStage(it, "in_review", ACTOR, "Status set to In review.");
      const after = await item(it);
      equal(after.pipeline?.heldFor, undefined, "I4 hand release: hold cleared");
      equal(after.pipeline?.heldWhy, undefined, "I4 hand release: heldWhy cleared");
      deepEqual(after.pipeline?.flags, ["second_failure"], "I4 hand release: flags kept as history");
      const { buildStatus } = await import("./pipeline/status");
      const s = await buildStatus(NOW);
      ok(!s.waitingOnPraveen.some((w) => w.itemId === it), "I4 hand release: not in waitingOnPraveen");
      // A hand submit (saveSolution submit) of a held item likewise.
      const it2 = id(52);
      await mk(it2, { flags: ["no_agreement"], heldFor: "praveen" });
      await store.saveSolution(it2, [{ kind: "short", md: "By hand." }], ACTOR, { submit: true });
      const a2 = await item(it2);
      equal(a2.stage, "in_review", "I4 submit: in review");
      equal(a2.pipeline?.heldFor, undefined, "I4 submit: hold cleared");
    }

    console.log("resend.dbtest ok");
  } finally {
    await clean();
    await closeKs();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
