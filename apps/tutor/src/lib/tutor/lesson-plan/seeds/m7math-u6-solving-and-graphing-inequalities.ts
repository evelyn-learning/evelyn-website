/**
 * Grade 7 Math — Equations & Inequalities: Solving & Graphing Inequalities.
 *
 * Everything from 6.1 and 6.2 carries over unchanged (CCSS 7.EE.B.4b) with
 * exactly ONE new rule: multiplying or dividing both sides by a negative
 * REVERSES the inequality symbol. That rule is the spine of this plan — it
 * appears in the keyIdeas, in a worked example, and in the misconception
 * check. The second half is the number-line picture: open circle for the
 * strict symbols, closed circle for the inclusive ones, and shading read off
 * the FINAL line rather than the original problem.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7MATH_U6_SOLVING_AND_GRAPHING_INEQUALITIES: LessonPlan = {
  id: 'evelyn.ms.m7math.solving-and-graphing-inequalities.v1',
  title: 'Solving & Graphing Inequalities',
  curriculum: 'MS',
  grade: '7',
  subject: 'math',
  topic: 'grade-7-math',
  locale: 'en',
  los: [
    {
      id: 'm7math.solving-and-graphing-inequalities',
      standard: 'M7MATH-6.4',
      description:
        'Solve one- and two-step inequalities of the form px + q > r, reversing the symbol when multiplying or dividing by a negative, and graph the solution set on a number line (CCSS 7.EE.B.4b, 7.EE.B.3).',
    },
  ],
  prerequisites: ['m7math.writing-equations-from-word-problems'],
  followUps: ['m7math.angle-relationships'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that an inequality answers a real question that an equation cannot: how many fit, not exactly how many.',
      script:
        'You saved up 20 dollars and card packs cost 4 dollars each. How many can you buy? An equation would answer exactly 5. But that is not really the question, is it? You could buy 5 packs, or 3, or 1, or none. What you actually know is that you cannot buy MORE than 5. The answer is a whole range of numbers, and the math for a range is called an inequality. The good news is that you already know how to solve one, because it works exactly like an equation. There is one new rule, and it is the strangest rule in this unit.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-flip-rule-and-graphing',
      kind: 'concept',
      goal: 'Establish the four symbols, the solve-like-an-equation routine, the flip rule with its reason, and the number-line picture.',
      keyIdeas: [
        'FOUR SYMBOLS, TWO FAMILIES — the strict symbols are < (less than) and > (greater than). The inclusive symbols are ≤ (less than or equal to) and ≥ (greater than or equal to). An inequality usually has infinitely many solutions, so the answer looks like x < 5 rather than x = 5.',
        'SOLVE IT EXACTLY LIKE AN EQUATION — undo addition and subtraction first, then undo multiplication and division, and do every move to BOTH sides. Nothing about that routine changes.',
        'THE ONE EXCEPTION, THE FLIP RULE — when you multiply or divide BOTH sides by a NEGATIVE number, you must REVERSE the inequality symbol. So −3x > 15 becomes x < −5, with the symbol turned around. Forget the flip and the answer describes the exact wrong half of the number line.',
        'WHY IT FLIPS — start with something true, like 2 < 5. Now multiply both sides by −1, giving −2 and −5. But −2 is GREATER than −5, because −2 sits further right on the number line. The numbers swapped places, so the symbol has to swap too or the statement becomes false.',
        'WHEN NOT TO FLIP — adding or subtracting never flips, not even when the number is negative. Multiplying or dividing by a POSITIVE never flips. The symbol turns around only for a negative multiplier or divisor, and at no other moment.',
        'GRAPHING ON A NUMBER LINE — mark the boundary number, then decide the circle and the shading. Strict symbols < and > get an OPEN circle, because the boundary itself is not a solution. Inclusive symbols ≤ and ≥ get a CLOSED, filled-in circle, because the boundary counts. Then shade the side named by your FINAL line, with x on the left: x < 4 shades left, x > 4 shades right. Never read the shading direction off the original problem, because the symbol may have flipped along the way.',
      ],
      vocabulary: [
        { term: 'inequality', definition: 'a statement that one expression is less than or greater than another, using <, >, ≤, or ≥.' },
        { term: 'solution set', definition: 'all the values of the variable that make the inequality true, usually infinitely many.' },
        { term: 'boundary', definition: 'the number where the solution set starts or stops; included for ≤ and ≥, excluded for < and >.' },
      ],
      suggestedTools: ['show_equation', 'show_number_line'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-no-flip',
      kind: 'worked_example',
      problem: 'Solve and graph: 3x + 4 ≤ 19',
      steps: [
        'Undo the +4 first. Subtract 4 from both sides: 3x ≤ 15. Subtracting never flips anything, so the symbol stays as ≤.',
        'Now divide both sides by 3. Three is positive, so again there is no flip: x ≤ 5.',
        'Graph it. Put a CLOSED, filled circle on 5, because ≤ means 5 itself is allowed. Then shade everything to the LEFT of 5, toward the smaller numbers.',
        'Sense-check with a number INSIDE the shading, x = 5: 3(5) + 4 = 19, and 19 ≤ 19 is true.',
        'Sense-check with a number OUTSIDE it, x = 6: 3(6) + 4 = 22, and 22 ≤ 19 is false. Inside works, outside fails, so the answer is right.',
      ],
      answer: 'x ≤ 5, with a closed circle at 5 and shading to the left',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-flip-rule',
      kind: 'worked_example',
      problem: 'Solve and graph: 6 − 2x > 14',
      steps: [
        'The variable term is −2x, minus sign included. Undo the 6 first by subtracting 6 from both sides: −2x > 8. The symbol does NOT flip here, because subtracting is not multiplying or dividing.',
        'Now divide both sides by −2. This is the flip step: dividing by a negative reverses the symbol, so > becomes <.',
        '8 divided by −2 is −4, so the answer is x < −4. WRONG answer to avoid: x > −4, which comes from skipping the flip. RIGHT answer: x < −4.',
        'Graph it. OPEN circle at −4, because > and < are strict and the boundary is not included. Shade to the LEFT, which is what the final line x < −4 says. Do not shade right just because the original problem showed a > symbol.',
        'Sense-check inside the shading, x = −5: 6 − 2(−5) = 6 + 10 = 16, and 16 > 14 is true.',
        'Sense-check outside it, x = 0: 6 − 2(0) = 6, and 6 > 14 is false. The flip was necessary, and the check proves it.',
      ],
      answer: 'x < −4, with an open circle at −4 and shading to the left',
      estimatedMinutes: 3,
    },
    {
      id: 'try-flip',
      kind: 'try_yourself',
      problem: 'Solve for x: −5x < 20',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x < −4' },
        { id: 'b', text: 'x > 4' },
        { id: 'c', text: 'x < 4' },
        { id: 'd', text: 'x > −4', correct: true },
      ],
      expectedAnswer: 'x > −4',
      hints: [
        'Divide both sides by −5. That divisor is negative, so something has to happen to the symbol.',
        'Test numbers against the original. x = 0 gives −5(0) = 0, and 0 < 20 is true, so 0 belongs in your answer. x = −5 gives −5(−5) = 25, and 25 < 20 is false, so −5 must be left out.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-graph',
      kind: 'try_yourself',
      problem: 'Which number-line picture shows the solution set of 2x − 3 > 5?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Closed circle at 4, shaded right' },
        { id: 'b', text: 'Open circle at 8, shaded right' },
        { id: 'c', text: 'Open circle at 4, shaded right', correct: true },
        { id: 'd', text: 'Open circle at 4, shaded left' },
      ],
      expectedAnswer: 'Open circle at 4, shaded right',
      hints: [
        'Solve first: add 3 to both sides, then divide by 2. The 2 is positive, so nothing flips.',
        'You end at x > 4. A strict symbol decides the kind of circle, and the final line decides which way to shade.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric-smallest-integer',
      kind: 'try_yourself',
      problem: 'What is the SMALLEST integer value of x that makes −4x ≤ 12 true? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '-3',
      hints: [
        'Divide both sides by −4 and reverse the symbol, because −4 is negative.',
        'You get x ≥ −3. Since ≥ includes the boundary, the boundary itself is the smallest value that works.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-missed-flip',
      kind: 'misconception_check',
      question: 'A student solves 10 − 4x < 2 by writing −4x < −8 and then x < 2. Test x = 1 in the original inequality. What went wrong?',
      commonErrors: [
        {
          answer: 'x < 2',
          misconception: 'Dividing both sides by −4 without reversing the symbol, because the arithmetic looked fine and the flip rule feels optional.',
          correctsTo: 'Dividing by a NEGATIVE reverses the symbol, so −4x < −8 gives x > 2, not x < 2. Test the student answer with x = 1: 10 − 4(1) = 6, and 6 < 2 is false, so 1 is not a solution at all. Test x = 3 instead: 10 − 4(3) = −2, and −2 < 2 is true. The correct solution set is x > 2, drawn with an open circle at 2 and shading to the right.',
        },
        {
          answer: 'Flip the symbol at the first step, because there is a minus sign in the problem',
          misconception: 'Over-applying the rule, flipping whenever any negative number is in sight instead of only when both sides are multiplied or divided by a negative.',
          correctsTo: 'Subtracting 10 from both sides is subtraction, so nothing flips: 10 − 4x < 2 becomes −4x < −8 with the symbol unchanged. The single flip happens later, at the divide-by-−4 step. Adding or subtracting a negative never flips anything.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An inequality has a whole range of solutions, and you solve it exactly like an equation.',
        'THE FLIP RULE: multiplying or dividing both sides by a NEGATIVE reverses the symbol, so −5x < 20 gives x > −4.',
        'Adding or subtracting never flips, and multiplying or dividing by a positive never flips.',
        'Open circle for < and >; closed, filled circle for ≤ and ≥.',
        'Shade the direction your FINAL line points, then test one number inside and one outside to be sure.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.4', cedTitle: 'Solving & Graphing Inequalities' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
