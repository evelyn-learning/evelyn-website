/**
 * Grade 6 ELA — Grammar: Pronoun Precision & Standard English: Pronoun Case.
 *
 * PROCEDURE-LED exemplar for the m6ela fan-out. There is one repeatable move
 * and the whole lesson makes it fluent: find the job the pronoun is doing in
 * the sentence, then pick the shape that does that job (CCSS L.6.1a). The
 * shape of this file is deliberately different from the concept-led exemplar
 * — the concept segment is an ordered recipe rather than a way of reading,
 * both worked examples run the same drop test so the pattern is unmistakable,
 * and every wrong form on the page is labeled. Three traps this plan is built
 * to kill: "between you and I", an object pronoun doing a subject's job
 * ("Her and Malik built it"), and an apostrophe on a possessive pronoun
 * ("their-apostrophe-s", and "it-apostrophe-s" written where "its" belongs).
 *
 * SCOPE GUARD: Grade 6 row 5.1 chooses the CASE of a pronoun — subjective,
 * objective or possessive — from the job that pronoun does inside its own
 * single sentence. DELIBERATELY EXCLUDED: intensive pronouns such as myself
 * and ourselves (row 5.2); shifts in number or person across a whole passage
 * (row 5.3); the double negatives, "ain't" and "we was" of nonstandard-English
 * repair (row 5.4); and pronoun-antecedent number agreement together with the
 * repair of a vague or ambiguous pronoun reference. That last one is L.6.1d,
 * excluded from this whole course because the shipped
 * m7ela-u5-pronouns-and-antecedents.ts already teaches it end to end, and it
 * must not appear here in any form. DELIBERATELY ALLOWED, because row 5.2 sits
 * close: this plan says that a pronoun stands in for a noun, and one worked
 * step names what a possessive pronoun stands in for inside its own clause.
 * That is unavoidable — you cannot see that a word needs possessive case
 * without knowing what it owns — and it is not the same skill as matching a
 * pronoun to an antecedent across sentences or repairing an unclear reference.
 *
 * NOTE FOR FUTURE AUTHORS: every sentence in this file is original prose
 * written for the item. This course carries no passage machinery — no
 * passageId, no shared texts — so each question must be solvable from the
 * words printed inside it. Every ungrammatical example is explicitly labeled
 * WRONG, with the CORRECT version beside it: a tutor reads these lines aloud,
 * and an unlabeled "between you and I" is handed to the student as a model.
 * Never write a broken example bare. Every contraction in this file is printed
 * inside quotation marks as the object of study rather than as the lesson's
 * own voice, which is the only place a contraction is allowed in authored
 * prose in this course.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 4.4 -> 5.1 ->
 * 5.2, but rows 4.4 and 5.2 are authored in the fan-out that follows this
 * commit. `lint-ms-plans` rejects a prerequisite/followUp that does not
 * resolve to a registered LO, so both arrays stay empty until the full 40-row
 * batch lands and the controller wires the chain. Do not copy the empty
 * arrays into a fan-out file.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6ELA_U5_PRONOUN_CASE: LessonPlan = {
  id: 'evelyn.ms.m6ela.pronoun-case.v1',
  title: 'Pronoun Case',
  curriculum: 'MS',
  grade: '6',
  subject: 'ela',
  topic: 'grade-6-ela',
  locale: 'en',
  los: [
    {
      id: 'm6ela.pronoun-case',
      standard: 'M6ELA-5.1',
      description:
        'Choose the correct case of a pronoun — subjective, objective or possessive — based on the job it does in the sentence, using the drop test on compound subjects and objects and applying the rule that object case always follows a preposition, as in "between you and me" rather than "between you and I" (CCSS L.6.1a).',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the student already hears the difference, and that the fix is a test rather than an ear.',
      script:
        'You send a message to the group chat that says "me and Dev are going to the park." Nobody is confused for a second. Everybody knows exactly what you mean, and nobody writes back to complain. Then you put the same sentence in a paragraph for class, and it comes back with a line through it. Here is the thing: the message was not unclear. One of those two words was just doing a job it does not do. Most pronouns in English come in different shapes for different jobs, and picking the wrong shape is the single most common grammar slip in sixth-grade writing. There is a five-second test that gets it right every time, and by the end of today it will be automatic.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-case-and-the-drop-test',
      kind: 'concept',
      goal: 'Install the three cases, the job-decides rule, the preposition rule, the no-apostrophe rule, and the drop test as one ordered procedure.',
      keyIdeas: [
        'A PRONOUN STANDS IN FOR A NOUN, AND MOST PRONOUNS COME IN THREE SHAPES. Subject case: I, we, he, she, they, who. Object case: me, us, him, her, them, whom. Possessive case: my, our, his, her, their, and the standalone forms mine, ours, hers, theirs, whose. You and it look the same in the first two, which is why they never cause trouble.',
        'THE JOB DECIDES THE SHAPE, NOT THE SOUND. Subject case does the verb: ask who or what is doing the action. "She fixed the chain." Object case receives the action: ask who or what the action lands on. "Coach picked her." Possessive case shows ownership. "That helmet is hers." Nothing about politeness or formality comes into it.',
        'OBJECT CASE ALWAYS FOLLOWS A PREPOSITION. The prepositions you will meet most are to, for, with, at, from, after, before and between. Whatever sits right after one of them is in object case, every single time, with no exceptions. WRONG: "between you and I." CORRECT: "between you and me." WRONG: "a seat for Ellie and I." CORRECT: "a seat for Ellie and me."',
        'THE DROP TEST IS THE WHOLE PROCEDURE. When a pronoun is stuck in a pair, cover the other name with your thumb and read the sentence with the pronoun alone. "Dev and me went to the park" becomes "me went to the park," which nobody says, so the answer is I. "Coach thanked Dev and I" becomes "Coach thanked I," which nobody says either, so the answer is me. The test takes five seconds and it never depends on how the sentence sounds.',
        'POSSESSIVE PRONOUNS NEVER TAKE AN APOSTROPHE. Not one of them: its, hers, ours, yours, theirs, whose. An apostrophe on any of those is always an error. WRONG: "The dog chewed it\'s leash." CORRECT: "The dog chewed its leash." The word "it\'s" exists, but it is short for "it is," so read it that way to check: "The dog chewed it is leash" is not a sentence.',
        'PUT YOURSELF LAST, AND DO NOT TRUST YOUR EAR. Write "Dev and I," not "I and Dev." And run the drop test even when the right answer feels stiff, because "and I" sounds careful and "and me" sounds casual, and neither feeling has anything to do with which one the sentence needs.',
      ],
      vocabulary: [
        { term: 'pronoun', definition: 'a word that stands in for a noun, such as she, them or ours.' },
        { term: 'case', definition: 'the shape a pronoun takes based on the job it is doing in the sentence.' },
        { term: 'subject', definition: 'the person or thing doing the verb. Subject case: I, we, he, she, they.' },
        { term: 'object', definition: 'the person or thing that receives the action, or that follows a preposition. Object case: me, us, him, her, them.' },
        { term: 'preposition', definition: 'a small position word such as to, for, with, from, after or between. Whatever follows one is in object case.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-drop-test-both-jobs',
      kind: 'worked_example',
      problem:
        'Choose the right pronoun for each blank, and say how you know.\n\n"Dev and (I / me) carried the cooler down to the field, and Coach thanked Dev and (I / me) afterward."',
      steps: [
        'Work one blank at a time. Never decide both at once, because the two blanks are doing two different jobs even though the pair of words looks identical.',
        'Blank one. Cover "Dev and" with your thumb and read what is left: "___ carried the cooler down to the field." Try both shapes. WRONG: "Me carried the cooler down to the field." CORRECT: "I carried the cooler down to the field."',
        'Name the job so the answer is not just a feeling. This pronoun is doing the verb carried, which makes it the subject, and subjects take subject case. Blank one is I.',
        'Blank two. Cover "Dev and" again: "Coach thanked ___ afterward." WRONG: "Coach thanked I afterward." CORRECT: "Coach thanked me afterward."',
        'Name that job too. This pronoun receives the action of thanked, which makes it the object, and objects take object case. Blank two is me.',
        'Notice what just happened. The exact same pair, "Dev and ___", needed I in one blank and me in the other. There is no pair that is always right. The job decides, every time, and that is why the test beats the ear.',
        'Read the finished sentence back with both names in place: "Dev and I carried the cooler down to the field, and Coach thanked Dev and me afterward."',
      ],
      answer:
        'Dev and I carried the cooler down to the field, and Coach thanked Dev and me afterward. Blank one is the subject doing the verb carried, so it takes I. Blank two is the object of thanked, so it takes me.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-preposition-and-apostrophe',
      kind: 'worked_example',
      problem:
        'Two sentences from a group chat need fixing. Repair each one and say which rule caught it.\n\nSentence 1: "The teacher split the last two tickets between Nadia and I."\nSentence 2: "My bike is fine, but their\'s is missing a pedal."',
      steps: [
        'Sentence 1. Find the preposition first, because that settles the case before you test anything: the word between. Whatever sits right after a preposition is in object case.',
        'Confirm it with the drop test so the rule and the ear agree. Cover "Nadia and": WRONG: "between I." CORRECT: "between me."',
        'CORRECT: "The teacher split the last two tickets between Nadia and me." The famous version of this same error is "between you and I," and it is wrong for exactly the same reason. Between is a preposition, so the words after it are objects, and no amount of sounding careful changes that.',
        'Sentence 2. Ask what the word has to do. It stands in for the other person\'s bike, so it is showing ownership. That is possessive case, and the standalone possessive shape is theirs.',
        'Now apply the apostrophe rule. Possessive pronouns never take one. WRONG: "their\'s." There is no such word in English.',
        'CORRECT: "My bike is fine, but theirs is missing a pedal." Check the whole family while you are here: its, hers, ours, yours, theirs, whose. Not one of them takes an apostrophe, ever.',
        'One extra check for the two that trip people up. "It\'s" is short for "it is" and "they\'re" is short for "they are," so read them the long way to test them. "It is leash" and "they are bikes" are not sentences, which tells you the possessive was wanted: its leash, their bikes.',
      ],
      answer:
        'Sentence 1: "The teacher split the last two tickets between Nadia and me." (Object case always follows the preposition between.) Sentence 2: "My bike is fine, but theirs is missing a pedal." (Possessive pronouns never take an apostrophe.)',
      estimatedMinutes: 3,
    },
    {
      id: 'try-object-after-preposition',
      kind: 'try_yourself',
      problem: 'Which sentence is written correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Ms. Ruiz handed the sign-up sheet to Jonah and I.' },
        { id: 'b', text: 'Ms. Ruiz handed the sign-up sheet to Jonah and me.', correct: true },
        { id: 'c', text: 'Ms. Ruiz handed the sign-up sheet to he and me.' },
        { id: 'd', text: 'Ms. Ruiz handed the sign-up sheet to Jonah and mine.' },
      ],
      expectedAnswer: 'Ms. Ruiz handed the sign-up sheet to Jonah and me.',
      hints: [
        'Find the preposition in the sentence first. Then remember which case always follows one.',
        'Cover the other name and read each ending alone: "to I", "to me", "to he", "to mine". Only one of those four is something an English sentence can say.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-subject-of-the-verb',
      kind: 'try_yourself',
      problem: 'Which sentence is written correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Her and Malik built the whole ramp in one afternoon.' },
        { id: 'b', text: 'Her and him built the whole ramp in one afternoon.' },
        { id: 'c', text: 'She and Malik built the whole ramp in one afternoon.', correct: true },
        { id: 'd', text: 'Hers and Malik built the whole ramp in one afternoon.' },
      ],
      expectedAnswer: 'She and Malik built the whole ramp in one afternoon.',
      hints: [
        'Cover "and Malik" with your thumb and read what is left. Which single word can do the verb built alone?',
        '"Her built the ramp" and "Hers built the ramp" are not sentences. The pronoun doing the verb is the subject, so it needs subject case.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-possessive-no-apostrophe',
      kind: 'try_yourself',
      problem: 'Which sentence is written correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The team left it\'s water bottles on the bench, so ours got mixed in with their\'s.' },
        { id: 'b', text: 'The team left its water bottles on the bench, so our\'s got mixed in with theirs.' },
        { id: 'c', text: 'The team left it\'s water bottles on the bench, so ours got mixed in with theirs.' },
        { id: 'd', text: 'The team left its water bottles on the bench, so ours got mixed in with theirs.', correct: true },
      ],
      expectedAnswer: 'The team left its water bottles on the bench, so ours got mixed in with theirs.',
      hints: [
        'Read every "it\'s" you see the long way, as "it is", and check whether the sentence still works.',
        'Possessive pronouns never take an apostrophe. Look at all three possessives in each choice — its, ours, theirs — and rule out any choice where even one of them has one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-and-i-is-always-polite',
      kind: 'misconception_check',
      question:
        'A student writes "Please save a seat for Ellie and I" and explains it this way: "I always use I when there is another person, because me and Ellie sounds wrong." What has gone wrong?',
      commonErrors: [
        {
          answer: 'Please save a seat for Ellie and I.',
          misconception:
            'Treating "and I" as a polite phrase that is correct everywhere. The student has been corrected on "me and Ellie" so many times that they start avoiding me in every sentence, and the fix spreads to places that never needed it.',
          correctsTo:
            'Nothing about I is more polite than me. They are two shapes for two different jobs. Run the drop test: cover "Ellie and" and read the sentence alone. WRONG: "Please save a seat for I." CORRECT: "Please save a seat for me." The word for is a preposition, and object case always follows a preposition, so the sentence is "Please save a seat for Ellie and me." The student was right that "me and Ellie" is wrong as a subject, but the repair for that one is "Ellie and I went," not banning me from every sentence in the paragraph.',
        },
        {
          answer: 'Use whichever one sounds better when you say it out loud.',
          misconception:
            'Choosing by ear instead of by job. Both shapes sound normal somewhere, so the ear gives back whichever version the student has heard most often, and that changes with the room.',
          correctsTo:
            'The ear is the exact thing the drop test replaces. Cover the other name, read the pronoun alone, and let the sentence answer for you. "Me went" is not a sentence, so a subject takes I. "Coach picked I" is not a sentence, so an object takes me. Then name the job out loud — subject, object, or possessive — so you are checking a rule and not a feeling. The test takes five seconds and it gives the same answer no matter who is listening.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three shapes, and the job in the sentence picks the shape: subject (I, we, he, she, they), object (me, us, him, her, them), possessive (my, our, his, her, their, mine, ours, hers, theirs).',
        'Subject case does the verb. Object case receives the action or follows a preposition.',
        'Anything sitting right after to, for, with, from, after or between is object case. WRONG: "between you and I." CORRECT: "between you and me."',
        'The drop test is the whole procedure: cover the other name and read the pronoun alone. "Me went to the park" is not a sentence, so the answer is I.',
        'Possessive pronouns never take an apostrophe: its, hers, ours, yours, theirs, whose. WRONG: "The dog chewed it\'s leash." CORRECT: "The dog chewed its leash."',
        'Sound is not evidence. Run the drop test and name the job, even when the right answer feels stiff.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'Pronoun Case' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
