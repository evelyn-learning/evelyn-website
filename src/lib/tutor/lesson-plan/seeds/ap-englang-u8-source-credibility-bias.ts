/**
 * AP English Language & Composition — CED Unit 8.1: Evaluating Source
 * Credibility and Bias.
 *
 * The entry point of the synthesis-and-source-evaluation unit: before a
 * student can weigh competing perspectives (8.2), qualify a claim with a
 * source (8.3), or write a sophisticated multi-source argument (8.4), they
 * need a working method for deciding HOW MUCH WEIGHT and HOW TO USE any
 * given source — not a naive yes/no "is this source biased" test, but an
 * assessment of the writer's position/stake, the text's proximity to the
 * event, and how the text was transmitted to us. The trap this topic targets
 * is dismissing a source entirely because it has a perspective, when every
 * source has one.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * Anchor text: Patrick Henry, "Give Me Liberty or Give Me Death" (1775) —
 * evelyn.passage.henry-give-me-liberty.v1. The teaching point is a genuine,
 * real source-evaluation case: Henry's political and personal stake in
 * independence, AND the fact that no verbatim transcript survives — the
 * text we read was reconstructed by biographer William Wirt in 1817, over
 * four decades later, from the recollections of elderly witnesses. Quotes
 * below are limited to the short, structural rhetorical phrases already
 * used as anchor evidence for this speech elsewhere in the course.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U8_SOURCE_CREDIBILITY_BIAS: LessonPlan = {
  id: 'evelyn.ap.englang.source-credibility-bias.v1',
  title: 'U8.1 Evaluating Source Credibility and Bias',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.source-credibility-bias',
      description:
        "Evaluate a source's credibility — the writer's position and stake, the text's proximity to the event, and how it was transmitted — to decide whether and how to use it as evidence, without dismissing a source merely because it has a perspective.",
      standard: 'AP-ENGLANG-8.1',
    },
  ],
  prerequisites: ['apenglang.position-across-sources'],
  followUps: ['apenglang.competing-perspectives'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel the difference between rejecting a witness outright and cross-examining what they say.',
      script:
        "Imagine a trial where a witness has an obvious personal stake in the outcome — say, they'd benefit financially if the jury believes them. A rookie juror thinks: 'they have a motive, so ignore everything they say.' An experienced juror thinks something smarter: 'their motive tells me what they might exaggerate or leave out — now let me weigh their specific testimony against that.' Every source you'll ever cite in a synthesis essay has SOME position, some stake, some angle. The skill isn't spotting that a source has a perspective — it always does — it's figuring out exactly how that perspective should shape how much weight you give it and how you use it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-credibility-and-bias',
      kind: 'concept',
      goal: "Define credibility as a spectrum assessed by specific factors, and correct the naive bias-therefore-invalid trap.",
      keyIdeas: [
        "CREDIBILITY is not a yes/no label — it's an assessment made from specific factors: the writer's PROXIMITY to the event (eyewitness vs. secondhand), the writer's EXPERTISE or authority on the topic, how the text was TRANSMITTED to us (a verbatim contemporaneous record vs. a later reconstruction), and whether other sources CORROBORATE it.",
        "BIAS is not disqualifying by itself — every source has a position, a stake, an angle. The useful question is never 'does this source have a bias' (yes, always) — it's 'how does that position shape what this source emphasizes, downplays, or exaggerates, and does that change how I should use it.'",
        "STAKE: what a writer stands to gain or lose predicts what they're likely to emphasize or omit. That's useful for reading a source SHARPLY — not a reason to throw the source out.",
        "TRANSMISSION matters as much as stake: HOW a text reached us affects how confidently you can cite its exact wording. A verbatim transcript from the moment carries different evidentiary weight than a text reconstructed years or decades later from memory — even when the reconstruction is broadly trustworthy.",
        "A credibility assessment doesn't answer 'trustworthy, yes or no' — it tells you HOW to use a source: as strong direct evidence, as evidence you cite with an explicit qualification (e.g. 'as later reconstructed...'), or as evidence you set aside because its specific limitations undermine the exact claim you'd use it for.",
        "THE NAIVE-BIAS TRAP: dismissing a source entirely because the writer had a personal stake (e.g. 'we can't trust this because the author had a political motive') throws away a usable source instead of reading it more carefully.",
        "A sophisticated synthesis essay names a source's credibility and limitations candidly WHEN THEY MATTER to the claim being made — it neither ignores reliability questions nor demands a 'neutral' source, which mostly doesn't exist.",
      ],
      vocabulary: [
        { term: 'credibility', definition: "an assessment of how much weight a source deserves, based on proximity, expertise, transmission, and corroboration — not a yes/no label." },
        { term: 'bias', definition: "a source's built-in position or slant — present in every source, and not by itself disqualifying." },
        { term: 'stake', definition: "what a writer stands to gain or lose, which predicts what a source may emphasize or downplay." },
        { term: 'transmission', definition: 'how a text reached its present form — a live transcript vs. a later reconstruction from memory or secondary report.' },
        { term: 'corroboration', definition: 'independent confirmation of a source\'s claims by other sources or records.' },
      ],
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-assess-henry-credibility',
      kind: 'worked_example',
      problem:
        "Assess the credibility and limitations of Patrick Henry's 1775 \"Give Me Liberty or Give Me Death\" speech (evelyn.passage.henry-give-me-liberty.v1) as a source for a synthesis essay on how revolutionary-era Americans argued for independence.",
      steps: [
        "IDENTIFY WHO IS SPEAKING AND THEIR STAKE. Henry was a Virginia planter and elected burgess with direct political stake in the colonies' break from Britain — his stake predicts he would emphasize urgency and downplay the risks of war, which is exactly what the speech does.",
        "IDENTIFY THE TRANSMISSION ISSUE. No verbatim transcript survives from March 1775 — the text students read was reconstructed by biographer William Wirt in 1817, forty-two years later, from the recollections of elderly witnesses (including an aged Thomas Jefferson). That limits how confidently the exact PHRASING can be cited as Henry's literal words.",
        "WEIGH WHAT THE STAKE PREDICTS AGAINST WHAT THE TEXT ACTUALLY DOES. Henry's obvious motive to persuade the Convention doesn't by itself discredit the speech — the urgency and repetition the text displays is independently consistent with other accounts of the Convention's mood, so the stake explains why Henry argued this way without discrediting that he did.",
        "DECIDE HOW TO USE THE SOURCE, NOT WHETHER TO REJECT IT. A reconstructed record, commonly cited in scholarship, should be QUALIFIED rather than treated as either fully verbatim or worthless: cite it as representative of the rhetorical urgency documented among independence advocates, while noting it is a later reconstruction rather than a live transcript.",
        "STATE THE CREDIBILITY VERDICT IN ONE SENTENCE. Usable as strong evidence for how revolutionary rhetoric was argued and later remembered, with an acknowledged limit on precise, word-for-word verbatim confidence.",
      ],
      answer:
        "Henry's speech is usable, credible evidence for revolutionary-era rhetorical urgency — his political stake explains his emphasis without discrediting it, since the tenor is corroborated elsewhere — but it should be cited with the qualification that the text is William Wirt's 1817 reconstruction from witness memory, not a verbatim 1775 transcript, so exact phrasing should be treated as representative rather than word-for-word certain.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-credibility-micro',
      kind: 'try_yourself',
      problem:
        "A classmate is evaluating a source for a synthesis essay and says: \"We can't use Patrick Henry's speech as evidence because he was a Virginia planter with a political stake in independence — his bias makes the source unreliable.\" Write ONE sentence that states a more defensible evaluation of this source's credibility, addressing BOTH Henry's stake AND the text's known transmission history (a reconstruction published decades after the speech was delivered), without simply agreeing that stake alone disqualifies the source.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      rubric: {
        parts: [
          {
            criterionId: 'evaluation',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): the sentence rejects the naive bias-therefore-invalid claim (stake alone does not disqualify a source), correctly reasons about what Henry's stake predicts he would emphasize, AND raises the text's transmission limitation (the speech was reconstructed decades after 1775, not recorded verbatim at the time) as the more precise basis for how to qualify its use. Partial credit (3-4) for a sentence that addresses only ONE of the two required elements (stake reasoning OR transmission) with the other omitted, or that gestures at both but stays vague about how the source should actually be used. Partial credit (1-2) for a sentence that simply asserts the source is fine without engaging either factor. No credit for a sentence that agrees the source is unreliable because of bias alone, or that offers no reasoning at all.",
            modelResponse:
              "Henry's political stake in independence doesn't disqualify his speech as evidence — every advocate for a cause has a stake — but the more precise limitation is that the text itself is a reconstruction published by William Wirt forty-two years after Henry spoke, so it should be cited as representative of revolutionary urgency rather than as his verbatim words.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-naive-bias-trap',
      kind: 'misconception_check',
      question:
        'A student argues: "Frederick Douglass had personally experienced slavery, so his account is too emotionally invested to be an objective, reliable source." Is this sound source evaluation?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Treating firsthand experience/perspective as automatically disqualifying (the naive-bias trap) — mistaking "has a stake" for "cannot be trusted."',
          correctsTo:
            "No — this reasoning would disqualify almost every firsthand account in history, including the ones most valuable BECAUSE the speaker lived what they describe. Douglass's direct experience is a source of unmatched AUTHORITY on what enslavement was, not a disqualifying flaw — his position predicts what he would emphasize (the gap between professed and practiced liberty), which is useful for understanding his angle, not a reason to reject his testimony. The test: does the claimed bias make a SPECIFIC factual claim in the source less likely to be accurate, or does it just mean the writer cares about the outcome? If it's the second, the source remains usable — often as unusually strong evidence — and the honest move is to name the writer's position, not discard the source.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Credibility is a spectrum assessed by specific factors — proximity, expertise, transmission, corroboration — not a yes/no label.',
        'Every source has a bias or stake; the useful question is how that stake shapes emphasis, not whether to reject the source because it has one.',
        'Transmission matters: how a text reached us (verbatim record vs. later reconstruction) affects how confidently you can cite its exact wording.',
        'A credibility assessment tells you HOW to use a source — as strong evidence, as evidence you must qualify, or (rarely) as evidence to set aside — not simply whether to use it.',
        "The naive-bias trap: dismissing a source because the writer has a personal stake or lived experience throws away usable, often uniquely valuable, evidence.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8.1',
    cedTitle: 'Evaluating Source Credibility and Bias',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP English Language' },
    ],
  },
};
