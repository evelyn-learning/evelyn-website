/**
 * K — Sight words (high-frequency words).
 *
 * Some short words don\'t follow phonics rules and just have to be
 * memorized — these are sight words. Focus on the first 25 Dolch K
 * words: a, and, away, big, blue, can, come, down, find, for, funny,
 * go, help, here, I, in, is, it, jump, little, look, make, me, my, not.
 */

import type { LessonPlan } from '../types';

export const SEED_K_ELA_SIGHT_WORDS: LessonPlan = {
  id: 'evelyn.k.ela.reading.sight-words.v1',
  title: 'Sight words: words you just know',
  curriculum: 'CCSS',
  grade: 'K',
  subject: 'ela',
  topic: 'reading',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.k.rf.3.c',
      description: 'Read common high-frequency words by sight (e.g., the, of, to, you, she, my, is, are, do, does).',
      standard: 'CCSS.ELA-LITERACY.RF.K.3.C',
    },
  ],
  prerequisites: ['ccss.ela.k.rf.3.a'],
  followUps: ['ccss.ela.1.rf.3.g'],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that some words are SO common we should just know them on sight.',
      script: 'Look at this word: THE. You see it in almost every sentence! Some words pop up so often that good readers don\'t sound them out — they just KNOW them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-sight-words',
      kind: 'concept',
      goal: 'Sight words are tiny common words you recognize at a glance, without sounding them out.',
      keyIdeas: [
        'A SIGHT WORD is one you know just by looking — no sounding out needed.',
        'They are usually tiny: "the", "and", "to", "I", "is", "a".',
        'Some sight words break the phonics rules ("the" — why is the e silent?), so we memorize them.',
        'The more sight words you know, the faster you can read sentences.',
      ],
      vocabulary: [
        { term: 'sight word', definition: 'a word you read instantly without sounding it out.' },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'worked-the',
      kind: 'worked_example',
      problem: 'Learn the sight word "THE".',
      steps: [
        'Look at the word THE. Three letters: T-H-E.',
        'It says "thuh". Not "thee" — THUH.',
        'Find it in this sentence: "The cat sat." See it at the start?',
        'Now say "the" three times: the, the, the. That\'s a sight word locked in!',
      ],
      answer: 'the',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Read this sight word: "AND". What sound does it make?',
      expectedAnswer: 'and',
      responseFormat: 'free',
      hints: [
        'Don\'t overthink — it sounds exactly like the word "and" when you connect two things: "milk AND cookies".',
        'Three letters: a-n-d.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-sound-out',
      kind: 'misconception_check',
      question: 'Should you sound out "the" as /t/ /h/ /e/?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Trying to phonics-sound-out a sight word.',
          correctsTo: 'No — sight words are MEMORIZED, not sounded out. "The" says "thuh" — just know it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Sight words are tiny common words you read INSTANTLY.',
        'You don\'t sound them out — you memorize them.',
        'Knowing more sight words makes reading faster.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Pick three sight words from today and use them in one sentence: the, and, I.',
      hint: 'Try: "I see the dog and the cat."',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
