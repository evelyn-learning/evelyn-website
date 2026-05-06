/**
 * ACT Math — Geometry and Trigonometry (~20 questions).
 */

import type { LessonPlan } from '../types';

export const SEED_ACT_MATH_GEOMETRY_TRIG: LessonPlan = {
  id: 'evelyn.testprep.act.math.geometry-trig.v1',
  title: 'ACT Math — Geometry, Coordinate Geometry, and Trigonometry',
  curriculum: 'ACT-PREP',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act-math',
  locale: 'en',
  los: [
    {
      id: 'testprep.act.math.geometry-trig',
      description: 'Drill plane geometry, coordinate geometry, and basic trigonometry (SOHCAHTOA, special triangles, basic identities) heavily tested on ACT.',
      standard: 'ACT-MATH',
    },
  ],
  prerequisites: ['testprep.act.math.pre-algebra-algebra'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Roughly 35% of ACT Math is geometry/trig — and the formulas are FEW (most fit on one page).',
      script: 'Memorise a tight list of geometry formulas + the SOHCAHTOA ratios + special triangles, and you handle 20 questions cold. Today: the canonical list + the question patterns ACT loves to test.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-geo-trig',
      kind: 'concept',
      goal: 'Plane geo formulas, coordinate geo, basic trig + identities, common configurations.',
      keyIdeas: [
        'PLANE GEOMETRY:',
        '  Triangle area = (1/2) base × height. Right-triangle Pythagoras: a² + b² = c².',
        '  Triangle interior angles sum 180°. Exterior angle = sum of two non-adjacent interior angles.',
        '  Circle: circumference 2πr; area πr²; arc length = (θ/360°) × 2πr; sector area = (θ/360°) × πr².',
        '  Parallel lines + transversal: alternate interior, alternate exterior, corresponding angles equal.',
        '  Similar triangles: corresponding angles equal, corresponding sides proportional.',
        'COORDINATE GEOMETRY:',
        '  Distance: √[(x₂−x₁)² + (y₂−y₁)²].',
        '  Midpoint: ((x₁+x₂)/2, (y₁+y₂)/2).',
        '  Slope: (y₂−y₁)/(x₂−x₁).',
        '  Line forms: slope-intercept y = mx + b; point-slope y − y₁ = m(x − x₁); standard Ax + By = C.',
        '  Parallel slopes equal; perpendicular slopes are negative reciprocals.',
        '  Circle: (x−h)² + (y−k)² = r² with center (h, k) and radius r.',
        'TRIGONOMETRY (basics):',
        '  SOHCAHTOA: sin = opp/hyp; cos = adj/hyp; tan = opp/adj.',
        '  SPECIAL TRIANGLES: 30-60-90 (sides 1 : √3 : 2). 45-45-90 (sides 1 : 1 : √2). Memorise.',
        '  Pythagorean identity: sin²θ + cos²θ = 1. Useful when ACT gives one ratio and asks for another.',
        '  Reciprocal: csc = 1/sin; sec = 1/cos; cot = 1/tan.',
        'COMMON CONFIGURATIONS to recognise: shaded-region problems (subtract one shape from another), inscribed shapes (square in circle, etc.), tangent lines (perpendicular to radius at point of tangency).',
      ],
      vocabulary: [
        { term: 'special right triangle', definition: '30-60-90 (sides 1:√3:2) and 45-45-90 (sides 1:1:√2); their exact ratios appear repeatedly on the ACT.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A right triangle has one leg 3 and the hypotenuse 5. What is sin θ where θ is the angle opposite the unknown leg?',
      steps: [
        'Find the unknown leg via Pythagoras: 3² + b² = 5² ⟹ b² = 16 ⟹ b = 4. (Classic 3-4-5.)',
        'θ is opposite the leg of length 4. So opp = 4, hyp = 5.',
        'sin θ = opp/hyp = 4/5.',
      ],
      answer: 'sin θ = 4/5',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A circle has equation (x − 3)² + (y + 2)² = 16. Find its center and radius.',
      expectedAnswer: 'Standard form (x − h)² + (y − k)² = r². Match: h = 3, k = −2 (note the +2 inside means k is negative), r² = 16 → r = 4. Center (3, −2), radius 4.',
      responseFormat: 'free',
      hints: [
        'Match against (x − h)² + (y − k)² = r².',
        'Be careful with sign on k when the equation has + inside.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-tan-as-ratio',
      kind: 'misconception_check',
      question: 'A right triangle has legs 3 and 4. A student says tan(other angle) = 4/3 AND 3/4 simultaneously, picking whichever fits the answer choices. What\'s the right approach?',
      commonErrors: [
        {
          answer: 'Tan can be either 3/4 or 4/3',
          misconception: 'Not pinning down which leg is opposite which angle.',
          correctsTo: 'tan = OPP/ADJ depends on WHICH angle. The triangle has two acute angles; for one of them, opp = 3 and adj = 4 → tan = 3/4. For the other, opp = 4 and adj = 3 → tan = 4/3. ALWAYS label which angle the question is asking about. Most ACT problems specify in the diagram or wording (e.g. "the angle at vertex A").',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Memorise: triangle area, circle area/circumference, distance/midpoint, slope.',
        'Special triangles 30-60-90 and 45-45-90 — memorise side ratios.',
        'SOHCAHTOA — pin down WHICH angle before naming opp/adj.',
        'sin² + cos² = 1 — useful when one ratio given.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
