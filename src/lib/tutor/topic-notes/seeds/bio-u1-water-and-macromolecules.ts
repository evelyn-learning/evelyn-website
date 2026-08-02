/**
 * Biology — Unit 1 CED 1.3: Water, pH & the Four Macromolecules.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.water-and-macromolecules.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U1_WATER_AND_MACROMOLECULES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.water-and-macromolecules.v1',
  course: 'Biology',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'Water, pH & the Four Macromolecules',
  planId: 'evelyn.hs.bio.water-and-macromolecules.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.water-and-macromolecules.v1' }],
  theory: [
    { loId: 'bio.water-and-macromolecules', kind: 'framework', title: 'Water is polar', content: `WATER IS POLAR — in H2O the oxygen pulls the shared electrons harder than the hydrogens do, so the oxygen end carries a slight negative charge and each hydrogen end a slight positive charge. The atoms inside the molecule are held by COVALENT bonds (strong, shared electrons). Everything else in this lesson follows from that lopsided charge.` },
    { loId: 'bio.water-and-macromolecules', kind: 'framework', title: 'Hydrogen bonds are between molecules', content: `HYDROGEN BONDS ARE BETWEEN MOLECULES — the slightly positive hydrogen of one water molecule attracts the slightly negative oxygen of a NEIGHBORING molecule. That attraction is a hydrogen bond: far weaker than a covalent bond, and constantly breaking and re-forming. Boiling water breaks hydrogen bonds BETWEEN molecules; it does not split H2O into hydrogen and oxygen.` },
    { loId: 'bio.water-and-macromolecules', kind: 'framework', title: 'Cohesion and adhesion', content: `COHESION AND ADHESION — cohesion is water sticking to WATER (same substance); adhesion is water sticking to OTHER surfaces such as glass or the walls of a plant vessel. Cohesion gives surface tension, letting a water strider walk on a pond. The two together let a tree pull a continuous column of water from roots to leaves.` },
    { loId: 'bio.water-and-macromolecules', kind: 'framework', title: 'High specific heat', content: `HIGH SPECIFIC HEAT — it takes a lot of energy to raise water's temperature, because much of that energy goes into breaking hydrogen bonds instead of speeding molecules up. That is why a lake warms and cools slowly, why coastal towns have milder temperature swings than inland ones, and why your body temperature stays near 37°C while the day around you swings.` },
    { loId: 'bio.water-and-macromolecules', kind: 'framework', title: 'The universal solvent', content: `THE UNIVERSAL SOLVENT — polar water surrounds and pulls apart other charged or polar substances (salt, sugar), dissolving them so they can be transported and can react. Nonpolar substances such as oils have no charged regions for water to grab, so they do NOT dissolve — they bead up and separate. "Universal" is a nickname, not a claim that water dissolves everything.` },
    { loId: 'bio.water-and-macromolecules', content: `THE pH SCALE IS LOGARITHMIC — pH runs 0 to 14 and measures the concentration of hydrogen ions (H+). Below 7 is acidic (more H+), 7 is neutral, above 7 is basic (more OH-). Each whole step is a factor of TEN: pH 4 has ten times more H+ than pH 5 and one hundred times more than pH 6. Blood is held near pH 7.4; stomach acid sits near pH 2.` },
    { loId: 'bio.water-and-macromolecules', kind: 'framework', title: 'The four macromolecules', content: `THE FOUR MACROMOLECULES — CARBOHYDRATES: monomer monosaccharide (glucose, C6H12O6) → polymer polysaccharide (starch, glycogen, cellulose); elements C, H, O; quick energy and structure. LIPIDS: built from glycerol plus fatty acids (not a true repeating monomer) → fats, oils, phospholipids, steroids; elements C, H, O with very little O; long-term energy storage, membranes, signaling. PROTEINS: monomer amino acid → polymer polypeptide; elements C, H, O and N; enzymes, structure, transport — the most varied class. NUCLEIC ACIDS: monomer nucleotide → polymer DNA or RNA; elements C, H, O, N and P; store and carry information.` },
    { loId: 'bio.water-and-macromolecules', kind: 'framework', title: 'Dehydration synthesis vs hydrolysis', content: `DEHYDRATION SYNTHESIS VS HYDROLYSIS — to BUILD a polymer, cells join two monomers and REMOVE one water molecule per bond (dehydration synthesis, also called condensation). To BREAK a polymer, cells ADD one water molecule per bond and split it (hydrolysis: "hydro" = water, "lysis" = split). Digesting starch into glucose is hydrolysis; storing glucose as glycogen is dehydration synthesis. Same rule for all four classes.` },
    { loId: 'bio.water-and-macromolecules', kind: 'definition', title: 'polar molecule', content: `a molecule with slightly positive and slightly negative ends because its electrons are shared unevenly.` },
    { loId: 'bio.water-and-macromolecules', kind: 'definition', title: 'hydrogen bond', content: `a weak attraction between the positive end of one polar molecule and the negative end of another.` },
    { loId: 'bio.water-and-macromolecules', kind: 'definition', title: 'monomer', content: 'a small repeating subunit that links with others to build a polymer.' },
    { loId: 'bio.water-and-macromolecules', kind: 'definition', title: 'hydrolysis', content: 'a reaction that uses a water molecule to split a bond between two monomers.' },
  ],
  methods: [
    {
      title: 'Worked pH steps',
      steps: [
        `Read the scale: lower pH means MORE H+, so lemon juice at pH 2 is the stronger acid and coffee at pH 5 is closer to neutral. Both are below 7, so both are acidic.`,
        'Count the whole-number steps between them: from 5 down to 2 is 3 steps.',
        `Apply the rule that each step is a factor of ten, and multiply rather than add: 10 × 10 × 10 = 1000.`,
        `State the comparison in the right direction — the LOWER pH has the larger H+ concentration, so lemon juice has 1000 times more H+ than coffee, not 3 times more.`,
      ],
      example: { problem: `Lemon juice has a pH of 2 and black coffee has a pH of 5. How many times more hydrogen ions (H+) does the lemon juice contain, and which one is the acid?`, solution: `Lemon juice is the stronger acid and contains 1000 times more H+ than the coffee (3 pH steps → 10 × 10 × 10).` },
      relatedLoIds: ['bio.water-and-macromolecules'],
    },
    {
      title: 'Worked build vs break',
      steps: [
        `Name the starting and ending molecules: bread starch is a polysaccharide, a polymer of many glucose monomers. Digestion ends with free glucose monomers.`,
        `Decide the DIRECTION: the polymer is being taken apart, so this is breaking, not building.`,
        `Match the direction to the reaction by what happens to water. Building (dehydration synthesis) REMOVES a water molecule for every bond formed — "dehydration" means water leaves. Breaking (hydrolysis) ADDS a water molecule to every bond broken.`,
        `So the student mixed up the two names: digestion of starch is HYDROLYSIS. A water molecule is consumed at each link, one H going to one glucose and the OH going to the other, until the chain is free monomers.`,
        `Check the reverse case for symmetry: when your liver later stores that glucose as glycogen, each new bond releases one water molecule — that is dehydration synthesis.`,
      ],
      example: { problem: `A student says: "Digestion breaks big food molecules apart, so digestion must be dehydration synthesis — you are taking the molecule apart the way you take water out of it." A slice of bread is digested into glucose. Which reaction actually happens, and what does water do?`, solution: `Hydrolysis — water is ADDED, one molecule per bond broken. Dehydration synthesis is the opposite reaction, which builds polymers and releases water.` },
      relatedLoIds: ['bio.water-and-macromolecules'],
    },
  ],
  pointers: [
    { content: `Inside a water molecule, H and O are held by strong COVALENT bonds. A hydrogen bond is the much weaker attraction between the slightly positive H of one molecule and the slightly negative O of a DIFFERENT molecule. Boiling supplies just enough energy to break those between-molecule attractions so molecules escape as steam — the steam is still H2O. Splitting water into hydrogen and oxygen gas takes far more energy and a different process entirely.`, kind: 'common-error' },
    { content: `Water is polar; covalent bonds hold atoms INSIDE a molecule, hydrogen bonds hold molecules TO EACH OTHER.`, kind: 'tip' },
    { content: `Cohesion = water to water (surface tension); adhesion = water to other surfaces; together they lift water up a plant.`, kind: 'tip' },
    { content: `High specific heat keeps lakes, coasts and bodies temperature-stable; polar water dissolves polar and charged substances but not oils.`, kind: 'tip' },
    { content: `The pH scale is logarithmic: each step is 10 times the H+. Below 7 acidic, 7 neutral, above 7 basic.`, kind: 'tip' },
    { content: `Monosaccharides → carbohydrates; glycerol + fatty acids → lipids; amino acids → proteins (contain N); nucleotides → nucleic acids (contain N and P).`, kind: 'tip' },
    { content: `Dehydration synthesis BUILDS polymers and releases water; hydrolysis BREAKS them and consumes water.`, kind: 'tip' },
    { content: `"Hydrogen bond" does NOT mean the H–O bond inside a water molecule. Inside = covalent (strong); between molecules = hydrogen bond (weak). Boiling breaks hydrogen bonds only — steam is still H₂O, not H₂ + O₂ gas.`, kind: 'common-error' },
    { content: `On pH, multiply — never subtract. pH 3 vs pH 6 is 3 steps → 10×10×10 = **1000×** more H⁺, not 3× more. And say it in the right direction: the LOWER pH has MORE H⁺.`, kind: 'common-error' },
    { content: `Dehydration synthesis = *water leaves*, polymer is BUILT. Hydrolysis = *water is added*, polymer is BROKEN. Don't let "taking it apart" make you pick dehydration — digestion is always hydrolysis.`, kind: 'gotcha' },
    { content: `Cohesion = water to WATER (same substance, gives surface tension). Adhesion = water to a DIFFERENT surface (glass, xylem walls). If the two substances are the same, it can't be adhesion.`, kind: 'vocab-note' },
    { content: `Use elements to fingerprint macromolecules: N present → protein; N **and P** → nucleic acid; only C, H, O → carbohydrate or lipid (lipids have far less O). Nucleic acid is the only class with phosphorus.`, kind: 'tip' },
    { content: `Lipids are the exception: they have no true repeating monomer. Say "built from glycerol + fatty acids," not "the monomer of a lipid is a fatty acid."`, kind: 'edge-case' },
    { content: `"Universal solvent" is a nickname, not a fact. Water dissolves polar and charged substances; nonpolar oils have no charged regions to grab, so they bead up and separate.`, kind: 'vocab-note' },
    { content: `High specific heat explains *temperature stability* (steady coastal towns, body at 37°C) — it is not the same as cohesion or evaporation. Ask: is the question about resisting a temperature change, or about sticking/climbing?`, kind: 'tip' },
  ],
};
