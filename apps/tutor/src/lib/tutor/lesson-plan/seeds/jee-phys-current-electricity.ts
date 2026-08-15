/**
 * JEE Main Physics — Current Electricity.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_PHYS_CURRENT_ELECTRICITY: LessonPlan = {
  id: 'evelyn.jee.phys.current-electricity.v1',
  title: 'JEE Physics — Current Electricity',
  curriculum: 'NCERT',
  grade: '12',
  subject: 'sci',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.phys.current-electricity',
      description: 'Apply Ohm\'s law, Kirchhoff\'s laws, series/parallel reduction, and Wheatstone bridge to JEE circuit problems.',
      standard: 'JEE-MAIN-PHY-CURR',
    },
  ],
  prerequisites: ['jee.phys.electrostatics'],
  followUps: ['jee.phys.magnetic-effects'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Circuit analysis is one of the most reliable JEE Physics topics — practice on Kirchhoff makes the trickiest networks tractable.',
      script: 'Pure series or parallel can be done by inspection. The interesting circuits combine both, or have multiple batteries. Kirchhoff\'s laws — current at junctions, voltage around loops — handle every case. Today\'s focus: when to apply each tool.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-circuits',
      kind: 'concept',
      goal: 'Ohm + Kirchhoff + series/parallel + Wheatstone + power.',
      keyIdeas: [
        'OHM\'S LAW: V = IR.',
        'POWER: P = VI = I²R = V²/R.',
        'SERIES: same I through all. R_eq = R₁ + R₂ + …',
        'PARALLEL: same V across all. 1/R_eq = 1/R₁ + 1/R₂ + …',
        'KCL (Kirchhoff Current Law): sum of currents into a junction = sum out. (Conservation of charge.)',
        'KVL (Kirchhoff Voltage Law): sum of voltage drops around any closed loop = sum of EMFs. (Conservation of energy.)',
        'EMF vs TERMINAL VOLTAGE: real battery has internal resistance r. Terminal voltage V = ε − Ir.',
        'WHEATSTONE BRIDGE: balanced when P/Q = R/S → no current through galvanometer. Used for precise resistance measurement.',
        'METER BRIDGE: practical Wheatstone using a uniform wire. Balance length determines unknown R.',
        'CELLS in SERIES: ε_eq = ε₁ + ε₂ (if same polarity); r_eq = r₁ + r₂.',
        'CELLS in PARALLEL (same EMF): ε_eq = ε; r_eq = r/n for n identical cells.',
        'JEE PROBLEM-SOLVING: Identify if pure series/parallel reduces. If not, use Kirchhoff with assumed currents in each branch.',
      ],
      vocabulary: [
        { term: 'EMF', definition: 'electromotive force; the open-circuit voltage of a battery.' },
        { term: 'Wheatstone bridge', definition: 'a circuit for measuring an unknown resistance by balancing four arms.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-circuit',
      kind: 'worked_example',
      problem: 'Two batteries (ε₁ = 12 V, r₁ = 1 Ω) and (ε₂ = 6 V, r₂ = 0.5 Ω) connected in parallel power a 4 Ω resistor. Find the current through the resistor.',
      steps: [
        'Two cells in parallel with different EMFs: not the simple ε_eq formula. Use Kirchhoff.',
        'Let i₁ = current from ε₁, i₂ = current from ε₂, i_R = current through 4 Ω. KCL: i₁ + i₂ = i_R.',
        'KVL loop with ε₁ and resistor: 12 = i₁·1 + i_R·4. → 12 = i₁ + 4i_R.',
        'KVL loop with ε₂ and resistor: 6 = i₂·0.5 + i_R·4. → 6 = 0.5i₂ + 4i_R.',
        'Solve: from KCL i₂ = i_R − i₁. Substitute: 6 = 0.5(i_R − i₁) + 4i_R → 6 = 0.5i_R − 0.5i₁ + 4i_R → 6 = 4.5i_R − 0.5i₁.',
        'From first KVL: i₁ = 12 − 4i_R.',
        'Substitute: 6 = 4.5i_R − 0.5(12 − 4i_R) = 4.5i_R − 6 + 2i_R = 6.5i_R − 6 → 12 = 6.5i_R → i_R = 24/13 ≈ 1.85 A.',
      ],
      answer: 'i_R ≈ 1.85 A',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Three resistors of 6 Ω each are connected in parallel. Find the equivalent resistance.',
      expectedAnswer: '2 Ω',
      responseFormat: 'numeric',
      hints: [
        '1/R = 1/6 + 1/6 + 1/6 = 3/6 = 1/2.',
        'R = 2 Ω.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-internal-resistance',
      kind: 'misconception_check',
      question: 'A battery rated 6 V has an internal resistance of 2 Ω. A student calculates the maximum current as 6/2 = 3 A and concludes that\'s the current when an external 4 Ω is connected. What\'s wrong?',
      commonErrors: [
        {
          answer: 'I = ε/r = 3 A',
          misconception: 'Ignoring external resistance when computing actual circuit current.',
          correctsTo: 'I = ε/r = 3 A is the SHORT-CIRCUIT current (battery alone). With external R = 4 Ω: total resistance = R + r = 4 + 2 = 6 Ω. Actual current I = ε/(R + r) = 6/6 = 1 A. The internal resistance limits short-circuit current; in normal use, the external load dominates.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'V = IR. P = VI = I²R = V²/R.',
        'Series: R_eq = sum. Parallel: 1/R_eq = sum of reciprocals.',
        'KCL: junction. KVL: loop.',
        'Real battery: V_terminal = ε − Ir.',
        'Wheatstone balanced: P/Q = R/S, galvanometer reads zero.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A 100 W bulb operates at 220 V. Find its resistance and the current.',
      hint: 'P = V²/R → R = V²/P = 220²/100 = 484 Ω. I = V/R = 220/484 ≈ 0.45 A. Or I = P/V = 100/220 ≈ 0.45 A. Both methods agree.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
