/**
 * Tests for the judge → next-turn correction note (2026-08-07 triage,
 * session-1786064015703): the judge detected the "an ellipse" false reject
 * (judge_advisory_was_kill) but the result went nowhere — advisory-only with
 * no student-visible effect. The note rides the next brain call via the
 * pendingCadenceNoteRef convention so the tutor can own the correction.
 *
 * Run: npx tsx scripts/test-judge-correction-note.ts
 */
import { buildJudgeCorrectionNote, hasMathExpression, claimsWithMathExpression, shouldConsumeJudgeCorrectionNote, decideJudgeNotePlant } from '../src/lib/tutor/voice/judge-correction-note';

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
  // R58: the fixed tail grew (never-narrate-the-check clause), so the
  // bound moves with it. The property guarded is unchanged: each claim is
  // cut at MAX_CLAIM_CHARS, so total length is bounded regardless of input.
  check('long claims truncated', note.length < 1300);
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

// 2026-09-06 live (Noah): the note names the graded answer
{
  const n = buildJudgeCorrectionNote(['Not quite.'], 'Uh, 2.') ?? '';
  check('note pins the graded answer', /The answer you graded was "Uh, 2\."/.test(n));
  check('note still forbids narration', /NEVER narrate/.test(n));
  check('no answer ⇒ no pin sentence', !/The answer you graded/.test(buildJudgeCorrectionNote(['Not quite.']) ?? ''));
}
// 2026-10-03: the judge (known false-positive rate) must not replace a
// deterministic note (relation-step witness note / exact answer-dispute
// note) that is still waiting in the shared slot.
{
  const witness = '[correction note — not from the student] The line … fails at x = 6.';
  const judge = '[correction note — not from the student] An automated review flagged …';
  check('empty slot ⇒ plant', decideJudgeNotePlant({ enabled: true, pendingNote: null, deterministicNote: null }).plant === true);
  check('empty slot, stale deterministic record ⇒ plant', decideJudgeNotePlant({ enabled: true, pendingNote: null, deterministicNote: witness }).plant === true);
  check('pending judge note ⇒ plant (judge-over-judge unchanged)', decideJudgeNotePlant({ enabled: true, pendingNote: judge, deterministicNote: null }).plant === true);
  check('pending note differs from the deterministic record (already delivered, slot refilled) ⇒ plant',
    decideJudgeNotePlant({ enabled: true, pendingNote: judge, deterministicNote: witness }).plant === true);
  const kept = decideJudgeNotePlant({ enabled: true, pendingNote: witness, deterministicNote: witness });
  check('pending deterministic note ⇒ skip', kept.plant === false && kept.reason === 'deterministic-note-pending');
  check('flag off ⇒ plant (previous behaviour)', decideJudgeNotePlant({ enabled: false, pendingNote: witness, deterministicNote: witness }).plant === true);
  check('empty strings never match', decideJudgeNotePlant({ enabled: true, pendingNote: '', deterministicNote: '' }).plant === true);
}
// 2026-10-04 (live, student gac-test-001): a note planted on a CORRECT
// "Not quite. Close though." produced "let me fix that label… Good catch" —
// the student had caught nothing. The "you were right" wording now belongs to
// the retraction mode only (the judge said the student's answer was correct);
// every other structured issue gets the neutral wording.
{
  const legacy = buildJudgeCorrectionNote(['Not quite.'], '5') ?? '';
  check('default mode is byte-identical to the explicit legacy mode', legacy === buildJudgeCorrectionNote(['Not quite.'], '5', { mode: 'legacy' }));
  check('legacy text unchanged: keeps its own-the-correction example', /Actually, hold on — you were right/.test(legacy));

  const retraction = buildJudgeCorrectionNote(['Not quite.'], '5', { mode: 'retraction' }) ?? '';
  check('retraction: bracketed note convention', /^\[correction note — not from the student\]/.test(retraction));
  check('retraction: says the review found the answer correct', /answer was correct/i.test(retraction));
  check('retraction: may tell the student they were right', /you were right/i.test(retraction));
  check('retraction: pins the graded answer', /The answer you graded was "5"/.test(retraction));
  check('retraction: forbids crediting a catch', /did not point (?:this|it) out/i.test(retraction));
  check('retraction: safety valve kept', /stand by/i.test(retraction));
  check('retraction: still forbids narration', /NEVER narrate/.test(retraction));
  check('retraction: single line', !retraction.includes('\n'));

  const neutral = buildJudgeCorrectionNote(['So $x = 11$.'], '5', { mode: 'neutral', scriptless: false }) ?? '';
  check('neutral: bracketed note convention', /^\[correction note — not from the student\]/.test(neutral));
  check('neutral: quotes the claim', neutral.includes('So $x = 11$.'));
  check('neutral: correct your own statement plainly', /correct your own earlier statement plainly/i.test(neutral));
  check('neutral: do not attribute the correction to the student', /do not attribute the correction to the student/i.test(neutral));
  check('neutral: never offers "you were right" as wording to use', !/hold on — you were right/i.test(neutral));
  check('neutral: names the phrases it forbids', /"good catch"/i.test(neutral) && /"you were right"/i.test(neutral));
  check('neutral: does not pin a graded answer (the issue is the tutor\'s own statement)', !/The answer you graded/.test(neutral));
  check('neutral: safety valve kept', /stand by/i.test(neutral));
  check('neutral: still forbids narration', /NEVER narrate/.test(neutral));
  check('neutral: single line', !neutral.includes('\n'));

  const guarded = buildJudgeCorrectionNote(['Not quite.'], '5', { mode: 'legacy', guardAttribution: true }) ?? '';
  check('legacy + guard: starts with the unchanged legacy text', guarded.startsWith(legacy));
  check('legacy + guard: forbids crediting a catch', /did not point (?:this|it) out/i.test(guarded));
  check('no claims ⇒ null in every mode', buildJudgeCorrectionNote([], '5', { mode: 'neutral' }) === null && buildJudgeCorrectionNote([], '5', { mode: 'retraction' }) === null);
}
// 2026-10-04 (review): a retraction and another flagged statement of the same
// turn ride ONE note — the second used to be dropped.
{
  const both = buildJudgeCorrectionNote(['Not quite.'], '5', { mode: 'retraction', otherClaims: ['So $x = 11$.'], scriptless: false }) ?? '';
  check('retraction + other: bracketed note convention', /^\[correction note — not from the student\]/.test(both));
  check('retraction + other: carries the denial', both.includes('"Not quite."'));
  check('retraction + other: carries the other claim', both.includes('"So $x = 11$."'));
  check('retraction + other: retraction text first', both.indexOf('"Not quite."') < both.indexOf('"So $x = 11$."'));
  check('retraction + other: the other claim is the tutor\'s own correction', /correct your own statement plainly/i.test(both) && /not something the student was right about/i.test(both));
  check('retraction + other: still pins the graded answer', /The answer you graded was "5"/.test(both));
  check('retraction + other: still forbids crediting a catch and narration', /did not point (?:this|it) out/i.test(both) && /NEVER narrate/.test(both));
  check('retraction + other: single line', !both.includes('\n'));
  check('retraction with no other claims is unchanged',
    buildJudgeCorrectionNote(['Not quite.'], '5', { mode: 'retraction', otherClaims: [] }) === buildJudgeCorrectionNote(['Not quite.'], '5', { mode: 'retraction' }));
  check('otherClaims is ignored outside retraction mode',
    buildJudgeCorrectionNote(['Not quite.'], '5', { mode: 'neutral', otherClaims: ['So $x = 11$.'] }) === buildJudgeCorrectionNote(['Not quite.'], '5', { mode: 'neutral' })
    && buildJudgeCorrectionNote(['Not quite.'], '5', { otherClaims: ['So $x = 11$.'] }) === buildJudgeCorrectionNote(['Not quite.'], '5'));
}
if (failed > 0) { console.error(`\n${failed} failure(s)`); process.exit(1); }
console.log(`\nAll ${passed} judge-correction-note tests passed.`);
