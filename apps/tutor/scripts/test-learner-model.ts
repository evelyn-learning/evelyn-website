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
import { bandForElo } from '../src/lib/tutor/learner-model/hints';
import { projectScore, scaleForTopic, mapLoIdsToSections } from '../src/lib/tutor/learner-model/projection';
import { getBlueprint } from '../src/lib/tutor/mock-exam/blueprints';
import type { ScoringSpec } from '../src/lib/tutor/mock-exam/blueprints';
import type { SessionEmitRequest } from '@evelyn/portal-contract/v1';
import type { GradeDeps } from '@/lib/tutor/portal/grade-free-response';
import type { LearningObjective, Segment } from '@/lib/tutor/lesson-plan/types';
import type { GenerateFromTextInput, ExpandSegmentsResult } from '@/lib/tutor/lesson-plan/generate-from-text';

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
/* learner-hints — ability band + gap topics (Phase C — Task 11)      */
/*                                                                      */
/* NOTE: this file already has an unrelated "(Task 11)" section below   */
/* (student-profile commit-route segmentOutcomes) from an earlier task  */
/* numbering scheme that predates the phase-c slice numbering. Labeled  */
/* "Phase C — Task 11" here to disambiguate.                            */
/* ------------------------------------------------------------------ */

// bandForElo — pure
{
  console.log('\nlearner-hints: bandForElo (Phase C — Task 11):\n');
  assert(bandForElo(null) === 'steady', 'bandForElo(null) → steady');
  assert(
    bandForElo({ rating: 1600, count: 3 }) === 'steady',
    'bandForElo: count below minEloCount (5) → steady even at a strong rating',
  );
  assert(bandForElo({ rating: 1600, count: 10 }) === 'strong', 'bandForElo: rating >= strongRating (1560) → strong');
  assert(bandForElo({ rating: 1400, count: 10 }) === 'building', 'bandForElo: rating <= buildingRating (1440) → building');
  assert(bandForElo({ rating: 1500, count: 10 }) === 'steady', 'bandForElo: rating between thresholds → steady');
}

