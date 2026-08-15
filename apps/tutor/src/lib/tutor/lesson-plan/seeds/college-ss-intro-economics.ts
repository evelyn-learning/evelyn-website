/**
 * College Intro — Intro Economics (combined micro + macro overview).
 *
 * Supply/demand, elasticity, market failure, GDP, inflation, monetary + fiscal policy.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SS_INTRO_ECONOMICS: LessonPlan = {
  id: 'evelyn.college.intro-economics.v1',
  title: 'Intro economics — micro + macro foundations',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'social-studies',
  topic: 'intro-economics',
  locale: 'en',
  los: [
    {
      id: 'college.econ',
      description: 'Apply supply/demand analysis; describe market failures, monetary and fiscal policy.',
      standard: 'COLLEGE-ECON',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame economics as the study of choice under scarcity — at individual and aggregate scale.',
      script: 'Economics in one sentence: people respond to incentives, in markets that often (but not always) coordinate well, in economies that fluctuate. Microeconomics is the choice level; macroeconomics is the aggregate level. Both rely on the same core trick: model behavior, predict, then check against data.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-econ',
      kind: 'concept',
      goal: 'Micro fundamentals + market failures + macro overview + policy.',
      keyIdeas: [
        'OPPORTUNITY COST: the value of the next-best alternative. Every choice has one.',
        'SUPPLY + DEMAND: D slopes down (lower price → higher quantity demanded), S slopes up. EQUILIBRIUM where they cross.',
        'ELASTICITY: % change in Q / % change in P. Inelastic (insulin): quantity barely responds. Elastic (luxury): quantity responds a lot.',
        'MARKET FAILURE: cases where free markets don\'t produce efficient outcomes. EXTERNALITIES (pollution: cost not in price). PUBLIC GOODS (lighthouse: nonexcludable, nonrival). MONOPOLY. INFORMATION ASYMMETRY (used cars: lemons problem).',
        'GDP: total output. Nominal vs real. Per capita gives living-standard proxy. Limits: ignores distribution, environment, household work.',
        'INFLATION: general price level rising. CPI measures it. Causes: demand > supply, supply shocks, expectations.',
        'BUSINESS CYCLES: expansions + recessions. Causes debated (demand shocks, supply shocks, financial fragility, monetary policy errors).',
        'MONETARY POLICY (Fed): adjusts interest rates + reserves to stabilize inflation + employment.',
        'FISCAL POLICY (Congress): government spending + taxes. Counter-cyclical in theory; constrained by politics in practice.',
      ],
      vocabulary: [
        { term: 'opportunity cost', definition: 'value of the next-best alternative forgone when making a choice.' },
        { term: 'externality', definition: 'cost or benefit of a transaction borne by third parties not involved in it.' },
        { term: 'monetary policy', definition: 'central-bank actions on interest rates and reserves to stabilize macroeconomy.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-tax',
      kind: 'worked_example',
      problem: 'A government taxes cigarettes to discourage smoking. Why does the price rise less than the tax for very-addicted smokers?',
      steps: [
        'Demand for cigarettes among addicted users is highly INELASTIC — quantity barely responds to price.',
        'When demand is inelastic, the BURDEN of the tax falls more on consumers than on producers.',
        'But quantity sold barely drops. So while price rises (close to full tax amount), quantity doesn\'t fall much.',
        'Result: tax revenue is high; behavioral effect is modest. To deter smoking effectively, taxes need to be very high — or paired with non-price interventions (counter-marketing, smoke-free zones).',
        'For ELASTIC demand goods (e.g., luxury watches), even small taxes shift quantity dramatically.',
      ],
      answer: 'Inelastic demand → consumers absorb most of the tax; quantity barely changes.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why do economists call pollution a "market failure" rather than a free-market success?',
      expectedAnswer: 'pollution is an externality — costs borne by people not part of the transaction; the market price doesn\'t reflect the social cost, leading to over-production',
      responseFormat: 'free',
      hints: [
        'Look for who bears costs vs who decides.',
        'When social cost ≠ private cost, prices give the wrong signal.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-gdp-welfare',
      kind: 'misconception_check',
      question: 'A student says: "Higher GDP means people are better off." What\'s wrong?',
      commonErrors: [
        {
          answer: 'because rich',
          misconception: 'Treating GDP as a welfare measure.',
          correctsTo: 'GDP measures market output. It IGNORES distribution (high GDP can coexist with poverty), unpaid work (childcare, eldercare), environmental costs (cutting down forests counts as GDP+), and quality (longer life with chronic illness counts as more healthcare spending). GDP correlates with welfare across countries broadly, but the metric is a proxy with serious limits. Better welfare measures: HDI, Genuine Progress Indicator, life-satisfaction surveys.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Opportunity cost is the right way to think about choices.',
        'Markets clear via S-D equilibrium; elasticity tells you who bears taxes / shocks.',
        'Markets fail with externalities, public goods, monopoly, information gaps.',
        'GDP measures output, NOT welfare.',
        'Monetary (Fed) + fiscal (Congress) policy together stabilize the macroeconomy.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
