/**
 * AP Calculus BC — CED Unit 4.2: Straight-Line Motion (Position,
 * Velocity, Acceleration).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U4_MOTION: LessonPlan = {
  id: 'evelyn.ap.calcbc.straight-line-motion.v1',
  title: 'U4.2 Straight-Line Motion',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.straight-line-motion',
      description:
        'Connect position s(t), velocity v(t) = s\'(t), and acceleration a(t) = v\'(t) = s\'\'(t). Distinguish speed |v| from velocity, identify when a particle moves left/right, and find when velocity / acceleration are zero.',
      standard: 'AP-CALCBC-4.2',
    },
  ],
  prerequisites: ['apcalcbc.derivative-in-context'],
  followUps: ['apcalcbc.related-rates'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame motion as the prototypical application of derivatives.',
      script:
        "Position changes over time = velocity. Velocity changes over time = acceleration. The derivative IS the math of motion. AP exam questions consistently test whether you can read a position function and answer all the kinematic questions: when is the particle moving right? When is it speeding up? When is it momentarily at rest?",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-motion',
      kind: 'concept',
      goal: 'Cover s, v, a relationships + speed vs velocity + when speeding up.',
      keyIdeas: [
        'POSITION s(t): location of the particle at time t. Sign convention: positive direction is "right" or "up"; negative is "left" or "down".',
        'VELOCITY v(t) = s\'(t). Derivative of position. SIGN of v tells direction: v > 0 = moving right; v < 0 = moving left; v = 0 = momentarily at rest.',
        'ACCELERATION a(t) = v\'(t) = s\'\'(t). Second derivative of position. Tells whether velocity is increasing or decreasing.',
        'SPEED = |v(t)| = absolute value of velocity. Always non-negative. "How fast" without direction.',
        'WHEN IS THE PARTICLE SPEEDING UP / SLOWING DOWN? Speeding up when v and a have the SAME SIGN (both positive: moving right and accelerating right; both negative: moving left and accelerating left). Slowing down when v and a have OPPOSITE SIGNS (moving right but decelerating, or moving left but decelerating).',
        'KEY DISTINCTION: positive acceleration does NOT mean speeding up. If v < 0 and a > 0, the particle is moving left but decelerating (slowing down). Speeding up depends on AGREEMENT of signs.',
        'PARTICLE AT REST: when v(t) = 0. Solve s\'(t) = 0 to find times when this happens.',
        'CHANGES DIRECTION when v changes sign — i.e., when v(t) = 0 AND v changes sign across that t.',
        'TOTAL DISTANCE TRAVELED ≠ DISPLACEMENT. Displacement = s(t_end) − s(t_start). Total distance accounts for direction changes — sum of the absolute value of velocity over time intervals (covered in Unit 8).',
      ],
      vocabulary: [
        { term: 'velocity', definition: 'v(t) = s\'(t); signed rate of change of position.' },
        { term: 'speed', definition: '|v(t)|; magnitude of velocity, always non-negative.' },
        { term: 'acceleration', definition: 'a(t) = v\'(t) = s\'\'(t); rate of change of velocity.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-particle',
      kind: 'worked_example',
      problem:
        'A particle moves along a line with position s(t) = t³ − 6t² + 9t (meters, t ≥ 0 in seconds). (a) Find v(t) and a(t). (b) When is the particle at rest? (c) When does the particle change direction? (d) When is the particle speeding up?',
      steps: [
        'STEP 1 — DERIVATIVES. v(t) = s\'(t) = 3t² − 12t + 9 = 3(t² − 4t + 3) = 3(t − 1)(t − 3). a(t) = v\'(t) = 6t − 12 = 6(t − 2).',
        'STEP 2 — AT REST. v(t) = 0 ⟹ (t−1)(t−3) = 0 ⟹ t = 1 or t = 3.',
        'STEP 3 — DIRECTION CHANGES. v changes sign at t = 1 and t = 3 (verify by sign-checking on either side). For 0 ≤ t < 1: v > 0 (e.g. v(0) = 9). For 1 < t < 3: v < 0 (e.g. v(2) = -3). For t > 3: v > 0 (e.g. v(4) = 9). So the particle CHANGES DIRECTION at t = 1 (from right to left) and at t = 3 (from left to right).',
        'STEP 4 — SPEEDING UP. Need to find when v and a have the same sign. a = 6(t − 2). a > 0 for t > 2; a < 0 for t < 2; a = 0 at t = 2.',
        'STEP 5 — INTERVAL ANALYSIS. (i) 0 < t < 1: v > 0, a < 0 → opposite signs → SLOWING DOWN. (ii) 1 < t < 2: v < 0, a < 0 → same sign → SPEEDING UP. (iii) 2 < t < 3: v < 0, a > 0 → opposite signs → SLOWING DOWN. (iv) t > 3: v > 0, a > 0 → same sign → SPEEDING UP.',
        'STEP 6 — ANSWER. Speeding up on (1, 2) ∪ (3, ∞).',
      ],
      answer: '(a) v = 3t² − 12t + 9, a = 6t − 12. (b) t = 1, t = 3. (c) Direction changes at t = 1 and t = 3. (d) Speeding up on (1, 2) ∪ (3, ∞).',
      estimatedMinutes: 6,
    },
    {
      id: 'try-particle',
      kind: 'try_yourself',
      problem:
        's(t) = t² − 6t + 5. Find (a) v(t), (b) a(t), (c) when at rest, (d) when moving right, (e) when speeding up.',
      expectedAnswer:
        '(a) v(t) = 2t − 6. (b) a(t) = 2. (c) v = 0 at t = 3. (d) v > 0 when t > 3. (e) v and a have same sign: a = 2 > 0 always, v > 0 when t > 3. So speeding up for t > 3. Slowing down for 0 ≤ t < 3 (v < 0, a > 0).',
      responseFormat: 'numeric',
      hints: ['Compute v and a; analyze signs.'],
      estimatedMinutes: 4,
    },
    {
      id: 'try-direction',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. A particle has v(t) = -2 m/s and a(t) = +3 m/s². (a) Is the particle speeding up or slowing down? (b) In which direction is it moving?',
      expectedAnswer:
        '(a) v < 0, a > 0. Opposite signs → SLOWING DOWN. (b) v < 0 → moving in the NEGATIVE direction (left, by convention). The particle is moving left but its velocity is increasing (getting less negative), so it\'s decelerating in the leftward direction. Eventually v will reach 0 and the particle will reverse direction.',
      responseFormat: 'frq',
      hints: ['Speeding up = same sign of v and a. Direction = sign of v.'],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'v(t) = s\'(t), a(t) = v\'(t) = s\'\'(t).',
        'Speed = |v|. Velocity is signed; speed is non-negative.',
        'Speeding up ⟺ v and a have SAME sign. Slowing down ⟺ opposite.',
        'At rest: v = 0. Direction change: v changes sign at v = 0 point.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.2',
    cedTitle: 'Straight-Line Motion',
    sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '3', note: 'Standard kinematics treatment.' }],
  },
};
