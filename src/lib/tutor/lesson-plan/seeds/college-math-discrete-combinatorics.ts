/**
 * College Discrete Math — Combinatorics: Permutations and Combinations.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_MATH_DISCRETE_COMBINATORICS: LessonPlan = {
  id: 'evelyn.college.math.discrete.combinatorics.v1',
  title: 'Discrete Math — Combinatorics: Permutations and Combinations',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'math',
  topic: 'discrete-math',
  locale: 'en',
  los: [{ id: 'college.math.discrete.combinatorics', description: 'Apply sum + product rules; compute permutations P(n,k) and combinations C(n,k); use the binomial theorem and pigeonhole.', standard: 'COLLEGE-DISCRETE' }],
  prerequisites: ['college.math.discrete-math'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Combinatorics is the math of "how many ways" — counting cleverly without enumeration.', script: 'How many ways can 10 people line up? How many 5-card hands from a 52-card deck? Direct enumeration would take forever. Combinatorics gives you formulas to count without listing.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'Sum + product rules, P(n,k), C(n,k), binomial theorem, pigeonhole.', keyIdeas: [
      'SUM RULE (or, disjoint cases): if event A can happen in m ways or event B in n ways, and they\'re disjoint, total = m + n.',
      'PRODUCT RULE (and, sequential): if A can happen in m ways AND THEN B can happen in n ways, total = m × n.',
      'PERMUTATIONS P(n, k) = n! / (n − k)! — number of ways to arrange k things from n where ORDER MATTERS.',
      '  Example: how many 3-letter codes from 5 letters? P(5,3) = 5!/2! = 60.',
      'COMBINATIONS C(n, k) = n! / (k!(n − k)!) — number of ways to choose k things from n where ORDER DOESN\'T MATTER.',
      '  Example: how many 5-card hands from 52? C(52, 5) = 2,598,960.',
      '  Notation: also written (n choose k) or "nCk."',
      'KEY DISTINCTION:',
      '  PERMUTATION = arrangement (order matters). Lineups, codes, top-3 finishers.',
      '  COMBINATION = selection (order doesn\'t matter). Hands, committees, subsets.',
      'BINOMIAL THEOREM: (a + b)ⁿ = Σ_{k=0}^n C(n,k) · a^(n−k) · b^k.',
      '  Pascal\'s triangle generates the C(n,k) values.',
      '  Each row\'s entries: 1, n, C(n,2), C(n,3), ..., n, 1.',
      'PIGEONHOLE PRINCIPLE: if n+1 items are placed in n containers, some container has ≥ 2 items.',
      '  Generalised: if kn+1 items in n containers, some container has ≥ k+1 items.',
      '  Surprising power: lets you prove existence of structure in unstructured-looking problems.',
      'INCLUSION-EXCLUSION: |A ∪ B| = |A| + |B| − |A ∩ B|. For three sets: add singles, subtract pairs, add triples.',
    ], vocabulary: [{ term: 'permutation', definition: 'an arrangement where order matters; P(n,k) = n!/(n-k)!.' }, { term: 'combination', definition: 'a selection where order doesn\'t matter; C(n,k) = n!/(k!(n-k)!).' }], estimatedMinutes: 5 },
    { id: 'worked', kind: 'worked_example', problem: 'A committee of 4 is chosen from 10 candidates. How many possible committees are there? What if the 4 are ranked (President, VP, Secretary, Treasurer)?', steps: [
      'COMMITTEE (no order): combination. C(10, 4) = 10!/(4!·6!) = 210.',
      'OFFICERS (with order — different roles): permutation. P(10, 4) = 10!/6! = 10 × 9 × 8 × 7 = 5040.',
      'Notice: 5040 / 4! = 210. Each committee can be arranged in 4! ways into officer roles.',
      'GENERAL: P(n,k) = C(n,k) × k!.',
    ], answer: 'Committees: 210. Officers: 5040.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A standard deck has 52 cards. How many 5-card hands contain exactly 2 aces?', expectedAnswer: 'Choose 2 aces from 4 available: C(4,2) = 6. Choose remaining 3 cards from 48 non-aces: C(48,3) = 48·47·46/6 = 17,296. Multiply (product rule, both happen): 6 × 17,296 = 103,776 hands.', responseFormat: 'free', hints: ['Break into two independent choices: aces and non-aces.', 'Combine using product rule.'], estimatedMinutes: 4 },
    { id: 'misconception-perm-vs-comb', kind: 'misconception_check', question: 'A student computes the number of "ways to give 3 books to 3 students" using C(n,3) when each student gets a DIFFERENT book. What\'s wrong?', commonErrors: [{ answer: 'Uses C(n,3)', misconception: 'Confusing "selecting 3" with "assigning 3."', correctsTo: 'When each student gets a distinct, identified item, ORDER MATTERS — it\'s a PERMUTATION. The first student\'s book is different from the second\'s. Use P(n,3) = n!/(n−3)!. Combinations only apply when the 3 items are interchangeable (selecting a committee, not assigning roles).' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Sum rule: OR, disjoint. Product rule: AND, sequential.', 'Permutation P(n,k): order matters. Combination C(n,k): order doesn\'t.', 'P(n,k) = C(n,k) × k!.', 'Pigeonhole: n+1 items in n boxes ⟹ ≥ 2 in some box.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
