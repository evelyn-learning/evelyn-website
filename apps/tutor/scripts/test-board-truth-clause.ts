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
 *
 * R37 (session-polish, live report) extended this file with a companion
 * clause in the same board-grounding family: the tutor spoke of a
 * unit-circle "figure" that only ever existed as a tutor_handwrite text
 * note. See the tests below tagged R37.
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

  // R37 (session-polish, live report): the tutor spoke of a unit-circle
  // "figure" that was never drawn — only a tutor_handwrite text note was
  // on the board. Companion rule to "Never claim content is on the
  // whiteboard" (line ~590), scoped specifically to figures/diagrams so
  // the brain can't narrate a picture that exists only in speech.
  test('clause bans narrating an unrendered figure/diagram/graph', () => {
    assert.ok(
      prompt.includes('Never talk about a figure, diagram, or graph as if the student can see it'),
      'expected the figure-grounding clause in BASE_PROMPT output',
    );
  });

  test('clause cites the live unit-circle handwrite-note failure', () => {
    assert.ok(prompt.includes('tutor_handwrite text note'));
    assert.ok(prompt.includes('unit circle: angle θ reflects to −θ across x-axis'));
  });

  test('clause requires checking boardSnapshot before "as you can see" / "the figure shows"', () => {
    assert.ok(prompt.includes('check the boardSnapshot for a matching rendered item'));
  });

  test('clause prefers the matching diagram tool over a handwritten note', () => {
    assert.ok(prompt.includes('show_diagram(type: "unit_circle")'));
    assert.ok(prompt.includes("don't settle for a handwritten note when a real diagram tool covers the concept"));
  });

  test('clause gives a no-tool fallback: describe verbally or use the closest drawable stand-in', () => {
    assert.ok(prompt.includes('If no tool can draw the exact figure you have in mind'));
    assert.ok(prompt.includes('never narrate a figure that exists only in your own head'));
  });

  test('figure-grounding clause sits with the whiteboard-claim rule (same problem family)', () => {
    const whiteboardClaimIdx = prompt.indexOf('Never claim content is on the whiteboard');
    const figureClauseIdx = prompt.indexOf('Never talk about a figure, diagram, or graph');
    assert.ok(whiteboardClaimIdx >= 0 && figureClauseIdx >= 0);
    assert.ok(figureClauseIdx > whiteboardClaimIdx);
    assert.ok(figureClauseIdx - whiteboardClaimIdx < 500);
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main();
