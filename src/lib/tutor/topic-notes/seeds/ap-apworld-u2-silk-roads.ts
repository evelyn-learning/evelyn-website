/**
 * AP World History — Unit 2 CED 2.2: The Silk Roads.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.silk-roads.v1`. Covers the Silk Roads as a
 * centuries-old network (not a single road), the commercial innovations
 * (caravanserai, bills of exchange, Yuan paper money) that lowered the
 * cost and risk of overland trade, the luxury goods and trading cities the
 * network sustained, and the Mongol-secured Pax Mongolica that intensified
 * — without inventing — that trade, 1200-1450.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_SILK_ROADS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.silk-roads.v1',
  course: 'AP World History',
  cedUnit: 2,
  cedTopic: '2.2',
  cedTitle: 'The Silk Roads',
  planId: 'evelyn.ap.apworld.silk-roads.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.silk-roads.v1' }],
  theory: [
    {
      loId: 'apworld.silk-roads',
      kind: 'definition',
      title: 'Silk Roads',
      content:
        'A NETWORK of overland trade routes — many parallel and branching paths, not one single road — connecting China through Central Asia to the Middle East and the Mediterranean. The network existed for well over a thousand years before 1200; trade volume rose and fell with political stability along the route rather than the network itself being created or destroyed.',
    },
    {
      loId: 'apworld.silk-roads',
      kind: 'definition',
      title: 'caravanserai',
      content:
        "A roadside inn along overland trade routes, spaced roughly a day's journey apart, where merchant caravans could rest, resupply, and safely store goods overnight. Rulers and wealthy patrons funded them because more caravanserai meant more taxable trade passing through their territory — infrastructure that made long-distance overland trade physically survivable.",
    },
    {
      loId: 'apworld.silk-roads',
      kind: 'definition',
      title: 'bill of exchange',
      content:
        'A paper credit instrument letting a merchant deposit money in one city and collect an equivalent sum (minus a fee) in another, without physically transporting coin across dangerous distances. This let trade scale up without a matching increase in the amount of silver or gold physically on the road.',
    },
    {
      loId: 'apworld.silk-roads',
      kind: 'definition',
      title: 'Pax Mongolica',
      content:
        '("Mongol Peace") the period of relative political stability across Mongol-controlled Eurasia after the mid-1200s conquests. A merchant caravan crossing thousands of miles dealt with one set of rules and one enforcer of order instead of dozens of rival, unpredictable local rulers — dramatically lowering the risk of banditry and arbitrary tolls.',
    },
    {
      loId: 'apworld.silk-roads',
      kind: 'event',
      title: 'Yuan paper money',
      content:
        'The Yuan Dynasty (Mongol-ruled China, 1271-1368, founded by Kublai Khan) issued government-backed paper currency that replaced metal coinage domestically with lightweight, standardized notes backed by the state treasury. Marco Polo, visiting Kublai Khan\'s court, described this as a marvel — a currency accepted throughout the empire on the emperor\'s authority alone.',
    },
    {
      loId: 'apworld.silk-roads',
      kind: 'cause',
      title: 'commercial innovation lowered cost and risk',
      content:
        'Caravanserai (physical safety/resupply), bills of exchange (moving wealth without carrying coin), and Yuan-issued paper money (a state-backed currency) together reduced the cost and danger of overland trade, letting merchants finance larger and more frequent shipments than earlier eras of Silk Road trade had supported.',
    },
    {
      loId: 'apworld.silk-roads',
      kind: 'event',
      title: 'luxury goods moved in volume',
      content:
        'Chinese silk and increasingly porcelain moved west; spices (often relayed from further south and east) and manufactured goods moved in multiple directions. These were high-value, low-bulk goods — worth the cost and risk of a months-long overland journey, unlike bulky staple goods better suited to sea routes.',
    },
    {
      loId: 'apworld.silk-roads',
      kind: 'event',
      title: 'trading cities grew wealthy as network nodes',
      content:
        'Cities like Kashgar, Samarkand, and Kinsay (Hangzhou, described firsthand by Marco Polo) became major commercial hubs, drawing merchants, goods, and the taxes/tribute that funded further infrastructure — a self-reinforcing cycle of trade generating wealth generating more trade.',
    },
    {
      loId: 'apworld.silk-roads',
      kind: 'cause',
      title: 'the Mongols secured, not invented, Silk Road trade',
      content:
        'After conquering most of the route from China to Eastern Europe by the mid-1200s, the Mongols unified formerly hostile, fragmented territories under one political authority. The resulting Pax Mongolica meant far fewer hostile borders and unpredictable local tolls for a caravan to cross — securing and intensifying an already-ancient network rather than creating it.',
    },
    {
      loId: 'apworld.silk-roads',
      kind: 'framework',
      title: 'how the causes combine',
      content:
        'Commercial technology (caravanserai, credit, paper money) lowered the cost and risk of trading; political security (Pax Mongolica) lowered the danger of traveling. Together they intensified a much older network into the busiest, most integrated period of overland Afro-Eurasian exchange before the rise of maritime trade routes.',
    },
    {
      loId: 'apworld.silk-roads',
      kind: 'event',
      title: 'Marco Polo at Kinsay (c. 1300)',
      content:
        'Marco Polo, a Venetian merchant residing in Mongol-ruled China in the late 1200s, described the crowds in Kinsay (Hangzhou) as "so vast that no one would believe it possible that victuals enough could be provided for their consumption", were it not for the fact that "on every market-day" the squares are "thronged and crammed with purchasers, and with the traders who have brought in stores of provisions by land or water", and "everything they bring in is disposed of." As an outside observer writing for a European audience, his absolute language is descriptive color rather than a precise measurement — but his account still shows a trading city provisioned at a scale that awed an experienced foreign merchant.',
    },
    {
      loId: 'apworld.silk-roads',
      kind: 'trap',
      title: 'do not conflate "peaked" with "began"',
      content:
        'Overland trade between China, Central Asia, and the Mediterranean existed for well over a thousand years before the Mongol conquests. 1200-1450 is when trade VOLUME peaked, driven by commercial innovation plus Mongol-secured stability — not when the Silk Roads first began.',
    },
  ],
  methods: [
    {
      title: 'Source and analyze a Silk Roads-era document (HIPP)',
      when_to_use:
        'Use this as the first move on any unfamiliar primary-source excerpt describing Silk Roads-era trade, before making any claim about what the text shows or why it matters.',
      steps: [
        'H — HISTORICAL CONTEXT: what was happening at the moment this was written? Who controlled the route, and under what conditions was the writer traveling?',
        'I — INTENDED AUDIENCE: who is the writer addressing, and what does the writer want that audience to believe or feel?',
        'P — PURPOSE: state the purpose as a verb (what the writer wants the text to DO, e.g. impress, document, persuade), not a topic (what the text is about).',
        "P — POINT OF VIEW: what about the writer's identity or position (e.g. a foreign merchant, an outside observer) shapes the claim or its reliability?",
        'CONNECT TO A CAUSE: tie the detail back to one of the causal strands — commercial innovation (credit, paper money, caravanserai) or political security (Pax Mongolica).',
      ],
      example: {
        problem:
          'Analyze this excerpt from Marco Polo\'s account of Kinsay (Hangzhou): "The crowd of people that you meet here at all hours, passing this way and that on their different errands, is so vast that no one would believe it possible that victuals enough could be provided for their consumption, unless they should see how, on every market-day, all those squares are thronged and crammed with purchasers, and with the traders who have brought in stores of provisions by land or water; and everything they bring in is disposed of." What does this reveal about the scale of Silk-Road-era commerce, and what should a careful reader keep in mind about its reliability?',
        solution:
          'Historical context: Polo visited Kinsay while residing in Yuan China under Kublai Khan in the late 1200s, later dictating an account (c. 1300) for a European audience unfamiliar with Asia. Purpose: to impress readers with the scale of Chinese commerce. Point of view: as an outside merchant with an incentive to awe his readers, his absolute language ("so vast that no one would believe it possible") should be read as descriptive color, not a literal statistic. Connecting to cause: the routine, "every market-day" reliability of provisions arriving "by land or water" and being fully "disposed of" is a telling detail linking the passage to Pax Mongolica — a supply chain this dependable reflects the political stability the Mongols secured, while the sheer described density of people and goods is direct evidence for the concept\'s claim that trading cities grew wealthy as network nodes.',
      },
      relatedLoIds: ['apworld.silk-roads'],
    },
  ],
  pointers: [
    { content: 'The Silk Roads were a NETWORK of many routes, not a single road, and they existed for over a thousand years before the Mongols — never describe 1200-1450 as when the network "began."', kind: 'trap' },
    { content: 'The Mongols SECURED and INTENSIFIED Silk Road trade via Pax Mongolica; they did not INVENT it. This is the #1 tested misconception for this topic.', kind: 'trap' },
    { content: 'Keep the two causal strands distinct on FRQs: commercial innovation (caravanserai, bills of exchange, paper money) lowered cost/risk; Pax Mongolica lowered danger. Name both, don\'t blend them into one vague "trade got better" claim.', kind: 'tip' },
    { content: 'Bills of exchange and Yuan paper money are different things: bills of exchange moved wealth between merchants across cities; paper money was a state-issued domestic currency. Don\'t conflate them on an SAQ.', kind: 'tip' },
    { content: 'Treat Marco Polo\'s superlative language (a crowd "so vast that no one would believe it possible") as evidence of impression, not precise measurement, when weighing source reliability.', kind: 'tip' },
    { content: 'Luxury goods (silk, porcelain, spices) moved overland because their high value-to-bulk ratio justified a months-long journey — a useful line when explaining WHY certain goods (not others) traveled the Silk Roads.', kind: 'tip' },
  ],
};
