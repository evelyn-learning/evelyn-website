/**
 * Digital SAT — Unit 2 CED 2.2: Quadratic Equations & the Discriminant.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.quadratic-equations.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U2_QUADRATIC_EQUATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.quadratic-equations.v1',
  course: 'Digital SAT',
  cedUnit: 2,
  cedTopic: '2.2',
  cedTitle: 'Quadratic Equations & the Discriminant',
  planId: 'evelyn.testprep.dsat.quadratic-equations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.quadratic-equations.v1' }],
  theory: [
    { loId: 'dsat.quadratic-equations', kind: 'framework', title: 'Standard form', content: `STANDARD FORM — ax² + bx + c = 0. Always rearrange to this form (everything on one side, = 0) BEFORE reading off a, b, c. Grabbing coefficients from a non-standard arrangement is a common sign trap.` },
    { loId: 'dsat.quadratic-equations', content: `QUADRATIC FORMULA (always works, even when factoring is hard): x = (−b ± √(b² − 4ac)) / (2a). It ALWAYS produces two branches — the + and the −. Compute both.` },
    { loId: 'dsat.quadratic-equations', content: `FACTORING (fast when it works): find factors of ax² + bx + c as (px + q)(rx + s) where pr = a, qs = c, ps + qr = b.` },
    { loId: 'dsat.quadratic-equations', content: `THE DISCRIMINANT Δ = b² − 4ac tells you the solution count WITHOUT solving. Δ > 0 → two real solutions. Δ = 0 → exactly one real solution (a double root). Δ < 0 → no real solutions.` },
    { loId: 'dsat.quadratic-equations', kind: 'framework', title: 'Trap', content: `TRAP — "EXACTLY ONE SOLUTION" QUESTIONS. "For what value of k does ax² + bx + k = 0 have exactly one real solution?" Set Δ = 0 and solve for the unknown constant — do not try to solve the quadratic itself.` },
    { loId: 'dsat.quadratic-equations', kind: 'framework', title: 'Trap', content: `TRAP — DROPPING THE ± BRANCH. The quadratic formula yields two solutions whenever Δ > 0. Computing only (−b + √Δ)/(2a) and stopping is the single most common quadratic-formula error on the SAT.` },
    { loId: 'dsat.quadratic-equations', kind: 'framework', title: `Vieta's shortcut`, content: `VIETA'S SHORTCUT — sum of solutions = −b/a; product of solutions = c/a. "What is the sum of the solutions?" questions are answered directly from the coefficients, no solving required.` },
    { loId: 'dsat.quadratic-equations', kind: 'framework', title: 'Desmos check', content: `DESMOS CHECK — graph y = ax² + bx + c. The number of x-intercepts IS the real solution count; it is a fast visual check against your discriminant.` },
    { loId: 'dsat.quadratic-equations', kind: 'definition', title: 'discriminant', content: 'Δ = b² − 4ac; its sign tells you the number of real solutions without solving.' },
    { loId: 'dsat.quadratic-equations', kind: 'definition', title: 'double root', content: 'the single repeated solution that occurs when Δ = 0.' },
    { loId: 'dsat.quadratic-equations', kind: 'definition', title: 'no real solutions', content: 'the case when Δ < 0 — the parabola never crosses the x-axis.' },
  ],
  methods: [
    {
      title: 'Worked formula',
      steps: [
        'Already in standard form. Identify a = 2, b = −3, c = −20.',
        'Compute the discriminant: Δ = (−3)² − 4(2)(−20) = 9 + 160 = 169.',
        '√169 = 13, so x = (3 ± 13) / 4 → x = 16/4 = 4 or x = −10/4 = −5/2.',
        'Check: (2x + 5)(x − 4) = 2x² − 8x + 5x − 20 = 2x² − 3x − 20. ✓',
      ],
      example: { problem: 'Solve: 2x² − 3x − 20 = 0', solution: 'x = 4 or x = −5/2' },
      relatedLoIds: ['dsat.quadratic-equations'],
    },
    {
      title: 'Worked discriminant trap',
      steps: [
        `Exactly one real solution means the discriminant equals 0 — do not try to solve for x.`,
        'Δ = b² − 4ac = 12² − 4(3)(k) = 144 − 12k. Set to 0: 144 − 12k = 0.',
        `k = 12. Check: 3x² + 12x + 12 = 3(x² + 4x + 4) = 3(x + 2)² — one double root at x = −2. ✓`,
      ],
      example: { problem: 'For what value of k does 3x² + 12x + k = 0 have exactly one real solution?', solution: 'k = 12' },
      relatedLoIds: ['dsat.quadratic-equations'],
    },
  ],
  pointers: [
    { content: `Δ = 1² − 4(2)(−6) = 1 + 48 = 49, √49 = 7. Compute BOTH branches: (−1 + 7)/4 = 3/2 and (−1 − 7)/4 = −2. Both are solutions unless Δ = 0.`, kind: 'common-error' },
    { content: `Δ = b² − 4ac: Δ > 0 → two real solutions; Δ = 0 → one (double) solution; Δ < 0 → no real solutions.`, kind: 'tip' },
    { content: `"Exactly one solution" questions → set Δ = 0 and solve for the unknown constant, not for x.`, kind: 'tip' },
    { content: `The quadratic formula always yields TWO branches (+ and −) whenever Δ > 0 — compute both before stopping.`, kind: 'tip' },
    { content: `Sum of solutions = −b/a; product = c/a — answers "sum/product of solutions" questions with no solving needed.`, kind: 'tip' },
    { content: `"Exactly one solution" for a quadratic ≠ "exactly one solution" for a system or linear equation. On the SAT, a quadratic with one solution means Δ = 0 (double root); a linear equation with "no solution" means matching slopes/different constants. Check the degree first.`, kind: 'gotcha' },
    { content: `Setting Δ = 0 often gives TWO values of k (e.g., k² − 36 = 0 → k = ±6). If the stem says "the positive value of k" or the answer is student-produced, don't stop at the first root you find.`, kind: 'edge-case' },
    { content: `Watch the sign chain in Δ = b² − 4ac. If c is negative, −4ac ADDS. If b is negative, b² is still positive. Writing −3² instead of (−3)² is the #1 arithmetic slip; in Desmos type parentheses around every negative.`, kind: 'common-error' },
    { content: `Rearrange to = 0 before reading a, b, c. For 3x² = 5x − 2, a = 3, b = −5, c = 2 — not b = 5, c = −2. Same for equations given as x² + 4 = 6x or (x+1)(x−3) = 5 (expand first; the product-of-factors shortcut fails when the right side isn't 0).`, kind: 'gotcha' },
    { content: `Vieta's sum = −b/a, NOT −b/2a (that's the vertex x-value) and NOT −b. For 2x² − 8x − 24 = 0, sum = 8/2 = 4. Note −b/2a = the average of the two roots — half the sum.`, kind: 'vocab-note' },
    { content: `"No real solutions" ≠ "no solutions." If a question asks how many x-intercepts or where the graph crosses the x-axis, Δ < 0 means zero. Never answer "2" just because it's a quadratic.`, kind: 'vocab-note' },
    { content: `If a stem gives a quadratic with an unknown constant and asks for "no real solutions" or "two distinct real solutions," you need an INEQUALITY (Δ < 0 or Δ > 0), not an equation — the answer will be a range or the boundary value of a range.`, kind: 'edge-case' },
    { content: `Before grinding the quadratic formula, glance at Δ: if it's a perfect square (169, 49, 121), the quadratic factors and factoring is faster. If Δ isn't a perfect square, expect a radical in the answer choices — a clean integer answer means you erred.`, kind: 'tip' },
  ],
};
