/**
 * Grade 6 World Geography — Unit 1 CED 1.3: Absolute & Relative Location.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.absolute-and-relative-location.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U1_ABSOLUTE_AND_RELATIVE_LOCATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.absolute-and-relative-location.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'Absolute & Relative Location',
  planId: 'evelyn.ms.m6geo.absolute-and-relative-location.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.absolute-and-relative-location.v1' }],
  theory: [
    { loId: 'm6geo.absolute-and-relative-location', content: `THERE ARE TWO DIFFERENT WAYS TO SAY WHERE A PLACE IS. Geographers call them ABSOLUTE LOCATION and RELATIVE LOCATION. Neither one is the better tool -- each answers the question "where is it?" in a different way, and a full description of a place often uses both.` },
    { loId: 'm6geo.absolute-and-relative-location', content: `AN ABSOLUTE LOCATION IS A PLACE'S EXACT, FIXED SPOT. It does not depend on who is describing it or where that person happens to be standing. A street address is one common kind of absolute location: a house number and a street name point to one exact building, and that address points to the same building whether the person reading it is standing right outside or a thousand miles away.` },
    { loId: 'm6geo.absolute-and-relative-location', content: `A COORDINATE IS THE OTHER COMMON KIND OF ABSOLUTE LOCATION. Mapmakers agree on a fixed grid of numbers that marks one exact spot on Earth, so that the same set of numbers means the same exact spot to everyone who reads it. Like a street address, a coordinate does not depend on who is looking at it or where they are standing.` },
    { loId: 'm6geo.absolute-and-relative-location', content: `A RELATIVE LOCATION DESCRIBES A PLACE BY HOW NEAR IT IS TO SOMETHING ELSE. A relative location gives a distance and a direction from another, already-known place -- for example, describing a bakery as "two doors down from the pet shop," or a town as "just west of the lake." The description only makes sense once you already know where that other place is.` },
    { loId: 'm6geo.absolute-and-relative-location', content: `RELATIVE LOCATION ONLY WORKS IF THE LISTENER ALREADY KNOWS THE REFERENCE POINT. The place being used to describe another place is called a REFERENCE POINT. If a listener has never heard of the pet shop, "two doors down from the pet shop" tells them nothing at all. A street address does not have that problem, because it points to the same exact spot no matter what the listener already knows.` },
    { loId: 'm6geo.absolute-and-relative-location', content: `ONE PLACE HAS ONLY ONE ABSOLUTE LOCATION, BUT IT CAN HAVE MANY RELATIVE LOCATIONS. Depending on which reference point someone chooses, the relative description of a place can change completely -- the very same building could correctly be called "next to the school" by one person and "across the street from the bakery" by another. Both can be true at once. The building's absolute location never changes, because it does not depend on a reference point at all.` },
    { loId: 'm6geo.absolute-and-relative-location', kind: 'definition', title: 'absolute location', content: `the exact, fixed position of a place, true no matter who describes it or where they are standing.` },
    { loId: 'm6geo.absolute-and-relative-location', kind: 'definition', title: 'relative location', content: `the position of a place described by its distance and direction from another, already-known place.` },
    { loId: 'm6geo.absolute-and-relative-location', kind: 'definition', title: 'reference point', content: 'the already-known place that a relative location is described in relation to.' },
    { loId: 'm6geo.absolute-and-relative-location', kind: 'definition', title: 'coordinate', content: `a set of fixed numbers, agreed on by mapmakers, that marks one exact spot so it means the same spot to everyone.` },
  ],
  methods: [
    {
      title: 'Worked classify two sentences',
      steps: [
        `Look at the first sentence. "42 Willow Street" is a house number and a street name -- a street address. It does not mention any other place at all, and it does not depend on where the reader is standing. That makes it an absolute location.`,
        `Look at the second sentence. "Two doors down from the pet shop" names another place, the pet shop, and gives a distance ("two doors") and a direction ("down," along the row of shops) from it. Because the description depends on a reference point, that makes it a relative location.`,
        `Check the first sentence by asking whether it needs anything else to work. Could you find the bakery from "42 Willow Street" alone, with no other information? Yes -- the address points to one exact building by itself, which confirms it is absolute.`,
        `Check the second sentence the same way. Could you find the bakery from "two doors down from the pet shop" if you had never heard of the pet shop? No -- without already knowing where the pet shop is, the sentence tells you nothing. That confirms it depends on a reference point, which is what makes it relative.`,
        `Now swap in a different reference point and see whether the classification still holds. Someone else might describe the very same bakery as "across the street from the movie theater." That is a completely different sentence, but it still needs a reference point (the movie theater) to work, so it is still a relative location. Changing the reference point changes the sentence -- it never changes which kind of location the sentence is.`,
      ],
      example: { problem: `A magazine describes a bakery two different ways: "The bakery is at 42 Willow Street" and "The bakery is two doors down from the pet shop." Identify which sentence is an absolute location and which is a relative location, and explain how you know.`, solution: `"42 Willow Street" is the absolute location, because it is a fixed address that does not depend on any other place. "Two doors down from the pet shop" is the relative location, because it only makes sense once you already know where the pet shop is.` },
      relatedLoIds: ['m6geo.absolute-and-relative-location'],
    },
    {
      title: 'Worked fix the mixed up reasoning',
      steps: [
        `WRONG: "The tree house is an absolute location, because it sits exactly behind Mia's house." Look at what the sentence actually depends on: it names a reference point, Mia's house, and a direction, "behind." Depending on knowing where another place is is exactly what makes a description relative, not absolute.`,
        `CORRECT: "Behind Mia's house" is a relative location, because it only works for someone who already knows where Mia's house is. The word "exactly" does not change that. Being precise and being fixed are not the same thing -- "exactly behind Mia's house" is a very precise relative description, but it still depends on Mia's house, so it is still relative.`,
        `Now write the tree house's absolute location. For example: "612 Birchwood Lane." A fixed address like this stays the same no matter who is describing the tree house or where they are standing.`,
        `Now write the tree house's relative location. For example: "right behind Mia's house." This description uses a nearby, already-known place as its reference point.`,
        `Check both by asking the same question each time: does the description depend on a reference point? "612 Birchwood Lane" does not, so it is absolute. "Right behind Mia's house" does, so it is relative. Swap the address for a different fake address and the check still comes out the same way: a fixed address is always absolute, no matter which address it is.`,
      ],
      example: { problem: `A student writes: "The tree house is an absolute location, because it sits exactly behind Mia's house." Explain what is wrong with that reasoning, and then write a true absolute location and a true relative location for the same tree house.`, solution: `The student is wrong because "behind Mia's house" depends on a reference point (Mia's house), which makes it a relative location, not an absolute one. A true absolute location for the tree house is a fixed address such as "612 Birchwood Lane." A true relative location for the same tree house is "right behind Mia's house."` },
      relatedLoIds: ['m6geo.absolute-and-relative-location'],
    },
  ],
  pointers: [
    { content: `Students often say "42 Willow Street is a relative location, because it has a street name." — A street address does not depend on knowing some other place first -- it points to one exact building whether or not the reader knows anything else nearby. That makes it an absolute location, not a relative one. WRONG: "a street name makes a description relative." CORRECT: "a description is relative only when it depends on a separate reference point, such as another named place."`, kind: 'common-error' },
    { content: `Students often say "Once you know a place's relative location, you also know its absolute location." — A relative location such as "next to the library" does not give you the exact address of either place -- it only tells you how the two places sit next to each other. The two kinds of location answer different questions: an absolute location gives one exact, fixed spot, and a relative location gives a distance and direction from another known place. Knowing a place's relative location does not hand you its absolute location.`, kind: 'common-error' },
    { content: `An absolute location is a place's exact, fixed spot, true no matter who describes it or where they are standing.`, kind: 'tip' },
    { content: `A street address and a coordinate (a fixed grid of numbers mapmakers agree on) are both common kinds of absolute location.`, kind: 'tip' },
    { content: `A relative location describes a place by its distance and direction from another, already-known place, called a reference point.`, kind: 'tip' },
    { content: `A relative location only works if the listener already knows the reference point. An absolute location does not have that problem.`, kind: 'tip' },
    { content: `One place has only one absolute location, but it can have many different relative locations, one for each reference point chosen.`, kind: 'tip' },
    { content: `A number appearing in a description does not automatically make it absolute, and a place name appearing in a description does not automatically make it relative -- check whether the description depends on a separate reference point.`, kind: 'tip' },
    { content: `A full description of a place often uses both an absolute location and a relative location together.`, kind: 'tip' },
  ],
};
