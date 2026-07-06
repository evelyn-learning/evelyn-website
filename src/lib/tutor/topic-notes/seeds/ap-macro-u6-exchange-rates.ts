/**
 * AP Macroeconomics — Unit 6 CED 6.2: Exchange Rates.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.exchange-rates.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_EXCHANGE_RATES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.exchange-rates.v1',
  course: 'AP Macroeconomics',
  cedUnit: 6,
  cedTopic: '6.2',
  cedTitle: 'Exchange Rates',
  planId: 'evelyn.ap.macro.exchange-rates.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.exchange-rates.v1' }],
  theory: [
    { loId: 'apmacro.exchange-rates', content: `EXCHANGE RATE: the price of one currency in terms of another. E.g. 1 USD = 0.93 EUR means each U.S. dollar buys 0.93 euros. Equivalently, 1 EUR = 1.075 USD.` },
    { loId: 'apmacro.exchange-rates', content: `TWO PERSPECTIVES on the same rate. Same exchange rate can be quoted in two reciprocal ways: USD per EUR or EUR per USD. AP problems may use either — read carefully.` },
    { loId: 'apmacro.exchange-rates', content: `APPRECIATION: a currency BECOMES MORE VALUABLE relative to another. If 1 USD goes from 0.93 EUR to 1.00 EUR, the dollar APPRECIATED (and the euro DEPRECIATED). Exports become more expensive in foreign currency; imports become cheaper.` },
    { loId: 'apmacro.exchange-rates', content: `DEPRECIATION: a currency BECOMES LESS VALUABLE. If 1 USD goes from 0.93 EUR to 0.85 EUR, the dollar depreciated. Exports cheaper for foreign buyers; imports more expensive at home.` },
    { loId: 'apmacro.exchange-rates', content: `FLOATING (FLEXIBLE) EXCHANGE RATE: rate set by market forces of supply and demand for the currency. Most major economies use floating: U.S., Japan, Eurozone, UK, Canada. Rates vary minute-by-minute.` },
    { loId: 'apmacro.exchange-rates', content: `FIXED (PEGGED) EXCHANGE RATE: government / central bank announces a fixed rate against another currency or basket. The central bank intervenes in FX markets to maintain the peg. Examples: Hong Kong dollar pegged to USD; many oil-producing countries peg to USD; gold-standard era featured fixed rates.` },
    { loId: 'apmacro.exchange-rates', content: `MANAGED FLOAT: hybrid — government allows the rate to float but intervenes to smooth excessive volatility or move the rate toward desired levels. Most "floating" regimes have some managed-float element in practice.` },
    { loId: 'apmacro.exchange-rates', content: `FLOATING ADVANTAGES: (1) Automatic adjustment to economic conditions — depreciation cushions a recession by boosting exports; appreciation cools an overheated economy. (2) No reserve requirements — central bank doesn't need to defend a peg. (3) Independent monetary policy — central bank can target inflation/UE without exchange-rate constraint.` },
    { loId: 'apmacro.exchange-rates', content: `FLOATING DISADVANTAGES: (1) Volatility — rates can fluctuate sharply, making business planning harder for exporters/importers. (2) Speculative attacks — can produce overshooting or undershooting away from fundamentals.` },
    { loId: 'apmacro.exchange-rates', content: `FIXED ADVANTAGES: (1) Predictability — businesses can plan with certainty. (2) Anchoring expectations — pegs to a stable currency (USD or EUR) can import that currency's monetary credibility. (3) Reduces exchange-rate risk for foreign trade and investment.` },
    { loId: 'apmacro.exchange-rates', content: `FIXED DISADVANTAGES: (1) Loss of monetary independence — central bank must defend the peg, can't use rate adjustments for stabilization. (2) RESERVE REQUIREMENT — needs large foreign-currency reserves to defend the peg. (3) SPECULATIVE ATTACKS — if markets believe a peg will break, capital flight can force a devaluation. (4) Misalignment — pegged rate may diverge from fundamentals, leading to long-run imbalances.` },
    { loId: 'apmacro.exchange-rates', kind: 'definition', title: 'exchange rate', content: 'price of one currency in terms of another.' },
    { loId: 'apmacro.exchange-rates', kind: 'definition', title: 'appreciation', content: 'a currency becoming more valuable relative to another.' },
    { loId: 'apmacro.exchange-rates', kind: 'definition', title: 'depreciation', content: 'a currency becoming less valuable relative to another.' },
    { loId: 'apmacro.exchange-rates', kind: 'definition', title: 'floating exchange rate', content: 'an exchange rate set by market forces.' },
    { loId: 'apmacro.exchange-rates', kind: 'definition', title: 'fixed exchange rate', content: 'an exchange rate maintained by central-bank intervention at an announced level.' },
  ],
  methods: [
    {
      title: 'Worked appreciation depreciation',
      steps: [
        `STEP 1 — RATE INTERPRETATION. The number of INR per USD ROSE from 80 to 90. Each USD now BUYS MORE INR. The DOLLAR became more valuable relative to the rupee.`,
        `STEP 2 — (a) USD APPRECIATED. INR DEPRECIATED. (When USD appreciates against INR, INR depreciates against USD by definition — they are reciprocal.)`,
        `STEP 3 — (b) For an INDIAN IMPORTER buying U.S. goods: a $100 product previously cost 80 × $100 = 8,000 INR. Now it costs 90 × $100 = 9,000 INR. The same dollar good is more expensive in rupees. IMPORTS BECAME MORE EXPENSIVE for the Indian buyer.`,
        `STEP 4 — (c) For a U.S. EXPORTER selling to India: previously 1 INR = 1/80 USD ≈ $0.0125. Now 1 INR = 1/90 USD ≈ $0.0111. To pay the same USD revenue, Indian buyers must pay MORE rupees — the U.S. good is more expensive in INR terms. Demand for the U.S. good likely FALLS in India. The exporter's USD revenue is likely to FALL (reduced quantity sold), unless demand is highly inelastic.`,
        `STEP 5 — INTUITION. When YOUR currency appreciates: your exports get more expensive abroad (worse for you), your imports get cheaper at home (better for consumers, worse for domestic producers). When your currency depreciates: opposite. AP frequently tests this directional intuition.`,
      ],
      example: { problem: `In January, 1 USD = 80 INR. By June, 1 USD = 90 INR. (a) Which currency appreciated? Which depreciated? (b) For an Indian importer of U.S. goods, did imports become cheaper or more expensive? (c) For a U.S. exporter selling to India, did sales (in USD revenue terms) likely rise or fall, all else equal?`, solution: `USD appreciated; INR depreciated. Indian imports of U.S. goods more expensive. U.S. exports to India face reduced quantity demanded.` },
      relatedLoIds: ['apmacro.exchange-rates'],
    },
  ],
  pointers: [
    { content: 'Exchange rate = price of one currency in terms of another.', kind: 'tip' },
    { content: 'Appreciation: currency becomes MORE valuable. Depreciation: LESS valuable.', kind: 'tip' },
    { content: `Floating: market-determined. Fixed: central bank maintains a peg via FX intervention.`, kind: 'tip' },
    { content: 'Floating gives monetary independence + auto-stabilization but volatility.', kind: 'tip' },
    { content: 'Fixed gives predictability but ties monetary policy hands; can break.', kind: 'tip' },
  ],
};
