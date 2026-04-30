/**
 * G11 — Economics: Supply and demand.
 *
 * The most-fundamental tool in economics. Demand curve (price ↑ →
 * quantity demanded ↓), supply curve (price ↑ → quantity supplied
 * ↑), equilibrium where they cross. Shifts vs movements along.
 * Surplus and shortage as out-of-equilibrium conditions.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ECON_SUPPLY_DEMAND: LessonPlan = {
  id: 'evelyn.g11.ss.econ.supply-demand.v1',
  title: 'Supply and Demand',
  curriculum: 'state-standards',
  grade: '11',
  subject: 'social-studies',
  topic: 'economics',
  locale: 'en',
  los: [
    {
      id: 'ss.g11.econ.supply-demand',
      description: 'Explain how supply and demand interact to determine prices in a market.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor on a price you\'ve seen change.',
      script: 'Why is gas $4 some weeks and $3 other weeks? Why do concert tickets cost more during a hot tour? Why did toilet paper cost double in March 2020? Almost every price you encounter is set by the same two forces: how much sellers will offer (supply) and how much buyers want to pay (demand). Understanding those two curves explains a huge part of economics.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-supply-demand',
      kind: 'concept',
      goal: 'Demand curve, supply curve, equilibrium, shifts vs movements.',
      keyIdeas: [
        'DEMAND: as price rises, buyers want LESS. Demand curve slopes DOWN.',
        'SUPPLY: as price rises, sellers offer MORE. Supply curve slopes UP.',
        'EQUILIBRIUM: where demand and supply curves cross. Equilibrium price = price that clears the market (no surplus, no shortage).',
        'On a graph: x-axis = quantity, y-axis = price. Demand curve declines left-to-right; supply curve rises.',
        'MOVEMENT ALONG a curve: caused by a price change ALONE (other things equal).',
        'SHIFT of a curve: caused by something OTHER than price.',
        '  DEMAND SHIFTERS: changes in income, tastes, prices of related goods (substitutes/complements), expectations, number of buyers.',
        '  SUPPLY SHIFTERS: changes in input costs, technology, weather (for ag), number of sellers, expectations.',
        'OUT OF EQUILIBRIUM:',
        '  Price ABOVE equilibrium → quantity supplied > quantity demanded → SURPLUS. Sellers cut prices.',
        '  Price BELOW equilibrium → quantity demanded > quantity supplied → SHORTAGE. Sellers raise prices.',
        '  Markets tend toward equilibrium.',
        'ELASTICITY: how SENSITIVE quantity is to price.',
        '  ELASTIC: small price change → big quantity change (luxury goods, easy substitutes).',
        '  INELASTIC: small price change → small quantity change (necessities, gasoline short-term).',
      ],
      vocabulary: [
        { term: 'demand', definition: 'how much buyers will buy at each price.' },
        { term: 'supply', definition: 'how much sellers will offer at each price.' },
        { term: 'equilibrium', definition: 'price where supply meets demand.' },
        { term: 'surplus', definition: 'quantity supplied exceeds quantity demanded.' },
        { term: 'shortage', definition: 'quantity demanded exceeds quantity supplied.' },
      ],
      suggestedTools: ['show_function_graph', 'show_concept_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-shift',
      kind: 'worked_example',
      problem: 'A new study reports that almonds are healthier than expected. What happens to the almond market?',
      steps: [
        'STEP 1: identify which curve shifts. The study changes BUYER preferences (taste/info) — that\'s a DEMAND shifter.',
        'STEP 2: which direction? Buyers want MORE almonds at every price → demand curve shifts RIGHT.',
        'STEP 3: new equilibrium. Demand right-shift → both equilibrium PRICE rises AND equilibrium QUANTITY rises.',
        'INTUITION: more buyers competing for the same supply pushes price up; sellers respond by producing more.',
      ],
      answer: 'Demand shifts right; price ↑, quantity ↑',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-supply-shift',
      kind: 'worked_example',
      problem: 'A drought damages the corn harvest. What happens to the corn market?',
      steps: [
        'Drought is a SUPPLY shifter (input/condition for production).',
        'Less corn available at every price → supply curve shifts LEFT.',
        'New equilibrium: PRICE rises, QUANTITY falls.',
        'INTUITION: scarcer corn → buyers compete and pay more; less corn ends up being sold.',
      ],
      answer: 'Supply shifts left; price ↑, quantity ↓',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A government caps gasoline prices BELOW the equilibrium. What\'s the predictable result?',
      expectedAnswer: 'Shortage — long lines, empty stations.',
      responseFormat: 'free',
      hints: [
        'Price below equilibrium means quantity demanded > supplied.',
        'That\'s a shortage.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-shift-along',
      kind: 'misconception_check',
      question: 'Sage says "If price rises, demand falls." What\'s the precise wording issue?',
      commonErrors: [
        {
          answer: 'sounds right',
          misconception: 'Confusing "movement along the demand curve" with a demand shift.',
          correctsTo: 'A price change causes movement ALONG the demand curve — quantity demanded falls. The DEMAND CURVE itself doesn\'t shift just because of price. Demand shifts only when something OTHER than price changes (income, tastes, etc.). Sage means "quantity demanded falls", not "demand falls".',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Demand: down-sloping. Supply: up-sloping.',
        'Equilibrium where they cross — clears the market.',
        'Shifters: demand (income/tastes/related goods), supply (costs/tech/weather).',
        'Surplus = price too high. Shortage = price too low.',
        'Movement along ≠ shift of curve. Price change moves along; other change shifts.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did toilet paper face shortages in early 2020 during COVID?',
      hint: 'Demand SHIFTED right (everyone stocking up). Supply was relatively fixed in the short run. Stores had price-stability rules so they didn\'t raise prices to match — result: shortage at fixed prices.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
