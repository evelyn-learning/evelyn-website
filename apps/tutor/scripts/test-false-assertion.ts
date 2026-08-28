/**
 * R58 — checkFalseFinalAssertion (false-assertion-check.ts): the tutor
 * asserting a wrong FINAL value for the active problem's answer variable
 * while a VERIFIED expected answer exists. Root session: portal-71d11dac
 * ("Right. Dividing both sides by 3 gives $x = 11$." against (3x+7)/2 = 10,
 * whose answer is 13/3 — asserted twice, judge kill downgraded twice under
 * Pillar 2b advisory-only).
 *
 * Usage: npx tsx scripts/test-false-assertion.ts  (npm run test:false-assertion)
 */
import { checkFalseFinalAssertion, extractAnswerVariable } from '../src/lib/tutor/voice/false-assertion-check';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

const STATEMENT = 'Solve: (3x + 7)/2 = 10. What is x?';
const VERIFIED = '13/3';

// ─── extractAnswerVariable ───
check('answer var from "What is x?"', extractAnswerVariable(STATEMENT) === 'x');
check('answer var from "solve for t"', extractAnswerVariable('A ball drops. Solve for t.') === 't');
check('answer var from "find y"', extractAnswerVariable('Find y when x = 2.') === 'y');
check('answer var from "what is the value of n"', extractAnswerVariable('What is the value of n?') === 'n');
check('no answer var → null', extractAnswerVariable('Compute the mean of the dataset.') === null);

// ─── the root-cause shape ───
{
  const r = checkFalseFinalAssertion({
    sentence: 'Right. Dividing both sides by 3 gives $x = 11$.',
    problemStatement: STATEMENT,
    verifiedExpectedAnswer: VERIFIED,
  });
  check('portal-71d11dac shape: asserted x = 11 vs verified 13/3 → false_assertion',
    r.verdict === 'false_assertion' && r.asserted === '11', JSON.stringify(r));
}
{
  const r = checkFalseFinalAssertion({
    sentence: 'Right, $x = 11$ checks out — nice work pushing through that fraction problem.',
    problemStatement: STATEMENT,
    verifiedExpectedAnswer: VERIFIED,
  });
  check('the re-assertion a turn later also fires', r.verdict === 'false_assertion', JSON.stringify(r));
}

// ─── correct assertions pass ───
{
  const r = checkFalseFinalAssertion({
    sentence: 'Right. Dividing both sides by 3 gives $x = \\frac{13}{3}$.',
    problemStatement: STATEMENT,
    verifiedExpectedAnswer: VERIFIED,
  });
  check('correct \\frac{13}{3} assertion → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = checkFalseFinalAssertion({
    sentence: 'So x = 13/3 — not a whole number this time.',
    problemStatement: STATEMENT,
    verifiedExpectedAnswer: VERIFIED,
  });
  check('correct plain-fraction assertion → ok', r.verdict === 'ok', JSON.stringify(r));
}

// ─── the guards ───
{
  const r = checkFalseFinalAssertion({
    sentence: 'Right. Dividing both sides by 3 gives $x = 11$.',
    problemStatement: STATEMENT,
    verifiedExpectedAnswer: '',
  });
  check('no verified answer → never fires', r.verdict === 'ok');
}
{
  const r = checkFalseFinalAssertion({
    sentence: 'Right, that gives n = 4.',
    problemStatement: 'Compute the mean of the dataset.',
    verifiedExpectedAnswer: '7',
  });
  check('no answer variable in statement → never fires', r.verdict === 'ok');
}
{
  const r = checkFalseFinalAssertion({
    sentence: 'If x = 11 were right, plugging back in would give 40, not 20 — see the mismatch?',
    problemStatement: STATEMENT,
    verifiedExpectedAnswer: VERIFIED,
  });
  check('hypothetical framing ("If … were") → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = checkFalseFinalAssertion({
    sentence: 'Right — subtracting 7 gives 3x = 13.',
    problemStatement: STATEMENT,
    verifiedExpectedAnswer: VERIFIED,
  });
  check('intermediate step (3x = 13, not bare x) → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = checkFalseFinalAssertion({
    sentence: 'Now x = 2 + 9/2 needs one more simplification.',
    problemStatement: STATEMENT,
    verifiedExpectedAnswer: VERIFIED,
  });
  check('working expression continuing with + → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = checkFalseFinalAssertion({
    sentence: 'Right. Dividing both sides by 3 gives y = 11.',
    problemStatement: STATEMENT,
    verifiedExpectedAnswer: VERIFIED,
  });
  check('different variable (y, answer var is x) → ok', r.verdict === 'ok', JSON.stringify(r));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
