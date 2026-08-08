/**
 * E3 prompt-pin test (prod session 2026-08-06/07): the brain twice negated
 * CORRECT student answers in the same session —
 *  (a) "2 comma 3" for the next lattice point on y=-1/2x+4 from (0,4): the
 *      turn opened "Not quite," then derived (2,3) itself — the exact
 *      point the student gave.
 *  (b) "10" for Δcost = 2×5: the turn misread it as the problem's
 *      unrelated $10 flat fee and marked a correct answer wrong.
 * The pre-existing verdict-correctness rule ("Your verdict must agree
 * with your own explanation") didn't prevent either — this pins the two
 * strengthening rules added directly below it: "Derive before you deny"
 * (compute the expected answer FIRST, in the student's form, before
 * picking a corrective opener) and "Ambiguous short answers resolve
 * toward the student" (a short answer that matches the actual expected
 * value, or is genuinely ambiguous between two live quantities, never
 * opens with "Not quite").
 *
 * Limitation: this is a static text-presence check on the BUILT prompt,
 * not a live-model behavioral test — it proves the rule text ships, not
 * that the model obeys it. The repo's model-behavior harness is the
 * pedagogy-harness (scripts/tutor/pedagogy-harness) driven by an LLM
 * student simulator; adding a scripted case there is future follow-up if
 * this rule needs a live-model regression guard.
 *
 * Run: npx tsx scripts/test-verdict-charity-rules.ts
 */

import { strict as assert } from 'node:assert';
import { buildSystemPrompt, type SystemPromptContext } from '../src/lib/tutor/ai/system-prompt-builder';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

const baseCtx: SystemPromptContext = { module: null, studentName: 'Ravi' };
const prompt = buildSystemPrompt(baseCtx);

test('prompt requires deriving the expected answer BEFORE denying', () => {
  assert.ok(prompt.includes('Derive before you deny'), 'rule header present');
  assert.ok(
    prompt.includes('Never speak "Not quite" / "Close" / "Hmm" until you have silently computed the expected answer YOURSELF'),
    'rule states derive-first ordering',
  );
});

test('prompt cites the (2,3) lattice-point incident as the derive-first failure case', () => {
  assert.ok(prompt.includes('"2 comma 3"'), 'cites the student\'s literal utterance');
  assert.ok(prompt.includes('contradicting its own opener'), 'names the failure shape');
});

test('prompt requires ambiguous short answers resolve toward the student', () => {
  assert.ok(prompt.includes('Ambiguous short answers resolve toward the student'), 'rule header present');
  assert.ok(
    prompt.includes('do NOT open with "Not quite"'),
    'rule bans opening with "Not quite" on an ambiguous match',
  );
});

test('prompt cites the Δcost/flat-fee incident as the ambiguity failure case', () => {
  assert.ok(prompt.includes('\\Delta\\text{cost}'), 'cites the delta-cost expression');
  assert.ok(prompt.includes('$10 flat fee'), 'names the confounding quantity');
});

test('both new rules are HARD RULEs, matching the file\'s severity convention', () => {
  assert.ok(prompt.includes('Derive before you deny (HARD RULE)'));
  assert.ok(prompt.includes('Ambiguous short answers resolve toward the student, not away from them (HARD RULE)'));
});

// Final-review fix (Rule 12(b) prompt/code contradiction): the prompt
// used to tell the brain a verbal whole-LO skip was "the only way to
// bypass the try_yourself requirement" with no scoping — but E6's
// checkGeneratedPlanAdvance (lesson-plan/context.ts) forecloses cross-LO
// jumps on runtime-generated plans unconditionally, so the model would
// attempt a move that always gets rejected (a killed turn + retry, every
// time). Pins that Rule 12(b) now scopes the skip to plans where the
// system doesn't already enforce LO order.
test('Rule 12(b) scopes the verbal whole-LO skip to system-enforced generated plans', () => {
  assert.ok(
    prompt.includes('On a runtime-generated plan'),
    'rule names the generated-plan case',
  );
  assert.ok(
    prompt.includes('LO order is enforced by the system instead'),
    'rule states the system enforces order on generated plans',
  );
  assert.ok(
    prompt.includes("decline the skip with a brief explanation and advance with 'next'"),
    'rule instructs decline + advance-with-next instead of attempting the jump',
  );
});

// recap-wrapup-fix (root cause: prod session portal-db21d8f2 — student
// wrapped up early from lo-10-concept ("I'm done, can you recap the
// whole thing?"). E6's checkGeneratedPlanAdvance gated the explicit
// jump to 'recap' behind every LO's "-try" being complete; 'next' would
// have forced remaining worked/try segments on the departing student;
// neither path reached the recap segment, so the model improvised a
// spoken-only recap (having to ask what to recap, since it never saw
// the segment's authored content) and rendered nothing on the board.
// Fix 1 (context.ts) makes the explicit jump unconditional; this rule
// is Fix 2 — tells the brain to actually TAKE that jump on a wrap-up
// signal, and to render the authored recap card once there instead of
// improvising.
test('Rule 12(c) is labeled and carries the soft-wrap path: jump to "recap" instead of forcing "next"', () => {
  assert.ok(
    prompt.includes('Rule 12(c) — Wrapping up early on a generated plan'),
    'rule has an actual label matching file convention (Rule N letter), not just a bare bold header',
  );
  assert.ok(
    prompt.includes('Do NOT call advance_lesson({to: "next"}) — that forces the remaining worked_example / try_yourself segments on a student who is already leaving'),
    'rule bans forcing next on a departing student',
  );
  assert.ok(
    prompt.includes('advance_lesson({to: "recap"}) directly by that explicit id'),
    'rule instructs the explicit recap jump',
  );
  assert.ok(
    prompt.includes('this jump is ALWAYS allowed, from any segment, at any completion state'),
    'rule states the jump is unconditional, matching Fix 1 in context.ts',
  );
});

