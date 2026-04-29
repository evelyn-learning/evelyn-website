/**
 * Grade 3 Science — Balanced and Unbalanced Forces.
 *
 * Builds on the K-2 push/pull foundation: introduces the idea that
 * forces can CANCEL each other (balanced) or ADD UP / OPPOSE (unbalanced),
 * and that ONLY unbalanced forces change an object's motion. Aligns
 * with NGSS 3-PS2-1 (investigate the effects of balanced and unbalanced
 * forces on the motion of an object) and 3-PS2-2 (predict future motion
 * from a pattern of past motion).
 *
 * Source: NGSS 3-PS2 Performance Expectations, OpenStax Grade 3 Science.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_SCI_FORCES_MOTION: LessonPlan = {
  id: 'evelyn.g3.science.physics.forces-motion.v1',
  title: 'Balanced and Unbalanced Forces',
  curriculum: 'NGSS',
  grade: '3',
  subject: 'science',
  topic: 'forces-and-motion',
  locale: 'en',
  los: [
    {
      id: 'ngss.3-ps2-1',
      description: 'Plan and conduct an investigation to provide evidence of the effects of balanced and unbalanced forces on the motion of an object.',
      standard: 'NGSS.3-PS2-1',
    },
    {
      id: 'ngss.3-ps2-2',
      description: 'Make observations and/or measurements of an object\'s motion to provide evidence that a pattern can be used to predict future motion.',
      standard: 'NGSS.3-PS2-2',
    },
  ],
  prerequisites: ['ngss.k-ps2-1', 'ngss.k-ps2-2'],
  followUps: ['ngss.ms-ps2-2'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the puzzle: two equal teams in a tug of war — why doesn\'t the rope move?',
      script: 'Picture a tug of war. Two teams pull as hard as they can on opposite ends of the rope. The rope barely moves. Why? Each team is pulling — both forces are real. So what gives?',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-balance',
      kind: 'concept',
      goal: 'When opposite forces are equal in size, they CANCEL each other — net force is zero, and the object stays at rest (or keeps doing what it was doing).',
      keyIdeas: [
        'Forces have a SIZE (how strong) and a DIRECTION (which way).',
        'When two forces are EQUAL and OPPOSITE, they cancel — we call this BALANCED.',
        'Balanced forces don\'t change the motion. The rope stays still; a book on a table stays still.',
        'When forces are UNEQUAL, the bigger one wins — this is UNBALANCED.',
        'Unbalanced forces CHANGE motion: speed up, slow down, or change direction.',
      ],
      vocabulary: [
        { term: 'balanced forces', definition: 'forces that are equal in size and opposite in direction — they cancel.' },
        { term: 'unbalanced forces', definition: 'forces that don\'t cancel — there\'s a "winner" that changes the motion.' },
        { term: 'net force', definition: 'the leftover force after opposite forces cancel.' },
      ],
      suggestedTools: ['show_free_body_diagram', 'show_labeled_image'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-tug-of-war',
      kind: 'worked_example',
      problem: 'In a tug of war, the red team pulls with 200 N and the blue team pulls with 200 N in the opposite direction. Then the blue team adds another player and now pulls with 250 N. Which way does the rope move in each case?',
      steps: [
        'First case: 200 N each, opposite directions. The forces are EQUAL → balanced → net force = 0 → rope doesn\'t move.',
        'Second case: 200 N vs 250 N. The forces are UNEQUAL → unbalanced. Subtract: 250 − 200 = 50 N net force toward the blue team.',
        'A 50 N unbalanced force toward blue means the rope MOVES toward the blue team.',
      ],
      answer: 'First: rope stays still. Second: rope moves toward blue (net 50 N).',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A book sits on a table. Gravity pulls it DOWN with 10 N. The table pushes UP with 10 N. Are the forces balanced or unbalanced? Will the book move?',
      expectedAnswer: 'balanced; the book stays still',
      responseFormat: 'free',
      hints: [
        'Compare the size and direction of the two forces.',
        'If they cancel, what does that mean for the book\'s motion?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-no-force-no-motion',
      kind: 'misconception_check',
      question: 'A student says "if the forces are balanced, that means there are NO forces acting on the object." Is that right?',
      commonErrors: [
        {
          answer: 'Yes — balanced means no forces.',
          misconception: 'Confusing "balanced" with "no force at all".',
          correctsTo: 'Balanced means EQUAL and OPPOSITE forces. Both forces are still real and present — they just cancel out, so the NET force is zero.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Forces have size AND direction.',
        'Balanced = equal + opposite → no change in motion.',
        'Unbalanced = there\'s a winner → motion changes.',
        'A still object can have BIG forces on it — they just cancel.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A car is moving down a flat road at a steady speed. The engine pushes it forward. The air pushes it backward (drag). If the speed isn\'t changing, what does that tell you about the forces?',
      hint: 'Steady speed means no change in motion — what kind of forces produce that?',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
