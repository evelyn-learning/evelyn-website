/**
 * Grades 6-8 ELA — Tone & Mood.
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_TONE_MOOD: LessonPlan = {
  id: 'evelyn.g68.ela.tone-mood.v1',
  title: 'Grades 6-8 ELA — Tone & Mood',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.tone-mood',
      description: 'Distinguish tone (author\'s attitude) from mood (reader\'s feeling); identify both using textual evidence.',
      standard: 'CCSS.ELA-LITERACY.RL.7.4',
    },
  ],
  prerequisites: ['g68.ela.symbolism-motif'],
  followUps: ['g68.ela.argument-cer'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Tone and mood get confused often — but they\'re different ends of a single transmission: author → reader.',
      script: 'TONE = how the AUTHOR feels about the subject. MOOD = how the READER feels while reading. An author\'s mocking tone produces a critical mood in the reader. Today we drill the difference + how to spot both.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-tone-mood',
      kind: 'concept',
      goal: 'Definitions + signals + analysis approach.',
      keyIdeas: [
        'TONE: author\'s ATTITUDE toward the subject or audience. Conveyed through word choice, sentence structure, details emphasised.',
        'COMMON TONES: serious, playful, sarcastic, urgent, nostalgic, formal, sympathetic, critical, hopeful.',
        'MOOD: emotional ATMOSPHERE the reader feels. Created by setting, imagery, pacing.',
        'COMMON MOODS: tense, joyful, melancholy, mysterious, peaceful, hopeful, ominous.',
        'WORD CHOICE (DICTION) shapes tone: "the troops marched" vs "the troops trudged" — same event, different attitude (heroic vs weary).',
        'IMAGERY shapes mood: dark woods, howling wind → tense, eerie. Sunny meadow, butterflies → peaceful.',
        'TONE CAN SHIFT within a piece. Strong analysis notes the shift and what triggers it.',
        'IDENTIFY tone: ask "how does the author feel about this?" Identify mood: ask "how do I FEEL reading this?"',
      ],
      vocabulary: [
        { term: 'tone', definition: 'the author\'s attitude toward subject or audience, conveyed through diction and style.' },
        { term: 'mood', definition: 'the emotional atmosphere a work creates in the reader.' },
        { term: 'diction', definition: 'word choice; central to establishing tone.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-tone-mood',
      kind: 'worked_example',
      problem: 'Identify tone and mood: "The fog crept slowly through the deserted streets, swallowing each lamppost in cold grey silence. Maya\'s footsteps echoed louder than they should have."',
      steps: [
        'TONE: how does the author feel about this scene? Words like "crept", "deserted", "swallowing", "cold grey silence", "louder than they should have" suggest the author finds this scene unsettling and is conveying that. TONE: ominous, suspenseful.',
        'MOOD: how do I feel reading this? Tense, anxious, perhaps a bit fearful. MOOD: tense / eerie.',
        'Both align here — author\'s ominous tone produces a tense mood. They CAN diverge (e.g. an author with a sarcastic tone about a serious event might create mocking mood).',
      ],
      answer: 'Tone: ominous. Mood: tense / eerie.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In: "Children laughed and chased each other through the bright sunlit garden as bees hummed lazily nearby." — what is the mood?',
      expectedAnswer: 'Joyful, peaceful, idyllic.',
      responseFormat: 'free',
      hints: [
        'Imagery: laughter, sunlight, lazy bees.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-conflate',
      kind: 'misconception_check',
      question: 'A student treats "tone" and "mood" as interchangeable. Why is this wrong?',
      commonErrors: [
        {
          answer: 'Tone = mood',
          misconception: 'Treating tone and mood as the same thing because both involve "feeling".',
          correctsTo: 'TONE = author\'s attitude (how AUTHOR feels). MOOD = reader\'s emotion (how READER feels). They\'re ALIGNED but distinct. Author can adopt sarcastic tone toward a serious subject, creating a mood that\'s critical or angry in the reader. Always specify whose feeling you mean.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Tone: author\'s attitude.',
        'Mood: reader\'s emotion.',
        'Word choice (diction) drives tone. Imagery drives mood.',
        'Note tone shifts and what triggers them.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How can a single piece have multiple tones?',
      hint: 'Tone often shifts when the subject shifts. A memoir might be nostalgic when reflecting on childhood, and bitter when describing a betrayal, in adjacent paragraphs. Strong analysis notes WHERE shifts occur and what triggers them — usually a subject change, a turning point, or character introduction.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
