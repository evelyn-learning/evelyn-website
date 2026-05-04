/**
 * Grades 9-12 ELA — Speech & Oral Presentation.
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_SPEECH_PRESENTATION: LessonPlan = {
  id: 'evelyn.g912.ela.speech-presentation.v1',
  title: 'Grades 9-12 ELA — Speech & Presentation',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.speech-presentation',
      description: 'Plan, draft, and deliver an effective oral presentation; apply rhetorical principles to spoken communication.',
      standard: 'CCSS.ELA-LITERACY.SL.11-12.4',
    },
  ],
  prerequisites: ['g912.ela.genre-comparison'],
  followUps: ['g912.ela.vocab-advanced'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Speaking publicly is one of the highest-impact skills you can develop in school.',
      script: 'Steve Jobs revolutionised product launches with presentation craft. MLK changed history with oratory. Job interviews, college essays, business pitches — all reward strong oral communication. Today we drill the principles.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-speech',
      kind: 'concept',
      goal: 'Structure + delivery + audience awareness + visual aid use.',
      keyIdeas: [
        'STRUCTURE: 1) HOOK to grab attention. 2) THESIS — what\'s your one main point? 3) BODY — 2-3 supporting points. 4) CONCLUSION — restate + call to action.',
        'OPENING HOOKS: surprising statistic, story, question, vivid image. NOT "Hi, today I\'m going to talk about…"',
        'RULE OF THREE: humans remember three things. Structure body around three key points.',
        'AUDIENCE: who are they? What do they care about? Adjust vocabulary, examples, tone accordingly.',
        'TONE: match the situation. Informal for peers, formal for adult panels.',
        'PACING: don\'t rush. Pauses are powerful. Practice keeps you under time.',
        'EYE CONTACT: scan the audience. Don\'t stare at notes or one person. Sweeping engagement.',
        'BODY LANGUAGE: open posture, gestures that emphasise. Avoid pacing or fidgeting.',
        'VISUAL AIDS (slides): minimum text, clear images. Slides SUPPORT, don\'t REPLACE the speaker. AVOID reading slides aloud.',
        'PRACTICE: rehearse OUT LOUD multiple times. Time yourself. Record and review.',
        'COMMON ERROR: speaking too fast. Anxiety speeds delivery. Slow down deliberately.',
        'RECOVERY: if you stumble, pause and continue. Don\'t apologise repeatedly.',
      ],
      vocabulary: [
        { term: 'rhetoric', definition: 'the art of effective speaking or writing; persuasion through structure and language.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-opening',
      kind: 'worked_example',
      problem: 'Write three different opening hooks for a 5-minute speech on the importance of recycling.',
      steps: [
        'STATISTIC HOOK: "Every minute, Americans throw away enough plastic to fill 75 garbage trucks. By the time I finish this speech, that number will be 375."',
        'STORY HOOK: "Last summer, I spent a weekend on a beach in California. The view was beautiful — until I noticed the line of plastic bottles, bags, and bottle caps stretching as far as I could see."',
        'QUESTION HOOK: "Raise your hand if you\'ve thrown away a plastic water bottle in the last week. [Pause.] Now, raise your hand if you know where it ended up. Today I want to answer that question."',
        'Each hook does something different but EACH grabs attention better than "Today I\'m going to talk about recycling."',
      ],
      answer: 'Three distinct hook types: statistic, story, question.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You have 5 minutes to argue for an extra recess in middle school. What 3 main points would you organise the speech around?',
      expectedAnswer: 'Sample three points: 1) Physical health — extra activity reduces obesity and stress. 2) Cognitive performance — breaks improve focus and learning. 3) Social development — unstructured play teaches negotiation and friendship.',
      responseFormat: 'free',
      hints: [
        'Three different angles — physical, mental, social, etc.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-read-slides',
      kind: 'misconception_check',
      question: 'A student presents by reading every word from text-heavy slides. Why is this poor delivery?',
      commonErrors: [
        {
          answer: 'Reading slides',
          misconception: 'Treating slides as scripts rather than visual aids.',
          correctsTo: 'Slides should support — not replace — the speaker. Reading word-for-word makes the speaker redundant; the audience could just read the slides themselves. Better: minimal text, key images, and let YOUR delivery convey the content. Use slides for what speech can\'t do (charts, photos). Speak in your own voice from notes, not from the screen.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Hook → thesis → 3 points → conclusion.',
        'Pace yourself; pauses are powerful.',
        'Eye contact across audience.',
        'Slides support, don\'t replace.',
        'Practise OUT LOUD multiple times.',
        'If you stumble: pause, continue, don\'t apologise.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why might pausing for 2-3 seconds before answering a question STRENGTHEN your authority?',
      hint: 'A pause signals consideration. Quick answers can sound rehearsed or defensive. Pausing shows you\'re THINKING about the question — taking it seriously. The pause also gives the speaker time to actually formulate a thoughtful answer rather than blurt. Watch experienced speakers in interviews; they pause regularly. Silence is a tool, not awkwardness.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
