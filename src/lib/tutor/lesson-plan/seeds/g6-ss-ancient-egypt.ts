/**
 * G6 — Social Studies: Ancient Egypt.
 *
 * One of the canonical ancient civilizations in middle-school world
 * history. The Nile as the lifeline; pharaohs and social pyramid;
 * polytheism, mummification, and the afterlife belief; pyramids and
 * monumental architecture; hieroglyphic writing.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_SS_ANCIENT_EGYPT: LessonPlan = {
  id: 'evelyn.g6.ss.ancient-egypt.v1',
  title: 'Ancient Egypt',
  curriculum: 'state-standards',
  grade: '6',
  subject: 'social-studies',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'ss.g6.world.egypt',
      description: 'Describe the geography, government, religion, and achievements of Ancient Egypt.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Egypt as "a civilization built around a single river".',
      script: 'Egypt is mostly desert. Almost no rain. So how did one of the longest-lasting civilizations in history grow there? One answer: the Nile River. It flooded every year, dropping rich soil along its banks. People settled there, grew crops, built cities — and 3,000 years of history followed. Geography matters.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-egypt',
      kind: 'concept',
      goal: 'Geography (Nile) → society (pharaoh + pyramid hierarchy) → religion → achievements.',
      keyIdeas: [
        'GEOGRAPHY: Egypt is in NORTHEASTERN AFRICA, mostly desert. The NILE RIVER flows through it — north into the Mediterranean.',
        'The Nile FLOODED predictably each summer, depositing fertile silt. Egyptians could farm reliably while desert surrounded them.',
        'Two regions: UPPER EGYPT (south, upstream) and LOWER EGYPT (north, downstream — confusing because it\'s actually further north).',
        'GOVERNMENT: ruled by a PHARAOH — both political king and religious figure (considered divine).',
        'SOCIAL PYRAMID (top to bottom): pharaoh → priests / nobles / scribes → craftspeople / merchants → farmers (most people) → enslaved people.',
        'RELIGION: POLYTHEISTIC — many gods. Big ones: Ra (sun), Osiris (afterlife), Isis (motherhood), Anubis (mummification).',
        'AFTERLIFE was central. Bodies were MUMMIFIED so the soul could return to them. Wealthy Egyptians buried with food, valuables, and instructions for the afterlife journey.',
        'PYRAMIDS were tombs for pharaohs (the Great Pyramid of Giza is the most famous). HIEROGLYPHICS were the writing system — pictures and symbols.',
        'Lasted ~3000 BCE to ~30 BCE — about 3,000 years. Eventually conquered by Rome.',
      ],
      vocabulary: [
        { term: 'pharaoh', definition: 'the ruler of ancient Egypt — political and religious.' },
        { term: 'mummification', definition: 'preserving a body for the afterlife.' },
        { term: 'hieroglyphics', definition: 'the picture-and-symbol writing system of ancient Egypt.' },
        { term: 'polytheistic', definition: 'believing in many gods.' },
      ],
      suggestedTools: ['show_map', 'show_concept_map'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-nile-importance',
      kind: 'worked_example',
      problem: 'Explain how the Nile shaped Egyptian civilization in three concrete ways.',
      steps: [
        '1) FOOD: yearly flooding deposited rich silt → reliable farming → surplus food → people could specialize in non-farming jobs (priests, scribes, builders).',
        '2) TRANSPORT: the Nile is a north-flowing river. Boats with sails could travel both directions (sail north with current, sail south using winds), connecting Upper and Lower Egypt.',
        '3) DEFENSE: deserts on both sides made invasion HARD. Egypt stayed relatively isolated and stable for thousands of years.',
      ],
      answer: 'Food, transport, defense',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why was mummification important to ancient Egyptians?',
      expectedAnswer: 'They believed the soul needed the body to return to in the afterlife',
      responseFormat: 'free',
      hints: [
        'Their religion focused heavily on what came after death.',
        'A body that decayed couldn\'t be a "home" for the soul.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-pyramid-slaves',
      kind: 'misconception_check',
      question: 'A movie shows enslaved people being whipped to build the Great Pyramid. Sami says all the pyramids were built by slaves. What does the evidence actually show?',
      commonErrors: [
        {
          answer: 'yes, that\'s the standard story',
          misconception: 'Believing the popular but inaccurate "slave-built pyramids" idea.',
          correctsTo: 'Modern evidence (worker villages, skeletal remains, payment records) suggests pyramids were largely built by paid laborers, including farmers during the flood season when fields couldn\'t be worked. Enslaved people existed in Egypt, but the popular image of pyramid construction by slaves is largely myth.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Egypt was built around the Nile — flooding gave fertile farmland in a desert.',
        'Pharaoh ruled as both political king and divine figure.',
        'Polytheistic religion focused on the afterlife → mummification, pyramids.',
        'Hieroglyphics for writing. ~3,000 years of civilization.',
        'Don\'t confuse "Upper" / "Lower" Egypt — it\'s about river flow, not latitude.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Compare ancient Egypt to ancient Mesopotamia. Both depended on rivers — what made Egypt last longer?',
      hint: 'Egypt\'s deserts isolated it; Mesopotamia was on flat land between two rivers and was repeatedly invaded. Geography again.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
