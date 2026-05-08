/**
 * AP Macroeconomics — CED Unit 4.1: Financial Assets.
 *
 * Stocks, bonds, money, and the risk-return tradeoff. Sets up the
 * vocabulary used throughout Unit 4.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U4_FINANCIAL_ASSETS: LessonPlan = {
  id: 'evelyn.ap.macro.financial-assets.v1',
  title: 'U4.1 Financial Assets',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.financial-assets',
      description:
        'Identify the major categories of financial assets (stocks, bonds, money), apply the risk-return tradeoff, and explain the inverse relationship between bond prices and bond yields.',
      standard: 'AP-MACRO-4.1',
    },
  ],
  prerequisites: ['apmacro.automatic-stabilizers'],
  followUps: ['apmacro.nominal-vs-real-interest-rates'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame financial assets as ways to store wealth.',
      script:
        "When you have money you don't need today, you can put it under a mattress, in a checking account, in a savings bond, in stocks, or buy a house. Each option is a financial choice with a different mix of risk, return, and liquidity. The financial-assets vocabulary lets us talk precisely about those tradeoffs — and macroeconomics needs that vocabulary to explain the money market and monetary policy.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-financial-assets',
      kind: 'concept',
      goal: 'Cover stocks, bonds, money, the risk-return tradeoff, and bond-price / bond-yield inverse relationship.',
      keyIdeas: [
        'FINANCIAL ASSET: a contract or claim that gives the holder a right to future payments. Includes stocks, bonds, bank deposits, money. Distinct from REAL ASSETS (physical things like land, machines, houses).',
        'STOCKS (equity): partial ownership claim in a corporation. Holder gets dividends if paid + capital gains/losses if price changes. HIGH expected return on average; HIGH risk. Volatile.',
        'BONDS (debt): a loan from holder to issuer. Issuer promises to repay principal plus periodic interest (coupon). Lower expected return than stocks; lower risk. Issuers: corporations, federal/state/local governments.',
        'MONEY (currency + bank deposits): most liquid asset. Lowest expected return (often zero or near-zero in checking accounts). Lowest risk in nominal terms; loses purchasing power if inflation rises (real-return risk).',
        'RISK-RETURN TRADEOFF: higher expected returns require accepting higher risk. Investors who want safe assets get lower returns. Investors who want high returns must tolerate higher volatility and potential losses. There is no "free lunch" — this is a foundational principle.',
        'LIQUIDITY: ease of converting an asset to cash without significant loss. Money is most liquid; stocks moderately liquid (sell on exchanges); houses much less liquid (months to sell). High-liquidity assets typically have lower returns (you pay for liquidity).',
        'BOND PRICE-YIELD INVERSE: when interest rates RISE, the price of EXISTING bonds FALLS. Why? A bond paying $50/year is more attractive when new bonds pay $40 than when new bonds pay $60. New bonds set the alternative; existing bond prices adjust to keep their yield competitive. Examples: a $1000 bond paying $50/year has a 5% yield. If the market rate rises to 6.25%, the bond price falls to $800 (so $50/$800 = 6.25%). AP frequently tests this inverse.',
      ],
      vocabulary: [
        { term: 'financial asset', definition: 'a contract giving the holder a right to future payments — stocks, bonds, money, deposits.' },
        { term: 'risk-return tradeoff', definition: 'higher expected returns require accepting higher risk.' },
        { term: 'liquidity', definition: 'ease of converting an asset to cash without loss.' },
        { term: 'bond yield', definition: 'the effective rate of return from holding a bond, typically inversely related to its price.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-bond-price',
      kind: 'worked_example',
      problem:
        'A bond pays $80 of interest per year (a "coupon"). Its face value is $1000. (a) Compute its yield if its market price is $1000. (b) Compute its yield if its market price falls to $800. (c) Explain in one sentence why the price fell.',
      steps: [
        'STEP 1 — YIELD definition: yield = annual interest payment / current bond price.',
        'STEP 2 — YIELD AT $1000: yield = $80 / $1000 = 0.08 = 8%.',
        'STEP 3 — YIELD AT $800: yield = $80 / $800 = 0.10 = 10%. (Lower price → higher yield, since the same $80 is now a larger fraction of a smaller investment.)',
        'STEP 4 — WHY THE PRICE FELL: market interest rates rose. New bonds now offer higher yields (e.g. 10% from new issues). Existing bonds become less attractive at their old price; their prices fall until their YIELD matches the new market rate. Inverse relationship between bond price and bond yield.',
        'STEP 5 — INTUITION. Bond prices and yields move OPPOSITE. If you hold a bond and rates rise, the bond LOSES value (capital loss). If rates fall, the bond GAINS value (capital gain). This is why bond investors care about Fed policy as much as stock investors.',
      ],
      answer: 'Yield at $1000 = 8%. Yield at $800 = 10%. Price fell because market rates rose; existing bond prices adjusted downward so yields would match the new market rate.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-classify-assets',
      kind: 'try_yourself',
      problem:
        'Rank these financial assets from MOST LIQUID to LEAST LIQUID, and briefly justify the ranking. Items: a savings bond, $200 in cash, shares of a publicly traded stock, a house, money in a checking account.',
      expectedAnswer:
        'Most → least liquid: (1) cash ($200) — already cash, no conversion needed. (2) checking account — withdraw cash on demand, fully liquid. (3) shares of publicly traded stock — sellable on exchanges in seconds, but at market-determined prices that may not match what you paid. (4) savings bond — can typically be redeemed but with a holding-period or early-redemption penalty; takes days to process. (5) house — months to sell, transaction costs (commissions, closing), large price spread between asking and offered. The ranking reflects how quickly and at what cost the asset converts to cash.',
      responseFormat: 'free',
      hints: [
        'Liquidity = how fast and how cheaply you can turn it into cash.',
        'Cash itself is the most liquid by definition.',
        'Real assets like houses are typically least liquid.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-risk-return',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. A young investor and a retiree both have $100,000 to invest. The young investor puts most of it in stocks; the retiree puts most of it in government bonds and money market accounts. (a) Explain the difference in choices using risk-return tradeoff reasoning. (b) Why might this allocation pattern be REVERSED in some cases (i.e., a retiree with more risk tolerance and a young person who is risk-averse)?',
      expectedAnswer:
        '(a) STOCKS have higher expected returns but higher risk (volatility, possible loss of principal). The young investor has a long TIME HORIZON — decades until retirement — which lets the volatility average out and provides time to recover from market drops. Higher expected return matters more than short-term volatility. The retiree has a SHORT TIME HORIZON and depends on the assets for current income. A market crash could reduce withdrawals dramatically. Bonds and money market accounts are SAFER (lower volatility, capital preservation) at the cost of lower expected return — the retiree pays this premium for stability. The risk-return tradeoff: each accepts risk in proportion to ability and need to bear it. (b) Reversals can occur when: (i) the retiree has substantial wealth beyond what is needed for current income — surplus can absorb stock-market risk without endangering basic living standards. (ii) the young person has a low risk tolerance personality, prioritizing certainty over expected return. (iii) the retiree expects to live long (30+ year retirement) — long horizon reappears, justifying some equity exposure. (iv) the young person has near-term need for the money (down payment within 3-5 years) — short effective horizon requires safety. Strong answers explicitly cite TIME HORIZON, RISK TOLERANCE, and PURPOSE of the funds.',
      responseFormat: 'frq',
      hints: [
        'Time horizon is the key variable.',
        'Higher expected return ≠ better choice for everyone.',
        'When does a retiree need risk tolerance, or a young person need safety?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-bond-price-yield',
      kind: 'misconception_check',
      question:
        "A student says: 'When interest rates go up, my bond's price goes up because it pays more interest.' What's wrong?",
      commonErrors: [
        {
          answer: "yes, that's right",
          misconception: 'Treating a bond as if its coupon adjusts to market rates. Existing bonds have a FIXED coupon set at issuance.',
          correctsTo:
            "WRONG. The student conflates the bond's COUPON (fixed at issuance) with the market YIELD. When interest rates rise, the existing bond's coupon stays the same (e.g., $50/year) — it doesn't pay more interest just because rates rose. What changes is the bond's PRICE: it FALLS, so that the fixed $50/year now represents a competitive yield against new bonds. Specifically: bond yield = coupon / price. If coupon is fixed and yield rises (to match market), price must FALL. Bond prices and interest rates / yields are INVERSELY related. AP frequently tests this; students who think bond prices rise with rates lose points reliably.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Stocks (equity, high return / risk), bonds (debt, moderate), money (lowest return / risk).',
        'Risk-return tradeoff: higher expected returns require accepting more risk. No free lunch.',
        'Liquidity: ease of converting to cash. Money most liquid, real estate least.',
        'Bond price ↔ yield are INVERSELY related. Coupon is fixed; price moves to keep yield competitive.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.1',
    cedTitle: 'Financial Assets',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '14', note: 'OpenStax Macro AP — financial markets, asset categories, bond pricing.' },
    ],
  },
};
