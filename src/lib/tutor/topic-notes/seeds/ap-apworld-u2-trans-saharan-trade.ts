/**
 * AP World History — Unit 2 CED 2.4: The Trans-Saharan Trade Network.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.trans-saharan-trade.v1`. Covers the camel caravan
 * that made desert crossing possible, the gold-salt trade at the network's
 * economic core, the Mali Empire's rise as a controller (not owner) of
 * that trade, Mansa Musa's 1324 hajj, and the spread of Islam across the
 * Sahel, 1200-1450.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_TRANS_SAHARAN_TRADE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.trans-saharan-trade.v1',
  course: 'AP World History',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'The Trans-Saharan Trade Network',
  planId: 'evelyn.ap.apworld.trans-saharan-trade.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.trans-saharan-trade.v1' }],
  theory: [
    {
      loId: 'apworld.trans-saharan-trade',
      kind: 'definition',
      title: 'trans-Saharan trade',
      content:
        'The network of camel-caravan trade routes crossing the Sahara Desert, linking West Africa to North Africa and, through North African ports, to the wider Mediterranean and Islamic world — turning the Sahara from a barrier into a commercial corridor.',
    },
    {
      loId: 'apworld.trans-saharan-trade',
      kind: 'definition',
      title: 'gold-salt trade',
      content:
        "The core exchange of the trans-Saharan network: salt mined in the Sahara itself (notably at Taghaza) moved south, where it was desperately needed for preserving food and human health in tropical West Africa; gold mined in West African goldfields (notably around the Akan forest region and Bambuk/Bure) moved north. Each side had what the other lacked.",
    },
    {
      loId: 'apworld.trans-saharan-trade',
      kind: 'definition',
      title: 'Mali Empire',
      content:
        'A powerful West African empire (c. 1230s-1600) that grew wealthy by controlling and taxing trans-Saharan trade routes and market cities, reaching its height of wealth and fame under Mansa Musa. Its power rested on commercial and political control of exchange, not on mining or owning most of the gold itself.',
    },
    {
      loId: 'apworld.trans-saharan-trade',
      kind: 'definition',
      title: 'hajj',
      content:
        "The Islamic pilgrimage to Mecca, one of the Five Pillars of Islam. Mansa Musa's 1324 hajj through Cairo displayed Mali's wealth to the wider Islamic and Mediterranean world and placed Mali on the mental map of that world.",
    },
    {
      loId: 'apworld.trans-saharan-trade',
      kind: 'event',
      title: 'the camel made the crossing possible',
      content:
        'Camels can travel for days without water, carry heavy loads, and endure desert heat far better than horses or oxen. The camel saddle, adapted for desert travel, let traders control large pack animals efficiently. Caravans of hundreds or even over a thousand camels crossed together for safety and to share the logistical burden.',
    },
    {
      loId: 'apworld.trans-saharan-trade',
      kind: 'event',
      title: "Mansa Musa's 1324 hajj",
      content:
        "Mali's most famous ruler (r. c. 1312-1337) converted to Islam and used his 1324 hajj to Mecca to display Mali's wealth on an international stage, famously distributing so much gold in Cairo that its market value reportedly dropped for years afterward. He was later depicted holding a gold nugget on the European Catalan Atlas (1375).",
    },
    {
      loId: 'apworld.trans-saharan-trade',
      kind: 'cause',
      title: 'Islam spread through trade contact',
      content:
        'North African Muslim merchants brought their faith along the caravan routes, and West African rulers — including Mansa Musa — converted, in part because shared religion with trading partners eased business relationships, access to Islamic legal/commercial networks, and diplomatic ties with the wider Muslim world. Conversion was concentrated among rulers and urban merchant classes; traditional African religions persisted widely, especially in rural areas.',
    },
    {
      loId: 'apworld.trans-saharan-trade',
      kind: 'event',
      title: 'Timbuktu and Gao as commercial and intellectual hubs',
      content:
        'Trade cities like Timbuktu and Gao grew into major commercial AND intellectual centers — Timbuktu in particular became famous for Islamic scholarship, manuscripts, and its university-mosque complex, showing how trade wealth translated into cultural and educational investment, not just material riches.',
    },
    {
      loId: 'apworld.trans-saharan-trade',
      kind: 'framework',
      title: 'how the causes combine',
      content:
        'Camel technology made the desert crossable; the gold-salt exchange gave traders something valuable to move in both directions; the Mali Empire built political power by controlling that exchange; and the resulting cross-Sahara contact carried Islam, scholarship, and Mediterranean connections deep into West Africa.',
    },
    {
      loId: 'apworld.trans-saharan-trade',
      kind: 'event',
      title: 'al-Umari on Mansa Musa in Cairo (c. 1340)',
      content:
        'al-Umari, an Egyptian administrator writing roughly 15 years after Mansa Musa\'s visit, reported that Mansa Musa "flooded Cairo with his benefactions," giving gold to every court official, and that Cairenes "exchanged gold until they depressed its value in Egypt." Writing secondhand years later, the multi-year price-depression claim should be read cautiously — even though Mali\'s exceptional wealth is well corroborated by other sources.',
    },
    {
      loId: 'apworld.trans-saharan-trade',
      kind: 'trap',
      title: 'controlling trade ≠ owning the gold',
      content:
        "Mali's wealth did not come mainly from mines inside Mali's own core territory — much of West Africa's gold was mined further south, in goldfields controlled by other peoples and polities. Mali's wealth came primarily from controlling and TAXING the trade routes and market cities through which that gold moved north, a position closer to a toll-collector than a direct owner of the gold source.",
    },
  ],
  methods: [
    {
      title: 'Source and analyze a trans-Saharan trade document (HIPP)',
      when_to_use:
        'Use this as the first move on any unfamiliar primary-source excerpt describing Mali, the gold-salt trade, or Mansa Musa\'s hajj, before making any claim about what the text shows or why it matters.',
      steps: [
        'H — HISTORICAL CONTEXT: what was happening at the moment this was written? How close in time and space was the writer to the events described?',
        'I — INTENDED AUDIENCE: who is the writer addressing, and what does the writer want that audience to understand?',
        'P — PURPOSE: state the purpose as a verb (what the writer wants the text to DO), not a topic.',
        "P — POINT OF VIEW: what about the writer's role (administrator, geographer, secondhand compiler) shapes the claim's reliability?",
        'CONNECT TO A CAUSE: tie the detail back to a causal strand — the gold-salt trade\'s economic engine, Mali\'s political control of trade routes, or Islam\'s spread via merchant/pilgrim contact.',
      ],
      example: {
        problem:
          'Analyze this excerpt from al-Umari\'s account (c. 1340) of Mansa Musa\'s 1324 visit to Cairo: "This man flooded Cairo with his benefactions. He left no court emir nor holder of a royal office without the gift of a load of gold... They exchanged gold until they depressed its value in Egypt and caused its price to fall." What does this reveal about the scale of Mali\'s wealth, and what should a careful reader keep in mind about the source?',
        solution:
          "Historical context: al-Umari, an Egyptian administrator and geographer, wrote roughly 15 years after Mansa Musa's 1324 hajj through Cairo, compiling testimony from witnesses. Purpose: to record an extraordinary event for an Egyptian/Islamic-world audience. Point of view: as a secondhand compiler writing years later, his claim that gold prices fell for years is a dramatic, hard-to-verify economic detail that historians treat with some caution. Connecting to cause: the description of gold gifts to every Cairene official is direct evidence for Mali's control of West African gold wealth on a massive scale, and the scene itself — a West African ruler on hajj, recorded by Egyptian officials — shows Mali's integration into the wider Islamic Mediterranean world via trans-Saharan trade.",
      },
      relatedLoIds: ['apworld.trans-saharan-trade'],
    },
  ],
  pointers: [
    { content: "Mali did not mine or own most of West Africa's gold — it grew wealthy by controlling and TAXING the trade routes and market cities the gold passed through. This is the #1 tested misconception for this topic.", kind: 'trap' },
    { content: 'The gold-salt trade is a classic each-side-has-what-the-other-lacks exchange: salt from the Sahara moved south, gold from West African goldfields moved north.', kind: 'tip' },
    { content: 'The camel and camel saddle made the Sahara crossable — keep this distinct from the Mongol yam relay system, which is a different technology in a different region for a different unit.', kind: 'tip' },
    { content: "Mansa Musa's 1324 hajj through Cairo is the era's best-documented display of West African wealth to the Islamic Mediterranean world — know the date and the route (Mali → Cairo → Mecca).", kind: 'tip' },
    { content: 'al-Umari\'s claim that gold prices fell "for years" is a dramatic secondhand claim written ~15 years after the event — treat the specific economic detail cautiously even though Mali\'s overall wealth is well corroborated.', kind: 'trap' },
    { content: 'Islamic conversion in West Africa was concentrated among rulers and urban merchant classes first; traditional African religions persisted widely, especially in rural areas — avoid overstating universal conversion.', kind: 'tip' },
  ],
};
