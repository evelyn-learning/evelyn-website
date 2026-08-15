/**
 * AP World History: Modern — CED Unit 2.3: The Indian Ocean Trade Network.
 *
 * Unit-2 Vertical Slice content plan, following the Silk Roads calibration
 * template (`ap-apworld-u2-silk-roads.ts`). concept = the historical
 * argument (how did monsoon-driven maritime technology and diasporic
 * merchant communities turn the Indian Ocean into an integrated commercial
 * zone, 1200-1450?); worked_example = annotated document analysis;
 * try_yourself = a 3-point SAQ-style short-answer.
 *
 * Anchor text: Ibn Battuta, Rihla (c. 1355), on the Swahili-coast city of
 * Kilwa — evelyn.passage.apworld-ibn-battuta-kilwa.v1. Teaching point is
 * what the passage reveals about the East African terminus of the Indian
 * Ocean network: a wealthy, well-built coastal city whose military posture
 * points to its position between the ocean-trade world and inland Africa.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U2_INDIAN_OCEAN_TRADE: LessonPlan = {
  id: 'evelyn.ap.apworld.indian-ocean-trade.v1',
  title: 'U2.3 The Indian Ocean Trade Network',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.indian-ocean-trade',
      description:
        'Explain how maritime technology, the predictable pattern of the monsoon winds, and the growth of port cities and diasporic merchant communities expanded trade across the Indian Ocean network in the period 1200-1450.',
      standard: 'AP-APWORLD-2.3',
    },
  ],
  prerequisites: ['apworld.silk-roads'],
  followUps: ['apworld.trans-saharan-trade'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the Indian Ocean feel like a giant, predictable commercial highway powered by wind, not a dangerous unknown.',
      script:
        "Picture an ocean so large it touches East Africa, Arabia, India, Southeast Asia, and China — and sailors in 1300 crossed it constantly, on purpose, without a compass telling them exactly where they were. How? The Indian Ocean has a secret the Atlantic doesn't: monsoon winds that blow in one direction for half the year and reverse for the other half, like a schedule you could set your calendar by. Sail out with the winter monsoon, do business for months, sail home with the summer monsoon. That predictability turned a vast, connected ocean into something closer to a shipping route with a timetable — and it built some of the wealthiest, most cosmopolitan port cities of the entire medieval world.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-indian-ocean-network',
      kind: 'concept',
      goal: 'Explain how monsoon winds, maritime technology, port cities, and diasporic merchant communities together expanded Indian Ocean trade, 1200-1450.',
      keyIdeas: [
        'THE INDIAN OCEAN NETWORK linked East Africa, the Arabian Peninsula, South Asia (India), Southeast Asia, and China into one interconnected maritime trading zone — the largest and, by many measures, the most valuable commercial network in the world before 1500.',
        'MONSOON WINDS made the network reliable rather than a gamble: seasonal winds blew from the northeast in winter and reversed to blow from the southwest in summer. A merchant could plan a round trip around this predictable cycle — sail with one monsoon, trade, and return with the reversed monsoon months later — turning ocean crossings into routine, repeatable business rather than one-off risky voyages.',
        'THE DHOW was the key vessel of the western Indian Ocean: a wooden ship with a triangular LATEEN SAIL that could sail effectively across and against the wind, not just downwind — letting Arab, Persian, Swahili, and Indian sailors work the monsoon cycle efficiently. (Chinese junks, with stronger hulls and multiple masts, played a comparable role on the eastern end of the network.)',
        'SWAHILI CITY-STATES grew along the East African coast as the network\'s African terminus: cities like KILWA, Mombasa, and Mogadishu grew wealthy exporting African goods — gold (relayed from inland kingdoms such as Great Zimbabwe), ivory, and enslaved people — in exchange for imported textiles, ceramics, and glass from Arabia, Persia, India, and China. Swahili culture itself was a blend, combining Bantu African roots with Arabic and Islamic influence carried by ocean-trade contact — a fusion visible in the Swahili (Kiswahili) language itself, a Bantu language that absorbed substantial Arabic loanwords.',
        'DIASPORIC MERCHANT COMMUNITIES stitched the network together socially, not just economically: Arab, Persian, Gujarati (Indian), and Chinese merchants settled semi-permanently in foreign port cities, marrying locally and forming long-term trading networks built on personal trust and shared religious or commercial ties — Muslim merchant communities in particular linked ports across the network through a common faith, language of commerce, and legal framework.',
        'GOODS moved in huge volume and variety: spices (pepper, cinnamon, cloves) from South and Southeast Asia, textiles and gems from India, porcelain from China, and gold, ivory, and enslaved people from East Africa — high-value goods that could justify a long sea voyage, alongside bulkier staple goods that maritime transport (cheaper per unit than overland caravans) could carry more economically than the Silk Roads could.',
        'PORT CITIES were the physical nodes of the network: coastal cities with good harbors — Kilwa, Calicut, Malacca, Hormuz, Aden — grew wealthy and cosmopolitan by taxing and servicing the merchants, ships, and goods passing through, becoming melting pots of language, religion, and culture from across the ocean basin.',
        "THE COMBINED EFFECT: predictable monsoon winds plus adaptable ship technology made long ocean voyages routine; diasporic merchant communities and shared commercial/religious frameworks made trust across vast distances possible; together they built an integrated maritime commercial zone linking Africa, the Middle East, and Asia — expanding on, and eventually overtaking in volume, the overland Silk Roads network.",
      ],
      vocabulary: [
        {
          term: 'monsoon',
          definition:
            'a seasonal wind system in the Indian Ocean basin that reverses direction roughly twice a year, allowing sailors to plan predictable round-trip voyages timed to the wind cycle.',
        },
        {
          term: 'dhow',
          definition:
            'a wooden sailing vessel, common in the western Indian Ocean, equipped with a triangular lateen sail that allowed it to sail effectively across and against the wind.',
        },
        {
          term: 'Swahili city-states',
          definition:
            'a chain of independent, commercially wealthy city-states along the East African coast (including Kilwa, Mombasa, and Mogadishu) that blended Bantu African and Islamic/Arabic influences through Indian Ocean trade contact.',
        },
        {
          term: 'diasporic merchant community',
          definition:
            'a community of foreign merchants who settled semi-permanently in a trading port far from their homeland, often intermarrying locally, and who used shared trust, language, or religion to link distant ports into one commercial network.',
        },
      ],
      passageId: 'evelyn.passage.apworld-ibn-battuta-kilwa.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-ibn-battuta-kilwa',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Ibn Battuta\'s account of his visit to Kilwa on the East African coast (c. 1331): "Kulwa is a very fine and substantially built town, and all its buildings are of wood. Its inhabitants are constantly engaged in military expeditions, for their country is contiguous to the heathen Zanj." What does this passage reveal about Kilwa\'s position in the Indian Ocean network, and what should a careful reader keep in mind about the source?',
      steps: [
        'SOURCE IT FIRST. Who, when, why? Ibn Battuta, a Moroccan Muslim legal scholar and prolific traveler, visiting the East African coast around 1331 during a decades-long journey across the Islamic world, later dictating his Rihla (travel account) to a scribe back in Morocco.',
        'IDENTIFY THE CLAIM. Ibn Battuta calls Kilwa "very fine and substantially built" — a mark of real prosperity and skilled construction, not a small fishing village — while also noting its people were "constantly engaged in military expeditions" against the "heathen Zanj," the non-Muslim African peoples of the interior.',
        "CONNECT TO THE PORT-CITY-WEALTH CAUSE. A description of substantial, impressive buildings is direct testimony for the concept's claim that Swahili coast cities grew genuinely wealthy as nodes of the Indian Ocean network — wealth built on exporting gold, ivory, and other African goods in exchange for imported textiles, ceramics, and glass.",
        'CONNECT TO THE FRONTIER-POSITION DETAIL. The note about military expeditions against inland peoples is a small but telling detail: it shows Kilwa sat at a frontier BETWEEN the Indian Ocean trading world (Muslim, coastal, connected by monsoon-driven sea trade) and the African interior it depended on for gold and other goods — a position that generated both profit and conflict.',
        'WEIGH THE SOURCE\'S RELIABILITY. Ibn Battuta writes as a Muslim scholar from North Africa, and his description of the interior peoples as "heathen" reflects his own religious framing rather than a neutral ethnography — a lens worth noting even while his physical description of the town\'s construction is treated as credible eyewitness detail.',
        "STATE THE LINK TO THE COURSE THESIS. This passage is firsthand evidence for the concept's central claim: a Swahili coast city built substantial wealth as an Indian Ocean network node, sitting at a frontier between ocean-borne Islamic commercial culture and the African interior that supplied much of its trade goods.",
      ],
      answer:
        'Ibn Battuta\'s account of Kilwa shows a coastal city that was genuinely prosperous — "very fine and substantially built" — consistent with the concept\'s claim that Swahili city-states grew wealthy as nodes in the Indian Ocean network, exporting African gold and other goods for imported textiles and ceramics. His note about "military expeditions" against the neighboring "Zanj" reveals Kilwa\'s position at the frontier between the ocean-trade world and the African interior it depended on. A careful reader should note that Ibn Battuta, a Muslim legal scholar from Morocco, frames the interior peoples through his own religious lens ("heathen"), which colors his characterization even as his description of the town\'s wealth remains credible eyewitness testimony.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE technology or environmental factor that facilitated maritime trade across the Indian Ocean, 1200-1450. (b) Explain how ONE such factor increased the volume or reliability of Indian Ocean trade. (c) Explain ONE effect of Indian Ocean trade on a society connected to the network.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine factor — e.g. the monsoon wind pattern, the lateen-sailed dhow, or the Chinese junk. No credit for a vague statement ("better ships") with no identifiable specific factor, or for an anachronistic/incorrect item.',
            modelResponse:
              'One factor that facilitated maritime trade across the Indian Ocean was the predictable monsoon wind pattern, which reversed direction seasonally.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate mechanism by which the named factor increased trade volume or reliability — connects it to predictability, safety, or efficiency of voyages, rather than just restating that it "helped trade." No credit for an explanation disconnected from the factor named in (a).',
            modelResponse:
              'Because the monsoon winds blew from one direction for months and then reversed, merchants could plan round-trip voyages around a predictable schedule — sailing out with one monsoon and returning with the reversed monsoon — which let trade happen routinely and at scale instead of remaining a rare, risky gamble.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, historically accurate effect of Indian Ocean trade on a connected society — e.g. the growth and wealth of Swahili city-states like Kilwa, the spread of Islam along the coast, or the growth of diasporic merchant communities in port cities. No credit for a vague or unsupported claim.',
            modelResponse:
              'Indian Ocean trade transformed East African coastal societies: cities like Kilwa grew wealthy exporting gold and ivory for imported textiles and ceramics, and sustained contact with Arab and Persian Muslim merchants helped spread Islam and Arabic influence, producing the blended Swahili culture and language of the coast.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-monsoon-random',
      kind: 'misconception_check',
      question:
        "True or false: sailors crossing the Indian Ocean before 1450 faced essentially random, unpredictable winds, so successful voyages were mostly a matter of luck rather than planning.",
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Assuming pre-modern ocean travel was always a matter of luck because sailors lacked modern instruments — missing the fact that the Indian Ocean's monsoon system was a well-understood, PREDICTABLE seasonal pattern that merchants planned around for centuries.",
          correctsTo:
            'FALSE. The Indian Ocean basin has a distinctive monsoon wind system that reverses direction on a reliable seasonal schedule — blowing from the northeast in winter and the southwest in summer. Sailors and merchants understood this pattern well and planned voyages around it: sail out with one monsoon, conduct business at the destination for months, then sail home with the reversed monsoon. This predictability, not luck, is exactly why the Indian Ocean supported such a large, routine, and profitable trading network — a merchant could reasonably plan a round trip the way a modern business might plan a shipping schedule, something far harder to do on an ocean without a comparable wind pattern.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Indian Ocean network linked East Africa, Arabia, India, Southeast Asia, and China into the largest maritime trading zone in the medieval world.',
        'Monsoon winds reversed seasonally and predictably, letting merchants plan round-trip voyages around the wind cycle rather than gambling on the weather.',
        'The lateen-sailed dhow (and the Chinese junk on the eastern end) let sailors work the monsoon cycle efficiently across and against the wind.',
        'Swahili city-states like Kilwa grew wealthy as the network\'s African terminus, exporting gold, ivory, and enslaved people for imported textiles, ceramics, and glass.',
        'Diasporic merchant communities — Arab, Persian, Gujarati, Chinese — settled in foreign ports and used shared trust, language, and religion to link distant nodes of the network.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.3',
    cedTitle: 'The Indian Ocean Trade Network',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-ibn-battuta-kilwa.v1',
        chapter: 'c. 1355',
        note: 'Ibn Battuta, "Rihla" — anchor document for Kilwa as the East African terminus of the Indian Ocean network.',
      },
    ],
  },
};
