/**
 * Grade 6 World Geography — Natural Resources & Human Adaptation: Resource
 * Distribution & Its Effects.
 *
 * CONCEPT-LED fan-out row for the m6geo course (National Geography Standard
 * 16). The whole lesson installs one picture: natural resources are not
 * spread evenly across Earth, and the resources a place actually has decide
 * which activities suit that place. Every resource-to-activity link in this
 * file uses the same one-link shape and the same three resources: fertile
 * soil suits large-scale farming, thick forest suits large-scale logging, and
 * a mineral deposit suits large-scale mining. Two traps this plan is built to
 * kill: treating a place missing one resource as having no resources at all,
 * and turning a resource difference into a rank of which place is "better."
 *
 * CROSS-COURSE NOTE (read before editing this file): the sibling Grade 6
 * SCIENCE row `m6sci-u9-how-geologic-processes-distribute-resources-unevenly.ts`
 * also teaches uneven resource distribution, and the two rows do not overlap
 * because they explain different halves of the same fact. The science row
 * explains the CAUSE of distribution -- it traces the specific geologic
 * process (ancient swamp burial, ancient marine burial plus a trap, magma
 * rising near a plate boundary, a thick deposited layer of permeable
 * sediment) that had to happen in a place for a given resource to end up
 * there, and it explicitly refuses to connect that geology to which
 * countries are wealthier. This row explains the EFFECT of distribution
 * instead -- given that a place already has (or lacks) a resource, by
 * whatever process, what activities does that make possible or difficult
 * there. This file never asks WHY a resource formed where it did, never
 * mentions a geologic process, and never traces a deposit's origin; the
 * science row never asks what a place's resources let people DO. Neither row
 * explains wealth or ranks any place, region or country, and the two stay
 * separate for that reason as much as for the cause/effect split.
 *
 * SCOPE GUARD: this row says THAT natural resources are unevenly distributed
 * (using invented, described places, never a real country) and THAT the
 * resources a place has shape which activities suit it there, using a single
 * one-link connection each time (a place has fertile soil, THEREFORE
 * large-scale farming suits it). It names no economic system, no trade, no
 * level of development, and no classification of work into primary /
 * secondary / tertiary / quaternary activity -- that full framework is Grade
 * 7's `m7geo-u5-resources-and-economic-activity.ts`, and reading that file
 * alongside this one shows the gap: the Grade 7 file follows a pencil or a
 * water bottle through who dug it, who manufactured it, who sold it, and
 * sorts jobs into four categories; this file never follows an object through
 * a chain of hands and never sorts a job into any category. What IS
 * deliberately allowed, because the political exposure on this row is the
 * highest in the course: this file explicitly TEACHES, as its own content,
 * that having a resource suited to one activity does not make a place
 * "better" than a place suited to a different activity, and that a place
 * missing one named resource still has others. Both points are direct,
 * in-lesson corrections (see the second worked example and the misconception
 * check) rather than omissions, because the single most likely error on this
 * subject is a silent rank, and a guard that only forbids ranking without the
 * lesson ever saying so out loud would leave that error uncorrected. No real
 * country, region, or named place appears anywhere in this file -- every
 * place is invented and described in the text -- so there is no claim in
 * this file that ranks, blames, or explains inequality between any real
 * places.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea, step, and item below is
 * answered by DEFINE, IDENTIFY, or CLASSIFY. Nothing here explains how trade
 * lets a place obtain a resource it lacks, and nothing here builds a second
 * link onto "a place has X, therefore activity Y suits it."
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, and 94% at difficulty 4; chance with four choices is 25%).
 * Every distractor below states a full wrong reason rather than a short wrong
 * label, and no key was built to be the longest choice BECAUSE it is the key.
 * Measured as a diagnostic, not a score to minimize: the key is the strictly
 * longest choice in 1 of the 3 items (item 1, `try-fertile-land-activity`,
 * where the key at 137 characters leads the next choice at 135 by 2
 * characters -- a margin the course's own guidance calls a tie, not a
 * signal). The other two items' keys are not the longest: item 2's key is in
 * fact the shortest of its four choices, and item 3's key is second-shortest.
 * Zero is not the target -- see the note in
 * `m6geo-u3-earths-moving-plates.ts`. The three keys sit at ids b, c and d --
 * the id set `(6 + 2) mod 4 = 0` requires, omitting a.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U6_RESOURCE_DISTRIBUTION_AND_ITS_EFFECTS: LessonPlan = {
  id: 'evelyn.ms.m6geo.resource-distribution-and-its-effects.v1',
  title: 'Resource Distribution & Its Effects',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.resource-distribution-and-its-effects',
      standard: 'M6GEO-6.2',
      description:
        'Explain, using a described example, that natural resources are not evenly distributed across Earth and that the resources available in a place shape what activities are possible there (National Geography Standard 16: the changes that occur in the meaning, use, distribution and importance of resources).',
    },
  ],
  prerequisites: ['m6geo.renewable-and-nonrenewable-resources'],
  followUps: ['m6geo.conserving-natural-resources'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the link between a place\'s resources and what people there actually do feel obvious before any vocabulary arrives.',
      script:
        'Your friend from summer camp lives in a place with wide, flat fields of dark, rich soil, and it rains there often. Her family and her neighbors grow corn and wheat on huge farms. Another friend from camp lives somewhere very different: thick forest covers the hills around his town, and there is not much flat, open land at all. His family and his neighbors cut and sell lumber instead of growing crops. Neither friend chose this at random. The land around each town is different, and that difference decides which activities actually work there. Today you find out how the resources a place has, and does not have, shape what people there can do -- and why having one kind of resource instead of another does not make either place better.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-distribution-and-effect',
      kind: 'concept',
      goal: 'Install the uneven-distribution fact, the one-link resource-to-activity connection, and the two direct corrections this row is built to teach: missing one resource is not the same as having none, and a resource difference is not a rank.',
      keyIdeas: [
        'NATURAL RESOURCES ARE NOT SPREAD EVENLY ACROSS EARTH. Some places have a large amount of a given resource. Other places, nearby or far away, have very little of that same resource or none at all. This is true of any one resource on its own -- fertile soil, thick forest, and mineral deposits each have their own separate pattern of where they turn up in large amounts, and one pattern does not predict another.',
        'THE RESOURCES A PLACE HAS SHAPE WHICH ACTIVITIES SUIT IT THERE. A place with a resource in a large amount can support the one activity that depends on that resource. For example, wide, flat land with deep, fertile soil and steady rainfall suits large-scale farming, because farming depends on soil that holds water and nutrients well. A place that lacks that resource is unlikely to support that one matching activity, even though it may support a different activity instead.',
        'DIFFERENT RESOURCES SUIT DIFFERENT ACTIVITIES. Fertile soil suits large-scale farming. Thick forest suits large-scale logging, because logging depends on having enough trees to cut. A mineral deposit suits large-scale mining, because mining depends on a concentrated amount of a mineral being there to dig out. A place can have one of these in a large amount, more than one, or very little of any of them -- having a lot of one resource does not mean a place also has a lot of the others.',
        'A PLACE MISSING ONE RESOURCE STILL HAS OTHERS. A place without thick forest is unlikely to support large-scale logging, but that same place may have fertile soil or a mineral deposit that suits a different activity instead. Missing the one resource that a particular activity needs does not mean a place has no resources at all.',
        'HAVING ONE RESOURCE INSTEAD OF ANOTHER DOES NOT MAKE A PLACE BETTER OR WORSE. A place suited to farming is not "better" than a place suited to logging or mining -- each place\'s resources simply suit different activities. Saying what a place\'s resources make possible is a geography question. Ranking one place above another because of which resource it has is not.',
      ],
      vocabulary: [
        { term: 'natural resource', definition: 'something found in nature that people use to meet a need, such as growing food, building, or making power.' },
        { term: 'resource distribution', definition: 'the pattern of how much of a natural resource is found in one place compared with another.' },
        { term: 'fertile', definition: 'having what growing plants need to thrive, such as nutrients and water held well in the soil.' },
        { term: 'mineral deposit', definition: 'a concentrated amount of a valuable mineral built up in one place underground or within rock.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-two-towns-resources',
      kind: 'worked_example',
      problem:
        'Town Pinehollow is covered by thick forest and has thin, rocky soil. Town Sunfield has wide, flat land with deep, fertile soil and steady rainfall, and very few trees. Using only these facts, name one activity each town\'s resources support well, and one activity that would be difficult in each town.',
      steps: [
        'Start with Pinehollow. Its resource is thick forest, and forest is exactly what a logging operation cuts, so Pinehollow\'s resources support large-scale logging.',
        'Pinehollow\'s soil is thin and rocky. Fertile soil is what holds the nutrients and water that growing crops need, so thin, rocky soil makes large-scale farming difficult there.',
        'Now Sunfield. Its land is wide, deep, and fertile, and it gets steady rainfall -- exactly what large-scale farming needs -- so Sunfield\'s resources support large-scale farming.',
        'Sunfield has very few trees. Logging depends on having enough trees to cut, so very few trees makes large-scale logging difficult there.',
        'Check the pattern with a contrasting case, since one matching pair is not enough to trust: imagine Pinehollow had Sunfield\'s fertile, flat, well-watered land instead of its thin rocky soil. Farming would become easy there too, because the conclusion follows the resource that is actually present, not the town\'s name. That confirms the resource itself is doing the work.',
      ],
      answer:
        'Pinehollow\'s thick forest supports large-scale logging, but its thin, rocky soil makes large-scale farming difficult there. Sunfield\'s fertile, flat, well-watered land supports large-scale farming, but its lack of trees makes large-scale logging difficult there.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-not-better-not-empty',
      kind: 'worked_example',
      problem:
        'A student looks at Pinehollow and Sunfield and writes: "Sunfield has better land than Pinehollow, since Sunfield can farm and Pinehollow cannot. Also, since Pinehollow cannot farm, its people must not have any useful resources at all." Correct both sentences.',
      steps: [
        'Take the first sentence. WRONG: "Sunfield has better land than Pinehollow, since Sunfield can farm." This turns a difference in which activity suits each town\'s land into a rank of the whole town.',
        'CORRECT: "Sunfield\'s land suits large-scale farming because it is fertile, flat, and well-watered. Pinehollow\'s land suits large-scale logging because it is thickly forested. Each town\'s land suits a different activity, and neither suits every activity."',
        'Test whether the mistake also runs the other way, so the correction is not one-directional: could someone just as wrongly say Pinehollow has "better" land because it is good for logging? Yes -- that is the same mistake, only pointed in the other direction. Neither direction is correct, because a resource difference does not tell you which place is "better."',
        'Now take the second sentence. WRONG: "Pinehollow cannot farm, so its people have no useful resources at all." This assumes a place missing the one resource that farming needs has no resources of any kind.',
        'CORRECT: "Pinehollow\'s thin, rocky soil makes large-scale farming difficult, but its thick forest is a resource in its own right, supporting large-scale logging instead. Missing the one resource that a particular activity needs does not mean a place has no resources -- it usually has different ones that support a different activity."',
      ],
      answer:
        'First correction: Sunfield\'s land is not "better," it simply suits farming instead of logging, the same way Pinehollow\'s land suits logging instead of farming. Second correction: Pinehollow is not without resources -- its thick forest supports large-scale logging, even though its soil does not suit large-scale farming.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-fertile-land-activity',
      kind: 'try_yourself',
      problem:
        'A region has deep, fertile soil across wide, flat land, and it gets steady rainfall through the year. Which activity does this region\'s resources best support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'No large-scale activity, because fertile soil alone cannot support farming without an irrigation system built first.' },
        { id: 'b', text: 'Large-scale crop farming, because wide, flat, fertile land that gets steady rainfall provides the soil and water crops need to grow well.', correct: true },
        { id: 'c', text: 'Large-scale commercial fishing, because a region with steady rainfall always has enough open water nearby for large fishing operations.' },
        { id: 'd', text: 'Large-scale mineral mining, because a deep layer of fertile soil is a sign that a large mineral deposit lies in the rock underneath it.' },
      ],
      expectedAnswer:
        'Large-scale crop farming, because wide, flat, fertile land that gets steady rainfall provides the soil and water crops need to grow well.',
      hints: [
        'Match the two facts given -- fertile soil and steady rainfall -- to the one activity that depends on exactly those two things.',
        'Fishing needs a body of water nearby, not just rainfall, and fertile soil is a fact about growing conditions, not a sign of what lies underground. Neither fact given points to fishing or mining.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-logging-town-resource',
      kind: 'try_yourself',
      problem:
        'A town\'s main activity is large-scale logging: cutting trees and selling the lumber. Which fact about that town\'s natural resources is most likely true?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The town\'s soil is deep and fertile, because fertile soil is what makes any large-scale resource activity possible.' },
        { id: 'b', text: 'The town has a large mineral deposit running beneath its hills, because a mineral deposit is the resource that a logging operation processes into lumber.' },
        { id: 'c', text: 'The town is covered by thick forest, because large-scale logging depends on having enough trees to cut.', correct: true },
        { id: 'd', text: 'The town gets very heavy rainfall year-round, because heavy rainfall alone is what decides whether large-scale logging is possible.' },
      ],
      expectedAnswer: 'The town is covered by thick forest, because large-scale logging depends on having enough trees to cut.',
      hints: [
        'Logging is the activity of cutting down trees for lumber. Ask which resource that activity directly depends on having enough of.',
        'Fertile soil is the resource farming depends on, and a mineral deposit is the resource mining depends on -- neither one is what a logging operation actually cuts down.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-comparing-two-towns',
      kind: 'try_yourself',
      problem:
        'Town Cedarbrook has thick forest and supports large-scale logging. Town Windrush has wide, fertile fields and supports large-scale farming. Which statement correctly compares the two towns\' resources?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Windrush has better land than Cedarbrook, because farming is a more valuable activity than logging.' },
        { id: 'b', text: 'Cedarbrook has better land than Windrush, because a thick forest is a more useful resource than fertile soil.' },
        { id: 'c', text: 'Neither town\'s land can be compared at all, because a place suited to one activity cannot be described next to a place suited to a different one.' },
        { id: 'd', text: 'Neither town has "better" land than the other; each town\'s resources simply suit a different activity.', correct: true },
      ],
      expectedAnswer: 'Neither town has "better" land than the other; each town\'s resources simply suit a different activity.',
      hints: [
        'Ask whether a choice turns a resource difference into a rank. A rank says one town\'s land is simply "better" or "more useful" than the other\'s.',
        'Both towns\' resources support a real activity, so a comparison is still possible -- it just is not a ranking. The difference is which activity suits each town, not whether one town\'s land is good and the other\'s is bad.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-rank-and-empty',
      kind: 'misconception_check',
      question:
        'A student says: "A town with fertile farmland is simply a better town than one with thick forest and no fertile soil. Also, a town without a big natural resource like farmland or forest must have no way to support any activity at all." What is wrong with each part of that?',
      commonErrors: [
        {
          answer: 'A town with fertile farmland is simply a better town than one with thick forest and no fertile soil.',
          misconception:
            'Turning a difference in which activity a place\'s resources support into a rank of the whole place, because farming feels like the most familiar or most important activity.',
          correctsTo:
            'Fertile farmland supports large-scale farming, and thick forest supports large-scale logging. Each set of resources suits a different activity. A place is not "better" or "worse" because of which activity its resources support -- it simply supports a different one. WRONG: "farmland makes a town better." CORRECT: "farmland and forest each support a different activity, and neither one makes a town better than the other."',
        },
        {
          answer: 'A town without a big natural resource like farmland or forest must have no way to support any activity at all.',
          misconception:
            'Assuming that only a large, obvious resource such as wide farmland or thick forest counts as a resource, so a place lacking those two specific resources has none at all.',
          correctsTo:
            'A place can still have a resource such as a mineral deposit even without wide farmland or thick forest, and that resource supports its own activity, such as large-scale mining. Missing the one resource that a particular activity needs does not mean a place has no resources -- it usually has a different one that supports a different activity.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Natural resources are not spread evenly across Earth; different places have different amounts of any one given resource.',
        'The resources a place has shape which activities suit it there: fertile soil suits large-scale farming, thick forest suits large-scale logging, and a mineral deposit suits large-scale mining.',
        'A place missing the one resource a particular activity needs is unlikely to support that activity, but it usually has a different resource that supports a different activity.',
        'Having a resource suited to one activity does not make a place "better" than a place suited to a different activity -- different resources simply suit different activities.',
        'Describing which activities a place\'s resources support is a geography question. Ranking one place above another because of which resource it has is not.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.2', cedTitle: 'Resource Distribution & Its Effects' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
