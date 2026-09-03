/**
 * Grade 6 Math — Unit 8 CED 8.2: Solving One-Step Equations.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6math.solving-one-step-equations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6MATH_U8_SOLVING_ONE_STEP_EQUATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6math.solving-one-step-equations.v1',
  course: 'Grade 6 Math',
  cedUnit: 8,
  cedTopic: '8.2',
  cedTitle: 'Solving One-Step Equations',
  planId: 'evelyn.ms.m6math.solving-one-step-equations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6math.solving-one-step-equations.v1' }],
  theory: [
    { loId: 'm6math.solving-one-step-equations', content: `A ONE-STEP EQUATION HIDES ONE OPERATION ON x — in x + p = q, the number p is ADDED to x. In px = q, the number p is MULTIPLYING x. Before doing anything else, look at the equation and name which one it is.` },
    { loId: 'm6math.solving-one-step-equations', kind: 'framework', title: 'Undo with the true inverse', content: `UNDO WITH THE TRUE INVERSE — addition is undone by subtraction, and multiplication is undone by division. If p is added to x, subtract p from both sides. If p is multiplying x, divide both sides by p. Using the wrong inverse, such as subtracting a number that is actually multiplying x, does not isolate x at all.` },
    { loId: 'm6math.solving-one-step-equations', kind: 'framework', title: 'Whatever you do, do it to both sides', content: `WHATEVER YOU DO, DO IT TO BOTH SIDES — the equal sign means the two sides balance. Applying an operation to only one side breaks that balance, so every move happens on both sides at once.` },
    { loId: 'm6math.solving-one-step-equations', content: `p AND q CAN BE WHOLE NUMBERS, DECIMALS, OR FRACTIONS — the two moves above work no matter what kind of nonnegative number p and q are. 12x = 42 and x + 4.75 = 12.25 are solved with the exact same two-move method.` },
    { loId: 'm6math.solving-one-step-equations', kind: 'framework', title: 'Check every solution by substituting it back in', content: `CHECK EVERY SOLUTION BY SUBSTITUTING IT BACK IN — once x is isolated, put that value back into the ORIGINAL equation in place of x and compute both sides. If they come out equal, the solution is correct. If they do not, one of the two moves went wrong.` },
    { loId: 'm6math.solving-one-step-equations', kind: 'definition', title: 'inverse operation', content: `an operation that undoes another: subtraction undoes addition, and division undoes multiplication.` },
    { loId: 'm6math.solving-one-step-equations', kind: 'definition', title: 'coefficient', content: 'the number multiplying a variable, such as the 12 in 12x.' },
    { loId: 'm6math.solving-one-step-equations', kind: 'definition', title: 'isolate', content: 'to get the variable alone on one side of the equation, with a coefficient of 1.' },
  ],
  methods: [
    {
      title: 'Worked jayden wallet',
      steps: [
        `Turn the story into an equation. The gift is ADDED to what Jayden already had: x + 4.25 = 19.75.`,
        'Name the operation on x. The number 4.25 is added to x.',
        `The inverse of addition is subtraction, so subtract 4.25 from both sides: x + 4.25 - 4.25 = 19.75 - 4.25.`,
        'x = 15.50.',
        `Check by substituting 15.50 back into the ORIGINAL equation: 15.50 + 4.25 = 19.75. Both sides match, so x = 15.50 is correct.`,
      ],
      example: { problem: `Jayden had x dollars saved. His sister gave him $4.25 more, which brought his total to $19.75. Write an equation for x and solve it.`, solution: 'x = 15.50, so Jayden had $15.50 saved before the gift.' },
      relatedLoIds: ['m6math.solving-one-step-equations'],
    },
    {
      title: 'Worked bracelets price',
      steps: [
        `Turn the story into an equation. Four bracelets at the same price add up to $18: 4x = 18.`,
        'Name the operation on x. The number 4 is MULTIPLYING x, not added to it.',
        `The inverse of multiplication is division, so divide both sides by 4: 4x ÷ 4 = 18 ÷ 4.`,
        'x = 4.5.',
        `WRONG: subtracting 4 from both sides instead, because subtracting can feel like the natural way to remove a number sitting next to x. That gives 4x - 4 = 18 - 4, which is 4x = 14 — a different equation, not a solved one, since 4 was never added to x in the first place. CORRECT: 4 is multiplying x, so only division undoes it. Dividing both sides by 4 gives x = 4.5.`,
        `Check by substituting 4.5 back into the ORIGINAL equation: 4 × 4.5 = 18. Both sides match, so x = 4.5 is correct.`,
      ],
      example: { problem: `Four identical friendship bracelets cost $18 in total. Let x be the price of one bracelet. Write an equation for x and solve it.`, solution: 'x = 4.5, so one bracelet costs $4.50.' },
      relatedLoIds: ['m6math.solving-one-step-equations'],
    },
  ],
  pointers: [
    { content: `Students often say "x = 25" — The 5 in 5x means 5 times x, so the inverse operation is division, not subtraction. Divide both sides by 5: 5x ÷ 5 = 30 ÷ 5, so x = 6. Check by substituting back: 5 × 6 = 30, which matches.`, kind: 'common-error' },
    { content: `Students often say "y = 2.5" — The 8 in y + 8 is added to y, so the inverse operation is subtraction, not division. Subtract 8 from both sides: y + 8 - 8 = 20 - 8, so y = 12. Check by substituting back: 12 + 8 = 20, which matches.`, kind: 'common-error' },
    { content: `In x + p = q, the number p is added to x; undo it by subtracting p from both sides.`, kind: 'tip' },
    { content: 'In px = q, the number p is multiplying x; undo it by dividing both sides by p.', kind: 'tip' },
    { content: `Name the operation that is actually there before picking an inverse — addition needs subtraction, multiplication needs division, never the other way around.`, kind: 'tip' },
    { content: 'Apply every move to both sides, so the equation stays balanced.', kind: 'tip' },
    { content: 'Check every solution by substituting it back into the original equation.', kind: 'tip' },
    { content: `p, q, and the solution can be whole numbers, decimals, or fractions — the same two moves work every time.`, kind: 'tip' },
    { content: `Look at the NUMBER NEXT TO x FIRST. If it's added (like x + 5), subtract. If it's multiplying (like 5x), divide. Picking the wrong inverse means x stays stuck in the equation.`, kind: 'common-error' },
    { content: `In 5x, the 5 is NOT added to x — it's multiplying x. Writing it as '5 + x' or treating it like addition will break your solution.`, kind: 'vocab-note' },
    { content: `Always substitute your answer back into the ORIGINAL equation, not a rewritten version. If both sides don't match exactly, the solution is wrong — backtrack and find your error.`, kind: 'tip' },
    { content: `Do the same operation to BOTH sides at the exact same time. Forgetting one side or doing it on different steps breaks the balance and creates a new, wrong equation.`, kind: 'gotcha' },
    { content: `If x is already isolated (like x = 12), STOP — that's your answer. Don't subtract or divide again just because a number is sitting on the right side.`, kind: 'edge-case' },
    { content: `Decimals and fractions work exactly the same way as whole numbers. 2.5x = 10 and 1/2 x = 5 are solved by dividing both sides, just like 2x = 10.`, kind: 'vocab-note' },
    { content: `Don't confuse the coefficient (the 12 in 12x) with the answer. After you divide, 12 is gone — it's not part of your solution.`, kind: 'common-error' },
  ],
};
