/**
 * AP World History: Modern — CED Unit 2.6: Cultural, Technological, and
 * Biological Diffusion Along Trade Routes.
 *
 * Unit-2 Vertical Slice content plan, following the Silk Roads calibration
 * template (`ap-apworld-u2-silk-roads.ts`). concept = the historical
 * argument (how did the same networks that carried goods also carry
 * religions, technologies, AND disease, 1200-1450?); worked_example =
 * annotated document analysis of a technological-diffusion document;
 * try_yourself = a document-based SAQ using the Boccaccio excerpt on the
 * Black Death, since the CED explicitly treats disease transfer as a
 * consequence of trade-network integration and the Decameron excerpt is
 * quoted directly in the SAQ prompt.
 *
 * Worked-example anchor: Marco Polo, The Travels (c. 1300), on Yuan paper
 * money — evelyn.passage.apworld-marco-polo-paper-money.v1. Teaching point
 * is what the passage reveals about a Chinese commercial technology that
 * impressed and was reported back to a foreign audience — a small case
 * study in how ideas/technologies observed at network nodes could travel.
 *
 * try_yourself anchor (document-based SAQ, quoted in the prompt itself):
 * Giovanni Boccaccio, The Decameron, Introduction (c. 1353), on the plague
 * reaching Florence — evelyn.passage.apworld-black-death.v1.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U2_CULTURAL_DIFFUSION: LessonPlan = {
  id: 'evelyn.ap.apworld.cultural-diffusion.v1',
  title: 'U2.6 Cultural, Technological, and Biological Diffusion Along Trade Routes',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.cultural-diffusion',
      description:
        'Explain how the trade networks of 1200-1450 facilitated the diffusion of religions, technologies, and disease across Afro-Eurasia, and analyze the consequences of that diffusion for connected societies.',
      standard: 'AP-APWORLD-2.6',
    },
  ],
  prerequisites: ['apworld.mongol-empire'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the point that trade networks moved far more than goods — they moved religions, ideas, technologies, and even disease, with the same routes carrying prosperity and catastrophe alike.',
      script:
        "So far we've traced how goods moved along the Silk Roads, the Indian Ocean, the trans-Saharan routes, and through Mongol-secured Eurasia — silk, spices, gold, salt. But a caravan or a ship doesn't just carry cargo. It carries the people who travel with it, and everything those people bring: their religion, their technical know-how, their crops, their language — and, invisibly, whatever pathogens happen to be traveling with them too. The same well-connected, well-traveled network that let a Muslim merchant's faith spread across the Sahel, that let Chinese paper and gunpowder technology reach the Middle East and Europe, also let a bacterium hitch a ride from Central Asia all the way to Florence. Connectivity is a double-edged achievement — and by 1450, this era's trade networks had proven both edges.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-diffusion',
      kind: 'concept',
      goal: 'Explain how trade networks diffused religions, technologies, crops, and disease across Afro-Eurasia, 1200-1450, and analyze the consequences of that diffusion.',
      keyIdeas: [
        'DIFFUSION describes the spread of a practice, belief, technology, or biological agent from its point of origin outward, typically along the same routes and contacts already used for trade — merchants, missionaries, and travelers were the carriers, whether or not spreading something new was their intent.',
        "ISLAM spread far beyond Arabia along trade routes: Muslim merchants carried their faith across the Sahel via trans-Saharan trade (leading rulers like Mansa Musa to convert) and across the Indian Ocean basin to Swahili coast cities and Southeast Asian ports, often adopted first by rulers and urban merchant classes seeking commercial and diplomatic advantages before spreading more broadly.",
        "BUDDHISM had earlier spread along the Silk Roads from South Asia into Central Asia, China, and beyond, carried by monks and merchants alike — establishing a much older precedent for the same trade-carries-religion pattern this unit traces for the 1200-1450 period.",
        'TECHNOLOGIES diffused in multiple directions: PAPER-MAKING and PRINTING technology, long established in China, spread westward through the Islamic world and eventually into Europe; GUNPOWDER weapons technology, also originating in China, spread westward and transformed warfare across Afro-Eurasia; the MAGNETIC COMPASS and improvements to the ASTROLABE spread and improved long-distance navigation for sailors across the Indian Ocean and beyond.',
        'CROPS AND AGRICULTURAL KNOWLEDGE moved along trade networks as well, letting farmers in newly connected regions adopt plants and techniques from distant climates — part of a broader pattern where connectivity reshaped everyday economic life, not just elite courts and marketplaces.',
        'THE BLACK DEATH is the era\'s starkest example of BIOLOGICAL diffusion: the plague pathogen (Yersinia pestis), likely originating in Central Asia, moved westward along the same secured Mongol-era trade routes that carried silk, silver, and scholars, reaching the Middle East and Europe by the late 1340s. Its consequences were catastrophic — killing an estimated one-third or more of Europe\'s population and causing comparable devastation across the Middle East and parts of Asia.',
        'THE BLACK DEATH\'S CONSEQUENCES extended well beyond the immediate death toll: dramatic population loss led to severe labor shortages in Europe, which in turn increased the bargaining power of surviving peasants and workers and helped erode some feudal labor obligations; social and religious upheaval followed as communities struggled to explain and respond to a catastrophe of that scale.',
        "THE COMBINED EFFECT: the very connectivity that this unit celebrates — Silk Roads revival, Indian Ocean integration, trans-Saharan exchange, Mongol-secured Eurasia — was a double-edged achievement. It diffused religions, useful technologies, and crops that reshaped societies for the better in many ways, while also diffusing a pathogen whose demographic and social consequences were among the most severe in recorded history.",
      ],
      vocabulary: [
        {
          term: 'diffusion',
          definition:
            'the spread of a practice, belief, technology, or biological agent from its point of origin outward, typically carried along existing trade and travel routes.',
        },
        {
          term: 'gunpowder',
          definition:
            'a Chinese-origin weapons technology that diffused westward along Afro-Eurasian trade networks during this period, eventually transforming warfare across the connected world.',
        },
        {
          term: 'Black Death',
          definition:
            'the catastrophic plague pandemic, likely originating in Central Asia, that spread westward along Mongol-secured trade routes and killed an estimated one-third or more of Europe\'s population by the mid-1300s.',
        },
        {
          term: 'labor shortage (post-plague)',
          definition:
            "a consequence of the Black Death's massive death toll: with far fewer workers available, surviving peasants and laborers in Europe gained increased bargaining power, contributing to the erosion of some feudal labor obligations.",
        },
      ],
      passageId: 'evelyn.passage.apworld-marco-polo-paper-money.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-marco-polo-paper-money',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Marco Polo\'s account (c. 1300) of Yuan paper currency: "All these pieces of paper are issued with as much solemnity and authority as if they were of pure gold or silver; and on every piece a variety of officials... have to write their names, and to put their seals. And when all is prepared duly, the chief officer deputed by the Kaan smears the seal entrusted to him with vermilion, and impresses it on the paper." What does this passage reveal about the diffusion of ideas along trade networks, and what should a careful reader keep in mind about the source?',
      steps: [
        'SOURCE IT FIRST. Who, when, why? Marco Polo, a Venetian merchant who observed Yuan-era paper currency firsthand while residing in Kublai Khan\'s China in the late 1200s, later dictating an account (c. 1300) meant to describe unfamiliar wonders to a European audience.',
        'IDENTIFY THE CLAIM. Polo describes an elaborate, state-authenticated process — multiple officials signing, a formal seal impressed in vermilion ink — treating paper notes with "as much solemnity and authority as if they were of pure gold or silver." He is documenting a functioning, trusted currency system entirely foreign to contemporary Europe, which still relied on metal coinage.',
        "CONNECT TO THE TECHNOLOGICAL-DIFFUSION CAUSE. This passage is a case study in HOW diffusion actually happens: Polo doesn't just witness the technology, he carries a detailed account of it back to Europe, planting the idea of state-backed paper currency in a European audience centuries before Europe itself adopted anything similar — diffusion of an IDEA, carried by a trade-network traveler, even where the technology itself didn't yet transfer.",
        "CONNECT TO THE NETWORK-INTEGRATION CAUSE. That a European merchant could witness, understand, and accurately report on a Chinese state financial system is only possible because Mongol-secured Eurasian trade routes made that kind of sustained cross-cultural contact and observation possible in the first place — connecting back to the Pax Mongolica covered in the Mongol Empire topic.",
        'WEIGH THE SOURCE\'S RELIABILITY. Polo is an outside merchant-observer without direct insider access to Yuan bureaucracy, describing the visible ceremony of the process (seals, signatures) rather than the underlying monetary theory — his account is credible as an eyewitness description of the process\'s FORM, though not necessarily a technical explanation of how the currency\'s value was actually backed or regulated.',
        "STATE THE LINK TO THE COURSE THESIS. This passage shows diffusion in its earliest stage — an idea observed at a trade network's node, carried home by a traveler, and recorded for an audience who had never seen anything like it, exactly the mechanism by which technologies and practices moved along trade routes even before formal adoption.",
      ],
      answer:
        'Polo\'s account of Yuan paper money documents an elaborate, state-authenticated currency system — officials\' signatures, a formal vermilion seal — that was entirely unfamiliar to contemporary Europe. This is diffusion caught in its earliest stage: Polo observed a Chinese financial technology at a network node and carried a detailed account of it home, planting the idea in a European audience long before Europe adopted anything comparable, made possible by the same Mongol-secured trade contact covered in the previous topic. A careful reader should note Polo describes the visible CEREMONY of the process (seals, signatures) as an outside observer without bureaucratic insider access, so his account is more reliable as eyewitness description of the process\'s form than as a technical explanation of the currency\'s underlying value or regulation.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq-black-death',
      kind: 'try_yourself',
      problem:
        'Document-based SAQ. Using the excerpt below, respond to (a), (b), and (c). "I say, then, that the years of the beatific incarnation of the Son of God had reached the tale of one thousand three hundred and forty-eight when in the illustrious city of Florence... there made its appearance that deadly pestilence, which... had had its origin some years before in the East, whence, after destroying an innumerable multitude of living beings, it had propagated itself without respite from place to place, and so, calamitously, had spread into the West." — Giovanni Boccaccio, The Decameron, Introduction (c. 1353). (a) Using the excerpt, identify where Boccaccio states the plague originated. (b) Explain how the trade networks of this unit made possible the geographic spread Boccaccio describes ("from the East... into the West"). (c) Explain ONE social or economic consequence of the plague for European society.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies, using the excerpt, that Boccaccio states the plague "had had its origin some years before in the East." No credit for an answer that does not reference the passage\'s own claim about origin in the East, or that invents a specific location not supported by the excerpt.',
            modelResponse:
              'According to the excerpt, Boccaccio states the pestilence "had had its origin some years before in the East," before it spread to Florence in the West.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate mechanism connecting Mongol-secured (or broader Afro-Eurasian) trade routes to the westward spread of disease — e.g. Pax Mongolica enabling fast, safe overland travel that also carried the pathogen. No credit for a vague statement ("trade spread it") with no mechanism.',
            modelResponse:
              'The plague was able to travel "from place to place" and "into the West" because the same Mongol-secured trade routes that safely carried merchants, goods, and information rapidly across Eurasia during the Pax Mongolica also carried, unintentionally, the disease-causing pathogen along with travelers and trade goods moving westward.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, historically accurate social or economic consequence — e.g. massive population loss, resulting labor shortages that increased peasant bargaining power, or erosion of feudal obligations. No credit for a vague or unsupported claim.',
            modelResponse:
              'The Black Death killed an estimated one-third or more of the European population, and the resulting severe labor shortage gave surviving peasants and workers more bargaining power over wages and conditions, contributing to the erosion of some feudal labor obligations in the following decades.',
          },
        ],
      },
      passageId: 'evelyn.passage.apworld-black-death.v1',
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-diffusion-only-goods',
      kind: 'misconception_check',
      question:
        "True or false: trade networks in this period primarily diffused physical goods like silk and gold, with religion, technology, and disease spreading through separate, unrelated processes.",
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Treating goods-trade and cultural/biological diffusion as SEPARATE historical processes — missing the AP World's central point that they traveled along the SAME routes, carried by the SAME people (merchants, travelers, missionaries), often on the SAME journey.",
          correctsTo:
            "FALSE. The trade networks covered in this unit — the Silk Roads, the Indian Ocean network, trans-Saharan trade, and Mongol-secured Eurasian routes — were not separate from the diffusion of religion, technology, and disease; they were the DELIVERY MECHANISM for all of it. A Muslim merchant traveling a trans-Saharan caravan route carried both goods AND his faith. A traveler moving along Mongol-secured roads could carry silk, an account of Chinese paper currency, AND (unknowingly) plague-carrying fleas, all on the same journey. This is the key AP World insight for this topic: the connectivity that made trade in goods possible is the SAME connectivity that diffused religions, technologies, crops, and disease — they cannot be separated into unrelated processes.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Diffusion describes the spread of religion, technology, crops, or disease along the same trade routes and contacts already used for exchanging goods.',
        'Islam spread across the Sahel and Indian Ocean world, and Buddhism earlier spread along the Silk Roads, largely carried by merchants and travelers.',
        'Chinese technologies — paper-making, gunpowder, and improved navigation instruments — diffused westward along Afro-Eurasian trade networks.',
        'The Black Death, likely originating in Central Asia, spread westward along Mongol-secured trade routes, killing an estimated one-third or more of Europe\'s population.',
        'The plague\'s labor shortages increased surviving peasants\' bargaining power and helped erode some feudal labor obligations — connectivity\'s double-edged legacy.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.6',
    cedTitle: 'Cultural, Technological, and Biological Diffusion Along Trade Routes',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-marco-polo-paper-money.v1',
        chapter: 'c. 1300',
        note: 'Marco Polo, "The Travels" — anchor document for technological/idea diffusion via Yuan paper currency.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-black-death.v1',
        chapter: 'c. 1353',
        note: 'Giovanni Boccaccio, "The Decameron" — document-based SAQ anchor for biological diffusion (the Black Death).',
      },
    ],
  },
};
