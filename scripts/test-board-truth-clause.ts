/**
 * Unit test — board-truth authority clause (Store-B coherence bug fix).
 *
 * Live B2 flag-ON run 2026-07-03 (artifacts/pedagogy-harness/
 * anon-2026-07-04T01-34-06): the opener table said Store B = 8 apples for
 * $5.00, the student misquoted "$4", and the tutor ADOPTED the student's
 * wrong number — wrote $4.00/8 = $0.50 under its own $5.00 table and
 * declared a wrong "tie". The BASE_PROMPT now carries a "Board values are
 * canonical — correct a student's misquote, never adopt it" rule
 * (system-prompt-builder.ts, next to the authored-literal-tokens rule).
 * This test pins the clause's presence + its key behavioral phrases so a
 * prompt refactor can't silently drop it.
 *
 * Run: npx tsx scripts/test-board-truth-clause.ts
 * No framework — matches the test:pedagogy-b4 / test:pedagogy-b5 pattern.
 * Behavioral (live-brain) coverage: the `storeb` harness scenario
 * (scripts/tutor/pedagogy-harness — misquoting persona + board-truth
 * rubric), which needs a dev server + real LLM.
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
  console.log('Board-truth authority clause — Store-B coherence fix\n');

  const prompt = buildSystemPrompt(baseCtx);

  test('clause header present in every built prompt (not gated on any flag)', () => {
    assert.ok(
      prompt.includes('Board values are canonical'),
      'expected the board-truth clause header in BASE_PROMPT output',
    );
  });

  test('clause forbids adopting the student version', () => {
    assert.ok(prompt.includes('do NOT silently switch to their version'));
  });

  test('clause mandates verifying the restatement against the board', () => {
    assert.ok(
      prompt.includes('a thing to VERIFY against the board, not a replacement source of truth'),
    );
  });

  test('clause carves out student-brought NEW problems (does not fight the grounding feature)', () => {
    assert.ok(
      prompt.includes('a student explicitly bringing a NEW problem of their own is different'),
    );
  });

  test('clause sits with the literal-tokens rule (same problem family, both directions)', () => {
    const literalTokensIdx = prompt.indexOf("Use the authored card's literal tokens");
    const clauseIdx = prompt.indexOf('Board values are canonical');
    assert.ok(literalTokensIdx >= 0 && clauseIdx >= 0);
    // Same neighborhood: the reverse-direction rule directly follows the
    // forward-direction rule so future editors see them as a pair.
    assert.ok(clauseIdx > literalTokensIdx);
    assert.ok(clauseIdx - literalTokensIdx < 2000);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
