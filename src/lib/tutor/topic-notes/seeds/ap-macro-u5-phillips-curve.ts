/**
 * AP Macroeconomics — Unit 5 CED 5.2: The Phillips Curve.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.phillips-curve.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_PHILLIPS_CURVE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.phillips-curve.v1',
  course: 'AP Macroeconomics',
  cedUnit: 5,
  cedTopic: '5.2',
  cedTitle: 'The Phillips Curve',
  planId: 'evelyn.ap.macro.phillips-curve.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.phillips-curve.v1' }],
  theory: [
    { loId: 'apmacro.phillips-curve', content: `AXES: y-axis = INFLATION RATE (%); x-axis = UNEMPLOYMENT RATE (%). AP convention.` },
    { loId: 'apmacro.phillips-curve', content: `SHORT-RUN PHILLIPS CURVE (SRPC): DOWNWARD-sloping. As UR falls, inflation tends to rise. Why? Because falling unemployment typically corresponds to AD shifting right along an upward-sloping SRAS — both Y and P rise; UR falls, inflation rises. The SRPC and AD-AS framework describe the SAME phenomenon from different angles.` },
    { loId: 'apmacro.phillips-curve', content: `LONG-RUN PHILLIPS CURVE (LRPC): VERTICAL at the NATURAL RATE OF UNEMPLOYMENT (NAIRU). In the long run, no permanent tradeoff between unemployment and inflation. Whatever inflation rate the economy settles at, UR returns to NAIRU.` },
    { loId: 'apmacro.phillips-curve', content: `WHY LRPC IS VERTICAL: when the economy operates at potential GDP (output gap = 0), cyclical unemployment is zero and actual UR = NAIRU. Inflation can be 1%, 5%, or 10% — but UR is at NAIRU regardless. The long-run trade-off has no slope.` },
    { loId: 'apmacro.phillips-curve', content: `NAIRU = NATURAL RATE OF UNEMPLOYMENT = frictional + structural unemployment. Same concept from U2.3.` },
    { loId: 'apmacro.phillips-curve', content: `INFLATION EXPECTATIONS shift the SRPC. (1) If people EXPECT 5% inflation: workers demand wages compensating for 5% inflation; firms set prices anticipating 5%; the SRPC sits at the level where 5% inflation occurs at NAIRU. (2) If expected inflation rises to 8%: SRPC SHIFTS UP/RIGHT — same UR now corresponds to higher inflation. (3) If expected inflation falls to 2%: SRPC SHIFTS DOWN/LEFT.` },
    { loId: 'apmacro.phillips-curve', content: `POLICY IMPLICATION — short-run tradeoff: yes, the central bank can in the SHORT RUN reduce UR below NAIRU by accepting higher inflation (move UP-LEFT along SRPC). And it can reduce inflation by accepting higher UR (move DOWN-RIGHT). But...` },
    { loId: 'apmacro.phillips-curve', content: `POLICY IMPLICATION — no long-run tradeoff: in the LONG RUN, expectations adjust. The SRPC shifts to meet the higher inflation; UR returns to NAIRU. Persistent attempts to push UR below NAIRU produce escalating inflation without permanent UR reduction. This was a key insight from the 1970s stagflation experience.` },
    { loId: 'apmacro.phillips-curve', content: `CONNECTION TO AD-AS: the SRPC corresponds to movements along SRAS in AD-AS. AD shifts right → along SRAS → P up, Y up → in Phillips space, UR down + inflation up = move UP-LEFT along SRPC. The two diagrams are equivalent representations.` },
    { loId: 'apmacro.phillips-curve', kind: 'definition', title: 'short-run Phillips Curve (SRPC)', content: `downward-sloping curve showing the short-run tradeoff between unemployment and inflation.` },
    { loId: 'apmacro.phillips-curve', kind: 'definition', title: 'long-run Phillips Curve (LRPC)', content: `vertical line at NAIRU showing no long-run tradeoff between unemployment and inflation.` },
    { loId: 'apmacro.phillips-curve', kind: 'definition', title: 'NAIRU', content: `Non-Accelerating Inflation Rate of Unemployment; the natural rate of unemployment.` },
  ],
  methods: [
    {
      title: 'Worked srpc shift',
      steps: [
        `STEP 1 — INITIAL STATE. Economy at long-run equilibrium: UR = 5% = NAIRU; inflation = 2%; SRPC sits at the level where 2% inflation matches NAIRU.`,
        `STEP 2 — SHOCK: inflation expectations rise to 6%. The SRPC SHIFTS UPWARD/RIGHTWARD. At every level of UR, inflation is now 4 percentage points higher than before (5%-NAIRU still aligns with the new SRPC, but at 6% inflation).`,
        `STEP 3 — NEW SHORT-RUN POINT. With AD held constant, the economy ends up at higher inflation AND likely slightly higher UR (cost-push from supply shock). On the new SRPC, UR may rise to 6-7% with inflation at 6%+. The economy is now in a recessionary gap with higher inflation = STAGFLATION pattern.`,
        `STEP 4 — LONG RUN with no policy intervention. As the economy operates with high UR (above NAIRU), workers gradually accept lower wage growth; firms' input costs grow more slowly; inflation expectations gradually decline back toward target. The SRPC shifts DOWN/LEFT as expectations re-anchor. UR returns to NAIRU eventually; the new long-run equilibrium has UR = 5% (NAIRU) but the price-LEVEL is permanently higher (the inflation that occurred during the adjustment cannot be undone — only its rate).`,
        `STEP 5 — INTUITION. The SRPC is "set" by inflation expectations. Shocks to expectations move the SRPC; the LRPC stays put at NAIRU. In the long run, the economy returns to NAIRU at whatever inflation rate the central bank+expectations settle on. The 1970s repeatedly tested this: stagflation episodes saw SRPC shift up; eventually expectations adjusted (especially after Volcker's anti-inflation campaign 1979-82).`,
      ],
      example: { problem: `An economy is initially at NAIRU = 5%, inflation = 2%, with the SRPC consistent with these expected values. Then a major oil shock raises inflation expectations: workers and firms now expect 6% inflation. (a) Identify the effect on the SRPC. (b) State the new short-run combination of UR and inflation if monetary policy holds AD constant. (c) Trace what happens in the long run if the central bank does nothing.`, solution: `SRPC shifts up/right (rising inflation expectations). New short-run point: higher inflation, higher UR (stagflation). Long run: UR returns to NAIRU as expectations re-anchor; price level permanently higher.` },
      relatedLoIds: ['apmacro.phillips-curve'],
    },
  ],
  pointers: [
    { content: 'SRPC: downward-sloping. Position set by inflation expectations.', kind: 'tip' },
    { content: 'LRPC: vertical at NAIRU. Position set by structural / frictional unemployment.', kind: 'tip' },
    { content: 'SRPC shifts UP with rising inflation expectations or supply shocks.', kind: 'tip' },
    { content: 'No long-run trade-off. Expectations adjust; UR returns to NAIRU.', kind: 'tip' },
    { content: `Pushing UR below NAIRU produces ACCELERATING inflation — temporary UR gain, permanent inflation increase.`, kind: 'tip' },
  ],
};
