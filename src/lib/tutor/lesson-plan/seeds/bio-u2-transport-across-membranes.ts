/**
 * Biology — Cells: Passive Transport, Active Transport & Tonicity.
 *
 * The membrane-transport plan for the HS Biology fan-out (NGSS HS-LS1-3).
 * Tonicity is the centerpiece: nearly every error in this unit is a
 * direction error — students reverse which way water moves, or attach the
 * label to the wrong side of the membrane — so the concept segment is
 * organized around "water chases solute" and the cell-by-cell outcomes.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U2_TRANSPORT_ACROSS_MEMBRANES: LessonPlan = {
  id: 'evelyn.hs.bio.transport-across-membranes.v1',
  title: 'Passive Transport, Active Transport & Tonicity',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.transport-across-membranes',
      standard: 'BIO-2.4',
      description:
        'Predict the movement of molecules and water across a selectively permeable membrane by distinguishing diffusion, facilitated diffusion, osmosis and ATP-powered active transport, and by determining whether a surrounding solution is hypotonic, hypertonic or isotonic to a given cell (NGSS HS-LS1-3).',
    },
  ],
  prerequisites: ['bio.cell-membrane-structure'],
  followUps: ['bio.atp-and-energy'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame membrane transport as the everyday physics behind wilting plants, IV bags and salted slugs.',
      script:
        'Pour salt on a slug and it shrivels. Forget to water a houseplant and it droops, then perks back up an hour after you water it. A hospital hangs a bag of 0.9% saline — not pure water — into a patient\'s vein, because pure water would burst their red blood cells. A goldfish would die in the ocean and a cod would die in a lake. Every one of those is the same story: water moving across a membrane, always in one predictable direction. By the end of this lesson you will be able to call that direction every time.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-transport-and-tonicity',
      kind: 'concept',
      goal: 'Passive transport (diffusion, facilitated diffusion, osmosis), the three tonicity cases with animal and plant outcomes, and active transport with ATP.',
      keyIdeas: [
        'THE GRADIENT IS THE ENGINE — a CONCENTRATION GRADIENT is a difference in concentration between two sides of the membrane. Particles are in constant random motion, so they spread out on their own from where they are crowded to where they are not. That is DIFFUSION, and it costs the cell nothing. Small nonpolar molecules like O2 and CO2 slip straight through the phospholipid bilayer this way.',
        'FACILITATED DIFFUSION — ions and large polar molecules like glucose cannot cross the greasy interior of the bilayer, so they pass through a transport protein instead. This is still PASSIVE: the protein is a doorway, not a pump. It still runs DOWN the gradient, and it still uses NO ATP. "Needs a protein" does not mean "needs energy".',
        'OSMOSIS IS WATER, NOT SOLUTE — osmosis is the diffusion of WATER across a selectively permeable membrane, mostly through channel proteins called aquaporins. When the solute cannot cross, the water moves instead. The one-line rule: WATER CHASES SOLUTE — water moves toward the side with MORE dissolved solute (which is the side with LESS free water).',
        'THE THREE TONICITY CASES — tonicity describes the SOLUTION OUTSIDE compared to the inside of the cell. HYPOTONIC solution = less solute outside than inside, so water moves IN. HYPERTONIC solution = more solute outside than inside, so water moves OUT. ISOTONIC = equal solute, so water moves in and out at equal rates and there is no net change.',
        'ANIMAL CELLS — no cell wall, so volume changes are dangerous. In a HYPOTONIC solution (for example a red blood cell in pure water) water floods in, the cell swells and bursts: LYSIS. In a HYPERTONIC solution (a red blood cell in strong salt water) water leaves and the cell shrivels: CRENATION. In an ISOTONIC solution the cell keeps its normal shape — which is exactly why IV fluid is 0.9% saline rather than pure water.',
        'PLANT CELLS — the rigid cell wall changes the outcome, so the same solution does NOT do the same thing to a plant cell. In a HYPOTONIC solution water enters, the cell swells against the wall and becomes firm: TURGOR PRESSURE. That is the healthy state for a plant, which is why hypotonic is good for a plant and fatal for a red blood cell. In a HYPERTONIC solution water leaves and the membrane pulls away from the wall: PLASMOLYSIS, seen as wilting. Isotonic leaves a plant limp — flaccid — because there is no turgor pressure holding it up.',
        'ACTIVE TRANSPORT USES ATP — sometimes a cell must move a substance the "wrong" way, from low concentration to high, AGAINST the gradient. That never happens on its own, so the cell spends ATP to power a pump protein. The classic case is the SODIUM-POTASSIUM PUMP in nerve cells, which pushes 3 Na+ out and 2 K+ in per ATP, building the very gradient that diffusion keeps trying to erase. The test for active transport is direction, not size: against the gradient means ATP.',
        'BULK TRANSPORT — molecules too large for any protein move in membrane-wrapped vesicles, which also costs ATP. ENDOCYTOSIS brings material IN by folding the membrane inward around it (a white blood cell swallowing a bacterium). EXOCYTOSIS sends material OUT by fusing a vesicle with the membrane (a nerve cell releasing neurotransmitter, a pancreas cell releasing insulin). Endo = enter, exo = exit.',
      ],
      vocabulary: [
        { term: 'concentration gradient', definition: 'a difference in the concentration of a substance between two regions; substances diffuse down it, from high to low.' },
        { term: 'osmosis', definition: 'the diffusion of water across a selectively permeable membrane toward the side with more solute.' },
        { term: 'hypertonic', definition: 'describes a solution with more dissolved solute than the cell inside it, so water leaves the cell.' },
        { term: 'turgor pressure', definition: 'the outward push of water against a plant cell wall that keeps the plant firm and upright.' },
      ],
      suggestedTools: ['show_diagram', 'show_labeled_image', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-plant-in-salt',
      kind: 'worked_example',
      problem:
        'A strip of celery is placed in a beaker of 10% salt solution. The cells of the celery have an internal solute concentration of about 1%. Predict which way water moves, what the solution is called relative to the cells, and what visibly happens to the celery.',
      steps: [
        'Compare the two solute concentrations explicitly. Outside the cells: 10% solute. Inside the cells: about 1% solute. The outside is the more concentrated side.',
        'Name the tonicity from the OUTSIDE solution\'s point of view: more solute outside than inside means the 10% salt solution is HYPERTONIC to the celery cells.',
        'Apply the rule "water chases solute": water moves toward the side with more solute, so water moves OUT of the celery cells and into the beaker.',
        'Translate that into the plant-cell outcome: as water leaves, the vacuole shrinks and the membrane pulls away from the cell wall — plasmolysis. Turgor pressure is lost.',
        'Say what you would see: the celery goes limp and floppy instead of crisp. (Put the same celery in plain water, which is hypotonic, and water moves back in, restoring turgor and crispness.)',
      ],
      answer: 'The 10% salt solution is hypertonic to the cells, so water moves OUT; the cells plasmolyze, lose turgor pressure, and the celery goes limp.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-which-way-does-water-move',
      kind: 'worked_example',
      problem:
        'Two solutions are separated by a membrane that water can cross but sugar cannot. Side A is 5% sugar and side B is 20% sugar. A student says, "Sugar is more concentrated on side B, so the sugar will diffuse from B to A until both sides are 12.5%." Explain what is wrong and state what actually happens, including what happens to the liquid level on each side.',
      steps: [
        'Check what can actually cross. The membrane is permeable to water but NOT to sugar, so the sugar is stuck where it is — the student\'s move is blocked at step one.',
        'Note what the student got right: substances DO diffuse down their gradient, and sugar "wants" to go from B to A. It simply cannot get through. When the solute cannot move, the solvent does.',
        'Apply the osmosis rule to water instead. Water has its own gradient, and it is the mirror image of the solute gradient: side A (5% sugar) is the more watery side, side B (20% sugar) is the less watery side.',
        'State the direction carefully. Water moves from A to B — from the side with LESS solute toward the side with MORE solute. Side B is hypertonic to side A.',
        'Read off the observable result: the liquid level on side B RISES and the level on side A falls. The two sugar concentrations move closer together, but by diluting B with water rather than by moving sugar.',
        'Keep the trap in view: the answer "toward the higher concentration" is only correct when you are tracking WATER. Every particle, water included, still moves down its own gradient — water\'s gradient just runs opposite to the solute\'s.',
      ],
      answer: 'Sugar cannot cross, so nothing equalizes by solute movement. Water moves by osmosis from A (5%) to B (20%) — toward the higher solute concentration — so side B rises and side A falls.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-rbc-in-salt',
      kind: 'try_yourself',
      problem:
        'A red blood cell, whose interior is equivalent to about 0.9% salt, is dropped into a beaker of 5% salt solution. What is the solution relative to the cell, and what happens to the cell?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Hypotonic — water moves into the cell and it bursts (lysis)' },
        { id: 'b', text: 'Isotonic — water moves in and out equally and the cell keeps its normal shape' },
        { id: 'c', text: 'Hypertonic — water moves out of the cell and it shrivels (crenation)', correct: true },
        { id: 'd', text: 'Hypertonic — salt is pumped into the cell using ATP and the cell swells' },
      ],
      expectedAnswer: 'Hypertonic — water moves out of the cell and it shrivels (crenation)',
      hints: [
        'Compare the two numbers first: 0.9% solute inside versus 5% solute outside. Which side has more dissolved solute?',
        'Water chases solute — it moves toward the more concentrated side. If that side is outside the cell, water leaves, and an animal cell with no wall shrivels.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-osmosis-no-atp',
      kind: 'try_yourself',
      problem:
        'Water enters a root hair cell from the surrounding soil water by osmosis. Which statement correctly describes the energy cost of this movement?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'No ATP is required — osmosis is passive, because water moves down its own concentration gradient', correct: true },
        { id: 'b', text: 'ATP is required, because water must be pulled through aquaporin proteins' },
        { id: 'c', text: 'ATP is required, because water is moving toward the higher solute concentration' },
        { id: 'd', text: 'No ATP is required, because water is being pumped against its gradient for free' },
      ],
      expectedAnswer: 'No ATP is required — osmosis is passive, because water moves down its own concentration gradient',
      hints: [
        'Ask the one question that decides energy cost: is the substance moving DOWN its own gradient or AGAINST it?',
        'Moving through a protein channel does not make transport active — facilitated diffusion and osmosis both use proteins and both are passive. Only movement against a gradient costs ATP.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-plant-vs-animal',
      kind: 'try_yourself',
      problem:
        'A plant cell and a red blood cell are both placed in distilled (pure) water, which contains essentially 0% solute. What happens to each?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Water leaves both cells; the plant cell plasmolyzes and the red blood cell crenates' },
        { id: 'b', text: 'Water enters both cells; the plant cell bursts while the red blood cell becomes turgid' },
        { id: 'c', text: 'Neither cell changes, because pure water contains no solute to drive osmosis' },
        { id: 'd', text: 'Water enters both cells; the plant cell becomes turgid and the red blood cell bursts', correct: true },
      ],
      expectedAnswer: 'Water enters both cells; the plant cell becomes turgid and the red blood cell bursts',
      hints: [
        'Both cells are in the same solution, so the direction of water movement is the same for both. With 0% solute outside and solute inside, which way does water go?',
        'The difference is the cell wall. Decide which cell can resist the swelling and which one has nothing holding it together.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-water-follows-solute',
      kind: 'misconception_check',
      question:
        'A student says: "A cell is put in a hypertonic solution. Hypertonic means more solute outside, and things always diffuse from high to low — so water moves from outside into the cell to dilute it." What went wrong?',
      commonErrors: [
        {
          answer: 'Water moves into a cell placed in a hypertonic solution',
          misconception: 'Applying the SOLUTE gradient to the water. The student reads "high concentration outside" and sends everything, water included, from outside to inside — instead of asking where water itself is more concentrated.',
          correctsTo:
            'Every particle moves down ITS OWN gradient, and water\'s gradient is the mirror image of the solute\'s. A hypertonic solution has more solute outside, which means LESS free water outside. So water moves from inside (more water) to outside (less water) — OUT of the cell, which then shrivels. The reliable shortcut is "water chases solute": water moves toward the saltier, sweeter, more concentrated side. That is why a salted slug loses water rather than gaining it.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Passive transport costs no ATP and runs DOWN the gradient: simple diffusion (O2, CO2 straight through), facilitated diffusion (ions and glucose through a protein), and osmosis (water).',
        'Osmosis moves WATER, and water chases solute — toward the side with more dissolved solute and less free water.',
        'Hypotonic outside → water moves IN. Hypertonic outside → water moves OUT. Isotonic → no net movement.',
        'Animal cells: hypotonic causes lysis, hypertonic causes crenation, isotonic is safe (0.9% saline in an IV). Plant cells: hypotonic gives healthy turgor, hypertonic causes plasmolysis and wilting.',
        'Active transport goes AGAINST the gradient and therefore spends ATP — the sodium-potassium pump moves 3 Na+ out and 2 K+ in. Endocytosis brings bulk material in; exocytosis sends it out.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Passive Transport, Active Transport & Tonicity' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
