/**
 * Digital SAT — Unit 6 CED 6.2: Text Structure & Purpose.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.text-structure-purpose.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U6_TEXT_STRUCTURE_PURPOSE: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.text-structure-purpose.v1',
  course: 'Digital SAT',
  cedUnit: 6,
  cedTopic: '6.2',
  cedTitle: 'Text Structure & Purpose',
  planId: 'evelyn.testprep.dsat.text-structure-purpose.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.text-structure-purpose.v1' }],
  theory: [
    { loId: 'dsat.text-structure-purpose', content: `MAIN PURPOSE asks what the WHOLE text is doing. Answer choices are usually infinitive-verb phrases ("to describe...", "to argue...", "to compare..."). Pick the verb that matches what the text does start to finish, not just its opening or closing move.` },
    { loId: 'dsat.text-structure-purpose', content: `OVERALL STRUCTURE asks how the PARTS fit together — the text's shape. Common shapes: chronological/sequence, cause-and-effect, problem-then-solution, claim-then-evidence, general-to-specific, and (for arguments) opposing-views-then-resolution.` },
    { loId: 'dsat.text-structure-purpose', content: `SENTENCE FUNCTION asks what JOB one specific sentence performs relative to the sentence(s) immediately before and after it: introduce, exemplify, qualify/concede, contrast, transition, or conclude.` },
    { loId: 'dsat.text-structure-purpose', kind: 'framework', title: 'Strategy', content: `STRATEGY — before reading the choices, mentally label each sentence or paragraph's job in one or two words. For structure questions, do this for the whole text; for function questions, do it for the target sentence and its neighbors.` },
    { loId: 'dsat.text-structure-purpose', content: `TRAP: CONTENT-ACCURATE, FUNCTION-WRONG. A choice can correctly restate WHAT a sentence says while mislabeling what it DOES — e.g., calling a qualifying caveat a "refutation," or calling a supporting example a "counterargument."` },
    { loId: 'dsat.text-structure-purpose', content: `TRAP: PART-FOR-WHOLE. On a main-purpose question, a wrong choice often nails the purpose of just ONE paragraph (usually the first or the most vivid one) rather than the text as a whole.` },
    { loId: 'dsat.text-structure-purpose', content: `TRAP: HALF-RIGHT STRUCTURE. A structure choice can describe the first half of the text accurately and then misdescribe the second half (e.g., says the text "presents two views and reconciles them" when it actually presents one view and then undermines it — no reconciliation).` },
    { loId: 'dsat.text-structure-purpose', content: `TRAP: OVERSTATED VERB. Function and purpose choices love strong verbs — "refute," "prove," "disprove." Check the text's actual strength of claim: a sentence that "complicates" or "qualifies" a finding is not the same as one that "refutes" it.` },
    { loId: 'dsat.text-structure-purpose', kind: 'definition', title: 'text structure', content: `the organizational pattern connecting a passage's parts, e.g. chronological, cause-and-effect, or claim-then-evidence.` },
    { loId: 'dsat.text-structure-purpose', kind: 'definition', title: 'rhetorical function', content: `the job a sentence or phrase performs in context (to introduce, qualify, exemplify, contrast), as opposed to what it literally says.` },
    { loId: 'dsat.text-structure-purpose', kind: 'definition', title: 'qualify', content: 'to limit or add a condition to a claim, without fully rejecting it.' },
    { loId: 'dsat.text-structure-purpose', kind: 'definition', title: 'topic sentence', content: `the sentence that states a paragraph's main point, usually near its start.` },
  ],
  methods: [
    {
      title: 'Worked structure',
      steps: [
        `Label each sentence's job: S1 = idea proposed, then shelved. S2 = interest revived, testing begins. S3 = complication (manufacturing defects). S4 = resolution and current status.`,
        `That sequence of labels traces a single object (the alloy) through TIME, with a setback in the middle — a chronological account, not a comparison of two things and not a plain problem-then-solution (there is no single "problem" stated up front; the setback emerges partway through).`,
        `Reject shapes that don't match: it is not comparing two competing alloys, and it does not open with a general claim it then narrows (general-to-specific) — it opens with a specific 1969 event.`,
        `Best description: the passage traces, in chronological order, how the alloy moved from an early proposal through delay and a technical setback to eventual commercial adoption.`,
      ],
      example: { problem: `Read the passage: "In 1969, engineers at a small aerospace firm proposed a lightweight alloy for aircraft wings, but budget constraints shelved the idea for a decade. In the 1980s, rising fuel costs revived interest in weight reduction, and the alloy was finally tested. Early trials revealed manufacturing defects that took years to resolve. By 1995, refined production methods made the alloy commercially viable, and it is now standard in wide-body jets." Question: Which choice best describes the overall structure of the text?`, solution: `The text is organized chronologically: proposal (1969) → delay → revived interest and testing (1980s) → setback (defects) → resolution and adoption (1995).` },
      relatedLoIds: ['dsat.text-structure-purpose'],
    },
    {
      title: 'Worked function trap',
      steps: [
        `Look at what comes right before it: historians' claim that maritime shipping mainly caused the decline. Look at what comes right after it: a conclusion that the decline had MULTIPLE overlapping causes.`,
        `A tempting wrong answer says the sentence "refutes" or "disproves" the historians' claim entirely. But the final sentence only says causes were "multiple, overlapping" — it never says maritime shipping was NOT a factor.`,
        `So the sentence is not a full refutation; it introduces complicating evidence that sets up the passage's actual conclusion (multiple causes, not one).`,
        `Correct function: to introduce evidence that complicates the initial explanation, setting up the passage's concluding claim that the decline had more than one cause.`,
      ],
      example: { problem: `Read the passage: "Some historians argue that the decline of a particular trade route was caused mainly by the rise of maritime shipping. Overland caravans, they note, could not compete with the lower shipping costs of sea vessels. However, recent archaeological evidence suggests that regional political instability disrupted caravan routes years before maritime trade expanded significantly. This timeline discrepancy suggests the trade route's decline had multiple, overlapping causes rather than a single dominant one." Question: The sentence "However, recent archaeological evidence suggests that regional political instability disrupted caravan routes years before maritime trade expanded significantly" primarily functions to do what?`, solution: `It introduces evidence that complicates (not refutes) the historians' claim, setting up the passage's conclusion that the decline had multiple, overlapping causes.` },
      relatedLoIds: ['dsat.text-structure-purpose'],
    },
  ],
  pointers: [
    { content: `Function answers describe the ACTION the sentence performs relative to its neighbors — to qualify a finding, introduce a counterexample, transition, or concede a point — not a restatement of what the sentence literally says. Two sentences can have the same content and different functions depending on what surrounds them.`, kind: 'common-error' },
    { content: `Three stems, three lenses: MAIN PURPOSE = the whole text's goal (usually an infinitive verb phrase); OVERALL STRUCTURE = how the parts fit together; SENTENCE FUNCTION = the job one sentence does relative to its neighbors.`, kind: 'tip' },
    { content: `Before reading the choices, label each part's job in your head: proposal, evidence, complication, resolution.`, kind: 'tip' },
    { content: `Watch for content-accurate-but-wrong-job traps: a choice can correctly restate what a sentence says while mislabeling what it does.`, kind: 'tip' },
    { content: `Watch for overstated verbs ("refute," "prove") when the text only "qualifies" or "complicates" — match the choice's verb strength to the text's actual claim strength.`, kind: 'tip' },
    { content: `Signal words tell you the job before you analyze: *however/but/yet* = contrast or complicate; *for example/for instance* = exemplify; *although/admittedly* = concede; *thus/so* = conclude. Check whether the target sentence opens with one — it usually names the function outright.`, kind: 'tip' },
    { content: `"Text" vs. "underlined sentence": scan the stem for scope. "The main purpose of the text" ≠ "the function of the underlined sentence." Students who answer the wrong stem pick a choice that's true of the passage but not of the sentence — and it will be sitting right there as a distractor.`, kind: 'gotcha' },
    { content: `Beware the choice that describes a MISSING part. If a structure choice mentions a prediction, a rebuttal, a proposed solution, or an author's recommendation, point to the exact sentence that does it. If you can't, the choice is out — even if everything else in it fits.`, kind: 'common-error' },
    { content: `Purpose verbs are not interchangeable: *describe/explain* (neutral report) ≠ *argue/advocate* (takes a side) ≠ *evaluate/assess* (weighs merit) ≠ *compare*. If the text never makes a claim the author defends, any choice starting "to argue" or "to persuade" is wrong.`, kind: 'vocab-note' },
    { content: `First-person research passages: sentences reporting what a study *found* usually function as evidence, not as the author's claim. Don't pick "presents the author's hypothesis" for a sentence that's actually reporting a result someone else obtained.`, kind: 'edge-case' },
    { content: `In literary/narrative texts, structure choices talk about shifts — in setting, time, speaker, or perspective. Track WHO is observing and WHEN, not just what happens; a choice claiming a "shift from past to present" needs an actual tense or time marker in the text.`, kind: 'edge-case' },
    { content: `A single sentence can't be the "main purpose." On purpose questions, reject any choice whose content lives entirely in one sentence — especially a vivid opening anecdote or a closing quotation. The right answer must be true of the beginning AND the end.`, kind: 'gotcha' },
    { content: `"Qualify" ≠ "contradict." A qualifying sentence keeps the main claim alive while limiting it ("varied by site," "in some cases," "under certain conditions"). If the passage still draws a positive conclusion afterward, the sentence qualified — it didn't overturn.`, kind: 'vocab-note' },
  ],
};
