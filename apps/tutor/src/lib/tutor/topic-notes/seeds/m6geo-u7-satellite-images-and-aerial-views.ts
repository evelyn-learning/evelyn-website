/**
 * Grade 6 World Geography — Unit 7 CED 7.1: Satellite Images & Aerial Views.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.satellite-images-and-aerial-views.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U7_SATELLITE_IMAGES_AND_AERIAL_VIEWS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.satellite-images-and-aerial-views.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 7,
  cedTopic: '7.1',
  cedTitle: 'Satellite Images & Aerial Views',
  planId: 'evelyn.ms.m6geo.satellite-images-and-aerial-views.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.satellite-images-and-aerial-views.v1' }],
  theory: [
    { loId: 'm6geo.satellite-images-and-aerial-views', content: `A SATELLITE IMAGE AND AN AERIAL VIEW ARE BOTH PICTURES TAKEN FROM ABOVE, NOT DRAWINGS. A SATELLITE IMAGE is a picture taken by a camera on a satellite, far out in space above Earth. An AERIAL VIEW, also called an aerial photograph, is a picture taken by a camera in an aircraft, flying much closer to the ground than a satellite. Both are real pictures of the ground below, taken from two different heights.` },
    { loId: 'm6geo.satellite-images-and-aerial-views', content: `A PICTURE TAKEN FROM ABOVE RECORDS EVERYTHING THAT IS PHYSICALLY THERE. Whatever real object sits on the ground at the moment the picture is taken -- a road, a rooftop, a parked car, a puddle, a bare patch of dirt -- shows up in the picture, in its true shape and color, whether or not anyone planned for it to be there.` },
    { loId: 'm6geo.satellite-images-and-aerial-views', content: `A MAP IS DRAWN BY A PERSON, WHO CHOOSES WHAT TO INCLUDE. A hand-drawn map is not a picture of what is physically present. It is built by a mapmaker, who decides which features belong on it. Two mapmakers drawing the very same town can leave out different things, because each one is making a choice, not taking a picture.` },
    { loId: 'm6geo.satellite-images-and-aerial-views', content: `A MAP NAMES WHAT IT SHOWS; A PICTURE DOES NOT. A map labels the features it includes with words -- a road's name, a city's name, the label on a boundary line. A picture, by itself, shows only shapes and colors. Looking at a picture of a river tells you a river is there; it does not tell you the river's name.` },
    { loId: 'm6geo.satellite-images-and-aerial-views', content: `SOME REAL THINGS LEAVE NO PHYSICAL MARK, SO NO PICTURE CAN SHOW THEM. The line where one country's land ends and the next country's land begins is not painted on the ground in most places. A picture taken from a satellite or from a plane cannot show a line that is not physically there to photograph. A map can draw that line anyway and label which country sits on each side, because a mapmaker can add a line that no picture could ever capture.` },
    { loId: 'm6geo.satellite-images-and-aerial-views', content: `EACH ONE HAS ITS OWN ADVANTAGE. A picture's advantage is that it shows real, current, physical detail exactly as it existed at that moment, including details nobody planned for, such as a new building or a parked boat. A map's advantage is that it names what it shows and can add information, such as a boundary line, that has no physical shape for any picture to capture.` },
    { loId: 'm6geo.satellite-images-and-aerial-views', kind: 'definition', title: 'satellite image', content: `a picture of the ground taken by a camera on a satellite, far out in space above Earth.` },
    { loId: 'm6geo.satellite-images-and-aerial-views', kind: 'definition', title: 'aerial view', content: `a picture of the ground taken by a camera in an aircraft, flying much closer to the ground than a satellite. Also called an aerial photograph.` },
    { loId: 'm6geo.satellite-images-and-aerial-views', kind: 'definition', title: 'map', content: `a drawing of a place, built by a person, that shows only the features the mapmaker chose to include.` },
    { loId: 'm6geo.satellite-images-and-aerial-views', kind: 'definition', title: 'label', content: 'a word or name written on a map to identify one of the features it shows.' },
    { loId: 'm6geo.satellite-images-and-aerial-views', kind: 'definition', title: 'boundary', content: `an edge marking where one place's land ends and another's begins; some boundaries have no physical mark on the ground at all.` },
  ],
  methods: [
    {
      title: 'Worked birch street',
      steps: [
        `Start with what an aerial view actually records: everything physically present on the ground at that moment, whether or not anyone planned for it to be there. The swimming pool is real and sitting behind the house, so it appears in the aerial view even though no record mentions it.`,
        `Ask whether the map could show it instead. A map only shows what the mapmaker chose to draw, and the mapmaker had no record of the pool, so it is missing from the map. A feature can be completely real and still be absent from a map that was never updated to include it.`,
        `Now find the road's name. The aerial view shows shapes and colors -- house outlines, a driveway, a bare patch of dirt -- but it does not attach a word to any of them. Looking at the picture tells you a road is there; it does not tell you the road is called Birch Street.`,
        `The map answers that question directly, because the mapmaker printed the word "Birch Street" along the road. A map names what it includes; a picture does not.`,
        `Check the answer by asking the general question behind both parts: does the tool show what is physically there, or does it show what a person chose to name? The aerial view wins the first question because it is a picture. The map wins the second question because it is a labeled drawing. Neither tool wins both.`,
      ],
      example: { problem: `A photographer flying in a small plane takes an aerial view of Birch Street. At the very same time, a mapmaker draws a map of Birch Street. The aerial view shows: eight houses of different sizes, a small round swimming pool behind one house that has never been added to any city record, a delivery van parked in a driveway, and a bare brown patch where the grass has died. The map shows: the outline of each house lot, the word "Birch Street" printed along the road, and a thick line marking where the city park begins. Which one would let you find the swimming pool that no record mentions? Which one would tell you the road's name?`, solution: `The aerial view would show the swimming pool, because a picture records everything physically present whether or not it was planned for. The map would give you the road's name, because a map labels the features it chooses to include.` },
      relatedLoIds: ['m6geo.satellite-images-and-aerial-views'],
    },
    {
      title: 'Worked two wrong claims',
      steps: [
        `Take the two claims apart, since each is a separate mistake. Claim one is about whether a picture can replace a map entirely. Claim two is about whether a satellite image and an aerial view are the same thing.`,
        `Test claim one with the boundary case. WRONG: "a satellite image shows everything a map does, only better." A boundary line between two countries usually has no physical mark on the ground at all, so a satellite image, no matter how sharp, cannot capture a line that is not physically there. A map can draw that line and name which country sits on each side. CORRECT: a satellite image and a map each show something the other cannot; neither one contains everything the other shows.`,
        `Test claim two with the vantage point. WRONG: "an aerial view is exactly the same thing as a satellite image." A satellite image is taken by a camera on a satellite, far out in space. An aerial view is taken by a camera in an aircraft, flying much closer to the ground. CORRECT: both are pictures taken from above, but from two different heights, which is why geographers use two different names for them.`,
        `Check claim one on a new case, so the rule is not overlearned. Could a picture ever show a boundary? If a border happens to be marked by a real fence or wall, that fence is a physical object, so it would appear in a picture just like any other real thing. It is only a boundary with no physical mark at all that no picture, taken from any height, can capture.`,
        `Check claim two the same way. A satellite image and an aerial view are still both pictures, not drawings, so both share the same basic advantage over a map: they record whatever is physically present. The height they are taken from is what tells them apart, not what kind of thing they are able to show.`,
      ],
      example: { problem: `A student writes: "A satellite image shows everything a map does, only better, because it is a real picture instead of a drawing. And an aerial view is exactly the same thing as a satellite image, just with a different name." Both sentences are wrong. Correct each one.`, solution: `First error: a satellite image does not show everything a map does. An invisible boundary with no physical mark cannot appear in any picture, though a map can draw and label it. Second error: an aerial view and a satellite image are not the same thing. A satellite image is taken from a satellite in space; an aerial view is taken from an aircraft much closer to the ground.` },
      relatedLoIds: ['m6geo.satellite-images-and-aerial-views'],
    },
  ],
  pointers: [
    { content: `Students often say "A satellite image and an aerial view are just two names for the same thing." — A satellite image is taken by a camera on a satellite, far out in space. An aerial view is taken by a camera in an aircraft, flying much closer to the ground. Both are pictures taken from above, but from two different heights, which is why geographers use two different names. WRONG: "they are the same thing." CORRECT: "they are both pictures from above, taken from two different heights."`, kind: 'common-error' },
    { content: `Students often say "A picture always shows more information than any map, since a picture is real and a map is just a drawing." — A picture and a map each show something the other cannot. A picture shows real physical detail exactly as it existed, including things nobody planned for. A map names what it shows and can draw a line, such as a boundary, that has no physical mark for any camera to photograph. Neither one contains everything the other shows.`, kind: 'common-error' },
    { content: `A satellite image is a picture taken from a satellite far out in space. An aerial view is a picture taken from an aircraft much closer to the ground. Both are real pictures, not drawings.`, kind: 'tip' },
    { content: `A picture taken from above records everything physically present at that moment, in its true shape and color, whether or not anyone planned for it.`, kind: 'tip' },
    { content: `A hand-drawn map is built by a person, who chooses which features to include. Two mapmakers can leave out different things.`, kind: 'tip' },
    { content: `A map names what it shows with labels, such as a road's name or a boundary's label. A picture, by itself, shows shapes and colors with no names attached.`, kind: 'tip' },
    { content: `Some real things, such as a boundary with no physical mark, leave nothing for a camera to capture. A map can still draw and label such a line.`, kind: 'tip' },
    { content: `A picture's advantage is showing real, current, unplanned detail exactly as it existed. A map's advantage is naming what it shows and adding information a picture cannot capture.`, kind: 'tip' },
  ],
};
