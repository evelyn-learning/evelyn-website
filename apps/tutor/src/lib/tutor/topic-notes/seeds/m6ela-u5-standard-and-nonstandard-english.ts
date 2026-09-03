/**
 * Grade 6 English Language Arts — Unit 5 CED 5.4: Standard & Nonstandard English.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.standard-and-nonstandard-english.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U5_STANDARD_AND_NONSTANDARD_ENGLISH: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.standard-and-nonstandard-english.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 5,
  cedTopic: '5.4',
  cedTitle: 'Standard & Nonstandard English',
  planId: 'evelyn.ms.m6ela.standard-and-nonstandard-english.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.standard-and-nonstandard-english.v1' }],
  theory: [
    { loId: 'm6ela.standard-and-nonstandard-english', content: `STANDARD ENGLISH IS ONE REGISTER AMONG MANY, NOT THE ONLY CORRECT WAY TO TALK. Many people speak a dialect or a home variety of English — a regional way of talking, or the English spoken in a particular community — that follows its own real, regular rules and is not a sign of not knowing English well. A double negative, "ain't," or "we was" can be completely normal and correctly formed inside the variety a speaker grew up with. In this lesson, WRONG means one specific thing: not the form formal school writing expects, never a judgment about the speaker.` },
    { loId: 'm6ela.standard-and-nonstandard-english', content: `STANDARD ENGLISH KEEPS ONLY ONE NEGATIVE WORD PER CLAUSE. WRONG: "I do not have no pencil." CORRECT: "I do not have any pencil." Two negative words in the same clause — "not" and "no," or "don't" and "nothing" — get revised down to a single negative, and the second one usually turns into a positive word such as "any" or "anything" instead of disappearing.` },
    { loId: 'm6ela.standard-and-nonstandard-english', content: `THE WORD "AIN'T" STANDS FOR SEVERAL DIFFERENT STANDARD VERB FORMS, DEPENDING ON THE SENTENCE. It can mean am not, is not, are not, has not, or have not. Revising it means naming the exact standard form the sentence needs, not swapping in the same replacement every time. WRONG: "She ain't ready yet." CORRECT: "She is not ready yet." WRONG: "They ain't seen the letter." CORRECT: "They have not seen the letter."` },
    { loId: 'm6ela.standard-and-nonstandard-english', content: `STANDARD ENGLISH PAIRS EACH SUBJECT WITH ITS OWN VERB FORM, AND SOME DIALECTS PAIR THEM DIFFERENTLY — "we was," "they is," "she don't." Standard English matches: I was / we were, he is / they are, she does not / they do not. WRONG: "We was the last team to finish." CORRECT: "We were the last team to finish." WRONG: "He don't like waiting." CORRECT: "He does not like waiting."` },
    { loId: 'm6ela.standard-and-nonstandard-english', content: `REVISE IN THREE MOVES: name the nonstandard form (a double negative, "ain't," or a subject-verb mismatch), swap in the exact standard form the sentence needs, then reread the whole sentence to check the meaning has not changed.` },
    { loId: 'm6ela.standard-and-nonstandard-english', kind: 'framework', title: 'This swap belongs to formal writing for school', content: `THIS SWAP BELONGS TO FORMAL WRITING FOR SCHOOL — A REPORT, A LETTER TO AN OFFICE, A CLASS NEWSLETTER — NOT TO EVERY SENTENCE A PERSON SAYS OR WRITES. A text to a friend, a line of dialogue in a story, or a conversation at home does not need the swap. The skill this lesson teaches is choosing the form the setting calls for, not deciding which form of English is better.` },
    { loId: 'm6ela.standard-and-nonstandard-english', kind: 'definition', title: 'standard English', content: `the shared form of English taught in school and expected in formal writing, such as a report, a letter, or an essay.` },
    { loId: 'm6ela.standard-and-nonstandard-english', kind: 'definition', title: 'nonstandard form', content: `a word or grammar pattern that differs from standard English, often because it comes from a dialect or home variety with its own regular rules.` },
    { loId: 'm6ela.standard-and-nonstandard-english', kind: 'definition', title: 'double negative', content: `two negative words inside one clause, where standard English allows only one negative.` },
    { loId: 'm6ela.standard-and-nonstandard-english', kind: 'definition', title: 'dialect', content: `a variety of a language, with its own regular grammar and vocabulary, spoken by people from one region or community.` },
    { loId: 'm6ela.standard-and-nonstandard-english', kind: 'definition', title: 'revise', content: `to change a sentence so it fits the form a piece of writing calls for, without changing what the sentence means.` },
  ],
  methods: [
    {
      title: 'Worked double negative and aint',
      steps: [
        `Look at sentence 1 and find its subject-verb pairing first. "Don't" is paired with "the late bus," a singular subject, and Standard English pairs a singular subject with "does not," not "don't." WRONG: "The late bus don't stop..." CORRECT: "The late bus does not stop..."`,
        `Sentence 1 also hides a double negative once you look past that first error: "don't" is already negative, and "no more" adds a second negative word to the same clause. Standard English keeps only one negative per clause, so "no more" becomes "anymore," a form with no negative in it at all. WRONG: "...don't stop at my corner no more." CORRECT: "...does not stop at my corner anymore."`,
        `Put the two fixes together and reread the whole sentence to check the meaning did not change: "The late bus does not stop at my corner anymore." That is exactly what the nonstandard version meant — nothing about the sentence's meaning shifted, only its form.`,
        `Sentence 2: find the word doing the most work, "ain't," and ask what standard verb it is standing in for here. The subject is "my uncle," singular, and the sentence needs the helper that pairs with "been" — that is "has not," not "is not" or "are not."`,
        `WRONG: "My uncle ain't been to that game since March." CORRECT: "My uncle has not been to that game since March."`,
        `Reread both fixed sentences together to confirm neither one changed what actually happened, only how it is said: the bus still does not stop at that corner, and the uncle still has not been to the game.`,
      ],
      example: { problem: `Revise these two sentences from a rough draft of a class report so every verb matches Standard English.

Sentence 1: "The late bus don't stop at my corner no more."
Sentence 2: "My uncle ain't been to that game since March."`, solution: `Sentence 1: "The late bus does not stop at my corner anymore." Sentence 2: "My uncle has not been to that game since March."` },
      relatedLoIds: ['m6ela.standard-and-nonstandard-english'],
    },
    {
      title: 'Worked subject verb and double negative',
      steps: [
        `Split the sentence into its two halves and fix one nonstandard form at a time. First half: "we was" pairs the plural subject "we" with "was." Standard English pairs "we" with "were." WRONG: "We was so proud backstage." CORRECT: "We were so proud backstage."`,
        `Second half: find the two negative words. "Nobody" is already a negative word — it means "not one person" — and "didn't" adds a second negative to the same clause. Standard English keeps only one negative per clause, so the sentence needs "didn't" to become a plain positive verb.`,
        `WRONG: "...nobody didn't clap harder than my little sister." CORRECT: "...nobody clapped harder than my little sister."`,
        `Put the two repaired halves back together and reread the whole sentence: "We were so proud backstage, and nobody clapped harder than my little sister." Check the meaning: the sentence still says the group was proud, and the little sister clapped harder than everyone else.`,
        `Notice that the fix never added an idea and never removed one. It only changed the form of two verbs so the sentence was ready for a printed program.`,
      ],
      example: { problem: `Revise this caption before it goes into the school's printed program for the play.

"We was so proud backstage, and nobody didn't clap harder than my little sister."`, solution: 'We were so proud backstage, and nobody clapped harder than my little sister.' },
      relatedLoIds: ['m6ela.standard-and-nonstandard-english'],
    },
  ],
  pointers: [
    { content: `Students often say "People who say "I don't have no money" are not being careful with English." — A double negative is nonstandard for one specific setting — formal written English — not proof of an error in thinking. The correction this lesson teaches is about matching the form a piece of writing calls for, the same way a student changes into different clothes for gym class without that meaning the regular clothes were wrong. Standard English and a spoken dialect are simply two different sets of rules, each consistent on its own terms.`, kind: 'common-error' },
    { content: `Students often say "The fix is just deleting the second negative word every time." — Name the exact standard form the sentence needs — a positive word such as "any" where "no" was doing double duty, or the specific helping verb "ain't" was standing in for — rather than deleting a word and hoping the sentence still works. Reread the finished sentence afterward to check the meaning has not changed before deciding the revision is done.`, kind: 'common-error' },
    { content: `Standard English is the form school, business, and formal writing agree to use; a dialect or home variety follows its own real, regular rules and is not a mistake.`, kind: 'tip' },
    { content: `Standard English keeps one negative word per clause. WRONG: "I do not have no pencil." CORRECT: "I do not have any pencil."`, kind: 'tip' },
    { content: `"Ain't" stands for several different standard verb forms — am not, is not, are not, has not, have not — so name the exact one the sentence needs. WRONG: "She ain't ready." CORRECT: "She is not ready."`, kind: 'tip' },
    { content: `Standard English pairs a plural subject with "were," not "was," and pairs "does not" or "do not" with the subject Standard English expects, not "don't" on its own. WRONG: "We was the last team." CORRECT: "We were the last team."`, kind: 'tip' },
    { content: `Revise in three moves: name the nonstandard form, swap in the exact standard form the sentence needs, then reread the whole sentence to check the meaning has not changed.`, kind: 'tip' },
    { content: `The swap belongs to formal writing — a report, a letter to an office, a class newsletter — not to every sentence a person says or writes.`, kind: 'tip' },
  ],
};
