/**
 * G12 — Calculus: Derivative rules (power, product, quotient, chain).
 *
 * Beyond the derivative-as-slope intuition: the four mechanical
 * rules every calc student needs. Power rule (most-used). Product
 * and quotient rules. Chain rule (most-confused). Practice with
 * each and the pattern-recognition for which to apply.
 */

import type { LessonPlan } from '../types';

export const SEED_G12_CALC_DERIVATIVE_RULES: LessonPlan = {
  id: 'evelyn.g12.math.calc.derivative-rules.v1',
  title: 'Derivative Rules: Power, Product, Quotient, Chain',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'calculus',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.calc.deriv-rules',
      description: 'Apply power, product, quotient, and chain rules to compute derivatives.',
    },
  ],
  prerequisites: ['ccss.math.calc.limits'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the case that knowing rules >> computing limits every time.',
      script: 'You know the derivative is "the limit of (f(x+h) - f(x))/h as h goes to zero." That works — but no one wants to compute that limit for every problem. Mathematicians figured out shortcuts: rules that give you the derivative directly. Master four of them and you can differentiate almost anything you\'ll see.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-rules',
      kind: 'concept',
      goal: 'Power, product, quotient, chain — with pattern-recognition cues.',
      keyIdeas: [
        'POWER RULE: d/dx [xⁿ] = n·xⁿ⁻¹.',
        '  d/dx [x³] = 3x². d/dx [x⁵] = 5x⁴.',
        '  Works for any constant exponent — including negatives and fractions.',
        '  CONSTANT MULTIPLE: d/dx [c·f(x)] = c·f\'(x).',
        '  SUM RULE: d/dx [f + g] = f\' + g\'.',
        'PRODUCT RULE: d/dx [f·g] = f\'·g + f·g\'.',
        '  ("First times derivative of second, plus second times derivative of first" — or any consistent order.)',
        '  Use when you have two functions MULTIPLIED.',
        'QUOTIENT RULE: d/dx [f/g] = (f\'·g − f·g\')/g².',
        '  ("Low D-high minus high D-low, all over low squared.")',
        '  Use when you have one function DIVIDED by another.',
        '  Order matters! It\'s f\'·g − f·g\', NOT f·g\' − f\'·g.',
        'CHAIN RULE: d/dx [f(g(x))] = f\'(g(x)) · g\'(x).',
        '  "Derivative of the OUTSIDE (with the inside left alone) times the derivative of the INSIDE."',
        '  Use whenever you have a FUNCTION INSIDE A FUNCTION (composition).',
        '  Example: d/dx [(2x + 1)³] = 3(2x + 1)² · 2 = 6(2x + 1)².',
        'PATTERN RECOGNITION:',
        '  Just powers of x → POWER rule.',
        '  Two things multiplied → PRODUCT rule.',
        '  One thing divided by another → QUOTIENT rule.',
        '  Function inside another function → CHAIN rule.',
        'You\'ll often combine them. Big strategy: identify the OUTERMOST operation first.',
      ],
      vocabulary: [
        { term: 'power rule', definition: 'd/dx [xⁿ] = n·xⁿ⁻¹.' },
        { term: 'chain rule', definition: 'derivative of a composite function — outer derivative × inner derivative.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-power',
      kind: 'worked_example',
      problem: 'Find d/dx [4x³ - 7x + 2].',
      steps: [
        'Apply rules term-by-term using power rule + sum rule + constant multiple.',
        'd/dx [4x³] = 4 · 3x² = 12x².',
        'd/dx [-7x] = -7. (Power 1 → coefficient.)',
        'd/dx [2] = 0. (Constant → zero.)',
        'Total: 12x² - 7.',
      ],
      answer: '12x² - 7',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-product',
      kind: 'worked_example',
      problem: 'Find d/dx [x² · sin(x)].',
      steps: [
        'Two functions multiplied → product rule.',
        'f = x², f\' = 2x. g = sin(x), g\' = cos(x).',
        'Product rule: f\'g + fg\' = 2x · sin(x) + x² · cos(x).',
      ],
      answer: '2x sin(x) + x² cos(x)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-chain',
      kind: 'worked_example',
      problem: 'Find d/dx [(3x + 1)⁵].',
      steps: [
        'Function inside a function: outer is "()⁵", inner is 3x + 1.',
        'OUTER derivative (treating inner as a single thing): 5(3x + 1)⁴.',
        'INNER derivative: d/dx [3x + 1] = 3.',
        'Multiply: 5(3x + 1)⁴ · 3 = 15(3x + 1)⁴.',
      ],
      answer: '15(3x + 1)⁴',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find d/dx [(x² + 1)³].',
      expectedAnswer: '6x(x² + 1)²',
      responseFormat: 'free',
      hints: [
        'Chain rule: outer is ()³, inner is x² + 1.',
        'Outer derivative: 3(x² + 1)². Inner derivative: 2x.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-forget-inner',
      kind: 'misconception_check',
      question: 'Solving d/dx [(2x + 5)⁴], Sage writes 4(2x + 5)³. What\'s missing?',
      commonErrors: [
        {
          answer: 'nothing',
          misconception: 'Forgetting the inner-derivative factor in chain rule.',
          correctsTo: 'Forgot the inner derivative. Chain rule needs you to multiply by d/dx [inner]. Inner is (2x + 5), so its derivative is 2. Correct: 4(2x + 5)³ · 2 = 8(2x + 5)³. The "·(inner derivative)" is the most-skipped step in calculus.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Power: d/dx [xⁿ] = n·xⁿ⁻¹.',
        'Product: f\'g + fg\'.',
        'Quotient: (f\'g - fg\')/g².',
        'Chain: outer\' · inner\'. NEVER forget the inner derivative.',
        'Identify the OUTERMOST operation first to choose the rule.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Find d/dx [sin(x²)].',
      hint: 'Chain rule. Outer: sin(). Inner: x². Outer derivative: cos(x²). Inner derivative: 2x. Result: 2x · cos(x²).',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
