/**
 * portal-9a9b7c09: the board wrote "16 + 9 + 9 + 4 + 144 = 182" while the
 * same turn's speech said the total was thirty-eight. The judge flagged it at
 * kill severity and, being advisory-only, aired nothing.
 *
 * Usage: npx tsx scripts/test-board-contradiction.ts  (npm run test:board-contradiction)
 */
import { detectBoardContradiction } from '../src/lib/tutor/voice/board-contradiction';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// ─── the live incident ───
{
  const r = detectBoardContradiction({
    turnText: "Right. Sixteen plus nine plus nine plus four plus one-forty-four — that's *thirty-eight*.",
    renderedText: '16 + 9 + 9 + 4 + 144 = 182',
  });
  check('portal-9a9b7c09 @451.1s: board 182 vs spoken 38 → contradiction',
    r.verdict === 'contradiction', JSON.stringify(r));
}
{
  const r = detectBoardContradiction({
    turnText: "Right. Sixteen plus nine plus nine plus four plus one-forty-four — that's one hundred and eighty-two.",
    renderedText: '16 + 9 + 9 + 4 + 144 = 182',
  });
  check('speech AGREEING with the board → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = detectBoardContradiction({
    turnText: 'Right. 16 + 9 + 9 + 4 + 144 = 38',
    renderedText: '\\text{Sum} = 16 + 9 + 9 + 4 + 144 = 182',
  });
  check('LaTeX wrapper on the board side → contradiction', r.verdict === 'contradiction', JSON.stringify(r));
}

// ─── FAIL CLOSED ───
{
  const r = detectBoardContradiction({ turnText: 'Nice work — that lands on 182.', renderedText: '16 + 9 + 9 + 4 + 144 = 182' });
  check('speech with no operand chain → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = detectBoardContradiction({ turnText: 'Right, 2 + 2 = 5.', renderedText: '16 + 9 + 9 + 4 + 144 = 182' });
  check('different expression entirely → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = detectBoardContradiction({ turnText: 'Right. 16 + 9 + 9 + 4 + 144 = 182', renderedText: '' });
  check('empty board → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = detectBoardContradiction({ turnText: '', renderedText: '16 + 9 = 25' });
  check('empty speech → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  // Operand order matters — a reordered chain is a different claim, not a
  // contradiction to assert on.
  const r = detectBoardContradiction({ turnText: 'Right, 9 + 16 = 30.', renderedText: '16 + 9 = 25' });
  check('reordered operands → ok', r.verdict === 'ok', JSON.stringify(r));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
