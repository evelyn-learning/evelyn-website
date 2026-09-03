/**
 * Grade 6 English Language Arts — Unit 6 CED 6.1: Sentence Fragments & Run-Ons.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.sentence-fragments-and-run-ons.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U6_SENTENCE_FRAGMENTS_AND_RUN_ONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.sentence-fragments-and-run-ons.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 6,
  cedTopic: '6.1',
  cedTitle: 'Sentence Fragments & Run-Ons',
  planId: 'evelyn.ms.m6ela.sentence-fragments-and-run-ons.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.sentence-fragments-and-run-ons.v1' }],
  theory: [
    { loId: 'm6ela.sentence-fragments-and-run-ons', kind: 'framework', title: 'Every complete sentence needs three things', content: `EVERY COMPLETE SENTENCE NEEDS THREE THINGS — a subject (who or what it is about), a verb (what they do or are), and a finished thought. Run the test on any group of words and you find out fast whether it stands on its own. "The bell rang" passes all three, and it is only three words long.` },
    { loId: 'm6ela.sentence-fragments-and-run-ons', content: `A FRAGMENT IS MISSING ONE OF THE THREE. The kind you will meet most often has a subject and a verb but never finishes the thought, because a starter word is holding it open — words like because, although, when, since, if, while, after, before and unless. WRONG: "Because the printer jammed again." CORRECT: "Because the printer jammed again, the flyers came out late."` },
    { loId: 'm6ela.sentence-fragments-and-run-ons', content: `A RUN-ON JAMS TWO COMPLETE SENTENCES TOGETHER WITH NOTHING BETWEEN THEM. WRONG: "The printer jammed again the flyers came out late." A COMMA SPLICE does the same thing with only a comma, which is not strong enough to hold two complete sentences apart. WRONG: "The printer jammed again, the flyers came out late."` },
    { loId: 'm6ela.sentence-fragments-and-run-ons', content: `THERE ARE LEGAL FIXES FOR A RUN-ON OR A SPLICE. Use a period: "The printer jammed again. The flyers came out late." Use a comma plus a joining word from for, and, nor, but, or, yet, so, choosing the word that matches the meaning: "The printer jammed again, so the flyers came out late." A semicolon also works, for two sentences that belong tightly together: "The printer jammed again; the flyers came out late."` },
    { loId: 'm6ela.sentence-fragments-and-run-ons', content: `A STARTER WORD NEEDS A COMPLETE SENTENCE ATTACHED, EITHER ORDER. Put a comma after the starter-word group only when it comes first: "Because the printer jammed, we were late." Flip the order and skip the comma: "We were late because the printer jammed."` },
    { loId: 'm6ela.sentence-fragments-and-run-ons', content: `LENGTH IS NOT THE TEST. A very long sentence can be perfectly correct, and a three-word one can be a fragment. Count the complete thoughts and check what is sitting between them — never fix a sentence just because it looks long.` },
    { loId: 'm6ela.sentence-fragments-and-run-ons', kind: 'definition', title: 'fragment', content: `a group of words punctuated as a sentence that is missing a subject, a verb or a finished thought.` },
    { loId: 'm6ela.sentence-fragments-and-run-ons', kind: 'definition', title: 'run-on', content: 'two complete sentences joined with no punctuation at all.' },
    { loId: 'm6ela.sentence-fragments-and-run-ons', kind: 'definition', title: 'comma splice', content: 'two complete sentences joined with only a comma.' },
    { loId: 'm6ela.sentence-fragments-and-run-ons', kind: 'definition', title: 'starter word', content: `a word such as because, although, when or since that leaves the group of words after it unfinished until it is attached to a complete sentence.` },
    { loId: 'm6ela.sentence-fragments-and-run-ons', kind: 'definition', title: 'joining word', content: `a short word — for, and, nor, but, or, yet, so — that can follow a comma to connect two complete sentences.` },
  ],
  methods: [
    {
      title: 'Worked repair fragment',
      steps: [
        `Run the three-part test on the first group of words: subject, verb, finished thought. Subject: the science fair. Verb: got moved. Finished thought? No — the word "Although" leaves you waiting to hear what happened despite the move.`,
        `A group of words that starts with a word like although, because, when, since, if, while, after, before or unless is never a finished thought by itself. Punctuated as its own sentence, it is a fragment. WRONG: "Although the science fair got moved to the gym."`,
        `Test the second group. Subject: everyone. Verb: found. Finished thought? Yes — that one is already a complete sentence and needs no repair.`,
        `The fix is to stop separating them. A starter-word group that comes first attaches to the sentence after it with a comma. CORRECT: "Although the science fair got moved to the gym, everyone still found their tables okay."`,
        `A second correct fix is to flip the order, and then no comma is needed: "Everyone still found their tables okay although the science fair got moved to the gym."`,
        `One fix that does NOT work is a period between them, because that just moves where the fragment sits. WRONG: "Although the science fair got moved to the gym. Everyone still found their tables okay." A starter word makes a promise the sentence has to keep, no matter which side it starts on.`,
      ],
      example: { problem: `Fix this. "Although the science fair got moved to the gym. Everyone still found their tables okay."`, solution: `Although the science fair got moved to the gym, everyone still found their tables okay. (Also correct: Everyone still found their tables okay although the science fair got moved to the gym.)` },
      relatedLoIds: ['m6ela.sentence-fragments-and-run-ons'],
    },
    {
      title: 'Worked repair splice',
      steps: [
        `Cover everything after the comma and read what is left: "The vending machine ate my dollar." Subject, verb, finished thought. That is a complete sentence.`,
        `Now cover everything before the comma: "I never got my snack." Subject, verb, finished thought. Also a complete sentence.`,
        `Two complete sentences with only a comma between them is a comma splice. WRONG: "The vending machine ate my dollar, I never got my snack."`,
        `Fix one, the period. Fully separate them: "The vending machine ate my dollar. I never got my snack."`,
        `Fix two, the semicolon, for two sentences that belong tightly together: "The vending machine ate my dollar; I never got my snack."`,
        `Fix three, the comma plus a joining word, which also says how the two ideas connect: "The vending machine ate my dollar, and I never got my snack." Even better for the meaning: "The vending machine ate my dollar, so I never got my snack."`,
        `Deleting the comma is not a fourth fix. WRONG: "The vending machine ate my dollar I never got my snack." That turns a comma splice into a run-on, which is the same mistake wearing less punctuation.`,
      ],
      example: { problem: `Fix this three different ways. "The vending machine ate my dollar, I never got my snack."`, solution: `Any of these three: "The vending machine ate my dollar. I never got my snack." / "The vending machine ate my dollar; I never got my snack." / "The vending machine ate my dollar, so I never got my snack."` },
      relatedLoIds: ['m6ela.sentence-fragments-and-run-ons'],
    },
  ],
  pointers: [
    { content: `Students often say "Yes, because there is already a comma before however, so the sentence is fixed." — Test both sides of "however": "The gym floor was still wet" and "we practiced free throws in the hallway instead" are both complete sentences, so a comma splice sits on each side of it. The fix is a period or a semicolon right before however, not a comma. CORRECT: "The gym floor was still wet. However, we practiced free throws in the hallway instead." However tells the reader a turn is coming; it does not do the job of holding two sentences together.`, kind: 'common-error' },
    { content: `Students often say "No, and the whole sentence should be rewritten without however." — However is not the problem — the punctuation in front of it is. Keep the word and fix the boundary: a period or a semicolon comes right before however, and a comma comes right after it. CORRECT: "The gym floor was still wet. However, we practiced free throws in the hallway instead." The word survives; only the punctuation around it needs to change.`, kind: 'common-error' },
    { content: `Every complete sentence needs a subject, a verb and a finished thought — run that test on anything you are unsure about.`, kind: 'tip' },
    { content: `A starter word such as because, although, when or since leaves a thought unfinished until it is attached to a complete sentence. WRONG: "Because the printer jammed again." CORRECT: "Because the printer jammed again, the flyers came out late."`, kind: 'tip' },
    { content: `Two complete sentences with nothing between them is a run-on; with only a comma between them it is a comma splice.`, kind: 'tip' },
    { content: `Legal fixes: a period, a semicolon between two closely related sentences, or a comma plus a joining word that matches the meaning — for, and, nor, but, or, yet, so.`, kind: 'tip' },
    { content: `A transition word such as however is not a joining word. It needs a period or a semicolon in front of it, not just a comma.`, kind: 'tip' },
    { content: 'Length proves nothing. Count the complete thoughts, not the words.', kind: 'tip' },
  ],
};