async function runLearnerHintsTests() {
  if (!process.env.MONGODB_URI) {
    console.log('\n(skip Phase C — Task 11 getLearnerHints tests — no MONGODB_URI)');
    return;
  }

  const { getLearnerHints } = await import('../src/lib/tutor/learner-model/hints');
  const { getOrCreateStudentProfile, saveStudentProfile } = await import('../src/lib/tutor/student-profile/store');
  const { StudentProfileModel } = await import('../src/models/StudentProfile');
  const { deleteLearnerModelData } = await import('../src/lib/tutor/learner-model/store');
  const { default: connectDB } = await import('@core/db');

  await connectDB();

  console.log('\ngetLearnerHints — DB-backed (Phase C — Task 11):\n');

  const studentId = `lmtest:hints:${process.pid}`;

  async function cleanup() {
    await deleteLearnerModelData(studentId);
    await StudentProfileModel.deleteOne({ _id: studentId });
  }

  await cleanup();
  try {
    const nowIso = new Date().toISOString();
    const longObservation = 'x'.repeat(80); // > 60 chars, exercises the fallback slice
    const confirmedWithLabel = {
      id: 'gap_confirmed_label',
      kind: 'prerequisite' as const,
      conceptLabel: 'factoring quadratics',
      status: 'confirmed' as const,
      evidence: { signals: [], observation: 'student struggled with factoring across sessions', studentQuotes: [] },
      firstSeenAt: nowIso,
      lastSeenAt: nowIso,
    };
    const confirmedNoLabel = {
      id: 'gap_confirmed_nolabel',
      kind: 'lo' as const,
      loId: 'lmtest.hints.lo-a',
      status: 'confirmed' as const,
      evidence: { signals: [], observation: longObservation, studentQuotes: [] },
      firstSeenAt: nowIso,
      lastSeenAt: nowIso,
    };
    const candidate = {
      id: 'gap_candidate',
      kind: 'prerequisite' as const,
      conceptLabel: 'should not appear',
      status: 'candidate' as const,
      evidence: { signals: [], observation: 'single observation, not yet confirmed', studentQuotes: [] },
      firstSeenAt: nowIso,
      lastSeenAt: nowIso,
    };
    // Two more confirmed gaps so eligible confirmed count (4) exceeds
    // TUNING.hints.maxGapTopics (3) — exercises the cap.
    const confirmedExtra1 = { ...confirmedWithLabel, id: 'gap_extra1', conceptLabel: 'extra topic 1' };
    const confirmedExtra2 = { ...confirmedWithLabel, id: 'gap_extra2', conceptLabel: 'extra topic 2' };

    const profile = await getOrCreateStudentProfile(studentId);
    await saveStudentProfile({
      ...profile,
      gaps: [confirmedWithLabel, confirmedNoLabel, candidate, confirmedExtra1, confirmedExtra2],
    });

    const hints = await getLearnerHints(studentId);
    assert(hints.band === 'steady', 'getLearnerHints: no Elo evidence for this student → band defaults to steady');
    assert(hints.gapTopics.length === 3, 'getLearnerHints: gapTopics capped at TUNING.hints.maxGapTopics (3 of 4 eligible confirmed gaps)');
    assert(
      hints.gapTopics.every((t) => t !== 'should not appear'),
      'getLearnerHints: candidate-status gap is excluded from gapTopics',
    );
    assert(
      hints.gapTopics.includes(longObservation.slice(0, 60)),
      'getLearnerHints: confirmed gap w/o conceptLabel falls back to observation.slice(0, 60)',
    );
    assert(
      hints.gapTopics.includes('factoring quadratics'),
      'getLearnerHints: confirmed prerequisite gap uses conceptLabel',
    );
  } finally {
    await cleanup();
  }

  // trial:-prefixed studentId → immediate default, no DB reads.
  {
    const trialStudentId = `trial:lmtest:hints:${process.pid}`;
    const hints = await getLearnerHints(trialStudentId);
    assert(
      hints.band === 'steady' && hints.gapTopics.length === 0,
      "getLearnerHints: 'trial:'-prefixed studentId → immediate { band: 'steady', gapTopics: [] }, no DB reads",
    );
  }
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
  const { default: connectDB } = await import('@core/db');

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
  const { deleteLearnerModelData, appendEvidence } = await import('../src/lib/tutor/learner-model/store');
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
      // M1c fix round 2 (IMPORTANT C): EmitOptions.partnerId is now
      // required — same partner as the original emit above.
      await emitSessionResult(emitReq, { partnerId: 'lmtest-partner-emit' });
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
      // M1c fix round 2 (IMPORTANT C): EmitOptions.partnerId is now required.
      await emitSessionResult(emitReq, { partnerId: 'lmtest-partner-emitfb' });

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
        // M1c fix round 4 (coordinator overruled round 3's deliberate
        // omission here): submitAssessment's partnerId is a REQUIRED
        // positional — "the caller passes none" is a compile error in
        // every type-checked caller, so the 3-arg shape this round 3 kept
        // was exercising an illegal call shape, not a supported contract.
        // It also doesn't survive the flip: with the flag on and a real
        // MONGODB_URI, the omitted partnerId hits resolveProfileId's guard
        // and throws ProfileIdentityError, which round 2 made deliberately
        // loud and never-degraded — so this call would fail at exactly the
        // rollout step it exists to guard. The real, legal-shape coverage
        // ("EvidenceInput.partnerId is optional and left unstamped when
        // absent") moved to a direct appendEvidence call — see the
        // dedicated block right after this one.
        'lmtest-partner-1',
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
      assert(
        rowA?.partnerId === 'lmtest-partner-1',
        'submitAssessment: partnerId (M3) threaded onto the diag: row (see the next block for the dedicated partnerId test)',
      );
    } finally {
      await deleteLearnerModelData(studentId);
    }
  }

  // --- (b) appendEvidence: partnerId is OPTIONAL and left unstamped when
  // absent (learner-model/store.ts:33's EvidenceInput.partnerId?: string) ---
  //
  // M1c fix round 4 — this replaces the coverage round 3 kept by leaving a
  // submitAssessment call at 3 args (an illegal shape once partnerId became
  // a required positional there). appendEvidence's own EvidenceInput.partnerId
  // IS still genuinely optional — this is the legal way to exercise "no
  // partnerId supplied -> not stamped."
  {
    const studentId = `lmtest:evNoPartner:${process.pid}`;
    const sessionId = `lmtest-evnopartner-session-${process.pid}`;
    await deleteLearnerModelData(studentId);
    try {
      await appendEvidence([
        {
          idempotencyKey: `diag:${sessionId}:qa`,
          studentId,
          loId: 'lmtest.lo-nopartner',
          source: 'diagnostic',
          sessionId,
          itemId: 'qa',
          outcome: 1,
          occurredAt: new Date(),
          // partnerId deliberately omitted — this is the whole point.
        },
      ]);
      const landed = await waitFor(async () => !!(await EvidenceEventModel.findById(`diag:${sessionId}:qa`)));
      assert(landed, 'appendEvidence: evidence row lands');
      const row = await EvidenceEventModel.findById(`diag:${sessionId}:qa`);
      assert(row?.partnerId === undefined, 'appendEvidence: partnerId left unstamped when the input omits it');
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
        // M1c fix round 3 (IMPORTANT C): submitAssessment's partnerId is required.
        'lmtest-partner-quiz',
      );
      const landed = await waitFor(async () => !!(await EvidenceEventModel.findById(`diag:${sessionId}:qc`)));
      assert(landed, 'submitAssessment (quiz): evidence row lands');
      const row = await EvidenceEventModel.findById(`diag:${sessionId}:qc`);
      assert(!!row && row.source === 'assessment', "submitAssessment: notesTouched present → source 'assessment'");
    } finally {
      await deleteLearnerModelData(studentId);
    }
  }

  // --- (b) submitAssessment: purpose (Task 13) — explicit field wins over the
  // notesTouched heuristic, in both directions ---
  {
    const studentId = `lmtest:purposequiz:${process.pid}`;
    const sessionId = `lmtest-purposequiz-session-${process.pid}`;
    const resolver = async (id: string) =>
      id === 'qd' ? ({ responseFormat: 'numeric' as const, expectedAnswer: '5' }) : null;
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
          assessmentId: 'lmtest-asmt-purpose-quiz',
          studentId,
          courseId: 'ap-statistics',
          sessionId,
          responses: [{ itemId: 'qd', loId: 'lmtest.lo-d', response: { text: '5' } }],
          purpose: 'quiz',
          notesTouched: [],
        },
        deps,
        resolver,
        // M1c fix round 3 (IMPORTANT C): submitAssessment's partnerId is required.
        'lmtest-partner-purpose-quiz',
      );
      const landed = await waitFor(async () => !!(await EvidenceEventModel.findById(`diag:${sessionId}:qd`)));
      assert(landed, 'submitAssessment (purpose=quiz, empty notesTouched): evidence row lands');
      const row = await EvidenceEventModel.findById(`diag:${sessionId}:qd`);
      assert(
        !!row && row.source === 'assessment',
        "submitAssessment: purpose 'quiz' wins over empty notesTouched → source 'assessment'",
      );
    } finally {
      await deleteLearnerModelData(studentId);
    }
  }

  {
    const studentId = `lmtest:purposediag:${process.pid}`;
    const sessionId = `lmtest-purposediag-session-${process.pid}`;
    const resolver = async (id: string) =>
      id === 'qe' ? ({ responseFormat: 'numeric' as const, expectedAnswer: '5' }) : null;
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
          assessmentId: 'lmtest-asmt-purpose-diag',
          studentId,
          courseId: 'ap-statistics',
          sessionId,
          responses: [{ itemId: 'qe', loId: 'lmtest.lo-e', response: { text: '5' } }],
          purpose: 'diagnostic',
          notesTouched: [{ baselineId: 'b1', cedTopic: 'topic', cedTitle: 'title' }],
        },
        deps,
        resolver,
        // M1c fix round 3 (IMPORTANT C): submitAssessment's partnerId is required.
        'lmtest-partner-purpose-diag',
      );
      const landed = await waitFor(async () => !!(await EvidenceEventModel.findById(`diag:${sessionId}:qe`)));
      assert(landed, 'submitAssessment (purpose=diagnostic, non-empty notesTouched): evidence row lands');
      const row = await EvidenceEventModel.findById(`diag:${sessionId}:qe`);
      assert(
        !!row && row.source === 'diagnostic',
        "submitAssessment: purpose 'diagnostic' wins over non-empty notesTouched → source 'diagnostic'",
      );
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
  const { default: connectDB } = await import('@core/db');
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
  const { default: connectDB } = await import('@core/db');
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
/* student-profile route — embed-token gating, allow paths (Task 2)    */
/*                                                                      */
/* runStudentProfileRouteDenyTests in test-embed-token.ts covers the    */
/* DB-free deny (401) paths — auth is checked before any store call, so */
/* those never touch Mongo. The allow paths below necessarily do (they  */
/* fall through into getOrCreateStudentProfile / saveStudentProfile),   */
/* so they live here alongside the rest of the DB-backed suite.         */
/* ------------------------------------------------------------------ */

