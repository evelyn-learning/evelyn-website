/**
 * Unit tests for the `<active_problem>` block — specifically the
 * expectedAnswer pin (2026-07-17): the pipeline-verified answer must render
 * on every turn while a generated problem is active, with the trust-this-
 * over-your-own-working framing, and must NOT render for student-brought
 * problems (no verified answer exists for those).
 *
 * Run: npx tsx scripts/test-active-problem-block.ts
 */
import { formatActiveProblemBlock } from '../src/lib/tutor/voice/claude-brain';

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

console.log(`\nactive-problem-block: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
