/**
 * AP Physics 1 — Unit 8.3: Fluids and Newton's Laws (Buoyancy).
 *
 * Archimedes' principle, buoyant force, floating vs sinking, force balance
 * on submerged and partially-submerged objects.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYS1_FLUIDS_BUOYANCY: LessonPlan = {
  id: 'evelyn.ap.physics1.fluids-buoyancy.v1',
  title: 'Fluids — Buoyancy and Archimedes\' Principle',
  curriculum: 'CollegeBoard',
  grade: 'ap',
  subject: 'science',
  topic: 'ap-physics-1',
  locale: 'en',
  los: [
    {
      id: 'apphys1.fluids.buoyancy',
      description: 'Apply Archimedes\' principle and Newton\'s second law to predict whether an object floats, sinks, or hangs at neutral buoyancy in a fluid.',
      standard: 'AP-PHYS1-8.3',
    },
  ],
  prerequisites: ['apphys1.fluids-density-pressure', 'apphys1.newtons-second'],
  followUps: ['apphys1.fluids-flow'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Why a 100,000-ton steel ship floats while a thumbnail-sized steel ball sinks.',
      script: 'Same material, opposite outcomes. The reason isn\'t about steel — it\'s about how much WATER each object pushes out of the way. Push out enough water and the upward "buoyant" force matches the object\'s weight; you float. Push out too little and gravity wins. Archimedes figured this out in his bathtub 2200 years ago, and it\'s still the cleanest one-line rule in fluid mechanics.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-archimedes',
      kind: 'concept',
      goal: 'Archimedes\' principle, buoyant force formula, floating condition.',
      keyIdeas: [
        'ARCHIMEDES\' PRINCIPLE: the buoyant force on an object in a fluid equals the WEIGHT of the fluid it DISPLACES.',
        'FORMULA: F_b = ρ_fluid · V_displaced · g. ρ is the fluid\'s density, V_displaced is the volume of fluid pushed out of the way (NOT the object\'s total volume unless fully submerged).',
        'FULLY SUBMERGED: V_displaced = V_object. Buoyant force = ρ_fluid · V_object · g.',
        'FLOATING: object is partially submerged. V_displaced is just the underwater portion. At equilibrium, F_b = m_object · g, so the object sinks until it has displaced its own weight in fluid.',
        'COMPARING DENSITIES: object floats if ρ_object < ρ_fluid. Sinks if ρ_object > ρ_fluid. Hangs at any depth (neutral buoyancy) if exactly equal.',
        'FRACTION SUBMERGED for a floater: V_submerged / V_total = ρ_object / ρ_fluid. An iceberg in seawater has ρ_ice/ρ_seawater ≈ 920/1025 ≈ 0.9 → 90% submerged, "tip of the iceberg" is real.',
        'NEWTON\'S 2ND ON A SUBMERGED OBJECT: ΣF = m·a. Forces are gravity (down) and buoyancy (up), plus any tension/applied force. If submerged + at rest, T or F_applied = (m·g − F_b).',
        'APPARENT WEIGHT in water: weight − buoyant force. A 70 kg person mostly underwater has apparent weight near zero.',
      ],
      vocabulary: [
        { term: 'buoyant force', definition: 'the upward force a fluid exerts on an immersed object, equal to the weight of fluid displaced.' },
        { term: 'displaced volume', definition: 'the volume of fluid pushed out of the way by an object.' },
        { term: 'neutral buoyancy', definition: 'when buoyant force exactly cancels gravity, so the object hangs at any depth.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-iceberg',
      kind: 'worked_example',
      problem: 'A wooden block of density 600 kg/m³ floats in fresh water (1000 kg/m³). What fraction of the block is submerged?',
      steps: [
        'At equilibrium, buoyant force = weight. ρ_fluid · V_submerged · g = ρ_object · V_total · g.',
        'Cancel g and rearrange: V_submerged / V_total = ρ_object / ρ_fluid.',
        '= 600 / 1000 = 0.6.',
        '60% of the block is below the waterline; 40% is above.',
        'GENERALIZATION: fraction submerged = density ratio. The denser the floater (relative to the fluid), the deeper it rides.',
      ],
      answer: '60% submerged.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A solid sphere of volume 0.001 m³ and mass 5 kg is fully submerged in water (ρ = 1000 kg/m³). Compute the buoyant force on it. Will it sink or rise when released? (g = 10 m/s².)',
      expectedAnswer: '10',
      responseFormat: 'numeric',
      hints: [
        'F_b = ρ_fluid · V · g for a fully submerged object.',
        '1000 · 0.001 · 10. Then compare to weight m·g = 50 N.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-volume',
      kind: 'misconception_check',
      question: 'A small steel ball and a large beach ball are both placed in a swimming pool. Both are fully submerged. The buoyant force on the beach ball is greater. True or false?',
      commonErrors: [
        {
          answer: 'false — buoyancy depends on weight, and the beach ball is lighter',
          misconception: 'Confusing buoyant force with net force or with object weight.',
          correctsTo: 'TRUE. Buoyant force depends on VOLUME displaced, not on the object\'s weight or material. The beach ball displaces more water (it\'s bigger), so the buoyant force on it is larger. The beach ball still rises rapidly because its WEIGHT is small — the NET force (buoyant − gravity) is huge for the beach ball, modest for the steel ball. Don\'t confuse buoyant force (which depends only on displaced fluid) with net force (which depends on weight too).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'F_b = ρ_fluid · V_displaced · g. Displaced volume = the underwater portion.',
        'Float / sink test: compare ρ_object to ρ_fluid.',
        'Floater fraction submerged = ρ_object / ρ_fluid.',
        'Buoyant force depends on volume + fluid density, NOT on the object\'s mass.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A boat displaces 2000 kg of water when floating. You drop a 50 kg anchor that was on the boat into the water (it sinks to the bottom). Does the water level in the lake rise, fall, or stay the same?',
      hint: 'On the boat: the 50 kg anchor displaced 50 kg of water = 0.05 m³ (its weight in water). Sunk: it now displaces only its own VOLUME of water, much smaller (steel is ~7800 kg/m³ → 50/7800 ≈ 0.006 m³). Less displacement when sunk → water level FALLS slightly. Counterintuitive but correct.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
