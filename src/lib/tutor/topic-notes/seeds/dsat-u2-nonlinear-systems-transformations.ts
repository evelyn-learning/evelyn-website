/**
 * Digital SAT — Unit 2 CED 2.6: Nonlinear Systems & Function Transformations.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.nonlinear-systems-transformations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U2_NONLINEAR_SYSTEMS_TRANSFORMATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.nonlinear-systems-transformations.v1',
  course: 'Digital SAT',
  cedUnit: 2,
  cedTopic: '2.6',
  cedTitle: 'Nonlinear Systems & Function Transformations',
  planId: 'evelyn.testprep.dsat.nonlinear-systems-transformations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.nonlinear-systems-transformations.v1' }],
  theory: [
    { loId: 'dsat.nonlinear-systems-transformations', kind: 'framework', title: 'Nonlinear system', content: `NONLINEAR SYSTEM — one linear equation and one quadratic (or other nonlinear) equation solved together. Solve the LINEAR equation for a variable, then SUBSTITUTE into the quadratic to collapse to one variable.` },
    { loId: 'dsat.nonlinear-systems-transformations', content: `The substitution always produces a ONE-VARIABLE QUADRATIC. Solve it by factoring or the quadratic formula, then back-substitute into the linear equation (never the quadratic — it is easier and the linear one is exact) to get the paired coordinate.` },
    { loId: 'dsat.nonlinear-systems-transformations', content: `SOLUTION COUNT = number of intersection points = a discriminant question on the RESULTING quadratic, not the original one. Δ > 0 → two solutions (line crosses the parabola twice). Δ = 0 → exactly one solution (line is TANGENT). Δ < 0 → no real solutions (line misses the parabola).` },
    { loId: 'dsat.nonlinear-systems-transformations', kind: 'framework', title: 'Trap', content: `TRAP — "for what value of k does the system have exactly one solution?" Students often set the discriminant of the ORIGINAL quadratic to zero. Substitute FIRST, THEN take the discriminant of the combined equation.` },
    { loId: 'dsat.nonlinear-systems-transformations', content: `FUNCTION TRANSFORMATIONS from a base function f(x): f(x − h) shifts RIGHT h units; f(x + h) shifts LEFT h units — the sign INSIDE is the opposite of the direction. f(x) + k shifts UP k; f(x) − k shifts DOWN k.` },
    { loId: 'dsat.nonlinear-systems-transformations', content: `REFLECTIONS: −f(x) reflects over the x-axis (flips every y-value). f(−x) reflects over the y-axis (flips every x-value). Reflecting negates the WHOLE expression on that side, not just one term.` },
    { loId: 'dsat.nonlinear-systems-transformations', content: `STRETCH/COMPRESSION: a·f(x) with |a| > 1 stretches vertically (taller); 0 < |a| < 1 compresses vertically (flatter). The sign of a also reflects: negative a both flips and scales.` },
    { loId: 'dsat.nonlinear-systems-transformations', content: `ORDER MATTERS when combining transformations. Apply them in the order stated — shift first then reflect gives a different result than reflect first then shift, unless it is purely a horizontal-then-horizontal or vertical-then-vertical chain.` },
    { loId: 'dsat.nonlinear-systems-transformations', kind: 'definition', title: 'nonlinear system', content: `a system where at least one equation is not linear (e.g., a line and a parabola); solved by substitution into a one-variable equation.` },
    { loId: 'dsat.nonlinear-systems-transformations', kind: 'definition', title: 'tangent', content: `a line that touches a curve at exactly one point — the substituted equation has discriminant zero.` },
    { loId: 'dsat.nonlinear-systems-transformations', kind: 'definition', title: 'reflection', content: `flipping a graph across an axis: −f(x) flips over the x-axis, f(−x) flips over the y-axis.` },
    { loId: 'dsat.nonlinear-systems-transformations', kind: 'definition', title: 'vertical stretch/compression', content: 'multiplying f(x) by a constant a; |a| > 1 stretches, 0 < |a| < 1 compresses.' },
  ],
  methods: [
    {
      title: 'Worked nonlinear system',
      steps: [
        `Substitute the linear expression for y into the quadratic equation: x + 1 = x² − 5.`,
        `Collect everything on one side and factor: x² − x − 6 = 0 → (x − 3)(x + 2) = 0, so x = 3 or x = −2.`,
        `Back-substitute into the LINEAR equation (faster): x = 3 → y = 4; x = −2 → y = −1. Check in the quadratic: 3² − 5 = 4 ✓ and (−2)² − 5 = −1 ✓.`,
      ],
      example: { problem: 'Solve the system: y = x + 1 and y = x² − 5', solution: '(3, 4) and (−2, −1)' },
      relatedLoIds: ['dsat.nonlinear-systems-transformations'],
    },
    {
      title: 'Worked transformation trap',
      steps: [
        `Shift LEFT 2 first: replace x with (x + 2) inside f. f(x + 2) = (x + 2)² − 4(x + 2) = x² + 4x + 4 − 4x − 8 = x² − 4.`,
        `TRAP — reflecting over the x-axis comes SECOND and negates the ENTIRE shifted expression, not just one term: g(x) = −(x² − 4) = −x² + 4.`,
        `Check with the vertex: f(x) = (x − 2)² − 4 has vertex (2, −4). Shifting left 2 moves the vertex to (0, −4). Reflecting over the x-axis flips the y-coordinate to (0, 4) — which matches the vertex of g(x) = −x² + 4. ✓`,
      ],
      example: { problem: `The graph of f(x) = x² − 4x is shifted 2 units LEFT, then reflected over the x-axis, to form g(x). Write g(x) in standard form.`, solution: 'g(x) = −x² + 4' },
      relatedLoIds: ['dsat.nonlinear-systems-transformations'],
    },
  ],
  pointers: [
    { content: `g(x) = f(x + 4) = f(x − (−4)), so h = −4: the shift is LEFT 4, not right. Quick check: if f(0) = c, then g(−4) = f(−4 + 4) = f(0) = c, so the point that used to sit at x = 0 now sits at x = −4 — a move in the negative (left) direction.`, kind: 'common-error' },
    { content: `Nonlinear system: solve the linear equation for a variable, substitute into the quadratic, solve the resulting one-variable quadratic, back-substitute into the LINEAR equation.`, kind: 'tip' },
    { content: `Solution count comes from the discriminant of the SUBSTITUTED equation: Δ > 0 two solutions, Δ = 0 tangent (one), Δ < 0 none.`, kind: 'tip' },
    { content: `f(x − h) shifts right h; f(x + h) shifts left h — sign inside is opposite the direction. f(x) + k / − k shifts up/down.`, kind: 'tip' },
    { content: `−f(x) reflects over the x-axis; f(−x) reflects over the y-axis — apply transformations in the stated order.`, kind: 'tip' },
    { content: `Discriminant-zero k problems usually give TWO answers (k² = 36 → k = ±6). Read the stem: "positive value of k," "greatest value," or an SPR box that accepts one answer. Solve the quadratic in k fully, then pick the one the question names.`, kind: 'gotcha' },
    { content: `When you substitute a shift, replace EVERY x, not just the squared one. For f(x) = x² − 4x, f(x + 2) = (x + 2)² − 4(x + 2) — forgetting the linear term is the #1 algebra slip on transformation-to-standard-form items.`, kind: 'common-error' },
    { content: `Order matters within the same direction too: 2·f(x) + 3 (stretch then shift up) ≠ 2·(f(x) + 3) (shift then stretch). If the problem says "stretched vertically by 2, then shifted up 3," the +3 stays OUTSIDE the multiplication.`, kind: 'edge-case' },
    { content: `f(x) = x² is even, so f(−x) = f(x): a y-axis reflection leaves it unchanged. The SAT uses this — if an answer choice reflects a symmetric graph over the y-axis and claims a change, it's wrong. Check symmetry before assuming a reflection moves anything.`, kind: 'gotcha' },
    { content: `A HORIZONTAL line y = c meets a parabola exactly once only when c equals the vertex's y-value. For "how many solutions" with y = constant, just compare c to the vertex instead of running the discriminant — faster and error-proof.`, kind: 'tip' },
    { content: `Inside the parentheses ≠ vertical. f(2x) compresses horizontally by 1/2 (not a stretch); f(x/2) stretches horizontally. Anything touching x acts on the x-direction and does the OPPOSITE of what the number suggests.`, kind: 'vocab-note' },
    { content: `After solving the system, reread what's asked: intersection points, only the x-coordinates, the y-coordinate of the point in Quadrant II, or x + y. Circling the right pair but answering the wrong quantity is a pure-points loss.`, kind: 'common-error' },
    { content: `"No real solutions" (Δ < 0) means the line MISSES the parabola on the xy-plane — not that the system is unsolvable in some other way. If an answer choice says "the graphs do not intersect," that's the same statement.`, kind: 'vocab-note' },
  ],
};
