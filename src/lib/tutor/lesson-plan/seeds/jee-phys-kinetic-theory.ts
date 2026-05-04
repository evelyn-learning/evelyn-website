/**
 * JEE Main Physics — Kinetic Theory of Gases.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_PHYS_KINETIC_THEORY: LessonPlan = {
  id: 'evelyn.jee.phys.kinetic-theory.v1',
  title: 'JEE Physics — Kinetic Theory of Gases',
  curriculum: 'NCERT',
  grade: '11',
  subject: 'sci',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.phys.kinetic-theory',
      description: 'Apply the ideal gas law, kinetic-theory pressure formula, equipartition of energy, and degrees of freedom to JEE problems.',
      standard: 'JEE-MAIN-PHY-KT',
    },
  ],
  prerequisites: ['jee.phys.work-energy-power'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Kinetic theory bridges micro (molecule speeds) and macro (pressure, temperature) — JEE loves this connection.',
      script: 'Pressure on the walls of a container comes from molecules colliding. Temperature is just the average kinetic energy. Once you accept those two ideas, formulas like P = (1/3)·n·m·v_rms² fall out — and JEE problems become substitution exercises.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-kt',
      kind: 'concept',
      goal: 'Ideal gas law + kinetic pressure + speeds + equipartition.',
      keyIdeas: [
        'IDEAL GAS LAW: PV = nRT (n = moles, R = 8.314 J/(mol·K)) = NkT (N = molecules, k = 1.38 × 10⁻²³ J/K).',
        'KINETIC PRESSURE: P = (1/3)·(N/V)·m·v_rms². Pressure proportional to average squared speed.',
        'TEMPERATURE: (1/2)m·v_rms² = (3/2)kT. Translational KE per molecule = (3/2)kT.',
        'SPEEDS: v_rms = √(3kT/m) = √(3RT/M) (M = molar mass). v_avg = √(8kT/(πm)). v_mp (most probable) = √(2kT/m). Order: v_mp < v_avg < v_rms.',
        'DEGREES OF FREEDOM (DoF) f: monatomic 3 (translation only). Diatomic (rigid) 5 (3 trans + 2 rot). Diatomic at high T also vibration: 7.',
        'EQUIPARTITION: each DoF contributes (1/2)kT per molecule, or (1/2)RT per mole.',
        'INTERNAL ENERGY: U = (f/2)·nRT.',
        'SPECIFIC HEATS: C_v = (f/2)R; C_p = C_v + R = ((f+2)/2)R. Ratio γ = C_p/C_v = (f+2)/f.',
        'JEE TRAP: γ for monatomic = 5/3 ≈ 1.67. For diatomic (rigid) = 7/5 = 1.4. Check the gas type before plugging.',
      ],
      vocabulary: [
        { term: 'rms speed', definition: 'root-mean-square speed: v_rms = √(3kT/m); the speed entering the kinetic-pressure formula.' },
        { term: 'equipartition', definition: 'each quadratic degree of freedom contributes (1/2)kT to average energy at temperature T.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-rms',
      kind: 'worked_example',
      problem: 'Find v_rms of oxygen molecules at 300 K. (M = 32 g/mol = 32 × 10⁻³ kg/mol; R = 8.314)',
      steps: [
        'v_rms = √(3RT/M) = √(3·8.314·300 / 0.032).',
        'Numerator: 3 · 8.314 · 300 = 7482.6.',
        'Divide by 0.032: 233 831.',
        'v_rms = √233 831 ≈ 484 m/s.',
      ],
      answer: 'v_rms ≈ 484 m/s',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A monatomic ideal gas at 300 K. Find the average translational KE per molecule. (k = 1.38 × 10⁻²³ J/K)',
      expectedAnswer: '6.21 × 10⁻²¹ J',
      responseFormat: 'numeric',
      hints: [
        'KE = (3/2)kT.',
        '(3/2)·(1.38e−23)·300 = 6.21e−21.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-temperature',
      kind: 'misconception_check',
      question: 'A student says "doubling the temperature doubles the rms speed of gas molecules." Correct?',
      commonErrors: [
        {
          answer: 'Doubling T doubles v_rms',
          misconception: 'Treating v_rms as linear in T when it actually scales with √T.',
          correctsTo: 'v_rms = √(3RT/M) — proportional to √T, not T. Doubling T multiplies v_rms by √2 ≈ 1.414. To DOUBLE v_rms, you would need to QUADRUPLE T. Same scaling: kinetic energy IS linear in T (KE ∝ T), but speed depends on √(KE).',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'PV = nRT = NkT.',
        'KE_trans per molecule = (3/2)kT.',
        'v_rms = √(3RT/M) ∝ √T.',
        'Equipartition: each DoF contributes (1/2)kT.',
        'γ = (f+2)/f. Monatomic 5/3, diatomic rigid 7/5.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Compare v_rms of hydrogen (M = 2) and oxygen (M = 32) at the same temperature.',
      hint: 'v_rms ∝ 1/√M (at fixed T). Ratio v_H/v_O = √(M_O/M_H) = √(32/2) = √16 = 4. Hydrogen is FOUR TIMES faster on average. (Why hydrogen escapes Earth\'s atmosphere over geological time.)',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
