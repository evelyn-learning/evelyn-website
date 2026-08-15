/**
 * G10 — Geometry: Volume of solids (prism, cylinder, pyramid, cone,
 * sphere).
 *
 * The five canonical 3D-shape volume formulas. Built on a common
 * pattern: "base area × height" for prisms and cylinders;
 * "(1/3) × base × height" for the pointy versions (pyramid, cone);
 * "(4/3)πr³" for the sphere as the odd one out.
 */

import type { LessonPlan } from '../types';

export const SEED_G10_GEOM_VOLUME_SOLIDS: LessonPlan = {
  id: 'evelyn.g10.math.geometry.volume-solids.v1',
  title: 'Volume of 3D Solids',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'math',
  topic: 'volume',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsg.gmd.a.1',
      description: 'Give an informal argument for the formulas for the volume of a cylinder, pyramid, and cone.',
      standard: 'CCSS.MATH.CONTENT.HSG.GMD.A.1',
    },
    {
      id: 'ccss.math.hsg.gmd.a.3',
      description: 'Use volume formulas for cylinders, pyramids, cones, and spheres to solve problems.',
      standard: 'CCSS.MATH.CONTENT.HSG.GMD.A.3',
    },
  ],
  prerequisites: ['ccss.math.5.md.c.5'],
  followUps: ['ccss.math.hsg.mg.a.2'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a "fill the cone, pour into the cylinder" demo to motivate the 1/3 factor.',
      script: 'Take a cone and a cylinder with the SAME base and SAME height. Fill the cone with water and pour it into the cylinder. Repeat. Three pours fill the cylinder exactly. That\'s where the 1/3 in cone volume comes from — and the same 1/3 shows up for any pyramid vs its matching prism.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-five-formulas',
      kind: 'concept',
      goal: 'The five volume formulas with a unifying pattern.',
      keyIdeas: [
        'PRISM (any flat-base solid with constant cross-section): V = (base area) × height.',
        '  Rectangular prism (box): V = ℓwh.',
        '  Triangular prism: V = (1/2 base × height of triangle) × length of prism.',
        'CYLINDER (a round prism): V = πr² × height.',
        'PYRAMID: V = (1/3) × (base area) × height. The 1/3 is because a pyramid fits 3 times into the matching prism.',
        'CONE (a round pyramid): V = (1/3)πr² × height.',
        'SPHERE: V = (4/3)πr³. Notice the cube of r — volume always scales like r³ for similar shapes.',
        'Units: volume is always CUBIC (cm³, ft³, m³). Diameter goes in formulas only after you halve it to get r.',
      ],
      vocabulary: [
        { term: 'prism', definition: 'a 3D shape with two parallel congruent bases and rectangular sides.' },
        { term: 'pyramid', definition: 'a 3D shape with a polygon base and triangular sides meeting at a point.' },
        { term: 'cone', definition: 'a 3D shape with a circular base and a single point apex.' },
        { term: 'sphere', definition: 'a perfectly round 3D shape — every surface point equidistant from center.' },
      ],
      suggestedTools: ['show_geometry_constructed', 'show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cylinder',
      kind: 'worked_example',
      problem: 'A soup can has radius 4 cm and height 10 cm. Find its volume.',
      steps: [
        'Cylinder formula: V = πr²h.',
        'Substitute: V = π(4²)(10) = π(16)(10) = 160π.',
        'Decimal: 160 × 3.14 ≈ 502.4.',
        'Volume ≈ 502.4 cm³.',
      ],
      answer: '160π ≈ 502.4 cm³',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-cone',
      kind: 'worked_example',
      problem: 'An ice-cream cone has radius 3 cm and height 12 cm. Find its volume.',
      steps: [
        'Cone formula: V = (1/3)πr²h.',
        'Substitute: V = (1/3)π(3²)(12) = (1/3)π(9)(12) = (1/3)π(108) = 36π.',
        'Decimal: 36 × 3.14 ≈ 113.1 cm³.',
      ],
      answer: '36π ≈ 113.1 cm³',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A sphere has radius 6 cm. Find its volume in terms of π.',
      expectedAnswer: '288π',
      responseFormat: 'free',
      hints: [
        'V = (4/3)πr³.',
        'r³ = 216. (4/3) × 216 = 288. Answer: 288π.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-diameter-in-formula',
      kind: 'misconception_check',
      question: 'A cylinder has DIAMETER 10 and height 8. Sage computes V = π(10²)(8) = 800π. What\'s wrong?',
      commonErrors: [
        {
          answer: 'nothing',
          misconception: 'Using diameter directly where the formula calls for radius.',
          correctsTo: 'Wrong. The formula needs r, not d. Radius = 10/2 = 5. V = π(5²)(8) = π(25)(8) = 200π. Sage\'s answer is 4× too big — exactly the (d/r)² factor (since the formula squares the radius).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Prism / cylinder: V = base area × height.',
        'Pyramid / cone: V = (1/3) × base area × height — pointy version of the prism.',
        'Sphere: V = (4/3)πr³.',
        'Use RADIUS, not diameter, in the formulas.',
        'Cubic units always.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A cone and a cylinder have the same radius and height. The cylinder has volume 90 cm³. What is the cone\'s volume?',
      hint: 'Cone is 1/3 of the matching cylinder. 90 / 3 = 30 cm³.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
