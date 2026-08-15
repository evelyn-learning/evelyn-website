/**
 * Grades 11-12 Computer Science — Object-Oriented Programming.
 *
 * Classes, instances, encapsulation, inheritance, polymorphism.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_CS_OOP: LessonPlan = {
  id: 'evelyn.cs.11-12.oop.v1',
  title: 'Object-oriented programming — classes, inheritance, polymorphism',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'cs',
  topic: 'oop',
  locale: 'en',
  los: [
    {
      id: 'cs1112.oop',
      description: 'Define classes, instantiate objects, and use inheritance and polymorphism appropriately.',
      standard: 'CSTA-3B-AP-15',
    },
  ],
  prerequisites: ['cs910.python'],
  followUps: ['cs1112.mobile'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame OOP as bundling data with the operations that use it.',
      script: 'In procedural code, data and functions are separate. A "student" is a dictionary; "give_grade" is a free function that takes the dictionary. OOP says: bundle them. A Student CLASS holds both the data AND the methods. The result is code that more closely matches how we already think about the world: things that DO things.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-oop',
      kind: 'concept',
      goal: 'Class, instance, attribute, method, inheritance, polymorphism.',
      keyIdeas: [
        'CLASS: the blueprint. INSTANCE (or object): one specific thing built from the blueprint.',
        'class Student: starts the blueprint. self refers to the instance currently being acted on.',
        '__init__ is the constructor: runs when you make a new instance.',
        'ATTRIBUTES (data on instance): self.name, self.scores. METHODS (functions on instance): def average(self).',
        'ENCAPSULATION: keep data inside the object; outside code uses methods, not direct attribute access.',
        'INHERITANCE: class HonorsStudent(Student) — inherits everything Student has, can add or override.',
        'POLYMORPHISM: same method name, different behavior in different classes. animal.speak() — Dog says woof, Cat says meow.',
        'Composition vs inheritance: prefer combining objects (has-a) over deep inheritance trees (is-a) — easier to change.',
      ],
      vocabulary: [
        { term: 'class', definition: 'a blueprint that bundles data and behavior under one name.' },
        { term: 'inheritance', definition: 'one class deriving attributes/methods from another.' },
        { term: 'polymorphism', definition: 'same method name, different behavior depending on the object.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-class',
      kind: 'worked_example',
      problem: 'Define a Student class with a name, a scores list, and an average() method.',
      steps: [
        'class Student:',
        '    def __init__(self, name):',
        '        self.name = name',
        '        self.scores = []',
        '',
        '    def add_score(self, score):',
        '        self.scores.append(score)',
        '',
        '    def average(self):',
        '        if not self.scores: return 0',
        '        return sum(self.scores) / len(self.scores)',
        '',
        'maya = Student("Maya")',
        'maya.add_score(85)',
        'maya.add_score(92)',
        'print(maya.average())   # 88.5',
      ],
      answer: 'A working Student class with init, add_score, average.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You want HonorsStudent to be a Student that adds 10 bonus points to its average. Which OOP feature do you use?',
      expectedAnswer: 'inheritance (subclass HonorsStudent extends Student) and override average()',
      responseFormat: 'free',
      hints: [
        'You want all the existing Student behavior PLUS one tweak.',
        'Don\'t copy-paste — extend.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-self',
      kind: 'misconception_check',
      question: 'A student writes def average(): instead of def average(self):. Why does Python complain?',
      commonErrors: [
        {
          answer: 'spelling',
          misconception: 'Forgetting that instance methods need self.',
          correctsTo: 'When you call maya.average(), Python passes maya as the first argument automatically. The method definition has to RECEIVE that argument as a parameter — by convention named self. Without self in the signature, the call passes too many arguments and Python raises a TypeError.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Class = blueprint, instance = built thing.',
        '__init__ is the constructor; self is the current instance.',
        'Inheritance: extend an existing class without rewriting it.',
        'Polymorphism: same method name behaves differently per class.',
        'Prefer composition (has-a) over deep inheritance trees.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Some modern languages (Rust, Go) avoid traditional class inheritance. What replaces it?',
      hint: 'INTERFACES / TRAITS: define what methods a type must implement, without dictating its data layout. A type implements many traits, no inheritance tree. This avoids "fragile base class" problems where changing a parent breaks descendants you didn\'t know about.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
