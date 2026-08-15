/**
 * Grades K-2 ELA — Compare & Contrast.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_ELA_COMPARE_CONTRAST: LessonPlan = {
  id: 'evelyn.k2.ela.compare-contrast.v1',
  title: 'K-2 ELA — Compare & Contrast',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'ela',
  topic: 'k2-ela',
  locale: 'en',
  los: [
    {
      id: 'k2.ela.compare-contrast',
      description: 'Compare (find similarities) and contrast (find differences) between two characters, settings, or stories.',
      standard: 'CCSS.ELA-LITERACY.RL.1.9',
    },
  ],
  prerequisites: ['k2.ela.sequencing'],
  followUps: ['k2.ela.asking-questions'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Comparing things makes you a sharper thinker — you notice what\'s same AND what\'s different.',
      script: 'A cat and a dog. Both are pets. Both have four legs. Both eat. But cats meow; dogs bark. Cats purr; dogs wag tails. SAME and DIFFERENT — that\'s comparing and contrasting.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-cc',
      kind: 'concept',
      goal: 'Compare = same. Contrast = different. Both together build understanding.',
      keyIdeas: [
        'COMPARE = find SIMILARITIES (what\'s the SAME).',
        'CONTRAST = find DIFFERENCES (what\'s NOT the same).',
        'WORDS that signal SIMILARITY: "both", "also", "too", "alike", "in the same way".',
        'WORDS that signal DIFFERENCE: "but", "different", "however", "while", "instead".',
        'VENN DIAGRAM: two circles that overlap. The middle = SAME. Each side = DIFFERENT.',
        'COMPARE/CONTRAST CHARACTERS: are they brave or scared? Big or small? Kind or mean?',
        'COMPARE/CONTRAST SETTINGS: warm or cold? Inside or outside? City or country?',
        'COMPARE/CONTRAST stories: same kind of problem? Same kind of ending?',
        'STRUCTURE for talking about it: "Both X and Y are ___. But X is ___, while Y is ___."',
      ],
      vocabulary: [
        { term: 'compare', definition: 'find what is the SAME between two or more things.' },
        { term: 'contrast', definition: 'find what is DIFFERENT between two or more things.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cc',
      kind: 'worked_example',
      problem: 'Compare and contrast a cat and a dog.',
      steps: [
        'COMPARE (same): Both are pets. Both have four legs. Both have fur. Both eat. Both have tails.',
        'CONTRAST (different): Cats MEOW; dogs BARK. Cats PURR; dogs DON\'T. Dogs are usually walked; cats usually aren\'t. Cats often live indoors; dogs often go outside.',
        'Sentence: "Both cats and dogs are pets with four legs. But cats meow, while dogs bark."',
      ],
      answer: 'Both pets, four legs, fur. Different sounds, different behaviours.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How are summer and winter ALIKE? How are they DIFFERENT?',
      expectedAnswer: 'Alike: both seasons. Both happen each year. Both have sunny days. Different: summer is hot, winter is cold. Summer days are long, winter days are short. People wear different clothes in each.',
      responseFormat: 'free',
      hints: [
        'List 1 way they\'re the SAME.',
        'List 1 way they\'re DIFFERENT.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-only-different',
      kind: 'misconception_check',
      question: 'A child says "compare" only means find DIFFERENCES. Correct?',
      commonErrors: [
        {
          answer: 'Compare = differences only',
          misconception: 'Mixing up "compare" and "contrast".',
          correctsTo: 'COMPARE = find SAME. CONTRAST = find DIFFERENT. They\'re opposite. Many people use the phrase "compare and contrast" together — it means find BOTH similarities AND differences. Just "compare" usually focuses on what\'s the same. Just "contrast" focuses on what\'s different.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Compare = SAME. Contrast = DIFFERENT.',
        'Signal words for SAME: both, also, alike.',
        'Signal words for DIFFERENT: but, however, while.',
        'Use a Venn diagram: middle = same, sides = different.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might a teacher ask you to compare two stories?',
      hint: 'It builds thinking. When you compare, you notice details you might have missed. Two fairy tales with similar plots but different characters reveal what the AUTHORS chose to emphasise. Comparing is how readers move from passive to active — from "what happened" to "WHY". Important skill all the way to college.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
