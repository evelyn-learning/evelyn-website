/**
 * Grades 6-8 ELA — Phrases & Clauses.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_PHRASES_CLAUSES: LessonPlan = {
  id: 'evelyn.g68.ela.phrases-clauses.v1',
  title: 'Grades 6-8 ELA — Phrases & Clauses',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.phrases-clauses',
      description: 'Distinguish phrases from clauses; identify and use prepositional, participial, gerund, infinitive phrases and dependent clauses.',
      standard: 'CCSS.ELA-LITERACY.L.7.1.A',
    },
  ],
  prerequisites: ['g68.ela.revising-clarity'],
  followUps: ['g68.ela.advanced-punctuation'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Phrases and clauses are sentence building blocks — knowing them upgrades your writing toolkit.',
      script: 'Up until now you\'ve written subjects and verbs. Add prepositional phrases ("in the morning"), participial phrases ("running quickly"), and dependent clauses ("when she arrived"), and your sentences become more flexible. Today we name the parts.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-phrases-clauses',
      kind: 'concept',
      goal: 'Define phrase vs clause + types of each.',
      keyIdeas: [
        'PHRASE: a group of words missing a subject OR a verb (or both). Cannot stand alone.',
        'CLAUSE: a group of words containing both subject AND verb. Can be independent or dependent.',
        'PREPOSITIONAL PHRASE: starts with a preposition (in, on, under, beside, with). "in the morning", "with my friend".',
        'PARTICIPIAL PHRASE: begins with a participle (verb + -ing or -ed used as adjective). "Walking quickly, she...". "Tired from running, the dog...".',
        'GERUND PHRASE: -ing verb used as a noun. "Swimming is fun." "I love eating chocolate."',
        'INFINITIVE PHRASE: "to" + verb. "I want to learn."',
        'INDEPENDENT CLAUSE: complete thought. "I ran."',
        'DEPENDENT CLAUSE: subject + verb but begins with a subordinator (because, when, although). Can\'t stand alone.',
        'WHY CARE: phrases and clauses give you flexibility. They let you ADD detail without making sentences choppy.',
        'COMMA RULE: introductory phrases or clauses usually take a comma. "After the rain, we went outside."',
      ],
      vocabulary: [
        { term: 'phrase', definition: 'a group of words missing subject, verb, or both; cannot stand alone.' },
        { term: 'clause', definition: 'a group of words with both subject and verb.' },
        { term: 'participle', definition: 'a verb form used as an adjective; usually -ing or -ed.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-identify',
      kind: 'worked_example',
      problem: 'Identify phrases and clauses in: "After running for an hour, the dog rested under the tree."',
      steps: [
        '"After running for an hour" — starts with "After" (subordinator) but contains a participle "running" rather than a clear subject + verb pair. PARTICIPIAL PHRASE acting as introductory modifier.',
        '"the dog rested" — subject + verb, complete thought = INDEPENDENT CLAUSE.',
        '"under the tree" — preposition "under" + noun "tree" = PREPOSITIONAL PHRASE.',
        'Sentence structure: introductory phrase + independent clause + prepositional phrase.',
      ],
      answer: 'Participial phrase + independent clause + prepositional phrase.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the type: "Because the bus was late."',
      expectedAnswer: 'Dependent clause (subject + verb but starts with subordinator "because").',
      responseFormat: 'free',
      hints: [
        'Subject = "the bus". Verb = "was".',
        'Starts with subordinator?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-phrase-clause',
      kind: 'misconception_check',
      question: 'A student says "running quickly down the path" is a clause because it has a verb. Correct?',
      commonErrors: [
        {
          answer: 'It\'s a clause',
          misconception: 'Treating any verb form as evidence of a clause without checking for a true subject + finite verb.',
          correctsTo: '"Running" is a participle (verb form acting as adjective), not a finite verb. There\'s no SUBJECT either. "Running quickly down the path" is a PARTICIPIAL PHRASE — needs to attach to a clause: "Running quickly down the path, she heard a noise." Now "she" is subject, "heard" is verb, and we have a clause.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Phrase: missing subject and/or verb. Clause: has both.',
        'Independent clause = complete thought. Dependent = starts with subordinator.',
        'Phrase types: prepositional, participial, gerund, infinitive.',
        'Introductory phrase or clause → comma.',
        'Use phrases/clauses to add detail without choppy sentences.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does adding a participial phrase change the rhythm and meaning of a sentence?',
      hint: 'Plain: "She arrived at the party. She felt nervous." Combined with participial: "Arriving at the party, she felt nervous." Smoother, single sentence, makes the arrival the cause of the nervousness. Shows simultaneous actions or causation. Use sparingly — overuse leads to wordiness, but well-placed phrases add elegance and flow.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
