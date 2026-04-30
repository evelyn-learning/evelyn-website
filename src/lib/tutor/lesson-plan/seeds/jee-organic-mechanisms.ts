/**
 * JEE — Organic Reaction Mechanisms.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_ORGANIC_MECHANISMS: LessonPlan = {
  id: 'evelyn.jee.organic-mechanisms.v1',
  title: 'JEE Organic Reaction Mechanisms',
  curriculum: 'NCERT',
  grade: '11',
  subject: 'sci',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'jee.organic-mechanisms',
      description: 'Apply mechanism-based reasoning to organic chemistry problems: electrophiles vs nucleophiles, SN1/SN2/E1/E2, electrophilic addition + substitution, intermediates.',
      standard: 'JEE-CHEM-ORG',
    },
  ],
  prerequisites: ['jee.chemistry-strategy'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Mechanism mastery beats memorization in organic.',
      script: 'Most students try to memorize 200 organic reactions. Top JEE rankers learn 5-7 fundamental MECHANISMS and PREDICT products from there. Once you internalize SN1, SN2, E1, E2, electrophilic addition (to alkenes), and electrophilic substitution (on aromatics), almost every JEE organic question becomes solvable — even ones you\'ve never seen.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-mechanisms',
      kind: 'concept',
      goal: 'Six fundamental mechanisms + recognition cues.',
      keyIdeas: [
        'NUCLEOPHILE = electron-rich, attacks electron-poor center. ELECTROPHILE = electron-poor, attacked by electron-rich. Most organic reactions: nucleophile attacks electrophile.',
        'SN2: nucleophile attacks back-side, leaving group leaves simultaneously. ONE STEP. INVERSION of stereochemistry (Walden inversion). Favored: primary substrate, strong nucleophile, polar aprotic solvent.',
        'SN1: leaving group leaves first → carbocation → nucleophile attacks. TWO STEPS. RACEMIZATION (planar intermediate). Favored: tertiary substrate, weak nucleophile, polar protic solvent.',
        'E2: base removes β-H, leaving group leaves, double bond forms. ONE STEP. Anti-periplanar geometry required. Strong base, primary or secondary substrate.',
        'E1: leaving group leaves → carbocation → β-H removed by weak base. TWO STEPS. Same conditions favoring SN1 also favor E1 (compete).',
        'ELECTROPHILIC ADDITION (to alkenes): π electrons of alkene attack electrophile (e.g., H+ from HBr). Carbocation forms. Nucleophile (Br−) attacks carbocation. Markovnikov: H goes to C with MORE H\'s (gives more stable carbocation).',
        'ELECTROPHILIC AROMATIC SUBSTITUTION: aromatic ring attacks electrophile (e.g., NO2+, R+, etc.) → arenium ion intermediate → loses H+ to restore aromaticity. Substituent effects: ACTIVATING o/p-directors (OH, NH2, alkyl), DEACTIVATING m-directors (NO2, COOH), DEACTIVATING o/p-directors (halogens).',
        'CARBOCATION STABILITY: 3° > 2° > 1° > methyl. Stabilized by hyperconjugation, alkyl groups, allyl/benzyl resonance.',
        'PREDICTING REGIOSELECTIVITY: Markovnikov for HX. Anti-Markovnikov with peroxides (free-radical mechanism).',
        'PREDICTING STEREOCHEMISTRY: SN2 inversion. SN1 racemization. Anti addition (Br2, halohydrin formation). Syn addition (OsO4, H2/cat).',
      ],
      vocabulary: [
        { term: 'nucleophile', definition: 'electron-rich species that donates a pair to form a bond.' },
        { term: 'electrophile', definition: 'electron-poor species that accepts a pair from a nucleophile.' },
        { term: 'carbocation', definition: 'a positively charged carbon center; key intermediate in many reactions.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sn1-vs-sn2',
      kind: 'worked_example',
      problem: 'tert-Butyl bromide is heated in water. Which mechanism dominates and what is the product?',
      steps: [
        'SUBSTRATE: tert-butyl bromide (C(CH₃)₃Br). The carbon bearing Br is TERTIARY.',
        'TERTIARY substrate strongly favors SN1 over SN2 (steric hindrance blocks back-side attack).',
        'NUCLEOPHILE: water (weak nucleophile). Favors SN1.',
        'SOLVENT: water (polar protic). Stabilizes carbocation. Favors SN1.',
        'MECHANISM: SN1.',
        'STEP 1: Br⁻ leaves → tert-butyl cation (3°, stable).',
        'STEP 2: water attacks the carbocation (or any face — racemization, but the substrate has no stereocenter so it doesn\'t matter here).',
        'STEP 3: deprotonation of the protonated alcohol → tert-butyl alcohol.',
        'PRODUCT: tert-butyl alcohol (CH₃)₃C-OH.',
      ],
      answer: 'SN1 mechanism. Product: tert-butyl alcohol.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'When propene (CH₃-CH=CH₂) reacts with HBr, what is the major product per Markovnikov\'s rule?',
      expectedAnswer: '2-bromopropane (CH₃-CHBr-CH₃)',
      responseFormat: 'free',
      hints: [
        'H goes to the carbon with MORE H\'s.',
        'CH₃-CH=CH₂: left carbon has 1 H, right (terminal) has 2 H\'s. H goes to right.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-anti-markovnikov',
      kind: 'misconception_check',
      question: 'Does HBr always add to alkenes by Markovnikov\'s rule?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating Markovnikov as universal.',
          correctsTo: 'No. With PEROXIDES (e.g., ROOR), the mechanism switches to FREE RADICAL — generates Br radical, adds to give the LESS-substituted radical (more stable for primary). Result: anti-Markovnikov product (CH₃-CH₂-CH₂Br instead of CH₃-CHBr-CH₃ for propene + HBr/peroxide). Note: this peroxide effect ONLY works with HBr — not HCl or HI. The exam loves to test this exception.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Six fundamental mechanisms: SN1, SN2, E1, E2, electrophilic addition, electrophilic aromatic substitution.',
        'SN2: 1°, strong nu, polar aprotic, INVERSION. SN1: 3°, weak nu, polar protic, RACEMIZATION.',
        'E2: anti-periplanar, strong base. E1: same conditions as SN1 (compete).',
        'Markovnikov for HX. Anti-Markovnikov with peroxides for HBr only.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the same set of conditions sometimes give a mixture of SN1 and E1 products?',
      hint: 'Both go through the same carbocation intermediate. Whether nucleophile (water) attacks (gives SN1 product) or β-H is removed by weak base (gives E1 product) depends on temperature, base strength, sterics. Higher temperature favors elimination (E1 over SN1). The exam loves to ask "ratio of substitution to elimination products" — there\'s no single answer, but trends are predictable.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
