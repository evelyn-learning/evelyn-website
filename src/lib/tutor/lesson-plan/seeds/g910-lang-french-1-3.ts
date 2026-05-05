import type { LessonPlan } from '../types';

export const SEED_G910_LANG_FRENCH_1_3: LessonPlan = {
  id: 'evelyn.lang.9-10.french-1-3.v1',
  title: 'French I-III — passé composé vs imparfait',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'languages',
  topic: 'french-1-3',
  locale: 'en',
  los: [
    { id: 'lang910.fr.composed-imparfait', description: 'Distinguish passé composé (completed past) from imparfait (ongoing past).', standard: 'ACTFL-Intermediate-Low' },
  ],
  prerequisites: ['lang68.fr2.present-er'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the past-tense split as the same idea Spanish has.',
      script: 'Like Spanish, French splits the past into "what happened once" and "what was going on / used to happen". Passé composé for completed; imparfait for ongoing/habitual. Mastering this split takes you from intermediate to natural-sounding French.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-pc-imp',
      kind: 'concept',
      goal: 'Formation + when to use each.',
      keyIdeas: [
        'PASSÉ COMPOSÉ = avoir/être conjugated + past participle. "J\'ai mangé" (I ate). Most verbs use avoir; movement/state-change verbs use être.',
        'PAST PARTICIPLES: -er → -é (parlé). -ir → -i (fini). -re → -u (vendu). Many irregulars.',
        'WITH ÊTRE: agreement with subject. "Elle est allée" (she went) — final e + s match feminine subject.',
        'IMPARFAIT = stem of "nous" form (drop -ons) + -ais, -ais, -ait, -ions, -iez, -aient.',
        'EXAMPLE parler → nous parlons → parl- → je parlais, tu parlais, il parlait, nous parlions, vous parliez, ils parlaient.',
        'PASSÉ COMPOSÉ for completed events; IMPARFAIT for ongoing/habitual/descriptive.',
        'TRIGGERS: hier, soudain, une fois → PC. souvent, tous les jours, quand j\'étais petit → imparfait.',
      ],
      vocabulary: [
        { term: 'passé composé', definition: 'compound past tense for completed actions.' },
        { term: 'imparfait', definition: 'imperfect tense for ongoing/habitual past.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-translate',
      kind: 'worked_example',
      problem: 'Translate: "When I was young, I played soccer every Saturday."',
      steps: [
        '"I was young" — descriptive past → imparfait. j\'étais jeune.',
        '"I played soccer every Saturday" — habitual → imparfait. je jouais au foot tous les samedis.',
        'Result: "Quand j\'étais jeune, je jouais au foot tous les samedis."',
        'No passé composé — both clauses describe habits/states.',
      ],
      answer: 'Quand j\'étais jeune, je jouais au foot tous les samedis.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Translate: "Yesterday she went to the cinema."',
      expectedAnswer: 'Hier elle est allée au cinéma. (être + agreement -e)',
      responseFormat: 'free',
      hints: [
        '"Aller" is an être verb.',
        'Past participle agrees with feminine subject.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Passé composé = avoir/être + past participle.',
        'Être verbs (DR/MRS VANDERTRAMP): aller, venir, naître, mourir, etc. Past participle agrees.',
        'Imparfait endings: -ais, -ais, -ait, -ions, -iez, -aient.',
        'Completed → PC. Ongoing/habitual → imparfait.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
