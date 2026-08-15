/**
 * SSAT / ISEE — Independent school admissions test strategy.
 *
 * For middle and upper-school admissions. Verbal, quant, reading,
 * and a writing sample. Strategy + how to handle the wrong-answer
 * penalty (SSAT) and section pacing.
 */

import type { LessonPlan } from '../types';

export const SEED_SSAT_ISEE_STRATEGY: LessonPlan = {
  id: 'evelyn.testprep.ssat-isee.strategy.v1',
  title: 'SSAT / ISEE: independent school admissions strategy',
  curriculum: 'CCSS',
  grade: 'sat-act',
  subject: 'ela',
  topic: 'ssat-isee',
  locale: 'en',
  los: [
    {
      id: 'ssat-isee.strategy',
      description: 'Apply effective strategy to the SSAT or ISEE admissions test, including pacing and the SSAT guessing penalty.',
      standard: 'SSAT-ISEE',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame as a high-pressure but learnable test.',
      script: 'SSAT and ISEE are admissions tests for independent schools. They test material you\'ve mostly already learned — but in a tricky timed format. Strategy beats panicked solving.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-overview',
      kind: 'concept',
      goal: 'Format + section strategy + the guessing penalty difference.',
      keyIdeas: [
        'SSAT FORMAT (Middle Level grades 5-7, Upper Level 8-11): writing sample (not scored, sent to schools), quantitative, reading, verbal (synonyms + analogies), 2nd quant section. ~3 hours total.',
        'ISEE FORMAT (Lower 4-5, Middle 6-7, Upper 8-11): verbal reasoning (synonyms + sentence completion), quantitative reasoning, reading, math achievement, essay. ~2.5-3 hours.',
        'KEY DIFFERENCE: SSAT has a WRONG-ANSWER PENALTY (-1/4 point per wrong answer). ISEE does NOT — guess on every blank.',
        'SSAT GUESSING STRATEGY: only guess if you can eliminate at least ONE choice (raises expected value above zero). Skip blind.',
        'ISEE GUESSING: ALWAYS fill an answer. Never leave blank.',
        'PACING: about 1 minute per question on average. Watch the clock per section. Skip hard ones; come back if time remains.',
        'WRITING SAMPLE: not graded numerically but sent to schools. Treat it seriously — clear structure, supporting examples, neat handwriting (paper version) or clean typing (computer version).',
        'VOCABULARY: both tests reward strong vocab. Best prep: read widely + targeted word lists.',
      ],
      vocabulary: [
        { term: 'guessing penalty', definition: 'the SSAT\'s -1/4 point per wrong answer.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-ssat-guess',
      kind: 'worked_example',
      problem: 'On SSAT, a question has 5 choices. You can rule out 2. Should you guess?',
      steps: [
        'After eliminating 2, you have 3 remaining — 1 right, 2 wrong.',
        'Probability of correct guess = 1/3. Expected value = (1/3)(+1) + (2/3)(-1/4) = 1/3 - 1/6 = 1/6. POSITIVE expected value.',
        'YES, guess. Eliminating any choice tilts the odds in your favor.',
        'Without elimination: 1/5 right, 4/5 wrong. EV = 1/5 - 4/5 · 1/4 = 1/5 - 1/5 = 0. Break-even — most experts say skip blind.',
      ],
      answer: 'yes — even one elimination gives positive EV',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'On ISEE, when should you skip a question and leave it blank?',
      expectedAnswer: 'never — no penalty, always fill in',
      responseFormat: 'free',
      hints: [
        'ISEE has no wrong-answer penalty.',
        'Best response: bubble in your best guess on every question.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-essay-doesnt-matter',
      kind: 'misconception_check',
      question: 'Since the writing sample isn\'t scored, is it safe to skip or rush it?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating unscored as unimportant.',
          correctsTo: 'No — schools READ the writing sample. It can swing admission decisions, especially when scores are similar between applicants. A thoughtful, well-organized response demonstrates the kind of student you are.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SSAT has wrong-answer penalty; ISEE does not.',
        'SSAT: guess only after eliminating at least one choice.',
        'ISEE: ALWAYS fill an answer.',
        'Writing sample matters — schools read it.',
        'Vocab + pacing are the biggest differentiators.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might independent schools weight the writing sample heavily despite no number score?',
      hint: 'Number scores tell them what a student CAN do; writing tells them HOW the student thinks. Many independent schools value the qualitative more than the quantitative.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
