/**
 * Algebra 1 — Unit 5 CED 5.4: Systems Word Problems & Systems of Inequalities.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.alg1.systems-applications.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ALG1_U5_SYSTEMS_APPLICATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.alg1.systems-applications.v1',
  course: 'Algebra 1',
  cedUnit: 5,
  cedTopic: '5.4',
  cedTitle: 'Systems Word Problems & Systems of Inequalities',
  planId: 'evelyn.hs.alg1.systems-applications.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.alg1.systems-applications.v1' }],
  theory: [
    { loId: 'alg1.systems-applications', kind: 'framework', title: 'Step 1', content: `STEP 1 — DEFINE with units. Write it out: "Let x = number of adult tickets, y = number of student tickets." Undefined variables are the number-one cause of a scrambled system.` },
    { loId: 'alg1.systems-applications', kind: 'framework', title: 'Step 2', content: `STEP 2 — ONE CONSTRAINT, ONE EQUATION. Two unknowns need two independent facts. The classic pairs are count + total value, total volume + total ingredient, and time + distance.` },
    { loId: 'alg1.systems-applications', kind: 'framework', title: 'Step 3', content: `STEP 3 — TRANSLATION PATTERNS. COUNT-AND-VALUE: x + y = 180 (how many) and 12x + 8y = 1760 (how much). MIXTURE: x + y = 60 (total mL) and 0.20x + 0.50y = 0.30(60) (total acid). RATE WITH A CURRENT: b + c = downstream speed and b − c = upstream speed, where b = boat speed and c = current speed.` },
    { loId: 'alg1.systems-applications', kind: 'framework', title: 'Step 4', content: `STEP 4 — PICK THE CHEAPER METHOD. Substitution when one equation is already solved for a variable or has a coefficient of 1 (like x + y = 180). Elimination when both sit in Ax + By = C form with matching or easily matched coefficients.` },
    { loId: 'alg1.systems-applications', kind: 'framework', title: 'Step 5', content: `STEP 5 — INTERPRET AND CHECK. "x = 80" is not the answer; "80 adult tickets" is. Then test the pair in BOTH original sentences, and reject nonsense like negative tickets or 2.5 people.` },
    { loId: 'alg1.systems-applications', kind: 'framework', title: 'Inequalities', content: `INEQUALITIES — GRAPH EACH BOUNDARY. Rewrite each inequality in y = mx + b form and graph the boundary line: DASHED for < or > (points on the line do not count), SOLID for ≤ or ≥ (they do).` },
    { loId: 'alg1.systems-applications', kind: 'framework', title: 'Inequalities', content: `INEQUALITIES — SHADE THE TRUE SIDE. In y = form, y > shades above the line and y < shades below. If you rearranged and are unsure, test (0, 0): if it makes the inequality true, shade the side containing the origin.` },
    { loId: 'alg1.systems-applications', content: `THE SOLUTION IS THE OVERLAP. A point solves the system only if it satisfies EVERY inequality, so the answer is the region where all the shadings pile up — not the whole shaded page. Sanity-check by testing one point from inside it.` },
    { loId: 'alg1.systems-applications', kind: 'definition', title: 'constraint', content: `a fact from the problem that limits the variables — each one becomes a single equation or inequality.` },
    { loId: 'alg1.systems-applications', kind: 'definition', title: 'half-plane', content: `everything on one side of a boundary line; the shaded solution set of one linear inequality.` },
  ],
  methods: [
    {
      title: 'Worked tickets',
      steps: [
        'Define: x = adult tickets, y = student tickets.',
        'Constraint 1 (how many): x + y = 180.',
        'Constraint 2 (how much): 12x + 8y = 1760.',
        'Equation 1 has coefficient 1, so substitute: y = 180 − x.',
        '12x + 8(180 − x) = 1760 → 12x + 1440 − 8x = 1760 → 4x = 320 → x = 80.',
        'Back-substitute: y = 180 − 80 = 100.',
        `Interpret and check: 80 adult and 100 student tickets. 80 + 100 = 180 ✓ and 12(80) + 8(100) = 960 + 800 = 1760 ✓.`,
      ],
      example: { problem: `A school play sold adult tickets for $12 and student tickets for $8. They sold 180 tickets and collected $1,760. How many of each were sold?`, solution: '80 adult tickets and 100 student tickets' },
      relatedLoIds: ['alg1.systems-applications'],
    },
    {
      title: 'Worked inequality region',
      steps: [
        `Rewrite the first inequality in y = form: y ≤ −x + 6. Boundary y = −x + 6 is SOLID (≤) and you shade BELOW it.`,
        `The second is already in y = form: y > 2x − 3. Boundary y = 2x − 3 is DASHED (>) and you shade ABOVE it.`,
        `The boundaries cross where −x + 6 = 2x − 3 → 9 = 3x → x = 3, y = 3, so the overlap is the wedge with corner (3, 3) opening to the left.`,
        `Test (1, 4): 1 + 4 = 5 ≤ 6 ✓ and 4 > 2(1) − 3 = −1 ✓. Both true, so (1, 4) is a solution.`,
        `Test (3, 3): 3 + 3 = 6 ≤ 6 ✓ — the solid line counts. But 3 > 2(3) − 3 = 3 is FALSE, since 3 is not greater than 3.`,
        `Edge case to remember: the corner point sits on the DASHED boundary, so it is excluded. A point must satisfy every inequality, not just most of them.`,
      ],
      example: { problem: `Graph the system x + y ≤ 6 and y > 2x − 3, then decide whether (1, 4) and (3, 3) are solutions.`, solution: '(1, 4) is a solution; (3, 3) is not — it lies on the dashed boundary' },
      relatedLoIds: ['alg1.systems-applications'],
    },
  ],
  pointers: [
    { content: `Inside an equation, 20% means the multiplier 0.20. The acid equation is 0.20x + 0.50y = 0.30(60) = 18. Solving with y = 60 − x gives 0.20x + 30 − 0.50x = 18 → −0.30x = −12 → x = 40 mL of the 20% and y = 20 mL of the 50%. (You may clear the decimals by multiplying the whole equation by 100 — just do it to every term.)`, kind: 'common-error' },
    { content: 'Define both variables with units before writing a single equation.', kind: 'tip' },
    { content: `Each fact in the paragraph becomes exactly one equation: count with count, value with value.`, kind: 'tip' },
    { content: `Substitution when a coefficient is 1; elimination when both equations are in Ax + By = C form.`, kind: 'tip' },
    { content: 'Percents become decimals before they enter an equation: 20% → 0.20.', kind: 'tip' },
    { content: `Inequalities: dashed for < and >, solid for ≤ and ≥; shade each half-plane, and the solution is the OVERLAP.`, kind: 'tip' },
    { content: 'Interpret in context and check the pair in both original constraints.', kind: 'tip' },
    { content: `Don't mix the count equation with the value equation. \`x + y = 180\` counts tickets; \`12x + 8y = 1760\` counts dollars. Writing \`12x + 8y = 180\` or \`x + y = 1760\` mismatches the units — check that both sides of each equation measure the same thing.`, kind: 'common-error' },
    { content: `Percents become decimals *before* they enter an equation: 20% → 0.20, not 20. If decimals bother you, multiply EVERY term by 100 (including the right side) — \`20x + 50y = 1800\`.`, kind: 'common-error' },
    { content: `In current/wind problems, downstream = b + c and upstream = b − c, and those are SPEEDS, not distances. Convert first: 36 km in 3 h → 12 km/h. Plugging 36 in for the speed is the classic wreck.`, kind: 'gotcha' },
    { content: `A point on a DASHED boundary is never a solution, even if every other inequality checks out. (3, 3) satisfies x + y ≤ 6 but fails y > 2x − 3 because 3 > 3 is false. "Satisfies most" = not a solution.`, kind: 'edge-case' },
    { content: `"Shade above for y >" only works once the inequality is in y = mx + b form. If you divided or multiplied by a negative to get there, the inequality symbol FLIPS. When unsure, test (0, 0) instead of guessing a side.`, kind: 'gotcha' },
    { content: `Say "constraint" and "half-plane" precisely: a constraint is one fact → one equation or inequality; a half-plane is the shading for ONE inequality. The solution set of the system is the OVERLAP of half-planes, not all the shaded area.`, kind: 'vocab-note' },
    { content: `"x = 80" is not a finished answer. Write "80 adult tickets and 100 student tickets" — and reject answers that make no sense in context: negative tickets, 2.5 people, or a current faster than the boat.`, kind: 'tip' },
    { content: `Check your pair in BOTH original sentences, not in the rearranged equation you solved. A substitution slip often still satisfies the equation you altered while failing the other constraint.`, kind: 'tip' },
  ],
};
