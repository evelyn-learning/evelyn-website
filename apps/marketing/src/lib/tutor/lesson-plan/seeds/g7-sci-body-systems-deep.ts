/**
 * Grade 7 Science — Human Body Systems (Deep).
 * NGSS MS-LS1-3: how body systems interact in detail.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_SCI_BODY_SYSTEMS_DEEP: LessonPlan = {
  id: 'evelyn.g7.science.life.body-systems-deep.v1',
  title: 'Human Body Systems: Deeper Look',
  curriculum: 'NGSS', grade: '7', subject: 'science', topic: 'life-science', locale: 'en',
  los: [{ id: 'ngss.ms-ls1-3', description: 'Use argument supported by evidence for how the body is a system of interacting subsystems composed of groups of cells.', standard: 'NGSS.MS-LS1-3' }],
  prerequisites: ['ngss.ms-ls1-1'], followUps: ['ngss.hs-ls1-2'], estimatedMinutes: 25,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in interconnection.', script: 'When you exercise, your heart races, breathing speeds up, you sweat, blood diverts to muscles. ONE action — running — triggers changes in 5+ body systems simultaneously. How do they coordinate?', estimatedMinutes: 2 },
    { id: 'concept-coordination', kind: 'concept', goal: 'The nervous and endocrine systems coordinate all other systems through electrical signals and chemical hormones.', keyIdeas: [
      'NERVOUS SYSTEM: brain + spinal cord + nerves. Sends FAST electrical signals.',
      '  · Sensory neurons → input from senses to brain.',
      '  · Motor neurons → output from brain to muscles.',
      '  · Brain processes everything; spinal cord handles reflexes.',
      'ENDOCRINE SYSTEM: glands releasing HORMONES into blood. SLOW but long-lasting effects.',
      '  · Pituitary (master gland), thyroid (metabolism), adrenals (stress), pancreas (blood sugar).',
      'IMMUNE SYSTEM: defends against pathogens.',
      '  · Innate (general): skin barrier, white blood cells.',
      '  · Adaptive (specific): T cells + B cells learn specific invaders + remember them.',
      '  · Vaccines train immune memory without making you sick.',
      'CIRCULATORY: heart + blood vessels + blood. Connects EVERYTHING — delivers O₂, nutrients, hormones; carries waste away.',
      'DIGESTIVE: mouth → esophagus → stomach → small intestine (most absorption) → large intestine (water reabsorption) → out.',
      'RESPIRATORY: nose/mouth → trachea → bronchi → alveoli (where O₂/CO₂ exchange happens). Working with circulatory.',
    ], vocabulary: [{ term: 'hormone', definition: 'chemical signal from glands.' }, { term: 'reflex', definition: 'automatic response without brain involvement.' }, { term: 'pathogen', definition: 'disease-causing organism.' }], estimatedMinutes: 6 },
    { id: 'worked-running', kind: 'worked_example', problem: 'You start running. Trace what happens in 5+ body systems within seconds.', steps: [
      'NERVOUS: brain decides → motor neurons fire → muscles contract.',
      'MUSCULAR: legs push off ground; arms swing for balance.',
      'CIRCULATORY: heart rate jumps from ~70 to 150+ bpm. Blood diverted from gut to leg muscles.',
      'RESPIRATORY: breathing rate doubles or triples. More O₂ in, more CO₂ out.',
      'ENDOCRINE: adrenaline released → reinforces all of the above.',
      'EXCRETORY: kidneys reduce urine output (conserve water); sweat increases (cooling).',
    ], answer: '6+ systems coordinate within seconds. Brain orchestrates via nerves; adrenaline amplifies via blood; muscles do the work fueled by O₂ + glucose delivered by circulation.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A virus enters your body through a cut. List the systems involved in fighting it off.', expectedAnswer: 'Skin (integumentary, first barrier — was breached). Immune (white blood cells attack; memory cells form). Circulatory (delivers immune cells to wound). Lymphatic (drains pathogens to lymph nodes for filtering). Nervous (you might feel pain → behavior to protect the wound). Sometimes endocrine (stress response).', responseFormat: 'free', hints: ['Defense involves more than just the immune system.', 'How do the immune cells get there?'], estimatedMinutes: 3 },
    { id: 'misconception-control-only-brain', kind: 'misconception_check', question: 'A friend says "the brain controls everything in the body — every signal goes through it." Is that fully right?', commonErrors: [{ answer: 'Yes — all through brain.', misconception: 'Centralizing all control in the brain.', correctsTo: 'Brain coordinates a lot, but: (a) reflexes go through the spinal cord without brain involvement (faster), (b) the heart has its own pacemaker — beats without brain input, (c) the gut has its own neural network ("second brain"), (d) the immune system makes complex decisions on its own, (e) hormones from glands act independently.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Nervous = fast electrical signals.', 'Endocrine = slower chemical hormones.', 'Circulatory connects everything.', 'Immune system: innate + adaptive (with memory).', 'Most actions trigger MULTIPLE systems at once.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
