/**
 * AP Calculus BC — CED Unit 2.5+2.6: Power Rule + Linearity (constant,
 * sum, difference, constant multiple). Combined.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U2_POWER_RULE_LINEARITY: LessonPlan = {
  id: 'evelyn.ap.calcbc.power-rule-linearity.v1',
  title: 'U2.5 The Power Rule and Linearity of the Derivative',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.power-rule',
      description:
        'Apply the power rule d/dx[x^n] = n·x^(n-1) for any real n, and the linearity properties of differentiation (constant, sum/difference, constant-multiple) to differentiate polynomials and other power-of-x functions.',
      standard: 'AP-CALCBC-2.5-2.6',
    },
  ],
  prerequisites: ['apcalcbc.differentiability-continuity'],
  followUps: ['apcalcbc.transcendental-derivatives'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the rules as the shortcut over the limit definition.',
      script:
        "Computing every derivative from the definition is exhausting. The POWER RULE and LINEARITY together let you differentiate any polynomial — and most algebraic functions — in seconds. Master these and 80% of mechanical differentiation is automatic.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-rules',
      kind: 'concept',
      goal: 'State all the basic rules + show their uses.',
      keyIdeas: [
        'POWER RULE: For any real number n, d/dx[x^n] = n · x^(n-1). Works for positive integer (n=2: x² → 2x), negative (n=-1: 1/x → -1/x²), fractional (n=1/2: √x → 1/(2√x)), and arbitrary real (n=π: x^π → π·x^(π-1)) exponents.',
        'CONSTANT RULE: d/dx[c] = 0 for any constant c. The derivative of a constant is zero.',
        'CONSTANT-MULTIPLE RULE: d/dx[c·f(x)] = c · f\'(x). Constants come outside.',
        'SUM/DIFFERENCE RULE: d/dx[f(x) ± g(x)] = f\'(x) ± g\'(x). Differentiation distributes over addition.',
        'COMBINED — LINEARITY: d/dx[c₁·f(x) + c₂·g(x)] = c₁·f\'(x) + c₂·g\'(x). Apply to entire polynomials term-by-term.',
        'EXAMPLES (all done by power rule + linearity):',
        '- d/dx[3x⁴] = 12x³.',
        '- d/dx[x⁵ + 2x³ − 7x + 4] = 5x⁴ + 6x² − 7 + 0 = 5x⁴ + 6x² − 7.',
        '- d/dx[5/x²] = d/dx[5x^(-2)] = 5 · (-2) · x^(-3) = -10/x³.',
        '- d/dx[√x] = d/dx[x^(1/2)] = (1/2)·x^(-1/2) = 1/(2√x).',
        'TRICK — REWRITE TO POWER FORM. Negative or fractional exponents are easy when written as x^n. So 1/x = x^(-1); √x = x^(1/2); 1/(x³) = x^(-3); etc. Apply power rule, then convert back to the original form.',
      ],
      vocabulary: [
        { term: 'power rule', definition: 'd/dx[x^n] = n · x^(n-1) for any real n.' },
        { term: 'linearity of differentiation', definition: 'derivative distributes over linear combinations: d/dx[af + bg] = a f\' + b g\'.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-polynomial',
      kind: 'worked_example',
      problem:
        'Find the derivative of f(x) = 3x⁴ − 5x³ + 2/x − √x + 7.',
      steps: [
        'STEP 1 — REWRITE for clarity. f(x) = 3x⁴ − 5x³ + 2x^(-1) − x^(1/2) + 7.',
        'STEP 2 — APPLY POWER RULE TERM BY TERM (with linearity). d/dx[3x⁴] = 12x³. d/dx[5x³] = 15x², so d/dx[-5x³] = -15x². d/dx[2x^(-1)] = -2x^(-2) = -2/x². d/dx[x^(1/2)] = (1/2)x^(-1/2) = 1/(2√x), so d/dx[-x^(1/2)] = -1/(2√x). d/dx[7] = 0.',
        'STEP 3 — COMBINE. f\'(x) = 12x³ − 15x² − 2/x² − 1/(2√x).',
      ],
      answer: 'f\'(x) = 12x³ − 15x² − 2/x² − 1/(2√x)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-power',
      kind: 'try_yourself',
      problem:
        'Differentiate. (a) f(x) = x⁷. (b) g(x) = 4x³. (c) h(x) = -2x^5 + 3x^2 − 7. (d) p(x) = 6/x³. (e) q(x) = √[3]{x} (cube root).',
      expectedAnswer:
        '(a) 7x⁶. (b) 12x². (c) -10x⁴ + 6x. (d) p(x) = 6x^(-3); p\'(x) = -18x^(-4) = -18/x⁴. (e) q(x) = x^(1/3); q\'(x) = (1/3)x^(-2/3) = 1/(3·x^(2/3)) = 1/(3·∛(x²)).',
      responseFormat: 'numeric',
      hints: ['For radicals or 1/x^n, rewrite in x^n form first.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-tangent-line',
      kind: 'try_yourself',
      problem:
        'Find the equation of the tangent line to y = x³ − 2x at x = 1.',
      expectedAnswer:
        'y = x³ − 2x. Compute y\'(x) = 3x² − 2. Slope at x = 1: y\'(1) = 3 − 2 = 1. Point at x = 1: y(1) = 1 − 2 = -1, so (1, -1). Tangent line: y − (-1) = 1 · (x − 1) → y = x − 2.',
      responseFormat: 'numeric',
      hints: [
        'Tangent line: point-slope form. Slope = derivative at x = a; point = (a, f(a)).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-derivative-applications',
      kind: 'try_yourself',
      problem:
        "AP-style synthesis. The derivative of a polynomial of degree n is a polynomial of degree n − 1. Why is this — and what does it imply about the second, third, etc. derivatives of a polynomial?",
      expectedAnswer:
        'Each application of the power rule REDUCES the exponent on every term by 1. So a polynomial whose highest-degree term is x^n becomes a polynomial whose highest-degree term is n·x^(n−1) (degree decreased by 1). Lower-degree terms also drop one degree each. Constant terms (degree 0) become 0 (vanish). IMPLICATIONS for higher derivatives: each successive derivative drops the degree by 1. So for a polynomial of degree n: f, f\', f\'\', ..., f^(n) all exist; f^(n) is a NONZERO CONSTANT (the leading coefficient times n!). f^(n+1) = 0, and all higher derivatives = 0. Example: f(x) = 5x³. f\'(x) = 15x². f\'\'(x) = 30x. f\'\'\'(x) = 30. f\'\'\'\'(x) = 0. Strong answers: identify degree reduction per derivative, characterize the n-th derivative of a degree-n polynomial as a nonzero constant, note all higher derivatives vanish.',
      responseFormat: 'frq',
      hints: ['Each derivative reduces every exponent by 1.'],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'POWER RULE: d/dx[x^n] = n·x^(n-1) for ANY real n.',
        'LINEARITY: derivative distributes; constants come outside.',
        'Constants → 0. Polynomials differentiate term-by-term.',
        'For 1/x^n and roots, rewrite as x^(negative or fractional) first.',
        'Tangent line at x = a: y − f(a) = f\'(a)(x − a).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.5-2.6',
    cedTitle: 'The Power Rule and Linearity',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '2', note: 'Power rule + linearity foundational treatment.' }],
  },
};
