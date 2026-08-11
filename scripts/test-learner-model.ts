/**
 * Learner-model estimator — pure/deterministic tests against
 * src/lib/tutor/learner-model/estimator.ts. No DB, no LLM calls (Task 6).
 * Task 7 extends this script with a DB-backed section for appendEvidence.
 * Task 8 further extends it with the server append points (emit / assessment
 * / mock) that call appendEvidence internally. Task 9 further extends it
 * with pure projection.ts tests and a DB-backed learner-state route section.
 * Task 10 further extends it with a DB-backed `runLearnerSnapshot` section
 * and a DB-backed student-erase route section. Task 11 further extends it
 * with a DB-backed student-profile commit-route section covering the
 * segmentOutcomes → per-segment evidence append point.
 *
 * Usage: npx tsx scripts/test-learner-model.ts  (npm run test:learner-model)
 */
import { estimateLo, trendOf, nextReviewAt } from '../src/lib/tutor/learner-model/estimator';
import { projectScore, scaleForTopic, mapLoIdsToSections } from '../src/lib/tutor/learner-model/projection';
import { getBlueprint } from '../src/lib/tutor/mock-exam/blueprints';
import type { ScoringSpec } from '../src/lib/tutor/mock-exam/blueprints';
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
/* Score projection — pure (Task 9)                                   */
/* ------------------------------------------------------------------ */

// scaleForTopic: digital-sat/act/ap-*/else mapping
assert(
  scaleForTopic('digital-sat') === 'sat' &&
    scaleForTopic('act') === 'act' &&
    scaleForTopic('ap-statistics') === 'ap' &&
    scaleForTopic('ap-english-language') === 'ap' &&
    scaleForTopic('hs-chemistry') === 'readiness' &&
    scaleForTopic(undefined) === 'readiness',
  'scaleForTopic: digital-sat→sat, act→act, ap-*→ap, else→readiness',
);

// readiness projection: {0.8, null, 0.6} → center ≈ (0.8+0.3+0.6)/3×100 ≈ 57
const readinessLos = [
  { loId: 'a', estimate: 0.8, confidence: 'low' as const },
  { loId: 'b', estimate: null, confidence: 'low' as const },
  { loId: 'c', estimate: 0.6, confidence: 'low' as const },
];
const readinessResult = projectScore({ scale: 'readiness', los: readinessLos, now });
const readinessCenter = (readinessResult.low + readinessResult.high) / 2;
assert(Math.abs(readinessCenter - 56.67) < 0.5, 'projectScore: readiness center ≈ 57 (untouched prior fills the null)');
assert(
  Math.abs(readinessResult.high - readinessResult.low - 30) < 0.01,
  'projectScore: readiness band ±15 (width 30) at low confidence',
);
assert(readinessResult.basis === 'mastery-only', 'projectScore: mastery-only basis with no mock anchors');

// high confidence narrows the band toward bandHalfWidth * highConfidenceScale
const highConfResult = projectScore({
  scale: 'readiness',
  los: readinessLos.map((l) => ({ ...l, confidence: 'high' as const })),
  now,
});
assert(
  Math.abs(highConfResult.high - highConfResult.low - 15) < 0.01,
  'projectScore: readiness band halves (±7.5) at high confidence (×highConfidenceScale 0.5)',
);

// mock-anchored blend moves the center toward the anchor
const noMockCenter = readinessCenter;
const withMock = projectScore({ scale: 'readiness', los: readinessLos, mockAnchors: [{ composite: 95, at: now }], now });
const withMockCenter = (withMock.low + withMock.high) / 2;
assert(withMock.basis === 'mock-anchored', 'projectScore: basis flips to mock-anchored with a mock anchor present');
assert(
  withMockCenter > noMockCenter && Math.abs(withMockCenter - 95) < Math.abs(noMockCenter - 95),
  'projectScore: mock-anchored blend moves the center toward the anchor',
);

// mapLoIdsToSections: mock-evidenced LOs keep their real section; unmapped LOs spread across the rest
const sectionMap = mapLoIdsToSections(
  ['lo1', 'lo2', 'lo3'],
  [{ loId: 'lo1', sectionId: 'rw', occurredAt: now }],
  ['rw', 'math'],
);
assert(sectionMap.get('lo1') === 'rw', 'mapLoIdsToSections: mock-evidenced LO keeps its observed section');
assert(
  sectionMap.get('lo2') !== undefined && sectionMap.get('lo3') !== undefined,
  'mapLoIdsToSections: unmapped LOs get spread across the known sections, not dropped',
);

// scaled projection (digital-SAT-shaped curves): composite sums sections, clamps to compositeMin/Max
const SAT_CURVES: ScoringSpec = {
  kind: 'scaled-sections',
  sectionScaledMin: 200,
  sectionScaledMax: 800,
  compositeMin: 400,
  compositeMax: 1600,
  curves: {
    rw: { default: [[0, 200], [54, 800]] },
    math: { default: [[0, 200], [44, 800]] },
  },
};
const satResult = projectScore({
  scale: 'sat',
  los: [
    { loId: 'lo1', estimate: 0.9, confidence: 'high' as const, sectionId: sectionMap.get('lo1') },
    { loId: 'lo2', estimate: 0.9, confidence: 'high' as const, sectionId: sectionMap.get('lo2') },
    { loId: 'lo3', estimate: 0.9, confidence: 'high' as const, sectionId: sectionMap.get('lo3') },
  ],
  curves: SAT_CURVES,
  now,
});
assert(
  satResult.low >= SAT_CURVES.compositeMin && satResult.high <= SAT_CURVES.compositeMax,
  'projectScore: scaled band clamps to curves.compositeMin/Max',
);
assert(
  Math.abs(satResult.high - satResult.low - 80) < 0.01,
  'projectScore: scaled band width = bandHalfWidth.sat × 2 × highConfidenceScale (80) at high confidence',
);

