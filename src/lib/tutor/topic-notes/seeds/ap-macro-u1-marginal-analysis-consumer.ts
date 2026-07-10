/**
 * AP Macroeconomics — Unit 1 CED 1.6: Marginal Analysis and Consumer Choice.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.marginal-analysis-consumer.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_MARGINAL_ANALYSIS_CONSUMER: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.marginal-analysis-consumer.v1',
  course: 'AP Macroeconomics',
  cedUnit: 1,
  cedTopic: '1.6',
  cedTitle: 'Marginal Analysis and Consumer Choice',
  planId: 'evelyn.ap.macro.marginal-analysis-consumer.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.marginal-analysis-consumer.v1' }],
  theory: [
    { loId: 'apmacro.marginal-analysis-consumer', content: `UTILITY: a measure of the satisfaction a consumer gets from consumption. Economists use "utils" as illustrative cardinal numbers, but what matters is COMPARISON — which option adds more satisfaction.` },
    { loId: 'apmacro.marginal-analysis-consumer', content: `TOTAL vs MARGINAL UTILITY: TOTAL utility = cumulative satisfaction from ALL units consumed. MARGINAL utility (MU) = the ADDITIONAL utility from ONE MORE unit. Total utility is the running sum of the marginal utilities.` },
    { loId: 'apmacro.marginal-analysis-consumer', content: `LAW OF DIMINISHING MARGINAL UTILITY: as you consume more of a good in a given period, MU eventually FALLS. The fifth slice of pizza satisfies less than the first. One of the most reliable regularities in economics.` },
    { loId: 'apmacro.marginal-analysis-consumer', content: `TU-MU GEOMETRY (heavily tested): total utility RISES while $MU > 0$, PEAKS where $MU = 0$, and FALLS where $MU < 0$ (the next unit actively hurts). MU is at its own MAXIMUM where TU is rising FASTEST — near the start of consumption, far before the TU peak. "TU highest ⇒ MU highest" is FALSE; at the TU peak, MU is ZERO.` },
    { loId: 'apmacro.marginal-analysis-consumer', content: `THE CONSUMER'S PROBLEM: with a fixed budget and multiple goods at different prices, choose the bundle that maximizes TOTAL utility subject to the budget constraint.` },
    { loId: 'apmacro.marginal-analysis-consumer', content: `KEY INSIGHT — compare MU PER DOLLAR ($MU/P$), not raw MU. A good with MU of twenty at a price of ten gives two utils per dollar; a good with MU of fifteen at a price of five gives three utils per dollar — the second is the better marginal purchase despite lower raw MU.` },
    { loId: 'apmacro.marginal-analysis-consumer', content: `EQUIMARGINAL PRINCIPLE: at the utility-maximizing bundle, MU per dollar is EQUAL across all goods consumed: $\\frac{MU_x}{P_x} = \\frac{MU_y}{P_y}$. If unequal, moving one dollar from the low-$MU/P$ good to the high-$MU/P$ good raises total utility at no extra spending.` },
    { loId: 'apmacro.marginal-analysis-consumer', content: `WHY EQUIMARGINAL WORKS: with unequal ratios (say three vs five utils per dollar), shifting one dollar loses three utils and gains five — net gain two utils, same budget. Such a beneficial reallocation exists WHENEVER ratios differ; only equality leaves no improving move.` },
    { loId: 'apmacro.marginal-analysis-consumer', content: `THE BUDGET MUST BE EXHAUSTED at the optimum: leftover money could still buy more of the highest-$MU/P$ affordable good. Full optimum = (a) $MU/P$ equal across goods AND (b) total spending = budget. When indivisible prices make strict equality unreachable, the rule becomes: spend the whole budget on the highest-$MU/P$ AVAILABLE (affordable) choices.` },
    { loId: 'apmacro.marginal-analysis-consumer', kind: 'definition', title: 'marginal utility (MU)', content: `the additional utility a consumer gets from one more unit of a good.` },
    { loId: 'apmacro.marginal-analysis-consumer', kind: 'definition', title: 'diminishing marginal utility', content: `the empirical regularity that MU falls as more of a good is consumed within a given period.` },
    { loId: 'apmacro.marginal-analysis-consumer', kind: 'definition', title: 'equimarginal principle', content: `utility-maximization condition: MU/P is equal across all goods purchased (with the budget exhausted).` },
  ],
  methods: [
    {
      title: 'Find the utility-maximizing bundle from a two-good MU table',
      steps: [
        `STEP 1 — COMPUTE $MU/P$ for EVERY unit of each good (divide each unit's MU by that good's price).`,
        `STEP 2 — ALLOCATE the budget ONE PURCHASE AT A TIME: each round, buy the unit with the highest $MU/P$ still available AND affordable; subtract its price from the remaining budget. Break ties either way.`,
        `STEP 3 — WATCH AFFORDABILITY near the end: a higher-$MU/P$ unit may cost more than the money left — skip to the best AFFORDABLE unit.`,
        `STEP 4 — STOP when the budget hits zero. Record the bundle and confirm total spending equals the budget.`,
        `STEP 5 — TOTAL UTILITY = sum of the MUs of all units purchased (raw MUs, not the ratios).`,
        `STEP 6 — VERIFY EQUIMARGINAL: the LAST unit bought of each good should have (approximately) equal $MU/P$; strict equality can fail when the budget binds asymmetrically — then "all spent on best-available" is the check.`,
      ],
      example: {
        problem: `Maya has twenty dollars. Pizza costs four dollars per slice with MU schedule forty, thirty-two, twenty-four, sixteen, eight. Movies cost eight dollars per ticket with MU schedule eighty, fifty-six, thirty-two. Find her utility-maximizing bundle and total utility.`,
        solution: `Pizza $MU/P$: ten, eight, six, four, two. Movies $MU/P$: ten, seven, four. Buy in order: movie one (ten), pizza one (ten), pizza two (eight); with four dollars left, movie two ($MU/P$ seven) is unaffordable, so buy pizza three (six). Bundle = three pizzas + one movie, spending exactly twenty dollars. Total utility = $\\,40+32+24+80 = 176$ utils.`,
      },
      relatedLoIds: ['apmacro.marginal-analysis-consumer'],
    },
    {
      title: 'Check whether a given bundle is optimal and pick the rebalancing direction',
      steps: [
        `STEP 1 — COMPUTE $MU/P$ for each good at the CURRENT bundle.`,
        `STEP 2 — COMPARE: equal ratios (with the budget spent) → already optimal. Unequal → not optimal.`,
        `STEP 3 — REBALANCE toward the HIGHER-$MU/P$ good: buy more of it, less of the other.`,
        `STEP 4 — EXPLAIN the convergence: as she buys more of the favored good its MU falls (diminishing MU), and the abandoned good's MU rises — continue until the ratios equalize with the budget exhausted.`,
      ],
      example: {
        problem: `A consumer buys four units of good A (price two dollars, current MU six) and two units of good B (price five dollars, current MU twenty). Is she optimizing? If not, which way should she rebalance?`,
        solution: `$MU_A/P_A = \\tfrac{6}{2} = 3$; $MU_B/P_B = \\tfrac{20}{5} = 4$. Unequal — B yields more utility per dollar, so she is NOT at the optimum. Rebalance TOWARD B (more B, less A) until the ratios equalize.`,
      },
      relatedLoIds: ['apmacro.marginal-analysis-consumer'],
    },
  ],
  pointers: [
    { content: 'Optimize with MU PER DOLLAR (MU/P), never raw MU — prices differ across goods.', kind: 'tip' },
    { content: 'Optimum = MU/P equal across goods AND budget fully spent. Check both conditions.', kind: 'tip' },
    { content: 'Unequal MU/P → shift spending toward the higher-MU/P good; diminishing MU restores equality.', kind: 'tip' },
    { content: 'At maximum TOTAL utility, MU = 0 — not maximum. MU peaks early, where TU climbs fastest.', kind: 'tip' },
    { content: 'In one-purchase-at-a-time allocation, always check the next pick is AFFORDABLE with the money left.', kind: 'tip' },
  ],
};
