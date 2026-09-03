/**
 * Grade 6 World Geography — Unit 6 CED 6.2: Resource Distribution & Its Effects.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.resource-distribution-and-its-effects.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U6_RESOURCE_DISTRIBUTION_AND_ITS_EFFECTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.resource-distribution-and-its-effects.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 6,
  cedTopic: '6.2',
  cedTitle: 'Resource Distribution & Its Effects',
  planId: 'evelyn.ms.m6geo.resource-distribution-and-its-effects.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.resource-distribution-and-its-effects.v1' }],
  theory: [
    { loId: 'm6geo.resource-distribution-and-its-effects', content: `NATURAL RESOURCES ARE NOT SPREAD EVENLY ACROSS EARTH. Some places have a large amount of a given resource. Other places, nearby or far away, have very little of that same resource or none at all. This is true of any one resource on its own -- fertile soil, thick forest, and mineral deposits each have their own separate pattern of where they turn up in large amounts, and one pattern does not predict another.` },
    { loId: 'm6geo.resource-distribution-and-its-effects', content: `THE RESOURCES A PLACE HAS SHAPE WHICH ACTIVITIES SUIT IT THERE. A place with a resource in a large amount can support the one activity that depends on that resource. For example, wide, flat land with deep, fertile soil and steady rainfall suits large-scale farming, because farming depends on soil that holds water and nutrients well. A place that lacks that resource is unlikely to support that one matching activity, even though it may support a different activity instead.` },
    { loId: 'm6geo.resource-distribution-and-its-effects', content: `DIFFERENT RESOURCES SUIT DIFFERENT ACTIVITIES. Fertile soil suits large-scale farming. Thick forest suits large-scale logging, because logging depends on having enough trees to cut. A mineral deposit suits large-scale mining, because mining depends on a concentrated amount of a mineral being there to dig out. A place can have one of these in a large amount, more than one, or very little of any of them -- having a lot of one resource does not mean a place also has a lot of the others.` },
    { loId: 'm6geo.resource-distribution-and-its-effects', content: `A PLACE MISSING ONE RESOURCE STILL HAS OTHERS. A place without thick forest is unlikely to support large-scale logging, but that same place may have fertile soil or a mineral deposit that suits a different activity instead. Missing the one resource that a particular activity needs does not mean a place has no resources at all.` },
    { loId: 'm6geo.resource-distribution-and-its-effects', content: `HAVING ONE RESOURCE INSTEAD OF ANOTHER DOES NOT MAKE A PLACE BETTER OR WORSE. A place suited to farming is not "better" than a place suited to logging or mining -- each place's resources simply suit different activities. Saying what a place's resources make possible is a geography question. Ranking one place above another because of which resource it has is not.` },
    { loId: 'm6geo.resource-distribution-and-its-effects', kind: 'definition', title: 'natural resource', content: `something found in nature that people use to meet a need, such as growing food, building, or making power.` },
    { loId: 'm6geo.resource-distribution-and-its-effects', kind: 'definition', title: 'resource distribution', content: `the pattern of how much of a natural resource is found in one place compared with another.` },
    { loId: 'm6geo.resource-distribution-and-its-effects', kind: 'definition', title: 'fertile', content: `having what growing plants need to thrive, such as nutrients and water held well in the soil.` },
    { loId: 'm6geo.resource-distribution-and-its-effects', kind: 'definition', title: 'mineral deposit', content: `a concentrated amount of a valuable mineral built up in one place underground or within rock.` },
  ],
  methods: [
    {
      title: 'Worked two towns resources',
      steps: [
        `Start with Pinehollow. Its resource is thick forest, and forest is exactly what a logging operation cuts, so Pinehollow's resources support large-scale logging.`,
        `Pinehollow's soil is thin and rocky. Fertile soil is what holds the nutrients and water that growing crops need, so thin, rocky soil makes large-scale farming difficult there.`,
        `Now Sunfield. Its land is wide, deep, and fertile, and it gets steady rainfall -- exactly what large-scale farming needs -- so Sunfield's resources support large-scale farming.`,
        `Sunfield has very few trees. Logging depends on having enough trees to cut, so very few trees makes large-scale logging difficult there.`,
        `Check the pattern with a contrasting case, since one matching pair is not enough to trust: imagine Pinehollow had Sunfield's fertile, flat, well-watered land instead of its thin rocky soil. Farming would become easy there too, because the conclusion follows the resource that is actually present, not the town's name. That confirms the resource itself is doing the work.`,
      ],
      example: { problem: `Town Pinehollow is covered by thick forest and has thin, rocky soil. Town Sunfield has wide, flat land with deep, fertile soil and steady rainfall, and very few trees. Using only these facts, name one activity each town's resources support well, and one activity that would be difficult in each town.`, solution: `Pinehollow's thick forest supports large-scale logging, but its thin, rocky soil makes large-scale farming difficult there. Sunfield's fertile, flat, well-watered land supports large-scale farming, but its lack of trees makes large-scale logging difficult there.` },
      relatedLoIds: ['m6geo.resource-distribution-and-its-effects'],
    },
    {
      title: 'Worked not better not empty',
      steps: [
        `Take the first sentence. WRONG: "Sunfield has better land than Pinehollow, since Sunfield can farm." This turns a difference in which activity suits each town's land into a rank of the whole town.`,
        `CORRECT: "Sunfield's land suits large-scale farming because it is fertile, flat, and well-watered. Pinehollow's land suits large-scale logging because it is thickly forested. Each town's land suits a different activity, and neither suits every activity."`,
        `Test whether the mistake also runs the other way, so the correction is not one-directional: could someone just as wrongly say Pinehollow has "better" land because it is good for logging? Yes -- that is the same mistake, only pointed in the other direction. Neither direction is correct, because a resource difference does not tell you which place is "better."`,
        `Now take the second sentence. WRONG: "Pinehollow cannot farm, so its people have no useful resources at all." This assumes a place missing the one resource that farming needs has no resources of any kind.`,
        `CORRECT: "Pinehollow's thin, rocky soil makes large-scale farming difficult, but its thick forest is a resource in its own right, supporting large-scale logging instead. Missing the one resource that a particular activity needs does not mean a place has no resources -- it usually has different ones that support a different activity."`,
      ],
      example: { problem: `A student looks at Pinehollow and Sunfield and writes: "Sunfield has better land than Pinehollow, since Sunfield can farm and Pinehollow cannot. Also, since Pinehollow cannot farm, its people must not have any useful resources at all." Correct both sentences.`, solution: `First correction: Sunfield's land is not "better," it simply suits farming instead of logging, the same way Pinehollow's land suits logging instead of farming. Second correction: Pinehollow is not without resources -- its thick forest supports large-scale logging, even though its soil does not suit large-scale farming.` },
      relatedLoIds: ['m6geo.resource-distribution-and-its-effects'],
    },
  ],
  pointers: [
    { content: `Students often say "A town with fertile farmland is simply a better town than one with thick forest and no fertile soil." — Fertile farmland supports large-scale farming, and thick forest supports large-scale logging. Each set of resources suits a different activity. A place is not "better" or "worse" because of which activity its resources support -- it simply supports a different one. WRONG: "farmland makes a town better." CORRECT: "farmland and forest each support a different activity, and neither one makes a town better than the other."`, kind: 'common-error' },
    { content: `Students often say "A town without a big natural resource like farmland or forest must have no way to support any activity at all." — A place can still have a resource such as a mineral deposit even without wide farmland or thick forest, and that resource supports its own activity, such as large-scale mining. Missing the one resource that a particular activity needs does not mean a place has no resources -- it usually has a different one that supports a different activity.`, kind: 'common-error' },
    { content: `Natural resources are not spread evenly across Earth; different places have different amounts of any one given resource.`, kind: 'tip' },
    { content: `The resources a place has shape which activities suit it there: fertile soil suits large-scale farming, thick forest suits large-scale logging, and a mineral deposit suits large-scale mining.`, kind: 'tip' },
    { content: `A place missing the one resource a particular activity needs is unlikely to support that activity, but it usually has a different resource that supports a different activity.`, kind: 'tip' },
    { content: `Having a resource suited to one activity does not make a place "better" than a place suited to a different activity -- different resources simply suit different activities.`, kind: 'tip' },
    { content: `Describing which activities a place's resources support is a geography question. Ranking one place above another because of which resource it has is not.`, kind: 'tip' },
    { content: `Don't rank places as "better" or "worse" by their resources. Say what activity each place's resources support instead. Fertile soil suits farming, thick forest suits logging — neither is better, just different.`, kind: 'common-error' },
    { content: `A place missing one resource (like no trees for logging) still has other resources (like fertile soil for farming). Don't assume "no trees" means "no resources at all."`, kind: 'gotcha' },
    { content: `Resource distribution is about PATTERN — where each resource shows up in large amounts. One resource's pattern doesn't predict another's. Thick forest doesn't automatically mean fertile soil.`, kind: 'vocab-note' },
    { content: `Match the activity to the resource it actually needs: farming needs fertile soil + water, logging needs thick forest, mining needs a mineral deposit. If the resource is there, the activity suits it. If not, it doesn't.`, kind: 'tip' },
    { content: `When describing a place's resources, always say WHAT ACTIVITY it supports and WHY (which resource makes that possible). Never just rank it or leave out the resource.`, kind: 'common-error' },
    { content: `Fertile soil is soil with nutrients and water. Thin, rocky soil is not fertile — it can't hold water and nutrients well. Don't mix these up when deciding if farming suits a place.`, kind: 'vocab-note' },
    { content: `A place can have multiple resources (like both forest AND mineral deposits), but one big resource doesn't mean it also has the others. Check each resource separately.`, kind: 'edge-case' },
  ],
};
