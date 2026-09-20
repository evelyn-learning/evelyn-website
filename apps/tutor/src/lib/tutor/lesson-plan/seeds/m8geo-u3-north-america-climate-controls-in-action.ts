/**
 * Grade 8 World Geography — North America: Physical Systems: North America:
 * Climate Controls in Action.
 *
 * PROCEDURE-LED row (National Geography Standard 7), shaped on the
 * procedure-led exemplar `m8geo-u1-counts-rates-and-fair-comparison.ts`: the
 * concept segment is a short ordered routine over described data, the first
 * worked example runs the routine straight through, the second repairs a
 * wrong reading, and both end with the REWIND-AND-CONTRASTING-CASE check
 * move (re-read the given figures backwards, then change ONE input and run
 * the routine again).
 *
 * THE ROUTINE, in the order it is always run:
 *   1. RANGE. Warmest month mean minus coldest month mean. Mostly ocean air
 *      against land air.
 *   2. MIDPOINT. The figure halfway between those two means. Mostly latitude
 *      and elevation.
 *   3. TOTAL. The yearly precipitation, read as a route: where is the water,
 *      which way is the air moving, what stands in between.
 *   4. NAME THE CONTROL FROM A PAIR, never from one station's figure, and
 *      pick the pair that differs in one thing only.
 *   Then move a station one step and say which number moves and which way.
 *   Every range is inverted (coldest month plus range recovers the warmest)
 *   and every midpoint is inverted (midpoint doubled, minus the coldest,
 *   recovers the warmest).
 *
 * SCOPE GUARD: this row ASSUMES, in one clause where it is used, that
 * latitude, elevation, distance from water, ocean currents and mountain
 * barriers control the climate of a place (Grade 7,
 * `m7geo-u2-weather-climate-and-factors.ts`), and re-teaches none of the
 * five: the list appears exactly once, as the second sentence of keyIdea 1,
 * and no keyIdea, step or item answer explains why sunlight arrives at a
 * slant near the poles or why a current warms the coast it touches. The
 * weather-versus-climate distinction, also Grade 7, survives only as the
 * premise inside the definition of a climate normal, where it says what the
 * figures ARE; the word "weather" occurs once in the whole authored body,
 * naming the station in the hook. It ADDS computing the annual range and
 * the midpoint from two monthly means,
 * sorting stations by range, midpoint and total in that fixed order,
 * isolating a control by choosing the pair of stations that differs in one
 * thing only, and predicting which of the three numbers moves and in which
 * direction when a station is moved one step. It does NOT identify which
 * physical region a location lies in or contrast young western ranges with
 * the worn Appalachians (row 3.1, `north-america-landform-regions`); it does
 * NOT trace a drop of water to an ocean or reason over a drainage network
 * (row 3.3, `north-america-river-systems-and-watersheds`); it names NO
 * hazard and classifies nothing as hazard or disaster (row 3.4,
 * `north-america-hazard-regions`, and Unit 7); it reads no series over time
 * and carries no greenhouse mechanism at any depth (row 7.2,
 * `reading-climate-trend-data`, which owns the one ruled define-depth
 * paragraph); and it names NO air mass and NO front, which are Grade 6
 * Science (`m6sci` U6, `how-air-mass-interactions-produce-severe-weather`).
 * Three things ARE deliberately allowed, because neighbors sit close and the
 * line has to be drawn rather than avoided: (a) the rain-shadow mechanism
 * appears in ONE clause inside keyIdea 4, because a route cannot be traced
 * without saying what the climb does to the air, and no item is answered by
 * that clause -- the items ask which PAIR shows it and how big the effect
 * is; (b) four real North American patterns are named QUALITATIVELY and
 * carry no figure -- prevailing winds from the west across the middle
 * latitudes, the western ranges standing between the Pacific and the
 * interior, the Gulf of Mexico feeding moist air north over the eastern
 * half, and a cool current running south along the Pacific coast -- because
 * accuracy rule 9 puts this row's verification burden on exactly those, and
 * every station FIGURE in the file belongs to an invented station. The one
 * general magnitude claim in the teaching prose -- that a single crest can
 * be worth a tenfold difference in the yearly total between two stations at
 * the same latitude a couple of hundred kilometers apart -- is a claim about
 * a range of outcomes rather than a figure for any named place, and it is
 * ledgered as such; (c) the ocean current appears as the reason one
 * invented coastal station has a cool
 * summer, which is applying a control to data, not teaching what a current
 * is. The scope cell carries all three parts (positive statement, lineage
 * clause, withheld clause).
 *
 * BURNED EXAMPLES (ruling 32/36): `los[0].description` is student-facing and
 * names the five station positions (wet mild Pacific coast, dry basin east of
 * a mountain range, continental interior with extreme seasons, humid Gulf
 * coast, subarctic north) and four controls by name. No item is therefore
 * keyed to a bare position-to-control pairing, which the objective already
 * gives away. Every item is keyed to a computed figure or a decision about
 * which pair of stations settles a question. Do not "helpfully" rewrite an
 * item into a matching exercise later.
 *
 * ACCURACY NOTE: every station in this file is invented and every figure was
 * written for the arithmetic. No figure anywhere is attached to a real named
 * place. Positions are described by their SETTING (an ocean coast, a basin
 * beyond a crest, the interior plains, the far north, a high mountain
 * station), which is what the row asks the student to identify. Degrees are
 * degrees Celsius; precipitation is millimeters a year; negative numbers use
 * the ASCII hyphen-minus.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67
 * percent of the time; chance with four choices is 25 percent). Every
 * distractor here states the full wrong STEP that produces it -- the winter
 * figure read as the whole climate, a dry station read as a cold one, the
 * summer figure read as latitude, the single lowest figure read as
 * elevation, the pair that moves two things at once, the refusal to compare
 * -- and no key was built long because it is the key. Measured as a
 * diagnostic and not as a score: the key is the strictly longest choice in 2
 * of the 3 items, by under 4 percent over the next-longest choice in each --
 * inside the noise band ruling 16 describes, and not worth an edit that
 * would push the key toward being the shortest instead. The one item whose
 * distractors were grown (latitude against elevation) was grown because two
 * of them were bare labels next to a key carrying its arithmetic, not to
 * move the count: the margin went from 22 percent to under 4. The three
 * keys sit at ids c, a and d, which is the id set `(3 + 2) mod 4 = 1`
 * requires, omitting b.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every station table is
 * written out in prose inside the segment that needs it, and every item is
 * solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U3_NORTH_AMERICA_CLIMATE_CONTROLS_IN_ACTION: LessonPlan = {
  id: 'evelyn.ms.m8geo.north-america-climate-controls-in-action.v1',
  title: 'North America: Climate Controls in Action',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.north-america-climate-controls-in-action',
      standard: 'M8GEO-3.2',
      description:
        'Given climate data for several North American stations (a wet mild Pacific coast, a dry basin east of a mountain range, a continental interior with extreme seasons, a humid Gulf coast, a subarctic north), match each station to its position and name the control that produces it (rain shadow, maritime versus continental, latitude, Gulf moisture), and predict the climate of a new position (National Geography Standard 7: the physical processes that shape the patterns of Earth\'s surface).',
    },
  ],
  prerequisites: ['m8geo.north-america-landform-regions'],
  followUps: ['m8geo.north-america-river-systems-and-watersheds'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put two places at the same latitude side by side so the student wants a way to tell what came between them, before any control is named.',
      script:
        'Your cousin moves 200 kilometers east -- one long drive, same country, same distance from the equator -- and the photos start arriving. Where you live it is green and gray and raining again. Where she lives there is sagebrush, dust, and a sky with nothing in it. In January she is colder than you are. In July she is hotter than you are, and she has stopped making jokes about your rain. Nothing about the sun is different between you: at the same latitude you get sunlight at the same angle on the same day of the year. Something standing between those two houses did all of it. Here is the useful part -- you do not need to be told what that something is, because you can read it off the numbers. Three figures from a weather station, a coldest month, a warmest month and how much falls in a year, are enough to work out where that station must be standing and what put it there.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-numbers-in-order',
      kind: 'concept',
      goal: 'Install the fixed reading order -- range, midpoint, total -- and the rule that a control is named from a pair of stations, never from one figure.',
      keyIdeas: [
        'EVERY STATION HANDS YOU THREE NUMBERS, AND YOU READ THEM IN A FIXED ORDER: RANGE, MIDPOINT, TOTAL. Latitude, elevation, distance from water, ocean currents and mountain barriers each control a climate, and the reason a station\'s figures can tell you which one is in charge here is that they do not all push on the same number. One: subtract the coldest month mean from the warmest month mean. That is the RANGE, and it is mostly about how much ocean the arriving air has crossed. Two: take the figure halfway between those two means. That is the MIDPOINT, and it is mostly about latitude and elevation. Three: read the yearly precipitation TOTAL, and ask where the water could have come from. Run them in that order every time. Naming a control before all three numbers are on the board is guessing, and a guess that lands is still a guess.',
        'THE RANGE IS THE DIAL BETWEEN OCEAN AIR AND LAND AIR, AND IT IS A SUBTRACTION. Water warms and cools far more slowly than land, so air arriving off an ocean brings that slowness with it. A station running from 4 degrees Celsius in its coldest month to 16 in its warmest has a range of 12, which is ocean air in charge. A station running from -14 to 20 has a range of 34, which is land air in charge. Both can sit at the same latitude and both sets of figures can be right. What a small range never means by itself is WARM: ocean air holds the winter up and the summer down at the same time, so steady is what it buys you, not hot. Check every subtraction by adding the range back onto the coldest month, which has to return the warmest month.',
        'THE MIDPOINT IS LATITUDE AND ELEVATION TOGETHER, AND THE RANGE IS WHAT PRIES THEM APART. Going far north and climbing a long way up both pull a midpoint down, so a low midpoint on its own cannot say which of the two did it. The separation is in what each does to the two ends of the year. Climbing takes roughly the same number of degrees off the winter and off the summer, so the range barely moves. Going far north takes much more off the winter than off the summer, because the gap between a winter day and a summer day widens the farther from the equator a station stands, and the range widens with it. So two stations with the same midpoint and very different ranges are a mountain station and a far northern station, and the wider range is the northern one.',
        'THE TOTAL IS A ROUTE QUESTION: WHERE IS THE WATER, WHICH WAY IS THE AIR MOVING, AND WHAT STANDS IN BETWEEN. Across the middle latitudes of North America the prevailing winds blow from the west, so the Pacific sits upwind of the whole western side of the continent, while the Gulf of Mexico feeds moist air north across the eastern half. Trace the route from the water to the station and note what the air has to climb on the way: air forced up over a mountain range cools, drops its water on the side the wind reaches first, and comes down the far side dry, which is the rain shadow. That one obstacle can be worth a tenfold difference in the yearly total between two stations at the same latitude a couple of hundred kilometers apart, which no other control on the list can manage. A big total means open water upwind and something to lift the air. A small total means a barrier in the way, a long overland journey from any sea, or air too cold to carry much water in the first place.',
        'A CONTROL EXPLAINS A DIFFERENCE BETWEEN TWO STATIONS. IT DOES NOT EXPLAIN A NUMBER AT ONE STATION. Because a low total has three different ways of happening, a single figure cannot name its own cause, and neither can a single cold winter. So pick the PAIR that holds everything still except the one thing you want to test: two stations at the same latitude on opposite sides of one crest isolate the barrier; two stations the same distance inland at different latitudes isolate latitude; two stations at the same latitude and the same distance from the ocean, one of them high up, isolate elevation. If your pair differs in two things at once, it cannot tell you which of them did the work, and the honest verdict is that this data does not separate them.',
        'TO PREDICT, MOVE THE STATION ONE STEP AND SAY WHICH NUMBER MOVES AND WHICH WAY. That is the routine run backwards, and it is the test of whether you have it. Carry a station 500 kilometers inland at the same latitude: the range widens, the total falls, the midpoint barely moves. Carry it 1,000 kilometers north along the same coast: the midpoint falls and the range stays small, because the station is still taking its air off the water. Lift it 2,000 meters: the midpoint falls and the range holds. Move it across the crest of a high range: the total collapses and the range widens. Say the direction of all three numbers out loud before choosing any set of figures, and a wrong prediction becomes visible while it is still cheap.',
      ],
      vocabulary: [
        {
          term: 'climate normal',
          definition:
            'the average of one month at one recording station worked out over many years, which is what a station\'s figures are and why a single unusual year cannot move them.',
        },
        {
          term: 'annual temperature range',
          definition:
            'the warmest month mean minus the coldest month mean at one station, computed to measure how far that climate swings across a year.',
        },
        {
          term: 'midpoint temperature',
          definition:
            'the figure halfway between the coldest and warmest month means, used as a quick measure of how warm a station is overall; it is not the average of all twelve months.',
        },
        {
          term: 'maritime climate',
          definition:
            'a climate recognized by a small annual range, because the air reaching it has spent most of its journey over water.',
        },
        {
          term: 'continental climate',
          definition:
            'a climate recognized by a large annual range, because the air reaching it has spent most of its journey over land.',
        },
        {
          term: 'rain shadow',
          definition:
            'the dry ground beyond the crest of a barrier, recognized in the data as a yearly total that is a fraction of the one recorded at the same latitude on the side the wind reaches first.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-match-three-stations',
      kind: 'worked_example',
      problem:
        'Run the routine straight through and put each station in its place.\n\n"Aldermere: coldest month mean 4 degrees Celsius, warmest month mean 16, 2,300 millimeters of precipitation a year. Bellick: coldest month -6, warmest month 24, 230 millimeters. Carrow: coldest month -14, warmest month 20, 460 millimeters."\n\nThe three positions, in no particular order: (1) on the Pacific coast, at the western foot of a high range that runs north to south near the shore; (2) in a basin on the far side of that same range, 200 kilometers inland, at the same latitude, about 500 meters above sea level; (3) on the interior plains, 1,500 kilometers from the nearest ocean, 8 degrees of latitude farther north, with no range between it and the Gulf of Mexico.',
      steps: [
        'Step one, the ranges, because that is the fastest split. Aldermere: 16 minus 4 is 12. Bellick: 24 minus -6 is 30. Carrow: 20 minus -14 is 34. Invert each one by adding the range back onto the coldest month: 4 plus 12 is 16, -6 plus 30 is 24, -14 plus 34 is 20. All three return. Aldermere at 12 is ocean air; Bellick and Carrow are both land air.',
        'Step two, the midpoints. Aldermere: 4 plus 16 is 20, and 20 divided by 2 is 10. Bellick: -6 plus 24 is 18, and 18 divided by 2 is 9. Carrow: -14 plus 20 is 6, and 6 divided by 2 is 3. Invert by doubling the midpoint and subtracting the coldest month: 10 doubled is 20, minus 4 is 16; 9 doubled is 18, minus -6 is 24; 3 doubled is 6, minus -14 is 20. All three return.',
        'Read what the midpoints just did. Aldermere at 10 and Bellick at 9 are one degree apart, which is the signature of two stations at the same latitude -- and the basin sits 500 meters higher, which is enough on its own to account for that single degree. Carrow at 3 is six degrees below Bellick and seven below Aldermere. Six or seven degrees of midpoint with no mountain involved is latitude, and position 3 is the one that is farther north. Carrow is position 3.',
        'Step three, the totals, read as routes. Aldermere has 2,300 millimeters: open ocean upwind and a range right behind the station to lift that air. Bellick has 230, which is 2,300 divided by 10 -- exactly one tenth -- and the check is 230 times 10, which is 2,300. One crest between the two stations, and nine tenths of the water is gone. Aldermere is position 1 and Bellick is position 2.',
        'Now the part that looks wrong until you trace the route. Carrow sits 1,500 kilometers from any ocean, far deeper inland than Bellick, and yet Carrow is WETTER: 460 millimeters against 230, which is 230 times 2, and the check is 460 divided by 2, which is 230. Distance from the ocean did not do the drying at Bellick; the crest did. Carrow has no crest on the side its water comes from, so moist air off the Gulf of Mexico reaches it from the south, while Bellick sits behind a range with the Pacific cut off. WRONG: "Carrow is the farthest inland, so Carrow must be the driest." CORRECT: "Bellick is the driest at 230 millimeters, because a barrier upwind beats distance, and Carrow at 460 has an open route to its moisture."',
        'Rewind the input and read the three lines backwards to be sure nothing was misread: 460 with a coldest month of -14 and a warmest of 20; 230 with -6 and 24; 2,300 with 4 and 16. The assignment holds: the small range goes to the coast, the tenth of the precipitation goes behind the crest, the low midpoint goes north.',
        'Now change ONE input and run it again. Suppose Bellick stood 40 kilometers west of the crest instead of east of it, at the same latitude and the same 500 meters. Only the side of the crest changed. The air reaching it is now still carrying its water and still carrying the ocean\'s steadiness, so the total climbs from 230 toward Aldermere\'s 2,300 or past it -- a slope lifts air harder than a shoreline does -- and the range narrows from 30 back toward Aldermere\'s 12. The station did not move 200 kilometers. It moved across one ridge, and two of its three numbers changed.',
      ],
      answer:
        'Aldermere is position 1, the Pacific coast: range 12 (16 minus 4), which is ocean air, and 2,300 millimeters on a windward shore. Bellick is position 2, the basin beyond the crest: range 30, midpoint 9 against Aldermere\'s 10, so the same latitude, and 230 millimeters, exactly one tenth of Aldermere\'s total, which is the rain shadow. Carrow is position 3, the interior plains farther north: midpoint 3, six degrees below Bellick and seven below Aldermere with no mountain to explain it, so latitude, and 460 millimeters -- twice Bellick\'s total despite being much farther inland, because its route to the Gulf of Mexico has no barrier across it. Moved to the windward side of the same crest, Bellick\'s total would climb toward 2,300 and its range would narrow toward 12.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-repair-a-misread',
      kind: 'worked_example',
      problem:
        'A student read one station and named the wrong control. Find the slip, repair it with the routine, and say what the student\'s figure was actually measuring.\n\n"Dunmere: coldest month mean 7 degrees Celsius, warmest month mean 15, 900 millimeters of precipitation a year. Dunmere stands on the Pacific shore. Emmit: coldest month -2, warmest month 26, 350 millimeters. Emmit stands 100 kilometers inland at the same latitude and at the same elevation, behind a low line of coastal hills."\n\nThe student wrote: "Dunmere\'s warmest month is only 15 degrees. A summer that cool means Dunmere is far to the north, up toward the subarctic."',
      steps: [
        'Do not start by arguing. Start by running step one on both stations, because the student never did. Dunmere: 15 minus 7 is 8, and the check is 7 plus 8, which is 15. Emmit: 26 minus -2 is 28, and the check is -2 plus 28, which is 26.',
        'A range of 8 is about as small as a range gets, and the widest ranges anywhere in North America belong to the far northern interior, where the winter nights are long and the summer days are long too. The student\'s conclusion and the student\'s own data point in opposite directions. That is the slip: one figure was read, and the figure that would have tested it was not.',
        'Step two, the midpoints. Dunmere: 7 plus 15 is 22, and 22 divided by 2 is 11. Emmit: -2 plus 26 is 24, and 24 divided by 2 is 12. Invert: 11 doubled is 22, minus 7 is 15; 12 doubled is 24, minus -2 is 26. A midpoint of 11 is mild, not subarctic, and Dunmere and Emmit are one degree apart, which is what two stations at the same latitude and elevation should look like.',
        'So the midpoints agree and the ranges do not, 8 against 28. That pair holds latitude and elevation still and changes only the distance from the ocean, which means the control that separates these two stations is distance from water. There is a second control stacked on it: the current running south along that coast is a cool one, so the water offshore stays cool through the summer, and air coming off cool water is what holds the warmest month mean down to 15 while the same water keeps the coldest month at 7, above freezing.',
        'WRONG: "The warmest month is only 15 degrees, so the station is far north." CORRECT: "The warmest month is 15 and the coldest is 7, a range of 8, so the station is taking its air off cool water. A far northern station has a cool summer AND a brutal winter, and this one does not have the winter."',
        'Say what the student\'s figure was really measuring. A warmest month of 15 degrees is a true fact about Dunmere and it is genuinely informative -- it says the summer is cool. It simply cannot tell you WHY on its own, because two completely different controls produce a cool summer, and only the other end of the year separates them. One number, two causes; the pair settles it.',
        'Rewind and test a contrasting case. Re-read the given figures backwards: 350 with -2 and 26; 900 with 7 and 15. Now change ONE input -- carry Dunmere 1,200 kilometers north along the same coast, latitude and nothing else. The midpoint falls, so figures like a coldest month of 1 and a warmest of 9 would be no surprise: a range of 8, the check being 1 plus 8, which is 9, and a midpoint of 5. Notice what did NOT happen. The range stayed at 8, because the station is still on the shore. A far northern COASTAL station is a cold maritime station, and it still looks nothing like a far northern interior one.',
      ],
      answer:
        'The student read one figure and named a control from it. The routine repairs it: Dunmere\'s range is 15 minus 7, which is 8, and 8 is the smallest kind of range there is, while far northern stations carry the widest. Dunmere\'s midpoint is 11 and Emmit\'s is 12, so the two stations are at the same latitude; the ranges are 8 against 28, so the control separating them is distance from water, helped by the cool current running south along that coast. The cool summer figure was real but could not name its own cause, because a cool summer comes either from high latitude or from cool water offshore, and only the winter figure tells them apart. Carried 1,200 kilometers north along the same coast, Dunmere would keep a range near 8 while its midpoint fell from 11 toward 5.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-test-the-colder-claim',
      kind: 'try_yourself',
      problem:
        '"Fennick: coldest month mean 5 degrees Celsius, warmest month mean 17, 1,900 millimeters of precipitation a year. Fennick stands on an ocean shore. Glassen: coldest month -5, warmest month 27, 240 millimeters. Glassen stands 200 kilometers inland beyond the crest of a high range, at the same latitude, and a survey puts the two stations within 100 meters of each other in elevation."\n\nA travel blog says: "Glassen is much colder than Fennick." Does the data support the claim?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Supported: the coldest month at Glassen is -5 degrees against 5 at Fennick, which is a full 10 degrees colder, and the coldest month is the figure a climate gets judged by' },
        { id: 'b', text: 'Supported: Glassen takes 240 millimeters a year against 1,900 at Fennick, and a station that dry sits a long way from the ocean, which is what makes an inland winter cold' },
        { id: 'c', text: 'Not supported: both stations have a midpoint of 11 degrees, and what changed is the range, 32 degrees at Glassen against 12 at Fennick', correct: true },
        { id: 'd', text: 'Supported: Glassen is beyond the crest of a high range, and the far side of a range is the cold side as well as the dry side, in every month of the year' },
      ],
      expectedAnswer: 'Not supported: both stations have a midpoint of 11 degrees, and what changed is the range, 32 degrees at Glassen against 12 at Fennick',
      hints: [
        'The claim is about how cold the station is overall, so compute the figure that answers that question for each station -- the point halfway between the coldest and the warmest month -- before you compare anything. Then compute both ranges and see which of the two figures actually moved.',
        'Halfway between -5 and 27 is one subtraction and one division away, and so is halfway between 5 and 17. One wrong step here is reading the winter figure as if it were the whole climate; another is reading a dry station as a cold one; another is assuming a crest pulls every month down instead of pushing the two ends apart.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-latitude-or-elevation',
      kind: 'try_yourself',
      problem:
        'Two stations turn out to have the same midpoint temperature.\n\n"Harrow: coldest month mean -24 degrees Celsius, warmest month mean 18. Ilsby: coldest month -16, warmest month 10."\n\nOne of them stands near sea level far north of the middle latitudes. The other stands high on a mid-latitude mountain, and both are a long way from any ocean. Which is which, and what in the data settles it?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Harrow is the far northern station: its range is 42 degrees against 26 at Ilsby, and going far north takes much more off the winter than off the summer, while climbing takes about the same off both', correct: true },
        { id: 'b', text: 'Ilsby is the far northern station: its warmest month reaches only 10 degrees against 18 at Harrow, and a summer that cool is the mark of a place close to the pole' },
        { id: 'c', text: 'Harrow is the mountain station: -24 degrees is the lowest single reading anywhere in this data, and the lowest reading in a set is what marks out the station standing highest above sea level' },
        { id: 'd', text: 'Neither can be identified from these figures, because the two stations share a midpoint of -3 degrees, and a midpoint is the only measure of overall cold that two monthly means can give you' },
      ],
      expectedAnswer: 'Harrow is the far northern station: its range is 42 degrees against 26 at Ilsby, and going far north takes much more off the winter than off the summer, while climbing takes about the same off both',
      hints: [
        'The midpoints are equal, so the midpoint cannot settle it. Compute the other figure for each station: warmest month mean minus coldest month mean, and check each subtraction by adding the range back onto the coldest month.',
        'Ask what each move does to the two ends of the year separately rather than to the station as a whole. One wrong step is reading the summer figure alone as latitude; another is reading the single lowest figure as elevation; another is stopping once the midpoints come out equal.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-pair-shows-the-barrier',
      kind: 'try_yourself',
      problem:
        'Three stations sit on one west-to-east line at the same latitude.\n\n"Jarrow: on the ocean shore, near sea level, 1,700 millimeters of precipitation a year. Kessel: 60 kilometers inland, partway up the ocean-facing slope of a high range, 800 meters above sea level, 2,600 millimeters. Lorne: 200 kilometers inland, in a basin beyond the crest of that range, 600 meters above sea level, 260 millimeters."\n\nA student wants to show that the mountain range itself, and not simply distance from the ocean, is what dries the interior. Which comparison in this data makes that case?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Jarrow against Lorne: the shore station takes 1,700 millimeters and the farthest inland station takes 260, which shows the total falling as distance from the ocean grows' },
        { id: 'b', text: 'Jarrow against Kessel: the higher station takes 2,600 millimeters against 1,700 at sea level, which shows that elevation by itself is what sets a station\'s total' },
        { id: 'c', text: 'No comparison here can separate the two, because every station farther from the ocean in this line is also farther past the crest of the range' },
        { id: 'd', text: 'Kessel against Lorne: Kessel is already inland and still takes 2,600 millimeters, so distance alone is not drying the air, and the collapse to 260 arrives only after the crest', correct: true },
      ],
      expectedAnswer: 'Kessel against Lorne: Kessel is already inland and still takes 2,600 millimeters, so distance alone is not drying the air, and the collapse to 260 arrives only after the crest',
      hints: [
        'To show that one thing and not another is doing the work, find the station that breaks the pattern. Moving east, distance from the ocean and the crest change together -- except at one of these three stations.',
        'One pair moves both things at once and therefore settles nothing. One pair is offered as proof that height alone makes a station wet, which the driest station in the line, itself 600 meters up, contradicts. And the claim that nothing here can be separated is false, because one station is well inland and still on the ocean side of the crest.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-one-figure-one-control',
      kind: 'misconception_check',
      question:
        'A student is handed two more sets of station figures.\n\nFirst: "Nessel: coldest month mean -28 degrees Celsius, warmest month mean 12, 280 millimeters of precipitation a year, with the nearest mountains more than 1,000 kilometers away." The student writes: "Nessel takes only 280 millimeters a year, so Nessel must be in a rain shadow."\n\nSecond: "Oreton: coldest month 6, warmest month 18, standing on an ocean shore. Prewitt: coldest month -6, warmest month 30, standing 400 kilometers inland at the same latitude." The student writes: "Oreton has a coastal climate and Prewitt is inland, so Oreton is the warmer of the two."\n\nWhat is wrong with each?',
      commonErrors: [
        {
          answer: 'Nessel takes only 280 millimeters a year, so Nessel must be in a rain shadow.',
          misconception:
            'Naming a control from one station\'s figure. A rain shadow is a claim about two places on opposite sides of a barrier, so a single low total cannot pick it out from the other ways a station ends up dry.',
          correctsTo:
            'Read the rest of the line before naming anything. Nessel gives a coldest month of -28 degrees Celsius and a warmest of 12, so the midpoint is -28 plus 12, which is -16, divided by 2, which is -8, and the range is 12 minus -28, which is 40; the check is -28 plus 40, which returns 12. The line also says the nearest mountains stand more than 1,000 kilometers away, so there is no barrier anywhere near it. Nessel is dry for two reasons that have nothing to do with a barrier: it sits a very long way from any ocean, and air that cold carries very little water vapor, so there is little to fall out in the first place. WRONG: "The driest station in the set is the one in the rain shadow." CORRECT: "A rain shadow claim needs a pair -- a wet station on the side the wind reaches first and a dry one beyond the crest, at the same latitude -- so name the pair before you name the control."',
        },
        {
          answer: 'Oreton has a coastal climate and Prewitt is inland, so Oreton is the warmer of the two.',
          misconception:
            'Reading a small annual range as "warm". Ocean air holds the winter up and the summer down at the same time, and those two pull the overall level in opposite directions, so steady is what a coast buys and warm is not.',
          correctsTo:
            'Take both stations apart month by month. Oreton: coldest month 6 degrees, warmest month 18, so the range is 18 minus 6, which is 12 -- check, 6 plus 12 returns 18 -- and the midpoint is 6 plus 18, which is 24, divided by 2, which is 12. Prewitt: coldest -6, warmest 30, so the range is 30 minus -6, which is 36 -- check, -6 plus 36 returns 30 -- and the midpoint is -6 plus 30, which is 24, divided by 2, which is 12. The midpoints are identical. In the coldest month Oreton is 12 degrees warmer than Prewitt; in the warmest month Prewitt is 12 degrees warmer than Oreton. WRONG: "The coastal station is the warmer one." CORRECT: "The coastal station is the steadier one, warmer in winter and cooler in summer, and the range, 12 against 36, is the figure the ocean actually sets."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Read every station in the same order: range first, then midpoint, then total. Naming a control before all three numbers are down is guessing.',
        'Range is the warmest month mean minus the coldest month mean, and it is the dial between ocean air and land air. A small range means steady, never warm.',
        'Midpoint is the figure halfway between those two means. Latitude and elevation both pull it down, and the range is what tells them apart: climbing barely moves the range, going far north widens it.',
        'The total is a route: where the water is, which way the air is moving, and what it has to climb. A barrier upwind beats distance from the ocean, and a station far inland with an open route can be wetter than a closer one behind a crest.',
        'Check every subtraction by adding the range back onto the coldest month, and every midpoint by doubling it and subtracting the coldest month. Both have to return the warmest month.',
        'A control explains a difference between two stations, not a number at one station. Choose the pair that differs in one thing only; if the pair differs in two, say so instead of picking one.',
        'To predict, move the station one step and say which of the three numbers moves and which way before you choose any figures.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'North America: Climate Controls in Action' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
