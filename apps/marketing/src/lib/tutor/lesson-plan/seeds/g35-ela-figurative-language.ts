/**
 * Grades 3-5 ELA — Figurative Language (Simile, Metaphor, Personification).
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_FIGURATIVE_LANGUAGE: LessonPlan = {
  id: 'evelyn.g35.ela.figurative-language.v1',
  title: 'Grades 3-5 ELA — Figurative Language',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.figurative-language',
      description: 'Identify and interpret similes, metaphors, personification, hyperbole, and idioms.',
      standard: 'CCSS.ELA-LITERACY.L.5.5',
    },
  ],
  prerequisites: ['g35.ela.point-of-view'],
  followUps: ['g35.ela.text-features'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Authors use figurative language to make writing vivid — and readers who recognise it grasp meaning faster.',
      script: '"Her smile was sunshine on a cloudy day." She wasn\'t literally projecting solar radiation — that\'s a METAPHOR for "her smile was warm and uplifting." Authors use these tricks to pack meaning into few words. Today we name the tricks.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-figlang',
      kind: 'concept',
      goal: 'Five figurative-language types and how to interpret each.',
      keyIdeas: [
        'SIMILE: compares two unlike things using "LIKE" or "AS". "She runs LIKE a cheetah." "He\'s as quiet AS a mouse."',
        'METAPHOR: compares two unlike things WITHOUT using like/as. "Her smile is sunshine." Treats one thing as if it IS the other.',
        'PERSONIFICATION: gives human qualities to non-human things. "The wind whispered through the trees." (Wind doesn\'t actually whisper.)',
        'HYPERBOLE: extreme exaggeration for emphasis. "I\'ve told you a million times!" (Not literally a million.)',
        'IDIOM: a phrase whose meaning differs from literal. "It\'s raining cats and dogs" = raining heavily. "Break a leg" = good luck.',
        'INTERPRETATION STRATEGY: 1) Spot the comparison. 2) What QUALITIES are shared? 3) What does the figurative language ADD that literal wouldn\'t?',
        'CONTEXT MATTERS: idioms are especially context-dependent. "Hit the books" means study, not strike them.',
      ],
      vocabulary: [
        { term: 'simile', definition: 'a comparison using "like" or "as".' },
        { term: 'metaphor', definition: 'a direct comparison stating one thing IS another, without "like" or "as".' },
        { term: 'personification', definition: 'giving human characteristics to non-human things.' },
        { term: 'hyperbole', definition: 'extreme exaggeration for emphasis.' },
        { term: 'idiom', definition: 'a common phrase whose meaning is not literal.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-figlang',
      kind: 'worked_example',
      problem: 'Identify the figurative language and explain its meaning: "The classroom was a zoo after lunch."',
      steps: [
        'Look for "like" or "as" — none present.',
        'Look for direct comparison: "The classroom WAS a zoo." Treats one thing AS another.',
        'Type: METAPHOR.',
        'Shared qualities: zoos are noisy, chaotic, crowded with energetic animals. The author is saying the classroom became noisy and chaotic.',
        'Why metaphor instead of literal? More vivid. "Noisy and chaotic" is plain; "a zoo" instantly evokes the image.',
      ],
      answer: 'Metaphor. Means: the classroom was loud, chaotic, and energetic.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the figurative language: "The old oak tree groaned in the wind."',
      expectedAnswer: 'Personification. Trees can\'t actually groan — the author gives the tree a human-like quality (groaning).',
      responseFormat: 'free',
      hints: [
        'Trees don\'t make human sounds.',
        'Giving human traits to non-humans = ?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-simile-vs-metaphor',
      kind: 'misconception_check',
      question: '"Her hair flowed like a river." Simile or metaphor?',
      commonErrors: [
        {
          answer: 'Metaphor',
          misconception: 'Calling any comparison a metaphor without checking for "like" or "as".',
          correctsTo: 'The word "LIKE" makes it a SIMILE, not a metaphor. Mnemonic: SimiLe contains LIKE; meTaphor doesn\'t. Both compare hair to river, but the presence of like/as is the technical difference.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Simile: like/as. Metaphor: direct (no like/as).',
        'Personification: human traits to non-humans.',
        'Hyperbole: extreme exaggeration.',
        'Idiom: non-literal common phrase.',
        'To interpret: identify the comparison, ask what qualities are shared.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Identify the figurative language and meaning: "I\'m so hungry I could eat a horse."',
      hint: 'Hyperbole. Nobody literally eats horses. Extreme exaggeration to emphasise being VERY hungry. The image of eating a whole horse drives home the intensity of the hunger more effectively than "I\'m really hungry."',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
