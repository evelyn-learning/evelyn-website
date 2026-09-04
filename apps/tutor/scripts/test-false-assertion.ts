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

// ─── portal-704e3e01 @1414.3s — the brain's sentence was CORRECT ───
// "Exactly. $3x = 30$ divided by $3$ gives $x = 10$." was killed as x=30.
// The coefficient satisfied the left boundary [^a-zA-Z]; non-global match
// meant the real terminal value ($x = 10$) was never reached.
{
  const r = checkFalseFinalAssertion({
    sentence: 'Exactly. $3x = 30$ divided by $3$ gives $x = 10$.',
    problemStatement: 'Solve for x: x/2 + 3 = x/5 + 6. What is x?',
    verifiedExpectedAnswer: '10',
  });
  check('portal-704e3e01: coefficient step 3x = 30 does not mask the true x = 10',
    r.verdict === 'ok', JSON.stringify(r));
}
// The same intermediate step the suite already claims to cover, moved off
// the end of the sentence so the trailing-period lookahead cannot save it.
{
  const r = checkFalseFinalAssertion({
    sentence: 'Right — subtracting 7 gives 3x = 13 on the left.',
    problemStatement: STATEMENT,
    verifiedExpectedAnswer: VERIFIED,
  });
  check('mid-sentence intermediate step (3x = 13 …) → ok', r.verdict === 'ok', JSON.stringify(r));
}
// When a sentence asserts more than one value, the LAST one is the value
// the student takes away — judge that, not the working step before it.
{
  const r = checkFalseFinalAssertion({
    sentence: 'So 2x = 26, which means $x = 13$ exactly.',
    problemStatement: STATEMENT,
    verifiedExpectedAnswer: '13',
  });
  check('multi-assertion sentence judges the LAST value (13, correct) → ok',
    r.verdict === 'ok', JSON.stringify(r));
}
// Selection-order pin. Both assertions clear the digit boundary, so the
// match array genuinely holds two values — this is the only test in the
// suite where all[0] and all[all.length - 1] disagree. A revert to
// first-match selection fails BOTH directions below.
{
  const r = checkFalseFinalAssertion({
    sentence: 'Right — $x = 5$, no wait, $x = 8$.',
    problemStatement: STATEMENT,
    verifiedExpectedAnswer: '8',
  });
  check('two boundary-passing assertions: the LAST one (8) is judged → ok',
    r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = checkFalseFinalAssertion({
    sentence: 'Right — $x = 5$, no wait, $x = 8$.',
    problemStatement: STATEMENT,
    verifiedExpectedAnswer: '5',
  });
  check('two boundary-passing assertions: the FIRST one (5) is NOT judged → false_assertion',
    r.verdict === 'false_assertion' && r.asserted === '8', JSON.stringify(r));
}

// ─── portal-704e3e01 @1113.7s — MCQ card, verified answer is a LETTER ───
// showProblem-4: choices A "x = 4.5" · B "x = 18" · C "x = 9" · D "x = -9",
// verified "C". The brain said "Exactly. $x = 9$ — that's choice *C*."
const MCQ_STATEMENT = 'Solve for $x$: $4(x - 3) = 2x + 6$. What is x?';
const MCQ_CHOICES = ['A', 'B', 'C', 'D'].map((l) => ({ letter: l, text: l }));
{
  const r = checkFalseFinalAssertion({
    sentence: "Exactly. $x = 9$ — that's choice *C*.",
    problemStatement: MCQ_STATEMENT,
    verifiedExpectedAnswer: 'C',
    choices: MCQ_CHOICES,
  });
  check('portal-704e3e01: numeric assertion vs MCQ letter answer → ok (never kill)',
    r.verdict === 'ok', JSON.stringify(r));
}
{
  // Same card, and the tutor asserts a value that is NOT choice C. The
  // single-letter safety net fires on the bare "C" before the matcher is
  // reached, so the guard returns ok without trying to resolve "18" to a
  // letter. This documents the coverage cost: a wrong numeric assertion on
  // an MCQ card also escapes detection.
  const r = checkFalseFinalAssertion({
    sentence: 'Right, $x = 18$ — choice B.',
    problemStatement: MCQ_STATEMENT,
    verifiedExpectedAnswer: 'C',
    choices: MCQ_CHOICES,
  });
  check('MCQ coverage cost is explicit: wrong numeric assertion also → ok',
    r.verdict === 'ok', JSON.stringify(r));
}
{
  // Safety net inside the module: even with NO choices supplied, a bare
  // single-letter verified answer is assumed MCQ and returns ok — an
  // approximation, since a non-MCQ problem could legitimately have a
  // single-letter verified answer (e, i, a code). Deliberate fail-closed.
  const r = checkFalseFinalAssertion({
    sentence: "Exactly. $x = 9$ — that's choice *C*.",
    problemStatement: MCQ_STATEMENT,
    verifiedExpectedAnswer: 'C',
  });
  check('bare single-letter verified answer, no choices → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  // Non-MCQ behaviour is untouched: a numeric verified answer still kills.
  const r = checkFalseFinalAssertion({
    sentence: 'Right. Dividing both sides by 3 gives $x = 11$.',
    problemStatement: STATEMENT,
    verifiedExpectedAnswer: VERIFIED,
    choices: undefined,
  });
  check('numeric verified answer still fires with choices undefined',
    r.verdict === 'false_assertion', JSON.stringify(r));
}

// Passthrough pin. Every test above uses a BARE letter, which the
// single-letter safety net intercepts before the matcher is reached — so
// none of them exercise `choices`. "C)" is the one live-plausible shape
// that escapes the safety net and still resolves via resolveMcqLetter, so
// it is the only input where supplying choices changes the verdict.
{
  const r = checkFalseFinalAssertion({
    sentence: "Exactly. $x = 9$ — that's choice *C*.",
    problemStatement: MCQ_STATEMENT,
    verifiedExpectedAnswer: 'C)',
    choices: MCQ_CHOICES,
  });
  check('choices passthrough: "C)" resolves via resolveMcqLetter → ok',
    r.verdict === 'ok', JSON.stringify(r));
}
{
  // The same input WITHOUT choices is a false kill — this is what the
  // passthrough prevents, and what a regression would reintroduce.
  const r = checkFalseFinalAssertion({
    sentence: "Exactly. $x = 9$ — that's choice *C*.",
    problemStatement: MCQ_STATEMENT,
    verifiedExpectedAnswer: 'C)',
  });
  check('without choices the same card false-kills → false_assertion',
    r.verdict === 'false_assertion', JSON.stringify(r));
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
