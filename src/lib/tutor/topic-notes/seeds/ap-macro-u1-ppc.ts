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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.ppc.v1' }],
  theory: [
    { loId: 'apmacro.ppc', content: `PRODUCTION POSSIBILITIES CURVE (PPC): a graph showing the maximum combinations of two goods an economy can produce given its current resources and technology. X-axis = one good; Y-axis = the other. The endpoints show the maximum of each good if all resources go to that one.` },
    { loId: 'apmacro.ppc', content: `POINTS ON the curve: efficient. The economy is using all its resources fully — it cannot make more of one good without making less of the other.` },
    { loId: 'apmacro.ppc', content: `POINTS INSIDE the curve: INEFFICIENT. The economy is wasting resources — unemployed workers, idle factories, or production inefficiency. It could produce more of BOTH goods just by using existing resources better.` },
    { loId: 'apmacro.ppc', content: `POINTS OUTSIDE the curve: UNATTAINABLE with current resources and technology. Reaching them requires either more resources (workforce growth, capital investment) or better technology.` },
    { loId: 'apmacro.ppc', content: `OPPORTUNITY COST FROM A PPC: moving from one point ON the curve to another. The amount of one good given up is the opportunity cost of the additional units of the other good. Slope of the curve at a point ≈ opportunity cost of the X-good in terms of the Y-good.` },
    { loId: 'apmacro.ppc', content: `BOWED-OUT shape: the typical PPC is concave (bowed out from origin) because resources are NOT EQUALLY SUITED to producing both goods. As you produce more of good X, you must use resources less and less suited to X — opportunity cost RISES. This is the LAW OF INCREASING OPPORTUNITY COST.` },
    { loId: 'apmacro.ppc', content: `LINEAR (straight-line) PPC: occurs when resources ARE equally suited to both goods (or when only one resource matters). Constant opportunity cost. AP problems often use linear PPCs to make the arithmetic clean — be ready for both shapes.` },
    { loId: 'apmacro.ppc', content: `RIGHTWARD SHIFT (whole curve moves out): ECONOMIC GROWTH. Drivers: more resources (population, capital, land), better technology, better human capital. Now points formerly outside the curve become attainable.` },
    { loId: 'apmacro.ppc', content: `LEFTWARD SHIFT (whole curve moves in): contraction. War destruction, natural disaster, mass emigration, capital depreciation outpacing investment.` },
    { loId: 'apmacro.ppc', content: `BIASED SHIFT (one axis stretches, the other does not): a resource or technology improvement specific to one good. E.g. better farming tech shifts the wheat-axis intercept out but not the computer-axis.` },
    { loId: 'apmacro.ppc', kind: 'definition', title: 'production possibilities curve', content: `a graph showing the maximum output combinations of two goods given fixed resources and technology.` },
    { loId: 'apmacro.ppc', kind: 'definition', title: 'productive efficiency', content: 'producing on the PPC — no wasted resources.' },
    { loId: 'apmacro.ppc', kind: 'definition', title: 'increasing opportunity cost', content: `the bowed-out shape: as you produce more of one good, the opportunity cost of additional units rises.` },
  ],
  methods: [
    {
      title: 'Worked ppc economy',
      steps: [
        `STEP 1 — DRAW or visualize the PPC. The curve runs from (0, 200) on the wheat axis to (100, 0) on the computer axis, bowing outward. (The whiteboard tool can render this from xAxis={Computers, 100}, yAxis={Wheat, 200}, curve=bowed-out, points=[A,B,C].)`,
        `STEP 2 — CLASSIFY each point. A = (40, 150): is 150 wheat above or below the curve at x=40? For a bowed-out curve, y at x=40 ≈ 200·√(1-(40/100)²) = 200·√0.84 ≈ 183. Since 150 < 183, A is INSIDE the curve — INEFFICIENT.`,
        `STEP 3 — Classify B = (40, 100). At x=40 the curve is ≈183. 100 < 183, so B is also INSIDE — even more inefficient than A.`,
        `STEP 4 — Classify C = (90, 80). At x=90 the curve is ≈ 200·√(1-0.81) = 200·√0.19 ≈ 87. C's y = 80 < 87, so C is also INSIDE (just barely). Note: AP problems often place at least one point ON the curve. Here all three are inside, which is plausible if the economy has unemployment.`,
        `STEP 5 — OPPORTUNITY COST FROM A TO C. Moving from A=(40,150) to C=(90,80): computers gained = 90-40 = 50. Wheat lost = 150-80 = 70. Opportunity cost of 50 computers = 70 wheat. Per computer: 70/50 = 1.4 wheat per computer.`,
        `STEP 6 — INTERPRET. To gain 50 more computers, the economy gives up 70 wheat — an opportunity cost of 1.4 wheat per computer. (NOTE: this average opportunity cost is a chord between two points; on a bowed-out curve, the marginal opportunity cost VARIES along the curve. AP usually asks for chord-based averages unless the problem specifies otherwise.)`,
        `STEP 7 — CHECK FOR EFFICIENCY. Both A and C are inside the curve, so neither is efficient. The economy could move to C' = (90, 87) on the curve and gain 7 more wheat at the same computer level — a free improvement that exposes the inefficiency.`,
      ],
      example: { problem: `An economy produces computers and wheat. Its PPC has these maximum endpoints: 100 computers (if all resources go to computers) or 200 bushels of wheat. The PPC is bowed out (increasing opportunity cost). Three points are observed: A = (40, 150), B = (40, 100), C = (90, 80). Identify each point's region and compute the opportunity cost of moving from A to C (in wheat-per-computer).`, solution: `A, B, C all inside the curve (inefficient). Opportunity cost of moving A→C: 1.4 wheat per computer (50 computers gained costs 70 wheat).` },
      relatedLoIds: ['apmacro.ppc'],
    },
  ],
  pointers: [
    { content: `PPC shows max output combinations of two goods. ON = efficient, INSIDE = inefficient (waste), OUTSIDE = unattainable now.`, kind: 'tip' },
    { content: 'Opportunity cost between two points = (good given up) / (good gained).', kind: 'tip' },
    { content: `Bowed-out PPC = increasing opportunity cost (resources not equally suited to both goods).`, kind: 'tip' },
    { content: 'Straight-line PPC = constant opportunity cost (resources equally productive).', kind: 'tip' },
    { content: 'Rightward shift = growth. Biased shift = improvement in one good only.', kind: 'tip' },
  ],
};
