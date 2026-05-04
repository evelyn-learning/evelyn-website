/**
 * GCSE Math Higher — Arcs, Sectors, and Segments.
 * Arc length, sector area, and segment area (sector minus triangle).
 */

import type { LessonPlan } from '../types';

export const SEED_GCSE_MATH_ARCS_SECTORS: LessonPlan = {
  id: 'evelyn.gcse.math.arcs-sectors.v1',
  title: 'GCSE Higher — Arcs, Sectors & Segments',
  curriculum: 'GCSE',
  grade: '10-11',
  subject: 'math',
  topic: 'gcse-math',
  locale: 'en-GB',
  los: [
    {
      id: 'gcse.math.arcs-sectors',
      description: 'Compute arc length, sector area, and segment area in degrees; combine with Pythagoras and trig where needed.',
      standard: 'GCSE-MATH-G18',
    },
  ],
  prerequisites: ['gcse.math.trig-exact-values'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Sector questions test your ability to scale circle facts by an angle fraction — a single idea repeated.',
      script: 'A circle has circumference 2πr and area πr². A sector is just a slice of that circle. Whatever fraction θ/360° the sector occupies of the full circle, that\'s the same fraction of the circumference (arc length) and area (sector area). One idea — three formulas.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-formulas',
      kind: 'concept',
      goal: 'Three formulas + segment as sector minus triangle.',
      keyIdeas: [
        'ARC LENGTH = (θ/360°) × 2πr where θ is the angle at the centre in degrees and r is the radius.',
        'SECTOR AREA = (θ/360°) × πr².',
        'PERIMETER OF SECTOR = arc length + 2r (two radii bounding the slice).',
        'SEGMENT = the bit of the sector cut off by the chord. Segment area = sector area − triangle area.',
        'TRIANGLE area inside sector = (1/2)r²·sin θ (using the formula ½ab sin C with a = b = r and included angle θ).',
        'CHORD LENGTH (when needed): use the cosine rule: chord² = r² + r² − 2r²cos θ = 2r²(1 − cos θ).',
        'EXACT VS DECIMAL: if θ is a special angle (60°, 90°, etc.), keep π and √ symbols throughout. If r is also "nice", final answer often comes out exactly.',
      ],
      vocabulary: [
        { term: 'arc', definition: 'a portion of the circumference of a circle.' },
        { term: 'sector', definition: 'the pie-slice region bounded by two radii and an arc.' },
        { term: 'segment', definition: 'the region of a circle bounded by a chord and the arc cut off by that chord.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-segment',
      kind: 'worked_example',
      problem: 'A circle has radius 10 cm. A chord subtends an angle of 60° at the centre. Find the area of the minor segment, in exact form.',
      steps: [
        'Sketch: sector with angle 60°, radius 10. The minor segment is the small region between the chord and the arc.',
        'Sector area = (60/360)·π·10² = (1/6)·100π = 100π/6 = 50π/3 cm².',
        'Triangle inside the sector: two sides = r = 10, included angle 60°. Area = (1/2)·10·10·sin 60° = 50·sin 60° = 50·(√3/2) = 25√3 cm².',
        'Segment area = sector − triangle = 50π/3 − 25√3 cm².',
        'Final: (50π/3) − 25√3 cm². (Approximate value ≈ 52.36 − 43.30 ≈ 9.06 cm² — sense-check: small region, single-digit area for a 10 cm radius. ✓)',
      ],
      answer: '(50π/3 − 25√3) cm²',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A sector has radius 8 cm and centre angle 45°. Find the arc length, leaving your answer in terms of π.',
      expectedAnswer: '2π cm',
      responseFormat: 'free',
      hints: [
        'Arc length = (θ/360) × 2πr.',
        '(45/360) × 2π × 8 = (1/8) × 16π.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-perimeter',
      kind: 'misconception_check',
      question: 'A student computes the perimeter of a sector by using only the arc length, forgetting the radii. Why is this wrong?',
      commonErrors: [
        {
          answer: 'Perimeter = arc length only',
          misconception: 'Treating a sector like a closed curve when in fact it has THREE sides.',
          correctsTo: 'A sector is bounded by TWO radii (the straight edges of the slice) and one arc. Perimeter = arc length + 2r. The sector area formula has a different role — it gives the area enclosed, not the boundary length. Always picture the slice: pizza slice has crust (arc) + two straight cuts (radii).',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Arc length = (θ/360)·2πr. Sector area = (θ/360)·πr².',
        'Sector perimeter = arc + 2r.',
        'Segment area = sector − (½r² sin θ).',
        'Special angles (60°, 90°, 30°) → keep π and √3 in exact answers.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A sector has radius r and angle θ. Show that the perimeter equals the area when θ (in degrees) and r satisfy a particular relationship. Give that relationship.',
      hint: 'Perimeter = (θ/360)·2πr + 2r = r[θπ/180 + 2]. Area = (θ/360)·πr² = r²·θπ/360. Setting equal: r[θπ/180 + 2] = r²·θπ/360 → divide by r: θπ/180 + 2 = rθπ/360 → multiply by 360: 2θπ + 720 = rθπ → r = (2θπ + 720)/(θπ) = 2 + 720/(θπ). So perimeter = area when r = 2 + 720/(θπ). For θ = 60°: r = 2 + 720/(60π) = 2 + 12/π ≈ 5.82.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
