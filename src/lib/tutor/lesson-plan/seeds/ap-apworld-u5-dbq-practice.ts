/**
 * AP World History: Modern — Unit 5 DBQ Practice: the full Document-Based
 * Question essay (AP World FRQ 1), closing out the Unit-5 content arc
 * (the Enlightenment 5.1, the Atlantic Revolutions 5.2, nationalism and
 * unification 5.2, the Industrial Revolution 5.3-5.6, and industrial
 * society 5.7-5.11).
 *
 * Students write ONE complete DBQ essay under real AP exam conditions, using
 * a genuine five-document Unit-5 packet, and are scored against the
 * authentic AP World 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..5 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. Declaration of the Rights of Man and of the Citizen (1789, Avalon
 *      trans.) — evelyn.passage.apworld-rights-of-man.v1
 *   2. Simón Bolívar, the Jamaica Letter (1815, Sherwell's 1921 English
 *      rendering) — evelyn.passage.apworld-bolivar-jamaica.v1
 *   3. Marx & Engels, The Communist Manifesto (1848, Moore's 1888 trans.) —
 *      evelyn.passage.apworld-communist-manifesto.v1
 *   4. Mary Wollstonecraft, A Vindication of the Rights of Woman (1792) —
 *      evelyn.passage.apworld-wollstonecraft.v1
 *   5. Testimony of Matthew Crabtree before the Sadler Committee (1832) —
 *      evelyn.passage.apworld-sadler-testimony.v1
 *
 * GOTCHAS GUARDED AGAINST:
 * - Every reference to document content below is checked against each
 *   document's ACTUAL seeded fullText. Nothing beyond that excerpt is
 *   attributed to the document — broader claims are framed explicitly as
 *   outside evidence, never inside quotation marks.
 * - Document 1 (Rights of Man) is quoted only from its seeded Articles 1, 2,
 *   3, and 6 — no other article language is invented.
 * - Document 2 (Bolívar) is Guillermo Sherwell's 1921 ENGLISH rendering of
 *   Bolívar's 1815 Spanish original, not a modern scholarly translation —
 *   the sourcing analysis explicitly attributes the wording to that 1921
 *   rendering rather than treating it as Bolívar's unmediated voice. The
 *   excerpt is about exclusion from colonial office (viceroys, bishops,
 *   ambassadors, magistrates, financiers) and the sudden, unprepared
 *   assumption of self-government — it never mentions natural rights,
 *   liberty, or equality language, so no such language is put in Bolívar's
 *   mouth.
 * - Document 3 (the Manifesto) is quoted only from its seeded Section-I
 *   passage (bourgeoisie creating the proletariat as a wage-dependent
 *   "commodity" class) and the closing lines ("nothing to lose but their
 *   chains" / "WORKING MEN OF ALL COUNTRIES, UNITE!") — never the
 *   Manifesto's other, un-seeded sections (e.g. its critique of prior
 *   utopian socialisms).
 * - Document 4 (Wollstonecraft) is quoted only from its seeded excerpt on
 *   individual education training a child "to think and reason" and the
 *   claim that virtue "must result from the exercise of its own reason,"
 *   extended from Rousseau (regarding men only) to women.
 * - Document 5 (Sadler testimony) is quoted only from its seeded hours/
 *   fatigue excerpt (14-16 hour days, meal intervals, exhaustion, lost
 *   family time) — NEVER the physical-punishment testimony ("beaten,"
 *   "strapped") that lies outside this excerpt and outside this file
 *   entirely.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U5_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u5-dbq-practice.v1',
  title: 'Unit 5 DBQ Practice — Enlightenment Ideals and the Age of Revolutions',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u5-dbq-practice',
      description:
        'Write a complete AP World History Document-Based Question essay from a five-document Unit-5 packet on Enlightenment ideals and the age of revolutions, 1750-1900 — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP World 7-point DBQ rubric.',
      standard: 'AP-APWORLD-5-DBQ',
    },
  ],
  prerequisites: [
    'apworld.enlightenment',
    'apworld.atlantic-revolutions',
    'apworld.nationalism-unification',
    'apworld.industrial-revolution',
    'apworld.industrial-society',
  ],
  followUps: [],
  estimatedMinutes: 58,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "Everything you've learned about Unit 5 — the Enlightenment, the Atlantic Revolutions, nationalism and unification, the Industrial Revolution, and the new industrial society it created — exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP World History exam, scored on the authentic 7-point rubric: Thesis (1), Contextualization (1), Evidence from the Documents (2), Evidence Beyond the Documents (1), Sourcing (1), and Complexity (1). You'll get five documents spanning 1789 to 1848. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument about how Enlightenment ideals shaped the age of revolutions and use the documents, plus what you already know, as evidence for it. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the five-document Unit-5 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get five documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph instead of grouping documents around a claim.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt. A strong thesis for this packet might argue that Enlightenment ideals of natural rights, popular sovereignty, and reason shaped the age of revolutions to a great extent, but unevenly: the same ideals that produced the French Declaration were extended by later thinkers to groups (women, the industrial working class) the original revolutionaries had not addressed, even as new industrial conditions exposed the limits of a purely rights-based framework.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing how Enlightenment philosophers such as Locke and Rousseau developed social-contract theory arguing that legitimate government rests on the consent of the governed, how the American Revolution (1776) applied that theory in the Atlantic world before the French Revolution, and how the Congress of Vienna (1815) attempted to restore monarchical order against the revolutionary and nationalist currents these ideals had unleashed — in AT LEAST a full sentence of specific description.',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0–2 points): 1 point for accurately describing the content of at least three documents; the full 2 points require using the content of AT LEAST FOUR OF THE FIVE documents to SUPPORT the thesis\'s argument — e.g. grouping the French Declaration\'s (Doc 1) codification of natural rights and popular sovereignty as the clearest legal expression of Enlightenment ideals; Bolívar\'s Jamaica Letter (Doc 2), whose grievance is centered on exclusion from colonial office rather than on rights language, showing that Latin American independence drew on different, more locally rooted grievances even as it pursued the same goal of self-government; Wollstonecraft\'s extension (Doc 4) of the Enlightenment reason-argument, which Rousseau had reserved for men, to women\'s education; and the Manifesto\'s (Doc 3) portrayal of industrial workers as a wage-dependent "commodity" class, evidence that the age of revolutions extended into a call for a further, proletarian revolution beyond the political rights the Declaration had secured.',
        'ROW D — EVIDENCE BEYOND THE DOCUMENTS (0–1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the five documents, relevant to the argument and explained — e.g. the American Declaration of Independence (1776), which invoked Lockean natural rights and government by consent to justify separation from Britain more than a decade before the French Declaration, evidence the five documents themselves do not contain.',
        'ROW E — SOURCING (0–1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. the French Declaration (Doc 1) was adopted by the National Assembly as an official state document meant to establish a new constitutional order, explaining its formal, universal-rights language; Bolívar\'s letter (Doc 2) survives only through Guillermo Sherwell\'s 1921 English rendering, written more than a century after Bolívar\'s 1815 Spanish original for an early-20th-century American biography, which explains why its specific English phrasing reflects Sherwell\'s own era rather than Bolívar\'s exact words; and the Sadler testimony (Doc 5) was sworn evidence given to a parliamentary committee investigating child factory labor, which explains its plain, question-and-answer, fact-focused form rather than persuasive rhetoric.',
        'ROW F — COMPLEXITY (0–1 point): earned holistically for a nuanced argument that does things like explain both continuity AND change, corroborate multiple document types (a constitutional charter, a personal letter, a political pamphlet, a philosophical essay, sworn testimony) against each other, or explain multiple variables (e.g. that Enlightenment ideals shaped revolutions differently depending on who invoked them and for what — French codification of universal rights, Bolívar\'s narrower grievance about colonial office, Wollstonecraft\'s extension to women, and Marx\'s redirection of revolutionary energy toward class rather than legal rights, while the Sadler testimony shows industrial children still without the rights any of the other four documents describe) — earned through the essay\'s overall argument, not one clever sentence.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP World DBQ scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the five documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which Enlightenment ideals shaped the age of revolutions, 1750–1900." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least four of the five documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apworld-rights-of-man.v1',
        'evelyn.passage.apworld-bolivar-jamaica.v1',
        'evelyn.passage.apworld-communist-manifesto.v1',
        'evelyn.passage.apworld-wollstonecraft.v1',
        'evelyn.passage.apworld-sadler-testimony.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that Enlightenment ideals of natural rights, popular sovereignty, and reason shaped the age of revolutions to a great extent between 1750 and 1900 — but unevenly, as later thinkers extended those ideals to groups the original revolutionaries had not addressed, even as new industrial conditions exposed the limits of a purely rights-based framework. Contextualization explains that Enlightenment philosophers such as Locke and Rousseau developed social-contract theory holding that legitimate government rests on the consent of the governed, that the American Revolution of 1776 applied this theory in the Atlantic world before the French Revolution, and that the Congress of Vienna in 1815 attempted to restore monarchical order against the revolutionary and nationalist currents these ideals had unleashed. The body groups at least four documents around the thesis: the French Declaration of the Rights of Man and of the Citizen (Doc 1) codifies the clearest legal expression of Enlightenment ideals, declaring that men "are born and remain free and equal in rights," that political association exists to preserve "liberty, property, security, and resistance to oppression," and that sovereignty "resides essentially in the nation" rather than in a monarch. Bolívar\'s Jamaica Letter (Doc 2), by contrast, grounds Spanish America\'s case for independence not in that rights language but in the concrete experience of colonial exclusion — Spanish Americans, he writes, "were never viceroys or governors except by very extraordinary reasons," never ambassadors, and "hardly merchants," so that Americans "have risen suddenly...without experience in public affairs" to assume self-government — evidence that Latin American revolutionaries pursued the same goal of self-rule through a distinct, locally rooted grievance rather than simply importing French rights rhetoric. Wollstonecraft\'s Vindication (Doc 4) extends the Enlightenment\'s reason-based argument for virtue beyond where Rousseau had confined it: she insists that "it is a farce to call any being virtuous whose virtues do not result from the exercise of its own reason," a claim she explicitly applies to women where "this was Rousseau\'s opinion respecting men," showing Enlightenment reason being redirected toward a group the era\'s political declarations excluded. The Manifesto (Doc 3) shows the same revolutionary energy redirected again: it describes the bourgeoisie\'s creation of "the modern working class — the proletarians," reduced to a "commodity" that must "sell themselves piece-meal," and closes by calling on "WORKING MEN OF ALL COUNTRIES" to unite because they "have nothing to lose but their chains" — evidence that by 1848 the age of revolutions had extended past political rights toward a proposed economic and class revolution. Outside evidence brings in the American Declaration of Independence of 1776, which invoked Lockean natural rights and government by the consent of the governed to justify separation from Britain more than a decade before the French Declaration — evidence none of the five documents themselves contain, and one that shows the Atlantic world applying Enlightenment natural-rights theory to revolution even earlier than 1789. Sourcing explains that the French Declaration (Doc 1) was adopted by the National Assembly as an official state document meant to establish a new constitutional order, explaining its formal, universally phrased rights language; that Bolívar\'s letter (Doc 2) survives only through Guillermo Sherwell\'s 1921 English rendering, composed more than a century after Bolívar\'s 1815 Spanish original for an early-20th-century American biography, which means its specific English wording reflects Sherwell\'s own era of translation rather than Bolívar\'s exact Spanish phrasing; and that the Sadler testimony (Doc 5) was sworn evidence given to a parliamentary committee investigating child factory labor, explaining its plain, question-and-answer, fact-focused form rather than the persuasive rhetoric of the other documents. Complexity is shown by tracing how the SAME Enlightenment ideals produced different, unevenly distributed outcomes: the French Declaration\'s universal rights language (Doc 1) did not prevent Bolívar\'s Spanish America from grounding its own revolution in a distinct grievance about colonial exclusion (Doc 2), nor did it reach the industrial children whose 14-to-16-hour days and exhaustion Sadler documents (Doc 5) — corroborated across a constitutional charter, a personal letter, a political pamphlet, a philosophical essay, and sworn testimony — rather than treating "Enlightenment ideals shaped revolutions" as a single uniform story of rights steadily expanding to everyone at once.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which Enlightenment ideals shaped the age of revolutions, 1750-1900) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a single unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt, offers a list with no line of reasoning, or is not historically defensible.',
            modelResponse:
              'Enlightenment ideals of natural rights, popular sovereignty, and reason shaped the age of revolutions to a great extent between 1750 and 1900 — but unevenly, as later thinkers extended those ideals to groups the original revolutionaries had not addressed, even as new industrial conditions exposed the limits of a purely rights-based framework.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. Locke/Rousseau\'s social-contract theory, the American Revolution\'s (1776) earlier application of it, and the Congress of Vienna\'s (1815) attempt to restore monarchical order against revolutionary and nationalist currents. No credit (0/1) for a single vague, unsupported phrase or context copied from a document without independent elaboration.',
            modelResponse:
              'Enlightenment philosophers such as Locke and Rousseau developed social-contract theory holding that legitimate government rests on the consent of the governed; the American Revolution of 1776 applied this theory in the Atlantic world before the French Revolution; and the Congress of Vienna in 1815 attempted to restore monarchical order against the revolutionary and nationalist currents these ideals had unleashed.',
          },
          {
            criterionId: 'C-doc-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST FOUR OF THE FIVE documents, grouped to support the essay\'s line of reasoning (not summarized one at a time in isolation). 1/2: accurately describes the content of at least three documents, whether or not they clearly support an argument. 0/2: fewer than three documents used, or documents are misdescribed.',
            modelResponse:
              'The French Declaration (Doc 1) codifies the clearest legal expression of Enlightenment ideals — natural rights and national sovereignty. Bolívar\'s Jamaica Letter (Doc 2) instead grounds Spanish America\'s case in concrete colonial exclusion from office, not rights language. Wollstonecraft (Doc 4) extends the Enlightenment reason-argument for virtue to women, where Rousseau had confined it to men. The Manifesto (Doc 3) shows that energy redirected again toward the industrial working class, described as a "commodity" reduced to selling itself piece-meal.',
          },
          {
            criterionId: 'D-outside-evidence',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the five documents, relevant to the argument, and EXPLAINS its relevance. No credit (0/1) for a vague reference with no specific evidence, or evidence simply named with no explanation.',
            modelResponse:
              'The American Declaration of Independence (1776) invoked Lockean natural rights and government by the consent of the governed to justify separation from Britain more than a decade before the French Declaration — evidence none of the five documents themselves contain, showing the Atlantic world applying Enlightenment natural-rights theory to revolution even earlier than 1789.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date.',
            modelResponse:
              'The French Declaration (Doc 1) was adopted by the National Assembly as an official state document meant to establish a new constitutional order, explaining its formal, universal rights language. Bolívar\'s letter (Doc 2) survives only through Guillermo Sherwell\'s 1921 English rendering, composed over a century after Bolívar\'s 1815 Spanish original, so its specific wording reflects Sherwell\'s era of translation rather than Bolívar\'s exact phrasing. The Sadler testimony (Doc 5) was sworn evidence given to a parliamentary committee investigating child factory labor, explaining its plain, fact-focused question-and-answer form.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. explicitly tracing how the same ideals produced uneven outcomes across groups, corroborating multiple document types against each other, or explaining more than one variable. No credit (0/1) if the essay treats "Enlightenment ideals shaped revolutions" as a single flat, uniform story.',
            modelResponse:
              'The same Enlightenment ideals produced unevenly distributed outcomes: the French Declaration\'s universal rights language (Doc 1) did not prevent Bolívar\'s Spanish America from grounding its revolution in a distinct grievance about colonial exclusion (Doc 2), nor did it reach the industrial children whose exhausting 14-to-16-hour days Sadler documents (Doc 5) — corroborated across a constitutional charter, a personal letter, a political pamphlet, a philosophical essay, and sworn testimony, rather than a single uniform verdict.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3, 4, 5 in order.',
        'Document 2 (Bolívar) never uses rights language — its grievance is about exclusion from colonial office. Don\'t put words in his mouth that the excerpt doesn\'t contain.',
        'Document 2 is a 1921 English rendering of Bolívar\'s 1815 Spanish letter — a strong sourcing point notes that the specific wording comes from the translator, not Bolívar directly.',
        'Document 5 (Sadler) only covers hours and fatigue — never mention physical punishment, which is not in this excerpt.',
        'Your outside-evidence fact should come from your own knowledge of the period (e.g. the American Declaration of Independence), not be paraphrased from one of the five documents.',
      ],
      estimatedMinutes: 48,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The DBQ asks you to build YOUR OWN argument and use the documents (plus outside knowledge) as evidence — never summarize each document in its own paragraph.',
        'The 7-point rubric: Thesis (1); Contextualization (1); Evidence from the Documents (2, requires 4+ of 5 documents for full credit); Evidence Beyond the Documents (1, one explained outside fact); Sourcing (1, HIPP explained for 3+ documents); Complexity (1, earned holistically).',
        'Document 2 (Bolívar) is a 1921 English rendering of an 1815 Spanish letter, and its grievance is about exclusion from colonial office — never rights language it doesn\'t contain.',
        'A strong complexity move for this packet: the SAME Enlightenment ideals produced uneven outcomes — universal rights language in France, a distinct colonial-exclusion grievance in Spanish America, an extension to women in Wollstonecraft, and industrial children in Sadler\'s testimony who those ideals had not yet reached.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5-DBQ',
    cedTitle: 'Unit 5 DBQ Practice — Enlightenment Ideals and the Age of Revolutions',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Contextualization 1 / Evidence-Documents 2 / Evidence-Beyond 1 / Sourcing 1 / Complexity 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-rights-of-man.v1',
        chapter: '1789',
        note: 'Declaration of the Rights of Man and of the Citizen — Document 1 of the five-document Unit-5 packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-bolivar-jamaica.v1',
        chapter: '1815',
        note: 'Simón Bolívar, the Jamaica Letter (Sherwell 1921 English rendering) — Document 2 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-communist-manifesto.v1',
        chapter: '1848',
        note: 'Marx and Engels, The Communist Manifesto (Moore 1888 trans.) — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-wollstonecraft.v1',
        chapter: '1792',
        note: 'Mary Wollstonecraft, A Vindication of the Rights of Woman — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-sadler-testimony.v1',
        chapter: '1832',
        note: 'Testimony of Matthew Crabtree before the Sadler Committee — Document 5 of the packet.',
      },
    ],
  },
};
