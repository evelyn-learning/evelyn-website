/**
 * AP Calculus BC — Taylor and Maclaurin series.
 *
 * Approximate any smooth function with a polynomial. Famous series
 * for e^x, sin x, cos x, 1/(1-x).
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CALC_BC_TAYLOR_SERIES: LessonPlan = {
  id: 'evelyn.ap.calcbc.taylor-series.v1',
  title: 'Taylor and Maclaurin series',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'calculus',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.taylor-series',
      description: 'Construct and use Taylor / Maclaurin series for common functions.',
      standard: 'AP-CALCBC-LIM-8',
    },
  ],
  prerequisites: ['apcalcbc.series-convergence'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The amazing claim: a polynomial can match a curve PERFECTLY.',
      script: 'A polynomial is just a sum of x, x², x³, … — simple. Yet by adding enough terms, you can match e^x, sin x, cos x — perfectly, on their entire domain. Taylor series turn any smooth function into an infinite polynomial.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-formula-and-famous',
      kind: 'concept',
      goal: 'Taylor formula + key Maclaurin series + radius of convergence.',
      keyIdeas: [
        'TAYLOR SERIES of f(x) centered at a: f(x) = Σ (from n=0) f⁽ⁿ⁾(a)/n! · (x-a)ⁿ.',
        'MACLAURIN SERIES: Taylor series centered at a = 0.',
        'KEY MACLAURIN SERIES (memorize):',
        '  e^x = Σ xⁿ/n! = 1 + x + x²/2! + x³/3! + …',
        '  sin x = Σ (-1)ⁿ x^(2n+1)/(2n+1)! = x - x³/3! + x⁵/5! - …',
        '  cos x = Σ (-1)ⁿ x^(2n)/(2n)! = 1 - x²/2! + x⁴/4! - …',
        '  1/(1-x) = Σ xⁿ for |x| < 1',
        '  ln(1+x) = Σ (-1)ⁿ⁺¹ xⁿ/n for |x| ≤ 1, x ≠ -1',
        'RADIUS OF CONVERGENCE: how far from the center the series equals f(x). For e^x, sin x, cos x: ALL real numbers (R = ∞). For 1/(1-x), ln(1+x): only |x| < 1.',
        'TO FIND: compute the f(x), f\'(x), f\'\'(x), … at the center; substitute into the formula.',
        'OPERATIONS: differentiate or integrate term-by-term within radius of convergence.',
      ],
      vocabulary: [
        { term: 'Taylor series', definition: 'an infinite polynomial representation of a function near a point.' },
        { term: 'radius of convergence', definition: 'how far from the center the series converges to f(x).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-derive-ex',
      kind: 'worked_example',
      problem: 'Derive the Maclaurin series for e^x.',
      steps: [
        'f(x) = e^x. All derivatives: f⁽ⁿ⁾(x) = e^x.',
        'At a = 0: f⁽ⁿ⁾(0) = e⁰ = 1 for every n.',
        'Plug into Taylor formula: e^x = Σ 1/n! · xⁿ = 1 + x + x²/2! + x³/3! + …',
        'This converges for ALL real x.',
      ],
      answer: 'e^x = 1 + x + x²/2! + x³/3! + …',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-from-known',
      kind: 'worked_example',
      problem: 'Find the Maclaurin series for x · sin(x²) using known series.',
      steps: [
        'Known: sin x = x - x³/3! + x⁵/5! - …',
        'Substitute x → x²: sin(x²) = x² - x⁶/3! + x¹⁰/5! - …',
        'Multiply by x: x · sin(x²) = x³ - x⁷/3! + x¹¹/5! - …',
        'Built from a known series — much faster than computing 11 derivatives.',
      ],
      answer: 'x³ - x⁷/3! + x¹¹/5! - …',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What is the Maclaurin series for cos x? Write the first three terms.',
      expectedAnswer: '1 − x²/2! + x⁴/4! − …',
      responseFormat: 'free',
      hints: [
        'Like sin but starts at constant 1.',
        'Even powers, alternating signs.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-always-converge',
      kind: 'misconception_check',
      question: 'Does every Taylor series converge to f(x) for all x?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating Taylor series as universal.',
          correctsTo: 'No — convergence has a RADIUS. e^x, sin x, cos x converge everywhere. 1/(1-x) only for |x| < 1. Some functions even have Taylor series that converge to a DIFFERENT function (pathological cases). Always check radius.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Taylor: f(x) = Σ f⁽ⁿ⁾(a)/n! (x-a)ⁿ. Maclaurin = Taylor at a=0.',
        'Memorize series for e^x, sin x, cos x, 1/(1-x), ln(1+x).',
        'Radius of convergence varies — check each series.',
        'Build new series from known ones by substitution + ops, faster than direct derivation.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How do calculators compute sin x, cos x, e^x?',
      hint: 'Often via Taylor series — compute enough terms for desired precision. Plus tricks like argument reduction (use sin x = sin(x - 2π) to bring x near 0 where the series converges fast).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
