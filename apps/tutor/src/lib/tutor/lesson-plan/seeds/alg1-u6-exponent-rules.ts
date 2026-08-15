/**
 * Algebra 1 — Exponents: Exponent Rules.
 *
 * Product, quotient, and power rules plus power-of-a-product/quotient
 * (CCSS 8.EE.A.1 extended toward N-RN and A-SSE.B.3c). The whole unit
 * hinges on one distinction — multiplying same-base powers ADDS
 * exponents, raising a power to a power MULTIPLIES them — and on seeing
 * that every rule is just counting factors in expanded form.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U6_EXPONENT_RULES: LessonPlan = {
  id: 'evelyn.hs.alg1.exponent-rules.v1',
  title: 'Exponent Rules',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.exponent-rules',
      standard: 'ALG1-6.1',
      description:
        'Simplify expressions using the product, quotient, and power rules together with power of a product and power of a quotient, and justify each rule from expanded form (CCSS 8.EE.A.1, N-RN.A.1, A-SSE.B.3c).',
    },
  ],
  prerequisites: ['alg1.systems-applications'],
  followUps: ['alg1.negative-exponents-scientific-notation'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame exponent rules as the compact language for anything that repeatedly doubles or scales — and as the toolkit every polynomial chapter runs on.',
      script:
        'A single bacterium that splits every hour becomes 2¹⁰ bacteria overnight — that is about a thousand, from one. Exponents are how we write repeated multiplication without writing a page of x times x times x. Today we learn the handful of rules that let you combine them, and the one mix-up that trips up almost everyone: when do you ADD the exponents and when do you MULTIPLY them?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rules',
      kind: 'concept',
      goal: 'The five rules, where they come from in expanded form, and the add-vs-multiply distinction that separates them.',
      keyIdeas: [
        'PRODUCT RULE — xᵃ · xᵇ = xᵃ⁺ᵇ. Multiplying powers of the SAME base ADDS the exponents: x³ · x⁵ = x⁸.',
        'QUOTIENT RULE — xᵃ / xᵇ = xᵃ⁻ᵇ. Dividing powers of the same base SUBTRACTS the exponents: x⁷ / x⁴ = x³.',
        'POWER RULE — (xᵃ)ᵇ = xᵃᵇ. Raising a power to a power MULTIPLIES the exponents: (x³)⁵ = x¹⁵.',
        'POWER OF A PRODUCT / QUOTIENT — the outside exponent lands on EVERY factor inside: (xy)ᵃ = xᵃyᵃ and (x/y)ᵃ = xᵃ/yᵃ. The coefficient is a factor too, so (3x²)³ = 3³ · x⁶ = 27x⁶ — not 3x⁶.',
        'WHY THEY WORK — COUNT THE FACTORS: x³ · x² = (x·x·x)(x·x) = x⁵, five factors in a row. And (x³)² = (x·x·x)(x·x·x) = x⁶, three factors taken twice. You never have to memorize which rule adds and which multiplies if you can expand a small case and count.',
        'ADD vs MULTIPLY — the classic mix-up in one line: x³ · x⁵ = x⁸ (product rule, ADD), but (x³)⁵ = x¹⁵ (power rule, MULTIPLY). Read the parentheses before you touch the exponents.',
        'SAME BASE ONLY — x³ · y⁴ cannot be combined; there is no rule for different bases. And x³ + x⁵ is NOT an exponent rule at all — addition needs like terms, so it stays as it is, while x³ + x³ = 2x³.',
        'WATCH THE BASE — 2x³ means 2 · x · x · x, so only the x is cubed; (2x)³ = 2³x³ = 8x³, where the parentheses put the 2 inside the base.',
      ],
      vocabulary: [
        { term: 'base', definition: 'in xᵃ, the x — the factor being repeated.' },
        { term: 'coefficient', definition: 'the number multiplying a power, like the 3 in 3x² — it is a factor, so an outside exponent applies to it too.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-combine',
      kind: 'worked_example',
      problem: 'Simplify: (3x²y⁵)³ · 2xy / (9x⁴y⁶)',
      steps: [
        'Power of a product first — the exponent 3 hits every factor: (3x²y⁵)³ = 3³ · x⁶ · y¹⁵ = 27x⁶y¹⁵. Note the exponents 2 and 5 got MULTIPLIED by 3.',
        'Multiply by 2xy using the product rule: coefficients 27 · 2 = 54, and ADD exponents — x⁶⁺¹ = x⁷, y¹⁵⁺¹ = y¹⁶. So far: 54x⁷y¹⁶.',
        'Divide by 9x⁴y⁶ using the quotient rule: coefficients 54 / 9 = 6, and SUBTRACT exponents — x⁷⁻⁴ = x³, y¹⁶⁻⁶ = y¹⁰.',
        'Final: 6x³y¹⁰. Sanity check with x = y = 1: the original is (3)³ · 2 / 9 = 54/9 = 6, and 6(1)(1) = 6. ✓',
      ],
      answer: '6x³y¹⁰',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-add-vs-multiply',
      kind: 'worked_example',
      problem: 'Simplify BOTH and explain why the answers differ: (2a⁴)³ and 2a⁴ · a³',
      steps: [
        '(2a⁴)³ — the cube is OUTSIDE the parentheses, so it applies to both factors: 2³ · (a⁴)³ = 8 · a¹² = 8a¹². Power rule multiplied 4 by 3, and the coefficient 2 got cubed as well.',
        '2a⁴ · a³ — this is a multiplication of two powers of a, so the product rule ADDS: a⁴⁺³ = a⁷. The coefficient 2 is only multiplied by 1, so it stays: 2a⁷.',
        'Compare: 8a¹² versus 2a⁷. Same-looking pieces, completely different results — the parentheses decided it.',
        'Check with a = 1: (2·1)³ = 8 and 8(1)¹² = 8 ✓; 2·1·1 = 2 and 2(1)⁷ = 2 ✓. Check the first with a = 2: (2 · 16)³ = 32³ = 32768, and 8 · 2¹² = 8 · 4096 = 32768. ✓',
      ],
      answer: '(2a⁴)³ = 8a¹²; 2a⁴ · a³ = 2a⁷',
      estimatedMinutes: 3,
    },
    {
      id: 'try-power-of-product',
      kind: 'try_yourself',
      problem: 'Simplify: (5x³)² · x⁴',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '25x¹⁰', correct: true },
        { id: 'b', text: '10x¹⁰' },
        { id: 'c', text: '5x¹⁰' },
        { id: 'd', text: '25x²⁴' },
      ],
      expectedAnswer: '25x¹⁰',
      hints: [
        'Handle the parentheses first — the exponent 2 applies to the 5 as well as to x³.',
        '(5x³)² = 25x⁶. Now multiply by x⁴: same base, so ADD the exponents.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-power-of-quotient',
      kind: 'try_yourself',
      problem: 'Simplify: (2x³ / y²)⁴',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '8x¹²/y⁸' },
        { id: 'b', text: '16x¹²/y⁸', correct: true },
        { id: 'c', text: '2x¹²/y⁸' },
        { id: 'd', text: '16x⁷/y⁶' },
      ],
      expectedAnswer: '16x¹²/y⁸',
      hints: [
        'Power of a quotient: the exponent 4 lands on the top and the bottom — and on the coefficient 2.',
        '2⁴ = 16, and (x³)⁴ and (y²)⁴ use the power rule, so multiply those exponents.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem: 'The expression (x⁵)³ · x² / x⁹ simplifies to xⁿ. Type the value of n as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '8',
      hints: [
        'Start inside: (x⁵)³ is a power to a power, so multiply — that gives x¹⁵.',
        'Then ADD 2 for the multiplication and SUBTRACT 9 for the division.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-add-vs-multiply',
      kind: 'misconception_check',
      question: 'A student writes x³ · x⁵ = x¹⁵ and, on the next line, x³ + x³ = x⁶. Both are wrong. What are the correct answers, and what is the student mixing up?',
      commonErrors: [
        {
          answer: 'x³ · x⁵ = x¹⁵',
          misconception: 'Multiplying the exponents because the bases are being multiplied — borrowing the power rule for a product-rule situation.',
          correctsTo: 'x³ · x⁵ = x⁸. Expand it: (x·x·x)(x·x·x·x·x) is eight x factors in a row, so you ADD. Exponents multiply only when a power is raised to a power, as in (x³)⁵ = x¹⁵.',
        },
        {
          answer: 'x³ + x³ = x⁶',
          misconception: 'Applying the product rule to ADDITION — exponent rules only describe multiplying and dividing powers.',
          correctsTo: 'x³ + x³ = 2x³. These are like terms, so you count them: one x³ plus another x³ is two of them. The exponent never changes when you add.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Same base: multiply → ADD exponents; divide → SUBTRACT exponents.',
        'Power to a power → MULTIPLY exponents. Parentheses are the signal.',
        'An outside exponent hits every factor inside, coefficient included: (3x²)³ = 27x⁶.',
        'When in doubt, expand a small case and count the factors — that is where every rule comes from.',
        'Addition is not an exponent rule: x³ + x³ = 2x³, not x⁶.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'Exponent Rules' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
