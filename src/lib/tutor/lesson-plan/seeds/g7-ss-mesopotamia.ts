/**
 * G7 — Ancient Mesopotamia.
 *
 * Sumer, Babylon, Assyria. Cuneiform, ziggurats, Hammurabi's Code,
 * the wheel and writing. "Cradle of civilization".
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SS_MESOPOTAMIA: LessonPlan = {
  id: 'evelyn.g7.ss.world-history.mesopotamia.v1',
  title: 'Ancient Mesopotamia: cradle of civilization',
  curriculum: 'NCSS',
  grade: '7',
  subject: 'ss',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'ncss.68.history.early-civilizations',
      description: 'Identify how the geography of Mesopotamia influenced the development of early civilizations.',
      standard: 'NCSS.D2.His.2.6-8',
    },
  ],
  prerequisites: [],
  followUps: ['ncss.68.history.ancient-egypt'],
  estimatedMinutes: 14,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open with the dramatic claim: WRITING and the WHEEL were both invented here.',
      script: 'Imagine a world without writing or wheels. Around 3500 BCE in modern-day Iraq, people invented BOTH. That\'s why we call Mesopotamia the "cradle of civilization".',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-rivers-and-empires',
      kind: 'concept',
      goal: 'Two rivers made farming possible; over 3000 years, three major empires rose and fell.',
      keyIdeas: [
        'GEOGRAPHY: between the Tigris and Euphrates rivers (modern Iraq). "Mesopotamia" = Greek for "between rivers". Yearly floods deposited rich soil.',
        'SUMER (~3500 BCE): the FIRST civilization. Built city-states (Ur, Uruk). Invented CUNEIFORM (wedge-shaped writing on clay tablets). Built ZIGGURATS (stepped temple pyramids).',
        'BABYLON (~1800 BCE): King HAMMURABI created Hammurabi\'s Code — one of the earliest written law codes. "An eye for an eye" comes from it.',
        'ASSYRIA (~900-600 BCE): warrior empire with iron weapons and chariots. Built huge libraries, conquered Babylon and beyond.',
        'KEY INVENTIONS that came from this region: writing (cuneiform), the wheel, the plow, the 60-minute hour and 360-degree circle.',
      ],
      vocabulary: [
        { term: 'cuneiform', definition: 'wedge-shaped writing pressed into clay — the earliest writing system.' },
        { term: 'ziggurat', definition: 'a stepped pyramid-like temple built by Mesopotamians.' },
        { term: 'city-state', definition: 'an independent city that governs itself and surrounding land.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-hammurabi',
      kind: 'worked_example',
      problem: 'Hammurabi\'s Code says: "If a builder builds a house and the house collapses and kills the owner, the builder shall be put to death." What is the underlying principle?',
      steps: [
        'The punishment matches the crime — the builder caused a death, so the builder dies.',
        'This is "lex talionis" or "an eye for an eye" — equal retaliation.',
        'The deeper principle: PUBLISHED LAWS that everyone (rich and poor) must follow. Before this, kings or priests could decide arbitrarily.',
        'Modern courts still inherit the idea that LAWS must be public, written, and applied to everyone.',
      ],
      answer: 'punishment equal to the crime; laws are public and apply to everyone',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why did civilization start in Mesopotamia rather than, say, the Sahara desert?',
      expectedAnswer: 'rivers provided water for farming',
      responseFormat: 'free',
      hints: [
        'Civilization needs surplus food → that needs reliable agriculture.',
        'What feature of Mesopotamia made farming possible?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-egypt-first',
      kind: 'misconception_check',
      question: 'Was Egypt the first civilization?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Confusing Egypt as the earliest because it\'s famous.',
          correctsTo: 'No — Sumer in Mesopotamia is generally considered the first (around 3500 BCE), though Egypt followed close behind. They developed independently around the same time, both along major rivers.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Mesopotamia = "between rivers" — Tigris and Euphrates.',
        'Sumer was the first civilization (~3500 BCE), invented cuneiform writing.',
        'Hammurabi gave one of the first written law codes.',
        'Inventions from here: writing, the wheel, plow, 60-minute hour.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did writing get invented in MESOPOTAMIA before anywhere else? What problem was it solving?',
      hint: 'Big cities + surplus grain → people needed records of who owned what, who paid taxes. Writing started as accounting.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
