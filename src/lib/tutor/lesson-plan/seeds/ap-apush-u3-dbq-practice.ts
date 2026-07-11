/**
 * AP US History — Period 3 DBQ Practice: the full Document-Based Question
 * essay (AP APUSH Free-Response Question 1).
 *
 * This is the essay-practice plan that closes out the Period-3 content arc
 * (causes of the Revolution 3.2, revolutionary ideals 3.3, the Articles of
 * Confederation 3.9, Constitution ratification 3.10, the new republic 3.11):
 * students now write ONE complete DBQ essay under real AP exam conditions,
 * using a genuine 7-document packet, and are scored against the authentic
 * AP APUSH 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..7 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. Thomas Paine, Common Sense (1776) — evelyn.passage.apush-common-sense.v1
 *   2. The Declaration of Independence (1776) — evelyn.passage.apush-declaration.v1
 *   3. Patrick Henry, "Give Me Liberty or Give Me Death" (1775) —
 *      evelyn.passage.henry-give-me-liberty.v1
 *   4. "Join, or Die" political cartoon (Franklin, 1754) —
 *      evelyn.passage.apush-join-or-die.v1
 *   5. Preamble to the U.S. Constitution (1787) —
 *      evelyn.passage.apush-constitution-preamble.v1
 *   6. James Madison, Federalist No. 10 (1787) — evelyn.passage.apush-federalist-10.v1
 *   7. Brutus No. 1 (1787) — evelyn.passage.apush-brutus-1.v1
 *
 * The teaching point is the DBQ TASK itself — thesis, contextualization,
 * document evidence, outside evidence, sourcing (HIPP), and complexity —
 * not new historical content; all quotes are the short, already-seeded
 * excerpts used elsewhere in the Period-3 catalog.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U3_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u3-dbq-practice.v1',
  title: 'Period 3 DBQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u3-dbq-practice',
      description:
        'Write a complete AP APUSH Document-Based Question essay from a seven-document Period-3 packet — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP APUSH 7-point DBQ rubric.',
      standard: 'AP-APUSH-3-DBQ',
    },
  ],
  prerequisites: [
    'apush.causes-of-revolution',
    'apush.revolutionary-ideals',
    'apush.articles-of-confederation',
    'apush.constitution-ratification',
    'apush.new-republic',
  ],
  followUps: [],
  estimatedMinutes: 58,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "Everything you've learned about Period 3 — why the colonies broke from Britain, the ideals the Revolution unleashed, why the Articles of Confederation failed, the fight over ratifying the Constitution, and how the new republic actually governed — exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP US History exam, scored on the authentic 7-point rubric: Thesis (1), Contextualization (1), Evidence from the Documents (2), Evidence Beyond the Documents (1), Sourcing (1), and Complexity (1). You'll get seven documents spanning 1754 to 1787. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument and use the documents, plus what you already know, as evidence for it. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the seven-document Period-3 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get seven documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph ("Document 1 says X. Document 2 says Y.") instead of grouping documents around a claim.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not a simple list of "there were political and social changes." A strong thesis for this packet might argue the Revolution transformed political ideals (popular sovereignty, written constitutions, structured dissent) far more thoroughly than it transformed the social order.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing the escalating imperial crisis after the French and Indian War (taxation without representation, the Stamp Act, the Townshend Acts) that made the documents\' arguments urgent — in AT LEAST a full sentence of specific description, not a single vague phrase like "things were changing back then."',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0–2 points): 1 point for accurately describing the content of at least three documents; the full 2 points require using the content of at least six documents to SUPPORT the thesis\'s argument — e.g. grouping Paine\'s Common Sense (Doc 1) and the Declaration (Doc 2) as evidence of a universal, natural-rights case for independence; Henry\'s speech (Doc 3) and Join-or-Die (Doc 4) as evidence colonists framed resistance as a shared cause requiring unity; and the Preamble (Doc 5), Federalist 10 (Doc 6), and Brutus 1 (Doc 7) as evidence of a genuine post-independence debate over how much popular power a durable government could safely hold.',
        'ROW D — EVIDENCE BEYOND THE DOCUMENTS (0–1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the seven documents, relevant to the argument and explained (not just named) — e.g. the actual failure of the Articles of Confederation under Shays\' Rebellion, which is what directly produced the Constitutional Convention that Documents 5-7 are debating.',
        'ROW E — SOURCING (0–1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. Brutus 1 (Doc 7) was written by an Anti-Federalist to persuade New York voters wary of losing state power, which explains why it stresses that free republics have never governed so large a territory; Federalist 10 (Doc 6) was written by Madison, a framer defending the very Constitution he helped write, which explains why it argues a LARGE republic actually controls factions rather than endangering liberty; Join-or-Die (Doc 4) was republished during the 1760s-70s imperial crisis specifically to persuade separate colonies their survival depended on unity, which explains its urgent visual message.',
        'ROW F — COMPLEXITY (0–1 point): earned holistically for a nuanced argument that does things like explain both continuity AND change, corroborate multiple document types (a pamphlet, a founding text, a speech, a cartoon, a constitutional preamble, two competing political essays) against each other, or explain multiple variables (e.g. that political ideals moved further and faster than social/economic ideals) — earned through the essay\'s overall argument, not from one clever sentence in isolation.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP APUSH DBQ scale, distinct from the AP Lang 6-point rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the seven documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which the American Revolution changed American political and social ideals in the period from 1775 to 1800." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least six of the seven documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apush-common-sense.v1',
        'evelyn.passage.apush-declaration.v1',
        'evelyn.passage.henry-give-me-liberty.v1',
        'evelyn.passage.apush-join-or-die.v1',
        'evelyn.passage.apush-constitution-preamble.v1',
        'evelyn.passage.apush-federalist-10.v1',
        'evelyn.passage.apush-brutus-1.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that the Revolution transformed American POLITICAL ideals thoroughly (popular sovereignty, government by consent, a written constitution structuring how power is granted and limited) while SOCIAL ideals changed far less completely, or a comparably defensible complex claim with a clear line of reasoning. Contextualization situates the packet in the escalating imperial crisis after the French and Indian War (taxation without representation, the Stamp/Townshend Acts) that first pushed colonists toward the unity Join-or-Die had urged decades earlier. The body groups at least six documents around the thesis rather than summarizing them in order: Paine\'s universal appeal to "all mankind" (Doc 1) and the Declaration\'s claim that all men are "created equal" with unalienable rights and that government derives its "just powers from the consent of the governed" (Doc 2) show the Revolution\'s ideals were framed as natural and universal, not merely a colonial grievance; Henry\'s insistence that liberty is worth fighting for (Doc 3) and the earlier Join-or-Die cartoon urging the colonies to unite or perish (Doc 4) show that political unity had to be actively argued for, not assumed; and the post-independence debate over how much power the new government should hold — the Constitution\'s Preamble promising to "form a more perfect Union" and "secure the Blessings of Liberty" (Doc 5), Madison\'s Federalist 10 argument that a LARGE republic actually controls the "mischiefs of faction" (Doc 6), and Brutus 1\'s warning that no free republic has ever governed so vast a territory without becoming tyrannical (Doc 7) — shows political ideals about popular power were contested and refined for over a decade after 1776, not settled instantly. Outside evidence brings in Shays\' Rebellion (1786-87), whose armed farmer uprising against debt collection under the weak Articles of Confederation directly convinced many leaders a stronger central government was necessary, producing the Constitutional Convention that Documents 5-7 are debating. Sourcing explains that Brutus 1 (Doc 7) was written by an Anti-Federalist to persuade New York\'s ratifying convention that a distant, powerful federal government threatened the state liberties won by the Revolution, which explains its emphasis on republics failing at scale; that Federalist 10 (Doc 6) was written by Madison, one of the Constitution\'s framers, to persuade the public that his own document deserved ratification, which explains why it reframes size as a strength rather than a danger; and that Join-or-Die (Doc 4) was revived during the 1760s-70s imperial crisis specifically to persuade previously separate, often rival colonies that their survival required unity, explaining its stark either/or visual argument. Complexity is shown by explicitly weighing continuity against change — arguing that while political ideals about legitimate government were reinvented (from monarchy to a constitution ratified through public debate), social ideals about who counted as equal citizens (enslaved Americans, women, Native nations) barely moved in the same period — rather than treating "change" as a single uniform verdict.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which the Revolution changed American political and social ideals, 1775-1800) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a single unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt, offers a list with no line of reasoning ("there were political and social changes"), or is not historically defensible.',
            modelResponse:
              'The American Revolution thoroughly transformed American POLITICAL ideals — replacing monarchy with government grounded in popular consent and written constitutions — far more completely than it transformed American SOCIAL ideals about who actually counted as an equal citizen.',
          },
          {
            criterionId: 'B-contextualization',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. the escalating imperial crisis after the French and Indian War (new taxes, the Stamp Act, the Townshend Acts) that made questions of consent and legitimate authority urgent well before 1775. No credit (0/1) for a single vague, unsupported phrase ("times were changing") or context copied from a document without independent elaboration.',
            modelResponse:
              'After the costly French and Indian War, Parliament began taxing the colonies directly for the first time to help pay off war debt — the Stamp Act (1765) and Townshend Acts (1767) — provoking colonial protests over taxation without representation that, over the following decade, escalated from petitions into the open political argument for independence found in these documents.',
          },
          {
            criterionId: 'C-evidence-documents',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST SIX of the seven documents, grouped to support the essay\'s line of reasoning (not summarized one at a time in isolation). 1/2: accurately describes the content of at least three documents, whether or not they clearly support an argument. 0/2: fewer than three documents used, or documents are misdescribed.',
            modelResponse:
              'Paine\'s appeal to "all mankind" (Doc 1) and the Declaration\'s claim that all men are "created equal" with government deriving "just powers from the consent of the governed" (Doc 2) frame the Revolution\'s political ideals as universal natural rights, not a narrow colonial complaint. Henry\'s call to fight for liberty (Doc 3) and the earlier Join-or-Die cartoon (Doc 4) show that political unity itself had to be argued for. The post-1776 documents then show the argument continuing: the Constitution\'s Preamble promises to "secure the Blessings of Liberty" through a "more perfect Union" (Doc 5), Federalist 10 argues a large republic actually controls factional danger (Doc 6), and Brutus 1 warns that free republics have never governed so vast a territory (Doc 7) — together showing political ideals about how much popular power a government could safely hold remained contested for over a decade after independence.',
          },
          {
            criterionId: 'D-evidence-beyond',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the seven documents, relevant to the argument, and EXPLAINS its relevance (not just names it). No credit (0/1) for a vague reference with no specific evidence, or evidence that is simply named with no explanation of how it supports the thesis.',
            modelResponse:
              'Shays\' Rebellion (1786-87), an armed uprising of indebted Massachusetts farmers against the state\'s enforcement of debt collection, showed that the weak central government under the Articles of Confederation could not reliably keep order or address economic grievances — a failure that directly convinced many political leaders a stronger federal government was necessary, producing the Constitutional Convention that Documents 5 through 7 are arguing over.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date without explaining relevance to the argument.',
            modelResponse:
              'Brutus 1 (Doc 7) was written by an Anti-Federalist aiming to persuade New York\'s ratifying convention that a powerful distant government threatened the state liberties the Revolution had just won, which explains its focus on free republics failing at large scale. Federalist 10 (Doc 6) was written by James Madison, one of the Constitution\'s own framers, to build public support for ratifying the document he helped draft, which explains why it reframes a large republic as a strength rather than the danger Brutus describes. Join-or-Die (Doc 4), though first published in 1754, was deliberately revived during the 1760s-70s imperial crisis to persuade previously separate, often rival colonies that only unity could ensure their survival, explaining its stark visual either/or argument.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. explicitly weighing continuity against change, corroborating multiple document types against each other, or explaining more than one variable (here, contrasting political-ideal change with social-ideal continuity) — not from a single isolated clever sentence. No credit (0/1) if the essay treats "change" as a single flat verdict with no qualification or comparison.',
            modelResponse:
              'What complicates a simple "the Revolution changed everything" narrative is how unevenly that change landed: political ideals about legitimate government were genuinely reinvented — from monarchy, to natural-rights independence (Docs 1-2), to a hotly debated written constitution balancing popular power against the risk of faction (Docs 5-7) — while social ideals about who actually counted as an equal citizen barely moved across the same quarter-century, since none of the seven documents extend their language of natural, universal rights to enslaved Americans, women, or Native nations, revealing that "the Revolution\'s ideals" advanced much further in political theory than in social practice.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3 in order.',
        'For sourcing, ask: why did THIS author write THIS document for THIS audience, and how does that explain what it argues?',
        'Your outside-evidence fact should come from your own knowledge of the period, not be paraphrased from one of the seven documents.',
        'A strong complexity move is contrasting what changed with what stayed the same — political ideals versus social ideals is a good split for this packet.',
      ],
      estimatedMinutes: 48,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The DBQ asks you to build YOUR OWN argument and use the documents (plus outside knowledge) as evidence — never summarize each document in its own paragraph.',
        'The 7-point rubric: Thesis (1); Contextualization (1); Evidence from the Documents (2, requires 6+ documents for full credit); Evidence Beyond the Documents (1, one explained outside fact); Sourcing (1, HIPP explained for 3+ documents); Complexity (1, earned holistically).',
        'Sourcing means explaining WHY a document\'s author/purpose/audience/situation matters to your argument — not just naming the author or date.',
        'A strong complexity move for this packet: political ideals (popular sovereignty, written constitutions) changed more thoroughly and faster than social ideals about who counted as an equal citizen.',
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
    cedTitle: 'Period 3 DBQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Contextualization 1 / Evidence-Documents 2 / Evidence-Beyond 1 / Sourcing 1 / Complexity 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-common-sense.v1',
        chapter: '1776',
        note: 'Thomas Paine, Common Sense — Document 1 of the seven-document Period-3 packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-declaration.v1',
        chapter: '1776',
        note: 'The Declaration of Independence — Document 2 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.henry-give-me-liberty.v1',
        chapter: '1775',
        note: 'Patrick Henry, "Give Me Liberty or Give Me Death" — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-join-or-die.v1',
        chapter: '1754',
        note: '"Join, or Die" political cartoon — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-constitution-preamble.v1',
        chapter: '1787',
        note: 'Preamble to the U.S. Constitution — Document 5 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-federalist-10.v1',
        chapter: '1787',
        note: 'James Madison, Federalist No. 10 — Document 6 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-brutus-1.v1',
        chapter: '1787',
        note: 'Brutus No. 1 — Document 7 of the packet.',
      },
    ],
  },
};
