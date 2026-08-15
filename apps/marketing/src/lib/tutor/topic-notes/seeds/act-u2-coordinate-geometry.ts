/**
 * ACT — Unit 2 CED 2.7: Coordinate Geometry.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.coordinate-geometry.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U2_COORDINATE_GEOMETRY: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.coordinate-geometry.v1',
  course: 'ACT',
  cedUnit: 2,
  cedTopic: '2.7',
  cedTitle: 'Coordinate Geometry',
  planId: 'evelyn.testprep.act.coordinate-geometry.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.coordinate-geometry.v1' }],
  theory: [
    { loId: 'act.coordinate-geometry', content: `DISTANCE between (x₁,y₁) and (x₂,y₂): d = √[(x₂−x₁)² + (y₂−y₁)²]. It is just the Pythagorean theorem laid over the plane — the horizontal and vertical gaps are the legs.` },
    { loId: 'act.coordinate-geometry', content: `MIDPOINT between (x₁,y₁) and (x₂,y₂): M = ((x₁+x₂)/2, (y₁+y₂)/2) — average the x's, average the y's. Do not confuse this with slope; midpoint has no subtraction at all.` },
    { loId: 'act.coordinate-geometry', content: `SLOPE between (x₁,y₁) and (x₂,y₂): m = (y₂−y₁)/(x₂−x₁) — Δy always goes on TOP. Whatever point you call "point 2" in the numerator must also be "point 2" in the denominator, or the sign flips.` },
    { loId: 'act.coordinate-geometry', content: `PARALLEL lines have EQUAL slopes. PERPENDICULAR lines have slopes that are NEGATIVE RECIPROCALS (m₁ × m₂ = −1) — flip the fraction AND change the sign.` },
    { loId: 'act.coordinate-geometry', content: `CIRCLE, standard form: (x−h)² + (y−k)² = r², center (h, k), radius r. TRAP: the signs inside the parentheses are the OPPOSITE of the center coordinates — (x−3)² means h = 3, but (x+3)² means h = −3.` },
    { loId: 'act.coordinate-geometry', content: `CIRCLE, general form: x² + y² + Dx + Ey + F = 0. The ACT loves handing you this scrambled version — you must COMPLETE THE SQUARE on the x-terms and the y-terms separately to recover (h, k) and r.` },
    { loId: 'act.coordinate-geometry', content: `PARABOLA, vertex form: y = a(x−h)² + k has vertex (h, k) directly — same sign trap as the circle. Axis of symmetry is the vertical line x = h. a > 0 opens up (minimum); a < 0 opens down (maximum).` },
    { loId: 'act.coordinate-geometry', content: `PARABOLA, standard form: y = ax² + bx + c — the vertex x-coordinate is x = −b/(2a) (do not drop the negative sign or forget to double a before dividing). Plug that x back in to get the y-coordinate.` },
    { loId: 'act.coordinate-geometry', kind: 'definition', title: 'vertex', content: `the turning point of a parabola — its minimum (opens up) or maximum (opens down) point.` },
    { loId: 'act.coordinate-geometry', kind: 'definition', title: 'axis of symmetry', content: `the vertical line x = h through a parabola's vertex; the graph mirrors across it.` },
    { loId: 'act.coordinate-geometry', kind: 'definition', title: 'completing the square', content: `rewriting x² + bx as (x + b/2)² − (b/2)² so a general-form circle equation reveals its center and radius.` },
  ],
  methods: [
    {
      title: 'Worked distance midpoint',
      steps: [
        'Distance: d = √[(4−(−2))² + (−3−5)²] = √[(6)² + (−8)²].',
        '6² = 36 and (−8)² = 64, so d = √(36 + 64) = √100 = 10.',
        'Midpoint: M = ((−2+4)/2, (5+(−3))/2) = (2/2, 2/2) = (1, 1).',
        `Sanity check: the midpoint should sit exactly halfway between A and B on both axes — (1, 1) is between x = −2 and x = 4, and between y = 5 and y = −3. ✓`,
      ],
      example: { problem: `Points A(−2, 5) and B(4, −3). Find the distance AB and the midpoint of segment AB.`, solution: 'Distance = 10; midpoint = (1, 1).' },
      relatedLoIds: ['act.coordinate-geometry'],
    },
    {
      title: 'Worked circle general form',
      steps: [
        `Group x-terms and y-terms, move the constant to the right: (x² − 6x) + (y² + 4y) = 3.`,
        `Complete the square on x: half of −6 is −3, squared is 9, so add 9 to both sides.`,
        'Complete the square on y: half of 4 is 2, squared is 4, so add 4 to both sides.',
        '(x² − 6x + 9) + (y² + 4y + 4) = 3 + 9 + 4 → (x − 3)² + (y + 2)² = 16.',
        `Match to standard form: h = 3 (from x − 3), and k = −2 — CAREFUL, (y + 2)² means k is negative even though the equation shows a plus sign. r² = 16 → r = 4.`,
      ],
      example: { problem: `A circle has equation x² + y² − 6x + 4y − 3 = 0. Find its center and radius. (This is the trap variant — the ACT rarely hands you standard form directly.)`, solution: 'Center (3, −2), radius 4.' },
      relatedLoIds: ['act.coordinate-geometry'],
    },
  ],
  pointers: [
    { content: `Slope is always Δy over Δx: m = (y₂−y₁)/(x₂−x₁) = (8−2)/(4−1) = 6/3 = 2. Δy goes on top, no exceptions.`, kind: 'common-error' },
    { content: `Distance = √[(x₂−x₁)² + (y₂−y₁)²]; Midpoint = average the x's, average the y's — no subtraction.`, kind: 'tip' },
    { content: `Slope = Δy/Δx, always y on top. Parallel slopes match; perpendicular slopes are negative reciprocals.`, kind: 'tip' },
    { content: `Circle (x−h)²+(y−k)²=r²: the sign inside the parentheses is the OPPOSITE of h and k. If given general form, complete the square.`, kind: 'tip' },
    { content: `Parabola vertex form y=a(x−h)²+k gives (h,k) directly; from y=ax²+bx+c, the vertex x is −b/(2a).`, kind: 'tip' },
    { content: `The ACT's favorite circle trap: the equation ends in \`= 49\`, and the answer choices include both 49 and 7. That number is r², not r. Radius = √(right side); diameter = 2√(right side). Reread whether the question asks radius, diameter, or area.`, kind: 'gotcha' },
    { content: `"Endpoint" problems reverse the midpoint formula. Given one endpoint A and midpoint M, the other endpoint is (2Mx − Ax, 2My − Ay) — NOT M minus A. Quick check: your answer should be the same distance past M as A is before it.`, kind: 'edge-case' },
    { content: `Perpendicular slope from Ax + By = C: don't graph it. The line's slope is −A/B, so the perpendicular slope is B/A. For 2x + 3y = 12 that's 3/2 instantly. Just remember to solve for y if you're unsure of the sign.`, kind: 'tip' },
    { content: `Negative reciprocal has TWO steps — flip AND negate. If m = −2/5, perpendicular is +5/2, not −5/2 or 2/5. Distractors always include the flip-only and the negate-only versions. Multiply your two slopes: must equal exactly −1.`, kind: 'common-error' },
    { content: `Horizontal lines have slope 0; vertical lines have UNDEFINED slope (not 0). A line perpendicular to y = 4 is vertical (x = c), and "undefined" is a real ACT answer choice. Zero denominator = undefined, zero numerator = 0.`, kind: 'edge-case' },
    { content: `Complete the square by adding to BOTH sides. If you write (x²−6x+9)+(y²+4y+4)=3 without adding 9 and 4 to the right, you'll get r²=3 instead of 16. Also: if the equation starts with 2x²+2y², divide everything by 2 first.`, kind: 'common-error' },
    { content: `For y = ax² + bx + c, −b/(2a) gives only the x-coordinate. If the question asks for the vertex, the minimum VALUE, or the maximum height, you must plug x back in. "Axis of symmetry" wants x = −b/(2a) alone — read the stem's exact noun.`, kind: 'vocab-note' },
    { content: `Distance questions often hide behind other words: "length of the segment," "perimeter of the triangle," "how far apart," or the radius from a center to a point on a circle. Recognize them all as the same √[(Δx)² + (Δy)²].`, kind: 'tip' },
  ],
};
