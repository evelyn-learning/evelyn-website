/**
 * JEE Main Physics — Work, Energy, Power.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_PHYS_WORK_ENERGY_POWER: LessonPlan = {
  id: 'evelyn.jee.phys.work-energy-power.v1',
  title: 'JEE Physics — Work, Energy, Power',
  curriculum: 'NCERT',
  grade: '11',
  subject: 'sci',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.phys.work-energy-power',
      description: 'Apply work-energy theorem and conservation of mechanical energy; compute power; use spring potential energy.',
      standard: 'JEE-MAIN-PHY-WEP',
    },
  ],
  prerequisites: ['jee.phys.laws-motion'],
  followUps: ['jee.phys.gravitation'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Energy conservation often gives a one-line answer where Newton would need a long derivation.',
      script: 'A roller-coaster question: find the speed at the bottom of a loop given the start. Newton\'s laws would force you to integrate over a curved path. Energy conservation: PE_top + KE_top = PE_bottom + KE_bottom. Done.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-energy',
      kind: 'concept',
      goal: 'Definitions + work-energy theorem + conservation + spring PE + power.',
      keyIdeas: [
        'WORK W = F·d·cos θ where θ is angle between force and displacement. SI: joule = N·m.',
        'KINETIC ENERGY KE = (1/2)mv². Always non-negative.',
        'WORK-ENERGY THEOREM: W_net = ΔKE = (1/2)m·v_f² − (1/2)m·v_i². Net work changes kinetic energy.',
        'GRAVITATIONAL PE (near surface): U = mgh. Conservative force.',
        'SPRING PE: U_spring = (1/2)kx². k is spring constant; x is displacement from natural length.',
        'CONSERVATION OF MECHANICAL ENERGY: KE + PE = constant when only conservative forces act. KE_i + U_i = KE_f + U_f.',
        'NON-CONSERVATIVE FORCES (friction, drag): mechanical energy decreases by amount equal to work done by friction.',
        'POWER P = W/t (average) or P = F·v (instantaneous, for constant force parallel to velocity).',
        'JEE TRAP: when an object moves on a curved frictionless surface and you only need final speed, energy conservation gives it INSTANTLY. Save Newton for forces and accelerations.',
      ],
      vocabulary: [
        { term: 'work-energy theorem', definition: 'net work on an object equals the change in its kinetic energy.' },
        { term: 'conservative force', definition: 'a force whose work is path-independent; e.g. gravity, spring, electrostatic.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-energy-conservation',
      kind: 'worked_example',
      problem: 'A 0.5 kg ball is dropped from rest at height 5 m above a vertical spring (k = 1000 N/m). Find the maximum compression of the spring. (g = 10 m/s²)',
      steps: [
        'Energy conservation between start (ball at rest) and max compression (ball momentarily at rest).',
        'Initial state: KE = 0, gravitational PE = mgh = 0.5·10·5 = 25 J (taking ball\'s starting height).',
        'Final state at max compression x: KE = 0, gravitational PE has dropped by mg·(5 + x), spring PE = (1/2)kx².',
        'Energy conservation: 0 + 25 = (1/2)kx² − mg·(5 + x − 5)? Re-set reference: take height of max compression as zero. Initial PE = mg·(5 + x); Final PE = (1/2)kx². So mg(5 + x) = (1/2)kx².',
        '5(5 + x) = 500x² → 25 + 5x = 500x² → 500x² − 5x − 25 = 0 → 100x² − x − 5 = 0.',
        'Quadratic formula: x = (1 ± √(1 + 2000))/200 = (1 ± √2001)/200 ≈ (1 + 44.7)/200 ≈ 0.229 m.',
      ],
      answer: 'x ≈ 0.23 m',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A 2 kg block slides from rest down a frictionless incline of vertical height 10 m. Find its speed at the bottom. (g = 10 m/s²)',
      expectedAnswer: 'v = √200 = 10√2 ≈ 14.14 m/s',
      responseFormat: 'free',
      hints: [
        'Energy conservation: mgh = (1/2)mv².',
        'Mass cancels: v² = 2gh = 200.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-spring-formula',
      kind: 'misconception_check',
      question: 'A student computes the work done by a spring as W = F·x = kx·x = kx². What\'s wrong?',
      commonErrors: [
        {
          answer: 'W = kx² for spring',
          misconception: 'Using W = F·d with the maximum spring force, not the AVERAGE force during the deformation.',
          correctsTo: 'Spring force varies with x (F = kx). Work = ∫F dx from 0 to x = (1/2)kx². The factor of 1/2 comes from the linear ramp of force during the compression. Mnemonic: average spring force is kx/2 (zero at start, kx at end); work = F_avg · d = (kx/2)·x = (1/2)kx². Same result via integration.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'KE = (1/2)mv². W_net = ΔKE.',
        'Gravitational PE = mgh (near surface). Spring PE = (1/2)kx².',
        'Conservation: KE + PE = constant when only conservative forces act.',
        'Friction: ΔE_mech = −W_friction (negative).',
        'P = W/t = F·v.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A 1 kg ball is attached to a 2 m string and swung in a vertical circle. At the lowest point its speed is 6 m/s. Find the speed at the highest point. (g = 10 m/s²)',
      hint: 'Energy conservation: (1/2)·1·6² = (1/2)·1·v² + 1·10·4 (height difference 2r = 4). 18 = (1/2)v² + 40 → v² = −44. Negative! That means the ball doesn\'t have enough energy to reach the top — string would go slack first. Threshold: v_top² ≥ gr (centripetal) → v_top ≥ √20. So minimum bottom speed needs √(20 + 4·g·2·2) = √(20 + 80) = 10 m/s. Given 6 m/s is below threshold; ball won\'t complete the loop.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
