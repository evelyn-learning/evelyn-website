/** Spec §D.2 — praise-class opener after a student answer that DISAGREES with the verified key.
 *  Live shapes replayed: instance 3 (portal-qa-typed-a-1788565070 t5) "Right, let's check the reasoning behind it." after a wrong MCQ pick;
 *  instance 1 (two-part, mx-partial-two-part) must NOT fire. Usage: npx tsx scripts/test-false-praise-opener.ts
 *
 *  Step 1 replay (spec §D.4), run before writing this file:
 *    npx tsx -e "import {matchUtteranceToAnswer as m} from './src/lib/tutor/voice/utterance-answer-match'; console.log(m('x equals nine', 'B', [{letter:'A',text:'x = 21'},{letter:'B',text:'x = 7'},{letter:'C',text:'x = 9'}])); console.log(m('x equals nine','C',[{letter:'A',text:'x = 21'},{letter:'B',text:'x = 7'},{letter:'C',text:'x = 9'}])); console.log(m('nine','C',[{letter:'C',text:'C'}]))"
 *  Output:
 *    { verdict: 'unknown', reason: 'mcq: utterance unresolvable' }
 *    { verdict: 'unknown', reason: 'mcq: utterance unresolvable' }
 *    { verdict: 'unknown', reason: 'mcq: utterance unresolvable' }
 *  Confirms the brief's prediction: the MCQ-text path (student says the value in words,
 *  e.g. "x equals nine") returns `unknown` against value-shaped choice text — it cannot
 *  resolve a spoken value onto a lettered option whose text isn't itself a bare letter.
 *  A supplemental check with a letters-only choice shape ({letter,text:letter}, the shape
 *  VoiceTutorRealtime actually passes) and the student saying the letter directly:
 *    npx tsx -e "import {matchUtteranceToAnswer as m} from './src/lib/tutor/voice/utterance-answer-match'; console.log(m('C', 'B', [{letter:'A',text:'A'},{letter:'B',text:'B'},{letter:'C',text:'C'}]));"
 *  Output:
 *    { verdict: 'disagree', reason: 'mcq C≠B' }
 *  So the guard's MCQ coverage is letters-only (student says the letter, e.g. "C") —
 *  the instance-3 test below uses that shape, not spoken-value-vs-lettered-choices.
 */
import { checkFalsePraiseOpener, isSingleValued, PRAISE_OPENER_STRICT_RE } from '../src/lib/tutor/voice/false-praise-opener';
let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }

// Opener regex
check('strict opener: "Right, let\'s check…"', PRAISE_OPENER_STRICT_RE.test("Right, let's check the reasoning behind it."));
check('strict opener: "Exactly."', PRAISE_OPENER_STRICT_RE.test('Exactly.'));
check('strict opener excludes "Right idea"', !PRAISE_OPENER_STRICT_RE.test('Right idea — but check the sign.'));
check('strict opener excludes "Close"', !PRAISE_OPENER_STRICT_RE.test('Close, but not quite.'));
check('strict opener excludes "Almost"', !PRAISE_OPENER_STRICT_RE.test('Almost there.'));
check('strict opener excludes mid-sentence right', !PRAISE_OPENER_STRICT_RE.test('The roots part is right, the vertex is not.'));

// single-valued
check('single value', isSingleValued('12'));
check('single latex value', isSingleValued('$x = 12$'));
check('two-part answer is not single-valued', !isSingleValued('roots 2 and 3, vertex (1, -4)'));
check('semicolon list is not single-valued', !isSingleValued('x = 2; y = 5'));

// KILL tier — verified value disagree
{
  const r = checkFalsePraiseOpener({ sentence: 'Right. So that gives us the answer.', studentUtterance: 'twelve', verifiedExpectedAnswer: '13' });
  check('verified value disagree + praise opener → false_praise', r.verdict === 'false_praise' && r.expected === '13', JSON.stringify(r));
}
{ // instance 3: MCQ letters-only choices, student said the letter
  const r = checkFalsePraiseOpener({ sentence: "Right, let's check the reasoning behind it.", studentUtterance: 'C', verifiedExpectedAnswer: 'B', choices: [{ letter: 'A', text: 'A' }, { letter: 'B', text: 'B' }, { letter: 'C', text: 'C' }] });
  check('instance 3 (MCQ letter disagree) → false_praise', r.verdict === 'false_praise', JSON.stringify(r));
}
{ // agree → ok
  const r = checkFalsePraiseOpener({ sentence: 'Exactly.', studentUtterance: 'thirteen', verifiedExpectedAnswer: '13' });
  check('agree → ok', r.verdict === 'ok');
}
{ // unknown/hedged → ok
  const r = checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'um maybe something like that', verifiedExpectedAnswer: '13' });
  check('unparseable utterance → ok', r.verdict === 'ok');
}
{ // question / ack utterances never fire
  check('question utterance → ok', checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'is it thirteen?', verifiedExpectedAnswer: '12' }).verdict === 'ok');
  check('pure ack → ok', checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'okay', verifiedExpectedAnswer: '12' }).verdict === 'ok');
}
{ // two-part expected → never fires
  const r = checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'two and three', verifiedExpectedAnswer: 'roots 2 and 3, vertex (1, -4)' });
  check('multi-valued expected → ok (two-part class)', r.verdict === 'ok');
}
{ // non-praise opener never fires
  const r = checkFalsePraiseOpener({ sentence: 'Not quite — check the sign.', studentUtterance: 'twelve', verifiedExpectedAnswer: '13' });
  check('denial opener → ok', r.verdict === 'ok');
}
{ // advisory tier
  const r = checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'twelve', unverifiedCardAnswer: '13' });
  check('unverified disagree → advisory', r.verdict === 'advisory_false_praise' && r.expected === '13');
  const r2 = checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'twelve', verifiedExpectedAnswer: '13', unverifiedCardAnswer: '12' });
  check('verified wins over unverified', r2.verdict === 'false_praise');
}
{ // legit discourse-marker "Right." before a NEW problem after a correct answer
  const r = checkFalsePraiseOpener({ sentence: "Right. Here's the next one: a 5 kg box…", studentUtterance: 'thirteen', verifiedExpectedAnswer: '13' });
  check('"Right." after a correct answer → ok', r.verdict === 'ok');
}
console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
