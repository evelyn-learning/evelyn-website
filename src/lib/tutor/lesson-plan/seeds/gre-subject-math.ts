/**
 * GRE Subject Test — Mathematics.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_SUBJECT_MATH: LessonPlan = {
  id: 'evelyn.gre.subject.math.v1',
  title: 'GRE Math Subject Test strategy',
  curriculum: 'ETS',
  grade: '12',
  subject: 'test-prep',
  topic: 'gre-math-subject',
  locale: 'en',
  los: [
    {
      id: 'gre.subject-math',
      description: 'Apply effective strategy to the GRE Mathematics Subject Test: content scope, time pressure, scoring conventions, and prep approach for a math major.',
      standard: 'GRE-MATH',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'GRE Subject Math is for math grad school applicants.',
      script: 'The GRE Math Subject Test is taken by undergraduates applying to math PhD programs. It\'s separate from the general GRE (which everyone takes) and tests the actual undergraduate math major: calculus, algebra, real analysis, abstract algebra, topology, complex analysis. Top math programs essentially require it. Strategy is about COMPREHENSIVE PREP across a wide content area.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Content scope, format, prep timeline, scoring.',
      keyIdeas: [
        'FORMAT: 66 multiple-choice questions in 2 hours 50 minutes. Paper-based. Scored 200-990 (subject-specific scale).',
        'CONTENT BREAKDOWN (approximate): CALCULUS (~50%) — single + multivariable, sequences, series, vector calc. ALGEBRA (~25%) — linear algebra, abstract algebra (groups, rings, fields). OTHER (~25%) — discrete math, real analysis (continuity, differentiability, integration, metric spaces), complex analysis basics, intro topology, probability + statistics.',
        'SCORING: −1/4 per wrong (penalty for guessing). Skip questions you\'re uncertain on. With 66 Qs, missing 10 doesn\'t hurt much; guessing wrong on all 10 costs 2.5 raw points.',
        'TIME PRESSURE: 2.5 minutes per question on average — but easy ones take 30 seconds and hard ones take 5+ minutes. Pace yourself.',
        'PREP TIMELINE: Most students prep 3-6 months. Strong calculus students need less; students with weak abstract algebra need more.',
        'KEY TOPICS to drill: limit theorems, Taylor series, vector calc (Stokes, divergence), linear algebra eigenvalues + diagonalization, group theory (Lagrange, Sylow basics), metric space convergence, continuity / differentiability tests.',
        'BOOKS: Princeton Review GRE Math Subject Test, "Cracking the GRE Math Subject Test", and PRACTICE PAST EXAMS (ETS releases old tests — these are the gold standard for prep).',
        'STRATEGY: scan all 66 questions, mark obvious answers fast (calculus is usually quick). Skip hard ones first pass; return after easy ones banked.',
        'COMPARED TO GRE GENERAL: subject test is much harder, narrower in scope, and only relevant for math/CS PhD applicants. Most other grad programs require general GRE only.',
      ],
      vocabulary: [
        { term: 'subject test', definition: 'a discipline-specific GRE measuring depth in one field.' },
        { term: 'guessing penalty', definition: 'a fraction of a point deducted for incorrect answers, designed to discourage random guessing.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-strategy',
      kind: 'worked_example',
      problem: 'You\'re taking the test and have 90 minutes left with 30 questions remaining. How should you allocate time?',
      steps: [
        '90 / 30 = 3 minutes per question average. But you\'ve done 36 in the first 80 minutes — let\'s see what\'s left.',
        'SCAN remaining 30: identify EASY (E), MEDIUM (M), HARD (H). Aim for 12E + 12M + 6H breakdown if typical.',
        'BUDGET: 1 min on each E (12 min), 3 min on each M (36 min), 5-7 min on each H (30-42 min).',
        'Total: 12 + 36 + 30 = 78 min for 30 Qs (within 90 min). Leaves 12 min buffer.',
        'PRIORITY: do all E\'s first, banking confidence. Then M\'s. H\'s only if time and you have a real path. Skip H\'s without a path — guessing penalty doesn\'t reward random guesses.',
        'IF FALLING BEHIND: skip more aggressively. 50 great answers > 60 mixed answers given the −1/4 penalty.',
      ],
      answer: 'E first (1 min each), then M (3 min), then H (5-7 min). Skip H without a clear path.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is PRACTICING WITH PAST GRE MATH SUBJECT TESTS more valuable than working through general math problem sets?',
      expectedAnswer: 'The subject test has a specific question STYLE — multiple choice, ~3 minutes per question, reliance on standard methods. Past exams reveal exactly which topics ETS considers high-frequency (vector calc, eigenvalues, Taylor series come up every year) and the LEVEL of depth expected. Generic problem sets don\'t calibrate you to the test format. Past exams also show you the answer choices style — often distractors that match common errors.',
      responseFormat: 'free',
      hints: [
        'What\'s unique about ETS\'s question style?',
        'How can you tell which topics will appear?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-everything',
      kind: 'misconception_check',
      question: 'Should you study every undergrad math topic equally for the GRE Math Subject Test?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating the test as exhaustive coverage.',
          correctsTo: 'No — calculus is ~50% of the test. Linear algebra + abstract algebra together are ~25%. The rest is split among real analysis, complex analysis, topology, probability, discrete math. Allocate STUDY TIME proportionally. A student who masters calculus and linear algebra can clear 60-70% of the test before tackling the harder pure-math sections. Don\'t spend a month on knot theory because your professor loves it — it won\'t appear.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '66 Qs in 2hr 50min. −1/4 per wrong (skip uncertain).',
        'Calculus ~50%, algebra ~25%, other ~25%. Allocate prep accordingly.',
        'Past ETS exams are the highest-yield practice.',
        'Easy → medium → hard. Skip hard without a path.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why do top math PhD programs care about your GRE subject score even though you also have a transcript and letters?',
      hint: 'Standardized comparison. Letters are subjective; grades vary by institution; the subject test is the same exam for everyone. A 990 from a small college shows the candidate has the same knowledge as one from a top program. Programs receiving 200+ applicants need fast filters. Score below the median for a target program signals a weakness — even with great letters.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
