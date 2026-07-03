/**
 * Unit test for Task B4 — opener + calibration prompt clause
 * (src/lib/tutor/ai/system-prompt-builder.ts — buildOpenerClause +
 * buildSystemPrompt gating). See project_tutor_pedagogy_opener_calibration.
 *
 * Run: npx tsx scripts/test-opener-calibration-prompt.ts
 * No framework — matches the test:conic / test:graph-consistency pattern.
 */

import { strict as assert } from 'node:assert';
import {
  buildOpenerClause,
  buildSystemPrompt,
  type SystemPromptContext,
} from '../src/lib/tutor/ai/system-prompt-builder';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

const baseCtx: SystemPromptContext = {
  module: null,
  studentName: 'Ravi',
};

function main() {
  console.log('Opener + calibration prompt clause — Task B4\n');

  // ── buildOpenerClause gating ─────────────────────────────────────────────
  test('buildOpenerClause: returns null when openingPhase is falsy (absent)', () => {
    assert.equal(buildOpenerClause({ ...baseCtx }), null);
  });

  test('buildOpenerClause: returns null when openingPhase is explicitly false', () => {
    assert.equal(buildOpenerClause({ ...baseCtx, openingPhase: false }), null);
  });

  // ── demo + entryMode button ──────────────────────────────────────────────
  test('demo + button: contains act-first/intrigue directive, forbids "Today we are going to learn"', () => {
    const clause = buildOpenerClause({
      ...baseCtx,
      openingPhase: true,
      sessionMode: 'demo',
      entryMode: 'button',
    });
    assert.ok(clause, 'clause should not be null');
    assert.match(clause!, /ACTING FIRST/);
    assert.match(clause!, /intriguing/);
    assert.match(clause!, /Today we are going to learn/);
    assert.doesNotMatch(clause!, /what (do|they) you already know/i);
    assert.doesNotMatch(clause!, /what they already know/i);
  });

  // ── subscribed + isReturning ──────────────────────────────────────────────
  test('subscribed + isReturning: warm-resume + no-ask + no-repeat, not the demo intent probe', () => {
    const clause = buildOpenerClause({
      ...baseCtx,
      openingPhase: true,
      sessionMode: 'subscribed',
      isReturning: true,
      entryMode: 'button',
    });
    assert.ok(clause, 'clause should not be null');
    assert.match(clause!, /warm and personal/i);
    assert.match(clause!, /do NOT ask a returning student what they already know/i);
    assert.match(clause!, /NEVER repeat an opener or the same KIND of opener twice in a row/i);
    assert.doesNotMatch(clause!, /thinking about joining/i);
  });

  // ── entryMode typed-content ──────────────────────────────────────────────
  test('typed-content: respond to their message + weave calibration, not a canned reset', () => {
    const clause = buildOpenerClause({
      ...baseCtx,
      openingPhase: true,
      sessionMode: 'demo',
      entryMode: 'typed-content',
    });
    assert.ok(clause, 'clause should not be null');
    assert.match(clause!, /respond to THAT directly/i);
    assert.match(clause!, /weave in only the calibration you still need/i);
    assert.match(clause!, /never a canned/i);
  });

  test('typed-content overrides sessionMode/isReturning branching (still the respond-directly clause)', () => {
    const clause = buildOpenerClause({
      ...baseCtx,
      openingPhase: true,
      sessionMode: 'subscribed',
      isReturning: true,
      entryMode: 'typed-content',
    });
    assert.ok(clause, 'clause should not be null');
    assert.match(clause!, /respond to THAT directly/i);
  });

  // ── entryMode typed-greeting behaves like the full opener ────────────────
  test('typed-greeting + demo: same as the full act-first opener', () => {
    const clause = buildOpenerClause({
      ...baseCtx,
      openingPhase: true,
      sessionMode: 'demo',
      entryMode: 'typed-greeting',
    });
    assert.ok(clause, 'clause should not be null');
    assert.match(clause!, /ACTING FIRST/);
  });

  test('typed-greeting + subscribed+isReturning: same as the warm-resume opener', () => {
    const clause = buildOpenerClause({
      ...baseCtx,
      openingPhase: true,
      sessionMode: 'subscribed',
      isReturning: true,
      entryMode: 'typed-greeting',
    });
    assert.ok(clause, 'clause should not be null');
    assert.match(clause!, /warm and personal/i);
  });

  // ── first-ever subscribed session (not returning) falls to the demo/act-first path ──
  test('subscribed + NOT isReturning: falls back to the act-first opener (first-ever)', () => {
    const clause = buildOpenerClause({
      ...baseCtx,
      openingPhase: true,
      sessionMode: 'subscribed',
      isReturning: false,
      entryMode: 'button',
    });
    assert.ok(clause, 'clause should not be null');
    assert.match(clause!, /ACTING FIRST/);
  });

  // ── no studentName ────────────────────────────────────────────────────────
  test('no studentName: clause instructs greeting without a name / never speak a placeholder', () => {
    const clause = buildOpenerClause({
      module: null,
      openingPhase: true,
      sessionMode: 'demo',
      entryMode: 'button',
      // studentName intentionally omitted
    });
    assert.ok(clause, 'clause should not be null');
    assert.match(clause!, /without a name/i);
    assert.match(clause!, /never speak a placeholder/i);
  });

  test('studentName present: clause does NOT append the no-name instruction', () => {
    const clause = buildOpenerClause({
      ...baseCtx,
      openingPhase: true,
      sessionMode: 'demo',
      entryMode: 'button',
    });
    assert.ok(clause, 'clause should not be null');
    assert.doesNotMatch(clause!, /never speak a placeholder/i);
  });

  // ── buildSystemPrompt wiring ──────────────────────────────────────────────
  test('buildSystemPrompt: legacy callers (openingPhase absent) are byte-for-byte unchanged vs. no new fields at all', () => {
    const legacyCtx: SystemPromptContext = { module: null, studentName: 'Ravi', sessionGoal: 'general' };
    const withUnsetNewFields: SystemPromptContext = {
      module: null,
      studentName: 'Ravi',
      sessionGoal: 'general',
      sessionMode: undefined,
      openingPhase: undefined,
      entryMode: undefined,
      isReturning: undefined,
    };
    const a = buildSystemPrompt(legacyCtx);
    const b = buildSystemPrompt(withUnsetNewFields);
    assert.equal(a, b, 'prompt must be byte-identical when new fields are absent/undefined');
    // Boring greeting path still present for legacy callers.
    assert.match(a, /Hey \[name\]!/);
    assert.doesNotMatch(a, /This Turn: Session Opener/);
  });

  test('buildSystemPrompt: includes the opener clause when openingPhase is true', () => {
    const ctx: SystemPromptContext = {
      module: null,
      studentName: 'Ravi',
      sessionGoal: 'general',
      sessionMode: 'demo',
      openingPhase: true,
      entryMode: 'button',
    };
    const prompt = buildSystemPrompt(ctx);
    assert.match(prompt, /This Turn: Session Opener/);
    assert.match(prompt, /ACTING FIRST/);
    // Legacy boring-opener text is still present elsewhere in BASE_PROMPT
    // (this task only ADDS the new clause; it doesn't strip the old text).
    assert.match(prompt, /Hey \[name\]!/);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
