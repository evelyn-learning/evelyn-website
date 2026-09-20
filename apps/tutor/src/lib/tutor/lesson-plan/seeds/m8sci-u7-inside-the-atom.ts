/**
 * Grade 8 Science (Physical Science) — Inside the Atom: Protons, Neutrons &
 * Electrons.
 *
 * Row 7.2, concept-led. The previous row left the atom as a sphere with a
 * kind and no inside; this row opens it. One mental model runs the whole
 * lesson: a tiny, dense nucleus of protons and neutrons at the center, much
 * lighter electrons moving through the space around it, and ONE of those
 * three counts -- the protons -- deciding which element the atom is. The two
 * halves that make it hard are that the mass and the room run in opposite
 * directions (almost all the mass in almost none of the space), and that a
 * student who has just learned three particle names wants all three of them
 * to matter to the element's identity, when only one of them does.
 *
 * The two traps it is built to kill are (a) the atomic number read as a
 * headcount of the nucleus, or as the neutron count -- the named error
 * `atomic-number-counts-neutrons` -- and (b) "the atom is mostly empty
 * space" read as "so it is full of air", which puts atoms inside an atom.
 * The misconception check takes them one after the other.
 *
 * SCOPE GUARD: this plan describes the atom as a tiny, dense nucleus of
 * protons (positive) and neutrons (no charge) with much lighter electrons
 * (negative) moving around it, states that the proton count -- the atomic
 * number -- is what makes an atom a particular element, and states that a
 * neutral atom has equal protons and electrons. Its scope cell carries NO
 * LINEAGE CLAUSE: no `m6*` or `m7*` predecessor file is named for this row,
 * the Salvage column reads "none", and none is invented here. What the cell
 * carries in that position instead is a note about the standard itself --
 * "DCI PS1.A, extended one step toward HS-PS1-1 because the G6 table
 * deferred 'atomic structure' here; see sign-off 3" -- which is a curriculum
 * ruling and not a lesson lineage, so it appears here and never in a spoken
 * field. Its withheld clause, verbatim: "Withholds isotopes, mass number and
 * average atomic mass (`chem-u2-subatomic-particles-isotopes.ts`,
 * `chem-u2-average-atomic-mass.ts`), electron shells and configurations
 * (`chem-u2-electron-configurations.ts`), the history of atomic models
 * (`chem-u2-atomic-theory.ts`), and ion formation
 * (`chem-u3-ion-formation.ts`)." Every absence claimed below is claimed of
 * the plan's AUTHORED TEXT -- the objective, the segments and the metadata
 * -- and not of this guard or of the chain loIds, which necessarily name
 * what the plan excludes. What each edge means, and what is deliberately
 * ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 7.1 (elements, compounds and mixtures) is the
 *     previous row and is assumed, not re-taught: the words element and atom
 *     are used as ones the student already holds, and no sample anywhere in this
 *     file is sorted into the element / compound / mixture trichotomy that
 *     row 7.1 owns. Naming WHICH element an atom is, from its proton count,
 *     is this row's own work and is not that sorting. The word "compound"
 *     appears in no authored prose (it survives only inside the prerequisite
 *     loId), nothing is described as joined or side by side, and no sample
 *     is compared with another for what it is made of. Row 7.3 (reading the periodic table) is the next row and
 *     this file stays out of it: no element symbol is written, no period,
 *     row, column or table position is named, no element is placed relative to
 *     another by position, and no element is called a metal, a nonmetal or a
 *     metalloid. The four elements this file names -- hydrogen, helium,
 *     carbon and sodium -- are named only by their proton counts, which are
 *     on the contract's safe-figure list. The one pointer to it is a single sentence in the concept
 *     segment saying that where an element sits among the others, and how to
 *     read one off a chart of them, is the next lesson. Row 7.4 (molecules,
 *     formulas and extended structures) owns the formula-reading half of
 *     MS-PS1-1, so NO CHEMICAL FORMULA IS WRITTEN ANYWHERE IN THIS FILE, in
 *     symbols or in parentheses, and the word "molecule" is not used. Row
 *     3.2 (electric forces and charge) owns the two kinds of charge and is
 *     cited, not re-taught: "you already know that opposite charges attract"
 *     is said once, in concept keyIdea 1, as the reason the electrons stay
 *     near the nucleus, and nothing else about charge is explained -- no
 *     rubbing, no transfer, no charged object, and no strength-with-distance
 *     claim. Every charge in this file is a word ("positive charge",
 *     "negative charge", "no charge"); no charge is ever written as a signed
 *     number. Row 6.3 (density) owns density as mass per volume: the word
 *     "dense" is used of the nucleus, as the scope cell itself uses it, and
 *     purely qualitatively -- no mass is divided by a volume anywhere, and
 *     no sample is compared with another by density. Row 6.1 (the particle
 *     model and the states of matter) is not entered: no state of matter is
 *     named and no particle spacing or particle motion of a solid, liquid or
 *     gas is described.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears in the authored text. There is no
 *     rock, mineral, water cycle, atmosphere, planet or orbit in this file;
 *     in particular the words orbit, circle and path appear in no authored
 *     string: the electrons are only ever "moving around" or "moving through
 *     the space around" the nucleus, which is the scope cell's own phrase,
 *     because a drawn path is both a model this row does not teach and a
 *     Grade 6 solar-system image this course does not borrow.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *   - HS CHEMISTRY boundary: the quantities and structures this file stops
 *     short of are the MASS NUMBER (the protons and neutrons ARE added together,
 *     in several places, but only ever to answer "where is the mass"; the
 *     sum is never given a name, never called an atom's mass, and never
 *     attached to an element as a property of it); ISOTOPES (no atom is ever said to come in
 *     versions, no two atoms of one element are compared, and no neutron
 *     count is offered as a thing that can vary); AVERAGE ATOMIC MASS and
 *     any mass expressed as a number with a unit (every mass in this file is
 *     a comparison to the mass of one proton); ELECTRON SHELLS,
 *     ENERGY LEVELS AND CONFIGURATIONS (the file says outright that how the
 *     electrons are arranged is not its question, and the words shell,
 *     level, orbital and configuration appear in no authored string); the
 *     HISTORY OF ATOMIC MODELS (no scientist, experiment or dated model is
 *     named); and ION FORMATION (the word "ion" appears in no authored
 *     string). The one place this file touches the last of those is
 *     deliberate and is one sentence long, in concept keyIdea 4: an atom
 *     that ends up with one more or one fewer electron than it has protons
 *     is no longer neutral but is still the same element. That sentence is
 *     what makes the word "neutral" in this row's objective mean something.
 *     It names no such atom, gives no charge number, and says nothing about
 *     how, why or when an atom would come to have one.
 *   - AP PHYSICS boundary: there is no force calculation anywhere in this
 *     file. The attraction between the nucleus and the electrons is stated
 *     in words once and never quantified; Coulomb's law, any inverse-square
 *     reasoning and any computed field are absent, as is every other formula
 *     -- this row uses none of the three the course allows.
 *
 * NOTE ON BURNED CELL EXAMPLES (controller rulings 32 and 36): part (i) of
 * this row's scope cell is copied verbatim into `los[0].description`, which
 * is student-facing, so everything it names is answerable from the objective
 * and is burned for items. The cell names no element and no specimen, but it
 * does state all three rules outright, which is why not one of the three
 * items is a definition question: each gives counts and asks what follows
 * from them. The teaching segments use carbon, hydrogen, helium and sodium;
 * all three item specimens are fresh and unnamed atoms given only by their
 * counts (18 protons with 22 neutrons beside 20 protons with 20 neutrons; a
 * neutral atom with 15 electrons; an atom of 26 protons and 30 neutrons with
 * 26 electrons). None of those counts appears in any teaching segment, and
 * no named element appears in any item. Do not "helpfully" move carbon or
 * sodium into an item later.
 *
 * NOTE ON SALVAGE: the Salvage column for this row reads "none", and nothing
 * was mined. No legacy `g8-sci-*`, `g7-sci-*` or `g6-sci-*` file was opened
 * for content.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every atom in
 * this file is written out in words inside the item -- how many protons, how
 * many neutrons, how many electrons, and which of them is where -- and every
 * item is solvable from the text printed inside it. Never write "look at the
 * labeled atom", and never assume the student has a chart of the elements in
 * front of them.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U7_INSIDE_THE_ATOM: LessonPlan = {
  id: 'evelyn.ms.m8sci.inside-the-atom.v1',
  title: 'Inside the Atom: Protons, Neutrons & Electrons',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.inside-the-atom',
      standard: 'M8SCI-7.2',
      description:
        'Describe the atom as a tiny, dense nucleus of protons (positive) and neutrons (no charge) with much lighter electrons (negative) moving around it, explain that the number of protons -- the atomic number -- is what makes an atom a particular element, and that a neutral atom has equal protons and electrons (NGSS DCI PS1.A).',
    },
  ],
  prerequisites: ['m8sci.elements-compounds-and-mixtures'],
  followUps: ['m8sci.reading-the-periodic-table'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Shorten the ingredient list from about 90 elements to three particles, and put the whole difference between one element and another onto a single count, so the student wants to know which count it is.',
      script:
        'You already know that everything you can pick up is built from about 90 elements that occur naturally. Today that list gets a lot shorter. Those 90 elements are themselves built from the same short list of just three kinds of particle. Gold and oxygen are not made of different ingredients. They are made of the same ingredients in different numbers, and exactly one of those numbers is what sets which element you end up with. Get that number wrong by one and you are holding something else entirely. There is a second surprise waiting in there too. Almost all of an atom is space. If you could blow one atom up to the size of a big sports stadium, the part that holds almost all of its mass would be about the size of a pea, sitting at the center spot, with nothing but moving electrons in all the rest of it. By the end of today you will be able to take any atom described to you -- so many protons, so many neutrons, so many electrons -- and say which element it is, whether it carries any charge, and where its mass is.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-inside-the-atom',
      kind: 'concept',
      goal: 'Install the three particles and their places, the mass-versus-room split, the atomic number as the proton count that names the element, the neutral-atom rule, and the routine that answers any question of this shape.',
      keyIdeas: [
        'THREE KINDS OF PARTICLE, AND EACH ONE HAS A PLACE. Every atom is built from the same three kinds of particle. PROTONS carry positive charge. NEUTRONS carry no charge at all. Those two are packed tightly together in the NUCLEUS, a tiny clump at the center of the atom. ELECTRONS carry negative charge, and they are not in the nucleus -- they move through the space around it. A carbon atom is the picture to hold on to: 6 protons and 6 neutrons packed in a tiny nucleus at the center, and 6 electrons moving around it. You already know that opposite charges attract, and that attraction is what keeps the negative electrons near the positive nucleus. Where exactly any one electron is, and how the electrons are arranged out there, is not this lesson\'s question.',
        'THE NUCLEUS IS ALMOST ALL OF THE MASS AND ALMOST NONE OF THE ROOM. Those are two different questions about the same clump, and they have opposite answers, which is why people get them tangled. Room first. Blow one whole atom up to the size of a big sports stadium and the nucleus would be about the size of a pea at the center spot; everything else is the space the electrons move through. Name the limit of that picture in the same breath: a stadium is full of air and seats, and the space around a nucleus is not full of anything at all. Mass second. A proton and a neutron have almost exactly the same mass as each other, and a single electron is nearly two thousand times lighter than a proton. Add those facts up and more than 99.9 percent of any atom\'s mass is sitting in that pea-sized nucleus. Almost none of the room, almost all of the mass: that is what DENSE means.',
        'THE NUMBER OF PROTONS IS WHAT MAKES AN ATOM A PARTICULAR ELEMENT, AND THAT NUMBER HAS A NAME. The number of protons in an atom\'s nucleus is called its ATOMIC NUMBER, and it is the whole of what decides which element the atom is. An atom with 1 proton is hydrogen, the smallest atom there is. An atom with 2 protons is helium. An atom with 6 protons is carbon. An atom with 11 protons is sodium. Change the proton count and you are not looking at the same element any more; you are looking at a different element, with properties of its own. Two counts that do NOT decide it: the neutrons, which carry no charge and are not what the element is named by, and the electrons, which are not in the nucleus at all.',
        'A NEUTRAL ATOM HAS EXACTLY AS MANY ELECTRONS AS PROTONS. A proton\'s positive charge and an electron\'s negative charge are equal in size and opposite in kind, so one of each cancels out. An atom that has the same number of each has nothing left over, and that is what NEUTRAL means: no overall charge. A carbon atom is neutral with 6 protons and 6 electrons. A sodium atom is neutral with 11 protons and 11 electrons, and its nucleus also holds 12 neutrons, which change the mass and change nothing about the charge, because they have no charge to cancel. Notice that the word "neutral" is doing real work in that rule. If an atom ended up with one more electron than it has protons, or one fewer, it would no longer be neutral -- and it would still be exactly the same element, because nothing at all happened to its protons.',
        'WHAT THIS LESSON DOES NOT ASK. It does not ask how the electrons are arranged in the space around the nucleus. It does not ask how many neutrons a given element has, or ask you to state an atom\'s mass as a number. It does not ask why the protons stay packed together. And it does not ask where an element sits among all the others, or how to read one off a chart of them -- that is the next lesson. This lesson asks three things only: what is inside an atom, how many of each, and which of those counts names the element.',
        'HOW TO ANSWER ANY QUESTION ABOUT WHAT IS INSIDE AN ATOM. First, find the proton count. That is the atomic number, and on its own it names the element, every time. Second, check whether you were told the atom is neutral. If you were, the electron count equals the proton count; if you were not, you have not been given the electron count and you cannot work it out from the protons. Third, treat the neutrons as mass with no charge: their count is not handed to you by either of the other two numbers, and it never changes which element you are looking at. Fourth, if the question is about mass, count the protons and the neutrons together, because those are the heavy particles and the electrons are far too light to move the answer.',
      ],
      vocabulary: [
        { term: 'nucleus', definition: 'the tiny, dense clump at the center of an atom, where the protons and the neutrons are packed together.' },
        { term: 'proton', definition: 'a particle in the nucleus that carries positive charge; the number of them is what makes an atom a particular element.' },
        { term: 'neutron', definition: 'a particle in the nucleus that carries no charge, with almost the same mass as a proton.' },
        { term: 'electron', definition: 'a particle that carries negative charge and moves through the space around the nucleus; it is nearly two thousand times lighter than a proton.' },
        { term: 'atomic number', definition: 'the number of protons in an atom\'s nucleus, which is what names the element.' },
        { term: 'neutral atom', definition: 'an atom with exactly as many electrons as protons, so that the positive and negative charges cancel and the atom has no overall charge.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-read-an-atom-from-its-counts',
      kind: 'worked_example',
      problem:
        'An atom has 11 protons and 12 neutrons packed into its nucleus, and the atom is neutral. Work out how many electrons it has, say which element it is, and say where almost all of its mass sits and how you know.',
      steps: [
        'Start with the proton count, because that is the one number that names the element. This nucleus holds 11 protons, so the atomic number is 11, and an atom with 11 protons is sodium. Nothing else in the description was needed to get that, and nothing else in the description could have changed it.',
        'Now the electrons. The problem says the atom is neutral, and neutral means the positive and negative charges cancel with nothing left over. A proton\'s positive charge and an electron\'s negative charge are equal in size and opposite in kind, so cancelling with nothing left over means one electron for every proton. There are 11 protons, so there are 11 electrons, moving through the space around the nucleus.',
        'Now the mass. The heavy particles are the protons and the neutrons, which have almost the same mass as each other, so the nucleus comes to about 23 times the mass of a single proton: 11 protons and 12 neutrons is 23 heavy particles. Outside the nucleus there are 11 electrons, and one electron is nearly two thousand times lighter than a proton, so all 11 of them together come to 11 divided by about 1,800, which is less than one hundredth of the mass of a single proton. Twenty-three proton-masses inside against less than one hundredth of a proton-mass outside: the mass is in the nucleus, and it is not close.',
        'WRONG: "The nucleus holds 23 particles, so the atomic number is 23." CORRECT: "The atomic number counts the protons and only the protons, so it is 11. The 23 is the count of heavy particles, which answers a question about mass and answers nothing about which element this is."',
        'Now run the two checks a science answer needs, because most of this is not arithmetic you can redo. First, look for clues of DIFFERENT KINDS that agree that this is sodium. Clue one is the definition: the atomic number is the proton count, and 11 protons names the element on its own. Clue two is a charge check, which is a different kind of reasoning altogether: 11 positive charges in the nucleus needed exactly 11 negative charges outside to leave the atom neutral, and that worked out, so the 11 is consistent with the neutrality we were told about. Clue three is what the problem did NOT have to tell us: the electron count was never given, and we named the element anyway -- which shows the naming did not come from the electrons.',
        'Second, change exactly one thing and check that the answer moves the way it should. Put one more proton into the nucleus and leave everything else alone. The atom now has 12 protons, and it is not sodium any more; it is the element whose atoms have 12 protons, with properties of its own. Now put the proton back and take one electron away instead. That atom is no longer neutral, because there are now 11 positive charges and only 10 negative ones -- and it is still sodium, because the nucleus was not touched. One change moves the element, the other one does not. That is the clearest possible evidence that the protons, and nothing else, decide which element an atom is.',
      ],
      answer:
        'The atom has 11 electrons, because a neutral atom has one electron for every proton. It is sodium, because its atomic number -- its proton count -- is 11. Almost all of its mass is in the nucleus: 11 protons and 12 neutrons come to about 23 times the mass of a single proton, while all 11 electrons together come to less than one hundredth of a proton\'s mass.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-mass-versus-room',
      kind: 'worked_example',
      problem:
        'A student writes: "An atom is mostly empty space, and the nucleus is only a tiny speck at the middle of it. So the nucleus can only be a tiny part of the atom\'s mass. Most of the mass has to be out in all that space where the electrons are, because there is so much more of it out there." Use a helium atom -- 2 protons and 2 neutrons in the nucleus, 2 electrons moving around it -- to show what has gone wrong.',
      steps: [
        'Separate the two questions the student has run together. Question one is how much ROOM each part of the atom takes up. Question two is how much MASS each part has. They are different questions, and for an atom they have opposite answers, which is exactly why this mistake is so easy to make.',
        'Question one, the room. The student has this part right, and it is worth saying so. The nucleus really is a speck: blow the whole atom up to the size of a big sports stadium and the nucleus would be about the size of a pea at the center spot. The limit of that picture, said in the same breath: a stadium is full of air and seats, while the space around a nucleus is not full of anything -- the electrons move through it and there is nothing else there.',
        'Question two, the mass, and this is where the student goes wrong. Count the heavy particles and weigh them against the light ones. The nucleus holds 2 protons and 2 neutrons, which have almost the same mass as each other, so the nucleus comes to about 4 times the mass of a single proton. Outside it are 2 electrons, and one electron is nearly two thousand times lighter than a proton, so the two of them together come to 2 divided by about 1,800, which is about one thousandth of the mass of a single proton. Four proton-masses against one thousandth of a proton-mass. That puts more than 99.9 percent of this atom\'s mass inside the nucleus.',
        'WRONG: "There is far more space out there, so there must be far more mass out there." CORRECT: "Space is not mass. The nucleus is a small amount of room with a large amount of matter packed into it, and the space around it is a large amount of room with almost nothing in it." That is the whole meaning of calling the nucleus dense.',
        'Now the two checks. First, three clues of DIFFERENT KINDS that agree. Clue one is the arithmetic just done: about 4 proton-masses inside against about one thousandth of a proton-mass outside. Clue two is about charge rather than mass, and it rules out a tempting shortcut: the neutron carries no charge at all and still weighs as much as a proton, so mass is not tracking charge, and you cannot read one off the other. Clue three is that the answer does not depend on which atom you pick -- run the same count on a carbon atom, with 6 protons and 6 neutrons inside and 6 electrons outside, and you get about 12 times a proton\'s mass inside against about three thousandths of a proton\'s mass outside. Same verdict, different atom, so helium was not a special case.',
        'Second, change exactly one thing and check that the answer moves the right way. Take one electron away from the helium atom. Its mass changes by less than one part in a thousand of the whole, far too little to matter, and the atom is still helium -- it is simply no longer neutral. Now put that electron back and take one PROTON out of the nucleus instead. The mass drops from about 4 proton-masses to about 3 proton-masses, a drop of about a quarter, and the atom is not helium at all any more, because the proton count is what names the element. The same "remove one particle" change gives two completely different results, which shows that the three particles are not interchangeable and that the student\'s "there is more space, so there is more mass" rule cannot be right.',
      ],
      answer:
        'The student is right about the room and wrong about the mass. The nucleus does take up almost none of the atom, but it holds almost all of the mass: helium\'s 2 protons and 2 neutrons come to about 4 times the mass of a single proton, while its 2 electrons together come to only about one thousandth of a proton\'s mass, so more than 99.9 percent of the atom\'s mass is in the nucleus. Room and mass are different questions, and for an atom they point opposite ways.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-same-element-or-not',
      kind: 'try_yourself',
      problem:
        'Two atoms are described. The first has 18 protons and 22 neutrons packed into its nucleus, with 18 electrons moving in the space around it. The second has 20 protons and 20 neutrons packed into its nucleus, with 20 electrons moving in the space around it. Are these two atoms of the same element? Pick the answer whose reasoning is correct.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Yes, the same element, because each of these two nuclei holds 40 particles in total, and it is the total number of particles packed into a nucleus that decides which element an atom is.' },
        { id: 'b', text: 'No, different elements, because the first atom has 18 protons and the second has 20, and the number of protons -- the atomic number -- is what makes an atom a particular element.', correct: true },
        { id: 'c', text: 'Yes, the same element, because both of these atoms are neutral, with exactly as many electrons outside as protons inside, and two atoms that balance their charges in that way are two atoms of one element.' },
        { id: 'd', text: 'No, different elements, because the first nucleus holds 22 neutrons and the second holds 20, and it is the neutron count in the nucleus that separates one element from the next one.' },
      ],
      expectedAnswer: 'No, different elements, because the first atom has 18 protons and the second has 20, and the number of protons -- the atomic number -- is what makes an atom a particular element.',
      hints: [
        'Only one of the three counts names the element. Find that count in each atom and compare those two numbers with each other, before you look at anything else in the description.',
        'Check each piece of reasoning against the rule, not just its yes-or-no verdict. An answer can reach the right verdict for a reason that is not true, and adding up everything inside a nucleus is not how the atomic number is worked out.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-neutral-atom-fifteen-electrons',
      kind: 'try_yourself',
      problem:
        'A neutral atom has 15 electrons moving in the space around its nucleus. Nothing else about the atom has been described to you. What can you say for certain about what is inside its nucleus?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It holds 15 neutrons, because the neutrons are the particles inside the nucleus that balance the electrons outside it, and a neutral atom carries one neutron for every electron.' },
        { id: 'b', text: 'It holds 30 particles in all, 15 protons and 15 neutrons, because a nucleus is built from the two kinds of heavy particle in equal numbers, packed side by side.' },
        { id: 'c', text: 'It holds 15 protons, because a neutral atom has one electron for every proton, so the count of electrons outside gives you the count of protons inside -- and nothing here fixes the number of neutrons.', correct: true },
        { id: 'd', text: 'Nothing can be said for certain about the protons, because the electrons move in the space outside the nucleus, and a count taken out there cannot reach the particles that are packed inside it.' },
      ],
      expectedAnswer: 'It holds 15 protons, because a neutral atom has one electron for every proton, so the count of electrons outside gives you the count of protons inside -- and nothing here fixes the number of neutrons.',
      hints: [
        'The word "neutral" is the piece of information that does the work here. Which two of the three kinds of particle carry charges that cancel each other, and what has to be true of their counts for nothing to be left over?',
        'Then be careful about the third particle. Which of the answers claims a count that the description never gives you any way to reach?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-where-the-mass-is',
      kind: 'try_yourself',
      problem:
        'An atom has 26 protons and 30 neutrons packed into its nucleus, and 26 electrons moving in the space around it. Almost all of this atom\'s mass sits in the nucleus, even though the nucleus takes up almost none of the atom\'s room. Which explanation of that is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The electrons are moving so fast that their mass is spread thinly through the whole of the outer space of the atom, which leaves the still, heavy particles at the center holding the atom\'s mass in one place.' },
        { id: 'b', text: 'The nucleus is the part of the atom that carries positive charge, and positive charge is heavier than negative charge, so the particles carrying it weigh far more than the particles that carry the negative charge outside.' },
        { id: 'c', text: 'There are 56 particles packed into the nucleus and only 26 electrons outside it, so the nucleus holds a little more than twice as much mass as the electrons do, and that is what makes the center of the atom the heavy part.' },
        { id: 'd', text: 'A proton and a neutron have almost the same mass as each other and 56 of them are packed into the nucleus, while a single electron is nearly two thousand times lighter than a proton, so all 26 electrons together add almost nothing.', correct: true },
      ],
      expectedAnswer: 'A proton and a neutron have almost the same mass as each other and 56 of them are packed into the nucleus, while a single electron is nearly two thousand times lighter than a proton, so all 26 electrons together add almost nothing.',
      hints: [
        'Counting particles is only half of the job. Ask how heavy each kind of particle is as well as how many of each there are, and put the two together.',
        'One of the answers compares the two counts and stops there. Check whether treating every particle as weighing the same could possibly give you "almost all" of the mass in one place.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-atomic-number-and-empty-space',
      kind: 'misconception_check',
      question:
        'A student writes: "The atomic number tells you how many particles are packed into the nucleus. And people say an atom is mostly empty space, which must mean the space around the nucleus is full of air." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'The atomic number tells you how many particles are packed into the nucleus.',
          misconception:
            'Reading the atomic number as a headcount of the whole nucleus, because the protons and the neutrons sit packed together in the same place and look from the outside like one crowd rather than two kinds of particle with two different jobs.',
          correctsTo:
            'The atomic number counts the protons, and only the protons. A carbon nucleus holds 6 protons and 6 neutrons, which is 12 particles packed together, and carbon\'s atomic number is 6, not 12. The reason it is defined that way is that the proton count is the one thing that names the element, and a headcount of the whole nucleus would not do that job. Keep the two numbers apart by what each one answers. The proton count answers "which element is this?" The protons and neutrons added together answer "where is the mass?" and nothing else. WRONG: "The nucleus holds 12 particles, so the atomic number is 12." CORRECT: "The nucleus holds 6 protons, so the atomic number is 6, and it holds 6 neutrons as well, which add mass and no charge."',
        },
        {
          answer: 'The space around the nucleus must be full of air.',
          misconception:
            'Hearing "empty" and reaching for the emptiest-seeming thing there is, which for most people is air, because nothing in ordinary life is ever truly empty and air is what is left when everything visible has been taken away.',
          correctsTo:
            'Air cannot be inside an atom, and the reason is a rule the student already has: air is itself made of atoms. It is mostly nitrogen and oxygen, and every particle of it is built from protons, neutrons and electrons of its own. Putting air inside an atom would mean putting whole atoms inside one atom, which is the wrong way round -- an atom is what air is made OF. What is actually in that space is the electrons, moving through it, and nothing else. So "mostly empty space" means exactly what it says: almost all of the room inside an atom holds no matter at all. WRONG: "The space in an atom is filled with air." CORRECT: "The space in an atom holds the moving electrons and nothing else, because air is made of atoms and cannot be inside one."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every atom is built from three kinds of particle: protons with positive charge and neutrons with no charge, packed together in the nucleus, and electrons with negative charge, moving through the space around it.',
        'A carbon atom is the picture to keep: 6 protons and 6 neutrons in a tiny nucleus at the center, and 6 electrons moving around it.',
        'The nucleus takes up almost none of the atom\'s room -- a pea at the center spot of a sports stadium -- and holds more than 99.9 percent of its mass. Almost no room and almost all the mass is what DENSE means.',
        'A proton and a neutron have almost the same mass as each other. A single electron is nearly two thousand times lighter than a proton, which is why the electrons barely count toward an atom\'s mass.',
        'The ATOMIC NUMBER is the number of protons, and it is the whole of what makes an atom a particular element: an atom with 1 proton is hydrogen, one with 2 protons is helium, one with 6 protons is carbon, one with 11 protons is sodium.',
        'The atomic number is not the neutron count and not a headcount of the nucleus. Add the protons and the neutrons only when the question is about mass.',
        'A NEUTRAL atom has exactly as many electrons as protons, so the equal and opposite charges cancel and the atom has no overall charge. The neutrons have no charge to cancel.',
        'Change the proton count and you have a different element. Change the electron count and the atom stops being neutral, but it is the same element it always was.',
        'To read any atom: proton count names the element; if it is neutral, the electron count matches the proton count; the neutrons add mass and no charge.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.2', cedTitle: 'Inside the Atom: Protons, Neutrons & Electrons' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
