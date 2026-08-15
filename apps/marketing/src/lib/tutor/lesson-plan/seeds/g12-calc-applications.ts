/**
 * G12 — Calculus: Applications of the derivative (related rates,
 * optimization, motion).
 *
 * What derivatives are FOR. Three classic application types: motion
 * (position/velocity/acceleration), related rates (rates that change
 * together), and optimization (find max or min). Common SAT/AP-style
 * setups; the strategy is to translate words → equation → apply
 * derivative rules.
 */

import type { LessonPlan } from '../types';

export const SEED_G12_CALC_APPLICATIONS: LessonPlan = {
  id: 'evelyn.g12.math.calc.applications.v1',
  title: 'Calculus Applications: Motion, Related Rates, Optimization',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'calculus',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.calc.deriv-applications',
      description: 'Apply derivatives to motion, related rates, and optimization problems.',
    },
  ],
  prerequisites: ['ccss.math.calc.deriv-rules'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that "rate of change" answers REAL questions.',
      script: 'A ladder slides down a wall. How fast is the top falling when the bottom is 6 feet from the wall? A box has a fixed amount of cardboard — what dimensions give the most volume? These look unrelated, but both come down to the same trick: use a derivative to relate rates of change. Calculus turns word problems into formulas.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-applications',
      kind: 'concept',
      goal: 'Motion, related rates, optimization — same tool, three setups.',
      keyIdeas: [
        'MOTION: position s(t) is a function of time. Then:',
        '  VELOCITY = s\'(t) = ds/dt. (Rate of position change.)',
        '  ACCELERATION = v\'(t) = s\'\'(t). (Rate of velocity change.)',
        '  Speed = |velocity|. Direction tells you sign.',
        'RELATED RATES: two quantities both changing in time, related by a formula. Differentiate the formula with respect to t (using chain rule on every variable!).',
        '  Strategy: 1) draw a picture; 2) name variables and their rates; 3) write the formula relating them; 4) implicitly differentiate w.r.t. t; 5) plug in known values and solve for unknown rate.',
        '  Common setup: ladder problems, expanding circles, draining cones.',
        'OPTIMIZATION: find the max or min of a quantity.',
        '  Strategy: 1) write the quantity to optimize as a function of ONE variable (use a constraint to reduce); 2) take the derivative; 3) set = 0 to find critical points; 4) check whether each critical point is a max, min, or neither (second derivative test or sign chart); 5) verify the answer makes sense in context.',
        '  At a max/min, the derivative is 0 (or undefined). The second derivative tells you which: f\'\' > 0 → min, f\'\' < 0 → max.',
      ],
      vocabulary: [
        { term: 'related rates', definition: 'two quantities changing over time, connected by a formula.' },
        { term: 'optimization', definition: 'finding maximum or minimum of a function.' },
        { term: 'critical point', definition: 'a point where f\'(x) = 0 or undefined.' },
      ],
      suggestedTools: ['show_equation', 'show_function_graph'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-motion',
      kind: 'worked_example',
      problem: 'A ball is thrown upward; its height at time t is s(t) = -16t² + 96t. Find velocity at t = 2 seconds.',
      steps: [
        'Velocity = s\'(t).',
        'Differentiate: s\'(t) = -32t + 96.',
        'Plug in t = 2: v(2) = -32(2) + 96 = -64 + 96 = 32 ft/s.',
        'Positive velocity → ball still moving upward at t = 2.',
      ],
      answer: '32 ft/s',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-related-rates',
      kind: 'worked_example',
      problem: 'A circle\'s radius is growing at 2 cm/s. How fast is the area growing when r = 5?',
      steps: [
        'Formula: A = πr².',
        'Differentiate w.r.t. t (chain rule): dA/dt = 2πr · dr/dt.',
        'Plug in: r = 5, dr/dt = 2. dA/dt = 2π(5)(2) = 20π cm²/s.',
        'Notice: as r grows, area grows even FASTER (because dA/dt depends on r itself).',
      ],
      answer: '20π cm²/s',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-optimization',
      kind: 'worked_example',
      problem: 'A rectangle with perimeter 40 has what dimensions to maximize area?',
      steps: [
        'Constraint: perimeter = 2L + 2W = 40 → L + W = 20 → W = 20 - L.',
        'Area function (in one variable): A(L) = L · W = L · (20 - L) = 20L - L².',
        'Derivative: A\'(L) = 20 - 2L.',
        'Set = 0: 20 - 2L = 0 → L = 10.',
        'Then W = 20 - 10 = 10.',
        'A square (10 × 10) maximizes area. Max A = 100.',
        'Sense-check with second derivative: A\'\'(L) = -2 < 0 → maximum.',
      ],
      answer: '10 × 10 (a square), area = 100',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A particle\'s position is s(t) = t³ - 6t. Find acceleration at t = 2.',
      expectedAnswer: '12',
      responseFormat: 'numeric',
      hints: [
        's\' = velocity = 3t² - 6.',
        's\'\' = acceleration = 6t.',
        'At t = 2: 6(2) = 12.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-no-constraint',
      kind: 'misconception_check',
      question: 'For "max area of a rectangle with perimeter 40," Owen writes A = LW and tries to maximize without using the perimeter constraint. He gets stuck. What did he miss?',
      commonErrors: [
        {
          answer: 'derivative of LW',
          misconception: 'Trying to optimize a multivariable expression without reducing to one variable using the constraint.',
          correctsTo: 'Owen needed to use the perimeter constraint to express W in terms of L (or vice versa) before differentiating. Without the constraint, A = LW has no max — make L bigger forever. The constraint is the whole point.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Velocity = s\'(t). Acceleration = s\'\'(t).',
        'Related rates: write formula, differentiate w.r.t. t, plug in.',
        'Optimization: use constraint to reduce to ONE variable, then take derivative, set = 0.',
        'Second derivative: > 0 → min, < 0 → max.',
        'Always interpret the answer back into the word problem.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Find the dimensions of an open-top box with square base and volume 32 that minimize surface area.',
      hint: 'Volume: x²·h = 32 → h = 32/x². Surface area: x² + 4xh = x² + 128/x. Differentiate: 2x - 128/x² = 0 → x³ = 64 → x = 4. Then h = 2.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
