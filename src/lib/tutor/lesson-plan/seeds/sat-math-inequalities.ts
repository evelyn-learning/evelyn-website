/**
 * SAT Math — Linear Inequalities and Absolute Value.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_MATH_INEQUALITIES: LessonPlan = {
  id: 'evelyn.testprep.sat-math.inequalities.v1',
  title: 'SAT Math — Linear Inequalities and Absolute Value',
  curriculum: 'CCSS',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'sat-math',
  locale: 'en',
  los: [{ id: 'satmath.inequalities', description: 'Solve linear inequalities, compound inequalities, and absolute-value inequalities on the SAT.', standard: 'CCSS.MATH.HSA.REI.B.3' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Inequalities are like equations — except for ONE rule that trips up most students.', script: 'Solve an inequality the same way as an equation, EXCEPT: when you multiply or divide by a NEGATIVE, FLIP the inequality sign. Forget that flip and you lose easy points.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Solving inequalities, sign flip, absolute value, compound inequalities.', keyIdeas: [
      'INEQUALITIES use <, >, ≤, ≥.',
      'Solve like an equation: add, subtract, multiply, divide.',
      'KEY RULE: when MULTIPLYING or DIVIDING by a NEGATIVE number, FLIP the inequality.',
      '  Example: −2x > 6 → divide by −2 → x < −3 (sign flipped).',
      'When multiplying/dividing by a positive: NO flip.',
      'COMPOUND inequality: 3 < x ≤ 7. Means x is between 3 and 7 (not including 3, including 7).',
      'ABSOLUTE VALUE inequality:',
      '  |x| < 5 → −5 < x < 5 (between).',
      '  |x| > 5 → x > 5 OR x < −5 (outside).',
      '  Memory: less than = "between"; greater than = "outside."',
      'WORD problems with inequalities:',
      '  "At least" → ≥. "At most" → ≤.',
      '  "More than" → >. "Less than" → <.',
      '  "No more than" → ≤. "No less than" → ≥.',
      'GRAPHING on number line:',
      '  Open circle for < or > (not included).',
      '  Closed circle for ≤ or ≥ (included).',
      '  Arrow toward all values that satisfy.',
      'SAT TRAP: "x < y" doesn\'t mean x is negative. It just means x is less than y. Don\'t add assumptions.',
    ], vocabulary: [{ term: 'absolute value', definition: 'distance from zero; |x| = |−x| = x for x ≥ 0.' }, { term: 'compound inequality', definition: 'two inequalities combined with AND/OR.' }], estimatedMinutes: 4 },
    { id: 'worked', kind: 'worked_example', problem: 'Solve: −3x + 7 ≥ 22.', steps: [
      'Subtract 7 from both sides: −3x ≥ 15.',
      'Divide both sides by −3. SIGN FLIPS: x ≤ −5.',
      'Check: x = −5 → −3(−5) + 7 = 15 + 7 = 22 ≥ 22 ✓ (boundary).',
      'Check x = −10: −3(−10) + 7 = 37 ≥ 22 ✓.',
      'Answer: x ≤ −5.',
    ], answer: 'x ≤ −5', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Solve: |2x − 4| < 6.', expectedAnswer: '|2x − 4| < 6 means −6 < 2x − 4 < 6. Add 4: −2 < 2x < 10. Divide by 2: −1 < x < 5.', responseFormat: 'free', hints: ['|expr| < n means −n < expr < n.', 'Then solve for x in the middle.'], estimatedMinutes: 3 },
    { id: 'misconception-flip', kind: 'misconception_check', question: 'A student writes: −2x > 8 → x > −4. What\'s wrong?', commonErrors: [{ answer: 'x > −4', misconception: 'Forgetting to flip when dividing by a negative.', correctsTo: 'When dividing by −2 (negative), FLIP the inequality. So −2x > 8 → x < −4 (with sign flipped). The original student got x > −4, which would mean x = 0 satisfies −2(0) = 0 > 8 — false. Correct answer x < −4 satisfies the original (e.g., x = −5: −2(−5) = 10 > 8 ✓).' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Solve like equations EXCEPT flip when × or ÷ by negative.', '|x| < n → between. |x| > n → outside.', '"At least" → ≥. "At most" → ≤.', 'Open circle for strict, closed for inclusive.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
