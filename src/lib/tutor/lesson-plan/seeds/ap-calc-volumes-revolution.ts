/**
 * AP Calculus AB/BC — Volumes of revolution.
 *
 * Disk, washer, and shell methods. Rotate a region around an axis,
 * compute volume by integration.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CALC_VOLUMES_REVOLUTION: LessonPlan = {
  id: 'evelyn.ap.calc.volumes-revolution.v1',
  title: 'Volumes of revolution: disk, washer, shell',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-ab',
  locale: 'en',
  los: [
    {
      id: 'apcalc.volumes-rev',
      description: 'Compute the volume of a solid of revolution using disk, washer, or shell methods.',
      standard: 'AP-CALC-CHA-5',
    },
  ],
  prerequisites: ['apcalc.integration'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Visualize spinning a 2D shape into a 3D solid.',
      script: 'Take a flat region in the xy-plane and SPIN it around the x-axis. You get a 3D solid — like a vase or a bowl. Calculus tells you exactly how much space that solid fills.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-three-methods',
      kind: 'concept',
      goal: 'Disk, washer, shell — when each applies.',
      keyIdeas: [
        'DISK METHOD: rotate y = f(x) from x=a to x=b around the x-axis. Slice perpendicular to the axis. Each slice is a DISK (circle). V = π · ∫_a^b [f(x)]² dx.',
        'WASHER METHOD: when the rotated region has a HOLE — bounded by two curves. V = π · ∫_a^b ([R(x)]² − [r(x)]²) dx, where R is outer and r is inner radius.',
        'SHELL METHOD: rotate around an axis perpendicular to the integration variable. Slice into thin cylindrical SHELLS. V = 2π · ∫_a^b x · f(x) dx (rotating around y-axis with x = radius).',
        'CHOOSING: if your region is easily described as y in terms of x and rotation is around x-axis (or vice versa with y) → disk/washer. If integration would be easier the OTHER way → shell.',
        'COMMON pattern: disk/washer for around horizontal/vertical axis when curves are functions; shell when problems would require splitting the region.',
      ],
      vocabulary: [
        { term: 'solid of revolution', definition: 'a 3D solid formed by rotating a 2D region around an axis.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-disk',
      kind: 'worked_example',
      problem: 'Find the volume of the solid formed by rotating y = √x from x=0 to x=4 around the x-axis.',
      steps: [
        'DISK method: V = π · ∫_0^4 [f(x)]² dx = π · ∫_0^4 (√x)² dx.',
        '= π · ∫_0^4 x dx.',
        '= π · [x²/2] from 0 to 4.',
        '= π · (16/2 − 0) = 8π.',
        'Volume = 8π cubic units.',
      ],
      answer: '8π',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-washer',
      kind: 'worked_example',
      problem: 'The region between y = x² and y = 2x is rotated around the x-axis. Find the volume.',
      steps: [
        'Find intersection: x² = 2x → x² − 2x = 0 → x(x−2) = 0 → x = 0, 2. Region from x=0 to x=2.',
        'Outer R(x) = 2x (the larger function on this interval). Inner r(x) = x².',
        'WASHER: V = π · ∫_0^2 ((2x)² − (x²)²) dx = π · ∫_0^2 (4x² − x⁴) dx.',
        '= π · [4x³/3 − x⁵/5] from 0 to 2.',
        '= π · (32/3 − 32/5) = π · (160 − 96)/15 = 64π/15.',
      ],
      answer: '64π/15',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Rotate y = x² from x=0 to x=2 around the x-axis. Find volume using disks.',
      expectedAnswer: '32π/5',
      responseFormat: 'free',
      hints: [
        'V = π · ∫_0^2 (x²)² dx = π · ∫_0^2 x⁴ dx.',
        '= π · [x⁵/5] from 0 to 2 = 32π/5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-square-the-radius',
      kind: 'misconception_check',
      question: 'In the disk method, do you square the function value?',
      commonErrors: [
        {
          answer: 'no',
          misconception: 'Forgetting to square the radius.',
          correctsTo: 'YES — area of a circle is π·r². The radius IS f(x) for rotation around x-axis. So the integrand is π·[f(x)]². Forgetting the square is a very common error.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Disk: V = π·∫[f(x)]² dx. Single curve, no hole.',
        'Washer: V = π·∫(R² − r²) dx. Region between two curves.',
        'Shell: V = 2π·∫x·f(x) dx. Choose when integration variable is parallel to axis.',
        'Always identify the region and the axis first.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does rotating any region give a SOLID with the same volume regardless of how you slice it?',
      hint: 'Cavalieri\'s principle: solids with the same cross-sectional areas at every level have the same volume. Different methods (disk, shell) describe the SAME 3D solid in different slicings — must agree.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