test('Rule 12(c) requires show_segment_card on entering recap, gated by the Rule 13 boardSnapshot dedup signal', () => {
  assert.ok(
    prompt.includes('call show_segment_card({segmentId: "recap"}) in the SAME turn UNLESS your boardSnapshot already lists a "Recap" card for this segment'),
    'rule requires the recap card render in the same turn as the advance, unless the boardSnapshot already shows it',
  );
  assert.ok(
    prompt.includes("Rule 13's dedup convention — it means an earlier turn already rendered it; don't re-emit"),
    'rule spells out the "already shown" signal explicitly via the Rule 13 dedup convention (review fix #4)',
  );
  assert.ok(
    prompt.includes('Do not improvise a spoken-only recap from memory'),
    'rule bans the spoken-only improvised recap that caused the prod failure',
  );
});

// CRITICAL review fix: buildRecapSegment stamps EVERY LO into mustRemember
// at generation time — right for a completed run, wrong for an early exit,
// which is the whole point of this fix. The prompt must tell the brain the
// card it's about to see is ALREADY scoped (filterRecapMustRemember,
// context.ts, applied at render time) — otherwise the brain has no reason
// not to also narrate/invent takeaways for LOs it never taught.
test('Rule 12(c) tells the brain the recap card is scoped to LOs actually covered this session', () => {
  assert.ok(
    prompt.includes('the runtime scopes the card to the LO groups you actually covered this session (never the plan\'s full LO list)'),
    'rule states the card is pre-scoped to covered LOs, not the full plan LO list',
  );
  assert.ok(
    prompt.includes('walk THOSE takeaways only, one per covered LO'),
    'rule instructs walking only the covered takeaways, not the full mustRemember set',
  );
});

// IMPORTANT review fix: the original carve-out fired on EVERY session-end
// trigger phrase, including abrupt "stop" / "gotta go" exits where forcing
// a recap card + walkthrough is exactly the kind of thing that makes an
// already-leaving student repeat themselves. Two tiers: soft wrap (recap
// ask / unhurried close / all-LOs-done) gets the card; hard stop (abrupt
// exit language) gets AT MOST one offer, never a mandate.
test('Rule 12(c) splits soft wrap-up from hard stop — the recap card is never mandatory on an abrupt exit', () => {
  assert.ok(prompt.includes('**Soft wrap (default)**'), 'soft-wrap tier is labeled');
  assert.ok(prompt.includes('**Hard stop**'), 'hard-stop tier is labeled');
  assert.ok(
    prompt.includes('abrupt/dismissive exit language ("stop", "let\'s just call it here", "gotta go", "quit", "exit")'),
    'hard-stop tier names abrupt exit phrasing distinct from the soft-wrap phrasing',
  );
  assert.ok(
    prompt.includes('The recap card is PERMITTED here but never MANDATED'),
    'hard-stop tier states the card is optional, not required',
  );
  assert.ok(
    prompt.includes('Make AT MOST one short offer'),
    'hard-stop tier bounds the offer to a single ask',
  );
  assert.ok(
    prompt.includes('do not push the card or a mustRemember walkthrough on a student who is already out the door'),
    'hard-stop tier bans pushing the walkthrough on a clearly-final exit',
  );
});

test('Session-end signals HARD RULE carves out the recap-card exception, labeled Rule 12(c) and marked permitted-not-required', () => {
  assert.ok(
    prompt.includes('EXCEPT the one carve-out in Rule 12(c) above'),
    'session-end rule references Rule 12(c) by its actual label (review fix #3)',
  );
  assert.ok(
    prompt.includes('whose "recap" segment isn\'t already in your boardSnapshot (Rule 13\'s dedup signal for "already shown")'),
    'session-end carve-out spells out the "hasn\'t been shown yet" signal via the Rule 13 boardSnapshot convention (review fix #4)',
  );
  assert.ok(
    prompt.includes('you may advance to it and call show_segment_card({segmentId: "recap"}) as PART of wrapping up'),
    'session-end rule explicitly allows (not mandates) the recap show_segment_card call',
  );
  assert.ok(
    prompt.includes('This is PERMITTED, not mandatory'),
    'session-end carve-out explicitly states permitted-not-required (review fix #2)',
  );
  assert.ok(
    prompt.includes('a hard-stop trigger phrase below does NOT by itself require the card'),
    'session-end carve-out states a hard-stop trigger alone never mandates the card',
  );
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
