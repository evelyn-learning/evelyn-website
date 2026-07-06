/**
 * AP Macroeconomics — Unit 5 CED 5.6: Economic Growth.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.economic-growth.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_ECONOMIC_GROWTH: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.economic-growth.v1',
  course: 'AP Macroeconomics',
  cedUnit: 5,
  cedTopic: '5.6',
  cedTitle: 'Economic Growth',
  planId: 'evelyn.ap.macro.economic-growth.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.economic-growth.v1' }],
  theory: [
    { loId: 'apmacro.economic-growth', content: `LONG-RUN ECONOMIC GROWTH: sustained increase in real GDP per capita over decades. Equivalent to LRAS shifting RIGHT over time. The most important macro outcome over long horizons.` },
    { loId: 'apmacro.economic-growth', content: `FOUR SOURCES OF GROWTH: (1) PHYSICAL CAPITAL — machines, factories, equipment, infrastructure. More capital per worker → higher productivity. (2) LABOR — workforce size and participation. Population growth, immigration, increased labor-force participation all add labor inputs. (3) HUMAN CAPITAL — workers' skills, education, health. A more educated workforce produces more output per hour. (4) TECHNOLOGY — innovations that allow more output from the same inputs. The largest driver of long-run growth in advanced economies; growth without innovation eventually stalls (diminishing returns to capital alone).` },
    { loId: 'apmacro.economic-growth', content: `PRODUCTIVITY = output per labor hour. The single most important measure of an economy's productive efficiency. Differences in productivity explain MOST of the cross-country variation in GDP per capita.` },
    { loId: 'apmacro.economic-growth', content: `GROWTH ACCOUNTING. Economists decompose growth into contributions: %ΔY = α × %ΔK + β × %ΔL + %ΔTFP. K = capital, L = labor, TFP = total factor productivity (the residual after capital and labor are accounted for; reflects technology + organizational improvements).` },
    { loId: 'apmacro.economic-growth', content: `EMPIRICAL FINDING: in advanced economies, TFP (technology + efficiency) has accounted for ROUGHLY HALF of long-run growth historically. The other half is capital accumulation (with population growth contributing modestly).` },
    { loId: 'apmacro.economic-growth', content: `DIMINISHING RETURNS TO CAPITAL: adding more machines to a fixed workforce eventually yields smaller and smaller productivity gains. To sustain growth, an economy needs continuing technological innovation, not just more capital.` },
    { loId: 'apmacro.economic-growth', content: `CONVERGENCE THEORY: poorer countries should grow faster than richer ones IF they can adopt existing technology and accumulate capital. Strong empirical support among countries with stable institutions (post-war Japan, Korea, more recently China). Weak support among countries lacking institutional foundations — Africa's growth performance has been very uneven despite low starting GDP.` },
    { loId: 'apmacro.economic-growth', content: `INSTITUTIONS MATTER: rule of law, property rights, low corruption, functioning courts, stable political environment, sound monetary policy. Two countries with similar resources can have vastly different growth trajectories based on institutional quality. North vs South Korea is the textbook comparison.` },
    { loId: 'apmacro.economic-growth', kind: 'definition', title: 'productivity', content: 'output per labor hour; the most important measure of economic efficiency.' },
    { loId: 'apmacro.economic-growth', kind: 'definition', title: 'human capital', content: 'the skills, education, health, and experience embodied in workers.' },
    { loId: 'apmacro.economic-growth', kind: 'definition', title: 'total factor productivity (TFP)', content: `the part of growth not explained by capital or labor inputs; reflects technology and efficiency.` },
    { loId: 'apmacro.economic-growth', kind: 'definition', title: 'convergence', content: `the tendency of poorer countries to grow faster than richer ones, conditional on similar institutional quality.` },
  ],
  methods: [
    {
      title: 'Worked growth decomp',
      steps: [
        'STEP 1 — TOTAL GROWTH = 1.0% + 0.5% + 1.5% = 3.0% per year.',
        `STEP 2 — FRACTIONS. Capital: 1.0/3.0 = 33%. Labor: 0.5/3.0 = 17%. TFP: 1.5/3.0 = 50%.`,
        `STEP 3 — TFP contributed the most (50%), consistent with the empirical finding that technology and efficiency are the largest driver of long-run growth in modern economies.`,
        `STEP 4 — INTERPRETATION. Country A is a typical advanced economy: roughly half of growth from technology, a third from capital, a sixth from labor. Policies that improve technology adoption (R&D, education, openness to ideas) would have the largest growth multiplier here.`,
        `STEP 5 — CONTRAST. A developing economy in early-stage industrialization might see a higher fraction from capital accumulation (catch-up growth) and labor (population shift to formal sector) and a lower fraction from TFP. As the economy matures, the mix shifts toward TFP — convergence pattern.`,
      ],
      example: { problem: `Country A reports the following long-run growth components for the past 30 years: physical capital growth contributed 1.0% per year; labor force growth contributed 0.5% per year; technological progress (TFP) contributed 1.5% per year. (a) Compute the country's total annual growth rate. (b) Compute what fraction of growth is explained by capital, labor, and TFP. (c) Identify which source contributed most.`, solution: `(a) 3.0% growth/year. (b) Capital 33%, Labor 17%, TFP 50%. (c) TFP contributed most.` },
      relatedLoIds: ['apmacro.economic-growth'],
    },
  ],
  pointers: [
    { content: 'Four sources of growth: PHYSICAL CAPITAL, LABOR, HUMAN CAPITAL, TECHNOLOGY.', kind: 'tip' },
    { content: `Productivity (output / hour) is the single most important driver of cross-country GDP differences.`, kind: 'tip' },
    { content: `Growth accounting: %ΔY = α%ΔK + β%ΔL + %ΔTFP. TFP ≈ half of long-run growth in advanced economies.`, kind: 'tip' },
    { content: `Diminishing returns to capital: long-run growth requires technology (TFP), not just more K.`, kind: 'tip' },
    { content: 'Convergence: poor countries can catch up — but only with adequate institutions.', kind: 'tip' },
  ],
};
