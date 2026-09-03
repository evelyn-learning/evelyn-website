/**
 * Grade 6 World Geography — Unit 8 CED 8.4: Mapping Your Own Community.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.mapping-your-own-community.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U8_MAPPING_YOUR_OWN_COMMUNITY: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.mapping-your-own-community.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 8,
  cedTopic: '8.4',
  cedTitle: 'Mapping Your Own Community',
  planId: 'evelyn.ms.m6geo.mapping-your-own-community.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.mapping-your-own-community.v1' }],
  theory: [
    { loId: 'm6geo.mapping-your-own-community', content: `WHAT A COMMUNITY MAP IS. A community map is a sketched map of a familiar community that connects its landmarks by the routes between them, the same way a mental map does, and adds one more piece to each landmark: a label saying which kind of characteristic it is, physical or human.` },
    { loId: 'm6geo.mapping-your-own-community', content: `LABELING A LANDMARK USES THE SAME TWO KINDS AS DESCRIBING A PLACE. A landmark is labeled physical when it occurs on its own, without being built or added by people, such as a hill, a stream, or a patch of woods. A landmark is labeled human when people built it or added it, such as a school, a library, a footbridge, or a fire station.` },
    { loId: 'm6geo.mapping-your-own-community', content: `THE ORDER CAN BE RIGHT WHILE A LABEL IS STILL WRONG. Connecting the landmarks in the correct order, with the correct turns between them, is a separate job from labeling each one correctly. A community map can have every landmark in exactly the right place and still be wrong if even one landmark's label does not match what kind of characteristic it actually is.` },
    { loId: 'm6geo.mapping-your-own-community', content: `CHECKING A LABELED MAP AGAINST ITS DESCRIPTION. To check whether a community map is correctly labeled, go through it one landmark at a time, in the order given, and confirm three things against the printed description at every stop: the landmark named, the turn that leads to the next one, and whether its label is physical or human.` },
    { loId: 'm6geo.mapping-your-own-community', content: `SKETCHING AND DESCRIBING USES BOTH SKILLS TOGETHER. Sketching and describing a labeled community map out loud combines the mental-map skill of connecting landmarks by routes with the place-description skill of naming a physical or human characteristic -- both happen inside the same description, not as two separate steps.` },
    { loId: 'm6geo.mapping-your-own-community', kind: 'definition', title: 'community map', content: `a sketched map of a familiar community that connects its landmarks by the routes between them and labels each landmark as physical or human.` },
    { loId: 'm6geo.mapping-your-own-community', kind: 'definition', title: 'landmark', content: `a feature in a familiar space that stands out enough to be easily recognized and used as a fixed point along a route.` },
    { loId: 'm6geo.mapping-your-own-community', kind: 'definition', title: 'route', content: `the path a person actually travels between two familiar places, described by the landmarks passed and the turns made along the way.` },
    { loId: 'm6geo.mapping-your-own-community', kind: 'definition', title: 'physical characteristic', content: `a feature of a community that occurs on its own, without being built or added by people, such as a landform or a natural body of water.` },
    { loId: 'm6geo.mapping-your-own-community', kind: 'definition', title: 'human characteristic', content: `a feature of a community that exists because people built it or added it there, such as a building.` },
  ],
  methods: [
    {
      title: 'Worked sketch and label fernwood',
      steps: [
        `List the landmarks in the order the route connects them: the bus stop, Fernwood Elementary School, the stream, Fernwood Library, the hill.`,
        `Between each pair, name the route exactly as given: straight from the bus stop to the school, a turn right from the school to the stream, straight past the stream to the library, one more turn from the library to the hill.`,
        `Label each landmark. The bus stop is built by people, so it is human. The school is built by people, so it is human. The stream occurs on its own, so it is physical. The library is built by people, so it is human. The hill occurs on its own, so it is physical.`,
        `Put it together and say the whole labeled description once, start to finish: from the bus stop (human), straight ahead to Fernwood Elementary School (human); turn right to a small stream (physical); continue past the stream to Fernwood Library (human); turn once more to a low hill (physical) at the edge of town.`,
        `CHECK: reread the finished, labeled description one landmark at a time against the original description, confirming that the order, each turn, and each physical-or-human label all match what was actually given.`,
      ],
      example: { problem: `Sketch and describe, out loud, a labeled map of a small community called Fernwood, connecting these landmarks by the routes between them and labeling each one physical or human: start at the bus stop, then a straight path leads to Fernwood Elementary School, then a turn right at the school leads to a small stream, then continuing past the stream leads to Fernwood Library, then one more turn at the library leads to a low hill at the edge of town.`, solution: `From the bus stop (human), straight ahead to Fernwood Elementary School (human); turn right to a small stream (physical); continue past the stream to Fernwood Library (human); turn once more to a low hill (physical). Checked against the original description landmark by landmark, the order, the turns, and every label match.` },
      relatedLoIds: ['m6geo.mapping-your-own-community'],
    },
    {
      title: 'Worked check and correct cedar bend',
      steps: [
        `First check the order and the turns against the description, before touching any label: school, then straight to the meadow, then a turn to the library, then another turn to the hill -- this matches the description exactly.`,
        `Now check each label, one at a time. School is built by people, so human -- matches. Meadow occurs on its own, so it should be labeled physical, not human -- this does not match.`,
        `Library is built by people, so human -- matches. Hill occurs on its own, so physical -- matches.`,
        `WRONG: "meadow (human)." CORRECT: "meadow (physical), because a meadow is an open, grassy area that occurs on its own, not something people built."`,
        `CHECK: reread the corrected labels once more against the description, landmark by landmark: school (human), meadow (physical), library (human), hill (physical) -- order, turns, and labels all match now.`,
      ],
      example: { problem: `A student's friend sketches a labeled map of their community, Cedar Bend, from this description: "Starting at Cedar Bend Elementary School, a path leads straight ahead to a small meadow behind the school. From the meadow, a turn leads to Cedar Bend Library. From the library, another turn leads to a low hill at the edge of town." The friend's finished labels, in order, read: school (human), meadow (human), library (human), hill (physical). Check the friend's labeled map against the description. Is it correctly labeled?`, solution: `The friend's map is not correctly labeled. The order and the turns match the description, but the meadow is mislabeled -- a meadow is a physical characteristic, an open, grassy area that occurs on its own, not something people built. The corrected labels, in order, are: school (human), meadow (physical), library (human), hill (physical).` },
      relatedLoIds: ['m6geo.mapping-your-own-community'],
    },
  ],
  pointers: [
    { content: `Students often say "It does not matter whether I label a stream as physical or human, as long as the order and the turns are right." — The order and the turns are only part of what makes a community map correct. A landmark's label also has to match what kind of characteristic it actually is. WRONG: "the order is right, so the labels do not matter." CORRECT: "a community map with the correct order and turns can still be incorrectly labeled if even one landmark is called physical when it is human, or human when it is physical -- a stream mislabeled human is a real mistake, even in a map that is otherwise correct."`, kind: 'common-error' },
    { content: `Students often say "Once I check the order once, I am done checking." — Checking a labeled community map means going through it landmark by landmark and confirming three things each time: the landmark named, the turn to the next one, and whether its label is physical or human. Getting the order right on the first pass does not confirm the labels are also right -- both have to be checked, one landmark at a time, against what the description actually says.`, kind: 'common-error' },
    { content: `A community map connects landmarks by the routes between them, the same way a mental map does, and adds a label to each landmark: physical or human.`, kind: 'tip' },
    { content: `A landmark is labeled physical when it occurs on its own, without being built or added by people, such as a stream, a hill, or a patch of woods.`, kind: 'tip' },
    { content: `A landmark is labeled human when people built it or added it, such as a school, a library, a fire station, or a footbridge.`, kind: 'tip' },
    { content: `Getting the order and the turns right is not the same as labeling correctly. A map can have every landmark in the right place and still be wrong if one label does not match what kind of characteristic that landmark actually is.`, kind: 'tip' },
    { content: `Checking a labeled community map means going through it one landmark at a time, confirming the landmark named, the turn to the next one, and the physical-or-human label, all against the printed description.`, kind: 'tip' },
    { content: `Sketching and describing a labeled community map combines the mental-map skill of connecting landmarks by routes with the place-description skill of naming a physical or human characteristic.`, kind: 'tip' },
  ],
};
