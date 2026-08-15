/**
 * AP Macroeconomics — Unit 5 CED 5.4: Government Deficits and the National Debt.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.deficits-debt.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_DEFICITS_DEBT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.deficits-debt.v1',
  course: 'AP Macroeconomics',
  cedUnit: 5,
  cedTopic: '5.4',
  cedTitle: 'Government Deficits and the National Debt',
  planId: 'evelyn.ap.macro.deficits-debt.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.deficits-debt.v1' }],
  theory: [
    { loId: 'apmacro.deficits-debt', content: `DEFICIT vs DEBT (review from 3.8): BUDGET DEFICIT = spending > revenue in a GIVEN YEAR — a FLOW. NATIONAL DEBT = cumulative sum of all past deficits minus surpluses (plus accumulated interest) — a STOCK at a point in time.` },
    { loId: 'apmacro.deficits-debt', kind: 'formula', title: 'debt-to-GDP ratio', content: `$\\text{debt-to-GDP} = \\frac{\\text{national debt}}{\\text{GDP}} \\times 100$. The standard burden measure because it normalizes by the economy's capacity to service the debt. Rough markers: US near one hundred percent; Japan around two hundred fifty; much of Europe between eighty and one hundred thirty.` },
    { loId: 'apmacro.deficits-debt', content: `WHY THE RATIO, NOT THE DOLLAR LEVEL: the same absolute debt is crushing for a small economy and moderate for a large one. Thirty trillion of debt is one hundred twenty percent of a twenty-five-trillion economy but only sixty percent of a fifty-trillion one. The ratio measures burden relative to capacity and enables cross-country and cross-era comparison.` },
    { loId: 'apmacro.deficits-debt', content: `SUSTAINABILITY CONDITION: debt-to-GDP stabilizes when DEBT GROWS NO FASTER THAN GDP. Debt growing faster than GDP → the ratio climbs indefinitely → eventually lenders doubt repayment, demand higher yields, and debt service compounds — a vicious cycle. Severe endpoint: sovereign-debt crisis (Greece around 2010; Argentina repeatedly).` },
    { loId: 'apmacro.deficits-debt', content: `COSTS OF HIGH DEBT: (1) DEBT SERVICE — interest eats a growing budget share, squeezing other priorities; (2) CROWDING OUT — persistent borrowing raises real rates, cutting private investment and long-run growth; (3) FOREIGN-HELD DEBT — future service is a transfer abroad; (4) FISCAL CONSTRAINT — high debt-to-GDP leaves less room for stimulus in the next recession.` },
    { loId: 'apmacro.deficits-debt', content: `INTERGENERATIONAL ARGUMENT: today's deficits become tomorrow's debt service — future taxpayers pay via higher taxes or fewer services. COUNTER: if the debt finances long-lived investment that benefits future generations (infrastructure, education), asking them to share the cost is arguably fair.` },
    { loId: 'apmacro.deficits-debt', content: `COMPOSITION MATTERS: debt financing PRODUCTIVE investment (infrastructure, R&D, education, public health) can raise future GDP enough that added tax revenue covers the debt service — potentially self-financing. Deficits funding operating spending or transfers at full employment have no such offset. Judge the SPENDING, not just the number.` },
    { loId: 'apmacro.deficits-debt', content: `WHEN DEFICITS ARE BROADLY ACCEPTED: recessions (counter-cyclical stabilization — the 2008-09 and 2020 episodes had wide expert support), wars, and major emergencies. PERSISTENT PEACETIME deficits at full employment are the controversial case.` },
    { loId: 'apmacro.deficits-debt', content: `STABILIZATION LEVERS when the ratio is rising: faster GDP growth, smaller deficits (spending cuts or tax increases — both politically hard), or a mix. Printing money to repay instead produces inflation and currency depreciation.` },
    { loId: 'apmacro.deficits-debt', kind: 'definition', title: 'debt-to-GDP ratio', content: `national debt as a percentage of GDP; the primary measure of debt burden.` },
    { loId: 'apmacro.deficits-debt', kind: 'definition', title: 'debt sustainability', content: `the ability of a government to maintain a steady debt-to-GDP ratio over time.` },
    { loId: 'apmacro.deficits-debt', kind: 'definition', title: 'debt service', content: `interest payments on the national debt.` },
  ],
  methods: [
    {
      title: 'Assess debt sustainability from growth rates',
      steps: [
        `STEP 1 — INITIAL RATIO: debt / GDP × one hundred.`,
        `STEP 2 — PROJECT both stocks forward: debt × (one + debt growth rate) per year; GDP × (one + GDP growth rate) per year, compounded over the horizon.`,
        `STEP 3 — NEW RATIO: projected debt / projected GDP × one hundred.`,
        `STEP 4 — VERDICT: debt growth > GDP growth → ratio rising → NOT sustainable; equal or slower → stabilizing.`,
        `STEP 5 — STATE the stabilizing condition (debt growth must fall to the GDP growth rate or below) and the levers: faster growth, smaller deficits, or both.`,
      ],
      example: {
        problem: `Country Y has twenty trillion dollars of debt and a twenty-five-trillion-dollar GDP. GDP grows two percent a year; debt grows four percent. Find the debt-to-GDP ratio now and after five years, and judge sustainability.`,
        solution: `Now: eighty percent. After five years: debt ≈ 24.3 trillion, GDP ≈ 27.6 trillion → ratio ≈ eighty-eight percent. Rising roughly eight points in five years — NOT sustainable, since debt growth (four percent) outpaces GDP growth (two). Stabilizing requires debt growth at or below two percent: smaller deficits, faster growth, or both.`,
      },
      relatedLoIds: ['apmacro.deficits-debt'],
    },
  ],
  pointers: [
    { content: 'Deficit = annual flow; debt = cumulative stock. Burden is judged by debt-to-GDP, not dollars.', kind: 'tip' },
    { content: 'Sustainable ⇔ debt grows no faster than GDP. Faster → the ratio climbs without limit.', kind: 'tip' },
    { content: 'High-debt costs: debt service squeeze, crowding out, foreign transfer, less room for future stimulus.', kind: 'tip' },
    { content: 'Composition matters: debt for productive investment can pay for itself; operating debt cannot.', kind: 'tip' },
    { content: 'Recession/war deficits are broadly accepted; persistent full-employment deficits are the contested case.', kind: 'tip' },
  ],
};
