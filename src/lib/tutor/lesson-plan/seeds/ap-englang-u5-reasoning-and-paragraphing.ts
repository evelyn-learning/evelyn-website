/**
 * AP English Language & Composition — CED Unit 5.1: Reasoning and
 * Paragraphing.
 *
 * Opens Unit 5 (Organization and Coherence). Students already know how to
 * build a defensible thesis (Unit 1.3) and a paragraph-level line of
 * reasoning that chains claim → evidence → commentary (Unit 2's
 * line-of-reasoning skill, and Unit 1.4's evidence-and-commentary
 * mechanics). This topic zooms out one level: the PARAGRAPH itself is the
 * unit that carries one increment of that reasoning forward. A paragraph
 * that tries to do two jobs at once — or that buries its sub-claim instead
 * of stating it — breaks the reasoning chain no matter how strong its
 * evidence is.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * Anchor text: Abraham Lincoln, "The Gettysburg Address" (1863) —
 * evelyn.passage.lincoln-gettysburg.v1. The teaching point is how its three
 * paragraph breaks each carry forward exactly one stage of the reasoning
 * (past founding → present test → future task) — quotes below are limited
 * to short structural phrases already public-domain and non-graphic.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U5_REASONING_AND_PARAGRAPHING: LessonPlan = {
  id: 'evelyn.ap.englang.reasoning-and-paragraphing.v1',
  title: 'U5.1 Reasoning and Paragraphing',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.reasoning-and-paragraphing',
      description:
        'Build body paragraphs that each carry forward exactly one increment of a line of reasoning, opening with a topic sentence that states the paragraph\'s sub-claim.',
      standard: 'AP-ENGLANG-5.1',
    },
  ],
  prerequisites: ['apenglang.evidence-commentary', 'apenglang.line-of-reasoning-argument'],
  followUps: ['apenglang.unity-and-coherence'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel that paragraph breaks are load-bearing structure, not typographical white space, before naming "topic sentence."',
      script:
        "Imagine reading an essay with every paragraph break deleted — just one giant wall of text. The sentences would all still be grammatically fine, but you'd lose your place constantly: where does one point end and the next begin? Paragraph breaks aren't decoration, and they're not just 'a rest for the eyes.' Each paragraph is supposed to do ONE job — prove ONE sub-claim — before handing off to the next. When a paragraph tries to do two jobs, or never says what its job IS, the reader has to do the organizing work the writer should have done. Today we build paragraphs that each carry forward exactly one link in the chain of reasoning.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-reasoning-and-paragraphing',
      kind: 'concept',
      goal: 'Define topic sentence and one-idea-per-paragraph, and show how paragraph breaks themselves mark stages of a line of reasoning.',
      keyIdeas: [
        "A paragraph is not just a formatting convention — it's the unit that carries ONE step of a line of reasoning forward. Each paragraph should advance the argument by exactly one increment: state a sub-claim, support it, then hand off to the next paragraph's sub-claim.",
        "ONE IDEA PER PARAGRAPH: a paragraph that tries to prove two different sub-claims splits the reader's attention and weakens both. If a paragraph needs a second sub-claim, it needs a second paragraph.",
        "A TOPIC SENTENCE states the sub-claim the paragraph exists to prove — it's the paragraph's own miniature thesis. It should be identifiable in one read, and the rest of the paragraph should visibly serve it.",
        "A topic sentence doesn't just name a subject ('this paragraph is about liberty') — it makes a CLAIM the paragraph's evidence and commentary will go on to support ('Henry frames peace itself as a dangerous illusion').",
        "Reasoning is visible at the paragraph level BEFORE it's visible at the sentence level: a reader should be able to skim just the topic sentences of an essay, in order, and reconstruct the entire line of reasoning.",
        "A reliable paragraph shape: TOPIC SENTENCE (the sub-claim) → development (evidence + commentary, from Unit 1.4) → a closing move that either resolves the sub-claim or pivots toward the next paragraph.",
        "The ORDER of paragraphs is itself part of the reasoning. Lincoln structures the Gettysburg Address as three paragraphs moving from the PAST (the founding) to the PRESENT (the war as a test of that founding) to the FUTURE (the unfinished work) — the paragraph breaks themselves mark the argument's stages.",
        "Paragraphing failures usually ARE one-idea-per-paragraph violations: a paragraph that drifts from the founding to the war to the future in the same breath forces the reader to reconstruct a structure the writer should have already built.",
      ],
      vocabulary: [
        { term: 'topic sentence', definition: "a paragraph-opening sentence that states the paragraph's sub-claim — its miniature thesis." },
        { term: 'one idea per paragraph', definition: 'the principle that a single paragraph should advance exactly one sub-claim, not several.' },
        { term: 'line of reasoning', definition: 'the chain of connected sub-claims, in order, that builds toward a thesis.' },
        { term: 'structural paragraphing', definition: "using paragraph breaks themselves to mark stages of an argument's development." },
      ],
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-lincoln-paragraphing',
      kind: 'worked_example',
      problem:
        "Show how the Gettysburg Address's three paragraph breaks (mentioned in prose here — this segment type carries no passageId field — the resolved text is evelyn.passage.lincoln-gettysburg.v1) each carry forward one stage of Lincoln's reasoning, and identify the implicit topic-sentence claim of each.",
      steps: [
        "READ PARAGRAPH 1 IN ISOLATION. Its implicit sub-claim: the nation was founded on the proposition that all men are created equal — this is the PAST stage, and nothing else intrudes into this paragraph.",
        "READ PARAGRAPH 2. Its sub-claim: this war is the test of whether a nation so founded can endure — 'Now we are engaged in a great civil war, testing whether that nation...can long endure.' This is the PRESENT stage.",
        "READ PARAGRAPH 3. Its sub-claim: the living must complete the unfinished work so that government 'of the people, by the people, for the people' does not perish — the FUTURE stage.",
        "NOTICE EACH PARAGRAPH IS ONE IDEA. The founding is entirely paragraph 1's job; nothing about the war intrudes there, and nothing about the future intrudes into paragraph 2.",
        "NOTICE WHAT THE PARAGRAPH BREAK ITSELF DOES. Moving from paragraph 1 to paragraph 2 signals, structurally, 'the argument now shifts from what was founded to what is being tested' — before a single transition word is even read.",
        "STATE THE TAKEAWAY. The paragraph breaks are not neutral formatting — they ARE the visible shape of Lincoln's past-present-future reasoning. A reader skimming only the three implicit topic sentences could reconstruct the whole argument's stages.",
      ],
      answer:
        "Each of the Gettysburg Address's three paragraphs carries forward exactly one stage of the reasoning: paragraph 1 (the founding, past), paragraph 2 (the present war as the founding's test), paragraph 3 (the future task the living must complete). No paragraph mixes stages, and the paragraph breaks themselves — not just their content — mark the argument's structure.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-paragraph-lunch-policy',
      kind: 'try_yourself',
      problem:
        "Write ONE well-structured body paragraph developing this sub-claim as your topic sentence (you may adapt its wording, but keep the claim): \"A school's decision to require a common lunch period undermines the very independence the school claims to value.\" Your paragraph must (1) open with a clear topic sentence stating this sub-claim, and (2) include at least one specific piece of supporting reasoning/evidence AND commentary explaining how it supports the claim. Stay on this ONE idea only — do not drift into a second, unrelated sub-claim (e.g. locker policy, dress code).",
      responseFormat: 'free',
      rubric: {
        parts: [
          {
            criterionId: 'topic-sentence',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): the paragraph opens with (or clearly states early) a topic sentence that asserts the given sub-claim as a CLAIM, not just a restated topic, and the sub-claim is identifiable as the paragraph's single job. Partial credit (1-2) for a topic sentence that is present but vague, buried mid-paragraph, or only loosely restates the claim without sharpening it. No credit for no identifiable topic sentence, or a sentence that only announces a subject ('this paragraph is about lunch policy') with no claim.",
            modelResponse:
              "By forcing every student into the same lunch period, the school strips away one of the few daily decisions — when and with whom to eat — that actually teaches the independence it claims to be preparing students for.",
          },
          {
            criterionId: 'development',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): the paragraph develops the single stated sub-claim with specific reasoning/evidence (a concrete example or mechanism, not a vague generality) AND commentary connecting that evidence back to the sub-claim, staying on ONE idea throughout — no drift into an unrelated second claim. Partial credit (1-2) for development that is present but thin, generic, or that drifts partway into an unrelated point. No credit for a paragraph with no real development (evidence-free assertion) or one built from two or more disconnected sub-claims.",
            modelResponse:
              "Under the current system, a student who wants to eat with a mentor teacher, use the library quietly, or simply eat at a different pace than the assigned block has no way to do so — every choice about the hour is made for them. A school that hands students a fixed schedule for exactly the choice it says builds independence is teaching compliance with a schedule, not the judgment it claims to value.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: 'misconception-two-ideas-one-paragraph',
      kind: 'misconception_check',
      question:
        'A student writes one long paragraph that argues BOTH that the common lunch period undermines independence AND that the new locker assignment policy is unfair, connecting the two with "Additionally, the school also..." Is this acceptable paragraphing?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Treating grammatical connection between sentences (a transition word like "additionally") as if it were the same thing as ONE IDEA — as long as sentences are smoothly linked, students assume the paragraph is doing its job.',
          correctsTo:
            "No — a transition word connects sentences grammatically, but it doesn't make two different sub-claims into one idea. This paragraph is doing two jobs (lunch policy AND locker policy), which means each sub-claim gets only half the development it needs, and the reader has to do the work of separating them. The fix isn't a better transition — it's TWO paragraphs, each with its own topic sentence and its own full development. The test: can you state the paragraph's job in a single sentence? If that sentence needs an \"and\" joining two unrelated claims, it's two paragraphs, not one.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "A paragraph carries forward exactly ONE increment of a line of reasoning — one sub-claim, developed, then a hand-off to the next paragraph.",
        "A topic sentence states the paragraph's sub-claim as a CLAIM, not just a topic — it's the paragraph's own miniature thesis.",
        "One idea per paragraph: a paragraph that needs a second sub-claim needs a second paragraph, no matter how smoothly a transition word connects the sentences.",
        "The order of paragraphs is itself part of the reasoning — paragraph breaks can mark stages (e.g. past → present → future) before a single transition word is read.",
        "Test: could a reader skim just the topic sentences, in order, and reconstruct the whole line of reasoning? If not, the paragraphing isn't doing its job yet.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.1',
    cedTitle: 'Reasoning and Paragraphing',
    sources: [
      {
        type: 'plan',
        source: 'AP Plans Initiative — AP English Language',
      },
    ],
  },
};
