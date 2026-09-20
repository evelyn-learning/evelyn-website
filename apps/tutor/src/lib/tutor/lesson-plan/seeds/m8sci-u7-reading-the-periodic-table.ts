/**
 * Grade 8 Science (Physical Science) — Atoms, Elements & the Periodic Table:
 * Reading the Periodic Table.
 *
 * PROCEDURE-LED row (NGSS DCI PS1.A). One routine runs the whole lesson:
 * read the square (symbol, name, atomic number), give the address (period is
 * the row, group is the column), classify from position (metal on the left
 * and middle, nonmetal in the upper right block, metalloid on the staircase
 * between), check that classification against any properties you were given,
 * and -- only if you are asked to predict behavior -- use the COLUMN and
 * nothing else. Both worked examples run the same moves so the pattern is
 * unmistakable, and each ends with the two-part verification move (three
 * clues of different kinds agreeing, then one changed condition that moves
 * the answer).
 *
 * The two traps it is built to kill are (a) swapping period and group, which
 * is the most common slip in reading the table, and (b)
 * same-period-means-same-family -- treating two elements that touch along a
 * row as relatives, when the family is the column.
 *
 * SCOPE GUARD: this plan takes a square that has been DESCRIBED IN WORDS and
 * produces three things from it -- an address (period and group), a reading
 * (symbol and atomic number), and a classification (metal, nonmetal or
 * metalloid) -- plus one prediction, made from the column alone, about how an
 * element behaves. Its scope cell carries NO LINEAGE CLAUSE (there is no
 * "Builds on ..." half; do not hunt for one). Its withheld clause, verbatim:
 * "Withholds valence electrons as the reason for group behavior, periodic
 * trends in radius/ionization energy/electronegativity
 * (`chem-u3-periodic-table-organization.ts`, `chem-u3-periodic-trends.ts`)."
 * What that means at each edge, and what is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 7.2 (inside the atom) is assumed, not re-taught:
 *     "the atomic number is the number of protons, and the proton count is
 *     what makes an atom that element" is restated in one sentence of the
 *     concept segment and in one vocabulary entry, as something the student
 *     already holds from the previous lesson, and this file names a
 *     neutron at exactly one point -- inside a single distractor whose error
 *     IS that mistake -- never counts electrons, and never draws an atom.
 *     Row 7.1 (element, compound, mixture) is touched at exactly one point: the misconception check says
 *     a metalloid is ONE element and not two substances mixed, which uses
 *     7.1's element-versus-mixture split as a settled idea rather than
 *     teaching it. Row 7.4 (formulas and molecules) is not entered: no
 *     chemical formula, spoken or written, appears anywhere in this file, and
 *     no compound is given a formula -- table salt is named as "table salt".
 *     Row 6.4 (characteristic properties) supplies the property words
 *     (conducts, brittle, shiny) and is not re-taught as a way of
 *     identifying an unknown substance.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears. No rock, mineral, ore, resource,
 *     mining or atmosphere is mentioned; the elements in this file are
 *     described only by what is printed in their square and by properties a
 *     sample of them has.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears. No organism, cell, nutrient or living
 *     system is named.
 *   - HS CHEMISTRY boundary (this is the upward edge, and it is the whole
 *     reason the row exists in this shape): the column pattern is taught as
 *     an OBSERVED regularity that you may use to predict, and never as a
 *     consequence of electron arrangement. The structures this file stops
 *     short of, by name: valence electrons, electron shells and electron
 *     configurations; ion formation and charges; and every periodic trend --
 *     atomic radius, ionization energy and electronegativity -- so nothing
 *     here states that anything gets larger, smaller, more reactive or less
 *     reactive as you move along a row or down a column, in a teaching
 *     segment or inside a wrong answer. The one positional change the file
 *     does state -- that properties shift gradually from metal at the
 *     left-hand end of a row toward nonmetal at the right-hand end -- is the
 *     metal/nonmetal split this row is required to teach, and is not a trend
 *     in a measured quantity. The word "electron" appears nowhere in the
 *     authored body. The one sentence about why the pattern may be trusted
 *     is historical (gaps were left and later filled
 *     by elements that matched), not structural.
 *   - BURNED EXAMPLES (controller ruling 32). `los[0].description` is
 *     student-facing and names two concrete examples verbatim from the scope
 *     cell: the alkali metals reacting with water, and the noble gases barely
 *     reacting. Both are TAUGHT here -- they are part of the row -- but
 *     neither may be the answer to an assessed item, because a student can
 *     read them off the objective. The three items therefore use magnesium,
 *     germanium and the chlorine/bromine pair, none of which appears in any
 *     teaching segment. Do not "helpfully" swap an item onto an alkali metal
 *     or a noble gas later.
 *   - HYDROGEN is handled explicitly rather than quietly, because the two
 *     tidy statements a periodic-table lesson wants to make ("the first
 *     column is the alkali metals", "the nonmetals are the block in the upper
 *     right") are both false of hydrogen. The concept segment says so in
 *     place.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course, and this row
 * is the one whose subject IS a picture. Every square, row and column in this
 * file is written out in words inside the segment that uses it -- "the third
 * row down, the second column across" -- and every item is solvable from the
 * text printed inside it. Never write "look at the periodic table", and never
 * assume the student has a chart, a wall poster or a sample of any element in
 * front of them. The hook invites a memory of having walked past a wall
 * chart; nothing after the hook depends on that memory.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 7.2 -> 7.3 ->
 * 7.4 (`inside-the-atom` -> `reading-the-periodic-table` ->
 * `molecules-formulas-and-extended-structures`), and both arrays below carry
 * the real neighbors. The two hand-written exemplars ship with empty arrays
 * because they are registered before their neighbors exist; that is a
 * registration-order artifact and is not the pattern to copy.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U7_READING_THE_PERIODIC_TABLE: LessonPlan = {
  id: 'evelyn.ms.m8sci.reading-the-periodic-table.v1',
  title: 'Reading the Periodic Table',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.reading-the-periodic-table',
      standard: 'M8SCI-7.3',
      description:
        'Locate an element by period (row) and group (column), read its symbol and atomic number, tell metals from nonmetals and metalloids by position and by properties (shiny, conducts, bends versus dull, brittle, insulates), and predict that elements in the same group behave alike (the alkali metals all react with water; the noble gases barely react at all) (NGSS DCI PS1.A).',
    },
  ],
  prerequisites: ['m8sci.inside-the-atom'],
  followUps: ['m8sci.molecules-formulas-and-extended-structures'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Turn the wall of initials into a map with an address system, so the student wants the address before the chemistry.',
      script:
        'You have almost certainly walked past one of these: a big chart on a wall, more than a hundred little squares, each holding one or two letters and a number in the corner. It looks like a wall of initials that somebody decided to hang up. It is not. It is a map, and like any map it has an address system -- every square has a row and a column -- and the addresses were not handed out at random. Two elements that sit in the same column behave so much alike that if you know what one of them does when it meets water, you can predict the other one without ever going near it. Two elements that sit side by side in the same row can be as unalike as a soft silvery metal you could cut with a butter knife and a hard gray solid that snaps like glass. Same row, almost touching, nothing in common. That is the part worth knowing, because it means the map is doing real work. By the end of today you will be able to take any square, read what is printed in it, say exactly where it sits, decide whether the element is a metal, a nonmetal or something in between, and make a prediction about how it behaves from the company it keeps.',
      suggestedTools: ['show_table'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reading-a-square',
      kind: 'concept',
      goal: 'Install the square-reading, the two-part address, the three-way position split, the column-is-the-family rule, and the five-step routine before any of them is needed.',
      keyIdeas: [
        'EVERY SQUARE IS A DATA CARD, AND YOU READ IT THE SAME WAY EVERY TIME. One square stands for one element, and it carries three things: the element SYMBOL, which is one or two letters with the first letter capital and the second, when there is one, lowercase; the element NAME; and the ATOMIC NUMBER, a whole number printed in the corner. You already know from the last lesson what the atomic number is -- the number of protons in the nucleus of one atom of that element -- and that the proton count is what makes an atom the element it is. An atom with 6 protons is a carbon atom; an atom with 11 protons is a sodium atom. The squares are laid out in order of increasing atomic number: read left to right along a row, then drop to the left-hand end of the next row and keep going. There are 118 known elements, one square each, and about 90 of them occur naturally on Earth.',
        'THE ADDRESS HAS TWO PARTS: PERIOD IS THE ROW, GROUP IS THE COLUMN. The rows that run across the table are called PERIODS, and there are seven of them, numbered 1 at the top down to 7 at the bottom. The columns that run down the table are called GROUPS, and there are eighteen of them, numbered 1 at the far left across to 18 at the far right. Every element has exactly one address, and you say the period first and the group second. Carbon sits in period 2, group 14 -- second row down, fourteenth column across. Sodium sits in period 3, group 1 -- third row down, first column, hard against the left-hand edge. Keep the two straight by remembering which way you count: the PERIOD is the row you count DOWN to, and the GROUP is the column you count ACROSS to. WRONG: "Sodium is in group 3 and period 1." CORRECT: "Sodium is in period 3 and group 1." Swapping the two is the most common slip there is in reading this table, and it turns every prediction that follows into nonsense.',
        'POSITION SPLITS THE TABLE THREE WAYS: METALS, NONMETALS AND METALLOIDS. Most of the elements are metals, and they fill the whole left-hand side and the middle. A metal is shiny, carries an electric current and thermal energy well, and can usually be bent or hammered into a new shape instead of snapping -- a copper wire and an iron nail are both metals. The nonmetals sit in a block in the upper right-hand corner. A nonmetal is usually dull rather than shiny, carries an electric current poorly or not at all, and, if it is a solid, is brittle: it crumbles or snaps when it is struck. Between the two runs a staircase-shaped line, and the handful of elements sitting on that staircase are the METALLOIDS. A metalloid is one single element, not two substances mixed, and its properties fall in between: silicon, which sits on the staircase in period 3, group 14, has the shine of a metal, snaps like a nonmetal, and carries a current far less freely than a metal and far more freely than a nonmetal. One element does not fit this left-right split: hydrogen, alone in the top left square, is a nonmetal despite sitting above the metals.',
        'THE COLUMN IS THE FAMILY. SAME GROUP, ALIKE BEHAVIOR -- SAME PERIOD, NOT. This is the one idea that turns the table from a list into a map. Elements in the same GROUP behave alike in their reactions, and elements in the same PERIOD do not; going across a row, the properties change gradually from metal on the left to nonmetal on the right. The first column below hydrogen holds the ALKALI METALS -- lithium, sodium, potassium and the ones beneath them -- and every one of them reacts with water: drop a piece in and it fizzes, moves about on the surface and gives off a gas. Hydrogen sits at the top of that column but is not one of them; the family starts with the element below it. The last column, group 18, holds the NOBLE GASES, and they barely react at all -- helium and neon will sit in a container with almost anything and combine with none of it. Other columns are families too, with their own shared behavior. So if you know what one member of a column does, you can predict the others, and that prediction is what the address is for.',
        'THE ROUTINE, IN ORDER. (1) Read the square: symbol, name, atomic number, and remember that the atomic number is the proton count. (2) Give the address: count down for the period, count across for the group, and say the period first. (3) Classify from position: left-hand side and middle means metal, the block in the upper right means nonmetal, sitting on the staircase means metalloid. (4) Check that classification against any properties you were given. Shiny, bendable and current-carrying should go with a metal; dull, brittle and insulating should go with a nonmetal; a mixture of the two sets should go with a metalloid. If the position and the properties disagree, you have counted to the wrong square, so count again. (5) If, and only if, you are asked to predict how the element behaves, use the COLUMN. Not the row, not the neighbors, not how close the atomic numbers are.',
        'WHAT THIS LESSON DOES NOT ASK, AND WHY YOU CAN STILL TRUST THE MAP. It never asks WHY the columns work -- why the members of one column should behave alike is a question for a later course, and nothing in this lesson depends on the answer. What you can say now is that the pattern was found, not invented. Dmitri Mendeleev arranged the elements known in his day so that the repeating pattern of properties lined up in columns, and he left empty squares where the pattern demanded an element that nobody had yet found, saying in advance roughly how each missing one would behave. Those elements were found later, and they behaved as the empty squares said they would. A pattern that predicts things nobody has seen yet is a real pattern. You are allowed to use it before you know the reason behind it.',
      ],
      vocabulary: [
        { term: 'period', definition: 'a row running across the periodic table. There are seven, numbered 1 at the top to 7 at the bottom.' },
        { term: 'group', definition: 'a column running down the periodic table. There are eighteen, numbered 1 at the far left to 18 at the far right, and the elements in one group behave alike in their reactions.' },
        { term: 'atomic number', definition: 'the number of protons in the nucleus of one atom of an element, printed in the corner of its square; it is what makes the atom that element, and the table is ordered by it.' },
        { term: 'metalloid', definition: 'a single element whose square sits on the staircase-shaped line between the metals and the nonmetals, and whose properties fall between the two sets.' },
        { term: 'alkali metals', definition: 'the family in the first column below hydrogen -- lithium, sodium, potassium and the ones beneath them -- all of which react with water.' },
        { term: 'noble gases', definition: 'the family in the last column, group 18, including helium and neon, which barely react with anything.' },
      ],
      suggestedTools: ['show_table', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-read-the-sulfur-square',
      kind: 'worked_example',
      problem:
        'A square in the periodic table shows the symbol S above the name sulfur, with the number 16 printed in its corner. Counting rows from the top of the table, that square sits in the third row. Counting columns from the left, it sits in the sixteenth column. A sample of sulfur is a pale yellow solid that is dull rather than shiny, crumbles into powder when it is struck, and does not carry an electric current. Give sulfur its address, say what the number in the corner tells you, and classify it as a metal, a nonmetal or a metalloid.',
      steps: [
        'Step 1, read the square. The symbol is S, a single capital letter. The name is sulfur. The number in the corner is 16, and that is the atomic number, so every sulfur atom has 16 protons in its nucleus, and having 16 protons is exactly what makes an atom a sulfur atom rather than anything else.',
        'Step 2, give the address. The period is the row you count down to, and we counted down three rows, so the period is 3. The group is the column you count across to, and we counted across sixteen columns, so the group is 16. Period first, group second: sulfur is in period 3, group 16.',
        'Step 3, classify from position. Group 16 is over on the right-hand side of the table, and the third row is high enough that group 16 falls inside the block in the upper right. That block is the nonmetals, so the position says nonmetal.',
        'Step 4, check the position against the properties you were given. Dull rather than shiny: nonmetal. Crumbles into powder when struck, rather than bending: brittle, which is nonmetal. Does not carry an electric current: nonmetal. All three described properties land in the nonmetal set, and the position said nonmetal, so the two agree and the classification holds.',
        'WRONG: "Sulfur is in group 3 and period 16." CORRECT: "Sulfur is in period 3 and group 16." There is no period 16 -- the table only has seven periods -- so that slip is not just wrong, it is impossible, and noticing that is a free check on yourself. Any period above 7 or any group above 18 means the two were swapped.',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. The position says nonmetal, because the square is inside the upper-right block. The described properties say nonmetal, independently, because dull, brittle and non-conducting is the nonmetal set. And the ordering agrees as a third, different kind of clue: the squares run in order of increasing atomic number, and 16 is a small number, which is where the light nonmetals sit -- an element with an atomic number in the hundreds could not be sitting in the third row at all. Three kinds of evidence, one answer.',
        'Second, change exactly one thing and check that the answer moves. Keep the same row and slide two columns to the left, to the fourteenth column of that same third row. The element there is silicon, and silicon sits right on the staircase: it has a metal shine, it snaps like a nonmetal, and it carries a current far less freely than a metal and far more freely than a nonmetal. Same period, two columns over, and the classification moves from nonmetal to metalloid. The row was never what decided it. The column was.',
      ],
      answer:
        'Sulfur is in period 3, group 16. The 16 in the corner is its atomic number, the number of protons in one sulfur atom, and it is what makes the atom sulfur. Sulfur is a nonmetal: its square sits in the block in the upper right of the table, and the properties given -- dull, brittle, does not carry a current -- are the nonmetal set, so position and properties agree.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-predict-from-the-column',
      kind: 'worked_example',
      problem:
        'Three squares. Lithium, symbol Li, sits in the second row of the table, in the first column. Beryllium, symbol Be, sits in the second row as well, in the second column -- the square immediately to the right of lithium. Potassium, symbol K, sits in the fourth row, in the first column. A small piece of lithium dropped into water fizzes steadily, moves about on the surface and gives off a gas. Which of the other two elements should behave most like lithium in water, and why?',
      steps: [
        'Step 1 and step 2, read and address all three. Lithium: period 2, group 1. Beryllium: period 2, group 2. Potassium: period 4, group 1. Write them that way before comparing anything, because the comparison is about to depend entirely on which number matches which.',
        'Step 3, find out what is shared. Lithium and beryllium share a PERIOD: both are in period 2, and they are touching, side by side. Lithium and potassium share a GROUP: both are in group 1, two rows apart, and there is a whole row of squares between them.',
        'Step 4, apply the rule, which is that the column is the family. Sharing a row means being neighbors, and neighbors along a row are not alike: going across a row the properties change gradually from metal on the left toward nonmetal on the right. Sharing a column means being in the same family, and family members behave alike in their reactions. Lithium and potassium share the column. So the prediction is potassium.',
        'Step 5, state the prediction as a behavior, not just a name. Potassium dropped into water should do what lithium did: fizz, move about on the surface and give off a gas. That is exactly what happens. Beryllium does not fizz in water at all.',
        'WRONG: "Beryllium, because it is the square right next to lithium, so it must be the closest relative." CORRECT: "Potassium, because it is in the same column as lithium. Touching along a row is not being in the same family. Sharing a column is." Distance across the page is not the test. The address is.',
        'Now the two checks. First, three clues of different kinds agree. The address comparison says lithium and potassium share a group number and lithium and beryllium share a period number. The family naming agrees from a different direction: the first column below hydrogen is a named family, the alkali metals, and lithium and potassium are both members of it while beryllium is in the next column over and is not. And the rest of the column agrees, which is a third kind of check: every element in that first column below hydrogen reacts with water the same way, so lithium and potassium are not a lucky pair, they are two members of a pattern that holds all the way down.',
        'Second, change exactly one thing and watch the answer move. Suppose you had been told about beryllium instead -- that a piece of beryllium dropped into water does nothing at all. Run the same routine on that starting point. Beryllium is in the second column, so the rule now points you at the element directly below beryllium in that same second column, and it points you away from lithium sitting right beside it. Same table, same rule, one changed starting element, and a different answer comes out. That is how you know the rule is doing the work and not the layout of the page.',
      ],
      answer:
        'Potassium. Lithium and potassium are both in group 1, the same column, and the column is the family: elements in one column behave alike in their reactions, so potassium should fizz in water, move about on the surface and give off a gas, exactly as lithium did. Beryllium only shares lithium\'s row, and elements along a row change gradually rather than matching, so being the square next door predicts nothing.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-read-the-magnesium-square',
      kind: 'try_yourself',
      problem:
        'A square in the periodic table shows the symbol Mg above the name magnesium, with the number 12 printed in its corner. Counting rows from the top, that square sits in the third row of the table. Counting columns from the left, it sits in the second column. Which statement reads this square correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Magnesium is in period 2 and group 3, because the period is the number of the column you count across to and the group is the number of the row you count down to, and the 12 is the number of protons in one magnesium atom.' },
        { id: 'b', text: 'Magnesium is in period 3 and group 2, and the 12 counts the neutrons packed into the nucleus, since it is the neutron count that gives each element its own square and its own place in the order of the table.' },
        { id: 'c', text: 'Magnesium is in period 3 and group 2, and the 12 is its atomic number, the number of protons in the nucleus of one magnesium atom, which is what makes that atom magnesium rather than any other element.', correct: true },
        { id: 'd', text: 'Magnesium is in period 3 and group 2, and the 12 records that magnesium was the twelfth element anyone managed to discover, so the number is a piece of history rather than a fact about the atom itself.' },
      ],
      expectedAnswer: 'Magnesium is in period 3 and group 2, and the 12 is its atomic number, the number of protons in the nucleus of one magnesium atom, which is what makes that atom magnesium rather than any other element.',
      hints: [
        'Two separate readings are being asked for. First the address: which of the two numbers is the row you counted down, and which is the column you counted across? Say the period first and check it is not bigger than 7.',
        'Then the number in the corner. Think back to what makes an atom one element rather than another -- which particle in the nucleus is counted, and what happens to the element if that count changes?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classify-germanium',
      kind: 'try_yourself',
      problem:
        'An element called germanium has the symbol Ge. Its square sits in the fourth row of the table, in the fourteenth column, right on the staircase-shaped line that separates the metals on the left from the nonmetals in the upper right. A solid piece of germanium is gray and has a shine to it. Struck with a hammer it snaps into pieces rather than flattening out. A rod of it does carry an electric current, but far less freely than a metal rod of the same size would, and far more freely than a nonmetal, which would carry almost none. How should germanium be classified, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A metal, because it is gray and has a shine, and a metallic shine is the property that settles the question on its own: an element that looks like a metal is a metal, whatever column its square happens to sit in and however it breaks when it is struck.' },
        { id: 'b', text: 'A nonmetal, because it snaps into pieces instead of flattening out, and being brittle rather than bendable is what separates a nonmetal from a metal, so the shine and the weak current are side details next to the way the sample breaks under a hammer.' },
        { id: 'c', text: 'A metal, because it carries an electric current at all, and carrying a current is something only metals can do, so any element that lets current through belongs on the metal side of the staircase, and one that conducts weakly is simply a weak metal.' },
        { id: 'd', text: 'A metalloid, because its square sits on the staircase between the two, and every property described falls between the two sets: a metal shine, a nonmetal brittleness, and a current that flows far less freely than in a metal and far more freely than in a nonmetal.', correct: true },
      ],
      expectedAnswer: 'A metalloid, because its square sits on the staircase between the two, and every property described falls between the two sets: a metal shine, a nonmetal brittleness, and a current that flows far less freely than in a metal and far more freely than in a nonmetal.',
      hints: [
        'Do not let one property decide it. Sort the three described properties one at a time: which set does the shine belong to, which set does the snapping belong to, and which set does that in-between current belong to?',
        'Then bring the position in and check whether it agrees with the properties. The stem says exactly where the square sits relative to the line between the metals and the nonmetals, and there is a name for the elements that sit there.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-predict-bromine',
      kind: 'try_yourself',
      problem:
        'Chlorine has the symbol Cl, and its square sits in the third row of the table, in the seventeenth column. Chlorine is a pale green-yellow gas, and it combines readily with metals to form white, crystal-like solids -- one of those solids is the table salt in your kitchen. Bromine has the symbol Br. Its square sits one row lower, in the fourth row, in that same seventeenth column. You are told nothing else about how bromine behaves. Which prediction about bromine does the table best support, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Bromine will also combine readily with metals to form white, crystal-like solids, because bromine sits in the same column as chlorine, and the elements of one column are a family whose members behave alike in their reactions.', correct: true },
        { id: 'b', text: 'Bromine will hardly combine with anything, because the seventeenth column is the last column but one, and the columns over at the right-hand edge of the table are where the elements that stay out of reactions altogether are kept.' },
        { id: 'c', text: 'Bromine will behave like whichever element sits in the square immediately to its left in the fourth row, because the elements that touch each other along a row are the real family, and a column just gathers up the squares that happen to line up underneath one another.' },
        { id: 'd', text: 'Nothing about bromine can be predicted from the table, because a square records only a symbol and an atomic number, and how an element reacts has to be measured in a laboratory before anything at all can be said about it.' },
      ],
      expectedAnswer: 'Bromine will also combine readily with metals to form white, crystal-like solids, because bromine sits in the same column as chlorine, and the elements of one column are a family whose members behave alike in their reactions.',
      hints: [
        'Write both addresses out before you choose. Which number do chlorine and bromine share -- the period or the group? That is the only number the prediction is allowed to rest on.',
        'Then test the choice you like against the rule rather than against how the squares are arranged. Sitting next to something is not the same as being in its family, and a table that could predict nothing about an element would not be worth building.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-row-versus-column',
      kind: 'misconception_check',
      question:
        'A student writes: "Sodium and silicon are both in the third row, so they are in the same family and should behave alike. And a metalloid must be a metal and a nonmetal mixed together, since it has some properties of each." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'Sodium and silicon are both in the third row, so they are in the same family.',
          misconception:
            'Reading the row as the family, because two squares in the same row sit side by side on the page and closeness on a page looks like kinship.',
          correctsTo:
            'The row is the PERIOD, and a period is not a family. Going across a row the properties change gradually, from metal at the left-hand end toward nonmetal at the right-hand end, so two elements in one row can be about as unalike as elements get. Sodium is in period 3, group 1: a soft silvery metal that fizzes hard in water. Silicon is in period 3, group 14: a hard gray solid that snaps when it is struck and does nothing in water. Same row, thirteen columns apart, nothing in common. The FAMILY is the column, and that is where a prediction comes from. WRONG: "Same row, so same family." CORRECT: "Same column, so same family. Same row only means the two squares are in the same band of the map."',
        },
        {
          answer: 'A metalloid must be a metal and a nonmetal mixed together.',
          misconception:
            'Hearing "properties of both" as "made of both", so an in-between description gets read as a recipe with two ingredients in it.',
          correctsTo:
            'A metalloid is ONE element, made of one kind of atom, and nothing has been mixed into it. A piece of silicon contains silicon atoms and nothing else, exactly as a piece of copper contains only copper atoms. What sits in between is not the material, it is the list of properties: a metalloid happens to be shiny like a metal, brittle like a nonmetal, and a carrier of current somewhere between the two. That is why the metalloids are the squares ON the staircase line rather than squares off to one side -- the line marks where the properties change over, and the elements sitting on it are the ones caught in the middle of that change. WRONG: "It is a metal and a nonmetal mixed." CORRECT: "It is a single element whose properties fall between the metals and the nonmetals."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A square carries three things: the symbol (first letter capital, second letter lowercase), the name, and the atomic number, which is the number of protons in one atom of that element.',
        'The address has two parts, and you say the period first: PERIOD is the row you count DOWN to (there are seven), GROUP is the column you count ACROSS to (there are eighteen).',
        'If you get a period above 7 or a group above 18, you have swapped the two. Count again.',
        'Metals fill the left-hand side and the middle: shiny, current-carrying, bendable. Nonmetals are the block in the upper right: dull, insulating, brittle. Metalloids sit on the staircase between them and have properties from both sets.',
        'A metalloid is a single element, not two substances mixed. Hydrogen, alone at the top left, is a nonmetal even though it sits above the metals.',
        'The COLUMN is the family. Elements in the same group behave alike in their reactions; elements in the same period do not, because properties change gradually across a row.',
        'The alkali metals -- the first column below hydrogen -- all react with water. The noble gases, the last column, barely react with anything.',
        'The routine: read the square, give the address, classify from position, check that against the properties you were given, and predict from the column and nothing else.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.3', cedTitle: 'Reading the Periodic Table' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
