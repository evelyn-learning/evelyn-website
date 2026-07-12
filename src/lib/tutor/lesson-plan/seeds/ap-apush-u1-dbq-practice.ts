/**
 * AP US History — Period 1 DBQ Practice: the full Document-Based Question
 * essay (AP APUSH Free-Response Question 1), a five-document packet.
 *
 * This is the essay-practice plan that closes out the Period-1 content arc
 * (native societies 1.2-1.3, the Columbian Exchange 1.4-1.5, Spanish
 * colonization 1.6-1.7): students write ONE complete DBQ essay under real
 * AP exam conditions, using a genuine 5-document packet, and are scored
 * against the authentic AP APUSH 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..5 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. Christopher Columbus, letter to Luis de Santángel (1493) —
 *      evelyn.passage.apush-columbus-letter.v1
 *   2. Bartolomé de las Casas, "A Brief Account of the Destruction of the
 *      Indies" (1542) — evelyn.passage.apush-las-casas.v1
 *   3. Hernán Cortés, Second Letter to Charles V, on Tenochtitlan (1520) —
 *      evelyn.passage.apush-cortes-tenochtitlan.v1
 *   4. Codex Mendoza, tribute section (c. 1541) —
 *      evelyn.passage.apush-codex-mendoza.v1
 *   5. Richard Hakluyt, "A Discourse Concerning Western Planting" (1584) —
 *      evelyn.passage.apush-hakluyt-western-planting.v1
 *
 * DOCUMENT FIDELITY NOTE: Document 5 (Hakluyt) verbatim-anchors ONLY the
 * employment-of-idle-men motive (Spain/Portugal's discoveries absorbed their
 * "idle" and "loyterers" population and reduced piracy; England still
 * suffers "multitudes of loyterers and idle vagabondes" despite harsh
 * statutes). Hakluyt's other historically real motives (commodities,
 * countering Spain, spreading religion) are NOT in this excerpt and are
 * used below only as the student's own outside evidence, never attributed
 * to Document 5. Document 1 (Columbus) reads "guileless, and so liberal,"
 * not "artless and generous." Document 4 (Codex Mendoza) is a described
 * visual — its sourcing point (commissioned by Viceroy Antonio de Mendoza
 * c. 1541 as a gift for Charles V) is itself part of the seeded description.
 *
 * The teaching point is the DBQ TASK itself — thesis, contextualization,
 * document evidence, outside evidence, sourcing (HIPP), and complexity —
 * not new historical content; all quotes are the short, already-seeded
 * excerpts used elsewhere in the Period-1 catalog.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U1_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u1-dbq-practice.v1',
  title: 'Period 1 DBQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u1-dbq-practice',
      description:
        'Write a complete AP APUSH Document-Based Question essay from a five-document Period-1 packet — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP APUSH 7-point DBQ rubric.',
      standard: 'AP-APUSH-1-DBQ',
    },
  ],
  prerequisites: [
    'apush.native-societies',
    'apush.columbian-exchange',
    'apush.spanish-colonization',
  ],
  followUps: [],
  estimatedMinutes: 58,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "Everything you've learned about Period 1 — the diversity of Native societies before contact, the bidirectional Columbian Exchange, and the Spanish colonial labor systems that followed conquest — exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP US History exam, scored on the authentic 7-point rubric: Thesis (1), Contextualization (1), Evidence from the Documents (2), Evidence Beyond the Documents (1), Sourcing (1), and Complexity (1). You'll get five documents spanning 1493 to 1584. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument and use the documents, plus what you already know, as evidence for it. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the five-document Period-1 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get five documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph ("Document 1 says X. Document 2 says Y.") instead of grouping documents around a claim.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not a simple list of "there was conquest and disease." A strong thesis for this packet might argue that European contact transformed the Americas to a profound and largely destructive extent — dismantling existing indigenous polities and imposing coercive labor systems — while acknowledging that the different European powers pursued contact for different reasons and by different methods.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing how Columbus\'s 1492 voyage opened sustained contact between two hemispheres that had been biologically and culturally separate for millennia, setting off a race among European powers (Spain first, others soon after) to explore, exploit, and settle the Americas — in AT LEAST a full sentence of specific description, not a single vague phrase like "Europeans started arriving."',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0–2 points): 1 point for accurately describing the content of at least two documents; the full 2 points require using the content of AT LEAST FOUR of the five documents to SUPPORT the thesis\'s argument (the authentic full-credit threshold for a five-document packet) — e.g. grouping Columbus\'s letter (Doc 1) as evidence of how the earliest European framing presented the land and people as ripe for the taking; Cortés\'s description of Tenochtitlan (Doc 3) and the Codex Mendoza\'s tribute lists (Doc 4) as evidence of the sophisticated, populous, highly organized indigenous civilization that Spanish conquest dismantled; and Las Casas\'s account of the encomienda (Doc 2) as evidence of the coercive labor system Spain imposed on the survivors of that conquest.',
        'ROW D — EVIDENCE BEYOND THE DOCUMENTS (0–1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the five documents, relevant to the argument and explained (not just named) — e.g. the demographic catastrophe caused by Old World diseases like smallpox, which historians estimate killed as many as roughly 90% of the population in some of the hardest-hit regions within the first century of contact — a transformation none of the five documents describe at all.',
        'ROW E — SOURCING (0–1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. Columbus\'s letter (Doc 1) was addressed to Luis de Santángel, a royal treasury official who had helped finance the voyage, and was printed and circulated across Europe almost immediately, which explains why it emphasizes the land\'s exploitable abundance and the people\'s unresisting generosity — a public case for further investment, not a private record; Las Casas (Doc 2) was a Dominican friar and former encomendero writing specifically to bring Spanish abuses to the attention of the Crown, which explains why he names Spanish "Avarice and Ambition," not faith or service to the king, as the true motive; the Codex Mendoza (Doc 4) was commissioned around 1541 by Antonio de Mendoza, Spain\'s first viceroy of New Spain, as a gift explaining Aztec government to Charles V, which explains why it catalogs tribute in careful administrative detail — a colonial official\'s interest in the wealth and organization he now controlled.',
        'ROW F — COMPLEXITY (0–1 point): earned holistically for a nuanced argument that does things like explain both continuity AND change, corroborate multiple document types (a promotional letter, an advocacy account, a conquistador\'s report, a tribute record, a colonization memorandum) against each other, or explain multiple variables (e.g. that Spanish and English contact with the Americas were driven by different motives and took different forms) — earned through the essay\'s overall argument, not from one clever sentence in isolation.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP APUSH DBQ scale, distinct from the AP Lang 6-point rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the five documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which European contact transformed the Americas in the period 1491–1607." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least four of the five documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apush-columbus-letter.v1',
        'evelyn.passage.apush-las-casas.v1',
        'evelyn.passage.apush-cortes-tenochtitlan.v1',
        'evelyn.passage.apush-codex-mendoza.v1',
        'evelyn.passage.apush-hakluyt-western-planting.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that European contact transformed the Americas to a profound and largely destructive extent — dismantling existing indigenous polities and imposing coercive labor systems on their survivors — even as the specific form contact took varied by which European power was involved, or a comparably defensible complex claim with a clear line of reasoning. Contextualization situates the packet in the aftermath of Columbus\'s 1492 voyage, which opened sustained contact between two hemispheres previously separated for millennia and set off a competition among European powers — Spain first, England following decades later — to explore, exploit, and settle the Americas. The body groups at least four documents around the thesis rather than summarizing them in order: Columbus\'s letter describing Española as abundant and its people as "guileless, and so liberal of all they have" (Doc 1) shows how the earliest published European account framed both the land and the people as available for the taking; Cortés\'s description of Tenochtitlan\'s causeways and its great market of "more than sixty thousand souls" trading daily (Doc 3), together with the Codex Mendoza\'s careful record of the tribute — cotton mantles, feathers, cacao, maize — that roughly three dozen provinces owed the Aztec state (Doc 4), show a large, wealthy, highly organized indigenous civilization; and Las Casas\'s account of Native people divided among Spanish masters in fixed numbers and sent to forced labor in the mines and fields (Doc 2) shows the coercive encomienda system Spain imposed once that civilization had been conquered. Outside evidence brings in the demographic catastrophe caused by Old World diseases such as smallpox, to which Native populations had no prior immunity — losses that historians estimate reached as high as roughly 90% in some of the hardest-hit regions within the first century of contact — a transformation none of the five documents describe, since disease left no trace in a promotional letter, a conquistador\'s report, a tribute record, or a colonization memorandum. A strong response can add further outside knowledge that Hakluyt\'s own broader case for English colonization, beyond the excerpt in Document 5, also invoked spreading Protestant Christianity and countering Catholic Spain\'s power in the Americas — outside evidence, since the seeded excerpt itself anchors only the idle-men employment argument. Sourcing explains that Columbus\'s letter (Doc 1) was addressed to Luis de Santángel, the royal treasury official who had helped finance the voyage, and was printed and circulated across Europe almost immediately, which explains why it presents the land and people as ready to be acquired — a public case for further investment, not a private account; that Las Casas (Doc 2), a Dominican friar and former encomendero, wrote specifically to bring Spanish colonial abuses to the attention of the Crown, which explains why he names Spanish "Avarice and Ambition" as the true motive rather than faith or service to the king; and that the Codex Mendoza (Doc 4) was commissioned around 1541 by Antonio de Mendoza, Spain\'s first viceroy of New Spain, as a gift intended to explain Aztec government to Charles V, which explains its careful administrative cataloging of tribute — a colonial official\'s documentation of the wealth and organization he now controlled, filtered through Aztec pictorial conventions. Complexity is shown by contrasting Spanish and English approaches to contact: Spain\'s approach (Docs 1-4) moved from an initial framing of the land and people as available, through conquest of an organized indigenous state, to a coercive labor system extracting that state\'s wealth and labor, while Hakluyt\'s 1584 memorandum (Doc 5) shows England, arriving decades later, framing colonization not around conquering an existing empire but around solving England\'s own domestic problem of "idle vagabondes" who could be employed abroad — evidence that "European contact" was not one uniform process but several, driven by different motives and taking different institutional forms.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which European contact transformed the Americas, 1491-1607) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a list with no line of reasoning ("there was conquest and disease"). No credit (0/1) for a thesis that only restates the prompt, offers an unsupported list, or is not historically defensible.',
            modelResponse:
              'European contact transformed the Americas to a profound and largely destructive extent — dismantling existing indigenous polities and imposing coercive labor systems on their survivors — even though the specific form that transformation took varied by which European power was involved.',
          },
          {
            criterionId: 'B-contextualization',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. Columbus\'s 1492 voyage opening sustained contact between two long-separated hemispheres and setting off a competition among European powers to explore and colonize the Americas. No credit (0/1) for a single vague, unsupported phrase ("Europeans started arriving") or context copied from a document without independent elaboration.',
            modelResponse:
              'Columbus\'s 1492 voyage opened sustained contact between two hemispheres that had developed separately for millennia, and within decades Spain\'s early voyages and conquests had drawn other European powers, including England, into their own competing efforts to explore, exploit, and settle the Americas.',
          },
          {
            criterionId: 'C-evidence-documents',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST FOUR of the five documents, grouped to support the essay\'s line of reasoning (not summarized one at a time in isolation) — the authentic full-credit threshold for a five-document packet. 1/2: accurately describes the content of at least two documents, whether or not they clearly support an argument. 0/2: fewer than two documents used, or documents are misdescribed.',
            modelResponse:
              'Columbus\'s description of Española\'s abundance and its people as "guileless, and so liberal of all they have" (Doc 1) frames the earliest European encounter as an opportunity ripe for exploitation. Cortés\'s account of Tenochtitlan\'s causeways and its market of "more than sixty thousand souls" (Doc 3), together with the Codex Mendoza\'s record of the cotton, feathers, cacao, and maize that dozens of provinces owed the Aztec state (Doc 4), together show a large, wealthy, and highly organized indigenous civilization. Las Casas\'s account of Native people divided among Spanish masters and sent to forced labor in the mines and fields (Doc 2) then shows the coercive system Spain imposed on that civilization\'s survivors after conquest.',
          },
          {
            criterionId: 'D-evidence-beyond',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the five documents, relevant to the argument, and EXPLAINS its relevance (not just names it). No credit (0/1) for a vague reference with no specific evidence, or evidence that is simply named with no explanation of how it supports the thesis.',
            modelResponse:
              'The demographic catastrophe caused by Old World diseases such as smallpox, to which Native populations had no prior immunity, killed an estimated 90% of the population in some of the hardest-hit regions within the first century of contact — a transformation none of the five documents describe, since disease left no trace in a promotional letter, an advocacy account, a conquistador\'s report, a tribute record, or a colonization memorandum, yet it was arguably the single most consequential effect of contact on the Americas.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date without explaining relevance to the argument.',
            modelResponse:
              'Columbus\'s letter (Doc 1) was addressed to Luis de Santángel, the royal treasury official who had helped finance the voyage, and was printed and circulated across Europe almost immediately, which explains why it presents both the land and the people as available for the taking — a public case for further investment. Las Casas (Doc 2), a Dominican friar and former encomendero, wrote specifically to bring Spanish colonial abuses to the attention of the Crown, which explains why he rejects Spain\'s official justifications and instead names "Avarice and Ambition" as the true motive. The Codex Mendoza (Doc 4) was commissioned around 1541 by Antonio de Mendoza, Spain\'s first viceroy, as a gift meant to explain Aztec government to Charles V, which explains its careful administrative cataloging of tribute — a colonial official\'s record of the wealth and organization he now controlled.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. explicitly weighing continuity against change, corroborating multiple document types against each other, or explaining more than one variable (here, contrasting Spanish and English motives and methods for contact) — not from a single isolated clever sentence. No credit (0/1) if the essay treats "transformation" as a single flat verdict with no qualification or comparison.',
            modelResponse:
              'What complicates a simple "contact destroyed the Americas" narrative is that European contact was not one uniform process: Spain\'s approach (Docs 1-4) moved from an initial framing of the land and people as available, through the conquest of an organized indigenous state, to a coercive labor system extracting that state\'s wealth, while Hakluyt\'s 1584 memorandum (Doc 5) shows England, arriving decades later, justifying colonization not around conquering an existing empire but around solving England\'s own domestic problem of "idle vagabondes" who could be employed abroad — revealing that different European powers pursued contact for different reasons and by different institutional means, even as the consequences for Native peoples were transformative across every case.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3, then 4, then 5 in order.',
        'For sourcing, ask: why did THIS author write THIS document for THIS audience, and how does that explain what it argues?',
        'Your outside-evidence fact should come from your own knowledge of the period (e.g. the disease-driven demographic catastrophe), not be paraphrased from one of the five documents.',
        'Document 5 (Hakluyt) only verbatim-supports the idle-men employment motive — if you want to argue England also colonized for religion or to counter Spain, that\'s your own outside evidence, not this document\'s content.',
        'A strong complexity move is contrasting Spanish and English motives and methods for contact.',
      ],
      estimatedMinutes: 48,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The DBQ asks you to build YOUR OWN argument and use the documents (plus outside knowledge) as evidence — never summarize each document in its own paragraph.',
        'The 7-point rubric: Thesis (1); Contextualization (1); Evidence from the Documents (2, requires 4+ of 5 documents for full credit); Evidence Beyond the Documents (1, one explained outside fact); Sourcing (1, HIPP explained for 3+ documents); Complexity (1, earned holistically).',
        'Sourcing means explaining WHY a document\'s author/purpose/audience/situation matters to your argument — not just naming the author or date.',
        'Document 5 (Hakluyt) only verbatim-anchors the idle-men employment motive — other English motives (religion, countering Spain) are outside evidence, not this document\'s content.',
        'A strong complexity move for this packet: Spanish contact (conquest, then coercive labor) versus English contact (employing England\'s own idle population) were different processes with different motives.',
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
    cedTitle: 'Period 1 DBQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Contextualization 1 / Evidence-Documents 2 / Evidence-Beyond 1 / Sourcing 1 / Complexity 1), adapted to a five-document packet (4+ documents for full Row C credit).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-columbus-letter.v1',
        chapter: '1493',
        note: 'Christopher Columbus, letter to Luis de Santángel — Document 1 of the five-document Period-1 packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-las-casas.v1',
        chapter: '1542',
        note: 'Bartolomé de las Casas, A Brief Account of the Destruction of the Indies — Document 2 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-cortes-tenochtitlan.v1',
        chapter: '1520',
        note: 'Hernán Cortés, Second Letter to Charles V, on Tenochtitlan — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-codex-mendoza.v1',
        chapter: '1541',
        note: 'Codex Mendoza, tribute section — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-hakluyt-western-planting.v1',
        chapter: '1584',
        note: 'Richard Hakluyt, A Discourse Concerning Western Planting — Document 5 of the packet.',
      },
    ],
  },
};
