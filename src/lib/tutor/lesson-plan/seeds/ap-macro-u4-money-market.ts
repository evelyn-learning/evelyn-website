/**
 * AP Macroeconomics — CED Unit 4.5: The Money Market.
 *
 * The money market diagram: vertical Money Supply (set by the Fed),
 * downward-sloping Money Demand, equilibrium nominal interest rate.
 * Uses the new money_market structured tool.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U4_MONEY_MARKET: LessonPlan = {
  id: 'evelyn.ap.macro.money-market.v1',
  title: 'The Money Market',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.money-market',
      description:
        'Construct the money market diagram with vertical Ms and downward-sloping Md, identify what shifts each curve, and predict the equilibrium nominal interest rate from given conditions.',
      standard: 'AP-MACRO-4.5',
    },
  ],
  prerequisites: ['apmacro.banking-money-creation'],
  followUps: ['apmacro.monetary-policy'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the money market as where interest rates are determined.',
      script:
        "Why is the federal funds rate 5 percent and not 1 or 12? Because that's where the supply of money meets the demand for money. The Fed sets supply; households and firms demand money for transactions and as a portfolio choice; their interaction in the money market determines the equilibrium nominal interest rate. This diagram is the engine for everything monetary policy does.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-money-market',
      kind: 'concept',
      goal: 'Cover the money market diagram, what shifts each curve, and equilibrium dynamics.',
      keyIdeas: [
        'AXES: y-axis is NOMINAL INTEREST RATE (i). x-axis is QUANTITY OF MONEY. AP convention.',
        'MONEY SUPPLY (Ms): VERTICAL line. Set by the Fed (or central bank); does not depend on the interest rate. The Fed controls how much money is in the system through reserve requirements, open-market operations, discount rate, and (modern) interest on reserves and ON RRP.',
        'MONEY DEMAND (Md): DOWNWARD-sloping. Why downward? At HIGHER interest rates, the OPPORTUNITY COST of holding money rises (you forgo more interest by holding cash/checking instead of bonds/savings). So people demand LESS money at higher i. At LOWER interest rates, the opportunity cost is small — people willingly hold more money for transactions and convenience.',
        'EQUILIBRIUM NOMINAL INTEREST RATE: where Ms intersects Md. At i*, the quantity of money supplied equals the quantity demanded.',
        'IF i > i*: quantity of money demanded < quantity supplied. People hold more money than they want; they buy bonds instead, pushing bond prices up and yields (= interest rates) DOWN. i moves toward i*.',
        'IF i < i*: quantity of money demanded > quantity supplied. People want more money than they hold; they sell bonds to get cash, pushing bond prices down and yields UP. i moves toward i*.',
        'WHAT SHIFTS Ms (the Fed\'s actions): EXPANSIONARY policy (Ms RIGHT) — Fed buys bonds (open-market purchase), lowers reserve requirement, lowers discount rate, lowers interest on reserves. CONTRACTIONARY (Ms LEFT) — opposite actions.',
        'WHAT SHIFTS Md: (a) REAL GDP — when the economy grows, more transactions happen, more money is needed → Md shifts RIGHT. Recession → Md LEFT. (b) PRICE LEVEL — higher prices require more nominal money for the same transactions → Md RIGHT. (c) PAYMENT TECHNOLOGY — easier electronic payments may reduce Md (less need to hold cash). (d) INTEREST-RATE EXPECTATIONS — though typically captured along the curve.',
        'EFFECT OF Ms SHIFT RIGHT: at unchanged Md, more money supply at the same demand → equilibrium i FALLS. Lower interest rates stimulate I (firms invest more), shifting AD RIGHT. This is how monetary policy works.',
        'EFFECT OF Ms SHIFT LEFT: equilibrium i RISES. Higher rates discourage I, shifting AD LEFT.',
      ],
      vocabulary: [
        { term: 'money supply (Ms)', definition: 'the total quantity of money set by the central bank; vertical in the money-market diagram.' },
        { term: 'money demand (Md)', definition: 'the quantity of money households and firms want to hold; downward-sloping in interest rate.' },
      ],
      suggestedTools: ['money_market'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-shift-ms',
      kind: 'worked_example',
      problem:
        'The Fed conducts an open-market PURCHASE of $20 billion in bonds. Trace the effect on the money market diagram, the equilibrium interest rate, and the resulting effect on aggregate demand.',
      steps: [
        'STEP 1 — Fed bond PURCHASE injects new reserves into the banking system (the Fed pays for the bonds with newly created reserves). This expands the money supply.',
        'STEP 2 — Ms SHIFTS RIGHTWARD on the money-market diagram. (Money multiplier amplifies the initial reserve injection; we don\'t need to compute the multiplier here.)',
        'STEP 3 — At new Ms, money supply > money demand at the original interest rate. People have more money than they want to hold; they buy bonds; bond prices rise; yields (interest rates) FALL.',
        'STEP 4 — NEW EQUILIBRIUM INTEREST RATE: lower than original. i* falls.',
        'STEP 5 — TRANSMISSION TO AD. Lower i means cheaper borrowing for firms (investment) and households (mortgages, durable goods). I rises; some C may rise. C and I together push AD RIGHTWARD on the AD-AS diagram.',
        'STEP 6 — RESULT in AD-AS: AD shifts right. Real GDP rises; price level rises; cyclical UE falls. This is how EXPANSIONARY MONETARY POLICY works in the AD-AS framework.',
      ],
      answer: 'Ms shifts right → equilibrium i falls → I and C rise → AD shifts right → Y↑, P↑, UR↓.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-shift-md',
      kind: 'try_yourself',
      problem:
        'For each event, identify what shifts in the money market (Ms or Md, left or right) and the resulting effect on the equilibrium nominal interest rate. (a) Real GDP grows 4%. (b) The Fed raises the reserve requirement. (c) The aggregate price level rises 3%. (d) A new payment technology lets people pay for everything with a quick mobile-app tap, reducing cash holdings.',
      expectedAnswer:
        '(a) "Real GDP grows": more transactions need money → Md shifts RIGHT. At higher Md with unchanged Ms, equilibrium i RISES. (b) "Higher RR": banks must hold more reserves and lend less → money multiplier shrinks → effective Ms decreases (shifts LEFT). With Md unchanged, equilibrium i RISES. (c) "Price level rises 3%": higher prices require more nominal money for same transactions → Md shifts RIGHT. With Ms unchanged, i RISES. (d) "Payment tech reduces cash holdings": at any interest rate, people demand LESS money → Md shifts LEFT. With Ms unchanged, i FALLS.',
      responseFormat: 'free',
      hints: [
        'Identify which curve is affected: Ms = central bank actions; Md = transactions volume / price level / tech.',
        'Direction follows: more demand or supply → identify which way each curve moves.',
        'Effect on equilibrium i depends on the shift direction.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-md-downward',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. Why does the money demand curve slope DOWNWARD? Use the concept of opportunity cost of holding money.',
      expectedAnswer:
        'Money demand slopes downward because the OPPORTUNITY COST OF HOLDING MONEY is the interest rate. When you hold money (cash, checking) instead of bonds or other interest-bearing assets, you give up the interest you could have earned. At HIGHER nominal interest rates, the opportunity cost of holding money is LARGER — people willingly hold less money (just enough for immediate transactions) and more interest-bearing assets. Md is LOW at high i. At LOWER nominal interest rates, the opportunity cost is SMALL — people willingly hold MORE money for convenience, transactions, and as a precautionary buffer, since the foregone interest is minimal. Md is HIGH at low i. As i falls along the y-axis, Q-money-demanded rises along the x-axis — a downward-sloping curve. Strong answers explicitly identify the opportunity cost as forgone interest, name the trade-off (money vs interest-bearing alternatives), and connect it to the slope.',
      responseFormat: 'frq',
      hints: [
        'What do you give up by holding money instead of bonds?',
        'How does that "given-up" amount change with the interest rate?',
        'Higher cost → people hold less of the costly thing.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Money market: Ms VERTICAL (Fed sets it); Md DOWNWARD (opp cost = i).',
        'Md slopes down because higher i means higher opp cost of holding money.',
        'Ms shifters: open-market ops, RR, discount rate, IOR — all Fed actions.',
        'Md shifters: real GDP, price level, payment technology.',
        'Ms RIGHT → equilibrium i FALLS → I rises → AD RIGHT (expansionary monetary).',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.5',
    cedTitle: 'The Money Market',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '15', note: 'OpenStax Macro AP — money market, Ms vs Md, equilibrium interest rate.' },
    ],
  },
};
