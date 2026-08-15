/**
 * Grades 3-5 ELA — Prefixes & Suffixes.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_PREFIXES_SUFFIXES: LessonPlan = {
  id: 'evelyn.g35.ela.prefixes-suffixes.v1',
  title: 'Grades 3-5 ELA — Prefixes & Suffixes',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.prefixes-suffixes',
      description: 'Identify common prefixes and suffixes; use them to determine meaning and part-of-speech of unfamiliar words.',
      standard: 'CCSS.ELA-LITERACY.L.4.4.B',
    },
  ],
  prerequisites: ['g35.ela.multisyllabic'],
  followUps: ['g35.ela.context-clues'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Knowing 20 common prefixes/suffixes lets you crack the meaning of thousands of unfamiliar words.',
      script: 'You meet the word "unbreakable" for the first time. You know "break". The "un-" means not. The "-able" means capable of being. Putting it together: not capable of being broken. You\'ve just defined a word you\'ve never seen — by recognising its parts.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-affixes',
      kind: 'concept',
      goal: 'Common prefixes and suffixes with their meanings and effects.',
      keyIdeas: [
        'PREFIX: attached to the BEGINNING of a root word. Changes meaning, usually not part of speech.',
        'COMMON PREFIXES: un- (not: unhappy), re- (again: redo), dis- (not/opposite: disagree), pre- (before: preview), mis- (wrongly: misspell), in-/im-/il-/ir- (not: invisible, impossible), sub- (under: submarine), super- (above: superstar).',
        'SUFFIX: attached to the END of a root word. Often changes part of speech.',
        'COMMON SUFFIXES: -er/-or (one who: teacher), -less (without: hopeless), -ful (full of: helpful), -able/-ible (capable of: readable), -ly (in a manner: quickly — adverb), -ness (state of: kindness — noun), -tion/-sion (action: action — noun), -ment (state of: payment).',
        'STRATEGY: split unknown word into prefix + root + suffix. Define each piece. Combine.',
        'SPELLING CHANGES: drop final "e" before vowel suffix (write + ing = writing). Double consonant after short vowel (run + ing = running). Change "y" to "i" before most suffixes (happy + ness = happiness).',
        'WATCH OUT: not every "in-" is a prefix. "Income" has "in-" as a prefix, but "into" doesn\'t — there\'s no separate "to" root.',
      ],
      vocabulary: [
        { term: 'prefix', definition: 'a word part added to the start of a root that changes meaning.' },
        { term: 'suffix', definition: 'a word part added to the end of a root that often changes the part of speech.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-decode-meaning',
      kind: 'worked_example',
      problem: 'Use prefixes and suffixes to figure out what "unbelievable" means.',
      steps: [
        'Identify the prefix: un- (means "not").',
        'Identify the suffix: -able (means "capable of being").',
        'Identify the root: believe (means "to accept as true").',
        'Combine: not + capable of being + believed = NOT capable of being believed.',
        'Definition: so surprising or extreme that it can\'t be believed.',
      ],
      answer: 'Not capable of being believed; too extreme to be believed.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What does "preheat" mean? Identify the prefix and root.',
      expectedAnswer: 'Pre- means "before"; heat means "make warm." Preheat = heat before (e.g. an oven).',
      responseFormat: 'free',
      hints: [
        'Look at the start: pre-.',
        'pre- means "before".',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-not-prefix',
      kind: 'misconception_check',
      question: 'Is "uncle" an "un-" prefix word?',
      commonErrors: [
        {
          answer: 'Yes, uncle = un + cle',
          misconception: 'Treating any word starting with "un" as having the un- prefix.',
          correctsTo: '"Uncle" has no separate root. "Cle" is not a word. The "un" here is just part of the spelling, not a prefix. Test by checking if the rest is a real word: in "unhappy", "happy" is a word → un- IS a prefix. In "uncle", "cle" is nothing → un- is NOT a prefix here. Same trap with "uniform" (no "iform" root) and "until" (no "til" prefix-able root).',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Prefix at start, suffix at end. Root in middle.',
        'Common prefixes: un-, re-, dis-, pre-, mis-, in-, sub-, super-.',
        'Common suffixes: -er, -less, -ful, -able, -ly, -ness, -tion, -ment.',
        'Spelling rules: drop e, double consonant, change y to i.',
        'Test prefix: rest of the word should be a real word.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'What does "irreplaceable" mean? Break it into all its parts.',
      hint: 'ir- (not) + re- (again) + place (root) + -able (capable of being). Not capable of being placed again = unable to be replaced. Often refers to something so unique it cannot be substituted.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
