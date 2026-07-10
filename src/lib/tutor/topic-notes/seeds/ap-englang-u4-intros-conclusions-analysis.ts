/**
 * AP English Language & Composition — Unit 4 CED 4.2: Analyzing
 * Introductions and Conclusions.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.intros-conclusions-analysis.v1`). Covers what an
 * introduction FRAMES and what a conclusion DOES (resolve, escalate,
 * redirect, universalize) as deliberate rhetorical choices rather than
 * required-but-empty formalities.
 *
 * Anchor texts referenced in the method's example: Patrick Henry's "Give Me
 * Liberty or Give Me Death" (opening frame / closing escalation) and
 * Lincoln's Gettysburg Address (universalizing conclusion). Quotes are
 * limited to short structural/framing phrases.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_INTROS_CONCLUSIONS_ANALYSIS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.intros-conclusions-analysis.v1',
  course: 'AP English Language',
  cedUnit: 4,
  cedTopic: '4.2',
  cedTitle: 'Analyzing Introductions and Conclusions',
  planId: 'evelyn.ap.englang.intros-conclusions-analysis.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.intros-conclusions-analysis.v1' }],
  theory: [
    {
      loId: 'apenglang.intros-conclusions-analysis',
      kind: 'definition',
      title: 'introduction (rhetorical function)',
      content:
        "An introduction's job is to FRAME the argument — it establishes the stakes, signals the writer's stance, and often previews the lens through which the reader should interpret everything that follows. A strong opening move constrains how later evidence will be read before the reader has even seen that evidence.",
    },
    {
      loId: 'apenglang.intros-conclusions-analysis',
      kind: 'definition',
      title: 'conclusion (rhetorical function)',
      content:
        "A conclusion's job is almost never to simply restate the thesis. Strong conclusions do one or more of: RESOLVE the tension set up in the introduction, ESCALATE the claim to its furthest, most consequential form, REDIRECT the reader from analysis toward action or a changed way of seeing, or UNIVERSALIZE a specific case into a broader principle.",
    },
    {
      loId: 'apenglang.intros-conclusions-analysis',
      kind: 'definition',
      title: 'framing',
      content:
        "The stance or lens an introduction establishes that shapes how the reader interprets everything that follows — framing happens before the reader has seen any of the actual evidence the argument will use.",
    },
    {
      loId: 'apenglang.intros-conclusions-analysis',
      kind: 'framework',
      title: 'the four conclusion functions',
      content:
        'RESOLUTION answers or settles the tension the introduction raised. ESCALATION pushes the argument to its furthest, most consequential form rather than merely restating it. REDIRECT turns the reader from analysis toward action, judgment, or a changed way of seeing. UNIVERSALIZE widens a specific case into a broader principle or stakes beyond the immediate occasion.',
    },
    {
      loId: 'apenglang.intros-conclusions-analysis',
      kind: 'strategy',
      title: 'common introduction strategies',
      content:
        "Openings often: state a striking claim or image that sets the tone; open with a concession or admission that disarms the audience before pivoting; name — and reframe — the very terms of the debate; or pose a question that the rest of the text is structured to answer.",
    },
    {
      loId: 'apenglang.intros-conclusions-analysis',
      kind: 'trap',
      title: "the conclusion-as-summary trap",
      content:
        '"The conclusion restates the main idea" describes what a weak conclusion would do, and it is rarely actually true of a well-built one. Treating a factually-restated summary as if it were an analytical observation is the single biggest trap in this topic.',
    },
    {
      loId: 'apenglang.intros-conclusions-analysis',
      kind: 'strategy',
      title: 'read openings and closings together',
      content:
        "Introductions and conclusions are often read TOGETHER for a full rhetorical-analysis essay: does the ending answer the question the opening raised, fulfill the frame the opening set, or move beyond it to something the opening only hinted at?",
    },
    {
      loId: 'apenglang.intros-conclusions-analysis',
      kind: 'strategy',
      title: 'the two analytical questions',
      content:
        "To analyze an introduction, ask what STANCE or LENS it establishes, and how that stance constrains or directs the reader's interpretation of what follows. To analyze a conclusion, ask what the ending DOES that the middle of the text hasn't already done — what has shifted, sharpened, or been asked of the reader that wasn't true a paragraph earlier.",
    },
    {
      loId: 'apenglang.intros-conclusions-analysis',
      kind: 'rhetorical-device',
      title: 'concession opening',
      content:
        "An introduction strategy that grants a point — often what the audience already believes or hopes — to disarm the audience before pivoting to the writer's real claim. Patrick Henry opens by conceding that hoping for peace is natural and human, before treating that very hope as something to be corrected.",
    },
  ],
  methods: [
    {
      title: "Analyze how an opening frames and a closing resolves, escalates, redirects, or universalizes",
      when_to_use:
        'Use when asked to explain what an introduction or conclusion DOES rhetorically, not what it says.',
      steps: [
        'READ THE OPENING FOR ITS FRAMING MOVE — does it state a claim, concede a point, redefine a term, or pose a question?',
        'NAME WHAT THE FRAME CONSTRAINS — how does this opening move prime the reader to interpret evidence that has not appeared yet?',
        "READ THE CONCLUSION FOR WHAT IT DOES BEYOND THE MIDDLE — what has shifted, sharpened, or been demanded that wasn't true a paragraph earlier?",
        'NAME THE FUNCTION — is the conclusion resolving, escalating, redirecting, or universalizing? Rule out "mere summary" explicitly.',
        'CONNECT OPENING TO CLOSING — does the ending fulfill the frame the opening set, or push beyond it?',
      ],
      example: {
        problem:
          "Analyze how the opening and closing lines of Patrick Henry's speech frame and then escalate his argument: it opens with \"it is natural to man to indulge in the illusions of hope\" and closes with \"give me liberty, or give me death!\"",
        solution:
          "Henry's opening frames hope for peace as a natural but dangerous illusion the audience shares, priming every later fact to read as proof that illusion has failed. His closing line doesn't summarize that case — it escalates it, compressing the whole collective argument into one first-person ultimatum (\"give me liberty, or give me death!\") that converts political reasoning into a personal, unflinching stake, fulfilling rather than merely restating the frame the opening set.",
      },
      relatedLoIds: ['apenglang.intros-conclusions-analysis'],
    },
  ],
  pointers: [
    { content: "An introduction FRAMES: it sets a stance or lens that constrains how later evidence gets read.", kind: 'tip' },
    { content: 'Conclusion functions: resolve, escalate, redirect, or universalize — rarely mere restatement.', kind: 'tip' },
    { content: '"The conclusion restates the thesis" is usually a factual error and a missed analytical opportunity — ask what it DOES that the middle hasn\'t already done.', kind: 'trap' },
    { content: "Read intro and conclusion as a pair: does the ending fulfill, escalate, or move beyond the opening's frame?", kind: 'tip' },
    { content: "Common intro moves: a striking claim/image, a disarming concession, redefining the debate's terms, or an opening question the text is structured to answer.", kind: 'tip' },
    { content: 'Calling an intro "background info" skips the real question: what STANCE does it establish?', kind: 'trap' },
  ],
};
