/**
 * G4 — Prefixes and suffixes.
 *
 * Common prefixes (un-, re-, dis-, pre-) and suffixes (-ed, -ing,
 * -ful, -less, -ly). How they change word meaning.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_ELA_PREFIXES_SUFFIXES: LessonPlan = {
  id: 'evelyn.g4.ela.vocab.prefixes-suffixes.v1',
  title: 'Prefixes and suffixes: word parts that change meaning',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'ela',
  topic: 'vocabulary',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.4.l.4.b',
      description: 'Use common, grade-appropriate Greek and Latin affixes and roots as clues to the meaning of a word.',
      standard: 'CCSS.ELA-LITERACY.L.4.4.B',
    },
  ],
  prerequisites: ['ccss.ela.3.l.4.b'],
  followUps: ['ccss.ela.5.l.4.b'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show how a single prefix can flip a word\'s meaning.',
      script: 'HAPPY. Now add UN at the front: UNHAPPY. Same root, opposite meaning. That\'s the power of prefixes — and once you know them, you can decode hundreds of new words.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-prefix-suffix',
      kind: 'concept',
      goal: 'Common prefixes and suffixes + how they change meaning or part of speech.',
      keyIdeas: [
        'PREFIX: a word part added to the FRONT. Changes the meaning.',
        'COMMON PREFIXES: un- (not: unhappy), re- (again: redo), dis- (not: dislike), pre- (before: prepay), mis- (wrong: misuse), non- (not: nonfiction).',
        'SUFFIX: a word part added to the END. Often changes the part of speech (noun/verb/adjective).',
        'COMMON SUFFIXES: -ed (past tense: walked), -ing (ongoing: walking), -er (one who: teacher; or comparison: bigger), -est (most: biggest), -ful (full of: helpful), -less (without: hopeless), -ly (in a way: quickly).',
        'STRATEGY: when you see an unknown word, look for the ROOT. Then check the prefix/suffix.',
      ],
      vocabulary: [
        { term: 'prefix', definition: 'a word part added to the front to change meaning.' },
        { term: 'suffix', definition: 'a word part added to the end to change meaning or part of speech.' },
        { term: 'root', definition: 'the main part of a word that carries the core meaning.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-rebuild',
      kind: 'worked_example',
      problem: 'Define "REBUILD" using its parts.',
      steps: [
        'Identify the prefix: RE- = "again".',
        'Identify the root: BUILD = "to make".',
        'Combine: "to make AGAIN".',
        'So REBUILD = to build something again. Confirmed by usage: "We rebuilt the house after the fire."',
      ],
      answer: 'to build again',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Use prefix knowledge to define HOPELESS.',
      expectedAnswer: 'without hope',
      responseFormat: 'free',
      hints: [
        'Find the root: HOPE.',
        'Find the suffix: -LESS = "without".',
        'Combine.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-prefix-anywhere',
      kind: 'misconception_check',
      question: 'Is the "un" in "uncle" a prefix meaning "not"?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating any matching letters as a prefix.',
          correctsTo: 'No — UN must be ATTACHED to a real root for it to be a prefix. UNCLE doesn\'t come from "cle"; it\'s a single root word. UN- is only a prefix when paired with a real word: unhappy (un + happy), undo (un + do).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'PREFIX = front. SUFFIX = end. ROOT = core.',
        'Common prefixes: un-, re-, dis-, pre-, mis-, non-.',
        'Common suffixes: -ed, -ing, -er, -est, -ful, -less, -ly.',
        'Decode unknown words by spotting the root and the affixes.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How many words can you make from the root WORK by adding prefixes or suffixes?',
      hint: 'WORKER, WORKING, WORKED, REWORK, OVERWORK, NETWORK, WORKABLE… A single root can spawn many words.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
