/**
 * ACT — Unit 3 CED 3.3: Inference & Generalization.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.inference-generalization.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U3_INFERENCE_GENERALIZATION: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.inference-generalization.v1',
  course: 'ACT',
  cedUnit: 3,
  cedTopic: '3.3',
  cedTitle: 'Inference & Generalization',
  planId: 'evelyn.testprep.act.inference-generalization.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.inference-generalization.v1' }],
  theory: [
    { loId: 'act.inference-generalization', content: `AN INFERENCE is exactly ONE logical step from what the passage directly states — not zero steps (that's a detail question, answered by a quote) and not several steps (that's outside knowledge).` },
    { loId: 'act.inference-generalization', content: `A GENERALIZATION broadens several specific details in the passage into one overall claim — it needs support from MORE THAN ONE example, not a single moment.` },
    { loId: 'act.inference-generalization', content: `SIGNAL PHRASES to recognize instantly: "it can reasonably be inferred," "the passage suggests," "the author implies," "would most likely agree," "most strongly suggests."` },
    { loId: 'act.inference-generalization', content: `THE TEST: if you cannot point to the specific words in the passage that force an answer, it is not a valid inference — it is a guess, no matter how reasonable it sounds.` },
    { loId: 'act.inference-generalization', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — TOO FAR: the choice takes a real detail and stretches it past what the passage supports (a private habit becomes a sweeping belief about "all X").` },
    { loId: 'act.inference-generalization', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — OPPOSITE: the choice reverses the direction the evidence actually points.` },
    { loId: 'act.inference-generalization', kind: 'framework', title: 'Trap 3', content: `TRAP 3 — EXTREME LANGUAGE: "always," "never," "only," "completely" — the passage supports a tendency, not an absolute.` },
    { loId: 'act.inference-generalization', kind: 'framework', title: 'Trap 4', content: `TRAP 4 — OUTSIDE KNOWLEDGE: the choice is true in real life (or sounds like common sense) but the passage itself never establishes it — irrelevant, no matter how true.` },
    { loId: 'act.inference-generalization', kind: 'definition', title: 'inference', content: `a conclusion reasonably supported by the passage's details but not directly stated in the text.` },
    { loId: 'act.inference-generalization', kind: 'definition', title: 'generalization', content: `a broad claim built by combining several specific details or examples from across the passage.` },
    { loId: 'act.inference-generalization', kind: 'definition', title: 'textual support', content: `the specific words or details in the passage that justify picking one answer choice over another.` },
  ],
  methods: [
    {
      title: 'Worked typical inference',
      steps: [
        `Spot the signal phrase: "it can reasonably be inferred" — the answer must be supported by details, not quoted word-for-word.`,
        `List what IS stated: arrived three hours early, repeated a passage she's played 40+ times, adjusted an already-correct shoulder rest, asked the same question three times, refused a chair to keep practicing.`,
        `None of these individually says "Mara is anxious" — but every one of them is unnecessary repetition or over-checking of something already fine. That pattern points to one underlying state.`,
        `Check candidate answers: an answer claiming she is "unusually anxious about the performance despite her extensive experience" is supported by every detail listed. An answer claiming she "doubts her own talent" goes further than the text supports — nothing suggests she doubts her ability, only that she is nervous.`,
      ],
      example: { problem: `Passage excerpt: "Mara arrived at the concert hall three hours before the performance, though she had played this concerto more than forty times. She ran through the opening passage twice, adjusted the shoulder rest on her violin though it had not moved, and asked the stage manager three times whether the piano would be tuned before six. When a stagehand offered to fetch her a chair, she waved him off and kept practicing, her bow arm rising and falling in the same four measures, over and over, until the house doors opened." Question: It can reasonably be inferred from the passage that Mara is:`, solution: `Mara feels unusually anxious about the performance despite her extensive experience.` },
      relatedLoIds: ['act.inference-generalization'],
    },
    {
      title: 'Worked trap catching',
      steps: [
        `Signal phrase: "most strongly suggests" — same rules as "reasonably be inferred."`,
        `List what is stated: 11-year survey, redrew the coastline every season, refused three earlier publications, said an error "could sink a boat," and even the final map went out of date almost immediately.`,
        `Eliminate the TOO-FAR trap: "Voss believed all published maps were dangerous" — the passage only shows his standard for HIS OWN map, never a claim about maps in general.`,
        `Eliminate the EXTREME trap: "Voss achieved complete, lasting accuracy" — the last sentence undercuts this directly; two waterways were already gone by publication.`,
        `What survives every detail without overreaching: Voss prioritized accuracy over speed, even knowing the terrain would keep changing on him.`,
      ],
      example: { problem: `Passage excerpt: "In 1854, cartographer Edmund Voss published a map of the delta that took eleven years to survey, redrawing the coastline nearly every season as sandbars shifted overnight. Voss refused three offers to publish an earlier version, telling his editor that a map 'wrong in a single channel could sink a boat.' By the time the final edition appeared, two of the waterways it depicted no longer existed." Question: The passage most strongly suggests that Voss valued:`, solution: 'Voss prioritized accuracy over speed, even though the terrain kept changing.' },
      relatedLoIds: ['act.inference-generalization'],
    },
  ],
  pointers: [
    { content: `ACT inference answers must be provable using ONLY the passage's own words — no matter how true a fact is outside the passage, if you can't point to the specific details that support it, it's not the answer. The passage is a closed system: everything you need is on the page.`, kind: 'common-error' },
    { content: `"It can reasonably be inferred" means ONE logical step from what's directly stated — never zero steps (that's a detail question) and never several steps (that's outside knowledge).`, kind: 'tip' },
    { content: `If you can't point to specific words in the passage that support an answer, it's not a valid inference — it's a guess.`, kind: 'tip' },
    { content: `Generalizations need support from more than one example in the passage, not a single detail.`, kind: 'tip' },
    { content: `Eliminate choices that go too far, reverse the evidence, use extreme language ("always," "never," "only"), or import outside knowledge before picking the best-supported choice.`, kind: 'tip' },
    { content: `Watch the **half-right choice**: the first half paraphrases a real detail, the second half sneaks in an unsupported cause or motive. Read past the comma — "Mara is experienced *but no longer enjoys performing*" fails on the second clause alone.`, kind: 'gotcha' },
    { content: `Co-occurrence ≠ cause. If the passage says two things happened, a choice saying one *caused*, *resulted in*, or was *because of* the other needs actual causal wording in the text. Otherwise it's a step too far.`, kind: 'common-error' },
    { content: `Comparative choices ("more X than," "unlike her earlier work," "less concerned with") require the passage to discuss BOTH sides. If only one is described, eliminate — even if the described side is accurate.`, kind: 'gotcha' },
    { content: `"The author implies" ≠ "the narrator/character believes." A character's opinion in dialogue is a detail the author reports, not a view the author endorses. Check whose head the question is asking about before you scan.`, kind: 'vocab-note' },
    { content: `Extreme words aren't automatically wrong. If the passage itself says "refused *every* offer" or "never returned," a choice with "never" is fair. Eliminate absolutes only when the text shows a tendency, not when the text is absolute.`, kind: 'edge-case' },
    { content: `Generalization stems say "as a whole," "primarily," or "best characterizes." A choice supported by only one vivid paragraph is the trap; run each candidate against at least two separate moments in the passage before committing.`, kind: 'tip' },
    { content: `Don't reject the credited answer for being boring. ACT inferences are deliberately modest — "is uneasy," "prefers," "is reluctant." Choices with dramatic emotion ("resents," "is humiliated," "has lost faith in") usually overreach.`, kind: 'common-error' },
    { content: `Most inference questions give no line numbers. Locate the keyword from the stem, then read the sentence before and after it — support for the credited answer is almost always clustered within a few lines, not scattered across the passage.`, kind: 'tip' },
  ],
};
