/**
 * HS Physics — Electric Charge and Coulomb's Law.
 * NGSS HS-PS2-4: Coulomb's law for electric forces.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_ELECTRIC_CHARGE_COULOMB: LessonPlan = {
  id: 'evelyn.hs.science.physics.electric-charge-coulomb.v1',
  title: "Electric Charge and Coulomb's Law",
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps2-4', description: 'Use mathematical representations of Newton\'s Law of Gravitation and Coulomb\'s Law to describe and predict the gravitational and electrostatic forces between objects.', standard: 'NGSS.HS-PS2-4' }],
  prerequisites: ['hs.phys.gravitation'], followUps: ['hs.phys.circuits-ohms-law'], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in static electricity.', script: 'Rub a balloon on your hair, stick it to a wall — defying gravity. That tiny electric force is over 10³⁹ times STRONGER than gravity. The electron and proton in a hydrogen atom hold each other together with electric force. It runs the universe at small scales.', estimatedMinutes: 2 },
    { id: 'concept-charge', kind: 'concept', goal: 'Charge: positive or negative; like repels, opposite attracts.', keyIdeas: [
      'CHARGE: a property of matter, like mass.',
      'TWO TYPES: POSITIVE (+) and NEGATIVE (−).',
      'CARRIERS:',
      '  · Proton: +e (e = 1.6×10⁻¹⁹ C).',
      '  · Electron: −e.',
      '  · Neutron: 0.',
      'RULE: LIKE charges REPEL. UNLIKE charges ATTRACT.',
      'CHARGE QUANTIZED: comes in multiples of e.',
      'CHARGE CONSERVED: total charge in a closed system doesn\'t change.',
      'STATIC ELECTRICITY: imbalance of charge from rubbing → some objects gain electrons, others lose.',
      'INSULATORS hold charge (rubber, glass). CONDUCTORS let it flow (metals).',
    ], vocabulary: [{ term: 'coulomb (C)', definition: 'unit of charge.' }, { term: 'electron', definition: 'negatively charged particle (−e).' }, { term: 'electric field', definition: 'force per unit charge.' }], estimatedMinutes: 4 },
    { id: 'concept-coulomb-law', kind: 'concept', goal: 'F = k q₁q₂/r². Inverse square, like gravity but with sign.', keyIdeas: [
      'COULOMB\'S LAW: F = k × |q₁ × q₂| / r².',
      '  · k = 9 × 10⁹ N·m²/C² (Coulomb constant).',
      '  · q₁, q₂ = charges (C).',
      '  · r = separation (m).',
      'ATTRACTIVE if signs OPPOSITE; REPULSIVE if signs SAME.',
      'INVERSE SQUARE: doubling distance → 1/4 the force (just like gravity).',
      'COMPARED to gravity: same r² law, but electric force MUCH stronger.',
      '  · Electron-proton in H atom: electric force ~10⁴⁰ times stronger than gravitational.',
    ], suggestedTools: ['show_equation'], estimatedMinutes: 4 },
    { id: 'worked-coulomb', kind: 'worked_example', problem: 'Two charges, +3 μC and -2 μC, are 10 cm apart. What is the force between them? (k = 9×10⁹)', steps: [
      'Convert: q₁ = 3×10⁻⁶ C, q₂ = 2×10⁻⁶ C, r = 0.10 m.',
      'F = k|q₁q₂|/r² = (9×10⁹)(3×10⁻⁶)(2×10⁻⁶) / (0.10)².',
      'Numerator: (9×10⁹)(6×10⁻¹²) = 54×10⁻³ = 0.054.',
      'Denominator: 0.01.',
      'F = 0.054 / 0.01 = 5.4 N.',
      'Signs OPPOSITE → ATTRACTIVE force, 5.4 N.',
    ], answer: 'F = 5.4 N, attractive (opposite signs).', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'If the distance between two equal positive charges triples, how does the force change?', expectedAnswer: 'F ∝ 1/r². Tripling r → r² becomes 9× → F becomes 1/9 of original. Same charges (still repel), but 9 times weaker. (Same inverse-square scaling as gravity.)', responseFormat: 'numeric', hints: ['Inverse square law.', 'r² in denominator.'], estimatedMinutes: 3 },
    { id: 'misconception-rub-create', kind: 'misconception_check', question: 'A friend says "rubbing a balloon on your hair CREATES electric charge." Right?', commonErrors: [{ answer: 'Yes — rubbing creates charge.', misconception: 'Believing rubbing creates new charges.', correctsTo: 'Charge is CONSERVED — never created or destroyed. Rubbing just TRANSFERS electrons from one material to another. Hair loses electrons → becomes positive. Balloon gains them → becomes negative. Total charge before = total charge after.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Like charges repel; opposites attract.', 'Coulomb\'s law: F = kq₁q₂/r². Inverse square.', 'Charge is conserved (never created/destroyed).', 'Charge is quantized (multiples of e = 1.6×10⁻¹⁹ C).'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
