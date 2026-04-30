/**
 * AP CSP — Programming Concepts (variables, conditionals, loops, lists, procedures).
 *
 * The pseudocode and core control flow on the AP CSP exam.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CSP_PROGRAMMING: LessonPlan = {
  id: 'evelyn.ap.csp.programming.v1',
  title: 'Programming Concepts (CSP Pseudocode)',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'cs',
  topic: 'ap-cs-principles',
  locale: 'en',
  los: [
    {
      id: 'apcsp.programming',
      description: 'Trace and write programs using variables, conditionals, loops, lists, and procedures in CSP exam pseudocode.',
      standard: 'AP-CSP-3',
    },
  ],
  prerequisites: [],
  followUps: ['apcsp.algorithms'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame CSP pseudocode as language-agnostic programming.',
      script: 'AP CSP doesn\'t test you in Java, Python, or any specific language. It uses pseudocode — block-style instructions that look like English. Five building blocks cover almost everything: variables, conditionals, loops, lists, and procedures. Once you can read those, you can solve any CSP programming question.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-blocks',
      kind: 'concept',
      goal: 'The five building blocks and their pseudocode syntax.',
      keyIdeas: [
        'VARIABLES + ASSIGNMENT: a ← 5 (the arrow means "store 5 into a"). DISPLAY a outputs the value.',
        'CONDITIONALS: IF (condition) { ... } ELSE { ... }. Conditions use comparison (=, ≠, <, ≤, >, ≥) and logical operators (AND, OR, NOT).',
        'LOOPS: REPEAT n TIMES { ... } repeats a fixed count. REPEAT UNTIL (condition) { ... } repeats until the condition becomes true. FOR EACH item IN list { ... } iterates a list.',
        'LISTS: list ← [10, 20, 30]. INDEX FROM 1 (NOT 0!). list[1] = 10, list[2] = 20. LENGTH(list) = 3. APPEND(list, 40), INSERT(list, i, val), REMOVE(list, i).',
        'PROCEDURES: PROCEDURE name(parameter1, parameter2) { ... return value }. Call as name(arg1, arg2).',
        'KEY DIFFERENCE FROM JAVA / PYTHON: lists in CSP pseudocode are 1-INDEXED. The first element is at index 1, not 0. Off-by-one errors here are the #1 cause of trace mistakes.',
        'SCOPE: variables defined inside a procedure are local to it. Variables outside any procedure are accessible everywhere (but redefining inside a procedure shadows them).',
      ],
      vocabulary: [
        { term: 'pseudocode', definition: 'language-neutral code-like notation used to describe algorithms.' },
        { term: 'procedure', definition: 'a reusable block of code that takes parameters and may return a value.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-trace',
      kind: 'worked_example',
      problem: 'Trace this CSP pseudocode: list ← [3, 7, 2, 8]. total ← 0. FOR EACH n IN list { IF (n > 5) { total ← total + n } } DISPLAY total.',
      steps: [
        'list = [3, 7, 2, 8]. total = 0.',
        'n = 3: 3 > 5? No. total stays 0.',
        'n = 7: 7 > 5? Yes. total = 0 + 7 = 7.',
        'n = 2: 2 > 5? No. total stays 7.',
        'n = 8: 8 > 5? Yes. total = 7 + 8 = 15.',
        'DISPLAY 15.',
        'PURPOSE: this code sums all elements greater than 5.',
      ],
      answer: '15',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Trace: a ← 1. b ← 1. REPEAT 4 TIMES { c ← a + b. a ← b. b ← c }. DISPLAY b. What value is displayed?',
      expectedAnswer: '8',
      responseFormat: 'numeric',
      hints: [
        'This builds the Fibonacci sequence. After each iteration: (a, b) becomes (b, a+b).',
        'Start: (1, 1). After 1: (1, 2). After 2: (2, 3). After 3: (3, 5). After 4: (5, 8).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-list-index',
      kind: 'misconception_check',
      question: 'In CSP pseudocode, list ← [10, 20, 30]. What does list[1] equal?',
      commonErrors: [
        {
          answer: '20',
          misconception: 'Applying 0-indexing from Java / Python.',
          correctsTo: '10. CSP pseudocode uses 1-INDEXED lists. The first element is at index 1, not 0. list[1] = 10, list[2] = 20, list[3] = 30. This trips up almost every student who has programmed elsewhere — the AP exam scorers know this and write distractor answers that reward 0-indexed mistakes.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Five building blocks: variables, conditionals, loops, lists, procedures.',
        'Lists are 1-INDEXED in CSP pseudocode.',
        'Trace by hand: write variables in a table, update each line.',
        'PROCEDURE definitions reuse code; check parameters carefully.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Write pseudocode that returns true if a list contains the value target, false otherwise. Use a procedure.',
      hint: 'PROCEDURE contains(list, target) { FOR EACH x IN list { IF (x = target) { return true } } return false }. The early-return pattern stops as soon as you find a match.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
