/**
 * AP Macroeconomics — Unit 1 CED 1.4: Comparative Advantage and Gains from Trade.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.comparative-advantage.v1). Hand-edit freely after
 * extraction; bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.comparative-advantage.v1' }],
  theory: [
    { loId: 'apmacro.comparative-advantage', content: `ABSOLUTE ADVANTAGE (AA): a producer can make MORE of a good with the same resources (or the same amount with fewer resources) than another producer. A pure PRODUCTIVITY comparison.` },
    { loId: 'apmacro.comparative-advantage', content: `COMPARATIVE ADVANTAGE (CA): a producer has the LOWER OPPORTUNITY COST for a good — it gives up less of the other good per unit produced. CA — NOT absolute advantage — determines who should produce what for trade. A country can lack AA in everything and still have CA in something, and trade still benefits it.` },
    { loId: 'apmacro.comparative-advantage', content: `COMPUTING OPPORTUNITY COST FROM A PRODUCTION (OUTPUT) TABLE: if a country can produce four grain OR two cars per hour, one car costs $\\tfrac{4}{2} = 2$ grain, and one grain costs $\\tfrac{2}{4} = 0.5$ cars. The two opportunity costs within a country are RECIPROCALS of each other.` },
    { loId: 'apmacro.comparative-advantage', content: `IDENTIFYING CA: compare opportunity costs ACROSS producers, good by good. Whoever has the LOWER opportunity cost in a good has CA in that good. Each producer has CA in exactly one good — unless opportunity costs are IDENTICAL, in which case NO ONE has CA and there are no gains from trade.` },
    { loId: 'apmacro.comparative-advantage', content: `TERMS OF TRADE: the rate at which one good exchanges for another. Trade is MUTUALLY BENEFICIAL only when the terms of trade fall STRICTLY BETWEEN the two countries' opportunity costs. Each country must pay less through trade than it would pay by producing the good itself.` },
    { loId: 'apmacro.comparative-advantage', content: `GAINS FROM TRADE: each country specializes in its CA good, then trades. Total output of BOTH goods rises; each country can consume MORE of both goods than in autarky (self-sufficiency). Trade is POSITIVE-SUM, not zero-sum.` },
    { loId: 'apmacro.comparative-advantage', content: `THE LAWYER-SECRETARY LOGIC: the world's best lawyer may also be the fastest typist (AA in both), but her opportunity cost of typing — forgone legal work — is enormous. The secretary has CA in typing. Specialize where your opportunity cost is lowest and trade for the rest.` },
    { loId: 'apmacro.comparative-advantage', content: `TRADE DEFICIT ≠ "LOSING." Importing more than exporting can reflect strong domestic demand, attractive investment opportunities drawing foreign capital, or a strong currency — it is not by itself evidence a country loses from trade.` },
    { loId: 'apmacro.comparative-advantage', content: `NUANCE AP REWARDS: aggregate gains from trade are real, but so are DISTRIBUTIONAL costs — import-competing industries shrink and their workers face costly transitions. Strong answers state both the positive-sum aggregate logic AND the winners-and-losers distribution.` },
    { loId: 'apmacro.comparative-advantage', kind: 'definition', title: 'absolute advantage', content: `producing more of a good with the same resources than another producer.` },
    { loId: 'apmacro.comparative-advantage', kind: 'definition', title: 'comparative advantage', content: `producing a good at a LOWER opportunity cost than another producer.` },
    { loId: 'apmacro.comparative-advantage', kind: 'definition', title: 'terms of trade', content: `the rate at which one good exchanges for another in a trade.` },
  ],
  methods: [
    {
      title: 'Work a two-country production table: AA, opportunity costs, CA, terms of trade',
      steps: [
        `STEP 1 — ABSOLUTE ADVANTAGE: for each good, compare raw output per period. The bigger number has AA in that good.`,
        `STEP 2 — OPPORTUNITY COSTS, COUNTRY 1: one unit of good X costs (max Y output) / (max X output) units of Y; the cost of Y is the reciprocal.`,
        `STEP 3 — OPPORTUNITY COSTS, COUNTRY 2: same computation with the second country's numbers.`,
        `STEP 4 — COMPARATIVE ADVANTAGE: for each good, compare the two countries' opportunity costs. The LOWER cost holds CA in that good. Sanity check: each country should end up with CA in exactly one good (if costs are identical, no CA exists).`,
        `STEP 5 — TERMS-OF-TRADE RANGE: a trade of X-for-Y benefits both only if the price of X (in Y) lies STRICTLY BETWEEN the two countries' opportunity costs of X.`,
        `STEP 6 — CONCLUDE: each country specializes in its CA good; trading anywhere inside the range lets both consume more of both goods than autarky allows.`,
      ],
      example: {
        problem: `In one hour the US can produce four grain OR two cars; Japan can produce one grain OR three cars. Find absolute advantage, opportunity costs, comparative advantage, and the range of mutually beneficial terms of trade.`,
        solution: `AA: US in grain (four > one), Japan in cars (three > two). US costs: one car = 2 grain, one grain = 0.5 cars. Japan: one car = $\\tfrac{1}{3}$ grain, one grain = 3 cars. CA: Japan in cars ($\\tfrac{1}{3} < 2$ grain per car), US in grain ($\\,0.5 < 3$ cars per grain). Terms of trade: one car must exchange for between $\\tfrac{1}{3}$ and $\\,2$ grain — inside that range both countries beat their self-production cost.`,
      },
      relatedLoIds: ['apmacro.comparative-advantage'],
    },
  ],
  pointers: [
    { content: 'CA (lower opportunity cost) — not AA (higher productivity) — decides who should produce what for trade.', kind: 'tip' },
    { content: 'Output table: opportunity cost of X = (other good\'s max) / (this good\'s max). The two costs are reciprocals.', kind: 'tip' },
    { content: 'Mutually beneficial terms of trade lie STRICTLY BETWEEN the two opportunity costs.', kind: 'tip' },
    { content: 'Identical opportunity costs → no CA, no gains from trade, even if one side has AA in both goods.', kind: 'tip' },
    { content: 'One country can hold AA in BOTH goods, but never CA in both — check opportunity costs, not output.', kind: 'tip' },
    { content: 'Gains from trade are aggregate-positive but distributionally uneven — name both when evaluating trade claims.', kind: 'tip' },
  ],
};
