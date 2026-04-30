/**
 * G2 — ELA: Phonics and decoding (vowel teams, blends, syllables).
 *
 * The toolkit for sounding out unfamiliar words. Vowel teams (ai,
 * ee, oa, ou), consonant blends (bl, str), digraphs (sh, ch, th).
 * Syllable types and how to break a long word into pieces. Sets
 * up fluent reading.
 */

import type { LessonPlan } from '../types';

export const SEED_G2_ELA_PHONICS_DECODING: LessonPlan = {
  id: 'evelyn.g2.ela.phonics-decoding.v1',
  title: 'Phonics and Decoding',
  curriculum: 'CCSS',
  grade: '2',
  subject: 'ela',
  topic: 'reading-foundations',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.rf.2.3',
      description: 'Know and apply grade-level phonics and word analysis skills in decoding words.',
      standard: 'CCSS.ELA-LITERACY.RF.2.3',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.ela.rf.3.3'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make decoding feel like a code-cracking game.',
      script: 'You see a word you\'ve never read before. Maybe BOAT or RAIN or STREET. How do you figure out how to say it? You crack the code — you look at letter patterns, sound them out piece by piece. That code is called PHONICS, and once you know the patterns, you can read almost any word.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-phonics',
      kind: 'concept',
      goal: 'Vowel teams, blends, digraphs, syllable splitting.',
      keyIdeas: [
        'Letters can work ALONE or IN TEAMS.',
        'VOWEL TEAMS: two vowels working together to make one sound.',
        '  ai/ay → "long a" sound. (rain, day)',
        '  ee/ea → "long e" sound. (tree, beat)',
        '  oa/ow → "long o" sound. (boat, snow)',
        '  ou/ow → "ow" sound. (loud, cow)',
        '  Common rule: "When two vowels go walking, the first does the talking" — works for many but not all teams.',
        'CONSONANT BLENDS: two or three consonants where you HEAR each one.',
        '  bl, br, cl, cr, dr, fl, fr, gl, gr, pl, pr, sk, sl, sn, sp, st, sw, tr, tw.',
        '  Three-letter blends: scr, spl, spr, str, thr.',
        'CONSONANT DIGRAPHS: two consonants making ONE new sound.',
        '  sh (ship), ch (chip), th (thin or this), ph (phone), wh (when).',
        'SYLLABLES: chunks of a word, usually with one vowel sound each.',
        '  cat = 1 syllable (cat). rabbit = 2 syllables (rab-bit). banana = 3 (ba-na-na).',
        '  Long words become easier when you BREAK THEM into syllables.',
        'STRATEGY for an unknown word:',
        '  1) Look for vowel teams or special patterns.',
        '  2) Identify any blends or digraphs.',
        '  3) Break into syllables.',
        '  4) Sound out each piece, then push them together.',
      ],
      vocabulary: [
        { term: 'phonics', definition: 'using letter patterns to sound out words.' },
        { term: 'vowel team', definition: 'two vowels making one sound (like "ai" in "rain").' },
        { term: 'blend', definition: 'two or three consonants where each is heard (like "bl" in "blue").' },
        { term: 'digraph', definition: 'two letters making one sound (like "sh" in "ship").' },
        { term: 'syllable', definition: 'a chunk of a word with one vowel sound.' },
      ],
      suggestedTools: ['show_text', 'show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-decode',
      kind: 'worked_example',
      problem: 'Decode the word RAINBOW.',
      steps: [
        'Identify patterns: "ai" is a vowel team (long-a sound). "ow" can make either "oh" or "ow" — try both.',
        'Break into syllables: RAIN-BOW.',
        'Sound out: "rain" (long-a) and "bow" (long-o, like a tied ribbon).',
        'Combine: RAIN-BOW = "rainbow."',
      ],
      answer: 'rain-bow',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How would you decode the word BUTTERFLY?',
      expectedAnswer: 'BUT-TER-FLY (3 syllables)',
      responseFormat: 'free',
      hints: [
        'Break into chunks. How many vowel sounds?',
        'BUT, TER, FLY — three syllables.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-letter-by-letter',
      kind: 'misconception_check',
      question: 'Asha tries to read STREET by sounding out S-T-R-E-E-T one letter at a time. Is that the best way?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating each letter individually instead of recognizing patterns.',
          correctsTo: 'Letter-by-letter is slow and often gives the wrong sound. Better: recognize STR (a 3-letter blend) and EE (a vowel team for long e). Then it\'s STR + EE + T = "street" — one chunk at a time.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Vowel teams: two vowels, one sound (rain, tree, boat).',
        'Blends: two or three consonants, each heard (blue, street).',
        'Digraphs: two letters, one new sound (ship, chair, thin).',
        'Syllables: count vowel sounds; break words into chunks.',
        'Decode strategy: spot patterns, break syllables, sound each piece.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How many syllables in COMPUTER and ELEPHANT?',
      hint: 'Count vowel sounds. COM-PU-TER (3). EL-E-PHANT (3).',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
