/**
 * Algebra 1 — Linear Equations: Literal Equations & Rearranging Formulas.
 *
 * Solving a formula for a chosen letter (CCSS A-CED.A.4): every other letter
 * is just a number you do not know yet. This is the skill that turns d = rt
 * into t = d/r, and it is how science classes, spreadsheets, and the
 * slope-intercept work later in the course all rearrange their formulas.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U2_LITERAL_EQUATIONS: LessonPlan = {
  id: 'evelyn.hs.alg1.literal-equations.v1',
  title: 'Literal Equations & Rearranging Formulas',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.literal-equations',
      standard: 'ALG1-2.3',
      description:
        'Rearrange formulas to solve for a chosen variable, treating the other letters as constants, including dividing by a variable factor and factoring out a target that appears twice (CCSS A-CED.A.4, A-REI.B.3).',
    },
  ],
  prerequisites: ['alg1.multi-step-equations'],
  followUps: ['alg1.proportions-percents'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame rearranging a formula as the move that makes any formula answer the question YOU are asking.',
      script:
        'A road sign says a city is 315 miles away and your car holds 70 miles per hour. The formula you memorized is distance equals rate times time — but you do not want distance, you want time. Rather than memorize a second formula, rearrange the one you have: t = d/r. Today you learn to solve any formula for any letter in it, which is exactly what physics, chemistry, and every spreadsheet you will ever build ask you to do.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rearranging',
      kind: 'concept',
      goal: 'Solving for a letter uses the same inverse-operation routine as solving for x — the only new idea is that the other letters behave like numbers.',
      keyIdeas: [
        'SAME RULES, NEW GOAL — a literal equation is an equation with several letters. Solving for one of them means getting it alone on one side; every move is still "do the same thing to both sides."',
        'TREAT THE OTHER LETTERS AS NUMBERS — in P = 2l + 2w solved for w, pretend l is 7 and P is 40. Whatever you would do to those numbers, do to the letters instead. The answer just stays in letter form.',
        'THE ROUTINE — 1) get every term containing your target on one side, 2) combine or factor so the target appears once, 3) divide both sides by whatever is multiplying the target.',
        'DIVIDING BY A VARIABLE FACTOR IS FINE — from A = bh, dividing both sides by b gives h = A/b. You do not need to know what b is; you only need it to be nonzero, which is why textbooks say "b ≠ 0."',
        'TARGET APPEARS TWICE → FACTOR — for A = P + Prt, the P is in two terms, so factor: A = P(1 + rt), then divide by the whole factor to get P = A/(1 + rt).',
        'FRACTION COEFFICIENTS — multiply by the reciprocal, not by the fraction. From A = (1/2)bh, multiply both sides by 2 first: 2A = bh, so h = 2A/b.',
        'CLASSIC ERROR — DIVIDING ONLY ONE TERM: from P = 2l + 2w you cannot "cancel" the 2 off just one term. Either subtract 2l first, or divide EVERY term: P/2 = l + w.',
        'CHECK YOUR REARRANGEMENT by plugging real numbers into both the original and your rearranged version — if they disagree, the algebra slipped.',
      ],
      vocabulary: [
        { term: 'literal equation', definition: 'an equation written mostly with letters, such as a formula like d = rt.' },
        { term: 'isolate', definition: 'to get the target variable alone on one side of the equal sign.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-perimeter',
      kind: 'worked_example',
      problem: 'The perimeter of a rectangle is P = 2l + 2w. Solve for w.',
      steps: [
        'The target is w. It sits inside the term 2w, and the 2l term is in the way.',
        'Subtract 2l from both sides: P − 2l = 2w.',
        'Divide both sides — the WHOLE side, not one term — by 2: (P − 2l)/2 = w.',
        'So w = (P − 2l)/2. Check with numbers: if P = 40 and l = 12, then w = (40 − 24)/2 = 8, and 2(12) + 2(8) = 40. ✓',
      ],
      answer: 'w = (P − 2l)/2',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-factor-out',
      kind: 'worked_example',
      problem: 'Simple interest gives the final amount A = P + Prt. Solve for P.',
      steps: [
        'The target P shows up in TWO terms, so you cannot divide it away yet — first make it appear once.',
        'Factor P out of the right side: A = P(1 + rt). Both terms had a P, and P + Prt = P(1 + rt).',
        'Now P is multiplied by the single factor (1 + rt), so divide both sides by that whole factor: A/(1 + rt) = P.',
        'So P = A/(1 + rt). Check with numbers: if r = 0.05 and t = 4, then 1 + rt = 1.2; starting from P = 1050 the original gives A = 1050 + 1050(0.2) = 1260, and 1260/1.2 = 1050. ✓',
        'Watch the trap: dividing A = P + Prt by P first would give A/P = 1 + rt, which still hides P on the left — factoring is the move.',
      ],
      answer: 'P = A/(1 + rt)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-distance',
      kind: 'try_yourself',
      problem: 'Solve the distance formula d = rt for t.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 't = d/r', correct: true },
        { id: 'b', text: 't = r/d' },
        { id: 'c', text: 't = dr' },
        { id: 'd', text: 't = d − r' },
      ],
      expectedAnswer: 't = d/r',
      hints: ['t is being multiplied by r, so undo multiplication.', 'Divide both sides by r — the r cancels on the right.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-temperature',
      kind: 'try_yourself',
      problem: 'The Fahrenheit-to-Celsius formula is F = (9/5)C + 32. Solve for C.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'C = (5/9)(F − 32)', correct: true },
        { id: 'b', text: 'C = (5/9)F − 32' },
        { id: 'c', text: 'C = (9/5)(F − 32)' },
        { id: 'd', text: 'C = (5/9)(F + 32)' },
      ],
      expectedAnswer: 'C = (5/9)(F − 32)',
      hints: [
        'Undo in reverse order: the +32 happened last, so subtract it first.',
        'After F − 32 = (9/5)C, multiply BOTH sides by the reciprocal 5/9 — the whole side, so keep the parentheses.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Rearranging A = P + Prt for P gives P = A/(1 + rt). Use it to find P when A = 1260, r = 0.05, and t = 4. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '1050',
      hints: ['Evaluate the denominator first: 1 + (0.05)(4).', '1 + 0.2 = 1.2, so P = 1260/1.2.'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-half-coefficient',
      kind: 'misconception_check',
      question: 'A student solves the triangle-area formula A = (1/2)bh for h and writes h = A/(2b). What went wrong?',
      commonErrors: [
        {
          answer: 'h = A/(2b)',
          misconception:
            'Seeing the 2 in the fraction 1/2 and moving it to the denominator, as if dividing by 1/2 were the same as dividing by 2.',
          correctsTo:
            'Undo a multiplication by 1/2 by multiplying both sides by 2: 2A = bh. Then divide by b to get h = 2A/b. Quick numeric check: A = 12 and b = 4 give h = 24/4 = 6, and (1/2)(4)(6) = 12. ✓',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Solving for a letter is the same routine as solving for x — every other letter acts like a number.',
        'Undo operations in reverse order, then divide by whatever multiplies the target, even if that is a variable.',
        'If the target appears in two terms, factor it out first, then divide by the whole factor.',
        'Never cancel off a single term: divide the ENTIRE side, or subtract the extra term first.',
        'Check any rearrangement by plugging real numbers into the original formula.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'Literal Equations & Rearranging Formulas' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
