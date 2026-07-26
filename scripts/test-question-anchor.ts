import { strict as assert } from 'node:assert';
import { isSubstantiveAsk, isBoardContentTool, buildBoardAnchorNote } from '../src/lib/tutor/voice/question-anchor';

let passed = 0; let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}

// Substantive: names a number, variable, or expression to work.
test('k=-0.1 half-life ask is substantive', () => {
  assert.equal(isSubstantiveAsk('if a radioactive sample decays with k = -0.1 per year, what would you guess "half-life" means in terms of this equation -- what condition would y(t) need to satisfy?'), true);
});
test('percent-of ask is substantive', () => {
  assert.equal(isSubstantiveAsk("What's fifteen percent of sixty?"), false); // spelled-out numbers are a known miss — documented, not a goal
  assert.equal(isSubstantiveAsk("What's 15% of 60?"), true);
});
test('latex/dollar-span ask is substantive', () => {
  assert.equal(isSubstantiveAsk('So with just that -- $e^{kT} = \\frac{1}{2}$ -- what would you do to get T by itself?'), true);
});
test('conversational checks are NOT substantive', () => {
  assert.equal(isSubstantiveAsk('Does that make sense?'), false);
  assert.equal(isSubstantiveAsk('Ready to try one?'), false);
  assert.equal(isSubstantiveAsk('What do you think happens next?'), false);
  assert.equal(isSubstantiveAsk('Should we keep going?'), false);
});
test('empty/undefined-ish input safe', () => {
  assert.equal(isSubstantiveAsk(''), false);
  assert.equal(isSubstantiveAsk('   '), false);
});

// Tool classification: content writes vs meta/nav/control.
test('content tools', () => {
  assert.equal(isBoardContentTool('show_equation'), true);
  assert.equal(isBoardContentTool('show_problem'), true);
  assert.equal(isBoardContentTool('tutor_scribble'), true);
  assert.equal(isBoardContentTool('tutor_handwrite'), true);
});
test('meta/control tools are not content', () => {
  assert.equal(isBoardContentTool('new_page'), false);
  assert.equal(isBoardContentTool('go_to_page'), false);
  assert.equal(isBoardContentTool('clear'), false);
  assert.equal(isBoardContentTool('tutor_scroll_whiteboard'), false);
  assert.equal(isBoardContentTool('list_whiteboard_features'), false);
  assert.equal(isBoardContentTool('mark_segment_complete'), false);
  assert.equal(isBoardContentTool('advance_lesson'), false);
  assert.equal(isBoardContentTool('generate_problem'), false);
});

// Note text: conditional-phrased, follows the note convention.
test('note convention + conditional phrasing', () => {
  const note = buildBoardAnchorNote("What's 15% of 60?");
  assert.ok(note.startsWith('[board-anchor note — not from the student]'));
  assert.ok(note.includes('not already visible'));
  assert.ok(note.includes("What's 15% of 60?"));
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
