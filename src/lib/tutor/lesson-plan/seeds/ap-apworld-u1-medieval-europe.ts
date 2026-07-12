/**
 * AP World History: Modern — CED Unit 1.6: Developments in Medieval
 * Europe.
 *
 * Unit-1 fan-out content plan, following the Unit-2 calibration template
 * (`ap-apworld-u2-silk-roads.ts`). concept = the historical argument (how
 * did feudalism, manorialism, and Church authority fragment medieval
 * European political power, and how did the Magna Carta and the revival
 * of towns/universities reflect and challenge that structure, 1200-1450?);
 * worked_example = annotated document analysis; try_yourself = a 3-point
 * SAQ-style short-answer.
 *
 * Anchor text: Magna Carta (1215, Avalon Project translation), clause 12
 * — evelyn.passage.apworld-magna-carta.v1. QUOTING DISCIPLINE: the Avalon
 * translation reads "No scutage not aid shall be imposed..." — an
 * apparent transcription slip ("not" rather than "nor") preserved in the
 * source itself. Quoted here EXACTLY as seeded, never silently corrected.
 * The unit-level SAQ practice FRQ separately quotes clause 39 (the
 * "no free man" clause) as its stimulus — this content plan's own
 * try_yourself deliberately uses a non-passage prompt to avoid
 * duplicating that stimulus.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U1_MEDIEVAL_EUROPE: LessonPlan = {
  id: 'evelyn.ap.apworld.medieval-europe.v1',
  title: 'U1.6 Developments in Medieval Europe',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.medieval-europe',
      description:
        'Explain how feudalism, manorialism, and competition between monarchs and the Church fragmented medieval European political power, and how the Magna Carta and the revival of towns and universities reflected and challenged that structure in the period 1200-1450.',
      standard: 'AP-APWORLD-1.6',
    },
  ],
  prerequisites: ['apworld.americas-africa-states'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the point that medieval Europe was politically fragmented, not centralized — a genuinely different model from the empires studied elsewhere in this unit, not a "less advanced" one.',
      script:
        "Everywhere else in this unit, we've seen states that concentrated power at the top — a Yuan emperor, a Delhi sultan, a Mexica tribute empire, a Mali gold monopoly enforced by an emperor's court. Medieval Europe looked almost nothing like that. By 1200, Europe was a patchwork of small, competing monarchies, powerful nobles who owed only limited loyalty upward, and a Catholic Church that could rival — and check — even a king's authority. When King John of England pushed his barons too far in 1215, they didn't overthrow him; they forced him to sign a charter limiting exactly what he could and couldn't do. That charter, Magna Carta, wasn't democracy. It was a narrow, negotiated bargain between a king and his most powerful subjects — a perfect snapshot of how fragmented, checked, and contested royal power really was in medieval Europe.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-medieval-europe-fragmentation',
      kind: 'concept',
      goal: 'Explain how feudalism, manorialism, and Church authority fragmented medieval European political power, and how the Magna Carta and the revival of towns and universities reflected and challenged that structure, 1200-1450.',
      keyIdeas: [
        'MEDIEVAL EUROPE, by 1200, was politically FRAGMENTED into many competing, often small monarchies and principalities — a sharp contrast to the highly centralized bureaucratic states covered elsewhere in this unit (Song/Yuan China, the Mamluk and Delhi sultanates).',
        "FEUDALISM organized POLITICAL and MILITARY obligation: a decentralized system of reciprocal bonds in which monarchs granted land (fiefs) to nobles in exchange for military service and loyalty, who in turn could grant land to lesser lords. Power radiated outward from a weak center rather than being administered by a trained, centrally-appointed bureaucracy, unlike China's exam-selected officials.",
        "MANORIALISM organized ECONOMIC life at the local level: peasants, many legally bound as serfs, worked a lord's manor land in exchange for protection and the right to work a portion of land for themselves — a self-sufficient, agrarian, and highly localized economic unit, quite different from the market-integrated commercial economies of Song China or the Indian Ocean network.",
        "MONARCHS VS. THE CHURCH: the medieval Catholic Church, headed by the Pope, held enormous independent political, economic (vast landholding), and cultural authority that rivaled and often checked royal power. Kings and the Church repeatedly contested authority over appointments, taxation, and law — no single medieval European monarch commanded anything close to the unchecked authority of a Yuan emperor or a Delhi sultan.",
        'MAGNA CARTA (1215): English barons, resisting King John\'s arbitrary taxation and justice, forced him to accept a charter limiting royal power. Barons — not common people — were the primary beneficiaries and negotiators. Clauses limited arbitrary taxation (requiring "common counsel of our kingdom" before certain levies) and arbitrary justice (guaranteeing that "freemen" could not be imprisoned "except by the lawful judgment of his peers or by the law of the land") — protections that applied specifically to "freemen," a legally privileged class that excluded the unfree peasantry bound under manorialism.',
        'TOWNS AND UNIVERSITIES REVIVED from roughly the 11th-12th century onward: expanding trade grew merchant and artisan towns that won charters of self-governance from kings or lords, creating an urban, commercial counterweight to purely feudal/manorial society. UNIVERSITIES (e.g. Paris, Oxford, Bologna) emerged as organized centers of higher learning, training clergy, lawyers, and administrators — a modest but real institutional and intellectual counterpart to the madrasa networks and Confucian examination culture covered elsewhere in this unit.',
        "COMPARISON TO CENTRALIZED STATES: unlike Song/Yuan China's exam-selected bureaucracy and unified currency, or the Islamic world's shared ulama/madrasa network, medieval Europe's political power stayed fragmented among competing kings, nobles, and the Church — a genuinely different model of organizing a complex society, not a \"less advanced\" one, since Europe's own commercial and educational revival (towns, universities) proceeded on its own distinct institutional track.",
        "THE COMBINED EFFECT: feudalism and manorialism organized medieval Europe's military/political and economic life around localized, personal bonds rather than centralized bureaucracy; the Church's independent authority further fragmented power; Magna Carta shows one specific, narrow (baronial) limit placed on a king within that fragmented structure; and the revival of towns and universities shows medieval Europe building its own alternative institutions of commerce and learning alongside — not instead of — that fragmented political structure.",
      ],
      vocabulary: [
        {
          term: 'feudalism',
          definition:
            'a decentralized system of reciprocal political and military obligation in which monarchs granted land (fiefs) to nobles in exchange for military service and loyalty, who could in turn grant land to lesser lords.',
        },
        {
          term: 'manorialism',
          definition:
            "a localized economic system in which peasants (often serfs) worked a lord's manor land in exchange for protection and the right to farm a portion of land for themselves — a largely self-sufficient agrarian unit.",
        },
        {
          term: 'Magna Carta',
          definition:
            "a 1215 charter English barons forced King John to accept, limiting royal power over taxation and justice — primarily protecting the feudal nobility (\"freemen\"), not the unfree peasantry or common people generally.",
        },
        {
          term: 'medieval university',
          definition:
            'an organized center of higher learning (e.g. Paris, Oxford, Bologna) that emerged from the 11th-12th century onward, training clergy, lawyers, and administrators as part of the broader revival of towns and commerce.',
        },
      ],
      passageId: 'evelyn.passage.apworld-magna-carta.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-magna-carta-clause-12',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Magna Carta (1215), clause 12: "No scutage not aid shall be imposed on our kingdom, unless by common counsel of our kingdom, except for ransoming our person, for making our eldest son a knight, and for once marrying our eldest daughter; and for these there shall not be levied more than a reasonable aid." What does this clause reveal about the limits placed on King John\'s power, and what should a careful reader keep in mind about the source, including its wording?',
      steps: [
        "SOURCE IT FIRST. Magna Carta, a charter forced on King John of England by his rebellious barons in 1215 at Runnymede, quoted here from the Avalon Project's translation — a negotiated settlement between a monarch and his most powerful subjects, not a document written for the common population.",
        'IDENTIFY THE CLAIM, QUOTING CAREFULLY. The clause states "No scutage not aid shall be imposed on our kingdom, unless by common counsel of our kingdom" — note the clause\'s own wording preserves an apparent transcription slip ("No scutage not aid" rather than the more grammatical "nor aid"), quoted here exactly as published rather than silently corrected, since the source itself reads this way. Its meaning: scutage (a payment in place of military service) and certain feudal aids (special taxes) require the "common counsel" (consent) of the kingdom\'s leading men, except for three named traditional occasions — ransom, the eldest son\'s knighting, the eldest daughter\'s marriage — for which "there shall not be levied more than a reasonable aid."',
        "CONNECT TO THE FRAGMENTED-MONARCHY CAUSE. This clause is a direct, textual limit on a king's ability to tax at will — exactly the kind of check on royal authority that distinguishes medieval Europe's fragmented power structure from a centralized bureaucratic state where a ruler's fiscal authority went largely unchallenged by a body of the ruler's own subjects.",
        'CONNECT TO THE BARONS-NOT-COMMONERS DETAIL. The "common counsel of our kingdom" being negotiated for refers to the kingdom\'s great lords and higher clergy, not the peasantry bound under manorialism — the clause protects the feudal nobility\'s own fiscal interests against royal overreach, not a universal right belonging to all subjects.',
        'WEIGH THE SOURCE\'S RELIABILITY. Magna Carta is a negotiated legal-political document, not a philosophical statement of rights — its precise, narrow, transactional language (specific named exceptions, a "reasonable aid") reflects a practical bargain between a king and his most powerful barons, not a universal declaration of individual liberty.',
        "STATE THE LINK TO THE COURSE THESIS. The clause is concrete evidence of the concept's central claim: English monarchy, like medieval European monarchy more broadly, operated under real, negotiated, textually fixed limits imposed by the kingdom's most powerful subjects — a fragmented model of authority quite unlike the centralized states studied elsewhere in this unit.",
      ],
      answer:
        'Clause 12 is concrete, textual evidence that King John\'s power to tax was limited by a negotiated agreement with his barons: scutage and feudal aids required "common counsel of our kingdom" except for three narrowly named traditional occasions, and even those were capped at "a reasonable aid." A careful reader should quote the clause\'s own wording exactly — including the apparent transcription slip "No scutage not aid" rather than silently correcting it to "nor" — and should note that the "common counsel" being protected was the kingdom\'s barons and higher clergy, not the common population bound under manorialism. The clause reflects a practical, transactional bargain between a king and his most powerful subjects, not a universal declaration of rights, and is direct evidence of the fragmented, negotiated nature of medieval European royal power.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Identify ONE way medieval European monarchs' power was limited or checked in the period 1200-1450. (b) Explain how ONE such check limited a monarch's power in practice. (c) Explain ONE way medieval Europe's political organization in this period differed from Song or Yuan China's.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine check on monarchical power in this period — e.g. feudal reciprocal obligation, a baronial charter like Magna Carta, or Church authority. No credit for a vague statement ("kings had less power") with no identifiable specific mechanism, or an anachronistic/incorrect item.',
            modelResponse:
              "One way medieval European monarchs' power was checked was through baronial charters like Magna Carta, which limited what taxes a king could impose without noble consent.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate mechanism by which the named check limited royal power in practice — connects it to a concrete limitation (e.g. requiring consent before taxation, or the Church\'s independent landholding and authority) rather than a vague restatement. No credit for an explanation disconnected from the item named in (a).',
            modelResponse:
              'Magna Carta required King John to obtain "common counsel of our kingdom" — the consent of his leading barons and clergy — before imposing certain taxes like scutage, meaning the king could no longer simply tax at will without negotiating with the kingdom\'s most powerful subjects.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, historically accurate difference between medieval European political organization and Song/Yuan China — e.g. fragmented feudal/noble/Church power versus a centralized, exam-selected bureaucracy. No credit for a vague or unsupported claim.',
            modelResponse:
              'Unlike Song and Yuan China, which were governed through a centralized, examination-selected bureaucracy answering to the emperor, medieval Europe\'s political power was fragmented among competing kings, feudal nobles who owed only limited obligations upward, and an independently powerful Church — no single ruler held anything close to the centralized authority of a Chinese emperor.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-magna-carta-democracy',
      kind: 'misconception_check',
      question:
        'True or false: Magna Carta established democracy in medieval England.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Reading Magna Carta's later reputation as a foundation of modern constitutional rights back into 1215 itself — assuming the charter's original intent and effect was to establish broad democratic rights for the general population.",
          correctsTo:
            'FALSE. Magna Carta (1215) was a narrow, negotiated charter primarily protecting the feudal nobility — and, to a lesser extent, the Church — from King John\'s arbitrary taxation and justice. Its protections were framed around "freemen," a legally privileged class that excluded the unfree peasantry bound under manorialism, and it said nothing about elections, representation, or rights for the common population. It did NOT establish democracy, universal rights, or protections for serfs. Broader rights developed much later, over centuries, as later generations reinterpreted and expanded specific clauses (like the "lawful judgment of his peers" clause) into broader principles of due process — a process that had barely begun in 1215. On the AP exam, describe Magna Carta as a baronial limit on royal power, not an act of democratization.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Medieval Europe was politically fragmented by 1200 — feudalism organized political/military obligation, manorialism organized local economic life, and the Church held independent power that checked monarchs.',
        'Magna Carta (1215) was a narrow, negotiated charter limiting King John\'s taxation and justice — protecting "freemen" (the feudal nobility and Church), not the unfree peasantry or common population.',
        'Quote Magna Carta clauses exactly as the Avalon Project translation preserves them, including apparent transcription slips like "No scutage not aid" — never silently correct the wording.',
        'The revival of towns and universities (Paris, Oxford, Bologna) built medieval Europe\'s own institutional counterpart to trade cities and madrasa networks elsewhere, without requiring centralized political power.',
        "Medieval Europe's fragmented model of power differed from — but was not \"less advanced\" than — the centralized bureaucracies of Song/Yuan China or the Islamic sultanates covered elsewhere in this unit.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.6',
    cedTitle: 'Developments in Medieval Europe',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-magna-carta.v1',
        chapter: '1215',
        note: 'Magna Carta (Avalon Project trans.) — anchor document for baronial limits on medieval English royal power.',
      },
    ],
  },
};
