/**
 * GCSE Math Higher — 3D Shapes: Volume and Surface Area.
 * Prisms, cylinders, cones, spheres, frustums, and composite solids.
 */

import type { LessonPlan } from '../types';

export const SEED_GCSE_MATH_3D_VOLUME_SA: LessonPlan = {
  id: 'evelyn.gcse.math.3d-volume-sa.v1',
  title: 'GCSE Higher — 3D Volume & Surface Area',
  curriculum: 'GCSE',
  grade: '10-11',
  subject: 'math',
  topic: 'gcse-math',
  locale: 'en-GB',
  los: [
    {
      id: 'gcse.math.3d-volume-sa',
      description: 'Compute volumes and surface areas of prisms, cylinders, cones, spheres, pyramids, and composite solids; including frustums.',
      standard: 'GCSE-MATH-G16/G17',
    },
  ],
  prerequisites: ['gcse.math.arcs-sectors'],
  followUps: [],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: '3D problems combine memorised formulas with composition — break a tricky shape into known pieces.',
      script: 'A frustum looks scary until you realise it\'s just a big cone with a small cone subtracted. A composite solid is just a sphere on top of a cylinder. Once you know the standard formulas and how to add/subtract pieces, every 3D question becomes a logistics problem.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-formulas',
      kind: 'concept',
      goal: 'Standard volume and surface-area formulas + composition strategies.',
      keyIdeas: [
        'PRISM (any cross-section): V = (cross-sectional area) × length.',
        'CYLINDER: V = πr²h. Total surface area = 2πr² (two ends) + 2πrh (curved side) = 2πr(r + h).',
        'SPHERE: V = (4/3)πr³. Surface area = 4πr².',
        'CONE: V = (1/3)πr²h. Curved surface = πrl where l = √(r² + h²) is slant height. Total surface = πr² (base) + πrl.',
        'PYRAMID: V = (1/3) × base area × perpendicular height.',
        'FRUSTUM (cone with top cut off): V = (big cone) − (small cone). Use similar-triangle ratios to find the missing height of the small cone.',
        'COMPOSITE SOLIDS: identify the pieces, compute each, then add (for volumes) or carefully subtract overlaps for surface area.',
        'SURFACE AREA TRAPS: when shapes are joined (e.g. a cylinder topped with a hemisphere), the SHARED face is internal — do NOT count it on either piece.',
      ],
      vocabulary: [
        { term: 'frustum', definition: 'a cone or pyramid with the top cut off parallel to the base.' },
        { term: 'slant height', definition: 'in a cone, the straight-line distance from the apex to a point on the base circle: l = √(r² + h²).' },
        { term: 'cross-section', definition: 'the 2D shape revealed by slicing a prism perpendicular to its length.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-frustum',
      kind: 'worked_example',
      problem: 'A frustum has a circular base of radius 6 cm, top circular face of radius 3 cm, and height 8 cm. Find its volume in terms of π.',
      steps: [
        'A frustum = big cone − small cone. We need the height of each cone.',
        'By similar triangles: the cones share an apex. Let H = height of big cone (from apex to base). Top face is at height H − 8 from apex, with radius 3. Big base at height H, radius 6.',
        'Similar-triangle ratio: 3/(H − 8) = 6/H. Cross-multiply: 3H = 6(H − 8) → 3H = 6H − 48 → 3H = 48 → H = 16.',
        'Big cone: r = 6, h = 16. V_big = (1/3)π·6²·16 = (1/3)π·36·16 = (1/3)·576π = 192π.',
        'Small cone (cut off): r = 3, h = H − 8 = 8. V_small = (1/3)π·3²·8 = (1/3)π·9·8 = 24π.',
        'Frustum volume = 192π − 24π = 168π cm³.',
      ],
      answer: '168π cm³',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A solid sphere of radius 6 cm is melted and recast as a cylinder of radius 4 cm. Find the height of the cylinder, in terms of π if needed.',
      expectedAnswer: '18 cm',
      responseFormat: 'numeric',
      hints: [
        'Volume conserved: sphere volume = cylinder volume.',
        'Sphere V = (4/3)π·6³ = (4/3)π·216 = 288π.',
        'Cylinder V = π·4²·h = 16πh. Set 16πh = 288π.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-shared-face',
      kind: 'misconception_check',
      question: 'A solid is made of a cylinder (radius 5, height 10) topped by a hemisphere of radius 5. A student computes total surface area as 2πr² + 2πrh + (1/2)·4πr² (cylinder + hemisphere). Why is this wrong?',
      commonErrors: [
        {
          answer: 'Sum of all surfaces of cylinder + hemisphere',
          misconception: 'Counting the boundary face between the two pieces twice (once as a cylinder end, once as the hemisphere\'s flat circle).',
          correctsTo: 'The TOP of the cylinder and the FLAT side of the hemisphere are joined — they\'re internal, not external surface. Correct surface = (1 cylinder end, the BOTTOM only) + (curved cylinder side) + (hemisphere curved surface) = πr² + 2πrh + 2πr². For r = 5, h = 10: 25π + 100π + 50π = 175π. Always remove shared faces from a composite\'s surface area.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Cylinder V = πr²h. Cone V = (1/3)πr²h. Sphere V = (4/3)πr³.',
        'Slant height of cone l = √(r² + h²); curved surface = πrl.',
        'Sphere surface area = 4πr². Hemisphere curved = 2πr².',
        'Frustum = (big cone) − (small cone), with similar-triangle ratio finding heights.',
        'Composite surface area: subtract shared internal faces.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A sphere of radius r just fits inside a cylinder (the sphere touches both circular ends and the curved side). Show that the sphere\'s surface area equals the curved surface area of the cylinder.',
      hint: 'Cylinder must have radius r and height 2r. Curved surface = 2πr·h = 2πr·2r = 4πr². Sphere surface = 4πr². Equal — this is Archimedes\' famous result, the inspiration for his tomb engraving.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
