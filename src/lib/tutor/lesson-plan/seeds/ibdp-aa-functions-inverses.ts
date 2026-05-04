/**
 * IB DP Math AA — Functions, Composite, and Inverses.
 * Function notation, domain/range, composite f∘g, inverse f⁻¹,
 * graph-of-inverse-as-reflection.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_FUNCTIONS_INVERSES: LessonPlan = {
  id: 'evelyn.ibdp.aa.functions-inverses.v1',
  title: 'IB DP Math AA — Functions & Inverses',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.functions-inverses',
      description: 'Use function notation, domain/range, composite functions, and inverse functions; reflect the graph y = f(x) in y = x to obtain y = f⁻¹(x).',
      standard: 'IB-DP-MATH-AA-2.2/2.3',
    },
  ],
  prerequisites: ['ibdp.aa.binomial-theorem'],
  followUps: ['ibdp.aa.quadratics-deep'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Functions are the language of every IB AA topic — calculus, statistics, kinematics. Mastering composition and inverses early pays off everywhere.',
      script: 'In Paper 2 you might be asked to find the inverse of f(x) = (3x − 1)/(x + 4) on a restricted domain, then evaluate (f⁻¹ ∘ f)(5). Each operation has a clean recipe — composition (apply inner first, then outer), inverse (swap and solve, restrict if needed). Today we drill the recipes.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-functions',
      kind: 'concept',
      goal: 'Notation, domain/range, composition rules, inverse construction.',
      keyIdeas: [
        'FUNCTION f: A → B maps each x ∈ A to exactly one f(x) ∈ B. Domain A = inputs, range = actual outputs.',
        'COMPOSITE: (f ∘ g)(x) = f(g(x)). Apply g first, then f. Order matters: f∘g ≠ g∘f in general.',
        'DOMAIN of f∘g: x must be in domain of g AND g(x) must be in domain of f.',
        'INVERSE FUNCTION f⁻¹: undoes f. Defined ⟺ f is one-to-one (injective). f(f⁻¹(x)) = x and f⁻¹(f(x)) = x.',
        'CONSTRUCTING INVERSE: write y = f(x), swap x and y, solve for y. Resulting expression is f⁻¹(x).',
        'GRAPH OF INVERSE: reflect y = f(x) in the line y = x. Domain and range swap.',
        'RESTRICTING DOMAIN: if f is not 1-1 on its full domain (e.g. f(x) = x² on ℝ), restrict to make it 1-1 (e.g. x ≥ 0). Then inverse exists.',
        'NOTATION CARE: f⁻¹(x) ≠ 1/f(x). The −1 superscript on a function means inverse, not reciprocal.',
      ],
      vocabulary: [
        { term: 'one-to-one', definition: 'a function f where f(a) = f(b) ⟹ a = b. Required for an inverse to exist.' },
        { term: 'composite function', definition: '(f ∘ g)(x) = f(g(x)) — apply g first, then f.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-rational-inverse',
      kind: 'worked_example',
      problem: 'f(x) = (2x + 1)/(x − 3). Find f⁻¹(x), stating its domain.',
      steps: [
        'Write y = (2x + 1)/(x − 3).',
        'Swap x and y: x = (2y + 1)/(y − 3).',
        'Multiply both sides by (y − 3): x(y − 3) = 2y + 1.',
        'Expand: xy − 3x = 2y + 1.',
        'Collect y terms: xy − 2y = 3x + 1 → y(x − 2) = 3x + 1.',
        'Solve: y = (3x + 1)/(x − 2). So f⁻¹(x) = (3x + 1)/(x − 2).',
        'Domain of f⁻¹: x ≠ 2 (denominator). Note range of f equals domain of f⁻¹: f never hits y = 2 because that would require (2x + 1)/(x − 3) = 2 → 2x + 1 = 2x − 6, contradiction. So range of f is x ≠ 2 → matches.',
      ],
      answer: 'f⁻¹(x) = (3x + 1)/(x − 2), domain x ≠ 2',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Given f(x) = 2x − 5 and g(x) = x² + 1, find (f ∘ g)(2).',
      expectedAnswer: '5',
      responseFormat: 'numeric',
      hints: [
        'Apply g first: g(2) = 2² + 1 = 5.',
        'Then apply f to that result: f(5) = 2·5 − 5 = 5.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-inverse-recip',
      kind: 'misconception_check',
      question: 'A student says f⁻¹(x) = 1/f(x). For f(x) = 3x + 2, are f⁻¹(x) and 1/f(x) the same?',
      commonErrors: [
        {
          answer: 'Yes, both are 1/(3x + 2)',
          misconception: 'Reading the −1 superscript as "reciprocal" rather than "inverse function".',
          correctsTo: 'f⁻¹(x) is the FUNCTION that undoes f. For f(x) = 3x + 2: y = 3x + 2 → x = 3y + 2 → y = (x − 2)/3. So f⁻¹(x) = (x − 2)/3. Meanwhile 1/f(x) = 1/(3x + 2) — a totally different function. Verify: f(f⁻¹(x)) = 3·(x − 2)/3 + 2 = (x − 2) + 2 = x ✓. But f(1/f(x)) = 3·1/(3x + 2) + 2 ≠ x in general. Notation matters: f⁻¹ means inverse, not reciprocal.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Composition: (f ∘ g)(x) = f(g(x)). Apply inner first.',
        'Inverse construction: write y = f(x), swap x and y, solve for y.',
        'Graph of f⁻¹ is reflection of f in the line y = x.',
        'f⁻¹(x) ≠ 1/f(x).',
        'Domain restrict if f isn\'t 1-to-1.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'f(x) = (x − 4)² + 3 for x ≥ 4. Find f⁻¹(x), and state its domain.',
      hint: 'Restriction x ≥ 4 makes f one-to-one (otherwise the parabola fails the horizontal line test). y = (x − 4)² + 3 → swap → x = (y − 4)² + 3 → (y − 4)² = x − 3 → y − 4 = +√(x − 3) (positive root because y ≥ 4 from the original domain). f⁻¹(x) = 4 + √(x − 3). Domain: x ≥ 3 (from the square-root argument; matches range of f).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
