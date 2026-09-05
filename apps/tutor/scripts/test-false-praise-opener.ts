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
 *
 *  FIX ROUND 1 probes (task-7-report.md carries full RED/GREEN evidence).
 *  Important 1 — same-sentence self-correction remainder signals, verified by probe:
 *    DENIAL_RE / CONTRAST_MARKER_RE / trailing "?" against each probe's remainder:
 *      " but check your sign — that is not twelve."  -> denial=false contrast=true  question=false
 *      " - the sign is off though, try again."        -> denial=false contrast=true  question=false
 *      " so where did the extra one go?"               -> denial=false contrast=false question=true
 *    (third probe has neither a denial phrase nor a contrast word — the trailing "?"
 *    check is what keeps it quiet; see the module header for why that's safe.)
 *  Important 2 — MCQ-vs-value kill split, verified by probe:
 *    matchUtteranceToAnswer('twelve','13') -> disagree 'integer 12≠13' (value path, no "mcq" reason)
 *    matchUtteranceToAnswer('C','B',[{letter:'A',text:'A'},{letter:'B',text:'B'},{letter:'C',text:'C'}])
 *      -> disagree 'mcq C≠B' (reason starts with "mcq" -> kills without finalAnswerTurn)
 *  Minor (b) load-bearing fixes, verified by probe:
 *    matchUtteranceToAnswer('okay','12') / ('sure','12') / ('alright','12') / ('makes sense','12')
 *      all -> unknown ('empty side' / 'unparseable side') — no ACK_PHRASES entry ever reaches
 *      'disagree', so isPureAcknowledgment is asserted directly via the exported isAnswerShaped.
 *    matchUtteranceToAnswer('is it twelve?','13') -> disagree 'integer 12≠13' (load-bearing: the
 *      question-mark filter is what prevents this firing, not the comparator).
 *    matchUtteranceToAnswer('12','12,13') -> disagree 'integer 12≠1213' (load-bearing: isSingleValued
 *      is what prevents this firing, not the comparator, which strips the comma and disagrees anyway).
 *  Minor (c): matchUtteranceToAnswer('twelve','13',{length:1} as any) throws "choices is not iterable"
 *    inside resolveMcqLetter's `for...of` — checkFalsePraiseOpener's try/catch must swallow it.
 *
 *  FIX ROUND 2 probe (task-7-report.md carries full RED/GREEN evidence). The
 *  round-1 "ends in ?" signal was over-broad — it exempted the MCQ-letter
 *  kill for ANY trailing question, unrelated or not:
 *    WH_QUESTION_WORD_RE=/\b(?:where|what|why|how|which|when)\b/i, endsQ=/\?\s*$/
 *      " Should we try another one?"    -> wh=false endsQ=true   (NOT a self-correction any more)
 *      " so where did the extra one go?" -> wh=true  endsQ=true   (still a self-correction)
 *      " but check your sign."           -> wh=false endsQ=false  (self-corrects via contrast, not wh)
 *  Ruling: the wh-question signal only exempts the value-disagree branch,
 *  never the MCQ-letter kill branch; only DENIAL_RE/contrast exempts MCQ.
 */
import { checkFalsePraiseOpener, isSingleValued, isAnswerShaped, PRAISE_OPENER_STRICT_RE } from '../src/lib/tutor/voice/false-praise-opener';
let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) { if (cond) { passed++; console.log(`  ✓ ${name}`); } else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); } }

// Opener regex
check('strict opener: "Right, let\'s check…"', PRAISE_OPENER_STRICT_RE.test("Right, let's check the reasoning behind it."));
check('strict opener: "Exactly."', PRAISE_OPENER_STRICT_RE.test('Exactly.'));
check('strict opener excludes "Right idea"', !PRAISE_OPENER_STRICT_RE.test('Right idea — but check the sign.'));
// Fix round 2, open minor: pin the alternation with a positive control in
// the same assertion so these can't pass merely because "close"/"almost"
// aren't literally in the word list — a bug that also removed "correct"
// from the alternation would have left them trivially true forever.
check('strict opener excludes "Close" but accepts "Correct."', !PRAISE_OPENER_STRICT_RE.test('Close, but not quite.') && PRAISE_OPENER_STRICT_RE.test('Correct.'));
check('strict opener excludes "Almost" but accepts "Exactly."', !PRAISE_OPENER_STRICT_RE.test('Almost there.') && PRAISE_OPENER_STRICT_RE.test('Exactly.'));
check('strict opener excludes mid-sentence right', !PRAISE_OPENER_STRICT_RE.test('The roots part is right, the vertex is not.'));

// single-valued
check('single value', isSingleValued('12'));
check('single latex value', isSingleValued('$x = 12$'));
check('two-part answer is not single-valued', !isSingleValued('roots 2 and 3, vertex (1, -4)'));
check('semicolon list is not single-valued', !isSingleValued('x = 2; y = 5'));

