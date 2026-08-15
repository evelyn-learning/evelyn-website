/**
 * Grades 6-8 ELA — Advanced Punctuation (Semicolons, Colons, Dashes).
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_ADVANCED_PUNCTUATION: LessonPlan = {
  id: 'evelyn.g68.ela.advanced-punctuation.v1',
  title: 'Grades 6-8 ELA — Advanced Punctuation',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.advanced-punctuation',
      description: 'Use semicolons, colons, and dashes correctly in sentences for emphasis, list introduction, and joining clauses.',
      standard: 'CCSS.ELA-LITERACY.L.7.2.A',
    },
  ],
  prerequisites: ['g68.ela.phrases-clauses'],
  followUps: ['g68.ela.comparing-texts'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Beyond commas and periods, three powerful marks let you control rhythm and emphasis: semicolon, colon, dash.',
      script: 'A semicolon joins two related sentences. A colon introduces. A dash interrupts for emphasis. Used right, they make writing feel professional. Used wrong, they look like trying-too-hard. Today we drill the rules.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-advanced-punct',
      kind: 'concept',
      goal: 'Semicolon, colon, dash — uses and rules.',
      keyIdeas: [
        'SEMICOLON (;): joins two CLOSELY-RELATED INDEPENDENT CLAUSES without a conjunction. "She practised every day; her hard work paid off." Both halves must be complete sentences.',
        'SEMICOLON in LISTS: when items themselves contain commas. "I visited Paris, France; Berlin, Germany; and Tokyo, Japan."',
        'COLON (:): introduces something — a list, a quote, a definition, or an explanation. The part BEFORE the colon must be a complete sentence.',
        'COLON for LIST: "I bought three things: bread, milk, and eggs." Complete sentence + colon + list.',
        'COLON for EXPLANATION: "There was only one option: leave."',
        'DASH (—): interrupts a sentence for EMPHASIS. Like a louder comma. "I knew the answer — though I dared not say it."',
        'DASH IN PAIRS: like commas, can set off non-essential information with more emphasis. "The report — finished hours late — was accepted anyway."',
        'AVOID: using a semicolon when a comma or period would do. Don\'t use semicolons before "and", "but", "or".',
        'AVOID: using a colon mid-sentence after a verb. WRONG: "My favourite colours are: red, blue, and green." (the verb "are" already invites the list — colon redundant.) RIGHT: "My favourites are red, blue, and green."',
        'EM DASH vs HYPHEN: em dash (—) is the long dash for interruption. Hyphen (-) is the short one for compound words ("well-known"). Don\'t confuse.',
      ],
      vocabulary: [
        { term: 'semicolon', definition: 'punctuation (;) that joins two closely related independent clauses or separates items containing commas.' },
        { term: 'colon', definition: 'punctuation (:) used to introduce a list, quote, definition, or explanation.' },
        { term: 'em dash', definition: 'long dash (—) used for emphatic interruption.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-punct',
      kind: 'worked_example',
      problem: 'Punctuate: "I forgot my umbrella it began to rain immediately."',
      steps: [
        'Identify the issue: comma splice. Two complete sentences linked by nothing.',
        'Three ways to fix:',
        'Option 1 — Period: "I forgot my umbrella. It began to rain immediately."',
        'Option 2 — Semicolon (since the two are tightly related): "I forgot my umbrella; it began to rain immediately."',
        'Option 3 — Comma + conjunction: "I forgot my umbrella, and it began to rain immediately."',
        'Best in this case: semicolon emphasises the cause-effect relationship.',
      ],
      answer: 'Semicolon: "I forgot my umbrella; it began to rain immediately."',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Add appropriate punctuation: "She had three goals win the race finish her thesis and learn Spanish."',
      expectedAnswer: '"She had three goals: win the race, finish her thesis, and learn Spanish."',
      responseFormat: 'free',
      hints: [
        'A list is being introduced: use a colon.',
        'Items separated by commas.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-colon-after-verb',
      kind: 'misconception_check',
      question: 'A student writes: "The students who passed are: Maya, Tom, and Sara." Why is the colon wrong here?',
      commonErrors: [
        {
          answer: 'Colon after "are"',
          misconception: 'Inserting a colon before any list, regardless of whether a complete sentence comes first.',
          correctsTo: 'A colon must follow a COMPLETE SENTENCE. "The students who passed are" is incomplete — it ends in a verb expecting a list. The colon interrupts the natural flow. Two fixes: (a) Remove the colon: "The students who passed are Maya, Tom, and Sara." (b) Restructure to complete sentence + colon + list: "Three students passed: Maya, Tom, and Sara."',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Semicolon: joins two related independent clauses without a conjunction.',
        'Colon: introduces a list, quote, or explanation. Must follow a complete sentence.',
        'Em dash: emphatic interruption.',
        'Em dash ≠ hyphen.',
        'Don\'t put a colon directly after a verb; the sentence before the colon must stand alone.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'When would you choose a dash over a comma to set off non-essential information?',
      hint: 'Use commas for soft, smoothly-integrated insertions: "My friend, the doctor, helped me." Use dashes for ABRUPT, EMPHATIC insertions: "My friend — the same doctor who saved my life — helped me." Dashes draw more attention. Apply them when the inserted info deserves spotlight; commas when it\'s a side note.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
