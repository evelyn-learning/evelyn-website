/**
 * AP Macroeconomics — CED Unit 1.1: Scarcity, Choice, and Trade-offs.
 *
 * The entry-point lesson for AP Macro. Establishes the universal economic
 * problem (unlimited wants vs. limited resources) and frames every
 * downstream topic as a response to it.
 *
 * Plan 1 of the AP Plans Initiative — calibration target. See
 * project_ap_plans_initiative.md memory for the 11 grilled resolutions
 * and the full ship plan.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_MACRO_U1_SCARCITY: LessonPlan = {
  id: 'evelyn.ap.macro.scarcity.v1',
  title: 'Scarcity, Choice, and Trade-offs',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-macroeconomics',
  locale: 'en',
  los: [
    {
      id: 'apmacro.scarcity',
      description:
        'Define scarcity, explain why it forces every economy to make choices, and identify the trade-off and opportunity cost in a given decision.',
      standard: 'AP-MACRO-1.1',
    },
  ],
  prerequisites: [],
  followUps: ['apmacro.opportunity-cost', 'apmacro.ppc'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make scarcity feel personal — even billionaires face it.',
      script:
        "Jeff Bezos has more money than almost anyone in history. But he can't be in two places at once. He can't extend his life past 24 hours a day. He can't buy a guarantee that nothing he loves will break. Scarcity isn't about being poor — it's about wanting more than the universe has on offer. That's where economics begins.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-scarcity',
      kind: 'concept',
      goal: 'Define scarcity precisely and connect it to choice, trade-off, and opportunity cost.',
      keyIdeas: [
        'SCARCITY: human wants exceed the resources available to satisfy them. Wants are essentially unlimited; resources (time, labor, land, capital, raw materials) are finite. The gap is the economic problem.',
        'EVERY economy — from a household to a nation — faces scarcity. Even very wealthy individuals face it: time is the universal scarce resource. 24 hours is 24 hours.',
        'Scarcity FORCES choice. If you could have everything, no decision would matter. Because resources are limited, choosing one thing means giving up another.',
        'The next-best alternative you give up is the OPPORTUNITY COST of the choice you made. (We unpack opportunity cost fully in 1.2 — for now, just notice that every choice has one.)',
        'A TRADE-OFF is the act of giving something up to get something else. Trade-offs follow directly from scarcity.',
        'Economics is the discipline that studies HOW people, firms, and governments make choices under scarcity, and what the consequences are.',
      ],
      vocabulary: [
        {
          term: 'scarcity',
          definition: 'the condition in which wants exceed available resources, forcing choices.',
        },
        {
          term: 'trade-off',
          definition: 'giving up one thing to get something else.',
        },
        {
          term: 'opportunity cost',
          definition: 'the value of the next-best alternative forgone when a choice is made.',
        },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-budget',
      kind: 'worked_example',
      problem:
        "Maya has $50 and one Saturday afternoon. She wants to (a) see a $15 movie, (b) eat a $20 dinner, (c) buy a $30 book she's been waiting for, (d) put $50 of gas in her car for a road trip next weekend. She can't do everything. Walk through how scarcity, choice, and trade-off show up here.",
      steps: [
        'IDENTIFY THE SCARCE RESOURCES. Two: $50 (money) and one Saturday afternoon (time). Either alone could constrain her; both together definitely do.',
        'NOTICE WANTS EXCEED RESOURCES. Total cost of (a)+(b)+(c)+(d) = $115. She has $50. Even ignoring time, money alone forces her to drop options.',
        'CHOICE IS FORCED. She must pick a subset. There is no choice that costs nothing — even doing nothing means giving up all four options.',
        'IDENTIFY ONE TRADE-OFF. Suppose she picks the $30 book + $15 movie = $45. She traded the dinner and the gas to get the book and the movie.',
        'IDENTIFY THE OPPORTUNITY COST OF HER CHOICE. The next-best alternative she gave up. If gas-for-the-road-trip was the runner-up, the opportunity cost of book+movie is the road trip.',
        "NOTICE: opportunity cost is the BEST thing she gave up — not all the things she gave up. Each decision has exactly one opportunity cost (its top-ranked alternative).",
      ],
      answer:
        'Scarce resources: $50 + time. Wants ($115 of options) > resources ($50). Trade-off: chose book+movie, gave up dinner+gas. Opportunity cost: whichever of those was her next-best.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-define',
      kind: 'try_yourself',
      problem:
        'In one sentence, define scarcity. Then give one example of a scarce resource you personally face this week.',
      expectedAnswer:
        'Scarcity is the condition that human wants exceed the resources available to satisfy them. Personal example will vary — common right answers: time (24 hours / day), money, a particular textbook in the library, sleep, attention.',
      responseFormat: 'free',
      hints: [
        'Two pieces: (a) what is unlimited, (b) what is limited.',
        'For your example, anything you could want more of than you have access to.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-textbook',
      kind: 'try_yourself',
      problem:
        "A small town has $2 million to spend. The town council is choosing between (1) repaving the main road, (2) a new wing for the elementary school, (3) hiring four additional firefighters for a year. They can fund only one. Identify the scarce resource, name one trade-off, and state the opportunity cost if they choose option (1).",
      expectedAnswer:
        'Scarce resource: the $2 million budget (and arguably council time/political capital, but money is primary). Trade-off: spending money on roads means not spending it on school expansion or firefighters. Opportunity cost of choosing (1) = the better of (2) and (3) — whichever the town values more. Either is acceptable as long as the student names the runner-up specifically and recognizes opportunity cost = next-best alternative, not all alternatives combined.',
      responseFormat: 'free',
      hints: [
        'What is the limited thing here?',
        'A trade-off pairs what you got with what you gave up.',
        'Opportunity cost is the SINGLE next-best — pick whichever of the two unfunded options is more valuable in your judgment.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'try-billionaire',
      kind: 'try_yourself',
      problem:
        'AP-style synthesis. A student claims: "Scarcity only really exists for poor people. Once you have enough money, scarcity disappears." Evaluate this claim using economic reasoning. Use a specific example.',
      expectedAnswer:
        'The claim is wrong. Scarcity is not about wealth — it is about wants exceeding resources. Even a billionaire faces a fixed 24-hour day, a finite life span, and a single physical location at any moment. Time is the universal scarce resource: every hour spent at one activity is an hour not spent at another, regardless of bank balance. Wealth shifts WHICH wants are unsatisfied (a billionaire is not choosing between dinner and rent; they may be choosing between two competing acquisitions or which philanthropy to fund), but it does not eliminate the gap between wants and resources. The economic problem applies to all economies, all incomes.',
      responseFormat: 'frq',
      hints: [
        'What is the definition of scarcity? Does the definition reference wealth?',
        'Name one resource even a billionaire cannot have more of.',
        'Wealth changes which choices are forced, not whether choices are forced.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-poverty',
      kind: 'misconception_check',
      question: 'True or false: scarcity and poverty are basically the same thing.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Conflating scarcity (a universal economic condition) with poverty (a specific shortage of income/resources for some people).',
          correctsTo:
            "FALSE. Poverty means a person or group lacks enough resources to meet basic needs. Scarcity means wants exceed resources at every level — a billionaire choosing between two yachts faces scarcity, just over different goods. Poverty is one form of scarcity at the household level; scarcity itself is universal and applies in every economy regardless of wealth. Confusing them leads students to think 'we just need to make people richer to end scarcity' — but no level of wealth eliminates the gap between wants and the 24-hour day.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Scarcity = wants exceed resources. Universal — every economy and every person.',
        'Scarcity forces choice. Every choice has a trade-off and exactly one opportunity cost (next-best alternative).',
        'Time is the inescapable scarce resource even for the wealthy.',
        'Scarcity ≠ poverty. Conflating them is a common AP misconception.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.1',
    cedTitle: 'Scarcity',
    sources: [
      {
        type: 'concept',
        book: 'openstax-macro-ap',
        chapter: '1',
        note: 'OpenStax Principles of Macroeconomics for AP — Ch 1 framing of scarcity, time as ultimate scarce resource.',
      },
    ],
  },
};
