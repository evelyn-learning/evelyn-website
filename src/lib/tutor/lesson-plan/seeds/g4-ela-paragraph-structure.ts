/**
 * G4 — Paragraph structure.
 *
 * Topic sentence + supporting details + closing. The sandwich
 * model. Foundation for essay writing.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_ELA_PARAGRAPH_STRUCTURE: LessonPlan = {
  id: 'evelyn.g4.ela.writing.paragraph-structure.v1',
  title: 'Paragraph structure: topic sentence and details',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'ela',
  topic: 'writing',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.4.w.4',
      description: 'Produce clear and coherent writing in which the development and organization are appropriate to task, purpose, and audience.',
      standard: 'CCSS.ELA-LITERACY.W.4.4',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.ela.5.w.4'],
  estimatedMinutes: 11,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Compare a sandwich-shaped paragraph with a random one.',
      script: 'A good paragraph is like a sandwich. The TOP slice introduces. The MIDDLE has the meat. The BOTTOM wraps it up. Without that structure, your paragraph is just a pile of toppings.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-parts',
      kind: 'concept',
      goal: 'Three parts of a paragraph + transitions.',
      keyIdeas: [
        'TOPIC SENTENCE: the FIRST sentence usually. States the main idea of the whole paragraph.',
        'SUPPORTING DETAILS: 2-4 sentences in the middle. Give EVIDENCE, EXAMPLES, REASONS that support the topic.',
        'CLOSING SENTENCE: wraps up. Restates the main idea or transitions to the next paragraph.',
        'TRANSITIONS: words that connect ideas. "First", "next", "for example", "however", "finally".',
        'STAY ON TOPIC: every supporting sentence must connect to the topic sentence. If it doesn\'t, save it for a different paragraph.',
      ],
      vocabulary: [
        { term: 'topic sentence', definition: 'the sentence that states what the whole paragraph is about.' },
        { term: 'supporting detail', definition: 'a sentence that gives evidence or example for the main idea.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-build',
      kind: 'worked_example',
      problem: 'Build a paragraph about why dogs make great pets.',
      steps: [
        'TOPIC SENTENCE: "Dogs make great pets for many reasons."',
        'SUPPORTING DETAIL 1: "First, they are loyal — a dog will recognize and love its owner for life."',
        'SUPPORTING DETAIL 2: "Second, they help people stay active by needing daily walks."',
        'SUPPORTING DETAIL 3: "They can also be trained to help with tasks, like guide dogs for the blind."',
        'CLOSING: "For all these reasons, it\'s no surprise that dogs are called man\'s best friend."',
        'Notice: each detail starts with a transition (First, Second), all connect to "great pets", and the closing wraps it.',
      ],
      answer: 'topic + 3 details with transitions + closing',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Write a topic sentence for a paragraph about your favorite season.',
      expectedAnswer: 'student-specific (e.g., "Summer is my favorite season because of the freedom it brings.")',
      responseFormat: 'free',
      hints: [
        'State your favorite season AND give a hint of WHY in one sentence.',
        'Example: "Summer is my favorite season because of the warm weather and long days."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-anything-goes',
      kind: 'misconception_check',
      question: 'In one paragraph, can you write about EVERYTHING you want to say?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Cramming many topics into one paragraph.',
          correctsTo: 'No — each paragraph should focus on ONE main idea. If you have multiple ideas, use multiple paragraphs. A paragraph that\'s about everything is about nothing — readers can\'t track the point.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Topic sentence + supporting details + closing = paragraph sandwich.',
        'Use TRANSITIONS (first, next, finally) to connect ideas.',
        'Stay on topic — every detail supports the topic sentence.',
        'One main idea per paragraph.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Sometimes the topic sentence comes at the END of a paragraph instead. Why might a writer do that?',
      hint: 'For dramatic effect — building up evidence, then revealing the main point. Common in persuasive writing where you want the reader to discover the conclusion themselves.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
