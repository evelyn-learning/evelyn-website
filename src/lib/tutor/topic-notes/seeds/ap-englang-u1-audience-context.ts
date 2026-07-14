/**
 * AP English Language & Composition — Unit 1 CED 1.5: Audience and Context.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.audience-context.v1`). Covers how a writer's
 * assumptions about audience and context shape stylistic choices, and how a
 * persona whose stated purpose diverges from the writer's real purpose
 * produces irony.
 *
 * Anchor text referenced in the method's example: Jonathan Swift, "A Modest
 * Proposal" (1729). The teaching point is HOW Swift's persona and assumed
 * audience knowledge construct irony, not the literal proposal itself —
 * quotes are limited to the short, canonical structural phrases already used
 * as anchor evidence for this passage.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_AUDIENCE_CONTEXT: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.audience-context.v1',
  course: 'AP English Language & Composition',
  cedUnit: 1,
  cedTopic: '1.5',
  cedTitle: 'Audience and Context',
  planId: 'evelyn.ap.englang.audience-context.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.audience-context.v1' }],
  theory: [
    {
      loId: 'apenglang.audience-context',
      kind: 'definition',
      title: 'audience awareness',
      content:
        "How a writer's assumptions about who is reading or listening shape diction, tone, and structure. A writer makes different choices depending on what they assume their reader already believes, values, or knows.",
    },
    {
      loId: 'apenglang.audience-context',
      kind: 'definition',
      title: 'context',
      content:
        "The historical/social circumstances a text assumes its audience already understands and therefore does NOT spell out. Missing the context means missing why certain choices land the way they do.",
    },
    {
      loId: 'apenglang.audience-context',
      kind: 'definition',
      title: 'persona',
      content:
        "A constructed narrating voice, distinct from the writer's own position, that a text speaks through. A persona can state a purpose sincerely on its own terms while the actual writer's purpose is entirely different — even opposite.",
    },
    {
      loId: 'apenglang.audience-context',
      kind: 'framework',
      title: 'surface audience vs. true audience',
      content:
        "Some writers construct a surface audience distinct from their true audience. The surface audience is who the text appears to be addressing or reasoning as; the true audience is who the writer is actually trying to move — and they aren't always the same.",
    },
    {
      loId: 'apenglang.audience-context',
      kind: 'definition',
      title: 'irony',
      content:
        "A gap between a persona's literal claim and the writer's real purpose, legible only to readers who share enough context to notice it. Irony depends on exactly this gap — the writer is counting on the true audience having enough context to notice rather than take the persona at its word.",
    },
    {
      loId: 'apenglang.audience-context',
      kind: 'strategy',
      title: 'the earnest-tone construction',
      content:
        'A classic construction: an earnest, reasonable-sounding, even statistic-laden setup (mimicking the tone of sincere policy writing) lulls a reader into treating the argument at face value — right up until a detail makes the literal claim impossible to accept sincerely, and the reader is forced to re-read everything before it as ironic.',
    },
    {
      loId: 'apenglang.audience-context',
      kind: 'strategy',
      title: 'the tell is the tone, not one line',
      content:
        "Recognizing irony is not about spotting one shocking line — it's about noticing that the earnest tone itself was a rhetorical choice, assuming an audience who shares enough context about the real crisis being addressed to recognize a monstrous 'solution' as pointed criticism, not sincere policy.",
    },
    {
      loId: 'apenglang.audience-context',
      kind: 'strategy',
      title: 'the reading question',
      content:
        "Reading for audience and context means asking: who does this writer assume already understands what's really going on — and is that assumed understanding what turns a literal statement into something else entirely?",
    },
  ],
  methods: [
    {
      title: 'Read a persona for audience-dependent irony',
      when_to_use:
        'Use when a text\'s stated position feels implausible, exaggerated, or oddly calm about something shocking — a signal the writer may be speaking through a persona.',
      steps: [
        'IDENTIFY THE ASSUMED CONTEXT — what crisis, genre convention, or shared background would the original audience have brought to this text without being told?',
        "IDENTIFY THE PERSONA'S SURFACE CLAIM — state, in the persona's own terms, what the narrating voice appears to sincerely argue.",
        "IDENTIFY THE TURN THAT BREAKS THE SURFACE READING — find the moment where the persona's tone stays unchanged even as the content becomes implausible as a sincere position.",
        "IDENTIFY THE TRUE AUDIENCE'S ROLE — determine who the writer assumes will recognize the gap between the persona's literal claim and the writer's real purpose.",
        'EXPLAIN WHY THE GAP IS THE POINT — describe what the moment of recognizing the irony accomplishes that stating the point directly would not.',
        "STATE THE ANALYTICAL CLAIM — name the specific stylistic choice (the unbroken tone, the persona's calm register) and the audience-dependent effect it produces.",
      ],
      example: {
        problem:
          "Analyze the opening of Jonathan Swift's 1729 pamphlet, which opens with earnest, statistic-minded concern for Irish poverty, methodically weighs the economics of child-rearing, and then pivots to naming a \"young healthy child... a most delicious nourishing and wholesome food.\" Explain how audience and context construct the irony here.",
        solution:
          "Swift constructs an earnest reformer persona whose careful, statistic-driven tone never breaks, even as the proposal turns to describing children as \"a most delicious nourishing and wholesome food.\" Because his true audience shares the context of real Irish poverty and recognizes the genre of sincere policy pamphlets being mimicked, that unbroken calm is what signals irony rather than sincerity — and the reader's own moment of registering the proposal as monstrous becomes the indictment of a political culture willing to calculate around suffering rather than address its causes.",
      },
      relatedLoIds: ['apenglang.audience-context'],
    },
  ],
  pointers: [
    { content: 'A surface audience (who a text appears to address) can differ from the true audience (who the writer is really trying to move).', kind: 'tip' },
    { content: "A persona's literal claim is not automatically the writer's real position — check whether the tone matches the content's plausibility.", kind: 'trap' },
    { content: 'The tell for irony is usually the unbroken, earnest TONE continuing through an implausible claim, not one shocking line by itself.', kind: 'tip' },
    { content: 'Missing the assumed context (the real crisis, the genre being mimicked) is the most common way a reader takes satire at face value.', kind: 'trap' },
    { content: 'Ask: who does the writer assume already understands what\'s really going on? That assumption is what turns the literal statement into irony.', kind: 'tip' },
  ],
};
