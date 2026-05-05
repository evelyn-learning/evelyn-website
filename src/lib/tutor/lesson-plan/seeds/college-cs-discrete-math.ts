/**
 * College Intro — Discrete Mathematics for CS.
 *
 * Logic, sets, functions, proof techniques, basic combinatorics, graphs.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_CS_DISCRETE_MATH: LessonPlan = {
  id: 'evelyn.college.discrete-math.v1',
  title: 'Discrete math for CS — logic, sets, proofs, combinatorics',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'cs',
  topic: 'discrete-math-cs',
  locale: 'en',
  los: [
    {
      id: 'college.discrete',
      description: 'Apply propositional logic, set theory, and basic counting techniques to CS reasoning.',
      standard: 'COLLEGE-DISCRETE',
    },
  ],
  prerequisites: [],
  followUps: ['college.algorithms'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame discrete math as the language CS reasons in.',
      script: 'Most CS isn\'t calculus — it\'s discrete. Sets, logic, functions, graphs, counting. When you debate "is my code correct" or "how many test cases do I need", you\'re using discrete math whether you know it or not. This course makes the tools explicit.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-discrete',
      kind: 'concept',
      goal: 'Logic, sets, functions, induction, counting, graphs.',
      keyIdeas: [
        'PROPOSITIONAL LOGIC: P, Q are propositions (true/false). Operators: ∧ (and), ∨ (or), ¬ (not), → (implies), ↔ (iff).',
        'TRUTH TABLE: enumerate all input values to verify equivalences. P → Q is FALSE only when P true, Q false.',
        'SETS: collections {1, 2, 3}. Operations: ∪ (union), ∩ (intersection), \\ (difference), ⊆ (subset).',
        'FUNCTION f: A → B. Injection (one-to-one), surjection (onto), bijection (both).',
        'PROOF BY INDUCTION: prove P(0). Prove P(k) → P(k+1). Then P(n) holds for all n ≥ 0.',
        'COUNTING: product rule (independent choices multiply), sum rule (disjoint cases add). Permutations P(n,k) = n!/(n-k)!. Combinations C(n,k) = n!/(k!(n-k)!).',
        'GRAPH: vertices V + edges E. Tree = connected, acyclic. n vertices, n-1 edges, unique path between any two.',
        'PIGEONHOLE: n+1 pigeons in n holes → some hole has ≥ 2. Surprisingly powerful for existence proofs.',
      ],
      vocabulary: [
        { term: 'induction', definition: 'proof technique: base case + inductive step proves a statement for all n.' },
        { term: 'bijection', definition: 'a function that is both one-to-one and onto.' },
        { term: 'pigeonhole principle', definition: 'if you put n+1 items in n boxes, at least one box has 2 items.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-induction',
      kind: 'worked_example',
      problem: 'Prove by induction that 1 + 2 + 3 + ... + n = n(n+1)/2.',
      steps: [
        'BASE CASE n = 1: LHS = 1. RHS = 1·2/2 = 1. ✓',
        'INDUCTIVE STEP: assume true for n = k: 1+2+...+k = k(k+1)/2.',
        'Show for n = k+1: 1+2+...+k+(k+1) = k(k+1)/2 + (k+1)',
        '                                    = (k+1)(k/2 + 1) = (k+1)(k+2)/2. ✓',
        'By induction, the formula holds for all n ≥ 1.',
      ],
      answer: 'n(n+1)/2 by induction.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How many distinct passwords are there of length 8 using digits 0-9 only?',
      expectedAnswer: '10^8 = 100,000,000',
      responseFormat: 'free',
      hints: [
        'Each position is independent — product rule.',
        '10 choices per position, 8 positions.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-implies',
      kind: 'misconception_check',
      question: 'A student says: "If P is false, then P → Q is false." Where does this break?',
      commonErrors: [
        {
          answer: 'because P is false',
          misconception: 'Treating implication as causation.',
          correctsTo: 'P → Q is FALSE only when P is true and Q is false. When P is false, P → Q is VACUOUSLY TRUE regardless of Q. Reading: "if it rains, the ground is wet" is TRUE on a sunny day with dry ground — the premise wasn\'t triggered, so the implication isn\'t broken. Implication is about consistency of premise → conclusion, not real-world causation.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'P → Q is false only when P true and Q false.',
        'Sets: ∪, ∩, \\, ⊆.',
        'Induction: base + inductive step.',
        'Counting: product / sum / permutations / combinations.',
        'Pigeonhole: surprisingly often the right hammer.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does CS care about whether a function is injective, surjective, or bijective?',
      hint: 'INJECTION: encode without losing information (compression, hashing). SURJECTION: every output is reachable (test coverage, ranges). BIJECTION: invertible — encryption, encoding/decoding, isomorphism between data structures. Counting bijections is also how you count things abstractly (combinatorial proofs).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
