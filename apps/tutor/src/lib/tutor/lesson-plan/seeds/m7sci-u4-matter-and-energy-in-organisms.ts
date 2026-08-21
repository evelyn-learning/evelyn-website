/**
 * Grade 7 Science (Life Science) — Tracing Matter & Energy Through an Organism.
 *
 * The synthesis row of Unit 4 (NGSS MS-LS1-7). Photosynthesis and cellular
 * respiration have each been taught on their own; this row closes the
 * bookkeeping by making the student trace ONE atom and ONE portion of energy
 * step by step and say, at each step, where it went.
 *
 * The whole lesson rests on keeping two account books separate:
 *   MATTER is conserved and cycles  — atoms are only rearranged.
 *   ENERGY is transferred and flows — it is released, passed along, and
 *   eventually leaves as heat.
 * Nothing in this file may let matter become energy or energy become matter.
 * That is the defect this lesson exists to prevent, so there is no mention of
 * mass changing into energy anywhere, in any form.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every pathway
 * here is written out in words, and every item is solvable from the text
 * printed inside it. Never write "see the diagram above".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U4_MATTER_AND_ENERGY_IN_ORGANISMS: LessonPlan = {
  id: 'evelyn.ms.m7sci.matter-and-energy-in-organisms.v1',
  title: 'Tracing Matter & Energy Through an Organism',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.matter-and-energy-in-organisms',
      standard: 'M7SCI-4.4',
      description:
        'Trace matter and energy separately through an organism, showing how food molecules are rearranged into new molecules that build the body while the atoms are conserved, and how that rearrangement releases energy that is transferred to the body and eventually leaves as heat (NGSS MS-LS1-7).',
    },
  ],
  prerequisites: ['m7sci.cellular-respiration'],
  followUps: ['m7sci.cell-division-and-growth'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Open the two-books question with something the student has actually watched happen: a puppy that grew.',
      script:
        'A puppy comes home weighing about as much as a bag of sugar. A year later it weighs as much as you do. Nobody added anything to that puppy except food, water and air. So every atom the dog added while it grew walked in through its mouth or its nose. Here is the question for today: if you picked one atom out of a scoop of dog food, could you say where it ended up? Some of those atoms are in the dog. Some were breathed back out. And the energy in that food is a completely separate story with a completely separate ending. Today you learn to keep the two stories apart.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-two-account-books',
      kind: 'concept',
      goal: 'Install the two separate account books, the three destinations for atoms, the one-way flow of energy, and the tracing procedure itself.',
      keyIdeas: [
        'THERE ARE TWO ACCOUNT BOOKS, AND THEY NEVER MIX. Book one is MATTER, which means the atoms. Book two is ENERGY. Both books obey a rule that nothing is created and nothing is destroyed, but the two behave very differently after that, and almost every mistake in this lesson comes from writing an entry in the wrong book.',
        'MATTER IS CONSERVED: ATOMS ARE REARRANGED, NEVER MADE OR DESTROYED. Food molecules are broken into small pieces, and those pieces are put back together into new molecules that become the body. The atoms in a sandwich end up in muscle, in bone, in exhaled carbon dioxide and in water. WRONG: "The food is used up and disappears." CORRECT: "Every atom of the food is still somewhere, and you can point at where."',
        'THE ATOMS FROM A MEAL HAVE THREE DESTINATIONS, and a full trace names all three. Some are rearranged into new molecules that build and repair the body. Some leave in the carbon dioxide you breathe out. Some leave in water and in waste. Nothing is left over, because nothing vanished. A tree makes the same point in a way that surprises people: most of the material in new wood came from carbon dioxide in the air and from water, not from the soil.',
        'ENERGY IS RELEASED, NOT CREATED. The energy was already stored in the food molecules. Rearranging those molecules during cellular respiration RELEASES that stored energy, and the cell transfers it into a usable form. A cell does not manufacture energy any more than a wallet manufactures money.',
        'ENERGY FLOWS THROUGH AND LEAVES AS HEAT; MATTER CYCLES. Released energy is transferred to moving muscles, to building new molecules, and to keeping the body warm, and it keeps spreading out into the surroundings as heat. It does not come back. That is exactly why an animal has to eat again tomorrow even though its atoms are still there. WRONG: "The body recycles its energy the way it recycles its atoms." CORRECT: "Matter cycles. Energy flows one way and leaves as heat."',
        'THE TRACING PROCEDURE — pick ONE atom or ONE molecule, follow it one step at a time, and at every step say out loud where it is now. Then do the same thing separately for the energy. The rule that keeps a trace honest is this: an atom is never allowed to turn into energy, and energy is never allowed to turn into an atom. If a step in your trace does either one, the step is wrong.',
      ],
      vocabulary: [
        { term: 'matter', definition: 'anything made of atoms; it has mass and takes up space.' },
        { term: 'conserved', definition: 'kept at the same total; none is created and none is destroyed.' },
        { term: 'rearranged', definition: 'the same atoms taken apart and joined together in a new way to make different molecules.' },
        { term: 'cellular respiration', definition: 'the process in cells that rearranges food molecules and releases the energy stored in them.' },
        { term: 'heat', definition: 'energy that spreads from a warmer thing to a cooler one; the form energy ends up in as it leaves an organism.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-the-atoms',
      kind: 'worked_example',
      problem:
        'A twelve-year-old eats a peanut butter sandwich and grows a little taller that month. Trace the ATOMS from that sandwich. Where do they end up?',
      steps: [
        'Start where the atoms start. The sandwich is made of large molecules: starch from the bread, protein and fat from the peanut butter. Every one of those molecules is a group of atoms joined together.',
        'Step one, digestion. In the stomach and intestine the large molecules are broken into small ones. No atom is lost here. Breaking a molecule apart does not destroy any of its atoms, exactly the way taking apart a tower of blocks does not destroy any blocks.',
        'Step two, absorption. The small molecules pass through the wall of the intestine into the blood, and the blood carries them to cells all over the body.',
        'Step three, inside a cell, the atoms split into two paths. On the first path they are REARRANGED into new molecules that the body needs, and those molecules become new muscle, new bone and new skin. That is the growing. The atoms that were in the peanut butter are now atoms of the student.',
        'On the second path the small molecules go through cellular respiration and are rearranged into carbon dioxide and water. The carbon atoms leave the body inside carbon dioxide, breathed out. The rest leaves as water. Some atoms never got absorbed at all and leave as solid waste.',
        'Now check the books. Every atom from the sandwich is accounted for: built into the body, breathed out, or passed out. Nothing was created and nothing was destroyed. Notice what was NOT said in any step: no atom turned into energy. The atoms only ever moved and got rearranged.',
      ],
      answer:
        'The atoms are rearranged, not used up. Some become new body molecules, so the student grows. Some leave as exhaled carbon dioxide, some as water, and some as solid waste. Every atom is still somewhere.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-trace-the-energy',
      kind: 'worked_example',
      problem:
        'Now trace the ENERGY from the same sandwich, keeping it in its own account book. Where does that energy end up?',
      steps: [
        'Start where the energy starts. Energy is already stored in the sandwich, held in the way the food molecules are put together. It got there from a plant, which captured light energy during photosynthesis and stored it in sugar. Nobody has to make it now.',
        'Step one, release. Inside the cells, cellular respiration rearranges the food molecules, and that rearrangement RELEASES the stored energy. Say released, not made. The energy was there the whole time.',
        'Step two, transfer. The cell transfers that energy into a usable form and spends it on jobs: contracting muscles so the student can walk to school, and building the new molecules that make the student taller.',
        'Step three, where it goes next. Every one of those jobs gives off some energy as heat. Working muscles warm up. Building molecules warms the cell. The heat spreads into the body, and the body gives off heat to the air around it, which is why a crowded room gets warm.',
        'Step four, the ending. Sooner or later all of that energy has left the student as heat spreading into the surroundings. It does not get collected back up and used again. This is the reason a person has to eat every day: the atoms are still in the body, but the energy has gone.',
        'Compare the two traces side by side. The atoms stayed in the world, moved around and got rearranged, and many of them are still in the student. The energy passed through the student and left as heat. Two account books, two different endings, and at no point did one book pay into the other.',
      ],
      answer:
        'The energy was stored in the food, released by cellular respiration, transferred to movement and to building new molecules, and it leaves the body as heat spreading into the surroundings. It is not stored up forever and it is not recycled.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-trace-one-atom',
      kind: 'try_yourself',
      problem:
        'A mouse eats a peanut. You want to trace one carbon atom that was inside that peanut. Which trace is correct?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'The molecule holding the atom is broken into smaller molecules, absorbed into the blood, and carried into a cell. There the atom is either rearranged into a new molecule that becomes part of the mouse, or it leaves inside a carbon dioxide molecule the mouse breathes out.',
          correct: true,
        },
        { id: 'b', text: 'The atom is used up as the mouse runs around, so after a while it no longer exists.' },
        { id: 'c', text: 'The atom is changed into energy inside a muscle cell, and that energy is what makes the mouse move.' },
        { id: 'd', text: 'The atom passes straight through as solid waste, because a mouse builds its body out of brand-new matter that it makes itself.' },
      ],
      expectedAnswer:
        'The molecule holding the atom is broken into smaller molecules, absorbed into the blood, and carried into a cell. There the atom is either rearranged into a new molecule that becomes part of the mouse, or it leaves inside a carbon dioxide molecule the mouse breathes out.',
      hints: [
        'Atoms are never created and never destroyed. Cross out any choice in which an atom stops existing or a brand-new atom appears.',
        'An atom is not allowed to turn into energy. A correct trace only ever says where the atom moved to and what it was joined to.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-where-energy-goes',
      kind: 'try_yourself',
      problem:
        'The same mouse gets energy from that peanut. Which statement correctly describes what happens to the energy?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'It is released from the food molecules, transferred to running and to building new molecules, and it eventually leaves the mouse as heat.',
          correct: true,
        },
        { id: 'b', text: 'It is recycled inside the mouse over and over, the same way the atoms of the mouse are.' },
        { id: 'c', text: 'It is destroyed once the mouse has used it, which is why the mouse runs out of energy.' },
        { id: 'd', text: 'It is turned into matter that becomes part of the muscles as the mouse grows.' },
      ],
      expectedAnswer:
        'It is released from the food molecules, transferred to running and to building new molecules, and it eventually leaves the mouse as heat.',
      hints: [
        'Energy is not created and not destroyed either, so it cannot simply be gone. Ask instead where it went.',
        'Matter cycles, but energy flows one way through an organism and leaves in one particular form. What form is a running animal always giving off?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-lost-weight',
      kind: 'try_yourself',
      problem:
        'A dog is given smaller meals and slowly loses weight over several months. Its owner wants to know where the lost matter actually went. What is the correct answer?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Most of it left the dog as carbon dioxide breathed out, and the rest left as water.', correct: true },
        { id: 'b', text: 'The matter was destroyed, which is what losing weight means.' },
        { id: 'c', text: 'The matter was changed into energy, and the dog used that energy up on walks.' },
        { id: 'd', text: 'All of it left the dog as heat given off into the air.' },
      ],
      expectedAnswer: 'Most of it left the dog as carbon dioxide breathed out, and the rest left as water.',
      hints: [
        'Matter is conserved, so the lost mass had to leave the body as something. Which choices claim it simply stopped existing?',
        'Heat is energy, not matter, so heat cannot carry atoms away. Stored fat molecules are rearranged during cellular respiration into two things that leave the body.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-food-is-used-up',
      kind: 'misconception_check',
      question:
        'A student writes: "The food you eat gets used up and disappears, and that is how it turns into the energy your body needs." Two separate things went wrong in that one sentence. What are they?',
      commonErrors: [
        {
          answer: 'The food gets used up and disappears.',
          misconception:
            'Treating food the way you would treat a candle that burns down to nothing, as though matter can simply run out of existence once the body is finished with it.',
          correctsTo:
            'Nothing disappears. The food molecules are broken apart and their atoms are rearranged into new molecules, and every one of those atoms is still somewhere. WRONG: "It got used up." CORRECT: "Some atoms were built into the body, some left as carbon dioxide that was breathed out, and some left as water and waste." The habit that fixes this permanently is to refuse to accept the words used up in a trace and to ask instead: where is that atom right now?',
        },
        {
          answer: 'The food turns into the energy your body needs.',
          misconception:
            'Mixing the two account books, so matter is allowed to become energy. Food and energy get treated as the same stuff in two forms.',
          correctsTo:
            'Matter does not become energy in your body, ever. The energy was ALREADY STORED in the food molecules, and rearranging those molecules RELEASES it. The atoms and the energy travel separate paths from that moment on: the atoms are rearranged and stay in the world, and the energy is transferred to the body and then leaves as heat. WRONG: "Food turns into energy." CORRECT: "Food molecules are rearranged, and that rearranging releases the energy stored in them."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Keep two account books. Matter means the atoms. Energy is separate. Never let one become the other.',
        'Matter is conserved: atoms are rearranged, never created and never destroyed. Food is not used up.',
        'Atoms from a meal have three destinations: built into the body, breathed out as carbon dioxide, or leaving as water and waste.',
        'Most of the material in new wood came from carbon dioxide in the air and from water, not from the soil.',
        'Energy is RELEASED from food molecules by cellular respiration, not made. It was stored there already.',
        'Energy is transferred to movement and to building molecules, and it leaves the organism as heat. Matter cycles; energy flows one way.',
        'Losing weight means the matter left, mostly as exhaled carbon dioxide and as water. It did not vanish.',
        'To trace anything, pick one atom or one portion of energy and say where it is at every single step.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.4', cedTitle: 'Tracing Matter & Energy Through an Organism' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
