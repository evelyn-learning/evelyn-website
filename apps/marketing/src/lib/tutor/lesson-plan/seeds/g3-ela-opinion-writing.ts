/**
 * G3 — ELA: Opinion writing (state-evidence-conclude structure).
 *
 * The first formal essay structure. State an OPINION, back it up
 * with REASONS or EXAMPLES, wrap with a CONCLUSION. Anchored on a
 * familiar prompt (favorite season, best pet) so the student can
 * focus on STRUCTURE rather than picking what to say.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_ELA_OPINION_WRITING: LessonPlan = {
  id: 'evelyn.g3.ela.opinion-writing.v1',
  title: 'Opinion Writing: Reasons and Examples',
  curriculum: 'CCSS',
  grade: '3',
  subject: 'ela',
  topic: 'writing',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.w.3.1',
      description: 'Write opinion pieces on topics or texts, supporting a point of view with reasons.',
      standard: 'CCSS.ELA-LITERACY.W.3.1',
    },
  ],
  prerequisites: [],
  followUps: ['ccss.ela.w.4.1'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame opinion writing as making someone agree with you.',
      script: 'Imagine you want to convince a friend that pizza is better than tacos. "Because I said so" won\'t work. You need REASONS — pizza has cheese, you can pick toppings, leftovers are great. The same trick works in writing: state your opinion, then give reasons, then wrap up.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-structure',
      kind: 'concept',
      goal: 'Four-part structure: opinion → reasons (with examples) → linking words → conclusion.',
      keyIdeas: [
        'OPINION = what you think or feel about something. Different people can have different opinions.',
        'A good opinion piece has FOUR PARTS:',
        '1) STATE YOUR OPINION clearly in the first sentence. ("I think pizza is the best food.")',
        '2) GIVE REASONS, usually 2-3, each with an EXAMPLE or detail. ("First, pizza has melted cheese, which tastes amazing.")',
        '3) USE LINKING WORDS to connect the parts: "first", "also", "in addition", "for example", "another reason".',
        '4) WRAP WITH A CONCLUSION that restates the opinion in different words. ("That\'s why pizza is the best food in my opinion.")',
        'A REASON answers "why?". An EXAMPLE makes the reason concrete.',
        'KEEP THE OPINION CONSISTENT. If you start saying pizza is best, don\'t end by talking about tacos.',
        'Strong opinion pieces use SPECIFIC examples, not vague claims. "Cheese is yummy" is weak; "the cheese stretches when you pull a slice" is strong.',
      ],
      vocabulary: [
        { term: 'opinion', definition: 'what someone thinks or feels — not a fact.' },
        { term: 'reason', definition: 'why someone holds an opinion.' },
        { term: 'linking word', definition: 'a word or phrase that connects ideas (first, also, because).' },
      ],
      suggestedTools: ['show_concept_map', 'show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-pizza',
      kind: 'worked_example',
      problem: 'Write a short opinion paragraph about why pizza is the best food.',
      steps: [
        'OPINION: "Pizza is the best food."',
        'REASON 1 + EXAMPLE: "First, pizza has melted cheese that stretches when you pull a slice."',
        'REASON 2 + EXAMPLE: "Also, you can pick your own toppings — pepperoni, mushrooms, even pineapple."',
        'REASON 3 + EXAMPLE: "In addition, leftover pizza is even better the next day for breakfast."',
        'CONCLUSION: "For these reasons, pizza is hard to beat."',
      ],
      answer: 'See model paragraph above',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Write the opening opinion sentence and ONE reason+example for: "Which season is best?"',
      expectedAnswer: 'Opening (e.g., "Summer is the best season.") + reason ("First, you can swim and stay outside late.")',
      responseFormat: 'free',
      hints: [
        'Pick a season — any one.',
        'State your opinion in one sentence.',
        'Reason should answer "why is summer best?"',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-fact-vs-opinion',
      kind: 'misconception_check',
      question: 'For a "best season" opinion piece, Owen writes "Summer is the warmest season in most places." What\'s the issue?',
      commonErrors: [
        {
          answer: 'nothing',
          misconception: 'Stating a FACT instead of an OPINION.',
          correctsTo: 'That\'s a fact, not an opinion. An opinion is what someone thinks or feels — not measurable. "Summer is best" is opinion. "Summer is warmest" is fact. Opinion writing should LEAD with what you think, then back it with reasons (which can include facts).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Structure: opinion → reasons (with examples) → conclusion.',
        'Linking words: first, also, in addition, for example, another reason.',
        'Opinion = what you think. Fact = what can be measured/checked.',
        'Specific examples beat vague claims.',
        'Conclude by restating the opinion in different words.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Now write a counter-piece — a paragraph arguing the OPPOSITE opinion to one you just wrote. Did you have to find different reasons?',
      hint: 'Strong opinion writers can argue both sides. The skill is structure, not which opinion you actually hold.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
