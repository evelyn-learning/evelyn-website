/**
 * AP Macroeconomics — Unit 5 CED 5.6: Economic Growth.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.economic-growth.v1). Hand-edit freely after extraction;
 * bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.economic-growth.v1' }],
  theory: [
    { loId: 'apmacro.economic-growth', content: `LONG-RUN ECONOMIC GROWTH: a sustained increase in REAL GDP PER CAPITA over decades — equivalently, LRAS shifting RIGHT over time. Compounding makes small rate differences enormous: one percent versus three percent sustained for a century is the difference between about triple and about nineteen-fold enrichment.` },
    { loId: 'apmacro.economic-growth', content: `SOURCE 1 — PHYSICAL CAPITAL: machines, factories, equipment, infrastructure. More capital per worker raises output per worker. Built by investment; suppressed by long-run crowding out.` },
    { loId: 'apmacro.economic-growth', content: `SOURCE 2 — LABOR: workforce size and participation. Population growth, immigration, and higher labor-force participation add labor input. Bounded per capita — everyone has twenty-four hours.` },
    { loId: 'apmacro.economic-growth', content: `SOURCE 3 — HUMAN CAPITAL: workers' skills, education, training, and health. A more educated, healthier workforce produces more per hour.` },
    { loId: 'apmacro.economic-growth', content: `SOURCE 4 — TECHNOLOGY: innovations that yield more output from the SAME inputs. The largest long-run driver in advanced economies; because capital alone hits DIMINISHING RETURNS, sustained growth ultimately requires innovation.` },
    { loId: 'apmacro.economic-growth', content: `PRODUCTIVITY = output per labor hour — the single most important efficiency measure. GDP per capita ≈ productivity × hours per worker × workers per capita; the labor-input terms are BOUNDED, productivity is effectively UNBOUNDED. Productivity differences explain MOST cross-country income gaps — workers in the poorest countries often work LONGER hours yet produce far less per hour.` },
    { loId: 'apmacro.economic-growth', kind: 'formula', title: 'growth accounting', content: `$\\%\\Delta Y = \\alpha\\,\\%\\Delta K + \\beta\\,\\%\\Delta L + \\%\\Delta TFP$. TFP (total factor productivity) is the residual after capital and labor — technology plus organizational efficiency. Empirically TFP has driven roughly HALF of long-run growth in advanced economies.` },
    { loId: 'apmacro.economic-growth', content: `DIMINISHING RETURNS TO CAPITAL: piling more machines onto a fixed workforce yields ever-smaller gains. Early-stage developing economies get big catch-up gains from capital accumulation; mature economies must lean on TFP.` },
    { loId: 'apmacro.economic-growth', content: `CONVERGENCE THEORY: poorer countries CAN grow faster than rich ones — adopting existing technology, accumulating high-return capital, moving workers from low- to high-productivity sectors. CONDITIONAL on institutions: strong for post-war Japan, Korea, later China; weak where institutions fail (much of the uneven sub-Saharan record; Argentina's long relative decline).` },
    { loId: 'apmacro.economic-growth', content: `INSTITUTIONS MATTER: rule of law, property rights, low corruption, functioning courts, political stability, sound monetary policy. Similar resources, different institutions → wildly different trajectories — North vs South Korea is the textbook natural experiment.` },
    { loId: 'apmacro.economic-growth', kind: 'definition', title: 'productivity', content: `output per labor hour; the most important measure of economic efficiency.` },
    { loId: 'apmacro.economic-growth', kind: 'definition', title: 'human capital', content: `the skills, education, health, and experience embodied in workers.` },
    { loId: 'apmacro.economic-growth', kind: 'definition', title: 'total factor productivity (TFP)', content: `the part of growth not explained by capital or labor inputs; reflects technology and efficiency.` },
    { loId: 'apmacro.economic-growth', kind: 'definition', title: 'convergence', content: `the tendency of poorer countries to grow faster than richer ones, conditional on similar institutional quality.` },
  ],
  methods: [
    {
      title: 'Decompose a growth rate into its sources',
      steps: [
        `STEP 1 — TOTAL GROWTH = capital contribution + labor contribution + TFP contribution (the contributions are given or derived).`,
        `STEP 2 — SHARE of each source = its contribution / total growth.`,
        `STEP 3 — IDENTIFY the dominant source and benchmark it: advanced economies typically show TFP near half; early-stage developers show larger capital/labor shares (catch-up pattern).`,
        `STEP 4 — POLICY READ-OUT: the dominant source signals where policy leverage is greatest (TFP-heavy → R&D, education, openness).`,
      ],
      example: {
        problem: `Over thirty years, capital contributed one point, labor half a point, and TFP one and a half points to annual growth. Find total growth, each source's share, and the biggest contributor.`,
        solution: `Total = three percent per year. Shares: capital one-third, labor one-sixth, TFP one-half. TFP dominates — the typical advanced-economy pattern; technology-adoption and education policies carry the largest growth leverage here.`,
      },
      relatedLoIds: ['apmacro.economic-growth'],
    },
  ],
  pointers: [
    { content: 'Four growth sources: physical capital, labor, human capital, technology. Growth = LRAS marching right.', kind: 'tip' },
    { content: 'Productivity (output/hour) explains most cross-country income gaps — labor input is bounded, productivity is not.', kind: 'tip' },
    { content: 'Growth accounting: %ΔY = α%ΔK + β%ΔL + %ΔTFP; TFP ≈ half of advanced-economy growth.', kind: 'tip' },
    { content: 'Diminishing returns to capital → sustained growth ultimately requires technology, not just more machines.', kind: 'tip' },
    { content: 'Convergence is CONDITIONAL on institutions — Korea converged, institutionally weak economies did not.', kind: 'tip' },
  ],
};
