/**
 * AP World History: Modern — Unit 1 DBQ Practice: the full Document-Based
 * Question essay (AP World FRQ 1), closing out the Unit-1 arc (East Asia
 * 1.1, Dar al-Islam 1.2, South/Southeast Asia 1.3, the Americas and Africa
 * 1.4-1.5, medieval Europe 1.6).
 *
 * Students write ONE complete DBQ essay under real AP exam conditions, using
 * a genuine five-document Unit-1 packet, and are scored against the
 * authentic AP World 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..5 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. Marco Polo, The Travels — the palace of the Great Kaan at Cambaluc
 *      (Yule-Cordier trans., dictated c. 1298) —
 *      evelyn.passage.apworld-marco-polo-khan-court.v1
 *   2. Ibn Battuta, The Travels of Ibn Batuta — investiture at the Delhi
 *      court of Sultan Muhammad ibn Tughluq (Samuel Lee 1829 trans.) —
 *      evelyn.passage.apworld-ibn-battuta-delhi.v1
 *   3. Magna Carta (1215), clauses 12/39/40 (Avalon Project trans.) —
 *      evelyn.passage.apworld-magna-carta.v1
 *   4. Hernán Cortés, Second Letter to Charles V, on Tenochtitlan (1520,
 *      REUSE from APUSH) — evelyn.passage.apush-cortes-tenochtitlan.v1
 *   5. The Catalan Atlas — Mansa Musa panel (1375, REUSE from the Unit-2
 *      packet) — evelyn.passage.apworld-catalan-atlas.v1
 *
 * DOCUMENT-FIDELITY DISCIPLINE:
 * - Doc 1 describes the YUAN court (Kublai Khan's Cambaluc palace), not the
 *   Song — sourced here as Marco Polo, a Venetian merchant who lived at
 *   Kublai Khan's court and later dictated his account around 1298; the
 *   passage is evidence of Yuan imperial SCALE and splendor, not of Song
 *   institutions.
 * - Doc 3 (Magna Carta) includes clause 12 in the source passage exactly as
 *   the Avalon Project translation preserves it — "No scutage not aid" (an
 *   apparent transcription slip, "not" rather than "nor," left uncorrected)
 *   — though only clause 39 is actually quoted in this plan's model
 *   response and rubric.
 * - Doc 4 (Cortés) is a 1520 Spanish conquistador's account, written seventy
 *   years after this DBQ's own 1200-1450 window closes. It is used honestly
 *   as a period-boundary document: the city it describes, Tenochtitlan, was
 *   founded in 1325 and grew through the Triple Alliance formed in 1428 —
 *   built almost entirely within the prompt's own period — so the document
 *   functions here as an outside eyewitness's near-contemporary description
 *   of a state built inside the window, not as first-hand 1200-1450
 *   testimony. Sourcing must flag both the seventy-year gap and Cortés's own
 *   motive (justifying and glorifying his conquest to Charles V).
 * - Doc 5 (Catalan Atlas) is a DESCRIBED visual — only its described caption
 *   and imagery are attributed to it, as European perception of Mali's
 *   wealth, not a first-hand Malian source.
 * - Nothing beyond each document's actual seeded content (e.g. specific
 *   trade goods not named in the Cambaluc excerpt, or a death toll not named
 *   in any of the five) is attributed to that document — such claims are
 *   framed explicitly as outside evidence, never inside quotation marks.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U1_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u1-dbq-practice.v1',
  title: 'Unit 1 DBQ Practice — The Global Tapestry',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u1-dbq-practice',
      description:
        'Write a complete AP World History Document-Based Question essay from a five-document Unit-1 packet on how rulers across regions built and maintained power in the period 1200-1450 — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP World 7-point DBQ rubric.',
      standard: 'AP-APWORLD-1-DBQ',
    },
  ],
  prerequisites: [
    'apworld.east-asia-song',
    'apworld.dar-al-islam',
    'apworld.south-southeast-asia',
    'apworld.americas-africa-states',
    'apworld.medieval-europe',
  ],
  followUps: [],
  estimatedMinutes: 55,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "You've now toured this unit's whole global tapestry — a Mongol-ruled Chinese court, a Muslim sultanate ruling a Hindu-majority India, a tribute empire in the Valley of Mexico, a gold-rich West African kingdom drawn on a European map, and a fragmented, negotiated European monarchy. All of it exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP World History exam, scored on the authentic 7-point rubric: Thesis (1), Contextualization (1), Evidence from the Documents (2), Evidence Beyond the Documents (1), Sourcing (1), and Complexity (1). You'll get five documents spanning four continents and two and a half centuries. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument about how rulers built and held power across these very different regions, and use the documents, plus what you already know, as evidence for it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the five-document Unit-1 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get five documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph ("Document 1 says X. Document 2 says Y.") instead of grouping documents around a claim.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not a simple list of "rulers built power in different ways." A strong thesis for this packet might argue that rulers across these regions relied on comparable methods — projected wealth and splendor, formalized systems of reward and administration, and control of lucrative trade — even though medieval Europe\'s monarchs, uniquely in this packet, also faced concrete negotiated limits on that power from their own elites.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing how this period followed the Mongol conquests\' reshaping of Eurasian politics, the fragmentation of the Abbasid Caliphate into competing regional Islamic states, and the continued rise of large, complex states in the Americas and Africa entirely without European contact — the shared backdrop against which every region in the packet was independently building or contesting centralized rule — in AT LEAST a full sentence of specific description, not a single vague phrase like "there were a lot of rulers back then."',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0–2 points): 1 point for accurately describing the content of at least two documents; the full 2 points require using the content of AT LEAST FOUR of the five documents to SUPPORT the thesis\'s argument (the established DBQ Row-C convention for a five-document packet) — e.g. grouping Marco Polo\'s Cambaluc palace (Doc 1) and the Catalan Atlas\'s golden-orbed Mansa Musa (Doc 5) as rulers projecting wealth and splendor to display power; Ibn Battuta\'s investiture with robes, a horse, and a treasury salary (Doc 2) as a formalized system rewarding administrators; and Cortés\'s description of Tenochtitlan\'s causeways and thronged market (Doc 4) as evidence of a tribute economy funding a ruling elite — while Magna Carta (Doc 3) instead shows European elites imposing NEGOTIATED LIMITS on that same kind of royal power.',
        'ROW D — EVIDENCE BEYOND THE DOCUMENTS (0–1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the five documents, relevant to the argument and explained (not just named) — e.g. the Inca mit\'a system of rotational labor service, a method of building and maintaining state power through labor obligation rather than tribute goods or gold, which none of the five documents themselves describe.',
        'ROW E — SOURCING (0–1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. Marco Polo (Doc 1) was a Venetian merchant who lived at Kublai Khan\'s Yuan court and dictated his account around 1298 for a European audience with no comparable frame of reference, which explains his awed, superlative language about the palace\'s scale; Cortés (Doc 4) wrote in 1520, seventy years after this DBQ\'s own period closes, as a Spanish conquistador justifying and glorifying his conquest to Charles V, even though the city he describes was built almost entirely within the 1200-1450 window; and the Catalan Atlas (Doc 5) was made in 1375 by a Majorcan Jewish cartographer for the king of Aragon, a European audience, which explains why it renders Mali\'s wealth in a form meant to catch a European royal patron\'s eye rather than a West African one.',
        'ROW F — COMPLEXITY (0–1 point): earned holistically for a nuanced argument that does things like explain that "similar methods" is genuinely qualified — Magna Carta shows power being CONSTRAINED rather than built or displayed — corroborate multiple document types (a merchant\'s travel account, a qadi\'s memoir, a legal charter, a conquistador\'s letter, an illustrated map) against each other, or explain multiple variables (e.g. that wealth-display, administrative reward, and tribute economies reinforced royal power in four of the five documents, while negotiated baronial limits in the fifth show the opposite dynamic) — earned through the essay\'s overall argument, not from one clever sentence in isolation.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP World DBQ scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the five documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which rulers in the period 1200 to 1450 used similar methods to build and maintain power across regions." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least four of the five documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apworld-marco-polo-khan-court.v1',
        'evelyn.passage.apworld-ibn-battuta-delhi.v1',
        'evelyn.passage.apworld-magna-carta.v1',
        'evelyn.passage.apush-cortes-tenochtitlan.v1',
        'evelyn.passage.apworld-catalan-atlas.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that rulers across Yuan China, the Delhi Sultanate, the Mexica tribute empire, and Mali relied on comparable methods — projecting wealth and splendor, formalizing systems of administrative reward, and controlling lucrative tribute or trade — to build and maintain power, even though medieval European monarchs, uniquely in this packet, also faced concrete negotiated limits imposed on that power by their own elites, or a comparably defensible complex claim with a clear line of reasoning. Contextualization explains that this period followed the Mongol conquests\' reshaping of Eurasian politics, the fragmentation of the Abbasid Caliphate into competing regional Islamic states after 1258, and the continued rise of large, complex, centrally organized states in the Americas and Africa entirely without European contact — the shared backdrop against which every region in the packet was independently building, projecting, or contesting centralized rule. The body groups at least four of the five documents around the thesis: Marco Polo\'s account of Kublai Khan\'s Cambaluc palace, "so vast, so rich, and so beautiful, that no man on earth could design anything superior to it" (Doc 1), and the Catalan Atlas\'s depiction of Mansa Musa holding a golden orb and captioned as "the richest and most noble lord... on account of the abundance of gold" (Doc 5), together show rulers using visible splendor and wealth to project power to observers; Ibn Battuta\'s investiture at the Delhi court — "a dress of honour, and a horse furnished with an ornamented saddle" plus a salary "drawn from the treasury" (Doc 2) — shows a formalized administrative system rewarding officials as a method of maintaining a functioning state; and Cortés\'s description of Tenochtitlan\'s causeways and its great market, "surrounded by arcades, where there are daily more than sixty thousand souls, buying and selling" (Doc 4), shows a tribute and commercial economy funding the Mexica ruling elite. Magna Carta (Doc 3) instead shows the reverse dynamic: English barons forcing King John to accept that "no freemen shall be taken or imprisoned... except by the lawful judgment of his peers or by the law of the land," a NEGOTIATED LIMIT on royal power rather than a method of building or displaying it. Outside evidence brings in the Inca mit\'a system, a form of rotational labor service through which subject communities owed the state labor rather than tribute goods or gold — a method of building and maintaining power through labor obligation that none of the five documents themselves describe. Sourcing explains that Marco Polo (Doc 1) was a Venetian merchant who lived at Kublai Khan\'s Yuan court and dictated his account around 1298 for a European audience with no comparable frame of reference, which explains his superlative, awed language about the palace\'s scale; that Cortés (Doc 4) wrote in 1520, seventy years after this DBQ\'s own period closes, as a Spanish conquistador justifying and glorifying his conquest to Charles V — even though the city he describes, founded in 1325 and expanded through the Triple Alliance of 1428, was built almost entirely within the 1200-1450 window itself; and that the Catalan Atlas (Doc 5), made in 1375 by a Majorcan Jewish cartographer for the king of Aragon, renders Mali\'s wealth in a form designed to catch a European royal patron\'s eye rather than a West African one. Complexity is shown by explicitly qualifying "similar methods" — noting that four of the five documents show power being BUILT through wealth display, administrative reward, and tribute, while Magna Carta shows power being CONSTRAINED by negotiated baronial limits, a genuinely different dynamic — and by corroborating very different document types (a merchant\'s travel account, a qadi\'s memoir, a legal charter, a conquistador\'s letter, an illustrated map) against one another rather than treating "similar methods" as a uniform, unqualified pattern.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which rulers used similar methods to build and maintain power, 1200-1450) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a single unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt, offers a list with no line of reasoning ("rulers built power in different ways"), or is not historically defensible.',
            modelResponse:
              'Rulers across Yuan China, the Delhi Sultanate, the Mexica Empire, and Mali built and maintained power through comparable methods — projecting wealth and splendor, formalizing systems of administrative reward, and controlling tribute or trade — even though medieval European monarchs, uniquely in this packet, also faced concrete negotiated limits on that power imposed by their own elites.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. the Mongol conquests\' reshaping of Eurasian politics, the fragmentation of the Abbasid Caliphate after 1258, and the continued rise of complex states in the Americas and Africa without European contact. No credit (0/1) for a single vague, unsupported phrase ("there were many rulers") or context copied from a document without independent elaboration.',
            modelResponse:
              'This period followed the Mongol conquests\' reshaping of Eurasian politics, the fragmentation of the Abbasid Caliphate into competing regional Islamic states after the Mongol sack of Baghdad in 1258, and the continued rise of large, centrally organized states in the Americas and Africa entirely without European contact — the shared backdrop against which every region in this packet was independently building, projecting, or contesting centralized rule.',
          },
          {
            criterionId: 'C-doc-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST FOUR of the five documents, grouped to support the essay\'s line of reasoning (not summarized one at a time in isolation). 1/2: accurately describes the content of at least two documents, whether or not they clearly support an argument. 0/2: fewer than two documents used, or documents are misdescribed.',
            modelResponse:
              'Marco Polo\'s Cambaluc palace, "so vast, so rich, and so beautiful, that no man on earth could design anything superior to it" (Doc 1), and the Catalan Atlas\'s golden-orbed Mansa Musa, captioned as possessing "the abundance of gold" (Doc 5), together show rulers using visible splendor to project power. Ibn Battuta\'s investiture at Delhi — "a dress of honour, and a horse furnished with an ornamented saddle" plus a treasury salary (Doc 2) — shows a formalized administrative reward system. Cortés\'s description of Tenochtitlan\'s market, where "daily more than sixty thousand souls" bought and sold goods (Doc 4), shows a tribute and commercial economy funding the ruling elite. Magna Carta (Doc 3), by contrast, shows barons imposing a negotiated limit rather than rulers building power: "no freemen shall be taken or imprisoned... except by the lawful judgment of his peers or by the law of the land."',
          },
          {
            criterionId: 'D-outside-evidence',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the five documents, relevant to the argument, and EXPLAINS its relevance (not just names it). No credit (0/1) for a vague reference with no specific evidence, or evidence that is simply named with no explanation of how it supports the thesis.',
            modelResponse:
              'The Inca mit\'a system, in which subject communities owed the state periods of rotational labor — building roads, farming state lands, serving in the military — rather than paying tribute in goods, is a further method of building and maintaining state power through labor obligation that none of the five documents themselves describe, and shows the range of methods extended even further than the packet\'s wealth-display and tribute examples.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date without explaining relevance to the argument.',
            modelResponse:
              'Marco Polo (Doc 1) was a Venetian merchant who lived at Kublai Khan\'s Yuan court and dictated his account around 1298 for a European audience with no comparable frame of reference, which explains his superlative, awed language about the palace\'s scale. Cortés (Doc 4) wrote in 1520, seventy years after this DBQ\'s own period closes, as a Spanish conquistador justifying and glorifying his conquest to Charles V — even so, the city he describes was founded in 1325 and expanded through the Triple Alliance of 1428, built almost entirely within the 1200-1450 window itself, so the document still functions as a near-contemporary outside description of a state built inside the period. The Catalan Atlas (Doc 5), made in 1375 by a Majorcan Jewish cartographer for the king of Aragon, renders Mali\'s wealth in a form designed to catch a European royal patron\'s eye rather than a West African one.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. explicitly qualifying "similar methods" across the packet, corroborating multiple document types against each other, or explaining more than one variable (here, contrasting power BUILT through wealth/reward/tribute in four documents with power CONSTRAINED by negotiated limits in the fifth) — not from a single isolated clever sentence. No credit (0/1) if the essay treats "similar methods" as a single flat pattern with no qualification or comparison.',
            modelResponse:
              'What complicates a simple "rulers everywhere built power the same way" narrative is that four of the five documents show power being BUILT through wealth display (Docs 1, 5), administrative reward (Doc 2), and tribute or commercial control (Doc 4), while Magna Carta (Doc 3) shows the opposite dynamic — English barons imposing a negotiated LIMIT on royal power rather than a method of building it — a genuinely different relationship between rulers and elites, corroborated across five very different document types: a merchant\'s travel account, a qadi\'s memoir, a legal charter, a conquistador\'s letter, and an illustrated map.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3 in order.',
        'For sourcing, ask: why did THIS author write THIS document for THIS audience, and how does that explain what it argues?',
        'Only quote what a document actually says — Document 1 (Marco Polo) describes Kublai Khan\'s Yuan-era palace, not the Song Dynasty, so don\'t attribute it to the wrong dynasty.',
        'Document 4 (Cortés) was written in 1520, after this DBQ\'s period ends — use it honestly as a near-contemporary description of a state (Tenochtitlan) that was actually built within 1200-1450, and say so explicitly in your sourcing.',
        'Your outside-evidence fact should come from your own knowledge of the period, not be paraphrased from one of the five documents.',
      ],
      estimatedMinutes: 45,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The DBQ asks you to build YOUR OWN argument and use the documents (plus outside knowledge) as evidence — never summarize each document in its own paragraph.',
        'The 7-point rubric: Thesis (1); Contextualization (1); Evidence from the Documents (2, requires 4+ of 5 documents for full credit); Evidence Beyond the Documents (1, one explained outside fact); Sourcing (1, HIPP explained for 3+ documents); Complexity (1, earned holistically).',
        'Only attribute to a document what it actually says — Document 1 (Marco Polo) describes the Yuan court under Kublai Khan, not the Song Dynasty.',
        'Document 4 (Cortés, 1520) describes a state, Tenochtitlan, that was largely built within the DBQ\'s own 1200-1450 window even though the letter itself was written after it — frame that honestly rather than ignoring the date gap.',
        'A strong complexity move for this packet: four documents show rulers BUILDING power through wealth, reward, and tribute, while Magna Carta shows elites CONSTRAINING it instead.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1-DBQ',
    cedTitle: 'Unit 1 DBQ Practice — The Global Tapestry',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Contextualization 1 / Evidence-Documents 2 / Evidence-Beyond 1 / Sourcing 1 / Complexity 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-marco-polo-khan-court.v1',
        chapter: 'c. 1298',
        note: "Marco Polo, The Travels — the palace of the Great Kaan at Cambaluc — Document 1 of the five-document Unit-1 packet.",
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-ibn-battuta-delhi.v1',
        chapter: 'c. 1355',
        note: 'Ibn Battuta, The Travels of Ibn Batuta — investiture at the Delhi court of Sultan Muhammad ibn Tughluq — Document 2 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-magna-carta.v1',
        chapter: '1215',
        note: 'Magna Carta, clauses 12/39/40 (Avalon Project trans.) — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-cortes-tenochtitlan.v1',
        chapter: '1520',
        note: 'Hernán Cortés, Second Letter to Charles V, on Tenochtitlan — Document 4 of the packet (reused from APUSH).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-catalan-atlas.v1',
        chapter: '1375',
        note: 'The Catalan Atlas — Mansa Musa panel — Document 5 of the packet (reused from the Unit-2 packet).',
      },
    ],
  },
};
