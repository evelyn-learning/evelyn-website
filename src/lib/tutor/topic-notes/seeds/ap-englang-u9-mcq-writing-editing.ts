/**
 * AP English Language & Composition — Unit 9 CED 9.3: MCQ Writing and
 * Editing Strategy.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.mcq-writing-editing.v1`). Covers the exam's
 * composition/editing MCQs: a numbered student-draft passage with questions
 * asking which revision best adds evidence, improves a transition, tightens
 * wordy phrasing, or fixes a consistency error.
 *
 * No anchor passage — this topic works from short, invented student-draft
 * sentences (the exam's own MCQ format), matching the source plan.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_MCQ_WRITING_EDITING: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.mcq-writing-editing.v1',
  course: 'AP English Language & Composition',
  cedUnit: 9,
  cedTopic: '9.3',
  cedTitle: 'MCQ Writing and Editing Strategy',
  planId: 'evelyn.ap.englang.mcq-writing-editing.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.mcq-writing-editing.v1' }],
  theory: [
    {
      loId: 'apenglang.mcq-writing-editing',
      kind: 'definition',
      title: 'stated goal',
      content:
        'The specific editing purpose named in the question stem (e.g. "add evidence," "fix a transition") that a correct revision must serve. The most common error is evaluating choices against a vague "sounds more sophisticated" standard instead of the stated goal.',
    },
    {
      loId: 'apenglang.mcq-writing-editing',
      kind: 'definition',
      title: 'transition question',
      content:
        'An MCQ asking which connector correctly signals the logical relationship between two sentences/ideas — contrast ("however," "yet"), cause/effect ("therefore," "as a result"), addition ("moreover," "furthermore"), or concession ("admittedly," "granted"). Picking a formal-sounding word that signals the WRONG relationship is a classic trap.',
    },
    {
      loId: 'apenglang.mcq-writing-editing',
      kind: 'definition',
      title: 'consistency question',
      content:
        'Tests verb tense, pronoun reference, or register (formal vs. casual) matching the rest of the passage. Scan the surrounding sentences for the established tense/pronoun/register — a choice that\'s "correct-sounding" in isolation can still break consistency with its neighbors.',
    },
    {
      loId: 'apenglang.mcq-writing-editing',
      kind: 'strategy',
      title: 'evidence questions need specificity',
      content:
        'Evidence questions ask which revision adds a SPECIFIC, relevant detail supporting a claim already made. Reject choices that are vague, off-topic, or that merely restate the claim without adding new supporting detail.',
    },
    {
      loId: 'apenglang.mcq-writing-editing',
      kind: 'strategy',
      title: 'conciseness without losing meaning',
      content:
        'Conciseness questions ask which revision cuts redundancy or wordiness WITHOUT losing meaning. The trap is a shorter option that accidentally drops necessary information, or a choice that\'s shorter but still padded with empty phrases ("due to the fact that" for "because").',
    },
    {
      loId: 'apenglang.mcq-writing-editing',
      kind: 'strategy',
      title: 'goal first, then judge each choice',
      content:
        'The fastest check: read the goal in the question stem FIRST, then read each choice asking only "does this specific choice accomplish THAT stated goal" — not "is this choice well-written in general." A choice can be perfectly grammatical and still wrong because it solves a different problem than the one asked about.',
    },
    {
      loId: 'apenglang.mcq-writing-editing',
      kind: 'strategy',
      title: 'always re-read with neighbors',
      content:
        'Always re-read the full sentence (or the sentence before/after) with the choice substituted in — evaluating a revision in isolation, without its neighbors, is how transition and consistency errors slip through.',
    },
    {
      loId: 'apenglang.mcq-writing-editing',
      kind: 'trap',
      title: 'sophistication is not the standard',
      content:
        'Picking whichever choice uses the most advanced vocabulary or the longest sentence is not a sound strategy — these questions test whether a specific revision accomplishes a stated goal, not general polish.',
    },
  ],
  methods: [
    {
      title: 'Match a revision choice to the stated editing goal',
      when_to_use:
        'Use on any numbered-passage MCQ that asks which revision best serves a named goal (add evidence, fix a transition, cut wordiness, match consistency).',
      steps: [
        'READ THE STATED GOAL in the question stem — identify exactly what the revision needs to accomplish.',
        'IDENTIFY THE ACTUAL RELATIONSHIP OR NEED in the surrounding sentences (e.g. cause/effect vs. contrast; established tense/register).',
        'ELIMINATE CHOICES THAT MISMATCH THE GOAL, even if they sound natural or formal in isolation.',
        'CONFIRM THE REMAINING CHOICE by re-reading the full sentence and its neighbors with it substituted in.',
      ],
      example: {
        problem:
          "A numbered draft reads: '(4) Remote work has become common since 2020. (5) However, it has increased productivity for many employees.' Which choice best replaces the underlined transition in sentence 5: (A) However, (B) Therefore, (C) For example,, (D) In contrast,?",
        solution:
          "The stated goal is matching the connector to the actual logical relationship between sentences 4 and 5 (cause leading to an effect), not general polish. (A) and (D) signal contrast, which doesn't exist here. (C) signals an example, but sentence 5 is a broader consequence, not an instance. (B) 'Therefore' correctly signals the cause/effect relationship.",
      },
      relatedLoIds: ['apenglang.mcq-writing-editing'],
    },
  ],
  pointers: [
    { content: 'Every writing/editing question gives a STATED GOAL in its stem — judge choices against THAT goal, not general polish.', kind: 'tip' },
    { content: 'A natural-sounding transition that signals the wrong logical relationship (contrast vs. cause/effect) is the classic trap.', kind: 'trap' },
    { content: 'Evidence choices must be specific and relevant, not vague generalities or true-but-irrelevant facts.', kind: 'tip' },
    { content: 'Consistency questions require scanning surrounding sentences for the established tense/pronoun/register.', kind: 'tip' },
    { content: 'Re-read the full sentence and its neighbors with the choice substituted in before selecting — never evaluate in isolation.', kind: 'tip' },
    { content: 'Longer, fancier-sounding choices are not automatically better — match the stated goal, not the vocabulary level.', kind: 'trap' },
  ],
};
