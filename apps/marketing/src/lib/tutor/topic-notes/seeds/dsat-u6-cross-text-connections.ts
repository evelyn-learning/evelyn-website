/**
 * Digital SAT — Unit 6 CED 6.3: Cross-Text Connections.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.cross-text-connections.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U6_CROSS_TEXT_CONNECTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.cross-text-connections.v1',
  course: 'Digital SAT',
  cedUnit: 6,
  cedTopic: '6.3',
  cedTitle: 'Cross-Text Connections',
  planId: 'evelyn.testprep.dsat.cross-text-connections.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.cross-text-connections.v1' }],
  theory: [
    { loId: 'dsat.cross-text-connections', kind: 'framework', title: 'Format', content: `FORMAT — two short original passages, Text 1 and Text 2, on the same topic but usually by different authors or from different studies. The question asks how Text 2 relates to a specific claim in Text 1.` },
    { loId: 'dsat.cross-text-connections', kind: 'framework', title: 'Four relationship types', content: `FOUR RELATIONSHIP TYPES — Text 2 can SUPPORT (corroborate) Text 1's claim, CHALLENGE (refute) it, QUALIFY it (agree only under a specific condition), or EXTEND it (build on it with a new angle Text 1 didn't cover).` },
    { loId: 'dsat.cross-text-connections', kind: 'framework', title: 'Step 1', content: `STEP 1 — paraphrase Text 1's claim in one short sentence. STEP 2 — paraphrase Text 2's finding or position in one short sentence, SEPARATELY, before comparing. Blending the two too early causes mistakes.` },
    { loId: 'dsat.cross-text-connections', kind: 'framework', title: 'Trap 1', content: `TRAP 1 — SAME TOPIC DOES NOT MEAN SAME POSITION. Both texts studying the same phenomenon does not imply agreement; look at what each one actually concludes.` },
    { loId: 'dsat.cross-text-connections', kind: 'framework', title: 'Trap 2', content: `TRAP 2 — EXTREME LANGUAGE. Choices with "completely agrees," "entirely rejects," or "has no effect at all" are usually wrong. Real cross-text relationships are almost always qualified — Text 2 usually adds a condition rather than flatly agreeing or disagreeing.` },
    { loId: 'dsat.cross-text-connections', kind: 'framework', title: 'Trap 3', content: `TRAP 3 — OUTSIDE KNOWLEDGE OR "PLAUSIBLE" ANSWERS. The correct choice must be grounded in what Text 2 specifically says, not in what sounds reasonable in general or in what a scientist would "probably" think.` },
    { loId: 'dsat.cross-text-connections', kind: 'framework', title: 'Strategy', content: `STRATEGY — after paraphrasing both claims, ask: does Text 2's finding support, refute, complicate (add a condition to), or extend Text 1's claim? That single question usually eliminates two of the four choices immediately.` },
    { loId: 'dsat.cross-text-connections', kind: 'definition', title: 'corroborate', content: 'to provide independent support that confirms a claim.' },
    { loId: 'dsat.cross-text-connections', kind: 'definition', title: 'refute', content: 'to provide evidence that directly contradicts a claim.' },
    { loId: 'dsat.cross-text-connections', kind: 'definition', title: 'qualify', content: `to limit or add a condition to a claim rather than fully accepting or rejecting it.` },
  ],
  methods: [
    {
      title: 'Worked typical',
      steps: [
        `Paraphrase Text 1's claim: classical music reduces study stress for everyone, universally.`,
        `Paraphrase Text 2's finding: the effect only holds for students who already like classical music; it backfires for students who dislike it.`,
        `Text 2 directly undermines the word "universal" — the benefit is conditional on the listener's existing preference, not automatic.`,
        `This is a QUALIFY relationship, not a flat CHALLENGE — Text 2 does not say classical music never helps, only that the "universal" framing is too broad.`,
        `The correct answer states a qualified challenge: the effect is real for some but not universal — not flat agreement, not total rejection.`,
      ],
      example: { problem: `Text 1: A researcher played classical music during a two-hour study session for 60 undergraduates and measured stress with a standard self-report scale afterward. Reported stress dropped by nearly a third compared to a silent control group. The researcher concluded that classical music is a simple, universal tool students can use to reduce stress while studying. Text 2: A second researcher repeated the experiment but first asked participants whether they generally enjoyed classical music. Among students who already liked the genre, stress dropped as before. Among students who disliked it, stress actually rose. The researcher concluded that the effect depends on individual musical preference, not on any special calming property of classical music itself. Question: Based on the texts, how would the author of Text 2 most likely respond to the claim in Text 1 that classical music is a universal stress-reducing tool for studying?`, solution: `The author of Text 2 would likely argue that classical music's stress-reducing effect isn't universal — it depends on whether the listener already likes classical music, so Text 1's conclusion is too broad.` },
      relatedLoIds: ['dsat.cross-text-connections'],
    },
    {
      title: 'Worked trap',
      steps: [
        `Paraphrase Text 1's claim: the pesticide is the cause, so banning it is THE fix.`,
        `Paraphrase Text 2's finding: bees declined even in pesticide-free control plots (just less sharply); habitat loss from monoculture planting is also a major driver.`,
        `TRAP — a tempting wrong choice says Text 2 would "completely disagree that pesticides play any role." Too extreme: the sharper decline near farmland is still consistent with pesticides mattering; Text 2 just shows they are not the ONLY factor.`,
        `The correct relationship is QUALIFY, not CHALLENGE: pesticides likely do contribute, but banning them alone would not fully solve the problem because habitat loss is a separate, significant driver.`,
        `Reject any choice using "no role at all" or "the pesticide is not a factor" — Text 2 never claims that.`,
      ],
      example: { problem: `Text 1: An entomologist surveyed wild bee populations along stretches of farmland and found a sharp decline that tracked closely with a rise in the use of a common pesticide nearby. Based on this pattern, the entomologist recommended banning the pesticide as the primary way to reverse the decline. Text 2: A second entomologist studying the same region set up control plots several miles from any farmland, free of the pesticide entirely. Bee populations in these plots also declined, though less sharply. The researcher pointed to habitat loss from large-scale monoculture planting as an additional major driver, concluding that pesticide use is one contributor among several, not the sole cause. Question: Based on the texts, how would the author of Text 2 most likely respond to the claim in Text 1 that banning the pesticide would fix the wild bee decline?`, solution: `The author of Text 2 would likely agree pesticides contribute but caution that banning them alone would not solve the decline, since habitat loss also plays a significant role.` },
      relatedLoIds: ['dsat.cross-text-connections'],
    },
  ],
  pointers: [
    { content: `Same topic and equal credibility do not guarantee the same conclusion. Cross-Text Connections questions are answered from the WORDS of Text 2, not from a general impression that "they are both researchers, so they probably agree." Reread Text 2's stated finding before choosing — the relationship (support, challenge, qualify, extend) must be grounded in what Text 2 actually reports.`, kind: 'common-error' },
    { content: `Paraphrase Text 1's claim and Text 2's finding SEPARATELY before comparing — do not blend them.`, kind: 'tip' },
    { content: `The relationship is rarely all-or-nothing: choices with "completely agrees" or "entirely rejects" are usually wrong.`, kind: 'tip' },
    { content: `The correct answer must be grounded in what TEXT 2 specifically says, not in outside knowledge or a general impression that the texts are "on the same side."`, kind: 'tip' },
    { content: `Four relationship types to watch for: Text 2 supports, challenges, qualifies (adds a condition to), or extends Text 1's claim.`, kind: 'tip' },
    { content: `Read the question stem for WHICH claim it names. Stems say "the claim in Text 1 that ___" — Text 2 may agree with Text 1's data and still reject that specific conclusion. Answer about the named claim only, not the whole passage.`, kind: 'gotcha' },
    { content: `Watch for the word doing the work in Text 1: **universal, sole, always, all, wherever, directly**. Text 2 almost always attacks that one word, not the whole finding. Circle it before reading Text 2.`, kind: 'tip' },
    { content: `Distinguish QUALIFY from CHALLENGE precisely: qualify = "true, but only when/for..."; challenge = "the finding itself is wrong." If Text 2 reproduces Text 1's result in some subgroup or condition, it's qualifying — never flat refutation.`, kind: 'vocab-note' },
    { content: `"Text 2 would disagree" isn't automatically the extreme trap — scan for the reason clause after it. A choice reading "disagree, since the effect held only for X" can be correct; "disagree, since screens have no effect at all" is not.`, kind: 'common-error' },
    { content: `Mechanism swaps count as qualifying, not extending. When Text 2 says the real driver is deep sleep / participation / content type rather than the thing Text 1 credited, it's narrowing Text 1's claim — pick the choice naming the condition.`, kind: 'edge-case' },
    { content: `Don't reward a choice for being scientifically savvy. "Correlation doesn't prove causation" or "the sample was too small" is only right if Text 2 actually says it. Point to a sentence in Text 2 before you commit.`, kind: 'gotcha' },
    { content: `In paired texts, Text 2 is usually shorter and ends with an explicit "the researcher concluded..." sentence. That last sentence is the answer key — read it before rereading Text 1's details.`, kind: 'tip' },
    { content: `Cross-text is not the same as "main idea of Text 2." A choice can accurately summarize Text 2 and still be wrong if it never states a relationship to Text 1's claim. Correct answers contain a comparison word: agree, but / however / only if.`, kind: 'common-error' },
  ],
};
