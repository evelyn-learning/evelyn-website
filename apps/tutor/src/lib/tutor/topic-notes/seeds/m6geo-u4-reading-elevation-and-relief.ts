/**
 * Grade 6 World Geography — Unit 4 CED 4.4: Reading Elevation & Relief.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.reading-elevation-and-relief.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U4_READING_ELEVATION_AND_RELIEF: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.reading-elevation-and-relief.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 4,
  cedTopic: '4.4',
  cedTitle: 'Reading Elevation & Relief',
  planId: 'evelyn.ms.m6geo.reading-elevation-and-relief.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.reading-elevation-and-relief.v1' }],
  theory: [
    { loId: 'm6geo.reading-elevation-and-relief', content: `ELEVATION IS HOW HIGH A POINT OF LAND SITS ABOVE SEA LEVEL. Sea level -- the height of the ocean surface -- is the shared starting line that every elevation is measured up from. A place can sit close to sea level or far above it, and a plain-language description usually just says which.` },
    { loId: 'm6geo.reading-elevation-and-relief', content: `RELIEF IS A DIFFERENT QUESTION: HOW MUCH DOES THE HEIGHT CHANGE ACROSS AN AREA? Relief asks about the rise and fall of the land near a place, from its lowest nearby point to its highest, not about how high the place sits overall. An area where the height barely changes has LOW RELIEF. An area where the height changes by a large amount over a short distance has HIGH RELIEF.` },
    { loId: 'm6geo.reading-elevation-and-relief', content: `A PLACE CAN SIT HIGH ABOVE SEA LEVEL AND STILL HAVE LOW RELIEF. Sunridge Flats sits at about 2,000 meters above sea level, and for miles around it the ground stays nearly the same height. It is high in elevation and low in relief at the same time.` },
    { loId: 'm6geo.reading-elevation-and-relief', content: `A PLACE CAN SIT LOW, CLOSE TO SEA LEVEL, AND STILL HAVE HIGH RELIEF. Cove Hollow sits at about 20 meters above sea level, and right around it steep hills rise beside sudden dips, changing height sharply within a short walk. It is low in elevation and high in relief at the same time.` },
    { loId: 'm6geo.reading-elevation-and-relief', content: `TO COMPARE TWO PLACES, ANSWER BOTH QUESTIONS FOR EACH PLACE ON ITS OWN, THEN COMPARE. Find the elevation of place one, then the elevation of place two, and compare those. Separately, find the relief of place one, then the relief of place two, and compare those. Never use one place's elevation to guess its own relief, and never use one place's answer to guess the other place's answer.` },
    { loId: 'm6geo.reading-elevation-and-relief', kind: 'definition', title: 'elevation', content: 'how high a point of land sits above sea level.' },
    { loId: 'm6geo.reading-elevation-and-relief', kind: 'definition', title: 'sea level', content: `the height of the ocean's surface, used as the shared starting point that elevation is measured up from.` },
    { loId: 'm6geo.reading-elevation-and-relief', kind: 'definition', title: 'relief', content: `how much the height of the land changes across an area, from its lowest nearby point to its highest.` },
    { loId: 'm6geo.reading-elevation-and-relief', kind: 'definition', title: 'low relief', content: 'land whose height stays nearly the same across an area, with few large changes.' },
    { loId: 'm6geo.reading-elevation-and-relief', kind: 'definition', title: 'high relief', content: `land whose height changes by a large amount over a short distance, with sharp rises and drops.` },
  ],
  methods: [
    {
      title: 'Worked run the two questions on two towns',
      steps: [
        `Answer the elevation question for each town first, before touching relief at all. Farview sits about 1,850 meters above sea level. Tumble Creek sits about 60 meters above sea level. 1,850 is far greater than 60, so Farview has the higher elevation.`,
        `Now answer the relief question for each town, starting fresh -- do not carry over anything from the elevation answer. Around Farview, the land barely changes height, which is low relief. Around Tumble Creek, the ground rises and falls sharply, which is high relief.`,
        `Put the two answers together in the order the question asked. Farview has the higher elevation. Tumble Creek has the higher relief.`,
        `Check the answer by rereading each description again, this time starting from the relief sentence and working back up to the elevation sentence, to confirm neither answer changes when read in the other order.`,
        `Test the same two questions on a pair that comes out differently, so the routine is not overlearned as always running the same way. Take two high lookouts that sit at almost the same elevation, both far above sea level. One is built where the ground stays broad and nearly level. The other is built where several ridges bunch together and the ground climbs and drops sharply within a few steps. Running the same two questions on this new pair gives one high-elevation place with low relief and one high-elevation place with high relief, even though both start from a similar elevation. The routine has to be run fresh on every place -- one place never tells you the answer for another.`,
      ],
      example: { problem: `Two towns are described. Farview sits about 1,850 meters above sea level. Around Farview, the land barely changes height, staying nearly level for a long stretch in every direction. Tumble Creek sits about 60 meters above sea level, not far above the coastline nearby. Around Tumble Creek, the ground rises and falls sharply, with steep banks right next to sudden drops. Which town has the higher elevation, and which town has the higher relief?`, solution: `Farview has the higher elevation, at about 1,850 meters above sea level, compared with about 60 meters for Tumble Creek. Tumble Creek has the higher relief, because its ground rises and falls sharply nearby, while the land around Farview barely changes height.` },
      relatedLoIds: ['m6geo.reading-elevation-and-relief'],
    },
    {
      title: 'Worked elevation does not decide relief',
      steps: [
        `Take the two sentences apart first. Each one is a separate claim about a separate town, so each needs its own correction.`,
        `Test the Highbank sentence. WRONG: "Highbank sits high above sea level, so it must be the one with more rise and fall." The description says the ground around Highbank stays almost level for a long stretch, which is low relief, not high relief. CORRECT: "Highbank has a high elevation and a low relief."`,
        `Test the Shoreflat sentence. WRONG: "Shoreflat sits low, so it must be the flatter of the two." The description says the ground around Shoreflat climbs and dips sharply within a short distance, which is high relief, not low relief. CORRECT: "Shoreflat has a low elevation and a high relief."`,
        `Name the mistake behind both wrong sentences in one line: assuming that knowing a place's elevation tells you its relief too. The two facts answer two separate questions, and one never decides the other.`,
        `Finish with a contrasting case so the idea is not overlearned the other way -- as though the two facts must always point opposite ways instead. Picture two more towns: one sits high above sea level, and its ground also climbs and dips sharply. The other sits low, close to sea level, and its ground also stays almost level. Running the same two questions on this new pair gives a high-elevation town with high relief and a low-elevation town with low relief, the opposite pattern from Highbank and Shoreflat. Sometimes the two facts point the same way, and sometimes they point opposite ways. The only way to know is to check each fact on its own, every time.`,
      ],
      example: { problem: `A student looks at two other towns and says: "Highbank sits high above sea level, so it must be the one with more rise and fall in its land. And Shoreflat sits low, close to sea level, so it must be the flatter of the two." Highbank is described as sitting about 2,200 meters above sea level, where the ground stays almost level for a long stretch. Shoreflat is described as sitting about 15 meters above sea level, where the ground climbs and dips sharply within a short distance. Both of the student's sentences are wrong. Correct each one.`, solution: `Both sentences are wrong. Highbank has a high elevation but a low relief, because its ground stays almost level. Shoreflat has a low elevation but a high relief, because its ground climbs and dips sharply. Elevation and relief are two separate facts, and neither one decides the other.` },
      relatedLoIds: ['m6geo.reading-elevation-and-relief'],
    },
  ],
  pointers: [
    { content: `Students often say "The higher a place sits above sea level, the more its height changes across the area." — Elevation and relief answer two different questions. Elevation asks how high a place sits above sea level. Relief asks how much that height changes across the area, from its lowest nearby point to its highest. A place can sit high above sea level and still have low relief, if its ground barely changes height. A place can sit low, close to sea level, and still have high relief, if its ground rises and falls sharply over a short distance. WRONG: "a higher elevation always means a higher relief." CORRECT: "elevation and relief have to be checked separately, because one does not decide the other."`, kind: 'common-error' },
    { content: `Students often say "If two places are both described as having a lot of rise and fall in the land, they must sit at about the same elevation." — Two places can both have high relief while sitting at very different elevations. One place with a lot of rise and fall in its land might sit only a little above sea level, while another place with just as much rise and fall might sit far above sea level. Sharing a relief description never tells you whether two places share an elevation. WRONG: "the same relief means the same elevation." CORRECT: "read the elevation and the relief of each place on its own, even when the places sound alike in one way."`, kind: 'common-error' },
    { content: 'Elevation is how high a point of land sits above sea level.', kind: 'tip' },
    { content: `Relief is how much that height changes across an area, from its lowest nearby point to its highest -- a different question from elevation.`, kind: 'tip' },
    { content: `A place can sit high above sea level and still have low relief, if its ground barely changes height.`, kind: 'tip' },
    { content: `A place can sit low, close to sea level, and still have high relief, if its ground rises and falls sharply over a short distance.`, kind: 'tip' },
    { content: `To compare two places, answer the elevation question for each one first, then the relief question for each one, and never assume that one answer decides the other.`, kind: 'tip' },
    { content: `Two places can share an elevation and still have very different relief, and two places can share a relief description and still sit at very different elevations.`, kind: 'tip' },
    { content: `Sometimes elevation and relief point the same way for a place, and sometimes they point opposite ways -- the only way to know is to check each one.`, kind: 'tip' },
  ],
};
