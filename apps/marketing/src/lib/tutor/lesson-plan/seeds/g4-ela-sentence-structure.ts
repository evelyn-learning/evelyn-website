/**
 * G4 — ELA: Sentence structure (simple, compound, complex; clauses).
 *
 * The next level beyond "what is a sentence". Independent vs
 * dependent clauses; how coordinating conjunctions (FANBOYS) make
 * compound sentences; how subordinating conjunctions make complex
 * ones. Run-on sentences and comma splices as the natural
 * misconceptions.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_ELA_SENTENCE_STRUCTURE: LessonPlan = {
  id: 'evelyn.g4.ela.sentence-structure.v1',
  title: 'Simple, Compound, and Complex Sentences',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'ela',
  topic: 'grammar',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.l.4.1.f',
      description: 'Produce complete sentences, recognizing and correcting inappropriate fragments and run-ons.',
      standard: 'CCSS.ELA-LITERACY.L.4.1.F',
    },
  ],
  prerequisites: ['ccss.ela.l.3.1.i'],
  followUps: ['ccss.ela.l.5.1.a'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show how combining sentences makes writing flow.',
      script: 'Read this: "I went to the park. I saw a bird. The bird flew away. I went home." Choppy, right? Now: "I went to the park, and I saw a bird, but it flew away before I could get close." Same story, but it FLOWS. The trick is knowing how to combine sentences without breaking grammar.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-clauses-and-types',
      kind: 'concept',
      goal: 'Independent vs dependent clauses → simple, compound, complex sentence types.',
      keyIdeas: [
        'A CLAUSE is a group of words with a subject and a verb.',
        'INDEPENDENT clause: a complete thought — could stand alone as a sentence. ("I went to the park.")',
        'DEPENDENT clause: has a subject and verb but does NOT express a complete thought. Needs an independent clause to lean on. ("Because I was bored" — sentence fragment if alone.)',
        'SIMPLE sentence: ONE independent clause. ("Maya ran.")',
        'COMPOUND sentence: TWO independent clauses joined by a comma + coordinating conjunction (FANBOYS: For, And, Nor, But, Or, Yet, So). ("Maya ran, AND she got tired.")',
        'COMPLEX sentence: ONE independent + ONE OR MORE dependent clauses, joined by a SUBORDINATING conjunction (because, since, when, although, if, while, before, after). ("BECAUSE Maya was tired, she stopped running.")',
        'RUN-ON sentence: two independent clauses smashed together with no proper connector. WRONG: "Maya ran she got tired."',
        'COMMA SPLICE: two independent clauses joined by ONLY a comma — also wrong. WRONG: "Maya ran, she got tired." Need a conjunction or a semicolon, or split into two sentences.',
      ],
      vocabulary: [
        { term: 'clause', definition: 'a group of words with a subject and verb.' },
        { term: 'coordinating conjunction', definition: 'connects two equal parts (for, and, nor, but, or, yet, so).' },
        { term: 'subordinating conjunction', definition: 'starts a dependent clause (because, when, if, although...).' },
        { term: 'run-on sentence', definition: 'two independent clauses with no proper connector.' },
      ],
      suggestedTools: ['show_text', 'show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-classify',
      kind: 'worked_example',
      problem: 'Classify each sentence: (a) "The cat slept." (b) "The cat slept, and the dog barked." (c) "When the cat woke up, the dog ran away."',
      steps: [
        '(a) "The cat slept." — one subject (cat), one verb (slept), one complete thought. SIMPLE.',
        '(b) "The cat slept, AND the dog barked." — two complete thoughts joined by ", and". COMPOUND.',
        '(c) "When the cat woke up, the dog ran away." — "When the cat woke up" is dependent (starts with subordinating conjunction "when"); "the dog ran away" is independent. COMPLEX.',
      ],
      answer: '(a) Simple, (b) Compound, (c) Complex',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-fix-runon',
      kind: 'worked_example',
      problem: 'Fix this run-on: "I was hungry I made a sandwich."',
      steps: [
        'Two independent clauses smashed together — no connector.',
        'Fix option 1 (split): "I was hungry. I made a sandwich."',
        'Fix option 2 (compound): "I was hungry, so I made a sandwich." (comma + coordinating conjunction "so".)',
        'Fix option 3 (complex): "Because I was hungry, I made a sandwich." (subordinating conjunction.)',
        'All three are correct.',
      ],
      answer: 'Multiple fixes — see options',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Is this sentence simple, compound, or complex? "Although it was raining, we still went outside."',
      expectedAnswer: 'complex',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Simple' },
        { id: 'b', text: 'Compound' },
        { id: 'c', text: 'Complex', correct: true },
      ],
      hints: [
        '"Although it was raining" — does that stand alone?',
        'Subordinating conjunction "although" creates a dependent clause.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-comma-splice',
      kind: 'misconception_check',
      question: 'Asha writes: "I love pizza, my brother loves tacos." She thinks the comma is enough. Right?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Believing a comma alone can join two independent clauses.',
          correctsTo: 'No — that\'s a comma splice. To join two independent clauses you need EITHER comma + FANBOYS conjunction ("I love pizza, AND my brother loves tacos") OR a semicolon ("I love pizza; my brother loves tacos") OR split into two sentences. A comma alone is too weak.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Independent clause = complete thought. Dependent = needs help.',
        'Simple = one independent clause.',
        'Compound = two independent clauses + comma + FANBOYS.',
        'Complex = independent + dependent (subordinating conjunction).',
        'Run-ons and comma splices = wrong. Use a connector or split.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Combine "I finished my homework" and "I watched a movie" three different ways.',
      hint: 'Compound: "I finished my homework, and I watched a movie." Complex: "After I finished my homework, I watched a movie." Or just two simple sentences.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
