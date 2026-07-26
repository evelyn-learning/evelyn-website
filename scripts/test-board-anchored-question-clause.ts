/**
 * R2 E2 (2026-07-26, session portal-19ac025c): pins the Board-anchored
 * questions HARD RULE, including the repeat-request clause — a repeat/
 * clarify request means the previous ask was hard to follow BY EAR, so the
 * tutor must re-explain differently AND board-anchor the ask.
 */
import { strict as assert } from 'node:assert';
import { buildSystemPrompt, type SystemPromptContext } from '../src/lib/tutor/ai/system-prompt-builder';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

const prompt = buildSystemPrompt({ module: null, studentName: 'Ravi' } as SystemPromptContext);

test('board-anchored clause present', () => {
  assert.ok(prompt.includes('Board-anchored questions'));
  assert.ok(prompt.includes('never leave the student holding a spoken-only expression'));
});

test('repeat-request clause: repeat means re-explain AND write it', () => {
  assert.ok(prompt.includes('asks you to repeat'), 'repeat-request trigger missing');
  assert.ok(prompt.includes('write the question on the board'), 'board-anchor mandate missing');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
