/**
 * Grades 6-8 ELA — Developed Narrative Writing.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_NARRATIVE_DEVELOPED: LessonPlan = {
  id: 'evelyn.g68.ela.narrative-developed.v1',
  title: 'Grades 6-8 ELA — Developed Narrative Writing',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.narrative-developed',
      description: 'Write narratives with developed characters, layered conflict, vivid setting, dialogue, and reflection.',
      standard: 'CCSS.ELA-LITERACY.W.7.3',
    },
  ],
  prerequisites: ['g68.ela.informational-research'],
  followUps: ['g68.ela.citing-evidence'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A middle-school narrative should feel ALIVE — characters with depth, settings you can picture, conflicts that matter.',
      script: 'Your elementary narratives followed the BME (beginning, middle, end) shape. Now we add depth: layered character motivations, sensory detail, dialogue that reveals personality, and reflection that gives meaning. Today we drill the techniques that turn good narratives into strong ones.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-narrative-developed',
      kind: 'concept',
      goal: 'Advanced narrative tools beyond elementary BME.',
      keyIdeas: [
        'CHARACTER DEPTH: give your protagonist internal tension. Not just "wants something" but "wants two contradictory things". Conflict comes from inside as well as outside.',
        'SETTING WITH SENSORY DETAILS: sight, sound, smell, touch, taste. Don\'t just describe — make the reader feel they\'re there.',
        'DIALOGUE WITH PURPOSE: each line of dialogue should reveal character or move the plot. Avoid filler ("Hi!" "How are you?").',
        'PACING: speed up during action; slow down during emotional moments. Long sentences for description; short ones for tension.',
        'SHOW DON\'T TELL: emotion through behaviour, not labels. "Her hands shook" beats "She was nervous."',
        'POINT OF VIEW: choose deliberately. First-person creates intimacy; third-person limited gives perspective. Stay consistent.',
        'REFLECTION (THEME): at the end, the narrator might note what was learned or how things changed. Not a moral lecture — a quiet realisation.',
        'STRONG OPENING: hook the reader in the first paragraph. In media res (mid-action) often works better than starting with "It was a sunny day".',
        'STRONG ENDING: avoid the "and then I woke up" cop-out. Earn your resolution through earlier setup.',
      ],
      vocabulary: [
        { term: 'in media res', definition: 'starting a story in the middle of action rather than at the chronological beginning.' },
        { term: 'pacing', definition: 'the speed at which a story unfolds, controlled by sentence length and detail density.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-developed',
      kind: 'worked_example',
      problem: 'Take this telling sentence and rewrite it with vivid setting + character behaviour: "Mark was scared at the haunted house."',
      steps: [
        'Sensory setting: "The haunted house door creaked open into a hallway lit only by the dim orange glow of a single bulb."',
        'Character behaviour: "Mark\'s hand hovered over the threshold, his palm slick. He swallowed once, twice, before stepping inside."',
        'Sound: "His own footsteps echoed too loudly on the warped wooden floor, as if announcing his arrival to whatever waited deeper in."',
        'Combined: a paragraph that SHOWS fear through the door creaking, the dim light, the slick palm, the swallowing, and the loud footsteps — without ever using the word "scared".',
      ],
      answer: 'Setting + behaviour reveal fear without telling.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Write a one-line piece of dialogue that reveals a character is jealous of her sister\'s success.',
      expectedAnswer: 'Sample: "Oh, ANOTHER award? Mom\'ll have to build a separate shelf for them at this point." — sarcasm + comparison reveals jealousy without naming it.',
      responseFormat: 'free',
      hints: [
        'Don\'t write "I\'m jealous" — show it through how she SAYS something.',
        'Sarcasm, dismissal, comparison are common signals.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-tell-emotion',
      kind: 'misconception_check',
      question: 'A student writes: "Sara was sad and mad and scared and confused all at once." Why is this weak narrative writing?',
      commonErrors: [
        {
          answer: 'Listing emotions',
          misconception: 'Naming feelings instead of dramatising them.',
          correctsTo: 'Listing emotions ("sad and mad and scared") tells the reader instead of showing. SHOW: "Sara stared at the empty chair. Her throat tightened. She wanted to scream — at her brother, at her mother, at the chair itself — but no sound came." That paragraph contains sadness, anger, and fear, all visible through behaviour rather than labelled. Always show, then trust the reader.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Internal + external conflict for character depth.',
        'Sensory details (5 senses) for setting.',
        'Dialogue should reveal character or move plot.',
        'Pacing: long for description, short for tension.',
        'Show don\'t tell — emotion through behaviour.',
        'Strong opening + earned ending. Reflection without lecture.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'When might a writer DELIBERATELY tell rather than show?',
      hint: 'When the writer wants to compress time or skim past unimportant details. "Three years passed" is a tell — but trying to "show" three uneventful years would bore the reader. Strategic telling moves the story along; selective showing builds the moments that matter. Skilled writers know when to use each.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
