/**
 * AP Macroeconomics — Unit 1 CED 1.1: Scarcity.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ap.macro.scarcity.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_MACRO_SCARCITY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.macro.scarcity.v1',
  course: 'AP Macroeconomics',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Scarcity',
  planId: 'evelyn.ap.macro.scarcity.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.scarcity.v1' }],
  theory: [
    { loId: 'apmacro.scarcity', content: `SCARCITY: human wants exceed the resources available to satisfy them. Wants are essentially UNLIMITED; resources (time, labor, land, capital, raw materials) are FINITE. The gap between the two is THE economic problem — the starting point of all of economics.` },
    { loId: 'apmacro.scarcity', content: `SCARCITY IS UNIVERSAL. Every economy — a household, a firm, a nation — faces it. Even the very wealthy face scarcity: TIME is the universal scarce resource. Twenty-four hours is twenty-four hours no matter how large the bank account.` },
    { loId: 'apmacro.scarcity', content: `SCARCITY FORCES CHOICE. If everyone could have everything, no decision would matter. Because resources are limited, choosing one thing means giving up another. Even "doing nothing" is a choice that gives up all the alternatives.` },
    { loId: 'apmacro.scarcity', content: `EVERY CHOICE HAS EXACTLY ONE OPPORTUNITY COST: the value of the NEXT-BEST alternative forgone — not the sum of ALL alternatives given up. If you pick option A and your runner-up was option C, the opportunity cost of A is C alone.` },
    { loId: 'apmacro.scarcity', content: `TRADE-OFF vs OPPORTUNITY COST: a TRADE-OFF is the act of giving something up to get something else (you traded dinner for the book). The OPPORTUNITY COST is the VALUE of the single best alternative you gave up. Trade-offs list everything sacrificed; opportunity cost names only the top-ranked sacrifice.` },
    { loId: 'apmacro.scarcity', content: `SCARCITY IS NOT POVERTY. Poverty = lacking enough resources for basic needs (a condition of SOME people). Scarcity = wants exceeding resources at EVERY level of wealth (a condition of ALL people and economies). A billionaire choosing between two acquisitions still faces scarcity. No level of wealth eliminates the gap between wants and the twenty-four-hour day.` },
    { loId: 'apmacro.scarcity', content: `ECONOMICS DEFINED: the discipline that studies HOW people, firms, and governments make choices under scarcity, and what the consequences of those choices are. Every later AP Macro topic (PPC, comparative advantage, fiscal policy, monetary policy) is a response to scarcity.` },
    { loId: 'apmacro.scarcity', content: `ANALYZING ANY SCARCITY SCENARIO: (a) identify the scarce resource(s) — often money AND time together; (b) show wants exceed resources (total cost of wants > available resources); (c) name the forced choice; (d) name one trade-off; (e) name the single opportunity cost (the runner-up alternative).` },
    { loId: 'apmacro.scarcity', kind: 'definition', title: 'scarcity', content: `the condition in which wants exceed available resources, forcing choices.` },
    { loId: 'apmacro.scarcity', kind: 'definition', title: 'trade-off', content: `giving up one thing to get something else.` },
    { loId: 'apmacro.scarcity', kind: 'definition', title: 'opportunity cost', content: `the value of the next-best alternative forgone when a choice is made.` },
  ],
  methods: [
    {
      title: 'Identify scarcity, trade-off, and opportunity cost in a decision scenario',
      steps: [
        `STEP 1 — IDENTIFY THE SCARCE RESOURCE(S). Look for what is limited: money, time, or both. Either alone can constrain the decision-maker; both together definitely do.`,
        `STEP 2 — SHOW WANTS EXCEED RESOURCES. Add up the cost of everything the decision-maker wants and compare to what is available. If total wants cost more than the resources on hand, scarcity binds and choice is forced.`,
        `STEP 3 — NAME THE CHOICE MADE (or the choice being considered). There is no zero-cost option — even doing nothing gives up all the alternatives.`,
        `STEP 4 — NAME ONE TRADE-OFF: pair what was gained with what was given up ("she got the book and the movie; she gave up the dinner and the road-trip gas").`,
        `STEP 5 — NAME THE OPPORTUNITY COST: the single NEXT-BEST alternative forgone. Rank the rejected options and pick the top one — NOT the sum of everything given up.`,
      ],
      example: {
        problem: `Maya has fifty dollars and one Saturday afternoon. Options: a fifteen-dollar movie, a twenty-dollar dinner, a thirty-dollar book, or fifty dollars of gas for next weekend's road trip. She cannot do everything. Identify the scarce resources, one trade-off, and the opportunity cost if she buys the book and the movie.`,
        solution: `Scarce resources: fifty dollars AND the afternoon. Wants total one hundred fifteen dollars > fifty available, so choice is forced. Book + movie costs forty-five dollars; trade-off = gave up dinner and road-trip gas. Opportunity cost = the runner-up alternative only — if the road trip was next-best, the opportunity cost is the road trip (not dinner + road trip combined).`,
      },
      relatedLoIds: ['apmacro.scarcity'],
    },
  ],
  pointers: [
    { content: 'Scarcity = wants exceed resources. Universal — applies to every person and economy, rich or poor.', kind: 'tip' },
    { content: 'Opportunity cost is the SINGLE next-best alternative, never the sum of all alternatives forgone.', kind: 'tip' },
    { content: 'Scarcity ≠ poverty. Poverty is one household-level form; scarcity never disappears with wealth.', kind: 'tip' },
    { content: 'Time is the inescapable scarce resource — the go-to example for "even billionaires face scarcity."', kind: 'tip' },
    { content: 'Every choice has a trade-off; even choosing nothing gives up all the options.', kind: 'tip' },
  ],
};
