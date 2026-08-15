/**
 * Geometry — Measurement & Modeling: Volume: Pyramids, Cones & Spheres.
 *
 * The pointy solids and the round one (CCSS G-GMD.A.1, G-GMD.A.3,
 * G-MG.A.1). Everything here is the previous lesson's prism/cylinder
 * work with one factor attached: a pyramid or cone is exactly one third
 * of the prism or cylinder that shares its base and height. The two
 * classic wrecks — slant height substituted for perpendicular height,
 * and diameter substituted for radius — get equal billing with the
 * formulas themselves.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_GEOM_U10_PYRAMIDS_CONES_SPHERES: LessonPlan = {
  id: 'evelyn.hs.geom.pyramids-cones-spheres.v1',
  title: 'Volume: Pyramids, Cones & Spheres',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'geometry',
  locale: 'en',
  los: [
    {
      id: 'geom.pyramids-cones-spheres',
      standard: 'GEOM-10.4',
      description:
        'Compute volumes of pyramids, cones, spheres, and hemispheres, explain informally why the pointy solids carry a factor of one third, and apply the formulas to real objects using perpendicular height and radius correctly (CCSS G-GMD.A.1, G-GMD.A.3, G-MG.A.1).',
    },
  ],
  prerequisites: ['geom.prisms-cylinders'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the pointy solids as prisms with a single factor attached — the fact that lets designers size domes, silos, and cones by hand.',
      script:
        'Take a cone and a cylinder built with the same circular base and the same height. Fill the cone with sand and pour it into the cylinder. It takes exactly three pours — every time, for any base shape. That single experiment is why every pointy solid in architecture and design, from the Great Pyramid to a paper snow-cone cup, carries a factor of one third. Today you get the three formulas that finish off solid geometry — and the two measurement mix-ups that wreck them more often than the arithmetic ever does.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-pointy-and-round',
      kind: 'concept',
      goal: 'The one-third pattern, what B and h actually mean, the sphere, and the slant-height and diameter traps.',
      keyIdeas: [
        'THE ONE-THIRD PATTERN — a pyramid is one third of the prism sharing its base and height: V = (1/3)Bh. A cone is one third of the matching cylinder: V = (1/3)πr²h. Same idea, round base. If you know the prism or cylinder volume, just divide by 3.',
        'B IS THE AREA OF THE BASE — B is whatever the base shape happens to be: a square base of side s gives B = s², a triangular base gives B = (1/2)bh of that triangle, a circular base gives B = πr². Compute B FIRST as its own number, then multiply by h and by 1/3.',
        'h IS PERPENDICULAR, NEVER SLANT — the height h runs from the apex straight down, perpendicular to the base plane. The SLANT height ℓ runs along a lateral face or edge and is always LONGER. Substituting ℓ for h is the single most common volume error.',
        'RECOVERING h FROM SLANT HEIGHT — in a right cone the radius, the height, and the slant height form a right triangle with ℓ as the hypotenuse: r² + h² = ℓ². So h = √(ℓ² - r²). For a right pyramid, the leg is the distance from the base center to the midpoint of a base edge (the apothem).',
        'SPHERE — V = (4/3)πr³, the odd one out with no base and no height, only a radius. A HEMISPHERE (a dome) is exactly half: V = (2/3)πr³.',
        'RADIUS, NOT DIAMETER — problems hand you diameters on purpose. Halve it before it touches a formula. In a sphere the radius is cubed, so using d instead of r inflates the answer by a factor of 2³ = 8.',
        'EXACT VERSUS DECIMAL — leave answers "in terms of π" (36π) when asked; only multiply by 3.14 or the calculator π when a decimal is requested. Volume always carries CUBIC units: cm³, ft³, m³.',
        'SCALING AND OBLIQUE SOLIDS — multiply every linear dimension by k and the volume multiplies by k³, not by k. And by Cavalieri\'s principle, a leaning (oblique) cone or pyramid has the SAME volume as the upright one with the same base and perpendicular height — tilt does not change the formula.',
      ],
      vocabulary: [
        { term: 'slant height', definition: 'the distance from the apex measured along a lateral face or edge — always longer than the perpendicular height, and never used in a volume formula.' },
        { term: 'apex', definition: 'the single point where the lateral faces of a pyramid or the curved surface of a cone meet.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-square-pyramid',
      kind: 'worked_example',
      problem:
        'A monument is a right square pyramid. Its square base has side length 9 meters, and the apex sits 12 meters above the center of the base. Find its volume.',
      steps: [
        'Choose the formula: pyramid → V = (1/3)Bh, where B is the area of the base.',
        'Compute B on its own: the base is a square of side 9, so B = 9² = 81 square meters.',
        'The height given is the perpendicular distance from the apex down to the base — exactly the h the formula wants. h = 12.',
        'Substitute: V = (1/3)(81)(12) = (1/3)(972) = 324.',
        'Sanity check against the matching prism: a 9-by-9-by-12 box would hold 972 m³, and the pyramid is one third of that. ✓ Volume = 324 m³.',
      ],
      answer: '324 m³',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-slant-height-trap',
      kind: 'worked_example',
      problem:
        'A paper cone has a base radius of 6 cm, and the distance from the apex down along the outside of the cone to the rim is 10 cm. A student writes V = (1/3)π(6²)(10) = 120π cm³. Find the correct volume and explain the error.',
      steps: [
        'Name what was given: 10 cm measured along the outside surface is the SLANT height ℓ, not the perpendicular height h. The student plugged ℓ straight into the formula.',
        'Build the right triangle inside the cone: the radius r = 6 (base), the height h (from apex perpendicular to the base center), and the slant height ℓ = 10 as the hypotenuse. So r² + h² = ℓ².',
        'Solve for h: 6² + h² = 10² → 36 + h² = 100 → h² = 64 → h = 8 cm. (This is the 6-8-10 Pythagorean triple.)',
        'Now use the cone formula with the perpendicular height: V = (1/3)π(6²)(8) = (1/3)π(36)(8) = (1/3)(288π) = 96π cm³.',
        'The student\'s 120π is too big, and it always will be — the slant height is the hypotenuse, so ℓ > h for every cone.',
      ],
      answer: '96π cm³ — the 10 cm was the slant height, so the true height is √(10² - 6²) = 8 cm',
      estimatedMinutes: 3,
    },
    {
      id: 'try-sphere-volume',
      kind: 'try_yourself',
      problem: 'A solid ball is a sphere with radius 3 inches. What is its volume, in terms of π?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '12π cubic inches' },
        { id: 'b', text: '36π cubic inches', correct: true },
        { id: 'c', text: '27π cubic inches' },
        { id: 'd', text: '288π cubic inches' },
      ],
      expectedAnswer: '36π cubic inches',
      hints: [
        'Sphere volume is V = (4/3)πr³ — the radius is CUBED, and the 4/3 is not optional.',
        'r³ = 3³ = 27, and (4/3)(27) = 36.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cone-vs-cylinder',
      kind: 'try_yourself',
      problem:
        'A cone and a cylinder are built with the same base radius and the same height. The cylinder holds 45 cubic inches of water. How much does the cone hold?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '135 cubic inches' },
        { id: 'b', text: '45 cubic inches' },
        { id: 'c', text: '15 cubic inches', correct: true },
        { id: 'd', text: '22.5 cubic inches' },
      ],
      expectedAnswer: '15 cubic inches',
      hints: [
        'The cone formula is the cylinder formula with a factor of 1/3 attached — no radius or height needed here.',
        'One third of 45.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A right square pyramid has a base with side length 6 cm and a volume of 96 cm³. Find its height in centimeters and type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '8',
      hints: [
        'Start from V = (1/3)Bh with B = 6² = 36, so 96 = (1/3)(36)h.',
        '(1/3)(36) = 12, so 12h = 96 — divide.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-diameter',
      kind: 'misconception_check',
      question:
        'A spherical tank has a diameter of 12 feet. A student computes V = (4/3)π(12³) = 2304π cubic feet. What went wrong, and how far off is the answer?',
      commonErrors: [
        {
          answer: '2304π cubic feet',
          misconception: 'Substituting the diameter into a formula that calls for the radius.',
          correctsTo:
            'The formula needs r, so halve the diameter first: r = 12/2 = 6. Then V = (4/3)π(6³) = (4/3)π(216) = 288π cubic feet. Because the radius is CUBED, using d for r inflates the answer by 2³ = 8 — and 2304π is exactly 8 × 288π. Circle the word "diameter" the moment you read it and write r = d/2 before touching the formula.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Pointy solids are one third of their match: pyramid V = (1/3)Bh, cone V = (1/3)πr²h — compute the base area B first.',
        'Sphere V = (4/3)πr³; a hemisphere is half of that, (2/3)πr³.',
        'h is the PERPENDICULAR height. Given the slant height ℓ, recover it with h = √(ℓ² - r²) before using any volume formula.',
        'Halve every diameter before it enters a formula — in a sphere that mistake multiplies the answer by 8.',
        'Volume is always in cubic units, and scaling every dimension by k multiplies volume by k³.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.4', cedTitle: 'Volume: Pyramids, Cones & Spheres' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
