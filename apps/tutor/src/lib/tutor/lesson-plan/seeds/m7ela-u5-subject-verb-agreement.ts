/**
 * Grade 7 ELA — Grammar & Usage: Subject-Verb Agreement.
 *
 * Procedure-led (CCSS L.7.1). The base rule is easy, so the lesson spends its
 * time on the five situations that break it: a prepositional phrase parked
 * between subject and verb, compound subjects with and versus or/nor,
 * indefinite pronouns such as everybody and each, collective nouns, and
 * inverted order in There is / There are sentences and questions.
 *
 * NOTE FOR FUTURE AUTHORS: every ungrammatical example in this file is
 * explicitly labeled WRONG, with the CORRECT version beside it. A tutor reads
 * these aloud, and an unlabeled bad example would be handed to the student as
 * a model sentence. Never write a broken example bare.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7ELA_U5_SUBJECT_VERB_AGREEMENT: LessonPlan = {
  id: 'evelyn.ms.m7ela.subject-verb-agreement.v1',
  title: 'Subject-Verb Agreement',
  curriculum: 'MS',
  grade: '7',
  subject: 'ela',
  topic: 'grade-7-ela',
  locale: 'en',
  los: [
    {
      id: 'm7ela.subject-verb-agreement',
      standard: 'M7ELA-5.2',
      description:
        'Match every verb to its true subject, seeing past interrupting prepositional phrases, compound subjects joined by and or by or and nor, indefinite pronouns, collective nouns, and inverted word order (CCSS L.7.1).',
    },
  ],
  prerequisites: ['m7ela.parts-of-speech'],
  followUps: ['m7ela.pronouns-and-antecedents'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the verb matches one specific word, and that English hides that word on purpose.',
      script:
        'You text your team about the game on Saturday. WRONG: "The box of jerseys are in the gym." Somebody types back a single letter and a star. You read it again and you cannot see anything wrong, because "jerseys are" sounds completely normal out loud. Here is the trick English is playing on you. The verb is not matching jerseys. It is matching box, and there is only one box. CORRECT: "The box of jerseys is in the gym." The base rule takes ten seconds to learn. The whole lesson is about the five places English hides the word your verb is supposed to match.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-match-the-true-subject',
      kind: 'concept',
      goal: 'Install the find-the-true-subject routine, then walk the five situations that break the base rule.',
      keyIdeas: [
        'THE BASE RULE, AND THE -s SURPRISE. One subject takes a verb with -s on it. More than one takes the verb with no -s. CORRECT: "My sister walks to school." CORRECT: "My sisters walk to school." Notice that verbs work backward from nouns: on a noun, -s means more than one, but on a present-tense verb, -s means exactly one. The subjects I and you are the exceptions, and they always take the plain form: "I walk", "you walk".',
        'THE ROUTINE IS TWO STEPS. Find the verb, then ask who or what is doing it. That word is the true subject, and the verb matches THAT word, never whatever noun happens to be sitting closest.',
        'CROSS OUT THE PHRASE IN BETWEEN. A prepositional phrase such as of markers, in the boxes, on the shelves, or with my friends often lands between the subject and the verb, and it never changes the number. WRONG: "The box of markers are on the shelf." CORRECT: "The box of markers is on the shelf." Cross out "of markers" and the subject stands alone: one box, one verb with -s.',
        'AND MAKES PLURAL, BUT OR AND NOR PICK THE NEARER ONE. Two subjects joined by and are plural. CORRECT: "My brother and I walk the dog." Joined by or or nor, the verb matches whichever subject is NEARER to it. CORRECT: "Neither my brothers nor my mom knows the password." Flip the two subjects and the verb flips too. CORRECT: "Neither my mom nor my brothers know the password." Both of those are right, because the verb is looking at the subject beside it.',
        'INDEFINITE PRONOUNS ARE SINGULAR EVEN WHEN THEY SOUND LIKE A CROWD. Everyone, everybody, each, either, neither, nobody, somebody and anyone all take a singular verb. CORRECT: "Everybody brings a snack on field day." Everybody sounds like thirty people, but grammatically it is one. A phrase after it does not change that. CORRECT: "Each of the players brings a water bottle."',
        'COLLECTIVE NOUNS AND INVERTED ORDER. A collective noun such as team, class, family, band or crowd names one group, and in US English it usually takes a singular verb. CORRECT: "The team practices on Tuesdays." In an inverted sentence the subject comes AFTER the verb, so find it before you choose. The word There is only a placeholder and is never the subject. WRONG: "There is three reasons to move game night." CORRECT: "There are three reasons to move game night." Questions invert too. CORRECT: "Where are your cleats?"',
      ],
      vocabulary: [
        { term: 'subject', definition: 'the word that tells you who or what the sentence is about, found by asking who or what is doing the verb.' },
        { term: 'true subject', definition: 'the word the verb actually has to match, which is often not the noun sitting closest to the verb.' },
        { term: 'prepositional phrase', definition: 'a small phrase such as of markers or in the gym that describes another word and never controls the verb.' },
        { term: 'indefinite pronoun', definition: 'a pronoun such as everybody, each or nobody that does not name a specific person; these take singular verbs.' },
        { term: 'collective noun', definition: 'a noun such as team, class or family that names one group made of several members.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cross-out-the-phrase',
      kind: 'worked_example',
      problem:
        'Choose the correct verb. "The bag of tennis balls (was / were) left by the back fence."',
      steps: [
        'Find the verb slot first. It is (was / were) left.',
        'Now ask who or what was left by the fence. One bag was left. The bag is the true subject.',
        'The words "of tennis balls" are a prepositional phrase describing the bag, so cross them out. What is left reads "The bag ... left by the back fence."',
        'The subject bag is singular, so it takes the singular verb. CORRECT: "The bag of tennis balls was left by the back fence."',
        'The other version is the trap. WRONG: "The bag of tennis balls were left by the back fence." It sounds right because "balls were" is sitting side by side in your ear, but balls is inside a crossed-out phrase and cannot control anything.',
        'Try the same routine on a sentence where the numbers are swapped. CORRECT: "The tennis balls in the bag were left by the back fence." Here the true subject really is balls, so the plural verb is the right one.',
      ],
      answer:
        'was — the true subject is the singular "bag", not "balls", which sits inside the prepositional phrase "of tennis balls".',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-inverted-order',
      kind: 'worked_example',
      problem:
        'A student writes: "There is four good reasons to hold the car wash on Saturday." It sounds fine out loud. Is it correct?',
      steps: [
        'This sentence is inverted, which means the subject comes after the verb instead of before it. The moment you see There is or There are, stop and look to the right of the verb.',
        'The word There is only a placeholder. It is holding the front of the sentence open, and it is never the subject.',
        'Ask what actually exists. Four good reasons exist. That is the true subject, and four reasons is plural.',
        'A plural subject takes the plural verb. WRONG: "There is four good reasons to hold the car wash on Saturday." CORRECT: "There are four good reasons to hold the car wash on Saturday."',
        'Check the rule in the other direction so you know it is about number and not about the word There. CORRECT: "There is one good reason to hold the car wash on Saturday." One reason is singular, so is fits.',
        'Questions are inverted the same way. Find the subject after the verb before you pick. WRONG: "Where is your cleats?" CORRECT: "Where are your cleats?" The subject is cleats, and it is plural.',
      ],
      answer:
        'No. The true subject "four good reasons" is plural and comes after the verb, so it must read "There are four good reasons to hold the car wash on Saturday."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-cross-out-the-phrase',
      kind: 'try_yourself',
      problem:
        'Which choice correctly completes the sentence? "The bowl of strawberries ___ on the top shelf of the fridge."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'sit' },
        { id: 'b', text: 'sits', correct: true },
        { id: 'c', text: 'are sitting' },
        { id: 'd', text: 'have been sitting' },
      ],
      expectedAnswer: 'sits',
      hints: [
        'Cross out the prepositional phrase "of strawberries". What single word is left as the subject?',
        'One bowl is doing the sitting, so the verb has to be singular. Remember that on a present-tense verb, the -s ending is the SINGULAR one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-indefinite-pronoun',
      kind: 'try_yourself',
      problem:
        'Which choice correctly completes the sentence? "Everybody on the two seventh-grade teams ___ a permission slip before the trip."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'need' },
        { id: 'b', text: 'are needing' },
        { id: 'c', text: 'needs', correct: true },
        { id: 'd', text: 'have needed' },
      ],
      expectedAnswer: 'needs',
      hints: [
        'The subject is Everybody. Two teams is inside a prepositional phrase, so cross it out and it cannot vote.',
        'Everybody sounds like a crowd, but indefinite pronouns such as everybody, everyone, each and nobody are grammatically singular.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-the-correct-one',
      kind: 'try_yourself',
      problem: 'Which sentence is written correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'There is four reasons why our class should get a pet lizard.' },
        { id: 'b', text: 'Neither the players nor the coach was upset about the rain.', correct: true },
        { id: 'c', text: 'My whole family are packing for the camping trip on Saturday.' },
        { id: 'd', text: 'The crate of soccer balls were left outside all weekend.' },
      ],
      expectedAnswer: 'Neither the players nor the coach was upset about the rain.',
      hints: [
        'Three of these break a rule from this lesson. Check each one for inverted order, a collective noun, and a prepositional phrase between the subject and the verb.',
        'With or and nor, the verb matches the NEARER subject. In option b the nearer subject is coach, which is singular.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-nearest-noun-and-the-s',
      kind: 'misconception_check',
      question:
        'A student will not change this sentence. WRONG: "The pack of markers belong to Ms. Reyes." She says, "Markers is more than one, and it is right next to the verb. Anyway, belongs has an -s on it, so belongs would be the plural one." What went wrong?',
      commonErrors: [
        {
          answer: 'The verb should match "markers", because "markers" is the closest word to the verb.',
          misconception:
            'Letting the nearest noun decide the verb instead of finding the true subject. English deliberately parks a noun of the wrong number right beside the verb, and the ear falls for it every time.',
          correctsTo:
            'Distance does not matter at all. The words "of markers" are a prepositional phrase, so cross them out and read what is left: "The pack ... to Ms. Reyes." One pack is doing the belonging, so the subject is the singular pack. CORRECT: "The pack of markers belongs to Ms. Reyes." If you really want a plural subject, move the noun out of the phrase. CORRECT: "The markers in the pack belong to Ms. Reyes."',
        },
        {
          answer: 'A verb that ends in -s is plural, so "belongs" cannot go with one pack.',
          misconception:
            'Carrying the noun rule over to verbs. On a noun, -s does mean more than one, so students assume it means the same thing on a verb. It means the opposite.',
          correctsTo:
            'On a present-tense verb, the -s ending marks the SINGULAR. CORRECT: "One marker rolls off the desk." CORRECT: "Two markers roll off the desk." The word with -s flips from the noun to the verb and back. So belongs is the singular verb, and it is the one that matches the singular subject pack.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two steps every time: find the verb, then ask who or what is doing it. The verb matches that word, not the nearest noun.',
        'On a present-tense verb, -s means ONE. "My sister walks." "My sisters walk."',
        'Cross out the prepositional phrase in between. WRONG: "The box of markers are on the shelf." CORRECT: "The box of markers is on the shelf."',
        'And makes a compound subject plural. Or and nor make the verb match the nearer subject: "Neither my brothers nor my mom knows the password."',
        'Everyone, everybody, each, nobody and somebody are singular, however big a crowd they sound like: "Everybody brings a snack."',
        'A collective noun such as team or family usually takes a singular verb in US English, and in an inverted sentence the subject comes after the verb. WRONG: "There is three reasons." CORRECT: "There are three reasons."',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'Subject-Verb Agreement' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
