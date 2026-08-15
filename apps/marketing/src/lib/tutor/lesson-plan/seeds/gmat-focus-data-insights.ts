/**
 * GMAT Focus Edition — Data Insights section.
 *
 * The new section that replaced Integrated Reasoning AND absorbed
 * Data Sufficiency from the old Quant section. 20 questions in 45
 * minutes, 5 question types, on-screen calculator allowed.
 */

import type { LessonPlan } from '../types';

export const SEED_GMAT_FOCUS_DATA_INSIGHTS: LessonPlan = {
  id: 'evelyn.testprep.gmat-focus.data-insights.v1',
  title: 'GMAT Focus Data Insights: 5 Question Types and Strategy',
  curriculum: 'GMAC',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'gmat-quant',
  locale: 'en',
  los: [
    {
      id: 'gmat-focus.data-insights',
      description: 'Identify the five Data Insights question types (Data Sufficiency, Table Analysis, Multi-Source Reasoning, Graphic Interpretation, Two-Part Analysis), apply per-type strategy, and use the on-screen calculator and bookmark/review features effectively.',
      standard: 'GMAT-FOCUS-DI',
    },
  ],
  prerequisites: ['gmat-focus.format-overview'],
  followUps: ['gmat-focus.quant-verbal-changes'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Data Insights is the section that distinguishes Focus from Classic.',
      script: 'Data Insights wasn\'t lifted from somewhere else — it\'s a deliberate redesign of how the GMAT measures data-literacy skills. Five very different question types, all sharing one DNA: "interpret evidence, decide, justify." Multi-source reasoning makes you cross-check tables and emails. Graphic interpretation makes you read a scatterplot. Two-part analysis tests pairs of related decisions at once. The skills here map almost 1:1 onto what an MBA program will demand from you.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-question-types',
      kind: 'concept',
      goal: 'The 5 Data Insights question types.',
      keyIdeas: [
        'DATA SUFFICIENCY (DS): a question + 2 statements. You decide whether (A) statement 1 alone is sufficient, (B) statement 2 alone is sufficient, (C) both together are sufficient but neither alone, (D) each alone is sufficient, (E) neither sufficient even together. You DO NOT compute the answer — only judge sufficiency. Memorize the 5 answer choices cold; they don\'t change.',
        'TABLE ANALYSIS (TA): a sortable table with multiple columns. Below it, 3 yes/no statements. You sort columns and answer all 3. Strategy: sort by the column the question implies (e.g., "highest revenue" → sort by revenue descending), THEN scan for the answer.',
        'MULTI-SOURCE REASONING (MSR): 2-3 tabs (e.g., an email, a memo, a chart) that you cross-reference. Then 3 yes/no statements OR 1 multiple-choice — you have to combine information from MULTIPLE tabs. Slowest item type — budget 6+ minutes per MSR set.',
        'GRAPHIC INTERPRETATION (GI): a chart (scatterplot, bar, line, segmented). You complete 2 sentences with drop-down values to describe what the graph shows. Look at axes + units carefully.',
        'TWO-PART ANALYSIS (TPA): a single problem with 2 related sub-questions in a table format (column 1 = part A, column 2 = part B). Often coupled — the right answer to part A constrains part B (or vice versa). Read both before answering either.',
        'DISTRIBUTION: ~20 questions split across the 5 types. DS items are most common (~6-8). MSR sets count as multiple questions per set (one set = 3 items).',
        'CALCULATOR is on-screen — Data Insights is the ONLY section with one. It\'s a basic four-function/scientific calculator. Don\'t over-rely; many questions are faster with mental math or pencil work.',
      ],
      vocabulary: [
        { term: 'Data Sufficiency', definition: 'GMAT item type asking whether given statements are sufficient to answer a question.' },
        { term: 'Multi-Source Reasoning', definition: 'item set where information is split across 2-3 tabs and the candidate must integrate.' },
        { term: 'Two-Part Analysis', definition: 'item with two related sub-questions in a column format; answers often interconnect.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-ds',
      kind: 'worked_example',
      problem: 'Data Sufficiency example: "What is the value of x?" Statement (1): x² = 25. Statement (2): x is positive. Which choice is correct?',
      steps: [
        'STATEMENT (1) ALONE: x² = 25 → x = +5 OR x = −5. Two possible values. NOT SUFFICIENT alone.',
        'STATEMENT (2) ALONE: x is positive. Tells us nothing about x\'s value (could be 1, 100, anything). NOT SUFFICIENT alone.',
        'BOTH TOGETHER: x² = 25 AND x positive → x = 5 (only). SUFFICIENT together.',
        'ANSWER: (C) — both statements together are sufficient, but neither alone.',
        'KEY DS TRAP: students compute x and write down 5 — but DS isn\'t asking for the value. It\'s asking which combination of statements gives a UNIQUE answer. The "answer" is the choice letter, not a number.',
      ],
      answer: 'Choice (C). Both statements together are sufficient; neither alone is.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You hit a Multi-Source Reasoning problem with 3 tabs (an email, a profit table, a budget memo) and 3 yes/no statements to evaluate. You have ~8 minutes left and 4 more questions to do. Should you finish the MSR or skip the rest?',
      expectedAnswer: 'Try to finish the MSR — but bookmark hard parts. MSR sets count as 3 separate questions (one per yes/no). Skipping the MSR loses 3 points; finishing the other 4 questions gains 4. So finishing all is more valuable. Strategy: spend 2 minutes integrating the tabs, 1 minute on each of the 3 statements (= 5 min). Then 3 minutes for the remaining 4 quick questions. Bookmark anything you can\'t solve in 60 seconds and move on; come back if time permits.',
      responseFormat: 'free',
      hints: [
        'MSR sets count as MULTIPLE questions, not one.',
        'Use the bookmark feature liberally.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-ds-compute',
      kind: 'misconception_check',
      question: 'On a Data Sufficiency question, you should compute the value of x using the given statements before selecting an answer choice. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating DS as a Problem Solving question.',
          correctsTo: 'False. DS does not ask for the value — it asks whether the statements ALLOW a unique value. You should evaluate each statement independently for SUFFICIENCY. If you find yourself computing x, you\'re wasting time. The question is "Does this give me ONE answer?" not "What is the answer?" GMAC moved DS into Data Insights specifically because it tests data-evaluation skill, not arithmetic skill. The 5 answer choices (A-E) never change — memorize them.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '5 question types: DS, Table Analysis, Multi-Source Reasoning, Graphic Interpretation, Two-Part Analysis.',
        '20 Q in 45 min ≈ 2.25 min per question; MSR sets eat more time.',
        'On-screen calculator — only section that has one. Don\'t over-rely.',
        'DS asks SUFFICIENCY, not value. Memorize the 5 answer choices.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is Data Insights considered the most "MBA-relevant" section of GMAT Focus?',
      hint: 'It mirrors the actual cognitive load of business decisions: integrate information from multiple sources (emails, dashboards, market reports), decide what data is sufficient, interpret charts, weigh alternatives. Quant tests calculation skill (relevant but narrower); Verbal tests reading/argument analysis (also narrower). DI tests SYNTHESIS — the meta-skill of "given a pile of evidence, what\'s the right call?" — which is closer to actual managerial work. That\'s why GMAC made DI count toward the total score (the old IR section didn\'t).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
