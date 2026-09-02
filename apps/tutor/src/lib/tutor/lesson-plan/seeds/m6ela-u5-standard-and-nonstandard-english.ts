/**
 * Grade 6 ELA — Grammar: Pronoun Precision & Standard English: Standard &
 * Nonstandard English.
 *
 * PROCEDURE-LED, following `m6ela-u5-pronoun-case.ts`'s shape. There is one
 * repeatable move and the whole lesson makes it fluent: spot a nonstandard
 * grammatical form in an isolated sentence — a double negative, "ain't," or a
 * nonstandard subject-verb pairing such as "we was" — name which of those
 * three it is, and swap in the exact standard form the sentence needs (CCSS
 * L.6.1e). Three traps this plan is built to kill: treating a double negative
 * as two separate problems instead of one negative-count problem, swapping
 * "ain't" for the same replacement every time instead of the specific verb
 * form the sentence needs, and deleting a nonstandard word without checking
 * whether the sentence still says what it meant.
 *
 * A NOTE ON FRAMING, BEFORE ANYTHING ELSE: this lesson does not teach that
 * nonstandard forms are careless or that the people who use them know less
 * English than people who do not. A double negative, "ain't," and "we was"
 * are regular, rule-governed features of real dialects that real students and
 * their families speak — fully grammatical in the varieties they belong to.
 * The lesson teaches a register switch: formal writing for school calls for
 * Standard English, the way a report card or a business letter calls for a
 * certain outfit, and the skill is making that switch on purpose, not judging
 * either form as better English. The hook, the concept segment, and the
 * misconception check all say this explicitly, because the standard itself
 * (L.6.1e, "recognize variations from Standard English") asks for exactly
 * this framing and not for correction of a student's home language.
 *
 * SCOPE GUARD: Grade 6 row 5.4 recognizes a nonstandard grammatical form in
 * an ISOLATED sentence — a double negative, "ain't," or a nonstandard
 * subject-verb pairing such as "we was" — and revises it to Standard English
 * for formal writing. DELIBERATELY EXCLUDED: pronoun case (row 5.1),
 * intensive pronouns (row 5.2), and a shift in pronoun number or person
 * across a whole passage (row 5.3) — this row never touches pronoun case,
 * never introduces myself/ourselves, and every sentence it revises stays a
 * single isolated sentence, never a passage-length consistency check. Also
 * excluded: sentence fragments and run-ons (row 6.1) and whole-passage style
 * or tone consistency (row 6.4) — nothing in this file diagnoses an
 * incomplete sentence or a run-on, and nothing here checks a passage for
 * consistent formality across paragraphs. Also excluded, and never
 * reintroduced in any form: pronoun-antecedent number agreement and repair of
 * a vague or ambiguous pronoun reference (L.6.1d), which the shipped
 * `m7ela-u5-pronouns-and-antecedents.ts` already teaches end to end. DELIBERATELY
 * ALLOWED, because it is unavoidable: every specimen sentence in this file
 * that displays a double negative, "ain't," or a nonstandard subject-verb
 * pairing prints that nonstandard form in full, inside quotation marks — a
 * lesson that must teach a student to recognize and revise those forms cannot
 * avoid printing them. Where a specimen is shown as something to correct
 * (in a worked example's steps, or in this doc comment), it sits beside its
 * standard revision inside a WRONG:/CORRECT: pair. Where a specimen sits
 * unlabeled inside an MCQ choice the student is asked to reject, that is
 * exactly what the item is for, and the hints and misconception check name it
 * explicitly instead.
 *
 * NOTE FOR FUTURE AUTHORS: every sentence in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * words printed inside it. Every quotation mark in this file marks either a
 * nonstandard form cited as the specimen under study, or reported speech
 * inside an example; both are the two categories this course's contraction
 * ban exempts, and the tutor's own explaining voice outside those quotation
 * marks never contracts a word.
 *
 * CLAIM LEDGER: none required. Every excerpt in this file is an invented
 * illustrative sentence written to display a grammatical form, not a claim
 * about the real world — there is nothing here for a reader to look up, so
 * there is no factual claim to verify.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U5_STANDARD_AND_NONSTANDARD_ENGLISH: LessonPlan = {
  id: 'evelyn.ms.m6ela.standard-and-nonstandard-english.v1',
  title: 'Standard & Nonstandard English',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.standard-and-nonstandard-english',
      standard: 'M6ELA-5.4',
      description:
        'Recognize a nonstandard grammatical form in an isolated sentence (e.g., a double negative, "ain\'t," "we was") and revise it to standard English appropriate for formal writing (CCSS L.6.1e).',
    },
  ],
  prerequisites: ['m6ela.keeping-pronoun-number-and-person-consistent'],
  followUps: ['m6ela.sentence-fragments-and-run-ons'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the lesson as a register switch a student already makes, not a correction of how anyone talks at home.',
      script:
        'You send a friend a message that says, "I ain\'t going to Mateo\'s party, and I don\'t got a ride anyway." Your friend reads it in one second and knows exactly what you mean. Nobody in that chat is confused, and nobody thinks less of you for it — that message uses forms plenty of people use every day, and it works perfectly for a text between friends. Now picture writing that exact wording in a note asking the school office to excuse you from a field trip. The meaning would still be clear, but the office is not just reading for meaning anymore — it is reading for which set of rules you used. Standard English is that other set of rules: the version every school report, business letter, and formal newsletter agrees to use, no matter what language a writer speaks at home or with friends. Today is not about fixing broken English. It is about learning to hear when you have switched into Standard English and when you have not, so you can choose it on purpose for the writing that calls for it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-standard-and-nonstandard-forms',
      kind: 'concept',
      goal: 'Install the register-choice framing, the double-negative rule, the "ain\'t" rule, the subject-verb rule, and the three-move revision procedure.',
      keyIdeas: [
        'STANDARD ENGLISH IS ONE REGISTER AMONG MANY, NOT THE ONLY CORRECT WAY TO TALK. Many people speak a dialect or a home variety of English — a regional way of talking, or the English spoken in a particular community — that follows its own real, regular rules and is not a sign of not knowing English well. A double negative, "ain\'t," or "we was" can be completely normal and correctly formed inside the variety a speaker grew up with. In this lesson, WRONG means one specific thing: not the form formal school writing expects, never a judgment about the speaker.',
        'STANDARD ENGLISH KEEPS ONLY ONE NEGATIVE WORD PER CLAUSE. WRONG: "I do not have no pencil." CORRECT: "I do not have any pencil." Two negative words in the same clause — "not" and "no," or "don\'t" and "nothing" — get revised down to a single negative, and the second one usually turns into a positive word such as "any" or "anything" instead of disappearing.',
        'THE WORD "AIN\'T" STANDS FOR SEVERAL DIFFERENT STANDARD VERB FORMS, DEPENDING ON THE SENTENCE. It can mean am not, is not, are not, has not, or have not. Revising it means naming the exact standard form the sentence needs, not swapping in the same replacement every time. WRONG: "She ain\'t ready yet." CORRECT: "She is not ready yet." WRONG: "They ain\'t seen the letter." CORRECT: "They have not seen the letter."',
        'STANDARD ENGLISH PAIRS EACH SUBJECT WITH ITS OWN VERB FORM, AND SOME DIALECTS PAIR THEM DIFFERENTLY — "we was," "they is," "she don\'t." Standard English matches: I was / we were, he is / they are, she does not / they do not. WRONG: "We was the last team to finish." CORRECT: "We were the last team to finish." WRONG: "He don\'t like waiting." CORRECT: "He does not like waiting."',
        'REVISE IN THREE MOVES: name the nonstandard form (a double negative, "ain\'t," or a subject-verb mismatch), swap in the exact standard form the sentence needs, then reread the whole sentence to check the meaning has not changed.',
        'THIS SWAP BELONGS TO FORMAL WRITING FOR SCHOOL — A REPORT, A LETTER TO AN OFFICE, A CLASS NEWSLETTER — NOT TO EVERY SENTENCE A PERSON SAYS OR WRITES. A text to a friend, a line of dialogue in a story, or a conversation at home does not need the swap. The skill this lesson teaches is choosing the form the setting calls for, not deciding which form of English is better.',
      ],
      vocabulary: [
        { term: 'standard English', definition: 'the shared form of English taught in school and expected in formal writing, such as a report, a letter, or an essay.' },
        { term: 'nonstandard form', definition: 'a word or grammar pattern that differs from standard English, often because it comes from a dialect or home variety with its own regular rules.' },
        { term: 'double negative', definition: 'two negative words inside one clause, where standard English allows only one negative.' },
        { term: 'dialect', definition: 'a variety of a language, with its own regular grammar and vocabulary, spoken by people from one region or community.' },
        { term: 'revise', definition: 'to change a sentence so it fits the form a piece of writing calls for, without changing what the sentence means.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-double-negative-and-aint',
      kind: 'worked_example',
      problem:
        'Revise these two sentences from a rough draft of a class report so every verb matches Standard English.\n\nSentence 1: "The late bus don\'t stop at my corner no more."\nSentence 2: "My uncle ain\'t been to that game since March."',
      steps: [
        'Look at sentence 1 and find its subject-verb pairing first. "Don\'t" is paired with "the late bus," a singular subject, and Standard English pairs a singular subject with "does not," not "don\'t." WRONG: "The late bus don\'t stop..." CORRECT: "The late bus does not stop..."',
        'Sentence 1 also hides a double negative once you look past that first error: "don\'t" is already negative, and "no more" adds a second negative word to the same clause. Standard English keeps only one negative per clause, so "no more" becomes "anymore," a form with no negative in it at all. WRONG: "...don\'t stop at my corner no more." CORRECT: "...does not stop at my corner anymore."',
        'Put the two fixes together and reread the whole sentence to check the meaning did not change: "The late bus does not stop at my corner anymore." That is exactly what the nonstandard version meant — nothing about the sentence\'s meaning shifted, only its form.',
        'Sentence 2: find the word doing the most work, "ain\'t," and ask what standard verb it is standing in for here. The subject is "my uncle," singular, and the sentence needs the helper that pairs with "been" — that is "has not," not "is not" or "are not."',
        'WRONG: "My uncle ain\'t been to that game since March." CORRECT: "My uncle has not been to that game since March."',
        'Reread both fixed sentences together to confirm neither one changed what actually happened, only how it is said: the bus still does not stop at that corner, and the uncle still has not been to the game.',
      ],
      answer:
        'Sentence 1: "The late bus does not stop at my corner anymore." Sentence 2: "My uncle has not been to that game since March."',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-subject-verb-and-double-negative',
      kind: 'worked_example',
      problem:
        'Revise this caption before it goes into the school\'s printed program for the play.\n\n"We was so proud backstage, and nobody didn\'t clap harder than my little sister."',
      steps: [
        'Split the sentence into its two halves and fix one nonstandard form at a time. First half: "we was" pairs the plural subject "we" with "was." Standard English pairs "we" with "were." WRONG: "We was so proud backstage." CORRECT: "We were so proud backstage."',
        'Second half: find the two negative words. "Nobody" is already a negative word — it means "not one person" — and "didn\'t" adds a second negative to the same clause. Standard English keeps only one negative per clause, so the sentence needs "didn\'t" to become a plain positive verb.',
        'WRONG: "...nobody didn\'t clap harder than my little sister." CORRECT: "...nobody clapped harder than my little sister."',
        'Put the two repaired halves back together and reread the whole sentence: "We were so proud backstage, and nobody clapped harder than my little sister." Check the meaning: the sentence still says the group was proud, and the little sister clapped harder than everyone else.',
        'Notice that the fix never added an idea and never removed one. It only changed the form of two verbs so the sentence was ready for a printed program.',
      ],
      answer:
        'We were so proud backstage, and nobody clapped harder than my little sister.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-double-negative-revision',
      kind: 'try_yourself',
      problem:
        'A line from a group project report reads: "The class didn\'t have no time left for questions." Which choice below revises the sentence correctly for a formal report?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The class didn\'t have time left for no questions.' },
        { id: 'b', text: 'The class did not have any time left for questions.', correct: true },
        { id: 'c', text: 'The class don\'t have no time left for questions.' },
        { id: 'd', text: 'The class did not have no time left for those last few questions.' },
      ],
      expectedAnswer: 'The class did not have any time left for questions.',
      hints: [
        'Count the negative words in the original sentence, not just find one. A revision is not finished until only one negative word is left in the clause.',
        'The correct revision also gets rid of the contraction, so the whole sentence — not just the negative count — is ready for a formal report.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-aint-exact-verb-form',
      kind: 'try_yourself',
      problem:
        'A permission-slip note says: "I ain\'t seen the field trip form yet." Which choice below matches the sentence with the exact verb Standard English needs?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'I am not seen the field trip form yet.' },
        { id: 'b', text: 'I have seen the field trip form yet.' },
        { id: 'c', text: 'I have not seen the field trip form yet.', correct: true },
        { id: 'd', text: 'I am not seeing the field trip form yet.' },
      ],
      expectedAnswer: 'I have not seen the field trip form yet.',
      hints: [
        '"Ain\'t" is not one word with one meaning — it stands for several different standard helping verbs. Decide which specific helping verb this sentence needs before you pick a choice.',
        'The sentence describes something that has not happened yet, using the word "seen." Only one choice pairs "seen" with both the right helping verb and a negative word.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-all-three-forms-together',
      kind: 'try_yourself',
      problem:
        'Read each sentence below. Which one is entirely Standard English, ready to print in a school newsletter?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The players was ready before the whistle, nobody complained about the extra practice, and the coach said the team has not looked this sharp all season.' },
        { id: 'b', text: 'The players were ready before the whistle, nobody didn\'t complain about the extra practice, and the coach said the team has not looked this sharp all season.' },
        { id: 'c', text: 'The players were ready before the whistle, nobody complained about the extra practice, and the coach said the team ain\'t looked this sharp all season.' },
        { id: 'd', text: 'The players were ready before the whistle, nobody complained about the extra practice, and the coach said the team has not looked this sharp all season.', correct: true },
      ],
      expectedAnswer: 'The players were ready before the whistle, nobody complained about the extra practice, and the coach said the team has not looked this sharp all season.',
      hints: [
        'This sentence has three parts joined by commas. Check each part on its own, the way you would check three short sentences instead of one long one.',
        'One part pairs a plural subject with the wrong helping verb, one part stacks two negative words in the same clause, and one part hides "ain\'t" standing in for a helping verb. Only one choice keeps every part standard.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-dialect-is-not-carelessness',
      kind: 'misconception_check',
      question:
        'A student explains a revision this way: people who say "I don\'t have no money" are not being careful with English, and the fix is just deleting the second negative word every time. What is wrong with the way the student is thinking about this, even though the delete-the-second-negative method mostly works?',
      commonErrors: [
        {
          answer: 'People who say "I don\'t have no money" are not being careful with English.',
          misconception:
            'Treating a dialect feature as a sign of carelessness or lower intelligence. A double negative is a regular, rule-governed part of the grammar of several dialects of English, and a speaker using one is following that dialect\'s rules exactly as consistently as any speaker follows standard English\'s rules. Being able to use two different registers is a skill, not evidence that one speaker knows less than another.',
          correctsTo:
            'A double negative is nonstandard for one specific setting — formal written English — not proof of an error in thinking. The correction this lesson teaches is about matching the form a piece of writing calls for, the same way a student changes into different clothes for gym class without that meaning the regular clothes were wrong. Standard English and a spoken dialect are simply two different sets of rules, each consistent on its own terms.',
        },
        {
          answer: 'The fix is just deleting the second negative word every time.',
          misconception:
            'Applying one mechanical rule without checking what the finished sentence needs. Deleting the second negative works for "I don\'t have no money," because what is left, "I don\'t have money," still makes sense, but the same delete-only move breaks down for "ain\'t," which is not an extra word to remove — it is standing in for a specific helping verb the sentence still needs.',
          correctsTo:
            'Name the exact standard form the sentence needs — a positive word such as "any" where "no" was doing double duty, or the specific helping verb "ain\'t" was standing in for — rather than deleting a word and hoping the sentence still works. Reread the finished sentence afterward to check the meaning has not changed before deciding the revision is done.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Standard English is the form school, business, and formal writing agree to use; a dialect or home variety follows its own real, regular rules and is not a mistake.',
        'Standard English keeps one negative word per clause. WRONG: "I do not have no pencil." CORRECT: "I do not have any pencil."',
        '"Ain\'t" stands for several different standard verb forms — am not, is not, are not, has not, have not — so name the exact one the sentence needs. WRONG: "She ain\'t ready." CORRECT: "She is not ready."',
        'Standard English pairs a plural subject with "were," not "was," and pairs "does not" or "do not" with the subject Standard English expects, not "don\'t" on its own. WRONG: "We was the last team." CORRECT: "We were the last team."',
        'Revise in three moves: name the nonstandard form, swap in the exact standard form the sentence needs, then reread the whole sentence to check the meaning has not changed.',
        'The swap belongs to formal writing — a report, a letter to an office, a class newsletter — not to every sentence a person says or writes.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'Standard & Nonstandard English' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
