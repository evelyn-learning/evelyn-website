/**
 * AP English Language & Composition — Unit 9 CED 9.1: Timed-Writing
 * Strategy for the Three FRQs.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.timed-writing-strategy.v1`). Covers the reading /
 * planning / pacing discipline that lets the rest of the course's skills
 * (thesis, evidence + commentary, line of reasoning, synthesis) actually show
 * up on the page within a 40-minute exam window.
 *
 * Anchor text referenced in the method's example: Abraham Lincoln, "The
 * Gettysburg Address" (1863). Quotes are limited to the short structural
 * phrases already used as anchor evidence elsewhere in the course.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_TIMED_WRITING_STRATEGY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.timed-writing-strategy.v1',
  course: 'AP English Language',
  cedUnit: 9,
  cedTopic: '9.1',
  cedTitle: 'Timed-Writing Strategy for the Three FRQs',
  planId: 'evelyn.ap.englang.timed-writing-strategy.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.timed-writing-strategy.v1' }],
  theory: [
    {
      loId: 'apenglang.timed-writing-strategy',
      kind: 'definition',
      title: 'planning window',
      content:
        'The first few minutes of FRQ time spent reading the prompt/sources and outlining before drafting begins. A reliable split for each ~40-minute essay: roughly 5-7 minutes reading and planning, 28-30 minutes drafting, 3-5 minutes reviewing.',
    },
    {
      loId: 'apenglang.timed-writing-strategy',
      kind: 'definition',
      title: 'task verb',
      content:
        'The specific action a prompt asks for — "analyze the rhetorical choices," "develop an argument," "synthesize at least three sources to support a position." Read for this before reading the passage/sources closely; it tells you what to look for while you read.',
    },
    {
      loId: 'apenglang.timed-writing-strategy',
      kind: 'definition',
      title: 'quick outline',
      content:
        'A thesis plus one line per body paragraph naming its evidence and its job in the argument, sketched in under two minutes. Prevents the biggest structural failure under time pressure: an essay that repeats the same point three times instead of building three different ones.',
    },
    {
      loId: 'apenglang.timed-writing-strategy',
      kind: 'strategy',
      title: 'planning does not cost time, it saves it',
      content:
        'Skipping the planning minutes to "save time" is the single biggest cause of essays that drift off-topic or run out of steam. A plan-less draft usually has to be partly abandoned or restructured mid-essay, which costs far more time than the 5-minute plan would have.',
    },
    {
      loId: 'apenglang.timed-writing-strategy',
      kind: 'strategy',
      title: 'a fast thesis is defensible, not perfect',
      content:
        'A fast thesis doesn\'t have to be a perfect thesis — it has to be DEFENSIBLE and SPECIFIC ENOUGH TO OUTLINE FROM. A thesis that names a purpose/position AND gestures at how you\'ll show it (a "because" or a "by/through" clause) is fast to write and gives the outline something to hang off of.',
    },
    {
      loId: 'apenglang.timed-writing-strategy',
      kind: 'strategy',
      title: 'the midpoint pace-check',
      content:
        'Check pace mentally at the halfway mark: if you\'re not at least at your second body paragraph, that\'s the signal to tighten commentary rather than add a new point — an essay with two well-developed points beats one with three thin ones.',
    },
    {
      loId: 'apenglang.timed-writing-strategy',
      kind: 'strategy',
      title: 'reading strategy differs by FRQ type',
      content:
        'RHETORICAL ANALYSIS: skim once for the rhetorical situation and mark 2-3 devices as you go, rather than re-reading later. ARGUMENT: brainstorm 2-3 possible lines of reasoning before committing to a thesis, picking the one with the most specific, concrete evidence — not necessarily the "safest" position. SYNTHESIS: skim all sources first for their stances (agree, disagree, complicate) before drafting a thesis, since the thesis has to take a position the sources can actually support.',
    },
    {
      loId: 'apenglang.timed-writing-strategy',
      kind: 'trap',
      title: 'writing to discover',
      content:
        '"Writing to discover" your argument as you go is fine for a take-home essay with unlimited time, but under a 40-minute clock it is the riskiest possible strategy: if the argument that emerges in paragraph three contradicts paragraph one, there is no time left to fix it.',
    },
  ],
  methods: [
    {
      title: 'Plan an FRQ response in the first five minutes',
      when_to_use:
        'Use at the start of every timed FRQ, before writing any full sentence of the essay itself.',
      steps: [
        'RESTATE THE TASK IN ONE LINE — identify the verb-and-object task buried in the prompt (analyze/argue/synthesize + what).',
        'SKIM FOR THE SITUATION IN UNDER A MINUTE — speaker, audience, occasion, purpose (or, for synthesis, each source\'s stance).',
        'MARK TWO OR THREE DEVICES/POINTS WHILE SKIMMING — don\'t wait for a second re-read to start noticing evidence.',
        'WRITE A FAST, DEFENSIBLE THESIS naming a position AND at least one specific device or line of reasoning.',
        'SKETCH A 3-POINT OUTLINE IN UNDER TWO MINUTES — one line per body paragraph naming its distinct evidence and job.',
        'PACE-CHECK BEFORE DRAFTING — confirm the outline has enough distinct material for the remaining drafting time before writing a single essay sentence.',
      ],
      example: {
        problem:
          "Given a rhetorical-analysis prompt asking students to analyze the rhetorical choices Lincoln makes to convey his message about the significance of the occasion, simulate the first 5 minutes.",
        solution:
          "Task restated: devices tied to the SIGNIFICANCE of the occasion, not a summary. Situation skimmed: President, battlefield dedication, redefining death as demanding renewal. Two devices marked: the \"dedicate/consecrate/hallow\" triad, the \"of/by/for the people\" tricolon. Fast thesis: Lincoln uses escalating negation followed by a culminating tricolon to shift the occasion from mourning the dead to recommitting the living to the nation's founding ideal. Three-point outline sketched, each point already anchored to a specific quote — leaving the full drafting window free for commentary instead of still searching for evidence.",
      },
      relatedLoIds: ['apenglang.timed-writing-strategy'],
    },
  ],
  pointers: [
    { content: 'Split ~40 minutes roughly: 5-7 planning, 28-30 drafting, 3-5 reviewing. Skipping planning is the #1 cause of a wandering essay.', kind: 'tip' },
    { content: 'Read the prompt for its TASK VERB (analyze/argue/synthesize) before reading the passage/sources closely.', kind: 'tip' },
    { content: 'A quick outline (thesis + one evidence/job line per paragraph) takes under two minutes and prevents repeating the same point three times.', kind: 'tip' },
    { content: 'Pace-check at the midpoint: develop two points well rather than rush three thin ones.', kind: 'tip' },
    { content: 'Writing to discover your argument mid-draft is a high-risk strategy on a fixed clock — plan first.', kind: 'trap' },
    { content: 'RA: skim once, mark devices as you go. Argument: brainstorm 2-3 lines before choosing. Synthesis: check all sources\' stances before drafting a thesis.', kind: 'tip' },
  ],
};
