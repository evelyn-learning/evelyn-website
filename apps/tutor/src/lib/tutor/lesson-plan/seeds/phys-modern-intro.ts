/**
 * HS Physics — Introduction to Modern Physics.
 * Quantum behavior of light + matter; nuclear basics.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_MODERN_INTRO: LessonPlan = {
  id: 'evelyn.hs.science.physics.modern-intro.v1',
  title: 'Introduction to Modern Physics',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps4-3', description: 'Evaluate the claims, evidence, and reasoning behind the idea that electromagnetic radiation can be described either by a wave model or a particle model.', standard: 'NGSS.HS-PS4-3' }],
  prerequisites: ['hs.phys.light-optics'], followUps: ['hs.phys.special-relativity-intro'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in the strange world.', script: 'In 1900, physics seemed almost done. Then: light acts like a particle. Particles act like waves. Time slows for fast travelers. Energy is locked in atomic nuclei (E = mc²). Modern physics broke common sense — and gave us lasers, transistors, GPS, and nuclear power.', estimatedMinutes: 2 },
    { id: 'concept-photons', kind: 'concept', goal: 'Light is both wave AND particle. Photons carry quantized energy.', keyIdeas: [
      'CLASSICAL view: light = wave only. Modern view: light is BOTH wave AND particle.',
      'PHOTON: a "particle" of light. Has energy but NO MASS.',
      'Photon ENERGY: E = h × f.',
      '  · h = Planck\'s constant = 6.63×10⁻³⁴ J·s.',
      '  · f = frequency.',
      'HIGHER frequency → MORE energetic photons.',
      '  · X-rays: high f, harmful to cells.',
      '  · Visible: moderate f.',
      '  · Radio: low f, harmless.',
      'PHOTOELECTRIC EFFECT: light hitting metal can knock out electrons IF photon energy > work function.',
      '  · Showed light is quantized — not just waves. Einstein won Nobel Prize for this.',
      'WAVE-PARTICLE DUALITY: also applies to MATTER — electrons act like waves too.',
    ], vocabulary: [{ term: 'photon', definition: 'particle of light, energy = hf.' }, { term: "Planck's constant", definition: 'h = 6.63×10⁻³⁴ J·s.' }, { term: 'wave-particle duality', definition: 'matter and light have both wave and particle properties.' }], suggestedTools: ['show_equation'], estimatedMinutes: 5 },
    { id: 'concept-nuclear', kind: 'concept', goal: 'Nuclear reactions: fission, fusion, radioactive decay. E = mc².', keyIdeas: [
      'NUCLEUS: tiny, dense, made of protons + neutrons.',
      'STRONG NUCLEAR FORCE holds it together (overpowers electric repulsion of protons).',
      'NUCLEAR REACTIONS:',
      '  · FISSION: heavy nucleus splits → smaller nuclei + huge energy. (Nuclear power plants, atomic bombs.)',
      '  · FUSION: light nuclei combine → heavier nucleus + huge energy. (Sun\'s power source, hydrogen bombs.)',
      '  · RADIOACTIVE DECAY: unstable nuclei spontaneously emit α (alpha), β (beta), or γ (gamma) radiation.',
      'EINSTEIN\'S E = mc²: mass and energy are EQUIVALENT. Tiny mass → enormous energy (c² is huge).',
      '  · 1 g of mass = 9×10¹³ J — could power a city for hours.',
      'HALF-LIFE: time for half the radioactive nuclei to decay.',
    ], estimatedMinutes: 5 },
    { id: 'worked-photon-energy', kind: 'worked_example', problem: 'Calculate the energy of a photon of green light (frequency ≈ 5.5×10¹⁴ Hz). Use h = 6.63×10⁻³⁴ J·s.', steps: [
      'E = h × f.',
      'E = (6.63×10⁻³⁴) × (5.5×10¹⁴).',
      'E ≈ 3.65×10⁻¹⁹ J.',
      'Tiny — but each photon. Sunlight delivers ~10²⁰ photons per second per square meter. Adds up to lots of energy.',
    ], answer: 'E ≈ 3.65×10⁻¹⁹ J per photon. Small per photon; huge in bulk.', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Why is UV light more dangerous to skin than visible light, even at the same intensity?', expectedAnswer: 'UV has HIGHER FREQUENCY → photons carry MORE ENERGY (E = hf). UV photons have enough energy to break chemical bonds in DNA → mutation → cancer risk. Visible light photons lack the energy to damage DNA. Even few UV photons can cause damage; lots of visible light photons can\'t.', responseFormat: 'free', hints: ['Compare photon energies.', 'What does it take to damage DNA?'], estimatedMinutes: 3 },
    { id: 'misconception-mass-energy', kind: 'misconception_check', question: 'A friend says "E = mc² is just a formula — mass and energy can\'t actually be the same thing." Right?', commonErrors: [{ answer: 'Yes — different things.', misconception: 'Treating E = mc² as theoretical only.', correctsTo: 'Mass and energy really ARE interchangeable. In nuclear reactions, a TINY bit of mass converts to a HUGE amount of energy (because c² is enormous). The mass DECREASES — measurably. Nuclear power and the Sun\'s energy come from this conversion. E = mc² is observed reality, not just a formula.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Light is wave AND particle (photons), E = hf.', 'Wave-particle duality applies to electrons too.', 'Nuclear reactions: fission splits, fusion combines, both release energy.', 'E = mc² — small mass → huge energy.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
