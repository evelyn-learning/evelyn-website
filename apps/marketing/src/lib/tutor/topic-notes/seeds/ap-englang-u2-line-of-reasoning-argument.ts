/**
 * AP English Language & Composition — Unit 2 CED 2.3: Line of Reasoning.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.line-of-reasoning-argument.v1`). Covers organizing an
 * essay's body paragraphs into a coherent, logically dependent sequence,
 * rather than a list of separate reasons that happen to support the same
 * claim.
 *
 * Anchor text referenced in the method's example and the try-yourself
 * segment: Abraham Lincoln, "The Gettysburg Address" (1863). Quotes are
 * limited to short structural phrases already used elsewhere in the unit.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_LINE_OF_REASONING_ARGUMENT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.line-of-reasoning-argument.v1',
  course: 'AP English Language & Composition',
  cedUnit: 2,
  cedTopic: '2.3',
  cedTitle: 'Line of Reasoning',
  planId: 'evelyn.ap.englang.line-of-reasoning-argument.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.line-of-reasoning-argument.v1' }],
  theory: [
    {
      loId: 'apenglang.line-of-reasoning-argument',
      kind: 'definition',
      title: 'line of reasoning',
      content:
        'The logical sequence connecting a claim to its supporting points, in an order where each point builds on — or answers a gap left by — the one before it. Not a list of separate reasons in whatever order they occurred to the writer.',
    },
    {
      loId: 'apenglang.line-of-reasoning-argument',
      kind: 'definition',
      title: 'roadmap (reasoning statement)',
      content:
        'A sentence, usually near the claim, that states the logical order the essay\'s reasoning will follow, so both writer and reader know what to expect before the first body paragraph starts.',
    },
    {
      loId: 'apenglang.line-of-reasoning-argument',
      kind: 'framework',
      title: 'commentary at the essay level',
      content:
        'Commentary makes reasoning VISIBLE to the reader: at the paragraph level (1.4) it connects evidence to a claim; at the ESSAY level, a line of reasoning connects each body paragraph\'s point to the ones around it, so the reader can follow WHY point two comes after point one, not merely that both happen to support the same claim.',
    },
    {
      loId: 'apenglang.line-of-reasoning-argument',
      kind: 'framework',
      title: 'discoverable orders',
      content:
        'A coherent line of reasoning usually has a discoverable logic to its order: cause building to effect, a concession answered before it can be raised by the reader, or points escalating from most easily granted to most decisive.',
    },
    {
      loId: 'apenglang.line-of-reasoning-argument',
      kind: 'strategy',
      title: 'the swap test',
      content:
        'Could you exchange any two body paragraphs without the essay losing anything? If yes, the paragraphs are a list, not a reasoned sequence — a true line of reasoning would break if reordered, because a later point depends on an earlier one having already been established.',
    },
    {
      loId: 'apenglang.line-of-reasoning-argument',
      kind: 'trap',
      title: 'topic list vs. line of reasoning',
      content:
        'Naming what each section is "about" (this part is about X, this part is about Y) describes a sequence of topics, not a line of reasoning. A real line of reasoning states the LOGICAL DEPENDENCY: why does the second point require or respond to the first, not just come after it? If only what each part is "about" can be named, it\'s a topic list, not a line of reasoning — a paragraph-scale version of the summary-vs-analysis trap.',
    },
    {
      loId: 'apenglang.line-of-reasoning-argument',
      kind: 'rhetorical-device',
      title: 'the Gettysburg Address as an unbreakable sequence',
      content:
        'The nation was FOUNDED on the proposition that all are created equal; the war TESTS whether such a nation can endure; the dead have already consecrated this ground beyond what words can add; therefore the LIVING task is to complete the unfinished work. Each movement depends on the one before it — reordering them would break the logic.',
    },
    {
      loId: 'apenglang.line-of-reasoning-argument',
      kind: 'strategy',
      title: 'reading FOR reasoning, not summarizing content',
      content:
        'Reading for a line of reasoning means asking: what is the logical hinge connecting THIS point to the NEXT one — and would the argument survive if the two were swapped? — rather than simply reporting what a passage covers.',
    },
  ],
  methods: [
    {
      title: 'Build a roadmap that sequences body-paragraph points',
      when_to_use:
        'Use once individual body-paragraph points are drafted (2.2) and need to be ordered into a coherent, load-bearing sequence rather than a list.',
      steps: [
        'IDENTIFY THE LOGICAL RELATIONSHIP AMONG THE POINTS — which are corroborating benefits, and which is a concession/objection that needs answering?',
        'DECIDE WHICH BENEFIT TO LEAD WITH — usually the more urgent or higher-stakes one, so the order escalates from serious to broader rather than the reverse.',
        'DECIDE WHERE A CONCESSION BELONGS — typically last, after the benefits are established, so it reads as a solvable cost rather than an opening admission that undercuts the case.',
        'CHECK THE ORDER AGAINST THE SWAP TEST — could two adjacent points trade places with no loss? If not, the order is load-bearing.',
        'WRITE THE ROADMAP SENTENCE stating the reasoning path a reader could hold in mind before the first body paragraph.',
      ],
      example: {
        problem:
          "Three body-paragraph points are ready for an essay (claim: high schools should push start times to 8:30 a.m. or later): (1) academic performance improves with later starts, (2) chronic sleep deprivation harms teen driving safety, (3) logistics concerns (athletics, bus schedules) are real but solvable. Build a coherent line of reasoning sequencing these three points.",
        solution:
          "Roadmap: because the safety cost of sleep-deprived teen driving is the most urgent problem, because academic performance data corroborates that the problem is real and fixable, and because the logistics concerns raised against later start times are real but solvable, high schools should adopt 8:30 a.m. or later start times. This orders the two benefits from most urgent to corroborating and places the concession last — so the reader has already been given a reason to want the policy to succeed before being asked to accept its costs are manageable.",
      },
      relatedLoIds: ['apenglang.line-of-reasoning-argument'],
    },
  ],
  pointers: [
    { content: 'A line of reasoning is a sequence in which each point builds on or answers the one before it — not a list of reasons that happen to support the same claim.', kind: 'tip' },
    { content: 'The swap test: if two adjacent points could trade places with no loss, they\'re a list, not a line of reasoning.', kind: 'tip' },
    { content: 'A roadmap sentence, stated early, tells both writer and reader the logical order the essay will follow.', kind: 'tip' },
    { content: 'Reliable orders: escalating (most easily granted to most decisive), or concession-answered-last (benefits established before an objection is addressed).', kind: 'tip' },
    { content: 'Naming what each part is "about" is a topic list, not a line of reasoning — name the logical hinge between adjacent points instead.', kind: 'trap' },
  ],
};
