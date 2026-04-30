/**
 * AP Macroeconomics — Aggregate demand and aggregate supply.
 *
 * AD-AS model. Short-run vs long-run. How recessions and inflation
 * arise. Government and monetary intervention.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_MACRO_AD_AS: LessonPlan = {
  id: 'evelyn.ap.macro.ad-as.v1',
  title: 'Aggregate demand and aggregate supply',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'economics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.ad-as',
      description: 'Apply the AD-AS model to analyze short-run and long-run macroeconomic outcomes.',
      standard: 'AP-MACRO-3',
    },
  ],
  prerequisites: ['ncss.911.econ.gdp-inflation'],
  followUps: [],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'AD-AS as the macroeconomist\'s map.',
      script: 'Why do we get recessions? Why does inflation spike sometimes? Why do interest-rate hikes cool the economy? The AD-AS model is the tool macroeconomists use to think about all of these. One graph, four shifts, much insight.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-model',
      kind: 'concept',
      goal: 'AD + AS curves + shifts + short-run vs long-run.',
      keyIdeas: [
        'AGGREGATE DEMAND (AD): total demand for all goods and services. Downward sloping (price level vs real GDP).',
        'COMPONENTS of AD: AD = C + I + G + NX (consumption + investment + government spending + net exports).',
        'AD SHIFTS: changes in C (consumer confidence), I (interest rates, business expectations), G (fiscal policy), NX (exchange rates, foreign income).',
        'SHORT-RUN AGGREGATE SUPPLY (SRAS): upward sloping. Higher prices → firms produce more (in short run).',
        'LONG-RUN AGGREGATE SUPPLY (LRAS): VERTICAL line at potential GDP (Y_p). Long run = full employment of resources.',
        'SHIFTS:',
        '  AD right (more demand): expansionary fiscal policy (cut taxes, increase G), monetary policy (cut interest rates).',
        '  AD left (less demand): austerity, recession.',
        '  SRAS right: lower input costs, productivity gains.',
        '  SRAS left: input cost shock (oil spike), supply chain disruption.',
        '  LRAS right: more capital, labor, technology (long-run growth).',
        'EQUILIBRIUM: where AD intersects SRAS gives short-run output and price level.',
        'RECESSIONARY GAP: short-run equilibrium BELOW Y_p. Unemployment elevated.',
        'INFLATIONARY GAP: short-run ABOVE Y_p. Inflation pressure.',
        'POLICY response: fiscal (government spending/taxes) or monetary (Fed interest rates) to shift AD.',
      ],
      vocabulary: [
        { term: 'aggregate demand', definition: 'total demand for all goods and services in an economy.' },
        { term: 'aggregate supply', definition: 'total supply of all goods and services.' },
        { term: 'recessionary gap', definition: 'short-run output below potential GDP.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-recession',
      kind: 'worked_example',
      problem: 'A drop in consumer confidence leads to a recessionary gap. Show how monetary policy can close it.',
      steps: [
        'Consumer confidence DROPS → households spend less → C falls → AD shifts LEFT.',
        'New short-run equilibrium: lower output, lower prices. Output below Y_p (potential).',
        'GAP: recessionary. Unemployment rises.',
        'POLICY: Fed cuts interest rates → cheaper borrowing → I (investment) increases → AD shifts RIGHT.',
        'If well-calibrated, AD returns to original; output back at Y_p.',
        'Risk: if Fed overshoots, get inflation later.',
      ],
      answer: 'Fed cuts rates → I rises → AD shifts right → recessionary gap closes',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'An OIL PRICE SHOCK (input cost spike) hits the economy. Which curve shifts, which way?',
      expectedAnswer: 'SRAS shifts LEFT (cost-push inflation) — output falls, prices rise (stagflation)',
      responseFormat: 'free',
      hints: [
        'Higher input costs make production more expensive.',
        'Firms produce LESS at any given price.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fed-controls-economy',
      kind: 'misconception_check',
      question: 'Can the Fed (monetary policy) always control the economy?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating monetary policy as omnipotent.',
          correctsTo: 'No — Fed has real but limited power. Pulling interest rates down at the zero bound stops working (zero lower bound). Cost-push inflation (oil shock) hurts both output and prices — Fed faces a trade-off. Long-run growth depends on supply-side factors (productivity, labor force) the Fed can\'t directly affect.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'AD = C + I + G + NX. Downward sloping.',
        'SRAS upward; LRAS vertical at Y_p.',
        'AD shifts: fiscal/monetary policy, confidence, exchange rates.',
        'SRAS shifts: input costs, productivity.',
        'Recessionary gap < Y_p (use expansionary policy). Inflationary gap > Y_p (contractionary).',
        'Stagflation: SRAS shift left → output falls AND prices rise simultaneously.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'In 2020 COVID, both AD AND SRAS shifted. How did that complicate policy?',
      hint: 'AD fell (people staying home, less spending). SRAS fell (supply chain shutdowns). Recession + supply shock together. Massive fiscal AND monetary stimulus prevented depression — but later contributed to 2022 inflation as supply still constrained.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
