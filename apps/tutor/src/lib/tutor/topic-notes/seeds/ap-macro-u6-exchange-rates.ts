/**
 * AP Macroeconomics — Unit 6 CED 6.2: Exchange Rates.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.exchange-rates.v1). Hand-edit freely after extraction;
 * bump baselineVersion when you make material changes.
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
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.exchange-rates.v1' }],
  theory: [
    { loId: 'apmacro.exchange-rates', content: `EXCHANGE RATE: the PRICE of one currency in terms of another — nothing more exotic. The same rate can be quoted TWO reciprocal ways (dollars per euro OR euros per dollar); AP problems use either — read which way the quote runs before answering.` },
    { loId: 'apmacro.exchange-rates', content: `APPRECIATION: a currency becomes MORE valuable relative to another (one unit buys more of the other currency). DEPRECIATION: less valuable. They are strictly reciprocal — if the dollar appreciates against the rupee, the rupee has depreciated against the dollar.` },
    { loId: 'apmacro.exchange-rates', content: `READING DIRECTION FROM A QUOTE: if the number of rupees per dollar RISES (eighty → ninety), each dollar buys more rupees → the DOLLAR appreciated. If you need MORE of currency X to buy Y, X has depreciated against Y.` },
    { loId: 'apmacro.exchange-rates', content: `TRADE CONSEQUENCES OF APPRECIATION (your currency strengthens): your EXPORTS become more expensive in foreign currency (foreign demand falls); your IMPORTS become cheaper at home (good for consumers, tough on import-competing producers). DEPRECIATION is the mirror: exports cheaper abroad, imports pricier at home.` },
    { loId: 'apmacro.exchange-rates', content: `FLOATING (FLEXIBLE) REGIME: the rate is set by market supply and demand for the currency, varying continuously. Used by most major economies (US, Eurozone, Japan, UK, Canada).` },
    { loId: 'apmacro.exchange-rates', content: `FIXED (PEGGED) REGIME: the central bank announces a rate against another currency (or basket) and INTERVENES in FX markets — buying/selling its own currency using foreign reserves — to hold it. Examples: Hong Kong's dollar peg; many oil exporters pegging to the dollar. MANAGED FLOAT: hybrid — mostly market-set with intervention to damp volatility; most "floaters" do some of this.` },
    { loId: 'apmacro.exchange-rates', content: `FLOATING PROS: (1) automatic stabilization — a recession-hit currency depreciates, boosting exports; (2) no reserves needed to defend anything; (3) INDEPENDENT monetary policy. CONS: volatility complicates business planning; speculation can overshoot fundamentals.` },
    { loId: 'apmacro.exchange-rates', content: `FIXED PROS: predictability for trade and investment; importing the anchor currency's monetary credibility. CONS: (1) LOSS OF MONETARY INDEPENDENCE — the bank must defend the peg before all else; (2) requires LARGE foreign-currency reserves; (3) vulnerable to SPECULATIVE ATTACKS; (4) the pegged rate can drift from fundamentals, storing up imbalances.` },
    { loId: 'apmacro.exchange-rates', content: `HOW PEGS BREAK: reserves run out defending the rate; speculators attack a doubted peg (the British pound in 1992, the Thai baht in 1997); or persistent fundamental misalignment (different inflation/growth from the anchor country) makes the defense untenable — forcing devaluation.` },
    { loId: 'apmacro.exchange-rates', kind: 'definition', title: 'exchange rate', content: `the price of one currency in terms of another.` },
    { loId: 'apmacro.exchange-rates', kind: 'definition', title: 'appreciation', content: `a currency becoming more valuable relative to another.` },
    { loId: 'apmacro.exchange-rates', kind: 'definition', title: 'depreciation', content: `a currency becoming less valuable relative to another.` },
    { loId: 'apmacro.exchange-rates', kind: 'definition', title: 'floating exchange rate', content: `an exchange rate set by market forces.` },
    { loId: 'apmacro.exchange-rates', kind: 'definition', title: 'fixed exchange rate', content: `an exchange rate maintained by central-bank intervention at an announced level.` },
  ],
  methods: [
    {
      title: 'Read appreciation/depreciation off a quote change and trace trade effects',
      steps: [
        `STEP 1 — FIX the quote direction: which currency is being priced in which? (rupees per dollar vs dollars per euro).`,
        `STEP 2 — APPLY the rule: the currency a unit of which now buys MORE of the other has APPRECIATED; the other has depreciated (reciprocal).`,
        `STEP 3 — IMPORTER TEST: convert a fixed foreign-currency price at old and new rates — if the home-currency cost rose, imports got more expensive for that side.`,
        `STEP 4 — EXPORTER TEST: the appreciating country's goods now cost more in the other currency → quantity demanded abroad falls (unless demand is very inelastic).`,
      ],
      example: {
        problem: `In January one dollar bought eighty rupees; by June it buys ninety. Which currency appreciated? What happened to costs for an Indian importer of US goods, and to a US exporter selling to India?`,
        solution: `Rupees-per-dollar rose → the DOLLAR appreciated, the rupee depreciated. A hundred-dollar US good went from eight thousand to nine thousand rupees — Indian imports of US goods became MORE expensive. The US exporter faces falling Indian demand (goods pricier in rupees), so export quantity and likely dollar revenue fall.`,
      },
      relatedLoIds: ['apmacro.exchange-rates'],
    },
  ],
  pointers: [
    { content: 'Exchange rate = a price. Quotes are reciprocal — check which way the quote runs first.', kind: 'tip' },
    { content: 'Need MORE of X to buy Y → X depreciated. One unit of X buys more Y → X appreciated.', kind: 'tip' },
    { content: 'Appreciation: exports pricier abroad, imports cheaper at home. Depreciation: mirror.', kind: 'tip' },
    { content: 'Floating buys monetary independence and auto-stabilization at the cost of volatility.', kind: 'tip' },
    { content: 'Fixed buys predictability but ties monetary policy and needs reserves; pegs break via reserve exhaustion or speculative attack.', kind: 'tip' },
  ],
};
