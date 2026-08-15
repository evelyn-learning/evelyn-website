/**
 * AP Calculus BC — CED Unit 3.1: The Chain Rule.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U3_CHAIN_RULE: LessonPlan = {
  id: 'evelyn.ap.calcbc.chain-rule.v1',
  title: 'U3.1 The Chain Rule',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.chain-rule',
      description:
        'State and apply the chain rule for composite functions: d/dx[f(g(x))] = f\'(g(x))·g\'(x). Recognize compositions and apply systematically including nested compositions.',
      standard: 'AP-CALCBC-3.1',
    },
  ],
  prerequisites: ['apcalcbc.quotient-rule'],
  followUps: ['apcalcbc.implicit-differentiation'],
  estimatedMinutes: 26,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame chain rule as the master rule that handles compositions.',
      script:
        "Up to now we've differentiated simple functions. But sin(2x), e^(x²), ln(3x+1), (x²+1)¹⁰⁰ — these are COMPOSITIONS. The CHAIN RULE handles them all. Master this and you can differentiate almost anything in calculus. AP exam questions test it constantly.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-chain',
      kind: 'concept',
      goal: 'State the chain rule + the "outer-inner" intuition + nested-composition extension.',
      keyIdeas: [
        'CHAIN RULE: d/dx[f(g(x))] = f\'(g(x)) · g\'(x).',
        'PARSE: "derivative of OUTER (evaluated at inner) times derivative of INNER".',
        'Equivalently in Leibniz notation: dy/dx = dy/du · du/dx, where y = f(u) and u = g(x). The "u" notation makes the chain explicit.',
        'IDENTIFICATION — what\'s the OUTER and what\'s the INNER? When you see f(STUFF), the OUTER function is f, the INNER is STUFF. For sin(2x): outer = sin, inner = 2x. For e^(x²): outer = e^?, inner = x². For (x²+1)¹⁰⁰: outer = (?)¹⁰⁰, inner = x²+1.',
        'WORKED PATTERN. d/dx[sin(2x)] = cos(2x) · d/dx[2x] = cos(2x) · 2 = 2cos(2x). d/dx[e^(x²)] = e^(x²) · 2x. d/dx[(x²+1)¹⁰⁰] = 100(x²+1)⁹⁹ · 2x = 200x(x²+1)⁹⁹.',
        'NESTED COMPOSITIONS. Apply chain rule REPEATEDLY from outside in. d/dx[sin(e^(2x))] = cos(e^(2x)) · d/dx[e^(2x)] = cos(e^(2x)) · e^(2x) · 2 = 2 e^(2x) cos(e^(2x)).',
        'POWER + CHAIN — the "general power rule": d/dx[(g(x))^n] = n·(g(x))^(n-1) · g\'(x). Most-tested chain rule pattern.',
        'RECOGNIZING THE NEED. Anytime you see a function INSIDE another function — sin(...), e^(...), ln(...), (...)^n, √(...), etc. — chain rule applies.',
      ],
      vocabulary: [
        { term: 'composition', definition: 'f(g(x)) where one function is "fed into" another.' },
        { term: 'chain rule', definition: 'd/dx[f(g(x))] = f\'(g(x))·g\'(x). Outer-derivative-at-inner times inner-derivative.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-chain',
      kind: 'worked_example',
      problem:
        'Differentiate. (a) y = (3x² + 2x)⁵. (b) y = sin(x³). (c) y = e^(2x − 1). (d) y = ln(x² + 5).',
      steps: [
        'STEP 1 — (a) Outer: (?)⁵. Inner: 3x² + 2x. Inner derivative: 6x + 2. Apply chain: 5(3x² + 2x)⁴ · (6x + 2).',
        'STEP 2 — (b) Outer: sin. Inner: x³ (derivative 3x²). Chain: cos(x³) · 3x² = 3x² cos(x³).',
        'STEP 3 — (c) Outer: e^?. Inner: 2x − 1 (derivative 2). Chain: e^(2x − 1) · 2 = 2 e^(2x − 1).',
        'STEP 4 — (d) Outer: ln. Inner: x² + 5 (derivative 2x). Chain: (1/(x² + 5)) · 2x = 2x/(x² + 5).',
      ],
      answer: '(a) 5(3x² + 2x)⁴(6x + 2). (b) 3x² cos(x³). (c) 2e^(2x−1). (d) 2x/(x² + 5).',
      estimatedMinutes: 5,
    },
    {
      id: 'try-chain-1',
      kind: 'try_yourself',
      problem:
        'Differentiate. (a) y = cos(5x). (b) y = (x² − 7)¹⁰. (c) y = √(x² + 1). (d) y = e^(sin x).',
      expectedAnswer:
        '(a) -sin(5x)·5 = -5 sin(5x). (b) 10(x² − 7)⁹·2x = 20x(x² − 7)⁹. (c) y = (x²+1)^(1/2). y\' = (1/2)(x²+1)^(-1/2)·2x = x/√(x² + 1). (d) e^(sin x) · cos x.',
      responseFormat: 'numeric',
      hints: ['Outer derivative at inner, times inner derivative.'],
      estimatedMinutes: 4,
    },
    {
      id: 'try-nested',
      kind: 'try_yourself',
      problem:
        'Differentiate y = sin(cos(x²)). (Three nested functions: sin, cos, x².)',
      expectedAnswer:
        'Outermost: sin(?). Inner first level: cos(x²). Innermost: x². Apply chain twice: dy/dx = cos(cos(x²)) · d/dx[cos(x²)] = cos(cos(x²)) · [-sin(x²)·2x] = -2x sin(x²) cos(cos(x²)).',
      responseFormat: 'numeric',
      hints: ['Apply chain rule recursively. Outer first; bring out factor; chain on the next level.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-product-and-chain',
      kind: 'try_yourself',
      problem:
        'Differentiate y = x² · e^(3x). Apply BOTH product rule AND chain rule.',
      expectedAnswer:
        'Product rule: d/dx[x² · e^(3x)] = 2x · e^(3x) + x² · d/dx[e^(3x)]. d/dx[e^(3x)] uses chain: e^(3x) · 3 = 3 e^(3x). So result: 2x e^(3x) + 3x² e^(3x) = e^(3x)(2x + 3x²) = x e^(3x)(2 + 3x).',
      responseFormat: 'numeric',
      hints: ['Product rule first; chain rule INSIDE the e^(3x) derivative.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-table-application',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Suppose f(2) = 5, f\'(2) = 3, g(1) = 2, g\'(1) = 4. Find d/dx[f(g(x))] at x = 1.',
      expectedAnswer:
        'By chain rule: d/dx[f(g(x))] = f\'(g(x))·g\'(x). At x = 1: f\'(g(1))·g\'(1) = f\'(2)·4 = 3·4 = 12. (Note g(1) = 2, so we need f\' evaluated AT 2.) Strong answers: state chain rule, identify g(1) value, plug in correctly.',
      responseFormat: 'numeric',
      hints: ['Chain rule: f\'(g(x))·g\'(x). Look up g(x) value first.'],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'CHAIN RULE: d/dx[f(g(x))] = f\'(g(x))·g\'(x). Outer at inner, times inner derivative.',
        'Recognize compositions: f of (something).',
        'Nested compositions: apply chain RECURSIVELY from outside in.',
        'Combine with product / quotient / power rules as needed.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.1',
    cedTitle: 'The Chain Rule',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '3', note: 'Chain rule treatment.' }],
  },
};
