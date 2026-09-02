/**
 * Grade 6 World Geography — Applying Geography to the World Today: Map-Based
 * Problem Solving.
 *
 * PROCEDURE-LED (National Geography Standard 1), shaped after
 * `m6geo-u2-hemispheres-equator-and-prime-meridian.ts` and
 * `m6geo-u2-parts-of-a-map.ts`. This row is a SYNTHESIS lesson: it does not
 * teach a new map part. It teaches the routine for using the legend, the
 * scale, and the compass rose TOGETHER, leg by leg, to finish a route that
 * has more than one step -- and, once a route can be finished, to compare two
 * finished routes and pick the one that fits a stated rule. Every map,
 * distance, and problem in this file is new; none reuses a case, a number, or
 * a named map from `m6geo-u2-parts-of-a-map.ts` or any other shipped row.
 *
 * SCOPE GUARD: this row uses a map's legend, scale, and compass rose together
 * to finish a route made of more than one leg, and to compare two such routes.
 * For each leg it reads a direction from that map's own compass rose and a
 * distance by counting the scale bar's own marked segments and multiplying by
 * the real-world distance one segment already stands for (a segment marked
 * "1 mile" spans two segments is 2 miles); it then adds every leg's distance
 * to get a route's total. That is arithmetic on numbers the scale bar already
 * states in real-world units. This row never introduces a WRITTEN scale
 * ("one inch represents ten miles"), never asks the student to measure a page
 * distance with a ruler and convert it through a scale ratio, and never uses
 * the words "large scale" or "small scale" or the large-scale/small-scale
 * reversal trap -- that whole ratio-conversion mechanism, and the reversal it
 * enables, belongs to Grade 7's `m7geo-u1-map-elements-scale-and-direction.ts`,
 * which is the file this row stops short of. This row also never mentions a
 * map grid or a latitude-longitude coordinate (also Grade 7, same file).
 * Sideways: this row's "planning" half stays narrowly inside "which of two
 * routes is the shorter walk from a shared starting point" -- it is not Unit
 * 10.1's site-and-situation reasoning (choosing a location by what surrounds
 * it) and not Unit 10.4's land-use planning framework (deciding where roads,
 * parks, farms, and housing belong using information about land, water, and
 * resources); those stay in their own rows. What IS deliberately allowed,
 * because this is the row where the earlier map-parts skills finally combine:
 * a route may have more than one leg, each leg gets its own direction and its
 * own distance, and a planning comparison is simply two finished totals set
 * side by side -- all of that is IDENTIFY/LOCATE-depth arithmetic on facts the
 * map already states, never a mechanism the student must infer.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: read every keyIdea and item below and
 * notice what never appears: no written scale, no scale-conversion ratio, no
 * large-scale/small-scale language, no map grid, no coordinate. The only
 * numbers here are marked scale-bar segments, already given in real-world
 * units, added and multiplied the way an eleven-year-old adds up legs of a
 * walk. The traps are a map's own compass rose not matching the usual
 * top-of-page default, and a route's later legs being forgotten -- both are
 * caught by rereading what is printed, never by knowing a mechanism.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, and 94% at difficulty 4; chance with four choices is 25%).
 * Every distractor below states a full, real reasoning error rather than a
 * short wrong label, and no key was built to be the longest choice BECAUSE it
 * is the key -- nor was any key trimmed to avoid being the longest. Item
 * one's three distractors were left as originally drafted, because each
 * already carried a full wrong reason. Items two and three were revised after
 * a review pass noticed their keys needed a genuinely longer explanation
 * (naming which page edge maps to which compass direction; showing both
 * lookouts' full arithmetic) that no distractor was doing the equivalent work
 * of -- so those distractors were rewritten to carry the SAME job honestly: a
 * distractor can state a wrong edge-to-direction mapping in full, or show
 * both lookouts' arithmetic worked through a plausible slip (treating a
 * per-segment value as a whole-leg total, comparing two correctly-computed
 * totals backward, or summing only one leg of a two-leg route), and each one
 * here does. Measured as a diagnostic, not a score, with all twelve choices
 * counted by character: item one's key (125 characters) is the SHORTEST of
 * its four choices, 7 characters behind the longest distractor (132). Item
 * two's key (168 characters) is now also the shortest of its four -- the
 * three revised distractors, each stating a full wrong compass-mapping or a
 * full mapping-plus-order-swap, run to 203, 209, and 250 characters, 35
 * characters ahead of the key at the nearest. Item three's key (195
 * characters) is likewise the shortest of its four -- the three revised
 * distractors, each showing a full but flawed arithmetic comparison, run to
 * 204, 228, and 230 characters, 9 characters ahead of the key at the nearest.
 * So after the revision the key is the SHORTEST choice in all 3 of the 3
 * items, not the longest in any. That is reported here as a diagnostic, not
 * chased toward: the length moved because two items' distractors were
 * honestly filled out to match the key's own necessary explanatory clause,
 * not because any key was shortened -- but a whole course landing at zero
 * long keys would be the DF-3 tell inverted (beatable by never picking the
 * longest), so this file's own zero is not evidence a technique worked, only
 * a fact to carry into the 40-file, 120-item aggregate taken at registration;
 * see the note in `m6geo-u3-earths-moving-plates.ts` for the same caution.
 * The three keys sit at ids b, c, and d -- the id set `(10 + 2) mod 4 = 0`
 * requires, omitting a.
 *
 * NOTE ON prerequisites/followUps: this row's real chain is 10.1
 * (geographic-reasoning-in-everyday-decisions) -> 10.2 (this row) -> 10.3
 * (how-physical-geography-changes-over-time), drawn from the signed fan-out
 * contract's chain table, and both fields are populated with those real
 * loIds, not left empty.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every map in this file --
 * its legend entries, its compass-rose orientation, and its scale-bar
 * segments -- is written out in words precise enough to reason from, and
 * every item is solvable entirely from the text printed inside it. Every map
 * named here (Silver Creek Trail, Meadowbrook Recreation Area, Foxglove
 * Nature Trail, Cobalt Bay Community, Driftwood Harbor) is invented, matching
 * this course's invented-place default for a row that needs no real place at
 * all.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U10_MAP_BASED_PROBLEM_SOLVING: LessonPlan = {
  id: 'evelyn.ms.m6geo.map-based-problem-solving.v1',
  title: 'Map-Based Problem Solving',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.map-based-problem-solving',
      standard: 'M6GEO-10.2',
      description:
        "Use a described map's legend, scale, and compass rose together to solve a multi-step navigation or planning problem, synthesizing the Unit 2 map skills (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).",
    },
  ],
  prerequisites: ['m6geo.geographic-reasoning-in-everyday-decisions'],
  followUps: ['m6geo.how-physical-geography-changes-over-time'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a real map problem needs more than one map part checked more than once, before any routine is named.',
      script:
        'Picture field day at school. Your team gets one paper map of the school grounds and has to find four hidden stations before any other team does, using only that map. Nobody explains it to you. If you only glance at the shapes on the page, you cannot tell what a symbol stands for, you cannot tell which way to walk, and you cannot tell how far the next station really is. Worse, the route to the first station is not one straight line. It turns a corner partway there. You already know the three map parts that answer those questions one at a time. Today you find out how to run all three together, more than once, until an entire route is solved from start to finish -- and how to use the very same routine to decide between two different routes.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-run-the-parts-together',
      kind: 'concept',
      goal: 'Install the leg-by-leg routine for finishing a multi-step route and for comparing two routes.',
      keyIdeas: [
        'A REAL MAP PROBLEM RARELY USES ONE MAP PART ONE TIME. Finding a route, or deciding between two routes, usually needs the legend, the compass rose, and the scale all in the same problem -- and if the route has more than one turn, the compass rose and the scale each get checked again for every turn.',
        'READ THE LEGEND FIRST, EVERY TIME. Before doing anything else, use the legend to know what each shape on the map actually stands for. A route cannot be followed correctly if the symbols along it are not yet identified.',
        'A ROUTE WITH A TURN IS MADE OF MORE THAN ONE LEG. A LEG is one straight stretch of the route between two points. Each leg has its own direction, found from the compass rose, and its own distance, found from the scale. Find both for the first leg, then find both again for the next leg -- never carry one leg\'s direction or distance over to a different leg.',
        'A SCALE BAR\'S MARKED SEGMENTS ALREADY GIVE A REAL-WORLD DISTANCE. A scale bar is divided into equal SEGMENTS, and each one is already labeled with the real-world distance it stands for -- for example, a bar divided into segments each labeled to stand for one mile. To find a leg\'s distance, count how many of those segments the leg spans, then multiply that count by what one segment stands for. To find a whole ROUTE\'s distance, add every leg\'s distance together.',
        'A PLANNING PROBLEM THAT COMPARES ROUTES IS SOLVED THE SAME WAY, ONE OPTION AT A TIME. Sometimes the question is not "how far is it" but "which of these two routes is the shorter walk." Finish the first route\'s total distance completely, then finish the second route\'s total distance completely, and only then set the two finished totals side by side.',
        'CHECK A FINISHED ROUTE BY RETRACING IT BACKWARD. Once a route is solved, retrace it in reverse: the last leg first, using the OPPOSITE DIRECTION of that leg and the same distance, then the leg before it, and so on back to the start. If the retraced total does not match the forward total, a leg was misread.',
      ],
      vocabulary: [
        { term: 'route', definition: 'a path from a starting point to an ending point, which can be made of one leg or several.' },
        { term: 'leg', definition: 'one single straight stretch of a route, with its own direction and its own distance, between one point and the next.' },
        { term: 'segment', definition: 'one of the equal sections a scale bar is divided into, each one already labeled with the real-world distance it stands for.' },
        { term: 'multi-step problem', definition: 'a problem that cannot be finished by checking one map part one single time; the legend, the compass rose, or the scale must be checked again as the route or the comparison continues.' },
        { term: 'opposite direction', definition: 'the direction directly across from another one on the compass rose -- the opposite of north is south, and the opposite of east is west.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-two-leg-route',
      kind: 'worked_example',
      problem:
        'The Silver Creek Trail Map shows the trailhead, marked with a star, and the campsite, marked with a triangle. Its legend pairs a solid line with paved path and a dashed line with dirt trail. A paved path runs from the trailhead two scale-bar segments toward the top of the page to a trail junction. From the junction, a dirt trail continues one more scale-bar segment toward the right edge of the page, ending at the campsite. The map\'s compass rose shows its arrow labeled N pointing toward the top of the page. Each scale-bar segment is labeled to stand for one mile. Using the legend, the compass rose, and the scale together, find the two directions the hiker walks, in order, and the total distance from the trailhead to the campsite.',
      steps: [
        'Read the legend first. A solid line is a paved path and a dashed line is a dirt trail, so the route changes from one kind of path to another partway to the campsite -- that does not change the direction or distance work, but it confirms the route really does have two separate legs, one on each kind of path.',
        'Work the first leg. Direction: the compass rose shows the arrow labeled N pointing toward the top of the page, so toward the top of the page is north. Distance: the paved path spans two scale-bar segments, and each segment stands for one mile, so two times one mile is two miles.',
        'Work the second leg on its own -- do not reuse the first leg\'s direction or distance. Direction: the dirt trail runs toward the right edge of the page, and with north at the top, the right edge is east. Distance: the dirt trail spans one scale-bar segment, and one times one mile is one mile.',
        'Combine the two legs. The hiker walks north, then east. The total distance is the first leg plus the second leg: two miles plus one mile is three miles.',
        'Check by retracing backward. From the campsite, reverse the second leg first: the opposite of east is west, for one mile, back to the junction. Then reverse the first leg: the opposite of north is south, for two miles, back to the trailhead. The retraced distance is one mile plus two miles, which is three miles -- the same as the forward total, so the answer checks out.',
        'Test a contrasting case so the routine is not overlearned on one compass rose. Imagine this same map instead had its compass rose showing the arrow labeled N pointing toward the right edge of the page. Then the direction that used to be north (toward the top of the page) would now be west, and the direction that used to be east (toward the right edge) would now be north. The page positions of the two legs would not change, but both real-world directions would -- because direction always comes from that one map\'s own compass rose, never from a memorized default.',
      ],
      answer:
        'The hiker walks north, then east, for a total distance of three miles: two miles on the paved path (two segments at one mile each) plus one mile on the dirt trail (one segment at one mile).',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-compare-two-routes',
      kind: 'worked_example',
      problem:
        'The Meadowbrook Recreation Area Map shows the first aid station, marked with a cross in a circle, Location 1, marked with a solid square, and Location 2, marked with an open square. Its legend pairs a solid line with paved path and a dashed line with gravel path. Organizers want to place a new water station at whichever location is the shorter walk from the first aid station. A paved path runs from the first aid station three scale-bar segments toward the bottom of the page to Location 1. A gravel path runs from the first aid station four scale-bar segments toward the top of the page to a bench, then two more scale-bar segments toward the left edge of the page, ending at Location 2. Each scale-bar segment is labeled to stand for 100 yards. A student assumes north is at the top of this map as usual and says: "The route to Location 1 runs south, and the route to Location 2 runs north, then west. Location 1, at 300 yards, is closer than Location 2, at 600 yards." Check the distances and the directions separately, and correct anything that is wrong.',
      steps: [
        'Check the distances first, since a segment\'s labeled distance does not depend on which way the compass rose points. Location 1: three segments at 100 yards each is 300 yards. Location 2: the first leg is four segments at 100 yards each, which is 400 yards; the second leg is two segments at 100 yards each, which is 200 yards; the total is 400 yards plus 200 yards, which is 600 yards. Both distances in the student\'s statement are correct.',
        'Now check the directions, and start from what this particular map\'s compass rose actually shows rather than what is usual. Read the compass rose printed on the Meadowbrook Recreation Area Map: its arrow labeled N points toward the bottom of the page, not the top.',
        'WRONG: "the route to Location 1 runs south" -- that assumes the bottom of the page is south, which is only true when north is at the top. CORRECT: because this map\'s arrow labeled N points toward the bottom of the page, the route toward the bottom of the page runs north.',
        'WRONG: "the route to Location 2 runs north, then west" -- that assumes the top of the page is north and the left edge is west, the usual arrangement again. CORRECT: on this map, the top of the page is south and the left edge is east, so the route to Location 2 runs south, then east.',
        'Test a contrasting case to confirm the fix is really about this one map. If the Meadowbrook Recreation Area Map instead had its compass rose showing the arrow labeled N pointing toward the top of the page, as most maps do, then a route toward the bottom of the page really would run south, and the student\'s original directions would have been correct on that map. The directions depend entirely on where that one map\'s own arrow labeled N is pointing, never on habit.',
        'Finish the planning question. The distances did not change: Location 1 is 300 yards away and Location 2 is 600 yards away, so Location 1 is still the shorter walk and still the location for the new water station. Only the directions needed correcting.',
      ],
      answer:
        'Location 1 is closer, at 300 yards, compared with Location 2\'s 600 yards, so the water station belongs at Location 1. The distances in the student\'s statement were correct, but the directions were backward: because this map\'s compass rose points north toward the bottom of the page, the route to Location 1 actually runs north, and the route to Location 2 runs south, then east.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-add-the-legs',
      kind: 'try_yourself',
      problem:
        'The Foxglove Nature Trail Map shows the trailhead entrance, marked with a star, and the lookout tower, marked with a triangle. Its legend pairs a solid line with paved path and a dashed line with dirt path. A paved path runs from the trailhead entrance two scale-bar segments toward the top of the page to a rest bench. From the rest bench, a dirt path continues one more scale-bar segment, also toward the top of the page, to the lookout tower. The scale bar is divided into equal segments, and each one is labeled to stand for two miles. What is the total distance from the trailhead entrance to the lookout tower?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Three miles, found by adding the two segment counts, two plus one, without multiplying either one by what a segment stands for.' },
        { id: 'b', text: "Six miles, found by multiplying each leg's segments by two miles and adding the two legs together: four miles plus two miles.", correct: true },
        { id: 'c', text: 'Eight miles, found by counting the rest bench where the paved path meets the dirt path as an extra segment before multiplying.' },
        { id: 'd', text: "Four miles, found from the paved path alone, stopping at the rest bench instead of continuing on the dirt path to the lookout tower." },
      ],
      expectedAnswer: "Six miles, found by multiplying each leg's segments by two miles and adding the two legs together: four miles plus two miles.",
      hints: [
        "Find each leg's distance separately first: how many miles does the paved path cover, and how many miles does the dirt path cover, before adding them together.",
        'Two segments of the paved path is two times two miles, and one segment of the dirt path is one times two miles. Add those two results together; do not add the segment counts and then multiply once, and do not stop after the first leg.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-read-this-maps-own-rose',
      kind: 'try_yourself',
      problem:
        'The Cobalt Bay Community Map shows the fountain, marked with a circle, and the library, marked with a square. Its legend pairs a solid line with sidewalk and a dashed line with bike path. A sidewalk runs from the fountain three scale-bar segments toward the top of the page to a street corner. From the corner, a bike path continues two more scale-bar segments toward the right edge of the page, ending at the library. The map\'s compass rose shows its arrow labeled N pointing toward the left edge of the page, with three shorter lines branching off it marking the other three directions. In which two directions, in order, does the route from the fountain to the library run?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: "North, then east, treating this map's arrow labeled N as if it pointed toward the top of the page instead of the left edge, which would make the top of the page north and the right edge of the page east." },
        { id: 'b', text: "West, then north, reading this map's arrow labeled N as if it pointed toward the right edge of the page instead of the left edge, which would make the top of the page west and the right edge of the page north." },
        { id: 'c', text: "East, then south, because this map's arrow labeled N points toward the left edge of the page, which makes the top of the page east and the right edge of the page south.", correct: true },
        { id: 'd', text: "South, then east, reading the edge-to-direction mapping correctly -- the top of the page is east and the right edge of the page is south -- but naming the second leg's direction before the first leg's direction, reversing the true order of the route." },
      ],
      expectedAnswer: "East, then south, because this map's arrow labeled N points toward the left edge of the page, which makes the top of the page east and the right edge of the page south.",
      hints: [
        'Do not assume north is at the top of this map. Start from what the compass rose actually shows: the arrow labeled N points toward the left edge of the page.',
        'If north is at the left edge, then going clockwise from north the next direction, east, lands at the top of the page, and continuing clockwise, south lands at the right edge. Work out where each leg of the route actually points from there.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-compare-two-finished-totals',
      kind: 'try_yourself',
      problem:
        'The Driftwood Harbor Map shows the ferry dock, marked with an anchor, Lookout A, marked with a circle, and Lookout B, marked with a diamond. Its legend pairs a solid line with paved boardwalk and a dashed line with sand path. A paved boardwalk runs from the ferry dock two scale-bar segments toward the bottom of the page to Lookout A. A sand path runs from the ferry dock three scale-bar segments toward the top of the page to a bench, then one more scale-bar segment toward the left edge of the page, ending at Lookout B. The compass rose shows its arrow labeled N pointing toward the top of the page, and the scale bar is divided into equal segments, each one labeled to stand for 400 feet. A tour guide wants to send visitors to whichever lookout is the shorter walk from the ferry dock. Which lookout should the guide choose, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: "Lookout B, because Lookout A's two segments make 800 feet, while Lookout B's four segments make only 400 feet in total, treating 400 feet as the whole distance across all four segments instead of what one segment alone stands for." },
        { id: 'b', text: "Lookout B, because Lookout A's two segments make 800 feet and Lookout B's four segments make 1600 feet, and comparing them the wrong way around makes 800 feet look larger than 1600 feet, so Lookout A must be the farther lookout." },
        { id: 'c', text: "Lookout B, because Lookout A's two segments make 800 feet, while Lookout B's last leg alone, one segment, is 400 feet, and 400 feet is less than 800 feet, without adding in the first leg's three segments." },
        { id: 'd', text: "Lookout A, because two segments of 400 feet each is 800 feet, while Lookout B's two legs, three segments plus one segment, add up to four segments, or 1600 feet, and 800 feet is the shorter walk.", correct: true },
      ],
      expectedAnswer: "Lookout A, because two segments of 400 feet each is 800 feet, while Lookout B's two legs, three segments plus one segment, add up to four segments, or 1600 feet, and 800 feet is the shorter walk.",
      hints: [
        "Find the full distance to each lookout first, leg by leg, before comparing anything. Lookout B's route has two legs, so both have to be added together.",
        'Two segments at 400 feet each is 800 feet for Lookout A. For Lookout B, add the two legs\' segments together first, three plus one, then multiply the total by 400 feet, or multiply each leg separately and add the results -- both give the same total.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-default-north-and-one-leg',
      kind: 'misconception_check',
      question:
        'A student solving a map problem says: "North is always toward the top of the page, so I do not need to check the compass rose on a new map. And once I know one leg of a route is 3 miles, that must be the whole route\'s distance, since 3 miles already sounds like a lot of walking." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'North is always toward the top of the page, so I do not need to check the compass rose on a new map.',
          misconception:
            'Treating the usual position of north, at the top of the page, as a fact about the world, because most maps happen to be drawn that way, instead of a choice each individual map maker makes for that one map.',
          correctsTo:
            "North is wherever a map's own compass rose says it is, and it can be different from map to map. WRONG: \"north is always at the top.\" CORRECT: \"north is at the top only when that particular map's own compass rose says so; a map can be drawn with its arrow labeled N pointing toward any edge of the page, and every direction on that map must be read from that arrow, never assumed.\"",
        },
        {
          answer: "Once I know one leg of a route is 3 miles, that must be the whole route's distance.",
          misconception:
            'Stopping at the first leg\'s distance because it already sounds like a reasonable answer for a route, instead of checking whether the route has more than one leg.',
          correctsTo:
            'A route\'s total distance is the sum of every leg it is made of, not just the first one noticed. WRONG: "the first leg\'s distance is the whole route." CORRECT: "read the scale for every leg of the route, one leg at a time, and add every leg\'s distance together to get the total distance of the whole route."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A map problem with more than one step needs the legend, the compass rose, and the scale used together, and sometimes each one gets checked more than once.',
        'Read the legend first, always, so every symbol along a route means what this map\'s own legend says it means.',
        'A route with a turn in it is made of more than one leg. Find each leg\'s own direction, from the compass rose, and its own distance, from the scale.',
        'A scale bar\'s marked segments already show a real-world distance. Count how many segments a leg spans, multiply by what one segment stands for, and add every leg\'s distance together to get the whole route\'s distance.',
        'North is wherever that map\'s own compass rose says it is, never assumed to be the top of the page.',
        'Check a finished route by retracing it backward: reverse each leg, using the opposite direction and the same distance, in reverse order.',
        'A planning problem that compares two routes is solved the same way: finish each route\'s total distance completely, then set the two finished totals side by side.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.2', cedTitle: 'Map-Based Problem Solving' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
