/**
 * AP English Language & Composition — CED Unit 4.2: Analyzing Introductions
 * and Conclusions.
 *
 * Builds on 4.1 (methods of development) and Unit 1's rhetorical situation:
 * a writer's opening and closing moves are not throat-clearing or summary —
 * they are where the writer most deliberately FRAMES how the whole argument
 * should be read. This topic teaches students to analyze what an
 * introduction sets up (and what a conclusion resolves, escalates, or
 * redirects), not to draft their own intros/conclusions.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows (concept = rhetorical
 * move; worked_example = annotated model; try_yourself MICRO grain:
 * responseFormat 'free', single-part rubric).
 *
 * Anchor text: Patrick Henry's "Give Me Liberty or Give Me Death" —
 * evelyn.passage.henry-give-me-liberty.v1 — whose opening ("it is natural
 * to man to indulge in the illusions of hope") frames the entire speech as
 * a correction of misplaced optimism, and whose closing line ("give me
 * liberty, or give me death!") escalates the argument into an ultimatum.
 * Quotes below are limited to short structural/framing phrases.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U4_INTROS_CONCLUSIONS_ANALYSIS: LessonPlan = {
  id: 'evelyn.ap.englang.intros-conclusions-analysis.v1',
  title: 'U4.2 Analyzing Introductions and Conclusions',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.intros-conclusions-analysis',
      description:
        "Analyze how a writer's introduction frames the argument that follows, and how a conclusion resolves, escalates, or redirects it — explaining the rhetorical function of the opening/closing choice rather than merely summarizing what it says.",
      standard: 'AP-ENGLANG-4.2',
    },
  ],
  prerequisites: ['apenglang.rhetorical-situation', 'apenglang.methods-of-development'],
  followUps: ['apenglang.diction-and-tone', 'apenglang.analyzing-line-of-reasoning'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel that openings and closings do rhetorical work, not just bookend the "real" argument, before naming any terms.',
      script:
        "Think about the last time someone told you 'we need to talk.' Before they've said a single specific thing, you already know something: this is serious, brace yourself. That's what a strong opening line does to a reader — it doesn't just start the text, it tells the reader HOW to read everything that follows. And think about how conversations like that usually end — not with a new fact, but with a decision, an ultimatum, or a changed relationship. Conclusions work the same way: they're not a rewind button that repeats what was already said, they're where the writer cashes in everything that came before. Today we stop treating intros and conclusions as decoration and start treating them as some of the most deliberate rhetorical choices in the whole text.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-intros-conclusions',
      kind: 'concept',
      goal: 'Establish what an introduction is doing rhetorically and what a conclusion is doing, and the common failure of treating either as mere summary.',
      keyIdeas: [
        "An INTRODUCTION'S job is to FRAME the argument — it establishes the stakes, signals the writer's stance, and often previews the lens through which the reader should interpret everything that follows. A strong opening move constrains how later evidence will be read before the reader has even seen that evidence.",
        "Common introduction strategies: opening with a striking claim or image that sets the tone; opening with a concession or an admission (disarming the audience before pivoting); opening by naming — and reframing — the very terms of the debate; opening with a question that the rest of the text is structured to answer.",
        "A CONCLUSION'S job is almost never to simply restate the thesis. Strong conclusions do one (or more) of: RESOLVE the tension set up in the introduction, ESCALATE the claim to its furthest, most consequential form, REDIRECT the reader from analysis toward action or a changed way of seeing, or UNIVERSALIZE a specific case into a broader principle.",
        "The single biggest trap: treating the introduction as just 'background info' and the conclusion as just 'a summary of the main points.' Both are read as CHOICES with an effect on the audience, not as required-but-empty formalities.",
        "To analyze an introduction: ask what STANCE or LENS it establishes, and how that stance constrains or directs the reader's interpretation of what follows.",
        "To analyze a conclusion: ask what the ending DOES that the middle of the text hasn't already done — what has shifted, sharpened, or been asked of the reader that wasn't true a paragraph earlier.",
        "Introductions and conclusions are often read TOGETHER for a full rhetorical-analysis essay: does the ending answer the question the opening raised, fulfill the frame the opening set, or move beyond it to something the opening only hinted at?",
      ],
      vocabulary: [
        { term: 'framing', definition: 'the stance or lens an introduction establishes that shapes how the reader interprets everything that follows.' },
        { term: 'resolution (conclusion)', definition: 'a conclusion that answers or settles the tension the introduction raised.' },
        { term: 'escalation (conclusion)', definition: "a conclusion that pushes the argument to its furthest, most consequential form rather than merely restating it." },
        { term: 'redirect (conclusion)', definition: 'a conclusion that turns the reader from analysis toward action, judgment, or a changed way of seeing.' },
        { term: 'concession opening', definition: "an introduction strategy that grants a point to disarm the audience before pivoting to the writer's real claim." },
      ],
      passageId: 'evelyn.passage.henry-give-me-liberty.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-henry-frame',
      kind: 'worked_example',
      problem:
        "Analyze how the opening and closing lines of Patrick Henry's speech frame and then escalate his argument (mentioned in prose here — this segment type carries no passageId field — the resolved text is evelyn.passage.henry-give-me-liberty.v1): it opens with 'it is natural to man to indulge in the illusions of hope' and closes with 'give me liberty, or give me death!'",
      steps: [
        "READ THE OPENING FOR ITS FRAMING MOVE. Henry doesn't open with a call to arms — he opens by diagnosing a psychological weakness ('it is natural to man to indulge in the illusions of hope') that his own audience shares. This is a near-concession: he grants that hoping for peace is natural and human, before treating it as something to be corrected.",
        "NAME WHAT THIS FRAME CONSTRAINS. By opening with a diagnosis of hope-as-weakness rather than a demand, Henry sets up EVERY subsequent piece of evidence (the failed petitions, the approaching war) to be read as proof that this natural but dangerous hope has already been disproven by events — the audience is primed to distrust their own optimism before Henry even lists a fact.",
        "READ THE CONCLUSION FOR WHAT IT DOES BEYOND THE MIDDLE. The body of the speech has already argued that war is inevitable and justified. The closing line — 'give me liberty, or give me death!' — doesn't add a new argument; it COMPRESSES the entire case into a single ultimatum stated in the first person, converting a collective political argument into a personal, individual stake.",
        "NAME THE FUNCTION: ESCALATION, NOT SUMMARY. The conclusion escalates rather than resolves calmly — it doesn't say 'therefore we should fight,' it stages an individual choosing death over the alternative, raising the emotional and moral stakes to their absolute limit and daring the audience to claim they'd choose differently.",
        "CONNECT OPENING TO CLOSING. The opening diagnosed the audience's hope as a shared human weakness to be overcome; the closing dramatizes what overcoming it looks like in a single, unflinching voice — the frame set at the start is fulfilled, not merely echoed, by the ending.",
      ],
      answer:
        "Henry's opening frames hope for peace as a natural but dangerous illusion the audience shares, priming every later fact to read as proof that illusion has failed. His closing line doesn't summarize that case — it escalates it, compressing the whole collective argument into one first-person ultimatum ('give me liberty, or give me death!') that converts political reasoning into a personal, unflinching stake, fulfilling rather than merely restating the frame the opening set.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-thesis-lincoln-frame',
      kind: 'try_yourself',
      problem:
        "Using the passage evelyn.passage.lincoln-gettysburg.v1, write ONE sentence analyzing what the CONCLUSION of the Address does rhetorically (the final sentence, 'that government of the people, by the people, for the people, shall not perish from the earth') that the middle of the speech has not already done. Do not summarize the conclusion's content — state its rhetorical FUNCTION (resolve / escalate / redirect / universalize) and why that function serves Lincoln's purpose.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      rubric: {
        parts: [
          {
            criterionId: 'conclusion-function',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): correctly identifies the conclusion's function as UNIVERSALIZING (or escalating) — the middle of the speech has been about honoring the dead of this particular battle and this particular war, but the tricolon 'of the people, by the people, for the people' lifts the stakes from this one battlefield/war to the survival of self-government as a principle everywhere — AND explains why that universalizing move serves Lincoln's purpose (making the cause bigger than one battle or one war makes the sacrifice, and the audience's continued commitment, feel necessary on the largest possible terms, not just as memorial to specific soldiers). Partial credit (2-4) for correctly naming the function without explaining why it serves Lincoln's purpose, or a plausible purpose-link without correctly naming the function (e.g. calling it mere summary/restatement). No credit (0) for treating the sentence as pure summary of content with no claim about rhetorical function.",
            modelResponse:
              "Rather than resolving with a private memorial to this battle's dead, Lincoln's final line universalizes the stakes — 'government of the people, by the people, for the people' reframes the war's outcome as the survival of self-government as a principle everywhere, which lets Lincoln ask his audience to recommit not just to honoring specific soldiers but to a cause whose failure would be a loss to the whole world.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-conclusion-as-summary',
      kind: 'misconception_check',
      question:
        'A student writes: "The conclusion of the speech restates the main idea that the speaker already made in the introduction and body." Is this a strong analytical observation about a conclusion?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            "Treating 'the conclusion restates the thesis' as if it were an analytical observation, when it is usually a factual error AND a missed opportunity — most strong conclusions do NOT merely restate; they resolve, escalate, redirect, or universalize.",
          correctsTo:
            "No — 'restates the main idea' describes what a weak conclusion would do, and it's rarely actually true of a well-built one. Go back and ask: what does the ending DO that the middle hasn't already done — does it push the claim further (escalate), answer a tension the opening raised (resolve), turn the reader toward action (redirect), or widen a specific case into a general principle (universalize)? A conclusion earns real analysis only when you can name which of these functions it performs and explain why that function, not a plain restatement, serves the writer's purpose.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'An introduction FRAMES the argument — it sets a stance or lens that constrains how the reader will interpret everything that follows, not just background info.',
        'A conclusion almost never merely summarizes — it typically resolves a tension, escalates the claim, redirects the reader toward action, or universalizes a specific case into a broader principle.',
        'Read openings and closings TOGETHER: does the ending fulfill, escalate, or move beyond the frame the opening set?',
        "The trap: describing a conclusion as 'restating the thesis' — that's rarely what a strong conclusion actually does, and naming it as summary skips the real analytical question.",
        'Always ask: what does this ending DO that the middle of the text has not already done?',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.2',
    cedTitle: 'Analyzing Introductions and Conclusions',
    sources: [
      {
        type: 'concept',
        book: 'ap-englang-ced',
        chapter: '4',
        note: 'AP English Language and Composition Course and Exam Description, Unit 4 — how introductions frame and conclusions resolve/escalate/redirect a rhetorical argument.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.henry-give-me-liberty.v1',
        chapter: '1775',
        note: 'Patrick Henry, "Give Me Liberty or Give Me Death" — anchor text for the opening frame / closing escalation worked example.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.lincoln-gettysburg.v1',
        chapter: '1863',
        note: 'Abraham Lincoln, "The Gettysburg Address" — practice text for analyzing the universalizing function of the closing line.',
      },
    ],
  },
};
