/**
 * Grade 7 Science — Unit 4 CED 4.4: Tracing Matter & Energy Through an Organism.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.matter-and-energy-in-organisms.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U4_MATTER_AND_ENERGY_IN_ORGANISMS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.matter-and-energy-in-organisms.v1',
  course: 'Grade 7 Science',
  cedUnit: 4,
  cedTopic: '4.4',
  cedTitle: 'Tracing Matter & Energy Through an Organism',
  planId: 'evelyn.ms.m7sci.matter-and-energy-in-organisms.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.matter-and-energy-in-organisms.v1' }],
  theory: [
    { loId: 'm7sci.matter-and-energy-in-organisms', content: `THERE ARE TWO ACCOUNT BOOKS, AND THEY NEVER MIX. Book one is MATTER, which means the atoms. Book two is ENERGY. Both books obey a rule that nothing is created and nothing is destroyed, but the two behave very differently after that, and almost every mistake in this lesson comes from writing an entry in the wrong book.` },
    { loId: 'm7sci.matter-and-energy-in-organisms', content: `MATTER IS CONSERVED: ATOMS ARE REARRANGED, NEVER MADE OR DESTROYED. Food molecules are broken into small pieces, and those pieces are put back together into new molecules that become the body. The atoms in a sandwich end up in muscle, in bone, in exhaled carbon dioxide and in water. WRONG: "The food is used up and disappears." CORRECT: "Every atom of the food is still somewhere, and you can point at where."` },
    { loId: 'm7sci.matter-and-energy-in-organisms', content: `THE ATOMS FROM A MEAL HAVE THREE DESTINATIONS, and a full trace names all three. Some are rearranged into new molecules that build and repair the body. Some leave in the carbon dioxide you breathe out. Some leave in water and in waste. Nothing is left over, because nothing vanished. A tree makes the same point in a way that surprises people: most of the material in new wood came from carbon dioxide in the air and from water, not from the soil.` },
    { loId: 'm7sci.matter-and-energy-in-organisms', content: `ENERGY IS RELEASED, NOT CREATED. The energy was already stored in the food molecules. Rearranging those molecules during cellular respiration RELEASES that stored energy, and the cell transfers it into a usable form. A cell does not manufacture energy any more than a wallet manufactures money.` },
    { loId: 'm7sci.matter-and-energy-in-organisms', content: `ENERGY FLOWS THROUGH AND LEAVES AS HEAT; MATTER CYCLES. Released energy is transferred to moving muscles, to building new molecules, and to keeping the body warm, and it keeps spreading out into the surroundings as heat. It does not come back. That is exactly why an animal has to eat again tomorrow even though its atoms are still there. WRONG: "The body recycles its energy the way it recycles its atoms." CORRECT: "Matter cycles. Energy flows one way and leaves as heat."` },
    { loId: 'm7sci.matter-and-energy-in-organisms', kind: 'framework', title: 'The tracing procedure', content: `THE TRACING PROCEDURE — pick ONE atom or ONE molecule, follow it one step at a time, and at every step say out loud where it is now. Then do the same thing separately for the energy. The rule that keeps a trace honest is this: an atom is never allowed to turn into energy, and energy is never allowed to turn into an atom. If a step in your trace does either one, the step is wrong.` },
    { loId: 'm7sci.matter-and-energy-in-organisms', kind: 'definition', title: 'matter', content: 'anything made of atoms; it has mass and takes up space.' },
    { loId: 'm7sci.matter-and-energy-in-organisms', kind: 'definition', title: 'conserved', content: 'kept at the same total; none is created and none is destroyed.' },
    { loId: 'm7sci.matter-and-energy-in-organisms', kind: 'definition', title: 'rearranged', content: `the same atoms taken apart and joined together in a new way to make different molecules.` },
    { loId: 'm7sci.matter-and-energy-in-organisms', kind: 'definition', title: 'cellular respiration', content: `the process in cells that rearranges food molecules and releases the energy stored in them.` },
    { loId: 'm7sci.matter-and-energy-in-organisms', kind: 'definition', title: 'heat', content: `energy that spreads from a warmer thing to a cooler one; the form energy ends up in as it leaves an organism.` },
  ],
  methods: [
    {
      title: 'Worked trace the atoms',
      steps: [
        `Start where the atoms start. The sandwich is made of large molecules: starch from the bread, protein and fat from the peanut butter. Every one of those molecules is a group of atoms joined together.`,
        `Step one, digestion. In the stomach and intestine the large molecules are broken into small ones. No atom is lost here. Breaking a molecule apart does not destroy any of its atoms, exactly the way taking apart a tower of blocks does not destroy any blocks.`,
        `Step two, absorption. The small molecules pass through the wall of the intestine into the blood, and the blood carries them to cells all over the body.`,
        `Step three, inside a cell, the atoms split into two paths. On the first path they are REARRANGED into new molecules that the body needs, and those molecules become new muscle, new bone and new skin. That is the growing. The atoms that were in the peanut butter are now atoms of the student.`,
        `On the second path the small molecules go through cellular respiration and are rearranged into carbon dioxide and water. The carbon atoms leave the body inside carbon dioxide, breathed out. The rest leaves as water. Some atoms never got absorbed at all and leave as solid waste.`,
        `Now check the books. Every atom from the sandwich is accounted for: built into the body, breathed out, or passed out. Nothing was created and nothing was destroyed. Notice what was NOT said in any step: no atom turned into energy. The atoms only ever moved and got rearranged.`,
      ],
      example: { problem: `A twelve-year-old eats a peanut butter sandwich and grows a little taller that month. Trace the ATOMS from that sandwich. Where do they end up?`, solution: `The atoms are rearranged, not used up. Some become new body molecules, so the student grows. Some leave as exhaled carbon dioxide, some as water, and some as solid waste. Every atom is still somewhere.` },
      relatedLoIds: ['m7sci.matter-and-energy-in-organisms'],
    },
    {
      title: 'Worked trace the energy',
      steps: [
        `Start where the energy starts. Energy is already stored in the sandwich, held in the way the food molecules are put together. It got there from a plant, which captured light energy during photosynthesis and stored it in sugar. Nobody has to make it now.`,
        `Step one, release. Inside the cells, cellular respiration rearranges the food molecules, and that rearrangement RELEASES the stored energy. Say released, not made. The energy was there the whole time.`,
        `Step two, transfer. The cell transfers that energy into a usable form and spends it on jobs: contracting muscles so the student can walk to school, and building the new molecules that make the student taller.`,
        `Step three, where it goes next. Every one of those jobs gives off some energy as heat. Working muscles warm up. Building molecules warms the cell. The heat spreads into the body, and the body gives off heat to the air around it, which is why a crowded room gets warm.`,
        `Step four, the ending. Sooner or later all of that energy has left the student as heat spreading into the surroundings. It does not get collected back up and used again. This is the reason a person has to eat every day: the atoms are still in the body, but the energy has gone.`,
        `Compare the two traces side by side. The atoms stayed in the world, moved around and got rearranged, and many of them are still in the student. The energy passed through the student and left as heat. Two account books, two different endings, and at no point did one book pay into the other.`,
      ],
      example: { problem: `Now trace the ENERGY from the same sandwich, keeping it in its own account book. Where does that energy end up?`, solution: `The energy was stored in the food, released by cellular respiration, transferred to movement and to building new molecules, and it leaves the body as heat spreading into the surroundings. It is not stored up forever and it is not recycled.` },
      relatedLoIds: ['m7sci.matter-and-energy-in-organisms'],
    },
  ],
  pointers: [
    { content: `Students often say "The food gets used up and disappears." — Nothing disappears. The food molecules are broken apart and their atoms are rearranged into new molecules, and every one of those atoms is still somewhere. WRONG: "It got used up." CORRECT: "Some atoms were built into the body, some left as carbon dioxide that was breathed out, and some left as water and waste." The habit that fixes this permanently is to refuse to accept the words used up in a trace and to ask instead: where is that atom right now?`, kind: 'common-error' },
    { content: `Students often say "The food turns into the energy your body needs." — Matter does not become energy in your body, ever. The energy was ALREADY STORED in the food molecules, and rearranging those molecules RELEASES it. The atoms and the energy travel separate paths from that moment on: the atoms are rearranged and stay in the world, and the energy is transferred to the body and then leaves as heat. WRONG: "Food turns into energy." CORRECT: "Food molecules are rearranged, and that rearranging releases the energy stored in them."`, kind: 'common-error' },
    { content: `Keep two account books. Matter means the atoms. Energy is separate. Never let one become the other.`, kind: 'tip' },
    { content: `Matter is conserved: atoms are rearranged, never created and never destroyed. Food is not used up.`, kind: 'tip' },
    { content: `Atoms from a meal have three destinations: built into the body, breathed out as carbon dioxide, or leaving as water and waste.`, kind: 'tip' },
    { content: `Most of the material in new wood came from carbon dioxide in the air and from water, not from the soil.`, kind: 'tip' },
    { content: `Energy is RELEASED from food molecules by cellular respiration, not made. It was stored there already.`, kind: 'tip' },
    { content: `Energy is transferred to movement and to building molecules, and it leaves the organism as heat. Matter cycles; energy flows one way.`, kind: 'tip' },
    { content: `Losing weight means the matter left, mostly as exhaled carbon dioxide and as water. It did not vanish.`, kind: 'tip' },
    { content: `To trace anything, pick one atom or one portion of energy and say where it is at every single step.`, kind: 'tip' },
    { content: `Never write "food turns into energy." Food molecules are **rearranged**, and that rearranging **releases** energy that was already stored in them. An atom never becomes energy, and energy never becomes an atom.`, kind: 'common-error' },
    { content: `Ban the words "used up" and "disappears" from any matter trace. If you catch yourself writing them, stop and answer: where is that atom right now? Every atom is in the body, in exhaled carbon dioxide, or in water and waste.`, kind: 'tip' },
    { content: `Say cells **release** energy, not make, produce, or create it. A cell is like a wallet, not a money printer — it can only spend what was already put in by the plant during photosynthesis.`, kind: 'vocab-note' },
    { content: `Matter cycles; energy flows one way and leaves as heat. Don't say the body "recycles" or "stores up" its energy the way it keeps its atoms. That one-way exit is the reason you have to eat again tomorrow.`, kind: 'gotcha' },
    { content: `A full matter trace names **all three** destinations: built into the body, breathed out as carbon dioxide, and out as water and waste. Stopping after "it becomes muscle" leaves atoms unaccounted for.`, kind: 'common-error' },
    { content: `Weight loss question? The lost matter mostly left as carbon dioxide breathed out, plus some water. Not "burned off," not sweated out, not vanished. Fat atoms leave through the lungs.`, kind: 'edge-case' },
    { content: `A tree's new wood comes mostly from carbon dioxide in the air and from water — not from soil. Plants don't eat dirt. Test yourself: if soil built the tree, the hole around it would get huge.`, kind: 'gotcha' },
    { content: `Heat is where energy **ends**, not a place matter goes. Atoms don't leave as heat, and heat isn't a leftover substance. Keep heat entirely in the energy book.`, kind: 'vocab-note' },
  ],
};
