/**
 * AP Macroeconomics — CED Unit 5.1: Fiscal and Monetary Policy Actions
 * in the Short Run.
 *
 * Synthesizes the short-run effects of fiscal policy (G, T) and monetary
 * policy (money supply / policy rate) on the AD-AS model: output, the
 * price level, unemployment, and the nominal interest rate. Sets up the
 * long-run consequences explored across the rest of Unit 5.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U5_FISCAL_MONETARY_SHORT_RUN: LessonPlan = {
  id: 'evelyn.ap.macro.fiscal-monetary-short-run.v1',
  title: 'U5.1 Fiscal and Monetary Policy Actions in the Short Run',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.fiscal-monetary-short-run',
      description:
        'Determine the short-run effects of fiscal policy (changes in government spending and taxes) and monetary policy (changes in the money supply / policy interest rate) on real output, the price level, unemployment, and the nominal interest rate using the AD-AS and money-market models, including combined (mixed) policy scenarios.',
      standard: 'AP-MACRO-5.1',
    },
  ],
  prerequisites: ['apmacro.monetary-policy', 'apmacro.fiscal-policy'],
  followUps: ['apmacro.phillips-curve'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Unit 5 as zooming out: how the two stabilization levers act together in the short run.',
      script:
        "You've met fiscal policy in Unit 3 and monetary policy in Unit 4 separately. Unit 5 starts by putting them on the same table: in the short run, BOTH can shift aggregate demand to close an output gap. The skill the exam wants is fluency — given any policy action, trace its effect on output, the price level, unemployment, and interest rates, and predict what happens when the two policies are used together or pull in opposite directions. Today we build that one master chain of reasoning.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-policy-actions',
      kind: 'concept',
      goal: 'Cover the short-run AD effects of fiscal and monetary policy on output, price level, unemployment, and interest rates, including mixed policy.',
      keyIdeas: [
        'BOTH POLICIES WORK THROUGH AD in the short run. Fiscal policy (government spending G, taxes T) and monetary policy (money supply / policy rate) both shift the AGGREGATE DEMAND curve. With an upward-sloping SRAS, a rightward AD shift raises both real output (Y) and the price level (P); a leftward shift lowers both.',
        'EXPANSIONARY FISCAL POLICY: increase G or cut T → AD shifts RIGHT → Y up, P up, unemployment DOWN. Use to close a RECESSIONARY gap (Y below potential).',
        'CONTRACTIONARY FISCAL POLICY: decrease G or raise T → AD shifts LEFT → Y down, P down, unemployment UP. Use to close an INFLATIONARY gap (Y above potential).',
        'EXPANSIONARY MONETARY POLICY: central bank increases the money supply (buys bonds / lowers the policy rate). In the MONEY MARKET, more money supply → nominal interest rate FALLS → investment and interest-sensitive consumption rise → AD shifts RIGHT → Y up, P up, unemployment down.',
        'CONTRACTIONARY MONETARY POLICY: central bank decreases the money supply (sells bonds / raises the policy rate) → nominal interest rate RISES → investment falls → AD shifts LEFT → Y down, P down, unemployment up.',
        'THE KEY DIFFERENCE IN THE INTEREST-RATE CHANNEL. Monetary policy moves the interest rate FIRST (in the money market), and that rate change drives AD. Expansionary fiscal policy, by contrast, can RAISE the interest rate (crowding out — Unit 5 later): higher G with more borrowing pushes up the demand for loanable funds / money, nudging rates up.',
        'TWO-DIAGRAM REASONING for monetary policy: (1) MONEY MARKET — shift money supply, read the new nominal interest rate; (2) AD-AS — the rate change shifts AD, read new Y and P. AP free-response frequently asks for BOTH graphs and the causal chain between them.',
        'COMBINED / MIXED POLICY: the two levers can REINFORCE or OFFSET. Both expansionary → AD shifts far right (strong output boost, larger price-level rise). Expansionary fiscal + contractionary monetary → AD effects partly cancel; the net output effect is ambiguous, but the policy MIX strongly affects the INTEREST RATE (e.g. loose fiscal + tight money = high interest rates).',
        'SHORT-RUN vs LONG-RUN preview. These are SHORT-RUN effects (movements with a fixed SRAS and given expectations). The rest of Unit 5 examines what happens AFTER the short run: the Phillips Curve, money growth and inflation, deficits and debt, crowding out, and growth.',
      ],
      vocabulary: [
        { term: 'stabilization policy', definition: 'fiscal or monetary actions used to move the economy toward full-employment output and price stability.' },
        { term: 'policy mix', definition: 'the combination of fiscal and monetary policy in use; reinforcing or offsetting, with strong effects on the interest rate.' },
      ],
      suggestedTools: ['aggregate_demand_supply', 'money_market'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-monetary-chain',
      kind: 'worked_example',
      problem:
        'An economy is in a short-run recessionary gap. The central bank conducts expansionary monetary policy by buying government bonds. (a) Trace the effect through the money market and the AD-AS model. (b) State the short-run effect on real output, the price level, unemployment, and the nominal interest rate.',
      steps: [
        'STEP 1 — MONEY MARKET. Buying bonds INCREASES the money supply. The money supply curve (vertical) shifts RIGHT. With money demand fixed, the equilibrium NOMINAL INTEREST RATE FALLS.',
        'STEP 2 — TRANSMISSION. A lower interest rate makes borrowing cheaper → INVESTMENT spending rises (and interest-sensitive consumption rises). These are components of aggregate demand.',
        'STEP 3 — AD-AS. Higher investment/consumption shifts AGGREGATE DEMAND to the RIGHT. Along the upward-sloping SRAS, the new equilibrium has higher real output and a higher price level.',
        'STEP 4 — OUTPUT & UNEMPLOYMENT. Real output Y RISES (moving toward potential, closing the recessionary gap). As output rises, firms hire more → UNEMPLOYMENT FALLS toward the natural rate.',
        'STEP 5 — SUMMARY OF SHORT-RUN EFFECTS. Nominal interest rate: DOWN. Investment: UP. Real output: UP. Price level: UP. Unemployment: DOWN. This is the canonical expansionary-monetary chain the exam wants stated explicitly.',
      ],
      answer: 'Money supply up → nominal interest rate down → investment up → AD right → real output up, price level up, unemployment down.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-fiscal-action',
      kind: 'try_yourself',
      problem:
        'An economy is producing above potential (an inflationary gap). The government uses contractionary fiscal policy. (a) Name two specific fiscal actions it could take. (b) State the short-run effect on aggregate demand, real output, the price level, and unemployment.',
      expectedAnswer:
        '(a) Two contractionary fiscal actions: DECREASE government spending (G) and/or INCREASE taxes (T). Either reduces a component of aggregate demand (G directly; higher T lowers disposable income → lower consumption). (b) AGGREGATE DEMAND shifts LEFT. Along the upward-sloping SRAS, the new short-run equilibrium has: real OUTPUT DOWN (moving back toward potential, closing the inflationary gap), PRICE LEVEL DOWN (easing inflationary pressure), and UNEMPLOYMENT UP (rising toward the natural rate as output falls). This is the appropriate policy for an inflationary gap: cool down an overheating economy. Strong answers name specific actions and give all of AD direction, Y, P, and unemployment.',
      responseFormat: 'free',
      hints: [
        'Contractionary fiscal = lower G or higher T.',
        'Which way does AD shift?',
        'Trace Y, P, and unemployment off the AD-AS graph.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-policy-mix',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. A government pursues EXPANSIONARY fiscal policy (a large increase in government spending) while the central bank simultaneously pursues CONTRACTIONARY monetary policy (selling bonds). (a) Describe the effect of EACH policy on aggregate demand. (b) Explain why the net effect on real output is ambiguous. (c) Explain the combined effect on the nominal interest rate and why this policy mix is associated with high interest rates.',
      expectedAnswer:
        '(a) EXPANSIONARY FISCAL (higher G) shifts AD to the RIGHT. CONTRACTIONARY MONETARY (selling bonds reduces the money supply) raises the nominal interest rate, reducing investment and shifting AD to the LEFT. The two policies push AD in OPPOSITE directions. (b) NET OUTPUT IS AMBIGUOUS because the rightward (fiscal) and leftward (monetary) AD shifts partially or fully offset — the net change in AD, and therefore in real output Y and the price level, depends on the relative SIZE of the two shifts. If the fiscal expansion dominates, Y rises; if the monetary contraction dominates, Y falls; if they are equal, Y is roughly unchanged. (c) INTEREST RATE: BOTH forces push the nominal interest rate UP. Contractionary monetary policy directly raises it (smaller money supply). Expansionary fiscal policy ADDS upward pressure through CROWDING OUT — increased government borrowing raises the demand for loanable funds / money, pushing rates higher still. So "loose fiscal + tight money" is the classic recipe for HIGH interest rates, even when the output effect is muted. Strong answers (i) give each policy\'s AD direction, (ii) explain the offset → ambiguous output, and (iii) identify that both channels raise the interest rate (monetary directly + fiscal via crowding out).',
      responseFormat: 'frq',
      hints: [
        'Each policy shifts AD — but which direction for each?',
        'Opposite AD shifts ⇒ net output depends on relative magnitudes.',
        'Both tight money and government borrowing push interest rates the same way.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'In the short run, both fiscal and monetary policy work by shifting AD.',
        'Expansionary (↑G, ↓T, ↑money supply) → AD right → Y up, P up, unemployment down.',
        'Contractionary (↓G, ↑T, ↓money supply) → AD left → Y down, P down, unemployment up.',
        'Monetary policy acts through the interest rate: money market first, then AD-AS.',
        'Policy mix: opposite policies make the output effect ambiguous but can drive interest rates sharply (loose fiscal + tight money = high rates).',
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
    cedTitle: 'Fiscal and Monetary Policy Actions in the Short Run',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '12', note: 'OpenStax Macro AP — short-run effects of fiscal and monetary policy on AD, output, price level, and interest rates.' },
    ],
  },
};
