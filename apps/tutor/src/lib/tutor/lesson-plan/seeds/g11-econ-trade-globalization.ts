/**
 * G11 — International trade and globalization.
 *
 * Comparative advantage, tariffs, free trade vs protectionism, NAFTA/
 * USMCA, WTO, modern trade tensions.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ECON_TRADE_GLOBALIZATION: LessonPlan = {
  id: 'evelyn.g11.econ.trade-globalization.v1',
  title: 'International trade and globalization',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'economics',
  locale: 'en',
  los: [
    {
      id: 'ncss.911.econ.global-trade',
      description: 'Analyze the economic and political impacts of international trade and globalization.',
      standard: 'NCSS.D2.Eco.14.9-12',
    },
  ],
  prerequisites: ['ncss.911.econ.supply-demand'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show how everyday products are global.',
      script: 'Look at your phone. Designed in California. Glass from Kentucky. Rare-earth metals from China. Assembled in Vietnam or India. Shipped on Korean container ships. ONE phone touches a dozen countries before reaching your hand.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-trade-mechanics',
      kind: 'concept',
      goal: 'Why countries trade, and the tools that govern trade.',
      keyIdeas: [
        'COMPARATIVE ADVANTAGE: a country should produce what it can make MOST efficiently relative to alternatives, and TRADE for the rest. Both countries gain.',
        'EXPORTS = goods/services SOLD to other countries. IMPORTS = goods BOUGHT from other countries.',
        'TARIFF: a tax on imports. Makes foreign goods more expensive. Protects domestic producers but raises consumer prices.',
        'FREE TRADE: low or no tariffs. More trade volume, lower prices, more competition. NAFTA (1994), now USMCA (2020), is North America\'s free-trade agreement.',
        'PROTECTIONISM: high tariffs/quotas. Protects local jobs but reduces overall efficiency and consumer welfare.',
        'WORLD TRADE ORGANIZATION (WTO, 1995): sets global rules for trade, resolves disputes between countries.',
        'GLOBALIZATION = increased flow of goods, services, capital, ideas, and people across borders. Began accelerating in the 1980s with deregulation, internet, and shipping containers.',
        'TRADEOFFS: cheaper goods + more variety vs lost manufacturing jobs in some countries + cultural homogenization concerns.',
      ],
      vocabulary: [
        { term: 'tariff', definition: 'a tax on imported goods.' },
        { term: 'comparative advantage', definition: 'producing what you make most efficiently relative to others.' },
        { term: 'globalization', definition: 'increasing interconnectedness of countries through trade and communication.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-comparative',
      kind: 'worked_example',
      problem: 'Country A makes 1 car or 100 bushels of wheat per worker. Country B makes 0.5 cars or 80 bushels per worker. Who should specialize in what?',
      steps: [
        'Compute opportunity costs.',
        'Country A: 1 car = 100 wheat. So 1 wheat = 0.01 cars.',
        'Country B: 0.5 cars = 80 wheat. So 1 car = 160 wheat. And 1 wheat = 0.00625 cars.',
        'Country A is BETTER at both — but COMPARATIVELY, Country B has lower opportunity cost for wheat (0.00625 < 0.01 cars per wheat).',
        'Country A should specialize in CARS (her comparative advantage). Country B should specialize in WHEAT.',
        'Then trade. Both end up with more total goods than going alone.',
      ],
      answer: 'A specializes in cars, B in wheat — both gain by trading',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A 25% tariff is added to imported steel. What likely happens to: (a) the price of cars made in your country, (b) employment in your steel industry?',
      expectedAnswer: 'car prices go up; steel employment goes up',
      responseFormat: 'free',
      hints: [
        '(a) Cars use steel. More expensive steel → more expensive cars.',
        '(b) Tariff makes foreign steel pricier → more demand for domestic steel → more steel jobs.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-trade-zero-sum',
      kind: 'misconception_check',
      question: 'Does international trade always have a "winner" and a "loser"?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating trade as zero-sum.',
          correctsTo: 'No — comparative advantage shows BOTH countries can gain. The pie GROWS. However, WITHIN each country, some workers lose (e.g., workers in industries that lose to imports), even as the country overall gains.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Comparative advantage: specialize in what you do best, trade for the rest.',
        'Tariffs protect domestic industries but raise consumer prices.',
        'WTO sets global trade rules.',
        'Globalization brings cheap goods + lost local jobs in some sectors.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why has US-China trade tension been a big political issue since 2018?',
      hint: 'Trade deficits with China, IP theft concerns, dependence on Chinese manufacturing during COVID, semiconductor competition. Tariffs imposed by both sides.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
