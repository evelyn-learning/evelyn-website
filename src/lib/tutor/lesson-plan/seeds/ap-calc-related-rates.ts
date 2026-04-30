/**
 * AP Calculus AB/BC — Related Rates.
 *
 * When two quantities are connected by an equation, their rates of
 * change are connected by implicit differentiation. Classic
 * application: ladder, balloon, shadow problems.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CALC_RELATED_RATES: LessonPlan = {
  id: 'evelyn.ap.calc.related-rates.v1',
  title: 'Related rates',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'calculus',
  locale: 'en',
  los: [
    {
      id: 'apcalc.related-rates',
      description: 'Solve related rates problems using implicit differentiation.',
      standard: 'AP-CALC-CHA-3',
    },
  ],
  prerequisites: ['apcalc.implicit-differentiation'],
  followUps: ['apcalc.optimization'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Pose a real-world rate-change problem.',
      script: 'A balloon being inflated — its volume grows at 50 cm³/sec. How fast is its RADIUS growing? Volume and radius are related; their rates must also be related. That\'s related rates.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-five-steps',
      kind: 'concept',
      goal: 'Five-step framework for any related rates problem.',
      keyIdeas: [
        'STEP 1: Identify what\'s changing and label rates with d/dt notation. (e.g., dV/dt, dr/dt).',
        'STEP 2: Find an EQUATION relating the variables (geometry formula, physics law, etc.).',
        'STEP 3: Differentiate BOTH sides with respect to time t (implicit differentiation).',
        'STEP 4: Plug in the GIVEN values — but only AFTER differentiating. Don\'t plug in numbers before the derivative step.',
        'STEP 5: Solve for the unknown rate.',
        'COMMON SCENARIOS: ladder sliding (Pythagorean), balloon (volume of sphere), shadow (similar triangles), water in cone (volume + similar triangles).',
      ],
      vocabulary: [
        { term: 'related rates', definition: 'rates of change of two quantities linked by an equation.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-balloon',
      kind: 'worked_example',
      problem: 'Air is pumped into a spherical balloon at 50 cm³/sec. Find how fast the radius is increasing when r = 5 cm.',
      steps: [
        'Step 1: dV/dt = 50 cm³/sec is GIVEN. Find dr/dt when r = 5.',
        'Step 2: Volume formula: V = (4/3)πr³.',
        'Step 3: Differentiate w.r.t. t: dV/dt = 4πr² · dr/dt.',
        'Step 4: Plug in dV/dt = 50 and r = 5: 50 = 4π(25) · dr/dt.',
        'Step 5: Solve: dr/dt = 50 / (100π) = 1/(2π) cm/sec ≈ 0.159 cm/sec.',
      ],
      answer: '1/(2π) cm/sec ≈ 0.16 cm/sec',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A 13-ft ladder leans against a wall. The bottom slides away at 2 ft/sec. How fast is the top sliding DOWN when the bottom is 5 ft from the wall?',
      expectedAnswer: '-5/6 ft/sec',
      responseFormat: 'free',
      hints: [
        'Pythagorean: x² + y² = 13² = 169. Differentiate: 2x(dx/dt) + 2y(dy/dt) = 0.',
        'When x = 5, y = 12 (since 5-12-13 triangle). Plug in dx/dt = 2.',
        'Solve for dy/dt. The negative sign means top is moving DOWN.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-plug-first',
      kind: 'misconception_check',
      question: 'Should you plug in r = 5 BEFORE differentiating?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Substituting numerical values too early.',
          correctsTo: 'No — if you plug r = 5 into V = (4/3)π(5)³ first, V becomes a constant, and dV/dt = 0. You\'d lose all information about how V relates to r. Always DIFFERENTIATE first, then plug in.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Related rates: connect rates via implicit differentiation.',
        'FIVE STEPS: identify rates, find equation, differentiate, plug in, solve.',
        'NEVER plug in values before differentiating — variables stay variable until step 4.',
        'Negative answer = quantity decreasing.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A 6-ft person walks away from a 15-ft lamppost at 4 ft/sec. How fast is the TIP of their shadow moving?',
      hint: 'Use similar triangles: (lamppost height)/(shadow tip distance) = (person height)/(shadow length). Differentiate and solve.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
