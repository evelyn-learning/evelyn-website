/**
 * AP World History: Modern — CED Unit 2.2: The Silk Roads.
 *
 * CALIBRATION PLAN — the Unit-2 Vertical Slice's gold template. Establishes
 * the AP World content-course segment semantics, mirroring the APUSH
 * calibration plan (`ap-apush-u3-causes-of-revolution.ts`): concept = the
 * historical argument (how did commercial + political change revive and
 * expand overland Afro-Eurasian trade, 1200-1450?); worked_example =
 * annotated document analysis (what does a primary source reveal about the
 * scale/nature of that trade?); try_yourself = a 3-point SAQ-style
 * short-answer (describe/explain/explain, not a full essay — the DBQ/LEQ/SAQ
 * essay-practice plans with authentic AP rubric totals live separately, see
 * docs/superpowers/specs/2026-07-10-ap-world-history-design.md).
 *
 * See that design doc §Architecture for the reused Passage/rubric infra
 * (identical to APUSH/Eng Lang — 'document' genre, passage-aware grader,
 * lint-passages) and the AP Plans Initiative memory for the shared AP
 * conventions this plan follows (pacingThresholds, source attribution,
 * id/file/LO scheme).
 *
 * Anchor text: Marco Polo, The Travels (Yule trans., c. 1300), on the city
 * of Kinsay (Hangzhou) — evelyn.passage.apworld-marco-polo-kinsay.v1.
 * Teaching point is what the passage reveals about the SCALE of commerce at
 * a great Yuan-era trading city, a node of the Silk Roads / Indian Ocean
 * networks — quoted only as the short excerpt already seeded.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U2_SILK_ROADS: LessonPlan = {
  id: 'evelyn.ap.apworld.silk-roads.v1',
  title: 'U2.2 The Silk Roads',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.silk-roads',
      description:
        'Explain how developments in commercial and transportation technologies, along with the political stability provided by the Mongols, revived and expanded overland trade along the Silk Roads in the period 1200-1450.',
      standard: 'AP-APWORLD-2.2',
    },
  ],
  prerequisites: [],
  followUps: ['apworld.indian-ocean-trade'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the Silk Roads feel like a living, expanding commercial system in 1200-1450, not a fixed ancient highway.',
      script:
        "The 'Silk Roads' sound like a single, unchanging route — a highway that had always been there. It wasn't. Overland trade across Central Asia had existed for over a thousand years before 1200, but it rose and fell with who controlled the land in between. In the 1200s and 1300s, something changed: merchants could travel from the Mediterranean to China more safely and more profitably than at almost any earlier point in history. Bills of exchange let a merchant move wealth without carrying it. Paper money let a Chinese trader skip metal coins entirely. And a single, brutal empire — the Mongols — made the whole route safer than it had been in centuries. This is the story of how a network of very old roads got a very new burst of traffic.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-silk-roads-revival',
      kind: 'concept',
      goal: 'Explain how commercial innovations, the flow of luxury goods, the growth of trading cities, and the Mongol-secured Pax Mongolica together revived and expanded Silk Roads trade, 1200-1450.',
      keyIdeas: [
        "THE SILK ROADS WERE A NETWORK, NOT ONE ROAD: overland routes connecting China through Central Asia to the Middle East and the Mediterranean, made up of many parallel and branching paths used by different caravans in different eras. They existed for centuries before 1200, but trade volume rose and fell with political stability along the route.",
        "CARAVANSERAI made long-distance overland trade physically possible: roadside inns spaced roughly a day's journey apart where merchant caravans could rest, resupply, and safely store goods overnight. Rulers and wealthy patrons funded them along major routes because more caravanserai meant more taxable trade passing through their territory.",
        "CREDIT AND BANKING reduced the risk of carrying wealth across dangerous distances. Merchants increasingly used BILLS OF EXCHANGE — a paper instrument letting a merchant deposit money in one city and collect an equivalent sum (minus a fee) in another, without physically transporting coin. This let trade scale up without a matching increase in the amount of silver or gold physically on the road.",
        "PAPER MONEY, issued by the Yuan Dynasty (Mongol-ruled China, 1271-1368) as a government-backed currency, went further still: it replaced metal coinage domestically with lightweight, standardized paper notes backed by the state treasury. Marco Polo, visiting Kublai Khan's court, described this as a marvel — a currency accepted throughout the empire on the emperor's authority alone.",
        "LUXURY GOODS moved in volume along the revived routes: Chinese SILK and increasingly PORCELAIN moved west; SPICES (often relayed from further south and east) and manufactured goods moved in multiple directions. These were high-value, low-bulk goods — worth the cost and risk of a months-long overland journey, unlike bulky staple goods better suited to sea routes.",
        "TRADING CITIES grew and grew wealthy as nodes on the network: cities like Kashgar, Samarkand, and Kinsay (Hangzhou, described by Marco Polo) became major commercial hubs, drawing merchants, goods, and the taxes/tribute that funded further infrastructure — a self-reinforcing cycle of trade generating wealth generating more trade.",
        "THE MONGOLS DID NOT INVENT SILK ROAD TRADE — they SECURED it. After conquering most of the route from China to Eastern Europe by the mid-1200s, the Mongols unified formerly hostile, fragmented territories under one (brutal) political authority. The resulting PAX MONGOLICA ('Mongol Peace') meant a merchant caravan crossing thousands of miles dealt with one set of rules and one enforcer of order instead of dozens of rival, unpredictable local rulers — dramatically lowering the risk of banditry and arbitrary tolls.",
        "THE COMBINED EFFECT: commercial technology (caravanserai, credit, paper money) lowered the cost and risk of trading; political security (Pax Mongolica) lowered the danger of traveling; together they intensified a much older network into the busiest, most integrated period of overland Afro-Eurasian exchange before the rise of maritime trade routes.",
      ],
      vocabulary: [
        {
          term: 'caravanserai',
          definition:
            'a roadside inn along overland trade routes where merchant caravans could rest, resupply, and safely store goods, spaced roughly a day\'s journey apart.',
        },
        {
          term: 'bill of exchange',
          definition:
            'a paper credit instrument letting a merchant deposit money in one city and collect an equivalent sum in another, avoiding the risk of physically transporting coin across long distances.',
        },
        {
          term: 'Pax Mongolica',
          definition:
            "(\"Mongol Peace\") the period of relative political stability and safer trade across Mongol-controlled Eurasia after the mid-1200s conquests, which lowered the risk of overland travel and commerce.",
        },
        {
          term: 'Yuan Dynasty',
          definition:
            'the Mongol-ruled dynasty in China (1271-1368, founded by Kublai Khan) that issued state-backed paper money and hosted foreign merchants and travelers, including Marco Polo.',
        },
      ],
      passageId: 'evelyn.passage.apworld-marco-polo-kinsay.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-marco-polo-kinsay',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Marco Polo\'s account of the city of Kinsay (Hangzhou), which he visited during the reign of Kublai Khan: "The crowd of people that you meet here at all hours, passing this way and that on their different errands, is so vast that no one would believe it possible that victuals enough could be provided for their consumption, unless they should see how, on every market-day, all those squares are thronged and crammed with purchasers, and with the traders who have brought in stores of provisions by land or water; and everything they bring in is disposed of." What does this passage reveal about the scale of Silk-Road-era commerce, and what should a careful reader keep in mind about its reliability?',
      steps: [
        "SOURCE IT FIRST. Who, when, why? Marco Polo, a Venetian merchant traveling and residing in Mongol-ruled China in the late 1200s, writing an account (later dictated and published, c. 1300) intended for a European audience largely unfamiliar with Asia — much of it meant to impress and even entertain readers back home.",
        'IDENTIFY THE CLAIM. Polo asserts that the crowd of people in Kinsay was "so vast that no one would believe it possible that victuals enough could be provided for their consumption" — except that, on "every market-day", the squares are "thronged and crammed with purchasers, and with the traders who have brought in stores of provisions by land or water", and that "everything they bring in is disposed of" — i.e. fully sold.',
        'CONNECT TO THE COMMERCIAL-VOLUME CAUSE. This is direct testimony for the concept\'s claim that trading cities grew wealthy as network nodes: a population so dense that feeding it seems implausible is nonetheless reliably provisioned because traders keep bringing in goods "by land or water" and every delivered load sells out — evidence of a trade network channeling an enormous, steady volume of goods into one hub.',
        'CONNECT TO THE POLITICAL-SECURITY CAUSE. Polo describes this happening on "every market-day" — a routine, not an occasional event. Feeding a crowd this vast through dependable land-and-water resupply, day after day, is consistent with the kind of stable trade-route access the concept links to Pax Mongolica: without political security, that steady a supply chain would be far more vulnerable to disruption.',
        'WEIGH THE SOURCE\'S RELIABILITY. Polo is an outside observer with an incentive to impress his European readers, using absolute language ("so vast that no one would believe it possible" and "everything they bring in is disposed of") that historians treat as descriptive color rather than a precise measurement. His account is still valuable as evidence THAT large-scale, reliably-provisioned commerce existed at Kinsay — just not as a literal statistic.',
        'STATE THE LINK TO THE COURSE THESIS. This passage is a firsthand data point for the concept\'s central claim: commercial innovation plus Mongol-secured stability produced trading cities doing business at a scale that awed even a well-traveled foreign merchant — while reminding us to read travel accounts for their perspective, not just their content.',
      ],
      answer:
        'Polo\'s account of Kinsay shows a city whose population was, in his telling, so vast that feeding it seemed unbelievable — except that "on every market-day", the squares are "thronged and crammed with purchasers, and with the traders who have brought in stores of provisions by land or water", with "everything they bring in" fully sold. That combination is exactly what the concept predicts: a trading city grown wealthy as a node in a network revived by commercial tools like credit and paper money, sustained by the kind of dependable, routine resupply consistent with the political stability of Pax Mongolica. A careful reader should note Polo is a foreign merchant writing for an audience back in Venice, prone to absolute language ("so vast that no one would believe it possible") that overstates precision even while it reliably signals that Kinsay\'s commerce genuinely impressed an experienced outside observer.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE commercial innovation that facilitated trade along the Silk Roads, 1200-1450. (b) Explain how ONE such innovation increased the volume of trade. (c) Explain ONE effect of the growth of the Silk Roads on the societies along them.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine commercial innovation of the period — e.g. caravanserai, bills of exchange/credit instruments, or Yuan-issued paper money. No credit for a vague statement ("better trade routes") with no identifiable specific innovation, or for an anachronistic/incorrect item.',
            modelResponse:
              'One commercial innovation that facilitated trade along the Silk Roads was the bill of exchange, a credit instrument that let merchants transfer wealth between cities without physically carrying coin.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate mechanism by which the named innovation increased trade volume — connects the innovation to lower risk, lower cost, or greater ease of moving goods/wealth, rather than just restating that it "helped trade." No credit for an explanation disconnected from the innovation named in (a).',
            modelResponse:
              'Because a merchant could deposit funds in one city and withdraw an equivalent sum in another, bills of exchange removed much of the risk of being robbed while carrying large amounts of silver or gold across long, dangerous overland routes — which meant merchants could safely finance larger and more frequent shipments of goods, increasing the overall volume of trade moving along the Silk Roads.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, historically accurate effect of Silk Roads growth on societies along the route — e.g. the growth and enrichment of trading cities, the spread of goods/technologies/ideas, or (if framed carefully) the spread of disease such as the Black Death along trade routes. No credit for a vague or unsupported claim.',
            modelResponse:
              'The growth of the Silk Roads enriched trading cities like Kinsay (Hangzhou) and Samarkand, which became wealthy commercial hubs as merchants, goods, and taxes concentrated at these nodes — drawing further investment in infrastructure like caravanserai and reinforcing the cities\' role as centers of long-distance exchange.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-mongols-invented-trade',
      kind: 'misconception_check',
      question:
        'True or false: the Mongols invented Silk Road trade — before the Mongol conquests, there was no significant overland trade between China and the Mediterranean world.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Crediting the Mongols with CREATING the Silk Roads rather than intensifying and securing an already-ancient network — a common conflation of 'the period Silk Road trade peaked' with 'the period Silk Road trade began.'",
          correctsTo:
            "FALSE. Overland trade networks connecting China, Central Asia, and the Mediterranean world existed for well over a thousand years before the Mongol conquests of the 1200s — long-distance exchange of silk, other goods, and ideas dates back to antiquity. What the Mongols did was not INVENT this trade but SECURE and INTENSIFY it: by conquering and unifying a huge stretch of the route under one political authority, they created the Pax Mongolica — a period where a merchant caravan faced far fewer hostile borders, bandits, and unpredictable local tolls than before. Combined with commercial innovations like bills of exchange and paper money, this produced a surge in trade VOLUME during 1200-1450, not the FIRST-EVER overland trade between China and the West.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Silk Roads were a NETWORK of many routes, not a single road — trade volume rose and fell over centuries with political stability along the way.',
        'Commercial innovations lowered the cost and risk of trade: caravanserai for physical safety and resupply, bills of exchange for moving wealth without carrying coin, and Yuan-issued paper money for a state-backed currency.',
        'Luxury goods — silk, porcelain, spices — moved along the routes because their high value justified the cost of a long overland journey.',
        'The Mongols did not invent Silk Road trade; Pax Mongolica secured and intensified an already-ancient network by unifying much of the route under one political authority.',
        'Trading cities like Kinsay (Hangzhou) and Samarkand grew wealthy as network nodes, in a self-reinforcing cycle of trade generating wealth generating more trade.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.2',
    cedTitle: 'The Silk Roads',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-marco-polo-kinsay.v1',
        chapter: 'c. 1300',
        note: 'Marco Polo, "The Travels" — anchor document for the scale of Silk-Road-era commerce at Kinsay (Hangzhou).',
      },
    ],
  },
};
