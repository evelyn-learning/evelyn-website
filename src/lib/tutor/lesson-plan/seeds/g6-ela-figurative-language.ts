/**
 * G6 — Figurative language: simile, metaphor, personification,
 * idiom, hyperbole.
 *
 * Recognizing and analyzing figurative language in fiction and
 * everyday speech.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_ELA_FIGURATIVE_LANGUAGE: LessonPlan = {
  id: 'evelyn.g6.ela.literary.figurative-language.v1',
  title: 'Figurative language: simile, metaphor, personification, idiom',
  curriculum: 'CCSS',
  grade: '6',
  subject: 'ela',
  topic: 'literary-devices',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.6.l.5.a',
      description: 'Interpret figures of speech in context.',
      standard: 'CCSS.ELA-LITERACY.L.6.5.A',
    },
  ],
  prerequisites: ['ccss.ela.5.l.5.a'],
  followUps: ['ccss.ela.7.l.5.a'],
  estimatedMinutes: 13,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show figurative language in everyday speech.',
      script: 'When you say "I\'m starving" before dinner, are you really dying? When you say someone "stabbed me in the back", is there blood? No — you\'re using FIGURATIVE language. We do it all the time without thinking.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five-types',
      kind: 'concept',
      goal: 'Five common types and how to spot each.',
      keyIdeas: [
        'SIMILE: comparison using LIKE or AS. "Brave like a lion." "Cold as ice."',
        'METAPHOR: comparison saying one IS the other (no like/as). "She is a rock." "Time is money."',
        'PERSONIFICATION: giving non-human things HUMAN traits. "The wind whispered." "The clock screamed at 7 AM."',
        'IDIOM: phrase that means something different from its literal words. "Break a leg" (good luck), "kick the bucket" (die), "raining cats and dogs" (raining hard). Often confusing for non-native speakers because the literal meaning makes no sense.',
        'HYPERBOLE: deliberate, obvious EXAGGERATION for effect. "I\'ve told you a million times." "I could eat a horse."',
        'WHY USE IT? Figurative language packs more meaning, creates vivid images, makes prose memorable. "Her mind was racing" hits harder than "she thought fast".',
      ],
      vocabulary: [
        { term: 'figurative language', definition: 'words used in non-literal ways to create images or effects.' },
        { term: 'idiom', definition: 'a phrase whose meaning isn\'t the sum of the literal words.' },
        { term: 'personification', definition: 'giving non-human things human characteristics.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-classify',
      kind: 'worked_example',
      problem: 'Classify each: (a) "The leaves danced in the wind." (b) "She was as quiet as a mouse." (c) "It\'s raining cats and dogs."',
      steps: [
        '(a) Leaves "danced" — leaves can\'t dance literally; we gave them a HUMAN action. PERSONIFICATION.',
        '(b) "as quiet as a mouse" — comparison using AS → SIMILE.',
        '(c) "raining cats and dogs" — meaning isn\'t literal (no animals falling). IDIOM.',
      ],
      answer: '(a) personification, (b) simile, (c) idiom',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the type: "My backpack weighs a ton."',
      expectedAnswer: 'hyperbole',
      responseFormat: 'free',
      hints: [
        'A ton is 2000 pounds. Backpacks don\'t actually weigh that.',
        'Deliberate exaggeration for effect = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-simile-metaphor',
      kind: 'misconception_check',
      question: 'Is "She is a star" a simile?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Calling all comparisons similes.',
          correctsTo: 'No — no "like" or "as", and it says she IS a star (not LIKE one). That makes it a METAPHOR. Test: similes have "like" or "as"; metaphors don\'t.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Simile: like/as comparison.',
        'Metaphor: X is Y (no like/as).',
        'Personification: human traits to non-humans.',
        'Idiom: meaning ≠ literal words.',
        'Hyperbole: deliberate exaggeration.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are IDIOMS often the hardest figurative language for someone learning English?',
      hint: 'Idioms can\'t be figured out from the literal words. "Kick the bucket" makes no sense unless you ALREADY know it means "die". Each must be memorized individually. Many other languages have totally different idioms for the same idea.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