// Fix round (code review) — real DIGITAL_SAT_BLUEPRINT: rw/math curves carry
// ONLY 'easy'/'hard' (no 'default'). A strong student must select the 'hard'
// curve (composite can clear ~1300, the easy curve's max), a weak student
// must stay on 'easy'.
{
  const realSat = getBlueprint('digital-sat');
  const strong = projectScore({
    scale: 'sat',
    los: [
      { loId: 'rw1', estimate: 0.9, confidence: 'high', sectionId: 'rw' },
      { loId: 'math1', estimate: 0.9, confidence: 'high', sectionId: 'math' },
    ],
    curves: realSat.scoring,
    now,
  });
  const strongCenter = (strong.low + strong.high) / 2;
  assert(
    strongCenter > 1300,
    'projectScore: real digital-SAT, strong student (0.9) selects the hard curve — composite center > 1300',
  );

  const weak = projectScore({
    scale: 'sat',
    los: [
      { loId: 'rw1', estimate: 0.2, confidence: 'high', sectionId: 'rw' },
      { loId: 'math1', estimate: 0.2, confidence: 'high', sectionId: 'math' },
    ],
    curves: realSat.scoring,
    now,
  });
  const weakCenter = (weak.low + weak.high) / 2;
  assert(
    weakCenter <= 1300,
    'projectScore: real digital-SAT, weak student (0.2) stays on the easy curve (well under 1300)',
  );
}

