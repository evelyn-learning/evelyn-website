/**
 * Grade 7 World Geography — Africa: Physical Geography.
 *
 * The opening row of Unit 9 (National Geography Standard 4). It is a PHYSICAL
 * row: climate bands, deserts, grasslands, rivers, landforms and the shape of
 * the continent itself. History, culture, politics and development belong to
 * 9.2 and 9.4 and are deliberately absent here.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters most in this file: the single
 * most common error a twelve-year-old brings to this row is treating Africa as
 * ONE PLACE -- one climate, one landscape, sometimes even one country. This
 * file corrects that in the hook, in the first key idea, in an item and in the
 * misconception check, on purpose. Do not undo it. Every generalization here is
 * either explicitly about the whole continent as a landmass (the Equator
 * crosses it) or is pinned to a named part of it.
 *
 * There are deliberately NO NUMBERS anywhere in this file: no lengths, no
 * heights, no areas, no rainfall totals, no temperatures, no populations. A
 * remembered wrong number is worse than no number. Measured physical
 * superlatives -- largest hot desert, longest river in Africa, highest
 * mountain in Africa, largest lake in Africa by area -- are fine and carry no
 * judgement. Judgements about places, and any statement about what people are
 * like, are not fine and appear nowhere.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Every arrangement of
 * places is described in words inside the item that needs it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U9_AFRICA_PHYSICAL_GEOGRAPHY: LessonPlan = {
  id: 'evelyn.ms.m7geo.africa-physical-geography.v1',
  title: 'Africa: Physical Geography',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.africa-physical-geography',
      standard: 'M7GEO-9.1',
      description:
        'Describe the climate bands, deserts, grasslands, rivers and landforms of Africa, and explain how the position of the Equator, the raised plateau interior and the smooth coastline shape the physical geography of a continent that holds many countries and many environments (National Geography Standard 4: the physical and human characteristics of places).',
    },
  ],
  prerequisites: ['m7geo.russia-and-eurasia'],
  followUps: ['m7geo.africa-history-and-culture'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Land the size and variety of the continent immediately, so that every later fact gets attached to a part of Africa rather than to all of it.',
      script:
        'A classmate tells you that their family is traveling to Africa over the summer, and asks you what they should pack. Try to answer. You cannot, and that is not because you do not know enough. It is because the question does not have an answer yet. Africa is enormous. It holds a rainforest where rain falls almost every afternoon, a desert where years can pass between rains, grasslands, a highland region cool enough for a jacket, and a mountain with snow near the top. Ask your classmate which part, and then you can pack. That is the whole point of this lesson: Africa is a continent, not a place. And once you know where the Equator sits on it, you can predict a surprising amount of the rest.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-africa-physical',
      kind: 'concept',
      goal: 'Install the continent as many places, the mirrored climate bands around the Equator, the deserts and the Sahel, the plateau-and-smooth-coast shape, and the rift in the east.',
      keyIdeas: [
        'AFRICA IS A CONTINENT OF MANY COUNTRIES AND MANY ENVIRONMENTS. Africa is the second largest continent on Earth, and it contains many countries. Rainforest, desert, grassland, highland and coast all sit inside it, and no single sentence covers all of them. Describing Africa as one place -- one climate, one landscape, or worst of all one country -- is a mistake, and it is the mistake this lesson exists to fix. The Atlantic Ocean lies to the west, the Indian Ocean to the east, the Mediterranean Sea to the north, and the Red Sea to the northeast. Madagascar, a large island, lies off the southeastern coast, in the Indian Ocean.',
        'THE EQUATOR CROSSES THE MIDDLE, AND THE CLIMATE BANDS MIRROR EACH OTHER. The Equator crosses through the middle of Africa, and the continent reaches a long way both north and south of it. That produces a pattern you can almost read off a globe. Starting at the Equator and moving north you pass tropical rainforest, then savanna, then a semi-arid belt, then desert, and finally a Mediterranean-type climate at the far northern edge. Starting at the Equator and moving south you pass the same sequence in the same order: rainforest, savanna, semi-arid land, desert, and a Mediterranean-type climate at the far southern tip. The two halves are not identical in width -- the northern desert is far bigger -- but the ORDER mirrors, because latitude is doing the same work on both sides. This is Control 1 from Unit 2, made visible at the size of a continent.',
        'THE DESERTS, AND THE SAHEL BETWEEN. The Sahara stretches across northern Africa, from the Atlantic coast in the west to the Red Sea in the east, and it is the largest hot desert on Earth. South of the Sahara lies the Sahel, a semi-arid belt that is drier toward the desert in the north and wetter toward the savanna in the south. The Sahel is a TRANSITION ZONE, and that idea is worth more than the name: the change from desert to grassland is a wide band, not a line you could draw. Remember from Unit 1 that some boundaries are bands. Southern Africa has deserts of its own -- the Kalahari inland, and the Namib along the Atlantic coast, where the cold Benguela Current runs north offshore and air over cold water brings little rain onto the land.',
        'SAVANNA AND RAINFOREST. Savanna is tropical grassland with scattered trees, and its signature is a pronounced wet season and dry season rather than a warm season and a cold one. Savanna covers large areas of Africa on both sides of the Equator. Right at the Equator sits the Congo Basin, the land drained by the Congo River, which holds a large tropical rainforest that is warm and wet through the whole year. Rainforest and savanna are neighbors here, and the thing that separates them is how long the dry season lasts.',
        'A PLATEAU CONTINENT WITH A SMOOTH COAST AND FALLING RIVERS. Africa is largely a plateau continent: much of the interior is raised high, and the land drops steeply to a narrow coastal plain. Two consequences follow. First, rivers that flow from the interior to the sea have cataracts and waterfalls where they come down off the plateau, so a boat coming in from the ocean can travel only a short way upstream before the rapids stop it. Victoria Falls, on the Zambezi River, is one well known example of a river making that drop. Second, the coastline of Africa is remarkably smooth for a continent of its size, with few deep bays or sheltered inlets that make natural harbors. Hold that next to Europe from Unit 8, which is cut into peninsulas and bays and has natural harbors nearly everywhere. Same idea, opposite answer. The Nile flows NORTH, to the Mediterranean Sea, and it is the longest river in Africa. The Congo and the Niger reach the Atlantic Ocean, and the Zambezi reaches the Indian Ocean.',
        'THE EAST IS BEING PULLED APART, AND ELEVATION GETS A VOTE. The Great Rift Valley runs through eastern Africa. It is a place where the crust is pulling apart, which is the divergent boundary from Unit 2, and a chain of long, deep lakes lies along it. Lake Victoria, in eastern Africa, is the largest lake in Africa by area. Mount Kilimanjaro, a volcano in Tanzania, is the highest mountain in Africa. The Atlas Mountains run across the northwest, between the Mediterranean coast and the Sahara. The Ethiopian Highlands rise in the east, and because air gets colder as elevation rises, that highland region is far cooler than its latitude alone would lead you to expect. That is Control 2 from Unit 2, and it is the reason latitude by itself is never the last word.',
      ],
      vocabulary: [
        { term: 'savanna', definition: 'tropical grassland with scattered trees, with a distinct wet season and dry season.' },
        { term: 'Sahel', definition: 'the semi-arid belt across Africa that lies between the Sahara to the north and the savanna to the south.' },
        { term: 'transition zone', definition: 'a wide band where one region gradually changes into another, rather than a sharp line.' },
        { term: 'plateau', definition: 'a large area of raised, fairly level land that stands above the land around it.' },
        { term: 'cataract', definition: 'a stretch of rapids or a waterfall on a river, where the water drops over hard rock.' },
        { term: 'natural harbor', definition: 'a sheltered place along a coast, such as a deep bay, where ships can anchor safely.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-mirror-climate-bands',
      kind: 'worked_example',
      problem:
        'Work out the mirror. Start at the Equator in central Africa and travel north in a straight line to the Mediterranean coast, naming the climate bands you cross. Then start at the Equator again and travel south to the southern tip of the continent, naming the bands you cross. Compare the two lists, and explain what causes the pattern.',
      steps: [
        'Go north first, and go one band at a time. At the Equator you are in tropical rainforest -- warm and wet all year. Keep going north and the dry season gets longer, so the rainforest gives way to SAVANNA, tropical grassland with scattered trees.',
        'Keep going north. The dry season keeps getting longer and the rain keeps getting scarcer, so the savanna thins into the semi-arid SAHEL. Then the Sahel gives way to the SAHARA, the desert across the north of the continent.',
        'Finish the northern list. At the very far northern edge, along the Mediterranean coast, the climate turns Mediterranean-type: hot dry summers and mild wetter winters. So going north the order is rainforest, savanna, semi-arid, desert, Mediterranean-type.',
        'Now go south from the Equator and write the list without looking at the first one. Rainforest at the Equator. Then savanna as the dry season lengthens. Then semi-arid land. Then desert -- the Kalahari inland and the Namib along the Atlantic coast. Then, at the far southern tip, a Mediterranean-type climate again.',
        'Put the two lists side by side. They are the SAME SEQUENCE IN THE SAME ORDER, running outward from the Equator in both directions. That is the mirror, and it is the single most useful thing to remember about this continent.',
        'Now say WHY, because the pattern is not a coincidence. Latitude is Control 1 from Unit 2: it sets how directly the sun strikes and where the great belts of rising and sinking air sit. Air rises near the Equator and drops its moisture, which is the rainforest. Air sinks near the tropics on both sides, and sinking air brings dry weather, which is the desert. The Equator crosses the middle of Africa, so the continent gets both halves of that pattern instead of just one.',
        'One honest correction before you carry this away. The mirror is a mirror of ORDER, not of size. The Sahara is far larger than the deserts in the south, and the bands are not equally wide on the two sides. WRONG: "The northern half and the southern half of Africa are the same." CORRECT: "Moving away from the Equator in either direction, the climate bands appear in the same order, though they are not the same width."',
      ],
      answer:
        'Going north: rainforest, savanna, semi-arid Sahel, the Sahara, then a Mediterranean-type climate at the northern edge. Going south: rainforest, savanna, semi-arid land, the Kalahari and Namib deserts, then a Mediterranean-type climate at the southern tip. The order mirrors on both sides of the Equator because latitude controls climate the same way north and south, though the northern bands are much wider than the southern ones.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-plateau-and-coast',
      kind: 'worked_example',
      problem:
        'A ship arrives at the coast of Africa and wants to carry cargo far inland by river. It cannot get very far. Explain the two physical reasons for that, and then compare the coastline of Africa with the coastline of Europe from Unit 8.',
      steps: [
        'Start with the shape of the continent, because both reasons come from it. Africa is largely a PLATEAU continent: much of the interior is raised high, and the land drops steeply to a narrow strip of coastal plain.',
        'REASON ONE -- the rivers fall. A river running from the raised interior toward the sea has to come down off that plateau, and where it comes down there are cataracts and waterfalls. So a boat entering the mouth of the river from the ocean travels a short way and then meets rapids it cannot pass. Victoria Falls on the Zambezi River is one well known example of a river making that drop.',
        'REASON TWO -- the coast is smooth. The coastline of Africa has few deep bays and few sheltered inlets for the size of the continent, so there are not many natural harbors where a ship can shelter and unload.',
        'Now make the comparison the question asks for. Europe, from Unit 8, is the opposite case: its coastline is deeply indented with peninsulas, bays and inlets, it has many natural harbors, and rivers reach far inland. Africa is bigger than Europe and has a much smoother edge.',
        'Say what the comparison is FOR, so it is not just two facts. The shape of a coastline decides how easy it is to reach the interior of a landmass from the sea. An indented coast with rivers running inland makes that easy. A smooth coast with rivers that fall makes it hard. This is a physical constraint, and it applies the same way to a large cargo ship and to a small riverboat.',
        'One caution, and it matters. WRONG: "Africa is hard to reach." CORRECT: "Ships reach the coast of Africa easily; what the plateau and the cataracts limit is travel from the sea INLAND by river." Those are different claims, and only the second one is true.',
      ],
      answer:
        'Reason one: Africa is a plateau continent, so rivers running from the raised interior to the sea drop over cataracts and waterfalls near the coast, and a boat coming from the ocean cannot pass them. Reason two: the coastline is remarkably smooth for the size of the continent, with few deep bays, so there are few natural harbors. Europe is the opposite -- a deeply indented coastline with many bays, peninsulas and natural harbors -- which is why reaching the interior from the sea is far easier there.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-south-of-the-equator',
      kind: 'try_yourself',
      problem:
        'Traveling north from the Equator in Africa, you pass tropical rainforest, then savanna, then a semi-arid belt, then desert. What will you most likely find traveling SOUTH from the Equator, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The same sequence in reverse -- desert first, then semi-arid land, then savanna, then rainforest -- because everything is flipped south of the Equator.' },
        { id: 'b', text: 'Rainforest the whole way, because land south of the Equator stays warm and wet.' },
        {
          id: 'c',
          text: 'The same sequence -- rainforest, then savanna, then semi-arid land, then desert -- because latitude controls climate the same way on both sides of the Equator.',
          correct: true,
        },
        { id: 'd', text: 'Cold and snowy land, because the seasons are opposite in the Southern Hemisphere.' }
      ],
      expectedAnswer:
        'The same sequence -- rainforest, then savanna, then semi-arid land, then desert -- because latitude controls climate the same way on both sides of the Equator.',
      hints: [
        'The bands are arranged by DISTANCE FROM THE EQUATOR, and you are starting at the Equator both times. So which end of the list comes first?',
        'Two of these choices treat the Southern Hemisphere as an opposite world. Opposite SEASONS is a real thing; an opposite order of climate bands is not.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-why-the-waterfalls',
      kind: 'try_yourself',
      problem:
        'Rivers in Africa often have cataracts and waterfalls not far inland from the coast, which stops boats coming up from the sea. Every statement below is true. Which one EXPLAINS the waterfalls?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The coastline of Africa is smooth, with few deep bays.' },
        { id: 'b', text: 'The Equator crosses through the middle of the continent.' },
        { id: 'c', text: 'The Sahara stretches across the north of the continent.' },
        { id: 'd', text: 'The interior of the continent is a raised plateau, and the land drops steeply to a narrow coastal plain.', correct: true }
      ],
      expectedAnswer: 'The interior of the continent is a raised plateau, and the land drops steeply to a narrow coastal plain.',
      hints: [
        'A waterfall needs one thing: water going from higher land to lower land over a short distance. Which choice describes a change in ELEVATION?',
        'Three of these are true facts about Africa that have nothing to do with how high the land is. True is not the same as relevant.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-not-all-dry',
      kind: 'try_yourself',
      problem:
        'A student writes: "Africa is mostly desert, so the whole continent is dry." Which piece of evidence best shows that the student is wrong?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Sahara is the largest hot desert on Earth.' },
        { id: 'b', text: 'The Kalahari and the Namib are deserts in southern Africa.' },
        { id: 'c', text: 'The Sahara stretches from the Atlantic coast to the Red Sea.' },
        {
          id: 'd',
          text: 'The Congo Basin at the Equator holds a large tropical rainforest that is wet all year, and savanna with a wet season covers large areas.',
          correct: true,
        }
      ],
      expectedAnswer:
        'The Congo Basin at the Equator holds a large tropical rainforest that is wet all year, and savanna with a wet season covers large areas.',
      hints: [
        'All four statements are true. The question is not which is true -- it is which one ARGUES AGAINST the student.',
        'Three of these choices name deserts, which is what the student already believes. Look for the choice that names somewhere in Africa that is not dry.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-africa-as-one-place',
      kind: 'misconception_check',
      question:
        'A student is describing Africa and writes two sentences: "Africa is hot and dry, and it looks about the same everywhere." and "The Sahara ends, and then the savanna starts." What is wrong with each one?',
      commonErrors: [
        {
          answer: 'Africa is hot and dry, and it looks about the same everywhere.',
          misconception:
            'Treating a whole continent as a single place with a single climate. The student has taken one true fact -- that a very large desert covers the north -- and stretched it over every latitude, every elevation and every country on the continent. This is the most common error people make about Africa, and it is worth naming out loud rather than quietly fixing.',
          correctsTo:
            'Africa is the second largest continent on Earth and contains many countries and many environments. The Congo Basin at the Equator is rainforest, wet through the whole year. Savanna grassland covers large areas on both sides of it. The Ethiopian Highlands are cool because of elevation, not because of latitude. Mount Kilimanjaro has snow near the top. The far northern coast and the far southern tip have a Mediterranean-type climate with mild wet winters. WRONG: "Africa is hot and dry." CORRECT: "Africa holds rainforest, savanna, semi-arid belts, deserts, highlands and Mediterranean-type coasts, because the continent reaches far north and far south of the Equator and its land rises to very different elevations." A continent is never one place, and the way to talk about it is to name the part you mean.',
        },
        {
          answer: 'The Sahara ends, and then the savanna starts.',
          misconception:
            'Imagining the edge of a region as a line you could stand on, with desert on one side and grassland on the other. Boundaries drawn on a page encourage this, and the Sahel is the clearest place in the world where it fails.',
          correctsTo:
            'Between the Sahara and the savanna lies the Sahel, a semi-arid belt that is drier toward the desert in the north and wetter toward the savanna in the south. Walk south across it and the land changes gradually the whole way -- there is no step. WRONG: "The desert ends at a line." CORRECT: "The desert grades into the savanna across the Sahel, a transition zone." Remember from Unit 1 that some boundaries are bands rather than lines, and a climate boundary is almost always one of those.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Africa is the second largest continent on Earth, holding many countries and many environments. Describing it as one place is the single most common mistake made about it -- always name the part you mean.',
        'The Equator crosses the middle of Africa, and the continent reaches far north and far south of it, so the climate bands mirror: rainforest, savanna, semi-arid, desert, then a Mediterranean-type climate at each far edge. The order mirrors; the widths do not.',
        'The Sahara across the north is the largest hot desert on Earth. The Sahel south of it is a semi-arid transition zone -- a boundary that is a band, not a line.',
        'Savanna is tropical grassland with scattered trees and a pronounced wet and dry season. The Congo Basin at the Equator holds a large tropical rainforest. The Kalahari and the Namib are deserts in southern Africa.',
        'The Nile flows north to the Mediterranean Sea and is the longest river in Africa. The Congo and the Niger reach the Atlantic Ocean and the Zambezi reaches the Indian Ocean.',
        'Africa is a plateau continent with a remarkably smooth coastline, so rivers fall over cataracts near the coast and there are few natural harbors. Boats from the sea cannot travel far inland -- the opposite of the deeply indented coast of Europe.',
        'The Great Rift Valley in eastern Africa is where the crust is pulling apart, with long deep lakes along it. Lake Victoria is the largest lake in Africa by area, Mount Kilimanjaro is the highest mountain in Africa, the Atlas Mountains cross the northwest, and the Ethiopian Highlands are cool because of elevation rather than latitude.',
        'Madagascar is a large island off the southeastern coast of Africa, in the Indian Ocean.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.1', cedTitle: 'Africa: Physical Geography' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
