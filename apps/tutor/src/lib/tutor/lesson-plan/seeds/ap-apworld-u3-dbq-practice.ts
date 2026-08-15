/**
 * AP World History: Modern — Unit 3 DBQ Practice: the full Document-Based
 * Question essay (AP World FRQ 1), closing out the Unit-3 arc (empires
 * expand 3.1, empires: administration 3.2, empires: belief systems 3.3-3.4).
 *
 * Students write ONE complete DBQ essay under real AP exam conditions, using
 * a genuine five-document Unit-3 packet, and are scored against the
 * authentic AP World 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..5 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. Ogier Ghiselin de Busbecq, Turkish Letters — merit-based promotion at
 *      the Ottoman court of Suleiman the Magnificent (1555, Forster &
 *      Daniell 1881 PD trans.) — evelyn.passage.apworld-busbecq-suleiman.v1
 *   2. François Bernier, Travels in the Mogul Empire — the Mughal crown's
 *      claim to inherit its Omrahs'/Mansebdars' estates and to own "every
 *      acre of land in the kingdom" (1656-68, Constable 1891 PD trans.) —
 *      evelyn.passage.apworld-bernier-mughal.v1
 *   3. Jean Rousset de Missy, Life of Peter the Great — a contemporary
 *      biographer's narrative of Peter I's beard tax and compulsory
 *      French-fashion dress ordinance (c. 1730 narrative of c. 1701-05
 *      decrees, Robinson translation via the Fordham sourcebook) —
 *      evelyn.passage.apworld-peter-decrees.v1
 *   4. The Taj Mahal (1632-1653) — a DESCRIBED visual document: Shah
 *      Jahan's mausoleum complex, its Quranic paradise-garden symbolism and
 *      its scale/cost as imperial legitimacy in stone —
 *      evelyn.passage.apworld-taj-mahal.v1
 *   5. The Sacred Edict, Maxim I — Wang Yupu's later colloquial exposition
 *      of the Kangxi Emperor's 1670 maxim on filial "duteousness" (F. W.
 *      Baller 1892 PD trans.) — evelyn.passage.apworld-kangxi-edict.v1
 *
 * DOCUMENT-FIDELITY DISCIPLINE:
 * - Doc 1 (Busbecq) is a Habsburg ambassador's letter describing Ottoman
 *   court practice from an informed European OUTSIDER's perspective, not an
 *   Ottoman insider's account. Only the excerpt's own claims (birth confers
 *   no distinction; promotion turns on character/ability/disposition; the
 *   Sultan's highest officers are often "sons of shepherds or herdsmen") are
 *   attributed to it.
 * - Doc 2 (Bernier) is a French physician/traveler's 1656-68 letter to
 *   Colbert, minister to Louis XIV — a European audience assessing Mughal
 *   wealth and governance. Only the excerpt's claims (crown inheritance of
 *   Omrahs'/Mansebdars' estates; crown ownership of "every acre of land")
 *   are attributed to it; Akbar's earlier sulh-i-kul is NOT in this
 *   document and is used only as outside evidence.
 * - Doc 3 (Peter) is Jean Rousset de Missy's own contemporary NARRATIVE
 *   account, written as a biographer describing the tsar's actions in the
 *   third person, c. 1730 — roughly a generation after the c. 1701-05
 *   decrees it describes — NOT a transcription of Peter's own ukases (no
 *   raw text of those ukases survives at the cited source). Sourcing must
 *   credit Rousset de Missy, a European biographer narrating Peter's reign
 *   for a European readership, as the author — never Peter himself — and
 *   only the beard-tax/dress-ordinance content actually narrated is
 *   attributed to the document.
 * - Doc 4 (Taj Mahal) is a DESCRIBED visual — only its described design
 *   (charbagh paradise-garden layout, Quranic calligraphy, four minarets)
 *   and documented facts (workforce, timeline, cost) are attributed to it,
 *   as Shah Jahan's own commissioned statement, not a neutral photograph.
 * - Doc 5 (Kangxi edict) is NOT the Kangxi Emperor's own 1670 wording — the
 *   quoted text is Wang Yupu's later colloquial "Direct Explanation"
 *   exposition of that maxim, in F. W. Baller's 1892 translation, composed
 *   to be read aloud to ordinary subjects. Sourcing must never claim the
 *   quoted wording is Kangxi's own 1670 text; it is a later vernacular
 *   elaboration of his maxim's substance, disseminated under later Qing
 *   reigns as the same Sacred Edict system's teaching material.
 * - Nothing beyond each document's actual seeded content (e.g. the
 *   Süleymaniye Mosque, Akbar's sulh-i-kul, or the Ottoman millet system —
 *   none of which appear in any of the five documents) is attributed to
 *   that document — such claims are framed explicitly as outside evidence.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U3_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u3-dbq-practice.v1',
  title: 'Unit 3 DBQ Practice — Land-Based Empires',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u3-dbq-practice',
      description:
        'Write a complete AP World History Document-Based Question essay from a five-document Unit-3 packet on how land-based empires used similar methods to consolidate and legitimize power in the period 1450-1750 — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP World 7-point DBQ rubric.',
      standard: 'AP-APWORLD-3-DBQ',
    },
  ],
  prerequisites: [
    'apworld.empires-expansion',
    'apworld.empires-administration',
    'apworld.empires-belief-systems',
  ],
  followUps: [],
  estimatedMinutes: 55,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "You've now toured this unit's whole cast of land-based empires — a Habsburg ambassador marveling at merit-based promotion in Suleiman's Ottoman court, a French traveler cataloging the Mughal crown's claim to every acre of its own nobles' land, a biographer's account of Peter the Great taxing beards and ordering French fashion onto Russia's nobility, a mausoleum built to turn private grief into an empire-wide advertisement of Mughal power, and a moral maxim about filial duty meant to be read aloud to ordinary Qing subjects. All of it exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP World History exam, scored on the authentic 7-point rubric: Thesis (1), Contextualization (1), Evidence from the Documents (2), Evidence Beyond the Documents (1), Sourcing (1), and Complexity (1). You'll get five documents spanning three continents and three centuries of rule. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument about how these very different empires consolidated and legitimized power, and use the documents, plus what you already know, as evidence for it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the five-document Unit-3 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get five documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph ("Document 1 says X. Document 2 says Y.") instead of grouping documents around a claim.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt. A strong thesis for this packet might argue that land-based empires relied on comparably structured methods to consolidate and legitimize power — reshaping or controlling an administrative/military elite\'s loyalty, and projecting legitimacy downward to subjects through religious or moral tradition — even though the SPECIFIC tool each empire used differed, and Russia\'s Petrine reforms stand out for imposing an explicitly foreign cultural model on an existing elite rather than working through native religious or hereditary tradition.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing how, after 1450, the Ottoman consolidation following 1453, the Safavid founding of 1501, the Mughal founding of 1526, the Qing conquest of 1644, and Russia\'s Romanov-era centralization after 1613 each left a ruling dynasty governing a large, diverse population across vast territory, requiring durable methods to bind elites to the center and project legitimacy to subjects — in AT LEAST a full sentence of specific description, not a single vague phrase like "there were a lot of empires back then."',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0–2 points): 1 point for accurately describing the content of at least two documents; the full 2 points require using the content of AT LEAST FOUR of the five documents to SUPPORT the thesis\'s argument (the established DBQ Row-C convention for a five-document packet) — e.g. grouping Busbecq\'s account of merit-based Ottoman promotion (Doc 1) and Bernier\'s account of the Mughal crown\'s claim to its nobles\' land (Doc 2) as two different methods of controlling an administrative elite\'s dependence on the center, alongside Peter\'s beard tax and dress ordinance (Doc 3) as a third, more coercive method of compelling an EXISTING elite\'s conformity; while the Taj Mahal (Doc 4) and the Sacred Edict maxim (Doc 5) instead show rulers projecting legitimacy downward to ordinary subjects through religious/moral tradition rather than managing elites at all.',
        'ROW D — EVIDENCE BEYOND THE DOCUMENTS (0–1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the five documents, relevant to the argument and explained (not just named) — e.g. Akbar\'s sulh-i-kul (abolishing the jizya tax and appointing Hindus to the highest Mughal administrative ranks), a further method of legitimizing Mughal rule that neither Bernier\'s account of Aurangzeb-era land ownership nor the Taj Mahal describes.',
        'ROW E — SOURCING (0–1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. Busbecq (Doc 1) was a Habsburg ambassador at Suleiman\'s court, an informed European OUTSIDER writing home, which explains why his account carries particular weight as external confirmation of an internal Ottoman practice he had reason to find unusual by his own society\'s standards; Rousset de Missy (Doc 3) was a European biographer narrating Peter\'s reign roughly a generation after the events themselves, for a European readership curious about Peter\'s reforms — not Peter\'s own decree text — which explains its polished, admiring narrative voice rather than a bureaucratic legal register; and the Sacred Edict maxim (Doc 5) is not the Kangxi Emperor\'s own 1670 wording but Wang Yupu\'s later colloquial exposition of it, composed specifically to be read aloud to ordinary, often illiterate subjects, which explains its vivid, emotionally accessible imagery of parental sacrifice rather than formal court language.',
        'ROW F — COMPLEXITY (0–1 point): earned holistically for a nuanced argument that does things like explain that "similar methods" is genuinely qualified — four of the five documents (Busbecq, Bernier, the Taj Mahal, the Sacred Edict) anchor legitimacy in each empire\'s OWN religious, administrative, or cultural tradition, while Peter\'s decrees (Doc 3) instead impose an explicitly foreign, Western European model onto an existing native elite by fiat — corroborate multiple document types (an ambassador\'s letter, a traveler\'s letter, a biographer\'s narrative, a described monument, a translated moral maxim) against each other, or explain multiple variables — earned through the essay\'s overall argument, not from one clever sentence in isolation.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP World DBQ scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the five documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which land-based empires in the period 1450 to 1750 used similar methods to consolidate and legitimize power." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least four of the five documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apworld-busbecq-suleiman.v1',
        'evelyn.passage.apworld-bernier-mughal.v1',
        'evelyn.passage.apworld-peter-decrees.v1',
        'evelyn.passage.apworld-taj-mahal.v1',
        'evelyn.passage.apworld-kangxi-edict.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that land-based empires relied on comparably structured methods to consolidate and legitimize power — reshaping or controlling the loyalty of an administrative/military elite, and projecting legitimacy downward to subjects through religious or moral tradition — even though the SPECIFIC tool each empire used differed, and Russia\'s Petrine reforms stand out for imposing an explicitly foreign cultural model on an existing elite rather than working through native tradition, or a comparably defensible complex claim with a clear line of reasoning. Contextualization explains that after 1450, the Ottoman consolidation following the 1453 conquest of Constantinople, the Safavid founding of 1501, the Mughal founding of 1526, the Qing conquest of 1644, and Russia\'s Romanov-era centralization after 1613 each left a ruling dynasty governing a large, diverse population across vast territory, requiring durable methods both to bind administrative elites to the center and to project legitimacy to elites and subjects alike. The body groups at least four of the five documents around the thesis: Busbecq\'s account that among the Ottomans "no distinction is attached to birth" and that the Sultan\'s highest officers are often "the sons of shepherds or herdsmen" (Doc 1), and Bernier\'s account that the Mughal emperor "constitutes himself heir of all the Omrahs... and likewise of the Mansebdars" and "is proprietor of every acre of land in the kingdom" (Doc 2), together show two different methods — recruiting a wholly new elite from outside versus legally denying an existing elite durable inheritance — of preventing an administrative elite from becoming an independent hereditary threat to the center; Rousset de Missy\'s narrative that Peter "ordered that gentlemen, merchants, and other subjects... should each pay a tax of one hundred rubles a year if they wished to keep their beards" and commanded "all the boyars... to dress after the French fashion" (Doc 3) shows a third, more coercive method — compelling an EXISTING elite\'s outward conformity to an imported model rather than reshaping who belongs to that elite at all. The Taj Mahal\'s charbagh paradise-garden design and its cost of "near 32 million rupees" (Doc 4), and the Sacred Edict\'s vivid description of how parents "waited till you were well before their minds were at ease" to ground a child\'s lifelong debt of duteousness (Doc 5), instead show rulers projecting legitimacy downward to ordinary subjects through religious and moral tradition rather than managing an elite at all. Outside evidence brings in Akbar\'s sulh-i-kul — abolishing the jizya tax on non-Muslims and appointing Hindus to the highest ranks of Mughal administration — a further method of legitimizing Mughal rule that neither Bernier\'s account of Aurangzeb-era land ownership nor the Taj Mahal itself describes. Sourcing explains that Busbecq (Doc 1) was a Habsburg ambassador at Suleiman\'s court, an informed European outsider writing home, which explains why his account carries particular weight as external confirmation of an Ottoman practice he had reason to find unusual by his own society\'s hereditary norms; that Rousset de Missy (Doc 3) was a European biographer narrating Peter\'s reign roughly a generation after the events themselves for a European readership — not Peter\'s own decree text — which explains its polished, admiring narrative voice; and that the Sacred Edict maxim (Doc 5) is not the Kangxi Emperor\'s own 1670 wording but Wang Yupu\'s later colloquial exposition of it, composed to be read aloud to ordinary, often illiterate subjects, which explains its vivid, emotionally accessible imagery rather than formal court language. Complexity is shown by explicitly qualifying "similar methods" — noting that four of the five documents anchor legitimacy in each empire\'s OWN religious, administrative, or cultural tradition, while Peter\'s decrees instead impose an explicitly foreign, Western European model onto an existing native elite by fiat, a genuinely different and more coercive route to the same underlying goal — and by corroborating very different document types (an ambassador\'s letter, a traveler\'s letter, a biographer\'s narrative, a described monument, a translated moral maxim) against one another rather than treating "similar methods" as a uniform, unqualified pattern.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which land-based empires used similar methods to consolidate and legitimize power, 1450-1750) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a single unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt, offers a list with no line of reasoning, or is not historically defensible.',
            modelResponse:
              'Land-based empires relied on comparably structured methods to consolidate and legitimize power — reshaping or controlling an administrative elite\'s loyalty, and projecting legitimacy downward to subjects through religious or moral tradition — even though the specific tool each empire used differed, and Russia\'s Petrine reforms stand out for imposing an explicitly foreign cultural model on an existing elite rather than working through native tradition.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. the Ottoman consolidation after 1453, the Safavid founding of 1501, the Mughal founding of 1526, the Qing conquest of 1644, and Russia\'s Romanov-era centralization after 1613. No credit (0/1) for a single vague, unsupported phrase or context copied from a document without independent elaboration.',
            modelResponse:
              'After 1450, the Ottoman consolidation following the 1453 conquest of Constantinople, the Safavid founding of 1501, the Mughal founding of 1526, the Qing conquest of 1644, and Russia\'s Romanov-era centralization after 1613 each left a ruling dynasty governing a large, diverse population across vast territory, requiring durable methods both to bind administrative elites to the center and to project legitimacy to elites and subjects alike.',
          },
          {
            criterionId: 'C-doc-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST FOUR of the five documents, grouped to support the essay\'s line of reasoning (not summarized one at a time in isolation). 1/2: accurately describes the content of at least two documents, whether or not they clearly support an argument. 0/2: fewer than two documents used, or documents are misdescribed.',
            modelResponse:
              'Busbecq\'s account that among the Ottomans "no distinction is attached to birth" and the Sultan\'s highest officers are often "the sons of shepherds or herdsmen" (Doc 1), and Bernier\'s account that the Mughal emperor "constitutes himself heir of all the Omrahs... and likewise of the Mansebdars" and owns "every acre of land in the kingdom" (Doc 2), show two different methods of preventing an elite from becoming an independent hereditary threat. Rousset de Missy\'s narrative of Peter taxing beards and commanding boyars "to dress after the French fashion" (Doc 3) shows a third, more coercive method of compelling an existing elite\'s conformity. The Taj Mahal\'s paradise-garden design and 32-million-rupee cost (Doc 4), and the Sacred Edict\'s description of parental sacrifice grounding a child\'s debt of duteousness (Doc 5), instead show rulers legitimizing power to ordinary subjects through religious and moral tradition.',
          },
          {
            criterionId: 'D-outside-evidence',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the five documents, relevant to the argument, and EXPLAINS its relevance (not just names it). No credit (0/1) for a vague reference with no specific evidence, or evidence that is simply named with no explanation of how it supports the thesis.',
            modelResponse:
              'Akbar\'s sulh-i-kul — abolishing the jizya tax on non-Muslims and appointing Hindus to the highest ranks of Mughal administration — is a further method of legitimizing Mughal rule that neither Bernier\'s account of Aurangzeb-era land ownership nor the Taj Mahal itself describes, showing the range of legitimation strategies extended even further than the packet\'s own examples.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date without explaining relevance to the argument.',
            modelResponse:
              'Busbecq (Doc 1) was a Habsburg ambassador at Suleiman\'s court, an informed European outsider writing home, which explains why his account carries particular weight as external confirmation of an Ottoman practice he had reason to find unusual by his own society\'s hereditary norms. Rousset de Missy (Doc 3) was a European biographer narrating Peter\'s reign roughly a generation after the events themselves for a European readership — not Peter\'s own decree text — which explains its polished, admiring narrative voice rather than a bureaucratic legal register. The Sacred Edict maxim (Doc 5) is not the Kangxi Emperor\'s own 1670 wording but Wang Yupu\'s later colloquial exposition of it, composed to be read aloud to ordinary, often illiterate subjects, which explains its vivid, emotionally accessible imagery rather than formal court language.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. explicitly qualifying "similar methods" across the packet, corroborating multiple document types against each other, or explaining more than one variable (here, contrasting legitimacy anchored in native tradition in four documents with Peter\'s imposition of a foreign model in the fifth) — not from a single isolated clever sentence. No credit (0/1) if the essay treats "similar methods" as a single flat pattern with no qualification or comparison.',
            modelResponse:
              'What complicates a simple "empires everywhere legitimized power the same way" narrative is that four of the five documents — Busbecq, Bernier, the Taj Mahal, and the Sacred Edict — anchor legitimacy in each empire\'s OWN religious, administrative, or cultural tradition, while Peter\'s decrees (Doc 3) instead impose an explicitly foreign, Western European model onto an existing native elite by fiat — a genuinely different and more coercive route to the same underlying goal — corroborated across five very different document types: an ambassador\'s letter, a traveler\'s letter, a biographer\'s narrative, a described monument, and a translated moral maxim.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3 in order.',
        'For sourcing, ask: why did THIS author write THIS document for THIS audience, and how does that explain what it argues?',
        'Only quote what a document actually says — Document 3 (Peter) is Rousset de Missy\'s own narrative account, not Peter\'s original decree text, so source it to the biographer, not to Peter himself.',
        'Document 5 (the Sacred Edict) is Wang Yupu\'s later colloquial exposition of Kangxi\'s maxim, not Kangxi\'s own 1670 wording — say so explicitly in your sourcing rather than attributing the quoted phrasing directly to the emperor.',
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
        'Only attribute to a document what it actually says — Document 3 (Peter) is Rousset de Missy\'s biographer narrative, not Peter\'s own decree text; Document 5 (the Sacred Edict) is Wang Yupu\'s later colloquial exposition, not Kangxi\'s own 1670 wording.',
        'Four of the five documents (Busbecq, Bernier, the Taj Mahal, the Sacred Edict) legitimize power through each empire\'s OWN tradition; Peter\'s decrees instead impose a foreign model on an existing elite — a strong complexity move.',
        'Documents 4 (the Taj Mahal) and 5 (the Sacred Edict) legitimize power to SUBJECTS through religious/moral tradition; Documents 1-3 (Busbecq, Bernier, Peter) instead manage the loyalty of an administrative ELITE — two distinct methods worth grouping separately.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3-DBQ',
    cedTitle: 'Unit 3 DBQ Practice — Land-Based Empires',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Contextualization 1 / Evidence-Documents 2 / Evidence-Beyond 1 / Sourcing 1 / Complexity 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-busbecq-suleiman.v1',
        chapter: '1555',
        note: 'Ogier Ghiselin de Busbecq, Turkish Letters — Document 1 of the five-document Unit-3 packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-bernier-mughal.v1',
        chapter: '1668',
        note: "François Bernier, Travels in the Mogul Empire — Document 2 of the packet.",
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-peter-decrees.v1',
        chapter: 'c. 1730',
        note: "Jean Rousset de Missy, Life of Peter the Great — Document 3 of the packet.",
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-taj-mahal.v1',
        chapter: '1632-1653',
        note: 'The Taj Mahal (described visual) — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-kangxi-edict.v1',
        chapter: '1670',
        note: 'The Sacred Edict, Maxim I — Document 5 of the packet.',
      },
    ],
  },
};
