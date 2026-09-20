/**
 * Grade 8 Science (Physical Science) — Chemical Reactions: Rearranging Atoms
 * & Conservation of Mass.
 *
 * PROCEDURE-LED row (8.2, NGSS MS-PS1-5), built on the shape of the
 * procedure-led exemplar `m8sci-u8-evidence-of-a-chemical-reaction.ts`. One
 * routine runs the whole lesson: name the reactants and the products, say how
 * many atoms of each kind sit inside ONE molecule of each, multiply molecules
 * by atoms-per-molecule element by element on each side, compare the two
 * columns kind by kind, and then read the balance — unchanged in a sealed
 * container, and moved in an open one only by the mass of the matter that
 * crossed the boundary.
 *
 * The two traps it is built to kill are (a) matching MOLECULE counts instead
 * of ATOM counts, and (b) "the log lost mass, so mass was destroyed" -- an
 * open-container reading read as a violation of the rule rather than as
 * evidence of matter crossing a boundary. The second trap is deliberately run
 * in BOTH directions, because a student who has only ever seen the burning
 * case learns "reactions lose mass" instead of the rule: burning makes the
 * reading fall and rusting makes it rise, and one rule accounts for both.
 *
 * BURNED SPECIMENS (controller ruling 36). The scope cell's own worked
 * example -- two hydrogen molecules plus one oxygen molecule giving two water
 * molecules, four hydrogen atoms and two oxygen atoms on each side -- is
 * copied verbatim into `los[0].description`, which the academy renders to the
 * student as the lesson objective. It is therefore answerable from the
 * objective and may NOT be an item. It is used here as worked example 1 and
 * again in the misconception check, both TEACHING segments, which ruling 22
 * expressly allows. All three `try_yourself` specimens are fresh and appear
 * nowhere else in the file: methane on a gas stove (item 1), a sealed bottle
 * with an antacid tablet (item 2), and charcoal on an open balance pan
 * (item 3). A later editor must not "helpfully" move the hydrogen-and-oxygen
 * count into an item.
 *
 * SCOPE GUARD: this plan counts atoms of each kind on each side of a reaction
 * that is described entirely in words, concludes that total mass is conserved
 * because the atoms are, and uses that to read a balance -- unchanged in a
 * sealed container, moved in an open one only by the mass of the gas that
 * left or joined. The scope cell carries all three parts. Its lineage and
 * withheld clauses, verbatim: "Grade 7 traced the same atom-conservation rule
 * through an organism (`m7sci-u4-matter-and-energy-in-organisms.ts`, read in
 * full) — cited as prior knowledge, not re-taught (MS-PS1-5 and the
 * reactant/product model merged into one lesson; sign-off 7)"; "Withholds
 * writing and balancing symbolic equations with coefficients
 * (`chem-u5-balancing-equations.ts`) and any mole reasoning (`chem-u6-*`)."
 * What that means at each edge, and what is deliberately ALLOWED there:
 *   - GRADE 8 NEIGHBORS. Row 8.1 (evidence of a chemical reaction) is
 *     assumed, not re-taught: this file never asks whether a change is
 *     physical or chemical, never lists the five signs, and every scenario in
 *     it is STATED to be a reaction rather than diagnosed as one. Row 8.3
 *     (reactions that release or absorb thermal energy) is not entered: no
 *     reaction in this file is classified as releasing or absorbing, the
 *     words exothermic and endothermic do not appear, and although a campfire
 *     and a burning lump of charcoal appear, neither is used to make a point
 *     about warmth or energy. (The words "release", "absorb" and "energy"
 *     occur in the authored body exactly once each, all three inside the
 *     `followUps` loId that names row 8.3; no segment contains any of them.) Row 7.4 (reading a formula) is assumed: every
 *     formula here is read out in words with its atom count, as 7.4 taught,
 *     and none is derived from a name. Row 7.2 (inside the atom) is not
 *     entered: this file says an atom has a mass and keeps its identity
 *     through a reaction, and never mentions a proton, a neutron, an electron
 *     or an atomic number.
 *   - REACTIONS ARE NEVER WRITTEN AS EQUATIONS. Every reaction in this file
 *     is a sentence: "two hydrogen molecules and one oxygen molecule become
 *     two water molecules". No arrow, no coefficient in front of a formula,
 *     and no symbolic equation appears anywhere. Plain-text formulas (H2,
 *     O2, H2O, CO2, CH4) appear only in parentheses beside their spoken form
 *     and their atom count, which is the form the contract requires.
 *   - GRADE 6 EARTH & SPACE SCIENCE boundary: no Earth-systems content is in
 *     scope for this row, and none appears. The campfire and the rusting
 *     steel wool are used as chemical reactions with a mass account, never as
 *     weathering, never as the carbon cycle, and never as a climate or
 *     atmosphere topic; the words greenhouse, fossil fuel, rock, mineral and
 *     weathering do not appear in this file.
 *   - GRADE 7 LIFE SCIENCE boundary: the atom-conservation rule is cited ONCE,
 *     in the first concept keyIdea, as a rule the student already holds from
 *     tracing atoms through a living body, and is immediately generalized to
 *     non-living reactions. That single clause is the whole life-science
 *     surface of the authored body: outside it, the words organism, cell,
 *     glucose, photosynthesis and respiration appear nowhere in any segment
 *     (the word "organism" does appear above, inside the lineage clause
 *     quoted verbatim from the curriculum cell). No item and no worked
 *     example uses a living thing.
 *   - HS CHEMISTRY boundary (the upward edge for this row): this file stops
 *     short of writing a balanced symbolic equation and of the coefficients
 *     that balancing needs (`chem-u5-balancing-equations.ts`); every atom
 *     count here is read off a sentence that already states how many
 *     molecules take part, and the student is never asked to choose those
 *     numbers. It stops short of the mole, molar mass, stoichiometry and
 *     limiting reactant (`chem-u6-*`): the only quantities are counts of
 *     atoms and masses in grams that the item states outright. It names no
 *     reaction type, no product beyond the ones the item supplies, and it
 *     never mentions mass turning into energy in any form -- the legacy
 *     file's E = mc2 and nuclear aside is deliberately not carried, per the
 *     curriculum's "Explicitly excluded" list (`chem-u10-*`).
 *   - AP PHYSICS boundary: no force, motion, energy or wave content is in
 *     scope for this row, and none appears. No segment states an energy
 *     change, a temperature, a force, an acceleration or a speed, and no
 *     formula of any kind is written. The only measured physical quantity
 *     anywhere in the body is mass, always in grams; the only other
 *     quantities are plain durations (a minute, a week, hours) used to set a
 *     scene, and they are never measured or computed with.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every reaction
 * and every balance reading in this file is written out in words inside the
 * segment that uses it, and every item is solvable from the text printed
 * inside it. Never write "look at the equation", and never assume the student
 * has a balance, a jar of steel wool or a bottle of fizzing water in front of
 * them -- the investigations here are described, and no item asks for an
 * observation the student has to make.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 8.1 -> 8.2 ->
 * 8.3 (`evidence-of-a-chemical-reaction` ->
 * `rearranging-atoms-and-conservation-of-mass` ->
 * `reactions-that-release-or-absorb-thermal-energy`). Both arrays carry the
 * real neighbors, per the contract's chain table.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8SCI_U8_REARRANGING_ATOMS_AND_CONSERVATION_OF_MASS: LessonPlan = {
  id: 'evelyn.ms.m8sci.rearranging-atoms-and-conservation-of-mass.v1',
  title: 'Rearranging Atoms & Conservation of Mass',
  curriculum: 'MS',
  grade: '8',
  subject: 'science',
  topic: 'grade-8-physical-science',
  locale: 'en',
  los: [
    {
      id: 'm8sci.rearranging-atoms-and-conservation-of-mass',
      standard: 'M8SCI-8.2',
      description:
        'Model a chemical reaction as reactants whose atoms are regrouped into products, count atoms of each kind before and after (two hydrogen molecules plus one oxygen molecule gives two water molecules: four hydrogen atoms and two oxygen atoms on each side), conclude that total mass is conserved, and explain "lost" mass in an open container as gas that escaped versus the unchanged reading in a sealed one (NGSS MS-PS1-5).',
    },
  ],
  prerequisites: ['m8sci.evidence-of-a-chemical-reaction'],
  followUps: ['m8sci.reactions-that-release-or-absorb-thermal-energy'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Turn the everyday word "gone" into a question with a checkable answer, so the student wants a way to account for matter that cannot be seen.',
      script:
        'You have watched a campfire burn down. A whole armful of thick logs goes in, and hours later all that is left in the pit is a heap of gray ash you could lift with two hands. Almost all of that wood is gone -- and "gone" is the word everyone reaches for, which is exactly the problem, because it is not what happened. Not one atom of that wood stopped existing. Every single one of them is still out there: some in the ash, and far more of them mixed into the air above the pit, joined up with atoms that came out of that air. Here is the claim that sounds impossible and is true. If you had been able to put the wood and the air it burned in on one side of a balance, and the ash and everything that floated away on the other, the two sides would have matched. Today you learn the bookkeeping that makes a claim like that checkable: how to count the atoms on each side of a reaction, why the two counts always agree, and why a balance in an open room tells you something quite different from a balance reading a sealed jar.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-counting-atoms-and-conserving-mass',
      kind: 'concept',
      goal: 'Install the reactant-and-product model, the two-number atom count and the routine that uses it, the step from atoms conserved to mass conserved, and the open-versus-sealed rule that explains a balance reading that moves.',
      keyIdeas: [
        'A REACTION REGROUPS ATOMS. IT NEVER MAKES THEM AND NEVER DESTROYS THEM. The substances you start with are the REACTANTS, and the substances you end up with are the PRODUCTS. During the reaction the atoms in the reactants come apart from the partners they were joined to and are joined up in new arrangements, and those new arrangements are the products. Every atom that was in the reactants is somewhere in the products. You already know this rule from tracing the atoms of a meal through a living body: the atoms are rearranged, never destroyed. This lesson takes that same rule out of the body and applies it to any chemical reaction at all -- a fire, a rusting nail, a fizzing tablet in a bottle.',
        'COUNTING A SIDE TAKES TWO NUMBERS, NOT ONE. A molecule is a group of atoms joined together, and the formula of a substance tells you how many atoms of each kind sit inside ONE of its molecules. An oxygen molecule is O two -- two oxygen atoms joined together (O2). A water molecule is H two O -- two hydrogen atoms and one oxygen atom (H2O). So to count one kind of atom on one side you need how many molecules of that substance there are, AND how many atoms of that kind are inside each one. Multiply those two numbers. Three water molecules hold three times two hydrogen atoms, which is six hydrogen atoms, and three times one oxygen atom, which is three oxygen atoms.',
        'THE ROUTINE, IN ORDER. (1) Say the reactants in words, with the atom count inside one molecule of each. (2) Say the products the same way. (3) Take one kind of atom at a time, multiply molecules by atoms-per-molecule for every reactant that contains it, and add those results up. (4) Do the same for the products. (5) Compare the two totals for that kind of atom, then move on to the next kind. Every kind must come out the same on both sides, because the reaction only regrouped what was already there. If a total does not match, the count is wrong somewhere, and it is almost always one of two slips: a molecule of an element read as though it were a single atom, or a kind of atom that leaves in TWO different products and was only collected from one of them.',
        'ATOMS CONSERVED MEANS MASS CONSERVED. Every atom has its own mass, and a reaction does not change what any atom is: a carbon atom is still a carbon atom afterward, and an oxygen atom is still an oxygen atom. So if all the same atoms are still there, all the same mass is still there. The total mass of the reactants equals the total mass of the products, in every chemical reaction, without exception. That is the law of conservation of mass, and the atom count is the reason it holds.',
        'WHY A BALANCE SOMETIMES SEEMS TO DISAGREE: OPEN VERSUS SEALED. A balance can only weigh what is sitting on it. Inside a SEALED container nothing can get in and nothing can get out, so a sealed container weighed before the reaction and after it reads the same, every time. In an OPEN container matter is free to cross the boundary, and then the reading does move -- but it moves by exactly the mass of whatever crossed, and by nothing else. If a gas is produced and floats away, the reading falls by the mass of that gas. If a gas out of the air joins what is on the pan, the reading rises by the mass of the gas that joined. Neither one is mass being destroyed or created. Both are mass changing address.',
        'THE READING MOVES BOTH WAYS, AND ONE RULE COVERS BOTH. Burning is the case everybody knows: a log burns and a small heap of ash is left, so the reading falls a long way. The wood did not stop existing; most of its atoms left as gases you cannot see, and oxygen out of the air went with them. Rusting is the same rule running the other way: damp iron left on an open balance gets HEAVIER, because oxygen atoms from the air join the iron atoms to make rust, which is a new substance. Falling and rising look like opposite results, and they are one rule. Ask what crossed the boundary, and which way it went.',
      ],
      vocabulary: [
        { term: 'reactant', definition: 'a substance you start with, before a chemical reaction takes place.' },
        { term: 'product', definition: 'a substance that has been made by the reaction, out of the atoms the reactants brought.' },
        { term: 'rearranged', definition: 'the same atoms taken apart from their old partners and joined together in a new way, making different substances.' },
        { term: 'conservation of mass', definition: 'the rule that the total mass of the reactants equals the total mass of the products, because the atoms are only regrouped.' },
        { term: 'sealed container', definition: 'a container nothing can get into or out of, so everything taking part stays on the balance; also called a closed system.' },
        { term: 'open container', definition: 'a container matter can leave or enter, so a gas can float away or join in without the balance ever seeing it arrive or go; also called an open system.' },
      ],
      suggestedTools: ['show_table', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-hydrogen-and-oxygen-make-water',
      kind: 'worked_example',
      problem:
        'Hydrogen gas and oxygen gas react and make water. Two hydrogen molecules and one oxygen molecule take part, and two water molecules come out. A hydrogen molecule is H two -- two hydrogen atoms joined together (H2). An oxygen molecule is O two -- two oxygen atoms joined together (O2). A water molecule is H two O -- two hydrogen atoms and one oxygen atom (H2O). Count the atoms of each kind on each side, and say whether anything was created or destroyed.',
      steps: [
        'Step 1, say the reactant side in words, with the atoms inside one molecule of each. Two hydrogen molecules, and each one of them holds two hydrogen atoms. One oxygen molecule, and it holds two oxygen atoms. Nothing else goes in.',
        'Step 2, count the reactant side one kind of atom at a time. Hydrogen: two molecules, with two hydrogen atoms in each, which is two times two, or four hydrogen atoms. Oxygen: one molecule, with two oxygen atoms in it, which is one times two, or two oxygen atoms. The reactant side holds four hydrogen atoms and two oxygen atoms.',
        'Step 3, say the product side the same way and count it. Two water molecules, and each water molecule holds two hydrogen atoms and one oxygen atom. Hydrogen: two molecules times two hydrogen atoms each, or four hydrogen atoms. Oxygen: two molecules times one oxygen atom each, or two oxygen atoms. The product side holds four hydrogen atoms and two oxygen atoms.',
        'Step 4, compare the two sides one kind of atom at a time. Hydrogen: four before, four after. Oxygen: two before, two after. Every atom that went in came out. Nothing was created and nothing was destroyed; the atoms were pulled away from their old partners and joined to new ones.',
        'WRONG: "Three molecules went in and only two came out, so one of them was destroyed." CORRECT: "Three molecules went in and two came out, and that is allowed, because it is the ATOMS that have to match and not the molecules. The same four hydrogen atoms and two oxygen atoms are on both sides; they are simply packed into two molecules instead of three." The molecule count is packaging. The atom count is the law.',
        'Now run the two checks a science answer needs. First, look for clues of DIFFERENT KINDS that agree. The element-by-element count agrees: four and four, then two and two. The tracing agrees, and it is a different kind of evidence, because it names where each atom went rather than how many there are: the two hydrogen atoms of the first hydrogen molecule are the two hydrogen atoms in the first water molecule, the two from the second hydrogen molecule are in the second water molecule, and the oxygen molecule came apart so that one of its two oxygen atoms went into each water molecule. And a measurement agrees: run this inside a sealed container standing on a balance, and the reading before is the reading after, which is what "no atoms gained and none lost" has to look like on a scale. Second, change one thing and check that the answer moves the way it should. Double what you start with: four hydrogen molecules and two oxygen molecules. The reactant side now holds four times two, or eight hydrogen atoms, and two times two, or four oxygen atoms. What comes out is four water molecules, holding four times two, or eight hydrogen atoms, and four times one, or four oxygen atoms. Both totals moved, from four and two up to eight and four, and the two sides still match each other exactly. The rule was never about those particular numbers. It is about the two sides agreeing, whatever the numbers are.',
      ],
      answer:
        'Four hydrogen atoms and two oxygen atoms on the reactant side, and four hydrogen atoms and two oxygen atoms on the product side. Nothing was created and nothing was destroyed: the same six atoms were regrouped from three molecules into two.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-rusting-open-and-sealed',
      kind: 'worked_example',
      problem:
        'A ball of steel wool, which is mostly iron, has a mass of 20 grams. It is dampened and left sitting on an open balance pan for a week, and rust forms all over it. The balance now reads 22 grams. A second, identical ball of steel wool with a mass of 20 grams is dampened and sealed inside a glass jar. The jar, the air inside it and the steel wool together have a mass of 250 grams before the week starts, and the wool rusts inside the sealed jar over that same week. The sealed jar still reads 250 grams afterward. Explain both readings with one rule.',
      steps: [
        'Step 1, say what rusting does to the atoms. Iron rusts when iron atoms join with oxygen atoms out of the air to make rust, which is a different substance from either of them: orange-brown and crumbly, where the iron was gray and hard. No atom is created anywhere in that sentence. Iron atoms that were already in the wool, and oxygen atoms that were already in the air, end up joined together.',
        'Step 2, read the open pan. The balance went from 20 grams to 22 grams, a rise of 2 grams. Ask the boundary question: what crossed, and which way? Oxygen came out of the room and joined the iron sitting on the pan, so matter came IN. That is why the reading rose, and the size of the rise tells you exactly how much oxygen joined: 22 grams take away 20 grams, which is 2 grams of oxygen.',
        'Step 3, read the sealed jar. The jar was closed, so nothing could cross its boundary in either direction. The reaction still happened -- rust formed on the wool inside -- but the oxygen that joined the iron came out of the air that was already sealed in there. So whatever mass the wool inside gained -- say it also gained 2 grams -- the air sealed in with it lost exactly that same 2 grams of oxygen. Move 2 grams from one part of a sealed jar to another part of the same sealed jar and the total is untouched: 250 grams before, 250 grams after.',
        'Step 4, state the one rule that covers both readings. Mass is conserved in every chemical reaction, open or sealed. A balance reading changes only when matter crosses the boundary of what is being weighed. The open pan was weighing the wool alone, and oxygen crossed onto it, so the reading rose. The sealed jar was weighing everything that took part, including the air, so nothing crossed, and the reading held still.',
        'WRONG: "Rust is heavier than iron, so a rusty ball of steel wool weighs more." CORRECT: "Rust is a different substance, made of the iron atoms plus oxygen atoms that joined them, and the extra 2 grams on the pan is the mass of the oxygen that arrived from the air." Saying that rust "is heavier" makes it sound as though the same matter somehow got weightier. It did not. There is simply more matter on the pan than there was before, and every gram of it can be traced to something that was already in the room.',
        'Now the two checks. First, three clues of DIFFERENT KINDS agreeing that nothing was created. The atom account agrees: every oxygen atom in the rust can be traced back to an oxygen molecule that was in the air, and every iron atom was in the wool to begin with. The arithmetic of the two readings agrees, and that is a measurement rather than an account: the open pan rose by exactly the 2 grams of oxygen that joined, while the sealed jar, which had that oxygen counted inside its 250 grams from the start, did not move at all. And a case running in the OPPOSITE direction agrees as well, which is a third kind of clue: a log burning on an open balance makes the reading fall, because there the atoms mostly leave as gases instead of arriving as one. Rise and fall, one rule. Second, change one thing and check that the answer moves. Take the rusting wool off the open pan and seal it in the jar instead. The reading stops rising, even though the rusting itself has not changed in any way. The reaction did not move. The boundary did. That is the proof that a balance measures what crossed its boundary, and never how much matter exists.',
      ],
      answer:
        'One rule covers both: mass is conserved, and a balance reading moves only when matter crosses the boundary of what is on it. On the open pan, 2 grams of oxygen from the air joined the iron, so 20 grams became 22 grams. Inside the sealed jar the same joining happened, but the oxygen came out of the air already sealed in, so the jar held the same 250 grams before and after.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-count-the-atoms-methane',
      kind: 'try_yourself',
      problem:
        'A gas stove burns methane, which is the main gas in natural gas. One methane molecule -- C H four, one carbon atom and four hydrogen atoms (CH4) -- reacts with two oxygen molecules, each one made of two oxygen atoms joined together (O2). What comes out is one carbon dioxide molecule -- C O two, one carbon atom and two oxygen atoms (CO2) -- and two water molecules, each one made of two hydrogen atoms and one oxygen atom (H2O). Which count of the atoms on each side is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'One carbon atom, four hydrogen atoms and two oxygen atoms before, and one carbon atom, four hydrogen atoms and two oxygen atoms after, because the two oxygen molecules going in are two particles and so count as two oxygen atoms, and the oxygen coming back out is the pair held inside the carbon dioxide.' },
        { id: 'b', text: 'One carbon atom, four hydrogen atoms and four oxygen atoms before, and one carbon atom, two hydrogen atoms and three oxygen atoms after, because the water coming out is one substance and is counted once as a water molecule, two hydrogen atoms and one oxygen atom, alongside the carbon dioxide.' },
        { id: 'c', text: 'One carbon atom, four hydrogen atoms and four oxygen atoms before, and one carbon atom, four hydrogen atoms and four oxygen atoms after, because the two oxygen molecules hold two oxygen atoms each and the two water molecules hold two hydrogen atoms and one oxygen atom each.', correct: true },
        { id: 'd', text: 'One carbon atom, four hydrogen atoms and four oxygen atoms before, and one carbon atom, four hydrogen atoms and two oxygen atoms after, because each product is counted for the one kind of atom it carries out, the carbon dioxide for the oxygen and the water for the hydrogen.' },
      ],
      expectedAnswer: 'One carbon atom, four hydrogen atoms and four oxygen atoms before, and one carbon atom, four hydrogen atoms and four oxygen atoms after, because the two oxygen molecules hold two oxygen atoms each and the two water molecules hold two hydrogen atoms and one oxygen atom each.',
      hints: [
        'Two numbers make each count, never one: how many molecules of that substance there are, and how many atoms of the kind you are counting sit inside one of those molecules. Start with the oxygen going in, where there are two molecules and each holds two atoms.',
        'Then make sure you have collected a kind of atom from EVERY substance it appears in. Oxygen leaves in two different products here, so the oxygen inside the carbon dioxide and the oxygen inside both water molecules all belong in the same total.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sealed-bottle-antacid',
      kind: 'try_yourself',
      problem:
        'An antacid tablet with a mass of 3 grams is dropped into a plastic bottle holding 200 grams of water, and the cap is screwed down tight straight away. The empty bottle and its cap have a mass of 25 grams. The tablet fizzes for about a minute, a gas collects in the space above the water, and nothing gets into or out of the bottle at any point. The whole sealed bottle stands on a balance the entire time. What does the balance read once the fizzing has stopped, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '225 grams, because the 3-gram tablet broke apart into a gas that collected in the space above the water instead of resting on the bottom, and a gas sitting at the top of a bottle no longer presses down on the balance.' },
        { id: 'b', text: '203 grams, unchanged from the reading at the start, because nothing crossed the boundary of the sealed bottle, and what the balance has on it is the 200 grams of water plus the 3-gram tablet, the plastic bottle being only the container they sit in.' },
        { id: 'c', text: '231 grams, because the gas that formed takes up far more room than the small solid tablet ever did, and matter that has spread out to fill a larger space presses down on the balance more heavily than the same matter packed small.' },
        { id: 'd', text: '228 grams, exactly what it read before, because the bottle is sealed and nothing crossed its boundary: the atoms that were in the tablet and the water have been regrouped into new substances, the gas included, and every one of them is still inside.', correct: true },
      ],
      expectedAnswer: '228 grams, exactly what it read before, because the bottle is sealed and nothing crossed its boundary: the atoms that were in the tablet and the water have been regrouped into new substances, the gas included, and every one of them is still inside.',
      hints: [
        'Add up what is standing on the balance before the fizzing starts: the bottle with its cap, the water, and the tablet. Then ask the only question a balance reading answers -- did any matter cross the boundary of the bottle?',
        'A gas is made of atoms and has mass, whether it is down at the bottom of a bottle or up at the top. Nothing left, so nothing can be missing from the total.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-charcoal-open-pan',
      kind: 'try_yourself',
      problem:
        'A lump of charcoal that is almost entirely carbon has a mass of 30 grams. It is burned on an open balance pan, and it keeps burning until there is nothing at all left on the pan. While it burns, a careful measurement shows that 80 grams of oxygen from the air join the carbon. What is the total mass of the gases that floated away from the pan, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '110 grams, because every atom of the 30 grams of charcoal and every atom of the 80 grams of oxygen has to be somewhere afterward, and the gas that floated away is the only place left for them: 30 grams and 80 grams together come to 110 grams.', correct: true },
        { id: 'b', text: '30 grams, because the charcoal was the only thing standing on the pan when the balance was first read, and the gases leaving the pan cannot carry off more mass than was ever on the pan to begin with: the reading ran from 30 grams down to nothing.' },
        { id: 'c', text: '50 grams, because 80 grams of oxygen joined a lump that had only 30 grams in it to begin with, and what the gases carry off is the difference the joining made: 80 grams take away 30 grams leaves 50 grams.' },
        { id: 'd', text: '0 grams, because the pan is completely empty at the end and there is nothing at all left for the balance to read, and a gas light enough to drift up into the air on its own has no mass for it to carry away.' },
      ],
      expectedAnswer: '110 grams, because every atom of the 30 grams of charcoal and every atom of the 80 grams of oxygen has to be somewhere afterward, and the gas that floated away is the only place left for them: 30 grams and 80 grams together come to 110 grams.',
      hints: [
        'Nothing was destroyed, so write down everything that took part and everything that is left. The carbon went in, the oxygen out of the air went in, and not a speck stayed on the pan. Where is all of that matter now?',
        'The balance could never see the oxygen arriving, because the oxygen came out of the air rather than off the pan. The mass that floated away is the mass of the charcoal PLUS the mass of the oxygen that joined it, not either one on its own.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mass-destroyed-and-molecule-counting',
      kind: 'misconception_check',
      question:
        'A student writes: "When a log burns down to ash, most of its mass is destroyed -- that is why so little is left. And a reaction that starts with three molecules and ends with only two molecules must have destroyed one of them along the way." Two separate things have gone wrong. What are they?',
      commonErrors: [
        {
          answer: 'When a log burns down to ash, most of its mass is destroyed.',
          misconception:
            'Reading a balance as a measure of how much matter exists, so that matter which leaves the pan as an invisible gas gets counted as matter that stopped existing.',
          correctsTo:
            'Nothing was destroyed. The atoms that were in the wood are nearly all still in the room, joined to oxygen atoms out of the air and floating away as gases you cannot see. Weigh everything instead of only the pan and the totals match: the mass of the wood plus the mass of the oxygen it combined with equals the mass of the ash plus the mass of the gases that left. The test that settles it is to close the boundary. Burn the same material inside a sealed container that holds its own air, weigh the whole container before and after, and the reading does not move by a single gram. WRONG: "Most of the mass was destroyed." CORRECT: "Most of the mass left the pan as gas, and a sealed container shows that none of it was lost at all."',
        },
        {
          answer: 'A reaction that ends with fewer molecules than it started with must have destroyed one of them.',
          misconception:
            'Counting molecules as though molecules were the thing that has to be conserved, when a molecule is only one particular grouping of atoms, and the grouping is precisely what a reaction changes.',
          correctsTo:
            'A molecule is not something that has to survive a reaction. It is a package, and taking apart three packages to build two larger ones out of the very same contents destroys nothing. What has to match, kind by kind, is the count of ATOMS. Two hydrogen molecules and one oxygen molecule hold four hydrogen atoms and two oxygen atoms between them, and the two water molecules they become hold four hydrogen atoms and two oxygen atoms as well: three molecules before, two after, and the same six atoms the whole way through. WRONG: "Three molecules in and two out, so one was destroyed." CORRECT: "Molecule counts are free to change. Atom counts, kind by kind, are not."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A chemical reaction regroups atoms. The reactants come apart and the same atoms are joined into the products; not one atom is created and not one is destroyed.',
        'Counting one kind of atom on one side takes two numbers: how many molecules there are, and how many atoms of that kind are inside one molecule. Multiply them, do it for every substance on that side, and add the results.',
        'Compare the two sides one kind of atom at a time. Every kind has to come out the same before and after.',
        'Molecule counts are allowed to change. Atom counts are not. Three molecules in and two molecules out is perfectly normal.',
        'Because all the same atoms are still there, the total mass of the reactants equals the total mass of the products. That is the law of conservation of mass.',
        'A balance weighs only what is on it. In a sealed container nothing crosses the boundary, so the reading before and the reading after are the same, every time.',
        'In an open container the reading moves by the mass of whatever crossed the boundary: it falls when a gas floats away, as when a log burns down to ash, and it rises when oxygen from the air joins a solid, as when damp iron rusts.',
        'Mass that seems to go missing when something burns did not stop existing. It left as gas, and the wood plus the oxygen it took from the air weigh exactly as much as the ash plus those gases.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'Rearranging Atoms & Conservation of Mass' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
