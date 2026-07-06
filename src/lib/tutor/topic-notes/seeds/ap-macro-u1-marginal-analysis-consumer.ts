/**
 * AP Macroeconomics — Unit 1 CED 1.6: Marginal Analysis and Consumer Choice.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.marginal-analysis-consumer.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.marginal-analysis-consumer.v1' }],
  theory: [
    { loId: 'apmacro.marginal-analysis-consumer', content: `UTILITY: a measure of satisfaction or benefit a consumer gets from consuming goods. Economists treat utility as ordinal (rankable) but use cardinal numbers (utils) for analysis purposes — the absolute numbers are illustrative; what matters is comparison.` },
    { loId: 'apmacro.marginal-analysis-consumer', content: `TOTAL UTILITY: cumulative satisfaction from all units consumed. MARGINAL UTILITY (MU): the ADDITIONAL utility from one more unit. Total utility is the running sum of marginal utilities.` },
    { loId: 'apmacro.marginal-analysis-consumer', content: `LAW OF DIMINISHING MARGINAL UTILITY: as you consume more of a good in a given period, MU eventually FALLS. The 5th slice of pizza yields less satisfaction than the 1st. This is one of the most reliable empirical regularities in economics.` },
    { loId: 'apmacro.marginal-analysis-consumer', content: `CONSUMER'S PROBLEM: with a fixed budget and many goods, choose the bundle that maximizes TOTAL utility subject to the budget constraint. The challenge: how to compare goods at different prices.` },
    { loId: 'apmacro.marginal-analysis-consumer', content: `KEY INSIGHT — the right comparison is MU PER DOLLAR, not raw MU. A good with MU=20 at price $10 gives 2 utils per dollar. A good with MU=15 at price $5 gives 3 utils per dollar. The second good is the better marginal purchase even though its raw MU is lower.` },
    { loId: 'apmacro.marginal-analysis-consumer', content: `EQUIMARGINAL PRINCIPLE: at the consumer's optimum, MU per dollar is EQUAL across all goods consumed. MU_x / P_x = MU_y / P_y. If they're unequal, the consumer can rebalance — buying more of the higher MU/P good and less of the lower — and gain utility within the same budget.` },
    { loId: 'apmacro.marginal-analysis-consumer', content: `BUDGET CONSTRAINT BINDS: the optimum must also exhaust (or come close to exhausting) the budget. A consumer leaving money unspent could still buy more of the highest-MU/P good available. So both conditions: (a) MU/P equal across goods, AND (b) total spending = budget.` },
    { loId: 'apmacro.marginal-analysis-consumer', kind: 'definition', title: 'marginal utility (MU)', content: 'the additional utility a consumer gets from one more unit of a good.' },
    { loId: 'apmacro.marginal-analysis-consumer', kind: 'definition', title: 'diminishing marginal utility', content: `the empirical regularity that MU falls as more of a good is consumed within a given period.` },
    { loId: 'apmacro.marginal-analysis-consumer', kind: 'definition', title: 'equimarginal principle', content: 'utility maximization condition: MU/P is equal across all goods purchased.' },
  ],
  methods: [
    {
      title: 'Worked pizza movies',
      steps: [
        `STEP 1 — COMPUTE MU PER DOLLAR (MU/P) for each unit. Pizza P=$4: 1st pizza MU/P = 40/4 = 10; 2nd = 32/4 = 8; 3rd = 24/4 = 6; 4th = 16/4 = 4; 5th = 8/4 = 2. Movies P=$8: 1st = 80/8 = 10; 2nd = 56/8 = 7; 3rd = 32/8 = 4.`,
        `STEP 2 — ALLOCATE THE BUDGET ONE PURCHASE AT A TIME, picking the highest available MU/P each round and tracking remaining budget.`,
        `ROUND 1: Pizza-1 (MU/P=10) and Movie-1 (MU/P=10) tie. Pick either; say Movie-1 ($8). Remaining: $12.`,
        'ROUND 2: Pizza-1 (10) > Movie-2 (7). Buy Pizza-1 ($4). Remaining: $8.',
        'ROUND 3: Pizza-2 (8) > Movie-2 (7). Buy Pizza-2 ($4). Remaining: $4.',
        `ROUND 4: Pizza-3 (MU/P=6) vs Movie-2 (MU/P=7). Movie-2 is higher, but it costs $8 and Maya has only $4. She CANNOT buy Movie-2. The next-best affordable option: Pizza-3 at $4 (MU/P=6). Buy Pizza-3. Remaining: $0.`,
        `STEP 3 — FINAL BUNDLE: 3 pizza + 1 movie. Total spent: 3×$4 + 1×$8 = $20. ✅ Budget exhausted.`,
        'STEP 4 — TOTAL UTILITY: pizza 40+32+24 = 96; movie 80; total = 176 utils.',
        `STEP 5 — VERIFY EQUIMARGINAL: at the optimum, the marginal MU/P just BARELY purchased on each side should be roughly equal. Last pizza purchased had MU/P = 6 (Pizza-3). The next-affordable movie unit was Movie-2 with MU/P = 7 — but we couldn't afford it. The budget constraint binds, leaving us slightly off the strict equality. AP problems are usually constructed so equality is reachable; when budget binds asymmetrically, the rule is "spend it all on the highest-MU/P AVAILABLE choices."`,
      ],
      example: { problem: `Maya has $20 to spend on pizza ($4 per slice) and movies ($8 per ticket). MU schedule for pizza: 1st=40, 2nd=32, 3rd=24, 4th=16, 5th=8. MU schedule for movies: 1st=80, 2nd=56, 3rd=32. Find the utility-maximizing bundle.`, solution: 'Optimal bundle: 3 pizza + 1 movie. Total utility = 176 utils.' },
      relatedLoIds: ['apmacro.marginal-analysis-consumer'],
    },
  ],
  pointers: [
    { content: `Marginal utility = additional utility from one more unit. Total utility = running sum.`, kind: 'tip' },
    { content: 'Diminishing MU is universal — MU falls as you consume more of any good.', kind: 'tip' },
    { content: `Equimarginal principle: at the optimum, MU/P is EQUAL across all goods consumed AND the budget is exhausted.`, kind: 'tip' },
    { content: 'When MU/P is unequal, rebalance toward the higher-MU/P good until equality.', kind: 'tip' },
    { content: 'TU is maximized where MU = 0, NOT where MU is highest.', kind: 'tip' },
  ],
};
