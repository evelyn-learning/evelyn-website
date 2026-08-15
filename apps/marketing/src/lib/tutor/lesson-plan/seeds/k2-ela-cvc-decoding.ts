/**
 * Grades K-2 ELA — CVC Words & Decoding.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_ELA_CVC_DECODING: LessonPlan = {
  id: 'evelyn.k2.ela.cvc-decoding.v1',
  title: 'K-2 ELA — CVC Word Decoding',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'ela',
  topic: 'k2-ela',
  locale: 'en',
  los: [
    {
      id: 'k2.ela.cvc-decoding',
      description: 'Decode (sound out) CVC words: consonant-vowel-consonant patterns with short vowel sounds.',
      standard: 'CCSS.ELA-LITERACY.RF.K.3',
    },
  ],
  prerequisites: ['k2.ela.phonemic-awareness'],
  followUps: ['k2.ela.vowel-teams'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reading starts with sounding out — once kids can decode CVC words, they\'re officially reading.',
      script: 'CVC stands for Consonant-Vowel-Consonant: cat, dog, sun, hop, bed. Three letters, three sounds, one word. By the end of today\'s lesson, you can sound out any CVC word.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-cvc',
      kind: 'concept',
      goal: 'CVC pattern + short-vowel sounds + decoding strategy.',
      keyIdeas: [
        'CVC = three letters: consonant + vowel + consonant. Examples: cat, hop, fed, sit, rug.',
        'SHORT VOWEL SOUNDS: a as in "apple" (/ă/). e as in "egg" (/ĕ/). i as in "igloo" (/ĭ/). o as in "octopus" (/ŏ/). u as in "umbrella" (/ŭ/).',
        'In a CVC word, the vowel almost always says its SHORT sound.',
        'DECODING (sounding out): say each sound from left to right, then BLEND them together.',
        'STRATEGY: Sound 1, sound 2, sound 3 → blend → word.',
        'TRY EACH PATTERN: -at family (cat, hat, sat, bat, fat, mat, rat). -og family (dog, log, hog, jog). -un family (sun, run, bun, fun).',
        'WHEN STUCK: stretch the sounds slowly, then say faster.',
      ],
      vocabulary: [
        { term: 'CVC word', definition: 'a word with three letters: consonant + vowel + consonant. Like cat or hop.' },
        { term: 'decode', definition: 'sound out a word by saying each sound and blending them.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-decode',
      kind: 'worked_example',
      problem: 'Decode the word "fish". Wait — that\'s not CVC! Let\'s try "fin" instead.',
      steps: [
        'Look at the word: f-i-n. It has 3 letters: consonant-vowel-consonant. Yes, it\'s CVC.',
        'Sound 1: /f/ (the f sound).',
        'Sound 2: /i/ (the short i sound, like "igloo").',
        'Sound 3: /n/ (the n sound).',
        'Blend: /f/ + /i/ + /n/ = "fin".',
        'Read it together: "fin"!',
      ],
      answer: 'fin',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Decode the word "hop".',
      expectedAnswer: 'hop',
      responseFormat: 'free',
      hints: [
        '/h/ + /o/ + /p/.',
        'Slide them together.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-vowel-name',
      kind: 'misconception_check',
      question: 'A child reads "cat" as "cay-at" because they think the "a" says its name. What\'s wrong?',
      commonErrors: [
        {
          answer: '"cay-at" instead of "cat"',
          misconception: 'Saying the vowel\'s NAME (long sound) instead of its SHORT sound in a CVC word.',
          correctsTo: 'In CVC words, the vowel says its SHORT sound. /ă/ as in "apple". So "cat" = /c/ /ă/ /t/ = "cat", not "cay-at". Long vowel sounds (where the vowel says its name) come later, in patterns like "cake" (with a silent e).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'CVC = consonant + vowel + consonant.',
        'In CVC, vowel makes a SHORT sound (apple, egg, igloo, octopus, umbrella).',
        'Decode = sound out + blend.',
        'Sound 1, sound 2, sound 3 → word.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'What if the word has 4 letters but still has the CVC pattern, like "stop"?',
      hint: '"Stop" has 4 letters but a special pattern called CCVC — TWO consonants at the start (s-t), then vowel, then consonant. Sound out: /s/ /t/ /o/ /p/. Blend: stop. Same idea, just with a consonant cluster at the start. Other examples: "frog", "spin", "snap".',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
