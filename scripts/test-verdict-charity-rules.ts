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

console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exit(1);
