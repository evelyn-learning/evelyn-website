/**
 * Grade 7 English Language Arts — Unit 6 CED 6.3: Fragments & Run-Ons.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.fragments-and-run-ons.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U6_FRAGMENTS_AND_RUN_ONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.fragments-and-run-ons.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 6,
  cedTopic: '6.3',
  cedTitle: 'Fragments & Run-Ons',
  planId: 'evelyn.ms.m7ela.fragments-and-run-ons.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.fragments-and-run-ons.v1' }],
  theory: [
    { loId: 'm7ela.fragments-and-run-ons', kind: 'framework', title: 'Every sentence needs three things', content: `EVERY SENTENCE NEEDS THREE THINGS — a subject (who or what it is about), a verb (what they do or are), and a finished thought. Run the test on any group of words and you will know immediately whether it is a sentence. "The dog barked" passes all three, and it is only three words long.` },
    { loId: 'm7ela.fragments-and-run-ons', content: `A FRAGMENT IS MISSING ONE OF THE THREE. The kind you will write most often has a subject and a verb but never finishes the thought, because a starter word is holding it open. Those starter words are because, although, when, since, if, while, after, unless and before. WRONG: "Because the bus was late." CORRECT: "Because the bus was late, we missed the first song." The starter word makes the clause dependent, so it has to lean on a complete sentence.` },
    { loId: 'm7ela.fragments-and-run-ons', content: `A RUN-ON JAMS TWO SENTENCES TOGETHER WITH NOTHING BETWEEN THEM. WRONG: "The bus was late we missed the first song." A COMMA SPLICE does the same thing with only a comma, which is not strong enough to hold two sentences apart. WRONG: "The bus was late, we missed the first song." Both are the same mistake about where one thought ends.` },
    { loId: 'm7ela.fragments-and-run-ons', content: `THERE ARE THREE LEGAL FIXES for a run-on or a splice, and all three are correct. Use a period: "The bus was late. We missed the first song." Use a semicolon: "The bus was late; we missed the first song." Use a comma PLUS a joining word from for, and, nor, but, or, yet, so: "The bus was late, so we missed the first song." Pick whichever fits the meaning best.` },
    { loId: 'm7ela.fragments-and-run-ons', content: `LENGTH IS NOT THE TEST. A very long sentence can be perfectly correct, and a three-word one can be a fragment. The only question is how many complete thoughts are inside and what is sitting between them. Never "fix" a sentence just because it looks long.` },
    { loId: 'm7ela.fragments-and-run-ons', content: `HOWEVER AND THEREFORE ARE NOT JOINING WORDS. They are transition words, and a comma in front of one does not repair a splice. WRONG: "The bus was late, however, we still got in." CORRECT: "The bus was late; however, we still got in." A semicolon does the holding; however only signals the turn.` },
    { loId: 'm7ela.fragments-and-run-ons', kind: 'definition', title: 'independent clause', content: `a group of words with a subject and a verb that finishes its thought and could stand alone as a sentence.` },
    { loId: 'm7ela.fragments-and-run-ons', kind: 'definition', title: 'dependent clause', content: `a clause held open by a starter word such as because or although, so it cannot stand alone.` },
    { loId: 'm7ela.fragments-and-run-ons', kind: 'definition', title: 'fragment', content: `a group of words punctuated as a sentence that is missing a subject, a verb or a finished thought.` },
    { loId: 'm7ela.fragments-and-run-ons', kind: 'definition', title: 'run-on', content: 'two independent clauses joined with no punctuation at all.' },
    { loId: 'm7ela.fragments-and-run-ons', kind: 'definition', title: 'comma splice', content: 'two independent clauses joined with only a comma.' },
  ],
  methods: [
    {
      title: 'Worked repair fragment',
      steps: [
        `Run the three-part test on the first group. Subject: the practice. Verb: ran. Finished thought? No. The word "Although" is holding it open, so you are still waiting for what happened despite the practice running long.`,
        `That makes group one a dependent clause, and a dependent clause punctuated as its own sentence is a fragment. WRONG: "Although the practice ran twenty minutes long."`,
        `Now test group two. Subject: Coach. Verb: let. Finished thought? Yes. So group two is already a complete sentence and needs no repair.`,
        `The fix is to stop separating them. A dependent clause that comes FIRST attaches to the sentence after it with a comma. CORRECT: "Although the practice ran twenty minutes long, Coach still let us shoot free throws."`,
        `A second correct fix is to flip the order, and then no comma is needed: "Coach still let us shoot free throws although the practice ran twenty minutes long."`,
        `One fix that does NOT work is a semicolon. WRONG: "Although the practice ran twenty minutes long; Coach still let us shoot free throws." A semicolon needs a complete sentence on its left, and there is not one there.`,
      ],
      example: { problem: `Fix this. "Although the practice ran twenty minutes long. Coach still let us shoot free throws."`, solution: `Although the practice ran twenty minutes long, Coach still let us shoot free throws. (Also correct: Coach still let us shoot free throws although the practice ran twenty minutes long.)` },
      relatedLoIds: ['m7ela.fragments-and-run-ons'],
    },
    {
      title: 'Worked repair splice',
      steps: [
        `Cover everything after the comma and read what is left: "My brother borrowed my headphones." Subject, verb, finished thought. That is a complete sentence.`,
        `Now cover everything before the comma: "he left them at his friend's house." Subject, verb, finished thought. Also a complete sentence.`,
        `Two complete sentences with only a comma between them is a comma splice. WRONG: "My brother borrowed my headphones, he left them at his friend's house."`,
        `Fix one, the period. Fully separate them: "My brother borrowed my headphones. He left them at his friend's house."`,
        `Fix two, the semicolon. Use it when the two thoughts belong tightly together: "My brother borrowed my headphones; he left them at his friend's house."`,
        `Fix three, the comma plus a joining word. This one is the best here, because it also says HOW the ideas connect: "My brother borrowed my headphones, and he left them at his friend's house." Even better for the meaning: "My brother borrowed my headphones, but he left them at his friend's house."`,
        `Deleting the comma is not a fourth fix. WRONG: "My brother borrowed my headphones he left them at his friend's house." That turns a comma splice into a run-on, which is the same error wearing less punctuation.`,
      ],
      example: { problem: `Fix this three different ways. "My brother borrowed my headphones, he left them at his friend's house."`, solution: `Any of these three: "My brother borrowed my headphones. He left them at his friend's house." / "My brother borrowed my headphones; he left them at his friend's house." / "My brother borrowed my headphones, but he left them at his friend's house."` },
      relatedLoIds: ['m7ela.fragments-and-run-ons'],
    },
  ],
  pointers: [
    { content: `Students often say "Yes, it is a run-on because it is too long." — Count the complete thoughts instead. This sentence has one subject (my whole family), one verb (drove), and one finished thought. Everything else is a list of what they brought. One complete thought is one sentence, however long it runs, so this sentence is correct exactly as written. A run-on needs TWO complete thoughts with nothing between them.`, kind: 'common-error' },
    { content: `Students often say "No, and short groups of words are always fine." — Length does not decide anything in either direction. "The dog barked." is three words and a perfectly good sentence. WRONG: "Because the dog barked." is four words and a fragment, because the starter word leaves the thought open. Run the three-part test every time: subject, verb, finished thought.`, kind: 'common-error' },
    { content: `Run the three-part test on anything you are unsure about: subject, verb, finished thought.`, kind: 'tip' },
    { content: `A starter word such as because, although, when or since holds a thought open. WRONG: "Because the bus was late." CORRECT: "Because the bus was late, we missed the first song."`, kind: 'tip' },
    { content: `Two complete sentences with nothing between them is a run-on; with only a comma between them it is a comma splice.`, kind: 'tip' },
    { content: `Three legal fixes, all correct: a period, a semicolon, or a comma plus for, and, nor, but, or, yet, so.`, kind: 'tip' },
    { content: `However and therefore are not joining words. A comma in front of one does not repair a splice; a semicolon does.`, kind: 'tip' },
    { content: 'Length proves nothing. Count the complete thoughts, not the words.', kind: 'tip' },
    { content: `Deleting the comma in a comma splice does NOT fix it. "I lost my key, I climbed the fence" becomes "I lost my key I climbed the fence" — you just traded a comma splice for a run-on. Add a period, a semicolon, or a comma + and/but/so instead.`, kind: 'common-error' },
    { content: `A semicolon needs a COMPLETE sentence on both sides. WRONG: "Although it rained; we played anyway." The left side starts with *although*, so it is not complete. Cover each side and read it alone before you drop in a semicolon.`, kind: 'gotcha' },
    { content: `*However* and *therefore* are transition words, not joining words. Only for, and, nor, but, or, yet, so work after a comma. WRONG: "We were late, however we still got in." CORRECT: "We were late; however, we still got in."`, kind: 'vocab-note' },
    { content: `Comma placement flips with clause order. Starter word FIRST = comma: "Since it rained, we stayed in." Starter word in the MIDDLE = no comma: "We stayed in since it rained." Don't sprinkle the comma in both spots.`, kind: 'edge-case' },
    { content: `Long does not mean run-on and short does not mean fragment. "The dog barked." is a fine three-word sentence; "Because the dog barked." is a four-word fragment. Count complete thoughts, never words.`, kind: 'common-error' },
    { content: `Know the three labels apart: a **fragment** is missing something (subject, verb, or a finished thought). A **run-on** is two whole sentences with nothing between them. A **comma splice** is two whole sentences with only a comma. Name it before you fix it.`, kind: 'vocab-note' },
    { content: `Test a boundary by covering one side and reading the other out loud, alone. If BOTH sides stand up by themselves, a comma alone is illegal. If one side flops, you have a fragment, not a splice.`, kind: 'tip' },
    { content: `All three fixes are correct — pick for meaning, not habit. Use a comma + joining word when you want to show HOW the ideas connect: "He borrowed my headphones, **but** he lost them" says more than a plain period does.`, kind: 'tip' },
  ],
};
