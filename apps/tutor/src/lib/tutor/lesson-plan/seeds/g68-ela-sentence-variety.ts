/**
 * Grades 6-8 ELA — Sentence Variety & Complexity.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_SENTENCE_VARIETY: LessonPlan = {
  id: 'evelyn.g68.ela.sentence-variety.v1',
  title: 'Grades 6-8 ELA — Sentence Variety',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.sentence-variety',
      description: 'Use simple, compound, complex, and compound-complex sentences to vary rhythm and clarity.',
      standard: 'CCSS.ELA-LITERACY.L.7.1.B',
    },
  ],
  prerequisites: ['g68.ela.citing-evidence'],
  followUps: ['g68.ela.active-passive-voice'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Strings of short sentences sound choppy. Long sentences alone feel exhausting. The best writing varies.',
      script: '"I went to the store. I bought milk. I came home. I made cereal." Painful. Now: "I went to the store, where I bought milk, before coming home to make cereal." Smoother. Sentence variety = sentence types + lengths mixed for rhythm. Today we name the types.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-sentence-variety',
      kind: 'concept',
      goal: 'Four sentence types + how to combine + rhythm.',
      keyIdeas: [
        'INDEPENDENT CLAUSE: a complete thought (subject + verb, makes sense alone). "I ran."',
        'DEPENDENT CLAUSE: incomplete thought (starts with subordinator like "because", "when", "although"). "Because I was late."',
        'SIMPLE SENTENCE: one independent clause. "I ran to the store."',
        'COMPOUND SENTENCE: two independent clauses joined by FANBOYS coordinator (For, And, Nor, But, Or, Yet, So) with comma, OR by semicolon. "I ran, but I missed the bus."',
        'COMPLEX SENTENCE: one independent + one or more dependent. "Because I was late, I ran to the store."',
        'COMPOUND-COMPLEX: at least two independent + at least one dependent. "Because I was late, I ran to the store, but I still missed the bus."',
        'SUBORDINATORS: because, although, when, while, if, since, after, before, even though, unless, until.',
        'STRATEGY: vary sentence STARTS too. Don\'t open every sentence with "The" or "I".',
        'RHYTHM: short sentences for impact. Long for description or explanation. Mix.',
        'TEST: read your writing aloud. Choppy = too many shorts. Run-on feel = too few periods. Adjust.',
      ],
      vocabulary: [
        { term: 'independent clause', definition: 'a clause containing subject + verb that can stand alone as a sentence.' },
        { term: 'dependent clause', definition: 'a clause that cannot stand alone; needs to attach to an independent clause.' },
        { term: 'FANBOYS', definition: 'mnemonic for coordinating conjunctions: For, And, Nor, But, Or, Yet, So.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-combine',
      kind: 'worked_example',
      problem: 'Combine these short sentences into a single complex or compound-complex sentence: "Maya was tired. She had run five miles. She still wanted to keep going."',
      steps: [
        'Identify what to keep: all three ideas.',
        'Choose subordinator and coordinator: "Even though she was tired" (subordinator), "she still wanted to keep going" (independent).',
        'Combine: "Even though Maya was tired from running five miles, she still wanted to keep going."',
        'That\'s a COMPLEX sentence (one dependent + one independent).',
        'Compound-complex version: "Even though Maya was tired from running five miles, she still wanted to keep going, and her coach encouraged her to push." (Adds another independent.)',
      ],
      answer: '"Even though Maya was tired from running five miles, she still wanted to keep going."',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Identify the sentence type: "I wanted to play outside, but it started to rain."',
      expectedAnswer: 'Compound (two independent clauses joined by "but").',
      responseFormat: 'free',
      hints: [
        'Each clause "I wanted to play outside" and "it started to rain" can stand alone — both independent.',
        'Joined by FANBOYS coordinator with comma → compound.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-fragment',
      kind: 'misconception_check',
      question: 'A student writes: "Because I was tired." Is this a complete sentence?',
      commonErrors: [
        {
          answer: 'Yes, complete sentence',
          misconception: 'Treating a dependent clause as a complete sentence.',
          correctsTo: 'No — this is a SENTENCE FRAGMENT. "Because" makes it dependent. The reader expects a follow-up: "Because I was tired, I went to bed." Without the independent clause, the sentence dangles. Fix by attaching to an independent clause OR removing the subordinator: "I was tired."',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Simple, compound, complex, compound-complex.',
        'FANBOYS coordinators join independents with comma.',
        'Subordinators introduce dependent clauses.',
        'Vary sentence length AND starting words.',
        'Read aloud to test rhythm.',
        'Avoid fragments unless used deliberately for effect.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'When might a writer DELIBERATELY use a sentence fragment?',
      hint: 'For impact. After a long sentence: "She ran for hours, dodging branches and gaining speed, leaving everything behind. Everything." The fragment "Everything." emphasises and rhythmically punches. Used sparingly, fragments can be powerful — used carelessly, they look like grammar errors. Test: did I MEAN to fragment? If yes, keep. If no, fix.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
