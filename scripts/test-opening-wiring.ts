/**
 * Unit test for Task B2 — pure orchestrator-wiring helpers
 * (src/lib/tutor/ai/opening-behavior.ts): detectEntryMode,
 * assembleOpeningInput, isPedagogyOpenerFlagValue.
 * See project_tutor_pedagogy_opener_calibration +
 * .superpowers/sdd/task-B2-brief.md.
 *
 * Run: npx tsx scripts/test-opening-wiring.ts
 * No framework — matches the test:pedagogy-b4/b5/b6 pattern.
 */

import { strict as assert } from 'node:assert';
import {
  detectEntryMode,
  assembleOpeningInput,
  isPedagogyOpenerFlagValue,
  type OpeningSignals,
} from '../src/lib/tutor/ai/opening-behavior';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

function main() {
  console.log('detectEntryMode / assembleOpeningInput / isPedagogyOpenerFlagValue — Task B2\n');

  // ── detectEntryMode ──────────────────────────────────────────────────
  test('detectEntryMode: undefined -> button', () => {
    assert.equal(detectEntryMode(undefined), 'button');
  });
  test('detectEntryMode: null -> button', () => {
    assert.equal(detectEntryMode(null), 'button');
  });
  test('detectEntryMode: empty string -> button', () => {
    assert.equal(detectEntryMode(''), 'button');
  });
  test('detectEntryMode: whitespace-only -> button', () => {
    assert.equal(detectEntryMode('   '), 'button');
  });
  test('detectEntryMode: "hi" -> typed-greeting', () => {
    assert.equal(detectEntryMode('hi'), 'typed-greeting');
  });
  test('detectEntryMode: "Hi!" (capitalized, punctuation) -> typed-greeting', () => {
    assert.equal(detectEntryMode('Hi!'), 'typed-greeting');
  });
  test('detectEntryMode: "hey there" -> typed-greeting', () => {
    assert.equal(detectEntryMode('hey there'), 'typed-greeting');
  });
  test('detectEntryMode: "hello" -> typed-greeting', () => {
    assert.equal(detectEntryMode('hello'), 'typed-greeting');
  });
  test('detectEntryMode: "yo" -> typed-greeting', () => {
    assert.equal(detectEntryMode('yo'), 'typed-greeting');
  });
  test('detectEntryMode: "hiya" -> typed-greeting', () => {
    assert.equal(detectEntryMode('hiya'), 'typed-greeting');
  });
  test('detectEntryMode: "sup" -> typed-greeting', () => {
    assert.equal(detectEntryMode('sup'), 'typed-greeting');
  });
  test('detectEntryMode: "hey" -> typed-greeting', () => {
    assert.equal(detectEntryMode('hey'), 'typed-greeting');
  });
  test('detectEntryMode: "hey, can you explain X?" -> typed-content (has \'?\')', () => {
    assert.equal(detectEntryMode('hey, can you explain X?'), 'typed-content');
  });
  test('detectEntryMode: "hi I need help with derivatives please" -> typed-content (>4 words)', () => {
    assert.equal(detectEntryMode('hi I need help with derivatives please'), 'typed-content');
  });
  test('detectEntryMode: "What is a derivative?" -> typed-content (not a greeting, has \'?\')', () => {
    assert.equal(detectEntryMode('What is a derivative?'), 'typed-content');
  });
  test('detectEntryMode: "Can you help me with limits" -> typed-content (not a greeting)', () => {
    assert.equal(detectEntryMode('Can you help me with limits'), 'typed-content');
  });
  test('detectEntryMode: "howdy" -> typed-content (not in the greeting list)', () => {
    assert.equal(detectEntryMode('howdy'), 'typed-content');
  });
  test('detectEntryMode: "hey hey hey hey hey" -> typed-content (>4 words even though it starts with hey)', () => {
    assert.equal(detectEntryMode('hey hey hey hey hey'), 'typed-content');
  });
  test('detectEntryMode: "hi, quick question?" -> typed-content (has \'?\')', () => {
    assert.equal(detectEntryMode('hi, quick question?'), 'typed-content');
  });
  test('detectEntryMode: exactly 4 words bare greeting -> typed-greeting boundary', () => {
    assert.equal(detectEntryMode('hey there tutor friend'), 'typed-greeting');
  });

  // ── assembleOpeningInput ─────────────────────────────────────────────
  test('assembleOpeningInput: fully-specified signals pass through unchanged', () => {
    const sig: OpeningSignals = {
      targetKind: 'lessonNode',
      isTrial: true,
      hasPortalContext: true,
      hasPriorSessions: true,
      diagnosticTaken: true,
      resume: { hasLiveCheckpoint: true, checkpointStale: true },
      nodeCompleted: true,
      courseComplete: true,
    };
    assert.deepEqual(assembleOpeningInput(sig), {
      targetKind: 'lessonNode',
      isTrial: true,
      hasPortalContext: true,
      hasPriorSessions: true,
      diagnosticTaken: true,
      resume: { hasLiveCheckpoint: true, checkpointStale: true },
      nodeCompleted: true,
      courseComplete: true,
    });
  });

  test('assembleOpeningInput: only required fields -> all optional booleans default false, resume defaults', () => {
    const sig: OpeningSignals = {
      targetKind: 'freestyle',
      isTrial: false,
      hasPortalContext: false,
    };
    assert.deepEqual(assembleOpeningInput(sig), {
      targetKind: 'freestyle',
      isTrial: false,
      hasPortalContext: false,
      hasPriorSessions: false,
      diagnosticTaken: false,
      resume: { hasLiveCheckpoint: false, checkpointStale: false },
      nodeCompleted: false,
      courseComplete: false,
    });
  });

  test('assembleOpeningInput: partial resume object still defaults missing booleans elsewhere', () => {
    const sig: OpeningSignals = {
      targetKind: 'diagnostic',
      isTrial: false,
      hasPortalContext: true,
      resume: { hasLiveCheckpoint: true, checkpointStale: false },
    };
    assert.deepEqual(assembleOpeningInput(sig), {
      targetKind: 'diagnostic',
      isTrial: false,
      hasPortalContext: true,
      hasPriorSessions: false,
      diagnosticTaken: false,
      resume: { hasLiveCheckpoint: true, checkpointStale: false },
      nodeCompleted: false,
      courseComplete: false,
    });
  });

  test('assembleOpeningInput: does not mutate the input object', () => {
    const sig: OpeningSignals = { targetKind: 'lessonNode', isTrial: false, hasPortalContext: true };
    const sigCopy = { ...sig };
    assembleOpeningInput(sig);
    assert.deepEqual(sig, sigCopy);
  });

  // ── isPedagogyOpenerFlagValue ─────────────────────────────────────────
  test('isPedagogyOpenerFlagValue: "true" -> true', () => {
    assert.equal(isPedagogyOpenerFlagValue('true'), true);
  });
  test('isPedagogyOpenerFlagValue: "on" -> true', () => {
    assert.equal(isPedagogyOpenerFlagValue('on'), true);
  });
  test('isPedagogyOpenerFlagValue: "false" -> false', () => {
    assert.equal(isPedagogyOpenerFlagValue('false'), false);
  });
  test('isPedagogyOpenerFlagValue: undefined -> false', () => {
    assert.equal(isPedagogyOpenerFlagValue(undefined), false);
  });
  test('isPedagogyOpenerFlagValue: "" -> false', () => {
    assert.equal(isPedagogyOpenerFlagValue(''), false);
  });
  test('isPedagogyOpenerFlagValue: "TRUE" (wrong case) -> false (exact match only, mirrors existing flag pattern)', () => {
    assert.equal(isPedagogyOpenerFlagValue('TRUE'), false);
  });

  // ── Summary ───────────────────────────────────────────────────────────
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
