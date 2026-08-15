/**
 * Grades K-2 ELA — Asking Questions While Reading.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_ELA_ASKING_QUESTIONS: LessonPlan = {
  id: 'evelyn.k2.ela.asking-questions.v1',
  title: 'K-2 ELA — Asking Questions',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'ela',
  topic: 'k2-ela',
  locale: 'en',
  los: [
    {
      id: 'k2.ela.asking-questions',
      description: 'Develop the habit of asking questions before, during, and after reading to deepen comprehension.',
      standard: 'CCSS.ELA-LITERACY.RL.1.1',
    },
  ],
  prerequisites: ['k2.ela.compare-contrast'],
  followUps: ['k2.ela.narrative-writing'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Strong readers ask questions — it\'s how you stay AWAKE in a story.',
      script: 'When you read, your brain should be busy: "Why did she do that?" "What will happen next?" "Where is this place?" Asking questions keeps you thinking. Today we drill the habit.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-questions',
      kind: 'concept',
      goal: 'Question types + when to ask + how questions help.',
      keyIdeas: [
        'BEFORE reading: ask about the title, cover, pictures. "What do I think this will be about?"',
        'DURING reading: ask about what\'s happening. "Why did the character do that?" "What does this word mean?" "What might happen next?"',
        'AFTER reading: ask about the whole story. "What was the lesson?" "Did I like it? Why?"',
        'WH-QUESTION WORDS: Who, What, Where, When, Why, How. Useful for forming questions.',
        'TWO TYPES: 1) Questions the TEXT answers (look back to find). 2) Questions the text DOESN\'T answer (you have to think or guess).',
        'PRACTICE: while reading, jot down or whisper one question per page. It builds the habit.',
        'WHY IT HELPS: questioning makes you ACTIVE. Passive readers forget what they read; active readers remember and understand.',
        'PARENT/TEACHER HELP: if you can\'t answer your own question, that\'s a great moment to ask someone or look it up.',
      ],
      vocabulary: [
        { term: 'predict', definition: 'guess what will happen next based on clues.' },
        { term: 'question', definition: 'a sentence asking for information; ends with a question mark.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-questions',
      kind: 'worked_example',
      problem: 'You see a book titled "The Lost Puppy." Form THREE questions to ask before reading.',
      steps: [
        'BEFORE reading, ask:',
        '1. "Who lost the puppy?" (Who-question)',
        '2. "Where is the puppy?" (Where-question)',
        '3. "Will they find the puppy?" (prediction)',
        'These questions PRIME your brain to look for answers as you read. By the end, you\'ll have answers AND new questions.',
      ],
      answer: 'Three before-reading questions about character, location, and outcome.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'During a story, the character says "I have to do this alone." What question could you ask?',
      expectedAnswer: 'Sample: "Why does she have to do it alone?" "What will she do?" "Will someone help her anyway?" Any reasonable curiosity-question.',
      responseFormat: 'free',
      hints: [
        'What\'s curious about that statement?',
        'Why ALONE?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-only-after',
      kind: 'misconception_check',
      question: 'A student only asks questions AFTER finishing the book. What\'s missing?',
      commonErrors: [
        {
          answer: 'Questions only at the end',
          misconception: 'Treating questioning as a finishing activity, not a reading-along activity.',
          correctsTo: 'Strong readers question BEFORE, DURING, and AFTER. Before reading: predict. During reading: stay engaged, clarify, predict. After reading: reflect. Asking only at the end means missing the comprehension boost during the read. Active questioning = active reading.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Ask BEFORE, DURING, and AFTER reading.',
        'Use Wh-words: who, what, where, when, why, how.',
        'Some questions the text answers; some you have to think.',
        'Questions keep you ACTIVE while reading.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are "WHY" questions often the BEST questions?',
      hint: '"Why" digs deeper than "what". "What" gives you facts. "Why" gives you reasons, motivations, causes — much richer understanding. "What did Goldilocks do?" → she ate porridge. "Why did Goldilocks go in?" → she was curious / the door was open / she didn\'t know it was someone\'s house. Good readers ask many "why" questions.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
