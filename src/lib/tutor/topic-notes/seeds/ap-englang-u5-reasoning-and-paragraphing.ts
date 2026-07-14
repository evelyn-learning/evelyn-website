/**
 * AP English Language & Composition — Unit 5 CED 5.1: Reasoning and
 * Paragraphing.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.reasoning-and-paragraphing.v1`). Opens Unit 5
 * (Organization and Coherence): the PARAGRAPH is the unit that carries one
 * increment of a line of reasoning forward, opened by a topic sentence that
 * states the paragraph's sub-claim.
 *
 * Anchor text referenced in the method's example: Lincoln's Gettysburg
 * Address, whose three paragraph breaks carry forward the past → present →
 * future stages of the reasoning. Quotes are limited to short structural
 * phrases already public-domain and non-graphic.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_REASONING_AND_PARAGRAPHING: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.reasoning-and-paragraphing.v1',
  course: 'AP English Language & Composition',
  cedUnit: 5,
  cedTopic: '5.1',
  cedTitle: 'Reasoning and Paragraphing',
  planId: 'evelyn.ap.englang.reasoning-and-paragraphing.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.reasoning-and-paragraphing.v1' }],
  theory: [
    {
      loId: 'apenglang.reasoning-and-paragraphing',
      kind: 'definition',
      title: 'topic sentence',
      content:
        "A paragraph-opening sentence that states the paragraph's sub-claim — its miniature thesis. It should be identifiable in one read, and the rest of the paragraph should visibly serve it.",
    },
    {
      loId: 'apenglang.reasoning-and-paragraphing',
      kind: 'definition',
      title: 'one idea per paragraph',
      content:
        'The principle that a single paragraph should advance exactly one sub-claim, not several. A paragraph that tries to prove two different sub-claims splits the reader\'s attention and weakens both.',
    },
    {
      loId: 'apenglang.reasoning-and-paragraphing',
      kind: 'definition',
      title: 'structural paragraphing',
      content:
        "Using paragraph breaks themselves to mark stages of an argument's development — the break between two paragraphs can signal a shift in the reasoning before a single transition word is read.",
    },
    {
      loId: 'apenglang.reasoning-and-paragraphing',
      kind: 'framework',
      title: 'a paragraph carries one increment of the line of reasoning',
      content:
        "A paragraph is not just a formatting convention — it is the unit that carries ONE step of a line of reasoning forward. Each paragraph should advance the argument by exactly one increment: state a sub-claim, support it, then hand off to the next paragraph's sub-claim.",
    },
    {
      loId: 'apenglang.reasoning-and-paragraphing',
      kind: 'framework',
      title: 'the reliable paragraph shape',
      content:
        'TOPIC SENTENCE (the sub-claim) → development (evidence + commentary) → a closing move that either resolves the sub-claim or pivots toward the next paragraph.',
    },
    {
      loId: 'apenglang.reasoning-and-paragraphing',
      kind: 'strategy',
      title: 'the order of paragraphs is part of the reasoning',
      content:
        "Lincoln structures the Gettysburg Address as three paragraphs moving from the PAST (the founding) to the PRESENT (the war as a test of that founding) to the FUTURE (the unfinished work) — the paragraph breaks themselves mark the argument's stages, not just their content.",
    },
    {
      loId: 'apenglang.reasoning-and-paragraphing',
      kind: 'trap',
      title: 'a transition word does not make two claims one idea',
      content:
        'Treating grammatical connection between sentences (a transition word like "additionally") as if it were the same thing as ONE IDEA is a common error. A smooth transition does not repair a paragraph that is doing two jobs — the fix is two paragraphs, each with its own topic sentence.',
    },
    {
      loId: 'apenglang.reasoning-and-paragraphing',
      kind: 'strategy',
      title: 'a topic sentence makes a claim, not just names a subject',
      content:
        'A topic sentence doesn\'t just name a subject ("this paragraph is about liberty") — it makes a CLAIM the paragraph\'s evidence and commentary will go on to support ("Henry frames peace itself as a dangerous illusion").',
    },
    {
      loId: 'apenglang.reasoning-and-paragraphing',
      kind: 'strategy',
      title: 'the skim test',
      content:
        'Reasoning is visible at the paragraph level BEFORE it is visible at the sentence level: a reader should be able to skim just the topic sentences of an essay, in order, and reconstruct the entire line of reasoning.',
    },
  ],
  methods: [
    {
      title: 'Build a paragraph that carries one increment of the line of reasoning',
      when_to_use:
        'Use when drafting or revising a body paragraph, to confirm it does exactly one job and hands off cleanly to the next.',
      steps: [
        'STATE THE PARAGRAPH\'S SUB-CLAIM as a topic sentence — a claim, not just a subject.',
        'CHECK IT AGAINST THE PREVIOUS PARAGRAPH — does this sub-claim advance the argument by exactly one increment, without repeating or skipping a stage?',
        'DEVELOP THE SUB-CLAIM with evidence and commentary that stays on this ONE idea only.',
        'CLOSE WITH A HAND-OFF — a closing move that resolves the sub-claim or pivots toward the next paragraph\'s claim.',
        'RUN THE SKIM TEST — read only the topic sentences of the surrounding paragraphs in order; confirm they reconstruct the whole line of reasoning.',
      ],
      example: {
        problem:
          "Show how the Gettysburg Address's three paragraph breaks each carry forward one stage of Lincoln's reasoning, and identify the implicit topic-sentence claim of each.",
        solution:
          "Each of the Gettysburg Address's three paragraphs carries forward exactly one stage of the reasoning: paragraph 1 (the founding, past), paragraph 2 (the present war as the founding's test), paragraph 3 (the future task the living must complete). No paragraph mixes stages, and the paragraph breaks themselves — not just their content — mark the argument's structure.",
      },
      relatedLoIds: ['apenglang.reasoning-and-paragraphing'],
    },
  ],
  pointers: [
    { content: 'A paragraph carries forward exactly ONE increment of the line of reasoning — one sub-claim, developed, then a hand-off.', kind: 'tip' },
    { content: 'A topic sentence states a CLAIM, not just a topic — "this paragraph is about liberty" isn\'t one; "Henry frames peace as a dangerous illusion" is.', kind: 'tip' },
    { content: 'A smooth transition word ("additionally") doesn\'t turn two sub-claims into one idea — a paragraph that needs "and" between two claims needs two paragraphs.', kind: 'trap' },
    { content: 'The order of paragraphs is itself part of the reasoning — breaks can mark stages (past → present → future) before a single transition word is read.', kind: 'tip' },
    { content: 'Test: could a reader skim just the topic sentences, in order, and reconstruct the whole line of reasoning?', kind: 'tip' },
    { content: 'A paragraph that drifts across two sub-claims in the same breath forces the reader to do the organizing work the writer should have done.', kind: 'trap' },
  ],
};
