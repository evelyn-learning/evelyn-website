/**
 * G3 — Dialogue and quotation punctuation.
 *
 * Quotation marks around speech, comma before/after, capitalization
 * inside quotes, new line for new speaker.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_ELA_DIALOGUE_PUNCTUATION: LessonPlan = {
  id: 'evelyn.g3.ela.grammar.dialogue.v1',
  title: 'Writing dialogue: quotation marks and punctuation',
  curriculum: 'CCSS',
  grade: '3',
  subject: 'ela',
  topic: 'grammar',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.3.l.2.c',
      description: 'Use commas and quotation marks in dialogue.',
      standard: 'CCSS.ELA-LITERACY.L.3.2.C',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.ela.4.l.2.b'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show how quotes make stories come alive.',
      script: 'Listen: "The dragon was angry." Now: "I will eat your village!" roared the dragon. The second one is more EXCITING because we hear the dragon SPEAK. Quotation marks let readers hear the characters.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rules',
      kind: 'concept',
      goal: 'Five rules for dialogue punctuation.',
      keyIdeas: [
        '1) PUT QUOTATION MARKS around the EXACT words spoken. "I love pizza," she said.',
        '2) CAPITALIZE the first word inside the quotes (it\'s the start of a sentence within).',
        '3) COMMA before the closing quote when a tag (he said, she asked) comes after. "I love pizza," she said.',
        '4) PUNCTUATION GOES INSIDE the quotation marks. "I love pizza." NOT "I love pizza".',
        '5) NEW SPEAKER = NEW LINE. Each time a different character speaks, start a new paragraph.',
      ],
      vocabulary: [
        { term: 'quotation marks', definition: 'the symbols " " around someone\'s exact spoken words.' },
        { term: 'dialogue tag', definition: 'words like "he said" that identify who\'s speaking.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-fix',
      kind: 'worked_example',
      problem: 'Fix the dialogue: I am hungry, said Maya.',
      steps: [
        'Add quotation marks around the SPEECH: "I am hungry, said Maya. — wait, the tag isn\'t spoken!',
        'Quote ONLY the spoken words: "I am hungry," said Maya.',
        'Check: capital "I" inside quotes ✓, comma before closing quote ✓, period at end after Maya ✓.',
        'Final: "I am hungry," said Maya.',
      ],
      answer: '"I am hungry," said Maya.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Punctuate this dialogue correctly: lets go to the park said Sam',
      expectedAnswer: '"Let\'s go to the park," said Sam.',
      responseFormat: 'free',
      hints: [
        'Quotation marks around the speech.',
        'Capitalize the first word.',
        'Comma before the closing quote, then "said Sam".',
        'Period at the end.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-punct-outside',
      kind: 'misconception_check',
      question: 'In American English, does the comma go OUTSIDE the closing quotation mark, like this: "Hello", he said.',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Putting punctuation outside the quotes (British style).',
          correctsTo: 'In American English, periods and commas go INSIDE: "Hello," he said. (British English sometimes puts them outside.) Use whichever your school requires — but be consistent.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Quotation marks around exact spoken words.',
        'Capitalize the first word of the quote.',
        'Comma BEFORE closing quote when a tag follows.',
        'Punctuation INSIDE quotes (American style).',
        'New speaker → new line.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How do you handle a question or exclamation in dialogue? "Where are you going?" he asked. Why no comma there?',
      hint: 'When the quote itself ends with ? or !, those replace the comma. The tag after still uses lowercase: "Where?" he asked. (Not "Where?" He asked.)',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
