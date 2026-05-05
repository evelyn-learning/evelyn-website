/**
 * Grades 3-5 Social Studies — Economics Basics (Supply, Demand, Trade).
 */

import type { LessonPlan } from '../types';

export const SEED_G35_SS_ECONOMICS_BASICS: LessonPlan = {
  id: 'evelyn.g35.ss.economics-basics.v1',
  title: 'Grades 3-5 SS — Economics Basics',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ss',
  topic: 'g35-ss',
  locale: 'en',
  los: [
    {
      id: 'g35.ss.economics-basics',
      description: 'Identify basic economic ideas: supply, demand, trade, scarcity, choice; recognise how prices work.',
      standard: 'NCSS 3-5 Production, Distribution, Consumption',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'You make economic decisions every day — what to buy, what to save, what to trade.',
      script: 'You have $5. You see two things you want — a comic book ($4) or ice cream ($3). You can\'t buy both. That\'s ECONOMICS — making CHOICES with limited resources. Today we drill the basics.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-economics',
      kind: 'concept',
      goal: 'Five core ideas + how they connect.',
      keyIdeas: [
        'SCARCITY: there\'s never ENOUGH of everything for everyone. Resources are limited; wants are unlimited.',
        'CHOICE: scarcity forces choices. What do you give up to get something else? That\'s OPPORTUNITY COST.',
        'SUPPLY: how much of something is available. More apples in the orchard = more supply.',
        'DEMAND: how much of something people WANT to buy. More kids wanting a toy = more demand.',
        'PRICE responds to supply and demand:',
        '  - High supply, low demand → low price (think watermelon in summer).',
        '  - Low supply, high demand → high price (think the latest video game on launch day).',
        'TRADE: people swap goods or services to get what they want. Money is a tool for trade.',
        'GOODS: things you can touch (apples, books). SERVICES: things people DO for you (haircut, teaching).',
        'PRODUCERS: make goods or provide services. CONSUMERS: buy and use them.',
        'EVERY purchase is a CHOICE — choosing one thing means giving up others.',
      ],
      vocabulary: [
        { term: 'scarcity', definition: 'limited resources for unlimited wants.' },
        { term: 'opportunity cost', definition: 'what you GIVE UP to get something else.' },
        { term: 'supply', definition: 'how much of something is available.' },
        { term: 'demand', definition: 'how much of something people want to buy.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-supply-demand',
      kind: 'worked_example',
      problem: 'A new toy is released for the holidays. Many kids want it, but stores have only a few. What happens to the price?',
      steps: [
        'Demand: HIGH (many kids want it).',
        'Supply: LOW (only a few in stores).',
        'High demand + low supply → PRICE GOES UP.',
        'Stores might raise prices, or other sellers (like online resellers) charge more.',
        'After the holidays, demand drops or supply increases, and price comes down.',
      ],
      answer: 'High demand + low supply → high price.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You have $5. You can buy a toy ($5) OR save the money. What is your OPPORTUNITY COST if you buy the toy?',
      expectedAnswer: 'The savings (and whatever you might have bought later with the saved money). Opportunity cost = the next-best option you gave up.',
      responseFormat: 'free',
      hints: [
        'Opportunity cost = what you GIVE UP.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-greed',
      kind: 'misconception_check',
      question: 'A child says "raising prices when supply is low is just greed." Is this right?',
      commonErrors: [
        {
          answer: 'High prices = greed',
          misconception: 'Confusing market dynamics with moral failing.',
          correctsTo: 'Prices going up when supply is low is HOW MARKETS SIGNAL SCARCITY. Higher prices encourage producers to make more (incentive) and discourage some buyers (rationing). Without price signals, shortages get worse — first-come-first-served leaves later buyers empty-handed. There can be ETHICAL questions during emergencies (price gouging laws exist), but ordinary supply-demand pricing is the system working as designed.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Scarcity → choice → opportunity cost.',
        'Supply (available) + Demand (wanted) determine price.',
        'High demand + low supply → high price.',
        'Trade lets people get what they want; money is the tool.',
        'Goods (things) vs services (actions).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does TRADE between countries help everyone?',
      hint: 'Each country specialises in what it does well (or has lots of). The US grows lots of corn; Brazil grows lots of coffee; Saudi Arabia has lots of oil. By TRADING, each country gets things it doesn\'t produce well. Both sides win — they get more variety AND lower prices than if each country had to make everything itself. This is COMPARATIVE ADVANTAGE.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
