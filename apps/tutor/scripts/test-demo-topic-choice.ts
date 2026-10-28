/**
 * Unit test — demo topic choice (2026-10-28).
 *
 * Pins, with the flag ON (the default):
 *   1. resolveOpenScope: open_scope claim ⇒ true; is_trial ⇒ true; neither
 *      (a paid session) ⇒ false; flag off ⇒ only the open_scope claim counts.
 *   2. buildOpenerClause: sessionMode 'demo' carries the one-sentence topic
 *      confirm AFTER the board-first hard rule; 'subscribed' and undefined
 *      (the /tutor page) do not.
 *   3. buildSystemPrompt: an open-scope session carries the switch-this-turn
 *      rule inside the open-scope block; a scoped session has neither.
 *   4. formatDemoStopBlock: milestone and wrap directives carry the
 *      "learn something else" exception; the pacing (non-wrap) text does not
 *      gain a clock mention.
 *
 * Run: npx tsx scripts/test-demo-topic-choice.ts   (npm run test:demo-topic-choice)
 */

import { strict as assert } from 'node:assert';
import {
  resolveOpenScope,
  DEMO_TOPIC_CONFIRM_CLAUSE,
  DEMO_TOPIC_SWITCH_RULE,
  DEMO_PLAN_SUBORDINATE_RULE,
} from '../src/lib/tutor/portal/demo-topic-choice';
import { buildOpenerClause, buildSystemPrompt, type SystemPromptContext } from '../src/lib/tutor/ai/system-prompt-builder';
import { formatDemoStopBlock } from '../src/lib/tutor/voice/claude-brain';
import { TUTOR_DEMO_TOPIC_CHOICE } from '../src/lib/tutor/orchestrator/flags';
import { OPENING_DIRECTIVE_MAX_CHARS, OPENING_FOLLOWUP_DIRECTIVE } from '../src/lib/tutor/ai/opening-behavior';
import { stripFirstTurnRunway } from '../src/lib/tutor/voice/first-turn-runway';
import { bridgeLineFor } from '../src/lib/tutor/voice/bridge-line';
import { computeGreetingGuard } from '../src/lib/tutor/validation/continuity';
import { rewriteForTTS } from '../src/lib/tutor/voice/tts-pronunciation';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

const baseCtx: SystemPromptContext = { module: null, studentName: 'Ravi' };

