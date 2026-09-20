/**
 * Grade 8 World Geography — North America: Physical Systems: North America:
 * River Systems & Watersheds.
 *
 * PROCEDURE-LED (row 3.3). Shaped on the procedure-led exemplar
 * `m8geo-u1-counts-rates-and-fair-comparison.ts`: the concept segment is a
 * short ordered routine run over a described network rather than a mental
 * model, worked example 1 runs the routine straight through on three
 * described North American positions, worked example 2 runs it on an invented
 * basin with the arithmetic written out, and both end with the same check
 * move -- rewind the input, then change ONE input and run it again. Three
 * traps this plan is built to kill: letting the nearest coast decide the
 * destination, stopping the trace at a lake that has an outlet, and reading a
 * confluence as a contest the bigger branch wins instead of an addition.
 *
 * THE ROUTINE, in the order it is always run:
 *   1. Place the drop against the nearest divide and say which side it is on.
 *   2. Name the stream that carries water off that side.
 *   3. Follow the chain junction by junction, downstream.
 *   4. At a lake, find the outlet and carry on; a lake is a gate, not an end.
 *   5. Name the ocean, gulf or sea the last river empties into.
 *   Then rewind from the mouth back to the drop, and change ONE input.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause each and nowhere else, that a
 * tributary joins a larger river instead of reaching the sea on its own
 * (Grade 7, `m7geo-u2-landforms-and-water-features.ts`) and that a
 * break-of-bulk point is a site where cargo has to change vessel (Grade 7,
 * `m7geo-u3-urbanization-and-settlement.ts`), and re-teaches neither: the
 * first premise is the opening clause of keyIdea 1 and the second is an
 * appositive inside keyIdea 5, and no keyIdea, no vocabulary entry and no
 * worked-example step says what a river, a tributary, a delta, a lake, a strait
 * or a break-of-bulk point IS (delta and strait do not occur in the body at
 * all). It ADDS tracing a drop through a described
 * drainage network to a named water body, adding upstream drainage areas at
 * each confluence, converting those areas into shares of a basin, and ranking
 * candidate settlement sites by how much of the network must pass them. It
 * STOPS SHORT of the water-cycle and groundwater mechanism (`m6sci` U7,
 * `the-water-cycle-groundwater-and-runoff`): the words evaporation,
 * precipitation, infiltration, runoff and groundwater appear nowhere in the
 * body, and the file never explains how water gets into the air or into the
 * ground, nor where the water in a lake with no outlet goes -- a drop simply
 * arrives, as rain or as meltwater, and the trace starts from there. It stops short of flood hydrology
 * (the word flood appears nowhere in the body), of classifying a hazard or
 * computing risk (rows 3.4 and 7.1), of allocating a basin's water between
 * users (row 6.1), of computing population density (row 4.1), and of any
 * chronology of settlement (`g8-ss-westward-expansion.ts`, `ap-apush-*`) --
 * no date, era or named person appears anywhere in the authored body (the
 * ACCURACY NOTE below carries one date, and it is never spoken). Three things
 * ARE deliberately allowed, because neighbors sit close: (a) candidate sites
 * ARE ranked, in worked example 2 and in try_yourself 3, but on ONE measured
 * quantity read straight off the network -- how much of the basin or of the
 * cargo must pass the site -- with no weights and no scoring sheet, which is
 * what keeps it out of row 2.3 (`site-selection-with-weighted-criteria`); the
 * one elimination anywhere in the file is try_yourself 3's road town, which is
 * dropped because grain cannot pass by water where there is no water, not
 * because it failed a stated criterion; (b) real North American systems are
 * named and traced in worked example 1 because accuracy rule 9 makes this row a
 * real-place row, but every one of them carries a long-settled physical claim
 * and no statistic -- the only numerals anywhere near a real feature are the
 * stipulated distances of an invented snowfield from an unnamed point on a real
 * crest (200 meters west, then moved 400 meters east, with 2 meters and 200
 * kilometers named only to show that the size of the offset never matters),
 * which are positions in a described scenario rather than facts about any
 * place, and every other number in this file belongs to an invented place;
 * (c) a river mouth is called a break-of-bulk point once, as a premise,
 * because the row must explain why ports sit at mouths, and the file never
 * lists the other city-site reasons, which are that seed's.
 *
 * SCOPE-CELL PARTS: the cell has all three parts. Part (i) is carried into
 * `los[0].description` with the qualifier "described" dropped three times per
 * the 2026-09-03 addendum. Parts (ii) and (iii) are the lineage and withheld
 * clauses and live in this guard only.
 *
 * BURNED EXAMPLES (ruling 32/36): part (i) is student-facing, and it names the
 * Mississippi-Missouri-Ohio system, the Great Lakes-St. Lawrence, the Columbia,
 * the Colorado and the Mackenzie together with the water body each reaches. All
 * five are therefore answerable from the objective and are BURNED for items.
 * Every try_yourself below is built on a fresh invented network. Do not
 * "helpfully" move a real system into an item later.
 *
 * ACCURACY NOTE: every square kilometer, every percent and every ton in this
 * file belongs to an invented place. The real-world claims
 * are all long-settled physical drainage facts, each verified this session
 * against a named source and listed in the claim ledger. One phrasing is
 * deliberate: the Colorado is described as a basin that drains TOWARD the Gulf
 * of California on the Pacific side of the divide, never as a river whose water
 * arrives there, because it has not regularly reached the sea since 1960.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped Grade
 * 7 Geography bank the keyed answer was the strictly longest choice 67% of the
 * time; chance with four choices is 25%). The per-item discipline is the
 * point: every distractor states the full wrong STEP that produces it -- the
 * nearest coast read as the destination, a lake with an outlet read as an end,
 * the biggest river in the description read as the one every drop joins, one
 * headwater counted instead of both, the tributary that joins below the town
 * counted as if it joined above, road access counted as water traffic -- and no
 * key was built to be the longest choice because it is the key. Measured as a
 * diagnostic, not as a score, on the finished file: the key is the strictly
 * longest choice in NONE of the three items. Character counts are item 1
 * a 162 / b 157 (key) / c 147 / d 137, item 2 a 10 / b 11 / c 10 / d 10 (key),
 * item 3 a 128 (key) / b 141 / c 136 / d 141. Zero is NOT the target -- chance
 * alone puts a three-item file at zero or one about 84% of the time -- and the
 * inverse tell was checked for as ruling 16 requires: the key is second of four
 * in item 1, tied-shortest with two distractors in item 2, and shortest in item
 * 3 by 8 characters against the nearest distractor, a margin of about 6 percent
 * that no student could see. Nothing was grown or trimmed to move any of these
 * numbers. The three keys sit at ids b, d and a, which is the id set
 * `(3 + 3) mod 4 = 2` requires, omitting c. The four numeric choices in item 2
 * are ordered by the id rule and never by magnitude.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every divide, every stream
 * network and every table is written out in prose inside the segment that needs
 * it, and every item is solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U3_NORTH_AMERICA_RIVER_SYSTEMS_AND_WATERSHEDS: LessonPlan = {
  id: 'evelyn.ms.m8geo.north-america-river-systems-and-watersheds.v1',
  title: 'North America: River Systems & Watersheds',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.north-america-river-systems-and-watersheds',
      standard: 'M8GEO-3.3',
      description:
        'Given a continental divide and tributary networks, determine which ocean a drop of water from a location reaches (Mississippi-Missouri-Ohio system to the Gulf of Mexico; Great Lakes-St. Lawrence to the Atlantic; Columbia and Colorado to the Pacific; Mackenzie to the Arctic), and explain why the largest inland settlements and ports sit at confluences, lake outlets and river mouths (National Geography Standard 7: the physical processes that shape the patterns of Earth\'s surface).',
    },
  ],
  prerequisites: ['m8geo.north-america-climate-controls-in-action'],
  followUps: ['m8geo.north-america-hazard-regions'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make one ridge, not one distance, feel like the thing that decides where water goes, before any routine is named.',
      script:
        'Pour a bottle of water onto the crest of the Continental Divide in the Rocky Mountains and the two halves never meet again. The water that runs off the western slope has started a trip to the Pacific. The water that runs off the eastern slope, along the stretch of the Divide that feeds the Missouri, has started a much longer trip to the Gulf of Mexico. The two halves began a step apart and finish on opposite sides of a continent, and nothing about the spot itself decided that -- only which side of one ridge each half landed on. So here is the first job today: you get a network of ridges, streams, lakes and rivers described to you in words, and from the description alone you say where a drop from any point in it ends up. The second job follows straight from the first. Once you can see where all the water in a region has to funnel through, you can see where the big towns are, because people put their largest inland cities exactly at the points where the network narrows.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-trace-the-network',
      kind: 'concept',
      goal: 'Install the five-step trace, the rule that the side of a divide and not the distance to a coast decides the destination, the addition that happens at a confluence, and the reason the narrow points of a network are where the cities sit.',
      keyIdeas: [
        'THE ROUTINE, IN ORDER, AND IT IS THE SAME EVERY TIME. A tributary joins a larger river instead of reaching the sea on its own, so tracing a drop is walking a chain of junctions, one link at a time. One: find the drop against the nearest divide and say which side of it the drop is on. Two: name the stream that carries water off that side. Three: follow that stream to the first river it joins, then follow that river to the next junction, and keep going downstream. Four: if the chain reaches a lake, do not stop -- find the lake\'s outlet and carry on from there. Five: name the ocean, gulf or sea the last river empties into. Then rewind: start at the mouth, read the chain backwards to the drop, and check that every link still connects.',
        'THE SIDE OF THE DIVIDE DECIDES, AND DISTANCE PROVES NOTHING. A divide is a ridge line, and the only question it asks of a location is which of its two slopes the water runs down. Two points one step apart on opposite sides of a single crest send their water to different oceans. A place four hundred kilometers from the nearest coast can drain to that coast, and a place five kilometers from a coast can drain away from it for two thousand kilometers to a different ocean, because a ridge stands in between. So "which ocean is nearest" is the wrong question, and the answer it gives is the one the ridge was hiding. Find the crest line in the description first, put the location on one side of it, and only then ask where the water goes.',
        'A CONFLUENCE ADDS, SO THE TOTAL GOES UP AT EVERY JUNCTION AND NEVER DOWN. The land that drains through a point on a river is that point\'s upstream drainage area, and at a junction the areas of the two joining branches add together. A branch draining 4,000 square kilometers meeting a branch draining 6,000 gives 10,000 square kilometers draining through the junction -- not 6,000, and not the average of the two. Check by taking the sum apart again: 10,000 minus 6,000 is 4,000, which is the branch you started with. The same addition gives you the SHARE of a river mouth\'s basin that has already passed an inland point: divide the area above that point by the area at the mouth. Ten thousand square kilometers out of a 20,000-square-kilometer basin is 10,000 divided by 20,000, which is 50 percent, and the check is that 50 percent of 20,000 is 10,000.',
        'A LAKE IS A GATE, NOT AN END, SO FIND THE OUTLET BEFORE YOU ANSWER. Water that reaches a lake with an outlet has not arrived anywhere. It has been slowed down and then handed to a single channel, and every drop that entered that lake from any of its feeding rivers leaves by that same channel. That is what makes a lake outlet the narrowest point in a whole drainage network. Only a lake with NO outlet ends a chain, and a description will say so in as many words. When your trace hits a lake, the next line to look for in the description is the one that names what flows out of it.',
        'THE THREE PLACES A NETWORK NARROWS ARE THE THREE PLACES THE BIG INLAND CITIES SIT. A confluence is where two routes become one, so everything moving on either branch has to pass it. A lake outlet is where a whole lake\'s worth of traffic is squeezed into one channel. A river mouth is where the vessel itself has to change -- a break-of-bulk point -- so every cargo that came down the river is unloaded and handled in the same place. Those are not three separate reasons; they are one reason three times over, which is that the site collects traffic with no other way through. So candidate sites are ranked by asking, for each one, how much of the network must pass it, and that is a number you can read straight off the described network.',
        'CHANGE ONE INPUT AND RUN THE TRACE AGAIN, BECAUSE THE ANSWER LIVES IN THE NETWORK AND NOT IN THE PLACE. Move the crest of a divide a few kilometers and a whole valley changes ocean. Take one tributary out of a basin and every share below the junction where it used to join has to be worked out again. Nothing moved on the ground except one link, and the destination, the shares and the best site for a port can all change together. Running it a second time with one input altered is the test that you traced the network instead of guessing from the name of a place.',
      ],
      vocabulary: [
        {
          term: 'watershed',
          definition:
            'all the land whose water drains through one common point, so what puts a piece of land inside it is where a drop from that land ends up.',
        },
        {
          term: 'continental divide',
          definition:
            'a ridge line whose two slopes send their water to different oceans, used to sort a location into one basin or the other.',
        },
        {
          term: 'confluence',
          definition:
            'the point where two streams join into one channel, and therefore the point at which their upstream drainage areas add together.',
        },
        {
          term: 'outlet',
          definition:
            'the single channel by which a lake passes its water downstream, through which everything the lake received has to leave.',
        },
        {
          term: 'upstream drainage area',
          definition:
            'the total area of land that drains through a chosen point on a river, found by adding the areas of every branch above that point.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-trace-three-drops',
      kind: 'worked_example',
      problem:
        'Run the trace straight through on three positions in North America, and name the water body each one reaches.\n\n"Drop one falls on a farm in the hills of western Pennsylvania, on a creek that runs into the Monongahela River. The Monongahela meets the Allegheny at Pittsburgh, and the two together form the Ohio River. The Ohio runs southwest and joins the Mississippi at Cairo, Illinois. The Mississippi runs south to the Gulf of Mexico.\n\nDrop two falls on the northern shore of Lake Erie. Lake Erie drains through the Niagara River into Lake Ontario, and Lake Ontario drains through the St. Lawrence River.\n\nDrop three falls on a snowfield on the crest of the Continental Divide in the northern Rocky Mountains, along a stretch where the western slope drains into the Columbia system and the eastern slope drains into the Missouri. The snowfield lies 200 meters west of the crest."',
      steps: [
        'Drop one, link by link, downstream. The creek runs into the Monongahela. The Monongahela and the Allegheny join at Pittsburgh and form the Ohio. The Ohio joins the Mississippi at Cairo. The Mississippi empties into the Gulf of Mexico. That is three junctions passed -- creek into Monongahela, Monongahela into Ohio, Ohio into Mississippi -- and the answer is the Gulf of Mexico.',
        'Drop two, and this is where a trace usually stops too early. Lake Erie is a lake, so look for its outlet rather than writing down an answer: the Niagara carries Lake Erie\'s water into Lake Ontario. Lake Ontario is a lake too, so look again: its outlet is the St. Lawrence, which reaches the Atlantic Ocean. WRONG: "Lake Erie, because that is the first large body of water the drop reaches." CORRECT: "The Atlantic Ocean, because both lakes on this chain have outlets, and a lake with an outlet is a gate rather than an end."',
        'Drop three, and here the temptation is to measure. Do not measure to a coast; read the side. The snowfield lies 200 meters WEST of the crest, so it is on the western slope, so its meltwater joins the Columbia system, and the Columbia reaches the Pacific Ocean. The 200 meters is not what settles it -- 2 meters or 200 kilometers west of the crest would settle it the same way.',
        'The same two questions -- which side, then which chain -- settle the rest of the continent, and it is worth saying the four big answers out loud. West of the Divide, the Columbia network drains to the Pacific Ocean and the Colorado network drains toward the Gulf of California, on the Pacific side of the continent. East of it, the Mississippi system, fed by the Missouri and the Ohio, drains to the Gulf of Mexico. In the northeast, the Great Lakes drain through the St. Lawrence to the Atlantic. In the far north, the Mackenzie runs north out of Great Slave Lake to the Beaufort Sea, which is part of the Arctic Ocean -- another lake outlet, traced exactly the same way.',
        'Rewind each chain and read it backwards from the mouth. Gulf of Mexico, up the Mississippi, up the Ohio at Cairo, up the Monongahela at Pittsburgh, up the creek to the farm: every link connects. Atlantic Ocean, up the St. Lawrence, into Lake Ontario, up the Niagara, into Lake Erie: every link connects. Pacific Ocean, up the Columbia, up to the western slope of the Divide: every link connects.',
        'Now change ONE input. Move drop three 400 meters east, so that it lands 200 meters east of the same crest instead of 200 meters west of it. Nothing about the snowfield has changed except which slope it sits on. The meltwater now joins the Missouri, the Missouri joins the Mississippi just above St. Louis, and the water finishes in the Gulf of Mexico -- the same water body as drop one, which started most of a continent away in western Pennsylvania.',
        'The check to remember. A 400-meter move across one crest changed the ocean, while a farm most of a continent away shares an ocean with the moved drop. Distance decided nothing in either case. The side of the ridge decided everything, and the chain of junctions did the rest.',
      ],
      answer:
        'Drop one reaches the Gulf of Mexico: creek into the Monongahela, Monongahela and Allegheny into the Ohio at Pittsburgh, Ohio into the Mississippi at Cairo, Mississippi into the Gulf. Drop two reaches the Atlantic Ocean: Lake Erie out through the Niagara into Lake Ontario, Lake Ontario out through the St. Lawrence -- neither lake is an end, because both have outlets. Drop three reaches the Pacific Ocean, because 200 meters west of the crest puts it on the western slope and the western slope feeds the Columbia. Moved 400 meters east, so that it sits 200 meters east of the same crest, that drop feeds the Missouri instead and finishes in the Gulf of Mexico.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-add-the-basin-and-place-the-port',
      kind: 'worked_example',
      problem:
        'Add up a described basin, then say where its inland hub and its port belong.\n\n"On an invented coast, the Corran River reaches the Amber Sea. Four streams feed it. The Aldon drains 3,000 square kilometers and the Brix drains 5,000 square kilometers; they meet at the town of Hale, and below Hale the joined river is called the Corran. The Cleave drains 2,000 square kilometers and joins the Corran at the town of Merrow. The Dray drains 10,000 square kilometers and joins the Corran at Sandell, the town standing where the river meets the sea. No other stream joins the Corran anywhere. Barges can travel all four streams and the Corran; ocean ships can reach Sandell and no further inland."\n\nFind the upstream drainage area at Hale, at Merrow and at Sandell, give each stream its share of the basin, and say which town is the inland hub and which is the port.',
      steps: [
        'Work downstream and add at every junction, because a confluence adds. At Hale the Aldon and the Brix meet: 3,000 plus 5,000 is 8,000 square kilometers draining through Hale. At Merrow the Cleave joins: 8,000 plus 2,000 is 10,000 square kilometers draining through Merrow. At Sandell the Dray joins: 10,000 plus 10,000 is 20,000 square kilometers draining through Sandell, which is the whole basin.',
        'Get the total a second way as a check, by adding the four streams straight across: 3,000 plus 5,000 plus 2,000 plus 10,000 is 20,000 square kilometers. The two routes to the total agree, so no junction was skipped and no area was counted twice.',
        'Turn each stream into a share of the basin by dividing its area by the 20,000 at the mouth. Aldon: 3,000 divided by 20,000 is 0.15, which is 15 percent. Brix: 5,000 divided by 20,000 is 0.25, which is 25 percent. Cleave: 2,000 divided by 20,000 is 0.10, which is 10 percent. Dray: 10,000 divided by 20,000 is 0.50, which is 50 percent.',
        'Invert the shares two ways. Add them: 15 plus 25 plus 10 plus 50 is 100 percent, so nothing has been lost and nothing double counted. Then multiply one back out: 50 percent of 20,000 is 10,000 square kilometers, which is the Dray\'s area exactly as it was given.',
        'Now the settlement question, and the same numbers answer it. Merrow has 10,000 square kilometers above it, which is 10,000 divided by 20,000, or 50 percent of the basin, and every barge coming off the Aldon, the Brix or the Cleave has to pass it. Hale has only 8,000 above it, which is 8,000 divided by 20,000, or 40 percent, because the Cleave joins below Hale and never passes it. WRONG: "Hale is the hub, because Hale is where two rivers meet and only one river joins at Merrow." CORRECT: "Merrow is the hub, because 50 percent of the basin drains through Merrow against 40 percent through Hale, and a junction is worth what it gathers, not how many channels meet there."',
        'Sandell is the port, and its reason is a second reason on top of Merrow\'s. All 20,000 square kilometers, which is 100 percent of the basin, drain through Sandell, so it gathers more than any inland site can. And it is the point where ocean ships stop, so every cargo leaving the basin by water is unloaded from one kind of vessel and loaded onto another right there. Merrow collects. Sandell collects and transfers.',
        'Rewind the input and read the basin backwards to be sure nothing was misread. Sandell 20,000, of which the Dray brought 10,000; Merrow 10,000, of which the Cleave brought 2,000; Hale 8,000, made of the Brix at 5,000 and the Aldon at 3,000. Every subtraction returns a stream: 20,000 minus 10,000 is 10,000, 10,000 minus 2,000 is 8,000, and 8,000 minus 5,000 is 3,000.',
        'Now change ONE input. Suppose the Dray had risen on the far side of the ridge that bounds its valley, so that its whole 10,000 square kilometers drained to a different sea. Sandell would then stand at the mouth of a 10,000-square-kilometer basin instead of a 20,000-square-kilometer one, and Merrow\'s 10,000 would be 10,000 divided by 10,000, which is 100 percent of everything reaching the port, up from 50 percent. Not one river inside the basin changed course. One ridge moved, and the inland hub went from handling half the traffic to handling all of it.',
      ],
      answer:
        'Upstream drainage area: Hale 8,000 square kilometers (3,000 plus 5,000), Merrow 10,000 (8,000 plus 2,000), Sandell 20,000 (10,000 plus 10,000), and adding the four streams straight across gives the same 20,000. Shares of the basin: Aldon 15 percent, Brix 25 percent, Cleave 10 percent, Dray 50 percent, which sum to 100 percent. Merrow is the inland hub, with 50 percent of the basin above it against 40 percent above Hale. Sandell is the port, because 100 percent of the basin drains through it and it is also the point where cargo has to move between barge and ocean ship. If the Dray drained to a different sea, Sandell would gather 10,000 square kilometers and Merrow would rise from 50 percent to 100 percent of what reaches the port.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-trace-to-the-water-body',
      kind: 'try_yourself',
      problem:
        'On the island of Kessit, a ridge called the Dolan Rise runs from north to south down the middle of the island. Streams on the west side of the Rise run into the Vane River, which flows west and empties into the Coral Ocean. Streams on the east side run into the Thackeray River, which flows east into Brant Lake. Brant Lake has one outlet, the Sill River, which runs south from the lake to the Slate Sea. The village of Orrick sits 8 kilometers east of the crest of the Rise, on a creek that runs into the Thackeray. Rain falls on Orrick. Where does that water end up?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Coral Ocean, because Orrick lies only 8 kilometers from the crest and water that close to a divide runs down the shorter side of the ridge to the nearer coast' },
        { id: 'b', text: 'The Slate Sea, because the creek runs into the Thackeray, the Thackeray empties into Brant Lake, and the lake\'s one outlet carries the water south to the sea', correct: true },
        { id: 'c', text: 'Brant Lake, because a river that empties into a lake has reached the end of its journey, so the water Orrick sheds travels no further than the lake' },
        { id: 'd', text: 'The Coral Ocean, because the Vane is the longer of the two rivers described and a drop works its way into the largest river of a landmass' },
      ],
      expectedAnswer: 'The Slate Sea, because the creek runs into the Thackeray, the Thackeray empties into Brant Lake, and the lake\'s one outlet carries the water south to the sea',
      hints: [
        'Do not begin with the coasts. Begin with the crest line: the description says which side of the Rise Orrick sits on, and that alone settles which river system the creek belongs to.',
        'Then follow the chain to its very last link, and remember that a lake with a named outlet passes its water on. Judging by how far Orrick sits from the crest, or by which river sounds like the biggest, are two ways of never walking the chain at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-share-above-the-junction',
      kind: 'try_yourself',
      problem:
        'The Larkin River reaches the sea at the port of Wend. Two streams meet at the inland town of Ashbury: the Ferrow, draining 6,000 square kilometers, and the Gale, draining 9,000 square kilometers. Below Ashbury the joined river is the Larkin. One more stream, the Hesp, draining 10,000 square kilometers, joins the Larkin at the town of Tarn, which lies between Ashbury and Wend. No other stream joins the Larkin anywhere. What share of the land that drains through Wend also drains through Ashbury?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '24 percent' },
        { id: 'b', text: '100 percent' },
        { id: 'c', text: '40 percent' },
        { id: 'd', text: '60 percent', correct: true },
      ],
      expectedAnswer: '60 percent',
      hints: [
        'Add at each junction before you divide anything. Ashbury has two streams above it; Wend has those two plus whatever joins further down. A share is the smaller of the two totals divided by the larger.',
        'Divide the area above Ashbury by the area above Wend, then multiply your answer back by the Wend total and check that the Ashbury total returns. Counting only one of the two upper streams, counting the stream that joins below Ashbury instead, or forgetting that anything joins below Ashbury at all each produce a different wrong share.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-place-the-grain-depot',
      kind: 'try_yourself',
      problem:
        'The Marn River reaches the Verity Ocean at the port of Quill. Two hundred kilometers inland, the Adle and the Brede meet at the town of Redding, and below Redding the joined river is the Marn. Farms in the Adle valley barge 30,000 tons of grain downriver each year, and farms in the Brede valley barge 20,000 tons. A company will build ONE inland depot, where barges are unloaded into larger river boats. It is choosing between Redding; Sennet, 40 kilometers up the Adle; Torr, 40 kilometers up the Brede; and Vay, a road town 30 kilometers from the nearest river, whose roads reach every farm in both valleys. Which site has the most grain passing it by water each year, and how much?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Redding, with 50,000 tons, because the 30,000 tons off the Adle and the 20,000 tons off the Brede both have to pass the junction', correct: true },
        { id: 'b', text: 'Sennet, with 30,000 tons, because the Adle valley barges more grain than the Brede valley and a depot belongs on the busier of the two rivers' },
        { id: 'c', text: 'Vay, with 50,000 tons, because every farm in both valleys can reach Vay by road and a depot should sit close to the farms that supply it' },
        { id: 'd', text: 'Torr, with 20,000 tons, because the Brede is the shorter route down to the ocean and grain loaded at Torr reaches the port in the fewest days' },
      ],
      expectedAnswer: 'Redding, with 50,000 tons, because the 30,000 tons off the Adle and the 20,000 tons off the Brede both have to pass the junction',
      hints: [
        'Grain moving by water can only pass a site that sits on the water, so cross off any site the barges never reach. Then ask of each remaining site which valleys have to send their grain past it.',
        'At a junction the two flows join, so add them; a site above a junction sees only its own valley. Choosing by which valley grows the most, by which trip is shortest, or by which site the roads serve best are three ways of answering a question this stem did not ask.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bigger-branch-and-nearest-coast',
      kind: 'misconception_check',
      question:
        'A student is given this network: "The Wyre drains 4,000 square kilometers and the Odell drains 7,000 square kilometers; they meet at the town of Farrow, and below Farrow the joined river runs to the sea. Elsewhere in the same country, the town of Ives sits 5 kilometers inland from the west coast, on the eastern slope of a coastal ridge; streams on that slope run east into the Verrin River, which crosses the country and empties into the eastern ocean." The student writes: "Below Farrow the river drains 7,000 square kilometers, because the Odell is the bigger of the two rivers that join there." And: "Ives is 5 kilometers from the west coast, so its water reaches the western ocean." What is wrong with each?',
      commonErrors: [
        {
          answer: 'Below Farrow the river drains 7,000 square kilometers, because the Odell is the bigger of the two rivers that join there.',
          misconception:
            'Reading a confluence as a contest that the larger branch wins, so the smaller branch is dropped from the total instead of added into it. A junction is where two drainage areas combine, and neither one replaces the other.',
          correctsTo:
            'At a confluence the upstream drainage areas add. 4,000 plus 7,000 is 11,000 square kilometers draining through the river below Farrow, and the check is to take the sum apart again: 11,000 minus 7,000 is 4,000, which is the Wyre, and 11,000 minus 4,000 is 7,000, which is the Odell. WRONG: "The bigger branch sets the total below the junction." CORRECT: "Both branches set it, because every drop from both of them passes the same channel below Farrow, and 4,000 plus 7,000 is 11,000." That the Odell is the larger branch is true, and it answers a different question: the Odell supplies 7,000 of the 11,000 and the Wyre supplies 4,000, and those two supplies add back to 11,000. Being the larger branch never subtracts the smaller one from the total.',
        },
        {
          answer: 'Ives is 5 kilometers from the west coast, so its water reaches the western ocean.',
          misconception:
            'Letting the nearest coast decide the destination, which skips the one thing that does decide it: which side of the ridge the place sits on. A distance to a coastline is not a link in a drainage chain.',
          correctsTo:
            'Ives sits on the EASTERN slope of the coastal ridge, so its streams run east, away from the coast that is 5 kilometers off, into the Verrin, and the Verrin empties into the eastern ocean. WRONG: "Five kilometers from the west coast, so the water goes west." CORRECT: "The ridge stands between Ives and the west coast, so the water runs down the eastern slope and crosses the whole country to the eastern ocean." The distance to a coast is a fact about how far something is, never a fact about where water goes; the side of the divide is the fact that does the work, and the description states it in the very same sentence that gives the distance.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Trace in order: which side of the divide, which stream carries that side, which river it joins, and what the last river empties into. If the chain hits a lake, find the outlet and keep going.',
        'The side of a ridge decides the ocean. Two points a step apart on opposite slopes finish on different coasts, and a place close to one coast can drain away from it for the width of a continent.',
        'A confluence adds. The upstream drainage area at a junction is the sum of the branches above it: 3,000 plus 5,000 is 8,000, and 8,000 minus 5,000 returns the 3,000.',
        'A share of a basin is the area above a point divided by the area at the mouth. 10,000 out of 20,000 is 50 percent, and the check is that 50 percent of 20,000 is 10,000.',
        'A lake with an outlet is a gate, not an end. Everything that entered the lake leaves through that one channel, which is what makes an outlet the narrowest point in a network.',
        'The largest inland cities sit at confluences, lake outlets and river mouths for one reason three times over: those are the points every route has to pass. A mouth adds one more thing on top, which is the transfer between river vessel and ocean vessel.',
        'Change one input and run the trace again. Move a crest, or take one tributary out of the basin, and the destination, the shares and the best site can all change while nothing else moves at all.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.3', cedTitle: 'North America: River Systems & Watersheds' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
