/**
 * Grade 8 Science (Physical Science) — Chemical Reactions: Evidence of a
 * Chemical Reaction.
 *
 * PROCEDURE-LED exemplar for the m8sci fan-out (NGSS MS-PS1-2). One routine
 * runs the whole lesson: list the properties BEFORE, list the properties
 * AFTER, compare the two lists for a property that nothing you started with
 * had (checking each candidate against the five signs and the qualifier that
 * makes each sign count), then check the verdict by reversing the condition
 * and, if the call was "physical", by naming which of the four physical
 * changes it is. The shape is deliberately different from the concept-led
 * exemplar: the concept segment is a short ordered recipe rather than a
 * mental model, both worked examples run the same four moves so the pattern
 * is unmistakable, and every answer ends with the two-part verification move
 * (three clues of different kinds agreeing, then one changed condition that
 * moves the answer).
 *
 * The two traps it is built to kill are (a) "looks different, so it is a new
 * substance" (melting and dissolving both look dramatic and both keep the
 * substance), and (b) "bubbles mean a reaction" (bubbles from a liquid at its
 * boiling point are the liquid turning to gas, and only bubbles that appear
 * WITHOUT boiling are a new gas).
 *
 * SCOPE GUARD: this plan produces a VERDICT -- physical change or chemical
 * reaction -- from described before-and-after properties, and never a
 * product name, an equation, or an account of the atoms. Its scope cell's
 * lineage and withheld clauses, verbatim: "using the characteristic-property
 * idea from 6.4 (the stage-two half of MS-PS1-2)"; "Withholds reaction types
 * and symbolic equations (`chem-u5-reaction-types.ts`,
 * `chem-u1-physical-chemical-changes.ts` at the HS depth)." What that means
 * at each edge, and what is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 6.4 (characteristic properties identify a
 *     substance) is assumed, not re-taught: the concept segment names the
 *     idea in one sentence as "the earlier lesson" and uses it as the reason a
 *     changed melting point is a sign. Row 8.2 (atoms rearranged, mass
 *     conserved) is named only as "the next lesson"; this file never counts
 *     an atom, never says what the atoms did, and never states a mass before
 *     or after. Where an escaping gas is mentioned, it is only to say that
 *     the gas does not turn back into powder, not that mass was lost or kept.
 *     Row 8.3 (reactions that release or absorb thermal energy) is not
 *     taught: a temperature change appears ONLY as one of the five signs
 *     that a new substance formed, the words exothermic and endothermic do
 *     not appear, and no reaction is classified as releasing or absorbing.
 *   - CHEMICAL FORMULAS. Water and carbon dioxide are read out in words with
 *     their atom counts ("H two O -- two hydrogen atoms and one oxygen atom")
 *     with the plain-text formula in parentheses, exactly as row 7.4 taught
 *     reading them. No reaction is ever written as an arrow equation, no
 *     coefficient is attached to any formula, and no product other than
 *     carbon dioxide (named once, as something a chemist could identify and
 *     the student does not need to) is named.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears. Rust on a nail is used as a
 *     substance changing, never as weathering; there is no rock, mineral,
 *     water cycle or atmosphere anywhere in this file.
 *   - GRADE 7 LIFE SCIENCE boundary: the cooked egg is used as a substance
 *     whose properties change, never as food, digestion, nutrition or an
 *     organism. The one mechanism sentence about it (proteins unfold and link
 *     together) is chemistry, is flagged as unnecessary to the verdict, and
 *     goes no further. No cell, no organism and no photosynthesis appears.
 *   - HS CHEMISTRY boundary: this file stops short of NAMING a reaction type
 *     (no combustion, decomposition, precipitation reaction or neutralization
 *     as a category), of any symbolic equation, of the words acid and base
 *     (vinegar is only "vinegar"), of any product name beyond carbon dioxide,
 *     of exothermic and endothermic as signed quantities, and of solutions
 *     as a topic (dissolving is a physical change here and nothing more).
 *     "Precipitate" is used as a vocabulary word for a solid that settles
 *     out, not as a reaction type.
 *   - REVERSIBILITY is stated as a CLUE and a CHECK, never as the rule, and
 *     the file says so outright, because "irreversible means chemical" is a
 *     rule a chemist would not sign.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * before-and-after observation in this file is written out in words inside
 * the item, and every item is solvable from the text printed inside it.
 * Never write "as the picture shows", and never assume the student has a cup
 * of vinegar or a pan on a stove in front of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 7.4 -> 8.1 ->
 * 8.2 (`molecules-formulas-and-extended-structures` ->
 * `evidence-of-a-chemical-reaction` ->
 * `rearranging-atoms-and-conservation-of-mass`). Both arrays were empty while
 * this exemplar was the only row on disk; the controller hand-wired them at
 * course registration (2026-09-19).
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U8_EVIDENCE_OF_A_CHEMICAL_REACTION: LessonPlan = {
  id: 'evelyn.ms.m8sci.evidence-of-a-chemical-reaction.v1',
  title: 'Evidence of a Chemical Reaction',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.evidence-of-a-chemical-reaction',
      standard: 'M8SCI-8.1',
      description:
        'Compare described properties of substances before and after they interact to decide whether a new substance formed (a chemical reaction: unexpected color change, gas given off without boiling, a solid forming from two liquids, temperature or light change, a changed melting point) or whether only a physical change occurred (state, shape, size, dissolving -- the same substance in a different form), using the idea that each substance has its own characteristic properties (NGSS MS-PS1-2).',
    },
  ],
  prerequisites: ['m8sci.molecules-formulas-and-extended-structures'],
  followUps: ['m8sci.rearranging-atoms-and-conservation-of-mass'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put two changes side by side in one pan the student has watched, so the difference between "different form" and "different substance" is felt before it is named.',
      script:
        'Picture a frying pan on a stove. A pat of butter goes in first. It slumps, spreads and turns into a clear yellow liquid. An egg goes in next. The white of it, which was clear and runny, turns bright white and firm. Now turn the stove off and let the pan cool. The butter goes solid again, and it is butter, exactly as before. The egg stays cooked. You have never once gotten a raw egg back by cooling a fried one. Two changes in one pan, both driven by the same heat, and one of them undoes itself while the other never will. That difference is the whole of today. By the end you will have a routine that takes any described change -- a rusting bike chain, a fizzing drink, a match burning down, salt vanishing into soup -- and tells you whether you still have the substance you started with, or whether something new has been made.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-classification-routine',
      kind: 'concept',
      goal: 'Install the one question (same substance or new one), the five signs with their qualifiers, the four physical changes, the four-step routine, and the two traps before they are met.',
      keyIdeas: [
        'THE ONLY QUESTION IS: IS IT THE SAME SUBSTANCE? Every substance has its own set of characteristic properties -- what color it is, the temperature it melts at, whether it dissolves in water, whether it burns, whether it is a solid, a liquid or a gas at room temperature -- and those properties are how you tell one substance from another. That was the earlier lesson on identifying a substance. This lesson turns it around. If every property after a change still belongs to a substance you started with, the substance is the same and the change was PHYSICAL. If something after the change has a property that none of the starting substances had, a NEW SUBSTANCE has formed, and that is a CHEMICAL REACTION.',
        'FIVE SIGNS THAT A NEW SUBSTANCE HAS FORMED, each with the qualifier that makes it count. (1) An UNEXPECTED color change -- unexpected, because wetting a gray stone makes it darker without changing the stone, and blue paint stirred into yellow makes green without anything reacting. (2) A gas given off WITHOUT boiling -- bubbles at room temperature from two substances meeting, not bubbles from a liquid being heated to its boiling point. (3) A solid forming from two liquids with NOTHING being cooled, so it cannot be freezing. (4) A temperature change, or light given off, with NO heater, cooler or flame doing it from outside. (5) A changed melting point, or any other characteristic property that no longer matches anything you started with. One sign is a strong hint. Two signs of different kinds agreeing is as close to certain as this routine gets.',
        'FOUR CHANGES THAT KEEP THE SUBSTANCE. A change of STATE -- melting, freezing, boiling, condensing -- moves the same particles closer together or farther apart, and nothing more; ice and liquid water are both H two O, two hydrogen atoms and one oxygen atom (H2O). A change of SHAPE: bending, folding, denting. A change of SIZE: cutting, crushing, grinding; a crushed sugar cube is still sugar. And DISSOLVING: the salt seems to vanish into the water, but its particles have only spread out among the water particles until the grains are too small and too scattered to see. Let the water evaporate and the same salt is back on the bottom of the cup. All four can look dramatic. Not one of them makes a new substance.',
        'THE ROUTINE, IN ORDER. (1) List the properties BEFORE: what each starting substance looks like, what state it is in, what it does. (2) List the properties AFTER, in the same kind of words. (3) Compare the two lists and look for a property in the after list that nothing in the before list had, checking each candidate against the five signs and their qualifiers. If you find one, a new substance formed. If the only differences are state, shape, size or dissolving, the substance is the same. (4) Check the verdict two ways: reverse the condition -- cool it, dry it, gather the pieces -- and ask whether the originals come back; and, if you called it physical, name which of the four physical changes it is. A verdict that fails either check goes back to step 3.',
        'THE TWO TRAPS. First trap: LOOKS DIFFERENT is not the test. Melting looks dramatic and dissolving looks like disappearing, and both are physical. Rusting looks slow and quiet, and it is a chemical reaction. Second trap: REVERSIBLE is a clue, not the rule. Melted ice refreezes and dried-out salt water leaves salt behind, which is why reversing the condition is such a good check. But a sheet of paper cut in half does not grow back, and both halves are still paper. The rule is always the substance and its properties. Reversing the condition is how you TEST the rule, not the rule itself.',
        'WHAT THE ROUTINE DOES NOT ASK. It never asks you to name the new substance, and it never asks what happened to the atoms. You can tell that rust is not iron -- orange-brown and crumbly against shiny gray and hard -- without knowing that rust is iron joined to oxygen from the air, and you can tell that a fizzing gas is new without knowing what a chemist would call it. Where the atoms went, and what happens to the total mass, is the next lesson. This lesson ends at the verdict.',
      ],
      vocabulary: [
        { term: 'substance', definition: 'a single kind of matter with its own fixed set of properties, such as water, iron, table salt or sugar.' },
        { term: 'physical change', definition: 'a change in the form of a substance -- its state, shape, size, or whether it is dissolved -- in which the substance itself stays the same.' },
        { term: 'chemical reaction', definition: 'a change in which one or more new substances form, with properties the starting substances did not have; also called a chemical change.' },
        { term: 'characteristic property', definition: 'a property such as melting point, boiling point, density or whether it dissolves in water, which belongs to a substance and does not depend on how much of it you have.' },
        { term: 'precipitate', definition: 'a solid that forms and settles out when two liquids are mixed and a new substance is made.' },
        { term: 'dissolve', definition: 'to spread out, particle by particle, through a liquid so that the solid seems to disappear while remaining the same substance.' },
      ],
      suggestedTools: ['show_table', 'show_flowchart'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-cooked-egg',
      kind: 'worked_example',
      problem:
        'A raw egg is cracked into a hot pan. Before: the egg white is a clear, colorless, runny liquid that you can see straight through. After two minutes in the pan: the white is bright white, cannot be seen through, and is firm enough to lift with a spatula. When the cooked white is taken off the heat and left on a plate until it is cool, it stays white and firm. Run the routine. Physical change or chemical reaction?',
      steps: [
        'Step 1, list the properties before. The raw white is clear and colorless, you can see through it, it is a liquid, and it runs when the pan tilts. That is the whole before list.',
        'Step 2, list the properties after. It is bright white, you cannot see through it, and it is a firm solid that holds its shape. Cooling it on the plate does not change any of that.',
        'Step 3, compare. Two properties in the after list are not in the before list: a color (bright white, where the raw white had none) and being impossible to see through. The state changed as well, liquid to solid, but on its own a state change proves nothing, because freezing does that too. Check the candidates against the five signs. A color change with no dye or other substance added to cause it is sign one, an unexpected color change. A firmness that arrived with heating and stays when the heat is gone matches nothing on the physical list. New substance.',
        'Step 4, check the verdict two ways. Reverse the condition: the egg was heated, so cool it. It was cooled on the plate, and the clear runny liquid did not come back. A solid made by cooling melts again when it warms; this solid was made by heating and stays solid when cooled. Then ask which of the four physical changes it could be: not a change of state, because a state change reverses when its condition reverses and this one did not; not shape, not size, not dissolving. Nothing on the physical list fits. The verdict holds: a chemical reaction.',
        'WRONG: "It went from liquid to solid, so it is a change of state, so it is physical." CORRECT: "It went from liquid to solid while being HEATED, and stayed solid when cooled; a change of state reverses when its condition reverses, and this did not, so it is not a change of state." For the record, the mechanism in one sentence: the proteins in the egg white unfold and link to one another in a new arrangement that does not come apart on cooling. You did not need that sentence to reach the verdict. The properties reached it first.',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. The property comparison says the cooked white has a color and a firmness the raw white never had. The reversal says cooling does not bring the raw white back. The sign says a color change happened with nothing added to cause it. Three different kinds of evidence, one answer. Second, change one thing about the problem and check that the answer moves the way it should. Put the raw white in a freezer instead of a pan. It goes solid there too. But thaw it, and clear, runny egg white is back, ready to be cooked. Same starting substance, a solid either way, and the two verdicts are different, because in the freezer the properties came back and in the pan they did not. The test was never whether it went solid. It is whether the substance is still there when the condition is reversed.',
      ],
      answer:
        'A chemical reaction: the cooked white has properties (bright white, cannot be seen through, firm even when cool) that the raw white never had, and cooling it does not bring the raw white back.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-white-powders',
      kind: 'worked_example',
      problem:
        'Two white powders, two cups of liquid, everything at room temperature, and nothing is heated at any point. Case one: a spoonful of table salt is stirred into a cup of water. The grains shrink and disappear, the water stays clear and colorless, nothing bubbles, and a thermometer in the cup reads the same as before. Case two: a spoonful of baking soda is stirred into a cup of vinegar. The mixture fizzes at once, bubbles rise and burst for about a minute, and a thermometer in the cup reads lower than it did before the powder went in. Run the routine on both cases.',
      steps: [
        'Case one, step 1, before: white grains of table salt, a solid, and clear colorless water, a liquid, both at room temperature. Step 2, after: a clear colorless liquid at room temperature with no grains to be seen. Step 3, compare: nothing in the after list is new. The salt is out of sight, but "out of sight" is not a property. No color appeared, no gas, no solid, and the temperature did not move.',
        'Case one, step 4, the checks. Reverse the condition: the salt was put into water, so take the water away. Leave the cup somewhere warm until the water has evaporated, and white grains are back on the bottom, behaving exactly like the salt you started with. Then name the physical change: dissolving, because the salt particles spread out among the water particles until the grains were too scattered to see. Verdict: a physical change, same substance.',
        'Case two, step 1, before: a white powder of baking soda, a solid, and clear vinegar, a liquid, both at room temperature. Step 2, after: a liquid that fizzed, a gas that rose out of it in bubbles, and a temperature lower than before. Step 3, compare: a GAS exists after that neither the powder nor the vinegar was, and it appeared at room temperature with nothing being heated. That is sign two, gas given off without boiling. The temperature dropped with no cooler anywhere near the cup, which is sign four. Two signs of different kinds, agreeing. A new substance formed. A chemist would identify that gas as carbon dioxide, C O two -- one carbon atom and two oxygen atoms (CO2) -- but you do not need its name. That a gas appeared at room temperature is the evidence.',
        'Case two, step 4, the checks. Reverse the condition: wait, or cool the cup. The gas that bubbled out has gone into the air, and no amount of waiting or cooling turns it back into powder. Then try to name a physical change: not a change of state, because the powder did not melt and nothing was heated to boiling; not shape or size; not dissolving, because a dissolved solid disappears quietly and leaves the temperature alone, and this one fizzed. Nothing fits. Verdict: a chemical reaction.',
        'WRONG: "Both powders disappeared into a liquid, so both dissolved, so both changes are physical." CORRECT: "The salt spread out and left no new property behind; the baking soda met the vinegar, and a gas and a temperature drop appeared that neither had before." Disappearing is what the two cases share. The after list is where they differ, and the after list is what decides.',
        'Now the two checks. First, three clues of different kinds agree on case two: the property comparison (a gas that was not there before), the sign observed (bubbles at room temperature with no heating), and the reversal (the gas does not return to powder however long you wait). Second, change one thing and see whether the answer moves. Stir the same spoonful of baking soda into a cup of plain water instead of vinegar. It disappears quietly, with no fizz. Now nothing in the after list is new, and the verdict flips to a physical change, dissolving. The gas in the original case came from the two substances meeting, not from a powder being stirred into a liquid. Change the liquid and the verdict changes with it.',
      ],
      answer:
        'Case one is a physical change: the salt dissolved, nothing new appeared, and evaporating the water brings the same salt back. Case two is a chemical reaction: a gas was given off at room temperature with no heating, and the temperature dropped with no cooler, so a new substance formed.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-rusting-nail',
      kind: 'try_yourself',
      problem:
        'An iron nail is left outside for a month. Before: the nail is shiny, gray, hard, and bends a little without snapping. After: its surface is covered in an orange-brown crust that is dull rather than shiny and crumbles into powder when rubbed between two fingers. Drying the nail in the sun for a day does not change the crust back. Which verdict, with its reasoning, is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A physical change, because the nail is still there underneath the crust and only its surface looks different, the way a wet stone looks darker than a dry one and is still the same stone.' },
        { id: 'b', text: 'A chemical reaction, because the orange-brown, crumbly crust has properties the shiny gray iron never had, and drying the nail does not turn the crust back into iron.', correct: true },
        { id: 'c', text: 'A physical change, because the crust is the outer layer of the nail breaking into smaller pieces, the way paint chips off a wall, so the flakes are still iron in a smaller size.' },
        { id: 'd', text: 'A chemical reaction, because the nail changed color, and any change in color at all, on its own, is enough to prove that a new substance has formed.' },
      ],
      expectedAnswer: 'A chemical reaction, because the orange-brown, crumbly crust has properties the shiny gray iron never had, and drying the nail does not turn the crust back into iron.',
      hints: [
        'Run the routine. List what the iron was like before, then what the crust is like after. Is there a property in the after list -- a color, a texture -- that the shiny gray metal did not have?',
        'Then run the check. A wet stone dries back to the same stone. Does drying the nail bring the shiny gray iron back? If the originals do not return when the condition is reversed, the crust is not iron in a different form.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-clear-liquids',
      kind: 'try_yourself',
      problem:
        'Sample A and Sample B are two clear, colorless liquids at room temperature. Each is a different white solid dissolved in water. Sample A poured into a cup of plain water stays clear and stays at room temperature. Sample A poured into Sample B turns cloudy white within a second, a white solid settles to the bottom over the next minute, and the cup feels warm to the touch. Which verdict, with its reasoning, is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A physical change, because the white solid is one of the dissolved solids coming back out of the water, the way salt grains appear when salt water dries out in the sun, so nothing new was made, only something already there made visible again.' },
        { id: 'b', text: 'A physical change, because two liquids poured together always look cloudy at first, the way milk poured into water does, and the cloudiness settles to the bottom on its own as the two liquids separate out again.' },
        { id: 'c', text: 'A chemical reaction, because a solid formed from two liquids with nothing cooled and the cup warmed with no heater, and neither starting liquid had a solid or that warmth in it before they met.', correct: true },
        { id: 'd', text: 'A chemical reaction, because the cup got warm, and any rise in temperature at all proves a reaction, since nothing can ever get warmer without one taking place inside it.' },
      ],
      expectedAnswer: 'A chemical reaction, because a solid formed from two liquids with nothing cooled and the cup warmed with no heater, and neither starting liquid had a solid or that warmth in it before they met.',
      hints: [
        'Two of the five signs are in the description. Name them, and check each against its qualifier: was anything cooled to make the solid, and did anything from outside heat the cup?',
        'Use the contrasting pour. Sample A into plain water did nothing, so the solid and the warmth came from the two dissolved substances meeting, not from pouring liquids together in general.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-boiling-pan',
      kind: 'try_yourself',
      problem:
        'A pan of water sits on a stove that has been turned on. Once the water is hot enough, large bubbles form on the bottom of the pan, rise through the water and burst at the surface, a white mist hangs in the air above the pan, and after ten minutes the water level is lower than it was. Which verdict, with its reasoning, is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A chemical reaction, because gas was given off, and a gas being given off is one of the five signs, so the bubbles settle it on their own whether or not the pan was being heated, since a gas has to come from somewhere new.' },
        { id: 'b', text: 'A chemical reaction, because steam is a gas you can barely see and liquid water is something you can pour, and two things with such different properties cannot be the same substance.' },
        { id: 'c', text: 'A physical change, because hot water is still water, and the bubbles are air that was trapped in the spaces between the water particles and escapes as the water warms up, which is why the level went down.' },
        { id: 'd', text: 'A physical change, because the bubbles are liquid water turning to gas at its boiling point while it is being heated, and the mist is that same water turning back to liquid as it cools -- one substance in different states.', correct: true },
      ],
      expectedAnswer: 'A physical change, because the bubbles are liquid water turning to gas at its boiling point while it is being heated, and the mist is that same water turning back to liquid as it cools -- one substance in different states.',
      hints: [
        'The sign is not "gas given off". It is "gas given off WITHOUT boiling". Was this water being heated to its boiling point when the bubbles appeared?',
        'Follow the water. Liquid in the pan, gas inside the bubbles, tiny liquid droplets in the mist -- all of it is water, H two O. The level dropped because some of the water left the pan as a gas, not because it stopped being water.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-melting-and-dissolving',
      kind: 'misconception_check',
      question:
        'A student writes: "Melting an ice cube is a chemical change, because the ice turned into a completely different thing, water. And stirring sugar into tea is a chemical change too, because the sugar is gone." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'Melting ice is a chemical change, because the ice turned into a different thing.',
          misconception:
            'Treating a change of state as a change of substance, because solid ice and liquid water look and behave so differently that they feel like two different things.',
          correctsTo:
            'Ice and liquid water are the same substance, H two O -- two hydrogen atoms and one oxygen atom (H2O) -- with the particles held in place in the solid and sliding past one another in the liquid. Run the routine: the before list and the after list describe one substance in two states, and nothing in the after list is a new property. Reverse the condition by putting the water back in the freezer, and ice returns. WRONG: "The ice turned into a different thing." CORRECT: "The same water changed state, which is the first of the four physical changes."',
        },
        {
          answer: 'Sugar stirred into tea is a chemical change, because the sugar is gone.',
          misconception:
            'Reading "out of sight" as "no longer exists", because dissolving looks exactly like disappearing.',
          correctsTo:
            'The sugar is still there, spread out particle by particle among the water particles until the grains are too small and too scattered to see, and the tea tastes sweet because the sugar is in it. No gas, no new color, no solid and no temperature change came from the sugar meeting the tea. Let a spoonful of the tea dry out and a sugary residue is left behind. Dissolving is the fourth physical change on the list, and the check for it is the same every time: take the liquid away and the solid comes back. WRONG: "The sugar is gone." CORRECT: "The sugar dissolved, and the same sugar is still in the tea."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The question is always the same: is it the SAME SUBSTANCE in a different form, or has a NEW SUBSTANCE formed?',
        'A physical change keeps the substance. There are four: state, shape, size, and dissolving.',
        'A chemical reaction makes a new substance with properties the starting substances did not have.',
        'The five signs, each with its qualifier: an UNEXPECTED color change; gas given off WITHOUT boiling; a solid from two liquids with NOTHING cooled; a temperature or light change with NO heater, cooler or flame outside it; a changed melting point or other characteristic property.',
        'The routine: list before, list after, compare for a property nothing before had, then check by reversing the condition and, if you called it physical, naming which physical change it is.',
        'Bubbles from a liquid heated to its boiling point are that liquid turning to gas: physical. Bubbles at room temperature from two substances meeting are a new gas: chemical.',
        'Dissolving is physical. Take the water away and the same salt or sugar is back. Ice and liquid water are both H two O.',
        'Reversible is a clue, not the rule. Cut paper does not grow back, and it is still paper. The rule is the substance and its properties.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.1', cedTitle: 'Evidence of a Chemical Reaction' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
