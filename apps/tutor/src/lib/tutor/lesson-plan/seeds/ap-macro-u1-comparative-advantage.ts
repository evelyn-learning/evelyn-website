/**
 * AP Macroeconomics — CED Unit 1.4: Comparative Advantage and Gains from Trade.
 *
 * One of AP Macro's signature topics. Builds on Unit 1.1 (scarcity) and
 * 1.2 (resource allocation) by showing how OPPORTUNITY COST drives the
 * specialization-and-trade logic that lifts both parties even when one
 * has an absolute advantage in everything.
 *
 * Higher-density plan per the AP Plans Initiative Q1 follow-up: this
 * topic carries multiple distinct AP question-types (identify CA from
 * a table, compute opportunity costs, find terms of trade, justify
 * gains from trade), so it gets four try-yourselfs not the standard
 * three.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U1_COMPARATIVE_ADVANTAGE: LessonPlan = {
  id: 'evelyn.ap.macro.comparative-advantage.v1',
  title: 'U1.4 Comparative Advantage and Gains from Trade',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.comparative-advantage',
      description:
        'Distinguish absolute from comparative advantage, compute opportunity cost from a production table, identify which party has CA in each good, determine the range of mutually-beneficial terms of trade, and justify why specialization and trade leave both parties better off.',
      standard: 'AP-MACRO-1.4',
    },
  ],
  prerequisites: ['apmacro.scarcity', 'apmacro.resource-allocation', 'apmacro.ppc'],
  followUps: ['apmacro.cost-benefit'],
  estimatedMinutes: 28,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make CA feel counterintuitive and unmissable.',
      script:
        "The world's best lawyer can also type 100 words a minute, faster than any secretary. Should she still hire a secretary? Yes — and not because the secretary is faster, but because the lawyer is BETTER off doing law than typing. That is the most important counter-intuitive idea in economics: even when one party is better at EVERYTHING, both still gain from specialization and trade. Two countries, two friends, two roommates — the math works the same.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ca',
      kind: 'concept',
      goal: 'Cover absolute vs comparative advantage, opportunity cost, terms of trade, and gains.',
      keyIdeas: [
        'ABSOLUTE ADVANTAGE: a producer can make more of a good with the same resources (or the same amount with fewer resources) than another producer. Pure productivity comparison.',
        'COMPARATIVE ADVANTAGE: a producer has the LOWER OPPORTUNITY COST for a good. Opportunity cost = how much of OTHER goods you give up by producing one more unit of THIS good.',
        'CRITICAL: comparative advantage — not absolute — determines who SHOULD produce what for trade purposes. A country can lack absolute advantage in everything yet still have CA in something — and trade still benefits it.',
        'COMPUTING OPPORTUNITY COST FROM A PRODUCTION TABLE: if Country X can produce 4 grain or 2 cars per hour, then producing 1 car costs 2 grain (and 1 grain costs 0.5 cars). The two opportunity costs are reciprocals.',
        'CA is identified by COMPARING opportunity costs across producers. Whichever producer has the LOWER opportunity cost in a good has CA in that good. (Each producer must have CA in something — they cannot both have CA in the same good unless their opportunity costs are equal, in which case there is no CA.)',
        'TERMS OF TRADE: the rate at which one good exchanges for another. Mutually-beneficial trade requires terms of trade to fall BETWEEN the two opportunity costs. (If 1 car = 2 grain in Country X and 1 car = 1/3 grain in Country Y, both gain at any trade rate where 1/3 < (cars per grain) < 2.)',
        'GAINS FROM TRADE: each country specializes in the good of its CA, then trades. Total output of both goods rises. Each country can consume MORE of both goods than it could on its own. This is what "trade is positive-sum" means concretely.',
        'IMPORTANT NUANCE: CA-based gains do NOT mean trade is painless. Specific industries lose; specific workers face costly transitions. AP wants you to recognize the AGGREGATE gain plus the DISTRIBUTIONAL trade-offs.',
      ],
      vocabulary: [
        { term: 'absolute advantage', definition: 'producing more of a good with the same resources than another producer.' },
        { term: 'comparative advantage', definition: 'producing a good at a LOWER opportunity cost than another producer.' },
        { term: 'terms of trade', definition: 'the rate at which one good exchanges for another in a trade.' },
      ],
      suggestedTools: ['comparison_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-us-japan',
      kind: 'worked_example',
      problem:
        'In one hour: the US can produce 4 units of grain OR 2 units of cars. Japan can produce 1 unit of grain OR 3 units of cars. (a) Identify absolute advantage in each good. (b) Compute opportunity cost of each good for each country. (c) Identify comparative advantage. (d) Determine the range of mutually-beneficial terms of trade.',
      steps: [
        'STEP 1 — ABSOLUTE ADVANTAGE: who can produce more of each good per hour? Grain: US (4) > Japan (1) → US has AA in grain. Cars: Japan (3) > US (2) → Japan has AA in cars.',
        'STEP 2 — OPPORTUNITY COST FOR THE US. The US can make either 4 grain OR 2 cars in an hour, so 1 hour\'s worth of cars (2) costs 1 hour\'s worth of grain (4). Therefore: 1 car costs 4/2 = 2 grain. Reciprocal: 1 grain costs 2/4 = 0.5 cars.',
        'STEP 3 — OPPORTUNITY COST FOR JAPAN. Japan can make 1 grain OR 3 cars per hour. 1 car costs 1/3 grain. 1 grain costs 3 cars.',
        'STEP 4 — COMPARATIVE ADVANTAGE: compare opportunity costs of each good. Cars: US gives up 2 grain per car, Japan gives up only 1/3 grain per car. Japan has lower OC in cars → Japan has CA in cars. Grain: US gives up 0.5 cars per grain, Japan gives up 3 cars per grain. US has lower OC in grain → US has CA in grain.',
        'STEP 5 — TERMS OF TRADE RANGE. For mutually-beneficial trade in cars-for-grain: the trade rate must be BETTER than the US producing cars itself (US would self-pay 2 grain per car) AND BETTER than Japan producing grain itself (Japan would self-pay 3 cars per grain, equivalent to 1/3 grain per car). So 1 car must trade for somewhere BETWEEN 1/3 grain and 2 grain.',
        'STEP 6 — INTERPRET: even though Japan has AA in cars and US in grain, BOTH countries also have a clearly-defined CA. They specialize: US makes grain, Japan makes cars. Trade at any rate inside (1/3, 2) leaves both countries consuming more of both than autarky would allow.',
      ],
      answer:
        'AA: US in grain, Japan in cars. CA: US in grain, Japan in cars. Terms of trade: 1 car must trade for between 1/3 and 2 units of grain for both to gain.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-define',
      kind: 'try_yourself',
      problem:
        'In your own words, explain the difference between absolute advantage and comparative advantage. Give one example of a producer that has AA in a good but does NOT have CA in that same good.',
      expectedAnswer:
        'Absolute advantage = producing more of a good with the same resources. Comparative advantage = producing a good at a LOWER opportunity cost. They can diverge: a country with AA in everything still gives up MORE in opportunity cost when producing the good it is "less good at" — so the OTHER country has the CA there. Example: in our worked example Japan has AA in cars (3 vs 2), but the US has CA in grain (lower OC). So one party can have AA in a good while the OTHER party has CA in that same good — actually this is impossible (CA is in the OTHER good). The valid example: the lawyer is faster at typing than her secretary (AA in typing) but the secretary has CA in typing because the lawyer\'s opportunity cost of typing (forgone legal work) is enormous.',
      responseFormat: 'free',
      hints: [
        'AA is a productivity comparison. CA is an opportunity-cost comparison.',
        'Try the lawyer-and-secretary example. Who has AA at typing? Who has CA?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-table',
      kind: 'try_yourself',
      problem:
        'Country A can produce 12 wheat OR 6 tech in a day. Country B can produce 5 wheat OR 10 tech in a day. (a) Compute opportunity costs. (b) Identify CA in each good. (c) State a terms-of-trade range mutually beneficial to both.',
      expectedAnswer:
        'Country A: 1 tech costs 12/6 = 2 wheat; 1 wheat costs 6/12 = 0.5 tech. Country B: 1 tech costs 5/10 = 0.5 wheat; 1 wheat costs 10/5 = 2 tech. CA: B has lower OC in tech (0.5 < 2 wheat per tech) → B has CA in tech. A has lower OC in wheat (0.5 < 2 tech per wheat) → A has CA in wheat. Terms of trade: for cars-vs-wheat trades to benefit both, 1 tech must trade for between 0.5 wheat (B\'s OC) and 2 wheat (A\'s OC). Equivalently, 1 wheat for between 0.5 tech and 2 tech.',
      responseFormat: 'numeric',
      hints: [
        'Opportunity cost is "what I give up to get one of this." Use the per-day production numbers.',
        'CA goes to the producer with the LOWER opportunity cost in that good.',
        'Terms of trade must lie strictly between the two opportunity costs.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-zero-sum',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. A politician argues: "Trade only benefits one country at the expense of another. If we run a trade deficit, we are losing." Evaluate this claim using comparative advantage reasoning. Be precise about where the politician is right and where wrong.',
      expectedAnswer:
        'The "zero-sum" framing is wrong on aggregate but contains a partial truth about distribution. WRONG: comparative advantage shows that BOTH countries can consume more of both goods after trade than before, regardless of who has AA. Specialization expands the joint production possibilities; gains are positive-sum. A trade deficit (importing more than exporting) is not by itself a sign of "losing" — it can reflect strong domestic demand, high investment opportunities attracting foreign capital, or a strong currency. PARTIAL TRUTH: trade DOES create domestic winners and losers — workers in import-competing industries face real, often painful adjustments. The aggregate gain is real, but distributional consequences are also real, and ignoring them is bad policy. Strong answers distinguish the AGGREGATE positive-sum logic from the DISTRIBUTIONAL trade-offs.',
      responseFormat: 'frq',
      hints: [
        'Does the CA model predict positive-sum or zero-sum gains?',
        'Is "trade deficit" the same thing as "losing"? What does a deficit actually measure?',
        'Are aggregate gains the same as distributional outcomes?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-impossible',
      kind: 'try_yourself',
      problem:
        'Application. Country A can make 10 phones OR 5 cars per day. Country B can make 4 phones OR 2 cars per day. Identify whether trade between these two countries can produce mutual gains, and explain.',
      expectedAnswer:
        'Country A opportunity costs: 1 car = 2 phones, 1 phone = 0.5 cars. Country B: 1 car = 2 phones, 1 phone = 0.5 cars. The opportunity costs are IDENTICAL. Neither country has a comparative advantage in either good — the production trade-off is the same in both. There are NO MUTUAL GAINS from specialization and trade in this case. Country A has absolute advantage in both goods (10>4, 5>2), but identical opportunity costs mean trade is neutral. This shows the special case where AA exists but no CA exists — and exposes that gains from trade depend on differences in opportunity cost, not on differences in productivity.',
      responseFormat: 'free',
      hints: [
        'Compute opportunity costs first.',
        'Check whether the opportunity costs differ.',
        'No difference in opportunity costs means no CA, which means no gains.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-aa-matters',
      kind: 'misconception_check',
      question: 'For determining who should produce what for trade, does absolute advantage matter more than comparative advantage?',
      commonErrors: [
        {
          answer: 'yes — the country that can make more of a good is the one that should make it',
          misconception:
            'Treating productivity as if it were the only criterion. The deeper logic is opportunity cost, which is what CA captures.',
          correctsTo:
            'NO. AA tells you who is more PRODUCTIVE; CA tells you who has the LOWER OPPORTUNITY COST. For trade decisions, comparative advantage is what matters — full stop. The lawyer in the hook IS faster than her secretary, but the lawyer\'s opportunity cost of typing (forgone legal billings) is so high that she should specialize in law and TRADE for typing services. AP frequently sets up worked-example tables where one country has AA in both goods, expecting students to nonetheless identify CA correctly. Mistaking AA for "the answer" is a classic point-loser.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Absolute advantage = more output per resource. Comparative advantage = lower OPPORTUNITY COST.',
        'COMPARATIVE advantage drives specialization and trade decisions, not absolute.',
        'Each producer has CA in one good (unless opportunity costs are identical — then no CA, no gains).',
        'Mutually-beneficial terms of trade lie BETWEEN the two opportunity costs.',
        'Gains from trade are aggregate-positive, but distributionally uneven — winners and losers are both real.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.4',
    cedTitle: 'Comparative Advantage and Gains from Trade',
    sources: [
      { type: 'concept', book: 'openstax-macro-ap', chapter: '2', note: 'Standard CA framing — production-possibilities-table approach used across AP textbooks.' },
    ],
  },
};
