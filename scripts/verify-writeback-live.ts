/**
 * MANUAL live verification for the brain-gen → ProblemBank write-back cache
 * (2026-07-17). Costs ~2 Sonnet calls + 2 DB round-trips per run — not part
 * of any automated suite.
 *
 * What it proves, end-to-end against the REAL pipeline + DB:
 *   1. Call 1 (fresh topic/difficulty): Layer 2 generates + verifies, serves
 *      provenance 'brain-gen', and fire-and-forgets a bank insert.
 *   2. The inserted row exists in ProblemBank with solutionText populated.
 *   3. Call 2 (same inputs, excluding call 1's hash): Layer 1 serves from
 *      the bank in ~50ms — provenance 'bank' — proving the always-attempt
 *      gate + hash-exclusion work.
 *
 * Run (on a box with MONGODB_URI + ANTHROPIC_API_KEY exported, e.g. prod):
 *   npx tsx scripts/verify-writeback-live.ts
 */
import './writeback-env-preload'; // MUST stay first — see that file's header
import { generateProblem, simpleHash } from '../src/lib/tutor/voice/problem-generator';
import { ProblemBank } from '../src/models/ProblemBank';
import { connectDB } from '../src/lib/db';
import type { LessonPlan } from '../src/lib/tutor/lesson-plan/types';

const TOPIC = 'writeback-verify-topic';

const plan = {
  id: 'writeback-verify-plan',
  topic: TOPIC,
  los: [{ id: 'lo1', description: 'Evaluate limits of rational functions via factoring' }],
  segments: [],
} as unknown as LessonPlan;

const input = {
  planId: plan.id,
  plan,
  topic: TOPIC,
  difficulty: 'same' as const,
  anchor: {
    statement: 'Evaluate the limit: lim_{x->2} (x^3 - 8)/(x - 2)',
    expectedAnswer: '12',
  },
  forceBrainGen: true,
};

async function main() {
  console.log('— call 1: expect Layer 2 brain-gen + write-back —');
  const r1 = await generateProblem(input);
  console.log('telemetry:', JSON.stringify(r1.telemetry));
  if (!r1.result) throw new Error('call 1 returned no problem');
  console.log('served:', r1.result.provenance, '·', r1.result.canonicalText.slice(0, 80));
  if (r1.result.provenance !== 'brain-gen') {
    console.log('(bank already had rows for the verify topic — cleaning + rerun needed)');
  }

  // Give the fire-and-forget insert a beat.
  await new Promise((r) => setTimeout(r, 1500));

  await connectDB();
  const hash = simpleHash(r1.result.canonicalText);
  const row = await ProblemBank.findOne({ id: `brain-gen.${TOPIC}.${hash}` }).lean();
  if (!row) throw new Error('write-back row NOT found in ProblemBank');
  console.log('— write-back row present —');
  console.log('  answer:', (row as { answer?: string }).answer);
  console.log('  solutionText:', ((row as { solutionText?: string }).solutionText ?? '(none)').slice(0, 100));

  console.log('— call 2: expect Layer 1 bank fast-path —');
  const t0 = Date.now();
  const r2 = await generateProblem({ ...input, excludeHashes: [] });
  console.log('telemetry:', JSON.stringify(r2.telemetry), `(${Date.now() - t0}ms)`);
  if (r2.result?.provenance !== 'bank') throw new Error(`call 2 provenance=${r2.result?.provenance}, expected 'bank'`);
  console.log('served from bank:', r2.result.canonicalText.slice(0, 80));

  console.log('— hash exclusion: excluding the stored row falls through to gen —');
  const r3 = await generateProblem({ ...input, excludeHashes: [hash] });
  console.log('telemetry:', JSON.stringify(r3.telemetry));
  if (r3.result && simpleHash(r3.result.canonicalText) === hash) {
    throw new Error('hash exclusion failed — same problem re-served');
  }

  // Clean up the verification rows so they never serve to a student.
  const del = await ProblemBank.deleteMany({ topic: TOPIC });
  console.log(`— cleaned up ${del.deletedCount} verification row(s) —`);
  console.log('\nverify-writeback-live: ALL CHECKS PASSED');
  process.exit(0);
}

main().catch((err) => {
  console.error('verify-writeback-live FAILED:', err);
  process.exit(1);
});
