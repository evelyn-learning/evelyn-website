/**
 * Biology — Cell Structure: The Cell Membrane & the Fluid Mosaic Model.
 *
 * The structure half of the old cell-membrane plan, rebuilt on the HS concept
 * template (NGSS HS-LS1-2, HS-LS1-3). Transport MECHANISMS deliberately live in
 * the next lesson (2.4) — here the whole arc is why a phospholipid bilayer
 * self-assembles in water and what that geometry lets through. Every structure
 * is described in words, so the lesson is solvable without any figure.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U2_CELL_MEMBRANE_STRUCTURE: LessonPlan = {
  id: 'evelyn.hs.bio.cell-membrane-structure.v1',
  title: 'The Cell Membrane & the Fluid Mosaic Model',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.cell-membrane-structure',
      standard: 'BIO-2.3',
      description:
        'Model the cell membrane as a fluid phospholipid bilayer with embedded proteins and cholesterol, and explain how that structure makes the membrane selectively permeable (NGSS HS-LS1-2, HS-LS1-3).',
    },
  ],
  prerequisites: ['bio.organelles'],
  followUps: ['bio.transport-across-membranes'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the membrane as the boundary that makes "alive" possible — and as the surface most medicines have to negotiate.',
      script:
        'A cell is mostly water floating in more water. The only thing keeping the inside from becoming the outside is a film two molecules thick — about ten-thousand times thinner than a sheet of paper. Nobody builds it: drop the right molecules in water and it assembles itself, and it seals itself again when punctured. That same film is why some drugs work as a swallowed pill and others have to be injected. In this lesson you will figure out why those molecules arrange themselves the way they do, and what that arrangement decides to let through.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-fluid-mosaic',
      kind: 'concept',
      goal: 'Why the bilayer self-assembles, what the fluid mosaic model claims, and how that structure produces selective permeability.',
      keyIdeas: [
        'THE PHOSPHOLIPID — one molecule with two personalities. A PHOSPHATE HEAD that is polar and HYDROPHILIC (water-attracting), attached to two FATTY-ACID TAILS that are nonpolar and HYDROPHOBIC (water-avoiding). Picture a lollipop with two wiggly strings hanging off it.',
        'WHY IT SELF-ASSEMBLES — a cell has water on BOTH sides: cytoplasm inside, fluid outside. The only arrangement that puts every head in water and hides every tail from it is two sheets placed tail-to-tail: heads facing OUT toward the water on each surface, tails tucked INTO the middle. Nothing pushes them there — water does the work, so a torn membrane reseals itself.',
        'THE BILAYER SANDWICH, NAMED IN ORDER — outside water, a layer of heads, a greasy tail-to-tail core, a second layer of heads, inside water. That greasy core is the whole story: it is the barrier, and it is only about 5 nanometers thick.',
        'THE FLUID MOSAIC MODEL — FLUID because phospholipids drift sideways within their own layer, swapping neighbors millions of times a second; the membrane behaves like a soap film, not a brick wall. MOSAIC because proteins are scattered through it like tiles of different shapes, not laid out in a repeating pattern.',
        'THE PROTEIN JOBS — CHANNEL proteins form a water-lined tunnel a specific ion or water molecule can slip through; CARRIER proteins bind one molecule (glucose, say), change shape, and release it on the far side; RECEPTOR proteins stick out and bind a signal such as a hormone, passing the message inward without the hormone entering; MARKER proteins (usually with a sugar chain attached, making them glycoproteins) act as an ID badge so your immune system reads the cell as yours.',
        'CHOLESTEROL AS A BUFFER — cholesterol molecules wedge between the tails and work in BOTH directions: when it is warm they restrain the tails and keep the membrane from getting too runny; when it is cold they hold the tails apart and keep the membrane from freezing solid. It is a thermostat for fluidity, not glue and not a stiffener.',
        'SELECTIVE PERMEABILITY COMES FROM THE GREASY CORE — small NONPOLAR molecules dissolve straight through it and cross freely: O2, CO2, and small lipids. Anything CHARGED or large and POLAR is repelled by that core and needs a protein door: sodium and potassium ions, glucose, amino acids. Charge matters more than size — a tiny sodium ion is blocked while a bigger CO2 molecule sails through.',
        'THE CLASSIC ERRORS TO AVOID — (1) the tails do NOT face outward; heads face the water. (2) The membrane is not a rigid wall; it is fluid and self-sealing. (3) Proteins are not sitting on top like decorations; many span the full bilayer with their own hydrophilic ends in the water and a hydrophobic middle in the core. (4) Selective does not mean the membrane chooses — it is chemistry, not a decision.',
      ],
      vocabulary: [
        { term: 'phospholipid bilayer', definition: 'two sheets of phospholipids arranged tail-to-tail, heads out toward water on both surfaces.' },
        { term: 'hydrophobic', definition: 'water-avoiding; describes the nonpolar fatty-acid tails that hide in the membrane core.' },
        { term: 'fluid mosaic model', definition: 'the model of the membrane as a drifting lipid sheet with proteins scattered through it like tiles.' },
        { term: 'selectively permeable', definition: 'lets some substances cross freely while blocking others, based on their size and charge.' },
      ],
      suggestedTools: ['show_diagram', 'show_labeled_image', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-why-tails-inward',
      kind: 'worked_example',
      problem:
        'Purified phospholipids are shaken into a beaker of water. Without any cell or machinery present, they spontaneously form closed spheres whose wall is two molecules thick. Explain the orientation of the molecules in that wall, and why no other arrangement survives.',
      steps: [
        'Label the two ends of one phospholipid: a polar phosphate head that is attracted to water, and two nonpolar fatty-acid tails that are repelled by it.',
        'Note where the water is. In a closed sphere there is water on the outside AND trapped water on the inside — so the wall has water pressing on both of its faces.',
        'Test the wrong arrangement first: if the tails faced outward, every tail would sit in contact with water, which is the arrangement water forces apart. Those molecules get pushed and re-shuffled until the tails are hidden.',
        'Test the surviving arrangement: two layers placed tail-to-tail. Now every head touches water (outer heads face the outside water, inner heads face the trapped water) and every tail touches only other tails.',
        'That is the only arrangement that satisfies both ends at once, so it is the one that persists — the bilayer is the stable result, not something assembled by the cell.',
      ],
      answer:
        'Heads face outward into the water on both surfaces and the tails point inward toward each other, forming a greasy core — the only arrangement that keeps every hydrophilic head in water and every hydrophobic tail out of it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-size-vs-charge',
      kind: 'worked_example',
      problem:
        'A student predicts: "Smaller molecules always cross the membrane more easily, so a sodium ion (Na+) — one of the smallest particles in the cell — should cross faster than CO2, which is a three-atom molecule." Measurements show the opposite: CO2 crosses freely and Na+ barely crosses at all without a protein. Where does the prediction go wrong?',
      steps: [
        'State the rule the student used: permeability depends on size alone. Then find the property that rule ignores — charge and polarity.',
        'Name the barrier precisely. The middle of the membrane is a layer of nonpolar fatty-acid tails: a greasy, water-free zone.',
        'Check CO2 against that barrier: CO2 is small AND nonpolar, so it dissolves into a greasy layer the same way oil mixes with oil. It slips through with no help.',
        'Check Na+ against the same barrier: a sodium ion carries a full positive charge and drags a shell of water molecules with it. Entering the greasy core would mean stripping that water off and pushing a charge into a nonpolar zone — energetically expensive, so it is turned away despite its tiny size.',
        'Repair the rule: the membrane sorts first by charge and polarity, and only then by size. Charged and large polar particles such as Na+, K+, and glucose need a channel or carrier protein; small nonpolar ones such as O2 and CO2 do not.',
      ],
      answer:
        'Size is the wrong first filter. The hydrophobic core blocks charged and polar particles, so the charged Na+ is excluded while the small nonpolar CO2 dissolves straight through.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-bilayer-orientation',
      kind: 'try_yourself',
      problem:
        'A cell membrane has watery cytoplasm on its inner side and watery fluid on its outer side. How are the phospholipids oriented in that membrane?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The hydrophobic fatty-acid tails face outward toward the water on both sides, with the phosphate heads meeting in the middle' },
        { id: 'b', text: 'The hydrophilic phosphate heads face outward toward the water on both sides, with the fatty-acid tails meeting in the middle', correct: true },
        { id: 'c', text: 'All the heads face the outside of the cell and all the tails face the cytoplasm, in a single layer' },
        { id: 'd', text: 'Heads and tails alternate randomly, since the membrane is fluid and constantly moving' },
      ],
      expectedAnswer:
        'The hydrophilic phosphate heads face outward toward the water on both sides, with the fatty-acid tails meeting in the middle',
      hints: [
        'There is water on BOTH sides of the membrane. Which end of a phospholipid wants to be in contact with water?',
        'Only one arrangement keeps every head in water and every tail out of it — the tails have to hide somewhere.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-needs-a-protein',
      kind: 'try_yourself',
      problem:
        'Four substances arrive at a cell membrane: oxygen gas (O2), carbon dioxide (CO2), a potassium ion (K+), and a glucose molecule. Which of them can cross the bilayer directly, without using a membrane protein?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'K+ and glucose, because they are the molecules the cell needs most' },
        { id: 'b', text: 'All four, because the membrane is fluid and everything drifts through it' },
        { id: 'c', text: 'Only glucose, because it is a sugar and sugars dissolve in water' },
        { id: 'd', text: 'O2 and CO2, because they are small and nonpolar, so they dissolve through the hydrophobic core', correct: true },
      ],
      expectedAnswer: 'O2 and CO2, because they are small and nonpolar, so they dissolve through the hydrophobic core',
      hints: [
        'The middle of the membrane is a greasy, nonpolar layer. Which of these four are charged or strongly polar?',
        'A charged ion and a large polar sugar are both repelled by that greasy core — they need a channel or carrier protein.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-cholesterol-role',
      kind: 'try_yourself',
      problem:
        'An organism living in cold water has membranes packed with cholesterol wedged between the fatty-acid tails. What does that cholesterol do for the membrane at low temperature?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It holds the tails apart so they cannot pack tightly, keeping the membrane fluid instead of letting it stiffen', correct: true },
        { id: 'b', text: 'It hardens the membrane into a rigid protective wall so the cold cannot damage the cell' },
        { id: 'c', text: 'It forms open channels that let ions cross without a transport protein' },
        { id: 'd', text: 'It replaces the phospholipids entirely, so the membrane is made of cholesterol in the cold' },
      ],
      expectedAnswer:
        'It holds the tails apart so they cannot pack tightly, keeping the membrane fluid instead of letting it stiffen',
      hints: [
        'Ask what cold does to the tails on its own: they slow down and pack together, which would make the membrane stiff.',
        'Cholesterol buffers fluidity in both directions — it restrains the tails when warm and spaces them out when cold.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rigid-wall',
      kind: 'misconception_check',
      question:
        'A student says: "The cell membrane is a solid wall built around the cell, with the proteins glued on top of it to act as doors." Two things are wrong there — what are they?',
      commonErrors: [
        {
          answer: 'The membrane is a solid wall with proteins sitting on its surface',
          misconception:
            'Reading the textbook cross-section as a static structure, so the membrane becomes a rigid barrier and the proteins become fittings attached to it.',
          correctsTo:
            'First, the membrane is FLUID: the phospholipids are not bonded to each other, they drift sideways within their layer, and the proteins drift with them — which is why a punctured membrane reseals instead of cracking. Second, many proteins are not on top but pass all the way THROUGH the bilayer, with hydrophilic ends sitting in the water on each face and a hydrophobic middle anchored in the greasy core. That is exactly what "fluid mosaic" is naming: a moving lipid sheet with proteins embedded through it, like tiles set into the sheet rather than stuck onto it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A phospholipid has a hydrophilic phosphate head and two hydrophobic fatty-acid tails.',
        'With water on both sides, the only stable arrangement is a bilayer: heads out toward the water, tails tucked into the middle — it self-assembles and self-seals.',
        'Fluid mosaic model: the lipids and proteins drift sideways (fluid) and the proteins are scattered through the sheet (mosaic), many spanning it completely.',
        'Protein jobs: channel (tunnel), carrier (bind and shift shape), receptor (catch a signal), marker (cell ID).',
        'Cholesterol buffers fluidity both ways — less runny when warm, less stiff when cold.',
        'Selective permeability: small nonpolar molecules such as O2 and CO2 cross the greasy core freely; charged ions and large polar molecules such as glucose need a protein.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.3', cedTitle: 'The Cell Membrane & the Fluid Mosaic Model' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
