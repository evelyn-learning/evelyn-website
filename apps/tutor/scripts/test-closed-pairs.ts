/**
 * Contradicting restatement: the student gives one member of a closed pair
 * and the tutor's first sentence states the other ("below the line." →
 * "Above the line. Look at (0, 5)…"). No correction word is used, so the
 * ledger and the pacing streak never saw the wrong answer.
 *
 * Run: npx tsx scripts/test-closed-pairs.ts
 */
import { strict as assert } from 'node:assert';
import { CLOSED_PAIRS, detectContradictingRestatement } from '../src/lib/tutor/voice/closed-pairs';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}`); console.log(`      ${(e as Error).message}`); }
}
const hit = (s: string, t: string) => detectContradictingRestatement(s, t) !== null;

console.log('\nclosed pairs — contradicting restatement');

test('LIVE: "below the line." → "Above the line. Look at (0, 5)…"', () => {
  const r = detectContradictingRestatement('below the line.', 'Above the line. Look at (0, 5) — does it make the inequality true?');
  assert.ok(r);
  assert.equal(r!.student, 'below');
  assert.equal(r!.tutor, 'above');
});
test('LIVE-shaped: "solid." → "Dashed. …"', () => {
  assert.ok(hit('solid.', 'Dashed. The inequality is strict, so the line itself is left out.'));
});
test('the table is data and every listed pair fires both ways', () => {
  const required: Array<[string, string]> = [
    ['above', 'below'], ['left', 'right'], ['solid', 'dashed'], ['open', 'closed'],
    ['greater', 'less'], ['positive', 'negative'], ['increasing', 'decreasing'],
    ['yes', 'no'], ['true', 'false'], ['maximum', 'minimum'], ['more', 'fewer'],
    ['inside', 'outside'],
  ];
  for (const [a, b] of required) {
    assert.ok(
      CLOSED_PAIRS.some(([x, y]) => (x.includes(a) && y.includes(b)) || (x.includes(b) && y.includes(a))),
      `pair ${a}/${b} missing from table`,
    );
  }
  assert.ok(hit('above', 'Below the line.'));
  assert.ok(hit('right', 'To the left, actually.'));
  // CHANGED (review 2026-10-04): was 'It shifts to the right.' — five words
  // is prose by the new rule (a bare restatement is at most four).
  assert.ok(hit('left', 'To the right.'));
  assert.equal(hit('left', 'It shifts to the right.'), false);
  assert.ok(hit('dashed', 'Solid line here.'));
  assert.ok(hit('closed', 'Open circle.'));
  assert.ok(hit('open', 'A closed circle.'));
  assert.ok(hit('less', 'Greater than.'));
  assert.ok(hit('greater', 'Less than, this time.'));
  assert.ok(hit('negative', 'Positive.'));
  assert.ok(hit('positive', "It's negative."));
  assert.ok(hit('decreasing', 'Increasing.'));
  assert.ok(hit('increasing', 'Decreasing on that interval.'));
  assert.ok(hit('yes', 'No. The point is on the line itself.'));
  assert.ok(hit('no', 'Yes, it does.'));
  assert.ok(hit('true', 'False.'));
  assert.ok(hit('false', "It's true."));
  assert.ok(hit('minimum', 'A maximum.'));
  assert.ok(hit('max', "It's a minimum."));
  assert.ok(hit('fewer', 'More.'));
  assert.ok(hit('more', 'Fewer, actually.'));
  assert.ok(hit('outside', 'Inside the circle.'));
  assert.ok(hit('inside', 'Outside.'));
});

console.log('\nclosed pairs — negatives');

test('the tutor repeats the student\'s own member', () => {
  assert.equal(hit('below the line', 'Below the line. Exactly.'), false);
  assert.equal(hit('above', 'Above, not below.'), false);
});
test('"Right." as an AFFIRMATION is not the direction', () => {
  assert.equal(hit('left', 'Right. It moves three units.'), false);
  assert.equal(hit('left', "Right, that's it."), false);
  assert.equal(hit('left', "That's right."), false);
});
test('a negated opposite is agreement', () => {
  assert.equal(hit('below', "It's not above the line."), false);
  assert.equal(hit('solid', "It isn't dashed."), false);
});
test('a tutor QUESTION is not a restatement', () => {
  assert.equal(hit('below', 'Above or below?'), false);
  assert.equal(hit('below', 'Is it above the line?'), false);
});
test('reassurance "No …" is not a contradiction of "yes"', () => {
  assert.equal(hit('yes', 'No worries, take your time.'), false);
  assert.equal(hit('yes', 'No problem.'), false);
  assert.equal(hit('yes', 'No rush. Here is the next one.'), false);
});
test('"more" as an ordinary word', () => {
  assert.equal(hit('fewer', 'One more thing.'), false);
  assert.equal(hit('fewer', "Let's do one more."), false);
});
test('long student utterances are out of scope', () => {
  assert.equal(hit('I think the shaded region is below the line because of the sign', 'Above the line.'), false);
});
test('a long tutor first sentence is prose, not a bare restatement', () => {
  assert.equal(
    hit('below', 'When we graphed the last one the shading went above the line because the sign pointed the other way, remember.'),
    false,
  );
});
test('the opposite only appears later in the turn', () => {
  assert.equal(hit('below', 'Good. Now look above the line.'), false);
});
test('no pair word in the student answer', () => {
  assert.equal(hit('5', 'Above the line.'), false);
  assert.equal(hit('', 'Above the line.'), false);
  assert.equal(hit('below', ''), false);
});
test('both members in the student answer', () => {
  assert.equal(hit('above or below', 'Above the line.'), false);
});

console.log('\nclosed pairs — the tutor simply MOVES ON (review, 2026-10-04)');

for (const [student, tutor] of [
  ['minimum', "Let's find the maximum next."],
  ['min', 'Now for the max.'],
  ['positive', 'Now try a negative number.'],
  ['increasing', "Now let's look at where it's decreasing."],
  ['inside', "Let's test a point outside the circle next."],
  ['more', 'Fewer steps than I expected — nice!'],
  ['open', 'Case closed!'],
  ['open circle', 'Case closed! Open circle it is.'],
] as const) {
  test(`"${student}" → "${tutor}" — no correction`, () => {
    assert.equal(detectContradictingRestatement(student, tutor), null);
  });
}
test('a bare restatement: at most four words, the opposite member leading', () => {
  assert.ok(hit('below', 'Above the line.'));
  assert.ok(hit('solid', 'Dashed.'));
  assert.ok(hit('dashed', "It's solid, actually."));
  assert.ok(hit('increasing', 'No — decreasing.'));
  assert.ok(hit('min', "Actually, it's a max."));
  // Longer, or the opposite word buried: prose.
  assert.equal(hit('below', 'Above the line is where we shade.'), false);
  assert.equal(hit('below', 'The region above.'), false);
  assert.equal(hit('solid', 'We draw it dashed.'), false);
});
test('transition / instruction words are never a restatement', () => {
  for (const [student, tutor] of [
    ['below', 'Now above.'], ['below', 'Next, above.'], ['solid', "Let's go dashed."], ['positive', 'Try negative.'],
    ['solid', 'Another dashed one.'], ['max', 'Find the min.'], ['inside', 'Test outside.'], ['below', 'Look above.'],
  ] as const) assert.equal(hit(student, tutor), false, tutor);
});
test('idioms are not answers', () => {
  assert.equal(hit('open', 'Case closed.'), false);
  assert.equal(hit('fewer', 'More or less.'), false);
  assert.equal(hit('true', 'False alarm.'), false);
  assert.equal(hit('yes', 'No way!'), false);
  assert.equal(hit('left', 'Right away.'), false);
});
test('the sound cases stay sound', () => {
  assert.equal(hit('above', 'Right — above the line, not below.'), false);
  assert.equal(hit('solid', 'Solid, exactly.'), false);
  assert.equal(hit('left', 'Right. Left side is shaded, the right side is not.'), false);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
