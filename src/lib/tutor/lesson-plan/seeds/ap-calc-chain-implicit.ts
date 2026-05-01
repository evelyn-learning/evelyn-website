/**
 * AP Calculus AB — Unit 3: Composite, Implicit, Inverse Differentiation.
 *
 * Chain rule, implicit differentiation, derivatives of inverse trig + exp + log.
 * Heaviest "rule mechanics" unit on AB.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CALC_CHAIN_IMPLICIT: LessonPlan = {
  id: 'evelyn.ap.calc.chain-implicit.v1',
  title: 'AP Calc AB — Unit 3: Chain Rule, Implicit + Inverse Derivatives',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'calculus',
  locale: 'en',
  los: [
    {
      id: 'ap.calc.chain-implicit',
      description: 'Apply the chain rule to composite functions, perform implicit differentiation, derive + use inverse-function derivatives (including inverse trig, exp, log), and recognize when each technique is needed.',
      standard: 'AP-CALC-AB-3',
    },
  ],
  prerequisites: ['ap.calc.limits-continuity'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Unit 3 is the rule-mechanics heart of AB.',
      script: 'Unit 3 is where AB calculus becomes a fluency challenge — chain rule, implicit differentiation, and inverse derivatives all show up across the rest of the course (related rates, optimization, integration by substitution, FRQ algebra). The procedures are mechanical, but speed + accuracy matter. Get fluent here and the AB exam\'s computation-heavy questions feel routine.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-chain-rule',
      kind: 'concept',
      goal: 'Chain rule for composite functions.',
      keyIdeas: [
        'CHAIN RULE: if y = f(g(x)), then dy/dx = f\'(g(x)) · g\'(x). "Derivative of outer (with inner inside) times derivative of inner."',
        'NOTATION (Leibniz): if y = f(u) and u = g(x), then dy/dx = (dy/du)·(du/dx).',
        'PATTERN RECOGNITION: identify the OUTER and INNER functions. E.g., (sin x)³ — outer is u³, inner is sin x. d/dx = 3(sin x)² · cos x.',
        'NESTED CHAIN: extend for triple compositions. (e^(sin(x²)))\' = e^(sin(x²)) · cos(x²) · 2x.',
        'COMMON TYPES with chain rule:',
        '  POWER OF FUNCTION: d/dx [u(x)]^n = n·[u(x)]^(n−1) · u\'(x).',
        '  TRIG OF FUNCTION: d/dx sin(u) = cos(u)·u\', d/dx cos(u) = −sin(u)·u\', d/dx tan(u) = sec²(u)·u\'.',
        '  EXPONENTIAL: d/dx [e^(u)] = e^(u)·u\'. d/dx [a^(u)] = a^(u)·ln(a)·u\'.',
        '  LOGARITHM: d/dx [ln(u)] = u\'/u. d/dx [log_a(u)] = u\'/(u·ln(a)).',
        'COMMON ERROR: forgetting to multiply by u\'(x). The chain rule is what distinguishes derivative of (sin x) from derivative of sin(2x): d/dx sin(2x) = cos(2x)·2 = 2cos(2x), NOT just cos(2x).',
      ],
      vocabulary: [
        { term: 'chain rule', definition: 'derivative of a composite f(g(x)) equals f\'(g(x))·g\'(x); essential for differentiating any "function of a function."' },
        { term: 'composite function', definition: 'a function formed by applying one function to the output of another, written f(g(x)) or (f ∘ g)(x).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-implicit-inverse',
      kind: 'concept',
      goal: 'Implicit differentiation + inverse function derivatives.',
      keyIdeas: [
        'IMPLICIT DIFFERENTIATION: when y is defined IMPLICITLY by an equation (e.g., x² + y² = 25), differentiate both sides w.r.t. x, treating y as a function of x. Each y term gets a dy/dx (chain rule). Then solve algebraically for dy/dx.',
        'PROCEDURE: (1) differentiate every term, with d/dx of any y term producing y · dy/dx for y² → 2y·(dy/dx), y³ → 3y²·(dy/dx), etc.; (2) collect dy/dx terms on one side; (3) factor + solve for dy/dx.',
        'EXAMPLE: x² + y² = 25 → 2x + 2y(dy/dx) = 0 → dy/dx = −x/y. (Tangent slope at any point on circle.)',
        'IMPLICIT WITH PRODUCT: x²y + xy³ = 6 → use product rule: (2xy + x²·dy/dx) + (y³ + x·3y²·dy/dx) = 0. Solve.',
        'INVERSE FUNCTION DERIVATIVE: if g is the inverse of f, then g\'(b) = 1/f\'(g(b)) where b = f(a). Or: (f⁻¹)\'(x) = 1/f\'(f⁻¹(x)).',
        'INVERSE TRIG DERIVATIVES (memorize):',
        '  d/dx arcsin(x) = 1/√(1−x²)',
        '  d/dx arccos(x) = −1/√(1−x²)',
        '  d/dx arctan(x) = 1/(1+x²)',
        '  d/dx arcsec(x) = 1/(|x|√(x²−1))',
        '  d/dx arccot(x) = −1/(1+x²)',
        '  d/dx arccsc(x) = −1/(|x|√(x²−1))',
        'COMBINING with CHAIN RULE: d/dx arcsin(u) = u\'/√(1−u²), etc.',
        'EXP + LOG INVERSES already covered: d/dx ln(x) = 1/x. d/dx e^x = e^x. (Mutual inverses, which is why they pair so cleanly.)',
      ],
      vocabulary: [
        { term: 'implicit differentiation', definition: 'differentiating both sides of an equation treating y as f(x); produces dy/dx without first solving for y.' },
        { term: 'inverse function rule', definition: '(f⁻¹)\'(x) = 1/f\'(f⁻¹(x)); derivative of inverse is reciprocal of original derivative at corresponding point.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-implicit',
      kind: 'worked_example',
      problem: 'For x³ + y³ = 6xy, find dy/dx and the slope of the tangent line at (3, 3).',
      steps: [
        'STEP 1 — differentiate both sides w.r.t. x. Treat y as y(x). Term-by-term:',
        '  d/dx (x³) = 3x²',
        '  d/dx (y³) = 3y²·(dy/dx) (chain rule)',
        '  d/dx (6xy) = 6y + 6x·(dy/dx) (product rule on 6x·y)',
        'STEP 2 — equation becomes: 3x² + 3y²·(dy/dx) = 6y + 6x·(dy/dx).',
        'STEP 3 — collect dy/dx terms: 3y²·(dy/dx) − 6x·(dy/dx) = 6y − 3x².',
        'STEP 4 — factor: (3y² − 6x)·(dy/dx) = 6y − 3x².',
        'STEP 5 — solve: dy/dx = (6y − 3x²)/(3y² − 6x) = (2y − x²)/(y² − 2x).',
        'STEP 6 — at (3, 3): dy/dx = (2·3 − 9)/(9 − 6) = (6 − 9)/3 = −3/3 = −1.',
        'TANGENT LINE at (3,3): slope −1, equation y − 3 = −1·(x − 3), or y = −x + 6.',
      ],
      answer: 'dy/dx = (2y − x²)/(y² − 2x); at (3,3) slope is −1; tangent y = −x + 6.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find d/dx [arctan(3x²)].',
      expectedAnswer: '6x/(1 + 9x⁴). Apply chain rule: d/dx arctan(u) = u\'/(1+u²) where u = 3x². Then u\' = 6x and 1 + u² = 1 + 9x⁴. So result = 6x/(1 + 9x⁴).',
      responseFormat: 'free',
      hints: [
        'arctan(u) derivative: u\'/(1+u²).',
        'Don\'t forget to take derivative of inner function (3x²)\'.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-implicit-y',
      kind: 'misconception_check',
      question: 'When implicitly differentiating an equation like x² + y² = 25, you should treat y as a constant since it doesn\'t equal a specific function of x. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating y as a constant rather than as f(x).',
          correctsTo: 'False — fundamentally. The equation x² + y² = 25 IMPLICITLY defines y as a function of x (well, two functions actually: y = +√(25−x²) and y = −√(25−x²)). Implicit differentiation works precisely BECAUSE y is treated as f(x). So d/dx (y²) = 2y·(dy/dx) — not just 2y. The (dy/dx) factor is the chain rule applied to the unknown function y(x). Forgetting this factor is the most common error in implicit problems and turns 2y into the entire wrong answer. AP frequently tests this — every implicit FRQ requires the (dy/dx) factor.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Chain rule: d/dx f(g(x)) = f\'(g(x))·g\'(x). Always include the inner derivative.',
        'Implicit: differentiate both sides; y terms get (dy/dx) factor; solve for dy/dx.',
        'Inverse trig derivatives: arcsin → 1/√(1−x²), arctan → 1/(1+x²), arccos → −1/√(1−x²).',
        'Inverse rule: (f⁻¹)\'(x) = 1/f\'(f⁻¹(x)).',
        'd/dx [a^x] = a^x·ln(a); d/dx [log_a(x)] = 1/(x·ln(a)).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is implicit differentiation often easier than explicitly solving for y first and then differentiating?',
      hint: 'Two reasons. (1) For many curves (e.g., x²y³ + sin(xy) = 5), it\'s ALGEBRAICALLY IMPOSSIBLE or very messy to solve for y in closed form. Implicit differentiation works without ever solving for y. (2) Even when y CAN be solved for, implicit differentiation is often computationally faster. Example: x² + y² = 25. Solving explicitly: y = ±√(25 − x²). Then dy/dx = ±(−x)/√(25 − x²) = −x/y. Versus implicit: 2x + 2y(dy/dx) = 0 → dy/dx = −x/y in two lines. Same answer, less algebra. (3) BONUS: implicit lets you find dy/dx at SPECIFIC POINTS without distinguishing branches — at (3,4) on the circle, dy/dx = −3/4; at (3,−4), dy/dx = 3/4. Both come out automatically by plugging in. AP FRQs love this — they specify a point and ask for slope there.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
