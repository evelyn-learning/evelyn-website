/**
 * AP Macroeconomics — Unit 6 FRQ Practice.
 *
 * Three multi-part FRQs covering BOP analysis, FX market shifts, and
 * Mundell-Fleming style fiscal/FX interaction. Closes the AP Macro
 * course.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U6_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.macro.u6-frq-practice.v1',
  title: 'U6 FRQ Practice',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.u6-frq-practice',
      description:
        'Apply Unit 6 concepts (balance of payments, FX market mechanics, exchange-rate determinants, FX-AD-AS effects, twin deficits) to multi-part free-response problems with AP-style rubric scoring.',
      standard: 'AP-MACRO-6-FRQ',
    },
  ],
  prerequisites: [
    'apmacro.balance-of-payments',
    'apmacro.exchange-rates',
    'apmacro.fx-market',
    'apmacro.fx-determinants',
    'apmacro.fx-effects-on-economy',
    'apmacro.trade-capital-flows',
  ],
  followUps: [],
  estimatedMinutes: 32,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set Unit 6 FRQ stakes — the open-economy capstone.',
      script:
        "Unit 6 FRQs combine FX market analysis with the AD-AS framework — the most cross-unit integration on the AP Macro exam. Three problems incoming: BOP classification, FX shift + AD-AS effects, and a twin-deficits / Mundell-Fleming synthesis.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-strategy',
      kind: 'concept',
      goal: 'Refresher on FX market and BOP rubric conventions.',
      keyIdeas: [
        'FX MARKET RUBRIC: y-axis = exchange rate (e.g., EUR per USD); x-axis = quantity of currency. D downward, S upward. Currency labels matter.',
        'BOP RUBRIC: CA = trade balance + net income + transfers. FA = asset transactions. Identity: CA + FA ≈ 0.',
        'CHAIN RUBRIC for monetary policy in open economy: rate change → FX shift → currency direction → NX change → AD shift → Y/P/UR.',
        'CHAIN RUBRIC for fiscal policy: deficit → loanable funds → real rate → FX shift → currency direction → NX change → AD partial offset.',
        'AT EVERY STEP: explicit cause-and-effect. Skipping links loses points even if final direction is right.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-frq-bop-classify',
      kind: 'try_yourself',
      problem:
        "FRQ Practice 1 — BOP Analysis. (a) Define the current account (CA) and the financial account (FA). (b) State the BOP identity. (c) For each transaction, classify as CA or FA and identify whether it is an INFLOW or OUTFLOW for the U.S.: (i) Walmart imports $40B from Vietnam, (ii) Toyota Japan buys $5B of U.S. real estate, (iii) Apple earns $20B in profits abroad, (iv) U.S. provides $3B in foreign aid to Africa. (d) The U.S. has run persistent CA deficits since the 1980s. Explain how this is consistent with the BOP identity.",
      expectedAnswer:
        '(a) CA: net exports (goods and services), net income from abroad, net current transfers. FA: cross-border asset transactions (foreign direct investment, portfolio investment, central-bank reserves). (1.5 points)\n(b) BOP IDENTITY: CA + FA ≈ 0. Equivalently, a CA deficit must be matched by an FA surplus. (1 point)\n(c) (i) "Walmart imports $40B": CA — OUTFLOW (import). (ii) "Toyota buys $5B U.S. real estate": FA — INFLOW (foreign purchase of U.S. asset). (iii) "Apple earns $20B abroad": CA — INFLOW (net income from abroad). (iv) "U.S. provides $3B foreign aid": CA — OUTFLOW (current transfer). (2 points: 0.5 each)\n(d) Persistent U.S. CA deficits are consistent with persistent FA surpluses by the BOP identity. The U.S. has imported more than exported for ~40 years; the dollars sent abroad have flowed back as foreign purchases of U.S. assets — Treasury bonds, U.S. stocks, U.S. real estate. The U.S. has become a NET DEBTOR to the world (NIIP increasingly negative). The CA deficit and FA surplus are two sides of the same pattern: foreigners financing U.S. consumption beyond U.S. domestic production via investment in U.S. assets. (2.5 points: 1 for identity application, 1 for mechanism, 0.5 for NIIP / debtor status note)\nTotal: 7 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 2, scoringCriteria: 'Defines the current account (net exports of goods/services, net income from abroad, net current transfers) and the financial account (cross-border asset transactions) — 1 point each.', modelResponse: 'The CURRENT ACCOUNT records net exports of goods and services, net income from abroad, and net current transfers. The FINANCIAL ACCOUNT records cross-border asset transactions — foreign direct investment, portfolio investment, and central-bank reserve changes.' },
        { criterionId: 'b', maxPoints: 1, scoringCriteria: 'States the BOP identity CA + FA ≈ 0 (a CA deficit is matched by an FA surplus).', modelResponse: 'CA + FA ≈ 0 — a current-account deficit must be matched by a financial-account surplus.' },
        { criterionId: 'c', maxPoints: 3, scoringCriteria: 'Classifies all four transactions with the correct account and direction: (i) imports = CA outflow, (ii) Toyota real-estate purchase = FA inflow, (iii) Apple foreign profits = CA inflow, (iv) foreign aid = CA outflow. Partial credit by count of correct classifications.', modelResponse: '(i) Walmart imports $40B: CA — OUTFLOW. (ii) Toyota buys $5B of U.S. real estate: FA — INFLOW. (iii) Apple earns $20B abroad: CA — INFLOW. (iv) U.S. provides $3B foreign aid: CA — OUTFLOW.' },
        { criterionId: 'd', maxPoints: 3, scoringCriteria: 'Applies the identity (persistent CA deficit matched by persistent FA surplus), explains the mechanism (dollars sent abroad return as foreign purchases of U.S. assets such as Treasuries, stocks, real estate), and notes the U.S. net-debtor / negative NIIP status.', modelResponse: 'By the BOP identity, persistent CA deficits are matched by persistent FA surpluses. The dollars the U.S. sends abroad for imports flow back as foreign purchases of U.S. assets — Treasury bonds, stocks, real estate. Foreigners finance U.S. consumption beyond domestic production, and the U.S. has become a net debtor to the world (increasingly negative NIIP).' },
      ] },
      responseFormat: 'frq',
      hints: [
        'CA = current flows; FA = asset transactions.',
        'Identify each transaction\'s account and direction.',
        'Persistent CA deficit ↔ persistent FA surplus.',
      ],
      estimatedMinutes: 7,
    },
    {
      id: 'try-frq-fx-shift',
      kind: 'try_yourself',
      problem:
        "FRQ Practice 2 — FX Market Shift + AD-AS. The Federal Reserve unexpectedly RAISES interest rates by 1.5 percentage points. Other major central banks hold rates steady. (a) On a correctly-labeled FX market diagram for the U.S. dollar, identify which curve shifts and the direction. (b) Identify the effect on the equilibrium exchange rate (EUR per USD). (c) State whether the dollar appreciates or depreciates. (d) Trace the effect on U.S. NX. (e) On an AD-AS diagram, identify the effect of the NX change on AD, real GDP, and price level. (f) Compare the magnitude of the AD shift to what would have happened in a CLOSED economy.",
      expectedAnswer:
        '(a) Higher U.S. rates → foreign capital flows in seeking higher yields → D_USD SHIFTS RIGHTWARD. (Some texts also note S_USD shifts left as U.S. investors keep money home; same direction effect.) (1.5 points)\n(b) Equilibrium EUR per USD RISES (more euros per dollar). (1 point)\n(c) USD APPRECIATES. (0.5 points)\n(d) Stronger USD → U.S. EXPORTS more expensive in foreign currency → exports FALL. Stronger USD → U.S. IMPORTS cheaper in dollars → imports RISE. NX FALLS. (1.5 points)\n(e) Lower NX → AD shifts LEFTWARD (NX is an AD component). New short-run equilibrium: real GDP FALLS, price level FALLS, cyclical UE RISES. (2 points)\n(f) In a CLOSED economy, the rate hike would shift AD left only via lower I and lower C (interest-sensitive borrowing). In an OPEN economy, the FX channel ADDS the NX-falling effect, REINFORCING the AD-leftward shift. The AD shift is LARGER in the open economy. The Fed\'s contractionary policy is therefore more potent in an open economy than in a closed one. Strong answers explicitly: (i) name the closed-economy channels (I and C), (ii) name the FX channel (NX via appreciation), (iii) state that AD shifts left MORE in open economy. (2 points)\nTotal: 8.5 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 1, scoringCriteria: 'Identifies that DEMAND for U.S. dollars shifts RIGHTWARD as foreign capital flows in seeking higher yields (also acceptable: S_USD shifts left as U.S. investors keep funds home).', modelResponse: 'Higher U.S. rates attract foreign capital seeking higher yields, so the DEMAND for dollars (D_USD) shifts RIGHTWARD.' },
        { criterionId: 'b', maxPoints: 1, scoringCriteria: 'States that the equilibrium exchange rate (EUR per USD) RISES.', modelResponse: 'The equilibrium exchange rate rises — more euros per dollar.' },
        { criterionId: 'c', maxPoints: 1, scoringCriteria: 'States that the dollar APPRECIATES.', modelResponse: 'The U.S. dollar APPRECIATES.' },
        { criterionId: 'd', maxPoints: 2, scoringCriteria: 'Traces both sides: a stronger dollar makes U.S. exports more expensive abroad (exports fall) and imports cheaper in dollars (imports rise), so NX FALLS.', modelResponse: 'A stronger dollar makes U.S. exports more expensive in foreign currency, so exports FALL; imports become cheaper in dollars, so imports RISE. Net exports FALL.' },
        { criterionId: 'e', maxPoints: 2, scoringCriteria: 'States that the fall in NX shifts AD LEFTWARD and identifies the AD-AS effects: real GDP falls and the price level falls (cyclical unemployment rises).', modelResponse: 'Lower NX shifts AD LEFTWARD (NX is an AD component). At the new short-run equilibrium, real GDP FALLS and the price level FALLS; cyclical unemployment rises.' },
        { criterionId: 'f', maxPoints: 2, scoringCriteria: 'Compares to a closed economy: names the closed-economy channels (lower I and interest-sensitive C), names the added FX/NX channel in the open economy, and concludes the AD shift is LARGER in the open economy (contractionary policy more potent).', modelResponse: 'In a CLOSED economy the rate hike shifts AD left only through lower investment and interest-sensitive consumption. In an OPEN economy the FX channel adds the NX decline from the appreciation, REINFORCING the leftward shift. The AD shift is therefore LARGER — the Fed\'s contractionary policy is more potent in an open economy.' },
      ] },
      responseFormat: 'frq',
      hints: [
        'Higher rates → D_USD right → USD appreciates.',
        'Strong dollar hurts exports, helps imports → NX falls.',
        'NX is part of AD; falling NX shifts AD left.',
        'Open economy adds FX channel on top of closed-economy I and C effects.',
      ],
      estimatedMinutes: 8,
    },
    {
      id: 'try-frq-twin-deficits',
      kind: 'try_yourself',
      problem:
        "FRQ Practice 3 — Twin Deficits / Mundell-Fleming. The U.S. government enacts a large fiscal stimulus financed entirely by deficit borrowing. (a) Trace the effect on the LOANABLE FUNDS market. (b) Trace the effect on the FX MARKET for the U.S. dollar. (c) Identify the effect on NX. (d) Compare the actual AD shift to the SPENDING-MULTIPLIER prediction — is it larger, smaller, or the same? Why? (e) The U.S. is sometimes said to run TWIN DEFICITS (budget deficit AND current-account deficit). Explain the link between these two deficits using the chain you traced.",
      expectedAnswer:
        '(a) LOANABLE FUNDS: government deficit shifts D rightward. Real interest rate RISES. Private I falls (crowding-out). (1.5 points)\n(b) FX MARKET: higher U.S. real rates → foreign capital inflow → D_USD shifts RIGHTWARD. USD APPRECIATES. (1.5 points)\n(c) NX: stronger USD → exports more expensive abroad (fall), imports cheaper (rise). NX FALLS. (1 point)\n(d) ACTUAL AD SHIFT < spending-multiplier prediction. The simple multiplier (1/(1-MPC)) ignores both crowding-out and the FX channel. Two offsets reduce the actual shift: (i) CROWDING-OUT — higher real rates reduce private I, partially offsetting the AD-right effect of G. (ii) MUNDELL-FLEMING / FX CHANNEL — higher real rates → USD appreciates → NX falls → AD partially offset. Both offsets work in the same direction (reducing the net AD shift). The actual AD shift is therefore SMALLER than the textbook multiplier suggests. The Mundell-Fleming effect makes fiscal policy LESS POTENT in open economies with floating exchange rates than in closed economies. (2 points)\n(e) TWIN DEFICITS LINK: the budget deficit drives the CA deficit through the chain I traced. Budget deficit → loanable funds D up → real rate up → USD appreciates → NX falls → CA moves toward deficit. The two "twins" emerge from the same underlying fiscal cause. Reducing one (e.g., reducing the budget deficit) tends to reduce the other (the trade deficit) via the reverse of the chain. The link is most visible during periods of large fiscal expansion (e.g., 1980s Reagan deficits); it is weaker in other periods due to other forces. Strong answers: (i) state the chain, (ii) name the Mundell-Fleming or open-economy fiscal-multiplier reduction, (iii) note that policy targeting one deficit tends to affect the other. (2 points)\nTotal: 8 points.',
      rubric: { parts: [
        { criterionId: 'a', maxPoints: 2, scoringCriteria: 'Traces the loanable funds market: government deficit shifts D rightward, the real interest rate rises, and private investment falls (crowding out).', modelResponse: 'The government deficit shifts the DEMAND for loanable funds RIGHTWARD. The real interest rate RISES, and private investment falls — crowding out.' },
        { criterionId: 'b', maxPoints: 2, scoringCriteria: 'Traces the FX market: higher U.S. real rates attract foreign capital, shifting D_USD rightward, so the dollar APPRECIATES.', modelResponse: 'Higher U.S. real rates draw foreign capital inflows seeking better returns; demand for dollars (D_USD) shifts RIGHTWARD and the dollar APPRECIATES.' },
        { criterionId: 'c', maxPoints: 1, scoringCriteria: 'States that NX FALLS: the stronger dollar makes exports more expensive abroad and imports cheaper.', modelResponse: 'The stronger dollar makes U.S. exports more expensive abroad (exports fall) and imports cheaper (imports rise), so NX FALLS.' },
        { criterionId: 'd', maxPoints: 2, scoringCriteria: 'Concludes the actual AD shift is SMALLER than the spending-multiplier prediction and names BOTH offsets: crowding out (higher r reduces I) and the Mundell-Fleming / FX channel (appreciation reduces NX).', modelResponse: 'The actual AD shift is SMALLER than the multiplier prediction. Two offsets work in the same direction: (i) CROWDING OUT — the higher real rate reduces private I; (ii) the MUNDELL-FLEMING FX CHANNEL — the higher rate appreciates the dollar, so NX falls. Fiscal policy is therefore less potent in an open economy with floating exchange rates than in a closed one.' },
        { criterionId: 'e', maxPoints: 2, scoringCriteria: 'Explains the twin-deficits link through the traced chain — budget deficit → higher real rates → dollar appreciation → NX falls → CA moves toward deficit — noting both deficits share the same fiscal cause and that reducing one tends to reduce the other.', modelResponse: 'The budget deficit drives the current-account deficit through the same chain: budget deficit → loanable-funds demand up → real rate up → dollar appreciates → NX falls → the CA moves toward deficit. Both "twins" emerge from the same fiscal cause, so reducing the budget deficit tends to shrink the trade deficit via the reverse chain — a link most visible in large fiscal expansions such as the 1980s.' },
      ] },
      responseFormat: 'frq',
      hints: [
        'Trace the full chain: deficit → loanable funds → real rate → FX → NX → AD.',
        'Both crowding-out AND FX channel reduce fiscal policy effectiveness.',
        'Twin deficits emerge from the same underlying fiscal cause.',
      ],
      estimatedMinutes: 8,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'BOP: CA + FA ≈ 0. CA deficit ⇔ FA surplus.',
        'FX market: higher rates → currency appreciates; lower rates → depreciates.',
        'Currency change → NX change → AD change (open-economy effect).',
        'Monetary policy MORE POTENT in open economy (FX channel reinforces).',
        'Fiscal policy LESS POTENT in open economy (Mundell-Fleming offset).',
        'Twin deficits: budget deficit drives CA deficit via FX channel.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6-FRQ',
    cedTitle: 'Unit 6 FRQ Practice',
    sources: [
      { type: 'frq-style', source: 'AP Plans Initiative author', note: 'Three multi-part problems modeled on past AP Macro Unit-6 patterns.' },
    ],
  },
};
