/**
 * AP Macroeconomics — Unit 5 CED 5.3: Money Growth and Inflation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.money-growth-inflation.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_MONEY_GROWTH_INFLATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.money-growth-inflation.v1',
  course: 'AP Macroeconomics',
  cedUnit: 5,
  cedTopic: '5.3',
  cedTitle: 'Money Growth and Inflation',
  planId: 'evelyn.ap.macro.money-growth-inflation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.money-growth-inflation.v1' }],
  theory: [
    { loId: 'apmacro.money-growth-inflation', content: `EQUATION OF EXCHANGE (the core identity): M × V = P × Q. M = money supply (e.g. M1 or M2). V = VELOCITY OF MONEY (the average number of times each dollar is spent per year). P = price level (e.g. GDP deflator). Q = real GDP. The product P × Q = nominal GDP.` },
    { loId: 'apmacro.money-growth-inflation', content: `INTUITION. M × V is total spending — every dollar in the economy spent V times. P × Q is total nominal output — what those dollars buy. By accounting identity, the two must equal.` },
    { loId: 'apmacro.money-growth-inflation', content: `GROWTH-RATE VERSION (taking the log differences): %ΔM + %ΔV ≈ %ΔP + %ΔQ. The growth rate of money plus the growth rate of velocity equals the growth rate of prices (inflation) plus the growth rate of real GDP.` },
    { loId: 'apmacro.money-growth-inflation', content: `QUANTITY THEORY ASSUMPTION: in the long run, V is APPROXIMATELY CONSTANT (or grows slowly and predictably). Q grows at the long-run real-GDP growth rate (driven by LRAS shifts, NOT monetary policy).` },
    { loId: 'apmacro.money-growth-inflation', content: `IMPLICATION: %ΔP ≈ %ΔM − %ΔQ (since %ΔV ≈ 0 by assumption). INFLATION ≈ MONEY GROWTH MINUS REAL GDP GROWTH.` },
    { loId: 'apmacro.money-growth-inflation', content: `EXAMPLE: if M grows 8% per year and Q grows 3% per year, long-run inflation is approximately 5% per year. If M grows 3% per year and Q grows 3% per year, inflation is approximately 0% (price stability).` },
    { loId: 'apmacro.money-growth-inflation', content: `WHY MONEY-NEUTRALITY HOLDS IN THE LONG RUN: monetary policy can shift AD in the short run (real effect on Y), but in the long run output is determined by LRAS (real factors). The only persistent effect of money growth is on the price level. This is the macro version of "money is neutral in the long run" (covered in U3.4).` },
    { loId: 'apmacro.money-growth-inflation', content: `WHY VELOCITY ASSUMPTION SOMETIMES BREAKS: V can change over time with payment technology, financial innovation, and confidence. In the 1980s, deregulation and ATMs raised V. In 2008-2020, V FELL substantially (people held more cash relative to spending, and money supply expanded faster than nominal GDP). Modern economists view the Quantity Theory as a long-run anchor, not a precise short-run predictor.` },
    { loId: 'apmacro.money-growth-inflation', kind: 'definition', title: 'equation of exchange', content: `M × V = P × Q. Identity linking money supply, velocity, price level, and real GDP.` },
    { loId: 'apmacro.money-growth-inflation', kind: 'definition', title: 'velocity of money (V)', content: 'the average number of times each dollar is spent per year; V = (P × Q) / M.' },
    { loId: 'apmacro.money-growth-inflation', kind: 'definition', title: 'Quantity Theory of Money', content: `the proposition that in the long run, sustained money-supply growth above real-GDP growth produces equivalent inflation.` },
  ],
  methods: [
    {
      title: 'Worked quantity theory',
      steps: [
        'STEP 1 — APPLY %ΔM + %ΔV ≈ %ΔP + %ΔQ. With %ΔV ≈ 0: %ΔP ≈ %ΔM − %ΔQ.',
        'STEP 2 — (a) %ΔP ≈ 7% − 2% = 5%. Long-run inflation ≈ 5% per year.',
        `STEP 3 — (b) For 2% inflation: %ΔM = %ΔP + %ΔQ = 2% + 2% = 4%. Central bank should target 4% money growth.`,
        `STEP 4 — (c) If %ΔM = 12%: %ΔP ≈ 12% − 2% = 10% inflation. Money supply growing 10 pp above real-GDP growth produces ~10% annual inflation in the long run.`,
        `STEP 5 — INTUITION. The long-run link is mechanical (under stable V): every additional percentage point of money growth above real-GDP growth becomes inflation. This is why central banks target money-growth rates compatible with their inflation targets, and why hyperinflations are always associated with explosive money creation (in extreme cases, M growing 100%+ per month produces hyperinflation).`,
      ],
      example: { problem: `Country X has the following long-run conditions: money supply (M) grows 7% per year. Real GDP (Q) grows 2% per year. Velocity (V) is approximately constant. (a) Compute the long-run inflation rate. (b) If the central bank wants to achieve a 2% long-run inflation target, what money-supply growth rate should it target? (c) What would happen if the central bank instead grew M by 12% per year?`, solution: '(a) ~5% inflation. (b) M growth = 4%. (c) ~10% inflation.' },
      relatedLoIds: ['apmacro.money-growth-inflation'],
    },
  ],
  pointers: [
    { content: 'M × V = P × Q. Growth: %ΔM + %ΔV ≈ %ΔP + %ΔQ.', kind: 'tip' },
    { content: 'With V constant: inflation ≈ money growth − real-GDP growth.', kind: 'tip' },
    { content: 'Quantity Theory is a LONG-RUN anchor; V changes can dominate short-run.', kind: 'tip' },
    { content: 'Friedman: inflation is always a monetary phenomenon (in the long run).', kind: 'tip' },
    { content: 'Money is neutral in the long run; only price level affected by money growth.', kind: 'tip' },
  ],
};
