import type { LessonPlan } from '../types';

export const SEED_IB_SPANISH_LANGUAGE: LessonPlan = {
  id: 'evelyn.ibdp.spanish.v1',
  title: 'IB Spanish — text-type analysis',
  curriculum: 'IBDP',
  grade: '11',
  subject: 'languages',
  topic: 'ib-spanish',
  locale: 'en',
  los: [
    { id: 'ibdp.sp.text-type', description: 'Identify text-type conventions (article, blog, letter, speech, interview) in Spanish and adapt register accordingly.', standard: 'IB-SPANISH-B' },
  ],
  prerequisites: ['lang910.sp.preterite-imperfect'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame IB Spanish as TEXT-TYPE-driven communication.',
      script: 'IB Spanish (B/SL) isn\'t just grammar. It tests whether you can READ different text types (newspaper article vs. blog vs. formal letter) and PRODUCE in the right register. Each text type has its own conventions — vocabulary, formality, structure. Knowing them is half the exam.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-text-types',
      kind: 'concept',
      goal: 'Six common text types + register.',
      keyIdeas: [
        'NEWSPAPER ARTICLE: 3rd person, past tense, neutral register. Headline + lead + body. Quotes attributed.',
        'BLOG POST: 1st person, conversational, often present tense. Personal voice; calls to action.',
        'FORMAL LETTER: opening (Estimado/a Sr./Sra.), formal vocabulary, no contractions, closing (Atentamente, Le saluda atentamente).',
        'INFORMAL LETTER / EMAIL: opening (Querido/a, Hola), tú forms, casual vocabulary, closing (Un abrazo, Hasta pronto).',
        'SPEECH: direct address (Buenas tardes, queridos compañeros), rhetorical questions, repetition for emphasis, call to action.',
        'INTERVIEW: Q + A format. Questions formal but framed; answers can be elaborate.',
        'REGISTER markers: usted vs tú; formal vocabulary (residir, adquirir) vs informal (vivir, comprar); no contractions / slang in formal.',
      ],
      vocabulary: [
        { term: 'register', definition: 'level of formality in language (formal, neutral, informal).' },
        { term: 'text type', definition: 'a category of writing with shared conventions (article, letter, blog, speech).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-rewrite',
      kind: 'worked_example',
      problem: 'Rewrite "Hola amigo, voy a la fiesta hoy y va a ser brutal" in formal-letter register.',
      steps: [
        'Hola amigo → Estimado señor / Estimada señora.',
        'voy a la fiesta hoy → "Asistiré a la celebración esta tarde". (Future tense, formal vocabulary.)',
        'va a ser brutal (slang) → "espero que sea una velada agradable" (formal way to say "I hope it goes well").',
        'Add closing: "Atentamente, [nombre]".',
        'Notice: same essential meaning; vocabulary, tense choice, and structure all shift.',
      ],
      answer: 'Estimada señora: Asistiré a la celebración esta tarde y espero que sea una velada agradable. Atentamente, ...',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'For a SPEECH to schoolmates, would you use tú or usted forms? Why?',
      expectedAnswer: 'tú (or vosotros in Spain) — speech to peers uses informal forms; usted would feel distant or formal',
      responseFormat: 'free',
      hints: [
        'Audience determines register.',
        'Schoolmates = peers = informal.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Text type drives register.',
        'Formal: usted, no contractions, formal vocab.',
        'Informal: tú, contractions, casual vocab.',
        'Conventions per type: opening + body + closing structure.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
