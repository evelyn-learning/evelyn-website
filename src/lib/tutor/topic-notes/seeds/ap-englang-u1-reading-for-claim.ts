/**
 * AP English Language & Composition — Unit 1 CED 1.2: Reading for the
 * Writer's Claim.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.reading-for-claim.v1`). Covers distinguishing a text's
 * topic from its claim, telling a claim apart from a subordinate reason, and
 * a repeatable method for locating the claim in an unfamiliar passage.
 *
 * Anchor text referenced in the method's example: Patrick Henry, "Give Me
 * Liberty or Give Me Death" (1775). Quotes are limited to the short,
 * structural rhetorical phrases already used as anchor evidence elsewhere in
 * the unit.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_READING_FOR_CLAIM: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.reading-for-claim.v1',
  course: 'AP English Language',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: "Reading for the Writer's Claim",
  planId: 'evelyn.ap.englang.reading-for-claim.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.reading-for-claim.v1' }],
  theory: [
    {
      loId: 'apenglang.reading-for-claim',
      kind: 'definition',
      title: 'claim',
      content:
        'The arguable position a writer wants the reader to accept — the point the whole text is built to defend. "The Fourth of July" is a topic. "The Fourth of July exposes a nation\'s hypocrisy" is a claim.',
    },
    {
      loId: 'apenglang.reading-for-claim',
      kind: 'definition',
      title: 'topic vs. claim',
      content:
        'Topic is what a text is *about* (a subject); claim is what the text *argues* about that subject (an arguable position). Every passage has both — confusing them is the single most common way a reader gets lost.',
    },
    {
      loId: 'apenglang.reading-for-claim',
      kind: 'framework',
      title: 'the arguability test',
      content:
        "A claim must be arguable — a reasonable person could push back on it. A fact (\"the colonies were under British rule in 1775\") or a plot detail is never a claim, because there is nothing to dispute. Before calling something a claim, ask: could a reasonable reader disagree with it?",
    },
    {
      loId: 'apenglang.reading-for-claim',
      kind: 'strategy',
      title: 'claims are often assembled, not handed to you',
      content:
        "The claim is often NOT stated in one tidy sentence. In speeches and essays it's frequently built across paragraphs — you have to synthesize the writer's repeated moves into a single statement of what they want the reader to believe or do.",
    },
    {
      loId: 'apenglang.reading-for-claim',
      kind: 'definition',
      title: 'signal language',
      content:
        'Modal or evaluative wording ("must," "cannot," "ought," "the only course") and emphatic repetition that often mark where a writer is asserting their claim — the writer turning up the volume on the point they most want to land.',
    },
    {
      loId: 'apenglang.reading-for-claim',
      kind: 'trap',
      title: 'reason vs. claim',
      content:
        'Do not mistake a supporting reason for the claim itself. A reason justifies or defends the claim; it sits one rung below it. ("The colonists have petitioned and been ignored" is a reason. "Armed resistance is now the only remaining option" is the claim that reason supports.)',
    },
    {
      loId: 'apenglang.reading-for-claim',
      kind: 'definition',
      title: 'call to action',
      content:
        'An argument structured to move the audience toward a specific action. In a call to action, the claim often crystallizes at the *climax* — the point the build-up has been driving toward — rather than in the opening lines.',
    },
    {
      loId: 'apenglang.reading-for-claim',
      kind: 'strategy',
      title: 'the reliable test',
      content:
        "After reading, ask: \"What does this writer want me to BELIEVE or DO as a result of this text?\" Whatever one-sentence answer you give — if it's arguable — is the claim.",
    },
    {
      loId: 'apenglang.reading-for-claim',
      kind: 'framework',
      title: 'why this skill matters downstream',
      content:
        "Getting the claim right is the foundation for the rest of the unit: you cannot write a defensible thesis (1.3) about a text, or select relevant evidence for it (1.4), if you've misidentified what the text is arguing in the first place.",
    },
  ],
  methods: [
    {
      title: "Locate a writer's claim",
      when_to_use:
        'Use after reconstructing the rhetorical situation (1.1), before writing any thesis about the text.',
      steps: [
        'RULE OUT THE TOPIC — state what the text is about in one sentence, and confirm it names a subject, not a position. If it isn\'t arguable, it\'s the topic, not the claim.',
        'IDENTIFY THE SUBORDINATE REASONS — list the individual pieces of support the writer offers. Each reason justifies something; none of them, alone, is the point itself.',
        'FOLLOW THE SIGNAL LANGUAGE — watch for modal/evaluative words ("must," "cannot") and emphatic repetition; these mark where the writer is turning up the volume on their real point.',
        'LOCATE THE CLIMAX — in a call-to-action structure, find the statement the build-up has been driving toward, often near the end rather than the opening.',
        'APPLY THE TEST — ask what the writer wants the reader to believe or do as a result of the whole text.',
        'STATE THE CLAIM IN ONE ARGUABLE SENTENCE, distinguishing it from both the topic and the subordinate reasons that support it.',
      ],
      example: {
        problem:
          "Read Patrick Henry's 1775 speech to the Virginia Convention, which runs through petitions ignored, warnings about weakness, and a rising insistence that \"the war is actually begun.\" State the single claim the entire speech is built to defend.",
        solution:
          "Given that peaceful appeals to Britain have been exhausted and delay only weakens the colonies' position, armed resistance is no longer one option among several but the only remaining course open to Virginia. (This is arguable — a listener could have believed further negotiation was still possible — which is exactly why it's a claim and not a fact.)",
      },
      relatedLoIds: ['apenglang.reading-for-claim'],
    },
  ],
  pointers: [
    { content: 'Topic is what a text is about; claim is the arguable position it takes on that topic. Always ask which one you just stated.', kind: 'tip' },
    { content: 'A fact or plot detail can never be a claim — there has to be room for reasonable disagreement.', kind: 'trap' },
    { content: 'A subordinate reason supports the claim; it is not the claim. Ask: could this sentence be evidence FOR a bigger point, or IS it the bigger point?', kind: 'trap' },
    { content: 'Watch modal/evaluative words ("must," "cannot," "ought") and repetition — they flag where a claim is being asserted.', kind: 'tip' },
    { content: 'In calls to action, the claim often lands at the climax, not the opening — read to the end before committing to a claim.', kind: 'tip' },
    { content: 'The reliable test: "What does this writer want me to believe or do?" State that answer in one arguable sentence.', kind: 'tip' },
  ],
};
