/**
 * Geometry — Measurement: Circumference, Arc Length & Sector Area.
 *
 * One idea carries the whole lesson (CCSS G-GMD.A.1, G-MG.A.1): a central
 * angle of θ° claims θ/360 of the circle, so an arc is that fraction of the
 * circumference and a sector is that fraction of the area. The two errors
 * that eat the most points get equal billing — swapping arc MEASURE
 * (degrees) for arc LENGTH (units), and feeding the diameter into a formula
 * that wants the radius. Numeric work stays on plain-number setups; π
 * answers live in the multiple-choice items.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U10_CIRCUMFERENCE_ARC_LENGTH_SECTOR: LessonPlan = {
  id: 'evelyn.hs.geom.circumference-arc-length-sector.v1',
  title: 'Circumference, Arc Length & Sector Area',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.circumference-arc-length-sector',
      standard: 'GEOM-10.2',
      description:
        'Compute circumference and circle area, and use the central angle as a fraction of 360° to find arc length and sector area, distinguishing arc measure in degrees from arc length in units (CCSS G-GMD.A.1, G-MG.A.1).',
    },
  ],
  prerequisites: ['geom.area-polygons'],
  followUps: ['geom.prisms-cylinders'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the fraction-of-a-circle idea as the everyday tool behind track staggers, pizza slices, and curved architecture.',
      script:
        'Why do runners in a 400-meter race start at staggered positions instead of side by side? Because the outer lanes curve around a bigger circle — same turn, longer arc. Every fan-shaped window, every pizza slice, every sweep of a sprinkler is the same question: how much of a circle did I take, and how long or how big is that piece? Today the whole lesson runs on one sentence — a central angle of θ degrees claims θ over 360 of the circle. Everything else is that fraction times the circumference, or that fraction times the area.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-arc-sector',
      kind: 'concept',
      goal: 'Circumference and area, the θ/360 fraction, and the two errors that ruin most answers.',
      keyIdeas: [
        'THE TWO WHOLE-CIRCLE FORMULAS — circumference C = 2πr = πd (a length, measured in cm, ft, m) and area A = πr² (a region, measured in cm², ft², m²). π is the constant ratio of circumference to diameter, the same number for every circle in the world.',
        'THE ONE BIG IDEA: FRACTION OF 360 — a central angle (vertex at the center) of θ° cuts off θ/360 of the entire circle. So arc length = (θ/360) × 2πr and sector area = (θ/360) × πr². A 90° angle takes a quarter; a 60° angle takes a sixth. Learn the fraction, not four separate formulas.',
        'ARC MEASURE ≠ ARC LENGTH — the MEASURE of an arc is its central angle, reported in degrees, and it does not depend on how big the circle is. The LENGTH of an arc is a distance, reported in units, and it grows with the radius. A 60° arc in a radius-5 circle and a 60° arc in a radius-15 circle have the SAME measure and three times different lengths.',
        'TRAP: DIAMETER FED IN AS RADIUS — problems love to hand you the diameter ("a 20-foot circular garden"). Halve it first. Using d in place of r doubles a length answer and QUADRUPLES an area answer.',
        'TRAP: WRONG FORMULA, WRONG UNITS — arc length is linear in r, sector area uses r². If your arc answer carries square units, or your sector answer carries plain units, you grabbed the wrong formula. Units are a free error check on every problem.',
        'EXACT VS APPROXIMATE — leave the answer in terms of π (like 2π cm) unless the problem asks for a decimal; only then substitute π ≈ 3.14. Rounding early and then multiplying spreads the rounding error through the whole answer.',
        'WHY THE RATIO MATTERS — for a fixed central angle, arc length divided by radius is the SAME number in every circle. That constant ratio is exactly what radian measure names later, and it is the reason similar circular shapes scale so cleanly.',
      ],
      vocabulary: [
        { term: 'arc length', definition: 'the distance along a circle between the two endpoints of an arc — a length in units, not a degree measure.' },
        { term: 'sector', definition: 'the "pie slice" region of a circle bounded by two radii and the arc between them.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-arc-and-sector',
      kind: 'worked_example',
      problem:
        'A circle has center O and radius 9 cm. Points A and B lie on the circle so that central angle ∠AOB measures 40°. Find the length of arc AB and the area of sector AOB, in exact form.',
      steps: [
        'Find the fraction of the circle: the central angle is 40°, so the piece is 40/360 = 1/9 of the whole circle.',
        'Whole circumference: C = 2πr = 2π(9) = 18π cm. Arc length = (1/9) × 18π = 2π cm.',
        'Whole area: A = πr² = π(9²) = 81π cm². Sector area = (1/9) × 81π = 9π cm².',
        'Check the units: the arc came out in cm (a length) and the sector in cm² (a region). ✓ Note the arc MEASURE is 40°, while the arc LENGTH is 2π cm — two different quantities.',
      ],
      answer: 'Arc AB = 2π cm; sector AOB = 9π cm²',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-diameter-trap',
      kind: 'worked_example',
      problem:
        'A circular garden has a diameter of 20 ft. A sprinkler at the center sweeps a 90° sector. A student computes the watered area as (90/360) × π × 20² = 100π ft². Find the correct area and explain the error.',
      steps: [
        'Read the given quantity carefully: 20 ft is the DIAMETER, not the radius. The radius is r = 20/2 = 10 ft.',
        'The student substituted the diameter into A = πr², squaring 20 instead of 10 — and since 20² = 400 is four times 10² = 100, the answer came out 4 times too big.',
        'Correct fraction and area: 90/360 = 1/4, and the whole circle is π(10²) = 100π ft². Sector area = (1/4) × 100π = 25π ft².',
        'Bonus check on the wet edge: arc length = (1/4) × 2π(10) = (1/4) × 20π = 5π ft. Squaring a diameter is the single most expensive slip in circle problems — halve first, always.',
      ],
      answer: '25π ft² — the student used the diameter 20 as the radius, quadrupling the area',
      estimatedMinutes: 3,
    },
    {
      id: 'try-arc-length',
      kind: 'try_yourself',
      problem:
        'A circle has center P and radius 12 in. A central angle of 30° cuts off arc QR. What is the length of arc QR, in exact form?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2π in', correct: true },
        { id: 'b', text: '12π in²' },
        { id: 'c', text: '24π in' },
        { id: 'd', text: '4π in' },
      ],
      expectedAnswer: '2π in',
      hints: [
        'Arc length = (θ/360) × 2πr — start by simplifying the fraction 30/360.',
        '30/360 = 1/12 and the whole circumference is 2π(12) = 24π, so the arc is (1/12) × 24π.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-measure-vs-length',
      kind: 'try_yourself',
      problem:
        'Circle J has radius 5 cm and circle K has radius 15 cm. Each circle has a central angle of 60° cutting off an arc. Which statement about the two arcs is true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The arcs have the same measure, 60°, but the arc in circle K is three times as long.', correct: true },
        { id: 'b', text: 'The arcs have the same measure and the same length.' },
        { id: 'c', text: 'The arc in circle K has three times the measure and three times the length.' },
        { id: 'd', text: 'The arcs have the same length, but the arc in circle K has a larger measure.' },
      ],
      expectedAnswer: 'The arcs have the same measure, 60°, but the arc in circle K is three times as long.',
      hints: [
        'Arc measure is just the central angle in degrees — does it depend on the radius at all?',
        'Arc length = (60/360) × 2πr, so tripling r triples the length while the 60° measure stays put.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A circle has a circumference of 72 cm. An arc of this circle measures 20 cm in length. What is the measure of the central angle that cuts off this arc, in degrees? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '100',
      hints: [
        'The arc is 20/72 of the whole circumference, and the central angle claims that same fraction of 360°.',
        '20/72 simplifies to 5/18, and (5/18) × 360 gives the angle.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-degrees-as-length',
      kind: 'misconception_check',
      question:
        'Asked for the LENGTH of an arc cut off by an 80° central angle in a circle of radius 9, a student answers "80". What went wrong?',
      commonErrors: [
        {
          answer: '80',
          misconception:
            'Reporting the arc MEASURE (the central angle, in degrees) as the arc LENGTH, as if degrees were a distance.',
          correctsTo:
            'The arc measure is 80°; the arc LENGTH is a distance that depends on the radius: (80/360) × 2π(9) = (2/9) × 18π = 4π units. Degrees tell you what fraction of the circle you have — you still have to multiply that fraction by the circumference to get a length.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Whole circle: C = 2πr = πd (a length) and A = πr² (a region) — check units to confirm which one you needed.',
        'A central angle of θ° claims θ/360 of the circle: arc length = (θ/360) × 2πr, sector area = (θ/360) × πr².',
        'Arc measure is degrees and ignores the radius; arc length is a distance and grows with the radius — never report one for the other.',
        'If the problem gives a diameter, halve it first — using d for r doubles a length and quadruples an area.',
        'Leave π in the answer unless a decimal is requested; the same fraction idea runs backward to solve for θ or r.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.2', cedTitle: 'Circumference, Arc Length & Sector Area' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
