/**
 * Digital SAT — Unit 6 CED 6.1: Words in Context.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.dsat.words-in-context.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_DSAT_U6_WORDS_IN_CONTEXT: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.dsat.words-in-context.v1',
  course: 'Digital SAT',
  cedUnit: 6,
  cedTopic: '6.1',
  cedTitle: 'Words in Context',
  planId: 'evelyn.testprep.dsat.words-in-context.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.dsat.words-in-context.v1' }],
  theory: [
    { loId: 'dsat.words-in-context', kind: 'framework', title: 'Two digital-SAT prompts, one skill', content: `TWO DIGITAL-SAT PROMPTS, ONE SKILL — "Which choice completes the text with the most logical and precise word or phrase?" (fill-the-blank) and "As used in the text, the word/phrase ___ most nearly means" (define-in-context). Both are graded the same way: does the choice fit THIS sentence, not just the dictionary.` },
    { loId: 'dsat.words-in-context', kind: 'framework', title: 'Process', content: `PROCESS — read the full sentence (and the sentence before/after when given), predict a plain-English word or at least a positive/negative direction before looking at the choices, then match your prediction to the closest choice.` },
    { loId: 'dsat.words-in-context', kind: 'framework', title: 'Context clues', content: `CONTEXT CLUES — a direct restatement or definition in the sentence; a synonym or example right next to the target word; a contrast signal (although, despite, however, yet, but, while) that flips the expected direction; a cause/result signal (because, therefore, so) that confirms it.` },
    { loId: 'dsat.words-in-context', content: `TRAP: DENOTATION OVER CONTEXT — the wrong choice is a real, common dictionary meaning of the word (a legal "trial," a scientific "trial," an athletic "trial") that simply does not fit this sentence's meaning.` },
    { loId: 'dsat.words-in-context', content: `TRAP: CONNOTATION MISMATCH — the wrong choice is close in literal meaning but carries the wrong emotional shade (generous vs. equitable; stingy vs. frugal; arrogant vs. confident).` },
    { loId: 'dsat.words-in-context', content: `TRAP: WRONG-DIRECTION — the wrong choice fits the general topic but points the opposite way from a nearby contrast word like "despite," "but," or "however."` },
    { loId: 'dsat.words-in-context', content: `TRAP: SOUNDS-SMART DISTRACTOR — a choice that is longer or more sophisticated-sounding than the correct answer, but does not actually fit the sentence as precisely.` },
    { loId: 'dsat.words-in-context', kind: 'framework', title: 'Strategy', content: `STRATEGY — eliminate every choice that contradicts your one-word prediction FIRST, then compare the survivors for precision. Never pick a word just because it sounds advanced.` },
    { loId: 'dsat.words-in-context', kind: 'definition', title: 'denotation', content: `a word's literal, dictionary meaning — the meaning the SAT often sets as a trap when it doesn't fit the sentence.` },
    { loId: 'dsat.words-in-context', kind: 'definition', title: 'connotation', content: `the emotional or cultural shade a word carries beyond its literal meaning (positive, negative, or neutral).` },
    { loId: 'dsat.words-in-context', kind: 'definition', title: 'context clue', content: `a nearby word or phrase — synonym, contrast, example, or cause — that signals a word's meaning in this specific sentence.` },
  ],
  methods: [
    {
      title: 'Worked fill blank',
      steps: [
        `Find the signal word: "but" introduces a contrast between what researchers would EXPECT (color change only near a threat) and what they actually OBSERVE (octopuses changing color alone).`,
        `Predict a plain-English word for how researchers would react to an unexpected finding: "confusing," "surprising," "hard to explain."`,
        `Match: (A) predictable is the opposite of unexpected — eliminate. (C) irrelevant and (D) convenient don't fit a finding researchers are actively debating. (B) puzzling matches "unexpected and hard to explain."`,
      ],
      example: { problem: `Read the passage: "Marine biologists have long debated why some octopus species change color even when no predator is nearby. Recent field studies suggest the shifts are not always defensive; they can also communicate mood or reproductive readiness. If color change served only as camouflage, researchers would expect it to occur only in the presence of a threat, but octopuses have been recorded flashing patterns while completely alone, which most researchers now find ______." Question: Which choice completes the text with the most logical and precise word or phrase? (A) predictable (B) puzzling (C) irrelevant (D) convenient`, solution: '(B) puzzling' },
      relatedLoIds: ['dsat.words-in-context'],
    },
    {
      title: 'Worked most nearly means',
      steps: [
        `Locate "trials" in context: "a series of small trials that tested her patience," followed by stalled negotiations, endless rewrites, and long waits.`,
        `Predict a plain-English word: "hardships," "frustrations," "taxing experiences" — nothing legal or scientific.`,
        `Eliminate the denotation traps: (A) courtroom proceedings is the legal meaning — no court is described. (C) experiments is the scientific meaning — no experiment is described. (D) athletic competitions is irrelevant. (B) taxing experiences matches "tested her patience."`,
      ],
      example: { problem: `Read the passage: "In her memoir, the retired diplomat describes the early years of her career as a series of small trials that tested her patience long before any major crisis arrived. She recalls sitting through hours of stalled negotiations, drafting reports that were rewritten a dozen times, and waiting months for replies to routine cables. Looking back, she credits this slow, unglamorous grind with teaching her more about diplomacy than any single dramatic summit ever did." Question: As used in the text, what does the word "trials" most nearly mean? (A) courtroom proceedings (B) taxing experiences (C) experiments (D) athletic competitions`, solution: '(B) taxing experiences' },
      relatedLoIds: ['dsat.words-in-context'],
    },
  ],
  pointers: [
    { content: `Words in Context questions almost always test a LESS common or contextual meaning, not the first meaning that comes to mind. Here "novel" is used as an adjective meaning "new and original." Predict a plain-English word from the sentence itself ("new," "innovative") before matching to choices — never lock in the first meaning you know.`, kind: 'common-error' },
    { content: `Predict a plain-English word — or at least a positive/negative direction — before looking at the answer choices.`, kind: 'tip' },
    { content: `Watch for contrast and cause signal words (although, despite, however, but, because, therefore) — they tell you which direction the answer must point.`, kind: 'tip' },
    { content: `Eliminate the "common dictionary meaning" trap and the "close but wrong connotation" trap — the right answer fits THIS sentence, not the word's most familiar sense.`, kind: 'tip' },
    { content: `The two digital-SAT phrasings — "most logical and precise word" and "most nearly means" — are the same skill: context fit beats vocabulary size.`, kind: 'tip' },
    { content: `Check the **part of speech** the blank/word takes before eliminating. "Novel approach" is an adjective; "a novel" is a noun. If a choice only works as a different part of speech than the sentence needs, it's out regardless of meaning.`, kind: 'gotcha' },
    { content: `The colon, semicolon, or dash right after a blank is a gift: what follows RESTATES the blank. In "residents were largely ______: they had fond memories and did not want the pool demolished," the punctuation guarantees the blank equals "opposed."`, kind: 'tip' },
    { content: `Don't trust the passage's overall tone to set the blank's tone. In the "tight operation" item, corporate praises her but the cashiers criticize her — the word itself must be neutral-descriptive ("strictly controlled"), not praising or insulting.`, kind: 'common-error' },
    { content: `"Most nearly means" answers are graded on substitution: plug the choice back in for the original word and reread the whole sentence. If the sentence gets clunky or changes meaning, it's wrong even if it's a real synonym.`, kind: 'tip' },
    { content: `**Half-right trap:** a choice can match direction (negative/positive) and still lose on precision. "Puzzling," "irrelevant," and "inconvenient" are all non-positive; only one names *hard to explain*. After direction-elimination, compare survivors on specific meaning, not vibe.`, kind: 'gotcha' },
    { content: `Two contrast signals can cancel. "Although X, researchers were not ______" — the negative plus "although" flips twice, landing back on the original direction. Track each flip on your scratch paper rather than reacting to one signal word.`, kind: 'edge-case' },
    { content: `A word you've never seen isn't automatically wrong — and isn't automatically right. If you can't define a choice, eliminate the ones you CAN define that clearly fail, then take the unknown by elimination rather than avoiding or chasing it.`, kind: 'tip' },
    { content: `**Connotation** is the emotional shade, not intensity. "Equitable" vs. "generous" both sound positive, but only "equitable" means *fair to both sides* — the split-down-the-middle context demands even-handedness, not kindness.`, kind: 'vocab-note' },
  ],
};
