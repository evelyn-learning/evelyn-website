// Database test for the daily status email (buildStatus, the heartbeat, the script). Not part of
// test:keystone (needs a mongod):
//   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses its own database castle_rock_review_status_test (buildStatus counts every row, so it cannot share
// the other tests' database); drops it before and after. Never the production tunnel.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri)) {
  console.error(`status.dbtest refused to run: KEYSTONE_MONGODB_URI must be mongodb://127.0.0.1:27017 or mongodb://localhost:27017 (got "${uri || "unset"}"). It must never point at the production tunnel.`);
  process.exit(1);
}
const DB = "castle_rock_review_status_test";
process.env.KEYSTONE_DB_NAME = DB;
process.env.KEYSTONE_DATA_DIR = path.join(tmpdir(), "ks-test-data");
delete process.env.KEYSTONE_READONLY;
// No default buildStatus call may reach the network: the DeepSeek balance read happens only with this key.
delete process.env.DEEPSEEK_API_KEY;

const ok = (value: unknown, message: string) => assert.ok(value, message);
const equal = (a: unknown, b: unknown, message: string) => assert.equal(a, b, message);
const deepEqual = (a: unknown, b: unknown, message: string) => assert.deepEqual(a, b, message);

const HOUR = 3_600_000;
const NOW = new Date("2026-11-17T15:00:00Z"); // Tue 07:00 PT = 08:00 MT (inside the release window)
const ago = (h: number) => new Date(NOW.getTime() - h * HOUR);
const T0 = new Date("2026-11-16T17:00:00Z"); // new batch arrived
const T1 = new Date("2026-11-17T01:00:00Z"); // a later arrival
const OLD = new Date("2026-11-10T17:00:00Z");

