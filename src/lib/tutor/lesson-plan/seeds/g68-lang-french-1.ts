import type { LessonPlan } from '../types';

export const SEED_G68_LANG_FRENCH_1: LessonPlan = {
  id: 'evelyn.lang.6-8.french-1.v1',
  title: 'French I — articles and gender',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'languages',
  topic: 'french-1',
  locale: 'en',
  los: [
    { id: 'lang68.fr1.articles', description: 'Use le/la/les/un/une/des correctly with gendered nouns.', standard: 'ACTFL-Novice-Mid' },
  ],
  prerequisites: ['lang35.french.beginner'],
  followUps: ['lang68.fr2'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame French gender as a rule with NO logical pattern — just memorize.',
      script: 'In French, every noun is masculine or feminine. Table is feminine. Book is masculine. Why? No reason — Roman Latin assigned gender, French inherited it. The article (le/la) before the noun tells you which. You learn nouns WITH their article so you remember the gender automatically.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-articles',
      kind: 'concept',
      goal: 'Definite + indefinite articles + plural.',
      keyIdeas: [
        'DEFINITE (the): le (m), la (f), les (plural).',
        'INDEFINITE (a/an/some): un (m), une (f), des (plural).',
        '"l\'" replaces le/la before vowels: l\'école (the school), l\'homme (the man).',
        'PLURAL: usually add -s. les livres, les écoles. The -s is silent — you hear plural from the article.',
        'COMMON MASCULINE: le livre (book), le garçon (boy), le pain (bread), le chat (cat).',
        'COMMON FEMININE: la fille (girl), la maison (house), la table, la voiture (car).',
        'TIP: word endings often hint. -age, -ment, -isme tend masculine. -tion, -té, -ette tend feminine. NOT a strict rule.',
      ],
      vocabulary: [
        { term: 'le / la', definition: 'the (masculine / feminine).' },
        { term: 'un / une', definition: 'a, an (masculine / feminine).' },
        { term: 'les / des', definition: 'the / some (plural).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-pick',
      kind: 'worked_example',
      problem: 'Pick le, la, or l\': ___ table, ___ livre, ___ école, ___ chat.',
      steps: [
        'table — feminine → la table.',
        'livre — masculine → le livre.',
        'école — starts with vowel → l\'école (was la, but elides).',
        'chat — masculine → le chat.',
      ],
      answer: 'la table, le livre, l\'école, le chat',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Translate: "the houses" (house = maison, feminine).',
      expectedAnswer: 'les maisons',
      responseFormat: 'free',
      hints: [
        'Plural of la is les. Add -s to noun.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'le (m), la (f), les (pl) for "the".',
        'un (m), une (f), des (pl) for "a / some".',
        'l\' before vowels.',
        'Plural -s usually silent — listen for the article.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
