/**
 * Unit test — tutor-posed problems render on the board + parametric
 * LHS distinctness (live regressions 2026-07-09, portal-abc8df2d).
 *
 * (a) The tutor SPOKE a new problem ("the curve x equals t squared
 *     minus 4, y equals t cubed minus 3t") but never wrote it until the
 *     student asked — every existing MUST-write rule was gated on the
 *     STUDENT asking. New rule: a problem the TUTOR poses renders the
 *     same turn.
 * (b) A parametric pair was written as "x(t) = cos t, x(t) = sin t"
 *     (duplicate LHS; second should be y(t)). New rule pins LHS
 *     distinctness for parametric definitions specifically.
 *
 * Run: npx tsx scripts/test-posed-problem-clause.ts
 * No framework — matches the test:pedagogy-board-truth pattern.
 */

import { strict as assert } from 'node:assert';
import { buildSystemPrompt, type SystemPromptContext } from '../src/lib/tutor/ai/system-prompt-builder';

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
  console.log('Tutor-posed problem + parametric LHS clauses\n');

  const prompt = buildSystemPrompt(baseCtx);

  test('posed-problem clause present: a problem YOU pose renders the same turn', () => {
    assert.ok(prompt.includes('a problem YOU pose'), 'clause header missing');
    assert.ok(prompt.includes('the SAME turn you pose it'), 'same-turn mandate missing');
  });

  test('posed-problem clause covers speaking-without-writing explicitly', () => {
    assert.ok(prompt.includes('Speaking a problem without writing it'));
  });

  test('parametric LHS clause present and scoped to parametric definitions', () => {
    assert.ok(prompt.includes('Parametric definitions'), 'clause header missing');
    assert.ok(prompt.includes('each equation a DIFFERENT dependent variable'), 'distinct-LHS mandate missing');
    assert.ok(prompt.includes('x(t) = cos t, x(t) = sin t'), 'the observed duplicate-LHS failure example missing');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
