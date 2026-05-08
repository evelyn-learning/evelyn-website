/**
 * AP Calculus BC — CED Unit 8.9+8.10+8.11: Volumes of Revolution
 * (Disc + Washer methods).
 */
import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';
export const SEED_AP_CALCBC_U8_VOLUMES_REVOLUTION: LessonPlan = {
  id: 'evelyn.ap.calcbc.volumes-revolution.v1', title: 'U8.9 Volumes of Revolution: Disc and Washer Methods',
  curriculum: 'AP', grade: '12', subject: 'math', topic: 'ap-calculus-bc', locale: 'en',
  los: [{ id: 'apcalcbc.volumes-revolution', description: 'Compute volumes of solids of revolution using the disc method (V = π∫r² dx) and washer method (V = π∫(R² − r²) dx). Handle revolution about various axes.', standard: 'AP-CALCBC-8.9-8.11' }],
  prerequisites: ['apcalcbc.volumes-cross-sections'], followUps: ['apcalcbc.arc-length'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Frame revolution as sweeping a 2D region around an axis.', script: "Revolve a 2D region around an axis. The result is a 3D solid. Disc method when the region touches the axis; WASHER method when there's a gap. Both reduce to integration of cross-sectional areas.", estimatedMinutes: 2 },
    { id: 'concept-revolution', kind: 'concept', goal: 'Cover disc and washer formulas.',
      keyIdeas: [
        'DISC METHOD (region touches axis): cross sections of the solid are CIRCLES. V = π·∫_a^b [r(x)]² dx. r(x) is the distance from the axis to the curve.',
        'WASHER METHOD (region has a gap from axis): cross sections are ANNULI (washers). V = π·∫_a^b ([R(x)]² − [r(x)]²) dx. R = outer radius, r = inner radius.',
        'AROUND THE x-AXIS: r = f(x) (or R, r if washer). V = π·∫ f(x)² dx (disc) or π·∫(R² − r²) dx (washer).',
        'AROUND THE y-AXIS: rewrite curves as functions of y; integrate dy. V = π·∫ x(y)² dy (disc) or π·∫(R(y)² − r(y)²) dy (washer).',
        'AROUND OTHER HORIZONTAL/VERTICAL LINES: shift the radius. If revolving around y = k: r = |f(x) − k| (or whatever distance from the curve to the axis is). Always: radius is the DISTANCE from axis to the bounding curve.',
        'PROCEDURE: (1) Sketch the region and the axis of revolution. (2) Identify type: disc (region touches axis) or washer (gap). (3) Express R (and r) as functions of integration variable. (4) Set up π·∫(R² [- r²]) dx. (5) Evaluate.',
        'EXAMPLE: revolve y = √x, y = 0, x = 4 around the x-axis. Region touches x-axis (y = 0). DISC. r(x) = √x. V = π·∫_0^4 x dx = π·8 = 8π.',
      ],
      vocabulary: [
        { term: 'disc method', definition: 'V = π∫r² dx for solids of revolution where the region touches the axis.' },
        { term: 'washer method', definition: 'V = π∫(R² − r²) dx for solids with a hollow core (gap between region and axis).' },
      ],
      estimatedMinutes: 5 },
    { id: 'worked-disc', kind: 'worked_example', problem: 'Find the volume of the solid formed by revolving y = x², y = 0, x = 0, x = 2 around the x-axis.',
      steps: [
        'STEP 1 — Region touches x-axis (y = 0 is part of boundary). DISC METHOD.',
        'STEP 2 — Radius r(x) = x² (height of curve above axis).',
        'STEP 3 — V = π·∫_0^2 (x²)² dx = π·∫_0^2 x⁴ dx = π·[x⁵/5]_0^2 = π·32/5 = 32π/5.',
      ],
      answer: 'V = 32π/5', estimatedMinutes: 3 },
    { id: 'worked-washer', kind: 'worked_example', problem: 'Find the volume of the solid formed by revolving the region between y = x and y = x² (on [0, 1]) around the x-axis.',
      steps: [
        'STEP 1 — On [0, 1], y = x is ABOVE y = x². So when revolved, OUTER radius R = x, INNER radius r = x². WASHER.',
        'STEP 2 — V = π·∫_0^1 (x² − (x²)²) dx = π·∫_0^1 (x² − x⁴) dx = π·[x³/3 − x⁵/5]_0^1 = π·(1/3 − 1/5) = π·(2/15) = 2π/15.',
      ],
      answer: 'V = 2π/15', estimatedMinutes: 4 },
    { id: 'try-disc', kind: 'try_yourself', problem: 'Revolve y = √x, y = 0, x = 1 around the x-axis. Find V.',
      expectedAnswer: 'Disc. r = √x. V = π·∫_0^1 (√x)² dx = π·∫_0^1 x dx = π/2.',
      responseFormat: 'numeric', hints: ['Disc method, integrate.'], estimatedMinutes: 2 },
    { id: 'try-around-y-axis', kind: 'try_yourself', problem: 'Revolve the region bounded by y = x², y = 4, in the first quadrant, around the Y-AXIS. Find V.',
      expectedAnswer: 'Around y-axis: integrate dy. Express as x = √y. Region: 0 ≤ y ≤ 4. Disc (touches y-axis). r = √y. V = π·∫_0^4 (√y)² dy = π·∫_0^4 y dy = π·[y²/2]_0^4 = 8π.',
      responseFormat: 'numeric', hints: ['Convert to x = function of y. Disc around y-axis: r = x value of curve.'], estimatedMinutes: 4 },
    { id: 'try-shift-axis', kind: 'try_yourself', problem: 'AP-style synthesis. Revolve y = x², y = 4 around the line y = 4 (NOT the x-axis). Find V.',
      expectedAnswer: 'Axis y = 4 is HORIZONTAL. Distance from axis to curve y = x² is (4 − x²) (since x² ≤ 4 in [-2, 2]). Region touches axis (at y = 4, which is part of boundary). DISC method with shifted radius. R(x) = 4 − x². V = π·∫_{-2}^2 (4 − x²)² dx. Expand: (4 − x²)² = 16 − 8x² + x⁴. V = π·[16x − 8x³/3 + x⁵/5]_{-2}^2 = 2π·[32 − 64/3 + 32/5] = 2π·[(480 − 320 + 96)/15] = 2π·256/15 = 512π/15.',
      responseFormat: 'frq', hints: ['Radius = distance from axis to curve = |4 − x²|.'], estimatedMinutes: 5 },
    { id: 'recap', kind: 'recap', mustRemember: [
      'Disc: V = π∫r² dx (region touches axis).',
      'Washer: V = π∫(R² − r²) dx (gap from axis).',
      'For y-axis revolution: integrate dy with x = function of y.',
      'For shifted axis: radius is DISTANCE from axis to curve.',
    ], estimatedMinutes: 1 },
  ],
  source: AP_SOURCE, schemaVersion: 1, pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: { cedUnit: '8', cedTopic: '8.9-8.11', cedTitle: 'Volumes of Revolution', sources: [{ type: 'concept', book: 'larson-calc-ap-ed', chapter: '5', note: 'Standard volumes of revolution.' }] },
};
