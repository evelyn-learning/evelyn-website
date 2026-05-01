/**
 * GRE General Test — Shortened Format Overview (post-Sept 2023).
 *
 * On September 22, 2023, ETS launched a significantly shorter GRE
 * General Test: total runtime cut from ~3h 45m to ~1h 58m, the second
 * Analytical Writing essay removed, ~26 fewer V+Q questions, no
 * unscored experimental section. Currency-checked against ETS\'s
 * official structure page + Booster / Yocket / Wizako guides.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_SHORTENED_FORMAT: LessonPlan = {
  id: 'evelyn.testprep.gre.shortened-format.v1',
  title: 'GRE General Test (Shortened): Format and Section-Level Adaptive Routing',
  curriculum: 'ETS',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'gre-quant',
  locale: 'en',
  los: [
    {
      id: 'gre.shortened-format',
      description: 'Describe the current GRE General Test structure (post-Sept 2023): 1h 58m, 5 sections, 1 essay + 27 V + 27 Q, section-level adaptive routing, on-screen calculator in Quant.',
      standard: 'GRE-GENERAL-2023',
    },
  ],
  prerequisites: [],
  followUps: ['gre.shortened-verbal', 'gre.shortened-quant'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The GRE got cut almost in half — and the strategy changed with it.',
      script: 'On September 22, 2023, ETS released a brand-new GRE: the test now runs about 1 hour 58 minutes instead of 3 hours 45 minutes. Half as long. They cut the second essay (the argument task is gone), removed the unscored experimental section, and trimmed Verbal and Quant to 27 questions each. Same scoring scale (130-170 per section), same question types — just denser. Old prep books that say "schedule a 4-hour test" are wrong.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-format',
      kind: 'concept',
      goal: 'Sections, timing, scoring.',
      keyIdeas: [
        'FIVE SECTIONS in this order: Analytical Writing (1 essay), Verbal Section 1 (12 Q / 18 min), Quant Section 1 (12 Q / 21 min), Verbal Section 2 (15 Q / 23 min), Quant Section 2 (15 Q / 26 min). Total ~1h 58m.',
        'ANALYTICAL WRITING: ONE essay only, "Analyze an Issue" prompt, 30 minutes. The "Analyze an Argument" task was REMOVED. Scored 0-6 in half-point increments.',
        'VERBAL REASONING: 27 total Q across 2 sections, 41 min total. Same three question types — Text Completion, Sentence Equivalence, Reading Comprehension.',
        'QUANTITATIVE REASONING: 27 total Q across 2 sections, 47 min total. Same four question types — Quantitative Comparison, Problem Solving (multiple choice + multiple answer), Numeric Entry, Data Interpretation.',
        'CALCULATOR: on-screen four-function + square root + parentheses, available throughout the Quant sections only.',
        'NO UNSCORED SECTION. The pre-Sept 2023 GRE had an unscored experimental section that could appear anywhere — gone. Every section now counts.',
        'SCORING: Verbal 130-170, Quant 130-170, AWA 0-6. Verbal + Quant total 260-340. Reported separately on the score report; schools weight the three components themselves.',
        'SCORE TURNAROUND: scores arrive in 8-10 days (vs 10-15 days for the longer format).',
      ],
      vocabulary: [
        { term: 'Analyze an Issue', definition: 'the GRE Analytical Writing prompt that asks you to take a position on a stated issue and defend it with reasoning and examples.' },
        { term: 'on-screen calculator', definition: 'GRE\'s built-in basic calculator (four-function + square root) available during Quant sections.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-adaptive',
      kind: 'concept',
      goal: 'Section-level adaptive routing.',
      keyIdeas: [
        'SECTION-LEVEL ADAPTIVE: not question-by-question CAT. Within Verbal: your Section 1 performance determines Section 2 difficulty (easier or harder mix). Same for Quant.',
        'ROUTING IMPACT: Section 2 difficulty influences your section score CEILING. A harder Section 2 lets you score higher; an easier one caps you slightly. ETS publishes the score-equating tables, so the scoring is fair across difficulty paths.',
        'DON\'T DELIBERATELY UNDERPERFORM Section 1. Your Section 2 ceiling drops if you\'re routed easy. Always do your best on Section 1.',
        'SECTION 1 has FIXED difficulty for every test taker — it\'s the calibration. Section 2 is the adaptive part.',
        'CROSS-SECTION INDEPENDENCE: Verbal routing doesn\'t affect Quant routing. Each measure adapts independently.',
        'WITHIN A SECTION: you can navigate freely — go back, change answers, mark for review. ETS calls this "non-adaptive within section." Use the review feature.',
        'BETWEEN SECTIONS: locked. Once you submit a section, it can\'t be changed.',
      ],
      vocabulary: [
        { term: 'section-level adaptive', definition: 'a test format where Section 2\'s difficulty is selected based on Section 1 performance — not per-question adaptive.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You\'ve completed Verbal Section 1 and felt it went well. As you start Verbal Section 2, the questions feel noticeably harder. What does that signal, and how should you respond?',
      expectedAnswer: 'It signals you were routed to the harder Section 2 — which is GOOD news because it means your Section 2 is on the higher-scoring difficulty path (no ceiling cap). Don\'t panic at the difficulty. Keep pacing steadily. Each correct answer here is worth more than on the easier path. Hard but doable means you\'re probably scoring well.',
      responseFormat: 'free',
      hints: [
        'Harder Section 2 = you were routed up after a strong Section 1.',
        'Easier Section 2 = you were routed down (lower score ceiling).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-old-format',
      kind: 'misconception_check',
      question: 'You\'re using a 2022 GRE prep book. It tells you to schedule a 4-hour test session and to write two essays. Should you trust this guidance?',
      commonErrors: [
        {
          answer: 'yes — the GRE is a stable test',
          misconception: 'Treating the GRE as if it hasn\'t changed in years.',
          correctsTo: 'No. ETS dramatically restructured the GRE on September 22, 2023. The test is now 1h 58m (not 4 hours), there\'s ONE essay (the Argument task is gone), and the unscored experimental section is removed. A 2022 prep book\'s timing strategy will leave you over-prepared in some places and under-prepared in others. Use 2024+ resources only — pre-2024 guidance is outdated.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '5 sections, ~1h 58m. AWA (1 essay) + 2 V (27 Q / 41 min) + 2 Q (27 Q / 47 min).',
        'Verbal 130-170. Quant 130-170. AWA 0-6.',
        'Section-level adaptive: Section 2 difficulty = function of Section 1 performance.',
        'No unscored experimental section anymore. Argument essay removed.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did ETS keep section-level adaptive instead of moving to fully question-by-question adaptive (like NCLEX or the old computer-adaptive GRE)?',
      hint: 'Question-by-question adaptive locks each item once submitted — no review, no second-guessing. Test-takers strongly prefer being able to revisit answers within a section. Section-level adaptive preserves that within-section flexibility while still adapting overall difficulty. Trade-off: less precise score targeting than full CAT, but better candidate experience and easier psychometric calibration. The shortened format made keeping section-level adaptive more important — with fewer questions, accidental misclicks would matter more if review was forbidden.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
