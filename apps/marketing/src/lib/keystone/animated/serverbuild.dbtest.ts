// Database test for the server build of animated solutions (serverbuild.ts): the whole job with fakes for the
// model, the voice and the screen check. Needs a local mongod:
//   KEYSTONE_MONGODB_URI=mongodb://127.0.0.1:27017 npm run test:keystone:db
// Uses castle_rock_review_test and only item ids 9933xx; deletes only what it created. No network, no spend.
import assert from "node:assert/strict";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const uri = process.env.KEYSTONE_MONGODB_URI ?? "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):27017\/?$/.test(uri)) {
  console.error(`serverbuild.dbtest refused to run: KEYSTONE_MONGODB_URI must be mongodb://127.0.0.1:27017 or mongodb://localhost:27017 (got "${uri || "unset"}"). It must never point at the production tunnel.`);
  process.exit(1);
}
const DB = "castle_rock_review_test";
process.env.KEYSTONE_DB_NAME = DB;
const DATA = path.join(tmpdir(), "ks-anim-serverbuild-dbtest");
process.env.KEYSTONE_DATA_DIR = DATA;
delete process.env.KEYSTONE_READONLY;
delete process.env.KEYSTONE_PIPELINE_LIVE;

const IDS = ["993301", "993302", "993303", "993304", "993305", "993306", "993307", "993308", "993309", "993310", "993311", "993312"];
const OWNER = { username: "qa-owner", role: "evelyn" as const };

