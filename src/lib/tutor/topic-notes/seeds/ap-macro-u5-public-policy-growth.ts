/**
 * AP Macroeconomics — Unit 5 CED 5.7: Public Policy and Economic Growth.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.public-policy-growth.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.public-policy-growth.v1' }],
  theory: [
    { loId: 'apmacro.public-policy-growth', content: `SUPPLY-SIDE POLICIES: government actions that increase productive CAPACITY of the economy. Operate through one of the four growth sources (capital, labor, human capital, technology). Shift LRAS RIGHT in the AD-AS framework.` },
    { loId: 'apmacro.public-policy-growth', content: `TAX INCENTIVES FOR INVESTMENT: lower taxes on capital gains, dividends, business profits; investment tax credits; accelerated depreciation. Mechanism: raises after-tax return on private investment → I increases → capital stock grows faster → LRAS right. Trade-off: reduces tax revenue (potentially worsening deficits unless offset elsewhere); benefits may concentrate in top income groups.` },
    { loId: 'apmacro.public-policy-growth', content: `EDUCATION INVESTMENT: K-12 funding, higher education access, vocational training, early childhood education. Mechanism: more skilled workforce → higher human capital → higher productivity → LRAS right. Trade-off: long lag (15-25 years from elementary education to working-age contribution); expensive; political contention over curricula and funding levels.` },
    { loId: 'apmacro.public-policy-growth', content: `R&D INVESTMENT: government funding of basic research, R&D tax credits, university research grants. Mechanism: more innovation → higher TFP → LRAS right. Trade-off: returns are HIGHLY uncertain (most R&D fails); spillovers difficult to capture privately, justifying public investment but politically contentious.` },
    { loId: 'apmacro.public-policy-growth', content: `INFRASTRUCTURE: roads, bridges, ports, airports, broadband, electrical grid, public transit. Mechanism: physical capital that supports private productivity (efficient transport, communications). Long-lived; benefits accrue over decades. Trade-off: capital-intensive, often debt-financed; risk of poor project selection or political distortions.` },
    { loId: 'apmacro.public-policy-growth', content: `DEREGULATION: removing or simplifying regulations that impose costs on production. Mechanism: lower business costs → SRAS right (immediate); also can reduce barriers to entry, fostering competition and innovation → LRAS right (longer term). Trade-off: some regulations exist for important reasons (safety, environment, fraud prevention); deregulation has heterogeneous effects depending on which regulations are eased.` },
    { loId: 'apmacro.public-policy-growth', content: `IMMIGRATION: allowing more workers, especially those with high skills or who fill labor shortages. Mechanism: more labor input → LRAS right; high-skilled immigration also raises human capital and TFP. Trade-off: distributional effects (impacts on native workers, especially in similar skill categories); politically contentious.` },
    { loId: 'apmacro.public-policy-growth', content: `TRADE OPENNESS: reducing tariffs and trade barriers; signing trade agreements. Mechanism: comparative advantage allows specialization; access to cheaper imports raises real incomes; competition spurs efficiency. Trade-off: distributional losses for industries facing import competition (covered in Unit 6); policy adjustments often needed to support displaced workers.` },
    { loId: 'apmacro.public-policy-growth', content: `NO POLICY IS PURE WIN: every supply-side policy has costs, beneficiaries, and losers. AP exam questions often ask students to (a) identify the LRAS-shifting mechanism and (b) articulate a trade-off or distributional concern.` },
    { loId: 'apmacro.public-policy-growth', kind: 'definition', title: 'supply-side policies', content: `government actions that shift LRAS rightward by improving productive capacity (capital, labor, human capital, technology).` },
  ],
  methods: [
    {
      title: 'Worked policy trace',
      steps: [
        `POLICY (a) "R&D funding +$50B/year". MECHANISM: more basic-science research → eventually translates to applied innovations and technology gains (often via private firms commercializing public research) → higher TFP over decades → LRAS RIGHT. TRADE-OFF: most R&D fails; specific projects may yield little; spillovers may capture in other countries; immediate cost is large with long-delayed and uncertain payoff. Also, requires credible peer-review process to avoid funding low-quality projects.`,
        `POLICY (b) "Doubled investment tax credit". MECHANISM: lowers after-tax cost of business equipment investment → firms invest more → capital stock grows faster → LRAS RIGHT. Effect typically appears within 2-5 years (faster than R&D or education). TRADE-OFF: reduces tax revenue (worsens deficit unless offset); benefits accrue mostly to capital owners and businesses, not workers directly; some "investment" induced may be tax-driven rather than economically productive (firms making purchases they would have made anyway, or shifting timing).`,
        `POLICY (c) "Education spending per student +25%". MECHANISM: better-educated workforce → higher human capital → higher productivity → LRAS RIGHT. TRADE-OFF: very long lag (15-25 years from K-12 increase to peak workforce contribution); costly per student; effects depend on quality of spending (more money doesn't automatically equal better outcomes); funding gains may be eroded by inequality of access between districts.`,
        `COMPARISON. All three are supply-side policies. They differ in: SPEED (investment credit fastest, R&D and education slowest), CERTAINTY (investment credit most certain effect, R&D least), CONSTITUENCY (different beneficiary groups). A government balancing growth-promotion typically combines multiple policies rather than relying on one.`,
      ],
      example: { problem: `For each policy, trace the mechanism by which it would shift LRAS, and identify ONE trade-off. (a) Federal R&D funding for basic science increases by $50B per year. (b) Investment tax credit for business equipment is doubled. (c) Public education spending per student rises 25%.`, solution: `All three shift LRAS right. Mechanisms: R&D → TFP; Investment credit → K; Education → H. Trade-offs: cost, lag, distribution.` },
      relatedLoIds: ['apmacro.public-policy-growth'],
    },
  ],
  pointers: [
    { content: 'Supply-side policies shift LRAS RIGHT by raising one of the 4 growth sources.', kind: 'tip' },
    { content: `Major examples: tax incentives for investment, education, R&D, infrastructure, deregulation, immigration, trade openness.`, kind: 'tip' },
    { content: 'Each has trade-offs: cost, lag, distribution, uncertainty.', kind: 'tip' },
    { content: 'Empirically, supply-side tax cuts at typical rates do NOT pay for themselves.', kind: 'tip' },
    { content: `Best policy: combine multiple supply-side policies; demand-side and supply-side complement.`, kind: 'tip' },
  ],
};
