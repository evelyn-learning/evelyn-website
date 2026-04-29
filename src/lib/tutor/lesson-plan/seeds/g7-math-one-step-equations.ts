/**
 * G7 — One-step equations (solve via inverse operations).
 *
 * The first time students SOLVE for an unknown rather than just
 * evaluate. Core idea: do the same thing to both sides, undo the
 * operation surrounding x. Anchored on a "balance scale" mental
 * model — both sides must stay equal. Covers the four one-step
 * forms: x + a = b, x - a = b, ax = b, x/a = b.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_MATH_ONE_STEP_EQUATIONS: LessonPlan = {
  id: 'evelyn.g7.math.one-step-equations.v1',
  title: 'Solving One-Step Equations',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'math',
  topic: 'equations',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.7.ee.b.4',
      description: 'Use variables to represent quantities and construct simple equations to solve problems.',
      standard: 'CCSS.MATH.CONTENT.7.EE.B.4',
    },
    {
      id: 'ccss.math.6.ee.b.7',
      description: 'Solve real-world problems by writing and solving equations of the form x + p = q and px = q.',
      standard: 'CCSS.MATH.CONTENT.6.EE.B.7',
    },
  ],
  prerequisites: ['ccss.math.6.ee.a.2'],
  followUps: ['ccss.math.7.ee.b.4.a'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the balance-scale mental model.',
      script: 'Imagine a balance scale. On the left: x and a 5-pound weight. On the right: 12 pounds. The scale balances. What\'s x worth? Whatever I do to one side, I have to do to the other to keep it balanced. That\'s the rule for solving equations.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-inverse-ops',
      kind: 'concept',
      goal: 'Isolate x by applying the inverse of whatever operation is around it — to BOTH sides.',
      keyIdeas: [
        'An EQUATION has an equals sign. Both sides represent the same value.',
        'To SOLVE means to find what value of the variable makes the equation true.',
        'Golden rule: whatever you do to ONE side, do to the OTHER. The equation stays balanced.',
        'INVERSE OPERATIONS: + and - undo each other. × and ÷ undo each other.',
        'Strategy: identify what\'s being done TO x, then apply the INVERSE to both sides.',
        'x + 5 = 12 → subtract 5 from both sides → x = 7.',
        'x - 4 = 9 → add 4 to both sides → x = 13.',
        '3x = 21 → divide both sides by 3 → x = 7.',
        'x/4 = 5 → multiply both sides by 4 → x = 20.',
        'CHECK: substitute the answer back into the original equation. If both sides equal, you\'re right.',
      ],
      vocabulary: [
        { term: 'equation', definition: 'a math statement that two expressions are equal (uses =).' },
        { term: 'solution', definition: 'the value of the variable that makes the equation true.' },
        { term: 'inverse operation', definition: 'an operation that undoes another (+ undoes -; × undoes ÷).' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-add',
      kind: 'worked_example',
      problem: 'Solve x + 5 = 12.',
      steps: [
        'x is being ADDED to 5. Inverse of + is -. Subtract 5 from BOTH sides.',
        'x + 5 - 5 = 12 - 5.',
        'x = 7.',
        'CHECK: 7 + 5 = 12. ✓',
      ],
      answer: '7',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-multiply',
      kind: 'worked_example',
      problem: 'Solve 4x = 28.',
      steps: [
        'x is being MULTIPLIED by 4. Inverse of × is ÷. Divide both sides by 4.',
        '4x ÷ 4 = 28 ÷ 4.',
        'x = 7.',
        'CHECK: 4(7) = 28. ✓',
      ],
      answer: '7',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Solve x - 8 = 15.',
      expectedAnswer: '23',
      responseFormat: 'numeric',
      hints: [
        'x is being subtracted by 8. Inverse: add 8 to both sides.',
        'x = 15 + 8.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-side',
      kind: 'misconception_check',
      question: 'Asha is solving x + 7 = 20 and writes "x = 20". She just dropped the +7. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating the +7 as decoration that disappears, instead of an operation to undo.',
          correctsTo: 'No. To get rid of +7, you have to subtract 7 — and from BOTH sides. x + 7 - 7 = 20 - 7 → x = 13. Just dropping a term breaks the balance.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Equation = balance. Both sides equal.',
        'Same operation on BOTH sides keeps it balanced.',
        'Identify what\'s done TO x, then undo with the inverse.',
        '+ undoes -; × undoes ÷.',
        'Always check by substituting your answer back in.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Solve -3x = 15.',
      hint: 'Divide both sides by -3. x = 15 ÷ -3 = -5. (Different signs in division → negative result.)',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
