/**
 * Algebra 1 — Inequalities: Absolute-Value Equations & Inequalities.
 *
 * The distance idea (CCSS A-REI.B.3 extension): |x| measures how far x sits
 * from zero, so |ax + b| = c splits into two cases, |expr| < c collapses to
 * an AND band, and |expr| > c opens into an OR pair of rays. Tolerance,
 * error margins, and "within" language all live here.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U3_ABSOLUTE_VALUE: LessonPlan = {
  id: 'evelyn.hs.alg1.absolute-value.v1',
  title: 'Absolute-Value Equations & Inequalities',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.absolute-value',
      standard: 'ALG1-3.3',
      description:
        'Solve absolute-value equations and inequalities by reading |x| as distance — splitting |ax + b| = c into two cases, recognizing the no-solution case when c is negative, and rewriting |expr| < c as an AND compound inequality and |expr| > c as an OR (CCSS A-REI.B.3, A-CED.A.1).',
    },
  ],
  prerequisites: ['alg1.compound-inequalities'],
  followUps: ['alg1.relations-functions'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame absolute value as distance by way of real tolerance language — "within 8 mL", "no more than 3 degrees off".',
      script:
        'A bottling line is supposed to pour 500 mL. Nothing pours exactly 500 mL, so the spec says: within 8 mL. Too much or too little, same problem — what matters is the DISTANCE from 500, not the direction. That single sentence is an absolute-value inequality, and once you can read the bars as distance, every equation and inequality in this lesson becomes two ordinary problems you already know how to solve.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-distance',
      kind: 'concept',
      goal: 'Absolute value as distance, the two-case split, the no-solution case, and why < becomes AND while > becomes OR.',
      keyIdeas: [
        'ABSOLUTE VALUE IS DISTANCE — |x| is how far x sits from 0 on the number line, so it is never negative. Read |x − 5| as "the distance between x and 5" and |x + 5| as "the distance between x and −5", since x + 5 = x − (−5).',
        'THE TWO-CASE SPLIT — for c > 0, |ax + b| = c becomes ax + b = c OR ax + b = −c. Two answers, because exactly two points on a number line sit c units from a given spot: one on each side.',
        'ISOLATE FIRST — strip everything off the bars before splitting. For 2|x − 1| + 5 = 13, subtract 5 and divide by 2 to reach |x − 1| = 4, THEN split. Splitting while a coefficient or constant still clings to the bars is the most common wrecking error.',
        'THE EDGE CASES — |expr| = 0 has exactly ONE solution (distance zero means the inside is zero). |expr| = a negative number has NO SOLUTION, because a distance can never be negative. Check the sign of the right side before you write any cases.',
        'LESS THAN → AND (a band) — |ax + b| < c means "within c units", so −c < ax + b < c. Solve the three-part inequality all at once; the answer is one connected interval like −2 < x < 8.',
        'GREATER THAN → OR (two rays) — |ax + b| > c means "farther than c units away", so ax + b > c OR ax + b < −c. Note the flipped sign on the negative branch. The answer is two separate pieces and can never be squeezed into one double inequality.',
        'SANITY CHECK BY TESTING — pick any number from your answer region and any number outside it, and plug both into the original. A band answer should fail on the outside; an OR answer should fail in the middle.',
      ],
      vocabulary: [
        { term: 'absolute value', definition: 'the distance of a number from zero on the number line — always zero or positive.' },
        { term: 'tolerance', definition: 'the largest acceptable distance a measurement may fall from its target value.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-two-cases',
      kind: 'worked_example',
      problem: 'Solve: |2x + 3| = 9',
      steps: [
        'The absolute value is already alone, and 9 is positive, so the split is valid.',
        'Case 1 — the inside equals 9: 2x + 3 = 9 → 2x = 6 → x = 3.',
        'Case 2 — the inside equals −9: 2x + 3 = −9 → 2x = −12 → x = −6.',
        'Check both: |2(3) + 3| = |9| = 9 ✓ and |2(−6) + 3| = |−9| = 9 ✓.',
      ],
      answer: 'x = 3 or x = −6',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-isolate-or',
      kind: 'worked_example',
      problem: 'Solve: 3|x − 1| − 2 > 7',
      steps: [
        'Isolate the absolute value BEFORE splitting: add 2 to both sides → 3|x − 1| > 9, then divide by 3 → |x − 1| > 3.',
        'Read it as distance: the distance from x to 1 is more than 3 units. That is two rays, so this is an OR.',
        'Branch 1: x − 1 > 3 → x > 4. Branch 2: x − 1 < −3 (sign flips on the negative branch) → x < −2.',
        'Answer: x > 4 or x < −2. Test x = 5: 3|4| − 2 = 10 > 7 ✓. Test x = 0 (in the middle): 3|−1| − 2 = 1, not greater than 7 ✓ correctly excluded.',
      ],
      answer: 'x > 4 or x < −2',
      estimatedMinutes: 3,
    },
    {
      id: 'try-and-band',
      kind: 'try_yourself',
      problem: 'Solve for x: |x − 3| < 5',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '−2 < x < 8', correct: true },
        { id: 'b', text: 'x < −2 or x > 8' },
        { id: 'c', text: '−8 < x < 2' },
        { id: 'd', text: 'x < 8' },
      ],
      expectedAnswer: '−2 < x < 8',
      hints: [
        'Less than means "within" — write it as the three-part statement −5 < x − 3 < 5.',
        'Add 3 to all three parts of −5 < x − 3 < 5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-no-solution',
      kind: 'try_yourself',
      problem: 'How many solutions does |4x + 7| + 5 = 2 have?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Exactly one' },
        { id: 'b', text: 'Exactly two' },
        { id: 'c', text: 'None', correct: true },
        { id: 'd', text: 'Infinitely many' },
      ],
      expectedAnswer: 'None',
      hints: [
        'Isolate the absolute value first — subtract 5 from both sides.',
        'That leaves |4x + 7| = −3. Can a distance ever come out negative?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'A bottling machine targets 500 mL, and a bottle passes inspection when |v − 500| ≤ 8, where v is the volume in mL. What is the smallest volume, in mL, that still passes? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '492',
      hints: [
        'A ≤ inequality is an AND: rewrite it as −8 ≤ v − 500 ≤ 8.',
        'Add 500 to all three parts to get the full range of passing volumes.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-or-vs-and',
      kind: 'misconception_check',
      question: 'A student writes the solution of |x − 2| > 5 as the double inequality −5 < x − 2 < 5, and separately solves |x + 1| = −4 by splitting into x + 1 = −4 and x + 1 = 4. What went wrong in each?',
      commonErrors: [
        {
          answer: '−5 < x − 2 < 5, i.e. −3 < x < 7',
          misconception: 'Using the AND band for a GREATER-THAN inequality — treating every absolute-value inequality as one three-part statement.',
          correctsTo: '"Greater than" means FARTHER than 5 units from 2, which is two rays, not a band: x − 2 > 5 OR x − 2 < −5, so x > 7 or x < −3. The band −3 < x < 7 is exactly the set of values that FAIL. Test x = 0: |0 − 2| = 2, which is not greater than 5.',
        },
        {
          answer: 'x = −5 or x = 3',
          misconception: 'Splitting into two cases without first checking the sign of the right-hand side.',
          correctsTo: 'An absolute value is a distance, so it can never equal −4. Check the sign before splitting: |x + 1| = −4 has NO SOLUTION. The two-case split is only valid when the right side is zero or positive.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '|x| is distance from zero, so it is never negative — read |x − 5| as "how far x is from 5".',
        'Isolate the absolute value first, then split |ax + b| = c into ax + b = c OR ax + b = −c (valid only when c ≥ 0).',
        'A negative right side means NO SOLUTION; a right side of 0 means exactly one solution.',
        '|expr| < c is an AND band: −c < expr < c. |expr| > c is an OR pair: expr > c or expr < −c.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'Absolute-Value Equations & Inequalities' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
