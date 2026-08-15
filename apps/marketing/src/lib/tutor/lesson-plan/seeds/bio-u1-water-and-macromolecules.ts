/**
 * Biology — Chemistry of Life: Water, pH & the Four Macromolecules.
 *
 * The opening chemistry unit of the HS Biology fan-out (NGSS HS-LS1-6).
 * Almost every error here is a bookkeeping error about BONDS and WATER:
 * which bonds hold a molecule together vs which hold molecules to each
 * other, and whether a reaction spends water or releases it. The concept
 * segment is organized around those two ledgers.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U1_WATER_AND_MACROMOLECULES: LessonPlan = {
  id: 'evelyn.hs.bio.water-and-macromolecules.v1',
  title: 'Water, pH & the Four Macromolecules',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.water-and-macromolecules',
      standard: 'BIO-1.3',
      description:
        "Explain how water's polarity and hydrogen bonding produce cohesion, adhesion, high specific heat and solvent power, interpret the pH scale, and identify the monomers, elements and functions of the four macromolecule classes built by dehydration synthesis and broken by hydrolysis (NGSS HS-LS1-6).",
    },
  ],
  prerequisites: ['bio.scientific-method-bio'],
  followUps: ['bio.enzymes'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame water and the macromolecules as the reason a body works at all — and as everyday chemistry students already live in.',
      script:
        'You are roughly 60% water, and that is not filler. It is why you sweat instead of overheating, why blood can carry sugar and salt at the same time, and why a maple tree can lift water 30 meters straight up with no pump. The other big share of you is built from just four kinds of molecule — the ones on every nutrition label: carbohydrates, fats, proteins, and the nucleic acids that hold your DNA. In this lesson you learn the handful of rules that explain all of it, starting with one lopsided little molecule.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-water-ph-macromolecules',
      kind: 'concept',
      goal: "Water's polarity and the four properties it causes, the pH scale, and the four macromolecules with their monomers and their build/break reactions.",
      keyIdeas: [
        'WATER IS POLAR — in H2O the oxygen pulls the shared electrons harder than the hydrogens do, so the oxygen end carries a slight negative charge and each hydrogen end a slight positive charge. The atoms inside the molecule are held by COVALENT bonds (strong, shared electrons). Everything else in this lesson follows from that lopsided charge.',
        'HYDROGEN BONDS ARE BETWEEN MOLECULES — the slightly positive hydrogen of one water molecule attracts the slightly negative oxygen of a NEIGHBORING molecule. That attraction is a hydrogen bond: far weaker than a covalent bond, and constantly breaking and re-forming. Boiling water breaks hydrogen bonds BETWEEN molecules; it does not split H2O into hydrogen and oxygen.',
        'COHESION AND ADHESION — cohesion is water sticking to WATER (same substance); adhesion is water sticking to OTHER surfaces such as glass or the walls of a plant vessel. Cohesion gives surface tension, letting a water strider walk on a pond. The two together let a tree pull a continuous column of water from roots to leaves.',
        'HIGH SPECIFIC HEAT — it takes a lot of energy to raise water\'s temperature, because much of that energy goes into breaking hydrogen bonds instead of speeding molecules up. That is why a lake warms and cools slowly, why coastal towns have milder temperature swings than inland ones, and why your body temperature stays near 37°C while the day around you swings.',
        'THE UNIVERSAL SOLVENT — polar water surrounds and pulls apart other charged or polar substances (salt, sugar), dissolving them so they can be transported and can react. Nonpolar substances such as oils have no charged regions for water to grab, so they do NOT dissolve — they bead up and separate. "Universal" is a nickname, not a claim that water dissolves everything.',
        'THE pH SCALE IS LOGARITHMIC — pH runs 0 to 14 and measures the concentration of hydrogen ions (H+). Below 7 is acidic (more H+), 7 is neutral, above 7 is basic (more OH-). Each whole step is a factor of TEN: pH 4 has ten times more H+ than pH 5 and one hundred times more than pH 6. Blood is held near pH 7.4; stomach acid sits near pH 2.',
        'THE FOUR MACROMOLECULES — CARBOHYDRATES: monomer monosaccharide (glucose, C6H12O6) → polymer polysaccharide (starch, glycogen, cellulose); elements C, H, O; quick energy and structure. LIPIDS: built from glycerol plus fatty acids (not a true repeating monomer) → fats, oils, phospholipids, steroids; elements C, H, O with very little O; long-term energy storage, membranes, signaling. PROTEINS: monomer amino acid → polymer polypeptide; elements C, H, O and N; enzymes, structure, transport — the most varied class. NUCLEIC ACIDS: monomer nucleotide → polymer DNA or RNA; elements C, H, O, N and P; store and carry information.',
        'DEHYDRATION SYNTHESIS VS HYDROLYSIS — to BUILD a polymer, cells join two monomers and REMOVE one water molecule per bond (dehydration synthesis, also called condensation). To BREAK a polymer, cells ADD one water molecule per bond and split it (hydrolysis: "hydro" = water, "lysis" = split). Digesting starch into glucose is hydrolysis; storing glucose as glycogen is dehydration synthesis. Same rule for all four classes.',
      ],
      vocabulary: [
        { term: 'polar molecule', definition: 'a molecule with slightly positive and slightly negative ends because its electrons are shared unevenly.' },
        { term: 'hydrogen bond', definition: 'a weak attraction between the positive end of one polar molecule and the negative end of another.' },
        { term: 'monomer', definition: 'a small repeating subunit that links with others to build a polymer.' },
        { term: 'hydrolysis', definition: 'a reaction that uses a water molecule to split a bond between two monomers.' },
      ],
      suggestedTools: ['show_diagram', 'show_table', 'show_concept_map'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-ph-steps',
      kind: 'worked_example',
      problem:
        'Lemon juice has a pH of 2 and black coffee has a pH of 5. How many times more hydrogen ions (H+) does the lemon juice contain, and which one is the acid?',
      steps: [
        'Read the scale: lower pH means MORE H+, so lemon juice at pH 2 is the stronger acid and coffee at pH 5 is closer to neutral. Both are below 7, so both are acidic.',
        'Count the whole-number steps between them: from 5 down to 2 is 3 steps.',
        'Apply the rule that each step is a factor of ten, and multiply rather than add: 10 × 10 × 10 = 1000.',
        'State the comparison in the right direction — the LOWER pH has the larger H+ concentration, so lemon juice has 1000 times more H+ than coffee, not 3 times more.',
      ],
      answer: 'Lemon juice is the stronger acid and contains 1000 times more H+ than the coffee (3 pH steps → 10 × 10 × 10).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-build-vs-break',
      kind: 'worked_example',
      problem:
        'A student says: "Digestion breaks big food molecules apart, so digestion must be dehydration synthesis — you are taking the molecule apart the way you take water out of it." A slice of bread is digested into glucose. Which reaction actually happens, and what does water do?',
      steps: [
        'Name the starting and ending molecules: bread starch is a polysaccharide, a polymer of many glucose monomers. Digestion ends with free glucose monomers.',
        'Decide the DIRECTION: the polymer is being taken apart, so this is breaking, not building.',
        'Match the direction to the reaction by what happens to water. Building (dehydration synthesis) REMOVES a water molecule for every bond formed — "dehydration" means water leaves. Breaking (hydrolysis) ADDS a water molecule to every bond broken.',
        'So the student mixed up the two names: digestion of starch is HYDROLYSIS. A water molecule is consumed at each link, one H going to one glucose and the OH going to the other, until the chain is free monomers.',
        'Check the reverse case for symmetry: when your liver later stores that glucose as glycogen, each new bond releases one water molecule — that is dehydration synthesis.',
      ],
      answer: 'Hydrolysis — water is ADDED, one molecule per bond broken. Dehydration synthesis is the opposite reaction, which builds polymers and releases water.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-specific-heat',
      kind: 'try_yourself',
      problem:
        'A town on the ocean coast stays around 20°C all afternoon while an inland town at the same latitude climbs to 35°C and then drops sharply after sunset. Which property of water best explains the coastal town\'s steadier temperature?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Cohesion — water molecules stick to each other, creating surface tension' },
        { id: 'b', text: 'Adhesion — water molecules stick to the surfaces of sand and rock' },
        { id: 'c', text: 'High specific heat — water absorbs and releases a lot of energy for a small temperature change', correct: true },
        { id: 'd', text: 'Water is the universal solvent, so it dissolves the heat in the air' },
      ],
      expectedAnswer: 'High specific heat — water absorbs and releases a lot of energy for a small temperature change',
      hints: [
        'The question is about TEMPERATURE change, not about water sticking to things or dissolving things.',
        'Energy going into the ocean is spent breaking hydrogen bonds instead of raising the temperature, so the water warms and cools slowly and moderates the air above it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-ph-scale',
      kind: 'try_yourself',
      problem:
        'Solution X has a pH of 3 and solution Y has a pH of 6. How do their hydrogen ion (H+) concentrations compare?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Solution X has 1000 times more H+ than solution Y', correct: true },
        { id: 'b', text: 'Solution X has 3 times more H+ than solution Y' },
        { id: 'c', text: 'Solution X has 30 times more H+ than solution Y' },
        { id: 'd', text: 'Solution Y has 1000 times more H+ than solution X' },
      ],
      expectedAnswer: 'Solution X has 1000 times more H+ than solution Y',
      hints: [
        'Each whole step on the pH scale is a factor of ten, so the steps multiply — they do not add.',
        'There are 3 steps from pH 6 to pH 3, and the LOWER pH is the one with more H+.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-monomer-and-reaction',
      kind: 'try_yourself',
      problem:
        'An enzyme in your small intestine acts on a long protein from a piece of chicken and releases its individual subunits. Which subunit is released, and which reaction is happening?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nucleotides are released by hydrolysis, which adds water' },
        { id: 'b', text: 'Amino acids are released by dehydration synthesis, which adds water' },
        { id: 'c', text: 'Monosaccharides are released by hydrolysis, which adds water' },
        { id: 'd', text: 'Amino acids are released by hydrolysis, which adds water', correct: true },
      ],
      expectedAnswer: 'Amino acids are released by hydrolysis, which adds water',
      hints: [
        'Answer the two halves separately: which monomer builds a PROTEIN, and is this reaction building or breaking?',
        'Nucleotides build nucleic acids and monosaccharides build carbohydrates. Breaking a polymer consumes water, and the name for that is hydrolysis.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-hydrogen-bonds',
      kind: 'misconception_check',
      question:
        'A student writes: "The hydrogen bonds are the bonds between the H and the O inside a water molecule, so when you boil water you break those hydrogen bonds and get hydrogen gas and oxygen gas." What went wrong?',
      commonErrors: [
        {
          answer: 'Hydrogen bonds hold the atoms together inside one H2O molecule, and boiling splits water into hydrogen and oxygen',
          misconception: 'Hearing the word "hydrogen" in "hydrogen bond" and assuming it names the H-to-O bond inside the molecule, rather than an attraction BETWEEN separate molecules.',
          correctsTo:
            'Inside a water molecule, H and O are held by strong COVALENT bonds. A hydrogen bond is the much weaker attraction between the slightly positive H of one molecule and the slightly negative O of a DIFFERENT molecule. Boiling supplies just enough energy to break those between-molecule attractions so molecules escape as steam — the steam is still H2O. Splitting water into hydrogen and oxygen gas takes far more energy and a different process entirely.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Water is polar; covalent bonds hold atoms INSIDE a molecule, hydrogen bonds hold molecules TO EACH OTHER.',
        'Cohesion = water to water (surface tension); adhesion = water to other surfaces; together they lift water up a plant.',
        'High specific heat keeps lakes, coasts and bodies temperature-stable; polar water dissolves polar and charged substances but not oils.',
        'The pH scale is logarithmic: each step is 10 times the H+. Below 7 acidic, 7 neutral, above 7 basic.',
        'Monosaccharides → carbohydrates; glycerol + fatty acids → lipids; amino acids → proteins (contain N); nucleotides → nucleic acids (contain N and P).',
        'Dehydration synthesis BUILDS polymers and releases water; hydrolysis BREAKS them and consumes water.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'Water, pH & the Four Macromolecules' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
