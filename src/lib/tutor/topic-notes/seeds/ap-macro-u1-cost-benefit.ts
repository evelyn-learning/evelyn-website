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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.cost-benefit.v1' }],
  theory: [
    { loId: 'apmacro.cost-benefit', content: `MARGINAL BENEFIT (MB): the ADDITIONAL benefit from doing ONE MORE of an action — one more unit produced, one more hour studied, one more bus stop built. MB typically DECREASES as you do more (diminishing returns: the most-valuable uses come first).` },
    { loId: 'apmacro.cost-benefit', content: `MARGINAL COST (MC): the additional cost of doing ONE MORE. Often INCREASING as you scale up (resources tighten), though sometimes constant.` },
    { loId: 'apmacro.cost-benefit', content: `OPTIMAL DECISION RULE: keep doing the action while $MB > MC$; STOP at the level where $MB = MC$. Past that point $MB < MC$ and each additional unit DESTROYS value.` },
    { loId: 'apmacro.cost-benefit', content: `WHY $MB = MC$ IS OPTIMAL: if $MB > MC$ at the current level, one more unit adds positive net value — you are leaving value on the table. If $MB < MC$, the last unit subtracted value — pull back. Only at $MB = MC$ does neither direction improve things.` },
    { loId: 'apmacro.cost-benefit', content: `THE MB = MC CONVENTION: when the last unit has $MB$ exactly equal to $MC$ (net zero), the convention is to DO that unit. AP tables are usually built so the answer lands on this unit.` },
    { loId: 'apmacro.cost-benefit', content: `TOTAL vs MARGINAL: total benefit is the SUM of all marginal benefits up to the current level. Total benefit can keep RISING even while marginal benefit FALLS. AP tests reading totals from a marginal table and vice versa — never confuse the running sum with the next slice.` },
    { loId: 'apmacro.cost-benefit', content: `SUNK COST: a cost already incurred that CANNOT be recovered. Sunk costs are IRRELEVANT to forward-looking decisions — whether to continue depends only on FUTURE marginal benefits vs FUTURE marginal costs from this point onward, never on what was already spent.` },
    { loId: 'apmacro.cost-benefit', content: `SUNK-COST FALLACY: "we already spent so much, we have to keep going." Wrong: the past spending is gone either way. Continuing to "recover" sunk money often makes losses WORSE. The right question: given where we are, does the marginal benefit of continuing exceed the marginal cost?` },
    { loId: 'apmacro.cost-benefit', content: `EXPLICIT vs IMPLICIT COST: explicit costs are out-of-pocket payments. IMPLICIT costs are opportunity costs of resources you already own (your time, your building, your saved money). A complete ECONOMIC cost-benefit analysis includes BOTH, even though accounting statements show only explicit costs.` },
    { loId: 'apmacro.cost-benefit', kind: 'definition', title: 'marginal benefit', content: `the additional benefit from one more unit of an activity.` },
    { loId: 'apmacro.cost-benefit', kind: 'definition', title: 'marginal cost', content: `the additional cost of one more unit of an activity.` },
    { loId: 'apmacro.cost-benefit', kind: 'definition', title: 'sunk cost', content: `a cost already incurred that cannot be recovered — irrelevant to forward-looking choices.` },
  ],
  methods: [
    {
      title: 'Find the optimal quantity from an MB / MC table',
      steps: [
        `STEP 1 — WRITE DOWN MC for each unit (often constant). The rule: do a unit while $MB > MC$; include the unit where $MB = MC$; stop before any unit with $MB < MC$.`,
        `STEP 2 — GO UNIT BY UNIT: compare that unit's MB to its MC and mark it "do" or "stop." MB falls as units accumulate, so once one unit fails the test, all later units fail too.`,
        `STEP 3 — OPTIMAL QUANTITY = the last "do" unit (the one where MB first equals MC, or the last unit with MB above MC).`,
        `STEP 4 — NET TOTAL BENEFIT at the optimum = sum of $(MB - MC)$ across all units done.`,
        `STEP 5 — VERIFY: one more unit would lower the net total (its $MB < MC$); one fewer would forgo a unit worth at least its cost.`,
      ],
      example: {
        problem: `A city adds bus stops at a constant marginal cost of five (thousand dollars) per stop. Marginal benefits by stop: eleven, nine, seven, five, three, one. How many stops should it build, and what is the net total benefit?`,
        solution: `Stops one through three have MB above MC (net six, four, two). Stop four has MB equal to MC (net zero — build by convention). Stop five has MB three below MC five — stop. Optimal = four stops; net total benefit = $\\,6 + 4 + 2 + 0 = 12$ (thousand dollars). The producer-side version is identical with MR in place of MB: a price-taking firm produces every unit with $MR \\ge MC$.`,
      },
      relatedLoIds: ['apmacro.cost-benefit'],
    },
    {
      title: 'Evaluate a continue-or-quit decision with sunk costs',
      steps: [
        `STEP 1 — LABEL what is SUNK (already spent, unrecoverable) and set it aside. It is identical across all remaining options, so it cannot distinguish them.`,
        `STEP 2 — COMPUTE the MARGINAL BENEFIT of continuing: the ADDITIONAL future revenue or value versus stopping now (not the total revenue).`,
        `STEP 3 — COMPUTE the MARGINAL COST of continuing: the additional future spending required.`,
        `STEP 4 — DECIDE: continue only if marginal benefit exceeds marginal cost. Note the overall project may still be a loss either way — the goal now is to minimize future losses, not to "recover" the sunk money.`,
      ],
      example: {
        problem: `A studio has spent eighty million dollars on a film expected to earn twenty million. Reshoots costing twenty-five million more would raise expected revenue to thirty-five million. The CEO says the studio must continue "to recover the eighty million." Evaluate.`,
        solution: `The eighty million is SUNK — gone regardless. Marginal benefit of reshoots = thirty-five minus twenty = fifteen million extra revenue. Marginal cost = twenty-five million. Since fifteen < twenty-five, reshooting loses ten million MORE. Decline the reshoots. The CEO commits the sunk-cost fallacy: the project loses money either way; reshooting makes the loss worse.`,
      },
      relatedLoIds: ['apmacro.cost-benefit'],
    },
  ],
  pointers: [
    { content: 'Rule: keep going while MB > MC; stop where MB = MC. The MB = MC unit is conventionally DONE.', kind: 'tip' },
    { content: 'Total benefit = running SUM of marginal benefits; it can rise while MB falls. Never conflate the two.', kind: 'tip' },
    { content: 'Sunk costs are irrelevant. Every continue-or-quit decision compares FUTURE MB vs FUTURE MC only.', kind: 'tip' },
    { content: '"We already spent X, so we must continue" = sunk-cost fallacy; continuing can deepen the loss.', kind: 'tip' },
    { content: 'Economic cost = explicit (out-of-pocket) + implicit (opportunity cost of owned resources).', kind: 'tip' },
  ],
};
