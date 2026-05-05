/**
 * AP Computer Science A — Arrays and loops.
 *
 * Java arrays, ArrayList, traversal patterns, common bugs.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CSA_ARRAYS_LOOPS: LessonPlan = {
  id: 'evelyn.ap.csa.arrays-loops.v1',
  title: 'Arrays and loops in Java',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'cs',
  topic: 'ap-cs-a',
  locale: 'en',
  los: [
    {
      id: 'apcsa.arrays',
      description: 'Use arrays and ArrayLists with for and while loops to process collections.',
      standard: 'AP-CSA-VAR-2',
    },
  ],
  prerequisites: ['apcsa.classes'],
  followUps: ['apcsa.recursion'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame arrays as the box that holds many values.',
      script: 'You have 30 students\' grades. You don\'t want 30 separate variables. ARRAYS hold many values together, indexed by number. Loop through them with FOR. This pattern shows up in nearly every program.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-arrays-loops',
      kind: 'concept',
      goal: 'Array creation + access + traversal patterns + ArrayList.',
      keyIdeas: [
        'ARRAY: a fixed-size collection of values of the same type.',
        'DECLARE + CREATE: int[] grades = new int[30];  // 30 ints, all default 0.',
        'INIT WITH VALUES: int[] grades = {85, 92, 78, 90};',
        'ACCESS: grades[0] = first. grades[3] = fourth. INDEX from 0.',
        'LENGTH: grades.length (no parentheses — it\'s a property, not a method, for arrays).',
        'OFF-BY-ONE: array indexes go 0 to length-1. Going to length is OUT OF BOUNDS — runtime error.',
        'STANDARD FOR loop: for (int i = 0; i < grades.length; i++) { ... grades[i] ... }',
        'ENHANCED FOR loop ("for-each"): for (int g : grades) { ... }  — read-only; can\'t modify the array.',
        'ARRAYLIST: dynamic-size array. Add/remove freely. Methods: list.add(x), list.get(i), list.size(), list.remove(i).',
        'Use ArrayList when you don\'t know the size in advance. Use array when size is fixed (slightly faster).',
      ],
      vocabulary: [
        { term: 'array', definition: 'a fixed-size ordered collection of same-typed values.' },
        { term: 'index', definition: 'the position number of an element (starts at 0 in Java).' },
        { term: 'ArrayList', definition: 'a dynamic-size collection class that can grow.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-sum',
      kind: 'worked_example',
      problem: 'Sum the values in an int array using a for loop.',
      steps: [
        'int[] nums = {3, 7, 2, 8, 5};',
        'int sum = 0;',
        'for (int i = 0; i < nums.length; i++) {',
        '  sum += nums[i];',
        '}',
        '// sum = 3 + 7 + 2 + 8 + 5 = 25',
        'Same with for-each: for (int n : nums) sum += n;',
      ],
      answer: '25',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In Java, what does grades[grades.length] do?',
      expectedAnswer: 'throws ArrayIndexOutOfBoundsException',
      responseFormat: 'free',
      hints: [
        'Indexes go 0 to length-1.',
        'Accessing length is one past the end.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-length-method',
      kind: 'misconception_check',
      question: 'Is the size of an array obtained with grades.length() (with parentheses)?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing array with String.',
          correctsTo: 'No — for arrays it\'s grades.length (no parens, it\'s a public field). For Strings it\'s str.length() (with parens, it\'s a method). For ArrayLists it\'s list.size() (different method name). Java is annoyingly inconsistent here — memorize the trio.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Arrays: fixed-size, indexed from 0, type-uniform.',
        'Use grades.length to get size. (No parens for arrays.)',
        'Standard for: gives you index. Enhanced for: gives you values, read-only.',
        'ArrayList: dynamic size; use list.add, list.get, list.size.',
        'Off-by-one (index = length) is a common bug.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does Java distinguish between arrays (fixed size) and ArrayLists (dynamic)?',
      hint: 'Arrays are faster and use less memory (no resizing logic). ArrayLists are convenient but slightly slower. Choose based on need. Most production Java uses ArrayList for the convenience; performance-critical code may use arrays.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
