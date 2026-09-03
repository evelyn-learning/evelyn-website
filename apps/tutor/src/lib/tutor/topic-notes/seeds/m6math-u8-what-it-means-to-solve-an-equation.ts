/**
 * Grade 6 Math — Unit 8 CED 8.1: What It Means to Solve an Equation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.what-it-means-to-solve-an-equation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U8_WHAT_IT_MEANS_TO_SOLVE_AN_EQUATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.what-it-means-to-solve-an-equation.v1',
  course: 'Grade 6 Math',
  cedUnit: 8,
  cedTopic: '8.1',
  cedTitle: 'What It Means to Solve an Equation',
  planId: 'evelyn.ms.m6math.what-it-means-to-solve-an-equation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.what-it-means-to-solve-an-equation.v1' }],
  theory: [
    { loId: 'm6math.what-it-means-to-solve-an-equation', kind: 'framework', title: 'An equation or inequality makes a claim', content: `AN EQUATION OR INEQUALITY MAKES A CLAIM — a statement with a letter in it, like n + 8 = 20 or y × 3 < 16, does not have a fixed truth value by itself. It becomes true or false only once a number replaces the letter. Different numbers can make the same statement true or false.` },
    { loId: 'm6math.what-it-means-to-solve-an-equation', kind: 'framework', title: 'A solution is a value that makes the statement true', content: `A SOLUTION IS A VALUE THAT MAKES THE STATEMENT TRUE — solving an equation or inequality means finding which value, or values, from a given set of candidates make the statement true when substituted in. Nothing needs to be calculated from scratch to do this; every candidate can simply be tested.` },
    { loId: 'm6math.what-it-means-to-solve-an-equation', kind: 'framework', title: 'Checking a candidate means substitute, then compare', content: `CHECKING A CANDIDATE MEANS SUBSTITUTE, THEN COMPARE — replace the letter with the candidate number everywhere it appears, compute the resulting number, and compare it to the other side. For an equation, the two sides must come out exactly equal. For an inequality, the comparison itself, less than or greater than, must come out true.` },
    { loId: 'm6math.what-it-means-to-solve-an-equation', content: `AN EQUATION USUALLY HAS ONE SOLUTION FROM A SET; AN INEQUALITY OFTEN HAS SEVERAL — n + 8 = 20 asks for the one candidate that lands exactly on 20. y × 3 < 16 can be true for many different candidates at once, because many numbers multiplied by 3 land below 16. Never assume an inequality has only one solution just because most equations in this course do.` },
    { loId: 'm6math.what-it-means-to-solve-an-equation', kind: 'framework', title: 'A candidate that fails is still useful', content: `A CANDIDATE THAT FAILS IS STILL USEFUL — testing a candidate that turns out false is not wasted effort. It rules that value out and shows exactly why it does not work, which is different from a number simply looking close to right.` },
    { loId: 'm6math.what-it-means-to-solve-an-equation', kind: 'framework', title: 'Solving is not the same as simplifying', content: `SOLVING IS NOT THE SAME AS SIMPLIFYING — simplifying an expression, last lesson's skill, rewrites it into an equivalent form with no particular value in mind. Solving hunts for the specific value, or values, that make a true-or-false statement come out true. This lesson never turns an equation into a simpler one by working on both sides; every candidate here is checked directly by substitution.` },
    { loId: 'm6math.what-it-means-to-solve-an-equation', kind: 'definition', title: 'solution', content: `a value that, when substituted for the letter, makes an equation or inequality true.` },
    { loId: 'm6math.what-it-means-to-solve-an-equation', kind: 'definition', title: 'substitution', content: 'replacing a letter with a specific number so a statement can be checked.' },
    { loId: 'm6math.what-it-means-to-solve-an-equation', kind: 'definition', title: 'equation', content: 'a statement that says two expressions are equal, using an equals sign.' },
    { loId: 'm6math.what-it-means-to-solve-an-equation', kind: 'definition', title: 'inequality', content: `a statement that compares two expressions using less than or greater than instead of an equals sign.` },
  ],
  methods: [
    {
      title: 'Worked check the equation candidates',
      steps: [
        `Solving this equation means finding the value of n that makes n + 8 = 20 a true statement. Check each candidate one at a time by substitution.`,
        `Substitute n = 10: 10 + 8 = 18. Eighteen does not equal twenty, so the statement is false. 10 is not the solution.`,
        `Substitute n = 12: 12 + 8 = 20. Twenty equals twenty, so the statement is true. 12 makes the equation true.`,
        `Substitute n = 13: 13 + 8 = 21. Twenty-one does not equal twenty, so the statement is false. 13 is not the solution.`,
        `Substitute n = 15: 15 + 8 = 23. Twenty-three does not equal twenty, so the statement is false. 15 is not the solution.`,
        `Only one candidate worked. n = 12 is the solution to n + 8 = 20, because substituting 12 for n produces a true statement, and every other candidate produces a false one.`,
      ],
      example: { problem: `In the group chat, Mia posts: "My number plus 8 equals 20. Which of these is my number: 10, 12, 13, or 15?" Check each candidate by substituting it into the equation n + 8 = 20.`, solution: 'n = 12' },
      relatedLoIds: ['m6math.what-it-means-to-solve-an-equation'],
    },
    {
      title: 'Worked check the inequality candidates',
      steps: [
        `Solving this inequality means finding every value of y from the given set that makes y × 3 < 16 a true statement, not necessarily just one.`,
        `Substitute y = 3: 3 × 3 = 9. Nine is less than sixteen, so the statement is true. 3 is a solution.`,
        `Substitute y = 4: 4 × 3 = 12. Twelve is less than sixteen, so the statement is true. 4 is a solution.`,
        `Substitute y = 5: 5 × 3 = 15. Fifteen is less than sixteen, so the statement is true. 5 is a solution.`,
        `Substitute y = 6: 6 × 3 = 18. Eighteen is not less than sixteen, so the statement is false. 6 is not a solution.`,
        `WRONG: Ben's claim that this inequality has exactly one solution, because that pattern only holds for many equations, not for inequalities. CORRECT: three of the four candidates, 3, 4, and 5, all make this inequality true. An inequality can have more than one solution from the same set of candidates, because many different numbers can satisfy a comparison like "less than sixteen."`,
      ],
      example: { problem: `Ben says the inequality y × 3 < 16 has exactly one solution, the same way most equations in this course do. Check each candidate value, 3, 4, 5, and 6, by substitution and decide whether Ben is right.`, solution: '3, 4, and 5 are solutions; 6 is not a solution.' },
      relatedLoIds: ['m6math.what-it-means-to-solve-an-equation'],
    },
  ],
  pointers: [
    { content: `Students often say "p = 5 is a solution to p + 9 = 16." — Recompute carefully: 5 + 9 = 14, not 16. Fourteen does not equal sixteen, so p = 5 is not a solution. A substitution check is only trustworthy if the arithmetic inside it is done correctly; among the candidates 5, 6, 7, and 8, it is p = 7 that gives 7 + 9 = 16.`, kind: 'common-error' },
    { content: `Students often say "m = 6 is not a solution to m × 4 > 20." — An inequality does not need both sides to be equal. Substitute m = 6: 6 × 4 = 24. Twenty-four IS greater than twenty, so the statement 24 > 20 is true, and m = 6 is a solution. Solving an inequality means checking whether the comparison holds, not whether the two sides match exactly.`, kind: 'common-error' },
    { content: `An equation or inequality with a letter in it is neither true nor false until a number replaces the letter.`, kind: 'tip' },
    { content: 'A solution is a value from a given set that makes the statement true.', kind: 'tip' },
    { content: `Checking a candidate means substituting it in, computing the result, and comparing: exact equality for an equation, a true comparison for an inequality.`, kind: 'tip' },
    { content: `An equation usually has one solution from a set of candidates; an inequality can have several, so never assume there is only one.`, kind: 'tip' },
    { content: 'A candidate that fails a check is still useful. It rules that value out.', kind: 'tip' },
    { content: `Solving is not the same as simplifying: simplifying rewrites an expression, solving finds the value that makes a statement true.`, kind: 'tip' },
  ],
};
