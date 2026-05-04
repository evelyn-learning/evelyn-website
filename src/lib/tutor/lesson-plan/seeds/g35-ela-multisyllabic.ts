/**
 * Grades 3-5 ELA — Multisyllabic Word Decoding.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_MULTISYLLABIC: LessonPlan = {
  id: 'evelyn.g35.ela.multisyllabic.v1',
  title: 'Grades 3-5 ELA — Multisyllabic Decoding',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.multisyllabic',
      description: 'Decode multisyllabic words by recognising syllable types and breaking words at predictable boundaries.',
      standard: 'CCSS.ELA-LITERACY.RF.3.3',
    },
  ],
  prerequisites: [],
  followUps: ['g35.ela.prefixes-suffixes'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Long words look scary — but every long word is just shorter syllables stuck together.',
      script: 'Look at "fantastic". Six letters might give you trouble; nine doesn\'t have to. Break it: fan-tas-tic. Three short pieces. Today we learn the patterns that tell you where to break — and longer words become friendlier.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-syllables',
      kind: 'concept',
      goal: 'Six syllable types + how to spot syllable boundaries.',
      keyIdeas: [
        'EVERY syllable has ONE vowel SOUND. Count the vowel sounds to count the syllables. (Silent letters and vowel teams count as one sound.)',
        'CLOSED syllable: ends in a consonant; vowel is short. cat, hop, sun.',
        'OPEN syllable: ends in a vowel; vowel is long. me, hi, go.',
        'SILENT-E (magic-e): vowel-consonant-e pattern; final e silent, makes the vowel long. cake, bike, hope.',
        'VOWEL TEAM: two vowels making one sound. boat, rain, sleep.',
        'R-CONTROLLED: ar, er, ir, or, ur. Vowel sound changed by r. car, her, bird.',
        'CONSONANT-LE: at end of word; usually preceded by a consonant. ta-ble, lit-tle, can-dle.',
        'SYLLABLE BREAKING: between two consonants between vowels (VCCV → VC|CV). "rab-bit", "win-dow". When VCV, usually break before the consonant if first vowel is long (o-pen) or after if short (rob-in).',
      ],
      vocabulary: [
        { term: 'syllable', definition: 'a unit of pronunciation built around one vowel sound.' },
        { term: 'closed syllable', definition: 'a syllable that ends in a consonant; the vowel sound is short.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-decode',
      kind: 'worked_example',
      problem: 'Decode the word "fantastic" by breaking it into syllables.',
      steps: [
        'Find the vowels: a, a, i. Three vowel sounds → three syllables.',
        'First boundary: between two consonants n-t. fan-tastic.',
        'Second boundary: between s-t. fan-tas-tic.',
        'Type each: fan = closed (short a). tas = closed (short a). tic = closed (short i).',
        'Pronounce each piece, then blend: fan-tas-tic.',
      ],
      answer: 'fan-tas-tic',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Break "important" into syllables.',
      expectedAnswer: 'im-por-tant',
      responseFormat: 'free',
      hints: [
        'Three vowel sounds: i, o, a.',
        'First break: im-por (between m and p).',
        'Second break: por-tant (between r-t).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-vowels',
      kind: 'misconception_check',
      question: 'A reader counts syllables in "boat" as two because it has two vowels (o, a). Why is this wrong?',
      commonErrors: [
        {
          answer: '"Boat" has 2 syllables',
          misconception: 'Counting written vowel LETTERS instead of vowel SOUNDS.',
          correctsTo: '"Boat" has only ONE vowel sound — the long o. The "oa" is a vowel TEAM that makes a single sound. Always count sounds, not letters. "Rain" = 1 syllable (long a sound from "ai"). "Fountain" = 2 syllables (foun-tain).',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Count vowel SOUNDS, not letters, to count syllables.',
        'Six syllable types: closed, open, silent-e, vowel team, r-controlled, consonant-le.',
        'VCCV → break between consonants. VCV → depends on which sound the vowel makes.',
        'Pronounce each piece, then blend — never grunt the whole word at once.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Decode "metropolitan" by syllables and identify each type.',
      hint: 'me-trop-o-li-tan. Five syllables. me = open (long e). trop = closed (short o). o = open (long o). li = open (long i). tan = closed (short a).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
