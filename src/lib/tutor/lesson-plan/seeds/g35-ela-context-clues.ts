/**
 * Grades 3-5 ELA — Context Clues for Vocabulary.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_CONTEXT_CLUES: LessonPlan = {
  id: 'evelyn.g35.ela.context-clues.v1',
  title: 'Grades 3-5 ELA — Context Clues',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.context-clues',
      description: 'Use surrounding sentence and paragraph context to infer the meaning of unfamiliar words.',
      standard: 'CCSS.ELA-LITERACY.L.4.4.A',
    },
  ],
  prerequisites: ['g35.ela.prefixes-suffixes'],
  followUps: ['g35.ela.theme'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Authors usually plant clues to unfamiliar words right next to them — readers who recognise the clue patterns rarely need a dictionary.',
      script: 'When you read "The desert was arid — dry and almost waterless," you don\'t need to know "arid" beforehand. The author DEFINED it for you with the dash. That\'s a context clue. There are five common types, and after this lesson you\'ll spot them in the wild.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-clue-types',
      kind: 'concept',
      goal: 'Five context-clue patterns + reading strategies.',
      keyIdeas: [
        'DEFINITION/RESTATEMENT: author gives the meaning right after, often with commas, dashes, or "or". "She was tenacious — never giving up."',
        'EXAMPLE: author lists examples that hint at meaning. "Mammals like cats, dogs, and humans nurse their young."',
        'CONTRAST: author uses opposite. Signal words: but, although, however, on the other hand, unlike. "Unlike his cheerful sister, he was morose all day."',
        'INFERENCE: author describes a situation that lets you guess. "After running 10 miles, she was famished and ate three sandwiches." (Famished = very hungry.)',
        'SYNONYM: author uses a similar word in the same sentence. "The brave warrior, valiant in battle, ..."',
        'STRATEGY: 1) Read past the unknown word to the end of the paragraph. 2) Look for clue words. 3) Substitute your guess back in. 4) If the sentence still makes sense, your guess is reasonable.',
        'NOT EVERY WORD HAS A CLUE: when context is silent, jot the word and look it up later. Better to keep reading than stop on every word.',
      ],
      vocabulary: [
        { term: 'context clue', definition: 'information in surrounding text that helps you figure out the meaning of an unknown word.' },
        { term: 'inference', definition: 'a guess based on combining clues with prior knowledge.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-clue',
      kind: 'worked_example',
      problem: 'Read this sentence and figure out what "obstinate" means: "The obstinate child refused to eat any vegetables, no matter how much his parents pleaded."',
      steps: [
        'Identify the unknown word: obstinate.',
        'Look for clue patterns. The sentence describes the child\'s behaviour: "refused to eat any vegetables, no matter how much his parents pleaded."',
        'Inference: the child won\'t budge from his refusal even when persuaded.',
        '"Obstinate" likely means: stubborn / unwilling to change.',
        'Substitute back: "The stubborn child refused..." — fits perfectly.',
      ],
      answer: 'Obstinate = stubborn / unwilling to change one\'s mind.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What does "lethargic" mean in: "After the long flight, the cat was lethargic — too tired to even chase her favorite toy."?',
      expectedAnswer: 'Lethargic = very tired / lacking energy.',
      responseFormat: 'free',
      hints: [
        'Look for the dash signal — "definition" clue type.',
        'The phrase after the dash defines the word.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-skip-word',
      kind: 'misconception_check',
      question: 'A reader stops every time they meet an unfamiliar word and reaches for a dictionary. Why might this hurt comprehension?',
      commonErrors: [
        {
          answer: 'Always look up unknown words immediately',
          misconception: 'Treating every word as needing precise definition before continuing.',
          correctsTo: 'Constant interruption breaks the flow and pulls you out of the text. Better strategy: 1) Try context clues first. 2) If you have a rough sense of the meaning, keep reading. 3) Only stop for a dictionary when the word is critical AND clues fail. The author often defines important new words within a sentence or two — patience is rewarded.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five clue types: definition, example, contrast, inference, synonym.',
        'Read past the word — the clue might come later in the paragraph.',
        'Substitute your guess back to test it.',
        'Don\'t stop for every word — context clues + flow > dictionary lookups.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'What does "voracious" mean in: "Although her sister picked at her food, Maya was voracious — devouring three plates of pasta."?',
      hint: 'Contrast clue ("Although her sister picked at her food"). Maya\'s opposite behaviour: devouring three plates. Voracious = eating with great hunger / extremely hungry.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
