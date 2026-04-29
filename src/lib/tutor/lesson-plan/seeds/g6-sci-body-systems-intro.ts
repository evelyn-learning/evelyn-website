/**
 * Grade 6 Science — Body Systems Intro.
 * NGSS MS-LS1-3: develop a model to describe the function of a cell
 * as a whole and ways the parts of cells contribute to the function.
 * Extended here to: how cells form tissues, organs, and systems.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_SCI_BODY_SYSTEMS_INTRO: LessonPlan = {
  id: 'evelyn.g6.science.life.body-systems-intro.v1',
  title: 'Body Systems: How Your Body Works Together',
  curriculum: 'NGSS', grade: '6', subject: 'science', topic: 'life-science', locale: 'en',
  los: [{ id: 'ngss.ms-ls1-3', description: 'Use argument supported by evidence for how the body is a system of interacting subsystems composed of groups of cells.', standard: 'NGSS.MS-LS1-3' }],
  prerequisites: ['ngss.ms-ls1-1'], followUps: ['ngss.hs-ls1-2'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Bring the body to life as a connected system.', script: 'Right now, your heart is pumping, lungs breathing, brain thinking, stomach digesting — all at once. None of them work alone. Your body is a system of systems, all working together.', estimatedMinutes: 2 },
    { id: 'concept-hierarchy', kind: 'concept', goal: 'Cells → tissues → organs → organ systems → organism. Each level builds on the last.', keyIdeas: [
      'CELLS are the smallest living units.',
      'TISSUES are groups of similar cells doing the same job (muscle tissue, nerve tissue).',
      'ORGANS are groups of tissues working together (heart = muscle + nerve + blood vessel tissues).',
      'ORGAN SYSTEMS are groups of organs working together for a function (circulatory system = heart + arteries + veins + capillaries).',
      'ORGANISM = all systems together = YOU.',
    ], vocabulary: [{ term: 'tissue', definition: 'group of similar cells.' }, { term: 'organ', definition: 'group of tissues with a job.' }, { term: 'organ system', definition: 'group of organs sharing a function.' }], estimatedMinutes: 4 },
    { id: 'concept-systems', kind: 'concept', goal: 'Major body systems and their functions.', keyIdeas: [
      'CIRCULATORY: pumps blood (heart, vessels, blood). Delivers oxygen + nutrients, removes waste.',
      'RESPIRATORY: breathes (lungs, trachea, diaphragm). Brings O₂ in, sends CO₂ out.',
      'DIGESTIVE: breaks down food (mouth, stomach, intestines). Extracts nutrients.',
      'NERVOUS: senses + responds (brain, spinal cord, nerves). Controls everything.',
      'MUSCULAR: movement (muscles). Voluntary (arms) + involuntary (heart, gut).',
      'SKELETAL: structure + protection (bones, joints).',
      'IMMUNE: fights infection (white blood cells, lymph nodes).',
      'ENDOCRINE: hormones (thyroid, adrenals, pancreas). Regulates body processes.',
      'EXCRETORY: filters waste (kidneys, bladder).',
      'REPRODUCTIVE: makes new humans.',
    ], estimatedMinutes: 5 },
    { id: 'worked-eat-an-apple', kind: 'worked_example', problem: 'Trace what happens when you eat an apple — list the systems involved.', steps: [
      'NERVOUS — brain decides to eat. Signals muscles.',
      'MUSCULAR — hand picks up the apple, jaw chews.',
      'DIGESTIVE — saliva starts breakdown; stomach acid + intestines extract nutrients.',
      'CIRCULATORY — blood carries nutrients to cells throughout the body.',
      'EXCRETORY — kidneys filter waste from the blood; gut moves solid waste out.',
      'ENDOCRINE — pancreas releases insulin to regulate blood sugar from the apple.',
      '6+ systems collaborate for one bite of fruit.',
    ], answer: 'Nervous → muscular → digestive → circulatory → excretory + endocrine. Six systems coordinate.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'You jump up and run. Which body systems are MOST involved in this single action?', expectedAnswer: 'Muscular (running), skeletal (bones provide structure), nervous (brain coordinates), respiratory (faster breathing), circulatory (faster heart rate to bring O₂ to muscles).', responseFormat: 'free', hints: ['Movement needs muscles + bones.', 'Hard work needs more oxygen — what supports that?'], estimatedMinutes: 3 },
    { id: 'misconception-systems-isolated', kind: 'misconception_check', question: 'A friend says "the heart only matters for the circulatory system — other systems work without it." True?', commonErrors: [{ answer: 'Yes — heart is just for circulation.', misconception: 'Treating organ systems as isolated.', correctsTo: 'The heart pumps blood that carries oxygen + nutrients to EVERY cell of EVERY system. Stop the heart and brain dies in minutes, muscles fail, etc. Systems are deeply interconnected — failure in one cascades.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Cells → tissues → organs → systems → organism.', 'Major systems: circulatory, respiratory, digestive, nervous, muscular, skeletal, immune, endocrine, excretory, reproductive.', 'Systems work TOGETHER, not in isolation.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
