/**
 * Grade 8 World Geography — North America: Physical Systems: North America:
 * Landform Regions.
 *
 * CONCEPT-LED row 3.1 (National Geography Standard 4), shaped on
 * `m8geo-u7-hazard-risk-exposure-and-vulnerability.ts`. The row installs ONE
 * framework -- a site is placed by THREE readings (local relief, what the rock
 * and soil are like, how much the ground moves now), checked against the fixed
 * west-to-east order of the regions -- and then makes the student USE it on
 * described sites. Every item is answered by a named place-in-the-data, by a
 * verdict carrying its arithmetic, or by a prediction naming the reading it
 * rests on, never by a definition.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause each where it is used, that
 * moving water, wind and ice carry rock and soil away and drop it lower
 * (Grade 7, `m7geo-u2-landforms-and-water-features.ts`) and that earthquakes
 * and volcanoes cluster where plates meet (Grade 7,
 * `m7geo-u2-plate-tectonics-and-natural-hazards.ts`), and re-teaches neither:
 * no keyIdea in this file defines erosion, deposition, a landform or a plate
 * boundary, and the strings "convergent", "divergent", "transform", "erosion"
 * and "deposition" appear nowhere in the authored body (checked by grep
 * against the finished file; the words in this comment are the guard, not the
 * body). The landform NAMES Grade 7 defines -- plain, plateau, valley, ridge,
 * basin -- are USED here as labels and are never re-defined as shapes; where
 * keyIdea 2 says that high-and-flat places a site on a plain and lower-and-
 * steeper places it in mountain country, that is this row's relief CRITERION
 * for placing a site, not Grade 7's definition of a landform, and it arrives
 * attached to the subtraction that produces it. That is the deliberate line:
 * this row spends its words on the readings, not on the nouns. It ADDS
 * computing local relief as a subtraction of two elevations and using THAT
 * rather than elevation above sea level to separate mountain country from a
 * plain, reading how recently land was lifted off the form it now has, using
 * present-day earthquake counts and nearby volcanoes as a third and
 * independent reading, placing an unnamed described site on the named
 * transect by ruling out on position and then matching signatures, and
 * resolving a case in which the three readings disagree. That last move is
 * TAUGHT (keyIdea 5, and the contrasting case that closes the second worked
 * example) and is deliberately NOT assessed by any of the three items, which
 * is recorded here rather than papered over: a disagreeing-readings item
 * would have had to re-use the second worked example specimen to be fair at
 * this length, and ruling 22 forbids that. It STOPS SHORT of
 * identifying the five United States regions by name at identify depth
 * (`g4-ss-us-regions.ts`, Grade 4) -- the regions here are physiographic and
 * are placed from measurements, not recognized from a list -- of the climate
 * controls and the rain shadow (row 3.2
 * `north-america-climate-controls-in-action`), of drainage networks, divides
 * and which ocean a drop of water reaches (row 3.3
 * `north-america-river-systems-and-watersheds`), of mapping hazards to
 * regions and of the hazard-versus-disaster classification (row 3.4
 * `north-america-hazard-regions`), of the mechanics of how plates interact
 * and what each boundary type builds (Grade 7 2.2), of how an earthquake or
 * an eruption happens (`m6sci` U6 and U9), and of every chronology of
 * settlement, exploration or industry (`g8-ss-*`, `ap-apush-*`). Three things
 * ARE deliberately allowed, because neighboring rows sit close and the line
 * has to be drawn rather than avoided: (a) real North American regions are
 * NAMED and their long-settled form is stated, which accuracy rule 9 requires
 * of Unit 3 and which the scope cell asks for by name -- but every FIGURE in
 * this file belongs to an invented, described site, and no real elevation,
 * distance or count appears anywhere; (b) earthquakes and volcanoes are used
 * as a READING that says whether plates are meeting near a site, never
 * located as hazard regions and never classified as hazard or disaster, which
 * is row 3.4 work; (c) one clause in the first worked example says the rivers
 * at that site run east, used only as a direction cue for position -- no
 * network is traced, no divide is named and no ocean is named, which is row
 * 3.3 work.
 *
 * SCOPE CELL PARTS: the cell carries all three parts. Part (i) is in
 * `los[0].description`; parts (ii) and (iii) are the lineage and boundary
 * clauses above and appear nowhere a student can hear them.
 *
 * BURNED EXAMPLES (ruling 36): the seven region names the scope cell lists
 * ARE this row's teaching material and are taught in keyIdea 1, so they are
 * not available as fresh item specimens. Every item therefore invents a site
 * or a range and describes its readings; a later editor should not "helpfully"
 * turn a region name from the cell into an item stem.
 *
 * ACCURACY NOTE: every number in this file was written for the arithmetic and
 * belongs to an invented site, range or camp. The claims about the real world
 * are all long-settled physical ones of the kind accuracy rule 2 calls safe:
 * the west-to-east order of the regions, that the Great Plains rise westward
 * to the mountain front, that the Canadian Shield is very old rock scraped
 * nearly bare by ice and dotted with lakes around Hudson Bay, that the
 * Appalachians are worn and rounded and were once much higher, that the
 * coastal plain is low and flat and broader in the south, that plates are
 * meeting along the Pacific edge of the continent where earthquakes are
 * frequent and the Cascade Range carries active volcanoes, and that the
 * eastern edge has no plate boundary along it. Every one of them is in the
 * claim ledger with its ground.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time; chance with four choices is 25%). The PER-ITEM discipline is
 * the point: every distractor states the full wrong STEP that produces it --
 * the relief reading used alone with the other two dropped, elevation read as
 * relief, the lowest figure near a site read as the region that site is in,
 * the highest reading handed over instead of the difference, a large relief
 * figure read as a sign of great age, and readings of different kinds treated
 * as unable to be expected together -- and no key was built to be the longest choice BECAUSE it
 * is the key. Measured as a diagnostic, not as a score; zero is NOT the
 * target and the meaningful measurement is the 120-item course rate at
 * registration. The three keys sit at ids b, c and d, which is the id set
 * `(3 + 1) mod 4 = 0` requires, omitting a.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every transect, site and
 * set of readings is written out in prose inside the segment that needs it,
 * and every item is solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U3_NORTH_AMERICA_LANDFORM_REGIONS: LessonPlan = {
  id: 'evelyn.ms.m8geo.north-america-landform-regions.v1',
  title: 'North America: Landform Regions',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.north-america-landform-regions',
      standard: 'M8GEO-3.1',
      description:
        'Given a west-to-east transect of the United States and Canada (Pacific coastal ranges, Western Cordillera including the Rocky Mountains, Interior Plains and Great Plains, Canadian Shield, Appalachians, Atlantic and Gulf coastal plain), identify which physical region a location lies in and explain the contrast between the young, high western ranges at an active plate margin and the old, eroded Appalachians far from any boundary (National Geography Standard 4: the physical and human characteristics of places).',
    },
  ],
  prerequisites: ['m8geo.change-detection-from-satellite-data'],
  followUps: ['m8geo.north-america-climate-controls-in-action'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the contradiction between height above the sea and looking like mountains, so the student wants a reading that separates the two, before any region is named.',
      script:
        'Fly east across the United States on a clear day and keep the window shade up. For a long stretch after the Pacific coast the ground is wrinkled: gray peaks with bare rock on top, valleys with steep walls, shadows that go straight down. Then it goes quiet. Hours of ground so flat it looks printed. Then, past the middle of the continent, the wrinkles come back, except these ones are low and rounded and green, with rivers wandering between them. Here is the part that does not fit. Across the western part of that flat stretch, the ground under the plane is standing HIGHER above the sea than most of the green rounded hills you cross later. Same continent, same afternoon, same plane: high and flat first, lower and lumpy afterward. So when you point out of the window and say "mountains", what is it you are actually reading? Today you get the three readings that answer that, and by the end you will be able to take a few lines of data from a site nobody has named and say which part of the continent it sits in.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-readings-and-the-order',
      kind: 'concept',
      goal: 'Install the fixed west-to-east order as a first constraint and the three readings -- local relief, rock and soil, movement now -- as the evidence a site is placed by, including what to do when the readings disagree.',
      keyIdeas: [
        'PLACE A SITE IN TWO MOVES: RULE OUT BY POSITION, THEN MATCH THE SIGNATURE. Run a line west to east across the United States and Canada and the land comes in a fixed order, and that order is itself evidence, because a site cannot be in a region the line has already passed. Starting at the Pacific: first the PACIFIC COASTAL RANGES, a narrow strip of young, steep mountains standing right at the edge of the continent. Then the WESTERN CORDILLERA, a wide belt of high ranges that includes the ROCKY MOUNTAINS along its eastern side, with high basins and flat-topped plateaus lying between the ranges. Then the land steps down onto the INTERIOR PLAINS, whose western part is the GREAT PLAINS, which rise gradually westward until they run into the mountain front. Across Canada the line next crosses the CANADIAN SHIELD, an enormous area of very old rock curving around Hudson Bay, scraped nearly bare by ice and dotted with lakes; across the United States the same part of the line stays on low interior lowland. Then the APPALACHIANS, a belt of worn, rounded mountains running northeast from the southeastern United States into eastern Canada. Then the ATLANTIC AND GULF COASTAL PLAIN, low and flat, narrow in the north and broad in the south. Rule out on the order first. Then match what the site actually reads.',
        'LOCAL RELIEF IS THE READING THAT SEPARATES MOUNTAIN COUNTRY FROM A PLAIN, AND ELEVATION IS NOT. Local relief is the difference between the highest and the lowest ground within a short distance of a site, and you get it by subtracting. Ground that runs between 300 and 1,050 meters within ten kilometers has a local relief of 750 meters, because 1,050 minus 300 is 750, and 300 plus 750 brings 1,050 back. Elevation is something else: it is the height of one point above the sea, and on its own it places nothing, because a whole region can be sitting high. Hold on to the case that proves it. The western Great Plains stand higher above the sea than most of the Appalachian country far to the east, and they are still plains, because the ground out there barely rises and falls. A site can read high on elevation and low on relief at the same time, and when it does, the relief is the reading that places it: high and flat puts a site on a plain that happens to sit at altitude, and lower and steeper puts it in mountain country. What makes a mountain region is the difference, not the height.',
        'YOUNG AND OLD ARE CONCLUSIONS YOU READ OFF THE SHAPE, NOT EXTRA FACTS TO LOOK UP. Moving water, wind and ice carry rock and soil away and drop them somewhere lower, so from the moment a range stops being pushed up it starts losing height, and it keeps losing it. That gives you a clock, and the form of the land is its face. Sharp ridges, bare rock above the treeline, steep-walled valleys and thin patchy soil mean the lifting is recent enough that the wearing-down has not caught up with it. Rounded summits, broad valleys, deep soil and low relief mean the lifting finished a very long time ago and the wearing-down has had the range to itself ever since. So when the western ranges get called young and the Appalachians get called old, nobody handed you a date. That is what the shapes say, and it is a conclusion you can reach yourself from four lines of description.',
        'MOVEMENT NOW IS A THIRD READING, AND IT IS THE ONE THAT EXPLAINS THE WEST-EAST CONTRAST. Earthquakes and volcanoes cluster where plates are meeting, so counting the felt earthquakes a regional station records and asking whether volcanoes stand nearby tells you whether a site sits on the active side of the continent. Along the Pacific edge of North America plates are meeting now: earthquakes there are frequent, and the Cascade Range in the Pacific Northwest carries active volcanoes. The whole wide western belt behind that edge has been squeezed and lifted, which is why its ranges still have the form of ground lifted recently. The eastern edge of the continent has no plate boundary along it at all -- the nearest one lies far out under the middle of the Atlantic Ocean -- so nothing has been putting height back into the Appalachians for a very long time while the wearing-down kept going. That is the contrast, and notice carefully what it is NOT. It is not that eastern rock is weaker. It is that the west is still being resupplied and the east is not.',
        'WHEN THE THREE READINGS DISAGREE, KEEP THE TWO THAT AGREE AND NAME WHAT THE ODD ONE IS MEASURING. Relief, rock and soil, and movement are three different kinds of evidence, which is exactly why they are convincing when they line up, and why the cases worth thinking about are the ones where they do not. A low relief reading says the ground is level; a high count of felt earthquakes says plates are meeting nearby. Those two can arrive together, and when they do, neither of them is a mistake and neither gets thrown away to make the other two tidy. Say which two agree, say what the odd one is actually measuring, and then ask what kind of place produces all three at once. Position finishes the job: the same disagreement means one thing west of the mountain front and something completely different east of it.',
      ],
      vocabulary: [
        {
          term: 'local relief',
          definition:
            'the difference between the highest and the lowest ground within a short distance of a site, found by subtracting the lowest from the highest; the reading that separates mountain country from a plain.',
        },
        {
          term: 'elevation',
          definition:
            'the height of a single point above sea level, which fixes where that point sits vertically and says nothing about how the ground around it rises and falls.',
        },
        {
          term: 'transect',
          definition:
            'a line drawn across a stretch of country, used to read off in order what the land does along it.',
        },
        {
          term: 'landform region',
          definition:
            'an area whose land gives the same three readings throughout -- one relief pattern, one rock and soil history, one level of present-day movement -- so that a site anywhere inside it reads the same way.',
        },
        {
          term: 'active margin',
          definition:
            'an edge of a continent where plates are meeting now, read from frequent felt earthquakes and volcanoes standing nearby.',
        },
        {
          term: 'passive margin',
          definition:
            'an edge of a continent with no plate boundary along it, where nothing is adding height and the land is only being worn down.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-place-the-camp',
      kind: 'worked_example',
      problem:
        'A field team is flown to a site somewhere in the United States or Canada and is told nothing about where it is. Place the site from its readings.\n\n"Camp elevation: 1,450 meters above sea level. In every direction for 30 kilometers the ground rises or falls by no more than 25 meters. The soil is deep, and the drill goes through it into soft layered rock. In the 20 years the regional seismic station has been running it has recorded no earthquake strong enough to be felt, and no volcano stands anywhere within 500 kilometers. The rivers here run east. From camp, a wall of high peaks stands about 200 kilometers to the west."',
      steps: [
        'Take the readings apart before naming anything, and do not let the elevation lead. 1,450 meters above the sea sounds like mountain country, and that is precisely the reading that sends people wrong. WRONG: "1,450 meters is mountain height, so the camp is up in the Rockies." CORRECT: "1,450 meters is where the camp sits above the sea; it says nothing yet about the ground around the camp."',
        'Reading one: local relief. The highest and lowest ground within 30 kilometers differ by no more than 25 meters, so the local relief is 25 meters. Put the two numbers side by side: the camp stands 1,450 meters above the sea and 25 meters above its own surroundings. 1,450 divided by 25 is 58, and the check is 58 times 25, which is 1,450. The camp is fifty-eight times further above the sea than it is above the land it sits on. That is a plain, and a plain at altitude.',
        'Reading two: rock and soil. Deep soil over soft layered rock is material that has been laid down and then left alone, not stripped off a rising surface. Nothing here has been lifted recently, and nothing has been cut into.',
        'Reading three: movement now. Twenty years of seismic records with no felt earthquake, and no volcano within 500 kilometers, says no plates are meeting under this site. The camp is not on an active margin.',
        'Now use the position, which rules regions out before the signature has to. A wall of high peaks 200 kilometers to the WEST means the western belt has already been passed, so the Pacific coastal ranges and the Western Cordillera are out. The rivers running east say the downhill direction is east, which is what the ground does where the plains slope away from the mountain front. Deep soil over soft layered rock rules out the Canadian Shield, whose surface is old hard rock scraped nearly bare with thin soil over it. And the Appalachians and the coastal plain lie far to the east of a mountain wall like that one, not 200 kilometers from it.',
        'The check to remember, and notice that the three readings are three different KINDS of evidence. A relief of 25 meters is a measurement of the ground. Deep soil over soft layered rock is a description of what the ground is made of and what has happened to it. Twenty years of seismic records with nothing felt is a record of movement. All three say the same thing -- level, undisturbed, quiet -- and the position adds the fourth piece, east of a mountain front with the rivers running away from it. One reading is a guess. Three readings of different kinds, all pointing the same way, is evidence. The site is on the Great Plains, the western part of the Interior Plains, which rise gradually westward until they meet the mountains the team can see.',
      ],
      answer:
        'The Great Plains, the western part of the Interior Plains. The local relief is 25 meters (no more than 25 meters of rise or fall within 30 kilometers), against an elevation of 1,450 meters: 1,450 divided by 25 is 58, and 58 times 25 recovers 1,450, so the site stands far above the sea and almost nothing above its own surroundings, which is a high plain. Deep soil over soft layered rock and twenty years without a felt earthquake agree, and the position -- 200 kilometers east of a wall of high peaks, with the rivers running east -- rules out the western belt, the Shield and everything further east.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-two-ranges-and-one-change',
      kind: 'worked_example',
      problem:
        'Two ranges on the same continent, with the same three readings taken at each. Say which one sits in the western belt and which in the eastern, explain what makes the second one so much lower, and then evaluate how the answer changes if one reading at Range V is different.\n\n"Range V: summits reach 3,600 meters; the valley floors between them lie at 1,800 meters. The ridges are sharp, there is bare rock above the treeline, and the valleys have steep walls. The regional station records about 40 felt earthquakes a decade, and there are volcanoes within 300 kilometers.\n\nRange W: summits reach 1,300 meters; the valley floors between them lie at 700 meters. The summits are rounded, forest grows over the tops, the soil on the slopes is deep, and the valleys are broad. A station of the same kind records about 2 felt earthquakes a decade, and the nearest plate boundary is out under the middle of an ocean."',
      steps: [
        'Reading one, both ranges, with the subtraction shown. Range V: 3,600 minus 1,800 is 1,800 meters of local relief. Range W: 1,300 minus 700 is 600 meters. Compare them as a ratio: 1,800 divided by 600 is 3, and the check is 600 times 3, which is 1,800. Range V stands three times as far above its own valleys as Range W does.',
        'Reading two, both ranges. Sharp ridges, bare rock above the treeline and steep-walled valleys at Range V are the form of ground lifted recently enough that the wearing-down has not caught up. Rounded summits, forest over the tops, deep soil and broad valleys at Range W are the form of a range the wearing-down has had to itself for a very long time.',
        'Reading three, both ranges. 40 felt earthquakes a decade against 2 is a ratio of 40 divided by 2, which is 20, and the check is 2 times 20, which is 40. Twenty times the movement, plus volcanoes within 300 kilometers, puts Range V where plates are meeting. Range W has its nearest boundary out under an ocean and almost nothing moving.',
        'Give the verdict, and make sure it names the cause the readings support. Range V is the western pattern: the Pacific coastal ranges and the Western Cordillera, including the Rocky Mountains, sit on the side of the continent where plates are meeting now, and the height keeps being resupplied. Range W is the Appalachian pattern: the lifting finished long ago, no boundary is near enough to restart it, and the wearing-down has never stopped. WRONG: "Range W is lower because its rock is softer." CORRECT: "Nothing in the readings measures how hard either rock is. What the readings say is that Range W has had the wearing-down working on it with nothing lifting it back, while Range V sits where plates are meeting now."',
        'Rewind the input and read it backwards before going on. Range W: 2 earthquakes, deep soil, rounded, 700, 1,300. Range V: volcanoes, 40 earthquakes, bare rock, sharp, 1,800, 3,600. Nothing was misread, and the two lists disagree on every one of the three readings, which is why the verdict is safe.',
        'Now change ONE input and run it again, so the result does not get memorized as "high elevation means a range". Suppose everything about Range V stayed the same except the valley floors, which lie at 3,300 meters instead of 1,800. The summits are still at 3,600, so the local relief becomes 3,600 minus 3,300, which is 300 meters, and the check is 3,300 plus 300, which is 3,600. The elevation reading did not move at all -- the summits are exactly as high above the sea as before -- but 300 meters of relief is not a range of sharp peaks. It is a high, flat-topped surface, and the earthquakes and the volcanoes still put it inside the active western belt, which is where the high basins and flat-topped plateaus between the ranges are. One reading changed, the answer changed with it, and the reading that changed was never the elevation.',
      ],
      answer:
        'Range V is the western pattern and Range W the eastern one. Local relief: Range V is 3,600 minus 1,800, which is 1,800 meters; Range W is 1,300 minus 700, which is 600 meters; 1,800 divided by 600 is 3, and 600 times 3 recovers 1,800. Movement: 40 felt earthquakes a decade against 2 is a factor of 20, with volcanoes within 300 kilometers of Range V only. Range W is lower not because its rock is softer -- nothing measures that -- but because nothing has lifted it for a very long time while the wearing-down kept going, and no boundary is near enough to restart it. If Range V had valley floors at 3,300 meters instead of 1,800, its relief would be 3,600 minus 3,300, which is 300 meters, and the same summit elevation would describe a high flat-topped surface inside the western belt rather than a range of peaks.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-place-the-unnamed-camp',
      kind: 'try_yourself',
      problem:
        'A survey crew radios in from a site it will not name.\n\n"Camp elevation is 340 meters. Within 15 kilometers of us the ground rises to 880 meters and drops to 360 meters. The summits around us are rounded and forested right over the tops, the valleys between them are broad, and the soil on the slopes is deep. The seismic station 50 kilometers away has recorded two felt earthquakes in the last fifty years. To the east the land flattens out and stays flat all the way to the sea."\n\nWhich region is the camp in?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'The Western Cordillera, because 520 meters of local relief is mountain relief and mountains standing that far above their own valleys are what the western belt is made of',
        },
        {
          id: 'b',
          text: 'The Appalachians, because 520 meters of local relief with rounded summits, deep soil and two felt earthquakes in fifty years is worn mountain country with no plate boundary near it',
          correct: true,
        },
        {
          id: 'c',
          text: 'The Atlantic and Gulf coastal plain, because the camp sits only 340 meters above the sea and flat land runs east from it the whole way to the coast',
        },
        {
          id: 'd',
          text: 'The Canadian Shield, because rock worn down over a very long time with almost no earthquakes under it is exactly what the Shield reads like',
        },
      ],
      expectedAnswer:
        'The Appalachians, because 520 meters of local relief with rounded summits, deep soil and two felt earthquakes in fifty years is worn mountain country with no plate boundary near it',
      hints: [
        'Take the readings one at a time before naming anything. Subtract the lowest ground from the highest to get the local relief, then ask separately what the rounded summits and the deep soil say, and separately again what fifty years of seismic records say.',
        'Three of the four choices lean on one reading and drop the rest: the relief on its own; the camp elevation together with the flat land that lies to the EAST of the camp rather than under it; the age and the quiet ground without checking that the relief and the deep soil fit. Only one choice has every reading pointing the same way.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-relief-against-elevation',
      kind: 'try_yourself',
      problem:
        'Two sites, each with its elevation and with the range of ground around it.\n\n"Site 1: elevation 1,600 meters; within 10 kilometers the ground runs between 1,580 and 1,640 meters.\n\nSite 2: elevation 820 meters; within 10 kilometers the ground runs between 260 and 1,240 meters."\n\nWhich statement does the data support?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Site 1 is in mountain country and Site 2 is on a plain, because Site 1 stands 780 meters higher above the sea than Site 2 does',
        },
        {
          id: 'b',
          text: 'Site 1 is in mountain country and Site 2 is on a plain, because the ground near Site 2 drops to 260 meters and land that low is coastal plain rather than mountain country',
        },
        {
          id: 'c',
          text: 'Site 2 is in mountain country and Site 1 is on a high plain, because Site 2 has 980 meters of local relief against 60 meters for Site 1',
          correct: true,
        },
        {
          id: 'd',
          text: 'Site 2 is in mountain country and Site 1 is on a high plain, because Site 2 has 1,240 meters of local relief against 1,640 meters for Site 1',
        },
      ],
      expectedAnswer:
        'Site 2 is in mountain country and Site 1 is on a high plain, because Site 2 has 980 meters of local relief against 60 meters for Site 1',
      hints: [
        'Local relief is a subtraction. For each site, take the highest ground given and subtract the lowest ground given, and do that before comparing anything about the two elevations.',
        'One choice compares the two elevations instead of the two reliefs, one reads the lowest figure near a site as the region that site is in, and one reaches the right verdict but hands you the highest reading instead of the difference. Check the arithmetic inside every choice that shows a number, including the ones whose verdict you like.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-predict-the-third-reading',
      kind: 'try_yourself',
      problem:
        'A range is described, but only two of the three readings have come in.\n\n"Range T: summits reach 3,050 meters; the valley floors between them lie at 950 meters. The ridges are sharp, there is bare rock well above the treeline, and the valleys have steep walls and narrow floors."\n\nThe third reading -- what the regional seismic station records -- is still missing. Which reading should you expect, and on what grounds?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Expect very few felt earthquakes, because 2,100 meters of local relief takes an enormous stretch of time to build up, and a range standing that far above its own valleys has been there long enough to have gone quiet',
        },
        {
          id: 'b',
          text: 'Expect nothing at all from what is given, because local relief is a subtraction of two elevations while an earthquake count is a record of movement, and two readings of different kinds say nothing about each other',
        },
        {
          id: 'c',
          text: 'Expect a high count of felt earthquakes, because summits standing 3,050 meters above the sea is the reading that places a range in the active western belt of the continent',
        },
        {
          id: 'd',
          text: 'Expect a high count of felt earthquakes, because sharp ridges, bare rock and steep-walled valleys are the form of ground lifted recently, and something has to be doing that lifting now for the wearing-down not to have caught up',
          correct: true,
        },
      ],
      expectedAnswer:
        'Expect a high count of felt earthquakes, because sharp ridges, bare rock and steep-walled valleys are the form of ground lifted recently, and something has to be doing that lifting now for the wearing-down not to have caught up',
      hints: [
        'Two readings are already in. Subtract to get the local relief, then ask what sharp ridges, bare rock and steep-walled valleys say about how recently this ground was lifted -- and then ask what would have to be true right now for the lifting to still be going on.',
        'One choice reads a big relief figure as a sign of great age, one refuses to expect anything because the two readings are of different kinds, and one lands on the same expectation as the key but gets there from the height above the sea instead of from the form. Readings of different kinds can still be expected together when one cause produces both.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-elevation-as-relief-and-weak-rock',
      kind: 'misconception_check',
      question:
        'A student finishes the lesson and writes two sentences. First: "A site 1,500 meters above sea level is in mountain country, and a site 700 meters above sea level is not." Second: "The eastern mountains are low because they are made of weaker rock than the western ones." What is wrong with each?',
      commonErrors: [
        {
          answer: 'A site 1,500 meters above sea level is in mountain country, and a site 700 meters above sea level is not.',
          misconception:
            'Reading elevation above sea level as if it were local relief, so the height of one point gets treated as a description of the ground all around it, and the subtraction that would settle the question never happens.',
          correctsTo:
            'Elevation fixes one point; local relief describes the ground. Take the 1,500-meter site first. If the ground within ten kilometers of it runs only between 1,480 and 1,520 meters, the local relief is 1,520 minus 1,480, which is 40 meters, and the check is 1,480 plus 40, which is 1,520. Forty meters of rise and fall is a plain -- a plain sitting high above the sea, but a plain. Now the 700-meter site. If the ground around it runs between 250 and 1,150 meters, the local relief is 1,150 minus 250, which is 900 meters, and the check is 250 plus 900, which is 1,150. That is mountain country. WRONG: "1,500 meters is mountain country and 700 meters is not." CORRECT: "Forty meters of local relief is a high plain and 900 meters of local relief is mountain country, whatever either site reads above the sea." This is not a made-up trick case in North America: the western Great Plains stand higher above the sea than most of the Appalachian country far to the east, and they are plains.',
        },
        {
          answer: 'The eastern mountains are low because they are made of weaker rock than the western ones.',
          misconception:
            'Explaining a difference in height with a property nobody measured, instead of with the two things the readings actually separate: how recently the land was lifted, and whether anything is lifting it now.',
          correctsTo:
            'Height is a race between the lifting and the wearing-down, and the readings record both sides of that race, never the hardness of the rock. Along the Pacific edge of the continent plates are meeting now: earthquakes there are frequent and the Cascade Range in the Pacific Northwest carries active volcanoes, so the wide western belt has been squeezed and lifted, and its ranges still show the sharp ridges and steep-walled valleys of ground lifted recently. The eastern edge of the continent has no plate boundary along it -- the nearest lies far out under the middle of the Atlantic Ocean -- so nothing has been putting height back into the Appalachians for a very long time while moving water, wind and ice kept carrying material away, and their rounded summits and broad valleys are the result. The Appalachians were once far higher than they are now; what changed is the lifting, not the rock. WRONG: "The eastern mountains are low because their rock is weaker." CORRECT: "The eastern mountains are low because nothing has lifted them for a very long time and the wearing-down never stopped, while the western ranges sit on the side of the continent where plates are meeting now."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Place a site in two moves. Rule regions out by their fixed order along the west-to-east line first, then match what the site actually reads.',
        'Local relief is the highest ground near a site minus the lowest, and it is the reading that separates mountain country from a plain. Elevation above the sea places nothing on its own.',
        'High and flat is a plain at altitude: the western Great Plains stand higher above the sea than most Appalachian country and are still plains.',
        'Young and old are read off the form. Sharp ridges, bare rock, steep-walled valleys and thin soil mean the lifting is recent; rounded summits, broad valleys, deep soil and low relief mean it finished long ago.',
        'Earthquake counts and nearby volcanoes are a third and independent reading: they say whether a site sits where plates are meeting now.',
        'The west-east contrast is about resupply, not about rock. Plates meet along the Pacific edge and keep putting height back; the eastern edge has no boundary along it, so the wearing-down has had the Appalachians to itself for a very long time.',
        'When the three readings disagree, keep the two that agree, name what the odd one is measuring, and let the position on the line settle what kind of place produces all three at once.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.1', cedTitle: 'North America: Landform Regions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
