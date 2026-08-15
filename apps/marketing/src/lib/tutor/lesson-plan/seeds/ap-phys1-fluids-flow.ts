/**
 * AP Physics 1 — Unit 8.4: Fluids and Conservation Laws.
 *
 * Continuity equation (mass conservation in flow), Bernoulli's equation
 * (energy conservation in flow), Torricelli's theorem.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYS1_FLUIDS_FLOW: LessonPlan = {
  id: 'evelyn.ap.physics1.fluids-flow.v1',
  title: 'Fluids — Continuity and Bernoulli',
  curriculum: 'CollegeBoard',
  grade: 'ap',
  subject: 'science',
  topic: 'ap-physics-1',
  locale: 'en',
  los: [
    {
      id: 'apphys1.fluids.flow',
      description: 'Apply the continuity equation and Bernoulli\'s equation to predict flow speeds and pressures in a moving fluid, and use Torricelli\'s theorem to find the speed of fluid leaving a hole.',
      standard: 'AP-PHYS1-8.4',
    },
  ],
  prerequisites: ['apphys1.fluids-buoyancy', 'apphys1.energy'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Why squeezing a hose makes water shoot faster, and why airplane wings generate lift.',
      script: 'Pinch a garden hose half-way and the water shoots out faster. Why? Same water, same flow rate, smaller pipe — so it has to speed up to keep up. That\'s the continuity equation. Now pair it with energy conservation and you get Bernoulli: fast-moving fluid has lower pressure. That\'s the trick that lifts airplanes, curves baseballs, and pulls a shower curtain inward when you turn the water on.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-continuity-bernoulli',
      kind: 'concept',
      goal: 'Continuity, Bernoulli, Torricelli, ideal-fluid assumptions.',
      keyIdeas: [
        'IDEAL FLUID assumptions for AP Phys 1: incompressible (ρ constant), non-viscous (no friction with walls), steady flow (velocity at any point is constant in time), no turbulence.',
        'CONTINUITY (mass conservation): for an incompressible fluid in a pipe of varying cross-section, A₁v₁ = A₂v₂. Volumetric flow rate Q = A·v is constant.',
        'INTUITION: the same volume per second has to pass every cross-section. Smaller A → faster v. Larger A → slower v.',
        'BERNOULLI\'S EQUATION (energy conservation per unit volume): P + ½ρv² + ρgy = constant along a streamline. Three terms: pressure (P), kinetic energy density (½ρv²), gravitational PE density (ρgy).',
        'BERNOULLI INTUITION: when fluid speeds up, KE term grows; if elevation y stays the same, the pressure term must shrink. Faster fluid → lower pressure.',
        'TORRICELLI\'S THEOREM: a small hole at depth h below an open tank\'s surface lets fluid escape at speed v = √(2gh). Same speed an object would reach falling height h. Comes from Bernoulli with P at surface = P at hole = atmospheric, surface velocity ≈ 0.',
        'COMMON APPLICATIONS: airplane lift (top of wing has faster flow → lower pressure → net upward force), Venturi meter (constriction speeds flow → drops pressure, lets you measure flow rate), spray atomizer, curveball.',
        'BERNOULLI PITFALLS: only along a single streamline; assumes no friction; can\'t use across a turbulent or viscous region. AP Phys 1 problems stay in the ideal-fluid regime.',
      ],
      vocabulary: [
        { term: 'continuity equation', definition: 'A₁v₁ = A₂v₂ for incompressible flow — mass conservation in a pipe.' },
        { term: 'Bernoulli\'s equation', definition: 'P + ½ρv² + ρgy = constant along a streamline — energy conservation per unit volume.' },
        { term: 'Torricelli\'s theorem', definition: 'speed of fluid escaping a hole at depth h below a free surface: v = √(2gh).' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-pipe',
      kind: 'worked_example',
      problem: 'Water flows through a horizontal pipe. The wide section has cross-sectional area 0.04 m² and the water moves at 1 m/s. The pipe narrows to 0.01 m² in another section. Find the speed in the narrow section, and the pressure difference between wide and narrow sections. (ρ = 1000 kg/m³.)',
      steps: [
        'CONTINUITY for speed: A₁v₁ = A₂v₂. 0.04 · 1 = 0.01 · v₂ → v₂ = 4 m/s.',
        'Pipe is horizontal, so y₁ = y₂ — gravity term cancels.',
        'BERNOULLI: P₁ + ½ρv₁² = P₂ + ½ρv₂².',
        'P₁ − P₂ = ½ρ(v₂² − v₁²) = ½·1000·(16 − 1) = 500 · 15 = 7500 Pa.',
        'Wide section has HIGHER pressure than narrow section by 7500 Pa.',
        'INTUITION CHECK: fluid sped up entering the narrow section. Speed-up requires a force pushing fluid forward → wide-side pressure must exceed narrow-side. Sign matches.',
      ],
      answer: 'v₂ = 4 m/s. Pressure in wide section is higher by 7500 Pa.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A water tank is open at the top. A small hole is punched in the side, 5 m below the water surface. At what speed does water leave the hole? (g = 10 m/s².)',
      expectedAnswer: '10',
      responseFormat: 'numeric',
      hints: [
        'Torricelli\'s theorem: v = √(2gh).',
        '√(2 · 10 · 5) = √100 = 10 m/s.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bernoulli',
      kind: 'misconception_check',
      question: 'A baseball curves because the spinning ball drags air faster around one side. Bernoulli says faster moving air has higher pressure, which pushes the ball to that side. True or false?',
      commonErrors: [
        {
          answer: 'true — fast air has more energy, so more pressure',
          misconception: 'Reversing the Bernoulli relationship.',
          correctsTo: 'False. Bernoulli says faster fluid has LOWER pressure (along a streamline at the same height). The spinning ball drags air faster on one side; that lower-pressure side pulls the ball toward it. Same logic explains airplane lift: faster air over the curved top of the wing means lower pressure above, so net upward force. The KE term in Bernoulli goes up; the pressure term must come down to keep total energy density constant.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Continuity: A₁v₁ = A₂v₂ for incompressible flow. Smaller area → faster speed.',
        'Bernoulli: P + ½ρv² + ρgy = const. Faster flow → lower pressure (at same height).',
        'Torricelli: v = √(2gh) for fluid leaving a hole at depth h.',
        'AP Phys 1 fluids are ideal: incompressible, non-viscous, steady, along a streamline.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Water flows from a wide tank through a narrowing pipe that descends 2 m before it exits. The tank surface is open to atmosphere; the exit is also at atmospheric pressure. The pipe entrance is at the bottom of the tank where flow speed is negligible. Find the exit speed.',
      hint: 'Bernoulli between tank surface (height y_top, v ≈ 0, P = P_atm) and exit (y_top − 2, v = ?, P = P_atm). Pressures cancel. ρgy_top = ½ρv² + ρg(y_top − 2). Solve: v² = 2g·2 = 40 → v ≈ 6.3 m/s. Same answer as Torricelli for h = 2 m.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
