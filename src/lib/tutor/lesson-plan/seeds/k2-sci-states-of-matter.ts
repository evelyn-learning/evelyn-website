/**
 * K-2 Science — States of Matter (Solid, Liquid, Gas).
 *
 * NGSS 2-PS1-1: classify materials based on their observable
 * properties. Concrete examples (ice, water, steam; rock, juice, air)
 * before any molecular-level explanation. The molecular picture comes
 * in middle school — at this level it's "what holds its shape?"
 *
 * Source: NGSS 2-PS1, OpenStax K-2 Science.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_SCI_STATES_OF_MATTER: LessonPlan = {
  id: 'evelyn.k2.science.physics.states-of-matter.v1',
  title: 'Solids, Liquids, and Gases',
  curriculum: 'NGSS',
  grade: 'K-2',
  subject: 'science',
  topic: 'matter',
  locale: 'en',
  los: [
    {
      id: 'ngss.2-ps1-1',
      description: 'Plan and conduct an investigation to describe and classify different kinds of materials by their observable properties.',
      standard: 'NGSS.2-PS1-1',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.5-ps1-1', 'ngss.ms-ps1-4'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the puzzle of water existing in three forms.',
      script: 'Think about water. Sometimes it\'s ICE (you can hold it). Sometimes it\'s a LIQUID you can drink. Sometimes it\'s STEAM rising from a hot pot. Same stuff — three different forms. How is that possible?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-states',
      kind: 'concept',
      goal: 'Matter comes in three everyday forms — solid, liquid, gas — distinguished by shape and how it fills a container.',
      keyIdeas: [
        'SOLID — keeps its own shape. A rock, an apple, a block of ice.',
        'LIQUID — takes the shape of its container, but you can see its surface. Water in a cup, juice in a glass.',
        'GAS — fills its whole container, often invisible. Air, steam, the gas in a balloon.',
        'A solid is HARD or AT LEAST FIRM (you can pick it up).',
        'A liquid POURS.',
        'A gas FLOATS AROUND and you usually can\'t see it.',
      ],
      vocabulary: [
        { term: 'solid', definition: 'matter with its own shape.' },
        { term: 'liquid', definition: 'matter that pours and takes the shape of its container.' },
        { term: 'gas', definition: 'matter that fills its container, usually invisible.' },
        { term: 'matter', definition: 'anything that takes up space and has weight.' },
      ],
      suggestedTools: ['show_labeled_image'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-classify-three-things',
      kind: 'worked_example',
      problem: 'Which is which? (1) A wooden chair, (2) milk in a cup, (3) the air in a balloon. Classify each as solid, liquid, or gas.',
      steps: [
        'Wooden chair — has its own SHAPE that doesn\'t change. SOLID.',
        'Milk in a cup — POURS, takes the cup\'s shape. LIQUID.',
        'Air in a balloon — FILLS the whole balloon, you can\'t see it. GAS.',
      ],
      answer: '(1) solid, (2) liquid, (3) gas',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Is honey a solid, a liquid, or a gas?',
      expectedAnswer: 'liquid',
      responseFormat: 'free',
      hints: [
        'Does it keep its own shape? Or does it pour and take the shape of the jar?',
        'It pours slowly, but it still pours — that\'s the test.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-gas-not-real',
      kind: 'misconception_check',
      question: 'A friend says "gas isn\'t really there because you can\'t see it." Is that right?',
      commonErrors: [
        {
          answer: 'Yes — invisible means not there.',
          misconception: 'Confusing "invisible" with "doesn\'t exist".',
          correctsTo: 'Gas is real even though we can\'t see it. You can FEEL the wind on your face — that\'s air (a gas) moving. Smoke is gas you CAN see, briefly. A balloon stays inflated because gas inside pushes out.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Solid keeps its shape.',
        'Liquid takes the shape of its container — pours.',
        'Gas fills its container, usually invisible.',
        'Same stuff (like water) can be all three at different temperatures.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
