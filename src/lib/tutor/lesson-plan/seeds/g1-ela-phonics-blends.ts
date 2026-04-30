/**
 * G1 — Phonics: blending and digraphs.
 *
 * Two consonants that work together: blends (bl, st, fr — both
 * sounds heard) versus digraphs (sh, ch, th — one new sound). Builds
 * on K letter-sounds.
 */

import type { LessonPlan } from '../types';

export const SEED_G1_ELA_PHONICS_BLENDS: LessonPlan = {
  id: 'evelyn.g1.ela.phonics.blends-digraphs.v1',
  title: 'Blends and digraphs',
  curriculum: 'CCSS',
  grade: '1',
  subject: 'ela',
  topic: 'phonics',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.1.rf.3.a',
      description: 'Know the spelling-sound correspondences for common consonant digraphs.',
      standard: 'CCSS.ELA-LITERACY.RF.1.3.A',
    },
    {
      id: 'ccss.ela.1.rf.3.b',
      description: 'Decode regularly spelled one-syllable words.',
      standard: 'CCSS.ELA-LITERACY.RF.1.3.B',
    },
  ],
  prerequisites: ['ccss.ela.k.rf.3.a'],
  followUps: ['ccss.ela.1.rf.3.d'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that two letters together can make ONE new sound — like teamwork.',
      script: 'Listen to "ship". Do you hear the "s" or the "h" by itself? No! S and H teamed up to make a NEW sound: /sh/.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-blend-vs-digraph',
      kind: 'concept',
      goal: 'In a BLEND, both sounds are heard; in a DIGRAPH, two letters make ONE new sound.',
      keyIdeas: [
        'BLEND: two letters, two sounds you can still hear. Examples: bl in BLue (you hear /b/ AND /l/), st in STop, fr in FRog.',
        'DIGRAPH: two letters, ONE new sound. Examples: sh in SHip (/sh/), ch in CHair (/ch/), th in THis (/th/).',
        'A trick: with a blend you can almost split it; with a digraph, you can\'t.',
      ],
      vocabulary: [
        { term: 'blend', definition: 'two letters whose sounds are both heard, like /bl/ in "blue".' },
        { term: 'digraph', definition: 'two letters that make one new sound, like /sh/ in "ship".' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-stop',
      kind: 'worked_example',
      problem: 'Read the word STOP. Is "st" a blend or a digraph?',
      steps: [
        'Sound out the letters: /s/ /t/ /o/ /p/.',
        'Listen carefully to the start: do you hear both /s/ AND /t/? Yes — /s-t-op/.',
        'Both sounds heard → it\'s a BLEND.',
      ],
      answer: 'blend',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Read SHIP. Is "sh" a blend or a digraph?',
      expectedAnswer: 'digraph',
      responseFormat: 'free',
      hints: [
        'Try sounding out the letters separately: /s/ /h/. Do you hear that in "ship"?',
        'No — you hear /sh/, ONE new sound. So it\'s…',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bl-as-digraph',
      kind: 'misconception_check',
      question: 'Is "bl" in BLOCK a digraph?',
      commonErrors: [
        {
          answer: 'digraph',
          misconception: 'Treating any two-letter combo as a digraph.',
          correctsTo: 'No — listen: /b/ /l/ /o/ /ck/. You hear BOTH /b/ and /l/ at the start. That makes it a BLEND.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'BLEND = both letter sounds heard (bl, st, fr, gr, sk).',
        'DIGRAPH = two letters, ONE new sound (sh, ch, th, wh, ph).',
        'Use your ears: if you can hear both sounds, it\'s a blend.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'PHONE has "ph" at the start. Blend or digraph? What sound does it make?',
      hint: 'Sound it out: do you hear /p/ AND /h/, or just one sound?',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
