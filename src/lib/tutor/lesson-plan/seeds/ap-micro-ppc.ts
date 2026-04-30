/**
 * AP Microeconomics — Production Possibilities Curve and opportunity
 * cost.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_MICRO_PPC: LessonPlan = {
  id: 'evelyn.ap.micro.production-possibilities.v1',
  title: 'Production possibilities and opportunity cost',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'economics',
  locale: 'en',
  los: [
    {
      id: 'apmicro.ppc',
      description: 'Apply the production possibilities curve to analyze opportunity cost and efficiency.',
      standard: 'AP-MICRO-1.2',
    },
  ],
  prerequisites: ['ncss.911.econ.supply-demand'],
  followUps: ['apmicro.externalities'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Trade-offs are unavoidable.',
      script: 'You have one Saturday. You can study, work, or hang out with friends — but not all three at once. Every choice means giving something up. That OPPORTUNITY COST is the foundation of all economics.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-ppc',
      kind: 'concept',
      goal: 'PPC + opportunity cost + efficiency + shifts.',
      keyIdeas: [
        'PRODUCTION POSSIBILITIES CURVE (PPC): graph showing the maximum combinations of two goods an economy can produce with given resources.',
        'POINTS ON the curve = EFFICIENT (using all resources fully).',
        'INSIDE the curve = INEFFICIENT (resources idle or misallocated).',
        'OUTSIDE the curve = UNATTAINABLE with current resources.',
        'OPPORTUNITY COST: what you GIVE UP to get something else. Slope of the PPC at a point = the trade-off.',
        'BOWED-OUT (concave) PPC: increasing opportunity cost. Why? Resources aren\'t equally good for all uses. Shifting more land from corn to cars eventually means using land that\'s much better for corn — high cost in corn for each extra car.',
        'STRAIGHT-LINE PPC: constant opportunity cost (resources interchangeable).',
        'SHIFTS:',
        '  OUTWARD: new resources, technology, education → can produce more of both. Economic growth.',
        '  INWARD: disaster, war, resource depletion → can produce less.',
        '  ASYMMETRIC: tech improvement in one good only shifts that axis out, not the other.',
        'COMPARATIVE ADVANTAGE: produce what you have LOWER opportunity cost in. Trade for the rest. Both parties gain.',
      ],
      vocabulary: [
        { term: 'opportunity cost', definition: 'the value of the next-best alternative given up.' },
        { term: 'production possibilities curve', definition: 'a graph of maximum combinations of two goods producible with given resources.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-trade-off',
      kind: 'worked_example',
      problem: 'A country can produce 100 units of food OR 50 units of cars OR mixes of both. If it produces 60 food and 30 cars, is it efficient?',
      steps: [
        'Find PPC: at extreme, F=100/C=0 or F=0/C=50. Trade-off: each car costs 2 food.',
        'On the linear PPC, 30 cars uses 60 food worth of resources. Remaining: 100 − 60 = 40 food.',
        'But country IS producing 60 food, more than 40 → impossible OR an INEFFICIENCY OUTSIDE the model.',
        'Re-check: 30 cars × 2 = 60 food given up. So food production = 100 − 60 = 40, not 60.',
        'Producing 60 food + 30 cars is OUTSIDE the PPC — UNATTAINABLE without more resources.',
        'Lesson: PPC enforces real-world constraints.',
      ],
      answer: 'unattainable — outside the PPC',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What does it mean if an economy is operating INSIDE its PPC?',
      expectedAnswer: 'inefficient — resources idle or misallocated; could produce more without giving anything up',
      responseFormat: 'free',
      hints: [
        'Inside means below capacity.',
        'Could move outward without trade-offs.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-only-money',
      kind: 'misconception_check',
      question: 'Is opportunity cost only about MONEY?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Reducing opportunity cost to dollars.',
          correctsTo: 'No — it\'s about ANYTHING you give up. Time spent studying = time not spent with friends. Spending $100 on a concert = not spending it elsewhere. Money is one form of opportunity cost; time, attention, and other resources count too.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'PPC: max combinations of two goods with given resources.',
        'On curve = efficient. Inside = inefficient. Outside = unattainable.',
        'Slope = opportunity cost.',
        'Bowed-out: increasing opportunity cost (specialized resources).',
        'Outward shift = growth (new resources, tech, education).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does technological progress shift the PPC outward unevenly?',
      hint: 'New tech often improves productivity in ONE area. Better tractors → more food per worker, doesn\'t directly help car production. PPC shifts only on the food axis. Over time, many such shifts compound.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
