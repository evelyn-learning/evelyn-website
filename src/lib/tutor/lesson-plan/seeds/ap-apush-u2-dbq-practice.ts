/**
 * AP US History — Period 2 DBQ Practice: the full Document-Based Question
 * essay (AP APUSH Free-Response Question 1), a five-document packet.
 *
 * This is the essay-practice plan that closes out the Period-2 content arc
 * (colonial regions 2.2-2.3, the transatlantic economy 2.4, slavery in the
 * colonies 2.6, colonial society and culture 2.5/2.7): students write ONE
 * complete DBQ essay under real AP exam conditions, using a genuine
 * five-document packet, and are scored against the authentic AP APUSH
 * 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..5 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. The Mayflower Compact (1620) —
 *      evelyn.passage.apush-mayflower-compact.v1
 *   2. John Winthrop, "A Model of Christian Charity" (1630) —
 *      evelyn.passage.apush-winthrop-charity.v1
 *   3. Nathaniel Bacon, "Declaration of the People" (1676) —
 *      evelyn.passage.apush-bacon-declaration.v1
 *   4. Olaudah Equiano, "The Interesting Narrative" (1789) —
 *      evelyn.passage.apush-equiano.v1
 *   5. Jonathan Edwards, "Sinners in the Hands of an Angry God" (1741) —
 *      evelyn.passage.apush-edwards-sinners.v1
 *
 * DOCUMENT FIDELITY NOTE: Document 1 (Mayflower Compact) verbatim-anchors
 * only the compact's own operative text — the signers covenanting into a
 * "civil Body Politick" and pledging obedience to "just and equal Laws" they
 * would themselves frame — not the later Plymouth colony's full history.
 * Document 2 (Winthrop) reads "citty upon a hill" and "The eies of all
 * people are uppon us" (Hanover-transcription early-modern orthography),
 * never modernized to "city upon a hill." Document 3 (Bacon) is the
 * declaration's opening grievance clauses only — unjust taxation for
 * "private favorites," corrupt magistrates, Berkeley's Beaver-trade
 * monopoly, and his failure to act against Native raids — not the
 * rebellion's later burning of Jamestown, which is used below only as the
 * student's own outside evidence. Document 4 (Equiano) covers only his
 * first sight of the slave ship, physical inspection, and psychological
 * terror on deck — it does NOT describe conditions belowdecks during the
 * ocean crossing itself, which this plan does not attribute to the excerpt.
 * Document 5 (Edwards) reads "flung the door of mercy wide open" (not
 * "thrown").
 *
 * The teaching point is the DBQ TASK itself — thesis, contextualization,
 * document evidence, outside evidence, sourcing (HIPP), and complexity —
 * not new historical content; all quotes are the short, already-seeded
 * excerpts used elsewhere in the Period-2 catalog.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U2_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u2-dbq-practice.v1',
  title: 'Period 2 DBQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u2-dbq-practice',
      description:
        'Write a complete AP APUSH Document-Based Question essay from a five-document Period-2 packet — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP APUSH 7-point DBQ rubric.',
      standard: 'AP-APUSH-2-DBQ',
    },
  ],
  prerequisites: [
    'apush.colonial-regions',
    'apush.transatlantic-economy',
    'apush.slavery-colonies',
    'apush.colonial-society',
  ],
  followUps: [],
  estimatedMinutes: 58,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "Everything you've learned about Period 2 — the different regional colonial societies, the transatlantic economy that tied them to Britain, the shift toward race-based slavery, and colonial society's own religious and political culture — exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP US History exam, scored on the authentic 7-point rubric: Thesis (1), Contextualization (1), Evidence from the Documents (2), Evidence Beyond the Documents (1), Sourcing (1), and Complexity (1). You'll get five documents spanning 1620 to 1789. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument and use the documents, plus what you already know, as evidence for it. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the five-document Period-2 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get five documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph ("Document 1 says X. Document 2 says Y.") instead of grouping documents around a claim.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not a simple list of "the colonies were different in some ways." A strong thesis for this packet might argue that colonial societies developed political self-governance, religious practices, and a race-based labor system all substantially distinct from England, even as most colonists continued to see themselves as loyal English subjects.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing how England\'s colonization proceeded through many separately chartered, geographically scattered settlements governed with only loose, distant oversight from London — in AT LEAST a full sentence of specific description, not a single vague phrase like "England had colonies."',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0–2 points): 1 point for accurately describing the content of at least two documents; the full 2 points require using the content of AT LEAST FOUR of the five documents to SUPPORT the thesis\'s argument (the authentic full-credit threshold for a five-document packet) — e.g. grouping the Mayflower Compact (Doc 1) and Bacon\'s Declaration (Doc 3) as evidence of colonists asserting their own political authority; Winthrop\'s covenant sermon (Doc 2) and Edwards\'s revivalist preaching (Doc 5) as evidence of distinctly colonial religious practices with no close English counterpart; and Equiano\'s account (Doc 4) as evidence of the race-based slave labor system the colonial economy built.',
        'ROW D — EVIDENCE BEYOND THE DOCUMENTS (0–1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the five documents, relevant to the argument and explained (not just named) — e.g. Virginia\'s House of Burgesses (founded 1619), which developed real governing power over local taxation and legislation over the colonial era, reinforced by Britain\'s policy of loosely enforcing the Navigation Acts (the origin of salutary neglect) — a transformation none of the five documents describe directly.',
        'ROW E — SOURCING (0–1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. the Mayflower Compact (Doc 1) was drafted and signed by the passengers themselves before landing, at a site outside the jurisdiction of their original charter, which explains why it invents its own source of governing authority rather than simply invoking the king\'s existing colonial charter; Bacon\'s Declaration (Doc 3) was issued during an armed uprising against a specific royally appointed governor to rally fellow colonists, which explains why its grievances are local and administrative rather than a challenge to the English Crown itself; Equiano\'s narrative (Doc 4), published in London in 1789 for a British readership engaged in the parliamentary debate over abolishing the slave trade, explains its vivid, restrained, first-person account of terror rather than trade statistics.',
        'ROW F — COMPLEXITY (0–1 point): earned holistically for a nuanced argument that does things like explain both continuity AND change, corroborate multiple document types (a founding covenant, a sermon, a rebel\'s declaration, a memoir, a revivalist sermon) against each other, or explain multiple variables (e.g. that colonial self-governance and religious practice diverged sharply from England even as the colonial economy grew more, not less, entangled with England through the slave trade and Atlantic commerce) — earned through the essay\'s overall argument, not from one clever sentence in isolation.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP APUSH DBQ scale, distinct from the AP Lang 6-point rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the five documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which British North American colonial societies developed distinct from England in the period 1607–1754." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least four of the five documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apush-mayflower-compact.v1',
        'evelyn.passage.apush-winthrop-charity.v1',
        'evelyn.passage.apush-bacon-declaration.v1',
        'evelyn.passage.apush-equiano.v1',
        'evelyn.passage.apush-edwards-sinners.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that British colonial societies developed political self-governance, religious practices, and a race-based labor system all substantially distinct from England, even as most colonists continued to think of themselves as loyal English subjects, or a comparably defensible complex claim with a clear line of reasoning. Contextualization situates the packet in England\'s dispersed style of colonization: rather than one centrally administered empire, individual colonies were founded under separate charters, scattered along a long and climatically varied coastline, and governed with only loose, slow oversight from London across an ocean crossing that took weeks — conditions that let distinct local institutions take root from the earliest years of settlement. The body groups at least four documents around the thesis rather than summarizing them in order: the Mayflower Compact\'s signers, having landed outside the jurisdiction of their original charter, covenanted together into a "civil Body Politick" and promised obedience to "just and equal Laws" they would themselves frame (Doc 1), and decades later Bacon\'s Declaration shows colonists directly contesting a royally appointed governor\'s specific conduct — unjust taxes "for the advancement of private favorites," corrupt magistrates, and Berkeley\'s Beaver-trade monopoly (Doc 3) — together showing a political culture willing to assert and even violently contest its own governing authority in ways England\'s more centralized political structure rarely produced at home. Winthrop\'s 1630 covenant sermon, warning the Massachusetts Bay settlers they would be watched as a "citty upon a hill" with "the eies of all people… uppon us" (Doc 2), and Edwards\'s 1741 revivalist preaching, urging listeners to "awake and fly from the wrath to come" (Doc 5), together show the colonies developing distinctly emotional, communal, and mass religious practices — first a covenant-community self-conception, later an outdoor revivalist awakening — with no close counterpart in England\'s more formal established church. Equiano\'s account of being "handled and tossed up to see if I were sound" upon first boarding a slave ship (Doc 4) is evidence of the race-based, hereditary chattel-slavery system the colonial economy built and increasingly depended on by the 18th century. Outside evidence brings in Virginia\'s House of Burgesses, founded in 1619 and predating even the Mayflower Compact, which developed real practical authority over local taxation and legislation across the colonial era — a formal legislative expression of self-government that none of the five documents describe directly, made possible by Britain\'s decades-long pattern of loosely enforcing the Navigation Acts (the origin of what became known as salutary neglect). Sourcing explains that the Mayflower Compact (Doc 1) was drafted and signed by the passengers themselves, before landing, at a site outside the jurisdiction their original Virginia Company charter covered, which explains why the document invents its own source of governing authority rather than simply invoking the king\'s existing charter; that Bacon\'s Declaration (Doc 3) was issued in the middle of an armed uprising against Governor Berkeley specifically, meant to rally fellow colonists against a named local official, which explains why its grievances are local and administrative (taxes, monopolies, frontier defense) rather than a challenge to the English Crown itself; and that Equiano\'s narrative (Doc 4), published in London in 1789 for a British reading public actively debating whether to abolish the transatlantic slave trade, explains its vivid, deliberately restrained first-person account of terror and dehumanization — testimony meant to move readers, not a trade ledger. Complexity is shown by weighing this growing colonial distinctiveness against a genuine continuity: colonists kept framing their own self-assertions in loyal, English terms — the Mayflower Compact still names its signers "the Loyal Subjects of our dread Sovereign Lord King James," and Bacon\'s Declaration frames itself as defending "his Majesties" interest against corrupt local officials, not rejecting the Crown — showing that political and religious distinctiveness grew WITHIN a framework of continued nominal loyalty to England, even as, on the economic side, the colonies\' growing dependence on race-based slavery deepened rather than loosened their entanglement with English trade, shipping, and capital.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which colonial societies developed distinct from England, 1607-1754) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a list with no line of reasoning ("the colonies were different in some ways"). No credit (0/1) for a thesis that only restates the prompt, offers an unsupported list, or is not historically defensible.',
            modelResponse:
              'British colonial societies developed political self-governance, religious practices, and a race-based labor system all substantially distinct from England, even though most colonists continued to see themselves as loyal English subjects throughout the period.',
          },
          {
            criterionId: 'B-contextualization',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. England\'s dispersed, separately chartered colonization, governed with only loose oversight from London across a multi-week ocean crossing. No credit (0/1) for a single vague, unsupported phrase ("England had colonies") or context copied from a document without independent elaboration.',
            modelResponse:
              'Rather than one centrally administered empire, England\'s American colonies were founded under separate charters — proprietary, royal, and joint-stock — scattered along a coastline spanning very different climates, and governed with only loose, slow oversight from London across an ocean crossing that took weeks, conditions that let distinct local institutions and practices take root almost from the moment of settlement.',
          },
          {
            criterionId: 'C-evidence-documents',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST FOUR of the five documents, grouped to support the essay\'s line of reasoning (not summarized one at a time in isolation) — the authentic full-credit threshold for a five-document packet. 1/2: accurately describes the content of at least two documents, whether or not they clearly support an argument. 0/2: fewer than two documents used, or documents are misdescribed.',
            modelResponse:
              'The Mayflower Compact\'s signers, landing outside their charter\'s jurisdiction, covenanted into a "civil Body Politick" bound by "just and equal Laws" of their own framing (Doc 1), and Bacon\'s Declaration shows colonists directly contesting a royal governor\'s specific conduct — unjust taxes "for the advancement of private favorites" and Berkeley\'s Beaver-trade monopoly (Doc 3) — together showing colonists asserting and even violently contesting their own governing authority. Winthrop\'s covenant sermon, warning Massachusetts Bay it would be watched as a "citty upon a hill" (Doc 2), and Edwards\'s revivalist call to "awake and fly from the wrath to come" (Doc 5), show the colonies developing distinctly communal and emotional religious practices. Equiano\'s account of being "handled and tossed up to see if I were sound" (Doc 4) shows the colonial economy\'s dependence on race-based chattel slavery.',
          },
          {
            criterionId: 'D-evidence-beyond',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the five documents, relevant to the argument, and EXPLAINS its relevance (not just names it). No credit (0/1) for a vague reference with no specific evidence, or evidence that is simply named with no explanation of how it supports the thesis.',
            modelResponse:
              'Virginia\'s House of Burgesses, founded in 1619 and predating even the Mayflower Compact, developed real practical authority over local taxation and legislation across the colonial era — a formal, ongoing legislative expression of self-government that none of the five documents describe, made possible by Britain\'s decades-long pattern of loosely enforcing the Navigation Acts, the origin of what became known as salutary neglect.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date without explaining relevance to the argument.',
            modelResponse:
              'The Mayflower Compact (Doc 1) was drafted and signed by the passengers themselves, before landing, at a site outside the jurisdiction their original charter covered, which explains why it invents its own source of governing authority rather than invoking the king\'s existing colonial charter. Bacon\'s Declaration (Doc 3) was issued in the middle of an armed uprising against Governor Berkeley specifically, meant to rally fellow colonists against a named local official, which explains why its grievances are local and administrative rather than a challenge to the English Crown itself. Equiano\'s narrative (Doc 4), published in London in 1789 for a British public actively debating abolition of the slave trade, explains its vivid, restrained first-person account of terror and dehumanization, meant to move readers rather than catalog trade statistics.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. explicitly weighing continuity against change, corroborating multiple document types against each other, or explaining more than one variable (here, growing political/religious distinctiveness alongside deepening economic entanglement with England) — not from a single isolated clever sentence. No credit (0/1) if the essay treats "distinctness" as a single flat verdict with no qualification or comparison.',
            modelResponse:
              'What complicates a simple "the colonies grew apart from England" narrative is that this distinctiveness developed WITHIN a framework of continued nominal loyalty: the Mayflower Compact still names its signers "the Loyal Subjects of our dread Sovereign Lord King James," and Bacon frames his uprising as defending "his Majesties" own interest against corrupt local officials, not rejecting the Crown — while, on the economic side, the same period saw the colonies grow MORE, not less, entangled with England through the transatlantic slave trade and Atlantic commerce, showing political/religious distinctiveness and economic dependence advancing side by side rather than as a single uniform drift away from England.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3, then 4, then 5 in order.',
        'For sourcing, ask: why did THIS author write THIS document for THIS audience, and how does that explain what it argues?',
        'Your outside-evidence fact should come from your own knowledge of the period (e.g. the House of Burgesses, salutary neglect), not be paraphrased from one of the five documents.',
        'Document 4 (Equiano) only verbatim-supports his own boarding/inspection/terror — the ocean-crossing conditions belowdecks are not in this excerpt.',
        'A strong complexity move is contrasting growing colonial political/religious distinctiveness with continued nominal loyalty to the Crown and deepening economic ties through the slave trade.',
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
        'Document 4 (Equiano) only verbatim-anchors his boarding, inspection, and terror on deck — not the crossing itself.',
        'A strong complexity move for this packet: colonial political/religious distinctiveness grew alongside continued nominal loyalty to the Crown and deepening economic entanglement with England through slavery.',
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
    cedTitle: 'Period 2 DBQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Contextualization 1 / Evidence-Documents 2 / Evidence-Beyond 1 / Sourcing 1 / Complexity 1), adapted to a five-document packet (4+ documents for full Row C credit).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-mayflower-compact.v1',
        chapter: '1620',
        note: 'The Mayflower Compact — Document 1 of the five-document Period-2 packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-winthrop-charity.v1',
        chapter: '1630',
        note: 'John Winthrop, "A Model of Christian Charity" — Document 2 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-bacon-declaration.v1',
        chapter: '1676',
        note: 'Nathaniel Bacon, "Declaration of the People" — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-equiano.v1',
        chapter: '1789',
        note: 'Olaudah Equiano, "The Interesting Narrative" — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-edwards-sinners.v1',
        chapter: '1741',
        note: 'Jonathan Edwards, "Sinners in the Hands of an Angry God" — Document 5 of the packet.',
      },
    ],
  },
};
