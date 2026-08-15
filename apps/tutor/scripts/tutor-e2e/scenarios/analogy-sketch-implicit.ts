import type { Scenario } from '../types';
/** Reproduces the 2026-06-23 live ear-test UNDER-FIRE condition: a student who
 *  wants to UNDERSTAND entropy/spontaneity and volunteers everyday examples
 *  (glass breaking) but NEVER explicitly asks for a picture/drawing. In that
 *  session the brain narrated prime analogies (perfume bottle, glass shattering)
 *  but anchored them with show_equation / tutor_scribble — never show_sketch — so
 *  no doodle appeared.
 *
 *  This is the A/B surface for the under-fire FIX (relaxed analogy auto-fire gate
 *  + broadened declarative detectAnalogy + prompt anti-substitution nudge). With
 *  the fix, declarative analogies ("a glass shattering is a perfect example")
 *  should produce a doodle via show_sketch (brain choice) or the auto-fire,
 *  EVEN on turns where the brain also scribbled/wrote an equation. Distinct from
 *  analogy-sketch.ts, whose student explicitly requests pictures (prompt path).
 *  See project_tutor_sketch_capability. */
const scenario: Scenario = {
  name: 'analogy-sketch-implicit',
  description: 'Entropy/spontaneity, student wants to UNDERSTAND (no explicit "draw it") — the under-fire surface.',
  start: { subject: 'science', level: '11-12', topic: 'chemistry', lessonPlanId: 'evelyn.ap.chem.thermodynamics.v1', studentName: 'Test Student' },
  seedTurns: [{ say: 'entropy and spontaneity' }],
  testTurns: [],
  cooperativeStudent: {
    profile: 'struggling',
    firstSay: "I don't really get why chemical reactions only go one direction. Can you help me understand entropy?",
    goal:
      'Understand entropy and spontaneity CONCEPTUALLY. The student is NOT a confident learner and asks plain "can you explain"/"I\'m stuck" questions — they do NOT ask for a drawing or picture (do not have the student request a sketch). When prompted for a real-world example of increasing disorder, the student volunteers "when I drop a glass and it breaks". ' +
      'Correct content the tutor should convey: entropy = disorder / number of ways to arrange a system; spontaneous processes increase total entropy and run downhill toward lower free energy; everyday irreversible events (a glass shattering, gas/perfume spreading through a room, ice melting) go one way and never reverse on their own. ' +
      'Grade RESPONSE QUALITY: the tutor passes a turn when it explains correctly and clearly for a struggling student. It FAILS only for a wrong/garbled/contradictory statement or ignoring the question.',
    turns: 6,
  },
};
export default scenario;
