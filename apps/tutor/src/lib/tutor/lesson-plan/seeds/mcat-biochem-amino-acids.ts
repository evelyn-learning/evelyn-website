/**
 * MCAT Biochem — Amino Acids and Protein Structure.
 *
 * Highest-yield biochem topic. Foundation for enzymes, protein function,
 * pH/pI calculations. Tested in Chem/Phys AND Bio/Biochem sections.
 */

import type { LessonPlan } from '../types';

export const SEED_MCAT_BIOCHEM_AMINO_ACIDS: LessonPlan = {
  id: 'evelyn.testprep.mcat.biochem.amino-acids.v1',
  title: 'MCAT Biochem — Amino Acids, pI, and Protein Structure',
  curriculum: 'CCSS',
  grade: 'graduate',
  subject: 'test-prep',
  topic: 'mcat-bio-biochem',
  locale: 'en',
  los: [
    {
      id: 'mcat.biochem.amino-acids',
      description: 'Classify the 20 amino acids by side-chain property, calculate isoelectric point (pI), predict ionization at given pH, identify levels of protein structure, and recognize denaturation conditions.',
      standard: 'MCAT-BIO-AA',
    },
  ],
  prerequisites: ['mcat.format-2025'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Amino acids = the highest-yield biochem topic on the MCAT.',
      script: 'No biochem topic appears more often than amino acids — they show up in Chem/Phys (acid-base, electrophoresis, titration) and Bio/Biochem (protein folding, enzyme catalysis, mutation effects). If you nail amino-acid properties + pI calculation + the four levels of protein structure, you\'ll handle a quarter of biochem questions reflexively. AAMC official tests have at least one amino-acid identity or pI question per Bio/Biochem section.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-amino-acids',
      kind: 'concept',
      goal: 'The 20 amino acids — by side-chain class.',
      keyIdeas: [
        'GENERAL STRUCTURE: H₂N–CHR–COOH. The α-carbon carries the side chain R. Glycine\'s R = H makes it the only ACHIRAL amino acid.',
        'NONPOLAR (hydrophobic) — buried in protein cores: Glycine (G), Alanine (A), Valine (V), Leucine (L), Isoleucine (I), Methionine (M), Phenylalanine (F), Tryptophan (W), Proline (P).',
        'POLAR uncharged — H-bond donors/acceptors: Serine (S), Threonine (T), Cysteine (C), Tyrosine (Y), Asparagine (N), Glutamine (Q).',
        'ACIDIC (negatively charged at pH 7): Aspartate (D), Glutamate (E). Side chains have COOH groups.',
        'BASIC (positively charged at pH 7): Lysine (K), Arginine (R), Histidine (H). His pKa ≈ 6 — only basic AA partially protonated at physiological pH; key in enzyme active sites.',
        'SPECIAL: Proline — secondary amine in a ring; disrupts α-helices, kinks β-turns. Cysteine — thiol forms disulfide bonds. Glycine — only achiral; smallest; allows tight turns.',
        'MNEMONICS: "PVT TIM HALL" or focus on side-chain class. Knowing the THREE-letter and ONE-letter codes is non-optional.',
        'AROMATIC: Phe (F), Tyr (Y), Trp (W). Absorb UV at 280 nm — the basis for protein concentration measurement.',
      ],
      vocabulary: [
        { term: 'zwitterion', definition: 'a dipolar form of an amino acid with a +1 amino group and a −1 carboxylate, net charge 0; dominant species at pI.' },
        { term: 'pI (isoelectric point)', definition: 'the pH at which an amino acid (or protein) has zero net charge; pI = average of the two pKa values flanking the zwitterion.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-pi',
      kind: 'concept',
      goal: 'Ionization, pI calculation, electrophoresis behavior.',
      keyIdeas: [
        'AT LOW pH: amino acid fully protonated (-NH₃⁺ and -COOH). Net charge +1.',
        'AT HIGH pH: fully deprotonated (-NH₂ and -COO⁻). Net charge -1.',
        'AT pI: zwitterion form dominant. Net charge 0.',
        'pI for a NEUTRAL amino acid: pI = (pKa₁ + pKa₂)/2 where pKa₁ ≈ 2 (-COOH) and pKa₂ ≈ 9-10 (-NH₃⁺). So pI ≈ 5-6.',
        'pI for an ACIDIC amino acid (Asp, Glu): pI = (pKa-COOH + pKa-side chain)/2 ≈ (2 + 4)/2 ≈ 3.',
        'pI for a BASIC amino acid (Lys, Arg, His): pI = (pKa-NH₃⁺ + pKa-side chain)/2 ≈ (9 + 11)/2 ≈ 10 for Lys, ≈ 7.6 for His.',
        'ELECTROPHORESIS: at pH > pI → AA is negatively charged → migrates to ANODE (+). At pH < pI → positively charged → migrates to CATHODE (−). At pH = pI → no migration.',
        'TITRATION CURVE: plateaus (buffering regions) at each pKa. Inflection points between plateaus mark pI (for AAs with two pKa values) or fully ionized states.',
      ],
      vocabulary: [
        { term: 'pKa', definition: 'pH at which a given ionizable group is half-protonated; smaller pKa = stronger acid.' },
        { term: 'electrophoresis', definition: 'separation of charged molecules in an electric field; AAs migrate based on net charge at the gel\'s pH.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-protein-structure',
      kind: 'concept',
      goal: 'Four levels of protein structure + denaturation.',
      keyIdeas: [
        'PRIMARY: linear sequence of amino acids linked by peptide (amide) bonds. Determined by DNA. Read N-terminus → C-terminus.',
        'PEPTIDE BOND: planar, partial double-bond character → restricts rotation → φ/ψ angles define backbone geometry. Trans configuration heavily favored (cis only for proline).',
        'SECONDARY: local backbone H-bonding patterns. α-helix (H-bond i to i+4, 3.6 residues/turn, side chains face out, R-handed). β-sheet (H-bonds between strands; parallel or antiparallel).',
        'TERTIARY: 3D fold of one polypeptide. Driven by HYDROPHOBIC EFFECT (nonpolar side chains pack inward), reinforced by H-bonds, ionic interactions (salt bridges), van der Waals, and DISULFIDE BONDS (Cys-Cys covalent, oxidizing environments).',
        'QUATERNARY: assembly of multiple polypeptide subunits (e.g., hemoglobin = 4 subunits, two α + two β).',
        'DENATURATION: disrupts higher-order structure (secondary, tertiary, quaternary) WITHOUT cleaving peptide bonds. Primary stays intact.',
        'DENATURING AGENTS: heat, extreme pH, urea/guanidinium HCl (H-bond disruption), detergents like SDS (hydrophobic disruption), reducing agents (β-mercaptoethanol, DTT — break disulfides), heavy metals (precipitate).',
      ],
      vocabulary: [
        { term: 'hydrophobic effect', definition: 'the tendency of nonpolar groups to cluster in aqueous environments to minimize unfavorable water ordering — primary driver of protein folding.' },
        { term: 'disulfide bond', definition: 'covalent S-S bond between two cysteine residues; stabilizes tertiary/quaternary structure under oxidizing conditions.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Lysine has pKa values of 2.2 (-COOH), 9.0 (-NH₃⁺), and 10.5 (side-chain -NH₃⁺). What is its pI?',
      expectedAnswer: '~9.75. Lysine is BASIC (positive side chain). pI = average of the two pKa values flanking the ZWITTERION (net 0) species → pI = (9.0 + 10.5)/2 = 9.75. NOT (2.2+9.0)/2 — that would be the pI of a neutral AA.',
      responseFormat: 'numeric',
      hints: [
        'Lysine has a positive side chain → basic AA → pI is high.',
        'pI = average of the two pKa values that flank the net-zero charge state.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-denaturation',
      kind: 'misconception_check',
      question: 'Denaturation breaks the peptide bonds in a protein and shortens the polypeptide chain. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Confusing denaturation with proteolysis (peptide hydrolysis).',
          correctsTo: 'False. Denaturation disrupts the WEAKER interactions that maintain higher-order structure (H-bonds, salt bridges, hydrophobic packing, sometimes disulfides) — NOT the covalent peptide bonds that hold the primary sequence together. The polypeptide chain stays intact; only its 3D fold collapses. PROTEOLYSIS (enzymatic or hydrolytic cleavage) is what cuts peptide bonds and shortens the chain. MCAT loves this distinction — denaturation = lose function, proteolysis = lose chain.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '20 AAs: nonpolar, polar uncharged, acidic (D,E), basic (K,R,H). Special: G, P, C.',
        'pI = average of pKa values flanking net-zero state. Acidic AA pI ≈ 3; neutral ~6; basic ~10.',
        'At pH > pI → migrate to anode (+); at pH < pI → migrate to cathode (−).',
        'Four levels: primary (sequence) → secondary (α-helix, β-sheet) → tertiary (3D) → quaternary (subunits).',
        'Denaturation disrupts higher-order ONLY; peptide bonds intact.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is histidine often found in enzyme active sites that perform acid-base catalysis at physiological pH?',
      hint: 'Histidine\'s imidazole side chain has pKa ≈ 6 — uniquely close to physiological pH 7.4. At pH 7.4, the pH/pKa equilibrium has His ~10% protonated, ~90% deprotonated, so it can both DONATE and ACCEPT a proton on a similar timescale. No other amino acid can shuttle protons at neutral pH the way His can. Found in serine proteases (chymotrypsin catalytic triad: Ser-His-Asp), carbonic anhydrase, RNase A. Acidic AAs (D/E pKa ~4) are deprotonated at pH 7; basic AAs (K/R pKa >10) are protonated. Only His sits at the cusp.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
