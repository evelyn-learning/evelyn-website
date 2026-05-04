/**
 * JEE Main Physics — EM Waves & Optics.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_PHYS_EM_WAVES_OPTICS: LessonPlan = {
  id: 'evelyn.jee.phys.em-waves-optics.v1',
  title: 'JEE Physics — EM Waves & Optics',
  curriculum: 'NCERT',
  grade: '12',
  subject: 'sci',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.phys.em-waves-optics',
      description: 'Apply ray optics (mirrors, lenses, refraction), wave optics (interference, diffraction), and EM-wave properties.',
      standard: 'JEE-MAIN-PHY-OPT',
    },
  ],
  prerequisites: ['jee.phys.em-induction'],
  followUps: ['jee.phys.atoms-nuclei'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Optics is a JEE perennial — half a question per year on lenses, half on Young\'s double slit.',
      script: 'Mirror formula. Lens formula. Snell\'s law. Young\'s double-slit fringe spacing. Memorise four formulas and you cover most of JEE optics. Today we lock them in plus the sign convention that catches half of all lens errors.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-optics',
      kind: 'concept',
      goal: 'Ray optics + wave optics + EM-wave essentials.',
      keyIdeas: [
        'EM WAVE: speed c = 1/√(μ₀ε₀) = 3 × 10⁸ m/s. E and B perpendicular to each other and to direction of propagation.',
        'INTENSITY: I = (1/2)·ε₀·c·E₀² (energy flux of EM wave).',
        'MIRROR FORMULA: 1/v + 1/u = 1/f. Sign convention: distances measured from mirror; toward incoming light positive (varies by textbook — JEE uses Cartesian: distances from pole, light travels +x).',
        'LENS FORMULA: 1/v − 1/u = 1/f. Convex lens f > 0; concave lens f < 0.',
        'MAGNIFICATION: m = h\'/h = v/u (mirror) or m = v/u (lens). Negative m → inverted image.',
        'REFRACTION (Snell): n₁ sin θ₁ = n₂ sin θ₂. Light bends toward normal entering denser medium.',
        'CRITICAL ANGLE for total internal reflection: sin θ_c = n_rare/n_dense.',
        'YOUNG\'S DOUBLE-SLIT: fringe spacing β = λD/d, where D = slit-to-screen distance, d = slit separation.',
        'PATH DIFFERENCE for nth maximum: nλ. For nth minimum: (n + 1/2)λ.',
        'SINGLE-SLIT DIFFRACTION: width of central maximum = 2λD/a.',
        'JEE TRAP: real images form on the SAME side as the screen; virtual images on the same side as the object. v sign tells you which.',
      ],
      vocabulary: [
        { term: 'critical angle', definition: 'angle of incidence above which total internal reflection occurs at a denser-rarer interface.' },
        { term: 'fringe spacing', definition: 'distance between adjacent bright (or adjacent dark) fringes in a double-slit pattern.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-lens',
      kind: 'worked_example',
      problem: 'An object is placed 30 cm in front of a convex lens of focal length 20 cm. Find the image distance and magnification.',
      steps: [
        'Sign convention (Cartesian): u = −30 cm (object on left). f = +20 cm.',
        'Lens formula: 1/v − 1/u = 1/f → 1/v − 1/(−30) = 1/20 → 1/v + 1/30 = 1/20.',
        '1/v = 1/20 − 1/30 = 3/60 − 2/60 = 1/60 → v = 60 cm.',
        'Positive v → real image on the right of lens.',
        'Magnification m = v/u = 60/(−30) = −2. Negative → inverted; magnitude 2 → twice as tall.',
      ],
      answer: 'v = 60 cm; m = −2',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In Young\'s experiment, slits are 0.5 mm apart and the screen is 1.5 m away. With light of 600 nm, find the fringe spacing.',
      expectedAnswer: '1.8 mm',
      responseFormat: 'numeric',
      hints: [
        'β = λD/d.',
        '(600e−9 × 1.5) / (0.5e−3) = 9e−7 / 5e−4 = 1.8e−3 m.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-tir',
      kind: 'misconception_check',
      question: 'A light ray travels from air (n = 1) to water (n = 1.33). A student says total internal reflection happens when the angle of incidence exceeds the critical angle for this interface. Correct?',
      commonErrors: [
        {
          answer: 'TIR happens entering water from air',
          misconception: 'Forgetting that TIR only occurs going from DENSER to RARER medium.',
          correctsTo: 'Total internal reflection requires light going from a HIGHER-index medium to a LOWER-index medium. Air (1) → water (1.33) is rare → dense; the refracted ray bends TOWARD normal, never reflects back. TIR is possible going water → air; critical angle there: sin θ_c = 1/1.33 ≈ 0.752 → θ_c ≈ 48.8°. Always check direction of travel before invoking TIR.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Lens: 1/v − 1/u = 1/f. Mirror: 1/v + 1/u = 1/f.',
        'Snell: n₁ sin θ₁ = n₂ sin θ₂.',
        'TIR only when going dense → rare. sin θ_c = n_rare/n_dense.',
        'Young\'s: β = λD/d.',
        'EM wave speed c = 3 × 10⁸ m/s.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Two thin lenses of focal lengths 20 cm and −10 cm are placed in contact. Find the equivalent focal length.',
      hint: 'Lenses in contact: 1/f_eq = 1/f₁ + 1/f₂ = 1/20 + 1/(−10) = 1/20 − 2/20 = −1/20 → f_eq = −20 cm. Effective lens is concave (diverging) because the negative lens dominates.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
