/**
 * Algebra 1 — Inequalities: Compound Inequalities (AND vs OR).
 *
 * Two simple inequalities joined into one statement (CCSS A-REI.B.3):
 * AND keeps only the overlap, OR keeps everything either piece covers.
 * Includes the three-part form (−3 < 2x + 1 ≤ 7) where every move must
 * hit all three parts, and the graphing conventions that make the
 * difference visible. Absolute-value inequalities are the next stop, and
 * they are nothing but compound inequalities in disguise.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U3_COMPOUND_INEQUALITIES: LessonPlan = {
  id: 'evelyn.hs.alg1.compound-inequalities.v1',
  title: 'Compound Inequalities',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.compound-inequalities',
      standard: 'ALG1-3.2',
      description:
        'Solve compound inequalities joined by AND (intersection) or OR (union), including three-part inequalities solved on all three parts, and graph the solution sets on a number line (CCSS A-REI.B.3).',
    },
  ],
  prerequisites: ['alg1.one-variable-inequalities'],
  followUps: ['alg1.absolute-value'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame AND and OR as the everyday language of ranges — two conditions at once versus either condition.',
      script:
        'Real conditions almost never come one at a time. A roller coaster says you must be at least 48 inches AND under 76 inches — both, at the same time, so the answer is a band. A discount says you qualify if you are under 12 OR 65 and over — either one is enough, so the answer is two separate chunks with a gap in the middle. Same two words, AND and OR, decide the shape of every solution you will graph today.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-and-or',
      kind: 'concept',
      goal: 'AND as intersection, OR as union, the three-part shorthand, and what each looks like on a number line.',
      keyIdeas: [
        'A COMPOUND INEQUALITY is two inequalities joined by AND or OR. Solve each piece separately first — the joining word only decides what you do with the two answers.',
        'AND = INTERSECTION — keep only the values that satisfy BOTH pieces. x > 2 AND x < 7 keeps the overlap: 2 < x < 7, a band between two boundaries.',
        'OR = UNION — keep every value that satisfies EITHER piece. x < −1 OR x > 5 keeps both outer rays; the numbers in between are not solutions.',
        'THREE-PART FORM — an AND whose pieces share a middle can be written once: 2 < x < 7. Read it left to right, smallest to largest. Only AND is ever written this way; an OR must stay as two statements.',
        'THE ALL-THREE RULE — whatever you do to a three-part inequality, do it to all three parts. For −3 < 2x + 1 ≤ 7 you subtract 1 from the left, the middle AND the right.',
        'THE FLIP RULE STILL APPLIES — multiplying or dividing by a NEGATIVE flips every inequality sign in the statement, and a three-part inequality then reads backwards, so rewrite it smallest-to-largest.',
        'GRAPHING — open circle for < or >, closed circle for ≤ or ≥. AND shades the segment BETWEEN the two circles; OR shades two arrows pointing AWAY from each other.',
        'THE TWO EXTREME CASES — an AND whose pieces never overlap (x > 4 AND x < 3) has NO solution; an OR whose pieces cover everything (x < 4 OR x > 3) is ALL real numbers.',
      ],
      vocabulary: [
        { term: 'intersection', definition: 'the values shared by both solution sets — what AND keeps.' },
        { term: 'union', definition: 'the values in either solution set — what OR keeps.' },
      ],
      suggestedTools: ['show_equation', 'show_number_line'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-three-part',
      kind: 'worked_example',
      problem: 'Solve and graph: −3 < 2x + 1 ≤ 7',
      steps: [
        'This is an AND written in three-part form: 2x + 1 is greater than −3 and at the same time less than or equal to 7.',
        'Subtract 1 from ALL THREE parts: −4 < 2x ≤ 6.',
        'Divide ALL THREE parts by 2 (positive, so no flip): −2 < x ≤ 3.',
        'Graph: open circle at −2, closed circle at 3, shade the segment between them.',
        'Check the ends. x = 3: 2(3) + 1 = 7 and 7 ≤ 7 ✓ so 3 is in. x = −2: 2(−2) + 1 = −3 and −3 < −3 is false ✓ so −2 is out.',
      ],
      answer: '−2 < x ≤ 3',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-negative-flip',
      kind: 'worked_example',
      problem: 'Solve: 4 ≤ 10 − 2x < 16',
      steps: [
        'Subtract 10 from all three parts: −6 ≤ −2x < 6. (Subtracting never flips anything.)',
        'Divide all three parts by −2. Dividing by a NEGATIVE flips BOTH signs: 3 ≥ x > −3.',
        'That statement is true but written backwards. Rewrite it smallest to largest: −3 < x ≤ 3.',
        'Watch the endpoints travel with their signs: the ≤ that started on the left is now attached to the 3 on the right.',
        'Check x = 3: 10 − 2(3) = 4, and 4 ≤ 4 ✓. Check x = −3: 10 − 2(−3) = 16, and 16 < 16 is false ✓ so −3 is correctly excluded.',
      ],
      answer: '−3 < x ≤ 3',
      estimatedMinutes: 3,
    },
    {
      id: 'try-or-union',
      kind: 'try_yourself',
      problem: 'Solve: x − 4 ≥ 1 OR x + 2 < 0',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x < −2 or x ≥ 5', correct: true },
        { id: 'b', text: '−2 < x < 5' },
        { id: 'c', text: 'No solution — the two pieces never overlap' },
        { id: 'd', text: 'All real numbers' },
      ],
      expectedAnswer: 'x < −2 or x ≥ 5',
      hints: [
        'Solve each piece on its own: x − 4 ≥ 1 gives one ray, x + 2 < 0 gives another.',
        'x ≥ 5 and x < −2. OR keeps BOTH rays — do not look for an overlap.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-and-empty',
      kind: 'try_yourself',
      problem: 'Solve: 3x − 2 > 10 AND x + 5 < 8',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'No solution — the two pieces never overlap', correct: true },
        { id: 'b', text: '3 < x < 4' },
        { id: 'c', text: '4 < x < 3' },
        { id: 'd', text: 'x < 3 or x > 4' },
      ],
      expectedAnswer: 'No solution — the two pieces never overlap',
      hints: [
        'Solve each piece: 3x − 2 > 10 gives x > 4, and x + 5 < 8 gives x < 3.',
        'AND keeps only the overlap. Is there any number that is both bigger than 4 and smaller than 3?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'Solve −5 ≤ 3x − 2 < 13, then type as a number how many INTEGER values of x are in the solution set.',
      responseFormat: 'numeric',
      expectedAnswer: '6',
      hints: [
        'Add 2 to all three parts: −3 ≤ 3x < 15.',
        'Divide all three parts by 3: −1 ≤ x < 5. Count the integers, remembering that −1 is included and 5 is not.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-or-as-three-part',
      kind: 'misconception_check',
      question: 'A student solves a compound inequality, gets x < −2 OR x > 4, and writes the final answer as 4 < x < −2. A classmate solving −3 < 2x + 1 ≤ 7 subtracts 1 from the middle only and writes −3 < 2x ≤ 7. What went wrong in each?',
      commonErrors: [
        {
          answer: '4 < x < −2',
          misconception: 'Squeezing an OR into three-part notation, which is reserved for AND.',
          correctsTo:
            'Three-part notation means AND, so 4 < x < −2 claims x is bigger than 4 and smaller than −2 at once — impossible. An OR whose rays point away from each other must stay two statements: x < −2 or x > 4.',
        },
        {
          answer: '−3 < 2x ≤ 7',
          misconception: 'Treating the three-part form as one ordinary inequality where only the middle needs the work.',
          correctsTo:
            'Every operation hits all three parts: −3 − 1 < 2x + 1 − 1 ≤ 7 − 1 gives −4 < 2x ≤ 6, and dividing all three by 2 gives −2 < x ≤ 3.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Solve each piece separately; the joining word decides what happens next.',
        'AND keeps the overlap (a band, or nothing at all); OR keeps both pieces (two rays, or everything).',
        'Three-part form is AND only — do every operation to all three parts.',
        'Dividing or multiplying by a negative flips every sign, then rewrite smallest to largest.',
        'Graph: open circle for < or >, closed for ≤ or ≥; shade between for AND, outward for OR.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'Compound Inequalities' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
