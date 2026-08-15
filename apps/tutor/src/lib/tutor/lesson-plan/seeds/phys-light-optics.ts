/**
 * HS Physics — Light and Optics.
 * NGSS HS-PS4-3: wave/particle nature of light.
 */

import type { LessonPlan } from '../types';

export const SEED_PHYS_LIGHT_OPTICS: LessonPlan = {
  id: 'evelyn.hs.science.physics.light-optics.v1',
  title: 'Light and Optics',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'physics', locale: 'en',
  los: [{ id: 'ngss.hs-ps4-3', description: 'Evaluate the claims, evidence, and reasoning behind the idea that electromagnetic radiation can be described either by a wave model or a particle model.', standard: 'NGSS.HS-PS4-3' }],
  prerequisites: ['hs.phys.waves-sound'], followUps: [], estimatedMinutes: 22,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in light\'s strangeness.', script: 'Light bends through glass. Light bounces off mirrors. Light spreads colors through a prism. Light brings stars\' image from billions of light-years away. ELECTROMAGNETIC waves — and behavior is governed by simple geometric rules.', estimatedMinutes: 2 },
    { id: 'concept-light-em', kind: 'concept', goal: 'Light is part of the EM spectrum — travels at c in vacuum.', keyIdeas: [
      'LIGHT is an ELECTROMAGNETIC WAVE — oscillating electric + magnetic fields.',
      'Speed in VACUUM: c = 3.00 × 10⁸ m/s. The cosmic speed limit.',
      'EM SPECTRUM (low f → high f):',
      '  · Radio < Microwave < Infrared < VISIBLE < Ultraviolet < X-ray < Gamma.',
      'VISIBLE LIGHT: ~400 nm (violet) to ~700 nm (red). All other EM is "invisible" to our eyes but exists.',
      'Light travels in STRAIGHT LINES in a uniform medium.',
      'Different wavelengths = different colors. ROYGBIV.',
    ], vocabulary: [{ term: 'EM spectrum', definition: 'all electromagnetic wavelengths.' }, { term: 'reflection', definition: 'light bouncing off a surface.' }, { term: 'refraction', definition: 'light bending when crossing into new medium.' }], suggestedTools: ['show_diagram'], estimatedMinutes: 4 },
    { id: 'concept-reflection-refraction', kind: 'concept', goal: 'Reflection: angle in = angle out. Refraction: bend due to speed change.', keyIdeas: [
      'REFLECTION (Law): angle of incidence = angle of reflection. Both measured from NORMAL (perpendicular to surface).',
      'Mirrors: smooth → clear image. Rough surfaces → diffuse reflection.',
      'REFRACTION: light BENDS when entering a new medium because its SPEED changes.',
      '  · Faster medium → slower medium (e.g., air → water): light bends TOWARD normal.',
      '  · Slower → faster: bends AWAY from normal.',
      'INDEX OF REFRACTION (n): n = c/v. Higher n = slower light.',
      '  · Vacuum: n = 1.00. Air: ~1.00. Water: 1.33. Glass: ~1.5. Diamond: 2.42.',
      'SNELL\'S LAW: n₁ sin θ₁ = n₂ sin θ₂.',
      'PRISMS split white light into colors because each color has slightly different speed (and n) in glass → different bend angles.',
    ], estimatedMinutes: 5 },
    { id: 'worked-snell', kind: 'worked_example', problem: 'Light hits the surface of water (n = 1.33) from air (n = 1.00) at a 30° angle from the normal. What\'s the angle in water?', steps: [
      'Snell\'s Law: n₁ sin θ₁ = n₂ sin θ₂.',
      '(1.00) × sin(30°) = (1.33) × sin(θ₂).',
      '0.5 = 1.33 × sin(θ₂).',
      'sin(θ₂) = 0.5/1.33 ≈ 0.376.',
      'θ₂ = arcsin(0.376) ≈ 22°.',
      'Light bends TOWARD the normal entering denser water (smaller angle from normal).',
    ], answer: 'θ₂ ≈ 22°. Light slows in water → bends toward the normal.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'Why does a straw in a glass of water LOOK BENT at the water\'s surface?', expectedAnswer: 'REFRACTION. Light from the underwater part of the straw bends as it leaves water and enters air. Your brain assumes light traveled in a straight line → "sees" the underwater part shifted from where it actually is. The straw isn\'t bent; the LIGHT path is. Same reason fish appear closer to surface than they really are.', responseFormat: 'free', hints: ['What happens to light at the water surface?', 'Your brain assumes straight-line travel.'], estimatedMinutes: 3 },
    { id: 'misconception-color-mixed-light', kind: 'misconception_check', question: 'A friend says "white light is one color and prisms add the rainbow." Right?', commonErrors: [{ answer: 'Yes — prism adds colors.', misconception: 'Thinking prisms create colors.', correctsTo: 'Newton showed: WHITE LIGHT is ALREADY a MIXTURE of all colors. Prisms just SEPARATE them — different colors refract at different angles, spreading them into a rainbow. A second prism can recombine the colors into white. Prism doesn\'t add anything; it sorts.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['Light = EM wave. Speed in vacuum = c.', 'Reflection: angle in = angle out.', 'Refraction: light bends when speed changes (Snell\'s law).', 'White light contains all colors; prisms separate them.'], estimatedMinutes: 2 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
