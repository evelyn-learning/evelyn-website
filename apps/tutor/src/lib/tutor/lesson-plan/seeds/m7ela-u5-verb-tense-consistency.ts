/**
 * Grade 7 ELA — Grammar & Usage: Verb Tense & Consistency.
 *
 * Procedure-led (CCSS L.7.1, with L.7.3a on consistent style). One question
 * runs the whole lesson: did the TIME change? If it did not, the tense does
 * not change either. The three traps it is built to kill are the accidental
 * slide from past into present mid-story, the belief that any tense change
 * is an error, and the stand-alone "I seen it" / "I done it" form.
 *
 * NOTE FOR FUTURE AUTHORS: every ungrammatical example in this file is
 * explicitly labeled WRONG, with the CORRECT version beside it. A tutor
 * reads these aloud, and an unlabeled "I seen it" would be presented to the
 * student as a model sentence. Never write a broken example bare.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U5_VERB_TENSE_CONSISTENCY: LessonPlan = {
  id: 'evelyn.ms.m7ela.verb-tense-consistency.v1',
  title: 'Verb Tense & Consistency',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.verb-tense-consistency',
      standard: 'M7ELA-5.4',
      description:
        'Choose past, present or future to match the time being described, hold one tense across a sentence or a paragraph unless the meaning truly requires a shift, recognize the two shifts that are correct, and use the standard irregular past and past-participle forms (CCSS L.7.1, and L.7.3a on keeping style consistent).',
    },
  ],
  prerequisites: ['m7ela.pronouns-and-antecedents'],
  followUps: ['m7ela.phrases-and-clauses'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that tense slipping happens to everyone when they tell a story out loud, and that writing does not forgive it the way talking does.',
      script:
        'Think about telling your friends what happened at lunch. You start in the past: "so I grabbed my tray." Two seconds later you have slid somewhere else: "and then this kid walks right into me." Your friends still follow you, because when you talk, your voice and your hands fill in the gaps. Writing does not do that. On paper, that slide from walked to walks makes a reader stop and wonder when this is happening. Today you learn to pick one tense and hold it. You also learn the two times you are allowed to change it on purpose, and how to land the past-tense verbs that trip up almost everybody.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-tense-consistency',
      kind: 'concept',
      goal: 'Install the three tenses, the hold-one-tense rule, the did-the-time-change test, the two legal shifts, and the irregular past forms.',
      keyIdeas: [
        'THERE ARE THREE BASIC TENSES, and they answer the question WHEN. Past is already over: "I rode my bike to the park." Present is happening now or happens over and over: "I ride my bike to the park." Future has not happened yet: "I will ride my bike to the park." Every verb you write picks one of these three.',
        'PICK ONE TENSE AND HOLD IT. If you are telling what happened, every verb in that stretch stays in the past. The most common mistake in the world is sliding into the present partway through, because the memory feels alive while you write it. WRONG: "I walked into the gym and everyone stares at me." CORRECT: "I walked into the gym and everyone stared at me."',
        'THE TEST IS NOT WHETHER THE TENSE CHANGED. THE TEST IS WHETHER THE TIME CHANGED. A tense change is only an error when both verbs describe the same moment. If the second verb really does happen at a different time, the tense SHOULD change. CORRECT: "I finished the book yesterday, so I will start the next one tonight." Yesterday and tonight are different times, so past plus future is exactly right.',
        'A GENERAL TRUTH STAYS IN THE PRESENT, even inside a past story. Something that was true then and is still true now does not get pushed into the past. CORRECT: "She learned that water boils at a lower temperature high in the mountains." She learned it last summer, but water still behaves that way today, so "boils" stays present.',
        'IRREGULAR VERBS DO NOT TAKE -ED. Adding -ed works for most verbs, and it fails completely on the common ones. Learn the three shapes: go, went, gone. See, saw, seen. Do, did, done. Take, took, taken. Bring, brought, brought. WRONG: "I bringed my glove" and "I brung my glove." CORRECT: "I brought my glove."',
        'THE THIRD SHAPE NEEDS A HELPER IN FRONT OF IT. Gone, seen, done and taken cannot stand alone as the past tense. They need have, has or had. WRONG: "I seen the whole thing." CORRECT: "I saw the whole thing." Also CORRECT: "I have seen the whole thing." WRONG: "He done his chores." CORRECT: "He did his chores." Also CORRECT: "He had done his chores."',
      ],
      vocabulary: [
        { term: 'verb tense', definition: 'the form of a verb that tells when the action happens: past, present or future.' },
        { term: 'tense consistency', definition: 'keeping every verb that describes the same stretch of time in the same tense.' },
        { term: 'irregular verb', definition: 'a verb whose past form is not made by adding -ed, such as go, see, do, take and bring.' },
        { term: 'helping verb', definition: 'a verb such as have, has or had placed in front of another verb to complete it, as in "have seen".' },
        { term: 'past participle', definition: 'the third shape of a verb (gone, seen, done, taken), which needs a helping verb in front of it.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-hold-the-past',
      kind: 'worked_example',
      problem:
        'Fix the verbs. WRONG: "Last Friday my cousin drove me to my first swim meet. I seen the pool through the window, and my stomach flips."',
      steps: [
        'Name the time first. "Last Friday" plus "drove" puts this whole story in finished past time. That is the tense every verb has to match.',
        'List every verb: drove, seen, flips. Now check them one at a time.',
        '"Drove" is correct. Drive has three shapes: drive, drove, driven. The middle shape stands alone, and that is what is here.',
        '"Seen" is a form error, not a tense error. See has three shapes: see, saw, seen. Only "saw" stands alone. "Seen" is the third shape, so it needs have, has or had in front of it. WRONG: "I seen the pool." CORRECT: "I saw the pool."',
        '"Flips" is the consistency error. It is present tense sitting inside a past story. Run the real test: did the TIME change? No. The stomach flipped at the same moment the writer saw the pool, so it belongs in the past. CORRECT: "my stomach flipped."',
        'Read the whole repaired version back. CORRECT: "Last Friday my cousin drove me to my first swim meet. I saw the pool through the window, and my stomach flipped." Every verb now sits in the same stretch of time.',
      ],
      answer:
        'Last Friday my cousin drove me to my first swim meet. I saw the pool through the window, and my stomach flipped.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-when-a-shift-is-correct',
      kind: 'worked_example',
      problem:
        'Each of these three sentences changes tense partway through. Only ONE of them is an error. Which one, and why? (1) "I finished the last book in the series yesterday, so I will start the next one tonight." (2) "Marisol learned at camp that a compass needle points toward magnetic north." (3) "We painted the fence all morning, and then we walk down to the pool."',
      steps: [
        'Do not ask whether the tense changed. All three change tense. Ask the real question about each one: did the TIME change?',
        'Sentence 1. "Finished" is past and "will start" is future. The words yesterday and tonight name two different times, so the change of tense matches a real change of time. This sentence is CORRECT exactly as written.',
        'Sentence 2. "Learned" is past and "points" is present. A compass needle pointed north when Marisol was at camp, and it still points north today. That is a general truth, and a general truth stays in the present tense. This sentence is CORRECT as written.',
        'Sentence 3. "Painted" is past and "walk" is present. Did the time change? No. Both things happened on the same past morning, and the words "and then" say so. This is the error.',
        'Fix sentence 3 by matching the tense already established. WRONG: "We painted the fence all morning, and then we walk down to the pool." CORRECT: "We painted the fence all morning, and then we walked down to the pool."',
        'Keep the habit: find the verbs, ask whether the time moved, and change the tense only when the answer is yes.',
      ],
      answer:
        'Sentence 3 is the error. WRONG: "and then we walk down to the pool." CORRECT: "and then we walked down to the pool." Sentences 1 and 2 are correct, because one names two different times and the other states a general truth.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-hold-one-tense',
      kind: 'try_yourself',
      problem:
        'Which revision fixes the tense problem? WRONG: "I opened the front door after the game, and my dog jumps on me and knocks the pizza box out of my hands."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'I open the front door after the game, and my dog jumped on me and knocked the pizza box out of my hands.' },
        { id: 'b', text: 'I opened the front door after the game, and my dog jumped on me and knocked the pizza box out of my hands.', correct: true },
        { id: 'c', text: 'I opened the front door after the game, and my dog jumps on me and knocked the pizza box out of my hands.' },
        { id: 'd', text: 'I opened the front door after the game, and my dog will jump on me and knock the pizza box out of my hands.' },
      ],
      expectedAnswer: 'I opened the front door after the game, and my dog jumped on me and knocked the pizza box out of my hands.',
      hints: [
        'Find all three verbs first, then ask when each one happens. The whole thing happened after one game, at one time.',
        'A real fix puts every verb in the same tense. Options that repair only one verb, or that push part of the sentence into the future, leave the reader confused about when this happened.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-general-truth',
      kind: 'try_yourself',
      problem: 'Which sentence is written correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Last summer my aunt showed me how to make cocoa on a camp stove, and she explains that water boils at a lower temperature high in the mountains.' },
        { id: 'b', text: 'Last summer my aunt shows me how to make cocoa on a camp stove, and she explained that water boils at a lower temperature high in the mountains.' },
        { id: 'c', text: 'Last summer my aunt showed me how to make cocoa on a camp stove, and she explained that water boils at a lower temperature high in the mountains.', correct: true },
        { id: 'd', text: 'Last summer my aunt shown me how to make cocoa on a camp stove, and she explained that water boils at a lower temperature high in the mountains.' },
      ],
      expectedAnswer: 'Last summer my aunt showed me how to make cocoa on a camp stove, and she explained that water boils at a lower temperature high in the mountains.',
      hints: [
        'Two things happened last summer: the showing and the explaining. Both of those verbs belong in the past.',
        '"Water boils at a lower temperature high in the mountains" is still true today, so that verb stays present. Also check the first verb: show has three shapes, and "shown" cannot stand alone.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-irregular-forms',
      kind: 'try_yourself',
      problem: 'Which sentence is written correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'My little brother brung the wrong cleats to practice again.' },
        { id: 'b', text: 'I done all my chores before the movie started.' },
        { id: 'c', text: 'We had went to the same water park three summers in a row.' },
        { id: 'd', text: 'Nobody saw the raccoon tip over the trash can, but we all heard it.', correct: true },
      ],
      expectedAnswer: 'Nobody saw the raccoon tip over the trash can, but we all heard it.',
      hints: [
        'Three of these use an irregular verb in the wrong shape. Say each verb in all three of its shapes before you decide.',
        'Bring, brought, brought. Do, did, done. Go, went, gone. See, saw, seen. Remember that the third shape always needs have, has or had in front of it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-any-shift-is-wrong',
      kind: 'misconception_check',
      question:
        'A student writes this about a storm last week. WRONG: "I seen the clouds turn green, so I ran inside. Rain always sounds louder on a metal roof." A partner says two things are wrong: "I seen" is wrong, and the last sentence should be in past tense because the whole story is in the past. Is the partner right about both?',
      commonErrors: [
        {
          answer: 'Yes, the partner is right about both.',
          misconception:
            'Treating every tense change inside a past story as an error. The student is checking whether the TENSE changed instead of whether the TIME changed.',
          correctsTo:
            'The partner is right about only the first one. "Rain always sounds louder on a metal roof" is a general truth. It was true last week and it is still true right now, so it belongs in the present tense. Pushing it into the past would say that rain used to sound that way and does not anymore. The real error is the verb form: WRONG: "I seen the clouds turn green." CORRECT: "I saw the clouds turn green." Ask whether the time changed, not whether the tense changed.',
        },
        {
          answer: 'No, the partner is wrong about both, because "seen" is just the past tense of see.',
          misconception:
            'Believing that "seen" and "done" can stand alone as past-tense verbs. They are the third shape of the verb and always need a helping verb in front of them.',
          correctsTo:
            'See has three shapes: see, saw, seen. Only "saw" stands alone. WRONG: "I seen the clouds turn green." CORRECT: "I saw the clouds turn green." Also CORRECT: "I have seen clouds turn green before." Do works the same way: do, did, done. WRONG: "I done my chores." CORRECT: "I did my chores." Also CORRECT: "I have done my chores." The partner was right about that verb, and wrong about the general truth in the last sentence.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Past, present, future. Pick the one that matches when the action happens, then hold it for every verb describing that same stretch of time.',
        'WRONG: "I walked into the gym and everyone stares at me." CORRECT: "I walked into the gym and everyone stared at me."',
        'The test is not whether the tense changed. The test is whether the TIME changed. CORRECT: "I finished the book yesterday, so I will start the next one tonight."',
        'A general truth stays in the present, even inside a past story. CORRECT: "She learned that water boils at a lower temperature high in the mountains."',
        'Irregular verbs do not take -ed: go, went, gone. See, saw, seen. Do, did, done. Take, took, taken. Bring, brought, brought. There is no such word as "brung."',
        'Gone, seen, done and taken need have, has or had in front of them. WRONG: "I seen it." CORRECT: "I saw it." or "I have seen it."',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.4', cedTitle: 'Verb Tense & Consistency' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
