/**
 * AP Macroeconomics — CED Unit 3.3: Short-Run Aggregate Supply.
 *
 * Why SRAS slopes upward (sticky wages, sticky prices, misperceptions),
 * what shifts SRAS (input prices, productivity, expectations,
 * taxes/subsidies), and how supply shocks affect equilibrium.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U3_SRAS: LessonPlan = {
  id: 'evelyn.ap.macro.short-run-aggregate-supply.v1',
  title: 'U3.3 Short-Run Aggregate Supply',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.short-run-aggregate-supply',
      description:
        'Define short-run aggregate supply, explain why SRAS slopes upward (sticky wages and prices, misperceptions), identify SRAS shifters (input prices, productivity, taxes/subsidies, expectations), and distinguish movement along from shift of SRAS.',
      standard: 'AP-MACRO-3.3',
    },
  ],
  prerequisites: ['apmacro.multipliers'],
  followUps: ['apmacro.long-run-aggregate-supply'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Distinguish short run from long run; SRAS is what slopes.',
      script:
        "When prices rise unexpectedly in the short run, firms produce MORE — because their costs (wages, materials) are locked in by contracts, so each extra unit sold means extra profit. That short-run profit motive is what gives SRAS its upward slope. In the long run, contracts adjust and the profit incentive disappears — that is why LRAS is vertical.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-sras',
      kind: 'concept',
      goal: 'Cover SRAS definition, why it slopes up (three classic explanations), and what shifts it.',
      keyIdeas: [
        'SHORT-RUN AGGREGATE SUPPLY (SRAS): the relationship between the price level and the quantity of real GDP that firms are willing to produce IN THE SHORT RUN, when at least some prices and wages are sticky.',
        'SRAS SLOPES UPWARD. Three classical explanations: (1) STICKY WAGES — wages are set by contracts that don\'t adjust immediately. When the price level rises, real wages fall (same nominal wage, higher prices); cheaper labor lets firms expand profitably. Quantity supplied rises.',
        '(2) STICKY PRICES — many firms set prices that don\'t change instantly (menu costs, contracts, brand consistency). When the aggregate price level rises but a firm\'s price hasn\'t adjusted yet, the firm faces relatively higher demand at unchanged price → produces more.',
        '(3) MISPERCEPTIONS — firms mistake a general price-level rise for an increase in demand for their specific product, leading them to expand production temporarily.',
        'In all three explanations, the upward slope is TEMPORARY — it disappears in the long run as wages, prices, and expectations adjust. That is why LRAS is vertical (covered next plan).',
        'SRAS SHIFTERS — RIGHTWARD (more supply at any price level): falling input prices (lower oil, raw materials, wages), productivity gains, lower business taxes / new subsidies, expected lower future inflation, deregulation reducing production costs.',
        'SRAS SHIFTERS — LEFTWARD (less supply at any price level — "supply shock"): rising input prices (oil shocks, wage hikes), productivity declines, higher business taxes, expected higher future inflation, supply chain disruptions, natural disasters.',
        'SUPPLY SHOCK = a sudden non-trivial leftward (or rightward) shift in SRAS. Negative supply shocks (leftward) raise the price level AND lower real GDP simultaneously — STAGFLATION. The 1970s oil crises are textbook examples. AP loves stagflation FRQs.',
        'MOVEMENT ALONG SRAS: caused by a change in price level (typically driven by AD shifts).',
        'SHIFT OF SRAS: caused by anything else — input prices, productivity, taxes/subsidies, expectations.',
      ],
      vocabulary: [
        { term: 'short-run aggregate supply (SRAS)', definition: 'the upward-sloping relationship between price level and quantity of real GDP firms produce in the short run, when wages and prices are sticky.' },
        { term: 'sticky wages', definition: 'wages that adjust slowly because of long-term contracts, custom, or institutional inertia.' },
        { term: 'supply shock', definition: 'a sudden shift in SRAS — typically due to input-price or productivity changes.' },
      ],
      suggestedTools: ['aggregate_demand_supply'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-supply-shock',
      kind: 'worked_example',
      problem:
        'A major oil-producing region experiences a war that disrupts oil exports. The world oil price doubles. Trace the effect on a typical oil-importing country\'s SRAS curve and on its short-run equilibrium price level and real GDP.',
      steps: [
        'STEP 1 — IDENTIFY the shock. Doubled oil prices = sharp rise in input prices for transportation, manufacturing, agriculture, and many other sectors. This is a NEGATIVE SUPPLY SHOCK.',
        'STEP 2 — DIRECTION on SRAS: rising input prices SHIFT SRAS LEFT. At any given price level, firms now produce LESS because their costs are higher.',
        'STEP 3 — NEW SHORT-RUN EQUILIBRIUM. With AD unchanged and SRAS shifted left, the new AD ∩ SRAS occurs at HIGHER price level AND LOWER real GDP. This is STAGFLATION — inflation up, GDP down.',
        'STEP 4 — UNEMPLOYMENT EFFECT. Lower real GDP means firms hire fewer workers. Cyclical unemployment rises ABOVE the natural rate.',
        'STEP 5 — POLICY DILEMMA. Standard fiscal/monetary tools struggle here. Expanding AD (rate cuts, fiscal stimulus) addresses the GDP/unemployment side but worsens inflation. Contracting AD addresses inflation but deepens recession. The 1973 and 1979 oil shocks famously trapped Western economies in this dilemma — neither tool helped both problems at once.',
        'STEP 6 — DIAGRAM. On AD-AS: SRAS shifts LEFT (dashed); AD unchanged. New equilibrium intersects above and to the left of original. Labels: P↑, Y↓.',
      ],
      answer: 'Negative supply shock → SRAS shifts LEFT → price level RISES, real GDP FALLS, unemployment RISES = STAGFLATION.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-three-explanations',
      kind: 'try_yourself',
      problem:
        'State the three classical explanations for why SRAS slopes upward. Briefly explain the mechanism behind each.',
      expectedAnswer:
        'STICKY WAGES: wages are set by contracts and adjust slowly. When the price level rises but wages haven\'t caught up, real wages fall — labor is cheaper for firms — they expand production profitably. Quantity supplied rises with price level. STICKY PRICES: many firms hold their own prices constant in the short run (menu costs, brand consistency). When the aggregate price level rises, these firms face higher real demand at their unchanged price → produce more. MISPERCEPTIONS: when prices rise economy-wide, individual firms initially mistake the rise for an increase in demand for their specific product → ramp up production. All three explain a TEMPORARY upward slope that disappears as wages, prices, and expectations catch up to the new price level — which is why LRAS (long-run AS) is vertical, not upward-sloping.',
      responseFormat: 'free',
      hints: [
        'Each explanation involves something that is LOCKED IN or SLOW TO ADJUST in the short run.',
        'In all three, real-world adjustment over time eliminates the effect.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-shifters',
      kind: 'try_yourself',
      problem:
        'For each event, identify whether it shifts SRAS LEFT, RIGHT, or causes movement along SRAS. Briefly justify each.',
      expectedAnswer:
        '(Sample scenarios — a typical AP problem would give 4-5; sample answers below.) (a) "A new technology raises labor productivity by 20%": SRAS shifts RIGHT. Productivity gains lower per-unit cost; firms supply more at any price level. (b) "Aggregate price level rises 8% due to a surge in AD": MOVEMENT ALONG SRAS — quantity supplied rises but the curve doesn\'t shift; AD shift caused price-level change. (c) "A new federal tax on businesses adds 5% to firms\' costs": SRAS shifts LEFT. Higher costs reduce quantity supplied at any price level. (d) "OPEC announces a permanent cut in oil production": SRAS shifts LEFT (negative supply shock). Higher input prices for energy-using sectors. (e) "Government cuts business taxes": SRAS shifts RIGHT. Lower production costs → more supply at any price level.',
      responseFormat: 'free',
      hints: [
        'Movement along is caused only by price-level changes.',
        'Shifts come from anything that changes production costs or productive capacity in the short run.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-stagflation-policy',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. A negative supply shock (e.g. a major oil-price spike) hits an economy. The result is stagflation: rising inflation AND rising unemployment. The central bank can use monetary policy to either raise or lower interest rates. (a) Explain why standard monetary policy is poorly suited to fix stagflation. (b) What is the policy trade-off the central bank faces?',
      expectedAnswer:
        '(a) Standard monetary policy works by shifting AGGREGATE DEMAND. EXPANSIONARY policy (lower interest rates) shifts AD right, raising both price level and real GDP. CONTRACTIONARY policy (higher rates) shifts AD left, lowering both. In stagflation, the problem is that BOTH price level is too high AND real GDP is too low. Expansionary AD policy fixes the GDP/unemployment side but WORSENS the inflation side. Contractionary policy fixes inflation but DEEPENS the recession. Either tool addresses ONE problem at the cost of the other; neither addresses both simultaneously. (b) The trade-off: tackle inflation (causing more unemployment in the short run) or tackle unemployment (causing more inflation). The central bank must pick its priority. Historically (1979-82), the Volcker Fed chose to fight inflation aggressively at the cost of a deep recession. The lesson AP wants: AD-side tools cannot fix supply-side problems; structural / supply-side reforms (productivity gains, easing input constraints) are needed to address stagflation directly. Strong answers explicitly identify that AD-side tools shift AD, not SRAS; that the underlying problem is on the SRAS side; and that the trade-off forces a priority choice.',
      responseFormat: 'frq',
      hints: [
        'Monetary policy operates on AD, not SRAS.',
        'Stagflation has problems on BOTH sides at once.',
        'Why does an AD-side tool create a trade-off when the problem is on SRAS?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SRAS slopes UP because of sticky wages, sticky prices, misperceptions — all temporary frictions.',
        'Shifters: input prices, productivity, taxes/subsidies, expectations.',
        'Negative supply shock = SRAS LEFT → STAGFLATION (P↑, Y↓, U↑).',
        'Positive supply shock = SRAS RIGHT → P↓, Y↑.',
        'Movement along = price level change. Shift = anything else affecting cost / capacity.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.3',
    cedTitle: 'Short-Run Aggregate Supply',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '11', note: 'OpenStax Macro AP — SRAS, sticky wages, supply shock framing.' },
    ],
  },
};
