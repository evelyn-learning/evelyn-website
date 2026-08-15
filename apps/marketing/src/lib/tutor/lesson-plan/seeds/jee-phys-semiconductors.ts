/**
 * JEE Main Physics — Semiconductor Electronics.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_PHYS_SEMICONDUCTORS: LessonPlan = {
  id: 'evelyn.jee.phys.semiconductors.v1',
  title: 'JEE Physics — Semiconductor Electronics',
  curriculum: 'NCERT',
  grade: '12',
  subject: 'sci',
  topic: 'jee-physics',
  locale: 'en',
  los: [
    {
      id: 'jee.phys.semiconductors',
      description: 'Apply concepts of band theory, p-n junction, diode characteristics, and basic logic gates.',
      standard: 'JEE-MAIN-PHY-SEMI',
    },
  ],
  prerequisites: ['jee.phys.current-electricity'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Semiconductor questions on JEE Main are formula-light but concept-heavy — band gaps, doping, biasing.',
      script: 'A diode is just a one-way valve for current. Forward biased: it conducts. Reverse biased: it blocks. Why? Because of the depletion region at a p-n junction. Today we cement the picture and the JEE-Main exam questions follow.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-semi',
      kind: 'concept',
      goal: 'Bands + intrinsic/extrinsic + p-n + biasing + logic gates.',
      keyIdeas: [
        'BAND THEORY: solids have valence band (filled at 0 K) and conduction band (empty). Gap E_g between them.',
        'CONDUCTOR: bands overlap or partially filled (no gap effectively). E_g ≈ 0.',
        'SEMICONDUCTOR: small gap (~1 eV). At room T some electrons jump → conducts modestly. Si: 1.1 eV, Ge: 0.7 eV.',
        'INSULATOR: large gap (>3 eV). Electrons can\'t cross → no conduction.',
        'INTRINSIC SEMICONDUCTOR: pure (no doping). Electron-hole pairs created thermally. n_e = n_h.',
        'EXTRINSIC = doped: n-type (donor impurities, e.g. P or As in Si: extra electron). p-type (acceptor impurities, e.g. B: missing electron creates hole).',
        'P-N JUNCTION: depletion region forms at boundary. Built-in potential ≈ 0.7 V (Si) or 0.3 V (Ge).',
        'FORWARD BIAS (p positive, n negative): depletion shrinks; current flows for V > 0.7 V.',
        'REVERSE BIAS: depletion widens; tiny saturation current; breakdown at high reverse V (Zener / avalanche).',
        'DIODE I-V: nonlinear. Often modelled as ideal switch + 0.7 V drop.',
        'LOGIC GATES (Boolean): AND, OR, NOT, NAND, NOR, XOR. Truth-table verification is standard JEE Main practice.',
      ],
      vocabulary: [
        { term: 'band gap', definition: 'energy gap E_g between valence and conduction bands; determines conductor/semi/insulator.' },
        { term: 'depletion region', definition: 'a region near a p-n junction depleted of mobile charge carriers; supports built-in voltage.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-bias',
      kind: 'worked_example',
      problem: 'A silicon diode is connected with 5 V battery in series with 1 kΩ resistor. (a) If forward biased, find the current. (b) If reverse biased, find the current.',
      steps: [
        '(a) Forward: 5 V battery drives current through diode (drop ≈ 0.7 V) and resistor.',
        'Voltage across resistor = 5 − 0.7 = 4.3 V.',
        'Current I = 4.3/1000 = 4.3 mA.',
        '(b) Reverse: diode blocks current; only tiny saturation current flows (~nA). For JEE Main, take I ≈ 0.',
      ],
      answer: '(a) 4.3 mA forward; (b) ≈ 0 reverse',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A NAND gate has both inputs at 1 (HIGH). What is the output?',
      expectedAnswer: '0 (LOW)',
      responseFormat: 'free',
      hints: [
        'NAND = NOT(AND).',
        'AND of (1, 1) = 1; NOT(1) = 0.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-doping-conductor',
      kind: 'misconception_check',
      question: 'A student says "doping a semiconductor with arsenic adds extra positive charges, so the material becomes positively charged." Correct?',
      commonErrors: [
        {
          answer: 'Doped n-type material is positively charged',
          misconception: 'Confusing carrier type with net charge.',
          correctsTo: 'Doping with As (Group 15) gives Si extra ELECTRONS (n-type means majority carriers are electrons). The As atoms are NEUTRAL — they have 5 valence electrons of which 4 bond to Si and 1 is free. The crystal as a whole REMAINS NEUTRAL after doping (every donor atom is balanced by its electron). What changes is the type and density of MOBILE CARRIERS, not the net charge.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Insulator (E_g large) > Semi (E_g ≈ 1 eV) > Conductor (no gap).',
        'n-type: donor atoms add electrons. p-type: acceptors create holes.',
        'P-N junction: depletion region with built-in voltage (~0.7 V for Si).',
        'Forward bias V > 0.7 V → conducts. Reverse → blocks.',
        'Logic gates: NAND/NOR are universal.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A photon of wavelength 1100 nm is incident on Si (E_g = 1.1 eV). Will it be absorbed (creating an electron-hole pair)?',
      hint: 'Photon energy E = 1240/1100 = 1.127 eV. Just above E_g = 1.1 eV → can be absorbed. Photons with λ > 1127 nm (E < 1.1 eV) cannot excite electrons across the gap and pass through Si without absorption — Si is transparent to far-IR.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
