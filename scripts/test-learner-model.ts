/**
 * Learner-model estimator — pure/deterministic tests against
 * src/lib/tutor/learner-model/estimator.ts. No DB, no LLM calls (Task 6).
 * Task 7 extends this script with a DB-backed section for appendEvidence.
 *
 * Usage: npx tsx scripts/test-learner-model.ts  (npm run test:learner-model)
 */
import { estimateLo, trendOf, nextReviewAt } from '../src/lib/tutor/learner-model/estimator';

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

runDbTests()
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
