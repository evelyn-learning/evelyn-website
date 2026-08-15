/**
 * JEE Main Physics — Kinematics (1D + 2D + Projectile).
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_PHYS_KINEMATICS: LessonPlan = {
  id: 'evelyn.jee.phys.kinematics.v1',
  title: 'JEE Physics — Kinematics',
  curriculum: 'NCERT',
  grade: '11',
  subject: 'sci',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.phys.kinematics',
      description: 'Apply 1D and 2D kinematics equations; solve projectile motion problems including range, max height, time of flight.',
      standard: 'JEE-MAIN-PHY-KIN',
    },
  ],
  prerequisites: ['jee.physics-strategy'],
  followUps: ['jee.phys.laws-motion'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Kinematics is the easiest scoring topic in JEE — but easy to lose marks via vector mistakes or sign errors.',
      script: 'JEE Main almost always asks 1-2 kinematics problems, often projectile motion or relative velocity. The math is straightforward; the trap is choosing axes and signs consistently. Master that and these become free marks.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-kinematics',
      kind: 'concept',
      goal: 'SUVAT equations, projectile formulas, relative velocity.',
      keyIdeas: [
        '1D SUVAT (constant acceleration): v = u + at; s = ut + (1/2)at²; v² = u² + 2as; s = ((u + v)/2)t.',
        'GRAVITY: a = −g downward (g ≈ 9.8 or 10 m/s² for JEE). Sign depends on chosen positive direction.',
        '2D KINEMATICS: x and y components evolve INDEPENDENTLY. Use SUVAT separately on each axis.',
        'PROJECTILE (launched at angle θ with initial speed u): horizontal velocity u·cos θ (constant); vertical u·sin θ (decreases under gravity).',
        'TIME OF FLIGHT: T = 2u sin θ / g. MAX HEIGHT: H = (u sin θ)² / (2g). RANGE: R = u² sin(2θ) / g.',
        'MAXIMUM RANGE at θ = 45°. Same range achievable from complementary angles θ and (90° − θ).',
        'GRAPH SLOPE INTERPRETATION: position-time slope = velocity. Velocity-time slope = acceleration. Area under v-t graph = displacement.',
        'RELATIVE VELOCITY: v_AB = v_A − v_B (vector). Boat-river problems and observer problems all use this.',
        'JEE TRAP: a particle moving with constant SPEED on a curved path has nonzero acceleration (centripetal). Speed and velocity are different things.',
      ],
      vocabulary: [
        { term: 'projectile', definition: 'an object launched into the air, subject only to gravity afterwards.' },
        { term: 'relative velocity', definition: 'velocity of one object as observed from another reference frame: v_AB = v_A − v_B.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-projectile',
      kind: 'worked_example',
      problem: 'A projectile is fired at 20 m/s at 60° above horizontal. Find time of flight, max height, and range. (g = 10 m/s²)',
      steps: [
        'Initial velocity components: u_x = 20·cos 60° = 10 m/s. u_y = 20·sin 60° = 10√3 ≈ 17.32 m/s.',
        'Time of flight: T = 2·u_y/g = 2·17.32/10 = 3.46 s.',
        'Max height: H = u_y²/(2g) = (17.32)²/20 = 300/20 = 15 m.',
        'Range: R = u_x · T = 10 · 3.46 = 34.6 m. (Or R = u² sin(2·60°)/g = 400·sin 120°/10 = 400·(√3/2)/10 = 20√3 ≈ 34.6 m.)',
      ],
      answer: 'T ≈ 3.46 s; H = 15 m; R ≈ 34.6 m',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A stone is dropped from a 45 m tower. Find the time to reach the ground and the speed of impact. (g = 10 m/s²)',
      expectedAnswer: 'Time = 3 s; speed = 30 m/s',
      responseFormat: 'free',
      hints: [
        'Initial velocity 0; use s = (1/2)g·t².',
        '45 = (1/2)·10·t² → t² = 9 → t = 3 s.',
        'v = g·t = 30 m/s.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-projectile-vertical',
      kind: 'misconception_check',
      question: 'A projectile is at maximum height. A student says the velocity at this point is zero. Correct?',
      commonErrors: [
        {
          answer: 'v = 0 at max height',
          misconception: 'Confusing the VERTICAL component (which is zero at max) with the TOTAL velocity (which is not).',
          correctsTo: 'At max height, ONLY the vertical component v_y = 0. The horizontal component v_x = u·cos θ remains constant throughout the flight (no horizontal force). So total speed at max height = u·cos θ ≠ 0 (unless launched straight up). The projectile is moving horizontally at the apex.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SUVAT: 5 equations, 5 variables. Pick the one with your knowns and unknown.',
        'Projectile T = 2u sin θ/g; H = (u sin θ)²/(2g); R = u² sin(2θ)/g.',
        'Max range at 45°. Complementary angles give same range.',
        'At max height: v_y = 0; v_x = u·cos θ (still moving horizontally).',
        'Relative velocity: v_AB = v_A − v_B (vectors).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A boat can travel at 5 m/s in still water. The river flows at 3 m/s. To cross perpendicular to the banks, in what direction should the boat be steered, and what is the resultant speed?',
      hint: 'Boat\'s velocity (relative to water) must have a component upstream cancelling river flow. Let θ be angle upstream from across-the-river: 5·sin θ = 3 → sin θ = 3/5 → θ = 37° (using 3-4-5 triangle). Resultant across-the-river speed = 5·cos θ = 4 m/s.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
