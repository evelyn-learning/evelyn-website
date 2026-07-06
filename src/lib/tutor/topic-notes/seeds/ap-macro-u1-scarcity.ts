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
  lastUpdatedAt: '2026-07-06',
  sources: [{ type: 'plan', planId: 'evelyn.ap.macro.scarcity.v1' }],
  theory: [
    { loId: 'apmacro.scarcity', content: `SCARCITY: human wants exceed the resources available to satisfy them. Wants are essentially unlimited; resources (time, labor, land, capital, raw materials) are finite. The gap is the economic problem.` },
    { loId: 'apmacro.scarcity', content: `EVERY economy — from a household to a nation — faces scarcity. Even very wealthy individuals face it: time is the universal scarce resource. 24 hours is 24 hours.` },
    { loId: 'apmacro.scarcity', content: `Scarcity FORCES choice. If you could have everything, no decision would matter. Because resources are limited, choosing one thing means giving up another.` },
    { loId: 'apmacro.scarcity', content: `The next-best alternative you give up is the OPPORTUNITY COST of the choice you made. (We unpack opportunity cost fully in 1.2 — for now, just notice that every choice has one.)` },
    { loId: 'apmacro.scarcity', content: `A TRADE-OFF is the act of giving something up to get something else. Trade-offs follow directly from scarcity.` },
    { loId: 'apmacro.scarcity', content: `Economics is the discipline that studies HOW people, firms, and governments make choices under scarcity, and what the consequences are.` },
    { loId: 'apmacro.scarcity', kind: 'definition', title: 'scarcity', content: 'the condition in which wants exceed available resources, forcing choices.' },
    { loId: 'apmacro.scarcity', kind: 'definition', title: 'trade-off', content: 'giving up one thing to get something else.' },
    { loId: 'apmacro.scarcity', kind: 'definition', title: 'opportunity cost', content: 'the value of the next-best alternative forgone when a choice is made.' },
  ],
  methods: [
    {
      title: 'Worked budget',
      steps: [
        `IDENTIFY THE SCARCE RESOURCES. Two: $50 (money) and one Saturday afternoon (time). Either alone could constrain her; both together definitely do.`,
        `NOTICE WANTS EXCEED RESOURCES. Total cost of (a)+(b)+(c)+(d) = $115. She has $50. Even ignoring time, money alone forces her to drop options.`,
        `CHOICE IS FORCED. She must pick a subset. There is no choice that costs nothing — even doing nothing means giving up all four options.`,
        `IDENTIFY ONE TRADE-OFF. Suppose she picks the $30 book + $15 movie = $45. She traded the dinner and the gas to get the book and the movie.`,
        `IDENTIFY THE OPPORTUNITY COST OF HER CHOICE. The next-best alternative she gave up. If gas-for-the-road-trip was the runner-up, the opportunity cost of book+movie is the road trip.`,
        `NOTICE: opportunity cost is the BEST thing she gave up — not all the things she gave up. Each decision has exactly one opportunity cost (its top-ranked alternative).`,
      ],
      example: { problem: `Maya has $50 and one Saturday afternoon. She wants to (a) see a $15 movie, (b) eat a $20 dinner, (c) buy a $30 book she's been waiting for, (d) put $50 of gas in her car for a road trip next weekend. She can't do everything. Walk through how scarcity, choice, and trade-off show up here.`, solution: `Scarce resources: $50 + time. Wants ($115 of options) > resources ($50). Trade-off: chose book+movie, gave up dinner+gas. Opportunity cost: whichever of those was her next-best.` },
      relatedLoIds: ['apmacro.scarcity'],
    },
  ],
  pointers: [
    { content: 'Scarcity = wants exceed resources. Universal — every economy and every person.', kind: 'tip' },
    { content: `Scarcity forces choice. Every choice has a trade-off and exactly one opportunity cost (next-best alternative).`, kind: 'tip' },
    { content: 'Time is the inescapable scarce resource even for the wealthy.', kind: 'tip' },
    { content: 'Scarcity ≠ poverty. Conflating them is a common AP misconception.', kind: 'tip' },
  ],
};
