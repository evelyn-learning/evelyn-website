/**
 * Grade 8 World Geography — North America: People, Cities & Economy: North
 * America: Metropolitan Regions & Urban Form.
 *
 * PROCEDURE-LED row (National Geography Standard 12), shaped on the
 * procedure-led exemplar `m8geo-u1-counts-rates-and-fair-comparison.ts`: the
 * concept segment is an ordered routine run over described data, the first
 * worked example runs the routine straight through, the second splits one
 * metropolitan figure into its two forms and then prices a proposal, and both
 * worked examples end with a check move plus an arithmetic inversion.
 *
 * THE PROCEDURE, in the order it is always run:
 *   1. Divide the later population by the earlier population -- the
 *      POPULATION FACTOR.
 *   2. Divide the later built-up area by the earlier built-up area -- the
 *      LAND FACTOR.
 *   3. Divide the population factor by the land factor. That is the DENSITY
 *      FACTOR, and it says in one number what happened to the form.
 *   4. Compute the density at each date straight from the data, confirm it
 *      agrees with the density factor, and invert: multiply each density back
 *      by its own area to recover its population.
 *   5. Split the metropolitan total into core and ring and run step 4 on each
 *      part, because one metropolitan density is two forms averaged together.
 *   Then change ONE input and run it again.
 *
 * SCOPE GUARD (written last, against the finished body; every absence claim
 * below was grepped over the body -- the guard's own words do not count, per
 * ruling 34). This row ASSUMES three things and re-teaches none of them.
 * (1) That density is people divided by land area (Grade 7,
 * `m7geo-u3-population-distribution-and-density.ts`): the premise appears
 * EXACTLY ONCE in the body, as the opening subordinate clause of keyIdea 2
 * ("Density is people divided by land area, so dividing a factor by a factor
 * ..."), where it is used; no keyIdea, worked example, item, misconception
 * correction or recap line has defining density as its job -- the word occurs
 * thirty-six times in the body and every occurrence but that one clause is a
 * computed figure or an instruction to compute one. (2) That the people of a
 * settlement and the ground it covers are two quantities that move
 * independently (Grade 7,
 * `m7geo-u3-urbanization-and-settlement.ts`, which defined urbanization as a
 * share and taught the linear, clustered and dispersed settlement patterns):
 * the word "urbanization" and all three pattern names appear ZERO times in the
 * body, and the premise is used rather than named, in keyIdea 1's closing
 * sentence. (3) The pattern in which one city dwarfs every other in its
 * country and gathers the national functions into itself (Grade 7,
 * `m7geo-u7-latin-america-economy-and-cities.ts`): keyIdea 5 invokes it in one
 * clause as the CONTRAST the United States is measured against; the term
 * "primate city" appears zero times in the body and neither of its two tests
 * is set out.
 *   It ADDS measuring built-up area against population as two growth factors
 * and a density factor, splitting one metropolitan density into a core figure
 * and a ring figure, reading form from three different kinds of evidence (a
 * density, a share of land against a share of people, a share of trips by car
 * against transit), the multi-centered United States urban system read from
 * where the national functions sit, and evaluating a growth-boundary proposal
 * with the new density computed and the trade-off named on both sides.
 *   It names NO urban-structure model: "concentric", "sector", "nuclei" and
 * "central business district" occur zero times in the body, and so does
 * "gentrification" -- both belong to AP Human Geography,
 * `ap-human-geo-urban.ts`. Note that "multi-centered urban system" here is a
 * claim about how the COUNTRY's cities are arranged relative to one another,
 * not the multiple-nuclei account of the inside of one city, which is the
 * model being withheld. It does NOT tell the story of how any suburb came to
 * be built: no year, no decade, no named program and no chronology appear in
 * the body -- the only interval anywhere is the thirty-year gap between two
 * surveys of an invented metropolitan area (`g8-ss-*`, `ap-apush-*`). It does NOT
 * compute or compare regional population densities across North America (row
 * 4.1 `north-america-population-patterns`), does NOT read an origin-
 * destination table or sort moves into push and pull (row 4.2
 * `north-america-migration-flows`), and does NOT classify economic activity or
 * read a trade table (row 4.4 `north-america-economic-regions-and-trade`).
 * Three things ARE deliberately allowed, because neighbors sit close:
 * (a) splitting one metropolitan average into a core figure and a ring figure
 * is done here as a FORM distinction, which this row's scope line names, and
 * not as a lesson about aggregation -- no area anywhere in this file is merged
 * with another or subdivided to make a pattern appear or vanish, which is row
 * 1.3 `scale-of-analysis-and-hidden-patterns`; (b) one growth-management
 * proposal is evaluated here, with the new density computed, because this
 * row's scope line asks for it, while row 10.2 `evaluating-a-land-use-plan`
 * compares two competing plans across parcels, a flood zone and three
 * stakeholder groups, and no flood zone, parcel or second plan appears here;
 * (c) the share of trips by car against transit is used as EVIDENCE of form,
 * which this row's scope line supplies, and no transport network is designed
 * or costed.
 *
 * BURNED SPECIMENS (controller ruling 36). `los[0].description` is rendered to
 * the student, so every concrete example it names is unavailable to an item:
 * the multi-centered United States urban system and the northeastern corridor
 * are TAUGHT in keyIdea 5 and the recap and are deliberately NOT the subject
 * of any item. All three items use invented metropolitan areas -- Merrow,
 * Ostrey and Parrin -- that appear nowhere in a teaching segment. Averly
 * appears in both worked examples and in the misconception check, which is
 * teaching-to-teaching sharing and is house style (ruling 22 as corrected).
 * Do not "helpfully" move a cell example into an item later.
 *
 * ACCURACY NOTE (rules 3 and 9). Every number in this file belongs to an
 * invented metropolitan area and was written for the arithmetic. NOT ONE
 * FIGURE is attached to a real place anywhere in the file -- no population, no
 * area, no density, no travel share, no rank. The real-place content is
 * qualitative and long-settled: that the national government of the United
 * States sits in Washington, D.C.; that major seaports work the Atlantic,
 * Pacific and Gulf coasts; that large airline hubs sit in several different
 * metropolitan areas rather than one; and that a chain of large metropolitan
 * areas runs along the Atlantic seaboard from the Washington, D.C. area north
 * through Baltimore, Philadelphia and New York to Boston. The corridor and its
 * city order were verified this session against the encyclopedia entry
 * "Northeast megalopolis", which traces the naming to Jean Gottmann,
 * "Megalopolis: The Urbanized Northeastern Seaboard of the United States"
 * (1961), and describes it as a chain of metropolitan areas with several
 * centers. No metropolitan area is ranked against another, and no place or
 * the people in it is described as better or worse: a density is a
 * measurement, and the file says so in the concept and in the recap.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped Grade
 * 7 Geography bank the keyed answer was the strictly longest choice 67% of the
 * time, and 94% at difficulty 4; chance with four choices is 25%). Every
 * distractor below states the full wrong STEP that produces it -- the density
 * change read backwards, two rises compared as raw differences in different
 * units, the metropolitan average handed to the ring, the core figure handed
 * to the ring, the ring's people divided by the whole metropolitan area's
 * land, a stated promise accepted instead of tested, a decomposition demanded
 * that the figures do not need -- and no key was built to be the longest
 * choice BECAUSE it is the key. MEASURED as a diagnostic, not as a score: the
 * key is the strictly longest choice in TWO of the three items, and in both of
 * them the margin is inside the noise ruling 16 describes -- item 1 is 180
 * characters against 179, and item 3 is 232 against 226, which is under three
 * percent and nothing a student could see. Both were left alone rather than
 * padded, because growing an honest distractor to close a one-character gap is
 * how the sibling batch inverted the tell. Item 3's key is long for a reason
 * that is load-bearing rather than decorative: the stem asks for a verdict
 * that names BOTH sides of a trade-off, so a key without the cost clause would
 * not be correct. Zero is not the target; the meaningful measurement is the
 * 120-item course rate taken at registration. The three keys sit at ids c, a
 * and b -- the id set `(4 + 3) mod 4 = 3` requires, omitting d. The numeric
 * item's four choices share one unit clause and come out at exactly 33
 * characters each, and they are ordered by the id rule and never by magnitude.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every table is written out
 * in prose inside the segment that needs it, and every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U4_NORTH_AMERICA_METROPOLITAN_REGIONS: LessonPlan = {
  id: 'evelyn.ms.m8geo.north-america-metropolitan-regions.v1',
  title: 'North America: Metropolitan Regions & Urban Form',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.north-america-metropolitan-regions',
      standard: 'M8GEO-4.3',
      description:
        'Given data on a metropolitan area (core population, suburban population, land area at two dates, share of trips by car versus transit), compute how built-up area grew relative to population, distinguish a dense core from low-density suburban form, explain why the United States has a multi-centered urban system (many large metropolitan areas including the northeastern corridor) rather than one dominant city, and evaluate a growth-management proposal by its trade-offs (National Geography Standard 12: the processes, patterns and functions of human settlement).',
    },
  ],
  prerequisites: ['m8geo.north-america-migration-flows'],
  followUps: ['m8geo.north-america-economic-regions-and-trade'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put two streets in the same metropolitan area side by side so the student wants a number that tells them apart, before any routine arrives.',
      script:
        'Two friends live in the same metropolitan area, forty minutes apart. One of them walks out the front door, turns left, and there is a store, a barber and a bus stop with a bus every ten minutes. The other one cannot get anywhere without a ride -- not to practice, not to a friend\'s house, not to buy a drink -- and there is no bus on that street and there never will be, because a bus route pays for itself by the number of doors it passes, and that street has about twelve doors in a kilometer. Now here is the strange part. The city government publishes ONE figure for how crowded the metropolitan area is, and that figure describes neither of those streets. It sits somewhere in between, which is to say nowhere. Today you take that figure apart: you measure how fast the built-up land grew against how fast the people did, you split the average into the two forms hiding inside it, and then you price a proposal that says the spreading should stop.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-measuring-urban-form',
      kind: 'concept',
      goal: 'Install the growth-factor routine, the core-and-ring split, the three kinds of evidence a form verdict needs, the multi-centered United States system, and the rule that a proposal is evaluated with a computed figure and a named trade-off.',
      keyIdeas: [
        'MEASURE THE SPREAD WITH TWO GROWTH FACTORS AND COMPARE THEM, BECAUSE NEITHER ONE ALONE SAYS ANYTHING ABOUT FORM. A growth factor is the later figure divided by the earlier one: a metropolitan area that went from 600,000 people to 900,000 has a population factor of 1.5, and one whose built-up land went from 200 square kilometers to 600 has a land factor of 3. The comparison is the whole move. If the land factor is the bigger of the two, the built-up area spread faster than the population grew and each square kilometer now holds fewer people than before. If the population factor is bigger, the metropolitan area filled in. If they match, the form held steady while the place got larger. "The city grew" is not an answer to this question, because a metropolitan area can grow in people, in ground, or in both, and only the two factors side by side say which.',
        'DIVIDE THE POPULATION FACTOR BY THE LAND FACTOR AND YOU GET THE DENSITY FACTOR DIRECTLY. Density is people divided by land area, so dividing a factor by a factor tells you what happened to that division without computing either density first: 1.5 divided by 3 is 0.5, and a density factor of 0.5 means the people for each square kilometer came out half what they were. Then check it the long way -- 600,000 divided by 200 is 3,000 people per square kilometer, 900,000 divided by 600 is 1,500, and 3,000 times 0.5 is 1,500 -- and invert, by multiplying each density back by its own area to recover its population. If the population does not come back, a zero slipped.',
        'ONE METROPOLITAN DENSITY IS TWO FORMS AVERAGED TOGETHER, SO SPLIT IT BEFORE YOU DESCRIBE ANYTHING. A metropolitan area has a CORE, where buildings stand close together, shops sit under apartments and most of what a person needs in a day is within walking distance, and a SUBURBAN RING around it, where homes stand on separate lots with yards, parking and wide roads between the destinations. Divide each part\'s population by its OWN land area and the two figures come out several times apart -- a core at 6,000 people per square kilometer beside a ring at 1,000 is a ratio of six. The metropolitan-wide figure is neither of them, and it does not sit halfway either: because most of the built-up land is out in the ring, the average is pulled down close to the ring\'s figure. Handing the metropolitan average to the core, or to the ring, is the commonest wrong step in this whole lesson.',
        'A VERDICT ABOUT FORM NEEDS THREE KINDS OF EVIDENCE, NOT THREE VERSIONS OF ONE. The first kind is a density: people for each square kilometer, computed for each part separately. The second kind is a share against a share: if the ring holds 90 percent of the built-up land and only 60 percent of the people, it is spread out by construction, and that comparison is true whatever the densities come to. The third kind is how people get around: when homes, shops and jobs are far apart, nearly every trip is driven, and when they are close together a route passes enough doors to be worth running -- so a part where 95 of every 100 trips are by car and a part where 60 of every 100 are is telling you about the distance between destinations. One number is a hunch; three of different kinds, all pointing the same way, is evidence. And every one of those numbers is a measurement of buildings, land and travel, never a verdict on the households living in either part.',
        'THE UNITED STATES RUNS A MULTI-CENTERED URBAN SYSTEM, AND YOU READ IT OFF WHERE THE NATIONAL FUNCTIONS SIT. You already know the pattern in which a single city dwarfs every other in its country and gathers the government, the main business center, the main port and the main airport into one place. The United States is not arranged that way, and the test is to go looking for those functions one at a time. The national government sits in Washington, D.C. Major seaports work the Atlantic coast, the Pacific coast and the Gulf coast. Large airline hubs sit in several different metropolitan areas, inland and coastal. Business centers sit in different places again, and different ones lead in different industries. Because no single metropolitan area holds all of that, the country has many large metropolitan areas rather than one dominant one -- a multi-centered urban system. Along the Atlantic seaboard those centers run in a chain, from the Washington, D.C. area north through Baltimore, Philadelphia and New York to Boston, close enough together that the belt is treated as one northeastern corridor -- and even that corridor is one part of the country\'s urban system, not its single center.',
        'EVALUATE A GROWTH PROPOSAL BY COMPUTING THE NEW FIGURE FIRST AND NAMING BOTH SIDES OF THE TRADE-OFF SECOND. A GROWTH BOUNDARY is a line around a metropolitan area\'s built-up land past which new building is not permitted, so that growth goes inward instead of outward. Do the arithmetic before the opinion: put the extra residents on the land the proposal allows and recompute the people for each square kilometer, so the change is a number and not a mood. Then say what is gained -- shorter trips, and more households served by each kilometer of pipe, road and bus route, which lowers what the network costs for each household, and open land outside the line left unbuilt. Then say what is given up and who it lands on -- fewer detached lots for the households that wanted one, and, if building inside the line does not keep pace with the people arriving, higher prices inside it, which press hardest on the households with the least to spend. A proposal that is said to cost nobody anything has not been evaluated; it has been repeated.',
      ],
      vocabulary: [
        {
          term: 'built-up area',
          definition:
            'the ground a settlement actually covers with buildings, streets, parking and yards, measured in square kilometers and counted separately from the number of people standing on it.',
        },
        {
          term: 'metropolitan area',
          definition:
            'a core settlement together with the surrounding built-up land whose daily travel for work, school and services runs into that core, counted as one unit.',
        },
        {
          term: 'core',
          definition:
            'the part of a metropolitan area where buildings stand closest together and most of a day\'s destinations lie within walking distance of one another.',
        },
        {
          term: 'suburban ring',
          definition:
            'the built-up land around a core, where homes sit on separate lots and the destinations of a daily trip are far enough apart that most trips are driven.',
        },
        {
          term: 'growth factor',
          definition:
            'the later figure divided by the earlier one, which says how many times as large a quantity became between two dates.',
        },
        {
          term: 'growth boundary',
          definition:
            'a line drawn around a metropolitan area\'s built-up land past which new building is not permitted, used to send growth inward rather than outward.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-two-growth-factors',
      kind: 'worked_example',
      problem:
        'Run the routine straight through on a metropolitan area measured twice.\n\n"The Averly metropolitan area. At the first survey: 600,000 people living on 200 square kilometers of built-up land. At the second survey, taken thirty years later: 900,000 people living on 600 square kilometers of built-up land."\n\nA council report says: "Averly grew, and the built-up land grew with it." Measure what actually happened to the form.',
      steps: [
        'Step one: the population factor. 900,000 divided by 600,000 is 1.5. Averly has one and a half times the people it had.',
        'Step two: the land factor. 600 divided by 200 is 3. Averly covers three times the ground it covered.',
        'Step three: compare the two factors and get the density factor. 3 is larger than 1.5, so the land outran the people, and dividing gives the size of it: 1.5 divided by 3 is 0.5. A density factor of 0.5 means the people on each square kilometer came out at half what they were. WRONG: "The land grew with the people." CORRECT: "The land grew twice as fast as the people, so the built-up area spread out and each square kilometer now holds half as many people."',
        'Step four: compute the two densities the long way and check they agree. First survey: 600,000 divided by 200 is 3,000 people per square kilometer. Second survey: 900,000 divided by 600 is 1,500 people per square kilometer. And 3,000 times 0.5 is 1,500, so the factor and the long way give the same answer.',
        'Invert both, because this is where a slipped zero shows itself. 3,000 times 200 is 600,000, which is the first population. 1,500 times 600 is 900,000, which is the second. Both counts come back.',
        'Rewind the input and read it backwards. Averly added half again as many people and tripled the ground they stand on. Half again as many people on three times the land is exactly what a halved density looks like, so the verdict comes out of the table and not out of a guess. Notice also what the council report got right: both numbers did go up, and every word of the report is true. It is true and it is useless, because two rises only mean something once you divide one by the other.',
        'Now change ONE input and run it again, so "growing means spreading" does not get memorized as a rule. Suppose the built-up land at the second survey had been 300 square kilometers instead of 600, with the same 900,000 people. The land factor becomes 300 divided by 200, which is 1.5 -- the same as the population factor -- so the density factor is 1.5 divided by 1.5, which is 1, and nothing changed. Check it the long way: 900,000 divided by 300 is 3,000 people per square kilometer, the same as the first survey, and 3,000 times 300 is 900,000. Same people, same growth, same thirty years, and the form held steady. The spreading was never in the population figure; it was in the land figure all along.',
      ],
      answer:
        'The population factor is 1.5 (900,000 divided by 600,000) and the land factor is 3 (600 divided by 200), so the density factor is 1.5 divided by 3, which is 0.5: Averly halved its density, from 3,000 people per square kilometer (600,000 divided by 200) to 1,500 (900,000 divided by 600). Multiplying each density back by its own area returns each population. The built-up area spread faster than the population grew. Had the land reached only 300 square kilometers instead of 600, the two factors would both be 1.5, the density would have stayed at 3,000, and the same population growth would have produced no spreading at all.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-split-the-average-and-price-the-plan',
      kind: 'worked_example',
      problem:
        'Averly\'s metropolitan density at the second survey is 1,500 people per square kilometer. Split that figure into its two forms, say what kind of form each part has, and then evaluate the council\'s proposal.\n\n"Averly at the second survey: 900,000 people on 600 square kilometers of built-up land. The core holds 360,000 of those people on 60 square kilometers. The suburban ring holds the other 540,000 on the other 540 square kilometers. In the core, 60 of every 100 trips are made by car and 40 by transit. In the ring, 95 of every 100 trips are made by car and 5 by transit.\n\nThe council proposes a growth boundary: no new building outside the present 600 square kilometers, with the next 180,000 residents housed inside it."',
      steps: [
        'Split the density first, one part at a time, each against its own land. Core: 360,000 divided by 60 is 6,000 people per square kilometer. Ring: 540,000 divided by 540 is 1,000 people per square kilometer. Invert both: 6,000 times 60 is 360,000 and 1,000 times 540 is 540,000, and the two add back to 900,000 on 60 plus 540, which is 600 square kilometers. The split closes.',
        'Now look at where the metropolitan figure of 1,500 actually sits. The core is at 6,000, the ring is at 1,000, and 6,000 divided by 1,000 is 6 -- the core is six times as dense as the ring. The metropolitan figure is not halfway between them and was never going to be. WRONG: "Averly is a city of 1,500 people per square kilometer, so its neighborhoods are moderately dense." CORRECT: "Averly is 6,000 in the core and 1,000 in the ring, and the 1,500 sits close to the ring because nine tenths of the built-up land is out there."',
        'Second kind of evidence: a share of land against a share of people. The ring holds 540 of the 600 square kilometers, and 540 divided by 600 is 0.90, so 90 percent of the built-up land. It holds 540,000 of the 900,000 people, and 540,000 divided by 900,000 is 0.60, so 60 percent of the people. Ninety percent of the ground carrying sixty percent of the people is a spread-out form by construction. Check the other way round: the core is 60 of 600 square kilometers, which is 10 percent of the land, and 360,000 of 900,000 people, which is 40 percent of the people. 90 plus 10 is 100 and 60 plus 40 is 100, so nothing has gone missing.',
        'Third kind of evidence: how people get around. In the ring 95 of every 100 trips are driven and 5 are made by transit; in the core it is 60 driven and 40 by transit, and each pair adds to 100. That gap is a distance measurement in disguise. A transit route earns its riders from the doors it passes, so a part of the metropolitan area where the destinations are far apart gives it too few doors to be worth running, and the trips go by car instead.',
        'Put the three together. A density of 6,000 against 1,000 is one kind of evidence. Ninety percent of the land holding sixty percent of the people is a second kind. Ninety-five trips in a hundred driven against sixty is a third kind. All three point the same way, and they are not restatements of each other -- the first counts people on land, the second compares two shares, the third counts trips. One number is a hunch; three of different kinds, all pointing the same way, is evidence. The verdict: Averly has a dense core and a low-density suburban ring, and it is a description of buildings, land and travel, not a judgment about anybody living in either part.',
        'Now evaluate the proposal, and compute before you comment. The next 180,000 residents go inside the present 600 square kilometers: 900,000 plus 180,000 is 1,080,000, and 1,080,000 divided by 600 is 1,800 people per square kilometer. Invert: 1,800 times 600 is 1,080,000. So the proposal is a move from 1,500 to 1,800 across the metropolitan area, and now the trade-off can be stated against a number rather than a feeling.',
        'Name both sides and say who each lands on. GAINED: destinations move closer together, so trips get shorter; each kilometer of water pipe, road and bus route serves more households, which lowers what the network costs for each household; and the open land outside the line stays unbuilt. GIVEN UP: fewer detached lots with yards for the households that wanted one, which is a real loss to those households and not a small one; and if building inside the line does not keep pace with 180,000 arriving people, the homes inside get more expensive, and higher prices press hardest on the households with the least to spend. Those two sentences are the evaluation. A council that says the boundary costs nobody anything has skipped the second one.',
      ],
      answer:
        'Core: 360,000 divided by 60 is 6,000 people per square kilometer. Ring: 540,000 divided by 540 is 1,000. The core is six times as dense, and the metropolitan figure of 1,500 sits near the ring because the ring holds 90 percent of the built-up land (540 of 600) while holding 60 percent of the people (540,000 of 900,000). The travel data agrees: 95 of every 100 ring trips are driven against 60 in the core. Three kinds of evidence, one verdict -- a dense core and a low-density suburban ring. Under the proposal, 1,080,000 people on 600 square kilometers is 1,800 per square kilometer, up from 1,500. It buys shorter trips, cheaper networks for each household and unbuilt land outside the line; it costs the households that wanted a detached lot, and, if building does not keep pace, it raises prices inside the line on the households least able to pay them.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-compare-the-growth-factors',
      kind: 'try_yourself',
      problem:
        '"The Merrow metropolitan area. At the first survey: 400,000 people on 100 square kilometers of built-up land. At the second survey, thirty years later: 800,000 people on 400 square kilometers of built-up land." Which statement does the data support?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'The built-up land grew four times over while the population only doubled, so each square kilometer of Merrow now holds twice as many people as it held at the first survey',
        },
        {
          id: 'b',
          text: 'The population rose by 400,000 while the built-up land rose by 300 square kilometers, so the people grew by the larger amount and Merrow became more tightly packed than before',
        },
        {
          id: 'c',
          text: 'The population doubled while the built-up land grew four times over, so density fell from 4,000 to 2,000 people per square kilometer and the land spread faster than the people grew',
          correct: true,
        },
        {
          id: 'd',
          text: 'Nothing about Merrow\'s form can be worked out from these figures, because a metropolitan total says nothing at all until the core and the suburban ring are given as separate lines',
        },
      ],
      expectedAnswer:
        'The population doubled while the built-up land grew four times over, so density fell from 4,000 to 2,000 people per square kilometer and the land spread faster than the people grew',
      hints: [
        'Build two growth factors before you say anything at all: the later population divided by the earlier population, and the later built-up area divided by the earlier built-up area. Then ask which of the two came out bigger.',
        'Dividing the population factor by the land factor gives the density factor, and you can confirm it by computing 400,000 divided by 100 and 800,000 divided by 400 and multiplying each result back by its own area. Reading a spreading metropolitan area as a packing one gets the direction backwards; comparing the two rises as raw differences sets 400,000 people against 300 square kilometers, which are not the same kind of quantity; and refusing to answer skips a comparison these two totals fully support.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-ring-density',
      kind: 'try_yourself',
      problem:
        '"The Ostrey metropolitan area holds 670,000 people on 400 square kilometers of built-up land. Its core holds 250,000 of those people on 50 square kilometers. The suburban ring holds the rest of the people on the rest of the land." What is the population density of Ostrey\'s suburban ring?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '1,200 people per square kilometer', correct: true },
        { id: 'b', text: '5,000 people per square kilometer' },
        { id: 'c', text: '1,675 people per square kilometer' },
        { id: 'd', text: '1,050 people per square kilometer' },
      ],
      expectedAnswer: '1,200 people per square kilometer',
      hints: [
        'The ring is what is left once the core is taken out, and it has to be taken out of BOTH columns. Subtract the core\'s people from the metropolitan total, subtract the core\'s land from the metropolitan land, and only then divide.',
        'That leaves 420,000 people on 350 square kilometers; multiply your answer back by 350 and confirm the population returns. Dividing the metropolitan total by the metropolitan land answers a question about the whole area, dividing the core\'s people by the core\'s land answers a question about the core, and dividing the ring\'s people by all 400 square kilometers spreads the ring\'s people across land the core is standing on.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-evaluate-the-boundary',
      kind: 'try_yourself',
      problem:
        '"The Parrin metropolitan area holds 1,100,000 people on 500 square kilometers of built-up land. Parrin\'s council proposes a growth boundary: no new building outside the present 500 square kilometers, with the next 250,000 residents housed inside it. A council member says the change will cost nobody anything." Which evaluation does the data support?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'It costs nobody anything, because a growth boundary only stops building on the empty land outside the line and no household already living inside the line is asked to move out of its home',
        },
        {
          id: 'b',
          text: 'Density inside the line rises from 2,200 to 2,700 people per square kilometer, which buys shorter trips and cheaper pipes and routes for each household and costs households wanting a detached lot, plus higher prices if building lags',
          correct: true,
        },
        {
          id: 'c',
          text: 'The proposal cannot be evaluated from these figures at all, because a growth boundary changes only the suburban ring and the populations of the core and the ring have not been given here as separate lines',
        },
        {
          id: 'd',
          text: 'Density inside the line falls to below 2,200 people per square kilometer, because holding the built-up land fixed stops the metropolitan area spreading, and spreading outward is what puts more people onto each square kilometer',
        },
      ],
      expectedAnswer:
        'Density inside the line rises from 2,200 to 2,700 people per square kilometer, which buys shorter trips and cheaper pipes and routes for each household and costs households wanting a detached lot, plus higher prices if building lags',
      hints: [
        'Two things have to happen before any verdict. Put the extra residents onto the land the proposal allows and recompute the people for each square kilometer, then ask what that higher figure buys and what it takes away.',
        '1,100,000 plus 250,000 on the same 500 square kilometers; multiply your answer back by 500 to confirm it. Holding the land fixed while the people rise raises the figure rather than lowering it, the two metropolitan totals are all the arithmetic needs, and a claim that a plan costs nobody anything is a claim to test, not a fact to accept.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-differences-and-the-average',
      kind: 'misconception_check',
      question:
        'A student works on the Averly data -- 600,000 people on 200 square kilometers at the first survey, 900,000 on 600 at the second, with a core of 360,000 on 60 square kilometers and a ring of 540,000 on 540 -- and writes two sentences. First: "The population went up by 300,000 and the built-up land went up by 400, so the two grew by about the same amount and Averly kept its shape." Second: "Averly comes to 1,500 people per square kilometer, so that is what the core is like." What is wrong with each?',
      commonErrors: [
        {
          answer: 'The population went up by 300,000 and the land went up by 400, so the two grew by about the same amount.',
          misconception:
            'Comparing two rises as raw differences when the two quantities are not the same kind of thing. 300,000 people and 400 square kilometers cannot be set beside each other at all, and reading them as close in size is reading two different units as one.',
          correctsTo:
            'Compare the factors, not the differences. Population: 900,000 divided by 600,000 is 1.5. Land: 600 divided by 200 is 3. The land factor is twice the population factor, so 1.5 divided by 3 is 0.5 and the density halved -- 600,000 divided by 200 is 3,000 people per square kilometer at the first survey, and 900,000 divided by 600 is 1,500 at the second. Check by inverting: 3,000 times 200 is 600,000 and 1,500 times 600 is 900,000. WRONG: "300,000 and 400 are about the same, so the shape held." CORRECT: "One and a half times the people on three times the land is half the density, so the built-up area spread." A difference between two counts of different things is not a comparison; a factor is, because dividing a quantity by itself leaves the units behind.',
        },
        {
          answer: 'Averly comes to 1,500 people per square kilometer, so that is what the core is like.',
          misconception:
            'Handing a metropolitan-wide average to one part of the metropolitan area, as though the average described a typical neighborhood instead of the whole built-up area taken together.',
          correctsTo:
            'Split it and each part speaks for itself. Core: 360,000 divided by 60 is 6,000 people per square kilometer; check, 6,000 times 60 is 360,000. Ring: 540,000 divided by 540 is 1,000 people per square kilometer; check, 1,000 times 540 is 540,000. The core is six times the ring, and 1,500 is neither figure. It sits near the ring because the ring is 540 of the 600 square kilometers, which is 90 percent of the built-up land, and an average over land follows the land. WRONG: "The metropolitan figure is 1,500, so the core is around 1,500." CORRECT: "The core is 6,000, the ring is 1,000, and 1,500 is the figure you get after averaging a small dense part with a large spread-out one." Before describing any part of a metropolitan area, divide that part\'s people by that part\'s land.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Two growth factors, then compare them. Later population divided by earlier population; later built-up area divided by earlier built-up area. Whichever factor is bigger tells you whether the place spread out or filled in.',
        'Population factor divided by land factor is the density factor: 1.5 divided by 3 is 0.5, so the density halved. Check it the long way, then multiply each density back by its own area to recover the population.',
        'One metropolitan density is two forms averaged together. Divide each part by its OWN land: a core at 6,000 and a ring at 1,000 average to a figure that describes neither, and it lands near the ring because the ring holds most of the land.',
        'A form verdict needs three kinds of evidence, not three versions of one: a density, a share of land set against a share of people, and the share of trips that are driven. All three are measurements of buildings, land and travel, never verdicts on the people living there.',
        'The United States has many large metropolitan areas rather than one dominant one -- a multi-centered urban system. The national government, the major seaports on three coasts, the large airline hubs and the leading business centers sit in different metropolitan areas, and along the Atlantic seaboard those centers run in a chain from the Washington, D.C. area north through Baltimore, Philadelphia and New York to Boston.',
        'Evaluate a growth proposal with the arithmetic first: put the new residents on the allowed land and recompute the people for each square kilometer.',
        'Then name both sides. What is gained -- shorter trips, cheaper networks for each household, land left unbuilt -- and what is given up and who bears it: fewer detached lots, and higher prices inside the line if building does not keep pace. A proposal said to cost nobody anything has not been evaluated.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.3', cedTitle: 'North America: Metropolitan Regions & Urban Form' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
