import type { LessonPlan } from '../types';

export const SEED_G910_LANG_SPANISH_1_3: LessonPlan = {
  id: 'evelyn.lang.9-10.spanish-1-3.v1',
  title: 'Spanish I-III — preterite vs imperfect',
  curriculum: 'CCSS',
  grade: '10',
  subject: 'languages',
  topic: 'spanish-1-3',
  locale: 'en',
  los: [
    { id: 'lang910.sp.preterite-imperfect', description: 'Distinguish preterite (completed past) from imperfect (ongoing past).', standard: 'ACTFL-Intermediate-Low' },
  ],
  prerequisites: ['lang68.sp2.ser-estar'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the past-tense split as a feature, not a flaw.',
      script: 'Spanish has TWO past tenses: PRETERITE (one-time completed actions) and IMPERFECT (ongoing or habitual past). English uses tone and context to convey this; Spanish bakes it into the verb. Once you internalize the distinction, your past-tense Spanish gets dramatically more precise.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-pret-imp',
      kind: 'concept',
      goal: 'When to use each + endings.',
      keyIdeas: [
        'PRETERITE = completed action with clear endpoint. "Comí pizza ayer" (I ate pizza yesterday).',
        'IMPERFECT = ongoing, habitual, descriptive past. "Comía pizza todos los viernes" (I used to eat pizza every Friday).',
        'PRETERITE -ar endings: -é, -aste, -ó, -amos, -asteis, -aron.',
        'PRETERITE -er/-ir endings: -í, -iste, -ió, -imos, -isteis, -ieron.',
        'IMPERFECT -ar endings: -aba, -abas, -aba, -ábamos, -abais, -aban.',
        'IMPERFECT -er/-ir endings: -ía, -ías, -ía, -íamos, -íais, -ían.',
        'TRIGGERS: ayer, anoche, una vez, en 2010 → preterite. siempre, todos los días, mientras, cuando era niño → imperfect.',
        'IRREGULAR PRETERITES (high-frequency): ir/ser → fui, fuiste, fue, fuimos, fuisteis, fueron. tener → tuve, tuviste, tuvo... ser/ir share preterite forms.',
      ],
      vocabulary: [
        { term: 'preterite', definition: 'past tense for completed one-time actions.' },
        { term: 'imperfect', definition: 'past tense for ongoing, habitual, or descriptive past.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-pick',
      kind: 'worked_example',
      problem: 'Pick preterite or imperfect: "When I was a child, I went to the beach every summer."',
      steps: [
        '"When I was a child" — describing past state — IMPERFECT (era).',
        '"every summer" — habitual action — IMPERFECT (iba).',
        'Spanish: "Cuando era niño, iba a la playa cada verano."',
        'No preterite needed — both verbs describe ongoing/habitual past.',
      ],
      answer: 'Both imperfect: era, iba',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Pick preterite or imperfect: "Yesterday I called my grandmother."',
      expectedAnswer: 'preterite — Llamé a mi abuela ayer (one completed action with a specific endpoint)',
      responseFormat: 'free',
      hints: [
        '"yesterday" is a key trigger.',
        'A one-time call is completed.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-default',
      kind: 'misconception_check',
      question: 'A student says: "I\'ll just always use the preterite — it\'s simpler." Why is that wrong?',
      commonErrors: [
        {
          answer: 'because it\'s past',
          misconception: 'Treating past tense as a single category.',
          correctsTo: 'You\'ll be misunderstood. "Iba al gimnasio" = I used to go to the gym (habitual). "Fui al gimnasio" = I went to the gym (one specific time). The wrong choice changes meaning, not just style.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Preterite = completed, specific. Imperfect = ongoing, habitual, descriptive.',
        'Trigger words help: ayer/anoche → preterite; siempre/cuando era → imperfect.',
        'Both tenses can appear in one sentence: imperfect for the setting, preterite for what happened.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
