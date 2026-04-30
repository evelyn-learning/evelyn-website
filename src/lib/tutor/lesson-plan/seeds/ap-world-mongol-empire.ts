/**
 * AP World History — Mongol Empire (1206-1368).
 *
 * The largest contiguous empire in history. Pax Mongolica's effects
 * on trade, ideas, plague.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_WORLD_MONGOL_EMPIRE: LessonPlan = {
  id: 'evelyn.ap.world.mongol-empire.v1',
  title: 'The Mongol Empire',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.mongol-empire',
      description: 'Analyze the rise, conquests, and impacts of the Mongol Empire.',
      standard: 'AP-WORLD-2.4',
    },
  ],
  prerequisites: [],
  followUps: ['apworld.silk-road'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Convey the empire\'s scale.',
      script: 'Around 1250, you could ride from Korea to Hungary without leaving Mongol territory. The Mongol Empire was the largest CONTIGUOUS empire in human history — bigger than Rome, China, or any other empire of its time. And it was built by nomads from a sparsely populated steppe.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-empire',
      kind: 'concept',
      goal: 'Founding, conquests, governance, impact.',
      keyIdeas: [
        'GENGHIS KHAN (Temujin, ~1162-1227): unified Mongol tribes. Built a meritocratic, mobile cavalry army. Began conquests of China, Central Asia, Persia.',
        'Successors expanded: by ~1280 the empire stretched from KOREA to HUNGARY, including most of modern China, Russia, Iran, and central Asia.',
        'CONQUEST METHOD: terror as policy. Cities that resisted were destroyed, populations massacred. Cities that surrendered were spared but had to pay tribute. Reputation alone often won battles.',
        'KUBLAI KHAN (Genghis\' grandson): completed conquest of China, founded YUAN DYNASTY (1271-1368). Marco Polo visited his court.',
        'PAX MONGOLICA ("Mongol Peace"): under unified Mongol rule, the SILK ROAD was safer than ever. Trade boomed. Ideas, technologies, religions flowed across Eurasia.',
        'KEY TRANSFERS: Chinese technology (gunpowder, printing, compass) moved west to Europe via Mongol routes. Black Death (bubonic plague, 1347) also moved west — likely along Mongol trade routes — killing 1/3 of Europe.',
        'COLLAPSE: by ~1300, internal divisions split the empire into 4 KHANATES that drifted apart and converted to local cultures (Yuan→Chinese, Ilkhanate→Persian, Golden Horde→Russian/Turkic). Yuan fell to Ming in 1368.',
        'LEGACY: connected Eurasia, transferred technology, accelerated globalization centuries before Columbus. Brutal AND consequential.',
      ],
      vocabulary: [
        { term: 'khan', definition: 'a Mongol ruler.' },
        { term: 'Pax Mongolica', definition: 'the period of relative peace and increased trade under Mongol rule.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-impact',
      kind: 'worked_example',
      problem: 'How did the Mongol Empire indirectly cause the European Renaissance?',
      steps: [
        'Pax Mongolica made the Silk Road safer for trade and travel.',
        'Chinese inventions — GUNPOWDER, PRINTING, the COMPASS — flowed west to Europe.',
        'Marco Polo (1271-1295) brought back accounts of Chinese wealth and technology, sparking European interest in Asia.',
        'Greek and Arabic texts (preserved in Islamic libraries) reached Europe via Mongol-controlled trade routes.',
        'GUNPOWDER: revolutionized European warfare. PRINTING: made the Renaissance and Reformation possible. COMPASS: enabled European exploration leading to Age of Discovery.',
        'When Mongol order collapsed (~1350) and Black Death disrupted Europe, these IMPORTED technologies and texts were already in European hands. Renaissance built on them.',
      ],
      answer: 'Pax Mongolica enabled tech transfer (gunpowder, printing, compass) and texts that fueled Renaissance',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How did the Mongol Empire INADVERTENTLY contribute to the Black Death reaching Europe?',
      expectedAnswer: 'plague spread west along Mongol-protected trade routes from Asia',
      responseFormat: 'free',
      hints: [
        'Plague originated in Central Asia.',
        'What allowed it to travel quickly to Europe?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mongols-just-destroyers',
      kind: 'misconception_check',
      question: 'Were the Mongols just destroyers — adding nothing positive to history?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Reducing Mongols to barbarian invaders.',
          correctsTo: 'They were brutal IN CONQUEST, but their empire enabled the LARGEST tech and idea transfer of the medieval world. Without Pax Mongolica, the Renaissance and Age of Exploration look very different. Both things are true.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Genghis Khan founded; Kublai Khan completed China conquest.',
        'Largest contiguous empire in history.',
        'Pax Mongolica boosted Silk Road trade.',
        'Tech transfer: gunpowder, printing, compass moved west; plague too.',
        'Brutal conquest tactics; lasting integration of Eurasia.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why didn\'t the Mongols conquer Western Europe (or Japan)?',
      hint: 'Death of Great Khan Ogedei (1241) recalled invading armies for succession battles. Mongols also struggled with European forests and castles. Japan: typhoons ("kamikaze") destroyed two invasion fleets (1274, 1281). Geography + politics + luck combined.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
