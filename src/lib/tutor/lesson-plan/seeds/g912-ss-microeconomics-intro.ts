/**
 * Grades 9-12 Social Studies — Microeconomics Intro.
 */

import type { LessonPlan } from '../types';

export const SEED_G912_SS_MICROECONOMICS_INTRO: LessonPlan = {
  id: 'evelyn.g912.ss.microeconomics-intro.v1',
  title: 'Grades 9-12 SS — Microeconomics Intro',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ss',
  topic: 'g912-ss',
  locale: 'en',
  los: [
    {
      id: 'g912.ss.microeconomics-intro',
      description: 'Identify core microeconomics concepts: supply, demand, equilibrium, elasticity, and market failures.',
      standard: 'NCSS 9-12 Production, Distribution, Consumption',
    },
  ],
  prerequisites: [],
  followUps: ['g912.ss.macroeconomics-intro'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Microeconomics studies how INDIVIDUAL people, firms, and markets make decisions — and the system that emerges.',
      script: 'Why does coffee cost $4? Why are there so many flavours of toothpaste? Why do gas stations seem to charge similar prices on the same block? Microeconomics answers all these. Today we drill the foundations.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-microeconomics',
      kind: 'concept',
      goal: 'Supply + demand + equilibrium + elasticity + market structures + failures.',
      keyIdeas: [
        'MICRO vs MACRO: micro = individual decisions, firms, specific markets. Macro = whole economy, GDP, unemployment.',
        'DEMAND: consumers\' willingness to buy. As price falls, quantity demanded usually rises (DEMAND CURVE slopes down).',
        'SUPPLY: producers\' willingness to sell. As price rises, quantity supplied rises (SUPPLY CURVE slopes up).',
        'EQUILIBRIUM: where supply meets demand. The market-clearing price. Shortage if price too low; surplus if too high.',
        'SHIFTS vs MOVEMENTS: a CHANGE IN PRICE moves along the curve. A CHANGE IN OTHER FACTORS (income, preferences, costs) shifts the entire curve.',
        'ELASTICITY: how responsive demand or supply is to price changes. Elastic: small price change → big quantity change (luxury goods). Inelastic: small price change → small quantity change (necessities like insulin).',
        'MARKET STRUCTURES:',
        '  PERFECT COMPETITION: many sellers, identical product, easy entry. (Wheat farming.)',
        '  MONOPOLY: one seller. (Older utility companies.)',
        '  OLIGOPOLY: a few sellers. (Phone carriers, airlines.)',
        '  MONOPOLISTIC COMPETITION: many sellers, differentiated products. (Restaurants, clothing.)',
        'MARKET FAILURES: when markets DON\'T allocate resources well.',
        '  Externalities (pollution affects bystanders).',
        '  Public goods (defence — free-rider problem).',
        '  Information asymmetry (used cars: seller knows more than buyer).',
        '  Monopolies (overcharge, underproduce).',
        'GOVERNMENT INTERVENTIONS: taxes, subsidies, regulations, antitrust laws — to address market failures.',
        'KEY ASSUMPTION: people respond to incentives. Higher prices discourage; subsidies encourage.',
      ],
      vocabulary: [
        { term: 'equilibrium', definition: 'price and quantity where supply equals demand.' },
        { term: 'elasticity', definition: 'how much quantity changes when price changes.' },
        { term: 'externality', definition: 'a cost or benefit affecting people not in the market transaction.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-shift',
      kind: 'worked_example',
      problem: 'Suppose flu season hits. What happens to the demand for flu shots?',
      steps: [
        'A flu outbreak doesn\'t change PRICES — it changes consumer PREFERENCE for flu shots.',
        'More people want flu shots regardless of price.',
        '→ DEMAND CURVE SHIFTS RIGHT (more demanded at every price).',
        'New equilibrium: HIGHER price AND HIGHER quantity than before.',
        'Compare with: a flu shot becoming cheaper would MOVE ALONG the same demand curve, not shift it.',
      ],
      answer: 'Demand curve shifts right; new equilibrium has higher price + quantity.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Is GASOLINE\'s demand likely ELASTIC or INELASTIC in the short run? Why?',
      expectedAnswer: 'Inelastic. People still need to drive to work, school, etc. — even when gas prices spike. Quantity changes little in response to price (in the short run). Long-run is more elastic as people buy efficient cars or carpool.',
      responseFormat: 'free',
      hints: [
        'How easily can people change their gas consumption short-term?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-supply-demand-mix',
      kind: 'misconception_check',
      question: 'A student says "if demand goes up, supply must go down." Is this right?',
      commonErrors: [
        {
          answer: 'Demand up → supply down',
          misconception: 'Confusing the relationship between supply and demand curves.',
          correctsTo: 'Supply and demand are SEPARATE curves. A change in demand doesn\'t reduce supply; it changes the EQUILIBRIUM. If demand rises, equilibrium price rises, and quantity SUPPLIED also rises (movement along the supply curve, not a shift). The two curves can shift independently. Be careful: changes in PRICE → movements along curves; changes in OTHER FACTORS → curve shifts.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Demand slopes down; supply slopes up; equilibrium is intersection.',
        'Price changes move along curves; other factors shift curves.',
        'Elasticity = responsiveness to price.',
        'Market structures: perfect competition, monopoly, oligopoly, monopolistic.',
        'Market failures: externalities, public goods, info asymmetry, monopolies.',
        'Government intervenes to address failures.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might the market PRODUCE TOO MUCH POLLUTION even with sensible buyers and sellers?',
      hint: 'POLLUTION is an EXTERNALITY — a cost imposed on people NOT IN the market transaction. The factory and consumer don\'t pay for harm to neighbours\' lungs or the climate. So they overproduce. Solutions: TAXES on polluters (internalise the cost), CAP-AND-TRADE permits, REGULATIONS limiting emissions. Market failures often need policy intervention to fix — pure markets can\'t handle externalities alone.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
