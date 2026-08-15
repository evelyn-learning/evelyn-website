/**
 * College Intro — Discrete Mathematics (math department version).
 *
 * Companion to the cs-department discrete plan. This one frames the
 * material for math majors — emphasis on proofs and structures.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_MATH_DISCRETE_MATH: LessonPlan = {
  id: 'evelyn.college.math.discrete-math.v1',
  title: 'Discrete Mathematics — proof, sets, combinatorics, structures',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'math',
  topic: 'discrete-math',
  locale: 'en',
  los: [
    {
      id: 'college.math.discrete-math',
      description: 'Apply proof techniques (direct, contrapositive, contradiction, induction), set theory, combinatorics, and basic graph structures.',
      standard: 'COLLEGE-DISCRETE',
    },
  ],
  prerequisites: ['g912.math.algebra-2'],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Discrete math is the bridge from "doing math" to "proving math."',
      script: 'Up to now, math has mostly been about computation — get the answer, check it, move on. Discrete math is the course where the answer becomes "prove it works for ALL cases" — and that requires a different toolkit. Today we drill the four main proof techniques and the structures they apply to.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-discrete',
      kind: 'concept',
      goal: 'Logic, sets, proof techniques, induction, counting principles, basic graphs.',
      keyIdeas: [
        'PROPOSITIONAL LOGIC: P, Q are statements. Operators ∧ (and), ∨ (or), ¬ (not), → (implies), ↔ (iff). P → Q is FALSE only when P is true and Q is false.',
        'CONTRAPOSITIVE: P → Q is logically equivalent to ¬Q → ¬P. Often easier to prove the contrapositive.',
        'SETS: {a, b, c}. Operations: ∪ (union), ∩ (intersection), \\ (set difference), Aᶜ (complement). |A| = cardinality.',
        'POWER SET P(A) = set of all subsets of A. |P(A)| = 2^|A|.',
        'PROOF TECHNIQUES — four to memorise:',
        '  (1) DIRECT: assume P, derive Q. Most common.',
        '  (2) CONTRAPOSITIVE: assume ¬Q, derive ¬P. Equivalent to (1) but sometimes much easier.',
        '  (3) CONTRADICTION: assume both P and ¬Q, derive a false statement (like 0 = 1). Then ¬Q must be wrong, so Q.',
        '  (4) INDUCTION: prove base case (n = 1 say), then prove that P(k) → P(k+1). Concludes P(n) for all natural n.',
        'COUNTING PRINCIPLES: SUM rule (or, disjoint), PRODUCT rule (and, sequential choices), PERMUTATIONS P(n,k) = n!/(n-k)!, COMBINATIONS C(n,k) = n!/(k!(n-k)!).',
        'PIGEONHOLE: if you put n+1 objects into n boxes, some box has ≥ 2 objects. Surprising power for "must exist" proofs.',
        'GRAPHS: G = (V, E). Vertices V, edges E. Degree of v = number of edges at v. SUM of degrees = 2|E| (handshake lemma).',
      ],
      vocabulary: [
        { term: 'induction', definition: 'a proof technique establishing P(n) for all natural n by proving P(1) and P(k) → P(k+1).' },
        { term: 'pigeonhole principle', definition: 'if n+1 items go into n containers, some container has at least 2 items; deceptively powerful for existence proofs.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-induction',
      kind: 'worked_example',
      problem: 'Prove by induction: 1 + 2 + 3 + ... + n = n(n+1)/2 for all natural n.',
      steps: [
        'Base case n = 1: LHS = 1. RHS = 1(2)/2 = 1. ✓',
        'Inductive hypothesis: assume 1 + 2 + ... + k = k(k+1)/2 holds for some k.',
        'Inductive step: show 1 + 2 + ... + k + (k+1) = (k+1)(k+2)/2.',
        'LHS = [1 + 2 + ... + k] + (k+1) = k(k+1)/2 + (k+1)   [by IH]',
        '     = (k+1)[k/2 + 1] = (k+1)(k + 2)/2 = (k+1)(k+2)/2  ✓',
        'By induction, P(n) holds for all natural n. ∎',
      ],
      answer: 'Sum of first n naturals = n(n+1)/2; established by induction.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In a group of 13 people, prove that at least 2 share a birth month. (Use pigeonhole.)',
      expectedAnswer: 'Pigeons = 13 people. Pigeonholes = 12 months. Since 13 > 12, by the pigeonhole principle some month must contain at least 2 people. Therefore some 2 people in the group share a birth month. ∎',
      responseFormat: 'free',
      hints: [
        'Identify the items (the "pigeons") and the containers (the "holes").',
        'Then check whether items > containers.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-induction-direction',
      kind: 'misconception_check',
      question: 'A student writes an inductive proof and concludes by saying "since P(k+1) is true, P(k) is true, so P is true for all n." What did they get backward?',
      commonErrors: [
        {
          answer: 'P(k+1) → P(k)',
          misconception: 'Misunderstanding the direction of the inductive step.',
          correctsTo: 'Induction works in the FORWARD direction: ASSUME P(k), then PROVE P(k+1). Each step extends the truth from k to k+1, like dominoes falling forward. Combined with a base case (the first domino tipping), you get P(1), P(2), P(3), ..., for all n. Going backward (P(k+1) → P(k)) is a different (and often invalid) move. Always state: "Inductive hypothesis: assume P(k). Inductive step: prove P(k+1)."',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four proof techniques: direct, contrapositive, contradiction, induction.',
        'Contrapositive ¬Q → ¬P is equivalent to P → Q.',
        'Induction = base case + (P(k) → P(k+1)).',
        'Counting: sum rule (or), product rule (and), permutations, combinations.',
        'Pigeonhole: n+1 items in n boxes ⟹ some box has ≥ 2.',
        'Handshake lemma: sum of vertex degrees = 2|E|.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does strong induction (assume P(1), ..., P(k); prove P(k+1)) sometimes work where ordinary induction does not?',
      hint: 'Some statements about k+1 depend on values smaller than k — for example, the proof that every integer > 1 has a prime factorisation needs to break n into smaller pieces and reuse the result on each piece, not just on n−1. Strong induction lets you assume the statement for ALL smaller cases, not just the immediate predecessor. Logically equivalent to ordinary induction (you can prove one from the other), but operationally simpler when the recursion branches.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
