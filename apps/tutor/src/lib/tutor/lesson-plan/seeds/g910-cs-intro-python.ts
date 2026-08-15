/**
 * Grades 9-10 Computer Science — Intro to Programming (Python).
 *
 * Variables, types, functions, lists, basic control flow.
 */

import type { LessonPlan } from '../types';

export const SEED_G910_CS_INTRO_PYTHON: LessonPlan = {
  id: 'evelyn.cs.9-10.intro-python.v1',
  title: 'Intro to Python — variables, functions, lists',
  curriculum: 'CCSS',
  grade: '9',
  subject: 'cs',
  topic: 'intro-python',
  locale: 'en',
  los: [
    {
      id: 'cs910.python',
      description: 'Write small Python programs using variables, types, functions, lists, and conditionals.',
      standard: 'CSTA-3A-AP-13',
    },
  ],
  prerequisites: ['cs68.intro'],
  followUps: ['cs910.web-development'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Python as the most readable language to start with.',
      script: 'Python looks almost like English. You can write a working program in three lines and read it back to a friend without a translator. That\'s why it\'s the world\'s most popular intro language. Today: variables, functions, lists. Enough to actually build something.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-python',
      kind: 'concept',
      goal: 'Variables, types, functions, lists, indentation as syntax.',
      keyIdeas: [
        'VARIABLE: a name bound to a value. name = "Maya". age = 14.',
        'TYPES: int (3), float (3.14), str ("hi"), bool (True / False), list ([1, 2, 3]).',
        'PRINTING: print(name) — shows it on the console.',
        'INPUT: x = input("name? ") — reads a string from the user.',
        'TYPE CONVERSION: int("3") → 3. str(3) → "3". Confusion between str and int is the most common bug.',
        'FUNCTION: def greet(name): print("Hello", name). Call: greet("Maya").',
        'LIST: scores = [85, 92, 78]. Access scores[0]. Add: scores.append(91). Length: len(scores).',
        'LOOP: for s in scores: print(s). No semicolons; INDENTATION defines blocks.',
        'IF: if score >= 90: print("A"). Equal is == (double equals). Single = is assignment.',
      ],
      vocabulary: [
        { term: 'variable', definition: 'a named container for a value.' },
        { term: 'function', definition: 'a reusable block of code with a name and optional inputs (parameters).' },
        { term: 'list', definition: 'an ordered, changeable collection of values.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-average',
      kind: 'worked_example',
      problem: 'Write a Python function that returns the average of a list of numbers.',
      steps: [
        'def average(numbers):',
        '    total = 0',
        '    for n in numbers:',
        '        total += n',
        '    return total / len(numbers)',
        '',
        'print(average([85, 92, 78]))   # 85.0',
        '// Note indentation defines what is inside the function and inside the for loop.',
      ],
      answer: '85.0',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does "5" + 3 raise a TypeError in Python?',
      expectedAnswer: '"5" is a string and 3 is an int — Python won\'t add them without conversion',
      responseFormat: 'free',
      hints: [
        'Look at the types of each operand.',
        'Some languages auto-convert; Python does not.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-equality',
      kind: 'misconception_check',
      question: 'A student writes if score = 90: print("A"). Why does Python complain?',
      commonErrors: [
        {
          answer: 'syntax error?',
          misconception: 'Confusing assignment (=) with equality (==).',
          correctsTo: 'In Python, = ASSIGNS a value (score = 90 sets score to 90) and == COMPARES (score == 90 asks "is score equal to 90?"). The if statement needs a comparison, so it must be ==. This is the single most common beginner bug across every C-family language.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Variables hold values; types matter.',
        'Indentation defines blocks; no curly braces.',
        '= assigns; == compares.',
        'Lists are ordered, indexed from 0.',
        'def defines a function; return gives back a value.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is "3" + 3 a TypeError in Python but "3" + 3 produces "33" in JavaScript?',
      hint: 'JavaScript silently CONVERTS one of them — usually the number to a string, giving "33". Python forces you to be explicit. The Python behavior catches more bugs early; the JS behavior is "convenient" but causes mysterious results when you didn\'t intend the conversion.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