async function runStudentProfileEmbedAuthTests() {
  if (!process.env.MONGODB_URI) {
    console.log('\n(skip Task 2 student-profile embed-auth tests — no MONGODB_URI)');
    return;
  }

  const { GET: profileGET, POST: profilePOST } = await import(
    '../src/app/api/tutor/student-profile/[id]/route'
  );
  const { signEmbedToken } = await import('../src/lib/tutor/portal/embed-token');
  const { EvidenceEventModel } = await import('../src/models');
  const { getOrCreateStudentProfile } = await import('../src/lib/tutor/student-profile/store');
  const { deleteLearnerModelData } = await import('../src/lib/tutor/learner-model/store');
  const { default: connectDB } = await import('@core/db');
  const { NextRequest } = await import('next/server');

  await connectDB();

  console.log('\nstudent-profile route — embed-token gating, allow paths (Task 2):\n');

  process.env.PORTAL_PARTNER_SECRETS = process.env.PORTAL_PARTNER_SECRETS ?? JSON.stringify({ portalA: 'secret-a' });
  const savedEnforce = process.env.EMBED_TOKEN_ENFORCE;

  function getReq(id: string, headers?: Record<string, string>) {
    return new Request(`https://engine.test/api/tutor/student-profile/${id}`, {
      method: 'GET',
      headers,
    }) as unknown as InstanceType<typeof NextRequest>;
  }
  function postReq(id: string, bodyObj: unknown, headers?: Record<string, string>) {
    return new Request(`https://engine.test/api/tutor/student-profile/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(headers ?? {}) },
      body: JSON.stringify(bodyObj),
    }) as unknown as InstanceType<typeof NextRequest>;
  }
  function ctx(id: string) {
    return { params: Promise.resolve({ id }) };
  }

  const studentId = `lmtest:embedauth:${process.pid}`;

  try {
    await deleteLearnerModelData(studentId);

    // (b) GET with a valid token whose student_id matches the URL id,
    // enforce=on → 200.
    process.env.EMBED_TOKEN_ENFORCE = 'on';
    {
      const token = signEmbedToken(
        { partner_id: 'portalA', student_id: studentId, exp: Math.floor(Date.now() / 1000) + 7200 },
        'secret-a',
      );
      const res = await profileGET(getReq(studentId, { 'x-embed-token': token }), ctx(studentId));
      assert(res.status === 200, 'GET student-profile: matching-student valid token, enforce=on → 200');
    }

    // (c, DB half) POST with a token whose student_id mismatches the URL id,
    // enforce=on → 401 AND no evidence row written, no SessionMemory entry
    // created — the auth check runs before both the segmentOutcomes evidence
    // block and getOrCreateStudentProfile.
    process.env.EMBED_TOKEN_ENFORCE = 'on';
    {
      const mismatchSessionId = `lmtest-embedauth-mismatch-${process.pid}`;
      const token = signEmbedToken(
        { partner_id: 'portalA', student_id: 'someone-else', exp: Math.floor(Date.now() / 1000) + 7200 },
        'secret-a',
      );
      const res = await profilePOST(
        postReq(
          studentId,
          {
            sessionId: mismatchSessionId,
            segmentOutcomes: [
              { segmentId: 'seg-mismatch', loId: 'lo', kind: 'try_yourself', completed: true, outcome: 1 },
            ],
          },
          { 'x-embed-token': token },
        ),
        ctx(studentId),
      );
      assert(res.status === 401, 'POST student-profile: mismatched student_id token, enforce=on → 401');
      await new Promise((r) => setTimeout(r, 300)); // let any (wrongly) fired append settle
      const count = await EvidenceEventModel.countDocuments({ studentId });
      assert(count === 0, 'POST student-profile: denied commit appends no evidence');
      const profileAfterDeny = await getOrCreateStudentProfile(studentId);
      assert(
        !profileAfterDeny.recentSessions.some((s) => s.sessionId === mismatchSessionId),
        'POST student-profile: denied commit creates no SessionMemory entry (profile not mutated)',
      );
    }

    // (d) POST without a token, enforce=log → 200, unchanged behavior (log
    // mode verifies but never blocks).
    process.env.EMBED_TOKEN_ENFORCE = 'log';
    {
      const res = await profilePOST(
        postReq(studentId, { sessionId: `lmtest-embedauth-log-${process.pid}` }),
        ctx(studentId),
      );
      assert(res.status === 200, 'POST student-profile: no token, enforce=log → 200 (unchanged behavior)');
    }

    // Happy path via header, enforce=on → 200.
    process.env.EMBED_TOKEN_ENFORCE = 'on';
    {
      const token = signEmbedToken(
        { partner_id: 'portalA', student_id: studentId, exp: Math.floor(Date.now() / 1000) + 7200 },
        'secret-a',
      );
      const res = await profilePOST(
        postReq(studentId, { sessionId: `lmtest-embedauth-header-${process.pid}` }, { 'x-embed-token': token }),
        ctx(studentId),
      );
      assert(res.status === 200, 'POST student-profile: matching-student valid token via header, enforce=on → 200');
    }

    // Happy path via body.embedToken (no header) → 200, and the stray
    // embedToken field is stripped before any further use (no crash, no
    // leakage into the CommitBody fields the route consumes).
    process.env.EMBED_TOKEN_ENFORCE = 'on';
    {
      const token = signEmbedToken(
        { partner_id: 'portalA', student_id: studentId, exp: Math.floor(Date.now() / 1000) + 7200 },
        'secret-a',
      );
      const res = await profilePOST(
        postReq(studentId, { sessionId: `lmtest-embedauth-bodytoken-${process.pid}`, embedToken: token }),
        ctx(studentId),
      );
      assert(res.status === 200, 'POST student-profile: matching-student valid token via body.embedToken → 200');
    }
  } finally {
    if (savedEnforce === undefined) delete process.env.EMBED_TOKEN_ENFORCE;
    else process.env.EMBED_TOKEN_ENFORCE = savedEnforce;
    await deleteLearnerModelData(studentId);
  }
}

/* ------------------------------------------------------------------ */
/* session-usage route — embed-token gating, allow paths (Task 3)      */
/*                                                                      */
/* runSessionUsageRouteDenyTests in test-embed-token.ts covers the      */
/* DB-free deny (401) paths — auth is checked before checkRateLimit /   */
/* connectDB on POST, and before the sessionId-missing 400 on GET, so   */
/* those never touch Mongo. The allow paths below (and the studentId-   */
/* absent anonymous POST, which is unauthenticated by design) fall      */
/* through into TutorSession.findOne/findOneAndUpdate, so they live     */
/* here alongside the rest of the DB-backed suite.                      */
/* ------------------------------------------------------------------ */

async function runSessionUsageEmbedAuthTests() {
  if (!process.env.MONGODB_URI) {
    console.log('\n(skip Task 3 session-usage embed-auth tests — no MONGODB_URI)');
    return;
  }

  const { GET: usageGET, POST: usagePOST } = await import('../src/app/api/tutor/session-usage/route');
  const { signEmbedToken } = await import('../src/lib/tutor/portal/embed-token');
  const { TutorSession } = await import('../src/models/TutorSession');
  const { default: connectDB } = await import('@core/db');
  const { NextRequest } = await import('next/server');

  await connectDB();

  console.log('\nsession-usage route — embed-token gating, allow paths (Task 3):\n');

  process.env.PORTAL_PARTNER_SECRETS = process.env.PORTAL_PARTNER_SECRETS ?? JSON.stringify({ portalA: 'secret-a' });
  const savedEnforce = process.env.EMBED_TOKEN_ENFORCE;

  function getReq(qs: string, headers?: Record<string, string>) {
    return new Request(`https://engine.test/api/tutor/session-usage${qs}`, {
      method: 'GET',
      headers,
    }) as unknown as InstanceType<typeof NextRequest>;
  }
  function postReq(bodyObj: unknown, headers?: Record<string, string>) {
    return new Request('https://engine.test/api/tutor/session-usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(headers ?? {}) },
      body: JSON.stringify(bodyObj),
    }) as unknown as InstanceType<typeof NextRequest>;
  }

  const studentId = `lmtest:sessionusage:${process.pid}`;
  const sessionIds: string[] = [];
  const baseFields = { subject: 'Math', topic: 'Algebra', level: '9', sessionGoal: 'practice', inputMode: 'text' };

  try {
    // (b) GET with a valid token, enforce=on → 200 (no expectedStudentId —
    // the GET is keyed by opaque sessionId, not gated per-student).
    process.env.EMBED_TOKEN_ENFORCE = 'on';
    {
      const token = signEmbedToken(
        { partner_id: 'portalA', student_id: studentId, exp: Math.floor(Date.now() / 1000) + 7200 },
        'secret-a',
      );
      const res = await usageGET(getReq(`?sessionId=lmtest-usage-nonexistent-${process.pid}`, { 'x-embed-token': token }));
      assert(res.status === 200, 'GET session-usage: valid token, enforce=on → 200');
    }

    // (e) POST without studentId, no token, enforce=on → 200 (anonymous demo
    // surfaces stay unauthenticated by design).
    process.env.EMBED_TOKEN_ENFORCE = 'on';
    {
      const sessionId = `lmtest-usage-anon-${process.pid}`;
      sessionIds.push(sessionId);
      const res = await usagePOST(postReq({ sessionId, ...baseFields }));
      assert(res.status === 200, 'POST session-usage: no studentId, no token, enforce=on → 200 (anonymous)');
      const doc = await TutorSession.findOne({ sessionId }).lean();
      assert(!!doc && doc.studentId === undefined, 'POST session-usage (anonymous): stored row has no studentId');
    }

    // (d) POST with studentId + matching-claim token in BODY (embedToken
    // field, the sendBeacon pagehide path that can't set headers) → 200.
    // Assert the stored row's studentId round-trips AND embedToken never
    // lands in the persisted document.
    process.env.EMBED_TOKEN_ENFORCE = 'on';
    {
      const sessionId = `lmtest-usage-bodytoken-${process.pid}`;
      sessionIds.push(sessionId);
      const token = signEmbedToken(
        { partner_id: 'portalA', student_id: studentId, exp: Math.floor(Date.now() / 1000) + 7200 },
        'secret-a',
      );
      const res = await usagePOST(
        postReq({ sessionId, studentId, ...baseFields, embedToken: token }),
      );
      assert(res.status === 200, 'POST session-usage: matching-claim token via body.embedToken → 200');
      const doc = await TutorSession.findOne({ sessionId }).lean();
      assert(!!doc && doc.studentId === studentId, 'POST session-usage (body token): stored row studentId matches');
      assert(
        !!doc && !Object.prototype.hasOwnProperty.call(doc, 'embedToken'),
        'POST session-usage (body token): embedToken never persisted on the stored document',
      );
    }

    // Happy path via header, enforce=on → 200.
    process.env.EMBED_TOKEN_ENFORCE = 'on';
    {
      const sessionId = `lmtest-usage-header-${process.pid}`;
      sessionIds.push(sessionId);
      const token = signEmbedToken(
        { partner_id: 'portalA', student_id: studentId, exp: Math.floor(Date.now() / 1000) + 7200 },
        'secret-a',
      );
      const res = await usagePOST(
        postReq({ sessionId, studentId, ...baseFields }, { 'x-embed-token': token }),
      );
      assert(res.status === 200, 'POST session-usage: matching-claim token via header, enforce=on → 200');
      const doc = await TutorSession.findOne({ sessionId }).lean();
      assert(!!doc && doc.studentId === studentId, 'POST session-usage (header token): stored row studentId matches');
    }

    // log-mode: POST with studentId + no token → 200, unchanged behavior
    // (log mode verifies but never blocks).
    process.env.EMBED_TOKEN_ENFORCE = 'log';
    {
      const sessionId = `lmtest-usage-log-${process.pid}`;
      sessionIds.push(sessionId);
      const res = await usagePOST(postReq({ sessionId, studentId, ...baseFields }));
      assert(res.status === 200, 'POST session-usage: studentId present, no token, enforce=log → 200 (unchanged behavior)');
    }
  } finally {
    if (savedEnforce === undefined) delete process.env.EMBED_TOKEN_ENFORCE;
    else process.env.EMBED_TOKEN_ENFORCE = savedEnforce;
    if (sessionIds.length) await TutorSession.deleteMany({ sessionId: { $in: sessionIds } });
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
  const { default: connectDB } = await import('@core/db');

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
  const { default: connectDB } = await import('@core/db');
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
  const { default: connectDB } = await import('@core/db');
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

/* ------------------------------------------------------------------ */
/* Task 14 — review-plan composer (compose-review-plan.ts)            */
/* ------------------------------------------------------------------ */

/** Records every call and returns canned segments shaped like a real
 *  expander response: "<loId>-recall" + "<loId>-try" for every supplied
 *  LO, plus "<loId>-try2" whenever the composer's per-LO description
 *  carries the reteach marker (mirrors what REVIEW_STAGE2_SYSTEM asks a
 *  real model to do with that same marker). Lets test (c) assert on the
 *  REQUEST (which LOs got marked) rather than only on the output. */
function makeStubExpandFn(
  calls: Array<{ los: LearningObjective[]; input: GenerateFromTextInput; opts?: { system?: string; reviewMode?: boolean } }>,
): (
  los: ReadonlyArray<LearningObjective>,
  input: GenerateFromTextInput,
  opts?: { system?: string; reviewMode?: boolean },
) => Promise<ExpandSegmentsResult> {
  return async (los, input, opts) => {
    calls.push({ los: [...los], input, opts });
    const segments: Segment[] = [];
    for (const lo of los) {
      segments.push({ id: `${lo.id}-recall`, kind: 'concept', goal: `Recall: ${lo.id}`, keyIdeas: [`Key idea for ${lo.id}`] });
      segments.push({ id: `${lo.id}-try`, kind: 'try_yourself', problem: `Try: ${lo.id}`, expectedAnswer: '42' });
      if (lo.description.includes('try2')) {
        segments.push({ id: `${lo.id}-try2`, kind: 'try_yourself', problem: `Easier try: ${lo.id}`, expectedAnswer: '7' });
      }
    }
    return { segments, ok: true, reason: 'stub' };
  };
}

/** Drops null/undefined leaves recursively. Mongo's Mixed-typed fields
 *  round-trip an explicitly-`undefined` key as `null` (BSON has no
 *  `undefined`); this normalizes both sides before a content comparison
 *  so that storage quirk doesn't register as a data-loss bug. */
function stripNullish(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(stripNullish);
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (val === null || val === undefined) continue;
      out[k] = stripNullish(val);
    }
    return out;
  }
  return v;
}

