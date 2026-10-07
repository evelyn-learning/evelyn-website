/**
 * Judge correction notes — the 2026-10-05 round (21 scripted Homework Help
 * sessions on the GreenApple sandbox). Every case below is a judge output
 * recorded in an inspector timeline of that run (docs/whitelabel/greenapple/
 * integration/tutor-sessions-2026-10-05/inspector/).
 *
 * What went wrong with the `neutral` note of 2026-10-04:
 *  (i)  FALSE PRAISE — Precalculus: the student gave g⁻¹(x) = 3x − 1, the
 *       tutor said "That's correct too — g⁻¹(x) = 3x+1", and the note sent
 *       the tutor to "correct your own statement": next turn "Let me correct
 *       something I said: g⁻¹(x) = 3x+1 is right" — the student was never
 *       told 3x − 1 was wrong.
 *  (ii) CORRECT MATHS — Geometry: reason "The tutor's statement is
 *       arithmetically correct (85 ÷ 5 = 17)…", kind=grounding,
 *       verdict=not_an_answer → note planted → "…gives 17, not 41 — that's
 *       on me" (41 was the STUDENT's number).
 *  The note also handed over the sentence "Let me correct something I said"
 *  (recited in 6 sessions) and told the tutor not to change a verdict the
 *  judge had found wrong.
 *
 * Fixture fidelity: each issue's claim, issueKind, studentAnswerVerdict and
 * severity are as recorded. The timeline stores `why` only for advisory
 * flags and cuts it at 120 characters, so the text after that point — and
 * the whole reason of the kill-class issues — is filled in here. Only
 * GEOMETRY's reason is load-bearing, and its decisive words ("The tutor's
 * statement is arithmetically correct (85 ÷ 5 = 17), but the student's
 * previous answer is not provided") are inside the recorded prefix.
 *
 * Run: npx tsx scripts/test-judge-note-false-praise.ts (npm run test:judge-note-false-praise)
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  decideJudgeIssue, planJudgeNote, buildPlannedJudgeNote, judgeReasonSaysStatementCorrect, describeJudgeIssueDecision,
} from '../src/lib/tutor/voice/judge-issue-decision';
import { buildJudgeCorrectionNote } from '../src/lib/tutor/voice/judge-correction-note';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`); passed++; }
  catch (err) { console.log(`  ✗ ${name}\n      ${(err as Error).message}`); failed++; }
}
type Issue = { claim: string; why: string; issueKind: string; studentAnswerVerdict: string };
const decide = (issue: Issue, severity: 'kill' | 'advisory', falsePraiseRound?: boolean) =>
  decideJudgeIssue({ enabled: true, issue, severity, ...(falsePraiseRound === undefined ? {} : { falsePraiseRound }) });
const noteFor = (issue: Issue, severity: 'kill' | 'advisory', studentAnswer: string) => {
  const decision = decide(issue, severity);
  return buildPlannedJudgeNote(planJudgeNote([{ claim: issue.claim, decision }]), studentAnswer, { guardAttribution: true });
};

// ── Recorded judge outputs ────────────────────────────────────────────────
const PRECALC: Issue = {
  claim: "That's correct too — $g^{-1}(x) = 3x+1$",
  why: "The student's answer was g^-1(x) = 3x - 1, which is incorrect; the tutor affirmed it while writing 3x + 1.",
  issueKind: 'false_praise', studentAnswerVerdict: 'incorrect',
};
const PRECALC_STUDENT = 'For (b): x = (y - 1)/3, so y = 3x - 1. g^-1(x) = 3x - 1.';
const GEOMETRY: Issue = {
  claim: 'dividing $5x = 85$ by $5$ gives $x = 17$',
  why: "The tutor's statement is arithmetically correct (85 ÷ 5 = 17), but the student's previous answer is not provided—there is no answer to grade.",
  issueKind: 'grounding', studentAnswerVerdict: 'not_an_answer',
};
const ALGEBRA1_PRAISE: Issue = {
  claim: 'Yes, exactly. Both sides came out to $-15$, so $y = -2$ checks out',
  why: "The tutor affirmed the student's answer of '9' with 'Yes, exactly,' but the student was being asked whether the check they just ran worked.",
  issueKind: 'false_praise', studentAnswerVerdict: 'not_an_answer',
};
const ALGEBRA1_OTHER: Issue = {
  claim: 'On the left, $4$ times $7$ is $28$. On the right, $8$ minus $6$ is $2$',
  why: 'When substituting m = 4 into 4(m+3) = 2m - 6: left side is 4(4+3) = 4(7) = 28 (correct), but right side is 2(4) - 6 = 8 - 6 = 2, so the sides differ.',
  issueKind: 'other', studentAnswerVerdict: 'incorrect',
};
const APCHEM_PRAISE: Issue = {
  claim: 'Right. $180 \\div 30.03 = 6$, exactly matching your guess.',
  why: "The tutor affirmed the student's guess as exactly matching, but 180 ÷ 30.03 is about 5.99.",
  issueKind: 'false_praise', studentAnswerVerdict: 'incorrect',
};
const APCHEM_TONE: Issue = {
  claim: "Let's check that: $30 \\times 3 = 90$, not $180$ — so the multiplier isn't 3",
  why: 'The tutor states that 30 × 3 = 90, which is correct arithmetic. However, the tutor opened with "Nice." before correcting.',
  issueKind: 'tone_or_wording', studentAnswerVerdict: 'incorrect',
};
const BIOLOGY: Issue = {
  claim: 'Right — exactly.',
  why: "The student answered 'denatured', which does not answer the question about substrate concentration; the tutor affirmed it.",
  issueKind: 'false_praise', studentAnswerVerdict: 'incorrect',
};
const GEOMETRY_YES: Issue = {
  claim: 'Right.',
  why: "The student's answer 'yes' is not a substantive response to the tutor's question 'what happens when you subtract 5 from both sides'.",
  issueKind: 'false_praise', studentAnswerVerdict: 'not_an_answer',
};
const GEOMETRY_41: Issue = {
  claim: 'dividing 85 by 5 actually gives 17, not 41',
  why: "The tutor states they said '41' earlier, but reviewing the whiteboard and conversation history, there is no evidence the tutor said 41.",
  issueKind: 'grounding', studentAnswerVerdict: 'not_an_answer',
};
const PRECALC_OTHER: Issue = {
  claim: "We're simplifying $\\dfrac{3x}{3}$ from problem 2, not problem 1",
  why: "The whiteboard shows this is Problem 2 (the second problem on the current page), but the tutor refers to it as 'problem 1' earlier.",
  issueKind: 'other', studentAnswerVerdict: 'incorrect',
};

console.log('\n(i) false praise — a note about the STUDENT\'s answer');
test('Precalculus (kill-class false_praise, incorrect): the false-praise note, nothing withheld', () => {
  const d = decide(PRECALC, 'kill');
  assert.deepEqual([d.plantNote, d.noteMode, d.withholdCredit, d.reason], [true, 'false_praise', false, 'false-praise']);
  assert.match(describeJudgeIssueDecision(d), /note:false_praise/);
});
test('Precalculus: the note names the student\'s answer and tells the tutor to say it was not right', () => {
  const note = noteFor(PRECALC, 'kill', PRECALC_STUDENT) ?? '';
  assert.match(note, /^\[correction note — not from the student\]/);
  assert.ok(note.includes('3x - 1'), 'quotes the answer the student gave');
  assert.match(note, /affirmed the student's answer/);
  assert.match(note, /check THAT answer — the student's/);
  assert.match(note, /saying so plainly and kindly/);
  assert.match(note, /make clear what is right/);
  assert.match(note, /re-ask or move on/);
  assert.match(note, /THEIR value: never present it as something you said/);
  assert.match(note, /If on re-checking the student's answer was correct, continue naturally/);
  assert.match(note, /NEVER narrate/);
  assert.equal(note.includes('\n'), false);
});
test('the false-praise note never says "correct your own statement", hands over no sentence, and never tells the tutor to keep its verdict', () => {
  for (const [issue, sev, ans] of [[PRECALC, 'kill', PRECALC_STUDENT], [BIOLOGY, 'kill', 'denatured'], [APCHEM_PRAISE, 'kill', '6'], [ALGEBRA1_PRAISE, 'advisory', '9']] as const) {
    const note = noteFor(issue, sev, ans) ?? '';
    assert.ok(note, `a note is planted for ${issue.claim}`);
    assert.doesNotMatch(note, /Let me correct something I said/i);
    assert.doesNotMatch(note, /correct your own (?:earlier )?statement/i);
    assert.doesNotMatch(note, /do not change your verdict/i);
    assert.doesNotMatch(note, /you were right/i);
  }
});
test('Biology "Right — exactly." to "denatured" (kill-class): false-praise note quoting "denatured"', () => {
  const note = noteFor(BIOLOGY, 'kill', 'denatured') ?? '';
  assert.ok(note.includes('"denatured"'));
});
test('Algebra 1 "Yes, exactly" to a bare "9" (advisory, not_an_answer, maths-bearing): false-praise note', () => {
  const d = decide(ALGEBRA1_PRAISE, 'advisory');
  assert.deepEqual([d.plantNote, d.noteMode], [true, 'false_praise']);
  assert.match(noteFor(ALGEBRA1_PRAISE, 'advisory', '9') ?? '', /was not an answer to the question you had asked/);
});
test('AP Chemistry "Right. 180 ÷ 30.03 = 6, exactly matching your guess" (kill-class): false-praise note with the stand-by valve', () => {
  const note = noteFor(APCHEM_PRAISE, 'kill', "I don't know, maybe C6H12O6?") ?? '';
  assert.match(note, /If on re-checking the student's answer was correct, continue naturally and do not mention this review/);
});
test('a bare advisory "Right." with no maths keeps the plant rule: no note (Geometry "yes")', () => {
  const d = decide(GEOMETRY_YES, 'advisory');
  assert.deepEqual([d.plantNote, d.reason], [false, 'not-noteworthy']);
});
test('false_praise with verdict "correct" is a self-contradiction: nothing', () => {
  const d = decide({ ...PRECALC, studentAnswerVerdict: 'correct' }, 'kill');
  assert.deepEqual([d.plantNote, d.reason], [false, 'judge-self-contradiction']);
});

console.log('\n(ii) no note on correct maths / nothing to correct');
test('Geometry (grounding, not_an_answer, reason says "arithmetically correct"): NO note', () => {
  const d = decide(GEOMETRY, 'advisory');
  assert.equal(d.plantNote, false);
  assert.equal(d.withholdCredit, false);
  assert.equal(d.reason, 'statement-judged-correct');
  assert.equal(noteFor(GEOMETRY, 'advisory', 'can you check my answer x = 41'), null);
});
test('Geometry, were it kill-class: still no note (the reason itself says the statement is correct)', () => {
  assert.equal(decide(GEOMETRY, 'kill').plantNote, false);
});
test('grounding / other with verdict not_an_answer and no "correct" in the reason: NO note', () => {
  for (const kind of ['grounding', 'other']) {
    const d = decide({ claim: 'so $x = 17$ and both angles follow', why: 'The student did not provide an answer in the previous turn.', issueKind: kind, studentAnswerVerdict: 'not_an_answer' }, 'advisory');
    assert.deepEqual([d.plantNote, d.reason], [false, 'not-an-answer-nothing-to-correct'], kind);
  }
});
test('Geometry follow-up ("…17, not 41", grounding, not_an_answer): no note', () => {
  assert.equal(decide(GEOMETRY_41, 'advisory').plantNote, false);
});
test('AP Chemistry tone_or_wording ("which is correct arithmetic. However…"): nothing, as before', () => {
  assert.deepEqual([decide(APCHEM_TONE, 'advisory').plantNote, decide(APCHEM_TONE, 'advisory').reason], [false, 'tone-or-wording']);
});
test('judgeReasonSaysStatementCorrect: only an explicit "the statement IS correct"', () => {
  for (const why of [
    GEOMETRY.why,
    "The tutor's calculation is correct, but it does not reference the student's work.",
    'The statement is mathematically correct; however the tone is abrupt.',
    "The tutor's arithmetic was indeed correct here.",
  ]) assert.equal(judgeReasonSaysStatementCorrect(why), true, why);
  for (const why of [
    ALGEBRA1_OTHER.why,                       // "(correct), but right side…" — one part right, another faulted
    PRECALC.why, BIOLOGY.why, PRECALC_OTHER.why, GEOMETRY_41.why,
    "The tutor's statement is not correct: 85 ÷ 5 is 17.",
    'The tutor states that 7 × 8 = 54, which is incorrect.',
    "The student's answer is correct and the tutor rejected it.",
    'The correct answer is 17; the tutor said 41.',
    '', undefined, null, 42,
  ]) assert.equal(judgeReasonSaysStatementCorrect(why), false, String(why));
});
test('a real wrong_math issue still plants (reason does not call the statement correct)', () => {
  // 2026-10-06b: with studentAnswerVerdict "unsure" nothing is planted any
  // more (TUTOR_JUDGE_UNSURE_NO_NOTE) — the same issue with any other verdict
  // on the student's answer, or none, plants as before.
  const issue = { claim: 'So $7 \\times 8 = 54$', why: 'The tutor states that 7 × 8 = 54, which is incorrect; it is 56.', issueKind: 'wrong_math' };
  for (const v of ['not_an_answer', 'incorrect', 'correct']) {
    const d = decide({ ...issue, studentAnswerVerdict: v }, 'advisory');
    assert.deepEqual([d.plantNote, d.noteMode, d.reason], [true, 'neutral', 'own-statement'], v);
  }
  const before = decideJudgeIssue({ enabled: true, issue: { ...issue, studentAnswerVerdict: 'unsure' }, severity: 'advisory', unsureNoNote: false });
  assert.deepEqual([before.plantNote, before.noteMode, before.reason], [true, 'neutral', 'own-statement']);
  const now = decide({ ...issue, studentAnswerVerdict: 'unsure' }, 'advisory');
  assert.deepEqual([now.plantNote, now.reason], [false, 'judge-unsure']);
});
test('other + incorrect + maths claim (Algebra 1, Precalculus): neutral note, as before', () => {
  for (const i of [ALGEBRA1_OTHER, PRECALC_OTHER]) {
    const d = decide(i, 'advisory');
    assert.deepEqual([d.plantNote, d.noteMode], [true, 'neutral'], i.claim);
  }
});

console.log('\nthe neutral note describes the task; it supplies no sentence');
test('neutral: no "Let me correct something I said", no "do not change your verdict"', () => {
  const note = noteFor(ALGEBRA1_OTHER, 'advisory', 'can you check my answer x = 4') ?? '';
  assert.match(note, /^\[correction note — not from the student\]/);
  assert.ok(note.includes('$4$ times $7$ is $28$'));
  assert.doesNotMatch(note, /Let me correct something I said/i);
  assert.doesNotMatch(note, /do not change your verdict/i);
  assert.match(note, /in your own words/);
  assert.match(note, /THEIR value — never present it as something you said/);
  assert.match(note, /If on re-checking you stand by what you said, continue naturally and do not mention this review/);
  assert.match(note, /do not say "you were right" or "good catch"/);
  assert.match(note, /NEVER narrate/);
});
test('no mode hands over the script line (retraction / legacy riders included)', () => {
  const other = ['So $x = 11$.'];
  for (const note of [
    buildJudgeCorrectionNote(['Not quite.'], '5', { mode: 'retraction', otherClaims: other }),
    buildJudgeCorrectionNote(other, '5', { mode: 'neutral' }),
    buildJudgeCorrectionNote(['Right.'], '5', { mode: 'false_praise', otherClaims: other }),
    buildPlannedJudgeNote({ claims: ['Not quite.'], mode: 'legacy', otherClaims: other }, '5'),
  ]) {
    assert.ok(note);
    assert.doesNotMatch(note!, /Let me correct something I said/i);
    assert.ok(note!.includes('So $x = 11$.'));
  }
});
test('the retraction note (a wrongly denied CORRECT answer) is kept', () => {
  const d = decideJudgeIssue({ enabled: true, severity: 'advisory', issue: { claim: 'Not quite on $\\sqrt{9}$', why: 'The student was right.', issueKind: 'false_denial', studentAnswerVerdict: 'correct' } });
  assert.deepEqual([d.plantNote, d.noteMode, d.withholdCredit], [true, 'retraction', true]);
  const note = buildPlannedJudgeNote(planJudgeNote([{ claim: 'Not quite on $\\sqrt{9}$', decision: d }]), 'maybe 1/6?') ?? '';
  assert.match(note, /the student's answer was correct and that your previous turn rejected it/);
  assert.match(note, /you were right/);
});

console.log('\none note per pass');
test('false praise + another planted claim: one false-praise note carrying the other as the tutor\'s own statement', () => {
  const plan = planJudgeNote([
    { claim: ALGEBRA1_OTHER.claim, decision: decide(ALGEBRA1_OTHER, 'advisory') },
    { claim: PRECALC.claim, decision: decide(PRECALC, 'kill') },
  ]);
  assert.equal(plan?.mode, 'false_praise');
  assert.deepEqual(plan?.claims, [PRECALC.claim]);
  assert.deepEqual(plan?.otherClaims, [ALGEBRA1_OTHER.claim]);
  const note = buildPlannedJudgeNote(plan, PRECALC_STUDENT) ?? '';
  assert.ok(note.indexOf(PRECALC.claim) < note.indexOf('$4$ times $7$'));
  assert.match(note, /Separately, the same review flagged another statement/);
});
test('a retraction still wins over a false-praise claim of the same pass', () => {
  const retract = decideJudgeIssue({ enabled: true, severity: 'advisory', issue: { claim: 'Not quite.', issueKind: 'false_denial', studentAnswerVerdict: 'correct' } });
  const plan = planJudgeNote([{ claim: PRECALC.claim, decision: decide(PRECALC, 'kill') }, { claim: 'Not quite.', decision: retract }]);
  assert.equal(plan?.mode, 'retraction');
  assert.deepEqual(plan?.otherClaims, [PRECALC.claim]);
});

console.log('\nflag off = the 2026-10-04 table and texts');
test('falsePraiseRound:false — Precalculus plants the neutral note, Geometry plants again', () => {
  assert.deepEqual([decide(PRECALC, 'kill', false).noteMode, decide(PRECALC, 'kill', false).reason], ['neutral', 'own-statement']);
  assert.deepEqual([decide(GEOMETRY, 'advisory', false).plantNote, decide(GEOMETRY, 'advisory', false).noteMode], [true, 'neutral']);
});
test('scriptless:false — the neutral text is the 2026-10-04 one', () => {
  const note = buildJudgeCorrectionNote(['So $x = 11$.'], '5', { mode: 'neutral', scriptless: false }) ?? '';
  assert.match(note, /Let me correct something I said/);
});

console.log('\nwiring');
test('VoiceTutorRealtime passes the whole issue (with `why`) and the graded transcript', () => {
  const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  assert.ok(vtr.includes("decideJudgeIssue({ enabled: TUTOR_JUDGE_STRUCTURED_VERDICT, issue: i, severity: 'advisory' })"));
  assert.ok(vtr.includes("decideJudgeIssue({ enabled: TUTOR_JUDGE_STRUCTURED_VERDICT, issue: i, severity: 'kill' })"));
  assert.ok(vtr.includes('buildPlannedJudgeNote(advisoryNotePlan, transcript,'));
  assert.ok(vtr.includes('buildPlannedJudgeNote(killNotePlan, transcript,'));
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
