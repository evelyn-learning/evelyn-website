/**
 * AP English Language & Composition — CED Unit 9.1: Timed-Writing Strategy
 * for the Three FRQs.
 *
 * The capstone unit integrates everything the course has built (defensible
 * thesis, evidence + commentary, line of reasoning, synthesis, style
 * analysis, nuance) into exam CONDITIONS: three FRQs — Rhetorical Analysis,
 * Argument, Synthesis — in a fixed window, most students' first real timed
 * attempt at all three back-to-back. The single biggest score-killer under
 * time pressure isn't a missing skill, it's a missing PLAN: students who
 * start writing before they've read the whole prompt and sketched a line of
 * reasoning run out of time mid-essay or wander off their own claim. This
 * plan teaches the reading/planning/pacing discipline that makes the other
 * eight units' skills actually show up on the page in 40 minutes.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * Anchor text for the practice thesis-and-plan: Abraham Lincoln, "The
 * Gettysburg Address" — evelyn.passage.lincoln-gettysburg.v1 (compact enough
 * to fully re-read inside a timed-planning simulation; rich in antithesis,
 * tricolon, and anaphora for a rhetorical-analysis-style prompt).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U9_TIMED_WRITING_STRATEGY: LessonPlan = {
  id: 'evelyn.ap.englang.timed-writing-strategy.v1',
  title: 'U9.1 Timed-Writing Strategy for the Three FRQs',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.timed-writing-strategy',
      description:
        'Under exam time constraints, read an FRQ prompt for its actual task, produce a defensible thesis and a brief line-of-reasoning outline within a fixed planning window, and allocate remaining time to drafting so all three parts of the essay can be attempted.',
      standard: 'AP-ENGLANG-9.1',
    },
  ],
  prerequisites: [
    'apenglang.defensible-thesis',
    'apenglang.line-of-reasoning-argument',
    'apenglang.the-synthesis-task',
  ],
  followUps: ['apenglang.mcq-reading-strategy'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make students feel why a plan-first approach beats a write-first approach under a hard clock, before naming any strategy.',
      script:
        "Picture two students given the same 40 minutes for an essay. Student A reads the prompt once, feels a flicker of an idea, and starts writing sentence one immediately — determined to 'figure it out as I go.' Student B spends the first 5 minutes just reading, planning, and jotting three dots on scratch paper before writing a single essay sentence. Which one finishes with a coherent argument? Almost always Student B — because on a clock, an essay without a plan doesn't save time, it spends the SAME time wandering instead of arguing. Today isn't about learning a new writing skill. It's about learning to spend your 40 minutes on purpose.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-timed-writing-strategy',
      kind: 'concept',
      goal: 'Define the reading/planning/drafting time split for each FRQ type and the habits that make a rushed thesis still defensible.',
      keyIdeas: [
        "THE EXAM GIVES ~40 MINUTES PER ESSAY (including a suggested reading period for RA and Synthesis) — but that time is NOT meant to be spent entirely drafting. A reliable split is roughly: 5-7 minutes READING AND PLANNING, 28-30 minutes DRAFTING, 3-5 minutes REVIEWING. Skipping the planning minutes to 'save time' is the single biggest cause of essays that drift off-topic or run out of steam.",
        "READ THE PROMPT FOR ITS TASK, not just its topic. Every FRQ prompt has a specific verb-and-object task buried in it (e.g. 'analyze the rhetorical choices,' 'develop an argument,' 'synthesize at least three sources to support a position'). Underline or restate that task in your own words BEFORE reading the passage/sources closely — it tells you what to look for while you read.",
        "FOR RHETORICAL ANALYSIS: skim the passage once for the rhetorical situation (speaker, audience, occasion, purpose) and mark 2-3 specific devices/moves as you go with a quick symbol or word in the margin — don't wait until a second full re-read to start noticing evidence.",
        "FOR ARGUMENT: spend the planning minutes brainstorming 2-3 possible lines of reasoning BEFORE committing to a thesis, then pick the one with the most specific, concrete evidence available (from reading, experience, or observation) — not necessarily the 'safest' position.",
        "FOR SYNTHESIS: skim all sources first for their STANCES relative to the prompt's issue (which sources broadly agree, which disagree, which complicate) before drafting a thesis — a synthesis thesis has to take a position the sources can actually support, which you can't know without a quick pass through all of them.",
        "A QUICK OUTLINE beats a mental plan every time under time pressure: 3 dots — thesis, then one line per body paragraph naming its evidence and its job in the argument — takes under 2 minutes and prevents the single biggest structural failure: an essay that repeats the same point three times instead of building three different ones.",
        "A FAST THESIS DOESN'T HAVE TO BE A PERFECT THESIS — it has to be DEFENSIBLE and SPECIFIC ENOUGH TO OUTLINE FROM. A thesis that names a purpose/position AND gestures at how you'll show it (a 'because' or an 'by/through' clause) is fast to write and gives the outline something to hang off of.",
        "PACE-CHECK MENTALLY AT THE MIDPOINT: if you're not at least at your second body paragraph by the halfway mark, that's the signal to tighten commentary rather than add a new point — an essay with two well-developed points beats one with three thin ones.",
      ],
      vocabulary: [
        { term: 'planning window', definition: 'the first few minutes of FRQ time spent reading the prompt/sources and outlining before drafting begins.' },
        { term: 'task verb', definition: "the specific action a prompt asks for (analyze, argue, synthesize) — read for this before reading the passage closely." },
        { term: 'quick outline', definition: 'a thesis plus one line per body paragraph naming its evidence and job, sketched in under two minutes.' },
        { term: 'pace-check', definition: 'a brief mental checkpoint at the midpoint of drafting time to confirm the essay is on track to finish all parts.' },
      ],
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      estimatedMinutes: 5,
    },
    {
      id: 'worked-timed-plan-lincoln',
      kind: 'worked_example',
      problem:
        "Given a rhetorical-analysis-style prompt — 'Read the following speech. Then write an essay that analyzes the rhetorical choices the speaker makes to convey his message about the significance of the occasion' (the text under time pressure is Lincoln's Gettysburg Address, mentioned here in prose — this segment type carries no passageId field — the resolved text is evelyn.passage.lincoln-gettysburg.v1), simulate the first 5 minutes: restate the task, skim for the situation, mark two devices, and produce a fast thesis plus a 3-point outline.",
      steps: [
        "RESTATE THE TASK IN ONE LINE. The verb is 'analyzes the rhetorical choices... to convey his message about the significance of the occasion' — so the essay needs named devices TIED TO the message about significance, not a device list and not a summary of the war.",
        "SKIM FOR THE SITUATION IN UNDER A MINUTE. Speaker: the President, at a battlefield dedication. Audience: mourners and a watching nation. Occasion: dedicating a cemetery mid-war. Purpose: to redefine the deaths as demanding renewed commitment to the nation's founding ideal, not just to mourn.",
        "MARK TWO DEVICES WHILE SKIMMING, DON'T RE-READ FOR THEM LATER. First: the triad 'we can not dedicate—we can not consecrate—we can not hallow.' Second: the closing tricolon 'of the people, by the people, for the people.'",
        "WRITE A FAST, DEFENSIBLE THESIS. Draft: Lincoln uses escalating negation followed by a culminating tricolon to shift the occasion from mourning the dead to recommitting the living to the nation's founding ideal.",
        "SKETCH THE 3-POINT OUTLINE IN UNDER TWO MINUTES. Point 1: the 'we can not dedicate/consecrate/hallow' triad transfers authority from the speaker's words to the soldiers' actions. Point 2: the shift from 'they' (the dead) to 'us' (the living) turns commemoration into an obligation. Point 3: the closing tricolon 'of/by/for the people' redefines what is actually being defended.",
        "PACE-CHECK BEFORE DRAFTING. Three points, each with a specific quoted device already marked — that's enough material for three developed body paragraphs in the remaining ~30 minutes; no fourth point is needed and hunting for one would only eat drafting time.",
      ],
      answer:
        "In under 5 minutes: task restated as 'devices tied to the SIGNIFICANCE of the occasion, not a summary'; situation skimmed (President, battlefield dedication, redefining death as demanding renewal); two devices marked in the margin (the dedicate/consecrate/hallow triad, the of/by/for tricolon); a fast thesis drafted naming both the shift and the two devices; a 3-point outline sketched, each point already anchored to a specific quote — leaving the full drafting window free to write commentary instead of still searching for evidence.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-fast-thesis-plan',
      kind: 'try_yourself',
      problem:
        "Simulate the first 5 minutes of exam time. Using the passage evelyn.passage.lincoln-gettysburg.v1 and the prompt 'Write an essay that analyzes the rhetorical choices Lincoln makes to convey his message about the significance of the occasion,' write ONE fast, defensible thesis sentence naming Lincoln's purpose AND at least one specific device, followed by a quick 3-point plan (one short phrase per point naming the evidence/device each body paragraph would use). Do not draft full paragraphs — this is planning only.",
      responseFormat: 'free',
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      rubric: {
        parts: [
          {
            criterionId: 'thesis-and-plan',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): the thesis is defensible (an arguable claim about Lincoln's purpose, not a summary of the address), names at least one specific, accurately-described device (e.g. the dedicate/consecrate/hallow triad, the of/by/for tricolon, the shift from 'they' to 'us,' antithesis, anaphora), AND is followed by a 3-point plan where each point names DIFFERENT, specific evidence/devices that could each support a distinct body paragraph (not three restatements of the same point). Partial credit (3-5) for a defensible thesis with a named device but a plan that is vague, has fewer than three distinct points, or repeats the same evidence across points. Low/no credit (0-2) for a thesis that only summarizes the address's content, or a plan entirely absent.",
            modelResponse:
              "Thesis: Lincoln uses escalating negation ('we can not dedicate... consecrate... hallow') followed by the closing tricolon 'of the people, by the people, for the people' to shift the occasion from mourning the dead to recommitting the living to the nation's founding ideal. Plan: (1) the dedicate/consecrate/hallow triad transfers authority from Lincoln's words to the soldiers' actions; (2) the shift from 'they' to 'us, the living' turns commemoration into an obligation; (3) the closing 'of/by/for the people' tricolon redefines what is actually being defended.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-writing-to-discover',
      kind: 'misconception_check',
      question:
        "A student says: \"Planning for 5 minutes wastes time I could spend writing — I write faster when I just start and figure out my argument as I go.\" Is skipping the planning window a sound timed-writing strategy?",
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            "Confusing WORDS ON THE PAGE with PROGRESS — treating drafting time as the only time that counts, when a plan-less draft usually has to be partly abandoned or restructured mid-essay, which costs far more time than the 5-minute plan would have.",
          correctsTo:
            "No — 'writing to discover' your argument is fine for a take-home essay with unlimited time, but under a 40-minute clock it is the riskiest possible strategy: if the argument that emerges in paragraph three contradicts paragraph one, there's no time left to fix it, and a grader sees a wandering essay instead of a coherent one. A 5-minute plan (task restated, situation skimmed, thesis + 3-point outline) doesn't cost time — it PREVENTS the much larger time cost of writing a paragraph you have to abandon or a conclusion that doesn't match your opening claim.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Split your ~40 minutes roughly: 5-7 minutes reading/planning, 28-30 minutes drafting, 3-5 minutes reviewing — skipping the planning window is the #1 cause of essays that wander off their own claim.",
        "Read the prompt for its TASK VERB (analyze/argue/synthesize) before reading the passage/sources closely — it tells you what to look for.",
        "A fast thesis just needs to be DEFENSIBLE and SPECIFIC ENOUGH TO OUTLINE FROM — a 3-point quick outline (thesis + one evidence/job line per body paragraph) takes under two minutes and prevents repeating the same point three times.",
        "Pace-check at the midpoint: better to develop two points well than rush three thin ones.",
        "RA: skim once for the rhetorical situation and mark devices as you go. Argument: brainstorm 2-3 lines of reasoning before picking one. Synthesis: skim all sources for their stances before drafting a thesis.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '9',
    cedTopic: '9.1',
    cedTitle: 'Timed-Writing Strategy for the Three FRQs',
    sources: [
      {
        type: 'plan',
        source: 'AP Plans Initiative — AP English Language',
      },
    ],
  },
};
