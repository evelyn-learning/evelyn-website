/**
 * AP World History — Unit 2 CED 2.3: The Indian Ocean Trade Network.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.indian-ocean-trade.v1`. Covers the monsoon wind
 * system that made ocean crossings predictable, the maritime technology
 * (dhow, lateen sail) that exploited it, the Swahili city-states and
 * diasporic merchant communities the network built, and the goods that
 * moved across it, 1200-1450.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_INDIAN_OCEAN_TRADE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.indian-ocean-trade.v1',
  course: 'AP World History',
  cedUnit: 2,
  cedTopic: '2.3',
  cedTitle: 'The Indian Ocean Trade Network',
  planId: 'evelyn.ap.apworld.indian-ocean-trade.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.indian-ocean-trade.v1' }],
  theory: [
    {
      loId: 'apworld.indian-ocean-trade',
      kind: 'definition',
      title: 'Indian Ocean network',
      content:
        'A maritime trading zone linking East Africa, the Arabian Peninsula, South Asia (India), Southeast Asia, and China — the largest and, by many measures, the most valuable commercial network in the world before 1500.',
    },
    {
      loId: 'apworld.indian-ocean-trade',
      kind: 'definition',
      title: 'monsoon',
      content:
        'A seasonal wind system in the Indian Ocean basin that reverses direction roughly twice a year — blowing from the northeast in winter and the southwest in summer. Its predictability let merchants plan round-trip voyages around the wind cycle rather than gambling on the weather.',
    },
    {
      loId: 'apworld.indian-ocean-trade',
      kind: 'definition',
      title: 'dhow',
      content:
        'A wooden sailing vessel common in the western Indian Ocean, equipped with a triangular lateen sail that let it sail effectively across and against the wind, not just downwind — letting Arab, Persian, Swahili, and Indian sailors work the monsoon cycle efficiently. Chinese junks, with stronger hulls and multiple masts, played a comparable role on the eastern end of the network.',
    },
    {
      loId: 'apworld.indian-ocean-trade',
      kind: 'definition',
      title: 'Swahili city-states',
      content:
        'A chain of independent, commercially wealthy city-states along the East African coast — including Kilwa, Mombasa, and Mogadishu — that blended Bantu African and Islamic/Arabic influences through Indian Ocean trade contact, visible today in Kiswahili, a Bantu language with substantial Arabic loanwords.',
    },
    {
      loId: 'apworld.indian-ocean-trade',
      kind: 'definition',
      title: 'diasporic merchant community',
      content:
        'A community of foreign merchants who settled semi-permanently in a trading port far from their homeland, often intermarrying locally, and who used shared trust, language, or religion — especially Islam — to link distant ports into one commercial network.',
    },
    {
      loId: 'apworld.indian-ocean-trade',
      kind: 'cause',
      title: 'monsoon predictability made voyages routine',
      content:
        'Because the winds blew from one direction for months and then reversed, merchants could plan round-trip voyages around a predictable schedule — sail out with one monsoon, trade, and return with the reversed monsoon — turning ocean crossings into routine, repeatable business instead of a rare, risky gamble.',
    },
    {
      loId: 'apworld.indian-ocean-trade',
      kind: 'event',
      title: 'goods traded across the network',
      content:
        'Spices (pepper, cinnamon, cloves) from South and Southeast Asia, textiles and gems from India, porcelain from China, and gold, ivory, and enslaved people from East Africa moved in huge volume — high-value goods justifying long sea voyages, alongside bulkier staple goods that maritime transport carried more economically per unit than the overland Silk Roads could.',
    },
    {
      loId: 'apworld.indian-ocean-trade',
      kind: 'event',
      title: 'port cities as network nodes',
      content:
        'Coastal cities with good harbors — Kilwa, Calicut, Malacca, Hormuz, Aden — grew wealthy and cosmopolitan by taxing and servicing the merchants, ships, and goods passing through, becoming melting pots of language, religion, and culture from across the ocean basin.',
    },
    {
      loId: 'apworld.indian-ocean-trade',
      kind: 'framework',
      title: 'how the causes combine',
      content:
        'Predictable monsoon winds plus adaptable ship technology (the dhow, the junk) made long ocean voyages routine; diasporic merchant communities and shared commercial/religious frameworks made trust across vast distances possible. Together they built an integrated maritime commercial zone linking Africa, the Middle East, and Asia.',
    },
    {
      loId: 'apworld.indian-ocean-trade',
      kind: 'event',
      title: 'Ibn Battuta at Kilwa (c. 1331)',
      content:
        'Ibn Battuta, a Moroccan Muslim legal scholar traveling the Islamic world, described Kilwa as "a very fine and substantially built town" whose people were "constantly engaged in military expeditions" against the "heathen Zanj" of the interior — evidence of both real coastal wealth and Kilwa\'s frontier position between the ocean-trade world and inland Africa. His framing of interior peoples reflects his own religious lens, worth noting even as his description of the town\'s construction is treated as credible eyewitness detail.',
    },
    {
      loId: 'apworld.indian-ocean-trade',
      kind: 'trap',
      title: 'the monsoon was predictable, not random',
      content:
        'Pre-modern ocean travel is often assumed to be pure luck because sailors lacked modern instruments. In the Indian Ocean, the monsoon system was a well-understood, predictable seasonal pattern that merchants planned around for centuries — the reason the basin supported such a large, routine trading network.',
    },
  ],
  methods: [
    {
      title: 'Source and analyze an Indian Ocean-era document (HIPP)',
      when_to_use:
        'Use this as the first move on any unfamiliar primary-source excerpt describing Indian Ocean trade or the port cities it built, before making any claim about what the text shows or why it matters.',
      steps: [
        'H — HISTORICAL CONTEXT: what was happening at the moment this was written? What was the writer\'s relationship to the region — resident, visitor, official?',
        'I — INTENDED AUDIENCE: who is the writer addressing, and what does the writer want that audience to understand or believe?',
        'P — PURPOSE: state the purpose as a verb (what the writer wants the text to DO), not a topic.',
        "P — POINT OF VIEW: what about the writer's own religion, origin, or role shapes how they describe the people or place?",
        'CONNECT TO A CAUSE: tie the detail back to a causal strand — monsoon-driven maritime trade, port-city wealth, or diasporic merchant networks.',
      ],
      example: {
        problem:
          'Analyze this excerpt from Ibn Battuta\'s account of Kilwa (c. 1331): "Kulwa is a very fine and substantially built town, and all its buildings are of wood. Its inhabitants are constantly engaged in military expeditions, for their country is contiguous to the heathen Zanj." What does this reveal about Kilwa\'s position in the Indian Ocean network, and what should a careful reader keep in mind about the source?',
        solution:
          'Historical context: Ibn Battuta, a Moroccan Muslim scholar, visited the East African coast around 1331 during a decades-long journey across the Islamic world. Purpose: to document the extent of the Islamic world he traveled through. Point of view: as a Muslim scholar from North Africa, his description of the interior peoples as "heathen" reflects his own religious framing, not a neutral ethnography. Connecting to cause: "very fine and substantially built" is direct evidence for port-city wealth built on the gold/ivory-for-textiles/ceramics exchange, while the note on "military expeditions" against the interior shows Kilwa\'s frontier position between the ocean-trade world and the African interior that supplied much of its trade goods.',
      },
      relatedLoIds: ['apworld.indian-ocean-trade'],
    },
  ],
  pointers: [
    { content: 'Monsoon winds were predictable and reversed on a reliable seasonal schedule — never describe pre-modern Indian Ocean voyages as a matter of "luck."', kind: 'trap' },
    { content: 'Distinguish the two key vessels: the lateen-sailed dhow worked the western/Arabian side of the network; the Chinese junk played a comparable role on the eastern side.', kind: 'tip' },
    { content: 'Swahili culture is a genuine fusion — Bantu African roots plus Arabic/Islamic influence — visible in the Kiswahili language itself, not simply "African cities that adopted Islam."', kind: 'tip' },
    { content: 'Don\'t read Ibn Battuta\'s description of the "heathen Zanj" as neutral reporting — it reflects his own position as a Muslim scholar, even while his physical description of Kilwa\'s wealth is credible.', kind: 'trap' },
    { content: 'Diasporic merchant communities (Arab, Persian, Gujarati, Chinese) linked ports through shared trust, language, and religion — not just through the goods they carried.', kind: 'tip' },
    { content: 'The Indian Ocean network eventually overtook the Silk Roads in trade volume, in part because maritime transport was cheaper per unit than overland caravans for bulkier goods.', kind: 'tip' },
  ],
};
