/**
 * AP Computer Science A — Objects, classes, methods.
 *
 * Java-focused. Class as blueprint, object as instance, methods,
 * fields, constructors. Encapsulation and the public/private split.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CSA_OBJECTS_CLASSES: LessonPlan = {
  id: 'evelyn.ap.csa.objects-classes.v1',
  title: 'Objects and classes (Java)',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'cs',
  topic: 'ap-cs-a',
  locale: 'en',
  los: [
    {
      id: 'apcsa.classes',
      description: 'Define classes with fields, constructors, and methods; instantiate objects.',
      standard: 'AP-CSA-MOD-2',
    },
  ],
  prerequisites: [],
  followUps: ['apcsa.inheritance'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame class as blueprint, object as the actual thing.',
      script: 'A blueprint for a HOUSE isn\'t a house — but you can build many houses from one blueprint. In Java, a CLASS is the blueprint, and an OBJECT is the actual house. Object-oriented programming starts here.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-class-anatomy',
      kind: 'concept',
      goal: 'Class structure + objects + methods + encapsulation.',
      keyIdeas: [
        'CLASS: a blueprint defining FIELDS (data) and METHODS (behavior).',
        'OBJECT: an instance of a class — a specific thing built from the blueprint.',
        'FIELDS (instance variables): data each object holds. e.g., a Dog class might have fields name, breed, age.',
        'METHODS: actions an object can perform. e.g., bark(), fetch(), sleep().',
        'CONSTRUCTOR: special method called when creating an object. Initializes fields. Same name as class.',
        'public class Dog { String name; int age; public Dog(String n, int a) { name = n; age = a; } public void bark() { System.out.println("Woof"); } }',
        'CREATE OBJECT: Dog rex = new Dog("Rex", 3);',
        'CALL METHOD: rex.bark();',
        'ENCAPSULATION: hide fields with PRIVATE. Expose behavior with PUBLIC. Forces callers to go through methods, not direct field access.',
        'GETTERS / SETTERS: methods that READ (getName()) or MODIFY (setAge()) private fields. Allows control: validation, logging, security.',
        'this KEYWORD: refers to the current object. this.name = name distinguishes the field from a parameter of the same name.',
      ],
      vocabulary: [
        { term: 'class', definition: 'a blueprint for objects, defining fields and methods.' },
        { term: 'object', definition: 'an instance of a class.' },
        { term: 'encapsulation', definition: 'hiding internal state, exposing controlled behavior.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-dog-class',
      kind: 'worked_example',
      problem: 'Walk through the Dog class with a private field and getter.',
      steps: [
        'public class Dog {',
        '  private String name;  // private field — outside code cannot access directly.',
        '  public Dog(String n) { name = n; }  // constructor: takes name, sets field.',
        '  public String getName() { return name; }  // getter: controlled READ access.',
        '}',
        'Usage: Dog rex = new Dog("Rex"); String s = rex.getName();  // → "Rex"',
        'Why private + getter? Later, you might add validation or logging in getName() — and existing callers don\'t need to change. Encapsulation makes change safe.',
      ],
      answer: 'private field + public getter = encapsulated read access',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is encapsulation important for big programs?',
      expectedAnswer: 'lets you change internal implementation without breaking code that uses the class',
      responseFormat: 'free',
      hints: [
        'Direct field access creates tight coupling.',
        'Method-based access lets you evolve the class internals safely.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-class-vs-object',
      kind: 'misconception_check',
      question: 'When you write "Dog rex = new Dog(...)", is "Dog" the object?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing class with object.',
          correctsTo: 'No — Dog is the CLASS (blueprint). rex is the OBJECT (instance built from the blueprint). You can have many Dog objects: rex, fido, max — all from the same class.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'CLASS = blueprint. OBJECT = instance.',
        'Class has FIELDS (data) and METHODS (behavior).',
        'CONSTRUCTOR initializes a new object.',
        'Encapsulation: private fields + public getters/setters.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might a class have NO fields and only methods?',
      hint: 'Utility / helper classes (Math.sqrt, Arrays.sort) often have no state — just functionality. Marked static. They live without instances. Pattern is "namespace for related operations".',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
