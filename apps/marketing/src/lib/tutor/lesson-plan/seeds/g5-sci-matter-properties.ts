/**
 * Grade 5 Science — Matter and Its Properties.
 * NGSS 5-PS1-1 / 5-PS1-3: matter is made of particles too small to
 * be seen; identifiable properties of materials.
 */

import type { LessonPlan } from '../types';

export const SEED_G5_SCI_MATTER_PROPERTIES: LessonPlan = {
  id: 'evelyn.g5.science.matter.properties.v1',
  title: 'Matter and Its Properties',
  curriculum: 'NGSS', grade: '5', subject: 'science', topic: 'matter', locale: 'en',
  los: [{ id: 'ngss.5-ps1-1', description: 'Develop a model to describe that matter is made of particles too small to be seen.', standard: 'NGSS.5-PS1-1' }, { id: 'ngss.5-ps1-3', description: 'Make observations and measurements to identify materials based on their properties.', standard: 'NGSS.5-PS1-3' }],
  prerequisites: ['ngss.2-ps1-1'], followUps: ['ngss.ms-ps1-1'], estimatedMinutes: 18,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Set up the surprising idea that everything is made of tiny particles.', script: 'Hold up a glass of water. It LOOKS smooth and continuous. But if you could zoom WAY in — billions of times — you\'d see it\'s actually made of TINY PARTICLES called molecules. Same is true of air, your hand, this paper. Everything is particles too small to see.', estimatedMinutes: 2 },
    { id: 'concept-particles', kind: 'concept', goal: 'All matter is made of particles. Particles are arranged differently in solids, liquids, and gases — and that explains the differences we see.', keyIdeas: [
      'MATTER = anything with mass that takes up space.',
      'All matter is made of tiny PARTICLES (atoms or molecules) too small to see.',
      'In SOLIDS: particles packed tightly, vibrate in place. Holds shape.',
      'In LIQUIDS: particles still close, but slide past each other. Takes container shape.',
      'In GASES: particles spread far apart, move fast in all directions. Fills container.',
      'Adding HEAT makes particles move faster — solid → liquid → gas.',
    ], vocabulary: [{ term: 'matter', definition: 'anything with mass and volume.' }, { term: 'particle', definition: 'a tiny piece of matter (atom or molecule).' }, { term: 'molecule', definition: 'two or more atoms bonded together.' }], estimatedMinutes: 5 },
    { id: 'concept-properties', kind: 'concept', goal: 'Properties — color, hardness, density, magnetism, ability to conduct heat or electricity, solubility — let us identify materials.', keyIdeas: [
      'OBSERVABLE PROPERTIES help us identify what a material is:',
      '  · Color, texture, smell, taste',
      '  · Hardness (can it scratch others?)',
      '  · Density (heavy for its size?)',
      '  · Magnetism (does a magnet stick?)',
      '  · Conductivity (does electricity or heat flow through?)',
      '  · Solubility (does it dissolve in water?)',
      'No single property identifies a material — but TOGETHER they fingerprint it.',
    ], vocabulary: [{ term: 'density', definition: 'how much mass is packed into a volume.' }, { term: 'conductor', definition: 'lets heat or electricity flow.' }, { term: 'insulator', definition: 'blocks heat or electricity flow.' }], estimatedMinutes: 4 },
    { id: 'worked-identify-mystery', kind: 'worked_example', problem: 'You have a mystery metal cube. It\'s gray, attracted to a magnet, conducts electricity, and sinks fast in water. What is it likely to be?', steps: [
      'Gray + metal: many possibilities (iron, lead, aluminum, etc.).',
      'Magnetic: narrows to iron, steel, or nickel (most metals are NOT magnetic).',
      'Conducts electricity: yes, all metals do.',
      'Sinks fast: dense.',
      'Most likely: IRON or STEEL (steel is mostly iron).',
    ], answer: 'Likely iron or steel — magnetic + dense + gray + conductive narrows it.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'You have salt and sugar in two unmarked jars. Both are white crystalline powders. Without tasting, how could you tell them apart?', expectedAnswer: 'Test SOLUBILITY in cold water (both dissolve, similar) — that\'s not unique. Better: BURN a small amount. Sugar caramelizes/burns into black carbon and gives off a sweet smell. Salt doesn\'t burn or change. Or: dissolve in water and add a few drops of silver nitrate (lab) — salt makes a white cloud (chloride reaction), sugar doesn\'t.', responseFormat: 'free', hints: ['Both dissolve — solubility doesn\'t separate them.', 'How do they react to heat?'], estimatedMinutes: 3 },
    { id: 'misconception-particles-have-color', kind: 'misconception_check', question: 'A friend says "if water is BLUE, then water molecules are blue too — all particles must have colors." Is that right?', commonErrors: [{ answer: 'Yes — particles have colors.', misconception: 'Treating bulk-material properties as particle-level properties.', correctsTo: 'COLOR is a bulk property — many particles together. A single water molecule doesn\'t have a color (it\'s smaller than the wavelength of light). Many particles together absorb and reflect light in patterns we see as color.' }], estimatedMinutes: 2 },
    { id: 'recap', kind: 'recap', mustRemember: ['All matter is made of tiny particles.', 'Solid/liquid/gas differs in particle arrangement and motion.', 'Properties (density, magnetism, conductivity, solubility) identify materials.', 'Combine multiple properties to fingerprint a substance.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
