/**
 * AP Macroeconomics — Unit 5 CED 5.3: Money Growth and Inflation.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.money-growth-inflation.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.money-growth-inflation.v1' }],
  theory: [
    { loId: 'apmacro.money-growth-inflation', kind: 'identity', title: 'equation of exchange', content: `$M \\times V = P \\times Q$. M = money supply; V = VELOCITY (average times each dollar is spent per year); P = price level; Q = real GDP. The right side $P \\times Q$ is NOMINAL GDP.` },
    { loId: 'apmacro.money-growth-inflation', content: `INTUITION: $M \\times V$ is total spending — every dollar spent V times per year. $P \\times Q$ is total nominal output — what those dollars buy. They must be equal by accounting identity.` },
    { loId: 'apmacro.money-growth-inflation', kind: 'formula', title: 'growth-rate version', content: `$\\%\\Delta M + \\%\\Delta V \\approx \\%\\Delta P + \\%\\Delta Q$: money growth plus velocity growth equals inflation plus real-GDP growth.` },
    { loId: 'apmacro.money-growth-inflation', content: `THE QUANTITY-THEORY ASSUMPTION: in the long run V is roughly CONSTANT (or slow and predictable), and Q grows at the long-run real growth rate set by LRAS — not by monetary policy. With $\\%\\Delta V \\approx 0$: $\\%\\Delta P \\approx \\%\\Delta M - \\%\\Delta Q$. INFLATION ≈ MONEY GROWTH MINUS REAL-GDP GROWTH.` },
    { loId: 'apmacro.money-growth-inflation', content: `WORKED ANCHORS: M growing eight percent with Q growing three → inflation about five percent. M and Q both at three → price stability (zero). M at one percent with Q at four → DEFLATION of about three percent (money too scarce; prices fall — undesirable: discourages spending, worsens debt burdens).` },
    { loId: 'apmacro.money-growth-inflation', content: `TARGETING LOGIC: for an inflation target, set $\\%\\Delta M = \\text{target} + \\%\\Delta Q$. A two percent target with two percent real growth calls for money growth around four percent.` },
    { loId: 'apmacro.money-growth-inflation', content: `FRIEDMAN'S DICTUM: "inflation is always and everywhere a monetary phenomenon" — in the LONG RUN, sustained inflation traces back to money growing faster than output. Hyperinflations always pair with explosive money creation (monthly money growth in the tens or hundreds of percent).` },
    { loId: 'apmacro.money-growth-inflation', content: `LONG-RUN NEUTRALITY: money growth can move real output in the short run (AD channel), but long-run output is set by LRAS. The only PERSISTENT effect of money growth is on the price level — the quantity theory is the arithmetic behind money neutrality.` },
    { loId: 'apmacro.money-growth-inflation', content: `WHEN THE VELOCITY ASSUMPTION BREAKS: V falls in financial crises (precautionary cash hoarding, banks hoarding reserves) and under deflation expectations (purchases delayed). CANONICAL CASE: after 2008, money aggregates grew rapidly while V fell — inflation stayed BELOW what the simple theory predicted for over a decade. Treat the quantity theory as a LONG-RUN ANCHOR, not a short-run forecaster.` },
    { loId: 'apmacro.money-growth-inflation', kind: 'definition', title: 'equation of exchange', content: `M × V = P × Q — identity linking money supply, velocity, price level, and real GDP.` },
    { loId: 'apmacro.money-growth-inflation', kind: 'definition', title: 'velocity of money (V)', content: `the average number of times each dollar is spent per year; V = (P × Q) / M.` },
    { loId: 'apmacro.money-growth-inflation', kind: 'definition', title: 'Quantity Theory of Money', content: `in the long run, sustained money-supply growth above real-GDP growth produces equivalent inflation.` },
  ],
  methods: [
    {
      title: 'Compute long-run inflation from money and output growth',
      steps: [
        `STEP 1 — WRITE the growth-rate identity: money growth + velocity growth ≈ inflation + real-GDP growth.`,
        `STEP 2 — APPLY the constant-velocity assumption (velocity growth ≈ zero) unless the problem says otherwise.`,
        `STEP 3 — SOLVE: inflation ≈ money growth − real-GDP growth. A negative answer is DEFLATION.`,
        `STEP 4 — For a target-rate question, invert: required money growth = inflation target + real-GDP growth.`,
        `STEP 5 — CAVEAT if asked: the prediction assumes stable velocity; a velocity fall (crisis, hoarding) makes actual inflation come in below the formula.`,
      ],
      example: {
        problem: `Country X's money supply grows seven percent per year, real GDP grows two percent, velocity constant. (a) Long-run inflation? (b) Money growth needed for a two percent inflation target? (c) Inflation if money instead grew twelve percent?`,
        solution: `(a) Inflation ≈ seven − two = five percent. (b) Required money growth = two + two = four percent. (c) Twelve − two = ten percent inflation — every point of money growth above real growth becomes inflation in the long run.`,
      },
      relatedLoIds: ['apmacro.money-growth-inflation'],
    },
  ],
  pointers: [
    { content: 'M × V = P × Q; growth form: %ΔM + %ΔV ≈ %ΔP + %ΔQ.', kind: 'tip' },
    { content: 'With V constant: inflation ≈ money growth − real-GDP growth. Negative = deflation.', kind: 'tip' },
    { content: 'To hit an inflation target: money growth = target + real growth.', kind: 'tip' },
    { content: 'Quantity theory is a LONG-RUN anchor — post-2008 velocity collapse broke its short-run forecast.', kind: 'tip' },
    { content: 'Money is neutral long-run: sustained money growth changes prices, not real output.', kind: 'tip' },
  ],
};
