/**
 * AP English Language & Composition — Unit 8 CED 8.2: Synthesizing
 * Competing Perspectives.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.competing-perspectives.v1`). Builds on 8.1: once a
 * source is trusted, credible sources can still genuinely DISAGREE. Covers
 * the three legitimate moves — weigh, reconcile, synthesize a new claim —
 * and the false-choice and straw-man traps.
 *
 * Anchor texts referenced in the method's example: Frederick Douglass,
 * "What to the Slave Is the Fourth of July?" (1852) and Patrick Henry, "Give
 * Me Liberty or Give Me Death" (1775). Quotes are limited to the short
 * structural/rhetorical phrases already used as anchor evidence elsewhere in
 * the course.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_COMPETING_PERSPECTIVES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.competing-perspectives.v1',
  course: 'AP English Language & Composition',
  cedUnit: 8,
  cedTopic: '8.2',
  cedTitle: 'Synthesizing Competing Perspectives',
  planId: 'evelyn.ap.englang.competing-perspectives.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.competing-perspectives.v1' }],
  theory: [
    {
      loId: 'apenglang.competing-perspectives',
      kind: 'definition',
      title: 'competing perspectives',
      content:
        'Sources that answer a SHARED question differently, rather than simply covering different topics. Two sources discussing unrelated aspects of an issue are not competing perspectives — they only compete when they genuinely disagree about the same question.',
    },
    {
      loId: 'apenglang.competing-perspectives',
      kind: 'definition',
      title: 'straw man',
      content:
        'A distorted, easy-to-defeat version of an opposing source\'s actual position. Test: could that source\'s author read your summary of their position and recognize it as fair? If not, you\'ve built a straw man, not engaged the real argument.',
    },
    {
      loId: 'apenglang.competing-perspectives',
      kind: 'framework',
      title: 'three legitimate moves for genuine disagreement',
      content:
        'When credible sources genuinely disagree, there are three legitimate ways to handle it: (1) **Weigh** — argue, with reasons, that one perspective is more persuasive or accurate for this specific issue. (2) **Reconcile** — show the apparent conflict dissolves once you look closer (different scope, different moment, different audience — each source is right about a different piece). (3) **Synthesize a new claim** — use the tension between the sources itself as evidence for a claim neither source states on its own.',
    },
    {
      loId: 'apenglang.competing-perspectives',
      kind: 'strategy',
      title: 'characterize before you weigh',
      content:
        'Step one, always: characterize EACH perspective accurately, on its own terms, before weighing them. Skipping this step and jumping straight to "which one wins" is how a straw man sneaks into an essay.',
      },
    {
      loId: 'apenglang.competing-perspectives',
      kind: 'trap',
      title: 'the false-choice trap',
      content:
        'Treating disagreement as a binary you must resolve by picking one source and silently discarding the other. Real disagreement between credible sources is usually productive, not a problem to make disappear — and dropping the inconvenient source leaves an essay vulnerable to a reader who knows it exists.',
    },
    {
      loId: 'apenglang.competing-perspectives',
      kind: 'strategy',
      title: 'reconciling often means different scope',
      content:
        'Reconciling disagreement often means noticing the sources are answering slightly different versions of the shared question — different scope, different moment in time, different audience — so that each is accurate about its own piece even though they sound opposed at first.',
    },
    {
      loId: 'apenglang.competing-perspectives',
      kind: 'strategy',
      title: 'a source that pushes back is an asset',
      content:
        'An essay that only cites sources already agreeing with its thesis is WEAKER than one that engages a source that pushes back. Genuinely wrestling with disagreement, rather than avoiding it, is what makes a position defensible rather than one-sided.',
    },
    {
      loId: 'apenglang.competing-perspectives',
      kind: 'strategy',
      title: 'the shared-question test',
      content:
        "Before treating two sources as competing, confirm they're answering the same underlying question — e.g. \"what does America's promise of liberty require, and of whom?\" — rather than simply speaking about the same general topic from unconnected angles.",
    },
  ],
  methods: [
    {
      title: 'Reconcile two genuinely disagreeing sources',
      when_to_use:
        'Use when two credible sources answer the same underlying question differently and neither can be dismissed on credibility grounds (8.1).',
      steps: [
        "CHARACTERIZE THE FIRST SOURCE'S PERSPECTIVE ACCURATELY, ON ITS OWN TERMS.",
        "CHARACTERIZE THE SECOND SOURCE'S PERSPECTIVE ACCURATELY, ON ITS OWN TERMS.",
        'NAME WHAT THE TWO ACTUALLY AGREE ON BENEATH THE SURFACE DISAGREEMENT.',
        'RECONCILE RATHER THAN PICKING A SIDE — show the perspectives are sequential, scoped differently, or addressed to different moments/audiences, not strictly contradictory.',
        'STATE THE RECONCILED CLAIM THE TENSION PRODUCES — a claim that could not be made from either source alone.',
      ],
      example: {
        problem:
          "Henry (1775) frames liberty as a birthright under active threat that must be seized immediately through force — \"we must fight!\" Douglass (1852), addressing the same national ideal decades later, argues that the liberty Henry's generation won was never actually extended to enslaved Americans — \"this Fourth of July is yours, not mine.\" Reconcile the tension between these two perspectives.",
        solution:
          "Henry shows liberty being WON in principle through urgent, immediate action; Douglass shows that winning it in principle for one group does not automatically extend it in practice to another. Reconciled, the two perspectives reveal that securing liberty is not a single, completed event but a promise that has to be re-fought, on its own terms, by whoever it excludes.",
      },
      relatedLoIds: ['apenglang.competing-perspectives'],
    },
  ],
  pointers: [
    { content: 'Competing perspectives answer a SHARED question differently — confirm that before treating two sources as disagreeing.', kind: 'tip' },
    { content: 'The false-choice trap: picking a side and silently dropping the disagreeing source instead of engaging it.', kind: 'trap' },
    { content: 'The straw-man trap: test your summary of an opposing source against whether its author would recognize it as fair.', kind: 'trap' },
    { content: 'Three legitimate moves: weigh one as more persuasive, reconcile the apparent conflict, or synthesize a new claim from the tension.', kind: 'tip' },
    { content: 'A source that pushes back on your thesis is an asset, not a threat — engaging it honestly is what makes a position defensible.', kind: 'tip' },
    { content: 'Reconciling usually means showing each source is right about a different scope, moment, or audience — not that one is simply wrong.', kind: 'tip' },
  ],
};