(async () => {
  const { ks, closeKs } = await import("../db");
  const { addLocalDays } = await import("./release");
  const { buildStatus, renderStatusEmail } = await import("./status");
  const { beat, lastBeat } = await import("./heartbeat");
  const { Item, Solution, Activity, Outbox, Batch, Run, User, Lesson } = await ks();
  equal(Item.db.name, DB, "must run against the status test database");
  const db = Item.db.db!;
  await db.dropDatabase();
  try {
    // --- seed ---
    await User.insertMany([
      { username: "julie", name: "Julie May", role: "reviewer", passwordHash: "x" },
      { username: "vance", name: "Vance", role: "tech", passwordHash: "x" },
      { username: "praveen", name: "Praveen", role: "evelyn", passwordHash: "x" },
    ]);
    await Batch.insertMany([
      { batchId: "dbtest-st-old", filename: "old.xlsx", itemIds: [], rows: [], receivedAt: OLD, uploadedBy: "vance" },
      { batchId: "dbtest-st-new", filename: "new.xlsx", itemIds: [], rows: [], receivedAt: T0, uploadedBy: "vance" },
    ]);
    let order = 0;
    const mk = async (itemId: string, stage: string, extra: Record<string, unknown> = {}) => {
      await Item.create({
        itemId, subject: "Mathematics", course: "Math 30-1", itemType: "MC", topic: "", standards: [], key: "B", evelynAnswer: "", keySource: "castle-rock",
        questionHtml: "<p>q</p>", options: [], stage, version: 0, batchId: "dbtest-st-new", receivedAt: T0, showcase: false, source: "upload", order: order++,
        createdAt: T0, updatedAt: T0, lastActivityAt: T0, ...extra,
      });
    };
    // Unfinished items sit in the old batch, so the new batch (with the clean ready items) is not blocked.
    await mk("st-rec1", "received", { batchId: "dbtest-st-old" });
    await mk("st-rec2", "received", { batchId: "dbtest-st-old" });
    await mk("st-draft-empty", "drafting", { receivedAt: T1, batchId: "dbtest-st-old" });
    await mk("st-draft-sol", "drafting", { version: 1, batchId: "dbtest-st-old" });
    await Solution.create({ itemId: "st-draft-sol", version: 1, sections: [], author: "pipeline" });
    await mk("st-ready-sample", "ready", { version: 1, pipeline: { flags: ["sample"], heldFor: "praveen", runId: "r" } });
    await mk("st-ready-clean-today", "ready", { version: 1, releasedVersion: 0, pipeline: { flags: [], runId: "r", passedAt: T0, releaseAt: new Date("2026-11-17T18:00:00Z") } });
    await mk("st-ready-clean-later", "ready", { version: 1, releasedVersion: 0, pipeline: { flags: [], runId: "r", passedAt: T0, releaseAt: new Date("2026-11-18T18:00:00Z") } });
    // flags missing on pipeline (raw insert: mongoose would default it to [])
    await Item.collection.insertOne({
      itemId: "st-ready-noflags", subject: "Mathematics", stage: "ready", version: 1, batchId: "dbtest-st-new", receivedAt: T0, order: order++,
      pipeline: { heldFor: "praveen", runId: "r" }, createdAt: T0, updatedAt: T0, lastActivityAt: T0,
    });
    await mk("st-ready-two", "ready", { version: 1, pipeline: { flags: ["solvers_split", "unverified_type"], heldFor: "praveen", runId: "r" } });
    // Sent to review by Praveen after being held as sample: they count toward the new batch's sample (3 of 5).
    await mk("st-rev1", "in_review", { version: 1, pipeline: { flags: ["sample"], runId: "r" } });
    await mk("st-rev2", "in_review", { version: 1, pipeline: { flags: ["sample"], runId: "r" } });
    await mk("st-kq", "key_query");
    await mk("st-data", "item_data");
    await mk("st-changes", "changes_requested", { version: 1 });
    await mk("st-old-changes", "changes_requested", { version: 1, batchId: "dbtest-st-old", receivedAt: OLD });
    await mk("st-appr1", "approved", { version: 1 });
    await mk("st-appr2", "approved", { version: 1 });
    await mk("st-appr3", "approved", { version: 1 });
    await mk("st-rej", "rejected");

    await Solution.insertMany([
      // written by run "r", the run whose clean pass the item's record holds (the timer releases only such rows)
      { itemId: "st-ready-clean-today", version: 1, sections: [], author: "pipeline", runId: "r" },
      { itemId: "st-ready-clean-later", version: 1, sections: [], author: "pipeline", runId: "r" },
    ]);
    await Lesson.insertMany([
      { itemId: "st-changes", version: 1, note: "n", cause: "format", proposedBy: "model", confirmed: false },
      { itemId: "st-old-changes", version: 1, note: "n", cause: "style", proposedBy: "session", confirmed: true },
      { itemId: "st-data", version: 1, note: "n", cause: "item", proposedBy: "session", confirmed: true },
    ]);

    const pasted = `The postamble is missing ${"<table><tr><td>x &amp; y</td><td>long cell value here</td></tr></table>".repeat(13)}`;
    ok(pasted.length >= 900, `fixture: 900-character pasted note (${pasted.length})`);
    const act = (itemId: string, username: string, name: string, role: string, createdAt: Date, extra: Record<string, unknown>) =>
      ({ itemId, username, name, role, createdAt, version: 1, ...extra });
    await Activity.insertMany([
      act("st-changes", "julie", "Julie May", "reviewer", ago(6), { type: "verdict", verdict: "changes", body: pasted }),
      act("st-appr1", "julie", "Julie May", "reviewer", ago(2), { type: "verdict", verdict: "approved" }),
      act("st-data", "vance", "Vance", "tech", ago(3), { type: "verdict", verdict: "item_data", body: "Image missing" }),
      act("st-rev1", "julie", "Julie May", "reviewer", ago(1), { type: "comment", body: "Looks <b>fine</b> & clear" }),
      act("st-rev2", "julie", "Julie May", "reviewer", ago(30), { type: "comment", body: "older than a day" }),
      act("st-rev2", "praveen", "Praveen", "evelyn", ago(1), { type: "comment", body: "ours, not Castle Rock's" }),
      act("st-rev2", "pipeline", "Evelyn Learning", "evelyn", ago(1), { type: "stage", stage: "in_review", body: "Sent for review." }),
      act("st-old-changes", "julie", "Julie May", "reviewer", ago(40), { type: "verdict", verdict: "changes", body: "old send-back" }),
    ]);

    const step = (at: Date, cost: number) => ({ step: "solve", key: "solve#1", at, ok: true, output: null, cost });
    const run = (itemId: string, runId: string, extra: Record<string, unknown>) => ({
      itemId, runId, startedAt: ago(20), finishedAt: ago(19), mode: "fresh", startedFrom: { stage: "received", version: 0, updatedAt: T0 }, steps: [], corrections: 0,
      flags: [], cost: 0, assetsChecked: true, ...extra,
    });
    await Run.insertMany([
      // yesterday (Pacific Mon Nov 16): 0.5 + 0.25 here and 0.25 in run-b; today: 1
      run("st-rev1", "run-a", { result: "ready", steps: [step(ago(20), 0.5), step(ago(19), 0.25), step(ago(1), 1)], cost: 1.75 }),
      run("st-rev2", "run-b", { result: "ready", steps: [step(ago(18), 0.25)], cost: 0.25 }),
      run("st-kq", "run-c", { result: "failed", error: "solver timeout", startedAt: ago(4), finishedAt: ago(3), cost: 0 }),
      // dry runs: never counted, never a failure
      run("st-appr2", "run-dry", { result: "ready", dryRun: true, steps: [step(ago(18), 10)], cost: 10 }),
      run("st-appr3", "run-dry-failed", { result: "failed", dryRun: true, error: "dry boom", startedAt: ago(2), finishedAt: ago(2) }),
      // a failure older than a day is not today's news
      run("st-appr1", "run-old-failed", { result: "failed", error: "old boom", startedAt: ago(30), finishedAt: ago(30) }),
    ]);

    await Outbox.insertMany([
      { kind: "keys_queried", to: ["julie"], subject: "1 answer key to check", bodyMd: "b", itemIds: ["st-kq"], createdAt: ago(5), openKey: "keys_queried|-" },
      { kind: "batch_received", to: ["julie", "vance"], subject: "already drafted", bodyMd: "b", itemIds: [], createdAt: ago(50), draftedAt: ago(40) },
    ]);

    // --- buildStatus on the seed ---
    const s = await buildStatus(NOW);
    const counts = Object.fromEntries(s.byOwner.map((g) => [g.owner, Object.fromEntries(g.rows.map((r) => [r.label, r.n]))]));
    deepEqual(
      counts,
      {
        Evelyn: { Received: 2, Drafting: 2, Ready: 5, "Solution changes": 2 },
        "Castle Rock review": { "In review": 2, "Key query": 1 },
        "Castle Rock technical": { "Item data needed": 1 },
        "Nobody (finished)": { Approved: 3, "Delivered to SOLARO": 0, Rejected: 1 },
      },
      "counts per owner match the seed; ready is counted under Evelyn",
    );
    deepEqual(
      s.waitingOnPraveen,
      [
        { itemId: "st-ready-sample", why: "Random sample" },
        { itemId: "st-ready-noflags", why: "Held, no reason recorded" },
        { itemId: "st-ready-two", why: "The two solvers disagreed; a third settled it. Question type not yet verified end to end" },
      ],
      "held items with their plain-word reasons (flags missing tolerated)",
    );
    deepEqual(
      s.notSolved.map((g) => ({ n: g.n, dueAt: g.dueAt.toISOString() })),
      [
        { n: 2, dueAt: addLocalDays(T0, 2).toISOString() },
        { n: 1, dueAt: addLocalDays(T1, 2).toISOString() },
      ],
      "received + drafting-without-solution, grouped by when their 2 days are up",
    );
    equal(s.releasingToday, 1, "one clean ready item is due today");
    deepEqual(
      s.castleRockLastDay.map(({ who, what, itemId }) => ({ who, what, itemId })),
      [
        { who: "Julie May", what: "commented on", itemId: "st-rev1" },
        { who: "Julie May", what: "approved", itemId: "st-appr1" },
        { who: "Vance", what: "flagged missing item data on", itemId: "st-data" },
        { who: "Julie May", what: "asked for solution changes on", itemId: "st-changes" },
      ],
      "Castle Rock's verdicts and notes of the last 24 h, newest first; ours and older ones left out",
    );
    const sendBack = s.castleRockLastDay.find((r) => r.itemId === "st-changes")!;
    ok(sendBack.note && sendBack.note.length <= 200, `pasted note cut to ≤ 200 characters (${sendBack.note?.length})`);
    ok(!/[<>]/.test(sendBack.note!), "pasted note is plain text");
    ok(sendBack.note!.startsWith("The postamble is missing x & y long cell value here"), `note words kept (${sendBack.note!.slice(0, 60)})`);
    equal(s.castleRockLastDay.find((r) => r.itemId === "st-appr1")!.note, undefined, "a verdict without a note has no note");
    deepEqual(s.sendBacksOurs, { batch: 1, total: 2, causes: { format: 1, style: 1 } }, "send-backs from lessons: this (latest) batch 1, total 2, cause item left out");
    deepEqual(s.blocked, [], "no blocked batch");
    equal(Math.round(s.cost.yesterday * 1000) / 1000, 1, `yesterday's cost by step time, dry runs ignored (${s.cost.yesterday})`);
    equal(Math.round(s.cost.perItem * 1000) / 1000, 0.5, `cost per item so far: $2 over 4 items with real runs, dry runs ignored (${s.cost.perItem})`);
    deepEqual(s.suggestions, [{ subject: "1 answer key to check", to: ["julie"] }], "only open suggestions");
    ok(s.failures.some((f) => /st-kq/.test(f) && /solver timeout/.test(f)), `the failed run of the last day is a failure (${s.failures})`);
    ok(!s.failures.some((f) => /dry boom|old boom/.test(f)), "dry-run and older failures are not");
    ok(s.failures.includes("The release timer has not run in the last 2 hours"), "no release heartbeat: a failure line");
    equal(s.failures.length, 2, `exactly two failures (${s.failures})`);

    const email = renderStatusEmail(s, NOW);
    equal(email.subject, "Keystone: 3 waiting on you, 0 animations to review, 10 to decide, 2 in review, 3 approved", "subject from the seed");
    ok(/^Keystone: \d+ waiting on you, \d+ in review, \d+ approved$/.test(email.subject), "subject matches the pattern");
    ok(!email.html.includes("<table><tr><td>x &amp; y"), "the pasted markup is not in the HTML as markup");

    // --- blocked batches, heldWhy, and the sample left out of "going out today" ---
    await Batch.updateOne({ batchId: "dbtest-st-old" }, { $set: { blockedWhy: "2 item(s) not yet through the pipeline", blockedAt: ago(5) } });
    await Item.collection.updateOne({ itemId: "st-ready-noflags" }, { $set: { "pipeline.heldWhy": "no release time" } });
    await Item.updateOne({ itemId: "st-rev2" }, { $set: { "pipeline.flags": [] } }); // the new batch now needs one more sample
    const sb = await buildStatus(NOW);
    deepEqual(sb.blocked, [{ batch: "old.xlsx", why: "2 item(s) not yet through the pipeline", since: ago(5) }], "blocked batch by file name, why and since");
    equal(sb.waitingOnPraveen.find((w) => w.itemId === "st-ready-noflags")?.why, "no release time", "held with heldWhy: its text");
    const { planRelease } = await import("./release");
    const plan = await planRelease(NOW);
    const sampled = plan.samples.flatMap((x) => x.ids);
    equal(sampled.length, 1, `the release would hold one more as sample (${sampled})`);
    equal(sb.releasingToday, sampled.includes("st-ready-clean-today") ? 0 : 1, "an item the release will hold as sample does not go out today");
    const eb = renderStatusEmail(sb, NOW);
    ok(eb.text.indexOf("BLOCKED BATCHES") >= 0 && eb.text.indexOf("BLOCKED BATCHES") < eb.text.indexOf("WAITING ON YOU"), "blocked batches near the top");
    ok(eb.text.includes("- old.xlsx: 2 item(s) not yet through the pipeline (since Tue Nov 17, 2:00 am PT)"), "with since in Pacific");
    await Batch.updateOne({ batchId: "dbtest-st-old" }, { $unset: { blockedWhy: "", blockedAt: "" } });
    await Item.collection.updateOne({ itemId: "st-ready-noflags" }, { $unset: { "pipeline.heldWhy": "" } });
    await Item.updateOne({ itemId: "st-rev2" }, { $set: { "pipeline.flags": ["sample"] } });

    // --- heartbeat ---
    equal(await lastBeat("keystone-release"), null, "no beat yet");
    await beat("keystone-release", ago(0.5));
    equal((await lastBeat("keystone-release"))?.toISOString(), ago(0.5).toISOString(), "beat recorded");
    await beat("keystone-release", ago(0.25));
    equal((await lastBeat("keystone-release"))?.toISOString(), ago(0.25).toISOString(), "beat upserts (one document per name)");
    equal(await db.collection("heartbeats").countDocuments({ _id: "keystone-release" as never }), 1, "one heartbeat document");
    const s2 = await buildStatus(NOW);
    ok(!s2.failures.some((f) => /release timer/.test(f)), "a fresh heartbeat clears the failure line");
    await beat("keystone-release", ago(3));
    ok((await buildStatus(NOW)).failures.some((f) => /release timer/.test(f)), "a 3-hour-old heartbeat inside the window is a failure");
    ok(!(await buildStatus(new Date("2026-11-21T17:00:00Z"))).failures.some((f) => /release timer/.test(f)), "Saturday: no heartbeat failure");

    // --- M9: an unfinished run whose own final write landed is not "never finished" ---
    {
      const from = { stage: "received", version: 0, updatedAt: T0 };
      await Item.updateOne({ itemId: "st-draft-sol" }, { $set: { stage: "ready", version: 1 } });
      await Solution.updateOne({ itemId: "st-draft-sol", version: 1 }, { $set: { runId: "run-landed" } });
      await Run.insertMany([
        // crashed between the final item write and saveRun: intent ready v1, the row carries its runId
        { itemId: "st-draft-sol", runId: "run-landed", startedAt: ago(3), mode: "fresh", startedFrom: from, steps: [], corrections: 0, flags: [], cost: 0, assetsChecked: true,
          intent: { writing: "ready", stage: "ready", toVersion: 1, flags: [], at: ago(3) } },
        // crashed before its write: the item is not what it intended
        { itemId: "st-rec1", runId: "run-stuck", startedAt: ago(3), mode: "fresh", startedFrom: from, steps: [], corrections: 0, flags: [], cost: 0, assetsChecked: true,
          intent: { writing: "ready", stage: "ready", toVersion: 1, flags: [], at: ago(3) } },
      ]);
      const f = (await buildStatus(NOW)).failures;
      ok(!f.some((x) => /st-draft-sol/.test(x)), `M9: own write landed: not a failure (${f})`);
      ok(f.some((x) => /st-rec1/.test(x) && /never finished/.test(x)), `M9: a run that did not land is still reported (${f})`);
      await Run.deleteMany({ runId: { $in: ["run-landed", "run-stuck"] } });
      await Item.updateOne({ itemId: "st-draft-sol" }, { $set: { stage: "drafting", version: 1 } });
    }
    process.env.KEYSTONE_READONLY = "1";
    await assert.rejects(() => beat("keystone-release", NOW), /read-only/, "beat refuses in read-only mode");
    delete process.env.KEYSTONE_READONLY;
    await db.collection("heartbeats").deleteMany({});

    // --- API credit: runs of each vendor before/after the start, a dry run, an unknown model id; DeepSeek faked ---
    {
      const { MODEL_FOR } = await import("./models");
      const mstep = (at: string, cost: number, model?: string) => ({ step: "solve", key: `k${Math.random()}`, at: new Date(at), ok: true, output: null, cost, ...(model ? { model } : {}) });
      const A = MODEL_FOR.solver1.model, O = MODEL_FOR.solver2.model, D = MODEL_FOR.solver3Text.model, G = MODEL_FOR.compare.model;
      await Run.insertMany([
        run("st-rev1", "cr-a", { result: "ready", steps: [mstep("2026-11-15T12:00:00Z", 5, A), mstep("2026-11-16T20:00:00Z", 1.5, A), mstep("2026-11-16T20:00:00Z", 7, "mystery-model")], cost: 13.5 }),
        run("st-rev2", "cr-b", { result: "ready", steps: [mstep("2026-11-10T12:00:00Z", 1, O), mstep("2026-11-16T18:00:00Z", 2, O), mstep("2026-11-16T19:00:00Z", 0.25, D), mstep("2026-11-17T10:00:00Z", 0.5, G)], cost: 3.75 }),
        run("st-appr2", "cr-dry", { result: "ready", dryRun: true, steps: [mstep("2026-11-16T18:00:00Z", 100, A)], cost: 100 }),
      ]);
      const KEY = "sk-DBTESTdeepseek1234567890";
      const env = { DEEPSEEK_API_KEY: KEY, KEYSTONE_CREDIT_ANTHROPIC: "20@2026-11-16", KEYSTONE_CREDIT_DEEPSEEK: "6@2026-11-16", KEYSTONE_CREDIT_GEMINI: "10@2026-11-17", KEYSTONE_CREDIT_OPENAI: "nonsense" };
      const respond = (b: unknown, status = 200) => (async () => new Response(typeof b === "string" ? b : JSON.stringify(b), { status })) as unknown as typeof fetch;
      const good = await buildStatus(NOW, { env, fetchFn: respond({ is_available: true, balance_infos: [{ currency: "USD", total_balance: "5.61", granted_balance: "0", topped_up_balance: "5.61" }] }) });
      const by = Object.fromEntries(good.credit.map((c) => [c.vendor, c]));
      deepEqual(good.credit.map((c) => c.label), ["Anthropic", "OpenAI", "DeepSeek", "Gemini"], "four rows in order");
      equal(by.anthropic.spentSince, 1.5, "Anthropic: the step before the start date and the dry run are not counted");
      equal(by.anthropic.estimatedLeft, 18.5, "Anthropic: start minus spent since");
      equal(by.anthropic.spentYesterday, 1.5, "Anthropic yesterday (Pacific Nov 16)");
      equal(by.openai.start, undefined, "a malformed start is ignored");
      ok(by.openai.note?.includes("KEYSTONE_CREDIT_OPENAI ignored"), "and noted");
      equal(by.openai.spentSince, 3, "OpenAI with no start: all time");
      equal(by.openai.spentYesterday, 2, "OpenAI yesterday");
      equal(by.gemini.spentSince, 0.5, "Gemini: after its start");
      equal(by.gemini.spentYesterday, 0, "Gemini: today's spend is not yesterday's");
      equal(by.deepseek.spentSince, 0.25, "DeepSeek spend");
      deepEqual(by.deepseek.live, { amount: 5.61, currency: "USD" }, "DeepSeek live balance");
      ok(!by.anthropic.low && !by.deepseek.low && !by.gemini.low, "nothing low");
      equal(good.creditNote, "5 steps with an unknown model id not counted", "the mystery step and the 4 model-less seed steps are listed, not counted");
      const out = renderStatusEmail(good, NOW);
      ok(out.text.includes("Anthropic: about $18.50 left (started $20.00 on Nov 16; Keystone has spent $1.50 since; $1.50 yesterday)"), "rendered estimate line");
      ok(out.text.includes("DeepSeek: $5.61 balance (live); Keystone spent $0.25 since Nov 16; $0.25 yesterday"), "rendered live line");
      ok(out.text.includes("OpenAI: no starting balance on file; Keystone has spent $3.00 in total; $2.00 yesterday"), "rendered no-start line");
      // DeepSeek failing in each way: the status still builds, the row says so, the key is nowhere
      const hang = (async () => new Promise<Response>(() => {})) as unknown as typeof fetch;
      const failing: [string, typeof fetch][] = [
        ["HTTP 401", respond({ error: `invalid ${KEY}` }, 401)],
        ["timeout", hang],
        ["malformed body", respond("{not json")],
        ["wrong shape", respond({ balance_infos: "x" })],
      ];
      for (const [name, f] of failing) {
        const st = await buildStatus(NOW, { env, fetchFn: f, deepseekTimeoutMs: 50 });
        const d = st.credit.find((c) => c.vendor === "deepseek")!;
        ok(d.note?.startsWith("balance check failed"), `${name}: note set (${d.note})`);
        equal(d.live, undefined, `${name}: no live figure`);
        equal(d.estimatedLeft, 5.75, `${name}: the estimate is used (6 - 0.25)`);
        const mail = renderStatusEmail(st, NOW);
        ok(mail.subject.startsWith("Keystone:") && mail.text.includes("DeepSeek: about $5.75 left"), `${name}: the email still builds`);
        ok(!(mail.text + mail.html + JSON.stringify(st)).includes(KEY), `${name}: the key appears nowhere`);
      }
      const lowSt = await buildStatus(NOW, { env: { ...env, KEYSTONE_CREDIT_ANTHROPIC: "3@2026-11-16" }, fetchFn: respond({ is_available: true, balance_infos: [{ currency: "USD", total_balance: "5.61" }] }) });
      ok(lowSt.credit.find((c) => c.vendor === "anthropic")!.low, "3 - 1.5 = 1.5 is below 2: low");
      ok(renderStatusEmail(lowSt, NOW).text.includes("API credit is low: Anthropic"), "and it is in the failures list");
      await Run.deleteMany({ runId: { $in: ["cr-a", "cr-b", "cr-dry"] } });
    }

    // --- the script: --print writes nothing and sends nothing; refusals ---
    const snapshot = async () => {
      const out: Record<string, unknown[]> = {};
      for (const c of (await db.listCollections().toArray()).map((x) => x.name).sort()) out[c] = await db.collection(c).find({}).sort({ _id: 1 }).toArray();
      return JSON.stringify(out);
    };
    const before = await snapshot();
    const script = path.join(__dirname, "../../../../scripts/keystone-status-email.ts");
    const cwd = path.join(__dirname, "../../../..");
    const base: Record<string, string | undefined> = { PATH: process.env.PATH, HOME: process.env.HOME, KEYSTONE_MONGODB_URI: uri, KEYSTONE_DB_NAME: DB };
    const run_ = (args: string[], env: Record<string, string | undefined>) => spawnSync("npx", ["tsx", script, ...args], { cwd, env: env as NodeJS.ProcessEnv, encoding: "utf8", timeout: 120_000 });
    // --print with a send configuration present and a fetch that would fail loudly: it must not be used
    const printed = run_(["--print", "--now", NOW.toISOString()], {
      ...base, KEYSTONE_STATUS_TO: "praveen@evelynlearning.com", KEYSTONE_STATUS_FROM: "praveen@evelynlearning.com", KEYSTONE_RESEND_API_KEY: "re_DBTEST_secret",
    });
    if (process.env.STATUS_DBTEST_SHOW === "1") console.log(printed.stdout);
    equal(printed.status, 0, `--print exits 0 (${printed.stderr})`);
    ok(printed.stdout.includes("Keystone: 3 waiting on you, 0 animations to review, 10 to decide, 2 in review, 3 approved"), "--print prints the subject");
    ok(printed.stdout.includes("WAITING ON YOU"), "--print prints the text body");
    ok(printed.stdout.includes(`Database: ${DB} on 127.0.0.1:27017`), `--print names the database and host (${printed.stdout.split("\n")[0]})`);
    ok(/not sent/i.test(printed.stdout), "--print says nothing was sent");
    ok(!(printed.stdout + printed.stderr).includes("re_DBTEST_secret"), "the key is never printed");
    equal(await snapshot(), before, "--print: every collection unchanged (no heartbeat either)");

    const noEnv = run_([], base);
    ok(noEnv.status !== 0 && /KEYSTONE_STATUS_TO/.test(noEnv.stderr), `missing env refused (${noEnv.stderr.trim().slice(0, 200)})`);
    const foreign = run_([], { ...base, KEYSTONE_STATUS_TO: "p@evelynlearning.com", KEYSTONE_STATUS_FROM: "info@evelyntutor.com", KEYSTONE_RESEND_API_KEY: "re_DBTEST_secret" });
    ok(foreign.status !== 0 && /evelynlearning\.com/.test(foreign.stderr), `FROM not @evelynlearning.com refused (${foreign.stderr.trim().slice(0, 200)})`);
    ok(!(foreign.stdout + foreign.stderr).includes("re_DBTEST_secret"), "the key is not printed on refusal");
    const noUri = run_(["--print"], { ...base, KEYSTONE_MONGODB_URI: "", MONGODB_URI: uri });
    ok(noUri.status !== 0 && /KEYSTONE_MONGODB_URI/.test(noUri.stderr), "KEYSTONE_MONGODB_URI required explicitly");
    const nowWithoutPrint = run_(["--now", NOW.toISOString()], base);
    ok(nowWithoutPrint.status !== 0 && /--now/.test(nowWithoutPrint.stderr), "--now only with --print");
    equal(await snapshot(), before, "refused runs wrote nothing");

    console.log("status.dbtest ok");
  } finally {
    await db.dropDatabase();
    await closeKs();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
