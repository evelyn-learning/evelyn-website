import type { Scenario } from '../types';

/**
 * Measurement scenario (Pillar 3 broaden, 2026-06-20) — CHEMISTRY diagram.
 * Exercises the reaction_coordinate Cat-B validator family — mostly STRUCTURAL
 * (curve shape: reactants/products levels, activation-energy hump, catalyst
 * lowering Ea), light on numeric. Probes whether errors here are structural
 * (figure) vs prose, and whether the validator rejects valid intent.
 */
const scenario: Scenario = {
  name: 'chem-reaction-coordinate',
  description: 'AP Chem reaction rates — reaction-coordinate diagram (structural figure).',
  start: {
    subject: 'science',
    level: 'AP',
    topic: 'ap-chem',
    lessonPlanId: 'evelyn.ap.chem.reaction-rates.v1',
    studentName: 'Test Student',
  },
  seedTurns: [
    { say: 'reaction rates and activation energy', watchFor: 'Tutor enters the reaction-rates segment.' },
  ],
  testTurns: [
    {
      say: 'Draw the reaction coordinate diagram for an EXOthermic reaction, label the activation energy and ΔH.',
      watchFor: 'Products BELOW reactants (exothermic); Ea hump present; ΔH negative. Figure correct? Validator rejection?',
      timeoutMs: 180_000,
    },
    {
      say: 'Now show how a catalyst changes that diagram.',
      watchFor: 'Catalyst lowers the activation-energy hump only (same reactant/product levels). Correctly rendered?',
      timeoutMs: 150_000,
    },
  ],
};

export default scenario;
