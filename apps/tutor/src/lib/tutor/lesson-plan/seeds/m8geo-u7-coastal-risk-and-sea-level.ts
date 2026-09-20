/**
 * Grade 8 World Geography — Climate Risk, Hazards & Resilience: Coastal Risk &
 * Sea-Level Change.
 *
 * PROCEDURE-LED row (National Geography Standard 15), shaped on the
 * procedure-led exemplar `m8geo-u1-counts-rates-and-fair-comparison.ts`: the
 * concept segment is a short ordered routine over described data, the first
 * worked example runs the routine straight through and ends with the
 * REWIND-AND-CONTRASTING-CASE check move, and the second reaches a verdict on
 * three priced plans and ends with the THREE-INDEPENDENT-CLUES-OF-DIFFERENT-KINDS
 * check move. Every computed figure is inverted where it is computed.
 *
 * THE ROUTINE, in the order it is always run:
 *   1. Build the WATER LINE first. It is the sum of the stated heights -- how
 *      far the sea now stands above the line the bands were measured from,
 *      plus the stated surge -- never the larger of them.
 *   2. Mark the bands. A band counts as flooded when the water line reaches
 *      the TOP of that band; a water line sitting at a band\'s lower edge
 *      leaves that band out.
 *   3. Add the populations of the flooded bands. That sum is the exposure.
 *   4. Invert: add the unflooded bands back and recover the town total.
 *   5. Where a response is being chosen, read the stated requirement, test
 *      each plan\'s own height and coverage against it, and only then compare
 *      prices.
 *   Then change ONE input -- the surge, or the required water line -- and run
 *   the whole thing again.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause where it is used, that the edge
 * of a coast is not a fixed line but sits wherever the height of the water
 * puts it (Grade 6, `m6geo-u10-how-physical-geography-changes-over-time.ts`,
 * and Grade 7, `m7geo-u2-landforms-and-water-features.ts`), and re-teaches
 * neither: the premise appears exactly once, as the opening clause of keyIdea
 * 1 where it is used, and no keyIdea, step, item, correction or recap line
 * defines a coastal landform or names erosion or deposition -- the words
 * erosion, deposition, delta, peninsula and estuary do not occur in the
 * authored body at all, and neither does gradual. (The one landform word in
 * the file is "dunes", inside `los[0].description`, where it is one of the
 * scope cell\'s own parenthesized examples of the protect family and is copied
 * verbatim; no segment defines it or uses it.) It ADDS building a water
 * line by addition from two stated heights, applying the top-of-the-band rule
 * to decide which bands go under, summing the flooded bands into an exposure
 * count and inverting that sum against the town total, showing that the count
 * does not rise in step with the water because it rises in step with how the
 * people sit in the bands, and testing three priced response plans -- protect,
 * accommodate, retreat -- against a stated requirement on cost, on the height
 * each plan itself keeps working to, and on who is served and who pays.
 * It STOPS SHORT of coastal-process physics (nothing here says how a wave
 * moves sand, how a shoreline is cut back, or how fast any of it happens --
 * `m7geo-u2-landforms-and-water-features.ts` owns the building and wearing
 * processes at define depth and this course owns none of the physics) and of
 * insurance economics (the word insurance does not occur; no premium, payout,
 * pooled loss or expected annual damage figure appears anywhere). It does NOT
 * multiply components together or rank places by the product (row 7.1,
 * `hazard-risk-exposure-and-vulnerability`): the word vulnerability does not
 * occur in the authored body, no product of three factors is taken, and no
 * two places are put in an order. It does NOT read a series, compute a step or
 * a swing, use a departure or a baseline, or touch the greenhouse mechanism
 * (row 7.2, `reading-climate-trend-data`): the words departure, baseline,
 * decade and greenhouse do not occur in the authored body at all, the word
 * trend occurs only inside the `prerequisites` loId, and every height in this
 * file is STATED by the scenario rather than derived from a record. It does
 * NOT sort an action into the two-way classification that row 7.4
 * (`mitigation-adaptation-and-resilience`) owns: the words mitigation,
 * adaptation and resilience occur nowhere but inside the `followUps` loId --
 * no segment uses any of the three -- and the protect / accommodate / retreat
 * split used here is this row\'s own, named in its scope line. (Ruling 34: the
 * absence claims in this guard are scoped to the authored segments and to
 * `los[0].description`; the chain loIds and this guard itself necessarily
 * carry the neighboring rows\' words, and every one of the claims above was
 * re-grepped against the finished file.) Three things ARE deliberately
 * allowed, because neighboring rows sit close and the line has to be drawn
 * rather than avoided:
 * (a) the word exposure is used for the summed band count, because this row\'s
 * scope line says "estimate how many people are exposed", but it is never
 * defined, never split from anything and never multiplied -- row 7.1 owns the
 * framework and cedes the by-band counting to this row in its own guard;
 * (b) money is compared across three plans, which is evaluation on cost that
 * this row\'s scope line asks for, and it stops at totals and one cost for each
 * home -- no plan is scored on weighted criteria (row 2.3) and no denominator
 * is chosen from a claim (row 1.1); (c) one clause of keyIdea 5 names rules
 * about what may be built inside a band as an example of the accommodate
 * family, because the scope cell names zoning as one, and it stops there --
 * no land-use plan is laid out parcel by parcel and no stakeholder group is
 * weighed, which is row 10.2\'s work.
 *
 * The scope cell carries all three parts: the positive statement, a lineage
 * clause ("Deepens G6 10.3 ... and G7 2.1 ...") and a withheld clause ("Not
 * yet coastal-process physics or insurance economics"). Parts two and three
 * live in this guard only.
 *
 * BURNED BY THE OBJECTIVE (rulings 32 and 36): `los[0].description` is
 * rendered to the student, so the concrete things it names are unavailable as
 * item answers -- the three family names, and the five examples in their
 * parentheses (walls, dunes, raised buildings, zoning, relocation), and the
 * three comparison headings (cost, permanence, who is affected). No item below
 * is answered by any of them: item 1 keys on one addition and one band rule,
 * item 2 on two separate additions, and item 3 on a height test that the
 * family names cannot settle, because the objective lists the three families
 * neutrally and says nothing about which one meets any requirement. Do not
 * "helpfully" rewrite one of them into an item later.
 *
 * DEPTH FLOOR NOTE FOR THE FAN-OUT: every item here is answered by a
 * COMPUTED COUNT or a VERDICT ON A STATED REQUIREMENT over described numbers.
 * Nothing asks what a coast is, what a surge is, or what the sea does to land.
 * The test used on this file: the two lower seeds the scope line names were
 * read next to these six keyIdeas, and the closest pair was keyIdea 1 here
 * ("the water\'s edge sits where the height of the water puts it") against
 * Grade 6\'s "a coastline\'s edge can wear back over time"; keyIdea 1 survived
 * because its whole sentence after that clause is an instruction to ADD two
 * stated heights, and nothing in it says that a coast changes or how.
 *
 * ACCURACY NOTE: every town in this file is invented -- Saltmere, Kettlebay,
 * Larkhaven, Tolland -- and every height, population and price was written for
 * the arithmetic. No real place is named anywhere and no real figure for sea
 * level, surge or cost is stated. The only claims about the real world are
 * that water stands level so it reaches the same height all along a shore
 * (which is why one water line can be tested against every band), that a
 * living floor built above the height the water reaches stays dry while the
 * ground below it does not, and that a wall holds only up to the height of its
 * top. All three are physical facts of the kind accuracy rule 2 calls safe,
 * and all three are load-bearing in the arithmetic rather than decorative.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped Grade
 * 7 Geography bank the keyed answer was the strictly longest choice 67% of the
 * time, and 94% at difficulty 4; chance with four choices is 25%). Every
 * distractor states the full wrong STEP that produces it -- the surge taken as
 * the whole water line, a band counted although the water only reaches its
 * lower edge, the highest flooded band counted without the bands beneath it,
 * the new count scaled by the height of the water instead of re-added, the
 * already-flooded people dropped from the new total, a wall accepted without
 * testing its top against the stated water line, permanence chosen over the
 * stated requirement. Measured as a diagnostic, not as a score: the key is the
 * strictly longest choice in ZERO of the three items (it ranks third, third
 * and second of four by character count) and, after the correction described
 * next, the strictly shortest in ZERO of them as well. The first draft ran
 * straight into the inverted tell ruling 16 warns about: the key was the
 * strictly SHORTEST choice in all three items, by 23, 14 and 31 characters --
 * margins a student can see -- because every distractor had been given a full
 * wrong reason while each key had been left as a bare result. The fix was
 * ruling 36\'s, applied to the keys and not to the distractors: each key gained
 * a load-bearing clause it was honestly missing -- item 1 the two band figures
 * it adds, item 2 the already-flooded 500 the new total has to include, item 3
 * the cheapest-of-the-three clause the council\'s stated requirement actually
 * turns on. Nothing was trimmed anywhere. The three spreads now run 101-105,
 * 129-133 and 135-145 characters, which is noise. Zero is NOT the target, and
 * three items cannot distinguish chance from bias; the meaningful figure is
 * the 120-item course rate taken at registration. The three keys sit at ids d,
 * a and b, which is the set
 * `(7 + 3) mod 4 = 2` requires, omitting c. The numeric choices are ordered by
 * that id rule and never by magnitude.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every band table is written
 * out in prose inside the segment that needs it, and every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U7_COASTAL_RISK_AND_SEA_LEVEL: LessonPlan = {
  id: 'evelyn.ms.m8geo.coastal-risk-and-sea-level.v1',
  title: 'Coastal Risk & Sea-Level Change',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.coastal-risk-and-sea-level',
      standard: 'M8GEO-7.3',
      description:
        'Given a coastal area with elevation bands, population per band and a stated rise or storm-surge height, identify which zones flood, estimate how many people are exposed, and evaluate the three response families -- protect (walls, dunes), accommodate (raised buildings, zoning), retreat (relocation) -- by cost, permanence and who is affected (National Geography Standard 15: how physical systems affect human systems).',
    },
  ],
  prerequisites: ['m8geo.reading-climate-trend-data'],
  followUps: ['m8geo.mitigation-adaptation-and-resilience'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make half a meter of height feel decisive before any band or any plan is named.',
      script:
        'Two houses on the same street, a hundred meters apart. One of them has had water through the front door three times in six years. The other has never had a drop. Same street, same storms, same builder. The only difference anybody can find is that the second house sits about half a meter higher than the first. Half a meter is the height of a kitchen counter. On a coast it is the difference between a normal week and a ruined ground floor. So the question a coastal town actually has to answer is not "will it flood" -- it is "at what height, and how many of us are under that height, and then what". Today you take a town written out in elevation bands, work out exactly which bands go under and how many people that is, and then put a price on the only three things any coastal town can do about it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-water-line-bands-and-three-responses',
      kind: 'concept',
      goal: 'Install the water-line-and-bands counting routine and the three-family test that a stated requirement settles.',
      keyIdeas: [
        'BUILD THE WATER LINE FIRST, AND BUILD IT BY ADDING. The edge of a coast is not a fixed line: the water\'s edge sits wherever the height of the water puts it that day, so the first number you need is that height. It usually arrives in two pieces. One is how far the sea now stands above the line the town measured its heights from. The other is the SURGE -- the extra height a storm pushes onto the shore on top of whatever the sea is already doing. They stack, so you ADD them: a sea standing 0.5 meters high with a 1.5-meter surge on top of it gives a water line of 2.0 meters, not 1.5. Taking the bigger of the two is the most common way this goes wrong, and it goes wrong quietly, because 1.5 meters is a real number that was printed in the forecast. Build the sum before you look at a single population figure.',
        'ELEVATION BANDS ARE A COUNTING TOOL, AND THE RULE IS THE TOP OF THE BAND. A town that wants to count who is in the way does not measure every doorstep; it sorts people into bands by height -- below 1 meter, between 1 and 2 meters, between 2 and 3 meters, above 3 meters -- and counts the bands. The rule that makes the bands usable is this: a band counts as flooded when the water line reaches the TOP of that band. A water line sitting at a band\'s lower edge does not put that band under, because the water has only arrived at its floor. You take a whole band or none of it, and that is the price of counting this way. It is also why the edges of the bands are always stated: without them there is no rule, only an opinion.',
        'THE EXPOSURE IS THE SUM OF THE FLOODED BANDS, AND THE CHECK IS THAT THE REST ADDS BACK. Once the water line is built and the bands are marked, the count is an addition and nothing more: add the populations of every band the water covers. Then invert it. Add the populations of the bands the water does not reach, add that to your answer, and the town total has to come back. If it does not, either a band was double-counted or one was left out, and this is exactly where a band gets silently dropped -- the one nearest the water line, which is the one the whole question turns on.',
        'THE COUNT DOES NOT RISE IN STEP WITH THE WATER. Half a meter of extra water can add almost nobody or almost everybody, and which one it is has nothing to do with the half meter. It depends entirely on how the people sit in the bands. A town whose bands hold 200, 300 and 2,500 people gains 500 at a 2-meter water line and 3,000 at a 3-meter one, which is six times as many for one extra meter, because that meter happened to cover the crowded band. So never scale an exposure by the height of the water and never take a percentage of the old answer. Run the addition again from the bands, every time the water line moves.',
        'THERE ARE THREE FAMILIES OF RESPONSE, AND THEY DO THREE DIFFERENT THINGS TO THE SAME PROBLEM. PROTECT keeps the water out of the zone: a wall along the waterfront, a raised bank of sand held in place by planting. ACCOMMODATE lets the water come and takes the harm out of it: living floors raised above the water line, rules about what may be built inside a band at all. RETREAT takes the people and the buildings out of the band: buying homes in the lowest band and helping those households move to higher ground. They are not three strengths of the same idea, so they cannot be put in an order. Compare them on three different kinds of thing: what they cost, what height each one keeps working up to and for how long, and who is served, who is left out and who pays.',
        'A PLAN IS TESTED AGAINST THE STATED REQUIREMENT BEFORE IT IS TESTED AGAINST THE PRICE. Read the requirement first and make it a test with a number in it: all of these homes dry at a water line of this height. Then take each plan\'s OWN height -- the top of the wall, the height the floors are raised to, the height the relocated households move above -- and the count of homes it actually covers, and run the test. A plan that fails the requirement is out, and being the cheapest does not bring it back. Only among the plans that pass does the price decide. And the requirement is the thing that moves: change it from "dry at 3 meters" to "no water in these streets at all" and the plan that won a moment ago cannot deliver it, while the one that looked extravagant is the only one that can.',
      ],
      vocabulary: [
        {
          term: 'water line',
          definition:
            'the height the water reaches in the event being planned for, found by adding the stated heights together -- how far the sea already stands above the town\'s measuring line, plus the stated surge on top of it.',
        },
        {
          term: 'storm surge',
          definition:
            'the extra height of water a storm pushes onto a shore, counted on top of whatever height the sea is already standing at rather than instead of it.',
        },
        {
          term: 'elevation band',
          definition:
            'a stated range of heights above a town\'s measuring line, with the number of people inside it, used so that who is in the way can be counted by adding whole bands rather than by measuring every home.',
        },
        {
          term: 'protect',
          definition:
            'the family of responses that keeps the water out of a zone, and that therefore stops working at the height the barrier was built to.',
        },
        {
          term: 'accommodate',
          definition:
            'the family of responses that lets the water into a zone and puts what matters above it, or keeps it from being built there in the first place.',
        },
        {
          term: 'retreat',
          definition:
            'the family of responses that removes the homes and people from a band, so that the count in the way goes down rather than the water.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-count-the-bands',
      kind: 'worked_example',
      problem:
        'Run the routine straight through and find how many people are in the way.\n\nSaltmere has 10,000 residents, sorted into bands by how high the ground under their homes stands above the high-tide line the town measured everything from.\n\n"Below 1 meter: 1,200 people. Between 1 and 2 meters: 800 people. Between 2 and 3 meters: 2,400 people. Above 3 meters: 5,600 people."\n\nThe sea now stands 0.5 meters above that measuring line. The storm the town is planning for is forecast to push a surge of 1.5 meters on top of it. How many people are in the flooded bands, and what happens if the surge comes in at 2.5 meters instead?',
      steps: [
        'Step one: build the water line by adding the two stated heights. 0.5 meters plus 1.5 meters is 2.0 meters. WRONG: "The forecast says a 1.5-meter surge, so the water reaches 1.5 meters." CORRECT: "The surge is pushed on top of a sea that already stands 0.5 meters high, so the water reaches 0.5 plus 1.5, which is 2.0 meters."',
        'Step two: mark the bands against 2.0 meters, using the top-of-the-band rule. The band below 1 meter has its top at 1 meter, which is under 2.0, so it floods. The band between 1 and 2 meters has its top at 2 meters, which the water line reaches, so it floods. The band between 2 and 3 meters has its top at 3 meters; the water line is at 2.0, which is that band\'s lower edge, so the water has arrived at its floor and no higher. That band does not count.',
        'Step three: add the flooded bands. 1,200 plus 800 is 2,000 people in the way.',
        'Step four: invert. The bands the water does not reach hold 2,400 plus 5,600, which is 8,000. 2,000 plus 8,000 is 10,000, which is the town total, so no band was dropped and none was counted twice. As a share, 2,000 out of 10,000 is 0.20, or 20 percent of Saltmere; check it the other way, 20 percent of 10,000 is 2,000.',
        'Rewind the input and read the bands backwards before changing anything. 5,600, then 2,400, then 800, then 1,200: 5,600 plus 2,400 is 8,000, plus 800 is 8,800, plus 1,200 is 10,000. The table adds to the town from either end, so nothing was misread.',
        'Now change ONE input. The surge comes in at 2.5 meters instead of 1.5, and everything else stands. The water line is 0.5 plus 2.5, which is 3.0 meters. The band between 2 and 3 meters has its top at 3 meters, and the water line now reaches it, so that band floods too: 1,200 plus 800 plus 2,400 is 4,400 people. Invert: 4,400 plus the 5,600 above 3 meters is 10,000, so the total still closes.',
        'Read what that change did, because it is the point of working in bands. The water line went up by half, from 2.0 meters to 3.0. The count went from 2,000 to 4,400, which is 4,400 divided by 2,000, or 2.2 times as many. One extra meter of water put 2,400 more people in the way, which is more than the first two meters had reached altogether. Nobody moved and nothing was built. The people were simply stacked that way in the bands, and only re-running the addition could have told you.',
      ],
      answer:
        'The water line is 0.5 plus 1.5, which is 2.0 meters. The bands with their tops at or below 2.0 meters are the one below 1 meter and the one between 1 and 2 meters, so the exposure is 1,200 plus 800, which is 2,000 people, or 20 percent of Saltmere; the unflooded bands hold 2,400 plus 5,600, which is 8,000, and 2,000 plus 8,000 recovers the 10,000 town total. With a 2.5-meter surge the water line is 3.0 meters, the band between 2 and 3 meters floods as well, and the count rises to 4,400 -- 2.2 times as many people for a water line only half again as high, because that one extra meter covered the band holding 2,400.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-test-three-plans',
      kind: 'worked_example',
      problem:
        'Saltmere\'s council will pay for exactly one plan for the 2,000 people below 2 meters. Those people live in 800 homes, 400 of them in the band below 1 meter and 400 in the band between 1 and 2 meters. The stated requirement is this: every one of the 800 homes must still be dry if the water line reaches 3 meters, and the council wants that for the least money.\n\n"PROTECT: a wall along the waterfront with its top at 3 meters. $6,000,000 to build, and $100,000 every year to maintain.\n\nACCOMMODATE: raise the living floor of all 800 homes to 3.5 meters. $4,000 for each home.\n\nRETREAT: buy the 400 homes in the band below 1 meter and help those households move to ground above 3 meters. $80,000 for each home."\n\nWhich plan meets the requirement, and what is the honest limit of that verdict?',
      steps: [
        'Price all three first, so the money is a fact rather than an impression. ACCOMMODATE: 800 homes at $4,000 each is $3,200,000; invert, $3,200,000 divided by 800 is $4,000. RETREAT: 400 homes at $80,000 each is $32,000,000; invert, $32,000,000 divided by 400 is $80,000. PROTECT is given as a total of $6,000,000, which across the 800 homes it covers is $6,000,000 divided by 800, or $7,500 for each home; invert, $7,500 times 800 is $6,000,000. Its upkeep runs on: $100,000 a year for twenty years is $2,000,000, so twenty years of wall is $6,000,000 plus $2,000,000, which is $8,000,000.',
        'First clue, which is money. $3,200,000 against $6,000,000 against $32,000,000. Raising the floors is $2,800,000 cheaper than the wall before the wall has been maintained for a single year, and $28,800,000 cheaper than buying the low band out. On price alone, ACCOMMODATE.',
        'Second clue, which is not money at all -- it is a height test against the stated requirement. The requirement is a water line of 3 meters. The wall\'s top is at 3 meters, so the water arrives level with the top of it and the wall is at its limit; behind it, all 800 homes are wet at once. The raised living floors are at 3.5 meters, which is 0.5 meters above the required water line, so all 800 stay dry. Retreat removes 400 homes from the zone, but the 400 homes in the band between 1 and 2 meters were never touched, and 800 minus 400 is 400 homes still standing at their old height and still wet. WRONG: "The wall is the strongest answer, because it is the only plan that keeps the water out." CORRECT: "A wall works up to the height of its top and no further, and the requirement names exactly that height, so the wall fails the test it was bought to pass." On the height test, ACCOMMODATE again.',
        'Third clue, which is a different kind again -- who is served, who is left out and who pays. The wall covers all 800 homes while it holds, and it asks the whole town of 10,000, including the 8,000 people who were never in a flooded band, to find $100,000 every year for as long as it stands. Retreat covers 400 of the 800 and asks those households to leave the place they live, which is a cost that does not appear in the price. Raising covers all 800, asks nobody to move, and has no yearly payment attached. On who is affected, ACCOMMODATE for the third time.',
        'One number is a hunch; three of different kinds, all pointing the same way, is evidence. Money, a height test and a count of who is covered all name the same plan, and no two of them are the same kind of evidence, so the verdict does not rest on any one of them. Saltmere raises the floors: $3,200,000, all 800 homes dry at a 3-meter water line, nobody relocated.',
        'Now the honest limit, because the verdict belongs to the requirement and not to the plan. Change the requirement to "no water in the streets of this zone at all" and re-run the same three tests. Raised floors fail it: the water still runs through the streets and around the houses, and only the living floors are above it. The wall fails it at any water line above 3 meters. Retreat is the only family that can deliver it, and only for the 400 homes it buys, at $32,000,000 -- which is $32,000,000 divided by $3,200,000, or ten times what raising all 800 floors cost. The three families are not better and worse. The requirement decides, and a different requirement decides differently.',
      ],
      answer:
        'ACCOMMODATE meets the requirement. Raising all 800 living floors to 3.5 meters costs 800 times $4,000, which is $3,200,000, and 3.5 meters is above the required 3-meter water line, so every one of the 800 homes stays dry. The wall fails the requirement even though it covers all 800: its top is at 3 meters, exactly the water line named, so it is overtopped. Retreat passes the height test for the homes it buys but covers only 400 of the 800, at 400 times $80,000, which is $32,000,000. Three different kinds of evidence -- price, the height each plan keeps working to, and who is covered and who pays -- all name the same plan. Change the requirement to no water in the streets at all and only retreat can deliver it, at ten times the cost of raising the floors.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-count-the-flooded-bands',
      kind: 'try_yourself',
      problem:
        'Kettlebay sorts its residents by how high the ground under their homes stands above the high-tide line the town measured from.\n\n"Below 1 meter: 900 people. Between 1 and 2 meters: 1,500 people. Between 2 and 3 meters: 600 people."\n\nEveryone else in Kettlebay stands above 3 meters. The sea now stands 0.5 meters above that measuring line, and the storm being planned for is forecast to push a surge of 1.5 meters on top of it. A band counts as flooded when the water reaches the top of it. How many people are in the flooded bands?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3,000 people, counting the band between 2 and 3 meters as well, since the water line arrives at that band' },
        { id: 'b', text: '1,500 people, counting the highest band the water line covers, which is the band between 1 and 2 meters' },
        { id: 'c', text: '900 people, taking the forecast surge of 1.5 meters as the water line and counting the band it covers' },
        { id: 'd', text: '2,400 people, adding the 900 in the band below 1 meter to the 1,500 in the band between 1 and 2 meters', correct: true },
      ],
      expectedAnswer: '2,400 people, adding the 900 in the band below 1 meter to the 1,500 in the band between 1 and 2 meters',
      hints: [
        'Two heights are given and the water reaches the sum of them, not the larger one. Add them first, then ask which bands sit entirely underneath that height.',
        'A band counts only when the water reaches the TOP of it, so a water line that stops at a band\'s lower edge leaves that band out. And every band below the water line counts, not only the highest one that does.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-one-more-meter',
      kind: 'try_yourself',
      problem:
        'Larkhaven is sorted into the same kind of bands.\n\n"Below 1 meter: 200 people. Between 1 and 2 meters: 300 people. Between 2 and 3 meters: 2,500 people."\n\nEveryone else stands above 3 meters. The town first planned for a water line of 2 meters and has now been asked to plan for a water line of 3 meters. What happens to the number of people in the flooded bands?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It goes from 500 to 3,000, six times as many, because the extra meter covers a band of 2,500 people on top of the 500 already there', correct: true },
        { id: 'b', text: 'It goes from 500 to 2,500, because the band between 2 and 3 meters holds 2,500 people and that is the band the extra meter covers' },
        { id: 'c', text: 'It goes from 500 to 750, because the water line rises by half again, from 2 meters to 3, so half again as many people are in the way' },
        { id: 'd', text: 'It goes from 500 to 2,800, because the extra meter covers the band between 2 and 3 meters and the band between 1 and 2 meters as well' },
      ],
      expectedAnswer: 'It goes from 500 to 3,000, six times as many, because the extra meter covers a band of 2,500 people on top of the 500 already there',
      hints: [
        'Do two separate additions. Add the flooded bands at a 2-meter water line, then add the flooded bands again at a 3-meter water line, rather than adjusting the first answer.',
        'Everybody who was in the way at 2 meters is still in the way at 3 meters, so the new total has to include them. And the count follows how many people sit in the band the water newly covers, never the height the water rose by.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-plan-meets-the-requirement',
      kind: 'try_yourself',
      problem:
        'Tolland has 500 homes standing below 2 meters. The council will pay for exactly one plan, it has stated one requirement -- every one of those 500 homes must still be dry if the water line reaches 4 meters -- and it will spend as little as it can while meeting it.\n\n"Plan 1: build a wall along the waterfront with its top at 3 meters. $4,000,000.\n\nPlan 2: raise the living floor of all 500 homes to 4.5 meters. $2,500,000.\n\nPlan 3: buy the 200 homes standing below 1 meter and help those households move to higher ground outside the zone. $16,000,000."\n\nWhich plan meets the stated requirement?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Plan 1, because a wall keeps the water out of the whole zone at once and so is the only plan that covers all 500 homes rather than a part of them' },
        { id: 'b', text: 'Plan 2, because living floors raised to 4.5 meters sit above the required 4-meter water line, all 500 homes are raised, and it costs the least', correct: true },
        { id: 'c', text: 'None of the three, because once a water line passes the height a home was built at there is nothing a town can do to keep that home dry' },
        { id: 'd', text: 'Plan 3, because moving households out of the zone is the only permanent answer and water can never reach a home that is no longer there' },
      ],
      expectedAnswer: 'Plan 2, because living floors raised to 4.5 meters sit above the required 4-meter water line, all 500 homes are raised, and it costs the least',
      hints: [
        'The requirement is a height test with a number in it: a water line of 4 meters. Put each plan\'s own height next to that 4 meters before you look at any price.',
        'A wall stops working at the height of its top, and a plan that removes some of the homes leaves the rest exactly where they were. Price only decides between the plans that pass the test.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-surge-alone-and-cheapest-wins',
      kind: 'misconception_check',
      question:
        'A student works on the Saltmere data -- bands of 1,200, 800, 2,400 and 5,600 people, a sea standing 0.5 meters above the measuring line, a forecast surge of 1.5 meters -- and writes: "The forecast says 1.5 meters, so the water reaches 1.5 meters." Later, looking at the three plans, the student writes: "Raising the floors costs $3,200,000 and the wall costs $6,000,000, so raising the floors is the better plan, and it always will be." What is wrong with each?',
      commonErrors: [
        {
          answer: 'The forecast says a 1.5-meter surge, so the water reaches 1.5 meters.',
          misconception:
            'Taking one of the two stated heights as the whole water line, because the surge is the number the forecast talks about, and treating the height the sea already stands at as background rather than as part of the sum.',
          correctsTo:
            'A surge is pushed on top of whatever height the sea is already standing at, so the two heights stack and you add them: 0.5 meters plus 1.5 meters is a water line of 2.0 meters. At 1.5 meters only the band below 1 meter has its top under the water, which is 1,200 people. At 2.0 meters the band between 1 and 2 meters has its top reached as well, so the count is 1,200 plus 800, which is 2,000. The slip leaves 800 people out of the plan, and the check catches it: 2,000 plus the 2,400 and 5,600 above the line is 10,000, the whole of Saltmere, while 1,200 plus 2,400 plus 5,600 is only 9,200 and the town does not come back. WRONG: "The surge is the water line." CORRECT: "The water line is the sea plus the surge, and the bands are marked against that sum."',
        },
        {
          answer: 'Raising the floors is cheaper than the wall, so it is the better plan, and it always will be.',
          misconception:
            'Ranking the three families by price as though they were three strengths of one idea, instead of testing each of them against the stated requirement first and asking who each one leaves out.',
          correctsTo:
            'Price decides only among the plans that pass the requirement, and it never makes a family better in general. Saltmere\'s requirement was all 800 homes dry at a 3-meter water line: the raised floors sit at 3.5 meters and pass, the wall\'s top is at 3 meters and is level with the water line, so it fails, and buying out the low band passes for the 400 homes it covers but leaves 400 homes untouched. The price was the third reason to choose raising the floors, not the first. Now change the requirement to no water in the streets of the zone at all: raised floors cannot deliver it, because the water still runs through the streets below them, and only buying the homes out can, at 400 times $80,000, which is $32,000,000, or ten times the $3,200,000. WRONG: "The cheapest plan is the better plan." CORRECT: "Test every plan against the stated requirement first; the cheapest of the plans that pass is the answer, and a new requirement can hand it to a different family."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Build the water line before anything else, and build it by adding: the height the sea already stands at plus the stated surge. 0.5 plus 1.5 is 2.0 meters, not 1.5.',
        'A band counts as flooded when the water line reaches the TOP of it. A water line sitting at a band\'s lower edge leaves that band out.',
        'The exposure is the sum of the flooded bands. Invert it every time: add the bands the water does not reach and the town total has to come back.',
        'The count does not rise in step with the water. One extra meter can add more people than the first two meters did, because it depends on how the people sit in the bands, so re-run the addition instead of scaling the old answer.',
        'Three families of response: PROTECT keeps the water out, ACCOMMODATE lets it in and puts what matters above it, RETREAT takes the homes and people out of the band. They are three different things, not three strengths of one thing.',
        'Compare the families on three different kinds of thing: what it costs, the height it keeps working up to and for how long, and who is served, who is left out and who pays.',
        'Test every plan against the stated requirement before you look at the price. A wall works only up to the height of its top, and a plan that buys out one band leaves the other bands where they are.',
        'The requirement decides, not the family. Change the requirement and the winning plan changes with it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.3', cedTitle: 'Coastal Risk & Sea-Level Change' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
