/**
 * AP US Government & Politics — Unit 1 FRQ Practice: Argument Essay
 * (AP Gov FRQ 4) — the longest AP Gov free-response format, 6 points,
 * scored against a document packet of five foundational documents.
 *
 * Format (per the authentic AP Gov Argument Essay FRQ): a prompt asking
 * the student to develop an argument, plus a packet of (typically five)
 * foundational documents to choose evidence from. The real AP directions:
 * articulate a defensible thesis that establishes a line of reasoning;
 * support it with at least TWO pieces of specific and relevant evidence,
 * with AT LEAST ONE piece drawn from the foundational document list; use
 * reasoning to explain why/how the evidence supports the thesis; and
 * respond to an opposing or alternative perspective (refutation,
 * concession, or rebuttal).
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..5 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. Declaration of Independence (1776), preamble —
 *      evelyn.passage.apush-declaration.v1
 *   2. Preamble to the U.S. Constitution (1787) —
 *      evelyn.passage.apush-constitution-preamble.v1
 *   3. Federalist No. 10 (1787), Madison's definition of a faction —
 *      evelyn.passage.apush-federalist-10.v1
 *   4. Brutus No. 1 (1787), the size-of-a-free-republic argument —
 *      evelyn.passage.apush-brutus-1.v1
 *   5. Federalist No. 51 (1788), the full two-paragraph excerpt —
 *      evelyn.passage.apgov-federalist-51.v1
 *
 * DOCUMENT FIDELITY (guarded, per the AP Plans Initiative gotcha review):
 * every quotation below is checked byte-exact against each document's
 * seeded fullText. The Declaration excerpt ends at "...consent of the
 * governed" — it does NOT contain the "alter or abolish" clause, so
 * nothing here attributes that language to it. The Federalist No. 10
 * excerpt is ONLY Madison's definition of a faction — it does NOT contain
 * the separate "extend the sphere" large-republic argument, so nothing
 * here attributes that to it (Federalist 10 is available in the packet
 * but is not used as evidence in the model response below; a student
 * response using it must stay within what the excerpt actually defines).
 * The Brutus No. 1 excerpt is used as the opposing perspective, quoted
 * only through "...to those of the most tyrannical that ever existed in
 * the world" — its actual seeded ending. The Federalist No. 51 excerpt
 * (both paragraphs — "ambition must be made to counteract ambition" and
 * the "double security" compound-republic argument) is quoted verbatim
 * where quoted. The veto-override and judicial-review evidence in part D
 * is the student's OWN outside knowledge (from the separation-of-powers
 * content plan), explicitly not drawn from any of the five documents.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U1_FRQ_ARGUMENT_ESSAY: LessonPlan = {
  id: 'evelyn.ap.apgov.u1-frq-argument-essay.v1',
  title: 'Unit 1 FRQ Practice — Argument Essay',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u1-frq-argument-essay',
      description:
        "Write a complete AP Gov Argument Essay from a five-document Unit-1 foundational-document packet — a defensible thesis with a line of reasoning; at least two pieces of specific, relevant evidence with at least one drawn from the foundational documents; reasoning explaining why the evidence supports the thesis; and a response to an opposing or alternative perspective — scored against the authentic AP Gov 6-point Argument Essay rubric.",
      standard: 'AP-APGOV-1-FRQ-ARG',
    },
  ],
  prerequisites: ['apgov.democratic-ideals', 'apgov.constitution-ratification', 'apgov.separation-of-powers'],
  followUps: [],
  estimatedMinutes: 42,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of the longest, highest-point AP Gov FRQ concrete, and name the single biggest scoring trap: dropping a quotation into the essay without ever explaining why it supports the thesis.',
      script:
        "The last of the four AP Gov free-response questions is also the biggest: the Argument Essay, worth 6 points — more than any other single FRQ. You'll get a prompt and a packet of foundational documents to draw evidence from, but the task is NOT to summarize what the documents say. It's to build your OWN argument and use the documents — plus your own knowledge — as evidence for it, then explain WHY that evidence actually supports your claim, and respond to someone who'd disagree. The single biggest way students lose points here is dropping in a strong quotation and never explaining the logical connection between the quote and the thesis — evidence without reasoning earns much less credit than evidence WITH reasoning attached. Today you'll write one complete Argument Essay using five documents you already know from this unit — the Declaration, the Constitution's Preamble, Federalist 10, Brutus 1, and Federalist 51 — and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-argument-essay-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the Argument Essay task asks for and how the 6-point rubric awards points, row by row, using the five-document Unit-1 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get a packet of foundational documents (here, five) and a prompt asking you to develop an argument. Build YOUR OWN claim in response to the prompt, then use the documents (at least one required) plus reasoning to support it — the format rewards a tight, well-reasoned argument over a long essay that merely quotes documents without connecting them to a claim.',
        'ROW A — THESIS (0-1 point): full credit requires a thesis that makes a defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not an unsupported assertion with no reasoning attached.',
        'ROW B — EVIDENCE, RELEVANT (0-1 point): full credit requires at least ONE piece of specific, relevant evidence that supports the thesis — a quotation or accurate paraphrase, not a vague gesture at a document\'s general topic.',
        'ROW C — EVIDENCE, FOUNDATIONAL DOCUMENT (0-1 point): full credit requires that AT LEAST ONE of the essay\'s pieces of evidence is drawn specifically from the assigned foundational-document packet (here: the Declaration, the Constitution\'s Preamble, Federalist 10, Brutus 1, or Federalist 51) — attributed only to what that document\'s excerpt actually contains, never more.',
        'ROW D — EVIDENCE, SECOND PIECE (0-1 point): full credit requires a SECOND piece of specific, relevant evidence, distinct from the first — this can be a different foundational document or specific outside knowledge (e.g. the concrete mechanics of a constitutional check), not a restatement of the first piece of evidence in different words.',
        'ROW E — REASONING (0-1 point): full credit requires explicitly explaining WHY or HOW the evidence supports the thesis — the logical connection, not just evidence and thesis sitting side by side. This is the row students lose most often: a strong quotation with no explanation of its relevance earns evidence credit but not reasoning credit.',
        'ROW F — ALTERNATIVE OR OPPOSING PERSPECTIVE (0-1 point): full credit requires identifying a specific opposing or alternative perspective — grounded in something real, like a document that pushes back on the thesis — and responding to it through refutation, concession, or rebuttal, not just noting that disagreement exists.',
        'Total = 6 points, one per row, summed — the authentic AP Gov Argument Essay scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-argument-essay',
      kind: 'try_yourself',
      problem:
        "Develop an argument about whether the United States Constitution's system of separated powers effectively prevents the concentration of government power.\n\nUse the documents below. In your response you should do the following: (1) respond to the prompt with a defensible thesis or claim that establishes a line of reasoning, (2) support your thesis with at least TWO pieces of specific and relevant evidence, with AT LEAST ONE piece of evidence coming from one of the foundational documents listed (the Declaration of Independence, the Preamble to the U.S. Constitution, Federalist No. 10, Brutus No. 1, or Federalist No. 51) — a second piece of evidence can come from a different foundational document or from your own knowledge, (3) use reasoning to explain why or how the evidence you provided supports your thesis, and (4) respond to an opposing or alternative perspective using refutation, concession, or rebuttal.",
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apush-declaration.v1',
        'evelyn.passage.apush-constitution-preamble.v1',
        'evelyn.passage.apush-federalist-10.v1',
        'evelyn.passage.apush-brutus-1.v1',
        'evelyn.passage.apgov-federalist-51.v1',
      ],
      expectedAnswer:
        "A full-credit response opens with a thesis arguing that the Constitution's system of separated powers effectively prevents the concentration of government power, because it does not rely on the good character of officeholders but instead connects each branch's own institutional self-interest to resisting encroachment by the others. As evidence, the essay quotes Federalist No. 51 (Document 5): \"Ambition must be made to counteract ambition. The interest of the man must be connected with the constitutional rights of the place\" — Madison's argument that each branch's officeholders are given personal, institutional motives to defend their own power against the other branches, not just constitutional permission to do so. This is the essay's required foundational-document evidence. A second, distinct piece of evidence draws on outside knowledge of how checks and balances actually operate: Congress can override a presidential veto with a two-thirds vote in both chambers, and the Supreme Court can strike down a law or executive action as unconstitutional through judicial review, established in Marbury v. Madison (1803) — concrete institutional tools that let a branch act on the incentive Federalist 51 describes, not merely a stated intention. Reasoning ties both pieces of evidence to the thesis: Federalist 51's incentive-based design explains WHY officeholders bother to resist encroachment at all, while the concrete tools of veto override and judicial review explain HOW that resistance is actually exercised — together, the incentive and the mechanism explain why separated powers keeps power divided in practice, not merely on paper. Finally, the essay responds to an opposing perspective drawn from Brutus No. 1 (Document 4), which warns that \"History furnishes no example of a free republic, any thing like the extent of the United States,\" noting that when the Grecian and Roman republics grew to govern large territories, their governments \"were changed from that of free governments to those of the most tyrannical that ever existed in the world\" — a warning that sheer scale, not just an undivided government, has historically been enough to concentrate power, regardless of internal structure. The essay answers this concern with Federalist 51's OWN second argument, the \"double security\" of the compound republic: because in America \"the power surrendered by the People is first divided between two distinct Governments, and then the portion allotted to each, subdivided among distinct and separate departments,\" the American system does not rely on separation of powers within one national government alone to guard against the danger Brutus describes — federalism itself divides power geographically before it is ever subdivided again among the three branches, answering Brutus's scale concern in a way the historical examples he cites never attempted.",
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a defensible claim that responds to the prompt (whether separated powers effectively prevents concentration of government power) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not defensible.',
            modelResponse:
              "The Constitution's system of separated powers effectively prevents the concentration of government power, because it does not rely on the good character of officeholders but instead connects each branch's own institutional self-interest to resisting encroachment by the others.",
          },
          {
            criterionId: 'B-evidence-relevant',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): at least one piece of specific, relevant evidence (quoted or accurately paraphrased) that supports the thesis. No credit (0/1) for a vague reference to a document\'s general topic with no specific content cited.',
            modelResponse:
              'Federalist No. 51 states: "Ambition must be made to counteract ambition. The interest of the man must be connected with the constitutional rights of the place" — each branch\'s officeholders are given personal, institutional motives to defend their own power against the other branches, not merely constitutional permission to do so.',
          },
          {
            criterionId: 'C-evidence-foundational-doc',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): at least one piece of evidence is drawn specifically from the assigned foundational-document packet (the Declaration, the Constitution\'s Preamble, Federalist 10, Brutus 1, or Federalist 51), attributed only to what that document\'s excerpt actually contains. No credit (0/1) if no evidence is drawn from the packet, or if a document is cited for content beyond what its excerpt contains.',
            modelResponse:
              'The "ambition must be made to counteract ambition" evidence is drawn directly from Federalist No. 51, one of the five assigned foundational documents, satisfying the requirement that at least one piece of evidence come from the document packet.',
          },
          {
            criterionId: 'D-evidence-second',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): a second, distinct piece of specific, relevant evidence — a different foundational document or specific outside knowledge — not a restatement of the first piece of evidence. No credit (0/1) for repeating the first piece of evidence in different words, or for a second piece that is vague or not relevant to the thesis.',
            modelResponse:
              "Beyond the assigned documents, the Constitution's actual mechanics of checks and balances reinforce the thesis: Congress can override a presidential veto with a two-thirds vote in both the House and Senate, and the Supreme Court can strike down a law or executive action as unconstitutional through judicial review, established in Marbury v. Madison (1803) — concrete institutional tools, distinct from Federalist 51's statement of intent, that let a branch actually act on its incentive to resist the others.",
          },
          {
            criterionId: 'E-reasoning',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explicitly explains WHY or HOW the evidence supports the thesis — the logical connection between the specific evidence and the specific claim, not evidence and thesis merely placed side by side. No credit (0/1) for evidence presented with no explanation of its relevance to the thesis.',
            modelResponse:
              "Federalist 51's incentive-based design explains WHY officeholders bother to resist encroachment by the other branches at all — because their own institutional interest is tied to it — while the concrete tools of veto override and judicial review explain HOW that resistance is actually exercised in practice; together, the incentive and the mechanism explain why separated powers keeps power divided in practice, not merely on paper.",
          },
          {
            criterionId: 'F-alternative-perspective',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): identifies a specific opposing or alternative perspective — grounded in real evidence, such as a document that pushes back on the thesis — and responds to it through refutation, concession, or rebuttal. No credit (0/1) for merely noting that disagreement exists with no specific grounding or no response to it.',
            modelResponse:
              'Brutus No. 1 offers a serious objection: "History furnishes no example of a free republic, any thing like the extent of the United States," and when the Grecian and Roman republics grew to govern large territories, their governments "were changed from that of free governments to those of the most tyrannical that ever existed in the world" — suggesting sheer scale alone has historically been enough to concentrate power, regardless of internal structure. This is answered by Federalist 51\'s OWN second argument, the "double security" of the compound republic: because "the power surrendered by the People is first divided between two distinct Governments, and then the portion allotted to each, subdivided among distinct and separate departments," the American system does not rely on separation of powers within one national government alone — federalism itself divides power geographically before it is ever subdivided again among the three branches, addressing Brutus\'s scale concern in a way the historical examples he cites never attempted.',
          },
        ],
      },
      hints: [
        'Pick ONE clear thesis and build the whole essay around it — don\'t hedge with a list of unconnected claims.',
        'At least one piece of evidence MUST come from the five-document packet; a second piece can be a different document or your own outside knowledge.',
        'Evidence without reasoning earns partial credit at best — always explain WHY the evidence you cite actually supports your thesis.',
        'For the alternative-perspective row, use Brutus No. 1 as a genuine objection and directly answer it — don\'t just mention that "some might disagree."',
        'Only quote what a document actually says — Federalist 10\'s excerpt here is ONLY Madison\'s definition of a faction, not his later "large republic controls faction" argument.',
      ],
      estimatedMinutes: 32,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Argument Essay is 6 points across six rows: Thesis (1); Evidence-Relevant (1); Evidence-Foundational Document (1, at least one piece from the packet); Evidence-Second (1, a second distinct piece); Reasoning (1, explain WHY the evidence supports the thesis); Alternative Perspective (1, respond to a real objection).',
        'Evidence without reasoning is the single biggest way to lose points — always connect the quotation back to the thesis explicitly.',
        'Only attribute to a document what it actually says — the Declaration excerpt stops at "consent of the governed" (no "alter or abolish"); Federalist 10\'s excerpt is only Madison\'s definition of a faction.',
        'Federalist 51\'s "double security" (federalism dividing power between national and state governments, THEN subdividing again among branches) is a strong rebuttal to Brutus No. 1\'s scale-based objection to the Constitution.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1-FRQ-ARG',
    cedTitle: 'Unit 1 FRQ Practice — Argument Essay',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics Argument Essay free-response task wording and 6-point rubric (Thesis 1 / Evidence-Relevant 1 / Evidence-Foundational-Doc 1 / Evidence-Second 1 / Reasoning 1 / Alternative Perspective 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-declaration.v1',
        chapter: '1776',
        note: 'Declaration of Independence preamble — Document 1 of the five-document Unit-1 packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-constitution-preamble.v1',
        chapter: '1787',
        note: 'Preamble to the U.S. Constitution — Document 2 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-federalist-10.v1',
        chapter: '1787',
        note: "Federalist No. 10, Madison's definition of a faction — Document 3 of the packet.",
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-brutus-1.v1',
        chapter: '1787',
        note: 'Brutus No. 1, the size-of-a-free-republic argument — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-federalist-51.v1',
        chapter: '1788',
        note: 'Federalist No. 51 — Document 5 of the packet.',
      },
    ],
  },
};
