/**
 * G2 — Contractions.
 *
 * don't, can't, isn't, won't, I'm, you're, they're. Apostrophe
 * marks where letters were dropped.
 */

import type { LessonPlan } from '../types';

export const SEED_G2_ELA_CONTRACTIONS: LessonPlan = {
  id: 'evelyn.g2.ela.grammar.contractions.v1',
  title: 'Contractions: smushing two words into one',
  curriculum: 'CCSS',
  grade: '2',
  subject: 'ela',
  topic: 'grammar',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.2.l.2.c',
      description: 'Use an apostrophe to form contractions and frequently occurring possessives.',
      standard: 'CCSS.ELA-LITERACY.L.2.2.C',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the example obvious.',
      script: 'You don\'t say "do not" all the time. You say "don\'t". You smushed two words into one with an apostrophe. That\'s a CONTRACTION.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rules',
      kind: 'concept',
      goal: 'How contractions work + common ones.',
      keyIdeas: [
        'A CONTRACTION is two words combined into one. The apostrophe (\') shows where letters were left out.',
        'COMMON contractions: do not → don\'t, can not → can\'t, will not → won\'t (irregular!), is not → isn\'t, are not → aren\'t.',
        'Pronoun + verb: I am → I\'m, you are → you\'re, he is → he\'s, she is → she\'s, it is → it\'s, we are → we\'re, they are → they\'re.',
        'Have/will: I have → I\'ve, I will → I\'ll, you will → you\'ll.',
        'WOULD/HAD: I would → I\'d, I had → I\'d. Same contraction; context tells you which.',
        'CONTRACTIONS are casual. In formal writing, sometimes spelled out. In speech, contractions are normal.',
      ],
      vocabulary: [
        { term: 'contraction', definition: 'two words combined into one with an apostrophe.' },
        { term: 'apostrophe', definition: 'the symbol \' that marks dropped letters or possession.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-form',
      kind: 'worked_example',
      problem: 'Make a contraction from "I am".',
      steps: [
        'I + am.',
        'Drop the "a" in "am".',
        'Replace it with an apostrophe.',
        'Push together: I\'m.',
        '"I am happy" becomes "I\'m happy".',
      ],
      answer: "I'm",
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What\'s the contraction for "they are"?',
      expectedAnswer: "they're",
      responseFormat: 'free',
      hints: [
        'Drop the "a" in "are".',
        'Replace with apostrophe.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-its-vs-its',
      kind: 'misconception_check',
      question: 'Is "its" the same as "it\'s"?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing the two.',
          correctsTo: 'No — these are DIFFERENT words. "It\'s" = "it is" or "it has" (a contraction with apostrophe). "Its" = belongs to it (possessive, no apostrophe). Common mix-up. The dog wagged ITS tail (no apostrophe). IT\'S a sunny day = IT IS a sunny day.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Contraction = two words → one word with apostrophe.',
        'Apostrophe shows where letters were dropped.',
        '"It\'s" = it is. "Its" = belongs to it. (No apostrophe for possessive.)',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'WON\'T is irregular — it doesn\'t come from "won not". Where does it come from?',
      hint: 'It comes from older English "wol not" or "wonnot". The "wo" is preserved from "wol", an old form of "will". English keeps these historical fingerprints.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
