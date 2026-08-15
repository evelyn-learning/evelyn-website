/**
 * Unit tests for MCQ-aware answer agreement (Round-17, 2026-07-17).
 *
 * Live false-mismatch class (session portal-ef215ea0): the brain claims a
 * LETTER ("D") while the blind solver — which previously never saw the
 * choices — answered with the choice's TEXT ("A limit can exist even if the
 * function is undefined at that point"). mcqAnswersAgree resolves both
 * sides to a letter (direct letter shapes, or matching against the choice
 * texts) and compares letters.
 *
 * Run: npx tsx scripts/test-verify-answer-match.ts
 */
import { mcqAnswersAgree, answersAgree } from '../apps/marketing/src/lib/tutor/voice/problem-generator';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

const CHOICES = [
  { letter: 'A', text: 'If $\\lim_{x\\to c} f(x)=L$, then $f(c)=L$ must hold' },
  { letter: 'B', text: 'A limit must always equal the function value' },
  { letter: 'C', text: 'If $f(c)$ is undefined, the limit cannot exist' },
  { letter: 'D', text: '$\\lim_{x\\to c} f(x)$ can exist even when $f(c)$ is undefined' },
];

// Letter vs letter.
check('D vs "D" → agree', mcqAnswersAgree('D', 'D', CHOICES) === true);
check('D vs "(D)" → agree', mcqAnswersAgree('D', '(D)', CHOICES) === true);
check('D vs "Option D." → agree', mcqAnswersAgree('D', 'Option D.', CHOICES) === true);
check('D vs "A" → disagree', mcqAnswersAgree('D', 'A', CHOICES) === false);

// Text → letter resolves ONLY on an exact (normalized) quote of a choice.
// The live false-mismatch ("D" vs a PARAPHRASE of choice D) is fixed
// upstream — the solver now SEES the choices and answers with a letter —
// not by fuzzy text matching, which would mis-resolve negation distractors
// that share most words with the correct choice.
check('D vs verbatim choice-D text → agree',
  mcqAnswersAgree('D', '$\\lim_{x\\to c} f(x)$ can exist even when $f(c)$ is undefined', CHOICES) === true);
check('verbatim choice-D text vs "D" → agree (reverse)',
  mcqAnswersAgree('$\\lim_{x\\to c} f(x)$ can exist even when $f(c)$ is undefined', 'D', CHOICES) === true);
check('D vs paraphrase of choice D → disagree (documented: no fuzzy match)',
  mcqAnswersAgree('D', 'A limit can exist even when the function is undefined there', CHOICES) === false);
check('D vs verbatim choice-A text → disagree',
  mcqAnswersAgree('D', 'If $\\lim_{x\\to c} f(x)=L$, then $f(c)=L$ must hold', CHOICES) === false);

// Guard: bare short strings must not fuzzy-match into a letter.
check('unresolvable free text vs letter → disagree',
  mcqAnswersAgree('the function is continuous', 'D', CHOICES) === false);

// ── Round-24 (math-coverage sweep): notation-equivalent answer forms ──
// The blind solver answers in whatever form it derives; the brain declares
// whatever form it spoke. These realistic pairs MUST agree or a correct
// student gets a false mismatch (recon traced 5 of 11 failing before).
check('\\frac{1}{2} vs 1/2 → agree', answersAgree('\\frac{1}{2}', '1/2') === true);
check('$\\dfrac{1}{2}$ vs 0.5 → agree', answersAgree('$\\dfrac{1}{2}$', '0.5') === true);
check('.5 vs 0.5 → agree', answersAgree('.5', '0.5') === true);
check('π/4 vs 0.785 → agree', answersAgree('π/4', '0.785') === true);
check('$\\pi/4$ vs pi/4 → agree', answersAgree('$\\pi/4$', 'pi/4') === true);
check('2π vs 6.283 → agree', answersAgree('2π', '6.283') === true);
check('50% vs 0.5 → agree', answersAgree('50%', '0.5') === true);
check('√2/2 vs 0.707 → agree', answersAgree('√2/2', '0.707') === true);
check('unicode-minus −1/3 vs -1/3 → agree', answersAgree('−1/3', '-1/3') === true);
check('\\sqrt{2}/2 vs 0.707 → agree', answersAgree('\\sqrt{2}/2', '0.707') === true);
// Guards: genuinely different values must still disagree.
check('1/2 vs 1/3 → disagree', answersAgree('1/2', '1/3') === false);
check('50% vs 0.7 → disagree', answersAgree('50%', '0.7') === false);
check('π/4 vs 0.5 → disagree', answersAgree('π/4', '0.5') === false);

console.log(`\nverify-answer-match: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
