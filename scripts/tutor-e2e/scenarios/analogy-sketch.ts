import type { Scenario } from '../types';
/** AP Chem entropy & spontaneity — an ANALOGY-DRIVEN intuition flow. Distinct
 *  from thermo-conceptual (which targets MARK/WRITE on the ΔG equation): here the
 *  student learns VISUALLY and keeps asking for "a picture" / "a way to imagine"
 *  abstract ideas (entropy = disorder, spontaneity = downhill), which pulls the
 *  tutor toward inherently visual/spatial mental images — the SKETCH surface.
 *
 *  This is the A/B surface for the tutor sketch capability: with TUTOR_SKETCH on,
 *  the tutor should draw rough doodles (ball-on-hill, glass-shattering, gas
 *  spreading) via show_sketch — either by choosing the tool (prompt) or via the
 *  detectAnalogy auto-fire when it narrates an analogy with a bare board. With it
 *  off, those turns stay speech-only / table-substituted. See
 *  project_tutor_sketch_capability. */
const scenario: Scenario = {
  name: 'analogy-sketch',
  description: 'AP Chem entropy & spontaneity — analogy/mental-image driven; the SKETCH (show_sketch) surface.',
  start: { subject: 'science', level: 'AP', topic: 'ap-chem', lessonPlanId: 'evelyn.ap.chem.thermodynamics.v1', studentName: 'Test Student' },
  seedTurns: [{ say: 'entropy and spontaneity' }],
  testTurns: [],
  cooperativeStudent: {
    profile: 'cooperative', // engaged visual learner who keeps asking for pictures
    firstSay:
      "I'm a really visual learner and entropy just feels abstract to me. Can you give me a picture or an analogy I can actually imagine for what entropy IS?",
    goal:
      'Build INTUITION for entropy and spontaneity through concrete visual analogies (the student is a visual learner and keeps asking for "a picture" / "a way to imagine it" / "what would that look like"). ' +
      'Correct content the tutor should convey: entropy measures disorder / the number of ways a system can be arranged (more arrangements = higher entropy); ' +
      'a spontaneous process increases the total entropy and runs "downhill" toward lower free energy / a more stable state; ' +
      'everyday irreversible images — a glass shattering into many pieces, gas molecules spreading to fill a room, a ball rolling down a hill to rest — all go ONE way spontaneously and essentially never reverse on their own (that one-wayness IS the second law). ' +
      'Across the turns the student should ask for a visual/analogy at least twice (e.g. "what about spontaneity — can you picture that too?", "is there an image for why it never reverses?"). ' +
      'Grade RESPONSE QUALITY: the tutor passes a turn when it gives a correct, clear, vivid analogy/explanation for a visual learner. ' +
      'It FAILS only for a wrong/garbled/contradictory statement (e.g. entropy decreases spontaneously in an isolated system) or ignoring the question.',
    turns: 7,
  },
};
export default scenario;
