/**
 * Grades 3-5 ELA — Subject-Verb Agreement.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_SUBJECT_VERB_AGREEMENT: LessonPlan = {
  id: 'evelyn.g35.ela.subject-verb-agreement.v1',
  title: 'Grades 3-5 ELA — Subject-Verb Agreement',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.subject-verb-agreement',
      description: 'Match singular subjects with singular verbs and plural subjects with plural verbs in standard English.',
      standard: 'CCSS.ELA-LITERACY.L.4.1.F',
    },
  ],
  prerequisites: ['g35.ela.editing-revision'],
  followUps: ['g35.ela.pronoun-usage'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Mismatched subjects and verbs are one of the most common writing errors — and easy to fix once you see the pattern.',
      script: '"The team are winning" sounds wrong. "The team is winning" feels right. Why? Because subject-verb agreement matches the NUMBER of the subject and verb. Today we drill the simple rule and trickier exceptions.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-svagree',
      kind: 'concept',
      goal: 'Basic rule + tricky cases.',
      keyIdeas: [
        'BASIC RULE: singular subject → singular verb. Plural subject → plural verb.',
        'IN PRESENT TENSE: most singular verbs end in -s. Plurals don\'t.',
        '  "The dog runs." (singular subject + verb with -s)',
        '  "The dogs run." (plural subject + verb without -s)',
        'PRONOUNS: he/she/it → singular. They → plural. I and you take plural-style verbs ("I run", "You run").',
        'TRICKY 1 — Compound subjects with AND: usually plural. "Tom and Maya WALK home."',
        'TRICKY 2 — Compound subjects with OR: verb agrees with the NEAREST subject. "Either the boys OR the girl IS singing." vs "Either the girl OR the boys ARE singing."',
        'TRICKY 3 — Collective nouns (team, family, class): usually treated as singular. "The team IS strong."',
        'TRICKY 4 — Indefinite pronouns: each, every, anybody, somebody, nobody, no one, everyone — singular. "Everybody IS here."',
        'TRICKY 5 — Phrases between subject and verb: ignore them. "The bag of apples IS heavy." (Subject is "bag", not "apples".)',
      ],
      vocabulary: [
        { term: 'subject', definition: 'the noun or pronoun that performs the action of the sentence.' },
        { term: 'agreement', definition: 'the matching of grammatical number between subject and verb.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-svagree',
      kind: 'worked_example',
      problem: 'Choose the correct verb: "The box of chocolates ___ on the table." (is / are)',
      steps: [
        'Find the subject: what noun is the sentence ABOUT? "Box" — singular.',
        '"Of chocolates" is a prepositional phrase that ADD to "box" but ISN\'T the subject. Ignore for agreement.',
        'Singular subject → singular verb: "is".',
        '"The box of chocolates IS on the table." ✓',
      ],
      answer: '"is"',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Choose: "Either the puppies or the cat ___ very playful." (is / are)',
      expectedAnswer: '"is" — verb agrees with the nearest subject (cat, singular).',
      responseFormat: 'free',
      hints: [
        'With "or", the verb matches the NEAREST subject.',
        'The nearest subject here is "cat" (singular).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-collective',
      kind: 'misconception_check',
      question: 'A student writes "The team are practising every day." Why is this wrong in standard American English?',
      commonErrors: [
        {
          answer: '"The team are practising"',
          misconception: 'Treating a collective noun as plural because it includes multiple people.',
          correctsTo: 'In standard American English, COLLECTIVE NOUNS like team, family, class, audience are singular: "The team IS practising." Even though many people make up the team, the team itself is one unit. (British English sometimes uses plural here, but American standard is singular.) Same rule applies to: family, committee, jury, audience, group.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Singular subject + singular verb. Plural subject + plural verb.',
        'Most singular present-tense verbs end in -s; plurals don\'t.',
        'Compound with AND = plural. With OR = match nearest.',
        'Collective nouns (team, family) = singular.',
        'Indefinite (everybody, each, no one) = singular.',
        'Ignore phrases between subject and verb.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Choose: "Neither the principal nor the teachers ___ aware of the change." (was / were)',
      hint: 'With "neither/nor", verb agrees with the NEAREST subject. Nearest is "teachers" (plural). Use "were". Always identify what\'s closest to the verb when neither/nor or either/or appears.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
