/**
 * GCSE Math Higher — Surds & Indices.
 * AQA/Edexcel/OCR Higher tier. Index laws, surd simplification,
 * rationalising denominators.
 */

import type { LessonPlan } from '../types';

export const SEED_GCSE_MATH_SURDS_INDICES: LessonPlan = {
  id: 'evelyn.gcse.math.surds-indices.v1',
  title: 'GCSE Higher — Surds & Indices',
  curriculum: 'GCSE',
  grade: '10-11',
  subject: 'math',
  topic: 'gcse-math',
  locale: 'en-GB',
  los: [
    {
      id: 'gcse.math.surds-indices',
      description: 'Apply index laws (positive, negative, fractional), simplify surds, and rationalise denominators.',
      standard: 'GCSE-MATH-N6/N7/N8',
    },
  ],
  prerequisites: [],
  followUps: ['gcse.math.algebra-factor'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Surds and indices are exam-paper staples — Higher students who guess on these lose easy method marks.',
      script: 'Look at any GCSE Higher non-calculator paper and you\'ll see surds and indices in the first 30 minutes. They\'re not hard once the laws click, but they look intimidating because √ and fractional powers feel separate from "real" arithmetic. By the end of this lesson you\'ll see them as one toolkit.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-laws',
      kind: 'concept',
      goal: 'Cement the index laws and the surd manipulation rules.',
      keyIdeas: [
        'INDEX LAWS: aᵐ × aⁿ = aᵐ⁺ⁿ. aᵐ ÷ aⁿ = aᵐ⁻ⁿ. (aᵐ)ⁿ = aᵐⁿ. a⁰ = 1 (for a ≠ 0). a⁻ⁿ = 1/aⁿ.',
        'FRACTIONAL INDICES: a^(1/n) = ⁿ√a. a^(m/n) = (ⁿ√a)ᵐ = ⁿ√(aᵐ). The denominator of the fraction is the root, the numerator is the power.',
        'SURD = an irrational root left in exact form, e.g. √2, √7, ³√5. Surds appear when an answer must be EXACT (no decimal).',
        'SURD MULTIPLICATION: √a × √b = √(ab). √a × √a = a (NOT 2a — the radicals cancel). Use to simplify: √50 = √(25×2) = 5√2.',
        'SURD ADDITION: only LIKE surds add. √2 + √2 = 2√2 (correct). √2 + √3 ≠ √5 (wrong — different surds, leave separate).',
        'RATIONALISING DENOMINATOR: multiply top and bottom by the surd to clear it. 1/√3 = √3/3. For 1/(2+√3): multiply by conjugate (2−√3)/(2−√3) → (2−√3)/(4−3) = 2−√3.',
      ],
      vocabulary: [
        { term: 'surd', definition: 'an irrational root expressed exactly, e.g. √2, ³√5.' },
        { term: 'rationalise', definition: 'remove a surd from the denominator of a fraction by multiplying top and bottom by an appropriate surd or conjugate.' },
        { term: 'conjugate', definition: 'the partner of a + b√n that flips the sign: a − b√n. Used to rationalise binomial surd denominators.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-rationalise',
      kind: 'worked_example',
      problem: 'Simplify (5 + √3) / (2 − √3), giving your answer in the form a + b√3 where a, b are integers.',
      steps: [
        'Identify the conjugate of the denominator (2 − √3) → its conjugate is (2 + √3).',
        'Multiply top and bottom by (2 + √3): numerator (5 + √3)(2 + √3) and denominator (2 − √3)(2 + √3).',
        'Numerator: 5·2 + 5·√3 + √3·2 + √3·√3 = 10 + 5√3 + 2√3 + 3 = 13 + 7√3.',
        'Denominator: (2 − √3)(2 + √3) is the difference of squares = 2² − (√3)² = 4 − 3 = 1.',
        'Final: (13 + 7√3)/1 = 13 + 7√3. So a = 13, b = 7.',
      ],
      answer: '13 + 7√3',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Write 32^(3/5) as an integer.',
      expectedAnswer: '8',
      responseFormat: 'numeric',
      hints: [
        'Rewrite 32 as a power of 2.',
        '32 = 2⁵, so 32^(3/5) = (2⁵)^(3/5).',
        'Multiply the exponents: 5 × (3/5) = 3, giving 2³.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-add-surds',
      kind: 'misconception_check',
      question: 'Is √4 + √9 = √13? If not, what is the correct value?',
      commonErrors: [
        {
          answer: '√13',
          misconception: 'Treating √a + √b as √(a + b). The square-root function is NOT linear — it does not distribute over addition.',
          correctsTo: 'Compute each surd first: √4 = 2 and √9 = 3, so √4 + √9 = 2 + 3 = 5. Note √13 ≈ 3.6, which is clearly not 5. The general rule: √(a + b) ≠ √a + √b. Only LIKE surds combine, and only when the radicand matches exactly (e.g. √2 + 3√2 = 4√2).',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Index laws: aᵐ × aⁿ = aᵐ⁺ⁿ; (aᵐ)ⁿ = aᵐⁿ; a⁰ = 1; a⁻ⁿ = 1/aⁿ.',
        'Fractional powers: a^(m/n) = (ⁿ√a)ᵐ — denominator is root, numerator is power.',
        'Simplify surds by extracting square factors: √50 = 5√2.',
        'Rationalise binomial denominators by multiplying by the conjugate; difference of squares clears the surd.',
        'Only LIKE surds add together. √a + √b ≠ √(a+b).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Show that (3 − 2√2)(3 + 2√2) is rational, and use this to rationalise 1/(3 − 2√2).',
      hint: 'Difference of squares: (3 − 2√2)(3 + 2√2) = 9 − 8 = 1. So 1/(3 − 2√2) = (3 + 2√2)/1 = 3 + 2√2. Whenever the conjugate-product equals 1, rationalising is essentially free.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
