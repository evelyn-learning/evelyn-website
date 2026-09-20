/**
 * Grade 8 World Geography — GIS & Geospatial Reasoning: Buffers & Proximity
 * Analysis.
 *
 * PROCEDURE-LED row (National Geography Standard 3), shaped on the
 * procedure-led exemplar `m8geo-u1-counts-rates-and-fair-comparison.ts`: the
 * concept segment is a short ordered routine run over described distances
 * rather than a mental model, the first worked example runs the routine
 * straight through on a setback rule, the second repairs two slips in a
 * student's run of a service-radius rule, and both end with an arithmetic
 * inversion AND a one-input contrasting case. Three traps this plan is built
 * to kill: measuring to a landmark that sits on a line feature instead of to
 * the nearest part of the feature, reading a setback's buffer as the zone the
 * rule ALLOWS, and accepting a coverage figure computed at a distance the
 * rule never stated.
 *
 * THE ROUTINE, in the order it is always run:
 *   1. Name three things: the FEATURE the distance is measured from, the
 *      DISTANCE the rule states, and whether the rule wants what is INSIDE
 *      the buffer or what is OUTSIDE it.
 *   2. Give the buffer the shape of the feature -- a circle around a point, a
 *      band of equal width along both sides of a line -- and measure each
 *      location to the NEAREST part of the feature.
 *   3. Subtract: distance against buffer distance gives the verdict and the
 *      margin in one move.
 *   4. Rule on any location sitting exactly on the line from the WORDING of
 *      the rule, since the measurement is what produced the tie.
 *   5. Invert: add each margin back and confirm the location lands on the
 *      rule; confirm the inside and outside groups re-add to the whole list.
 *   Then change ONE input -- the stated distance -- and run it again.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause where it is used, that a place
 * can be described by its nearness to another place (Grade 6,
 * `m6geo-u1-absolute-and-relative-location.ts`) and re-teaches it nowhere:
 * the premise is the half-sentence "Saying a parcel is near the river decides
 * nothing, because near is an opinion" inside keyIdea 1, no keyIdea defines
 * nearness, distance or direction, and the terms that Grade 6 row installs
 * ("absolute location", "relative location", "reference point") appear
 * nowhere in the authored body of this file. The row's scope cell states
 * explicitly that there is NO Grade 7 antecedent, so this guard names a Grade
 * 6 lineage rather than a Grade 7 one; that absence is the signed
 * curriculum's own finding, not an omission here. It ADDS applying a stated buffer
 * distance to each location as a pass-or-fail test, reading the MARGIN
 * alongside the verdict, ruling on an exactly-on-the-line case from the
 * rule's wording, re-running the test at a changed distance and reading which
 * locations flip and in what order, and judging which distance a stated rule
 * actually requires. It STOPS SHORT of measuring distance along a road
 * network or a cost-distance surface: the difference between a straight line
 * and the trip along the roads is NAMED once in keyIdea 6 and once in the
 * second worked example, as the row's scope cell permits, and no route is
 * measured anywhere in the file -- routing is the high-school GIS elective's,
 * as is every software procedure, none of which is described here. Sideways
 * it does NOT combine two or three data layers to answer a where-question
 * (row 2.1, `gis-layers-and-overlay`), does NOT score candidate sites,
 * weight criteria or eliminate on must-haves (row 2.3,
 * `site-selection-with-weighted-criteria`), does NOT compute change between
 * two dates (row 2.4, `change-detection-from-satellite-data`), and does NOT
 * set two competing plans against each other or say which group bears a
 * plan's cost (row 10.2, `evaluating-a-land-use-plan`) -- the second worked
 * example tests ONE stated standard against the data and stops. Three things
 * ARE deliberately allowed, because neighbors sit close and the line is
 * better drawn than avoided: (a) naming network distance in words, twice, with
 * nothing measured along it, because the scope cell withholds it only
 * "beyond naming the difference"; (b) shares expressed as percentages of a
 * fixed total (650 of 1,000 households is 65 percent), which is NOT row 1.1's
 * choose-the-denominator move -- the denominator is fixed by the rule as
 * every household in the town and is never chosen, and the lesson makes the
 * point that the number moves when the DISTANCE moves, not when the
 * denominator does; (c) counting households inside a boundary, which row 7.3
 * also does for elevation bands -- here the boundary is a buffer the student
 * drew from a stated distance, which is this row's whole subject, and no
 * hazard, exposure or risk language appears in the authored body.
 *
 * BURNED CELL EXAMPLES (controller ruling 36): the scope cell names its
 * feature examples in part (i) -- a river, a school, a highway -- so they are
 * spent on TEACHING only. Outside the LO description, which carries the
 * cell's wording, the river appears in the first worked example and in the
 * misconception check, and the school and the highway appear in the hook and
 * in keyIdea 1 and nowhere else. No item uses any of the three: all three
 * item specimens are fresh features the cell does not name -- a
 * drinking-water well, a freight rail line and a health clinic. Do not
 * "helpfully" move a river or a school into an item. The two rule types the
 * cell names (a setback, a service radius) are this row's subject matter
 * rather than specimens, so both are taught by name and both appear in items,
 * but no item's keyed answer is the naming of either one.
 *
 * DEPTH FLOOR NOTE FOR THE FAN-OUT: every item here is answered by a
 * DECISION over described distances -- which locations the rule catches, how
 * many verdicts flip when the distance changes, whether a stated coverage
 * figure survives the distance the rule actually sets. Nothing here asks what
 * a buffer is, what near means, or how to say where a place is. The closest
 * call in this file was keyIdea 2, which explains that a buffer around a line
 * is a band along both sides: that is a statement about the SHAPE of a zone,
 * and it survived because every sentence of it is a measuring instruction
 * ("measure to the nearest part of the feature"), not a definition of
 * distance or of nearness.
 *
 * ACCURACY NOTE: no real place is named anywhere in this file and no real
 * place carries a number. Every town, neighborhood, parcel and settlement is
 * invented and every figure was written for the arithmetic. The claims about
 * the world that remain are geometric or definitional: a buffer around a
 * point is a circle and a buffer around a line is a band along both sides; a
 * straight line is the shortest path between two points, so a route can only
 * be as long or longer; widening a buffer can add locations and can never
 * remove one; and the English wordings ("within", "no closer than", "more
 * than") include or exclude the exact edge as stated. The 800-meters-per-
 * 10-minute-walk figure in the second worked example is STIPULATED by the
 * invented council's own handbook inside the item, not asserted about walking
 * in general.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67
 * percent of the time, and 94 percent at difficulty 4; chance with four
 * choices is 25 percent). The per-item discipline is the point: every
 * distractor states the full wrong STEP that produces it -- the edge ruled
 * out although the rule says "within", the buffer read as picking the
 * farthest location, the test applied to the closest location only, a passed
 * site treated as permanently safe, the blocked count assumed to scale with
 * the distance, an already-blocked site counted as newly flipped, the
 * report's own buffer used instead of the rule's, settlements counted instead
 * of households, and the analysis refused because a straight line is not a
 * walk. Measured as a diagnostic and not as a score: the key is the strictly
 * longest choice in NONE of the three items, and the twelve choices run 120
 * to 157 characters. Zero is not the target -- chance alone puts a three-item
 * file at zero or one about 84 percent of the time, and a course driven to
 * zero is beaten by never picking the longest -- so the inverse was checked
 * too: the key is the strictly SHORTEST choice in one item only, and there by
 * 6 characters out of 133, which is inside noise. Nothing was grown or
 * trimmed to move either number. The
 * three keys sit at ids b, d and c, which is the id set `(2 + 2) mod 4 = 0`
 * requires, omitting a.
 *
 * NOTE ON prerequisites/followUps: the chain is 2.1 -> 2.2 -> 2.3, and both
 * neighbors are written in this same fan-out, so the real loIds are set here
 * (`m8geo.gis-layers-and-overlay` and
 * `m8geo.site-selection-with-weighted-criteria`); they resolve when the
 * controller registers all 40 rows in one batch. The two exemplars ship with
 * empty arrays for a registration-order reason that does not apply to this
 * file.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every distance, parcel and
 * household count is written out in prose inside the segment that needs it,
 * and every item is solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U2_BUFFERS_AND_PROXIMITY: LessonPlan = {
  id: 'evelyn.ms.m8geo.buffers-and-proximity.v1',
  title: 'Buffers & Proximity Analysis',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.buffers-and-proximity',
      standard: 'M8GEO-2.2',
      description:
        'Apply a buffer of a stated distance around a feature (a river, a school, a highway) to decide which locations fall inside or outside it, and evaluate how changing the buffer distance changes the answer and which distance a stated rule (a setback, a service radius) requires (National Geography Standard 3: how to analyze the spatial organization of people, places and environments).',
    },
  ],
  prerequisites: ['m8geo.gis-layers-and-overlay'],
  followUps: ['m8geo.site-selection-with-weighted-criteria'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show a rule turning on a measured distance nobody can see, so the need for a tested line arrives before any vocabulary does.',
      script:
        'Your town runs its school buses on one rule: you get a seat if you live more than 2 kilometers from the school, and you walk if you do not. Two friends live on the same street, four houses apart. One rides. One walks, every day, in the rain. Nothing about those two houses is different except a measured distance, and somewhere between them runs a line nobody has ever painted on the road. That invisible line is a buffer: a zone drawn at a stated distance around a feature, so that one rule can be applied to every location the same way. Towns run on them. No building within 200 meters of the river. Every home within 800 meters of a library. No food cart closer than 50 meters to a school door. No new housing inside the noise strip along the highway. Today you learn how to apply one to a list of locations, how to tell how close a call each one was, and what happens to the answer when somebody changes the distance -- which is the move worth watching, because the distance is the part a person chose.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-the-buffer-test',
      kind: 'concept',
      goal: 'Install the buffer routine over described distances: name the feature, the distance and the side wanted, measure to the nearest part of the feature, subtract for verdict and margin, rule the edge from the wording, and re-run at a changed distance.',
      keyIdeas: [
        'A BUFFER TURNS A DISTANCE RULE INTO A LINE THAT EVERY LOCATION CAN BE TESTED AGAINST. Saying a parcel is near the river decides nothing, because near is an opinion and two people will draw it in two different places. A buffer replaces the opinion with a measurement: the zone made of every point within a stated distance of a chosen feature. Before you test anything, name three things out loud, in this order. One: the FEATURE the distance is measured from, such as the river bank, the school door or the edge of the highway. Two: the DISTANCE the rule states. Three: whether the rule wants what is INSIDE the buffer or what is OUTSIDE it, because a rule that holds building away from a river and a rule that promises a service to nearby homes are built the same way and then want opposite halves. Skip the third one and you can measure everything perfectly and still hand back exactly the wrong list.',
        'THE BUFFER TAKES ITS SHAPE FROM THE FEATURE, AND YOU MEASURE TO THE NEAREST PART OF IT. A buffer around a point, such as a well or a library door, is a circle of that radius around the point. A buffer around a line, such as a river or a rail line, is a band of the same width running along both sides of it, so a 200-meter buffer on a river is a strip 200 meters wide on the north side and 200 meters wide on the south side, 400 meters across in total with the river down the middle. Either way, the distance that counts is the distance straight to the NEAREST part of the feature, and never to a landmark that happens to sit on it: a parcel 120 meters from the bank is 120 meters from the river even when the nearest bridge is half a kilometer away.',
        'SUBTRACT, AND YOU GET THE VERDICT AND THE MARGIN IN ONE MOVE. Set each location\'s distance beside the buffer distance and take the difference. Under a 200-meter setback a parcel at 150 meters is inside the forbidden strip by 50 meters, and a parcel at 400 meters is clear of it by 200 meters. The verdict is one of two words, inside or outside, and it hides how close the call was; the margin is the number that does not. The margin is exactly how far that location would have to move, or how far the stated distance would have to shift, before the verdict flips. Sort the locations by distance and the margins line them all up in the order they will change.',
        'A LOCATION SITTING EXACTLY ON THE LINE IS DECIDED BY THE WORDING OF THE RULE, NOT BY THE GEOMETRY. The measurement cannot break that tie, because the measurement is what produced it. So read the rule\'s own words. WITHIN 300 meters includes a location exactly 300 meters away. AT LEAST 200 meters from the bank, and NO CLOSER THAN 200 meters, both allow a building at exactly 200 meters. MORE THAN 200 meters does not. A stated rule almost always contains one of those phrases, and when it does not, the honest answer names the reading you used and says that the case sat on the edge.',
        'CHANGING THE DISTANCE CHANGES THE ANSWER, AND IT CHANGES IT IN ONE DIRECTION ONLY. Widen a buffer and every location already inside it stays inside; the only thing a wider buffer can do is pull in locations that were outside. Narrow it and only the reverse can happen. That is why the list sorted by distance is worth keeping: it is the order in which locations enter the buffer as it grows, so you can say how many are caught at any distance without measuring a single thing again. It also means a coverage figure can be made to look like almost anything by moving the distance, which is the reason the distance has to come from the rule and be said out loud.',
        'WHICH DISTANCE A RULE REQUIRES COMES FROM WHAT THE RULE IS FOR, AND THE RULE ALSO FIXES HOW DISTANCE IS MEASURED. A setback is written to hold something away from a feature, so its distance is the width of the harm it is holding off. A service radius is written to say who is close enough to use something, so its distance is the trip people will really make. Use a wider buffer than the rule states and the served share climbs without one household moving, which is a claim about the buffer and not about the place. One limit belongs here. A buffer measures the straight line, while the distance along the roads -- what a geographer with the right tool would call network distance -- can be far longer, so a household inside the circle is not always inside the walk. When the rule is written in straight-line distance, the straight line is what you measure, and the difference is worth naming and stopping at.',
      ],
      vocabulary: [
        {
          term: 'buffer',
          definition:
            'the zone made of every point within a stated distance of a chosen feature, used as a test that each location either passes or fails.',
        },
        {
          term: 'setback',
          definition:
            'a rule requiring a minimum distance between a feature and anything built, so the locations it allows are the ones OUTSIDE the buffer.',
        },
        {
          term: 'service radius',
          definition:
            'a distance stated as the limit of what counts as close enough to use a facility, so the locations it counts are the ones INSIDE the buffer.',
        },
        {
          term: 'margin',
          definition:
            'the difference between a location\'s distance and the buffer distance, which is how far that location would have to move for its verdict to flip.',
        },
        {
          term: 'straight-line distance',
          definition:
            'the distance measured directly to the nearest part of a feature, taking no account of the route anyone would travel to get there.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-setback',
      kind: 'worked_example',
      problem:
        'Run the buffer test straight through on a town rule.\n\nThe Wrenford river runs east to west across the town. The council has a new rule: no new building may stand closer than 200 meters to either bank. Four parcels are up for building. "Alder: 150 meters north of the bank. Birch: 400 meters north. Cedar: 50 meters south. Dunlin: 200 meters south." Which parcels may be built on?',
      steps: [
        'Step one: name the feature, the distance and the side the rule wants. The feature is the river bank, and the rule says either bank, so a parcel north of the river and a parcel south of it are tested in exactly the same way. The distance is 200 meters. And the rule wants what is OUTSIDE: the buffer is the forbidden strip, so building is allowed everywhere the strip does not reach. WRONG: "The rule is about the 200-meter strip, so the strip is where the town wants the new buildings." CORRECT: "A setback names the strip that is closed, so the parcels that may be built on are the ones the strip does not cover."',
        'Step two: give the buffer the shape of the feature. The river is a line, so its buffer is a band 200 meters wide on the north side and 200 meters wide on the south side -- 400 meters across in total, with the river down the middle.',
        'Step three: set each distance beside 200 and subtract, which gives the verdict and the margin together. Alder: 150 is less than 200, so Alder is inside the forbidden strip, by 200 minus 150, which is 50 meters. Birch: 400 is greater than 200, so Birch is clear of it, by 400 minus 200, which is 200 meters. Cedar: 50 is less than 200, so Cedar is inside, by 200 minus 50, which is 150 meters.',
        'Step four: rule on the edge from the wording. Dunlin sits at exactly 200 meters, and no amount of measuring can break that tie, because the measuring is what produced it. The rule says no closer than 200 meters, and 200 meters is not closer than 200 meters, so Dunlin is allowed, with a margin of zero. WRONG: "Dunlin is exactly on the line, so it is inside the buffer and cannot be built on." CORRECT: "The wording decides the edge: no closer than 200 allows a building at exactly 200, so Dunlin is allowed, by the narrowest margin there is."',
        'Step five: invert the test to check it. Take the two blocked parcels and add each margin back: 150 plus 50 is 200, and 50 plus 150 is 200, so each one lands exactly on the rule after moving by its own margin. Take the two allowed parcels and subtract: 400 minus 200 is 200 meters of clearance, and 200 minus 200 is zero. Two blocked and two allowed is four parcels, which is every parcel on the list and none of them twice.',
        'Rewind the data and read it backwards: Dunlin 200 south, Cedar 50 south, Birch 400 north, Alder 150 north. Sorted by distance the parcels run Cedar 50, Alder 150, Dunlin 200, Birch 400, and the two blocked ones are simply the first two in that order. The verdict follows from the list of distances, not from which side of the river a parcel sits on.',
        'Now change ONE input and run it again, so the answer is not memorized as a fact about these four parcels. The council widens the setback to 250 meters and changes nothing else. Cedar at 50 and Alder at 150 were already inside and stay inside. Dunlin at 200 is now less than 250, so Dunlin flips from allowed to blocked, by 250 minus 200, which is 50 meters. Birch at 400 is still clear, now by 150. Three blocked and one allowed, and 3 plus 1 is 4. Notice what could NOT happen: no parcel came out of the strip. A wider buffer only ever pulls locations in, and the one it pulled in first was the one with the smallest margin.',
      ],
      answer:
        'Birch and Dunlin may be built on; Alder and Cedar may not. The buffer is a band 200 meters wide on each side of the river. Alder at 150 meters is inside it by 50 meters and Cedar at 50 meters is inside it by 150 meters, so both are blocked. Birch at 400 meters is clear by 200 meters. Dunlin sits at exactly 200 meters, and the rule says no closer than 200, so Dunlin is allowed with a margin of zero. Widening the setback to 250 meters flips Dunlin and nothing else, leaving three blocked and one allowed, because a wider buffer can only pull locations in.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-repair-the-service-radius',
      kind: 'worked_example',
      problem:
        'A student applied a buffer with the wrong distance and then counted the wrong thing. Find both slips, repair them, and give the corrected figure.\n\nOakmere has one library. The council\'s planning handbook counts a 10-minute walk as 800 meters of straight-line distance, and the council\'s standard is that a household is SERVED by the library if it is within a 10-minute walk. The town has four neighborhoods. "Fern Row: 600 meters from the library, 400 households. Granby: 800 meters, 250 households. Ivens: 950 meters, 150 households. Holloway: 1,200 meters, 200 households."\n\nThe student wrote: "Our bus rule counts a household as reachable if it is within 1,200 meters of a stop, so I used 1,200 meters. Every neighborhood is inside that, so the library serves all four neighborhoods, which is 100 percent of the town."',
      steps: [
        'Check the arithmetic first, because a wrong verdict is not always a wrong measurement. Add the households: 400 plus 250 is 650, plus 150 is 800, plus 200 is 1,000. The town holds 1,000 households. And the student is right that every neighborhood lies within 1,200 meters, since the farthest is exactly 1,200. The slip is not in the adding and it is not in the comparing.',
        'Go back to step one of the routine, which the student skipped: the distance has to come from the rule being applied. The rule here is the library standard, and it is written as a 10-minute walk, which the handbook sets at 800 meters. The 1,200 meters belongs to a different rule about a different feature, because a bus stop is not a library. Borrowing it does not serve one extra household; it only makes the buffer bigger.',
        'Re-run the test at 800 meters. Fern Row: 600 is less than 800, so it is served, with 200 meters to spare. Granby: exactly 800, and the standard says within a 10-minute walk, so 800 meters is within 800 meters and Granby is served, with a margin of zero. Ivens: 950 is greater than 800, so it is not served, and it misses by 950 minus 800, which is 150 meters. Holloway: 1,200 is greater than 800, so it is not served, and it misses by 400 meters.',
        'Now the second slip: count the thing the rule is about. The standard is about HOUSEHOLDS, not about neighborhoods. Two of the four neighborhoods are served, which is 50 percent of the neighborhoods, but the two served ones are not average-sized: Fern Row is the largest of the four and Ivens is the smallest. Served households are 400 plus 250, which is 650, out of 1,000. WRONG: "Two neighborhoods out of four are served, so the library reaches half the town." CORRECT: "650 households out of 1,000 are within 800 meters, which is 65 percent, and that is higher than the neighborhood count suggests because the two served neighborhoods are the larger ones."',
        'Invert to check. 65 percent of 1,000 is 650, which is the served count back again. The unserved are 150 plus 200, which is 350, and 350 out of 1,000 is 35 percent. 650 plus 350 is 1,000, and 65 plus 35 is 100, so every household is counted exactly once.',
        'Rewind the data backwards and confirm nothing was misread: Holloway 1,200 meters and 200 households, Ivens 950 and 150, Granby 800 and 250, Fern Row 600 and 400. Sorted by distance the neighborhoods run Fern Row 600, Granby 800, Ivens 950, Holloway 1,200, so Ivens is the next one any wider buffer would reach.',
        'Now change ONE input and run it again. Suppose the council counted a 12-minute walk instead of a 10-minute walk. The handbook\'s own pace is 800 meters in 10 minutes, which is 800 divided by 10, or 80 meters a minute, so 12 minutes is 80 times 12, which is 960 meters; check it the other way round, 960 divided by 80 is 12 minutes. At 960 meters Ivens at 950 comes inside, by 10 meters, and Holloway at 1,200 stays outside. Served households are 650 plus 150, which is 800, and 800 out of 1,000 is 80 percent; 800 plus 200 is 1,000. One decision about a walking time moved the coverage figure from 65 percent to 80 percent while nobody moved house. That is why the distance is read off the rule and stated out loud: the distance is the part a person chose.',
        'One limit to say before leaving this. Every distance here is straight-line distance, because that is how the handbook wrote the standard. The walk along the streets can be longer -- a river with one bridge, a rail line with one crossing -- so a household 800 meters away in a straight line is not always a 10-minute walk away. Measuring along the roads instead is a different tool with a name of its own, network distance, and it answers a different question. The rule in front of you was written in straight lines, so straight lines are what you measure.',
      ],
      answer:
        'The student used the wrong distance and then counted the wrong thing. The library standard is a 10-minute walk, which the handbook sets at 800 meters, not the 1,200 meters of the bus rule. At 800 meters, Fern Row at 600 meters and Granby at exactly 800 are served, while Ivens at 950 misses by 150 meters and Holloway at 1,200 misses by 400. The standard counts households, not neighborhoods: 400 plus 250 is 650 of 1,000 households, which is 65 percent -- not the 100 percent the student reported, and not the 50 percent that counting neighborhoods would give. If the council counted a 12-minute walk, which at 80 meters a minute is 960 meters, Ivens would come inside and the figure would be 80 percent.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-well-protection-buffer',
      kind: 'try_yourself',
      problem:
        'The village of Tern draws its drinking water from one well, and protects it with a rule: no animal pen may stand within 300 meters of the well.\n\n"Hollis pen: 280 meters from the well. Ivy pen: 300 meters. Jarrow pen: 450 meters. Kestrel pen: 120 meters."\n\nWhich pens break the rule?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Hollis and Kestrel, because a pen standing exactly 300 meters away sits on the edge of the buffer and the edge counts as outside it' },
        { id: 'b', text: 'Hollis, Ivy and Kestrel, because the rule covers every pen within 300 meters and a pen exactly 300 meters away is within it', correct: true },
        { id: 'c', text: 'Jarrow only, because 450 meters is the largest distance on the list and a buffer picks out the location farthest from the feature' },
        { id: 'd', text: 'Kestrel only, because a buffer rules on the single closest location and the other three pens are judged against that one' },
      ],
      expectedAnswer: 'Hollis, Ivy and Kestrel, because the rule covers every pen within 300 meters and a pen exactly 300 meters away is within it',
      hints: [
        'The buffer here is a circle of 300 meters around the well, and the rule wants what is INSIDE it. Compare each pen\'s distance with 300 separately, one pen at a time.',
        'One pen sits exactly on the line, and the rule\'s own word settles it rather than the measurement. Watch for three other ways to get this wrong: ruling the exact-300 pen out, reading the buffer as picking the farthest pen instead of the nearest ones, and testing only the closest pen as though the others did not each need their own verdict.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-widen-the-setback',
      kind: 'try_yourself',
      problem:
        'A freight rail line runs north to south through Quarrow. The town rule is that new housing must stand at least 250 meters from the line. Four sites have been proposed.\n\n"Redding: 100 meters from the line. Sperrin: 240 meters. Tolley: 260 meters. Upsall: 600 meters."\n\nThe council now raises the setback to 500 meters. What changes?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nothing changes, because Tolley and Upsall already cleared the 250-meter rule and a site that has passed a setback cannot be caught by a wider one' },
        { id: 'b', text: 'Two sites change, because raising the setback from 250 to 500 meters doubles the distance and so doubles the blocked sites, from two to four' },
        { id: 'c', text: 'Two sites change, Sperrin and Tolley, because both of them sit inside the new 500-meter strip and each one is therefore a fresh block' },
        { id: 'd', text: 'One site changes, Tolley, which goes from allowed to blocked, so the allowed sites fall from two to one and only Upsall is left', correct: true },
      ],
      expectedAnswer: 'One site changes, Tolley, which goes from allowed to blocked, so the allowed sites fall from two to one and only Upsall is left',
      hints: [
        'Work out the two lists and compare them. Which sites are at least 250 meters from the line, and which sites are at least 500 meters from it? The change is whatever moved between those two lists.',
        'A site already blocked at 250 meters is not a new block at 500 meters, and a site that passed the old rule is not safe from the new one. Widening a buffer can only pull sites in, never let one out, and the number it pulls in depends on where the sites sit, not on how much the distance grew.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-clinic-service-radius',
      kind: 'try_yourself',
      problem:
        'A county counts a household as SERVED by a clinic if the household is within 4 kilometers of it. A report on the valley\'s new clinic says it serves 95 percent of the valley\'s households, and states that it measured with a 6-kilometer buffer.\n\n"Marsh End: 1.5 kilometers from the clinic, 500 households. Norfell: 3.8 kilometers, 200 households. Oxley: 5.2 kilometers, 250 households. Pike: 7 kilometers, 50 households."\n\nDoes the data support the report\'s figure?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Supported: 950 of the 1,000 households are within 6 kilometers, which is 95 percent, and the clinic stands in the same spot whichever distance is measured' },
        { id: 'b', text: 'Not supported: two of the four settlements are within 4 kilometers, so the clinic serves 50 percent of the valley rather than 95 percent' },
        { id: 'c', text: 'Not supported: the rule sets the buffer at 4 kilometers, and 500 plus 200 households sit inside it, which is 700 of 1,000, or 70 percent', correct: true },
        { id: 'd', text: 'Not supported: a straight-line distance cannot stand in for the trip a household really makes, so no served share can be worked out from these figures at all' },
      ],
      expectedAnswer: 'Not supported: the rule sets the buffer at 4 kilometers, and 500 plus 200 households sit inside it, which is 700 of 1,000, or 70 percent',
      hints: [
        'The report chose one distance and the county rule states another. Apply the distance the rule states, then add up the households inside it and compare that with the total.',
        'Three wrong steps are waiting here: taking the report\'s 6 kilometers as the buffer, counting settlements instead of households so that a 500-household settlement counts the same as a 50-household one, and refusing to compute anything because a straight line is not a walk when the rule itself is written in straight-line distance.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-measure-to-a-landmark-and-buffer-as-the-allowed-zone',
      kind: 'misconception_check',
      question:
        'A student is working two buffer problems and writes: "Slate Creek runs east to west through the town, and the footbridge is the one spot on it I can point to, so I measured every parcel from the footbridge -- the Quarry Lane parcel is more than 500 meters from the bridge, so a 200-meter setback does not touch it." Then, on a second problem: "The rule says no building within 200 meters of the river, so the parcels within 200 meters of the river are the ones the town is opening up for building." What is wrong with each?',
      commonErrors: [
        {
          answer: 'The Quarry Lane parcel is more than 500 meters from the footbridge, so a 200-meter setback does not touch it.',
          misconception:
            'Measuring to a landmark that sits on the feature instead of to the feature itself. A creek is a line, not a point, so its buffer is a band running along the whole of it, and the bridge is simply one spot on that line with no part to play in the test.',
          correctsTo:
            'A buffer uses the distance to the NEAREST part of the feature. The Quarry Lane parcel lies 120 meters north of the bank and 500 meters east along the creek from the footbridge, so it is indeed more than 500 meters from the bridge and it is 120 meters from the creek. The setback is tested against the second figure: 120 is less than 200, so the parcel is inside the forbidden strip, by 200 minus 120, which is 80 meters; check it by adding the margin back, since 120 plus 80 is 200, exactly the rule. WRONG: "More than 500 meters from the bridge, so the setback does not touch it." CORRECT: "120 meters from the nearest bank, so the setback blocks it by 80 meters." The landmark you can name on a line feature is never the thing you measure to.',
        },
        {
          answer: 'The parcels within 200 meters of the river are the ones the town is opening up for building.',
          misconception:
            'Reading the buffer as the answer instead of as a test, which is what happens when the third thing the rule has to name -- whether it wants the inside or the outside -- is never said out loud. A setback and a service radius are built in exactly the same way and then want opposite halves of the same zone.',
          correctsTo:
            'The wording settles it. "No building within 200 meters of the river" closes that strip; it does not open it. The buffer is the forbidden zone, so the parcels that may be built on are the ones the buffer does not cover: a parcel at 150 meters is inside the strip by 50 meters and is blocked, while a parcel at 400 meters is outside it by 200 meters and is allowed. WRONG: "Within 200 meters of the river is where building is allowed." CORRECT: "Within 200 meters of the river is where building is forbidden, and the allowed parcels are the ones further out than that." The very same 200-meter band, written instead as a service radius -- every home within 200 meters of a new playground, say -- would pick out the opposite list, and nothing in the geometry tells you which; only the rule does.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Name three things before testing anything: the feature the distance is measured from, the distance the rule states, and whether the rule wants what is inside the buffer or what is outside it.',
        'The buffer takes its shape from the feature -- a circle around a point, a band of equal width along both sides of a line -- and the distance that counts is the distance to the nearest part of the feature, never to a landmark sitting on it.',
        'Subtract, and you get the verdict and the margin in one move. The margin is how far a location would have to move before its verdict flips.',
        'A location exactly on the line is decided by the rule\'s wording: within 300 meters includes 300; no closer than 200 meters allows exactly 200; more than 200 meters does not.',
        'Widening a buffer can only pull locations in, and narrowing it can only let them out. Sorted by distance, the locations are already in the order they will flip.',
        'A setback wants the outside and a service radius wants the inside, and the distance each requires comes from what the rule is for. Widen the buffer and a coverage figure climbs without one household moving.',
        'A buffer measures the straight line. The trip along the roads can be much longer, so a location inside the circle is not always inside the walk.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Buffers & Proximity Analysis' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
