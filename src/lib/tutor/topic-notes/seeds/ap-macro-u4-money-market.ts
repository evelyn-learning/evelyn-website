/**
 * AP Macroeconomics — Unit 4 CED 4.5: The Money Market.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.money-market.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_MONEY_MARKET: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.money-market.v1',
  course: 'AP Macroeconomics',
  cedUnit: 4,
  cedTopic: '4.5',
  cedTitle: 'The Money Market',
  planId: 'evelyn.ap.macro.money-market.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-05-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.money-market.v1' }],
  theory: [
    { loId: 'apmacro.money-market', content: `AXES: y-axis is NOMINAL INTEREST RATE (i). x-axis is QUANTITY OF MONEY. AP convention.` },
    { loId: 'apmacro.money-market', content: `MONEY SUPPLY (Ms): VERTICAL line. Set by the Fed (or central bank); does not depend on the interest rate. The Fed controls how much money is in the system through reserve requirements, open-market operations, discount rate, and (modern) interest on reserves and ON RRP.` },
    { loId: 'apmacro.money-market', content: `MONEY DEMAND (Md): DOWNWARD-sloping. Why downward? At HIGHER interest rates, the OPPORTUNITY COST of holding money rises (you forgo more interest by holding cash/checking instead of bonds/savings). So people demand LESS money at higher i. At LOWER interest rates, the opportunity cost is small — people willingly hold more money for transactions and convenience.` },
    { loId: 'apmacro.money-market', content: `EQUILIBRIUM NOMINAL INTEREST RATE: where Ms intersects Md. At i*, the quantity of money supplied equals the quantity demanded.` },
    { loId: 'apmacro.money-market', content: `IF i > i*: quantity of money demanded < quantity supplied. People hold more money than they want; they buy bonds instead, pushing bond prices up and yields (= interest rates) DOWN. i moves toward i*.` },
    { loId: 'apmacro.money-market', content: `IF i < i*: quantity of money demanded > quantity supplied. People want more money than they hold; they sell bonds to get cash, pushing bond prices down and yields UP. i moves toward i*.` },
    { loId: 'apmacro.money-market', content: `WHAT SHIFTS Ms (the Fed's actions): EXPANSIONARY policy (Ms RIGHT) — Fed buys bonds (open-market purchase), lowers reserve requirement, lowers discount rate, lowers interest on reserves. CONTRACTIONARY (Ms LEFT) — opposite actions.` },
    { loId: 'apmacro.money-market', content: `WHAT SHIFTS Md: (a) REAL GDP — when the economy grows, more transactions happen, more money is needed → Md shifts RIGHT. Recession → Md LEFT. (b) PRICE LEVEL — higher prices require more nominal money for the same transactions → Md RIGHT. (c) PAYMENT TECHNOLOGY — easier electronic payments may reduce Md (less need to hold cash). (d) INTEREST-RATE EXPECTATIONS — though typically captured along the curve.` },
    { loId: 'apmacro.money-market', content: `EFFECT OF Ms SHIFT RIGHT: at unchanged Md, more money supply at the same demand → equilibrium i FALLS. Lower interest rates stimulate I (firms invest more), shifting AD RIGHT. This is how monetary policy works.` },
    { loId: 'apmacro.money-market', content: `EFFECT OF Ms SHIFT LEFT: equilibrium i RISES. Higher rates discourage I, shifting AD LEFT.` },
    { loId: 'apmacro.money-market', kind: 'definition', title: 'money supply (Ms)', content: `the total quantity of money set by the central bank; vertical in the money-market diagram.` },
    { loId: 'apmacro.money-market', kind: 'definition', title: 'money demand (Md)', content: `the quantity of money households and firms want to hold; downward-sloping in interest rate.` },
  ],
  methods: [
    {
      title: 'Worked shift ms',
      steps: [
        `STEP 1 — Fed bond PURCHASE injects new reserves into the banking system (the Fed pays for the bonds with newly created reserves). This expands the money supply.`,
        `STEP 2 — Ms SHIFTS RIGHTWARD on the money-market diagram. (Money multiplier amplifies the initial reserve injection; we don't need to compute the multiplier here.)`,
        `STEP 3 — At new Ms, money supply > money demand at the original interest rate. People have more money than they want to hold; they buy bonds; bond prices rise; yields (interest rates) FALL.`,
        'STEP 4 — NEW EQUILIBRIUM INTEREST RATE: lower than original. i* falls.',
        `STEP 5 — TRANSMISSION TO AD. Lower i means cheaper borrowing for firms (investment) and households (mortgages, durable goods). I rises; some C may rise. C and I together push AD RIGHTWARD on the AD-AS diagram.`,
        `STEP 6 — RESULT in AD-AS: AD shifts right. Real GDP rises; price level rises; cyclical UE falls. This is how EXPANSIONARY MONETARY POLICY works in the AD-AS framework.`,
      ],
      example: { problem: `The Fed conducts an open-market PURCHASE of $20 billion in bonds. Trace the effect on the money market diagram, the equilibrium interest rate, and the resulting effect on aggregate demand.`, solution: `Ms shifts right → equilibrium i falls → I and C rise → AD shifts right → Y↑, P↑, UR↓.` },
      relatedLoIds: ['apmacro.money-market'],
    },
  ],
  pointers: [
    { content: 'Money market: Ms VERTICAL (Fed sets it); Md DOWNWARD (opp cost = i).', kind: 'tip' },
    { content: 'Md slopes down because higher i means higher opp cost of holding money.', kind: 'tip' },
    { content: 'Ms shifters: open-market ops, RR, discount rate, IOR — all Fed actions.', kind: 'tip' },
    { content: 'Md shifters: real GDP, price level, payment technology.', kind: 'tip' },
    { content: 'Ms RIGHT → equilibrium i FALLS → I rises → AD RIGHT (expansionary monetary).', kind: 'tip' },
  ],
};
