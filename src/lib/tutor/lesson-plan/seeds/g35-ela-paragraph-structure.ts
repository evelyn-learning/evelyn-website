/**
 * Grades 3-5 ELA — Paragraph Structure.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_PARAGRAPH_STRUCTURE: LessonPlan = {
  id: 'evelyn.g35.ela.paragraph-structure.v1',
  title: 'Grades 3-5 ELA — Paragraph Structure',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.paragraph-structure',
      description: 'Construct a paragraph with a clear topic sentence, supporting details, and a concluding sentence.',
      standard: 'CCSS.ELA-LITERACY.W.4.4',
    },
  ],
  prerequisites: ['g35.ela.summarizing'],
  followUps: ['g35.ela.narrative-developed'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A good paragraph is like a hamburger — a top bun, juicy middle, bottom bun.',
      script: 'Top bun = topic sentence (states the main idea). Middle = supporting details (the meat). Bottom bun = closing sentence (wraps up). Once you internalise this structure, every paragraph you write will feel solid.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-paragraph',
      kind: 'concept',
      goal: 'Hamburger paragraph + transitions + unity rule.',
      keyIdeas: [
        'TOPIC SENTENCE: states the main idea of the paragraph. Usually first.',
        'SUPPORTING DETAILS (3+ sentences): facts, examples, descriptions, reasons that prove or develop the topic sentence.',
        'CONCLUDING SENTENCE: wraps up the paragraph. Restates the main idea or transitions to the next paragraph.',
        'UNITY: every sentence in the paragraph should support the topic sentence. If a sentence wanders into a different topic, it belongs in a different paragraph.',
        'TRANSITIONS: words that link sentences. First, next, then, finally, also, however, for example, in addition.',
        'INDENTATION: paragraph starts with an indent (or a blank line in digital writing). Visual cue that a new idea has begun.',
        'PARAGRAPH LENGTH: usually 4-8 sentences in upper-elementary. Quality over quantity.',
        'COMMON ERROR: writing one giant paragraph that covers many ideas. SPLIT when the topic shifts.',
      ],
      vocabulary: [
        { term: 'topic sentence', definition: 'the sentence (usually first) that states the paragraph\'s main idea.' },
        { term: 'unity', definition: 'the quality of a paragraph in which every sentence supports the same main idea.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-paragraph',
      kind: 'worked_example',
      problem: 'Write a paragraph about why dogs make good pets, using the hamburger structure.',
      steps: [
        'Topic sentence: "Dogs make wonderful pets for many reasons."',
        'Supporting detail 1: "First, dogs are loyal — they greet their families excitedly every day."',
        'Supporting detail 2: "Second, they keep us active by needing daily walks."',
        'Supporting detail 3: "Finally, dogs provide comfort during sad times, sitting close when we need them."',
        'Concluding sentence: "For these reasons, a dog is more than a pet — it\'s a companion."',
        'Combined: full hamburger paragraph with topic + 3 details + close.',
      ],
      answer: '5-sentence paragraph with topic sentence, three supporting details, and a closing.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the topic sentence, supporting details, and concluding sentence in this paragraph: "Recycling is a simple habit with big benefits. It saves energy by reusing materials instead of making new ones. It reduces waste in landfills. It also protects animals by keeping plastics out of the ocean. So, taking five seconds to sort your trash makes a real difference."',
      expectedAnswer: 'Topic: "Recycling is a simple habit with big benefits." Details: 3 sentences (energy, waste, animals). Closing: "So, taking five seconds..."',
      responseFormat: 'free',
      hints: [
        'Topic: usually the first sentence.',
        'Closing: usually the last sentence; may use words like "so" or "therefore".',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-no-unity',
      kind: 'misconception_check',
      question: 'A paragraph starts with the topic sentence "Soccer is a popular sport" and then talks about the player\'s grandmother. Why is this a problem?',
      commonErrors: [
        {
          answer: 'Mixing in unrelated info',
          misconception: 'Drifting from the topic sentence without realising it.',
          correctsTo: 'Violation of UNITY. Every sentence in the paragraph must support the topic sentence ("Soccer is popular"). The grandmother detail might be interesting, but it doesn\'t prove or develop the topic. Either remove it, or move it to a separate paragraph about the player\'s family. Always test each sentence: does it support the topic? If not, cut or relocate.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Hamburger: topic sentence (top), supporting details (middle), closing (bottom).',
        'Unity: every sentence supports the topic sentence.',
        'Transitions: first, next, also, however, for example.',
        'Indent at the start of each paragraph.',
        '4-8 sentences per paragraph is typical.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'When writing a multi-paragraph essay, how do you signal a transition from one paragraph to the next?',
      hint: 'Use a TRANSITION WORD or PHRASE in the new paragraph\'s topic sentence: "Another reason why...", "In addition to that...", "However, some disagree...". You can also briefly reference the previous paragraph\'s idea before introducing the new one. The goal: smooth flow, not abrupt jumps.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
