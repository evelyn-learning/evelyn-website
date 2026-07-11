/**
 * AP World History — Unit 2 CED 2.6: Cultural, Technological, and
 * Biological Diffusion Along Trade Routes.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.cultural-diffusion.v1`. Covers how the same trade
 * networks that carried goods also diffused religions (Islam, Buddhism,
 * Neo-Confucianism), technologies (paper-making, gunpowder, navigation
 * instruments), crops (Champa rice), and disease (the Black Death),
 * 1200-1450, and the consequences of that diffusion.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_CULTURAL_DIFFUSION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.cultural-diffusion.v1',
  course: 'AP World History',
  cedUnit: 2,
  cedTopic: '2.6',
  cedTitle: 'Cultural, Technological, and Biological Diffusion Along Trade Routes',
  planId: 'evelyn.ap.apworld.cultural-diffusion.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.cultural-diffusion.v1' }],
  theory: [
    {
      loId: 'apworld.cultural-diffusion',
      kind: 'definition',
      title: 'diffusion',
      content:
        'The spread of a practice, belief, technology, or biological agent from its point of origin outward, typically along the same routes and contacts already used for trade — merchants, missionaries, and travelers were the carriers, whether or not spreading something new was their intent.',
    },
    {
      loId: 'apworld.cultural-diffusion',
      kind: 'definition',
      title: 'gunpowder',
      content:
        'A Chinese-origin weapons technology that diffused westward along Afro-Eurasian trade networks during this period, eventually transforming warfare across the connected world.',
    },
    {
      loId: 'apworld.cultural-diffusion',
      kind: 'definition',
      title: 'Black Death',
      content:
        "The catastrophic plague pandemic, likely originating in Central Asia, that spread westward along Mongol-secured trade routes and killed an estimated one-third or more of Europe's population by the mid-1300s.",
    },
    {
      loId: 'apworld.cultural-diffusion',
      kind: 'definition',
      title: 'labor shortage (post-plague)',
      content:
        "A consequence of the Black Death's massive death toll: with far fewer workers available, surviving peasants and laborers in Europe gained increased bargaining power, contributing to the erosion of some feudal labor obligations.",
    },
    {
      loId: 'apworld.cultural-diffusion',
      kind: 'event',
      title: 'Islam spread along trade routes',
      content:
        'Muslim merchants carried their faith across the Sahel via trans-Saharan trade (leading rulers like Mansa Musa to convert) and across the Indian Ocean basin to Swahili coast cities and Southeast Asian ports, often adopted first by rulers and urban merchant classes seeking commercial and diplomatic advantages before spreading more broadly.',
    },
    {
      loId: 'apworld.cultural-diffusion',
      kind: 'event',
      title: 'Buddhism and Neo-Confucianism diffused earlier and eastward',
      content:
        "Buddhism had earlier spread along the Silk Roads from South Asia into Central Asia, China, and beyond, carried by monks and merchants — an older precedent for the trade-carries-religion pattern. Neo-Confucianism, a revival and reworking of classical Confucian thought blending it with Buddhist and Daoist ideas, flourished in Song China and then spread to Korea, Japan, and Vietnam as those societies adopted Chinese-style bureaucratic governance and civil-service examination culture.",
    },
    {
      loId: 'apworld.cultural-diffusion',
      kind: 'event',
      title: 'technologies diffused in multiple directions',
      content:
        'Paper-making and printing technology, long established in China, spread westward through the Islamic world and eventually into Europe. Gunpowder weapons technology, also originating in China, spread westward and transformed warfare. The magnetic compass and improvements to the astrolabe spread and improved long-distance navigation for sailors across the Indian Ocean and beyond.',
    },
    {
      loId: 'apworld.cultural-diffusion',
      kind: 'event',
      title: 'Champa rice reshaped everyday economic life',
      content:
        "A fast-ripening, drought-resistant rice variety introduced from Champa (in what is now Vietnam) into Song China, where its shorter growing season allowed multiple harvests per year and helped drive substantial population growth — part of a broader pattern where connectivity reshaped everyday economic life, not just elite courts and marketplaces.",
    },
    {
      loId: 'apworld.cultural-diffusion',
      kind: 'cause',
      title: 'the Black Death spread along Mongol-secured routes',
      content:
        "The plague pathogen moved westward along the same secured Mongol-era trade routes that carried silk, silver, and scholars, reaching the Middle East and Europe by the late 1340s. Its consequences extended well beyond the immediate death toll: severe labor shortages in Europe increased the bargaining power of surviving peasants and workers and helped erode some feudal labor obligations, while social and religious upheaval followed as communities struggled to explain a catastrophe of that scale.",
    },
    {
      loId: 'apworld.cultural-diffusion',
      kind: 'framework',
      title: 'diffusion and goods-trade were the same process',
      content:
        'The very connectivity that revived the Silk Roads, integrated the Indian Ocean, expanded trans-Saharan exchange, and secured Mongol Eurasia was a double-edged achievement: it diffused religions, useful technologies, and crops that reshaped societies for the better in many ways, while also diffusing a pathogen whose demographic and social consequences were among the most severe in recorded history.',
    },
    {
      loId: 'apworld.cultural-diffusion',
      kind: 'event',
      title: 'Marco Polo on Yuan paper money (c. 1300)',
      content:
        'Marco Polo documented an elaborate, state-authenticated Yuan currency system — officials\' signatures, a formal vermilion seal — entirely unfamiliar to contemporary Europe. This is diffusion caught in its earliest stage: an idea observed at a network node, carried home by a traveler, and recorded for an audience who had never seen anything like it, even before the technology itself transferred.',
    },
    {
      loId: 'apworld.cultural-diffusion',
      kind: 'trap',
      title: 'goods trade and diffusion are not separate processes',
      content:
        'Treating goods-trade and cultural/biological diffusion as separate historical processes misses the central point: they traveled along the SAME routes, carried by the SAME people — a merchant on a trans-Saharan caravan carried both goods AND his faith; a traveler on Mongol-secured roads could carry silk, an account of Chinese paper currency, AND (unknowingly) plague-carrying fleas, all on the same journey.',
    },
  ],
  methods: [
    {
      title: 'Source and analyze a technological-diffusion document (HIPP)',
      when_to_use:
        'Use this as the first move on any unfamiliar primary-source excerpt describing a foreign technology, practice, or institution observed and reported by a traveler, before making any claim about what the text shows or why it matters.',
      steps: [
        'H — HISTORICAL CONTEXT: what was happening at the moment this was written? What made this kind of cross-cultural observation possible?',
        'I — INTENDED AUDIENCE: who is the writer addressing, and how familiar is that audience with what is being described?',
        'P — PURPOSE: state the purpose as a verb (what the writer wants the text to DO), not a topic.',
        "P — POINT OF VIEW: what about the writer's access (outside observer vs. insider) shapes what they could accurately describe?",
        'CONNECT TO A CAUSE: tie the detail back to the diffusion mechanism — an idea/technology observed at a network node and carried onward by a traveler.',
      ],
      example: {
        problem:
          'Analyze this excerpt from Marco Polo\'s account (c. 1300) of Yuan paper currency: "All these pieces of paper are issued with as much solemnity and authority as if they were of pure gold or silver; and on every piece a variety of officials... have to write their names, and to put their seals." What does this reveal about the diffusion of ideas along trade networks?',
        solution:
          "Historical context: Polo observed Yuan paper currency firsthand while residing in Kublai Khan's China in the late 1200s. Purpose: to describe an unfamiliar wonder to a European audience still using metal coinage. Point of view: as an outside merchant-observer without bureaucratic insider access, his account describes the visible ceremony of the process (seals, signatures) rather than the underlying monetary theory. Connecting to cause: this passage is diffusion in its earliest stage — an idea observed at a trade network's node, carried home by a traveler, and recorded for an audience who had never seen anything like it, made possible only by the Mongol-secured trade contact that let a European merchant sustain that kind of cross-cultural observation in the first place.",
      },
      relatedLoIds: ['apworld.cultural-diffusion'],
    },
    {
      title: 'Answer a document-based SAQ from a quoted primary source',
      when_to_use:
        'Use this when an SAQ quotes a primary-source excerpt directly in the prompt (e.g. the Boccaccio Black Death excerpt) and asks you to identify, explain, and extend from it.',
      steps: [
        'PART (a) — IDENTIFY: quote or closely paraphrase the specific claim the excerpt makes; do not answer from outside knowledge if the question asks what the document itself states.',
        'PART (b) — EXPLAIN A MECHANISM: connect the document\'s claim to a specific historical cause (e.g. Mongol-secured trade routes) using accurate outside knowledge, not just restating the document.',
        'PART (c) — EXTEND TO A CONSEQUENCE: explain one specific, accurate downstream effect (social, economic, or political) that follows from what the document describes.',
        'Keep each part\'s answer scoped to exactly what it asks — (a) is document-only, (b) and (c) require outside historical knowledge the document does not supply.',
      ],
      example: {
        problem:
          'Boccaccio\'s Decameron (c. 1353) states the plague "had had its origin some years before in the East... and so, calamitously, had spread into the West." (a) Where does Boccaccio say the plague originated? (b) How did trade networks make that spread possible? (c) What was one social/economic consequence of the plague?',
        solution:
          '(a) Boccaccio states the pestilence "had had its origin some years before in the East." (b) The plague traveled "into the West" because the same Mongol-secured trade routes that safely carried merchants, goods, and information rapidly across Eurasia during the Pax Mongolica also carried the disease-causing pathogen along with travelers and goods moving westward. (c) The resulting labor shortage from Europe\'s massive population loss gave surviving peasants and workers more bargaining power over wages and conditions, contributing to the erosion of some feudal labor obligations.',
      },
      relatedLoIds: ['apworld.cultural-diffusion'],
    },
  ],
  pointers: [
    { content: 'Goods trade and cultural/biological diffusion are NOT separate processes — the same routes and the same travelers carried both, often on the same journey. This is the #1 tested misconception for this topic.', kind: 'trap' },
    { content: 'Champa rice (introduced from Vietnam into Song China) is a crop-diffusion example — don\'t forget crops when a question asks for "something" that diffused beyond religion/technology.', kind: 'tip' },
    { content: 'The Black Death likely originated in Central Asia and spread west via Mongol-secured routes, reaching the Middle East and Europe by the late 1340s — know the direction (east to west) and the mechanism (Pax Mongolica trade routes).', kind: 'tip' },
    { content: "The plague's labor shortage increased peasant bargaining power and helped erode some feudal obligations — a testable social/economic consequence, not just a death toll.", kind: 'tip' },
    { content: 'Religious diffusion (Islam, Buddhism, Neo-Confucianism) was typically concentrated among rulers and urban merchant classes first — don\'t assume universal or immediate conversion of entire populations.', kind: 'trap' },
    { content: 'Marco Polo\'s paper-money account shows diffusion of an IDEA via a written account, even before the technology itself transferred to Europe — a good example when a question distinguishes diffusion of practices from diffusion of physical objects.', kind: 'tip' },
  ],
};