async function runReviewPlanComposerTests() {
  if (!process.env.MONGODB_URI) {
    console.log('\n(skip Task 14 review-plan composer tests — no MONGODB_URI)');
    return;
  }

  const { composeReviewPlan, REVIEW_STAGE2_SYSTEM } = await import('../src/lib/tutor/lesson-plan/compose-review-plan');
  const { getLessonPlan, deleteLessonPlan } = await import('../src/lib/tutor/lesson-plan/store');
  const { loGroupOf } = await import('../src/lib/tutor/lesson-plan/context');
  const { LearnerStateProjectionModel, buildLearnerStateProjectionId } = await import('../src/models');
  const { default: connectDB } = await import('@core/db');

  await connectDB();

  const studentId = `revtest:${process.pid}`;
  const createdPlanIds: string[] = [];

  async function seedProjection(loId: string, estimate: number) {
    await LearnerStateProjectionModel.create({
      _id: buildLearnerStateProjectionId(studentId, loId),
      studentId,
      loId,
      estimate,
      confidence: 'medium',
      trend: 'flat',
      nEff: 3,
      lastEvidenceAt: new Date(),
    });
  }

  async function cleanup() {
    await LearnerStateProjectionModel.deleteMany({ studentId });
    await Promise.all(createdPlanIds.map((id) => deleteLessonPlan(id)));
    createdPlanIds.length = 0;
  }

  console.log('\nTask 14 — review-plan composer (compose-review-plan.ts):\n');

  // Pure sanity: REVIEW_STAGE2_SYSTEM carries the recall-first / -try2
  // contract the brief specifies, and loGroupOf (context.ts) recognizes
  // the new suffixes so progress-tracking still groups review segments
  // under their LO — same requirement Task 12 had for -worked2.
  assert(
    REVIEW_STAGE2_SYSTEM.includes('-recall') && REVIEW_STAGE2_SYSTEM.includes('-try2') && REVIEW_STAGE2_SYSTEM.includes('NOT a fresh introduction'),
    'REVIEW_STAGE2_SYSTEM: documents the recall-first (not fresh-intro) + optional -try2 contract',
  );
  assert(loGroupOf('lo-1-recall') === 'lo-1', 'loGroupOf: strips -recall to the bare loId');
  assert(
    loGroupOf('lo-1-try2') === loGroupOf('lo-1-try') && loGroupOf('lo-1-try2') === 'lo-1',
    'loGroupOf: -try2 groups with its LO exactly like -try does',
  );

  await cleanup();
  try {
    const loA = `revA-${process.pid}`; // strong: estimate 0.8
    const loB = `revB-${process.pid}`; // weak: estimate 0.2 (below 0.5 reteach threshold)
    const loC = `revC-${process.pid}`; // untouched: no projection at all
    await seedProjection(loA, 0.8);
    await seedProjection(loB, 0.2);

    // (a) ordering: ascending estimate, missing → TUNING.untouchedPrior (0.3)
    // — lands loC between loB (0.2) and loA (0.8).
    {
      const calls: Array<{ los: LearningObjective[]; input: GenerateFromTextInput; opts?: { system?: string; reviewMode?: boolean } }> = [];
      const plan = await composeReviewPlan({
        studentId,
        los: [
          { loId: loA, title: 'Quadratic formula' },
          { loId: loB, title: 'Linear equations' },
          { loId: loC, title: 'Slope-intercept form' },
        ],
        expandFn: makeStubExpandFn(calls),
      });
      createdPlanIds.push(plan.id);
      assert(
        plan.los.map((lo) => lo.id).join(',') === [loB, loC, loA].join(','),
        '(a) composeReviewPlan orders LOs ascending by estimate (B 0.2, C untouched→0.3, A 0.8)',
      );
      assert(
        calls[0]!.opts?.system === REVIEW_STAGE2_SYSTEM,
        '(a) composeReviewPlan invokes the expander with REVIEW_STAGE2_SYSTEM, not STAGE2_SYSTEM',
      );
      assert(
        calls[0]!.opts?.reviewMode === true,
        '(fix round 1) composeReviewPlan invokes the expander with reviewMode: true',
      );
    }

    // Fix round 1 (spec §6.2): LearnerHints conditioning (ability band +
    // confirmed gap topics) must reach the review request, same as Task
    // 12's fresh-lesson generation — only the ability-line phrasing
    // differs (review has no worked_example segment to talk about).
    {
      const { getOrCreateStudentProfile, saveStudentProfile } = await import(
        '../src/lib/tutor/student-profile/store'
      );
      const { StudentProfileModel } = await import('../src/models/StudentProfile');
      const { buildStage2UserMessage } = await import('../src/lib/tutor/lesson-plan/generate-from-text');

      const hintsStudentId = `revhints:${process.pid}`;
      await StudentProfileModel.deleteOne({ _id: hintsStudentId });
      try {
        const nowIso = new Date().toISOString();
        const gap = {
          id: 'gap_review_conditioning',
          kind: 'prerequisite' as const,
          conceptLabel: 'sign errors on inequalities',
          status: 'confirmed' as const,
          evidence: { signals: [], observation: 'flips the sign incorrectly', studentQuotes: [] },
          firstSeenAt: nowIso,
          lastSeenAt: nowIso,
        };
        const profile = await getOrCreateStudentProfile(hintsStudentId);
        await saveStudentProfile({ ...profile, gaps: [gap] });

        const loHints = `revHints-${process.pid}`;
        await seedProjection(loHints, 0.2); // weak — also exercises the -try2 branch

        const calls: Array<{ los: LearningObjective[]; input: GenerateFromTextInput; opts?: { system?: string; reviewMode?: boolean } }> = [];
        const plan = await composeReviewPlan({
          studentId: hintsStudentId,
          los: [{ loId: loHints, title: 'Inequality signs' }],
          expandFn: makeStubExpandFn(calls),
        });
        createdPlanIds.push(plan.id);

        const sentInput = calls[0]!.input;
        assert(
          !!sentInput.learner && sentInput.learner.gapTopics.includes('sign errors on inequalities'),
          '(fix round 1 - a) composeReviewPlan calls getLearnerHints and threads the result onto the expander input.learner',
        );

        // (fix round 1 - b) render the actual stage-2 user message the real
        // expander would have sent (buildStage2UserMessage is pure) from the
        // captured request, and assert the gap-topics text reaches it under
        // review composition, with a review-shaped (not worked-example)
        // ability line.
        const rendered = buildStage2UserMessage(
          calls[0]!.los.map((lo) => ({ id: lo.id, description: lo.description })),
          sentInput,
          { reviewMode: true },
        );
        assert(
          rendered.includes('Known misconception areas') && rendered.includes('sign errors on inequalities'),
          '(fix round 1 - b) gapTopics text reaches the stage-2 user message under review composition',
        );
        assert(
          !rendered.includes('worked example'),
          '(fix round 1) review-mode ability line avoids worked-example phrasing (no worked_example segment exists in review plans)',
        );
      } finally {
        await StudentProfileModel.deleteOne({ _id: hintsStudentId });
      }
    }

    // (c) weak LO gets a -try2 request marker, strong LO doesn't — assert
    // on the REQUEST payload (what composeReviewPlan asked the expander
    // for), not just on the resulting segments.
    {
      const calls: Array<{ los: LearningObjective[]; input: GenerateFromTextInput; opts?: { system?: string; reviewMode?: boolean } }> = [];
      const plan = await composeReviewPlan({
        studentId,
        los: [
          { loId: loA, title: 'Quadratic formula' },
          { loId: loB, title: 'Linear equations' },
        ],
        expandFn: makeStubExpandFn(calls),
      });
      createdPlanIds.push(plan.id);
      const sentLoA = calls[0]!.los.find((lo) => lo.id === loA);
      const sentLoB = calls[0]!.los.find((lo) => lo.id === loB);
      assert(
        !!sentLoB && sentLoB.description.includes('try2'),
        '(c) weak LO (estimate 0.2 < reteachBelowEstimate 0.5) carries a -try2 request marker',
      );
      assert(
        !!sentLoA && !sentLoA.description.includes('try2'),
        "(c) strong LO (estimate 0.8) does NOT carry a -try2 request marker",
      );
      assert(
        plan.segments.some((s) => s.id === `${loB}-try2`) && !plan.segments.some((s) => s.id === `${loA}-try2`),
        '(c) resulting plan: only the weak LO actually gets a -try2 segment',
      );
    }

    // (b) budget cap: 8 LOs at sessionMinutes 30 → floor((30-4)/5) = 5 kept,
    // the weakest 5 by estimate.
    {
      const capIds = Array.from({ length: 8 }, (_, i) => `revCap${i}-${process.pid}`);
      const estimates = [0.9, 0.2, 0.7, 0.1, 0.6, 0.3, 0.8, 0.4]; // unsorted on purpose
      for (let i = 0; i < capIds.length; i++) await seedProjection(capIds[i]!, estimates[i]!);
      const calls: Array<{ los: LearningObjective[]; input: GenerateFromTextInput; opts?: { system?: string; reviewMode?: boolean } }> = [];
      const plan = await composeReviewPlan({
        studentId,
        los: capIds.map((loId, i) => ({ loId, title: `Cap topic ${i}` })),
        sessionMinutes: 30,
        expandFn: makeStubExpandFn(calls),
      });
      createdPlanIds.push(plan.id);
      // weakest 5 estimates are 0.1, 0.2, 0.3, 0.4, 0.6 → indices 3,1,5,7,4
      const expectedOrder = [capIds[3], capIds[1], capIds[5], capIds[7], capIds[4]];
      assert(
        plan.los.length === 5 && plan.los.map((lo) => lo.id).join(',') === expectedOrder.join(','),
        '(b) budget cap keeps floor((30-4)/5)=5 LOs — the weakest 5, in ascending-estimate order',
      );
    }

    // (d) persistence round-trip + metadata.reviewPlan, and (e) title/los
    // echo the portal-supplied titles.
    {
      const calls: Array<{ los: LearningObjective[]; input: GenerateFromTextInput; opts?: { system?: string; reviewMode?: boolean } }> = [];
      const plan = await composeReviewPlan({
        studentId,
        los: [
          { loId: loA, title: 'Quadratic formula' },
          { loId: loB, title: 'Linear equations' },
          { loId: loC, title: 'Slope-intercept form' },
        ],
        expandFn: makeStubExpandFn(calls),
      });
      createdPlanIds.push(plan.id);

      assert(plan.id.startsWith('rev-'), '(d) plan id is minted as rev-<randomUUID>');
      assert(
        plan.metadata?.reviewPlan === true && plan.metadata?.studentId === studentId,
        '(d) metadata.reviewPlan === true and metadata.studentId echoes the composing student',
      );

      // Mongo's Mixed-typed segments array round-trips absent-optional-field
      // `undefined`s (parseSegment always sets keys like teacherNote, even
      // when undefined) as `null` — a BSON storage quirk of every generated
      // plan, not something composeReviewPlan introduces. Strip nullish
      // leaves before comparing so the assertion checks actual content.
      const reloaded = await getLessonPlan(plan.id);
      assert(
        !!reloaded &&
          reloaded.id === plan.id &&
          JSON.stringify(stripNullish(reloaded.segments)) === JSON.stringify(stripNullish(plan.segments)) &&
          reloaded.metadata?.reviewPlan === true,
        '(d) getLessonPlan round-trips the persisted plan (segments + metadata.reviewPlan survive)',
      );

      // (e) title: "Review: <first 2 titles>…" (3 kept → ellipsis); los
      // descriptions echo the portal-supplied titles verbatim.
      assert(
        plan.title === 'Review: Linear equations, Slope-intercept form…',
        '(e) title is "Review: <first 2 LO titles>…" in composed (weakest-first) order, ellipsis for a 3rd',
      );
      assert(
        plan.los.find((lo) => lo.id === loA)?.description === 'Quadratic formula' &&
          plan.los.find((lo) => lo.id === loB)?.description === 'Linear equations' &&
          plan.los.find((lo) => lo.id === loC)?.description === 'Slope-intercept form',
        '(e) plan.los echoes the portal-supplied LO titles verbatim',
      );
    }

    // Title has no dangling ellipsis for exactly 2 kept LOs.
    {
      const calls: Array<{ los: LearningObjective[]; input: GenerateFromTextInput; opts?: { system?: string; reviewMode?: boolean } }> = [];
      const plan = await composeReviewPlan({
        studentId,
        los: [
          { loId: loA, title: 'Quadratic formula' },
          { loId: loB, title: 'Linear equations' },
        ],
        expandFn: makeStubExpandFn(calls),
      });
      createdPlanIds.push(plan.id);
      assert(
        plan.title === 'Review: Linear equations, Quadratic formula',
        '(e) title: exactly 2 kept LOs → no trailing ellipsis',
      );
    }

    // Expander failure throws (route turns this into a 502 — Task 15).
    {
      const failingExpandFn = async () => ({ segments: [], ok: false, reason: 'stub failure' }) as ExpandSegmentsResult;
      let threw = false;
      try {
        await composeReviewPlan({
          studentId,
          los: [{ loId: loA, title: 'Quadratic formula' }],
          expandFn: failingExpandFn,
        });
      } catch {
        threw = true;
      }
      assert(threw, 'composeReviewPlan: expander failure throws rather than falling back to a stub plan');
    }
  } finally {
    await cleanup();
  }
}

