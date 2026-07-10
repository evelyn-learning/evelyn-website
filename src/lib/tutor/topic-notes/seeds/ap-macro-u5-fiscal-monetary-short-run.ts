/**
 * AP Macroeconomics — Unit 5 CED 5.1: Fiscal and Monetary Policy Actions in the Short Run.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.fiscal-monetary-short-run.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.fiscal-monetary-short-run.v1' }],
  theory: [
    { loId: 'apmacro.fiscal-monetary-short-run', content: `BOTH POLICIES WORK THROUGH AD in the short run: fiscal policy (G, T) and monetary policy (money supply / policy rate) each shift AGGREGATE DEMAND. With upward-sloping SRAS, AD right → Y up AND P up; AD left → both down.` },
    { loId: 'apmacro.fiscal-monetary-short-run', content: `EXPANSIONARY FISCAL: raise G or cut T → AD RIGHT → Y up, P up, unemployment DOWN. For a RECESSIONARY gap. CONTRACTIONARY FISCAL: cut G or raise T → AD LEFT → Y down, P down, unemployment UP. For an INFLATIONARY gap.` },
    { loId: 'apmacro.fiscal-monetary-short-run', content: `EXPANSIONARY MONETARY: central bank BUYS bonds / lowers the policy rate → money supply rises → NOMINAL INTEREST RATE FALLS (money market) → investment and rate-sensitive consumption rise → AD RIGHT → Y up, P up, unemployment down.` },
    { loId: 'apmacro.fiscal-monetary-short-run', content: `CONTRACTIONARY MONETARY: SELLS bonds / raises the policy rate → money supply falls → nominal interest rate RISES → I falls → AD LEFT → Y down, P down, unemployment up.` },
    { loId: 'apmacro.fiscal-monetary-short-run', content: `THE CANONICAL EXPANSIONARY-MONETARY CHAIN (state it in full on FRQs): money supply up → nominal interest rate down → investment up → AD right → real output up, price level up, unemployment down.` },
    { loId: 'apmacro.fiscal-monetary-short-run', content: `TWO-DIAGRAM REASONING for monetary policy: (1) MONEY MARKET — shift the vertical money supply line, read the new nominal interest rate; (2) AD-AS — the rate change moves I, shifting AD; read new Y and P. AP FRQs frequently require BOTH graphs plus the causal chain connecting them.` },
    { loId: 'apmacro.fiscal-monetary-short-run', content: `INTEREST-RATE CHANNEL DIFFERENCE: monetary policy moves the interest rate FIRST and the rate change drives AD. Expansionary FISCAL policy tends to RAISE the interest rate as a side effect — deficit borrowing pushes up demand for loanable funds (crowding out).` },
    { loId: 'apmacro.fiscal-monetary-short-run', content: `POLICY MIX — REINFORCING: both expansionary → AD shifts far right; strong output boost, larger price-level rise. Both contractionary → strong cooling.` },
    { loId: 'apmacro.fiscal-monetary-short-run', content: `POLICY MIX — OFFSETTING: expansionary fiscal + contractionary monetary → AD shifts partly cancel → NET OUTPUT AMBIGUOUS (depends on relative shift sizes). But BOTH channels push the INTEREST RATE UP — tight money directly, loose fiscal via crowding out. "Loose fiscal + tight money" is the classic high-interest-rate recipe even when output barely moves.` },
    { loId: 'apmacro.fiscal-monetary-short-run', content: `SCOPE NOTE: these are SHORT-RUN effects (fixed SRAS, given expectations). The rest of Unit 5 supplies the long-run consequences — Phillips curve, money growth and inflation, deficits/debt, long-run crowding out, growth.` },
    { loId: 'apmacro.fiscal-monetary-short-run', kind: 'definition', title: 'stabilization policy', content: `fiscal or monetary actions used to move the economy toward full-employment output and price stability.` },
    { loId: 'apmacro.fiscal-monetary-short-run', kind: 'definition', title: 'policy mix', content: `the combination of fiscal and monetary policy in use; reinforcing or offsetting, with strong effects on the interest rate.` },
  ],
  methods: [
    {
      title: 'Trace a monetary-policy action through money market and AD-AS',
      steps: [
        `STEP 1 — MONEY MARKET: bond purchase → money supply (vertical line) RIGHT → equilibrium nominal interest rate FALLS. (Bond sale → the mirror.)`,
        `STEP 2 — TRANSMISSION: cheaper borrowing → investment (and rate-sensitive consumption) rises.`,
        `STEP 3 — AD-AS: I up → AD RIGHT → new equilibrium at higher Y and higher P along SRAS.`,
        `STEP 4 — LABOR MARKET: output up → hiring up → unemployment falls toward the natural rate.`,
        `STEP 5 — SUMMARIZE all five endpoints explicitly: nominal rate, investment, real output, price level, unemployment.`,
      ],
      example: {
        problem: `An economy sits in a recessionary gap. The central bank buys government bonds. Trace the effects and state the short-run outcome for output, price level, unemployment, and the nominal interest rate.`,
        solution: `Bond purchase → money supply right → nominal interest rate DOWN → investment UP → AD RIGHT → real output UP (gap closes), price level UP, unemployment DOWN. Five endpoints: rate down, I up, Y up, P up, UR down.`,
      },
      relatedLoIds: ['apmacro.fiscal-monetary-short-run'],
    },
    {
      title: 'Analyze a mixed (offsetting) policy scenario',
      steps: [
        `STEP 1 — DIRECTION of each lever: give the AD shift for the fiscal action and for the monetary action separately.`,
        `STEP 2 — NET OUTPUT: if the shifts oppose, state that Y and P are AMBIGUOUS pending relative magnitudes.`,
        `STEP 3 — INTEREST RATE: check both channels — monetary policy's direct effect, plus fiscal policy's crowding-out pressure. Often they AGREE even when output is ambiguous.`,
        `STEP 4 — CONCLUDE with the mix's signature (e.g. loose fiscal + tight money → ambiguous Y, decisively HIGHER interest rates).`,
      ],
      example: {
        problem: `The government sharply raises spending while the central bank sells bonds. What happens to AD, real output, and the nominal interest rate?`,
        solution: `Fiscal expansion → AD right; monetary contraction (rate up → I down) → AD left. Net output/price ambiguous — depends on relative sizes. Interest rate: UP decisively — tight money raises it directly AND deficit borrowing adds crowding-out pressure in the same direction.`,
      },
      relatedLoIds: ['apmacro.fiscal-monetary-short-run'],
    },
  ],
  pointers: [
    { content: 'Short run: both levers shift AD. Expansionary → Y↑ P↑ UR↓; contractionary → mirror.', kind: 'tip' },
    { content: 'Monetary FRQs want two graphs: money market first (rate), then AD-AS (Y, P) — plus the chain in words.', kind: 'tip' },
    { content: 'Expansionary monetary LOWERS rates; expansionary fiscal tends to RAISE them (crowding out).', kind: 'tip' },
    { content: 'Opposing policies: output ambiguous, but the interest rate can still be determinate — check both channels.', kind: 'tip' },
    { content: 'Loose fiscal + tight money = the classic high-interest-rate mix.', kind: 'tip' },
  ],
};
