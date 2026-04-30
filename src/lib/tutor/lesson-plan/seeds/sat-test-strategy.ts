/**
 * SAT — General test-taking strategy.
 *
 * The non-content meta-skills that move scores up: pacing,
 * elimination, guessing (no penalty), question-skipping, when to
 * use the calculator, the "two-pass" approach. Applies to all
 * sections. A 20-minute drill that lifts every section a bit.
 */

import type { LessonPlan } from '../types';

export const SEED_SAT_TEST_STRATEGY: LessonPlan = {
  id: 'evelyn.testprep.sat.test-strategy.v1',
  title: 'SAT Test-Taking Strategy',
  curriculum: 'SAT',
  grade: '11',
  subject: 'test-prep',
  topic: 'sat-strategy',
  locale: 'en',
  los: [
    {
      id: 'sat.strategy.general',
      description: 'Apply pacing, elimination, guessing, and two-pass strategies to maximize SAT score.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that strategy alone — independent of content — moves scores up.',
      script: 'Two students with identical knowledge can score very differently on the SAT depending on how they USE the time. Knowing when to skip, when to guess, and how to manage pacing turns a 1300 into a 1400 — without learning a single new fact. Strategy is content.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-strategies',
      kind: 'concept',
      goal: 'Six universal strategies that apply across sections.',
      keyIdeas: [
        '1) ALWAYS GUESS (NO PENALTY). The SAT does NOT penalize wrong answers. Never leave a question blank. If you\'re running out of time, fill in a single letter ("C" for everything left) — random guessing has positive expected value when there\'s no penalty.',
        '2) ELIMINATION FIRST. Even when you don\'t know the answer, you can usually rule out 1-2 obviously-wrong choices. Going from 4 choices (25% guess) to 2 (50%) is a major edge over an entire section.',
        '3) TWO-PASS APPROACH. First pass: solve every question you can in under ~1 minute. SKIP hard ones (mark them in your booklet). Second pass: come back to skipped questions with the time you saved. NEVER spend 4 minutes on one question while easier questions sit unread.',
        '4) PACING. Know your time budget. Math (no calc): ~75 sec/Q. Math (calc): ~85 sec/Q. Reading: ~75 sec/Q. Writing: ~50 sec/Q. If you\'re behind, skip aggressively until you catch up.',
        '5) USE THE CALCULATOR WISELY. Just because the calculator section ALLOWS one doesn\'t mean every question needs it. Many "calc section" questions are faster mentally. Reach for the calculator when arithmetic is messy.',
        '6) ALL ANSWERS ARE IN THE PASSAGE / EQUATION. The SAT never requires outside knowledge for Reading. Every Reading answer is in the text. For Math, every needed fact is given. Don\'t add details from your imagination.',
        'BUBBLE TIP: bubble the answer immediately after each question, not at the end. Skipping bubbling for the end risks running out of time and losing several questions even if you knew them.',
        'BREATH AND RESET: between sections, breathe for 30 seconds. Don\'t carry one section\'s frustration into the next.',
      ],
      vocabulary: [
        { term: 'two-pass approach', definition: 'first solve easy questions, come back to hard ones.' },
        { term: 'elimination', definition: 'crossing off obviously wrong answer choices.' },
      ],
      suggestedTools: ['show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-time-budget',
      kind: 'worked_example',
      problem: 'You\'re 20 minutes into the 35-minute Writing section and have done 25 of 44 questions. Are you ahead, behind, or on pace?',
      steps: [
        'Total time per question: 35 min / 44 Q ≈ 47 seconds. (Round to 50 sec for math ease.)',
        'Time used: 20 min = 1200 seconds.',
        'Questions done: 25.',
        'Time per question so far: 1200 / 25 = 48 seconds. About on pace (target 47-50).',
        'Remaining: 19 questions in 15 minutes (900 sec) → 47 sec/Q. On pace, no acceleration needed. Stay calm, keep moving.',
      ],
      answer: 'On pace',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You\'re stuck on a Math question that\'s eaten 3 minutes. You have 20 minutes left and 18 questions to go. What should you do?',
      expectedAnswer: 'Guess + skip; come back if time allows',
      responseFormat: 'free',
      hints: [
        '20 minutes / 18 questions = ~67 seconds per question. You can\'t afford 3+ more minutes here.',
        'Mark the question, guess (eliminate first if possible), move on. Better to lose ONE question than miss FIVE because you ran out of time.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-leave-blank',
      kind: 'misconception_check',
      question: 'Owen leaves 3 questions blank because he wasn\'t sure of the answers. He thinks "wrong is worse than blank." Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Carrying over the OLD SAT\'s wrong-answer penalty. The current SAT has NO penalty.',
          correctsTo: 'Wrong. The current SAT (since 2016) does NOT penalize wrong answers. A blank is guaranteed 0; a guess has 25% chance of being right (or higher with elimination). NEVER leave anything blank. Even random guesses raise your score in expectation.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Never leave blanks — no wrong-answer penalty.',
        'Eliminate first, then guess if needed.',
        'Two-pass: easy questions first, hard ones come back.',
        'Pacing matters: track yourself, skip when behind.',
        'All answers are in the passage / equation — no outside knowledge needed.',
        'Bubble as you go, not at the end.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Take a practice SAT section and DELIBERATELY skip the 5 hardest-looking questions on the first pass. Compare your score to a section where you grind through every question in order. Which approach scored higher?',
      hint: 'Most students score higher with strategic skipping because they bank easy points and don\'t lose them to time pressure.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
