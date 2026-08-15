/**
 * HS English — Grammar & Usage: Subject-Verb Agreement.
 *
 * The highest-frequency usage skill in real writing (CCSS L.9-10.1):
 * match the verb to the TRUE subject, seeing through interrupting
 * phrases, inverted order, indefinite pronouns, and compound subjects.
 * Every practice item is a revision-choice or error-spot MCQ.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ENGL_U1_SUBJECT_VERB_AGREEMENT: LessonPlan = {
  id: 'evelyn.hs.engl.subject-verb-agreement.v1',
  title: 'Subject-Verb Agreement',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'ela',
  topic: 'hs-english',
  locale: 'en',
  los: [
    {
      id: 'engl.subject-verb-agreement',
      standard: 'ENGL-1.2',
      description:
        'Match every verb to the number of its true grammatical subject, seeing through interrupting phrases, inverted word order, indefinite pronouns, and compound and collective subjects (CCSS L.9-10.1).',
    },
  ],
  prerequisites: ['engl.parts-of-speech'],
  followUps: ['engl.pronoun-agreement-clarity'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Agreement errors are the mistakes readers actually notice — frame the skill as protecting credibility in real writing.',
      script:
        'Picture the email you send with a scholarship application, or the caption a team account posts to two thousand followers. One slip like "the list of winners are posted" and some readers stop hearing your message and start grading your grammar. Subject-verb agreement is the single most common place that slip happens, because English loves to shove distracting words between the subject and its verb. Today you get a reliable two-step routine that works no matter how crowded the sentence gets.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-find-the-subject',
      kind: 'concept',
      goal: 'The find-the-true-subject routine and the five situations that fool writers.',
      keyIdeas: [
        'THE TWO-STEP ROUTINE — (1) find the verb, (2) ask "who or what actually does this?" That word is the TRUE subject, and the verb agrees with it — never with whatever noun happens to sit closest.',
        'INTERRUPTING PHRASES — prepositional phrases ("of the players", "in the boxes") and asides ("along with", "as well as", "including") sit between subject and verb but NEVER change the number: "The basket of apples sits on the counter." Cross the interrupters out and the subject stands alone.',
        'COMPOUND SUBJECTS — two subjects joined by "and" are plural ("Maya and Jordan run the club"). Joined by "or"/"nor", the verb agrees with the NEARER subject: "Neither the players nor the coach was ready." Flip the order and the verb flips: "Neither the coach nor the players were ready."',
        'INDEFINITE PRONOUNS — each, either, neither, everyone, everybody, nobody, anyone are SINGULAR even when an of-phrase follows: "Each of the drafts needs a title." Both, few, many, several are plural. Some, all, most, none take their number from the of-phrase noun.',
        'INVERTED ORDER — in sentences starting with "There is/There are" and in questions, the subject comes AFTER the verb. Find it before choosing: "There are a printer and two laptops in the lab" (subject = a printer and two laptops, plural).',
        'COLLECTIVE NOUNS — team, committee, class, band act as one unit and usually take a singular verb in American English: "The team practices at dawn." The members-acting-separately plural is rare in school writing — default to singular.',
      ],
      vocabulary: [
        { term: 'true subject', definition: 'the word that actually performs the verb, found by asking "who or what does this?" — not the nearest noun.' },
        { term: 'interrupting phrase', definition: 'a phrase (often prepositional) between subject and verb that does not affect the verb number.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-interrupter',
      kind: 'worked_example',
      problem:
        'Choose the correct verb: "The collection of vintage movie posters (was / were) sold at auction last spring."',
      steps: [
        'Find the verb slot: (was / were) sold.',
        'Ask who or what was sold as a whole: the COLLECTION. "Of vintage movie posters" is a prepositional phrase describing the collection — cross it out.',
        'With the interrupter gone the sentence reads "The collection ... sold at auction." The subject "collection" is singular.',
        'Singular subject takes the singular verb: "The collection of vintage movie posters WAS sold at auction last spring." The nearby plural "posters" was bait.',
      ],
      answer: 'was — the true subject is the singular "collection", not "posters"',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-nearest-noun-trap',
      kind: 'worked_example',
      problem:
        'A student writes: "There is a notebook and two chargers in my backpack." It sounds fine aloud. Is it correct?',
      steps: [
        'This sentence is INVERTED: it opens with "There is", so the subject comes after the verb. Never trust your ear on inverted sentences — find the subject first.',
        'Ask what exists in the backpack: "a notebook AND two chargers" — a compound subject joined by "and", which makes it plural.',
        'A plural subject needs the plural verb: "There ARE a notebook and two chargers in my backpack."',
        'Why the ear fails: the singular "a notebook" sits right next to the verb, so "is" sounds natural. The routine — find the whole subject, then match — beats the ear every time.',
      ],
      answer:
        'No — the compound subject "a notebook and two chargers" is plural: "There are a notebook and two chargers in my backpack."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-interrupter',
      kind: 'try_yourself',
      problem:
        'Which choice correctly completes the sentence? "The stack of college brochures ___ on the kitchen table."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'sits', correct: true },
        { id: 'b', text: 'sit' },
        { id: 'c', text: 'are sitting' },
        { id: 'd', text: 'have sat' },
      ],
      expectedAnswer: 'sits',
      hints: [
        'Cross out the prepositional phrase "of college brochures" — what is left as the subject?',
        'The subject is the singular "stack", so the verb must be singular.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-indefinite',
      kind: 'try_yourself',
      problem:
        'Which choice correctly completes the sentence? "Neither of the essay drafts ___ a strong opening paragraph."',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'have' },
        { id: 'b', text: 'has', correct: true },
        { id: 'c', text: 'were given' },
        { id: 'd', text: 'are showing' },
      ],
      expectedAnswer: 'has',
      hints: [
        '"Neither" is an indefinite pronoun — is it singular or plural? The of-phrase does not decide.',
        'Neither, either, and each are always singular: "Neither ... has."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spot-correct',
      kind: 'try_yourself',
      problem: 'Which sentence is grammatically correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The debate team, along with its two coaches, travels to the state final on Friday.', correct: true },
        { id: 'b', text: 'The debate team, along with its two coaches, travel to the state final on Friday.' },
        { id: 'c', text: 'There is three buses reserved for the trip.' },
        { id: 'd', text: 'Each of the buses have a designated chaperone.' },
      ],
      expectedAnswer: 'The debate team, along with its two coaches, travels to the state final on Friday.',
      hints: [
        '"Along with" is an interrupter — it does not make the subject plural. Check the other options for inverted-order and indefinite-pronoun errors.',
        'Subject = the collective "team" (singular): "travels". The others fail: "there is three buses" and "each ... have".',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-nearest-noun',
      kind: 'misconception_check',
      question:
        'A student writes "The box of trophies were moved to the gym" and defends it: "trophies is plural, and it is right next to the verb." What went wrong?',
      commonErrors: [
        {
          answer: 'The verb should agree with "trophies" because it is closest to the verb',
          misconception: 'Matching the verb to the nearest noun instead of the true subject.',
          correctsTo:
            'Proximity is irrelevant — "of trophies" is an interrupting prepositional phrase. The true subject is the singular "box": "The box of trophies WAS moved to the gym."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two-step routine: find the verb, then ask "who or what does this?" — the verb agrees with that true subject.',
        'Interrupting phrases (of-phrases, "along with", "as well as") never change the subject number.',
        '"And" makes compounds plural; "or"/"nor" agree with the nearer subject; each/neither/everyone are singular.',
        'In "There is/are" sentences and questions, the subject comes AFTER the verb — find it before you match.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'Subject-Verb Agreement' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
