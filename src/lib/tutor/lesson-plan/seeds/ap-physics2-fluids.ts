/**
 * AP Physics 2 — Fluid statics and dynamics.
 *
 * Pressure, buoyancy (Archimedes), continuity, Bernoulli's equation.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYSICS2_FLUIDS: LessonPlan = {
  id: 'evelyn.ap.physics2.fluids.v1',
  title: 'Fluid statics and dynamics',
  curriculum: 'NGSS',
  grade: '12',
  subject: 'sci',
  topic: 'physics',
  locale: 'en',
  los: [
    {
      id: 'apphys2.fluids',
      description: 'Apply pressure, buoyancy, continuity, and Bernoulli\'s equation to fluid problems.',
      standard: 'AP-PHYS2-FLD',
    },
  ],
  prerequisites: ['phys.newtons-laws', 'phys.energy-conservation'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Three real puzzles fluids solve.',
      script: 'Why does a steel ship FLOAT but a steel coin SINK? Why does an airplane wing LIFT? Why does the bottom of a swimming pool feel STRONGER on your ears? Three puzzles, three fluid laws.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-laws',
      kind: 'concept',
      goal: 'Four key relationships + units + applications.',
      keyIdeas: [
        'PRESSURE: P = F/A. Units: Pascal (Pa) = N/m². Atmospheric pressure ~10⁵ Pa.',
        'PRESSURE DEPTH: P = P₀ + ρgh. ρ = density, g = 9.8, h = depth. Pressure increases linearly with depth in a fluid.',
        'BUOYANCY (Archimedes): an object in a fluid experiences upward force EQUAL to the weight of fluid DISPLACED. F_buoy = ρ_fluid · V_displaced · g.',
        'OBJECT FLOATS if its density < fluid density. (Steel ships float because their AVERAGE density — including the air-filled hull — is less than water.)',
        'CONTINUITY: A₁v₁ = A₂v₂ for incompressible flow. Narrower pipe → faster flow.',
        'BERNOULLI: P + (1/2)ρv² + ρgh = constant along a streamline. Faster flow → lower pressure.',
        'Bernoulli explains airplane LIFT (faster air over top of wing → lower pressure → lifted up).',
      ],
      vocabulary: [
        { term: 'pressure', definition: 'force per unit area.' },
        { term: 'buoyancy', definition: 'upward force on a submerged object equal to weight of displaced fluid.' },
        { term: 'streamline', definition: 'a path traced by a fluid particle in steady flow.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-buoyancy',
      kind: 'worked_example',
      problem: 'A 0.5 m³ wooden block (density 600 kg/m³) is submerged in water (density 1000 kg/m³). What\'s the buoyant force? Will it float?',
      steps: [
        'Buoyant force = ρ_water · V · g = 1000 · 0.5 · 9.8 = 4900 N.',
        'Weight = ρ_wood · V · g = 600 · 0.5 · 9.8 = 2940 N.',
        'Buoyant force (4900) > Weight (2940) → block FLOATS.',
        'Floating equilibrium: only enough block submerged so buoyancy = weight. V_submerged = 2940/(1000·9.8) = 0.3 m³ = 60% of block.',
        'So 60% submerged, 40% above water.',
      ],
      answer: 'F_buoy = 4900 N; floats with 60% submerged',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-bernoulli',
      kind: 'worked_example',
      problem: 'Water flows through a horizontal pipe. At point 1: A₁ = 0.01 m², v₁ = 2 m/s, P₁ = 200 kPa. At point 2 the pipe narrows to A₂ = 0.005 m². Find v₂ and P₂.',
      steps: [
        'CONTINUITY: A₁v₁ = A₂v₂ → 0.01·2 = 0.005·v₂ → v₂ = 4 m/s.',
        'BERNOULLI (horizontal, h same): P₁ + (1/2)ρv₁² = P₂ + (1/2)ρv₂².',
        '200000 + (1/2)(1000)(4) = P₂ + (1/2)(1000)(16).',
        '200000 + 2000 = P₂ + 8000.',
        'P₂ = 194000 Pa = 194 kPa.',
        'Faster flow at narrower spot → LOWER pressure. Confirms Bernoulli.',
      ],
      answer: 'v₂ = 4 m/s; P₂ = 194 kPa',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A 50 kg person stands on a 0.04 m² surface (about both feet). What pressure do they exert on the ground?',
      expectedAnswer: '12250 Pa or about 12.25 kPa',
      responseFormat: 'numeric',
      hints: [
        'P = F/A. Force = weight = mg = 50 · 9.8 = 490 N.',
        'P = 490 / 0.04 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-buoyancy-mass',
      kind: 'misconception_check',
      question: 'Does buoyancy depend on the mass of the object?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating buoyancy as related to object mass.',
          correctsTo: 'No — buoyancy depends on the WEIGHT OF FLUID DISPLACED, which depends on the object\'s VOLUME (and the fluid\'s density). A 1 kg lead ball and a 1 kg styrofoam block have very different volumes → different buoyancy. Mass of object matters for whether it sinks or floats, not for the buoyant force itself.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Pressure: P = F/A. Pa = N/m².',
        'Depth pressure: P = P₀ + ρgh.',
        'Buoyancy: F = ρ_fluid · V_displaced · g.',
        'Continuity: A₁v₁ = A₂v₂.',
        'Bernoulli: P + (1/2)ρv² + ρgh = constant.',
        'Faster flow → lower pressure (key for lift, atomizers, carburetors).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why doesn\'t an iceberg sink? About how much of it is below water?',
      hint: 'Ice is ~92% the density of water (917 vs 1000 kg/m³). Floats with about 92% submerged — ~8% visible above water. That\'s the "tip of the iceberg" idiom literally.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
