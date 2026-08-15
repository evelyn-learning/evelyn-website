/**
 * Grades 11-12 Science — Astronomy.
 *
 * Anchor plan covering stellar lifecycles, distance scales,
 * cosmological observations, and how we know what we know.
 */

import type { LessonPlan } from '../types';

export const SEED_G1112_SCI_ASTRONOMY: LessonPlan = {
  id: 'evelyn.g1112.science.astronomy.v1',
  title: 'Grades 11-12 Science — Astronomy',
  curriculum: 'NGSS',
  grade: '11',
  subject: 'science',
  topic: 'astronomy',
  locale: 'en',
  los: [
    {
      id: 'g1112.science.astronomy',
      description: 'Explain stellar lifecycles, the cosmic distance ladder, and the observational evidence behind the standard cosmological model.',
      standard: 'NGSS-HS-ESS1',
    },
  ],
  prerequisites: ['g35.science.simple-machines'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Astronomy answers "how do we know?" in cases where we can never visit, never sample, never directly measure.',
      script: 'You can\'t pick up a star. You can\'t put a galaxy on a scale. So how do astronomers know stars\' temperatures, masses, and ages? How do we know the universe is expanding? Today we cover the inferential chain — the cosmic distance ladder, stellar spectra, and the observations that build the modern picture from photons that traveled billions of years to reach our telescopes.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-astronomy',
      kind: 'concept',
      goal: 'Stellar lifecycles, distance ladder, spectra, expansion, big bang evidence.',
      keyIdeas: [
        'STARS form when gravity collapses cold gas clouds. Density and temperature rise until hydrogen fusion ignites in the core. The star joins the MAIN SEQUENCE.',
        'Main-sequence stars balance gravity (pulling in) against radiation pressure (pushing out) — HYDROSTATIC EQUILIBRIUM. Mass determines everything: bigger ⟹ hotter, bluer, shorter-lived.',
        'STELLAR LIFECYCLE depends on mass. Sun-like (0.5-8 M☉): main sequence → red giant → planetary nebula → white dwarf. Massive (>8 M☉): main sequence → red supergiant → supernova → neutron star or black hole.',
        'COSMIC DISTANCE LADDER (each rung calibrates the next):',
        '  1) PARALLAX: nearby stars wobble against background as Earth orbits. Direct distance from geometry. Good to ~10,000 light-years.',
        '  2) STANDARD CANDLES: Cepheid variable stars pulsate at a rate determined by their absolute brightness. Measure pulsation → know absolute brightness → compare apparent brightness → distance. Good to nearby galaxies.',
        '  3) TYPE Ia SUPERNOVAE: explosions of white dwarfs at a fixed mass — same intrinsic brightness every time. Visible across the universe.',
        '  4) HUBBLE\'S LAW: redshift ∝ distance. Use redshift to estimate distance for the most remote galaxies.',
        'SPECTRA reveal everything. Each element has a unique fingerprint of absorption/emission lines. Star spectrum tells you composition, temperature (from line strengths and continuum shape), motion (Doppler shift), and pressure (line widths).',
        'BIG BANG evidence: (1) Hubble expansion (galaxies receding faster the further they are), (2) cosmic microwave background — the leftover radiation from the early hot universe, (3) primordial light-element abundances (H, He, Li ratios match Big Bang nucleosynthesis predictions).',
        'AGE of universe ≈ 13.8 billion years, derived from CMB precision measurements + expansion rate.',
      ],
      vocabulary: [
        { term: 'parallax', definition: 'the apparent shift in a nearby star\'s position against background stars as Earth orbits the Sun; gives geometric distance for nearby stars.' },
        { term: 'standard candle', definition: 'an astronomical object whose intrinsic brightness is known, allowing distance calculation from observed brightness (e.g. Cepheids, Type Ia supernovae).' },
        { term: 'redshift', definition: 'lengthening of light\'s wavelength due to the source moving away (Doppler) or the universe expanding (cosmological); measures recession velocity.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-distance',
      kind: 'worked_example',
      problem: 'A Cepheid variable in another galaxy pulsates with a 30-day period. Period-luminosity relation tells us its absolute magnitude is M = -5.0. Observed apparent magnitude is m = +20.0. How far away is it?',
      steps: [
        'Use the distance modulus: m − M = 5 log₁₀(d) − 5, where d is in parsecs.',
        'Substitute: 20.0 − (−5.0) = 25.0 = 5 log₁₀(d) − 5.',
        '30 = 5 log₁₀(d).',
        'log₁₀(d) = 6.',
        'd = 10⁶ parsecs = 1 megaparsec ≈ 3.26 million light-years.',
        'Reality check: nearby galaxy distances. Andromeda is about 0.78 Mpc, so 1 Mpc is "nearby galaxy" range. Plausible.',
      ],
      answer: '1 Mpc ≈ 3.26 million light-years',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is a star\'s mass the single most important property determining its lifecycle?',
      expectedAnswer: 'Higher mass means stronger gravity, so a higher core temperature is needed to balance it via radiation pressure. Higher core T accelerates fusion: massive stars burn through hydrogen MUCH faster (millions of years) compared to low-mass stars (billions to trillions of years). Higher mass also enables fusion of heavier elements after hydrogen runs out — and determines whether the endpoint is a white dwarf (low mass), neutron star (medium high), or black hole (very high). One parameter (mass) sets temperature, lifespan, available fusion stages, and final remnant.',
      responseFormat: 'free',
      hints: [
        'Why does mass set the core temperature?',
        'How does higher core temperature affect fusion rate?',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-bigbang',
      kind: 'misconception_check',
      question: 'A student imagines the Big Bang as an explosion in a pre-existing space, with galaxies flying outward like shrapnel. What\'s wrong with that picture?',
      commonErrors: [
        {
          answer: 'Galaxies flew outward from a central explosion',
          misconception: 'Picturing the Big Bang as a localised explosion in a pre-existing space.',
          correctsTo: 'The Big Bang was an expansion of SPACE ITSELF, not an explosion within space. There was no centre because the entire universe was uniformly compressed. As space expanded, distances between galaxies grew — but no galaxy moved through space; rather, space between galaxies stretched. Hubble\'s law (more distant galaxies recede faster) is exactly what you expect from this picture: every observer in every galaxy sees the same recession pattern around them. There is no preferred "centre" because the expansion is not from a point.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Stars form by gravitational collapse; main sequence balances gravity vs radiation pressure.',
        'Mass determines lifetime, fusion stages, and final remnant.',
        'Distance ladder: parallax → Cepheids → Type Ia supernovae → Hubble redshift.',
        'Spectra reveal composition, temperature, motion, pressure.',
        'Big Bang evidence: Hubble expansion, CMB, primordial abundances.',
        'Big Bang = expansion of space, not explosion in space.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
