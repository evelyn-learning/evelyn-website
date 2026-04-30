/**
 * AP Physics 2 — Optics: lenses, mirrors, refraction.
 *
 * Snell's law, thin lens equation, ray diagrams.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYSICS2_OPTICS: LessonPlan = {
  id: 'evelyn.ap.physics2.optics.v1',
  title: 'Optics: refraction, lenses, mirrors',
  curriculum: 'NGSS',
  grade: '12',
  subject: 'sci',
  topic: 'physics',
  locale: 'en',
  los: [
    {
      id: 'apphys2.optics',
      description: 'Apply Snell\'s law, thin lens equation, and ray diagrams.',
      standard: 'AP-PHYS2-OPT',
    },
  ],
  prerequisites: ['phys.waves'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor with the bent-pencil-in-water trick.',
      script: 'Stick a pencil in a glass of water — it looks broken at the surface. The pencil is fine; LIGHT bent. That bending is REFRACTION, governed by Snell\'s law. Lenses, glasses, microscopes, your eyes — all use refraction.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-laws',
      kind: 'concept',
      goal: 'Snell\'s law + thin lens equation + sign conventions.',
      keyIdeas: [
        'INDEX OF REFRACTION n = c/v. Speed of light in the medium relative to vacuum. n = 1 (vacuum), 1.33 (water), 1.5 (glass), 2.4 (diamond).',
        'SNELL\'S LAW: n₁ sin θ₁ = n₂ sin θ₂. Angles measured from NORMAL (perpendicular to surface).',
        'Light bends TOWARD the normal entering a denser medium (n bigger). Bends AWAY entering less dense.',
        'TOTAL INTERNAL REFLECTION: above the critical angle, light reflects entirely. Critical angle: sin θ_c = n₂/n₁ (where n₁ > n₂). Basis of fiber optics.',
        'THIN LENS / MIRROR EQUATION: 1/f = 1/d_o + 1/d_i. f = focal length, d_o = object distance, d_i = image distance.',
        'MAGNIFICATION: M = -d_i/d_o = h_i/h_o.',
        'SIGN CONVENTION: f > 0 for converging lens / concave mirror. f < 0 for diverging lens / convex mirror. d_i > 0 for real image (same side as incoming light for mirrors / opposite side for lenses).',
        'REAL image: light actually converges there (can project on a screen). VIRTUAL: light only APPEARS to come from there (image is on the same side as the object, not projectable).',
      ],
      vocabulary: [
        { term: 'refraction', definition: 'bending of light passing between media of different optical density.' },
        { term: 'focal length', definition: 'distance from a lens or mirror to its focal point.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-snell',
      kind: 'worked_example',
      problem: 'Light hits water at 30° from normal in air (n=1) and enters water (n=1.33). Find the angle in water.',
      steps: [
        'Snell: n₁ sin θ₁ = n₂ sin θ₂.',
        '(1) sin 30° = (1.33) sin θ₂.',
        '0.5 = 1.33 sin θ₂.',
        'sin θ₂ = 0.376 → θ₂ ≈ 22°.',
        'Light bent TOWARD the normal — entering a denser medium, as expected.',
      ],
      answer: '22°',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-lens',
      kind: 'worked_example',
      problem: 'A converging lens has focal length 10 cm. An object is 30 cm in front of it. Find the image distance.',
      steps: [
        '1/f = 1/d_o + 1/d_i.',
        '1/10 = 1/30 + 1/d_i.',
        '1/d_i = 1/10 − 1/30 = 3/30 − 1/30 = 2/30 = 1/15.',
        'd_i = 15 cm. Positive → REAL image, on the opposite side of the lens.',
        'Magnification: M = -d_i/d_o = -15/30 = -0.5. Half size, INVERTED (negative).',
      ],
      answer: 'd_i = 15 cm; M = -0.5 (inverted, half size)',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A converging lens has f = 5 cm. An object is placed exactly at the focal point. Where is the image?',
      expectedAnswer: 'at infinity (no image; rays are parallel)',
      responseFormat: 'free',
      hints: [
        '1/f = 1/d_o + 1/d_i with d_o = f.',
        '1/d_i = 0 → d_i = infinity.',
        'Rays leave parallel; no convergence to a finite image.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-magnification-positive',
      kind: 'misconception_check',
      question: 'In M = -d_i/d_o, what does a NEGATIVE magnification mean?',
      commonErrors: [
        {
          answer: 'shrunken',
          misconception: 'Confusing sign with size.',
          correctsTo: 'Negative M means INVERTED (upside down). Size is given by |M|. Negative + magnitude < 1 = smaller AND inverted. Common situation for cameras and your eye\'s retina.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Snell: n₁ sin θ₁ = n₂ sin θ₂. Toward normal entering denser medium.',
        'Critical angle: total internal reflection (fiber optics).',
        'Thin lens: 1/f = 1/d_o + 1/d_i.',
        'Magnification: M = -d_i/d_o.',
        'Negative M = inverted; |M| < 1 = smaller.',
        'Positive d_i = real image; negative = virtual.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does an OPTICAL FIBER carry light through bends without losing it?',
      hint: 'Total internal reflection — light hits the fiber walls at angles ABOVE critical, so 100% reflects back inside. As long as bends aren\'t too sharp, the light keeps reflecting and propagating along the fiber. Foundation of internet backbone.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