/* ------------------------------------------------------------------ */
/* Task 17 — learner-context boot block                               */
/* (context-block.ts render + join, and the student-profile GET       */
/* route's flag-gated `learnerContext` field)                          */
/* ------------------------------------------------------------------ */

/** Pure — no DB, runs unconditionally (same as the estimator/hints pure
 *  tests up top). Covers renderLearnerContextBlock's shape, the
 *  both-empty → null case, and the LO/gap caps. */
async function runLearnerContextBlockPureTests() {
  const { renderLearnerContextBlock } = await import('../src/lib/tutor/learner-model/context-block');

  console.log('\nlearner-context block — pure render (Task 17):\n');

  // 1 strong + 1 developing-due LO + 1 gap: shape + key substrings.
  {
    const block = renderLearnerContextBlock(
      [
        { loId: 'lo-strong', title: 'Slope-intercept form', estimate: 0.9, confidence: 'high', reviewDue: false },
        { loId: 'lo-dev', title: 'Quadratic factoring', estimate: 0.3, confidence: 'low', reviewDue: true },
      ],
      [{ label: 'lo-dev', observation: 'Mixes up the sign when factoring a negative constant term.' }],
    );
    assert(!!block, 'renderLearnerContextBlock: 1 strong + 1 developing-due LO + 1 gap → non-null');
    assert(
      !!block && block.startsWith('<learner_context>') && block.endsWith('</learner_context>'),
      'renderLearnerContextBlock: fenced with <learner_context>...</learner_context>',
    );
    assert(!!block && block.includes('strong (high confidence)'), 'renderLearnerContextBlock: strong band + confidence wording');
    assert(!!block && block.includes('developing (low confidence)'), 'renderLearnerContextBlock: developing band + confidence wording');
    assert(!!block && block.includes('DUE FOR REVIEW'), 'renderLearnerContextBlock: reviewDue LO carries the DUE FOR REVIEW flag');
    assert(!!block && block.includes('- lo-dev: Mixes up the sign when factoring'), 'renderLearnerContextBlock: gap label + observation line');
    assert(!!block && block.includes('Teach to this:'), 'renderLearnerContextBlock: carries the "Teach to this:" instruction line');
  }

  // both-empty → null.
  {
    const block = renderLearnerContextBlock([], []);
    assert(block === null, 'renderLearnerContextBlock: both LOs and gaps empty → null');
  }

  // LO-only (no gaps) and gap-only (no LOs) still render — null is reserved
  // for the both-empty case.
  {
    const loOnly = renderLearnerContextBlock(
      [{ loId: 'lo-a', title: 'LO A', estimate: 0.9, confidence: 'high', reviewDue: false }],
      [],
    );
    assert(!!loOnly && !loOnly.includes('Active gaps'), 'renderLearnerContextBlock: LO-only input omits the gaps section but still renders');
    const gapOnly = renderLearnerContextBlock([], [{ label: 'lo-a', observation: 'obs' }]);
    assert(!!gapOnly && !gapOnly.includes('current standing'), 'renderLearnerContextBlock: gap-only input omits the LO section but still renders');
  }

  // Caps: 10 LOs in → 8 rendered; 5 gaps in → 3 rendered.
  {
    const manyLos = Array.from({ length: 10 }, (_, i) => ({
      loId: `lo-${i}`, title: `LO ${i}`, estimate: 0.9, confidence: 'high', reviewDue: false,
    }));
    const manyGaps = Array.from({ length: 5 }, (_, i) => ({ label: `gap-${i}`, observation: `obs ${i}` }));
    const block = renderLearnerContextBlock(manyLos, manyGaps);
    const loLines = (block ?? '').split('\n').filter((l) => /^- LO \d+:/.test(l));
    const gapLines = (block ?? '').split('\n').filter((l) => /^- gap-\d+:/.test(l));
    assert(loLines.length === 8, `renderLearnerContextBlock: caps at 8 LOs (got ${loLines.length})`);
    assert(gapLines.length === 3, `renderLearnerContextBlock: caps at 3 gaps (got ${gapLines.length})`);
  }

  // Gap observation clipped at 160 chars.
  {
    const longObs = 'x'.repeat(200);
    const block = renderLearnerContextBlock([], [{ label: 'lo-a', observation: longObs }]);
    const gapLine = (block ?? '').split('\n').find((l) => l.startsWith('- lo-a:'))!;
    // "- lo-a: " prefix (8 chars) + clipped body (160 + ellipsis).
    assert(gapLine.length <= 8 + 161, `renderLearnerContextBlock: long gap observation is clipped (line length ${gapLine.length})`);
  }
}

