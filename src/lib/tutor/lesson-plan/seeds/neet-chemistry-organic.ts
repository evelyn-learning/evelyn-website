/**
 * NEET Chemistry — Organic Chemistry Overview.
 *
 * NCERT class 11+12 organic chapters. ~12-15 NEET chemistry questions
 * per sitting (about half of chemistry's 45 questions). Mechanism-driven
 * — pure memorization fails.
 */

import type { LessonPlan } from '../types';

export const SEED_NEET_CHEMISTRY_ORGANIC: LessonPlan = {
  id: 'evelyn.testprep.neet.chemistry.organic.v1',
  title: 'NEET Chemistry — Organic Chemistry Mechanisms and Patterns',
  curriculum: 'NTA',
  grade: 'medical-entrance',
  subject: 'test-prep',
  topic: 'neet-chemistry',
  locale: 'en',
  los: [
    {
      id: 'neet.chemistry.organic',
      description: 'Predict organic-reaction products using mechanism-based reasoning (SN1, SN2, E1, E2, electrophilic addition, electrophilic aromatic substitution) and recognize NEET-style questions on isomerism + named reactions.',
      standard: 'NEET-CHEM-ORG',
    },
  ],
  prerequisites: ['neet.format-2025'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Organic chemistry is half of NEET chemistry — and reasoning beats memorization.',
      script: 'Organic chemistry is about a third of NEET chemistry questions, but it\'s structurally the most predictable section. Once you internalize a few mechanisms (SN1/SN2/E1/E2 for substrates, electrophilic addition for alkenes, electrophilic aromatic substitution for benzene), you can predict products you\'ve never seen. Students who memorize 200 named reactions struggle. Students who reason from mechanisms breeze through.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-mechanisms',
      kind: 'concept',
      goal: 'Six fundamental mechanisms.',
      keyIdeas: [
        'SN2 (Substitution Nucleophilic Bimolecular): one-step concerted. Nucleophile attacks back-side as leaving group leaves. INVERSION of stereochemistry (Walden). Favored: 1° substrate, strong nucleophile, polar APROTIC solvent (DMSO, acetone).',
        'SN1 (Substitution Nucleophilic Unimolecular): two-step. Leaving group leaves → carbocation → nucleophile attacks. Planar carbocation → RACEMIZATION. Favored: 3° substrate, weak nucleophile, polar PROTIC solvent (water, alcohol).',
        'E2 (Elimination Bimolecular): one-step concerted. Base removes β-hydrogen, leaving group leaves, π bond forms. Anti-periplanar geometry required. Strong base needed.',
        'E1 (Elimination Unimolecular): two-step. Same conditions as SN1 → competition between SN1 and E1.',
        'CARBOCATION STABILITY: 3° > 2° > 1° > methyl. Stabilized by hyperconjugation, inductive donation from alkyl groups, resonance (allyl/benzyl).',
        'ELECTROPHILIC ADDITION TO ALKENES: π electrons attack electrophile (e.g., H+ from HBr) → carbocation → nucleophile (Br−) adds. MARKOVNIKOV: H to carbon with MORE H (gives more stable carbocation). With PEROXIDES + HBr only: free-radical, anti-Markovnikov.',
        'ELECTROPHILIC AROMATIC SUBSTITUTION (EAS): benzene π attacks electrophile → arenium ion → loses H+ to restore aromaticity. SUBSTITUENT EFFECTS: ACTIVATING o,p-directors (OH, NH₂, OR, alkyl), DEACTIVATING m-directors (NO₂, COOH, SO₃H, CHO), DEACTIVATING o,p-directors (halogens — small exception).',
        'KEY EAS REACTIONS: nitration (HNO₃ + H₂SO₄ → NO₂+), sulfonation (oleum), halogenation (Br₂/FeBr₃), Friedel-Crafts alkylation (RCl/AlCl₃), Friedel-Crafts acylation (RCOCl/AlCl₃).',
      ],
      vocabulary: [
        { term: 'nucleophile', definition: 'electron-rich species attacking electron-poor centers.' },
        { term: 'electrophile', definition: 'electron-poor species attacked by nucleophiles.' },
        { term: 'Markovnikov\'s rule', definition: 'in HX addition to alkenes, H adds to the carbon with more H (gives the more stable carbocation).' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'concept-isomerism',
      kind: 'concept',
      goal: 'Isomerism types — recurring NEET trap.',
      keyIdeas: [
        'STRUCTURAL ISOMERS: same molecular formula, different connectivity. Subtypes: chain (C5H12: pentane vs isopentane vs neopentane), position (1-propanol vs 2-propanol), functional (1-propanol vs methoxyethane), metamerism (different alkyl groups around same functional group).',
        'STEREOISOMERS: same connectivity, different 3D arrangement.',
        'GEOMETRIC (cis/trans, E/Z): around double bonds or rings. cis: same-side groups; trans: opposite sides. E/Z assigned by CIP priority rules.',
        'OPTICAL ISOMERS: chiral molecules (typically a carbon with 4 different groups) rotate plane-polarized light. R/S configuration by CIP rules. ENANTIOMERS: mirror images, non-superimposable. DIASTEREOMERS: stereoisomers that aren\'t mirror images. MESO: chiral centers but molecule has internal symmetry → optically inactive.',
        'TAUTOMERISM: structural isomers in equilibrium (keto-enol most common). Acetone ⇌ enol form (acetone is ~99.99% keto).',
        'NUMBER OF STEREOISOMERS: for n chiral centers, max 2^n unless meso compounds reduce the count.',
      ],
      vocabulary: [
        { term: 'enantiomer', definition: 'a non-superimposable mirror-image stereoisomer; rotates polarized light in the opposite direction.' },
        { term: 'tautomerism', definition: 'rapid interconversion between structural isomers, typically via H+ migration (e.g., keto ⇌ enol).' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-example',
      kind: 'worked_example',
      problem: 't-butyl bromide is heated in aqueous ethanol. Predict the major product and identify the mechanism.',
      steps: [
        'SUBSTRATE: t-butyl bromide ((CH₃)₃CBr) is TERTIARY → 3° favors SN1/E1, blocks SN2.',
        'NUCLEOPHILE: water and ethanol are both WEAK nucleophiles → SN1/E1.',
        'SOLVENT: aqueous ethanol is polar PROTIC → stabilizes carbocation → SN1/E1.',
        'MECHANISM: SN1.',
        'STEP 1: Br− leaves, forming the t-butyl cation (3°, stable).',
        'STEP 2: water attacks → protonated alcohol → loses H+ → t-butyl alcohol.',
        'COMPETING E1: weak base water can also remove a β-H, giving 2-methylpropene. At higher temperature, more E1; at lower, more SN1.',
        'MAJOR PRODUCT in moderate conditions: t-butyl alcohol (SN1).',
      ],
      answer: 't-butyl alcohol via SN1 mechanism.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'When propene (CH₃-CH=CH₂) reacts with HBr in the presence of peroxides (ROOR), what is the major product?',
      expectedAnswer: '1-bromopropane (CH₃-CH₂-CH₂Br) — anti-Markovnikov addition. Peroxides switch the mechanism to free-radical, and the bromine adds to the terminal carbon (giving the more stable secondary radical intermediate). Without peroxides, the product would be 2-bromopropane (Markovnikov).',
      responseFormat: 'free',
      hints: [
        'Peroxides + HBr = anti-Markovnikov ("peroxide effect").',
        'Br adds to the less-substituted carbon.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-aromatic-halogen',
      kind: 'misconception_check',
      question: 'On benzene, halogens (F, Cl, Br, I) are activating substituents that increase the rate of electrophilic aromatic substitution. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Confusing the directing effect with the activating effect.',
          correctsTo: 'False — but tricky. Halogens are DEACTIVATING (slower than benzene) but ORTHO/PARA-DIRECTING. They\'re the classic exception in EAS. Reason: their inductive effect (electron withdrawing through bonds) DEACTIVATES, but their resonance effect (lone-pair donation into ring) directs to o/p positions. Net: o/p-directing but slower than benzene. NEET loves this — it\'s in almost every recent paper.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Six mechanisms cover most organic: SN1, SN2, E1, E2, electrophilic addition, EAS.',
        'SN2 = 1°+strong nu, INVERSION. SN1 = 3°+weak nu, RACEMIZATION.',
        'Markovnikov for HX; anti-Markov with peroxides + HBr only.',
        'EAS substituent effects: -OH/-NH₂ activate (o,p), -NO₂/-COOH deactivate (m), halogens deactivate but direct o,p.',
        'Stereoisomers: enantiomers (mirror), diastereomers (not mirror), meso (chiral centers + internal symmetry).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does (R)-2-bromobutane racemize when heated in water + ethanol but inverts cleanly when reacted with sodium iodide in acetone?',
      hint: 'Heated in water + ethanol (polar protic, weak nucleophile, secondary substrate) → SN1 mechanism → planar carbocation → racemization. Sodium iodide in acetone (polar aprotic, strong nucleophile) → SN2 mechanism → back-side attack → inversion. Same substrate, different mechanism, different stereochemistry. The Finkelstein reaction (NaI in acetone) is a classic SN2 example.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
