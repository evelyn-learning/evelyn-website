/**
 * Grade 6 English Language Arts — Unit 5 CED 5.2: Intensive Pronouns.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.intensive-pronouns.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U5_INTENSIVE_PRONOUNS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.intensive-pronouns.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 5,
  cedTopic: '5.2',
  cedTitle: 'Intensive Pronouns',
  planId: 'evelyn.ms.m6ela.intensive-pronouns.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.intensive-pronouns.v1' }],
  theory: [
    { loId: 'm6ela.intensive-pronouns', content: `THE EIGHT -SELF WORDS. Myself, yourself, himself, herself, itself, ourselves, yourselves and themselves can work as intensive pronouns, which means their only job is to add emphasis to a subject or object that is already named somewhere in the very same sentence.` },
    { loId: 'm6ela.intensive-pronouns', content: `THE DELETION TEST PROVES CORRECT USE. A true intensive pronoun can be deleted completely, and the sentence that is left over still says exactly the same thing, with the same subject or object, just without the extra push. "I painted the entire mural myself." Delete myself: "I painted the entire mural." Still a complete sentence, same subject, same meaning.` },
    { loId: 'm6ela.intensive-pronouns', content: `THE TRAP: THE SAME WORDS GET BORROWED TO FILL A SLOT ON THEIR OWN. Most often inside a compound, such as "Jordan and myself" or "to Priya and myself," one of these words is asked to be the whole subject or the whole object by itself, with no other "I" or "me" anywhere in the sentence for it to be emphasizing. WRONG: "Jordan and myself decorated the gym." CORRECT: "Jordan and I decorated the gym." The word myself in the wrong version has nothing to emphasize — it is standing in the subject slot instead of pointing back to it.` },
    { loId: 'm6ela.intensive-pronouns', content: `THE CHECK IS TWO QUESTIONS. First: is a subject or object pronoun already doing this job somewhere else in the sentence? If yes, the -self word is correctly emphasizing it. Second, if the answer to the first question is no: run the deletion test to confirm the sentence falls apart without the -self word, which proves it was never extra — it was filling the slot by itself.` },
    { loId: 'm6ela.intensive-pronouns', content: `REPAIR WITH THE DROP TEST FROM PRONOUN CASE. Once a -self word is caught filling a slot it does not belong in, swap it for the ordinary pronoun that job needs. Cover the other name and read the pronoun alone, exactly the way row 5.1 does. WRONG: "Myself decorated the gym" alone is not a sentence, so the subject needed is I. WRONG: "gave the trophy to myself" alone, with no other me anywhere in the sentence, is not repeating anyone, so the object needed is me.` },
    { loId: 'm6ela.intensive-pronouns', content: `MYSELF IS NOT A MORE FORMAL VERSION OF ME. Reaching for myself because me feels too casual is exactly the mistake this lesson exists to catch. An intensive pronoun is correct only when it is repeating a job that is already filled — never when it is asked to fill the job on its own.` },
    { loId: 'm6ela.intensive-pronouns', kind: 'definition', title: 'intensive pronoun', content: `myself, yourself, himself, herself, itself, ourselves, yourselves or themselves, used only to add emphasis to a subject or object already named in the same sentence.` },
    { loId: 'm6ela.intensive-pronouns', kind: 'definition', title: 'emphasis', content: `extra force or attention given to a word that is already there, without changing who is doing what.` },
    { loId: 'm6ela.intensive-pronouns', kind: 'definition', title: 'compound subject', content: `two or more subjects joined by and or or, sharing one verb, such as "Jordan and I."` },
    { loId: 'm6ela.intensive-pronouns', kind: 'definition', title: 'compound object', content: `two or more objects joined by and or or, following the same verb or preposition, such as "to Priya and me."` },
    { loId: 'm6ela.intensive-pronouns', kind: 'definition', title: 'deletion test', content: `removing a word completely and checking whether the sentence left behind still says the same thing with the same subject or object.` },
  ],
  methods: [
    {
      title: 'Worked emphasis and the deletion test',
      steps: [
        `Find the -self word, and look for a matching subject or object elsewhere in the same sentence that is already doing that job. Sentence 1 has "I" as the subject. Sentence 2 has "the principal" as the subject.`,
        `Run the deletion test on sentence 1: take "myself" out completely and read what is left. "I painted the entire mural." That is a complete sentence, with the exact same subject and the exact same meaning, just without the extra push.`,
        `Run the deletion test on sentence 2: take "herself" out completely. "The principal announced the winners at the assembly." Also complete, same subject, same meaning.`,
        `Because both sentences survive the deletion test with their meaning intact, myself and herself are doing their real job here: repeating a subject that is already named, purely to add emphasis. Both are correct as written.`,
        `Name the rule in one sentence: an intensive pronoun always has a subject or object already present in its own sentence to point back to, and removing the intensive pronoun never breaks the sentence.`,
      ],
      example: { problem: `Decide whether "myself" and "herself" are used correctly below, and prove it with one test.

Sentence 1: "I painted the entire mural myself."
Sentence 2: "The principal herself announced the winners at the assembly."`, solution: `Both sentences are correct. Deleting "myself" leaves "I painted the entire mural," and deleting "herself" leaves "The principal announced the winners at the assembly" — both stay complete sentences with the same subject and the same meaning, just without the emphasis.` },
      relatedLoIds: ['m6ela.intensive-pronouns'],
    },
    {
      title: 'Worked repairing the borrowed self word',
      steps: [
        `Sentence 1. Look for another "I" anywhere else in the sentence for "myself" to be emphasizing. There is not one — "Jordan and myself" is the entire subject, with nothing else there for myself to repeat.`,
        `Run the deletion test to confirm. WRONG: delete "myself": "Jordan and decorated the gym for the dance." That is not a sentence. The deletion breaks it, which proves myself was never adding emphasis to an already-present subject — it was standing in the subject slot by itself.`,
        `A subject slot needs a subject-case pronoun, so use the drop test from pronoun case: cover "Jordan and" and read the pronoun alone. WRONG: "Myself decorated the gym." CORRECT: "I decorated the gym."`,
        'CORRECT: "Jordan and I decorated the gym for the dance."',
        `Sentence 2. Same check: is there an "I" or "me" anywhere else in the sentence? No — "Priya and myself" is the entire object of "to," with nothing else there for myself to repeat.`,
        `This is an object slot, right after the preposition "to," so it needs object case. Cover "Priya and" and read the pronoun alone. WRONG: "handed the trophy to myself," with no other me anywhere in the sentence, is not repeating anyone — it needs the plain object pronoun. CORRECT: "handed the trophy to me."`,
        'CORRECT: "The teacher handed the trophy to Priya and me."',
      ],
      example: { problem: `Two sentences from a class newsletter draft use "myself" the wrong way. Repair each one, and say what test caught it.

Sentence 1: "Jordan and myself decorated the gym for the dance."
Sentence 2: "The teacher handed the trophy to Priya and myself."`, solution: `Sentence 1: "Jordan and I decorated the gym for the dance." Sentence 2: "The teacher handed the trophy to Priya and me." In both, there was no other "I" or "me" in the sentence for "myself" to emphasize, so the -self word was filling a subject or object slot on its own — a job that belongs to a subject or object pronoun.` },
      relatedLoIds: ['m6ela.intensive-pronouns'],
    },
  ],
  pointers: [
    { content: `Students often say "The teacher gave the permission slips to Malik and myself." — Myself has no job to do here unless another "I" or "me" is already in the sentence for it to repeat, and there is not one — "Malik and myself" is the entire object of "to." The word after a preposition needs object case, so cover "Malik and" and read the rest alone: "gave the permission slips to myself" is not what the sentence needs. The correct sentence is "The teacher gave the permission slips to Malik and me." Myself is not a more polite version of me; it is only correct when it is emphasizing a subject or object pronoun that is already sitting somewhere else in the same sentence.`, kind: 'common-error' },
    { content: `Students often say "Deleting a -self word should always be allowed, because it always just adds extra emphasis." — Run the deletion test to tell the difference, not to fix the sentence by itself. Delete the -self word: if what remains is still a complete sentence with the same subject or object, the word was truly intensive and the sentence was already correct. If what remains falls apart, as in "Malik and gave the permission slips," the -self word was never extra — it was standing in for a subject or object pronoun, and it needs to be replaced with the correct one, such as I, me, he, him, she, her, we, us, they or them, not simply removed.`, kind: 'common-error' },
    { content: `Intensive pronouns are myself, yourself, himself, herself, itself, ourselves, yourselves and themselves, used only to add emphasis to a subject or object that is already in the sentence.`, kind: 'tip' },
    { content: `An intensive pronoun always has another pronoun or noun elsewhere in its own sentence already doing the subject or object job — that is the word it is emphasizing.`, kind: 'tip' },
    { content: `The deletion test tells correct from incorrect: delete the -self word and read what is left. If a complete sentence remains with the same subject or object, the word was truly intensive.`, kind: 'tip' },
    { content: `If deleting the -self word breaks the sentence, it was never adding emphasis — it was filling a subject or object slot by itself, most often inside a compound such as "Jordan and myself" or "to Priya and myself."`, kind: 'tip' },
    { content: `Repair a misused -self word with the drop test from pronoun case: cover the other name, read the pronoun alone, and swap in the correct subject or object pronoun (I, me, he, him, she, her, we, us, they, them).`, kind: 'tip' },
    { content: `Myself is not a more formal or polite version of me — reaching for it to avoid sounding casual is exactly the mistake this lesson fixes.`, kind: 'tip' },
    { content: `Don't confuse 'myself' with a fancier version of 'me.' Myself is only correct when another 'I' or 'me' already exists in the sentence for it to emphasize. If you're choosing 'myself' to sound more formal, that's the trap.`, kind: 'common-error' },
    { content: `Run the deletion test first: remove the -self word and read what's left. If the sentence still makes sense with the same subject or object, the -self word is correct. If the sentence breaks (like 'Jordan and decorated'), the -self word is filling a slot it shouldn't be.`, kind: 'tip' },
    { content: `Inside a compound (like 'Jordan and myself' or 'to Priya and myself'), an -self word can't do its job because there's no other 'I' or 'me' anywhere else in the sentence for it to emphasize. Cover the other name and ask: would I say 'myself' alone here? If no, it's wrong.`, kind: 'gotcha' },
    { content: `Intensive pronouns only add emphasis—they never change who is doing what or who receives the action. If deleting the word changes the meaning or who the subject/object is, it's not being intensive.`, kind: 'vocab-note' },
    { content: `After you catch a misused -self word, fix it by covering the other name and using the drop test from pronoun case. Read the pronoun alone: if it's in subject position, use I/we/he/she/they; if it's in object position, use me/us/him/her/them. Never just delete the -self word.`, kind: 'tip' },
    { content: `Don't mix up the author/narrator with the characters. Only the actual subject or object in the sentence can be emphasized—not the reader, not the writer, not someone outside the sentence.`, kind: 'edge-case' },
    { content: `The eight -self words (myself, yourself, himself, herself, itself, ourselves, yourselves, themselves) are the only ones that can be intensive. No others. If you see a different word trying to do this job, it's wrong.`, kind: 'vocab-note' },
  ],
};
