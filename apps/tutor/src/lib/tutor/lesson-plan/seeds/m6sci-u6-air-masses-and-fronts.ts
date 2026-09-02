/**
 * Grade 6 Science (Earth & Space Science) — Weather & the Atmosphere:
 * Air Masses & Fronts.
 *
 * CONCEPT-LED row in the m6sci fan-out (NGSS MS-ESS2-5). The whole lesson
 * builds one picture in two layers: first, that an air mass takes its
 * temperature and moisture from the specific stretch of land or ocean it
 * forms over (its source region), and second, that where two different air
 * masses meet -- a front -- the weather that results depends on which air
 * mass is advancing and how it moves against the other. Because there is no
 * map the student can see, every mention of a front in this file names both
 * air masses and states, in words, which one is moving in and which one is
 * being displaced -- the way the phases-of-the-moon exemplar always names
 * the Sun-Moon-Earth order instead of pointing at a diagram.
 *
 * SCOPE GUARD: this plan covers how an air mass's temperature and moisture
 * are set by its source region, and the weather produced when a COLD FRONT
 * or a WARM FRONT passes through a location -- exactly the two front types
 * named in this row's curriculum scope sentence, and no others. Because
 * several close boundaries sit right next to this row, the guard states what
 * is deliberately EXCLUDED and, where useful, what is deliberately ALLOWED
 * at that edge, and why:
 *   - STATIONARY FRONTS and OCCLUDED FRONTS are real front types and do not
 *     appear anywhere in this file, by name or by description. This row's
 *     curriculum scope sentence names only "a cold front or warm front", and
 *     no sibling row in Unit 6 claims the other two types either, so they are
 *     simply not taught in this course band. A dispatch hazard note for this
 *     row assumed all four types would be ledgered together; the curriculum
 *     row is authoritative over that note, and this file follows the row.
 *   - ROW 6.1 (layers and composition of the atmosphere) owns the
 *     troposphere/stratosphere/mesosphere/thermosphere structure and the
 *     78-percent-nitrogen, 21-percent-oxygen composition. None of that
 *     appears here; this file treats the atmosphere only as the medium air
 *     masses move through.
 *   - ROW 6.3 (reading weather maps) owns map symbols, pressure centers, and
 *     reading a drawn map to describe current conditions. This file never
 *     asks the student to read a map; every front in this file is described
 *     in words -- which air mass is advancing, from which direction, into
 *     what was already there -- and every item is solvable from that text
 *     alone.
 *   - ROW 6.4 (how air-mass interactions produce severe weather) owns
 *     thunderstorms, tornadoes and hurricanes as phenomena in their own
 *     right. This file names "a thunderstorm" only as one possible outcome
 *     along a fast-moving cold front, never as a topic to explain, and one
 *     try_yourself distractor explicitly rejects the idea that a front needs
 *     a hurricane or a tornado attached to it in order to produce any
 *     precipitation at all.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: this file states THAT an advancing
 *     cold air mass forces the resident warm air upward quickly, and THAT a
 *     warm air mass rises gradually over retreating cooler air, and it states
 *     THAT precipitation results in each case. It does not explain WHY --
 *     the sentence this file deliberately does not write is "warm air rises
 *     over cold air because it is less dense, and lifting cools it until its
 *     water vapor condenses into cloud." That is density and phase-change
 *     physics and belongs to Grade 8 physical science; it is named here so
 *     the boundary is explicit rather than merely absent.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every front
 * and every source region in this file is written out in words -- which air
 * mass, which direction, which one is moving into which -- and every item is
 * solvable from the text printed inside it. Never write "see the weather map
 * above", and never assume the student can see a front symbol.
 */

import type { LessonPlan } from "../types";
import { MS_PACING_THRESHOLDS, MS_SOURCE } from "./_ms-shared";

