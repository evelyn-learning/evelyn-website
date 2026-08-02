/**
 * Digital SAT — Unit 1 CED 1.5: Linear Inequalities in One or Two Variables.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.linear-inequalities.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U1_LINEAR_INEQUALITIES: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.linear-inequalities.v1',
  course: 'Digital SAT',
  cedUnit: 1,
  cedTopic: '1.5',
  cedTitle: 'Linear Inequalities in One or Two Variables',
  planId: 'evelyn.testprep.dsat.linear-inequalities.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.linear-inequalities.v1' }],
  theory: [
    { loId: 'dsat.linear-inequalities', content: `BASE PROCEDURE (one variable) — solve exactly like an equation: add, subtract, multiply, divide both sides. One special rule applies.` },
    { loId: 'dsat.linear-inequalities', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — SIGN FLIP. Multiplying or dividing both sides by a NEGATIVE number flips the inequality direction. −6x > 36 → divide by −6 → x < −6 (flipped).` },
    { loId: 'dsat.linear-inequalities', kind: 'framework', title: 'Two-variable form', content: `TWO-VARIABLE FORM — y < mx + b describes a REGION of the coordinate plane, not a line. Solid boundary (≤, ≥) means points ON the line count; dashed boundary (<, >) means they don't.` },
    { loId: 'dsat.linear-inequalities', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — TEST-POINT METHOD. To check whether an ordered pair (x, y) satisfies an inequality, substitute its coordinates directly and evaluate. Don't try to visualize — compute.` },
    { loId: 'dsat.linear-inequalities', kind: 'framework', title: 'Systems of inequalities', content: `SYSTEMS OF INEQUALITIES — a point must satisfy EVERY inequality in the system to be a solution. Check each inequality in turn and reject on the first failure; don't stop after just one passing check.` },
    { loId: 'dsat.linear-inequalities', kind: 'framework', title: 'Constraint word problems', content: `CONSTRAINT WORD PROBLEMS — translate phrases literally: "at least" → ≥, "at most" → ≤, "more than" → >, "fewer than / less than" → <, "no more than" → ≤, "no less than" → ≥.` },
    { loId: 'dsat.linear-inequalities', kind: 'framework', title: 'Desmos check', content: `DESMOS CHECK — Desmos graphs inequalities directly (typing y ≥ 2x − 1 shades the region); use it to verify which point lies in a system's overlap.` },
    { loId: 'dsat.linear-inequalities', kind: 'definition', title: 'boundary line', content: `the line that separates the coordinate plane into the region satisfying the inequality and the region that doesn't.` },
    { loId: 'dsat.linear-inequalities', kind: 'definition', title: 'solution region', content: `the set of all points (x, y) that make an inequality — or every inequality in a system — true.` },
    { loId: 'dsat.linear-inequalities', kind: 'definition', title: 'system of inequalities', content: `two or more inequalities considered together; a solution must satisfy all of them simultaneously.` },
  ],
  methods: [
    {
      title: 'Worked one variable',
      steps: [
        'Subtract 4 from both sides: −3x ≤ 15.',
        'Divide both sides by −3. SIGN FLIPS (dividing by a negative): x ≥ −5.',
        'Check: x = −5 → 4 − 3(−5) = 4 + 15 = 19 ≤ 19 ✓ (boundary). x = 0 → 4 ≤ 19 ✓.',
      ],
      example: { problem: 'Solve for x: 4 − 3x ≤ 19', solution: 'x ≥ −5' },
      relatedLoIds: ['dsat.linear-inequalities'],
    },
    {
      title: 'Worked system test point',
      steps: [
        `Test (4, 2) in y > 2x − 1: is 2 > 2(4) − 1 = 7? No — eliminated immediately, no need to check the second inequality.`,
        `Test (2, 6) in y > 2x − 1: is 6 > 2(2) − 1 = 3? Yes. But a point must pass EVERY inequality — check the second too: y ≤ −x + 5 → is 6 ≤ −2 + 5 = 3? No. Eliminated.`,
        `Test (0, 3): y > 2x − 1 → is 3 > 2(0) − 1 = −1? Yes. y ≤ −x + 5 → is 3 ≤ −0 + 5 = 5? Yes. Both hold.`,
      ],
      example: { problem: `A system consists of y > 2x − 1 and y ≤ −x + 5. Which of the points (4, 2), (2, 6), and (0, 3) is a solution to the system?`, solution: '(0, 3)' },
      relatedLoIds: ['dsat.linear-inequalities'],
    },
  ],
  pointers: [
    { content: `A solution to a system must satisfy ALL inequalities. Checking the second: 6 ≤ −2 + 5 = 3 is FALSE, so (2, 6) is NOT a solution — it only satisfies one of the two inequalities.`, kind: 'common-error' },
    { content: `Solve one-variable inequalities like equations — EXCEPT flip the sign when multiplying or dividing by a negative.`, kind: 'tip' },
    { content: `A two-variable inequality describes a REGION; test a point by substituting its coordinates directly, never by guessing.`, kind: 'tip' },
    { content: `A solution to a SYSTEM of inequalities must satisfy EVERY inequality — check them all before accepting a point.`, kind: 'tip' },
    { content: `Translate constraint word problems literally: "at least" → ≥, "at most" → ≤, "more than" → >, "less than" → <.`, kind: 'tip' },
    { content: `Only flip the sign when you multiply/divide by a negative — NOT when you subtract a negative or move a negative term. In 4 − 3x ≤ 19, subtracting 4 does nothing to the sign; only the ÷(−3) flips it. Flipping too early or twice is the #1 wrong answer on these.`, kind: 'common-error' },
    { content: `If a variable ends up on the right (e.g. 12 < x), rewrite it as x > 12 before matching answer choices. Reading '12 < x' as 'x < 12' is a pure copy error the SAT baits with both x > 12 and x < 12 in the choices.`, kind: 'gotcha' },
    { content: `'Less than' and 'fewer than' as a COMPARISON mean <, but 'a is 5 less than b' means a = b − 5 (subtraction, not an inequality). Read the whole phrase before choosing a symbol.`, kind: 'vocab-note' },
    { content: `'At most 150' includes 150 (≤); 'under/less than 150' excludes it (<). SAT max-value questions often hinge on that one unit: with ≤, spending exactly the budget is legal. In the pens problem, 90 + p ≤ 150 gives 60, not 59.`, kind: 'edge-case' },
    { content: `For 'which point is a solution' items, test choices in the SIMPLER or more restrictive inequality first and eliminate on the first FAILURE. But never accept a point until it passes every inequality — one pass proves nothing.`, kind: 'tip' },
    { content: `Solid vs. dashed matters only at the boundary. If a test point makes the two sides EQUAL, it's a solution for ≤/≥ and not for </>. Check whether the point lands exactly on the line before deciding.`, kind: 'edge-case' },
    { content: `Real-world constraints usually carry hidden restrictions the algebra doesn't: quantities can't be negative and are often whole numbers. If the algebra gives x ≤ 60.4 notebooks, the max is 60 — round DOWN for ≤, UP for ≥.`, kind: 'gotcha' },
    { content: `Don't confuse a system of inequalities with a system of equations: equations have intersection POINTS as solutions; inequalities have an overlapping REGION with infinitely many. A question asking for 'a possible value' is signaling inequalities.`, kind: 'vocab-note' },
  ],
};
