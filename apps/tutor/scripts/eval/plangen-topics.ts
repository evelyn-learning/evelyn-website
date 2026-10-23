/**
 * The 30 typed "Ask a question" topics for the plangen model-compare eval
 * (2026-10-22, brief .superpowers/sdd/plangen-model-compare-brief.md).
 * Phrased as a student types them; subject / grade band as the portal's
 * plan-generate request carries them (grade bands match session-budget.ts).
 */
export interface EvalTopic {
  id: string;
  text: string;
  subject: string;
  grade: string;
}

export const PLANGEN_TOPICS: EvalTopic[] = [
  // Math (12)
  { id: 'm01-ratios', text: "I don't get ratios and proportions", subject: 'math', grade: '6-8' },
  { id: 'm02-equations', text: 'how do I solve one-step and two-step equations', subject: 'math', grade: '6-8' },
  { id: 'm03-systems-sub', text: 'solving systems of equations by substitution', subject: 'math', grade: '9-10' },
  { id: 'm04-factor-a', text: 'factoring quadratics when a is not 1', subject: 'math', grade: '9-10' },
  { id: 'm05-exponents', text: 'exponent rules, negative and zero exponents', subject: 'math', grade: '9-10' },
  { id: 'm06-similar', text: 'how do I know if two triangles are similar', subject: 'math', grade: '9-10' },
  { id: 'm07-circles', text: 'circle theorems: inscribed angles and arcs', subject: 'math', grade: '9-10' },
  { id: 'm08-sohcahtoa', text: 'SOHCAHTOA and finding missing sides', subject: 'math', grade: '9-10' },
  { id: 'm09-logs', text: 'logarithms — what are they and how do I solve log equations', subject: 'math', grade: '11-12' },
  { id: 'm10-sequences', text: 'arithmetic vs geometric sequences and their formulas', subject: 'math', grade: '11-12' },
  { id: 'm11-probability', text: 'probability of independent and dependent events', subject: 'math', grade: '9-10' },
  { id: 'm12-normal', text: 'the normal distribution and z-scores', subject: 'math', grade: '11-12' },
  // Physics (5)
  { id: 'p01-newton2', text: "Newton's second law problems with friction", subject: 'physics', grade: '9-10' },
  { id: 'p02-projectile', text: 'projectile motion launched at an angle', subject: 'physics', grade: '11-12' },
  { id: 'p03-circuits', text: "Ohm's law and series vs parallel circuits", subject: 'physics', grade: '9-10' },
  { id: 'p04-energy', text: 'conservation of energy with a roller coaster', subject: 'physics', grade: '9-10' },
  { id: 'p05-waves', text: 'wave speed, frequency and wavelength', subject: 'physics', grade: '9-10' },
  // Chemistry (5)
  { id: 'c01-mole', text: 'what is a mole and how do I convert grams to moles', subject: 'chemistry', grade: '9-10' },
  { id: 'c02-balancing', text: 'balancing chemical equations', subject: 'chemistry', grade: '9-10' },
  { id: 'c03-limiting', text: 'stoichiometry: limiting reactant problems', subject: 'chemistry', grade: '11-12' },
  { id: 'c04-gas-law', text: 'the ideal gas law PV=nRT', subject: 'chemistry', grade: '11-12' },
  { id: 'c05-ph', text: 'pH and the difference between strong and weak acids', subject: 'chemistry', grade: '11-12' },
  // Biology (4)
  { id: 'b01-resp-photo', text: 'cellular respiration vs photosynthesis', subject: 'biology', grade: '9-10' },
  { id: 'b02-punnett', text: 'Punnett squares and Mendelian genetics', subject: 'biology', grade: '9-10' },
  { id: 'b03-osmosis', text: 'osmosis and diffusion across a cell membrane', subject: 'biology', grade: '6-8' },
  { id: 'b04-dna-rep', text: 'DNA replication steps', subject: 'biology', grade: '11-12' },
  // Other (4)
  { id: 'o01-sva', text: 'subject-verb agreement with tricky subjects', subject: 'ela', grade: '6-8' },
  { id: 'o02-thesis', text: 'how to write a strong thesis statement', subject: 'ela', grade: '9-10' },
  { id: 'o03-ww1', text: 'the main causes of World War I', subject: 'history', grade: '9-10' },
  { id: 'o04-supply-demand', text: 'supply and demand and how prices settle', subject: 'economics', grade: '11-12' },
];
