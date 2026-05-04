/**
 * Grades K-2 ELA — Opinion Writing.
 */

import type { LessonPlan } from '../types';

export const SEED_K2_ELA_OPINION_WRITING: LessonPlan = {
  id: 'evelyn.k2.ela.opinion-writing.v1',
  title: 'K-2 ELA — Opinion Writing',
  curriculum: 'CCSS',
  grade: 'K-2',
  subject: 'ela',
  topic: 'k2-ela',
  locale: 'en',
  los: [
    {
      id: 'k2.ela.opinion-writing',
      description: 'Write a simple opinion piece stating a preference and giving at least one reason.',
      standard: 'CCSS.ELA-LITERACY.W.1.1',
    },
  ],
  prerequisites: ['k2.ela.narrative-writing'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Saying what you THINK and WHY is the start of every persuasive essay you\'ll ever write.',
      script: 'You like pizza better than salad. Why? Maybe because it\'s warm and cheesy. That sentence — "I like pizza better than salad because it\'s warm and cheesy" — is a complete OPINION. Today we drill the recipe.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-opinion',
      kind: 'concept',
      goal: 'Opinion + reason + simple structure.',
      keyIdeas: [
        'OPINION = what you THINK or FEEL. Not a fact.',
        'Words that signal opinion: "I think...", "I like...", "My favourite is...", "The best is...".',
        'Words that signal fact: "There are 50 states." Facts are TRUE for everyone.',
        'OPINION must have a REASON. Without "why", an opinion is just a statement.',
        'STRUCTURE: 1) State your opinion. 2) Give a reason. 3) Add details if you can.',
        'EXAMPLE: "I think dogs are the best pets. Dogs play and run with you. They are loyal friends."',
        '"BECAUSE" is your friend. "I like X because Y."',
        'Use exactly your own opinion — there\'s no wrong opinion (just opinions with stronger or weaker reasons).',
        'CAPITAL letters and periods always matter.',
      ],
      vocabulary: [
        { term: 'opinion', definition: 'what someone thinks or feels — not a fact.' },
        { term: 'fact', definition: 'something that is true and can be proven.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-opinion',
      kind: 'worked_example',
      problem: 'Write an opinion piece about your favourite animal.',
      steps: [
        'Pick: I think CATS are the best animals.',
        'Reason 1: Cats are soft and cozy.',
        'Reason 2: Cats purr when they are happy.',
        'Reason 3: Cats are funny when they play.',
        'Combined: "I think cats are the best animals. Cats are soft and cozy. They purr when they are happy. They are funny when they play. That\'s why I love cats."',
      ],
      answer: 'Opinion + 3 reasons + closing.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Write 3 sentences about your favourite season. Include your opinion AND at least one reason.',
      expectedAnswer: 'Sample: "My favourite season is summer. The sun is warm and bright. I can swim and play outside all day."',
      responseFormat: 'free',
      hints: [
        'Sentence 1: state your favourite.',
        'Sentence 2-3: WHY?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-no-reason',
      kind: 'misconception_check',
      question: 'A child writes only: "Pizza is the best food." Is this strong opinion writing?',
      commonErrors: [
        {
          answer: 'Just stating preference',
          misconception: 'Stating an opinion without giving any reason.',
          correctsTo: 'Without a REASON, the opinion can\'t convince anyone. Add why: "Pizza is the best food. The cheese is melty. The sauce is tasty. You can have any toppings you like." Now the reader can SEE why you think it. Always add reasons — at least one!',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Opinion = what you think.',
        'Always add a REASON.',
        'Use "because", "I think", "my favourite".',
        'Structure: opinion + reason + details + closing.',
        'No wrong opinions; just stronger or weaker reasons.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why do you think people sometimes change their opinions?',
      hint: 'When they hear new reasons or learn new facts. If a friend explains a new viewpoint, or you try something new and it\'s better than expected, your opinion can shift. Smart people are willing to change opinions when they see good reasons. Strong opinion writing acknowledges this — it\'s confident but not stubborn.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
