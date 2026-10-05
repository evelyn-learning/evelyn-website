/**
 * Praise-then-exclusion: the opener affirms, and the same or the next
 * sentence says the STUDENT'S OWN bare value is excluded / does not satisfy.
 *
 * Live (student gac-test-001, own problem "x > 5 or x < 3", no stored key):
 * asked for a number that satisfies it, the student said "5" and heard
 * "Right. $5$ isn't included since the inequality is strict — but… anything
 * just past it, like $6$, satisfies $x > 5$. Nice. Since 6 is past 5, it
 * checks out…".
 *
 * Run: npx tsx scripts/test-praise-exclusion.ts
 */
import { strict as assert } from 'node:assert';
import { readPacingVerdict } from '../src/lib/tutor/voice/pacing-verdict';
import { decideJudgeNotePlant } from '../src/lib/tutor/voice/judge-correction-note';
import {
  detectPraiseThenExclusion,
  asksForSatisfyingValue,
  decidePraiseExclusion,
  bareStudentValue,
  buildPraiseExclusionNote,
  isPraiseExclusionNote,
  shouldPlantPraiseExclusionNote,
  praiseExclusionNoteExpired,
  isReadmittedPlainly,
  type PraiseExclusionNoteRecord,
} from '../src/lib/tutor/voice/praise-exclusion';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}`); console.log(`      ${(e as Error).message}`); }
}

const LIVE_TUTOR = "Right. $5$ isn't included since the inequality is strict — but… anything just past it, like $6$, satisfies $x > 5$. Nice. Since 6 is past 5, it checks out…";
const LIVE_QUESTION = 'So the solution is everything past 5 or below 3. Can you give me one number that satisfies $x > 5$ or $x < 3$?';

console.log('\npraise-then-exclusion — detector');

test('LIVE: "5" praised, then 5 excluded', () => {
  const r = detectPraiseThenExclusion(LIVE_TUTOR, '5');
  assert.ok(r, 'must detect');
  assert.equal(r!.value, '5');
});
test('spoken-number utterance ("five.") is the same bare value', () => {
  assert.ok(detectPraiseThenExclusion(LIVE_TUTOR, 'five.'));
  assert.equal(bareStudentValue('Five.'), '5');
});
test('exclusion in the NEXT sentence after a bare opener', () => {
  assert.ok(detectPraiseThenExclusion("Yes. 5 doesn't satisfy the inequality, though.", '5'));
  assert.ok(detectPraiseThenExclusion('Exactly! 5 is not a solution here.', '5'));
  assert.ok(detectPraiseThenExclusion("Correct — 5 doesn't work.", '5'));
  assert.ok(detectPraiseThenExclusion("Nice. 5 doesn't count.", '5'));
  assert.ok(detectPraiseThenExclusion("Right. 5 is not included.", '5'));
  assert.ok(detectPraiseThenExclusion("Right. 5 does not satisfy it.", '5'));
  assert.ok(detectPraiseThenExclusion("Right. 5 isn't a solution.", '5'));
  assert.ok(detectPraiseThenExclusion('Right. 3/4 is excluded.', '3/4'));
});

console.log('\npraise-then-exclusion — negatives');

test('student "6", tutor affirms 6 works', () => {
  assert.equal(detectPraiseThenExclusion("Right. 6 works since it's past 5.", '6'), null);
});
test('student utterance is a RELATION, not a bare value', () => {
  assert.equal(detectPraiseThenExclusion("Right — and 3 itself isn't included.", 'x < 3'), null);
  assert.equal(detectPraiseThenExclusion("Right — and 3 itself isn't included.", 'x is less than 3'), null);
  assert.equal(bareStudentValue('x < 3'), null);
});
test('a denial opener is a consistent verdict', () => {
  assert.equal(detectPraiseThenExclusion("Not quite — 5 isn't included.", '5'), null);
});
test('value affirmed as INCLUDED', () => {
  assert.equal(detectPraiseThenExclusion('Right. 5 is included because the sign is ≥.', '5'), null);
});
test('the excluded value is a DIFFERENT value', () => {
  assert.equal(detectPraiseThenExclusion("Right. 6 works, and 5 isn't included.", '6'), null);
  assert.equal(detectPraiseThenExclusion("Right. 15 isn't included.", '5'), null);
  assert.equal(detectPraiseThenExclusion("Right. 5.5 isn't included.", '5'), null);
  assert.equal(detectPraiseThenExclusion("Right. 0.5 isn't included.", '5'), null);
});
test('exclusion from ONE part, then re-admitted', () => {
  assert.equal(
    detectPraiseThenExclusion("Right. 5 doesn't satisfy $x < 3$, but it satisfies $x \\ge 5$, so it works.", '5'),
    null,
  );
});
test('hypothetical exclusion', () => {
  assert.equal(detectPraiseThenExclusion("Right. If the sign were strict, 5 wouldn't be included.", '5'), null);
});
test('exclusion beyond the next sentence is out of the window', () => {
  assert.equal(
    detectPraiseThenExclusion("Right. Let's look at the number line. The shaded part starts here. 5 isn't included.", '5'),
    null,
  );
});
test('acknowledgement openers are not affirmations', () => {
  assert.equal(detectPraiseThenExclusion("Good try. 5 isn't included.", '5'), null);
  assert.equal(detectPraiseThenExclusion("Good thinking. 5 isn't included, though.", '5'), null);
});
test('words / filler are not bare values', () => {
  assert.equal(bareStudentValue('ok'), null);
  assert.equal(bareStudentValue('solid'), null);
  assert.equal(bareStudentValue('is it 5 or 6'), null);
  assert.equal(bareStudentValue('-2'), '-2');
  assert.equal(bareStudentValue('2x'), '2x');
});
test('total on empty input', () => {
  assert.equal(detectPraiseThenExclusion('', ''), null);
  assert.equal(detectPraiseThenExclusion(LIVE_TUTOR, ''), null);
});

console.log('\npraise-then-exclusion — question polarity');

test('a request for a value that satisfies', () => {
  assert.equal(asksForSatisfyingValue(LIVE_QUESTION), true);
  assert.equal(asksForSatisfyingValue('Pick a value of x that works in this inequality.'), true);
  assert.equal(asksForSatisfyingValue('Name one number in the solution set.'), true);
  assert.equal(asksForSatisfyingValue('What number makes this statement true?'), true);
});
test('a request for the boundary / an excluded value is NOT', () => {
  assert.equal(asksForSatisfyingValue('Which number is the boundary here?'), false);
  assert.equal(asksForSatisfyingValue("Which value does NOT satisfy the inequality?"), false);
  assert.equal(asksForSatisfyingValue("Give me a number that doesn't work."), false);
  assert.equal(asksForSatisfyingValue('What is x?'), false);
  assert.equal(asksForSatisfyingValue(''), false);
});
test('only the LAST question of the prior turn is read', () => {
  assert.equal(
    asksForSatisfyingValue('Earlier you found a number that satisfies it. Now, where does the shading stop?'),
    false,
  );
});

console.log('\npraise-then-exclusion — decision (note vs advisory; NEVER a kill)');

const decide = (tutorText: string, studentUtterance: string, tutorQuestion?: string) =>
  decidePraiseExclusion({ enabled: true, tutorText, studentUtterance, tutorQuestion });

test('LIVE turn: detected → advisory event + note, no kill', () => {
  const d = decide(LIVE_TUTOR, '5', LIVE_QUESTION);
  assert.equal(d.action, 'note');
  assert.equal(d.value, '5');
  assert.equal(d.reason, 'satisfying-value-asked');
});
test('there is no kill action for any input', () => {
  for (const [t, s, q] of [
    [LIVE_TUTOR, '5', LIVE_QUESTION], [LIVE_TUTOR, '5', ''], ["Yes. 5 doesn't satisfy the inequality, though.", '5', LIVE_QUESTION],
    ['Right. 3/4 is excluded.', '3/4', LIVE_QUESTION], ["Right. 6 works.", '6', LIVE_QUESTION],
  ] as const) {
    assert.notEqual(decide(t, s, q).action as string, 'kill', t);
  }
});
test('the question asked for the boundary: confirming it and adding that it is excluded is CORRECT tutoring — advisory only, no note', () => {
  const d = decide("Right. 5 isn't included, since the inequality is strict.", '5', 'Where does the first ray start — what is the boundary number?');
  assert.equal(d.action, 'advisory');
});
test('exclusion from ONE relation of a compound problem: advisory, even before the re-admitting sentence has streamed', () => {
  const partial = "Right. 5 doesn't satisfy $x < 3$.";
  const hit = detectPraiseThenExclusion(partial, '5');
  assert.ok(hit);
  assert.equal(hit!.partScoped, true);
  const d = decide(partial, '5', 'Give me one number that satisfies $x \\ge 5$ or $x < 3$?');
  assert.equal(d.action, 'advisory');
  assert.equal(d.reason, 'part-scoped');
  // …and once the next sentence is there, it is not even a detection.
  assert.equal(detectPraiseThenExclusion("Right. 5 doesn't satisfy $x < 3$. But it satisfies $x \\ge 5$, so it works.", '5'), null);
});
test('the LIVE exclusion is not part-scoped', () => {
  assert.equal(detectPraiseThenExclusion(LIVE_TUTOR, '5')!.partScoped, false);
});
test('the decision is stable as the LIVE turn streams sentence by sentence', () => {
  const s1 = 'Right.';
  const s2 = "Right. $5$ isn't included since the inequality is strict — but… anything just past it, like $6$, satisfies $x > 5$.";
  assert.equal(decide(s1, '5', LIVE_QUESTION).action, 'none');
  assert.equal(decide(s2, '5', LIVE_QUESTION).action, 'note');
  assert.equal(decide(LIVE_TUTOR, '5', LIVE_QUESTION).action, 'note');
});
test('unknown question: advisory only', () => {
  assert.equal(decide(LIVE_TUTOR, '5').action, 'advisory');
});
test('flag off: nothing', () => {
  const d = decidePraiseExclusion({ enabled: false, tutorText: LIVE_TUTOR, studentUtterance: '5', tutorQuestion: LIVE_QUESTION });
  assert.equal(d.action, 'none');
});
test('no detection: nothing', () => {
  assert.equal(decide("Right. 6 works since it's past 5.", '6', LIVE_QUESTION).action, 'none');
});

console.log('\npraise-then-exclusion — correct tutoring the first cut KILLED (review, 2026-10-04)');

const REVIEW_QUESTION = 'Can you give me a number that satisfies x > 5 or x < 3?';
const FALSE_KILLS: Array<[string, string]> = [
  ['6', "Yes! 6 isn't in the gap between 3 and 5, so it's a solution."],
  ['6', 'Right! 6 is outside the gap from 3 to 5.'],
  ['2', 'Yes, 2 is outside the interval from 3 to 5, nice.'],
  ['2', 'Correct. 2 is not in the gap.'],
  ['2', "Correct. 2 isn't in the excluded zone."],
  ['7', 'Great — 7 is not one of the excluded values.'],
  ['6', "Right. 6 doesn't make it false."],
  ['6', "Right — and notice 6 doesn't count as a boundary point."],
  ['2', "Right. 2 doesn't make the denominator zero, so it's fine."],
  ['2', "Right. -2 doesn't work."],
];
for (const [student, tutor] of FALSE_KILLS) {
  test(`"${student}" → "${tutor}" — no detection, no note, credited correct`, () => {
    assert.equal(detectPraiseThenExclusion(tutor, student), null);
    assert.equal(decide(tutor, student, REVIEW_QUESTION).action, 'none');
    const r = readPacingVerdict(tutor, { studentText: student });
    assert.equal(r.ownValueExcluded, false);
    assert.equal(r.isAffirm, true);
    assert.equal(r.isCorrection, false);
  });
}
test('a negated NEGATIVE object is agreement even with a kept predicate', () => {
  assert.equal(detectPraiseThenExclusion("Right. 6 isn't included in the gap.", '6'), null);
  assert.equal(detectPraiseThenExclusion('Right. 6 is excluded from the forbidden zone only on paper.', '6'), null);
  assert.equal(detectPraiseThenExclusion("Yes. 2 doesn't satisfy the excluded case.", '2'), null);
  assert.equal(detectPraiseThenExclusion("Right. 2 doesn't count as a hole.", '2'), null);
});
test('the dropped predicates no longer detect', () => {
  for (const t of [
    "Right. 5 isn't in the solution set.", "Right. 5 isn't part of it.", "Right. 5 isn't one of them.",
    "Right. 5 doesn't make it true.", "Right. 5 doesn't fit.", 'Right. 5 is outside the region.',
  ]) assert.equal(detectPraiseThenExclusion(t, '5'), null, t);
});
test('re-admission with "it\'s / that\'s / so it is"', () => {
  assert.equal(detectPraiseThenExclusion("Yes! 6 doesn't satisfy the first part, so it's a solution of the second only.", '6'), null);
  assert.equal(detectPraiseThenExclusion("Right. 6 doesn't work in the first one, but that's fine.", '6'), null);
  assert.equal(detectPraiseThenExclusion("Right. 6 isn't included on the left. So it is a solution on the right.", '6'), null);
});
test('the value never matches inside a signed or longer number, or an operation', () => {
  assert.equal(detectPraiseThenExclusion("Right. -2 doesn't work.", '2'), null);
  assert.equal(detectPraiseThenExclusion("Right. −2 doesn't work.", '2'), null);
  assert.equal(detectPraiseThenExclusion("Right. $-2$ isn't included.", '2'), null);
  assert.equal(detectPraiseThenExclusion("Right. 12 doesn't work.", '2'), null);
  assert.equal(detectPraiseThenExclusion("Right. 2.5 doesn't work.", '2'), null);
  assert.equal(detectPraiseThenExclusion("Right. 2,000 doesn't work.", '2'), null);
  assert.equal(detectPraiseThenExclusion("Right. x - 2 doesn't work.", '2'), null);
  // …and a signed student value is still its own token.
  assert.ok(detectPraiseThenExclusion("Right. -2 doesn't work.", '-2'));
  assert.ok(detectPraiseThenExclusion("Right. −2 doesn't work.", '-2'));
});

console.log('\npraise-then-exclusion — the note');

test('note text: neutral, names the value, one verdict, no attribution, never narrated', () => {
  const n = buildPraiseExclusionNote('5');
  assert.match(n, /^\[correction note — not from the student\]/);
  assert.match(n, /opened by affirming the student's answer "5"/);
  assert.match(n, /then said 5 is not included \/ does not satisfy/);
  assert.match(n, /decide which is true by checking 5 against the problem/i);
  assert.match(n, /ONE clear verdict/);
  assert.match(n, /Do not attribute the correction to the student/);
  assert.match(n, /Never narrate this note/);
  assert.equal(n.includes('\n'), false);
  // Neutral: it does not say which half was wrong.
  assert.doesNotMatch(n, /you were right|was wrong|was incorrect|is wrong/i);
  assert.equal(isPraiseExclusionNote(n), true);
  assert.equal(isPraiseExclusionNote('[correction note — not from the student] An automated review flagged…'), false);
  assert.equal(isPraiseExclusionNote(null), false);
});
test('planted only for a note decision, and never over a pending note', () => {
  const note = decide(LIVE_TUTOR, '5', LIVE_QUESTION);
  const advisory = decide(LIVE_TUTOR, '5');
  assert.equal(shouldPlantPraiseExclusionNote({ enabled: true, decision: note, pendingNote: null }), true);
  assert.equal(shouldPlantPraiseExclusionNote({ enabled: true, decision: note, pendingNote: '[correction note — not from the student] other' }), false);
  assert.equal(shouldPlantPraiseExclusionNote({ enabled: true, decision: advisory, pendingNote: null }), false);
  assert.equal(shouldPlantPraiseExclusionNote({ enabled: false, decision: note, pendingNote: null }), false);
});
test('registered as deterministic, the LLM judge cannot overwrite it', () => {
  const n = buildPraiseExclusionNote('5');
  assert.deepEqual(
    decideJudgeNotePlant({ enabled: true, pendingNote: n, deterministicNote: n }),
    { plant: false, reason: 'deterministic-note-pending' },
  );
});

console.log('\npraise-then-exclusion — the note planted on CORRECT turns (second review pass, 2026-10-04)');

const NOT_NOTES: Array<[string, string, string]> = [
  ['Where does the solution set start?', '5', "Right. 5 isn't included, though, since the inequality is strict, so we use an open circle."],
  ['What number is at the edge of the solution set for x > 5?', '5', "Exactly. 5 isn't included, so we draw an open circle there."],
  ['Which candidate is extraneous, so only the other is a solution?', '3', "Right. 3 doesn't work."],
  [REVIEW_QUESTION, '2', "Yes! 2 doesn't satisfy the left inequality, and it doesn't have to."],
  [REVIEW_QUESTION, '2', "Great. 2 doesn't satisfy the one on the left. It does satisfy the one on the right."],
];
for (const [q, student, tutor] of NOT_NOTES) {
  test(`Q "${q}" · "${student}" → "${tutor}" — no note`, () => {
    assert.notEqual(decide(tutor, student, q).action, 'note');
  });
}
test('the PRODUCTION turn still gives a note (with the review question, too)', () => {
  assert.equal(decide(LIVE_TUTOR, '5', REVIEW_QUESTION).action, 'note');
  assert.equal(decide(LIVE_TUTOR, '5', LIVE_QUESTION).action, 'note');
});
test('the ask must have the shape "<ask> … a/one/any number|value|x that satisfies / works / makes … true / is a solution"', () => {
  for (const q of [
    'Can you give me a number that satisfies x > 5 or x < 3?', 'Pick any value that works.', 'Name another number that is a solution.',
    'Choose one value of x that makes the inequality true.', "What's a number that works here?", 'Tell me one x that satisfies both.',
    'What is a value that satisfies it?',
  ]) assert.equal(asksForSatisfyingValue(q), true, q);
  for (const q of [
    'Where does the solution set start?', 'What number is at the edge of the solution set for x > 5?',
    'Which candidate is extraneous, so only the other is a solution?', 'So what is the solution set?', 'Is 5 a solution?',
    'Does 5 satisfy the inequality?', 'Where does the shading begin, at a number that works?', 'Which endpoint is included?',
    'What do we call a number that satisfies an equation?',
  ]) assert.equal(asksForSatisfyingValue(q), false, q);
});
test('part scope: left / right / one / every / each / all', () => {
  for (const t of [
    "Right. 2 doesn't satisfy the left inequality.", "Right. 2 doesn't satisfy the right one.", "Right. 2 doesn't satisfy every inequality.",
    "Right. 2 doesn't satisfy each of them.", "Right. 2 doesn't satisfy all of the pieces.", "Right. 2 doesn't work for the one on the left.",
  ]) {
    const hit = detectPraiseThenExclusion(t, '2');
    assert.ok(hit, t);
    assert.equal(hit!.partScoped, true, t);
    assert.equal(decide(t, '2', REVIEW_QUESTION).action, 'advisory', t);
  }
});
test('re-admission with no conjunction (shared with the pacing read)', () => {
  assert.equal(isReadmittedPlainly(" x < 3. It does satisfy x > 5, which is all we need.", '7'), true);
  assert.equal(isReadmittedPlainly(' x > 5 — it satisfies x < 3.', '2'), true);
  assert.equal(isReadmittedPlainly(' of x < 3; it is one of x > 5.', '6'), true);
  assert.equal(isReadmittedPlainly(' for the left one. 2 works for the right one!', '2'), true);
  assert.equal(isReadmittedPlainly(' x < 3. It does not satisfy x > 5 either.', '7'), false);
  assert.equal(isReadmittedPlainly(' the inequality. Which number is one that works?', '7'), false);
  assert.equal(isReadmittedPlainly(' here. Plug it in.', null), false);
  assert.equal(detectPraiseThenExclusion("Great. 2 doesn't satisfy the one on the left. It does satisfy the one on the right.", '2'), null);
  assert.equal(detectPraiseThenExclusion("Right. 7 doesn't satisfy x < 3; it satisfies x > 5.", '7'), null);
});

console.log('\npraise-then-exclusion — the note expires');

const SCOPE = { statement: 'Solve x > 5 or x < 3', epoch: 2, pageKey: 'Compound inequalities' };
const REC: PraiseExclusionNoteRecord = { note: buildPraiseExclusionNote('5'), plantedCall: 7, scope: SCOPE };
const expired = (call: number, over?: Partial<typeof SCOPE>, pendingNote: string | null = REC.note) =>
  praiseExclusionNoteExpired({ record: REC, pendingNote, call, now: { ...SCOPE, ...over } });
test('kept during the planting brain call and the one that immediately follows', () => {
  assert.equal(expired(7), false);
  assert.equal(expired(8), false);
});
test('dropped at any LATER brain call (an idle nudge / cover turn held it past the next turn)', () => {
  assert.equal(expired(9), true);
  assert.equal(expired(12), true);
});
test('dropped when the problem or the page moved on', () => {
  assert.equal(expired(8, { statement: 'Solve 2x < 8' }), true);
  assert.equal(expired(8, { epoch: 3 }), true);
  assert.equal(expired(8, { pageKey: 'Absolute value' }), true);
  assert.equal(praiseExclusionNoteExpired({ record: REC, pendingNote: REC.note, call: 8, now: { statement: null, epoch: 2, pageKey: SCOPE.pageKey } }), true);
});
test('never touches a slot that holds another note, or no note; total on bad input', () => {
  assert.equal(expired(20, undefined, '[correction note — not from the student] other'), false);
  assert.equal(expired(20, undefined, null), false);
  assert.equal(praiseExclusionNoteExpired({ record: null, pendingNote: REC.note, call: 20, now: SCOPE }), false);
  assert.equal(praiseExclusionNoteExpired(null as never), false);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
