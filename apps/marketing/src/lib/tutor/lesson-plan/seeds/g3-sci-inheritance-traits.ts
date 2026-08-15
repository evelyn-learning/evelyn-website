/**
 * Grade 3 Science — Inheritance and Traits.
 * NGSS 3-LS3-1 / 3-LS3-2: organisms have traits inherited from parents
 * and influenced by the environment.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_SCI_INHERITANCE_TRAITS: LessonPlan = {
  id: 'evelyn.g3.science.life.inheritance-traits.v1',
  title: 'Traits: What You Inherit and What You Don\'t',
  curriculum: 'NGSS', grade: '3', subject: 'science', topic: 'genetics', locale: 'en',
  los: [{ id: 'ngss.3-ls3-1', description: 'Analyze and interpret data to provide evidence that plants and animals have traits inherited from parents and that variation of these traits exists in a group of similar organisms.', standard: 'NGSS.3-LS3-1' }],
  prerequisites: [], followUps: ['ngss.ms-ls3-1'], estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in family resemblance.', script: 'Have you ever been told "you have your dad\'s eyes" or "your grandma\'s smile"? Some things about you come from your parents — but not everything. Let\'s figure out which is which.', estimatedMinutes: 1 },
    { id: 'concept-traits', kind: 'concept', goal: 'A trait is any feature of a living thing. Some traits are inherited; others are learned or shaped by environment.', keyIdeas: [
      'A TRAIT is any feature of a plant or animal — eye color, height, fur color, how loud a dog barks.',
      'INHERITED traits come from your PARENTS through their genes. You\'re BORN with them.',
      '  Examples: eye color, hair color, blood type, dimples, ear shape.',
      'LEARNED behaviors / ACQUIRED traits come from EXPERIENCE or environment, not genes.',
      '  Examples: knowing how to ride a bike, scars, having a haircut, speaking English.',
      'Some traits are a MIX — e.g., height is partly inherited (genes) and partly environmental (nutrition).',
    ], vocabulary: [{ term: 'trait', definition: 'a feature of a living thing.' }, { term: 'inherited', definition: 'passed down from parent to offspring.' }, { term: 'gene', definition: 'instructions inside the body that decide many traits.' }], estimatedMinutes: 4 },
    { id: 'worked-classify', kind: 'worked_example', problem: 'Sort: (1) brown eyes, (2) speaking French, (3) a scar from falling off a bike, (4) being tall, (5) curly hair.', steps: [
      'Brown eyes: comes from genes → INHERITED.',
      'Speaking French: learned → ACQUIRED.',
      'Scar from falling: experience → ACQUIRED.',
      'Tall: mostly INHERITED (genes set the range) but environment matters (nutrition).',
      'Curly hair: comes from genes → INHERITED.',
    ], answer: 'Inherited: 1, 4 (mostly), 5. Acquired: 2, 3.', estimatedMinutes: 3 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A plant grows in poor soil and is small. Its parent plant is huge. Did the plant inherit the "small" trait, or is the small size from environment?', expectedAnswer: 'environment (poor soil) — its genes are for big, but bad conditions kept it small', responseFormat: 'free', hints: ['Look at the parent — what does the genetic potential say?', 'Then look at the conditions — what does the environment do?'], estimatedMinutes: 2 },
    { id: 'misconception-everything-genetic', kind: 'misconception_check', question: 'A friend says "everything about you came from your parents." Is that fully right?', commonErrors: [{ answer: 'Yes — all from parents.', misconception: 'Ignoring environmental and learned influences.', correctsTo: 'Many traits ARE from parents (eye color, hair shape) — but lots of things about you come from EXPERIENCE: skills, language, scars, even how strong your muscles are. Both genes AND environment shape who you are.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['Inherited = from parents (genes).', 'Acquired = from experience or environment.', 'Some traits mix both.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
