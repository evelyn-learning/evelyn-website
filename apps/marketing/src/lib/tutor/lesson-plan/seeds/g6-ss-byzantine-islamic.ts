/**
 * G6/G7 — Byzantine Empire and Islamic Golden Age.
 *
 * Eastern Roman Empire continued for 1000 years after Rome fell in
 * the West. Islamic Golden Age (~750-1258) preserved Greek
 * knowledge, made huge advances in math, medicine, astronomy.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_SS_BYZANTINE_ISLAMIC: LessonPlan = {
  id: 'evelyn.g6.ss.world-history.byzantine-islamic-golden-age.v1',
  title: 'Byzantine Empire and Islamic Golden Age',
  curriculum: 'NCSS',
  grade: '7',
  subject: 'ss',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'ncss.68.history.medieval-civilizations',
      description: 'Identify the major civilizations that rose after the fall of Rome and their contributions to world culture.',
      standard: 'NCSS.D2.His.2.6-8',
    },
  ],
  prerequisites: ['ncss.68.history.roman-empire'],
  followUps: ['ncss.68.history.middle-ages'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Counter the "Rome fell" myth with the Eastern half\'s 1000-year continuation.',
      script: 'When you hear "Rome fell in 476 CE", that\'s only HALF the story. The Western half fell. The EASTERN half kept going for another 1000 years as the Byzantine Empire. Meanwhile, an entirely new civilization rose in the Middle East — the Islamic world\'s Golden Age.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-two-civilizations',
      kind: 'concept',
      goal: 'Byzantine Empire + Islamic Golden Age + their interactions.',
      keyIdeas: [
        'BYZANTINE EMPIRE (~330-1453 CE): Eastern Roman Empire. Capital CONSTANTINOPLE (Greek city, modern Istanbul). Greek-speaking, Christian (Eastern Orthodox after the Great Schism, 1054). Emperor JUSTINIAN (527-565) reconquered parts of the West and codified Roman law (Justinian Code).',
        'BYZANTINE achievements: preserved Greek and Roman knowledge that the West had lost. HAGIA SOPHIA (537) — massive cathedral, then mosque, now museum.',
        'ISLAMIC GOLDEN AGE (~750-1258): centered first in BAGHDAD (Abbasid Caliphate), later Cordoba (Spain), Cairo. Massive flowering of science, medicine, math, philosophy.',
        'KEY ISLAMIC ADVANCES: ALGEBRA (the word comes from Arabic "al-jabr" — al-Khwarizmi). Hospitals as we know them. Optics (Alhazen). Medicine (Avicenna\'s "Canon of Medicine" used in Europe for 500 years). Translated Greek classics (Aristotle, Euclid) and PRESERVED them when Europe forgot.',
        'INTERACTION: Byzantines and Islamic states often fought, but also traded ideas. When Crusaders arrived, they encountered ADVANCED Muslim civilization while Europe was still rebuilding from Rome\'s collapse.',
      ],
      vocabulary: [
        { term: 'Byzantine Empire', definition: 'the Eastern Roman Empire, lasting until 1453 CE.' },
        { term: 'caliphate', definition: 'an Islamic state led by a caliph, considered a successor to Muhammad.' },
        { term: 'Great Schism (1054)', definition: 'the split between Catholic (Western) and Orthodox (Eastern) Christianity.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-algebra',
      kind: 'worked_example',
      problem: 'Why do we owe the modern word "ALGEBRA" to Islamic mathematicians?',
      steps: [
        'In ~820 CE, Persian mathematician AL-KHWARIZMI wrote a book titled "Kitab al-Mukhtasar fi Hisab al-Jabr w\'al-Muqabala".',
        '"al-Jabr" means "restoration" — the technique of moving terms across an equation.',
        'European translators kept the word, which became "algebra".',
        'Al-Khwarizmi\'s name itself became another modern word: ALGORITHM.',
        'Both algebra and algorithm came directly from Islamic Golden Age scholarship.',
      ],
      answer: 'al-Khwarizmi\'s book "al-Jabr" gave us the word algebra; his name gave us "algorithm"',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'What modern Turkish city was the capital of the Byzantine Empire?',
      expectedAnswer: 'Istanbul (formerly Constantinople)',
      responseFormat: 'free',
      hints: [
        'The Byzantines called it CONSTANTINOPLE, after Emperor Constantine.',
        'After 1453, the Ottomans renamed it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-dark-ages-everywhere',
      kind: 'misconception_check',
      question: 'After Rome fell, was ALL of the world stuck in the "Dark Ages"?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating all civilizations as in decline 500-1500 CE.',
          correctsTo: 'No — only WESTERN EUROPE saw decline. Byzantium thrived for 1000 more years. Islamic world had a GOLDEN AGE while Europe struggled. China had the Tang and Song dynasties. India had vibrant kingdoms. The "Dark Ages" was a regional Western phenomenon.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Byzantine Empire: Eastern Roman Empire, 330-1453 CE, Christian, Greek-speaking, capital Constantinople.',
        'Islamic Golden Age: ~750-1258, advances in algebra, medicine, optics, philosophy.',
        'Together, these civilizations preserved Greek knowledge that Western Europe had lost.',
        '"Dark Ages" applies only to Western Europe — the rest of the world was thriving.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did Islamic-preserved Greek texts eventually reach Europe and trigger the Renaissance?',
      hint: 'Through Spain (Muslim Cordoba), Sicily (Muslim then Norman rule), and the fall of Constantinople in 1453 (Greek scholars fled to Italy with manuscripts). Renaissance Italians rediscovered "lost" Greek works that had actually been preserved by Muslim scholars.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
