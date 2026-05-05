/**
 * Grades 3-5 World Languages — Spanish (Beginner).
 *
 * Greetings, numbers 1-20, basic colors, family words.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_LANG_SPANISH_BEGINNER: LessonPlan = {
  id: 'evelyn.lang.3-5.spanish-beginner.v1',
  title: 'Spanish for beginners — saludos, números, colores',
  curriculum: 'CCSS',
  grade: '4',
  subject: 'languages',
  topic: 'spanish-beginner',
  locale: 'en',
  los: [
    {
      id: 'lang35.spanish.beginner',
      description: 'Greet, count to 20, name basic colors and family members in Spanish.',
      standard: 'ACTFL-Novice-Low',
    },
  ],
  prerequisites: [],
  followUps: ['lang68.spanish-1'],
  estimatedMinutes: 12,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Spanish as the easiest first language for English speakers.',
      script: 'Spanish has lots of words that look like English ones — familia, color, animal. The pronunciation rules are SUPER consistent. Once you learn the alphabet sounds, you can read most words correctly. Today: greetings, numbers, colors, family.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-spanish-basics',
      kind: 'concept',
      goal: 'Greetings, numbers 1-20, colors, family words.',
      keyIdeas: [
        'GREETINGS: Hola (hi), Buenos días (good morning), Buenas tardes (afternoon), Buenas noches (night), ¿Cómo estás? (how are you?), Bien (good), Adiós (bye).',
        'NUMBERS 1-10: uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez.',
        'NUMBERS 11-20: once, doce, trece, catorce, quince, dieciséis, diecisiete, dieciocho, diecinueve, veinte.',
        'COLORS: rojo (red), azul (blue), amarillo (yellow), verde (green), blanco (white), negro (black).',
        'FAMILY: madre/mamá (mother), padre/papá (father), hermano (brother), hermana (sister), abuelo/a (grandparent).',
        'PRONUNCIATION: every letter is pronounced. Vowels: a (ah), e (eh), i (ee), o (oh), u (oo). H is silent. J sounds like English h.',
      ],
      vocabulary: [
        { term: 'hola', definition: 'hi (informal greeting).' },
        { term: 'familia', definition: 'family.' },
        { term: 'gracias', definition: 'thank you.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How do you say "good morning" in Spanish?',
      expectedAnswer: 'Buenos días',
      responseFormat: 'free',
      hints: [
        'Two words. Starts with "buenos".',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-letter-h',
      kind: 'misconception_check',
      question: 'How do you pronounce the H in "hola"?',
      commonErrors: [
        {
          answer: 'like English h',
          misconception: 'Reading H as in English.',
          correctsTo: 'In Spanish, H is SILENT. "Hola" is pronounced "OH-lah", not "HOH-lah". The Spanish letter that sounds like English h is J — "Juan" sounds like "hwahn".',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Hola = hi. Adiós = bye.',
        'Numbers 1-10: uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez.',
        'Vowels are pure: a-e-i-o-u = ah-eh-ee-oh-oo.',
        'H is silent; J sounds like English h.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
