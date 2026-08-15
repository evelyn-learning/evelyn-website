/**
 * Grades 3-5 ELA — Narrative Writing (Developed).
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_NARRATIVE_DEVELOPED: LessonPlan = {
  id: 'evelyn.g35.ela.narrative-developed.v1',
  title: 'Grades 3-5 ELA — Narrative Writing',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.narrative-developed',
      description: 'Write a narrative with a clear beginning, middle, and end; develop characters and setting; use dialogue and descriptive details.',
      standard: 'CCSS.ELA-LITERACY.W.4.3',
    },
  ],
  prerequisites: ['g35.ela.paragraph-structure'],
  followUps: ['g35.ela.informational-writing'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Every story you love follows the same shape — beginning, middle, end. Knowing the shape lets you BUILD stories.',
      script: 'Think of your favourite movie or book. It opens by introducing characters and setting. The middle has a problem and tries to fix it. The end resolves the problem. That arc is universal — and you can use it for your own narratives.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-narrative',
      kind: 'concept',
      goal: 'Story arc + characters + setting + dialogue + descriptive details.',
      keyIdeas: [
        'BEGINNING: introduce the main character, setting, and the problem (conflict). Hook the reader.',
        'MIDDLE: events unfold; main character tries to solve the problem. Build tension. Include 2-3 events.',
        'END: resolve the problem. Show how the character changed.',
        'CHARACTER: give your main character a name, a personality, a goal. Show through actions and dialogue, not just descriptions.',
        'SETTING: where and when the story happens. Use sensory details — sights, sounds, smells.',
        'DIALOGUE: characters talking to each other. Use quotation marks and a new line per speaker. Adds energy.',
        'SHOW DON\'T TELL: instead of "Sam was scared," write "Sam\'s hands trembled, and he hid behind the door." The reader infers fear.',
        'DESCRIPTIVE DETAILS: specific over general. Not "a tree" but "a gnarled oak with low branches".',
        'TRANSITIONS for story: first, then, next, suddenly, after that, finally.',
      ],
      vocabulary: [
        { term: 'narrative', definition: 'a story — written or spoken — with characters, a setting, and events.' },
        { term: 'show don\'t tell', definition: 'a writing technique that conveys ideas through action and detail rather than direct statement.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-narrative',
      kind: 'worked_example',
      problem: 'Outline a short narrative about a child who finds a lost puppy.',
      steps: [
        'BEGINNING: "On a cold Saturday morning, Aria walked to the park. She heard a tiny whimper coming from the bushes." (Character: Aria. Setting: park. Problem: discovers a lost puppy.)',
        'MIDDLE: "Aria knelt down and saw a small brown puppy shivering. She gently picked it up and looked for a collar — there wasn\'t one. She decided to check the lost-pet board at the local shelter, but it was a long walk in the cold." (Events: finds the puppy, looks for clues, walks to shelter.)',
        'END: "At the shelter, Aria pinned a flier with her phone number. That afternoon, a tearful family called. They had been searching for hours. As Aria handed back the puppy, she smiled — she had made two new friends." (Resolution: puppy reunited; character feels good.)',
      ],
      answer: 'Three-part narrative outline with character, setting, and resolution.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Take this telling sentence and rewrite it with "show don\'t tell": "Tom was excited about his birthday."',
      expectedAnswer: 'Sample: "Tom couldn\'t sit still. He bounced from foot to foot, glancing at the door every five seconds." (Or any rewrite that shows excitement through action.)',
      responseFormat: 'free',
      hints: [
        'What does excitement LOOK like? (jumping, smiling, fidgeting, talking fast)',
        'Pick one or two visible actions and use them.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-tell-everything',
      kind: 'misconception_check',
      question: 'A student writes "Sara was very, very, very scared." Why is this weak writing?',
      commonErrors: [
        {
          answer: '"Very, very, very scared"',
          misconception: 'Using intensifiers ("very") instead of vivid descriptions.',
          correctsTo: 'Repeated "very" doesn\'t make the fear feel real. SHOW the fear instead: "Sara\'s heart pounded. Her legs felt frozen. She tried to call out, but no sound came." Replace abstract intensifiers with concrete actions and physical reactions. Same idea, far more powerful.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Beginning, middle, end — every narrative.',
        'Establish character, setting, and conflict early.',
        'Show emotion through action, not adjectives.',
        'Use dialogue (with new line per speaker).',
        'Include sensory details to bring the setting alive.',
        'End by resolving the conflict and showing change.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does adding a single line of dialogue change the feeling of a story\'s opening?',
      hint: 'Compare: "Mark walked into school nervously" vs "Mark whispered to himself, \'I can do this,\' as he stepped through the school doors." Dialogue puts the reader inside the character\'s head, makes them feel present in the scene, and reveals personality. One line can transform a flat opening into one that grabs attention.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
