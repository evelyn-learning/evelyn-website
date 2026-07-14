/**
 * AP English Language & Composition — Unit 3 CED 3.3: Taking a Position
 * Across Sources.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.position-across-sources.v1`). Covers forming an
 * argument that USES the sources rather than one that just represents them —
 * avoiding the source-summary trap and false neutrality.
 *
 * Anchor text referenced in the concept and worked example: Frederick
 * Douglass, "What to the Slave Is the Fourth of July?" (1852), discussed
 * alongside Lincoln's 1863 address. Quotes are limited to short structural
 * phrases already used as anchor evidence for this speech elsewhere in the
 * course.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_POSITION_ACROSS_SOURCES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.position-across-sources.v1',
  course: 'AP English Language & Composition',
  cedUnit: 3,
  cedTopic: '3.3',
  cedTitle: 'Taking a Position Across Sources',
  planId: 'evelyn.ap.englang.position-across-sources.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.position-across-sources.v1' }],
  theory: [
    {
      loId: 'apenglang.position-across-sources',
      kind: 'definition',
      title: 'synthesis thesis',
      content:
        'The writer\'s OWN arguable claim on a shared issue, supported by multiple sources. Sources are cited because they support that claim — not because the writer is obligated to represent every source equally or give each one identical space.',
    },
    {
      loId: 'apenglang.position-across-sources',
      kind: 'trap',
      title: 'the source-summary trap',
      content:
        'Walking through each source\'s content, one at a time, with no claim of the writer\'s own tying them together. Delete any single sentence and the "argument" is unaffected, because there isn\'t one.',
    },
    {
      loId: 'apenglang.position-across-sources',
      kind: 'trap',
      title: 'false neutrality',
      content:
        'Accurately describing that sources disagree ("some see liberty as X, others as Y") without ever committing to the writer\'s own claim about the issue. Naming disagreement is not the same as taking a position on it.',
    },
    {
      loId: 'apenglang.position-across-sources',
      kind: 'strategy',
      title: 'the strip test',
      content:
        'Remove every reference to the sources from a proposed thesis. Is there still a real claim left? "The promise of liberty has never been self-executing — it has always required someone to demand and defend it" survives the strip test. "These sources show different views on liberty" does not — it collapses into an observation ABOUT the sources, not a position ON the issue.',
    },
    {
      loId: 'apenglang.position-across-sources',
      kind: 'strategy',
      title: 'using a source against its surface meaning',
      content:
        'A writer is allowed, and often rewarded, for using a source against its surface meaning, or using only part of what it says, as long as the use stays accurate and honest to the source\'s actual content.',
    },
    {
      loId: 'apenglang.position-across-sources',
      kind: 'strategy',
      title: 'a synthesis thesis is arguable the same way a rhetorical thesis is',
      content:
        'A synthesis thesis is arguable in the same way a rhetorical-analysis thesis is (Unit 1) — but the claim is about the ISSUE itself, supported across texts, not about one writer\'s rhetorical choices in a single text.',
    },
    {
      loId: 'apenglang.position-across-sources',
      kind: 'strategy',
      title: 'a disagreeing source is still useful evidence',
      content:
        'Sources that seem to disagree with the writer\'s position are still useful — engaging honestly with a source that complicates the claim (rather than avoiding it) is what an advanced synthesis essay does.',
    },
    {
      loId: 'apenglang.position-across-sources',
      kind: 'rhetorical-device',
      title: 'Douglass and Lincoln as two forms of the same evidence',
      content:
        'Douglass\'s 1852 indictment of a holiday that excludes him and Lincoln\'s 1863 admission that the nation\'s "unfinished work" remains undone are two views of the same truth: the promise of liberty only becomes real when someone forces the nation to look at where it has failed to keep it. Read this way, both sources serve one claim rather than sitting side by side as competing accounts.',
    },
  ],
  methods: [
    {
      title: 'Diagnose and fix a false-neutrality draft thesis',
      when_to_use:
        'Use when a draft synthesis thesis accurately describes what sources say or where they disagree, but has not yet committed to the writer\'s own position.',
      steps: [
        'TEST THE DRAFT AGAINST THE STRIP TEST — remove the source references; is a real claim left?',
        'NAME THE FAILURE MODE — source-summary trap, false neutrality, or both.',
        'IDENTIFY THE SHARED ISSUE the draft is circling but not yet answering.',
        'DECIDE A GENUINE POSITION — not "sources disagree" but a specific claim about what that disagreement means.',
        'REWRITE AS A THESIS THAT SURVIVES THE STRIP TEST.',
        'VERIFY BOTH SOURCES NOW SERVE THE CLAIM rather than just being described side by side.',
      ],
      example: {
        problem:
          "A student drafts this synthesis \"thesis\": \"Douglass says the Fourth of July excludes enslaved people, while Lincoln says the nation is dedicated to the idea that all men are created equal. These sources show different perspectives on liberty.\" Diagnose the problem and fix it.",
        solution:
          "The draft commits false neutrality — it notes that Douglass and Lincoln differ but never states what the writer concludes from that difference. Fix: \"The promise of liberty and equality has never been self-executing: Douglass's 1852 indictment of a holiday that excludes him and Lincoln's 1863 admission that the nation's 'unfinished work' remains undone are two views of the same truth — the promise only becomes real when someone forces the nation to look at where it has failed to keep it.\"",
      },
      relatedLoIds: ['apenglang.position-across-sources'],
    },
  ],
  pointers: [
    { content: 'A synthesis thesis is the writer\'s OWN claim about the shared issue — sources support it, they don\'t define it.', kind: 'tip' },
    { content: 'Avoid the source-summary trap: describing each source\'s content in turn with no unifying claim.', kind: 'trap' },
    { content: 'Avoid false neutrality: noting that sources disagree is not the same as taking a position on what that disagreement means.', kind: 'trap' },
    { content: 'The strip test: remove source references from your thesis — if no real claim is left, it isn\'t a position yet.', kind: 'tip' },
    { content: 'A source that disagrees with your position is still useful evidence — engaging it honestly is stronger than ignoring it.', kind: 'tip' },
    { content: '"It depends on how you look at it" has no opposite to argue against — that\'s the sign it isn\'t a position yet.', kind: 'trap' },
  ],
};
