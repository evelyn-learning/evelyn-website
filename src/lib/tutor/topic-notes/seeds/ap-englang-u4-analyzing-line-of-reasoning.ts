/**
 * AP English Language & Composition — Unit 4 CED 4.4: Analyzing a Line of
 * Reasoning.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.analyzing-line-of-reasoning.v1`). The capstone topic of
 * Unit 4: tracing how a writer's claims BUILD cumulatively across a whole
 * text — each claim a premise or warrant for the next — rather than reading
 * a passage as a list of disconnected clever moves.
 *
 * Anchor texts referenced in the method's example: Frederick Douglass's
 * "What to the Slave Is the Fourth of July?" (concession-pivot-escalation
 * arc) and Lincoln's Gettysburg Address (premise-to-demand chain). Quotes
 * are limited to short structural/rhetorical-question phrases.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_ANALYZING_LINE_OF_REASONING: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.analyzing-line-of-reasoning.v1',
  course: 'AP English Language & Composition',
  cedUnit: 4,
  cedTopic: '4.4',
  cedTitle: 'Analyzing a Line of Reasoning',
  planId: 'evelyn.ap.englang.analyzing-line-of-reasoning.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.analyzing-line-of-reasoning.v1' }],
  theory: [
    {
      loId: 'apenglang.analyzing-line-of-reasoning',
      kind: 'definition',
      title: 'line of reasoning',
      content:
        "The logical chain a writer builds across a whole text — a sequence of claims where each one functions as a premise, warrant, or stepping stone that the NEXT claim depends on, culminating in the writer's overall purpose.",
    },
    {
      loId: 'apenglang.analyzing-line-of-reasoning',
      kind: 'definition',
      title: 'warrant',
      content:
        'The underlying logical link that lets one claim support or lead to the next — the reasoning that makes the connection between stages explicit rather than assumed.',
    },
    {
      loId: 'apenglang.analyzing-line-of-reasoning',
      kind: 'definition',
      title: 'concession',
      content:
        "A point a writer grants to the audience's existing belief before pivoting against it. A concession only stings on the pivot because it genuinely built up a hopeful or comfortable alternative first.",
    },
    {
      loId: 'apenglang.analyzing-line-of-reasoning',
      kind: 'framework',
      title: 'tracing a line of reasoning',
      content:
        "Break the text into its major stages (often paragraph by paragraph, or move by move), state the CLAIM each stage is making in one clause, and then ask what LOGICAL RELATIONSHIP connects each stage to the next — does it concede, then pivot? Does it escalate? Does it use an early claim as the necessary foundation for a later, bigger one?",
    },
    {
      loId: 'apenglang.analyzing-line-of-reasoning',
      kind: 'strategy',
      title: 'connective tissue marks the joints',
      content:
        'Transition words and structural pivots ("but," "yet," "therefore," a paragraph that suddenly shifts pronoun or address) often mark the JOINTS of a line of reasoning — where one claim hands off to the next.',
    },
    {
      loId: 'apenglang.analyzing-line-of-reasoning',
      kind: 'framework',
      title: 'concession → pivot → escalation',
      content:
        "A common and powerful shape: the writer grants something (often what the audience already believes or hopes), then pivots against it, then pushes the resulting claim to its most consequential form. Recognizing this shape helps you see the arc instead of just the individual sentences.",
    },
    {
      loId: 'apenglang.analyzing-line-of-reasoning',
      kind: 'trap',
      title: 'list vs. line of reasoning',
      content:
        'A response that says "first he does X, then he does Y, then he does Z" with no stated relationship between them is a list, not a line of reasoning. Always name the logical relationship (concession, pivot, escalation) connecting each stage to the next.',
    },
    {
      loId: 'apenglang.analyzing-line-of-reasoning',
      kind: 'strategy',
      title: 'the payoff of tracing the arc',
      content:
        'Tracing a line of reasoning lets you explain not just THAT a text is persuasive, but HOW the persuasion accumulates — why the ending lands as hard as it does BECAUSE of what was established earlier, not in spite of it.',
    },
    {
      loId: 'apenglang.analyzing-line-of-reasoning',
      kind: 'rhetorical-device',
      title: 'pivot / turn',
      content:
        "The structural moment a text shifts direction, often marked by a transition word or change in address. A pivot only lands with force when the stage before it has genuinely built up something for the pivot to reverse.",
    },
    {
      loId: 'apenglang.analyzing-line-of-reasoning',
      kind: 'strategy',
      title: 'the swap test',
      content:
        'Could you swap the order of your "first... then... then..." sentence without changing its truth? If yes, you have described a sequence, not a chain of reasoning — a real chain breaks if its stages are reordered, because each stage depends on the one before it.',
    },
  ],
  methods: [
    {
      title: "Trace a line of reasoning across a passage",
      when_to_use:
        'Use when asked to explain how an argument BUILDS across a whole text, rather than analyzing any single paragraph or device in isolation.',
      steps: [
        "STATE EACH STAGE'S CLAIM in one clause, in the order the text presents them.",
        'NAME THE RELATIONSHIP BETWEEN CONSECUTIVE STAGES — does stage 2 concede, pivot against, or escalate stage 1?',
        'LOOK FOR CONNECTIVE TISSUE — transition words or shifts in address that mark the joints between stages.',
        'CHECK FOR THE CONCESSION → PIVOT → ESCALATION SHAPE, or another cumulative pattern, across the whole arc.',
        'EXPLAIN WHY THE ORDER MATTERS — state why the later stage depends on, and is made possible by, the earlier one.',
      ],
      example: {
        problem:
          "Trace the line of reasoning across the four paragraphs of Douglass's speech excerpt, from the opening question through the closing indictment.",
        solution:
          "Douglass's line of reasoning moves: (1) an opening question about whether the nation's principles extend to him, (2) a concession imagining how light his task would be if the answer were yes, (3) a pivot — \"this Fourth of July is yours, not mine\" — that only stings because Stage 2 just built up real hope, and (4) an escalation into a systematic ironic indictment (\"a sham,\" \"hollow mockery\") that generalizes the pivot's reversal across every value the holiday claims to celebrate. Each stage depends on and intensifies the one before it — the ending lands as hard as it does BECAUSE of the hopeful alternative Douglass built and then denied.",
      },
      relatedLoIds: ['apenglang.analyzing-line-of-reasoning'],
    },
  ],
  pointers: [
    { content: 'A line of reasoning is a cumulative CHAIN — each claim is a premise/warrant the next depends on, not a list of separate moves.', kind: 'tip' },
    { content: "To trace it: state each stage's claim in one clause, then name the logical relationship (concession, pivot, escalation) linking it to the next.", kind: 'tip' },
    { content: 'Watch for connective tissue — "but," "yet," "therefore," a shift in address — these mark the joints where one stage hands off to the next.', kind: 'tip' },
    { content: 'A common powerful shape: concession → pivot/turn → escalation.', kind: 'tip' },
    { content: '"First...then...then..." with no stated relationship between stages is a sequence, not a line of reasoning.', kind: 'trap' },
    { content: 'Test: could you swap the order of your "first/then/then" sentence without changing its truth? If yes, you\'ve described a sequence, not a chain.', kind: 'trap' },
  ],
};
