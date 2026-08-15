/**
 * IB DP Math AA — Limits & Continuity (HL emphasis).
 * Limit notation, evaluating limits, indeterminate forms, continuity
 * at a point.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_LIMITS_CONTINUITY: LessonPlan = {
  id: 'evelyn.ibdp.aa.limits-continuity.v1',
  title: 'IB DP Math AA — Limits & Continuity',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.limits-continuity',
      description: 'Evaluate limits including indeterminate forms; recognise continuity at a point and basic discontinuities.',
      standard: 'IB-DP-MATH-AA-5.1',
    },
  ],
  prerequisites: ['ibdp.aa.normal-distribution'],
  followUps: ['ibdp.aa.differentiation'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Limits are the foundation of every calculus operation — derivatives are limits, integrals are limits.',
      script: 'Before you can differentiate, you need to know what "approach" means. Limits formalise that: as x gets closer to a, what happens to f(x)? Most limits at IB AA level resolve by direct substitution; a handful require algebra to dodge an indeterminate form like 0/0.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-limits',
      kind: 'concept',
      goal: 'Limit definition (intuitive), evaluation strategies, continuity criteria.',
      keyIdeas: [
        'NOTATION: lim as x → a of f(x) = L means f(x) gets arbitrarily close to L as x approaches a (from either side).',
        'DIRECT SUBSTITUTION: if f is continuous at a, lim x→a f(x) = f(a). Polynomial / sin / cos / exp are all continuous everywhere.',
        'INDETERMINATE FORMS at substitution: 0/0, ∞/∞, 0·∞, ∞ − ∞, 0⁰, 1^∞. Each requires algebra (factor + cancel, multiply by conjugate, divide by highest power) to resolve.',
        'FACTOR + CANCEL: lim x→1 (x² − 1)/(x − 1) = 0/0. Factor: (x−1)(x+1)/(x−1) → cancel → x + 1 → substitute → 2.',
        'CONJUGATE for SURD limits: lim x→0 (√(x+1) − 1)/x. Multiply top + bottom by (√(x+1) + 1). Numerator becomes x; cancels. Result = 1/2.',
        'LIMITS AT INFINITY: divide every term by the highest power of x. lim x→∞ (3x² + 2)/(x² + 1) → divide by x² → (3 + 2/x²)/(1 + 1/x²) → 3 as x→∞.',
        'CONTINUITY at a: f is continuous at x = a if (1) f(a) exists, (2) lim x→a f(x) exists, (3) lim equals f(a).',
        'COMMON DISCONTINUITY: removable (hole; redefine f(a) to fix), jump (one-sided limits differ), infinite (vertical asymptote).',
      ],
      vocabulary: [
        { term: 'limit', definition: 'the value f(x) approaches as x approaches a (independent of x = a).' },
        { term: 'indeterminate form', definition: 'an expression like 0/0 whose value cannot be determined directly without further work.' },
        { term: 'removable discontinuity', definition: 'a hole in f at x = a; can be patched by redefining f(a) to equal the limit.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-limit',
      kind: 'worked_example',
      problem: 'Evaluate: (a) lim as x→2 of (x² − 4)/(x − 2). (b) lim as x→∞ of (5x² − 3x)/(2x² + 1).',
      steps: [
        '(a) Direct substitution gives 0/0 — indeterminate.',
        'Factor: (x² − 4) = (x − 2)(x + 2). So (x² − 4)/(x − 2) = (x + 2) for x ≠ 2.',
        'Take limit: lim x→2 (x + 2) = 4.',
        '(b) Direct substitution gives ∞/∞.',
        'Divide every term by x²: (5 − 3/x)/(2 + 1/x²).',
        'As x → ∞: 3/x → 0 and 1/x² → 0. Limit = 5/2.',
      ],
      answer: '(a) 4; (b) 5/2',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Evaluate lim as x → 0 of (sin x)/x. (Quote the standard result.)',
      expectedAnswer: '1',
      responseFormat: 'numeric',
      hints: [
        'Direct substitution gives 0/0 — indeterminate.',
        'This is the famous "fundamental trig limit" — lim x→0 (sin x)/x = 1, with x in radians.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-substitute-undefined',
      kind: 'misconception_check',
      question: 'A student says lim x→1 (x² − 1)/(x − 1) does not exist because plugging in gives 0/0. Correct?',
      commonErrors: [
        {
          answer: 'Limit does not exist',
          misconception: 'Treating 0/0 from direct substitution as "no limit", instead of as a signal to do further work.',
          correctsTo: '0/0 is INDETERMINATE — it tells you that direct substitution failed but the limit might still exist (and usually does in IB AA problems). Always factor, cancel, conjugate, or divide-by-highest-power BEFORE concluding. For this question: (x² − 1)/(x − 1) = (x − 1)(x + 1)/(x − 1) = (x + 1) for x ≠ 1. Limit = 2. Note the function is undefined AT x = 1 but the LIMIT as x approaches 1 is well-defined.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Try direct substitution first. If indeterminate, use algebra.',
        'Factor + cancel for polynomial 0/0. Conjugate for surd 0/0. Divide by highest power for ∞/∞.',
        'Standard limit: lim x→0 sin(x)/x = 1.',
        'Continuous at a means: f(a) defined, limit exists, limit = f(a).',
        'Removable hole: limit exists but f(a) is missing/different.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Evaluate lim x→0 of (1 − cos x)/x².',
      hint: 'Multiply top and bottom by (1 + cos x): (1 − cos²x) / [x²(1 + cos x)] = sin²x / [x²(1 + cos x)] = (sin x / x)²·1/(1 + cos x). As x → 0: (sin x/x)² → 1 and 1/(1 + cos x) → 1/2. Limit = 1/2.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
