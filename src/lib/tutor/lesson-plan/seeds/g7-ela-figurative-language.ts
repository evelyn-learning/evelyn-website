/**
 * G7 — ELA: Figurative language (simile, metaphor, personification,
 * hyperbole, idiom).
 *
 * Words used not literally but to create images, comparisons, or
 * emphasis. The five most common types middle-schoolers will see.
 * Recognizing figurative language and explaining what it MEANS
 * (the literal idea behind it) is the centerpiece skill.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_ELA_FIGURATIVE_LANGUAGE: LessonPlan = {
  id: 'evelyn.g7.ela.figurative-language.v1',
  title: 'Figurative Language',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'ela',
  topic: 'literature',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.l.7.5.a',
      description: 'Interpret figures of speech (e.g., literary, biblical, and mythological allusions) in context.',
      standard: 'CCSS.ELA-LITERACY.L.7.5.A',
    },
  ],
  prerequisites: ['ccss.ela.l.5.5.a'],
  followUps: ['ccss.ela.l.8.5.a'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that "raining cats and dogs" doesn\'t mean what it says.',
      script: '"It\'s raining cats and dogs." If you take that literally, you picture animals falling from the sky. But everyone knows it just means it\'s raining hard. Writers do this on purpose — they say one thing to make you THINK something else, more vivid. That\'s figurative language.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five-types',
      kind: 'concept',
      goal: 'Five types with definitions and how to spot each.',
      keyIdeas: [
        'FIGURATIVE LANGUAGE = words that mean more (or other) than their literal meaning.',
        'SIMILE — comparison using "LIKE" or "AS".',
        '  "She runs LIKE the wind." "Cool AS a cucumber."',
        'METAPHOR — a comparison stated AS IF it were true. No "like" / "as".',
        '  "Time is money." "Her room was a disaster zone." (No, time is not literally money.)',
        'PERSONIFICATION — giving HUMAN qualities to non-human things.',
        '  "The leaves DANCED in the wind." "The wind WHISPERED through the trees."',
        'HYPERBOLE — extreme exaggeration for effect, not meant literally.',
        '  "I\'ve told you a million times." "I\'m STARVING."',
        'IDIOM — a phrase whose meaning is different from the literal words; specific to a culture or language.',
        '  "It\'s raining cats and dogs." "Break a leg." "Spill the beans."',
        'When you spot figurative language, ask: what is the writer REALLY saying? Translate to the literal idea.',
      ],
      vocabulary: [
        { term: 'simile', definition: 'a comparison using "like" or "as".' },
        { term: 'metaphor', definition: 'a comparison stated as if it were true.' },
        { term: 'personification', definition: 'giving human traits to non-human things.' },
        { term: 'hyperbole', definition: 'extreme exaggeration for effect.' },
        { term: 'idiom', definition: 'a phrase with a non-literal meaning.' },
      ],
      suggestedTools: ['show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-identify',
      kind: 'worked_example',
      problem: 'Classify each: (a) "The thunder roared like a lion." (b) "His backpack weighed a ton." (c) "The trees waved hello as we passed." (d) "Life is a journey."',
      steps: [
        '(a) "Roared LIKE a lion" — uses "like". SIMILE.',
        '(b) "Weighed a ton" — exaggeration; clearly not literally 2000 pounds. HYPERBOLE.',
        '(c) "Trees waved hello" — trees doing a human action. PERSONIFICATION.',
        '(d) "Life IS a journey" — direct comparison without "like"/"as". METAPHOR.',
      ],
      answer: '(a) simile, (b) hyperbole, (c) personification, (d) metaphor',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-meaning',
      kind: 'worked_example',
      problem: 'A character says "I\'m drowning in homework." What does it mean? What type of figurative language is it?',
      steps: [
        'Literal? No — they\'re not actually underwater.',
        'Hyperbole / metaphor: comparing the OVERWHELM of having too much homework to literally drowning.',
        'Meaning: the character has SO much homework they feel overwhelmed and unable to keep up.',
        'The figurative version is more vivid than "I have a lot of homework."',
      ],
      answer: 'Hyperbole/metaphor — means overwhelmed by homework',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the figurative language in: "The classroom was a zoo."',
      expectedAnswer: 'metaphor',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Simile' },
        { id: 'b', text: 'Metaphor', correct: true },
        { id: 'c', text: 'Hyperbole' },
        { id: 'd', text: 'Personification' },
      ],
      hints: [
        'Is there "like" or "as"? No.',
        'Comparison stated as fact = metaphor.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-similes-as-metaphors',
      kind: 'misconception_check',
      question: 'Asha sees "She fought like a tiger" and calls it a METAPHOR. Right?',
      commonErrors: [
        {
          answer: 'yes — comparison',
          misconception: 'Treating any comparison as a metaphor.',
          correctsTo: 'Both compare, but the WORD "like" makes it a SIMILE specifically. Drop "like" and rewrite as "She was a tiger in the fight" → that\'s a metaphor. Test: "like" or "as" → simile; no "like"/"as" → metaphor.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Simile: comparison with "like" or "as".',
        'Metaphor: comparison without "like"/"as".',
        'Personification: human traits given to non-human.',
        'Hyperbole: extreme exaggeration.',
        'Idiom: cultural phrase with non-literal meaning.',
        'Always translate: what is the writer REALLY saying?',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Write one example of each: simile, metaphor, personification, hyperbole. Use a different topic for each.',
      hint: 'Pick concrete subjects (cars, weather, school). Test each: "like/as" → simile; no comparison word → metaphor.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
