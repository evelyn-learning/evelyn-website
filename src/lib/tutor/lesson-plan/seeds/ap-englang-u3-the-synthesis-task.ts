/**
 * AP English Language & Composition — CED Unit 3.1: The Synthesis Task.
 *
 * The entry point of the synthesis unit. Before a student can write a
 * synthesis essay, they have to understand what the task actually asks for:
 * reading several sources on ONE shared, debatable issue, then forming an
 * ORIGINAL position of their own that the sources support — not reporting
 * what each source individually says. This plan draws on a synthesis SOURCE
 * SET (Douglass 1852, Henry 1775, Lincoln 1863) that all speak to a shared
 * question: what "liberty" and "equality" mean in America, and to whom the
 * promise applies. The full multi-source ESSAY is a later pass; this plan
 * teaches the component skill of naming the shared issue and staking out a
 * defensible position at the sentence grain.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * Anchor text: Abraham Lincoln, "The Gettysburg Address" (1863) —
 * evelyn.passage.lincoln-gettysburg.v1 — chosen because its "conceived in
 * Liberty, and dedicated to the proposition that all men are created equal"
 * states the shared issue most directly. Henry's 1775 speech and Douglass's
 * 1852 speech are discussed in prose as the other members of the source set;
 * quotes are limited to short structural/rhetorical phrases already used
 * elsewhere in the unit.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U3_THE_SYNTHESIS_TASK: LessonPlan = {
  id: 'evelyn.ap.englang.the-synthesis-task.v1',
  title: 'U3.1 The Synthesis Task',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.the-synthesis-task',
      description:
        'Explain what a synthesis essay requires (reading multiple sources on one shared, debatable issue) and state a defensible position on such an issue, distinct from summarizing any single source.',
      standard: 'AP-ENGLANG-3.1',
    },
  ],
  prerequisites: ['apenglang.evidence-commentary', 'apenglang.defensible-thesis'],
  followUps: ['apenglang.citing-attributing-sources'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel the difference between reporting what witnesses said and forming their own conclusion from multiple accounts.',
      script:
        "Imagine you're a journalist investigating a car accident with three witnesses. Witness one says the light was green. Witness two says it happened too fast to tell. Witness three says the other driver was speeding. Your job isn't to write three paragraphs — 'Witness one said this, witness two said that, witness three said this' — and stop. Your job is to read across all three accounts and decide, and argue, what actually happened, using each witness's account as evidence for YOUR conclusion. That's exactly what a synthesis essay asks you to do with written sources instead of witnesses: read several takes on the same issue, then build YOUR OWN argument, using them as support.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-synthesis-task',
      kind: 'concept',
      goal: 'Define what a synthesis essay is, what a shared "issue" looks like across sources, and the two traps that make an attempt not-yet-synthesis.',
      keyIdeas: [
        'SYNTHESIS means taking multiple sources on the same debatable issue and using them to build YOUR OWN original argument — not reporting what each source says, one at a time, in sequence.',
        'Every synthesis task starts from an ISSUE: a real, unsettled question (not a settled fact) that the sources approach from different angles, moments, or positions.',
        "Sources in a synthesis set don't have to agree with each other — the strongest synthesis essays often use sources that see the issue differently, and treat the disagreement itself as material for the writer's own claim.",
        'A SOURCE SET example: Patrick Henry (1775) demands liberty from Britain; Frederick Douglass (1852) shows that the nation\'s promise of liberty and equality was not extended to enslaved people; Abraham Lincoln (1863) reasserts the founding proposition that "all men are created equal" as "unfinished work." Three moments, three angles, one shared issue: what does America\'s promise of liberty and equality actually mean, and to whom does it apply?',
        'Before writing a single essay sentence, a synthesis writer must be able to state the SHARED ISSUE in one sentence, and only then decide their OWN position on it.',
        'TRAP 1 — the essay is NOT a source-by-source book report ("Source A says X. Source B says Y. Source C says Z.") with no throughline connecting them.',
        'TRAP 2 — the essay is NOT a neutral summary of "how the sources differ" with no position taken. Synthesis is scored on how well the WRITER\'s own argument uses the sources as evidence, not on how thoroughly every source got mentioned.',
      ],
      vocabulary: [
        { term: 'synthesis', definition: 'building an original argument by drawing on multiple sources that address the same issue.' },
        { term: 'issue', definition: 'a real, debatable question — not a settled fact — that multiple sources speak to from different angles.' },
        { term: 'source set', definition: 'the group of texts provided for a synthesis task, chosen because they all bear on one shared issue.' },
        { term: 'position', definition: "the writer's own defensible claim on the issue, which the sources are used to support." },
      ],
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-name-issue-take-position',
      kind: 'worked_example',
      problem:
        'Given a source set of three speeches on liberty and equality in America — Patrick Henry\'s 1775 "Give Me Liberty or Give Me Death" (evelyn.passage.henry-give-me-liberty.v1), Frederick Douglass\'s 1852 "What to the Slave Is the Fourth of July?" (evelyn.passage.douglass-fourth-of-july.v1), and Abraham Lincoln\'s 1863 Gettysburg Address (evelyn.passage.lincoln-gettysburg.v1) — name the shared issue these sources speak to, and take a position on it.',
      steps: [
        'READ ACROSS THE SET, NOT SOURCE BY SOURCE. Instead of asking "what is each speech about," ask what single question all three could be used to answer.',
        'NOTICE THE COMMON THREAD. All three invoke "liberty" and, explicitly or implicitly, the question of who it belongs to: Henry claims it for the colonies against Britain; Douglass shows it was withheld from enslaved people even as the nation celebrated it; Lincoln reasserts the founding claim that "all men are created equal" as work still unfinished in 1863.',
        'DISTILL THE SHARED ISSUE IN ONE SENTENCE. "Does America\'s founding promise of liberty and equality automatically apply to everyone, or does it require ongoing effort to extend and defend?"',
        'NOTICE THE SOURCES GIVE DIFFERENT ANGLES ON THE SAME ISSUE, NOT THE SAME ANSWER. Henry treats liberty as something to be seized through immediate action; Douglass shows the promise excluding an entire group entirely; Lincoln treats the promise as real but incomplete, requiring "increased devotion" to finish.',
        'TAKE YOUR OWN POSITION. Not "the sources disagree" (an observation about the sources) but a specific, defensible claim: e.g., "the promise of liberty and equality has never been self-executing — each generation has had to actively demand or defend it rather than simply inherit it."',
        'VERIFY THE POSITION IS AN ARGUMENT, NOT A SUMMARY. Check: could all three speeches be cited as evidence FOR this claim, in different ways? If yes, it is a genuine synthesis position, not a restatement of what the sources say.',
      ],
      answer:
        'Shared issue: whether America\'s founding promise of liberty and equality automatically applies to everyone or must be actively extended. Position: the promise of liberty and equality has never been self-executing — each generation has had to actively demand it (Henry), confront its exclusions (Douglass), or renew the unfinished work of fulfilling it (Lincoln), rather than simply inherit it complete.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-defensible-position',
      kind: 'try_yourself',
      problem:
        "Consider the issue: 'Does America's founding promise of liberty and equality for all people apply automatically, or does it require ongoing struggle to extend it?' Write ONE sentence stating YOUR OWN defensible position on this issue — a claim a reasonable person could argue against, not a summary of what any single source says and not a restatement of the question. You do not need to name a specific source yet.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      rubric: {
        parts: [
          {
            criterionId: 'position',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): a single sentence that states a genuine, arguable position on the stated issue (a reasonable reader could hold the opposite view), is specific enough that a reader could predict what kind of evidence would support it, and is NOT a restatement of the prompt's question or a description of what a source says. Partial credit for a position that is arguable but too vague to predict what evidence would support it (e.g. 'liberty is complicated'), or that gestures at a stance but hedges into false neutrality ('it depends on how you look at it'). No credit for restating the prompt as a 'claim,' describing a source's content instead of taking a position, or a statement that is simply a fact no reasonable reader could contest.",
            modelResponse:
              "America's promise of liberty and equality has never been self-executing — it has only ever been made real when someone was willing to demand it, expose where it was being denied, or insist that the work of fulfilling it was not yet finished.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-source-by-source',
      kind: 'misconception_check',
      question:
        'A student plans their synthesis essay like this: "Paragraph 1 will be about what Henry says. Paragraph 2 will be about what Douglass says. Paragraph 3 will be about what Lincoln says." Is this a good plan for a synthesis essay?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Believing that covering each source thoroughly, one at a time, IS the synthesis task — the source-by-source book-report trap.',
          correctsTo:
            'No — this plan organizes the essay around the SOURCES instead of around an ARGUMENT. Even if each paragraph is accurate and well-written, a reader finishing the essay would know what each speech says but would not know what the WRITER thinks the answer to the shared issue is. A synthesis essay needs a position first — "the promise of liberty has never been self-executing" — and THEN pulls whichever source (or sources) best supports each part of that argument. A source can appear in more than one paragraph, or not get its own paragraph at all; the organizing principle is the writer\'s reasoning, not an even tour of the reading list.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Synthesis means using multiple sources on one shared issue to build YOUR OWN original argument — not reporting each source in turn.',
        'Every synthesis task starts from an ISSUE: a real, debatable question the sources approach from different angles, not a fact they all confirm.',
        'Sources in a set do not need to agree — disagreement between sources is often the strongest fuel for a writer\'s own position.',
        'Two traps to avoid from day one: the source-by-source book report, and false neutrality (describing disagreement without ever taking a position).',
        'Before writing, state the shared issue in one sentence, then state your own defensible position on it in one more.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.1',
    cedTitle: 'The Synthesis Task',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP English Language' },
    ],
  },
};
