import type { LessonPlan } from '../types';

export const SEED_G68_LANG_SPANISH_2: LessonPlan = {
  id: 'evelyn.lang.6-8.spanish-2.v1',
  title: 'Spanish II — ser vs estar',
  curriculum: 'CCSS',
  grade: '8',
  subject: 'languages',
  topic: 'spanish-2',
  locale: 'en',
  los: [
    { id: 'lang68.sp2.ser-estar', description: 'Distinguish ser (permanent) from estar (temporary/location) in usage.', standard: 'ACTFL-Novice-High' },
  ],
  prerequisites: ['lang68.sp1.regular-ar'],
  followUps: [],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame ser vs estar as the classic Spanish-learner trap.',
      script: 'Spanish has TWO verbs that both translate to "to be": SER and ESTAR. English doesn\'t make this distinction, so learners constantly mix them up. The rule of thumb: SER for who/what something IS (permanent), ESTAR for HOW it is right now (temporary or location).',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-ser-estar',
      kind: 'concept',
      goal: 'Conjugations + when to use each.',
      keyIdeas: [
        'SER conjugation: soy, eres, es, somos, sois, son.',
        'ESTAR conjugation: estoy, estás, está, estamos, estáis, están.',
        'SER: identity, origin, profession, time, possession, characteristics. "Soy estudiante" (I am a student). "Es de México" (he is from Mexico).',
        'ESTAR: location, current state/feeling, ongoing actions. "Estoy cansado" (I am tired right now). "Está en casa" (she is at home).',
        'MEANING SHIFTS: ser aburrido = boring (personality). estar aburrido = bored (right now). Same word, different meaning by verb choice.',
        'MEMORY AID: "for HOW you feel and WHERE you are, always use the verb estAR".',
      ],
      vocabulary: [
        { term: 'ser', definition: 'to be (permanent / identity).' },
        { term: 'estar', definition: 'to be (temporary / location).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-pick',
      kind: 'worked_example',
      problem: 'Pick ser or estar: 1) María ___ doctora. 2) María ___ enferma hoy. 3) María ___ en el hospital.',
      steps: [
        '1) profession = identity = SER. María ES doctora.',
        '2) "enferma hoy" = temporary state = ESTAR. María ESTÁ enferma hoy.',
        '3) location = ESTAR. María ESTÁ en el hospital.',
        'Notice how all three involve a doctor at a hospital, yet 2/3 use estar.',
      ],
      answer: '1) es, 2) está, 3) está',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Translate: "I am happy" (right now). Ser or estar?',
      expectedAnswer: 'Estoy feliz / contento — temporary feeling uses ESTAR',
      responseFormat: 'free',
      hints: [
        '"Right now" = current state.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'SER for identity, origin, time, characteristic.',
        'ESTAR for location, feeling, temporary state.',
        'How you feel + where you are = estAR.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
