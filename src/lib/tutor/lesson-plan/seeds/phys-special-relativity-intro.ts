/**
 * HS Physics — Introduction to Special Relativity.
 * Time dilation, length contraction, mass-energy.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_SPECIAL_RELATIVITY_INTRO: LessonPlan = {
  id: 'evelyn.hs.science.physics.special-relativity-intro.v1',
  title: 'Introduction to Special Relativity',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps3-2', description: 'Develop and use models to illustrate that energy at the macroscopic scale can be accounted for as a combination of energy associated with the motions of particles (objects) and energy associated with the relative positions of particles (objects).', standard: 'NGSS.HS-PS3-2' }],
  prerequisites: ['hs.phys.modern-intro'], followUps: [], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in counterintuitive truth.', script: 'A clock on a fast-moving plane runs slower than one on the ground. Not by much — but measurably, and confirmed thousands of times. Time itself is RELATIVE to the observer. Einstein\'s 1905 theory broke 200 years of Newtonian intuition.', estimatedMinutes: 2 },
    { id: 'concept-postulates', kind: 'concept', goal: "Einstein's two postulates: laws same in all inertial frames; speed of light is constant.", keyIdeas: [
      'EINSTEIN\'S TWO POSTULATES (1905):',
      '1. The laws of physics are the SAME in all INERTIAL frames (no preferred frame of reference).',
      '2. The SPEED OF LIGHT (c = 3×10⁸ m/s) is the SAME for all observers, regardless of motion.',
      'POSTULATE 2 is shocking: if you chase a light beam at 99% of c, it STILL appears to move at c relative to you. (Not c − 0.99c.)',
      'CONSEQUENCES: time + space MUST be relative.',
    ], vocabulary: [{ term: 'inertial frame', definition: 'reference frame moving at constant velocity.' }, { term: 'time dilation', definition: 'moving clocks run slow.' }, { term: 'length contraction', definition: 'moving objects shrink in direction of motion.' }], estimatedMinutes: 4 },
    { id: 'concept-effects', kind: 'concept', goal: 'Time dilation, length contraction, mass-energy equivalence.', keyIdeas: [
      'TIME DILATION: a moving clock RUNS SLOWER (as seen by stationary observer).',
      '  · Δt\' = Δt × γ, where γ = 1/√(1 − v²/c²) (Lorentz factor).',
      '  · At normal speeds, γ ≈ 1 → no noticeable effect.',
      '  · At v = 0.87c, γ ≈ 2 → time runs at half speed.',
      'LENGTH CONTRACTION: moving objects appear SHORTER in the direction of motion.',
      '  · L\' = L / γ.',
      'MASS-ENERGY: E² = (pc)² + (mc²)². For rest mass: E = mc².',
      'Nothing with mass can reach c — would need infinite energy.',
      'Time dilation has been MEASURED: GPS satellites must correct for it (their clocks run faster than ground because they\'re in weaker gravity, slower because they move fast — net correction needed).',
    ], suggestedTools: ['show_equation'], estimatedMinutes: 4 },
    { id: 'worked-twin', kind: 'worked_example', problem: 'TWIN PARADOX: one twin stays on Earth; the other travels at 0.8c to a star 4 light-years away and back. Who ages less?', steps: [
      'For the traveler at v = 0.8c: γ = 1/√(1 − 0.64) = 1/√0.36 = 1/0.6 ≈ 1.67.',
      'Earth-bound twin sees: trip takes 4 ly / 0.8c = 5 years there + 5 back = 10 years.',
      'Traveler experiences time DILATED: 10 / 1.67 ≈ 6 years.',
      'Earth twin: aged 10 years. Traveling twin: aged 6 years.',
      'When they reunite, traveler is YOUNGER by 4 years.',
      'Why "paradox"? Both seem to think the other is moving — but the TRAVELER ACCELERATES (changes frames) → they\'re the one who ages less.',
    ], answer: 'Traveler ages less (6 years vs Earth twin\'s 10). Time dilation = real, asymmetric due to acceleration.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Why don\'t we notice time dilation in everyday life?', expectedAnswer: 'γ ≈ 1 unless v approaches c. At highway speeds (~30 m/s), v/c ≈ 10⁻⁷, so γ ≈ 1 + 10⁻¹⁴ — completely undetectable. Effects only become noticeable at significant fractions of c. GPS satellites move ~3.9 km/s — small but enough that without relativistic correction, GPS would drift ~10 km off per day.', responseFormat: 'free', hints: ['Compare everyday speeds to c.', 'Look at γ when v is small.'], estimatedMinutes: 3 },
    { id: 'misconception-not-real', kind: 'misconception_check', question: 'A friend says "time dilation is just an illusion — moving clocks just APPEAR slower, but they really tick at the same rate." Right?', commonErrors: [{ answer: 'Yes — illusion only.', misconception: 'Treating relativity as observational error.', correctsTo: 'Time dilation is REAL, not an illusion. Atomic clocks have been flown around the world and compared to stationary clocks — the moving clocks measurably "lost" time. Muons (subatomic particles) created in the upper atmosphere reach the ground only because their internal clocks are dilated — without relativity, they\'d decay before reaching us. Time really IS frame-dependent.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Speed of light = c, same for all observers.', 'Moving clocks run slow (time dilation).', 'Moving objects contract in length.', 'E = mc² — mass and energy interchangeable. Nothing with mass reaches c.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
