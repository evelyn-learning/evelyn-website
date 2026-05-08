/**
 * AP Macroeconomics — CED Unit 4.6: Monetary Policy.
 *
 * Tools the Fed uses to shift Ms: open-market operations, reserve
 * requirement, discount rate, interest on reserves. Expansionary vs
 * contractionary; transmission through money market into AD-AS.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U4_MONETARY_POLICY: LessonPlan = {
  id: 'evelyn.ap.macro.monetary-policy.v1',
  title: 'Monetary Policy',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.monetary-policy',
      description:
        'Identify the Fed\'s monetary-policy tools, distinguish expansionary from contractionary policy, trace the transmission mechanism through the money market and into AD-AS, and articulate the comparative advantages of monetary over fiscal policy.',
      standard: 'AP-MACRO-4.6',
    },
  ],
  prerequisites: ['apmacro.money-market'],
  followUps: ['apmacro.loanable-funds-market'],
  estimatedMinutes: 26,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame monetary policy as the central bank\'s lever for stabilization.',
      script:
        "When the Fed wants to fight a recession, it doesn't pass a stimulus bill. It changes the money supply through bond-market operations, and the resulting interest-rate change ripples through every borrowing, saving, and investment decision in the economy. Monetary policy is faster than fiscal policy and politically simpler. This is the central-bank toolkit.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-monetary-tools',
      kind: 'concept',
      goal: 'Cover the Fed\'s tools, expansionary vs contractionary direction, and transmission to AD.',
      keyIdeas: [
        'EXPANSIONARY MONETARY POLICY: Ms RIGHT → i↓ → I↑ → AD RIGHT. Used in recession. Goal: raise real GDP and reduce unemployment.',
        'CONTRACTIONARY MONETARY POLICY: Ms LEFT → i↑ → I↓ → AD LEFT. Used to fight inflation / cool overheating. Goal: reduce inflation pressure.',
        'TOOL 1 — OPEN-MARKET OPERATIONS (OMO): the Fed buys or sells government bonds. PURCHASE = injects reserves → Ms RIGHT (expansionary). SALE = withdraws reserves → Ms LEFT (contractionary). MOST FREQUENTLY USED tool. Daily Fed actions.',
        'TOOL 2 — RESERVE REQUIREMENT: the fraction of deposits banks must hold as reserves. LOWER RR → larger money multiplier → effective Ms RIGHT. HIGHER RR → smaller multiplier → effective Ms LEFT. Rarely changed in modern policy (last U.S. change to 0% in 2020).',
        'TOOL 3 — DISCOUNT RATE: the interest rate the Fed charges banks borrowing reserves directly from it. LOWER discount rate → easier for banks to borrow reserves → effectively expansionary signal. HIGHER discount rate → contractionary signal. Modern Fed uses this rate as a "ceiling" on the federal funds rate.',
        'TOOL 4 — INTEREST ON RESERVES (IOR): the rate the Fed pays banks for holding reserves. LOWER IOR → banks prefer lending to holding reserves → effective Ms RIGHT. HIGHER IOR → banks prefer holding reserves → Ms LEFT. Became a primary tool post-2008 when the Fed flooded reserves and needed a way to influence rates without draining them.',
        'TRANSMISSION MECHANISM (memorize this chain): Fed action → change in Ms → change in equilibrium i (via money market) → change in I (and C, via cost of consumer borrowing) → AD shift → change in real GDP, price level, and unemployment in AD-AS.',
        'COMPARATIVE ADVANTAGES OVER FISCAL: (1) FAST — Fed FOMC meets every 6 weeks; can act between meetings if urgent. Fiscal requires Congress (months to years). (2) APOLITICAL — central banks are typically independent (Fed governors are appointed for 14-year terms; not subject to direct political pressure). (3) INCREMENTAL — Fed can adjust rates 25 basis points at a time, adapt over months. Fiscal is one-shot legislation.',
        'LIMITATIONS: (a) ZERO LOWER BOUND — once nominal rates hit zero, Fed cannot cut further (some experiments with negative rates exist; controversial). The Fed used QE / forward guidance in 2008-2015 and 2020-2021 to push effective stimulus past the ZLB. (b) "PUSHING ON A STRING" in deep recessions — even at zero rates, weak loan demand can mute the transmission. (c) LAGS — typically 6-18 months from rate change to full economic effect.',
      ],
      vocabulary: [
        { term: 'expansionary monetary policy', definition: 'central-bank actions that increase the money supply and lower interest rates; shifts AD right.' },
        { term: 'open-market operations', definition: 'central-bank buying or selling of government bonds to expand or contract the money supply.' },
        { term: 'transmission mechanism', definition: 'the chain Fed action → Ms → i → I → AD by which monetary policy reaches the real economy.' },
      ],
      suggestedTools: ['money_market', 'aggregate_demand_supply'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-recession-policy',
      kind: 'worked_example',
      problem:
        'An economy is in a recessionary gap. The Fed wants to stimulate AD. (a) Identify which direction Ms should shift. (b) Identify TWO specific tools the Fed could use to achieve this. (c) Trace the transmission through the money market into AD-AS, identifying the effect on equilibrium i, on I, and on real GDP / price level / unemployment.',
      steps: [
        'STEP 1 — DIRECTION. To stimulate AD, the Fed wants AD to shift RIGHT, which requires lower interest rates, which requires Ms to shift RIGHT (expansionary).',
        'STEP 2 — TOOLS (any two): (i) OPEN-MARKET PURCHASE of government bonds. The Fed buys bonds from banks/dealers, paying with newly created reserves. Reserves rise → money multiplier expands money supply. (ii) LOWER THE DISCOUNT RATE. Cheaper for banks to borrow reserves directly from the Fed; banks more willing to lend out their excess reserves. (iii) LOWER THE RESERVE REQUIREMENT. Banks need fewer reserves per dollar of deposits → can lend more → larger effective money supply. (iv) LOWER INTEREST ON RESERVES. Less attractive for banks to hold reserves; they lend more.',
        'STEP 3 — MONEY MARKET TRANSMISSION. Ms shifts RIGHT. At unchanged Md, equilibrium nominal interest rate FALLS. People hold more money / fewer bonds; bond prices up; yields down.',
        'STEP 4 — I AND C RESPONSES. Lower i means cheaper borrowing for firms (investment) and households (mortgages, durable goods). I rises notably; C rises moderately for interest-rate-sensitive purchases.',
        'STEP 5 — AD-AS EFFECT. C and I rising shift AD RIGHT. New short-run equilibrium: real GDP UP, price level UP, cyclical unemployment DOWN. The recessionary gap narrows or closes.',
        'STEP 6 — TIMING. Effects appear gradually: rate change is immediate, but I responds over weeks-months as firms reassess projects. Full AD effect usually 6-18 months.',
      ],
      answer: 'Ms RIGHT (expansionary). Tools: open-market purchase + lower discount rate (or any 2 of OMO, RR, discount, IOR). Transmission: i↓ → I↑ → AD RIGHT → Y↑ P↑ UR↓.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-classify-tool',
      kind: 'try_yourself',
      problem:
        'For each Fed action, identify whether it is EXPANSIONARY or CONTRACTIONARY monetary policy. Briefly justify.',
      expectedAnswer:
        '(Sample scenarios.) (a) "Fed raises the federal funds rate target by 25 basis points": CONTRACTIONARY. Higher target rate signals tighter conditions; the Fed may sell bonds (Ms LEFT) or raise IOR to push rates up. AD will shift left. (b) "Fed sells $50B in Treasury bonds in open-market operations": CONTRACTIONARY. OMO sale withdraws reserves → Ms LEFT → i UP → AD LEFT. (c) "Fed lowers the discount rate from 2.5% to 1.5%": EXPANSIONARY. Cheaper for banks to borrow from the Fed; encourages lending → Ms RIGHT → i DOWN → AD RIGHT. (d) "Fed lowers IOR from 0.5% to 0.25%": EXPANSIONARY. Less attractive to hold reserves; banks lend more → Ms effectively RIGHT → i DOWN → AD RIGHT. (e) "Fed announces it will purchase $80B per month in Treasury bonds (quantitative easing)": EXPANSIONARY. Large-scale OMO purchase; floods reserves into banking system. Effective Ms RIGHT.',
      responseFormat: 'free',
      hints: [
        'Direction of action on Ms: expansionary = right, contractionary = left.',
        'Buy bonds = inject reserves. Sell = withdraw.',
        'Lower rates (discount, IOR) = expansionary signals.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-transmission',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. The Fed buys $100B in government bonds. Trace the FULL transmission mechanism: from the OMO purchase through the money market through the AD-AS framework. Be explicit about the variable that changes at each step.',
      expectedAnswer:
        'CHAIN (each link explicit): (1) Fed conducts OPEN-MARKET PURCHASE: pays $100B for bonds, crediting bank reserves. (2) BANK RESERVES rise by $100B. Banks now have excess reserves they don\'t want to hold idle. (3) THROUGH THE MONEY MULTIPLIER: banks lend out excess reserves; lent money is redeposited; second round lends again; etc. The money supply (Ms) shifts RIGHTWARD by up to multiplier × $100B (less in real-world due to cash leakage / excess reserves). (4) IN THE MONEY MARKET: at new Ms (rightward) and unchanged Md, the equilibrium NOMINAL INTEREST RATE FALLS. Why? At the original i, money supply > money demand; people convert excess money to bonds, pushing bond prices up and yields down. (5) LOWER NOMINAL i typically corresponds to LOWER REAL i (assuming inflation expectations stable). (6) LOWER REAL i affects INVESTMENT: firms now find more capital projects profitable (lower borrowing cost, higher net present value of projects). I rises. (7) LOWER REAL i also affects CONSUMPTION: households find mortgages and auto loans cheaper; durable-goods purchases increase. C rises. (8) HIGHER C AND I shift AGGREGATE DEMAND RIGHTWARD on the AD-AS diagram. (9) IN AD-AS short-run equilibrium: REAL GDP RISES, PRICE LEVEL RISES (along upward-sloping SRAS), CYCLICAL UNEMPLOYMENT FALLS. (10) IF the economy was in a recessionary gap, the gap narrows or closes. If at potential, this creates an inflationary gap. Strong answers walk through ALL steps with the explicit variable change at each link.',
      responseFormat: 'frq',
      hints: [
        'Chain: Fed action → reserves → Ms → i → I (and C) → AD → Y, P, UR.',
        'Each step has a specific cause-and-effect; identify them all.',
        'Don\'t skip the money-multiplier step.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Tools: OMO (most used), RR, discount rate, IOR.',
        'Expansionary: buy bonds / lower RR / lower discount / lower IOR → Ms RIGHT → i FALLS → I, C rise → AD RIGHT.',
        'Contractionary: opposite. Ms LEFT → i RISES → I, C fall → AD LEFT.',
        'Advantages over fiscal: faster, apolitical, incremental.',
        'Limitations: ZLB, pushing-on-a-string in deep recessions, 6-18 month lags.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.6',
    cedTitle: 'Monetary Policy',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '15', note: 'OpenStax Macro AP — Fed tools, transmission mechanism, monetary vs fiscal.' },
    ],
  },
};
