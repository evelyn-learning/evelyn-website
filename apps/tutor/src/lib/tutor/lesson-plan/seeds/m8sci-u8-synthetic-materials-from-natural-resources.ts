/**
 * Grade 8 Science (Physical Science) — Chemical Reactions: Synthetic
 * Materials from Natural Resources.
 *
 * PROCEDURE-LED row (NGSS MS-PS1-3). One routine runs the whole lesson, and
 * it has two halves. The TRACE: name the natural resource the material
 * started from, name the chemical reaction that changed it, and name one
 * property the new material has that the resource did not. The WEIGHING:
 * read the stated purpose, pick the one stated benefit that touches that
 * purpose, name the one stated cost, and decide against the purpose rather
 * than against how the material sounds. Both worked examples run those moves
 * in the same order, and each ends with the two-part verification move
 * (three clues of different kinds agreeing, then one changed condition that
 * moves the answer).
 *
 * The three traps it is built to kill are (a) "synthetic means fake", which
 * settles the weighing before a single stated fact is read; (b) treating a
 * reshaping as a making -- melting, spinning and molding keep the substance,
 * and only a reaction makes a new one; and (c) reading conservation of atoms
 * as conservation of SUBSTANCE ("the atoms all came from the ore, so the iron
 * is the ore"), which is the row's sharpest distractor because its first
 * clause is true.
 *
 * SCOPE GUARD: this plan traces a described material back to a natural
 * resource and the reaction that changed it, compares the two sets of
 * properties, and weighs ONE stated benefit against ONE stated cost against a
 * STATED purpose. It never explains WHY a reaction happens or what holds the
 * new arrangement together, and it never leaves the facts printed inside the
 * item. The scope cell's
 * own clauses, verbatim, are these two: "(MS-PS1-3; the "impact" half stays
 * at the level of the information given -- resource use and consumption as a
 * systems question is Grade 6 `m6sci-u10-*`, LO descriptions read, not
 * re-taught)" and "Withholds polymer chemistry and organic naming
 * (`chem-organic-intro.ts`)." Per controller ruling 33: the cell carries NO
 * lineage clause -- there is no "Builds on"/"Assumes" naming a predecessor
 * lesson, and none has been invented here. What the boundary means at each
 * edge, and what is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 8.1 (physical change versus chemical reaction)
 *     is assumed, not re-taught: the concept segment names its test in two
 *     sentences as "the earlier lesson" and uses it only to separate a
 *     reshaping from a making. Row 8.2 (atoms rearranged, mass conserved) is
 *     used as a rule the student already holds; this file states that no atom
 *     is created or destroyed, but it never tallies atoms on the two sides of
 *     a reaction, never states a mass before or after, and never contrasts an
 *     open container with a sealed one. The only atom count anywhere is the
 *     spoken reading of carbon dioxide in try_yourself 2 ("one carbon atom and
 *     two oxygen atoms"), which is row 7.4's formula-reading convention, not
 *     row 8.2's before-and-after count.
 *     Row 8.3 (reactions that release or absorb thermal energy) is NOT
 *     entered: no reaction anywhere in this file is classified as releasing
 *     or absorbing, cement setting is described as locking into a solid and
 *     never as warming, and no temperature value is stated anywhere ("room
 *     temperature" appears once, in a vocabulary definition, as a condition
 *     rather than as a measurement). Row 6.4
 *     (characteristic properties) supplies the words for a property list and
 *     is not re-taught.
 *   - CHEMICAL FORMULAS AND EQUATIONS. One formula appears, in try_yourself
 *     2: carbon dioxide, read out as "C O two -- one carbon atom and two
 *     oxygen atoms" with the plain-text form in parentheses, exactly as row
 *     7.4 taught reading one. No reaction anywhere in this file is written as
 *     an arrow equation, no coefficient is attached to any formula, and no
 *     other product is named by formula.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary. Resource use and consumption as
 *     a systems question belongs to `m6sci-u10-*` and is not entered: this
 *     file never classifies a resource as renewable or nonrenewable, never
 *     describes how a resource is distributed or how long it will last, and
 *     never reaches climate. The words "greenhouse", "fossil fuel", "carbon
 *     record" and "global" appear nowhere in the authored body (this guard
 *     names them only to record their absence). Crude oil is "pumped from deep
 *     underground" and nothing is said about how it got there; how rock forms
 *     and what a quarry does to a hillside are equally absent. Every cost and
 *     benefit in this file is a fact printed inside its own item, and the
 *     student weighs only those.
 *   - GRADE 7 LIFE SCIENCE boundary. No life process is described or
 *     explained anywhere in this file. Living things appear only as SOURCES
 *     of raw material -- animal fat, wood ash, willow bark, sheep wool -- and
 *     no cell, organ, organism, growth or energy-in-an-organism sentence
 *     appears. The medicine trace says what the willow-bark substance does to
 *     a person in one clause (eases pain, is hard on the stomach) and goes no
 *     further into how.
 *   - HS CHEMISTRY boundary (the course above). The structures this file
 *     stops short of are POLYMER CHEMISTRY and ORGANIC NAMING: the words
 *     polymer, monomer and polymerization appear nowhere in the authored body
 *     (this guard names them only to record their absence), no carbon compound
 *     is named or drawn, no repeat unit or chain length is given, and the
 *     plastic trace goes no further than "a reaction joins small molecules
 *     from the oil end to end into far larger ones", which is a description
 *     of the change and not a mechanism for it. Also absent: reaction types
 *     and balancing (`chem-u5-*`), the mole and any molar quantity
 *     (`chem-u6-*`), solutions and solubility as a topic (`chem-u8-*`), and
 *     exothermic/endothermic as signed quantities (`chem-u9-*`).
 *   - AP PHYSICS boundary. No physics quantity is computed anywhere in this
 *     file. The only arithmetic is a stipulated price divided over a
 *     stipulated number of winters ($40 over 4 winters gives $10 a winter)
 *     and a stipulated bottle count (3 out of every 4 of 2,000 bottles is
 *     1,500). No formula of any kind appears -- not even one of this
 *     course's three -- because this row requires none.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every material,
 * property list and manufacturing step in this file is written out in words
 * inside the item that needs it, and every item is solvable from the text
 * printed inside it. Never write "as the diagram shows", and never assume the
 * student has a bottle, a jacket, a furnace or a bar of soap in front of them.
 *
 * NOTE ON BURNED EXAMPLES (controller rulings 32 and 36): part (i) of the
 * scope cell is copied verbatim into `los[0].description`, which is
 * STUDENT-FACING, and it names four concrete examples -- a plastic from crude
 * oil, a synthetic fiber, a medicine, and concrete. All four are therefore
 * BURNED for items and are used only in teaching segments (the plastic bottle
 * in worked example 1, the synthetic fleece in worked example 2, the willow
 * bark medicine and concrete in the concept segment). The three items use
 * fresh specimens that appear nowhere else in the file: soap from animal fat
 * and wood-ash lye, iron from iron ore, and glass from sand. A later editor
 * must not "helpfully" move a cell example into an item, and must not move an
 * item specimen into a teaching segment (ruling 22).
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 8.3 -> 8.4 -> 9.1
 * (`reactions-that-release-or-absorb-thermal-energy` before it,
 * `what-a-wave-is` after it). Both arrays are populated with the real
 * neighbors from the contract's course-chain table; the exemplars' empty
 * arrays are a registration-order artifact and are not copied.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U8_SYNTHETIC_MATERIALS_FROM_NATURAL_RESOURCES: LessonPlan = {
  id: 'evelyn.ms.m8sci.synthetic-materials-from-natural-resources.v1',
  title: 'Synthetic Materials from Natural Resources',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.synthetic-materials-from-natural-resources',
      standard: 'M8SCI-8.4',
      description:
        'Trace a synthetic material (a plastic from crude oil, a synthetic fiber, a medicine, concrete) back to the natural resource it came from and the chemical reaction that changed it, compare the new material\'s properties with its source, and weigh one benefit and one cost to society or the environment (NGSS MS-PS1-3).',
    },
  ],
  prerequisites: ['m8sci.reactions-that-release-or-absorb-thermal-energy'],
  followUps: ['m8sci.what-a-wave-is'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the backward trace: every made material started somewhere, and the interesting question is what changed on the way.',
      script:
        'Think about a clear plastic drink bottle. Nothing anywhere on Earth grows one, and no mine brings one up. That bottle started as thick dark oil pumped from deep underground, and somebody ran a chemical reaction on the oil to get it. A sidewalk started as rock in a quarry. A stretchy backpack strap started as the same oil the bottle did. None of these were carved or cut out of their source the way a wooden spoon is carved out of a tree -- carving keeps the wood, and every one of these came out of the change as a substance that did not exist before the reaction. Today you are going to run that trip backward. Given a material, you will name the natural resource it started from, name the change that made it, and say what the new material can do that its source could not. Then you will do the part that is harder than the chemistry: decide whether making it was worth it -- using only the facts you are handed, and not how the word "synthetic" happens to sound.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-trace-and-weigh',
      kind: 'concept',
      goal: 'Install the definition, the three-step trace, the reshaping-versus-making test, four one-sentence traces, and the two rules for weighing a benefit against a cost.',
      keyIdeas: [
        'WHAT A SYNTHETIC MATERIAL IS. A NATURAL RESOURCE is something people take from the Earth or from living things roughly as it is found: crude oil pumped from deep underground, rock quarried from a hillside, clay, timber, cotton. A SYNTHETIC material is one people make by running a CHEMICAL REACTION on a natural resource. Every atom in the new material came out of the starting materials -- no atom is created and none is destroyed, which is the rule you already hold -- but the reaction joins some atoms and separates others into a different arrangement, and a different arrangement of the same atoms is a DIFFERENT SUBSTANCE. That is why the new material has properties its source never had.',
        'THE TRACE, IN THREE STEPS, AND IT IS NOT FINISHED UNTIL ALL THREE ARE THERE. (1) Name the NATURAL RESOURCE or resources the material started from. (2) Name the CHANGE -- the reaction, and what it did, such as joining small molecules into larger ones, or taking one element away from another. (3) COMPARE PROPERTIES: name at least one property the new material has that the resource did not, using the same kind of words for both, such as what state it is in, what color it is, whether it bends or cracks, whether it dissolves, whether it carries electricity. A trace that names a resource and a reaction but no property difference has not proved that anything new was made.',
        'RESHAPING IS NOT MAKING, AND THE EARLIER LESSON ALREADY GAVE YOU THE TEST. Cutting, crushing, melting, spinning, weaving and pouring into a mold change the FORM of a substance and leave the substance alone: a cotton shirt is still cotton, a plank is still wood, and a melted-then-cooled solid is the same solid it was. Only a chemical reaction gives a synthetic material. The test is the one from the lesson on evidence of a reaction: does the material after have a property that nothing you started with had, and does undoing the physical condition -- cooling what was heated, drying what was wetted -- bring the original back? If the original comes back, the change was physical and nothing synthetic was made.',
        'FOUR TRACES, ONE SENTENCE EACH. A PLASTIC: crude oil is separated into small molecules, and a reaction joins those small molecules end to end into far larger ones, giving a clear solid that holds its shape where the oil was a dark runny liquid. A SYNTHETIC FIBER: the same oil, reacted into long thin threads that can be knitted into cloth which dries much faster than wool cloth does. A MEDICINE: willow bark contains a substance that eases pain but is hard on the stomach, and a reaction with a second substance turns it into a related compound, aspirin, that still eases pain and is easier on the stomach. CONCRETE: quarried rock and clay are roasted in a kiln, which drives a reaction that leaves cement powder, and mixing that powder with water and stones starts a second reaction that locks the whole mixture into a solid that can be poured into any shape first.',
        'WEIGHING A BENEFIT AGAINST A COST, AND THE TWO RULES THAT KEEP IT HONEST. A BENEFIT is something the material does better than what it replaced; a COST is what making it, using it or throwing it away takes or damages. Rule one: WEIGH ONLY THE STATED FACTS. If a question does not tell you what a material costs, how long it lasts, or what happens to it afterward, you cannot use that as a reason, however sure you feel. Rule two: WEIGH AGAINST A STATED PURPOSE. The words "better" and "worth it" mean nothing on their own -- better for what? The same material, with the same one benefit and the same one cost in play, can be the right choice for one purpose and the wrong choice for another. And note what neither rule says: "natural" does not mean harmless and "synthetic" does not mean harmful. Both sides of the weighing come from the facts in front of you.',
      ],
      vocabulary: [
        { term: 'natural resource', definition: 'a material people take from the Earth or from living things roughly as it is found, such as crude oil, rock, clay, timber or cotton.' },
        { term: 'synthetic material', definition: 'a material people make by running a chemical reaction on a natural resource, so that the product is a new substance with properties the resource did not have.' },
        { term: 'property', definition: 'something about a substance you can state and compare, such as its color, its state at room temperature, whether it bends or cracks, whether it dissolves, or whether it carries electricity.' },
        { term: 'benefit', definition: 'something a material does better than what it replaced, for a purpose someone has stated.' },
        { term: 'cost', definition: 'what making, using or throwing away a material takes or damages, stated as a fact rather than as an opinion about the material.' },
        { term: 'trade-off', definition: 'the situation where one choice brings both a benefit and a cost, so that the decision has to be made against a stated purpose rather than by finding an option with no downside.' },
      ],
      suggestedTools: ['show_flowchart', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-plastic-bottle',
      kind: 'worked_example',
      problem:
        'A clear plastic drink bottle. Here is everything known about where it came from. Crude oil is a dark, thick, runny liquid pumped from deep underground; it burns easily, and you cannot see through a jar of it. At a plant, the oil is first separated into small molecules. Then a reaction joins huge numbers of those small molecules end to end into molecules far larger than any the oil contained. The material that comes out of that reaction is a clear solid that holds its shape, springs back when you squeeze it, and holds water without soaking it up or leaking. Run the trace on it: resource, change, property comparison.',
      steps: [
        'Step 1, name the natural resource. Crude oil, pumped from deep underground. That is the only starting material named, and everything the bottle is made of has to have come out of it.',
        'Step 2, name the change. Two things happened, and only the second one is a reaction. The separating is a physical step -- it sorts molecules that were already there without making anything new. The joining is the reaction: small molecules that were loose in the oil are joined end to end into molecules far larger than any of them. Different arrangement, same atoms, new substance.',
        'Step 3, compare the properties, in the same kind of words on both sides. BEFORE: a liquid, dark, you cannot see through it, runny, burns easily. AFTER: a solid, clear, you can see straight through it, holds its shape, springs back when squeezed, holds water. Three properties in the after list -- being a solid that holds a shape, being clear, springing back -- belong to nothing in the before list. The trace is complete.',
        'WRONG: "The oil was melted and poured into a bottle mold, so the bottle is oil in a solid form." CORRECT: "The oil was separated and then REACTED; the bottle is a substance the oil never contained." Test the wrong version and it falls apart on its own: a substance that is solid because it was cooled goes back to liquid when it warms, and a warm bottle is a warm bottle. Melting and molding are reshaping, and reshaping keeps the substance.',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, three clues of DIFFERENT KINDS that agree. The property comparison says the after list holds properties nothing in the before list had. The reversal says no amount of warming, chilling or squeezing turns the bottle back into runny dark oil, and no physical step separates the oil back out of it. The origin says no well anywhere pumps up bottle material, so every gram of it had to be made. Three different kinds of evidence, one answer: a reaction made a new substance. Second, change one condition and check that the answer moves. Suppose the plant had only chilled the oil until it went stiff and waxy, and skipped the reaction. Warm it and the runny dark oil is back; nothing in the after list is a property the oil lacked; and the waxy stuff is not a synthetic material at all, just the same oil in a different state. The reaction is what made the difference, so removing it removes the answer.',
      ],
      answer:
        'Resource: crude oil, pumped from deep underground. Change: after a physical separating step, a reaction joins small molecules from the oil end to end into far larger ones. Property comparison: the oil is a dark runny liquid you cannot see through, and the bottle is a clear solid that holds its shape, springs back when squeezed, and holds water -- properties nothing in the before list had, so a new substance was made.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-fleece-jacket',
      kind: 'worked_example',
      problem:
        'A hiking club is buying jackets, and these are the facts it has. A fleece jacket is made from the same crude oil the bottle came from: a reaction turns small molecules from the oil into long fibers, and the fibers are knitted into cloth. The fleece keeps a person warm even when it is damp, and it dries in about an hour. A wool jacket is made from sheep wool, washed and spun with no reaction anywhere in the process; it also keeps a person warm when damp, and it takes most of a day to dry. Each fleece jacket is quoted at $40 and the club expects it to last 4 winters. Every time a fleece jacket is washed, tiny fibers break off and leave with the wash water, and a filter fitted to the machine is needed to catch them. The club states its purpose: jackets for weekend hikes in wet weather, where a jacket often has to be dry again by the next morning. Weigh one benefit against one cost and say whether the fleece meets the stated purpose.',
      steps: [
        'Step 1, read the stated purpose FIRST, before any fact about the jackets. It is: warm in wet weather, and dry again by the next morning. Everything that follows gets held against that sentence.',
        'Step 2, pick the benefit that touches the purpose. Both jackets keep a person warm when damp, so warmth is not what separates them and cannot decide anything. The fleece dries in about an hour and the wool takes most of a day. "Dry again by the next morning" is exactly what that difference is about, so the drying time is the benefit that counts here.',
        'Step 3, name the cost, exactly as stated and no further. Washing a fleece jacket sheds tiny fibers into the wash water, and catching them needs a filter on the machine. That is the whole stated cost. The price is a stated number rather than a judgment: $40 divided over 4 winters is $10 a winter. Notice what you cannot do with it -- no price is given for a wool jacket, so the money fact cannot separate the two options, and using it would break rule one.',
        'Step 4, weigh, against the purpose and nothing else. The benefit answers the purpose directly. The cost is real, it is stated, and the item also states the thing that reduces it: a filter catches the shed fibers. So the fleece meets the stated purpose, and the cost is a condition attached to that choice rather than a reason against it.',
        'WRONG: "Wool is natural, so the wool jacket is the better choice." CORRECT: "Wool keeps a person warm when damp and so does fleece, and wool takes most of a day to dry against the fleece\'s hour, so against THIS purpose the fleece is better." Being natural is not one of the stated facts about drying, warmth or shedding, and slipping it in is deciding before reading. WRONG: "The fleece sheds fibers, so it is the wrong choice." CORRECT: "The fleece sheds fibers, and the stated remedy is a filter; a cost does not outweigh a benefit automatically, it outweighs it only against a stated purpose."',
        'Now the two checks. First, three clues of DIFFERENT KINDS agree. The purpose match: the only stated difference that touches "dry by the next morning" is the drying time. The remedy: the one stated cost has a stated way of being caught, printed in the same set of facts. The unusable fact: the money number has no partner number for wool, so it cannot decide, which is a different kind of check because it works by ruling a reason OUT. Second, change one condition and see whether the answer moves. Suppose the club\'s purpose were instead a single dry week at summer camp with no washing machine anywhere. Now the drying-time benefit never comes up, the shedding cost never arises because nothing is washed, and nothing left in the stated facts favors the fleece -- so the wool is at least as good a choice. Same jackets, same benefit, same cost, different purpose, different answer. That is the test working.',
      ],
      answer:
        'Yes, against the stated purpose. Benefit: the fleece dries in about an hour where the wool takes most of a day, and drying by the next morning is what the club said it needs. Cost: washing sheds tiny fibers into the wash water, and a filter is needed to catch them. The benefit answers the stated purpose and the cost has a stated remedy, so the fleece meets the purpose -- and if the purpose changed, the answer could change with it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-soap-from-fat-and-ash',
      kind: 'try_yourself',
      problem:
        'For hundreds of years people made soap like this. Animal fat is a greasy solid; a lump of it will not mix into water and will not lift grease out of cloth. Wood ash is soaked in water to draw out a strong substance called lye. When the fat and the lye are heated together, the mixture reacts and a new solid forms. That solid dissolves in water and lifts grease out of cloth, and letting it cool for as long as you like never turns it back into fat and lye. Which statement traces this material correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The natural resources are animal fat and the lye drawn out of wood ash, a reaction between them during the heating made a new substance, and that new substance dissolves in water and lifts grease, which the fat could not do.', correct: true },
        { id: 'b', text: 'The fat was only melted by the heating and then cooled into a harder block, so the soap is the same fat in a different form, and it lifts grease because the heating loosened the grease-catching part that was locked inside the fat all along.' },
        { id: 'c', text: 'The lye is the whole source of the soap, because the heat burned the fat away completely and left none of its atoms behind in the solid, which is why the solid behaves nothing like fat does.' },
        { id: 'd', text: 'The soap is a natural material rather than a synthetic one, because both things it was made from came from living things -- an animal and a tree -- rather than from anything a factory had to dig up first.' },
      ],
      expectedAnswer: 'The natural resources are animal fat and the lye drawn out of wood ash, a reaction between them during the heating made a new substance, and that new substance dissolves in water and lifts grease, which the fat could not do.',
      hints: [
        'A finished trace has three parts: the natural resource or resources it started from, the change that was run on them, and one property the new material has that the starting material did not.',
        'Check the change carefully. Heating on its own can melt something, and melting reverses when the thing cools. Here the cooled solid dissolves in water and lifts grease, and the fat did neither -- so what happened during the heating was more than melting.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-iron-from-ore',
      kind: 'try_yourself',
      problem:
        'Iron ore is a reddish-brown rock dug out of the ground. A lump of it is brittle -- hit it and it cracks into pieces -- and it does not carry electricity. In a furnace, the ore is heated with carbon. The carbon takes the oxygen away from the iron that is joined to it in the ore, leaving iron metal behind and sending carbon dioxide -- C O two, one carbon atom and two oxygen atoms (CO2) -- off as a gas. The iron that runs out of the furnace is gray and shiny, bends under a hammer instead of cracking, and carries electricity. Which comparison of the new material with its source is correct, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'They are the same substance in two different shapes, because the furnace only melted the rock and let it run out into a new form, and a substance that has been melted and cooled is always the substance it started as.' },
        { id: 'b', text: 'They are different substances, because a reaction took away the oxygen that was joined to the iron in the ore, and what is left bends and carries electricity where the ore cracked and did not.', correct: true },
        { id: 'c', text: 'They are different substances, because the furnace added carbon into the rock that the rock did not contain before, and it is that added carbon which makes the metal bend under a hammer instead of cracking.' },
        { id: 'd', text: 'They have to be the same substance, because atoms are only rearranged in a reaction and never created or destroyed, and something built from the very same atoms cannot count as a different substance.' },
      ],
      expectedAnswer: 'They are different substances, because a reaction took away the oxygen that was joined to the iron in the ore, and what is left bends and carries electricity where the ore cracked and did not.',
      hints: [
        'Put the two property lists side by side. Brittle and not carrying electricity on one side; bending under a hammer and carrying electricity on the other. Then ask what the furnace actually did to produce that difference.',
        'Read the furnace description again and follow the oxygen. Part of what was in the ore left the furnace as a gas. If a part of the starting material is gone, what is left behind cannot be the starting material in a different shape -- even though no atom was created or destroyed anywhere in the process.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-glass-benefit-and-cost',
      kind: 'try_yourself',
      problem:
        'A town is choosing what to bottle its apple juice in, and it has these facts and no others. Glass is made by heating sand -- a natural resource of loose, dull grains -- together with soda ash and limestone until they react, and the melt cools into a clear hard solid that holds its shape and passes no taste into what is inside it. Keeping the furnace hot enough to run that reaction takes a large amount of fuel. Used glass can be melted down and made into new glass over and over without the glass getting worse. The town already collects 2,000 empty glass bottles a week and melts down 3 out of every 4 of them, which is 1,500 bottles a week going back into new glass. The town states its goal plainly: dig up less new sand each year. Which weighing of a benefit against a cost answers the goal the town actually stated?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The cost decides it, because the furnace has to be kept hot enough to run the reaction and that takes a large amount of fuel, which is a heavier drawback than anything sitting on the benefit side of this list.' },
        { id: 'b', text: 'The benefit decides it, because glass passes no taste into the juice, and for something people are going to drink, leaving the taste alone is the benefit worth choosing a container for even at a high fuel cost.' },
        { id: 'c', text: 'The benefit that answers this goal is that used glass can be melted into new glass over and over, so 1,500 bottles a week come back as glass instead of as new sand; the fuel cost is real and stated, but it is not what this goal is about.', correct: true },
        { id: 'd', text: 'The two sides cannot be weighed against each other here, because a benefit counted in bottles and a cost measured in fuel are different kinds of thing, and a comparison needs both sides handed to you in the same units.' },
      ],
      expectedAnswer: 'The benefit that answers this goal is that used glass can be melted into new glass over and over, so 1,500 bottles a week come back as glass instead of as new sand; the fuel cost is real and stated, but it is not what this goal is about.',
      hints: [
        'Read the town\'s stated goal again, then take each fact in turn and ask it one question: does this fact change how much new sand gets dug up? A fact that does not touch the goal cannot settle it, however true the fact is.',
        'A cost being real does not decide the question by itself, and neither does a benefit being real. The weighing is always against the purpose somebody stated, so find the one stated fact that pulls directly on that purpose.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-synthetic-means-fake',
      kind: 'misconception_check',
      question:
        'A student writes: "Synthetic just means fake, so a synthetic material is a cheap copy and the natural version is always the better choice. And anyway the synthetic thing is really still the resource it was made from, only processed." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'Synthetic means fake, so the natural version is always the better choice.',
          misconception:
            'Hearing "synthetic" as a verdict on quality rather than as a statement about how the material was made, which settles the comparison before a single stated fact has been read.',
          correctsTo:
            'Synthetic says one thing and one thing only: people made this substance by running a chemical reaction on a natural resource. It says nothing about whether the material is cheap, weak, or bad for anyone. A synthetic material is a real substance with real properties of its own, and those properties are sometimes better for a job and sometimes worse. It also runs the other way: natural does not mean harmless. Which material is the better choice is decided one job at a time, by holding the stated facts against a stated purpose. WRONG: "It is synthetic, so the natural one is better." CORRECT: "Here is the purpose, here is one stated benefit, here is one stated cost -- and here is which one the purpose picks."',
        },
        {
          answer: 'The synthetic material is really still the resource it was made from, only processed.',
          misconception:
            'Reading conservation of atoms as conservation of substance -- and this one is stubborn because the first half of the thought is true: every atom really did come out of the starting materials.',
          correctsTo:
            'Both halves of that sentence cannot stand together. It is true that no atom was created and none destroyed, so every atom in the new material came out of what went in. It is not true that the substance is unchanged, because what makes a substance the substance it is is how its atoms are joined and arranged, not only which atoms are present. Rearrange them and you have a different substance with a different set of properties -- which is exactly what the property comparison in a trace is for. And the earlier lesson gives the test: undo the physical condition, cooling what was heated or drying what was wetted, and see whether the original comes back. If it does, the change was only physical. If it does not, and the product has a property nothing you started with had, a new substance was made. WRONG: "Same atoms, so same stuff, only processed." CORRECT: "Same atoms, joined a different way, so a different substance -- and the new property list is the proof."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A synthetic material is one people make by running a CHEMICAL REACTION on a natural resource, so the product is a new substance rather than the resource in a new shape.',
        'No atom is created and none is destroyed. The reaction rearranges them, and a different arrangement of the same atoms is a different substance with a different property list.',
        'The trace has three steps and is not finished until all three are there: name the natural resource, name the reaction and what it did, and name one property the new material has that the resource did not.',
        'Reshaping is not making. Cutting, crushing, melting, spinning and molding keep the substance; undo the physical condition and the original comes back.',
        'Weighing rule one: use only the facts you are given. A fact you were not told is not a reason, however sure you feel about it.',
        'Weighing rule two: weigh against a STATED purpose. "Better" means nothing until someone says better for what, and the same benefit and cost can point different ways for different purposes.',
        'Natural does not mean harmless, and synthetic does not mean harmful. Both sides of the weighing come from the stated facts about the job.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.4', cedTitle: 'Synthetic Materials from Natural Resources' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
