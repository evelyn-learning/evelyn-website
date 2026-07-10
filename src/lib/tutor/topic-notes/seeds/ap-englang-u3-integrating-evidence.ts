/**
 * AP English Language & Composition — Unit 3 CED 3.4: Integrating
 * Evidence, Not Summarizing.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.integrating-evidence.v1`). Covers using details from
 * TWO sources as evidence for ONE claim, at the paragraph level, rather than
 * narrating what each source is "about" in sequence (the book-report trap).
 *
 * Anchor texts referenced in the method's example: Abraham Lincoln, "The
 * Gettysburg Address" (1863), and Patrick Henry, "Give Me Liberty or Give Me
 * Death" (1775). Quotes are limited to short structural phrases already used
 * as anchor evidence for these speeches elsewhere in the course.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_INTEGRATING_EVIDENCE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.integrating-evidence.v1',
  course: 'AP English Language',
  cedUnit: 3,
  cedTopic: '3.4',
  cedTitle: 'Integrating Evidence, Not Summarizing',
  planId: 'evelyn.ap.englang.integrating-evidence.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.integrating-evidence.v1' }],
  theory: [
    {
      loId: 'apenglang.integrating-evidence',
      kind: 'definition',
      title: 'integration',
      content:
        'Using ONE specific, selected detail from EACH source as proof for a SINGLE claim of the writer\'s own — not narrating what each source is "about" in sequence.',
    },
    {
      loId: 'apenglang.integrating-evidence',
      kind: 'trap',
      title: 'the book-report trap',
      content:
        'A paragraph shaped like "Source A says... Also, Source B says... Additionally..." with no claim tying the sentences together. Delete any sentence and the paragraph\'s "argument" is unaffected, because there isn\'t one.',
    },
    {
      loId: 'apenglang.integrating-evidence',
      kind: 'framework',
      title: 'claim first, then evidence from each source',
      content:
        'A strong synthesis paragraph states the CLAIM FIRST, then pulls one relevant detail from each source, and uses COMMENTARY (the Unit 1 evidence-and-commentary skill) to explain how BOTH details serve the SAME claim — even when the two sources don\'t agree with each other.',
    },
    {
      loId: 'apenglang.integrating-evidence',
      kind: 'strategy',
      title: 'comparative evidence',
      content:
        'Using two sources together is often stronger than using one alone, specifically because it can show a PATTERN across different moments or authors, or let one source sharpen or complicate how the reader should read the other — that comparative move IS analysis, not summary.',
    },
    {
      loId: 'apenglang.integrating-evidence',
      kind: 'definition',
      title: 'synthesis commentary',
      content:
        'Commentary that has extra work to do beyond single-source commentary: it must explain not just what each piece of evidence shows on its own, but WHY putting them together matters — whether the sources reinforce each other or productively complicate the same claim.',
    },
    {
      loId: 'apenglang.integrating-evidence',
      kind: 'strategy',
      title: 'the delete test',
      content:
        'Could any sentence in the paragraph be removed without weakening the claim? If yes for any sentence, that sentence is decoration (summary), not integrated evidence.',
    },
    {
      loId: 'apenglang.integrating-evidence',
      kind: 'trap',
      title: 'the book-report trap at paragraph grain',
      content:
        'Mentioning two sources in the same paragraph, one after another ("Henry says X. Lincoln also talks about Y. Both sources discuss Z."), is not integration — it is the book-report trap in miniature. "Both sources discuss liberty" is an observation about the sources, not a claim about liberty itself; integration requires a claim stated up front, evidence from each source selected because it supports THAT claim, and commentary explaining why using them together strengthens the case.',
    },
    {
      loId: 'apenglang.integrating-evidence',
      kind: 'rhetorical-device',
      title: 'Henry and Lincoln converge across 88 years',
      content:
        'Henry\'s "there is no longer any room for hope. If we wish to be free, we must fight!" treats liberty as something seized through immediate action; Lincoln\'s "unfinished work" and call for "increased devotion" treat liberty as an ongoing project requiring renewal nearly a century later. That two speakers, separated by 88 years and addressing entirely different occasions, arrive at the same underlying claim is stronger evidence than either speech alone.',
    },
  ],
  methods: [
    {
      title: 'Integrate one detail from each of two sources into one paragraph',
      when_to_use:
        'Use once a synthesis position (3.3) is set and a body paragraph needs to combine evidence from two sources in service of one claim, rather than summarizing each in turn.',
      steps: [
        'WRITE THE TOPIC SENTENCE / CLAIM the paragraph will prove.',
        'SELECT ONE DETAIL FROM SOURCE 1, chosen specifically because it supports THIS claim.',
        'SELECT ONE DETAIL FROM SOURCE 2, chosen because it supports the SAME claim from a different angle or moment.',
        'COMMENT ON HOW EACH DETAIL SERVES THE CLAIM ON ITS OWN.',
        'COMMENT ON WHY THE TWO TOGETHER SERVE THE SAME CLAIM — do they reinforce each other, or productively complicate one another?',
        'CLOSE BY LINKING BACK TO THE CLAIM, tying both details into one case rather than two separate summaries.',
      ],
      example: {
        problem:
          "Build one paragraph supporting the claim that the promise of liberty has always demanded active defense rather than passive inheritance, drawing on both Patrick Henry's 1775 speech and Abraham Lincoln's 1863 Gettysburg Address.",
        solution:
          "The promise of liberty has never been something a nation simply inherits once and keeps automatically — each generation has had to actively defend or renew it. In 1775, Patrick Henry treats liberty as something that must be seized through immediate action, declaring \"there is no longer any room for hope. If we wish to be free, we must fight!\" Nearly a century later, Abraham Lincoln treats liberty not as won-and-done but as \"unfinished work,\" calling for \"increased devotion\" to secure \"a new birth of freedom.\" That two speakers, separated by 88 years and addressing entirely different occasions, arrive at the same underlying claim is stronger evidence than either speech could offer alone.",
      },
      relatedLoIds: ['apenglang.integrating-evidence'],
    },
  ],
  pointers: [
    { content: 'Integrating evidence means using one specific detail from EACH source as proof for a SINGLE claim — not narrating what each source is about in turn.', kind: 'tip' },
    { content: 'The book-report trap: "Source A says... Source B also says..." with no unifying claim. Delete any sentence — if nothing is lost, it was decoration.', kind: 'trap' },
    { content: 'Synthesis commentary must explain both HOW each detail supports the claim and WHY combining the sources (not either alone) strengthens the case.', kind: 'tip' },
    { content: 'Sources used together can show a pattern across time/authors, or let one sharpen how you read the other — that comparison is analysis, not summary.', kind: 'tip' },
    { content: 'State the claim first, then select evidence from each source because it serves that claim — never the reverse.', kind: 'tip' },
  ],
};
