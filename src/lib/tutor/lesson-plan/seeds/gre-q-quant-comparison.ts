/**
 * GRE Quant — Quantitative Comparison Strategy.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_Q_QUANT_COMPARISON: LessonPlan = {
  id: 'evelyn.gre.q.quant-comparison.v1',
  title: 'GRE Quant — Quantitative Comparison Strategy',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'math',
  topic: 'gre-quant',
  locale: 'en',
  los: [
    {
      id: 'gre.q.quant-comparison',
      description: 'Apply the four-option Quantitative Comparison framework; use plug-in tactics; recognise when "cannot be determined" is the answer.',
      standard: 'GRE-Q-QC',
    },
  ],
  prerequisites: ['gre.q.probability-counting'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'QC questions are unique to the GRE — and ignore them at your peril. They\'re the most tactical part of Quant.',
      script: 'Quantitative Comparison gives you Quantity A and Quantity B. Choose: A bigger, B bigger, equal, or "cannot be determined". The "cannot be determined" option is the one most often missed — and the most often correct. Today we drill the framework that catches it.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-qc',
      kind: 'concept',
      goal: 'The 4-option logic + plug-in technique + edge-case discipline.',
      keyIdeas: [
        'FOUR OPTIONS: (A) Quantity A bigger, (B) Quantity B bigger, (C) Equal, (D) Cannot be determined.',
        'CANNOT BE DETERMINED applies when the problem has VARIABLES that can take different valid values yielding different outcomes.',
        'PLUG-IN TACTIC: when variables are present, test specific values. Try (1) easy positive integer, (2) zero, (3) negative, (4) fraction between 0 and 1, (5) very large number.',
        'IF DIFFERENT TEST VALUES GIVE DIFFERENT RELATIONSHIPS → answer is (D) Cannot be determined.',
        'IF TEST VALUES CONSISTENTLY GIVE THE SAME RELATIONSHIP → likely that\'s the answer (verify algebraically).',
        'NEVER ASSUME GEOMETRY DIAGRAMS ARE TO SCALE — they\'re not.',
        'WHEN ONLY NUMBERS APPEAR (no variables): the answer is determined; (D) is impossible. Compute and compare.',
        'TIME GUIDE: spend max ~75 sec per QC question. They\'re shorter than problem-solving questions.',
      ],
      vocabulary: [
        { term: 'cannot be determined', definition: 'option (D) on QC; chosen when valid inputs yield different relationships between quantities.' },
        { term: 'plug-in', definition: 'substituting specific values for variables to test the comparison.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-plug-in',
      kind: 'worked_example',
      problem: 'Quantity A: x². Quantity B: x. Compare.',
      steps: [
        'Test x = 2: A = 4, B = 2. A > B.',
        'Test x = 1: A = 1, B = 1. Equal.',
        'Test x = 0.5: A = 0.25, B = 0.5. A < B.',
        'Different relationships from different inputs → answer is (D) Cannot be determined.',
        'INTUITION: x² is bigger than x for x > 1 or x < 0; x² < x for 0 < x < 1; equal at 0 and 1. Without constraints on x, the comparison is ambiguous.',
      ],
      answer: '(D) Cannot be determined',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Given: a > 0 and b > 0. Quantity A: a + b. Quantity B: ab. Choose A, B, C, or D.',
      expectedAnswer: 'D — Cannot be determined',
      responseFormat: 'free',
      hints: [
        'Try a = b = 1: A = 2, B = 1 → A > B.',
        'Try a = b = 5: A = 10, B = 25 → B > A.',
        'Different inputs give different relationships.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-cant-determine',
      kind: 'misconception_check',
      question: 'A student rules out (D) automatically because "the question must have a determinate answer". Why is this wrong?',
      commonErrors: [
        {
          answer: 'Always rule out (D)',
          misconception: 'Treating QC like multiple-choice with three real answers and one filler.',
          correctsTo: '(D) Cannot be determined IS a frequent correct answer. Roughly 25% of QC answers are (D). Always test edge cases — zero, negative, fraction. If you don\'t test them, you\'ll miss when the relationship flips. Trust the framework: if cases produce different orderings, (D) is right.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four options: A bigger, B bigger, equal, cannot be determined.',
        'When variables present: test 0, negative, fraction, and large positive.',
        'Different relationships across test values → (D).',
        'No variables → (D) is impossible.',
        'Geometry figures NOT to scale.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Given x is an integer with |x| < 5. Quantity A: x². Quantity B: 9. Compare.',
      hint: 'x can be −4, −3, …, 3, 4. x² ranges from 0 to 16. For x = 0, 1, ±2: x² < 9. For x = ±3: x² = 9. For x = ±4: x² = 16 > 9. Different relationships → (D) Cannot be determined.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
