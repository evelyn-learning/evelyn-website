/**
 * AP US Government & Politics — Unit 2 FRQ Practice: Argument Essay
 * (AP Gov FRQ 4) — the longest AP Gov free-response format, 6 points,
 * scored against a document packet of four foundational documents.
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
 * resolved and labeled Document 1..4 for the grader in array order):
 *   1. Federalist No. 51 (1788) — evelyn.passage.apgov-federalist-51.v1
 *   2. Federalist No. 70 (1788) — evelyn.passage.apgov-federalist-70.v1
 *   3. Federalist No. 78 (1788) — evelyn.passage.apgov-federalist-78.v1
 *   4. Articles of Confederation (1781) —
 *      evelyn.passage.apgov-articles-confederation.v1
 *
 * DOCUMENT FIDELITY (guarded, per the AP Plans Initiative gotcha review):
 * every quotation below is checked byte-exact against each document's
 * seeded fullText. Federalist 51's "ambition must be made to counteract
 * ambition" and "double security" passages are quoted verbatim. Federalist
 * 70's "energy in the Executive" and "decision, activity, secrecy, and
 * despatch" unity argument are quoted verbatim from its seeded excerpt.
 * Federalist 78's "neither FORCE nor WILL, but merely judgment" and
 * "must ultimately depend upon the aid of the Executive arm" sentences are
 * quoted verbatim. The Articles of Confederation excerpt (Article II
 * state-sovereignty clause, Article III "firm league of friendship,"
 * Article VIII treasury-by-requisition clause) contains no mention of a
 * separate executive department anywhere in its text — the model response
 * below observes that textual silence rather than quoting any fabricated
 * "no executive" language.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U2_FRQ_ARGUMENT_ESSAY: LessonPlan = {
  id: 'evelyn.ap.apgov.u2-frq-argument-essay.v1',
  title: 'Unit 2 FRQ Practice — Argument Essay',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u2-frq-argument-essay',
      description:
        'Write a complete AP Gov Argument Essay from a four-document Unit-2 foundational-document packet (Federalist 51, 70, 78, and the Articles of Confederation) arguing whether the modern presidency has grown too powerful relative to Congress and the federal judiciary — a defensible thesis with a line of reasoning; at least two pieces of specific, relevant evidence with at least one drawn from the foundational documents; reasoning explaining why the evidence supports the thesis; and a response to an opposing or alternative perspective — scored against the authentic AP Gov 6-point Argument Essay rubric.',
      standard: 'AP-APGOV-2-FRQ-ARG',
    },
  ],
  prerequisites: ['apgov.presidency-power', 'apgov.judiciary-independence', 'apgov.congress-structure'],
  followUps: [],
  estimatedMinutes: 42,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of the longest, highest-point AP Gov FRQ concrete for a modern-presidency argument, and name the single biggest scoring trap: dropping a quotation into the essay without ever explaining why it supports the thesis.',
      script:
        "The last of the four AP Gov free-response questions is also the biggest: the Argument Essay, worth 6 points — more than any other single FRQ. You'll get a prompt and a packet of foundational documents to draw evidence from, but the task is NOT to summarize what the documents say. It's to build your OWN argument — here, about whether the modern presidency has grown too powerful relative to Congress and the judiciary — and use the documents plus your own knowledge as evidence, explain WHY that evidence actually supports your claim, and respond to someone who'd disagree. The single biggest way students lose points here is dropping in a strong quotation and never explaining the logical connection between the quote and the thesis. Today you'll write one complete Argument Essay using four documents from this unit — Federalist 51, 70, 78, and the Articles of Confederation — and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-argument-essay-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the Argument Essay task asks for and how the 6-point rubric awards points, row by row, using the four-document Unit-2 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get a packet of foundational documents (here, four) and a prompt asking you to develop an argument. Build YOUR OWN claim in response to the prompt, then use the documents (at least one required) plus reasoning to support it — the format rewards a tight, well-reasoned argument over a long essay that merely quotes documents without connecting them to a claim.',
        'ROW A — THESIS (0-1 point): full credit requires a thesis that makes a defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not an unsupported assertion with no reasoning attached.',
        'ROW B — EVIDENCE, RELEVANT (0-1 point): full credit requires at least ONE piece of specific, relevant evidence that supports the thesis — a quotation or accurate paraphrase, not a vague gesture at a document\'s general topic.',
        'ROW C — EVIDENCE, FOUNDATIONAL DOCUMENT (0-1 point): full credit requires that AT LEAST ONE of the essay\'s pieces of evidence is drawn specifically from the assigned foundational-document packet (here: Federalist 51, Federalist 70, Federalist 78, or the Articles of Confederation) — attributed only to what that document\'s excerpt actually contains, never more.',
        'ROW D — EVIDENCE, SECOND PIECE (0-1 point): full credit requires a SECOND piece of specific, relevant evidence, distinct from the first — this can be a different foundational document or specific outside knowledge, not a restatement of the first piece of evidence in different words.',
        'ROW E — REASONING (0-1 point): full credit requires explicitly explaining WHY or HOW the evidence supports the thesis — the logical connection, not just evidence and thesis sitting side by side. This is the row students lose most often.',
        'ROW F — ALTERNATIVE OR OPPOSING PERSPECTIVE (0-1 point): full credit requires identifying a specific opposing or alternative perspective — grounded in something real, like a document that pushes back on the thesis — and responding to it through refutation, concession, or rebuttal, not just noting that disagreement exists.',
        'Total = 6 points, one per row, summed — the authentic AP Gov Argument Essay scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-argument-essay',
      kind: 'try_yourself',
      problem:
        "Develop an argument about whether the modern presidency has grown too powerful relative to Congress and the federal judiciary.\n\nUse the documents below. In your response you should do the following: (1) respond to the prompt with a defensible thesis or claim that establishes a line of reasoning, (2) support your thesis with at least TWO pieces of specific and relevant evidence, with AT LEAST ONE piece of evidence coming from one of the foundational documents listed (Federalist No. 51, Federalist No. 70, Federalist No. 78, or the Articles of Confederation) — a second piece of evidence can come from a different foundational document or from your own knowledge, (3) use reasoning to explain why or how the evidence you provided supports your thesis, and (4) respond to an opposing or alternative perspective using refutation, concession, or rebuttal.",
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apgov-federalist-51.v1',
        'evelyn.passage.apgov-federalist-70.v1',
        'evelyn.passage.apgov-federalist-78.v1',
        'evelyn.passage.apgov-articles-confederation.v1',
      ],
      expectedAnswer:
        "A full-credit response opens with a thesis arguing that the modern presidency has grown too powerful relative to Congress and the federal judiciary, because the constitutional design itself gives the presidency structural advantages in speed and unilateral action that the other two branches were never given, and modern practice has stretched those advantages further than the framers anticipated. As evidence, the essay quotes Federalist No. 70 (Document 2): \"Energy in the Executive is a leading character in the definition of good Government,\" and its unity argument that \"Decision, activity, secrecy, and despatch, will generally characterize the proceedings of one man, in a much more eminent degree than the proceedings of any greater number\" — showing that the framers deliberately built the presidency as a single, decisive actor who can move faster than Congress's multi-member deliberative process. This is the essay's required foundational-document evidence. A second, distinct piece of evidence draws on Federalist No. 78 (Document 3): the judiciary \"has no influence over either the sword or the purse\" and \"may truly be said to have neither FORCE nor WILL, but merely judgment; and must ultimately depend upon the aid of the Executive arm even for the efficacy of its judgments\" — showing that the judiciary's power to check the other branches is structurally passive and depends on the executive's cooperation to actually take effect. Reasoning ties both pieces of evidence to the thesis: Federalist 70's unity-and-energy design lets the presidency act first and alone, while Federalist 78's account of judicial dependence means the judiciary can only respond after the fact, and even then only if the executive complies — together, the presidency's built-in capacity to move quickly and the judiciary's built-in dependence on executive enforcement explain why practical power has tilted toward the presidency as unilateral tools like executive orders and emergency military action have expanded in the modern era. Finally, the essay responds to an opposing perspective drawn from Federalist No. 51 (Document 1), which argues that \"Ambition must be made to counteract ambition. The interest of the man must be connected with the constitutional rights of the place\" — the claim that each branch's own institutional self-interest, not the presidency's structural design, is what keeps power divided, so no branch should be able to grow unchecked. The essay concedes that this check exists in theory, but rebuts that Federalist 51's design assumed a rough parity of institutional capacity across the three branches; the Articles of Confederation (Document 4) shows how far the framers deliberately moved away from a system with no separate executive at all — its text vests governing power only in a \"firm league of friendship\" among sovereign states acting in Congress, funded through a requisition system in which expenses \"shall be defrayed out of a common treasury, which shall be supplied by the several states,\" with no executive department mentioned anywhere in the document — meaning the shift toward a single, energetic executive was intentional and large. Because Federalist 51's ambition-counteracts-ambition check assumes each branch has comparable tools to resist the others, and the presidency's unilateral capacity has expanded further than Congress's ability to act quickly or the judiciary's independent capacity to enforce its own judgments, Federalist 51's institutional check remains necessary in theory but has proven insufficient in practice to prevent the power imbalance described above.",
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a defensible claim that responds to the prompt (whether the modern presidency has grown too powerful relative to Congress and the judiciary) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not defensible.',
            modelResponse:
              'The modern presidency has grown too powerful relative to Congress and the federal judiciary, because the constitutional design itself gives the presidency structural advantages in speed and unilateral action that the other two branches were never given, and modern practice has stretched those advantages further than the framers anticipated.',
          },
          {
            criterionId: 'B-evidence-relevant',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): at least one piece of specific, relevant evidence (quoted or accurately paraphrased) that supports the thesis. No credit (0/1) for a vague reference to a document\'s general topic with no specific content cited.',
            modelResponse:
              'Federalist No. 70 states: "Energy in the Executive is a leading character in the definition of good Government," and that "Decision, activity, secrecy, and despatch, will generally characterize the proceedings of one man, in a much more eminent degree than the proceedings of any greater number" — the framers deliberately built the presidency as a single, decisive actor who can move faster than Congress\'s multi-member deliberative process.',
          },
          {
            criterionId: 'C-evidence-foundational-doc',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): at least one piece of evidence is drawn specifically from the assigned foundational-document packet (Federalist 51, Federalist 70, Federalist 78, or the Articles of Confederation), attributed only to what that document\'s excerpt actually contains. No credit (0/1) if no evidence is drawn from the packet, or if a document is cited for content beyond what its excerpt contains.',
            modelResponse:
              'The "energy in the Executive" and unity-of-one-man evidence is drawn directly from Federalist No. 70, one of the four assigned foundational documents, satisfying the requirement that at least one piece of evidence come from the document packet.',
          },
          {
            criterionId: 'D-evidence-second',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): a second, distinct piece of specific, relevant evidence — a different foundational document or specific outside knowledge — not a restatement of the first piece of evidence. No credit (0/1) for repeating the first piece of evidence in different words, or for a second piece that is vague or not relevant to the thesis.',
            modelResponse:
              'A second, distinct piece of evidence comes from Federalist No. 78: the judiciary "has no influence over either the sword or the purse" and "may truly be said to have neither FORCE nor WILL, but merely judgment; and must ultimately depend upon the aid of the Executive arm even for the efficacy of its judgments" — showing that the judiciary\'s power to check the other branches is structurally passive and depends on executive cooperation to take effect, distinct from Federalist 70\'s evidence about the presidency\'s own capacity to act.',
          },
          {
            criterionId: 'E-reasoning',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explicitly explains WHY or HOW the evidence supports the thesis — the logical connection between the specific evidence and the specific claim, not evidence and thesis merely placed side by side. No credit (0/1) for evidence presented with no explanation of its relevance to the thesis.',
            modelResponse:
              "Federalist 70's unity-and-energy design explains WHY the presidency can act first and alone, while Federalist 78's account of judicial dependence explains WHY the judiciary can only respond after the fact, and even then only if the executive complies; together, the presidency's built-in capacity to move quickly and the judiciary's built-in dependence on executive enforcement explain why practical power has tilted toward the presidency as unilateral tools like executive orders and emergency military action have expanded in the modern era.",
          },
          {
            criterionId: 'F-alternative-perspective',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): identifies a specific opposing or alternative perspective — grounded in real evidence, such as a document that pushes back on the thesis — and responds to it through refutation, concession, or rebuttal. No credit (0/1) for merely noting that disagreement exists with no specific grounding or no response to it.',
            modelResponse:
              'Federalist No. 51 offers a serious objection: "Ambition must be made to counteract ambition. The interest of the man must be connected with the constitutional rights of the place" — the claim that each branch\'s own institutional self-interest, not the presidency\'s structural design, is what keeps power divided. This is answered by conceding the check exists in theory, but rebutting that it assumes a rough parity of institutional capacity across branches: the Articles of Confederation shows the framers deliberately moved away from a system with no separate executive at all — its text vests power only in a "firm league of friendship" among the states, funded through a requisition system in which expenses "shall be defrayed out of a common treasury, which shall be supplied by the several states," with no executive department mentioned anywhere in it — so the shift toward a single, energetic executive was intentional and large, and Federalist 51\'s check has proven insufficient in practice to prevent the resulting power imbalance.',
          },
        ],
      },
      hints: [
        'Pick ONE clear thesis and build the whole essay around it — don\'t hedge with a list of unconnected claims.',
        'At least one piece of evidence MUST come from the four-document packet; a second piece can be a different document or your own outside knowledge.',
        'Evidence without reasoning earns partial credit at best — always explain WHY the evidence you cite actually supports your thesis.',
        'For the alternative-perspective row, use Federalist 51\'s "ambition must counteract ambition" as a genuine objection and directly answer it — don\'t just mention that "some might disagree."',
        'Only quote what a document actually says — the Articles of Confederation excerpt never uses the words "no executive"; it simply never mentions one, which is itself the evidence.',
      ],
      estimatedMinutes: 32,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Argument Essay is 6 points across six rows: Thesis (1); Evidence-Relevant (1); Evidence-Foundational Document (1, at least one piece from the packet); Evidence-Second (1, a second distinct piece); Reasoning (1, explain WHY the evidence supports the thesis); Alternative Perspective (1, respond to a real objection).',
        'Evidence without reasoning is the single biggest way to lose points — always connect the quotation back to the thesis explicitly.',
        'Federalist 70\'s "energy in the Executive" and unity argument, and Federalist 78\'s "neither FORCE nor WILL" account of a dependent judiciary, together explain a structural speed/enforcement asymmetry favoring the presidency.',
        'Federalist 51\'s "ambition must be made to counteract ambition" is a strong opposing perspective — but the Articles of Confederation\'s complete absence of a separate executive shows how deliberately the framers overcorrected toward a unified, energetic president.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2-FRQ-ARG',
    cedTitle: 'Unit 2 FRQ Practice — Argument Essay',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP US Government & Politics Argument Essay free-response task wording and 6-point rubric (Thesis 1 / Evidence-Relevant 1 / Evidence-Foundational-Doc 1 / Evidence-Second 1 / Reasoning 1 / Alternative Perspective 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-federalist-51.v1',
        chapter: '1788',
        note: 'Federalist No. 51 — Document 1 of the four-document packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-federalist-70.v1',
        chapter: '1788',
        note: 'Federalist No. 70 — Document 2 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-federalist-78.v1',
        chapter: '1788',
        note: 'Federalist No. 78 — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-articles-confederation.v1',
        chapter: '1781',
        note: 'Articles of Confederation — Document 4 of the packet.',
      },
    ],
  },
};
