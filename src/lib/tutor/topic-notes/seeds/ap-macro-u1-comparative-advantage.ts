/**
 * AP Macroeconomics — Unit 1 CED 1.4: Comparative Advantage and Gains from Trade.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.comparative-advantage.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_COMPARATIVE_ADVANTAGE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.comparative-advantage.v1',
  course: 'AP Macroeconomics',
  cedUnit: 1,
  cedTopic: '1.4',
  cedTitle: 'Comparative Advantage and Gains from Trade',
  planId: 'evelyn.ap.macro.comparative-advantage.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.comparative-advantage.v1' }],
  theory: [
    { loId: 'apmacro.comparative-advantage', content: `ABSOLUTE ADVANTAGE: a producer can make more of a good with the same resources (or the same amount with fewer resources) than another producer. Pure productivity comparison.` },
    { loId: 'apmacro.comparative-advantage', content: `COMPARATIVE ADVANTAGE: a producer has the LOWER OPPORTUNITY COST for a good. Opportunity cost = how much of OTHER goods you give up by producing one more unit of THIS good.` },
    { loId: 'apmacro.comparative-advantage', content: `CRITICAL: comparative advantage — not absolute — determines who SHOULD produce what for trade purposes. A country can lack absolute advantage in everything yet still have CA in something — and trade still benefits it.` },
    { loId: 'apmacro.comparative-advantage', content: `COMPUTING OPPORTUNITY COST FROM A PRODUCTION TABLE: if Country X can produce 4 grain or 2 cars per hour, then producing 1 car costs 2 grain (and 1 grain costs 0.5 cars). The two opportunity costs are reciprocals.` },
    { loId: 'apmacro.comparative-advantage', content: `CA is identified by COMPARING opportunity costs across producers. Whichever producer has the LOWER opportunity cost in a good has CA in that good. (Each producer must have CA in something — they cannot both have CA in the same good unless their opportunity costs are equal, in which case there is no CA.)` },
    { loId: 'apmacro.comparative-advantage', content: `TERMS OF TRADE: the rate at which one good exchanges for another. Mutually-beneficial trade requires terms of trade to fall BETWEEN the two opportunity costs. (If 1 car = 2 grain in Country X and 1 car = 1/3 grain in Country Y, both gain at any trade rate where 1/3 < (cars per grain) < 2.)` },
    { loId: 'apmacro.comparative-advantage', content: `GAINS FROM TRADE: each country specializes in the good of its CA, then trades. Total output of both goods rises. Each country can consume MORE of both goods than it could on its own. This is what "trade is positive-sum" means concretely.` },
    { loId: 'apmacro.comparative-advantage', content: `IMPORTANT NUANCE: CA-based gains do NOT mean trade is painless. Specific industries lose; specific workers face costly transitions. AP wants you to recognize the AGGREGATE gain plus the DISTRIBUTIONAL trade-offs.` },
    { loId: 'apmacro.comparative-advantage', kind: 'definition', title: 'absolute advantage', content: 'producing more of a good with the same resources than another producer.' },
    { loId: 'apmacro.comparative-advantage', kind: 'definition', title: 'comparative advantage', content: 'producing a good at a LOWER opportunity cost than another producer.' },
    { loId: 'apmacro.comparative-advantage', kind: 'definition', title: 'terms of trade', content: 'the rate at which one good exchanges for another in a trade.' },
  ],
  methods: [
    {
      title: 'Worked us japan',
      steps: [
        `STEP 1 — ABSOLUTE ADVANTAGE: who can produce more of each good per hour? Grain: US (4) > Japan (1) → US has AA in grain. Cars: Japan (3) > US (2) → Japan has AA in cars.`,
        `STEP 2 — OPPORTUNITY COST FOR THE US. The US can make either 4 grain OR 2 cars in an hour, so 1 hour's worth of cars (2) costs 1 hour's worth of grain (4). Therefore: 1 car costs 4/2 = 2 grain. Reciprocal: 1 grain costs 2/4 = 0.5 cars.`,
        `STEP 3 — OPPORTUNITY COST FOR JAPAN. Japan can make 1 grain OR 3 cars per hour. 1 car costs 1/3 grain. 1 grain costs 3 cars.`,
        `STEP 4 — COMPARATIVE ADVANTAGE: compare opportunity costs of each good. Cars: US gives up 2 grain per car, Japan gives up only 1/3 grain per car. Japan has lower OC in cars → Japan has CA in cars. Grain: US gives up 0.5 cars per grain, Japan gives up 3 cars per grain. US has lower OC in grain → US has CA in grain.`,
        `STEP 5 — TERMS OF TRADE RANGE. For mutually-beneficial trade in cars-for-grain: the trade rate must be BETTER than the US producing cars itself (US would self-pay 2 grain per car) AND BETTER than Japan producing grain itself (Japan would self-pay 3 cars per grain, equivalent to 1/3 grain per car). So 1 car must trade for somewhere BETWEEN 1/3 grain and 2 grain.`,
        `STEP 6 — INTERPRET: even though Japan has AA in cars and US in grain, BOTH countries also have a clearly-defined CA. They specialize: US makes grain, Japan makes cars. Trade at any rate inside (1/3, 2) leaves both countries consuming more of both than autarky would allow.`,
      ],
      example: { problem: `In one hour: the US can produce 4 units of grain OR 2 units of cars. Japan can produce 1 unit of grain OR 3 units of cars. (a) Identify absolute advantage in each good. (b) Compute opportunity cost of each good for each country. (c) Identify comparative advantage. (d) Determine the range of mutually-beneficial terms of trade.`, solution: `AA: US in grain, Japan in cars. CA: US in grain, Japan in cars. Terms of trade: 1 car must trade for between 1/3 and 2 units of grain for both to gain.` },
      relatedLoIds: ['apmacro.comparative-advantage'],
    },
  ],
  pointers: [
    { content: `Absolute advantage = more output per resource. Comparative advantage = lower OPPORTUNITY COST.`, kind: 'tip' },
    { content: 'COMPARATIVE advantage drives specialization and trade decisions, not absolute.', kind: 'tip' },
    { content: `Each producer has CA in one good (unless opportunity costs are identical — then no CA, no gains).`, kind: 'tip' },
    { content: 'Mutually-beneficial terms of trade lie BETWEEN the two opportunity costs.', kind: 'tip' },
    { content: `Gains from trade are aggregate-positive, but distributionally uneven — winners and losers are both real.`, kind: 'tip' },
  ],
};
