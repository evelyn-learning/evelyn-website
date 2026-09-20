/**
 * Grade 8 Science (Physical Science) — Elements, Compounds & Mixtures.
 *
 * Row 7.1, procedure-led. One routine runs the whole lesson and it is two
 * questions asked in a fixed order: how many KINDS of atom are in the patch,
 * and where two different kinds are present, are they JOINED to each other or
 * only sitting side by side? One kind of atom gives an element; two or more
 * kinds joined gives a compound; two or more substances side by side and not
 * joined gives a mixture. Everything else in the file exists to stop the
 * student answering from question one alone.
 *
 * The two traps it is built to kill are (a) "two kinds of atom, so it is a
 * mixture" / "two kinds of atom, so it is a compound" -- both of which decide
 * from the count and never reach the joining question -- and (b) "the atoms
 * are joined, so it is a compound", which drops the other half of the
 * compound test, that the joined atoms must be of DIFFERENT elements. The
 * misconception check takes the second trap together with the salvaged
 * "salt is just sodium and chlorine mixed" error, because they are the same
 * mistake seen from its two sides.
 *
 * SCOPE GUARD: this plan classifies a particle picture as an element, a
 * compound or a mixture, and states that an atom is the smallest piece of an
 * element that is still that element. Its scope cell carries NO LINEAGE
 * CLAUSE -- there is no `m6*`/`m7*` predecessor named for this row, and none
 * is invented here. Its withheld clause, verbatim, is: "Withholds naming,
 * bonding, and the homogeneous/heterogeneous split
 * (`chem-u4-naming-compounds-formulas.ts`, `chem-u1-classifying-matter.ts`)."
 * Every absence claimed below is claimed of the plan's AUTHORED TEXT -- the
 * objective, the segments and the metadata -- and not of this guard or of the
 * chain loIds, which necessarily name what the plan excludes. What each edge
 * means, and what is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 6.4 (characteristic properties identify a
 *     substance) is the previous row and is assumed, not re-taught: "pure
 *     substance" is restated in the vocabulary list only, and the word
 *     "property" is used as something the student already holds. No
 *     characteristic property is named as a member of an identification set
 *     (no melting point, boiling point, density, solubility, conductivity or
 *     flammability anywhere in the authored text), and no sample is
 *     identified FROM its properties; properties appear here only to show
 *     that a compound does not keep its elements' properties and that the
 *     parts of a mixture do keep theirs. Row 7.2 (inside the atom) is the
 *     next row and this file stops at the outside of the atom: proton,
 *     neutron, electron, nucleus, charge and atomic number appear in no
 *     authored string, and an atom is treated throughout as a sphere with a
 *     kind and no inside. Row 7.3 (reading the periodic table) is not
 *     entered: no element symbol is written, no period, column or table
 *     position is named, and no element is placed relative to another. (The
 *     word "group" does appear, but only in the first worked example, where
 *     it means a cluster of joined spheres inside one particle and never a
 *     column of the periodic table.) The only count of elements anywhere is
 *     the settled "about 90 occur naturally, 118 known". Row 7.4 (molecules, formulas and extended
 *     structures) owns the formula-reading half of MS-PS1-1, so NO CHEMICAL
 *     FORMULA IS WRITTEN ANYWHERE IN THIS FILE -- not in symbols, not in
 *     parentheses -- and the word "molecule" is not used; every compound is
 *     given as a spoken atom count instead ("two hydrogen atoms joined to one
 *     oxygen atom"), and the molecule-versus-extended-structure distinction
 *     is never drawn. Row 6.1 (the particle model and the states of matter)
 *     owns solid, liquid and gas as particle arrangements; this file names a
 *     state only as an everyday property of a named material -- water is a
 *     liquid at room temperature, hydrogen and oxygen are gases, a bar of
 *     silver is solid -- and never explains a state by particle spacing or
 *     motion. Row 8.1 (evidence of a chemical reaction)
 *     owns the physical-versus-chemical verdict: nothing in this file is
 *     classified as a change of any kind, and nothing is heated, cooled or
 *     reacted anywhere in the file -- every sample is described as it
 *     already is. The word "mixed" occurs only in the misconception check --
 *     in its segment id and in the salt error it quotes and corrects -- and
 *     nowhere else in the file.
 *   - FIXED WAY, NOT FIXED RATIO. The scope cell requires "joined in a fixed
 *     way", and this file teaches exactly that, qualitatively: the kinds of
 *     atom and the arrangement are the same in every particle of a given
 *     compound. The word "ratio" does not appear, no proportion is computed,
 *     and the law of definite proportions is not named -- that quantitative
 *     form belongs to `chem-u1-classifying-matter.ts`.
 *   - SEPARATION. The definition of a mixture used here is "side by side, not
 *     joined, each keeping its own properties". No separation method is
 *     taught or named: there is no filtering, distilling, sieving,
 *     evaporating or magnet-pulling anywhere in the authored text, because
 *     separation methods belong to `chem-u1-classifying-matter.ts`.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears in the authored text. Air is
 *     named in the hook, in the concept segment and in the recap, and
 *     wherever it appears it is there only as a familiar mixture of gases
 *     that are not joined to one another; it is never treated as the
 *     atmosphere, and no weather, climate, cycle or layer of the air is
 *     mentioned.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *   - HS CHEMISTRY boundary: the structures this file stops short of are the
 *     chemical formula (no subscript, no symbol, no formula in any form), the
 *     chemical BOND -- the word "bond" appears in no authored string, atoms
 *     are only ever "joined", and the file says outright that WHY atoms join
 *     is not this lesson's question -- the naming of compounds from their
 *     elements, ionic versus covalent joining, and the
 *     homogeneous/heterogeneous split, which is never drawn: a mixture is one
 *     category here and is not subdivided. No mole, no mass and no equation
 *     appears.
 *   - AP PHYSICS boundary: there is no force, motion, energy or wave content
 *     in scope for this row, and none appears.
 *
 * NOTE ON BURNED CELL EXAMPLES (controller ruling 32/36): part (i) of this
 * row's scope cell is copied verbatim into `los[0].description`, which is
 * student-facing, and it names "table salt versus sodium metal and chlorine
 * gas". That example is therefore BURNED for items -- it is answerable from
 * the objective -- and it is used here only in teaching segments (concept
 * keyIdea 4, the misconception check and the recap), where it is the salvaged
 * framing from `g6-sci-atoms-elements.ts`. All three item specimens are
 * fresh: a two-sphere particle picture, a bar of pure silver halved down to
 * one atom, and a picture holding single atoms of one kind beside joined
 * pairs of another. None of the three appears in any teaching segment. Do not
 * "helpfully" move salt, water, gold or oxygen gas into an item later.
 *
 * NOTE ON SALVAGE: `g6-sci-atoms-elements.ts` supplied the hook framing
 * (everything from about 90 building blocks) and the misconception ("salt is
 * just sodium and chlorine mixed together"). Its claim that oxygen is a
 * flammable gas is FALSE and is not carried: oxygen does not burn, it is the
 * gas that burning needs, and this file says so. Its formulas, subscripts and
 * free-response item are not carried either.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every particle
 * picture in this file is written out in words inside the item -- how many
 * kinds of sphere, what size they are, and what is joined to what -- and
 * every item is solvable from the text printed inside it. Never write "look
 * at the particle diagram", and never assume the student has a periodic
 * table, a microscope or a sample in front of them.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U7_ELEMENTS_COMPOUNDS_AND_MIXTURES: LessonPlan = {
  id: 'evelyn.ms.m8sci.elements-compounds-and-mixtures.v1',
  title: 'Elements, Compounds & Mixtures',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.elements-compounds-and-mixtures',
      standard: 'M8SCI-7.1',
      description:
        'Classify a particle picture as an element (all atoms the same kind), a compound (atoms of two or more elements joined in a fixed way, with properties unlike its elements -- table salt versus sodium metal and chlorine gas), or a mixture (different substances side by side, not joined, each keeping its properties), and state that an atom is the smallest unit of an element (NGSS MS-PS1-1).',
    },
  ],
  prerequisites: ['m8sci.characteristic-properties-identify-a-substance'],
  followUps: ['m8sci.inside-the-atom'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set the puzzle the three categories answer: an endless list of materials built from a very short list of ingredients, which is only possible if there is more than one way to put ingredients together.',
      script:
        'Empty your bag onto a table and you could name twenty different materials without trying. The aluminum shell of a laptop. The salt on a bag of fries. The plastic of a bottle, and the water inside it. The air filling the room around all of it. It looks like an endless list, and it is not. Every one of those materials is built out of a short list of basic ingredients called elements, and only about 90 of them occur naturally -- 118 are known in total, once you count the ones made in laboratories. Ninety ingredients, and out of them comes everything you have ever picked up. That only works because there is more than one way to put ingredients together. You can have one ingredient on its own. You can have two or more joined into something new, which turns out to behave like neither of them. Or you can have two or more sitting side by side, each still being itself. Those are the only three, and by the end of today you will have a two-question routine that takes any sample, looks at it atom by atom, and tells you which of the three you are holding.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-ways-matter-is-put-together',
      kind: 'concept',
      goal: 'Install the two questions in order, the three categories they sort into, the atom as the smallest piece of an element, and the two traps before they are met.',
      keyIdeas: [
        'TWO QUESTIONS DECIDE EVERY CASE, AND THEY GO IN THIS ORDER. Imagine you could zoom in on a tiny patch of a sample until the individual atoms came into view. Question one: how many KINDS of atom are in the patch? Question two, asked only when two or more kinds are present: are the different kinds JOINED to each other, or only sitting side by side? One kind of atom means an ELEMENT. Two or more kinds, joined, means a COMPOUND. Two or more substances side by side and not joined means a MIXTURE. Joined means held together so that the group travels as one particle and the sample behaves as one new substance. Side by side means each substance goes on being itself, with its own properties, while the other one sits next to it.',
        'AN ELEMENT IS ONE KIND OF ATOM, AND AN ATOM IS AS SMALL AS AN ELEMENT GETS. A bar of pure gold is an element: every single atom in it is a gold atom and there is nothing else. An ATOM is the smallest piece of an element that is still that element. Halve a piece of gold, halve it again, and keep going, and one gold atom is the last thing on the way down that is still gold. About 90 elements occur naturally and 118 are known in total, and every material in the world is built from that list. Here is the part that catches people out: the atoms of one element are allowed to be joined to one another. The oxygen gas you are breathing travels as pairs -- two oxygen atoms joined together make one particle of it -- and it is still an element, because both atoms in the pair are the same kind.',
        'A COMPOUND IS ATOMS OF TWO OR MORE ELEMENTS JOINED IN A FIXED WAY. Water is the clearest case. Every particle of water is two hydrogen atoms joined to one oxygen atom -- every particle, in every glass of water anywhere. Never three hydrogen atoms, never one. That is what FIXED means: the kinds of atom and the way they are put together are the same in every particle of that compound. Because the arrangement is fixed, a compound is one substance with one set of properties, in exactly the way an element is. This lesson does not ask WHY the atoms stay joined, and it does not ask you to give the compound a name. It asks what you can see when you zoom in on the particles.',
        'A COMPOUND DOES NOT INHERIT THE PROPERTIES OF THE ELEMENTS IN IT. Table salt is a compound of two elements, sodium and chlorine. On its own, sodium is a soft, shiny metal that reacts violently with water. On its own, chlorine is a poisonous yellow-green gas. Joined, they make a white crystal that is safe to sprinkle on food. Water tells the same story with different elements: hydrogen on its own is a gas that burns, oxygen on its own is the gas that burning needs, and joined they make the liquid people use to put fires out. WRONG: "A compound behaves like the elements in it, added together." CORRECT: "A compound is a new substance, and its properties have to be found out rather than predicted from its elements."',
        'A MIXTURE IS TWO OR MORE SUBSTANCES SIDE BY SIDE, NOT JOINED, AND EACH ONE KEEPS ITS OWN PROPERTIES. The air around you is a mixture: mostly nitrogen, with oxygen next and small amounts of other gases, all drifting among one another and none of them joined to the others. The oxygen in air goes on behaving exactly like oxygen -- it is the part of the air a fire needs -- and the nitrogen goes on behaving like nitrogen. Nothing new has been made. A mixture can be built from two elements, from two compounds, or from a compound and an element; what makes it a mixture is not what the parts are, it is that the parts are not joined.',
        'THE TRAP IS ANSWERING FROM QUESTION ONE. Counting the kinds of atom feels like it settles the case, and it never does. Two kinds of atom, joined, is a compound. The same two kinds of atom, side by side, is a mixture. And one kind of atom joined to itself is still an element, because "joined" only makes a compound when the atoms joined are of DIFFERENT elements. So run both questions, in order, every time. Question one tells you whether question two is needed. Question two is the one that decides.',
      ],
      vocabulary: [
        { term: 'atom', definition: 'the smallest piece of an element that is still that element.' },
        { term: 'element', definition: 'a substance made of only one kind of atom, such as gold, oxygen or sodium.' },
        { term: 'compound', definition: 'a substance made of atoms of two or more elements joined in a fixed way, with its own properties, which are not the properties of those elements.' },
        { term: 'mixture', definition: 'two or more substances sitting side by side without being joined, each one keeping its own properties.' },
        { term: 'pure substance', definition: 'a single kind of matter with its own fixed set of properties; an element and a compound are both pure substances, and a mixture is not.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-three-magnified-samples',
      kind: 'worked_example',
      problem:
        'Three samples have been magnified until the individual atoms can be seen. Sample A: every particle is a single sphere, and every sphere is the same size and the same shade as every other. Sample B: every particle is a group of three spheres joined together -- one large sphere in the middle with a smaller sphere joined on each side -- and every group in the sample is built the same way. Sample C: the sample holds two kinds of single sphere, some large and some small, drifting among one another, with no sphere joined to any other sphere. Classify each sample as an element, a compound or a mixture.',
      steps: [
        'Sample A, question one. How many kinds of atom are in the patch? Every sphere is the same size and the same shade, so there is one kind. Question two never comes up, because it is only asked where two or more kinds are present. One kind of atom means an element. Notice what did not matter here: these atoms happen to be traveling singly, but they could have been joined in pairs and the answer would be identical, because both atoms of such a pair would still be the same kind.',
        'Sample B, question one. Two kinds of atom are present: the large spheres and the small ones. Question two: are the different kinds joined to each other? Yes -- each group of three is held together as one particle, and the large sphere and the two small spheres are inside the same group. Two kinds of atom, joined, means a compound. The extra clue that confirms it is that every group in the sample is built the same way, which is what "joined in a fixed way" looks like when you zoom in.',
        'Sample C, question one. Two kinds of atom again, large spheres and small ones -- the same answer Sample B gave, which is why question one cannot be the end of the routine. Question two is where the two samples part company: nothing in Sample C is joined to anything. Each sphere is its own particle, and the large ones and the small ones are simply among one another. Two substances side by side and not joined means a mixture, and each of the two goes on being the element it was.',
        'WRONG: "Samples B and C both contain two kinds of atom, so they are both compounds." CORRECT: "Samples B and C contain the same two kinds of atom and they are not the same kind of matter, because in B the unlike atoms are joined into one particle and in C they are not." Counting the kinds of atom gets you as far as question two. It never answers question two.',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree, taking Sample B. The count of kinds says two, which rules out an element. What each particle is made of says every particle is one large atom with two small ones held in the same group, which rules out two separate substances sitting together. And the uniformity across the whole sample agrees with both: every particle matches every other, and a mixture of two elements would have to show you the two kinds apart as well as together. Three different kinds of evidence, one answer.',
        'Second, change one thing and check that the answer moves. Take Sample C and join each large sphere to two of the small ones, leaving the same atoms in the same patch. The number of atoms has not changed and the kinds of atom have not changed, but the sample is now Sample B, and the verdict has moved from mixture to compound. Nothing about which atoms are present decided this. Whether the unlike atoms are joined decided it, and that is the whole reason the routine has a second question.',
      ],
      answer:
        'Sample A is an element: one kind of atom. Sample B is a compound: two kinds of atom joined into one particle, with every particle built the same way. Sample C is a mixture: the same two kinds of atom side by side and not joined, each still the element it was.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-jars-same-atoms',
      kind: 'worked_example',
      problem:
        'Two sealed glass jars sit on a bench, and between them they hold only two kinds of atom: hydrogen atoms and oxygen atoms. Jar 1 holds hydrogen gas and oxygen gas together. Nothing in it is joined across the two kinds: the hydrogen travels as pairs of hydrogen atoms, the oxygen travels as pairs of oxygen atoms, and the two sorts of pair drift among one another. Jar 2 holds water, in which every particle is two hydrogen atoms joined to one oxygen atom. Classify what is in each jar, and explain how two jars holding the same kinds of atom can hold such different materials.',
      steps: [
        'Jar 1, question one. Two kinds of atom are present, hydrogen and oxygen. Question two: are the different kinds joined to each other? No. Hydrogen atoms are joined to hydrogen atoms and oxygen atoms to oxygen atoms, and that is joining WITHIN an element, which never makes a compound. No hydrogen atom in the jar is joined to an oxygen atom. So Jar 1 holds two substances side by side and not joined: a mixture, and specifically a mixture of two elements.',
        'Jar 2, the same two questions. Two kinds of atom, hydrogen and oxygen. Are the different kinds joined? Yes -- in every particle, two hydrogen atoms are joined to one oxygen atom, and every particle in the jar is built that way. Two kinds of atom, joined in a fixed way: a compound. Jar 2 holds one substance, not two.',
        'Now the properties, which is where the difference becomes something you could notice from across the room. In Jar 1 nothing has joined the hydrogen to the oxygen, so the hydrogen goes on being hydrogen and the oxygen goes on being oxygen: at room temperature both of them are gases, so Jar 1 looks empty. Jar 2 holds water, which at room temperature is a liquid you could pour out. Hydrogen on its own is a gas that burns; oxygen on its own is the gas that burning needs; joined into water they make the liquid people use to put fires out. A compound does not keep the properties of its elements, and two jars holding the same kinds of atom is the sharpest way to see that.',
        'WRONG: "Both jars hold hydrogen and oxygen, so both jars hold the same thing in different amounts." CORRECT: "Both jars hold the same two kinds of ATOM, and they hold two completely different materials, because in one jar the unlike atoms are joined and in the other they are not." A list of the atoms in a sample never tells you what the sample IS. It only tells you what the sample is made from.',
        'Now the two checks. First, three clues of different kinds -- and watch the first one decide nothing, which is the point of running all three. Clue one, the list of atoms present: identical for the two jars, so it separates them not at all, and that is useful, because it shows you which clue is doing the work. Clue two, whether the unlike atoms are joined: different for the two jars, and this is the clue the classification rests on. Clue three, the properties: two gases in one jar and a liquid in the other, which agrees with clue two, because only a compound has properties that neither of its elements has. Two clues agree and the third one is silent, which is a stronger result than three restatements of the same clue would be.',
        'Second, change one thing and check that the answer moves. Leave every atom in Jar 1 exactly where it is and imagine each oxygen atom joined to two hydrogen atoms. The atoms are the same atoms and there are just as many of them, but the jar now holds one substance instead of two, a compound instead of a mixture, and a liquid instead of a gas. The answer moved when the joining moved, and nothing else was touched.',
      ],
      answer:
        'Jar 1 holds a mixture of two elements: hydrogen atoms are joined only to hydrogen atoms and oxygen atoms only to oxygen atoms, so the two substances sit side by side and each keeps its own properties. Jar 2 holds a compound: in every particle two hydrogen atoms are joined to one oxygen atom, making one new substance with properties neither element has. The same kinds of atom are in both jars; what differs is whether the unlike atoms are joined.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-classify-sample-d',
      kind: 'try_yourself',
      problem:
        'Sample D has been magnified until the individual atoms can be seen. Every particle in it is exactly the same: one large sphere with one small sphere joined to it. The large spheres are all one kind of atom, the small spheres are all a different kind of atom, and there is nothing else anywhere in the sample. Is Sample D an element, a compound or a mixture?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A compound, because two different kinds of atom are present and they are joined to each other, with every particle in the sample built from the same kinds of atom in the same arrangement.', correct: true },
        { id: 'b', text: 'A mixture, because two different kinds of atom are present, and a sample that turns out to hold more than one kind of atom is a mixture of the elements it holds.' },
        { id: 'c', text: 'An element, because every particle in the sample is identical to every other particle, and a sample in which nothing varies from one particle to the next has to be a single element.' },
        { id: 'd', text: 'An element, because the large atom and the small atom are joined into one particle, and atoms that travel as one particle count as one kind of matter, which makes the sample one element.' },
      ],
      expectedAnswer: 'A compound, because two different kinds of atom are present and they are joined to each other, with every particle in the sample built from the same kinds of atom in the same arrangement.',
      hints: [
        'Run question one first: how many kinds of atom are in the patch? The answer is more than one, so question one cannot finish the job and you have to go on to question two.',
        'Question two asks whether the DIFFERENT kinds are joined to each other, not whether anything at all is joined. Here the large atom and the small atom are in the same particle, and every particle is built the same way.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-silver-bar-halved',
      kind: 'try_yourself',
      problem:
        'A jeweler has a small bar of pure silver with no other metal in it. She cuts the bar in half, keeps one half, cuts that in half, and goes on doing this. Every piece she keeps is still silver. Suppose she could go on cutting far beyond what any real tool allows. What is the smallest piece she could end up with that is still silver, and how should the original bar be classified?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'She could go on halving forever and always be left with silver, because any piece of silver, however small it has already become, can be cut again into two smaller pieces that are both silver.' },
        { id: 'b', text: 'A single silver atom, because an atom is the smallest piece of an element that is still that element, and the bar is an element, because every atom in it is a silver atom and nothing else is in it.', correct: true },
        { id: 'c', text: 'The smallest grain she could still see without help, because a piece of matter that has been broken up until it is too small to see has gone past the point where it counts as a piece of silver.' },
        { id: 'd', text: 'A single silver atom, but the bar is a mixture, because the bar holds enormous numbers of silver atoms rather than just one, and a sample that holds many particles at once counts as a mixture of them.' },
      ],
      expectedAnswer: 'A single silver atom, because an atom is the smallest piece of an element that is still that element, and the bar is an element, because every atom in it is a silver atom and nothing else is in it.',
      hints: [
        'The cutting stops being possible at the point where taking one more piece away would leave you with something that is no longer silver. What is the name for the smallest piece of an element that is still that element?',
        'Then classify the bar with question one. How many kinds of atom are in a bar of pure silver? A mixture needs two or more different substances sitting side by side, not many pieces of the same one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-sample-f',
      kind: 'try_yourself',
      problem:
        'Sample F has been magnified until the individual atoms can be seen. Some of the particles are single spheres, and every one of those single spheres is the same kind of atom. The rest of the particles are pairs, and in each pair two spheres of a second kind of atom are joined to each other. No single sphere is joined to any pair anywhere in the sample, and the singles and the pairs drift among one another. Is Sample F an element, a compound or a mixture?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A compound, because atoms of two different elements are present in the same patch, and whenever a sample turns out to contain two elements at once those elements have combined with each other, which is what makes the sample a single compound.' },
        { id: 'b', text: 'A compound, because some of the atoms in this sample are joined to other atoms instead of drifting on their own, and joining is exactly what separates a compound from a mixture, so a sample with joined atoms in it is a compound.' },
        { id: 'c', text: 'A mixture, because nothing joins the singles to the pairs, so the sample holds two substances side by side -- one element whose atoms travel singly and one element whose atoms travel joined in pairs -- and each keeps its own properties.', correct: true },
        { id: 'd', text: 'An element, because atoms joined to identical atoms are still one element, so a sample holding nothing but single atoms and pairs of identical atoms is one element that is showing up in two different forms at the same time.' },
      ],
      expectedAnswer: 'A mixture, because nothing joins the singles to the pairs, so the sample holds two substances side by side -- one element whose atoms travel singly and one element whose atoms travel joined in pairs -- and each keeps its own properties.',
      hints: [
        'Question two does not ask whether anything in the sample is joined. It asks whether the DIFFERENT kinds of atom are joined TO EACH OTHER. Check that one carefully before you answer.',
        'Take the two kinds of particle separately. Single atoms all of one kind: what is that on its own? Pairs of two identical atoms: what is that on its own? Now ask what you have when both are in the patch and nothing joins them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-joined-versus-mixed',
      kind: 'misconception_check',
      question:
        'A student writes: "Table salt is just sodium and chlorine mixed together. And the oxygen gas we breathe must be a compound, because its atoms come in joined pairs." Two different things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'Table salt is just sodium and chlorine mixed together.',
          misconception:
            'Reading a compound as a mixture of the elements it was built from, because the everyday word "mixed" covers both cases -- you put two things together either way -- and nothing in that word distinguishes atoms lying side by side from atoms joined into one particle.',
          correctsTo:
            'In table salt the sodium atoms and the chlorine atoms are JOINED, which is what makes salt a compound rather than a mixture, and the properties settle it beyond argument. A real mixture of those two elements would still contain a soft, shiny metal that reacts violently with water and a poisonous yellow-green gas, each behaving exactly as it does on its own, because the parts of a mixture keep their own properties. Table salt behaves like neither of them: it is a white crystal that is safe to sprinkle on food. A substance exists that was not there before, so the atoms cannot merely be sitting side by side. WRONG: "Salt is sodium and chlorine mixed." CORRECT: "Salt is sodium and chlorine joined, and what they make is a new substance whose properties belong to it and to neither element."',
        },
        {
          answer: 'Oxygen gas must be a compound, because its atoms come in joined pairs.',
          misconception:
            'Taking "joined" as the whole test for a compound and dropping the other half of that test, which is that the joined atoms have to be of DIFFERENT elements.',
          correctsTo:
            'Both atoms in a pair of oxygen gas are oxygen atoms. That is one kind of atom, so it is one element, however firmly the two are held together. A compound needs atoms of two or more DIFFERENT elements joined to each other. Run the two questions in their proper order and this mistake cannot happen: question one asks how many kinds of atom are present, the answer for oxygen gas is one, and that settles it as an element before question two is ever reached. Nitrogen gas is the same case, its particles being pairs of nitrogen atoms, and nitrogen is an element too. WRONG: "The atoms are joined, so it is a compound." CORRECT: "The atoms are joined and they are all the same kind, so it is an element."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two questions decide every case, in this order: how many KINDS of atom are present, and where two or more kinds are present, are the different kinds JOINED to each other or only side by side?',
        'An ELEMENT is one kind of atom. A bar of pure gold is nothing but gold atoms.',
        'An ATOM is the smallest piece of an element that is still that element. About 90 elements occur naturally and 118 are known in total.',
        'Atoms of one element may be joined to one another and the substance is still an element -- oxygen gas travels as pairs of oxygen atoms.',
        'A COMPOUND is atoms of two or more elements joined in a fixed way: every particle of water is two hydrogen atoms joined to one oxygen atom, every time.',
        'A compound is a new substance and does not keep its elements\' properties. Sodium is a soft, shiny metal that reacts violently with water, chlorine is a poisonous yellow-green gas, and joined they make table salt.',
        'A MIXTURE is two or more substances side by side and not joined, each keeping its own properties. Air is mostly nitrogen, with oxygen next, drifting among one another and joined to nothing.',
        'Counting the kinds of atom never finishes the job. Two kinds joined is a compound; the same two kinds side by side is a mixture; one kind joined to itself is still an element.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.1', cedTitle: 'Elements, Compounds & Mixtures' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
