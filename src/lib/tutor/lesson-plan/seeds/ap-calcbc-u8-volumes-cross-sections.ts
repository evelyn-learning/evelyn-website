/**
 * AP Calculus BC — CED Unit 8.7+8.8: Volumes with Cross Sections.
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U8_VOLUMES_CROSS_SECTIONS: LessonPlan = {
  id: 'evelyn.ap.calcbc.volumes-cross-sections.v1', title: 'U8.7 Volumes with Known Cross Sections',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.volumes-cross-sections', description: 'Compute volumes of solids whose cross sections perpendicular to an axis are squares, rectangles, triangles, semicircles, etc. Apply V = ∫ A(x) dx where A(x) is the cross-section area.', standard: 'AP-CALCBC-8.7-8.8' }],
  prerequisites: ['apcalcbc.area-between-curves'], followUps: ['apcalcbc.volumes-revolution'], estimatedMinutes: 20,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame as 3D extension of integration.', script: "If you slice a solid into thin perpendicular cross sections, each has area A(x). Stack them all up: V = ∫ A(x) dx. The shape of cross section determines A(x). AP exam questions love this.", estimatedMinutes: 2 },
    { id: 'concept-cross-sections', kind: 'concept', goal: 'Cover the integral formula and standard cross sections.',
      keyIdeas: [
        'V = ∫_a^b A(x) dx, where A(x) is the cross-section area at x.',
        'CROSS-SECTION SHAPE determines A(x). Side length of cross section often comes from "the curve y = f(x) bounded above and below" or similar — read the problem carefully.',
        'SQUARE cross sections: A(x) = (side)². If side = f(x) − g(x) (between two curves), A = (f − g)².',
        'RECTANGULAR (height h, width w): A = h · w. The dimensions come from given curves.',
        'EQUILATERAL TRIANGLE with side s: A = (√3/4)·s².',
        'SEMICIRCULAR with diameter d: A = (1/2)·π·(d/2)² = πd²/8. (Half a circle of radius d/2.)',
        'PROCEDURE: (1) Identify how the cross-section "sits" (perpendicular to which axis). (2) Write the side/diameter as a function of the integration variable using given curves. (3) Compute A(x). (4) Integrate ∫_a^b A(x) dx with appropriate bounds.',
        'COMMON PROBLEM: solid has square cross sections with one side on the x-axis bounded by curves; integrate (top − bottom)² from a to b.',
      ],
      vocabulary: [
        { term: 'cross-sectional volume', definition: 'V = ∫ A(x) dx where A(x) is the area of the cross section at position x.' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-square', kind: 'worked_example', problem: 'A solid has a base in the xy-plane bounded by y = √x and the x-axis from x = 0 to x = 4. Cross sections perpendicular to the x-axis are SQUARES. Find the volume.',
      steps: [
        'STEP 1 — At position x, the side of the square = the value of y on the boundary = √x.',
        'STEP 2 — A(x) = (√x)² = x.',
        'STEP 3 — V = ∫_0^4 x dx = [x²/2]_0^4 = 8.',
      ],
      answer: 'V = 8', estimatedMinutes: 3 },
    { id: 'try-semicircle', kind: 'try_yourself', problem: 'A solid has base bounded by y = 2 − x² and the x-axis (for x in some interval). Cross sections perpendicular to the x-axis are SEMICIRCLES with the diameter on the base. Set up (don\'t evaluate) the volume integral.',
      expectedAnswer: 'Curve crosses x-axis at x = ±√2. Diameter at position x = y = 2 − x² (assuming x in [-√2, √2] and y ≥ 0). Radius = (2 − x²)/2. Area of semicircle = (1/2)π·r² = (π/2)·((2 − x²)/2)² = (π/8)·(2 − x²)². V = ∫_{-√2}^{√2} (π/8)(2 − x²)² dx.',
      responseFormat: 'free', hints: ['Diameter = boundary y. Radius = y/2. Area = π·r²/2.'], estimatedMinutes: 4 },
    { id: 'try-triangle', kind: 'try_yourself', problem: 'A solid has base bounded by y = x and y = x², 0 ≤ x ≤ 1. Cross sections perpendicular to x-axis are EQUILATERAL TRIANGLES with one side in the base. Find the volume.',
      expectedAnswer: 'Side at position x = (top − bottom) = x − x². A(x) = (√3/4)·(x − x²)². V = ∫_0^1 (√3/4)(x − x²)² dx. Expand: (x − x²)² = x² − 2x³ + x⁴. V = (√3/4)·∫_0^1 (x² − 2x³ + x⁴) dx = (√3/4)·[x³/3 − x⁴/2 + x⁵/5]_0^1 = (√3/4)·(1/3 − 1/2 + 1/5) = (√3/4)·(10/30 − 15/30 + 6/30) = (√3/4)·(1/30) = √3/120.',
      responseFormat: 'numeric', hints: ['Side = top - bottom. A = (√3/4)·s². Integrate.'], estimatedMinutes: 5 },
    { id: 'try-square-y', kind: 'try_yourself', problem: 'AP-style synthesis. A solid has base in the first quadrant bounded by y = x², the x-axis, and x = 2. Cross sections perpendicular to the y-axis are squares whose one side is in the base. Set up the volume integral (in y).',
      expectedAnswer: 'Cross sections perpendicular to y-axis: at height y, the side of the square spans from x = √y (left boundary, since y = x² → x = √y) to x = 2 (right vertical edge). Side = 2 − √y. y range: 0 to 4 (since at x = 2, y = 4). V = ∫_0^4 (2 − √y)² dy.',
      responseFormat: 'frq', hints: ['Cross sections perp to y-axis means integrate dy. At height y, the horizontal segment in the base has width = right − left.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'V = ∫ A(x) dx (or ∫ A(y) dy).',
      'Square: A = side². Equilateral triangle: A = (√3/4)·s². Semicircle (diameter d): A = πd²/8.',
      'Side / diameter comes from the boundary curves: top − bottom OR right − left.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '8', cedTopic: '8.7-8.8', cedTitle: 'Volumes with Cross Sections', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '5', note: 'Standard cross-section volumes.' }] },
};
