/**
 * JEE Main Physics — Properties of Solids and Liquids.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_PHYS_SOLID_LIQUID_PROPERTIES: LessonPlan = {
  id: 'evelyn.jee.phys.solid-liquid-properties.v1',
  title: 'JEE Physics — Solid & Liquid Properties',
  curriculum: 'NCERT',
  grade: '11',
  subject: 'sci',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.phys.solid-liquid-properties',
      description: 'Apply elasticity (stress, strain, Young\'s modulus), surface tension, viscosity, and thermal expansion concepts.',
      standard: 'JEE-MAIN-PHY-SLP',
    },
  ],
  prerequisites: ['jee.phys.laws-motion'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Properties of matter is JEE\'s catch-all for elasticity + surface phenomena + thermal expansion — small but reliable.',
      script: 'A wire stretches by some amount when loaded. A water droplet forms because of surface tension. Honey flows slower than water because of viscosity. Each phenomenon has its own simple formula. Today we round them up.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-properties',
      kind: 'concept',
      goal: 'Elasticity + surface tension + viscosity + thermal expansion.',
      keyIdeas: [
        'STRESS: force per unit area. Tensile, compressive, or shear. SI: pascal (Pa).',
        'STRAIN: dimensionless ratio. Tensile strain = ΔL/L₀.',
        'YOUNG\'S MODULUS Y: stress/strain (tensile). Y = (F/A)/(ΔL/L₀) = F·L₀/(A·ΔL).',
        'BULK MODULUS K: relates pressure change to volume strain. K = −P/(ΔV/V).',
        'SHEAR MODULUS G: relates shear stress to shear strain.',
        'POISSON\'S RATIO: ratio of lateral strain to longitudinal strain. Typically 0.2–0.5.',
        'SURFACE TENSION T: force per unit length along surface (N/m). Excess pressure inside droplet: ΔP = 2T/r (drop). Inside soap bubble (two surfaces): ΔP = 4T/r.',
        'CAPILLARY RISE: h = 2T·cos θ / (ρgr). Higher for narrower tubes; depends on contact angle θ.',
        'VISCOSITY η: F = η·A·(dv/dx) for laminar flow. SI: Pa·s.',
        'STOKES\' LAW: drag on a sphere F = 6πηrv. Used in terminal velocity problems.',
        'THERMAL EXPANSION: linear ΔL = α·L₀·ΔT. Volume ΔV = γ·V₀·ΔT, with γ ≈ 3α for isotropic solids.',
      ],
      vocabulary: [
        { term: 'Young\'s modulus', definition: 'a measure of stiffness: Y = stress/strain for tensile deformation.' },
        { term: 'surface tension', definition: 'force per unit length that minimises a liquid\'s surface area; SI N/m.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-young',
      kind: 'worked_example',
      problem: 'A 2 m steel wire (Y = 2 × 10¹¹ Pa, cross-sectional area 1 mm²) supports a 100 N load. Find the elongation.',
      steps: [
        'Y = F·L₀/(A·ΔL) → ΔL = F·L₀/(A·Y).',
        'A = 1 mm² = 1 × 10⁻⁶ m².',
        'ΔL = (100 · 2) / (1e−6 · 2e11) = 200 / 2e5 = 1e−3 m = 1 mm.',
      ],
      answer: 'ΔL = 1 mm',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Find the excess pressure inside a soap bubble of radius 2 mm. T = 0.025 N/m.',
      expectedAnswer: '50 Pa',
      responseFormat: 'numeric',
      hints: [
        'Soap bubble: ΔP = 4T/r.',
        '4·0.025/0.002 = 0.1/0.002 = 50.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-droplet-bubble',
      kind: 'misconception_check',
      question: 'A student computes excess pressure inside a soap bubble using ΔP = 2T/r. What\'s wrong?',
      commonErrors: [
        {
          answer: 'ΔP = 2T/r for soap bubble',
          misconception: 'Treating a soap bubble like a liquid drop, ignoring the second air-liquid surface.',
          correctsTo: 'A soap bubble has TWO surfaces (inside + outside), so the surface tension acts twice. ΔP = 4T/r. A LIQUID DROP has only one surface (liquid-air); ΔP = 2T/r. Always count surfaces. For an air bubble underwater (only one surface), ΔP = 2T/r as well.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Young\'s modulus Y = F·L₀/(A·ΔL).',
        'Drop excess pressure: 2T/r. Soap bubble: 4T/r.',
        'Capillary rise h = 2T·cos θ / (ρgr).',
        'Viscosity: F = ηA·dv/dx. Stokes drag: F = 6πηrv.',
        'Thermal: ΔL = αL·ΔT. Volume ΔV = γV·ΔT (γ ≈ 3α).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Two soap bubbles of radii 1 cm and 2 cm are connected by a tube. What happens?',
      hint: 'Smaller bubble has higher excess pressure (4T/r is larger for smaller r). Air flows from SMALLER to LARGER. The smaller bubble shrinks, the larger grows. Counter-intuitive but correct.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
