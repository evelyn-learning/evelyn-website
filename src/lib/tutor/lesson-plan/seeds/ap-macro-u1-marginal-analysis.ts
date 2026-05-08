/**
 * AP Macroeconomics — CED Unit 1.6: Marginal Analysis and Consumer Choice.
 *
 * Applies the marginal framework to the consumer side: marginal utility,
 * diminishing marginal utility, and the equimarginal (utility-maximizing)
 * principle. AP frequently tests this with a 2-good MU/price table —
 * the worked example is shaped to mirror that exam form.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U1_MARGINAL_ANALYSIS: LessonPlan = {
  id: 'evelyn.ap.macro.marginal-analysis-consumer.v1',
  title: 'Marginal Analysis and Consumer Choice',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.marginal-analysis-consumer',
      description:
        'Define marginal utility and diminishing marginal utility, apply the equimarginal principle (MU/P equal across goods) to find the consumer\'s utility-maximizing bundle, and distinguish total utility from marginal utility.',
      standard: 'AP-MACRO-1.6',
    },
  ],
  prerequisites: ['apmacro.cost-benefit'],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make diminishing marginal utility feel obvious from lived experience.',
      script:
        "Picture eating pizza when you're hungry. The first slice is amazing. The second is great. The third is good. By the seventh, you're forcing it down and would rather have a glass of water. The slices haven't changed — your enjoyment of each ADDITIONAL slice has fallen. That's diminishing marginal utility. It's so universal that economists turned it into one of the building blocks of consumer choice.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-utility',
      kind: 'concept',
      goal: 'Cover utility, marginal utility, diminishing MU, and the equimarginal optimization rule.',
      keyIdeas: [
        'UTILITY: a measure of satisfaction or benefit a consumer gets from consuming goods. Economists treat utility as ordinal (rankable) but use cardinal numbers (utils) for analysis purposes — the absolute numbers are illustrative; what matters is comparison.',
        'TOTAL UTILITY: cumulative satisfaction from all units consumed. MARGINAL UTILITY (MU): the ADDITIONAL utility from one more unit. Total utility is the running sum of marginal utilities.',
        'LAW OF DIMINISHING MARGINAL UTILITY: as you consume more of a good in a given period, MU eventually FALLS. The 5th slice of pizza yields less satisfaction than the 1st. This is one of the most reliable empirical regularities in economics.',
        'CONSUMER\'S PROBLEM: with a fixed budget and many goods, choose the bundle that maximizes TOTAL utility subject to the budget constraint. The challenge: how to compare goods at different prices.',
        'KEY INSIGHT — the right comparison is MU PER DOLLAR, not raw MU. A good with MU=20 at price $10 gives 2 utils per dollar. A good with MU=15 at price $5 gives 3 utils per dollar. The second good is the better marginal purchase even though its raw MU is lower.',
        'EQUIMARGINAL PRINCIPLE: at the consumer\'s optimum, MU per dollar is EQUAL across all goods consumed. MU_x / P_x = MU_y / P_y. If they\'re unequal, the consumer can rebalance — buying more of the higher MU/P good and less of the lower — and gain utility within the same budget.',
        'BUDGET CONSTRAINT BINDS: the optimum must also exhaust (or come close to exhausting) the budget. A consumer leaving money unspent could still buy more of the highest-MU/P good available. So both conditions: (a) MU/P equal across goods, AND (b) total spending = budget.',
      ],
      vocabulary: [
        { term: 'marginal utility (MU)', definition: 'the additional utility a consumer gets from one more unit of a good.' },
        { term: 'diminishing marginal utility', definition: 'the empirical regularity that MU falls as more of a good is consumed within a given period.' },
        { term: 'equimarginal principle', definition: 'utility maximization condition: MU/P is equal across all goods purchased.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-pizza-movies',
      kind: 'worked_example',
      problem:
        "Maya has $20 to spend on pizza ($4 per slice) and movies ($8 per ticket). MU schedule for pizza: 1st=40, 2nd=32, 3rd=24, 4th=16, 5th=8. MU schedule for movies: 1st=80, 2nd=56, 3rd=32. Find the utility-maximizing bundle.",
      steps: [
        'STEP 1 — COMPUTE MU PER DOLLAR (MU/P) for each unit. Pizza P=$4: 1st pizza MU/P = 40/4 = 10; 2nd = 32/4 = 8; 3rd = 24/4 = 6; 4th = 16/4 = 4; 5th = 8/4 = 2. Movies P=$8: 1st = 80/8 = 10; 2nd = 56/8 = 7; 3rd = 32/8 = 4.',
        'STEP 2 — ALLOCATE THE BUDGET ONE PURCHASE AT A TIME, picking the highest available MU/P each round and tracking remaining budget.',
        'ROUND 1: Pizza-1 (MU/P=10) and Movie-1 (MU/P=10) tie. Pick either; say Movie-1 ($8). Remaining: $12.',
        'ROUND 2: Pizza-1 (10) > Movie-2 (7). Buy Pizza-1 ($4). Remaining: $8.',
        'ROUND 3: Pizza-2 (8) > Movie-2 (7). Buy Pizza-2 ($4). Remaining: $4.',
        'ROUND 4: Pizza-3 (MU/P=6) vs Movie-2 (MU/P=7). Movie-2 is higher, but it costs $8 and Maya has only $4. She CANNOT buy Movie-2. The next-best affordable option: Pizza-3 at $4 (MU/P=6). Buy Pizza-3. Remaining: $0.',
        'STEP 3 — FINAL BUNDLE: 3 pizza + 1 movie. Total spent: 3×$4 + 1×$8 = $20. ✅ Budget exhausted.',
        'STEP 4 — TOTAL UTILITY: pizza 40+32+24 = 96; movie 80; total = 176 utils.',
        'STEP 5 — VERIFY EQUIMARGINAL: at the optimum, the marginal MU/P just BARELY purchased on each side should be roughly equal. Last pizza purchased had MU/P = 6 (Pizza-3). The next-affordable movie unit was Movie-2 with MU/P = 7 — but we couldn\'t afford it. The budget constraint binds, leaving us slightly off the strict equality. AP problems are usually constructed so equality is reachable; when budget binds asymmetrically, the rule is "spend it all on the highest-MU/P AVAILABLE choices."',
      ],
      answer: 'Optimal bundle: 3 pizza + 1 movie. Total utility = 176 utils.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-define',
      kind: 'try_yourself',
      problem:
        'In your own words, define marginal utility and diminishing marginal utility. Then explain why a consumer cares about MU and not just total utility.',
      expectedAnswer:
        'Marginal utility = the ADDITIONAL utility from one more unit of a good. Diminishing marginal utility = the regularity that MU falls as you consume more (the 5th slice yields less satisfaction than the 1st). Consumers care about MU because every spending decision is a MARGINAL decision: should I buy ONE MORE of this good, or one of that good? Total utility is the cumulative result of those marginal choices, but you cannot make the next decision wisely by looking at totals — you have to compare what THIS NEXT UNIT will add. MU is what makes the decision; total utility is the byproduct.',
      responseFormat: 'free',
      hints: ['Marginal = "what one more adds." Total = "running sum."', 'Why does the rule for choice involve marginal, not total?'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-optimum-check',
      kind: 'try_yourself',
      problem:
        "A consumer is currently buying 4 of Good A (price $2) and 2 of Good B (price $5). At her current bundle, MU_A = 6 and MU_B = 20. Is she at the utility-maximizing optimum? If not, what should she do (rebalance toward A or rebalance toward B)?",
      expectedAnswer:
        'Compute MU/P for each good. MU_A/P_A = 6/2 = 3. MU_B/P_B = 20/5 = 4. They are NOT equal — Good B yields more utility per dollar at the current bundle. She is NOT at the optimum. She should REBALANCE TOWARD B: buy more B and less A. As she does, MU_B will fall (diminishing) and MU_A will rise. She should keep rebalancing until MU_A/P_A ≈ MU_B/P_B and the budget is exhausted. (This question does not give a budget, so the exact final bundle isn\'t computable — the question only asks the direction of rebalancing.)',
      responseFormat: 'free',
      hints: ['Compute MU/P for each good. Are they equal?', 'If they\'re unequal, the consumer should buy more of the higher-MU/P good.'],
      estimatedMinutes: 3,
    },
    {
      id: 'try-rebalance',
      kind: 'try_yourself',
      problem:
        'A consumer with $30 has the following MU schedules. Good X (P=$3): 1st=15, 2nd=12, 3rd=9, 4th=6, 5th=3. Good Y (P=$6): 1st=24, 2nd=18, 3rd=12, 4th=6. Find the utility-maximizing bundle.',
      expectedAnswer:
        'MU/P for X: 5, 4, 3, 2, 1. MU/P for Y: 4, 3, 2, 1. Allocate one purchase at a time, highest MU/P first.\n• X-1 (5) → buy. Remaining: $27.\n• X-2 (4) tied with Y-1 (4). Buy Y-1. Remaining: $21.\n• X-2 (4) > Y-2 (3). Buy X-2. Remaining: $18.\n• X-3 (3) tied with Y-2 (3). Buy Y-2. Remaining: $12.\n• X-3 (3) > Y-3 (2). Buy X-3. Remaining: $9.\n• X-4 (2) tied with Y-3 (2). Buy Y-3. Remaining: $3.\n• X-4 (2) > Y-4 (1). Buy X-4. Remaining: $0. ✅\nFinal bundle: 4 X + 3 Y. Total spent = 4×$3 + 3×$6 = $12 + $18 = $30. ✅\nTotal utility: X: 15+12+9+6 = 42; Y: 24+18+12 = 54; total = 96.\nVerify equimarginal: last MU/P bought on X = 2 (X-4). Last MU/P bought on Y = 2 (Y-3). Equal. ✅',
      responseFormat: 'numeric',
      hints: [
        'Compute MU/P for every unit of each good first.',
        'Allocate one purchase per round, picking the highest available MU/P.',
        'At the optimum, the LAST units bought of each good should have approximately equal MU/P.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-equimarginal-why',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Explain WHY the equimarginal condition (MU/P equal across goods) yields the highest total utility within a given budget. What goes wrong if MU/P is unequal?',
      expectedAnswer:
        'If MU/P is unequal across two goods, the consumer can REALLOCATE one dollar from the lower-MU/P good to the higher-MU/P good and gain utility on net. Specifically: removing one dollar of spending from the low-MU/P good (say MU/P=3) loses 3 utils. Adding one dollar of spending to the high-MU/P good (say MU/P=5) gains 5 utils. Net gain: +2 utils, with no change in total spending. This kind of reallocation is always available WHENEVER MU/P differs across goods. Only when MU/P is equal across all goods is no further beneficial reallocation possible — at that point, the bundle is utility-maximizing for the budget. Strong answers describe the trade-by-trade reasoning explicitly: "I can move a dollar from Good A to Good B and gain utility, so I should — and I should keep moving dollars until the trade no longer helps."',
      responseFormat: 'frq',
      hints: [
        'Suppose MU/P is unequal — what reallocation could the consumer make?',
        'What happens to total utility from that reallocation?',
        'When does no further reallocation help?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-total-marginal',
      kind: 'misconception_check',
      question:
        "A student says: 'When total utility is highest, marginal utility is also highest.' True or false?",
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Confusing total utility (running sum) with marginal utility (the next slice). Visually, students see "the highest point on the total utility curve" and assume marginal must also be high there.',
          correctsTo:
            'FALSE. At the level of consumption where TOTAL utility is at its MAXIMUM, MARGINAL utility is ZERO. Why? Total utility increases when MU > 0, peaks when MU = 0 (the next unit adds nothing), and falls when MU < 0 (the next unit actively hurts — think 12th slice of pizza making you feel sick). Visually, total-utility maximum corresponds to where the marginal-utility curve crosses the horizontal axis. AP frequently tests this: students who graph TU and MU on the same axes need to know that MU = 0 at TU\'s peak, and MU is at its MAXIMUM at the point where TU is RISING FASTEST (which is typically near the START of consumption, far before the TU peak).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Marginal utility = additional utility from one more unit. Total utility = running sum.',
        'Diminishing MU is universal — MU falls as you consume more of any good.',
        'Equimarginal principle: at the optimum, MU/P is EQUAL across all goods consumed AND the budget is exhausted.',
        'When MU/P is unequal, rebalance toward the higher-MU/P good until equality.',
        'TU is maximized where MU = 0, NOT where MU is highest.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.6',
    cedTitle: 'Marginal Analysis and Consumer Choice',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '6', note: 'OpenStax Consumer Choice — utility maximization with budget constraint.' },
    ],
  },
};
