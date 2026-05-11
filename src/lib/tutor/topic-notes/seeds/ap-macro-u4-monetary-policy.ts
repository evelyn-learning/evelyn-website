/**
 * AP Macroeconomics — Unit 4 CED 4.6: Monetary Policy.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.monetary-policy.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_MONETARY_POLICY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.monetary-policy.v1',
  course: 'AP Macroeconomics',
  cedUnit: 4,
  cedTopic: '4.6',
  cedTitle: 'Monetary Policy',
  planId: 'evelyn.ap.macro.monetary-policy.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-05-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.monetary-policy.v1' }],
  theory: [
    { loId: 'apmacro.monetary-policy', content: `EXPANSIONARY MONETARY POLICY: Ms RIGHT → i↓ → I↑ → AD RIGHT. Used in recession. Goal: raise real GDP and reduce unemployment.` },
    { loId: 'apmacro.monetary-policy', content: `CONTRACTIONARY MONETARY POLICY: Ms LEFT → i↑ → I↓ → AD LEFT. Used to fight inflation / cool overheating. Goal: reduce inflation pressure.` },
    { loId: 'apmacro.monetary-policy', content: `TOOL 1 — OPEN-MARKET OPERATIONS (OMO): the Fed buys or sells government bonds. PURCHASE = injects reserves → Ms RIGHT (expansionary). SALE = withdraws reserves → Ms LEFT (contractionary). MOST FREQUENTLY USED tool. Daily Fed actions.` },
    { loId: 'apmacro.monetary-policy', content: `TOOL 2 — RESERVE REQUIREMENT: the fraction of deposits banks must hold as reserves. LOWER RR → larger money multiplier → effective Ms RIGHT. HIGHER RR → smaller multiplier → effective Ms LEFT. Rarely changed in modern policy (last U.S. change to 0% in 2020).` },
    { loId: 'apmacro.monetary-policy', content: `TOOL 3 — DISCOUNT RATE: the interest rate the Fed charges banks borrowing reserves directly from it. LOWER discount rate → easier for banks to borrow reserves → effectively expansionary signal. HIGHER discount rate → contractionary signal. Modern Fed uses this rate as a "ceiling" on the federal funds rate.` },
    { loId: 'apmacro.monetary-policy', content: `TOOL 4 — INTEREST ON RESERVES (IOR): the rate the Fed pays banks for holding reserves. LOWER IOR → banks prefer lending to holding reserves → effective Ms RIGHT. HIGHER IOR → banks prefer holding reserves → Ms LEFT. Became a primary tool post-2008 when the Fed flooded reserves and needed a way to influence rates without draining them.` },
    { loId: 'apmacro.monetary-policy', content: `TRANSMISSION MECHANISM (memorize this chain): Fed action → change in Ms → change in equilibrium i (via money market) → change in I (and C, via cost of consumer borrowing) → AD shift → change in real GDP, price level, and unemployment in AD-AS.` },
    { loId: 'apmacro.monetary-policy', content: `COMPARATIVE ADVANTAGES OVER FISCAL: (1) FAST — Fed FOMC meets every 6 weeks; can act between meetings if urgent. Fiscal requires Congress (months to years). (2) APOLITICAL — central banks are typically independent (Fed governors are appointed for 14-year terms; not subject to direct political pressure). (3) INCREMENTAL — Fed can adjust rates 25 basis points at a time, adapt over months. Fiscal is one-shot legislation.` },
    { loId: 'apmacro.monetary-policy', content: `LIMITATIONS: (a) ZERO LOWER BOUND — once nominal rates hit zero, Fed cannot cut further (some experiments with negative rates exist; controversial). The Fed used QE / forward guidance in 2008-2015 and 2020-2021 to push effective stimulus past the ZLB. (b) "PUSHING ON A STRING" in deep recessions — even at zero rates, weak loan demand can mute the transmission. (c) LAGS — typically 6-18 months from rate change to full economic effect.` },
    { loId: 'apmacro.monetary-policy', kind: 'definition', title: 'expansionary monetary policy', content: `central-bank actions that increase the money supply and lower interest rates; shifts AD right.` },
    { loId: 'apmacro.monetary-policy', kind: 'definition', title: 'open-market operations', content: `central-bank buying or selling of government bonds to expand or contract the money supply.` },
    { loId: 'apmacro.monetary-policy', kind: 'definition', title: 'transmission mechanism', content: `the chain Fed action → Ms → i → I → AD by which monetary policy reaches the real economy.` },
  ],
  methods: [
    {
      title: 'Worked recession policy',
      steps: [
        `STEP 1 — DIRECTION. To stimulate AD, the Fed wants AD to shift RIGHT, which requires lower interest rates, which requires Ms to shift RIGHT (expansionary).`,
        `STEP 2 — TOOLS (any two): (i) OPEN-MARKET PURCHASE of government bonds. The Fed buys bonds from banks/dealers, paying with newly created reserves. Reserves rise → money multiplier expands money supply. (ii) LOWER THE DISCOUNT RATE. Cheaper for banks to borrow reserves directly from the Fed; banks more willing to lend out their excess reserves. (iii) LOWER THE RESERVE REQUIREMENT. Banks need fewer reserves per dollar of deposits → can lend more → larger effective money supply. (iv) LOWER INTEREST ON RESERVES. Less attractive for banks to hold reserves; they lend more.`,
        `STEP 3 — MONEY MARKET TRANSMISSION. Ms shifts RIGHT. At unchanged Md, equilibrium nominal interest rate FALLS. People hold more money / fewer bonds; bond prices up; yields down.`,
        `STEP 4 — I AND C RESPONSES. Lower i means cheaper borrowing for firms (investment) and households (mortgages, durable goods). I rises notably; C rises moderately for interest-rate-sensitive purchases.`,
        `STEP 5 — AD-AS EFFECT. C and I rising shift AD RIGHT. New short-run equilibrium: real GDP UP, price level UP, cyclical unemployment DOWN. The recessionary gap narrows or closes.`,
        `STEP 6 — TIMING. Effects appear gradually: rate change is immediate, but I responds over weeks-months as firms reassess projects. Full AD effect usually 6-18 months.`,
      ],
      example: { problem: `An economy is in a recessionary gap. The Fed wants to stimulate AD. (a) Identify which direction Ms should shift. (b) Identify TWO specific tools the Fed could use to achieve this. (c) Trace the transmission through the money market into AD-AS, identifying the effect on equilibrium i, on I, and on real GDP / price level / unemployment.`, solution: `Ms RIGHT (expansionary). Tools: open-market purchase + lower discount rate (or any 2 of OMO, RR, discount, IOR). Transmission: i↓ → I↑ → AD RIGHT → Y↑ P↑ UR↓.` },
      relatedLoIds: ['apmacro.monetary-policy'],
    },
  ],
  pointers: [
    { content: 'Tools: OMO (most used), RR, discount rate, IOR.', kind: 'tip' },
    { content: `Expansionary: buy bonds / lower RR / lower discount / lower IOR → Ms RIGHT → i FALLS → I, C rise → AD RIGHT.`, kind: 'tip' },
    { content: 'Contractionary: opposite. Ms LEFT → i RISES → I, C fall → AD LEFT.', kind: 'tip' },
    { content: 'Advantages over fiscal: faster, apolitical, incremental.', kind: 'tip' },
    { content: 'Limitations: ZLB, pushing-on-a-string in deep recessions, 6-18 month lags.', kind: 'tip' },
  ],
};
