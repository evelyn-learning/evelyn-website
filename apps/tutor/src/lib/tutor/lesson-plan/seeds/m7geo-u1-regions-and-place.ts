/**
 * Grade 7 World Geography — Geography Tools: Regions, Place &
 * Human-Environment Interaction.
 *
 * The closing row of Unit 1 (National Geography Standard 5). It names the
 * organizing ideas every later unit leans on: location, place, region, and
 * human-environment interaction.
 *
 * THE LOAD-BEARING IDEA, and it is Standard 5 itself: regions are made by
 * people to make sense of a complicated Earth. They are tools, not natural
 * facts. A region has the border its purpose gave it. Every other point in
 * the file is arranged to protect that one.
 *
 * NOTE FOR FUTURE AUTHORS: the four traps this file is built to kill are
 * (a) regions have exact natural boundaries waiting to be found, (b) a place
 * belongs to exactly one region, (c) "place" is just the name of somewhere,
 * and (d) human-environment interaction means people harming things.
 *
 * SENSITIVITY: places are described by landforms, climates, systems and what
 * people build -- NEVER by a trait or temperament of the people who live
 * there, and never ranked against each other. The one real perceptual region
 * named here (the Midwest) is used precisely because the disagreement about
 * its edges is ordinary and non-political. There are also NO MAPS AND NO
 * IMAGES in this course: every item is solvable from the words printed
 * inside it, and no statistic is invented.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U1_REGIONS_AND_PLACE: LessonPlan = {
  id: 'evelyn.ms.m7geo.regions-and-place.v1',
  title: 'Regions, Place & Human-Environment Interaction',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.regions-and-place',
      standard: 'M7GEO-1.4',
      description:
        'Tell absolute location from relative location, describe a place by its physical and human characteristics, sort areas into formal, functional and perceptual regions, and explain how people adapt to, modify and depend on their surroundings (National Geography Standard 5: that people create regions to interpret the complexity of Earth).',
    },
  ],
  prerequisites: ['m7geo.map-elements-scale-and-direction'],
  followUps: ['m7geo.landforms-and-water-features'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the areas people talk about every day are drawn by people, before any vocabulary arrives.',
      script:
        'Think about ordering food for delivery. You type in an address, and the app either says yes or says you are outside the delivery area. Somebody drew that line. It is not painted on the ground and it is not a river or a mountain -- a person at that restaurant decided how far the drivers would go. Now think about the last time somebody asked where you live. You probably did not hand them two numbers. You gave a name, and then you described the place: the weather, whether it is hilly or flat, what there is to do there. Geographers do both of those things on purpose, and today we name the ideas behind them, because the rest of this course is built on top of them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-location-place-region',
      kind: 'concept',
      goal: 'Install location, place, the three kinds of region, the many-regions-at-once fact, and the three parts of human-environment interaction.',
      keyIdeas: [
        'LOCATION ANSWERS THE QUESTION "WHERE", AND THERE ARE TWO WAYS TO ANSWER IT. Absolute location is the one exact spot, usually a latitude and longitude pair, and it means the same thing to everybody -- that is the pair you already know to write latitude first. Relative location describes a place by what it is near: west of the mountains, two stops down the train line, upriver from the port. Both are real answers. Absolute location never changes. Relative location changes depending on where you are standing when you say it.',
        'PLACE IS WHAT MAKES SOMEWHERE DIFFERENT FROM EVERYWHERE ELSE, AND IT IS NEVER JUST THE NAME. Geographers split place into two lists. PHYSICAL CHARACTERISTICS are the things that would be there without people: landforms, rivers and coastlines, soil, plants and animals, and the climate. HUMAN CHARACTERISTICS are what people make and how people live: the languages spoken, what the buildings are made of, how the land is used, what work is common. WRONG: "The place is Millbrook." CORRECT: "Millbrook sits in a wide valley, winters there are long and snowy, and most of the older houses have steep roofs." A name is a label. A place is a description.',
        'A REGION IS AN AREA GROUPED TOGETHER BY SOMETHING IT HAS IN COMMON, AND PEOPLE ARE THE ONES DOING THE GROUPING. This is the biggest idea in the lesson. Earth is far too complicated to think about all at once, so geographers draw regions to make it manageable, the way you sort a messy drawer into boxes. The boxes are genuinely useful. The boxes are also invented. Nobody dug the border of a region into the ground. Somebody decided what the region was for, and then drew the line that showed it.',
        'THERE ARE THREE KINDS OF REGION, AND YOU TELL THEM APART BY WHAT HOLDS EACH ONE TOGETHER. A FORMAL REGION shares a trait you can go out and check, such as an area where wheat is the main crop, or a country whose land is all under one government. A FUNCTIONAL REGION is organized around a center that does something: the area a pizza shop delivers to, the area an airport flies passengers in and out of, the neighborhoods one subway line carries. Its edge is wherever the service stops. A PERCEPTUAL REGION, also called a vernacular region, comes from how people think and talk about an area, and its edges are fuzzy. "The Midwest" is the standard example: it is a part of the United States people mention constantly, and people genuinely disagree about which states belong inside it.',
        'ONE PLACE SITS INSIDE MANY REGIONS AT THE SAME TIME, AND THOSE BORDERS DO NOT LINE UP. A single town can be inside a formal region of a certain climate, inside a country, inside the functional region of the hospital that serves it, and inside a perceptual region somebody named. The regions overlap and their edges disagree, and that is not an error to be fixed. Which region matters depends on the question you are asking. WRONG: "This town is in one region." CORRECT: "This town is in as many regions as there are useful ways to group it."',
        'HUMAN-ENVIRONMENT INTERACTION HAS THREE PARTS: PEOPLE ADAPT, PEOPLE MODIFY, AND PEOPLE DEPEND. Adapting means changing what you do to fit your surroundings -- steep roofs where snow is heavy, thick walls and small windows where summers are hot, houses raised on posts where a river floods most years. Modifying means changing the surroundings themselves -- cutting flat steps called terraces into a hillside so it can be farmed, digging canals to carry water, or building dikes and pumping water off low ground, which is how much of the low, flat land of the Netherlands was made usable. Depending means needing what the environment supplies: soil, fresh water, fuel, wind and sunlight. Modifying is not the same word as damaging. Some changes protect people, some cause harm, and plenty do both at once, which is exactly why geographers study them instead of only praising or blaming them.',
      ],
      vocabulary: [
        { term: 'place', definition: 'the physical and human characteristics that make one area different from every other area.' },
        { term: 'region', definition: 'an area that people group together because of something it has in common.' },
        { term: 'formal region', definition: 'a region whose area shares a trait that can be measured or checked, such as a crop grown or a government.' },
        { term: 'functional region', definition: 'a region organized around a center, covering the area that center serves.' },
        { term: 'perceptual region', definition: 'a region defined by how people think and talk about an area, with fuzzy edges that different people draw differently.' },
        { term: 'human-environment interaction', definition: 'the ways people adapt to, modify, and depend on their surroundings.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-sort-a-description',
      kind: 'worked_example',
      problem:
        'Read this short description of an invented town, then sort each sentence into location, place, region, or human-environment interaction.\n\n"Millbrook sits at 44 degrees N, 90 degrees W. It lies in a wide valley about thirty miles east of a line of low mountains. Winters are long and snowy, and summers are short and warm. Most of the older houses have steep roofs so that snow slides off. Millbrook is one of about forty towns picked up by the county bus line. Farms all through the valley grow oats, and the valley is known for it. People living far away call this part of the country the North Woods, but nobody agrees where the North Woods stop."',
      steps: [
        'Sentence one gives a latitude and a longitude, written latitude first. That is ABSOLUTE LOCATION -- one exact spot, the same for everybody.',
        'Sentence two describes Millbrook by what it is near: a wide valley, thirty miles east of low mountains. That is RELATIVE LOCATION.',
        'Sentence three is about the climate, which nobody built. That is a PHYSICAL CHARACTERISTIC of the place.',
        'Sentence four is doing two jobs at once. Steep roofs are a HUMAN CHARACTERISTIC of the place, because people built them. The reason given -- so that snow slides off -- makes the same sentence HUMAN-ENVIRONMENT INTERACTION, and specifically adapting to heavy snow.',
        'Sentence five names a bus line and the towns it picks up. A center provides a service, and the area it reaches is the region. That is a FUNCTIONAL REGION.',
        'Sentence six says farms all through the valley grow the same crop. That is a shared trait you could go out and check, so the valley is a FORMAL REGION.',
        'Sentence seven names an area by what people far away call it, and admits people disagree about the edges. That is a PERCEPTUAL REGION.',
        'Now count. Millbrook has landed inside three different regions in one short paragraph, and their borders do not line up. That is normal, and it is the point of key idea five.',
      ],
      answer:
        'Absolute location: 44 degrees N, 90 degrees W. Relative location: in a wide valley about thirty miles east of low mountains. Physical characteristic of place: the long snowy winters and short warm summers. Human characteristic of place, and also human-environment interaction: the steep roofs built so that snow slides off. Functional region: the towns the county bus line picks up. Formal region: the oat-growing valley. Perceptual region: the North Woods, whose edges people disagree about.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-three-kinds-of-region',
      kind: 'worked_example',
      problem:
        'A student says: "Every region has one exact border. If people disagree about where the Midwest starts, then somebody is simply wrong." Explain what the student is missing. Then sort these three areas into formal, functional and perceptual regions.\n\n(1) An area where wheat is the main crop grown.\n(2) The neighborhoods that one subway line carries riders to and from.\n(3) The part of the United States that people call the Midwest.',
      steps: [
        'Start with what a region is for. A region is not something found lying in the ground. It is a box people draw around an area so that a complicated Earth becomes easier to think about.',
        'That means the border comes from the purpose. Ask what the region was drawn to show, and the kind of border follows from the answer.',
        'Area one is held together by a trait you can go out and check: what is growing in the fields. A shared, checkable trait means FORMAL REGION, and the border is wherever the wheat fields stop.',
        'Area two is held together by a service running out from a center. That is a FUNCTIONAL REGION, and its border is the last stop. Extend the line next year and the region grows with it.',
        'Area three is held together by what people call the area and how they picture it. That is a PERCEPTUAL REGION. Ask people in different states which states count as the Midwest and you get different answers, and nobody is checking against an official list, because there is no official list to check.',
        'So the student is wrong twice over. WRONG: "Every region has one exact border, so disagreement means somebody made a mistake." CORRECT: "Different kinds of region have different kinds of border, and a perceptual region has fuzzy edges on purpose, because it was built out of what people think." Formal and functional borders can be checked against something. Perceptual borders cannot, and that does not make them useless -- people use them every day.',
      ],
      answer:
        'The student is missing that people create regions for a purpose, so the kind of border depends on the kind of region. An area where wheat is the main crop is a formal region. The neighborhoods one subway line carries riders to and from make a functional region. The part of the United States people call the Midwest is a perceptual region, and its fuzzy edges are ordinary rather than a mistake.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-kind-of-region',
      kind: 'try_yourself',
      problem:
        'A pizza shop delivers to every address within four miles of its front door, and no farther. Which kind of region is that delivery area?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A formal region, because four miles is a measurable distance' },
        { id: 'b', text: 'A perceptual region, because different people would draw the line in different places' },
        { id: 'c', text: 'Not a region at all, because a real region must have a natural boundary' },
        { id: 'd', text: 'A functional region, because it is organized around a center that provides a service', correct: true }
      ],
      expectedAnswer: 'A functional region, because it is organized around a center that provides a service',
      hints: [
        'Ask what holds the area together. A trait every address shares, a service running out from one spot, or a feeling people have about the area?',
        'The shop is at the middle and the drivers go outward from it. The edge of the area is simply where the service stops.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-human-characteristic',
      kind: 'try_yourself',
      problem:
        'A geographer is describing a town. Which of these sentences describes a HUMAN characteristic of the place rather than a physical characteristic?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Winters there are long and snowy.' },
        { id: 'b', text: 'The land rises steeply on the northern side of the town.' },
        { id: 'c', text: 'Two languages are spoken in the town, and the older buildings are made of brick.', correct: true },
        { id: 'd', text: 'A river runs along the eastern edge of the town.' }
      ],
      expectedAnswer: 'Two languages are spoken in the town, and the older buildings are made of brick.',
      hints: [
        'Physical characteristics are the things that would be there even if nobody had ever arrived: landforms, water, weather and climate.',
        'Human characteristics are what people make and how people live: the languages spoken, what buildings are made of, how the land is used.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-human-environment-interaction',
      kind: 'try_yourself',
      problem:
        'In a town beside a river that floods almost every spring, families build their houses on tall posts so that the water passes underneath. Which statement about this is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is not human-environment interaction, because the people did not change the river itself' },
        { id: 'b', text: 'It is human-environment interaction, and it proves that people harm every environment they live in' },
        { id: 'c', text: 'It is human-environment interaction, because the people adapted the way they build to a condition of their surroundings', correct: true },
        { id: 'd', text: 'It is a formal region, because every house in the town shares the same feature' }
      ],
      expectedAnswer: 'It is human-environment interaction, because the people adapted the way they build to a condition of their surroundings',
      hints: [
        'Human-environment interaction has three parts: people adapt to their surroundings, people modify their surroundings, and people depend on their surroundings. Only one of those parts has to be true.',
        'Nobody in this town changed the river. Something else changed instead -- look at what the families changed.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-regions-are-natural',
      kind: 'misconception_check',
      question:
        'A student writes: "The Midwest has one true border, and people who draw it in different places are wrong. And once a town is inside the Midwest, that is the region it belongs to." Both halves of that sentence are wrong. Explain each one.',
      commonErrors: [
        {
          answer: 'The Midwest has one true border, and people who draw it differently are wrong.',
          misconception:
            'Treating a region as a natural feature with a hidden correct boundary that geographers are still hunting for, the way a coastline or a mountain range has an edge that is really there.',
          correctsTo:
            'People create regions to make a complicated Earth easier to interpret. Nobody discovered the Midwest, so there is no official line to be wrong about. WRONG: "Regions have natural borders waiting to be found." CORRECT: "Regions are tools people draw, and the kind of border depends on what the region was drawn to show." A formal region has a checkable border, because the trait can be checked. A functional region has a border at the last stop of the service. A perceptual region such as the Midwest has fuzzy edges by its nature, because it is made out of how people think and talk, and people asked in different states genuinely place the line differently. Fuzzy is not the same as useless.',
        },
        {
          answer: 'Once a town is inside the Midwest, that is the region it belongs to.',
          misconception:
            'Assuming regions work like boxes on a shelf, where each place gets filed in exactly one of them, so naming a second region for the same town must be a contradiction.',
          correctsTo:
            'Every place sits inside many regions at the same time, and their borders overlap and disagree. One town can be inside a climate region, inside a country, inside the delivery area of a shop, inside the area a hospital serves, and inside a perceptual region somebody named -- all at once. None of those cancels the others. The right question is never "which region is this town in", it is "which grouping helps me answer the question I am asking right now".',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Absolute location is one exact spot and never changes. Relative location describes a place by what it is near.',
        'A place is a description, not a name: physical characteristics that would be there without people, and human characteristics that people made.',
        'A region is an area grouped by something it has in common, and people are the ones who do the grouping. Regions are tools, not natural facts.',
        'Formal regions share a trait you can check. Functional regions are organized around a center. Perceptual regions come from how people think, and their edges are fuzzy on purpose.',
        'One place sits inside many regions at the same time, and those borders do not line up.',
        'Human-environment interaction means people adapt, people modify, and people depend. Modifying is not another word for damaging.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'Regions, Place & Human-Environment Interaction' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
