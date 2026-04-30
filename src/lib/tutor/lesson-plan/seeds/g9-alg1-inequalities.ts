/**
 * G9 — Algebra 1: Linear inequalities (one-variable, including the
 * sign-flip rule when multiplying or dividing by a negative).
 *
 * Same isolate-the-variable rhythm as one- and two-step equations,
 * with one new wrinkle: multiplying or dividing both sides by a
 * NEGATIVE flips the inequality. Number-line graphs to visualize the
 * solution set; open vs closed circles for strict vs inclusive.
 */

import type { LessonPlan } from '../types';

export const SEED_G9_ALG1_INEQUALITIES: LessonPlan = {
  id: 'evelyn.g9.math.algebra.inequalities.v1',
  title: 'Solving Linear Inequalities',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'math',
  topic: 'inequalities',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsa.rei.b.3',
      description: 'Solve linear equations and inequalities in one variable.',
      standard: 'CCSS.MATH.CONTENT.HSA.REI.B.3',
    },
  ],
  prerequisites: ['ccss.math.7.ee.b.4'],
  followUps: ['ccss.math.hsa.rei.d.12'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a budget scenario where "at most" or "at least" is more natural than "equal to".',
      script: 'You have $50. You want to buy a few movie tickets at $8 each. How many can you buy? You don\'t need EXACTLY $50 worth — you need 8x ≤ 50, where x is how many tickets. The answer isn\'t one number; it\'s a RANGE. Solving inequalities tells you all the values that work.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-symbols-and-rules',
      kind: 'concept',
      goal: 'Inequality symbols, same balance rules as equations, the negative-flip exception.',
      keyIdeas: [
        'INEQUALITY SYMBOLS: < (less than), > (greater than), ≤ (less than or equal), ≥ (greater than or equal).',
        'Same isolate-the-variable strategy as equations: do the same thing to both sides, undo operations.',
        'EXCEPTION: when you multiply OR divide both sides by a NEGATIVE number, FLIP the inequality sign.',
        'Why? Negate both sides of "5 > 3" → "-5 < -3". The sign HAS to flip to stay true.',
        'Adding or subtracting (positive or negative): no flip. Multiplying or dividing by a POSITIVE: no flip. Only neg × or neg ÷ flips.',
        'NUMBER LINE GRAPH: shade the values that work.',
        '  Strict (< or >): OPEN circle on the boundary.',
        '  Inclusive (≤ or ≥): CLOSED (filled) circle on the boundary.',
      ],
      vocabulary: [
        { term: 'inequality', definition: 'a math statement that one side is less / greater than the other.' },
        { term: 'solution set', definition: 'all values of the variable that make the inequality true.' },
      ],
      suggestedTools: ['show_equation', 'show_number_line'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-no-flip',
      kind: 'worked_example',
      problem: 'Solve 3x + 7 < 22 and graph.',
      steps: [
        'Subtract 7 from both sides: 3x < 15.',
        'Divide both sides by 3 (positive — no flip): x < 5.',
        'Graph on number line: open circle at 5 (strict, not equal), shaded LEFT (less than).',
        'Solution: every number less than 5.',
      ],
      answer: 'x < 5',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-flip',
      kind: 'worked_example',
      problem: 'Solve -2x + 5 ≥ 11.',
      steps: [
        'Subtract 5 from both sides: -2x ≥ 6. (No flip — just subtraction.)',
        'Divide both sides by -2. NEGATIVE divisor → FLIP the inequality.',
        '-2x ÷ -2 = x. 6 ÷ -2 = -3. Sign flips ≥ → ≤.',
        'x ≤ -3.',
        'Sense-check x = -5: -2(-5) + 5 = 10 + 5 = 15 ≥ 11. ✓',
        'Sense-check x = 0: -2(0) + 5 = 5. NOT ≥ 11. So x = 0 should fail — and it does, since 0 is NOT ≤ -3. ✓',
      ],
      answer: 'x ≤ -3',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Solve 4x - 9 > 7.',
      expectedAnswer: 'x > 4',
      responseFormat: 'free',
      hints: [
        'Add 9 to both sides: 4x > 16.',
        'Divide by 4 (positive, no flip): x > 4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-no-flip-on-add',
      kind: 'misconception_check',
      question: 'Asha is solving x + 3 > 7 and flips the sign just because of the negative on the LEFT side. What\'s the rule, exactly?',
      commonErrors: [
        {
          answer: 'flip whenever there\'s any negative around',
          misconception: 'Over-applying the flip rule to ANY negative, instead of only when multiplying/dividing both sides by a negative.',
          correctsTo: 'Only flip when MULTIPLYING or DIVIDING both sides by a negative number. Adding or subtracting a negative (or anything else) does NOT flip. x + 3 > 7 → just subtract 3: x > 4. No flip needed.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Solve like an equation — same operation on both sides.',
        'EXCEPT: multiplying or dividing by a NEGATIVE flips the inequality.',
        'Adding / subtracting never flips. Multiplying or dividing by a POSITIVE never flips.',
        'Number line: open circle for < or > ; closed for ≤ or ≥.',
        'Always sense-check by plugging in a value from your solution set.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Solve 5 - 3x ≤ 14.',
      hint: 'Subtract 5: -3x ≤ 9. Divide by -3 and FLIP: x ≥ -3.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
