/**
 * AP Macroeconomics — CED Unit 5.2: Money Growth and Inflation.
 *
 * Quantity Theory of Money (MV = PQ) and the long-run link between
 * money supply growth and inflation. AP often tests "what would
 * happen if the money supply grows X% faster than real GDP?"
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U5_MONEY_GROWTH_INFLATION: LessonPlan = {
  id: 'evelyn.ap.macro.money-growth-inflation.v1',
  title: 'U5.2 Money Growth and Inflation',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.money-growth-inflation',
      description:
        'Apply the Quantity Theory of Money (MV = PQ) to compute long-run inflation from money-supply growth, real-GDP growth, and velocity assumptions; explain why monetary expansion above real-GDP growth produces inflation.',
      standard: 'AP-MACRO-5.2',
    },
  ],
  prerequisites: ['apmacro.phillips-curve'],
  followUps: ['apmacro.deficits-debt'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the quantity theory as a precise long-run prediction.',
      script:
        "Milton Friedman famously said \"inflation is always and everywhere a monetary phenomenon\" — meaning if you trace inflation back far enough, you'll find money growing faster than the goods and services it can buy. The Quantity Theory of Money makes this precise: M times V equals P times Q. From that one equation come some of the most-tested predictions in macroeconomics.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-quantity-theory',
      kind: 'concept',
      goal: 'Cover the equation of exchange, growth-rate version, velocity assumption, and policy implications.',
      keyIdeas: [
        'EQUATION OF EXCHANGE (the core identity): M × V = P × Q. M = money supply (e.g. M1 or M2). V = VELOCITY OF MONEY (the average number of times each dollar is spent per year). P = price level (e.g. GDP deflator). Q = real GDP. The product P × Q = nominal GDP.',
        'INTUITION. M × V is total spending — every dollar in the economy spent V times. P × Q is total nominal output — what those dollars buy. By accounting identity, the two must equal.',
        'GROWTH-RATE VERSION (taking the log differences): %ΔM + %ΔV ≈ %ΔP + %ΔQ. The growth rate of money plus the growth rate of velocity equals the growth rate of prices (inflation) plus the growth rate of real GDP.',
        'QUANTITY THEORY ASSUMPTION: in the long run, V is APPROXIMATELY CONSTANT (or grows slowly and predictably). Q grows at the long-run real-GDP growth rate (driven by LRAS shifts, NOT monetary policy).',
        'IMPLICATION: %ΔP ≈ %ΔM − %ΔQ (since %ΔV ≈ 0 by assumption). INFLATION ≈ MONEY GROWTH MINUS REAL GDP GROWTH.',
        'EXAMPLE: if M grows 8% per year and Q grows 3% per year, long-run inflation is approximately 5% per year. If M grows 3% per year and Q grows 3% per year, inflation is approximately 0% (price stability).',
        'WHY MONEY-NEUTRALITY HOLDS IN THE LONG RUN: monetary policy can shift AD in the short run (real effect on Y), but in the long run output is determined by LRAS (real factors). The only persistent effect of money growth is on the price level. This is the macro version of "money is neutral in the long run" (covered in U3.4).',
        'WHY VELOCITY ASSUMPTION SOMETIMES BREAKS: V can change over time with payment technology, financial innovation, and confidence. In the 1980s, deregulation and ATMs raised V. In 2008-2020, V FELL substantially (people held more cash relative to spending, and money supply expanded faster than nominal GDP). Modern economists view the Quantity Theory as a long-run anchor, not a precise short-run predictor.',
      ],
      vocabulary: [
        { term: 'equation of exchange', definition: 'M × V = P × Q. Identity linking money supply, velocity, price level, and real GDP.' },
        { term: 'velocity of money (V)', definition: 'the average number of times each dollar is spent per year; V = (P × Q) / M.' },
        { term: 'Quantity Theory of Money', definition: 'the proposition that in the long run, sustained money-supply growth above real-GDP growth produces equivalent inflation.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-quantity-theory',
      kind: 'worked_example',
      problem:
        "Country X has the following long-run conditions: money supply (M) grows 7% per year. Real GDP (Q) grows 2% per year. Velocity (V) is approximately constant. (a) Compute the long-run inflation rate. (b) If the central bank wants to achieve a 2% long-run inflation target, what money-supply growth rate should it target? (c) What would happen if the central bank instead grew M by 12% per year?",
      steps: [
        'STEP 1 — APPLY %ΔM + %ΔV ≈ %ΔP + %ΔQ. With %ΔV ≈ 0: %ΔP ≈ %ΔM − %ΔQ.',
        'STEP 2 — (a) %ΔP ≈ 7% − 2% = 5%. Long-run inflation ≈ 5% per year.',
        'STEP 3 — (b) For 2% inflation: %ΔM = %ΔP + %ΔQ = 2% + 2% = 4%. Central bank should target 4% money growth.',
        'STEP 4 — (c) If %ΔM = 12%: %ΔP ≈ 12% − 2% = 10% inflation. Money supply growing 10 pp above real-GDP growth produces ~10% annual inflation in the long run.',
        'STEP 5 — INTUITION. The long-run link is mechanical (under stable V): every additional percentage point of money growth above real-GDP growth becomes inflation. This is why central banks target money-growth rates compatible with their inflation targets, and why hyperinflations are always associated with explosive money creation (in extreme cases, M growing 100%+ per month produces hyperinflation).',
      ],
      answer: '(a) ~5% inflation. (b) M growth = 4%. (c) ~10% inflation.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-equation',
      kind: 'try_yourself',
      problem:
        'State the equation of exchange (M × V = P × Q) AND the growth-rate version. For the growth-rate version, what is the QUANTITY THEORY ASSUMPTION about velocity, and what does it imply for inflation?',
      expectedAnswer:
        'EQUATION OF EXCHANGE: M × V = P × Q. M = money supply, V = velocity (avg times each dollar spent per year), P = price level, Q = real GDP. P × Q = nominal GDP. GROWTH-RATE VERSION: %ΔM + %ΔV ≈ %ΔP + %ΔQ. QUANTITY THEORY ASSUMPTION: in the long run, V is approximately constant (or grows slowly and predictably). With %ΔV ≈ 0, the equation simplifies to %ΔP ≈ %ΔM − %ΔQ. INFLATION ≈ MONEY GROWTH MINUS REAL-GDP GROWTH. Implication: if a central bank wants long-run price stability (low inflation), it must keep money growth roughly equal to real-GDP growth. Money growing faster than real GDP produces inflation.',
      responseFormat: 'free',
      hints: [
        'Equation of exchange has 4 variables.',
        'Growth-rate version has 4 growth rates summing on each side.',
        'Quantity theory: assume V constant; isolate %ΔP.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-compute',
      kind: 'try_yourself',
      problem:
        'For each scenario, compute the long-run inflation rate (assuming V constant). (a) M grows 6% per year, Q grows 4% per year. (b) M grows 3% per year, Q grows 3% per year. (c) M grows 15% per year, Q grows 1% per year. (d) M grows 1% per year, Q grows 4% per year.',
      expectedAnswer:
        '(a) %ΔP ≈ 6% − 4% = 2%. Mild inflation, near typical central-bank target. (b) %ΔP ≈ 3% − 3% = 0%. Price stability (no inflation). (c) %ΔP ≈ 15% − 1% = 14%. High inflation; characteristic of countries with poorly-managed monetary policy. (d) %ΔP ≈ 1% − 4% = -3%. DEFLATION. Money supply growing slower than real GDP means each dollar must "do more work" — prices fall to clear the market. Note: deflation is generally undesirable; it discourages spending and worsens debt burdens.',
      responseFormat: 'numeric',
      hints: [
        'Inflation ≈ M growth − Q growth.',
        'Negative result means deflation.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-velocity-shocks',
      kind: 'try_yourself',
      problem:
        "AP-style synthesis. The Quantity Theory assumes velocity is approximately constant in the long run. (a) Identify ONE specific situation in which velocity might decline notably. (b) When velocity declines (V falls), what does this imply for the relationship between M growth and inflation? Be specific about whether the standard prediction holds.",
      expectedAnswer:
        '(a) ONE situation (any of the following): (i) FINANCIAL CRISIS / RECESSION — people hoard cash for precautionary reasons rather than spending it; banks hold large excess reserves. V falls. (ii) DEFLATION EXPECTATIONS — if people expect prices to fall, they delay purchases, reducing the rate of monetary turnover. V falls. (iii) PAYMENT TECHNOLOGY SHIFT in opposite direction (rare) — friction increases. (iv) SHIFT IN MONEY DEMAND — increased preference for holding money over assets. (b) When V falls, the simple Quantity Theory PREDICTION BREAKS DOWN: inflation can be LOWER than (M growth − Q growth) would predict, because rising money supply offsets falling velocity. CONCRETE EXAMPLE: post-2008, M2 grew rapidly but V fell substantially; inflation remained well below 2% for over a decade. The Quantity Theory predicted higher inflation than what actually occurred. This is why modern central banks treat the Quantity Theory as a LONG-RUN ANCHOR rather than a short-run predictor; over decades, V trends are roughly stable, but in any given few-year window, V shocks can dominate. Strong answers explicitly cite a real example (post-2008 is canonical) and articulate that V instability is the main reason the simple Quantity Theory often misfires in the short run.',
      responseFormat: 'frq',
      hints: [
        'V can fall in financial crises or with deflation expectations.',
        'When V falls, the simple equation breaks: inflation lower than predicted.',
        'Reference the post-2008 episode.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'M × V = P × Q. Growth: %ΔM + %ΔV ≈ %ΔP + %ΔQ.',
        'With V constant: inflation ≈ money growth − real-GDP growth.',
        'Quantity Theory is a LONG-RUN anchor; V changes can dominate short-run.',
        'Friedman: inflation is always a monetary phenomenon (in the long run).',
        'Money is neutral in the long run; only price level affected by money growth.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.2',
    cedTitle: 'Money Growth and Inflation',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '13', note: 'OpenStax Macro AP — Quantity Theory, equation of exchange.' },
    ],
  },
};
