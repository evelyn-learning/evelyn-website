/**
 * AP CSA — ArrayList.
 *
 * The dynamic array. add, get, set, remove, size, traversal patterns.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CSA_ARRAYLIST: LessonPlan = {
  id: 'evelyn.ap.csa.arraylist.v1',
  title: 'ArrayList in Java',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'cs',
  topic: 'computer science',
  locale: 'en',
  los: [
    {
      id: 'apcsa.arraylist',
      description: 'Use ArrayList<E> methods to build, traverse, and modify dynamic lists, including avoiding off-by-one errors during removal.',
      standard: 'AP-CSA-7',
    },
  ],
  prerequisites: ['apcsa.arrays'],
  followUps: ['apcsa.2d-arrays'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'ArrayList = array that grows.',
      script: 'Plain Java arrays have a fixed size. Set it to 10, you\'re stuck with 10 forever. ArrayList grows automatically as you add items. Same indexed access, same iteration, but the size adjusts. It\'s the workhorse data structure for AP CSA — most exam free-response involves an ArrayList.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-api',
      kind: 'concept',
      goal: 'Core ArrayList methods and traversal patterns.',
      keyIdeas: [
        'DECLARATION: ArrayList<String> list = new ArrayList<>(); — the <String> is the element TYPE (called a generic type parameter).',
        'add(item): adds to end. add(index, item): inserts at index, shifting later elements right.',
        'get(index): returns element at index. set(index, item): replaces element at index.',
        'remove(index): removes element at index, shifting later elements LEFT. remove(Object o): removes the FIRST occurrence equal to o.',
        'size(): number of elements. NOT length (that\'s for arrays).',
        'INDEXING: 0-based. list.get(0) is first. list.get(list.size() - 1) is last.',
        'TRAVERSAL: for (int i = 0; i < list.size(); i++) { ... } OR for-each: for (String s : list) { ... }. For-each can\'t modify the list during traversal — use indexed loop for that.',
        'REMOVE-WHILE-LOOPING TRAP: removing shifts indices. After remove(i), the element that WAS at i+1 is now at i. Either don\'t increment i after a removal, or LOOP BACKWARDS from size()−1 down to 0.',
        'AUTOBOXING: ArrayList<Integer> stores boxed Integer objects. Java auto-converts int ↔ Integer. Be careful: list.remove(2) on ArrayList<Integer> removes index 2 (NOT the value 2) — call list.remove(Integer.valueOf(2)) to remove by value.',
      ],
      vocabulary: [
        { term: 'generic type', definition: 'a type parameter like <E> that lets a class work with any element type.' },
        { term: 'autoboxing', definition: 'Java\'s automatic conversion between int and Integer (and other primitive/wrapper pairs).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-remove',
      kind: 'worked_example',
      problem: 'Trace this code that removes all even numbers from list = [1, 2, 3, 4, 5]: for (int i = 0; i < list.size(); i++) { if (list.get(i) % 2 == 0) list.remove(i); }',
      steps: [
        'i=0: list.get(0)=1, odd, no remove. i becomes 1.',
        'i=1: list.get(1)=2, even, remove. List is now [1, 3, 4, 5]. size()=4. i becomes 2.',
        'i=2: list.get(2)=4 (was at index 3 before the shift!), even, remove. List is now [1, 3, 5]. size()=3. i becomes 3.',
        'Loop exits (i=3 not < 3).',
        'BUG: the value 4 happened to get caught. But what if it was [1, 2, 4, 5]? After removing 2, list = [1, 4, 5]. i=2 → list.get(2)=5. The 4 GOT SKIPPED.',
        'FIX: don\'t increment after removal. while (i < list.size()) { if (...) { list.remove(i); } else { i++; } } — or loop backwards: for (int i = list.size() − 1; i >= 0; i--).',
      ],
      answer: 'Buggy due to index shift. Final list happened to be [1, 3, 5] but the loop skipped a position.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'After ArrayList<Integer> list = new ArrayList<>(); list.add(10); list.add(20); list.add(30); list.add(1, 15); list.set(0, 5); What is list.get(2)?',
      expectedAnswer: '20',
      responseFormat: 'numeric',
      hints: [
        'Track the list step by step. After adds: [10,20,30]. After add(1, 15): [10,15,20,30].',
        'set(0, 5): [5,15,20,30]. get(2)?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-size-vs-length',
      kind: 'misconception_check',
      question: 'For an ArrayList named list, do you write list.length or list.size() to find the number of elements?',
      commonErrors: [
        {
          answer: 'list.length',
          misconception: 'Borrowing array syntax for ArrayList.',
          correctsTo: 'list.size(). Plain arrays use .length (a field, no parentheses). ArrayList uses .size() (a method, has parentheses). Strings use .length() (also a method). Easy way to remember: array is just data → no method call needed → length. ArrayList and String are objects with methods → size() / length() with parentheses.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'ArrayList grows; arrays don\'t. Use .size() — not .length.',
        'add, get, set, remove, size are the core methods.',
        'remove(int index) shifts later elements left. Looping forward + removing → off-by-one bugs.',
        'For ArrayList<Integer>: remove(int) is by index, remove(Integer) is by value.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is removing from the FRONT of a long ArrayList slow, but removing from the END fast?',
      hint: 'Internally, ArrayList is backed by an array. Removing index 0 means shifting every other element left by one — O(n). Removing the last element just decrements size — O(1). For lots of front removals, use LinkedList or a different data structure (not on AP).',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
