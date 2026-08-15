/**
 * Biology — Chemistry of Life: Enzymes & Reaction Rates.
 *
 * The concept/process template for the HS Biology fan-out (NGSS HS-LS1-6).
 * Almost every error here is one of two swaps: treating the enzyme like a
 * reactant that gets used up, or treating "denatured" as a synonym for
 * "consumed". The concept segment is built around keeping those apart, and
 * every experiment is described in words so nothing depends on a figure.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U1_ENZYMES: LessonPlan = {
  id: 'evelyn.hs.bio.enzymes.v1',
  title: 'Enzymes & Reaction Rates',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.enzymes',
      standard: 'BIO-1.4',
      description:
        'Explain how enzymes speed up reactions by lowering activation energy at a specific active site, and predict how temperature, pH, substrate concentration, and inhibitors change the rate of an enzyme-catalyzed reaction (NGSS HS-LS1-6).',
    },
  ],
  prerequisites: ['bio.water-and-macromolecules'],
  followUps: ['bio.cell-theory-types'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame enzymes as the reason body chemistry happens fast enough to keep you alive.',
      script:
        'Drop a piece of raw liver into hydrogen peroxide and it erupts into foam in seconds — that is one protein, catalase, tearing apart H2O2 faster than you can blink. The same kind of protein breaks down your breakfast, and when one of them is missing you get lactose intolerance. Laundry detergent has them printed right on the box. Today you find out what these proteins actually do to a reaction, and why a fever of 41°C is dangerous for exactly the same reason a boiled egg never un-cooks.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-catalysis-and-conditions',
      kind: 'concept',
      goal: 'What a catalyst does to activation energy, how the active site gives specificity, and what temperature, pH, substrate concentration, and inhibitors do to the rate.',
      keyIdeas: [
        'ENZYMES ARE PROTEIN CATALYSTS — an enzyme is a protein folded into a precise 3D shape that speeds up one specific chemical reaction in a cell. Catalase speeds up 2H2O2 → 2H2O + O2; lactase breaks lactose into two smaller sugars.',
        'THEY LOWER ACTIVATION ENERGY — every reaction needs a starting push, the ACTIVATION ENERGY, to get going. The enzyme lowers that barrier so far more molecules can get over it at body temperature. The reaction was always going to happen; the enzyme decides how FAST.',
        'WHAT THEY DO NOT CHANGE — an enzyme does NOT supply energy, and it does NOT make an impossible reaction possible. It changes the SPEED, not whether the reaction releases or requires energy overall.',
        'ACTIVE SITE AND SPECIFICITY — the SUBSTRATE (the molecule being changed) binds in a small pocket called the ACTIVE SITE. Its shape and chemistry match one substrate, which is why lactase cannot digest starch. INDUCED FIT: the active site tightens slightly around the substrate as it binds, straining the bonds that need to break — it is a flexible glove, not a rigid lock.',
        'ENZYMES ARE REUSABLE — the enzyme releases the products unchanged and immediately grabs another substrate molecule. It is NOT consumed and NOT a reactant. One catalase molecule can process millions of H2O2 molecules per second, which is why a tiny amount of enzyme handles a huge amount of substrate.',
        'TEMPERATURE — rate climbs as temperature rises, because molecules move faster and collide with the active site more often. It peaks at the OPTIMUM (about 37°C for most human enzymes) and then falls off a cliff: above the optimum the protein DENATURES, meaning its folded shape unravels and the active site no longer matches the substrate. Denaturation is usually permanent — a boiled egg never un-boils — and this is why a high fever is dangerous.',
        'pH — each enzyme has an optimum pH, because charged and hydrogen-bonded parts of the active site depend on the surrounding acidity. Pepsin in the stomach works best near pH 2; trypsin in the small intestine works best near pH 8. Move an enzyme far from its optimum pH and it denatures the same way heat denatures it.',
        'SUBSTRATE CONCENTRATION AND SATURATION — with a fixed amount of enzyme, adding more substrate raises the rate at first, then the curve flattens. At that plateau every active site is already occupied the instant it empties: the enzyme is SATURATED, and the only way to go faster is to add more enzyme.',
        'INHIBITORS — a COMPETITIVE inhibitor resembles the substrate and parks in the active site itself, so substrate and inhibitor compete; flooding the system with extra substrate outcompetes it and the rate recovers. A NONCOMPETITIVE inhibitor binds a different spot on the enzyme and bends the whole protein so the active site no longer fits; extra substrate does NOT help, because the problem is not competition for the pocket.',
      ],
      vocabulary: [
        { term: 'substrate', definition: 'the molecule an enzyme acts on, which binds in the active site.' },
        { term: 'activation energy', definition: 'the energy barrier a reaction must get over before it can proceed; the enzyme lowers it.' },
        { term: 'denaturation', definition: "the unfolding of a protein's 3D shape by heat or extreme pH, which destroys the active site." },
      ],
      suggestedTools: ['show_diagram', 'show_labeled_image', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-temperature-curve',
      kind: 'worked_example',
      problem:
        'A class measures how fast catalase releases oxygen from hydrogen peroxide at five temperatures. The bubbles per minute come out as: 5°C → 8, 20°C → 22, 37°C → 60, 50°C → 15, 70°C → 0. Explain the shape of these results, and predict what happens if the 70°C sample is cooled back down to 37°C.',
      steps: [
        'Read the pattern first: the rate rises from 5°C to a peak at 37°C, then drops hard, and reaches zero by 70°C. That is a peak, not a straight line — so two different effects must be at work on the two sides.',
        'Explain the rising side (5°C to 37°C): warmer molecules move faster, so substrate collides with the active site more often per second. More successful collisions means a faster rate. 37°C is the optimum.',
        'Explain the falling side (50°C and 70°C): the extra heat is now shaking the protein apart. The enzyme DENATURES — its folded shape unravels and the active site no longer matches H2O2, so binding fails no matter how fast the molecules are moving.',
        'Predict the cooling result: denaturation is a change to the protein itself, not just a slowdown. Cooling restores the temperature but not the fold, so the 70°C sample stays at roughly zero bubbles per minute even back at 37°C.',
      ],
      answer:
        'Rate rises to an optimum at 37°C because collisions get more frequent, then collapses above it because the enzyme denatures. Cooling the 70°C sample back to 37°C does not restore activity — the denatured shape does not refold.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-saturation-vs-used-up',
      kind: 'worked_example',
      problem:
        'A student keeps the amount of lactase constant and adds more and more lactose. The rate of sugar breakdown climbs steeply at first, then levels off at a plateau and stops climbing no matter how much lactose is added. The student concludes: "the enzyme must be getting used up." Is that the right explanation? What is actually happening, and what single change would raise the plateau?',
      steps: [
        'Test the claim against the data. If the enzyme were being consumed, the rate would FALL over time toward zero as the supply ran out. Instead it holds steady at a plateau — a constant, sustained rate. That rules out the enzyme being used up.',
        'Recall what the enzyme does at the molecular level: it binds substrate, converts it, releases the products unchanged, and is immediately free to bind again. It is a reusable tool, not a reactant.',
        'Explain the plateau properly: with a fixed amount of enzyme there are a fixed number of active sites. At low substrate, many sites sit empty, so adding substrate finds new sites and the rate climbs. Past a certain point every active site is refilled the instant it empties — the enzyme is SATURATED and there is nothing left to speed up.',
        'Find the fix: the limiting factor is the number of active sites, not the amount of substrate. Adding MORE LACTASE adds more active sites and raises the plateau. (Warming the tube slightly toward the optimum would also help, but past the optimum it would denature the enzyme and the rate would crash.)',
      ],
      answer:
        'No — the enzyme is not consumed. The plateau is SATURATION: every active site is already occupied, so extra substrate has nowhere to bind. Adding more lactase raises the plateau.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-what-enzymes-do',
      kind: 'try_yourself',
      problem: 'What does an enzyme do to the reaction it catalyzes?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It supplies the energy the reaction needs, so the reaction can happen' },
        { id: 'b', text: 'It lowers the activation energy, so the reaction happens much faster', correct: true },
        { id: 'c', text: 'It is used up as a reactant, so more enzyme is needed for more product' },
        { id: 'd', text: 'It raises the activation energy, which forces the substrate to react' },
      ],
      expectedAnswer: 'It lowers the activation energy, so the reaction happens much faster',
      hints: [
        'An enzyme is a catalyst. Does a catalyst change WHETHER a reaction happens, or how FAST it happens?',
        'Think about the starting-push barrier: the enzyme makes that barrier smaller so far more molecules can get over it at body temperature.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-saturation',
      kind: 'try_yourself',
      problem:
        'A tube contains a fixed amount of an enzyme. As more and more substrate is added, the reaction rate rises at first and then levels off at a steady plateau, no matter how much extra substrate goes in. Why does the rate stop rising?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Every active site is already occupied, so the enzyme is saturated and adding substrate cannot speed it up further', correct: true },
        { id: 'b', text: 'The enzyme has been used up by all the substrate it processed' },
        { id: 'c', text: 'The extra substrate denatured the enzyme, destroying its active sites' },
        { id: 'd', text: 'The substrate started binding to the wrong enzymes, so the reaction changed' },
      ],
      expectedAnswer: 'Every active site is already occupied, so the enzyme is saturated and adding substrate cannot speed it up further',
      hints: [
        'The rate holds steady at the plateau instead of falling to zero — what would the graph look like instead if the enzyme were being destroyed or consumed?',
        'The amount of enzyme is fixed, so the number of active sites is fixed. What happens once they are all busy?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-inhibitor-type',
      kind: 'try_yourself',
      problem:
        'A drug slows an enzyme down. When researchers flood the reaction with a large excess of substrate, the enzyme returns to its normal maximum rate. What kind of inhibitor is the drug, and why does the extra substrate rescue the rate?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Noncompetitive — the extra substrate refolds the enzyme back into its working shape' },
        { id: 'b', text: 'Noncompetitive — the drug binds away from the active site, and substrate pushes it out of that spot' },
        { id: 'c', text: 'Competitive — the drug permanently destroys active sites, and the extra substrate replaces the lost enzyme' },
        { id: 'd', text: 'Competitive — the drug binds in the active site itself, so extra substrate outcompetes it for the pocket', correct: true },
      ],
      expectedAnswer: 'Competitive — the drug binds in the active site itself, so extra substrate outcompetes it for the pocket',
      hints: [
        'Only one of the two inhibitor types can be overcome by adding more substrate. Which one, and what does that tell you about WHERE the drug binds?',
        'If substrate and inhibitor are competing for the same pocket, having far more substrate molecules around means substrate wins the race most of the time.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-denatured-means-used-up',
      kind: 'misconception_check',
      question:
        'A student writes: "When you boil an enzyme it denatures, which means it gets used up by the reaction — that is why the reaction stops." What went wrong?',
      commonErrors: [
        {
          answer: 'Denatured means the enzyme was used up by the reaction',
          misconception: 'Merging two separate ideas — that enzymes are consumed like reactants, and that denaturation is that consumption — instead of seeing that enzymes are never consumed and denaturation is a change in shape.',
          correctsTo:
            'Two corrections. First, enzymes are NEVER used up by the reaction they catalyze: they release the products unchanged and bind another substrate straight away, which is why a pinch of catalase can clear a whole beaker of H2O2. Second, DENATURATION is not consumption — the enzyme molecule is still there, but heat has unravelled its folded shape so the active site no longer matches the substrate. The reaction stops because the tool is bent out of shape, not because the tool was spent.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Enzymes are protein catalysts: they lower the activation energy so a reaction runs far faster. They change the SPEED, not whether the reaction can happen.',
        'The substrate binds the ACTIVE SITE, which tightens around it (induced fit) — that shape match is why each enzyme handles one specific reaction.',
        'Enzymes are reusable and never consumed; one enzyme molecule processes substrate after substrate.',
        'Temperature and pH each have an optimum (about 37°C for most human enzymes). Past it the protein DENATURES — the shape unravels, the active site is lost, and cooling it back down does not fix it.',
        'A fixed amount of enzyme saturates: past the plateau, add more ENZYME, not more substrate.',
        'Competitive inhibitors sit in the active site and are beaten by extra substrate; noncompetitive inhibitors bind elsewhere, distort the active site, and extra substrate does not help.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'Enzymes & Reaction Rates' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
