/**
 * AP Physics 1 — Unit 8.1 + 8.2: Density and Pressure.
 *
 * Internal structure of fluids, density, pressure, hydrostatic pressure
 * with depth, gauge vs absolute pressure, Pascal's principle (hydraulics).
 *
 * Aligned with the 2025-26 College Board CED. Fluids was added to AP
 * Physics 1 starting May 2025 (formerly in AP Physics 2).
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYS1_FLUIDS_DENSITY_PRESSURE: LessonPlan = {
  id: 'evelyn.ap.physics1.fluids-density-pressure.v1',
  title: 'Fluids — Density and Pressure',
  curriculum: 'CollegeBoard',
  grade: 'ap',
  subject: 'science',
  topic: 'ap-physics-1',
  locale: 'en',
  los: [
    {
      id: 'apphys1.fluids.density-pressure',
      description: 'Use density and pressure to relate force to area in fluid columns; apply hydrostatic pressure with depth and Pascal\'s principle to hydraulic systems.',
      standard: 'AP-PHYS1-8.1-8.2',
    },
  ],
  prerequisites: ['apphys1.newtons-second'],
  followUps: ['apphys1.fluids-buoyancy'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame fluids as a continuum where pressure replaces force as the natural variable.',
      script: 'A car jack lifts a 1500 kg car with one hand pump. A submarine 200 m down feels 20 atmospheres of pressure on every square centimeter. Both are fluids — and both follow two simple rules. Density says how much fluid sits in a given space, and pressure says how hard that fluid pushes. Get those two right and most fluid problems unfold.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-density-pressure',
      kind: 'concept',
      goal: 'Density, pressure, hydrostatic pressure, Pascal\'s principle.',
      keyIdeas: [
        'DENSITY ρ = m/V. Units kg/m³. Water ≈ 1000 kg/m³. Mercury ≈ 13,600 kg/m³. Air ≈ 1.2 kg/m³ (so air is ~830× less dense than water).',
        'PRESSURE P = F/A. Units pascals (1 Pa = 1 N/m²). Pressure acts perpendicular to any surface and in ALL directions through a fluid — there\'s no "side" to fluid pressure.',
        'HYDROSTATIC PRESSURE: pressure increases with depth. P = P₀ + ρgh, where P₀ is the pressure at the surface (often atmospheric) and h is depth below the surface. Same fluid, same depth → same pressure, regardless of container shape.',
        'GAUGE vs ABSOLUTE PRESSURE: gauge = P − P_atm (what your tire gauge reads). Absolute = total pressure. Hydrostatic ρgh is the GAUGE contribution — atmospheric pressure pushes down on the top.',
        'PASCAL\'S PRINCIPLE: pressure applied to a confined fluid is transmitted UNDIMINISHED throughout. Hydraulic system: F₁/A₁ = F₂/A₂. Big piston wins force; small piston moves further (volumes equal).',
        'AP TIP: pressure is a SCALAR (no direction). The FORCE that pressure produces on a surface IS a vector — perpendicular to the surface, magnitude P·A.',
        'WHY hydrostatic depends only on depth, not horizontal position: imagine a vertical column of fluid above a point. Its weight = ρ·V·g = ρ·A·h·g. Divided by area: ρ·g·h. The container\'s shape doesn\'t enter.',
      ],
      vocabulary: [
        { term: 'density', definition: 'mass per unit volume; ρ = m/V.' },
        { term: 'hydrostatic pressure', definition: 'pressure within a static fluid due to the weight of fluid above; P = ρgh.' },
        { term: 'Pascal\'s principle', definition: 'a pressure change applied to a confined fluid transmits undiminished throughout.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-hydraulic',
      kind: 'worked_example',
      problem: 'A hydraulic lift has a small piston with area 0.01 m² and a large piston with area 0.5 m². You apply 200 N to the small piston. What weight can the large piston support, and how far does the large piston rise when you push the small piston down 0.5 m?',
      steps: [
        'Pascal\'s principle: pressure is the same in both pistons. P₁ = P₂.',
        'P₁ = F₁/A₁ = 200/0.01 = 20,000 Pa.',
        'F₂ = P₂·A₂ = 20,000·0.5 = 10,000 N. (Multiplied force by 50× because the large piston is 50× the area.)',
        'Volume conservation: A₁·d₁ = A₂·d₂. 0.01·0.5 = 0.5·d₂ → d₂ = 0.01 m = 1 cm.',
        'TRADE-OFF: 50× the force, but only 1/50 the displacement. Total work in (200·0.5 = 100 J) equals work out (10,000·0.01 = 100 J). No free lunch.',
      ],
      answer: 'The large piston supports 10,000 N (≈1020 kg of weight) and rises 1 cm.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A diver swims to a depth of 20 m below the surface of a freshwater lake. What is the gauge pressure on the diver? (Use ρ_water = 1000 kg/m³, g = 10 m/s².)',
      expectedAnswer: '200000',
      responseFormat: 'numeric',
      hints: [
        'Gauge pressure = ρ·g·h.',
        '1000 · 10 · 20.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-shape',
      kind: 'misconception_check',
      question: 'Two open containers of water sit on a table. One is a tall thin cylinder, the other a wide shallow basin. Both are filled to a depth of 30 cm. Is the pressure at the bottom of the tall thin cylinder GREATER than at the bottom of the wide basin?',
      commonErrors: [
        {
          answer: 'yes — the tall cylinder has more weight pushing down per unit area',
          misconception: 'Confusing total weight with pressure.',
          correctsTo: 'No — pressure at the bottom is the same. P = ρgh depends only on the DEPTH, not on the container width or total volume. The tall cylinder has more total water, but spread over the same height. Pressure cares about the column directly above any point — not about water sitting horizontally elsewhere. This is the famous "hydrostatic paradox": a thin tall tube and a wide reservoir at the same depth feel identical pressure at the bottom.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Density ρ = m/V. Pressure P = F/A.',
        'Hydrostatic: P = P₀ + ρgh. Depth-only, container shape doesn\'t matter.',
        'Pascal: confined fluid transmits pressure undiminished. F₁/A₁ = F₂/A₂.',
        'Pressure is a scalar; the force it produces is a vector perpendicular to the surface.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A U-tube contains water on one side and an unknown fluid on the other. The water column is 24 cm tall above the meeting point; the unknown fluid is 30 cm tall. What is the density of the unknown fluid?',
      hint: 'Pressure at the U-tube bottom must equal from both sides. ρ_water · g · h_water = ρ_unknown · g · h_unknown. 1000 · 24 = ρ · 30 → ρ = 800 kg/m³ (lighter than water — perhaps an oil).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
