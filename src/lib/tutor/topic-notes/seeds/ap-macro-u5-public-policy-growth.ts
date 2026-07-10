/**
 * AP Macroeconomics — Unit 5 CED 5.7: Public Policy and Economic Growth.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.public-policy-growth.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_PUBLIC_POLICY_GROWTH: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.public-policy-growth.v1',
  course: 'AP Macroeconomics',
  cedUnit: 5,
  cedTopic: '5.7',
  cedTitle: 'Public Policy and Economic Growth',
  planId: 'evelyn.ap.macro.public-policy-growth.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.public-policy-growth.v1' }],
  theory: [
    { loId: 'apmacro.public-policy-growth', content: `SUPPLY-SIDE POLICIES: government actions that raise the economy's productive CAPACITY, working through one of the four growth sources (capital, labor, human capital, technology) and shifting LRAS RIGHT. Demand-side policies move the economy TOWARD potential; supply-side policies move the potential ITSELF — slower to act, far larger long-run impact.` },
    { loId: 'apmacro.public-policy-growth', content: `TAX INCENTIVES FOR INVESTMENT (investment tax credits, lower capital-gains/business taxes, accelerated depreciation): raise the after-tax return on investment → I rises → capital stock grows faster → LRAS right. Relatively FAST (a few years). Trade-offs: lost revenue (worse deficits unless offset); gains concentrate among capital owners; some induced "investment" is tax-timing, not new productivity.` },
    { loId: 'apmacro.public-policy-growth', content: `EDUCATION INVESTMENT (K-12, higher-ed access, vocational training, early childhood): more skilled workforce → human capital up → productivity up → LRAS right. Trade-offs: VERY long lag (fifteen to twenty-five years to peak workforce effect); expensive; outcomes depend on spending quality, not just quantity.` },
    { loId: 'apmacro.public-policy-growth', content: `R&D INVESTMENT (basic-research funding, R&D tax credits, university grants): more innovation → TFP up → LRAS right. Trade-offs: highly UNCERTAIN returns (most projects fail); spillovers are hard to capture privately — which is precisely the market-failure case FOR public funding.` },
    { loId: 'apmacro.public-policy-growth', content: `INFRASTRUCTURE (roads, ports, broadband, grid, transit): public physical capital that raises private productivity; long-lived benefits. Trade-offs: capital-intensive and often debt-financed; project selection can be politically distorted. Dual effect: AD right now (G), LRAS right later.` },
    { loId: 'apmacro.public-policy-growth', content: `DEREGULATION: cutting compliance costs → SRAS right IMMEDIATELY; lowering entry barriers → competition and innovation → LRAS right over time. Trade-off: many regulations serve safety, environmental, and anti-fraud purposes — effects depend entirely on WHICH rules are eased.` },
    { loId: 'apmacro.public-policy-growth', content: `IMMIGRATION: more workers → labor input up → LRAS right; high-skilled immigration also raises human capital and TFP. Trade-offs: distributional effects on similar-skill native workers; politically contentious.` },
    { loId: 'apmacro.public-policy-growth', content: `TRADE OPENNESS (lower tariffs, trade agreements): specialization by comparative advantage, cheaper inputs, competitive discipline → efficiency and LRAS right. Trade-off: concentrated losses in import-competing industries (Unit 6); adjustment support for displaced workers is the standard complement.` },
    { loId: 'apmacro.public-policy-growth', content: `"TAX CUTS PAY FOR THEMSELVES" — the Laffer/supply-side claim: cuts spur enough extra GDP that revenue recovers. Requires a VERY high responsiveness of taxable income to rates. EMPIRICAL RECORD: at typical modern rates, major cuts (early nineteen-eighties, early two-thousands, 2017) did NOT self-finance — deficits grew; CBO/JCT analyses concur. Only from VERY high starting rates is self-financing plausible.` },
    { loId: 'apmacro.public-policy-growth', content: `NO POLICY IS A PURE WIN: every supply-side option carries cost, lag, uncertainty, and distributional consequences. AP's standard ask: (a) name the LRAS-shifting mechanism, AND (b) articulate one trade-off. Governments typically combine several policies rather than betting on one.` },
    { loId: 'apmacro.public-policy-growth', kind: 'definition', title: 'supply-side policies', content: `government actions that shift LRAS rightward by improving productive capacity (capital, labor, human capital, technology).` },
    { loId: 'apmacro.public-policy-growth', kind: 'definition', title: 'Laffer curve claim', content: `the supply-side proposition that cutting tax rates can raise total revenue via induced growth; empirically rare at typical modern rates.` },
  ],
  methods: [
    {
      title: 'Trace a supply-side policy: mechanism plus trade-off',
      steps: [
        `STEP 1 — MAP the policy to its growth source: investment incentives → capital; immigration → labor; education → human capital; R&D → technology; infrastructure → capital (+TFP); deregulation → costs/competition; trade → efficiency.`,
        `STEP 2 — CHAIN the mechanism to LRAS: policy → source expands → productivity/capacity up → LRAS RIGHT.`,
        `STEP 3 — TIMESCALE: investment credits act in a few years; R&D and education take a decade or more.`,
        `STEP 4 — NAME ONE TRADE-OFF: fiscal cost, lag, uncertainty, or distribution — AP expects it alongside the mechanism.`,
        `STEP 5 — Note any dual AD effect (infrastructure and other spending programs also shift AD right in the short run).`,
      ],
      example: {
        problem: `For each policy give the LRAS mechanism and one trade-off: (a) fifty billion dollars per year of new basic-science R&D funding; (b) doubling the investment tax credit; (c) raising per-student education spending by a quarter.`,
        solution: `(a) R&D → innovation → TFP up → LRAS right; trade-off: highly uncertain, long-delayed returns — most projects fail. (b) Cheaper after-tax equipment → I up → capital stock grows → LRAS right within a few years; trade-off: lost revenue and some purely tax-timed "investment." (c) Better-educated workforce → human capital → LRAS right; trade-off: fifteen-to-twenty-five-year lag and outcome depends on spending quality. All three shift LRAS right by different sources at different speeds.`,
      },
      relatedLoIds: ['apmacro.public-policy-growth'],
    },
  ],
  pointers: [
    { content: 'Supply-side menu: investment tax incentives, education, R&D, infrastructure, deregulation, immigration, trade openness — all LRAS right.', kind: 'tip' },
    { content: 'Always pair the mechanism with a trade-off (cost, lag, uncertainty, distribution) — AP asks for both.', kind: 'tip' },
    { content: 'Speed ranking: investment credits fastest; R&D and education slowest but often largest.', kind: 'tip' },
    { content: 'At typical modern rates, tax cuts do NOT pay for themselves — the empirical record is deficits.', kind: 'tip' },
    { content: 'Deregulation hits SRAS immediately and LRAS over time; which rules are cut determines the welfare effect.', kind: 'tip' },
  ],
};
