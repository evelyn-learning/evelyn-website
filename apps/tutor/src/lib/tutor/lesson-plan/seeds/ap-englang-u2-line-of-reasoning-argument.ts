/**
 * AP English Language & Composition — CED Unit 2.3: Line of Reasoning.
 *
 * Builds on 2.2 (selecting and sequencing evidence): individual well-chosen,
 * well-ordered evidence still isn't an argument until the claims and
 * supporting points across an ENTIRE essay are organized into a coherent,
 * logically dependent sequence — a line of reasoning — rather than a list of
 * separate reasons that happen to support the same claim. This topic trains
 * reading FOR a line of reasoning in a tightly-built mentor text (Lincoln)
 * and applying that same discipline to the student's own essay.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * Anchor text: Abraham Lincoln, "The Gettysburg Address" (1863) —
 * evelyn.passage.lincoln-gettysburg.v1, whose compact structure (founding
 * proposition → the war as its test → the dead's consecration → the living's
 * unfinished work) is one of the tightest, least-reorderable lines of
 * reasoning in the American canon.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U2_LINE_OF_REASONING_ARGUMENT: LessonPlan = {
  id: 'evelyn.ap.englang.line-of-reasoning-argument.v1',
  title: 'U2.3 Line of Reasoning',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.line-of-reasoning-argument',
      description:
        "Organize claims and evidence into a coherent line of reasoning in which each supporting point builds on or answers the one before it, and read a text's line of reasoning as a logical sequence rather than a list of topics.",
      standard: 'AP-ENGLANG-2.3',
    },
  ],
  prerequisites: ['apenglang.selecting-evidence'],
  followUps: ['apenglang.counterargument-rebuttal'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel that good ingredients aren\'t a meal — order and connection are what turn separate points into one argument — before naming "line of reasoning."',
      script:
        "Imagine you're handed every ingredient for a great meal — fresh vegetables, good spices, quality meat — but no recipe. Having the ingredients doesn't mean you have a dish; without a sequence (what gets cooked first, what gets added when), you just have a pile of separate items sitting on a counter. The evidence you learned to select and sequence in 2.2 is the same way at the paragraph level — but a whole essay needs the same discipline applied to its BODY PARAGRAPHS, not just the evidence inside one of them. Each point has to build on, or answer a gap left by, the point before it. Otherwise you don't have an argument, you have a list of reasons that happen to support the same claim. Today we learn to build — and to recognize — that connective order: the line of reasoning.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-line-of-reasoning',
      kind: 'concept',
      goal: "Define line of reasoning, distinguish it from a list of reasons, and give students a test for whether an essay's order is actually load-bearing.",
      keyIdeas: [
        "A LINE OF REASONING is the logical sequence connecting a claim to its supporting points, in an order where each point builds on — or answers a gap left by — the one before it, not just a list of separate reasons in whatever order they occurred to the writer.",
        "COMMENTARY makes reasoning VISIBLE to the reader: at the paragraph level (1.4) it connects evidence to a claim; at the ESSAY level, a line of reasoning connects each body paragraph's point to the ones around it, so the reader can follow WHY point two comes after point one, not merely that both happen to support the same claim.",
        "A COHERENT line of reasoning usually has a discoverable logic to its order: cause building to effect, a concession answered before it can be raised by the reader, or points escalating from most easily granted to most decisive.",
        "THE SWAP TEST: could you exchange any two body paragraphs without the essay losing anything? If yes, the paragraphs are a list, not a reasoned sequence — a true line of reasoning would break if reordered, because a later point depends on an earlier one having already been established.",
        "A useful authoring habit is the 'ROADMAP' or reasoning statement — one sentence, usually near the claim, that states the logical order the essay's reasoning will follow, so both writer and reader know what to expect before the first body paragraph starts.",
        "The Gettysburg Address models a tight, unbreakable line of reasoning in miniature: the nation was FOUNDED on the proposition that all are created equal; the war TESTS whether such a nation can endure; the dead have already consecrated this ground beyond what words can add; therefore the LIVING task is to complete the unfinished work, so that government 'of the people, by the people, for the people' does not perish. Each movement depends on the one before it — reordering them would break the logic.",
        "Reading FOR a line of reasoning, rather than summarizing a text's content, means asking: what is the logical hinge connecting THIS point to the NEXT one — and would the argument survive if the two were swapped?",
      ],
      vocabulary: [
        { term: 'line of reasoning', definition: 'the logical sequence connecting a claim to its supporting points, where each builds on or answers the one before it.' },
        { term: 'roadmap / reasoning statement', definition: 'a sentence, usually near the claim, stating the order the essay\'s reasoning will follow.' },
        { term: 'coherence', definition: 'the property of a sequence in which each part depends on, or is answered by, the parts around it.' },
        { term: 'swap test', definition: "checking whether two adjacent points could trade places with no loss — if so, they're a list, not a line of reasoning." },
        { term: 'escalating order', definition: 'a sequence moving from most easily granted to most decisive point.' },
      ],
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-roadmap-sequencing',
      kind: 'worked_example',
      problem:
        "Continuing the same essay (claim: high schools should push start times to 8:30 a.m. or later), the writer has three body-paragraph points ready: (1) academic performance improves with later starts, (2) chronic sleep deprivation harms teen driving safety, (3) logistics concerns (athletics, bus schedules) are real but solvable. Build a coherent line of reasoning — a roadmap sentence — sequencing these three points, modeled on the same kind of unbreakable logic Lincoln uses in the Gettysburg Address (mentioned here in prose; this segment type carries no passageId field).",
      steps: [
        "IDENTIFY THE LOGICAL RELATIONSHIP AMONG THE THREE POINTS. Points 1 and 2 are both BENEFITS of the policy (academic and safety); point 3 is a CONCESSION-AND-ANSWER to the objection a skeptical reader will already be forming.",
        "DECIDE WHICH BENEFIT TO LEAD WITH. Safety (point 2) is arguably the more urgent, higher-stakes benefit — a matter of physical harm, not just performance — so leading with safety, then adding academic performance as a corroborating benefit, escalates from serious to broader rather than the reverse.",
        "DECIDE WHERE THE CONCESSION BELONGS. The logistics concession (point 3) should come LAST, after both benefits are established — answering the objection only once the reader already has reason to want the policy to work, rather than opening with the objection and undercutting momentum before the case is made.",
        "CHECK THE ORDER AGAINST THE SWAP TEST. Could points 2 and 3 be swapped with no loss? No — the concession needs the benefits established first to feel like a solvable cost worth paying, not an opening admission that undercuts the whole case.",
        "WRITE THE ROADMAP SENTENCE. State the reasoning path in one sentence a reader could hold in mind before the first body paragraph: benefits first (safety, then academics), objection last, answered rather than avoided.",
        "NAME THE PRINCIPLE THIS DEMONSTRATES, modeled on Lincoln's own unbreakable sequence: establish the stakes or benefit first, escalate or corroborate, and only then dispose of the objection that would otherwise loom over everything before it.",
      ],
      answer:
        "Roadmap: because the safety cost of sleep-deprived teen driving is the most urgent problem, because academic performance data corroborates that the problem is real and fixable, and because the logistics concerns raised against later start times are real but solvable, high schools should adopt 8:30 a.m. or later start times. This orders the two benefits from most urgent to corroborating and places the concession last — precisely so the reader has already been given a reason to want the policy to succeed before being asked to accept that its costs are manageable.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-lincoln-reasoning',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.lincoln-gettysburg.v1, write ONE sentence stating the line of reasoning Lincoln's address follows — the logical sequence connecting his opening proposition to his closing resolve — naming at least three of the movements in the order they occur (e.g., the founding proposition, the war as a test of that proposition, the dead's consecration, and the living's unfinished task). Do not merely summarize what the speech is about — state the logical SEQUENCE, and be ready to explain why reordering any two movements would weaken the argument.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      rubric: {
        parts: [
          {
            criterionId: 'line-of-reasoning',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): the sentence accurately names at least three of the speech's logical movements IN THEIR ACTUAL ORDER (the founding proposition that all are created equal → the war as the test of whether such a nation can endure → the dead's actions having already consecrated the ground beyond what words can add → the living's task of completing the 'unfinished work' so that government 'of the people, by the people, for the people' does not perish) and frames them as a SEQUENCE with logical dependency — each step depending on or answering the one before — not simply a list of topics covered. Partial credit for naming three or more movements accurately but only as a list ('he talks about the founding, the war, the dead, and the future') with no stated logical connection between them, or for correctly stating the dependency between only two movements. No credit for a sentence that summarizes the speech's general subject (a memorial address about the Civil War) with no named sequence of movements.",
            modelResponse:
              "Lincoln's reasoning moves from the founding proposition that all are created equal, to the Civil War as the live test of whether a nation built on that proposition can endure, to the dead's actions having already consecrated the ground beyond anything a speech could add, and finally to the living's remaining task of completing their \"unfinished work\" so that a government \"of the people, by the people, for the people\" does not perish — each step depending on the one before it, so the final resolve only carries weight because the earlier test and sacrifice were established first.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-topic-list-vs-reasoning',
      kind: 'misconception_check',
      question:
        'A student writes: "Lincoln\'s reasoning is: first he talks about the founding of the nation, then he talks about the war, then he talks about the dead soldiers, then he talks about the future. Each part is about a different topic." Does this correctly describe Lincoln\'s line of reasoning?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Mistaking a TOPIC LIST (this part is about X, this part is about Y) for a LINE OF REASONING (this part depends on, or is answered by, the part before it) — a paragraph-scale version of the summary-vs-analysis trap.',
          correctsTo:
            "No — naming what each section is 'about' describes a sequence of topics, not a line of reasoning. A real line of reasoning states the LOGICAL DEPENDENCY: the war matters as a live TEST of the founding proposition, not just 'a different topic'; the dead's sacrifice is offered as proof that already exceeds anything words could add (which is WHY Lincoln says he cannot 'dedicate' the ground); and the call to unfinished work only carries force because that test and that sacrifice came first. The test: pick any two adjacent movements — can you explain why the SECOND requires or responds to the FIRST, not just that they come one after another? If you can only say what each one is about, you've found a topic list, not a line of reasoning.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "A line of reasoning is a sequence in which each supporting point builds on or answers the one before it — not a list of reasons that happen to support the same claim.",
        "The swap test: if two adjacent points could trade places with no loss, they're a list, not a line of reasoning.",
        "A roadmap sentence, stated early, tells both writer and reader the logical order the essay will follow.",
        "Reliable orders include escalating (most easily granted to most decisive) and concession-answered-last (benefits established before an objection is addressed).",
        "Reading FOR a line of reasoning means naming the logical hinge between adjacent points, not just what each part is 'about.'",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '2',
    cedTopic: '2.3',
    cedTitle: 'Line of Reasoning',
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '2',
        note: 'AP English Language and Composition Course and Exam Description, Unit 2 — organizing claims and evidence into a coherent line of reasoning (Row B logic, beyond single-paragraph evidence and commentary).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.lincoln-gettysburg.v1',
        chapter: '1863',
        note: 'Abraham Lincoln, "The Gettysburg Address" — anchor text for reading a tightly-sequenced, logically dependent line of reasoning.',
      },
    ],
  },
};
