/**
 * K-2 — Magnetism intro.
 *
 * What magnets attract (iron, steel, nickel) and what they don't
 * (wood, plastic, paper). North/south poles. Like poles repel,
 * opposites attract.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SCI_MAGNETISM_INTRO: LessonPlan = {
  id: 'evelyn.k2.sci.physical.magnetism-intro.v1',
  title: 'Magnets: what they pull, what they don\'t',
  curriculum: 'NGSS',
  grade: '2',
  subject: 'sci',
  topic: 'physical-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.k-2.ps2.b',
      description: 'Plan and conduct an investigation to compare the effects of different strengths or different directions of pushes and pulls.',
      standard: 'NGSS.K-PS2-1',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.3.ps2.b'],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open with the wonder of invisible force.',
      script: 'A magnet pulls a paperclip across the table — without TOUCHING it. The pull goes RIGHT THROUGH the air! That\'s magnetism — an invisible force.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-attract-repel',
      kind: 'concept',
      goal: 'What attracts, poles, repulsion.',
      keyIdeas: [
        'A MAGNET pulls some metals toward it. The pull = ATTRACT.',
        'Magnets attract things made of IRON, STEEL, and NICKEL. Examples: paperclips, iron nails, refrigerator doors.',
        'Magnets do NOT attract: wood, plastic, paper, copper, aluminum, gold.',
        'Every magnet has a NORTH pole and a SOUTH pole — usually the ends.',
        'OPPOSITE poles ATTRACT (N + S pull together).',
        'SAME poles REPEL (N + N or S + S push apart).',
        'Earth itself is a giant magnet — that\'s why a compass needle points north.',
      ],
      vocabulary: [
        { term: 'attract', definition: 'pull toward.' },
        { term: 'repel', definition: 'push away.' },
        { term: 'pole', definition: 'one of the two ends of a magnet (north or south).' },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'worked-test',
      kind: 'worked_example',
      problem: 'You hold a magnet near a wooden spoon. Will it stick?',
      steps: [
        'Magnets pull on iron, steel, nickel.',
        'Wood is none of those.',
        'So the magnet WON\'T pull the spoon.',
      ],
      answer: 'No — wood is not magnetic',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Will a magnet pick up a paperclip?',
      expectedAnswer: 'yes',
      responseFormat: 'free',
      hints: [
        'What is a paperclip made of?',
        'Iron or steel — does the magnet attract those?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-all-metals',
      kind: 'misconception_check',
      question: 'Do magnets stick to ALL metals?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Generalizing magnetism to all metals.',
          correctsTo: 'No — magnets only stick to certain metals: iron, steel, nickel, and a few others. Aluminum (soda cans), copper (pennies), gold, silver — magnets do NOT stick to these.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Magnets pull on iron, steel, nickel — not on wood, plastic, paper, gold.',
        'Magnets have a NORTH and SOUTH pole.',
        'Opposites attract; like poles push apart.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does a refrigerator stick magnets to it?',
      hint: 'The fridge door has STEEL underneath. Steel contains iron, which is magnetic. The plastic or paint coating on top doesn\'t block the magnetic force.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
