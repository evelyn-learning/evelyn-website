/**
 * AP World History: Modern — CED Unit 2.4: The Trans-Saharan Trade Network.
 *
 * Unit-2 Vertical Slice content plan, following the Silk Roads calibration
 * template (`ap-apworld-u2-silk-roads.ts`). concept = the historical
 * argument (how did the camel caravan trade turn the Sahara from a barrier
 * into a corridor, and what did that trade build in West Africa, 1200-1450?);
 * worked_example = annotated document analysis; try_yourself = a 3-point
 * SAQ-style short-answer.
 *
 * Anchor text: al-Umari, Masalik al-absar (c. 1340), on Mansa Musa's 1324
 * pilgrimage to Cairo — evelyn.passage.apworld-mansa-musa.v1. Teaching point
 * is what the passage reveals about the sheer scale of Mali's gold wealth
 * and its integration into Afro-Eurasian commercial networks.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U2_TRANS_SAHARAN_TRADE: LessonPlan = {
  id: 'evelyn.ap.apworld.trans-saharan-trade.v1',
  title: 'U2.4 The Trans-Saharan Trade Network',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.trans-saharan-trade',
      description:
        'Explain how the camel caravan, the gold-salt trade, and the rise of the Mali Empire expanded trans-Saharan trade and spread Islam across the West African Sahel in the period 1200-1450.',
      standard: 'AP-APWORLD-2.4',
    },
  ],
  prerequisites: ['apworld.indian-ocean-trade'],
  followUps: ['apworld.mongol-empire'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the Sahara feel like a corridor of unimaginable wealth, not an empty barrier.',
      script:
        "The Sahara looks, on a map, like a dead zone — a giant blank stretch of sand separating the Mediterranean world from West Africa. For most of human history, that's roughly what it was: too vast and too dry to cross reliably. But by the 1200s, camel caravans hundreds of animals strong were crossing it routinely, carrying salt south and gold north, and the kingdoms that controlled that trade became almost unimaginably rich. So rich that when the ruler of one of them, Mansa Musa of Mali, passed through Cairo in 1324 on his way to Mecca, he reportedly gave away so much gold that he crashed the local price of gold for over a decade. A 'barrier' had become one of the richest trade corridors on earth.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-trans-saharan-network',
      kind: 'concept',
      goal: 'Explain how the camel caravan, the gold-salt trade, and the Mali Empire together expanded trans-Saharan trade and spread Islam across the Sahel, 1200-1450.',
      keyIdeas: [
        'THE TRANS-SAHARAN NETWORK linked West Africa to North Africa and, through North African ports, to the wider Mediterranean and Islamic world — turning the Sahara Desert from a barrier into a commercial corridor.',
        "THE CAMEL made the crossing possible: camels can travel for days without water, carry heavy loads, and endure the desert heat far better than horses or oxen. The CAMEL SADDLE, adapted for desert travel, let traders control large pack animals efficiently. Caravans of hundreds or even over a thousand camels crossed together for safety and to share the enormous logistical burden of a Saharan crossing.",
        'THE GOLD-SALT TRADE was the network\'s economic engine: SALT, mined in the Sahara itself (notably at Taghaza) and desperately needed for preserving food and human health in tropical West Africa, moved south. GOLD, mined in West African goldfields (notably around the Akan forest region and Bambuk/Bure), moved north to North Africa and, from there, into Mediterranean and European currency. Historians describe this exchange as trading a commodity abundant in the desert for one abundant in the forest/savanna zone — each side had what the other lacked.',
        'THE MALI EMPIRE rose to control and tax this trade, becoming the dominant West African power of the period. Its wealth came not from producing all the gold itself but from controlling the trade routes and market cities through which West African gold reached North Africa — a position similar to a toll-collector on the most valuable road in the region.',
        "MANSA MUSA, Mali's most famous ruler (r. c. 1312-1337), converted to Islam and used his 1324 hajj (pilgrimage to Mecca) to display Mali's wealth on an international stage — famously distributing so much gold in Cairo that its market value reportedly dropped for years afterward. His journey placed Mali firmly on the mental map of the Islamic and Mediterranean worlds, later depicted holding a gold nugget on the European Catalan Atlas (1375).",
        'ISLAM spread across the Sahel (the semi-arid belt south of the Sahara) largely through trade contact: North African Muslim merchants brought their faith with them along the caravan routes, and West African rulers — including Mansa Musa — converted, in part because shared religion with trading partners eased business relationships, access to Islamic legal/commercial networks, and diplomatic ties with the wider Muslim world. Conversion was concentrated among rulers and urban merchant classes; traditional African religions persisted widely, especially in rural areas.',
        'TRADE CITIES like Timbuktu and Gao grew into major commercial AND intellectual hubs — Timbuktu in particular became famous for Islamic scholarship, manuscripts, and its university-mosque complex, showing how trade wealth translated into cultural and educational investment, not just material riches.',
        'THE COMBINED EFFECT: camel technology made the desert crossable; the gold-salt exchange gave traders something valuable to move in both directions; the Mali Empire built political power by controlling that exchange; and the resulting cross-Sahara contact carried Islam, scholarship, and Mediterranean connections deep into West Africa.',
      ],
      vocabulary: [
        {
          term: 'trans-Saharan trade',
          definition:
            'the network of camel-caravan trade routes crossing the Sahara Desert, linking West Africa to North Africa and, through it, the wider Mediterranean and Islamic world.',
        },
        {
          term: 'gold-salt trade',
          definition:
            "the core exchange of the trans-Saharan network: salt mined in the Sahara moved south to West Africa, and gold mined in West Africa's goldfields moved north, each side supplying what the other lacked.",
        },
        {
          term: 'Mali Empire',
          definition:
            'a powerful West African empire (c. 1230s-1600) that grew wealthy by controlling and taxing trans-Saharan trade routes and market cities, reaching its height of wealth and fame under Mansa Musa.',
        },
        {
          term: 'hajj',
          definition:
            "the Islamic pilgrimage to Mecca, one of the Five Pillars of Islam; Mansa Musa's 1324 hajj through Cairo displayed Mali's wealth to the wider Islamic and Mediterranean world.",
        },
      ],
      passageId: 'evelyn.passage.apworld-mansa-musa.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-mansa-musa-cairo',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from al-Umari\'s account (c. 1340) of Mansa Musa\'s 1324 visit to Cairo: "This man flooded Cairo with his benefactions. He left no court emir nor holder of a royal office without the gift of a load of gold. The Cairenes made incalculable profits out of him and his suite in buying and selling and giving and taking. They exchanged gold until they depressed its value in Egypt and caused its price to fall." What does this passage reveal about the scale of Mali\'s wealth and its economic effects, and what should a careful reader keep in mind about the source?',
      steps: [
        'SOURCE IT FIRST. Who, when, why? al-Umari, an Egyptian administrator and geographer writing in Cairo roughly 15 years after Mansa Musa\'s visit, compiling accounts from people who witnessed or heard about the event — a secondhand but contemporary, well-connected source.',
        'IDENTIFY THE CLAIM. al-Umari asserts that Mansa Musa gave gold gifts to essentially every Cairene official ("no court emir nor holder of a royal office" was left out), that Cairenes profited enormously from trading with his retinue, and that the sheer volume of gold exchanged actually lowered gold\'s market price in Egypt.',
        "CONNECT TO THE GOLD-WEALTH CAUSE. This is direct testimony for the concept's claim that Mali controlled and profited from West African gold on a massive scale: a single ruler's traveling gift-giving was large enough to noticeably move the price of gold in one of the wealthiest cities in the Islamic world.",
        'CONNECT TO THE NETWORK-INTEGRATION CAUSE. The scene in Cairo — a West African ruler on hajj, received and recorded by Egyptian officials — is itself evidence of Mali\'s integration into the wider Islamic and Mediterranean world via trans-Saharan trade and the shared framework of Islam, exactly the kind of cross-network contact the concept describes.',
        'WEIGH THE SOURCE\'S RELIABILITY. al-Umari is writing years after the fact, compiling testimony rather than direct eyewitness experience, and the claim that gold prices fell "for years" is the kind of dramatic, hard-to-verify economic claim historians treat with some caution — even while treating the underlying point (Mansa Musa distributed an extraordinary amount of gold) as well-corroborated by multiple independent sources.',
        "STATE THE LINK TO THE COURSE THESIS. This passage is powerful evidence for the concept's central claim: the trans-Saharan gold trade built Mali into a fabulously wealthy empire, and Mansa Musa's hajj carried that wealth — and Mali's presence — directly into the heart of the Islamic Mediterranean world.",
      ],
      answer:
        'al-Umari\'s account shows Mansa Musa distributing gold on a scale so large that it reportedly depressed Cairo\'s gold prices — direct evidence for the concept\'s claim that Mali\'s control of the trans-Saharan gold trade produced extraordinary wealth. The scene also shows Mali\'s integration into the wider Islamic Mediterranean world: a West African ruler\'s hajj was significant enough to be recorded and discussed by Egyptian officials years later. A careful reader should note al-Umari is writing roughly 15 years after the event, compiling secondhand testimony rather than direct eyewitness experience, so dramatic specifics like a multi-year price depression should be read as a plausible but not precisely verifiable claim, even as the broader point about Mali\'s exceptional wealth is well corroborated.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE technology or commodity central to trans-Saharan trade, 1200-1450. (b) Explain how ONE such factor made trans-Saharan trade possible or profitable. (c) Explain ONE effect of trans-Saharan trade on West African societies.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine technology or commodity — e.g. the camel (or camel saddle), salt, or gold. No credit for a vague statement with no identifiable specific item, or for an anachronistic/incorrect one.',
            modelResponse:
              'One technology central to trans-Saharan trade was the camel, which could travel long distances through the desert without water.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate mechanism by which the named factor made trans-Saharan trade possible or profitable — e.g. connects the camel to desert endurance enabling caravan crossings, or connects gold/salt to the fact that each region had what the other lacked. No credit for an explanation disconnected from the item named in (a).',
            modelResponse:
              'Because camels could endure the extreme heat and go for days without water, they could carry heavy loads of goods across the Sahara in caravans, making a crossing that would have been impossible for horses or oxen into a reliable and repeatable trade route.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, historically accurate effect on West African societies — e.g. the rise and enrichment of the Mali Empire, the spread of Islam through trade contact, or the growth of trade/scholarly cities like Timbuktu. No credit for a vague or unsupported claim.',
            modelResponse:
              'Trans-Saharan trade enabled the rise of the Mali Empire, which grew enormously wealthy and powerful by controlling and taxing the gold-salt trade routes, and the contact with North African Muslim merchants that came with this trade led many West African rulers, including Mansa Musa, to convert to Islam.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-mali-produced-all-gold',
      kind: 'misconception_check',
      question:
        "True or false: the Mali Empire's wealth came primarily from Mali itself mining and owning most of West Africa's gold supply.",
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Conflating CONTROLLING trade routes with OWNING the resource being traded — assuming Mali\'s wealth came from direct gold production rather than from its position as a commercial and political gatekeeper.',
          correctsTo:
            "FALSE. Mali's gold did not come mainly from mines inside Mali's own core territory — much of West Africa's gold was mined further south, in goldfields controlled by other peoples and polities (such as the Akan forest region and the Bambuk/Bure areas). Mali's wealth came primarily from controlling and TAXING the trade routes and market cities through which that gold moved north to the Sahara and beyond — a position closer to a toll-collector on the most valuable road in the region than a direct owner of the gold source. This distinction matters for the AP exam: Mali's power rested on commercial and political control of exchange, not on monopolizing gold production itself.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The trans-Saharan network turned the Sahara from a barrier into a corridor linking West Africa to North Africa and the wider Islamic Mediterranean world.',
        'The camel, adapted with desert-suited saddles, made large-scale caravan crossings of the Sahara possible.',
        'The gold-salt trade was the network\'s economic engine: salt moved south, gold moved north, each region supplying what the other lacked.',
        "The Mali Empire grew wealthy and powerful by controlling and taxing trade routes and market cities, not by owning all of West Africa's gold outright.",
        "Mansa Musa's 1324 hajj through Cairo displayed Mali's wealth internationally and reflects how trade contact spread Islam across the Sahel.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.4',
    cedTitle: 'The Trans-Saharan Trade Network',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-mansa-musa.v1',
        chapter: 'c. 1340',
        note: 'al-Umari, "Masalik al-absar" — anchor document for the scale of Mali\'s gold wealth during Mansa Musa\'s 1324 hajj through Cairo.',
      },
    ],
  },
};
