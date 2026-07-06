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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.deficits-debt.v1' }],
  theory: [
    { loId: 'apmacro.deficits-debt', content: `BUDGET DEFICIT: spending > revenue IN A GIVEN YEAR (annual flow). NATIONAL DEBT: cumulative sum of past deficits minus surpluses (stock at a point in time). Reviewed from U3.8.` },
    { loId: 'apmacro.deficits-debt', content: `DEBT-TO-GDP RATIO: national debt divided by GDP, expressed as a percentage. The most-cited measure of debt burden because it normalizes by the economy's ability to service the debt. Examples: U.S. debt-to-GDP ≈ 100% (2024); Japan ≈ 250%; many European countries 80-130%.` },
    { loId: 'apmacro.deficits-debt', content: `WHY DEBT-TO-GDP rather than absolute debt: a $30T debt burden is very different in a $25T economy (debt-to-GDP = 120%) than in a $50T economy (60%). Larger economies can sustain more absolute debt.` },
    { loId: 'apmacro.deficits-debt', content: `DEBT SUSTAINABILITY: a country can sustain a steady debt-to-GDP ratio if real GDP grows at least as fast as real debt grows. If interest payments + new deficits cause debt to grow faster than GDP, debt-to-GDP rises over time. Eventually, lenders question the country's ability to repay; interest rates rise; the debt becomes harder to service. Severe cases: sovereign-debt crises (Greece 2010, Argentina multiple times).` },
    { loId: 'apmacro.deficits-debt', content: `COSTS OF HIGH DEBT: (1) DEBT SERVICE — paying interest takes a growing share of the budget, leaving less for other priorities. (2) CROWDING OUT — government borrowing competes with private; persistent deficits raise real interest rates over time, reducing private I and long-run growth (covered next plan). (3) FOREIGN DEBT — debt held by foreign creditors means future debt service is a transfer abroad. (4) FISCAL POLICY CONSTRAINT — high debt-to-GDP makes large new stimulus packages politically harder and economically riskier.` },
    { loId: 'apmacro.deficits-debt', content: `INTERGENERATIONAL ARGUMENT: today's deficits become tomorrow's debt service. Future taxpayers pay either through higher taxes or reduced government services. Some economists argue this is unfair burden-shifting; others argue if the debt finances investment (infrastructure, education) that benefits future generations, the trade is fair.` },
    { loId: 'apmacro.deficits-debt', content: `COUNTER-ARGUMENT — debt-financed investment: if government spending creates productive capacity (research, infrastructure, education) that raises future GDP, the debt may PAY FOR ITSELF in higher future tax revenues. Not all deficits are equal — the COMPOSITION of spending matters as much as the magnitude.` },
    { loId: 'apmacro.deficits-debt', content: `WHEN DEFICITS ARE WIDELY ACCEPTED: during recessions (counter-cyclical stabilization), wars, and major emergencies. The 2008-09 and 2020 recessions saw large U.S. deficits with broad expert support. Persistent peacetime deficits at full employment are more controversial.` },
    { loId: 'apmacro.deficits-debt', kind: 'definition', title: 'debt-to-GDP ratio', content: 'national debt as a percentage of GDP; primary measure of debt burden.' },
    { loId: 'apmacro.deficits-debt', kind: 'definition', title: 'debt sustainability', content: 'the ability of a government to maintain a steady debt-to-GDP ratio over time.' },
    { loId: 'apmacro.deficits-debt', kind: 'definition', title: 'debt service', content: 'interest payments on the national debt.' },
  ],
  methods: [
    {
      title: 'Worked debt sustain',
      steps: [
        'STEP 1 — INITIAL DEBT-TO-GDP = $20T / $25T × 100 = 80%.',
        `STEP 2 — AFTER 5 YEARS. Debt grows: $20T × (1.04)⁵ = $20T × 1.217 = $24.33T. GDP grows: $25T × (1.02)⁵ = $25T × 1.104 = $27.61T. New debt-to-GDP = $24.33T / $27.61T × 100 ≈ 88.1%.`,
        `STEP 3 — TRAJECTORY ASSESSMENT. Debt-to-GDP rose from 80% to 88% in 5 years — a roughly 8 percentage-point increase. At this pace, debt-to-GDP would continue rising indefinitely. The trajectory is NOT SUSTAINABLE in the long run because debt is growing faster than GDP.`,
        `STEP 4 — STABILIZING CONDITION. To stabilize debt-to-GDP at 80%, debt must grow no faster than GDP — i.e., debt growth ≤ 2% per year. Currently 4% — too fast.`,
        `STEP 5 — IMPLICATIONS. Stabilizing requires either (i) faster GDP growth, (ii) slower debt growth (smaller deficits), or (iii) a combination. Politically, smaller deficits typically require either spending cuts or tax increases, both controversial.`,
      ],
      example: { problem: `Country Y has a national debt of $20T and a GDP of $25T. (a) Compute the debt-to-GDP ratio. (b) If GDP grows at 2% per year and the debt grows at 4% per year, compute the debt-to-GDP ratio after 5 years. (c) Identify whether the trajectory is sustainable.`, solution: `(a) 80%. (b) ≈88.1% after 5 years. (c) Not sustainable; debt growth (4%) exceeds GDP growth (2%).` },
      relatedLoIds: ['apmacro.deficits-debt'],
    },
  ],
  pointers: [
    { content: 'Deficit (annual) ≠ Debt (cumulative). Debt-to-GDP normalizes by economy size.', kind: 'tip' },
    { content: 'Sustainable: debt growth ≤ GDP growth.', kind: 'tip' },
    { content: 'High debt: crowding out, debt service, fiscal constraint, possible crisis.', kind: 'tip' },
    { content: `Composition matters: productive investment can pay for itself; operating debt does not.`, kind: 'tip' },
  ],
};
