/**
 * GMAT Focus Edition — Format Overview.
 *
 * GMAT Focus Edition replaced GMAT Classic in February 2024. Currency-
 * checked against mba.com (GMAC's official site) + e-GMAT and Yocket's
 * Focus Edition guides for section structure, scoring scale (now
 * 205-805), and removed components (AWA, IR, Sentence Correction,
 * Geometry).
 */

import type { LessonPlan } from '../types';

export const SEED_GMAT_FOCUS_FORMAT_OVERVIEW: LessonPlan = {
  id: 'evelyn.testprep.gmat-focus.format-overview.v1',
  title: 'GMAT Focus Edition: Format, Scoring, and What Changed',
  curriculum: 'GMAC',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'gmat-quant',
  locale: 'en',
  los: [
    {
      id: 'gmat-focus.format-overview',
      description: 'Describe the GMAT Focus Edition structure, scoring (205-805), section breakdown, and the major changes from GMAT Classic (AWA removed, Integrated Reasoning replaced by Data Insights, Sentence Correction and Geometry removed).',
      standard: 'GMAT-FOCUS',
    },
  ],
  prerequisites: [],
  followUps: ['gmat-focus.data-insights', 'gmat-focus.quant-verbal-changes'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'GMAT Focus is a 2024 reset — shorter, no essay, new section.',
      script: 'GMAC retired GMAT Classic in February 2024 and rolled out GMAT Focus Edition. New shape: 3 sections (was 4), 2 hours 15 minutes (was 3+ hours), no essay, and a brand-new Data Insights section that absorbs the old Integrated Reasoning AND moves Data Sufficiency questions OUT of Quant and INTO Data Insights. The scoring scale also changed: 205-805 instead of 200-800. If you\'re studying from materials older than late 2023, you\'re studying for the wrong test.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-format',
      kind: 'concept',
      goal: 'Sections, timing, scoring scale.',
      keyIdeas: [
        'THREE SECTIONS: Quantitative Reasoning, Verbal Reasoning, Data Insights. Each ~45 minutes. Total 64 questions, 2 hours 15 minutes.',
        'QUANT: 21 questions, 45 min. Problem Solving only — Data Sufficiency moved to Data Insights. NO geometry — College Algebra and Arithmetic only.',
        'VERBAL: 23 questions, 45 min. Reading Comprehension + Critical Reasoning only. NO Sentence Correction (removed entirely).',
        'DATA INSIGHTS (new section): 20 questions, 45 min. Five question types — Data Sufficiency, Table Analysis, Multi-Source Reasoning, Graphic Interpretation, Two-Part Analysis. ON-SCREEN CALCULATOR allowed (only section that has one).',
        'NO ESSAY: AWA (Analytical Writing Assessment) was removed entirely. The Focus Edition is all multiple-choice / structured-response.',
        'SCORING: total score 205-805 (in 10-point increments). Each section scored 60-90. The total is computed from all three section scores — Data Insights now CONTRIBUTES to the total (the old IR didn\'t).',
        'CHOOSE YOUR ORDER: at the test center, you can pick the order to take the three sections (any of 6 permutations). Pick your strongest section first to bank confidence, or your hardest first while you\'re fresh.',
        'BOOKMARK / REVIEW / EDIT: within a section, you can bookmark questions, return to review, and edit up to 3 answers per section. Use this — Classic GMAT didn\'t allow review.',
        'TWO 10-MINUTE OPTIONAL BREAKS — the timing pause between sections.',
      ],
      vocabulary: [
        { term: 'Data Insights', definition: 'the new GMAT Focus section that replaced Integrated Reasoning and absorbed Data Sufficiency from Quant.' },
        { term: 'Data Sufficiency', definition: 'a question type asking whether the given statements are sufficient to answer a question, not what the answer is. Lives in Data Insights now.' },
        { term: 'AWA', definition: 'Analytical Writing Assessment — the essay section that was removed when Focus Edition launched.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-changes',
      kind: 'concept',
      goal: 'What was added, what was removed.',
      keyIdeas: [
        'REMOVED FROM EXAM: AWA (essay), Integrated Reasoning section, Sentence Correction (Verbal), Geometry (Quant).',
        'ADDED: Data Insights section. Bookmark + review + 3-edit feature within sections.',
        'MOVED: Data Sufficiency moved from the old Quant section to Data Insights. Same question type — different section.',
        'IMPACT FOR PREP: any "GMAT Quant" book older than late 2023 will spend significant pages on geometry questions that no longer appear, and on Data Sufficiency mixed into Quant. Buy 2024+ materials only.',
        'IMPACT FOR VERBAL: cuts 5+ Sentence Correction questions per old test. The savings stays in Verbal — you get more time per RC and CR question now (~2 minutes per question vs 1.8 before).',
        'WHY GMAC MADE THESE CHANGES: research showed Sentence Correction over-tested native-English-speaker idioms, disadvantaging international applicants. Geometry was less predictive of MBA-program success than data analysis. The whole exam was redesigned around "data literacy" as the central business skill.',
      ],
      vocabulary: [
        { term: 'Sentence Correction', definition: 'a Verbal question type (now retired) that tested grammar and idiom usage by asking the candidate to choose the best-worded version of an underlined phrase.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You\'re strongest in math, weakest in reading comprehension. In what order should you take the three GMAT Focus sections?',
      expectedAnswer: 'Likely best: Quant first (bank a strong score, build confidence), then Data Insights (mix of math and reasoning, keeps your math momentum), then Verbal last. Alternative: take Verbal first while fresh, then Quant, then Data Insights — this works if you fade fast on reading. Either way, don\'t leave your weakest until last unless you know your stamina holds. The order is YOUR choice on test day.',
      responseFormat: 'free',
      hints: [
        'Order is candidate\'s choice — any permutation of the 3 sections.',
        'Common strategies: strongest-first (confidence) or weakest-first (fresh).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-essay',
      kind: 'misconception_check',
      question: 'You should still practice writing GMAT-style argument essays because the AWA section is on the exam. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Carrying over GMAT Classic format expectations.',
          correctsTo: 'False. GMAC removed the AWA (essay) section when it launched the Focus Edition in February 2024. Don\'t spend prep time writing argument essays — that time goes to Data Insights or Verbal practice instead. Check the publication date on any prep materials: anything pre-2024 will assume AWA is on the test, and that\'s wrong now.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '3 sections, 64 Q, 2h15m. Quant 21 / Verbal 23 / Data Insights 20.',
        'Total score 205-805. Each section scored 60-90.',
        'REMOVED: AWA, IR section name, Sentence Correction, Geometry. Data Sufficiency moved to Data Insights.',
        'Bookmark + review + 3 edits per section. Calculator only in Data Insights.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did GMAC move Data Sufficiency out of Quantitative Reasoning and into Data Insights?',
      hint: 'Data Sufficiency tests whether the GIVEN information is enough to answer — a data-evaluation skill, not an arithmetic-execution skill. The old GMAT lumped it with Problem Solving in Quant, which conflated "can you compute" with "can you tell what data you need." Moving DS to Data Insights aligns the question type with what it actually measures (data-literacy reasoning), and frees the Quant section to be cleanly about computation/algebra. Better measurement validity is the formal reason.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
