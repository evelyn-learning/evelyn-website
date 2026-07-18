/**
 * AP Macroeconomics — Unit 5 CED 5.2: The Phillips Curve.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.phillips-curve.v1). Hand-edit freely after extraction;
 * bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.phillips-curve.v1' }],
  theory: [
    { loId: 'apmacro.phillips-curve', content: `AXES (AP convention): y-axis = INFLATION RATE (percent); x-axis = UNEMPLOYMENT RATE (percent).` },
    { loId: 'apmacro.phillips-curve', content: `SHORT-RUN PHILLIPS CURVE (SRPC): DOWNWARD-sloping — lower unemployment goes with higher inflation. It is the AD-AS story in different clothes: AD shifting right along SRAS raises P and Y together, which in Phillips space is a move UP-LEFT (inflation up, UR down) along the SRPC.` },
    { loId: 'apmacro.phillips-curve', content: `LONG-RUN PHILLIPS CURVE (LRPC): VERTICAL at the NATURAL RATE of unemployment (NAIRU). In the long run there is NO trade-off — whatever inflation rate the economy settles at, unemployment returns to NAIRU.` },
    { loId: 'apmacro.phillips-curve', content: `WHY LRPC IS VERTICAL: at potential GDP the output gap is zero and cyclical unemployment is zero, so actual UR = NAIRU regardless of whether inflation runs at one, five, or ten percent. The long-run "trade-off" has no slope.` },
    { loId: 'apmacro.phillips-curve', content: `NAIRU (Non-Accelerating Inflation Rate of Unemployment) = the natural rate = frictional + structural unemployment — the same concept from Unit 2, set by labor-market structure, demographics, and technology, NOT by monetary policy.` },
    { loId: 'apmacro.phillips-curve', content: `EXPECTATIONS SET THE SRPC'S POSITION: expected inflation rising (say two → six percent) SHIFTS the SRPC UP/RIGHT — every UR now pairs with higher inflation, because workers demand compensating wages and firms price them in. Expectations falling (credible disinflation) shifts it DOWN/LEFT. Supply shocks shift the SRPC the same way (adverse shock → up/right).` },
    { loId: 'apmacro.phillips-curve', content: `SHIFT CLASSIFICATION: inflation expectations and supply shocks → SRPC shifts. STRUCTURAL labor-market changes (technology lowering structural unemployment, demographics) → LRPC shifts (NAIRU moves). A credible inflation-target commitment that re-anchors expectations shifts the SRPC DOWN — what central-bank "credibility" buys.` },
    { loId: 'apmacro.phillips-curve', content: `SHORT-RUN TRADE-OFF, LONG-RUN NONE: the central bank CAN push UR below NAIRU temporarily by accepting higher inflation (up-left ALONG the SRPC). But expectations then adjust, the SRPC shifts UP, and UR returns to NAIRU at permanently higher inflation. The UR gain is TEMPORARY; the inflation increase is PERSISTENT.` },
    { loId: 'apmacro.phillips-curve', content: `ACCELERATIONIST LESSON: holding UR below NAIRU requires ever-ACCELERATING inflation to keep outrunning expectations. The nineteen-seventies stagflation episodes demonstrated this; expectations re-anchored only after the aggressive disinflation of 1979-82 (at the cost of a deep recession).` },
    { loId: 'apmacro.phillips-curve', content: `AD-AS ↔ PHILLIPS TRANSLATION: AD right = up-left ALONG SRPC (demand-pull). AD left = down-right along SRPC. SRAS left (adverse supply shock) = SRPC SHIFTS UP/RIGHT (higher inflation AND higher UR — stagflation). SRAS right = SRPC shifts down/left.` },
    { loId: 'apmacro.phillips-curve', kind: 'definition', title: 'short-run Phillips Curve (SRPC)', content: `downward-sloping curve showing the short-run trade-off between unemployment and inflation; positioned by expected inflation.` },
    { loId: 'apmacro.phillips-curve', kind: 'definition', title: 'long-run Phillips Curve (LRPC)', content: `vertical line at NAIRU showing no long-run trade-off between unemployment and inflation.` },
    { loId: 'apmacro.phillips-curve', kind: 'definition', title: 'NAIRU', content: `Non-Accelerating Inflation Rate of Unemployment; the natural rate of unemployment.` },
  ],
  methods: [
    {
      title: 'Analyze an expectations shock on the Phillips diagram',
      steps: [
        `STEP 1 — START at long-run equilibrium: UR at NAIRU, inflation at its expected rate, SRPC passing through that point on the LRPC.`,
        `STEP 2 — CLASSIFY the event: expectations change or supply shock → SRPC SHIFTS; demand change → movement ALONG the SRPC; structural labor-market change → LRPC moves.`,
        `STEP 3 — SHIFT the SRPC (up/right for higher expected inflation or adverse supply shock) and locate the new short-run point — often higher inflation with higher UR (stagflation pattern) for adverse shocks.`,
        `STEP 4 — LONG RUN with no policy response: operating above NAIRU slowly grinds wage growth and expectations back down; the SRPC drifts down; UR returns to NAIRU.`,
        `STEP 5 — STATE the permanent vs temporary split: UR ends at NAIRU regardless; the price LEVEL keeps whatever inflation occurred along the way.`,
      ],
      example: {
        problem: `An economy starts at NAIRU of five percent with inflation of two percent. An oil shock raises expected inflation to six percent. Trace the SRPC, the new short-run point (AD held constant), and the long run with no intervention.`,
        solution: `SRPC SHIFTS UP/RIGHT (every UR now pairs with roughly four points more inflation). Short run: inflation near six percent with UR rising above five — stagflation. Long run: high unemployment grinds expectations back down, the SRPC drifts down/left, UR returns to the five percent NAIRU — but the price level is permanently higher for the inflation endured.`,
      },
      relatedLoIds: ['apmacro.phillips-curve'],
    },
  ],
  pointers: [
    { content: 'SRPC: downward, positioned by EXPECTED inflation. LRPC: vertical at NAIRU, positioned by structure.', kind: 'tip' },
    { content: 'AD shifts move you ALONG the SRPC; expectations and supply shocks SHIFT the SRPC; NAIRU changes shift the LRPC.', kind: 'tip' },
    { content: 'Adverse supply shock = SRPC up/right = stagflation (inflation AND unemployment up).', kind: 'tip' },
    { content: 'No long-run trade-off: pushing UR below NAIRU buys temporary jobs at permanent inflation.', kind: 'tip' },
    { content: 'Sub-NAIRU targeting → ACCELERATING inflation — the nineteen-seventies lesson.', kind: 'tip' },
    { content: 'Central-bank credibility shifts the SRPC DOWN — lower inflation at any UR.', kind: 'tip' },
  ],
};
