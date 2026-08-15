/**
 * Grades 11-12 Math — Recursive Sequences and Closed-Form Formulas.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_MATH_SEQUENCES_RECURSIVE: LessonPlan = {
  id: 'evelyn.g1112.math.sequences-recursive.v1',
  title: 'Sequences — Recursive Definitions and Closed Forms',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'sequences-series',
  locale: 'en',
  los: [{ id: 'g1112.math.sequences.recursive', description: 'Convert between recursive and explicit (closed-form) definitions for arithmetic, geometric, and Fibonacci-style sequences.', standard: 'CCSS.MATH.CONTENT.HSF.LE.A.2' }],
  prerequisites: ['g1112.math.sequences.sigma'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'A sequence can be defined two ways — by recursion (each term from the previous) or explicitly (a formula for the n-th term directly).', script: 'Fibonacci: 1, 1, 2, 3, 5, 8, 13... You can describe it as "each term is the sum of the previous two" (recursive) or with a closed-form formula. Both work — and each has a use.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Recursive vs explicit, common types, conversion.', keyIdeas: [
      'RECURSIVE definition: gives the FIRST term + a rule for getting the next from previous terms.',
      '  Arithmetic: a₁ = 3, aₙ = aₙ₋₁ + 2. (each term = previous + 2.)',
      '  Geometric: a₁ = 5, aₙ = 3 · aₙ₋₁. (each term = previous × 3.)',
      '  Fibonacci: a₁ = 1, a₂ = 1, aₙ = aₙ₋₁ + aₙ₋₂.',
      'EXPLICIT (closed form): direct formula for aₙ as a function of n.',
      '  Arithmetic: aₙ = a₁ + (n − 1)d, where d = common difference.',
      '  Geometric: aₙ = a₁ · r^(n−1), where r = common ratio.',
      'CONVERTING recursive ⟶ explicit:',
      '  Arithmetic: identify a₁ and d. Plug in.',
      '  Geometric: identify a₁ and r. Plug in.',
      '  Fibonacci-style: harder; uses the characteristic equation, leading to Binet\'s formula. Beyond standard HS curriculum.',
      'WHY BOTH FORMS:',
      '  Recursive: easy to write down from a description.',
      '  Explicit: easy to compute aₙ for large n directly.',
      '  Example: to find a₁₀₀ in arithmetic with a₁ = 3, d = 2: explicit is INSTANT (a₁₀₀ = 3 + 99·2 = 201). Recursive would require computing all 99 prior terms.',
      'COMPUTATION: when programming, recursive can be expensive (O(2ⁿ) for naive Fibonacci). Use memoisation or closed form when n is large.',
    ], vocabulary: [{ term: 'recursive definition', definition: 'a definition that uses the function being defined; for sequences, gives a term in terms of previous terms plus a base case.' }, { term: 'closed form', definition: 'an explicit formula computing aₙ directly from n, without referring to other terms.' }], estimatedMinutes: 5 },
    { id: 'worked', kind: 'worked_example', problem: 'Sequence: a₁ = 4, aₙ = aₙ₋₁ + 7. Find the explicit formula and compute a₂₀.', steps: [
      'Recognise pattern: each term adds 7. Arithmetic with a₁ = 4, d = 7.',
      'Explicit formula: aₙ = a₁ + (n − 1)d = 4 + 7(n − 1) = 7n − 3.',
      'Verify: a₁ = 7(1) − 3 = 4 ✓. a₂ = 7(2) − 3 = 11 (recursive: 4 + 7 = 11 ✓).',
      'a₂₀ = 7(20) − 3 = 137.',
    ], answer: 'aₙ = 7n − 3; a₂₀ = 137', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Sequence: a₁ = 2, aₙ = 3·aₙ₋₁. Find the explicit formula and a₅.', expectedAnswer: 'Geometric with a₁ = 2, r = 3. Explicit: aₙ = 2 · 3^(n−1). a₅ = 2 · 3⁴ = 2 · 81 = 162.', responseFormat: 'free', hints: ['Multiplying by a constant means geometric.', 'Use aₙ = a₁ · r^(n−1).'], estimatedMinutes: 3 },
    { id: 'misconception-recursive-only', kind: 'misconception_check', question: 'A student finds a₁₀₀ by computing all 99 prior terms recursively. Why is the closed form better here?', commonErrors: [{ answer: 'Always use recursive', misconception: 'Treating recursive form as the only option.', correctsTo: 'Recursive computation requires you to compute every prior term in sequence — O(n) work. Closed form computes aₙ directly in constant time. For a₁₀₀, recursive is 99 additions; closed form is one substitution. Always: when an explicit formula exists, use it for direct computation. Reserve recursive for cases where you can\'t derive a closed form (e.g., complex Fibonacci, or sequences without a simple pattern).' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Recursive: base case + rule from previous.', 'Explicit: aₙ as direct formula in n.', 'Arithmetic: aₙ = a₁ + (n−1)d.', 'Geometric: aₙ = a₁ · r^(n−1).', 'Use closed form for direct computation; recursive for description.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
