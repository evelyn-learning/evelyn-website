/**
 * Unit test for the portal resume snapshot builder's stale-checkpoint
 * resolver (src/lib/tutor/portal/resume.ts — resolveResumeOutcome, the
 * additive wrapper over buildResumeState that distinguishes "checkpoint
 * existed but was stale" from "no checkpoint at all", which is what makes
 * the resume-stale opening journey reachable).
 *
 * Run: npx tsx scripts/test-portal-resume.ts   (npm run test:pedagogy-resume)
 * No framework — matches the test:pedagogy-b2/b4/b6 pattern.
 */

import { strict as assert } from 'node:assert';
import { RESUME_MAX_AGE_MS } from '@evelyn/portal-contract/v1';
import {
  buildResumeState,
  resolveResumeOutcome,
  isCheckpointResumable,
  type PriorSessionRead,
} from '../apps/marketing/src/lib/tutor/portal/resume';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

/** A prior-session read with a positioned checkpoint at the given age. */
function readWithCheckpoint(updatedAt: string | undefined): PriorSessionRead {
  return {
    exists: true,
    lessonProgress: {
      lessonPlanId: 'evelyn.hs.science.biology.cellular-respiration.v1',
      currentSegmentId: 'concept-2',
      completedSegmentIds: ['hook', 'concept-1'],
      updatedAt,
    },
    transcript: [{ role: 'tutor', text: 'Where were we…', timestamp: new Date().toISOString() }],
    whiteboardCommands: [],
  };
}

const FRESH_AT = new Date(Date.now() - 60_000).toISOString(); // 1 min ago
const STALE_AT = new Date(Date.now() - RESUME_MAX_AGE_MS - 60_000).toISOString(); // just past the window

function main() {
  console.log('resolveResumeOutcome — portal resume stale-checkpoint resolver\n');

  test('fresh checkpoint ⇒ { state: <snapshot>, hadStaleCheckpoint: false }', () => {
    const out = resolveResumeOutcome(readWithCheckpoint(FRESH_AT));
    assert.ok(out.state, 'snapshot built');
    assert.equal(out.state!.currentSegmentId, 'concept-2');
    assert.deepEqual(out.state!.completedSegmentIds, ['hook', 'concept-1']);
    assert.equal(out.hadStaleCheckpoint, false);
  });

  test('stale checkpoint ⇒ { state: null, hadStaleCheckpoint: true }', () => {
    const data = readWithCheckpoint(STALE_AT);
    assert.equal(isCheckpointResumable(STALE_AT), false, 'fixture sanity: really stale');
    const out = resolveResumeOutcome(data);
    assert.equal(out.state, null);
    assert.equal(out.hadStaleCheckpoint, true);
  });

  test('no checkpoint at all ⇒ { state: null, hadStaleCheckpoint: false }', () => {
    assert.deepEqual(resolveResumeOutcome({ exists: true, lessonProgress: null }), { state: null, hadStaleCheckpoint: false });
    assert.deepEqual(resolveResumeOutcome({ exists: false }), { state: null, hadStaleCheckpoint: false });
    assert.deepEqual(resolveResumeOutcome(null), { state: null, hadStaleCheckpoint: false });
    assert.deepEqual(resolveResumeOutcome(undefined), { state: null, hadStaleCheckpoint: false });
  });

  test('checkpoint without a lessonPlanId (never positioned) ⇒ null + NOT stale', () => {
    const out = resolveResumeOutcome({
      exists: true,
      lessonProgress: { currentSegmentId: 'x', completedSegmentIds: [], updatedAt: FRESH_AT },
    });
    assert.deepEqual(out, { state: null, hadStaleCheckpoint: false });
  });

  test('positioned checkpoint with missing updatedAt ⇒ null + stale (exists but cannot be proven fresh)', () => {
    const out = resolveResumeOutcome(readWithCheckpoint(undefined));
    assert.equal(out.state, null);
    assert.equal(out.hadStaleCheckpoint, true);
  });

  test('state/staleness are mutually exclusive: never both a state and hadStaleCheckpoint', () => {
    for (const data of [readWithCheckpoint(FRESH_AT), readWithCheckpoint(STALE_AT), readWithCheckpoint(undefined), null]) {
      const out = resolveResumeOutcome(data);
      assert.ok(!(out.state && out.hadStaleCheckpoint), 'at most one of state / hadStaleCheckpoint');
    }
  });

  test('additive: resolveResumeOutcome.state deep-equals buildResumeState for the same input', () => {
    for (const data of [readWithCheckpoint(FRESH_AT), readWithCheckpoint(STALE_AT), null, undefined]) {
      assert.deepEqual(resolveResumeOutcome(data).state, buildResumeState(data));
    }
  });

  // 2026-07-19 replay-timeline fix: the resume snapshot must carry each
  // whiteboard command's ORIGINAL draw stamp (parallel array) so the seed
  // replay doesn't re-stamp the restored board to the resume moment
  // (session-1784507935152 drew in attempt 1, resumed ~20min later → whole
  // board landed off the end of the replay timeline).
  test('buildResumeState carries whiteboardCommandStamps in command order', () => {
    const read = readWithCheckpoint(FRESH_AT);
    read.whiteboardCommands = [
      { action: 'showEquation', data: { latex: 'x^2=1' }, timestamp: '2026-07-20T00:39:42.000Z', sourceMessageIndex: 0 },
      { action: 'showProblem', data: { problem: {} }, timestamp: '2026-07-20T00:41:23.000Z', sourceMessageIndex: 4 },
    ];
    const state = buildResumeState(read);
    assert.ok(state, 'fresh checkpoint builds a state');
    assert.equal(state!.whiteboardCommands.length, 2);
    assert.deepEqual(state!.whiteboardCommandStamps, [
      { timestamp: '2026-07-20T00:39:42.000Z', sourceMessageIndex: 0 },
      { timestamp: '2026-07-20T00:41:23.000Z', sourceMessageIndex: 4 },
    ]);
    // Command objects still reconstructed with action restored last.
    assert.equal(state!.whiteboardCommands[0].action, 'showEquation');
  });

  test('buildResumeState: legacy commands without a timestamp yield an empty stamp (persistence falls back to now)', () => {
    const read = readWithCheckpoint(FRESH_AT);
    read.whiteboardCommands = [{ action: 'showDiagram', data: {} }];
    const state = buildResumeState(read);
    assert.deepEqual(state!.whiteboardCommandStamps, [{ timestamp: '' }]);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
