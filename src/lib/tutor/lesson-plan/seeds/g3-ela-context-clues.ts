/**
 * G3 — ELA: Using context clues to figure out unknown words.
 *
 * The first systematic strategy for vocabulary in the wild. Five
 * common types of context clues — definition, example, synonym,
 * antonym, inference. The skill: read AROUND the unknown word and
 * use the surrounding sentence(s) to make a smart guess.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_ELA_CONTEXT_CLUES: LessonPlan = {
  id: 'evelyn.g3.ela.context-clues.v1',
  title: 'Using Context Clues',
  curriculum: 'CCSS',
  grade: '3',
  subject: 'ela',
  topic: 'vocabulary',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.l.3.4.a',
      description: 'Use sentence-level context as a clue to the meaning of a word or phrase.',
      standard: 'CCSS.ELA-LITERACY.L.3.4.A',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.ela.l.4.4.a'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Detective metaphor — figure out a word from clues.',
      script: 'You\'re reading a book and hit a word you don\'t know. You don\'t have a dictionary. Now what? Do detective work — the words AROUND the unknown word almost always leave clues. With a little practice you\'ll crack most unknown words without leaving the page.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five-clues',
      kind: 'concept',
      goal: 'Five types of context clues to look for.',
      keyIdeas: [
        '1) DEFINITION clue: the writer defines the word right after using it. Often signaled by "is", "means", or commas.',
        '   "The herbivore, an animal that eats only plants, ate the leaves."',
        '2) EXAMPLE clue: the writer gives examples that hint at the meaning. Signaled by "such as", "like", "for example", "including".',
        '   "Reptiles, such as snakes, lizards, and turtles, are cold-blooded."',
        '3) SYNONYM clue: a word with similar meaning is nearby.',
        '   "She was very FATIGUED — she was exhausted from running all day."',
        '4) ANTONYM clue: a word with the OPPOSITE meaning is nearby. Often with "but", "however", "instead", "unlike".',
        '   "Unlike his SHY brother, Jay was outgoing." (shy = opposite of outgoing.)',
        '5) INFERENCE clue: no direct definition, but the situation tells you. You have to think about the whole sentence.',
        '   "The thunder rumbled and the rain fell as we headed for shelter from the TEMPEST." (Tempest = a big storm.)',
        'STRATEGY: when you hit an unknown word, read the sentence AROUND it. Look for any of the five clues. Make your best guess, then keep reading to confirm.',
      ],
      vocabulary: [
        { term: 'context', definition: 'the words and sentences around a word that help explain it.' },
        { term: 'synonym', definition: 'a word that means about the same thing as another.' },
        { term: 'antonym', definition: 'a word that means the opposite of another.' },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-definition-clue',
      kind: 'worked_example',
      problem: 'Use context clues to figure out what NOCTURNAL means: "Owls are nocturnal — they hunt and are active at night."',
      steps: [
        'Identify the unknown word: nocturnal.',
        'Look at what surrounds it. The dash leads into "they hunt and are active at night."',
        'That\'s a DEFINITION clue — the writer told us right after.',
        'Nocturnal = active at night.',
      ],
      answer: 'active at night',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-antonym-clue',
      kind: 'worked_example',
      problem: 'Figure out FRAGILE: "Be careful with the vase — it\'s fragile, not sturdy like the metal one."',
      steps: [
        'Unknown: fragile.',
        'Signal word "not" pairs fragile with the opposite of "sturdy".',
        'Sturdy means strong / hard to break.',
        'So fragile = easy to break, delicate.',
      ],
      answer: 'easy to break',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What does VAST mean? "The desert was vast, stretching as far as the eye could see."',
      expectedAnswer: 'very large / huge',
      responseFormat: 'free',
      hints: [
        '"As far as the eye could see" — what does that suggest about size?',
        'Inference clue: the description tells you.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-just-guess',
      kind: 'misconception_check',
      question: 'Maya hits the word OPULENT and skips it without checking the sentence. Is that a problem?',
      commonErrors: [
        {
          answer: 'no — you can\'t know every word',
          misconception: 'Skipping unknown words instead of doing context-clue detective work.',
          correctsTo: 'Skipping costs you understanding. Even one unknown word can change the meaning of a sentence. Always TRY context clues first — you\'ll be right most of the time, and even when you\'re close-but-not-exact, you understand more than skipping.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five clue types: definition, example, synonym, antonym, inference.',
        'Signal words: "is/means" (definition), "such as/like" (example), "but/unlike" (antonym).',
        'Read AROUND the unknown word, not just at it.',
        'Make a guess, then keep reading to confirm.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Find an unknown word in the next book you read. Use context clues — which type was it?',
      hint: 'Most often you\'ll find inference or example clues; explicit definitions are common in nonfiction.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
