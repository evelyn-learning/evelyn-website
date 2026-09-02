/**
 * Grade 6 ELA — Grammar: Pronoun Precision & Standard English: Intensive
 * Pronouns.
 *
 * PROCEDURE-LED sibling of the m6ela-u5-pronoun-case exemplar, and it shares
 * the exemplar's shape on purpose: one repeatable test, run twice on two
 * sentences in each worked example, so the same move gets fluent fast. The
 * standard (L.6.1b) asks for two things and this file is built around both:
 * using an intensive pronoun correctly for emphasis, and catching the same
 * eight words when they are wrongly asked to do a subject's or an object's
 * job instead ("Mark and myself went" where "Mark and I went" is required).
 *
 * SCOPE GUARD: Grade 6 row 5.2 teaches exactly two things about the eight
 * -self words (myself, yourself, himself, herself, itself, ourselves,
 * yourselves, themselves): using one correctly to add emphasis to a subject
 * or object pronoun already present in its own sentence, and recognizing
 * when one of those same words has been wrongly substituted for a subject or
 * object pronoun instead. DELIBERATELY EXCLUDED: choosing between
 * subjective, objective and possessive case for an ordinary (non -self)
 * pronoun, which is row 5.1's whole lesson and is borrowed here only as the
 * repair tool once a misused -self word has been caught; shifts in pronoun
 * number or person across a passage (row 5.3); nonstandard forms such as
 * double negatives, "ain't" and "we was" (row 5.4); and pronoun-antecedent
 * number agreement together with repair of a vague or ambiguous pronoun
 * reference, which is L.6.1d and is excluded from this whole course because
 * the shipped m7ela-u5-pronouns-and-antecedents.ts already teaches it end to
 * end. This lesson also never names or teaches the grammatical role in which
 * these same eight words mark a subject acting on itself (as in "I hurt
 * myself") as a separate function from emphasis — every example here is
 * built and tested purely on the emphasis-versus-substitution question the
 * standard asks for. DELIBERATELY ALLOWED, because row 5.1 sits directly
 * behind this one: the repair for a misused -self word is the pronoun-case
 * drop test itself, so the second worked example names subject case and
 * object case exactly the way row 5.1 does, and every worked example and
 * try_yourself hint refers to a sentence's subject or object role by name.
 * That is not re-teaching 5.1; it is reusing an already-installed tool to
 * fix a different kind of mistake.
 *
 * NOTE FOR FUTURE AUTHORS: every sentence in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * words printed inside it. Every ungrammatical example IN THE TUTOR'S OWN
 * PROSE is explicitly labeled WRONG, with the CORRECT version beside it: a
 * tutor reads those lines aloud, and an unlabeled "Jordan and myself painted
 * the gym" would be handed to the student as a model. Never write a broken
 * example bare in prose. The only unlabeled wrong forms in this file are the
 * MCQ distractors the three try_yourself items ask the student to reject,
 * which is exactly what those items are for; each one is then named in that
 * item's hints or in the misconception check.
 *
 * CLAIM LEDGER: none required. Every sentence in this file is original,
 * invented classroom-and-neighborhood prose about students doing ordinary
 * things (decorating a gym, wrapping presents, fixing a faucet). No
 * informational or nonfiction claim about the real world appears anywhere,
 * so there is nothing to verify.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U5_INTENSIVE_PRONOUNS: LessonPlan = {
  id: 'evelyn.ms.m6ela.intensive-pronouns.v1',
  title: 'Intensive Pronouns',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.intensive-pronouns',
      standard: 'M6ELA-5.2',
      description:
        'Use an intensive pronoun (myself, ourselves, itself) correctly for emphasis, and recognize when a reflexive-looking pronoun is wrongly substituted for a subject or object pronoun, as in "Mark and myself went" where "Mark and I went" is required (CCSS L.6.1b).',
    },
  ],
  prerequisites: ['m6ela.pronoun-case'],
  followUps: ['m6ela.keeping-pronoun-number-and-person-consistent'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the same word is correct in one sentence and wrong in the next, so the test matters more than the word itself.',
      script:
        'Picture this: you build an entire blanket fort by yourself, and when your little brother tries to take credit, you say, "I built this fort myself." Nobody marks that sentence wrong, because it is not wrong. Myself is just adding a little extra punch to I. Now picture the exact same word showing up in a note for the class newsletter: "Jordan and myself built the fort for the school fair." That one gets a line through it every time, and here is the strange part: it is the same word, doing something completely different. Today the goal is to tell those two jobs apart in about five seconds, every single time, using one short test.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-emphasis-or-impostor',
      kind: 'concept',
      goal: 'Install the definition of an intensive pronoun, the deletion test that proves correct use, and the repair procedure for a misused one.',
      keyIdeas: [
        'THE EIGHT -SELF WORDS. Myself, yourself, himself, herself, itself, ourselves, yourselves and themselves can work as intensive pronouns, which means their only job is to add emphasis to a subject or object that is already named somewhere in the very same sentence.',
        'THE DELETION TEST PROVES CORRECT USE. A true intensive pronoun can be deleted completely, and the sentence that is left over still says exactly the same thing, with the same subject or object, just without the extra push. "I painted the entire mural myself." Delete myself: "I painted the entire mural." Still a complete sentence, same subject, same meaning.',
        'THE TRAP: THE SAME WORDS GET BORROWED TO FILL A SLOT ON THEIR OWN. Most often inside a compound, such as "Jordan and myself" or "to Priya and myself," one of these words is asked to be the whole subject or the whole object by itself, with no other "I" or "me" anywhere in the sentence for it to be emphasizing. WRONG: "Jordan and myself decorated the gym." CORRECT: "Jordan and I decorated the gym." The word myself in the wrong version has nothing to emphasize — it is standing in the subject slot instead of pointing back to it.',
        'THE CHECK IS TWO QUESTIONS. First: is a subject or object pronoun already doing this job somewhere else in the sentence? If yes, the -self word is correctly emphasizing it. Second, if the answer to the first question is no: run the deletion test to confirm the sentence falls apart without the -self word, which proves it was never extra — it was filling the slot by itself.',
        'REPAIR WITH THE DROP TEST FROM PRONOUN CASE. Once a -self word is caught filling a slot it does not belong in, swap it for the ordinary pronoun that job needs. Cover the other name and read the pronoun alone, exactly the way row 5.1 does. WRONG: "Myself decorated the gym" alone is not a sentence, so the subject needed is I. WRONG: "gave the trophy to myself" alone, with no other me anywhere in the sentence, is not repeating anyone, so the object needed is me.',
        'MYSELF IS NOT A MORE FORMAL VERSION OF ME. Reaching for myself because me feels too casual is exactly the mistake this lesson exists to catch. An intensive pronoun is correct only when it is repeating a job that is already filled — never when it is asked to fill the job on its own.',
      ],
      vocabulary: [
        { term: 'intensive pronoun', definition: 'myself, yourself, himself, herself, itself, ourselves, yourselves or themselves, used only to add emphasis to a subject or object already named in the same sentence.' },
        { term: 'emphasis', definition: 'extra force or attention given to a word that is already there, without changing who is doing what.' },
        { term: 'compound subject', definition: 'two or more subjects joined by and or or, sharing one verb, such as "Jordan and I."' },
        { term: 'compound object', definition: 'two or more objects joined by and or or, following the same verb or preposition, such as "to Priya and me."' },
        { term: 'deletion test', definition: 'removing a word completely and checking whether the sentence left behind still says the same thing with the same subject or object.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-emphasis-and-the-deletion-test',
      kind: 'worked_example',
      problem:
        'Decide whether "myself" and "herself" are used correctly below, and prove it with one test.\n\nSentence 1: "I painted the entire mural myself."\nSentence 2: "The principal herself announced the winners at the assembly."',
      steps: [
        'Find the -self word, and look for a matching subject or object elsewhere in the same sentence that is already doing that job. Sentence 1 has "I" as the subject. Sentence 2 has "the principal" as the subject.',
        'Run the deletion test on sentence 1: take "myself" out completely and read what is left. "I painted the entire mural." That is a complete sentence, with the exact same subject and the exact same meaning, just without the extra push.',
        'Run the deletion test on sentence 2: take "herself" out completely. "The principal announced the winners at the assembly." Also complete, same subject, same meaning.',
        'Because both sentences survive the deletion test with their meaning intact, myself and herself are doing their real job here: repeating a subject that is already named, purely to add emphasis. Both are correct as written.',
        'Name the rule in one sentence: an intensive pronoun always has a subject or object already present in its own sentence to point back to, and removing the intensive pronoun never breaks the sentence.',
      ],
      answer:
        'Both sentences are correct. Deleting "myself" leaves "I painted the entire mural," and deleting "herself" leaves "The principal announced the winners at the assembly" — both stay complete sentences with the same subject and the same meaning, just without the emphasis.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-repairing-the-borrowed-self-word',
      kind: 'worked_example',
      problem:
        'Two sentences from a class newsletter draft use "myself" the wrong way. Repair each one, and say what test caught it.\n\nSentence 1: "Jordan and myself decorated the gym for the dance."\nSentence 2: "The teacher handed the trophy to Priya and myself."',
      steps: [
        'Sentence 1. Look for another "I" anywhere else in the sentence for "myself" to be emphasizing. There is not one — "Jordan and myself" is the entire subject, with nothing else there for myself to repeat.',
        'Run the deletion test to confirm. WRONG: delete "myself": "Jordan and decorated the gym for the dance." That is not a sentence. The deletion breaks it, which proves myself was never adding emphasis to an already-present subject — it was standing in the subject slot by itself.',
        'A subject slot needs a subject-case pronoun, so use the drop test from pronoun case: cover "Jordan and" and read the pronoun alone. WRONG: "Myself decorated the gym." CORRECT: "I decorated the gym."',
        'CORRECT: "Jordan and I decorated the gym for the dance."',
        'Sentence 2. Same check: is there an "I" or "me" anywhere else in the sentence? No — "Priya and myself" is the entire object of "to," with nothing else there for myself to repeat.',
        'This is an object slot, right after the preposition "to," so it needs object case. Cover "Priya and" and read the pronoun alone. WRONG: "handed the trophy to myself," with no other me anywhere in the sentence, is not repeating anyone — it needs the plain object pronoun. CORRECT: "handed the trophy to me."',
        'CORRECT: "The teacher handed the trophy to Priya and me."',
      ],
      answer:
        'Sentence 1: "Jordan and I decorated the gym for the dance." Sentence 2: "The teacher handed the trophy to Priya and me." In both, there was no other "I" or "me" in the sentence for "myself" to emphasize, so the -self word was filling a subject or object slot on its own — a job that belongs to a subject or object pronoun.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-bare-subject-and-two-compounds',
      kind: 'try_yourself',
      problem: 'Which sentence uses "myself" correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Mateo and myself set up every single folding table in the cafeteria before the assembly began.' },
        { id: 'b', text: 'The coach saved the last two water bottles from today\'s practice for Aaliyah and myself afterward.' },
        { id: 'c', text: 'Myself finished the entire extra-credit worksheet during study hall without any help at all yesterday.' },
        { id: 'd', text: 'I finished the entire extra-credit worksheet myself, without asking anyone in my family for help.', correct: true },
      ],
      expectedAnswer: 'I finished the entire extra-credit worksheet myself, without asking anyone in my family for help.',
      hints: [
        'Look for another "I" or "me" anywhere else in each sentence. An intensive pronoun always repeats a subject or object that is already there — it does not fill the slot alone.',
        'Try deleting "myself" from each sentence. In three of them, deleting it breaks the sentence, which means myself was standing in the subject or object slot by itself. Only one sentence still makes complete sense, with the same subject, once myself is gone.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-correct-plus-two-compounds',
      kind: 'try_yourself',
      problem: 'Which sentence uses "myself" correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'After a very long dinner, I wrapped every single present myself, then hid them all in the garage.', correct: true },
        { id: 'b', text: 'Camille and myself wrapped every single present for the entire school fundraiser table this morning.' },
        { id: 'c', text: 'The librarian saved two of the quiet study rooms for Devon and myself during this entire weekend.' },
        { id: 'd', text: 'Myself wrapped every single present for the whole class party without ever asking for any help.' },
      ],
      expectedAnswer: 'After a very long dinner, I wrapped every single present myself, then hid them all in the garage.',
      hints: [
        'Ask, for every sentence, whether a subject or object pronoun is already named elsewhere, doing the job on its own. An intensive pronoun only repeats a job that is already filled.',
        'Delete "myself" from each sentence. If what is left still makes complete sense with the same subject, that sentence was correct. If the sentence falls apart without it, myself was never extra.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-preposition-plus-correct-and-bare',
      kind: 'try_yourself',
      problem: 'Which sentence uses "myself" correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The one extra ticket to the concert got split between Noah and myself at the very last minute.' },
        { id: 'b', text: 'The two of us practiced the dance routine for weeks, and I choreographed the ending myself.', correct: true },
        { id: 'c', text: 'Myself organized the entire bake sale for the drama club fundraiser this year all alone.' },
        { id: 'd', text: 'Priya and myself organized the entire bake sale for the drama club fundraiser this year.' },
      ],
      expectedAnswer: 'The two of us practiced the dance routine for weeks, and I choreographed the ending myself.',
      hints: [
        'Between, like every preposition, is followed by a pronoun doing an object\'s job, and an intensive pronoun cannot fill that job by itself with nothing else to repeat.',
        'Find the one sentence where a subject pronoun is already present, doing the verb, with myself only repeating it for emphasis. That is the sentence where deleting myself still leaves a complete sentence with the same meaning.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-myself-is-not-more-formal',
      kind: 'misconception_check',
      question:
        'A student writes "The teacher gave the permission slips to Malik and myself" and explains it this way: "I used myself because me sounded too casual for something I am handing in." What has gone wrong?',
      commonErrors: [
        {
          answer: 'The teacher gave the permission slips to Malik and myself.',
          misconception:
            'Treating myself as a formal, careful version of me. The student has been told that "me and Malik" sounds wrong as a subject, so now myself gets reached for anywhere a plain pronoun might sound too casual, even in a spot where myself has nothing to emphasize.',
          correctsTo:
            'Myself has no job to do here unless another "I" or "me" is already in the sentence for it to repeat, and there is not one — "Malik and myself" is the entire object of "to." The word after a preposition needs object case, so cover "Malik and" and read the rest alone: "gave the permission slips to myself" is not what the sentence needs. The correct sentence is "The teacher gave the permission slips to Malik and me." Myself is not a more polite version of me; it is only correct when it is emphasizing a subject or object pronoun that is already sitting somewhere else in the same sentence.',
        },
        {
          answer: 'Deleting a -self word should always be allowed, because it always just adds extra emphasis.',
          misconception:
            'Assuming every -self word can be safely deleted, when only a correctly used intensive pronoun can be. A misused -self word is not extra at all — it is the only thing filling the subject or object slot, so deleting it collapses the sentence.',
          correctsTo:
            'Run the deletion test to tell the difference, not to fix the sentence by itself. Delete the -self word: if what remains is still a complete sentence with the same subject or object, the word was truly intensive and the sentence was already correct. If what remains falls apart, as in "Malik and gave the permission slips," the -self word was never extra — it was standing in for a subject or object pronoun, and it needs to be replaced with the correct one, such as I, me, he, him, she, her, we, us, they or them, not simply removed.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Intensive pronouns are myself, yourself, himself, herself, itself, ourselves, yourselves and themselves, used only to add emphasis to a subject or object that is already in the sentence.',
        'An intensive pronoun always has another pronoun or noun elsewhere in its own sentence already doing the subject or object job — that is the word it is emphasizing.',
        'The deletion test tells correct from incorrect: delete the -self word and read what is left. If a complete sentence remains with the same subject or object, the word was truly intensive.',
        'If deleting the -self word breaks the sentence, it was never adding emphasis — it was filling a subject or object slot by itself, most often inside a compound such as "Jordan and myself" or "to Priya and myself."',
        'Repair a misused -self word with the drop test from pronoun case: cover the other name, read the pronoun alone, and swap in the correct subject or object pronoun (I, me, he, him, she, her, we, us, they, them).',
        'Myself is not a more formal or polite version of me — reaching for it to avoid sounding casual is exactly the mistake this lesson fixes.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'Intensive Pronouns' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
