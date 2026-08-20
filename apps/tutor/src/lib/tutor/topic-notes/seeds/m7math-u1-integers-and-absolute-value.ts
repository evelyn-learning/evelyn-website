/**
 * Grade 7 Math — Unit 1 CED 1.1: Integers & Absolute Value.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.integers-and-absolute-value.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U1_INTEGERS_AND_ABSOLUTE_VALUE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.integers-and-absolute-value.v1',
  course: 'Grade 7 Math',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Integers & Absolute Value',
  planId: 'evelyn.ms.m7math.integers-and-absolute-value.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.integers-and-absolute-value.v1' }],
  theory: [
    { loId: 'm7math.integers-and-absolute-value', kind: 'framework', title: 'The number line has two sides', content: `THE NUMBER LINE HAS TWO SIDES — zero sits in the middle. Positive numbers go right, negative numbers go left. Moving right always makes a number bigger, so −2 is bigger than −7 even though 7 is bigger than 2. On the line, −7 sits further left, and further left means smaller.` },
    { loId: 'm7math.integers-and-absolute-value', kind: 'framework', title: 'Opposites are mirror images', content: `OPPOSITES ARE MIRROR IMAGES — 5 and −5 are opposites because they sit the same distance from zero on opposite sides. The opposite of zero is zero. Writing the opposite of a number means flipping which side it is on, not making it negative: the opposite of −8 is 8.` },
    { loId: 'm7math.integers-and-absolute-value', kind: 'framework', title: 'Absolute value is distance from zero', content: `ABSOLUTE VALUE IS DISTANCE FROM ZERO — we write it with two straight bars, so |−6| = 6 and |6| = 6. Both numbers sit six units from zero, and distance is never negative. That is the whole idea.` },
    { loId: 'm7math.integers-and-absolute-value', kind: 'framework', title: 'The big trap', content: `THE BIG TRAP — absolute value does NOT mean "erase the minus sign." It only acts on what is INSIDE the bars. If a minus sign is sitting outside, it stays: |−6| = 6, but −|−6| = −6. Read the bars like parentheses; they close before the outside sign gets its turn.` },
    { loId: 'm7math.integers-and-absolute-value', kind: 'framework', title: 'Distance between two numbers', content: `DISTANCE BETWEEN TWO NUMBERS — the gap between two numbers on the line is the absolute value of their difference. From −3 to 4 the gap is |−3 − 4| = |−7| = 7. Counting the jumps on the line gives the same 7, which is a good way to check yourself.` },
    { loId: 'm7math.integers-and-absolute-value', kind: 'definition', title: 'integer', content: 'a whole number and its opposite, including zero: … −2, −1, 0, 1, 2 …' },
    { loId: 'm7math.integers-and-absolute-value', kind: 'definition', title: 'opposite', content: 'the number the same distance from zero but on the other side of the line.' },
    { loId: 'm7math.integers-and-absolute-value', kind: 'definition', title: 'absolute value', content: 'the distance of a number from zero, written |x| and never negative.' },
  ],
  methods: [
    {
      title: 'Worked order integers',
      steps: [
        `Sketch a number line and mark zero in the middle. Everything negative goes left of it, everything positive goes right.`,
        `Place the negatives: −8 is eight units left of zero, −2 is only two units left. So −8 sits further left than −2.`,
        'Place the positives: 3 is three right, 6 is six right, so 3 comes before 6.',
        `Read the line left to right, which is exactly least to greatest: −8, −2, 0, 3, 6.`,
      ],
      example: { problem: 'Put these in order from least to greatest: 3, −8, 0, −2, 6', solution: '−8, −2, 0, 3, 6' },
      relatedLoIds: ['m7math.integers-and-absolute-value'],
    },
    {
      title: 'Worked absolute value signs',
      steps: [
        `(a) The bars ask for distance from zero. Negative nine sits nine units from zero, so |−9| = 9.`,
        `(b) Work inside the bars first: |−9| = 9. NOW apply the minus sign that was waiting outside, which gives −9. Compare (a) and (b) carefully — same digits, different answers, because the outside sign survives.`,
        '(c) Everything inside the bars is one job: 4 − 10 = −6 first. Then |−6| = 6.',
        `Takeaway: bars behave like parentheses. Finish the inside, then deal with whatever is outside.`,
      ],
      example: { problem: 'Evaluate each one: (a) |−9|, (b) −|−9|, (c) |4 − 10|', solution: '(a) 9, (b) −9, (c) 6' },
      relatedLoIds: ['m7math.integers-and-absolute-value'],
    },
  ],
  pointers: [
    { content: `Students often say "7" — Absolute value only acts on what is INSIDE the bars, so |−7| = 7. The minus sign outside then applies to that result, giving −|−7| = −7. Compare |−7| = 7 with −|−7| = −7 — the bars close first, and the outside sign goes last.`, kind: 'common-error' },
    { content: 'On the number line, further right means greater — so −2 is greater than −7.', kind: 'tip' },
    { content: `Opposites sit the same distance from zero on opposite sides; the opposite of −8 is 8.`, kind: 'tip' },
    { content: 'Absolute value is distance from zero, so it is never negative: |−6| = 6.', kind: 'tip' },
    { content: 'The bars act like parentheses. A minus sign outside them survives: −|−6| = −6.', kind: 'tip' },
    { content: `The distance between two numbers is the absolute value of their difference: from −3 to 4 is |−3 − 4| = 7.`, kind: 'tip' },
    { content: `With negatives, bigger digits mean *smaller* numbers. −7 < −2 even though 7 > 2. If you're stuck, sketch the line: whichever number is further left loses.`, kind: 'common-error' },
    { content: `Absolute value bars do NOT delete every minus sign in sight. They only touch what's inside. |−7| = 7, but −|−7| = −7. Check for a sign hiding outside the bars before you write your answer.`, kind: 'gotcha' },
    { content: `Treat | | like parentheses: finish all the arithmetic inside first, then take the distance. |4 − 10| means 4 − 10 = −6 first, then |−6| = 6. It is NOT |4| − |10|.`, kind: 'common-error' },
    { content: `"Opposite" means flip sides of zero, not "stick a minus on it." The opposite of −8 is 8, not −8. And the opposite of 0 is 0 — zero is its own opposite.`, kind: 'vocab-note' },
    { content: `An absolute value answer can never come out negative. If you write |−5| = −5, you've made a mistake — distance can't be less than nothing.`, kind: 'tip' },
    { content: `Zero is an integer, and it's neither positive nor negative. It's the only number whose distance from zero is 0, so |0| = 0.`, kind: 'edge-case' },
    { content: `Distance between two numbers = |difference|, so it's always positive. From −5 to 6: |−5 − 6| = |−11| = 11, not 1. Subtracting a positive from a negative makes it *more* negative.`, kind: 'common-error' },
    { content: `Count jumps on a number line to double-check any distance answer. If |−3 − 4| gave you 7, hop from −3 to 0 (3 jumps) then 0 to 4 (4 jumps) — 7. Matching means you're right.`, kind: 'tip' },
  ],
};
