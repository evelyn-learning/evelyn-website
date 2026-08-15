/**
 * AP English Language & Composition — Unit 3 CED 3.5: Line of Reasoning
 * with Multiple Sources.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.synthesis-line-of-reasoning.v1`). The organizing
 * capstone of the synthesis unit: sequencing REASONS (not sources) so a
 * multi-source essay builds toward its thesis rather than touring the
 * reading list.
 *
 * Anchor texts referenced in the method's example: Patrick Henry (1775),
 * Frederick Douglass (1852), and Abraham Lincoln (1863) — the full
 * three-source synthesis set used across the unit. Quotes are limited to
 * short structural phrases already used as anchor evidence for these
 * speeches elsewhere in the course.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_SYNTHESIS_LINE_OF_REASONING: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.synthesis-line-of-reasoning.v1',
  course: 'AP English Language & Composition',
  cedUnit: 3,
  cedTopic: '3.5',
  cedTitle: 'Line of Reasoning with Multiple Sources',
  planId: 'evelyn.ap.englang.synthesis-line-of-reasoning.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.synthesis-line-of-reasoning.v1' }],
  theory: [
    {
      loId: 'apenglang.synthesis-line-of-reasoning',
      kind: 'definition',
      title: 'synthesis line of reasoning',
      content:
        'The sequence of reasons a synthesis essay builds, paragraph by paragraph, toward its thesis. In a synthesis essay, that sequence is built from evidence drawn across MULTIPLE sources rather than one text\'s evidence throughout.',
    },
    {
      loId: 'apenglang.synthesis-line-of-reasoning',
      kind: 'framework',
      title: 'by-reason organization',
      content:
        'Each body paragraph argues a different dimension or reason supporting the position, pulling from whichever source(s) best support THAT reason. A single source can be reused across paragraphs for different reasons.',
    },
    {
      loId: 'apenglang.synthesis-line-of-reasoning',
      kind: 'framework',
      title: 'by-progressive-complication organization',
      content:
        'Paragraphs are sequenced so the claim builds or deepens — e.g. establish the ideal, show where it was violated, show the ongoing struggle to close the gap — rather than treating each paragraph as an independent, interchangeable point.',
    },
    {
      loId: 'apenglang.synthesis-line-of-reasoning',
      kind: 'trap',
      title: 'the source-by-source default trap',
      content:
        'Organizing "one paragraph per source" by default tends to collapse back into the source-summary trap (3.3/3.4), because the organizing principle becomes the SOURCES rather than the writer\'s REASONS. A source may appear in more than one paragraph, or a reason might need two sources — forcing even, one-turn-each distribution across sources is not the goal.',
    },
    {
      loId: 'apenglang.synthesis-line-of-reasoning',
      kind: 'strategy',
      title: 'transitions connect reasons, not sources',
      content:
        'Transitions between paragraphs should connect REASONS to each other ("Beyond the need for immediate action, an even deeper problem is...") rather than announce a source-switch ("Turning now to Source B...").',
    },
    {
      loId: 'apenglang.synthesis-line-of-reasoning',
      kind: 'definition',
      title: 'roadmap sentence',
      content:
        'An introduction sentence previewing the ordered reasons the essay will argue, in sequence: reason one, THEN reason two, THEN reason three — each building toward, not simply sitting alongside, the thesis.',
    },
    {
      loId: 'apenglang.synthesis-line-of-reasoning',
      kind: 'strategy',
      title: 'a source may serve more than one reason',
      content:
        'Reuse is expected, not a flaw: a single source can be cited under two different reasons if it genuinely supports both, and a given reason might need two sources while another reason uses only one. Equal, one-per-paragraph coverage of the source set is a sign the organizing principle is the reading list, not the reasoning.',
    },
    {
      loId: 'apenglang.synthesis-line-of-reasoning',
      kind: 'rhetorical-device',
      title: 'sequencing three reasons across the source set',
      content:
        'For the thesis that liberty has never been self-executing, the reasons can be sequenced to escalate: first, liberty requires demanding it when threatened (Henry\'s "we must fight!"); second, liberty as claimed is not equally distributed (Douglass\'s exclusion from the Fourth of July); third, even where liberty is claimed, the work of fulfilling it is never finished (Lincoln\'s "unfinished work"). The order goes from a call to action, to a complication about who liberty covers, to the deepest, most general point.',
    },
  ],
  methods: [
    {
      title: 'Build a by-reason roadmap across a multi-source set',
      when_to_use:
        'Use once individual paragraph-level integrations (3.4) are drafted and the whole essay needs organizing around reasons rather than a source-by-source tour.',
      steps: [
        'IDENTIFY THE THESIS\'S IMPLICIT REASONS — what would need to be true, in sequence, for the thesis to be established?',
        'SEQUENCE THE REASONS LOGICALLY, NOT BY SOURCE ORDER — order them so the claim escalates from a first point to a deeper, more general one.',
        'ASSIGN EVIDENCE PARAGRAPH BY PARAGRAPH — pick whichever source(s) best support each reason, allowing reuse.',
        'DRAFT TRANSITIONS THAT CONNECT REASONS, NOT SOURCES.',
        'STATE THE ROADMAP SENTENCE FOR THE INTRODUCTION, previewing the reasons in argued order.',
        'VERIFY NO PARAGRAPH IS ORGANIZED AROUND "COVERING" A SOURCE — each paragraph\'s job is to prove its reason.',
      ],
      example: {
        problem:
          "Given the thesis \"the promise of liberty and equality has never been self-executing — it has always required someone to demand it and someone to insist it be renewed,\" build a three-reason line of reasoning across Henry (1775), Douglass (1852), and Lincoln (1863).",
        solution:
          "Roadmap: \"Securing liberty has always required someone willing to demand it, someone willing to expose whom it excluded, and someone willing to insist that fulfilling it remains unfinished work.\" Reason 1 (demand) uses Henry's \"we must fight!\"; reason 2 (exclusion) uses Douglass's contrast of the holiday's meaning for him versus others; reason 3 (renewal) uses Lincoln's \"unfinished work\" — sequenced to escalate the claim rather than simply taking each source in turn.",
      },
      relatedLoIds: ['apenglang.synthesis-line-of-reasoning'],
    },
  ],
  pointers: [
    { content: 'A synthesis line of reasoning sequences REASONS, paragraph by paragraph, toward the thesis — evidence comes from whichever source best supports each reason.', kind: 'tip' },
    { content: 'Two reliable organizing options: by-reason (each paragraph argues a distinct dimension) or by-progressive-complication (each paragraph deepens the claim).', kind: 'tip' },
    { content: 'Avoid the default trap: "one paragraph per source" tends to collapse the essay back into summary.', kind: 'trap' },
    { content: 'A source can be reused across paragraphs for different reasons — forced even distribution is not the goal.', kind: 'tip' },
    { content: 'Transitions should connect reasons to each other, not announce a switch from one source to the next.', kind: 'tip' },
  ],
};
