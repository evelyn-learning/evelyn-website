/**
 * AP Macroeconomics — CED Unit 6.3: The Foreign Exchange Market.
 *
 * Supply and demand for currency, equilibrium exchange rate, sources of
 * S and D in cross-border transactions. Uses the new
 * foreign_exchange_market structured tool.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U6_FX_MARKET: LessonPlan = {
  id: 'evelyn.ap.macro.fx-market.v1',
  title: 'The Foreign Exchange Market',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.fx-market',
      description:
        'Construct the FX market diagram with downward-sloping demand and upward-sloping supply for a currency, identify the sources of S and D, and predict equilibrium-rate effects from changes in either curve.',
      standard: 'AP-MACRO-6.3',
    },
  ],
  prerequisites: ['apmacro.exchange-rates'],
  followUps: ['apmacro.fx-determinants'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the FX market feel like an ordinary supply-and-demand market.',
      script:
        "Foreign exchange isn't mystical. It's just a market: people SUPPLY their currency to buy other currencies; people DEMAND a currency by offering theirs in trade. The price that clears the market is the EXCHANGE RATE. Once you draw the standard supply-and-demand diagram with currency on the x-axis and exchange rate on the y-axis, every appreciation/depreciation question reduces to a shift analysis.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-fx-market',
      kind: 'concept',
      goal: 'Cover the FX-market diagram, sources of S and D, equilibrium dynamics.',
      keyIdeas: [
        'AXES (for the U.S. dollar example): y-axis = EXCHANGE RATE (price of USD in terms of another currency, e.g. EUR per USD). x-axis = QUANTITY OF USD traded.',
        'DEMAND for USD (D_USD): comes from foreigners (and Americans abroad) wanting to BUY DOLLARS. Sources: (a) foreign demand for U.S. EXPORTS (a foreigner buying U.S. goods needs USD); (b) foreign demand for U.S. ASSETS (foreigners buying U.S. stocks, bonds, real estate); (c) foreign tourists visiting the U.S.; (d) speculators expecting USD to appreciate. SLOPES DOWNWARD: at higher exchange rates (USD more expensive), foreigners need more of their currency to get a USD; quantity demanded falls.',
        'SUPPLY of USD (S_USD): comes from Americans wanting to convert their dollars to other currencies. Sources: (a) U.S. imports (American buying foreign goods supplies USD to FX market); (b) Americans buying foreign assets; (c) U.S. tourists abroad; (d) speculators expecting USD to depreciate. SLOPES UPWARD: at higher exchange rates (USD worth more in foreign currency), Americans get more foreign goods/assets per dollar — more dollars are supplied to convert. Quantity supplied rises.',
        'EQUILIBRIUM: where D and S intersect. The equilibrium exchange rate balances foreign demand for dollars (to buy U.S. exports/assets) with American supply (to buy foreign goods/assets).',
        'WHAT SHIFTS D_USD: factors changing FOREIGN demand for USD. (a) U.S. real interest rates rise → foreign capital flows in → D_USD shifts RIGHT → USD appreciates. (b) U.S. exports become more attractive (better quality, lower prices) → D rights → USD appreciates. (c) Investors expect USD to appreciate → buy now → D right. (d) U.S. economy strengthens, raising attractiveness of U.S. assets → D right.',
        'WHAT SHIFTS S_USD: factors changing AMERICAN supply of USD. (a) U.S. tastes shift toward foreign goods → S_USD shifts RIGHT → USD depreciates. (b) Foreign interest rates rise → Americans send capital abroad → S_USD right. (c) Investors expect USD to depreciate → sell now → S_USD right.',
        'CRITICAL: a single event often shifts BOTH D and S. E.g., U.S. interest rates rise: D_USD shifts right (foreign capital in), and S_USD might shift left (U.S. investors keep money home). Both effects cause USD appreciation.',
      ],
      vocabulary: [
        { term: 'foreign exchange market', definition: 'the market in which currencies are traded; demand and supply for each currency determine its exchange rate.' },
      ],
      suggestedTools: ['foreign_exchange_market'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-shift-d',
      kind: 'worked_example',
      problem:
        'A foreign country becomes interested in U.S. real estate as a safe-haven investment, increasing its purchases of U.S. real estate by $100B per year. (a) Identify which curve shifts in the FX market and the direction. (b) Identify the effect on the equilibrium exchange rate (e.g., EUR per USD). (c) State whether the dollar appreciates or depreciates. (d) Identify the implication for U.S. exports and imports.',
      steps: [
        'STEP 1 — IDENTIFY THE SOURCE. Foreign purchase of U.S. real estate is FOREIGN DEMAND FOR U.S. ASSETS — a source of D_USD.',
        'STEP 2 — D_USD SHIFTS RIGHT. At every exchange rate, more dollars are demanded.',
        'STEP 3 — NEW EQUILIBRIUM. With unchanged S_USD and rightward-shifted D_USD, the equilibrium exchange rate (EUR per USD) RISES. The dollar becomes more valuable in EUR terms.',
        'STEP 4 — DOLLAR APPRECIATES. (USD goes from say 0.90 EUR to 0.95 EUR per dollar.)',
        'STEP 5 — IMPLICATIONS. (a) U.S. EXPORTS become MORE EXPENSIVE in foreign currency. A $100 U.S. good costs more euros than before. Foreign demand for U.S. exports falls; U.S. exports decline. (b) U.S. IMPORTS become CHEAPER in dollar terms. The same euro of foreign goods now costs fewer dollars. U.S. consumers buy more imports. (c) NX = exports - imports → both effects reduce NX.',
        'STEP 6 — AD-AS implication. Lower NX means AD shifts LEFT (modestly). However, in an open economy with capital flows, the resulting reduction in U.S. real interest rates can offset some of this — net effect is ambiguous in the short run. AP focuses on the FX market effects directly.',
      ],
      answer: 'D_USD shifts right → exchange rate rises → USD appreciates → exports fall, imports rise → NX falls.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-classify',
      kind: 'try_yourself',
      problem:
        'For each event, identify which curve in the FX market for U.S. dollars shifts (D_USD or S_USD) and the direction. (a) U.S. real interest rates rise. (b) Foreign tourists increasingly visit the U.S. (c) U.S. consumers develop a stronger preference for European cars. (d) Foreign investors expect the U.S. dollar to depreciate.',
      expectedAnswer:
        '(a) "U.S. real interest rates rise": foreign capital flows IN seeking higher yields → D_USD SHIFTS RIGHT. (USD appreciates.) (b) "Foreign tourists visit U.S.": foreigners need USD to spend → D_USD SHIFTS RIGHT. (USD appreciates.) (c) "U.S. consumers prefer European cars": Americans need EUR to buy European cars → they SUPPLY USD in the FX market → S_USD SHIFTS RIGHT. (USD depreciates.) (d) "Foreign investors expect USD to depreciate": they SELL USD now to avoid future losses → either D_USD shifts LEFT (less interest in buying USD) or S_USD shifts RIGHT (foreigners with USD selling them) — both are valid; AP would accept either. (USD depreciates from expectations alone.)',
      responseFormat: 'free',
      hints: [
        'Rule: foreign demand for USD = D. American supply of USD to convert = S.',
        'Higher U.S. rates / U.S. attractive = D right.',
        'U.S. tastes for foreign goods / Americans investing abroad = S right.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-explain-supply',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Why does the SUPPLY of U.S. dollars in the FX market come from AMERICANS, not foreigners? Use a specific example to illustrate.',
      expectedAnswer:
        'The supply of U.S. dollars in the FX market is the quantity of dollars Americans want to CONVERT to foreign currencies — to buy foreign goods, foreign assets, or to travel abroad. Foreigners do not "supply" dollars to the FX market because they don\'t typically have dollars to begin with — they ACQUIRE dollars from the market (which is the demand side). EXAMPLE: an American family vacations in Italy. They take $5,000 in U.S. funds to a currency exchange (or use a credit card transaction); the exchanger SUPPLIES $5,000 USD to the FX market in exchange for euros. The euros come from European holders who DEMAND USD (i.e., supply euros). The American IMPORTING goods from Japan supplies USD (and demands JPY). The American buying European stocks supplies USD (and demands EUR). At every angle, the supply of USD comes from Americans converting their dollars away from dollars. Strong answers articulate the directional asymmetry: foreigners DEMAND USD; Americans SUPPLY USD.',
      responseFormat: 'frq',
      hints: [
        'Who actually has USD to begin with?',
        'Who needs to convert what?',
        'Use a concrete travel or import example.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'FX market diagram: y-axis = exchange rate; x-axis = quantity of currency.',
        'D for currency: from foreigners wanting it (exports, assets, tourism).',
        'S of currency: from domestic residents wanting foreign currency (imports, foreign assets, foreign tourism).',
        'Higher domestic interest rates / domestic attractiveness → D right → currency appreciates.',
        'Domestic preference for foreign goods/assets → S right → currency depreciates.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.3',
    cedTitle: 'The Foreign Exchange Market',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '21', note: 'OpenStax Macro AP — FX market mechanics, supply and demand sources.' },
    ],
  },
};