// Tier split (fix round 1, Important 2): verified value disagree is advisory
// WITHOUT finalAnswerTurn, and a kill only WITH it. MCQ disagree always kills.
{
  const r = checkFalsePraiseOpener({ sentence: 'Right. So that gives us the answer.', studentUtterance: 'twelve', verifiedExpectedAnswer: '13' });
  check('verified value disagree, no finalAnswerTurn → advisory_false_praise', r.verdict === 'advisory_false_praise' && r.expected === '13', JSON.stringify(r));
}
{
  const r = checkFalsePraiseOpener({ sentence: 'Exactly. So that gives us the answer.', studentUtterance: 'twelve', verifiedExpectedAnswer: '13', finalAnswerTurn: true });
  check('verified value disagree, finalAnswerTurn:true → false_praise', r.verdict === 'false_praise' && r.expected === '13', JSON.stringify(r));
}
{ // instance 3: MCQ letters-only choices, student said the letter — kills even without finalAnswerTurn
  const r = checkFalsePraiseOpener({ sentence: "Right, let's check the reasoning behind it.", studentUtterance: 'C', verifiedExpectedAnswer: 'B', choices: [{ letter: 'A', text: 'A' }, { letter: 'B', text: 'B' }, { letter: 'C', text: 'C' }] });
  check('instance 3 (MCQ letter disagree, no finalAnswerTurn) → false_praise', r.verdict === 'false_praise', JSON.stringify(r));
}
{ // Important 2 probe case verbatim: intermediate-step check, not the card's final key
  const withoutFlag = checkFalsePraiseOpener({ sentence: 'Right, now add one.', studentUtterance: 'twelve', verifiedExpectedAnswer: '13' });
  check('"Right, now add one." + twelve vs 13, no finalAnswerTurn → advisory_false_praise', withoutFlag.verdict === 'advisory_false_praise', JSON.stringify(withoutFlag));
  const withFlag = checkFalsePraiseOpener({ sentence: 'Right, now add one.', studentUtterance: 'twelve', verifiedExpectedAnswer: '13', finalAnswerTurn: true });
  check('"Right, now add one." + twelve vs 13, finalAnswerTurn:true → false_praise', withFlag.verdict === 'false_praise', JSON.stringify(withFlag));
}
{ // agree → ok
  const r = checkFalsePraiseOpener({ sentence: 'Exactly.', studentUtterance: 'thirteen', verifiedExpectedAnswer: '13' });
  check('agree → ok', r.verdict === 'ok');
}
{ // unknown/hedged → ok
  const r = checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'um maybe something like that', verifiedExpectedAnswer: '13' });
  check('unparseable utterance → ok', r.verdict === 'ok');
}
{ // question utterances never fire — load-bearing (fix round 1, minor (b)):
  // 'is it twelve?' vs '13' is a genuine numeric DISAGREE ('integer 12≠13')
  // per probe, so this only stays ok because of the trailing-"?" filter, not
  // because the comparator itself was already unparseable.
  const r = checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'is it twelve?', verifiedExpectedAnswer: '13' });
  check('question utterance (load-bearing) → ok', r.verdict === 'ok', JSON.stringify(r));
}
{ // pure ack never fires. Fix round 1, minor (b): every ACK_PHRASES entry is
  // prose the comparator already calls unparseable on its own (probed:
  // 'okay'/'sure'/'alright'/'makes sense' vs '12' all -> unknown), so an
  // end-to-end-only assertion isn't load-bearing for isPureAcknowledgment —
  // assert the exported filter directly as well.
  check('isAnswerShaped rejects a pure ack directly', !isAnswerShaped('okay'));
  check('pure ack (end-to-end) → ok', checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'okay', verifiedExpectedAnswer: '12' }).verdict === 'ok');
}
{ // two-part expected → never fires (realistic two-part-class shape)
  const r = checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'two and three', verifiedExpectedAnswer: 'roots 2 and 3, vertex (1, -4)' });
  check('multi-valued expected (two-part class) → ok', r.verdict === 'ok');
}
{ // load-bearing (fix round 1, minor (b)): '12' vs '12,13' IS a comparator
  // 'disagree' per probe ('integer 12≠1213', comma stripped and digits
  // concatenated) — only isSingleValued's comma rejection keeps this quiet.
  const r = checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: '12', verifiedExpectedAnswer: '12,13' });
  check('multi-valued expected (load-bearing, comparator would disagree) → ok', r.verdict === 'ok', JSON.stringify(r));
}
{ // non-praise opener never fires
  const r = checkFalsePraiseOpener({ sentence: 'Not quite — check the sign.', studentUtterance: 'twelve', verifiedExpectedAnswer: '13' });
  check('denial opener → ok', r.verdict === 'ok');
}
{ // advisory tier
  const r = checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'twelve', unverifiedCardAnswer: '13' });
  check('unverified disagree → advisory', r.verdict === 'advisory_false_praise' && r.expected === '13');
  // finalAnswerTurn:true forces the verified branch to kill, demonstrating
  // it's the VERIFIED answer ('13'), not the unverified one ('12'), that wins.
  const r2 = checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'twelve', verifiedExpectedAnswer: '13', unverifiedCardAnswer: '12', finalAnswerTurn: true });
  check('verified wins over unverified', r2.verdict === 'false_praise' && r2.expected === '13', JSON.stringify(r2));
}
{ // legit discourse-marker "Right." before a NEW problem after a correct answer
  const r = checkFalsePraiseOpener({ sentence: "Right. Here's the next one: a 5 kg box…", studentUtterance: 'thirteen', verifiedExpectedAnswer: '13' });
  check('"Right." after a correct answer → ok', r.verdict === 'ok');
}

