/**
 * Grades 6-8 Computer Science — Intro to Coding.
 *
 * What "coding" means, sequence/selection/iteration, and why
 * computers are so literal. Language-agnostic; uses pseudocode.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_CS_INTRO_CODING: LessonPlan = {
  id: 'evelyn.cs.6-8.intro-coding.v1',
  title: 'Intro to coding — sequence, selection, iteration',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'cs',
  topic: 'intro-coding',
  locale: 'en',
  los: [
    {
      id: 'cs68.intro',
      description: 'Identify sequence, selection (if/else), and iteration (loops) as the three control-flow building blocks of any program.',
      standard: 'CSTA-2-AP-10',
    },
  ],
  prerequisites: [],
  followUps: ['cs68.scratch'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame coding as giving very precise instructions to a very literal helper.',
      script: 'Imagine telling someone to make a peanut butter sandwich, but they take EVERY word literally. "Open the jar" — they break it. "Spread peanut butter" — on the table. Computers are exactly that literal. Coding is the skill of writing instructions a totally literal helper can follow.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-controlflow',
      kind: 'concept',
      goal: 'Sequence + selection + iteration as the three pillars.',
      keyIdeas: [
        'SEQUENCE: instructions run one after another, top to bottom.',
        'SELECTION: "IF ... THEN ... ELSE" — the program picks a path based on a condition.',
        'ITERATION: "REPEAT" / "WHILE" / "FOR" — the program does something multiple times.',
        'Almost every program ever written is just sequences of these three ideas, nested.',
        'Pseudocode is fake-but-readable code that hides syntax to focus on logic.',
      ],
      vocabulary: [
        { term: 'sequence', definition: 'instructions executed in order, one after another.' },
        { term: 'condition', definition: 'a yes/no question the program asks at runtime.' },
        { term: 'loop', definition: 'a block that repeats while a condition is true.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-greet',
      kind: 'worked_example',
      problem: 'Write pseudocode that greets someone differently depending on the time of day.',
      steps: [
        'ASK user for the hour (0-23)',
        'IF hour < 12 THEN say "Good morning"',
        'ELSE IF hour < 18 THEN say "Good afternoon"',
        'ELSE say "Good evening"',
        '// This uses sequence (top-to-bottom) and selection (the if/else).',
      ],
      answer: 'A program with one input, two conditions, and three possible outputs.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Write pseudocode to print the numbers 1 through 5. Which control-flow idea do you need?',
      expectedAnswer: 'iteration (a loop)',
      responseFormat: 'free',
      hints: [
        'You don\'t want to write five PRINT lines if you can avoid it.',
        'Try: REPEAT 5 TIMES, or FOR i FROM 1 TO 5.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-literal',
      kind: 'misconception_check',
      question: 'A student says: "If I write \'walk to the door\' the computer will figure it out." Why is that wrong?',
      commonErrors: [
        {
          answer: 'computers are smart',
          misconception: 'Anthropomorphizing computers.',
          correctsTo: 'Computers don\'t infer intent. They follow exact instructions in the language they understand. "Walk to the door" is meaningless without code that defines what walk, to, the, and door mean. Coding is the practice of breaking fuzzy human instructions down into exact unambiguous steps.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three pillars: sequence, selection, iteration.',
        'Computers are literal — instructions must be unambiguous.',
        'Pseudocode helps you plan logic before worrying about syntax.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Modern AI like ChatGPT can take fuzzy instructions. Does that mean computers are no longer literal?',
      hint: 'AI MODELS handle ambiguity, but they themselves are programs of millions of literal instructions running on literal computers. The literalness is hidden behind statistical pattern matching, not removed.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
