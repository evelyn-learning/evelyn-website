/**
 * Biology — Unit 2 CED 2.4: Passive Transport, Active Transport & Tonicity.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.transport-across-membranes.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U2_TRANSPORT_ACROSS_MEMBRANES: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.transport-across-membranes.v1',
  course: 'Biology',
  cedUnit: 2,
  cedTopic: '2.4',
  cedTitle: 'Passive Transport, Active Transport & Tonicity',
  planId: 'evelyn.hs.bio.transport-across-membranes.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.transport-across-membranes.v1' }],
  theory: [
    { loId: 'bio.transport-across-membranes', kind: 'framework', title: 'The gradient is the engine', content: `THE GRADIENT IS THE ENGINE — a CONCENTRATION GRADIENT is a difference in concentration between two sides of the membrane. Particles are in constant random motion, so they spread out on their own from where they are crowded to where they are not. That is DIFFUSION, and it costs the cell nothing. Small nonpolar molecules like O2 and CO2 slip straight through the phospholipid bilayer this way.` },
    { loId: 'bio.transport-across-membranes', kind: 'framework', title: 'Facilitated diffusion', content: `FACILITATED DIFFUSION — ions and large polar molecules like glucose cannot cross the greasy interior of the bilayer, so they pass through a transport protein instead. This is still PASSIVE: the protein is a doorway, not a pump. It still runs DOWN the gradient, and it still uses NO ATP. "Needs a protein" does not mean "needs energy".` },
    { loId: 'bio.transport-across-membranes', kind: 'framework', title: 'Osmosis is water, not solute', content: `OSMOSIS IS WATER, NOT SOLUTE — osmosis is the diffusion of WATER across a selectively permeable membrane, mostly through channel proteins called aquaporins. When the solute cannot cross, the water moves instead. The one-line rule: WATER CHASES SOLUTE — water moves toward the side with MORE dissolved solute (which is the side with LESS free water).` },
    { loId: 'bio.transport-across-membranes', kind: 'framework', title: 'The three tonicity cases', content: `THE THREE TONICITY CASES — tonicity describes the SOLUTION OUTSIDE compared to the inside of the cell. HYPOTONIC solution = less solute outside than inside, so water moves IN. HYPERTONIC solution = more solute outside than inside, so water moves OUT. ISOTONIC = equal solute, so water moves in and out at equal rates and there is no net change.` },
    { loId: 'bio.transport-across-membranes', kind: 'framework', title: 'Animal cells', content: `ANIMAL CELLS — no cell wall, so volume changes are dangerous. In a HYPOTONIC solution (for example a red blood cell in pure water) water floods in, the cell swells and bursts: LYSIS. In a HYPERTONIC solution (a red blood cell in strong salt water) water leaves and the cell shrivels: CRENATION. In an ISOTONIC solution the cell keeps its normal shape — which is exactly why IV fluid is 0.9% saline rather than pure water.` },
    { loId: 'bio.transport-across-membranes', kind: 'framework', title: 'Plant cells', content: `PLANT CELLS — the rigid cell wall changes the outcome, so the same solution does NOT do the same thing to a plant cell. In a HYPOTONIC solution water enters, the cell swells against the wall and becomes firm: TURGOR PRESSURE. That is the healthy state for a plant, which is why hypotonic is good for a plant and fatal for a red blood cell. In a HYPERTONIC solution water leaves and the membrane pulls away from the wall: PLASMOLYSIS, seen as wilting. Isotonic leaves a plant limp — flaccid — because there is no turgor pressure holding it up.` },
    { loId: 'bio.transport-across-membranes', kind: 'framework', title: 'Active transport uses atp', content: `ACTIVE TRANSPORT USES ATP — sometimes a cell must move a substance the "wrong" way, from low concentration to high, AGAINST the gradient. That never happens on its own, so the cell spends ATP to power a pump protein. The classic case is the SODIUM-POTASSIUM PUMP in nerve cells, which pushes 3 Na+ out and 2 K+ in per ATP, building the very gradient that diffusion keeps trying to erase. The test for active transport is direction, not size: against the gradient means ATP.` },
    { loId: 'bio.transport-across-membranes', kind: 'framework', title: 'Bulk transport', content: `BULK TRANSPORT — molecules too large for any protein move in membrane-wrapped vesicles, which also costs ATP. ENDOCYTOSIS brings material IN by folding the membrane inward around it (a white blood cell swallowing a bacterium). EXOCYTOSIS sends material OUT by fusing a vesicle with the membrane (a nerve cell releasing neurotransmitter, a pancreas cell releasing insulin). Endo = enter, exo = exit.` },
    { loId: 'bio.transport-across-membranes', kind: 'definition', title: 'concentration gradient', content: `a difference in the concentration of a substance between two regions; substances diffuse down it, from high to low.` },
    { loId: 'bio.transport-across-membranes', kind: 'definition', title: 'osmosis', content: `the diffusion of water across a selectively permeable membrane toward the side with more solute.` },
    { loId: 'bio.transport-across-membranes', kind: 'definition', title: 'hypertonic', content: `describes a solution with more dissolved solute than the cell inside it, so water leaves the cell.` },
    { loId: 'bio.transport-across-membranes', kind: 'definition', title: 'turgor pressure', content: `the outward push of water against a plant cell wall that keeps the plant firm and upright.` },
  ],
  methods: [
    {
      title: 'Worked plant in salt',
      steps: [
        `Compare the two solute concentrations explicitly. Outside the cells: 10% solute. Inside the cells: about 1% solute. The outside is the more concentrated side.`,
        `Name the tonicity from the OUTSIDE solution's point of view: more solute outside than inside means the 10% salt solution is HYPERTONIC to the celery cells.`,
        `Apply the rule "water chases solute": water moves toward the side with more solute, so water moves OUT of the celery cells and into the beaker.`,
        `Translate that into the plant-cell outcome: as water leaves, the vacuole shrinks and the membrane pulls away from the cell wall — plasmolysis. Turgor pressure is lost.`,
        `Say what you would see: the celery goes limp and floppy instead of crisp. (Put the same celery in plain water, which is hypotonic, and water moves back in, restoring turgor and crispness.)`,
      ],
      example: { problem: `A strip of celery is placed in a beaker of 10% salt solution. The cells of the celery have an internal solute concentration of about 1%. Predict which way water moves, what the solution is called relative to the cells, and what visibly happens to the celery.`, solution: `The 10% salt solution is hypertonic to the cells, so water moves OUT; the cells plasmolyze, lose turgor pressure, and the celery goes limp.` },
      relatedLoIds: ['bio.transport-across-membranes'],
    },
    {
      title: 'Worked which way does water move',
      steps: [
        `Check what can actually cross. The membrane is permeable to water but NOT to sugar, so the sugar is stuck where it is — the student's move is blocked at step one.`,
        `Note what the student got right: substances DO diffuse down their gradient, and sugar "wants" to go from B to A. It simply cannot get through. When the solute cannot move, the solvent does.`,
        `Apply the osmosis rule to water instead. Water has its own gradient, and it is the mirror image of the solute gradient: side A (5% sugar) is the more watery side, side B (20% sugar) is the less watery side.`,
        `State the direction carefully. Water moves from A to B — from the side with LESS solute toward the side with MORE solute. Side B is hypertonic to side A.`,
        `Read off the observable result: the liquid level on side B RISES and the level on side A falls. The two sugar concentrations move closer together, but by diluting B with water rather than by moving sugar.`,
        `Keep the trap in view: the answer "toward the higher concentration" is only correct when you are tracking WATER. Every particle, water included, still moves down its own gradient — water's gradient just runs opposite to the solute's.`,
      ],
      example: { problem: `Two solutions are separated by a membrane that water can cross but sugar cannot. Side A is 5% sugar and side B is 20% sugar. A student says, "Sugar is more concentrated on side B, so the sugar will diffuse from B to A until both sides are 12.5%." Explain what is wrong and state what actually happens, including what happens to the liquid level on each side.`, solution: `Sugar cannot cross, so nothing equalizes by solute movement. Water moves by osmosis from A (5%) to B (20%) — toward the higher solute concentration — so side B rises and side A falls.` },
      relatedLoIds: ['bio.transport-across-membranes'],
    },
  ],
  pointers: [
    { content: `Every particle moves down ITS OWN gradient, and water's gradient is the mirror image of the solute's. A hypertonic solution has more solute outside, which means LESS free water outside. So water moves from inside (more water) to outside (less water) — OUT of the cell, which then shrivels. The reliable shortcut is "water chases solute": water moves toward the saltier, sweeter, more concentrated side. That is why a salted slug loses water rather than gaining it.`, kind: 'common-error' },
    { content: `Passive transport costs no ATP and runs DOWN the gradient: simple diffusion (O2, CO2 straight through), facilitated diffusion (ions and glucose through a protein), and osmosis (water).`, kind: 'tip' },
    { content: `Osmosis moves WATER, and water chases solute — toward the side with more dissolved solute and less free water.`, kind: 'tip' },
    { content: `Hypotonic outside → water moves IN. Hypertonic outside → water moves OUT. Isotonic → no net movement.`, kind: 'tip' },
    { content: `Animal cells: hypotonic causes lysis, hypertonic causes crenation, isotonic is safe (0.9% saline in an IV). Plant cells: hypotonic gives healthy turgor, hypertonic causes plasmolysis and wilting.`, kind: 'tip' },
    { content: `Active transport goes AGAINST the gradient and therefore spends ATP — the sodium-potassium pump moves 3 Na+ out and 2 K+ in. Endocytosis brings bulk material in; exocytosis sends it out.`, kind: 'tip' },
    { content: `Tonicity always describes the SOLUTION relative to the cell, never the cell relative to the solution. Say "the solution is hypertonic to the cell," not "the cell is hypertonic." Getting the reference point backwards flips your entire water-direction answer.`, kind: 'vocab-note' },
    { content: `Don't apply the solute gradient to water. Water has its own gradient that runs opposite the solute's. "Water chases solute" — it moves TOWARD the saltier side because that side has less free water.`, kind: 'common-error' },
    { content: `"Needs a protein" ≠ "needs ATP." Facilitated diffusion uses a channel or carrier protein and is still 100% passive. The only test for active transport is direction: against the gradient means ATP.`, kind: 'gotcha' },
    { content: `Same solution, opposite verdict: hypotonic is healthy for a plant cell (turgor) but lethal for a red blood cell (lysis). Never answer "the cell bursts" without first checking whether there's a cell wall.`, kind: 'edge-case' },
    { content: `Isotonic is the *safe* state for an animal cell but the *limp* (flaccid) state for a plant. Isotonic never means "no water moves" — water crosses both ways at equal rates, so there is no NET change.`, kind: 'edge-case' },
    { content: `Keep the shrivel words straight: animal cell shrinking = crenation; plant cell membrane pulling away from its wall = plasmolysis. Both come from a hypertonic solution, but they aren't interchangeable terms.`, kind: 'vocab-note' },
    { content: `In osmosis problems, first ask what can actually cross the membrane. If the solute is impermeable, it does NOT redistribute — concentrations equalize only by water diluting the concentrated side, which raises that side's liquid level.`, kind: 'tip' },
    { content: `Endo = enter, exo = exit — and BOTH cost ATP. Bulk transport is never passive, even when the vesicle contents are moving down a gradient.`, kind: 'gotcha' },
  ],
};
