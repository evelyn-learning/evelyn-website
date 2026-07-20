/**
 * ACT — English / Subject-Verb & Pronoun Agreement.
 *
 * Agreement questions are among the highest-yield rules on ACT English:
 * find the sentence's TRUE subject (or a pronoun's TRUE antecedent) by
 * stripping intervening phrases, then match number. Passage excerpts are
 * original; the tested portion is marked in quotes. All stimuli original.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U1_AGREEMENT: LessonPlan = {
  id: 'evelyn.testprep.act.agreement.v1',
  title: 'Subject-Verb & Pronoun Agreement',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.agreement',
      standard: 'ACT-1.3',
      description:
        "Find a sentence's true subject or a pronoun's true antecedent — stripping intervening phrases that disguise it — and choose the verb or pronoun form that agrees with it in number.",
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe agreement as one of the highest-yield, most mechanical rules on ACT English.',
      script:
        "The ACT gives you 75 English questions in 45 minutes across five passages — about 9 minutes per passage, 36 seconds per question. Subject-verb and pronoun agreement together account for roughly 6 to 8 of those questions on a typical test, more than almost any other single rule. Best part: you rarely need to know a grammar term. You just find the real subject or the real antecedent and match it in number.",
      estimatedMinutes: 1,
    },
    {
      id: 'concept-agreement',
      kind: 'concept',
      goal: 'The find-the-real-subject method and the traps the ACT builds around it.',
      keyIdeas: [
        'FIND THE TRUE SUBJECT FIRST. Cross out prepositional phrases ("of the trophies," "along the wall") and participial phrases ("showing the trails") — the verb must agree with what is left, not with the closest noun.',
        'AND vs OR/NOR. Subjects joined by "and" are plural ("Marcus and Priya were..."). Subjects joined by "or"/"nor" agree with the NEARER subject ("Either the coach or the players were...").',
        'INDEFINITE PRONOUNS ARE SINGULAR. Everybody, everyone, someone, no one, each, neither, and either are always singular, even when they describe a crowd.',
        'COLLECTIVE / ENTITY NOUNS ARE SINGULAR. A team, a company, a bakery, a committee acts as ONE unit — pair it with "is/has/its," not "are/have/their," unless members are described acting individually.',
        'PRONOUNS NEED ONE CLEAR ANTECEDENT. If a pronoun could point to two different nouns ("Marcus told Coach Alvarez that he..."), the ACT flags it — swap in the specific noun instead.',
        'TRAP: THE INTERVENING NOUN. The ACT loves burying a plural noun right before a singular verb (or vice versa) inside a modifying phrase — that nearby noun is bait, not the subject.',
        'NO CHANGE IS A REAL ANSWER. If the sentence is already correct, do not force an edit — roughly a quarter of ACT English answers are NO CHANGE.',
      ],
      vocabulary: [
        { term: 'antecedent', definition: 'the noun a pronoun refers back to.' },
        {
          term: 'indefinite pronoun',
          definition: "a pronoun like everyone, each, or neither that doesn't name a specific person but is grammatically singular.",
        },
        { term: 'collective noun', definition: 'a singular noun that names a group acting as one unit (team, company, family).' },
        {
          term: 'intervening phrase',
          definition: 'a prepositional or participial phrase sitting between the subject and verb that can disguise the true subject.',
        },
      ],
      suggestedTools: ['show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-true-subject',
      kind: 'worked_example',
      problem:
        'From an essay about a debate team: "The row of trophies along the back wall \'GLEAM\' under the classroom lights every afternoon." Is "GLEAM" the correct verb, and if not, what should replace it?',
      steps: [
        'Strip the intervening phrases: "of trophies" and "along the back wall" are prepositional phrases, not the subject.',
        'What is left is "row" — singular.',
        'A singular subject needs a singular verb: "GLEAM" (plural form, no -s) is wrong.',
        'Trap check: "trophies" sits right before the verb and is plural, which lures the eye — but it lives inside a prepositional phrase and can never be the subject.',
      ],
      answer: 'GLEAMS — the subject is the singular "row," not the plural "trophies."',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-entity-pronoun',
      kind: 'worked_example',
      problem:
        'From an essay about a family bakery: "The bakery has built \'their\' reputation on Saturday-morning cinnamon rolls that sell out by nine o\'clock." Is "their" correct, or does the pronoun need to change?',
      steps: [
        'Find the antecedent: "their" is supposed to point back to "the bakery."',
        '"Bakery" names a single business — grammatically singular, even though people run it.',
        'A singular antecedent needs a singular possessive pronoun: "its," not "their."',
        'Trap check: because a bakery is made of people, "their" feels natural in speech — but the noun itself is singular.',
      ],
      answer: 'ITS — the bakery, a singular entity, needs the singular possessive "its," not "their."',
      estimatedMinutes: 3,
    },
    {
      id: 'try-prepositional-phrase',
      kind: 'try_yourself',
      problem:
        'From an essay about a hiking club: "The map showing the trails \'is\' tucked inside a plastic sleeve to keep it dry." Which choice best replaces "is"?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE', correct: true },
        { id: 'b', text: 'are' },
        { id: 'c', text: 'were' },
        { id: 'd', text: 'have been' },
      ],
      expectedAnswer: 'NO CHANGE',
      hints: [
        'Strip the participial phrase "showing the trails" to find the true subject.',
        'The subject is "map" — singular — so "is" already agrees. Do not fix what isn\'t broken.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-or-nearer-subject',
      kind: 'try_yourself',
      problem:
        'From the same hiking essay: "Either the trail guide or the two assistant leaders \'carries\' extra water for the group." Which choice is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE' },
        { id: 'b', text: 'carry', correct: true },
        { id: 'c', text: 'have carried' },
        { id: 'd', text: 'is carrying' },
      ],
      expectedAnswer: 'carry',
      hints: [
        'With "either...or," the verb agrees with the NEARER subject, not the first one.',
        'The nearer subject is "the two assistant leaders" — plural — so the verb must be plural: "carry."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-ambiguous-antecedent',
      kind: 'try_yourself',
      problem:
        'From an essay about two coaches: "After Coach Reyes spoke with Coach Patel about the schedule, \'she\' agreed to move practice to Tuesday." The pronoun "she" is ambiguous. Which revision fixes the problem?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'NO CHANGE' },
        { id: 'b', text: 'Coach Patel agreed to move practice to Tuesday', correct: true },
        { id: 'c', text: 'her colleague agreed to move practice to Tuesday' },
        { id: 'd', text: 'they agreed to move practice to Tuesday' },
      ],
      expectedAnswer: 'Coach Patel agreed to move practice to Tuesday',
      hints: [
        'Both "Coach Reyes" and "Coach Patel" are women the pronoun could refer to — that\'s the ambiguity.',
        'The fix names the specific person. "Her colleague" is still vague, and "they" is the wrong number for one person.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-indefinite-plural-feel',
      kind: 'misconception_check',
      question: 'A student writes "Everybody in the office are working late tonight." What went wrong, and how should it read?',
      commonErrors: [
        {
          answer: 'are working',
          misconception:
            'Indefinite pronouns like "everybody," "everyone," "someone," and "each" feel like they mean a group of people, so students default to a plural verb.',
          correctsTo:
            'These indefinite pronouns are grammatically singular no matter how many people they describe. The sentence should read "Everybody in the office IS working late tonight."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Strip prepositional and participial phrases to find the sentence's TRUE subject before choosing a verb.",
        'Compound subjects joined by "or"/"nor" agree with the NEARER noun; joined by "and" they are plural.',
        'Indefinite pronouns (everybody, everyone, each, neither) and singular entities (a bakery, a company) take singular verbs and singular pronouns ("its," not "their").',
        'A pronoun needs exactly ONE clear antecedent — if two nouns could be "he/she/it," name the specific noun instead.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'Subject-Verb & Pronoun Agreement' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
