/**
 * AP Physics 2 — Geometric and Wave Optics.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_PHYSICS_2_OPTICS: LessonPlan = {
  id: 'evelyn.ap.physics-2.optics.v1',
  title: 'AP Physics 2 — Optics: Reflection, Refraction, Lenses, and Interference',
  curriculum: 'AP',
  grade: '11',
  subject: 'science',
  topic: 'ap-physics-2',
  locale: 'en',
  los: [
    {
      id: 'ap.physics-2.optics',
      description: 'Apply Snell\'s law, the thin-lens / thin-mirror equation, and double-slit interference formulas to solve optics problems.',
      standard: 'AP-PHYS-2-UNIT-7',
    },
  ],
  prerequisites: ['ap.physics-2.thermo'],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Light bends, reflects, and creates interference patterns — and a few key formulas handle all of it.',
      script: 'A pencil in a glass of water looks "broken." A camera lens flips an image. Two slits of light produce stripes on a screen. All these phenomena come from the same wave-and-ray rules. Today: the workhorse formulas.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-optics',
      kind: 'concept',
      goal: 'Reflection, refraction (Snell), thin-lens equation, magnification, interference.',
      keyIdeas: [
        'REFLECTION: angle of incidence = angle of reflection (measured from normal). Mirrors and shiny surfaces.',
        'REFRACTION: light bends when entering a different medium. Snell\'s law: n₁ sin θ₁ = n₂ sin θ₂.',
        '  n = index of refraction (n_air ≈ 1, n_water ≈ 1.33, n_glass ≈ 1.5).',
        '  Light slows down + bends TOWARD normal in denser medium (higher n).',
        'TOTAL INTERNAL REFLECTION: when going from dense to less-dense, at angles beyond a critical angle, all light reflects. Critical angle θ_c = arcsin(n₂/n₁). Used in fiber optics.',
        'THIN-LENS / THIN-MIRROR EQUATION: 1/f = 1/s_o + 1/s_i.',
        '  f = focal length (positive for converging lens / concave mirror).',
        '  s_o = object distance (always positive in standard convention).',
        '  s_i = image distance (positive for real image, negative for virtual).',
        'MAGNIFICATION: m = -s_i/s_o = h_i/h_o.',
        '  m > 0: upright. m < 0: inverted. |m| > 1: enlarged.',
        'CONVERGING (convex) LENSES: form real, inverted images when object is beyond f. Virtual upright when within f (magnifying glass).',
        'DIVERGING (concave) LENSES: always form virtual, upright, smaller images.',
        'YOUNG\'S DOUBLE SLIT (interference): bright fringes at d sin θ = mλ. Dark at d sin θ = (m + 1/2)λ.',
        '  d = slit separation, m = integer (order), λ = wavelength.',
        '  On a distant screen, bright fringe spacing y = mλL/d, where L is screen distance.',
        'DIFFRACTION: light spreads through openings. Single slit: dark at a sin θ = mλ.',
        'COLOR depends on wavelength: red ~700 nm, blue ~450 nm. Higher frequency = higher energy.',
      ],
      vocabulary: [
        { term: 'index of refraction', definition: 'n = c/v, the ratio of light\'s speed in vacuum to its speed in a medium; determines how much light bends.' },
        { term: 'total internal reflection', definition: 'all-reflection condition when light tries to exit a dense medium at too shallow an angle; basis for fiber optics.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'A converging lens has focal length 10 cm. An object is placed 30 cm in front. Find the image distance and magnification.',
      steps: [
        '1/f = 1/s_o + 1/s_i.',
        '1/10 = 1/30 + 1/s_i.',
        '1/s_i = 1/10 − 1/30 = 3/30 − 1/30 = 2/30.',
        's_i = 30/2 = 15 cm.',
        'm = -s_i/s_o = -15/30 = -0.5.',
        'Image: 15 cm on the OTHER side of the lens (real, since s_i > 0).',
        '|m| = 0.5 < 1: image is HALF the size. Negative: INVERTED.',
      ],
      answer: 's_i = 15 cm, m = -0.5 (real, inverted, half-size)',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In a double-slit experiment with d = 0.1 mm and λ = 600 nm, what is the angle to the first-order bright fringe?',
      expectedAnswer: 'd sin θ = mλ. m = 1, λ = 600 × 10⁻⁹ m, d = 0.1 × 10⁻³ m = 10⁻⁴ m. sin θ = (1)(600 × 10⁻⁹) / 10⁻⁴ = 6 × 10⁻³. θ ≈ 0.34° (≈ 6 mrad). For small angles: y/L ≈ sin θ ≈ 6 mm per metre of screen distance.',
      responseFormat: 'free',
      hints: [
        'Use d sin θ = mλ.',
        'Be careful with units (mm and nm to metres).',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-virtual-image',
      kind: 'misconception_check',
      question: 'A student thinks a "virtual image" doesn\'t exist physically — like the lens didn\'t work. What is a virtual image actually?',
      commonErrors: [
        {
          answer: 'Virtual image = no image',
          misconception: 'Treating "virtual" as "fake" or "non-existent."',
          correctsTo: 'A VIRTUAL image is a real, observable image — you can see it. The "virtual" means light rays don\'t actually converge there; instead, they appear to diverge FROM that point. Examples: the upright magnified image you see in a magnifying glass, your reflection in a flat mirror — both virtual. You can\'t project a virtual image onto a screen (no actual rays reach the image location), but you can see it with your eye. Real images converge actual rays; virtual images appear to.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Snell: n₁sinθ₁ = n₂sinθ₂. Light bends toward normal entering denser medium.',
        'Lens: 1/f = 1/s_o + 1/s_i. Magnification m = -s_i/s_o.',
        'Real image (s_i > 0): can project on screen, inverted.',
        'Virtual image (s_i < 0): appears to be there; visible but not projectable.',
        'Double-slit: d sinθ = mλ for bright fringes.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