// Fix round 1, Important 1 — same-sentence self-correction. All three probes
// use the exact args that were confirmed (by probe) to return false_praise
// before this round's fix; they must all be ok now.
{
  const r = checkFalsePraiseOpener({ sentence: 'Right, but check your sign — that is not twelve.', studentUtterance: 'twelve', verifiedExpectedAnswer: '13' });
  check('same-sentence contrast marker ("but") → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = checkFalsePraiseOpener({ sentence: 'Right - the sign is off though, try again.', studentUtterance: 'twelve', verifiedExpectedAnswer: '13' });
  check('same-sentence contrast marker ("though") → ok', r.verdict === 'ok', JSON.stringify(r));
}
{
  const r = checkFalsePraiseOpener({ sentence: 'Right, so where did the extra one go?', studentUtterance: 'twelve', verifiedExpectedAnswer: '13' });
  check('same-sentence follow-up question → ok', r.verdict === 'ok', JSON.stringify(r));
}
{ // self-correction wins even when finalAnswerTurn would otherwise force a kill
  const r = checkFalsePraiseOpener({ sentence: 'Right, so where did the extra one go?', studentUtterance: 'twelve', verifiedExpectedAnswer: '13', finalAnswerTurn: true });
  check('self-correction beats finalAnswerTurn:true → ok', r.verdict === 'ok', JSON.stringify(r));
}
{ // a genuine DENIAL_RE-matching remainder (not just a contrast word) also self-corrects
  const r = checkFalsePraiseOpener({ sentence: 'Right, not quite — check that again.', studentUtterance: 'twelve', verifiedExpectedAnswer: '13' });
  check('same-sentence DENIAL_RE match → ok', r.verdict === 'ok', JSON.stringify(r));
}

// Fix round 2, New Important — the wh-question signal must NEVER exempt the
// MCQ-letter kill, and must require an actual wh-word (not just any "?").
{ // the reported over-broad case: an UNRELATED question after the opener
  // must not save an MCQ-letter disagree from a kill.
  const r = checkFalsePraiseOpener({
    sentence: 'Right! Should we try another one?', studentUtterance: 'C', verifiedExpectedAnswer: 'B',
    choices: [{ letter: 'A', text: 'A' }, { letter: 'B', text: 'B' }, { letter: 'C', text: 'C' }],
  });
  check('unrelated question after MCQ-letter disagree → false_praise (pinned)', r.verdict === 'false_praise', JSON.stringify(r));
}
{ // wh-question still exempts the VALUE branch, even with finalAnswerTurn:true
  const r = checkFalsePraiseOpener({ sentence: 'Right, so where did the extra one go?', studentUtterance: 'twelve', verifiedExpectedAnswer: '13', finalAnswerTurn: true });
  check('wh-question + finalAnswerTurn:true (value) → ok (pinned)', r.verdict === 'ok', JSON.stringify(r));
}
{ // the SAME shape, but a non-wh question, with finalAnswerTurn:true — must fire
  const r = checkFalsePraiseOpener({ sentence: 'Right! Should we try another one?', studentUtterance: 'twelve', verifiedExpectedAnswer: '13', finalAnswerTurn: true });
  check('non-wh question + finalAnswerTurn:true (value) → false_praise (pinned)', r.verdict === 'false_praise', JSON.stringify(r));
}
{ // contrast marker (strong signal) exempts the MCQ-letter kill too
  const r = checkFalsePraiseOpener({
    sentence: 'Right, but check your sign.', studentUtterance: 'C', verifiedExpectedAnswer: 'B',
    choices: [{ letter: 'A', text: 'A' }, { letter: 'B', text: 'B' }, { letter: 'C', text: 'C' }],
  });
  check('contrast marker exempts MCQ-letter kill too → ok (pinned)', r.verdict === 'ok', JSON.stringify(r));
}

// Minor (c): a throwing comparator call must still resolve to ok, never throw.
{
  const badChoices = ({ length: 1 } as unknown) as Array<{ letter: string; text: string }>;
  let threw = false;
  let r: ReturnType<typeof checkFalsePraiseOpener> | undefined;
  try {
    r = checkFalsePraiseOpener({ sentence: 'Right.', studentUtterance: 'twelve', verifiedExpectedAnswer: '13', choices: badChoices });
  } catch {
    threw = true;
  }
  check('throwing comparator input never throws, resolves to ok', !threw && r?.verdict === 'ok', JSON.stringify(r));
}

console.log(`\n${passed} passed, ${failed} failed`); process.exit(failed ? 1 : 0);
