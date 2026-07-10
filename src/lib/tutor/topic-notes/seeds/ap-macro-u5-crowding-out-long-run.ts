/**
 * AP Macroeconomics — Unit 5 CED 5.5: Crowding Out.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.crowding-out-long-run.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.crowding-out-long-run.v1' }],
  theory: [
    { loId: 'apmacro.crowding-out-long-run', content: `LOANABLE-FUNDS REVIEW: a government deficit is financed by BORROWING → the demand for loanable funds shifts RIGHT → equilibrium REAL interest rate RISES → private investment (I) FALLS. That single-period offset is short-run crowding out (Unit 3).` },
    { loId: 'apmacro.crowding-out-long-run', content: `LONG-RUN CROWDING OUT: PERSISTENT deficits repeat the mechanism year after year, cumulatively suppressing private investment and slowing CAPITAL ACCUMULATION. Less capital per worker → lower productivity → potential GDP and LRAS grow more slowly than they otherwise would.` },
    { loId: 'apmacro.crowding-out-long-run', content: `THE FULL CHAIN to state on FRQs: deficit → loanable-funds demand right → real interest rate up → private I down → capital stock smaller → labor productivity lower → potential GDP / LRAS lower. Short-run crowding out is a LEVEL effect (one period's AD shift shrinks); long-run crowding out is a GROWTH-RATE effect — compounding suppression.` },
    { loId: 'apmacro.crowding-out-long-run', content: `MAGNITUDE DEPENDS ON SLACK. FULL EMPLOYMENT: loanable-funds market tight, supply effectively steep → deficits push rates up sharply → substantial I displacement. DEEP RECESSION: idle savings abound, supply effectively flat → rates barely move → minimal crowding out (some argue near zero in slumps).` },
    { loId: 'apmacro.crowding-out-long-run', content: `HISTORICAL CONTRAST: large deficits in the nineteen-eighties coincided with rising real rates — meaningful crowding out; the very large 2009-2012 deficits ran alongside low, stable real rates — minimal crowding out. Same policy, different macro context.` },
    { loId: 'apmacro.crowding-out-long-run', content: `RICARDIAN EQUIVALENCE (counterargument): rational households, anticipating future taxes to service the debt, SAVE MORE today — added private saving offsets government dis-saving, leaving loanable funds and rates unchanged. If it held perfectly, crowding out would be zero. Empirically it is PARTIAL: households save somewhat more, not fully offsetting.` },
    { loId: 'apmacro.crowding-out-long-run', content: `OTHER OFFSETS: (1) FOREIGN CAPITAL INFLOWS — higher domestic rates attract foreign savings, expanding loanable supply and damping the rate rise (the US has long benefited from this); (2) PRODUCTIVE GOVERNMENT SPENDING — if the deficit finances infrastructure/R&D/education, its own LRAS boost can outweigh the private-investment loss. Net long-run effect depends on the comparison.` },
    { loId: 'apmacro.crowding-out-long-run', content: `POLICY BOTTOM LINE: persistent PEACETIME deficits at FULL EMPLOYMENT do the most long-run damage; counter-cyclical deficits in deep recessions do the least (they absorb slack rather than displacing productive private investment) — and may even preserve capital that a prolonged slump would have destroyed.` },
    { loId: 'apmacro.crowding-out-long-run', kind: 'definition', title: 'long-run crowding out', content: `cumulative reduction in private investment and the capital stock from persistent government deficits.` },
    { loId: 'apmacro.crowding-out-long-run', kind: 'definition', title: 'Ricardian equivalence', content: `the proposition that rational households offset government dis-saving with private saving, neutralizing crowding out; partial in practice.` },
  ],
  methods: [
    {
      title: 'Compare long-run deficit damage across macro contexts',
      steps: [
        `STEP 1 — SET UP the loanable-funds market for each context: full employment = tight market (steep effective supply); deep recession = slack (flat supply, idle savings).`,
        `STEP 2 — SHIFT demand right by the deficit in each and compare the interest-rate response: sharp rise vs barely moving.`,
        `STEP 3 — TRANSLATE into investment: big I displacement in the tight market; negligible in the slack one (I was weak anyway).`,
        `STEP 4 — COMPOUND over the horizon: repeated annual suppression → materially smaller capital stock and slower LRAS growth in the full-employment case; minimal (possibly positive, via preserved capacity) in the recession case.`,
        `STEP 5 — CONCLUDE with the context rule: identical deficits, opposite long-run verdicts depending on slack.`,
      ],
      example: {
        problem: `Countries A and B each run deficits of five percent of GDP for twenty years. A stays at full employment with strong investment demand; B is in a deep recession with weak loan demand. Compare the crowding out and the long-run effect on potential GDP.`,
        solution: `A: tight loanable-funds market → rates rise substantially each year → private I meaningfully displaced annually → after twenty years the capital stock and potential GDP are well below the no-deficit counterfactual. B: slack market → rates barely rise → I (already weak) barely affected → minimal long-run damage, and the stimulus may have PREVENTED capital erosion during the slump. Same deficits, very different long-run outcomes.`,
      },
      relatedLoIds: ['apmacro.crowding-out-long-run'],
    },
  ],
  pointers: [
    { content: 'Chain: deficit → LF demand right → real r up → I down → capital stock ↓ → productivity ↓ → LRAS growth ↓.', kind: 'tip' },
    { content: 'Short-run crowding out = level effect; long-run = compounding growth-rate effect.', kind: 'tip' },
    { content: 'Crowding out is LARGE at full employment, SMALL in deep recession (nineteen-eighties vs 2009-12).', kind: 'tip' },
    { content: 'Ricardian equivalence (households save to pre-fund future taxes) is only PARTIAL empirically.', kind: 'tip' },
    { content: 'Foreign capital inflows and productive deficit-financed investment can offset the damage.', kind: 'tip' },
  ],
};
