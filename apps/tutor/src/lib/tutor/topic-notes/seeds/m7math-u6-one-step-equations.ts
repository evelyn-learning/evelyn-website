/**
 * Grade 7 Math — Unit 6 CED 6.1: One-Step Equations.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7math.one-step-equations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7MATH_U6_ONE_STEP_EQUATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7math.one-step-equations.v1',
  course: 'Grade 7 Math',
  cedUnit: 6,
  cedTopic: '6.1',
  cedTitle: 'One-Step Equations',
  planId: 'evelyn.ms.m7math.one-step-equations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7math.one-step-equations.v1' }],
  theory: [
    { loId: 'm7math.one-step-equations', kind: 'framework', title: 'An equation is a claim that two things are equal', content: `AN EQUATION IS A CLAIM THAT TWO THINGS ARE EQUAL — the equals sign says the left side and the right side are the same value. An expression like 3x + 5 has no equals sign and cannot be solved. Once it becomes 3x + 5 = 20 there is a question to answer: which value of x makes that true?` },
    { loId: 'm7math.one-step-equations', kind: 'framework', title: 'To solve means to get the variable alone', content: `TO SOLVE MEANS TO GET THE VARIABLE ALONE — you want to end at x = something. Everything else that is stuck to x has to be peeled away, one operation at a time.` },
    { loId: 'm7math.one-step-equations', kind: 'framework', title: 'The golden rule', content: `THE GOLDEN RULE — whatever you do to one side, do the exact same thing to the other side. That keeps the two sides equal, the way the seesaw stays level. Doing something to only one side breaks the equation, and every answer after that is wrong.` },
    { loId: 'm7math.one-step-equations', kind: 'framework', title: 'Peel with the inverse operation', content: `PEEL WITH THE INVERSE OPERATION — addition and subtraction undo each other, and multiplication and division undo each other. Ask what is being done TO the variable, then do the opposite to both sides. So x + 5 = 12 needs subtract 5 and gives x = 7; x − 4 = 9 needs add 4 and gives x = 13; 3x = 21 needs divide by 3 and gives x = 7; x/4 = 5 needs multiply by 4 and gives x = 20.` },
    { loId: 'm7math.one-step-equations', kind: 'framework', title: 'The sign belongs to the number in front', content: `THE SIGN BELONGS TO THE NUMBER IN FRONT — in −6m the coefficient is −6, not 6, so you divide both sides by −6. And a fraction coefficient works the same way: two thirds of x means (2/3)x, so multiply both sides by 3 and then divide by 2. Nothing new, just a messier number to divide by.` },
    { loId: 'm7math.one-step-equations', kind: 'framework', title: 'Always check by substituting', content: `ALWAYS CHECK BY SUBSTITUTING — put your answer back into the ORIGINAL equation and work out both sides. If they match, you are right and you know it. If they do not match, you just caught your own mistake for free. This check is not extra credit; it is part of solving, every time.` },
    { loId: 'm7math.one-step-equations', kind: 'definition', title: 'equation', content: 'a statement that two expressions are equal, written with an equals sign.' },
    { loId: 'm7math.one-step-equations', kind: 'definition', title: 'solution', content: 'the value of the variable that makes the equation true.' },
    { loId: 'm7math.one-step-equations', kind: 'definition', title: 'inverse operation', content: `the operation that undoes another: subtraction undoes addition, division undoes multiplication.` },
    { loId: 'm7math.one-step-equations', kind: 'definition', title: 'coefficient', content: `the number multiplying the variable, sign included: in −6m the coefficient is −6.` },
  ],
  methods: [
    {
      title: 'Worked add to negative',
      steps: [
        `Ask what is being done to y. It has 9 added to it. The inverse of adding 9 is subtracting 9.`,
        'Subtract 9 from BOTH sides: y + 9 − 9 = 4 − 9.',
        `The left side becomes just y. The right side is 4 − 9, which is −5, because starting at 4 and going down nine steps lands five below zero.`,
        `So y = −5. A negative answer is completely normal here, and it is not a sign that something went wrong.`,
        `Check in the original equation: −5 + 9 = 4. The left side is 4 and the right side is 4, so they match. The answer holds.`,
      ],
      example: { problem: 'Solve: y + 9 = 4', solution: 'y = −5' },
      relatedLoIds: ['m7math.one-step-equations'],
    },
    {
      title: 'Worked negative and fraction',
      steps: [
        `Part (a): m is being multiplied by −6, so the inverse is dividing by −6. Divide BOTH sides: −6m ÷ (−6) = 42 ÷ (−6).`,
        `A positive divided by a negative is negative, so m = −7. WRONG answer to avoid: m = 7, which comes from dividing by 6 and leaving the minus sign behind. RIGHT answer: m = −7.`,
        `Check part (a): −6(−7) = 42. A negative times a negative is positive, so both sides are 42. It holds.`,
        `Part (b): w is being divided by 4, so the inverse is multiplying by 4. Multiply BOTH sides: (w/4) × 4 = −3 × 4.`,
        'The left side becomes w, and the right side is −12. So w = −12.',
        'Check part (b): −12/4 = −3. Both sides are −3, so it holds.',
      ],
      example: { problem: 'Solve each one: (a) −6m = 42, (b) w/4 = −3', solution: '(a) m = −7, (b) w = −12' },
      relatedLoIds: ['m7math.one-step-equations'],
    },
  ],
  pointers: [
    { content: `Students often say "x = 4" — Subtraction is undone by ADDITION. Add 6 to both sides: x − 6 + 6 = 10 + 6, so x = 16. The substitution check catches the error instantly: 4 − 6 = −2, which is not 10, while 16 − 6 = 10 matches. Always ask what is being done to the variable, then do the OPPOSITE.`, kind: 'common-error' },
    { content: `Students often say "x = 10" — A term never just disappears. The only way to remove −6 from the left side is to add 6, and adding 6 to the left means adding 6 to the right too. That gives x = 16, not 10. Check: 10 − 6 = 4, which is not 10, so x = 10 fails.`, kind: 'common-error' },
    { content: 'Solving means getting the variable alone on one side of the equals sign.', kind: 'tip' },
    { content: `Whatever you do to one side, do to the other side. That is what keeps the equation true.`, kind: 'tip' },
    { content: `Undo with the inverse: subtraction undoes addition, and division undoes multiplication.`, kind: 'tip' },
    { content: 'The sign travels with the coefficient, so −4x = 20 gives x = −5, not x = 5.', kind: 'tip' },
    { content: `Substitute your answer back into the original equation every time. If both sides match, you are done.`, kind: 'tip' },
    { content: `Ask "what is being done TO the variable?" then do the OPPOSITE. In x − 6 = 10 you ADD 6 to both sides (x = 16). Copying the same operation you see is the #1 error here.`, kind: 'common-error' },
    { content: `The minus sign is part of the coefficient. In −4x = 20 you divide by −4, not by 4, so x = −5. Leaving the minus behind gives x = 5, which fails the check.`, kind: 'gotcha' },
    { content: `A negative answer is not a mistake. y + 9 = 4 gives y = −5, and the check works: −5 + 9 = 4. Don't "fix" a negative solution by flipping it to positive.`, kind: 'edge-case' },
    { content: `Substitute into the ORIGINAL equation, not a line you rewrote. If you made an error partway down, checking against your own wrong line will look correct.`, kind: 'tip' },
    { content: `An expression has no equals sign, so it can't be solved — only simplified. 3x + 5 is an expression; 3x + 5 = 20 is an equation with a solution. Don't write "= " answers for expressions.`, kind: 'vocab-note' },
    { content: `x/4 = −3 means x is DIVIDED by 4, so multiply both sides by 4: x = −12. Don't divide again out of habit — check which operation is actually attached to the variable.`, kind: 'common-error' },
    { content: `A fraction coefficient is just a messier number. (2/3)x = 10: multiply both sides by 3 to get 2x = 30, then divide by 2 to get x = 15. Don't multiply by 2 and divide by 3 — that undoes it backwards.`, kind: 'edge-case' },
    { content: `Do the SAME thing to BOTH sides, in full. Writing x + 5 − 5 = 12 with no change on the right breaks the equality and every step after it is wrong.`, kind: 'gotcha' },
  ],
};
