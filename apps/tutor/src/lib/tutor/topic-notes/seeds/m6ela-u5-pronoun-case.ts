/**
 * Grade 6 English Language Arts — Unit 5 CED 5.1: Pronoun Case.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6ela.pronoun-case.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6ELA_U5_PRONOUN_CASE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6ela.pronoun-case.v1',
  course: 'Grade 6 English Language Arts',
  cedUnit: 5,
  cedTopic: '5.1',
  cedTitle: 'Pronoun Case',
  planId: 'evelyn.ms.m6ela.pronoun-case.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6ela.pronoun-case.v1' }],
  theory: [
    { loId: 'm6ela.pronoun-case', content: `A PRONOUN STANDS IN FOR A NOUN, AND MOST PRONOUNS COME IN THREE SHAPES. Subject case: I, we, he, she, they, who. Object case: me, us, him, her, them, whom. Possessive case: my, our, his, her, their, and the standalone forms mine, ours, hers, theirs, whose. You and it look the same in the first two, which is why they never cause trouble.` },
    { loId: 'm6ela.pronoun-case', content: `THE JOB DECIDES THE SHAPE, NOT THE SOUND. Subject case does the verb: ask who or what is doing the action. "She fixed the chain." Object case receives the action: ask who or what the action lands on. "Coach picked her." Possessive case shows ownership. "That helmet is hers." Nothing about politeness or formality comes into it.` },
    { loId: 'm6ela.pronoun-case', content: `OBJECT CASE ALWAYS FOLLOWS A PREPOSITION. The prepositions you will meet most are to, for, with, at, from, after, before and between. Whatever sits right after one of them is in object case, every single time, with no exceptions. WRONG: "between you and I." CORRECT: "between you and me." WRONG: "a seat for Ellie and I." CORRECT: "a seat for Ellie and me."` },
    { loId: 'm6ela.pronoun-case', content: `THE DROP TEST IS THE WHOLE PROCEDURE. When a pronoun is stuck in a pair, cover the other name with your thumb and read the sentence with the pronoun alone. "Dev and me went to the park" becomes "me went to the park," which nobody says, so the answer is I. "Coach thanked Dev and I" becomes "Coach thanked I," which nobody says either, so the answer is me. The test takes five seconds and it never depends on how the sentence sounds.` },
    { loId: 'm6ela.pronoun-case', content: `POSSESSIVE PRONOUNS NEVER TAKE AN APOSTROPHE. Not one of them: its, hers, ours, yours, theirs, whose. An apostrophe on any of those is always an error. WRONG: "The dog chewed it's leash." CORRECT: "The dog chewed its leash." The word "it's" exists, but it is short for "it is," so read it that way to check: "The dog chewed it is leash" is not a sentence.` },
    { loId: 'm6ela.pronoun-case', content: `PUT YOURSELF LAST, AND DO NOT TRUST YOUR EAR. Write "Dev and I," not "I and Dev." And run the drop test even when the right answer feels stiff, because "and I" sounds careful and "and me" sounds casual, and neither feeling has anything to do with which one the sentence needs.` },
    { loId: 'm6ela.pronoun-case', kind: 'definition', title: 'pronoun', content: 'a word that stands in for a noun, such as she, them or ours.' },
    { loId: 'm6ela.pronoun-case', kind: 'definition', title: 'case', content: 'the shape a pronoun takes based on the job it is doing in the sentence.' },
    { loId: 'm6ela.pronoun-case', kind: 'definition', title: 'subject', content: 'the person or thing doing the verb. Subject case: I, we, he, she, they.' },
    { loId: 'm6ela.pronoun-case', kind: 'definition', title: 'object', content: `the person or thing that receives the action, or that follows a preposition. Object case: me, us, him, her, them.` },
    { loId: 'm6ela.pronoun-case', kind: 'definition', title: 'preposition', content: `a small position word such as to, for, with, from, after or between. Whatever follows one is in object case.` },
  ],
  methods: [
    {
      title: 'Worked drop test both jobs',
      steps: [
        `Work one blank at a time. Never decide both at once, because the two blanks are doing two different jobs even though the pair of words looks identical.`,
        `Blank one. Cover "Dev and" with your thumb and read what is left: "___ carried the cooler down to the field." Try both shapes. WRONG: "Me carried the cooler down to the field." CORRECT: "I carried the cooler down to the field."`,
        `Name the job so the answer is not just a feeling. This pronoun is doing the verb carried, which makes it the subject, and subjects take subject case. Blank one is I.`,
        `Blank two. Cover "Dev and" again: "Coach thanked ___ afterward." WRONG: "Coach thanked I afterward." CORRECT: "Coach thanked me afterward."`,
        `Name that job too. This pronoun receives the action of thanked, which makes it the object, and objects take object case. Blank two is me.`,
        `Notice what just happened. The exact same pair, "Dev and ___", needed I in one blank and me in the other. There is no pair that is always right. The job decides, every time, and that is why the test beats the ear.`,
        `Read the finished sentence back with both names in place: "Dev and I carried the cooler down to the field, and Coach thanked Dev and me afterward."`,
      ],
      example: { problem: `Choose the right pronoun for each blank, and say how you know.

"Dev and (I / me) carried the cooler down to the field, and Coach thanked Dev and (I / me) afterward."`, solution: `Dev and I carried the cooler down to the field, and Coach thanked Dev and me afterward. Blank one is the subject doing the verb carried, so it takes I. Blank two is the object of thanked, so it takes me.` },
      relatedLoIds: ['m6ela.pronoun-case'],
    },
    {
      title: 'Worked preposition and apostrophe',
      steps: [
        `Sentence 1. Find the preposition first, because that settles the case before you test anything: the word between. Whatever sits right after a preposition is in object case.`,
        `Confirm it with the drop test so the rule and the ear agree. Cover "Nadia and": WRONG: "between I." CORRECT: "between me."`,
        `CORRECT: "The teacher split the last two tickets between Nadia and me." The famous version of this same error is "between you and I," and it is wrong for exactly the same reason. Between is a preposition, so the words after it are objects, and no amount of sounding careful changes that.`,
        `Sentence 2. Ask what the word has to do. It stands in for the other person's bike, so it is showing ownership. That is possessive case, and the standalone possessive shape is theirs.`,
        `Now apply the apostrophe rule. Possessive pronouns never take one. WRONG: "their's." There is no such word in English.`,
        `CORRECT: "My bike is fine, but theirs is missing a pedal." Check the whole family while you are here: its, hers, ours, yours, theirs, whose. Not one of them takes an apostrophe, ever.`,
        `One extra check for the two that trip people up. "It's" is short for "it is" and "they're" is short for "they are," so read them the long way to test them. "It is leash" and "they are bikes" are not sentences, which tells you the possessive was wanted: its leash, their bikes.`,
      ],
      example: { problem: `Two sentences from a group chat need fixing. Repair each one and say which rule caught it.

Sentence 1: "The teacher split the last two tickets between Nadia and I."
Sentence 2: "My bike is fine, but their's is missing a pedal."`, solution: `Sentence 1: "The teacher split the last two tickets between Nadia and me." (Object case always follows the preposition between.) Sentence 2: "My bike is fine, but theirs is missing a pedal." (Possessive pronouns never take an apostrophe.)` },
      relatedLoIds: ['m6ela.pronoun-case'],
    },
  ],
  pointers: [
    { content: `Students often say "Please save a seat for Ellie and I." — Nothing about I is more polite than me. They are two shapes for two different jobs. Run the drop test: cover "Ellie and" and read the sentence alone. WRONG: "Please save a seat for I." CORRECT: "Please save a seat for me." The word for is a preposition, and object case always follows a preposition, so the sentence is "Please save a seat for Ellie and me." The student was right that "me and Ellie" is wrong as a subject, but the repair for that one is "Ellie and I went," not banning me from every sentence in the paragraph.`, kind: 'common-error' },
    { content: `Students often say "Use whichever one sounds better when you say it out loud." — The ear is the exact thing the drop test replaces. Cover the other name, read the pronoun alone, and let the sentence answer for you. "Me went" is not a sentence, so a subject takes I. "Coach picked I" is not a sentence, so an object takes me. Then name the job out loud — subject, object, or possessive — so you are checking a rule and not a feeling. The test takes five seconds and it gives the same answer no matter who is listening.`, kind: 'common-error' },
    { content: `Three shapes, and the job in the sentence picks the shape: subject (I, we, he, she, they), object (me, us, him, her, them), possessive (my, our, his, her, their, mine, ours, hers, theirs).`, kind: 'tip' },
    { content: `Subject case does the verb. Object case receives the action or follows a preposition.`, kind: 'tip' },
    { content: `Anything sitting right after to, for, with, from, after or between is object case. WRONG: "between you and I." CORRECT: "between you and me."`, kind: 'tip' },
    { content: `The drop test is the whole procedure: cover the other name and read the pronoun alone. "Me went to the park" is not a sentence, so the answer is I.`, kind: 'tip' },
    { content: `Possessive pronouns never take an apostrophe: its, hers, ours, yours, theirs, whose. WRONG: "The dog chewed it's leash." CORRECT: "The dog chewed its leash."`, kind: 'tip' },
    { content: `Sound is not evidence. Run the drop test and name the job, even when the right answer feels stiff.`, kind: 'tip' },
  ],
};
