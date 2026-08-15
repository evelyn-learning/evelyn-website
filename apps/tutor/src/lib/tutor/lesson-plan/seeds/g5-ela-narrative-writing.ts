/**
 * G5 — ELA: Narrative writing structure (story arc, dialogue, sensory
 * details, transitions).
 *
 * The student writes a story with intentional structure — exposition,
 * rising action, climax, falling action, resolution. Plus the
 * craft moves that elevate it: dialogue (with proper formatting),
 * sensory details (the "show, don't tell" rule), and transition
 * words that signal time and order.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_ELA_NARRATIVE_WRITING: LessonPlan = {
  id: 'evelyn.g5.ela.narrative-writing.v1',
  title: 'Narrative Writing: Story Structure and Craft',
  curriculum: 'CCSS',
  grade: '5',
  subject: 'ela',
  topic: 'writing',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.w.5.3',
      description: 'Write narratives to develop real or imagined experiences with effective technique, descriptive details, and clear sequences.',
      standard: 'CCSS.ELA-LITERACY.W.5.3',
    },
  ],
  prerequisites: ['ccss.ela.w.4.3'],
  followUps: ['ccss.ela.w.6.3'],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: '"Show, don\'t tell" demo with two versions of the same line.',
      script: 'Two ways to write the same moment. Version 1: "She was scared." Version 2: "Her hands trembled, and she could hear her own heart pounding in her ears." Both are about fear. Which one made you FEEL it? That difference — show vs tell — is at the heart of strong narrative writing.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-arc-and-craft',
      kind: 'concept',
      goal: 'Five-part story arc + dialogue rules + sensory details + transitions.',
      keyIdeas: [
        'STORY ARC has five parts:',
        '  EXPOSITION: introduce characters, setting, normal life.',
        '  RISING ACTION: a problem starts; tension builds.',
        '  CLIMAX: the high point — the most intense moment, the turning point.',
        '  FALLING ACTION: events after the climax, working toward resolution.',
        '  RESOLUTION: the problem is solved (or not), things settle.',
        'DIALOGUE rules:',
        '  Each new speaker = NEW PARAGRAPH.',
        '  Quote marks AROUND the spoken words.',
        '  Comma INSIDE the quotes if a tag follows: "I\'m late," she said.',
        '  Question mark or exclamation point inside the quotes: "Where are you?" he asked.',
        'SENSORY details = describe what characters see, hear, smell, taste, feel. The reader experiences the scene.',
        '"SHOW, DON\'T TELL": instead of "she was nervous," show actions ("her foot tapped under the desk").',
        'TRANSITION words: "first", "then", "later", "suddenly", "afterwards", "meanwhile". Cue the reader on order and time.',
      ],
      vocabulary: [
        { term: 'exposition', definition: 'the opening of a story — introducing characters and setting.' },
        { term: 'climax', definition: 'the highest tension point of the story.' },
        { term: 'resolution', definition: 'the wrap-up where the problem is settled.' },
        { term: 'dialogue', definition: 'words that characters speak.' },
        { term: 'sensory details', definition: 'descriptions of what can be sensed (sight, sound, smell, taste, touch).' },
      ],
      suggestedTools: ['show_concept_map', 'show_text'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-show-dont-tell',
      kind: 'worked_example',
      problem: 'Rewrite "He was angry" using show-don\'t-tell.',
      steps: [
        'Identify the emotion: angry.',
        'Brainstorm physical signs of anger: tight jaw, clenched fists, raised voice, slammed doors, red face.',
        'Pick ONE or TWO that fit the scene. "His jaw tightened, and he slammed the door behind him."',
        'Reader infers anger from the action — more vivid than the label.',
      ],
      answer: 'e.g., "His jaw tightened, and he slammed the door."',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-dialogue-format',
      kind: 'worked_example',
      problem: 'Format this dialogue properly: jose said where are you going maya answered to the library',
      steps: [
        '"Where are you going?" Jose asked.',
        '"To the library," Maya answered.',
        'Two speakers, two paragraphs.',
        'Quote marks around exactly the spoken words.',
        'Question mark inside the quotes; comma inside the quotes for the tag.',
      ],
      answer: 'Properly formatted dialogue with paragraph breaks per speaker',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Rewrite "She was excited" using show-don\'t-tell.',
      expectedAnswer: 'e.g., "She bounced on her toes and couldn\'t stop grinning."',
      responseFormat: 'free',
      hints: [
        'What does excitement LOOK like?',
        'Body movements: bouncing, smiling, fast talking.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-tell-everything',
      kind: 'misconception_check',
      question: 'Sage writes "Maya was sad. She was so so sad. She was very sad and crying a lot." Anything wrong?',
      commonErrors: [
        {
          answer: 'no — it\'s clear how Maya feels',
          misconception: 'Repeating the LABEL ("sad") instead of showing it through specific details.',
          correctsTo: 'It\'s clear but flat. The reader knows the word "sad" but doesn\'t FEEL it. Better: "Maya buried her face in her pillow. The sleeve of her sweater was soaked from wiping her eyes." Same emotion, but you experience it through her actions.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Story arc: exposition → rising action → climax → falling action → resolution.',
        'Show, don\'t tell — describe actions and sensations, not labels.',
        'Dialogue: new paragraph per speaker; quote marks around spoken words; tag punctuation INSIDE quotes.',
        'Sensory details bring scenes to life.',
        'Transition words guide the reader through time.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Write a one-paragraph scene where the climax happens. Include at least one line of dialogue and one sensory detail.',
      hint: 'Pick the most intense moment. What do characters say, see, hear, feel?',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
