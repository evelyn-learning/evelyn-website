/**
 * G4 — ELA: Theme / lesson in literature.
 *
 * Theme is the lesson or message a story teaches — not the plot.
 * G4 tightens the G3 story-elements intro to focus on theme: how
 * to find it, how to phrase it (a complete sentence about LIFE,
 * not the specific story), and the difference between theme and
 * topic / summary.
 */

import type { LessonPlan } from '../types';

export const SEED_G4_ELA_THEME_LESSON: LessonPlan = {
  id: 'evelyn.g4.ela.theme-lesson.v1',
  title: 'Theme: The Lesson of the Story',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'ela',
  topic: 'literature',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.rl.4.2',
      description: 'Determine a theme of a story, drama, or poem from details in the text.',
      standard: 'CCSS.ELA-LITERACY.RL.4.2',
    },
  ],
  prerequisites: ['ccss.ela.rl.3.2'],
  followUps: ['ccss.ela.rl.5.2'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a familiar fable to anchor "theme = the lesson the story is teaching".',
      script: 'In the story of the tortoise and the hare, the slow tortoise wins by being steady and not giving up. The author isn\'t writing a tortoise biography — they\'re teaching a lesson: slow and steady wins the race. That lesson — the BIG IDEA you can take into your own life — is the THEME.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-theme',
      kind: 'concept',
      goal: 'Theme as a life lesson, distinguishable from topic and from summary.',
      keyIdeas: [
        'THEME = the lesson, message, or big idea about LIFE that a story conveys.',
        'A theme is usually a complete sentence about how the world works ("hard work pays off") — NOT a single noun ("hard work").',
        'TOPIC vs THEME:',
        '  Topic is what the story is about (one or two words: friendship, courage, family).',
        '  Theme is what the story SAYS about that topic ("True friends help each other in hard times").',
        'SUMMARY vs THEME:',
        '  Summary tells what HAPPENED in this specific story.',
        '  Theme is the bigger lesson that could apply to MANY stories or to real life.',
        'Theme is usually NOT directly stated — you infer it from the characters\' choices and the story\'s outcome.',
        'A story can have more than one theme. Different readers might pick different ones.',
        'Strategy: ask "what changed for the main character?" and "what does the ending teach me?".',
      ],
      vocabulary: [
        { term: 'theme', definition: 'the lesson or message a story teaches.' },
        { term: 'moral', definition: 'a clearly stated lesson, usually in a fable.' },
      ],
      suggestedTools: ['show_concept_map', 'show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-tortoise-hare',
      kind: 'worked_example',
      problem: 'What is the theme of "The Tortoise and the Hare"?',
      steps: [
        'Topic: maybe "winning a race", or "different speeds", or "patience".',
        'What changes for the main character? The hare loses despite being faster, because he was overconfident and napped.',
        'What does the ending teach? Steady effort beats raw talent if the talented one slacks off.',
        'Phrase as a life lesson (complete sentence about life, not just this story): "Slow and steady wins the race" or "Don\'t underestimate your competition".',
      ],
      answer: 'Slow and steady wins the race / Hard work beats overconfidence',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In "The Boy Who Cried Wolf", a shepherd boy keeps falsely calling for help. When a real wolf comes, no one believes him. What\'s the theme?',
      expectedAnswer: 'Liars aren\'t believed even when they tell the truth / Honesty matters',
      responseFormat: 'free',
      hints: [
        'What changed for the boy? People stopped believing him.',
        'What does the ending teach about lying?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-summary-as-theme',
      kind: 'misconception_check',
      question: 'For "The Tortoise and the Hare", Maya says the theme is "A tortoise raced a hare and won." What\'s the issue?',
      commonErrors: [
        {
          answer: 'nothing — that\'s the theme',
          misconception: 'Confusing summary (what happened) with theme (the lesson).',
          correctsTo: 'That\'s a SUMMARY of this specific story. Theme is the BIG lesson that applies BEYOND this story — to real life. "Slow and steady wins the race" is a theme because it applies to many situations. Tortoises racing hares applies only to this one story.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Theme = lesson about LIFE that the story teaches.',
        'Phrase it as a complete sentence, not a single word.',
        'Topic vs theme: topic is what it\'s about; theme is what it SAYS about that.',
        'Summary vs theme: summary tells THIS story; theme tells a lesson about LIFE.',
        'Theme is usually not stated directly — infer it from what changes and how the story ends.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Pick a story you\'ve read recently. What is one possible theme? What evidence in the story supports it?',
      hint: 'Look at how the main character changed and what the ending suggests is important.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
