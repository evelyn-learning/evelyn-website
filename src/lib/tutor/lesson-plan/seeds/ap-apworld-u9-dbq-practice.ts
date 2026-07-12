/**
 * AP World History: Modern — Unit 9 DBQ Practice: the full Document-Based
 * Question essay (AP World FRQ 1), closing out the Unit-9 content arc (the
 * global economy 9.1-9.3, technology and communication 9.4-9.5, environment
 * and disease 9.6-9.7, and culture/rights/migration 9.8-9.9).
 *
 * Students write ONE complete DBQ essay under real AP exam conditions, using
 * a genuine five-document Unit-9 packet, and are scored against the
 * authentic AP World 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..5 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. World and Regional Life Expectancy at Birth, data table (1950 and
 *      2019) — evelyn.passage.apworld-life-expectancy-table.v1
 *   2. Global Mobile-Phone and Internet Adoption, data table (1990-2020) —
 *      evelyn.passage.apworld-ict-table.v1
 *   3. World Container Port Throughput and Merchandise Export Value, data
 *      table (1980-2020) — evelyn.passage.apworld-trade-container-table.v1
 *   4. Universal Declaration of Human Rights, Preamble and Articles 1-2
 *      (1948) — evelyn.passage.apworld-udhr.v1 (REUSED from Unit 8)
 *   5. George W. Bush, Address Before a Joint Session of Congress on the
 *      Response to the September 11 Attacks (2001) —
 *      evelyn.passage.apush-bush-sept-2001.v1 (REUSED from APUSH)
 *
 * DOCUMENT FIDELITY: every modelResponse below attributes to each document
 * ONLY what its seeded excerpt/description actually contains.
 *   - Doc 1 (life expectancy) uses only the described figures: world 46->73
 *     years (1950->2019), Africa 37->62 (+25), Asia 42->74 (+32, the
 *     largest regional gain shown), Europe 62->79 (+17, the smallest) — no
 *     other year or region is invented.
 *   - Doc 2 (ICT) uses only the described figures: mobile subscriptions
 *     1990 ~11M -> 2020 ~8.26B (more subscriptions than people); internet
 *     use 2005 15.6% -> 2020 60.1%, with 2005 (not 1990/2000) as the
 *     earliest internet-use anchor, per the passage's own scoping note —
 *     internet use is NEVER claimed for 1990 or 2000.
 *   - Doc 3 (trade/container) uses only the described figures: container
 *     throughput 1980 36M TEU -> 2020 792M TEU (~22x); merchandise exports
 *     1980 $1.97T -> 2020 $17.73T nominal (~9x), WITH the passage's own
 *     nominal-vs-physical-volume scoping (nominal dollars mix real volume
 *     growth with price/exchange effects; container throughput is the
 *     physical-volume measure) — never presented as a single, unqualified
 *     trade figure.
 *   - Doc 4 (UDHR) covers only the Preamble's opening/closing clauses and
 *     Articles 1-2 — no other UDHR article is quoted or paraphrased as
 *     document content.
 *   - Doc 5 (Bush) is three non-adjacent excerpted segments joined by
 *     elisions — never bridged into continuous prose; only the "act of war"
 *     / "freedom itself is under attack" framing, the direct message of
 *     respect to Muslims worldwide, and the "radical network of terrorists,
 *     and every government that supports them" framing are used, and the
 *     security-vs-rights tension the excerpt itself documents (a wartime
 *     security framing alongside a deliberate, explicit affirmation of
 *     Muslims' faith and American Muslims' standing) is treated as a
 *     documented debate, not editorialized.
 *   - Famous un-seeded material (the Green Revolution, smallpox
 *     eradication) is used ONLY as outside evidence, described with zero
 *     quotation, never attributed to any of the five documents.
 *
 * The teaching point is the DBQ TASK itself — thesis, contextualization,
 * document evidence, outside evidence, sourcing (HIPP), and complexity —
 * not new historical content; all quotes/figures are the short, already-
 * seeded excerpts and descriptions used elsewhere in the Unit-9 catalog.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U9_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u9-dbq-practice.v1',
  title: 'Unit 9 DBQ Practice — Globalization and Everyday Life',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u9-dbq-practice',
      description:
        'Write a complete AP World History Document-Based Question essay from a five-document Unit-9 packet on globalization and everyday life after 1945 — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP World 7-point DBQ rubric.',
      standard: 'AP-APWORLD-9-DBQ',
    },
  ],
  prerequisites: [
    'apworld.global-economy',
    'apworld.technology-communication',
    'apworld.environment-disease',
    'apworld.culture-rights-migration',
  ],
  followUps: [],
  estimatedMinutes: 58,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "Everything you've learned about Unit 9 — the global economy, technology and communication, environment and disease, and culture, rights, and migration — exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP World History exam, scored on the authentic 7-point rubric: Thesis (1), Contextualization (1), Evidence from the Documents (2), Evidence Beyond the Documents (1), Sourcing (1), and Complexity (1). You'll get five documents spanning 1948 to 2020 — three data tables, an international declaration, and a presidential address. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument about how globalization transformed everyday life across regions after 1945, and use the documents, plus what you already know, as evidence for it. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the five-document Unit-9 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get five documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph ("Document 1 says X. Document 2 says Y.") instead of grouping documents around a claim.',
        'ROW A — THESIS/CLAIM (0-1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not a simple list of "globalization changed everyday life a lot." A strong thesis for this packet might argue globalization after 1945 transformed everyday life substantially — raising life expectancy, spreading communications technology, and multiplying the volume of goods moving across borders — even as those gains reached regions unevenly and coexisted with both a rival, rights-based order and, by the century\'s end, a newly globalized security concern.',
        'ROW B — CONTEXTUALIZATION (0-1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing how the Bretton Woods institutions (the IMF and World Bank) and later the World Trade Organization built a rules-based framework for international trade after 1945, while decolonization added dozens of new sovereign states into a UN system built around universal rights and multilateral cooperation, together laying the institutional groundwork for the accelerating economic and technological integration of the following decades — in AT LEAST a full sentence of specific description, not a single vague phrase like "the world got more connected."',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0-2 points): 1 point for accurately describing the content of at least three documents; the full 2 points require using the content of AT LEAST FOUR of the five documents to SUPPORT the thesis\'s argument — e.g. grouping the life-expectancy table\'s worldwide gain from 46 to 73 years, with Asia\'s +32-year gain the largest of the three regions shown (Doc 1), and the ICT table\'s rise from about 11 million mobile subscriptions in 1990 to 8.26 billion in 2020 (Doc 2) as evidence that globalization measurably transformed health and communication in everyday life; the trade/container table\'s roughly twenty-two-fold rise in container throughput against a smaller nine-fold rise in nominal export value (Doc 3) as evidence that the physical volume of globally-traded goods grew even faster than raw trade figures suggest; the UDHR\'s extension of its rights "whether it be independent, trust, non-self-governing or under any other limitation of sovereignty" (Doc 4) as evidence of a rival, rights-based vision of a transformed world taking hold alongside material change; and Bush\'s September 2001 address framing the attacks as an act of war by "a radical network of terrorists, and every government that supports them" (Doc 5) as evidence that by the century\'s end globalization\'s transformations had extended into a shared, cross-border sense of security threat.',
        'ROW D — EVIDENCE BEYOND THE DOCUMENTS (0-1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the five documents, relevant to the argument and explained (not just named) — e.g. the Green Revolution\'s high-yield wheat and rice varieties, associated with agronomist Norman Borlaug and credited with averting famine across much of South Asia in the 1960s-70s, a transformation of everyday nutrition that none of the five documents themselves describe.',
        'ROW E — SOURCING (0-1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. the life-expectancy table (Doc 1) was compiled by the UN Population Division and deliberately ends its comparison at 2019 rather than a more recent year specifically to avoid the temporary COVID-19 mortality shock, which explains why the packet\'s health argument rests on long-run structural gains rather than a short-term crisis; the trade/container table (Doc 3) explicitly notes that its nominal-dollar export figures mix real volume growth with decades of price and exchange-rate change, which explains why an argument about how much physical trade actually grew should lean on the container-throughput figures rather than the export-value figures alone; Bush\'s address (Doc 5) was delivered to a joint session of Congress and broadcast nationally and globally in the immediate aftermath of September 11, which explains why it pairs an urgent "act of war" framing with a deliberate, explicit message of respect to Muslims worldwide — a dual purpose of rallying domestic resolve while shaping a global audience\'s understanding of the response.',
        'ROW F — COMPLEXITY (0-1 point): earned holistically for a nuanced argument that does things like explain both the material AND the ideological/security dimensions of globalization\'s transformation of everyday life, corroborate multiple document types (three data tables, an international declaration, a presidential address) against each other, or explain multiple variables (e.g. that globalization\'s gains were real but uneven across regions, contested by a rival rights-based order, and eventually entangled with a globalized security concern) — earned through the essay\'s overall argument, not from one clever sentence in isolation.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP World DBQ scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the five documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which globalization after 1945 transformed everyday life across regions." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least four of the five documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apworld-life-expectancy-table.v1',
        'evelyn.passage.apworld-ict-table.v1',
        'evelyn.passage.apworld-trade-container-table.v1',
        'evelyn.passage.apworld-udhr.v1',
        'evelyn.passage.apush-bush-sept-2001.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that globalization after 1945 transformed everyday life across regions to a substantial extent — raising life expectancy, spreading communications technology, and multiplying the volume of goods crossing borders — even as those gains reached regions unevenly and coexisted with both a rival, rights-based order and, by the century\'s end, a newly globalized security concern. Contextualization situates the packet in the Bretton Woods institutions (the IMF and World Bank) and later the World Trade Organization, which built a rules-based framework for international trade after 1945, while decolonization added dozens of new sovereign states into a UN system built around universal rights and multilateral cooperation — together laying the institutional groundwork for the accelerating integration of the decades that followed. The body groups at least four documents around the thesis rather than summarizing them in order: the life-expectancy table\'s worldwide gain from 46 to 73 years, with Asia\'s +32-year gain the largest of the three regions shown against Europe\'s smaller +17 (Doc 1), and the ICT table\'s rise from about 11 million mobile subscriptions in 1990 to 8.26 billion in 2020, alongside internet use climbing from 15.6% of the world\'s population in 2005 to 60.1% in 2020 (Doc 2), together show globalization measurably transforming health and everyday communication, though unevenly across regions; the trade/container table\'s roughly twenty-two-fold rise in container throughput between 1980 and 2020, well outpacing the smaller nine-fold rise in nominal export value (Doc 3), shows the physical volume of globally-traded goods reaching everyday life even faster than raw trade figures suggest; the UDHR\'s insistence that its rights extend "whether it be independent, trust, non-self-governing or under any other limitation of sovereignty" (Doc 4) shows a rival, rights-based vision of a transformed world asserting itself alongside material change; and Bush\'s September 2001 address, framing the attacks as an act of war by "a radical network of terrorists, and every government that supports them" (Doc 5), shows that by the century\'s end globalization\'s transformations had extended into a shared, cross-border sense of security threat, not just material well-being. Outside evidence brings in the Green Revolution\'s high-yield wheat and rice varieties, associated with agronomist Norman Borlaug and credited with averting famine across much of South Asia in the 1960s-70s — a transformation of everyday nutrition none of the five documents themselves describe. Sourcing explains that the life-expectancy table (Doc 1) was compiled by the UN Population Division and deliberately ends its comparison at 2019 specifically to avoid the temporary COVID-19 mortality shock, so the health argument rests on long-run structural gains rather than a short-term crisis; that the trade/container table (Doc 3) explicitly notes its nominal-dollar figures mix real volume growth with decades of price and exchange-rate change, so an argument about physical trade growth should lean on the container-throughput figures; and that Bush\'s address (Doc 5) was delivered to a joint session of Congress and broadcast nationally and globally in the immediate aftermath of September 11, explaining why it pairs an urgent "act of war" framing with a deliberate, explicit message of respect to Muslims worldwide. Complexity is shown by weighing globalization\'s material transformations (Docs 1, 2, 3) against both a rights-based order asserting itself in the same era (Doc 4) and a globalized security concern that emerged by 2001 (Doc 5), and by corroborating very different document types — three data tables, an international declaration, a presidential address — against one another rather than treating "globalization transformed everyday life" as a single uniform verdict.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which globalization after 1945 transformed everyday life across regions) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a single unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt, offers a list with no line of reasoning ("globalization changed everyday life a lot"), or is not historically defensible.',
            modelResponse:
              'Globalization after 1945 transformed everyday life across regions to a substantial extent — raising life expectancy, spreading communications technology, and multiplying the volume of goods crossing borders — even as those gains reached regions unevenly and coexisted with both a rival, rights-based order and, by the century\'s end, a newly globalized security concern.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. the Bretton Woods institutions and later the WTO building a rules-based trade framework while decolonization added new states into a rights-oriented UN system. No credit (0/1) for a single vague, unsupported phrase ("the world got more connected") or context copied from a document without independent elaboration.',
            modelResponse:
              'The Bretton Woods institutions (the IMF and World Bank) and later the World Trade Organization built a rules-based framework for international trade after 1945, while decolonization added dozens of new sovereign states into a UN system built around universal rights and multilateral cooperation, together laying the institutional groundwork for the accelerating economic and technological integration of the following decades.',
          },
          {
            criterionId: 'C-doc-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST FOUR of the five documents, grouped to support the essay\'s line of reasoning (not summarized one at a time in isolation). 1/2: accurately describes the content of at least three documents, whether or not they clearly support an argument. 0/2: fewer than three documents used, or documents are misdescribed.',
            modelResponse:
              'The life-expectancy table\'s worldwide gain from 46 to 73 years, with Asia\'s +32-year gain the largest of the three regions shown (Doc 1), and the ICT table\'s rise from about 11 million mobile subscriptions in 1990 to 8.26 billion in 2020 (Doc 2), show globalization measurably transforming health and communication. The trade/container table\'s roughly twenty-two-fold rise in container throughput against a smaller nine-fold rise in nominal export value (Doc 3) shows the physical volume of trade reaching everyday life even faster than raw dollar figures suggest. The UDHR\'s insistence that rights extend "whether it be independent, trust, non-self-governing or under any other limitation of sovereignty" (Doc 4) shows a rival, rights-based vision asserting itself in the same era, while Bush\'s framing of "a radical network of terrorists, and every government that supports them" (Doc 5) shows globalization\'s transformations extending into a shared security concern by 2001.',
          },
          {
            criterionId: 'D-outside-evidence',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the five documents, relevant to the argument, and EXPLAINS its relevance (not just names it). No credit (0/1) for a vague reference with no specific evidence, or evidence that is simply named with no explanation of how it supports the thesis.',
            modelResponse:
              'The Green Revolution\'s high-yield wheat and rice varieties, associated with agronomist Norman Borlaug and credited with averting famine across much of South Asia in the 1960s-70s, show a transformation of everyday nutrition driven by globally-shared agricultural science — a change none of the five documents themselves describe.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date without explaining relevance to the argument.',
            modelResponse:
              'The life-expectancy table (Doc 1) was compiled by the UN Population Division and deliberately ends its comparison at 2019, specifically to avoid the temporary COVID-19 mortality shock, which explains why the health argument rests on long-run structural gains rather than a short-term crisis. The trade/container table (Doc 3) explicitly notes that its nominal-dollar figures mix real volume growth with decades of price and exchange-rate change, which explains why an argument about physical trade growth should lean on the container-throughput figures rather than the export-value figures alone. Bush\'s address (Doc 5) was delivered to a joint session of Congress and broadcast nationally and globally in the immediate aftermath of September 11, which explains why it pairs an urgent "act of war" framing with a deliberate, explicit message of respect to Muslims worldwide.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. explaining both the material AND the ideological/security dimensions of globalization\'s transformation of everyday life, corroborating multiple document types against each other, or explaining more than one variable — not from a single isolated clever sentence. No credit (0/1) if the essay treats "globalization transformed everyday life" as a single flat verdict with no qualification or comparison.',
            modelResponse:
              'What complicates a simple "globalization transformed everyday life everywhere the same way" narrative is that the same decades produced uneven regional health and communication gains (Docs 1, 2), a rival rights-based order asserting universal claims regardless of sovereignty status (Doc 4), and, by 2001, a newly globalized sense of security threat that a US president felt compelled to address alongside an explicit defense of Muslims\' standing (Doc 5) — corroborated across three data tables, a declaration, and a presidential address, showing globalization\'s transformation of everyday life was real, uneven, and multidimensional rather than a single uniform verdict.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3 in order.',
        'For sourcing, ask: why did THIS author/agency compile THIS document for THIS purpose or audience, and how does that explain what it emphasizes?',
        'Only use what a document actually says — the ICT table (Doc 2) never reports internet use for 1990 or 2000, so don\'t invent that figure; it belongs outside the packet entirely.',
        'The trade table (Doc 3) explicitly flags that its nominal-dollar figures are not the same as physical trade volume — use that scoping note rather than treating the dollar figure alone as "how much trade grew."',
      ],
      estimatedMinutes: 48,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The DBQ asks you to build YOUR OWN argument and use the documents (plus outside knowledge) as evidence — never summarize each document in its own paragraph.',
        'The 7-point rubric: Thesis (1); Contextualization (1); Evidence from the Documents (2, requires 4+ of 5 documents for full credit); Evidence Beyond the Documents (1, one explained outside fact); Sourcing (1, HIPP explained for 3+ documents); Complexity (1, earned holistically).',
        'Only attribute to a document what it actually says — the ICT table (Doc 2) has no internet-use figure before 2005, and the trade table (Doc 3) explicitly separates nominal-dollar growth from physical container-volume growth.',
        'A strong complexity move for this packet: globalization\'s material gains (Docs 1, 2, 3) were real but uneven, and coexisted with both a rights-based order (Doc 4) and, by 2001, a newly globalized security concern (Doc 5).',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '9',
    cedTopic: '9-DBQ',
    cedTitle: 'Unit 9 DBQ Practice — Globalization and Everyday Life',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Contextualization 1 / Evidence-Documents 2 / Evidence-Beyond 1 / Sourcing 1 / Complexity 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-life-expectancy-table.v1',
        chapter: '1950-2019',
        note: 'World and Regional Life Expectancy at Birth data table — Document 1 of the five-document Unit-9 packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-ict-table.v1',
        chapter: '1990-2020',
        note: 'Global Mobile-Phone and Internet Adoption data table — Document 2 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-trade-container-table.v1',
        chapter: '1980-2020',
        note: 'World Container Port Throughput and Merchandise Export Value data table — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-udhr.v1',
        chapter: '1948',
        note: 'Universal Declaration of Human Rights, Preamble and Articles 1-2 (REUSED from Unit 8) — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-bush-sept-2001.v1',
        chapter: '2001',
        note: 'Bush, Address Before a Joint Session of Congress on the Response to the September 11 Attacks (REUSED from APUSH) — Document 5 of the packet.',
      },
    ],
  },
};
