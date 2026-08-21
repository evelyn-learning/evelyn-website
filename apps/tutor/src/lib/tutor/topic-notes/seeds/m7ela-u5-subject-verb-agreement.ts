/**
 * Grade 7 English Language Arts — Unit 5 CED 5.2: Subject-Verb Agreement.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7ela.subject-verb-agreement.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7ELA_U5_SUBJECT_VERB_AGREEMENT: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7ela.subject-verb-agreement.v1',
  course: 'Grade 7 English Language Arts',
  cedUnit: 5,
  cedTopic: '5.2',
  cedTitle: 'Subject-Verb Agreement',
  planId: 'evelyn.ms.m7ela.subject-verb-agreement.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-20',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7ela.subject-verb-agreement.v1' }],
  theory: [
    { loId: 'm7ela.subject-verb-agreement', content: `THE BASE RULE, AND THE -s SURPRISE. One subject takes a verb with -s on it. More than one takes the verb with no -s. CORRECT: "My sister walks to school." CORRECT: "My sisters walk to school." Notice that verbs work backward from nouns: on a noun, -s means more than one, but on a present-tense verb, -s means exactly one. The subjects I and you are the exceptions, and they always take the plain form: "I walk", "you walk".` },
    { loId: 'm7ela.subject-verb-agreement', content: `THE ROUTINE IS TWO STEPS. Find the verb, then ask who or what is doing it. That word is the true subject, and the verb matches THAT word, never whatever noun happens to be sitting closest.` },
    { loId: 'm7ela.subject-verb-agreement', content: `CROSS OUT THE PHRASE IN BETWEEN. A prepositional phrase such as of markers, in the boxes, on the shelves, or with my friends often lands between the subject and the verb, and it never changes the number. WRONG: "The box of markers are on the shelf." CORRECT: "The box of markers is on the shelf." Cross out "of markers" and the subject stands alone: one box, one verb with -s.` },
    { loId: 'm7ela.subject-verb-agreement', content: `AND MAKES PLURAL, BUT OR AND NOR PICK THE NEARER ONE. Two subjects joined by and are plural. CORRECT: "My brother and I walk the dog." Joined by or or nor, the verb matches whichever subject is NEARER to it. CORRECT: "Neither my brothers nor my mom knows the password." Flip the two subjects and the verb flips too. CORRECT: "Neither my mom nor my brothers know the password." Both of those are right, because the verb is looking at the subject beside it.` },
    { loId: 'm7ela.subject-verb-agreement', content: `INDEFINITE PRONOUNS ARE SINGULAR EVEN WHEN THEY SOUND LIKE A CROWD. Everyone, everybody, each, either, neither, nobody, somebody and anyone all take a singular verb. CORRECT: "Everybody brings a snack on field day." Everybody sounds like thirty people, but grammatically it is one. A phrase after it does not change that. CORRECT: "Each of the players brings a water bottle."` },
    { loId: 'm7ela.subject-verb-agreement', content: `COLLECTIVE NOUNS AND INVERTED ORDER. A collective noun such as team, class, family, band or crowd names one group, and in US English it usually takes a singular verb. CORRECT: "The team practices on Tuesdays." In an inverted sentence the subject comes AFTER the verb, so find it before you choose. The word There is only a placeholder and is never the subject. WRONG: "There is three reasons to move game night." CORRECT: "There are three reasons to move game night." Questions invert too. CORRECT: "Where are your cleats?"` },
    { loId: 'm7ela.subject-verb-agreement', kind: 'definition', title: 'subject', content: `the word that tells you who or what the sentence is about, found by asking who or what is doing the verb.` },
    { loId: 'm7ela.subject-verb-agreement', kind: 'definition', title: 'true subject', content: `the word the verb actually has to match, which is often not the noun sitting closest to the verb.` },
    { loId: 'm7ela.subject-verb-agreement', kind: 'definition', title: 'prepositional phrase', content: `a small phrase such as of markers or in the gym that describes another word and never controls the verb.` },
    { loId: 'm7ela.subject-verb-agreement', kind: 'definition', title: 'indefinite pronoun', content: `a pronoun such as everybody, each or nobody that does not name a specific person; these take singular verbs.` },
    { loId: 'm7ela.subject-verb-agreement', kind: 'definition', title: 'collective noun', content: `a noun such as team, class or family that names one group made of several members.` },
  ],
  methods: [
    {
      title: 'Worked cross out the phrase',
      steps: [
        'Find the verb slot first. It is (was / were) left.',
        `Now ask who or what was left by the fence. One bag was left. The bag is the true subject.`,
        `The words "of tennis balls" are a prepositional phrase describing the bag, so cross them out. What is left reads "The bag ... left by the back fence."`,
        `The subject bag is singular, so it takes the singular verb. CORRECT: "The bag of tennis balls was left by the back fence."`,
        `The other version is the trap. WRONG: "The bag of tennis balls were left by the back fence." It sounds right because "balls were" is sitting side by side in your ear, but balls is inside a crossed-out phrase and cannot control anything.`,
        `Try the same routine on a sentence where the numbers are swapped. CORRECT: "The tennis balls in the bag were left by the back fence." Here the true subject really is balls, so the plural verb is the right one.`,
      ],
      example: { problem: `Choose the correct verb. "The bag of tennis balls (was / were) left by the back fence."`, solution: `was — the true subject is the singular "bag", not "balls", which sits inside the prepositional phrase "of tennis balls".` },
      relatedLoIds: ['m7ela.subject-verb-agreement'],
    },
    {
      title: 'Worked inverted order',
      steps: [
        `This sentence is inverted, which means the subject comes after the verb instead of before it. The moment you see There is or There are, stop and look to the right of the verb.`,
        `The word There is only a placeholder. It is holding the front of the sentence open, and it is never the subject.`,
        `Ask what actually exists. Four good reasons exist. That is the true subject, and four reasons is plural.`,
        `A plural subject takes the plural verb. WRONG: "There is four good reasons to hold the car wash on Saturday." CORRECT: "There are four good reasons to hold the car wash on Saturday."`,
        `Check the rule in the other direction so you know it is about number and not about the word There. CORRECT: "There is one good reason to hold the car wash on Saturday." One reason is singular, so is fits.`,
        `Questions are inverted the same way. Find the subject after the verb before you pick. WRONG: "Where is your cleats?" CORRECT: "Where are your cleats?" The subject is cleats, and it is plural.`,
      ],
      example: { problem: `A student writes: "There is four good reasons to hold the car wash on Saturday." It sounds fine out loud. Is it correct?`, solution: `No. The true subject "four good reasons" is plural and comes after the verb, so it must read "There are four good reasons to hold the car wash on Saturday."` },
      relatedLoIds: ['m7ela.subject-verb-agreement'],
    },
  ],
  pointers: [
    { content: `Students often say "The verb should match "markers", because "markers" is the closest word to the verb." — Distance does not matter at all. The words "of markers" are a prepositional phrase, so cross them out and read what is left: "The pack ... to Ms. Reyes." One pack is doing the belonging, so the subject is the singular pack. CORRECT: "The pack of markers belongs to Ms. Reyes." If you really want a plural subject, move the noun out of the phrase. CORRECT: "The markers in the pack belong to Ms. Reyes."`, kind: 'common-error' },
    { content: `Students often say "A verb that ends in -s is plural, so "belongs" cannot go with one pack." — On a present-tense verb, the -s ending marks the SINGULAR. CORRECT: "One marker rolls off the desk." CORRECT: "Two markers roll off the desk." The word with -s flips from the noun to the verb and back. So belongs is the singular verb, and it is the one that matches the singular subject pack.`, kind: 'common-error' },
    { content: `Two steps every time: find the verb, then ask who or what is doing it. The verb matches that word, not the nearest noun.`, kind: 'tip' },
    { content: 'On a present-tense verb, -s means ONE. "My sister walks." "My sisters walk."', kind: 'tip' },
    { content: `Cross out the prepositional phrase in between. WRONG: "The box of markers are on the shelf." CORRECT: "The box of markers is on the shelf."`, kind: 'tip' },
    { content: `And makes a compound subject plural. Or and nor make the verb match the nearer subject: "Neither my brothers nor my mom knows the password."`, kind: 'tip' },
    { content: `Everyone, everybody, each, nobody and somebody are singular, however big a crowd they sound like: "Everybody brings a snack."`, kind: 'tip' },
    { content: `A collective noun such as team or family usually takes a singular verb in US English, and in an inverted sentence the subject comes after the verb. WRONG: "There is three reasons." CORRECT: "There are three reasons."`, kind: 'tip' },
    { content: `Don't carry the noun rule over to verbs. On a noun, **-s = more than one**; on a present-tense verb, **-s = exactly one**. "One marker rolls." "Two markers roll." If you catch yourself calling *belongs* the plural form, flip your thinking.`, kind: 'common-error' },
    { content: `Your ear is not the judge here. "The bag of tennis balls were..." sounds fine because *balls were* sit side by side. Cross out the prepositional phrase (*of tennis balls*) with your pencil before you choose the verb.`, kind: 'tip' },
    { content: `*And* and *or* do NOT work the same way. **And** = plural, always. **Or / nor** = match the nearer subject. "Neither the players nor the coach **was** upset." Flip the order and the verb flips too: "Neither the coach nor the players **were** upset."`, kind: 'gotcha' },
    { content: `*Everybody, everyone, each, nobody, either, neither* are **indefinite pronouns** — singular, no matter how big the crowd sounds. "Each of the players **brings** a bottle." The phrase after them (*of the players*) never changes the verb.`, kind: 'vocab-note' },
    { content: `*There* is never the subject — it's just a placeholder holding the front of the sentence open. When you see *There is / There are*, look to the RIGHT of the verb for the true subject. "There **are** four reasons." "There **is** one reason."`, kind: 'gotcha' },
    { content: `Questions are inverted too. "Where **are** your cleats?" not "Where is your cleats?" Before you pick the verb, turn the question into a statement in your head: "Your cleats are ___." Then the subject is easy to see.`, kind: 'edge-case' },
    { content: `A **collective noun** (*team, class, family, band, crowd*) names one group, so it usually takes a singular verb in US English: "The team **practices** Tuesdays." But *team members* and *players* are plural nouns: "The team members **practice** Tuesdays."`, kind: 'vocab-note' },
    { content: `*I* and *you* break the -s pattern. Never write "I walks" or "you walks" — those subjects always take the plain form, even though they're only one person.`, kind: 'edge-case' },
  ],
};
