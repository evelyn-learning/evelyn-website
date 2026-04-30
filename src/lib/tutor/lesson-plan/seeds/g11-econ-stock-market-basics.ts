/**
 * G11 — Stock market and personal finance basics.
 *
 * What stocks/bonds are, the time value of money, compound interest,
 * diversification. Personal finance literacy.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ECON_STOCK_MARKET_BASICS: LessonPlan = {
  id: 'evelyn.g11.econ.stock-market-personal-finance.v1',
  title: 'Stock market and personal finance basics',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'economics',
  locale: 'en',
  los: [
    {
      id: 'ncss.911.econ.personal-finance',
      description: 'Explain how individuals can save, invest, and manage risk through financial markets.',
      standard: 'NCSS.D2.Eco.13.9-12',
    },
  ],
  prerequisites: ['ncss.911.econ.supply-demand'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show compound interest as the secret weapon.',
      script: '$1000 invested at age 20 at 7% annual return → $14,974 by age 60 — without adding ANY more money. That\'s compound interest. The earlier you start, the more wildly it grows. Personal finance basics give you that head start.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-key-ideas',
      kind: 'concept',
      goal: 'Stocks/bonds + compound interest + diversification + risk.',
      keyIdeas: [
        'STOCK = a share of OWNERSHIP in a company. If the company grows, your share is worth more. Riskier but historically higher returns (~7% annualized for US stock market over 100 years).',
        'BOND = a LOAN to a government or company. They pay you interest, then return the principal. Less risky but lower returns (~3-5%).',
        'COMPOUND INTEREST: interest on interest. Year 1: $1000 + 7% = $1070. Year 2: $1070 + 7% = $1144.90. Each year compounds on the new total.',
        'RULE OF 72: years to DOUBLE your money ≈ 72 ÷ interest rate. At 7%: ~10 years. At 10%: ~7 years.',
        'DIVERSIFICATION: don\'t put all your money in one stock. Spread across many stocks (an index fund holds hundreds). If one tanks, others may rise. Reduces risk.',
        'INDEX FUND: a fund that tracks the whole market (e.g., S&P 500 holds 500 big US companies). Cheap, easy, automatically diversified. Most personal finance experts recommend.',
        'INFLATION: prices rise ~2-3% per year. If your money sits in a bank earning 0%, you LOSE purchasing power over time.',
        'RISK vs RETURN: higher potential returns come with higher risk. No "free lunch" in investing.',
      ],
      vocabulary: [
        { term: 'stock', definition: 'a share of ownership in a company.' },
        { term: 'bond', definition: 'a loan to a government or company that pays interest.' },
        { term: 'compound interest', definition: 'interest earned on previously-earned interest, growing exponentially.' },
        { term: 'diversification', definition: 'spreading investments across many assets to reduce risk.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-compound',
      kind: 'worked_example',
      problem: '$1000 invested at 7% annual interest. How much after 10, 20, 40 years?',
      steps: [
        'Year 10: $1000 × (1.07)¹⁰ ≈ $1000 × 1.967 ≈ $1967.',
        'Year 20: $1000 × (1.07)²⁰ ≈ $1000 × 3.870 ≈ $3870.',
        'Year 40: $1000 × (1.07)⁴⁰ ≈ $1000 × 14.97 ≈ $14,974.',
        'Notice: the longer the time, the more dramatic the growth. From year 20 to 40, money nearly QUADRUPLED — without adding a dollar.',
        'This is why financial advisors say "TIME is your biggest asset". Starting at 20 vs starting at 40 makes a huge difference.',
      ],
      answer: 'roughly $1967, $3870, $14,974',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Using the Rule of 72: at 6% annual return, roughly how many years to double your money?',
      expectedAnswer: '12 years',
      responseFormat: 'numeric',
      hints: [
        'Rule of 72: 72 ÷ rate.',
        '72 ÷ 6 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-stocks-too-risky',
      kind: 'misconception_check',
      question: 'Are stocks too risky for ordinary people, who should just keep money in a savings account?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating savings as the safe default.',
          correctsTo: 'Savings accounts give ~0-2% — LESS than inflation. So your money LOSES value sitting there. Diversified stock investments (like index funds) historically beat inflation by ~5%/year. Risk in the SHORT term is real, but for retirement savings 20+ years away, stocks are usually safer than the alternative.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Stocks = ownership; bonds = loans.',
        'Compound interest = exponential growth. Time matters most.',
        'Rule of 72: years to double ≈ 72 / rate.',
        'Diversify (index funds) to reduce risk.',
        'Inflation eats idle money — don\'t leave it all in savings long-term.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A 401(k) lets you invest pre-tax money for retirement. Why is that a big deal?',
      hint: 'Pre-tax means more money working for you immediately. Plus many employers MATCH some of your contributions — free money. Compounded over 30-40 years, this is enormous.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
