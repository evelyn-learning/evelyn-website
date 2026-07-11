/**
 * AP English Language & Composition — CED Unit 3.5: Line of Reasoning with
 * Multiple Sources.
 *
 * The organizing capstone of the synthesis unit's component skills: once a
 * student can take a position (3.3) and integrate evidence from two sources
 * in one paragraph (3.4), the last piece is ORGANIZING a whole synthesis
 * argument — sequencing reasons (not sources) so the essay builds toward the
 * thesis rather than touring the reading list. Builds directly on Unit 2's
 * line-of-reasoning skill, now applied across a multi-source set.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * Anchor text: Patrick Henry, "Give Me Liberty or Give Me Death" (1775) —
 * evelyn.passage.henry-give-me-liberty.v1 (primary passageId), discussed
 * alongside Frederick Douglass's 1852 speech and Lincoln's 1863 Gettysburg
 * Address in prose as the full three-source synthesis set. Quotes are
 * limited to the short structural/rhetorical phrases already used as anchor
 * evidence for these speeches elsewhere in the course.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U3_SYNTHESIS_LINE_OF_REASONING: LessonPlan = {
  id: 'evelyn.ap.englang.synthesis-line-of-reasoning.v1',
  title: 'U3.5 Line of Reasoning with Multiple Sources',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.synthesis-line-of-reasoning',
      description:
        'Organize a synthesis argument by sequencing reasons that build toward a thesis, assigning source evidence to whichever reason it best supports, rather than defaulting to one paragraph per source.',
      standard: 'AP-ENGLANG-3.5',
    },
  ],
  prerequisites: ['apenglang.integrating-evidence', 'apenglang.line-of-reasoning-argument'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel the difference between calling witnesses in random order and sequencing them to build a case.',
      script:
        "Imagine a lawyer building a case with three witnesses. A weak lawyer calls them in whatever order they happen to be available — witness order becomes the plan. A strong lawyer sequences them so each testimony builds on the last: establish the baseline, then show the violation, then show what's still unresolved — so the jury's understanding grows with every witness, toward one verdict. A synthesis essay works the same way: the sources don't dictate your paragraph order — YOUR reasons do, and each source gets called into whichever reason it serves best, even more than once.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-synthesis-line-of-reasoning',
      kind: 'concept',
      goal: 'Define how a line of reasoning organizes a multi-source synthesis argument, and name the default trap this replaces.',
      keyIdeas: [
        "A LINE OF REASONING (Unit 2) is the logical sequence of claims an essay builds, paragraph by paragraph, toward proving its thesis. In a synthesis essay, that sequence is built from evidence drawn across MULTIPLE sources rather than one text's evidence throughout.",
        'ORGANIZING OPTION 1 — BY REASON: each body paragraph argues a different dimension or reason supporting the position, pulling from whichever source(s) best support THAT reason. A single source can be reused across paragraphs for different reasons.',
        'ORGANIZING OPTION 2 — BY PROGRESSIVE COMPLICATION: sequence paragraphs so the claim builds or deepens — e.g. establish the ideal, show where it was violated, show the ongoing struggle to close the gap — rather than treating each paragraph as an independent, interchangeable point.',
        'THE DEFAULT TRAP: organizing "one paragraph per source" by default tends to collapse back into the source-summary trap (3.3/3.4), because the organizing principle becomes the SOURCES rather than the writer\'s REASONS.',
        'A source may appear in more than one paragraph if it genuinely supports more than one reason — reuse is expected; forcing even, one-turn-each distribution across sources is not the goal.',
        'TRANSITIONS between paragraphs should connect REASONS to each other ("Beyond the need for immediate action, an even deeper problem is...") rather than announce a source-switch ("Turning now to Source B...").',
        'A strong synthesis line of reasoning can be stated as a ROADMAP SENTENCE in the introduction: reason one, THEN reason two, THEN reason three — each building toward, not simply sitting alongside, the thesis.',
      ],
      vocabulary: [
        { term: 'synthesis line of reasoning', definition: 'the sequence of reasons a synthesis essay builds, paragraph by paragraph, toward its thesis.' },
        { term: 'by-reason organization', definition: 'structuring paragraphs around distinct reasons, drawing whichever source(s) best support each one.' },
        { term: 'source-by-source trap', definition: 'defaulting to one paragraph per source, which collapses the essay back into summary.' },
        { term: 'roadmap sentence', definition: "an introduction sentence previewing the ordered reasons the essay will argue, in sequence." },
      ],
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-build-line-of-reasoning',
      kind: 'worked_example',
      problem:
        'Given the thesis "the promise of liberty and equality has never been self-executing — it has always required someone to demand it and someone to insist it be renewed," build a three-reason line of reasoning across Patrick Henry\'s 1775 speech (evelyn.passage.henry-give-me-liberty.v1, referenced in prose since this segment type carries no passageId field), Frederick Douglass\'s 1852 speech, and Lincoln\'s 1863 Gettysburg Address.',
      steps: [
        'IDENTIFY THE THESIS\'S IMPLICIT REASONS. Liberty must be actively DEMANDED when threatened (Henry); liberty is not equally extended unless someone forces the exclusion into view (Douglass); liberty must be RENEWED across generations rather than assumed complete (Lincoln).',
        'SEQUENCE THE REASONS LOGICALLY, NOT BY SOURCE ORDER. Order them so the claim escalates: first, liberty requires demanding it (a call to action); second, liberty as claimed is not equally distributed (a complication — WHO gets it); third, even where liberty is claimed, the work of fulfilling it is never finished (the deepest, most general point).',
        'ASSIGN EVIDENCE PARAGRAPH BY PARAGRAPH. Paragraph 1 (demand): Henry\'s "we must fight!" Paragraph 2 (exclusion): Douglass\'s "this Fourth of July is yours, not mine." Paragraph 3 (renewal): Lincoln\'s "unfinished work" and "new birth of freedom."',
        'DRAFT TRANSITIONS THAT CONNECT REASONS, NOT SOURCES. Between paragraphs 1 and 2: "But demanding liberty for oneself does not guarantee it is extended to everyone else." Between paragraphs 2 and 3: "And even when a nation acknowledges that gap, closing it turns out to be an ongoing project, not a single correction."',
        'STATE THE ROADMAP SENTENCE FOR THE INTRODUCTION. "Securing liberty has always required someone willing to demand it, someone willing to expose whom it excluded, and someone willing to insist that fulfilling it remains unfinished work."',
        'VERIFY NO PARAGRAPH IS ORGANIZED AROUND "COVERING" A SOURCE. Each paragraph\'s job is to prove ITS reason; the source is there because it is the best available evidence for that specific step, not because it hasn\'t had its turn yet.',
      ],
      answer:
        'Roadmap: "Securing liberty has always required someone willing to demand it, someone willing to expose whom it excluded, and someone willing to insist that fulfilling it remains unfinished work." Reason 1 (demand) uses Henry\'s "we must fight!"; reason 2 (exclusion) uses Douglass\'s "this Fourth of July is yours, not mine"; reason 3 (renewal) uses Lincoln\'s "unfinished work" — sequenced to escalate the claim rather than simply taking each source in turn.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-roadmap-sentence',
      kind: 'try_yourself',
      problem:
        'Consider the thesis: "Securing liberty has always required active, ongoing effort rather than passive inheritance." Write ONE roadmap sentence — the kind that would open a synthesis essay\'s body — that lays out TWO OR THREE distinct REASONS (not source names) your essay would argue, in the order you would argue them, to support this thesis. Do not simply list which sources you would use; state the reasoning steps themselves.',
      responseFormat: 'free',
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      rubric: {
        parts: [
          {
            criterionId: 'roadmap',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): a single sentence naming two or three distinct, logically ordered REASONS (not sources) that would each support the stated thesis, phrased so a reader could tell what each body paragraph will argue and why that order builds toward (rather than merely lists alongside) the thesis. Partial credit (3-4) for a roadmap that names plausible reasons but in an order with no logical escalation or connection between them, or that names only one reason when the task called for two or three. Partial credit (1-2) for a roadmap that names sources instead of reasons (e.g. 'first I will discuss Henry, then Douglass, then Lincoln') with no reasoning content. No credit for a sentence that restates the thesis with no distinct reasons, or lists unrelated claims with no connection to the thesis.",
            modelResponse:
              'Securing liberty has always required, first, people willing to demand it in moments of open threat; second, people willing to expose whom that liberty had failed to include; and third, people willing to insist, even generations later, that the work of extending it was still unfinished.',
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-one-paragraph-per-source',
      kind: 'misconception_check',
      question:
        'A student organizes their essay as "Paragraph 1: Henry. Paragraph 2: Douglass. Paragraph 3: Lincoln," giving each source exactly one paragraph and equal space. Is this a strong line of reasoning?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Believing that giving each source its own paragraph, in equal proportion, constitutes an organized argument — the source-by-source default trap.',
          correctsTo:
            "No — this structure is organized around the SOURCES, not the writer's REASONS, which tends to collapse the essay back into summary even if each paragraph is well-written on its own. A strong line of reasoning is organized around the steps of the ARGUMENT: what does the writer need to prove first, second, and third to build the thesis? Only after that sequence is set should evidence be assigned to each step — and a source may end up serving two reasons, or a single reason might need two sources, while another reason might not use a given source at all. Equal, one-per-paragraph coverage is a sign the organizing principle is the reading list, not the reasoning.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A synthesis line of reasoning sequences REASONS, paragraph by paragraph, toward the thesis — evidence is drawn from whichever source best supports each reason.',
        'Two reliable organizing options: by-reason (each paragraph argues a distinct dimension) or by-progressive-complication (each paragraph deepens the claim).',
        'Avoid the default trap: "one paragraph per source" tends to collapse the essay back into summary because sources, not reasons, become the organizing principle.',
        'A source can be reused across paragraphs for different reasons — forced even distribution is not the goal.',
        'Transitions should connect reasons to each other, not announce a switch from one source to the next; a roadmap sentence previews the reasons in argued order.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.5',
    cedTitle: 'Line of Reasoning with Multiple Sources',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP English Language' },
    ],
  },
};