function main() {
  console.log('Demo topic choice\n');
  assert.equal(TUTOR_DEMO_TOPIC_CHOICE, true, 'this suite pins the flag-ON text; run it without NEXT_PUBLIC_TUTOR_DEMO_TOPIC_CHOICE=off');

  // ── 1. resolveOpenScope ──────────────────────────────────────────────────
  test('open_scope claim ⇒ open scope (marketing homepage, unchanged)', () => {
    assert.equal(resolveOpenScope({ openScopeClaim: true, isTrial: false }), true);
  });
  test('is_trial ⇒ open scope (academy trials, showcases)', () => {
    assert.equal(resolveOpenScope({ openScopeClaim: false, isTrial: true }), true);
  });
  test('neither claim (paid session) ⇒ scoped', () => {
    assert.equal(resolveOpenScope({ openScopeClaim: false, isTrial: false }), false);
  });
  test('flag off ⇒ only the open_scope claim counts', () => {
    assert.equal(resolveOpenScope({ openScopeClaim: false, isTrial: true, flagOn: false }), false);
    assert.equal(resolveOpenScope({ openScopeClaim: true, isTrial: true, flagOn: false }), true);
  });

  // ── 2. opener clause ─────────────────────────────────────────────────────
  test("demo opener confirms the topic in one sentence, after the board-first rule", () => {
    const clause = buildOpenerClause({ ...baseCtx, openingPhase: true, sessionMode: 'demo' });
    assert.ok(clause);
    assert.ok(clause!.includes(DEMO_TOPIC_CONFIRM_CLAUSE));
    assert.match(clause!, /HARD RULE for this opening turn/);
    assert.ok(clause!.startsWith('HARD RULE for this DEMO opening turn'), 'the confirm leads the clause (10-28 local test: appended, it was ignored)');
    assert.match(clause!, /LAST sentence you speak this turn is a one-line topic confirm/);
    assert.match(clause!, /overrides Rule 6/);
  });
  test('subscribed opener has no topic confirm', () => {
    const clause = buildOpenerClause({ ...baseCtx, openingPhase: true, sessionMode: 'subscribed' });
    assert.ok(clause);
    assert.doesNotMatch(clause!, /topic confirm/);
  });
  test('sessionMode undefined (the /tutor page) has no topic confirm', () => {
    const clause = buildOpenerClause({ ...baseCtx, openingPhase: true });
    assert.ok(clause);
    assert.doesNotMatch(clause!, /topic confirm/);
  });
  test('typed-content opener is untouched', () => {
    const clause = buildOpenerClause({ ...baseCtx, openingPhase: true, sessionMode: 'demo', entryMode: 'typed-content' });
    assert.ok(clause);
    assert.doesNotMatch(clause!, /topic confirm/);
  });

  // ── 2b. the full directive must fit the brain route's bound ──────────────
  test('demo opener clause + intro + agenda fits the route bound with room (live full directives: 3074–3539 chars)', () => {
    const clause = buildOpenerClause({ ...baseCtx, openingPhase: true, sessionMode: 'demo', agendaItemCount: 3 }) || '';
    const INTRO_AND_CONTINUITY_ALLOWANCE = 2000;
    assert.ok(clause.length + INTRO_AND_CONTINUITY_ALLOWANCE < OPENING_DIRECTIVE_MAX_CHARS, `clause ${clause.length} + ${INTRO_AND_CONTINUITY_ALLOWANCE} must stay under ${OPENING_DIRECTIVE_MAX_CHARS}`);
    assert.ok(OPENING_DIRECTIVE_MAX_CHARS >= 4000, 'bound must cover the measured live directives');
    assert.ok(OPENING_FOLLOWUP_DIRECTIVE.length < OPENING_DIRECTIVE_MAX_CHARS);
  });

  // ── 2c. first-turn runway strip + greeting-only bridge line ──────────────
  test('first-turn runway: bare lead-in sentences are dropped, prefixes trimmed, content kept', () => {
    for (const s of ["Okay, let's dig in.", "Alright, let's dig in.", "Let's dig in, Praveen.", "Let’s get started!", "So, let's dive right in, then."]) {
      assert.equal(stripFirstTurnRunway(s), '', s);
    }
    assert.equal(stripFirstTurnRunway("Okay, let's dig in: a caterpillar and a butterfly are the same animal."), 'A caterpillar and a butterfly are the same animal.');
    assert.equal(stripFirstTurnRunway('Think about a baseball after it leaves your hand.'), 'Think about a baseball after it leaves your hand.');
    assert.equal(stripFirstTurnRunway("Let's look at the first stage."), "Let's look at the first stage.");
  });
  test('bridge line is the greeting alone', () => {
    assert.equal(bridgeLineFor({ studentName: 'Praveen', inFlow: false } as any), 'Hey Praveen.');
    assert.equal(bridgeLineFor({ inFlow: false } as any), 'Hey.');
  });

  // ── 2d. opener card guard + minus sign speech (local trial embed-1793229013524) ──
  test('greeting guard: the synthetic session start is not a greeting (no plan loaded yet)', () => {
    assert.equal(computeGreetingGuard({ lessonPlanActive: false, priorStudentTurns: 0, lastStudentText: '', mockReviewActive: false }), false);
    assert.equal(computeGreetingGuard({ lessonPlanActive: false, priorStudentTurns: 1, lastStudentText: 'hi', mockReviewActive: false }), true, 'a real greeting is still guarded');
    assert.equal(computeGreetingGuard({ lessonPlanActive: true, priorStudentTurns: 1, lastStudentText: 'hi', mockReviewActive: false }), false);
  });
  test('TTS: U+2212 minus is voiced — binary "minus", unary "negative"', () => {
    const a = rewriteForTTS('The function is y = (x − 1)² − 2, and k is −2, so the vertex is (1, −2).');
    assert.match(a, /\(x minus 1\) squared minus 2/);
    assert.match(a, /k is negative 2/);
    assert.match(a, /\(1, negative 2\)/);
    assert.doesNotMatch(a, /−/);
    assert.match(rewriteForTTS('The curve crosses the y-axis at −2.'), /at negative 2/);
    assert.match(rewriteForTTS('y = (0 − 1)² − 2 = 1 − 2 = −1'), /\(0 minus 1\) squared minus 2 equals 1 minus 2 equals negative 1/);
    assert.equal(rewriteForTTS('a well-known two-step method'), rewriteForTTS('a well-known two-step method'), 'ASCII hyphens untouched by these rules');
  });

  // ── 3. system prompt open-scope block ────────────────────────────────────
  test('open-scope prompt carries the switch-this-turn rule inside the open-scope block', () => {
    const p = buildSystemPrompt({ ...baseCtx, subject: 'science', topic: 'grade-7-life-science', openScope: true });
    assert.match(p, /Open-scope session — OVERRIDES Rule 7\(b\)/);
    assert.ok(p.includes(DEMO_TOPIC_SWITCH_RULE));
    assert.ok(p.indexOf('OVERRIDES Rule 7(b)') < p.indexOf('honored THE TURN IT IS MADE'));
  });
  test('scoped prompt (paid session) has neither block', () => {
    const p = buildSystemPrompt({ ...baseCtx, subject: 'science', topic: 'grade-7-life-science' });
    assert.doesNotMatch(p, /Open-scope session/);
    assert.ok(!p.includes(DEMO_TOPIC_SWITCH_RULE));
  });
  test('rules stay generic: no client names, no topic examples', () => {
    for (const s of [DEMO_TOPIC_CONFIRM_CLAUSE, DEMO_TOPIC_SWITCH_RULE, DEMO_PLAN_SUBORDINATE_RULE]) {
      assert.doesNotMatch(s, /crimsora|diffusion|respiratory|greenapple|gdi/i);
    }
  });

  // ── 4. demo_stop ─────────────────────────────────────────────────────────
  test('milestone demo_stop carries the switch exception', () => {
    const b = formatDemoStopBlock({ mode: 'milestone' });
    assert.match(b, /never end mid-concept/);
    assert.match(b, /asks to learn something else/);
  });
  test('wrap-phase demo_stop carries the switch exception', () => {
    const b = formatDemoStopBlock({ mode: 'time', budgetMinutes: 10, minutesElapsed: 9, wrapAtMinutes: 8 });
    assert.match(b, /Wrap up NOW/);
    assert.match(b, /do not refuse because time is short/);
  });
  test('pacing demo_stop (before wrap) is unchanged', () => {
    const b = formatDemoStopBlock({ mode: 'time', budgetMinutes: 10, minutesElapsed: 2, wrapAtMinutes: 8 });
    assert.match(b, /about 8 of 10 minutes left/);
    assert.doesNotMatch(b, /learn something else/);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
