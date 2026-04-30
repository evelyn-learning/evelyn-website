/**
 * G1 — Capitalization basics.
 *
 * When to use capital letters: start of sentences, names, the word
 * "I", days, months. Foundational grammar that bridges into G2
 * punctuation and G3 parts of speech.
 */

import type { LessonPlan } from '../types';

export const SEED_G1_ELA_CAPITALIZATION: LessonPlan = {
  id: 'evelyn.g1.ela.grammar.capitalization.v1',
  title: 'When to use capital letters',
  curriculum: 'CCSS',
  grade: '1',
  subject: 'ela',
  topic: 'grammar',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.1.l.2.a',
      description: 'Capitalize dates and names of people.',
      standard: 'CCSS.ELA-LITERACY.L.1.2.A',
    },
    {
      id: 'ccss.ela.k.l.2.a',
      description: 'Capitalize the first word in a sentence and the pronoun I.',
      standard: 'CCSS.ELA-LITERACY.L.K.2.A',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.ela.2.l.2.a'],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that capital letters tell readers something IMPORTANT is starting.',
      script: 'Look: "i went to the store." Something feels off. Now: "I went to the store." Better, right? Capital letters do real work.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-when-to-cap',
      kind: 'concept',
      goal: 'Four big rules: sentence starts, names, the word I, and days/months.',
      keyIdeas: [
        'RULE 1: Always capitalize the FIRST letter of a sentence.',
        'RULE 2: Capitalize people\'s NAMES — Sam, Maria, Mr. Lee.',
        'RULE 3: The word I is ALWAYS capital, even in the middle of a sentence: "Sam and I played."',
        'RULE 4: Capitalize days (Monday, Tuesday) and months (March, June).',
      ],
      vocabulary: [
        { term: 'capital letter', definition: 'a big version of a letter — A, B, C — used at special places.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fix-sentence',
      kind: 'worked_example',
      problem: 'Fix the capitals: "my friend sam and i went on monday."',
      steps: [
        'Find the start: "my" → must start with a capital. → "My".',
        'Find names: "sam" is a name → "Sam".',
        'Find the word I: "i" → must always be capital → "I".',
        'Find days: "monday" → "Monday".',
        'Final: "My friend Sam and I went on Monday."',
      ],
      answer: 'My friend Sam and I went on Monday.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Which letters need capitals? "tomorrow is wednesday and maria has a party."',
      expectedAnswer: 'Tomorrow, Wednesday, Maria',
      responseFormat: 'free',
      hints: [
        'Check the start of the sentence first.',
        'Then look for names.',
        'Then look for days of the week.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cap-everything',
      kind: 'misconception_check',
      question: 'Should every important word get a capital — like "My Dog Is Big"?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Capitalizing every word that "feels" important.',
          correctsTo: 'No — only sentence starts, names, "I", and days/months. "Dog" and "big" are common nouns/adjectives — lowercase. So: "My dog is big."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'CAPITAL at: start of sentence, names, the word I, days, months.',
        '"i" is ALWAYS capital — even in the middle of a sentence.',
        'Common words like dog, table, run stay lowercase unless one of the rules applies.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'What about the name of a city — should "boston" have a capital?',
      hint: 'Cities and countries are special names too — they follow the names rule.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
