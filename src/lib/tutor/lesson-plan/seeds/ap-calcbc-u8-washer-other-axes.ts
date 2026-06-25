/**
 * AP Calculus BC — CED Unit 8.12: Volume with the Washer Method —
 * Revolving Around Other Axes.
 *
 * Extending the washer method to revolution about a horizontal or
 * vertical line that is NOT a coordinate axis (e.g. y = −1, x = 4): the
 * outer and inner radii are measured as distances from the axis of
 * revolution, so each radius picks up an offset.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_CALCBC_U8_WASHER_OTHER_AXES: LessonPlan = {
  id: 'evelyn.ap.calcbc.washer-other-axes.v1',
  title: 'U8.12 Washer Method: Revolving Around Other Axes',
  curriculum: 'AP',
  grade: '12',
  subject: 'math',
  topic: 'ap-calculus-bc',
  locale: 'en',
  los: [
    {
      id: 'apcalcbc.washer-other-axes',
      description:
        'Compute volumes of revolution with the washer method when the axis of revolution is a horizontal or vertical line other than a coordinate axis, by writing the outer radius R and inner radius r as distances (with offset) from the axis of revolution.',
      standard: 'AP-CALCBC-8.12',
    },
  ],
  prerequisites: ['apcalcbc.volumes-revolution'],
  followUps: ['apcalcbc.arc-length'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame off-axis revolution as the same washer formula with shifted radii.',
      script:
        "You already know the washer method: V = π∫(R² − r²). The only new wrinkle when we revolve around a line like y = −1 instead of the x-axis is HOW we measure the radii. The radius is always the DISTANCE from the curve to the axis of revolution — so when the axis moves, every radius picks up an offset. Get the radius bookkeeping right and the integral is identical to what you've done. The whole topic is really one idea: radius = distance to the axis.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-offset-radii',
      kind: 'concept',
      goal: 'Cover how to write outer/inner radii as distances from a non-axis line of revolution.',
      keyIdeas: [
        'WASHER FORMULA (unchanged): V = π ∫ (R² − r²) dx (or dy), where R = OUTER radius and r = INNER radius of the washer cross-section. The axis of revolution does not change the formula — only how R and r are computed.',
        'THE CORE PRINCIPLE: a radius is the DISTANCE from a boundary curve to the AXIS OF REVOLUTION. Distance is "farther curve value minus axis" (or "axis minus curve", whichever is positive). Always set it up so the radius is non-negative.',
        'HORIZONTAL AXIS y = c (revolve a region bounded by y = top(x) and y = bottom(x), integrate in x): radius from a curve at height y to the line y = c is |y − c|. OUTER radius uses the boundary FARTHER from y = c; INNER radius uses the boundary CLOSER to y = c.',
        'TYPICAL HORIZONTAL CASE, region above the axis, revolve about y = c BELOW the region: R = top(x) − c, r = bottom(x) − c. Then V = π ∫ [(top − c)² − (bottom − c)²] dx.',
        'VERTICAL AXIS x = k (revolve a region bounded by x = right(y) and x = left(y), integrate in y): radius from a curve at horizontal position x to the line x = k is |x − k|. R uses the boundary farther from x = k; r uses the boundary closer.',
        'THE #1 ERROR — forgetting the offset, or subtracting in the wrong order. If you revolve about y = −1, a curve at height y is a distance y − (−1) = y + 1 away, NOT y. Sketch the axis, label which boundary is farther, and write each radius as a clean non-negative distance BEFORE squaring.',
        'DO NOT distribute the square incorrectly: (top − c)² − (bottom − c)² ≠ (top − bottom)². You must square each radius separately, THEN subtract. The washer has a genuine hole; collapsing the radii loses it.',
        'SETUP RITUAL: (1) sketch region + axis of revolution; (2) decide dx (horizontal axis) or dy (vertical axis) — slices are perpendicular to the axis; (3) write R and r as distances from the axis with the offset; (4) V = π∫(R² − r²) over the correct bounds.',
      ],
      vocabulary: [
        { term: 'axis of revolution', definition: 'the line the region is spun around; radii are measured as distances to this line.' },
        { term: 'offset', definition: 'the shift added to each radius because the axis of revolution is not a coordinate axis (e.g. + 1 when revolving about y = −1).' },
      ],
      suggestedTools: ['show_function_graph'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-horizontal-offset',
      kind: 'worked_example',
      problem:
        'The region bounded by y = √x and y = x (between their intersections) is revolved about the line y = −1. Set up and evaluate the volume using the washer method.',
      steps: [
        'STEP 1 — REGION. Curves meet where √x = x ⇒ x = x² ⇒ x = 0 and x = 1. On [0, 1], √x ≥ x (e.g. at x = 1/4, √x = 0.5 > 0.25). So the TOP boundary is y = √x and the BOTTOM is y = x.',
        'STEP 2 — AXIS AND RADII. Revolve about y = −1, which lies BELOW the region. Each radius is the distance UP from y = −1. OUTER radius reaches the farther boundary (the top, √x): R = √x − (−1) = √x + 1. INNER radius reaches the closer boundary (the bottom, x): r = x − (−1) = x + 1.',
        'STEP 3 — SET UP THE INTEGRAL. Slices are vertical (perpendicular to the horizontal axis) ⇒ integrate in x over [0, 1]: V = π ∫₀¹ [(√x + 1)² − (x + 1)²] dx.',
        'STEP 4 — EXPAND. (√x + 1)² = x + 2√x + 1. (x + 1)² = x² + 2x + 1. Difference: (x + 2√x + 1) − (x² + 2x + 1) = −x² − x + 2√x. So V = π ∫₀¹ (−x² − x + 2x^{1/2}) dx.',
        'STEP 5 — INTEGRATE. ∫ −x² dx = −x³/3. ∫ −x dx = −x²/2. ∫ 2x^{1/2} dx = 2·(x^{3/2}/(3/2)) = (4/3)x^{3/2}. Evaluate 0 → 1: −1/3 − 1/2 + 4/3 = (−1/3 + 4/3) − 1/2 = 1 − 1/2 = 1/2.',
        'STEP 6 — RESULT. V = π · (1/2) = π/2.',
      ],
      answer: 'V = π/2.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-vertical-offset',
      kind: 'try_yourself',
      problem:
        'The region bounded by y = x², y = 0, and x = 1 is revolved about the vertical line x = 2. Without fully evaluating, set up the washer integral (in terms of y), correctly writing the outer and inner radii.',
      expectedAnswer:
        'Integrate in y (slices perpendicular to the vertical axis x = 2), with y from 0 to 1. Solve the boundary for x: y = x² ⇒ x = √y. For a fixed y, the region runs horizontally from the curve x = √y to the line x = 1. The axis x = 2 is to the RIGHT of the region. Distance from the axis: the FARTHER boundary is x = √y (smaller x, farther from 2), so OUTER radius R = 2 − √y; the CLOSER boundary is x = 1, so INNER radius r = 2 − 1 = 1. Set up: V = π ∫₀¹ [(2 − √y)² − (1)²] dy. Key checks: integrate in y for a vertical axis; radius = (axis x-value) − (curve x-value) since the axis is to the right; square each radius separately before subtracting.',
      responseFormat: 'frq',
      hints: [
        'Vertical axis ⇒ integrate in y; solve y = x² for x = √y.',
        'Radius = distance from each boundary to x = 2.',
        'The boundary with smaller x is farther from x = 2 ⇒ that is R.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-axis-above',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. The region bounded by y = x² and y = 1 is revolved about the line y = 3 (which lies ABOVE the region). Set up the washer integral and explain why the OUTER radius uses y = x² and the inner uses y = 1.',
      expectedAnswer:
        'Intersections: x² = 1 ⇒ x = ±1, so x ∈ [−1, 1]; on this interval y = 1 is the TOP boundary and y = x² is the BOTTOM. The axis y = 3 is ABOVE the whole region, so radius = distance DOWN from y = 3 = 3 − y. The boundary FARTHER from y = 3 is the one with the SMALLER y-value, i.e. the lower curve y = x²: OUTER radius R = 3 − x². The boundary CLOSER to y = 3 is the upper curve y = 1: INNER radius r = 3 − 1 = 2. Integrate in x over [−1, 1]: V = π ∫₋₁¹ [(3 − x²)² − (2)²] dx. WHY the outer uses y = x²: when the axis is above the region, the farther boundary is the LOWER curve, because lower points are farther from a high axis — so the lower curve sweeps the bigger circle and is the outer radius. Strong answers (i) identify which curve is top vs bottom, (ii) write radii as 3 − y distances, and (iii) justify the outer/inner assignment by "farther from the axis = larger radius."',
      responseFormat: 'frq',
      hints: [
        'Axis above ⇒ radius = 3 − y.',
        'Farther from a high axis = the lower curve.',
        'Square each radius separately, then subtract.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Same formula: V = π∫(R² − r²); only the radii change.',
        'Radius = distance from the boundary curve to the axis of revolution (include the offset).',
        'Horizontal axis y = c ⇒ integrate in x, radius = |curve − c|; vertical axis x = k ⇒ integrate in y, radius = |curve − k|.',
        'Farther boundary = outer radius R; closer boundary = inner radius r.',
        'Square each radius separately before subtracting — never (R − r)².',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8.12',
    cedTitle: 'Volume with Washer Method: Revolving Around Other Axes',
    sources: [
      { type: 'concept', book: 'larson-calc-ap-ed', chapter: '5', note: 'Washer method with offset radii for revolution about non-coordinate axes.' },
    ],
  },
};
