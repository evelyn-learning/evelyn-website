/**
 * AP English Language & Composition — Unit 2 FRQ Practice: the full
 * Argument essay (AP Lang Free-Response Question 3).
 *
 * This is the FRQ-practice plan (see project catalog convention) that
 * closes out Unit 2: after building a defensible argument (2.1), selecting
 * and using evidence (2.2), developing a line of reasoning (2.3), handling
 * counterargument and rebuttal (2.4), and framing an argument with a strong
 * introduction/conclusion (2.5), students now write ONE complete Argument
 * essay under real AP Lang task conditions and are scored against the
 * authentic AP Lang 6-point rubric (Thesis 1 / Evidence & Commentary 4 /
 * Sophistication 1 — the same three-row scale as the Rhetorical Analysis
 * and Synthesis FRQs, NOT the STEM 9-point convention; see
 * docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md D4/§2).
 *
 * Unlike Rhetorical Analysis and Synthesis, the Argument task supplies NO
 * source passage — the student argues a position on a general claim using
 * evidence of their own choosing (reading, history, current events,
 * observation, or personal experience). No `passageId`/`passageIds` on the
 * try_yourself segment is therefore correct, not an omission.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U2_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.englang.u2-frq-practice.v1',
  title: 'U2 FRQ Practice — Argument Essay',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.u2-frq-practice',
      description:
        'Write a complete AP Lang Argument essay — a defensible thesis taking a position on a given claim, evidence-backed commentary developing a line of reasoning (drawn from the student\'s own knowledge and experience), and sophistication — scored against the authentic AP Lang 6-point rubric.',
      standard: 'AP-ENGLANG-2-FRQ',
    },
  ],
  prerequisites: [
    'apenglang.building-an-argument',
    'apenglang.selecting-evidence',
    'apenglang.line-of-reasoning-argument',
    'apenglang.counterargument-rebuttal',
    'apenglang.intros-conclusions',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full Argument essay concrete before the student sits down to write one — and flag that this task, unlike the other two FRQs, gives no passage to lean on.',
      script:
        "Every skill from this unit — building a defensible argument, selecting evidence, developing a line of reasoning, handling counterargument, and framing with a strong intro and conclusion — exists to make ONE thing possible: writing a complete Argument essay under real exam conditions. That's FRQ 3 on the AP Lang exam, scored on the same 6-point rubric as the other two essays — Thesis (1 point), Evidence & Commentary (4 points), Sophistication (1 point). The twist: there's no passage to read. You get a claim, and you have to argue your own position using evidence YOU supply — history, reading, current events, or your own observation. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-frq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the AP Lang Argument task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: you\'re given a short claim or quotation about a debatable issue. Write an essay that argues YOUR position on the extent to which the claim is valid — not a summary of the claim, not a report on "both sides," a position you defend.',
        'The essay must: (1) respond with a defensible thesis that takes a position, (2) select and use specific, relevant evidence — NOT from a passage this time, but from your own reading, history, current events, or experience, (3) explain HOW that evidence supports your line of reasoning (commentary, not just a list of examples), and (4) use appropriate grammar and control of language throughout.',
        'ROW A — THESIS (0–1 point): full credit requires a thesis that clearly takes a defensible position on the prompt\'s claim — not a restatement of the claim, not "there are many sides to this issue," not a thesis that merely summarizes without taking a stance.',
        'ROW B — EVIDENCE & COMMENTARY (0–4 points): the largest row. Full credit (4/4) requires specific, relevant evidence for a line of reasoning AND commentary that explains how each piece of evidence supports the student\'s claimed position — not just naming an example and moving on. Two or three well-developed pieces of evidence beat five that are only named.',
        'ROW C — SOPHISTICATION (0–1 point): earned holistically for things like explaining the complexities of the issue (acknowledging and responding to a counterargument, qualifying the claim rather than arguing an absolute), situating the argument in a broader context, or employing a vivid and persuasive prose style throughout — NOT awarded for a few sophisticated-sounding words.',
        'The #1 scoring trap on the Argument essay is generic, underdeveloped evidence: naming an example ("the Civil Rights Movement," "the printing press") without ever explaining HOW it proves the thesis. Every piece of evidence needs its own paragraph of "here is why this supports my position."',
        'Total = 6 points, integer, summed across the three rows — the same authentic AP Lang scale used for the Rhetorical Analysis and Synthesis FRQs.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-argument',
      kind: 'try_yourself',
      problem:
        'Many thinkers have argued that a society or community makes its most important progress not through comfortable agreement but through vigorous disagreement. As one writer put it: "It is disagreement, not consensus, that forces a community to test its assumptions and discover what is actually true." Write an essay that argues your position on the extent to which this claim is valid. In your response you should do the following: (1) respond to the prompt with a thesis that presents a defensible position, (2) select and use specific evidence to support your line of reasoning, (3) explain how the evidence supports your line of reasoning, and (4) demonstrate a sophisticated understanding of the rhetorical situation.',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a defensible thesis that takes a clear position on the claim (e.g. that disagreement, not consensus, is usually what drives real progress, because agreement tends to preserve whatever assumptions a group already holds) rather than merely restating the prompt or listing "both sides." The body then selects 2-3 specific, well-chosen pieces of evidence from the student\'s own knowledge — for example, a scientific case where a lone dissenting hypothesis overturned a comfortable consensus, a social or political movement that only advanced because someone refused to accept the prevailing agreement, and/or a personal or organizational example of a decision improved by someone raising an uncomfortable objection — and for EACH piece explains HOW it supports the thesis (e.g. naming specifically what the prevailing consensus was, who disagreed, and what changed as a result) rather than just naming the example and moving on. Commentary consistently ties each piece of evidence back to the stated position, building one coherent line of reasoning rather than a list of unconnected examples. Sophistication is shown by qualifying the claim rather than treating it as absolute — e.g. acknowledging that unchecked disagreement without any shared standard for evaluating claims can produce paralysis or fracture rather than progress, then explaining why productive disagreement (grounded in evidence, aimed at a shared goal) is different from disagreement for its own sake — expressed in precise, controlled prose throughout.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis takes a clear, defensible position on the extent to which disagreement (rather than consensus) drives genuine progress — it may qualify the claim (e.g. "disagreement drives progress only when it is grounded in evidence and aimed at a shared goal") but it must assert a position, not just restate the prompt. No credit (0/1) for a thesis that only restates the claim, lists "there are many perspectives on this issue" without taking one, or summarizes the prompt\'s wording without asserting the student\'s own stance.',
            modelResponse:
              'Although comfortable agreement can hold a community together in the short term, real progress — scientific, moral, or civic — depends on someone being willing to name what everyone else has quietly agreed not to question, which is why productive disagreement, not consensus, is the actual engine of a society\'s advancement.',
          },
          {
            criterionId: 'B-evidence-commentary',
            maxPoints: 4,
            scoringCriteria:
              'Full credit (4/4): the essay consistently selects specific, well-chosen evidence (historical, scientific, literary, current-events, or well-developed personal/observational examples) and, for each, explains HOW that evidence supports the thesis and WHY the disagreement it describes produced the claimed benefit — building a consistent line of reasoning connected to the stated position across the whole essay, not a list of examples that are only named. 3/4: mostly specific evidence with commentary that explains the connection for most but not all points, or a line of reasoning that is present but not fully consistent. 2/4: evidence is present but commentary is thin, mostly names the example rather than explaining how it supports the thesis, or the line of reasoning is only partially developed. 1/4: evidence is mostly general or one unsupported assertion with little to no explanation. 0/4: no relevant evidence, or evidence that does not connect to the claimed position at all.',
            modelResponse:
              'Consider a case where a widely accepted scientific consensus was overturned only because a single researcher refused to accept it and kept testing an unpopular alternative — the community\'s eventual agreement came only after that disagreement had already done the work of exposing where the accepted view was wrong. The same pattern shows up in social change: a prevailing consensus that a given arrangement is simply "how things are" rarely gets questioned by people who accept it, and it is almost always the people willing to publicly disagree with that consensus — often at real personal cost — who force the community to reexamine assumptions it had stopped noticing it was making. Even at a smaller scale, in a workplace or classroom, a group that quickly reaches agreement often does so by quietly ignoring an objection that turns out to matter; the decisions that hold up best are usually the ones where someone was willing to be the dissenting voice long enough for the group to actually address the objection rather than talk over it. In each case, it is not the agreement that produces the improvement — it is the friction beforehand that forces the group to test what it assumed was already settled.',
          },
          {
            criterionId: 'C-sophistication',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically — e.g. the essay qualifies the claim by acknowledging a counterargument (disagreement without a shared standard for evaluating claims can produce paralysis, fracture, or bad-faith obstruction rather than progress) and explains what distinguishes productive disagreement from disagreement for its own sake, situates the issue in a broader context, or sustains a precise, controlled prose style throughout. No credit (0/1) for merely inserting elevated vocabulary, an isolated sophisticated-sounding sentence unconnected to the essay\'s argument, or unclear/imprecise prose that undercuts the analysis.',
            modelResponse:
              'None of this means disagreement is valuable by itself — a group that argues constantly but never tests its objections against evidence, or that treats every dissent as equally credible regardless of its basis, ends up paralyzed rather than improved. What actually drives progress is disagreement disciplined by a shared commitment to finding out what is true, which is exactly what separates the dissenting scientist who kept testing from someone who simply refuses to agree with anything.',
          },
        ],
      },
      hints: [
        'Start by taking an actual position — not "there are pros and cons," but a specific claim about the extent to which you agree.',
        'Pick 2-3 pieces of evidence you can develop in real depth rather than five you can only name.',
        'For each piece of evidence, spell out WHY it supports your thesis — what was the prevailing agreement, who or what disagreed, and what changed?',
        'Consider qualifying your claim (not "disagreement is always good" but "disagreement drives progress when...") — that qualification is often where sophistication credit comes from.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The AP Lang Argument task gives you a claim, not a passage — you supply your own evidence from reading, history, current events, or experience.',
        'The 6-point rubric: Thesis (1) — a defensible position on the claim; Evidence & Commentary (4) — specific evidence explained through a consistent line of reasoning; Sophistication (1) — earned holistically, often through a qualified claim.',
        'Naming an example is not evidence credit — every piece of evidence needs commentary explaining HOW it supports your position.',
        'A thesis that qualifies the claim (rather than arguing an absolute) is often the easiest path to sophistication credit.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2-FRQ',
    cedTitle: 'Unit 2 FRQ Practice — Argument Essay',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP Lang Argument FRQ (Question 3) task wording and 6-point rubric (Thesis 1 / Evidence & Commentary 4 / Sophistication 1).',
      },
    ],
  },
};
