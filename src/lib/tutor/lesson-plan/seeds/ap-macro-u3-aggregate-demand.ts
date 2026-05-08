/**
 * AP Macroeconomics — CED Unit 3.1: Aggregate Demand.
 *
 * Defines the AD curve, why it slopes downward (wealth + interest-rate +
 * exchange-rate effects), and what causes movement along vs shift in AD.
 * The first plan that uses the aggregate_demand_supply structured tool.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U3_AGGREGATE_DEMAND: LessonPlan = {
  id: 'evelyn.ap.macro.aggregate-demand.v1',
  title: 'Aggregate Demand',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.aggregate-demand',
      description:
        'Define aggregate demand, identify its four components, explain the three reasons AD slopes downward (wealth, interest rate, exchange rate), and distinguish between movements along the AD curve and shifts of the AD curve.',
      standard: 'AP-MACRO-3.1',
    },
  ],
  prerequisites: ['apmacro.business-cycle'],
  followUps: ['apmacro.multipliers'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make AD feel like a real-world graph, not just notation.',
      script:
        "Aggregate demand answers a simple question: at any given price level, how much real GDP do all buyers in the economy want to buy? When prices fall, more is bought — for three precise reasons we will unpack. The AD curve is the macro version of the demand curves you saw in micro, scaled up to the whole economy.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ad',
      kind: 'concept',
      goal: 'Cover AD definition, components, the three downward-slope reasons, and shift vs movement.',
      keyIdeas: [
        'AGGREGATE DEMAND (AD): the total quantity of real GDP that buyers want to purchase at each price level. Plotted with PRICE LEVEL on the y-axis and REAL GDP on the x-axis.',
        'AD COMPONENTS: same as GDP expenditure — AD = C + I + G + NX. Aggregate demand shifts when any of the components changes for a reason OTHER than the price level.',
        'AD SLOPES DOWNWARD for three reasons. (1) WEALTH EFFECT: as the price level rises, the real value of money holdings and fixed-value assets falls. People feel poorer; they consume less. C falls → AD falls.',
        '(2) INTEREST RATE EFFECT: as price level rises, households need to hold more money for transactions. Greater money demand → higher interest rates → lower I (firms borrow less for investment) → AD falls.',
        '(3) EXCHANGE RATE EFFECT: as domestic prices rise, domestic goods become more expensive relative to foreign goods. Exports fall and imports rise, so NX falls → AD falls.',
        'MOVEMENT ALONG AD: caused by a change in the PRICE LEVEL. We slide up or down the existing AD curve.',
        'SHIFT OF AD: caused by anything OTHER than the price level changing one of C/I/G/NX. AD moves to a new curve.',
        'AD SHIFTERS — examples that move AD RIGHTWARD (increase): consumer confidence rises (C up), real interest rates fall (I up), G increases (gov purchases up), tax cuts (C up), tax cuts on investment (I up), foreign incomes rise (NX up via more exports), domestic currency depreciates (NX up via cheaper exports), expansionary monetary policy (I up).',
        'AD SHIFTERS LEFTWARD (decrease): consumer confidence falls, real interest rates rise, G decreases, tax hikes, foreign recessions, domestic currency appreciates, contractionary monetary policy.',
      ],
      vocabulary: [
        { term: 'aggregate demand', definition: 'the relationship between the price level and the total quantity of real GDP demanded by all buyers.' },
        { term: 'wealth effect', definition: 'as price level rises, real wealth falls, consumption falls — one reason AD slopes downward.' },
      ],
      suggestedTools: ['aggregate_demand_supply'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-shift-vs-movement',
      kind: 'worked_example',
      problem:
        'For each event, identify whether it causes (i) a movement along the AD curve, or (ii) a shift of AD (specify direction). Justify each. Events: (a) The Fed lowers interest rates. (b) Aggregate price level rises sharply. (c) Foreign incomes rise, increasing demand for U.S. exports. (d) Consumer confidence drops sharply due to recession fears.',
      steps: [
        'STEP 1 — RULE: a change in the price level causes movement along AD; any other change causes a shift.',
        'STEP 2 — EVENT (a) "Fed lowers interest rates": this is a NON-PRICE-LEVEL change that increases I (firms borrow more cheaply). AD SHIFTS RIGHTWARD.',
        'STEP 3 — EVENT (b) "Aggregate price level rises sharply": this is a CHANGE IN PRICE LEVEL. MOVEMENT ALONG AD (upward and to the left, smaller real GDP demanded).',
        'STEP 4 — EVENT (c) "Foreign incomes rise": foreigners demand more U.S. exports → NX increases (a non-price-level change). AD SHIFTS RIGHTWARD.',
        'STEP 5 — EVENT (d) "Consumer confidence drops": households save more / spend less → C falls (non-price-level). AD SHIFTS LEFTWARD.',
        'STEP 6 — INTUITION. Three of four are SHIFTS; one is movement along. AP loves to test "which is which" — confusing the two is a top-3 point-loser on Unit 3 FRQs.',
      ],
      answer: '(a) Shift right. (b) Movement along. (c) Shift right. (d) Shift left.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-three-reasons',
      kind: 'try_yourself',
      problem:
        'State the THREE reasons aggregate demand slopes downward. For each, briefly explain the mechanism.',
      expectedAnswer:
        'WEALTH EFFECT: when price level rises, the real value of money and fixed-value assets falls. Households feel poorer and consume less; C falls, AD falls. INTEREST RATE EFFECT: higher price level requires holding more money for transactions; money demand rises, pushing up interest rates; higher rates reduce investment; I falls, AD falls. EXCHANGE RATE EFFECT: higher domestic prices make domestic goods relatively expensive; exports fall, imports rise; NX falls, AD falls. All three effects operate as the price level rises, all three reduce quantity of real GDP demanded — together they make AD slope downward.',
      responseFormat: 'free',
      hints: [
        'The three effects each connect the price level to a DIFFERENT GDP component (C, I, NX).',
        'Each chain runs: price level changes → some intermediate variable changes → that GDP component changes.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-shifters',
      kind: 'try_yourself',
      problem:
        'Classify each as a RIGHTWARD shift, LEFTWARD shift, or MOVEMENT ALONG AD. Briefly justify. (a) Government cuts personal income taxes. (b) Real GDP rises (price level held constant). (c) The dollar depreciates against the euro. (d) The aggregate price level rises 5%. (e) The Fed announces a contractionary policy raising interest rates.',
      expectedAnswer:
        '(a) RIGHTWARD shift. Tax cut increases disposable income → C rises (non-price-level change). (b) MOVEMENT ALONG (or actually neither — this is a question phrasing trap; "real GDP rises with price level constant" is just describing a quantity demanded, not a shift driver). Best to answer: this isn\'t itself a shifter; it would describe a movement along AD if caused by a price-level change. (c) RIGHTWARD shift. Cheaper dollar makes U.S. exports cheaper abroad and imports more expensive at home → NX rises. (d) MOVEMENT ALONG (specifically: upward-leftward — at higher prices, smaller quantity of real GDP demanded). (e) LEFTWARD shift. Higher rates suppress I → AD falls (non-price-level change).',
      responseFormat: 'free',
      hints: [
        'Was the trigger a CHANGE IN PRICE LEVEL (movement along) or something else (shift)?',
        'For shifts, identify which component (C, I, G, or NX) is affected.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-shift-magnitude',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Suppose the U.S. economy is currently at long-run equilibrium. Then two things happen simultaneously: (1) the Fed cuts interest rates AND (2) consumer confidence drops sharply. What is the net effect on AD? Explain why the answer is NOT clear without more information.',
      expectedAnswer:
        'BOTH events are AD-shifters but they push in OPPOSITE directions. The Fed cutting interest rates increases I (cheaper borrowing → more investment) — this RIGHTWARD shifts AD. The drop in consumer confidence reduces C (households save more, spend less) — this LEFTWARD shifts AD. The net effect depends on the RELATIVE MAGNITUDES of these two shocks. If the rate cut is large and confidence drop is small, AD might shift right on net. If the confidence drop is severe (deep recession fears) and the rate cut is small, AD might shift left on net. Without more information about the SIZES of the two shocks, we cannot determine the net direction. Strong answers explicitly identify both shifts, name the components affected (I and C), and articulate that opposing shocks require relative-magnitude comparison to predict the net.',
      responseFormat: 'frq',
      hints: [
        'Identify the direction of each individual shift.',
        'What about magnitude makes the net direction unclear?',
        'Which AD components are affected by each event?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-shift-vs-movement',
      kind: 'misconception_check',
      question:
        "A student says: 'When the Fed lowers interest rates, the price level falls and AD increases — both are visible on the AD-AS graph.' What is wrong with this statement?",
      commonErrors: [
        {
          answer: 'nothing — that sounds right',
          misconception: 'Conflating SHIFTS in AD with MOVEMENTS along AD.',
          correctsTo:
            'Two errors here: (1) The Fed cutting interest rates SHIFTS AD rightward (it is a non-price-level change in I). It does NOT cause a "fall in price level" by itself — equilibrium price might fall or rise depending on what happens to SRAS and on the shape of curves. (2) The phrase "AD increases" is fine for the SHIFT, but the student is also describing a MOVEMENT down the curve at the same time, conflating the two motions. The right description: the Fed\'s rate cut SHIFTS AD rightward; the new equilibrium emerges from where new AD intersects SRAS; equilibrium price and equilibrium real GDP both rise (assuming standard AD-AS shapes). AP frequently penalizes students who say "AD increased so the price fell" — that is a movement-along description applied to a shift event.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'AD = C + I + G + NX (same components as GDP expenditure approach).',
        'AD slopes DOWN for three reasons: WEALTH, INTEREST RATE, EXCHANGE RATE effects.',
        'Movement ALONG AD ← change in price level. SHIFT of AD ← anything else.',
        'Common AD shifters: confidence, interest rates, fiscal policy, foreign income, exchange rate.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.1',
    cedTitle: 'Aggregate Demand',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '11', note: 'OpenStax Macro AP — AD definition, three downward-slope reasons.' },
    ],
  },
};
