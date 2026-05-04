/**
 * IB DP Math AA — Probability: Rules and Conditional.
 * Sample spaces, P(A ∪ B), conditional P(A|B), Bayes-style reasoning,
 * tree diagrams.
 */

import type { LessonPlan } from '../types';

export const SEED_IBDP_AA_PROBABILITY: LessonPlan = {
  id: 'evelyn.ibdp.aa.probability.v1',
  title: 'IB DP Math AA — Probability Rules & Conditional',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'math',
  topic: 'ibdp-aa',
  locale: 'en',
  los: [
    {
      id: 'ibdp.aa.probability',
      description: 'Apply probability axioms; compute P(A ∪ B), P(A | B), and use the law of total probability and tree diagrams to solve multi-stage problems.',
      standard: 'IB-DP-MATH-AA-4.5/4.6',
    },
  ],
  prerequisites: ['ibdp.aa.statistics-descriptive'],
  followUps: ['ibdp.aa.binomial-distribution'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Conditional probability is the bridge to Bayesian reasoning, statistical inference, and binomial distributions later in AA.',
      script: 'IB AA probability layers conditional questions on top of multi-stage trees. "A test for a disease is 95% accurate. The disease affects 1% of the population. Given a positive test result, what\'s the probability the person actually has the disease?" Without conditional probability, this is impossible. With it, it\'s an arithmetic exercise.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-probability',
      kind: 'concept',
      goal: 'Axioms, addition rule, conditional, total probability, independence.',
      keyIdeas: [
        'AXIOMS: 0 ≤ P(A) ≤ 1. P(certain) = 1. P(impossible) = 0. P(A\') = 1 − P(A).',
        'ADDITION RULE: P(A ∪ B) = P(A) + P(B) − P(A ∩ B). For mutually exclusive: P(A ∪ B) = P(A) + P(B).',
        'CONDITIONAL: P(A | B) = P(A ∩ B) / P(B), provided P(B) > 0. The "given B" restricts the sample space to B.',
        'MULTIPLICATION RULE: P(A ∩ B) = P(B) · P(A | B). Used in trees: probability along a path = product of branch probabilities.',
        'INDEPENDENCE TEST: A and B are independent ⟺ P(A | B) = P(A) ⟺ P(A ∩ B) = P(A)·P(B).',
        'LAW OF TOTAL PROBABILITY: if B₁, B₂ partition the sample space, P(A) = P(A | B₁)·P(B₁) + P(A | B₂)·P(B₂).',
        'BAYES (in disguise on AA papers): P(B | A) = P(A ∩ B) / P(A). Combine with total probability when needed.',
        'TREE DIAGRAMS: branches from each node sum to 1. End-of-path probability = product of branches. Use for two-stage events.',
      ],
      vocabulary: [
        { term: 'mutually exclusive', definition: 'events that cannot both occur: P(A ∩ B) = 0.' },
        { term: 'independent', definition: 'events where one\'s occurrence doesn\'t change the other\'s probability: P(A | B) = P(A).' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-bayes',
      kind: 'worked_example',
      problem: 'A test for a disease has sensitivity 95% (correctly identifies positive cases) and specificity 90% (correctly identifies negatives). The disease affects 2% of the population. Given a positive test, what\'s the probability the person has the disease?',
      steps: [
        'Define events: D = has disease (P = 0.02). T = positive test.',
        'P(T | D) = 0.95 (sensitivity). P(T | D\') = 1 − 0.90 = 0.10 (false positive).',
        'Total probability: P(T) = P(T | D)·P(D) + P(T | D\')·P(D\') = 0.95·0.02 + 0.10·0.98 = 0.019 + 0.098 = 0.117.',
        'Bayes: P(D | T) = P(T ∩ D) / P(T) = (0.95·0.02) / 0.117 = 0.019 / 0.117 ≈ 0.162.',
        'INTERPRETATION: even after a positive test, the probability is only about 16% — because the disease is rare AND the false-positive rate matters more than people expect. This counter-intuitive result is exactly why IB AA loves this question type.',
      ],
      answer: 'P(disease | positive) ≈ 0.162',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Two fair dice are rolled. Given that the sum is 7, find the probability that one die shows a 2.',
      expectedAnswer: '1/3',
      responseFormat: 'free',
      hints: [
        'Sample space for "sum = 7": {(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)} — 6 outcomes.',
        'Outcomes with a 2: (2,5) and (5,2) — 2 outcomes.',
        'P(2 | sum=7) = 2/6.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-conditional-direction',
      kind: 'misconception_check',
      question: 'A student says "P(A | B) = P(B | A)" because both involve the intersection. Why is this wrong in general?',
      commonErrors: [
        {
          answer: 'P(A | B) = P(B | A)',
          misconception: 'Treating the conditioning bar as symmetric.',
          correctsTo: 'P(A | B) = P(A ∩ B)/P(B). P(B | A) = P(A ∩ B)/P(A). They share a numerator but divide by different denominators. Equal only if P(A) = P(B). Example: P(rain | clouds) is large; P(clouds | rain) is also large but not necessarily equal — depends on base rates of rain and clouds. Always identify which event is the conditioning event (the "given") and divide by ITS probability.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'P(A ∪ B) = P(A) + P(B) − P(A ∩ B).',
        'P(A | B) = P(A ∩ B) / P(B). Conditioning event in denominator.',
        'Independent ⟺ P(A ∩ B) = P(A)·P(B).',
        'Total probability: split sample space by partition, sum P(A | Bᵢ)·P(Bᵢ).',
        'Trees: multiply along paths, sum across paths.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Two events A and B satisfy P(A) = 0.4, P(B) = 0.5, P(A ∪ B) = 0.7. Are they independent?',
      hint: 'P(A ∩ B) = P(A) + P(B) − P(A ∪ B) = 0.4 + 0.5 − 0.7 = 0.2. Independence test: does P(A ∩ B) = P(A)·P(B)? 0.4·0.5 = 0.2. Yes — equal. So A and B are independent.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
