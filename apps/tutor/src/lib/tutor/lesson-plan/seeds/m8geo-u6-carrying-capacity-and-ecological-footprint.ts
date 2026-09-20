/**
 * Grade 8 World Geography — Resources, Energy & Sustainability: Carrying
 * Capacity & Ecological Footprint.
 *
 * CONCEPT-LED row (National Geography Standard 14), shaped on the concept-led
 * exemplar `m8geo-u7-hazard-risk-exposure-and-vulnerability.ts`. The row
 * installs ONE balance -- the productive land a place's people demand, set
 * against the productive land that place has -- and then makes the student
 * USE it on described data three times over: compute each place's own surplus
 * or shortfall, move the balance by changing one input and say where it lands,
 * and decide what a stated overshoot claim counted and what it left outside
 * the boundary it drew. Every item is answered by a computed figure, a
 * named place-in-the-data, or a verdict carrying its own arithmetic, never by
 * a definition.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause where it is used, that a
 * supply drawn on faster than it is replaced runs short (Grade 7,
 * `m7geo-u5-resources-and-economic-activity.ts`) and that slowing how fast
 * people draw on a supply is what conserving changes (Grade 6,
 * `m6geo-u6-conserving-natural-resources.ts`), and re-teaches neither: the
 * faster-than-replaced clause appears exactly once, inside keyIdea 1, as the
 * reason a balance is worth computing at all; the words "renewable",
 * "nonrenewable", "reduce", "reuse", "recycle" and "repair" appear nowhere in
 * the authored body, and no keyIdea sorts a resource into a category or names
 * a conservation practice. It ADDS the two-sided balance itself: dividing a
 * place's productive land by its people to get land for each person, setting
 * that against the footprint for each person, converting the per-person gap
 * into a whole-place figure in hectares, reading the same division the other
 * way round to get how many people that land supports, moving the balance by
 * changing ONE input (a technology change that lowers the footprint, an
 * import that changes which land is drawn on, a change in the land itself),
 * and evaluating an overshoot claim by naming the boundary its sum used.
 *
 * It STOPS SHORT of ecosystem carrying capacity as population biology
 * (`bio-u9-population-community-ecology.ts` owns the logistic curve, the
 * symbol K, density-dependent and density-independent limiting factors, and
 * the overshoot-then-crash pattern): nothing below is a curve, nothing below
 * has a shape, no limiting factor is classified, no population crashes, and
 * the letter K appears nowhere in the authored body. It also stops short of
 * named agricultural land-use models (`ap-human-geo-agriculture.ts`), of allocating a described
 * basin's flow between upstream and downstream users and judging an
 * allocation rule (row 6.1 `water-scarcity-and-allocation`), of evaluating an
 * energy mix against a place's constraints (row 6.2
 * `comparing-energy-sources`), of comparing two farming systems on yield,
 * inputs, water and labor and of judging food security by availability,
 * access and stability (row 6.4 `food-systems-and-food-security`), of
 * quantifying the gain from specializing and pricing a backup for a supply
 * chain (row 8.1 `specialization-and-supply-chain-risk`), and of any doubling
 * time or rule of 70 (row 5.2 `evaluating-population-projections`).
 *
 * Three things ARE deliberately allowed, because neighboring rows sit close
 * and the line has to be drawn precisely rather than avoided:
 * (a) IMPORTS AND TRADE appear as an input that moves which land a place
 * draws on, because this row's own scope line names technology, trade and
 * imports as the three things that move a capacity -- but no gain from
 * specializing is computed, no chain, strait, port or backup is priced, and
 * no tariff, exchange rate, trade agreement or dispute is named anywhere,
 * which the course excludes at every grade;
 * (b) FOOD, TIMBER AND THE GROUND BUILDINGS AND ROADS STAND ON are named as
 * what productive land does, because a footprint is land and the student has
 * to know what the land is doing -- named as the content of a hectare, never
 * compared as farming systems on yield, inputs, water or labor, which is row
 * 6.4's;
 * (c) ONE CHANGE TO THE LAND ITSELF (Brightmere given 120,000 hectares
 * instead of 90,000 in the first worked example) is run as the contrasting
 * case, because a balance whose supply side never moves teaches that capacity
 * is a property of a place, which is exactly the misconception this row
 * exists to kill -- it changes an input and reads the new balance, and does
 * not evaluate the change, price it, or say who brought it about.
 *
 * DEPTH FLOOR NOTE FOR THE FAN-OUT: read every keyIdea below and notice what
 * each one is ABOUT. None of them says what a resource is, which resources
 * are renewable, or why conserving matters; every one of them says what you
 * DO with two numbers -- divide, subtract, scale up to the whole place,
 * invert the division, change one input, name the boundary of a sum. The
 * closest call was keyIdea 1, which has to say what the two sides of the
 * balance are before it can ask for a subtraction; it survived because its
 * definition clause is a premise that the same sentence immediately spends on
 * an operation, and because the Grade 6 and Grade 7 files this row stands on
 * contain no subtraction, no hectare and no per-person figure anywhere.
 *
 * ACCURACY NOTE: every place in this file is invented (Ardwell, Brightmere,
 * Caldon, Dunmere, Selwick, Tarnby, Wexmoor, Vessen) and every figure was
 * written for the arithmetic and checked by inversion. NO REAL COUNTRY,
 * REGION OR CITY IS NAMED ANYWHERE, and no real footprint, biocapacity or
 * overshoot figure appears, because those are published estimates that change
 * with the accounting method and the year and could not be verified here. The
 * only claims about the world are that a hectare is 10,000 square meters (a
 * square 100 meters on each side) and that productive land grows food and
 * timber and carries buildings. A verdict of "beyond its own land" is a
 * MEASUREMENT of hectares against hectares, never a judgment about a place or
 * the people in it, and the file says so out loud in keyIdea 6, in the second
 * worked example and in the recap.
 *
 * BURNED BY RULING 32: `los[0].description` is student-facing and names
 * technology, trade and imports as the three things that move a capacity, so
 * no item is keyed to naming one of them. Item 2 makes the student COMPUTE
 * where a technology change lands the balance, and item 3 makes the student
 * say what an import claim counted -- both unanswerable from the objective.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, and 94% at difficulty 4; chance with four choices is 25%).
 * Every distractor states the full wrong STEP that produces it -- footprints
 * compared across places instead of each against its own land, two places
 * pooled into one balance, land compared with a head count, capacity read off
 * the supply side alone, a saving counted twice, hectares read as people, the
 * footprint multiplied where it had to be divided, outside land subtracted
 * from inside land -- and no key was built to be the longest choice BECAUSE
 * it is the key. MEASURED as a diagnostic, not as a score, in a/b/c/d order.
 * First pass: 114/141/124/138 (item 1), 118/106/141/101 (item 2),
 * 150/145/149/217 (item 3). Two keys were strictly longest by a margin a
 * student could see -- item 3 by 67 characters (45 percent) and item 2 by 23
 * (19 percent) -- so in each of those two items the distractors were grown by
 * the wrong arithmetic they had been leaving implicit, never padded past what
 * the wrong step actually asserts, and no key was trimmed. Final:
 * 114/141/124/138, 132/125/141/146, 225/216/204/217. The key is now the
 * strictly longest choice in ZERO of the three items, and ruling 16 says to
 * check this is not the same tell inverted -- it is not: by length the key
 * ranks 4th, 2nd and 2nd of four, so "always pick the shortest" wins one item
 * and loses two. Item 1's key is the shortest, by 10 characters over the next
 * shortest -- an 8 percent margin inside noise, deliberately left alone rather
 * than padded. Zero is NOT the target; the meaningful measurement is the
 * 120-item course rate taken at registration, which should land near a
 * quarter. The three keys sit at ids a, c and d, which is the id set
 * `(6 + 3) mod 4 = 1` requires, omitting b; the four numeric choices in item
 * 2 are ordered by that rule and never by magnitude.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every table is written out
 * in prose inside the segment that needs it, and every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U6_CARRYING_CAPACITY_AND_ECOLOGICAL_FOOTPRINT: LessonPlan = {
  id: 'evelyn.ms.m8geo.carrying-capacity-and-ecological-footprint.v1',
  title: 'Carrying Capacity & Ecological Footprint',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.carrying-capacity-and-ecological-footprint',
      standard: 'M8GEO-6.3',
      description:
        'Given per-person footprint and available productive land for several places, compute whether each is within or beyond its own capacity, explain why carrying capacity is not fixed (technology, trade, and imports move it), and evaluate a stated overshoot claim for what it counts and what it leaves out (National Geography Standard 14: how human actions modify the physical environment).',
    },
  ],
  prerequisites: ['m8geo.comparing-energy-sources'],
  followUps: ['m8geo.food-systems-and-food-security'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see that two different moves can clear the same shortfall, and that only one of them changes how much land is being used, before any term is defined.',
      script:
        'You are playing a city-building game and a warning comes up: your town cannot feed itself. There are two buttons that make the warning go away. Button one upgrades your farms, so every field feeds more people than it did before. Button two opens a trade route, and the food arrives from the town across the map. Press either one and the warning clears. But look at what each one actually did. The upgrade means your people need less land than they did. The trade route means your people need exactly as much land as before -- the fields just moved onto somebody else\'s half of the map. The arithmetic behind that warning is the arithmetic you are about to do, and those two buttons are two of the three things that move its answer. Today you do the subtraction yourself: how much productive land the people of a place demand, how much that place has, and what is left over or missing. Then you take a claim that a place is living inside its means and work out which land it counted.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-the-two-sided-balance',
      kind: 'concept',
      goal: 'Install the land-demanded against land-available balance and the moves that go with it: divide land by people, subtract, scale the gap up to the whole place, invert the division into people supported, change one input, and name the boundary a sum used.',
      keyIdeas: [
        'A CAPACITY QUESTION IS A SUBTRACTION WITH TWO SIDES, AND YOU PUT BOTH SIDES ON ONE PERSON BEFORE YOU SUBTRACT. A supply drawn on faster than it is replaced runs short, so the useful question about a place is never whether it uses land but whether it uses more land than it has. The demand side is the ECOLOGICAL FOOTPRINT: the productive land it takes to supply what one person there uses in a year -- the fields the food grows in, the forest the timber comes from, the ground the house and the road sit on -- written in hectares for each person. The supply side is the productive land the place actually holds, and you put it on the same footing by dividing it by the number of people. Ardwell holds 120,000 hectares and has 40,000 residents, so 120,000 divided by 40,000 is 3.0 hectares of its own land for each resident. Its footprint is 2.5 hectares for each resident. 3.0 minus 2.5 is 0.5 hectares to spare for each resident, so Ardwell is WITHIN its own capacity. Scale the gap up to the whole place by multiplying: 0.5 times 40,000 is 20,000 hectares of productive land Ardwell does not need this year.',
        'EVERY PLACE IS MEASURED AGAINST ITS OWN LAND, AND THAT IS WHY THE SMALLEST FOOTPRINT IN A TABLE CAN BE THE ONE THAT IS BEYOND. Brightmere has 60,000 residents on 90,000 hectares, and a footprint of 2.0 hectares for each resident -- a SMALLER footprint than Ardwell\'s 2.5. But 90,000 divided by 60,000 is only 1.5 hectares of its own land for each resident, and 1.5 minus 2.0 is a shortfall of 0.5 hectares for each resident, which is 0.5 times 60,000, or 30,000 hectares. Brightmere is BEYOND its own capacity while Ardwell, using more land for each person, is within. Comparing footprints across places answers a real question -- who uses more land for each person -- but it is not the question "who is beyond", and it never will be, because the answer to that one lives half in the footprint and half in the land.',
        'THE SAME DIVISION READ THE OTHER WAY GIVES HOW MANY PEOPLE THE LAND SUPPORTS, AND THAT IS YOUR CHECK. Instead of dividing the land by the people, divide the land by the footprint: Brightmere\'s 90,000 hectares divided by 2.0 hectares for each person is 45,000 people, against a population of 60,000, so it is 15,000 people beyond what its own land carries. That is the CARRYING CAPACITY of that land at that footprint. Multiply back to check: 45,000 times 2.0 is 90,000, which is the land you started with. Two forms of one division, and they must agree -- if the hectare answer says a shortfall and the people answer says a surplus, a zero slipped somewhere and you go back.',
        'CAPACITY IS NOT A NUMBER A PLACE HAS; IT IS A NUMBER THREE INPUTS PRODUCE, AND A FOURTH MOVE CLOSES THE SUM WITHOUT TOUCHING ANY OF THEM. The three inputs are the footprint, the land, and the number of people, and each one moves the answer on its own. Change the FOOTPRINT: a change in how Brightmere\'s cropland is farmed that lowers it from 2.0 to 1.5 hectares makes 90,000 divided by 1.5 equal 60,000 people, exactly its population, and the shortfall closes. Change the LAND: give Brightmere 120,000 hectares instead of 90,000 and 120,000 divided by 2.0 is also 60,000 people, with nothing about a resident changed. Change the NUMBER OF PEOPLE: at 90,000 hectares and a footprint of 2.0 the land carries 45,000, so a Brightmere of 45,000 residents would sit exactly at capacity on the same land with the same habits. Then the fourth move, which is not an input at all: import what was grown somewhere else, and the sum inside the border closes while the footprint, the land and the population all stand exactly where they were. So there is no such thing as the carrying capacity of a place. There is only the capacity of THIS land, at THIS footprint, for THIS many people, and a figure that does not say which three is not yet a figure.',
        'AN OVERSHOOT CLAIM IS A CLAIM ABOUT A BOUNDARY, SO FIND THE EDGE OF THE SUM BEFORE YOU AGREE WITH IT. When someone says a place lives inside its means, ask what was counted: the land inside the border only, or all the land the residents\' consumption uses wherever that land sits. Both sums are real and both can be right at the same time about the same place, which is exactly why the claim has to say which one it ran. A place whose imports cover 0.5 hectares for each resident has closed its inside-the-border books and moved 0.5 hectares for each of its residents onto somebody else\'s books, and the residents\' footprint has not changed by a single hectare. The one-line test to carry out of here: a balance is only as wide as the boundary drawn around it, so say which boundary, every time.',
        'READ THE VERDICT AS A MEASUREMENT OF LAND, NOT AS A SCORE FOR A PLACE. Within and beyond are the results of a subtraction between two quantities of hectares. They are not grades, and neither one is a statement about the people who live there or how they behave. How much productive land a place holds depends on rock, slope, water and latitude, which nobody chose, and why a footprint is the size it is depends on what the work of that place is and what living there takes -- and the subtraction tells you neither. Two figures, one subtraction, one verdict about hectares -- and then the interesting question, which is always which of those inputs could move and what moving it would take.',
      ],
      vocabulary: [
        {
          term: 'ecological footprint',
          definition:
            'the productive land it takes to supply what one person uses in a year, written in hectares for each person so that two places can be set side by side.',
        },
        {
          term: 'productive land',
          definition:
            'land that produces something people use -- crops, grazing, timber -- or that their buildings and roads stand on, counted in hectares.',
        },
        {
          term: 'hectare',
          definition:
            'a unit of area equal to 10,000 square meters, which is a square 100 meters on each side.',
        },
        {
          term: 'carrying capacity',
          definition:
            'how many people a stated area of productive land supports at a stated footprint, found by dividing the land by the footprint for each person.',
        },
        {
          term: 'overshoot',
          definition:
            'the amount by which the land a population demands exceeds the land available to it, found by subtracting the second from the first.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-three-places-own-balance',
      kind: 'worked_example',
      problem:
        'Work out whether each place is within or beyond its own capacity, and say which of the three numbers given for each place is the one that misleads.\n\n"Ardwell: 40,000 residents, 120,000 hectares of productive land, footprint 2.5 hectares for each resident.\n\nBrightmere: 60,000 residents, 90,000 hectares of productive land, footprint 2.0 hectares for each resident.\n\nCaldon: 25,000 residents, 50,000 hectares of productive land, footprint 2.0 hectares for each resident."',
      steps: [
        'Do not start by comparing the footprints, which is what the eye wants to do. Brightmere and Caldon are both at 2.0 and Ardwell is at 2.5, and that comparison is going to turn out to say nothing about who is beyond. Start instead by giving every place its own land, one resident at a time.',
        'Land for each resident. Ardwell: 120,000 divided by 40,000 is 3.0 hectares. Brightmere: 90,000 divided by 60,000 is 1.5 hectares. Caldon: 50,000 divided by 25,000 is 2.0 hectares.',
        'Subtract, place by place. Ardwell: 3.0 minus 2.5 leaves 0.5 hectares spare for each resident, so Ardwell is WITHIN. Brightmere: 1.5 minus 2.0 is a shortfall of 0.5 hectares for each resident, so Brightmere is BEYOND. Caldon: 2.0 minus 2.0 is zero, so Caldon sits EXACTLY at its capacity.',
        'Scale each gap up to the whole place, because hectares for each person are hard to picture. Ardwell: 0.5 times 40,000 is 20,000 hectares spare. Brightmere: 0.5 times 60,000 is 30,000 hectares short. Caldon: zero times 25,000 is zero.',
        'Invert every division before going further. Total demand is the footprint times the residents. Ardwell: 2.5 times 40,000 is 100,000 hectares demanded against 120,000 held, and 120,000 minus 100,000 is 20,000 spare -- the same figure. Brightmere: 2.0 times 60,000 is 120,000 demanded against 90,000 held, and 120,000 minus 90,000 is 30,000 short -- the same figure. Caldon: 2.0 times 25,000 is 50,000 demanded against 50,000 held, and the difference is zero. Every per-resident answer is recovered from the whole-place side, so no zero slipped.',
        'Name the number that misleads. It is the footprint read on its own. WRONG: "Brightmere and Caldon both use 2.0 hectares for each resident, so they are in the same position, and Ardwell at 2.5 is the one in trouble." CORRECT: "Brightmere is 30,000 hectares beyond, Caldon is exactly balanced and Ardwell is 20,000 hectares within, because the two places at 2.0 hold 1.5 and 2.0 hectares for each resident and Ardwell holds 3.0."',
        'Rewind the input and read the three lines backwards to confirm nothing was misread: 2.0, 50,000, 25,000; 2.0, 90,000, 60,000; 2.5, 120,000, 40,000. Then change ONE input so the result is not memorized as a fact about Brightmere. Suppose Brightmere held 120,000 hectares of productive land instead of 90,000, with the same 60,000 residents and the same footprint. 120,000 divided by 60,000 is 2.0 hectares for each resident, 2.0 minus 2.0 is zero, and Brightmere is now exactly at capacity; the check is 2.0 times 60,000, which is 120,000, the land it now has. Nobody changed what a resident of Brightmere uses. The supply side moved, and the verdict moved with it, which is what it means to say that a capacity is produced by inputs rather than owned by a place.',
      ],
      answer:
        'Ardwell is within its capacity by 20,000 hectares: 120,000 divided by 40,000 is 3.0 hectares for each resident against a footprint of 2.5, and 0.5 times 40,000 is 20,000. Brightmere is beyond by 30,000 hectares: 90,000 divided by 60,000 is 1.5 against a footprint of 2.0, and 0.5 times 60,000 is 30,000. Caldon is exactly at capacity: 50,000 divided by 25,000 is 2.0 against a footprint of 2.0. Multiplying each footprint by its population recovers demands of 100,000, 120,000 and 50,000 hectares, which reproduces all three verdicts. The misleading number is the footprint read on its own, because the place with the smaller footprint is the one that is beyond. Give Brightmere 120,000 hectares and it sits exactly at capacity with nothing else changed.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-two-buttons-one-number',
      kind: 'worked_example',
      problem:
        'Brightmere is 30,000 hectares beyond its own land. Two different changes are proposed, and both of them are reported afterward as "Brightmere now lives inside its capacity". Work out what each change does to the numbers, then judge that sentence.\n\n"Brightmere before either change: 60,000 residents, 90,000 hectares of productive land, footprint 2.0 hectares for each resident.\n\nChange one: a change in how Brightmere\'s cropland is farmed means each resident\'s needs now take 1.5 hectares instead of 2.0. Nothing else moves.\n\nChange two: the footprint stays at 2.0 hectares. Brightmere imports the food and timber that account for 0.5 hectares for each resident, grown in Dunmere. Dunmere has 50,000 residents, 200,000 hectares of productive land, and a footprint of 2.0 hectares for each resident."',
      steps: [
        'Run change one. The demand side falls: 1.5 times 60,000 is 90,000 hectares, against 90,000 hectares of land, so the balance is exactly zero. Read it the other way as a check: 90,000 divided by 1.5 is 60,000 people supported, which is exactly the population, and 60,000 times 1.5 is 90,000, which recovers the land. The capacity of Brightmere\'s land rose from 45,000 people to 60,000 without one hectare being added.',
        'Run change two. The footprint is still 2.0 hectares for each resident, so total demand is still 2.0 times 60,000, which is 120,000 hectares. What changed is where 0.5 hectares for each resident comes from: 0.5 times 60,000 is 30,000 hectares, and those 30,000 hectares are in Dunmere. The land drawn on inside Brightmere is therefore 1.5 times 60,000, which is 90,000 hectares -- exactly what Brightmere holds. Add the two pieces back: 90,000 inside plus 30,000 outside is 120,000, which is the demand the first line gave.',
        'Notice that both changes produce the same inside-the-border number, 90,000 hectares against 90,000 hectares, and that the sentence "Brightmere now lives inside its capacity" is reported the same way after each. So the number cannot be what tells them apart. Something else has to.',
        'Check the first kind of evidence: the arithmetic of Brightmere\'s own land. In both cases it closes at 90,000 against 90,000, and in both cases the inversion holds -- 1.5 times 60,000 is 90,000. On this evidence alone the two changes are identical and the sentence is true twice.',
        'Check a second kind of evidence, which is a quantity from outside the boundary. Under change one there is no outside quantity at all. Under change two there are 30,000 hectares in Dunmere producing for Brightmere residents, and that number appears in nobody\'s sum when Brightmere adds up its own land. Dunmere itself still has room -- 2.0 times 50,000 is 100,000 hectares for its own residents, plus the 30,000 exported is 130,000, against 200,000 hectares held, so Dunmere is 70,000 hectares within -- but the 30,000 hectares exist and are doing work for Brightmere either way.',
        'Check a third kind of evidence, which is an input that did NOT move. Under change one the footprint fell from 2.0 to 1.5 hectares, so what each resident uses is genuinely smaller. Under change two the footprint is still 2.0 hectares, exactly what it was before the change, so nothing at all about Brightmere\'s demand moved. Three kinds of evidence -- a closed inside-the-border sum, a 30,000-hectare quantity that sits outside it, and an unchanged demand figure -- and they point one way: one number is a hunch, three of different kinds all pointing the same way is evidence.',
        'Give the verdict, and make it about the sentence rather than about Brightmere. After change one the sentence is true on both readings: the land inside the border carries the residents, and the residents\' total demand is 90,000 hectares. After change two the sentence is true of Brightmere\'s own land and false of what Brightmere\'s residents use, which is still 120,000 hectares. WRONG: "Change two means Brightmere stopped overshooting." CORRECT: "Change two moved 30,000 hectares of the demand onto land in Dunmere and left the demand itself at 2.0 hectares for each resident; the claim counted the land inside the border and left out the land outside it." Neither verdict says anything about the people of Brightmere or of Dunmere; both are statements about hectares and about which boundary a sum used.',
      ],
      answer:
        'Change one lowers the demand: 1.5 times 60,000 is 90,000 hectares against 90,000 held, so the balance closes, and the land now supports 90,000 divided by 1.5, which is 60,000 people, exactly the population. Change two leaves the demand at 2.0 times 60,000, which is 120,000 hectares, and moves 0.5 times 60,000, which is 30,000 hectares, onto land in Dunmere; the land used inside Brightmere is 1.5 times 60,000, which is 90,000, and 90,000 plus 30,000 recovers the 120,000. The sentence "Brightmere now lives inside its capacity" is true both ways after change one, and after change two it is true of the land inside the border and false of the land its residents use. Dunmere, at 100,000 hectares for its own residents plus 30,000 exported against 200,000 held, is 70,000 hectares within.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-which-place-is-beyond',
      kind: 'try_yourself',
      problem:
        'Two places report their figures for the same year.\n\n"Selwick: 30,000 residents, 45,000 hectares of productive land, footprint 2.0 hectares for each resident.\n\nTarnby: 20,000 residents, 80,000 hectares of productive land, footprint 3.0 hectares for each resident."\n\nWhich place is beyond its own capacity?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Selwick, because its own land gives 1.5 hectares for each resident while each resident\'s footprint is 2.0 hectares', correct: true },
        { id: 'b', text: 'Tarnby, because 3.0 hectares for each resident is the larger of the two footprints, and the bigger footprint is the one that outruns the land' },
        { id: 'c', text: 'Neither, because the two places need 120,000 hectares between them and hold 125,000 hectares of productive land between them' },
        { id: 'd', text: 'Neither, because each place holds more hectares of productive land than it has residents: 45,000 against 30,000, and 80,000 against 20,000' },
      ],
      expectedAnswer: 'Selwick, because its own land gives 1.5 hectares for each resident while each resident\'s footprint is 2.0 hectares',
      hints: [
        'Give each place its own land first: divide the hectares by the residents, one place at a time. Then set that figure against that place\'s own footprint and subtract.',
        'A footprint compared against another place\'s footprint never settles this, because the land each place holds for each resident is different. Adding the two places into one sum hides the place that is short inside the place that is spare, and comparing hectares with a head count compares two things that are not the same kind of quantity.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-technology-moves-the-capacity',
      kind: 'try_yourself',
      problem:
        'Wexmoor has 80,000 residents and 90,000 hectares of productive land, and each resident\'s footprint is 1.5 hectares. A change in how its cropland is farmed lowers each resident\'s footprint to 1.25 hectares, and nothing else changes. After the change, how many people does Wexmoor\'s own land support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '60,000 people, unchanged, because the land is still 90,000 hectares and how many people a place supports is set by the land it holds' },
        { id: 'b', text: '90,000 people, because Wexmoor has 90,000 hectares of productive land and each hectare of productive land supports one person' },
        { id: 'c', text: '72,000 people, because 90,000 hectares divided by 1.25 hectares for each person is 72,000, which is still 8,000 short of the 80,000 residents', correct: true },
        { id: 'd', text: '112,500 people, because 90,000 hectares multiplied by 1.25 hectares for each person is 112,500, and a smaller footprint stretches the land further' },
      ],
      expectedAnswer: '72,000 people, because 90,000 hectares divided by 1.25 hectares for each person is 72,000, which is still 8,000 short of the 80,000 residents',
      hints: [
        'How many people a piece of land supports is the land divided by the footprint for each person. Run it once with 1.5 hectares and once with 1.25 hectares, and then set each answer against the 80,000 residents.',
        'The hectares did not change, so any answer that keeps the count of people where it was has treated capacity as a property of the land alone. Multiplying by the footprint instead of dividing by it gives a bigger number than the hectares, which cannot be right, and reading one hectare as one person skips the footprint entirely. Multiply your answer back by 1.25 and 90,000 has to come back.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-the-claim-counted',
      kind: 'try_yourself',
      problem:
        'Vessen has 80,000 residents, 100,000 hectares of productive land, and a footprint of 2.0 hectares for each resident. This year Vessen begins importing food and timber grown on 60,000 hectares in another place; its footprint stays at 2.0 hectares for each resident. A council report says: "Vessen now lives inside its capacity." What is the right verdict on that claim?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Supported, because the demand on Vessen\'s own land has fallen from 160,000 hectares to 100,000 hectares, which is 1.25 hectares for each of the 80,000 residents, and a place is measured by the land lying inside its own border' },
        { id: 'b', text: 'Not supported, because the imported food and timber have to be added on top of the footprint, so each Vessen resident now uses more than the 2.0 hectares the report gives and the real demand is above 160,000 hectares' },
        { id: 'c', text: 'Not supported, because the 60,000 imported hectares come off Vessen\'s own 100,000 hectares, leaving only 40,000 hectares to carry 80,000 residents at 0.5 hectares each, which is further beyond than before' },
        { id: 'd', text: 'True of Vessen\'s own land and false of what its residents use: the 100,000 hectares inside Vessen now carry 1.25 hectares for each resident, while the footprint is still 2.0 and the other 60,000 hectares lie elsewhere', correct: true },
      ],
      expectedAnswer: 'True of Vessen\'s own land and false of what its residents use: the 100,000 hectares inside Vessen now carry 1.25 hectares for each resident, while the footprint is still 2.0 and the other 60,000 hectares lie elsewhere',
      hints: [
        'Run the two sums separately. First, the land inside Vessen divided by the residents. Second, the footprint times the residents. Then ask which of those two the claim used.',
        'The footprint line says 2.0 hectares before the imports and 2.0 hectares after, so nothing on the demand side moved and no answer that changes it is reading the data. The imported land lies outside Vessen and was never part of Vessen\'s 100,000 hectares, so it cannot be taken away from them. Check: 1.25 times 80,000 recovers 100,000, and 0.75 times 80,000 recovers 60,000.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-smallest-footprint-and-imports-erase-land',
      kind: 'misconception_check',
      question:
        'A student looks at the Ardwell, Brightmere and Caldon table and writes: "Brightmere uses only 2.0 hectares for each resident and Ardwell uses 2.5, so Brightmere is the one living within its means." Then, on Brightmere\'s imports from Dunmere: "Once Brightmere buys that food from Dunmere, those 30,000 hectares stop being used, so the demand goes down to 90,000 hectares." What is wrong with each?',
      commonErrors: [
        {
          answer: 'Brightmere uses less land for each resident than Ardwell, so Brightmere is the one living within its means.',
          misconception:
            'Comparing the two footprints against each other instead of comparing each footprint against its own place\'s land, which silently assumes that both places hold the same amount of productive land for each resident.',
          correctsTo:
            'The footprint is only half of each balance, and the two places do not hold the same land. Ardwell: 120,000 hectares divided by 40,000 residents is 3.0 hectares for each resident, and 3.0 minus 2.5 leaves 0.5 spare, which is 0.5 times 40,000, or 20,000 hectares within. Brightmere: 90,000 divided by 60,000 is 1.5 hectares for each resident, and 1.5 minus 2.0 is a shortfall of 0.5, which is 0.5 times 60,000, or 30,000 hectares beyond. Check by the other route: 2.5 times 40,000 is 100,000 demanded against 120,000 held, and 2.0 times 60,000 is 120,000 demanded against 90,000 held. WRONG: "The smaller footprint is the one within its means." CORRECT: "Ardwell is 20,000 hectares within on a footprint of 2.5, and Brightmere is 30,000 hectares beyond on a footprint of 2.0, because Ardwell holds twice as much land for each resident." Each place is measured against its own land, and a footprint read on its own can put the places in the opposite order from the balance.',
        },
        {
          answer: 'Buying the food from Dunmere means those 30,000 hectares stop being used, so the demand falls to 90,000 hectares.',
          misconception:
            'Treating an import as if it removed a demand rather than relocating it, so land that moved outside the boundary of the sum is read as land that no longer exists.',
          correctsTo:
            'The food still has to grow on something. Brightmere\'s footprint is unchanged at 2.0 hectares for each resident, so the demand is still 2.0 times 60,000, which is 120,000 hectares. What the import changes is where 0.5 times 60,000, or 30,000, of those hectares sit: they are in Dunmere, which is why Brightmere\'s own land now carries 1.5 times 60,000, or 90,000 hectares, exactly what it holds. Add them back and 90,000 plus 30,000 is 120,000, the number you started from. WRONG: "The imported hectares stop being used." CORRECT: "The imported hectares are being used in Dunmere, and Brightmere\'s inside-the-border sum simply stops counting them." Dunmere can carry them -- 2.0 times 50,000 is 100,000 hectares for its own residents, plus 30,000 exported is 130,000 against the 200,000 hectares it holds, so it is 70,000 hectares within -- but a hectare that moved across a boundary is still a hectare in use, and an overshoot claim has to say which boundary its sum used.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A capacity question is a subtraction with two sides. Divide the place\'s productive land by its people to get hectares for each person, set that against the footprint for each person, and subtract: positive is within, negative is beyond.',
        'Scale the per-person gap up to the whole place by multiplying it by the population, and check it the other way by multiplying the footprint by the population and comparing that demand with the land held.',
        'Every place is measured against its own land, never against another place\'s footprint. The smaller footprint in a table can belong to the place that is beyond, because the other half of the balance is how much land there is.',
        'Divide the land by the footprint instead and you get how many people that land supports: 90,000 hectares divided by 2.0 hectares for each person is 45,000 people. Multiply back and the land has to return.',
        'There is no carrying capacity of a place, only the capacity of this land, at this footprint, for this many people. Change any one of the three and the number moves.',
        'A change in farming or technology lowers what each person\'s needs take; an import changes which land is drawn on and leaves the footprint exactly where it was. Both can close the same inside-the-border sum.',
        'An overshoot claim is a claim about a boundary. Ask which land the sum counted, because a balance is only as wide as the boundary drawn around it.',
        'Within and beyond are measurements of hectares against hectares. They are never a grade for a place or a statement about the people who live there.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.3', cedTitle: 'Carrying Capacity & Ecological Footprint' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
