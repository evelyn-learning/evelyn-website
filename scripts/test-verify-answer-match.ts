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
import { mcqAnswersAgree } from '../src/lib/tutor/voice/problem-generator';

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

console.log(`\nverify-answer-match: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
