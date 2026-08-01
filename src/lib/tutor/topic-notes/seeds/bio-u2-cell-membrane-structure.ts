/**
 * Biology — Unit 2 CED 2.3: The Cell Membrane & the Fluid Mosaic Model.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.hs.bio.cell-membrane-structure.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_BIO_U2_CELL_MEMBRANE_STRUCTURE: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.bio.cell-membrane-structure.v1',
  course: 'Biology',
  cedUnit: 2,
  cedTopic: '2.3',
  cedTitle: 'The Cell Membrane & the Fluid Mosaic Model',
  planId: 'evelyn.hs.bio.cell-membrane-structure.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-01',
  sources: [{ type: 'plan', planId: 'evelyn.hs.bio.cell-membrane-structure.v1' }],
  theory: [
    { loId: 'bio.cell-membrane-structure', kind: 'framework', title: 'The phospholipid', content: `THE PHOSPHOLIPID — one molecule with two personalities. A PHOSPHATE HEAD that is polar and HYDROPHILIC (water-attracting), attached to two FATTY-ACID TAILS that are nonpolar and HYDROPHOBIC (water-avoiding). Picture a lollipop with two wiggly strings hanging off it.` },
    { loId: 'bio.cell-membrane-structure', kind: 'framework', title: 'Why it self-assembles', content: `WHY IT SELF-ASSEMBLES — a cell has water on BOTH sides: cytoplasm inside, fluid outside. The only arrangement that puts every head in water and hides every tail from it is two sheets placed tail-to-tail: heads facing OUT toward the water on each surface, tails tucked INTO the middle. Nothing pushes them there — water does the work, so a torn membrane reseals itself.` },
    { loId: 'bio.cell-membrane-structure', kind: 'framework', title: 'The bilayer sandwich, named in order', content: `THE BILAYER SANDWICH, NAMED IN ORDER — outside water, a layer of heads, a greasy tail-to-tail core, a second layer of heads, inside water. That greasy core is the whole story: it is the barrier, and it is only about 5 nanometers thick.` },
    { loId: 'bio.cell-membrane-structure', kind: 'framework', title: 'The fluid mosaic model', content: `THE FLUID MOSAIC MODEL — FLUID because phospholipids drift sideways within their own layer, swapping neighbors millions of times a second; the membrane behaves like a soap film, not a brick wall. MOSAIC because proteins are scattered through it like tiles of different shapes, not laid out in a repeating pattern.` },
    { loId: 'bio.cell-membrane-structure', kind: 'framework', title: 'The protein jobs', content: `THE PROTEIN JOBS — CHANNEL proteins form a water-lined tunnel a specific ion or water molecule can slip through; CARRIER proteins bind one molecule (glucose, say), change shape, and release it on the far side; RECEPTOR proteins stick out and bind a signal such as a hormone, passing the message inward without the hormone entering; MARKER proteins (usually with a sugar chain attached, making them glycoproteins) act as an ID badge so your immune system reads the cell as yours.` },
    { loId: 'bio.cell-membrane-structure', kind: 'framework', title: 'Cholesterol as a buffer', content: `CHOLESTEROL AS A BUFFER — cholesterol molecules wedge between the tails and work in BOTH directions: when it is warm they restrain the tails and keep the membrane from getting too runny; when it is cold they hold the tails apart and keep the membrane from freezing solid. It is a thermostat for fluidity, not glue and not a stiffener.` },
    { loId: 'bio.cell-membrane-structure', kind: 'framework', title: 'Selective permeability comes from the greasy core', content: `SELECTIVE PERMEABILITY COMES FROM THE GREASY CORE — small NONPOLAR molecules dissolve straight through it and cross freely: O2, CO2, and small lipids. Anything CHARGED or large and POLAR is repelled by that core and needs a protein door: sodium and potassium ions, glucose, amino acids. Charge matters more than size — a tiny sodium ion is blocked while a bigger CO2 molecule sails through.` },
    { loId: 'bio.cell-membrane-structure', kind: 'framework', title: 'The classic errors to avoid', content: `THE CLASSIC ERRORS TO AVOID — (1) the tails do NOT face outward; heads face the water. (2) The membrane is not a rigid wall; it is fluid and self-sealing. (3) Proteins are not sitting on top like decorations; many span the full bilayer with their own hydrophilic ends in the water and a hydrophobic middle in the core. (4) Selective does not mean the membrane chooses — it is chemistry, not a decision.` },
    { loId: 'bio.cell-membrane-structure', kind: 'definition', title: 'phospholipid bilayer', content: `two sheets of phospholipids arranged tail-to-tail, heads out toward water on both surfaces.` },
    { loId: 'bio.cell-membrane-structure', kind: 'definition', title: 'hydrophobic', content: `water-avoiding; describes the nonpolar fatty-acid tails that hide in the membrane core.` },
    { loId: 'bio.cell-membrane-structure', kind: 'definition', title: 'fluid mosaic model', content: `the model of the membrane as a drifting lipid sheet with proteins scattered through it like tiles.` },
    { loId: 'bio.cell-membrane-structure', kind: 'definition', title: 'selectively permeable', content: `lets some substances cross freely while blocking others, based on their size and charge.` },
  ],
  methods: [
    {
      title: 'Worked why tails inward',
      steps: [
        `Label the two ends of one phospholipid: a polar phosphate head that is attracted to water, and two nonpolar fatty-acid tails that are repelled by it.`,
        `Note where the water is. In a closed sphere there is water on the outside AND trapped water on the inside — so the wall has water pressing on both of its faces.`,
        `Test the wrong arrangement first: if the tails faced outward, every tail would sit in contact with water, which is the arrangement water forces apart. Those molecules get pushed and re-shuffled until the tails are hidden.`,
        `Test the surviving arrangement: two layers placed tail-to-tail. Now every head touches water (outer heads face the outside water, inner heads face the trapped water) and every tail touches only other tails.`,
        `That is the only arrangement that satisfies both ends at once, so it is the one that persists — the bilayer is the stable result, not something assembled by the cell.`,
      ],
      example: { problem: `Purified phospholipids are shaken into a beaker of water. Without any cell or machinery present, they spontaneously form closed spheres whose wall is two molecules thick. Explain the orientation of the molecules in that wall, and why no other arrangement survives.`, solution: `Heads face outward into the water on both surfaces and the tails point inward toward each other, forming a greasy core — the only arrangement that keeps every hydrophilic head in water and every hydrophobic tail out of it.` },
      relatedLoIds: ['bio.cell-membrane-structure'],
    },
    {
      title: 'Worked size vs charge',
      steps: [
        `State the rule the student used: permeability depends on size alone. Then find the property that rule ignores — charge and polarity.`,
        `Name the barrier precisely. The middle of the membrane is a layer of nonpolar fatty-acid tails: a greasy, water-free zone.`,
        `Check CO2 against that barrier: CO2 is small AND nonpolar, so it dissolves into a greasy layer the same way oil mixes with oil. It slips through with no help.`,
        `Check Na+ against the same barrier: a sodium ion carries a full positive charge and drags a shell of water molecules with it. Entering the greasy core would mean stripping that water off and pushing a charge into a nonpolar zone — energetically expensive, so it is turned away despite its tiny size.`,
        `Repair the rule: the membrane sorts first by charge and polarity, and only then by size. Charged and large polar particles such as Na+, K+, and glucose need a channel or carrier protein; small nonpolar ones such as O2 and CO2 do not.`,
      ],
      example: { problem: `A student predicts: "Smaller molecules always cross the membrane more easily, so a sodium ion (Na+) — one of the smallest particles in the cell — should cross faster than CO2, which is a three-atom molecule." Measurements show the opposite: CO2 crosses freely and Na+ barely crosses at all without a protein. Where does the prediction go wrong?`, solution: `Size is the wrong first filter. The hydrophobic core blocks charged and polar particles, so the charged Na+ is excluded while the small nonpolar CO2 dissolves straight through.` },
      relatedLoIds: ['bio.cell-membrane-structure'],
    },
  ],
  pointers: [
    { content: `First, the membrane is FLUID: the phospholipids are not bonded to each other, they drift sideways within their layer, and the proteins drift with them — which is why a punctured membrane reseals instead of cracking. Second, many proteins are not on top but pass all the way THROUGH the bilayer, with hydrophilic ends sitting in the water on each face and a hydrophobic middle anchored in the greasy core. That is exactly what "fluid mosaic" is naming: a moving lipid sheet with proteins embedded through it, like tiles set into the sheet rather than stuck onto it.`, kind: 'common-error' },
    { content: `A phospholipid has a hydrophilic phosphate head and two hydrophobic fatty-acid tails.`, kind: 'tip' },
    { content: `With water on both sides, the only stable arrangement is a bilayer: heads out toward the water, tails tucked into the middle — it self-assembles and self-seals.`, kind: 'tip' },
    { content: `Fluid mosaic model: the lipids and proteins drift sideways (fluid) and the proteins are scattered through the sheet (mosaic), many spanning it completely.`, kind: 'tip' },
    { content: `Protein jobs: channel (tunnel), carrier (bind and shift shape), receptor (catch a signal), marker (cell ID).`, kind: 'tip' },
    { content: `Cholesterol buffers fluidity both ways — less runny when warm, less stiff when cold.`, kind: 'tip' },
    { content: `Selective permeability: small nonpolar molecules such as O2 and CO2 cross the greasy core freely; charged ions and large polar molecules such as glucose need a protein.`, kind: 'tip' },
    { content: `Charge and polarity are the FIRST filter, size is second. Na+ is tinier than CO2 yet can't cross without a protein. Never answer "it's small, so it diffuses through."`, kind: 'common-error' },
    { content: `Say "hydrophilic heads face the water on BOTH surfaces" — not just "heads face out." The inner heads face cytoplasm, which is also water. Drawings that show only the outer heads in water lose the point.`, kind: 'vocab-note' },
    { content: `Cholesterol is a two-way buffer, not a stiffener. Warm = restrains tails (less runny); cold = wedges tails apart (less stiff). Writing only "cholesterol makes the membrane rigid" is half wrong.`, kind: 'gotcha' },
    { content: `"Selectively permeable" describes chemistry, not choice. Don't write that the membrane "decides" or "lets in what the cell needs" — the greasy core simply repels charge and polarity.`, kind: 'vocab-note' },
    { content: `Draw transport proteins spanning the FULL bilayer, not perched on the surface. A membrane-spanning protein has hydrophilic ends in the water and a hydrophobic middle matching the tail core.`, kind: 'common-error' },
    { content: `Channel ≠ carrier. Channel = open water-lined tunnel, substance slips through. Carrier = binds the molecule and changes shape to release it on the other side. Glucose uses a carrier; ions typically use channels.`, kind: 'vocab-note' },
    { content: `The bilayer self-assembles — no enzyme, no energy, no cell machinery builds it. That's also why a punctured membrane reseals rather than cracking like a wall.`, kind: 'edge-case' },
    { content: `Quick self-check on any 'can it cross?' question: is it charged? If yes → protein needed, full stop. If no, is it large and polar (glucose, amino acids)? If yes → protein needed. Otherwise (O2, CO2, small lipids) → straight through.`, kind: 'tip' },
  ],
};
