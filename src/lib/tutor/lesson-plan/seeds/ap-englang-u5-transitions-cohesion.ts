/**
 * AP English Language & Composition — CED Unit 5.3: Transitions and
 * Cohesion.
 *
 * Builds on 5.2 (unity — every sentence must serve the paragraph's claim):
 * now students learn to make the LOGICAL RELATIONSHIPS between sentences
 * and paragraphs visible to the reader. A unified paragraph can still read
 * as a disconnected list of true statements if the reader has to guess how
 * each sentence relates to the last — transitions and other cohesive
 * devices announce a connection that must already exist in the reasoning.
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics this plan follows.
 *
 * Anchor text: Abraham Lincoln, "The Gettysburg Address" (1863) —
 * evelyn.passage.lincoln-gettysburg.v1. The teaching point is how its
 * paragraph-opening transitions ("Now we are engaged...", "But, in a
 * larger sense...") mark specific logical relationships between the
 * speech's three stages — quotes below are limited to short, structural
 * public-domain phrases.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U5_TRANSITIONS_COHESION: LessonPlan = {
  id: 'evelyn.ap.englang.transitions-cohesion.v1',
  title: 'U5.3 Transitions and Cohesion',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.transitions-cohesion',
      description:
        'Select transitions and other cohesive devices that accurately signal the specific logical relationship (contrast, consequence, addition, concession, sequence) between ideas, guiding the reader between claims.',
      standard: 'AP-ENGLANG-5.3',
    },
  ],
  prerequisites: ['apenglang.unity-and-coherence'],
  followUps: ['apenglang.organizing-for-effect'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel that the wrong transition misrepresents an argument, before naming "cohesion" or the logical-relationship categories.',
      script:
        "Imagine a friend tells you: 'I studied all week for the test. Therefore, I failed it.' You'd probably stop and say — wait, that doesn't make sense; did you mean 'but' instead of 'therefore'? One tiny word changed whether the second sentence was supposed to follow logically from the first, or contradict it. Transitions aren't just connective tissue that makes writing sound smooth — they make a SPECIFIC claim about how two ideas relate. Get the transition wrong, and you've misrepresented your own reasoning, even if every individual sentence is true. Today we learn to choose the transition that actually matches the logic.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-transitions-cohesion',
      kind: 'concept',
      goal: 'Define transitions and cohesion, name the main logical-relationship categories, and show how a wrong transition misrepresents reasoning.',
      keyIdeas: [
        "TRANSITIONS are words or phrases that make an EXISTING logical relationship between ideas visible to the reader — they don't create the connection, they announce a connection that must already be there in the reasoning.",
        "COHESION is the broader quality of a paragraph or essay reading as connected rather than as a list of separate statements. Transitions are one tool for cohesion, but so are repeated key terms, clear pronoun reference, and parallel sentence structure.",
        "Transitions signal a SPECIFIC logical relationship, not just \"more text is coming\": contrast (but, however, yet), consequence (therefore, as a result), addition (moreover, furthermore), concession (granted, even so, admittedly), and sequence/time (now, then, finally).",
        "Choosing the WRONG transition misrepresents the logical relationship. Using \"therefore\" to link two ideas that are actually in tension miscommunicates the reasoning — which is worse than using no transition at all, because it actively asserts a false connection.",
        "Lincoln's 'Now we are engaged in a great civil war' uses a simple SEQUENCE transition to pivot the entire argument from the founding (paragraph 1) to the present test (paragraph 2) — one word marks a stage-change in the whole speech's reasoning.",
        "'But, in a larger sense, we can not dedicate — we can not consecrate — we can not hallow — this ground' uses a CONTRAST transition to reverse an expectation: a dedication speech that claims it cannot dedicate. The 'but' signals a genuine pivot, not decoration.",
        "Cohesive devices also work WITHIN and ACROSS paragraphs without a transition word at all — repeating a key term (dedicate/consecrate/hallow, or 'the people'), or using a pronoun that clearly refers back to an earlier noun, ties ideas together just as a transition does.",
        "The test for a transition: could you state, in your own words, the specific logical relationship it's marking (contrast? consequence? sequence?)? If you can't name the relationship, the transition is decorative filler, not real cohesion.",
      ],
      vocabulary: [
        { term: 'transition', definition: 'a word or phrase that signals a specific logical relationship between ideas.' },
        { term: 'cohesion', definition: 'the quality of a paragraph or essay reading as connected, achieved through transitions and other devices.' },
        { term: 'cohesive device', definition: 'any tool (transition, key-term repetition, pronoun reference, parallel structure) linking ideas without necessarily using a transition word.' },
        { term: 'logical relationship', definition: 'the specific way two ideas relate — contrast, consequence, addition, concession, or sequence.' },
      ],
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-lincoln-transitions',
      kind: 'worked_example',
      problem:
        "Show how Lincoln's paragraph-opening transitions (mentioned in prose here — this segment type carries no passageId field — the resolved text is evelyn.passage.lincoln-gettysburg.v1: \"Now we are engaged...\" and \"But, in a larger sense...\") mark specific logical relationships between the speech's three paragraphs, not just announce that more text is coming.",
      steps: [
        "IDENTIFY PARAGRAPH 1'S CLAIM. The nation was founded on the principle that all men are created equal — the past stage of the argument.",
        "IDENTIFY THE TRANSITION OPENING PARAGRAPH 2. 'Now we are engaged in a great civil war, testing whether...' — 'now' is a SEQUENCE transition, marking a shift specifically from past-founding to present-testing.",
        "TEST WHAT A DIFFERENT TRANSITION WOULD MISREPRESENT. If 'now' were replaced with a contrast word like 'however,' it would falsely suggest paragraph 2 contradicts paragraph 1, when it actually continues and tests it — the wrong transition would misstate the logic.",
        "IDENTIFY THE TRANSITION OPENING PARAGRAPH 3. 'But, in a larger sense, we can not dedicate...' — 'but' is a CONTRAST transition.",
        "NAME THE SPECIFIC CONTRAST IT MARKS. It reverses the audience's expectation that a dedication ceremony's speech dedicates the ground; Lincoln uses 'but' to pivot to who has ALREADY consecrated it (the soldiers), not the speaker.",
        "NOTE THE ADDED COHESIVE DEVICE. The repetition of 'dedicate...consecrate...hallow' — and 'dedicated' again later — ties paragraph 3 back to the ceremony's own vocabulary even while reversing its usual claim, without needing another transition word to do it.",
        "STATE THE TAKEAWAY. Transitions must match the actual logical relationship (sequence vs. contrast), or they misrepresent the reasoning; key-term repetition is a second cohesive tool operating alongside transitions, not a substitute for unity.",
      ],
      answer:
        "Lincoln's 'now' is a sequence transition marking the pivot from past-founding to present-test, while his 'but' is a contrast transition marking the reversal from expected dedication to who has actually already consecrated the ground; the repeated dedicate/consecrate/hallow vocabulary adds cohesion across the pivot without another transition word. Swapping either transition for the wrong category would misstate the relationship between the paragraphs.",
      estimatedMinutes: 6,
    },
    {
      id: 'try-add-transition',
      kind: 'try_yourself',
      problem:
        "You are given two claims from a student essay, written with no transition between them: \"Whole-class group projects often let one or two students do most of the work while others coast. Group projects can still teach real collaboration skills when the teacher assigns clearly divided roles.\" Write ONE sentence that inserts a transition (or rewrites the opening of the second claim) to make the SPECIFIC logical relationship between these two claims explicit, and name which relationship your transition signals (contrast, consequence, addition, or concession).",
      responseFormat: 'free',
      rubric: {
        parts: [
          {
            criterionId: 'transition-accuracy',
            maxPoints: 6,
            scoringCriteria:
              "Full credit (6): the response writes a grammatically correct sentence connecting the two claims with a transition (or a rewritten opening) that accurately signals CONCESSION (e.g. 'even though,' 'granted,' 'that said') or a comparably accurate relationship, since the second claim acknowledges the first's problem before showing how it can be fixed — a straightforward contrast ('but'/'however') alone or an unmarked consequence ('therefore') would misrepresent the logic, so the response must name and justify the relationship it chose. Partial credit (3-4) for a plausible transition that connects the sentences but names the relationship inaccurately (e.g. calling a concession a 'consequence'), or for a transition that is directionally reasonable but grammatically awkward. No credit (0-2) for no transition inserted, a transition that clearly misrepresents the relationship (e.g. 'therefore' implying the coasting problem CAUSES successful collaboration) with no naming of the relationship at all, or an answer that merely restates both claims without connecting them.",
            modelResponse:
              "Even though whole-class group projects often let one or two students do most of the work while others coast, they can still teach real collaboration skills when the teacher assigns clearly divided roles — a concession that acknowledges the problem before showing how it can be fixed.",
          },
        ],
      },
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-any-transition-connects',
      kind: 'misconception_check',
      question:
        'A student links the two group-project claims above with: "Whole-class group projects often let one or two students do most of the work while others coast. Therefore, group projects can still teach real collaboration skills when the teacher assigns clearly divided roles." Is "therefore" an acceptable transition here?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            "Treating ANY transition word as interchangeable connective tissue — as long as two sentences are joined by SOME transition, students assume the logic is fine, without checking whether that specific word matches the actual relationship.",
          correctsTo:
            "No — \"therefore\" signals CONSEQUENCE: that the second claim follows logically FROM the first. But the second claim doesn't follow from students coasting — it's a concession that collaboration is still possible DESPITE that problem, under the right conditions. The accurate transition here is a concession word like \"even though\" or \"granted,\" not \"therefore.\" The test: state the relationship the transition claims to be marking (consequence, contrast, concession, addition, sequence), then check whether that's actually the relationship between the two ideas. A fluent-sounding transition that names the wrong relationship is worse than no transition, because it actively misstates the reasoning.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "A transition announces a logical relationship that must already exist between ideas — it doesn't create the connection.",
        "Name the relationship categories: contrast, consequence, addition, concession, sequence — and pick the transition that matches which one is actually happening.",
        "A wrong transition (e.g. \"therefore\" where the relationship is really a concession) actively misrepresents the reasoning — worse than no transition at all.",
        "Cohesion also comes from repeated key terms and clear pronoun reference, not only transition words.",
        "Test: can you state, in your own words, the specific relationship a transition is marking? If not, it's decorative filler, not real cohesion.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.3',
    cedTitle: 'Transitions and Cohesion',
    sources: [
      {
        type: 'plan',
        source: 'AP Plans Initiative — AP English Language',
      },
    ],
  },
};
