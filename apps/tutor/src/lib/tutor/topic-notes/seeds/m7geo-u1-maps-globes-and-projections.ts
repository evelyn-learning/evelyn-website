/**
 * Grade 7 World Geography — Unit 1 CED 1.1: Maps, Globes & Projections.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7geo.maps-globes-and-projections.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7GEO_U1_MAPS_GLOBES_AND_PROJECTIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7geo.maps-globes-and-projections.v1',
  course: 'Grade 7 World Geography',
  cedUnit: 1,
  cedTopic: '1.1',
  cedTitle: 'Maps, Globes & Projections',
  planId: 'evelyn.ms.m7geo.maps-globes-and-projections.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7geo.maps-globes-and-projections.v1' }],
  theory: [
    { loId: 'm7geo.maps-globes-and-projections', content: `A GLOBE IS THE ONLY ACCURATE MODEL OF EARTH'S SHAPE. Earth is very nearly a sphere, so a round model can keep everything right at once: the shape of each landmass, how much area it covers, the distances between places, and the directions from one place to another. A globe is also awkward. You cannot fold it into a backpack, you cannot see the whole world at one glance, and you cannot write much on it. That is why flat maps exist at all.` },
    { loId: 'm7geo.maps-globes-and-projections', content: `A MAP PROJECTION IS A RULE FOR MOVING PLACES FROM THE ROUND EARTH ONTO FLAT PAPER. It is not a photograph and it is not a copy. It is a set of instructions: this point on the globe goes to this point on the page. Different rules give different-looking world maps of the same Earth. That is why two world maps on two classroom walls can disagree about how big Greenland looks and both be drawn correctly.` },
    { loId: 'm7geo.maps-globes-and-projections', content: `FOUR THINGS CAN BE DISTORTED: SHAPE, AREA, DISTANCE AND DIRECTION. Shape means whether a country looks like its real outline. Area means whether the amount of land is drawn in correct proportion to other land. Distance means whether the space between two places matches the real gap. Direction means whether the way from one place to another is drawn correctly. NO FLAT MAP KEEPS ALL FOUR AT ONCE. Mathematicians proved that this is impossible, the way they proved you cannot write the largest whole number. It is a fact about round surfaces, not a flaw in map-making and not a mistake anybody made.` },
    { loId: 'm7geo.maps-globes-and-projections', content: `CYLINDRICAL PROJECTIONS, SUCH AS THE MERCATOR, ARE DRAWN AS IF THE GLOBE WERE WRAPPED IN A TUBE OF PAPER. The Mercator projection was drawn in the 1500s for sailors, and it does one job beautifully: a straight line on it is a course of one steady compass direction, so a ship can follow it. Shapes stay close to correct inside a small area. The price is area. The stretching grows larger and larger as you move away from the Equator toward the poles, so land in the far north and far south is drawn much bigger than it is. Antarctica is smeared into a wide band along the bottom of the page.` },
    { loId: 'm7geo.maps-globes-and-projections', content: `EQUAL-AREA PROJECTIONS KEEP SIZES IN CORRECT PROPORTION, AND PAY FOR IT IN SHAPE. On an equal-area world map, if one country covers twice the land of another, it is drawn covering twice the space, everywhere on the map. Continents near the edges look squashed or leaned over instead. Some equal-area maps are even cut apart, with wedge-shaped gaps left in the oceans, which is the flattened orange peel again. There are also COMPROMISE projections, which keep nothing perfectly and spread a little error over everything so the whole map looks reasonable.` },
    { loId: 'm7geo.maps-globes-and-projections', content: `CHOOSE THE PROJECTION THAT PROTECTS WHAT YOUR QUESTION NEEDS. Ask what the map has to get right, then pick a rule that gets that right. Comparing how much land two continents cover is an AREA question, so use an equal-area map. Steering a boat or a plane on a steady heading is a DIRECTION question, so a Mercator map earns its keep. One more thing to unlearn: north is at the top because mapmakers agreed to put it there, not because Earth has a top. Space has no up.` },
    { loId: 'm7geo.maps-globes-and-projections', kind: 'definition', title: 'globe', content: `a round model of Earth, the only model that keeps shape, area, distance and direction all correct at the same time.` },
    { loId: 'm7geo.maps-globes-and-projections', kind: 'definition', title: 'map projection', content: 'a rule for moving places from the round surface of Earth onto a flat map.' },
    { loId: 'm7geo.maps-globes-and-projections', kind: 'definition', title: 'distortion', content: `the stretching or squashing of shape, area, distance or direction that happens when a round Earth is drawn flat.` },
    { loId: 'm7geo.maps-globes-and-projections', kind: 'definition', title: 'Mercator projection', content: `a cylindrical projection on which a straight line is a steady compass course, and land is drawn larger and larger toward the poles.` },
    { loId: 'm7geo.maps-globes-and-projections', kind: 'definition', title: 'equal-area projection', content: `a projection that draws every landmass in correct size proportion to every other, at the cost of shape.` },
    { loId: 'm7geo.maps-globes-and-projections', kind: 'definition', title: 'compromise projection', content: `a projection that keeps no property exactly right but shares out the distortion so the whole map looks reasonable.` },
  ],
  methods: [
    {
      title: 'Worked greenland and Africa',
      steps: [
        `Name the projection and what it is built to do. This is a Mercator map, a cylindrical projection. Its job is direction: a straight line drawn on it is a course of one steady compass heading.`,
        `Ask what it gave up to do that job. Every flat map gives up something. Mercator keeps direction, and keeps shapes roughly right inside a small area, by stretching area.`,
        `Find where the stretching lives. On this projection the stretching is small near the Equator and grows larger and larger the farther you go north or south. Near the poles it is enormous.`,
        `Place the two landmasses in that pattern. Africa straddles the Equator, right where the stretching is smallest, so it is drawn close to its true share of the page. Greenland sits far to the north, deep in the region where the stretching is huge, so it is blown up.`,
        `Put the two facts together. Greenland is enlarged a great deal and Africa hardly at all, so on the page they end up looking similar. That is the projection working exactly as its rule says, not an error and not anybody playing a trick.`,
        `State the real relationship, and how to check it. Africa is very much larger than Greenland. To compare land sizes honestly, do not use a Mercator map at all. Look at a globe, or use an equal-area projection, which is built to keep sizes in proportion.`,
      ],
      example: { problem: `On a Mercator world map, Greenland, a large island in the far north, is drawn looking about as large as the whole continent of Africa. Africa is very much larger. Explain how a correctly drawn map can show something so misleading.`, solution: `The Mercator projection stretches area more and more toward the poles. Greenland lies far north and is enlarged a great deal; Africa sits on the Equator and is barely enlarged, so the two look similar on the page. In reality Africa is very much larger, which a globe or an equal-area map shows correctly.` },
      relatedLoIds: ['m7geo.maps-globes-and-projections'],
    },
    {
      title: 'Worked pick the projection',
      steps: [
        `Use the same first move for both groups. Ask what the map must get right for that question, and match it to one of the four properties: shape, area, distance or direction.`,
        'Sort Group 1. Comparing how much land two places cover is an AREA question.',
        `Choose for Group 1. An equal-area projection is the one built to keep sizes in correct proportion, so that is the map to use. Warn them off the Mercator map here: Alaska lies far north, where that projection enlarges land the most, so it would make Alaska look far bigger than it is. Brazil sits near the Equator and is barely enlarged. Brazil covers much more land than Alaska, and an equal-area map or a globe will show that.`,
        'Sort Group 2. Following a steady compass heading is a DIRECTION question.',
        `Choose for Group 2. The Mercator projection turns a course of one steady compass direction into a straight line on the page, which is exactly what this group is asking about. This is the job it was drawn for, so its area stretching is a price worth paying here.`,
        `Notice the pattern. The same world, the same four properties, two different maps. Neither map is the good one and neither is the bad one. The map is chosen to fit the question.`,
      ],
      example: { problem: `Two groups in a class have two different questions. Group 1 asks: does Brazil or Alaska cover more land? Group 2 asks: if a ship holds one steady compass direction, what path does that make on the map? Decide which kind of projection each group should use, and say why.`, solution: `Group 1 has an area question, so it needs an equal-area projection or a globe; on a Mercator map Alaska would look far larger than it is, while Brazil in fact covers much more land. Group 2 has a direction question, so it needs a Mercator projection, on which a steady compass course is a straight line.` },
      relatedLoIds: ['m7geo.maps-globes-and-projections'],
    },
  ],
  pointers: [
    { content: `Students often say "A map is a photograph of Earth, so sizes and shapes on it are the real ones." — WRONG: "The map shows Greenland almost as big as Africa, so they must be almost the same size." CORRECT: "The map shows Greenland almost as big as Africa, so I should ask which projection this is and what it stretches." A map is made by a projection, which is a rule for moving round Earth onto flat paper, and every such rule distorts shape, area, distance or direction. Before you trust a size on a world map, check whether that map was built to keep sizes right.`, kind: 'common-error' },
    { content: `Students often say "North is at the top of a map because north is the top of Earth." — Earth is a ball turning in space, and space has no up or down, so no direction is the top. Mapmakers agreed long ago to put north at the top of most maps, and that agreement is useful because it makes maps easy to compare. It is still an agreement. Maps have been drawn with other directions at the top, and a map with south at the top is not upside down; it is drawn to a different convention.`, kind: 'common-error' },
    { content: `A globe is the only accurate model of Earth's shape. It keeps shape, area, distance and direction all correct at once.`, kind: 'tip' },
    { content: `A map projection is a rule for moving round Earth onto flat paper. Every flat map distorts at least one of shape, area, distance and direction, and no flat map keeps all four. That is mathematics, not a mistake.`, kind: 'tip' },
    { content: `Cylindrical projections such as the Mercator keep direction, so a straight line is a steady compass course. They stretch area more and more toward the poles.`, kind: 'tip' },
    { content: `Equal-area projections keep sizes in correct proportion and pay for it in shape. Compromise projections spread a little error over everything.`, kind: 'tip' },
    { content: `Greenland looks about as large as Africa on a Mercator map because Greenland lies far north where the stretching is greatest. Africa is very much larger.`, kind: 'tip' },
    { content: `Choose the projection that protects what your question needs, and remember that north is at the top by agreement, not because Earth has a top.`, kind: 'tip' },
    { content: `Don't call a distorted map "wrong." A Mercator map that blows up Greenland is following its rule exactly. Say "this projection stretches area near the poles," not "this map is a mistake."`, kind: 'common-error' },
    { content: `"Distortion" has four flavors: shape, area, distance, direction. Say WHICH one is distorted. "This map is distorted" earns no credit; "this map distorts area toward the poles" does.`, kind: 'vocab-note' },
    { content: `Mercator stretching depends on how far north or south a place is, not on how big it is. Greenland is enlarged because it sits far north; Africa is barely enlarged because it straddles the Equator.`, kind: 'gotcha' },
    { content: `Greenland is an island, not a continent, and it is not "the same size as Africa." Africa is very much larger. Don't repeat the Mercator picture as a fact about Earth.`, kind: 'common-error' },
    { content: `North on top is an agreement between mapmakers, not a fact about Earth. Earth is a ball in space and space has no up. A map with south on top isn't upside down — it just follows a different convention.`, kind: 'gotcha' },
    { content: `Before answering "which map should I use?", name the property first: area, shape, distance, or direction. Match the question to the property, then to the projection. Skipping that step is how students land on Mercator for a size question.`, kind: 'tip' },
    { content: `No projection is "the good one." Mercator is right for steering a ship and wrong for comparing land sizes. Judge a map by the job, not by whether you like how it looks.`, kind: 'edge-case' },
    { content: `Equal-area maps get sizes right but bend shapes, especially near the map's edges. Some are even sliced with gaps in the oceans. Those gaps are part of the rule, not damage to the map.`, kind: 'edge-case' },
  ],
};