(async () => {
  const { ks, closeKs } = await import("../db");
  const store = await import("../animreview/store");
  const { animatedDir } = await import("../animreview/files");
  const { acquireLock, releaseLock } = await import("../pipeline/release");
  const { buildBudget, spentToday } = await import("./buildstate");
  const { BUILD_LOCK, BUILD_LOCK_TTL_MS, SCREEN_CHECK_NOT_RUN, buildDirs, buildQueued, defaultVoice } = await import("./serverbuild");
  const { silentMp3 } = await import("./record");
  const { BOARD_JS, SVG, WRITTEN, spec } = await import("./testkit");
  type Voice = import("./serverbuild").Voice;
  type BuildDeps = import("./serverbuild").BuildDeps;
  type ScreenCheck = import("./screencheck").ScreenCheck;
  type AuthorCall = import("./author").AuthorCall;
  type Reply = import("../pipeline/types").ModelReply<unknown>;

  const { Item, Solution, Animation, AnimBuild, Lock } = await ks();
  assert.equal(Item.db.name, DB, "must run against the test database");
  await Promise.all([Animation.init(), AnimBuild.init(), Lock.init()]);
  const dirs = buildDirs();
  assert.ok(dirs.examples.startsWith(DATA), "the build's folders are under the test data folder");

  const clean = async () => {
    await Promise.all([Item.deleteMany({ itemId: { $in: IDS } }), Solution.deleteMany({ itemId: { $in: IDS } }), Animation.deleteMany({ itemId: { $in: IDS } }), AnimBuild.deleteMany({ itemId: { $in: IDS } }), Lock.deleteMany({ _id: BUILD_LOCK })]);
    await rm(DATA, { recursive: true, force: true });
  };
  const seedExamples = () => {
    const ex = path.join(dirs.examples, "1001");
    mkdirSync(ex, { recursive: true });
    writeFileSync(path.join(ex, "spec.json"), JSON.stringify(spec()));
    writeFileSync(path.join(ex, "figure.svg"), SVG);
    writeFileSync(path.join(ex, "board.js"), BOARD_JS);
    writeFileSync(path.join(ex, "written.md"), `## APPROVED WRITTEN SOLUTION\n\n${WRITTEN}`);
  };
  /** An item with a written solution, queued for API credits by the owner (as the button does). */
  const queue = async (itemId: string, at?: Date) => {
    await Item.create({ itemId, subject: "Physics", course: "Physics 30", itemType: "MC", questionHtml: "<p>A 4 kg block accelerates at 3 m/s². What is the net force?</p>", options: [{ label: "A", html: "7 N" }, { label: "B", html: "12 N" }], key: "B", evelynAnswer: "B", keySource: "castle-rock", stage: "in_review", version: 1 });
    await Solution.create({ itemId, version: 1, sections: [{ kind: "short", md: WRITTEN, html: "" }], author: "qa" });
    const r = await store.setAnimateRoute([itemId], "api", OWNER);
    assert.ok("ok" in r && r.ok === 1, "queued");
    if (at) await Item.updateOne({ itemId }, { $set: { "animate.requestedAt": at } });
  };
  const item = async (itemId: string) => (await Item.findOne({ itemId }).lean())!;

  // --- fakes ---
  const idOf = (c: AuthorCall) => /itemId: (\d+)/.exec(c.user)![1];
  const reply = (s: unknown): Reply => ({ ok: true, value: { spec: JSON.stringify(s), figure: SVG, board: BOARD_JS }, cost: 0.25, model: "claude-opus-5-5", ms: 5, fellBack: false, tokens: { in: 1000, out: 100, cacheWrite: 0, cacheRead: 0 } });
  const good = (itemId: string): Reply => reply(spec({ itemId }));
  /** A reply the checks refuse: a cue that names nothing in the figure. */
  const bad = (itemId: string): Reply => {
    const s = spec({ itemId });
    s.steps[1].lines[0].cues![1].id = "nope";
    return reply(s);
  };
  const model = (reply: (itemId: string) => Reply = good) => {
    const calls: string[] = [];
    return { calls, fn: async (c: AuthorCall) => (calls.push(idOf(c)), reply(idOf(c))) };
  };
  /** Clips and timing written by hand; 200 characters billed at the real rate. */
  const voice = (over: Partial<Voice> = {}): Voice & { recorded: string[] } => {
    const recorded: string[] = [];
    return {
      recorded,
      ready: async () => null,
      record: async (srcDir) => {
        recorded.push(path.basename(srcDir));
        const s = JSON.parse(readFileSync(path.join(srcDir, "spec.json"), "utf8")) as { steps: { lines: unknown[] }[] };
        mkdirSync(path.join(srcDir, "audio"), { recursive: true });
        s.steps.forEach((_, k) => writeFileSync(path.join(srcDir, "audio", `step-${k + 1}.mp3`), silentMp3(500)));
        writeFileSync(path.join(srcDir, "timing.json"), JSON.stringify({ steps: s.steps.map((st, k) => ({ file: `audio/step-${k + 1}.mp3`, durationMs: 500, starts: st.lines.map((_, i) => i * 100) })) }));
        return { chars: 200, cost: 0.01, notes: [] };
      },
      ...over,
    };
  };
  const screenOk = async (): Promise<ScreenCheck> => ({ status: "ok", shots: "" });
  const quiet = () => {};
  const deps = (m: { fn: BuildDeps["model"] }, over: Partial<BuildDeps> = {}): BuildDeps => ({ model: m.fn, voice: voice(), screenCheck: screenOk, log: quiet, env: {}, ...over });
  const done = (r: Awaited<ReturnType<typeof buildQueued>>) => {
    assert.equal(r.status, "done");
    return r as Extract<typeof r, { status: "done" }>;
  };

  await clean();
  try {
    const [A, B, C, D, E, F, G, H, I, J, K, L] = IDS;

    // --- the switch: off looks at nothing ---
    seedExamples();
    await queue(A);
    assert.equal((await item(A)).animate?.build?.state, "queued", "the button marks the item queued");
    const m0 = model();
    assert.deepEqual(await buildQueued(deps(m0, { env: { KEYSTONE_ANIM_SERVER_BUILD: "off" } })), { status: "off" });
    assert.equal(m0.calls.length, 0, "off: no model call");
    assert.equal((await item(A)).animate?.build?.state, "queued", "off: the item is only marked");

    // --- success: queued → built, published for review, state on the item ---
    const v1 = voice();
    const t0 = Date.now();
    const r1 = done(await buildQueued(deps(m0, { voice: v1 })));
    assert.deepEqual([r1.built, r1.failed, r1.capReached], [[A], [], false]);
    assert.deepEqual(m0.calls, [A], "one authoring call");
    assert.deepEqual(v1.recorded, [A]);
    const a1 = (await Animation.findOne({ itemId: A }).lean())!;
    assert.deepEqual([a1.version, a1.status, a1.createdBy, a1.voice, a1.height, a1.notes], [1, "review", "pipeline", "Mr. Joseph", 1100, "Built with API credits"]);
    const vdir = animatedDir(A, 1);
    assert.ok(existsSync(path.join(vdir, "solution.html")) && existsSync(path.join(vdir, "audio", "step-3.mp3")), "the page and its clips are in the version folder");
    assert.deepEqual(readdirSync(vdir).sort(), ["audio", "solution.html"], "nothing else is published");
    assert.deepEqual(readdirSync(path.dirname(vdir)), ["v1"], "no temporary folder is left");
    assert.match(readFileSync(path.join(vdir, "solution.html"), "utf8"), /"timing":\{"steps":\[\{"file":"audio\/step-1\.mp3"/, "the page carries the recorded timing");
    const b1 = (await item(A)).animate!;
    assert.equal(b1.route, "api");
    assert.equal(b1.build?.state, "built");
    assert.ok(b1.build!.startedAt!.getTime() >= t0 - 5 && b1.build!.finishedAt!.getTime() >= b1.build!.startedAt!.getTime(), "startedAt and finishedAt");
    assert.deepEqual([b1.build!.cost, b1.build!.corrections, b1.build!.attempts], [0.26, 0, 1], "cost = model + voice; no correction");
    const row1 = (await AnimBuild.findOne({ itemId: A }).lean())!;
    assert.deepEqual([row1.result, row1.cost, row1.modelCost, row1.voiceChars, row1.version], ["built", 0.26, 0.25, 200, 1]);
    assert.ok(existsSync(path.join(dirs.src, A, "spec.json")) && existsSync(path.join(dirs.src, A, "written.md")), "the source is kept for a later fix");
    assert.ok(!(await store.toAnimate("evelyn"))!.some((t) => t.itemId === A), "a built item leaves the To animate list");
    assert.ok((await store.listAnimations("evelyn"))!.some((x) => x.itemId === A && x.status === "review"), "and is there for review");
    assert.deepEqual(done(await buildQueued(deps(m0))).built, [], "nothing left to build");
    assert.equal(m0.calls.length, 1, "a built item is not built again");
    assert.equal(await Lock.countDocuments({ _id: BUILD_LOCK }), 0, "the lock is released");

    // --- no browser on the machine: published all the same, and the version says so ---
    await queue(B);
    done(await buildQueued(deps(m0, { screenCheck: async () => ({ status: "unavailable", why: "no browser" }) })));
    assert.equal((await Animation.findOne({ itemId: B }).lean())!.notes, `Built with API credits. ${SCREEN_CHECK_NOT_RUN}`);

    // --- the screen check fails: the item fails ---
    await queue(C);
    const rc = done(await buildQueued(deps(m0, { screenCheck: async () => ({ status: "failed", fails: ["360px: the page scrolls sideways", "x"], shots: "" }) })));
    assert.match(rc.failed[0].reason, /screen-size check found 2 problem\(s\): 360px: the page scrolls sideways/);
    assert.equal(await Animation.countDocuments({ itemId: C }), 0);

    // --- the author fails twice: failed, moved to the by-hand route with the reason, never retried ---
    await queue(D);
    const mBad = model(bad);
    const rd = done(await buildQueued(deps(mBad)));
    assert.deepEqual(mBad.calls, [D, D], "the first call and the one correction");
    assert.equal(rd.failed.length, 1);
    const d = (await item(D)).animate!;
    assert.equal(d.route, "hand", "moved to the by-hand route");
    assert.equal(d.build?.state, "failed");
    assert.match(d.build!.failure!, /still failed its checks after one correction: spec: step 2 line 1 cue 2 \(draw\): id "nope"/);
    assert.deepEqual([d.build!.cost, d.build!.corrections], [0.5, 1], "both calls are counted");
    assert.ok(d.build!.finishedAt && d.reason === undefined, "finished; the reason Castle Rock reads is not touched");
    assert.equal(await Animation.countDocuments({ itemId: D }), 0, "nothing published");
    assert.ok(existsSync(path.join(dirs.src, "_failed", D, "findings.txt")) && !existsSync(path.join(dirs.src, D)), "the draft is kept apart for the hand author");
    done(await buildQueued(deps(mBad)));
    assert.equal(mBad.calls.length, 2, "a failed item is not retried");
    const listD = (await store.toAnimate("evelyn"))!.find((t) => t.itemId === D)!;
    assert.deepEqual([listD.route, listD.build?.state], ["hand", "failed"], "the list shows it by hand, with the failure");
    const dig = await store.animationDigest(new Date(Date.now() - 86400000));
    assert.ok(dig.failedBuilds!.some((f) => f.itemId === D && /one correction/.test(f.reason)) && !dig.queuedHand.includes(D), "the status email lists the failed build as needing the owner");

    // --- a model that cannot be reached: failed after one call ---
    await queue(E);
    const mDown = model(() => ({ ok: false, reason: "transport", detail: "HTTP 529", cost: 0, model: "claude-opus-5-5" }));
    done(await buildQueued(deps(mDown)));
    assert.equal(mDown.calls.length, 1);
    assert.match((await item(E)).animate!.build!.failure!, /could not be reached or gave no usable reply/);

    // --- the voice fails: failed with the reason; the authored source is kept and not paid for twice ---
    await queue(F);
    const mF = model();
    const rf = done(await buildQueued(deps(mF, { voice: voice({ record: async () => { throw new Error("Cartesia HTTP 402: out of credit"); } }) })));
    assert.match(rf.failed[0].reason, /^The voice could not be recorded: Cartesia HTTP 402: out of credit/);
    const f1 = (await item(F)).animate!;
    assert.deepEqual([f1.route, f1.build?.state, f1.build?.cost], ["hand", "failed", 0.25]);
    assert.equal(await Animation.countDocuments({ itemId: F }), 0);
    await store.setAnimateRoute([F], "api", OWNER); // the owner queues it again once the voice works
    assert.deepEqual(done(await buildQueued(deps(mF))).built, [F]);
    assert.deepEqual(mF.calls, [F], "the second build takes up the source already authored");
    assert.equal((await item(F)).animate!.build!.cost, 0.01, "only the voice is paid the second time");

    // --- the voice is not set up (no key, no ffmpeg): failed before any money is spent ---
    await queue(G);
    const mG = model();
    const rg = done(await buildQueued(deps(mG, { voice: voice({ ready: async () => "ffmpeg is not installed on the server" }) })));
    assert.equal(rg.failed[0].reason, "ffmpeg is not installed on the server");
    assert.equal(mG.calls.length, 0, "no model call when the voice cannot be recorded");
    const real = defaultVoice({}, "castle_rock_review");
    assert.match((await real.ready())!, /CARTESIA_API_KEY/, "the real voice says what is missing");
    assert.match((await defaultVoice({ KEYSTONE_ANIM_FAKE_VOICE: "1" }, "castle_rock_review").ready())!, /CARTESIA_API_KEY/, "the stand-in voice cannot be switched on for production's database");
    assert.equal(await defaultVoice({ KEYSTONE_ANIM_FAKE_VOICE: "1" }, "castle_rock_review_smoke").ready(), null, "only on a _smoke database");

    // --- no examples on the server: fails cleanly, nothing authored ---
    await rm(dirs.examples, { recursive: true, force: true });
    await queue(H);
    const mH = model();
    const rh = done(await buildQueued(deps(mH)));
    assert.match(rh.failed[0].reason, /no finished examples on the server .*animated-examples is empty or missing/);
    assert.equal(mH.calls.length, 0, "never authored without examples");
    assert.equal((await item(H)).animate!.route, "hand");
    seedExamples();

    // --- the stand-in voice end to end (what the local trial run uses): real recording path, silent clips ---
    await queue(I);
    done(await buildQueued(deps(model(), { voice: defaultVoice({ KEYSTONE_ANIM_FAKE_VOICE: "1" }, "x_smoke") })));
    const ai = (await Animation.findOne({ itemId: I }).lean())!;
    assert.match(ai.notes!, /Silent stand-in voice/);
    const mp3 = readFileSync(path.join(animatedDir(I, 1), "audio", "step-1.mp3"));
    assert.ok(mp3[0] === 0xff && mp3[1] === 0xfb && mp3.length > 400, "an mp3 clip was written without ffmpeg");
    assert.equal((await item(I)).animate!.build!.cost, 0.25, "the stand-in voice costs nothing");

    // --- the daily cap: once reached, the rest stays queued and the list and the email say so ---
    await AnimBuild.deleteMany({ itemId: { $in: IDS } });
    const base = await spentToday();
    await queue(J, new Date(Date.now() - 2000));
    await queue(K, new Date(Date.now() - 1000));
    const capEnv = { KEYSTONE_ANIM_DAILY_CAP_USD: String(base + 0.2) };
    const mCap = model();
    const rj = done(await buildQueued(deps(mCap, { env: capEnv })));
    assert.deepEqual([rj.built, rj.capReached, rj.waiting], [[J], true, [K]], "oldest first, then the cap stops the run");
    assert.deepEqual(mCap.calls, [J]);
    assert.deepEqual([(await item(K)).animate!.route, (await item(K)).animate!.build!.state], ["api", "queued"], "the rest stays queued");
    const budget = await buildBudget(new Date(), capEnv);
    assert.ok(budget.on && budget.capReached && Math.abs(budget.spent - base - 0.26) < 1e-9, "the list can say the cap is reached");
    process.env.KEYSTONE_ANIM_DAILY_CAP_USD = capEnv.KEYSTONE_ANIM_DAILY_CAP_USD;
    const digCap = await store.animationDigest(new Date(Date.now() - 86400000));
    delete process.env.KEYSTONE_ANIM_DAILY_CAP_USD;
    assert.deepEqual(digCap.capReached?.waiting, [K], "the status email says which items wait");
    assert.equal((await store.animationDigest(new Date(Date.now() - 86400000))).capReached, undefined, "not under the default cap");

    // --- the lock: a build running elsewhere means no second build ---
    assert.ok(await acquireLock(BUILD_LOCK, "another-process", new Date(), BUILD_LOCK_TTL_MS));
    assert.deepEqual(await buildQueued(deps(mCap)), { status: "busy" });
    assert.equal(mCap.calls.length, 1, "busy: nothing built");
    assert.equal((await item(K)).animate!.build!.state, "queued");
    await releaseLock(BUILD_LOCK, "another-process");
    // two calls at once (a double press): one builds, the other finds the lock held
    const both = await Promise.all([buildQueued(deps(mCap)), buildQueued(deps(mCap))]);
    assert.deepEqual(both.map((r) => r.status).sort(), ["busy", "done"]);
    assert.deepEqual(mCap.calls, [J, K], "K was built once");
    assert.equal(await Animation.countDocuments({ itemId: K }), 1);

    // --- a second press while an item is being built changes nothing for it ---
    await queue(L);
    const started = new Date();
    await Item.updateOne({ itemId: L }, { $set: { "animate.build": { state: "building", startedAt: started, attempts: 1 } } });
    await store.setAnimateRoute([L], "api", { username: "someone-else", role: "evelyn" });
    const l1 = (await item(L)).animate!;
    assert.deepEqual([l1.build?.state, l1.requestedBy], ["building", "qa-owner"], "left as it is");
    // …and a build still inside the lock's lifetime is not started a second time
    const mL = model();
    done(await buildQueued(deps(mL)));
    assert.equal(mL.calls.length, 0, "a build that may still be running is left alone");

    // --- interrupted by a restart: older than the lock's lifetime → retried once, then failed ---
    const long = new Date(Date.now() - BUILD_LOCK_TTL_MS - 60_000);
    await Item.updateOne({ itemId: L }, { $set: { "animate.build": { state: "building", startedAt: long, attempts: 2 } } });
    const rl2 = done(await buildQueued(deps(mL)));
    assert.match(rl2.failed[0].reason, /interrupted twice/);
    assert.equal(mL.calls.length, 0, "the second interruption is not retried");
    assert.deepEqual([(await item(L)).animate!.route, (await item(L)).animate!.build!.state], ["hand", "failed"]);
    await store.setAnimateRoute([L], "api", OWNER);
    await Item.updateOne({ itemId: L }, { $set: { "animate.build": { state: "building", startedAt: long, attempts: 1 } } });
    assert.deepEqual(done(await buildQueued(deps(mL))).built, [L], "the first interruption is retried");
    assert.deepEqual(mL.calls, [L]);
    assert.deepEqual([(await item(L)).animate!.build!.state, (await item(L)).animate!.build!.attempts], ["built", 2]);

    // --- the owner changes the choice while the item is built: nothing is published ---
    await Animation.deleteMany({ itemId: A });
    await store.setAnimateRoute([A], "api", OWNER);
    const fickle = voice();
    const rec = fickle.record;
    fickle.record = async (s, l) => {
      await store.setAnimateRoute([A], "none", OWNER, "Not needed after all.");
      return rec(s, l);
    };
    const ra = done(await buildQueued(deps(model(), { voice: fickle })));
    assert.deepEqual([ra.built, ra.failed], [[], []]);
    assert.equal(await Animation.countDocuments({ itemId: A }), 0, "not published against the owner's choice");
    assert.deepEqual([(await item(A)).animate!.route, (await item(A)).animate!.reason], ["none", "Not needed after all."]);

    console.log("animated/serverbuild.dbtest.ts: ok");
  } finally {
    await clean();
    await closeKs();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
