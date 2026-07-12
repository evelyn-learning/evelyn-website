/**
 * AP US Government & Politics — Unit 3 FRQ Practice: Argument Essay
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
 *   1. The Declaration of Independence (1776) —
 *      evelyn.passage.apush-declaration.v1
 *   2. Preamble to the U.S. Constitution (1787) —
 *      evelyn.passage.apush-constitution-preamble.v1
 * Both documents are APUSH-owned seeds, read here for document fidelity
 * and reused as-is (no APUSH content was modified).
 *
 * DOCUMENT FIDELITY (guarded, per the AP Plans Initiative gotcha review):
 * the Declaration quotation ("We hold these truths to be self-evident,
 * that all men are created equal... Governments are instituted among Men,
 * deriving their just powers from the consent of the governed") is quoted
 * verbatim from the seeded excerpt. The Preamble quotation ("in Order to
 * form a more perfect Union, establish Justice... secure the Blessings of
 * Liberty to ourselves and our Posterity") is a verbatim substring of the
 * seeded full Preamble text (quoted starting mid-sentence, after "We the
 * People of the United States,").
 *
 * MLK "LETTER FROM BIRMINGHAM JAIL" — PARAPHRASE ONLY, NOT IN THE PACKET:
 * per the Global Constraints for this initiative and the civil-rights
 * content plan's own convention (ap-apgov-u3-civil-rights.ts), the Letter
 * is still under copyright. It is used below ONLY as paraphrased
 * background reasoning for the alternative-perspective row — ZERO quoted
 * sentences from the Letter appear anywhere in this file, and the Letter
 * is NOT one of the two passageIds in the packet. The only
 * Letter-associated language reproduced is the two-word named concept
 * "constructive tension," used as a term of art (matching the civil-rights
 * plan's own docblock), not as an excerpted sentence.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U3_FRQ_ARGUMENT_ESSAY: LessonPlan = {
  id: 'evelyn.ap.apgov.u3-frq-argument-essay.v1',
  title: 'Unit 3 FRQ Practice — Argument Essay',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.u3-frq-argument-essay',
      description:
        'Write a complete AP Gov Argument Essay from a two-document foundational-document packet (the Declaration of Independence and the Preamble to the Constitution) arguing whether the federal courts or the elected branches have been more effective at protecting civil rights in the United States — a defensible thesis with a line of reasoning; at least two pieces of specific, relevant evidence with at least one drawn from the foundational documents; reasoning explaining why the evidence supports the thesis; and a response to an opposing or alternative perspective — scored against the authentic AP Gov 6-point Argument Essay rubric.',
      standard: 'AP-APGOV-3-FRQ-ARG',
    },
  ],
  prerequisites: ['apgov.civil-rights-equality'],
  followUps: [],
  estimatedMinutes: 42,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of the longest, highest-point AP Gov FRQ concrete for a courts-versus-elected-branches civil-rights argument, and name the single biggest scoring trap: dropping a quotation into the essay without ever explaining why it supports the thesis.',
      script:
        "The last of the four AP Gov free-response questions is also the biggest: the Argument Essay, worth 6 points — more than any other single FRQ. You'll get a prompt and a packet of foundational documents to draw evidence from, but the task is NOT to summarize what the documents say. It's to build your OWN argument — here, about whether the federal courts or the elected branches (Congress and the presidency) have been more effective at protecting civil rights — and use the documents plus your own knowledge as evidence, explain WHY that evidence actually supports your claim, and respond to someone who'd disagree. The single biggest way students lose points here is dropping in a strong quotation and never explaining the logical connection between the quote and the thesis. Today you'll write one complete Argument Essay using two founding documents — the Declaration of Independence and the Constitution's Preamble — and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-argument-essay-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the Argument Essay task asks for and how the 6-point rubric awards points, row by row, using the two-document Unit-3 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get a packet of foundational documents (here, two) and a prompt asking you to develop an argument. Build YOUR OWN claim in response to the prompt, then use the documents (at least one required) plus reasoning to support it — the format rewards a tight, well-reasoned argument over a long essay that merely quotes documents without connecting them to a claim.',
        'ROW A — THESIS (0-1 point): full credit requires a thesis that makes a defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not an unsupported assertion with no reasoning attached.',
        'ROW B — EVIDENCE, RELEVANT (0-1 point): full credit requires at least ONE piece of specific, relevant evidence that supports the thesis — a quotation or accurate paraphrase, not a vague gesture at a document\'s general topic.',
        'ROW C — EVIDENCE, FOUNDATIONAL DOCUMENT (0-1 point): full credit requires that AT LEAST ONE of the essay\'s pieces of evidence is drawn specifically from the assigned foundational-document packet (here: the Declaration of Independence or the Constitution\'s Preamble) — attributed only to what that document\'s excerpt actually contains, never more.',
        'ROW D — EVIDENCE, SECOND PIECE (0-1 point): full credit requires a SECOND piece of specific, relevant evidence, distinct from the first — this can be a different foundational document or specific outside knowledge (such as a named Supreme Court case or statute), not a restatement of the first piece of evidence in different words.',
        'ROW E — REASONING (0-1 point): full credit requires explicitly explaining WHY or HOW the evidence supports the thesis — the logical connection, not just evidence and thesis sitting side by side. This is the row students lose most often.',
        'ROW F — ALTERNATIVE OR OPPOSING PERSPECTIVE (0-1 point): full credit requires identifying a specific opposing or alternative perspective — grounded in something real, like a historical counterexample or a different branch\'s achievement — and responding to it through refutation, concession, or rebuttal, not just noting that disagreement exists.',
        'Total = 6 points, one per row, summed — the authentic AP Gov Argument Essay scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-argument-essay',
      kind: 'try_yourself',
      problem:
        "Develop an argument about whether the federal courts or the elected branches have been more effective at protecting civil rights in the United States.\n\nUse the documents below. In your response you should do the following: (1) respond to the prompt with a defensible thesis or claim that establishes a line of reasoning, (2) support your thesis with at least TWO pieces of specific and relevant evidence, with AT LEAST ONE piece of evidence coming from one of the foundational documents listed (the Declaration of Independence or the Preamble to the U.S. Constitution) — a second piece of evidence can come from the other foundational document or from your own knowledge, (3) use reasoning to explain why or how the evidence you provided supports your thesis, and (4) respond to an opposing or alternative perspective using refutation, concession, or rebuttal.",
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apush-declaration.v1',
        'evelyn.passage.apush-constitution-preamble.v1',
      ],
      expectedAnswer:
        "A full-credit response opens with a thesis arguing that the federal courts have been more effective than the elected branches at protecting civil rights, because the judiciary has proven willing to enforce the nation's founding promise of equality even when elected majorities resisted doing so, and because the courts' structural independence lets them act on that promise before the elected branches are politically able to. As evidence, the essay quotes the Declaration of Independence (Document 1): \"We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights... That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed\" — establishing equality and the securing of rights as a founding constitutional commitment that the government exists to serve. This is the essay's required foundational-document evidence. A second, distinct piece of evidence draws on the Preamble to the Constitution (Document 2): the Constitution is ordained \"in Order to form a more perfect Union, establish Justice... and secure the Blessings of Liberty to ourselves and our Posterity\" — naming \"establish Justice\" as one of the government's core constitutional purposes, a purpose the judiciary is structurally positioned to enforce through judicial review, insulated by Article III life tenure from the electoral pressures that can make elected officials slow to act. Reasoning ties both pieces of evidence to the thesis: the Declaration's equality principle and the Preamble's \"establish Justice\" purpose show that protecting civil rights was a founding commitment, not a modern addition, and because federal judges do not face reelection, courts could enforce that commitment even when doing so was deeply unpopular — as in Brown v. Board of Education (1954), where the Supreme Court declared school segregation unconstitutional under the Equal Protection Clause a full decade before Congress could pass the Civil Rights Act of 1964, showing that judicial enforcement of the founding equality principle led while the elected branches lagged behind. Finally, the essay responds to an opposing perspective: the Civil Rights Act of 1964 and Voting Rights Act of 1965 — passed by the elected branches — reached forms of discrimination, such as private employment discrimination and voter-suppression tactics, that the courts' Equal Protection Clause doctrine (which restrains only government action) could not reach on its own, making the elected branches arguably the more effective protector in practice. The essay concedes this reach advantage is real, but rebuts that the 1964-65 statutes should be understood less as the elected branches independently protecting civil rights and more as those branches being forced to catch up: Martin Luther King Jr.'s 1963 Letter from Birmingham Jail argued that neither the courts alone nor a hoped-for, gradual, negotiated path from elected officials had proven sufficient, and that only sustained, organized nonviolent pressure creating a kind of constructive tension was what finally forced reluctant elected officials to act — meaning the courts' willingness to act first on the Declaration's and Preamble's founding promises, even without an accompanying statute, best explains why civil rights protection expanded at all, with the elected branches' broader reach into private conduct arriving only after courts and sustained pressure had already established the underlying constitutional principle.",
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a defensible claim that responds to the prompt (whether the federal courts or the elected branches have been more effective at protecting civil rights) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not defensible.',
            modelResponse:
              "The federal courts have been more effective than the elected branches at protecting civil rights, because the judiciary has proven willing to enforce the nation's founding promise of equality even when elected majorities resisted doing so, and because the courts' structural independence lets them act on that promise before the elected branches are politically able to.",
          },
          {
            criterionId: 'B-evidence-relevant',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): at least one piece of specific, relevant evidence (quoted or accurately paraphrased) that supports the thesis. No credit (0/1) for a vague reference to a document\'s general topic with no specific content cited.',
            modelResponse:
              'The Declaration of Independence states: "We hold these truths to be self-evident, that all men are created equal... That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed" — establishing equality and the securing of rights as a founding constitutional commitment the government exists to serve.',
          },
          {
            criterionId: 'C-evidence-foundational-doc',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): at least one piece of evidence is drawn specifically from the assigned foundational-document packet (the Declaration of Independence or the Preamble to the Constitution), attributed only to what that document\'s excerpt actually contains. No credit (0/1) if no evidence is drawn from the packet, or if a document is cited for content beyond what its excerpt contains.',
            modelResponse:
              'The equality and consent-of-the-governed evidence is drawn directly from the Declaration of Independence, one of the two assigned foundational documents, satisfying the requirement that at least one piece of evidence come from the document packet.',
          },
          {
            criterionId: 'D-evidence-second',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): a second, distinct piece of specific, relevant evidence — a different foundational document or specific outside knowledge — not a restatement of the first piece of evidence. No credit (0/1) for repeating the first piece of evidence in different words, or for a second piece that is vague or not relevant to the thesis.',
            modelResponse:
              'A second, distinct piece of evidence comes from the Preamble to the Constitution: the Constitution is ordained "in Order to form a more perfect Union, establish Justice... and secure the Blessings of Liberty to ourselves and our Posterity" — naming "establish Justice" as a core constitutional purpose the judiciary is structurally positioned to enforce, distinct from the Declaration\'s evidence about the founding equality principle itself.',
          },
          {
            criterionId: 'E-reasoning',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explicitly explains WHY or HOW the evidence supports the thesis — the logical connection between the specific evidence and the specific claim, not evidence and thesis merely placed side by side. No credit (0/1) for evidence presented with no explanation of its relevance to the thesis.',
            modelResponse:
              "The Declaration's equality principle and the Preamble's \"establish Justice\" purpose show that protecting civil rights was a founding commitment, not a modern addition; because federal judges do not face reelection, courts could enforce that commitment even when doing so was deeply unpopular — as in Brown v. Board of Education (1954), which declared school segregation unconstitutional a full decade before Congress passed the Civil Rights Act of 1964, showing judicial enforcement led while the elected branches lagged behind.",
          },
          {
            criterionId: 'F-alternative-perspective',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): identifies a specific opposing or alternative perspective — grounded in real evidence, such as a named statute or historical episode that cuts against the thesis — and responds to it through refutation, concession, or rebuttal. No credit (0/1) for merely noting that disagreement exists with no specific grounding or no response to it.',
            modelResponse:
              "The Civil Rights Act of 1964 and Voting Rights Act of 1965 — passed by the elected branches — reached forms of discrimination, such as private employment discrimination and voter-suppression tactics, that the courts' Equal Protection Clause doctrine (which restrains only government action) could not reach on its own, making the elected branches arguably the more effective protector in practice. This is answered by conceding that reach advantage is real, but rebutting that the 1964-65 statutes were less the elected branches acting independently than those branches being forced to catch up: as Martin Luther King Jr. argued in his 1963 Letter from Birmingham Jail, only sustained nonviolent pressure creating a kind of constructive tension finally forced reluctant elected officials to act — meaning the courts' willingness to act first on the founding promise of equality and justice best explains why civil rights protection expanded at all.",
          },
        ],
      },
      hints: [
        'Pick ONE clear thesis and build the whole essay around it — don\'t hedge with a list of unconnected claims.',
        'At least one piece of evidence MUST come from the two-document packet; a second piece can be the other document or your own outside knowledge (a named case or statute).',
        'Evidence without reasoning earns partial credit at best — always explain WHY the evidence you cite actually supports your thesis.',
        'For the alternative-perspective row, use a real counterexample (like the Civil Rights Act\'s reach into private conduct) and directly answer it — don\'t just mention that "some might disagree."',
        'The MLK Letter from Birmingham Jail may inform your reasoning in your own words — do not quote it directly, and it is not one of the packet documents.',
      ],
      estimatedMinutes: 32,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Argument Essay is 6 points across six rows: Thesis (1); Evidence-Relevant (1); Evidence-Foundational Document (1, at least one piece from the packet); Evidence-Second (1, a second distinct piece); Reasoning (1, explain WHY the evidence supports the thesis); Alternative Perspective (1, respond to a real objection).',
        'Evidence without reasoning is the single biggest way to lose points — always connect the quotation back to the thesis explicitly.',
        'The Declaration\'s equality principle and the Preamble\'s "establish Justice" purpose together frame civil rights protection as a founding constitutional commitment that courts, insulated from electoral pressure, are structurally positioned to enforce.',
        'The Civil Rights Act of 1964 and Voting Rights Act of 1965 are a strong opposing perspective — but MLK\'s Letter from Birmingham Jail (paraphrased, never quoted) argues sustained pressure, not elected-branch initiative alone, is what forced that legislation.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3-FRQ-ARG',
    cedTitle: 'Unit 3 FRQ Practice — Argument Essay',
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
        note: 'The Declaration of Independence — Document 1 of the two-document packet (APUSH-owned seed, reused for this AP Gov essay).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-constitution-preamble.v1',
        chapter: '1787',
        note: 'Preamble to the U.S. Constitution — Document 2 of the packet (APUSH-owned seed, reused for this AP Gov essay).',
      },
    ],
  },
};
