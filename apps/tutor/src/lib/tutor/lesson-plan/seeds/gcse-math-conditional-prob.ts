/**
 * GCSE Math Higher — Conditional Probability & Set Notation.
 * Set notation (∪ ∩ A'), Venn diagrams, P(A given B), conditional formula.
 */

import type { LessonPlan } from '../types';

export const SEED_GCSE_MATH_CONDITIONAL_PROB: LessonPlan = {
  id: 'evelyn.gcse.math.conditional-prob.v1',
  title: 'GCSE Higher — Conditional Probability & Set Notation',
  curriculum: 'GCSE',
  grade: '10-11',
  subject: 'math',
  topic: 'gcse-math',
  locale: 'en-GB',
  los: [
    {
      id: 'gcse.math.conditional-prob',
      description: 'Use set notation (union, intersection, complement); compute conditional probability P(A|B); apply Venn-diagram reasoning.',
      standard: 'GCSE-MATH-P6/P9',
    },
  ],
  prerequisites: ['gcse.math.probability-trees'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Conditional probability — the "given" word — flips one side of the calculation. Knowing how is worth several easy marks.',
      script: '"Given that the student plays football, what\'s the probability they also play tennis?" That word "given" changes the universe. You\'re no longer dividing by the total population — you\'re dividing by just the football players. Visualising the Venn diagram makes this click.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-set-notation',
      kind: 'concept',
      goal: 'Set notation, Venn diagrams, conditional probability formula.',
      keyIdeas: [
        'SET NOTATION: A ∪ B = "A union B" = elements in A OR B (or both). A ∩ B = "A intersect B" = elements in BOTH A and B. A\' (or A^c) = complement = NOT in A.',
        'EMPTY SET: ∅. UNIVERSAL SET: ξ (or U).',
        'NUMBER NOTATION: n(A ∪ B) = n(A) + n(B) − n(A ∩ B). The intersection is otherwise double-counted.',
        'PROBABILITY: P(A ∪ B) = P(A) + P(B) − P(A ∩ B).',
        'MUTUALLY EXCLUSIVE EVENTS: A ∩ B = ∅, so P(A ∪ B) = P(A) + P(B). (No overlap.)',
        'CONDITIONAL PROBABILITY P(A given B) = P(A ∩ B) / P(B). The "given B" restricts the sample space to just B; we then look at the fraction of B that\'s also A.',
        'INDEPENDENCE TEST: A and B are independent ⟺ P(A given B) = P(A) ⟺ P(A ∩ B) = P(A)·P(B).',
        'VENN STRATEGY: fill in the intersection FIRST, then work outwards. (n(only A), n(only B), n(neither) are derived after the centre is known.)',
      ],
      vocabulary: [
        { term: 'union', definition: 'set of elements in either set (or both): A ∪ B.' },
        { term: 'intersection', definition: 'set of elements in both sets: A ∩ B.' },
        { term: 'complement', definition: 'set of elements NOT in A: A\'. Probability: P(A\') = 1 − P(A).' },
        { term: 'mutually exclusive', definition: 'events that cannot both occur; A ∩ B = ∅.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-conditional',
      kind: 'worked_example',
      problem: 'A class of 30 students: 18 play football (F), 14 play tennis (T), and 9 play both. A student is chosen at random. Find: (a) P(F ∩ T), (b) P(F ∪ T), (c) P(T given F).',
      steps: [
        '(a) P(F ∩ T) = (number who play both) / total = 9/30 = 3/10.',
        '(b) Use P(F ∪ T) = P(F) + P(T) − P(F ∩ T) = 18/30 + 14/30 − 9/30 = 23/30.',
        '(c) P(T given F) = P(F ∩ T) / P(F) = (9/30) / (18/30) = 9/18 = 1/2.',
        'INTERPRETATION: among students who play football (18 of them), exactly half (9) also play tennis. The "given F" restricted the universe to those 18.',
        'CHECK INDEPENDENCE: would expect P(T) = 14/30 ≈ 0.47 if independent. Actual P(T given F) = 0.5. Close but not equal → slight dependence (football players slightly more likely to play tennis).',
      ],
      answer: '(a) 3/10; (b) 23/30; (c) 1/2',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In a survey, 40% own a cat (C), 30% own a dog (D), 10% own both. Find P(C ∪ D).',
      expectedAnswer: '0.6 (or 60%)',
      responseFormat: 'free',
      hints: [
        'P(C ∪ D) = P(C) + P(D) − P(C ∩ D).',
        '0.4 + 0.3 − 0.1.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-conditional',
      kind: 'misconception_check',
      question: 'A bag has 5 red and 5 blue balls. P(red) = 1/2. After drawing a red and not replacing it, the bag has 4 red and 5 blue. A student says "P(red on next draw) is still 1/2". What\'s the actual value, and what\'s the misconception?',
      commonErrors: [
        {
          answer: 'P(red on next draw) = 1/2',
          misconception: 'Thinking probability is fixed regardless of what has been observed; failing to update after the first event.',
          correctsTo: 'After the first red is drawn (without replacement), the bag composition has CHANGED. P(red | first was red) = 4/9, not 1/2. This is conditional probability in action: knowing the first outcome shifts the second probability. Independence would mean P(red second | red first) = P(red second), which only holds with replacement.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '∪ = union (OR), ∩ = intersection (AND), A\' = NOT.',
        'P(A ∪ B) = P(A) + P(B) − P(A ∩ B).',
        'P(A | B) = P(A ∩ B) / P(B). The conditioning event B becomes the new universe.',
        'Independent ⟺ P(A | B) = P(A). Mutually exclusive ⟺ P(A ∩ B) = 0.',
        'Fill the intersection of a Venn diagram FIRST, then work outwards.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'In a school, 30% of students study French (F), 25% study German (G), and 10% study both. Are F and G independent? Justify with calculation.',
      hint: 'Independence test: is P(F ∩ G) = P(F)·P(G)? Right side = 0.30·0.25 = 0.075. Left side = 0.10. Since 0.10 ≠ 0.075, F and G are NOT independent — students studying one language are slightly more likely to study the other than chance would predict.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
