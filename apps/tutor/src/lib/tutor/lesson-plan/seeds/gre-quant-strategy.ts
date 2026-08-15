/**
 * GRE — Quantitative Reasoning strategy.
 *
 * Section format, question types, time management. The four
 * question formats: quantitative comparison, multiple choice,
 * multiple-answer, numeric entry.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_QUANT_STRATEGY: LessonPlan = {
  id: 'evelyn.testprep.gre.quant-strategy.v1',
  title: 'GRE Quantitative Reasoning strategy',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'gre-quant',
  locale: 'en',
  los: [
    {
      id: 'gre.quant-strategy',
      description: 'Apply effective strategy to GRE quantitative section, including time management and question-type-specific tactics.',
      standard: 'GRE-QUANT',
    },
  ],
  prerequisites: ['ccss.math.hsa-rei.b.4'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame GRE quant as middle-school math + tricky packaging.',
      script: 'GRE quant tests grade 7-10 math. The MATH is easy. What\'s hard is the TIME pressure and the trick QUESTION FORMATS. Strategy beats raw math skill on this test.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-format-tactics',
      kind: 'concept',
      goal: 'Section format + four question types + per-question strategies.',
      keyIdeas: [
        'FORMAT: 2 quant sections, 27 questions each, ~47 minutes per section. ~1.75 min per question average.',
        'CONTENT: arithmetic, algebra, geometry, data analysis (no calculus, no trig). Calculator provided (basic, on-screen).',
        'FOUR QUESTION TYPES:',
        '  1) QUANTITATIVE COMPARISON: choose A (Q1 > Q2), B (Q2 > Q1), C (equal), or D (cannot determine). Tip: try EXTREME or BOUNDARY values. If you can find ONE case where A > B AND another where B > A, answer is D.',
        '  2) MULTIPLE CHOICE — single answer: standard 5-choice. Plug in answer choices when algebra gets messy.',
        '  3) MULTIPLE CHOICE — multiple answers: select ALL that apply. Each choice independently true/false. Slower; check each carefully.',
        '  4) NUMERIC ENTRY: type the answer. Watch decimal/fraction format requirements.',
        'TIME MANAGEMENT: easy questions and hard questions are worth the SAME points. Don\'t spend 4 min on one. Mark and move on; come back if time.',
        'ADAPTIVE: section 2 difficulty depends on section 1 performance. Doing well on easy questions matters.',
        'COMMON PITFALLS: misreading "must be" vs "could be", ignoring constraints, sign errors, unit mix-ups.',
      ],
      vocabulary: [
        { term: 'quantitative comparison', definition: 'a GRE question type comparing two quantities A and B.' },
        { term: 'data analysis', definition: 'GRE question category covering statistics, probability, charts.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-qc',
      kind: 'worked_example',
      problem: 'Quantitative comparison: Quantity A: x². Quantity B: x. Choose A, B, C, or D.',
      steps: [
        'Try x = 2: A = 4, B = 2. A > B.',
        'Try x = 0.5: A = 0.25, B = 0.5. B > A.',
        'Try x = -3: A = 9, B = -3. A > B.',
        'Different values give different answers. Cannot determine relationship without knowing x.',
        'Answer: D.',
      ],
      answer: 'D — cannot be determined',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'For a 27-question, 47-minute GRE quant section, what\'s your average time per question? What\'s the tradeoff strategy?',
      expectedAnswer: 'about 1.75 min/question; spend less on easy ones to bank time for hard ones',
      responseFormat: 'free',
      hints: [
        '47/27 ≈ 1.74 minutes.',
        'Skip and return to time-sinks.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-must-vs-could',
      kind: 'misconception_check',
      question: 'For a "must be" question vs "could be", does it matter how you read it?',
      commonErrors: [
        {
          answer: 'no',
          misconception: 'Reading them interchangeably.',
          correctsTo: '"Must be" requires the answer ALWAYS true. "Could be" requires at least one case where true. A common trap — same question with different word can have different answers. Read carefully.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '~1.75 min/question. Don\'t over-invest.',
        'Four types: QC (try extremes), MC, multi-MC, numeric entry.',
        'Math content is grade 7-10; difficulty is in TIME and FORMAT.',
        'Try plugging numbers and answer choices when algebra slows you down.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'On QC questions, why is "D — cannot be determined" answerable on numeric values BUT not for problems with explicit fixed values?',
      hint: 'If both quantities are fixed numbers, you can ALWAYS compute and decide A, B, or C. D requires that the values DEPEND on a variable not fully constrained.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
