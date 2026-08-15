/**
 * G11 — Sentence syntax and style.
 *
 * Simple, compound, complex, compound-complex sentences. Why
 * varying sentence length and structure makes prose powerful.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ELA_SYNTAX_STYLE: LessonPlan = {
  id: 'evelyn.g11.ela.style.syntax-variety.v1',
  title: 'Sentence variety: simple, compound, complex',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'writing',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.11-12.l.3.a',
      description: 'Vary syntax for effect, consulting references for guidance as needed.',
      standard: 'CCSS.ELA-LITERACY.L.11-12.3.A',
    },
  ],
  prerequisites: ['ccss.ela.7.l.1'],
  followUps: [],
  estimatedMinutes: 13,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show monotony of one-length-only prose.',
      script: 'Read this aloud: "I went to the store. I bought milk. I came home. I made breakfast." Now: "I went to the store and bought milk; when I came home, I made breakfast." Same content, but the second has rhythm. Sentence variety creates the music of prose.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-types',
      kind: 'concept',
      goal: 'Four sentence structures + when each is most effective.',
      keyIdeas: [
        'INDEPENDENT CLAUSE: a complete thought with subject + verb. ("She ran.")',
        'DEPENDENT CLAUSE: incomplete thought; can\'t stand alone. ("Because she was late.")',
        'SIMPLE: ONE independent clause. "She ran."',
        'COMPOUND: two independent clauses joined by FANBOYS (For, And, Nor, But, Or, Yet, So) or a semicolon. "She ran, and she made it on time."',
        'COMPLEX: one independent + one or more DEPENDENT clauses. "Because she was late, she ran."',
        'COMPOUND-COMPLEX: two independent + at least one dependent. "Because she was late, she ran, and she made it on time."',
        'EFFECT: short simple sentences punch. Long complex ones build, qualify, layer. Mix gives texture.',
      ],
      vocabulary: [
        { term: 'independent clause', definition: 'a complete thought that can stand alone as a sentence.' },
        { term: 'dependent clause', definition: 'an incomplete thought that needs an independent clause to make sense.' },
        { term: 'FANBOYS', definition: 'For, And, Nor, But, Or, Yet, So — coordinating conjunctions for compound sentences.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-classify',
      kind: 'worked_example',
      problem: 'Classify: "Although the weather was cold, we went hiking, and we saw a deer."',
      steps: [
        'Find clauses. "Although the weather was cold" — DEPENDENT (starts with "although").',
        '"we went hiking" — INDEPENDENT.',
        '"we saw a deer" — INDEPENDENT.',
        'Count: 1 dependent + 2 independent → COMPOUND-COMPLEX.',
      ],
      answer: 'compound-complex',
      estimatedMinutes: 2,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Classify: "I studied hard, but I still failed the test."',
      expectedAnswer: 'compound',
      responseFormat: 'free',
      hints: [
        'Two independent clauses joined by "but" (a FANBOYS conjunction).',
        'No dependent clause.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-long-better',
      kind: 'misconception_check',
      question: 'Is longer, more complex sentences always BETTER writing?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Equating complexity with quality.',
          correctsTo: 'No — short, simple sentences can hit hardest. Hemingway wrote masterpieces with mostly short sentences. The skill is VARIETY: long for development, short for emphasis. Endless complexity is just hard to read.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Simple = 1 independent clause.',
        'Compound = 2 independent (joined by FANBOYS or semicolon).',
        'Complex = 1 independent + 1+ dependent.',
        'Compound-complex = 2+ independent + 1+ dependent.',
        'Mix structures for rhythm and emphasis.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Look at a paragraph of your own writing. What\'s the longest sentence? The shortest? Could ratio be improved?',
      hint: 'A typical strong paragraph has sentences ranging from 4 words to 25+. If yours are all 12-18, consider mixing in a punch (4-word) and a build (25+).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
