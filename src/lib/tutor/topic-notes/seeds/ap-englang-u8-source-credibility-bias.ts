/**
 * AP English Language & Composition — Unit 8 CED 8.1: Evaluating Source
 * Credibility and Bias.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.source-credibility-bias.v1`). Covers the entry point of
 * the synthesis-and-source-evaluation unit: assessing HOW MUCH WEIGHT and HOW
 * TO USE a source via proximity, expertise, transmission, and corroboration —
 * not a naive yes/no bias test. Targets the trap of dismissing a source
 * entirely because it has a perspective, when every source has one.
 *
 * Anchor text referenced in the method's example: Patrick Henry, "Give Me
 * Liberty or Give Me Death" (1775). Quotes are limited to the short
 * structural/rhetorical phrases already used as anchor evidence elsewhere in
 * the course.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_SOURCE_CREDIBILITY_BIAS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.source-credibility-bias.v1',
  course: 'AP English Language & Composition',
  cedUnit: 8,
  cedTopic: '8.1',
  cedTitle: 'Evaluating Source Credibility and Bias',
  planId: 'evelyn.ap.englang.source-credibility-bias.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.source-credibility-bias.v1' }],
  theory: [
    {
      loId: 'apenglang.source-credibility-bias',
      kind: 'definition',
      title: 'credibility',
      content:
        'An assessment of how much weight a source deserves — NOT a yes/no label. Built from specific factors: the writer\'s proximity to the event (eyewitness vs. secondhand), the writer\'s expertise or authority on the topic, how the text was transmitted to us (a verbatim contemporaneous record vs. a later reconstruction), and whether other sources corroborate it.',
    },
    {
      loId: 'apenglang.source-credibility-bias',
      kind: 'definition',
      title: 'bias',
      content:
        'A source\'s built-in position, stake, or slant. Present in every source, and NOT by itself disqualifying. The useful question is never "does this source have a bias" (yes, always) — it\'s "how does that position shape what this source emphasizes, downplays, or exaggerates, and does that change how I should use it."',
    },
    {
      loId: 'apenglang.source-credibility-bias',
      kind: 'definition',
      title: 'transmission',
      content:
        'How a text reached its present form — a live transcript recorded at the moment vs. a later reconstruction from memory, secondary report, or biography. Transmission matters as much as stake: it affects how confidently you can cite a source\'s EXACT wording, even when the reconstruction is broadly trustworthy.',
    },
    {
      loId: 'apenglang.source-credibility-bias',
      kind: 'framework',
      title: 'four factors, one spectrum',
      content:
        'Credibility is assessed along a spectrum, not a binary, using four factors together: PROXIMITY (how close the writer was to the event), EXPERTISE (the writer\'s authority on the topic), TRANSMISSION (how the text reached us), and CORROBORATION (whether other sources independently confirm it). No single factor settles the question alone.',
    },
    {
      loId: 'apenglang.source-credibility-bias',
      kind: 'strategy',
      title: 'stake predicts emphasis, not validity',
      content:
        'What a writer stands to gain or lose predicts what they are likely to emphasize or omit. That is useful for reading a source SHARPLY — noticing where a stake-holder might overstate urgency or understate risk — not a reason to throw the source out. Stake explains the angle; it doesn\'t discredit the testimony.',
    },
    {
      loId: 'apenglang.source-credibility-bias',
      kind: 'trap',
      title: 'the naive-bias trap',
      content:
        'Dismissing a source entirely because the writer had a personal stake, motive, or lived experience ("we can\'t trust this because the author had a political motive") throws away a usable — often uniquely valuable — source instead of reading it more carefully. This reasoning, taken to its conclusion, would disqualify almost every firsthand account in history.',
    },
    {
      loId: 'apenglang.source-credibility-bias',
      kind: 'strategy',
      title: 'credibility answers HOW, not just IF',
      content:
        'A credibility assessment doesn\'t stop at "trustworthy, yes or no" — it tells you HOW to use a source: as strong direct evidence, as evidence cited with an explicit qualification ("as later reconstructed..."), or, rarely, as evidence set aside because its specific limitations undermine the exact claim it would be used for.',
    },
    {
      loId: 'apenglang.source-credibility-bias',
      kind: 'strategy',
      title: 'weigh the stake against what the text does',
      content:
        'A writer\'s obvious motive doesn\'t by itself discredit a source — check whether what the text actually says is independently consistent with other accounts. If the tone or claims the stake predicts are corroborated elsewhere, the stake explains WHY the writer argued this way without discrediting THAT they did.',
    },
    {
      loId: 'apenglang.source-credibility-bias',
      kind: 'strategy',
      title: 'firsthand experience is authority, not disqualification',
      content:
        'Lived experience of the very thing a source describes is a source of unmatched authority, not a disqualifying flaw. The test: does the claimed bias make a SPECIFIC factual claim in the source less likely to be accurate, or does it just mean the writer cares about the outcome? If the latter, the source remains usable — often as unusually strong evidence.',
    },
    {
      loId: 'apenglang.source-credibility-bias',
      kind: 'strategy',
      title: 'name limitations candidly when they matter',
      content:
        'A sophisticated synthesis essay names a source\'s credibility and limitations candidly WHEN THEY MATTER to the specific claim being made — it neither ignores reliability questions nor holds out for a "neutral" source, which mostly doesn\'t exist.',
    },
  ],
  methods: [
    {
      title: "Assess a source's credibility before using it as evidence",
      when_to_use:
        'Use before citing any source in a synthesis essay, especially one with an obvious personal stake or an uncertain transmission history.',
      steps: [
        'IDENTIFY WHO IS SPEAKING AND THEIR STAKE — what does the writer stand to gain or lose, and what does that predict they will emphasize or downplay?',
        'IDENTIFY THE TRANSMISSION ISSUE — does a verbatim record survive, or was the text reconstructed later from memory, report, or biography? Note how that limits confidence in exact phrasing.',
        'WEIGH WHAT THE STAKE PREDICTS AGAINST WHAT THE TEXT ACTUALLY DOES — check whether the tone/claims the stake predicts are independently corroborated elsewhere.',
        'DECIDE HOW TO USE THE SOURCE, NOT WHETHER TO REJECT IT — as strong direct evidence, as evidence cited with an explicit qualification, or (rarely) set aside for the exact claim it can\'t support.',
        'STATE THE CREDIBILITY VERDICT IN ONE SENTENCE, naming both the usable strength and the specific limitation.',
      ],
      example: {
        problem:
          "Assess the credibility and limitations of Patrick Henry's 1775 \"Give Me Liberty or Give Me Death\" speech as a source for a synthesis essay on how revolutionary-era Americans argued for independence.",
        solution:
          "Henry, a Virginia planter with direct political stake in the break from Britain, would be expected to emphasize urgency and downplay risk — which the speech does — but that stake doesn't discredit it, since the urgency is corroborated elsewhere in accounts of the Convention's mood. The limitation is transmission: no verbatim 1775 transcript survives; the text is William Wirt's 1817 reconstruction from witness memory. Verdict: usable as strong evidence for revolutionary rhetorical urgency, cited with the qualification that exact phrasing is representative rather than word-for-word certain.",
      },
      relatedLoIds: ['apenglang.source-credibility-bias'],
    },
  ],
  pointers: [
    { content: 'Credibility is a spectrum assessed by proximity, expertise, transmission, and corroboration — never a yes/no label.', kind: 'tip' },
    { content: 'The naive-bias trap: rejecting a source because it has a stake. Every source has one — the question is how it shapes emphasis.', kind: 'trap' },
    { content: 'A firsthand account from someone who lived the events is authority, not a disqualifying flaw — don\'t throw it out for having "skin in the game."', kind: 'trap' },
    { content: 'A verbatim transcript and a decades-later reconstruction carry different confidence for exact WORDING, even if both are broadly trustworthy.', kind: 'tip' },
    { content: 'Name a source\'s limitation only when it actually matters to the claim you\'re using it for — don\'t hedge on every citation.', kind: 'tip' },
    { content: 'Test: does the bias make a specific factual claim less accurate, or does it just mean the writer cares about the outcome? Only the first is disqualifying for that claim.', kind: 'tip' },
  ],
};
