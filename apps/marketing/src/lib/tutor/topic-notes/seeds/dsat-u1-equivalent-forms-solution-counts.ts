/**
 * Digital SAT — Unit 1 CED 1.6: Equivalent Forms & No/Infinite-Solution Traps.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.equivalent-forms-solution-counts.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U1_EQUIVALENT_FORMS_SOLUTION_COUNTS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.equivalent-forms-solution-counts.v1',
  course: 'Digital SAT',
  cedUnit: 1,
  cedTopic: '1.6',
  cedTitle: 'Equivalent Forms & No/Infinite-Solution Traps',
  planId: 'evelyn.testprep.dsat.equivalent-forms-solution-counts.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.equivalent-forms-solution-counts.v1' }],
  theory: [
    { loId: 'dsat.equivalent-forms-solution-counts', kind: 'framework', title: 'Ratio test', content: `RATIO TEST — for ax + by = c and dx + ey = f, compare a/d and b/e first. If they are EQUAL, the lines are parallel or identical (compare c/f next). If they are NOT equal, the lines cross at exactly one point — no need to even look at the constants.` },
    { loId: 'dsat.equivalent-forms-solution-counts', content: `PARALLEL vs IDENTICAL — once a/d = b/e, check c/f. If c/f also equals that ratio, the two equations describe the SAME line: infinitely many solutions. If c/f is different, the lines are parallel but distinct: no solution.` },
    { loId: 'dsat.equivalent-forms-solution-counts', kind: 'framework', title: 'Equivalent equations', content: `EQUIVALENT EQUATIONS — two equations are equivalent only when EVERY term scales by the same factor, including the constant. Scaling the x- and y-coefficients but not the constant (or vice versa) produces a different line, not an equivalent one — this is the SAT's favorite "equivalent form" trap.` },
    { loId: 'dsat.equivalent-forms-solution-counts', kind: 'framework', title: 'Trap', content: `TRAP — SYSTEMS ARE NOT 1.1. A single equation's "no solution" comes from simplifying to a false numeric statement (0 = 7); a system's "no solution" comes from two DIFFERENT lines that happen to be parallel. Don't try to collapse a system to one false statement — run the ratio test instead.` },
    { loId: 'dsat.equivalent-forms-solution-counts', kind: 'framework', title: 'Parameter questions', content: `PARAMETER QUESTIONS — "For what value of k does this system have no solution / infinitely many solutions?" Set up the coefficient-ratio equation FIRST to solve for k (this is the condition for parallel lines), then check whether the constants also match to decide no-solution vs. infinitely-many.` },
    { loId: 'dsat.equivalent-forms-solution-counts', kind: 'framework', title: 'Slope-intercept shortcut', content: `SLOPE-INTERCEPT SHORTCUT — rewriting each equation as y = mx + b works too: same slope + different intercept = no solution; same slope + same intercept = infinitely many; different slope = exactly one solution, regardless of the constants.` },
    { loId: 'dsat.equivalent-forms-solution-counts', kind: 'framework', title: 'Desmos check', content: `DESMOS CHECK — graph both equations. Lines that never meet = no solution, lines that overlap perfectly = infinitely many, lines that cross once = one solution. A fast visual confirmation of the ratio test.` },
    { loId: 'dsat.equivalent-forms-solution-counts', kind: 'definition', title: 'equivalent equations', content: `two equations with identical solution sets — every term of one is the same constant multiple of the other, including the constant term.` },
    { loId: 'dsat.equivalent-forms-solution-counts', kind: 'definition', title: 'coefficient ratio test', content: `comparing a/d and b/e (and then c/f) for two equations ax+by=c and dx+ey=f to classify a system's solution count without solving it.` },
    { loId: 'dsat.equivalent-forms-solution-counts', kind: 'definition', title: 'inconsistent system', content: `a system with no solution — the equations describe parallel, non-identical lines.` },
    { loId: 'dsat.equivalent-forms-solution-counts', kind: 'definition', title: 'consistent system', content: `a system with at least one solution — either exactly one (intersecting lines) or infinitely many (identical lines).` },
  ],
  methods: [
    {
      title: 'Worked equivalent form',
      steps: [
        `Divide every term of 6x − 9y = 15 by 3: 6x/3 − 9y/3 = 15/3, which gives 2x − 3y = 5.`,
        `That matches the second equation exactly, term for term — including the constant. Every (x, y) that satisfies one satisfies the other.`,
        `The claim is TRUE: the equations are equivalent (same line). Contrast this with scaling only the coefficients — if the right side had NOT reduced to 5, the two equations would describe different, parallel lines instead.`,
      ],
      example: { problem: `A student claims that 6x − 9y = 15 is equivalent to 2x − 3y = 5. Verify the claim.`, solution: 'Equivalent — dividing 6x − 9y = 15 by 3 yields 2x − 3y = 5 exactly.' },
      relatedLoIds: ['dsat.equivalent-forms-solution-counts'],
    },
    {
      title: 'Worked parameter no solution',
      steps: [
        `Run the ratio test on the x- and y-coefficients: a/d = 2/4 = 1/2. Set b/e equal to that same ratio: 3/k = 1/2, so k = 6.`,
        `Check the constants ratio: c/f = 7/9 ≈ 0.78. That does NOT equal 1/2, so the lines are parallel but not identical.`,
        `Because the coefficient ratio matches but the constant ratio doesn't, k = 6 gives NO solution. (If 7/9 had also equaled 1/2, the same coefficient condition would instead give infinitely many solutions.)`,
      ],
      example: { problem: `For what value of k does the system 2x + 3y = 7 and 4x + ky = 9 have no solution?`, solution: 'k = 6 (no solution)' },
      relatedLoIds: ['dsat.equivalent-forms-solution-counts'],
    },
  ],
  pointers: [
    { content: `The coefficients scaled by 2 (3 → 6, 5 → 10), so the constant must scale by 2 as well: 9 × 2 = 18. k = 18 makes 6x + 10y = 18 identical to 3x + 5y = 9 — that's what gives infinitely many solutions.`, kind: 'common-error' },
    { content: `Ratio test first: compare a/d and b/e. Equal → parallel or identical (check c/f next). Not equal → exactly one solution, no need to check constants.`, kind: 'tip' },
    { content: `Equivalent equations scale EVERY term by the same factor, including the constant — scaling only some terms is the SAT's favorite "equivalent form" trap.`, kind: 'tip' },
    { content: `A system's no-solution / infinite-solutions test is NOT the 1.1 single-equation test (false statement vs. identity) — use the coefficient ratio or slope comparison instead.`, kind: 'tip' },
    { content: `Desmos check: graph both lines. Never meet = no solution, overlap = infinitely many, cross once = one solution.`, kind: 'tip' },
    { content: `Line up the variables in the SAME ORDER before taking ratios. If one equation reads 3y + 2x = 7 and the other 4x + ky = 9, rewrite both as ax + by = c first — pairing 3 with 4 instead of 2 with 4 is the fastest way to get k wrong.`, kind: 'common-error' },
    { content: `Sign check: a negative coefficient makes the ratio negative. For 2x − 3y = 7 and −4x + ky = 1, a/d = 2/(−4) = −1/2, so −3/k = −1/2 gives k = 6, not −6. Carry the minus sign into the ratio equation, not into the answer at the end.`, kind: 'common-error' },
    { content: `For infinitely-many parameter questions, find the scale factor from the coefficients FIRST, then multiply the constant by it. Don't copy the original constant. 3x+5y=9 vs 6x+10y=k scales by 2, so k = 18 — 9 is the planted trap answer.`, kind: 'gotcha' },
    { content: `Read the stem's direction of scaling. If the second equation is the SMALLER one (4x+6y=14 vs 2x+3y=c), the factor is 1/2, so c = 7, not 28. Multiplying when you should divide flips a correct method into a wrong answer.`, kind: 'edge-case' },
    { content: `Watch the stem's exact phrasing: "no solution" and "infinitely many solutions" often produce the SAME k (parallel condition) — only the constants distinguish them. A question asking for "exactly one solution" wants every k EXCEPT that value.`, kind: 'vocab-note' },
    { content: `"Which equation is equivalent to..." answer choices are built from partial scaling: correct coefficients but unscaled constant, or scaled constant with original coefficients. Scan the CONSTANT of each choice first — it eliminates two options instantly.`, kind: 'tip' },
    { content: `Don't reach for substitution or elimination on solution-count questions. Eliminating variables in a no-solution system gives 0 = 5 and in an infinite system gives 0 = 0 — correct but slow. The ratio test answers it in one comparison.`, kind: 'tip' },
    { content: `If a/d ≠ b/e, stop — exactly one solution, no matter how weird the constants look. Questions that show a scary constant (like 0 or a fraction) are baiting you into extra work on a system that's already classified.`, kind: 'gotcha' },
  ],
};
