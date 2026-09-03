/**
 * Grade 6 World Geography — Unit 3 CED 3.3: The Rock Cycle.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.the-rock-cycle.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U3_THE_ROCK_CYCLE: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.the-rock-cycle.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 3,
  cedTopic: '3.3',
  cedTitle: 'The Rock Cycle',
  planId: 'evelyn.ms.m6geo.the-rock-cycle.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.the-rock-cycle.v1' }],
  theory: [
    { loId: 'm6geo.the-rock-cycle', content: `ROCKS ARE SORTED INTO THREE TYPES, BY HOW EACH ONE FORMED. Every rock belongs to one of three types: IGNEOUS rock, SEDIMENTARY rock, and METAMORPHIC rock. Two rocks can look completely different and still be the same type, and two rocks that look alike can belong to different types, because what actually decides the type is how the rock was made, not its color or its size.` },
    { loId: 'm6geo.the-rock-cycle', content: `IGNEOUS ROCK FORMS WHEN MELTED ROCK COOLS AND HARDENS. Rock can get hot enough to melt completely, whether that happens deep underground or after the melted rock reaches the surface. Melted rock is called MAGMA. When magma cools, it hardens back into solid rock, and that solid rock is igneous rock.` },
    { loId: 'm6geo.the-rock-cycle', content: `SEDIMENTARY ROCK FORMS WHEN LOOSE PIECES ARE PRESSED TOGETHER. Small, loose pieces of rock, sand, or mud can settle into a layer, one on top of another. Over a very long time, the weight of the layers and minerals filling the gaps between the pieces press and glue those loose pieces into one solid rock. That solid rock is sedimentary rock.` },
    { loId: 'm6geo.the-rock-cycle', content: `METAMORPHIC ROCK FORMS WHEN AN EXISTING ROCK CHANGES WITHOUT FULLY MELTING. Take a rock that already exists -- of any type -- and put it under intense heat and pressure, and it can change into a new kind of rock while never fully melting. That new rock is metamorphic rock. A rock that fully melts and then cools again becomes igneous rock instead, never metamorphic rock.` },
    { loId: 'm6geo.the-rock-cycle', content: `OVER A VERY LONG TIME, ONE TYPE OF ROCK CAN SLOWLY CHANGE INTO ANOTHER TYPE. Heat, pressure, and melting followed by cooling can slowly turn one type of rock into a different type. This slow, ongoing change is called the ROCK CYCLE. It happens far too slowly for anyone to watch it happen -- the change takes an extremely long time, not a single human lifetime.` },
    { loId: 'm6geo.the-rock-cycle', content: `THE ROCK CYCLE HAS NO SINGLE PATH EVERY ROCK MUST FOLLOW. The same starting rock does not always end up becoming the same next type. What happens to a rock -- whether it melts completely, or is squeezed by heat and pressure without melting -- decides what it becomes, not what type it already is. The same starting rock could end up as either of the other two types, depending on what actually happens to it.` },
    { loId: 'm6geo.the-rock-cycle', kind: 'definition', title: 'igneous rock', content: 'rock that forms when melted rock, called magma, cools and hardens into a solid.' },
    { loId: 'm6geo.the-rock-cycle', kind: 'definition', title: 'sedimentary rock', content: `rock that forms when loose pieces of rock, sand, or mud are pressed together over a very long time.` },
    { loId: 'm6geo.the-rock-cycle', kind: 'definition', title: 'metamorphic rock', content: `rock that forms when an existing rock is changed by heat and pressure without fully melting.` },
    { loId: 'm6geo.the-rock-cycle', kind: 'definition', title: 'magma', content: `rock that has melted completely, whether it is still underground or has reached the surface.` },
    { loId: 'm6geo.the-rock-cycle', kind: 'definition', title: 'rock cycle', content: `the slow, ongoing change of one rock type into another over a very long time, with no single fixed order.` },
  ],
  methods: [
    {
      title: 'Worked classify igneous',
      steps: [
        `Start with the definition of each type. Igneous rock forms when melted rock cools and hardens. Sedimentary rock forms when loose pieces of rock, sand, or mud are pressed together. Metamorphic rock forms when an existing rock is changed by heat and pressure without fully melting.`,
        `Match the description to one definition. The rock formed from melted rock that cooled and hardened. That matches the definition of igneous rock exactly.`,
        `Now rewind the description and check the other two definitions on purpose, instead of stopping at the first match. Nowhere does it mention loose pieces settling into a layer, so sedimentary does not fit. Nowhere does it mention an existing rock being changed by heat and pressure, so metamorphic does not fit either. Igneous is the only definition that matches every part of the description.`,
        `Test the same routine on a different rock, so it does not get memorized as one fixed answer. Suppose instead the description said: this rock formed when layers of sand were pressed together over a very long time, with no melting mentioned anywhere. Running the same three checks gives sedimentary rock instead -- the routine changes its answer when the description changes, which is what a routine is supposed to do.`,
        `The routine stays the same every time: match the description to a definition, then check that the other two definitions do not also fit.`,
      ],
      example: { problem: `A geologist describes a rock this way: it formed when melted rock deep underground slowly cooled and hardened into solid rock. What type of rock is this -- igneous, sedimentary, or metamorphic -- and how can you be sure no other type fits just as well?`, solution: `Igneous rock. It formed from melted rock that cooled and hardened, and nothing in the description matches settling sediment or an existing rock changed by heat and pressure.` },
      relatedLoIds: ['m6geo.the-rock-cycle'],
    },
    {
      title: 'Worked one rock two endings',
      steps: [
        `Match the description to a definition first. Heat and pressure changing an existing rock, without the rock ever fully melting, is the definition of metamorphic rock.`,
        `Apply it. The rock started as sedimentary rock, and heat and pressure changed it without melting it, so it is now metamorphic rock.`,
        `Rewind and rule out the other two on purpose. It cannot be igneous, because igneous rock requires the rock to fully melt, and this rock never melted. It cannot still be sedimentary, because it was already a solid rock before the heat and pressure acted on it -- nothing here describes loose pieces settling and being pressed together for the first time.`,
        `WRONG: "Heat always means a rock has melted." CORRECT: "A rock can be squeezed by intense heat and pressure for a very long time and never fully melt -- that is exactly what makes it metamorphic instead of igneous."`,
        `Now change one detail and test the routine again. Suppose instead the rock had gotten so hot underground that it fully melted into liquid rock, and later cooled and hardened again. Melting followed by cooling is the definition of igneous rock, so that same starting sedimentary rock would end up igneous instead of metamorphic.`,
        `Notice what decided the outcome both times: not what the rock used to be, but which change actually happened to it. The same starting rock can reach two different endings, because two different things can happen to it.`,
      ],
      example: { problem: `A rock used to be a sedimentary rock. Deep underground, intense heat and pressure changed it into a new kind of rock, and at no point did it fully melt. What type of rock is it now, and would the answer change if it had fully melted instead?`, solution: `Metamorphic rock, because heat and pressure changed the existing sedimentary rock without it ever melting. If it had fully melted and then cooled instead, it would be igneous rock rather than metamorphic rock.` },
      relatedLoIds: ['m6geo.the-rock-cycle'],
    },
  ],
  pointers: [
    { content: `Students often say "The rock cycle always goes in the same order: igneous, then sedimentary, then metamorphic, then back to igneous again." — The rock cycle has no single fixed order. The same starting rock can end up as either of the other two types, depending on what actually happens to it -- heat and pressure without melting changes any rock into metamorphic rock directly, and melting followed by cooling changes any rock into igneous rock directly, with no required stop along the way.`, kind: 'common-error' },
    { content: `Students often say "If a rock gets very hot, it must have melted." — A rock can be squeezed by intense heat and pressure for a very long time and never fully melt. That is exactly what makes a rock metamorphic instead of igneous. A rock only becomes igneous rock if it fully melts into magma and then cools and hardens again.`, kind: 'common-error' },
    { content: `Rocks are grouped into three types by how each one formed: igneous rock, sedimentary rock, and metamorphic rock.`, kind: 'tip' },
    { content: `Igneous rock forms when melted rock, called magma, cools and hardens into a solid.`, kind: 'tip' },
    { content: `Sedimentary rock forms when loose pieces of rock, sand, or mud settle into a layer and are pressed together over a very long time.`, kind: 'tip' },
    { content: `Metamorphic rock forms when an existing rock is changed by heat and pressure without fully melting.`, kind: 'tip' },
    { content: `Over a very long time, heat, pressure, and melting followed by cooling can slowly change one type of rock into a different type. This slow change is called the rock cycle.`, kind: 'tip' },
    { content: `The rock cycle has no single fixed order -- the same starting rock can end up as either of the other two types, depending on what actually happens to it.`, kind: 'tip' },
    { content: `A rock only becomes igneous rock if it fully melts and then cools again. Heat and pressure without melting instead produce metamorphic rock.`, kind: 'tip' },
    { content: `This change happens over an extremely long time, far too slowly for anyone to see it happening.`, kind: 'tip' },
    { content: `Don't classify rocks by how they look (color, size, grain). Classify them by HOW THEY FORMED. Two shiny rocks can be different types; two dull rocks can be the same type.`, kind: 'common-error' },
    { content: `Heat + pressure WITHOUT melting = metamorphic. Heat + pressure WITH full melting = igneous (after it cools). Don't confuse 'very hot' with 'melted.'`, kind: 'gotcha' },
    { content: `The rock cycle has NO single path. A sedimentary rock can become metamorphic OR igneous, depending on whether it fully melts or just gets squeezed. Same starting rock, different endings.`, kind: 'vocab-note' },
    { content: `Magma is melted rock—still liquid. Igneous rock is the solid that forms AFTER magma cools. Don't mix up the two names.`, kind: 'vocab-note' },
    { content: `When classifying a rock, check ALL THREE definitions, not just the first one that sounds right. Cross out the ones that DON'T fit.`, kind: 'tip' },
    { content: `Sedimentary rock ALWAYS starts with loose pieces settling and being pressed together. If the description doesn't mention loose pieces or layers, it's not sedimentary.`, kind: 'edge-case' },
    { content: `The rock cycle takes MILLIONS of years—way too slow to see. Don't expect to watch it happen or find a rock 'in progress.'`, kind: 'edge-case' },
  ],
};
