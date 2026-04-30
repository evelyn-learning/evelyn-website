/**
 * G7 — Ancient China.
 *
 * Dynasties (Shang, Zhou, Qin, Han), Great Wall, Silk Road,
 * Confucius, inventions (paper, gunpowder, compass).
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SS_ANCIENT_CHINA: LessonPlan = {
  id: 'evelyn.g7.ss.world-history.ancient-china.v1',
  title: 'Ancient China: dynasties, Confucius, and the Silk Road',
  curriculum: 'NCSS',
  grade: '7',
  subject: 'ss',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'ncss.68.history.classical-china',
      description: 'Identify the major dynasties of ancient China and their cultural contributions.',
      standard: 'NCSS.D2.His.2.6-8',
    },
  ],
  prerequisites: [],
  followUps: ['ncss.68.history.silk-road'],
  estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Hook with the breadth: 4000 years of continuous civilization.',
      script: 'China has been a continuous civilization for OVER 4000 years. Same writing system, evolving but unbroken. They invented paper, gunpowder, the compass, and printing — centuries before Europe.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dynasties-and-ideas',
      kind: 'concept',
      goal: 'Four key dynasties + Confucianism + the Silk Road.',
      keyIdeas: [
        'SHANG DYNASTY (~1600-1046 BCE): earliest Chinese dynasty with written records. Bronze working, oracle bones, ancestor worship.',
        'ZHOU DYNASTY (1046-256 BCE): longest dynasty. "Mandate of Heaven" — the idea that emperors rule by divine approval, lost if they\'re unjust. CONFUCIUS lived during this era (~500 BCE).',
        'QIN DYNASTY (221-206 BCE): SHORT but huge impact. Emperor Qin Shi Huang UNIFIED China for the first time. Started the GREAT WALL. Standardized writing, weights, measures. Brutal — buried critics alive.',
        'HAN DYNASTY (206 BCE - 220 CE): golden age. Confucianism became official ideology. SILK ROAD trade routes opened to the West. Invented PAPER.',
        'CONFUCIANISM: not a religion — a system of ethics. Emphasized respect for elders, social harmony, education, ruler\'s moral duty.',
        'SILK ROAD: 4000-mile trade route connecting China to the Mediterranean. Silk, spices, ideas, religions traveled both directions.',
      ],
      vocabulary: [
        { term: 'dynasty', definition: 'a series of rulers from the same family.' },
        { term: 'Mandate of Heaven', definition: 'the Chinese belief that emperors rule by divine approval.' },
        { term: 'Confucianism', definition: 'an ethical system focused on social harmony, respect, and education.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-mandate',
      kind: 'worked_example',
      problem: 'How did the Mandate of Heaven justify dynastic change?',
      steps: [
        'The Mandate said: a just ruler has Heaven\'s approval. An unjust ruler LOSES it.',
        'Signs of lost mandate: floods, famine, plague, peasant rebellion.',
        'When a dynasty fell, it "proved" they\'d lost the Mandate. The new dynasty therefore had it.',
        'This made rebellion SOMETIMES legitimate — a moral check on bad rulers, but also a justification for any successful coup.',
      ],
      answer: 'a ruler who lost Heaven\'s approval (shown by disasters/rebellions) deserved to be replaced',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Which dynasty unified China for the first time and started the Great Wall?',
      expectedAnswer: 'Qin',
      responseFormat: 'free',
      hints: [
        'It was a SHORT dynasty (only 15 years) but enormously impactful.',
        'The name of the country "China" likely comes from this dynasty.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-confucius-religion',
      kind: 'misconception_check',
      question: 'Is Confucianism a religion like Buddhism or Christianity?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Categorizing Confucianism as a religion.',
          correctsTo: 'No — Confucianism is a system of ETHICS and social philosophy. It doesn\'t worship gods or promise an afterlife. It teaches HOW to live (respect elders, study, govern justly). Many Confucians also practiced Buddhism or Daoism — they\'re not exclusive.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Continuous civilization for 4000+ years — Shang → Zhou → Qin → Han.',
        'Mandate of Heaven justified rule and rebellion.',
        'Confucianism = ethics, not religion. Respect, harmony, education.',
        'Silk Road connected China to the West; paper, gunpowder, compass were Chinese inventions.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did the Han Dynasty\'s invention of PAPER spread so slowly to the West? It took 1000 years.',
      hint: 'Knowledge moved with traders. Paper-making was a closely guarded secret. Europe got it via the Islamic world after Muslim soldiers captured Chinese paper-makers in 751 CE.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
