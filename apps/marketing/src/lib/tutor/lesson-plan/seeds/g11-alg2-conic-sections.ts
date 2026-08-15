/**
 * G11 — Conic sections.
 *
 * Circle, parabola, ellipse, hyperbola — all from slicing a cone at
 * different angles. Standard equations and recognizing each.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ALG2_CONIC_SECTIONS: LessonPlan = {
  id: 'evelyn.g11.alg2.conic-sections.v1',
  title: 'Conic sections: circles, parabolas, ellipses, hyperbolas',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'math',
  topic: 'pre-calculus', // 2026-08-07: was 'algebra-2' — no such topic in the 11-12 band; the matrices alias mis-homed this plan under Matrices (see test-g11-alg2-cell-resolution)
  locale: 'en',
  los: [
    {
      id: 'ccss.math.hsg-gpe.a.1',
      description: 'Derive the equation of a circle of given center and radius using the Pythagorean Theorem.',
      standard: 'CCSS.MATH.CONTENT.HSG.GPE.A.1',
    },
    {
      id: 'ccss.math.hsg-gpe.a.2',
      description: 'Derive the equation of a parabola given a focus and directrix.',
      standard: 'CCSS.MATH.CONTENT.HSG.GPE.A.2',
    },
  ],
  prerequisites: ['ccss.math.hsa-rei.b.4'],
  followUps: ['ccss.math.hsg-gpe.b.7'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Tie all four shapes back to a single visual: slicing a cone.',
      script: 'Take a cone — like an ice-cream cone. Slice it horizontally → CIRCLE. Tilt the slice → ELLIPSE. Slice parallel to the side → PARABOLA. Slice through both halves → HYPERBOLA. All four come from one shape!',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-four-equations',
      kind: 'concept',
      goal: 'Recognize each conic from its standard equation.',
      keyIdeas: [
        'CIRCLE: (x - h)² + (y - k)² = r². Center (h, k), radius r. Equal coefficients on x² and y², same sign, no xy term.',
        'PARABOLA: y - k = a(x - h)² (opens up/down) or x - h = a(y - k)² (opens sideways). Only ONE variable is squared.',
        'ELLIPSE: (x - h)²/a² + (y - k)²/b² = 1. Both x² and y² with positive coefficients, but DIFFERENT denominators.',
        'HYPERBOLA: (x - h)²/a² - (y - k)²/b² = 1 (opens left/right) or flip sign (opens up/down). One MINUS sign.',
        'KEY DISTINGUISHER: look at the x² and y² coefficients. Same → circle. Same sign different → ellipse. Opposite signs → hyperbola. Only one squared → parabola.',
      ],
      vocabulary: [
        { term: 'conic section', definition: 'a curve obtained by slicing a cone with a plane.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-classify',
      kind: 'worked_example',
      problem: 'Classify: 4x² + 9y² = 36.',
      steps: [
        'Both x² and y² are present, both positive — not a parabola, not a hyperbola.',
        'Coefficients 4 and 9 are different — so it\'s NOT a circle.',
        'Divide by 36: x²/9 + y²/4 = 1.',
        'That\'s the standard ELLIPSE form with a² = 9, b² = 4. Centered at origin.',
      ],
      answer: 'ellipse, centered at origin',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-circle',
      kind: 'worked_example',
      problem: 'Find the center and radius of (x - 3)² + (y + 2)² = 25.',
      steps: [
        'Compare to (x - h)² + (y - k)² = r².',
        'h = 3, k = -2 (because y + 2 = y - (-2)). So center is (3, -2).',
        'r² = 25 → r = 5.',
        'Center (3, -2), radius 5.',
      ],
      answer: 'center (3, -2), radius 5',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Classify: x²/16 - y²/9 = 1.',
      expectedAnswer: 'hyperbola',
      responseFormat: 'free',
      hints: [
        'Both x² and y² appear — but with what sign on each?',
        'Opposite signs (one minus) →  ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-ellipse-circle',
      kind: 'misconception_check',
      question: 'Is x²/4 + y²/4 = 1 an ellipse?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating equal denominators as ellipse anyway.',
          correctsTo: 'When the denominators are EQUAL, it\'s actually a CIRCLE — radius 2 in this case. An ellipse requires UNEQUAL denominators.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Circle: (x-h)² + (y-k)² = r². Equal coefficients.',
        'Parabola: only ONE variable squared.',
        'Ellipse: x²/a² + y²/b² = 1. Both positive, different denominators.',
        'Hyperbola: one term subtracted (opposite signs).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why are conics relevant in physics? Where do orbits, satellite dishes, and telescopes use them?',
      hint: 'Planets follow ellipses (Kepler). Satellite dishes are paraboloids. Comets often follow parabolas or hyperbolas.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
