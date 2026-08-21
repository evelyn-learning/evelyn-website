/**
 * Grade 7 World Geography — Geography Tools: Maps, Globes & Projections.
 *
 * Row 1.1, the FIRST lesson of the course (National Geography Standard 1).
 * One idea runs the whole lesson: a globe is the only accurate model of
 * Earth's shape, and flattening that shape onto paper always distorts
 * something. The four things that can be distorted are shape, area, distance
 * and direction, and no flat map keeps all four at once.
 *
 * The traps it is built to kill are (a) reading a map as a photograph of
 * Earth, (b) believing Greenland is really about as large as Africa because
 * a Mercator map draws them that way, (c) treating distortion as a mistake
 * somebody could fix with more care, and (d) treating north-at-the-top as a
 * fact about Earth rather than a drawing convention.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO MAPS AND NO IMAGES in this course.
 * Every item here is solvable from the words printed inside it. Distortion is
 * described in words, never shown. And every factual claim about a real place
 * must be true -- the Greenland/Africa comparison is stated as a comparison,
 * with no area figures, and no projection is given a motive.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U1_MAPS_GLOBES_AND_PROJECTIONS: LessonPlan = {
  id: 'evelyn.ms.m7geo.maps-globes-and-projections.v1',
  title: 'Maps, Globes & Projections',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.maps-globes-and-projections',
      standard: 'M7GEO-1.1',
      description:
        'Explain why a globe models Earth accurately while every flat map distorts shape, area, distance or direction, and choose the kind of projection that fits the question being asked (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).',
    },
  ],
  prerequisites: [],
  followUps: ['m7geo.latitude-longitude-and-location'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the flattening problem physical before any vocabulary arrives.',
      script:
        'Peel an orange in one piece, then try to press the peel flat on the table. It will not go. Something has to tear, or stretch, or overlap. There is no careful way to do it, because a round surface and a flat surface are not the same kind of surface. Earth is round. Paper is flat. Every world map you have ever seen is a peel that somebody pressed flat, and every one of them stretched something to make it fit. Today we find out what gets stretched, why it has to, and how to pick a map that tells the truth about the thing you actually want to know.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-projections',
      kind: 'concept',
      goal: 'Establish globe versus map, name the four distortable properties, sort the main projection families, and set the choose-by-purpose rule.',
      keyIdeas: [
        'A GLOBE IS THE ONLY ACCURATE MODEL OF EARTH\'S SHAPE. Earth is very nearly a sphere, so a round model can keep everything right at once: the shape of each landmass, how much area it covers, the distances between places, and the directions from one place to another. A globe is also awkward. You cannot fold it into a backpack, you cannot see the whole world at one glance, and you cannot write much on it. That is why flat maps exist at all.',
        'A MAP PROJECTION IS A RULE FOR MOVING PLACES FROM THE ROUND EARTH ONTO FLAT PAPER. It is not a photograph and it is not a copy. It is a set of instructions: this point on the globe goes to this point on the page. Different rules give different-looking world maps of the same Earth. That is why two world maps on two classroom walls can disagree about how big Greenland looks and both be drawn correctly.',
        'FOUR THINGS CAN BE DISTORTED: SHAPE, AREA, DISTANCE AND DIRECTION. Shape means whether a country looks like its real outline. Area means whether the amount of land is drawn in correct proportion to other land. Distance means whether the space between two places matches the real gap. Direction means whether the way from one place to another is drawn correctly. NO FLAT MAP KEEPS ALL FOUR AT ONCE. Mathematicians proved that this is impossible, the way they proved you cannot write the largest whole number. It is a fact about round surfaces, not a flaw in map-making and not a mistake anybody made.',
        'CYLINDRICAL PROJECTIONS, SUCH AS THE MERCATOR, ARE DRAWN AS IF THE GLOBE WERE WRAPPED IN A TUBE OF PAPER. The Mercator projection was drawn in the 1500s for sailors, and it does one job beautifully: a straight line on it is a course of one steady compass direction, so a ship can follow it. Shapes stay close to correct inside a small area. The price is area. The stretching grows larger and larger as you move away from the Equator toward the poles, so land in the far north and far south is drawn much bigger than it is. Antarctica is smeared into a wide band along the bottom of the page.',
        'EQUAL-AREA PROJECTIONS KEEP SIZES IN CORRECT PROPORTION, AND PAY FOR IT IN SHAPE. On an equal-area world map, if one country covers twice the land of another, it is drawn covering twice the space, everywhere on the map. Continents near the edges look squashed or leaned over instead. Some equal-area maps are even cut apart, with wedge-shaped gaps left in the oceans, which is the flattened orange peel again. There are also COMPROMISE projections, which keep nothing perfectly and spread a little error over everything so the whole map looks reasonable.',
        'CHOOSE THE PROJECTION THAT PROTECTS WHAT YOUR QUESTION NEEDS. Ask what the map has to get right, then pick a rule that gets that right. Comparing how much land two continents cover is an AREA question, so use an equal-area map. Steering a boat or a plane on a steady heading is a DIRECTION question, so a Mercator map earns its keep. One more thing to unlearn: north is at the top because mapmakers agreed to put it there, not because Earth has a top. Space has no up.',
      ],
      vocabulary: [
        { term: 'globe', definition: 'a round model of Earth, the only model that keeps shape, area, distance and direction all correct at the same time.' },
        { term: 'map projection', definition: 'a rule for moving places from the round surface of Earth onto a flat map.' },
        { term: 'distortion', definition: 'the stretching or squashing of shape, area, distance or direction that happens when a round Earth is drawn flat.' },
        { term: 'Mercator projection', definition: 'a cylindrical projection on which a straight line is a steady compass course, and land is drawn larger and larger toward the poles.' },
        { term: 'equal-area projection', definition: 'a projection that draws every landmass in correct size proportion to every other, at the cost of shape.' },
        { term: 'compromise projection', definition: 'a projection that keeps no property exactly right but shares out the distortion so the whole map looks reasonable.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-greenland-and-africa',
      kind: 'worked_example',
      problem:
        'On a Mercator world map, Greenland, a large island in the far north, is drawn looking about as large as the whole continent of Africa. Africa is very much larger. Explain how a correctly drawn map can show something so misleading.',
      steps: [
        'Name the projection and what it is built to do. This is a Mercator map, a cylindrical projection. Its job is direction: a straight line drawn on it is a course of one steady compass heading.',
        'Ask what it gave up to do that job. Every flat map gives up something. Mercator keeps direction, and keeps shapes roughly right inside a small area, by stretching area.',
        'Find where the stretching lives. On this projection the stretching is small near the Equator and grows larger and larger the farther you go north or south. Near the poles it is enormous.',
        'Place the two landmasses in that pattern. Africa straddles the Equator, right where the stretching is smallest, so it is drawn close to its true share of the page. Greenland sits far to the north, deep in the region where the stretching is huge, so it is blown up.',
        'Put the two facts together. Greenland is enlarged a great deal and Africa hardly at all, so on the page they end up looking similar. That is the projection working exactly as its rule says, not an error and not anybody playing a trick.',
        'State the real relationship, and how to check it. Africa is very much larger than Greenland. To compare land sizes honestly, do not use a Mercator map at all. Look at a globe, or use an equal-area projection, which is built to keep sizes in proportion.',
      ],
      answer:
        'The Mercator projection stretches area more and more toward the poles. Greenland lies far north and is enlarged a great deal; Africa sits on the Equator and is barely enlarged, so the two look similar on the page. In reality Africa is very much larger, which a globe or an equal-area map shows correctly.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-pick-the-projection',
      kind: 'worked_example',
      problem:
        'Two groups in a class have two different questions. Group 1 asks: does Brazil or Alaska cover more land? Group 2 asks: if a ship holds one steady compass direction, what path does that make on the map? Decide which kind of projection each group should use, and say why.',
      steps: [
        'Use the same first move for both groups. Ask what the map must get right for that question, and match it to one of the four properties: shape, area, distance or direction.',
        'Sort Group 1. Comparing how much land two places cover is an AREA question.',
        'Choose for Group 1. An equal-area projection is the one built to keep sizes in correct proportion, so that is the map to use. Warn them off the Mercator map here: Alaska lies far north, where that projection enlarges land the most, so it would make Alaska look far bigger than it is. Brazil sits near the Equator and is barely enlarged. Brazil covers much more land than Alaska, and an equal-area map or a globe will show that.',
        'Sort Group 2. Following a steady compass heading is a DIRECTION question.',
        'Choose for Group 2. The Mercator projection turns a course of one steady compass direction into a straight line on the page, which is exactly what this group is asking about. This is the job it was drawn for, so its area stretching is a price worth paying here.',
        'Notice the pattern. The same world, the same four properties, two different maps. Neither map is the good one and neither is the bad one. The map is chosen to fit the question.',
      ],
      answer:
        'Group 1 has an area question, so it needs an equal-area projection or a globe; on a Mercator map Alaska would look far larger than it is, while Brazil in fact covers much more land. Group 2 has a direction question, so it needs a Mercator projection, on which a steady compass course is a straight line.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-what-flat-maps-do',
      kind: 'try_yourself',
      problem: 'Which statement is true of every flat map of the whole world?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It shows Earth the way a photograph from space would show it.' },
        { id: 'b', text: 'It is completely accurate as long as the mapmaker works carefully.' },
        { id: 'c', text: 'It keeps area correct and distorts only shape.' },
        { id: 'd', text: 'It distorts at least one of shape, area, distance or direction.', correct: true }
      ],
      expectedAnswer: 'It distorts at least one of shape, area, distance or direction.',
      hints: [
        'Think about the orange peel. Was there any careful way to press it flat without stretching, tearing or overlapping something?',
        'The impossibility is mathematical, so it applies to every flat world map ever drawn and every one that ever will be. One choice describes only equal-area maps, not all maps.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-choose-for-area',
      kind: 'try_yourself',
      problem:
        'A class wants to compare how much land each continent covers. Which map should they use, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'An equal-area map, because it draws every landmass in correct size proportion.', correct: true },
        { id: 'b', text: 'A Mercator map, because a straight line on it is a steady compass course.' },
        { id: 'c', text: 'Any world map, because all world maps show sizes correctly.' },
        { id: 'd', text: 'A Mercator map, because it is the world map people see most often.' }
      ],
      expectedAnswer: 'An equal-area map, because it draws every landmass in correct size proportion.',
      hints: [
        'First decide which of the four properties the question is about: shape, area, distance or direction. Then pick the projection built to protect that one.',
        'One choice states something true about Mercator maps, but it answers a direction question, not a size question. Being the map you see most often is not a reason for anything.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-greenland-africa',
      kind: 'try_yourself',
      problem:
        'On a Mercator map, Greenland looks about as large as Africa. What does that tell you?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The projection stretches area more and more toward the poles, so Greenland is drawn far larger than it is; Africa is very much larger.', correct: true },
        { id: 'b', text: 'Greenland and Africa really do cover about the same amount of land.' },
        { id: 'c', text: 'The projection shrinks land near the Equator, so Africa is the one drawn wrongly and Greenland is drawn correctly.' },
        { id: 'd', text: 'The mapmaker made a mistake that a more careful mapmaker could fix.' }
      ],
      expectedAnswer:
        'The projection stretches area more and more toward the poles, so Greenland is drawn far larger than it is; Africa is very much larger.',
      hints: [
        'Where does the Mercator stretching grow largest, and where is it smallest? Then ask where each of these two places sits.',
        'Greenland lies far to the north. Africa straddles the Equator. Only one of these two is sitting in the part of the map that gets blown up.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-map-is-a-picture',
      kind: 'misconception_check',
      question:
        'A student says: "A map is basically a picture of Earth, so whatever it shows is what is really there. And north is up, because that is how Earth is." What is wrong with that thinking?',
      commonErrors: [
        {
          answer: 'A map is a photograph of Earth, so sizes and shapes on it are the real ones.',
          misconception:
            'Treating a map as a copy of Earth rather than as a drawing made by following a rule. If it is a copy, then anything odd on it must be true of Earth, and distortion becomes invisible.',
          correctsTo:
            'WRONG: "The map shows Greenland almost as big as Africa, so they must be almost the same size." CORRECT: "The map shows Greenland almost as big as Africa, so I should ask which projection this is and what it stretches." A map is made by a projection, which is a rule for moving round Earth onto flat paper, and every such rule distorts shape, area, distance or direction. Before you trust a size on a world map, check whether that map was built to keep sizes right.',
        },
        {
          answer: 'North is at the top of a map because north is the top of Earth.',
          misconception:
            'Mistaking a drawing convention for a fact about the planet. Because every classroom map is drawn the same way, the arrangement starts to feel like a property of Earth itself.',
          correctsTo:
            'Earth is a ball turning in space, and space has no up or down, so no direction is the top. Mapmakers agreed long ago to put north at the top of most maps, and that agreement is useful because it makes maps easy to compare. It is still an agreement. Maps have been drawn with other directions at the top, and a map with south at the top is not upside down; it is drawn to a different convention.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A globe is the only accurate model of Earth\'s shape. It keeps shape, area, distance and direction all correct at once.',
        'A map projection is a rule for moving round Earth onto flat paper. Every flat map distorts at least one of shape, area, distance and direction, and no flat map keeps all four. That is mathematics, not a mistake.',
        'Cylindrical projections such as the Mercator keep direction, so a straight line is a steady compass course. They stretch area more and more toward the poles.',
        'Equal-area projections keep sizes in correct proportion and pay for it in shape. Compromise projections spread a little error over everything.',
        'Greenland looks about as large as Africa on a Mercator map because Greenland lies far north where the stretching is greatest. Africa is very much larger.',
        'Choose the projection that protects what your question needs, and remember that north is at the top by agreement, not because Earth has a top.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'Maps, Globes & Projections' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
