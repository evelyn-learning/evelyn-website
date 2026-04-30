/**
 * G7 — Solving inequalities.
 *
 * Inequalities work like equations EXCEPT when you multiply or
 * divide by a negative — flip the sign. Number-line representation.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_MATH_INEQUALITIES: LessonPlan = {
  id: 'evelyn.g7.math.algebra.inequalities.v1',
  title: 'Solving and graphing inequalities',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'math',
  topic: 'algebra',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.7.ee.b.4.b',
      description: 'Solve word problems leading to inequalities of the form px + q > r and graph the solution.',
      standard: 'CCSS.MATH.CONTENT.7.EE.B.4.B',
    },
  ],
  prerequisites: ['ccss.math.7.ee.b.4.a'],
  followUps: ['ccss.math.hsa-rei.b.3'],
  estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show inequality as "many possible answers" not just one.',
      script: 'An equation like x + 3 = 10 has ONE answer: x = 7. But "x + 3 < 10" has many — x could be 6, 5, 4, 3, … any number less than 7. Inequalities open up a whole RANGE.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-symbols-and-flip',
      kind: 'concept',
      goal: 'Solve inequalities like equations, with one twist: flip the sign when multiplying or dividing by a negative.',
      keyIdeas: [
        'SYMBOLS: < (less than), > (greater than), ≤ (less than or equal), ≥ (greater than or equal).',
        'Solve like an equation — same operations on both sides.',
        '★ THE FLIP RULE: when you multiply or divide both sides by a NEGATIVE number, flip the inequality sign.',
        'Why flip? Multiplying by -1 reverses the order on the number line: 2 < 5, but -2 > -5.',
        'GRAPHING: open circle for < or >, closed circle for ≤ or ≥. Shade the part of the line that satisfies the inequality.',
      ],
      vocabulary: [
        { term: 'inequality', definition: 'a statement that two expressions are NOT equal — one is bigger.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-positive',
      kind: 'worked_example',
      problem: 'Solve and graph: 2x + 5 ≤ 13.',
      steps: [
        'Subtract 5 from both sides: 2x ≤ 8.',
        'Divide both sides by 2 (positive — no flip): x ≤ 4.',
        'Graph: closed circle on 4, shade everything to the LEFT.',
      ],
      answer: 'x ≤ 4',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-flip',
      kind: 'worked_example',
      problem: 'Solve and graph: -3x > 9.',
      steps: [
        'Divide both sides by -3 (NEGATIVE — flip the sign!): x < -3.',
        'Graph: open circle on -3, shade everything to the LEFT.',
        'Check with x = -5: -3(-5) = 15, and 15 > 9 ✓. Confirms.',
      ],
      answer: 'x < -3',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Solve: -2x + 4 < 12.',
      expectedAnswer: 'x > -4',
      responseFormat: 'free',
      hints: [
        'First subtract 4 from both sides: -2x < 8.',
        'Now divide by -2 — and remember to FLIP the sign.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-flip-anytime',
      kind: 'misconception_check',
      question: 'When you ADD a negative number to both sides, do you flip the inequality?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Flipping for any negative — adding, not just multiplying/dividing.',
          correctsTo: 'No — adding or subtracting (even of negatives) does NOT flip. Only MULTIPLY or DIVIDE by a negative flips the sign.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Inequalities solve like equations — with ONE exception.',
        'Multiplying or dividing by a NEGATIVE → FLIP the inequality sign.',
        'Open circle for strict (< or >), closed circle for inclusive (≤ or ≥).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Compound inequality: solve -3 < 2x + 1 ≤ 7. Graph the result.',
      hint: 'Treat both sides at once: subtract 1 from all three parts, then divide all three by 2.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
