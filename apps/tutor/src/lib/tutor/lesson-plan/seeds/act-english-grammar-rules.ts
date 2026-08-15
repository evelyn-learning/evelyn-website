/**
 * ACT English — Grammar and Punctuation Rules.
 */

import type { LessonPlan } from '../types';

export const SEED_ACT_ENGLISH_GRAMMAR_RULES: LessonPlan = {
  id: 'evelyn.testprep.act.english.grammar-rules.v1',
  title: 'ACT English — Grammar and Punctuation Rules',
  curriculum: 'ACT-PREP',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act-english',
  locale: 'en',
  los: [
    {
      id: 'testprep.act.english.grammar-rules',
      description: 'Drill the most-tested ACT English grammar rules: subject-verb agreement, pronoun agreement, parallel structure, comma rules, semicolon/colon, dangling modifiers.',
      standard: 'ACT-ENGLISH',
    },
  ],
  prerequisites: ['testprep.act.english'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'ACT English isn\'t a knowledge test — it\'s a rule-application test. Master ~15 rules and you cover most questions.',
      script: 'You don\'t need to know obscure grammar terms. The ACT tests the same handful of rules over and over: subject-verb agreement, pronoun agreement, comma usage, parallel structure, dangling modifiers. Today we drill the canonical list.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-grammar',
      kind: 'concept',
      goal: 'Top rules + the question patterns each generates.',
      keyIdeas: [
        'SUBJECT-VERB AGREEMENT: subject and verb must agree in number. Find the SUBJECT (often hidden behind prepositional phrases). "The box of books IS heavy" — subject is "box" (singular), not "books."',
        'PRONOUN AGREEMENT: a pronoun must match its antecedent in number AND clarity. "Each student should bring THEIR/HIS OR HER (technically) book." Modern ACT accepts singular "their" in most contexts but watch for ambiguity: "Sarah told Lisa SHE was wrong" — unclear who.',
        'PARALLEL STRUCTURE: list items in matching grammatical form. "He likes running, swimming, and to bike." → wrong. "Running, swimming, and biking" or "to run, to swim, and to bike."',
        'COMMA RULES (high-yield):',
        '  Between independent clauses joined by FANBOYS conjunction (for, and, nor, but, or, yet, so).',
        '  After introductory phrases: "Walking home, she saw a cat."',
        '  Around non-essential clauses: "My brother, who lives in Tokyo, called."',
        '  In lists: "apples, oranges, and grapes" (Oxford comma optional, but ACT prefers it).',
        '  NEVER between subject and verb (unless interrupted by a non-essential clause).',
        'SEMICOLON: joins TWO INDEPENDENT clauses (each could stand alone). "I love reading; she prefers TV."',
        'COLON: introduces a list, explanation, or quote. "He brought three things: a book, a pen, and a notebook." Independent clause MUST come before colon.',
        'DANGLING MODIFIER: an introductory modifier must modify the SUBJECT of the next clause. "Walking home, the rain started" — wrong (rain wasn\'t walking). "Walking home, I noticed the rain start."',
        'WHO vs WHOM: who = subject (does the action). whom = object (receives action). Trick: replace with he/him. He → who; him → whom.',
        'CONCISENESS: ACT loves the SHORTER answer when both are grammatically correct. Cut redundant phrases ("in order to" → "to"; "due to the fact that" → "because").',
      ],
      vocabulary: [
        { term: 'parallel structure', definition: 'using the same grammatical form for items in a series, comparison, or correlative pair.' },
        { term: 'dangling modifier', definition: 'a modifier that doesn\'t logically connect to the subject of the sentence it introduces.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'Choose the correct option: "The list of guests (was/were) revised before the party."',
      steps: [
        'Identify subject. "The list of guests" — head noun is "list."',
        '"Of guests" is a prepositional phrase modifying "list" — does NOT change number.',
        '"List" is singular ⟹ verb must be singular: WAS.',
        'Trap: "guests" is plural and right next to the verb, but it\'s inside a prep phrase. Always strip prep phrases to find the true subject.',
      ],
      answer: 'was',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Fix this sentence: "Tired from the long drive, the hotel room felt like a luxury."',
      expectedAnswer: 'Dangling modifier: "tired from the long drive" should describe a person, not the hotel room. Fix: "Tired from the long drive, I found the hotel room a luxury." OR "After the long drive, the hotel room felt like a luxury." (latter dispenses with the participle).',
      responseFormat: 'free',
      hints: [
        'Who or what is "tired from the long drive"?',
        'The subject of the next clause must logically match.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-comma-and',
      kind: 'misconception_check',
      question: 'A student inserts a comma every time they see "and." Why is this often wrong?',
      commonErrors: [
        {
          answer: 'Comma before every "and"',
          misconception: 'Treating "and" as a universal comma trigger.',
          correctsTo: 'Comma before "and" only when "and" joins two INDEPENDENT clauses (FANBOYS rule). NOT for compound subjects ("Sara and I went home") or compound verbs ("She ran and jumped"). Test: can each side stand as a complete sentence? If yes → comma. If no → no comma. Many ACT comma questions hinge on exactly this.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Subject-verb: strip prepositional phrases to find the real subject.',
        'Parallel structure: items in lists/comparisons match form.',
        'Comma before FANBOYS only if joining two complete sentences.',
        'Semicolon = comma + FANBOYS for two sentences.',
        'Dangling modifier: opening phrase must describe the subject.',
        'When equally correct, pick the SHORTER answer.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
