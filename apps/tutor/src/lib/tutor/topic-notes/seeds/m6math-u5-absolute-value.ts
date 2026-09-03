/**
 * Grade 6 Math — Unit 5 CED 5.3: Absolute Value.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.absolute-value.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U5_ABSOLUTE_VALUE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.absolute-value.v1',
  course: 'Grade 6 Math',
  cedUnit: 5,
  cedTopic: '5.3',
  cedTitle: 'Absolute Value',
  planId: 'evelyn.ms.m6math.absolute-value.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.absolute-value.v1' }],
  theory: [
    { loId: 'm6math.absolute-value', kind: 'framework', title: 'Absolute value is a distance', content: `ABSOLUTE VALUE IS A DISTANCE — the absolute value of a number is how far that number sits from zero on the number line. Distance is never negative, so |7| = 7 and |-7| = 7: both 7 and -7 sit seven units from zero, just on opposite sides.` },
    { loId: 'm6math.absolute-value', content: `THE BARS MEAN "DISTANCE FROM ZERO," NOT AN OPERATION — |-15| is read "the absolute value of negative fifteen." The two vertical bars do not double the number, add to it, or change it in any other way. They measure how far it sits from zero.` },
    { loId: 'm6math.absolute-value', kind: 'framework', title: 'Opposites share the same absolute value', content: `OPPOSITES SHARE THE SAME ABSOLUTE VALUE — +9 and -9 sit the same distance from zero, on opposite sides of it, so |+9| = |-9| = 9. Any number and its opposite always have matching absolute values.` },
    { loId: 'm6math.absolute-value', content: `"GREATER THAN" AND "GREATER ABSOLUTE VALUE" ARE DIFFERENT QUESTIONS — on the number line, greater means farther to the right, so -3 is greater than -18. But -18 sits eighteen units from zero while -3 sits only three units from zero, so |-18| is greater than |-3|. The same two numbers can give opposite answers depending on which question is asked.` },
    { loId: 'm6math.absolute-value', kind: 'framework', title: 'Name the comparison before you answer', content: `NAME THE COMPARISON BEFORE YOU ANSWER — before comparing two signed numbers, decide whether the question is asking which number is greater (order) or which one is bigger in size, ignoring direction (absolute value, or magnitude). A debt of $18 is a bigger debt than a debt of $3 because 18 is a greater magnitude, but a balance of -3 dollars is a better, greater balance than -18 dollars because -3 sits farther to the right on the number line.` },
    { loId: 'm6math.absolute-value', kind: 'definition', title: 'absolute value', content: `the distance a number sits from zero on the number line, written with two vertical bars, such as |-15|.` },
    { loId: 'm6math.absolute-value', kind: 'definition', title: 'magnitude', content: `the size of a number, ignoring its direction; another name for a number's absolute value.` },
    { loId: 'm6math.absolute-value', kind: 'definition', title: 'order comparison', content: `comparing two numbers to see which one is greater on the number line, where farther right always means greater.` },
    { loId: 'm6math.absolute-value', kind: 'definition', title: 'opposites', content: `two numbers the same distance from zero but on opposite sides of it, such as +9 and -9.` },
  ],
  methods: [
    {
      title: 'Worked computing absolute value',
      steps: [
        `Absolute value asks one question: how far does this number sit from zero on the number line? Direction does not matter for this question.`,
        '-8 sits 8 units to the left of zero, so |-8| = 8.',
        '+8 sits 8 units to the right of zero, so |+8| = 8.',
        `Both distances come out to the same number, 8, even though Maya's balance and Sam's balance mean opposite things: Maya owes $8, and Sam has saved $8.`,
        `Check by reading each answer back as a sentence. |-8| = 8 means Maya's debt is a distance of 8 dollars from an empty balance. |+8| = 8 means Sam's savings are also a distance of 8 dollars from an empty balance. The sizes match; the situations do not.`,
      ],
      example: { problem: `Maya's allowance app shows her balance as -8 dollars, because she borrowed $8 from her sister. Her friend Sam's app shows +8 dollars, because he saved $8. Find |-8| and |+8|. What does each result tell you?`, solution: '|-8| = 8 and |+8| = 8' },
      relatedLoIds: ['m6math.absolute-value'],
    },
    {
      title: 'Worked order vs magnitude',
      steps: [
        `These are two different questions. Part (a) asks which number is greater. Part (b) asks which distance from zero is greater.`,
        `(a) On the number line, greater means farther to the right. -3 sits to the right of -18, closer to zero, so -3 is the greater number: -3 > -18.`,
        `WRONG: saying -18 is greater than -3 because 18 is a bigger digit than 3. CORRECT: -3 is the greater number, because greater is about position on the number line, not the size of the digits.`,
        `(b) |-18| = 18, because -18 sits 18 units from zero. |-3| = 3, because -3 sits 3 units from zero. Since 18 is greater than 3, |-18| is the greater absolute value.`,
        `So -3 is the greater NUMBER, but -18 has the greater ABSOLUTE VALUE. Both answers are correct, because they answer different questions.`,
        `Check with the story: a balance of -3 dollars is closer to owing nothing at all than a balance of -18 dollars, so -3 is the better, greater balance. But Jayden's debt of $18 is a bigger debt than Priya's debt of $3, which matches the absolute values.`,
      ],
      example: { problem: `Jayden's balance is -18 dollars. Priya's balance is -3 dollars. (a) Which balance is greater, as a signed number? (b) Which balance has the greater absolute value?`, solution: '(a) -3 is greater: -3 > -18. (b) |-18| = 18 is greater than |-3| = 3.' },
      relatedLoIds: ['m6math.absolute-value'],
    },
  ],
  pointers: [
    { content: `Students often say "-25 feet is greater than -6 feet, because 25 is a bigger number than 6." — -6 is greater than -25. Greater means farther to the right on the number line, and -6 sits closer to zero than -25 does. Comparing which number is greater is an order comparison, and order depends on position, not on the size of the digits.`, kind: 'common-error' },
    { content: `Students often say "|-6| is greater than |-25|, because -6 is closer to zero." — |-6| = 6 and |-25| = 25. Absolute value is the distance from zero, and -25 sits farther from zero than -6 does. Since 25 is greater than 6, |-25| is greater than |-6|. Being closer to zero means a smaller absolute value, not a bigger one.`, kind: 'common-error' },
    { content: `Absolute value is the distance a number sits from zero on the number line, and distance is never negative: |7| = 7 and |-7| = 7.`, kind: 'tip' },
    { content: `The two vertical bars in |-15| mean the absolute value of negative fifteen; they measure a distance, they do not double or otherwise change the number.`, kind: 'tip' },
    { content: `Opposites such as +9 and -9 sit the same distance from zero, on opposite sides, so they share the same absolute value: |+9| = |-9| = 9.`, kind: 'tip' },
    { content: `On the number line, greater than means farther to the right, so -3 is greater than -18 even though 18 is a bigger digit than 3.`, kind: 'tip' },
    { content: `Comparing which number is greater (order) and comparing which absolute value is bigger (magnitude) are different questions and can give opposite answers for the same two numbers.`, kind: 'tip' },
    { content: `Before comparing two numbers, decide which question is being asked: order (which is greater as a signed number) or magnitude (which absolute value is bigger).`, kind: 'tip' },
    { content: `Don't confuse "greater than" with "bigger digit." On the number line, -3 is greater than -18 because -3 sits farther right, even though 18 is a bigger digit than 3.`, kind: 'common-error' },
    { content: `The bars | | mean "distance from zero," not an operation. They don't double the number, add to it, or change it—they just measure how far it sits from zero.`, kind: 'vocab-note' },
    { content: `Opposites always have the same absolute value. If |a| = 12, then both a and its opposite sit 12 units from zero: a could be 12 or -12.`, kind: 'tip' },
    { content: `Before you compare two numbers, ask yourself: Am I comparing which one is greater (order), or which one has a bigger distance from zero (magnitude)? These give opposite answers for negatives.`, kind: 'gotcha' },
    { content: `Closer to zero means smaller absolute value, not bigger. If -6 is closer to zero than -25, then |-6| < |-25|, not the other way around.`, kind: 'common-error' },
    { content: `Absolute value is never negative. If you get a negative answer, you made an error. The result is always zero or positive.`, kind: 'edge-case' },
    { content: `A debt of $25 is bigger than a debt of $6 (compare absolute values), but a balance of -6 dollars is better than a balance of -25 dollars (compare as signed numbers). Know which context the problem is asking about.`, kind: 'tip' },
  ],
};
