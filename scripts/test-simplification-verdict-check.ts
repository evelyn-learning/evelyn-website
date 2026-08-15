/**
 * Unit test for the simplification-verdict checker (false denials of a
 * correct simplification answer).
 * Guards against the live bug (session portal-734b537e…, 2026-07-31):
 * tutor asked "what does $3x - 12 + 2$ combine into?", student said
 * "3x - 10", tutor opened "Not quite — check that middle step again."
 * Usage: npx tsx scripts/test-simplification-verdict-check.ts
 */
import { checkSimplificationVerdict } from '../apps/marketing/src/lib/tutor/voice/simplification-verdict-check';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — got: ${detail}` : ''}`); }
}

type Verdict = 'ok' | 'false_denial';
function expect(
  name: string,
  input: { priorTutorTurn: string; studentUtterance: string; sentence: string },
  verdict: Verdict,
  correct?: string,
) {
  const r = checkSimplificationVerdict(input);
  check(`[${verdict}] ${name}`, r.verdict === verdict, JSON.stringify(r));
  if (correct !== undefined) {
    check(`    …correct === ${JSON.stringify(correct)}`, r.correct === correct, JSON.stringify(r.correct));
  }
}

// ---------- The live bug, verbatim ----------
const livePrior =
  "Right — that's exactly it. You distribute across both terms inside the bracket — $x$ and $-4$ — so it becomes $3x - 12 + 2$.\n\n" +
  'Go ahead and simplify the left side for me — what does $3x - 12 + 2$ combine into?';
expect(
  'live bug: "3x - 10" denied with "Not quite"',
  { priorTutorTurn: livePrior, studentUtterance: '3x - 10', sentence: 'Not quite — check that middle step again.' },
  'false_denial',
  '3x - 10',
);

// ---------- Denial correctness gating ----------
expect(
  'wrong student answer → correct denial stands',
  { priorTutorTurn: livePrior, studentUtterance: '3x - 14', sentence: 'Not quite — check that middle step again.' },
  'ok',
);
expect(
  'wrong variable coefficient → denial stands',
  { priorTutorTurn: livePrior, studentUtterance: '4x - 10', sentence: 'Not quite.' },
  'ok',
);
expect(
  'non-denial sentence never fires',
  { priorTutorTurn: livePrior, studentUtterance: '3x - 10', sentence: 'Right — negative ten.' },
  'ok',
);
expect(
  'denial later in turn (not just opener sentence) still fires',
  { priorTutorTurn: livePrior, studentUtterance: '3x - 10', sentence: "Not quite right — let's slow down." },
  'false_denial',
);

// ---------- Echo / unsimplified guards ----------
expect(
  'student echoes the unsimplified form verbatim → tutor may push back',
  { priorTutorTurn: livePrior, studentUtterance: '3x - 12 + 2', sentence: 'Not quite — I want it combined.' },
  'ok',
);
expect(
  'equivalent but NOT fully simplified (two constants) → tutor may push back',
  { priorTutorTurn: livePrior, studentUtterance: '2 - 12 + 3x', sentence: 'Not quite.' },
  'ok',
);

// ---------- Ask-extraction gating ----------
expect(
  'no simplify-ask keyword in prior turn → never fires',
  {
    priorTutorTurn: 'The equation is $3x - 12 + 2 = 2x + 5$. What is your next move?',
    studentUtterance: '3x - 10',
    sentence: 'Not quite.',
  },
  'ok',
);
expect(
  'no $-span in the ask sentence → never fires',
  {
    priorTutorTurn: 'Simplify the left side — what do those two constants combine into?',
    studentUtterance: '-10',
    sentence: 'Not quite.',
  },
  'ok',
);
expect(
  'empty prior turn → ok',
  { priorTutorTurn: '', studentUtterance: '3x - 10', sentence: 'Not quite.' },
  'ok',
);

