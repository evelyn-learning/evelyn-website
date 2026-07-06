/**
 * AP Macroeconomics — Unit 5 CED 5.5: Crowding Out.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.crowding-out-long-run.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_CROWDING_OUT_LONG_RUN: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.crowding-out-long-run.v1',
  course: 'AP Macroeconomics',
  cedUnit: 5,
  cedTopic: '5.5',
  cedTitle: 'Crowding Out',
  planId: 'evelyn.ap.macro.crowding-out-long-run.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.crowding-out-long-run.v1' }],
  theory: [
    { loId: 'apmacro.crowding-out-long-run', content: `REVIEW (U3.8 / U4.7): when government runs a deficit, it BORROWS in the loanable funds market. Demand for loanable funds shifts RIGHT. Equilibrium real interest rate RISES. Higher r reduces private investment (I).` },
    { loId: 'apmacro.crowding-out-long-run', content: `SHORT-RUN crowding out: in a single period, fiscal stimulus financed by deficit produces some private I reduction that partially offsets the AD shift. The net AD effect is positive but smaller than the multiplier alone would imply.` },
    { loId: 'apmacro.crowding-out-long-run', content: `LONG-RUN crowding out: PERSISTENT deficits over many years cumulatively reduce private investment and slow capital accumulation. Less capital stock means lower labor productivity, lower potential GDP, and slower long-run growth. The economy's LRAS curve grows more slowly than it would have without persistent deficits.` },
    { loId: 'apmacro.crowding-out-long-run', content: `MECHANISM (year-by-year): Year 1 deficit shifts D right in loanable funds, raises r, reduces private I. Year 2 deficit does the same. After 10 years, private investment has been suppressed every year. The CAPITAL STOCK accumulates more slowly than it would have. Less capital per worker → lower productivity → lower long-run GDP.` },
    { loId: 'apmacro.crowding-out-long-run', content: `GROWTH-RATE EFFECT vs LEVEL EFFECT. Short-run crowding-out is mostly a LEVEL effect (one-period AD shift smaller than expected). Long-run crowding-out is a GROWTH-RATE effect — cumulative compounding suppression of investment.` },
    { loId: 'apmacro.crowding-out-long-run', content: `RICARDIAN EQUIVALENCE (a counterargument): some economists argue that rational households anticipate future tax increases needed to service deficit-financed spending, so they save more today to prepare. The increased private saving offsets the government dis-saving, leaving total loanable funds unchanged. If Ricardian equivalence held perfectly, crowding out would be zero. Empirical reality: partial — households save somewhat more, but not fully offsetting deficits.` },
    { loId: 'apmacro.crowding-out-long-run', content: `OFFSETTING FACTORS: (1) DEEP RECESSIONS — when slack exists, idle savings absorb deficits; r barely rises; crowding-out small. (2) FOREIGN CAPITAL inflows — if domestic deficits raise r, foreign savings flow in seeking the higher return; foreign-funded loanable supply rises; r rises less than otherwise. The U.S. has historically attracted significant foreign capital, partially offsetting domestic crowding-out. (3) DEBT-FINANCED INVESTMENT — if government spending itself is productive (infrastructure, R&D, education), it raises LRAS. Net effect on long-run output depends on whether the productivity gain exceeds the private-investment loss.` },
    { loId: 'apmacro.crowding-out-long-run', content: `POLICY IMPLICATION: large persistent peacetime deficits at full employment are MOST damaging via long-run crowding-out. Counter-cyclical deficits during recessions are LEAST damaging because they fill in slack rather than competing with productive private I.` },
    { loId: 'apmacro.crowding-out-long-run', kind: 'definition', title: 'long-run crowding out', content: `cumulative reduction in private investment and capital stock from persistent government deficits.` },
    { loId: 'apmacro.crowding-out-long-run', kind: 'definition', title: 'Ricardian equivalence', content: `the proposition that rational households offset government dis-saving with private saving, neutralizing crowding-out.` },
  ],
  methods: [
    {
      title: 'Worked cumulative effect',
      steps: [
        `STEP 1 — COUNTRY A (full employment): private investment demand is strong; loanable funds market is tight. Government deficit shifts D RIGHT; with steep S curve, real r rises substantially; private I falls noticeably. Each year of deficit displaces meaningful private investment.`,
        `STEP 2 — COUNTRY A long-run effect: capital stock grows more slowly than it would have without deficits. After 20 years, capital stock is materially lower; LRAS has grown more slowly; potential GDP is lower than the counterfactual. Significant long-run crowding-out.`,
        `STEP 3 — COUNTRY B (deep recession): private investment demand is weak; the loanable funds market has substantial slack (idle savings). Government deficit shifts D right but r barely rises (S curve is flat in slack conditions). Private I is barely affected because it was already weak.`,
        `STEP 4 — COUNTRY B long-run effect: capital stock not significantly suppressed by deficits because private I wasn't being deployed anyway. Furthermore, the deficit-financed stimulus may have prevented capital-stock erosion (factories closing during prolonged downturn). Long-run damage minimal; possibly even net positive.`,
        `STEP 5 — COMPARISON. Country A faces SUBSTANTIAL long-run damage from sustained deficits at full employment. Country B faces MINIMAL damage; in fact, the counter-cyclical use of deficits may have HELPED preserve long-run capital. The same fiscal action (5% deficits) has very different long-run consequences depending on the macroeconomic environment.`,
        `STEP 6 — POLICY LESSON. AP wants you to know: deficits are most justifiable in deep recessions; least defensible at full employment. The same deficit number means different things in different conditions.`,
      ],
      example: { problem: `Country A and Country B both run identical fiscal deficits of 5% of GDP for 20 years. Country A is at full employment with strong private investment demand throughout. Country B is in a deep recession with weak loan demand throughout. (a) Identify the size of crowding-out in each country. (b) Predict the long-run effect on capital stock and potential GDP for each. (c) Identify which country experiences greater long-run damage from the persistent deficits.`, solution: `Country A: substantial crowding-out, slower capital accumulation, lower long-run potential GDP. Country B: minimal damage, possibly net positive. Same deficits, very different long-run consequences.` },
      relatedLoIds: ['apmacro.crowding-out-long-run'],
    },
  ],
  pointers: [
    { content: `Long-run crowding-out: persistent deficits → cumulative suppression of private I → smaller capital stock → lower potential GDP.`, kind: 'tip' },
    { content: `Mechanism: deficit → loanable funds D right → r up → I down → capital stock → productivity → LRAS.`, kind: 'tip' },
    { content: `Magnitude depends on macroeconomic state: large at full employment; small in deep recession.`, kind: 'tip' },
    { content: `Ricardian equivalence: counterargument that private saving offsets government dis-saving. Partial in practice.`, kind: 'tip' },
    { content: `Productive deficit-financed spending (R&D, infrastructure) may offset the crowding-out via LRAS gains.`, kind: 'tip' },
  ],
};
