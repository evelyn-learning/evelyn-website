/**
 * AP World History: Modern — Unit 4 DBQ Practice: the full Document-Based
 * Question essay (AP World FRQ 1), closing out the Unit-4 content arc
 * (maritime exploration 4.1-4.2, the global Columbian Exchange 4.3, maritime
 * empires 4.4-4.5, the Atlantic slave trade 4.6, and non-European resistance
 * and accommodation 4.7-4.8).
 *
 * Students write ONE complete DBQ essay under real AP exam conditions, using
 * a genuine five-document Unit-4 packet, and are scored against the
 * authentic AP World 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..5 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. Christopher Columbus, letter to Luis de Santángel (1493) —
 *      evelyn.passage.apush-columbus-letter.v1 (REUSE from APUSH)
 *   2. Zheng He's Treasure Fleet vs. an Iberian Caravel (scale comparison,
 *      described visual) — evelyn.passage.apworld-zheng-he-visual.v1
 *   3. Registered Silver Output, Potosí and Spanish America (described data
 *      table) — evelyn.passage.apworld-potosi-silver-table.v1
 *   4. Closed Country Edict of 1635 (described document) —
 *      evelyn.passage.apworld-tokugawa-edict.v1
 *   5. Olaudah Equiano, "The Interesting Narrative" (1789) —
 *      evelyn.passage.apush-equiano.v1 (REUSE from APUSH)
 *
 * GOTCHAS GUARDED AGAINST:
 * - Every reference to document content below is checked against each
 *   document's ACTUAL seeded fullText. Nothing beyond that excerpt/
 *   description is attributed to the document — broader claims are framed
 *   explicitly as outside evidence, never inside quotation marks.
 * - Document 4 (the Tokugawa edict) is a DESCRIBED DOCUMENT: no confirmed
 *   public-domain translation exists, so this file paraphrases its content
 *   in original prose ONLY, exactly as the passage's own fullText does.
 *   NO quotation marks are ever placed around edict language, anywhere in
 *   this file (problem, expectedAnswer, rubric, hints, metadata).
 * - Document 2 (Zheng He) presents contested treasure-ship dimensions as a
 *   range, never a single false-precise figure.
 * - Document 3 (the Potosí table) uses the seeded figures exactly: ~136,000
 *   metric tons for Spanish America 1550-1800 (~80% of world output), ~18,000
 *   metric tons for Potosí city 1574-1735, and 30-40% (a range) of American
 *   silver reaching China.
 * - Document 1 (Columbus) is quoted only from its two seeded spans: the
 *   islands'/rivers' description and the "guileless, and so liberal" account
 *   of the islanders after their fear passed.
 * - Document 5 (Equiano) is quoted only from its seeded excerpt: the
 *   inspection, the chained captives, and Equiano's own fear/terror — never
 *   anything beyond that (e.g. no flogging or death, which the excerpt does
 *   not describe).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U4_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u4-dbq-practice.v1',
  title: 'Unit 4 DBQ Practice — Transoceanic Connections and the Global Economy',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u4-dbq-practice',
      description:
        'Write a complete AP World History Document-Based Question essay from a five-document Unit-4 packet on transoceanic connections and the global economy, 1450-1750 — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP World 7-point DBQ rubric.',
      standard: 'AP-APWORLD-4-DBQ',
    },
  ],
  prerequisites: [
    'apworld.maritime-exploration',
    'apworld.columbian-exchange-global',
    'apworld.maritime-empires',
    'apworld.atlantic-slave-trade',
    'apworld.resistance-accommodation',
  ],
  followUps: [],
  estimatedMinutes: 58,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "Everything you've learned about Unit 4 — the age of exploration, the Columbian Exchange, maritime empires, the Atlantic slave trade, and how non-European states responded to all of it — exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP World History exam, scored on the authentic 7-point rubric: Thesis (1), Contextualization (1), Evidence from the Documents (2), Evidence Beyond the Documents (1), Sourcing (1), and Complexity (1). You'll get five documents spanning three continents and three centuries. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument about how transoceanic connections transformed the global economy and use the documents, plus what you already know, as evidence for it. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the five-document Unit-4 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get five documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph instead of grouping documents around a claim.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt. A strong thesis for this packet might argue that transoceanic connections transformed the global economy by knitting the Americas, Europe, Africa, and Asia into a single silver-driven and forced-labor-dependent system, generating immense new wealth while inflicting catastrophic human costs and provoking active management by non-European states — a genuinely double-edged transformation, not a one-directional European triumph.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing how Iberian monarchies sought to bypass Ottoman- and Venetian-controlled overland spice routes, how borrowed navigational technology (the compass, lateen sail, astrolabe) made sustained transoceanic voyaging possible, and how mercantilist competition among European crowns after 1500 rewarded continuous reinvestment in overseas ventures — the shared preconditions behind the network all five documents describe — in AT LEAST a full sentence of specific description.',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0–2 points): 1 point for accurately describing the content of at least three documents; the full 2 points require using the content of AT LEAST FOUR OF THE FIVE documents to SUPPORT the thesis\'s argument — e.g. grouping Columbus\'s 1493 letter (Doc 1) describing Española\'s gold-bearing rivers as the initial material lure that eventually produced the silver output the Potosí table (Doc 3) records; the Zheng He scale comparison (Doc 2) showing Ming China\'s greater initial capacity for state-sponsored voyaging and its 1433 withdrawal, which left the sustained network to smaller, continuously reinvesting European powers; the Tokugawa edict (Doc 4) showing a major Afro-Eurasian state narrowing rather than eliminating its participation in that network on its own terms; and Equiano\'s account (Doc 5) of his own inspection and confinement as firsthand evidence of the forced-labor system the new economy depended on.',
        'ROW D — EVIDENCE BEYOND THE DOCUMENTS (0–1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the five documents, relevant to the argument and explained — e.g. the Dutch East India Company (VOC), chartered in 1602 as a joint-stock company that pooled private capital at a scale rivaling state treasuries, a financing innovation none of the five documents themselves describe.',
        'ROW E — SOURCING (0–1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. Columbus (Doc 1) wrote to a Spanish royal treasury official specifically to justify continued crown investment in future voyages, which explains his emphasis on the islands\' gold-bearing rivers and the islanders\' generosity; the Tokugawa edict (Doc 4) was an internal administrative directive from the shogunate to its own port officials, not a document addressed to any foreign audience, which explains its blunt, unqualified enforcement language; Equiano (Doc 5) published his account in 1789, decades after the childhood experience it recounts, for an English-speaking, increasingly abolitionist-sympathetic audience, which explains why he foregrounds his own psychological terror in vivid, sequential detail.',
        'ROW F — COMPLEXITY (0–1 point): earned holistically for a nuanced argument that does things like explain both benefit AND cost, corroborate multiple document types (a letter, a described visual, a described data table, a described document, a memoir) against each other, or explain multiple variables (e.g. that the same connections that produced immense wealth for European crowns and the Chinese monetary economy also extracted a catastrophic human toll and prompted a spectrum of non-European responses, from Ming China\'s voluntary withdrawal to Tokugawa Japan\'s active management to Equiano\'s forced subjection) — earned through the essay\'s overall argument, not one clever sentence.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP World DBQ scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the five documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which transoceanic connections transformed the global economy in the period 1450–1750." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least four of the five documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apush-columbus-letter.v1',
        'evelyn.passage.apworld-zheng-he-visual.v1',
        'evelyn.passage.apworld-potosi-silver-table.v1',
        'evelyn.passage.apworld-tokugawa-edict.v1',
        'evelyn.passage.apush-equiano.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that transoceanic connections transformed the global economy to a great extent between 1450 and 1750 by knitting the Americas, Europe, Africa, and Asia into a single silver-driven and forced-labor-dependent system — a transformation that generated immense new wealth for some participants while inflicting catastrophic human costs on others and provoking a range of active, not passive, responses from the non-European states drawn into it. Contextualization explains that this system rested on Iberian monarchies\' pursuit of a sea route bypassing Ottoman- and Venetian-controlled overland spice routes, on navigational technology (the compass, the lateen sail, the astrolabe) borrowed and adapted from Chinese, Arab, and Islamic sources that made sustained transoceanic voyaging possible, and on a mercantilist, competitive environment among European crowns after 1500 that rewarded continuous reinvestment in overseas ventures — the shared preconditions behind all five documents. The body groups at least four documents around the thesis: Columbus\'s 1493 letter describing Española as "a wonder" for its fertility and rivers "most of them bearing gold" (Doc 1) previews the material lure of precious metal that Spain\'s colonization project eventually realized at enormous scale, as the Potosí table shows Spanish America producing roughly 136,000 metric tons of silver from 1550 to 1800 — on the order of 80 percent of the world\'s documented output — with 30 to 40 percent of all American silver flowing onward to China via the Manila galleon route (Doc 3), evidence that the new economy was genuinely global rather than Atlantic-only. The Zheng He scale comparison (Doc 2) shows that Ming China initially possessed the far greater capacity for state-sponsored transoceanic voyaging — a fleet of 317 ships and up to 32,000 crew that dwarfed any contemporary caravel — yet the Ming court\'s withdrawal after Zheng He\'s death in 1433 left the field to smaller European powers willing to keep reinvesting, explaining why it was European crowns, not the Ming state, that built the ongoing network the other documents describe. That network\'s regulation was not one-directional: the Tokugawa shogunate\'s 1635 directives (Doc 4) narrowed, rather than eliminated, foreign trade, concentrating it into a small number of closely supervised ports and, by 1641, confining Dutch traders to Dejima — evidence that a major Afro-Eurasian state actively set its own terms for participating in the new economy. Outside evidence brings in the Dutch East India Company (VOC), chartered in 1602 as a joint-stock company that pooled private investor capital at a scale rivaling state treasuries — a financing innovation none of the five documents themselves describe, and one that further integrated the emerging global economy by mobilizing private European capital alongside royal treasuries. Sourcing explains that Columbus (Doc 1) wrote to Luis de Santángel, a Spanish royal treasury official, specifically to justify continued crown investment in further voyages, which explains his emphasis on the islands\' gold-bearing rivers and the islanders\' guileless generosity; that the Tokugawa edict (Doc 4) was an internal administrative directive from the shogunate to its own Nagasaki port officials, not a document addressed to any foreign audience, which explains why it states blunt enforcement mechanisms without any need to justify the policy to outsiders; and that Equiano (Doc 5), publishing in 1789 for an English-speaking, increasingly abolitionist-sympathetic audience decades after the childhood experience he recounts, foregrounds his own psychological terror — being "handled and tossed up to see if [he] were sound" and seeing "a multitude of black people of every description chained together" — in vivid, sequential detail meant to move readers toward the antislavery cause. Complexity is shown by weighing benefit against cost and by contrasting the range of non-European responses the documents reveal: the same transoceanic connections that built enormous wealth in the Chinese and Spanish monetary economies (Docs 2-3) also extracted, through Equiano\'s testimony (Doc 5), a catastrophic human toll from those forced into its labor system, while the states drawn into the network responded along a spectrum from Ming China\'s voluntary withdrawal (Doc 2) to Tokugawa Japan\'s active, managed narrowing of contact (Doc 4) — corroborated across four very different document types (a letter, a described visual, a described data table, a described administrative document, and a memoir) rather than treating "transformation" as a single uniform, European-driven verdict.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which transoceanic connections transformed the global economy, 1450-1750) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a single unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt, offers a list with no line of reasoning, or is not historically defensible.',
            modelResponse:
              'Transoceanic connections transformed the global economy to a great extent between 1450 and 1750 by knitting the Americas, Europe, Africa, and Asia into a single silver-driven and forced-labor-dependent system — one that generated immense new wealth while inflicting catastrophic human costs and provoking a range of active, not passive, responses from the non-European states and peoples drawn into it.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. Iberian monarchies\' pursuit of a sea route bypassing Ottoman/Venetian-controlled trade, borrowed navigational technology that made sustained voyaging possible, and mercantilist competition among European crowns that rewarded reinvestment. No credit (0/1) for a single vague, unsupported phrase or context copied from a document without independent elaboration.',
            modelResponse:
              'Iberian monarchies sought a sea route that would bypass Ottoman- and Venetian-controlled overland and Mediterranean spice routes; navigational technology borrowed and adapted from Chinese, Arab, and Islamic sources (the compass, the lateen sail, the astrolabe) made sustained transoceanic voyaging possible; and after 1500 a competitive, mercantilist environment among European crowns rewarded continuous reinvestment in overseas ventures rather than a single voyage.',
          },
          {
            criterionId: 'C-doc-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST FOUR OF THE FIVE documents, grouped to support the essay\'s line of reasoning (not summarized one at a time in isolation). 1/2: accurately describes the content of at least three documents, whether or not they clearly support an argument. 0/2: fewer than three documents used, or documents are misdescribed.',
            modelResponse:
              'Columbus\'s 1493 letter describing Española\'s rivers "most of them bearing gold" (Doc 1) previews the material lure that Spain\'s colonization eventually realized at scale, as the Potosí table shows roughly 136,000 metric tons of Spanish American silver produced 1550-1800, about 80 percent of world output, with 30-40 percent flowing onward to China (Doc 3). The Zheng He comparison (Doc 2) shows Ming China\'s far greater initial capacity for state-sponsored voyaging and its withdrawal after 1433, leaving the field to smaller, continuously reinvesting European powers. The Tokugawa edict (Doc 4) shows a major Afro-Eurasian state narrowing, rather than eliminating, its participation in the new economy on its own terms, confining Dutch trade to Dejima by 1641.',
          },
          {
            criterionId: 'D-outside-evidence',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the five documents, relevant to the argument, and EXPLAINS its relevance. No credit (0/1) for a vague reference with no specific evidence, or evidence simply named with no explanation.',
            modelResponse:
              'The Dutch East India Company (VOC), chartered in 1602 as a joint-stock company, pooled private investor capital at a scale rivaling royal treasuries — a financing innovation none of the five documents themselves describe, and one that further integrated the emerging global economy by mobilizing private European capital alongside state financing.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date.',
            modelResponse:
              'Columbus (Doc 1) wrote to Luis de Santángel, a Spanish royal treasury official, specifically to justify continued crown investment in further voyages, explaining his emphasis on gold-bearing rivers and the islanders\' generosity. The Tokugawa edict (Doc 4) was an internal administrative directive from the shogunate to its own Nagasaki port officials, not addressed to any foreign audience, explaining its blunt enforcement language. Equiano (Doc 5), publishing in 1789 for an English-speaking, abolitionist-sympathetic audience decades after the experience he recounts, foregrounds his own psychological terror in vivid detail meant to move readers toward the antislavery cause.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. explicitly weighing benefit against cost, corroborating multiple document types against each other, or explaining more than one variable (here, contrasting the wealth the new economy generated with its human costs, and contrasting the range of non-European state responses). No credit (0/1) if the essay treats "transformation" as a single flat, one-directional verdict.',
            modelResponse:
              'What complicates a simple "connections made the world richer" narrative is that the same silver-driven system that enriched the Spanish and Chinese monetary economies (Docs 2-3) also extracted, through Equiano\'s testimony (Doc 5), a catastrophic human toll from those forced into its labor system, while the states drawn into the network responded along a spectrum from Ming China\'s voluntary withdrawal (Doc 2) to Tokugawa Japan\'s active, managed narrowing of contact (Doc 4) — corroborated across a letter, a described visual, a described data table, a described administrative document, and a memoir, rather than a single uniform verdict.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3, 4, 5 in order.',
        'Document 4 (the Tokugawa edict) is a DESCRIBED document — describe what it did in your own words, and NEVER put quotation marks around any edict language.',
        'Documents 1 (Columbus) and 5 (Equiano) can be quoted directly, but only from what their excerpts actually say — don\'t invent details beyond the text.',
        'Your outside-evidence fact should come from your own knowledge of the period (e.g. the VOC), not be paraphrased from one of the five documents.',
      ],
      estimatedMinutes: 48,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The DBQ asks you to build YOUR OWN argument and use the documents (plus outside knowledge) as evidence — never summarize each document in its own paragraph.',
        'The 7-point rubric: Thesis (1); Contextualization (1); Evidence from the Documents (2, requires 4+ of 5 documents for full credit); Evidence Beyond the Documents (1, one explained outside fact); Sourcing (1, HIPP explained for 3+ documents); Complexity (1, earned holistically).',
        'Document 4 (the Tokugawa edict) is a described document — paraphrase only, never quote edict language.',
        'A strong complexity move for this packet: the SAME transoceanic connections that generated wealth for European and Chinese economies also extracted a catastrophic human toll, and non-European states responded along a spectrum from voluntary withdrawal (Ming China) to active management (Tokugawa Japan).',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4-DBQ',
    cedTitle: 'Unit 4 DBQ Practice — Transoceanic Connections and the Global Economy',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Contextualization 1 / Evidence-Documents 2 / Evidence-Beyond 1 / Sourcing 1 / Complexity 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-columbus-letter.v1',
        chapter: '1493',
        note: 'Christopher Columbus, letter to Luis de Santángel — Document 1 of the five-document Unit-4 packet (REUSE from APUSH).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-zheng-he-visual.v1',
        chapter: '1405-1433',
        note: "Zheng He's Treasure Fleet vs. an Iberian Caravel (described visual) — Document 2 of the packet.",
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-potosi-silver-table.v1',
        chapter: '1550-1800',
        note: 'Registered Silver Output, Potosí and Spanish America (described data table) — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-tokugawa-edict.v1',
        chapter: '1635',
        note: 'Closed Country Edict of 1635 (described document — paraphrased only, never quoted) — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-equiano.v1',
        chapter: '1789',
        note: 'Olaudah Equiano, "The Interesting Narrative of the Life of Olaudah Equiano" — Document 5 of the packet (REUSE from APUSH).',
      },
    ],
  },
};
