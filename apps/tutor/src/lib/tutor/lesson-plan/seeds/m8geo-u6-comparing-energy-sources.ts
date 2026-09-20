/**
 * Grade 8 World Geography — Resources, Energy & Sustainability: Comparing
 * Energy Sources.
 *
 * PROCEDURE-LED row (National Geography Standard 16), shaped on the
 * procedure-led exemplar `m8geo-u1-counts-rates-and-fair-comparison.ts`: the
 * concept segment is an ordered routine run over a described table rather than
 * a mental model, the first worked example runs the routine straight through
 * and prices the result, and the second runs the same two candidates against
 * two different places so the winner comes out opposite in each.
 *
 * THE ROUTINE, in the order it is always run:
 *   1. Read the GOAL and split it into must-haves and the criteria the
 *      survivors are compared on.
 *   2. Cross out every source the PLACE cannot host, and name the place-fact
 *      that did the crossing. This happens before any scoring.
 *   3. Turn a rating into the average the plan is actually sized by, with the
 *      digits shown.
 *   4. Ask what runs on the calm day. A weather-dependent source is compared
 *      as part of a mix, and the backup is sized by the worst day.
 *   5. Price the mix across a day on the criterion the goal named, then invert
 *      the arithmetic.
 *   Then change ONE input -- the goal, or one fact about the place -- and run
 *   it again.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause inside keyIdea 1, that sources
 * sort into the ones that replace themselves and the ones that do not (Grade 7,
 * `m7geo-u5-resources-and-economic-activity.ts`), and re-teaches it nowhere:
 * the words "renewable" and "nonrenewable" appear in no authored string in this
 * file, no keyIdea sorts a source into either group, and the one clause that
 * names the sort is there only to say that the sort does NOT settle this
 * question. It likewise assumes and never re-teaches that work sorts into
 * primary through quaternary activity (same Grade 7 seed): no segment
 * classifies any job. It ADDS gating candidates on a place's siting facts
 * before anything is scored, converting a rated output into the average a plan
 * is sized by with the division shown, comparing a weather-dependent source
 * only as part of a mix and sizing its backup by the worst day rather than the
 * average one, pricing that mix across a day and inverting the arithmetic, and
 * naming the single column and the single place-fact that flips the winner when
 * the place or the goal changes. It STOPS SHORT of the physics of energy
 * conversion (Grade 8 Science `m8sci` row 4.3
 * `energy-transformations-and-conservation` -- nothing here says what happens
 * inside a turbine, a panel or a burner) and of energy policy of every kind: no
 * tax, subsidy, target, agreement or political position appears, and no real
 * country's energy mix is named or evaluated. It carries the word "emissions"
 * as one of the five columns the signed scope cell names -- as a column a goal
 * can put in charge, and as a trade-off the winner may carry -- but it names no
 * gas, attaches no figure to that column, and states NO mechanism by which
 * anything holds heat -- that
 * paragraph belongs to row 7.2 `reading-climate-trend-data` by the 2026-09-03
 * ruling. Against its Grade 8 neighbors: it does NOT compute whether demand
 * exceeds supply in a basin, distinguish physical from economic scarcity, or
 * evaluate an allocation rule by who bears a shortage (row 6.1
 * `water-scarcity-and-allocation`); it does NOT compute a footprint balance or
 * test an overshoot claim (row 6.3
 * `carrying-capacity-and-ecological-footprint`); it does NOT compare farming
 * systems or evaluate food security (row 6.4 `food-systems-and-food-security`).
 * Three things ARE deliberately allowed, because neighboring rows sit close and
 * the line has to be drawn rather than avoided:
 *   (a) a must-have step that eliminates a candidate before comparison, which
 *       looks like row 2.3 `site-selection-with-weighted-criteria`. It is
 *       allowed because 2.3 eliminates SITES and then SCORES the survivors with
 *       WEIGHTS; this row eliminates SOURCES on one named column of the energy
 *       table and assigns no weight and no score to anything anywhere -- the
 *       words "weight", "weighted", "score" and "scored" appear in no authored
 *       string in this file, and the one distractor that proposes re-ordering
 *       the columns by priority is keyed wrong.
 *   (b) dividing a count by a denominator (hectares by megawatts, megawatt-hours
 *       by hours), which is the routine row 1.1
 *       `counts-rates-and-fair-comparison` owns. It is allowed because the
 *       denominator here is never in question and is never chosen from a claim:
 *       it is fixed by the column the table already prints, and no sentence in
 *       this file asks which denominator a claim needs.
 *   (c) an arithmetic inversion in the concept, in both worked examples, in the
 *       misconception check and in the recap, which is house style for this
 *       course; and the rating-versus-average gap worked with digits in four
 *       places, each with its own set of numbers -- 27 and 9 in keyIdea 3, 45
 *       and 15 in worked example 1, 30 and 10 in try_yourself 1, 72 and 24 in
 *       the misconception check -- and restated in the recap with worked
 *       example 1's numbers, because it is the single most common wrong step in
 *       this comparison and one statement of it does not hold.
 * The scope cell carries all three parts (positive statement, lineage clause,
 * withheld clause); none is missing.
 *
 * BURNED BY RULING 32: `los[0].description` is student-facing and names the
 * five criteria columns -- fuel cost, whether output varies with weather,
 * emissions, land needed, whether the source must be near a particular
 * resource. Those are the framework, not specimens, and the cell names no
 * concrete place, source or figure, so nothing concrete is burned and all three
 * items are built on fresh invented towns. A later editor should still not
 * write an item whose answer is "the five columns are fuel cost, ...", because
 * the objective prints them.
 *
 * DEPTH FLOOR NOTE FOR THE FAN-OUT: the Grade 7 seed this row deepens teaches
 * what a resource is, sorts resources into two groups and sorts work into four
 * levels. Read the six keyIdeas below and notice that not one of them sorts
 * anything into a group: every one says what you DO with a table of sources --
 * split a goal, cross out on a gate, divide a rating into an average, price a
 * mix, invert, name the column that flipped. The test used on this file: the
 * Grade 7 keyIdeas were read next to these six, and the closest pair was
 * keyIdea 1 here against Grade 7's "renewable does not mean unlimited".
 * KeyIdea 1 survived because its whole sentence about the sort is that the sort
 * does not decide the question -- it spends the premise rather than teaching
 * it. Nothing in this file states the rate idea that Grade 7 row owns.
 *
 * ACCURACY NOTE: every town, valley, ridge, river and figure in this file is
 * invented, and no real place carries a number or a name anywhere. The claims
 * about the real world are confined to properties of the sources themselves,
 * all of them physical and long-settled: wind and sunlight vary with the
 * weather; a hydro plant needs a river with a fall and a flow; a solar array
 * produces least where and when daylight is shortest; a coal or oil plant has
 * fuel that has to be bought and brought to it, by seam, rail, pipeline or
 * port, and puts out emissions on every day it runs. No gas is named and no
 * emissions figure is given anywhere in the file. No source is
 * called good or bad, no place is called ahead or behind, and the file says so
 * out loud in keyIdea 6 and in the recap.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped Grade
 * 7 Geography bank the keyed answer was the strictly longest choice 67% of the
 * time, and 94% at difficulty 4; chance with four choices is 25%). The per-item
 * discipline is the point: every distractor states the full wrong STEP that
 * produces it -- the rating read as the delivery, the demand read as the
 * supply, an output rate copied across as a day's total, a re-ordering of the
 * columns offered as the repair for a candidate that was never eligible, a
 * rating gap offered as a reason a zero fuel bill is not zero, a place
 * difference read as a difference of opinion -- and no key was built to be the
 * longest choice BECAUSE it is the key. Item 3 was revised after a blind-answer
 * read: its key opens "Both councils are right", which a student could have
 * picked off the shape alone, so a second choice now opens the same way and is
 * wrong for a nameable reason. Measured as a diagnostic, not as a score: the key is the
 * strictly longest choice in 1 of the 3 items. Zero is not the target; the real
 * measurement is the 120-item course rate taken at registration, and about a
 * quarter is where it should land. The three keys sit at ids c, d and b, which
 * is the id set `(6 + 2) mod 4 = 0` requires, omitting a. Item 1's four choices
 * are four numbers sharing one unit clause, ordered by the id rule and never by
 * magnitude.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every table is written out in
 * prose inside the segment that needs it, and every item is solvable from the
 * words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U6_COMPARING_ENERGY_SOURCES: LessonPlan = {
  id: 'evelyn.ms.m8geo.comparing-energy-sources.v1',
  title: 'Comparing Energy Sources',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.comparing-energy-sources',
      standard: 'M8GEO-6.2',
      description:
        'Given a table comparing energy sources (fuel cost, whether output varies with weather, emissions, land needed, whether the source must be near a particular resource), evaluate which mix suits a place with a stated goal, and explain why the best source for one place fails another (National Geography Standard 16: the changes that occur in the meaning, use, distribution and importance of resources).',
    },
  ],
  prerequisites: ['m8geo.water-scarcity-and-allocation'],
  followUps: ['m8geo.carrying-capacity-and-ecological-footprint'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put two towns with the identical table and opposite answers in front of the student, so the need for a place and a goal arrives before any column is named.',
      script:
        'Two towns forty kilometers apart, same year, same price list. One builds a wind array on the ridge above it. The other reads the identical table and builds nothing of the kind -- it puts a small plant on the river instead. Neither town got the table wrong. If you have played a strategy game where you pick a power plant off a menu, you know the version of this where one option is simply the best one and you take it every time. Real places do not get that menu. The table of sources is the same everywhere; what changes is the goal the place has set and what the place physically is -- whether the wind blows there, whether the river falls, how much flat land is left, whether fuel can even be delivered. Today you run a table of sources against one place and one goal, say exactly which fact made the winner win, and then change one fact and watch the winner change.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-goal-place-gate-mix',
      kind: 'concept',
      goal: 'Install the routine: split the goal, gate on the place, turn a rating into an average, compare mixes rather than single sources, price the mix and invert.',
      keyIdeas: [
        'A TABLE OF SOURCES HAS NO WINNER UNTIL A GOAL AND A PLACE ARE ATTACHED TO IT. Sources sort into the ones that replace themselves and the ones that do not, and that sort does not settle this question -- two towns holding the same table and the same sort pick differently, and neither is mistaken. So read the goal first and split it into two lists. The MUST-HAVES are the things a source either satisfies or is out of the comparison: a goal of "supply the town every hour of the year" makes steadiness a must-have. The rest are the criteria the survivors are compared on: with that must-have settled, cost decides among what is left. Change the goal to "cut what we send up the chimney" and the emissions column takes charge while fuel cost drops to a tiebreaker. Same five columns, two different winners.',
        'CROSS OUT WHAT THE PLACE CANNOT HOST BEFORE YOU COMPARE ANYTHING. One of the five columns asks whether the source has to sit near a particular thing: a river with enough fall and a steady flow, hot rock close to the surface, a ridge where the wind blows hard most of the time, a basin with many clear days, a seam of fuel or a rail line, pipeline or port that can bring fuel in. That column is a gate, not a preference. A source that comes out ahead on every other column and cannot be built in that place comes out at nothing there, and a comparison that leaves it in the list is holding a real option up against something that is not one. Do the crossing-out first, and name the place-fact that did it: "no fall in the river" is an answer, and "the hydro plant came out low" is not.',
        'A RATING IS A CEILING; SIZE THE PLAN BY THE AVERAGE. The number on the brochure is what a source puts out when conditions are at their best. What a plan can count on is the average it delivers across a whole year. An array rated at 27 megawatts that averages 9 megawatts across the year delivers one third of its rating: 9 divided by 27 is one third, and one third of 27 is 9, so the check closes. Turn that average into the figure a day is built from by multiplying by the hours in a day: 9 megawatts times 24 hours is 216 megawatt-hours. Putting the rating where the average belongs -- 27 times 24, which is 648 -- overstates the source by exactly the gap between the two numbers, and it is the most common wrong step in this whole comparison.',
        'A SOURCE WHOSE OUTPUT VARIES WITH THE WEATHER IS COMPARED AS PART OF A MIX, NEVER ON ITS OWN. An average across a year is not a promise about any particular day. On a calm, cloudy day a weather-dependent source delivers close to nothing, and the demand does not drop to nothing alongside it, so something else has to run. That something is part of the candidate, not a separate question: the honest comparison sets the variable source PLUS its backup against a source that runs steadily on its own, because only those two things do the same job. And the backup is sized by the worst day rather than the average one. It has to be able to carry the whole demand by itself, even if it spends most of the year carrying a quarter of it.',
        'PRICE THE MIX ACROSS A WHOLE DAY, WITH THE DIGITS, AND THEN INVERT. Take what the day needs, subtract what the variable source supplies on an average day, and the remainder is what the fuel-burning part has to make. A town drawing 12 megawatts every hour needs 12 times 24, which is 288 megawatt-hours a day. If the variable source supplies 180 of those, the remainder is 288 minus 180, which is 108. At $150 for each megawatt-hour that is 108 times 150, or $16,200 on an average day, against 288 times 150, which is $43,200, on a day the variable source is out entirely. Then invert: $16,200 divided by $150 is 108 megawatt-hours, and 108 plus 180 is 288, which is the day you started from. If the day does not come back, a zero slipped.',
        'NAME THE TRADE-OFF THE WINNER CARRIES, AND CHECK WHAT THE TABLE LEFT OUT. A verdict that names only the winner is half an answer. The full verdict names the column the winner loses on and says what the plan does about it: the array that buys no fuel needs land and needs a backup; the plant that runs whenever it is called buys fuel on every day it runs and puts out emissions while it does. If one source appears to come out ahead on every column at once, that is the moment to ask whether a column that matters in this place was left out of the table. And the verdict is about the fit between a source and a place, never about the place: a town that burns fuel because nothing else can reach it is not behind anything, it is a town whose siting column came out the way it did.',
      ],
      vocabulary: [
        {
          term: 'energy mix',
          definition:
            'the set of sources a place runs together, chosen so that what one of them does not supply in a given hour, another one does.',
        },
        {
          term: 'rated output',
          definition:
            'what a source puts out when conditions are at their best, which is a ceiling on its output and never the figure a plan is sized by.',
        },
        {
          term: 'average output',
          definition:
            'what a source delivers across a whole year once its good and its bad days are counted together, found by spreading the year evenly; this is the figure a plan is sized by.',
        },
        {
          term: 'variable source',
          definition:
            'a source whose output rises and falls with the weather, so that what it delivers on any one day is not something a plan can count on.',
        },
        {
          term: 'steady source',
          definition:
            'a source that can be run at a chosen level whenever it is called for, which is what lets it cover the hours a variable source is out.',
        },
        {
          term: 'siting requirement',
          definition:
            'a condition a source has to find already present in a place before it can be built there at all, which removes a candidate from a comparison rather than lowering it in one.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-routine-on-carron',
      kind: 'worked_example',
      problem:
        'Run the routine straight through, then price what it leaves you with.\n\nCarron is a town on a high, dry plateau. The ridge above it is windy on most days of the year. No river within reach of the town has any fall in it, there is no hot rock near the surface, and the nearest fuel pipeline ends 300 kilometers away, though a road reaches the town. Carron draws 20 megawatts of electricity at every hour of the day and night, all year round.\n\nThe council has three candidates.\n\n"Wind array on the ridge: rated 45 megawatts, averages 15 megawatts across a year, no fuel to buy.\n\nOil-burning generator set: runs at any level up to 20 megawatts whenever it is called for, fuel delivered by road at $180 for each megawatt-hour.\n\nSmall hydro plant: runs steadily, no fuel to buy, needs a river with a fall and a steady flow."\n\nThe goal: keep Carron supplied every hour of the year, and hold the fuel bill as low as that goal allows.',
      steps: [
        'Step one: read the goal and split it. "Every hour of the year" is a must-have, and it is a hard one: a candidate has to be able to supply Carron on its worst day, not only on an average one. "Hold the fuel bill as low as that goal allows" is the criterion the survivors are compared on. Nothing else is being compared here, and saying that out loud keeps the emissions and land columns from quietly taking over a decision the council did not ask them to make.',
        'Step two: cross out what the plateau cannot host. The hydro plant needs a river with a fall and a steady flow, and no river within reach of Carron has any fall at all. It is out. The place-fact that put it out is "no fall in the river", not a poor showing on cost. Two candidates remain, and neither the wind array nor the generator set has a siting requirement Carron fails: the ridge is windy and a road reaches the town.',
        'Step three: turn the rating into the figure the plan is built from. WRONG: "The array is rated at 45 megawatts and the town draws 20, so wind alone covers Carron twice over." CORRECT: the rating is what the ridge delivers when the wind is at its strongest. Across a year the array averages 15 megawatts. 15 divided by 45 is one third, and one third of 45 is 15, so the check closes. The wrong step is worth pricing so you can recognize it later: 45 times 24 hours is 1,080 megawatt-hours, which is more than double what Carron uses in a day, and it would tell the council to build no generators at all.',
        'Step four: work the average day. Carron draws 20 megawatts every hour, so a day takes 20 times 24, which is 480 megawatt-hours. The array supplies 15 times 24, which is 360 of them. The generator set makes up the rest: 480 minus 360 is 120 megawatt-hours.',
        'Step five: apply the must-have, which the average day hides. On a calm day the array delivers close to nothing and Carron still needs its 480 megawatt-hours. So the array cannot meet the goal on its own, and the generator set is not a rival candidate -- it is part of the same one. It also has to be sized at the full 20 megawatts, even though on an average day it supplies only 120 of the 480, which is 120 divided by 480, or one quarter. Check: one quarter of 480 is 120. A backup is sized by the worst day.',
        'Step six: price the mix on the criterion the goal named. At $180 for each megawatt-hour, an average day costs 120 times 180, which is $21,600. A day with no wind at all costs 480 times 180, which is $86,400. Generators on their own would cost that $86,400 every day of the year; the array takes 360 megawatt-hours a day off the bill, and 360 times 180 is $64,800, which is exactly $86,400 minus $21,600.',
        'Step seven: invert, then rewind the input. $21,600 divided by $180 is 120 megawatt-hours; 120 plus 360 is 480; 480 divided by 24 is 20 megawatts, which is the demand the problem started from, so nothing slipped. Now read the data backwards and confirm the verdict follows from it: no fall in the river, a ridge windy most days, 45 rated against 15 averaged, $180 a megawatt-hour by road, 20 megawatts wanted every hour. A town with a windy ridge, no river and expensive delivered fuel is exactly the place where a mix of array and generators beats generators alone, and where the array alone cannot be trusted with an every-hour goal.',
        'Now change ONE input and run it again. Suppose a survey finds that a stream reaching Carron drops 50 meters through a gorge just above the town and runs all year. The hydro row is no longer crossed out. It runs steadily, so it satisfies the must-have by itself, and it buys no fuel, so on the criterion the goal named it comes out at $0 a day against $21,600 for the array-and-generator mix. Nothing about the wind changed. Nothing about the price of fuel changed. One column changed -- the one that asks what the place has -- and the answer changed completely. That column is why two towns holding the same table build different things.',
      ],
      answer:
        'The hydro plant is crossed out before anything is compared, because no river within reach of Carron has a fall. The rating is not the plan figure: the array averages 15 of its 45 megawatts, which is one third, so it supplies 15 times 24, or 360, of the 480 megawatt-hours Carron uses in a day (20 times 24). The generator set makes the other 120, at 120 times $180, which is $21,600 on an average day; on a day with no wind it makes all 480, at $86,400. The array cannot meet the goal alone, because the goal is every hour and a calm day delivers close to nothing, so the answer is the mix, with the generator set sized at the full 20 megawatts. If a survey found a stream with a 50-meter fall, the hydro row would come back into the comparison, meet the must-have by itself and take the fuel bill to $0 -- one column about the place, and a different answer.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-same-table-two-places',
      kind: 'worked_example',
      problem:
        'Two towns are handed the same two candidates and the same goal. Say what each town should build, and name the fact that decides it in each place.\n\n"Delmar: a wide coastal plain with many clear days, and more flat land for sale at the edge of town than any plan would need. The river that crosses the plain drops 3 meters over its whole length.\n\nThornvale: a narrow valley in the far north. The valley floor is the only flat ground, and 12 hectares of it are not already built on. Winter days there are short, and the town draws its heaviest load in those months. A river drops 60 meters through the valley and runs all year."\n\nBoth councils set the same goal: supply the town every hour of the year without buying fuel.\n\n"Solar array: no fuel to buy, output varies with the weather and with the season, needs 2 hectares of flat land for each megawatt of rating. The plan calls for 30 megawatts of rating.\n\nSmall hydro plant: no fuel to buy, runs steadily as long as the river runs, needs a river with a fall and a steady flow, needs under 1 hectare."',
      steps: [
        'Run the gate column in each town first, before any arithmetic. Thornvale: a river dropping 60 meters through the valley and running all year is a fall and a steady flow, so the hydro row passes in Thornvale. Delmar: a river that drops 3 meters over its whole length has no fall to work with, so the hydro row is crossed out in Delmar. Same candidate, opposite result, and the reason is a fact about the place rather than anything about the plant.',
        'Run the land arithmetic for the solar array in each town. The plan calls for 30 megawatts of rating and the array needs 2 hectares for each megawatt, so it needs 30 times 2, which is 60 hectares. Delmar has far more flat land than that at the edge of town, so the array fits there. Thornvale has 12 hectares of unbuilt flat ground: 12 divided by 2 is 6 megawatts of rating, and that is all that will fit. Check the division: 6 times 2 is 12 hectares. Six megawatts against the 30 the plan calls for is one fifth of it, because 6 divided by 30 is one fifth, and one fifth of 30 is 6.',
        'Deliver Delmar\'s verdict. Delmar\'s hydro row is out on the gate, the solar row fits on land with room to spare, the plain has many clear days, and the goal forbids buying fuel, which removes every burning candidate. Delmar builds the array -- not because a solar array is the better source, but because it is the only candidate Delmar can host that meets the goal it was given.',
        'Now check Thornvale\'s verdict, and take three pieces of evidence of three different kinds, because any one of them alone would only be a hunch. First, an arithmetic clue: the land allows 6 megawatts of rating against the 30 the plan needs, which is one fifth of it. Second, a seasonal clue of a different kind: Thornvale\'s shortest days fall in the months the town draws its heaviest load, so the array would be weakest exactly when it is needed most -- a shortfall the land arithmetic says nothing about. Third, a clue of a third kind, from the gate column: the 60-meter fall passes, and a plant on that river runs steadily whatever the sky is doing, which is what an every-hour goal asks for. One number is a hunch; three of different kinds, all pointing the same way, is evidence. Thornvale builds the hydro plant.',
        'Name the lesson in one line. Not one column of the table changed between the two towns, and not one number in the two candidate rows changed either. What changed was the place: Delmar failed the fall, Thornvale failed the land and the season, and each town\'s best source is the other town\'s worst one.',
        'Say what neither verdict means, because this is where a comparison turns into a ranking if nobody stops it. Neither town is ahead of the other and neither source is the better source. A source is a fit or a misfit for one stated goal in one stated place. And the winner carries a trade-off in both towns: Delmar\'s array takes 60 hectares out of other use and delivers less through a cloudy week, and Thornvale\'s plant rests on a single river, so a year that leaves the river low leaves the town short.',
      ],
      answer:
        'Delmar builds the solar array and Thornvale builds the hydro plant. Delmar\'s river drops 3 meters over its whole length, so the hydro row is crossed out there on the siting column, while Delmar\'s flat land easily holds the 60 hectares a 30-megawatt array needs (30 times 2). Thornvale\'s river drops 60 meters and runs all year, so the hydro row passes there, while Thornvale\'s 12 hectares of unbuilt flat ground hold only 12 divided by 2, which is 6 megawatts of rating -- one fifth of the plan -- and the town\'s shortest days fall in its heaviest months. Nothing in the candidate rows changed between the two towns; the places did, and each town failed a different column.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-rating-versus-average',
      kind: 'try_yourself',
      problem:
        'Gilling draws 6 megawatts of electricity at every hour. A wind array on the ridge above the town is rated at 30 megawatts and delivers an average of 10 megawatts across a year. How much electricity does the array supply on an average day?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '720 megawatt-hours' },
        { id: 'b', text: '144 megawatt-hours' },
        { id: 'c', text: '240 megawatt-hours', correct: true },
        { id: 'd', text: '10 megawatt-hours' },
      ],
      expectedAnswer: '240 megawatt-hours',
      hints: [
        'A rating is what the ridge delivers when the wind is at its strongest, and a day has 24 hours in it. Decide which of the two megawatt figures a day of supply is built from before you multiply anything.',
        'Multiply the average output in megawatts by 24, then divide your answer back by 24 to confirm the average returns. Using the 30-megawatt rating in place of the average, using the 6 megawatts the town draws in place of what the array makes, and copying an output in megawatts straight across as though it were a day of megawatt-hours are the three ways this goes wrong.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-siting-gate',
      kind: 'try_yourself',
      problem:
        'Halloway sits on a flat coastal marsh. The air there is still for most of the year and the sky is cloudy for most of it as well, no river within reach has any fall in it, and there is no hot rock near the surface. What Halloway does have is a deep-water port that a fuel ship can reach. The council\'s goal is electricity every hour of the year, at the lowest fuel bill that goal allows. A planner compares every source on the table for fuel cost, emissions and land, and reports that the wind array comes out first. What is wrong with the report?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nothing is wrong. A wind array buys no fuel at all and puts out no emissions while it runs, so on a table compared for fuel cost and emissions it is bound to come out first.' },
        { id: 'b', text: 'The comparison used the wrong priorities. In a town built on a marsh the land column matters more than the fuel-cost column, and putting the columns in that order would bring a different source out on top.' },
        { id: 'c', text: 'The comparison used the wrong output figure. The array was compared using the megawatts it is rated at rather than the megawatts it averages, and correcting that figure would move it down the list.' },
        { id: 'd', text: 'The array was never an option. A source that needs steady wind cannot be built where the air is still, so it fails Halloway\'s siting column and belongs crossed off the list rather than anywhere on it.', correct: true },
      ],
      expectedAnswer: 'The array was never an option. A source that needs steady wind cannot be built where the air is still, so it fails Halloway\'s siting column and belongs crossed off the list rather than anywhere on it.',
      hints: [
        'One of the columns is not a comparison at all: it asks whether the source can be built in that place. Find the sentences in the description of Halloway that answer it, and check that column before reading any of the others.',
        'Re-ordering the columns, correcting the output figure and arguing about emissions are three repairs to a comparison that should never have contained this candidate in the first place. A column a place fails outright removes a source; it does not move it down.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-places-one-goal',
      kind: 'try_yourself',
      problem:
        'Kelby sits directly on top of a coal seam, with a rail line running out of the town. The air above Kelby is still, its river has no fall, and its skies are cloudy most of the year. Larrow sits on a windy headland 600 kilometers from the nearest coal seam, with no rail line, no pipeline and no port. Both councils are handed the same table of sources, and both set the same goal: the lowest fuel bill. Kelby\'s council picks the coal-burning plant and Larrow\'s council picks the wind array. A student says one of the two councils has to have read the table wrong, because one goal and one table cannot give two answers. Which statement does the data support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The student is right. One goal compared against one table has exactly one best source, so whichever of the two councils read the fuel-cost column wrongly is the one that has picked the wrong plant for its town.' },
        { id: 'b', text: 'Both councils are right. Fuel cost is not a property of a source on its own: Kelby sits on the seam it would burn, while no rail line, pipeline or port reaches Larrow, so the same column picks a different source in each place.', correct: true },
        { id: 'c', text: 'Both councils are right, because a goal as loose as the lowest fuel bill is a matter of judgment in the end, and two councils reading one table are each entitled to settle a judgment their own way.' },
        { id: 'd', text: 'Larrow\'s council is wrong. A wind array delivers well under the megawatts it is rated at, so the array saves less than the council believes and the fuel-cost column still goes to the coal-burning plant.' },
      ],
      expectedAnswer: 'Both councils are right. Fuel cost is not a property of a source on its own: Kelby sits on the seam it would burn, while no rail line, pipeline or port reaches Larrow, so the same column picks a different source in each place.',
      hints: [
        'Before deciding which council misread something, check whether the two towns bring the same facts to the table. Read what each town sits on and what can reach it.',
        'A column can come out differently in two places without either reading being wrong, and without the answer being a matter of opinion. A slip in the arithmetic, a difference of judgment, and the gap between a rating and an average are three explanations that all look past the one thing the two descriptions do not share: what each town sits on, and what can reach it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rating-as-delivery-and-portable-winner',
      kind: 'misconception_check',
      question:
        'A student writes about one town: "Mossen has a wind array rated at 72 megawatts and the town only draws 18, so the array covers Mossen four times over and the town can shut its generators down for good." Then, about a second town: "Norbeck should build a hydro plant, because the town across the ridge built one and it came out best on every column of the table." What is wrong with each sentence?',
      commonErrors: [
        {
          answer: 'The array is rated at 72 megawatts and Mossen draws 18, so it covers the town four times over and the generators can be shut down for good.',
          misconception:
            'Reading a rating as a delivery. The rating is what the array puts out when the wind is at its strongest, so a plan that treats it as what the array puts out is counting electricity that only arrives on the best days. The arithmetic inside the sentence is not the problem: 72 divided by 18 really is 4, and that is exactly what makes the sentence convincing.',
          correctsTo:
            'Size the plan by the average, then size the backup by the worst day. Mossen\'s array averages 24 megawatts across the year: 24 divided by 72 is one third, and one third of 72 is 24, so the check closes. On an average day that is 24 times 24, which is 576 megawatt-hours, against the town\'s 18 times 24, which is 432 -- more than enough on an average day, and the sentence is still wrong. On a calm day the array delivers close to nothing and Mossen still needs its 432 megawatt-hours. WRONG: "Rated at four times the demand, so the generators can go." CORRECT: "The average says the array carries most of the year; the calm day says the generators stay, and they stay sized at the full 18 megawatts, because a backup is sized by the worst day and not by the average one."',
        },
        {
          answer: 'Norbeck should build a hydro plant, because the town across the ridge built one and it came out best on every column.',
          misconception:
            'Treating the result of one place\'s comparison as a property of the source. A table of sources has no winner until a place and a goal are attached to it, so a ranking belongs to the comparison it came out of and does not travel across the ridge with the plant.',
          correctsTo:
            'Run the siting column for Norbeck before anything is compared. The valley across the ridge has a river that drops 90 meters through it and runs all year. The river at Norbeck drops 4 meters across the whole 30 kilometers it takes to cross the plain, so a plant that needs a fall has nothing there to work with. The hydro row is crossed out of Norbeck\'s comparison rather than placed at the top of it. WRONG: "It came out best over the ridge, so it comes out best here." CORRECT: "Cross out what Norbeck cannot host, then compare what is left against Norbeck\'s own goal -- and if that goal is not the same goal the neighboring town set, expect a different winner even among the sources both towns could build."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Read the goal and the place first. A table of energy sources has no winner until a goal and a place are attached to it, and the same table gives different winners in different places.',
        'The column asking whether a source must sit near a particular thing is a gate, not a preference. Cross out what the place cannot host before anything is compared, and name the place-fact that did the crossing.',
        'A rating is what a source puts out at its best. Size the plan by the average: an array rated at 45 megawatts that averages 15 delivers one third of its rating, and 15 times 24 hours is 360 megawatt-hours on an average day.',
        'A source whose output varies with the weather is compared as part of a mix, never on its own, because something has to run on the calm day. Size that something by the worst day, not by the average one.',
        'Price the mix, not the source. On an average day 360 of Carron\'s 480 megawatt-hours came from the wind and 120 from the generators, and 120 times $180 is $21,600, against 480 times $180, which is $86,400, on a day with no wind at all.',
        'Invert every figure once: divide the bill back by the price to recover the megawatt-hours, and add the parts back to recover the day.',
        'Name the trade-off the winner carries. Sources are not good or bad and places are not ahead or behind -- a source is a fit or a misfit for one stated goal in one stated place, and changing one fact about the goal or the place can change the answer.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.2', cedTitle: 'Comparing Energy Sources' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
