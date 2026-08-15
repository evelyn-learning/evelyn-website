/**
 * AP CSA — Inheritance and Polymorphism.
 *
 * extends, super, method overriding, dynamic dispatch, abstract classes.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_CSA_INHERITANCE: LessonPlan = {
  id: 'evelyn.ap.csa.inheritance.v1',
  title: 'Inheritance and Polymorphism',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'cs',
  topic: 'ap-cs-a',
  locale: 'en',
  los: [
    {
      id: 'apcsa.inheritance',
      description: 'Use inheritance to extend classes, override methods, and apply polymorphism through dynamic dispatch.',
      standard: 'AP-CSA-9',
    },
  ],
  prerequisites: ['apcsa.objects-classes'],
  followUps: ['apcsa.arraylist'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Inheritance: write the common parts once.',
      script: 'A Dog and a Cat are both Animals. They share most behavior — eating, sleeping, having a name — but bark differently from meow. Inheritance lets you put the shared parts in an Animal class once, then customize what differs in subclasses. The tutor sometimes calls this DRY: don\'t repeat yourself.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-mechanics',
      kind: 'concept',
      goal: 'extends, super, overriding, dynamic dispatch.',
      keyIdeas: [
        'EXTENDS: class Dog extends Animal { ... }. Dog inherits all public/protected fields and methods.',
        'SUPER: super(args) calls the parent constructor; super.method() calls the parent\'s version of an overridden method.',
        'OVERRIDING: a subclass redefines an inherited method. Same signature, different body. Use @Override annotation — the compiler checks you matched the parent.',
        'DYNAMIC DISPATCH: the method that runs is decided at RUNTIME based on the object\'s actual type, not the declared variable type. Animal a = new Dog(); a.speak(); → calls Dog.speak() if overridden.',
        'IS-A relationship: Dog IS-A Animal. Dog d = new Dog(); Animal a = d; works (upcast). Animal a = new Animal(); Dog d = (Dog) a; needs CAST (downcast) and may throw ClassCastException.',
        'OBJECT class: every Java class inherits from Object. Common methods: toString(), equals(), hashCode(). Often overridden.',
        'CONSTRUCTORS are NOT inherited. The first line of a child constructor implicitly calls super() unless you call super(args) explicitly.',
        'ABSTRACT CLASSES: declared with `abstract` — can\'t instantiate, can have abstract methods (no body) that subclasses must implement.',
      ],
      vocabulary: [
        { term: 'override', definition: 'a subclass providing its own implementation of an inherited method.' },
        { term: 'polymorphism', definition: 'the ability for one variable type to refer to objects of multiple subclass types.' },
        { term: 'upcast', definition: 'assigning a subclass object to a parent-type reference; always safe.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-shapes',
      kind: 'worked_example',
      problem: 'Trace what this prints: class Shape { public String describe() { return "shape"; } } class Circle extends Shape { @Override public String describe() { return "circle"; } } Then: Shape s = new Circle(); System.out.println(s.describe());',
      steps: [
        'Variable s is declared Shape — at compile time, the compiler checks Shape has a describe() method. ✓',
        'At RUNTIME, s actually points to a Circle object.',
        'Method dispatch is dynamic: Java looks up describe() on the OBJECT\'s class (Circle), not the declared class (Shape).',
        'Circle.describe() returns "circle". That\'s what prints.',
        'KEY POINT: the variable type matters for what methods are CALLABLE. The object type matters for what RUNS.',
      ],
      answer: '"circle"',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Given class A { public String label() { return "A"; } } class B extends A { @Override public String label() { return "B"; } } and code: A a = new B(); B b = new B(); A ab = (A) b; What does a.label() + b.label() + ab.label() print?',
      expectedAnswer: 'BBB',
      responseFormat: 'free',
      hints: [
        'Dynamic dispatch always uses the OBJECT\'s class, not the variable\'s declared type.',
        'All three variables point to a B object.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-static-type',
      kind: 'misconception_check',
      question: 'Animal a = new Dog(); What does a.speak() call — Animal.speak() or Dog.speak()?',
      commonErrors: [
        {
          answer: 'Animal.speak() because a is declared Animal',
          misconception: 'Confusing compile-time type with runtime type.',
          correctsTo: 'Dog.speak(). Java uses DYNAMIC DISPATCH for instance methods. The variable type Animal only restricts WHICH METHODS you can call (must exist on Animal). The actual code that runs is from the object\'s real class — Dog. This is the heart of polymorphism.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'extends + override → polymorphism. Dynamic dispatch picks subclass\'s version at runtime.',
        'super(args) calls parent constructor. super.method() calls parent\'s overridden method.',
        'Variable type controls callable methods; object type controls which body runs.',
        'Constructors aren\'t inherited.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'What\'s the difference between an abstract class and an interface?',
      hint: 'Abstract class: can have fields, constructors, concrete methods AND abstract ones. Subclass uses extends, only ONE allowed. Interface: methods only (no state, mostly), classes implement, MULTIPLE allowed. Use abstract class for "is-a-kind-of"; use interface for "can-do".',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
