/**
 * G7 — Context clues and vocabulary in nonfiction.
 *
 * Five strategies for figuring out unknown words: definition,
 * example, contrast, inference, synonym/restatement.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_ELA_CONTEXT_VOCAB: LessonPlan = {
  id: 'evelyn.g7.ela.vocab.context-clues.v1',
  title: 'Context clues for unknown words',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'ela',
  topic: 'vocabulary',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.7.l.4.a',
      description: 'Use context as a clue to the meaning of a word or phrase.',
      standard: 'CCSS.ELA-LITERACY.L.7.4.A',
    },
  ],
  prerequisites: ['ccss.ela.5.l.4.a'],
  followUps: ['ccss.ela.9-10.l.4'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show context can decode an invented word.',
      script: 'Read this: "He was so famished after the marathon, he ate three burgers in five minutes." Even if you don\'t know "famished", you can guess. The CONTEXT does the work.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five-types',
      kind: 'concept',
      goal: 'Five context-clue strategies, with markers for each.',
      keyIdeas: [
        '1) DEFINITION: the word is defined right after, often with "is" or "means". "Photosynthesis is the process by which plants make food from sunlight."',
        '2) EXAMPLE: examples follow the word, often with "such as", "for example", "including". "Carnivores, such as lions and wolves, eat meat."',
        '3) CONTRAST: opposite-meaning word nearby, often with "but", "however", "unlike". "She was usually loquacious, but today she was silent." → loquacious means TALKATIVE.',
        '4) SYNONYM/RESTATEMENT: same idea phrased differently, often with "in other words", "or", commas. "He was reticent — quiet and reserved."',
        '5) INFERENCE: no direct marker — figure out from the surrounding situation. "The road was so meandering it took an hour to drive 5 miles." → meandering = winding.',
      ],
      vocabulary: [
        { term: 'context clue', definition: 'information in surrounding text that helps you figure out an unknown word.' },
        { term: 'inference', definition: 'a reasonable conclusion based on evidence and reasoning.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-loquacious',
      kind: 'worked_example',
      problem: 'Use context to define "loquacious": "She was usually loquacious, but today she sat in silence."',
      steps: [
        'Look for a marker. "But" signals CONTRAST.',
        'The contrasted word/idea: "silence" (today she sat in silence).',
        'Loquacious must be the opposite of silent → TALKATIVE.',
        'Confirm: "She was usually talkative, but today she sat in silence." Makes sense!',
      ],
      answer: 'talkative (opposite of silent)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Define "frugal" using context: "He was frugal — never wasting money on things he didn\'t need."',
      expectedAnswer: 'careful with money / not wasteful',
      responseFormat: 'free',
      hints: [
        'Look for the dash — that signals a definition or restatement.',
        'What does "never wasting money" tell you?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-skip-unknown',
      kind: 'misconception_check',
      question: 'When you hit an unknown word, should you just skip it?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Skipping unknown words.',
          correctsTo: 'Sometimes a single unknown word doesn\'t matter. But often it carries a key idea — skipping leaves you confused later. Try context first; look up if context fails. Building this habit grows your vocabulary fast.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five strategies: definition, example, contrast, synonym/restatement, inference.',
        'Look for MARKERS: "is", "such as", "but", "or", commas, dashes.',
        'Test your guess by plugging it back in — does the sentence make sense?',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'When does context FAIL — when must you actually look the word up?',
      hint: 'Technical jargon, words used metaphorically without other clues, or when context is too thin (just one short sentence). Also: when nuance matters — close synonyms can mean very different things.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