export const SEED_M6SCI_U6_AIR_MASSES_AND_FRONTS: LessonPlan = {
  id: "evelyn.ms.m6sci.air-masses-and-fronts.v1",
  title: "Air Masses & Fronts",
  curriculum: "MS",
  grade: "6",
  subject: "science",
  topic: "grade-6-earth-space-science",
  locale: "en",
  los: [
    {
      id: "m6sci.air-masses-and-fronts",
      standard: "M6SCI-6.2",
      description:
        "Describe how an air mass's temperature and moisture depend on where it formed, and predict the weather produced when a cold front or warm front passes through a location (NGSS MS-ESS2-5).",
    },
  ],
  prerequisites: ["m6sci.layers-and-composition-of-the-atmosphere"],
  followUps: ["m6sci.reading-weather-maps"],
  estimatedMinutes: 22,
  segments: [
    {
      id: "hook",
      kind: "hook",
      goal: "Get the student to notice that two very different everyday weather patterns are actually the same kind of event -- a boundary between two air masses -- behaving in two different ways.",
      script:
        "Think about two different kinds of days you may have noticed. On one kind of day, the sky darkens fast, the wind suddenly picks up, rain comes down hard for maybe twenty minutes, and then it clears up and the air feels noticeably cooler and fresher than before. On a different kind of day, the sky just slowly turns gray over the whole morning, and then it drizzles on and off, lightly, for hours and hours without ever really clearing up. Those two days are not random and they are not caused by two different things. They are two different ways that the boundary between two huge bodies of air can pass over the place where you live. Today you learn what those bodies of air are, why they end up with such different temperature and moisture, and why the boundary between two of them behaves so differently depending on which one is doing the pushing.",
      suggestedTools: ["show_map"],
      estimatedMinutes: 1,
    },
    {
      id: "concept-air-masses-and-fronts",
      kind: "concept",
      goal: "Build the idea of an air mass and its source region, then use that to define a front and predict the weather a cold front or a warm front produces.",
      keyIdeas: [
        "AN AIR MASS TAKES ITS STAMP FROM ITS SOURCE REGION. An air mass is a huge body of air, often covering thousands of kilometers, that settles over one part of Earth's surface for several days and slowly comes to match that surface's temperature and moisture. The specific stretch of land or ocean it sits over is called its SOURCE REGION. A good source region is large and fairly uniform -- an unbroken stretch of open ocean, or a wide plain of land -- so the air above it has time to even out and pick up one consistent temperature and moisture.",
        "TWO PROPERTIES, TWO SEPARATE CAUSES. An air mass's TEMPERATURE comes from how close its source region is to the poles or to the equator: a source region far to the north or far to the south gives a cold air mass, and one close to the equator gives a warm air mass. Its MOISTURE comes from what kind of surface the source region is: open ocean water is a steady source of evaporation, so an air mass forming over ocean is humid, while dry land far from any large body of water gives a dry air mass. The two causes are independent of each other -- a source region can be cold and dry (frozen land far to the north), or warm and humid (open ocean water near the equator), or either of the other two combinations.",
        "AN AIR MASS TRAVELS AND KEEPS ITS STAMP. Once an air mass leaves its source region, winds carry it toward other places, and it keeps roughly the temperature and moisture it picked up for as long as it keeps moving. That is why a single air mass can bring the same kind of weather to several places in a row as it passes over them. It only starts to change where it runs into a different air mass that formed somewhere else.",
        "A FRONT IS NAMED FOR THE AIR MASS THAT IS MOVING IN. The place where two air masses of different temperature and moisture meet is called a FRONT. There is no way to reason about a front without naming both air masses and saying which one is advancing, because the front is defined by that motion: a COLD FRONT is a front where an advancing mass of cold air is pushing into a region and displacing a mass of warmer air that was already there; a WARM FRONT is a front where an advancing mass of warm air is pushing into a region and displacing a mass of cooler air that was already there. Every time you reason about a front, name both air masses and say which one is moving in -- there is no map here to point to instead.",
        "COLD FRONT: FAST AND NARROW. At a cold front, the incoming cold air moves in low and forces the resident warm air upward quickly. (This lesson does not explain why the cold air stays low while the warm air is forced up -- that is a density and phase-change explanation that belongs to Grade 8 physical science. Here the boundary's effect is stated, not its cause.) Because the warm air is forced up fast, a cold front typically brings a relatively narrow band of quick, sometimes intense, showers or thunderstorms right around the boundary, followed by clearer skies and noticeably cooler, drier air behind it. This outcome genuinely varies: not every cold front produces a thunderstorm. How strong the weather is depends on how much moisture was in the warm air being lifted, and sometimes a cold front brings only a line of showers, a gusty wind shift and a quick temperature drop, with no thunderstorm at all.",
        "WARM FRONT: SLOW AND WIDE. At a warm front, the incoming warm air rides up and over the retreating cooler air ahead of it, along a boundary that slopes very gradually rather than steeply. Because the rise is gradual and spread over a wide area ahead of the front, a warm front typically brings clouds that thicken slowly, then a longer stretch of steadier, lighter precipitation that can last many hours before the front finally passes, followed by warmer, more humid air behind it. This outcome genuinely varies too: the exact form of that precipitation depends on temperature, and a warm front can bring rain, snow, or a mix, especially in winter.",
      ],
      vocabulary: [
        {
          term: "air mass",
          definition:
            "a huge body of air, often covering thousands of kilometers, that has settled into fairly uniform temperature and moisture by sitting over one kind of surface for several days.",
        },
        {
          term: "source region",
          definition:
            "the specific stretch of land or ocean an air mass forms over, and the surface whose temperature and moisture the air mass takes on.",
        },
        {
          term: "front",
          definition: "the boundary where two air masses of different temperature and moisture meet.",
        },
        {
          term: "cold front",
          definition: "a front where an advancing mass of cold air is displacing a mass of warmer air that was in place.",
        },
        {
          term: "warm front",
          definition: "a front where an advancing mass of warm air is displacing a mass of cooler air that was in place.",
        },
      ],
      suggestedTools: ["show_map", "show_diagram"],
      estimatedMinutes: 6,
    },
    {
      id: "worked-air-mass-properties",
      kind: "worked_example",
      problem:
        "Air has been sitting for several days over the open water of the Gulf of Mexico, close to the equator, during July. Describe the temperature and moisture of the air mass that forms there, and explain how you know each one separately.",
      steps: [
        "Identify the source region and confirm there has been enough time. The Gulf of Mexico is a large, fairly uniform stretch of open ocean water, and the air has been sitting over it for several days -- long enough for the air to match the surface.",
        "Find the temperature clue first: latitude. The Gulf of Mexico sits at a low latitude, close to the equator, so its water and the air above it stay warm. Low latitude gives a warm air mass.",
        "Find the moisture clue separately: surface type. The surface is open ocean water, which evaporates steadily and adds moisture to the air above it. Ocean surface gives a humid air mass.",
        "WRONG: \"The Gulf of Mexico is a large body of water, so the air sitting over it must be cold.\" CORRECT: \"Being a large body of water sets the air's moisture, not its temperature. The Gulf's low latitude is what makes the air warm; a large body of water at a HIGH latitude would still make the air humid, but it would make it cold, not warm.\"",
        "Combine the two separate clues: warm and humid.",
        "Now run the two checks a science answer needs, since there is no arithmetic to redo here. First, three clues of different kinds that agree. A location clue: a low-latitude ocean is a classic warm, humid source region. A definitional clue: open water is a steady evaporation source no matter the exact month, so the humidity does not depend specifically on it being July. An everyday clue: a muggy, still afternoon near a warm lake in summer feels exactly like this air mass -- warm and heavy with moisture. Second, change one condition and check that the answer moves. Move the same open-water source region far to the north, near Iceland, in winter: the water is still a moisture source, so the air mass is still humid, but the low temperature at that latitude now makes it a cold, humid air mass instead of a warm one. Moisture came from the surface type in both cases; temperature came from the latitude in both cases, and only the latitude changed.",
      ],
      answer:
        "The air mass is warm and humid: warm because the Gulf of Mexico sits at a low latitude, and humid because it is forming over open ocean water.",
      estimatedMinutes: 3,
    },
    {
      id: "worked-cold-front-weather",
      kind: "worked_example",
      problem:
        "A mass of cold, dry air is advancing from the northwest into a town where a mass of warm, humid air has been sitting for the past two days. Predict the weather the town will experience as this front passes, and compare it with what would happen if a mass of warm, humid air were advancing into the same town instead, displacing a retreating mass of cooler air.",
      steps: [
        "Name both air masses and the motion before doing anything else, since there is no map to point to: a cold, dry air mass is advancing; a warm, humid air mass is being displaced. Because the air mass that is advancing is the cold one, this is a cold front.",
        "State what happens at the boundary: the incoming cold air moves in low and forces the resident warm, humid air upward quickly. (This is as far as this lesson goes -- it does not explain why the cold air stays low while the warm air is forced up; that is a density and phase-change explanation that belongs to Grade 8 physical science.)",
        "Because the warm, humid air is forced upward fast, expect a relatively narrow band of quick, sometimes intense, showers or a thunderstorm right around the boundary, followed by clearer skies and a noticeable drop to cooler, drier air behind the front. This is not guaranteed to be a thunderstorm every time -- the strength depends on how much moisture the warm air was carrying.",
        "WRONG: \"A front is basically another word for a storm, so this front will definitely bring severe weather.\" CORRECT: \"A front is the boundary between two air masses. Whether it produces a storm, and how strong that storm is, depends on the temperature and moisture difference between the two air masses and how quickly the boundary is moving -- not every front produces a storm.\"",
        "Now change one condition and see the answer move: suppose instead that a mass of warm, humid air were the one advancing into the same town, displacing a mass of cooler air retreating ahead of it. That is a warm front instead of a cold front. There, the warm air rides up and over the retreating cooler air along a gradual slope, so expect clouds thickening slowly, then a longer stretch of steadier, lighter rain lasting many hours before the front passes, with warmer, more humid air arriving behind it -- the opposite pacing from the cold front, even though both events are called fronts.",
        "Check the cold-front prediction with three clues of different kinds. A definitional clue: an advancing mass of cold air forcing the resident warm air up quickly matches the general cold-front pattern described in this lesson. A before-and-after clue: conditions before the front are warm and humid, and conditions after are cooler and drier, which is exactly the change a passing cold front should produce. An everyday clue: a sudden, brief downpour followed by noticeably fresher, cooler air matches what people already recognize as a cold front passing.",
      ],
      answer:
        "As the cold front passes, expect a narrow band of quick, sometimes intense, showers or a thunderstorm, followed by clearer, cooler, drier air. If a warm front were advancing instead, expect clouds thickening gradually and a longer period of steadier, lighter rain before warmer, more humid air arrives -- a slower, wider pattern than the cold front's fast, narrow one.",
      estimatedMinutes: 4,
    },
    {
      id: "try-air-mass-properties",
      kind: "try_yourself",
      problem:
        "An air mass has been sitting for several days over a broad, dry desert plain at a low latitude. Which best describes the air mass that forms there?",
      responseFormat: "mcq",
      choices: [
        {
          id: "a",
          text: "Warm and dry, because the low latitude makes the air warm and the dry land surface gives it very little moisture.",
          correct: true,
        },
        {
          id: "b",
          text: "Warm and humid, because very hot air always carries a lot of moisture along with it.",
        },
        {
          id: "c",
          text: "Cold and dry, because deserts are always cold, no matter what latitude they sit at.",
        },
        {
          id: "d",
          text: "Cold and humid, because any large source region produces the same kind of air mass, whether it is land or ocean.",
        },
      ],
      expectedAnswer: "Warm and dry, because the low latitude makes the air warm and the dry land surface gives it very little moisture.",
      hints: [
        "Work out the two properties from two separate clues: what does the latitude tell you about temperature, and what does the type of surface tell you about moisture?",
        "A desert surface does not evaporate much water, no matter how hot it gets. Keep the temperature clue and the moisture clue from getting mixed together.",
      ],
      estimatedMinutes: 2,
    },
    {
      id: "try-warm-front-weather",
      kind: "try_yourself",
      problem:
        "A mass of warm, humid air is advancing into a valley from the south, riding up and over a mass of cooler air that is retreating to the north ahead of it. Which best describes the weather the valley will most likely experience over the next day as this front passes?",
      responseFormat: "mcq",
      choices: [
        {
          id: "a",
          text: "A short, intense burst of heavy thunderstorms right as the front arrives, followed by a sudden drop in temperature, because any advancing air mass forces the same fast, narrow burst of weather no matter which one, cold or warm, is doing the advancing.",
        },
        {
          id: "b",
          text: "Clouds thickening gradually, then a longer period of steadier, lighter rain lasting many hours, followed by warmer, more humid air once the front passes.",
          correct: true,
        },
        {
          id: "c",
          text: "A sudden, violent storm the moment the front passes, because crossing from one air mass into another always triggers severe weather.",
        },
        {
          id: "d",
          text: "No real change in the weather at all, because precipitation only happens along a front where cold air is the one doing the advancing.",
        },
      ],
      expectedAnswer:
        "Clouds thickening gradually, then a longer period of steadier, lighter rain lasting many hours, followed by warmer, more humid air once the front passes.",
      hints: [
        "Name which air mass is advancing and which is retreating, then compare how steep or gradual that kind of boundary is, the way the lesson describes for a warm front.",
        "A gradual, wide boundary spreads its weather out over more time than a narrow, fast one does. Think about how long the change should take, not just what kind of precipitation falls.",
      ],
      estimatedMinutes: 2,
    },
    {
      id: "try-compare-cold-and-warm-front",
      kind: "try_yourself",
      problem:
        "A mass of cold, dry air is advancing to the southeast, sliding in underneath a mass of warm, humid air that has been over a city for two days. Compare the weather this cold front will most likely bring with the weather a warm front would bring if, instead, a mass of warm, humid air were advancing into the same city while a mass of cooler air retreated ahead of it.",
      responseFormat: "mcq",
      choices: [
        {
          id: "a",
          text: "Both fronts bring the same weather pattern: clouds thickening gradually over many hours, followed by a long period of steady, lighter rain, because a front's weather comes from two air masses meeting and not from which one of them happens to be advancing.",
        },
        {
          id: "b",
          text: "The cold front brings clouds thickening gradually over many hours, while the warm front brings a brief, intense band of heavy showers or a thunderstorm, because the warmer of the two air masses is always the one that produces the more sudden, dramatic weather.",
        },
        {
          id: "c",
          text: "The cold front brings a relatively narrow band of quick, sometimes intense showers or a thunderstorm as the warm air is forced upward fast, followed by clearer, cooler, drier air; the warm front instead brings clouds thickening gradually and a longer period of steadier, lighter rain as the warm air rises gradually, followed by warmer, more humid air.",
          correct: true,
        },
        {
          id: "d",
          text: "Neither front produces any precipitation by itself; rain or snow only happens when a front is also part of a larger, named storm system such as a hurricane or a tornado, because an ordinary front on its own is too weak to lift enough air to form clouds.",
        },
      ],
      expectedAnswer:
        "The cold front brings a relatively narrow band of quick, sometimes intense showers or a thunderstorm as the warm air is forced upward fast, followed by clearer, cooler, drier air; the warm front instead brings clouds thickening gradually and a longer period of steadier, lighter rain as the warm air rises gradually, followed by warmer, more humid air.",
      hints: [
        "Work out each front's pattern separately first: is the boundary narrow and fast, or wide and gradual? That decides whether the weather is a quick, intense burst or a longer, steadier stretch.",
        "Do not assume the two kinds of fronts behave the same way, and do not assume a front needs to be part of a bigger storm system to produce any precipitation at all.",
      ],
      estimatedMinutes: 2,
    },
    {
      id: "misconception-front-is-a-storm",
      kind: "misconception_check",
      question:
        "A student says: \"A cold front and a warm front are really just two names for a storm; whichever one is coming through, get ready for bad weather.\" A second student says a front is named for whichever air mass gets pushed out, not the one moving in. What is wrong with each idea?",
      commonErrors: [
        {
          answer: "A cold front and a warm front are just two names for a storm.",
          misconception:
            "Treating a front as if it were another word for a storm, because most people only notice a front on the day it changes their weather.",
          correctsTo:
            "A front is the boundary where two air masses of different temperature and moisture meet -- it is not itself a storm. Whether a front produces a storm, and how strong that storm is, depends on how different the two air masses are and how fast the boundary is moving. A cold front often brings a narrow band of quick, sometimes intense weather because the incoming cold air forces the warm air up fast, and a warm front often brings a longer stretch of steadier, lighter weather because the incoming warm air rises gradually -- but in both cases, the front's name comes from which air mass is advancing, not from a promise of a storm.",
        },
        {
          answer: "A front is named for whichever air mass is being pushed out.",
          misconception:
            "Naming the front after the air mass that used to be in place rather than the one that is arriving, because that is the air mass the student already knew was there.",
          correctsTo:
            "A front is named for the air mass that is ADVANCING -- the one moving in and displacing the other -- not the one being pushed out. If a mass of cold air is moving in and pushing out a mass of warm air, that is a cold front, even though the place was warm a moment ago. Naming both air masses and stating which one is on the move is the only reliable way to work out which kind of front is happening.",
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: "recap",
      kind: "recap",
      mustRemember: [
        "An air mass takes on the temperature and moisture of its source region -- the stretch of land or ocean it sits over for several days.",
        "Latitude sets an air mass's temperature; the type of surface, ocean or land, sets its moisture. The two causes are separate from each other.",
        "An air mass keeps roughly its temperature and moisture as it travels, until it meets a different air mass.",
        "A front is the boundary where two air masses meet, and it is named for the air mass that is advancing: a cold front is cold air moving in on warmer air; a warm front is warm air moving in on cooler air.",
        "A cold front forces warm air up fast, giving a narrow band of quick, sometimes intense showers or thunderstorms, then clearer, cooler, drier air -- but not every cold front produces a thunderstorm.",
        "A warm front lifts air gradually over a wide area, giving a longer stretch of steadier, lighter rain or snow before warmer, more humid air arrives.",
        "A front is a boundary, not a storm. Whether it produces one, and how strong, depends on the temperature and moisture difference between the two air masses and how fast the boundary moves.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: "6", cedTopic: "6.2", cedTitle: "Air Masses & Fronts" },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
