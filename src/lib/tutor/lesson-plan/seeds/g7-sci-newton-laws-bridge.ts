/**
 * G7 — Newton's Three Laws (middle-school synthesis).
 *
 * Inertia, F = ma, action-reaction. Sets up HS physics treatment.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SCI_NEWTON_LAWS_BRIDGE: LessonPlan = {
  id: 'evelyn.g7.sci.physical.newtons-laws-intro.v1',
  title: 'Newton\'s three laws of motion',
  curriculum: 'NGSS',
  grade: '7',
  subject: 'sci',
  topic: 'physical-science',
  locale: 'en',
  los: [
    {
      id: 'ngss.ms-ps2.b',
      description: 'Apply Newton\'s Third Law to design a solution to a problem involving the motion of two colliding objects.',
      standard: 'NGSS.MS-PS2-1',
    },
  ],
  prerequisites: [],
  followUps: ['ngss.hs-ps2.a'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Newton\'s laws as the rules of motion.',
      script: 'In 1687, Isaac Newton wrote down THREE rules that describe how every object moves — from a falling apple to planets orbiting the sun. Three short rules. Hundreds of years later, they still hold.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-laws',
      kind: 'concept',
      goal: 'Each law\'s statement, intuition, and example.',
      keyIdeas: [
        'FIRST LAW (INERTIA): An object at REST stays at rest, and an object in MOTION stays in motion (in a straight line at constant speed) UNLESS acted on by a net force.',
        'INERTIA = an object\'s tendency to keep doing what it\'s doing. More mass → more inertia.',
        'EXAMPLE: a hockey puck on smooth ice keeps gliding because friction is tiny. On grass, friction stops it quickly.',
        'SECOND LAW: F = m × a. The net force on an object equals its mass times its acceleration.',
        'EXAMPLE: pushing a heavy cart vs an empty one with the same force → the empty one accelerates more.',
        'THIRD LAW: For every action, there is an EQUAL and OPPOSITE reaction.',
        'EXAMPLE: when you jump, you push DOWN on the Earth — Earth pushes back UP on you with equal force. The Earth doesn\'t visibly move only because it\'s so massive.',
        'COMMON misconception: 3rd law forces don\'t cancel out, because they act on DIFFERENT objects (one on you, one on Earth).',
      ],
      vocabulary: [
        { term: 'inertia', definition: 'an object\'s tendency to keep doing what it\'s doing.' },
        { term: 'force', definition: 'a push or pull on an object.' },
        { term: 'net force', definition: 'the SUM of all forces acting on an object.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-jumping',
      kind: 'worked_example',
      problem: 'When you JUMP UP off the ground, what is the action-reaction pair?',
      steps: [
        'Action: you push DOWN on the Earth (with your legs).',
        'Reaction: Earth pushes UP on you with equal force.',
        'You ACCELERATE upward (small mass, big force on you → big acceleration).',
        'Earth accelerates downward — but with mass ~6×10²⁴ kg, the acceleration is undetectable.',
        'Both forces are EQUAL in size, OPPOSITE in direction, on DIFFERENT objects.',
      ],
      answer: 'you push down on Earth; Earth pushes up on you with equal and opposite force',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You push two carts with the same force. Cart A is empty (5 kg); Cart B is loaded (20 kg). Which accelerates more?',
      expectedAnswer: 'Cart A (empty)',
      responseFormat: 'free',
      hints: [
        'F = m·a. Same F, different m.',
        'a = F/m. Smaller m → bigger a.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-third-law-cancel',
      kind: 'misconception_check',
      question: 'If action and reaction are equal and opposite, do they CANCEL each other so nothing moves?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating action-reaction pairs as canceling.',
          correctsTo: 'No — the two forces act on DIFFERENT objects. To check if forces cancel for ONE object, look at all the forces ON that object. The 3rd law pair is on TWO objects, so it doesn\'t cancel motion of either.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '1st law (inertia): no force → no change in motion.',
        '2nd law: F = m·a.',
        '3rd law: forces come in equal-and-opposite PAIRS, on different objects.',
        'Heavy objects need more force to accelerate.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A rocket launches by burning fuel and shooting hot gas DOWN. Which law explains how it lifts off?',
      hint: 'Third law. The rocket pushes gas down → gas pushes rocket UP with equal force. Same logic as jumping, but on a much bigger scale.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
