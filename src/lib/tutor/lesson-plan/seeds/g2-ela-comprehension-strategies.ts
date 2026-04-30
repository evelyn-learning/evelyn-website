/**
 * G2 — Reading comprehension strategies.
 *
 * Visualize, ask questions, summarize, predict. Foundational for
 * understanding what you read.
 */

import type { LessonPlan } from '../types';

export const SEED_G2_ELA_COMPREHENSION_STRATEGIES: LessonPlan = {
  id: 'evelyn.g2.ela.reading.comprehension-strategies.v1',
  title: 'Reading comprehension strategies',
  curriculum: 'CCSS',
  grade: '2',
  subject: 'ela',
  topic: 'reading',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.2.rl.1',
      description: 'Ask and answer such questions as who, what, where, when, why, and how to demonstrate understanding of key details in a text.',
      standard: 'CCSS.ELA-LITERACY.RL.2.1',
    },
  ],
  prerequisites: ['ccss.ela.1.rf.4'],
  followUps: ['ccss.ela.3.rl.1'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show reading is more than saying words.',
      script: 'You can say all the words in a book and still not UNDERSTAND it. Real reading happens in your HEAD — picturing the story, asking questions, predicting what comes next. Today we\'ll learn how good readers do that.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-strategies',
      kind: 'concept',
      goal: 'Four strategies that turn words into understanding.',
      keyIdeas: [
        'VISUALIZE: make a movie in your head as you read. What does the place look like? What does the character look like? Use the words as clues.',
        'ASK QUESTIONS: who is this character? Why are they doing that? What might happen next?',
        'PREDICT: based on what you\'ve read, GUESS what will happen. Then keep reading to see if you were right.',
        'SUMMARIZE: at the end of a page or chapter, retell in 1-2 sentences what happened. If you can\'t, you might need to reread.',
        'GOOD readers do all four AT ONCE — without thinking. We\'re practicing them on purpose so they become automatic.',
      ],
      vocabulary: [
        { term: 'visualize', definition: 'make a picture in your mind.' },
        { term: 'predict', definition: 'guess what comes next based on clues.' },
        { term: 'summarize', definition: 'retell the main points in fewer words.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-passage',
      kind: 'worked_example',
      problem: 'Read: "Mia tiptoed down the hall. The kitchen light was still on. She heard quiet voices." Use the four strategies.',
      steps: [
        'VISUALIZE: dark hall at night, glowing kitchen at the end. Mia in pajamas, sneaking.',
        'QUESTIONS: Why is Mia sneaking? Whose voices? Is something secret happening?',
        'PREDICT: She might overhear something important.',
        'SUMMARIZE: Mia is sneaking around at night because she\'s curious about the voices.',
        'See how the strategies layer? Each makes the reading richer.',
      ],
      answer: 'visualize scene, ask why, predict overhear, summarize the curiosity',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Read this sentence and PREDICT what comes next: "The puppy looked up at the cake on the table, then crouched down on his back legs."',
      expectedAnswer: 'student-specific (e.g., "He\'s going to jump for the cake!")',
      responseFormat: 'free',
      hints: [
        'What animal? What\'s on the table? What does crouching usually mean?',
        'A puppy crouching near a cake is probably about to…',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-words-equal-understanding',
      kind: 'misconception_check',
      question: 'If you read every word correctly, does that mean you understood the story?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Equating decoding with comprehension.',
          correctsTo: 'No — saying the words is just step one. Real reading means you can VISUALIZE, ask QUESTIONS, and SUMMARIZE the story. Some people read every word but if asked "what happened?" they don\'t know — that\'s a comprehension problem, not a reading problem.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Visualize: see the story in your head.',
        'Ask questions: who, what, why, how.',
        'Predict: guess what comes next.',
        'Summarize: retell briefly.',
        'Words alone aren\'t reading — understanding is.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'When should you STOP and reread a part?',
      hint: 'When you realize you don\'t know what just happened. When you can\'t answer a basic "who is this?" question. Don\'t push through confusion — back up.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
