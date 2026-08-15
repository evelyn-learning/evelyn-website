/**
 * AP US Government & Politics — Unit 4 FRQ Practice: Argument Essay
 * (AP Gov FRQ 4) — the longest AP Gov free-response format, 6 points,
 * scored against a document packet of two foundational documents.
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
 * resolved and labeled Document 1..2 for the grader in array order):
 *   1. Federalist No. 10 (Madison, 1787) — evelyn.passage.apush-federalist-10.v1
 *   2. Brutus No. 1 (1787) — evelyn.passage.apush-brutus-1.v1
 * Both documents are APUSH-owned seeds, read here for document fidelity
 * and reused as-is (no APUSH content was modified).
 *
 * DOCUMENT FIDELITY (guarded, per the AP Plans Initiative gotcha review):
 * the Federalist 10 excerpt seeded here is ONLY Madison's definition of
 * a faction ("a number of citizens... united and actuated by some common
 * impulse of passion, or of interest, adverse to the rights of other
 * citizens, or to the permanent and aggregate interests of the
 * community") — it does NOT include Madison's separate "extend the
 * sphere" argument, which lives in a later, unseeded paragraph. Nothing
 * below cites the extend-the-sphere argument as if it were in this
 * excerpt. The Brutus 1 excerpt seeded here is the historical claim that
 * no free republic has governed a territory as large as the United
 * States, illustrated by the Greek and Roman republics turning tyrannical
 * once they expanded over large territories — quoted verbatim from the
 * seed, nothing more.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U4_FRQ_ARGUMENT_ESSAY: LessonPlan = {
  id: 'evelyn.ap.apgov.u4-frq-argument-essay.v1',
  title: 'Unit 4 FRQ Practice — Argument Essay',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u4-frq-argument-essay',
      description:
        'Write a complete AP Gov Argument Essay from a two-document foundational-document packet (Federalist No. 10 and Brutus No. 1) arguing whether elected officials should follow public opinion or exercise their own judgment when making policy — a defensible thesis with a line of reasoning; at least two pieces of specific, relevant evidence with at least one drawn from the foundational documents; reasoning explaining why the evidence supports the thesis; and a response to an opposing or alternative perspective — scored against the authentic AP Gov 6-point Argument Essay rubric.',
      standard: 'AP-APGOV-4-FRQ-ARG',
    },
  ],
  prerequisites: ['apgov.public-opinion-measurement', 'apgov.ideology-policy'],
  followUps: [],
  estimatedMinutes: 42,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of the longest, highest-point AP Gov FRQ concrete for a follow-opinion-versus-exercise-judgment argument, and name the single biggest scoring trap: dropping a quotation into the essay without ever explaining why it supports the thesis.',
      script:
        "The last of the four AP Gov free-response questions is also the biggest: the Argument Essay, worth 6 points — more than any other single FRQ. You'll get a prompt and a packet of foundational documents to draw evidence from, but the task is NOT to summarize what the documents say. It's to build your OWN argument — here, about whether elected officials should follow public opinion or exercise their own independent judgment when making policy — and use the documents plus your own knowledge as evidence, explain WHY that evidence actually supports your claim, and respond to someone who'd disagree. The single biggest way students lose points here is dropping in a strong quotation and never explaining the logical connection between the quote and the thesis. Today you'll write one complete Argument Essay using two founding-era documents — Madison's Federalist No. 10 and the Anti-Federalist Brutus No. 1 — and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-argument-essay-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the Argument Essay task asks for and how the 6-point rubric awards points, row by row, using the two-document Unit-4 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get a packet of foundational documents (here, two) and a prompt asking you to develop an argument. Build YOUR OWN claim in response to the prompt, then use the documents (at least one required) plus reasoning to support it — the format rewards a tight, well-reasoned argument over a long essay that merely quotes documents without connecting them to a claim.',
        'ROW A — THESIS (0-1 point): full credit requires a thesis that makes a defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not an unsupported assertion with no reasoning attached.',
        'ROW B — EVIDENCE, RELEVANT (0-1 point): full credit requires at least ONE piece of specific, relevant evidence that supports the thesis — a quotation or accurate paraphrase, not a vague gesture at a document\'s general topic.',
        'ROW C — EVIDENCE, FOUNDATIONAL DOCUMENT (0-1 point): full credit requires that AT LEAST ONE of the essay\'s pieces of evidence is drawn specifically from the assigned foundational-document packet (here: Federalist No. 10 or Brutus No. 1) — attributed only to what that document\'s excerpt actually contains, never more.',
        'ROW D — EVIDENCE, SECOND PIECE (0-1 point): full credit requires a SECOND piece of specific, relevant evidence, distinct from the first — this can be a different foundational document or specific outside knowledge (such as a named constitutional design feature or historical example), not a restatement of the first piece of evidence in different words.',
        'ROW E — REASONING (0-1 point): full credit requires explicitly explaining WHY or HOW the evidence supports the thesis — the logical connection, not just evidence and thesis sitting side by side. This is the row students lose most often.',
        'ROW F — ALTERNATIVE OR OPPOSING PERSPECTIVE (0-1 point): full credit requires identifying a specific opposing or alternative perspective — grounded in something real, like the other document\'s argument or a historical counterexample — and responding to it through refutation, concession, or rebuttal, not just noting that disagreement exists.',
        'Total = 6 points, one per row, summed — the authentic AP Gov Argument Essay scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-argument-essay',
      kind: 'try_yourself',
      problem:
        "Develop an argument about whether elected officials should follow public opinion or exercise their own judgment when making policy.\n\nUse the documents below. In your response you should do the following: (1) respond to the prompt with a defensible thesis or claim that establishes a line of reasoning, (2) support your thesis with at least TWO pieces of specific and relevant evidence, with AT LEAST ONE piece of evidence coming from one of the foundational documents listed (Federalist No. 10 or Brutus No. 1) — a second piece of evidence can come from the other foundational document or from your own knowledge, (3) use reasoning to explain why or how the evidence you provided supports your thesis, and (4) respond to an opposing or alternative perspective using refutation, concession, or rebuttal.",
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apush-federalist-10.v1',
        'evelyn.passage.apush-brutus-1.v1',
      ],
      expectedAnswer:
        "A full-credit response opens with a thesis arguing that elected officials should primarily exercise their own independent judgment rather than simply follow public opinion, because public opinion at any given moment can reflect a narrow or self-interested faction rather than the community's true, lasting interests, and because structural independence lets officials act on that broader interest even when it is momentarily unpopular. As evidence, the essay quotes Federalist No. 10 (Document 1): Madison defines a faction as \"a number of citizens, whether amounting to a majority or a minority of the whole, who are united and actuated by some common impulse of passion, or of interest, adverse to the rights of other citizens, or to the permanent and aggregate interests of the community.\" This is the essay's required foundational-document evidence, showing that a group of citizens whose current opinion is driven by passion or narrow interest — even a majority of citizens — can conflict with the community's \"permanent and aggregate interests,\" meaning public opinion in the moment is not automatically the same as the common good. A second, distinct piece of evidence draws on outside knowledge: the Constitution's original design of the U.S. Senate, whose members served six-year terms and were originally chosen by state legislatures rather than direct popular vote (before the 17th Amendment), deliberately insulating senators from short-term shifts in public opinion so they could exercise independent judgment on complex or slow-moving questions. Reasoning ties both pieces of evidence to the thesis: Madison's faction warning shows that a snapshot of public opinion can reflect a passionate or narrowly interested group rather than the community's lasting interest, and the Senate's original insulated design shows the Framers structurally building in room for elected officials to exercise judgment rather than simply track opinion — together, these show that following public opinion uncritically risks enacting a faction's momentary passion into policy, while judgment insulated from that pressure can better serve the community's permanent interests. Finally, the essay responds to an opposing perspective drawn from Brutus No. 1 (Document 2): Brutus warned that \"history furnishes no example of a free republic, any thing like the extent of the United States,\" noting that the Grecian and Roman republics, once they \"extended their conquests over large territories of country,\" saw their governments \"changed from that of free governments to those of the most tyrannical that ever existed in the world\" — an argument that representatives spread across a vast territory risk growing distant from the people they represent, becoming an unaccountable elite unless they follow public opinion closely. The essay concedes that this risk of officials drifting from accountability is real, especially over a large territory and long tenures, but rebuts that regular elections combined with direct constituent communication give the public enough ongoing leverage over officials even when those officials also exercise independent judgment — meaning the Framers' answer to Brutus's warning was not to demand blind adherence to public opinion, but to pair periodic electoral accountability with enough structural room for judgment that a passionate, momentary majority faction, of exactly the kind Madison described, could not simply dictate policy.",
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a defensible claim that responds to the prompt (whether elected officials should follow public opinion or exercise their own judgment) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not defensible.',
            modelResponse:
              "Elected officials should primarily exercise their own independent judgment rather than simply follow public opinion, because public opinion at any given moment can reflect a narrow or self-interested faction rather than the community's true, lasting interests, and because structural independence lets officials act on that broader interest even when it is momentarily unpopular.",
          },
          {
            criterionId: 'B-evidence-relevant',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): at least one piece of specific, relevant evidence (quoted or accurately paraphrased) that supports the thesis. No credit (0/1) for a vague reference to a document\'s general topic with no specific content cited.',
            modelResponse:
              'Federalist No. 10 defines a faction as "a number of citizens, whether amounting to a majority or a minority of the whole, who are united and actuated by some common impulse of passion, or of interest, adverse to the rights of other citizens, or to the permanent and aggregate interests of the community" — showing that even a majority\'s current opinion can conflict with the community\'s lasting interests.',
          },
          {
            criterionId: 'C-evidence-foundational-doc',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): at least one piece of evidence is drawn specifically from the assigned foundational-document packet (Federalist No. 10 or Brutus No. 1), attributed only to what that document\'s excerpt actually contains. No credit (0/1) if no evidence is drawn from the packet, or if a document is cited for content beyond what its excerpt contains.',
            modelResponse:
              "The faction-definition evidence is drawn directly from Federalist No. 10, one of the two assigned foundational documents, satisfying the requirement that at least one piece of evidence come from the document packet.",
          },
          {
            criterionId: 'D-evidence-second',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): a second, distinct piece of specific, relevant evidence — a different foundational document or specific outside knowledge — not a restatement of the first piece of evidence. No credit (0/1) for repeating the first piece of evidence in different words, or for a second piece that is vague or not relevant to the thesis.',
            modelResponse:
              "A second, distinct piece of evidence comes from outside knowledge: the Constitution's original design of the U.S. Senate, with six-year terms and selection by state legislatures rather than direct popular vote (before the 17th Amendment), deliberately insulating senators from short-term shifts in public opinion — distinct from the Federalist 10 evidence about the risk of faction itself.",
          },
          {
            criterionId: 'E-reasoning',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explicitly explains WHY or HOW the evidence supports the thesis — the logical connection between the specific evidence and the specific claim, not evidence and thesis merely placed side by side. No credit (0/1) for evidence presented with no explanation of its relevance to the thesis.',
            modelResponse:
              "Madison's faction warning shows that a snapshot of public opinion can reflect a passionate or narrowly interested group rather than the community's lasting interest, and the Senate's original insulated design shows the Framers structurally building in room for elected officials to exercise judgment rather than simply track opinion — together showing that following public opinion uncritically risks enacting a faction's momentary passion into policy, while insulated judgment can better serve the community's permanent interests.",
          },
          {
            criterionId: 'F-alternative-perspective',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): identifies a specific opposing or alternative perspective — grounded in real evidence, such as the other packet document\'s argument or a historical episode that cuts against the thesis — and responds to it through refutation, concession, or rebuttal. No credit (0/1) for merely noting that disagreement exists with no specific grounding or no response to it.',
            modelResponse:
              "Brutus No. 1 warns that \"history furnishes no example of a free republic, any thing like the extent of the United States,\" noting that the Grecian and Roman republics, once they \"extended their conquests over large territories of country,\" saw their governments \"changed from that of free governments to those of the most tyrannical that ever existed in the world\" — arguing that representatives spread across a vast territory risk growing distant from the people, becoming unaccountable unless they follow public opinion closely. This is answered by conceding that the risk of officials drifting from accountability is real, but rebutting that regular elections combined with direct constituent communication give the public enough ongoing leverage even when officials also exercise independent judgment — the Framers' answer to Brutus's warning was pairing electoral accountability with room for judgment, not demanding blind adherence to opinion.",
          },
        ],
      },
      hints: [
        'Pick ONE clear thesis and build the whole essay around it — don\'t hedge with a list of unconnected claims.',
        'At least one piece of evidence MUST come from the two-document packet; a second piece can be the other document or your own outside knowledge (a named constitutional design feature or historical example).',
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
        'Federalist No. 10\'s definition of faction — a group "united and actuated by some common impulse of passion, or of interest, adverse to... the permanent and aggregate interests of the community" — is strong evidence that raw public opinion can diverge from the common good.',
        'Brutus No. 1\'s warning that free republics have never governed so large a territory, and that the Greek and Roman republics turned tyrannical once they expanded, is a strong opposing perspective for officials staying closely accountable to public opinion.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4-FRQ-ARG',
    cedTitle: 'Unit 4 FRQ Practice — Argument Essay',
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
        note: 'Federalist No. 10 (Madison) — Document 1 of the two-document packet (APUSH-owned seed, reused for this AP Gov essay); excerpt is Madison\'s definition of a faction only.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-brutus-1.v1',
        chapter: '1787',
        note: 'Brutus No. 1 — Document 2 of the packet (APUSH-owned seed, reused for this AP Gov essay).',
      },
    ],
  },
};
