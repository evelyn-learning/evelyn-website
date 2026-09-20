/**
 * Grade 8 World Geography — North America: People, Cities & Economy: North
 * America: Population Patterns.
 *
 * PROCEDURE-LED row 4.1 (National Geography Standard 9), shaped on the
 * procedure-led exemplar `m8geo-u1-counts-rates-and-fair-comparison.ts`. The
 * concept segment is a short ordered routine over described figures rather
 * than a mental model; the first worked example runs the routine straight
 * through on an invented country and then moves one edge of the band; the
 * second runs the controls test on four described regions and reaches a
 * verdict on three independent clues. Every item is answered by a computed
 * figure, a verdict carrying its arithmetic, or a named condition-in-the-data.
 *
 * THE ROUTINE, in the order it is always run:
 *   1. Divide the whole population by the whole land area -- the national
 *      figure.
 *   2. Find the sentence that draws the band; divide the people inside it by
 *      the land inside it -- the settled-area figure.
 *   3. Take the two shares (people inside the band, land inside the band) and
 *      say how far apart they are.
 *   4. Invert: multiply each figure back by its own land area and recover the
 *      count it came from.
 *   5. Run the physical controls down the regions and keep only the ones that
 *      vary where the density varies.
 *   Then move ONE edge of the band and run it again.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause where it is used, that density
 * is people divided by land area and that certain physical conditions draw
 * settlement while others hold it off (Grade 7,
 * `m7geo-u3-population-distribution-and-density.ts`), and re-teaches neither.
 * The premise appears exactly once, as the opening clause of keyIdea 1
 * ("Density is people divided by land area, so the figure moves whenever the
 * land under the division line moves"), and no keyIdea's SUBJECT is what
 * density is, what distribution is, or what an average does: keyIdea 1 is
 * about re-running the division over a different piece of land, keyIdea 2
 * about computing two shares and comparing them, keyIdea 3 about ruling a
 * candidate control in or out, keyIdea 4 about what the data supports when
 * the physical conditions match, keyIdea 5 about moving the band's edge and
 * re-running. The word "distribution" occurs in the authored body only inside
 * `los[0].description`, where the signed scope cell puts it verbatim, and the
 * word "migration" only inside the standard's own name in that same field and
 * inside the chain loId `m8geo.north-america-migration-flows`. It ADDS
 * computing a national figure and a settled-area figure from the same
 * population, computing the population share and the land share of a band and
 * reading the gap between them as the size of the distortion, testing each
 * physical control against the requirement that it vary where the density
 * varies (and ruling one out because it does not), reading long-standing
 * settlement as the explanation the data supports when the physical
 * conditions match and the densities do not, and moving one edge of the band
 * to see whether a verdict survives. It STOPS SHORT of the settlement history
 * that produced any pattern -- no date, era, event, treaty or policy appears
 * anywhere in this file, and the chronologies are owned by `ap-apush-*` and
 * `g8-ss-westward-expansion.ts`. It does NOT sort reasons for moving into
 * push and pull or read an origin-destination table (row 4.2,
 * `north-america-migration-flows`); does NOT measure built-up area against
 * population or discuss urban form (row 4.3,
 * `north-america-metropolitan-regions`); does NOT classify economic activity
 * or read a trade table (row 4.4,
 * `north-america-economic-regions-and-trade`); does NOT compute a dependency
 * ratio or a doubling time (rows 5.1 and 5.2); and names NO stage of the
 * demographic transition model (`ap-human-geo-population.ts`) -- the string
 * "stage" does not occur in the body.
 *
 * Three things ARE deliberately allowed, because neighboring rows sit close
 * and the line has to be drawn rather than avoided. (a) The same population
 * is divided by two different pieces of land, which LOOKS like row 1.1's
 * denominator move and like row 1.3's scale move and is neither: the
 * denominator is land area in every single division in this file, so nothing
 * is chosen from a claim the way row 1.1 chooses between land, people and
 * each person; and no unit is merged, split or regrouped the way row 1.3
 * regroups districts -- the unoccupied land is dropped OUT of the denominator
 * and the people on it are dropped out with it. The row's own signed scope
 * cell requires this move by name ("show why Canada's low national density
 * figure misdescribes where Canadians live"), so the cell governs. (b) Real
 * North American settlement patterns are NAMED and stated qualitatively,
 * which accuracy rule 9 allows for rows 4.1 and 4.2 and which the scope cell
 * asks for -- but every FIGURE in this file belongs to an invented country or
 * region, and no real population, area, density, share or percentage appears
 * anywhere. (c) One clause of keyIdea 4 says that a region settled longer has
 * its roads, ports, water lines and towns already standing; that is the
 * "long-standing settlement" explanation the scope cell names, kept to the
 * present-day state of what is built and never turned into a chronology.
 *
 * SCOPE CELL PARTS (ruling 33): the cell carries all three parts. Part (i) is
 * in `los[0].description`; parts (ii) and (iii) are the lineage and boundary
 * clauses above and appear nowhere a student can hear them.
 *
 * BURNED CELL EXAMPLES (ruling 36): part (i) travels verbatim into
 * `los[0].description`, which the academy renders to the student, and it
 * names three concrete specimens -- the eastern half and the coasts of the
 * United States settled most densely, Canada's population concentrated in a
 * band near its southern border with a sparse North, and Canada's low
 * national density figure misdescribing where Canadians live. All three are
 * therefore spent in TEACHING segments only (keyIdea 3 and the recap) and
 * none of the three items uses them: the items are built on the invented
 * countries Marrin and Ansby and the invented regions Halder and Ivell. A
 * later editor should not "helpfully" move a cell specimen into an item.
 *
 * DEPTH FLOOR NOTE FOR THE FAN-OUT: test 5 was run against
 * `m7geo-u3-population-distribution-and-density.ts`, whose keyIdeas include
 * "DENSITY IS POPULATION DIVIDED BY LAND AREA" and "PEOPLE CLUSTER WHERE THE
 * PHYSICAL GEOGRAPHY MAKES LIVING EASIER". The closest pair is that second
 * one against keyIdea 3 here, and keyIdea 3 survives because its subject is
 * the RULING-OUT test -- a candidate control that does not vary where the
 * density varies is discarded, and the Grade 7 file never discards one. The
 * Grade 7 items were read too: all three are answerable by knowing what
 * density and distribution mean and which conditions draw settlement, and no
 * item below can be answered without working its numbers or marking which
 * described condition differs between two regions.
 *
 * ACCURACY NOTE: every number in this file was written for the arithmetic and
 * belongs to an invented country or region -- Norvale, Ternhall with its four
 * regions, Tolmar, Marrin, Ansby, Halder and Ivell. The claims about the real
 * world are qualitative and long-settled: the eastern half of the United
 * States and both of its coasts are its most densely settled parts; Canada's
 * people are concentrated in a band near its southern border with a sparsely
 * settled North; the growing season shortens toward the far north of the
 * continent. Every one is in the claim ledger with its ground. Dense and
 * sparse are measurements of people for each square kilometer, never a
 * verdict on a region or the people in it, and the file says so in keyIdea 5,
 * in the first misconception correction and in the recap.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67
 * percent of the time, and 94 percent at difficulty 4; chance with four
 * choices is 25 percent). The per-item discipline is the point: every
 * distractor states the full wrong STEP that produces it -- the national
 * figure handed over where the band was asked for, the whole population
 * divided by the band's land, the people and land left outside the band used
 * instead, the band's population paired with the country's area, a national
 * average read down onto every part of the country, a control named without
 * checking that it varies, a control read into data that never states it --
 * and no key was built to be the longest choice BECAUSE it is the key.
 * Measured as a diagnostic and not as a score: the key is the strictly
 * longest choice in none of the three items. Zero is NOT the target; chance
 * alone produces zero or one in a three-item file about 84 percent of the
 * time, and the real measurement is the course-level rate over all 40 files
 * at registration. The three keys sit at ids c, d and a, which is the id set
 * `(4 + 1) mod 4 = 1` requires, omitting b; the four numeric choices in item
 * 1 are ordered by that id rule and never by magnitude.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every set of figures, every
 * band and every region is written out in prose inside the segment that needs
 * it, and every item is solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U4_NORTH_AMERICA_POPULATION_PATTERNS: LessonPlan = {
  id: 'evelyn.ms.m8geo.north-america-population-patterns.v1',
  title: 'North America: Population Patterns',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.north-america-population-patterns',
      standard: 'M8GEO-4.1',
      description:
        'Given population and area figures for several North American regions, compute and compare densities, explain the distribution -- the eastern half and the coasts of the United States settled most densely, Canada\'s population concentrated in a band near its southern border with a sparse North -- using physical controls (climate, arable land, water, access) and long-standing settlement, and show why Canada\'s low national density figure misdescribes where Canadians live (National Geography Standard 9: the characteristics, distribution and migration of human populations on Earth surface).',
    },
  ],
  prerequisites: ['m8geo.north-america-hazard-regions'],
  followUps: ['m8geo.north-america-migration-flows'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show a correct national figure describing no place in the country, so the need for a second division arrives before any vocabulary does.',
      script:
        'A quiz app deals you two cards. Card one: a country with 4 people for every square kilometer. Card two: a country with 20. Asked which one you are more likely to be standing next to somebody in, you say card two, and for the two countries as wholes you are right. Now the part the card leaves out. In the first country, nine people out of every ten live inside a single strip along the southern edge, and that strip is one fifth of the country. Run the division again over the strip alone and the figure comes out four and a half times higher -- close to card two. Run it over everything outside the strip and it comes out at half a person for each square kilometer. So the card is arithmetically correct and describes no place in that country: not the strip, which is far above 4, and not the land beyond it, which is far below. Today you get the two divisions that pull the real pattern back out of a figure like that, and the test that decides which physical condition put the people where they are.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-band-and-controls',
      kind: 'concept',
      goal: 'Install the two-division routine over a stated band, the two-share test, and the rule that a physical control counts as an explanation only if it varies where the density varies.',
      keyIdeas: [
        'A NATIONAL DENSITY FIGURE IS DIVIDED BY LAND NOBODY IS ON, SO RUN THE DIVISION AGAIN OVER THE BAND THAT HOLDS THE PEOPLE. Density is people divided by land area, so the figure moves whenever the land under the division line moves. Take a country whose people sit in a strip along one edge. Divide the whole population by the whole country and you get the NATIONAL figure. Divide the people inside the strip by the land inside the strip and you get the SETTLED-AREA figure, which can be four, ten or thirty times larger. The move has four parts: find the sentence in the data that draws the band, add the people inside it, add the land inside it, and divide once. Then report both figures and say what each one answers. The national figure answers how many people the country holds for each square kilometer of territory. The settled-area figure answers how many people are on each square kilometer where anybody actually is. Only the second one describes a place you could stand in.',
        'TWO SHARES MEASURE HOW BADLY THE NATIONAL FIGURE MISDESCRIBES THE COUNTRY, AND YOU NEED BOTH OF THEM. Work out the share of the people inside the band -- band population divided by total population -- and the share of the land inside the band -- band area divided by total area. Ninety percent of the people on twenty percent of the land is a country the national figure describes nowhere in: not the band, which sits far above it, and not the land outside, which sits far below it. Ninety percent of the people on eighty-five percent of the land is a country where the national figure is close to honest, because almost all of the land is doing the holding. One share on its own settles nothing. A large population share is only evidence of distortion when it is set beside a small land share, and the gap between the two shares is the size of the problem.',
        'NAMING A PHYSICAL CONTROL EXPLAINS NOTHING UNTIL YOU CHECK THAT IT VARIES WHERE THE DENSITY VARIES. The conditions that make settlement easier are the candidates: a growing season long enough to raise a crop, soil deep enough to farm, fresh water, and a coast or navigable water that a cargo can reach. Run each candidate down the described regions and keep only the ones that change where the density changes. If the dense region and the sparse region have the same deep soil, soil is not what separates them, however true it is that crops need soil. If the sparse region has the LONGER growing season, the growing season is ruled out for that pair. The explanation you are entitled to is the set of candidates that survive the test, and it is usually two or three of them working together rather than one. North America is where you practice this. The eastern half of the United States and both of its coasts are the most densely settled parts of that country, and Canada\'s people are concentrated in a band close to its southern border with a sparsely settled North above it. Run the candidates down the Canadian pattern and the one that changes hardest from south to north is the growing season, which shortens toward the far north until crops cannot be raised at all.',
        'LONG-STANDING SETTLEMENT IS ITSELF A CONTROL, AND IT SHOWS UP WHERE THE PHYSICAL CONDITIONS MATCH AND THE DENSITIES DO NOT. A region settled longer has its roads, ports, water lines, power lines and towns already standing, so somebody arriving now joins a network that exists instead of building one. That is why two regions can match on every physical condition the data lists and still differ several times over in density: the physical conditions decided where settlement could start, and the network that grew there decided where it kept going. So when your controls test comes back with no physical difference and a large density difference, this is the reading the data supports. Two cautions. It is a statement about what is built on the ground, not about the people in either region. And it is a reading you are only entitled to when the data leaves no physical condition differing -- if the data names a harbor in one region and mountains in the other, that difference is in front of you and you do not need to reach past it.',
        'MOVE THE BAND\'S EDGE AND THE SETTLED-AREA FIGURE MOVES, SO THE EDGE HAS TO BE STATED AND THEN TESTED. A settled-area density is only as good as the line drawn around the band. Widen the band and you take in land faster than you take in people, because the people nearest the edge are the thinnest on the ground, so the figure falls. Narrow it and the figure climbs. Nobody moves house while any of that happens. So whoever reports a settled-area figure states the line they used -- within three hundred kilometers of the southern border, within two hundred kilometers of the coast -- and whoever reads one re-runs the division with the edge moved to see whether the verdict survives. And keep the words straight while you do it: densely settled and sparsely settled are measurements of people for each square kilometer and nothing else, never a verdict on a region or on the people living in it.',
      ],
      vocabulary: [
        {
          term: 'national density',
          definition:
            'the figure produced by dividing a whole country\'s population by its whole land area, so that every square kilometer of territory enters the division whether anybody is on it or not.',
        },
        {
          term: 'settled-area density',
          definition:
            'the figure produced by dividing the population of a stated part of a country by the land area of that same part, leaving the land nobody is on out of the division entirely.',
        },
        {
          term: 'settled band',
          definition:
            'the part of a country that holds most of its people, marked out by a stated line such as a distance from a border, a coast or a river rather than by a political boundary.',
        },
        {
          term: 'concentration share',
          definition:
            'the percentage of a place\'s people that a named part of it holds, found by dividing that part\'s population by the whole population.',
        },
        {
          term: 'physical control',
          definition:
            'a condition of land, water or climate offered as an explanation for a difference in density, and kept only if it varies where the density varies.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-national-figure-versus-the-band',
      kind: 'worked_example',
      problem:
        'Run the routine straight through, then move one edge of the band.\n\n"Norvale has 20,000,000 people and 5,000,000 square kilometers of land. Within 300 kilometers of its southern border live 18,000,000 of those people, on 1,000,000 square kilometers. The rest of the country stretches north from there." A travel site writes: "Norvale averages 4 people per square kilometer, so wherever you go in Norvale you will have the place to yourself." Test the claim.',
      steps: [
        'Step one: the national figure, which is the one the travel site used. 20,000,000 people divided by 5,000,000 square kilometers is 4 people per square kilometer. The site did that division correctly, so the argument cannot be that the number is wrong.',
        'Step two: the settled-area figure. The band is drawn by one sentence in the data -- within 300 kilometers of the southern border -- and that sentence gives both numbers you need. 18,000,000 people divided by 1,000,000 square kilometers is 18 people per square kilometer. That is four and a half times the national figure, because 18 divided by 4 is 4.5.',
        'Step three: work out what is left, since the two parts have to add back to the whole. People: 20,000,000 minus 18,000,000 is 2,000,000. Land: 5,000,000 minus 1,000,000 is 4,000,000 square kilometers. So the land north of the band runs at 2,000,000 divided by 4,000,000, which is 0.5 people per square kilometer. The band is 18 and the north is 0.5, and 18 divided by 0.5 is 36, so the band is thirty-six times as densely settled as the north.',
        'Step four: the two shares. People inside the band: 18,000,000 divided by 20,000,000 is 0.90, which is 90 percent. Land inside the band: 1,000,000 divided by 5,000,000 is 0.20, which is 20 percent. Ninety percent of the people on twenty percent of the land. That gap is the whole finding.',
        'Step five: invert every division and make the counts come back. 4 times 5,000,000 is 20,000,000. 18 times 1,000,000 is 18,000,000. 0.5 times 4,000,000 is 2,000,000. 0.90 times 20,000,000 is 18,000,000, and 0.20 times 5,000,000 is 1,000,000. Every count returns, so no zero slipped.',
        'Give the verdict. WRONG: "Norvale averages 4 people per square kilometer, so wherever you go in Norvale you will have the place to yourself." CORRECT: "Norvale averages 4 people per square kilometer, and no part of Norvale is like that. Nine people in ten are in a band running at 18 for each square kilometer, and the land north of the band runs at 0.5." The national figure is not false. It is a figure about the country\'s territory being read as a figure about the country\'s places.',
        'Rewind the input and read it backwards to confirm the verdict follows from the data. 18,000,000 and 2,000,000 add to 20,000,000; 1,000,000 and 4,000,000 add to 5,000,000. Most of the people with a small share of the land, and a small share of the people with most of the land, is exactly what a settled band on top of a sparse interior looks like, so the verdict came out of the table and not out of a guess.',
        'Now change ONE input and run it again. Widen the band from 300 kilometers to 600 kilometers of the southern border. The wider band holds 19,200,000 people on 1,600,000 square kilometers, so its figure is 19,200,000 divided by 1,600,000, which is 12 people per square kilometer; the check is 12 times 1,600,000, which is 19,200,000. The figure fell from 18 to 12 and not one person moved. Look at what the widening added: 19,200,000 minus 18,000,000 is 1,200,000 more people, on 1,600,000 minus 1,000,000, which is 600,000 more square kilometers. 1,200,000 divided by 600,000 is 2 people per square kilometer for the ring that was added, and a ring at 2 pulls an average of 18 down every time. That is why a settled-area figure is worth nothing until the line it was drawn on is stated.',
      ],
      answer:
        'The claim is not supported, even though its number is right. Norvale\'s national figure is 20,000,000 divided by 5,000,000, which is 4 people per square kilometer, but 18,000,000 of the people are inside a band of 1,000,000 square kilometers, which is 18 per square kilometer, and the remaining 2,000,000 people are spread over 4,000,000 square kilometers at 0.5 per square kilometer. Ninety percent of the people are on twenty percent of the land, so the national figure describes neither part. Multiplying each figure back by its own land area returns every count. Widening the band to 600 kilometers takes in a ring running at only 2 people per square kilometer and drops the settled-area figure from 18 to 12, which is why the line has to be stated.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-which-control-varies',
      kind: 'worked_example',
      problem:
        'Explain a density pattern by testing each physical control, and say which candidates the data supports.\n\n"Ternhall has four regions. Alder Coast: 12,000,000 people, 150,000 square kilometers; growing season 240 days; deep soil; a large river crossing it; an ocean coast with three deep harbors. Brayle Plain: 8,000,000 people, 400,000 square kilometers; growing season 180 days; deep soil; a large river; no coast, and 900 kilometers to the nearest port. Cantrel Basin: 1,200,000 people, 600,000 square kilometers; growing season 250 days; thin stony soil; 200 millimeters of rain a year and no navigable river. Dunmoor North: 250,000 people, 2,500,000 square kilometers; growing season 60 days; thin soil over ground that stays frozen below the surface; plenty of lake water; a coast that is icebound most of the year."',
      steps: [
        'Compute all four densities before explaining anything, because an explanation of a pattern you have not measured is a guess. Alder Coast: 12,000,000 divided by 150,000 is 80 people per square kilometer. Brayle Plain: 8,000,000 divided by 400,000 is 20. Cantrel Basin: 1,200,000 divided by 600,000 is 2. Dunmoor North: 250,000 divided by 2,500,000 is 0.1.',
        'Invert all four at once. 80 times 150,000 is 12,000,000. 20 times 400,000 is 8,000,000. 2 times 600,000 is 1,200,000. 0.1 times 2,500,000 is 250,000. Every count comes back. The order is Alder Coast, Brayle Plain, Cantrel Basin, Dunmoor North, and the spread is large: 80 divided by 2 is 40, and 80 divided by 0.1 is 800.',
        'Take the hardest pair first, Cantrel Basin at 2 against the two dense regions, and test the growing season. Cantrel Basin has 250 days, Alder Coast has 240 and Brayle Plain has 180. The SPARSE region has the longest growing season of the three. A candidate that runs the opposite way to the density cannot be the explanation, so the growing season is ruled out for this pair. WRONG: "Cantrel Basin is sparse, so its growing season must be too short." CORRECT: "Cantrel Basin has the longest growing season of the three and the lowest density, so something other than the season is holding it down."',
        'Test water on the same pair. Cantrel Basin has 200 millimeters of rain a year and no navigable river. Alder Coast has a large river; Brayle Plain has a large river. Water changes exactly where the density changes, so water stays in. Now test soil. Cantrel Basin is thin and stony; both dense regions have deep soil. Soil also changes where the density changes, so soil stays in as well.',
        'The check to remember, on three clues of different kinds. The rainfall and river figures are one kind of evidence and they separate Cantrel Basin from both dense regions. The soil descriptions are a second kind and they separate the same way. The growing-season numbers are a third kind and they run the OPPOSITE way, which is what lets you rule that candidate out rather than merely leave it unmentioned. One number is a hunch; three of different kinds, two agreeing and one actively excluded, is evidence. The verdict for Cantrel Basin is water and soil together, and not the growing season.',
        'Now take the pair the controls do NOT separate: Alder Coast at 80 against Brayle Plain at 20, a factor of 4. Both have deep soil. Both have a large river. Both have a growing season long enough to raise a crop. The one named difference is reachable water: Alder Coast has an ocean coast with three deep harbors, and Brayle Plain is 900 kilometers from the nearest port. Where a region can load and unload cargo, its towns, roads and rail lines are already standing and a new arrival joins them rather than building them, and that is what the data supports for a four-fold gap between two regions that match on everything else.',
        'Read Dunmoor North last and notice that it is not a puzzle. Growing season 60 days, thin soil over frozen ground, and a coast usable only part of the year: three candidates all pointing the same way, and a density of 0.1. Say it as a measurement, not a verdict -- 0.1 people for each square kilometer is what the figure is, and it says nothing about anybody who lives there.',
      ],
      answer:
        'Densities: Alder Coast 80 people per square kilometer (12,000,000 divided by 150,000), Brayle Plain 20 (8,000,000 divided by 400,000), Cantrel Basin 2 (1,200,000 divided by 600,000), Dunmoor North 0.1 (250,000 divided by 2,500,000); multiplying each back by its land area returns every count. For Cantrel Basin the data supports water and soil and rules the growing season OUT, because at 250 days its season is the longest of the three regions compared and its density the lowest. For Alder Coast against Brayle Plain the physical conditions match on soil, river and season, and the one named difference is reachable water -- three deep harbors against 900 kilometers to a port -- with the built network that follows a port. Dunmoor North sits at 0.1 with three candidates all pointing the same way.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-settled-area-density',
      kind: 'try_yourself',
      problem:
        '"Marrin has 10,000,000 people and 2,000,000 square kilometers of land. A coastal strip within 200 kilometers of the ocean holds 9,600,000 of those people, on 400,000 square kilometers." A planner asks for the settled-area density of the strip. Which figure is it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '25 people per square kilometer' },
        { id: 'b', text: '5 people per square kilometer' },
        { id: 'c', text: '24 people per square kilometer', correct: true },
        { id: 'd', text: '0.25 people per square kilometer' },
      ],
      expectedAnswer: '24 people per square kilometer',
      hints: [
        'The question asks about the strip, so both numbers in the division have to come from the strip: the people inside it over the land inside it, with nothing from outside it on either side.',
        'Divide 9,600,000 by 400,000, then multiply the answer back by 400,000 and check that 9,600,000 returns. Putting all 10,000,000 people over the strip\'s land, putting the whole country on both sides of the division, and using the people and land left outside the strip each give a different figure, and none of the three answers the question that was asked.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-does-the-national-figure-support-the-claim',
      kind: 'try_yourself',
      problem:
        '"Ansby has 21,000,000 people and 3,000,000 square kilometers of land. Within 250 kilometers of its southern border live 18,900,000 of those people, on 700,000 square kilometers." A guidebook says: "Ansby runs at 7 people per square kilometer, so it is a country of open space from end to end." Does the data support the claim?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Supported: 21,000,000 divided by 3,000,000 is 7 people per square kilometer, and a figure worked out for the whole country holds for each part of it' },
        { id: 'b', text: 'Not supported: all 21,000,000 people divided by the band\'s 700,000 square kilometers is 30 people per square kilometer, so 30 is the figure the guidebook should have printed' },
        { id: 'c', text: 'Not supported: the honest figure is the band\'s 18,900,000 people divided by the whole 3,000,000 square kilometers of Ansby, which comes to 6.3 people per square kilometer' },
        { id: 'd', text: 'Not supported: 90 percent of the people are on 700,000 square kilometers at 27 people per square kilometer, and the land beyond sits far below 7, so the average describes nowhere', correct: true },
      ],
      expectedAnswer: 'Not supported: 90 percent of the people are on 700,000 square kilometers at 27 people per square kilometer, and the land beyond sits far below 7, so the average describes nowhere',
      hints: [
        'Work the national figure first and confirm the guidebook has that part right. Then work the band on its own, the people inside it over the land inside it, and see how far the two figures sit apart.',
        'Take the shares as well as the figures: what fraction of the population is inside the band, and what fraction of the land. Pairing the band\'s people with the country\'s area, pairing the whole population with the band\'s area, and accepting a national average as a description of each part are three ways to miss what the two shares show.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-control-the-data-supports',
      kind: 'try_yourself',
      problem:
        'Two regions of the same country are described. "Halder: 9,000,000 people, 300,000 square kilometers. Ivell: 900,000 people, 300,000 square kilometers. Both have deep soil, both have a growing season of 190 days, and both sit the same distance from the national capital. Halder has an ocean coast with three deep harbors and a navigable river crossing it. Ivell is ringed by mountains, with no navigable river and no coast." Which explanation of the density gap does the data support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Reachable water: Halder is at 30 people per square kilometer against 3 in Ivell, and of the conditions listed only the harbors and the navigable river differ between them', correct: true },
        { id: 'b', text: 'Deep soil: Halder carries ten times the people of Ivell on the same 300,000 square kilometers, and soil deep enough to farm is what puts settlement on the land' },
        { id: 'c', text: 'The growing season: 190 days is long enough to raise a crop, and a region that can feed itself from its own fields will always carry more people for each square kilometer' },
        { id: 'd', text: 'Longer settlement: Halder has had its towns, roads and water lines standing far longer, and a region whose network is already built keeps drawing people while an emptier one does not' },
      ],
      expectedAnswer: 'Reachable water: Halder is at 30 people per square kilometer against 3 in Ivell, and of the conditions listed only the harbors and the navigable river differ between them',
      hints: [
        'Compute both densities first. Then list every condition the data gives for each region and mark which ones are identical in the two and which ones differ.',
        'A condition that is the same in the dense region and in the sparse one cannot be what separates them, however much settlement needs it in general. Check also whether the condition you want to name is actually stated in the data for both regions, or is being read into it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-average-as-everywhere-and-control-that-does-not-vary',
      kind: 'misconception_check',
      question:
        'A student is handed this: "Tolmar has 9,000,000 people and 4,500,000 square kilometers of land. Within 400 kilometers of its southern border live 8,100,000 of those people, on 900,000 square kilometers." The student writes: "Tolmar works out at 2 people per square kilometer, so there is open land in every part of Tolmar." Then, looking back at Ternhall, the student writes: "Alder Coast is four times as dense as Brayle Plain, so Alder Coast must have the better soil." What has gone wrong in each?',
      commonErrors: [
        {
          answer: 'Tolmar works out at 2 people per square kilometer, so there is open land in every part of Tolmar.',
          misconception:
            'Reading a national figure as though it held for each part of the country. The division is correct, but it spreads every person evenly over every square kilometer of territory, which is the one thing that is not true of a country whose people sit in a band.',
          correctsTo:
            'The national figure is right and the conclusion drawn from it is not. 9,000,000 divided by 4,500,000 is 2 people per square kilometer; check, 2 times 4,500,000 is 9,000,000. Now run the second division. The band holds 8,100,000 people on 900,000 square kilometers, so 8,100,000 divided by 900,000 is 9 people per square kilometer; check, 9 times 900,000 is 8,100,000. What is left is 9,000,000 minus 8,100,000, which is 900,000 people, on 4,500,000 minus 900,000, which is 3,600,000 square kilometers, so 900,000 divided by 3,600,000 is 0.25 people per square kilometer; check, 0.25 times 3,600,000 is 900,000. The shares finish it: 8,100,000 divided by 9,000,000 is 90 percent of the people, and 900,000 divided by 4,500,000 is 20 percent of the land. WRONG: "Tolmar is at 2 per square kilometer, so there is open land in every part of it." CORRECT: "Tolmar is at 2 per square kilometer as a whole, at 9 inside the band and at 0.25 beyond it, so the national figure describes neither part." The band is thirty-six times the density of the land beyond it, because 9 divided by 0.25 is 36. And say it as a measurement: 9 and 0.25 are counts of people for each square kilometer, not verdicts on either part of Tolmar or on anybody living there.',
        },
        {
          answer: 'Alder Coast is four times as dense as Brayle Plain, so Alder Coast must have the better soil.',
          misconception:
            'Naming a physical control as the explanation without checking that it varies where the density varies. Soil is a real condition on settlement, so the sentence sounds like geography, but the data says both regions have deep soil, which means soil cannot be what separates them.',
          correctsTo:
            'Check the candidate against the data before accepting it. Alder Coast is 12,000,000 divided by 150,000, which is 80 people per square kilometer; Brayle Plain is 8,000,000 divided by 400,000, which is 20; and 80 divided by 20 is 4, so the four-fold gap is real. But the data gives deep soil in BOTH regions and a large river in BOTH, so neither can be the separator. The one condition that differs is reachable water: Alder Coast has an ocean coast with three deep harbors, while Brayle Plain is 900 kilometers from the nearest port. WRONG: "Four times as dense, so the soil must be better." CORRECT: "Four times as dense with the same soil and the same river, so the explanation has to be the difference the data actually names, which is the harbors and the port distance." A control that is identical on both sides of a density gap explains none of it, no matter how important that control is to settlement in general.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Run the division twice. The national figure is the whole population over the whole land area; the settled-area figure is the people inside a stated band over the land inside that band. The second one describes a place you could stand in.',
        'Take both shares: the share of the people inside the band and the share of the land inside the band. Ninety percent of the people on twenty percent of the land is a national figure that describes nowhere in the country.',
        'Invert everything. Multiply each figure back by its own land area and make the count come back, and check that the band and the land beyond it add up to the whole country on both sides.',
        'A physical control explains a density gap only if it varies where the density varies. A condition that is the same in the dense region and the sparse one is ruled out, and a condition that runs the opposite way is ruled out hardest.',
        'Where the physical conditions match and the densities do not, the reading the data supports is the network already standing on the ground -- roads, ports, water lines and towns that somebody arriving now joins rather than builds.',
        'In North America the two patterns to know are that the eastern half of the United States and both of its coasts are its most densely settled parts, and that Canada\'s people are concentrated in a band near its southern border with a sparsely settled North, so Canada\'s low national figure misdescribes where Canadians live.',
        'Move one edge of the band and the settled-area figure moves, because a widened band takes in land faster than people. State the line you drew, and re-run the division with it moved before you trust a verdict.',
        'Densely settled and sparsely settled are measurements of people for each square kilometer. They are never a verdict on a region or on the people living in it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.1', cedTitle: 'North America: Population Patterns' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
