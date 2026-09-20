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
{
  // The connector rule rewrites "is"/"gives"/"equals" into " = ". The \b
  // anchors keep that to whole words.
  //
  // DISCRIMINATING — this case is red without the anchors and green with them.
  // The previous test here ('This is history: … is 38 on your sheet.' → ok)
  // proved nothing: unanchored, `flatten` mangled the prose to "Th = = h =
  // tory", which contains no digits and matches nothing, and the real chain
  // still resolved to 38 = 38, so deleting the \b left the suite green.
  //
  // Here the connector is GLUED to the chain's last operand ("…4is 38" — the
  // brain drops that space regularly). With \b there is no word boundary
  // between "4" and "is", so nothing is rewritten, no equation is formed and
  // the detector correctly stays silent. Without \b the substring "is"
  // becomes "=" and MANUFACTURES "16 + 9 + 9 + 4 = 38", which contradicts the
  // board's 182 and would KILL a sentence that never made an arithmetic claim
  // at all. Glue is the only shape that discriminates: for any longer word the
  // leftover letters ("th" from "this") sit between the chain and the "=" and
  // EQN_RE rejects the match anyway.
  const r = detectBoardContradiction({
    turnText: 'The running total 16 + 9 + 9 + 4is 38 short of where we land.',
    renderedText: '16 + 9 + 9 + 4 = 182',
  });
  check('connector rule does not match inside words (\\b anchors)', r.verdict === 'ok', JSON.stringify(r));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
