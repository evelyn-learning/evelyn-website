import type { Scenario } from '../types';
/** AP Chem thermodynamics — a CONCEPTUAL-narration flow (not a computation).
 *  The student wants to UNDERSTAND ΔG = ΔH − TΔS — what each term means, how the
 *  sign of ΔG predicts spontaneity, the role of temperature — with no numbers to
 *  crunch. This is the bare-board, speech-only surface the Board-Anchored-Speech
 *  feature targets (the Test-4 2026-06-21 ΔG gap): the tutor should MARK the
 *  on-board equation's terms and WRITE the sign rules as it explains, rather than
 *  narrating relationships against a static board. Use as the A/B surface for
 *  TUTOR_BOARD_ANCHORED_SPEECH. See project_tutor_board_anchored_speech. */
const scenario: Scenario = {
  name: 'thermo-conceptual',
  description: 'AP Chem thermodynamics (ΔG) — conceptual "what does it MEAN" narration, bare-board target.',
  start: { subject: 'science', level: 'AP', topic: 'ap-chem', lessonPlanId: 'evelyn.ap.chem.thermodynamics.v1', studentName: 'Test Student' },
  seedTurns: [{ say: 'gibbs free energy and spontaneity' }],
  testTurns: [],
  cooperativeStudent: {
    profile: 'struggling',
    firstSay: "I memorized that ΔG equals ΔH minus T times ΔS, but I don't really get what it MEANS. Can you help me understand it?",
    goal:
      'Build CONCEPTUAL understanding of ΔG = ΔH − TΔS (no specific numbers required). Correct content the tutor should convey: ' +
      'ΔG < 0 → reaction proceeds forward / spontaneous; ΔG > 0 → not spontaneous (non-spontaneous); ΔG = 0 → at equilibrium. ' +
      'ΔH is the enthalpy change (heat released/absorbed; negative = exothermic). ΔS is the entropy change (disorder; positive = more disorder). ' +
      'T (in kelvin) scales the −TΔS term, so at low T the ΔH term dominates and at high T the entropy term dominates. ' +
      'Grade RESPONSE QUALITY: the tutor passes a turn when it explains these relationships correctly and clearly for a struggling student (re-explains on confusion). ' +
      'It FAILS only for a wrong/garbled/contradictory statement (e.g. sign rule backwards) or ignoring the question.',
    turns: 7,
  },
};
export default scenario;
