/**
 * AP Calculus AB/BC — Optimization.
 *
 * Find the maximum or minimum of a function. Set derivative = 0 to
 * find critical points, then verify max vs min. Real-world problems.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CALC_OPTIMIZATION: LessonPlan = {
  id: 'evelyn.ap.calc.optimization.v1',
  title: 'Optimization: maxima and minima',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-ab',
  locale: 'en',
  los: [
    {
      id: 'apcalc.optimization',
      description: 'Solve optimization problems using derivatives.',
      standard: 'AP-CALC-CHA-3',
    },
  ],
  prerequisites: ['apcalc.derivative-rules'],
  followUps: ['apcalc.related-rates'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame optimization as the calculus answer to "what\'s best".',
      script: 'A farmer has 200 ft of fence. What\'s the LARGEST rectangular field he can enclose? Calculus answers "what\'s the biggest, smallest, fastest, cheapest" with one technique: find where the derivative equals zero.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-method',
      kind: 'concept',
      goal: 'Five-step method for optimization problems.',
      keyIdeas: [
        'STEP 1: IDENTIFY what you want to optimize (the OBJECTIVE).',
        'STEP 2: WRITE the objective as a function of one variable, using any CONSTRAINTS to eliminate other variables.',
        'STEP 3: TAKE the derivative and SET IT EQUAL to zero. Solve for critical points.',
        'STEP 4: VERIFY which critical point is a max vs min using either the second derivative test (f\'\'(c) < 0 → max) or evaluating endpoints.',
        'STEP 5: ANSWER the original question — including units and reasonableness check.',
        'CRITICAL POINT: where f\'(x) = 0 OR f\'(x) is undefined.',
        'EXTREME VALUE THEOREM: a continuous function on a closed interval [a, b] attains its absolute max and min — found at critical points OR endpoints.',
      ],
      vocabulary: [
        { term: 'objective function', definition: 'the quantity to maximize or minimize.' },
        { term: 'constraint', definition: 'an equation linking the variables in the problem.' },
        { term: 'critical point', definition: 'a value where derivative is 0 or undefined.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-fence',
      kind: 'worked_example',
      problem: 'A farmer has 200 ft of fence. He wants to enclose a rectangular field. What dimensions maximize the AREA?',
      steps: [
        'OBJECTIVE: maximize area A = x · y.',
        'CONSTRAINT: 2x + 2y = 200 → y = 100 − x.',
        'Substitute: A(x) = x(100 − x) = 100x − x².',
        'A\'(x) = 100 − 2x. Set = 0 → x = 50.',
        'Verify: A\'\'(x) = −2 < 0 → MAX at x = 50.',
        'Then y = 100 − 50 = 50. Square 50 × 50, area = 2500 sq ft.',
      ],
      answer: '50 × 50 ft, area = 2500 sq ft',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find the maximum of f(x) = -x² + 6x − 5 on the interval [0, 5].',
      expectedAnswer: '4 (at x = 3)',
      responseFormat: 'free',
      hints: [
        'f\'(x) = -2x + 6 = 0 → x = 3.',
        'Evaluate at x = 3 and at endpoints x = 0, x = 5.',
        'Pick the largest.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cp-always-max',
      kind: 'misconception_check',
      question: 'Is every critical point automatically a maximum?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating any critical point as a max.',
          correctsTo: 'No — a critical point can be a max, a min, or neither (saddle / inflection). Always verify with the second derivative test or endpoints. Just having f\'(x) = 0 isn\'t enough.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Identify objective, write as one-variable function via constraints.',
        'Set derivative = 0 to find critical points.',
        'Verify with 2nd derivative test or endpoint check.',
        'Always check endpoints if the domain is bounded.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does a SQUARE always maximize area for a given perimeter (among rectangles)?',
      hint: 'For perimeter P, side x and y = (P-2x)/2. Maximize A = x(P-2x)/2 → derivative = 0 → x = P/4. y = P/4. Square is the optimum. (Among ALL shapes with given perimeter, a CIRCLE wins — the isoperimetric inequality.)',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
