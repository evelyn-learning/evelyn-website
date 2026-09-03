/**
 * Grade 6 World Geography — Unit 4 CED 4.2: Coastal & Connecting Landforms.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.coastal-and-connecting-landforms.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U4_COASTAL_AND_CONNECTING_LANDFORMS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.coastal-and-connecting-landforms.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 4,
  cedTopic: '4.2',
  cedTitle: 'Coastal & Connecting Landforms',
  planId: 'evelyn.ms.m6geo.coastal-and-connecting-landforms.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.coastal-and-connecting-landforms.v1' }],
  theory: [
    { loId: 'm6geo.coastal-and-connecting-landforms', content: `ALL FOUR OF TODAY'S WORDS ARE DEFINED BY ONE THING: HOW MUCH WATER TOUCHES A PIECE OF LAND, AND WHAT THAT LAND IS ATTACHED TO. None of the four is defined by size, by shape on its own, or by what is built on it. Picture tracing the whole edge of a piece of land with your finger. How much of that edge is water, and wherever it is not water, what land does it lead to?` },
    { loId: 'm6geo.coastal-and-connecting-landforms', content: `AN ISLAND IS LAND WITH WATER ALL THE WAY AROUND IT. Trace its entire edge and every part of that edge is water. An island has no connection to any larger landmass at all -- to reach one, you must cross water no matter which direction you come from.` },
    { loId: 'm6geo.coastal-and-connecting-landforms', content: `A PENINSULA IS LAND THAT REACHES OUT INTO WATER AND ENDS THERE, STILL ATTACHED ON ONE SIDE. Trace its edge and water touches most of it -- picture three sides out of four -- while the one remaining side stays joined to a larger landmass. A peninsula has exactly one way in or out by land: back the way it is attached. Every other direction runs into water.` },
    { loId: 'm6geo.coastal-and-connecting-landforms', content: `AN ISTHMUS IS THE OPPOSITE KIND OF NARROW STRIP: IT CONNECTS LAND TO LAND INSTEAD OF ENDING IN WATER. Picture a narrow strip of land with water running along its two long sides, but at each end the strip widens into a separate, larger area of land. Trace a peninsula's edge and you run into water and stop. Trace either long side of an isthmus and, instead of stopping in water, you reach a whole different area of land at the far end.` },
    { loId: 'm6geo.coastal-and-connecting-landforms', content: `THE ONE-QUESTION CHECK FOR THE CONFUSABLE PAIR: does the narrow strip lead to MORE LAND at its far end, or does it leave you surrounded by WATER there instead? More land at the far end names an isthmus. Water at the far end names a peninsula. A peninsula dead-ends in water. An isthmus connects two land areas and dead-ends in neither.` },
    { loId: 'm6geo.coastal-and-connecting-landforms', content: `COAST NAMES THE EDGE ITSELF, NOT A SHAPE MADE OF A CERTAIN NUMBER OF WATERY SIDES. A coast is simply the strip of land running right along an ocean or a sea, wherever land and salt water meet. Every piece of land that touches an ocean or a sea has a coast along that edge -- a mainland has one, a peninsula has one, and an island has one running all the way around it. Coast answers a different question than the other three words: not how much water surrounds the land, but simply where the land and the water meet.` },
    { loId: 'm6geo.coastal-and-connecting-landforms', kind: 'definition', title: 'island', content: 'land with water on every side and no connection to any larger landmass.' },
    { loId: 'm6geo.coastal-and-connecting-landforms', kind: 'definition', title: 'peninsula', content: `land that reaches out into water and ends there, with water on most sides but still attached to a larger landmass on one side.` },
    { loId: 'm6geo.coastal-and-connecting-landforms', kind: 'definition', title: 'isthmus', content: `a narrow strip of land with water along its two long sides that connects two larger areas of land at its ends.` },
    { loId: 'm6geo.coastal-and-connecting-landforms', kind: 'definition', title: 'coast', content: `the strip of land running along the edge of an ocean or a sea, wherever land and salt water meet.` },
  ],
  methods: [
    {
      title: 'Worked run the routine three features',
      steps: [
        `Take feature (1). Check the edge one direction at a time: north is water, east is water, south is water -- three sides are water. The remaining side, west, is not water; it stays joined to Torvane. Water on most sides, still attached on one: that matches PENINSULA.`,
        `Take feature (2). Check the two long sides first: north is water for the whole length, and south is water for the whole length. Now check both ends: the western end widens into Torvane, and the eastern end widens into Ravelle, a separate, larger area of land. Water on both long sides, land at both ends: that matches ISTHMUS.`,
        `Take feature (3). Check every edge: all of it is water, and no side connects to Torvane, Ravelle, or anywhere else. Water on every side, attached to nothing: that matches ISLAND.`,
        `Check by rewinding each answer against its own description. Feature (1) cannot be an island, because the west edge is not water. It cannot be an isthmus, because only one side is attached to land, not two ends. Peninsula is the only definition left standing, and it fits every sentence given.`,
        `Test a contrasting case so the isthmus/peninsula check is not overlearned on one example. Suppose a fourth narrow strip had water along both long sides, but its western end widened into Torvane while its eastern end simply ran out into open water with no land at all. One end leads to land; the other end leads only to water. That strip fails the isthmus test, because an isthmus needs land at both ends, not one. It passes the peninsula test instead: it is attached to a larger landmass on one side and ends in water everywhere else.`,
      ],
      example: { problem: `A mapmaker is describing a made-up region called Torvane. Read the three descriptions below -- there is no map, only the words. Name each landform.

(1) A piece of land has water along its north, east, and south edges. On its west edge it is attached to the rest of Torvane, with no water breaking that connection.

(2) A narrow piece of land has water running along its whole north edge and water running along its whole south edge. At its western end it widens into Torvane. At its eastern end it widens into a completely separate country called Ravelle.

(3) A piece of land has water along every one of its edges. It is not attached to Torvane, to Ravelle, or to any other land at all.`, solution: `(1) is a peninsula, because water touches three of its sides while one side stays attached to Torvane. (2) is an isthmus, because it is a narrow strip with water along both long sides that widens into a separate, larger area of land at each end. (3) is an island, because water touches every edge and it is attached to nothing.` },
      relatedLoIds: ['m6geo.coastal-and-connecting-landforms'],
    },
    {
      title: 'Worked correct the two claims',
      steps: [
        `Take the peninsula/isthmus claim first. WRONG: "a peninsula and an isthmus are the same, since both are narrow strips of land with water next to them." The mistake is noticing that both involve land next to water, then stopping before checking what sits at the far end.`,
        `Run the one-question check on a peninsula: aside from the one attached side, does tracing the edge ever reach more land, or does it run into water every other way? It runs into water every other way -- there is no far end that leads to land.`,
        `Run the same check on an isthmus: tracing either long side, does it run into water forever, or does it reach a separate area of land? It reaches a separate, larger area of land at the far end -- and there are two such ends, one on each long side.`,
        `CORRECT: a peninsula dead-ends in water on every side but the one it is attached by. An isthmus dead-ends in neither direction, because it connects two land areas instead of ending at all.`,
        `Now take the island/coast claim. WRONG: "an island cannot have a coast, because a coast is only found on a mainland." The mistake is treating coast as a fourth shape in the same list as island, peninsula, and isthmus, instead of a different question entirely.`,
        `Check the coast definition against three different shapes. A mainland edge that meets an ocean has a coast there. A peninsula, since it also touches an ocean, has a coast running along its water-touching sides. An island, since water touches it on every side, has a coast running all the way around it. CORRECT: an island does have a coast -- in fact one that circles its whole edge, because coast simply names wherever land meets an ocean or a sea, not one particular shape.`,
      ],
      example: { problem: `A student writes: "A peninsula and an isthmus are really the same landform, since both are narrow strips of land with water next to them. Also, an island cannot have a coast, because a coast is only found on a mainland." Both sentences are wrong. Correct each one.`, solution: `A peninsula dead-ends in water on every side but one; an isthmus connects to more land at both ends, so the two are not the same landform. An island does have a coast -- water touches every side of it, so its coast runs all the way around, because coast names wherever land meets an ocean or a sea, not a specific shape.` },
      relatedLoIds: ['m6geo.coastal-and-connecting-landforms'],
    },
  ],
  pointers: [
    { content: `Students often say "A peninsula and an isthmus are just two names for the same kind of narrow land, since both have water right next to them." — Water next to the land is true of both, but that is not the whole definition of either one. A peninsula reaches out into water and dead-ends there, attached to a larger landmass on only one side. An isthmus runs the opposite way: it has water along its two long sides, but at each end it widens into a separate, larger area of land, so it connects land to land instead of ending in water. WRONG: "a peninsula and an isthmus are the same because both have water beside them." CORRECT: "a peninsula ends in water on every side but one; an isthmus connects two land areas and does not end in water at either of its ends."`, kind: 'common-error' },
    { content: `Students often say "Since an island is the landform most surrounded by water, an island and a coast must be the same thing too." — Island, peninsula, and isthmus are each defined by how much water touches the land and what the land connects to. Coast is not measured that way at all -- it simply names the strip of land right where land meets an ocean or a sea, whatever shape that land is. An island does have a coast: because water touches every side of an island, its coast runs all the way around it. Coast is not a rival to island; every island has one.`, kind: 'common-error' },
    { content: `All four words are defined by how much water touches a piece of land and what that land is attached to, not by size or by what is built on it.`, kind: 'tip' },
    { content: 'An island has water on every side and connects to no larger land at all.', kind: 'tip' },
    { content: `A peninsula has water on most of its sides but stays attached to a larger landmass on the remaining side -- trace its edge and you dead-end in water everywhere except that one attached side.`, kind: 'tip' },
    { content: `An isthmus is a narrow strip with water along its two long sides, but at each end it widens into a separate, larger area of land -- trace either long side and you reach more land, never a dead end in water.`, kind: 'tip' },
    { content: `The one-question check for the confusable pair: does the strip lead to more land at its far end (isthmus) or does it leave you surrounded by water there instead (peninsula)?`, kind: 'tip' },
    { content: `Coast names the edge itself -- the strip of land wherever it meets an ocean or a sea -- and every piece of land that touches an ocean or a sea has one, mainland, peninsula, and island alike.`, kind: 'tip' },
  ],
};
