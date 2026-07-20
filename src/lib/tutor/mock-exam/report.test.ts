import { strict as assert } from 'node:assert';
import {
  memoryMockStores,
  startOrResume,
  saveResponses,
  advance,
  ATTEMPT_TTL_MS,
  type MockStores,
} from './service';
import { FIXTURE_FORM, FIXTURE_ITEMS } from './fixtures';
import type { GradeDeps } from '@/lib/tutor/portal/grade-free-response';
import { ensureGraded, getReport, getReview, type ReportDeps } from './report';

const T0 = 1_750_000_000_000;
const START = { topicId: 'fixture', formId: 'fixture-form-a' };

// --- fakes ---------------------------------------------------------------

/** Rubric-part grader returning fixed points, with a call counter and an
 *  optional "throw the first N calls" (failTimes) / "always throw" (fail). */
function makeGradeDeps(opts: { points?: number; fail?: boolean; failTimes?: number; slow?: boolean } = {}) {
  let calls = 0;
  let failsLeft = opts.failTimes ?? 0;
  const deps: GradeDeps = {
    async gradeRubricPart(args) {
      calls += 1;
      if (opts.slow) await new Promise((r) => setImmediate(r)); // yield so a concurrent poll interleaves
      if (opts.fail || failsLeft > 0) {
        failsLeft -= 1;
        throw new Error('grader boom');
      }
      return { pointsAwarded: opts.points ?? args.maxPoints, feedback: 'ok' };
    },
    async judgeSingleAnswer() {
      calls += 1;
      return { correct: true, feedback: 'ok' };
    },
  };
  return { deps, calls: () => calls };
}

/** In-memory profile store fake: real empty-ish profiles the pure helpers can
 *  mutate, capturing every save + counting getOrCreate/save calls. */
