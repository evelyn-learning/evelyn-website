/**
 * Grades 11-12 Math — Trigonometry: Law of Sines and Law of Cosines.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_MATH_TRIG_LAWS_SIN_COS: LessonPlan = {
  id: 'evelyn.g1112.math.trig.laws-sin-cos.v1',
  title: 'Trigonometry — Law of Sines and Law of Cosines',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'trigonometry',
  locale: 'en',
  los: [
    {
      id: 'g1112.math.trig.laws-sin-cos',
      description: 'Use the Law of Sines and Law of Cosines to solve oblique (non-right) triangles.',
      standard: 'CCSS.MATH.CONTENT.HSG.SRT.D.10-11',
    },
  ],
  prerequisites: ['g1112.math.trig.right-triangle'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'SOHCAHTOA only handles right triangles. The Laws of Sines/Cosines extend trig to ANY triangle.',
      script: 'A surveyor wants to find the distance across a lake. They can\'t draw a right triangle there — but they can measure two angles and a side from a known position. The Law of Sines does the rest. Today: when each law applies and how to avoid the ambiguous case.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-laws',
      kind: 'concept',
      goal: 'Both laws, when each applies, the SSA ambiguous case, area formula.',
      keyIdeas: [
        'LABEL CONVENTION: in triangle ABC, side a is opposite angle A, side b opposite angle B, side c opposite angle C.',
        'LAW OF SINES: a/sin A = b/sin B = c/sin C. (Equivalent: sin A / a = sin B / b = sin C / c.)',
        'LAW OF SINES applies when you know:',
        '  AAS or ASA — two angles + one side.',
        '  SSA — two sides + non-included angle (the AMBIGUOUS case — see below).',
        'LAW OF COSINES: c² = a² + b² − 2ab cos C.',
        'Generalises Pythagoras (when C = 90°, cos C = 0, recovers c² = a² + b²).',
        'LAW OF COSINES applies when you know:',
        '  SAS — two sides + included angle (find the third side).',
        '  SSS — all three sides (find an angle).',
        'AMBIGUOUS CASE (SSA): given two sides and a non-included angle, the triangle may not exist, may be unique, or may have two distinct solutions. Always check by:',
        '  1. Computing sin B from Law of Sines.',
        '  2. If sin B > 1, no triangle.',
        '  3. If sin B = 1, one right triangle.',
        '  4. If sin B < 1, find both possible angles: B₁ = sin⁻¹(...) and B₂ = 180° − B₁. Check whether each leaves a valid third angle (sum < 180°).',
        'AREA FORMULA: Area = (1/2)ab sin C — when you know two sides and the included angle.',
      ],
      vocabulary: [
        { term: 'oblique triangle', definition: 'a triangle that is NOT a right triangle (no 90° angle).' },
        { term: 'ambiguous case', definition: 'an SSA configuration that may correspond to 0, 1, or 2 distinct triangles; requires careful checking.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'In triangle ABC, A = 35°, B = 70°, a = 12. Find side b. (AAS case.)',
      steps: [
        'Two angles and one opposite side ⟹ Law of Sines.',
        'a / sin A = b / sin B ⟹ 12 / sin 35° = b / sin 70°.',
        'sin 35° ≈ 0.5736; sin 70° ≈ 0.9397.',
        'b = 12 × (sin 70° / sin 35°) = 12 × (0.9397 / 0.5736) ≈ 12 × 1.638 ≈ 19.66.',
        'Sanity check: B > A (70° > 35°), so b should be longer than a. 19.66 > 12 ✓.',
      ],
      answer: 'b ≈ 19.66',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In triangle ABC, sides a = 8, b = 5, and angle C = 60°. Find side c. (SAS case.)',
      expectedAnswer: 'SAS ⟹ Law of Cosines. c² = a² + b² − 2ab cos C = 64 + 25 − 2(8)(5)(0.5) = 89 − 40 = 49. c = 7.',
      responseFormat: 'free',
      hints: [
        'SAS = use Law of Cosines, NOT Law of Sines.',
        'cos 60° = 0.5 (exact).',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-ssa',
      kind: 'misconception_check',
      question: 'A student is given a = 6, b = 8, A = 30° (SSA), uses Law of Sines, and reports a single angle B. What did they miss?',
      commonErrors: [
        {
          answer: 'Reports only one B',
          misconception: 'Treating SSA as having a unique solution.',
          correctsTo: 'SSA is the AMBIGUOUS case. Compute sin B from Law of Sines: sin B = b sin A / a = 8 sin 30° / 6 = 4/6 = 2/3. Then B₁ = sin⁻¹(2/3) ≈ 41.81° and B₂ = 180° − 41.81° = 138.19°. CHECK each: B₁ → C = 180° − 30° − 41.81° = 108.19° (valid); B₂ → C = 180° − 30° − 138.19° = 11.81° (also valid). TWO valid triangles. Always check the supplement when the SSA-derived sine is less than 1.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'AAS, ASA, SSA → Law of Sines (a/sinA = b/sinB).',
        'SAS, SSS → Law of Cosines (c² = a² + b² − 2ab cos C).',
        'SSA is ambiguous: compute both possible angles, check validity.',
        'Area = (1/2)ab sin C when two sides + included angle known.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
