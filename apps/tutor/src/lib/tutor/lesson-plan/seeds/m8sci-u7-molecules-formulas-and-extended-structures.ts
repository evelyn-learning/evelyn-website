/**
 * Grade 8 Science (Physical Science) — Molecules, Formulas & Extended
 * Structures.
 *
 * Row 7.4, procedure-led. One routine runs the whole lesson and it has four
 * steps in a fixed order: name the kinds of atom from the symbols, count each
 * kind (a number counts only the symbol it follows; no number means one),
 * add the counts, and then ask the question the counts do not answer on
 * their own -- does this substance come in separate molecules, or is it one
 * extended structure that never stops? Step 4 decides what the counts MEAN,
 * and it is the half of the skill that gets skipped.
 *
 * The two traps it is built to kill are (a) attaching a formula's number to
 * the wrong symbol, or to every symbol at once, and (b) hearing "molecule"
 * as the word for a piece of any substance at all, so that a grain of table
 * salt becomes "one big salt molecule". The misconception check takes the
 * second trap together with "a formula with a number in it must be a
 * compound", because both are the same failure to look at what the symbols
 * are actually saying.
 *
 * SCOPE GUARD: this plan reads a given simple chemical formula into a count
 * of atoms of each kind, matches a formula to a particle model described in
 * words, and separates substances made of separate molecules from extended
 * structures that have no separate molecules in them. Its scope cell carries
 * NO LINEAGE CLAUSE -- no `m6*`/`m7*` predecessor is named for this row, and
 * none is invented here. Its withheld clause, verbatim, is: "Withholds
 * writing formulas from names, subscripts vs coefficients, polyatomic ions,
 * and ionic vs covalent bonding (`chem-u4-naming-compounds-formulas.ts`,
 * `chem-u4-ionic-bonding.ts`, `chem-u4-covalent-bonding-lewis.ts`)." Every
 * absence claimed below is claimed of the plan's AUTHORED TEXT -- the
 * objective, the segments and the metadata -- and not of this guard or of
 * the chain loIds, which necessarily name what the plan excludes. What each
 * edge means, and what is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 7.1 (elements, compounds and mixtures) owns the
 *     picture-level half of MS-PS1-1 and is assumed, not re-taught:
 *     "compound" is restated in the vocabulary list, "element" is used
 *     throughout as a word the student already holds, and neither is taught
 *     from a particle model. No sample is classified as an element, a
 *     compound or a mixture as the task of any item, and the word "mixture"
 *     does not occur in the authored body at all; the nearest this file comes
 *     to 7.1's territory is two distractors whose named error is reading a
 *     formula as a list of atoms that are NOT joined, and one keyIdea
 *     sentence saying that element and compound are settled by counting the
 *     different SYMBOLS in the formula. Row 7.2 (inside the atom) is not
 *     entered: proton, neutron, electron, nucleus, charge, ion and atomic
 *     number appear in no authored string, and an atom is treated throughout
 *     as a kind with no inside -- which is also why nothing here says what
 *     HOLDS the atoms together.
 *     Row 7.3 (reading the periodic table) is the previous row and supplies
 *     the element symbols; this file uses H, O, C, N, Na and Cl as symbols
 *     the student already reads, and never names a period, a column or a
 *     metal/nonmetal class, and never locates an element by position. (The
 *     word "group" is frequent in the authored body, but it always means a
 *     cluster of joined atoms and never a column of the periodic table, and
 *     the words "periodic table" themselves do not occur in the body at
 *     all.)
 *     The word "metal" occurs twice in the authored body, both times as an
 *     example of an extended structure, which this row's own scope cell
 *     names; a copper wire is described the same way in the same keyIdea. Row 8.1 (evidence of a chemical reaction)
 *     is the next row: nothing here reaches a physical-change-or-reaction
 *     verdict, and no before-and-after property comparison is run. Row 8.2
 *     (rearranging atoms and conservation of mass) is not entered either --
 *     no atom is counted across a change, no mass is stated, and no reaction
 *     appears anywhere in the file.
 *   - CHEMICAL FORMULAS AND HOW THEY ARE WRITTEN. No subscript glyph is used
 *     anywhere; every formula is given in its spoken form, and the
 *     plain-text formula follows in parentheses at each formula's first
 *     appearance in a segment ("H two O (H2O)"), with later mentions inside
 *     the same segment left in the spoken form alone; the one-symbol formula
 *     C reads the same either way and takes no parenthesis. The atom
 *     count in words sits in the same sentence everywhere EXCEPT where
 *     producing that count is the very thing being asked -- the second worked
 *     example's problem statement and the three item stems -- because this is
 *     the row that assesses formula reading, and a stem that supplies the
 *     count has no item left in it. The spoken form is present in every one
 *     of those stems, which is the part of the rule that protects a student
 *     who has to hear or say the formula. No arrow equation appears, no
 *     coefficient is written in front of any formula, and no formula is built
 *     from the name of a substance.
 *   - HS CHEMISTRY boundary (the course above): this file stops short of the
 *     words bond, ionic, covalent, share and transfer, of Lewis structures,
 *     of polyatomic ions, of ion formation, of the subscript-versus-
 *     coefficient distinction, of balancing, and of the mole and molar mass.
 *     What IS deliberately allowed at that edge is the statement that an
 *     extended structure's formula reports a RATIO rather than counting a
 *     molecule -- that is the Grade 8 form of the idea and the scope cell
 *     requires the molecule/extended-structure split -- but the terms
 *     empirical formula, molecular formula and formula unit are not used and
 *     no formula is derived from a ratio. The electricity that splits water
 *     appears in exactly one sentence, as a way of taking a substance apart
 *     for evidence, and never as current, a circuit or a topic.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row and none appears. Diamond is used as a network of
 *     carbon atoms and never as a mineral or a gemstone; no rock, mineral,
 *     hardness, streak or luster appears, which is Grade 6's mineral row.
 *     Solid carbon dioxide appears only in the second worked example's
 *     closing contrasting case, where "dry ice" is named in two consecutive
 *     sentences to show what a solid built from separate molecules does;
 *     changes of state as a topic are Grade 8 rows 6.1 and 6.2 and are not
 *     taught here, and no melting or boiling temperature is stated anywhere
 *     in the file.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears -- no cell, no organism, no living thing.
 *   - AP PHYSICS boundary: this row is chemistry and carries no physics. No
 *     quantity in the authored body has a unit, no formula of the three this
 *     course allows is used, and nothing is computed beyond adding small
 *     whole numbers of atoms.
 *   - TABLE SALT is described as sodium and chlorine joined in a repeating
 *     pattern, and its particles are called neither atoms nor ions, because
 *     ion formation is `chem-u3-ion-formation.ts`. The formula Na Cl (NaCl)
 *     is read as a ratio, one sodium for every one chlorine.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every particle
 * model in this file is written out in words inside the segment that uses it,
 * and every item is solvable from the text printed inside it. Never write
 * "as the model shows", and never send the student to a printed periodic
 * table. Note also that the scope cell's own examples -- water, carbon
 * dioxide, oxygen gas, table salt, diamond and metals -- are copied verbatim
 * into the student-facing `los[0].description`, so they are BURNED for items
 * and appear in teaching segments only. The three items run on ammonia,
 * methane and two unnamed samples instead; do not "helpfully" swap one of
 * them back to water.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 7.3 -> 7.4 ->
 * 8.1 (`reading-the-periodic-table` before it,
 * `evidence-of-a-chemical-reaction` after it).
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U7_MOLECULES_FORMULAS_AND_EXTENDED_STRUCTURES: LessonPlan = {
  id: 'evelyn.ms.m8sci.molecules-formulas-and-extended-structures.v1',
  title: 'Molecules, Formulas & Extended Structures',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.molecules-formulas-and-extended-structures',
      standard: 'M8SCI-7.4',
      description:
        'Read a simple chemical formula -- H two O (H2O) is two hydrogen atoms and one oxygen atom; C O two (CO2) is one carbon atom and two oxygen atoms; O two (O2) is a molecule of one element, two oxygen atoms joined to each other -- match a formula to a particle model, and distinguish substances made of separate molecules (water, carbon dioxide) from extended structures with no separate molecules (table salt, diamond, metals) (NGSS MS-PS1-1).',
    },
  ],
  prerequisites: ['m8sci.reading-the-periodic-table'],
  followUps: ['m8sci.evidence-of-a-chemical-reaction'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Turn two codes the student has already walked past into a parts list they are about to be able to read, then unsettle the idea that every substance comes in separate pieces.',
      script:
        'There is a red fire extinguisher somewhere in your school with a short code printed on the side of it: C O two -- one carbon atom and two oxygen atoms (CO2). The small print on the back of a bottle of water sometimes carries another one, H two O -- two hydrogen atoms and one oxygen atom (H2O). Those codes are not shorthand for the name of the stuff inside. They are a parts list. Somebody who can read one can tell you exactly which kinds of atom a substance is built from, and how many of each, without ever having seen or smelled or touched it. That is a genuinely useful trick and it takes about five minutes to learn. The second half of today is the strange part. You will find that some substances do not come in separate pieces at all. There is no such thing as one particle of table salt in the way that there is one particle of water, and once you know that, the parts list turns out to be telling you something slightly different about those substances than it tells you about water.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reading-a-formula',
      kind: 'concept',
      goal: 'Install the four-step reading routine, the rule that a number counts only the symbol it follows, the molecule-versus-extended-structure split, and what a formula means on each side of that split.',
      keyIdeas: [
        'A CHEMICAL FORMULA IS A PARTS LIST, NOT A NAME. Each symbol in it -- a capital letter on its own, or a capital letter followed by a small letter -- stands for one kind of atom: H is hydrogen, O is oxygen, C is carbon, N is nitrogen, Na is sodium, Cl is chlorine. Those are the element symbols you already know. A formula sets the symbols side by side to say which kinds of atom the substance is built from, and it puts a number just after a symbol to say how many atoms of THAT element there are. A symbol with no number after it means exactly one atom of that element. So H two O (H2O) says hydrogen, two of them, and oxygen, one of it: two hydrogen atoms and one oxygen atom, three atoms in all.',
        'HOW TO READ ANY FORMULA, IN ORDER. (1) Say the symbols out loud in the order they are written, turning each one into the name of its element. (2) Take each symbol in turn and read the number written just after it as the count of that element, and read a symbol with no number after it as one atom. (3) Add the counts to get the total number of atoms. (4) Then ask the question the counts do not answer on their own: does this substance come in separate particles, or is it built as one joined structure that goes on and on? For C O two (CO2), the first three steps give carbon, one atom, and oxygen, two atoms, which is three atoms in all. The fourth step says that carbon dioxide does come in separate particles, so those three atoms are one whole particle of carbon dioxide with a gap between it and the next one.',
        'A MOLECULE IS A GROUP OF JOINED ATOMS THAT STANDS APART FROM ITS NEIGHBORS. That gap is the whole of the definition. In a container of carbon dioxide the atoms are not spread evenly through the space; they are gathered into groups of three, each group joined together, each group with a space around it. Every one of those groups is a molecule. And a molecule does not have to hold two different elements. Oxygen gas, which is one of the gases in the air around you, is written O two (O2) -- two oxygen atoms joined to each other -- and the air is full of those joined pairs. O two is a molecule AND an element at the same time, and there is no contradiction in that: molecule describes how the atoms are grouped, while element and compound describe how many KINDS of atom there are. To tell an element from a compound, count the different symbols in the formula, never the atoms.',
        'SOME SUBSTANCES HAVE NO SEPARATE MOLECULES AT ALL. Inside a single grain of table salt, sodium and chlorine alternate in a pattern that repeats over and over in every direction, right out to the faces of the grain, and nowhere in that grain is there a group of particles standing apart from the rest with a gap around it. A diamond is the same idea built from one kind of atom: carbon atoms joined to their neighbors on and on through the whole stone, so a diamond is, in a real sense, one enormous joined structure. A copper wire is the same again -- copper atoms joined to their neighbors the whole length of it, with no copper molecules anywhere in it. Substances built this way are called EXTENDED STRUCTURES, and they are not unusual. The metals, table salt and sand are all built like this.',
        'SO THE SAME PARTS LIST MEANS TWO DIFFERENT THINGS, AND STEP 4 DECIDES WHICH. For a substance made of separate molecules, the formula counts the atoms inside ONE molecule: C O two (CO2) means that one whole carbon dioxide molecule holds one carbon atom and two oxygen atoms, and that the molecule beside it holds another one carbon and another two oxygen of its own. For an extended structure there is no separate molecule to count, so the formula reports a RATIO that holds everywhere in the structure: Na Cl (NaCl) says one sodium for every one chlorine, all through the grain, and that stays true whether the grain is a speck or a brick. Here is the test that sorts them. If you can say where one particle ends and the next one begins, the formula is counting a molecule. If you cannot, it is giving you a ratio.',
        'THE TWO TRAPS, AND WHERE THIS LESSON STOPS. First trap: a number belongs ONLY to the symbol it follows. The two in H two O (H2O) counts hydrogen atoms, and the O has no number after it, so there is exactly one oxygen atom. Read it as two of each instead and you have described H two O two (H2O2) -- two hydrogen atoms and two oxygen atoms -- which is hydrogen peroxide, a different substance that is sold for cleaning cuts and would be a bad thing to drink. Second trap: MOLECULE is not another word for a bit of any substance. A grain of salt is not a salt molecule and a chip of diamond is not a diamond molecule, because neither substance has molecules in it at all. And where this lesson stops: you are never asked to write a formula from the name of a substance, never asked why the atoms are joined or what holds them together, and never asked to read a number written in FRONT of a formula. Reading a formula you are given, matching it to a particle model, and telling a molecule from an extended structure is the whole of it.',
      ],
      vocabulary: [
        { term: 'chemical formula', definition: 'a parts list for a substance, written as element symbols with a number just after any symbol whose atoms are counted more than once.' },
        { term: 'element symbol', definition: 'the one or two characters that stand for one kind of atom, such as H for hydrogen or Na for sodium.' },
        { term: 'molecule', definition: 'a group of atoms joined to one another that stands apart from the groups around it, with a gap between one group and the next.' },
        { term: 'extended structure', definition: 'a substance in which the atoms are joined on and on in a repeating pattern with no separate group standing apart, so it has no molecules in it.' },
        { term: 'compound', definition: 'a substance built from two or more different kinds of atom joined together, so its formula carries two or more different symbols.' },
      ],
      suggestedTools: ['show_diagram', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-reading-two-labels',
      kind: 'worked_example',
      problem:
        'A bottle label carries the formula H two O (H2O), with the two written just after the H. A gas cylinder carries the formula C O two (CO2), with the two written just after the O. Both substances are made of separate molecules. Read both formulas: say which kinds of atom each substance is built from, how many of each, how many atoms in all, and what those counts describe.',
      steps: [
        'Step 1 for the bottle, name the kinds of atom. The formula carries two symbols, H and O. H is the symbol for hydrogen and O is the symbol for oxygen, so this substance is built from hydrogen and oxygen and from nothing else. Said out loud it is H two O.',
        'Step 2, count each kind. The two is written just after the H, so it counts hydrogen atoms and nothing else: two hydrogen atoms. The O has no number written after it, and a symbol with no number means one atom: one oxygen atom.',
        'Step 3, add the counts. Two hydrogen atoms plus one oxygen atom is three atoms altogether (2 + 1 = 3).',
        'Step 4, ask what those counts describe, because that is the step the numbers cannot do for you. The problem says water is made of separate molecules, so the three atoms are one complete water molecule: one oxygen atom with two hydrogen atoms attached to it, standing apart from the molecule next to it. The molecule beside it is another three atoms of its own.',
        'Now the cylinder, and the same four steps in the same order. Step 1: the symbols are C and O, so carbon and oxygen. Step 2: the two is written just after the O, so two oxygen atoms; the C has no number after it, so one carbon atom. Step 3: one carbon atom plus two oxygen atoms is three atoms altogether (1 + 2 = 3). Step 4: carbon dioxide is made of separate molecules, so those three atoms are one whole carbon dioxide molecule. WRONG: "There is a two in C O two, so there are two atoms of each kind in the particle." CORRECT: "The two sits just after the O and counts oxygen atoms only; the C has no number after it, so there is exactly one carbon atom." A number in a formula never counts anything except the atoms of the symbol it follows.',
        'Now run the two checks a science answer needs, because there is very little arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree on the water reading. The position clue: the two is printed just after the H and nothing at all is printed after the O, so hydrogen is the element being counted twice. The model clue: a chemist describing one water particle describes one oxygen atom with two hydrogen atoms attached to it, which matches two hydrogen for one oxygen and does not match one hydrogen for two oxygen. And a clue of a completely different kind, from taking the substance apart: when electricity is passed through water and splits it, twice as much hydrogen gas is collected, by volume, as oxygen gas. Where the number sits, what one particle looks like, and what comes out when the substance is pulled apart are three different kinds of evidence, and all three say two hydrogen for one oxygen. Second, change one thing and check that the answer moves. Put a two after the O as well, so the formula reads H two O two (H2O2) -- two hydrogen atoms and two oxygen atoms. That one added atom does not give you a slightly different sort of water. It gives you hydrogen peroxide, the liquid sold for cleaning cuts, which has properties of its own. The counts are not decoration: change a count and you have written down a different substance.',
      ],
      answer:
        'H two O (H2O) is two hydrogen atoms and one oxygen atom, three atoms in all, and because water is made of separate molecules those three atoms are one water molecule. C O two (CO2) is one carbon atom and two oxygen atoms, also three atoms in all, and those three atoms are one carbon dioxide molecule.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-no-molecule-to-count',
      kind: 'worked_example',
      problem:
        'A grain of table salt and a small diamond are each magnified until the individual particles can be seen. In the salt grain, sodium and chlorine alternate in a pattern that repeats over and over in every direction, right out to the faces of the grain, and nowhere in it is there a group of particles standing apart from the rest with a gap around it. In the diamond, carbon atoms are joined to their neighbors in a pattern that repeats the same way, all through the stone. The salt has the formula Na Cl (NaCl) and the diamond has the formula C. How many atoms are in one molecule of each, and what do those two formulas mean?',
      steps: [
        'Step 1, name the kinds of atom. Na Cl carries two symbols: Na for sodium and Cl for chlorine. The diamond carries one symbol, C for carbon, so a diamond is built from carbon and from nothing else.',
        'Step 2, count each kind. Neither symbol in Na Cl has a number written after it, so each one counts as one: one sodium for every one chlorine. The C has no number after it either.',
        'Step 3, add the counts -- and watch what happens. Adding gives two for the salt and one for the diamond. Now read those totals back as descriptions of a grain and a stone, and they are plainly nonsense: a grain of salt is not two particles and a diamond is not one atom. The counts are not wrong. What is wrong is the question they were asked to answer.',
        'Step 4 is the step that decides, and here it changes the whole reading. Go back to what the magnification found: the pattern repeats all the way out to the faces, and there is no group of particles with a gap around it anywhere. So there is nowhere to say "this particle ends here and the next one begins there". Both substances are extended structures, and neither of them has a molecule in it. The question "how many atoms are in one molecule" has no answer for either one, because there is no molecule to count the atoms of.',
        'So what are the formulas for? For an extended structure the formula reports a ratio that holds everywhere in the structure. Na Cl (NaCl) says that there is one sodium for every one chlorine, in every part of the grain, in every grain in the jar. The diamond formula C says that there is carbon and nothing else, all through the stone. WRONG: "Na Cl means that one molecule of salt contains one sodium and one chlorine." CORRECT: "Na Cl means that there is one sodium for every one chlorine throughout the grain, and there is no separate salt molecule for it to be counting." The parts list is correct either way. What changes is what it is a parts list OF.',
        'Now the two checks. First, three clues of DIFFERENT KINDS that agree that the salt grain has no molecules in it. The arrangement clue: the repeating pattern runs unbroken to the faces of the grain, with no gap anywhere to mark off one group from the next. The splitting clue: break the grain and you get smaller grains, break those and you get smaller ones still, and every piece is salt with one sodium for every one chlorine -- you never arrive at a group of two particles with a space around it that you could hold up as one particle of salt. The behavior clue, which is a different kind of evidence again: a salt grain has to be heated far hotter than any kitchen oven reaches before it melts, and that is what you would expect of a substance in which every particle is joined to its neighbors all the way across. Second, change one thing and check that the answer moves. Keep the substance a solid but build it out of separate molecules instead: solid carbon dioxide, which is called dry ice, is a solid made of whole C O two molecules -- one carbon atom and two oxygen atoms each (CO2) -- stacked with gaps between them. Leave a block of it out on a warm day and it turns straight into gas and disappears, while the salt grain beside it sits there unchanged, because turning dry ice into a gas means no more than letting its separate molecules drift apart from one another, and the salt grain has no separate molecules to let go of.',
      ],
      answer:
        'The first question has no answer for either substance, because neither one is made of molecules and so neither one has a molecule whose atoms could be counted. Both are extended structures: the atoms are joined on and on in a repeating pattern with no group standing apart. Their formulas therefore report ratios rather than counting molecules -- Na Cl (NaCl) says one sodium for every one chlorine all through the grain, and C says carbon and nothing else all through the stone.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-read-ammonia-formula',
      kind: 'try_yourself',
      problem:
        'Ammonia is the sharp-smelling substance in some window cleaners, and its formula is written N H three (NH3), with the three written just after the H. Ammonia is made of separate molecules. Which of these reads that formula correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Three nitrogen atoms and three hydrogen atoms, because the number written at the end of a formula gives the count for every kind of atom that the formula lists.' },
        { id: 'b', text: 'Three nitrogen atoms and one hydrogen atom, because a number in a formula belongs to the symbol written in front of it, and N is the symbol written in front of the three.' },
        { id: 'c', text: 'One nitrogen atom and three hydrogen atoms that are not joined to one another, sitting side by side in the container with three hydrogen atoms there for every nitrogen atom.' },
        { id: 'd', text: 'One nitrogen atom and three hydrogen atoms joined together into one molecule, four atoms in all, because a number written just after a symbol counts only the atoms of that element.', correct: true },
      ],
      expectedAnswer: 'One nitrogen atom and three hydrogen atoms joined together into one molecule, four atoms in all, because a number written just after a symbol counts only the atoms of that element.',
      hints: [
        'Take the symbols first and the numbers second. N is the symbol for nitrogen and H is the symbol for hydrogen. Now ask which of those two symbols the three is written just after, because that is the only element it counts.',
        'A symbol with no number written after it stands for exactly one atom of that element. Work out both counts, add them for the total, and keep in mind that the problem says these atoms are joined into separate molecules.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-match-methane-to-a-model',
      kind: 'try_yourself',
      problem:
        'The main substance in the natural gas burned in a stove is methane, and its formula is written C H four (CH4), with the four written just after the H. Methane is made of separate molecules. Which description of what is inside a container of methane matches that formula?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Identical groups of five atoms, each group one carbon atom with four hydrogen atoms attached to it, and a gap between one group and the next, because the four counts hydrogen atoms only and the carbon has no number written after it.', correct: true },
        { id: 'b', text: 'One joined structure filling the container, in which carbon atoms and hydrogen atoms alternate on and on in a repeating pattern, with no group of atoms anywhere in it that stands apart from the rest with a gap around it.' },
        { id: 'c', text: 'Identical groups of five atoms, each group four carbon atoms with one hydrogen atom attached to them, because the larger number in a formula goes with the symbol that is written first in the formula.' },
        { id: 'd', text: 'Single carbon atoms and single hydrogen atoms drifting side by side and joined to nothing at all, with four hydrogen atoms loose in the container for every carbon atom loose in it.' },
      ],
      expectedAnswer: 'Identical groups of five atoms, each group one carbon atom with four hydrogen atoms attached to it, and a gap between one group and the next, because the four counts hydrogen atoms only and the carbon has no number written after it.',
      hints: [
        'Read the formula first and get your two counts, then go looking for the description that shows exactly those counts. Which symbol is the four written just after, and what does a symbol with no number after it stand for?',
        'The problem says methane is made of separate molecules, so the description you want has groups with gaps around them rather than one pattern that never stops. Count the atoms in one group and check that count against your reading.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-samples-molecule-or-ratio',
      kind: 'try_yourself',
      problem:
        'Two solid samples are magnified until their atoms can be seen. In Sample A the atoms are gathered into separate groups, each group one atom of one kind joined to two atoms of a second kind, and there is a clear gap around every group. In Sample B, two kinds of atom alternate in a pattern that repeats over and over in every direction, right out to the edges of the sample, and nowhere in it is there a group standing apart from the rest with a gap around it. A chemist writes a formula for each sample. Which statement about those two formulas is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Both formulas count the atoms in one molecule, because every substance is made of molecules, and Sample B is simply one whose molecules are pressed so tightly against one another that the gaps between them are too small to be seen.' },
        { id: 'b', text: 'Sample A is made of separate molecules, so its formula counts the atoms in one of those molecules; Sample B has no separate molecules, so its formula gives the ratio of the two kinds of atom that holds everywhere in it.', correct: true },
        { id: 'c', text: 'Sample B is the one made of molecules and Sample A is the extended structure, because the gaps in Sample A show that its atoms are joined to nothing at all, while an unbroken repeating pattern is what holding a molecule together looks like.' },
        { id: 'd', text: 'Only Sample A can be given a formula at all, because a formula has to count the atoms in one particle, and a pattern that repeats right out to the edges of the sample holds far too many atoms for any count to be written down.' },
      ],
      expectedAnswer: 'Sample A is made of separate molecules, so its formula counts the atoms in one of those molecules; Sample B has no separate molecules, so its formula gives the ratio of the two kinds of atom that holds everywhere in it.',
      hints: [
        'Ask the pointing question of each sample in turn. Can you say where one particle ends and the next one begins? A gap around every group is a yes. A pattern that runs unbroken to the edge is a no.',
        'A formula is a parts list in both cases. What changes between them is what it is a parts list OF -- the atoms inside one separate molecule, or a ratio that holds right through a structure with no separate molecules in it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-number-means-compound-and-grain-means-molecule',
      kind: 'misconception_check',
      question:
        'A student writes: "Oxygen gas is written O two (O2), so it has to be a compound -- there is a number in it and there are two things joined together. And a grain of table salt is one big salt molecule, because it is one solid lump." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'Oxygen gas is written O two (O2), so it has to be a compound.',
          misconception:
            'Deciding element or compound by counting ATOMS rather than by counting the different SYMBOLS, because a formula with a number in it looks as though it must list more than one ingredient.',
          correctsTo:
            'O two (O2) carries one symbol, O, and that settles it: every atom in the particle is oxygen, so the substance is an ELEMENT. The two says that oxygen gas comes as pairs of oxygen atoms joined to each other, which makes each pair a molecule. So O two is a molecule and an element at the same time, and the two words are not in competition, because they answer different questions. Molecule answers "are these atoms joined into a group that stands apart?" and element answers "how many different kinds of atom are in it?" A compound needs at least two different symbols in its formula. WRONG: "There is a number in it, so it is a compound." CORRECT: "There is only one kind of symbol in it, so it is an element, and because its atoms come in joined pairs it is also a molecule."',
        },
        {
          answer: 'A grain of table salt is one big salt molecule.',
          misconception:
            'Hearing "molecule" as the word for a piece of any substance at all, so a single solid lump must be a single molecule, because everyday language has nothing that separates "a bit of something" from "a group of joined atoms with a gap around it".',
          correctsTo:
            'A molecule is a group of atoms joined to one another that stands APART, with a gap between it and the group next to it, and that gap is what a salt grain does not have anywhere in it. Sodium and chlorine alternate in a pattern that repeats over and over in every direction, out to the faces of the grain, so there is no point at which one particle ends and the next begins. Table salt is an extended structure, and it has no molecules in it at all -- not one big one, and not many small ones. Its formula, Na Cl (NaCl), is therefore not counting a molecule: it reports that there is one sodium for every one chlorine, and that ratio is the same in a speck of salt and in a whole bag of it. WRONG: "The grain is one big salt molecule." CORRECT: "The grain is an extended structure with no molecules in it, and Na Cl gives the ratio of sodium to chlorine right through it."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A chemical formula is a parts list. Each symbol names one kind of atom, and a number counts only the atoms of the symbol it is written just after.',
        'A symbol with no number written after it means exactly one atom of that element.',
        'H two O (H2O) is two hydrogen atoms and one oxygen atom, three atoms in all. C O two (CO2) is one carbon atom and two oxygen atoms, three atoms in all.',
        'A molecule is a group of joined atoms that stands apart from its neighbors, with a gap between one group and the next.',
        'A molecule can be made of a single element: O two (O2) is two oxygen atoms joined to each other. To tell an element from a compound, count the different SYMBOLS, never the atoms.',
        'Some substances have no separate molecules at all. In table salt, in diamond and in a metal the atoms are joined on and on in a repeating pattern with no group standing apart. Those are extended structures.',
        'For a substance made of separate molecules the formula counts the atoms in ONE molecule. For an extended structure it gives a ratio that holds everywhere, such as one sodium for every one chlorine in Na Cl (NaCl).',
        'The test: if you can say where one particle ends and the next begins, the formula is counting a molecule. If you cannot, it is giving you a ratio.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.4', cedTitle: 'Molecules, Formulas & Extended Structures' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
