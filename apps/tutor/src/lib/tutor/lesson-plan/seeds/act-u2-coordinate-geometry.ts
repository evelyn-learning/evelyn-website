/**
 * ACT — Math / Coordinate Geometry: distance, midpoint, slope & circle/parabola equations.
 *
 * Coordinate geometry is roughly 15% of ACT Math — standalone questions,
 * calculator allowed, ~60 seconds each. Unlike the SAT, the ACT gives NO
 * formula sheet: distance, midpoint, slope, and the circle/parabola forms
 * must be memorized cold. Today's traps are almost all sign errors.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U2_COORDINATE_GEOMETRY: LessonPlan = {
  id: 'evelyn.testprep.act.coordinate-geometry.v1',
  title: 'Coordinate Geometry',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.coordinate-geometry',
      standard: 'ACT-2.7',
      description:
        'Apply the distance, midpoint, and slope formulas, and identify center/radius and vertex from circle and parabola equations in the coordinate plane, without a formula sheet.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe coordinate geometry as ~15% of ACT Math, standalone questions, no formula sheet, ~60 sec each.',
      script:
        'Coordinate geometry is about 15% of the ACT Math section — roughly 9 questions, each worth about 60 seconds. Here is the catch: the ACT does NOT hand you a formula sheet the way the SAT does. Distance, midpoint, slope, and the circle/parabola equations have to live in your head. The good news: it is a short list, and today we drill it plus the sign traps that eat points.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-coordinate-formulas',
      kind: 'concept',
      goal: 'The core formula list — distance, midpoint, slope, parallel/perpendicular slopes, circle standard/general form, parabola vertex form — plus the sign traps that recur.',
      keyIdeas: [
        'DISTANCE between (x₁,y₁) and (x₂,y₂): d = √[(x₂−x₁)² + (y₂−y₁)²]. It is just the Pythagorean theorem laid over the plane — the horizontal and vertical gaps are the legs.',
        'MIDPOINT between (x₁,y₁) and (x₂,y₂): M = ((x₁+x₂)/2, (y₁+y₂)/2) — average the x\'s, average the y\'s. Do not confuse this with slope; midpoint has no subtraction at all.',
        'SLOPE between (x₁,y₁) and (x₂,y₂): m = (y₂−y₁)/(x₂−x₁) — Δy always goes on TOP. Whatever point you call "point 2" in the numerator must also be "point 2" in the denominator, or the sign flips.',
        'PARALLEL lines have EQUAL slopes. PERPENDICULAR lines have slopes that are NEGATIVE RECIPROCALS (m₁ × m₂ = −1) — flip the fraction AND change the sign.',
        'CIRCLE, standard form: (x−h)² + (y−k)² = r², center (h, k), radius r. TRAP: the signs inside the parentheses are the OPPOSITE of the center coordinates — (x−3)² means h = 3, but (x+3)² means h = −3.',
        'CIRCLE, general form: x² + y² + Dx + Ey + F = 0. The ACT loves handing you this scrambled version — you must COMPLETE THE SQUARE on the x-terms and the y-terms separately to recover (h, k) and r.',
        'PARABOLA, vertex form: y = a(x−h)² + k has vertex (h, k) directly — same sign trap as the circle. Axis of symmetry is the vertical line x = h. a > 0 opens up (minimum); a < 0 opens down (maximum).',
        'PARABOLA, standard form: y = ax² + bx + c — the vertex x-coordinate is x = −b/(2a) (do not drop the negative sign or forget to double a before dividing). Plug that x back in to get the y-coordinate.',
      ],
      vocabulary: [
        { term: 'vertex', definition: 'the turning point of a parabola — its minimum (opens up) or maximum (opens down) point.' },
        { term: 'axis of symmetry', definition: 'the vertical line x = h through a parabola\'s vertex; the graph mirrors across it.' },
        { term: 'completing the square', definition: 'rewriting x² + bx as (x + b/2)² − (b/2)² so a general-form circle equation reveals its center and radius.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-distance-midpoint',
      kind: 'worked_example',
      problem: 'Points A(−2, 5) and B(4, −3). Find the distance AB and the midpoint of segment AB.',
      steps: [
        'Distance: d = √[(4−(−2))² + (−3−5)²] = √[(6)² + (−8)²].',
        '6² = 36 and (−8)² = 64, so d = √(36 + 64) = √100 = 10.',
        'Midpoint: M = ((−2+4)/2, (5+(−3))/2) = (2/2, 2/2) = (1, 1).',
        'Sanity check: the midpoint should sit exactly halfway between A and B on both axes — (1, 1) is between x = −2 and x = 4, and between y = 5 and y = −3. ✓',
      ],
      answer: 'Distance = 10; midpoint = (1, 1).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-circle-general-form',
      kind: 'worked_example',
      problem:
        'A circle has equation x² + y² − 6x + 4y − 3 = 0. Find its center and radius. (This is the trap variant — the ACT rarely hands you standard form directly.)',
      steps: [
        'Group x-terms and y-terms, move the constant to the right: (x² − 6x) + (y² + 4y) = 3.',
        'Complete the square on x: half of −6 is −3, squared is 9, so add 9 to both sides.',
        'Complete the square on y: half of 4 is 2, squared is 4, so add 4 to both sides.',
        '(x² − 6x + 9) + (y² + 4y + 4) = 3 + 9 + 4 → (x − 3)² + (y + 2)² = 16.',
        'Match to standard form: h = 3 (from x − 3), and k = −2 — CAREFUL, (y + 2)² means k is negative even though the equation shows a plus sign. r² = 16 → r = 4.',
      ],
      answer: 'Center (3, −2), radius 4.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-perpendicular-slope',
      kind: 'try_yourself',
      problem: 'Line l has equation 2x + 3y = 12. What is the slope of a line perpendicular to l?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '−2/3' },
        { id: 'b', text: '3/2', correct: true },
        { id: 'c', text: '−3/2' },
        { id: 'd', text: '2/3' },
      ],
      expectedAnswer: '3/2',
      hints: [
        'First solve for y to find the slope of l: 3y = −2x + 12 → y = (−2/3)x + 4, so slope of l is −2/3.',
        'Perpendicular slope is the negative reciprocal: flip −2/3 to −3/2, then flip the sign to get 3/2.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-parabola-vertex',
      kind: 'try_yourself',
      problem: 'What is the vertex of the parabola y = x² − 6x + 5?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '(3, −4)', correct: true },
        { id: 'b', text: '(−3, −4)' },
        { id: 'c', text: '(6, 5)' },
        { id: 'd', text: '(3, 4)' },
      ],
      expectedAnswer: '(3, −4)',
      hints: [
        'Vertex x-coordinate: x = −b/(2a) = −(−6)/(2·1) = 6/2 = 3.',
        'Plug x = 3 back in: y = 9 − 18 + 5 = −4.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-circle-radius',
      kind: 'try_yourself',
      problem: 'Type your answer: A circle has equation (x + 1)² + (y − 4)² = 49. What is its radius?',
      responseFormat: 'numeric',
      expectedAnswer: '7',
      hints: [
        'Match against (x − h)² + (y − k)² = r² — you only need r².',
        'r² = 49, so r = √49.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-inverted-slope',
      kind: 'misconception_check',
      question:
        'A student finds the slope between A(1, 2) and B(4, 8) by computing (4−1)/(8−2) = 3/6 = 1/2. What went wrong?',
      commonErrors: [
        {
          answer: '1/2',
          misconception: 'Computed run/rise (Δx/Δy) instead of rise/run (Δy/Δx) — inverted the slope formula, putting the x-difference on top.',
          correctsTo: 'Slope is always Δy over Δx: m = (y₂−y₁)/(x₂−x₁) = (8−2)/(4−1) = 6/3 = 2. Δy goes on top, no exceptions.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Distance = √[(x₂−x₁)² + (y₂−y₁)²]; Midpoint = average the x\'s, average the y\'s — no subtraction.',
        'Slope = Δy/Δx, always y on top. Parallel slopes match; perpendicular slopes are negative reciprocals.',
        'Circle (x−h)²+(y−k)²=r²: the sign inside the parentheses is the OPPOSITE of h and k. If given general form, complete the square.',
        'Parabola vertex form y=a(x−h)²+k gives (h,k) directly; from y=ax²+bx+c, the vertex x is −b/(2a).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.7', cedTitle: 'Coordinate Geometry' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
