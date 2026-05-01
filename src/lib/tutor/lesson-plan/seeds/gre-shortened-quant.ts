/**
 * GRE General Test — Quantitative Reasoning (shortened format).
 *
 * 27 questions across 2 sections, 47 min total. Four question types:
 * Quantitative Comparison, Problem Solving (MC + multiple-answer),
 * Numeric Entry, Data Interpretation. On-screen calculator available.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_SHORTENED_QUANT: LessonPlan = {
  id: 'evelyn.testprep.gre.shortened-quant.v1',
  title: 'GRE Quantitative Reasoning (Shortened): Question Types and Calculator Use',
  curriculum: 'ETS',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'gre-quant',
  locale: 'en',
  los: [
    {
      id: 'gre.shortened-quant',
      description: 'Recognize the four GRE Quant question types (Quantitative Comparison, Problem Solving, Numeric Entry, Data Interpretation), apply per-type strategy, and use the on-screen calculator efficiently.',
      standard: 'GRE-GENERAL-QUANT',
    },
  ],
  prerequisites: ['gre.shortened-format'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'GRE Quant rewards algebra fluency + recognizing question type fast.',
      script: 'GRE Quant content is high-school-level math — algebra, geometry, basic stats, data interpretation. The challenge is the FORMAT: 4 distinct question types, each with its own approach. Quantitative Comparison is uniquely GRE — you don\'t solve, you compare two quantities. Get fast at recognizing each type from the prompt, and Quant becomes manageable in 47 minutes.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-types',
      kind: 'concept',
      goal: 'Four Quant question types.',
      keyIdeas: [
        'QUANTITATIVE COMPARISON (QC) (~7-9 per test): Two quantities, A and B, possibly with given conditions. Choose: (a) A is greater, (b) B is greater, (c) they are equal, (d) cannot be determined. NO partial credit. NO computation of an answer — only comparison.',
        'PROBLEM SOLVING — MULTIPLE CHOICE (~7-9 per test): standard 5-option MC. Pick the one correct numeric answer.',
        'PROBLEM SOLVING — MULTIPLE ANSWER (~3-5 per test): like MC but pick ALL choices that satisfy the condition. Could be 2-5 correct out of 5-7 options. NO partial credit; you must pick exactly the correct set.',
        'NUMERIC ENTRY (~3-5 per test): you type the answer (no choices). Could be a fraction (numerator + denominator boxes) or a single number. The calculator can transfer values to the answer field.',
        'DATA INTERPRETATION (~5-6 per test, usually 2-3 questions per data set): a graph, table, or chart followed by 2-3 questions. Calculations involve reading values precisely — don\'t estimate when the chart\'s axis is fine-grained.',
        'CALCULATOR is on-screen, four-function + square root + parentheses. Use it for tedious arithmetic; mental math is faster for simple operations.',
        'STRATEGY for QC: try plug-in values that include EDGE CASES — zero, one, negative numbers, fractions. If different plug-ins give different relationships, the answer is (d) cannot be determined.',
        'STRATEGY for Multiple Answer: don\'t skip out of fear. Every correct option matters. Make a quick yes/no for each choice independently.',
        'PACING: 47 min for 27 Q ≈ 105 seconds per Q. QC items go fastest; DI sets and multiple-answer take more.',
      ],
      vocabulary: [
        { term: 'Quantitative Comparison', definition: 'GRE Quant item with two quantities to compare; choose A>B, A<B, A=B, or cannot determine.' },
        { term: 'Numeric Entry', definition: 'GRE Quant item where the candidate types the answer rather than picking from choices.' },
        { term: 'Data Interpretation', definition: 'GRE Quant item set with 2-3 questions tied to a shared graph or table.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-qc',
      kind: 'worked_example',
      problem: 'QUANTITATIVE COMPARISON. Given: x is a positive integer. Quantity A: x². Quantity B: x³. Pick: (a) A > B, (b) B > A, (c) A = B, (d) cannot be determined.',
      steps: [
        'PLUG IN x = 1: A = 1, B = 1. They are EQUAL.',
        'PLUG IN x = 2: A = 4, B = 8. B > A.',
        'PLUG IN x = 3: A = 9, B = 27. B > A.',
        'TWO different relationships emerged: A = B (when x = 1) and B > A (when x ≥ 2). Since the relationship depends on the value of x, no single comparison is always true.',
        'ANSWER: (d) cannot be determined.',
        'KEY: edge case x = 1 was the trap. Always test boundary values for QC.',
      ],
      answer: '(d) cannot be determined',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'NUMERIC ENTRY. A store sold 80 shirts in one week. The next week sales increased by 35%. How many shirts were sold in the second week? (Type a single integer.)',
      expectedAnswer: '108',
      responseFormat: 'numeric',
      hints: [
        '35% increase means multiply by 1.35.',
        '80 × 1.35 = 108.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-calculator-always',
      kind: 'misconception_check',
      question: 'Since the on-screen calculator is always available in Quant, you should use it on every question to avoid arithmetic mistakes.',
      commonErrors: [
        {
          answer: 'true — calculator removes errors',
          misconception: 'Treating the calculator as universally faster.',
          correctsTo: 'False. The on-screen calculator is slower than mental math for simple operations: 25 × 4, 10% of 80, 36/6. Each calculator use costs ~5-10 seconds vs ~1 second mental. On 27 questions, over-reliance on the calculator can cost you 2-3 minutes total — significant on a 47-minute section. USE IT for: long multiplication, square roots, division with remainders. SKIP IT for: simple multiplication tables, basic percentages, fraction-to-decimal conversions you know cold.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '27 Q / 47 min ≈ 105 sec/question. 4 types: QC, PS-MC, PS-Multiple-Answer, Numeric Entry, Data Interpretation.',
        'QC: plug in edge cases (0, 1, negatives, fractions). If results vary, answer is (d).',
        'Multiple Answer: each choice is independent yes/no. Don\'t skip.',
        'Calculator on-screen but slow — use selectively, not always.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is Quantitative Comparison unique to the GRE — no other major test has it?',
      hint: 'QC tests a different skill from Problem Solving — it asks "is A bigger than B" without requiring you to compute either fully. That\'s a relevant graduate-level skill (estimating which of two effect sizes is larger, ranking magnitudes without precise values). It also has lower computational load, which is useful in a section that already includes 27 questions in 47 minutes. Other tests (SAT, GMAT) abandoned it because it felt unfamiliar to test-takers; ETS keeps it because it adds measurement validity.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
