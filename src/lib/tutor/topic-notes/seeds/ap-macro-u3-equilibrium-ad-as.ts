/**
 * AP Macroeconomics — Unit 3 CED 3.5: Equilibrium in the AD-AS Model.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.equilibrium-ad-as.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_EQUILIBRIUM_AD_AS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.equilibrium-ad-as.v1',
  course: 'AP Macroeconomics',
  cedUnit: 3,
  cedTopic: '3.5',
  cedTitle: 'Equilibrium in the AD-AS Model',
  planId: 'evelyn.ap.macro.equilibrium-ad-as.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.equilibrium-ad-as.v1' }],
  theory: [
    { loId: 'apmacro.equilibrium-ad-as', content: `SHORT-RUN EQUILIBRIUM: where AD intersects SRAS. Determines short-run real GDP and short-run price level. The economy is at this point right now, but it may not be at long-run equilibrium.` },
    { loId: 'apmacro.equilibrium-ad-as', content: `LONG-RUN EQUILIBRIUM: where AD, SRAS, and LRAS all intersect at the SAME point. Real GDP equals potential GDP; price level fully reflects all costs and expectations. The economy "wants" to settle here.` },
    { loId: 'apmacro.equilibrium-ad-as', content: `THREE POSSIBLE STATES based on the short-run equilibrium's relationship to LRAS:` },
    { loId: 'apmacro.equilibrium-ad-as', content: `(1) AT LRAS — short-run equilibrium real GDP equals potential. AD ∩ SRAS sits exactly on the LRAS line. The economy is in long-run equilibrium. Cyclical unemployment is zero; actual UR = natural rate.` },
    { loId: 'apmacro.equilibrium-ad-as', content: `(2) RECESSIONARY GAP — short-run equilibrium is to the LEFT of LRAS. Actual GDP < potential GDP. Negative output gap. Cyclical unemployment > 0. Actual UR > natural rate. Examples: 2008-09 recession, COVID early 2020.` },
    { loId: 'apmacro.equilibrium-ad-as', content: `(3) INFLATIONARY GAP (or expansionary gap) — short-run equilibrium is to the RIGHT of LRAS. Actual GDP > potential GDP. Positive output gap. Cyclical unemployment < 0 (i.e., actual UR < natural rate, economy "running hot"). Inflation pressure builds. Examples: late 1990s tech boom, 2022 post-pandemic.` },
    { loId: 'apmacro.equilibrium-ad-as', content: `GAP = ACTUAL GDP − POTENTIAL GDP. Negative in recession, positive in overheating, zero at long-run equilibrium.` },
    { loId: 'apmacro.equilibrium-ad-as', content: `IMPORTANT: a recessionary gap does NOT mean GDP is shrinking. It means GDP is BELOW potential. GDP could be growing slowly while still in a recessionary gap. Likewise, an inflationary gap does not require runaway inflation — just operating ABOVE potential capacity, which builds inflationary pressure.` },
    { loId: 'apmacro.equilibrium-ad-as', content: `CYCLICAL UE = ACTUAL UR − NATURAL UR. Tracks the same idea on the labor side. Positive in recessionary gap; negative in inflationary gap; zero at long-run equilibrium.` },
    { loId: 'apmacro.equilibrium-ad-as', kind: 'definition', title: 'short-run equilibrium', content: 'where AD intersects SRAS — determines current real GDP and price level.' },
    { loId: 'apmacro.equilibrium-ad-as', kind: 'definition', title: 'long-run equilibrium', content: 'where AD, SRAS, and LRAS all intersect at the same point.' },
    { loId: 'apmacro.equilibrium-ad-as', kind: 'definition', title: 'recessionary gap', content: 'short-run equilibrium below potential GDP; actual GDP < potential.' },
    { loId: 'apmacro.equilibrium-ad-as', kind: 'definition', title: 'inflationary gap', content: 'short-run equilibrium above potential GDP; actual GDP > potential.' },
  ],
  methods: [
    {
      title: 'Worked identify gap',
      steps: [
        `STEP 1 — COMPARE actual to potential: $19.4T vs $20T. Actual < potential → RECESSIONARY GAP.`,
        `STEP 2 — GAP MAGNITUDE: actual − potential = $19.4T − $20T = −$0.6T (or $600B below potential).`,
        `STEP 3 — AS PERCENT: −$0.6T / $20T × 100 = −3%. The economy is producing 3% below its potential.`,
        `STEP 4 — CYCLICAL UNEMPLOYMENT: actual UR − natural UR = 6% − 4% = +2 percentage points. Two percentage points of unemployment beyond what is structural.`,
        `STEP 5 — INFLATION PRESSURE: with a NEGATIVE output gap, demand is weaker than long-run supply capacity. Inflation pressure is DOWNWARD. Inflation may slow, plateau, or even turn into deflation if the gap is severe and persistent.`,
        `STEP 6 — DIAGRAM (mentally or on the board). AD intersects SRAS at ($19.4T, P_short_run). LRAS is the vertical line at $20T, to the RIGHT of the short-run equilibrium. The horizontal distance from short-run eq to LRAS is the recessionary gap.`,
      ],
      example: { problem: `An economy reports: potential GDP = $20T, actual GDP = $19.4T, actual UR = 6%, natural UR = 4%. Identify the macroeconomic situation: which type of gap, magnitude in dollars and as a percent of potential, cyclical unemployment, and predicted direction of inflation pressure.`, solution: `Recessionary gap. Magnitude: −$0.6T (−3% of potential). Cyclical UE: +2 pp. Inflation pressure: downward.` },
      relatedLoIds: ['apmacro.equilibrium-ad-as'],
    },
  ],
  pointers: [
    { content: 'Short-run equilibrium: AD ∩ SRAS. Long-run equilibrium: AD ∩ SRAS ∩ LRAS.', kind: 'tip' },
    { content: `Recessionary gap: AD∩SRAS LEFT of LRAS. Actual GDP < potential. UR > natural rate.`, kind: 'tip' },
    { content: `Inflationary gap: AD∩SRAS RIGHT of LRAS. Actual GDP > potential. UR < natural rate.`, kind: 'tip' },
    { content: 'AD-side / SRAS-side policies → SR effects only. LRAS shifts → LR growth.', kind: 'tip' },
  ],
};
