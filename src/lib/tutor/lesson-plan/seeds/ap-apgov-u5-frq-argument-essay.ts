/**
 * AP US Government & Politics — Unit 5 FRQ Practice: Argument Essay
 * (AP Gov FRQ 4) — the longest AP Gov free-response format, 6 points,
 * scored against a document packet of three foundational documents.
 *
 * Format (per the authentic AP Gov Argument Essay FRQ): a prompt asking
 * the student to develop an argument, plus a packet of foundational
 * documents to choose evidence from. The real AP directions: articulate a
 * defensible thesis that establishes a line of reasoning; support it with
 * at least TWO pieces of specific and relevant evidence, with AT LEAST ONE
 * piece drawn from the foundational document list; use reasoning to
 * explain why/how the evidence supports the thesis; and respond to an
 * opposing or alternative perspective (refutation, concession, or
 * rebuttal).
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..3 for the grader in array order):
 *   1. Federalist No. 10 (Madison, 1787) — evelyn.passage.apush-federalist-10.v1
 *   2. Brutus No. 1 (1787) — evelyn.passage.apush-brutus-1.v1
 *   3. Articles of Confederation (1781) — evelyn.passage.apgov-articles-confederation.v1
 * Documents 1 and 2 are APUSH-owned seeds; Document 3 is the AP Gov Unit-2
 * backfill seed (Task 1), read here for document fidelity and reused as-is
 * (no source content was modified).
 *
 * DOCUMENT FIDELITY (guarded, per the AP Plans Initiative gotcha review):
 * the Federalist 10 excerpt seeded here is ONLY Madison's definition of a
 * faction ("a number of citizens... united and actuated by some common
 * impulse of passion, or of interest, adverse to the rights of other
 * citizens, or to the permanent and aggregate interests of the
 * community") — it does NOT include Madison's separate "extend the
 * sphere" argument, which lives in a later, unseeded paragraph. The
 * Brutus 1 excerpt seeded here is the historical claim that no free
 * republic has governed a territory as large as the United States,
 * illustrated by the Greek and Roman republics turning tyrannical once
 * they expanded over large territories. The Articles of Confederation
 * excerpt seeded here covers Article II (states retain sovereignty except
 * what is expressly delegated), Article III ("a firm league of
 * friendship"), Article VIII (no federal taxing power — expenses
 * requisitioned from the states), and Article XIII (unanimous state
 * consent required to amend) — nothing below cites content beyond what
 * these three excerpts actually contain.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U5_FRQ_ARGUMENT_ESSAY: LessonPlan = {
  id: 'evelyn.ap.apgov.u5-frq-argument-essay.v1',
  title: 'Unit 5 FRQ Practice — Argument Essay',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u5-frq-argument-essay',
      description:
        'Write a complete AP Gov Argument Essay from a three-document foundational-document packet (Federalist No. 10, Brutus No. 1, and the Articles of Confederation) arguing whether political parties strengthen or weaken American democracy — a defensible thesis with a line of reasoning; at least two pieces of specific, relevant evidence with at least one drawn from the foundational documents; reasoning explaining why the evidence supports the thesis; and a response to an opposing or alternative perspective — scored against the authentic AP Gov 6-point Argument Essay rubric.',
      standard: 'AP-APGOV-5-FRQ-ARG',
    },
  ],
  prerequisites: ['apgov.political-parties'],
  followUps: [],
  estimatedMinutes: 42,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of the longest, highest-point AP Gov FRQ concrete for a parties-strengthen-or-weaken-democracy argument, and name the single biggest scoring trap: dropping a quotation into the essay without ever explaining why it supports the thesis.',
      script:
        "The last of the four AP Gov free-response questions is also the biggest: the Argument Essay, worth 6 points — more than any other single FRQ. You'll get a prompt and a packet of foundational documents to draw evidence from, but the task is NOT to summarize what the documents say. It's to build your OWN argument — here, about whether political parties strengthen or weaken American democracy — and use the documents plus your own knowledge as evidence, explain WHY that evidence actually supports your claim, and respond to someone who'd disagree. The single biggest way students lose points here is dropping in a strong quotation and never explaining the logical connection between the quote and the thesis. Today you'll write one complete Argument Essay using three founding-era documents — Madison's Federalist No. 10, the Anti-Federalist Brutus No. 1, and the Articles of Confederation — and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-argument-essay-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the Argument Essay task asks for and how the 6-point rubric awards points, row by row, using the three-document Unit-5 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get a packet of foundational documents (here, three) and a prompt asking you to develop an argument. Build YOUR OWN claim in response to the prompt, then use the documents (at least one required) plus reasoning to support it — the format rewards a tight, well-reasoned argument over a long essay that merely quotes documents without connecting them to a claim.',
        'ROW A — THESIS (0-1 point): full credit requires a thesis that makes a defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not an unsupported assertion with no reasoning attached.',
        'ROW B — EVIDENCE, RELEVANT (0-1 point): full credit requires at least ONE piece of specific, relevant evidence that supports the thesis — a quotation or accurate paraphrase, not a vague gesture at a document\'s general topic.',
        'ROW C — EVIDENCE, FOUNDATIONAL DOCUMENT (0-1 point): full credit requires that AT LEAST ONE of the essay\'s pieces of evidence is drawn specifically from the assigned foundational-document packet (here: Federalist No. 10, Brutus No. 1, or the Articles of Confederation) — attributed only to what that document\'s excerpt actually contains, never more.',
        'ROW D — EVIDENCE, SECOND PIECE (0-1 point): full credit requires a SECOND piece of specific, relevant evidence, distinct from the first — this can be a different foundational document or specific outside knowledge, not a restatement of the first piece of evidence in different words.',
        'ROW E — REASONING (0-1 point): full credit requires explicitly explaining WHY or HOW the evidence supports the thesis — the logical connection, not just evidence and thesis sitting side by side. This is the row students lose most often.',
        'ROW F — ALTERNATIVE OR OPPOSING PERSPECTIVE (0-1 point): full credit requires identifying a specific opposing or alternative perspective — grounded in something real, like another document\'s argument or a historical counterexample — and responding to it through refutation, concession, or rebuttal, not just noting that disagreement exists.',
        'Total = 6 points, one per row, summed — the authentic AP Gov Argument Essay scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-argument-essay',
      kind: 'try_yourself',
      problem:
        "Develop an argument about whether political parties strengthen or weaken American democracy.\n\nUse the documents below. In your response you should do the following: (1) respond to the prompt with a defensible thesis or claim that establishes a line of reasoning, (2) support your thesis with at least TWO pieces of specific and relevant evidence, with AT LEAST ONE piece of evidence coming from one of the foundational documents listed (Federalist No. 10, Brutus No. 1, or the Articles of Confederation) — a second piece of evidence can come from another foundational document or from your own knowledge, (3) use reasoning to explain why or how the evidence you provided supports your thesis, and (4) respond to an opposing or alternative perspective using refutation, concession, or rebuttal.",
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apush-federalist-10.v1',
        'evelyn.passage.apush-brutus-1.v1',
        'evelyn.passage.apgov-articles-confederation.v1',
      ],
      expectedAnswer:
        "A full-credit response opens with a thesis arguing that political parties, on balance, weaken American democracy because they function as organized factions that elevate partisan loyalty above the community's shared, lasting interests. As evidence, the essay quotes Federalist No. 10 (Document 1): Madison defines a faction as \"a number of citizens, whether amounting to a majority or a minority of the whole, who are united and actuated by some common impulse of passion, or of interest, adverse to the rights of other citizens, or to the permanent and aggregate interests of the community.\" This is the essay's required foundational-document evidence: modern political parties fit this definition closely, since each party unites citizens around a shared partisan interest that can, at times, run adverse to the \"permanent and aggregate interests\" of the whole political community. A second, distinct piece of evidence draws on the Articles of Confederation (Document 3): under the Articles, \"each state retain[ed] its sovereignty, freedom and independence\" (Article II), the states formed only \"a firm league of friendship\" rather than a true national government (Article III), Congress had no power to tax and had to requisition funds from the states (Article VIII), and any amendment required unanimous consent of every state legislature (Article XIII). This shows that in the pre-party founding era, the country's central weakness was a lack of any mechanism to unite disparate state interests toward common national action — a problem the Constitution itself solved through structural changes (majority-rule amendment, direct taxing power), not through political parties, which arose only afterward. Reasoning ties both pieces of evidence to the thesis: Madison's faction warning shows that an organized political group's interest can diverge from the community's lasting interest, and the Articles' example shows that the Constitution, not parties, was what actually solved the founding era's central coordination problem — together suggesting that parties' main historical contribution has been to reintroduce, in organized and durable form, the very factional dynamic Madison warned against, layered onto a governmental structure that no longer strictly needed them to function. Finally, the essay responds to an opposing perspective drawn from Brutus No. 1 (Document 2): Brutus warned that \"history furnishes no example of a free republic, any thing like the extent of the United States,\" observing that the Grecian and Roman republics, once they \"extended their conquests over large territories of country,\" saw their governments \"changed from that of free governments to those of the most tyrannical that ever existed in the world\" — a warning that a republic spread across such a vast territory struggles to hold together as a genuinely free, accountable government at all. One could argue that national political parties are exactly the institutional answer to Brutus's concern: by organizing shared political identities, platforms, and turnout drives across every region of a large country, parties give citizens spread over immense distances a way to act together and hold officeholders accountable, addressing the very scale problem Brutus identified. The essay concedes that this organizing, coordinating function is real and valuable. But it rebuts that solving Brutus's scale problem does not erase Madison's faction problem — parties may have given a vast republic a way to organize collective action, but in doing so they reintroduced, in institutionalized and enduring form, the very factional dynamic Madison warned could set citizens' passions and interests against the community's permanent, aggregate good, so the net effect remains a weakening rather than strengthening of democratic government.",
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a defensible claim that responds to the prompt (whether political parties strengthen or weaken American democracy) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not defensible.',
            modelResponse:
              "Political parties, on balance, weaken American democracy because they function as organized factions that elevate partisan loyalty above the community's shared, lasting interests.",
          },
          {
            criterionId: 'B-evidence-relevant',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): at least one piece of specific, relevant evidence (quoted or accurately paraphrased) that supports the thesis. No credit (0/1) for a vague reference to a document\'s general topic with no specific content cited.',
            modelResponse:
              'Federalist No. 10 defines a faction as "a number of citizens, whether amounting to a majority or a minority of the whole, who are united and actuated by some common impulse of passion, or of interest, adverse to the rights of other citizens, or to the permanent and aggregate interests of the community" — a definition modern political parties fit closely, since each unites citizens around a shared partisan interest that can run adverse to the community\'s lasting interests.',
          },
          {
            criterionId: 'C-evidence-foundational-doc',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): at least one piece of evidence is drawn specifically from the assigned foundational-document packet (Federalist No. 10, Brutus No. 1, or the Articles of Confederation), attributed only to what that document\'s excerpt actually contains. No credit (0/1) if no evidence is drawn from the packet, or if a document is cited for content beyond what its excerpt contains.',
            modelResponse:
              "The faction-definition evidence is drawn directly from Federalist No. 10, one of the three assigned foundational documents, satisfying the requirement that at least one piece of evidence come from the document packet.",
          },
          {
            criterionId: 'D-evidence-second',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): a second, distinct piece of specific, relevant evidence — a different foundational document or specific outside knowledge — not a restatement of the first piece of evidence. No credit (0/1) for repeating the first piece of evidence in different words, or for a second piece that is vague or not relevant to the thesis.',
            modelResponse:
              "A second, distinct piece of evidence comes from the Articles of Confederation (Document 3): the states retained individual sovereignty (Article II), formed only \"a firm league of friendship\" (Article III), Congress had no taxing power and relied on state requisitions (Article VIII), and amendment required unanimous state consent (Article XIII) — showing the founding era's core weakness was a lack of any mechanism to unite disparate state interests, a problem the Constitution's structural changes, not political parties, actually solved.",
          },
          {
            criterionId: 'E-reasoning',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explicitly explains WHY or HOW the evidence supports the thesis — the logical connection between the specific evidence and the specific claim, not evidence and thesis merely placed side by side. No credit (0/1) for evidence presented with no explanation of its relevance to the thesis.',
            modelResponse:
              "Madison's faction warning shows that an organized political group's interest can diverge from the community's lasting interest, and the Articles' example shows that the Constitution, not parties, actually solved the founding era's central coordination problem — together suggesting that parties' main historical contribution has been to reintroduce, in organized and durable form, the very factional dynamic Madison warned against, layered onto a structure that no longer strictly needed them to function.",
          },
          {
            criterionId: 'F-alternative-perspective',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): identifies a specific opposing or alternative perspective — grounded in real evidence, such as another packet document\'s argument or a historical episode that cuts against the thesis — and responds to it through refutation, concession, or rebuttal. No credit (0/1) for merely noting that disagreement exists with no specific grounding or no response to it.',
            modelResponse:
              "Brutus No. 1 warns that \"history furnishes no example of a free republic, any thing like the extent of the United States,\" noting that the Grecian and Roman republics, once they \"extended their conquests over large territories of country,\" saw their governments \"changed from that of free governments to those of the most tyrannical that ever existed in the world\" — suggesting parties could instead be seen as the institutional answer to this scale problem, organizing shared political identities across a vast country and giving citizens a way to hold officeholders accountable. This is answered by conceding that this organizing function is real, but rebutting that solving Brutus's scale problem does not erase Madison's faction problem — parties reintroduced, in institutionalized form, the very factional dynamic Madison warned against, so the net effect remains a weakening rather than strengthening of democratic government.",
          },
        ],
      },
      hints: [
        'Pick ONE clear thesis and build the whole essay around it — don\'t hedge with a list of unconnected claims.',
        'At least one piece of evidence MUST come from the three-document packet; a second piece can be another document or your own outside knowledge.',
        'Evidence without reasoning earns partial credit at best — always explain WHY the evidence you cite actually supports your thesis.',
        'For the alternative-perspective row, use a real counterexample (like Brutus No. 1\'s warning about large-territory republics) and directly answer it — don\'t just mention that "some might disagree."',
        'Federalist No. 10\'s excerpt here is ONLY Madison\'s definition of a faction — do not attribute the separate "extend the sphere" argument to this excerpt; it is not part of the seeded passage.',
      ],
      estimatedMinutes: 32,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Argument Essay is 6 points across six rows: Thesis (1); Evidence-Relevant (1); Evidence-Foundational Document (1, at least one piece from the packet); Evidence-Second (1, a second distinct piece); Reasoning (1, explain WHY the evidence supports the thesis); Alternative Perspective (1, respond to a real objection).',
        'Evidence without reasoning is the single biggest way to lose points — always connect the quotation back to the thesis explicitly.',
        'Federalist No. 10\'s definition of faction — a group "united and actuated by some common impulse of passion, or of interest, adverse to... the permanent and aggregate interests of the community" — is strong evidence that organized political groups, including parties, can diverge from the common good.',
        'The Articles of Confederation\'s weak central government (no taxing power, unanimous amendment, mere "league of friendship") shows the founding era\'s coordination problem was solved by the Constitution\'s structure, not by parties, which arose afterward.',
        'Brutus No. 1\'s warning that free republics have never governed so large a territory, and that the Greek and Roman republics turned tyrannical once they expanded, is a strong opposing perspective — parties as a scale-spanning coordination tool — that a "parties weaken democracy" thesis must concede and rebut.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5-FRQ-ARG',
    cedTitle: 'Unit 5 FRQ Practice — Argument Essay',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics Argument Essay free-response task wording and 6-point rubric (Thesis 1 / Evidence-Relevant 1 / Evidence-Foundational-Doc 1 / Evidence-Second 1 / Reasoning 1 / Alternative Perspective 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-federalist-10.v1',
        chapter: '1787',
        note: 'Federalist No. 10 (Madison) — Document 1 of the three-document packet (APUSH-owned seed, reused for this AP Gov essay); excerpt is Madison\'s definition of a faction only.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-brutus-1.v1',
        chapter: '1787',
        note: 'Brutus No. 1 — Document 2 of the packet (APUSH-owned seed, reused for this AP Gov essay).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-articles-confederation.v1',
        chapter: '1781',
        note: 'Articles of Confederation — Document 3 of the packet (AP Gov Unit-2 backfill seed, Task 1).',
      },
    ],
  },
};
