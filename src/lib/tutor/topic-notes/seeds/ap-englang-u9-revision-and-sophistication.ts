/**
 * AP English Language & Composition — Unit 9 CED 9.4: Revision and Earning
 * the Sophistication Point.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.revision-and-sophistication.v1`). The course's final
 * topic: turning a competent-but-flat paragraph into one that earns Row C
 * (Sophistication) through revision — a qualification, a considered
 * counterposition, or an explicit stake — not extra vocabulary or length.
 *
 * No anchor passage — this topic works from a short sample weak paragraph
 * the student revises, matching the source plan.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_REVISION_AND_SOPHISTICATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.revision-and-sophistication.v1',
  course: 'AP English Language & Composition',
  cedUnit: 9,
  cedTopic: '9.4',
  cedTitle: 'Revision and Earning the Sophistication Point',
  planId: 'evelyn.ap.englang.revision-and-sophistication.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.revision-and-sophistication.v1' }],
  theory: [
    {
      loId: 'apenglang.revision-and-sophistication',
      kind: 'definition',
      title: 'sophistication point (Row C)',
      content:
        'The AP Lang rubric point rewarding writing that demonstrates a NUANCED or COMPLICATED understanding of the rhetorical situation or argument — not a fourth example, not fancier diction, not a longer paragraph. Earned through the THINKING, not the word count.',
    },
    {
      loId: 'apenglang.revision-and-sophistication',
      kind: 'definition',
      title: 'qualify (revision)',
      content:
        'To narrow an absolute claim to a precise, still-defensible boundary that shows where and why it holds — e.g. replacing "always" with "most effectively when paired with X."',
    },
    {
      loId: 'apenglang.revision-and-sophistication',
      kind: 'definition',
      title: 'considered counterposition',
      content:
        'A brief acknowledgment of a case that could cut against the claim, answered rather than ignored — showing the writer tested their own argument rather than only defending it.',
    },
    {
      loId: 'apenglang.revision-and-sophistication',
      kind: 'framework',
      title: 'three revision moves that earn sophistication',
      content:
        '(1) QUALIFY THE THESIS — narrow an absolute claim to a precise, still-defensible boundary. (2) ADD A CONSIDERED COUNTERPOSITION AND ANSWER IT — acknowledge a case that could cut against your claim, then explain why your reading still holds. (3) STATE THE STAKES — explain briefly WHY the distinction matters beyond satisfying the prompt.',
    },
    {
      loId: 'apenglang.revision-and-sophistication',
      kind: 'strategy',
      title: 'find the flat sentence first',
      content:
        'Revising for sophistication starts with finding the flat sentence, not adding a new one. Read your own thesis or topic sentence and ask: "is this true in EVERY case, or could I name the specific condition that makes it true?"',
      },
    {
      loId: 'apenglang.revision-and-sophistication',
      kind: 'trap',
      title: 'sophistication cannot be bolted on',
      content:
        'A vague, universal-sounding closing sentence ("this shows the complexity of the human condition") is the single most common failed attempt at Row C — it isn\'t actually connected to the specific evidence and claim just made. Genuine sophistication is always SPECIFIC to the argument at hand.',
    },
    {
      loId: 'apenglang.revision-and-sophistication',
      kind: 'strategy',
      title: 'push commentary one link further',
      content:
        'Commentary can also be pushed toward sophistication: instead of stopping at "this device does X," add "this device does X, though it risks Y" or "this device does X, which matters more for THIS audience than a different one" — extending the chain of reasoning one more link.',
    },
    {
      loId: 'apenglang.revision-and-sophistication',
      kind: 'strategy',
      title: 'the deletion test',
      content:
        'Test for a successful revision: does the new sentence show you considered an alternative, a boundary, or a stake that a flatter version would have skipped? If the added sentence could be deleted without losing any actual thinking (only losing word count), it isn\'t sophistication yet.',
    },
  ],
  methods: [
    {
      title: 'Revise a flat paragraph to earn the sophistication point',
      when_to_use:
        'Use after drafting a technically correct but flat body paragraph — one where every sentence is accurate but stops at the first correct observation.',
      steps: [
        'DIAGNOSE THE FLATNESS — identify which claims/commentary are true but stop at the first correct observation, with no qualification, counterposition, or stated stakes.',
        'QUALIFY THE CLAIM — narrow an absolute statement to the specific condition under which it holds.',
        'ADD A CONSIDERED COUNTERPOSITION — acknowledge a case that could cut against the claim, then explain why the reading still holds.',
        'STATE THE STAKES BRIEFLY — explain why the distinction matters beyond the prompt.',
        'REWRITE THE PARAGRAPH WITH THESE MOVES FOLDED IN, modifying the existing claims rather than appending an unconnected coda.',
      ],
      example: {
        problem:
          "Revise this flat but technically correct paragraph to earn sophistication: 'Lincoln uses repetition in his speech. He repeats words like \"dedicate\" and phrases like \"of the people.\" This repetition makes his speech more persuasive and memorable. It shows he was a great writer.'",
        solution:
          "Revised: Lincoln's repetition is not merely decorative but escalating — \"we can not dedicate—we can not consecrate—we can not hallow\" moves through near-synonyms of increasing weight, enacting the very insufficiency of words the sentence describes. Repetition risks sounding like padding in a weaker speech, but because each repeated element intensifies rather than restates the last, it instead performs the address's central claim — that language itself falls short of the soldiers' sacrifice — which is part of how Lincoln achieves such gravity in under three hundred words.",
      },
      relatedLoIds: ['apenglang.revision-and-sophistication'],
    },
  ],
  pointers: [
    { content: 'Sophistication rewards nuanced THINKING specific to your argument — not extra vocabulary, length, or a generic closing sentence.', kind: 'tip' },
    { content: 'Three reliable moves: qualify an absolute claim, add and answer a considered counterposition, or state the stakes.', kind: 'tip' },
    { content: 'Sophistication modifies EXISTING claims and commentary — it isn\'t bolted on as an unconnected coda at the end.', kind: 'trap' },
    { content: 'Test: if a sentence could be pasted into a different essay on a different topic unchanged, it\'s decoration, not sophistication.', kind: 'trap' },
    { content: 'Revision, not first drafting, is usually where sophistication is found — read your own flat sentence for a missing boundary, counterposition, or stake.', kind: 'tip' },
    { content: 'Elevated vocabulary ("multifaceted," "profound complexity") is not itself evidence of sophisticated thinking.', kind: 'trap' },
  ],
};
