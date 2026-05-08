/**
 * AP Macroeconomics — CED Unit 3.4: Long-Run Aggregate Supply.
 *
 * The vertical LRAS curve at potential GDP, what shifts LRAS (long-run
 * growth in resources / technology / human capital), and the
 * SRAS-vs-LRAS distinction that drives every long-run policy analysis.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U3_LRAS: LessonPlan = {
  id: 'evelyn.ap.macro.long-run-aggregate-supply.v1',
  title: 'Long-Run Aggregate Supply',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.long-run-aggregate-supply',
      description:
        'Define long-run aggregate supply as a vertical line at potential GDP, identify what shifts LRAS (resources, technology, human capital), and explain why LRAS is vertical while SRAS slopes upward.',
      standard: 'AP-MACRO-3.4',
    },
  ],
  prerequisites: ['apmacro.short-run-aggregate-supply'],
  followUps: ['apmacro.equilibrium-ad-as'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame LRAS as the structural ceiling of the economy.',
      script:
        "Picture an economy with all its workers employed, all its machines running, all its technology in use. That is potential GDP — what the economy can produce when nothing is wasted. The LRAS curve is just a vertical line at that level. In the long run, the price level can change all it wants — but the AMOUNT the economy can produce is determined by its real resources, not by prices.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-lras',
      kind: 'concept',
      goal: 'Cover LRAS definition, why it is vertical, what shifts it, and the SRAS-vs-LRAS distinction.',
      keyIdeas: [
        'LONG-RUN AGGREGATE SUPPLY (LRAS): a VERTICAL line at the level of POTENTIAL real GDP. The y-axis (price level) does not affect the x-position because in the long run the economy returns to producing at its potential.',
        'WHY LRAS IS VERTICAL: in the long run, wages, prices, and expectations FULLY adjust to any change in price level. Sticky wages unstick; menu costs are paid; misperceptions resolve. The frictions that gave SRAS its upward slope all disappear. What remains is the economy\'s actual productive capacity — determined by RESOURCES and TECHNOLOGY, not by prices.',
        'POTENTIAL GDP: the level of real output the economy produces at full employment (actual UR = natural rate). At potential, all available resources are being used as efficiently as the current technology allows. Sometimes called full-employment GDP.',
        'LRAS SHIFTERS — RIGHTWARD (long-run growth): more LABOR (population growth, immigration, increased participation), more CAPITAL (investment in machines, infrastructure), better TECHNOLOGY (R&D, innovation), better HUMAN CAPITAL (education, training, health), more NATURAL RESOURCES (discoveries), better INSTITUTIONS (rule of law, property rights, less corruption).',
        'LRAS SHIFTERS — LEFTWARD: opposite of the above. Population decline, capital destruction (war), technology setbacks (rare), human capital loss (poor education systems, brain drain), resource depletion, institutional collapse.',
        'KEY DISTINCTION: SRAS is about how much the economy CHOOSES to produce given current price-level signals; LRAS is about how much the economy CAN produce given its real productive capacity. AD-side policies (fiscal, monetary) can shift AD and thereby move along SRAS — but they CANNOT shift LRAS. Only structural / supply-side policies do that.',
        'IMPLICATION: in the long run, AD shifts only change the PRICE LEVEL, not real GDP. Real GDP is pinned at potential by LRAS. This is why printing money or running endless stimulus eventually only causes inflation, not real growth.',
      ],
      vocabulary: [
        { term: 'long-run aggregate supply (LRAS)', definition: 'a vertical line at potential GDP showing the amount of real output the economy produces in the long run.' },
        { term: 'potential GDP', definition: 'the real GDP an economy produces at full employment with all resources fully and efficiently used.' },
      ],
      suggestedTools: ['aggregate_demand_supply'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-lras-shift',
      kind: 'worked_example',
      problem:
        'Explain the long-run effect on the AD-AS model when an economy experiences each of the following: (a) A large wave of immigration that adds to the workforce. (b) A breakthrough in AI raises productivity across many sectors. (c) A massive infrastructure investment program (roads, ports, broadband). (d) A war that destroys 20% of the country\'s factories.',
      steps: [
        'STEP 1 — RULE: each event affects the economy\'s PRODUCTIVE CAPACITY → shifts LRAS. Determine direction.',
        'STEP 2 — EVENT (a) "Immigration wave": adds LABOR resources. LRAS shifts RIGHT. Long-run potential GDP rises.',
        'STEP 3 — EVENT (b) "AI productivity breakthrough": better TECHNOLOGY. LRAS shifts RIGHT. Same workforce produces more.',
        'STEP 4 — EVENT (c) "Infrastructure investment": adds CAPITAL (and may indirectly improve productivity). LRAS shifts RIGHT. (Note: also temporarily shifts AD right via G; the long-run shift is what matters here.)',
        'STEP 5 — EVENT (d) "War destroys 20% of factories": loses CAPITAL stock. LRAS shifts LEFT. Long-run potential GDP falls.',
        'STEP 6 — DIAGRAM. On AD-AS, each LRAS shift moves the vertical line. The new long-run equilibrium has AD ∩ new LRAS at the new potential GDP. Price level adjusts to wherever that intersection sits.',
      ],
      answer: '(a) LRAS right. (b) LRAS right. (c) LRAS right. (d) LRAS left.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-vertical-why',
      kind: 'try_yourself',
      problem:
        'Why is LRAS drawn as a vertical line while SRAS is upward-sloping? Use the concept of long-run vs short-run wage / price adjustment in your answer.',
      expectedAnswer:
        'SRAS slopes upward because in the SHORT RUN, wages and prices are STICKY — wage contracts are locked in, menu costs slow price changes, expectations lag reality. When the price level rises, real wages fall (since nominal wages haven\'t caught up), making labor cheaper and incentivizing firms to expand production. Quantity supplied rises with price level. In the LONG RUN, wages and prices FULLY adjust. Workers eventually demand wage increases that match the new price level; firms reset menu prices; expectations catch up. With wages and prices fully adjusted, the price-level rise no longer creates any profit incentive to expand. Output returns to whatever the economy\'s real resources and technology allow. Real GDP is then determined by RESOURCES and TECHNOLOGY, not by prices — that is why LRAS is vertical at potential. Strong answers explicitly distinguish "frictions present (SRAS)" from "frictions resolved (LRAS)."',
      responseFormat: 'free',
      hints: [
        'In the short run, what is locked in?',
        'What happens to those locked-in things in the long run?',
        'When all frictions resolve, what determines output?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-lras',
      kind: 'try_yourself',
      problem:
        'For each event, identify whether it shifts LRAS RIGHT, LRAS LEFT, or neither. Briefly justify.',
      expectedAnswer:
        '(Sample scenarios — typical AP problem; sample answers below.) (a) "A pandemic kills 5% of the working-age population": LRAS LEFT. Loss of labor resources. (b) "The Federal Reserve cuts interest rates by 1%": NEITHER (or "neither directly") — this is a monetary policy action that shifts AD, not LRAS. Long-run real output is unchanged. (c) "A new free-trade agreement allows access to cheaper foreign inputs and more efficient production": LRAS RIGHT. Effective resource expansion + productivity gain. (d) "Government raises minimum wage by 50%": NEITHER (in standard AP framing) — affects SRAS in short run via input prices, but does not change long-run productive capacity. (Some advanced texts argue minimum wage shocks could affect potential GDP slightly; AP treats this as primarily SRAS, not LRAS.) (e) "Massive R&D investment by both private and public sectors": LRAS RIGHT. Productivity gains accumulate over time, raising potential GDP.',
      responseFormat: 'free',
      hints: [
        'LRAS shifts only with changes in REAL productive capacity.',
        'Monetary policy and short-run AD-side events do NOT shift LRAS.',
        'Resources, technology, human capital → LRAS.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-monetary-no-real',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Suppose a central bank dramatically expands the money supply, shifting AD significantly to the right. (a) Describe the SHORT-RUN effects on real GDP and price level. (b) Describe the LONG-RUN effects after wages and prices fully adjust. (c) State what this implies about the long-run effectiveness of monetary stimulus for raising real GDP.',
      expectedAnswer:
        '(a) SHORT RUN: AD shifts right, intersecting SRAS at higher price level AND higher real GDP. The economy temporarily moves above potential — output gap turns positive, cyclical unemployment falls below natural rate, inflation rises. Both price and real GDP rise. (b) LONG RUN: as wages and prices fully adjust, SRAS shifts left (workers demand higher nominal wages to restore real wages; menu prices reset to reflect new price level). The economy returns to LRAS at the original potential GDP, but now at a HIGHER PRICE LEVEL. Real GDP returns to potential; only the price level remains elevated. (c) IMPLICATION: monetary stimulus CANNOT raise real GDP in the long run. It can shift the timing of output (boost short-run output above potential temporarily) and shift PRICE LEVEL permanently (cause inflation), but real long-run output is determined by LRAS — by real resources, technology, human capital, and institutions — none of which monetary policy directly affects. This is the essence of "money is neutral in the long run." Strong answers articulate the SRAS adjustment process and the distinct fates of price level (permanent change) vs real GDP (temporary deviation, no long-run change).',
      responseFormat: 'frq',
      hints: [
        'Trace the AD shift in two stages: short-run (only AD has moved) and long-run (SRAS has caught up).',
        'What ultimately determines real GDP in the long run?',
        'What does this say about whether monetary policy "works" for long-term growth?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'LRAS = vertical line at POTENTIAL GDP. Independent of price level.',
        'LRAS shifters: resources (labor, capital, natural), technology, human capital, institutions.',
        'AD-side policies (fiscal, monetary) do NOT shift LRAS.',
        'In the long run, AD shifts change PRICE LEVEL only — real GDP is pinned at potential.',
        'Money is "neutral" in the long run.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.4',
    cedTitle: 'Long-Run Aggregate Supply',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '11', note: 'OpenStax Macro AP — LRAS as vertical at potential, neutrality of money.' },
    ],
  },
};
