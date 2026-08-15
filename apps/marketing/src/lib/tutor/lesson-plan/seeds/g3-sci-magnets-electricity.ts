/**
 * Grade 3 Science — Magnets and Static Electricity.
 * NGSS 3-PS2-3 / 3-PS2-4: cause-and-effect relationships of electric
 * or magnetic interactions between objects not in contact.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_SCI_MAGNETS_ELECTRICITY: LessonPlan = {
  id: 'evelyn.g3.science.physics.magnets-electricity.v1',
  title: 'Magnets and Static Electricity',
  curriculum: 'NGSS',
  grade: '3',
  subject: 'science',
  topic: 'forces-and-motion',
  locale: 'en',
  los: [
    {
      id: 'ngss.3-ps2-3',
      description: 'Ask questions to determine cause-and-effect relationships of electric or magnetic interactions between two objects not in contact with each other.',
      standard: 'NGSS.3-PS2-3',
    },
  ],
  prerequisites: ['ngss.3-ps2-1'],
  followUps: ['ngss.ms-ps2-3'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up "action at a distance" through a familiar surprise.',
      script: 'Hold a magnet near a paperclip. Even WITHOUT TOUCHING, the paperclip jumps to the magnet. How does a force reach across empty space?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-magnets',
      kind: 'concept',
      goal: 'Magnets pull on certain metals (mostly iron). They have two ends — N and S — that attract their opposite and repel their match.',
      keyIdeas: [
        'Magnets ATTRACT iron, steel, nickel — but NOT plastic, wood, paper, or aluminum.',
        'Every magnet has TWO POLES: North (N) and South (S).',
        'OPPOSITE poles ATTRACT (N pulls S).',
        'SAME poles REPEL (N pushes N, S pushes S).',
        'Magnetic force works WITHOUT TOUCHING — through air, paper, even thin plastic.',
        'Earth itself is a giant magnet — that\'s how compasses work.',
      ],
      vocabulary: [
        { term: 'magnet', definition: 'an object that attracts iron and similar metals.' },
        { term: 'pole', definition: 'one of the two ends of a magnet (north or south).' },
        { term: 'attract', definition: 'pull toward.' },
        { term: 'repel', definition: 'push away.' },
      ],
      suggestedTools: ['show_labeled_image'],
      estimatedMinutes: 4,
    },
    {
      id: 'concept-static',
      kind: 'concept',
      goal: 'Static electricity is when objects build up tiny charges and pull on each other — like little magnets, but for any material.',
      keyIdeas: [
        'Rub a balloon on your hair → balloon picks up electric charge.',
        'The charged balloon ATTRACTS small bits of paper or makes your hair stand up.',
        'Two charged balloons can REPEL each other — same charge pushes apart.',
        'Static electricity is what causes that little "zap" when you touch a doorknob in winter.',
      ],
      vocabulary: [
        { term: 'static electricity', definition: 'a buildup of electric charge that doesn\'t flow.' },
        { term: 'charge', definition: 'a property that lets objects pull or push each other electrically.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-balloon-hair',
      kind: 'worked_example',
      problem: 'You rub a balloon on your hair, then hold it near small paper bits. The paper jumps UP to the balloon. Explain.',
      steps: [
        'Rubbing transfers charge from hair to balloon. Balloon now has a charge.',
        'Charged balloon ATTRACTS the (uncharged) paper bits.',
        'Even without touching, the force reaches across the gap. Paper bits jump up.',
      ],
      answer: 'Static electricity — the charged balloon attracts the paper through the air.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You hold two magnets close together — they JUMP apart. Are the facing poles the same or different?',
      expectedAnswer: 'same (like poles repel)',
      responseFormat: 'free',
      hints: ['Repel = push apart.', 'Like poles repel; opposite poles attract.'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-magnets-attract-all-metals',
      kind: 'misconception_check',
      question: 'A friend says "magnets stick to ALL metals." True?',
      commonErrors: [
        {
          answer: 'Yes — all metals.',
          misconception: 'Generalizing magnetism to all metals.',
          correctsTo: 'Magnets attract iron, steel, nickel, and a few others. NOT aluminum, copper, gold, silver. Try it — a magnet ignores an aluminum can.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Magnets attract iron/steel/nickel — not all metals.',
        'Like poles repel; opposite poles attract.',
        'Static electricity = built-up charge that pulls or pushes.',
        'Both forces work WITHOUT TOUCHING.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
