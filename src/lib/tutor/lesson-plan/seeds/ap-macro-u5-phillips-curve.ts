/**
 * AP Macroeconomics — CED Unit 5.1: The Phillips Curve.
 *
 * Short-run Phillips Curve (downward-sloping inflation-unemployment
 * tradeoff) and long-run Phillips Curve (vertical at NAIRU). Connects
 * the AD-AS framework to the unemployment-inflation observation.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U5_PHILLIPS_CURVE: LessonPlan = {
  id: 'evelyn.ap.macro.phillips-curve.v1',
  title: 'The Phillips Curve',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.phillips-curve',
      description:
        'Construct the short-run Phillips Curve (downward-sloping) and long-run Phillips Curve (vertical at NAIRU), explain the role of inflation expectations in shifting the SRPC, and connect Phillips Curve dynamics to AD-AS shifts.',
      standard: 'AP-MACRO-5.1',
    },
  ],
  prerequisites: ['apmacro.loanable-funds-market'],
  followUps: ['apmacro.money-growth-inflation'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the Phillips Curve as a once-controversial empirical observation.',
      script:
        "In 1958, A.W. Phillips noticed that periods of low unemployment in the UK tended to coincide with high inflation, and high unemployment with low inflation. The relationship became one of the most-tested empirical patterns in economics — and a source of ongoing debate. Today's Phillips Curve has both a short-run AND a long-run version, and the difference between them drives modern monetary policy.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-phillips',
      kind: 'concept',
      goal: 'Cover SRPC, LRPC, expectations role, and the Phillips Curve / AD-AS connection.',
      keyIdeas: [
        'AXES: y-axis = INFLATION RATE (%); x-axis = UNEMPLOYMENT RATE (%). AP convention.',
        'SHORT-RUN PHILLIPS CURVE (SRPC): DOWNWARD-sloping. As UR falls, inflation tends to rise. Why? Because falling unemployment typically corresponds to AD shifting right along an upward-sloping SRAS — both Y and P rise; UR falls, inflation rises. The SRPC and AD-AS framework describe the SAME phenomenon from different angles.',
        'LONG-RUN PHILLIPS CURVE (LRPC): VERTICAL at the NATURAL RATE OF UNEMPLOYMENT (NAIRU). In the long run, no permanent tradeoff between unemployment and inflation. Whatever inflation rate the economy settles at, UR returns to NAIRU.',
        'WHY LRPC IS VERTICAL: when the economy operates at potential GDP (output gap = 0), cyclical unemployment is zero and actual UR = NAIRU. Inflation can be 1%, 5%, or 10% — but UR is at NAIRU regardless. The long-run trade-off has no slope.',
        'NAIRU = NATURAL RATE OF UNEMPLOYMENT = frictional + structural unemployment. Same concept from U2.3.',
        'INFLATION EXPECTATIONS shift the SRPC. (1) If people EXPECT 5% inflation: workers demand wages compensating for 5% inflation; firms set prices anticipating 5%; the SRPC sits at the level where 5% inflation occurs at NAIRU. (2) If expected inflation rises to 8%: SRPC SHIFTS UP/RIGHT — same UR now corresponds to higher inflation. (3) If expected inflation falls to 2%: SRPC SHIFTS DOWN/LEFT.',
        'POLICY IMPLICATION — short-run tradeoff: yes, the central bank can in the SHORT RUN reduce UR below NAIRU by accepting higher inflation (move UP-LEFT along SRPC). And it can reduce inflation by accepting higher UR (move DOWN-RIGHT). But...',
        'POLICY IMPLICATION — no long-run tradeoff: in the LONG RUN, expectations adjust. The SRPC shifts to meet the higher inflation; UR returns to NAIRU. Persistent attempts to push UR below NAIRU produce escalating inflation without permanent UR reduction. This was a key insight from the 1970s stagflation experience.',
        'CONNECTION TO AD-AS: the SRPC corresponds to movements along SRAS in AD-AS. AD shifts right → along SRAS → P up, Y up → in Phillips space, UR down + inflation up = move UP-LEFT along SRPC. The two diagrams are equivalent representations.',
      ],
      vocabulary: [
        { term: 'short-run Phillips Curve (SRPC)', definition: 'downward-sloping curve showing the short-run tradeoff between unemployment and inflation.' },
        { term: 'long-run Phillips Curve (LRPC)', definition: 'vertical line at NAIRU showing no long-run tradeoff between unemployment and inflation.' },
        { term: 'NAIRU', definition: 'Non-Accelerating Inflation Rate of Unemployment; the natural rate of unemployment.' },
      ],
      suggestedTools: ['phillips_curve'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-srpc-shift',
      kind: 'worked_example',
      problem:
        'An economy is initially at NAIRU = 5%, inflation = 2%, with the SRPC consistent with these expected values. Then a major oil shock raises inflation expectations: workers and firms now expect 6% inflation. (a) Identify the effect on the SRPC. (b) State the new short-run combination of UR and inflation if monetary policy holds AD constant. (c) Trace what happens in the long run if the central bank does nothing.',
      steps: [
        'STEP 1 — INITIAL STATE. Economy at long-run equilibrium: UR = 5% = NAIRU; inflation = 2%; SRPC sits at the level where 2% inflation matches NAIRU.',
        'STEP 2 — SHOCK: inflation expectations rise to 6%. The SRPC SHIFTS UPWARD/RIGHTWARD. At every level of UR, inflation is now 4 percentage points higher than before (5%-NAIRU still aligns with the new SRPC, but at 6% inflation).',
        'STEP 3 — NEW SHORT-RUN POINT. With AD held constant, the economy ends up at higher inflation AND likely slightly higher UR (cost-push from supply shock). On the new SRPC, UR may rise to 6-7% with inflation at 6%+. The economy is now in a recessionary gap with higher inflation = STAGFLATION pattern.',
        'STEP 4 — LONG RUN with no policy intervention. As the economy operates with high UR (above NAIRU), workers gradually accept lower wage growth; firms\' input costs grow more slowly; inflation expectations gradually decline back toward target. The SRPC shifts DOWN/LEFT as expectations re-anchor. UR returns to NAIRU eventually; the new long-run equilibrium has UR = 5% (NAIRU) but the price-LEVEL is permanently higher (the inflation that occurred during the adjustment cannot be undone — only its rate).',
        'STEP 5 — INTUITION. The SRPC is "set" by inflation expectations. Shocks to expectations move the SRPC; the LRPC stays put at NAIRU. In the long run, the economy returns to NAIRU at whatever inflation rate the central bank+expectations settle on. The 1970s repeatedly tested this: stagflation episodes saw SRPC shift up; eventually expectations adjusted (especially after Volcker\'s anti-inflation campaign 1979-82).',
      ],
      answer: 'SRPC shifts up/right (rising inflation expectations). New short-run point: higher inflation, higher UR (stagflation). Long run: UR returns to NAIRU as expectations re-anchor; price level permanently higher.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-srpc-vs-lrpc',
      kind: 'try_yourself',
      problem:
        'Distinguish the SHORT-RUN Phillips Curve from the LONG-RUN Phillips Curve. Identify (i) the slope of each, (ii) what determines the position of each, and (iii) what policy implication each has.',
      expectedAnswer:
        'SHORT-RUN PHILLIPS CURVE (SRPC): DOWNWARD-sloping. Position is determined by EXPECTED INFLATION (and supply shocks). Policy implication: in the short run, the central bank CAN trade off inflation and unemployment — accept more inflation to push UR below NAIRU, or accept more UR to lower inflation. LONG-RUN PHILLIPS CURVE (LRPC): VERTICAL at NAIRU. Position is determined by the NATURAL RATE OF UNEMPLOYMENT (frictional + structural unemployment), which depends on labor-market structure, demographics, regulation, technology — not on monetary policy. Policy implication: in the long run, there is NO TRADE-OFF. UR returns to NAIRU at whatever inflation rate the economy settles on. Persistent stimulus to push UR below NAIRU produces accelerating inflation without permanent UR reduction. Strong answers explicitly connect SRPC to expected inflation and LRPC to NAIRU.',
      responseFormat: 'free',
      hints: [
        'SRPC: downward, set by expectations.',
        'LRPC: vertical, set by NAIRU.',
        'Trade-off exists in short run only.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-shift-classify',
      kind: 'try_yourself',
      problem:
        'For each event, identify what shifts (SRPC or LRPC) and the direction. (a) Inflation expectations rise from 2% to 5%. (b) An oil shock raises input prices. (c) Productivity-improving technology spreads across the labor market, lowering structural unemployment. (d) The central bank credibly commits to a 2% inflation target and households gradually trust the commitment.',
      expectedAnswer:
        '(a) "Inflation expectations rise": SRPC SHIFTS UP/RIGHT. Higher expected inflation means firms and workers bake higher inflation into wages and prices; same UR now corresponds to higher inflation. (b) "Oil shock raises input prices": SRPC SHIFTS UP/RIGHT (cost-push effect on inflation; equivalent to a leftward SRAS shift in AD-AS). (c) "Productivity tech lowers structural UR": LRPC SHIFTS LEFT (NAIRU falls). The economy can now sustain lower UR without accelerating inflation. (d) "Credible 2% inflation target re-anchors expectations downward": SRPC SHIFTS DOWN/LEFT. As inflation expectations fall toward 2%, the same UR now corresponds to lower inflation. This is what monetary-policy "credibility" buys: a lower SRPC for any given UR.',
      responseFormat: 'free',
      hints: [
        'Expectations and supply shocks: SRPC shifts.',
        'Structural changes (NAIRU): LRPC shifts.',
        'Direction: anything that raises inflation at given UR shifts SRPC UP.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-policy-tradeoff',
      kind: 'try_yourself',
      problem:
        "AP-style synthesis. The Federal Reserve is considering whether to use expansionary monetary policy to push unemployment below the natural rate of 4% to 3%. (a) Identify the SHORT-RUN effect on inflation and unemployment using the SRPC. (b) Identify the LONG-RUN effect once expectations adjust. (c) Explain why some economists argue this kind of policy is unwise even though it appears to work in the short run.",
      expectedAnswer:
        '(a) SHORT-RUN: expansionary monetary policy shifts AD right. On the SRPC, the economy moves UP-LEFT along the existing curve: UR falls (from 4% to 3%) and inflation RISES. The short-run trade-off appears to favor lower unemployment at the cost of higher inflation. (b) LONG-RUN: as inflation persists, inflation EXPECTATIONS RISE. Workers demand higher wages; firms set higher prices. The SRPC shifts UPWARD. The new SRPC, combined with the LRPC at 4% NAIRU, places the long-run equilibrium back at 4% UR but at a HIGHER inflation rate. The 1% reduction in UR proves TEMPORARY; the higher inflation is PERMANENT (until reversed by tighter policy at higher UR cost). (c) Argument against: pushing UR below NAIRU produces ACCELERATING inflation. Persistent attempts to maintain sub-NAIRU UR require ever-higher inflation to keep workers and firms "fooled" by gaps between expected and actual inflation. Once expectations catch up, the policy stops working; reverting causes recession at higher inflation. The 1970s tested this repeatedly — sub-NAIRU policies produced stagflation rather than sustained low UR. Strong answers explicitly cite (i) the temporary nature of the UR reduction, (ii) the permanent nature of the inflation increase, (iii) the role of expectations adjustment, (iv) the historical lesson from 1970s stagflation.',
      responseFormat: 'frq',
      hints: [
        'Move along SRPC for short-run answer.',
        'SRPC shifts up as expectations adjust.',
        'Final equilibrium: UR back at NAIRU with higher inflation.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SRPC: downward-sloping. Position set by inflation expectations.',
        'LRPC: vertical at NAIRU. Position set by structural / frictional unemployment.',
        'SRPC shifts UP with rising inflation expectations or supply shocks.',
        'No long-run trade-off. Expectations adjust; UR returns to NAIRU.',
        'Pushing UR below NAIRU produces ACCELERATING inflation — temporary UR gain, permanent inflation increase.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.1',
    cedTitle: 'The Phillips Curve',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '11', note: 'OpenStax Macro AP — Phillips Curve, expectations role, no long-run tradeoff.' },
    ],
  },
};
