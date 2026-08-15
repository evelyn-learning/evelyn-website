import type { LessonPlan } from '../types';

export const SEED_G35_LANG_FRENCH_BEGINNER: LessonPlan = {
  id: 'evelyn.lang.3-5.french-beginner.v1',
  title: 'French for beginners — bonjour, chiffres, couleurs',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'languages',
  topic: 'french-beginner',
  locale: 'en',
  los: [
    {
      id: 'lang35.french.beginner',
      description: 'Greet, count to 20, name basic colors and family in French.',
      standard: 'ACTFL-Novice-Low',
    },
  ],
  prerequisites: [],
  followUps: ['lang68.french-1'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame French as the language with silent letters that you have to memorize.',
      script: 'French is famous for spelling that doesn\'t match pronunciation. Tricky? Yes. But predictable: most consonants at the END of a word are silent. Plural -s? Silent. -ent verb endings? Silent. Once you know which letters are silent, French actually flows.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-french-basics',
      kind: 'concept',
      goal: 'Greetings, numbers, colors, family.',
      keyIdeas: [
        'GREETINGS: Bonjour (hello / good day), Bonsoir (good evening), Salut (hi/bye, informal), Comment ça va? (how\'s it going?), Ça va bien (it\'s going well), Au revoir (goodbye).',
        'NUMBERS 1-10: un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix.',
        'NUMBERS 11-20: onze, douze, treize, quatorze, quinze, seize, dix-sept, dix-huit, dix-neuf, vingt.',
        'COLORS: rouge (red), bleu (blue), jaune (yellow), vert (green), blanc (white), noir (black).',
        'FAMILY: mère/maman (mother), père/papa (father), frère (brother), sœur (sister), grand-père / grand-mère.',
        'SILENT LETTERS: final s, t, d, p, x are usually silent. "Petit" sounds like "puh-TEE". "Vous" sounds like "voo".',
        'NASAL VOWELS: vowel + n/m at end of syllable = nasal sound. "Bon" = "BOH(n)" with the n barely sounded.',
      ],
      vocabulary: [
        { term: 'bonjour', definition: 'hello / good day (formal-ish; works any daytime).' },
        { term: 'merci', definition: 'thank you.' },
        { term: 'oui / non', definition: 'yes / no.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How do you say "thank you" in French?',
      expectedAnswer: 'merci',
      responseFormat: 'free',
      hints: [
        'One word, two syllables.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-final-s',
      kind: 'misconception_check',
      question: '"Vous" — do you pronounce the final "s"?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Reading French letters as English.',
          correctsTo: 'No — final "s" is silent in French. "Vous" sounds like "voo". This silent-s rule applies to most plurals too: "amis" (friends) sounds like "ami". You learn to hear the difference from CONTEXT: liaison (linking) in fast speech sometimes brings the s back when the next word starts with a vowel.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Bonjour, salut, au revoir.',
        'Numbers 1-10: un, deux, trois, ... , dix.',
        'Final consonants usually silent.',
        'Nasal vowels: bon, en, in.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
