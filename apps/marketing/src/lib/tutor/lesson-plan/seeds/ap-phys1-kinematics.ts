/**
 * AP Physics 1 — Kinematics in 1D and 2D.
 *
 * Position, velocity, acceleration; the four kinematic equations; projectile motion.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYS1_KINEMATICS: LessonPlan = {
  id: 'evelyn.ap.physics1.kinematics.v1',
  title: 'Kinematics in 1D and 2D',
  curriculum: 'NGSS',
  grade: 'ap',
  subject: 'science',
  topic: 'ap-physics-1',
  locale: 'en',
  los: [
    {
      id: 'apphys1.kinematics',
      description: 'Use kinematic equations to relate position, velocity, acceleration, and time for objects in 1D and projectile motion.',
      standard: 'AP-PHYS1-1.A',
    },
  ],
  prerequisites: ['phys.algebra-trig'],
  followUps: ['apphys1.newtons-second'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame kinematics as the language of motion before forces.',
      script: 'Forget WHY things move for a moment — first describe HOW. Position, velocity, acceleration. Four equations link them. Master those and you can predict where any object will be at any time, before you ever talk about forces.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-equations',
      kind: 'concept',
      goal: 'The four kinematic equations and when each applies.',
      keyIdeas: [
        'For CONSTANT acceleration only. If a changes, you split the motion into pieces or use calculus.',
        'EQ 1: v = v_0 + a·t  (no x). Use when time is known, position is not.',
        'EQ 2: x = x_0 + v_0·t + 0.5·a·t²  (no v_f). Use when final velocity is unknown.',
        'EQ 3: v² = v_0² + 2·a·(x − x_0)  (no t). Use when time is unknown.',
        'EQ 4: x = x_0 + 0.5·(v_0 + v)·t  (no a). Useful when acceleration is unknown.',
        'STRATEGY: list givens (v_0, v, a, t, Δx). The unknown is what you solve for. Pick the equation that has all knowns + the unknown and is missing the variable you don\'t have.',
        'PROJECTILES: x and y are independent. a_x = 0 (no horizontal acceleration), a_y = −g. Time of flight is the same for both axes.',
        'Free fall is just kinematics with a = −9.8 m/s².',
      ],
      vocabulary: [
        { term: 'velocity', definition: 'rate of change of position; vector quantity.' },
        { term: 'acceleration', definition: 'rate of change of velocity; vector quantity.' },
        { term: 'projectile', definition: 'an object in free flight with only gravity acting on it.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-stopping',
      kind: 'worked_example',
      problem: 'A car traveling at 30 m/s brakes with constant deceleration 6 m/s². How far does it travel before stopping?',
      steps: [
        'Givens: v_0 = 30 m/s, v = 0 (stops), a = −6 m/s². Unknown: Δx. No time given.',
        'Pick EQ 3 (no t): v² = v_0² + 2·a·Δx.',
        '0 = 30² + 2·(−6)·Δx.',
        '0 = 900 − 12·Δx.',
        'Δx = 900 / 12 = 75 m.',
      ],
      answer: 'Δx = 75 m',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A ball is dropped from rest from a 45 m cliff. How long until it hits the ground? (Use g = 10 m/s².)',
      expectedAnswer: '3 s',
      responseFormat: 'numeric',
      hints: [
        'Givens: v_0 = 0, a = −10, Δy = −45 m.',
        'Use EQ 2: Δy = v_0·t + 0.5·a·t².',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-velocity-acceleration',
      kind: 'misconception_check',
      question: 'If an object\'s velocity is zero at some instant, must its acceleration also be zero?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing instantaneous velocity with acceleration.',
          correctsTo: 'No. A ball thrown upward has v = 0 at the peak but a = −g still. Acceleration depends on FORCES, not on the current velocity. Velocity = 0 just means the object is momentarily not moving, not that it isn\'t accelerating.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four kinematic equations apply ONLY for constant acceleration.',
        'List givens, find the equation that contains them + your unknown.',
        'Projectiles: split into x (a=0) and y (a=−g) — same time of flight.',
        'v = 0 does NOT mean a = 0.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A ball is thrown UP from the ground at 20 m/s. How high does it go AND how long is it in the air? (g = 10 m/s².)',
      hint: 'At peak: v = 0. Use EQ 3 for height, EQ 1 for time-to-peak. Total flight = 2 × time-to-peak (symmetry).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
