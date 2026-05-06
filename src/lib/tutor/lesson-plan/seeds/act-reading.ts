/**
 * ACT — Reading: 40 questions, 35 minutes, 4 passages.
 *
 * Brutal pace. ~52 seconds per question / ~9 minutes per passage.
 * Four standard passage types in fixed order: Prose Fiction, Social
 * Science, Humanities, Natural Science. Strategy: skim or read
 * the passage selectively, then attack questions and find evidence.
 */

import type { LessonPlan } from '../types';

export const SEED_ACT_READING: LessonPlan = {
  id: 'evelyn.testprep.act.reading.v1',
  title: 'ACT Reading: Pacing and Strategy',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act-reading',
  locale: 'en',
  los: [
    {
      id: 'act.reading',
      description: 'Apply pacing and evidence strategies to ACT Reading questions.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the time crunch real.',
      script: 'ACT Reading: 40 questions in 35 minutes across 4 passages. About 9 minutes per passage. Most students who don\'t finish missed the time budget. The path to a high Reading score isn\'t reading FASTER — it\'s reading SMARTER, attacking the questions strategically.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-act-reading',
      kind: 'concept',
      goal: 'Passage types, time budget, two main reading strategies, question types.',
      keyIdeas: [
        'FOUR PASSAGE TYPES (in order):',
        '  1) PROSE FICTION (or LITERARY NARRATIVE) — a fiction excerpt.',
        '  2) SOCIAL SCIENCE — economics, history, anthropology, etc.',
        '  3) HUMANITIES — art, music, philosophy, biography.',
        '  4) NATURAL SCIENCE — biology, chemistry, physics, etc.',
        'TIME BUDGET: ~9 minutes per passage. Spend ~3 minutes reading, ~6 minutes on questions.',
        'TWO main reading strategies (use what works for you):',
        '  STRATEGY A — read first, then answer: skim the passage in ~3 minutes, then go to questions.',
        '  STRATEGY B — questions first: glance at questions, find keywords, hunt for them in the passage.',
        '  Most students do best with A for fiction/humanities and B for science (since science questions often reference specific lines/data).',
        'QUESTION TYPES:',
        '  MAIN IDEA / PURPOSE: about the whole passage. Avoid answers too narrow or too broad.',
        '  DETAIL: specific information. Find it in the passage; verify exact wording.',
        '  INFERENCE: not directly stated; the answer must be SUPPORTED by the text.',
        '  VOCABULARY-IN-CONTEXT: meaning of a word AS USED, not the dictionary default.',
        '  AUTHOR\'S TONE / ATTITUDE: how does the author feel about the subject? Look for emotionally-loaded words.',
        'STRATEGY tips:',
        '  All answers are IN the passage. Don\'t add your own knowledge.',
        '  Avoid extreme answers ("always", "never", "all").',
        '  Wrong answers often have ONE thing right but ONE thing wrong (half-right trap).',
        '  Time-pressure tip: if a passage looks dense, skim or skip-and-return. Hard for some students; ALWAYS guess on remaining.',
      ],
      vocabulary: [
        { term: 'main idea', definition: 'what the passage is mostly about.' },
        { term: 'inference', definition: 'a conclusion supported by — but not directly stated in — the text.' },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-strategy',
      kind: 'worked_example',
      problem: 'Walk through a 9-minute plan for a single ACT Reading passage.',
      steps: [
        '0:00-3:00 — read the passage. For fiction, focus on character + situation; for nonfiction, focus on main idea + structure (intro/body/conclusion).',
        '3:00-9:00 — answer 10 questions in 6 minutes (~36 seconds each).',
        'For DETAIL questions: find the exact line. Don\'t guess from memory.',
        'For MAIN IDEA: think about what the WHOLE passage was about, not one part.',
        'For VOCABULARY: cover the choices, predict your own substitute, then match.',
        'If stuck on a question: eliminate two choices, guess from remaining two, MOVE ON. Don\'t blow the budget.',
      ],
      answer: 'See plan',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A passage describes a scientist\'s experiments matter-of-factly. The author "tone" is best described as: (a) ecstatic (b) skeptical (c) neutral / objective (d) bitter',
      expectedAnswer: 'c',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Ecstatic' },
        { id: 'b', text: 'Skeptical' },
        { id: 'c', text: 'Neutral / objective', correct: true },
        { id: 'd', text: 'Bitter' },
      ],
      hints: [
        '"Matter-of-factly" suggests no strong emotion either way.',
        'Look for the calmest answer.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-read-twice',
      kind: 'misconception_check',
      question: 'Owen reads each ACT Reading passage twice carefully before answering questions. He runs out of time. What\'s his issue?',
      commonErrors: [
        {
          answer: 'no issue — careful reading is good',
          misconception: 'Treating ACT Reading like leisure reading or careful schoolwork.',
          correctsTo: 'Two passes is too many for the time budget. ACT Reading is a SPEED test as much as a comprehension test. One quick pass + dive into questions is the right balance. Use the questions to PULL you back to specific lines instead of trying to remember everything.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four passages in fixed order: prose fiction, social science, humanities, natural science.',
        '~9 minutes per passage. ~3 read + ~6 questions.',
        'All answers are in the passage — don\'t add outside knowledge.',
        'Avoid extreme-language answers and half-right traps.',
        'Don\'t read passages twice; trust your first read + question hunting.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Take a practice ACT Reading section and try Strategy B (questions first) on one passage. Did your time and accuracy change?',
      hint: 'Most students prefer A or a hybrid. The point is to find what works for YOU and stick with it.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
