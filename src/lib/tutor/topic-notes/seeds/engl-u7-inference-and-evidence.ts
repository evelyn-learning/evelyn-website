/**
 * HS English — Unit 7 CED 7.4: Inferences & Supporting Evidence.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.engl.inference-and-evidence.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ENGL_U7_INFERENCE_AND_EVIDENCE: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.engl.inference-and-evidence.v1',
  course: 'HS English',
  cedUnit: 7,
  cedTopic: '7.4',
  cedTitle: 'Inferences & Supporting Evidence',
  planId: 'evelyn.hs.engl.inference-and-evidence.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.engl.inference-and-evidence.v1' }],
  theory: [
    { loId: 'engl.inference-and-evidence', content: `INFERENCE = EVIDENCE + REASONING — an inference is a conclusion the text does not state outright but does make available. You supply two things: the stated words you are reading from, and the reasoning (often ordinary background knowledge about how the world works) that connects those words to the conclusion. Missing either half, it is not an inference — it is a quotation or a guess.` },
    { loId: 'engl.inference-and-evidence', kind: 'framework', title: 'Supported is not the same as possible', content: `SUPPORTED IS NOT THE SAME AS POSSIBLE — a claim can be entirely plausible and still be unsupported. The question is never "could this be true?" but "does this text make me say it?" A store that shortens its hours might be losing money; unless the text gives you something that points there, that reading is your story, not the text's.` },
    { loId: 'engl.inference-and-evidence', kind: 'framework', title: 'The smallest-step rule', content: `THE SMALLEST-STEP RULE — strong inferences take ONE short step past the page and stop. The further you travel from the stated words, the more of your own assumptions you have to carry. When two readings are both available, prefer the one that needs less from you.` },
    { loId: 'engl.inference-and-evidence', kind: 'framework', title: 'Cite the line', content: `CITE THE LINE — an inference is only as strong as the words under it. State it in the form "claim + because + the exact wording": not "the district is happy with the new form" but "the district considers the new form an improvement — the office reports that the paperwork now arrives two days earlier."` },
    { loId: 'engl.inference-and-evidence', kind: 'framework', title: 'Stated vs implied', content: `STATED VS IMPLIED — a stated fact can be answered by pointing at a sentence; an implied one has to be built out of a sentence. Both are fair game in an argument, but only the implied one requires you to show your reasoning. Watch for the trap of dressing up a restatement as an inference: repeating the text in new words proves nothing.` },
    { loId: 'engl.inference-and-evidence', kind: 'framework', title: 'The overreach error', content: `THE OVERREACH ERROR — taking a real, cited detail and stretching it past its scope. Watch the absolute words: all, every, always, never, only, no longer. A text reporting that fewer families called the office does not support "no family ever calls now." The evidence was real; the claim outran it.` },
    { loId: 'engl.inference-and-evidence', kind: 'framework', title: 'The imported-experience error', content: `THE IMPORTED-EXPERIENCE ERROR — filling a gap in the text with your own life instead of ordinary background knowledge. Background knowledge is general and shared (a locked box is for keeping things safe); imported experience is specific and personal (my school did this because of budget cuts, so this one did too). The first helps you reason; the second quietly rewrites the text.` },
    { loId: 'engl.inference-and-evidence', kind: 'definition', title: 'inference', content: `a conclusion built from a text's stated evidence plus reasoning, rather than stated outright in it.` },
    { loId: 'engl.inference-and-evidence', kind: 'definition', title: 'textual evidence', content: `the specific words or lines of the text that support a claim, quoted or pointed to precisely.` },
    { loId: 'engl.inference-and-evidence', kind: 'definition', title: 'overreach', content: `a claim that starts from real evidence but extends further than that evidence can carry it.` },
  ],
  methods: [
    {
      title: 'Worked draw and defend',
      steps: [
        `Separate stated from implied. STATED: the north loop closes Monday; the south loop will be busier than usual; the south lot fills by eight on weekend mornings. Nothing here states why the south loop will get busier.`,
        `Find the gap worth crossing. The notice predicts a change on a trail it is not repairing — that prediction has to come from somewhere, and the only other fact on offer is the closure next door.`,
        `Add the reasoning: hikers turned away from one loop do not vanish; they go to the loop that is open. That is ordinary background knowledge, general enough to be shared, not a story about one particular hiker.`,
        `State the inference in cite-the-line form: the city expects the closure to push north-loop hikers onto the south loop — the notice tells visitors to "plan for the south loop to be busier than usual" in the same breath as the closure.`,
        `Check the step size. The claim stops at where the crowding comes from. It does not go on to say the repairs are unpopular, or that the south lot will overflow on a Tuesday — neither of those has a line under it.`,
      ],
      example: { problem: `Draw one inference from this excerpt and defend it with a line: "The city posted a notice at the trailhead: the north loop will close for repairs beginning Monday. Rangers added that visitors should plan for the south loop to be busier than usual, and that the small lot at the south gate fills by eight on weekend mornings."`, solution: `The city expects the north-loop closure to send its usual hikers to the south loop — evidence: the notice pairs the closure with a warning to "plan for the south loop to be busier than usual"` },
      relatedLoIds: ['engl.inference-and-evidence'],
    },
    {
      title: 'Worked overreach',
      steps: [
        `Give the student credit for the evidence: both cited facts are real. Print is down three years running, and the board is spending floor space on listening stations. The inference is not invented out of nothing — it is an overreach, which is the harder error to catch.`,
        `Name the scope jump. "Falling" is not "ending," and "adding twelve stations" is not "removing shelves." Phasing out is an absolute claim about the library's future, built on evidence that only describes a direction so far.`,
        `Test it the honest way: could every stated fact be true while the conclusion is false? Yes — a library can watch print decline for years, add listening stations, and keep buying print the entire time. When the facts survive the conclusion being false, the conclusion was never supported.`,
        `Rebuild it at the right size: the board expects audiobook demand to continue — it committed floor space to twelve listening stations right after reporting that audiobook checkouts rose by nearly half.`,
        `Notice what made the smaller claim safe: it stops at the board's expectation about audio, which the spending decision actually evidences, and says nothing about print's future, which nothing in the excerpt addresses.`,
      ],
      example: { problem: `A student reads this excerpt and concludes that the library is phasing out print books: "The library board reported that checkouts of print books fell for the third year in a row, while audiobook checkouts rose by nearly half. The board voted to add twelve listening stations on the second floor." Where does that inference break, and what does the excerpt actually support?`, solution: `The conclusion overreaches: falling print checkouts plus new listening stations support only that the board expects audiobook demand to continue, not that print is being phased out` },
      relatedLoIds: ['engl.inference-and-evidence'],
    },
  ],
  pointers: [
    { content: `Plausible is not the same as supported. Nothing in the excerpt mentions sales, costs, or trouble — and the sign supplies its own reason: the afternoons go to baking. A supported inference stays with the words on offer: the cafe is trading afternoon service for kitchen time. If you want the money claim, you need a line that points there, and this text does not have one.`, kind: 'common-error' },
    { content: `An inference is evidence plus reasoning — a conclusion the text makes available without stating it.`, kind: 'tip' },
    { content: `Plausible is not supported: ask "does this text make me say it?" not "could this be true?"`, kind: 'tip' },
    { content: `Take the smallest step past the page, and watch the absolute words — all, every, always, never, only — that mark an overreach.`, kind: 'tip' },
    { content: 'Every inference needs a cited line: claim + because + the exact wording.', kind: 'tip' },
    { content: `If the text already gives a reason, don't invent a different one. The cafe sign says the afternoons go to baking — reaching for "it must be losing money" ignores the reason printed on the page.`, kind: 'common-error' },
    { content: `Circle absolute words before you commit: *all, every, always, never, only, no longer, ending, phasing out*. Almost every overreach in this unit hides inside one of them. "Fewer families called" ≠ "no family calls."`, kind: 'gotcha' },
    { content: `Restating the text in new words is not an inference. If your "inference" can be checked by pointing at one sentence and nodding, you paraphrased. An inference must be *built* from a sentence, not lifted off it.`, kind: 'common-error' },
    { content: `Run the falsity test: could every stated fact be true while your conclusion is false? If yes, the text never supported it. Print checkouts can fall for years while the library keeps buying print.`, kind: 'tip' },
    { content: `Background knowledge is general and shared (hikers turned away go somewhere else). Imported experience is personal (my school did this because of budget cuts). Only the first is allowed to bridge a gap — the second rewrites the text.`, kind: 'vocab-note' },
    { content: `Write inferences as **claim + because + exact wording**, and quote the line, don't gesture at the paragraph. "The district sees an improvement — forms 'arrive an average of two days earlier'" beats "line 4 shows this."`, kind: 'tip' },
    { content: `When two readings both fit, take the one needing fewer assumptions. Granola bars by the door at 5:30 practice supports "some swimmers arrive unfed" — not "the coach thinks the schedule change was a mistake."`, kind: 'edge-case' },
    { content: `A detail can be real, cited, and correctly quoted and the claim on top of it still fail. Overreach starts from good evidence — so "but I have a quote" is never a defense of scope.`, kind: 'gotcha' },
  ],
};
