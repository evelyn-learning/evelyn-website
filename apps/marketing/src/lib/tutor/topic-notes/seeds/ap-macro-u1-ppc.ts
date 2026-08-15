/**
 * AP Macroeconomics — Unit 1 CED 1.3: Production Possibilities Curve.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.ppc.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_PPC: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.ppc.v1',
  course: 'AP Macroeconomics',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'Production Possibilities Curve',
  planId: 'evelyn.ap.macro.ppc.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.ppc.v1' }],
  theory: [
    { loId: 'apmacro.ppc', content: `PRODUCTION POSSIBILITIES CURVE (PPC): a graph showing the MAXIMUM combinations of two goods an economy can produce given its current resources and technology. One good per axis; the endpoints show the maximum of each good if ALL resources go to that one good.` },
    { loId: 'apmacro.ppc', content: `THREE REGIONS. ON the curve: EFFICIENT — all resources fully used; more of one good requires less of the other. INSIDE the curve: INEFFICIENT — wasted resources (unemployment, idle factories); the economy could make more of BOTH goods with what it already has. OUTSIDE the curve: UNATTAINABLE with current resources and technology.` },
    { loId: 'apmacro.ppc', content: `INSIDE vs OUTSIDE is a FEASIBILITY distinction, not "too little vs too much." Inside = feasible but wasteful (fix: use existing resources better). Outside = currently impossible (fix: growth — more resources or better technology). AP tests this distinction with precise language.` },
    { loId: 'apmacro.ppc', content: `OPPORTUNITY COST FROM A PPC: moving between two points ON the curve, opportunity cost = (amount of the good given up) / (amount of the good gained). The slope of the curve at a point ≈ the opportunity cost of the x-axis good in terms of the y-axis good.` },
    { loId: 'apmacro.ppc', content: `BOWED-OUT (concave) SHAPE = LAW OF INCREASING OPPORTUNITY COST. Resources are NOT equally suited to both goods. As production shifts toward good X, the economy first redirects the resources BEST at X, then progressively LESS-suited ones — so each additional unit of X costs MORE forgone Y.` },
    { loId: 'apmacro.ppc', content: `LINEAR (straight-line) PPC = CONSTANT opportunity cost — the special case where resources are equally productive in both goods. Constant slope means every additional unit costs the same. AP problems often use linear PPCs for clean arithmetic; be ready for both shapes.` },
    { loId: 'apmacro.ppc', content: `RIGHTWARD SHIFT (whole curve out) = ECONOMIC GROWTH. Drivers: more resources (population, capital investment, land), better technology, better human capital. Points formerly outside become attainable.` },
    { loId: 'apmacro.ppc', content: `LEFTWARD SHIFT (whole curve in) = CONTRACTION of capacity: war destruction, natural disaster, mass emigration, capital depreciation outpacing investment.` },
    { loId: 'apmacro.ppc', content: `BIASED SHIFT: an improvement specific to ONE good stretches that good's intercept only. Better farming technology moves the wheat intercept out while the computer intercept stays put — the curve rotates outward on the wheat side. Combinations needing more of the unimproved good's old maximum remain unattainable.` },
    { loId: 'apmacro.ppc', content: `AVERAGE vs MARGINAL OPPORTUNITY COST: opportunity cost computed between two points is a chord-based AVERAGE; on a bowed-out curve the MARGINAL opportunity cost varies along the curve. AP usually asks for the chord-based average unless it specifies otherwise.` },
    { loId: 'apmacro.ppc', kind: 'definition', title: 'production possibilities curve', content: `a graph showing the maximum output combinations of two goods given fixed resources and technology.` },
    { loId: 'apmacro.ppc', kind: 'definition', title: 'productive efficiency', content: `producing on the PPC — no wasted resources.` },
    { loId: 'apmacro.ppc', kind: 'definition', title: 'increasing opportunity cost', content: `the bowed-out shape: as you produce more of one good, the opportunity cost of additional units rises.` },
  ],
  methods: [
    {
      title: 'Classify PPC points and compute opportunity cost between them',
      steps: [
        `STEP 1 — SET UP the curve from the endpoints: it runs from the y-axis maximum to the x-axis maximum (bowed out unless the problem says linear).`,
        `STEP 2 — CLASSIFY each given point: compare the point's y-value to the curve's height at that x. Below the curve = INSIDE (inefficient); on it = efficient; above = OUTSIDE (unattainable).`,
        `STEP 3 — COMPUTE the change in each good between the two points: units gained of one good, units lost of the other.`,
        `STEP 4 — OPPORTUNITY COST per unit = (good given up) / (good gained). State the units explicitly ("wheat per computer").`,
        `STEP 5 — INTERPRET and note the average-vs-marginal caveat: between-point cost is a chord average; marginal cost varies along a bowed-out curve.`,
        `STEP 6 — CHECK EFFICIENCY: if a point is inside the curve, the economy could gain some of one good for free by moving out to the curve — name that free improvement to expose the inefficiency.`,
      ],
      example: {
        problem: `An economy's bowed-out PPC has endpoints of 100 computers or 200 bushels of wheat. Point A = (40 computers, 150 wheat) and point C = (90 computers, 80 wheat) are both inside the curve. Compute the opportunity cost of moving from A to C in wheat per computer.`,
        solution: `Computers gained = 90 − 40 = 50. Wheat lost = 150 − 80 = 70. Opportunity cost = 70 / 50 = 1.4 wheat per computer (a chord-based average). Both points are inside the curve, so neither is efficient — at 90 computers the curve allows roughly 87 wheat, so the economy could pick up about 7 more wheat for free by moving out to the curve.`,
      },
      relatedLoIds: ['apmacro.ppc'],
    },
    {
      title: 'Read opportunity cost off a linear PPC',
      steps: [
        `STEP 1 — TAKE the two intercepts (the axis maxima).`,
        `STEP 2 — OPPORTUNITY COST of one x-good unit = (y-intercept) / (x-intercept); the cost of one y-good unit is the reciprocal.`,
        `STEP 3 — STATE that the cost is CONSTANT: a straight line has constant slope, so every additional unit costs the same regardless of the starting point.`,
      ],
      example: {
        problem: `A linear PPC has intercepts of 60 wheat (y-axis) and 30 computers (x-axis). Find the opportunity cost of one computer and of one wheat, and say whether the cost rises as production shifts toward computers.`,
        solution: `One computer costs 60 / 30 = 2 wheat; one wheat costs 30 / 60 = 0.5 computers. Cost is CONSTANT — linear PPC means constant slope, so every computer costs exactly 2 wheat no matter how many are already produced.`,
      },
      relatedLoIds: ['apmacro.ppc'],
    },
  ],
  pointers: [
    { content: 'PPC regions: ON = efficient, INSIDE = inefficient (waste/unemployment), OUTSIDE = unattainable now.', kind: 'tip' },
    { content: 'Opportunity cost between points = (good given up) / (good gained). Always state the units.', kind: 'tip' },
    { content: 'Bowed-out = increasing opportunity cost (resources not equally suited); straight-line = constant.', kind: 'tip' },
    { content: 'Whole-curve rightward shift = growth (more resources, better tech). Biased shift moves only one intercept.', kind: 'tip' },
    { content: 'Unemployment moves the economy INSIDE the curve — it does NOT shift the curve.', kind: 'tip' },
    { content: 'Inside vs outside is about feasibility, not effort: inside is feasible-but-wasteful, outside is impossible today.', kind: 'tip' },
  ],
};