// Fix round (code review) — real ACT_BLUEPRINT: science is inComposite:false.
// A weak science LO must never move the composite center.
{
  const realAct = getBlueprint('act');
  const sectionInComposite = Object.fromEntries(realAct.sections.map((s) => [s.sectionId, s.inComposite !== false]));
  const coreLos = [
    { loId: 'e1', estimate: 0.8, confidence: 'high' as const, sectionId: 'english' },
    { loId: 'm1', estimate: 0.8, confidence: 'high' as const, sectionId: 'math' },
    { loId: 'r1', estimate: 0.8, confidence: 'high' as const, sectionId: 'reading' },
  ];
  const withoutScience = projectScore({ scale: 'act', los: coreLos, curves: realAct.scoring, sectionInComposite, now });
  const withWeakScience = projectScore({
    scale: 'act',
    los: [...coreLos, { loId: 'sci1', estimate: 0.05, confidence: 'high', sectionId: 'science' }],
    curves: realAct.scoring,
    sectionInComposite,
    now,
  });
  const centerWithout = (withoutScience.low + withoutScience.high) / 2;
  const centerWithWeak = (withWeakScience.low + withWeakScience.high) / 2;
  assert(
    Math.abs(centerWithout - centerWithWeak) < 0.01,
    'projectScore: real ACT, a weak science LO never moves the composite (science is inComposite:false)',
  );
}

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
      evidence: [{ loId: 'lo1', outcome: 1, source: 'practice', itemId: 'i1', hintUsed: true }],
    };
    await deleteLearnerModelData(studentId);
    try {
      await emitSessionResult(emitReq, { partnerId: 'lmtest-partner-emit' });

      const landed = await waitFor(async () => !!(await EvidenceEventModel.findById(`emit:${sessionId}:0`)));
      assert(landed, 'emitSessionResult: evidence[] produces a row keyed emit:<sid>:0');
      const row = await EvidenceEventModel.findById(`emit:${sessionId}:0`);
      assert(
        !!row && row.source === 'practice' && row.outcome === 1 && row.itemId === 'i1' && row.loId === 'lo1',
        'emitSessionResult: evidence row carries loId/source/outcome/itemId from evidence[0]',
      );
      assert(row?.hintUsed === true, 'emitSessionResult: hintUsed (M2) threaded from the contract evidence item');
      assert(
        row?.partnerId === 'lmtest-partner-emit',
        'emitSessionResult: partnerId (M3, opts.partnerId) threaded onto the evidence row',
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

      // C1 fix: submitAssessment's internal emitSessionResult call must NOT
      // ALSO synthesize a masteryDeltas-fallback `emit:<sid>:lo:<loId>` row
      // on top of the two `diag:` rows already asserted above (that used to
      // double-count the same outcome — a 50% quiz measured as estimate 0.6,
      // not 0.5). Give any (wrongly) fired fallback append time to settle
      // (mirrors the replay-guard wait above), then count ALL rows for this
      // student: must be exactly 2 (diag:qa, diag:qb — nothing else).
      await new Promise((r) => setTimeout(r, 200));
      const totalRows = await EvidenceEventModel.countDocuments({ studentId });
      assert(
        totalRows === 2,
        'submitAssessment: exactly 2 evidence rows total (diag: only) — C1 fix, no spurious emit: fallback row',
      );
      assert(rowA?.partnerId === undefined, 'submitAssessment: partnerId omitted when the caller passes none');
    } finally {
      await deleteLearnerModelData(studentId);
    }
  }

  // --- (b) submitAssessment: partnerId (M3) — threaded onto every diag: row ---
  {
    const studentId = `lmtest:diagpartner:${process.pid}`;
    const sessionId = `lmtest-diagpartner-session-${process.pid}`;
    const resolver = async (id: string) =>
      id === 'qa' ? ({ responseFormat: 'numeric' as const, expectedAnswer: '5' }) : null;
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
          assessmentId: 'lmtest-asmt-partner',
          studentId,
          courseId: 'ap-statistics',
          sessionId,
          responses: [{ itemId: 'qa', loId: 'lmtest.lo-partner', response: { text: '5' } }],
        },
        deps,
        resolver,
        'lmtest-partner-a',
      );
      const landed = await waitFor(async () => !!(await EvidenceEventModel.findById(`diag:${sessionId}:qa`)));
      assert(landed, 'submitAssessment (partnerId): evidence row lands');
      const row = await EvidenceEventModel.findById(`diag:${sessionId}:qa`);
      assert(row?.partnerId === 'lmtest-partner-a', 'submitAssessment: partnerId (M3) threaded onto the diag: row');
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
      assert(
        mcqRow?.partnerId === 'lmtest',
        "mock: partnerId (M3) derived from the studentId convention ('lmtest:mock:<pid>' -> 'lmtest')",
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

      // I4 fix: finalizeOpenModule's evidence append is now fire-and-forget
      // (was awaited inline on the student's finalize request) — poll for
      // the rows to land instead of reading them synchronously right after
      // advance() returns.
      const rowsLanded = await waitFor(
        async () =>
          !!(await EvidenceEventModel.findById(`mock:${attemptId}:mo-1`)) &&
          !!(await EvidenceEventModel.findById(`mock:${attemptId}:mo-2`)),
      );
      assert(rowsLanded, 'MCQ-only: fire-and-forget evidence rows land (I4)');
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

/* ------------------------------------------------------------------ */
/* learner-state route — signed GET/POST (Task 9)                     */
/* ------------------------------------------------------------------ */

async function runLearnerStateRouteTests() {
  if (!process.env.MONGODB_URI) {
    console.log('\n(skip Task 9 learner-state route tests — no MONGODB_URI)');
    return;
  }

  process.env.PORTAL_PARTNER_SECRETS = process.env.PORTAL_PARTNER_SECRETS ?? JSON.stringify({ portalA: 'secret-a' });
  const { signPortalRequest } = await import('@evelyn/portal-contract/auth');
  const { LearnerStateResponseSchema } = await import('@evelyn/portal-contract/v1');
  const { GET: learnerStateGET, POST: learnerStatePOST } = await import(
    '../src/app/api/portal/v1/learner-state/route'
  );
  const { LearnerStateProjectionModel, LearnerStateSnapshotModel, buildLearnerStateProjectionId } = await import(
    '../src/models'
  );
  const { deleteLearnerModelData } = await import('../src/lib/tutor/learner-model/store');
  const { default: connectDB } = await import('../src/lib/db');
  const { NextRequest } = await import('next/server');

  await connectDB();

  const SECRET = 'secret-a';
  const PARTNER = 'portalA';
  function signed(method: string, pathWithQuery: string, bodyObj?: unknown) {
    const body = bodyObj === undefined ? '' : JSON.stringify(bodyObj);
    const timestamp = String(Date.now());
    const sig = signPortalRequest(SECRET, { method, path: pathWithQuery, timestamp, body });
    const init: RequestInit = {
      method,
      headers: { 'x-evelyn-partner': PARTNER, 'x-evelyn-timestamp': timestamp, 'x-evelyn-signature': sig },
    };
    if (method !== 'GET' && body) init.body = body;
    return new Request(`https://engine.test${pathWithQuery}`, init) as unknown as InstanceType<typeof NextRequest>;
  }
  async function call(
    h: (r: InstanceType<typeof NextRequest>, c: unknown) => Promise<Response>,
    req: InstanceType<typeof NextRequest>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<{ status: number; json: any }> {
    const res = await h(req, undefined);
    return { status: res.status, json: await res.json() };
  }

  console.log('\nlearner-state route (Task 9):\n');

  const studentId = `lmtest:route:${process.pid}`;
  const loA = 'lmtest.route.lo-a';
  const loB = 'lmtest.route.lo-b';

  await deleteLearnerModelData(studentId);
  try {
    const wallClock = new Date();
    await LearnerStateProjectionModel.create({
      _id: buildLearnerStateProjectionId(studentId, loA),
      studentId,
      loId: loA,
      estimate: 0.82,
      confidence: 'high',
      trend: 'flat',
      nEff: 8,
      reviewDueAt: new Date(wallClock.getTime() - 60_000), // already past due
      lastEvidenceAt: wallClock,
    });
    await LearnerStateProjectionModel.create({
      _id: buildLearnerStateProjectionId(studentId, loB),
      studentId,
      loId: loB,
      estimate: 0.4,
      confidence: 'low',
      trend: 'flat',
      nEff: 1,
      lastEvidenceAt: wallClock,
    });
    // 20-day-old snapshot (>= 14 days ago) with a lower prior for loA → trend 'up'.
    await LearnerStateSnapshotModel.create({
      studentId,
      date: new Date(wallClock.getTime() - 20 * 86400000).toISOString().slice(0, 10),
      los: [{ loId: loA, estimate: 0.5 }],
    });

    const { status, json } = await call(
      learnerStateGET,
      signed('GET', `/api/portal/v1/learner-state?studentId=${studentId}`),
    );
    assert(status === 200, 'learner-state GET: seeded student → 200');
    assert(
      LearnerStateResponseSchema.safeParse(json).success,
      'learner-state GET: response validates against contract LearnerStateResponseSchema',
    );
    assert(json.los.length === 2, 'learner-state GET: no loIds → los list = all projections for the student');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loAOut = json.los.find((l: any) => l.loId === loA);
    assert(
      !!loAOut && loAOut.trend === 'up',
      "learner-state GET: trend 'up' vs the ≥14-day-old snapshot (0.82 now vs 0.5 then)",
    );
    assert(json.reviewDueCount === 1, 'learner-state GET: reviewDueCount counts only the past-due projection');

    const { status: postStatus, json: postJson } = await call(
      learnerStatePOST,
      signed('POST', '/api/portal/v1/learner-state', { studentId, loIds: [loA, 'lmtest.route.never-seen'] }),
    );
    assert(postStatus === 200, 'learner-state POST: body-parsed request → 200');
    assert(
      LearnerStateResponseSchema.safeParse(postJson).success,
      'learner-state POST: response validates against contract LearnerStateResponseSchema',
    );
    assert(
      postJson.los.length === 2 &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        postJson.los.some((l: any) => l.loId === loA && l.estimate === 0.82) &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        postJson.los.some((l: any) => l.loId === 'lmtest.route.never-seen' && l.estimate === null),
      'learner-state POST: loIds filter returns one entry per requested LO (null estimate for no-evidence LOs)',
    );
  } finally {
    await deleteLearnerModelData(studentId);
  }

  // Fix round (code review) — AP-path coverage: courseTopic='ap-statistics'
  // resolves scale 'ap' via the real AP blueprint (examKey === courseTopic).
  {
    const apStudentId = `lmtest:route:ap:${process.pid}`;
    const apLo = 'lmtest.route.ap-lo';
    await deleteLearnerModelData(apStudentId);
    try {
      await LearnerStateProjectionModel.create({
        _id: buildLearnerStateProjectionId(apStudentId, apLo),
        studentId: apStudentId,
        loId: apLo,
        estimate: 0.7,
        confidence: 'medium',
        trend: 'flat',
        nEff: 3,
        lastEvidenceAt: new Date(),
      });
      const { status, json } = await call(
        learnerStateGET,
        signed('GET', `/api/portal/v1/learner-state?studentId=${apStudentId}&courseTopic=ap-statistics`),
      );
      assert(status === 200, 'learner-state GET: AP courseTopic → 200');
      assert(
        LearnerStateResponseSchema.safeParse(json).success,
        'learner-state GET: AP courseTopic → response validates against contract LearnerStateResponseSchema',
      );
      assert(
        !!json.projection && json.projection.scale === 'ap',
        "learner-state GET: courseTopic 'ap-statistics' resolves projection.scale === 'ap' (examKey === courseTopic)",
      );
      assert(
        json.projection.low >= 1 && json.projection.high <= 5,
        'learner-state GET: AP projection band clamps to the real AP blueprint compositeMin/Max (1-5)',
      );
    } finally {
      await deleteLearnerModelData(apStudentId);
    }
  }

  {
    const { status, json } = await call(
      learnerStateGET,
      signed('GET', `/api/portal/v1/learner-state?studentId=lmtest:route:unknown:${process.pid}`),
    );
    assert(status === 200, 'learner-state GET: unknown student → 200, never 404');
    assert(
      json.los.length === 0 && json.reviewDueCount === 0,
      'learner-state GET: unknown student → los: [], reviewDueCount: 0',
    );
  }

  {
    const { status, json } = await call(
      learnerStateGET,
      signed('GET', `/api/portal/v1/learner-state?studentId=trial:lmtest:${process.pid}`),
    );
    assert(status === 200, 'learner-state GET: trial: student → 200');
    assert(
      json.los.length === 0 && json.reviewDueCount === 0,
      'learner-state GET: trial: student → los: [] explicit (never persisted, never queried)',
    );
  }

  {
    const { status } = await call(learnerStateGET, unsignedRequest(`/api/portal/v1/learner-state?studentId=x`));
    assert(status === 401, 'learner-state GET: unsigned request → 401');
  }

  function unsignedRequest(pathWithQuery: string) {
    return new Request(`https://engine.test${pathWithQuery}`, { method: 'GET' }) as unknown as InstanceType<
      typeof NextRequest
    >;
  }
}

/* ------------------------------------------------------------------ */
/* student-profile commit route — segmentOutcomes evidence (Task 11)   */
/* ------------------------------------------------------------------ */

async function runStudentProfileSegmentOutcomesTests() {
  if (!process.env.MONGODB_URI) {
    console.log('\n(skip Task 11 student-profile segmentOutcomes tests — no MONGODB_URI)');
    return;
  }

  const { POST: profilePOST } = await import('../src/app/api/tutor/student-profile/[id]/route');
  const { EvidenceEventModel } = await import('../src/models');
  const { deleteLearnerModelData } = await import('../src/lib/tutor/learner-model/store');
  const { default: connectDB } = await import('../src/lib/db');
  const { NextRequest } = await import('next/server');

  await connectDB();

  console.log('\nstudent-profile commit route — segmentOutcomes evidence (Task 11):\n');

  function req(bodyObj: unknown): InstanceType<typeof NextRequest> {
    return new Request('https://engine.test/api/tutor/student-profile/x', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyObj),
    }) as unknown as InstanceType<typeof NextRequest>;
  }
  function ctx(id: string) {
    return { params: Promise.resolve({ id }) };
  }

  const studentId = `lmtest:segout:${process.pid}`;
  const sessionId = `lmtest-segout-session-${process.pid}`;
  const loA = 'lmtest.segout.lo-a';
  const loB = 'lmtest.segout.lo-b';

  await deleteLearnerModelData(studentId);
  try {
    // Review ruling: only EVALUATIVE kinds (try_yourself / misconception_check)
    // carry an outcome — hook/concept/etc. are exposure, not assessment.
    // outcome is computed client-side (1 = streak-confirmed, 0.5 =
    // attempted-not-clearly-mastered), never hardcoded server-side.
    const body = {
      sessionId,
      subject: 'math',
      segmentOutcomes: [
        { segmentId: 'seg-a', loId: loA, kind: 'try_yourself', completed: true, outcome: 1, streakAtComplete: 2, turns: 3 },
        { segmentId: 'seg-b', loId: loB, kind: 'misconception_check', completed: true, outcome: 0.5, turns: 1 },
      ],
    };

    const res = await profilePOST(req(body), ctx(studentId));
    assert(res.status === 200, 'student-profile POST: commit body with 2 evaluative segmentOutcomes → 200');

    const landed = await waitFor(async () => (await EvidenceEventModel.countDocuments({ studentId })) === 2);
    assert(landed, 'student-profile POST: 2 evaluative segmentOutcomes → 2 evidence rows');

    const rowA = await EvidenceEventModel.findById(`sess:${sessionId}:seg-a`);
    assert(
      !!rowA && rowA.loId === loA && rowA.source === 'session' && rowA.outcome === 1
        && rowA.streakAtComplete === 2 && rowA.turns === 3 && rowA.subject === 'math'
        && rowA.sessionId === sessionId,
      'student-profile POST: evidence row keyed sess:<sessionId>:<segmentId>, carries loId/source/outcome (1)/streak/turns/subject',
    );
    const rowB = await EvidenceEventModel.findById(`sess:${sessionId}:seg-b`);
    assert(
      !!rowB && rowB.loId === loB && rowB.outcome === 0.5 && rowB.turns === 1 && rowB.streakAtComplete === undefined,
      'student-profile POST: second segment evidence row present with outcome 0.5, optional streakAtComplete omitted when absent',
    );

    // Replayed flush — same sessionId + same 2 segmentOutcomes (the client
    // re-sends the whole increment on a debounce/keepalive retry). The
    // idempotency key collides with the rows already written → still
    // exactly 2 rows, never 4.
    const res2 = await profilePOST(req(body), ctx(studentId));
    assert(res2.status === 200, 'student-profile POST: replayed commit → 200');
    await new Promise((r) => setTimeout(r, 300)); // let any (wrongly) fired append settle
    const countAfterReplay = await EvidenceEventModel.countDocuments({ studentId });
    assert(countAfterReplay === 2, 'student-profile POST: replayed flush produces no duplicate evidence rows');
  } finally {
    await deleteLearnerModelData(studentId);
  }

  // Malformed / invalid entries (client-supplied, defensively validated):
  // missing segmentId, missing loId, completed: false, a non-evaluative
  // kind (defense-in-depth — the server drops it even though the client is
  // supposed to filter these out itself), an out-of-range outcome, a
  // non-numeric outcome, and non-object entries are all skipped — only the
  // one well-formed entry produces a row.
  {
    const studentId2 = `lmtest:segout:malformed:${process.pid}`;
    const sessionId2 = `lmtest-segout-malformed-session-${process.pid}`;
    await deleteLearnerModelData(studentId2);
    try {
      const malformedBody = {
        sessionId: sessionId2,
        segmentOutcomes: [
          { segmentId: 'ok-seg', loId: 'lmtest.segout.ok', kind: 'try_yourself', completed: true, outcome: 1 },
          { segmentId: '', loId: 'lmtest.segout.bad1', kind: 'try_yourself', completed: true, outcome: 1 },
          { segmentId: 'bad2', loId: '', kind: 'try_yourself', completed: true, outcome: 1 },
          { segmentId: 'bad3', loId: 'lmtest.segout.bad3', kind: 'try_yourself', completed: false, outcome: 1 },
          { segmentId: 'bad4', loId: 'lmtest.segout.bad4', kind: 'concept', completed: true, outcome: 1 },
          { segmentId: 'bad5', loId: 'lmtest.segout.bad5', kind: 'try_yourself', completed: true, outcome: 1.5 },
          { segmentId: 'bad6', loId: 'lmtest.segout.bad6', kind: 'try_yourself', completed: true, outcome: 'yes' },
          null,
          'not-an-object',
        ],
      };
      const res3 = await profilePOST(req(malformedBody), ctx(studentId2));
      assert(res3.status === 200, 'student-profile POST: mixed valid/malformed/non-evaluative segmentOutcomes → 200');
      const landed2 = await waitFor(
        async () => (await EvidenceEventModel.countDocuments({ studentId: studentId2 })) === 1,
      );
      assert(landed2, 'student-profile POST: malformed + non-evaluative + out-of-range entries skipped — only the valid entry produces a row');
      const okRow = await EvidenceEventModel.findById(`sess:${sessionId2}:ok-seg`);
      assert(!!okRow, 'student-profile POST: the surviving row is keyed by the well-formed entry\'s segmentId');
    } finally {
      await deleteLearnerModelData(studentId2);
    }
  }
}

