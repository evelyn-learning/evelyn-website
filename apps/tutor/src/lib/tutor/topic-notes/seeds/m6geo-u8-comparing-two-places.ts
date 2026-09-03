/**
 * Grade 6 World Geography — Unit 8 CED 8.3: Comparing Two Places.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.comparing-two-places.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U8_COMPARING_TWO_PLACES: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.comparing-two-places.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 8,
  cedTopic: '8.3',
  cedTitle: 'Comparing Two Places',
  planId: 'evelyn.ms.m6geo.comparing-two-places.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.comparing-two-places.v1' }],
  theory: [
    { loId: 'm6geo.comparing-two-places', content: `TO COMPARE TWO PLACES, LOOK AT THE SAME KIND OF CHARACTERISTIC FOR BOTH. Every place has physical characteristics, built by nature, such as its landforms and its climate, and human characteristics, built by people, such as its buildings and its main activities. A genuine comparison always matches physical with physical or human with human on both sides.` },
    { loId: 'm6geo.comparing-two-places', content: `MATCHING A PHYSICAL CHARACTERISTIC OF ONE PLACE TO A HUMAN CHARACTERISTIC OF THE OTHER IS NOT A COMPARISON AT ALL. Saying "Place A has tall mountains, while Place B grows wheat" does not tell you how the two places are alike or different, because a landform and an activity are not the same kind of characteristic. Fix it by finding Place A's main activity or Place B's landform, and comparing that instead.` },
    { loId: 'm6geo.comparing-two-places', content: `A GENUINE COMPARISON NAMES EITHER A SIMILARITY OR A DIFFERENCE. If the two places share the same kind of characteristic -- both have cold winters, say -- that is a similarity. If their same kind of characteristic is not alike -- one has cold winters, the other warm winters -- that is a difference. Two real places usually turn up some of each.` },
    { loId: 'm6geo.comparing-two-places', content: `A DIFFERENCE IS NOT A RANK. Saying two places differ in climate, landform, buildings, or activities is a geography statement. Saying that difference makes one place "better" or "worse" is not -- it is an opinion this course does not ask for. Two places can have very different characteristics without either one being the better place.` },
    { loId: 'm6geo.comparing-two-places', content: `CHECK A COMPARISON AGAINST WHAT EACH PLACE WAS ACTUALLY SAID TO HAVE. A comparison can match the right kind of characteristic on both sides and still be wrong, if it gets a detail backward or swaps which place has which fact. Reread each place's own description before accepting a comparison as true.` },
    { loId: 'm6geo.comparing-two-places', kind: 'definition', title: 'physical characteristic', content: 'a feature of a place created by nature, such as its landforms or its climate.' },
    { loId: 'm6geo.comparing-two-places', kind: 'definition', title: 'human characteristic', content: `a feature of a place created by people, such as its buildings or the activities people do there.` },
    { loId: 'm6geo.comparing-two-places', kind: 'definition', title: 'similarity', content: 'a way in which two places share the same kind of characteristic.' },
    { loId: 'm6geo.comparing-two-places', kind: 'definition', title: 'difference', content: `a way in which two places' same kind of characteristic is not alike.` },
    { loId: 'm6geo.comparing-two-places', kind: 'definition', title: 'comparison', content: `describing two places side by side by matching the same kind of characteristic for both.` },
  ],
  methods: [
    {
      title: 'Worked run the routine',
      steps: [
        `Pick the first kind of characteristic to compare: climate, a physical characteristic. Read what each town's own description says about climate: Cliffwater has cold winters and cool summers; Marshdell also has cold winters and cool summers.`,
        `Decide whether the two towns share this characteristic or not. Both descriptions say the same thing, so this is a similarity, and it matches physical with physical.`,
        `Pick the second kind of characteristic to compare: buildings, a human characteristic. Read what each town's own description says about buildings: Cliffwater's are thick stone with steep roofs; Marshdell's are wooden farmhouses with wide porches.`,
        `Decide whether the two towns share this characteristic or not. The two descriptions are not alike, so this is a difference, and it matches human with human.`,
        `Test the routine against a case that should fail, so the rule is not overlearned as always producing an answer. Try comparing Cliffwater's mountains to Marshdell's wheat growing: a landform is a physical characteristic and growing wheat is a human characteristic, so putting them side by side is not a genuine comparison at all -- it says nothing about how the two towns are alike or different.`,
      ],
      example: { problem: `Cliffwater sits at the foot of tall, rocky mountains and has cold winters and cool summers. Its buildings are made of thick stone with steep roofs, and most residents work as ski guides or run mountain lodges. Marshdell sits on wide, flat grassland and also has cold winters and cool summers. Its buildings are wooden farmhouses with wide porches, and most residents grow wheat and raise cattle. Compare the two towns' climates, and then compare the two towns' buildings.`, solution: `Climate is a genuine similarity: both towns have cold winters and cool summers. Buildings are a genuine difference: Cliffwater builds with stone and steep roofs, while Marshdell builds with wood and wide porches. Comparing Cliffwater's mountains to Marshdell's wheat growing would not be genuine, since a landform and an activity are different kinds of characteristics.` },
      relatedLoIds: ['m6geo.comparing-two-places'],
    },
    {
      title: 'Worked fix the mismatch and the rank',
      steps: [
        `Take the first sentence. WRONG: "Cliffwater's landforms are very different from Marshdell's farming." This matches a physical characteristic, Cliffwater's mountains, to a human characteristic, Marshdell's farming, so it is not a genuine comparison at all.`,
        `Find the matching characteristic to compare instead. Cliffwater's landform is tall, rocky mountains. Marshdell's landform is wide, flat grassland. CORRECT: "Cliffwater sits among tall, rocky mountains, while Marshdell sits on wide, flat grassland" -- a genuine difference, landform matched with landform.`,
        `Now take the second sentence. WRONG: "Marshdell must be the better town, since it grows food that people need." This turns a difference in activity into a rank of the whole town.`,
        `Test whether the same mistake could run the other way, so the correction is not one-directional: could someone just as wrongly say Cliffwater is the better town because ski guiding brings visitors to spend money there? Yes -- that is the identical mistake, only pointed in the other direction. Neither direction is correct.`,
        `CORRECT: "Cliffwater's main activity is ski guiding and running mountain lodges. Marshdell's main activity is growing wheat and raising cattle. The two towns simply have different activities, and neither one is the better town because of it."`,
      ],
      example: { problem: `A student compares Cliffwater and Marshdell and writes: "Cliffwater has tall, rocky mountains, and Marshdell grows wheat, so Cliffwater's landforms are very different from Marshdell's farming. Also, Marshdell must be the better town, since it grows food that people need." Find what is wrong with each sentence and correct it.`, solution: `First correction: compare landform with landform instead -- Cliffwater's mountains and Marshdell's flat grassland are the genuine difference. Second correction: growing food does not make Marshdell the better town; the two towns' activities are simply different, not ranked.` },
      relatedLoIds: ['m6geo.comparing-two-places'],
    },
  ],
  pointers: [
    { content: `Students often say "Cliffwater has tall mountains, and Marshdell grows wheat, so the two towns are very different." — A genuine comparison always matches the same kind of characteristic on both sides -- a landform with a landform, or an activity with an activity. Cliffwater's mountains are a physical characteristic and Marshdell's wheat growing is a human characteristic, so putting them side by side says nothing about how the two towns compare. WRONG: "Cliffwater's mountains are very different from Marshdell's farming." CORRECT: "Cliffwater's landform is tall, rocky mountains, while Marshdell's landform is wide, flat grassland" -- a genuine difference, landform matched with landform.`, kind: 'common-error' },
    { content: `Students often say "Marshdell must be the better town, since growing wheat feeds people, and that matters more than skiing." — Growing wheat and guiding skiers are simply two different activities, each suited to its own town's landform and climate. Neither activity makes its town the better one. A genuine comparison states what is different between two places; it never ranks which place is better.`, kind: 'common-error' },
    { content: `A genuine comparison always matches the same kind of characteristic on both sides: physical with physical, such as landform or climate, or human with human, such as buildings or activities.`, kind: 'tip' },
    { content: `Matching a physical characteristic of one place to a human characteristic of the other is not a comparison at all -- it says nothing about how the two places are alike or different.`, kind: 'tip' },
    { content: `A genuine comparison names either a similarity, where both places share the same kind of characteristic, or a difference, where they do not.`, kind: 'tip' },
    { content: `A difference is not a rank. Two places can have very different characteristics without either one being the better place.`, kind: 'tip' },
    { content: `Always check a comparison against what each place was actually described as having, since a comparison can match the right kind of characteristic and still get a detail backward.`, kind: 'tip' },
  ],
};
