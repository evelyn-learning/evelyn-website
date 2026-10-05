/**
 * Which student turns are answer attempts, and which tutor replies make them
 * wrong-answer events.
 *
 * Live (student gac-test-001, "x > 5 or x < 3"): six wrong answers, three
 * ledger entries; no `pacing_streak incorrect=` at all; `correct=2` and
 * `correct=3` credited on the student's QUESTIONS; and in another session a
 * self-report ("i do not know fractions operations well") credited
 * `correct=1`.
 *
 * Run: npx tsx scripts/test-answer-attempt.ts
 */
import { strict as assert } from 'node:assert';
import { isAnswerAttempt, isBareShortAnswer, inferWrongEvent } from '../src/lib/tutor/orchestrator/answer-attempt';
import { isStudentQuestion, isSelfReport, studentTurnShape, isHedgedValueAnswer } from '../src/lib/tutor/orchestrator/student-turn-shape';
import { isLedgerStuckCue } from '../src/lib/tutor/orchestrator/struggle-ledger';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}`); console.log(`      ${(e as Error).message}`); }
}

console.log('\nstudent turn shape — questions');

test('LIVE: the two credited questions are questions', () => {
  assert.equal(isStudentQuestion('how to solve: x>5 or x<3'), true);
  assert.equal(isStudentQuestion('how do you pronounce this problem: x > 5 or x < 3'), true);
  assert.equal(studentTurnShape('how to solve: x>5 or x<3'), 'question');
});
test('interrogative-led turns', () => {
  for (const q of [
    'what does strict mean', 'why is 5 not included?', 'when do I flip the sign', 'where does 3 go',
    'which one is the boundary', 'can you explain step 2', 'could you show me 5 on the line',
    'do I shade left of 3', 'does the line go through 5 for you', 'should I use a closed circle',
    'are we done with number 3', 'is this the same as the last problem we did before',
  ]) assert.equal(isStudentQuestion(q), true, q);
});
test('a trailing "?" with no proposed value is a question', () => {
  assert.equal(isStudentQuestion('so the line is the boundary of the whole region?'), true);
});
test('a PROPOSED answer in question form is NOT a question', () => {
  for (const a of ['Is it x = 4, y = 2?', 'is the answer 3 over 4 or 4 over 3?', 'is it 4?', 'is it x?', 'is it solid?', 'would it be 6', 'could it be 7?', 'does 6 work?', 'what about 6', 'how about 2?', '5?', 'solid?', 'above the line?', 'maybe 5?']) {
    assert.equal(isStudentQuestion(a), false, a);
  }
});
test('plain answers are not questions', () => {
  for (const a of ['5', '3.', 'below the line.', 'x is greater than 5', 'I got 12 because 3 times 4 is 12', 'solid.']) {
    assert.equal(isStudentQuestion(a), false, a);
  }
});

console.log('\nstudent turn shape — self-reports');

test('LIVE: "i do not know fractions operations well"', () => {
  assert.equal(isSelfReport('i do not know fractions operations well'), true);
  assert.equal(studentTurnShape('i do not know fractions operations well'), 'self_report');
});
test('self-reports of difficulty', () => {
  for (const s of [
    "I don't know", "I don't know how to do this", "I'm not good at fractions", "I am not good at 2 digit multiplication",
    "I don't understand", "I do not understand the second step", 'I forgot', 'I forgot how to do this',
    "um, I don't get it", "I can't remember the rule", "I'm confused", 'I have no idea', 'i dont know',
    "honestly I'm bad at word problems", 'I never learned this',
  ]) assert.equal(isSelfReport(s), true, s);
});
test('a hedged ANSWER is not a self-report', () => {
  for (const a of ["I don't know, maybe 5?", "I'm not sure but I think it's 7", 'I think 6', 'I got 12', "I don't know, is it solid?"]) {
    assert.equal(isSelfReport(a), false, a);
  }
});
test('"I don\'t know" mid-answer is untouched (leading clause only)', () => {
  assert.equal(isSelfReport("it's 12 because, I don't know, 3 times 4"), false);
});
test('answers are answer-like', () => {
  assert.equal(studentTurnShape('5'), 'answer_like');
  assert.equal(studentTurnShape('below the line.'), 'answer_like');
  assert.equal(studentTurnShape(''), 'answer_like');
});

console.log('\nbare short answers');

test('LIVE: the invisible answers', () => {
  for (const a of ['3.', '5', '2', 'solid.', 'below the line.', 'dashed', 'x > 5', 'three', '-2', '3/4']) {
    assert.equal(isBareShortAnswer(a), true, a);
  }
});
test('filler, acknowledgements and hedges are never short answers', () => {
  for (const f of ['ok', 'okay', 'yes', 'yeah', 'sure', 'hmm', "I don't know", 'idk', 'no idea', 'not sure', 'um', 'ready', 'go on', 'next', 'thanks', 'got it', 'what', 'huh?', 'wait', 'cool', 'i see', 'no', 'help', '[start lesson]', '']) {
    assert.equal(isBareShortAnswer(f), false, f);
  }
});
test('longer utterances are not BARE short answers', () => {
  assert.equal(isBareShortAnswer('I think the region is below the line'), false);
  assert.equal(isBareShortAnswer('how to solve: x>5 or x<3'), false);
});

console.log('\nreal answers the first cut classed as question / self-report (review, 2026-10-04)');

const LED_ANSWERS = [
  "I don't know, 5?", 'i dont know 5', "I'm not sure, 5", "I'm not sure but 5", 'I forgot the sign, negative 3',
  "i can't remember, 12?", "what's the answer, 5?", 'what, 5?', 'which one? the second one', 'how many? 4',
];
for (const a of LED_ANSWERS) {
  test(`"${a}" is an answer`, () => {
    assert.equal(isSelfReport(a), false);
    assert.equal(isStudentQuestion(a), false);
    assert.equal(studentTurnShape(a), 'answer_like');
  });
}
test('…and every one of them is an answer attempt', () => {
  // CHANGED (second review pass 2026-10-04): "I don't know, 5?" / "i dont
  // know 5" were left out here as ledger STUCK CUES — so the turn shape said
  // "answer" and nothing downstream treated it as one. See the F9 block below.
  for (const a of ["I don't know, 5?", 'i dont know 5', "I'm not sure, 5", "I'm not sure but 5", 'I forgot the sign, negative 3', "i can't remember, 12?", "what's the answer, 5?", 'what, 5?', 'which one? the second one', 'how many? 4']) {
    assert.equal(isAnswerAttempt(a), true, a);
  }
});
test('still answers, as before', () => {
  for (const a of ['is it 4?', "I think it's 7 but I'm not sure", 'what about 6', 'x equals 4?', 'does 6 work?', '4, right?']) {
    assert.equal(studentTurnShape(a), 'answer_like', a);
    assert.equal(isAnswerAttempt(a), true, a);
  }
});
test('still NOT answers, as before', () => {
  for (const q of ['how to solve: x>5 or x<3', 'how do you pronounce this problem… x greater than 3 or x less than 3', 'what does that mean?']) {
    assert.equal(studentTurnShape(q), 'question', q);
    assert.equal(isAnswerAttempt(q), false, q);
  }
  assert.equal(studentTurnShape('i do not know fractions operations well'), 'self_report');
  assert.equal(isAnswerAttempt('i do not know fractions operations well'), false);
});
test('a number that is not a PROPOSED value does not make a self-report or a question an answer', () => {
  for (const sr of [
    'I am not good at 2 digit multiplication', 'I do not understand the second step', "I don't understand step 2",
    "I don't know how to do number 5", "I don't get the first one", "I forgot how to do this, sorry", "I don't know, one sec",
    "I don't understand, why 5?",
  ]) assert.equal(studentTurnShape(sr), 'self_report', sr);
  for (const q of [
    'why is 5 not included?', 'where does 3 go', 'which one is the boundary', 'what do I do next, step 2?', 'which is bigger, 5 or 6?',
    'how to solve: 5', 'what is 3 times 4', 'how do I get from 3 to 5',
  ]) assert.equal(studentTurnShape(q), 'question', q);
});

console.log('\nbare short answers — interjections and non-answers (review, 2026-10-04)');

test('never a bare short answer', () => {
  // CHANGED (second review pass 2026-10-04): bare 'louder' and 'slower' were
  // listed here. They are real physics answers; only the PHRASES addressed to
  // the tutor are non-answers (next two tests).
  for (const f of ['oh', "can't hear", "because it's even", 'what', 'huh', 'wait', 'one sec', 'hold on', 'say again',
    'Oh.', 'ohh', 'ah', 'wow', 'oops', 'cant hear', 'too quiet', 'speak up', 'cause its odd', 'one sec please', 'two seconds', 'a minute', 'hang on', 'come again', 'lol']) {
    assert.equal(isBareShortAnswer(f), false, f);
  }
});
test('F12: comparative / state words are real answers ("What happens to the pitch?" → "louder")', () => {
  for (const a of ['faster', 'slower', 'quieter', 'louder', 'Louder.', 'volume', 'the volume', 'frozen', "it's frozen", 'it gets faster', 'hang', 'they hang', 'it froze']) {
    assert.equal(isBareShortAnswer(a), true, a);
  }
});
test('F12: talk about the audio / the pace is still never an answer', () => {
  for (const f of [
    "can't hear", 'cant hear you', 'I hear nothing', 'my mic', 'no audio', 'mute', "you're muted", 'lag', 'so laggy',
    'speak louder', 'speak up', 'louder please', 'a bit slower please', 'too fast', 'too slow', 'too quiet', 'too loud', 'slow down', 'slow down please',
    'go slower', 'talk louder', 'hang on', 'come again', 'you froze', "you're frozen", 'screen froze', 'turn it up',
  ]) assert.equal(isBareShortAnswer(f), false, f);
});
test('…and the real short answers still are', () => {
  for (const a of ['3.', '5', '2', 'solid.', 'below the line.', 'dashed', 'x > 5', 'three', '-2', '3/4', 'even', "it's even", 'the second one', 'one', 'two thirds', 'open circle']) {
    assert.equal(isBareShortAnswer(a), true, a);
  }
});

console.log('\nisAnswerAttempt — turn-shape gate');

test('questions and self-reports are not answer attempts', () => {
  assert.equal(isAnswerAttempt('how to solve: x>5 or x<3'), false);
  assert.equal(isAnswerAttempt('how do you pronounce this problem: x > 5 or x < 3'), false);
  assert.equal(isAnswerAttempt('i do not know fractions operations well'), false);
});
test('gate off: previous behaviour', () => {
  assert.equal(isAnswerAttempt('how to solve: x>5 or x<3', { turnShapeGate: false }), true);
});
test('answers still count', () => {
  for (const a of ['5', '3.', 'below the line.', 'is it 4?', 'x equals 2 and y equals 3', "I'm not sure but I think it's 7"]) {
    assert.equal(isAnswerAttempt(a), true, a);
  }
  // CHANGED (second review pass 2026-10-04): a hedged proposed value is an
  // answer attempt with the gate on; gate off it is the ledger stuck cue it
  // was before 2026-10-04.
  assert.equal(isAnswerAttempt("I don't know, maybe 5?"), true);
  assert.equal(isAnswerAttempt("I don't know, maybe 5?", { turnShapeGate: false }), false);
});
test('acks still never count', () => {
  for (const a of ['ok', 'yes', 'sure', 'hmm']) assert.equal(isAnswerAttempt(a), false, a);
});

console.log('\ninferWrongEvent — the missed production answers');

const wrong = (studentText: string, tutorText: string, extra?: Partial<Parameters<typeof inferWrongEvent>[0]>) =>
  inferWrongEvent({ studentText, tutorText, objectiveCorrect: false, ...extra });

test('LIVE: second "below the line." met by a bare contradiction', () => {
  assert.equal(wrong('below the line.', 'Above the line. Look at (0, 5) — it makes the inequality true, so that side is shaded.'), true);
});
test('LIVE: "3." met by "Let\'s try that again… doesn\'t satisfy…"', () => {
  assert.equal(wrong('3.', "Let's try that again. $3$ doesn't satisfy $x < 3$ — the inequality is strict."), true);
});
test('LIVE: "5" praised then excluded (case A) — NOT a ledger wrong event', () => {
  // CHANGED (review 2026-10-04): this pinned `true`. Praise followed by an
  // exclusion of the student's value is a self-contradicting TUTOR turn; the
  // read cannot tell whether the answer was wrong ("What is the boundary?" →
  // "5" → "Right. 5 isn't included…" is a correct answer). It is credited
  // neither way; the orchestrator plants a note asking the brain to decide.
  assert.equal(
    wrong('5', "Right. $5$ isn't included since the inequality is strict — but… anything just past it, like $6$, satisfies $x > 5$. Nice. Since 6 is past 5, it checks out…"),
    false,
  );
});
test('review 2026-10-04: correct answers the first cut sent to the ledger as wrong', () => {
  for (const [s, t] of [
    ['x = 4', "That works. Notice 3 doesn't work because of the strict sign."],
    ['x = 4', "So 4 is in. Notice 3 doesn't work because the sign is strict."],
    ['4 and 6', "Both work. 5 doesn't work, as you saw."],
    ['7', "7 is correct. It doesn't fit the first, but it fits the second."],
    ['7', "Seven. That doesn't satisfy x<3 but it satisfies x>5, so it's a solution!"],
    ['6', "Let's try this again with a new inequality — you nailed that one."],
    ['I think 7', "Hmm, 7 isn't right for the first, but it is right for the second."],
    ['minimum', "Let's find the maximum next."], ['min', 'Now for the max.'], ['positive', 'Now try a negative number.'],
    ['increasing', "Now let's look at where it's decreasing."], ['inside', "Let's test a point outside the circle next."],
    ['more', 'Fewer steps than I expected — nice!'], ['open', 'Case closed!'], ['open circle', 'Case closed! Open circle it is.'],
    ['6', "Yes! 6 isn't in the gap between 3 and 5, so it's a solution."], ['2', "Right. -2 doesn't work."],
  ] as const) assert.equal(wrong(s, t), false, `${s} → ${t}`);
});
test('review 2026-10-04: the genuine corrections still reach the ledger', () => {
  assert.equal(wrong('3.', "Let's try that again. 3 sits right on the boundary, so it doesn't satisfy the inequality."), true);
  assert.equal(wrong('below the line.', 'Above the line. Look at (0, 5) — does it make the inequality true?'), true);
  assert.equal(wrong('5', "That doesn't satisfy either inequality."), true);
});
test('widening off: none of the three', () => {
  assert.equal(wrong('below the line.', 'Above the line. Look at (0, 5).', { widenedCorrection: false }), false);
  assert.equal(wrong('3.', "Let's try that again. $3$ doesn't satisfy $x < 3$.", { widenedCorrection: false }), false);
});
test('the three that already reached the ledger still do', () => {
  assert.equal(wrong('below the line.', "Not quite. Close though. Let's test a point."), true);
  assert.equal(wrong('2', "Hmm, not quite. Let's look again."), true);
});
test('a correct answer followed by an exclusion of ANOTHER value is not wrong', () => {
  assert.equal(wrong('6', "Right. 6 works since it's past 5. And 5 itself isn't included."), false);
  assert.equal(wrong('6', "6 works. 5 doesn't work, though, since the inequality is strict."), false);
});
test('a question answered with a correction-shaped explanation is not a wrong answer', () => {
  assert.equal(wrong('how to solve: x>5 or x<3', "Good question. Let's check each part: x > 5 means…"), false);
  assert.equal(wrong('why is 5 not included?', "5 isn't included because the inequality is strict."), false);
});
test('a self-report is not a wrong answer', () => {
  assert.equal(wrong('i do not know fractions operations well', "That's not a problem. Let's try that again slowly."), false);
});
test('objective-correct still vetoes', () => {
  assert.equal(wrong('3.', "Let's try that again.", { objectiveCorrect: true }), false);
});

console.log('\nF9 — a hedged proposed value ("I don\'t know, 5?") is an answer end to end');

const HEDGED_VALUE_ANSWERS = ["I don't know, 5?", "I don't know 5", "I don't know. 7.", 'I dont know but 5', "I don't know, maybe five"];
const STILL_STUCK = ["I don't know", "I don't know how to do step 2", "I don't know what 5 means", "I don't know, can you repeat question 3"];
for (const a of HEDGED_VALUE_ANSWERS) {
  test(`"${a}" — hedged value: not a stuck cue, an answer attempt`, () => {
    assert.equal(isHedgedValueAnswer(a), true);
    assert.equal(studentTurnShape(a), 'answer_like');
    assert.equal(isLedgerStuckCue(a), false);
    assert.equal(isLedgerStuckCue(a.toLowerCase()), false);
    assert.equal(isAnswerAttempt(a), true);
    assert.equal(wrong(a, "Not quite. Let's look again."), true);
  });
}
for (const a of STILL_STUCK) {
  test(`"${a}" — still stuck / help, never an answer attempt`, () => {
    assert.equal(isHedgedValueAnswer(a), false);
    // The ledger's own cue test is untouched for these ("don't know what …"
    // was already a hedge to it, not a cue — the help-request classifier in
    // the orchestrator still owns that one).
    assert.equal(isLedgerStuckCue(a), isLedgerStuckCue(a, { hedgedValueIsAnswer: false }));
    assert.equal(isLedgerStuckCue(a), a !== "I don't know what 5 means");
    assert.equal(isAnswerAttempt(a), false);
    assert.equal(wrong(a, "Not quite. Let's look again."), false);
  });
}
test('the predicate is exactly the hedged-VALUE rule: other self-reports and plain answers are not it', () => {
  for (const a of ['5', 'is it 5?', "I think it's 7", "I don't know, maybe the commutative property", "I don't understand, why 5?", "I don't know, one sec",
    'I am not good at 2 digit multiplication', 'what, 5?', '']) assert.equal(isHedgedValueAnswer(a), false, a);
  for (const a of ["I'm not sure, 5", "I'm not sure but 5", 'I forgot the sign, negative 3', "i can't remember, 12?", "Um, I don't know, maybe 12?", 'I dont know, maybe x = 5?']) {
    assert.equal(isHedgedValueAnswer(a), true, a);
  }
});
test('an explicit help request stays a stuck cue even when it ends on a value', () => {
  assert.equal(isLedgerStuckCue("I'm stuck, 5?"), true);
  assert.equal(isLedgerStuckCue("I don't know, can you walk me through 5"), true);
  assert.equal(isAnswerAttempt("I'm stuck, 5?"), false);
});
test('gate off: exactly as before (a short "I don\'t know, 5?" is a stuck cue, not an attempt)', () => {
  for (const a of HEDGED_VALUE_ANSWERS) {
    assert.equal(isLedgerStuckCue(a, { hedgedValueIsAnswer: false }), true, a);
    assert.equal(isAnswerAttempt(a, { turnShapeGate: false }), false, a);
    assert.equal(wrong(a, "Not quite. Let's look again.", { turnShapeGate: false }), false, a);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
