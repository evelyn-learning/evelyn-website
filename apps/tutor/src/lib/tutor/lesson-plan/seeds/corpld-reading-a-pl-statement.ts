/**
 * Corporate Learning & Development — How to Read a P&L Statement.
 *
 * Short demo lesson for a working professional (manager) who just
 * received the monthly income statement (P&L) and wants to understand
 * what it's telling them: the top-to-bottom line structure, margin
 * percentages, and how to reason about two companies with very
 * different revenue/margin shapes. Business framing throughout — no
 * classroom or homework references. Resolves under the existing
 * college / social-studies / intro-economics taxonomy cell; the
 * corporate label is applied via the demo tile's display text.
 */

import type { LessonPlan } from '../types';

export const SEED_CORPLD_READING_A_PL_STATEMENT: LessonPlan = {
  id: 'evelyn.college.corpld.reading-a-pl-statement.v1',
  title: 'How to Read a P&L Statement',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'social-studies',
  topic: 'intro-economics',
  locale: 'en',
  los: [
    {
      id: 'college.corpld.pl-statement',
      description: 'Read and interpret a company income statement (P&L): compute gross profit, operating income, and net income; compute and interpret gross and operating margin percentages; and reason about what margin differences reveal about business health.',
      standard: 'COLLEGE-BIZ-PL-STATEMENT',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 10,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the lesson around a real moment: the P&L just landed in your inbox and you need to know what it means.',
      script: 'Your finance team just sent this month\'s P&L. It\'s a page of numbers — revenue, some deductions, a few subtotals, a final number at the bottom. What is it actually telling you? By the end of this, you\'ll be able to read that page top to bottom and know exactly what each line means and what to ask about next.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-income-statement',
      kind: 'concept',
      goal: 'Build the income statement top to bottom, explaining what each line represents in plain business language.',
      keyIdeas: [
        'REVENUE (the "top line"): all money earned from selling your product or service, before any costs are subtracted.',
        'COGS — Cost of Goods Sold: the direct costs of producing or delivering what was sold (materials, direct labor, hosting costs for a software product). Costs that scale with each unit sold.',
        'GROSS PROFIT = Revenue − COGS. What\'s left after covering the direct cost of making the thing you sold.',
        'OPERATING EXPENSES (OpEx): costs of running the business that aren\'t tied to a specific unit sold — sales and marketing salaries, admin, rent, R&D, software licenses.',
        'OPERATING INCOME, also called EBIT (Earnings Before Interest and Taxes) = Gross Profit − Operating Expenses. Profit from the core business, before financing and tax effects.',
        'NET INCOME (the "bottom line") = Operating Income − interest expense − taxes (± other non-operating items). What\'s left for the owners/shareholders.',
        'Quick check: if Revenue is $500,000 and COGS is $200,000, Gross Profit is $300,000.',
      ],
      vocabulary: [
        { term: 'revenue', definition: 'total money earned from sales, before any costs are subtracted.' },
        { term: 'COGS', definition: 'Cost of Goods Sold — the direct costs of producing or delivering what was sold.' },
        { term: 'gross profit', definition: 'Revenue minus COGS.' },
        { term: 'operating income (EBIT)', definition: 'Gross Profit minus Operating Expenses — profit from core operations before interest and taxes.' },
        { term: 'net income', definition: 'the final "bottom line" profit after interest, taxes, and other items.' },
      ],
      suggestedTools: ['show_table', 'show_diagram'],
      estimatedMinutes: 1.5,
    },
    {
      id: 'try-gross-profit',
      kind: 'try_yourself',
      problem: 'Quick math: last month, revenue was $500,000 and COGS was $200,000. What was gross profit?',
      expectedAnswer: '$300,000',
      responseFormat: 'numeric',
      hints: ['Gross profit = Revenue − COGS.'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-margins',
      kind: 'concept',
      goal: 'Introduce gross margin % and operating margin %, and explain why a percentage reveals something a dollar figure hides.',
      keyIdeas: [
        'GROSS MARGIN % = Gross Profit ÷ Revenue. Tells you what share of every sales dollar is left after direct costs.',
        'OPERATING MARGIN % = Operating Income ÷ Revenue. Tells you what share is left after ALL running costs, before interest and taxes.',
        'Dollar figures alone don\'t compare across companies of different sizes. A $1M gross profit sounds big, but on $20M revenue that\'s a thin 5% margin — on $2M revenue it\'s a strong 50%.',
        'Margins also reveal trend: a company can grow revenue every year while margins quietly shrink — a warning sign raw dollar totals can hide.',
      ],
      vocabulary: [
        { term: 'gross margin', definition: 'gross profit expressed as a percentage of revenue.' },
        { term: 'operating margin', definition: 'operating income expressed as a percentage of revenue.' },
      ],
      suggestedTools: ['show_stats'],
      estimatedMinutes: 1.5,
    },
    {
      id: 'try-margin',
      kind: 'try_yourself',
      problem: 'Using last month\'s numbers — Revenue $500,000, Gross Profit $300,000 — what\'s the gross margin percentage?',
      expectedAnswer: '60%',
      responseFormat: 'numeric',
      hints: ['Gross margin % = Gross Profit ÷ Revenue.', '$300,000 ÷ $500,000 = 0.60.'],
      estimatedMinutes: 1,
    },
    {
      id: 'worked-two-companies',
      kind: 'worked_example',
      problem: 'Two companies, side by side. Company A: $10M revenue, $200K net income (2% net margin). Company B: $2M revenue, $400K net income (20% net margin). Which is the healthier business, and what would you want to know next?',
      steps: [
        'Company A has 5x the revenue of Company B, but converts only about 2 cents of every sales dollar into profit.',
        'Company B has one-fifth the revenue, but converts about 20 cents of every sales dollar into profit — roughly 10x the margin.',
        'On raw profit dollars, A and B land in the same rough range ($200K–$400K) despite very different sizes — margin, not revenue, explains why.',
        'A thin margin isn\'t automatically bad: A could be a scale business (grocery, distribution) where thin margins are normal, or it could be investing heavily in growth. A fat margin isn\'t automatically great either — B could simply be small because it hasn\'t found a way to grow yet.',
        'What you\'d want to know next: is each company\'s margin normal for its industry? Is the margin trending up or down over time? How much cash does each generate, and how much debt does each carry?',
      ],
      answer: 'Company B is healthier on profitability alone (20% vs 2% net margin), but the full answer depends on industry norms, the margin trend over time, and each company\'s cash and debt position — not just one month\'s snapshot.',
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-profit-vs-cash',
      kind: 'misconception_check',
      question: 'A manager sees "$300,000 in Net Income" on this month\'s P&L and assumes that means there\'s $300,000 sitting in the company bank account. Is that right?',
      commonErrors: [
        {
          answer: 'Yes — net income is the cash the company has.',
          misconception: 'Confusing accounting profit with actual cash in the bank.',
          correctsTo: 'Net income is an ACCOUNTING figure, not a cash figure. Revenue is often recorded when a sale is made, not when the cash actually arrives (a customer invoiced this month might not pay for 60 days). Some items baked into net income, like depreciation, are non-cash expenses. And net income doesn\'t reflect cash spent on things like loan repayments or new equipment purchases (capital expenditures) — those don\'t appear on the P&L at all. To see actual cash movement, you need a separate report: the cash flow statement.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Income statement flow: Revenue → (− COGS) → Gross Profit → (− OpEx) → Operating Income (EBIT) → (− interest, taxes) → Net Income.',
        'Gross margin % and operating margin % show profitability per sales dollar — more useful for comparison than raw dollar figures.',
        'A high-revenue, thin-margin company and a low-revenue, fat-margin company can both be reasonable businesses — margin trend and industry context matter more than either number alone.',
        'Net income is an accounting figure, not a cash balance — check the cash flow statement for actual cash movement.',
      ],
      estimatedMinutes: 0.5,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Where does EBITDA fit into all this, and why do so many finance teams report it separately from Operating Income?',
      hint: 'EBITDA = Earnings Before Interest, Taxes, Depreciation, and Amortization. It starts from operating income and adds back depreciation and amortization — non-cash expenses that spread the cost of past capital purchases (equipment, software) over many years. Because it strips out those non-cash and financing effects, EBITDA is often used to compare the underlying operating performance of companies with different capital structures or asset bases. But it also excludes real costs — that equipment does eventually need replacing — so it\'s a useful lens, not a substitute for net income.',
      estimatedMinutes: 0.5,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
