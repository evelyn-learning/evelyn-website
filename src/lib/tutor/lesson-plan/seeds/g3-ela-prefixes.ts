/**
 * G3 — Prefixes that mean "not".
 *
 * un-, dis-, non-, in-, im-. Building decoding skill from earlier
 * vocab work.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_ELA_PREFIXES: LessonPlan = {
  id: 'evelyn.g3.ela.vocab.negative-prefixes.v1',
  title: 'Prefixes that mean "not": un, dis, in, im, non',
  curriculum: 'CCSS',
  grade: '3',
  subject: 'ela',
  topic: 'vocabulary',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.3.l.4.b',
      description: 'Determine the meaning of the new word formed when a known affix is added to a known word.',
      standard: 'CCSS.ELA-LITERACY.L.3.4.B',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.ela.4.l.4.b'],
  estimatedMinutes: 11,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show how one tiny prefix flips meaning.',
      script: 'KIND. Now add UN: UNKIND. Same word, opposite feeling. Lots of prefixes do this — they let you say "not X" without inventing a new word.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five-prefixes',
      kind: 'concept',
      goal: 'Five "not" prefixes and how to choose which fits.',
      keyIdeas: [
        'UN-: most common. Means "not" or "opposite of". UNHAPPY, UNCOMFORTABLE, UNFAIR.',
        'DIS-: means "not" or "the opposite". DISAGREE (don\'t agree), DISHONEST (not honest), DISLIKE.',
        'NON-: means "not". NONFICTION (not fiction), NONSTOP (not stopping).',
        'IN-: means "not", attached to many words from Latin. INCORRECT (not correct), INVISIBLE.',
        'IM-: a form of IN-, used before words starting with M, B, P. IMPOSSIBLE (not possible), IMMATURE.',
        'WHICH TO USE? You can\'t make up your own — each word pairs with a specific prefix. UNHAPPY ✓ but DISHAPPY ✗. INHAPPY ✗. You learn them word-by-word.',
      ],
      vocabulary: [
        { term: 'prefix', definition: 'a word part added to the front to change meaning.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-decode',
      kind: 'worked_example',
      problem: 'What does INVISIBLE mean?',
      steps: [
        'Find the prefix: IN-.',
        'IN- means "not".',
        'Find the root: VISIBLE = able to be seen.',
        'Combine: NOT able to be seen.',
        'INVISIBLE = can\'t be seen.',
      ],
      answer: 'not able to be seen',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What does NONSENSE mean?',
      expectedAnswer: 'not making sense / silly talk',
      responseFormat: 'free',
      hints: [
        'NON- means "not".',
        'SENSE means logic or meaning.',
        'Put together?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mix-prefixes',
      kind: 'misconception_check',
      question: 'Can I write "INHAPPY" instead of "UNHAPPY"?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating "not" prefixes as interchangeable.',
          correctsTo: 'No — each word pairs with a SPECIFIC prefix. UNHAPPY is correct; INHAPPY isn\'t a word. You can\'t swap. Generally: un- with everyday words, in-/im- with Latin-origin words. Memorize as you encounter them.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'UN-, DIS-, NON-, IN-, IM- all mean "not" or "opposite".',
        'Each word pairs with one specific prefix — can\'t swap.',
        'IM- usually before m, b, p (impossible, imbalanced).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'INFLAMMABLE looks like it should mean "not flammable" — but it actually means the SAME as flammable. Why?',
      hint: 'IN- has TWO meanings: "not" (incorrect) AND "in/into" (inflame = to set fire to). Inflammable comes from "to set on fire" — easy to set ablaze. Tricky! Today we usually say FLAMMABLE to avoid confusion.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
