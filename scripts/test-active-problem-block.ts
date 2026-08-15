/**
 * Unit tests for the `<active_problem>` block — specifically the
 * expectedAnswer pin (2026-07-17): the pipeline-verified answer must render
 * on every turn while a generated problem is active, with the trust-this-
 * over-your-own-working framing, and must NOT render for student-brought
 * problems (no verified answer exists for those).
 *
 * Run: npx tsx scripts/test-active-problem-block.ts
 */
import { formatActiveProblemBlock, formatActiveQuestionBlock } from '../apps/marketing/src/lib/tutor/voice/claude-brain';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

// No active problem → empty (block suppressed).
check('absent → empty string', formatActiveProblemBlock(undefined) === '');
check('empty statement → empty string', formatActiveProblemBlock({ statement: '' }) === '');

// Generated problem WITH a verified answer → answer + trust framing render.
{
  const block = formatActiveProblemBlock({
    statement: 'Evaluate the limit of (sqrt(x+16)-4)/(x^2+4x) as x->0.',
    source: 'generated',
    expectedAnswer: 'Multiply by the conjugate; the limit is 1/32. (answer: 1/32)',
  });
  check('generated: statement renders', block.includes('Evaluate the limit'));
  check('generated: verified answer renders', block.includes('1/32'));
  check('generated: VERIFIED framing present', /VERIFIED expected answer/.test(block));
  check('generated: trust-this-over-own-working instruction present', /TRUST THIS/.test(block));
  check('generated: no-spoiler guard present', /Never reveal it/.test(block));
}

// Active problem WITHOUT an expected answer → no answer section, no stray text.
{
  const block = formatActiveProblemBlock({ statement: 'Compute the mean of {2,4,6}.' });
  check('no-answer: statement renders', block.includes('Compute the mean'));
  check('no-answer: no VERIFIED section', !/VERIFIED expected answer/.test(block));
}

// Student-brought problem → student framing. Round-17: an expectedAnswer is
// only ever written by the runtime AFTER independent verification (pipeline
// or blind-solve), so when present it renders with the same trust framing;
// absent → no VERIFIED section (grading stays brain-derived until the
// blind-solve confirms).
{
  const noAns = formatActiveProblemBlock({
    statement: 'My homework asks for the derivative of x^3.',
    source: 'student',
  });
  check('student: student framing present', /brought THIS problem themselves/.test(noAns));
  check('student: declare-expectedAnswer instruction present', /expectedAnswer/.test(noAns));
  check('student: no VERIFIED section without an answer', !/VERIFIED expected answer/.test(noAns));

  const withAns = formatActiveProblemBlock({
    statement: 'My homework asks for the derivative of x^3.',
    source: 'student',
    expectedAnswer: '3x^2',
  });
  check('student: verified answer renders', withAns.includes('3x^2'));
  check('student: VERIFIED framing present', /VERIFIED expected answer/.test(withAns));
  check('student: trust-this instruction present', /TRUST THIS/.test(withAns));
}

// ── 2026-08-07 triage (session-1786064015703): card-lock vs spoken question ──

// Card WITHOUT a declared expected answer: the old text commanded "Grade
// against the declared expected answer" even when none existed — the brain
// invented a verdict for a bare "a" submission. Softened branch required.
{
  const block = formatActiveProblemBlock({
    statement: 'If you slice the cone straight across, what shape do you get?',
    source: 'card',
  });
  check('card/no-answer: statement renders', block.includes('slice the cone straight across'));
  check('card/no-answer: no "declared expected answer" grading command', !/Grade against the declared expected answer/.test(block));
  check('card/no-answer: silent-derive instruction present', /[Dd]erive the correct answer.*(yourself|silently)|silently.*derive/i.test(block));
  check('card/no-answer: non-answer guard present', /doesn'?t parse as an answer|not an answer/i.test(block));
}

// Card branch (either variant) must defer to a NEWER spoken question — the
// 2026-08-06 conics session graded "an ellipse" (correct for the spoken tilt
// question) against the stale flat-slice card and looped for 3 minutes.
{
  const withAns = formatActiveProblemBlock({
    statement: 'If you slice the cone straight across, what shape do you get?',
    source: 'card',
    expectedAnswer: 'a circle',
  });
  const noAns = formatActiveProblemBlock({
    statement: 'If you slice the cone straight across, what shape do you get?',
    source: 'card',
  });
  check('card/with-answer: defers to <active_question>', withAns.includes('<active_question>'));
  check('card/no-answer: defers to <active_question>', noAns.includes('<active_question>'));
  check('card/with-answer: still anchors grading on card answer', /Grade against the declared expected answer/.test(withAns));
}

// ── formatActiveQuestionBlock: the tutor's LAST spoken question ──
{
  check('aq: empty message → empty', formatActiveQuestionBlock('') === '');
  check('aq: no question in message → empty', formatActiveQuestionBlock('Right, a circle! Slicing flat gives that shape.') === '');

  const block = formatActiveQuestionBlock(
    'Right, a circle! Now here\'s the fun part — what if you tilt that same slice just a little instead of keeping it flat? What shape do you picture then?'
  );
  check('aq: block renders', block.startsWith('<active_question>'));
  check('aq: closes tag', block.includes('</active_question>'));
  check('aq: extracts LAST question sentence', block.includes('What shape do you picture then?'));
  check('aq: does not include earlier sentences', !block.includes('fun part'));
  check('aq: grade-against-this instruction', /grade.*against/i.test(block));
  check('aq: overrides stale card question', /card|<active_problem>/i.test(block));

  // Over-long or absent questions never render a block (lastQuestionSentence caps at 220).
  const longQ = 'x'.repeat(230) + '?';
  check('aq: over-long question → empty', formatActiveQuestionBlock(longQ) === '');
}

console.log(`\nactive-problem-block: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
