/**
 * R53 — how pacing reads the tutor's words to credit an answer.
 *
 * Live failure, portal-8d15f85c: the student answered "Quito" correctly and
 * was affirmed — twice — and pacing recorded `incorrect=2`. The tutor then
 * said "that Quito question is still hanging out there waiting for your
 * answer" and made them answer a third time, then remarked "Nice work
 * catching that one twice now" without recognising its own error.
 *
 * Measured over 591 real claude-brain tutor turns, old patterns vs new:
 * 35 turns change classification — 27 none→correct, 7 incorrect→none,
 * 1 incorrect→correct, and ZERO that previously had credit lose it. That
 * asymmetry is the safety property; if a future change makes any turn go
 * correct→(none|incorrect), re-measure before shipping it.
 *
 * Run: npx tsx scripts/test-pacing-verdict.ts
 */
import { strict as assert } from 'node:assert';
import { readPacingVerdict, isDenialClaim, studentValues } from '../src/lib/tutor/voice/pacing-verdict';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}`); console.log(`      ${(e as Error).message}`); }
}
/** The same decision decidePacingCredit makes from these two booleans. */
const credit = (t: string) => {
  const r = readPacingVerdict(t);
  return r.isAffirm && !r.isCorrection ? 'correct' : r.isCorrection ? 'incorrect' : 'none';
};

console.log('\nR53 — pacing verdict reading');

// --- The two live turns, verbatim.
const LIVE_1 = "Ah, Quito — got it. Right, Quito stays cooler! Same latitude as Guayaquil, but way up in those thin Andes mountains, so the heat just doesn't stick around.";
const LIVE_2 = "Right — Quito stays cooler because of the elevation! That's exactly the trick — climbing up mountains does the same job as traveling toward the pole. Now let's chase down that dry desert on our map — the one where rain almost never falls.";

test('LIVE 1: an affirmation after a lead-in sentence is credited', () => {
  // Was 'none': the pattern was ^-anchored and the head began "Ah,".
  assert.equal(credit(LIVE_1), 'correct');
  assert.equal(readPacingVerdict(LIVE_1).affirmSentence, 1, 'affirmation is in the SECOND sentence');
});

test('LIVE 2: prose "almost" no longer marks a correct answer wrong', () => {
  // Was 'incorrect': "rain almost never falls" matched the correction list.
  assert.equal(credit(LIVE_2), 'correct');
});

test('a subordinate "but" AFTER the affirmation does not cancel it', () => {
  // LIVE_1's "but way up in those thin Andes mountains" is ordinary prose.
  assert.equal(readPacingVerdict(LIVE_1).isAffirm, true);
});

// --- Reversals must still be refused. These are the expensive direction:
// crediting a hedge marks a wrong answer as mastered.
test('"Right, but you missed a step" is NOT credited', () => {
  assert.notEqual(credit('Right, but you missed a step on the way there.'), 'correct');
});
test('"Right. But actually, hold on — that isn\'t it." is NOT credited', () => {
  assert.notEqual(credit("Right. But actually, hold on — that isn't it."), 'correct');
});
test('"Exactly — well, not quite." is NOT credited', () => {
  assert.notEqual(credit('Exactly — well, not quite. Look at the sign again.'), 'correct');
});

// --- Genuine corrections must still read as corrections.
test('"Not quite." is a correction', () => {
  assert.equal(credit("Not quite. One would be a floor number, not the distance."), 'incorrect');
});
test('evaluative "Almost —" is a correction', () => {
  assert.equal(credit('Almost — you have the right idea, check the sign.'), 'incorrect');
});
test('"you\'re almost right" is a correction', () => {
  assert.equal(credit("You're almost right, but the denominator needs another look."), 'incorrect');
});
test('"almost there" is a correction', () => {
  assert.equal(credit('Almost there! Try the last step once more.'), 'incorrect');
});

// --- Adverbial "almost" is not a verdict about the student.
test('adverbial "almost" in prose is not a correction', () => {
  assert.equal(readPacingVerdict('That desert gets almost no rain at all.').isCorrection, false);
  assert.equal(readPacingVerdict('Almost every JEE coordinate question hides a circle.').isCorrection, false);
});

test('an OPENING turn is never scored as a correction', () => {
  // Live: opener turns containing adverbial "almost" were scoring the
  // student incorrect before they had said anything at all.
  const opener = "Hi — I'm Elena! Circles and lines look totally different written out, but almost every JEE coordinate question mixes them.";
  assert.equal(readPacingVerdict(opener).isCorrection, false);
});

// --- Plain affirmations unchanged.
test('a clean affirmation is credited', () => {
  assert.equal(credit('Exactly. Sixty-two point five percent.'), 'correct');
  assert.equal(credit('Perfect — that is the one.'), 'correct');
});

test('a third-sentence affirmation is OUTSIDE the window', () => {
  // The window is deliberately two sentences; a "right" deep in prose must
  // not qualify, or ordinary explanation starts crediting answers.
  assert.equal(readPacingVerdict('One. Two. Right, that is it.').affirmSentence, -1);
});

test('empty and junk inputs are total, never throw', () => {
  assert.equal(credit(''), 'none');
  assert.equal(credit('...'), 'none');
  assert.equal(readPacingVerdict('').affirmSentence, -1);
});

// ---------------------------------------------------------------------------
// 2026-10-04 (live, student gac-test-001, "x > 5 or x < 3").
// ---------------------------------------------------------------------------
const creditFor = (student: string, tutor: string, opts?: Parameters<typeof readPacingVerdict>[1]) => {
  const r = readPacingVerdict(tutor, { studentText: student, ...opts });
  return r.isAffirm && !r.isCorrection ? 'correct' : r.isCorrection ? 'incorrect' : 'none';
};

console.log('\nacknowledgement phrases are not affirmations of an answer');

test('LIVE: "Good question" / "Good to know" credit nothing', () => {
  assert.equal(credit("Good question. You read it as 'x is greater than five, or x is less than three'."), 'none');
  assert.equal(credit('Good to know, thank you for telling me. We will go slowly.'), 'none');
  assert.equal(readPacingVerdict('Good question. Here is how.').ackOpener, true);
});
test('the acknowledgement family', () => {
  for (const t of [
    'Great question! Start with the first part.', 'Good point. The sign matters.', 'Good thinking. Keep going.',
    'Good idea. Try it.', 'Nice catch. I wrote that label wrong.', 'Good call. We can do that.',
    'Good instinct. Check it with a point.', 'Great to know. Thanks.', 'Good try. Look at the sign.',
    'Nice attempt. One more look.', 'Good guess. Test it.', 'Good effort. Almost every step is there.',
  ]) assert.equal(readPacingVerdict(t).isAffirm, false, t);
});
test('real affirmations that share the word are still credited', () => {
  for (const t of ['Good. That is the one.', 'Good job. Six works.', 'Great! Six it is.', 'Nice work. Six.', 'Nice. Six works.', 'Good, six works.', 'Right. Six.']) {
    assert.equal(credit(t), 'correct', t);
  }
});
test('an acknowledgement followed by a real affirmation in the next sentence still reads as an affirmation', () => {
  assert.equal(readPacingVerdict('Good thinking. Yes, six works.').affirmSentence, 1);
});
test('acknowledgement exclusion off: previous behaviour', () => {
  assert.equal(readPacingVerdict('Good question. Here is how.', { ackExclusion: false }).isAffirm, true);
});


console.log('\nan acknowledgement that goes on to AFFIRM is an affirmation (review, 2026-10-04)');

for (const [student, tutor] of [
  ['5', 'Good catch, that IS the answer.'],
  ['5', 'Good question — yes, exactly.'],
  ['5', 'Good eye! 5 is right.'],
  ['5', 'Great call. 5.'],
  ['5', "Good guess — and it's correct!"],
  ['5', "Nice thinking, that's exactly right."],
  ['5', "That's a good point, and yes, 5 is right."],
  ['five', 'Good eye! Five is right.'],
] as const) {
  test(`"${tutor}" affirms`, () => {
    const r = readPacingVerdict(tutor, { studentText: student });
    assert.equal(r.isAffirm, true);
    assert.equal(creditFor(student, tutor), 'correct');
  });
}
for (const tutor of [
  'Good question.', "Good question — let's look at that.", 'Good to know, thank you for telling me.',
  'Great question! What do you think happens at 5?', "Good guess, but that's not right.", "Good try — it isn't correct yet.",
  'Good question. The answer is right there on the board.', 'Great call. 6.', 'Good thinking. Is that right?',
]) {
  test(`"${tutor}" is an acknowledgement only`, () => {
    const r = readPacingVerdict(tutor, { studentText: '5' });
    assert.equal(r.isAffirm, false);
    assert.equal(r.ackOpener, true);
  });
}
console.log('\nwidened correction detection (head of the turn only)');

test('LIVE: "Let\'s try that again… doesn\'t satisfy…"', () => {
  assert.equal(creditFor('3.', "Let's try that again. $3$ doesn't satisfy $x < 3$ — the inequality is strict."), 'incorrect');
});
test('LIVE: a bare contradicting restatement', () => {
  const r = readPacingVerdict('Above the line. Look at (0, 5) — it makes the inequality true.', { studentText: 'below the line.' });
  assert.equal(r.isCorrection, true);
  assert.equal(r.correctionSource, 'restatement');
});
test('LIVE (case A): praise, then the student\'s own value excluded — credited NEITHER way', () => {
  // CHANGED (review 2026-10-04): this pinned 'incorrect'. The read cannot
  // know what was asked — "What is the boundary?" → "5" → "Right. 5 isn't
  // included…" is a correct answer — so it withholds 'correct' and does not
  // count 'incorrect'. The orchestrator's note asks the brain to decide.
  const live = "Right. $5$ isn't included since the inequality is strict — but… anything just past it, like $6$, satisfies $x > 5$. Nice. Since 6 is past 5, it checks out…";
  const r = readPacingVerdict(live, { studentText: '5' });
  assert.equal(r.ownValueExcluded, true);
  assert.equal(creditFor('5', live), 'none');
  assert.equal(creditFor('5', "Right. Five isn't included since the inequality is strict."), 'none');
});
test('the head phrases', () => {
  for (const t of [
    'Try again. Which side is shaded?', "That doesn't work here. Plug it in.",
    "That isn't a solution.", "That's not it. Look at the sign.", 'That is not correct. Check the sign.',
    "Hmm. That isn't right.", "Let's try this one again.", 'Give it another try.',
  ]) assert.equal(readPacingVerdict(t).isCorrection, true, t);
  // CHANGED (review 2026-10-04): a predicate whose subject is a NUMBER counts
  // only when that number is the student's — these two were asserted with no
  // student text at all.
  assert.equal(creditFor('4', '4 does not fit the pattern.'), 'incorrect');
  assert.equal(creditFor('7', '7 is not included.'), 'incorrect');
  assert.equal(readPacingVerdict('4 does not fit the pattern.').isCorrection, false);
  assert.equal(creditFor('6', '7 is not included.'), 'none');
});
test('GENUINE corrections still count (review 2026-10-04)', () => {
  const a = readPacingVerdict("Let's try that again. 3 sits right on the boundary, so it doesn't satisfy the inequality.", { studentText: '3.' });
  assert.deepEqual([a.isCorrection, a.correctionSource], [true, 'head']);
  const b = readPacingVerdict('Above the line. Look at (0, 5) — it makes the inequality true.', { studentText: 'below the line.' });
  assert.deepEqual([b.isCorrection, b.correctionSource], [true, 'restatement']);
  const c = readPacingVerdict("That doesn't satisfy either inequality.", { studentText: '5' });
  assert.deepEqual([c.isCorrection, c.correctionSource], [true, 'head']);
  assert.equal(creditFor('I think 7', "Hmm, 7 doesn't work here."), 'incorrect');
  assert.equal(creditFor('x = 4', "4 isn't a solution — plug it in."), 'incorrect');
  assert.equal(creditFor('seven', "7 doesn't satisfy the inequality."), 'incorrect');
});

console.log('\nCORRECT answers the first cut counted wrong (review, 2026-10-04)');

const NOT_CORRECTIONS: Array<[string, string, 'correct' | 'none']> = [
  ['x = 4', "That works. Notice 3 doesn't work because of the strict sign.", 'correct'],
  ['x = 4', "So 4 is in. Notice 3 doesn't work because the sign is strict.", 'correct'],
  ['4 and 6', "Both work. 5 doesn't work, as you saw.", 'correct'],
  ['7', "7 is correct. It doesn't fit the first, but it fits the second.", 'correct'],
  ['7', "Seven. That doesn't satisfy x<3 but it satisfies x>5, so it's a solution!", 'none'],
  ['6', "Let's try this again with a new inequality — you nailed that one.", 'none'],
  ['I think 7', "Hmm, 7 isn't right for the first, but it is right for the second.", 'none'],
];
for (const [student, tutor, expected] of NOT_CORRECTIONS) {
  test(`"${student}" → "${tutor}" — not a correction`, () => {
    const r = readPacingVerdict(tutor, { studentText: student });
    assert.equal(r.isCorrection, false);
    assert.equal(r.correctionSource, null);
    assert.equal(creditFor(student, tutor), expected);
  });
}
test('the student\'s values are read out of any phrasing', () => {
  assert.deepEqual(studentValues('x = 4'), ['4']);
  assert.deepEqual(studentValues('I think 7'), ['7']);
  assert.deepEqual(studentValues('4 and 6'), ['4', '6']);
  assert.deepEqual(studentValues('seven.'), ['7']);
  assert.deepEqual(studentValues('3.'), ['3']);
  assert.deepEqual(studentValues('-2'), ['-2']);
  assert.deepEqual(studentValues('below the line.'), []);
});
test('a predicate about a DIFFERENT value, or with no readable subject, is skipped', () => {
  assert.equal(creditFor('x = 4', "Notice 3 doesn't work because of the strict sign."), 'none');
  assert.equal(creditFor('4 and 6', "5 doesn't work, as you saw."), 'none');
  assert.equal(creditFor('below the line.', "5 doesn't satisfy it."), 'none');
  assert.equal(creditFor('4', "The boundary point doesn't satisfy the inequality."), 'none');
  assert.equal(creditFor('4', "It doesn't work that way."), 'none');
  assert.equal(creditFor('4', "This doesn't work because the sign flips."), 'none');
});
test('part-scoped and re-admitted predicates are not corrections', () => {
  assert.equal(readPacingVerdict("It doesn't fit the first, but it fits the second.", { studentText: '7' }).isCorrection, false);
  assert.equal(readPacingVerdict("7 doesn't satisfy the first one.", { studentText: '7' }).isCorrection, false);
  assert.equal(readPacingVerdict("7 doesn't satisfy x < 3. But it satisfies x > 5.", { studentText: '7' }).isCorrection, false);
  assert.equal(readPacingVerdict("That doesn't work on the left, so it's fine to drop that part.", { studentText: '7' }).isCorrection, false);
});
test('"try again with a new / another / different / harder …" is a new problem, not a retry', () => {
  for (const t of [
    "Let's try this again with a new inequality.", "Let's try that again with another example.", 'Try it again with a different number.',
    "Let's do this one again with a harder problem.", "Let's try that again, with a new one.",
  ]) assert.equal(readPacingVerdict(t, { studentText: '6' }).isCorrection, false, t);
  // CHANGED (second review pass 2026-10-04): this pinned `true`. A retry
  // phrase that CONTINUES ("…again with / on / so / using …") is not read as
  // a denial at all — only one that ends its clause is.
  assert.equal(readPacingVerdict("Let's try that again with the same inequality.", { studentText: '6' }).isCorrection, false);
});
test('value affirmations at the start: "<their value> is correct / right / works / is in", "That works", "Both work"', () => {
  for (const [s, t] of [
    ['7', '7 is correct.'], ['7', '7 is right, nice.'], ['7', '7 works.'], ['4', 'So 4 is in.'], ['x = 4', 'That works.'],
    ['4 and 6', 'Both work.'], ['seven', 'Seven works since it is past 5.'],
  ] as const) assert.equal(creditFor(s, t), 'correct', t);
  // Another value, or prose that only looks like it.
  assert.equal(creditFor('6', '7 is correct.'), 'none');
  assert.equal(creditFor('7', 'That works like a see-saw.'), 'none');
  assert.equal(creditFor('7', '7 is in the gap.'), 'none');
  assert.equal(creditFor('7', "7 is right on the boundary."), 'none');
  assert.equal(readPacingVerdict('That works.', { studentText: '7', widenedCorrection: false }).isAffirm, false);
});
test('the denial predicate shared with the judge decision', () => {
  for (const c of ['Not quite. Close though.', "That doesn't work here.", "Hmm. That isn't right.", "Let's try that again.", 'Nope.', "It isn't a solution."]) {
    assert.equal(isDenialClaim(c), true, c);
  }
  for (const c of [
    'So $x = 11$ after dividing by 3.', 'The line bows outward here.', "That works. Notice 3 doesn't work.", "Let's try this again with a new inequality.",
    "5 doesn't work.", "It doesn't fit the first, but it fits the second.", 'Right. Nice work.', '',
  ]) assert.equal(isDenialClaim(c), false, c);
});
test('the same phrases deep in the turn are prose, not a verdict', () => {
  const t = "Right. Six works since it is past five. Now here is the interesting part of this problem. Notice that five itself doesn't work, and three isn't included either.";
  assert.equal(credit(t), 'correct');
});
test('a clean affirmation is not reversed by a head phrase about ANOTHER value', () => {
  assert.equal(creditFor('6', "Right. 6 works since it's past 5. And 5 itself isn't included."), 'correct');
  // "but" inside the affirming sentence already withheld credit here (R53);
  // the point is that the exclusion of 5 does not turn it into 'incorrect'.
  assert.equal(creditFor('6', "Yes. 5 doesn't work, but 6 does."), 'none');
});
test('no affirmation, exclusion names a DIFFERENT value than the student\'s: not a correction', () => {
  // CHANGED (review 2026-10-04): was 'none'. "<their value> works" at the
  // start is an affirmation; the point of this case stands — never 'incorrect'.
  assert.equal(creditFor('6', "6 works. 5 doesn't work, though, since the inequality is strict."), 'correct');
  assert.equal(creditFor('6', "Hmm. 5 doesn't work, though, since the inequality is strict."), 'none');
});
test('a clean affirmation whose next sentence excludes the student\'s OWN value is never credited correct', () => {
  const r = readPacingVerdict("Right. Five isn't included since the inequality is strict.", { studentText: '5' });
  assert.equal(r.isAffirm, false);
});
test('an affirmation is never read as a restatement ("left" → "Right.")', () => {
  assert.equal(creditFor('left', 'Right. It moves three units left.'), 'correct');
});
test('widening off: previous behaviour', () => {
  assert.equal(creditFor('3.', "Let's try that again. $3$ doesn't satisfy $x < 3$.", { widenedCorrection: false }), 'none');
  assert.equal(creditFor('below the line.', 'Above the line. Look at (0, 5).', { widenedCorrection: false }), 'none');
});
test('no options: byte-compatible call shape still works', () => {
  assert.equal(readPacingVerdict('Exactly. Six.').isAffirm, true);
  assert.equal(readPacingVerdict('Exactly. Six.').correctionSource, null);
});

console.log('\nverification review (2026-10-04, second pass) — correct answers still scored incorrect');

// F1: the tutor ECHOES the student's own negative conclusion, or praises
// AFTER the predicate.
const ECHO_NOT_CORRECTIONS: Array<[string, string]> = [
  ['3', "3 doesn't work, good — that's the one we exclude."],
  ['x > 3', "So 3 isn't included, and everything above it is."],
  ['x is greater than 3', "3 isn't included, that's right."],
  ['no, 3 is not a solution', "It isn't a solution, well done."],
  ['3 is not included', "It isn't included, well spotted."],
  ['between 3 and 5', "3 isn't included, and neither is 5 — good, the open interval."],
  ['3 fails', "That doesn't work — you found the extraneous one!"],
  ['3', "3. That doesn't satisfy x < 3 — exactly the boundary we wanted."],
];
// F2: a part-by-part explanation with no "but".
const PART_NOT_CORRECTIONS: Array<[string, string]> = [
  ['7', "7 doesn't satisfy x < 3. It does satisfy x > 5, which is all we need."],
  ['2', "2 doesn't satisfy x > 5 — it satisfies x < 3, and with or that's enough."],
  ['2', "2 doesn't work for the left one. It works for the right one!"],
  ['6', "6 isn't a solution of x < 3; it is one of x > 5."],
];
// F5: a retry phrase that does not end its clause.
const RETRY_NOT_CORRECTIONS: Array<[string, string]> = [
  ['5', "5. Let's try that again with a bigger number."],
  ['5', "Let's try that again, but with 7 this time, since you nailed it."],
  ['5', "Let's do that one again on the board so you can see why 5 is right."],
];
for (const [label, list] of [['F1 echo / praise after', ECHO_NOT_CORRECTIONS], ['F2 part-by-part', PART_NOT_CORRECTIONS], ['F5 retry continues', RETRY_NOT_CORRECTIONS]] as const) {
  for (const [student, tutor] of list) {
    test(`${label}: "${student}" → "${tutor}" — not a correction`, () => {
      const r = readPacingVerdict(tutor, { studentText: student });
      assert.equal(r.isCorrection, false);
      assert.equal(r.correctionSource, null);
      assert.notEqual(creditFor(student, tutor), 'incorrect');
    });
  }
}
test('the genuine corrections STILL count after the second pass', () => {
  const a = readPacingVerdict("Let's try that again. 3 sits right on the boundary, so it doesn't satisfy the inequality.", { studentText: '3.' });
  assert.deepEqual([a.isCorrection, a.correctionSource], [true, 'head']);
  const lone = readPacingVerdict("3 doesn't satisfy x < 3.", { studentText: '3' });
  assert.deepEqual([lone.isCorrection, lone.correctionSource], [true, 'head']);
  const b = readPacingVerdict('Above the line. Look at (0, 5) — it makes the inequality true.', { studentText: 'below the line.' });
  assert.deepEqual([b.isCorrection, b.correctionSource], [true, 'restatement']);
  const c = readPacingVerdict("That doesn't satisfy either inequality.", { studentText: '5' });
  assert.deepEqual([c.isCorrection, c.correctionSource], [true, 'head']);
});
test('a retry phrase counts only when it ENDS its clause', () => {
  for (const t of ["Let's try that again.", "Let's try that again!", 'Try again?', "Let's try that again — look at the sign.", "Let's try this one again", 'Give it another try. Which side?', "Let's try that again… slowly."]) {
    assert.equal(readPacingVerdict(t, { studentText: '5' }).isCorrection, true, t);
  }
  for (const t of ["Let's try that again with 7.", "Let's try that again, but with 7.", "Let's do that again on the board.", "Let's try it again so you can see it.", "Let's try that again using the number line."]) {
    assert.equal(readPacingVerdict(t, { studentText: '5' }).isCorrection, false, t);
  }
});
test('acknowledgement or a question after the predicate is not an affirmation of it', () => {
  assert.equal(creditFor('3', "3 doesn't work. Good try, though."), 'incorrect');
  assert.equal(creditFor('3', "3 doesn't work. Does that seem right?"), 'incorrect');
  assert.equal(creditFor('3', "3 isn't included. Look at the right side."), 'incorrect');
  // A word that merely ends in "nt" is not a negation in the student's text.
  assert.equal(creditFor('the point 3', "3 doesn't satisfy the inequality."), 'incorrect');
  assert.equal(creditFor('I want 3', "3 isn't a solution."), 'incorrect');
  // A negated re-admission is not a re-admission.
  assert.equal(creditFor('3', "3 doesn't satisfy x < 3. It does not satisfy x > 5 either."), 'incorrect');
});


console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
