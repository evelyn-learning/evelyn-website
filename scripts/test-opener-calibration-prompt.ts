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
  STALE_CHECKPOINT_REORIENT_CLAUSE,
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

  test('demo + button: bans the stock curtain-raiser lead-ins observed in live runs', () => {
    // Phrasing-variety tuning (2026-07-03): every live flag-ON opener used
    // the identical "here's a little puzzle to kick us off" framing — the
    // judge flagged it as templated across B2/B4/B6. The clause must name
    // the attractor phrasings as banned and push content-led openers.
    const clause = buildOpenerClause({
      ...baseCtx,
      openingPhase: true,
      sessionMode: 'demo',
      entryMode: 'button',
    });
    assert.ok(clause);
    assert.match(clause!, /curtain-raiser/);
    assert.match(clause!, /puzzle to kick us off/);
    assert.match(clause!, /let's dive in/);
    assert.match(clause!, /lead with the intriguing thing ITSELF/);
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
    assert.match(clause!, /greet them warmly by name/i);
    assert.match(clause!, /do NOT ask a returning student what they already know/i);
    assert.match(clause!, /NEVER repeat the same opening move twice in a row/i);
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
    assert.match(clause!, /greet them warmly by name/i);
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

  // ── stale-checkpoint re-orient nuance (resume-stale journey) ─────────────
  test('STALE_CHECKPOINT_REORIENT_CLAUSE: one-line re-orient before the opener, no full calibration, no restore-pretend', () => {
    assert.match(STALE_CHECKPOINT_REORIENT_CLAUSE, /mid-way through this lesson a while ago/);
    assert.match(STALE_CHECKPOINT_REORIENT_CLAUSE, /too old to\s?restore/);
    assert.match(STALE_CHECKPOINT_REORIENT_CLAUSE, /re-orient them briefly/);
    assert.match(STALE_CHECKPOINT_REORIENT_CLAUSE, /'we were working on X'/);
    assert.match(STALE_CHECKPOINT_REORIENT_CLAUSE, /before the opener/);
    assert.match(STALE_CHECKPOINT_REORIENT_CLAUSE, /do not run full get-to-know-you calibration/);
  });

  test('STALE_CHECKPOINT_REORIENT_CLAUSE: generic (names no topic/subject) per feedback_generic_prompts', () => {
    assert.doesNotMatch(STALE_CHECKPOINT_REORIENT_CLAUSE, /quadratic|fraction|biology|respiration|algebra/i);
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

  // ── agenda rail preview (Task 4) ─────────────────────────────────────────
  test('agenda clause present and FIRST when agendaItemCount > 0', () => {
    const c = buildOpenerClause({ ...baseCtx, openingPhase: true, agendaItemCount: 3 })!;
    assert(c.includes('agenda rail'), 'names the rail, not a card');
    assert(!c.includes('"Agenda" card'), 'card wording gone');
    assert(c.trimStart().startsWith('Above the board'), 'clause anchored first');
  });
  test('agenda clause absent at count 0, ban unconditional', () => {
    const c = buildOpenerClause({ ...baseCtx, openingPhase: true, agendaItemCount: 0 })!;
    assert(!c.includes('agenda rail'), 'no clause');
    assert(c.includes('Today we are going to learn'), 'plain ban present in demo branch');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