/* ------------------------------------------------------------------ */
/* runLearnerSnapshot — DB-backed (Task 10)                            */
/* ------------------------------------------------------------------ */

async function runLearnerSnapshotTests() {
  if (!process.env.MONGODB_URI) {
    console.log('\n(skip Task 10 runLearnerSnapshot tests — no MONGODB_URI)');
    return;
  }

  const { runLearnerSnapshot } = await import('../src/lib/tutor/learner-model/snapshot-job');
  const { LearnerStateProjectionModel, LearnerStateSnapshotModel, buildLearnerStateProjectionId } = await import(
    '../src/models'
  );
  const { deleteLearnerModelData } = await import('../src/lib/tutor/learner-model/store');
  const { default: connectDB } = await import('../src/lib/db');

  await connectDB();

  console.log('\nrunLearnerSnapshot (Task 10):\n');

  const studentId = `lmtest:snap:${process.pid}`;
  const trialStudentId = `trial:lmtest:snap:${process.pid}`;
  const loA = 'lmtest.snap.lo-a';
  const loB = 'lmtest.snap.lo-b';
  const loNull = 'lmtest.snap.lo-null';
  const now = new Date('2026-08-10T12:00:00Z');

  async function cleanupAll() {
    await deleteLearnerModelData(studentId);
    await deleteLearnerModelData(trialStudentId);
  }

  await cleanupAll();
  try {
    await LearnerStateProjectionModel.create({
      _id: buildLearnerStateProjectionId(studentId, loA),
      studentId,
      loId: loA,
      estimate: 0.7,
      confidence: 'high',
      trend: 'flat',
      nEff: 8,
      lastEvidenceAt: now,
    });
    await LearnerStateProjectionModel.create({
      _id: buildLearnerStateProjectionId(studentId, loB),
      studentId,
      loId: loB,
      estimate: 0.3,
      confidence: 'low',
      trend: 'flat',
      nEff: 1,
      lastEvidenceAt: now,
    });
    // Inserted below the Mongoose schema (which types estimate as required
    // number) to exercise the runtime "skip null estimates" rule the brief
    // calls out — a row landing in this shape shouldn't be reachable via
    // recomputeProjection (it bails before upserting on a null estimate),
    // but the snapshot job defends against it anyway.
    await LearnerStateProjectionModel.collection.insertOne({
      _id: buildLearnerStateProjectionId(studentId, loNull) as unknown as string,
      studentId,
      loId: loNull,
      estimate: null,
      confidence: 'low',
      trend: 'flat',
      nEff: 0,
      lastEvidenceAt: now,
      updatedAt: now,
      schemaVersion: 1,
    } as never);
    // trial: student — must never get a snapshot row.
    await LearnerStateProjectionModel.create({
      _id: buildLearnerStateProjectionId(trialStudentId, loA),
      studentId: trialStudentId,
      loId: loA,
      estimate: 0.5,
      confidence: 'low',
      trend: 'flat',
      nEff: 1,
      lastEvidenceAt: now,
    });

    const stats = await runLearnerSnapshot(now);
    assert(stats.studentsSnapshotted >= 1 && stats.errors === 0, 'runLearnerSnapshot: completes with no errors');

    const snap = await LearnerStateSnapshotModel.findOne({ studentId, date: '2026-08-10' }).lean();
    assert(!!snap, "runLearnerSnapshot: writes one LearnerStateSnapshot dated 'YYYY-MM-DD' of `now` (UTC)");
    assert(
      snap!.los.length === 2 &&
        snap!.los.some((l) => l.loId === loA && l.estimate === 0.7) &&
        snap!.los.some((l) => l.loId === loB && l.estimate === 0.3),
      'runLearnerSnapshot: los = [{loId, estimate}] from the projections, null estimate skipped',
    );

    const trialSnap = await LearnerStateSnapshotModel.findOne({ studentId: trialStudentId }).lean();
    assert(!trialSnap, "runLearnerSnapshot: 'trial:' students are skipped — no snapshot row");

    // Second run same day → upsert, not a duplicate.
    await runLearnerSnapshot(now);
    const countSameDay = await LearnerStateSnapshotModel.countDocuments({ studentId, date: '2026-08-10' });
    assert(countSameDay === 1, 'runLearnerSnapshot: second run same day upserts (no duplicate doc)');

    // Update a projection and re-run same day → the existing doc's los reflect the latest state.
    await LearnerStateProjectionModel.updateOne(
      { _id: buildLearnerStateProjectionId(studentId, loA) },
      { $set: { estimate: 0.9 } },
    );
    await runLearnerSnapshot(now);
    const updatedSnap = await LearnerStateSnapshotModel.findOne({ studentId, date: '2026-08-10' }).lean();
    assert(
      updatedSnap!.los.some((l) => l.loId === loA && l.estimate === 0.9),
      'runLearnerSnapshot: same-day re-run overwrites the doc with the latest estimates',
    );
  } finally {
    await cleanupAll();
  }
}

