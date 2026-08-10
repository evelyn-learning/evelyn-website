/**
 * Learner-model estimator — pure/deterministic tests against
 * src/lib/tutor/learner-model/estimator.ts. No DB, no LLM calls (Task 6).
 * Task 7 extends this script with a DB-backed section for appendEvidence.
 * Task 8 further extends it with the server append points (emit / assessment
 * / mock) that call appendEvidence internally.
 *
 * Usage: npx tsx scripts/test-learner-model.ts  (npm run test:learner-model)
 */
import { estimateLo, trendOf, nextReviewAt } from '../src/lib/tutor/learner-model/estimator';
import type { SessionEmitRequest } from '@evelyn/portal-contract/v1';
import type { GradeDeps } from '@/lib/tutor/portal/grade-free-response';

let passed = 0;
let failed = 0;
function assert(cond: boolean, name: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}`); }
}

const now = new Date('2026-08-10T00:00:00Z');
const d = (days: number) => new Date(now.getTime() - days * 86400000);

// weighting: a fresh mock success outweighs an old practice failure
const e1 = estimateLo([
  { source: 'practice', outcome: 0, occurredAt: d(60) },
  { source: 'mock', outcome: 1, occurredAt: d(1) },
], now)!;
assert(e1.estimate > 0.8, 'recency+source weighting');

// empty → null
assert(estimateLo([], now) === null, 'no evidence → null');

// confidence bands from n_eff
assert(
  estimateLo([{ source: 'session', outcome: 1, occurredAt: d(0) }], now)!.confidence === 'low',
  'one event low',
);

// trend
assert(
  trendOf(0.8, 0.7) === 'up' && trendOf(0.71, 0.7) === 'flat' && trendOf(null, 0.5) === 'flat',
  'trend rule',
);

// review: 2 spaced successes → h = 2*2^1 = 4d after the last one; weak LO never scheduled
const evs = [
  { source: 'practice' as const, outcome: 1, occurredAt: d(10) },
  { source: 'practice' as const, outcome: 1, occurredAt: d(5) },
];
assert(
  nextReviewAt(evs, 0.75, now)!.getTime() === d(5).getTime() + 4 * 86400000,
  'half-life doubling',
);
assert(nextReviewAt(evs, 0.4, now) === null, 'weak LO → remediation, not review');

// same-day successes count once for k
assert(
  nextReviewAt([...evs, { source: 'practice', outcome: 1, occurredAt: d(5) }], 0.75, now)!.getTime()
    === d(5).getTime() + 4 * 86400000,
  'min spacing for k',
);

/* ------------------------------------------------------------------ */
/* appendEvidence / deleteLearnerModelData — DB-backed (Task 7)       */
/* ------------------------------------------------------------------ */

async function runDbTests() {
  if (!process.env.MONGODB_URI) {
    console.log('\n(skip DB-backed appendEvidence/deleteLearnerModelData tests — no MONGODB_URI)');
    return;
  }

  const { appendEvidence, deleteLearnerModelData } = await import('../src/lib/tutor/learner-model/store');
  const {
    EvidenceEventModel,
    LearnerStateProjectionModel,
    LearnerStateSnapshotModel,
    EloRatingModel,
    buildLearnerStateProjectionId,
  } = await import('../src/models');
  const { default: connectDB } = await import('../src/lib/db');

  await connectDB();

  // Unique prefix per run so reruns never collide with a prior run's rows
  // (cleanup below also removes them, but a crash mid-run shouldn't wedge
  // the next run).
  const studentId = `lmtest:${process.pid}`;
  const eloStudentId = `lmtest:${process.pid}:elo`;
  const trialStudentId = `trial:lmtest:${process.pid}`;
  const loId = 'lo.demo.append-evidence';
  const itemId = `item-lmtest-${process.pid}`;

  async function cleanupAll() {
    await deleteLearnerModelData(studentId);
    await deleteLearnerModelData(eloStudentId);
    await deleteLearnerModelData(trialStudentId);
    await EloRatingModel.deleteOne({ _id: `item:${itemId}` });
  }

  console.log('\nDB-backed appendEvidence / deleteLearnerModelData (Task 7):\n');
  await cleanupAll();

  try {
    const wallClock = new Date();
    const base = { studentId, loId, source: 'practice' as const, occurredAt: wallClock };

    // 2 events for one (student, LO) → projection exists with nEff > 0
    await appendEvidence([
      { ...base, idempotencyKey: `${studentId}:${loId}:1`, outcome: 1 },
      { ...base, idempotencyKey: `${studentId}:${loId}:2`, outcome: 0.5 },
    ]);
    const projection = await LearnerStateProjectionModel.findById(
      buildLearnerStateProjectionId(studentId, loId),
    );
    assert(!!projection && projection.nEff > 0, 'appendEvidence: projection exists with nEff > 0');

    // re-append the same inputs → idempotent, event count unchanged
    const countBefore = await EvidenceEventModel.countDocuments({ studentId, loId });
    await appendEvidence([
      { ...base, idempotencyKey: `${studentId}:${loId}:1`, outcome: 1 },
      { ...base, idempotencyKey: `${studentId}:${loId}:2`, outcome: 0.5 },
    ]);
    const countAfter = await EvidenceEventModel.countDocuments({ studentId, loId });
    assert(countBefore === 2 && countAfter === 2, 'appendEvidence: re-append is idempotent (event count unchanged)');

    // trial:-prefixed studentId is dropped before any write
    await appendEvidence([
      { ...base, studentId: trialStudentId, idempotencyKey: `${trialStudentId}:${loId}:1`, outcome: 1 },
    ]);
    const trialCount = await EvidenceEventModel.countDocuments({ studentId: trialStudentId });
    assert(trialCount === 0, "appendEvidence: 'trial:' studentId → zero rows written");

    // Elo ratings move in opposite directions for a perfect outcome
    await appendEvidence([
      {
        studentId: eloStudentId,
        loId,
        source: 'mock',
        occurredAt: wallClock,
        outcome: 1,
        itemId,
        subject: 'math',
        idempotencyKey: `${eloStudentId}:${itemId}:1`,
      },
    ]);
    const itemRating = await EloRatingModel.findById(`item:${itemId}`);
    const studentRating = await EloRatingModel.findById(`student:${eloStudentId}|math`);
    assert(
      !!itemRating && !!studentRating && studentRating.rating > 1500 && itemRating.rating < 1500,
      'appendEvidence: Elo ratings move in opposite directions (student up, item down on a win)',
    );

    // deleteLearnerModelData empties all four collections + returns counts
    await LearnerStateSnapshotModel.create({
      studentId,
      date: '2026-08-01',
      los: [{ loId, estimate: 0.5 }],
    });
    const counts = await deleteLearnerModelData(studentId);
    const remainingEvents = await EvidenceEventModel.countDocuments({ studentId });
    const remainingProjections = await LearnerStateProjectionModel.countDocuments({ studentId });
    const remainingSnapshots = await LearnerStateSnapshotModel.countDocuments({ studentId });
    assert(
      counts.evidenceEvents === 2 &&
        counts.learnerStateProjections === 1 &&
        counts.learnerStateSnapshots === 1 &&
        remainingEvents === 0 &&
        remainingProjections === 0 &&
        remainingSnapshots === 0,
      'deleteLearnerModelData: empties evidence/projections/snapshots for the student and returns counts',
    );

    const eloCounts = await deleteLearnerModelData(eloStudentId);
    const remainingStudentElo = await EloRatingModel.findById(`student:${eloStudentId}|math`);
    const itemRatingStillThere = await EloRatingModel.findById(`item:${itemId}`);
    assert(
      eloCounts.eloRatings === 1 && !remainingStudentElo && !!itemRatingStillThere,
      "deleteLearnerModelData: removes the student's Elo row only (shared item row untouched)",
    );
  } finally {
    await cleanupAll();
  }
}

/** Poll until `check()` is truthy or `timeoutMs` elapses. Needed because the
 *  emit/assessment append points are fire-and-forget (latency-sensitive
 *  paths — see Task 8 brief) — the evidence row can land a beat after the
 *  awaited call returns. */
async function waitFor(check: () => Promise<boolean>, timeoutMs = 3000, stepMs = 25): Promise<boolean> {
  const start = Date.now();
  for (;;) {
    if (await check()) return true;
    if (Date.now() - start >= timeoutMs) return false;
    await new Promise((r) => setTimeout(r, stepMs));
  }
}

/* ------------------------------------------------------------------ */
/* Server append points — emit / assessment / mock (Task 8)           */
/* ------------------------------------------------------------------ */

async function runServerAppendPointTests() {
  if (!process.env.MONGODB_URI) {
    console.log('\n(skip Task 8 server append-point tests — no MONGODB_URI)');
    return;
  }

  const { EvidenceEventModel } = await import('../src/models');
  const { deleteLearnerModelData } = await import('../src/lib/tutor/learner-model/store');
  const { emitSessionResult } = await import('../src/lib/tutor/portal/session-result');
  const { submitAssessment } = await import('../src/lib/tutor/portal/assessment');
  const { ensureGraded } = await import('../src/lib/tutor/mock-exam/report');
  const { memoryMockStores, startOrResume, saveResponses, advance, finalizeOpenModule } = await import(
    '../src/lib/tutor/mock-exam/service'
  );
  const { FIXTURE_FORM, FIXTURE_ITEMS } = await import('../src/lib/tutor/mock-exam/fixtures');
  const { registerBlueprint } = await import('../src/lib/tutor/mock-exam/blueprints');

  console.log('\nServer append points — emit / assessment / mock (Task 8):\n');

  // --- (a) emitSessionResult: evidence[] → per-index rows; replay is a no-op ---
  {
    const studentId = `lmtest:emit:${process.pid}`;
    const sessionId = `lmtest-emit-session-${process.pid}`;
    const emitReq: SessionEmitRequest = {
      sessionId,
      studentId,
      courseId: 'ap-statistics',
      status: 'completed',
      milestone: 'none',
      losTouched: ['lo1'],
      masteryDeltas: [{ loId: 'lo1', delta: 0.5 }],
      gaps: [],
      notesTouched: [],
      evidence: [{ loId: 'lo1', outcome: 1, source: 'practice', itemId: 'i1' }],
    };
    await deleteLearnerModelData(studentId);
    try {
      await emitSessionResult(emitReq);

      const landed = await waitFor(async () => !!(await EvidenceEventModel.findById(`emit:${sessionId}:0`)));
      assert(landed, 'emitSessionResult: evidence[] produces a row keyed emit:<sid>:0');
      const row = await EvidenceEventModel.findById(`emit:${sessionId}:0`);
      assert(
        !!row && row.source === 'practice' && row.outcome === 1 && row.itemId === 'i1' && row.loId === 'lo1',
        'emitSessionResult: evidence row carries loId/source/outcome/itemId from evidence[0]',
      );

      // Replay (same sessionId) hits the idempotency guard before the evidence
      // build even runs — no new/duplicate rows.
      const countBefore = await EvidenceEventModel.countDocuments({ studentId });
      await emitSessionResult(emitReq);
      await new Promise((r) => setTimeout(r, 200)); // let any (wrongly) fired append settle
      const countAfter = await EvidenceEventModel.countDocuments({ studentId });
      assert(countBefore === countAfter, 'emitSessionResult: replayed terminal emit adds no evidence rows');
    } finally {
      await deleteLearnerModelData(studentId);
    }
  }

  // --- (a) emitSessionResult: no evidence[] → one row per masteryDeltas LO ---
  {
    const studentId = `lmtest:emitfb:${process.pid}`;
    const sessionId = `lmtest-emitfb-session-${process.pid}`;
    const emitReq: SessionEmitRequest = {
      sessionId,
      studentId,
      courseId: 'ap-statistics',
      status: 'completed',
      milestone: 'none',
      losTouched: ['lo1', 'lo2'],
      masteryDeltas: [{ loId: 'lo1', delta: 0.5 }, { loId: 'lo2', delta: -0.3 }],
      gaps: [],
      notesTouched: [],
    };
    await deleteLearnerModelData(studentId);
    try {
      await emitSessionResult(emitReq);

      const landed = await waitFor(
        async () =>
          !!(await EvidenceEventModel.findById(`emit:${sessionId}:lo:lo1`)) &&
          !!(await EvidenceEventModel.findById(`emit:${sessionId}:lo:lo2`)),
      );
      assert(landed, 'emitSessionResult: no evidence[] → falls back to one row per masteryDeltas LO');
      const row1 = await EvidenceEventModel.findById(`emit:${sessionId}:lo:lo1`);
      const row2 = await EvidenceEventModel.findById(`emit:${sessionId}:lo:lo2`);
      assert(
        !!row1 && row1.source === 'session' && row1.outcome === 1,
        'emitSessionResult: fallback row — delta >= 0 → outcome 1, source session',
      );
      assert(
        !!row2 && row2.source === 'session' && row2.outcome === 0,
        'emitSessionResult: fallback row — delta < 0 → outcome 0',
      );
    } finally {
      await deleteLearnerModelData(studentId);
    }
  }

  // --- (b) submitAssessment: per-item rows with points fractions ---
  {
    const studentId = `lmtest:diag:${process.pid}`;
    const sessionId = `lmtest-diag-session-${process.pid}`;
    const LO_A = 'lmtest.lo-a';
    const LO_B = 'lmtest.lo-b';
    const KEYS: Record<string, { responseFormat: 'numeric'; expectedAnswer: string }> = {
      qa: { responseFormat: 'numeric', expectedAnswer: '5' },
      qb: { responseFormat: 'numeric', expectedAnswer: '5' },
    };
    const resolver = async (id: string) => KEYS[id] ?? null;
    const deps: GradeDeps = {
      async gradeRubricPart() {
        return { pointsAwarded: 0, feedback: '' };
      },
      async judgeSingleAnswer() {
        return { correct: false, feedback: '' };
      },
    };
    await deleteLearnerModelData(studentId);
    try {
      await submitAssessment(
        {
          assessmentId: 'lmtest-asmt-1',
          studentId,
          courseId: 'ap-statistics',
          sessionId,
          responses: [
            { itemId: 'qa', loId: LO_A, response: { text: '5' } }, // correct → 1/1
            { itemId: 'qb', loId: LO_B, response: { text: '1' } }, // wrong → 0/1
          ],
        },
        deps,
        resolver,
      );

      const landed = await waitFor(
        async () =>
          !!(await EvidenceEventModel.findById(`diag:${sessionId}:qa`)) &&
          !!(await EvidenceEventModel.findById(`diag:${sessionId}:qb`)),
      );
      assert(landed, 'submitAssessment: produces 2 per-item evidence rows keyed diag:<sid>:<itemId>');
      const rowA = await EvidenceEventModel.findById(`diag:${sessionId}:qa`);
      const rowB = await EvidenceEventModel.findById(`diag:${sessionId}:qb`);
      assert(
        !!rowA && rowA.outcome === 1 && rowA.pointsAwarded === 1 && rowA.maxPoints === 1 && rowA.source === 'diagnostic',
        'submitAssessment: correct item → outcome 1, points fraction 1/1, source diagnostic (no notesTouched)',
      );
      assert(
        !!rowB && rowB.outcome === 0 && rowB.pointsAwarded === 0 && rowB.maxPoints === 1,
        'submitAssessment: wrong item → outcome 0, points fraction 0/1',
      );
    } finally {
      await deleteLearnerModelData(studentId);
    }
  }

  // --- (b) submitAssessment: notesTouched present → source 'assessment' (quiz) ---
  {
    const studentId = `lmtest:quiz:${process.pid}`;
    const sessionId = `lmtest-quiz-session-${process.pid}`;
    const KEYS: Record<string, { responseFormat: 'numeric'; expectedAnswer: string }> = {
      qc: { responseFormat: 'numeric', expectedAnswer: '5' },
    };
    const resolver = async (id: string) => KEYS[id] ?? null;
    const deps: GradeDeps = {
      async gradeRubricPart() {
        return { pointsAwarded: 0, feedback: '' };
      },
      async judgeSingleAnswer() {
        return { correct: false, feedback: '' };
      },
    };
    await deleteLearnerModelData(studentId);
    try {
      await submitAssessment(
        {
          assessmentId: 'lmtest-asmt-2',
          studentId,
          courseId: 'ap-statistics',
          sessionId,
          responses: [{ itemId: 'qc', loId: 'lmtest.lo-c', response: { text: '5' } }],
          notesTouched: [{ baselineId: 'b1', cedTopic: 'topic', cedTitle: 'title' }],
        },
        deps,
        resolver,
      );
      const landed = await waitFor(async () => !!(await EvidenceEventModel.findById(`diag:${sessionId}:qc`)));
      assert(landed, 'submitAssessment (quiz): evidence row lands');
      const row = await EvidenceEventModel.findById(`diag:${sessionId}:qc`);
      assert(!!row && row.source === 'assessment', "submitAssessment: notesTouched present → source 'assessment'");
    } finally {
      await deleteLearnerModelData(studentId);
    }
  }

  // --- (c) mock grading: per-item rows + loBreakdown carry sectionId ---
  {
    const studentId = `lmtest:mock:${process.pid}`;
    await deleteLearnerModelData(studentId);
    try {
      const stores = memoryMockStores({ forms: [FIXTURE_FORM], items: FIXTURE_ITEMS });
      const T0 = 1_750_000_000_000;
      const s = await startOrResume(stores, { studentId, topicId: 'fixture', formId: 'fixture-form-a' }, T0);
      const attemptId = s.attemptId;
      await saveResponses(
        stores,
        {
          studentId,
          attemptId,
          cursor: { sectionIdx: 0, moduleIdx: 0 },
          responses: [{ itemId: 'fx-m1-1', answer: 'A' }, { itemId: 'fx-m1-2', answer: 'B' }],
        },
        T0 + 1_000,
      );
      let st = await advance(stores, { studentId, attemptId, fromCursor: { sectionIdx: 0, moduleIdx: 0 } }, T0 + 2_000);
      const m2ItemId = st.section!.items[0].itemId;
      await saveResponses(
        stores,
        { studentId, attemptId, cursor: { sectionIdx: 0, moduleIdx: 1 }, responses: [{ itemId: m2ItemId, answer: 'A' }] },
        T0 + 3_000,
      );
      await advance(stores, { studentId, attemptId, fromCursor: { sectionIdx: 0, moduleIdx: 1 } }, T0 + 4_000);
      st = await advance(stores, { studentId, attemptId, fromCursor: { sectionIdx: 1, moduleIdx: 0 } }, T0 + 5_000);
      assert(st.status === 'in_section', 'mock fixture: section 2 (FRQ) opened');
      await saveResponses(
        stores,
        { studentId, attemptId, cursor: { sectionIdx: 1, moduleIdx: 0 }, responses: [{ itemId: 'fx-frq-1', frqText: 'my proof' }] },
        T0 + 6_000,
      );
      st = await advance(stores, { studentId, attemptId, fromCursor: { sectionIdx: 1, moduleIdx: 0 } }, T0 + 7_000);
      assert(st.status === 'grading', 'mock fixture: reached grading state');

      const gradeDeps: GradeDeps = {
        async gradeRubricPart(args) {
          return { pointsAwarded: args.maxPoints, feedback: 'ok' };
        },
        async judgeSingleAnswer() {
          return { correct: true, feedback: 'ok' };
        },
      };
      const profiles = new Map<string, Record<string, unknown>>();
      const profileStore = {
        async getOrCreate(id: string) {
          const existing = profiles.get(id);
          if (existing) return existing;
          const fresh = { id, mastery: {}, gaps: [], recentSessions: [] };
          profiles.set(id, fresh);
          return fresh;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async save(p: any) {
          profiles.set(p.id, p);
          return p;
        },
      };
      await ensureGraded(stores, attemptId, { gradeDeps, profileStore }, T0 + 8_000);
      const attempt = (await stores.findAttempt(attemptId))!;

      const lo3 = attempt.loBreakdown!.find((e) => e.loId === 'fx.lo3'); // the FRQ's LO
      assert(!!lo3 && lo3.sectionId === 'sec2', 'mock: FRQ-folded loBreakdown entry carries sectionId (sec2)');
      const lo1 = attempt.loBreakdown!.find((e) => e.loId === 'fx.lo1'); // MCQ LO
      assert(!!lo1 && lo1.sectionId === 'sec1', 'mock: MCQ loBreakdown entry carries sectionId (sec1)');

      // gradeAndComplete awaits its evidence append (unlike emit/assessment),
      // so no polling needed here — it's already landed by the time
      // ensureGraded resolves.
      const mcqRow = await EvidenceEventModel.findById(`mock:${attemptId}:fx-m1-1`);
      assert(
        !!mcqRow && mcqRow.outcome === 1 && mcqRow.sectionId === 'sec1' && mcqRow.difficulty === 1 && mcqRow.source === 'mock',
        'mock: correct MCQ item → per-item evidence row w/ sectionId + difficulty',
      );
      const frqRow = await EvidenceEventModel.findById(`mock:${attemptId}:fx-frq-1`);
      assert(
        !!frqRow && frqRow.sectionId === 'sec2' && frqRow.pointsAwarded === 4 && frqRow.maxPoints === 4 && frqRow.outcome === 1,
        'mock: FRQ item → per-item evidence row w/ points fraction + sectionId',
      );
    } finally {
      await deleteLearnerModelData(studentId);
    }
  }

  // --- (d) FIX ROUND: MCQ-only mock form (finalizeOpenModule's fast path) ---
  // digital-sat / act / hs-* forms carry no FRQ items at all, so they NEVER
  // pass through gradeAndComplete (that only runs once status enters
  // 'grading') — this is the only place they can emit evidence. Registers a
  // throwaway single-section, no-FRQ blueprint (mirrors FIXTURE_BLUEPRINT's
  // shape but with no sec2/FRQ) so `advance()` closes straight to
  // 'completed' via the `!hasFrq` branch in finalizeOpenModule.
  {
    const ALL_TOOLS = { desmos: true, referenceSheet: true, eliminator: true, highlighter: true };
    const MCQ_ONLY_BLUEPRINT = {
      examKey: 'lmtest-mcq-only',
      examType: 'fixture' as const,
      label: 'MCQ-Only Fixture Exam',
      sections: [
        {
          sectionId: 'sec1',
          label: 'Section 1',
          tools: ALL_TOOLS,
          modules: [{ moduleId: 'm1', label: 'Module 1', questionCount: 2, timeLimitMin: 4 }],
        },
      ],
      scoring: {
        kind: 'scaled-sections' as const,
        sectionScaledMin: 10,
        sectionScaledMax: 40,
        compositeMin: 10,
        compositeMax: 40,
        curves: { sec1: { default: [[0, 10], [2, 40]] as [number, number][] } },
      },
    };
    registerBlueprint(MCQ_ONLY_BLUEPRINT);

    const MCQ_ONLY_FORM = {
      formId: 'lmtest-mcq-only-form',
      examKey: 'lmtest-mcq-only',
      topicIds: ['lmtest-mcq-only'],
      label: 'MCQ-Only Fixture Form',
      status: 'live' as const,
      sections: [{ sectionId: 'sec1', modules: [{ moduleId: 'm1', itemIds: ['mo-1', 'mo-2'] }] }],
    };
    const MCQ_ONLY_ITEMS = [
      {
        id: 'mo-1', loId: 'mo.lo1', topic: 'Fixture', topicId: 'lmtest-mcq-only',
        difficulty: 2 as const, responseFormat: 'mcq' as const, problemText: 'pick A',
        choices: ['A', 'B', 'C', 'D'], answer: 'A', bankScope: 'mock' as const,
      },
      {
        id: 'mo-2', loId: 'mo.lo1', topic: 'Fixture', topicId: 'lmtest-mcq-only',
        difficulty: 2 as const, responseFormat: 'mcq' as const, problemText: 'pick B',
        choices: ['A', 'B', 'C', 'D'], answer: 'B', bankScope: 'mock' as const,
      },
    ];

    const studentId = `lmtest:mcqonly:${process.pid}`;
    await deleteLearnerModelData(studentId);
    try {
      const stores = memoryMockStores({ forms: [MCQ_ONLY_FORM], items: MCQ_ONLY_ITEMS });
      const T0 = 1_750_200_000_000;
      const s = await startOrResume(stores, { studentId, topicId: 'lmtest-mcq-only', formId: 'lmtest-mcq-only-form' }, T0);
      const attemptId = s.attemptId;
      await saveResponses(
        stores,
        {
          studentId,
          attemptId,
          cursor: { sectionIdx: 0, moduleIdx: 0 },
          // mo-1: A == A (correct); mo-2: C != B (wrong)
          responses: [{ itemId: 'mo-1', answer: 'A' }, { itemId: 'mo-2', answer: 'C' }],
        },
        T0 + 1_000,
      );
      const st = await advance(stores, { studentId, attemptId, fromCursor: { sectionIdx: 0, moduleIdx: 0 } }, T0 + 2_000);
      assert(st.status === 'completed', 'MCQ-only fixture: single-section close finalizes directly to completed (never grading)');

      const attempt = (await stores.findAttempt(attemptId))!;
      const lo1 = attempt.loBreakdown!.find((e) => e.loId === 'mo.lo1');
      assert(!!lo1 && lo1.sectionId === 'sec1' && lo1.correct === 1 && lo1.total === 2, 'MCQ-only: loBreakdown carries sectionId (fast path)');

      const row1 = await EvidenceEventModel.findById(`mock:${attemptId}:mo-1`);
      const row2 = await EvidenceEventModel.findById(`mock:${attemptId}:mo-2`);
      assert(
        !!row1 && row1.outcome === 1 && row1.sectionId === 'sec1' && row1.difficulty === 2 && row1.source === 'mock',
        'MCQ-only: correct item → evidence row w/ sectionId + difficulty (the FIX — this used to be zero rows)',
      );
      assert(!!row2 && row2.outcome === 0, 'MCQ-only: wrong item → evidence row outcome 0');

      // Re-finalize/replay: directly re-invoke finalizeOpenModule on the now-
      // completed attempt (cursor never advances past the closed module, so
      // the "last section closed" branch re-runs identically) — the SAME
      // mock:<attemptId>:<itemId> idempotency keys must dedupe, not double-insert.
      const countBefore = await EvidenceEventModel.countDocuments({ studentId });
      const attemptAgain = (await stores.findAttempt(attemptId))!;
      const formAgain = (await stores.findForm('lmtest-mcq-only-form'))!;
      await finalizeOpenModule(stores, attemptAgain, formAgain, T0 + 3_000);
      const countAfter = await EvidenceEventModel.countDocuments({ studentId });
      assert(countBefore === countAfter, 'MCQ-only: re-finalize (replay) does not duplicate evidence rows');
    } finally {
      await deleteLearnerModelData(studentId);
    }
  }
}

runDbTests()
  .then(() => runServerAppendPointTests())
  .then(() => {
    console.log(`\n${passed} passed, ${failed} failed`);
    // Explicit exit code either way: a live mongoose connection (DB section
    // ran) keeps the event loop open, so falling off the end of this
    // callback would hang the process instead of returning 0.
    process.exit(failed > 0 ? 1 : 0);
  })
  .catch((err) => {
    console.error('Fatal error running DB-backed learner-model tests:', err);
    process.exit(1);
  });