// ---------- Spoken-word and filler tolerance ----------
expect(
  'spoken operators: "3x minus 10"',
  { priorTutorTurn: livePrior, studentUtterance: '3x minus 10', sentence: 'Not quite.' },
  'false_denial',
  '3x - 10',
);
expect(
  'leading filler: "um, it\'s 3x - 10"',
  { priorTutorTurn: livePrior, studentUtterance: "um, it's 3x - 10", sentence: 'Not quite.' },
  'false_denial',
);
expect(
  'leading filler: "so that would be 3x - 10"',
  { priorTutorTurn: livePrior, studentUtterance: 'so that would be 3x - 10', sentence: 'Not quite.' },
  'false_denial',
);
expect(
  'utterance with trailing prose does not parse → ok',
  { priorTutorTurn: livePrior, studentUtterance: '3x - 10 because the twelves cancel', sentence: 'Not quite.' },
  'ok',
);

// ---------- Distribution ----------
const distPrior = 'Here is the left side: what does $3(x - 4) + 2$ simplify to?';
expect(
  'distribution: 3(x-4)+2 → 3x - 10',
  { priorTutorTurn: distPrior, studentUtterance: '3x - 10', sentence: 'Not quite.' },
  'false_denial',
  '3x - 10',
);
expect(
  'distribution with wrong answer → denial stands',
  { priorTutorTurn: distPrior, studentUtterance: '3x - 2', sentence: 'Not quite.' },
  'ok',
);

// ---------- Multi-variable ----------
expect(
  'multi-variable: 2x + 3y - x → x + 3y',
  {
    priorTutorTurn: 'Combine like terms: what does $2x + 3y - x$ become?',
    studentUtterance: 'x + 3y',
    sentence: 'Not quite.',
  },
  'false_denial',
);

// ---------- Constants-only combine asks ----------
expect(
  'constants only: -12 + 2 → -10',
  {
    priorTutorTurn: 'Look at the constants. What does $-12 + 2$ come out to when you combine them?',
    studentUtterance: '-10',
    sentence: 'Not quite — try that again.',
  },
  'false_denial',
  '-10',
);

// ---------- Decimals and fractions ----------
expect(
  'decimal coefficients: 0.5x + 1.5x → 2x',
  {
    priorTutorTurn: 'Simplify $0.5x + 1.5x$ for me.',
    studentUtterance: '2x',
    sentence: 'Not quite.',
  },
  'false_denial',
);

// ---------- Out-of-scope math bails ----------
expect(
  'nonlinear (x^2) asked → bail ok',
  {
    priorTutorTurn: 'Simplify $x^2 - 4 + 3$ for me.',
    studentUtterance: 'x^2 - 1',
    sentence: 'Not quite.',
  },
  'ok',
);
expect(
  'equation (has =) asked → bail ok',
  {
    priorTutorTurn: 'Simplify the left side of $3x - 12 + 2 = 2x + 5$.',
    studentUtterance: '3x - 10',
    sentence: 'Not quite.',
  },
  'ok',
);

// ---------- Notation tolerance ----------
expect(
  'unicode minus in student utterance',
  { priorTutorTurn: livePrior, studentUtterance: '3x − 10', sentence: 'Not quite.' },
  'false_denial',
);
expect(
  'latex \\cdot in asked span',
  {
    priorTutorTurn: 'What does $3\\cdot x - 12 + 2$ combine into?',
    studentUtterance: '3x - 10',
    sentence: 'Not quite.',
  },
  'false_denial',
);

// ---------- Robustness ----------
{
  let threw = false;
  try {
    checkSimplificationVerdict({ priorTutorTurn: null as unknown as string, studentUtterance: undefined as unknown as string, sentence: 42 as unknown as string });
    checkSimplificationVerdict({ priorTutorTurn: '$'.repeat(10000), studentUtterance: '((((', sentence: 'Not quite.' });
  } catch {
    threw = true;
  }
  check('never throws on garbage input', !threw);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
