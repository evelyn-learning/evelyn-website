/**
 * AP Macroeconomics — CED Unit 1.2: Resource Allocation and Economic Systems.
 *
 * Introduces the four factors of production and the three core economic
 * questions, then connects them to the spectrum of economic systems
 * (command → market → mixed) that all modern economies fall along.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U1_RESOURCE_ALLOCATION: LessonPlan = {
  id: 'evelyn.ap.macro.resource-allocation.v1',
  title: 'Resource Allocation and Economic Systems',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.resource-allocation',
      description:
        'Identify the four factors of production, articulate the three economic questions every society must answer, and place an economy on the command-market-mixed spectrum.',
      standard: 'AP-MACRO-1.2',
    },
  ],
  prerequisites: ['apmacro.scarcity'],
  followUps: ['apmacro.ppc'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the economy as a giant question-answering machine.',
      script:
        "Every society — from a hunter-gatherer band to the United States — has to answer the same three questions: WHAT to produce? HOW to produce it? FOR WHOM? Different societies answer differently. North Korea decides centrally; the US lets prices and markets decide most of it. The choice of HOW you answer those questions is what an economic system IS.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-allocation',
      kind: 'concept',
      goal: 'Cover the four factors, three economic questions, and the command-market-mixed spectrum.',
      keyIdeas: [
        'FOUR FACTORS OF PRODUCTION — the inputs every economy uses to make goods and services: (1) LAND — natural resources (the literal land, plus minerals, water, forests). (2) LABOR — human work. (3) CAPITAL — the produced means of production: tools, buildings, machines. NOTE: in economics "capital" does NOT mean money. (4) ENTREPRENEURSHIP — the willingness to organize the other three factors and bear risk to produce something.',
        'THREE ECONOMIC QUESTIONS every society must answer: WHAT goods and services to produce? HOW to produce them (which combination of factors)? FOR WHOM are they produced (how to distribute the output)?',
        'COMMAND ECONOMY: a central authority (typically government) makes the WHAT/HOW/FOR WHOM decisions. Examples: Soviet Union, North Korea, Cuba. Strength: can mobilize for clear goals (war, industrialization). Weakness: information problem — no central planner can know all the dispersed knowledge that prices aggregate. Tends toward shortages and misallocation.',
        'MARKET ECONOMY: decentralized — prices coordinate decisions across buyers and sellers. No one is "in charge"; outcomes emerge from many private transactions. Strength: efficient allocation when markets work; rewards productive activity. Weakness: market failures (externalities, public goods, monopoly, information asymmetry, severe inequality) can produce bad outcomes that need correcting.',
        'MIXED ECONOMY: combines markets with government provision/regulation. EVERY real-world economy is mixed — they vary by HOW MUCH government, not whether. The US, Germany, Sweden, China, India are all mixed; the spectrum places them differently.',
        'INCENTIVES drive choices in any system. Markets create incentives via prices and profits; command systems create them via mandates and quotas. AP MACRO: incentive-talk is the underlying logic of every chapter; you will see it again in every unit.',
      ],
      vocabulary: [
        { term: 'factors of production', definition: 'the inputs (land, labor, capital, entrepreneurship) used to produce goods and services.' },
        { term: 'capital (economic)', definition: 'produced means of production — tools, equipment, buildings. NOT money.' },
        { term: 'mixed economy', definition: 'an economy combining market mechanisms with government provision and regulation.' },
      ],
      suggestedTools: ['frayer_model', 'comparison_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-pizza-shop',
      kind: 'worked_example',
      problem:
        'Classify the resources a small pizza shop uses to produce a pizza into the four factors of production. Then identify how the shop answers the three economic questions.',
      steps: [
        'LIST resources used: the building rented for the storefront, the chef who makes pizzas, the oven, the wheat that becomes flour, the delivery vehicle, the cashier, the owner who started the shop.',
        'LAND (natural resources): the wheat field where the flour originated, the location/plot the storefront sits on. (The building itself counts as capital, but the underlying land is land.)',
        'LABOR: the chef\'s work, the cashier\'s work, the delivery driver\'s work.',
        'CAPITAL: the oven, the refrigerator, the delivery vehicle, the POS system, the storefront building. Produced things used to produce more things.',
        'ENTREPRENEURSHIP: the owner who saw an opportunity, organized the other three factors, took on the risk of failure, and made the strategic decisions.',
        'WHAT? The shop produces pizzas — chosen because the owner judged consumer demand would be there at a profitable price. (In a market economy, prices and profits drove the decision.)',
        'HOW? The owner combined factors in a particular ratio: a small staff, a moderate-size oven, etc. If labor became cheaper she might hire more; if ovens got cheaper she might add a second one. Substitution among factors.',
        'FOR WHOM? Whoever pays the price. Pizzas go to the customers who decide they want a pizza enough to pay $15 for it. Distribution is by willingness-and-ability to pay.',
      ],
      answer:
        'Land = wheat field, plot. Labor = chef/cashier/driver. Capital = oven, fridge, vehicle, building. Entrepreneurship = owner. WHAT/HOW/FOR WHOM all answered through prices, profits, and the owner\'s judgment — characteristic of market answers.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-name-factors',
      kind: 'try_yourself',
      problem: 'Name the four factors of production. For each, give one example from your daily life — something you have used or seen used today.',
      expectedAnswer:
        'Land (e.g. the ground a school is built on, the air I breathe, the water in a fountain). Labor (e.g. the bus driver, my teacher, the cook at a cafe). Capital (e.g. the school building, my laptop, the bus itself). Entrepreneurship (e.g. the founder of any company whose product I used — the person who took the risk of starting it). Examples will vary; correctness depends on getting the FACTOR right, not the specific example.',
      responseFormat: 'free',
      hints: ['Start with the easy three — land, labor, capital. The fourth is the organizer-and-risk-taker.', 'Capital is NOT money. It is physical productive resources.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-startup',
      kind: 'try_yourself',
      problem:
        'A two-person software startup is building a mobile app. Resources they use: the founder\'s salary, two laptops, AWS cloud servers, the office space they rent, the founder\'s 70-hour weeks deciding strategy and pitching to investors, the second engineer\'s coding hours, the electricity bill, the brand name they trademarked. Classify each into one of the four factors.',
      expectedAnswer:
        'Labor: founder\'s salary represents her labor; second engineer\'s coding hours = labor; founder\'s 70-hour weeks (the worker-hours portion) = labor. Capital: laptops, AWS servers, office space (the building, not the underlying land), brand name (intellectual capital). Land: electricity (energy resource); the underlying land of the office plot. Entrepreneurship: the founder\'s strategy/pitching/risk-bearing role specifically (separable from the worker-hours she also puts in). Multiple correct boundaries — credit any reasonable classification provided each item is justified.',
      responseFormat: 'free',
      hints: [
        'Some items can plausibly fit two factors — say which and why. The ambiguity itself is part of the lesson.',
        'The founder wears two hats: worker (labor) AND organizer-risk-taker (entrepreneurship).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-mixed',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. A student says: "The United States is a market economy and Sweden is a socialist economy. They\'re fundamentally different." Evaluate this claim using economic-systems reasoning. Be specific about what you would compare.',
      expectedAnswer:
        'The claim oversimplifies. Both the US and Sweden are MIXED economies — neither is a pure market system, neither is fully command. They differ in DEGREE, not kind: the share of GDP routed through government (around 38% in the US vs 49% in Sweden), the size of the public sector (universal healthcare in Sweden, mostly private in the US), the extent of redistribution (Sweden taxes and transfers more), and the regulatory environment. But both rely fundamentally on private property, prices, and markets to allocate most goods and services. A student who calls Sweden "socialist" usually means social-democratic (heavier government spending and transfers), not socialist in the central-planning sense. Strong answers: name 2-3 specific dimensions of comparison and place each country on each dimension.',
      responseFormat: 'frq',
      hints: [
        'Is either country PURELY market or PURELY command?',
        'What dimensions could you compare? Government share of GDP, public services, redistribution, regulation.',
        'The word "socialist" often means different things — pin down which definition you are using.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-capital-is-money',
      kind: 'misconception_check',
      question: 'In economics, is "capital" the same as "money"?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Conflating financial capital (money in a bank account, raised from investors) with economic capital (physical productive resources).',
          correctsTo:
            'NO. In macro, CAPITAL means produced means of production — machines, buildings, tools, equipment, infrastructure. Money is a medium of exchange and a store of value, but money itself does not produce anything; what it BUYS (the machines, the buildings) is capital. When the news says a startup "raised $20M of capital" they are using the word in the financial sense — but on the AP exam, "capital" almost always refers to the physical productive sense unless the question explicitly says "financial capital." Confusing the two will lose you points on factors-of-production questions.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Four factors of production: land, labor, capital, entrepreneurship. Capital = physical productive resources, NOT money.',
        'Three economic questions: WHAT, HOW, FOR WHOM.',
        'Command vs market is a SPECTRUM. Every real economy is mixed — the question is HOW MUCH of each.',
        'Markets allocate via prices; command systems allocate via central decisions; mixed economies blend.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.2',
    cedTitle: 'Resource Allocation and Economic Systems',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '1', note: 'OpenStax Ch 1 framing of factors of production and economic systems.' },
    ],
  },
};
