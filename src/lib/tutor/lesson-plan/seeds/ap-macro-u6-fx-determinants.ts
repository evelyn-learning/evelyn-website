/**
 * AP Macroeconomics — CED Unit 6.4: Determinants of Exchange Rates.
 *
 * What shifts FX market curves: real interest rates, relative inflation,
 * relative growth, expectations, trade flows. AP heavily tests this with
 * "trace through the FX market" FRQs.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U6_FX_DETERMINANTS: LessonPlan = {
  id: 'evelyn.ap.macro.fx-determinants.v1',
  title: 'Determinants of Exchange Rates',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.fx-determinants',
      description:
        'Identify the determinants of exchange rates (relative real interest rates, relative inflation, relative growth, expectations, trade flows), apply each to predict shifts in the FX market, and integrate FX changes with macroeconomic policy (monetary, fiscal).',
      standard: 'AP-MACRO-6.4',
    },
  ],
  prerequisites: ['apmacro.fx-market'],
  followUps: ['apmacro.fx-effects-on-economy'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the determinants as a small list of forces.',
      script:
        "What makes a currency move? The list isn't long: relative interest rates, relative inflation, relative growth, expectations, and trade flows. Each operates through a specific channel. Once you can map an event to its channel, you can predict the direction of the exchange rate shift — every time. This is the most-tested mechanic in Unit 6.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-determinants',
      kind: 'concept',
      goal: 'Cover the major exchange-rate determinants, with mechanism and direction for each.',
      keyIdeas: [
        'DETERMINANT 1 — RELATIVE REAL INTEREST RATES (the most-tested driver). When a country\'s real rates RISE relative to others, foreign capital flows IN seeking higher returns; D for that currency rises; currency APPRECIATES. When rates fall relative to others, capital flows out; currency DEPRECIATES. This is the channel through which monetary policy affects FX rates.',
        'DETERMINANT 2 — RELATIVE INFLATION RATES (purchasing power parity logic). A country with persistently higher inflation than its trading partners sees its currency DEPRECIATE over time. Reason: at the same nominal exchange rate, the higher-inflation country\'s goods become uncompetitive abroad; demand for its exports falls; D for currency falls; currency depreciates until parity is restored. PPP is a long-run anchor; short-run deviations can be large.',
        'DETERMINANT 3 — RELATIVE ECONOMIC GROWTH. A faster-growing economy attracts foreign capital (firms invest where returns are higher); D for currency rises; currency APPRECIATES. Strong growth also typically raises interest rates, reinforcing the appreciation effect.',
        'DETERMINANT 4 — EXPECTATIONS. If investors expect a currency to appreciate, they BUY it now (boosting D), causing it to appreciate even before the underlying fundamentals change. Self-fulfilling expectations are a key feature of FX markets.',
        'DETERMINANT 5 — TRADE FLOWS / NX. A country with strong exports earns foreign currency that gets converted to domestic — D for domestic currency rises; APPRECIATES. A country importing more than exporting must convert domestic to foreign — S of domestic currency rises; DEPRECIATES.',
        'DETERMINANT 6 — RELATIVE TASTES / PREFERENCES. If global consumers shift preferences toward U.S. goods (e.g., iPhones become must-have globally), D for USD rises; USD appreciates.',
        'DETERMINANT 7 — GOVERNMENT INTERVENTION. Direct central-bank intervention in FX markets, capital controls, fixed-rate maintenance.',
        'INTERACTION CASE — TIGHTER U.S. MONETARY POLICY (Fed raises rates): U.S. real rates rise relative to other countries → foreign capital flows in → D_USD shifts RIGHT → USD appreciates. Effects: (a) U.S. exports become more expensive abroad (NX falls); (b) U.S. imports become cheaper (NX falls). (c) AD shifts LEFT (via NX). The FX channel REINFORCES the contractionary effect of higher rates beyond the direct I and C reductions.',
      ],
      vocabulary: [
        { term: 'purchasing power parity (PPP)', definition: 'long-run principle that exchange rates adjust to equate the cost of identical goods across countries.' },
      ],
      suggestedTools: ['foreign_exchange_market'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-fed-tightening',
      kind: 'worked_example',
      problem:
        'The U.S. Federal Reserve raises interest rates from 3% to 5%. Other major central banks hold rates steady. Trace the FX market effect on the U.S. dollar, then identify the implications for U.S. NX and AD.',
      steps: [
        'STEP 1 — IDENTIFY DETERMINANT. U.S. real rates rise relative to other countries → DETERMINANT 1 (relative real interest rates). Direct effect: foreign capital flows in seeking higher yields.',
        'STEP 2 — D_USD SHIFTS RIGHT. Foreigners want more USD to buy U.S. Treasury bonds and other dollar-denominated assets. (Some texts also note S_USD shifts left, as American investors keep money home rather than going abroad — same direction effect on rate.)',
        'STEP 3 — NEW EQUILIBRIUM. Higher exchange rate. USD APPRECIATES.',
        'STEP 4 — IMPLICATION FOR NX. (a) Stronger USD → U.S. exports become more expensive in foreign currency → foreign demand falls → exports DECLINE. (b) Stronger USD → foreign imports become cheaper in dollars → U.S. demand for imports rises → imports INCREASE. (c) NX = exports − imports → both effects → NX FALLS.',
        'STEP 5 — IMPLICATION FOR AD. NX is a component of AD. NX falls → AD shifts LEFT. This REINFORCES the direct contractionary effect of higher U.S. rates on AD (which already worked via lower I and C).',
        'STEP 6 — TOTAL CONTRACTIONARY EFFECT. Higher rates have THREE channels reducing AD: (i) lower I (firms borrow less), (ii) lower C (consumers borrow less for durables/houses), (iii) lower NX (USD appreciation). The FX channel is sometimes called the "monetary policy super-channel" because it operates additionally to the standard direct channels.',
        'STEP 7 — POLICY INSIGHT. AP often tests "what is the EFFECT of monetary policy in an OPEN economy" — answer: bigger than in a closed economy because the FX channel adds to the conventional channels. Same logic in reverse: expansionary monetary policy depreciates the currency, which BOOSTS NX, amplifying the AD-rightward effect.',
      ],
      answer: 'Fed raises rates → USD appreciates → exports fall, imports rise → NX falls → AD shifts left. FX channel reinforces standard contractionary effect.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-classify-determinants',
      kind: 'try_yourself',
      problem:
        'For each event, identify which determinant is operating, the FX market shift, and the direction the U.S. dollar moves. (a) U.S. inflation rises while European inflation stays low. (b) U.S. growth accelerates while Europe is in recession. (c) Investors come to expect a future appreciation of the U.S. dollar. (d) Global consumers shift away from American brands toward European brands.',
      expectedAnswer:
        '(a) "U.S. inflation rises, Europe stable": DETERMINANT 2 (relative inflation). Higher U.S. inflation makes U.S. goods less competitive; foreign demand for U.S. goods (and currency) falls; D_USD SHIFTS LEFT (or S_USD shifts right as U.S. consumers buy relatively cheaper European goods). USD DEPRECIATES. (b) "U.S. growth strong, Europe recession": DETERMINANT 3 (relative growth). Capital flows toward strong-growth economy; D_USD SHIFTS RIGHT. USD APPRECIATES. (c) "Investors expect USD appreciation": DETERMINANT 4 (expectations). Speculators buy now; D_USD SHIFTS RIGHT. USD APPRECIATES (self-fulfilling). (d) "Global tastes shift away from U.S. brands": DETERMINANT 6 (relative tastes). Foreign demand for U.S. exports falls; D_USD SHIFTS LEFT. USD DEPRECIATES.',
      responseFormat: 'free',
      hints: [
        'Identify which determinant is operating.',
        'Direction follows: things favoring U.S. economic activity → USD appreciates.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-monetary-fx',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Compare the AD-side effect of EXPANSIONARY MONETARY POLICY in a CLOSED economy vs an OPEN economy. (a) In a closed economy, what channels operate? (b) In an open economy, what additional channels operate? (c) Which channel is most testable on AP and why?',
      expectedAnswer:
        '(a) CLOSED ECONOMY (no foreign sector): expansionary monetary policy lowers interest rates. Channels: (i) lower i → cheaper borrowing for firms → INVESTMENT (I) RISES → AD right. (ii) lower i → cheaper borrowing for households → CONSUMPTION (C) of durable goods rises. AD shift = I and C effects. (b) OPEN ECONOMY: ADDITIONAL channel through FX MARKET. Lower U.S. interest rates → foreign capital flows OUT seeking higher returns elsewhere → S_USD shifts right (or D_USD left) → USD DEPRECIATES. Depreciation effects: (i) U.S. exports become CHEAPER in foreign currency → exports rise. (ii) U.S. imports become MORE EXPENSIVE in dollars → imports fall. (iii) NX = exports − imports → both effects raise NX. Higher NX → AD RIGHT (additional rightward shift on top of I + C effects). The FX channel REINFORCES the closed-economy effect, making expansionary monetary policy MORE POTENT in an open economy. (c) FX channel is most testable because: (i) it tests both the FX market diagram and the AD-AS framework simultaneously; (ii) it tests the interaction of monetary policy with international flows — a more advanced concept that distinguishes strong from weak students; (iii) AP loves multi-step transmission chains. Strong answers explicitly: (i) name closed-economy channels (I, C), (ii) name the FX channel (NX via depreciation), (iii) note that the open-economy effect is LARGER than closed-economy.',
      responseFormat: 'frq',
      hints: [
        'Closed economy: I and C channels.',
        'Open economy: add FX channel via NX.',
        'FX channel reinforces direct channels.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Determinants: relative interest rates, relative inflation, relative growth, expectations, trade flows, tastes.',
        'Higher real rates → currency APPRECIATES (capital inflow).',
        'Higher inflation → currency DEPRECIATES (PPP).',
        'Stronger growth / better assets → APPRECIATES.',
        'FX channel adds to monetary policy potency in open economies via NX effect.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.4',
    cedTitle: 'Determinants of Exchange Rates',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '21', note: 'OpenStax Macro AP — FX determinants, monetary policy in open economy.' },
    ],
  },
};
