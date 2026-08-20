/**
 * Grade 7 Math — Unit 3 CED 3.4: Constant of Proportionality & Its Equation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.constant-of-proportionality.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U3_CONSTANT_OF_PROPORTIONALITY: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.constant-of-proportionality.v1',
  course: 'Grade 7 Math',
  cedUnit: 3,
  cedTopic: '3.4',
  cedTitle: 'Constant of Proportionality & Its Equation',
  planId: 'evelyn.ms.m7math.constant-of-proportionality.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.constant-of-proportionality.v1' }],
  theory: [
    { loId: 'm7math.constant-of-proportionality', content: `k IS y DIVIDED BY x — in a proportional relationship, every pair gives the same value of y ÷ x. That shared value is called the constant of proportionality and is written k. Constant is the whole point: it does not change from one pair to the next.` },
    { loId: 'm7math.constant-of-proportionality', content: `THE EQUATION IS y = kx — once you know k, you can find the y that goes with any x by multiplying. If k = 8 dollars per dog, then y = 8x, and 7 dogs give y = 8 × 7 = 56 dollars. The equation replaces the table, because it works for every x, even ones nobody listed.` },
    { loId: 'm7math.constant-of-proportionality', content: `k AND THE UNIT RATE ARE THE SAME NUMBER — this is the sentence to hold onto. $0.70 per bar from lesson 3.1 was a k. The 2 miles per hour from lesson 3.2 was a k. The 2.5 dollars per taco from lesson 3.3 was a k. One number, three names: unit rate, unit price, constant of proportionality. You have been finding k all unit long.` },
    { loId: 'm7math.constant-of-proportionality', content: `READING k FROM A TABLE — pick any row and compute y ÷ x, then check a second row to make sure the relationship really is proportional. If the rows disagree, there is no k at all, because the relationship is not proportional.` },
    { loId: 'm7math.constant-of-proportionality', content: `READING k FROM A GRAPH — the easiest place to look is the point where x = 1, because there y is exactly k. If the graph has no marked point at x = 1, take ANY point (x, y) on the line and divide: k = y ÷ x. Do not just read the y-value of whatever point you see. That shortcut only works at x = 1.` },
    { loId: 'm7math.constant-of-proportionality', content: `k CARRIES UNITS, AND THE UNITS ARE THE MEANING — say k out loud with its units: 8 dollars per dog, 2.5 inches per hour, 12 dollars per shirt. Stating the units is how you explain what a point on the graph means, and it is how you catch a k that was computed upside down.` },
    { loId: 'm7math.constant-of-proportionality', kind: 'definition', title: 'constant of proportionality', content: `the number k that every pair in a proportional relationship gives when you compute y ÷ x.` },
    { loId: 'm7math.constant-of-proportionality', kind: 'definition', title: 'y = kx', content: `the equation of a proportional relationship: multiply x by the constant k to get y.` },
    { loId: 'm7math.constant-of-proportionality', kind: 'definition', title: 'unit rate', content: 'the amount that goes with one of the other quantity. It is the same number as k.' },
  ],
  methods: [
    {
      title: 'Worked k from table',
      steps: [
        `Let x be the number of shirts and y be the cost in dollars, then compute y ÷ x for the first row: 36 ÷ 3 = 12.`,
        `Check the other rows before trusting that 12: 60 ÷ 5 = 12, and 96 ÷ 8 = 12. All three rows agree, so the relationship is proportional and k = 12.`,
        'Write the equation: y = 12x.',
        `Say k with its units: 12 dollars per shirt. That is the unit price, which is exactly the kind of number lesson 3.1 was about.`,
        `Use the equation on a row that was not in the table: 10 shirts cost y = 12 × 10 = $120.`,
        `Check the equation against a row that WAS given: 12 × 8 = 96, which matches the table.`,
      ],
      example: { problem: `A team store sells shirts. 3 shirts cost $36, 5 shirts cost $60, and 8 shirts cost $96. Find k and write the equation.`, solution: 'k = 12 dollars per shirt, and y = 12x' },
      relatedLoIds: ['m7math.constant-of-proportionality'],
    },
    {
      title: 'Worked k from graph point',
      steps: [
        `The line is straight and goes through the origin, so the relationship is proportional and a single k exists.`,
        'Use k = y ÷ x with the point you were given: k = 10 ÷ 4 = 2.5.',
        `Attach the units: 2.5 inches per hour. That sentence is what the constant MEANS in this story.`,
        'Write the equation: y = 2.5x, where x is hours and y is inches.',
        `Find the point at x = 1: y = 2.5 × 1 = 2.5, so (1, 2.5) is on the line. On any proportional graph, the y-value at x = 1 is k itself.`,
        `Predict and check. After 6 hours: y = 2.5 × 6 = 15 inches. Back-check the given point: 2.5 × 4 = 10, which matches.`,
        `WRONG answer to avoid: k = 10, taken from the y-coordinate of the point. RIGHT answer: k = 2.5, because k is y ÷ x and here x is 4, not 1.`,
      ],
      example: { problem: `A graph of snowfall is a straight line through the origin. It passes through the point (4, 10), meaning 10 inches of snow have fallen after 4 hours. Find k and write the equation.`, solution: 'k = 2.5 inches per hour, and y = 2.5x' },
      relatedLoIds: ['m7math.constant-of-proportionality'],
    },
  ],
  pointers: [
    { content: `Students often say "k = 10" — The constant is k = y ÷ x = 10 ÷ 4 = 2.5. Test it: y = 2.5 × 4 = 10, which matches the point, while y = 10 × 4 = 40 does not. The point where the y-value alone gives k is (1, k), and on this line that point is (1, 2.5).`, kind: 'common-error' },
    { content: `Students often say "k = 0.4" — The constant is defined as y ÷ x, which is 10 ÷ 4 = 2.5 inches per hour. The number 0.4 is 4 ÷ 10, which is 0.4 hours per inch. That is a true statement about the same snowfall, but it is the other rate. Substituting settles it: 2.5 × 4 = 10 matches the point, and 0.4 × 4 = 1.6 does not.`, kind: 'common-error' },
    { content: 'The constant of proportionality is k = y ÷ x, and it is the same for every pair.', kind: 'tip' },
    { content: 'The equation of a proportional relationship is y = kx.', kind: 'tip' },
    { content: `k IS the unit rate. Unit price, miles per hour, and constant of proportionality are three names for one number.`, kind: 'tip' },
    { content: `From a table, divide y by x in a row and confirm with a second row. From a graph, use k = y ÷ x with any point, or read y at x = 1.`, kind: 'tip' },
    { content: `Always state k with its units, such as 12 dollars per shirt, because the units are what k means.`, kind: 'tip' },
    { content: `k = y ÷ x, always in that order. Flipping it to x ÷ y gives a real rate but the *other* one — 0.4 hours per inch instead of 2.5 inches per hour. Test your k by substituting: it must make y = kx true for the pair you started with.`, kind: 'common-error' },
    { content: `Don't read k straight off a point's y-coordinate. At (4, 10), k is NOT 10 — it's 10 ÷ 4 = 2.5. The y-value alone equals k only at the point (1, k).`, kind: 'gotcha' },
    { content: `Check a second row before you trust k. If 36 ÷ 3 = 12 but 60 ÷ 5 = 11, there is no k — the relationship isn't proportional, so don't write y = 11x or y = 12x.`, kind: 'edge-case' },
    { content: `Say k out loud with units: "12 dollars per shirt," not just "12." Naked numbers are how upside-down k's sneak through — "0.08 shirts per dollar" instantly sounds wrong.`, kind: 'tip' },
    { content: `Unit rate, unit price, and constant of proportionality are three names for the same number. If a problem gives you "$2.50 per taco," you already have k — no dividing needed.`, kind: 'vocab-note' },
    { content: `k does not have to be a whole number. 10 ÷ 4 = 2.5 and 9 ÷ 6 = 1.5 are perfectly good constants. Don't round to make it "nicer" — write the decimal or fraction.`, kind: 'edge-case' },
    { content: `y = kx means multiply, not add. Once k = 12, 10 shirts cost 12 × 10 = 120, not 12 + 10. Back-check with a pair you were given: 12 × 8 should equal 96.`, kind: 'common-error' },
    { content: `Label which quantity is x and which is y before dividing. Swapping them (hours as y, inches as x) flips k upside down even if your arithmetic is perfect.`, kind: 'tip' },
  ],
};
