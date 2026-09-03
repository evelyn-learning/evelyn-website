/**
 * Grade 6 World Geography — Unit 8 CED 8.1: What Makes a Place Unique.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.what-makes-a-place-unique.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U8_WHAT_MAKES_A_PLACE_UNIQUE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.what-makes-a-place-unique.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 8,
  cedTopic: '8.1',
  cedTitle: 'What Makes a Place Unique',
  planId: 'evelyn.ms.m6geo.what-makes-a-place-unique.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.what-makes-a-place-unique.v1' }],
  theory: [
    { loId: 'm6geo.what-makes-a-place-unique', content: `A PLACE HAS TWO KINDS OF CHARACTERISTIC: PHYSICAL AND HUMAN. A physical characteristic is a feature of the land or the weather that would still be there even if nobody ever lived in that place. A human characteristic is a feature that exists because people built it or because people do it there. A full description of a place uses both kinds, not just one.` },
    { loId: 'm6geo.what-makes-a-place-unique', content: `PHYSICAL CHARACTERISTICS INCLUDE A PLACE'S LANDFORMS AND ITS CLIMATE. A landform is a natural feature of the land, such as a valley, a cliff, a plain, or a coastline. Climate is the long-term pattern of weather a place has, such as cold, dry winters or warm, humid summers. Both are part of the land and the sky, not something a person built or chose to do.` },
    { loId: 'm6geo.what-makes-a-place-unique', content: `HUMAN CHARACTERISTICS INCLUDE A PLACE'S BUILDINGS AND ITS ACTIVITIES. A building is a structure people put up, such as a market, a workshop, or a row of houses. An activity is something people do there, such as trading, fishing, farming, or holding a festival. Both describe what people have built and what people do -- not what kind of people they are. Two different places can have very different buildings and activities without either place's people being better or worse in any way.` },
    { loId: 'm6geo.what-makes-a-place-unique', content: `A DESCRIPTION IS COMPLETE ONLY WHEN IT NAMES AT LEAST ONE OF EACH KIND. A description that lists several physical characteristics and nothing else is not complete, and a description that lists several human characteristics and nothing else is not complete either. The number of details does not matter as much as the mix: one physical characteristic and one human characteristic is enough to make a description complete, and ten of only one kind is not.` },
    { loId: 'm6geo.what-makes-a-place-unique', content: `THE CHECK IS TWO QUESTIONS, ALWAYS IN THIS ORDER. Question 1: does the description name a physical characteristic -- a landform, or the climate? Question 2: does the description name a human characteristic -- a building, or an activity? A description passes only when the answer to both questions is yes.` },
    { loId: 'm6geo.what-makes-a-place-unique', content: `A SINGLE PLACE CAN BE DESCRIBED IN MANY DIFFERENT COMPLETE WAYS. There is no single correct pair of details for any place -- one complete description of a town might mention its river and its market, while another complete description of the very same town might mention its cold winters and its fishing boats instead. Any pairing that includes one physical characteristic and one human characteristic counts.` },
    { loId: 'm6geo.what-makes-a-place-unique', kind: 'definition', title: 'physical characteristic', content: `a feature of a place's land or climate that would exist even if no people lived there, such as a landform or a weather pattern.` },
    { loId: 'm6geo.what-makes-a-place-unique', kind: 'definition', title: 'human characteristic', content: `a feature of a place that exists because people built it or because people do it there, such as a building or an activity.` },
    { loId: 'm6geo.what-makes-a-place-unique', kind: 'definition', title: 'landform', content: `a natural feature of the land, such as a valley, a cliff, a plain, or a coastline.` },
    { loId: 'm6geo.what-makes-a-place-unique', kind: 'definition', title: 'climate', content: `the long-term pattern of weather a place has, such as how hot, cold, wet, or dry it usually is.` },
    { loId: 'm6geo.what-makes-a-place-unique', kind: 'definition', title: 'activity', content: `something people do in a place, such as trading, fishing, farming, or holding a festival.` },
  ],
  methods: [
    {
      title: 'Worked run the two questions',
      steps: [
        `Run question 1 first, every time: does the description name a physical characteristic? Rivermill sits in a valley next to a river, which are landforms, and its winters and summers are described, which is its climate. Question 1 is answered yes, twice over.`,
        `Run question 2: does the description name a human characteristic? The buildings have porches facing the water, which is a building detail, and the people gather to harvest and sell apples at a market, which is an activity. Question 2 is answered yes, twice over.`,
        `Both questions are yes, so the description is complete. It does not need a third or fourth detail to count -- it needed one of each kind, and it has more than one of each.`,
        `Check the answer by picking out exactly one detail of each kind, since that is the minimum the routine actually asks for: the valley (physical) and the apple harvest and market (human) are enough on their own to make the description complete.`,
      ],
      example: { problem: `Read this description of a made-up town called Rivermill: "Rivermill sits in a wide valley next to a slow, winding river. Winters are mild and rainy, and summers are warm and dry. Many of the buildings have wide porches facing the water, and every autumn the people who live there gather to harvest apples from nearby orchards and sell them at a market by the river." Name a physical characteristic and a human characteristic in this description, and say whether the description is complete.`, solution: `Physical characteristics: the valley and the river (landforms), and the mild, rainy winters and warm, dry summers (climate). Human characteristics: the porched buildings, and the autumn apple harvest and market (activities). Because the description names at least one physical characteristic and at least one human characteristic, it is complete.` },
      relatedLoIds: ['m6geo.what-makes-a-place-unique'],
    },
    {
      title: 'Worked counting details is not the check',
      steps: [
        `Test the student's reasoning first. WRONG: three details of the same kind make a description complete. CORRECT: the check is not how many details there are, but whether both kinds are present. Three physical details with zero human details still fails question 2 of the routine.`,
        `Confirm that with Rivermill itself. Its description happens to be complete, but not because it has many details -- it is complete because at least one of its details is physical (the valley) and at least one is human (the apple market). A description with three physical details and zero human details would not be complete, even though three is more than one.`,
        `Now run the same two-question routine on Sandport, a description built the opposite way. Question 1: does it name a physical characteristic -- a landform or the climate? Trading, fishing boats, shops, and a festival are all things people do or built. No landform is named and no climate is described.`,
        `Question 2: does it name a human characteristic? Yes -- the docks and shops are buildings, and trading, fishing, and the festival are activities. Question 2 passes easily.`,
        `Question 1 fails, so Sandport's description is not complete, even though it has three separate human details. It would become complete the moment one physical characteristic was added, such as naming the coastline the docks sit along or the harbor's foggy summers.`,
      ],
      example: { problem: `A student looks at Rivermill's description and says: "This description is complete because it mentions the valley, the river, AND the mild winters -- three physical details are plenty." Explain what is wrong with that reasoning, and then check whether a very different description, of a made-up town called Sandport, is complete: "Sandport is a busy trading center. Its docks stay full of fishing boats, its main street has dozens of small shops, and every year its people hold a lantern festival by the harbor."`, solution: `Counting details of the same type does not make a description complete. Sandport's description names three human characteristics (trading, the docks and shops, and the lantern festival) but no physical characteristic at all, so it is not complete -- the same as it would not be complete with three physical details and no human ones. A description is complete only when it names at least one physical characteristic and at least one human characteristic.` },
      relatedLoIds: ['m6geo.what-makes-a-place-unique'],
    },
  ],
  pointers: [
    { content: `Students often say "A description with plenty of details is complete, even if every detail is a physical characteristic like a landform or the climate." — A description is complete when it names at least one physical characteristic and at least one human characteristic, not when it names a certain number of details. WRONG: "three physical details are enough to be complete." CORRECT: "one physical characteristic and one human characteristic are enough, and ten details of only one kind are not." A description of Sandport with three human details and zero physical details is not complete, in exactly the same way a description with three physical details and zero human details is not complete.`, kind: 'common-error' },
    { content: `Students often say "When a description names a place's buildings and activities, it is really describing what kind of people live there." — A human characteristic describes what people have built, such as a market or a workshop, and what people do there, such as trading or holding a festival -- it does not describe what the people themselves are like. WRONG: "Sandport's docks and lantern festival tell you what kind of people live there." CORRECT: "Sandport's docks and lantern festival tell you what people there have built and what they do; they say nothing about the people themselves." Two different made-up towns can have very different buildings and activities without either town's people being better, worse, or more advanced in any way.`, kind: 'common-error' },
    { content: `A place has two kinds of characteristic: physical (landforms and climate) and human (buildings and activities).`, kind: 'tip' },
    { content: `A physical characteristic would exist even if no people lived there. A human characteristic exists because people built it or because people do it there.`, kind: 'tip' },
    { content: `The check is two questions, always in this order: does the description name a physical characteristic, and does it name a human characteristic? Both must be yes.`, kind: 'tip' },
    { content: `A description is complete when it names at least one of each kind. The number of details does not decide it -- the mix of types does.`, kind: 'tip' },
    { content: `Buildings and activities describe what people have built and what people do, not what kind of people they are.`, kind: 'tip' },
    { content: `Many different complete descriptions of the same place are possible, as long as each one pairs at least one physical characteristic with at least one human characteristic.`, kind: 'tip' },
    { content: `Don't count details — count KINDS. Ten physical details with zero human details is NOT complete. One of each kind IS complete.`, kind: 'common-error' },
    { content: `Always run the two questions in order: Question 1 first (physical characteristic?), then Question 2 (human characteristic?). Both must be yes.`, kind: 'tip' },
    { content: `A human characteristic describes what people BUILD and DO there — not what KIND of people they are. A market and fishing boats are human characteristics; 'hardworking people' is not.`, kind: 'vocab-note' },
    { content: `Physical characteristics (landforms, climate) would be there even with zero people. If it requires people, it's human, not physical.`, kind: 'gotcha' },
    { content: `A river is a landform (physical). A fishing fleet that uses the river is an activity (human). The same place can have both — don't mix them up.`, kind: 'vocab-note' },
    { content: `Many different complete descriptions of the same place exist. Describing Rivermill by its valley + apple market is just as complete as describing it by its climate + porched buildings.`, kind: 'edge-case' },
    { content: `Climate is long-term weather pattern (cold winters, dry summers). A single day's rain is weather, not climate. Watch for this when reading descriptions.`, kind: 'vocab-note' },
  ],
};
