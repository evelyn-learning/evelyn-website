/**
 * Grades 9-12 ELA — Advanced Narrative Writing.
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_NARRATIVE_ADVANCED: LessonPlan = {
  id: 'evelyn.g912.ela.narrative-advanced.v1',
  title: 'Grades 9-12 ELA — Advanced Narrative Writing',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.narrative-advanced',
      description: 'Write developed narratives demonstrating literary techniques: complex point of view, scene construction, voice, theme, and revision discipline.',
      standard: 'CCSS.ELA-LITERACY.W.11-12.3',
    },
  ],
  prerequisites: ['g912.ela.critical-reading'],
  followUps: ['g912.ela.analytical-essay'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'High-school narrative writing should produce work that could appear in a literary magazine, not just complete a homework prompt.',
      script: 'You\'ve already learned beginning, middle, end. Now we add: precise voice, scene construction, intentional pacing, theme through subtext, complex POV. These are the tools fiction writers use professionally. Today we drill them.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-narrative-advanced',
      kind: 'concept',
      goal: 'Advanced narrative tools.',
      keyIdeas: [
        'SCENE: a narrative unit where time slows, action unfolds, and characters interact in a specific moment. Most stories alternate scene with summary.',
        'SUMMARY: time compresses; events recounted briefly. "Three weeks passed."',
        'BALANCE: scenes for crucial moments; summary for transitions. Too much scene = bloated; too much summary = distant.',
        'VOICE: the distinctive personality of the narrator (or author). Built through diction, syntax, attitude. Practise consciously.',
        'THEME THROUGH SUBTEXT: don\'t state the theme. Let it emerge through choices, conflict, change. The reader should feel the theme without being told.',
        'POINT OF VIEW choices: first-person (intimate, limited), third-limited (one character\'s thoughts), third-omniscient (all-knowing), unreliable narrator (whose limits matter).',
        'COMPLEX CHARACTER: motivations conflict. Characters want contradictory things. Multi-dimensional, not stereotyped.',
        'IN MEDIA RES openings: start in the middle of action. Hook fast.',
        'REVISION DISCIPLINE: literary writers revise dozens of times. First draft is exploration; subsequent drafts refine. Cut beautiful sentences if they don\'t serve the whole.',
        'READ AS A WRITER: when you read literary fiction, notice CRAFT — pacing, word choice, structural moves. Then steal them.',
      ],
      vocabulary: [
        { term: 'scene', definition: 'a narrative unit where time slows and a specific moment unfolds in detail.' },
        { term: 'subtext', definition: 'meaning conveyed beneath the surface of dialogue or description.' },
        { term: 'unreliable narrator', definition: 'a narrator whose perspective is biased, mistaken, or deceptive in ways the reader must notice.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-narrative-advanced',
      kind: 'worked_example',
      problem: 'Take this generic moment and transform it into a SCENE with subtext: "Mark and his father had an argument about college."',
      steps: [
        'OPEN in scene: "Mark stared at the application. His father stood at the kitchen counter, slicing tomatoes with unnecessary precision."',
        'ESTABLISH conflict through DETAIL, not statement: precision-slicing reveals tension; tomatoes are mundane, hinting at controlled fury.',
        'DIALOGUE with subtext: \'"State school. That\'s where we always send the kids."\' "Mark didn\'t look up. \'Yes, sir.\'"',
        'INTERIOR (without overstating): "He had said nothing about Boston. He hadn\'t shown his father the application."',
        'END the scene with a choice or shift: "His father set down the knife. \'Dinner in twenty.\' He left the kitchen."',
        'EFFECT: the argument never happens explicitly. The TENSION and STAKES come through restraint. Theme: the cost of unspoken conflict.',
      ],
      answer: 'Scene constructed with subtext, dialogue, and restraint.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Rewrite this passage in first-person UNRELIABLE narration: "Sara was very calm during the meeting."',
      expectedAnswer: 'Sample (unreliable narrator): "I was perfectly calm during the meeting. The way my hands shook was just from too much coffee. Anyone watching would have called it stress, but they don\'t know me. I\'ve handled worse." (Reader senses she protests too much; her self-image conflicts with details.)',
      responseFormat: 'free',
      hints: [
        'Show the narrator\'s self-perception clashing with reality.',
        'Use details that give her away despite her claims.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-state-theme',
      kind: 'misconception_check',
      question: 'A student ends their narrative: "And so I learned that family is the most important thing." Why might this be weak craft?',
      commonErrors: [
        {
          answer: 'Stating theme directly',
          misconception: 'Telling the reader the lesson rather than letting them feel it.',
          correctsTo: 'Strong narratives let theme EMERGE through choices and consequences. The reader extracts the meaning. Stating it directly ("I learned that...") flattens the work — it tells rather than shows. Better: end with a concrete moment that EMBODIES the theme. "I sat at the kitchen table and watched my mother\'s hands as she sliced bread, the same way she had every Sunday." The reader feels family\'s weight without being lectured.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Scene vs summary; balance both.',
        'Voice through diction, syntax, attitude.',
        'Theme through subtext, never stated.',
        'POV deliberate.',
        'Characters have contradictory motivations.',
        'In media res openings; revision matters.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is RESTRAINT often more powerful than full description?',
      hint: 'When the reader fills in the gaps, they invest emotionally. A scene of grief that LISTS every emotion ("she felt sad and lost and angry") is less powerful than one that shows a single concrete detail ("her tea grew cold while she stared at the wall"). Restraint demands reader participation. Skilled writers trust the reader to feel without being told what to feel.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
