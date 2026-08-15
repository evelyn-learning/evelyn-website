import type { LessonPlan } from '../types';

export const SEED_G1112_LANG_SPANISH_4_PLUS: LessonPlan = {
  id: 'evelyn.lang.11-12.spanish-4-plus.v1',
  title: 'Spanish IV+ — subjunctive mood',
  curriculum: 'CCSS',
  grade: '12',
  subject: 'languages',
  topic: 'spanish-4-plus',
  locale: 'en',
  los: [
    { id: 'lang1112.sp.subjunctive', description: 'Recognize and form the present subjunctive in Spanish for desire, doubt, emotion, and impersonal expressions.', standard: 'ACTFL-Intermediate-High' },
  ],
  prerequisites: ['lang910.sp.preterite-imperfect'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the subjunctive as a MOOD, not a tense.',
      script: 'The subjunctive isn\'t WHEN something happens — it\'s the speaker\'s ATTITUDE toward what they\'re saying. Wish, doubt, emotion, hypothetical. English barely has it ("if I were you"). Spanish uses it constantly. Once you learn the triggers, the forms come quickly.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-subjunctive',
      kind: 'concept',
      goal: 'Formation + WEIRDO triggers.',
      keyIdeas: [
        'PRESENT SUBJUNCTIVE FORMATION: take the "yo" form of present indicative, drop -o, add OPPOSITE-vowel endings.',
        '-AR verbs use -e, -es, -e, -emos, -éis, -en. -ER/-IR verbs use -a, -as, -a, -amos, -áis, -an.',
        'EXAMPLE hablar → yo habl- → hable, hables, hable, hablemos, habléis, hablen.',
        'EXAMPLE comer → yo com- → coma, comas, coma, comamos, comáis, coman.',
        'TRIGGERS (WEIRDO acronym): Wishes, Emotions, Impersonal expressions, Recommendations, Doubt/denial, Ojalá.',
        'Used after que: "Quiero QUE estudies" (I want you to study). The subjunctive verb is in the QUE clause.',
        'IRREGULAR: ser → sea/seas/sea... ir → vaya... haber → haya... saber → sepa... estar → esté.',
        'NEGATION + DOUBT: "No creo que sea verdad" (I don\'t believe it\'s true) — subjunctive after negated belief.',
      ],
      vocabulary: [
        { term: 'subjunctive', definition: 'verbal mood for desires, doubts, hypotheticals, emotions.' },
        { term: 'que clause', definition: 'subordinate clause introduced by "que"; the subjunctive lives here.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-translate',
      kind: 'worked_example',
      problem: 'Translate: "I hope she comes to the party." (hope = esperar; come = venir, irregular)',
      steps: [
        '"hope" triggers subjunctive (W = wish).',
        'Structure: Espero que + subjunctive.',
        'venir → yo vengo → veng- → venga.',
        'Result: "Espero que venga a la fiesta."',
      ],
      answer: 'Espero que venga a la fiesta.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Indicative or subjunctive: "Es importante que tú ___ (estudiar)"?',
      expectedAnswer: 'subjunctive — "estudies" (impersonal expression "es importante que" triggers subjunctive)',
      responseFormat: 'free',
      hints: [
        '"Es importante que" = impersonal expression.',
        '-AR verb subjunctive ending for tú is -es.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Subjunctive = mood (attitude), not tense.',
        'WEIRDO: Wish, Emotion, Impersonal, Recommendation, Doubt, Ojalá.',
        'Form: drop yo-form -o, add opposite-vowel endings.',
        'Lives in que clauses after triggers.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
