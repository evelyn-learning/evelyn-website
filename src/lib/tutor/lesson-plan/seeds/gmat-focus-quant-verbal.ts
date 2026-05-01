/**
 * GMAT Focus Edition — Quant + Verbal: what changed and what stayed.
 *
 * Quant lost geometry and Data Sufficiency. Verbal lost Sentence
 * Correction. Both sections are tighter and more focused on the core
 * skills than under GMAT Classic.
 */

import type { LessonPlan } from '../types';

export const SEED_GMAT_FOCUS_QUANT_VERBAL: LessonPlan = {
  id: 'evelyn.testprep.gmat-focus.quant-verbal.v1',
  title: 'GMAT Focus: Quant + Verbal — What Changed',
  curriculum: 'GMAC',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'gmat-verbal',
  locale: 'en',
  los: [
    {
      id: 'gmat-focus.quant-verbal',
      description: 'Identify the current scope of GMAT Focus Quant and Verbal sections, the topics removed (geometry, Data Sufficiency, Sentence Correction), and the per-question pacing under the new structure.',
      standard: 'GMAT-FOCUS-QV',
    },
  ],
  prerequisites: ['gmat-focus.format-overview'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Quant + Verbal got SHORTER and FOCUSED — not easier.',
      script: 'It\'s tempting to think GMAT Focus is easier because it dropped geometry, sentence correction, and the AWA. But the items that REMAIN got proportionally harder, and the time per question got tighter. You can\'t coast through Quant just because the geometry section is gone — the 21 remaining problems are pure problem-solving algebra and arithmetic, and they\'re harder than what was in the old Quant section because the test bank shifted upward.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-quant',
      kind: 'concept',
      goal: 'What\'s in (and out of) Focus Quant.',
      keyIdeas: [
        'QUANT FORMAT: 21 questions, 45 minutes (≈ 2.14 min per question). 100% Problem Solving — you compute the answer.',
        'IN: Arithmetic (number properties, fractions, decimals, percentages, ratios, exponents), Algebra (linear and quadratic equations, inequalities, functions, sequences, word problems).',
        'OUT: Geometry (triangles, circles, coordinate, solids — all gone). Data Sufficiency (moved to Data Insights). No statistics in Quant either — basic stats appears in Data Insights.',
        'NO CALCULATOR allowed in Quant. Mental math fluency matters: know your multiplication tables 1-15, common decimals/fractions (1/3 ≈ 0.333, 1/8 = 0.125), perfect squares to 25.',
        'COMMON QUESTION ARCHETYPES: rate / work problems, mixture problems, percentage change, simple/compound interest, ratios in word form, divisibility / remainder problems, basic combinatorics (permutations and combinations).',
        'PACING: 2.14 min average. Don\'t spend > 3 minutes on any single question — bookmark and move on.',
        'WHY no geometry: research showed geometry questions tested visual-spatial recall more than business-relevant reasoning. The Focus redesign cut it to make room for stronger emphasis on data and algebraic reasoning.',
      ],
      vocabulary: [
        { term: 'Problem Solving', definition: 'GMAT Quant question type where you compute and select the numeric/algebraic answer (vs Data Sufficiency).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-verbal',
      kind: 'concept',
      goal: 'What\'s in (and out of) Focus Verbal.',
      keyIdeas: [
        'VERBAL FORMAT: 23 questions, 45 minutes (≈ 1.96 min per question). Two question types: Reading Comprehension + Critical Reasoning.',
        'IN: Reading Comprehension (passages of 200-350 words on social science / business / natural science / humanities, with 3-4 questions per passage). Critical Reasoning (short arguments, then a question — strengthen, weaken, assumption, inference, paradox, evaluate).',
        'OUT: Sentence Correction (entirely gone). No more idioms/grammar testing on the GMAT.',
        'PACING: ~2 minutes per question, similar to before but no SC items to burn time on.',
        'CRITICAL REASONING question categories — memorize them: STRENGTHEN (which choice supports the conclusion?), WEAKEN (which undermines?), ASSUMPTION (what must be true for the argument to work?), INFERENCE (what conclusion is supported?), PARADOX (which resolves an apparent contradiction?), EVALUATE (what would you need to check?), BOLD-FACED (role of the bold sentence in the argument).',
        'READING COMPREHENSION strategy: skim the passage for STRUCTURE first (what\'s the main claim, where\'s the contrast, where\'s the example?), then attack questions. Don\'t deep-read on first pass — questions tell you which paragraph matters.',
        'WHY no Sentence Correction: GMAC research showed SC over-tested native-speaker idiom familiarity, disadvantaging international applicants. Removing it makes Verbal a cleaner reasoning test.',
      ],
      vocabulary: [
        { term: 'Critical Reasoning', definition: 'GMAT Verbal item presenting a short argument, then asking about its logical structure (strengthen, weaken, assumption, etc.).' },
        { term: 'Reading Comprehension', definition: 'GMAT Verbal item presenting a 200-350 word passage with 3-4 follow-up questions about content, structure, and inference.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You see a Critical Reasoning question that asks: "Which of the following, if true, would most weaken the argument?" What\'s your first move?',
      expectedAnswer: 'Identify the argument\'s CONCLUSION and the EVIDENCE that supports it. The right answer attacks one of: (a) the link between evidence and conclusion (alternative explanation), (b) the conclusion itself (contradicting fact), or (c) an unstated assumption. Then scan choices and eliminate those that strengthen, are irrelevant, or merely repeat evidence.',
      responseFormat: 'free',
      hints: [
        'Weaken questions need the conclusion + evidence + assumption framework.',
        'Wrong answers often strengthen, repeat evidence, or are off-topic.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-old-prep',
      kind: 'misconception_check',
      question: 'A 2022 GMAT prep book covers Sentence Correction extensively. Should you still drill those exercises since grammar is generally useful?',
      commonErrors: [
        {
          answer: 'yes — grammar drilling is always valuable',
          misconception: 'Investing study time on a topic that won\'t appear.',
          correctsTo: 'Mostly no. SC is gone from the GMAT — drilling those exercises won\'t affect your score. Use that study time for Critical Reasoning (still tested, gets more weight in Verbal now) or Data Insights (entirely new section). General grammar is useful for life, but if your goal is GMAT score, every hour on SC is an hour not spent on what\'s actually scored. The exception: international applicants whose written English is shaky might still benefit from SC drills as general writing practice — but it\'s not GMAT prep, just writing skill.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Quant: 21 Q in 45 min. Problem Solving only. NO geometry, NO calculator.',
        'Verbal: 23 Q in 45 min. RC + CR only. NO Sentence Correction.',
        'CR question categories: strengthen / weaken / assumption / inference / paradox / evaluate / bold-faced.',
        'Don\'t use pre-2024 prep materials for SC or Quant geometry — they\'re not on the exam.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'GMAT Focus removed Sentence Correction but kept Critical Reasoning. What does that say about what GMAC actually wants to measure in Verbal?',
      hint: 'CR is about LOGICAL REASONING — given evidence, what conclusions follow, what assumptions are required, what undermines an argument. SC was about FORMAL ENGLISH USAGE — knowing that "between you and me" is correct vs "between you and I". The first transfers directly to MBA work (analyzing case studies, evaluating proposals); the second is a language-skill proxy that disadvantages non-native speakers. By keeping CR + RC and dropping SC, GMAC signals that Verbal is now an analytical-reasoning test, not an English-grammar test.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
