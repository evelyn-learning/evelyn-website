/**
 * AP Macroeconomics — Unit 3 CED 3.5: Equilibrium in the AD-AS Model.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.equilibrium-ad-as.v1). Hand-edit freely after extraction;
 * bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.equilibrium-ad-as.v1' }],
  theory: [
    { loId: 'apmacro.equilibrium-ad-as', content: `SHORT-RUN EQUILIBRIUM: where AD intersects SRAS — sets CURRENT real GDP and price level. The economy sits here right now, whether or not it is also at long-run equilibrium.` },
    { loId: 'apmacro.equilibrium-ad-as', content: `LONG-RUN EQUILIBRIUM: AD, SRAS, and LRAS all intersect at the SAME point. Real GDP = potential GDP; wages, prices, and expectations fully reflect conditions. The economy gravitates here over time.` },
    { loId: 'apmacro.equilibrium-ad-as', content: `STATE 1 — AT LRAS: AD ∩ SRAS sits exactly on the LRAS line. Actual = potential; cyclical unemployment zero; actual UR = natural rate; no inflation pressure either way.` },
    { loId: 'apmacro.equilibrium-ad-as', content: `STATE 2 — RECESSIONARY GAP: AD ∩ SRAS to the LEFT of LRAS. Actual GDP < potential; NEGATIVE output gap; cyclical unemployment POSITIVE (actual UR above natural); inflation pressure DOWNWARD.` },
    { loId: 'apmacro.equilibrium-ad-as', content: `STATE 3 — INFLATIONARY (expansionary) GAP: AD ∩ SRAS to the RIGHT of LRAS. Actual GDP > potential; POSITIVE output gap; actual UR BELOW natural (cyclical UE negative — "running hot"); inflation pressure UPWARD.` },
    { loId: 'apmacro.equilibrium-ad-as', content: `GAP ARITHMETIC: output gap = actual − potential GDP (dollars), or (actual − potential)/potential × one hundred (percent). Cyclical UE = actual UR − natural UR. The two diagnostics should agree in sign.` },
    { loId: 'apmacro.equilibrium-ad-as', content: `PRECISION TRAP 1: a recessionary gap does NOT mean GDP is SHRINKING — it means GDP is BELOW POTENTIAL. An economy can grow slowly and still sit in a recessionary gap.` },
    { loId: 'apmacro.equilibrium-ad-as', content: `PRECISION TRAP 2: an inflationary gap does not require runaway inflation — it means operating ABOVE potential capacity, which BUILDS inflation pressure over time.` },
    { loId: 'apmacro.equilibrium-ad-as', content: `WHY TWO SUPPLY CURVES: SRAS captures the sticky short run where AD shifts move real output; LRAS captures the adjusted long run where output is pinned at potential. Stimulus is effective against a recessionary gap but only inflationary at potential; ONLY LRAS-shifting structural policies deliver long-run growth. Diagnose the gap BEFORE choosing the tool.` },
    { loId: 'apmacro.equilibrium-ad-as', kind: 'definition', title: 'short-run equilibrium', content: `where AD intersects SRAS — determines current real GDP and price level.` },
    { loId: 'apmacro.equilibrium-ad-as', kind: 'definition', title: 'long-run equilibrium', content: `where AD, SRAS, and LRAS all intersect at the same point.` },
    { loId: 'apmacro.equilibrium-ad-as', kind: 'definition', title: 'recessionary gap', content: `short-run equilibrium below potential GDP; actual GDP < potential.` },
    { loId: 'apmacro.equilibrium-ad-as', kind: 'definition', title: 'inflationary gap', content: `short-run equilibrium above potential GDP; actual GDP > potential.` },
  ],
  methods: [
    {
      title: 'Identify the gap and diagnose the economy from data',
      steps: [
        `STEP 1 — COMPARE actual to potential GDP: below → recessionary gap; above → inflationary gap; equal → long-run equilibrium.`,
        `STEP 2 — MAGNITUDE: gap in dollars = actual − potential; as percent = gap / potential × one hundred.`,
        `STEP 3 — CYCLICAL UNEMPLOYMENT = actual UR − natural UR; check its sign agrees with the gap's sign.`,
        `STEP 4 — INFLATION PRESSURE: negative gap → downward; positive gap → upward.`,
        `STEP 5 — DIAGRAM: place AD ∩ SRAS at actual GDP with LRAS vertical at potential; the horizontal distance between them IS the gap. For an inflationary gap, note self-adjustment direction: SRAS will shift LEFT as scarce labor bids wages up, returning output to potential at a higher price level.`,
      ],
      example: {
        problem: `Potential GDP is twenty trillion dollars; actual is nineteen-point-four trillion; actual UR six percent; natural rate four percent. Diagnose the economy.`,
        solution: `Actual < potential → RECESSIONARY GAP of 0.6 trillion dollars = three percent of potential. Cyclical UE = six − four = two points (positive, consistent). Inflation pressure: downward. Diagram: AD ∩ SRAS to the left of LRAS at twenty trillion.`,
      },
      relatedLoIds: ['apmacro.equilibrium-ad-as'],
    },
  ],
  pointers: [
    { content: 'Short-run eq = AD ∩ SRAS; long-run eq = AD ∩ SRAS ∩ LRAS at one point.', kind: 'tip' },
    { content: 'Recessionary gap: left of LRAS, UR above natural, downward price pressure. Inflationary: mirror image.', kind: 'tip' },
    { content: 'Recessionary gap means BELOW potential — not necessarily shrinking GDP.', kind: 'tip' },
    { content: 'Check consistency: sign of output gap should match sign of cyclical unemployment.', kind: 'tip' },
    { content: 'Diagnose the gap before prescribing policy — stimulus at potential only buys inflation.', kind: 'tip' },
  ],
};
