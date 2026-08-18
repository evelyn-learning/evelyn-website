/**
 * Define-before-quiz prompt rule (2026-08-17 triage): across two AP Gov
 * sessions the tutor quizzed on terms it had never introduced — asked what
 * the delegates fought over before ever saying the words "this is called
 * the Constitutional Convention" (student: "I don't know what the
 * constitutional convention is"), and pivoted into a House-vs-Electoral-
 * College comparison when the student had said twice she had little
 * politics background ("I don't know what the electoral college or the
 * house is... could you explain that to me first"). The rule: a term can't
 * be the pivot of a question before it's been introduced in-session or
 * confirmed known.
 *
 * Run: npx tsx scripts/test-define-before-quiz-prompt.ts
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

test('prompt has the define-before-quiz rule', () => {
  assert.ok(/never quiz on a term you haven'?t introduced/i.test(prompt));
});

test('rule requires naming a concept before storytelling about it', () => {
  assert.ok(/story.*without.*nam|nam.*the thing.*then narrate|does not introduce it/is.test(prompt));
});

test('rule offers the ask-first alternative (confirm instead of assume)', () => {
  assert.ok(/have you (come across|met|seen)/i.test(prompt));
});

test('rule stays generic — no subject-specific term as the example vocabulary', () => {
  // The rule paragraph itself must use placeholder names (X / Y), never a
  // real curriculum term — the standing generic-prompts feedback rule.
  const m = prompt.match(/\*\*Never quiz on a term[^*]+/i);
  assert.ok(m, 'rule paragraph found');
  assert.ok(!/constitution|electoral|photosynthesis|derivative/i.test(m![0]), 'no curriculum-specific vocabulary');
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
