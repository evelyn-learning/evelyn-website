/**
 * AP World History: Modern — CED Unit 2.1/2.5: The Mongol Empire and the
 * Making of the Modern World.
 *
 * Unit-2 Vertical Slice content plan, following the Silk Roads calibration
 * template (`ap-apworld-u2-silk-roads.ts`). concept = the historical
 * argument (how did Mongol conquest and administration secure and transform
 * Afro-Eurasian exchange, 1200-1450 — for better AND for worse?);
 * worked_example = annotated document analysis; try_yourself = a 3-point
 * SAQ-style short-answer.
 *
 * Anchor text: Marco Polo, The Travels (c. 1300), on the Great Khan's postal
 * relay system, the "yam" — evelyn.passage.apworld-marco-polo-yam.v1.
 * Teaching point is what the passage reveals about the administrative
 * infrastructure the Mongols built to secure their empire and its trade
 * routes.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U2_MONGOL_EMPIRE: LessonPlan = {
  id: 'evelyn.ap.apworld.mongol-empire.v1',
  title: 'U2.1 The Mongol Empire and the Making of the Modern World',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.mongol-empire',
      description:
        'Explain how Mongol conquest, administration, and the Pax Mongolica secured Afro-Eurasian trade routes and facilitated the transfer of technology, ideas, and disease in the period 1200-1450.',
      standard: 'AP-APWORLD-2.1',
    },
  ],
  prerequisites: ['apworld.trans-saharan-trade'],
  followUps: ['apworld.cultural-diffusion'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the Mongol Empire feel like a paradox — the most destructive conquest of the era AND the engine that connected the medieval world.',
      script:
        "In the early 1200s, Mongol armies under Genghis Khan and his successors conquered the largest contiguous land empire in human history — from Korea to Eastern Europe — and did it with a brutality that terrified everyone in their path. Entire cities that resisted were destroyed. And yet, within a generation, that same empire became the reason a European merchant could travel safely from the Mediterranean to Beijing for the first time in centuries. How does the most feared conquest of the medieval world end up building one of history's great connectivity booms? The answer is that the Mongols weren't just conquerors — once they held territory, they became remarkably effective, and often surprisingly tolerant, administrators. That combination — conquest plus administration — is what made the Mongol Empire a hinge point in world history.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-mongol-empire',
      kind: 'concept',
      goal: 'Explain how Mongol conquest, administrative innovation, and the Pax Mongolica secured trade and facilitated transfers of technology, ideas, and disease across Afro-Eurasia, 1200-1450.',
      keyIdeas: [
        'MONGOL CONQUESTS under Genghis Khan (united the Mongol tribes c. 1206) and his successors built the largest contiguous land empire in history by the mid-1200s, stretching from Korea and China through Central Asia to Russia, Persia, and the edge of Eastern Europe. Conquest was often extremely violent — cities that resisted were destroyed as a deterrent to others — but conquered regions that submitted were frequently governed with relative pragmatism.',
        'THE EMPIRE FRACTURED into four major KHANATES after the mid-1200s (the Yuan Dynasty in China, the Chagatai Khanate in Central Asia, the Ilkhanate in Persia, and the Golden Horde in Russia/Eastern Europe) — nominally connected by shared Mongol lineage but increasingly independent in practice. This matters for the AP exam: "the Mongol Empire" after this point functioned less as one unified state and more as a set of related, sometimes rival, successor states.',
        'MONGOL ADMINISTRATION was more tolerant and pragmatic than the conquest violence might suggest: rulers generally practiced religious tolerance (patronizing Buddhist, Muslim, Christian, and other religious communities as it suited them politically), employed skilled foreign administrators regardless of ethnicity or faith, and often preserved useful local institutions rather than replacing everything with Mongol systems.',
        "THE YAM was the empire's relay/postal system: a network of stations spaced roughly a day's journey apart (echoing but distinct from Silk Road caravanserai), each stocked with fresh horses, supplies, and lodging for imperial messengers. Marco Polo describes yam stations as well-furnished waypoints that let messages and officials move rapidly across enormous distances — a logistical backbone for holding together an empire spanning thousands of miles.",
        'PAX MONGOLICA ("Mongol Peace") describes the period of relative stability across Mongol-controlled Eurasia once conquest gave way to consolidated rule: a merchant, missionary, or diplomat crossing Mongol territory faced one set of rules and one dominant military power instead of many small, unpredictable, hostile borders — directly enabling the Silk Roads revival covered in the previous topic.',
        'TECHNOLOGY AND IDEAS TRANSFERRED across the connected empire at unprecedented speed: gunpowder weapons technology moved from China westward; Persian and Chinese scholars, astronomers, and physicians exchanged knowledge at Mongol courts; administrative and military techniques spread between regions that previously had little direct contact.',
        'THE BLACK DEATH is the empire\'s darkest transfer: the same secured trade routes and rapid overland movement that carried silk, silver, and scholars also carried the bacterium Yersinia pestis (likely originating in Central Asia) westward along Mongol-secured routes, contributing to the catastrophic plague pandemic that struck Afro-Eurasia beginning in the 1340s.',
        "THE COMBINED EFFECT: Mongol conquest was often brutal, but once territory was secured, Mongol administration — tolerant, pragmatic, and connected by infrastructure like the yam — created the most integrated overland Afro-Eurasian political-commercial space in history to that point, a double-edged achievement that spread both prosperity-building exchange and, eventually, catastrophic disease.",
      ],
      vocabulary: [
        {
          term: 'khanate',
          definition:
            'one of the four major successor states (Yuan China, Chagatai, Ilkhanate, Golden Horde) into which the Mongol Empire fractured after the mid-1200s, nominally linked by shared Mongol lineage but increasingly independent.',
        },
        {
          term: 'yam',
          definition:
            "the Mongol Empire's relay/postal system of stations spaced roughly a day's journey apart, stocked with fresh horses and supplies to let messengers and officials move rapidly across the empire.",
        },
        {
          term: 'Pax Mongolica',
          definition:
            '("Mongol Peace") the period of relative political stability across Mongol-controlled Eurasia after conquest gave way to consolidated rule, which lowered the risk of long-distance overland travel and trade.',
        },
        {
          term: 'religious tolerance (Mongol)',
          definition:
            'the general Mongol administrative practice of permitting and even patronizing multiple religious communities (Buddhist, Muslim, Christian, and others) within conquered territory, rather than imposing a single state religion.',
        },
      ],
      passageId: 'evelyn.passage.apworld-marco-polo-yam.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-marco-polo-yam',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Marco Polo\'s account (c. 1300) of the Great Khan\'s postal relay system: "The messengers of the Emperor in travelling from Cambaluc, be the road whichsoever they will, find at every twenty-five miles of the journey a station which they call Yamb... And at each of those stations... there is a large and handsome building for them to put up at, in which they find all the rooms furnished with fine beds and all other necessary articles in rich silk, and where they are provided with everything they can want." What does this passage reveal about Mongol administrative capacity, and what should a careful reader keep in mind about the source?',
      steps: [
        'SOURCE IT FIRST. Who, when, why? Marco Polo, a Venetian merchant who traveled through and resided in Mongol-ruled China under Kublai Khan in the late 1200s, later dictating an account (c. 1300) for a European audience largely unfamiliar with the scale of Mongol administration.',
        'IDENTIFY THE CLAIM. Polo describes a dense, regularly spaced network of relay stations ("at every twenty-five miles") that were not crude waypoints but well-furnished buildings — "furnished with fine beds and all other necessary articles in rich silk" — where messengers were given "everything they can want."',
        "CONNECT TO THE ADMINISTRATIVE-CAPACITY CAUSE. This is direct testimony for the concept's claim that Mongol rule, once consolidated, built genuinely sophisticated infrastructure: a relay system this dense and well-resourced required significant organizational capacity and sustained investment across enormous distances, contradicting a simple 'Mongols were only destroyers' framing.",
        'CONNECT TO THE PAX-MONGOLICA CAUSE. A functioning yam system is also evidence for Pax Mongolica in a practical sense: only a state with real control over its territory could guarantee that messengers moving across such distances would find safe, resourced stations every twenty-five miles rather than danger or emptiness.',
        'WEIGH THE SOURCE\'S RELIABILITY. Polo is an outside merchant-observer, likely never having personally used the yam system as an official messenger, describing it from what he saw or was told — and his emphasis on luxury details ("rich silk") reflects a European audience\'s appetite for exotic wonder, so the general existence and function of the system is well-corroborated by other sources, even if exact luxury details may be embellished for effect.',
        "STATE THE LINK TO THE COURSE THESIS. This passage is strong evidence for the concept's central claim: Mongol administration, not just Mongol conquest, is what secured Eurasian trade and communication — the yam is the physical infrastructure underlying the Pax Mongolica that revived the Silk Roads and enabled transfers of goods, technology, and (eventually) disease across the empire.",
      ],
      answer:
        'Polo\'s account of the yam shows a dense, well-resourced relay system — stations every twenty-five miles, furnished with "fine beds" and silk — that reveals real Mongol administrative sophistication, not just conquest. This directly supports the concept\'s claim that Mongol RULE, not just Mongol military victory, is what secured Eurasian trade and travel: only a state with genuine territorial control could guarantee resourced waypoints across such vast distances, the practical foundation of the Pax Mongolica. A careful reader should note Polo is an outside merchant-observer writing for a European audience hungry for exotic detail, so while the yam system\'s existence and basic function are well corroborated elsewhere, some luxury details may be embellished for effect.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Identify ONE administrative practice or piece of infrastructure the Mongols used to govern their empire, 1200-1450. (b) Explain how ONE such practice secured Mongol rule or trade across the empire. (c) Explain ONE way the Mongol Empire facilitated the transfer of something (technology, ideas, or disease) across Afro-Eurasia.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine Mongol administrative practice or infrastructure — e.g. the yam relay system, religious tolerance, or employing foreign administrators. No credit for a vague statement with no identifiable specific item, or for an anachronistic/incorrect one.',
            modelResponse:
              'One piece of infrastructure the Mongols used to govern their empire was the yam, a relay system of stations spaced about a day\'s journey apart.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate mechanism by which the named practice secured Mongol rule or trade — e.g. connects the yam to rapid communication/control across distance, or connects religious tolerance to reduced local resistance. No credit for an explanation disconnected from the item named in (a).',
            modelResponse:
              'Because yam stations provided fresh horses and supplies at regular intervals, imperial messengers and officials could travel rapidly across thousands of miles of territory, letting the Mongol government communicate orders and maintain control over a vastly spread-out empire far faster than would otherwise have been possible.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, historically accurate transfer facilitated by the Mongol Empire — e.g. gunpowder technology moving west, scholarly/administrative knowledge exchange at Mongol courts, or the westward spread of the Black Death along secured trade routes. No credit for a vague or unsupported claim.',
            modelResponse:
              'The Mongol Empire\'s secured trade routes, part of the Pax Mongolica, facilitated the westward spread of the Black Death: the same overland connections that let merchants and goods move rapidly and safely across Eurasia also allowed the plague, likely originating in Central Asia, to travel along those routes into the Middle East and Europe by the 1340s.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-mongols-only-destroyers',
      kind: 'misconception_check',
      question:
        'True or false: the Mongol Empire\'s only lasting historical impact was destruction — it left no meaningful positive contribution to Afro-Eurasian exchange.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Fixating on the genuine brutality of Mongol conquest and concluding the empire was purely destructive — missing that AP World's central claim about the Mongols is precisely their DUAL legacy: violent conquest followed by administration that secured and intensified Afro-Eurasian connectivity.",
          correctsTo:
            "FALSE. Mongol conquest was often brutal, and that brutality is a real and testable part of the historical record. But it is only half the story the AP exam expects: once Mongol rule was consolidated, the empire built sophisticated administrative infrastructure — the yam relay system, generally tolerant treatment of diverse religions, and employment of skilled foreign officials — that produced the Pax Mongolica. That stability revived and expanded Silk Roads trade, enabled the exchange of technology and ideas across Eurasia at unprecedented speed, and connected regions (China, Persia, Russia, Europe) that previously had little direct contact. The empire's legacy is genuinely double-edged: it enabled real prosperity-building exchange AND, through those same secured routes, helped spread the Black Death. Treating it as ONLY destructive misses the connectivity half of that story.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mongol conquest under Genghis Khan and his successors built the largest contiguous land empire in history by the mid-1200s, later fracturing into four khanates.',
        'Once territory was secured, Mongol administration was often pragmatic and religiously tolerant, employing skilled foreign officials.',
        "The yam relay system — stations roughly a day's journey apart, stocked with supplies — let messengers and officials move rapidly across the empire.",
        'Pax Mongolica describes the relative stability across Mongol territory that revived and secured overland Afro-Eurasian trade, especially the Silk Roads.',
        'Mongol-secured routes carried technology and ideas across Eurasia — and also carried the Black Death westward, a double-edged legacy.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.1',
    cedTitle: 'The Mongol Empire and the Making of the Modern World',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-marco-polo-yam.v1',
        chapter: 'c. 1300',
        note: 'Marco Polo, "The Travels" — anchor document for the yam relay system as Mongol administrative infrastructure.',
      },
    ],
  },
};
