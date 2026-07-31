/**
 * Geometry — Measurement & Modeling: Surface Area & Volume of Prisms & Cylinders.
 *
 * One formula runs the whole family (CCSS G-GMD.A.1, G-GMD.A.3, G-MG.A.1):
 * V = Bh, where B is the area of the base. Cavalieri's principle extends it
 * to leaning solids, and surface area splits cleanly into two bases plus an
 * unrolled lateral rectangle. Numeric answers stay on plain integers; π and
 * radical forms live in the MCQ choices.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U10_PRISMS_CYLINDERS: LessonPlan = {
  id: 'evelyn.hs.geom.prisms-cylinders.v1',
  title: 'Surface Area & Volume: Prisms & Cylinders',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.prisms-cylinders',
      standard: 'GEOM-10.3',
      description:
        'Compute the volume and surface area of right and oblique prisms and cylinders using V = Bh and SA = 2B + Ph, justify the volume formula with Cavalieri\'s principle, and apply both to real-world modeling problems (CCSS G-GMD.A.1, G-GMD.A.3, G-MG.A.1).',
    },
  ],
  prerequisites: ['geom.circumference-arc-length-sector'],
  followUps: ['geom.pyramids-cones-spheres'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame prisms and cylinders as the shapes the built world is actually made of — and V = Bh as the single rule behind all of them.',
      script:
        'A shipping container, a grain silo, a swimming pool, a soup can, a steel I-beam — almost everything manufactured or built is a prism or a cylinder. Architects size heating systems by the volume of air in a room; a can company competes on how little aluminum it takes to hold the same volume. Both questions come down to two numbers you already know how to find: the area of the base and the height. Today those two numbers give you every volume and every surface area in this family — even when the solid leans.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-bh-and-surface-area',
      kind: 'concept',
      goal: 'V = Bh as one rule for the whole family, Cavalieri for oblique solids, and SA as two bases plus an unrolled rectangle.',
      keyIdeas: [
        'ONE VOLUME RULE — every prism and every cylinder has V = Bh, where B is the AREA of one base (square units) and h is the height. Rectangular prism: B = lw, so V = lwh. Triangular prism: B = ½(base)(height of the triangle). Cylinder: B = πr², so V = πr²h. Learn B, and the volume follows.',
        'WHICH FACE IS THE BASE — the bases are the two parallel congruent faces, not "whichever face is on the ground". A triangular prism resting on a rectangular side still has the TRIANGLES as its bases, and h is the distance between them.',
        'HEIGHT IS PERPENDICULAR — h is measured perpendicular to the bases. A slanted edge, a diagonal, or the length of a leaning axis is longer than h and never belongs in V = Bh.',
        'CAVALIERI\'S PRINCIPLE — if two solids have the same height and their cross-sections at every level have equal area, they have equal volume. Push a stack of coins sideways: every cross-section is still the same circle, so the leaning (oblique) stack holds exactly what the straight one held. That is why V = Bh works for oblique prisms and cylinders too.',
        'SURFACE AREA = 2 BASES + LATERAL — SA = 2B + Ph, where P is the PERIMETER of the base. Unroll the side faces of a right prism or cylinder and they flatten into one rectangle P wide and h tall, so lateral area = Ph. Cylinder: P = 2πr, giving SA = 2πr² + 2πrh.',
        'ERROR: DIAMETER FOR RADIUS — cylinder problems love to hand you the diameter (a can "6 cm across"). Halve it first. Using d in place of r makes the volume 4 times too large, because the radius gets squared.',
        'ERROR: UNITS — volume is CUBIC (cm³, ft³, m³); surface area is SQUARE (cm², ft²). Convert mixed units before substituting, never after. Capacity link: 1 cm³ = 1 mL, so 1000 cm³ = 1 L.',
        'SCALING — multiply every dimension of a solid by k and the surface area multiplies by k², the volume by k³. Doubling a can\'s dimensions needs 4 times the metal but holds 8 times the soup.',
      ],
      vocabulary: [
        { term: 'lateral area', definition: 'the combined area of the side faces of a solid, excluding the bases; for a right prism or cylinder it equals Ph.' },
        { term: 'oblique prism', definition: 'a prism whose lateral edges are not perpendicular to the bases — it leans, but its volume is still B times the perpendicular height.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-triangular-prism',
      kind: 'worked_example',
      problem:
        'A ramp is a right triangular prism. Its two triangular bases are right triangles with legs 9 cm and 12 cm and hypotenuse 15 cm, and the prism is 10 cm deep (the distance between the two triangles). Find the volume and the total surface area.',
      steps: [
        'Identify the bases: the two congruent triangles. Their area is B = ½(9)(12) = 54 cm². The height of the prism is the distance between them, h = 10 cm.',
        'Volume: V = Bh = 54 × 10 = 540 cm³ — cubic units, because it is a volume.',
        'Lateral area: the perimeter of the triangular base is P = 9 + 12 + 15 = 36 cm, so the three rectangular faces unroll into one 36 by 10 rectangle: Ph = 36 × 10 = 360 cm².',
        'Total surface area: SA = 2B + Ph = 2(54) + 360 = 108 + 360 = 468 cm². Sanity check: the two triangles are the small part of the total, and every surface-area unit is squared. ✓',
      ],
      answer: 'V = 540 cm³ and SA = 468 cm²',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-oblique-slant-trap',
      kind: 'worked_example',
      problem:
        'A leaning stack of poker chips forms an oblique cylinder. Each circular base has radius 4 in, the perpendicular distance between the bottom and top bases is 9 in, and the slanted axis of the stack measures 15 in. A student writes V = π(4)²(15) = 240π in³. Find the correct volume and explain the error.',
      steps: [
        'Name the error: 15 in is the SLANT — the length of the leaning axis — not the height. Straightening the stack shows it is the hypotenuse of a right triangle with legs 9 (the vertical rise) and 12 (the sideways lean).',
        'Apply Cavalieri\'s principle: at every level the cross-section is still a circle of radius 4, identical to the right cylinder of height 9. Equal cross-sections at equal heights → equal volumes, so leaning changes nothing.',
        'Base area: B = πr² = π(4)² = 16π in².',
        'Volume: V = Bh with the PERPENDICULAR height h = 9, so V = 16π × 9 = 144π in³ ≈ 452 in³. The student\'s 240π was inflated by using the slant.',
      ],
      answer: 'V = 144π in³ ≈ 452 in³ — the perpendicular height is 9 in, not the 15 in slant',
      estimatedMinutes: 3,
    },
    {
      id: 'try-cylinder-surface-area',
      kind: 'try_yourself',
      problem:
        'A cylindrical soup can is 6 cm across the top and 10 cm tall. What is its total surface area, in terms of π?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '78π cm²', correct: true },
        { id: 'b', text: '60π cm²' },
        { id: 'c', text: '69π cm²' },
        { id: 'd', text: '192π cm²' },
      ],
      expectedAnswer: '78π cm²',
      hints: [
        '"6 cm across" is the diameter — find the radius first, then use SA = 2πr² + 2πrh.',
        'r = 3, so the two bases give 2π(3)² = 18π and the lateral rectangle gives 2π(3)(10) = 60π. Add them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cavalieri-compare',
      kind: 'try_yourself',
      problem:
        'A right cylinder and an oblique cylinder each have circular bases of radius 5 cm, and for each one the perpendicular distance between the bases is 12 cm. The oblique cylinder\'s slanted axis measures 13 cm. How do their volumes compare?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Equal — both have volume 300π cm³', correct: true },
        { id: 'b', text: 'The oblique cylinder is larger: 325π cm³ versus 300π cm³' },
        { id: 'c', text: 'The right cylinder is larger, because leaning squeezes space out of a solid' },
        { id: 'd', text: 'Not enough information — an oblique cylinder needs a separate formula' },
      ],
      expectedAnswer: 'Equal — both have volume 300π cm³',
      hints: [
        'Compare the cross-sections at each level — are they the same circle in both solids?',
        'Cavalieri\'s principle: same height, equal cross-sections at every level → equal volume. Use h = 12, not the 13 slant.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'An aquarium is a rectangular prism 30 in long, 12 in wide, and 16 in tall. It is filled with water to a depth of 10 in. How many cubic inches of water are in the tank? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '3600',
      hints: [
        'The water itself is a rectangular prism. Its base is the bottom of the tank: B = 30 × 12.',
        'The height of the WATER is 10 in, not the 16 in height of the tank. Multiply 360 by 10.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-diameter',
      kind: 'misconception_check',
      question:
        'A student finds the volume of a cylindrical pipe that is 8 cm in diameter and 20 cm long, writing V = π(8)²(20) = 1280π cm³. What went wrong?',
      commonErrors: [
        {
          answer: '1280π cm³',
          misconception: 'Substituting the diameter into the formula wherever r appears, because the given number "is the width of the circle".',
          correctsTo:
            'Every circle formula uses the RADIUS. Diameter 8 → r = 4, so V = π(4)²(20) = 320π cm³ ≈ 1005 cm³. Because the radius is squared, using d instead of r inflates the answer by a factor of 4 — the fastest habit-fix is to write "r = ___" on the page before touching the formula.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'V = Bh for every prism and cylinder — find the base AREA first (lw, ½bh, or πr²), then multiply by the height.',
        'h is the PERPENDICULAR distance between the bases; slant lengths and leaning axes never go into V = Bh.',
        'Cavalieri\'s principle: same height plus equal cross-sections at every level → equal volume, so oblique solids use the same formula.',
        'SA = 2B + Ph — two bases plus the lateral surface unrolled into a P by h rectangle; cylinder: 2πr² + 2πrh.',
        'Halve the diameter before using it as r, and keep units straight: volume cubic, surface area square.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.3', cedTitle: 'Surface Area & Volume: Prisms & Cylinders' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
