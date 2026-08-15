/**
 * AP World History — Unit 2: Networks of Exchange (1200-1450).
 *
 * Silk Roads, Indian Ocean trade, Trans-Saharan trade, cultural diffusion.
 * Heavily tested unit; consistently 8-10% of exam.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_WORLD_UNIT2_NETWORKS: LessonPlan = {
  id: 'evelyn.ap.world.unit2-networks.v1',
  title: 'AP World — Unit 2: Silk Roads, Indian Ocean, Trans-Saharan Networks',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.unit2-networks',
      description: 'Analyze the structure, drivers, and consequences of the three major Afro-Eurasian trade networks (1200-1450): Silk Roads, Indian Ocean, Trans-Saharan; including the technologies, financial innovations, and cultural diffusion they enabled.',
      standard: 'AP-WORLD-2.1-2.7',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The three networks reshaped Afro-Eurasia before any European voyage.',
      script: 'Long before the Atlantic became the center of world trade, three connected networks tied Afro-Eurasia together: the Silk Roads across Central Asia, the Indian Ocean monsoon system, and the Trans-Saharan caravan routes. Together they moved spices, silver, slaves, plague, and ideas — and the patterns they set created the conditions for European expansion that came later. AP loves comparison between networks, so know each one\'s engine, key cities, and what flowed.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-silk-indian',
      kind: 'concept',
      goal: 'Silk Roads + Indian Ocean networks.',
      keyIdeas: [
        'SILK ROADS: overland routes from China through Central Asia to the Mediterranean. Key hubs: Chang\'an (Tang/Song China), Samarkand, Bukhara, Baghdad, Constantinople.',
        'GOODS: silk + porcelain east-to-west; horses, glass, jade, and silver west-to-east. Spices, ideas, and disease moved both ways.',
        'PAX MONGOLICA (1250-1350): Mongol unification of Eurasia made Silk Roads safer and busier than ever. Marco Polo\'s travel only possible during this window.',
        'INDIAN OCEAN TRADE: water-based, much higher volume than Silk Roads. Powered by predictable MONSOON winds — summer SW winds carry ships east, winter NE winds carry them west.',
        'KEY HUBS: Calicut + Cambay (India), Hormuz (Persian Gulf), Aden (Red Sea), Malindi + Kilwa (East African Swahili coast), Malacca (Strait between Sumatra and Malaya).',
        'INDIAN OCEAN GOODS: spices (pepper, cinnamon, cloves, nutmeg), textiles (cotton, silk), porcelain, gold + ivory + slaves from Africa, timber from Southeast Asia.',
        'TECHNOLOGY enabling Indian Ocean trade: lateen sail (triangular, allows tacking against wind), magnetic compass (Chinese origin, spread westward), astrolabe (Greek origin, refined by Arab navigators), stern-post rudder, dhow (Arab) and junk (Chinese) ship designs.',
        'SWAHILI COAST: Bantu-speaking + Arab/Persian merchants intermarried; trading cities (Kilwa, Mombasa, Mogadishu) — Islam dominant, Swahili language emerged as fusion of Bantu + Arabic.',
        'SOUTHEAST ASIAN STATES: Srivijaya (Sumatra-based maritime kingdom) and Majapahit (Java) — taxed Strait of Malacca shipping.',
      ],
      vocabulary: [
        { term: 'Pax Mongolica', definition: 'roughly 1250-1350 period of relative peace and security across the Mongol-controlled Eurasian Silk Roads enabling unprecedented exchange.' },
        { term: 'monsoon system', definition: 'seasonally reversing winds in the Indian Ocean enabling predictable round-trip voyaging.' },
        { term: 'Swahili coast', definition: 'East African coastal cities (Kilwa, Mombasa, etc.) whose Bantu-Arab fusion culture grew from Indian Ocean trade.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-trans-saharan-financial',
      kind: 'concept',
      goal: 'Trans-Saharan trade + financial innovations + diffusion.',
      keyIdeas: [
        'TRANS-SAHARAN TRADE: connected West Africa (gold-producing forest zones) with North Africa (Mediterranean access). Camel caravans across Sahara, possible after camel domestication and saddle innovations.',
        'KEY GOODS: GOLD from West Africa (Ghana, Mali, Songhai sources) → North Africa → Europe. SALT from Saharan mines (Taghaza) → West Africa (where salt was scarce). Slaves, copper, kola nuts, textiles.',
        'WEST AFRICAN EMPIRES: Ghana (~700-1200) → Mali (~1230-1670) → Songhai (~1340-1591). Each rose by controlling Trans-Saharan gold and converting to or accommodating Islam.',
        'MANSA MUSA (Mali, 1280s-1337): pilgrimage to Mecca in 1324 with such gold he crashed the Egyptian gold market. Symbolizes scale of West African wealth.',
        'TIMBUKTU: Mali\'s intellectual center; Sankore Madrasah; manuscript libraries; Islamic scholarship.',
        'FINANCIAL INNOVATIONS that made long-distance trade possible: BILLS OF EXCHANGE (paper credit instruments — Italian banking, Champagne fairs), CHECKS (Arab origin), HUNDI (Indian credit network), HANSA partnerships (Northern European), SHIPPING INSURANCE.',
        'PAPER MONEY: Tang/Song China (jiaozi), enabled larger-scale commerce. Yuan dynasty extended.',
        'CARAVANSERAI: roadside inns along Silk Roads providing food, lodging, and stables — supported by Islamic states.',
        'CULTURAL DIFFUSION: Buddhism (India → China → Korea → Japan along Silk Roads), Islam (Arabia → North Africa, Sub-Saharan Africa, Central Asia, India, Indonesia), Greek philosophy (preserved + developed by Arab scholars then transmitted to Europe), Hindu-Arabic numerals (India → Arab world → Europe), Chinese inventions (paper, printing, gunpowder, magnetic compass).',
        'DISEASE: BUBONIC PLAGUE (Black Death) traveled the Silk Roads + Mongol couriers + Genoese ships. Reached Europe 1347, killed ~1/3 of European population by 1351. Major demographic + economic disruption.',
      ],
      vocabulary: [
        { term: 'Mansa Musa', definition: 'Mali emperor (r. 1312-1337) whose Mecca pilgrimage with massive gold caravan demonstrated West African wealth to the Islamic world.' },
        { term: 'caravanserai', definition: 'fortified roadside inn on Silk Roads providing food, lodging, and stables for travelers and their pack animals.' },
        { term: 'bill of exchange', definition: 'medieval credit instrument allowing merchants to transfer money across distances without carrying physical coin.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-comparison',
      kind: 'worked_example',
      problem: 'A AP-style prompt: "Compare the Silk Roads and Indian Ocean networks during 1200-1450. Identify ONE similarity and ONE difference."',
      steps: [
        'STEP 1 — clarify "compare": means BOTH similarities and differences.',
        'SIMILARITY: both networks expanded greatly in scale and volume during 1200-1450. Both spread Islam (along Silk Roads to Central Asia, across Indian Ocean to Southeast Asia). Both moved luxury goods. Both relied on hub cities and credit instruments.',
        'DIFFERENCE: Silk Roads = OVERLAND, lower volume per trip, focused on luxury; Indian Ocean = MARITIME, much higher volume thanks to cargo capacity of ships, broader range of goods. Silk Roads dependent on imperial protection (Pax Mongolica); Indian Ocean self-organizing, less dependent on single empire.',
        'GOOD AP RESPONSE structure: state similarity → 1-2 sentences of evidence; state difference → 1-2 sentences of evidence. Don\'t just list facts.',
        'COMMON STUDENT ERROR: only describing one network rather than directly comparing. AP rubric requires SIDE-BY-SIDE statements.',
      ],
      answer: 'Similarity: both expanded with Islam and luxury trade. Difference: Silk Roads overland and politically dependent vs Indian Ocean maritime and self-organizing.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why was the Strait of Malacca strategically critical for Indian Ocean trade?',
      expectedAnswer: 'It is the narrowest sea passage connecting the Indian Ocean to the South China Sea — virtually all maritime trade between East Asia and India/Africa/Middle East passed through. Whoever controlled Malacca (Srivijaya, then Majapahit, then the Sultanate of Malacca) could TAX trade, providing huge revenues. It also became a major cosmopolitan port where Muslim, Hindu, Buddhist, and Confucian merchants mixed, accelerating the spread of Islam into Indonesia. Strategic chokepoint = strategic wealth.',
      responseFormat: 'free',
      hints: [
        'Geographically: where does it sit between major regions?',
        'Politically: who controls a chokepoint controls trade revenue.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-silk-roads-direct',
      kind: 'misconception_check',
      question: 'Most goods traded on the Silk Roads moved as a single unbroken journey from China to Rome/Constantinople. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Imagining Silk Roads as a single highway with end-to-end caravans.',
          correctsTo: 'False. The Silk Roads were a NETWORK of regional trade segments — most merchants traveled only part of the route, exchanging goods at hub cities like Samarkand, Bukhara, or Baghdad, where another merchant carried them further. Marco Polo\'s end-to-end journey was exceptional precisely because it was rare. The "relay" structure meant each leg added markup, and ideas/diseases/goods moved more reliably than any single trader. AP often tests this — the routes were intermediated, not continuous.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three networks: Silk Roads (overland Eurasia), Indian Ocean (maritime monsoon), Trans-Saharan (camel caravans).',
        'Pax Mongolica unified Silk Roads ~1250-1350; Marco Polo, plague spread.',
        'Indian Ocean: monsoon winds, Swahili coast (Kilwa), Malacca chokepoint.',
        'West African empires (Ghana → Mali → Songhai) controlled Trans-Saharan gold; Mansa Musa, Timbuktu.',
        'Financial innovations: bills of exchange, paper money, caravanserai supported scale.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did the bubonic plague have such different demographic impacts in different regions despite all three networks linking them?',
      hint: 'Plague originated in Central Asian rodent populations and spread along trade routes via fleas on rats. Europe got the worst hit (~1/3 mortality) because (1) high population density in cities, (2) limited prior exposure / immunity, (3) the timing coincided with the Little Ice Age weakening populations. China and the Islamic world also saw devastating outbreaks but recovered demographically faster. Sub-Saharan Africa was less impacted partly due to lower trade-network integration and partly because the climate was less hospitable to the rat-flea-bacteria cycle. The ECONOMIC and SOCIAL consequences in Europe (labor shortages, end of serfdom, peasant uprisings) reshaped the continent in ways that prepared the ground for the Renaissance and later expansion. AP often asks about why effects varied by region.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
