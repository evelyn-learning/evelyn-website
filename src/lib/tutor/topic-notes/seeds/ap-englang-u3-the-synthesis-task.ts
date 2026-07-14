/**
 * AP English Language & Composition — Unit 3 CED 3.1: The Synthesis Task.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.the-synthesis-task.v1`). Covers what a synthesis essay
 * actually asks for: reading several sources on one shared, debatable issue,
 * then forming an ORIGINAL position of the student's own that the sources
 * support — not reporting what each source individually says.
 *
 * Source set referenced in the method's example: Patrick Henry (1775),
 * Frederick Douglass (1852), and Abraham Lincoln (1863), all speaking to
 * what "liberty" and "equality" mean in America and to whom the promise
 * applies. Quotes are limited to short structural/rhetorical phrases already
 * used elsewhere in the unit.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_THE_SYNTHESIS_TASK: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.the-synthesis-task.v1',
  course: 'AP English Language & Composition',
  cedUnit: 3,
  cedTopic: '3.1',
  cedTitle: 'The Synthesis Task',
  planId: 'evelyn.ap.englang.the-synthesis-task.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.the-synthesis-task.v1' }],
  theory: [
    {
      loId: 'apenglang.the-synthesis-task',
      kind: 'definition',
      title: 'synthesis',
      content:
        'Taking multiple sources on the same debatable issue and using them to build YOUR OWN original argument — not reporting what each source says, one at a time, in sequence.',
    },
    {
      loId: 'apenglang.the-synthesis-task',
      kind: 'definition',
      title: 'issue',
      content:
        'A real, unsettled question — not a settled fact — that the sources approach from different angles, moments, or positions. Every synthesis task starts from an issue.',
    },
    {
      loId: 'apenglang.the-synthesis-task',
      kind: 'definition',
      title: 'source set',
      content:
        'The group of texts provided for a synthesis task, chosen because they all bear on one shared issue. Sources in a set don\'t have to agree with each other — the strongest synthesis essays often use sources that see the issue differently, treating the disagreement itself as material for the writer\'s own claim.',
    },
    {
      loId: 'apenglang.the-synthesis-task',
      kind: 'framework',
      title: 'a shared issue across three moments',
      content:
        'Patrick Henry (1775) demands liberty from Britain; Frederick Douglass (1852) shows that the nation\'s promise of liberty and equality was not extended to enslaved people; Abraham Lincoln (1863) reasserts the founding proposition that "all men are created equal" as "unfinished work." Three moments, three angles, one shared issue: what does America\'s promise of liberty and equality actually mean, and to whom does it apply?',
    },
    {
      loId: 'apenglang.the-synthesis-task',
      kind: 'strategy',
      title: 'name the issue before taking a position',
      content:
        'Before writing a single essay sentence, a synthesis writer must be able to state the shared issue in one sentence, and only then decide their own position on it.',
    },
    {
      loId: 'apenglang.the-synthesis-task',
      kind: 'trap',
      title: 'the source-by-source book report',
      content:
        'Organizing the essay as "Source A says X. Source B says Y. Source C says Z." with no throughline connecting them. Even if each paragraph is accurate, a reader would know what each source says but not what the writer thinks the answer to the shared issue is.',
    },
    {
      loId: 'apenglang.the-synthesis-task',
      kind: 'trap',
      title: 'false neutrality (naming disagreement is not a position)',
      content:
        'A neutral summary of "how the sources differ" with no position taken. Synthesis is scored on how well the WRITER\'s own argument uses the sources as evidence, not on how thoroughly every source got mentioned.',
    },
    {
      loId: 'apenglang.the-synthesis-task',
      kind: 'strategy',
      title: 'reading across a set, not source by source',
      content:
        'Instead of asking "what is each source about," ask what single question all of them could be used to answer — that shift, from per-source content to a shared underlying question, is what makes synthesis reading different from single-passage analysis.',
    },
  ],
  methods: [
    {
      title: 'Name the shared issue and take a defensible position across sources',
      when_to_use:
        'Use as the very first step before drafting any synthesis essay, once a source set has been read.',
      steps: [
        'READ ACROSS THE SET, NOT SOURCE BY SOURCE — ask what single question all the sources could be used to answer.',
        'NOTICE THE COMMON THREAD each source touches, even if from different angles or positions.',
        'DISTILL THE SHARED ISSUE IN ONE SENTENCE, phrased as a genuine, unsettled question.',
        'NOTICE THE SOURCES GIVE DIFFERENT ANGLES ON THE SAME ISSUE, not necessarily the same answer.',
        'TAKE YOUR OWN POSITION — a specific, defensible claim, not an observation that "the sources disagree."',
        'VERIFY THE POSITION IS AN ARGUMENT, NOT A SUMMARY — check whether every source in the set could be cited as evidence FOR this claim, in different ways.',
      ],
      example: {
        problem:
          "Given a source set of three speeches on liberty and equality in America — Henry (1775), Douglass (1852), Lincoln (1863) — name the shared issue and take a position on it.",
        solution:
          "Shared issue: whether America's founding promise of liberty and equality automatically applies to everyone or must be actively extended. Position: the promise of liberty and equality has never been self-executing — each generation has had to actively demand it (Henry), confront its exclusions (Douglass), or renew the unfinished work of fulfilling it (Lincoln), rather than simply inherit it complete.",
      },
      relatedLoIds: ['apenglang.the-synthesis-task'],
    },
  ],
  pointers: [
    { content: 'Synthesis means using multiple sources on one shared issue to build YOUR OWN original argument — not reporting each source in turn.', kind: 'tip' },
    { content: 'Every synthesis task starts from an issue: a real, debatable question the sources approach from different angles, not a fact they all confirm.', kind: 'tip' },
    { content: 'Sources in a set do not need to agree — disagreement between sources is often the strongest fuel for a writer\'s own position.', kind: 'tip' },
    { content: 'Two traps to avoid from day one: the source-by-source book report, and false neutrality (describing disagreement without ever taking a position).', kind: 'trap' },
    { content: 'Before writing, state the shared issue in one sentence, then state your own defensible position on it in one more.', kind: 'tip' },
  ],
};