function makeProfileStore() {
  const profiles = new Map<string, Record<string, unknown>>();
  const saved: Array<Record<string, unknown>> = [];
  let getCalls = 0;
  let saveCalls = 0;
  const store = {
    async getOrCreate(id: string) {
      getCalls += 1;
      const existing = profiles.get(id);
      if (existing) return existing;
      const fresh = { id, mastery: {}, gaps: [], recentSessions: [] };
      profiles.set(id, fresh);
      return fresh;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async save(p: any) {
      saveCalls += 1;
      profiles.set(p.id, p);
      saved.push(p);
      return p;
    },
  };
  return { store, saved, getCalls: () => getCalls, saveCalls: () => saveCalls };
}

// --- driver: run the REAL service functions to a grading-state attempt ----

/** Drives a fresh attempt through both sections to the `grading` state.
 *  `m1` = the two answers for module 1 (drives easy/hard routing); `frqText`
 *  = the free-response (null → leave the FRQ unanswered). Returns attemptId. */
async function driveToGrading(
  stores: MockStores,
  studentId: string,
  m1: [string, string],
  frqText: string | null,
): Promise<string> {
  const s = await startOrResume(stores, { studentId, ...START }, T0);
  const attemptId = s.attemptId;
  await saveResponses(stores, {
    studentId, attemptId, cursor: { sectionIdx: 0, moduleIdx: 0 },
    responses: [{ itemId: 'fx-m1-1', answer: m1[0] }, { itemId: 'fx-m1-2', answer: m1[1] }],
  }, T0 + 1_000);

  let st = await advance(stores, { studentId, attemptId, fromCursor: { sectionIdx: 0, moduleIdx: 0 } }, T0 + 2_000);
  const m2ItemId = st.section!.items[0].itemId; // the routed variant's item
  await saveResponses(stores, {
    studentId, attemptId, cursor: { sectionIdx: 0, moduleIdx: 1 },
    responses: [{ itemId: m2ItemId, answer: 'A' }],
  }, T0 + 3_000);

  // advance → at_break, then advance again → open section 2 (the FRQ).
  await advance(stores, { studentId, attemptId, fromCursor: { sectionIdx: 0, moduleIdx: 1 } }, T0 + 4_000);
  st = await advance(stores, { studentId, attemptId, fromCursor: { sectionIdx: 1, moduleIdx: 0 } }, T0 + 5_000);
  assert.equal(st.status, 'in_section');

  if (frqText !== null) {
    await saveResponses(stores, {
      studentId, attemptId, cursor: { sectionIdx: 1, moduleIdx: 0 },
      responses: [{ itemId: 'fx-frq-1', frqText }],
    }, T0 + 6_000);
  }
  st = await advance(stores, { studentId, attemptId, fromCursor: { sectionIdx: 1, moduleIdx: 0 } }, T0 + 7_000);
  assert.equal(st.status, 'grading');
  return attemptId;
}

function freshStores(): MockStores {
  return memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
}

/** Drives a fresh attempt through section 1 to the at_break state (section 1
 *  fully complete, section 2 not yet opened). Returns attemptId. */
async function driveToAtBreak(stores: MockStores, studentId: string): Promise<string> {
  const s = await startOrResume(stores, { studentId, ...START }, T0);
  const attemptId = s.attemptId;
  await saveResponses(stores, {
    studentId, attemptId, cursor: { sectionIdx: 0, moduleIdx: 0 },
    responses: [{ itemId: 'fx-m1-1', answer: 'A' }, { itemId: 'fx-m1-2', answer: 'B' }],
  }, T0 + 1_000);
  const st = await advance(stores, { studentId, attemptId, fromCursor: { sectionIdx: 0, moduleIdx: 0 } }, T0 + 2_000);
  await saveResponses(stores, {
    studentId, attemptId, cursor: { sectionIdx: 0, moduleIdx: 1 },
    responses: [{ itemId: st.section!.items[0].itemId, answer: 'A' }],
  }, T0 + 3_000);
  const br = await advance(stores, { studentId, attemptId, fromCursor: { sectionIdx: 0, moduleIdx: 1 } }, T0 + 4_000);
  assert.equal(br.status, 'at_break');
  return attemptId;
}

// --- harness -------------------------------------------------------------

let passed = 0, failed = 0;
function test(name: string, fn: () => Promise<void>): Promise<void> {
  return Promise.resolve().then(fn)
    .then(() => { passed++; console.log(`  ok - ${name}`); })
    .catch((e) => { failed++; console.log(`  FAIL - ${name}`); console.error(e); });
}

async function run() {
  await test('ensureGraded grades FRQs and completes with curves applied', async () => {
    const stores = freshStores();
    const attemptId = await driveToGrading(stores, 's1', ['A', 'B'], 'my proof'); // m1 2/2 -> hard
    const grade = makeGradeDeps({ points: 2 }); // full marks: 2 + 2 = 4/4
    const deps: ReportDeps = { gradeDeps: grade.deps, profileStore: makeProfileStore().store };

    await ensureGraded(stores, attemptId, deps, T0 + 8_000);
    const a = (await stores.findAttempt(attemptId))!;
    assert.equal(a.status, 'completed');
    assert.equal(a.completedAt!.getTime(), T0 + 8_000);
    assert.equal(a.frqGrades!.length, 1);
    assert.equal(a.frqGrades![0].totalPoints, 4);
    assert.equal(a.frqGrades![0].maxPoints, 4);
    assert.ok(!a.frqGrades![0].ungraded);
    assert.ok(a.scaled, 'scaled applied');
    const sec2 = a.scaled!.sections.find((s) => s.sectionId === 'sec2')!;
    assert.equal(sec2.scaled, 40); // curve [[0,10],[4,40]] at raw 4
    // FRQ folded into loBreakdown for fx.lo3 (4/4 >= 0.5 -> correct).
    const lo3 = a.loBreakdown!.find((e) => e.loId === 'fx.lo3')!;
    assert.deepEqual({ correct: lo3.correct, total: lo3.total }, { correct: 1, total: 1 });
    assert.ok(!a.footnote);
  });

  await test('grader failing 3x marks ungraded + footnote, still completes', async () => {
    const stores = freshStores();
    const attemptId = await driveToGrading(stores, 's2', ['A', 'B'], 'my proof');
    const grade = makeGradeDeps({ fail: true });
    const deps: ReportDeps = { gradeDeps: grade.deps, profileStore: makeProfileStore().store };

    await ensureGraded(stores, attemptId, deps, T0 + 8_000);
    const a = (await stores.findAttempt(attemptId))!;
    assert.equal(a.status, 'completed');
    assert.equal(grade.calls(), 3); // 1 + 2 retries, then gives up
    assert.equal(a.frqGrades![0].ungraded, true);
    assert.equal(a.frqGrades![0].totalPoints, 0);
    assert.equal(a.frqGrades![0].maxPoints, 4);
    assert.deepEqual(a.frqGrades![0].parts, []);
    assert.equal(a.footnote, 'Estimated — 1 free-response task(s) could not be graded.');
    // Ungraded FRQ must NOT ding the LO breakdown.
    assert.ok(!a.loBreakdown!.some((e) => e.loId === 'fx.lo3'));
  });

  await test('grading is idempotent — second ensureGraded does not re-call grader', async () => {
    const stores = freshStores();
    const attemptId = await driveToGrading(stores, 's3', ['A', 'B'], 'my proof');
    const grade = makeGradeDeps({ points: 2 });
    const deps: ReportDeps = { gradeDeps: grade.deps, profileStore: makeProfileStore().store };

    await ensureGraded(stores, attemptId, deps, T0 + 8_000);
    const callsAfterFirst = grade.calls();
    assert.ok(callsAfterFirst > 0);
    await ensureGraded(stores, attemptId, deps, T0 + 9_000);
    assert.equal(grade.calls(), callsAfterFirst); // grader not called again
    const a = (await stores.findAttempt(attemptId))!;
    assert.equal(a.status, 'completed');
    assert.equal(a.completedAt!.getTime(), T0 + 8_000); // first completion time preserved
  });

  await test('gaps feed: lo below 50% recorded with INCORRECT_STREAK_2_PLUS, fed once', async () => {
    const stores = freshStores();
    // Both m1 answers wrong -> fx.lo1 = 0/2 (gap + mastery -1). m1 0/2 -> easy route.
    const attemptId = await driveToGrading(stores, 's4', ['D', 'D'], 'my proof');
    const grade = makeGradeDeps({ points: 2 });
    const ps = makeProfileStore();
    const deps: ReportDeps = { gradeDeps: grade.deps, profileStore: ps.store };

    await ensureGraded(stores, attemptId, deps, T0 + 8_000);
    assert.equal(ps.saveCalls(), 1);
    assert.equal(ps.getCalls(), 1);
    const profile = ps.saved[0] as { gaps: Array<Record<string, unknown>>; mastery: Record<string, { score: number }> };
    const gap = profile.gaps.find((g) => g.loId === 'fx.lo1')!;
    assert.ok(gap, 'gap recorded for fx.lo1');
    assert.deepEqual((gap.evidence as { signals: string[] }).signals, ['INCORRECT_STREAK_2_PLUS']);
    assert.equal(gap.sessionIds && (gap.sessionIds as string[])[0], `mock:${attemptId}`);
    assert.ok(profile.mastery['fx.lo1'].score < 0.5, 'mastery nudged down');
    const a = (await stores.findAttempt(attemptId))!;
    assert.equal(a.gapsFedAt!.getTime(), T0 + 8_000);

    // Second call: feed is guarded by gapsFedAt.
    await ensureGraded(stores, attemptId, deps, T0 + 9_000);
    assert.equal(ps.saveCalls(), 1);
    assert.equal(ps.getCalls(), 1);
  });

  await test('getReport for another studentId throws forbidden', async () => {
    const stores = freshStores();
    const attemptId = await driveToGrading(stores, 's5', ['A', 'B'], 'my proof');
    const deps: ReportDeps = { gradeDeps: makeGradeDeps({ points: 2 }).deps, profileStore: makeProfileStore().store };
    await assert.rejects(() => getReport(stores, 'intruder', attemptId, deps, T0 + 8_000), /forbidden/);
    // Owner still gets a completed report.
    const report = await getReport(stores, 's5', attemptId, deps, T0 + 8_000);
    assert.equal(report.status, 'completed');
    assert.ok(report.scaled);
  });

  await test('getReview before completion throws not_ready', async () => {
    const stores = freshStores();
    const s = await startOrResume(stores, { studentId: 's6', ...START }, T0); // in_section
    await assert.rejects(() => getReview(stores, 's6', s.attemptId), /not_ready/);

    // After completion the review joins verdicts + solutions + frq grades.
    const attemptId = await driveToGrading(stores, 's7', ['A', 'B'], 'my proof');
    const deps: ReportDeps = { gradeDeps: makeGradeDeps({ points: 2 }).deps, profileStore: makeProfileStore().store };
    await ensureGraded(stores, attemptId, deps, T0 + 8_000);
    const review = await getReview(stores, 's7', attemptId);
    const mcq = review.items.find((i) => i.itemId === 'fx-m1-1')!;
    assert.equal(mcq.correctAnswer, 'A');
    assert.equal(mcq.isCorrect, true);
    assert.ok(mcq.solutionText);
    const frq = review.items.find((i) => i.itemId === 'fx-frq-1')!;
    assert.equal(frq.studentAnswer, 'my proof');
    assert.ok(frq.frqGrade);
  });

  // --- C1: grading lock guard ------------------------------------------

  await test('concurrent ensureGraded polls grade exactly once (lock guard)', async () => {
    const stores = freshStores();
    const attemptId = await driveToGrading(stores, 's8', ['A', 'B'], 'my proof');
    const grade = makeGradeDeps({ points: 2, slow: true }); // slow → the two polls interleave
    const ps = makeProfileStore();
    const deps: ReportDeps = { gradeDeps: grade.deps, profileStore: ps.store };

    await Promise.all([
      ensureGraded(stores, attemptId, deps, T0 + 8_000),
      ensureGraded(stores, attemptId, deps, T0 + 8_000),
    ]);
    assert.equal(grade.calls(), 2); // 2 rubric parts, ONE grading pass (not 4)
    assert.equal(ps.saveCalls(), 1); // profile fed exactly once
    const a = (await stores.findAttempt(attemptId))!;
    assert.equal(a.status, 'completed');
    assert.equal(a.frqGrades!.length, 1);
  });

  await test('a fresh held grading lock makes another poll back off untouched', async () => {
    const stores = freshStores();
    const attemptId = await driveToGrading(stores, 's10', ['A', 'B'], 'my proof');
    // Simulate another poll currently holding a fresh lock (grading in flight).
    const held = (await stores.findAttempt(attemptId))!;
    held.gradingLockToken = 'other-poll';
    held.gradingStartedAt = new Date(T0 + 8_000);
    await stores.saveAttempt(held);
    const grade = makeGradeDeps({ points: 2 });
    const deps: ReportDeps = { gradeDeps: grade.deps, profileStore: makeProfileStore().store };

    const result = await ensureGraded(stores, attemptId, deps, T0 + 8_000 + 1_000);
    assert.equal(result.status, 'grading'); // backed off → route 202
    assert.equal(grade.calls(), 0); // did not double-grade
  });

  await test('a stale grading lock (>10min) is taken over and graded', async () => {
    const stores = freshStores();
    const attemptId = await driveToGrading(stores, 's9', ['A', 'B'], 'my proof');
    // Simulate a crashed grading run: a held lock stamped long ago, no grades.
    const crashed = (await stores.findAttempt(attemptId))!;
    crashed.gradingLockToken = 'crashed-run';
    crashed.gradingStartedAt = new Date(T0);
    await stores.saveAttempt(crashed);
    const grade = makeGradeDeps({ points: 2 });
    const deps: ReportDeps = { gradeDeps: grade.deps, profileStore: makeProfileStore().store };

    await ensureGraded(stores, attemptId, deps, T0 + 11 * 60 * 1_000);
    const a = (await stores.findAttempt(attemptId))!;
    assert.equal(a.status, 'completed');
    assert.ok(grade.calls() > 0); // takeover graded
  });

  await test('a slow superseded first grader abandons at completion (lease fenced)', async () => {
    const stores = freshStores();
    const attemptId = await driveToGrading(stores, 's11', ['A', 'B'], 'my proof');
    const ps = makeProfileStore(); // shared by both polls — asserts a single feed

    // P1: acquires the lease, then blocks inside the grader until released.
    let releaseP1: () => void = () => {};
    const gate = new Promise<void>((r) => { releaseP1 = r; });
    let p1Calls = 0;
    const p1Deps: ReportDeps = {
      gradeDeps: {
        async gradeRubricPart() { p1Calls += 1; await gate; return { pointsAwarded: 2, feedback: 'p1' }; },
        async judgeSingleAnswer() { return { correct: true, feedback: '' }; },
      },
      profileStore: ps.store,
    };
    const now1 = T0 + 8_000;
    const p1 = ensureGraded(stores, attemptId, p1Deps, now1);

    // Let P1 reach (and block in) the grader.
    for (let i = 0; i < 30 && p1Calls === 0; i++) await Promise.resolve();
    assert.equal(p1Calls, 1, 'P1 is blocked mid-grading');

    // P2 takes over after the 10-min stale window and fully completes + feeds.
    const p2Grade = makeGradeDeps({ points: 2 });
    await ensureGraded(stores, attemptId, { gradeDeps: p2Grade.deps, profileStore: ps.store }, now1 + 11 * 60 * 1_000);
    const afterP2 = (await stores.findAttempt(attemptId))!;
    assert.equal(afterP2.status, 'completed');
    const p2FedAt = afterP2.gapsFedAt!.getTime();
    const p2Token = afterP2.gradingLockToken;
    assert.equal(ps.saveCalls(), 1);

    // P1 finishes; it must abandon without clobbering the takeover.
    releaseP1();
    await p1;
    const final = (await stores.findAttempt(attemptId))!;
    assert.equal(final.status, 'completed');
    assert.equal(ps.saveCalls(), 1, 'profile fed exactly once');
    assert.equal(final.gapsFedAt!.getTime(), p2FedAt, 'takeover gapsFedAt intact');
    assert.equal(final.gradingLockToken, p2Token, 'takeover lease intact');
  });

  // --- I2: skipped FRQ zero-credit -------------------------------------

  await test('skipped FRQ scores zero credit (section floor + 0/1 LO, no footnote)', async () => {
    const stores = freshStores();
    const attemptId = await driveToGrading(stores, 'k1', ['A', 'B'], null); // FRQ left blank
    const grade = makeGradeDeps({ points: 2 });
    const deps: ReportDeps = { gradeDeps: grade.deps, profileStore: makeProfileStore().store };

    await ensureGraded(stores, attemptId, deps, T0 + 8_000);
    const a = (await stores.findAttempt(attemptId))!;
    assert.equal(grade.calls(), 0); // grader never runs for a blank FRQ
    const frq = a.frqGrades!.find((g) => g.itemId === 'fx-frq-1')!;
    assert.equal(frq.totalPoints, 0);
    assert.equal(frq.maxPoints, 4);
    assert.ok(!frq.ungraded);
    const sec2 = a.scaled!.sections.find((s) => s.sectionId === 'sec2')!;
    assert.equal(sec2.scaled, 10); // curve floor [[0,10],[4,40]] at raw 0
    const lo3 = a.loBreakdown!.find((e) => e.loId === 'fx.lo3')!;
    assert.deepEqual({ correct: lo3.correct, total: lo3.total }, { correct: 0, total: 1 });
    assert.ok(!a.footnote); // a skip is not a grader failure
  });

  // --- I1: expiry partial scoring --------------------------------------

  await test('expiry after a completed section yields a partial report (no scaled)', async () => {
    const stores = freshStores();
    const attemptId = await driveToAtBreak(stores, 'e1');
    // Resume past the TTL → lazy expiry scores the completed section 1.
    await startOrResume(stores, { studentId: 'e1', ...START }, T0 + ATTEMPT_TTL_MS + 1);
    const a = (await stores.findAttempt(attemptId))!;
    assert.equal(a.status, 'expired');
    assert.ok(a.rawSections && a.rawSections.length >= 1);
    assert.ok(!a.scaled);

    const deps: ReportDeps = { gradeDeps: makeGradeDeps({}).deps, profileStore: makeProfileStore().store };
    const report = await getReport(stores, 'e1', attemptId, deps, T0 + ATTEMPT_TTL_MS + 2);
    assert.equal(report.status, 'expired');
    assert.equal(report.footnote, 'Attempt expired before completion — partial results.');
    assert.ok(!report.scaled);
    assert.ok(report.sections.find((s) => s.sectionId === 'sec1'));
  });

  await test('expiry mid first section yields not_found (nothing finalized)', async () => {
    const stores = freshStores();
    const s = await startOrResume(stores, { studentId: 'e2', ...START }, T0); // in_section, cursor {0,0}
    const attemptId = s.attemptId;
    await startOrResume(stores, { studentId: 'e2', ...START }, T0 + ATTEMPT_TTL_MS + 1); // expire
    const a = (await stores.findAttempt(attemptId))!;
    assert.equal(a.status, 'expired');
    assert.ok(!a.rawSections);
    const deps: ReportDeps = { gradeDeps: makeGradeDeps({}).deps, profileStore: makeProfileStore().store };
    await assert.rejects(() => getReport(stores, 'e2', attemptId, deps, T0 + ATTEMPT_TTL_MS + 2), /not_found/);
  });

  await test('getReview works on an expired-partial attempt', async () => {
    const stores = freshStores();
    const attemptId = await driveToAtBreak(stores, 'e3');
    await startOrResume(stores, { studentId: 'e3', ...START }, T0 + ATTEMPT_TTL_MS + 1);
    const review = await getReview(stores, 'e3', attemptId);
    const mcq = review.items.find((i) => i.itemId === 'fx-m1-1')!;
    assert.ok(mcq);
    assert.equal(mcq.correctAnswer, 'A');
    assert.equal(mcq.isCorrect, true);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}
run();
