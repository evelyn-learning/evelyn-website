/**
 * G12 — Calculus: Limits and continuity.
 *
 * The foundational calculus concept. A limit is the value a function
 * APPROACHES as x approaches some value, even if the function isn't
 * defined there. Three ways to evaluate: substitution (when valid),
 * factor-and-cancel (for 0/0 forms), and graphical/numerical
 * estimation. Continuity defined via limits.
 */

import type { LessonPlan } from '../types';

export const SEED_G12_CALC_LIMITS: LessonPlan = {
  id: 'evelyn.g12.math.calc.limits.v1',
  title: 'Limits and Continuity',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'calculus',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.calc.limits',
      description: 'Evaluate limits using substitution, factoring, and graphical reasoning; determine continuity.',
    },
  ],
  prerequisites: ['ccss.math.hsf.if.b.4'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show why a limit is needed when direct substitution fails.',
      script: 'Try evaluating (x² - 4)/(x - 2) at x = 2. You get 0/0 — undefined. But everywhere ELSE the function equals x + 2. Walk x toward 2 from either side; the value heads to 4. The function IS undefined at 2, but its LIMIT as x approaches 2 is 4. That subtle distinction is the whole foundation of calculus.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-limits',
      kind: 'concept',
      goal: 'Definition, evaluation methods, one-sided limits, continuity.',
      keyIdeas: [
        'lim(x→a) f(x) = L means f(x) gets arbitrarily close to L as x gets close to a — from EITHER SIDE.',
        'A limit can exist EVEN IF f(a) is undefined.',
        'TWO METHODS for evaluating limits:',
        '  1) DIRECT SUBSTITUTION — plug in a. If you get a real number, that\'s the limit. (Works for continuous functions.)',
        '  2) FACTOR-AND-CANCEL — when direct substitution gives 0/0 (an "indeterminate form"), factor numerator and denominator and cancel the offending factor.',
        'Example: lim(x→2) (x² - 4)/(x - 2) = lim(x→2) ((x-2)(x+2))/(x-2) = lim(x→2) (x+2) = 4.',
        'ONE-SIDED LIMITS: lim(x→a⁻) means approaching from the LEFT. lim(x→a⁺) from the RIGHT.',
        'For the (two-sided) limit to EXIST, both one-sided limits must equal each other.',
        'INFINITE limits: as x → ∞ or x → -∞. Look at how f behaves "in the long run."',
        'CONTINUITY at x = a requires three things:',
        '  1) f(a) is defined.',
        '  2) lim(x→a) f(x) exists.',
        '  3) lim(x→a) f(x) = f(a).',
        'If any of those fails, f is discontinuous at a — could be a hole, a jump, or a vertical asymptote.',
      ],
      vocabulary: [
        { term: 'limit', definition: 'the value f(x) approaches as x approaches a value.' },
        { term: 'indeterminate form', definition: '0/0 or ∞/∞ — needs algebraic manipulation, not direct substitution.' },
        { term: 'continuity', definition: 'no holes, jumps, or asymptotes at a point.' },
      ],
      suggestedTools: ['show_function_graph', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-substitution',
      kind: 'worked_example',
      problem: 'Evaluate lim(x→3) (x² + 2x − 1).',
      steps: [
        'This is a polynomial — continuous everywhere. Direct substitution works.',
        'f(3) = 9 + 6 − 1 = 14.',
        'Limit = 14.',
      ],
      answer: '14',
      estimatedMinutes: 2,
    },
    {
      id: 'worked-factor',
      kind: 'worked_example',
      problem: 'Evaluate lim(x→1) (x² - 1)/(x - 1).',
      steps: [
        'Direct substitution: (1 - 1)/(1 - 1) = 0/0. Indeterminate.',
        'Factor numerator: x² - 1 = (x - 1)(x + 1).',
        'Cancel (x - 1): (x + 1).',
        'Now substitute: lim(x→1) (x + 1) = 2.',
      ],
      answer: '2',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-continuity',
      kind: 'worked_example',
      problem: 'Is f(x) = (x² - 4)/(x - 2) continuous at x = 2?',
      steps: [
        'Test the three requirements.',
        '1) f(2) = (0)/(0) — UNDEFINED. Already fails.',
        'Therefore f is NOT continuous at x = 2.',
        'It\'s a REMOVABLE discontinuity (a hole) — the limit exists (= 4 from earlier work), so we could redefine f(2) = 4 to make it continuous.',
      ],
      answer: 'Not continuous (removable discontinuity / hole)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Evaluate lim(x→0) (sin x)/x. (Hint: this is a famous one — try graphing or use the squeeze theorem.)',
      expectedAnswer: '1',
      responseFormat: 'numeric',
      hints: [
        'Direct substitution gives 0/0.',
        'Numerically: try x = 0.1, 0.01, 0.001 — values approach 1.',
        'Graphically: (sin x)/x looks like it heads to 1 as x → 0.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-undefined-equals-no-limit',
      kind: 'misconception_check',
      question: 'Asha says "If f(2) is undefined, the limit at x = 2 doesn\'t exist." Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Equating undefined function value with non-existent limit.',
          correctsTo: 'Wrong. Limits care about what happens NEAR a point, not AT it. f(2) can be undefined while lim(x→2) f(x) exists. The whole point of limits is to talk about behavior even where the function itself fails.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Limit = value f(x) approaches as x → a.',
        'Direct substitution works when continuous; factor-and-cancel for 0/0.',
        'For limit to exist (two-sided): both one-sided limits agree.',
        'Continuity = function defined + limit exists + they match.',
        'Limit existing ≠ function defined.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Evaluate lim(x→∞) (3x² + 2)/(x² + 1).',
      hint: 'For x → ∞, divide top and bottom by highest power: (3 + 2/x²)/(1 + 1/x²) → 3/1 = 3 as x → ∞.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
