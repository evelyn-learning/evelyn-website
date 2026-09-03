/**
 * Grade 6 World Geography — Unit 10 CED 10.4: Using Geography to Plan a Community.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.using-geography-to-plan-a-community.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U10_USING_GEOGRAPHY_TO_PLAN_A_COMMUNITY: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.using-geography-to-plan-a-community.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 10,
  cedTopic: '10.4',
  cedTitle: 'Using Geography to Plan a Community',
  planId: 'evelyn.ms.m6geo.using-geography-to-plan-a-community.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.using-geography-to-plan-a-community.v1' }],
  theory: [
    { loId: 'm6geo.using-geography-to-plan-a-community', content: `A COMMUNITY NEEDS SEVERAL DIFFERENT LAND USES AT ONCE, AND A PLANNER DECIDES WHICH PIECE OF LAND GETS WHICH ONE. A community needs roads to connect places, parks for shared outdoor space, farms to grow food, and housing for people to live in. A COMMUNITY PLANNER is the person who looks at the available LAND USE options for each piece of land and decides which use fits it best.` },
    { loId: 'm6geo.using-geography-to-plan-a-community', content: `THE PLANNER STARTS BY GATHERING LAND, WATER, AND RESOURCE FACTS ABOUT EACH PIECE OF LAND, BEFORE DECIDING ANYTHING. There are three kinds of facts to gather: what shape the land is (flat or steep, clear or rocky), what water is nearby and whether that water can rise and cover the land (a FLOODPLAIN), and what RESOURCE the land offers, such as FERTILE SOIL, useful stone, or nothing special at all.` },
    { loId: 'm6geo.using-geography-to-plan-a-community', content: `EACH LAND USE NEEDS DIFFERENT FACTS TO BE TRUE OF ITS LAND. A FARM needs flat land, fertile soil, and a reliable water source nearby. HOUSING needs land that is flat enough to build on and does not sit on a floodplain, so it stays dry. A ROAD needs to run across land that is fairly flat, and above all needs to connect two places people already travel between. A PARK can use land that does not suit farming or building, such as land that is steep, rocky, or sits right along the water's edge, since a park does not need flat, fertile, or dry ground the way the other three uses do.` },
    { loId: 'm6geo.using-geography-to-plan-a-community', content: `THE SAME LAND CAN SUIT ONE USE WELL AND SUIT ANOTHER POORLY. Flat, fertile land next to a steady stream suits a farm well, but if that same land also floods, it would be a poor spot for housing. Steep, rocky land poorly suits a farm or housing, but it can suit a park just fine.` },
    { loId: 'm6geo.using-geography-to-plan-a-community', content: `A GOOD PLANNING REASON NAMES A LAND, WATER, OR RESOURCE FACT. A planner explains a choice by pointing at a fact about the land itself: it floods, it has fertile soil, it already connects to a road. Saying that people would simply enjoy one choice more is not, by itself, a planning reason -- the facts about the land are what decide it.` },
    { loId: 'm6geo.using-geography-to-plan-a-community', kind: 'definition', title: 'community planner', content: `a person whose job is to decide how the different pieces of land in a community will be used.` },
    { loId: 'm6geo.using-geography-to-plan-a-community', kind: 'definition', title: 'land use', content: `the purpose a piece of land is put to, such as a road, a park, a farm, or housing.` },
    { loId: 'm6geo.using-geography-to-plan-a-community', kind: 'definition', title: 'resource', content: `something found in nature that people can use, such as fertile soil, water, or useful stone.` },
    { loId: 'm6geo.using-geography-to-plan-a-community', kind: 'definition', title: 'fertile soil', content: 'soil that has the nutrients and structure that crops need to grow well.' },
    { loId: 'm6geo.using-geography-to-plan-a-community', kind: 'definition', title: 'floodplain', content: `low, flat land next to a river or stream that can fill with water when the water level rises.` },
  ],
  methods: [
    {
      title: 'Worked farm or park',
      steps: [
        `List the facts for each parcel before choosing anything. Parcel A: flat, soil known to grow good crops, water available all year. Parcel B: steep, rocky, almost no soil, overlooks a lake.`,
        `Check what a farm needs: flat land, fertile soil, and a nearby water source. Parcel A matches all three of these facts.`,
        `Check whether Parcel B could work as the farm instead. Its steep, rocky ground with almost no soil fails two of the three needs, so Parcel B cannot become the farm no matter how much water sits nearby.`,
        `Check what a park needs: land does not have to be flat, fertile, or easy to build on. Parcel B is steep and rocky, which rules it out for a farm or for housing, and its view over the lake makes it a pleasant place to spend time -- exactly the kind of land a park can use.`,
        `Rewind the choice to check it holds up: could the two be swapped? Putting the park on Parcel A would leave good farmland sitting unused, and putting the farm on Parcel B is impossible because the ground cannot support crops. The land, water, and resource facts point the same way from either direction.`,
        `Test a contrasting case so the routine is not overlearned: if a third parcel were flat, had no water nearby, and no soil worth mentioning, it would fit neither a farm nor a park especially well, but a road could still cross it, because a road is decided mainly by what it connects, not by the soil or water underneath it.`,
      ],
      example: { problem: `The town of Foxwood has two open parcels left to plan. Parcel A is flat, has soil that has grown strong crops on nearby farms for years, and lies next to a stream that flows all year. Parcel B is a steep, rocky hillside next to a small lake, with almost no soil, but a wide view over the water. Foxwood needs one new farm and one new park. Using the land, water, and resource facts, decide which parcel becomes the farm and which becomes the park.`, solution: `Parcel A becomes the farm, because it is flat, has fertile soil, and sits next to a steady water source. Parcel B becomes the park, because its steep, rocky ground does not suit a farm or housing, and its view over the lake still makes it useful.` },
      relatedLoIds: ['m6geo.using-geography-to-plan-a-community'],
    },
    {
      title: 'Worked preference vs fact',
      steps: [
        `Separate the resident's reason from a land, water, or resource fact. WRONG: "everyone loves waking up to a view of the water" describes a preference, not a fact about the land itself.`,
        `Check the lake-edge land against what housing needs: flat land that stays dry. The land has flooded twice in five years, so it fails the "stays dry" requirement no matter how nice the view is. CORRECT: housing should sit on land that does not flood.`,
        `Check the field near the road against what a farm needs: flat land, fertile soil, and a water source. Its soil is thin and sandy, which is the opposite of fertile, so it fails a farm's needs even though it is flat.`,
        `Check the same field against what housing needs instead: flat land, stays dry, and already connects to a road. It matches all three, so this field suits housing well, not farming.`,
        `Rewind to check the correction: reread the resident's claim -- the reason given was a view, not a fact, and the one fact available (flooding) points the opposite way from the resident's plan.`,
        `Test a contrasting case: if the lake-edge land had never flooded and stayed dry, the view would no longer disqualify it, and the same routine -- check the facts, not the preference -- would allow housing there. It is the flooding fact that rules it out, not the water view itself.`,
      ],
      example: { problem: `A resident of Foxwood suggests: "The new housing should go right at the edge of the lake, because everyone loves waking up to a view of the water. The flat, dry field farther back, near the existing road, should become the farm instead, since it is out of the way." The field near the road has never grown crops and its soil is thin and sandy. The land at the lake's edge has flooded twice in the past five years. Explain what is wrong with the resident's plan, using the land, water, and resource facts.`, solution: `The housing should go on the field near the road, because it is flat, stays dry, and already connects to a road -- not because of a view. The lake-edge land has flooded twice in five years, so it fails what housing needs, and the sandy field's poor soil means it cannot become the farm either.` },
      relatedLoIds: ['m6geo.using-geography-to-plan-a-community'],
    },
  ],
  pointers: [
    { content: `Students often say "A park should always go on the flattest, most fertile land available, since that is the most valuable land in town." — A park does not need flat, fertile ground -- it can use land unsuited to farming or building, such as land that is steep or rocky. Flat, fertile land next to water is exactly what a farm needs, so giving it to a park instead would waste land a farm requires. WRONG: give the flattest, most fertile land to whichever use seems most valuable. CORRECT: match each piece of land to the use whose stated needs that land's own facts actually meet.`, kind: 'common-error' },
    { content: `Students often say "Once land floods one time, it can never be used for anything ever again." — Flooding rules out housing, because housing needs to stay dry. It does not rule out every use. A park can often still be enjoyed on land that floods sometimes, since nobody lives there permanently, and the same low ground next to a stream is often exactly where a farm wants to be, since it keeps the water source close by. The fact that decides a use is the fact that use actually needs, not one fact applied the same way to every use at once.`, kind: 'common-error' },
    { content: `A community planner decides where roads, parks, farms, and housing each go by reading the land, water, and resource facts of each piece of land, not by which use seems most popular.`, kind: 'tip' },
    { content: `Land facts fall into three kinds: the shape of the land (flat or steep), the water nearby and whether it can flood, and the resource the land offers, such as fertile soil.`, kind: 'tip' },
    { content: `A farm needs flat land, fertile soil, and a reliable water source. Housing needs flat land that stays dry. A road needs to connect places people already travel between. A park can use land unsuited to farming or building.`, kind: 'tip' },
    { content: `The same land can suit one use well and suit another poorly -- flat, fertile land near water is ideal for a farm but can be too flood-prone for housing.`, kind: 'tip' },
    { content: `A good planning reason names a land, water, or resource fact. A preference, such as "people like the view," is not a planning reason on its own.`, kind: 'tip' },
    { content: `One flooding fact rules out only the uses that need to stay dry -- it does not rule out every possible use for that land.`, kind: 'tip' },
    { content: `This is the last lesson in the course, and it uses the same skill the course opened with: look closely at the facts about a place before deciding what belongs there.`, kind: 'tip' },
    { content: `Don't confuse a preference with a planning reason. "People like the view" is not a reason to put housing there. A planning reason must name a land, water, or resource fact: "The land stays dry" or "Fertile soil is here."`, kind: 'common-error' },
    { content: `Flooding rules out housing and farms, but not parks. Don't assume one flooding fact makes land useless for everything. Parks can sit on floodplain land.`, kind: 'gotcha' },
    { content: `A park does NOT need flat, fertile land. In fact, steep, rocky land that fails for farms or housing is often perfect for a park.`, kind: 'vocab-note' },
    { content: `Match land to the use that actually needs what that land has. Don't ask "which use is most important?" Ask "which use's specific needs does this land's facts meet?"`, kind: 'tip' },
    { content: `Gather all three kinds of facts before choosing: shape (flat or steep), water (is there a source, will it flood?), and resource (fertile soil or not). Don't decide without checking all three.`, kind: 'tip' },
    { content: `A road's main job is to connect places people already travel between. Roads don't care as much about flat land or fertile soil as farms do.`, kind: 'edge-case' },
    { content: `If land fails one requirement for a use, it fails that use — even if it's perfect for everything else. Steep, rocky land cannot be a farm, period, no matter how close the water is.`, kind: 'common-error' },
  ],
};
