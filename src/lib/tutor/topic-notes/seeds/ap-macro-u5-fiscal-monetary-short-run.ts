/**
 * AP Macroeconomics — Unit 5 CED 5.1: Fiscal and Monetary Policy Actions in the Short Run.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.fiscal-monetary-short-run.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_FISCAL_MONETARY_SHORT_RUN: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.fiscal-monetary-short-run.v1',
  course: 'AP Macroeconomics',
  cedUnit: 5,
  cedTopic: '5.1',
  cedTitle: 'Fiscal and Monetary Policy Actions in the Short Run',
  planId: 'evelyn.ap.macro.fiscal-monetary-short-run.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.fiscal-monetary-short-run.v1' }],
  theory: [
    { loId: 'apmacro.fiscal-monetary-short-run', content: `BOTH POLICIES WORK THROUGH AD in the short run. Fiscal policy (government spending G, taxes T) and monetary policy (money supply / policy rate) both shift the AGGREGATE DEMAND curve. With an upward-sloping SRAS, a rightward AD shift raises both real output (Y) and the price level (P); a leftward shift lowers both.` },
    { loId: 'apmacro.fiscal-monetary-short-run', content: `EXPANSIONARY FISCAL POLICY: increase G or cut T → AD shifts RIGHT → Y up, P up, unemployment DOWN. Use to close a RECESSIONARY gap (Y below potential).` },
    { loId: 'apmacro.fiscal-monetary-short-run', content: `CONTRACTIONARY FISCAL POLICY: decrease G or raise T → AD shifts LEFT → Y down, P down, unemployment UP. Use to close an INFLATIONARY gap (Y above potential).` },
    { loId: 'apmacro.fiscal-monetary-short-run', content: `EXPANSIONARY MONETARY POLICY: central bank increases the money supply (buys bonds / lowers the policy rate). In the MONEY MARKET, more money supply → nominal interest rate FALLS → investment and interest-sensitive consumption rise → AD shifts RIGHT → Y up, P up, unemployment down.` },
    { loId: 'apmacro.fiscal-monetary-short-run', content: `CONTRACTIONARY MONETARY POLICY: central bank decreases the money supply (sells bonds / raises the policy rate) → nominal interest rate RISES → investment falls → AD shifts LEFT → Y down, P down, unemployment up.` },
    { loId: 'apmacro.fiscal-monetary-short-run', content: `THE KEY DIFFERENCE IN THE INTEREST-RATE CHANNEL. Monetary policy moves the interest rate FIRST (in the money market), and that rate change drives AD. Expansionary fiscal policy, by contrast, can RAISE the interest rate (crowding out — Unit 5 later): higher G with more borrowing pushes up the demand for loanable funds / money, nudging rates up.` },
    { loId: 'apmacro.fiscal-monetary-short-run', content: `TWO-DIAGRAM REASONING for monetary policy: (1) MONEY MARKET — shift money supply, read the new nominal interest rate; (2) AD-AS — the rate change shifts AD, read new Y and P. AP free-response frequently asks for BOTH graphs and the causal chain between them.` },
    { loId: 'apmacro.fiscal-monetary-short-run', content: `COMBINED / MIXED POLICY: the two levers can REINFORCE or OFFSET. Both expansionary → AD shifts far right (strong output boost, larger price-level rise). Expansionary fiscal + contractionary monetary → AD effects partly cancel; the net output effect is ambiguous, but the policy MIX strongly affects the INTEREST RATE (e.g. loose fiscal + tight money = high interest rates).` },
    { loId: 'apmacro.fiscal-monetary-short-run', content: `SHORT-RUN vs LONG-RUN preview. These are SHORT-RUN effects (movements with a fixed SRAS and given expectations). The rest of Unit 5 examines what happens AFTER the short run: the Phillips Curve, money growth and inflation, deficits and debt, crowding out, and growth.` },
    { loId: 'apmacro.fiscal-monetary-short-run', kind: 'definition', title: 'stabilization policy', content: `fiscal or monetary actions used to move the economy toward full-employment output and price stability.` },
    { loId: 'apmacro.fiscal-monetary-short-run', kind: 'definition', title: 'policy mix', content: `the combination of fiscal and monetary policy in use; reinforcing or offsetting, with strong effects on the interest rate.` },
  ],
  methods: [
    {
      title: 'Worked monetary chain',
      steps: [
        `STEP 1 — MONEY MARKET. Buying bonds INCREASES the money supply. The money supply curve (vertical) shifts RIGHT. With money demand fixed, the equilibrium NOMINAL INTEREST RATE FALLS.`,
        `STEP 2 — TRANSMISSION. A lower interest rate makes borrowing cheaper → INVESTMENT spending rises (and interest-sensitive consumption rises). These are components of aggregate demand.`,
        `STEP 3 — AD-AS. Higher investment/consumption shifts AGGREGATE DEMAND to the RIGHT. Along the upward-sloping SRAS, the new equilibrium has higher real output and a higher price level.`,
        `STEP 4 — OUTPUT & UNEMPLOYMENT. Real output Y RISES (moving toward potential, closing the recessionary gap). As output rises, firms hire more → UNEMPLOYMENT FALLS toward the natural rate.`,
        `STEP 5 — SUMMARY OF SHORT-RUN EFFECTS. Nominal interest rate: DOWN. Investment: UP. Real output: UP. Price level: UP. Unemployment: DOWN. This is the canonical expansionary-monetary chain the exam wants stated explicitly.`,
      ],
      example: { problem: `An economy is in a short-run recessionary gap. The central bank conducts expansionary monetary policy by buying government bonds. (a) Trace the effect through the money market and the AD-AS model. (b) State the short-run effect on real output, the price level, unemployment, and the nominal interest rate.`, solution: `Money supply up → nominal interest rate down → investment up → AD right → real output up, price level up, unemployment down.` },
      relatedLoIds: ['apmacro.fiscal-monetary-short-run'],
    },
  ],
  pointers: [
    { content: 'In the short run, both fiscal and monetary policy work by shifting AD.', kind: 'tip' },
    { content: 'Expansionary (↑G, ↓T, ↑money supply) → AD right → Y up, P up, unemployment down.', kind: 'tip' },
    { content: `Contractionary (↓G, ↑T, ↓money supply) → AD left → Y down, P down, unemployment up.`, kind: 'tip' },
    { content: 'Monetary policy acts through the interest rate: money market first, then AD-AS.', kind: 'tip' },
    { content: `Policy mix: opposite policies make the output effect ambiguous but can drive interest rates sharply (loose fiscal + tight money = high rates).`, kind: 'tip' },
  ],
};
