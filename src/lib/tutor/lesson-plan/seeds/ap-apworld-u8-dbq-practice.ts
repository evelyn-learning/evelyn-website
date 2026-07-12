/**
 * AP World History: Modern — Unit 8 DBQ Practice: the full Document-Based
 * Question essay (AP World FRQ 1), closing out the Unit-8 content arc (the
 * global Cold War 8.1-8.4, decolonization 8.5-8.6, the challenges facing new
 * states 8.7-8.8, and the Cold War's end 8.9-8.10).
 *
 * Students write ONE complete DBQ essay under real AP exam conditions, using
 * a genuine five-document Unit-8 packet, and are scored against the
 * authentic AP World 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..5 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. Harry S. Truman, Address Before a Joint Session of Congress /
 *      "Truman Doctrine" (March 12, 1947) —
 *      evelyn.passage.apush-truman-doctrine.v1 (REUSED from APUSH Period 8)
 *   2. John F. Kennedy, Radio and Television Report on the Soviet Arms
 *      Build-Up in Cuba (October 22, 1962) —
 *      evelyn.passage.apworld-jfk-cuba.v1
 *   3. Universal Declaration of Human Rights, Preamble and Articles 1-2
 *      (1948) — evelyn.passage.apworld-udhr.v1
 *   4. Growth in United Nations Membership, data table (1945-2000) —
 *      evelyn.passage.apworld-un-membership-table.v1
 *   5. The Berlin Wall, 1961-1989, photograph set —
 *      evelyn.passage.apworld-berlin-wall-visual.v1
 *
 * DOCUMENT FIDELITY: every modelResponse below attributes to each document
 * ONLY what its seeded excerpt/description actually contains.
 *   - Doc 1 (Truman) never names Greece or Turkey in its excerpt — that
 *     detail, and "containment"/NSC-68/the Marshall Plan, are OUTSIDE
 *     evidence, not document content.
 *   - Doc 2 (JFK) is three non-adjacent paragraphs joined by ". . ." — never
 *     treated as continuous prose; only the missile-buildup finding, the
 *     "no longer... only the actual firing of weapons" framing, and the
 *     quarantine announcement (plus its explicit Berlin-blockade comparison)
 *     are used.
 *   - Doc 3 (UDHR) covers only the Preamble's opening/closing clauses and
 *     Articles 1-2 — no other UDHR article is quoted or paraphrased as
 *     document content.
 *   - Doc 4 (UN table) is a DESCRIBED data table: only the seven decade
 *     snapshots (51/76/99/127/154/159/189) and the explicitly highlighted
 *     1960 jump (82->99, +17, 16 of 17 newly independent African states) are
 *     used — no other year or region is invented.
 *   - Doc 5 (Berlin Wall) is a DESCRIBED photograph set: only construction
 *     (Aug 13, 1961), Checkpoint Charlie's signage/guard posts, and the
 *     Nov 9, 1989 opening are used.
 *   - Famous un-seeded material (the 1955 Bandung Conference, the
 *     Non-Aligned Movement) is used ONLY as outside evidence, described with
 *     zero quotation, never attributed to any of the five documents.
 *
 * The teaching point is the DBQ TASK itself — thesis, contextualization,
 * document evidence, outside evidence, sourcing (HIPP), and complexity —
 * not new historical content; all quotes are the short, already-seeded
 * excerpts used elsewhere in the Unit-8 catalog.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U8_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u8-dbq-practice.v1',
  title: 'Unit 8 DBQ Practice — The Cold War and Newly Independent States',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u8-dbq-practice',
      description:
        'Write a complete AP World History Document-Based Question essay from a five-document Unit-8 packet on the Cold War and newly independent states, 1945-1991 — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP World 7-point DBQ rubric.',
      standard: 'AP-APWORLD-8-DBQ',
    },
  ],
  prerequisites: [
    'apworld.cold-war-global',
    'apworld.decolonization-wave',
    'apworld.new-states',
    'apworld.end-cold-war',
  ],
  followUps: [],
  estimatedMinutes: 58,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "Everything you've learned about Unit 8 — the global Cold War, decolonization, the challenges facing new states, and the Cold War's end — exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP World History exam, scored on the authentic 7-point rubric: Thesis (1), Contextualization (1), Evidence from the Documents (2), Evidence Beyond the Documents (1), Sourcing (1), and Complexity (1). You'll get five documents spanning 1947 to 1989 — two presidential addresses, an international declaration, a data table, and a photograph set. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument about how the Cold War shaped the paths of newly independent states, and use the documents, plus what you already know, as evidence for it. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the five-document Unit-8 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get five documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph ("Document 1 says X. Document 2 says Y.") instead of grouping documents around a claim.',
        'ROW A — THESIS/CLAIM (0-1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not a simple list of "the Cold War affected new states a lot." A strong thesis for this packet might argue the Cold War shaped newly independent states\' paths substantially by setting the ideological terms and superpower stakes those states had to navigate, even as those same states asserted a rights-based order of their own and reshaped the UN\'s composition through sheer numbers — a shaping that was real but contested, not simply imposed from outside.',
        'ROW B — CONTEXTUALIZATION (0-1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing how the Second World War left European colonial powers economically and militarily exhausted just as the United States and the Soviet Union emerged as the two dominant, ideologically opposed powers, so that dozens of states achieving independence after 1945 entered directly into an already-bipolar world — in AT LEAST a full sentence of specific description, not a single vague phrase like "the world changed a lot after 1945."',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0-2 points): 1 point for accurately describing the content of at least three documents; the full 2 points require using the content of AT LEAST FOUR of the five documents to SUPPORT the thesis\'s argument — e.g. grouping Truman\'s open-ended commitment (Doc 1) and Kennedy\'s framing of the Cuban missiles as a hemisphere-wide "nuclear strike capability" (Doc 2) as evidence that new and existing states alike became stakes in a superpower contest; the UDHR\'s extension of rights "whether it be independent, trust, non-self-governing or under any other limitation of sovereignty" (Doc 3) as evidence of a rival, rights-based international order taking shape in the very same years; the UN membership table\'s 1960 jump, driven by newly independent African states (Doc 4), as evidence that new states measurably reshaped the international order\'s own composition; and the Berlin Wall\'s 1961 construction and 1989 opening (Doc 5) as evidence that the bipolar order structuring most new states\' choices was itself geographically anchored in Europe and finite in duration.',
        'ROW D — EVIDENCE BEYOND THE DOCUMENTS (0-1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the five documents, relevant to the argument and explained (not just named) — e.g. the 1955 Bandung Conference, where newly independent African and Asian states articulated what became the Non-Aligned Movement, a deliberate refusal to become a client of either the American or Soviet bloc — a path none of the five documents themselves describe.',
        'ROW E — SOURCING (0-1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. Truman\'s address (Doc 1) was delivered to a joint session of Congress to win support for an unprecedented peacetime foreign-aid commitment, which explains why it frames the choice in sweeping, universal "nearly every nation" terms rather than naming a specific country or region; Kennedy\'s address (Doc 2) was a live broadcast to the American public in the middle of an actual unfolding crisis, which explains its urgent, evidentiary tone ("unmistakable evidence") and its deliberate emphasis that the US response was a measured "quarantine," not a full blockade or invasion; the UDHR (Doc 3) was adopted by a UN General Assembly that in 1948 still included colonial powers among its members, which explains why Article 2 had to explicitly extend its claims to "trust" and "non-self-governing" territories rather than assuming all peoples were already politically independent.',
        'ROW F — COMPLEXITY (0-1 point): earned holistically for a nuanced argument that does things like explain both externally-imposed AND self-asserted forces, corroborate multiple document types (a congressional address, a crisis broadcast, an international declaration, a data table, a photograph set) against each other, or explain multiple variables (e.g. that the Cold War\'s shaping power was real but partial, contested by both a rights-based order and a non-aligned path, and ultimately time-limited) — earned through the essay\'s overall argument, not from one clever sentence in isolation.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP World DBQ scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the five documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which the Cold War shaped the paths of newly independent states, 1945-1991." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least four of the five documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apush-truman-doctrine.v1',
        'evelyn.passage.apworld-jfk-cuba.v1',
        'evelyn.passage.apworld-udhr.v1',
        'evelyn.passage.apworld-un-membership-table.v1',
        'evelyn.passage.apworld-berlin-wall-visual.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that the Cold War shaped the paths of newly independent states to a substantial extent — it set the ideological options and superpower stakes those states had to navigate — even as those same states helped assert a rival, rights-based international order and measurably reshaped the UN\'s own composition, so that the shaping was real but contested rather than total or one-directional. Contextualization situates the packet in the exhaustion of the European colonial powers after the Second World War, just as the United States and the Soviet Union emerged as the two dominant, ideologically opposed powers, so that the dozens of states achieving independence after 1945 entered directly into an already-bipolar world rather than a blank slate. The body groups at least four documents around the thesis rather than summarizing them in order: Truman\'s commitment to "support free peoples who are resisting attempted subjugation by armed minorities or by outside pressures" (Doc 1) and Kennedy\'s warning that Soviet missile sites in Cuba could provide "a nuclear strike capability against the Western Hemisphere" (Doc 2) show new and existing states alike becoming stakes in an superpower contest whose logic reached far beyond the superpowers\' own territory; the UDHR\'s insistence that its rights apply without distinction "whether it be independent, trust, non-self-governing or under any other limitation of sovereignty" (Doc 3) shows a rival, universalist framework taking shape in the very same years, one that did not wait for the Cold War\'s ideological contest to resolve before asserting itself; the UN membership table\'s single largest one-year jump, from 82 to 99 members in 1960, of which 16 of the 17 new members were newly independent African states (Doc 4), shows that new states did not just enter a Cold-War-structured order passively — they measurably reshaped its composition; and the Berlin Wall\'s construction in August 1961 and its opening on the night of November 9, 1989 (Doc 5) show that the bipolar order structuring so many new states\' choices was itself anchored in a single European city and, ultimately, finite. Outside evidence brings in the 1955 Bandung Conference, where newly independent African and Asian states articulated what became the Non-Aligned Movement — a deliberate refusal to become a client of either the American or Soviet bloc, a path none of the five documents themselves describe. Sourcing explains that Truman\'s address (Doc 1) was delivered to a joint session of Congress to win support for an unprecedented peacetime foreign-aid commitment, which explains its sweeping, universal "nearly every nation must choose" framing rather than naming any specific country; that Kennedy\'s address (Doc 2) was a live broadcast to the American public in the middle of an actual unfolding crisis, which explains both its urgent, evidentiary tone and its deliberate emphasis that the response was a measured "quarantine" rather than a blockade or invasion; and that the UDHR (Doc 3) was adopted by a General Assembly that in 1948 still counted colonial powers among its members, which explains why Article 2 had to explicitly name "trust" and "non-self-governing" territories rather than assuming all peoples were already independent. Complexity is shown by explicitly weighing externally-imposed Cold War pressure (Docs 1, 2, 5) against forces new states asserted for themselves — a rights-based order (Doc 3), a numerical reshaping of the UN (Doc 4), and non-alignment (outside evidence) — and by corroborating very different document types (a congressional address, a crisis broadcast, an international declaration, a data table, a photograph set) against one another rather than treating "the Cold War shaped new states" as a single uniform verdict.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which the Cold War shaped the paths of newly independent states, 1945-1991) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a single unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt, offers a list with no line of reasoning ("the Cold War affected new states a lot"), or is not historically defensible.',
            modelResponse:
              'The Cold War shaped the paths of newly independent states to a substantial extent — it set the ideological options and superpower stakes those states had to navigate — even as those same states helped assert a rival, rights-based international order and measurably reshaped the UN\'s own composition, so that the shaping was real but contested rather than total or one-directional.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. the exhaustion of the European colonial powers after World War II just as the US and USSR emerged as the two dominant, ideologically opposed powers. No credit (0/1) for a single vague, unsupported phrase ("the world changed a lot") or context copied from a document without independent elaboration.',
            modelResponse:
              'The Second World War left the European colonial powers economically and militarily exhausted just as the United States and the Soviet Union emerged as the two dominant, ideologically opposed powers, so that the dozens of states achieving independence after 1945 entered directly into an already-bipolar world rather than a blank slate.',
          },
          {
            criterionId: 'C-doc-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST FOUR of the five documents, grouped to support the essay\'s line of reasoning (not summarized one at a time in isolation). 1/2: accurately describes the content of at least three documents, whether or not they clearly support an argument. 0/2: fewer than three documents used, or documents are misdescribed.',
            modelResponse:
              'Truman\'s commitment to "support free peoples who are resisting attempted subjugation by armed minorities or by outside pressures" (Doc 1) and Kennedy\'s warning that Soviet missiles in Cuba could provide "a nuclear strike capability against the Western Hemisphere" (Doc 2) show new and existing states alike becoming stakes in a superpower contest. The UDHR\'s insistence that rights apply "whether it be independent, trust, non-self-governing or under any other limitation of sovereignty" (Doc 3) shows a rival, universalist order taking shape in the same years. The UN membership table\'s single largest one-year jump — 82 to 99 members in 1960, 16 of the 17 new members newly independent African states (Doc 4) — shows new states measurably reshaping the order\'s own composition, while the Berlin Wall\'s 1961 construction and 1989 opening (Doc 5) show the bipolar order itself was anchored in one city and, ultimately, finite.',
          },
          {
            criterionId: 'D-outside-evidence',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the five documents, relevant to the argument, and EXPLAINS its relevance (not just names it). No credit (0/1) for a vague reference with no specific evidence, or evidence that is simply named with no explanation of how it supports the thesis.',
            modelResponse:
              'The 1955 Bandung Conference, where newly independent African and Asian states articulated what became the Non-Aligned Movement, shows a third path — a deliberate refusal to become a client of either the American or Soviet bloc — that none of the five documents themselves describe, complicating any account of new states as simply pulled between two poles.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date without explaining relevance to the argument.',
            modelResponse:
              'Truman\'s address (Doc 1) was delivered to a joint session of Congress to win support for an unprecedented peacetime foreign-aid commitment, which explains its sweeping, universal "nearly every nation must choose" framing rather than a request naming a specific country. Kennedy\'s address (Doc 2) was a live broadcast to the American public in the middle of an actual unfolding crisis, which explains both its urgent, evidentiary tone and its deliberate emphasis that the response was a measured "quarantine" rather than a blockade or invasion. The UDHR (Doc 3) was adopted by a General Assembly that in 1948 still counted colonial powers among its members, which explains why Article 2 had to explicitly name "trust" and "non-self-governing" territories rather than assuming all peoples were already politically independent.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. explicitly weighing externally-imposed Cold War pressure against forces new states asserted for themselves, corroborating multiple document types against each other, or explaining more than one variable — not from a single isolated clever sentence. No credit (0/1) if the essay treats "the Cold War shaped new states" as a single flat verdict with no qualification or comparison.',
            modelResponse:
              'What complicates a simple "the Cold War controlled new states\' paths" narrative is that the same years produced a rival, rights-based order (Doc 3), a UN whose composition new states themselves transformed (Doc 4), and a deliberate non-aligned path (outside evidence) alongside the superpower pressure documented in Docs 1, 2, and 5 — corroborated across five very different document types, from a congressional address to a photograph set, showing the Cold War\'s shaping power was real but contested, not absolute.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3 in order.',
        'For sourcing, ask: why did THIS author write THIS document for THIS audience, and how does that explain what it argues?',
        'Only quote what a document actually says — Document 1 (Truman) never names Greece or Turkey, so don\'t invent that detail; it belongs in outside evidence.',
        'Your outside-evidence fact should come from your own knowledge of the period, not be paraphrased from one of the five documents.',
      ],
      estimatedMinutes: 48,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The DBQ asks you to build YOUR OWN argument and use the documents (plus outside knowledge) as evidence — never summarize each document in its own paragraph.',
        'The 7-point rubric: Thesis (1); Contextualization (1); Evidence from the Documents (2, requires 4+ of 5 documents for full credit); Evidence Beyond the Documents (1, one explained outside fact); Sourcing (1, HIPP explained for 3+ documents); Complexity (1, earned holistically).',
        'Only attribute to a document what it actually says — the Truman excerpt (Doc 1) never names Greece or Turkey, so that specific detail is outside evidence, not document content.',
        'A strong complexity move for this packet: the Cold War\'s shaping power was real (Docs 1, 2, 5) but contested by forces new states asserted for themselves — a rights-based order (Doc 3), a UN they numerically reshaped (Doc 4), and non-alignment (outside evidence).',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8-DBQ',
    cedTitle: 'Unit 8 DBQ Practice — The Cold War and Newly Independent States',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Contextualization 1 / Evidence-Documents 2 / Evidence-Beyond 1 / Sourcing 1 / Complexity 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-truman-doctrine.v1',
        chapter: '1947',
        note: 'Truman Doctrine address (REUSED from APUSH Period 8) — Document 1 of the five-document Unit-8 packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-jfk-cuba.v1',
        chapter: '1962',
        note: 'Kennedy, Radio and Television Report on the Soviet Arms Build-Up in Cuba — Document 2 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-udhr.v1',
        chapter: '1948',
        note: 'Universal Declaration of Human Rights, Preamble and Articles 1-2 — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-un-membership-table.v1',
        chapter: '1945-2000',
        note: 'Growth in United Nations Membership data table — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-berlin-wall-visual.v1',
        chapter: '1961-1989',
        note: 'The Berlin Wall photograph set — Document 5 of the packet.',
      },
    ],
  },
};
