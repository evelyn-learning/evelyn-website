/**
 * AP Macroeconomics — CED Unit 6.2: Exchange Rates.
 *
 * Definition, appreciation vs depreciation, fixed vs floating regimes.
 * Sets up the FX market mechanics in U6.3.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U6_EXCHANGE_RATES: LessonPlan = {
  id: 'evelyn.ap.macro.exchange-rates.v1',
  title: 'U6.2 Exchange Rates',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.exchange-rates',
      description:
        'Define the exchange rate, distinguish appreciation from depreciation, distinguish fixed from floating exchange-rate regimes, and identify trade-offs of each regime.',
      standard: 'AP-MACRO-6.2',
    },
  ],
  prerequisites: ['apmacro.balance-of-payments'],
  followUps: ['apmacro.fx-market'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make exchange rates feel like prices, not exotic numbers.',
      script:
        "An exchange rate is just a price — the price of one currency in terms of another. When the exchange rate \"moves,\" it means one currency has become more or less valuable relative to another. The vocabulary — appreciation, depreciation, fixed, floating — packages those movements precisely. Once the language is locked in, the AD-AS effects fall out naturally.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-exchange-rates',
      kind: 'concept',
      goal: 'Cover the definition, appreciation vs depreciation, fixed vs floating, and trade-offs.',
      keyIdeas: [
        'EXCHANGE RATE: the price of one currency in terms of another. E.g. 1 USD = 0.93 EUR means each U.S. dollar buys 0.93 euros. Equivalently, 1 EUR = 1.075 USD.',
        'TWO PERSPECTIVES on the same rate. Same exchange rate can be quoted in two reciprocal ways: USD per EUR or EUR per USD. AP problems may use either — read carefully.',
        'APPRECIATION: a currency BECOMES MORE VALUABLE relative to another. If 1 USD goes from 0.93 EUR to 1.00 EUR, the dollar APPRECIATED (and the euro DEPRECIATED). Exports become more expensive in foreign currency; imports become cheaper.',
        'DEPRECIATION: a currency BECOMES LESS VALUABLE. If 1 USD goes from 0.93 EUR to 0.85 EUR, the dollar depreciated. Exports cheaper for foreign buyers; imports more expensive at home.',
        'FLOATING (FLEXIBLE) EXCHANGE RATE: rate set by market forces of supply and demand for the currency. Most major economies use floating: U.S., Japan, Eurozone, UK, Canada. Rates vary minute-by-minute.',
        'FIXED (PEGGED) EXCHANGE RATE: government / central bank announces a fixed rate against another currency or basket. The central bank intervenes in FX markets to maintain the peg. Examples: Hong Kong dollar pegged to USD; many oil-producing countries peg to USD; gold-standard era featured fixed rates.',
        'MANAGED FLOAT: hybrid — government allows the rate to float but intervenes to smooth excessive volatility or move the rate toward desired levels. Most "floating" regimes have some managed-float element in practice.',
        'FLOATING ADVANTAGES: (1) Automatic adjustment to economic conditions — depreciation cushions a recession by boosting exports; appreciation cools an overheated economy. (2) No reserve requirements — central bank doesn\'t need to defend a peg. (3) Independent monetary policy — central bank can target inflation/UE without exchange-rate constraint.',
        'FLOATING DISADVANTAGES: (1) Volatility — rates can fluctuate sharply, making business planning harder for exporters/importers. (2) Speculative attacks — can produce overshooting or undershooting away from fundamentals.',
        'FIXED ADVANTAGES: (1) Predictability — businesses can plan with certainty. (2) Anchoring expectations — pegs to a stable currency (USD or EUR) can import that currency\'s monetary credibility. (3) Reduces exchange-rate risk for foreign trade and investment.',
        'FIXED DISADVANTAGES: (1) Loss of monetary independence — central bank must defend the peg, can\'t use rate adjustments for stabilization. (2) RESERVE REQUIREMENT — needs large foreign-currency reserves to defend the peg. (3) SPECULATIVE ATTACKS — if markets believe a peg will break, capital flight can force a devaluation. (4) Misalignment — pegged rate may diverge from fundamentals, leading to long-run imbalances.',
      ],
      vocabulary: [
        { term: 'exchange rate', definition: 'price of one currency in terms of another.' },
        { term: 'appreciation', definition: 'a currency becoming more valuable relative to another.' },
        { term: 'depreciation', definition: 'a currency becoming less valuable relative to another.' },
        { term: 'floating exchange rate', definition: 'an exchange rate set by market forces.' },
        { term: 'fixed exchange rate', definition: 'an exchange rate maintained by central-bank intervention at an announced level.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-appreciation-depreciation',
      kind: 'worked_example',
      problem:
        'In January, 1 USD = 80 INR. By June, 1 USD = 90 INR. (a) Which currency appreciated? Which depreciated? (b) For an Indian importer of U.S. goods, did imports become cheaper or more expensive? (c) For a U.S. exporter selling to India, did sales (in USD revenue terms) likely rise or fall, all else equal?',
      steps: [
        'STEP 1 — RATE INTERPRETATION. The number of INR per USD ROSE from 80 to 90. Each USD now BUYS MORE INR. The DOLLAR became more valuable relative to the rupee.',
        'STEP 2 — (a) USD APPRECIATED. INR DEPRECIATED. (When USD appreciates against INR, INR depreciates against USD by definition — they are reciprocal.)',
        'STEP 3 — (b) For an INDIAN IMPORTER buying U.S. goods: a $100 product previously cost 80 × $100 = 8,000 INR. Now it costs 90 × $100 = 9,000 INR. The same dollar good is more expensive in rupees. IMPORTS BECAME MORE EXPENSIVE for the Indian buyer.',
        'STEP 4 — (c) For a U.S. EXPORTER selling to India: previously 1 INR = 1/80 USD ≈ $0.0125. Now 1 INR = 1/90 USD ≈ $0.0111. To pay the same USD revenue, Indian buyers must pay MORE rupees — the U.S. good is more expensive in INR terms. Demand for the U.S. good likely FALLS in India. The exporter\'s USD revenue is likely to FALL (reduced quantity sold), unless demand is highly inelastic.',
        'STEP 5 — INTUITION. When YOUR currency appreciates: your exports get more expensive abroad (worse for you), your imports get cheaper at home (better for consumers, worse for domestic producers). When your currency depreciates: opposite. AP frequently tests this directional intuition.',
      ],
      answer: 'USD appreciated; INR depreciated. Indian imports of U.S. goods more expensive. U.S. exports to India face reduced quantity demanded.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-direction',
      kind: 'try_yourself',
      problem:
        'For each scenario, identify which currency appreciated and which depreciated. (a) Yesterday: 1 EUR = $1.10. Today: 1 EUR = $1.05. (b) Yesterday: 1 USD = 110 JPY. Today: 1 USD = 100 JPY. (c) Yesterday: 1 GBP = 1.25 USD. Today: 1 GBP = 1.30 USD.',
      expectedAnswer:
        '(a) USD APPRECIATED (used to take $1.10 to buy a euro; now only $1.05 — dollar is stronger). EUR depreciated. (b) USD DEPRECIATED (used to buy 110 yen; now only 100 — dollar is weaker). JPY appreciated. (c) GBP APPRECIATED (used to take 1.25 USD to buy a pound; now 1.30 — pound is stronger). USD depreciated.',
      responseFormat: 'free',
      hints: [
        'If you need MORE of currency X to buy Y, X depreciated relative to Y.',
        'Equivalently: appreciation = need LESS of your currency to buy other.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-fixed-vs-floating',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Country A uses a FLOATING exchange rate; Country B uses a fixed peg to the U.S. dollar. Both face an unexpected oil-price spike that hurts their economies. (a) How does Country A\'s exchange rate respond? What stabilization effect does this produce? (b) How does Country B\'s exchange rate respond? What constraint does this place on monetary policy? (c) Identify ONE situation where Country B\'s peg might break.',
      expectedAnswer:
        '(a) COUNTRY A (floating): the oil shock causes capital flight (foreigners and domestic residents seeking safer havens); demand for Country A\'s currency falls; supply of A\'s currency in FX markets rises. A\'s currency DEPRECIATES. The depreciation has a STABILIZATION effect: cheaper A-goods abroad → exports rise → AD partially recovers. Imports become more expensive, contributing to inflation but also encouraging domestic production. Floating rate provides automatic counter-cyclical buffer. (b) COUNTRY B (fixed peg): same downward pressure on B\'s currency, but B\'s central bank is committed to maintaining the peg. To do so, the central bank must SELL its USD reserves and BUY its own currency (countering the supply-and-demand pressure on the FX market) to keep the rate at the pegged level. CONSTRAINT: B can\'t use monetary policy to address the oil shock. Lowering rates to stimulate AD would weaken the currency, requiring even more reserve sales. The peg ties B\'s monetary policy hands — it must defend the rate first, address the recession second. (c) ONE situation where B\'s peg breaks: (i) RESERVES depleted — if B sells all its USD reserves in defense and the pressure continues, B can no longer defend; peg breaks (devaluation forced). (ii) SPECULATIVE ATTACK — large speculators bet against the peg, selling B\'s currency aggressively. If reserves run out, peg breaks. Examples: Thai baht 1997, British pound (Black Wednesday) 1992. (iii) FUNDAMENTAL MISALIGNMENT — if B\'s economy diverges substantially from peg-currency country (different inflation rates, different growth), the peg becomes harder to defend over time.',
      responseFormat: 'frq',
      hints: [
        'Floating: market adjusts; built-in stabilizer.',
        'Fixed: central bank must defend; loses monetary independence.',
        'Pegs break when reserves run out or speculators attack.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Exchange rate = price of one currency in terms of another.',
        'Appreciation: currency becomes MORE valuable. Depreciation: LESS valuable.',
        'Floating: market-determined. Fixed: central bank maintains a peg via FX intervention.',
        'Floating gives monetary independence + auto-stabilization but volatility.',
        'Fixed gives predictability but ties monetary policy hands; can break.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.2',
    cedTitle: 'Exchange Rates',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '21', note: 'OpenStax Macro AP — exchange rates, appreciation/depreciation, fixed vs floating.' },
    ],
  },
};
