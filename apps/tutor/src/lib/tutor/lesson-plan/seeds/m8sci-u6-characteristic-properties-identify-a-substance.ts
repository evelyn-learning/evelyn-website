/**
 * Grade 8 Science (Physical Science) — The Particle Model of Matter:
 * Characteristic Properties Identify a Substance.
 *
 * PROCEDURE-LED row (NGSS DCI PS1.A). One routine runs the whole lesson: list
 * every fact given about the unknown sample, cross out the facts that change
 * when the size of the piece changes, rule out every candidate substance that
 * mismatches on even ONE characteristic property, and accept a candidate only
 * when at least two properties of different kinds agree. The pure-substance
 * half of the row runs the same routine on a melting or boiling record: one
 * sharp temperature that repeats from sample to sample means a pure
 * substance; a stretch of temperatures that shifts from sample to sample
 * means a mixture.
 *
 * The three traps it is built to kill are (a) reading mass, volume or size as
 * evidence of identity -- "the bigger block is denser" -- (b) accepting an
 * identification from a single matching property, and (c) identifying by
 * appearance, which fails in both directions: different substances that look
 * alike, and one substance that looks different when its grains are a
 * different size.
 *
 * SCOPE GUARD: this plan produces an IDENTITY -- which substance a described
 * sample is made of, or whether a sample is a pure substance or a mixture --
 * from characteristic properties that do not depend on how much of it you
 * have. Per controller ruling 33, this row's scope cell carries NO lineage
 * clause: it names no Grade 6 or Grade 7 predecessor file, and none is
 * invented here. Its withheld clause, verbatim: "Withholds the
 * element/compound/homogeneous/heterogeneous classification scheme and
 * separation methods (`chem-u1-classifying-matter.ts`)." What that means at
 * each edge, and what is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 6.3 (density, thermal expansion and why warm
 *     fluids rise) is the prerequisite and is assumed, not re-taught: density
 *     appears here only as one of six identity fingerprints, and no segment
 *     explains thermal expansion, says that a warm fluid rises, or mentions
 *     convection, the mantle, an ocean current or the air. Row 6.2 (changes of
 *     state and thermal energy) supplies the particle-level REASON for the
 *     temperature plateau, and that reason is stated in worked example 2 as
 *     something the student already holds rather than re-derived. The plateau
 *     itself is this row's own content, since "sharp melting point" sits in
 *     the scope line, so it recurs wherever the pure-substance signature is
 *     stated; what appears nowhere is a particle-motion account of melting,
 *     freezing, evaporation or condensation. Row 7.1
 *     (elements, compounds and mixtures) is the follow-up: this file uses
 *     "pure substance" and "mixture" and stops there -- the words element and
 *     compound occur in no authored segment of this plan; the only three
 *     occurrences in the file are in this guard, in the chain note below it,
 *     and inside the followUps loId. No particle picture is ever classified,
 *     and no substance in this file is called an element or a compound. Row 8.1
 *     (evidence of a chemical reaction) owns the before-and-after verdict;
 *     this row is the stage-one half that supplies the property idea 8.1
 *     leans on, so no change is judged here to have made a new substance, and
 *     flammability appears only as a property a substance either has or does
 *     not have.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: the curriculum names the near
 *     miss outright -- identifying minerals by hardness, streak and luster is
 *     `m6sci-u3-identifying-minerals-by-their-properties.ts`, a different
 *     property set for a different purpose. None of those three words, and no
 *     rock or Earth system of any kind, appears in any authored segment of
 *     this plan ("mineral" occurs only in this guard clause). The word
 *     "crystals" is used only as the everyday word for the grains in a dish
 *     of white powder.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears -- no authored segment contains "cell",
 *     "organism", "membrane" or "diffusion".
 *   - HS CHEMISTRY boundary (the upward edge): the formula this file stops
 *     short of writing is density as mass divided by volume. Density is
 *     always spoken as "the mass of each cubic centimeter", every division it
 *     performs is written out in words with both units named, and no
 *     equation, no density-as-a-conversion-factor, no dimensional analysis and
 *     no significant figures appear (`chem-u1-density-dimensional-analysis.ts`,
 *     `chem-u1-measurement-sig-figs.ts`). It also stops short of the
 *     homogeneous/heterogeneous split, of fixed ratios, and of every
 *     separation method -- filtering, distilling and evaporating a mixture
 *     apart are never named (`chem-u1-classifying-matter.ts`); of solubility
 *     curves, molarity and colligative properties, so solubility here is only
 *     whether a substance dissolves and how much of it a given amount of
 *     water will take (`chem-u8-*`); and of heating-curve arithmetic and
 *     q = mΔH, so no energy is ever computed from a temperature change
 *     (`chem-u7-phase-changes-heating-curves.ts`). Conductivity is named as a
 *     property and nothing more: no authored segment contains "circuit",
 *     "current", "voltage" or "resistance" (sign-off 6).
 *   - AP PHYSICS boundary: nothing in this row is a force, an energy or a
 *     wave, so the one upward physics surface a density lesson attracts is
 *     buoyancy. No sample here is put in water to see whether it floats, and
 *     no authored segment contains "float", "sink" or "buoyancy"
 *     (`ap-physics2-fluids.ts`).
 *   - BURNED EXAMPLES (ruling 36): part (i) of the scope cell names no
 *     concrete specimen -- only the six property names and the phrase "one
 *     kind of particle, sharp melting point" -- so nothing in
 *     `los[0].description` is answerable as an item and no item specimen had
 *     to be moved. Every item specimen (Sample D, Sample E, Sample F, Sample
 *     G, Substance Four, Substance Five, Substance Six) is fresh and appears
 *     in no teaching segment, per ruling 22; the teaching segments run on the
 *     kitchen jars, Sample A, Sample B, Sample C and Substances One to Three.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every property
 * card, measurement and heating record in this file is written out in words
 * inside the item, and every item is solvable from the text printed inside it.
 * Never write "see the property table", and never assume the student has a
 * balance, a measuring cylinder, a hot plate or a sample in front of them.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 6.3 -> 6.4 -> 7.1
 * (`density-thermal-expansion-and-why-warm-fluids-rise` before it,
 * `elements-compounds-and-mixtures` after it). Both arrays carry those real
 * loIds. The two exemplars leave their arrays empty only as an artifact of
 * being registered before their neighbors exist; that is not the pattern to
 * copy.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U6_CHARACTERISTIC_PROPERTIES_IDENTIFY_A_SUBSTANCE: LessonPlan = {
  id: 'evelyn.ms.m8sci.characteristic-properties-identify-a-substance.v1',
  title: 'Characteristic Properties Identify a Substance',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.characteristic-properties-identify-a-substance',
      standard: 'M8SCI-6.4',
      description:
        'Use characteristic properties that do not depend on sample size -- melting point, boiling point, density, solubility, conductivity, flammability -- to identify a pure substance or to tell two look-alike substances apart, and distinguish a pure substance (one kind of particle, sharp melting point) from a mixture (NGSS DCI PS1.A).',
    },
  ],
  prerequisites: ['m8sci.density-thermal-expansion-and-why-warm-fluids-rise'],
  followUps: ['m8sci.elements-compounds-and-mixtures'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student feel that two substances can look identical and still be told apart with certainty, so the lesson has a job: find the measurements that belong to the substance rather than to the piece.',
      script:
        'Picture two jars at the back of a kitchen cupboard with the labels worn off. Both hold white crystals, and both look exactly alike. One is salt and one is sugar. In a kitchen you might risk a taste. In a lab you never taste an unknown, and yet a chemist can tell those two apart every single time without tasting anything. Tip a spoonful of each into a hot, dry pan and watch. The sugar slumps into a clear syrup. The salt just sits there, unchanged, however long you leave it, because it takes a furnace to melt salt and a pan on a stove cannot get anywhere near that hot. That is not a lucky trick with sugar. Every substance comes with a set of behaviors like that one, the same for a single grain as for a truckload, and the set works like a name tag. Today you get the routine that reads the name tag: which measurements belong to the substance itself, which ones belong only to the lump in front of you, and how many of them you need before you are allowed to say what something is.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-identifying-routine',
      kind: 'concept',
      goal: 'Install the size-independence test, the six characteristic properties, the four-step identification routine, the pure-versus-mixture melting test, and the limits of the method.',
      keyIdeas: [
        'A CHARACTERISTIC PROPERTY BELONGS TO THE SUBSTANCE, NOT TO THE PIECE. Take any pure substance and cut it into a grain, a spoonful and a truckload. Some things you can measure change every time the size of the piece changes: its mass, its volume, its length, how much room it takes up on a shelf. Other things do not move at all: the temperature it melts at, the temperature it boils at, the mass of each cubic centimeter of it, whether it dissolves in water, whether it lets electricity pass through, whether it catches fire. That second list is the list of CHARACTERISTIC properties, and it is the only list that can identify anything. A property that changes when you take a bigger piece is telling you about the piece. A property that holds steady is telling you about the substance.',
        'THE SIX PROPERTIES THIS ROUTINE USES. MELTING POINT: the temperature at which the solid turns to liquid. BOILING POINT: the temperature at which the liquid turns to gas, which for water at sea level is 100 degrees Celsius. DENSITY: how much mass is packed into each cubic centimeter, so a substance with 3 grams in every cubic centimeter has a density of 3 grams per cubic centimeter. SOLUBILITY: whether the substance dissolves in water, and how much of it a given amount of water will take. CONDUCTIVITY: whether the substance lets electricity or thermal energy pass through it easily. FLAMMABILITY: whether the substance catches fire. Not one of the six changes when you take a bigger sample. Color deserves a warning of its own: color does not change with sample size either, but a great many substances are white and a great many are silvery gray, so color narrows the list of candidates and never settles it.',
        'THE ROUTINE, IN ORDER. (1) Write down every fact you have been given about the unknown sample. (2) Cross out the facts that depend on how much you have -- a mass on its own, a volume on its own, a length, a shape -- and keep the characteristic ones. A mass and a volume TOGETHER are worth keeping, because the mass of each cubic centimeter comes out of the pair and that does not depend on the size of the piece. (3) Go down the list of candidate substances and rule out every candidate that disagrees with the sample on even ONE characteristic property. A single clear mismatch rules a candidate out, and it does not matter how well that candidate matched on everything else. (4) Accept the candidate that agrees with the sample on every characteristic property you have, and only when at least TWO properties of different kinds agree. One match is a coincidence waiting to happen. Two matches of different kinds is an identification.',
        'PURE SUBSTANCE OR MIXTURE: THE MELTING TEST. A PURE SUBSTANCE is made of one kind of particle all the way through, so every particle comes away from its neighbors at the same temperature. That is why a pure substance melts at one sharp temperature, holds at that temperature until the last of it is liquid, and gives that same temperature for every sample of it you ever test. A MIXTURE is two or more substances sitting together without joining, each keeping its own properties, and it has no melting point of its own. Its melting and boiling temperatures depend on what is in it and how much of each, so a sample made to a different recipe melts and boils at different temperatures again. Where the substances in a mixture do not come away from their neighbors at the same temperature, the sample softens across a stretch of temperatures instead of melting at one.',
        'TELLING TWO LOOK-ALIKES APART: HUNT FOR THE PROPERTY THAT DISAGREES. When two samples look the same, you do not need every property to separate them. You need ONE characteristic property on which they differ, measured the same way on both. Two white powders that look identical can be separated by dropping each into water and seeing which one dissolves, or by comparing the mass of one cubic centimeter of each, or by warming both and reading the temperature at which each begins to melt. And if every characteristic property you are able to measure gives the same answer for both, you have run out of evidence. The honest report is then that the two samples match on everything you measured -- not that they are proven to be the same substance, and certainly not that they are different.',
        'WHAT THIS ROUTINE DOES NOT DO. It does not tell you which kinds of atoms a substance is built from, or how those are joined together; that is the next unit. It does not decide whether some change has made a NEW substance, which is a later lesson with a routine of its own. And it never identifies anything from one property alone, from color alone, or from how something looks. The whole strength of the method is that a characteristic property stays put when the size of the sample moves. The whole weakness of guessing by eye is that appearance stays put when the substance moves.',
      ],
      vocabulary: [
        { term: 'characteristic property', definition: 'a property that belongs to a substance and does not change when you take a bigger or a smaller sample of it, such as melting point, boiling point, density, solubility, conductivity or flammability.' },
        { term: 'pure substance', definition: 'a single kind of matter, made of one kind of particle all the way through, with one fixed set of characteristic properties and one sharp melting temperature.' },
        { term: 'mixture', definition: 'two or more substances together without joining, each keeping its own properties, whose melting and boiling temperatures depend on how much of each substance is in it.' },
        { term: 'density', definition: 'how much mass is packed into each cubic centimeter of a substance, stated in grams per cubic centimeter; it is the same for a grain as for a truckload.' },
        { term: 'solubility', definition: 'whether a substance dissolves in a liquid such as water, and how much of the substance a given amount of that liquid will take.' },
        { term: 'melting point', definition: 'the temperature at which a solid turns to liquid; for a pure substance it is one fixed temperature, and the temperature holds there until all of the solid is gone.' },
      ],
      suggestedTools: ['show_table', 'show_flowchart'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-identify-the-block',
      kind: 'worked_example',
      problem:
        'A storeroom drawer holds solid blocks and a card listing three substances with two characteristic properties of each. The card says: Substance One melts at 300 degrees Celsius, and each cubic centimeter of it has a mass of 3 grams. Substance Two melts at 300 degrees Celsius, and each cubic centimeter of it has a mass of 8 grams. Substance Three melts at 1,100 degrees Celsius, and each cubic centimeter of it has a mass of 3 grams. You pick up one block and call it Sample A. Sample A has a mass of 60 grams, it takes up a volume of 20 cubic centimeters, and when it is warmed slowly it begins to melt at 300 degrees Celsius. Which of the three substances is Sample A made of?',
      steps: [
        'Step 1, write down every fact about Sample A. A mass of 60 grams. A volume of 20 cubic centimeters. It begins to melt at 300 degrees Celsius. Three facts, and that is everything you have.',
        'Step 2, cross out what depends on the size of the piece. The mass of 60 grams goes, because sawing the block in half would halve it. The volume of 20 cubic centimeters goes for the same reason. But do not throw that pair away, because together they give you something that does not depend on size at all. If 20 cubic centimeters of this substance have a mass of 60 grams, then each single cubic centimeter has a mass of 60 grams divided by 20, which is 3 grams. So Sample A has a density of 3 grams per cubic centimeter, and density is characteristic. The melting temperature of 300 degrees Celsius is characteristic as it stands. You now hold two characteristic properties.',
        'Step 3, rule candidates out, one mismatch at a time. Substance Two melts at 300 degrees Celsius, which matches, but each cubic centimeter of Substance Two has a mass of 8 grams while each cubic centimeter of Sample A has a mass of 3 grams. That is one clear mismatch, so Substance Two is out, and how well it matched on melting temperature does not save it. Substance Three has the right density, 3 grams per cubic centimeter, but it melts at 1,100 degrees Celsius and Sample A began to melt at 300 degrees Celsius. Out. Substance One agrees with Sample A on both.',
        'Step 4, check that two properties of DIFFERENT KINDS agree before accepting. They do. A temperature at which a solid turns to liquid and a mass packed into each cubic centimeter are measurements of completely different things, and both land on Substance One. WRONG: "Sample A has a mass of 60 grams, and 60 grams is a fairly heavy block, so it must be made of the heavy substance, Substance Two." CORRECT: "A mass of 60 grams could be cut from any of the three substances; you would simply need a different sized piece each time. Only the mass of each cubic centimeter belongs to the substance itself."',
        'Now run the two checks a science answer needs, because there is very little arithmetic here to redo. First, three clues of DIFFERENT KINDS that agree. One: two independent characteristic properties, a melting temperature and a density, both point at Substance One. Two: the two rejected candidates failed on different properties from each other, so no single bad measurement could have produced this answer -- if the density reading were wrong, Substance Three would still be ruled out by its melting temperature, and if the melting reading were wrong, Substance Two would still be ruled out by its density. Three: the size test. Saw Sample A in half and measure again. The half block has a mass of 30 grams and a volume of 10 cubic centimeters, so each cubic centimeter still has a mass of 30 grams divided by 10, which is 3 grams, and it still begins to melt at 300 degrees Celsius. Neither number that identified the substance moved when the piece got smaller, which is exactly what a characteristic property is supposed to do. Second, change one thing and check that the answer moves with it. Keep the volume at 20 cubic centimeters but suppose the block had turned out to have a mass of 160 grams. Then each cubic centimeter would have a mass of 160 grams divided by 20, which is 8 grams, and the answer would move to Substance Two while Substance One became the candidate ruled out on density. The routine is doing real work: change the evidence and it changes its verdict.',
      ],
      answer:
        'Substance One. Sample A has a density of 3 grams per cubic centimeter, because 20 cubic centimeters of it have a mass of 60 grams, and it begins to melt at 300 degrees Celsius. Substance One is the only candidate that agrees on both. Substance Two is ruled out by density and Substance Three by melting temperature. The mass of 60 grams and the volume of 20 cubic centimeters are not evidence for any candidate on their own, because both of them change with the size of the piece.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pure-or-mixture',
      kind: 'worked_example',
      problem:
        'Two dishes of white crystals sit side by side, labeled Sample B and Sample C. They look alike: both white, both made of small grains, both about a spoonful. Each is warmed slowly while the temperature is read the whole time. Sample B stays solid until the temperature reaches 80 degrees Celsius. It then begins to melt, the temperature holds at 80 degrees Celsius for as long as the melting lasts, and the reading only climbs again once the last grain has turned to liquid. Sample C begins to soften at 60 degrees Celsius, is not fully liquid until 95 degrees Celsius, and its temperature climbs the whole way through. A second spoonful of Sample C, scooped from a different corner of the same jar, begins to soften at 65 degrees Celsius and is fully liquid at 90 degrees Celsius. Which sample is a pure substance, which is a mixture, and how do you know?',
      steps: [
        'Step 1, write down the facts and be honest about which ones carry weight. Both samples are white. Both are made of small grains. Both are about a spoonful. Not one of those three separates the samples, because both samples have all three, and how much you have is not characteristic in any case. The temperatures are the whole of the evidence here.',
        'Step 2, read Sample B. One temperature, 80 degrees Celsius, and the reading holds there for the whole time the melting lasts. That is the signature of a pure substance. Every particle in it is the same kind of particle, so they all come away from their neighbors at the same temperature, and the thermal energy going in while it melts goes into separating particles rather than into raising the temperature -- you already know that a pure substance holds its temperature steady while it changes state.',
        'Step 3, read Sample C. Not one temperature but a stretch of them, from 60 degrees Celsius to 95 degrees Celsius, with the reading climbing the whole way. Then the second spoonful gave a different stretch again, from 65 degrees Celsius to 90 degrees Celsius. Two or more substances are sitting in that jar without joining, they do not come away from their neighbors at the same temperature, and the recipe is not the same in every corner of the jar. A mixture has no melting point of its own, and this is what that looks like when somebody measures it.',
        'Step 4, name the trap before it catches you. WRONG: "Sample C melted across a stretch of temperatures because it was warmed too quickly for the reading to keep up." CORRECT: "Warming too quickly would blur both samples the same way, and Sample B held perfectly steady at 80 degrees Celsius under exactly the same treatment. The reading that settles it is the second spoonful, which gave a different stretch of temperatures from the first, and a pure substance cannot change its melting temperature from one scoop to the next, because every scoop of it is the same substance."',
        'Now the two checks. First, three clues of DIFFERENT KINDS agree that Sample C is the mixture and Sample B is not. One, the sharpness: a single temperature against a stretch of 35 degrees Celsius, since 95 degrees Celsius minus 60 degrees Celsius is 35 degrees Celsius. Two, the plateau: Sample B held its temperature while it melted and Sample C climbed throughout. Three, the repeat: a fresh scoop of Sample C behaved differently from the first scoop, which is evidence of a different kind altogether, because it is about whether the jar is the same everywhere rather than about any one reading. Second, change one thing and check that the answer moves the way it should. Take a fresh spoonful of Sample B from a different corner of its dish and warm it the same way: it melts at 80 degrees Celsius again and holds there again, and the verdict does not move -- which is the point, because a pure substance is the same substance in every corner. Then stir extra grains of one of the substances into Sample C and warm it once more: the stretch of temperatures shifts again, because the recipe changed and a mixture has no melting temperature of its own to hold on to.',
      ],
      answer:
        'Sample B is the pure substance and Sample C is a mixture. Sample B melted at one sharp temperature, 80 degrees Celsius, and held there until the last grain was liquid, which is what happens when every particle is the same kind and they all come away from their neighbors at the same temperature. Sample C softened across a stretch from 60 degrees Celsius to 95 degrees Celsius, and a second scoop from the same jar gave a different stretch, from 65 degrees Celsius to 90 degrees Celsius, which is what happens when two or more substances sit together without joining and the recipe is not the same everywhere.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-which-facts-identify',
      kind: 'try_yourself',
      problem:
        'A single solid lump is handed to you, labeled Sample D, and four facts about it are recorded: it has a mass of 250 grams; it is 6 centimeters long; each cubic centimeter of it has a mass of 2 grams; and it does not dissolve in water. You want to work out which substance Sample D is made of. Which of the recorded facts can help you do that?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'All four facts help, because every measurement taken from a sample is a property of the substance that sample is made of, and the more measurements you collect the more certain the identification becomes.' },
        { id: 'b', text: 'The mass of 250 grams and the length of 6 centimeters, because those two were measured directly with instruments, while the mass of each cubic centimeter was worked out from other numbers rather than measured.' },
        { id: 'c', text: 'Each cubic centimeter having a mass of 2 grams, and not dissolving in water, because neither of those changes if you break a piece off the lump, while the mass and the length belong to this particular lump.', correct: true },
        { id: 'd', text: 'Only the fact that it does not dissolve in water, because dissolving is a plain yes-or-no answer that a substance either gives or does not, and one property that clear names a substance on its own.' },
      ],
      expectedAnswer: 'Each cubic centimeter having a mass of 2 grams, and not dissolving in water, because neither of those changes if you break a piece off the lump, while the mass and the length belong to this particular lump.',
      hints: [
        'Take each fact in turn and ask one question about it: if you snapped a piece off the lump and measured again, would that number change? The facts that change belong to the lump. The facts that hold steady belong to the substance.',
        'Two of the four hold steady when the piece gets smaller, and you want both of them, because a single characteristic property can be shared by more than one substance.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-match-to-the-card',
      kind: 'try_yourself',
      problem:
        'A card lists three substances with two characteristic properties of each. Substance Four melts at 120 degrees Celsius, and each cubic centimeter of it has a mass of 4 grams. Substance Five melts at 120 degrees Celsius, and each cubic centimeter of it has a mass of 7 grams. Substance Six melts at 450 degrees Celsius, and each cubic centimeter of it has a mass of 7 grams. A solid piece labeled Sample E has a mass of 21 grams, takes up a volume of 3 cubic centimeters, and begins to melt at 120 degrees Celsius. Which substance is Sample E made of?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Substance Four, because it melts at 120 degrees Celsius exactly as Sample E does, and a melting temperature is a characteristic property, so a match on it settles the identification with nothing else to check.' },
        { id: 'b', text: 'Substance Six, because each cubic centimeter of Sample E has a mass of 7 grams, which is what the card gives for Substance Six, and the melting temperatures differ only because a small piece melts at a lower temperature than a large one.' },
        { id: 'c', text: 'None of the three, because Sample E has a mass of 21 grams and a volume of 3 cubic centimeters, and the card does not list either of those two numbers against any of the substances printed on it.' },
        { id: 'd', text: 'Substance Five, because 3 cubic centimeters of Sample E have a mass of 21 grams, so each cubic centimeter has a mass of 7 grams, and Substance Five is the only one on the card matching Sample E on both properties.', correct: true },
      ],
      expectedAnswer: 'Substance Five, because 3 cubic centimeters of Sample E have a mass of 21 grams, so each cubic centimeter has a mass of 7 grams, and Substance Five is the only one on the card matching Sample E on both properties.',
      hints: [
        'The card gives densities and melting temperatures, so turn what you know about Sample E into those same two quantities before you compare anything. A mass and a volume together give you the mass of one cubic centimeter.',
        'Two of the substances on the card agree with Sample E on one property each. A candidate is only accepted when it agrees on every characteristic property you have, so find the one that survives both comparisons.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-pure-from-boiling-record',
      kind: 'try_yourself',
      problem:
        'Two colorless liquids, Sample F and Sample G, are each warmed slowly in the same way, with the temperature read the whole time. Sample F climbs steadily to 82 degrees Celsius and then boils, and the temperature stays at 82 degrees Celsius the whole time it is boiling away, moving again only when the last of the liquid is gone. Sample G begins to boil at 91 degrees Celsius and its temperature keeps climbing while it boils, reaching 97 degrees Celsius before the last of it is gone. A second bottle of Sample G begins to boil at 88 degrees Celsius and finishes at 99 degrees Celsius. Which sample is the pure substance, and what tells you so?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sample F is the pure substance, because its temperature held at one value, 82 degrees Celsius, the whole time it boiled, while Sample G climbed across a stretch of temperatures and a second bottle of it boiled across a different stretch again.', correct: true },
        { id: 'b', text: 'Sample G is the pure substance, because it boiled at a higher temperature than Sample F, and the purer a liquid is the more thermal energy it takes to boil away, so the two bottles differ only because no two readings match exactly.' },
        { id: 'c', text: 'Neither one is pure, because a pure liquid has to boil at 100 degrees Celsius the way water does, and both of these boiled at a lower temperature than that, so whatever the readings did while each boiled, both have something mixed into them.' },
        { id: 'd', text: 'Neither sample can be judged from this, because a boiling temperature is not characteristic at all, and a larger amount of liquid takes longer to boil away, so a fair comparison would need the same amount poured out of each one.' },
      ],
      expectedAnswer: 'Sample F is the pure substance, because its temperature held at one value, 82 degrees Celsius, the whole time it boiled, while Sample G climbed across a stretch of temperatures and a second bottle of it boiled across a different stretch again.',
      hints: [
        'Do not compare the two boiling temperatures against each other. Look instead at what each temperature did WHILE the liquid was boiling: did the reading hold at one value, or travel across a stretch of values?',
        'One of the samples was tested twice, from two different bottles, and the two tests disagreed with each other. Ask what that disagreement can mean, given that every sample of one pure substance boils at the same temperature.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-size-and-appearance',
      kind: 'misconception_check',
      question:
        'A student writes: "A big block has more mass than a small block of the same stuff, so the big block has the higher density. And anyway you do not really need a routine for this, because two powders that look exactly alike are the same substance and two that look different are different substances." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'A big block has more mass than a small block of the same stuff, so the big block has the higher density.',
          misconception:
            'Reading density as "how heavy it is" rather than as how much mass is packed into each cubic centimeter, because a big block really is harder to lift and the word heavy does duty for both ideas in everyday speech.',
          correctsTo:
            'Density is the mass of each cubic centimeter, not the mass of the whole block. When a block of one substance is made bigger, its mass and its volume grow together, and the mass of each cubic centimeter does not move at all. Suppose a block has a mass of 60 grams and a volume of 20 cubic centimeters: each cubic centimeter has a mass of 60 grams divided by 20, which is 3 grams. Saw that block in half and you have 30 grams filling 10 cubic centimeters, and 30 grams divided by 10 is still 3 grams for each cubic centimeter. That is exactly why density can identify a substance while mass cannot. WRONG: "The bigger block is denser." CORRECT: "The bigger block has more mass and more volume, and precisely the same density."',
        },
        {
          answer: 'Two powders that look exactly alike are the same substance, and two that look different are different substances.',
          misconception:
            'Treating appearance as an identity test, because looking is free and instant while measuring a melting temperature or a density is neither.',
          correctsTo:
            'Appearance is the weakest evidence there is, and it fails in both directions. It fails one way because a great many substances are white grains and a great many are silvery gray solids, which is precisely why the two kitchen jars cannot be told apart by eye. It fails the other way because one substance can look quite different in different forms: ground to a fine powder it looks dull and pale, and grown into large grains it can look clear and glassy, while the temperature at which it melts and the mass of each of its cubic centimeters are the same either way. WRONG: "They look the same, so they are the same." CORRECT: "They match on color, which narrows the candidates and settles nothing. Measure a characteristic property, and then a second one of a different kind."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A characteristic property belongs to the substance, not to the piece: it does not change when you take a bigger or a smaller sample.',
        'The six this routine uses are melting point, boiling point, density, solubility, conductivity and flammability.',
        'Mass, volume, length and shape are not characteristic. They describe the lump in front of you and say nothing about what it is made of.',
        'Keep a mass and a volume together, though, because the mass of each cubic centimeter comes out of the pair and that does not change with the size of the piece.',
        'The routine: list the facts, cross out the ones that depend on how much you have, rule out any candidate that mismatches on even one characteristic property, and accept a candidate only when at least two properties of different kinds agree.',
        'One matching property is never enough, and color is never enough on its own, because a great many substances share a color.',
        'A pure substance is one kind of particle all the way through. It melts at one sharp temperature, holds there until the last of it is liquid, and gives that same temperature for every sample of it.',
        'A mixture has no melting point of its own. Its melting and boiling temperatures depend on how much of each substance is in it, so a different recipe gives different readings.',
        'To tell two look-alikes apart, hunt for one characteristic property on which they disagree, measured the same way on both.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.4', cedTitle: 'Characteristic Properties Identify a Substance' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
