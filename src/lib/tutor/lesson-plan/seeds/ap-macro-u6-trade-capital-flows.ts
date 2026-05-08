/**
 * AP Macroeconomics — CED Unit 6.6: Trade and Capital Flow
 * Relationships.
 *
 * Twin deficits, current-account / financial-account inverse, the
 * twin-deficits debate. Closes Unit 6 and the AP Macro course.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U6_TRADE_CAPITAL_FLOWS: LessonPlan = {
  id: 'evelyn.ap.macro.trade-capital-flows.v1',
  title: 'U6.6 Trade and Capital Flow Relationships',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.trade-capital-flows',
      description:
        'Apply the BOP identity (CA + FA ≈ 0) to predict relationships between trade balance and net capital flows; identify the "twin deficits" pattern; analyze long-run sustainability of persistent current-account deficits.',
      standard: 'AP-MACRO-6.6',
    },
  ],
  prerequisites: ['apmacro.fx-effects-on-economy'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reveal that trade and capital flows are two sides of one coin.',
      script:
        "When a country runs a trade deficit, it imports more than it exports. The dollars that finance those imports must come from somewhere — and they come from foreigners investing in the country's assets. Trade deficits and capital inflows are MIRROR IMAGES of each other. The U.S. has run twin deficits — trade deficit and capital inflow — for forty years. Understanding the link is essential.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-twin-deficits',
      kind: 'concept',
      goal: 'Cover the CA-FA identity, twin deficits, and long-run sustainability arguments.',
      keyIdeas: [
        'BOP IDENTITY (review from U6.1): CA + FA ≈ 0. Current account deficit ⇔ financial account surplus, and vice versa. They are linked by accounting, not by causation in either direction alone.',
        'TWIN DEFICITS PATTERN: persistent BUDGET deficit (government spending > revenue) + persistent CA deficit (imports > exports). The U.S. has shown this pattern since the 1980s. Mechanism: budget deficit → loanable funds D right → real rates rise → USD appreciates (FX channel) → exports fall, imports rise → CA deficit widens. The two "twins" emerge through this chain.',
        'CAPITAL FLOWS are the FINANCING of the CA deficit. When the U.S. runs a CA deficit, foreigners must accumulate dollar-denominated assets (Treasury bonds, U.S. corporate stocks, real estate). This INCREASES U.S. external indebtedness over time.',
        'NET INTERNATIONAL INVESTMENT POSITION (NIIP): the cumulative net asset position of a country with the rest of the world. Persistent CA deficits drive NIIP toward more negative — country owes more to foreigners over time.',
        'IS PERSISTENT CA DEFICIT BAD? DEPENDS. Some perspectives:',
        'PERSPECTIVE 1 (concerned): persistent CA deficits accumulate foreign claims on the U.S.; future income is needed to service those claims; eventually the country may face a "sudden stop" if foreign confidence falls (Asian crisis 1997-style). The accumulating debt burden constrains future generations.',
        'PERSPECTIVE 2 (sanguine): a CA deficit is the OTHER SIDE of foreign capital INFLOW — foreign investment in the U.S. economy. Foreign capital builds factories, invests in U.S. companies, deepens financial markets. The flip side is a benefit, not just a debt. Plus, the U.S. dollar is the global reserve currency; demand for USD assets is structurally high; the U.S. can run larger deficits than other countries before facing trouble.',
        'CAPITAL ACCOUNT REVERSAL (sudden stop): historically, countries with persistent CA deficits financed by foreign capital sometimes face crisis when capital flows reverse abruptly. Examples: Mexico 1994, Asian Tigers 1997, Argentina 2001, Greece 2010. The risk is real for emerging markets; less so (so far) for the U.S. with reserve-currency status.',
        'ROLE OF EXCHANGE RATE: a depreciating currency tends to AUTOMATICALLY narrow the CA deficit (cheaper exports, more expensive imports → NX rises → CA improves). Floating exchange rates provide a built-in adjustment mechanism. Fixed-rate countries face more abrupt adjustment when imbalances grow.',
      ],
      vocabulary: [
        { term: 'twin deficits', definition: 'simultaneous government budget deficit and current-account deficit; common pattern for the U.S. since the 1980s.' },
        { term: 'net international investment position (NIIP)', definition: 'a country\'s cumulative net asset position with the rest of the world; equals foreign-held domestic assets minus domestic-held foreign assets.' },
        { term: 'sudden stop', definition: 'an abrupt reversal of foreign capital flows that can trigger a balance-of-payments crisis.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-twin-deficits',
      kind: 'worked_example',
      problem:
        "Country A enacts a large fiscal stimulus financed by deficit borrowing. Trace the chain from the budget deficit to the current-account deficit. Identify the role of: (a) the loanable funds market, (b) the FX market, (c) net exports, (d) the BOP identity.",
      steps: [
        'STEP 1 — BUDGET DEFICIT increases. Government borrows more in loanable funds market.',
        'STEP 2 — LOANABLE FUNDS: D shifts RIGHT. Real interest rate RISES.',
        'STEP 3 — FX MARKET: higher real rates → foreign capital inflow → D_USD shifts RIGHT. USD APPRECIATES.',
        'STEP 4 — NX EFFECT: stronger dollar → exports fall, imports rise → NX FALLS. The CA (which contains NX) MOVES TOWARD DEFICIT.',
        'STEP 5 — BOP IDENTITY: CA deficit must be matched by FA surplus. The capital inflow (foreign purchases of U.S. assets — including the new Treasury bonds being issued to finance the deficit!) provides the FA surplus. CA + FA ≈ 0.',
        'STEP 6 — SYNTHESIS. The same chain produces BOTH the budget deficit AND the trade deficit: government issues bonds → foreigners buy them → USD appreciates → trade deficit widens. The "twin" deficits arise from the same underlying mechanism.',
        'STEP 7 — IMPLICATION. To address the trade deficit, addressing the budget deficit (reducing government borrowing) is a logical lever — it would lower real rates, depreciate USD, narrow NX deficit. This is one argument for fiscal restraint, especially during boom times. The empirical strength of the twin-deficits link is debated; in some periods (1990s) the link was weak.',
      ],
      answer: 'Budget deficit → loanable funds D right → real rates up → USD appreciates → NX falls → CA deficit widens. BOP identity: CA deficit financed by foreign capital inflow (FA surplus).',
      estimatedMinutes: 5,
    },
    {
      id: 'try-bop-link',
      kind: 'try_yourself',
      problem:
        'In your own words, explain why a country running a CURRENT-ACCOUNT DEFICIT must (by accounting) have a CAPITAL/FINANCIAL-ACCOUNT SURPLUS. Use the U.S. as an example.',
      expectedAnswer:
        'Every dollar that crosses a country\'s border is recorded somewhere in the BOP. When the U.S. imports more than it exports (CA deficit), foreigners receive dollars from U.S. importers but DON\'T spend equivalent dollars buying U.S. exports. Those foreigners hold the surplus dollars; they cannot eat them. They MUST do something with the dollars — most commonly, they BUY DOLLAR-DENOMINATED ASSETS (Treasury bonds, U.S. corporate stocks, real estate, deposits in U.S. banks). Each foreign purchase of a U.S. asset is an INFLOW to the U.S. financial account. The total inflow via FA must equal the dollar excess the U.S. paid out via CA — that\'s the BOP identity. So every CA deficit produces an equal-and-opposite FA surplus. EXAMPLE: U.S. CA deficit ≈ $750B in 2023. By identity, the U.S. FA surplus ≈ $750B — foreign investors net-bought roughly $750B of U.S. Treasury bonds, stocks, real estate, etc. The same $750B that flowed out as CA deficit flowed back in as FA inflow. Strong answers: (i) state the identity, (ii) explain the dollar-flow mechanism, (iii) cite the U.S. example.',
      responseFormat: 'free',
      hints: [
        'Where do the dollars from imports go?',
        'Foreigners must do SOMETHING with the dollars.',
        'BOP identity is mechanical, not behavioral.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-twin-deficits-debate',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Some economists view persistent U.S. current-account deficits as a serious long-run problem; others view them as a sign of strong foreign demand for U.S. assets. (a) Make the case for the CONCERNED view. (b) Make the case for the SANGUINE view. (c) Identify ONE specific U.S. structural feature that helps explain why the U.S. has been able to sustain large deficits without crisis.',
      expectedAnswer:
        '(a) CONCERNED VIEW: persistent CA deficits accumulate FOREIGN CLAIMS on the U.S. economy. The Net International Investment Position (NIIP) becomes increasingly negative. Future income is required to service these claims (interest payments and dividends to foreigners). At some point, foreign confidence may waver; capital may flow out abruptly (a "sudden stop"); the dollar would depreciate sharply; import-price inflation would rise; living standards could fall. Examples of countries that experienced this: Mexico 1994, Asian Tigers 1997, Greece 2010. Persistent deficits also constrain future fiscal options because debt service consumes growing budget share. (b) SANGUINE VIEW: a CA deficit is the OPPOSITE SIDE of foreign capital INFLOW. Foreign investment in the U.S. economy: builds factories (FDI), funds private I (financing American businesses), deepens financial markets, signals foreign confidence in U.S. economic prospects. The U.S. has effectively been a "net importer of foreign savings" — funding investment beyond what domestic saving alone could support. Provided foreigners continue to find U.S. assets attractive, the deficits are sustainable indefinitely. The flip side of the CA deficit is benefit, not just liability. (c) SPECIFIC U.S. STRUCTURAL FEATURE: (i) DOLLAR\'S RESERVE-CURRENCY STATUS — the USD is the world\'s primary reserve currency. Foreign central banks, businesses, and individuals globally demand USD-denominated assets for trade settlement, reserve holdings, and safety. This structural demand for dollars allows the U.S. to run larger and more persistent deficits than would be possible for other countries. The "exorbitant privilege" gives the U.S. unusual flexibility. (ii) Other valid: deep and liquid U.S. financial markets; strong rule of law and investor protections; English-language dominance making U.S. assets accessible globally. Strong answers: explicitly cite reserve-currency status (or another structural feature), articulate why it enables larger sustainable deficits.',
      responseFormat: 'frq',
      hints: [
        'Concerned: claims accumulating, sudden-stop risk.',
        'Sanguine: foreign capital is investment, not just debt.',
        'U.S.-specific feature: reserve currency status.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'BOP identity: CA + FA ≈ 0. Current-account deficit ⇔ financial-account surplus.',
        'Twin deficits: budget deficit + CA deficit, linked via loanable funds → FX → NX chain.',
        'Persistent CA deficits accumulate net foreign liabilities (NIIP turns negative).',
        'Sustainability debate: concerned (sudden-stop risk) vs sanguine (capital inflow benefit).',
        'U.S. exception: reserve-currency status enables larger sustainable deficits than other countries.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.6',
    cedTitle: 'Trade and Capital Flow Relationships',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '21', note: 'OpenStax Macro AP — twin deficits, BOP identity, sustainability debate.' },
    ],
  },
};
