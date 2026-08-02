/**
 * ACT — Unit 1 CED 1.6: Conciseness & Redundancy.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.testprep.act.conciseness.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_ACT_U1_CONCISENESS: TopicNotesBaseline = {
  baselineId: 'evelyn.testprep.act.conciseness.v1',
  course: 'ACT',
  cedUnit: 1,
  cedTopic: '1.6',
  cedTitle: 'Conciseness & Redundancy',
  planId: 'evelyn.testprep.act.conciseness.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-02',
  sources: [{ type: 'plan', planId: 'evelyn.testprep.act.conciseness.v1' }],
  theory: [
    { loId: 'act.conciseness', content: `THE HEURISTIC: when two or more choices are grammatically correct and express the same idea, pick the SHORTEST — including "DELETE THE UNDERLINED PORTION" when it is offered and grammatical.` },
    { loId: 'act.conciseness', content: `REDUNDANT PAIRS are the most common trap: two words or phrases repeating the same idea ("each and every," "unexpected surprise," "past history," "advance planning," "close proximity," "merged together," "true facts," "final outcome," "basic essentials"). Cut one half.` },
    { loId: 'act.conciseness', content: `PADDING PHRASES to compress on sight: "due to the fact that" → "because"; "in order to" → "to"; "at this point in time" → "now"; "the reason why is because" → "because."` },
    { loId: 'act.conciseness', content: `DELETE-THE-PHRASE choices appear constantly and are correct whenever the sentence still works — and keeps its full meaning — without the underlined words.` },
    { loId: 'act.conciseness', kind: 'framework', title: 'Exception 1', content: `EXCEPTION 1 — LOST MEANING: never cut a detail (a date, a name, a number) that a LATER sentence in the passage depends on, even if the sentence "reads fine" on its own.` },
    { loId: 'act.conciseness', kind: 'framework', title: 'Exception 2', content: `EXCEPTION 2 — BROKEN GRAMMAR: the shortest option is wrong if it deletes the sentence's only verb, creates a fragment, or leaves a dangling modifier. Grammatical correctness is checked FIRST, brevity SECOND.` },
    { loId: 'act.conciseness', content: `NO CHANGE can be the shortest, correct answer — don't assume the original underlined text is automatically "too long" just because a competing choice looks trim.` },
    { loId: 'act.conciseness', content: `TWO-STEP TEST before picking a "shorter" answer: (1) read the sentence with the phrase gone — is it still a complete, correct sentence? (2) scan the rest of the passage — does anything later need the detail you're about to cut?` },
    { loId: 'act.conciseness', kind: 'definition', title: 'redundancy', content: `saying the same thing twice in different words, e.g. "unexpected surprise" or "true facts."` },
    { loId: 'act.conciseness', kind: 'definition', title: 'wordiness', content: `using more words than necessary to express an idea, even without outright repetition.` },
    { loId: 'act.conciseness', kind: 'definition', title: 'DELETE the underlined portion', content: `an ACT answer choice that removes the tested words entirely — correct whenever the sentence still works, and still means the same thing, without them.` },
  ],
  methods: [
    {
      title: 'Worked redundant pair',
      steps: [
        `Spot the redundant pair: "a large number of" and "numerous" both mean "many" — the sentence says "many" twice.`,
        `Test dropping one half: "numerous clinical trials" is still a complete, correct noun phrase.`,
        `Compare word count against the other grammatically correct options — "numerous clinical trials" beats every longer combination that keeps both qualifiers.`,
        `Confirm no meaning is lost: the sentence still says the vaccine went through many trials.`,
      ],
      example: { problem: `An article reads: "The article explains that the new vaccine underwent 'a large number of numerous clinical trials' before approval." What is the most concise, grammatically correct revision of the underlined portion, "a large number of numerous clinical trials"?`, solution: 'numerous clinical trials' },
      relatedLoIds: ['act.conciseness'],
    },
    {
      title: 'Worked lost meaning trap',
      steps: [
        `Check what the phrase does: it gives Chen's rank and branch of service — information not stated anywhere else in the passage.`,
        `Apply the DELETE test: does the sentence lose meaning the passage needs? Yes — her military background is the detail readers need to understand who she is.`,
        `"Shortest grammatically correct answer wins" only applies when meaning survives. Deleting is grammatically fine here but not meaning-preserving, so it fails the second half of the test.`,
        `Reject DELETE. Keep the descriptive phrase (NO CHANGE), even though it is the longest option, because it supplies required information found nowhere else.`,
      ],
      example: { problem: `A biography reads: "Grace Chen, 'a rear admiral in the U.S. Navy,' pioneered early computer programming languages." A student wants to delete the underlined portion, "a rear admiral in the U.S. Navy," entirely to make the sentence shorter, reasoning that "shortest wins." Is deleting the phrase the best choice?`, solution: `Keep the phrase (NO CHANGE) — deleting it removes required information, so shortest does not win here.` },
      relatedLoIds: ['act.conciseness'],
    },
  ],
  pointers: [
    { content: `DELETE only wins the same test every other choice has to pass: (1) the remaining sentence must still be complete and correct, and (2) no meaning the passage needs is lost. If deleting leaves a fragment, or cuts a fact another sentence relies on, a longer choice is correct even though DELETE is offered.`, kind: 'common-error' },
    { content: `When multiple choices are grammatically correct and preserve meaning, pick the shortest — including DELETE THE UNDERLINED PORTION when offered.`, kind: 'tip' },
    { content: `Watch for redundant pairs that say the same thing twice ("each and every," "unexpected surprise," "merged together") — cut the repeat.`, kind: 'tip' },
    { content: `EXCEPTION: never shorten past the point where you lose a fact another sentence needs, or where the result is a fragment or broken grammar.`, kind: 'tip' },
    { content: `Test every "shorter" candidate two ways: does it still form a complete sentence, and does the passage still make sense without what got cut?`, kind: 'tip' },
    { content: `Redundancy hides across the underline, not inside it. If the sentence already says "in 1912," the underlined "back then" is redundant even though "back then" alone looks fine. Read the FULL sentence before judging the underlined words.`, kind: 'gotcha' },
    { content: `Watch the question stem. "Which choice is most concise?" or "...gives the clearest information without redundancy?" = brevity wins. But "Which choice best emphasizes..." or "...most specifically describes..." = the LONGER, detail-rich answer usually wins.`, kind: 'tip' },
    { content: `Shortest ≠ fewest words in the choice you're staring at. Count words in the FINAL sentence, not the answer block. A one-word choice that forces a comma splice or drops a needed subject loses to a three-word choice that reads cleanly.`, kind: 'common-error' },
    { content: `Not every repeated word is redundant. Deliberate parallel repetition ("she tested, she retested, she tested again") and repeated nouns needed for clarity are fine. Redundancy means the same IDEA twice, not the same sound twice.`, kind: 'edge-case' },
    { content: `When DELETE is offered, also delete the leftover punctuation in your head. If the choice removes an appositive, both commas go with it — don't reject DELETE because the sentence "sounds choppy" with a stray comma you mentally kept.`, kind: 'tip' },
    { content: `"Wordy" and "redundant" are different traps. "Due to the fact that" repeats nothing — it's just padding. Don't wait to spot a duplicate word before compressing; a bloated phrase with one idea is still the wrong answer.`, kind: 'vocab-note' },
    { content: `Transitions are not padding. "However," "as a result," and "for example" look cuttable but carry logical meaning. Before deleting one, check the relationship between the two sentences — if it's contrast or cause, the word must stay.`, kind: 'gotcha' },
    { content: `NO CHANGE is offered on nearly every conciseness item and is the answer more often than students expect — including when it's the LONGEST option. Never eliminate it just for length; make it lose on redundancy or padding you can actually name.`, kind: 'common-error' },
  ],
};
