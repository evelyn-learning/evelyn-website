/**
 * G1 — Reading fluency basics.
 *
 * Reading smoothly: not too fast, not too slow, with feeling. Three
 * pillars: accuracy, rate, expression. Read-aloud focus.
 */

import type { LessonPlan } from '../types';

export const SEED_G1_ELA_FLUENCY: LessonPlan = {
  id: 'evelyn.g1.ela.reading.fluency.v1',
  title: 'Reading fluency: smooth, steady, with feeling',
  curriculum: 'CCSS',
  grade: '1',
  subject: 'ela',
  topic: 'reading',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.1.rf.4',
      description: 'Read with sufficient accuracy and fluency to support comprehension.',
      standard: 'CCSS.ELA-LITERACY.RF.1.4',
    },
  ],
  prerequisites: ['ccss.ela.1.rf.3.a'],
  followUps: ['ccss.ela.2.rf.4'],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Contrast a robotic word-by-word read with a smooth one — student should hear the difference.',
      script: 'Listen — robot version: "The. Cat. Sat. On. The. Mat." Now smooth: "The cat sat on the mat." Which one sounds like real talking?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-pillars',
      kind: 'concept',
      goal: 'Fluent reading has three parts: accuracy, rate, and expression.',
      keyIdeas: [
        'ACCURACY: reading the words correctly — not skipping or swapping.',
        'RATE: a smooth, just-right speed. Not too slow (robot), not too fast (mumbled).',
        'EXPRESSION: voice goes UP for excitement, DOWN for sad parts; pauses at commas and stops at periods.',
        'All three together = sounding like you\'re telling a story, not just reading words.',
      ],
      vocabulary: [
        { term: 'fluency', definition: 'reading smoothly with the right speed and feeling.' },
        { term: 'expression', definition: 'using your voice to match what the words mean.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-cat-sat',
      kind: 'worked_example',
      problem: 'Read this with feeling: "The cat sat on the mat. It was a sunny day!"',
      steps: [
        'First, accuracy: read every word — the, cat, sat, on, the, mat.',
        'Now rate: not "the…cat…sat…" — keep it moving like normal talking.',
        'Now expression: pause at the period after "mat". Lift your voice for the excited "sunny day!"',
        'Put it together: "The cat sat on the mat. It was a sunny day!"',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Read this aloud with expression: "My dog ran fast! Where did he go?" What should your voice do at the question mark?',
      expectedAnswer: 'go up',
      responseFormat: 'free',
      hints: [
        'Question marks sound different from periods.',
        'Try saying "Where did he go?" — does your voice rise or fall at the end?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fast-equals-fluent',
      kind: 'misconception_check',
      question: 'Is faster reading always better?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Equating speed with fluency.',
          correctsTo: 'No — too fast and you skip words or miss the meaning. Fluent means JUST RIGHT speed, with feeling, where you understand what you read.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Fluent reading = accuracy + rate + expression.',
        'Pause at commas, stop at periods, lift voice at question marks.',
        'Smooth, not robotic. Steady, not racing.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Try reading this sad line then this happy line, with different voices: "He lost his ball." and "He found it!"',
      hint: 'Sad voice goes lower and slower; happy voice goes higher and brighter.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
