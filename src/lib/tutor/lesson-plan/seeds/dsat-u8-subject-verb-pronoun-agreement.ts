/**
 * Digital SAT — Reading & Writing: Subject-Verb & Pronoun Agreement.
 *
 * Standard English Conventions on the current digital SAT. The recurring
 * trap: a long prepositional phrase (or a list inside one) sits between the
 * true subject/antecedent and the verb/pronoun, and the SAT baits students
 * into agreeing with the nearest noun instead of the real one. Also covers
 * indefinite pronouns and collective nouns, which are singular even when
 * they're "about" something plural.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U8_SUBJECT_VERB_PRONOUN_AGREEMENT: LessonPlan = {
  id: 'evelyn.testprep.dsat.subject-verb-pronoun-agreement.v1',
  title: 'Subject-Verb & Pronoun Agreement',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.subject-verb-pronoun-agreement',
      standard: 'DSAT-8.2',
      description:
        'Identify the true subject or antecedent of a sentence — stripping intervening prepositional phrases, lists, and clauses — and select the verb or pronoun that agrees with it in number.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame agreement errors as a high-frequency, high-speed win within Standard English Conventions.',
      script:
        'Standard English Conventions make up roughly a quarter of the Reading and Writing section — about 13 to 15 of the 54 questions. Agreement is the single most recurring trap inside that domain: the SAT loves to bury the real subject behind a long prepositional phrase, like "The collection of rare manuscripts... was" — and dares you to agree with the wrong noun. Spot the trap and these become some of the fastest points on the test.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-traps',
      kind: 'concept',
      goal: 'Core agreement rule plus the recurring SAT traps: prepositional-phrase interrupters, indefinite pronouns, collective nouns, compound subjects, and inverted sentences.',
      keyIdeas: [
        'CORE RULE — a verb must agree with its SUBJECT in number, and a pronoun must agree with its ANTECEDENT in number. Singular pairs with singular; plural pairs with plural.',
        'TRAP 1 — THE PREPOSITIONAL-PHRASE INTERRUPTER. "The collection of rare manuscripts... was damaged." The subject is "collection" (singular) — "of rare manuscripts" is a prepositional phrase that can never contain the subject. STRIP any phrase starting with a preposition (of, in, with, for, among, between...) before choosing the verb.',
        'The strip trick cuts both ways — sometimes the real subject IS plural even though it looks buried: "The results of the study were published" — "results" is plural, so "were" is correct even after stripping "of the study."',
        'TRAP 2 — INDEFINITE PRONOUNS. Each, everyone, everybody, someone, somebody, no one, nobody, either, neither, anyone, anybody = ALWAYS singular, no matter what plural noun follows in a prepositional phrase. "Each of the applicants WAS asked..." not "were."',
        'TRAP 3 — COLLECTIVE NOUNS. Team, committee, family, jury, group, class = singular when acting as ONE unit — pair with singular verbs and singular pronouns ("its," not "their"). "The committee announced that ITS decision..."',
        'TRAP 4 — COMPOUND SUBJECTS. Joined by AND = plural ("The teacher and the students ARE..."). Joined by OR / NOR (either...or, neither...nor) = the verb agrees with the CLOSER subject: "Neither the coach nor the players WERE ready."',
        'TRAP 5 — INVERTED SENTENCES. When a sentence opens with "there is/are," "here is/are," or a question, the subject follows the verb. Find it before matching: "There ARE several reasons..." — subject is "reasons" (plural).',
        'PRONOUN-ANTECEDENT is the same trap wearing a different hat: find the true antecedent (often a singular noun modified by a plural-sounding prepositional phrase or list), then match the pronoun to IT, not to the nearest noun.',
      ],
      vocabulary: [
        { term: 'antecedent', definition: 'the noun a pronoun refers back to and must agree with in number.' },
        { term: 'prepositional phrase', definition: 'a phrase starting with a preposition (of, in, with, for...) that modifies a noun but is never the subject itself.' },
        { term: 'indefinite pronoun', definition: 'a pronoun like each, everyone, or either that doesn\'t name a specific person or thing and is always singular.' },
        { term: 'collective noun', definition: 'a singular noun (team, committee, family) that names a group acting as one unit.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-prep-phrase',
      kind: 'worked_example',
      problem:
        'Which choice completes the text so that it conforms to the conventions of Standard English?\n"The collection of rare manuscripts in the university\'s archive ___ carefully preserved."\n(A) was  (B) were  (C) have been  (D) are',
      steps: [
        'Locate the blank\'s job: it needs a verb that agrees with the sentence\'s true subject.',
        'Strip the prepositional phrases: "of rare manuscripts" and "in the university\'s archive" both modify — but can\'t be — the subject.',
        'What remains: "The collection... ___ carefully preserved." The subject is "collection," which is singular.',
        'Singular subject needs a singular verb: "was." (B), (C), and (D) all wrongly agree with the plural noun "manuscripts" sitting closest to the blank.',
      ],
      answer: '(A) was',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pronoun-antecedent',
      kind: 'worked_example',
      problem:
        'Which choice completes the text with the most logical pronoun?\n"The novel\'s exploration of grief, memory, and family loyalty makes ___ a favorite among readers of literary fiction."\n(A) it  (B) them  (C) they  (D) these',
      steps: [
        'Find the antecedent the pronoun must match — not just the nearest noun.',
        'The list "grief, memory, and family loyalty" sits inside a prepositional phrase ("of grief, memory, and family loyalty") modifying "exploration" — that list can\'t be the antecedent.',
        'The true antecedent is "The novel\'s exploration," which is singular.',
        'A singular antecedent needs a singular pronoun: "it." (B), (C), and (D) all incorrectly agree with the plural list instead.',
      ],
      answer: '(A) it',
      estimatedMinutes: 3,
    },
    {
      id: 'try-results',
      kind: 'try_yourself',
      problem:
        'Which choice completes the text so that it conforms to the conventions of Standard English?\n"The results of the study ___ published in a peer-reviewed journal next month."\n(A) was  (B) were  (C) is  (D) has been',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'was' },
        { id: 'b', text: 'were', correct: true },
        { id: 'c', text: 'is' },
        { id: 'd', text: 'has been' },
      ],
      expectedAnswer: 'were',
      hints: [
        'Strip the prepositional phrase "of the study" — what noun is actually the subject?',
        '"Results" is a plural noun, so it needs a plural verb: "were."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-each',
      kind: 'try_yourself',
      problem:
        'Which choice completes the text so that it conforms to the conventions of Standard English?\n"Each of the applicants ___ asked to submit a writing sample."\n(A) were  (B) have  (C) was  (D) are',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'were' },
        { id: 'b', text: 'have' },
        { id: 'c', text: 'was', correct: true },
        { id: 'd', text: 'are' },
      ],
      expectedAnswer: 'was',
      hints: [
        '"Each" is an indefinite pronoun — indefinite pronouns (each, everyone, either) are always singular.',
        'Ignore "of the applicants"; the subject is "each," so the verb must be singular: "was."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-committee',
      kind: 'try_yourself',
      problem:
        'Which choice completes the text with the most logical pronoun?\n"The committee announced that ___ decision would be finalized after a final vote."\n(A) their  (B) its  (C) his  (D) they\'re',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'their' },
        { id: 'b', text: 'its', correct: true },
        { id: 'c', text: 'his' },
        { id: 'd', text: "they're" },
      ],
      expectedAnswer: 'its',
      hints: [
        '"Committee" is a collective noun acting as a single unit in this sentence.',
        'A singular antecedent needs a singular pronoun — "its," not "their."',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-nearest-noun',
      kind: 'misconception_check',
      question:
        'A student completes "The set of instructions provided in the manual ___ difficult to follow" by choosing "were." What went wrong?',
      commonErrors: [
        {
          answer: 'were',
          misconception:
            'Matching the verb to "instructions" — the nearest plural noun, buried inside the prepositional phrases — instead of finding the true subject.',
          correctsTo:
            'Strip "of instructions" and "provided in the manual": the true subject is "set" (singular). Correct sentence: "The set of instructions provided in the manual was difficult to follow."',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Strip prepositional phrases and lists to find the TRUE subject or antecedent before checking agreement.',
        'Indefinite pronouns (each, everyone, either, neither) and collective nouns (team, committee) are singular — even next to a plural-sounding phrase.',
        'Compound subjects with "and" are plural; with "or/nor," the verb matches the closer subject.',
        'A pronoun must match its true antecedent\'s number, not whichever noun sits closest to it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'Subject-Verb & Pronoun Agreement' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
