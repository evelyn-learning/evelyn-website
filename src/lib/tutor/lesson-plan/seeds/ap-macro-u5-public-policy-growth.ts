/**
 * AP Macroeconomics — CED Unit 5.7: Public Policy and Economic Growth.
 *
 * Supply-side policies that shift LRAS: tax incentives for investment,
 * education, R&D, infrastructure, deregulation, immigration, openness
 * to trade. Closes Unit 5.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U5_PUBLIC_POLICY_GROWTH: LessonPlan = {
  id: 'evelyn.ap.macro.public-policy-growth.v1',
  title: 'U5.7 Public Policy and Economic Growth',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.public-policy-growth',
      description:
        'Identify supply-side policies that promote long-run economic growth (tax incentives for investment, education, R&D, infrastructure, deregulation, immigration, trade openness), apply the LRAS framework to predict their effects, and articulate trade-offs in policy choices.',
      standard: 'AP-MACRO-5.7',
    },
  ],
  prerequisites: ['apmacro.economic-growth'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame supply-side policies as the lever for long-run growth.',
      script:
        "Demand-side policies (fiscal stimulus, monetary easing) move the economy toward potential in the short run. Supply-side policies move the potential itself. They shift LRAS rightward, raising the long-run sustainable level of GDP. They tend to have slower effects, smaller political constituencies, but vastly larger long-run impact.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-supply-side',
      kind: 'concept',
      goal: 'Cover the menu of supply-side policies, their LRAS effects, and trade-offs.',
      keyIdeas: [
        'SUPPLY-SIDE POLICIES: government actions that increase productive CAPACITY of the economy. Operate through one of the four growth sources (capital, labor, human capital, technology). Shift LRAS RIGHT in the AD-AS framework.',
        'TAX INCENTIVES FOR INVESTMENT: lower taxes on capital gains, dividends, business profits; investment tax credits; accelerated depreciation. Mechanism: raises after-tax return on private investment → I increases → capital stock grows faster → LRAS right. Trade-off: reduces tax revenue (potentially worsening deficits unless offset elsewhere); benefits may concentrate in top income groups.',
        'EDUCATION INVESTMENT: K-12 funding, higher education access, vocational training, early childhood education. Mechanism: more skilled workforce → higher human capital → higher productivity → LRAS right. Trade-off: long lag (15-25 years from elementary education to working-age contribution); expensive; political contention over curricula and funding levels.',
        'R&D INVESTMENT: government funding of basic research, R&D tax credits, university research grants. Mechanism: more innovation → higher TFP → LRAS right. Trade-off: returns are HIGHLY uncertain (most R&D fails); spillovers difficult to capture privately, justifying public investment but politically contentious.',
        'INFRASTRUCTURE: roads, bridges, ports, airports, broadband, electrical grid, public transit. Mechanism: physical capital that supports private productivity (efficient transport, communications). Long-lived; benefits accrue over decades. Trade-off: capital-intensive, often debt-financed; risk of poor project selection or political distortions.',
        'DEREGULATION: removing or simplifying regulations that impose costs on production. Mechanism: lower business costs → SRAS right (immediate); also can reduce barriers to entry, fostering competition and innovation → LRAS right (longer term). Trade-off: some regulations exist for important reasons (safety, environment, fraud prevention); deregulation has heterogeneous effects depending on which regulations are eased.',
        'IMMIGRATION: allowing more workers, especially those with high skills or who fill labor shortages. Mechanism: more labor input → LRAS right; high-skilled immigration also raises human capital and TFP. Trade-off: distributional effects (impacts on native workers, especially in similar skill categories); politically contentious.',
        'TRADE OPENNESS: reducing tariffs and trade barriers; signing trade agreements. Mechanism: comparative advantage allows specialization; access to cheaper imports raises real incomes; competition spurs efficiency. Trade-off: distributional losses for industries facing import competition (covered in Unit 6); policy adjustments often needed to support displaced workers.',
        'NO POLICY IS PURE WIN: every supply-side policy has costs, beneficiaries, and losers. AP exam questions often ask students to (a) identify the LRAS-shifting mechanism and (b) articulate a trade-off or distributional concern.',
      ],
      vocabulary: [
        { term: 'supply-side policies', definition: 'government actions that shift LRAS rightward by improving productive capacity (capital, labor, human capital, technology).' },
      ],
      suggestedTools: ['aggregate_demand_supply'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-policy-trace',
      kind: 'worked_example',
      problem:
        'For each policy, trace the mechanism by which it would shift LRAS, and identify ONE trade-off. (a) Federal R&D funding for basic science increases by $50B per year. (b) Investment tax credit for business equipment is doubled. (c) Public education spending per student rises 25%.',
      steps: [
        'POLICY (a) "R&D funding +$50B/year". MECHANISM: more basic-science research → eventually translates to applied innovations and technology gains (often via private firms commercializing public research) → higher TFP over decades → LRAS RIGHT. TRADE-OFF: most R&D fails; specific projects may yield little; spillovers may capture in other countries; immediate cost is large with long-delayed and uncertain payoff. Also, requires credible peer-review process to avoid funding low-quality projects.',
        'POLICY (b) "Doubled investment tax credit". MECHANISM: lowers after-tax cost of business equipment investment → firms invest more → capital stock grows faster → LRAS RIGHT. Effect typically appears within 2-5 years (faster than R&D or education). TRADE-OFF: reduces tax revenue (worsens deficit unless offset); benefits accrue mostly to capital owners and businesses, not workers directly; some "investment" induced may be tax-driven rather than economically productive (firms making purchases they would have made anyway, or shifting timing).',
        'POLICY (c) "Education spending per student +25%". MECHANISM: better-educated workforce → higher human capital → higher productivity → LRAS RIGHT. TRADE-OFF: very long lag (15-25 years from K-12 increase to peak workforce contribution); costly per student; effects depend on quality of spending (more money doesn\'t automatically equal better outcomes); funding gains may be eroded by inequality of access between districts.',
        'COMPARISON. All three are supply-side policies. They differ in: SPEED (investment credit fastest, R&D and education slowest), CERTAINTY (investment credit most certain effect, R&D least), CONSTITUENCY (different beneficiary groups). A government balancing growth-promotion typically combines multiple policies rather than relying on one.',
      ],
      answer: 'All three shift LRAS right. Mechanisms: R&D → TFP; Investment credit → K; Education → H. Trade-offs: cost, lag, distribution.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-classify',
      kind: 'try_yourself',
      problem:
        'For each policy, identify which of the FOUR GROWTH SOURCES (physical capital, labor, human capital, technology) it primarily affects, and the direction of effect on LRAS.',
      expectedAnswer:
        '(Sample policies; AP problem typically gives 4-5.) (a) "Government doubles funding for university research grants": TECHNOLOGY (basic and applied research increases TFP). LRAS RIGHT. (b) "Federal infrastructure investment in highways and ports": PHYSICAL CAPITAL (and indirectly TFP via better connectivity). LRAS RIGHT. (c) "Comprehensive immigration reform allowing more skilled workers": LABOR (and HUMAN CAPITAL if the immigrants are highly skilled). LRAS RIGHT. (d) "Universal pre-K education funded federally": HUMAN CAPITAL (early-childhood education improves long-run skills). LRAS RIGHT (with long lag). (e) "Increase in income tax rates by 5 percentage points": LABOR / CAPITAL — could discourage work and investment. Effect is contested; standard supply-side critique says it shifts LRAS LEFT (or at least slows rightward shift). (f) "Free trade agreement reducing tariffs": TECHNOLOGY / capital allocation — better competitive efficiency. LRAS RIGHT.',
      responseFormat: 'free',
      hints: [
        'Identify which growth source each affects.',
        'Direction depends on whether the policy expands or contracts that source.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-trade-off',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Critics of supply-side tax cuts argue that "the policies don\'t pay for themselves" — meaning the increased GDP they generate doesn\'t produce enough new tax revenue to offset the lost revenue from the tax cuts. Evaluate this argument: (a) Identify the supply-side claim being criticized. (b) Identify what conditions would have to hold for tax cuts to "pay for themselves." (c) State the empirical track record on this question.',
      expectedAnswer:
        '(a) THE SUPPLY-SIDE CLAIM (Laffer Curve / supply-side reasoning): tax cuts boost economic activity (more work, more investment, more business creation), and the resulting GDP growth produces enough additional tax revenue to compensate for the reduced rates. Sometimes summarized as "tax cuts pay for themselves" or "higher rates produce LESS revenue at high levels." (b) FOR TAX CUTS TO PAY FOR THEMSELVES: the elasticity of taxable income with respect to tax rates would have to be very high — tax cuts must produce LARGE INCREASES in GDP and reported income, large enough that the percentage increase in the base × the new rate exceeds the original revenue. Specifically: ΔRevenue = (new rate × new base) − (old rate × old base) ≥ 0. This requires the base to grow proportionally MORE than rates fall. Conditions favoring this: starting tax rates very high (so deadweight losses are large); high responsiveness of work / investment / location decisions to tax rates; few offsetting effects. (c) EMPIRICAL TRACK RECORD: most economists, including the Tax Policy Center, the Joint Committee on Taxation, and the Congressional Budget Office, find that major U.S. tax cuts do NOT pay for themselves at typical U.S. tax rates. The 1981 Reagan cuts, the 2001 Bush cuts, and the 2017 TCJA all increased deficits significantly; supply-side response, while present, was insufficient to offset revenue losses. Some studies do find that very high marginal rates (above ~70%) may produce little revenue and could indeed yield more revenue if cut. But at the rates typical in modern advanced economies, "tax cuts pay for themselves" is empirically rare. Strong answers: identify the Laffer/supply-side reasoning, articulate what would have to be true for the claim to hold, cite empirical record / specific studies (CBO, JCT, real-world tax cuts).',
      responseFormat: 'frq',
      hints: [
        'Identify the supply-side claim about elasticity of taxable income.',
        'What conditions favor self-financing tax cuts?',
        'What does empirical evidence say?',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Supply-side policies shift LRAS RIGHT by raising one of the 4 growth sources.',
        'Major examples: tax incentives for investment, education, R&D, infrastructure, deregulation, immigration, trade openness.',
        'Each has trade-offs: cost, lag, distribution, uncertainty.',
        'Empirically, supply-side tax cuts at typical rates do NOT pay for themselves.',
        'Best policy: combine multiple supply-side policies; demand-side and supply-side complement.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.7',
    cedTitle: 'Public Policy and Economic Growth',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '20', note: 'OpenStax Macro AP — supply-side policies, growth-promotion menu.' },
    ],
  },
};
