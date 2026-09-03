/**
 * Grade 6 World Geography — Unit 2 CED 2.3: Continents & Oceans.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.continents-and-oceans.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U2_CONTINENTS_AND_OCEANS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.continents-and-oceans.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 2,
  cedTopic: '2.3',
  cedTitle: 'Continents & Oceans',
  planId: 'evelyn.ms.m6geo.continents-and-oceans.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.continents-and-oceans.v1' }],
  theory: [
    { loId: 'm6geo.continents-and-oceans', content: `A CONTINENT IS ONE OF EARTH'S LARGEST CONTINUOUS AREAS OF LAND, AND AN OCEAN IS ONE OF ITS LARGEST CONTINUOUS AREAS OF SALT WATER. This lesson uses the convention most commonly taught in the United States: seven continents (Africa, Antarctica, Asia, Australia, Europe, North America, South America) and four major oceans (the Pacific, the Atlantic, the Indian, and the Arctic). A convention is simply the way a group of people has agreed to divide something up so they can talk about it clearly.` },
    { loId: 'm6geo.continents-and-oceans', content: `THREE OF THE SEVEN CONTINENTS SIT ON ONE CONTINUOUS LANDMASS, EVEN THOUGH THEY ARE COUNTED SEPARATELY. There is no ocean or sea between Europe and Asia at all -- the two sit on one connected landmass. Africa is joined to Asia by a narrow strip of land. Geographers still count Africa, Europe, and Asia as three separate continents even though they touch. North America and South America are also joined to each other, by a different narrow strip of land. Australia and Antarctica are the only two continents that stand alone, surrounded entirely by ocean, with no land connection to any other continent. Antarctica sits at the far southern end of the globe, opposite the Arctic Ocean at the far northern end.` },
    { loId: 'm6geo.continents-and-oceans', content: `THE FOUR OCEANS ARE REALLY ONE CONNECTED BODY OF WATER, DIVIDED BY NAME RATHER THAN BY ANY WALL OR LINE IN THE WATER ITSELF. The Pacific Ocean is the largest of the four, lying between the Americas on one side and Asia and Australia on the other. The Atlantic Ocean is the second largest, lying between the Americas on one side and Europe and Africa on the other. The Indian Ocean lies south of Asia, with Africa to its west and Australia to its east. The Arctic Ocean is the smallest and coldest of the four, sitting at the far northern end of the globe, bordered by North America, Europe, and Asia.` },
    { loId: 'm6geo.continents-and-oceans', content: `DESCRIBE A LOCATION BY ASKING TWO QUESTIONS, SINCE THERE IS NO MAP TO POINT AT. Question one: what does this continent or ocean touch along its edges? Question two: in which direction -- north, south, east, or west -- does each of those neighbors lie? Answering both questions in words gives a full, checkable description of where something is, the same way spoken directions describe a route without needing a picture.` },
    { loId: 'm6geo.continents-and-oceans', content: `A POSITION STATEMENT WORKS IN BOTH DIRECTIONS, WHICH IS A WAY TO CHECK IT. If the Atlantic Ocean lies east of North America, then North America must lie west of the Atlantic Ocean -- the same relationship, read from the other side, comes out flipped but never contradicted. Checking a location statement this way catches a direction that was written backward.` },
    { loId: 'm6geo.continents-and-oceans', content: `GEOGRAPHERS DO NOT ALL DIVIDE THE WORLD THE SAME WAY, SO THIS LESSON'S COUNT IS A CONVENTION, NOT THE ONLY TRUE ANSWER. Some sources combine Europe and Asia into one continent, giving six continents instead of seven. Some sources also name a fifth ocean, the Southern Ocean, for the ring of water that circles Antarctica, instead of counting that water as the southern edges of the Pacific, Atlantic, and Indian. Both counts are used by real geographers; this lesson states which one it is using rather than treating it as the only fact in the world.` },
    { loId: 'm6geo.continents-and-oceans', kind: 'definition', title: 'continent', content: `one of Earth's largest continuous areas of land.` },
    { loId: 'm6geo.continents-and-oceans', kind: 'definition', title: 'ocean', content: `one of Earth's largest continuous areas of salt water.` },
    { loId: 'm6geo.continents-and-oceans', kind: 'definition', title: 'landmass', content: `a continuous area of land, which may be shared by more than one continent, such as the single connected landmass that Africa, Europe, and Asia together form.` },
    { loId: 'm6geo.continents-and-oceans', kind: 'definition', title: 'convention', content: `a way of doing or naming something that a group of people has agreed on, which could reasonably have been done a different way.` },
  ],
  methods: [
    {
      title: 'Worked locate a continent',
      steps: [
        `Ask question one: what touches North America along its edges? The Arctic Ocean lies along the north. The Atlantic Ocean lies along the east. The Pacific Ocean lies along the west. South America connects to it by a narrow strip of land along the south.`,
        `Ask question two: match each neighbor to its direction, which step one has already done -- Arctic to the north, Atlantic to the east, Pacific to the west, South America to the south.`,
        `Combine both questions into one full description: North America has the Arctic Ocean to its north, the Atlantic Ocean to its east, the Pacific Ocean to its west, and South America connected to its south by a strip of land.`,
        `Check the description by flipping it. If the Atlantic Ocean lies east of North America, then North America has to lie west of the Atlantic Ocean. That flip matches what is true, so the direction in the original description was not written backward.`,
        `Check the shape of the answer too. North America borders three different oceans plus one land connection. A large continent can have several neighbors of different kinds; nothing says a continent must touch only one ocean or only one type of neighbor.`,
      ],
      example: { problem: `A student wants to describe where North America is without pointing at a map. Using the two-question routine, describe North America's position: what does it touch along its edges, and in which direction does each neighbor lie?`, solution: `North America has the Arctic Ocean to its north, the Atlantic Ocean to its east, the Pacific Ocean to its west, and South America connected to its south by a strip of land. Flipping the Atlantic Ocean statement confirms it: North America lies west of the Atlantic Ocean, which matches.` },
      relatedLoIds: ['m6geo.continents-and-oceans'],
    },
    {
      title: 'Worked joined or alone',
      steps: [
        `Take the Europe-Asia claim first. WRONG: "Europe and Asia are separated by an ocean." The mistake is assuming every pair of continents must have water between them, because that is true for some pairs, such as North America and Europe, which have the Atlantic Ocean between them.`,
        `Check what is actually between Europe and Asia. There is no ocean and no sea filling any gap, because the two sit on one single continuous landmass. CORRECT: Europe and Asia are joined -- there is no water between them at all -- even though geographers still count them as two separate continents.`,
        `Now take the Australia claim. WRONG: "Australia is connected to Asia by a strip of land." The mistake is assuming every continent has a land connection to some other continent, because that is true for North America and South America.`,
        `Check what actually surrounds Australia. The Indian Ocean lies along its western and southern coasts, and the Pacific Ocean lies along its eastern coast, with no strip of land reaching any other continent anywhere. CORRECT: Australia is an island continent, surrounded entirely by ocean.`,
        `Check the shape of both corrections together. Some continents are joined to a neighbor, either by sharing one landmass with no water between them at all (Europe and Asia), or by a narrow strip of land (Africa and Asia, and North America and South America). Other continents stand alone, with ocean on every side (Australia and Antarctica). Knowing which group a continent belongs to is exactly what the routine's first question checks.`,
      ],
      example: { problem: `A student writes: "Europe and Asia are separated by an ocean, the same way North America and Europe are. And Australia is connected to Asia by a strip of land, the same way North America is connected to South America." Both sentences are wrong. Correct each one.`, solution: `Europe and Asia are joined on one landmass with no ocean between them, even though they are counted as two continents. Australia has no land connection to Asia or to any other continent; it is an island continent surrounded entirely by ocean.` },
      relatedLoIds: ['m6geo.continents-and-oceans'],
    },
  ],
  pointers: [
    { content: `Students often say "The four oceans are four separate bodies of water with empty space between them, like four different swimming pools." — The world's oceans are all one connected body of salt water. There is no wall, no gap, and no line drawn in the water itself separating the Pacific from the Atlantic or the Atlantic from the Indian. The four names are a convention for talking about different regions of that one connected ocean, not a description of four separate pools. WRONG: "the oceans are separate, walled-off bodies of water." CORRECT: "the oceans are one connected body of water, divided by name rather than by any physical wall."`, kind: 'common-error' },
    { content: `Students often say "There are exactly seven continents everywhere in the world, and every source agrees on that." — This lesson uses the seven-continent, four-ocean convention most commonly taught in the United States, but it is not the only one used by real geographers. Some sources combine Europe and Asia into one continent, giving six continents instead of seven. Some sources also name a fifth ocean, the Southern Ocean, for the ring of water around Antarctica. Both counts are used; this lesson states which one it is using rather than treating it as the only true count.`, kind: 'common-error' },
    { content: `Earth's land is divided into seven continents by convention: Africa, Antarctica, Asia, Australia, Europe, North America, and South America.`, kind: 'tip' },
    { content: `The world's salt water is divided into four major oceans by convention: the Pacific, the Atlantic, the Indian, and the Arctic.`, kind: 'tip' },
    { content: `Europe and Asia sit on one continuous landmass with no ocean between them, even though they are counted as two continents. Africa is joined to Asia by a narrow strip of land, and North America is joined to South America by a different narrow strip of land. Australia and Antarctica each stand alone, surrounded entirely by ocean.`, kind: 'tip' },
    { content: `The Pacific Ocean lies between the Americas and Asia and Australia. The Atlantic Ocean lies between the Americas and Europe and Africa. The Indian Ocean lies between Africa, Asia, and Australia. The Arctic Ocean sits at the far northern end of the globe, bordered by North America, Europe, and Asia.`, kind: 'tip' },
    { content: `Describe any location with two questions: what does it touch along its edges, and in which direction does each neighbor lie? A position statement should hold up when flipped and read from the other side.`, kind: 'tip' },
    { content: `This lesson's seven-continent, four-ocean count is a convention, not the only one used by real geographers; some sources count six continents by combining Europe and Asia, or five oceans by adding the Southern Ocean.`, kind: 'tip' },
    { content: `Don't think the four oceans are separate pools with walls between them. They're one connected body of water divided by names on a map, not by anything in the water itself.`, kind: 'common-error' },
    { content: `Europe and Asia touch with NO ocean between them—they sit on one landmass. Don't assume every pair of continents has water separating them.`, kind: 'gotcha' },
    { content: `When you describe a location, always ask both questions: what touches it, AND in which direction? One answer alone is not enough.`, kind: 'tip' },
    { content: `Always flip your direction statement to check it. If Ocean X is east of Continent Y, then Continent Y must be west of Ocean X—they must match when reversed.`, kind: 'tip' },
    { content: `Australia and Antarctica are the ONLY continents surrounded entirely by ocean. Don't confuse them—Australia is in the tropics; Antarctica is at the far south with ice.`, kind: 'common-error' },
    { content: `The seven-continent count is a CONVENTION used in the U.S., not the only true answer. Some geographers count six by combining Europe and Asia. Say 'by convention' when you state the count.`, kind: 'vocab-note' },
    { content: `A continent can have multiple neighbors of different kinds—oceans on some sides and land connections on others. That's normal, not a mistake in your description.`, kind: 'edge-case' },
  ],
};
