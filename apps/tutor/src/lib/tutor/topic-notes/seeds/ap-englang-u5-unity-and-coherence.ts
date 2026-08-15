/**
 * AP English Language & Composition — Unit 5 CED 5.2: Unity and Coherence.
 *
 * Hand-authored baseline (mirrors the lesson plan
 * `evelyn.ap.englang.unity-and-coherence.v1`). Builds on 5.1: a paragraph
 * must not just have a topic sentence, every sentence must actually serve
 * it. Covers unity, digression, and the distinction between "related to the
 * subject" and "relevant to the claim."
 *
 * Anchor text referenced in the method's example: Patrick Henry's "Give Me
 * Liberty or Give Me Death," whose rebuttal to "we are weak" stays
 * relentlessly on one claim across several sentences. Quotes are limited to
 * short, structural rhetorical phrases already used as anchor evidence for
 * this speech elsewhere in the course.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_ENGLANG_UNITY_AND_COHERENCE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.englang.unity-and-coherence.v1',
  course: 'AP English Language & Composition',
  cedUnit: 5,
  cedTopic: '5.2',
  cedTitle: 'Unity and Coherence',
  planId: 'evelyn.ap.englang.unity-and-coherence.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-10',
  sources: [{ type: 'plan', planId: 'evelyn.ap.englang.unity-and-coherence.v1' }],
  theory: [
    {
      loId: 'apenglang.unity-and-coherence',
      kind: 'definition',
      title: 'unity',
      content:
        "The property that every sentence in a paragraph serves that paragraph's single topic-sentence claim. A unified paragraph has no sentence that could be deleted without weakening the paragraph's job, and no sentence that actually belongs to a different point.",
    },
    {
      loId: 'apenglang.unity-and-coherence',
      kind: 'definition',
      title: 'digression',
      content:
        "Any sentence that, however true or well-written, does not serve the paragraph's stated claim. Digressions are dangerous precisely because they often feel relevant — they are about the same broader subject — even though they answer a different question than the paragraph is asking.",
    },
    {
      loId: 'apenglang.unity-and-coherence',
      kind: 'definition',
      title: 'coherence',
      content:
        'The sentence-to-sentence FLOW of a paragraph — a different quality from unity. A paragraph can be perfectly coherent, reading smoothly with one sentence leading naturally to the next, while still containing a sentence that breaks unity by quietly drifting off the paragraph\'s actual claim.',
    },
    {
      loId: 'apenglang.unity-and-coherence',
      kind: 'strategy',
      title: 'the test for unity',
      content:
        'Can you trace every sentence back to the topic sentence with a clear "this sentence supports THAT claim because..."? If any sentence fails that test, it breaks unity — it should either be cut, or the topic sentence needs to change, which usually means the paragraph is really two paragraphs.',
    },
    {
      loId: 'apenglang.unity-and-coherence',
      kind: 'trap',
      title: 'related to the subject vs. relevant to the claim',
      content:
        'The core unity trap: treating RELATED-TO-THE-SUBJECT (broadly about the same topic) as if it were the same thing as RELEVANT-TO-THE-CLAIM (specifically supports this paragraph\'s claim). A sentence can share a subject with the paragraph while answering a completely different question.',
    },
    {
      loId: 'apenglang.unity-and-coherence',
      kind: 'strategy',
      title: 'digressions smuggle themselves in',
      content:
        'Digressions often smuggle themselves in as background information, a related fact, or an aside that feels relevant because it is about the same broader subject, even though it does not support the specific claim the paragraph is making.',
    },
    {
      loId: 'apenglang.unity-and-coherence',
      kind: 'strategy',
      title: 'fixing a digression is usually a cut, not a reword',
      content:
        'Revising for unity usually means CUTTING a sentence, not rewording it. A true digression rarely can be repaired by editing its phrasing, because the problem is what the sentence is doing there, not how it is worded.',
    },
    {
      loId: 'apenglang.unity-and-coherence',
      kind: 'framework',
      title: 'unity is not coherence',
      content:
        'Unity (does every sentence serve the claim?) and coherence (does the paragraph flow smoothly, sentence to sentence?) are different problems. A paragraph can flow perfectly while still failing unity — and a unified paragraph can still read choppily if it lacks cohesive devices (covered next, in 5.3).',
    },
    {
      loId: 'apenglang.unity-and-coherence',
      kind: 'strategy',
      title: 'reread the topic sentence after drafting',
      content:
        'Strong writers protect unity even under time pressure by rereading the topic sentence after drafting and checking each following sentence against it — one sentence, one test, every time.',
    },
  ],
  methods: [
    {
      title: 'Test a paragraph for unity and cut digressions',
      when_to_use:
        'Use after drafting a body paragraph, to confirm every sentence actually serves the topic sentence rather than merely relating to its subject.',
      steps: [
        "STATE THE PARAGRAPH'S TOPIC-SENTENCE CLAIM explicitly, in one clause.",
        'TRACE EACH SUBSEQUENT SENTENCE against that claim: "this sentence supports THAT claim because..."',
        'FLAG ANY SENTENCE THAT FAILS THE TEST — even if it is true, well-written, or about the same broad subject.',
        "CHECK WHETHER A FLAGGED SENTENCE IS A DIGRESSION (cut it) OR SIGNALS A SECOND SUB-CLAIM (split into a new paragraph with its own topic sentence, per 5.1).",
        'CONFIRM THE REVISED PARAGRAPH: every remaining sentence should visibly serve the single stated claim.',
      ],
      example: {
        problem:
          "Show that every sentence in Henry's rebuttal to the objection \"we are weak\" serves the SAME single claim, with none breaking unity into a different point.",
        solution:
          "Every sentence in Henry's rebuttal — the naming of the objection, the rhetorical questions about delay, the counter-evidence about numbers, and the appeal to providence — serves the single claim that waiting will not make the colonists stronger. None of it drifts into an unrelated point; that unbroken focus is what unity across multiple sentences looks like.",
      },
      relatedLoIds: ['apenglang.unity-and-coherence'],
    },
  ],
  pointers: [
    { content: "Unity means every sentence serves the paragraph's single topic-sentence CLAIM — not just its general subject.", kind: 'tip' },
    { content: 'A sentence can be true, well-written, and about the same broad topic, and still break unity if it answers a different question than the paragraph is asking.', kind: 'trap' },
    { content: 'Test: trace every sentence back to the topic sentence with "this supports THAT claim because..." — if a sentence fails, cut it or split the paragraph.', kind: 'tip' },
    { content: "Fixing a digression is usually a CUT, not a rewording — the problem is what the sentence is doing there, not how it's phrased.", kind: 'tip' },
    { content: 'Coherence (smooth flow) and unity (staying on the claim) are different problems — a paragraph can flow perfectly and still fail unity.', kind: 'trap' },
    { content: 'Digressions often disguise themselves as background info or a related aside — check relevance to the CLAIM, not just the subject.', kind: 'tip' },
  ],
};
