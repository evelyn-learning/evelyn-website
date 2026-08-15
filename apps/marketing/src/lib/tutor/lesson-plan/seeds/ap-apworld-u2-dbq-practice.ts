/**
 * AP World History: Modern — Unit 2 DBQ Practice: the full Document-Based
 * Question essay (AP World FRQ 1), closing out the Unit-2 content arc (the
 * Silk Roads 2.2, the Indian Ocean network 2.3, trans-Saharan trade 2.4, the
 * Mongol Empire 2.1, and cultural/technological/biological diffusion 2.6).
 *
 * Students write ONE complete DBQ essay under real AP exam conditions, using
 * a genuine seven-document Unit-2 packet, and are scored against the
 * authentic AP World 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..7 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. Marco Polo, The Travels — the city of Kinsay (c. 1300) —
 *      evelyn.passage.apworld-marco-polo-kinsay.v1
 *   2. Marco Polo, The Travels — the Great Khan's post-houses/yam (c. 1300) —
 *      evelyn.passage.apworld-marco-polo-yam.v1
 *   3. Marco Polo, The Travels — Yuan paper money (c. 1300) —
 *      evelyn.passage.apworld-marco-polo-paper-money.v1
 *   4. Ibn Battuta, Rihla — Kilwa and the Swahili coast (c. 1355) —
 *      evelyn.passage.apworld-ibn-battuta-kilwa.v1
 *   5. al-Umari, Masalik al-absar — Mansa Musa in Cairo (c. 1340) —
 *      evelyn.passage.apworld-mansa-musa.v1
 *   6. The Catalan Atlas — Mansa Musa panel (1375) —
 *      evelyn.passage.apworld-catalan-atlas.v1
 *   7. Giovanni Boccaccio, The Decameron — the plague reaches Florence (c. 1353) —
 *      evelyn.passage.apworld-black-death.v1
 *
 * GOTCHA GUARDED AGAINST (from the APUSH DBQ review): every reference to
 * document content below is checked against each document's ACTUAL seeded
 * fullText. Nothing beyond that excerpt (e.g. specific trade goods not named
 * in the Kilwa excerpt, or a death toll not named in the Boccaccio excerpt)
 * is attributed to the document — it is instead framed explicitly as outside
 * evidence, the student's own knowledge, never inside quotation marks.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U2_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u2-dbq-practice.v1',
  title: 'Unit 2 DBQ Practice — Networks of Exchange',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u2-dbq-practice',
      description:
        'Write a complete AP World History Document-Based Question essay from a seven-document Unit-2 packet on Afro-Eurasian networks of exchange — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP World 7-point DBQ rubric.',
      standard: 'AP-APWORLD-2-DBQ',
    },
  ],
  prerequisites: [
    'apworld.silk-roads',
    'apworld.indian-ocean-trade',
    'apworld.trans-saharan-trade',
    'apworld.mongol-empire',
    'apworld.cultural-diffusion',
  ],
  followUps: [],
  estimatedMinutes: 58,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "Everything you've learned about Unit 2 — the Silk Roads, the Indian Ocean network, trans-Saharan trade, the Mongol Empire, and how all of it spread religions, technologies, crops, and disease — exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP World History exam, scored on the authentic 7-point rubric: Thesis (1), Contextualization (1), Evidence from the Documents (2), Evidence Beyond the Documents (1), Sourcing (1), and Complexity (1). You'll get seven documents spanning three continents and a century and a half. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument about how trade networks transformed Afro-Eurasia and use the documents, plus what you already know, as evidence for it. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the seven-document Unit-2 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get seven documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph ("Document 1 says X. Document 2 says Y.") instead of grouping documents around a claim.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not a simple list of "trade grew and some bad things happened too." A strong thesis for this packet might argue that trade networks transformed Afro-Eurasia by building unprecedented commercial and administrative sophistication across three interlocking networks, while that same connectivity also transmitted a catastrophic pandemic — a genuinely double-edged transformation.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing how Mongol conquest and the Pax Mongolica secured overland Eurasian routes, how monsoon-timed maritime technology (the lateen-sailed dhow) opened the Indian Ocean to predictable seasonal voyages, and how the domesticated camel made regular Saharan crossings possible — the shared technological and political preconditions that made all seven documents\' networks possible in the first place — in AT LEAST a full sentence of specific description, not a single vague phrase like "trade was increasing back then."',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0–2 points): 1 point for accurately describing the content of at least three documents; the full 2 points require using the content of at least six documents to SUPPORT the thesis\'s argument — e.g. grouping the three Marco Polo documents on Yuan China (Kinsay\'s thronged markets, Doc 1; the yam relay stations, Doc 2; sealed paper currency, Doc 3) as evidence of deep commercial and administrative sophistication at the network\'s eastern end; Kilwa\'s substantial construction (Doc 4) and Mansa Musa\'s Cairo gold-giving and its European depiction (Docs 5-6) as evidence that Indian Ocean and trans-Saharan wealth reached and was recognized across the Islamic and Mediterranean worlds; and Boccaccio\'s account of the plague\'s eastern origin and place-to-place westward spread (Doc 7) as evidence of the same connectivity\'s catastrophic downside.',
        'ROW D — EVIDENCE BEYOND THE DOCUMENTS (0–1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the seven documents, relevant to the argument and explained (not just named) — e.g. the magnetic compass and the astrolabe, navigational technologies that (alongside the dhow) let Indian Ocean sailors cross open water beyond sight of land with growing precision, technology none of the seven documents themselves describe.',
        'ROW E — SOURCING (0–1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. Marco Polo (Docs 1-3) was a Venetian merchant-traveler dictating his account for a European audience largely unfamiliar with the scale of Yuan China, which explains his emphasis on scale and luxury detail; al-Umari (Doc 5) compiled his account in Cairo from residents who had witnessed Mansa Musa\'s 1324 visit firsthand, giving it strong local credibility about the visit\'s economic impact; the Catalan Atlas (Doc 6) was made by a Christian Majorcan cartographer for the king of Aragon, which explains why it renders Mali\'s wealth in a form legible and enticing to a European royal audience rather than a West African one.',
        'ROW F — COMPLEXITY (0–1 point): earned holistically for a nuanced argument that does things like explain both benefit AND cost, corroborate multiple document types (merchant travel account, geographic compendium, illustrated map, literary frame narrative) against each other, or explain multiple variables (e.g. that the same networks that built wealth in China, the Swahili coast, and Mali also carried the Black Death to Europe) — earned through the essay\'s overall argument, not from one clever sentence in isolation.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP World DBQ scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the seven documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which trade networks transformed Afro-Eurasia in the period from 1200 to 1450." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least six of the seven documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apworld-marco-polo-kinsay.v1',
        'evelyn.passage.apworld-marco-polo-yam.v1',
        'evelyn.passage.apworld-marco-polo-paper-money.v1',
        'evelyn.passage.apworld-ibn-battuta-kilwa.v1',
        'evelyn.passage.apworld-mansa-musa.v1',
        'evelyn.passage.apworld-catalan-atlas.v1',
        'evelyn.passage.apworld-black-death.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that trade networks transformed Afro-Eurasia by building unprecedented commercial scale and administrative sophistication across the connected world, while the very same connectivity also transmitted a catastrophic pandemic — a genuinely double-edged transformation, or a comparably defensible complex claim with a clear line of reasoning. Contextualization explains that this transformation rested on new infrastructure and technology across three networks: Mongol conquest and administration secured overland Eurasian routes (the Pax Mongolica), the lateen-sailed dhow and predictable monsoon winds opened the Indian Ocean to routine seasonal voyages, and the domesticated camel made regular Saharan crossings possible — the shared preconditions behind all seven documents. The body groups at least six documents around the thesis rather than summarizing them in order: the three Marco Polo excerpts show deep commercial and administrative sophistication in Yuan China — Kinsay\'s markets so thronged with purchasers that "everything they bring in is disposed of" (Doc 1), a yam relay system resourced with "fine beds and all other necessary articles in rich silk" every twenty-five miles (Doc 2), and paper currency issued "with as much solemnity and authority as if they were of pure gold or silver" under multiple officials\' seals (Doc 3); Ibn Battuta\'s description of Kilwa as "a very fine and substantially built town" (Doc 4) and al-Umari\'s account of Mansa Musa flooding Cairo with gold gifts until he "depressed its value in Egypt" (Doc 5), echoed decades later in the Catalan Atlas\'s depiction of Mali\'s ruler as "the richest and most noble lord... on account of the abundance of gold" (Doc 6), together show that Indian Ocean and trans-Saharan wealth reached, and was recognized across, the Islamic and Mediterranean worlds; and Boccaccio\'s account that the plague "had had its origin some years before in the East" and "propagated itself without respite from place to place" into Florence (Doc 7) shows the same connectivity carrying catastrophe as well as prosperity. Outside evidence brings in the magnetic compass and the astrolabe, navigational instruments (alongside the dhow) that let Indian Ocean sailors cross open water with growing precision — technology none of the seven documents themselves describe; a strong response can add further outside knowledge that the Black Death is estimated to have killed a third or more of Europe\'s population, a demographic consequence that goes BEYOND what Document 7 itself describes (which only narrates the plague\'s arrival, not its toll) and so counts as the student\'s own knowledge, not the document\'s content. Sourcing explains that Marco Polo (Docs 1-3) was a Venetian merchant-traveler dictating his account for a European audience unfamiliar with Yuan China\'s scale, which explains his emphasis on scale and luxury detail; that al-Umari (Doc 5) compiled his account in Cairo from residents who had witnessed Mansa Musa\'s 1324 visit firsthand, giving his account of the gold-price crash strong local credibility; and that the Catalan Atlas (Doc 6) was made by a Christian Majorcan cartographer for the king of Aragon, explaining why it renders Mali\'s wealth in a form meant to catch a European royal audience\'s eye rather than a West African one. Complexity is shown by explicitly weighing benefit against cost — arguing that the same infrastructure and connectivity that built Yuan China\'s commercial sophistication, Kilwa\'s prosperity, and Mali\'s fame also carried the Black Death to Florence — and by corroborating very different document types (a merchant\'s travel account, a geographic compendium, an illustrated map, a literary frame narrative) against one another rather than treating "transformation" as a single uniform verdict.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which trade networks transformed Afro-Eurasia, 1200-1450) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a single unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt, offers a list with no line of reasoning ("trade grew and some bad things happened too"), or is not historically defensible.',
            modelResponse:
              'Trade networks transformed Afro-Eurasia by building unprecedented commercial scale and administrative sophistication across Eurasia, the Indian Ocean, and the Sahara — a transformation so deep that the same connectivity that carried this prosperity also carried a catastrophic pandemic westward.',
          },
          {
            criterionId: 'B-contextualization',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. the technological and political preconditions (Mongol conquest and Pax Mongolica, monsoon-timed dhow navigation, the domesticated camel) that made expanded trade across all three networks possible in this period. No credit (0/1) for a single vague, unsupported phrase ("trade was growing") or context copied from a document without independent elaboration.',
            modelResponse:
              'Three separate technological and political developments made this era\'s trade possible: Mongol conquest under Genghis Khan and his successors secured overland Eurasian routes under the relative stability of the Pax Mongolica, the lateen-sailed dhow let sailors exploit the Indian Ocean\'s predictable, reversing monsoon winds for routine seasonal voyages, and the domesticated camel let merchants cross the Sahara in caravans that could travel for days without water.',
          },
          {
            criterionId: 'C-evidence-documents',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST SIX of the seven documents, grouped to support the essay\'s line of reasoning (not summarized one at a time in isolation). 1/2: accurately describes the content of at least three documents, whether or not they clearly support an argument. 0/2: fewer than three documents used, or documents are misdescribed.',
            modelResponse:
              'The three Marco Polo excerpts together show deep commercial and administrative sophistication in Yuan China: Kinsay\'s markets were so thronged that "everything they bring in is disposed of" (Doc 1), the yam relay stations were resourced with "fine beds and all other necessary articles in rich silk" every twenty-five miles (Doc 2), and paper currency was issued "with as much solemnity and authority as if they were of pure gold or silver" under official seals (Doc 3). Ibn Battuta\'s description of Kilwa as "a very fine and substantially built town" (Doc 4), al-Umari\'s account of Mansa Musa\'s gold gifts that "depressed [gold\'s] value in Egypt" (Doc 5), and the Catalan Atlas\'s later depiction of Mali\'s ruler as possessing "the abundance of gold" (Doc 6) together show Indian Ocean and trans-Saharan wealth reaching and being recognized across the Islamic and Mediterranean worlds. Boccaccio\'s account that the plague originated "in the East" and spread "from place to place" into Florence (Doc 7) shows the same connectivity carrying catastrophe alongside prosperity.',
          },
          {
            criterionId: 'D-evidence-beyond',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the seven documents, relevant to the argument, and EXPLAINS its relevance (not just names it). No credit (0/1) for a vague reference with no specific evidence, or evidence that is simply named with no explanation of how it supports the thesis.',
            modelResponse:
              'The magnetic compass and improvements to the astrolabe, navigational instruments that let Indian Ocean sailors determine direction and position with growing precision even out of sight of land, worked alongside the dhow\'s lateen sail to make the ocean crossings implied by documents like Kilwa\'s prosperity (Doc 4) safer and more routine — technology none of the seven documents themselves describe. A response could alternatively supply, from its own knowledge, that the Black Death is estimated to have killed a third or more of Europe\'s population, a demographic consequence that goes BEYOND what Document 7 itself narrates, since Boccaccio\'s excerpt only describes the plague\'s arrival in Florence, not its toll.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date without explaining relevance to the argument.',
            modelResponse:
              'Marco Polo (Docs 1-3) was a Venetian merchant-traveler dictating his account around 1300 for a European audience largely unfamiliar with the scale of Yuan China, which explains his emphasis on impressive scale and luxury detail throughout the three excerpts. Al-Umari (Doc 5) compiled his account in Cairo from residents who had personally witnessed Mansa Musa\'s 1324 visit, giving his description of the gold-price crash strong local, near-contemporary credibility. The Catalan Atlas (Doc 6), made in 1375 by a Christian Majorcan cartographer for the king of Aragon, explains why it renders Mali\'s wealth in a form designed to catch a European royal audience\'s attention rather than a West African one.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. explicitly weighing benefit against cost, corroborating multiple document types against each other, or explaining more than one variable (here, contrasting prosperity in China/East Africa/Mali with the Black Death\'s catastrophic westward spread) — not from a single isolated clever sentence. No credit (0/1) if the essay treats "transformation" as a single flat verdict with no qualification or comparison.',
            modelResponse:
              'What complicates a simple "trade networks made Afro-Eurasia richer" narrative is that the same infrastructure and connectivity that built Yuan China\'s commercial sophistication (Docs 1-3), Kilwa\'s prosperity (Doc 4), and Mali\'s international fame (Docs 5-6) also carried the Black Death westward into Florence (Doc 7) — a single causal thread of connectivity producing dramatically opposite outcomes depending on what it carried, corroborated across four very different document types: a merchant\'s travel account, a geographic compendium, an illustrated map, and a literary frame narrative.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3 in order.',
        'For sourcing, ask: why did THIS author write THIS document for THIS audience, and how does that explain what it argues?',
        'Only quote what a document actually says — Document 4 (Kilwa) never mentions specific trade goods, so don\'t invent them; use what it does say (a large, substantially built town).',
        'Your outside-evidence fact should come from your own knowledge of the period, not be paraphrased from one of the seven documents.',
      ],
      estimatedMinutes: 48,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The DBQ asks you to build YOUR OWN argument and use the documents (plus outside knowledge) as evidence — never summarize each document in its own paragraph.',
        'The 7-point rubric: Thesis (1); Contextualization (1); Evidence from the Documents (2, requires 6+ documents for full credit); Evidence Beyond the Documents (1, one explained outside fact); Sourcing (1, HIPP explained for 3+ documents); Complexity (1, earned holistically).',
        'Only attribute to a document what it actually says — Kilwa (Doc 4) is described as substantially built, not as trading any specific named good.',
        'A strong complexity move for this packet: the SAME networks that built prosperity in China, East Africa, and Mali also carried the Black Death to Europe.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2-DBQ',
    cedTitle: 'Unit 2 DBQ Practice — Networks of Exchange',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Contextualization 1 / Evidence-Documents 2 / Evidence-Beyond 1 / Sourcing 1 / Complexity 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-marco-polo-kinsay.v1',
        chapter: 'c. 1300',
        note: 'Marco Polo, The Travels — the city of Kinsay — Document 1 of the seven-document Unit-2 packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-marco-polo-yam.v1',
        chapter: 'c. 1300',
        note: "Marco Polo, The Travels — the Great Khan's post-houses (yam) — Document 2 of the packet.",
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-marco-polo-paper-money.v1',
        chapter: 'c. 1300',
        note: 'Marco Polo, The Travels — Yuan paper money — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-ibn-battuta-kilwa.v1',
        chapter: 'c. 1355',
        note: 'Ibn Battuta, Rihla — Kilwa and the Swahili coast — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-mansa-musa.v1',
        chapter: 'c. 1340',
        note: 'al-Umari, Masalik al-absar — Mansa Musa in Cairo — Document 5 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-catalan-atlas.v1',
        chapter: '1375',
        note: 'The Catalan Atlas — Mansa Musa panel — Document 6 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-black-death.v1',
        chapter: 'c. 1353',
        note: 'Giovanni Boccaccio, The Decameron — the plague reaches Florence — Document 7 of the packet.',
      },
    ],
  },
};