/** DB-backed join (getLearnerContextBlock) + route-level flag/param
 *  gating on GET /api/tutor/student-profile/[id]. Unique per-run fixture
 *  ids (process.pid-scoped) + cleanup in a finally, mirroring Task 14's
 *  review-plan-composer section. */
async function runLearnerContextBlockDbTests() {
  if (!process.env.MONGODB_URI) {
    console.log('\n(skip Task 17 learner-context DB/route tests — no MONGODB_URI)');
    return;
  }

  const { getLearnerContextBlock } = await import('../src/lib/tutor/learner-model/context-block');
  const { upsertLessonPlan, deleteLessonPlan } = await import('../src/lib/tutor/lesson-plan/store');
  const { LearnerStateProjectionModel, buildLearnerStateProjectionId } = await import('../src/models');
  const { StudentProfileModel } = await import('../src/models/StudentProfile');
  const { getOrCreateStudentProfile, saveStudentProfile } = await import('../src/lib/tutor/student-profile/store');
  const { GET: profileGET } = await import('../src/app/api/tutor/student-profile/[id]/route');
  const { default: connectDB } = await import('@core/db');
  const { NextRequest } = await import('next/server');

  await connectDB();

  const studentId = `lctest:${process.pid}`;
  const planId = `lctest-plan-${process.pid}`;
  const loSeen = `lctest-lo-seen-${process.pid}`;
  const loUnseen = `lctest-lo-unseen-${process.pid}`;

  async function cleanup() {
    await LearnerStateProjectionModel.deleteMany({ studentId });
    await StudentProfileModel.deleteOne({ _id: studentId });
    await deleteLessonPlan(planId);
  }

  function getReq(id: string, query?: string) {
    const qs = query ? `?${query}` : '';
    return new Request(`https://engine.test/api/tutor/student-profile/${id}${qs}`, {
      method: 'GET',
    }) as unknown as InstanceType<typeof NextRequest>;
  }
  function ctx(id: string) {
    return { params: Promise.resolve({ id }) };
  }

  console.log('\nlearner-context block — DB-backed join + route (Task 17):\n');

  const savedFlag = process.env.TUTOR_LEARNER_CONTEXT;
  const savedEnforce = process.env.EMBED_TOKEN_ENFORCE;
  process.env.EMBED_TOKEN_ENFORCE = 'off'; // route-level tests below don't exercise auth — Task 2 covers that separately.

  await cleanup();
  try {
    await upsertLessonPlan({
      id: planId,
      title: 'Task 17 test plan',
      curriculum: 'freestyle',
      grade: '9-12',
      subject: 'math',
      los: [
        { id: loSeen, description: 'Seen objective', shortTitle: 'Seen LO' },
        { id: loUnseen, description: 'Unseen objective', shortTitle: 'Unseen LO' },
      ],
      estimatedMinutes: 12,
      segments: [{ id: `${loSeen}-hook`, kind: 'hook', loId: loSeen, goal: 'g' }],
      schemaVersion: 1,
      metadata: {},
    });

    await LearnerStateProjectionModel.create({
      _id: buildLearnerStateProjectionId(studentId, loSeen),
      studentId,
      loId: loSeen,
      estimate: 0.85,
      confidence: 'high',
      trend: 'flat',
      nEff: 6,
      reviewDueAt: new Date(Date.now() - 60 * 60 * 1000), // 1h in the past → DUE
      lastEvidenceAt: new Date(),
    });

    const nowIso = new Date().toISOString();
    const profile = await getOrCreateStudentProfile(studentId);
    await saveStudentProfile({
      ...profile,
      gaps: [
        {
          id: 'gap_lctest',
          kind: 'lo',
          loId: loSeen,
          status: 'confirmed',
          evidence: { signals: [], observation: 'Confuses slope and intercept when reading a graph.', studentQuotes: [] },
          firstSeenAt: nowIso,
          lastSeenAt: nowIso,
        },
      ],
    });

    // getLearnerContextBlock: seeded projection + confirmed gap → block
    // carries both LOs (seen with real estimate/DUE, unseen with the
    // untouched-prior fallback band) and the gap.
    {
      const block = await getLearnerContextBlock(studentId, planId);
      assert(!!block, 'getLearnerContextBlock: seeded projection + confirmed gap → non-null block');
      assert(!!block && block.includes('Seen LO') && block.includes('DUE FOR REVIEW'), 'getLearnerContextBlock: seen LO carries its real band + DUE FOR REVIEW');
      assert(!!block && block.includes('Unseen LO'), 'getLearnerContextBlock: unseen LO still appears (untouched-prior fallback)');
      assert(!!block && block.includes('Confuses slope and intercept'), 'getLearnerContextBlock: confirmed gap observation reaches the block');
    }

    // unknown plan id → null (never throws).
    {
      const block = await getLearnerContextBlock(studentId, `lctest-nonexistent-${process.pid}`);
      assert(block === null, 'getLearnerContextBlock: unknown lessonPlanId → null');
    }

    // Route-level: flag on + lessonPlanId param → learnerContext string.
    {
      process.env.TUTOR_LEARNER_CONTEXT = 'on';
      const res = await profileGET(getReq(studentId, `lessonPlanId=${planId}`), ctx(studentId));
      assert(res.status === 200, 'GET student-profile: flag on + lessonPlanId → 200');
      const json = await res.json();
      assert(typeof json.learnerContext === 'string', 'GET student-profile: flag on + lessonPlanId → learnerContext is a string');
    }

    // Route-level: flag off → learnerContext key absent entirely (not null).
    {
      delete process.env.TUTOR_LEARNER_CONTEXT;
      const res = await profileGET(getReq(studentId, `lessonPlanId=${planId}`), ctx(studentId));
      const json = await res.json();
      assert(!('learnerContext' in json), 'GET student-profile: flag off → learnerContext key absent (byte-identical to pre-Task-17 shape)');
    }

    // Route-level: flag on + NO lessonPlanId param → learnerContext key absent.
    {
      process.env.TUTOR_LEARNER_CONTEXT = 'on';
      const res = await profileGET(getReq(studentId), ctx(studentId));
      const json = await res.json();
      assert(!('learnerContext' in json), 'GET student-profile: flag on, no lessonPlanId param → learnerContext key absent');
    }
  } finally {
    if (savedFlag === undefined) delete process.env.TUTOR_LEARNER_CONTEXT;
    else process.env.TUTOR_LEARNER_CONTEXT = savedFlag;
    if (savedEnforce === undefined) delete process.env.EMBED_TOKEN_ENFORCE;
    else process.env.EMBED_TOKEN_ENFORCE = savedEnforce;
    await cleanup();
  }
}

runDbTests()
  .then(() => runLearnerHintsTests())
  .then(() => runServerAppendPointTests())
  .then(() => runLearnerStateRouteTests())
  .then(() => runStudentProfileSegmentOutcomesTests())
  .then(() => runStudentProfileEmbedAuthTests())
  .then(() => runSessionUsageEmbedAuthTests())
  .then(() => runLearnerSnapshotTests())
  .then(() => runStudentEraseRouteTests())
  .then(() => runBackfillEvidenceTests())
  .then(() => runReviewPlanComposerTests())
  .then(() => runLearnerContextBlockPureTests())
  .then(() => runLearnerContextBlockDbTests())
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
