/**
 * AP Macroeconomics — Unit 1 CED 1.5: Cost-Benefit Analysis.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.cost-benefit.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_COST_BENEFIT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.cost-benefit.v1',
  course: 'AP Macroeconomics',
  cedUnit: 1,
  cedTopic: '1.5',
  cedTitle: 'Cost-Benefit Analysis',
  planId: 'evelyn.ap.macro.cost-benefit.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.cost-benefit.v1' }],
  theory: [
    { loId: 'apmacro.cost-benefit', content: `MARGINAL BENEFIT (MB): the additional benefit gained from doing ONE MORE of an action — one more unit produced, one more hour studied, one more bus stop built. Usually DECREASING as you do more (diminishing returns).` },
    { loId: 'apmacro.cost-benefit', content: `MARGINAL COST (MC): the additional cost of doing ONE MORE. Often INCREASING as you scale up (resources tighten), though sometimes constant.` },
    { loId: 'apmacro.cost-benefit', content: `OPTIMAL DECISION RULE: keep doing the action while MB > MC. Stop at the point where MB = MC. Past that point, MB < MC and each additional unit DESTROYS value.` },
    { loId: 'apmacro.cost-benefit', content: `WHY MB = MC is optimal: if MB > MC at your current level, you are leaving value on the table — adding one more produces net positive value. If MB < MC, you are destroying value — pull back. The equilibrium is where neither moving up nor down improves things.` },
    { loId: 'apmacro.cost-benefit', content: `TOTAL vs MARGINAL: total benefit is the SUM of all marginal benefits up to your current level. Total benefit can keep rising even as marginal benefit falls — the area, not the next slice. AP often tests whether you can read totals from a marginal table or vice versa.` },
    { loId: 'apmacro.cost-benefit', content: `SUNK COST: a cost already incurred that CANNOT be recovered. Sunk costs are IRRELEVANT to forward-looking decisions. Whether you continue doing X depends on the FUTURE marginal benefits and costs from this point onward, not on what you already spent.` },
    { loId: 'apmacro.cost-benefit', content: `IMPLICIT vs EXPLICIT cost: explicit costs are out-of-pocket dollars. IMPLICIT costs are opportunity costs of resources you already own (your time, your building, your saved money). Both belong in a complete economic cost-benefit analysis even if only explicit ones show up in accounting.` },
    { loId: 'apmacro.cost-benefit', kind: 'definition', title: 'marginal benefit', content: 'the additional benefit from one more unit of an activity.' },
    { loId: 'apmacro.cost-benefit', kind: 'definition', title: 'marginal cost', content: 'the additional cost of one more unit of an activity.' },
    { loId: 'apmacro.cost-benefit', kind: 'definition', title: 'sunk cost', content: `a cost already incurred that cannot be recovered — irrelevant to forward-looking choices.` },
  ],
  methods: [
    {
      title: 'Worked bus stops',
      steps: [
        `STEP 1 — RECORD MC. MC is constant at $5 per stop. The decision rule: build a stop while MB > $5; stop building once MB drops to or below $5.`,
        `STEP 2 — STOP-BY-STOP CHECK. Stop 1: MB=$11 > MC=$5 → BUILD (net +$6). Stop 2: MB=$9 > MC=$5 → BUILD (net +$4). Stop 3: MB=$7 > MC=$5 → BUILD (net +$2). Stop 4: MB=$5 = MC=$5 → BUILD (net $0; conventionally we build at MB=MC since net is non-negative). Stop 5: MB=$3 < MC=$5 → STOP (would lose $2). Stop 6: MB=$1 < MC=$5 → STOP.`,
        `STEP 3 — OPTIMAL QUANTITY. Build 4 stops. Net total benefit = (11-5)+(9-5)+(7-5)+(5-5) = 6+4+2+0 = $12 thousand.`,
        `STEP 4 — VERIFY: building a 5th stop would reduce net benefit to $12 + ($3-$5) = $10. Building only 3 stops would yield $12 + 0 - 0 = ... actually, only 3 yields 6+4+2 = $12 too — but conventionally we treat MB=MC as "build" because there is no harm. Both 3 and 4 are common AP answers; the canonical convention is to build at MB=MC. Stick with 4.`,
        `STEP 5 — INTUITION. Each additional stop is a separate yes/no decision. The MB falls because each new stop serves a less-busy location. The constant MC tells us to keep building until "the next one isn't worth it." That moment is when MB hits MC.`,
      ],
      example: { problem: `A city is deciding how many new bus stops to build along a route. Each new stop has a marginal benefit (riders served, in dollar terms) that diminishes as more stops are added (the most-needed locations are picked first). The marginal cost is constant at $5 per stop (in thousands). MB schedule: stop 1 = $11, stop 2 = $9, stop 3 = $7, stop 4 = $5, stop 5 = $3, stop 6 = $1. How many stops should the city build?`, solution: 'Optimal: 4 bus stops. Net benefit at the optimum = $12 thousand.' },
      relatedLoIds: ['apmacro.cost-benefit'],
    },
  ],
  pointers: [
    { content: 'Optimal level of any activity: keep doing it while MB > MC; stop where MB = MC.', kind: 'tip' },
    { content: 'MB usually falls; MC often rises. They cross at the optimum.', kind: 'tip' },
    { content: `Total benefit = sum of marginal benefits. Don't confuse "total" with "marginal."`, kind: 'tip' },
    { content: `Sunk costs are IRRELEVANT to forward-looking decisions. Compare future MB vs future MC only.`, kind: 'tip' },
  ],
};
