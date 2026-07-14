/**
 * AP English Language & Composition — Unit 2 CED 2.5: Introductions and
 * Conclusions.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.intros-conclusions.v1`). Closes Unit 2's argument-essay
 * sequence: framing an argument with an introduction that earns its claim by
 * establishing concrete stakes, and a conclusion that answers "so what" by
 * transforming — rather than restating — the opening.
 *
 * Anchor text referenced in the concept and method: Abraham Lincoln, "The
 * Gettysburg Address" (1863), whose opening establishes stakes before the
 * claim and whose closing transforms rather than repeats that opening.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_INTROS_CONCLUSIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.intros-conclusions.v1',
  course: 'AP English Language & Composition',
  cedUnit: 2,
  cedTopic: '2.5',
  cedTitle: 'Introductions and Conclusions',
  planId: 'evelyn.ap.englang.intros-conclusions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.intros-conclusions.v1' }],
  theory: [
    {
      loId: 'apenglang.intros-conclusions',
      kind: 'definition',
      title: 'stakes',
      content:
        'The reason a reader should care about an issue, established BEFORE the claim itself is stated. A claim dropped with no stakes reads like an assignment being completed, not an argument being made.',
    },
    {
      loId: 'apenglang.intros-conclusions',
      kind: 'definition',
      title: 'framing',
      content:
        'The deliberate link between an essay\'s opening and closing, so an image, question, or scenario raised in the opening can be revisited, transformed, in the closing — the essay reads as a complete arc rather than a claim sandwiched between two disconnected paragraphs.',
    },
    {
      loId: 'apenglang.intros-conclusions',
      kind: 'definition',
      title: 'so-what conclusion',
      content:
        'A conclusion that answers why the claim matters beyond the essay — what should change, what\'s at stake if it doesn\'t — rather than restating the thesis in near-identical words.',
    },
    {
      loId: 'apenglang.intros-conclusions',
      kind: 'strategy',
      title: 'reliable opening strategies',
      content:
        'A vivid SPECIFIC SCENARIO or fact that makes the issue concrete, a striking STATISTIC that reframes scale, or a direct statement of the TENSION or counter-position the essay will resolve — all earn the reader\'s attention before the claim itself arrives.',
    },
    {
      loId: 'apenglang.intros-conclusions',
      kind: 'trap',
      title: 'the dictionary opening',
      content:
        'Starting from an overly broad, generic frame ("Throughout history, people have argued about...") delays the stakes instead of establishing them, and signals a writer stalling rather than staking a claim.',
    },
    {
      loId: 'apenglang.intros-conclusions',
      kind: 'trap',
      title: 'the restated conclusion',
      content:
        'Repeating the thesis in near-identical words ("In conclusion, as I have shown, ... for the reasons discussed above") wastes the reader\'s last attention on information they already have and adds nothing about why the claim matters.',
    },
    {
      loId: 'apenglang.intros-conclusions',
      kind: 'strategy',
      title: 'the deletion test for a conclusion',
      content:
        'If the conclusion were deleted, would the essay feel unfinished because it never answered "why does this matter," or would nothing be lost because it only repeated what the introduction already said?',
    },
    {
      loId: 'apenglang.intros-conclusions',
      kind: 'rhetorical-device',
      title: 'Lincoln establishes stakes, then transforms them',
      content:
        '"Four score and seven years ago our fathers brought forth... a new nation, conceived in Liberty" states the stakes (a nation founded on a specific proposition) before the speech ever gets to its immediate occasion. His closing — "government of the people, by the people, for the people, shall not perish from the earth" — doesn\'t restate the opening in the same words; it transforms the founding proposition into a forward-looking stake for the living.',
    },
  ],
  methods: [
    {
      title: 'Frame an essay with stakes-first opening and a transforming conclusion',
      when_to_use:
        'Use once the body of an argument essay (claim, evidence, reasoning, rebuttal) is drafted and needs an opening and closing that earn and extend it.',
      steps: [
        'REJECT ANY DICTIONARY OPENING — a generic, overly broad frame that delays the stakes.',
        'FIND A CONCRETE STAKES-ESTABLISHING DETAIL — something specific and vivid, not the topic "in general."',
        'OPEN WITH THAT STAKE, NOT THE CLAIM YET, so the reader feels the scale of the problem before being asked to agree.',
        'STATE THE CLAIM as the answer the stakes-establishing opening has earned.',
        'PLAN THE CONCLUSION AS A TRANSFORMATION, NOT A REPETITION — project the opening stake forward instead of restating it.',
        'WRITE BOTH FRAMES so the closing answers the "so what" the opening raised, without repeating its wording.',
      ],
      example: {
        problem:
          "Write an opening and a closing frame for the essay (claim: high schools should push start times to 8:30 a.m. or later), modeled on how Lincoln establishes stakes and transforms rather than repeats them.",
        solution:
          "OPENING: \"The average American teenager gets nearly two hours less sleep per night than sleep scientists say adolescent brains need to function — and the single biggest, most fixable cause of that gap is a school bell that rings before their bodies are biologically ready for it. High schools should push start times to 8:30 a.m. or later.\" CLOSING: \"A generation of students forced to choose, every school-day morning, between their education and their biology will not simply catch up on the weekend — the debt compounds for four years and follows them past graduation. Moving the first bell later doesn't just fix a schedule; it lets an entire generation's biology and education stop working against each other.\"",
      },
      relatedLoIds: ['apenglang.intros-conclusions'],
    },
  ],
  pointers: [
    { content: 'An introduction earns the claim by establishing concrete stakes FIRST — not by opening with a generic "throughout history" frame.', kind: 'tip' },
    { content: 'A conclusion answers "so what," projecting the claim\'s significance forward — not restating the thesis in near-identical words.', kind: 'tip' },
    { content: 'Framing ties introduction and conclusion together: an image or stake raised at the opening can be transformed, not repeated, at the close.', kind: 'tip' },
    { content: 'Test your own conclusion: if deleted, would the essay feel unfinished, or would nothing be lost?', kind: 'tip' },
    { content: '"In conclusion, as I have shown... for the reasons discussed above" is a placeholder, not content — it adds nothing new.', kind: 'trap' },
  ],
};
