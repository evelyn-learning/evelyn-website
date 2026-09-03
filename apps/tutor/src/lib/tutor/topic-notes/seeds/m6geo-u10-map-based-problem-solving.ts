/**
 * Grade 6 World Geography — Unit 10 CED 10.2: Map-Based Problem Solving.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.map-based-problem-solving.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U10_MAP_BASED_PROBLEM_SOLVING: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.map-based-problem-solving.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 10,
  cedTopic: '10.2',
  cedTitle: 'Map-Based Problem Solving',
  planId: 'evelyn.ms.m6geo.map-based-problem-solving.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.map-based-problem-solving.v1' }],
  theory: [
    { loId: 'm6geo.map-based-problem-solving', content: `A REAL MAP PROBLEM RARELY USES ONE MAP PART ONE TIME. Finding a route, or deciding between two routes, usually needs the legend, the compass rose, and the scale all in the same problem -- and if the route has more than one turn, the compass rose and the scale each get checked again for every turn.` },
    { loId: 'm6geo.map-based-problem-solving', content: `READ THE LEGEND FIRST, EVERY TIME. Before doing anything else, use the legend to know what each shape on the map actually stands for. A route cannot be followed correctly if the symbols along it are not yet identified.` },
    { loId: 'm6geo.map-based-problem-solving', content: `A ROUTE WITH A TURN IS MADE OF MORE THAN ONE LEG. A LEG is one straight stretch of the route between two points. Each leg has its own direction, found from the compass rose, and its own distance, found from the scale. Find both for the first leg, then find both again for the next leg -- never carry one leg's direction or distance over to a different leg.` },
    { loId: 'm6geo.map-based-problem-solving', content: `A SCALE BAR'S MARKED SEGMENTS ALREADY GIVE A REAL-WORLD DISTANCE. A scale bar is divided into equal SEGMENTS, and each one is already labeled with the real-world distance it stands for -- for example, a bar divided into segments each labeled to stand for one mile. To find a leg's distance, count how many of those segments the leg spans, then multiply that count by what one segment stands for. To find a whole ROUTE's distance, add every leg's distance together.` },
    { loId: 'm6geo.map-based-problem-solving', content: `A PLANNING PROBLEM THAT COMPARES ROUTES IS SOLVED THE SAME WAY, ONE OPTION AT A TIME. Sometimes the question is not "how far is it" but "which of these two routes is the shorter walk." Finish the first route's total distance completely, then finish the second route's total distance completely, and only then set the two finished totals side by side.` },
    { loId: 'm6geo.map-based-problem-solving', content: `CHECK A FINISHED ROUTE BY RETRACING IT BACKWARD. Once a route is solved, retrace it in reverse: the last leg first, using the OPPOSITE DIRECTION of that leg and the same distance, then the leg before it, and so on back to the start. If the retraced total does not match the forward total, a leg was misread.` },
    { loId: 'm6geo.map-based-problem-solving', kind: 'definition', title: 'route', content: `a path from a starting point to an ending point, which can be made of one leg or several.` },
    { loId: 'm6geo.map-based-problem-solving', kind: 'definition', title: 'leg', content: `one single straight stretch of a route, with its own direction and its own distance, between one point and the next.` },
    { loId: 'm6geo.map-based-problem-solving', kind: 'definition', title: 'segment', content: `one of the equal sections a scale bar is divided into, each one already labeled with the real-world distance it stands for.` },
    { loId: 'm6geo.map-based-problem-solving', kind: 'definition', title: 'multi-step problem', content: `a problem that cannot be finished by checking one map part one single time; the legend, the compass rose, or the scale must be checked again as the route or the comparison continues.` },
    { loId: 'm6geo.map-based-problem-solving', kind: 'definition', title: 'opposite direction', content: `the direction directly across from another one on the compass rose -- the opposite of north is south, and the opposite of east is west.` },
  ],
  methods: [
    {
      title: 'Worked two leg route',
      steps: [
        `Read the legend first. A solid line is a paved path and a dashed line is a dirt trail, so the route changes from one kind of path to another partway to the campsite -- that does not change the direction or distance work, but it confirms the route really does have two separate legs, one on each kind of path.`,
        `Work the first leg. Direction: the compass rose shows the arrow labeled N pointing toward the top of the page, so toward the top of the page is north. Distance: the paved path spans two scale-bar segments, and each segment stands for one mile, so two times one mile is two miles.`,
        `Work the second leg on its own -- do not reuse the first leg's direction or distance. Direction: the dirt trail runs toward the right edge of the page, and with north at the top, the right edge is east. Distance: the dirt trail spans one scale-bar segment, and one times one mile is one mile.`,
        `Combine the two legs. The hiker walks north, then east. The total distance is the first leg plus the second leg: two miles plus one mile is three miles.`,
        `Check by retracing backward. From the campsite, reverse the second leg first: the opposite of east is west, for one mile, back to the junction. Then reverse the first leg: the opposite of north is south, for two miles, back to the trailhead. The retraced distance is one mile plus two miles, which is three miles -- the same as the forward total, so the answer checks out.`,
        `Test a contrasting case so the routine is not overlearned on one compass rose. Imagine this same map instead had its compass rose showing the arrow labeled N pointing toward the right edge of the page. Then the direction that used to be north (toward the top of the page) would now be west, and the direction that used to be east (toward the right edge) would now be north. The page positions of the two legs would not change, but both real-world directions would -- because direction always comes from that one map's own compass rose, never from a memorized default.`,
      ],
      example: { problem: `The Silver Creek Trail Map shows the trailhead, marked with a star, and the campsite, marked with a triangle. Its legend pairs a solid line with paved path and a dashed line with dirt trail. A paved path runs from the trailhead two scale-bar segments toward the top of the page to a trail junction. From the junction, a dirt trail continues one more scale-bar segment toward the right edge of the page, ending at the campsite. The map's compass rose shows its arrow labeled N pointing toward the top of the page. Each scale-bar segment is labeled to stand for one mile. Using the legend, the compass rose, and the scale together, find the two directions the hiker walks, in order, and the total distance from the trailhead to the campsite.`, solution: `The hiker walks north, then east, for a total distance of three miles: two miles on the paved path (two segments at one mile each) plus one mile on the dirt trail (one segment at one mile).` },
      relatedLoIds: ['m6geo.map-based-problem-solving'],
    },
    {
      title: 'Worked compare two routes',
      steps: [
        `Check the distances first, since a segment's labeled distance does not depend on which way the compass rose points. Location 1: three segments at 100 yards each is 300 yards. Location 2: the first leg is four segments at 100 yards each, which is 400 yards; the second leg is two segments at 100 yards each, which is 200 yards; the total is 400 yards plus 200 yards, which is 600 yards. Both distances in the student's statement are correct.`,
        `Now check the directions, and start from what this particular map's compass rose actually shows rather than what is usual. Read the compass rose printed on the Meadowbrook Recreation Area Map: its arrow labeled N points toward the bottom of the page, not the top.`,
        `WRONG: "the route to Location 1 runs south" -- that assumes the bottom of the page is south, which is only true when north is at the top. CORRECT: because this map's arrow labeled N points toward the bottom of the page, the route toward the bottom of the page runs north.`,
        `WRONG: "the route to Location 2 runs north, then west" -- that assumes the top of the page is north and the left edge is west, the usual arrangement again. CORRECT: on this map, the top of the page is south and the left edge is east, so the route to Location 2 runs south, then east.`,
        `Test a contrasting case to confirm the fix is really about this one map. If the Meadowbrook Recreation Area Map instead had its compass rose showing the arrow labeled N pointing toward the top of the page, as most maps do, then a route toward the bottom of the page really would run south, and the student's original directions would have been correct on that map. The directions depend entirely on where that one map's own arrow labeled N is pointing, never on habit.`,
        `Finish the planning question. The distances did not change: Location 1 is 300 yards away and Location 2 is 600 yards away, so Location 1 is still the shorter walk and still the location for the new water station. Only the directions needed correcting.`,
      ],
      example: { problem: `The Meadowbrook Recreation Area Map shows the first aid station, marked with a cross in a circle, Location 1, marked with a solid square, and Location 2, marked with an open square. Its legend pairs a solid line with paved path and a dashed line with gravel path. Organizers want to place a new water station at whichever location is the shorter walk from the first aid station. A paved path runs from the first aid station three scale-bar segments toward the bottom of the page to Location 1. A gravel path runs from the first aid station four scale-bar segments toward the top of the page to a bench, then two more scale-bar segments toward the left edge of the page, ending at Location 2. Each scale-bar segment is labeled to stand for 100 yards. A student assumes north is at the top of this map as usual and says: "The route to Location 1 runs south, and the route to Location 2 runs north, then west. Location 1, at 300 yards, is closer than Location 2, at 600 yards." Check the distances and the directions separately, and correct anything that is wrong.`, solution: `Location 1 is closer, at 300 yards, compared with Location 2's 600 yards, so the water station belongs at Location 1. The distances in the student's statement were correct, but the directions were backward: because this map's compass rose points north toward the bottom of the page, the route to Location 1 actually runs north, and the route to Location 2 runs south, then east.` },
      relatedLoIds: ['m6geo.map-based-problem-solving'],
    },
  ],
  pointers: [
    { content: `Students often say "North is always toward the top of the page, so I do not need to check the compass rose on a new map." — North is wherever a map's own compass rose says it is, and it can be different from map to map. WRONG: "north is always at the top." CORRECT: "north is at the top only when that particular map's own compass rose says so; a map can be drawn with its arrow labeled N pointing toward any edge of the page, and every direction on that map must be read from that arrow, never assumed."`, kind: 'common-error' },
    { content: `Students often say "Once I know one leg of a route is 3 miles, that must be the whole route's distance." — A route's total distance is the sum of every leg it is made of, not just the first one noticed. WRONG: "the first leg's distance is the whole route." CORRECT: "read the scale for every leg of the route, one leg at a time, and add every leg's distance together to get the total distance of the whole route."`, kind: 'common-error' },
    { content: `A map problem with more than one step needs the legend, the compass rose, and the scale used together, and sometimes each one gets checked more than once.`, kind: 'tip' },
    { content: `Read the legend first, always, so every symbol along a route means what this map's own legend says it means.`, kind: 'tip' },
    { content: `A route with a turn in it is made of more than one leg. Find each leg's own direction, from the compass rose, and its own distance, from the scale.`, kind: 'tip' },
    { content: `A scale bar's marked segments already show a real-world distance. Count how many segments a leg spans, multiply by what one segment stands for, and add every leg's distance together to get the whole route's distance.`, kind: 'tip' },
    { content: `North is wherever that map's own compass rose says it is, never assumed to be the top of the page.`, kind: 'tip' },
    { content: `Check a finished route by retracing it backward: reverse each leg, using the opposite direction and the same distance, in reverse order.`, kind: 'tip' },
    { content: `A planning problem that compares two routes is solved the same way: finish each route's total distance completely, then set the two finished totals side by side.`, kind: 'tip' },
  ],
};