/* ------------------------------------------------------------------ */
/* student-erase route — signed POST (Task 10)                        */
/* ------------------------------------------------------------------ */

async function runStudentEraseRouteTests() {
  if (!process.env.MONGODB_URI) {
    console.log('\n(skip Task 10 student-erase route tests — no MONGODB_URI)');
    return;
  }

  process.env.PORTAL_PARTNER_SECRETS = process.env.PORTAL_PARTNER_SECRETS ?? JSON.stringify({ portalA: 'secret-a' });
  const { signPortalRequest } = await import('@evelyn/portal-contract/auth');
  const { StudentEraseResponseSchema } = await import('@evelyn/portal-contract/v1');
  const { POST: eraseRoutePOST } = await import('../src/app/api/portal/v1/student-erase/route');
  const { EvidenceEventModel, LearnerStateProjectionModel, LearnerStateSnapshotModel } = await import(
    '../src/models'
  );
  const { appendEvidence, deleteLearnerModelData } = await import('../src/lib/tutor/learner-model/store');
  const { default: connectDB } = await import('../src/lib/db');
  const { NextRequest } = await import('next/server');

  await connectDB();

  const SECRET = 'secret-a';
  const PARTNER = 'portalA';
  function signed(method: string, pathWithQuery: string, bodyObj?: unknown) {
    const body = bodyObj === undefined ? '' : JSON.stringify(bodyObj);
    const timestamp = String(Date.now());
    const sig = signPortalRequest(SECRET, { method, path: pathWithQuery, timestamp, body });
    const init: RequestInit = {
      method,
      headers: { 'x-evelyn-partner': PARTNER, 'x-evelyn-timestamp': timestamp, 'x-evelyn-signature': sig },
    };
    if (method !== 'GET' && body) init.body = body;
    return new Request(`https://engine.test${pathWithQuery}`, init) as unknown as InstanceType<typeof NextRequest>;
  }
  function unsignedRequest(pathWithQuery: string) {
    return new Request(`https://engine.test${pathWithQuery}`, { method: 'POST' }) as unknown as InstanceType<
      typeof NextRequest
    >;
  }
  async function call(
    h: (r: InstanceType<typeof NextRequest>, c: unknown) => Promise<Response>,
    req: InstanceType<typeof NextRequest>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<{ status: number; json: any }> {
    const res = await h(req, undefined);
    return { status: res.status, json: await res.json() };
  }

  console.log('\nstudent-erase route (Task 10):\n');

  const studentId = `lmtest:erase:${process.pid}`;
  const loId = 'lmtest.erase.lo-a';

  await deleteLearnerModelData(studentId);
  try {
    const wallClock = new Date();
    await appendEvidence([
      {
        studentId,
        loId,
        source: 'practice',
        occurredAt: wallClock,
        outcome: 1,
        idempotencyKey: `${studentId}:${loId}:1`,
      },
    ]);
    await LearnerStateSnapshotModel.create({ studentId, date: '2026-08-01', los: [{ loId, estimate: 0.5 }] });

    const { status, json } = await call(
      eraseRoutePOST,
      signed('POST', '/api/portal/v1/student-erase', { studentId }),
    );
    assert(status === 200, 'student-erase POST: seeded student → 200');
    assert(
      StudentEraseResponseSchema.safeParse(json).success,
      'student-erase POST: response validates against contract StudentEraseResponseSchema',
    );
    assert(json.ok === true, 'student-erase POST: ok: true');
    assert(
      json.deleted.evidenceEvents === 1 &&
        json.deleted.learnerStateProjections === 1 &&
        json.deleted.learnerStateSnapshots === 1,
      'student-erase POST: deleted counts reflect what was actually removed',
    );

    const remainingEvents = await EvidenceEventModel.countDocuments({ studentId });
    const remainingProjections = await LearnerStateProjectionModel.countDocuments({ studentId });
    const remainingSnapshots = await LearnerStateSnapshotModel.countDocuments({ studentId });
    assert(
      remainingEvents === 0 && remainingProjections === 0 && remainingSnapshots === 0,
      'student-erase POST: data is actually gone from the DB, not just reported gone',
    );
  } finally {
    await deleteLearnerModelData(studentId);
  }

  // trial: id — still calls the helper (harmless zero counts), not a 4xx branch.
  {
    const trialStudentId = `trial:lmtest:erase:${process.pid}`;
    const { status, json } = await call(
      eraseRoutePOST,
      signed('POST', '/api/portal/v1/student-erase', { studentId: trialStudentId }),
    );
    assert(status === 200, "student-erase POST: 'trial:' studentId → 200 (not special-cased to an error)");
    assert(
      json.ok === true &&
        Object.values(json.deleted as Record<string, number>).every((n) => n === 0),
      "student-erase POST: 'trial:' studentId → harmless all-zero deleted counts",
    );
  }

  {
    const { status } = await call(
      eraseRoutePOST,
      unsignedRequest('/api/portal/v1/student-erase'),
    );
    assert(status === 401, 'student-erase POST: unsigned request → 401');
  }
}

/* ------------------------------------------------------------------ */
/* Evidence backfill — portal JSONL + MockAttempt + priors (Task 12)  */
/* ------------------------------------------------------------------ */

async function runBackfillEvidenceTests() {
  if (!process.env.MONGODB_URI) {
    console.log('\n(skip Task 12 backfill-evidence tests — no MONGODB_URI)');
    return;
  }

  const { EvidenceEventModel } = await import('../src/models');
  const { appendEvidence, deleteLearnerModelData } = await import('../src/lib/tutor/learner-model/store');
  const { default: connectDB } = await import('../src/lib/db');
  const { MockAttempt } = await import('../src/models/MockAttempt');
  const { StudentProfileModel } = await import('../src/models/StudentProfile');
  const {
    runBackfill,
    parseJsonlEvidence,
    buildMockEvidence,
    liveMockAttemptIdsFrom,
    buildDiagnosticPriorEvidence,
  } = await import('../scripts/backfill-evidence');
  const fs = await import('node:fs');
  const os = await import('node:os');
  const path = await import('node:path');

  await connectDB();

  console.log('\nbackfill-evidence — portal JSONL + MockAttempt + priors (Task 12):\n');

  const studentId = `lmtest:bf:${process.pid}`;
  const attemptId = `lmtest-bf-attempt-${process.pid}`;
  const attemptIdLive = `lmtest-bf-attempt-live-${process.pid}`;
  const LO_MOCK = 'lmtest.bf.lo-mock';
  const LO_LIVE = 'lmtest.bf.lo-live';
  const LO_PRIOR = 'lmtest.bf.lo-prior';
  const LO_QUIZ = 'lmtest.bf.lo-quiz';
  const LO_PRACTICE = 'lmtest.bf.lo-practice';

  const jsonlPath = path.join(os.tmpdir(), `lmtest-bf-${process.pid}.jsonl`);
  const jsonlRows = [
    {
      idempotencyKey: `bf:quiz:lmtest-q-${process.pid}:0:i1`,
      studentId,
      loId: LO_QUIZ,
      source: 'assessment',
      itemId: 'i1',
      outcome: 1,
      pointsAwarded: 1,
      maxPoints: 1,
      occurredAt: '2026-01-01T00:00:00.000Z',
    },
    {
      idempotencyKey: `bf:practice:lmtest-p-${process.pid}:0:i2`,
      studentId,
      loId: LO_PRACTICE,
      source: 'practice',
      itemId: 'i2',
      outcome: 0,
      pointsAwarded: 0,
      maxPoints: 1,
      occurredAt: '2026-01-02T00:00:00.000Z',
    },
  ];

  async function cleanup() {
    await deleteLearnerModelData(studentId);
    await MockAttempt.deleteOne({ attemptId });
    await MockAttempt.deleteOne({ attemptId: attemptIdLive });
    await StudentProfileModel.deleteOne({ _id: studentId });
    if (fs.existsSync(jsonlPath)) fs.unlinkSync(jsonlPath);
  }

  await cleanup();
  try {
    // --- pure builders — no DB ---
    const parsed = parseJsonlEvidence(jsonlRows.map((r) => JSON.stringify(r)).join('\n'));
    assert(
      parsed.length === 2 && parsed[0]!.occurredAt instanceof Date,
      'parseJsonlEvidence: parses each JSONL line, occurredAt string → Date',
    );
    const parsedTrial = parseJsonlEvidence(
      JSON.stringify({ ...jsonlRows[0], studentId: 'trial:x', idempotencyKey: 'bf:quiz:trial:0:i1' }),
    );
    assert(parsedTrial.length === 0, "parseJsonlEvidence: drops 'trial:' studentId rows");

    // buildMockEvidence's MockAttemptLike no longer even has a `frqGrades`
    // field (review finding #1: report.ts's gradeAndComplete already folds
    // graded FRQ points into loBreakdown at grading time, so a separate
    // frqGrades pass would double-represent the same signal at the 'mock'
    // source weight) — the exclusion is enforced by the type, not runtime
    // logic; this just locks in the loBreakdown → row shape.
    const mockEv = buildMockEvidence([
      {
        attemptId: 'a1',
        studentId,
        status: 'completed',
        completedAt: new Date('2026-01-03T00:00:00Z'),
        loBreakdown: [{ loId: LO_MOCK, correct: 1, total: 2 }],
      },
      { attemptId: 'a2', studentId, status: 'in_section' }, // not completed → no rows
    ]);
    assert(
      mockEv.length === 1 && mockEv[0]!.idempotencyKey === `bf:mock:a1:lo:${LO_MOCK}`,
      'buildMockEvidence: one row per loBreakdown entry; non-completed attempts produce nothing',
    );
    assert(
      mockEv[0]!.outcome === 0.5 && mockEv[0]!.source === 'mock',
      'buildMockEvidence: loBreakdown row is a correct/total fraction, keyed bf:mock:<id>:lo:<loId>',
    );

    const liveIds = liveMockAttemptIdsFrom([
      `mock:${attemptIdLive}:some-item`,
      `mock:${attemptIdLive}:other-item`,
      `bf:mock:${attemptId}:lo:${LO_MOCK}`, // bf:-prefixed — not a live key, ignored
      'not-a-mock-key',
    ]);
    assert(
      liveIds.size === 1 && liveIds.has(attemptIdLive),
      'liveMockAttemptIdsFrom: extracts the attemptId from live mock:<attemptId>:<itemId> keys only, dedupes multiple items per attempt',
    );

    const priorEv = buildDiagnosticPriorEvidence([
      { _id: studentId, mastery: { [LO_PRIOR]: { score: 0.42, lastTouchedAt: '2026-01-04T00:00:00.000Z' } } },
      { _id: 'trial:someone', mastery: { 'lo.x': { score: 1, lastTouchedAt: '2026-01-01T00:00:00.000Z' } } },
    ]);
    assert(
      priorEv.length === 1 &&
        priorEv[0]!.idempotencyKey === `bf:prior:${studentId}:${LO_PRIOR}` &&
        priorEv[0]!.outcome === 0.42 &&
        priorEv[0]!.source === 'diagnostic',
      "buildDiagnosticPriorEvidence: one row per mastery entry (source 'diagnostic', outcome = score), drops trial: profiles",
    );

    // --- DB-backed: seed real fixtures, dry-run, real run, re-run ---
    fs.writeFileSync(jsonlPath, `${jsonlRows.map((r) => JSON.stringify(r)).join('\n')}\n`);
    await MockAttempt.create({
      attemptId,
      studentId,
      formId: 'lmtest-bf-form',
      examKey: 'lmtest-bf',
      status: 'completed',
      cursor: { sectionIdx: 0, moduleIdx: 0 },
      servedModules: [],
      responses: [],
      moduleRouting: [],
      loBreakdown: [{ loId: LO_MOCK, correct: 1, total: 2 }],
      isRetake: false,
      startedAt: new Date('2026-01-03T00:00:00Z'),
      completedAt: new Date('2026-01-03T00:10:00Z'),
    });
    await StudentProfileModel.create({
      _id: studentId,
      mastery: { [LO_PRIOR]: { loId: LO_PRIOR, score: 0.42, exposures: 3, lastTouchedAt: '2026-01-04T00:00:00.000Z' } },
      gaps: [],
      recentSessions: [],
      preferences: {},
      createdAt: '2026-01-04T00:00:00.000Z',
      updatedAt: '2026-01-04T00:00:00.000Z',
      schemaVersion: 1,
    });

    // Review finding #2: a MockAttempt that already has LIVE per-item mock
    // evidence (Task 8's append points, keyed mock:<attemptId>:<itemId>)
    // must be excluded from the backfill entirely — its loBreakdown would
    // otherwise re-derive the same signal a second time under a bf:-prefixed
    // key the live keys can never dedupe against.
    await MockAttempt.create({
      attemptId: attemptIdLive,
      studentId,
      formId: 'lmtest-bf-form',
      examKey: 'lmtest-bf',
      status: 'completed',
      cursor: { sectionIdx: 0, moduleIdx: 0 },
      servedModules: [],
      responses: [],
      moduleRouting: [],
      loBreakdown: [{ loId: LO_LIVE, correct: 1, total: 1 }],
      isRetake: false,
      startedAt: new Date('2026-01-05T00:00:00Z'),
      completedAt: new Date('2026-01-05T00:10:00Z'),
    });
    await appendEvidence([
      {
        idempotencyKey: `mock:${attemptIdLive}:some-item`,
        studentId,
        loId: LO_LIVE,
        source: 'mock',
        itemId: 'some-item',
        outcome: 1,
        occurredAt: new Date('2026-01-05T00:05:00Z'),
      },
    ]);

    const countBeforeDry = await EvidenceEventModel.countDocuments({ studentId });
    assert(countBeforeDry === 1, 'setup: only the directly-seeded live mock evidence row exists before runBackfill runs');

    // I1 fix: scope to this test's own studentId — an unscoped run walks
    // EVERY MockAttempt + StudentProfile in the configured DB (previously
    // left stray bf: rows for real students in the dev DB when this test
    // ran with dryRun: false against a shared MONGODB_URI).
    const dryCounts = await runBackfill({ jsonlPath, dryRun: true, studentIds: [studentId] });
    assert(
      dryCounts.assessment >= 1 && dryCounts.practice >= 1 && dryCounts.mock >= 1 && dryCounts.diagnostic >= 1,
      'runBackfill dry-run: per-source counts non-zero and include this run\'s fixtures ' +
        '(assessment/practice from jsonl, mock from loBreakdown, diagnostic from the prior)',
    );
    const countAfterDry = await EvidenceEventModel.countDocuments({ studentId });
    assert(countAfterDry === countBeforeDry, 'runBackfill dry-run: writes nothing (evidence count for this student unchanged)');

    await runBackfill({ jsonlPath, dryRun: false, studentIds: [studentId] });
    const EXPECTED_KEYS = [
      jsonlRows[0]!.idempotencyKey,
      jsonlRows[1]!.idempotencyKey,
      `bf:mock:${attemptId}:lo:${LO_MOCK}`,
      `bf:prior:${studentId}:${LO_PRIOR}`,
    ];
    const written = await EvidenceEventModel.find({ _id: { $in: EXPECTED_KEYS } }).lean();
    assert(
      written.length === 4,
      'runBackfill real run: all 4 expected rows land (jsonl quiz + practice, mock loBreakdown, prior)',
    );
    const mockLoRow = written.find((w) => w._id === `bf:mock:${attemptId}:lo:${LO_MOCK}`);
    assert(
      !!mockLoRow && mockLoRow.source === 'mock' && mockLoRow.outcome === 0.5,
      'runBackfill: mock loBreakdown row — source mock, outcome = correct/total',
    );
    const priorRow = written.find((w) => w._id === `bf:prior:${studentId}:${LO_PRIOR}`);
    assert(
      !!priorRow && priorRow.source === 'diagnostic' && priorRow.outcome === 0.42,
      'runBackfill: diagnostic prior row — source diagnostic, outcome = mastery score',
    );

    const excludedRow = await EvidenceEventModel.findById(`bf:mock:${attemptIdLive}:lo:${LO_LIVE}`);
    assert(
      !excludedRow,
      'runBackfill: an attempt with existing live mock evidence is excluded entirely — no bf:mock row for it',
    );
    const liveRowStillThere = await EvidenceEventModel.findById(`mock:${attemptIdLive}:some-item`);
    assert(!!liveRowStillThere, 'runBackfill: the pre-existing live evidence row itself is untouched');
    const countAfterReal = await EvidenceEventModel.countDocuments({ studentId });
    assert(
      countAfterReal === countBeforeDry + written.length,
      'runBackfill real run: total evidence count = 1 pre-existing live row + the 4 newly-backfilled rows (nothing extra for the excluded attempt)',
    );

    const countBeforeRerun = countAfterReal;
    await runBackfill({ jsonlPath, dryRun: false, studentIds: [studentId] });
    const countAfterRerun = await EvidenceEventModel.countDocuments({ studentId });
    assert(
      countBeforeRerun === 5 && countAfterRerun === 5,
      'runBackfill: re-run is idempotent — zero new inserts for this student',
    );
  } finally {
    await cleanup();
  }
}

runDbTests()
  .then(() => runServerAppendPointTests())
  .then(() => runLearnerStateRouteTests())
  .then(() => runStudentProfileSegmentOutcomesTests())
  .then(() => runLearnerSnapshotTests())
  .then(() => runStudentEraseRouteTests())
  .then(() => runBackfillEvidenceTests())
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
