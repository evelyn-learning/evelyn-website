/**
 * GRE Quant — 3D Geometry & Volume.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_Q_3D_GEOMETRY: LessonPlan = {
  id: 'evelyn.gre.q.3d-geometry.v1',
  title: 'GRE Quant — 3D Geometry & Volume',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'math',
  topic: 'gre-quant',
  locale: 'en',
  los: [
    {
      id: 'gre.q.3d-geometry',
      description: 'Compute volume and surface area for cubes, rectangular boxes, cylinders, spheres, and cones.',
      standard: 'GRE-Q-GEOM-3D',
    },
  ],
  prerequisites: ['gre.q.circles'],
  followUps: ['gre.q.data-interpretation'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'GRE rarely tests obscure 3D shapes — fluency on cube, box, cylinder, and sphere is enough.',
      script: 'Volume of a box = lwh. Volume of a cylinder = πr²h. Volume of a sphere = (4/3)πr³. Surface areas follow. Spend ten minutes locking these in and 3D questions become arithmetic.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-3d',
      kind: 'concept',
      goal: 'Volume + surface area for the standard 3D shapes.',
      keyIdeas: [
        'CUBE side s: V = s³. Surface area = 6s². Space diagonal = s√3.',
        'RECTANGULAR BOX (l, w, h): V = lwh. Surface area = 2(lw + lh + wh). Space diagonal = √(l² + w² + h²).',
        'CYLINDER (r, h): V = πr²h. Total SA = 2πr² + 2πrh = 2πr(r + h).',
        'SPHERE (r): V = (4/3)πr³. Surface area = 4πr².',
        'CONE (r, h): V = (1/3)πr²h. Slant height ℓ = √(r² + h²). Curved SA = πrℓ. Total SA = πr² + πrℓ.',
        'PRISM (any shape): V = (cross-section area) × length.',
        'PYRAMID: V = (1/3)·base × height.',
        'GRE TRAP: surface area of a cube ≠ 6 times volume. Use the correct formula. Also remember: face count for a cube = 6, edge count = 12, vertex count = 8.',
      ],
      vocabulary: [
        { term: 'space diagonal', definition: 'the longest line inside a 3D box, from one corner to the opposite; for a cube of side s, length s√3.' },
        { term: 'slant height', definition: 'in a cone or pyramid, the straight-line distance from apex to base edge; ℓ = √(r² + h²) for a cone.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cylinder',
      kind: 'worked_example',
      problem: 'A cylindrical tank has radius 3 ft and height 8 ft. Find its volume and total surface area.',
      steps: [
        'Volume = πr²h = π·9·8 = 72π ft³.',
        'Total SA = 2πr² + 2πrh = 18π + 48π = 66π ft².',
      ],
      answer: 'V = 72π ft³; SA = 66π ft²',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find the surface area of a cube with volume 27.',
      expectedAnswer: '54',
      responseFormat: 'numeric',
      hints: [
        'V = s³ = 27 → s = 3.',
        'SA = 6s² = 6·9.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-volume-scale',
      kind: 'misconception_check',
      question: 'A cube\'s side length triples. The volume increases by what factor?',
      commonErrors: [
        {
          answer: '3 times',
          misconception: 'Treating volume scaling like linear scaling.',
          correctsTo: 'Volume scales with the CUBE of linear scale. (3)³ = 27. So volume becomes 27 times the original. Surface area scales with the SQUARE: 9 times. Always remember: linear k, area k², volume k³.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Cube V = s³, SA = 6s².',
        'Box V = lwh, SA = 2(lw + lh + wh).',
        'Cylinder V = πr²h, SA = 2πr(r + h).',
        'Sphere V = (4/3)πr³, SA = 4πr².',
        'Linear k → area k² → volume k³.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A sphere just fits inside a cube of side 6. Find the volume of the empty space.',
      hint: 'Sphere radius = 3. Sphere V = (4/3)π·27 = 36π. Cube V = 216. Empty = 216 − 36π ≈ 216 − 113.1 ≈ 102.9.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
