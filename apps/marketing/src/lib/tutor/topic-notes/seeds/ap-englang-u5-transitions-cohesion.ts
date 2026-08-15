/**
 * AP English Language & Composition — Unit 5 CED 5.3: Transitions and
 * Cohesion.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.transitions-cohesion.v1`). Builds on 5.2 (unity):
 * covers making the LOGICAL RELATIONSHIPS between sentences and paragraphs
 * visible to the reader, and how the wrong transition actively misstates
 * the reasoning.
 *
 * Anchor text referenced in the method's example: Lincoln's Gettysburg
 * Address, whose paragraph-opening transitions ("Now we are engaged...",
 * "But, in a larger sense...") mark specific logical relationships between
 * the speech's three stages. Quotes are limited to short structural
 * public-domain phrases.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_TRANSITIONS_COHESION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.transitions-cohesion.v1',
  course: 'AP English Language & Composition',
  cedUnit: 5,
  cedTopic: '5.3',
  cedTitle: 'Transitions and Cohesion',
  planId: 'evelyn.ap.englang.transitions-cohesion.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.transitions-cohesion.v1' }],
  theory: [
    {
      loId: 'apenglang.transitions-cohesion',
      kind: 'definition',
      title: 'transition',
      content:
        'A word or phrase that makes an EXISTING logical relationship between ideas visible to the reader — it does not create the connection, it announces a connection that must already be there in the reasoning.',
    },
    {
      loId: 'apenglang.transitions-cohesion',
      kind: 'definition',
      title: 'cohesion',
      content:
        'The broader quality of a paragraph or essay reading as connected rather than as a list of separate statements. Transitions are one tool for cohesion, but so are repeated key terms, clear pronoun reference, and parallel sentence structure.',
    },
    {
      loId: 'apenglang.transitions-cohesion',
      kind: 'definition',
      title: 'cohesive device',
      content:
        'Any tool — a transition word, key-term repetition, pronoun reference, parallel structure — that links ideas together, with or without an explicit transition word.',
    },
    {
      loId: 'apenglang.transitions-cohesion',
      kind: 'framework',
      title: 'the logical relationship categories',
      content:
        'Transitions signal a SPECIFIC logical relationship, not just "more text is coming": contrast (but, however, yet), consequence (therefore, as a result), addition (moreover, furthermore), concession (granted, even so, admittedly), and sequence/time (now, then, finally).',
    },
    {
      loId: 'apenglang.transitions-cohesion',
      kind: 'strategy',
      title: 'a transition announces a connection that must already exist',
      content:
        'A transition does not manufacture a logical relationship — it reveals one that is already present in the reasoning. If the underlying relationship isn\'t actually there, no transition word can create it.',
    },
    {
      loId: 'apenglang.transitions-cohesion',
      kind: 'trap',
      title: 'a wrong transition misrepresents the reasoning',
      content:
        'Choosing the WRONG transition misrepresents the logical relationship. Using "therefore" to link two ideas that are actually in tension miscommunicates the reasoning — which is worse than using no transition at all, because it actively asserts a false connection.',
    },
    {
      loId: 'apenglang.transitions-cohesion',
      kind: 'strategy',
      title: 'cohesion without a transition word',
      content:
        'Cohesive devices also work within and across paragraphs without a transition word at all — repeating a key term, or using a pronoun that clearly refers back to an earlier noun, ties ideas together just as a transition does.',
    },
    {
      loId: 'apenglang.transitions-cohesion',
      kind: 'strategy',
      title: 'the test for a real transition',
      content:
        "Could you state, in your own words, the specific logical relationship a transition is marking (contrast? consequence? sequence?)? If you can't name the relationship, the transition is decorative filler, not real cohesion.",
    },
    {
      loId: 'apenglang.transitions-cohesion',
      kind: 'rhetorical-device',
      title: 'sequence vs. contrast in Lincoln\'s pivots',
      content:
        'Lincoln\'s "Now we are engaged..." uses a SEQUENCE transition to pivot from the founding (past) to the present war being tested. His later "But, in a larger sense..." uses a CONTRAST transition to reverse the audience\'s expectation that a dedication speech dedicates the ground. Swapping either category would misstate the relationship between the paragraphs.',
    },
  ],
  methods: [
    {
      title: "Choose (or fix) a transition to match the actual logical relationship",
      when_to_use:
        'Use when connecting two claims, sentences, or paragraphs, or when checking whether an existing transition accurately represents the reasoning.',
      steps: [
        "IDENTIFY THE CLAIM BEFORE THE TRANSITION and the claim after it.",
        'NAME THE ACTUAL LOGICAL RELATIONSHIP between the two claims — contrast, consequence, addition, concession, or sequence.',
        'SELECT (OR CHECK) THE TRANSITION WORD against that named relationship — does the word actually match?',
        'TEST WHAT A DIFFERENT TRANSITION WOULD MISREPRESENT — would swapping it in falsely suggest a different relationship?',
        'CONSIDER OTHER COHESIVE DEVICES — could key-term repetition or pronoun reference reinforce (or substitute for) the transition?',
      ],
      example: {
        problem:
          'Show how Lincoln\'s paragraph-opening transitions ("Now we are engaged..." and "But, in a larger sense...") mark specific logical relationships between the speech\'s three paragraphs, not just announce that more text is coming.',
        solution:
          "Lincoln's \"now\" is a sequence transition marking the pivot from past-founding to present-test, while his \"but\" is a contrast transition marking the reversal from expected dedication to who has actually already consecrated the ground; the repeated dedicate/consecrate/hallow vocabulary adds cohesion across the pivot without another transition word. Swapping either transition for the wrong category would misstate the relationship between the paragraphs.",
      },
      relatedLoIds: ['apenglang.transitions-cohesion'],
    },
  ],
  pointers: [
    { content: "A transition announces a logical relationship that must already exist between ideas — it doesn't create the connection.", kind: 'tip' },
    { content: 'Name the relationship categories: contrast, consequence, addition, concession, sequence — then pick the transition that matches which one is actually happening.', kind: 'tip' },
    { content: 'A wrong transition (e.g. "therefore" where the relationship is really a concession) actively misrepresents the reasoning — worse than no transition at all.', kind: 'trap' },
    { content: 'Cohesion also comes from repeated key terms and clear pronoun reference, not only transition words.', kind: 'tip' },
    { content: "Test: can you state, in your own words, the specific relationship a transition is marking? If not, it's decorative filler.", kind: 'tip' },
    { content: 'Treating any transition as interchangeable connective tissue — as long as SOME word joins two sentences — skips checking whether that word matches the actual logic.', kind: 'trap' },
  ],
};
