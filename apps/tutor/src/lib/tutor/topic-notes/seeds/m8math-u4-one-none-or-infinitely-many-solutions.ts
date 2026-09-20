/**
 * Grade 8 Math — Unit 4 CED 4.4: One, None or Infinitely Many Solutions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m8math.one-none-or-infinitely-many-solutions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M8MATH_U4_ONE_NONE_OR_INFINITELY_MANY_SOLUTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m8math.one-none-or-infinitely-many-solutions.v1',
  course: 'Grade 8 Math',
  cedUnit: 4,
  cedTopic: '4.4',
  cedTitle: 'One, None or Infinitely Many Solutions',
  planId: 'evelyn.ms.m8math.one-none-or-infinitely-many-solutions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m8math.one-none-or-infinitely-many-solutions.v1' }],
  theory: [
    { loId: 'm8math.one-none-or-infinitely-many-solutions', kind: 'framework', title: 'An equation asks a question', content: `AN EQUATION ASKS A QUESTION — 5x - 4 = 2x + 11 asks "which values of x make the left side and the right side the same number?" Every equation you solved before this lesson answered with exactly one number. That is one of three possible answers, and the other two are just as real: EVERY number works, or NO number works.` },
    { loId: 'm8math.one-none-or-infinitely-many-solutions', kind: 'framework', title: 'Transform until the equation speaks', content: `TRANSFORM UNTIL THE EQUATION SPEAKS — use the moves you already own: distribute any factor, combine like terms on each side, then subtract to collect the variable terms on one side. Keep going until the equation reads in one of three shapes: x = a (x equals one number), a = a (the same number on both sides), or a = b (two different numbers). The shape you land on IS the answer.` },
    { loId: 'm8math.one-none-or-infinitely-many-solutions', content: `x = a MEANS ONE SOLUTION — 5x - 4 = 2x + 11 becomes 3x - 4 = 11 after subtracting 2x from both sides, then 3x = 15, then x = 5. Exactly one number works, and the check proves it: 5(5) - 4 = 21 and 2(5) + 11 = 21. This is the shape every earlier lesson in this unit ended in.` },
    { loId: 'm8math.one-none-or-infinitely-many-solutions', content: `a = a MEANS INFINITELY MANY SOLUTIONS — 2x + 6 = 2(x + 3) distributes to 2x + 6 = 2x + 6. Subtract 2x from both sides and the x is gone: 6 = 6. That is a true statement with no x in it, so it stays true no matter what x is. Why: the two sides were the same expression wearing different clothes, so any number you put in comes out equal on both sides. Test it: x = 1 gives 8 = 8, x = 10 gives 26 = 26, x = -3 gives 0 = 0. Every number works, so the equation has infinitely many solutions. An equation that is true for every value of the variable is called an identity.` },
    { loId: 'm8math.one-none-or-infinitely-many-solutions', content: `a = b MEANS NO SOLUTION — 2x + 6 = 2x + 5 has nothing to distribute, so subtract 2x from both sides right away: 6 = 5. That is a false statement with no x in it, so it stays false no matter what x is. Why: whatever x is, the left side is always exactly 1 more than the right side, so the two sides can never be equal. Test it: x = 4 gives 14 on the left and 13 on the right, x = 100 gives 206 and 205, x = -6 gives -6 and -7. Nothing works, so the equation has no solution.` },
    { loId: 'm8math.one-none-or-infinitely-many-solutions', kind: 'framework', title: 'The variable vanishing is not a mistake', content: `THE VARIABLE VANISHING IS NOT A MISTAKE — when 2x - 2x leaves nothing on either side, students think they broke the equation. They did not; the equation answered in a different way, and the job is to read what is left. A true leftover, such as 6 = 6 or 0 = 0, means infinitely many solutions. A false leftover, such as 6 = 5 or 0 = -7, means no solution. And 0 = 0 does NOT say x = 0; there is no x in it at all. One shortcut to see it coming: if the x terms on the two sides match after simplifying, the equation is either always true or never true, and if they differ, there is exactly one solution.` },
    { loId: 'm8math.one-none-or-infinitely-many-solutions', kind: 'definition', title: 'solution', content: `a value of the variable that makes the left side and the right side of an equation equal.` },
    { loId: 'm8math.one-none-or-infinitely-many-solutions', kind: 'definition', title: 'identity', content: `an equation that is true for every value of the variable, such as 2x + 6 = 2(x + 3); it has infinitely many solutions.` },
    { loId: 'm8math.one-none-or-infinitely-many-solutions', kind: 'definition', title: 'no solution', content: `the outcome when no value of the variable makes the two sides equal; the equation simplifies to a false statement such as 6 = 5.` },
    { loId: 'm8math.one-none-or-infinitely-many-solutions', kind: 'definition', title: 'infinitely many solutions', content: `the outcome when every value of the variable works; the equation simplifies to a true statement such as 6 = 6.` },
  ],
  methods: [
    {
      title: 'Worked always true never true',
      steps: [
        `Both equations start the same way, so the plan is the same: simplify each side, collect the variable terms, and read the shape that is left.`,
        `(a) Distribute on the right: 2(x + 3) = 2x + 6. The equation is now 2x + 6 = 2x + 6, and you can already see that the two sides are identical. Subtract 2x from both sides: 6 = 6.`,
        `(a) 6 = 6 is true, and there is no x in it, so nothing you choose for x can change it. Every number is a solution. Try a few to feel it: x = 1 gives 2(1) + 6 = 8 on the left and 2(1 + 3) = 8 on the right; x = -5 gives -10 + 6 = -4 on the left and 2(-5 + 3) = 2(-2) = -4 on the right. Infinitely many solutions, because the two sides are the same expression.`,
        '(b) There is nothing to distribute. Subtract 2x from both sides: 6 = 5.',
        `(b) 6 = 5 is false, and there is no x in it, so nothing you choose for x can rescue it. No number is a solution. Try a few: x = 1 gives 8 on the left and 7 on the right; x = -5 gives -4 on the left and -5 on the right. The left side is always exactly 1 bigger than the right side, so they can never match. No solution.`,
        `Read the two shapes side by side. The x term was 2x on both sides in both equations, so neither one could end with a single answer; the constants decided everything. Equal constants (6 and 6) made the equation always true, and different constants (6 and 5) made it never true.`,
      ],
      example: { problem: `Decide how many solutions each equation has, and explain why. (a) 2x + 6 = 2(x + 3). (b) 2x + 6 = 2x + 5.`, solution: `(a) infinitely many solutions, because both sides simplify to 2x + 6; (b) no solution, because 6 = 5 is false for every x` },
      relatedLoIds: ['m8math.one-none-or-infinitely-many-solutions'],
    },
    {
      title: 'Worked sort three equations',
      steps: [
        `(a) Distribute on the right: 5x - 3 = 2x + 12. The x terms are 5x and 2x, which are different, so expect exactly one solution. Subtract 2x from both sides: 3x - 3 = 12. Add 3 to both sides: 3x = 15. Divide both sides by 3: x = 5.`,
        `(a) Check in both sides of the original: 5(5) - 3 = 22, and 2(5 + 6) = 2(11) = 22. One solution, x = 5.`,
        `(b) Simplify the left: 3(x - 2) + 4 = 3x - 6 + 4 = 3x - 2. The equation is now 3x - 2 = 3x - 2, the same expression on both sides. Subtract 3x from both sides: -2 = -2, a true statement.`,
        `WRONG: adding 2 to both sides to get 0 = 0 and then announcing "x = 0, one solution." CORRECT: 0 = 0 has no x in it. It is a true statement about the numbers 0 and 0, and it stays true for every x, so the equation has infinitely many solutions. Testing shows x = 0 is only one of them: x = 0 gives 3(-2) + 4 = -2 and 3(0) - 2 = -2, and x = 5 gives 3(3) + 4 = 13 and 3(5) - 2 = 13. Both work, and so does every other number.`,
        `(c) Distribute on the right: 2(2x + 1) = 4x + 2, so the equation is 4x + 9 = 4x + 2. Subtract 4x from both sides: 9 = 2, a false statement.`,
        `WRONG: "moving" the 9 across to get 0 = -7 and then announcing "x = -7." CORRECT: 0 = -7 has no x in it either, and it is false, so no value of x makes 4x + 9 equal 4x + 2. Test x = -7 to watch it fail: 4(-7) + 9 = -19 and 2(2(-7) + 1) = 2(-13) = -26, not equal. The left side is always 7 more than the right side, whatever x is. No solution.`,
        `Line the three up. Different x terms (5x and 2x) gave one solution. Matching x terms with matching constants gave infinitely many. Matching x terms with different constants gave none.`,
      ],
      example: { problem: `Three equations from one homework sheet. Decide how many solutions each has. (a) 5x - 3 = 2(x + 6). (b) 3(x - 2) + 4 = 3x - 2. (c) 4x + 9 = 2(2x + 1).`, solution: '(a) one solution, x = 5; (b) infinitely many solutions; (c) no solution' },
      relatedLoIds: ['m8math.one-none-or-infinitely-many-solutions'],
    },
  ],
  pointers: [
    { content: `Students often say "x = 0, one solution (for 2(x + 4) = 2x + 8)" — Distributing gives 2x + 8 = 2x + 8, the same expression on both sides, and subtracting 2x and then 8 from both sides leaves 0 = 0. That is a true statement with no variable, so it is true for every x, not just x = 0. Test x = 3: 2(3 + 4) = 14 on the left and 2(3) + 8 = 14 on the right. Test x = -1: 2(-1 + 4) = 6 and 2(-1) + 8 = 6. The equation has infinitely many solutions, and x = 0 is only one of them.`, kind: 'common-error' },
    { content: `Students often say "x = 6 (for 6x - 5 = 6x + 1)" — Subtracting 6x from both sides leaves -5 = 1, which is already false, and adding 5 to both sides only rewrites it as 0 = 6, still false. Neither statement contains x, so no value of x can make it true; the left side of 6x - 5 = 6x + 1 is always 6 less than the right side. Test x = 6 to watch the claimed answer fail: 6(6) - 5 = 31 and 6(6) + 1 = 37, not equal. The equation has no solution.`, kind: 'common-error' },
    { content: `Simplify and collect until the equation reads x = a, a = a, or a = b. The shape you land on is the answer.`, kind: 'tip' },
    { content: `x = a means exactly one solution. Check it by substituting into both sides of the original equation.`, kind: 'tip' },
    { content: `a = a, such as 6 = 6 or 0 = 0, is true for every x: infinitely many solutions. Both sides were the same expression, as in 2x + 6 = 2(x + 3).`, kind: 'tip' },
    { content: `a = b, such as 6 = 5, is false for every x: no solution. The two sides stay a fixed distance apart, as in 2x + 6 = 2x + 5.`, kind: 'tip' },
    { content: `The variable vanishing is not a mistake. Read what is left: true means infinitely many, false means none, and 0 = 0 never means x = 0.`, kind: 'tip' },
    { content: `Matching x terms on both sides means always true or never true; different x terms mean exactly one solution.`, kind: 'tip' },
  ],
};
