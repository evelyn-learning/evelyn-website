/**
 * G2 — Spelling patterns: short vs long vowels, silent e.
 *
 * Foundational spelling: cat vs cake (silent e makes the vowel say
 * its name). Also bit/bite, hop/hope, tub/tube. Builds on phonics.
 */

import type { LessonPlan } from '../types';

export const SEED_G2_ELA_SPELLING_PATTERNS: LessonPlan = {
  id: 'evelyn.g2.ela.spelling.patterns.v1',
  title: 'Spelling: short vowels, long vowels, silent e',
  curriculum: 'CCSS',
  grade: '2',
  subject: 'ela',
  topic: 'spelling',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.2.rf.3.a',
      description: 'Distinguish long and short vowels when reading regularly spelled one-syllable words.',
      standard: 'CCSS.ELA-LITERACY.RF.2.3.A',
    },
    {
      id: 'ccss.ela.2.rf.3.b',
      description: 'Know spelling-sound correspondences for additional common vowel teams.',
      standard: 'CCSS.ELA-LITERACY.RF.2.3.B',
    },
  ],
  prerequisites: ['ccss.ela.1.rf.3.a'],
  followUps: ['ccss.ela.2.rf.3.c'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show how a single silent letter can change the whole word.',
      script: 'Look at CAT. Now I add an E at the end: CATE. Wait — that\'s not a word. But what about HOP → HOPE? The e is silent but it changed how O sounds!',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-short-long-e',
      kind: 'concept',
      goal: 'Vowels have a SHORT sound and a LONG sound. Silent e at the end often makes the vowel long.',
      keyIdeas: [
        'SHORT VOWELS: a in cat, e in bed, i in bit, o in hop, u in tub. Quick little sounds.',
        'LONG VOWELS: a in cake, e in feet, i in bite, o in hope, u in tube. The vowel says its NAME.',
        'SILENT E rule: a vowel + one consonant + e at the end → vowel is LONG, e is silent. cap → cape, kit → kite.',
        'Vowel TEAMS like "ee", "ai", "oa" also make long sounds: see, rain, boat.',
      ],
      vocabulary: [
        { term: 'short vowel', definition: 'a quick vowel sound — like the a in cat.' },
        { term: 'long vowel', definition: 'a vowel that says its name — like the a in cake.' },
        { term: 'silent e', definition: 'an e at the end that doesn\'t make a sound but changes the vowel.' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-cap-cape',
      kind: 'worked_example',
      problem: 'Compare CAP and CAPE. What does the silent e do?',
      steps: [
        'CAP: short A — /a/ as in "apple". Three letters, three sounds: /k/ /a/ /p/.',
        'Add E: CAPE. Now the A is LONG — it says its name "ay". Sounds: /k/ /ay/ /p/, e is silent.',
        'So the silent E flipped a SHORT a into a LONG a.',
      ],
      answer: 'silent e makes the vowel long',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Read HOP and HOPE out loud. Which has a long O?',
      expectedAnswer: 'HOPE',
      responseFormat: 'free',
      hints: [
        'Listen for the O saying its name.',
        'Silent e at the end → long vowel.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-e-pronounced',
      kind: 'misconception_check',
      question: 'In CAKE, do we say /k/ /a/ /k/ /eh/ — pronouncing the e?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Pronouncing silent e.',
          correctsTo: 'No — the e is SILENT. We say /k/ /ay/ /k/ — three sounds, e is just there to make A long.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SHORT vowels = quick sounds (cat, bed, bit, hop, tub).',
        'LONG vowels = vowel says its name (cake, feet, bite, hope, tube).',
        'Silent E at the end → makes the vowel long, e doesn\'t make a sound.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'What about LOVE — does the silent e make o long? Why doesn\'t it follow the rule?',
      hint: 'Some common words break the rule — they\'re exceptions you have to learn one at a time.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
