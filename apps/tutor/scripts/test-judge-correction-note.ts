/**
 * Tests for the judge → next-turn correction note (2026-08-07 triage,
 * session-1786064015703): the judge detected the "an ellipse" false reject
 * (judge_advisory_was_kill) but the result went nowhere — advisory-only with
 * no student-visible effect. The note rides the next brain call via the
 * pendingCadenceNoteRef convention so the tutor can own the correction.
 *
 * Run: npx tsx scripts/test-judge-correction-note.ts
 */
import { buildJudgeCorrectionNote, hasMathExpression, claimsWithMathExpression, shouldConsumeJudgeCorrectionNote } from '../src/lib/tutor/voice/judge-correction-note';

let passed = 0, failed = 0;
function check(name: string, cond: boolean) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}`); }
}

// No claims → no note.
check('empty claims → null', buildJudgeCorrectionNote([]) === null);

// Single claim renders the standard note.
{
  const note = buildJudgeCorrectionNote(['Not quite. Close though — picture that slice going straight across']);
  check('note is non-null', note !== null);
  check('bracketed note convention', /^\[correction note — not from the student\]/.test(note ?? ''));
  check('quotes the claim', (note ?? '').includes('picture that slice going straight across'));
  check('asks for silent re-check', /re-?check/i.test(note ?? ''));
  check('owns the correction when wrong', /own|correct/i.test(note ?? ''));
  check('safety valve: silent continue when the review is wrong', /stand by|continue|do not mention/i.test(note ?? ''));
  check('single-line (no raw newlines to break transcript splice)', !(note ?? '').includes('\n'));
}

// Claims are capped: at most 2 quoted, each truncated.
{
  const long = 'x'.repeat(400);
  const note = buildJudgeCorrectionNote([long, long, long]) ?? '';
  check('long claims truncated', note.length < 900);
  check('at most 2 claims quoted', (note.match(/"x{10}/g) ?? []).length === 2);
}

// ---------- Fix C planting policy (2026-08-10, session portal-7cfa226c) ----------
// Advisory issues now ALSO plant a correction note, but only when the
// claim carries a math expression ($, \(, or =) — the incident shape (a
// board card contradicting the tutor's own correct narration). A bare
// tone/phrasing advisory — the class Pillar 2b's advisory-only default
// exists to protect — must NOT plant a note.
check('math claim with $ qualifies', hasMathExpression('the card shows $f(x) = 2x$ but you said 3x'));
check('math claim with \\( qualifies', hasMathExpression("the board reads \\(y = mx + b\\)"));
check('math claim with bare = qualifies', hasMathExpression('you said x = 5 but the board shows x = 7'));
check('tone/phrasing claim does not qualify', !hasMathExpression('your tone was a bit abrupt with the student'));
check('common-knowledge claim does not qualify', !hasMathExpression('Paris is not typically called the capital of Germany'));
{
  const claims = [
    'the board shows $2\\cos t + 2t\\sin t$ but you said 2 sin t + 2t cos t',
    'you were a little terse just now',
  ];
  const filtered = claimsWithMathExpression(claims);
  check('claimsWithMathExpression keeps only the math-bearing claim', filtered.length === 1 && filtered[0] === claims[0]);
}
{
  const filtered = claimsWithMathExpression(['just a tone note', 'another plain-prose note']);
  check('claimsWithMathExpression returns empty when nothing qualifies', filtered.length === 0);
}

// ---------- R42 consumption gate (2026-08-10, session portal-cb2addf5) ----------
// A planted note used to be consumed by whichever brain call ran next,
// including synthetic dispatches (idle-nudge, cover turns) that never
// voice anything to do with the correction — burned with nothing to show
// for it. Only a real student-turn transcript may consume the note.
check('real student transcript consumes', shouldConsumeJudgeCorrectionNote('an ellipse'));
check('typed real transcript consumes', shouldConsumeJudgeCorrectionNote('Is it 42?'));
check('idle-nudge directive does NOT consume', !shouldConsumeJudgeCorrectionNote(
  '[System note: the student has been quiet for a while since your last turn. Re-engage gently in ONE short sentence.]',
));
check('bracketed system dispatch does NOT consume', !shouldConsumeJudgeCorrectionNote('[start lesson]'));
check('leading-whitespace bracketed dispatch does NOT consume', !shouldConsumeJudgeCorrectionNote('   [start session]'));
check('a real transcript that merely mentions a bracket mid-sentence still consumes', shouldConsumeJudgeCorrectionNote('I think [x] should be 4'));

if (failed > 0) { console.error(`\n${failed} failure(s)`); process.exit(1); }
console.log(`\nAll ${passed} judge-correction-note tests passed.`);
