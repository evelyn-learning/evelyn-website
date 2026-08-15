/**
 * G7 — Ancient India.
 *
 * Indus Valley Civilization, Vedic Period, Mauryan and Gupta empires.
 * Hinduism and Buddhism. Caste system. Mathematical contributions.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SS_ANCIENT_INDIA: LessonPlan = {
  id: 'evelyn.g7.ss.world-history.ancient-india.v1',
  title: 'Ancient India: from Indus Valley to Gupta golden age',
  curriculum: 'NCSS',
  grade: '7',
  subject: 'ss',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'ncss.68.history.classical-india',
      description: 'Trace the development of ancient Indian civilization from the Indus Valley to the Gupta Empire.',
      standard: 'NCSS.D2.His.2.6-8',
    },
  ],
  prerequisites: [],
  followUps: ['ncss.68.history.indian-mathematics'],
  estimatedMinutes: 15,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open with the lasting fingerprints — yoga, zero, Buddhism.',
      script: 'Yoga. The number ZERO. Chess. Buddhism. Hinduism — one of the oldest religions still practiced today. All of these came from ancient India.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-eras',
      kind: 'concept',
      goal: 'Four eras: Indus Valley, Vedic, Mauryan, Gupta — plus the rise of Hinduism and Buddhism.',
      keyIdeas: [
        'INDUS VALLEY CIVILIZATION (~3300-1300 BCE): cities like Harappa and Mohenjo-Daro. Advanced urban planning — grid streets, drainage systems, indoor plumbing. Their writing has never been deciphered.',
        'VEDIC PERIOD (~1500-500 BCE): Aryan-speaking peoples migrated in. The VEDAS (sacred texts) were composed. Caste system began (Brahmins/priests, Kshatriyas/warriors, Vaishyas/traders, Shudras/laborers, Dalits/"untouchables" outside the system).',
        'HINDUISM emerged from Vedic religion. Polytheistic with one underlying reality (Brahman). Concepts of karma, dharma, reincarnation.',
        'BUDDHISM (~500 BCE): Siddhartha Gautama (the Buddha) taught the Four Noble Truths and Eightfold Path. Spread across Asia.',
        'MAURYAN EMPIRE (~322-185 BCE): first to unify most of India. Emperor ASHOKA converted to Buddhism after a brutal war and ruled with policies of nonviolence.',
        'GUPTA EMPIRE (~320-550 CE): "GOLDEN AGE". Astronomy, math, art flourished. Indian mathematicians invented ZERO and the decimal place-value system we still use today. Aryabhata calculated π to four decimal places and proposed Earth rotates on its axis.',
      ],
      vocabulary: [
        { term: 'Vedas', definition: 'ancient Sanskrit sacred texts foundational to Hinduism.' },
        { term: 'caste', definition: 'a hereditary social class in traditional Indian society.' },
        { term: 'karma', definition: 'the concept that actions have consequences across lifetimes.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-zero',
      kind: 'worked_example',
      problem: 'Why was the Indian invention of ZERO so transformative?',
      steps: [
        'Earlier number systems (Roman numerals, e.g.) had no symbol for nothing — made arithmetic clumsy.',
        'Indian mathematicians (Brahmagupta, ~628 CE) treated zero as a NUMBER you could add, subtract, and multiply with.',
        'Combined with the place-value system (1 in the tens place means 10), you can write any number with just 10 digits.',
        'IMPACT: this number system spread via Arab traders to Europe (we call them "Arabic numerals" but they\'re Indian in origin). Modern algebra, computer science, and science all depend on it.',
      ],
      answer: 'enabled positional notation and modern arithmetic — foundation of math and science',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Who founded Buddhism, and roughly when?',
      expectedAnswer: 'Siddhartha Gautama, around 500 BCE',
      responseFormat: 'free',
      hints: [
        'He was a prince who left his palace after seeing suffering.',
        'Known by his title — "the Buddha" means "awakened one".',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-arabic-numerals',
      kind: 'misconception_check',
      question: 'Were the digits 0-9 ("Arabic numerals") invented by Arabs?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Crediting Arabs based on the name.',
          correctsTo: 'They\'re technically HINDU-ARABIC numerals — invented in INDIA and TRANSMITTED to Europe through Arab scholars who adopted them. The name reflects the route, not the origin.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Indus Valley: advanced cities ~3300 BCE.',
        'Vedic Period: Vedas, caste system, early Hinduism.',
        'Buddhism founded ~500 BCE; Mauryan Ashoka spread it.',
        'Gupta Golden Age: invented zero and place-value system.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did Ashoka\'s conversion to Buddhism after the Kalinga War change his policies?',
      hint: 'He stopped war of conquest, sent Buddhist missionaries across Asia, posted edicts on stone pillars promoting nonviolence and tolerance.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
