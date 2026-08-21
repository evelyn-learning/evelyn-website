/**
 * Grade 7 Science (Life Science) — Ecology: Population Changes & Limiting Factors.
 *
 * Procedure-led (NGSS MS-LS2-1). One reading procedure runs the whole lesson:
 * take a population described year by year, name the shape of the trend
 * (rising, leveling off, or crashing), and say what that shape implies about
 * the resources in the environment.
 *
 * The traps it is built to kill are (a) "populations grow forever if nothing
 * stops them", (b) "carrying capacity is a fixed number", (c) "at carrying
 * capacity the number stops changing", (d) "only predators limit a
 * population", and (e) "a crash means the species is going extinct".
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * population trend in this file is written out in words, year by year, and
 * every item is solvable from the text printed inside it. Never write "look
 * at the graph". Every number here is small, invented, hedged with "about",
 * and illustrative only -- do not swap in real population statistics.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U10_POPULATION_CHANGES_AND_LIMITS: LessonPlan = {
  id: 'evelyn.ms.m7sci.population-changes-and-limits.v1',
  title: 'Population Changes & Limiting Factors',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.population-changes-and-limits',
      standard: 'M7SCI-10.2',
      description:
        'Explain how births, deaths, arrivals and departures change the size of a population, identify the biotic and abiotic limiting factors that cap that growth, and read a described population trend as rising, leveling off, or crashing in order to say what is happening to the resources in the environment (NGSS MS-LS2-1).',
    },
  ],
  prerequisites: ['m7sci.interactions-between-species'],
  followUps: ['m7sci.ecosystem-disruption'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame limits on growth using a fish tank, something a twelve-year-old has watched happen.',
      script:
        'Put a few guppies in a fish tank and wait. For a while the number of fish climbs fast, because guppies have babies often. But the tank never fills up solid with guppies. After a few months the number stops climbing and settles somewhere, and it stays around there. Nothing reached in and stopped them. The tank itself did it, because a tank holds only so much food, only so much space, and only so much clean water. Every population on Earth runs into a ceiling like that, from the guppies in the tank to the frogs in the pond behind the school. Today we find out where that ceiling comes from, and how to read a list of yearly counts and say what is happening to a population.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-population-limits',
      kind: 'concept',
      goal: 'Install the births-and-deaths rule, biotic and abiotic limiting factors, carrying capacity, and the procedure for reading a described trend.',
      keyIdeas: [
        'A POPULATION IS ALL THE MEMBERS OF ONE SPECIES LIVING IN ONE PLACE, such as all the frogs in one pond. Its size goes UP when animals are born or move in, and it goes DOWN when animals die or move out. That is the whole rule: a population grows when births plus arrivals are greater than deaths plus departures, it shrinks when deaths plus departures are greater, and it holds steady when the two sides roughly balance.',
        'A LIMITING FACTOR IS ANYTHING IN THE ENVIRONMENT THAT CAPS HOW LARGE A POPULATION CAN GET. Some limiting factors are BIOTIC, which means they involve living things: food, predators, disease, and competition with other species for the same resources. Others are ABIOTIC, which means they are nonliving: temperature, sunlight, how much water is available, and how much space or shelter there is. WRONG: "Only predators limit a population." CORRECT: running out of food, a hard freeze, or a disease can each cap a population just as firmly as a predator can.',
        'CARRYING CAPACITY IS THE POPULATION SIZE AN ENVIRONMENT CAN SUPPORT OVER TIME. It is set by whichever resource runs short first. A meadow with plenty of grass but almost no shelter is capped by the shelter, not the grass. Carrying capacity is not a property of the animal, it is a property of the place.',
        'CARRYING CAPACITY IS NOT A FIXED NUMBER. It moves when the environment moves. A wet year grows more plants, so the same meadow can support more rabbits than it could in a dry year. A pond that loses half its water in a dry summer supports fewer fish than it did before. WRONG: "The carrying capacity of this pond is 40 fish, and that never changes." CORRECT: the carrying capacity of this pond is about 40 fish under the conditions it has right now.',
        'REACHING CARRYING CAPACITY DOES NOT MEAN THE POPULATION STOPS CHANGING. Animals are still being born and still dying every year. What has changed is that the two roughly cancel out, so the count drifts up a little and down a little instead of climbing. Populations FLUCTUATE AROUND their carrying capacity rather than sitting exactly on it. WRONG: "It reached carrying capacity, so the number is frozen." CORRECT: it reached carrying capacity, so the number now wobbles near that level.',
        'HOW TO READ A TREND, one shape at a time. RISING fast means resources are still plentiful and births are outrunning deaths. LEVELING OFF means the population has met a limiting factor and is near carrying capacity. CRASHING, which is a sharp drop, means deaths and departures have suddenly overtaken births -- a resource ran out, a disease swept through, or the weather turned harsh. A crash is NOT extinction. If survivors remain, the population can climb again once conditions improve.',
      ],
      vocabulary: [
        { term: 'population', definition: 'all the members of one species living in the same place at the same time.' },
        { term: 'limiting factor', definition: 'anything in the environment that caps how large a population can grow, such as food, space, disease or temperature.' },
        { term: 'carrying capacity', definition: 'the population size an environment can support over time, given the resources it has right now.' },
        { term: 'biotic factor', definition: 'a living part of the environment, such as food, predators or disease.' },
        { term: 'abiotic factor', definition: 'a nonliving part of the environment, such as temperature, sunlight, water or space.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-read-leveling-trend',
      kind: 'worked_example',
      problem:
        'Students counted the frogs in the pond behind their school once a year for five years. Year 1: about 20 frogs. Year 2: about 45 frogs. Year 3: about 80 frogs. Year 4: about 85 frogs. Year 5: about 82 frogs. Describe the trend and estimate the carrying capacity of the pond.',
      steps: [
        'Look at the changes between years rather than the counts alone. From year 1 to year 2 the count went up by about 25. From year 2 to year 3 it went up by about 35. Those are big jumps, so the population was rising fast.',
        'Now look at the later changes. From year 3 to year 4 it went up by only about 5. From year 4 to year 5 it went DOWN by about 3. The jumps have shrunk to small wobbles.',
        'Name the shape. The population rose steeply and then leveled off. That bend is the signature of a population meeting a limiting factor in its environment.',
        'Say what the shape means about resources. While the count was climbing fast, the pond had food and space to spare. Once it leveled off near 80, something ran short -- insects to eat, room along the bank, or safe places to hide -- so deaths and departures caught up with births and arrivals.',
        'Estimate the carrying capacity as the level the count settles around, not the level it started at. It settles around 80 to 85, so the carrying capacity of this pond is about 80 frogs.',
        'Do not mistake the small drop in year 5 for a crash. Going from about 85 to about 82 is a wobble of about 3 frogs. That is exactly what fluctuating around carrying capacity looks like, and it is what tells you frogs are still being born and still dying.',
      ],
      answer:
        'The population rose quickly for three years, then leveled off. Carrying capacity is about 80 frogs. The small dip in year 5 is normal fluctuation around that level, not a crash.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-read-crash-and-factor',
      kind: 'worked_example',
      problem:
        'A population of field mice living in a barn was counted each year. Year 1: about 30 mice. Year 2: about 75 mice. Year 3: about 130 mice. Year 4: about 20 mice. The farmer notes that the barn kept a large pile of stored grain, and that the grain was completely eaten up during year 3. Explain what happened and name the limiting factor.',
      steps: [
        'Read the shape first. Years 1 to 3 climb steeply, from about 30 to about 75 to about 130. Then year 4 drops to about 20. A steep climb followed by a sharp drop is a crash.',
        'Apply the births-and-deaths rule to the crash year. For the count to fall from about 130 to about 20, deaths and departures during year 4 had to be far greater than births and arrivals.',
        'Find the cause in the information given. The grain ran out during year 3. Food is the resource these mice depended on, so once it was gone many mice starved or left the barn to look elsewhere.',
        'Name the limiting factor and sort it. The limiting factor is food supply. Food is a living resource, so it is a BIOTIC factor. Nobody had to add a predator for this to happen.',
        'Explain the overshoot. About 130 mice was more than the barn could support once the grain was gone, so the population had climbed past its carrying capacity. A population that overshoots does not simply stop -- it falls back hard.',
        'Check what the crash does NOT mean. About 20 mice are still alive at the end of year 4. The species is not going extinct. If grain is stored in the barn again, this population can grow back.',
      ],
      answer:
        'The mice grew past what the barn could support, then crashed in year 4 when deaths and departures overtook births. The limiting factor was the food supply, a biotic factor. About 20 mice survived, so the population can recover if food returns.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-read-leveling-off',
      kind: 'try_yourself',
      problem:
        'A rabbit population in a meadow was counted once a year for six years. Year 1: about 15 rabbits. Year 2: about 35 rabbits. Year 3: about 60 rabbits. Year 4: about 62 rabbits. Year 5: about 58 rabbits. Year 6: about 61 rabbits. Which statement best describes this population?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The population is crashing, because the count fell from about 62 in year 4 to about 58 in year 5.' },
        { id: 'b', text: 'The population has stopped changing completely, because the rabbits stopped having babies once they reached 60.' },
        { id: 'c', text: 'The carrying capacity of the meadow is about 15 rabbits, because that is the size the population started at.' },
        { id: 'd', text: 'The population has leveled off near the carrying capacity of the meadow, which is about 60 rabbits, and it fluctuates a little around that size.', correct: true },
      ],
      expectedAnswer: 'The population has leveled off near the carrying capacity of the meadow, which is about 60 rabbits, and it fluctuates a little around that size.',
      hints: [
        'Compare the changes from year to year. The early jumps are about 20 and about 25 rabbits. What size are the last three changes?',
        'Carrying capacity is the level the count settles around and holds, not the level it began at. And a change of a few rabbits up or down is a wobble, not a crash.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-interpret-crash',
      kind: 'try_yourself',
      problem:
        'A population of beetles on an island was counted each year. Year 1: about 40 beetles. Year 2: about 90 beetles. Year 3: about 150 beetles. Year 4: about 25 beetles. Scientists report that the plants the beetles feed on were stripped bare during year 3. What is the best interpretation of the drop in year 4?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Nothing in the environment limited the beetles. Population numbers simply rise and fall at random from year to year.' },
        { id: 'b', text: 'The beetle species is going extinct, because a crash always means a species is disappearing for good.' },
        { id: 'c', text: 'A new predator must have arrived, because a population can only be pushed down by predators.' },
        { id: 'd', text: 'Many more beetles died or left than were born, because the food they depended on ran out. About 25 survived, so the population can grow again if the plants recover.', correct: true },
      ],
      expectedAnswer: 'Many more beetles died or left than were born, because the food they depended on ran out. About 25 survived, so the population can grow again if the plants recover.',
      hints: [
        'A population falls when deaths plus departures are greater than births plus arrivals. The problem tells you which resource ran out just before the drop.',
        'Check the year 4 count before you decide the beetles are gone. Are there survivors left on the island?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-shifting-carrying-capacity',
      kind: 'try_yourself',
      problem:
        'A pond behind a school held about 40 sunfish year after year. Then a dry summer lowered the water level and killed back much of the pond plant life. The following year the pond held about 25 sunfish, and it has stayed near 25 since. Which explanation is best?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The lower water level is a biotic limiting factor, because it changed the lives of the fish.' },
        { id: 'b', text: 'Carrying capacity is a fixed number for a pond, so this pond can still support about 40 sunfish no matter what happened to the water.' },
        { id: 'c', text: 'A new predator must have moved into the pond, because only predators can lower a population.' },
        { id: 'd', text: 'The carrying capacity of the pond went down, because less water and less plant life mean fewer sunfish can be supported.', correct: true },
      ],
      expectedAnswer: 'The carrying capacity of the pond went down, because less water and less plant life mean fewer sunfish can be supported.',
      hints: [
        'Carrying capacity depends on the resources the place has right now. What happened to the water and the plants in this pond?',
        'Sort the water level itself: water is a nonliving part of the environment, so which kind of factor is it?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-capacity-frozen-and-crash-extinct',
      kind: 'misconception_check',
      question:
        'A student is given this rabbit record -- Year 1: about 15. Year 2: about 35. Year 3: about 60. Year 4: about 62. Year 5: about 58 -- and writes: "The rabbits reached carrying capacity in year 3, so from year 3 on the count will stay at exactly 60. And the drop in year 5 is a crash, so these rabbits are going extinct." What went wrong?',
      commonErrors: [
        {
          answer: 'Once a population reaches carrying capacity the number stays exactly the same.',
          misconception:
            'Picturing carrying capacity as a lid the population presses flat against, as if births and deaths switched off the moment the population arrived there.',
          correctsTo:
            'Rabbits are still being born and still dying every single year at carrying capacity. What changed is that the two sides now roughly balance, so the count drifts up a little and down a little instead of climbing. That is why the record reads about 60, then about 62, then about 58. A population FLUCTUATES AROUND its carrying capacity. The habit that fixes this: after you decide a population has leveled off, expect small wobbles and read them as normal.',
        },
        {
          answer: 'A drop in the count means the species is going extinct.',
          misconception:
            'Treating any decrease as the end of the species, instead of asking how big the drop is and how many individuals are left.',
          correctsTo:
            'Going from about 62 to about 58 is a change of about 4 rabbits. That is a wobble, not a crash. Even a real crash, like a beetle count falling from about 150 to about 25, is not extinction, because about 25 beetles are still alive and can rebuild the population once conditions improve. Ask two questions before you say extinct: how large is the drop compared with the numbers involved, and are there survivors left?',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A population grows when births plus arrivals are greater than deaths plus departures, and shrinks when the opposite is true.',
        'Limiting factors cap growth. Biotic ones involve living things: food, predators, disease, competition. Abiotic ones are nonliving: temperature, sunlight, water availability, space and shelter.',
        'Predators are only one limiting factor among many. Running out of food, a harsh winter, or a disease can cap a population just as firmly.',
        'Carrying capacity is the population size an environment can support over time, and it is a property of the place, not of the animal.',
        'Carrying capacity is not a fixed number. It rises and falls as the environment changes, such as a wet year growing more plants or a dry summer shrinking a pond.',
        'Reaching carrying capacity does not freeze the count. Populations fluctuate around it, wobbling up and down by small amounts.',
        'Read the trend: rising fast means resources are still plentiful, leveling off means a limiting factor has been met, and a sharp crash means deaths and departures suddenly overtook births.',
        'A crash is not extinction. If survivors remain, the population can grow back once conditions improve.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.2', cedTitle: 'Population Changes & Limiting Factors' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
