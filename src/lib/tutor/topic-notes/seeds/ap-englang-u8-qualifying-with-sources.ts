/**
 * AP English Language & Composition — Unit 8 CED 8.3: Qualifying a
 * Position with Sources.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.qualifying-with-sources.v1`). Builds on 8.2: here the
 * writer already holds one position, and the sophisticated move is choosing
 * a source specifically BECAUSE it complicates that position — narrowing
 * scope, adding a condition, conceding a limit — rather than only using
 * sources as one-sided support. Targets the overclaim trap.
 *
 * Anchor text referenced in the method's example: Abraham Lincoln, "The
 * Gettysburg Address" (1863), qualifying a claim about Patrick Henry's 1775
 * speech. Quotes are limited to the short structural phrases already used as
 * anchor evidence elsewhere in the course.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_QUALIFYING_WITH_SOURCES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.qualifying-with-sources.v1',
  course: 'AP English Language',
  cedUnit: 8,
  cedTopic: '8.3',
  cedTitle: 'Qualifying a Position with Sources',
  planId: 'evelyn.ap.englang.qualifying-with-sources.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.qualifying-with-sources.v1' }],
  theory: [
    {
      loId: 'apenglang.qualifying-with-sources',
      kind: 'definition',
      title: 'qualification',
      content:
        'Narrowing a claim\'s scope or adding a condition, WITHOUT abandoning the claim. "Fighting secures liberty, though only as an ongoing, incomplete process" is a qualified claim, not a retraction.',
    },
    {
      loId: 'apenglang.qualifying-with-sources',
      kind: 'definition',
      title: 'overclaim',
      content:
        'A thesis stated in absolute terms ("liberty was fully and finally secured by...") that a single well-chosen source can immediately falsify — inviting exactly the rebuttal a qualified thesis would have pre-empted.',
    },
    {
      loId: 'apenglang.qualifying-with-sources',
      kind: 'definition',
      title: 'signal phrase',
      content:
        'Language — "though," "except," "only insofar as," "in practice, however" — that shows a reader the writer anticipated and addressed a limit on their own claim, rather than having missed it.',
    },
    {
      loId: 'apenglang.qualifying-with-sources',
      kind: 'strategy',
      title: 'a source can qualify your OWN claim',
      content:
        'A source can qualify a writer\'s own claim just as easily as it can support it. The sophisticated move is choosing a source specifically BECAUSE it complicates your thesis, and showing you\'ve accounted for the complication rather than ignored it.',
    },
    {
      loId: 'apenglang.qualifying-with-sources',
      kind: 'framework',
      title: 'qualifying vs. handling disagreement',
      content:
        'Qualifying with a source differs from 8.2\'s handling-disagreement move: in 8.2, two SOURCES disagree with each other. Here, the WRITER already holds one position, and uses a source to admit a genuine limit on how far, how completely, or how universally that position holds.',
    },
    {
      loId: 'apenglang.qualifying-with-sources',
      kind: 'strategy',
      title: 'qualifying is not conceding the whole argument',
      content:
        'A well-qualified thesis still makes a real, defensible claim — it is simply accurate about its own scope instead of overstating it. Narrowing a claim is not the same as abandoning it.',
    },
    {
      loId: 'apenglang.qualifying-with-sources',
      kind: 'strategy',
      title: 'graders reward the anticipated limit',
      content:
        'AP graders reward this move explicitly as a sophistication point: a claim that anticipates and addresses its own limit, using a source to do so, reads as more mature than a claim that pretends no complication exists.',
    },
    {
      loId: 'apenglang.qualifying-with-sources',
      kind: 'strategy',
      title: 'the core-survives test',
      content:
        "Remove the qualifying clause from a rewritten thesis — is the original claim's core still standing, just less exposed to an obvious counterexample? If yes, the qualification narrowed the claim without destroying it.",
    },
  ],
  methods: [
    {
      title: 'Qualify a thesis using a complicating source',
      when_to_use:
        'Use when a thesis states its claim in absolute terms and a specific, credible source can narrow — without refuting — that claim.',
      steps: [
        'IDENTIFY THE OVERCLAIM — find the absolute word or phrase ("once and for all," "always," "proves") that a single later source could falsify.',
        'FIND THE SOURCE THAT COMPLICATES IT — a source that directly addresses whether the original claim held completely or permanently.',
        'DECIDE WHAT KIND OF LIMIT THIS IS — not a full rebuttal, but a limit on SCOPE (how much, how permanently, for whom).',
        'REWRITE THE THESIS AS A QUALIFIED CLAIM, using signal language ("though," "only insofar as") to show the limit was deliberately addressed.',
        'VERIFY THE QUALIFIED THESIS IS STILL A REAL, ARGUABLE CLAIM — not a retreat into "it\'s complicated."',
      ],
      example: {
        problem:
          "A student's thesis claims: \"Fighting for liberty, as Patrick Henry demanded in 1775, secures it once and for all.\" Use Lincoln's 1863 Gettysburg Address to QUALIFY this thesis rather than abandon it.",
        solution:
          "The overclaim (\"once and for all\") is falsified by Lincoln's own 1863 admission that the nation's work remained \"unfinished.\" Qualified thesis: \"Fighting for liberty, as Henry demanded in 1775, secures it only provisionally — Lincoln's 1863 admission that the nation's work remained 'unfinished' shows that each generation has had to renew, not simply inherit, that victory.\" The core claim (fighting secures liberty) survives; only its scope is narrowed.",
      },
      relatedLoIds: ['apenglang.qualifying-with-sources'],
    },
  ],
  pointers: [
    { content: 'Qualifying means narrowing a claim\'s scope or adding a condition — not abandoning the claim.', kind: 'tip' },
    { content: 'The overclaim trap: an absolute thesis a single well-chosen source can immediately falsify.', kind: 'trap' },
    { content: 'Choose a source BECAUSE it complicates your thesis, not only sources that agree with it.', kind: 'tip' },
    { content: 'Signal language ("though," "only insofar as") shows a reader the limit was anticipated, not missed.', kind: 'tip' },
    { content: 'Test: remove the qualifying clause — does the original claim\'s core still stand? If yes, it\'s a qualification, not a retraction.', kind: 'tip' },
    { content: 'A well-qualified thesis is sharper and harder to rebut than the unqualified version, not weaker.', kind: 'tip' },
  ],
};
