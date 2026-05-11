/**
 * AP Macroeconomics — Unit 4 CED 4.1: Financial Assets.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.financial-assets.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_FINANCIAL_ASSETS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.financial-assets.v1',
  course: 'AP Macroeconomics',
  cedUnit: 4,
  cedTopic: '4.1',
  cedTitle: 'Financial Assets',
  planId: 'evelyn.ap.macro.financial-assets.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-05-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.financial-assets.v1' }],
  theory: [
    { loId: 'apmacro.financial-assets', content: `FINANCIAL ASSET: a contract or claim that gives the holder a right to future payments. Includes stocks, bonds, bank deposits, money. Distinct from REAL ASSETS (physical things like land, machines, houses).` },
    { loId: 'apmacro.financial-assets', content: `STOCKS (equity): partial ownership claim in a corporation. Holder gets dividends if paid + capital gains/losses if price changes. HIGH expected return on average; HIGH risk. Volatile.` },
    { loId: 'apmacro.financial-assets', content: `BONDS (debt): a loan from holder to issuer. Issuer promises to repay principal plus periodic interest (coupon). Lower expected return than stocks; lower risk. Issuers: corporations, federal/state/local governments.` },
    { loId: 'apmacro.financial-assets', content: `MONEY (currency + bank deposits): most liquid asset. Lowest expected return (often zero or near-zero in checking accounts). Lowest risk in nominal terms; loses purchasing power if inflation rises (real-return risk).` },
    { loId: 'apmacro.financial-assets', content: `RISK-RETURN TRADEOFF: higher expected returns require accepting higher risk. Investors who want safe assets get lower returns. Investors who want high returns must tolerate higher volatility and potential losses. There is no "free lunch" — this is a foundational principle.` },
    { loId: 'apmacro.financial-assets', content: `LIQUIDITY: ease of converting an asset to cash without significant loss. Money is most liquid; stocks moderately liquid (sell on exchanges); houses much less liquid (months to sell). High-liquidity assets typically have lower returns (you pay for liquidity).` },
    { loId: 'apmacro.financial-assets', content: `BOND PRICE-YIELD INVERSE: when interest rates RISE, the price of EXISTING bonds FALLS. Why? A bond paying $50/year is more attractive when new bonds pay $40 than when new bonds pay $60. New bonds set the alternative; existing bond prices adjust to keep their yield competitive. Examples: a $1000 bond paying $50/year has a 5% yield. If the market rate rises to 6.25%, the bond price falls to $800 (so $50/$800 = 6.25%). AP frequently tests this inverse.` },
    { loId: 'apmacro.financial-assets', kind: 'definition', title: 'financial asset', content: `a contract giving the holder a right to future payments — stocks, bonds, money, deposits.` },
    { loId: 'apmacro.financial-assets', kind: 'definition', title: 'risk-return tradeoff', content: 'higher expected returns require accepting higher risk.' },
    { loId: 'apmacro.financial-assets', kind: 'definition', title: 'liquidity', content: 'ease of converting an asset to cash without loss.' },
    { loId: 'apmacro.financial-assets', kind: 'definition', title: 'bond yield', content: `the effective rate of return from holding a bond, typically inversely related to its price.` },
  ],
  methods: [
    {
      title: 'Worked bond price',
      steps: [
        'STEP 1 — YIELD definition: yield = annual interest payment / current bond price.',
        'STEP 2 — YIELD AT $1000: yield = $80 / $1000 = 0.08 = 8%.',
        `STEP 3 — YIELD AT $800: yield = $80 / $800 = 0.10 = 10%. (Lower price → higher yield, since the same $80 is now a larger fraction of a smaller investment.)`,
        `STEP 4 — WHY THE PRICE FELL: market interest rates rose. New bonds now offer higher yields (e.g. 10% from new issues). Existing bonds become less attractive at their old price; their prices fall until their YIELD matches the new market rate. Inverse relationship between bond price and bond yield.`,
        `STEP 5 — INTUITION. Bond prices and yields move OPPOSITE. If you hold a bond and rates rise, the bond LOSES value (capital loss). If rates fall, the bond GAINS value (capital gain). This is why bond investors care about Fed policy as much as stock investors.`,
      ],
      example: { problem: `A bond pays $80 of interest per year (a "coupon"). Its face value is $1000. (a) Compute its yield if its market price is $1000. (b) Compute its yield if its market price falls to $800. (c) Explain in one sentence why the price fell.`, solution: `Yield at $1000 = 8%. Yield at $800 = 10%. Price fell because market rates rose; existing bond prices adjusted downward so yields would match the new market rate.` },
      relatedLoIds: ['apmacro.financial-assets'],
    },
  ],
  pointers: [
    { content: `Stocks (equity, high return / risk), bonds (debt, moderate), money (lowest return / risk).`, kind: 'tip' },
    { content: `Risk-return tradeoff: higher expected returns require accepting more risk. No free lunch.`, kind: 'tip' },
    { content: 'Liquidity: ease of converting to cash. Money most liquid, real estate least.', kind: 'tip' },
    { content: `Bond price ↔ yield are INVERSELY related. Coupon is fixed; price moves to keep yield competitive.`, kind: 'tip' },
  ],
};
