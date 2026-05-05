/**
 * Grades 11-12 Computer Science — Data Structures & Algorithms (intro).
 *
 * Arrays, lists, stacks, queues, hash maps; Big-O at a high level.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_CS_DATA_STRUCTURES: LessonPlan = {
  id: 'evelyn.cs.11-12.data-structures.v1',
  title: 'Data structures — arrays, lists, stacks, queues, hash maps',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'cs',
  topic: 'data-structures',
  locale: 'en',
  los: [
    {
      id: 'cs1112.ds',
      description: 'Match data structures to use cases by analyzing operations and Big-O.',
      standard: 'CSTA-3B-AP-11',
    },
  ],
  prerequisites: ['cs910.python'],
  followUps: ['cs1112.oop'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame data structures as choices that affect speed.',
      script: 'Choosing the wrong data structure can make your program 1000× slower with the same code logic. A search through 10,000 items is instant with a hash map and noticeable with a list. Understanding the tradeoffs separates "code that works" from "code that scales".',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-ds',
      kind: 'concept',
      goal: 'Five core structures + Big-O for each.',
      keyIdeas: [
        'ARRAY: fixed-size, contiguous memory. Index access O(1). Insert/delete in middle O(n). Best when size is known.',
        'LIST (linked): nodes pointing to next. Insert/delete O(1) given a node. Index access O(n). Best for frequent insert/delete.',
        'STACK: LIFO (last-in-first-out). push, pop. Used for: function calls, undo, parsing.',
        'QUEUE: FIFO (first-in-first-out). enqueue, dequeue. Used for: task lines, BFS, scheduling.',
        'HASH MAP / DICT: key → value. Lookup, insert, delete all O(1) average. Best when you have a key (id, name).',
        'BIG-O describes how runtime grows with input size n. O(1) constant, O(log n) tree-search, O(n) linear, O(n²) nested loops.',
        'Pick the structure that makes your most-frequent operation O(1) or O(log n).',
      ],
      vocabulary: [
        { term: 'Big-O', definition: 'asymptotic notation describing growth rate of runtime with input size.' },
        { term: 'LIFO', definition: 'last-in-first-out, the access pattern of a stack.' },
        { term: 'hash map', definition: 'a data structure that maps keys to values with O(1) average lookup.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-pickstructure',
      kind: 'worked_example',
      problem: 'You\'re storing 1 million students. Most-frequent op: "given a student id, get their name." Which structure?',
      steps: [
        'Op: lookup by id (a key).',
        'Array: scan the array → O(n) → 1 million comparisons per lookup. Slow.',
        'List: scan the list → O(n). Same problem.',
        'Hash map (id → student): O(1) average. ~1 lookup regardless of size.',
        'Choose: HASH MAP keyed by id.',
      ],
      answer: 'Hash map keyed by student id.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You\'re building a browser\'s "back button" history. Items go in, last-in-first-out. Which structure?',
      expectedAnswer: 'stack',
      responseFormat: 'free',
      hints: [
        'You always remove the most recently added item.',
        'That access pattern has a name.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-arraylist-fast',
      kind: 'misconception_check',
      question: 'A student claims: "Linked lists are always faster than arrays for inserts." Where does this break?',
      commonErrors: [
        {
          answer: 'they always are',
          misconception: 'Ignoring the cost of FINDING the position to insert at.',
          correctsTo: 'Insertion at a known node is O(1) for a linked list, vs O(n) for an array. But if you must FIRST find the position by walking the list, that walk is O(n) — same as the array. Linked lists win when you already have the node reference (e.g., from a hash map lookup) AND you do many inserts. Otherwise arrays\' cache locality often wins in practice.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Array: fast index, slow middle insert.',
        'Linked list: slow index, fast known-node insert.',
        'Stack: LIFO. Queue: FIFO.',
        'Hash map: O(1) lookup by key — usually the right answer.',
        'Match the structure to your most-frequent operation.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Hash map lookup is O(1) AVERAGE. What\'s the worst case, and when does it happen?',
      hint: 'Worst case is O(n) when many keys hash to the same bucket (collision). Modern hash tables grow + rehash when load factor gets high to avoid this. Cryptographic-quality hash functions and randomized seeds also defeat adversarial-input attacks (intentional collisions).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
