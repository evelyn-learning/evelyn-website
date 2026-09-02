/**
 * Grade 6 World Geography — Weather, Climate & Ecosystems: The Water Cycle.
 *
 * CONCEPT-LED row for the m6geo fan-out (National Geography Standard 7). The
 * student has no diagram, so the whole lesson installs one ordered loop in
 * words: energy from the sun turns liquid water into rising vapor
 * (evaporation); the rising vapor cools into the tiny droplets that make a
 * cloud (condensation); droplets grow too heavy and fall to the surface
 * (precipitation); fallen water gathers into oceans, lakes and rivers
 * (collection), ready to evaporate again. This is the classic four-stage
 * model the curriculum row names verbatim -- "evaporation, condensation,
 * precipitation, and collection" -- and nothing past DEFINE-and-ORDER depth.
 *
 * SCOPE GUARD: this row names and defines the four stages of the water cycle
 * in their one fixed order, and states one plain-language driver for each
 * change (the sun's energy warms water into vapor; cooling turns vapor back
 * into droplets; droplets falling out once they are too heavy; fallen water
 * gathering into a body of water). It never explains WHY those changes
 * happen at the level of what water is made of, and it never breaks
 * "collection" apart into separate destinations for the water. Boundaries,
 * stated so a reviewer can check each one:
 *   - CROSS-COURSE BOUNDARY, the one this row is built to walk right up to.
 *     The sibling Grade 6 SCIENCE course covers this exact subject across
 *     two lessons at a deeper Earth-systems level:
 *     `m6sci-u7-the-water-cycle-evaporation-condensation-precipitation.ts`
 *     (the atmospheric half) and
 *     `m6sci-u7-the-water-cycle-groundwater-and-runoff.ts` (the
 *     surface/subsurface half). Read together, those two rows describe FIVE
 *     things this row never does: (1) they distinguish evaporation from
 *     boiling by naming an everyday misconception about heat; (2) after
 *     precipitation lands, they split its path into three named
 *     destinations -- RUNOFF (flowing across the surface), INFILTRATION
 *     (soaking into the ground, the water table, and an aquifer), and PLANT
 *     UPTAKE (taken up by roots, later released as vapor through
 *     TRANSPIRATION); (3) they name the water table and the saturated zone
 *     as underground zones; (4) they explain permeable versus impermeable
 *     ground; (5) they use "recharge" for how an aquifer refills. None of
 *     those five things, and none of the words "runoff", "infiltration",
 *     "infiltrate", "groundwater", "aquifer", "transpiration", "water
 *     table", "saturated zone", "permeable" or "impermeable", appears
 *     anywhere in this file. This row instead uses the plainer, whole-loop
 *     word the curriculum row itself names -- COLLECTION -- for the single
 *     idea that fallen water gathers into oceans, lakes, rivers and other
 *     bodies of water. That is not a disagreement with the science course;
 *     the science course's own runoff eventually "reaches a lake or the
 *     ocean" too. It is a shallower, whole-cycle framing of the same true
 *     fact, stated without ever claiming it is the ONLY thing that happens
 *     to fallen water -- this row simply never raises the other
 *     possibilities the science course owns.
 *   - GRADE 8 PHYSICAL SCIENCE boundary -- the one sentence this row
 *     deliberately never writes, matching the boundary the science course's
 *     own doc comment names for itself: "the sun's energy gives water
 *     molecules enough energy to break free from each other and escape as a
 *     gas." That particle-level account of evaporation as a phase change is
 *     Grade 8 content. This row instead says only that energy from the sun
 *     warms water until it "changes into" water vapor -- naming the
 *     transformation and its one-link driver, never the molecular why.
 *   - ROW 5.1 (`m6geo.weather-vs-climate`, the prerequisite) owns
 *     distinguishing weather from climate. This row never re-teaches that
 *     distinction and never uses "climate" as a taught term.
 *   - ROW 5.3 (`m6geo.what-is-a-biome`, the follow-up) owns matching
 *     described conditions to a biome. This row never names a biome and
 *     never connects precipitation amounts to plant or animal life.
 *   - No named plate-boundary, climate-control, or other closed mechanism
 *     typology appears here; the four water-cycle stages are the row's own
 *     assigned content per the signed curriculum, not a borrowed mechanism.
 *   - DEPTH-CEILING TEST 5 NOTE: no Grade 7 World Geography lesson teaches
 *     the water cycle (it is not in the G7 unit-title list and does not
 *     appear in the "Explicitly excluded" list), so the practical
 *     same-subject, greater-depth file to hold this row's sentences against
 *     is the sibling Grade 6 Science pair named above, not a Grade 7 file.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U5_THE_WATER_CYCLE: LessonPlan = {
  id: 'evelyn.ms.m6geo.the-water-cycle.v1',
  title: 'The Water Cycle',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.the-water-cycle',
      standard: 'M6GEO-5.2',
      description:
        'Describe evaporation, condensation, precipitation, and collection as the four stages of the water cycle and explain how water moves between them (National Geography Standard 7: the physical processes that shape the patterns of Earth\'s surface).',
    },
  ],
  prerequisites: ['m6geo.weather-vs-climate'],
  followUps: ['m6geo.what-is-a-biome'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the whole loop as one connected story before any vocabulary arrives.',
      script:
        'On a weekend camping trip, a family wakes up early by a lake. By the middle of the afternoon, tall gray clouds have piled up over the mountains at the edge of the campsite. That evening, heavy rain drums on the tent, and a stream that was barely a trickle that morning is running fast by bedtime. The next day, the lake looks about the same as it did the morning before, ready to start the whole thing over again. That is not four unrelated weather events happening to line up. It is one process, running in a loop, and today you learn its name and its four stages: evaporation, condensation, precipitation, and collection.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-four-stages',
      kind: 'concept',
      goal: 'Define each of the four stages in its fixed order, with one plain driver for each change, and establish that the loop repeats.',
      keyIdeas: [
        'THE WATER CYCLE IS ONE PROCESS WITH FOUR STAGES, ALWAYS IN THE SAME ORDER. Water on Earth moves through four stages, one after another: EVAPORATION, CONDENSATION, PRECIPITATION, and COLLECTION. The order never changes and no stage can happen before the stage that comes before it.',
        'EVAPORATION IS THE FIRST STAGE. Energy from the sun warms liquid water sitting in an ocean, a lake, or a river. Warmed water at the surface changes into water vapor, an invisible gas, and that vapor rises into the air above it. This change, liquid water becoming water vapor, is EVAPORATION.',
        'CONDENSATION IS THE SECOND STAGE. As water vapor rises higher into the sky, it cools. Cooled water vapor changes back into liquid water, forming huge numbers of tiny droplets far too small and light to fall. Those tiny droplets, clustered together and floating in the air, are what a cloud is. This change, water vapor becoming liquid water again, is CONDENSATION.',
        'PRECIPITATION IS THE THIRD STAGE. Inside a cloud, tiny droplets keep bumping into each other and joining into bigger drops. Once a drop is too heavy for the air to hold up, it falls out of the cloud toward the ground. Water falling from a cloud to Earth\'s surface, as rain, snow, sleet, or hail, is PRECIPITATION.',
        'COLLECTION IS THE FOURTH STAGE. Once water reaches Earth\'s surface, it gathers into oceans, lakes, rivers, and other bodies of water. This gathering of fallen water into the places where it is stored is COLLECTION. Water sitting in a lake or an ocean after collection is the same kind of water that evaporation started with, so the process can run again.',
        'THE CYCLE HAS NO STARTING POINT AND NO ENDING POINT. Because collection leads right back into evaporation, the four stages form a loop rather than a one-way trip. Water that collects in an ocean today can evaporate again, condense again, and fall again as precipitation somewhere else entirely. This is why it is called the WATER CYCLE rather than a one-time water journey.',
      ],
      vocabulary: [
        { term: 'evaporation', definition: 'liquid water changing into invisible water vapor, warmed by energy from the sun.' },
        { term: 'condensation', definition: 'water vapor cooling and changing back into tiny liquid droplets, which cluster together to form a cloud.' },
        { term: 'precipitation', definition: 'water falling from a cloud to Earth\'s surface as rain, snow, sleet, or hail.' },
        { term: 'collection', definition: 'water gathering into oceans, lakes, rivers, and other bodies of water after it falls to Earth\'s surface.' },
        { term: 'water cycle', definition: 'the four-stage loop water follows as it evaporates, condenses, falls, and collects, again and again.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-pond-scene-in-order',
      kind: 'worked_example',
      problem:
        'A school pond sits at the edge of a playground. On a hot, sunny day, the level of water in the pond drops a little by the end of the school day, even though nobody removed any water and it did not rain that day. By early evening, a heavy gray cloud has formed directly above the school. That night, rain falls onto the playground and flows downhill into the pond, filling it back up close to its morning level. Name the water-cycle stage that matches each part of this description, in order, and explain why the pond ends up back near where it started.',
      steps: [
        'Take the first detail alone. The pond drops a little on a hot sunny day, with no water removed and no rain that day. Sunlight warmed the surface of the pond, and warmed water changed into invisible water vapor that rose into the air. That change is evaporation, the first stage.',
        'Take the second detail next. A heavy gray cloud formed above the school by evening. As the vapor rose, it cooled, and cooled water vapor changed back into tiny liquid droplets clustered together in the sky. That change is condensation, the second stage.',
        'Take the third detail next. Rain fell onto the playground that night. Inside the cloud, droplets bumped together and grew too heavy for the air to hold up, so they fell to the surface. Water falling from a cloud to the ground is precipitation, the third stage.',
        'WRONG: "the pond refilled because an entirely new supply of rainwater arrived from somewhere else." CORRECT: "the rain that refilled the pond was made of the very same water that evaporated off the pond earlier that day -- it evaporated, condensed into the cloud overhead, fell as precipitation, and then flowed downhill and gathered in the pond, which is collection, the fourth stage."',
        'Name the fourth detail. Rain flowing downhill into the pond and gathering there, raising its level back toward where it started, is collection.',
        'Check the identification with three different kinds of clues. First, timing: the pond dropped during the hottest part of the day and the cloud and rain both came later that same day, matching the fixed order evaporation, then condensation, then precipitation. Second, description: each event in the scene matches exactly one stage\'s definition, with no stage left over and none needed twice. Third, completeness: tracing the four matched stages in order tells one connected story from the pond dropping in the afternoon to the pond nearly refilled that night, with no gap and no stage skipped.',
      ],
      answer:
        'The pond dropping is evaporation, sunlight warming the water into rising vapor. The cloud forming is condensation, the rising vapor cooling into droplets. The rain falling is precipitation, droplets growing too heavy and falling. The rain flowing into the pond and gathering there is collection, which returns the water close to where evaporation started so the cycle can run again.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-swapped-stage-names',
      kind: 'worked_example',
      problem:
        'A student writes: "Once water vapor rises into the sky and cools into a cloud, that stage is called collection. Then, once the cloud gets heavy and rain falls out of it, that stage is called evaporation." Two stage names in that description are swapped for the wrong stage. Find both mistakes and correct them.',
      steps: [
        'Take the first sentence alone. Water vapor rising and cooling into a cloud is water vapor changing back into liquid droplets. WRONG: "cooling into a cloud is called collection." CORRECT: "cooling into a cloud is called condensation."',
        'Take the second sentence alone. A cloud\'s droplets growing heavy and falling out as rain is water leaving the cloud and reaching the surface. WRONG: "rain falling out of a cloud is called evaporation." CORRECT: "rain falling out of a cloud is called precipitation."',
        'Check that the two swapped names still describe something real, once corrected. Evaporation is warmed liquid water changing into rising water vapor in the first place. Collection is fallen water gathering into oceans, lakes, and rivers once precipitation has already finished.',
        'Check the correction with three different kinds of clues. First, definitional: cooling always changes a gas into a liquid, which is exactly what condensation means and never what collection means. Second, positional: precipitation is defined as water leaving a cloud and falling, which matches "rain falls out of it" exactly. Third, completeness: once condensation and precipitation are placed correctly, all four stage names, evaporation, condensation, precipitation, and collection, are used exactly once each, with none repeated and none left over.',
        'The general lesson: swapping two stage names for each other is a common mistake, but each stage has its own exact definition, and only one stage name fits each event in a description.',
      ],
      answer:
        'The first swap: cooling into a cloud is condensation, not collection. The second swap: rain falling out of a cloud is precipitation, not evaporation.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-name-the-stage-condensation',
      kind: 'try_yourself',
      problem:
        'High in the sky, rising water vapor cools and changes into countless tiny liquid droplets that cluster together and float in the air. Which stage of the water cycle is being described?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Condensation, because the water vapor is changing from a gas back into tiny liquid droplets.', correct: true },
        { id: 'b', text: 'Evaporation, because liquid water is changing into vapor as it rises higher into the sky.' },
        { id: 'c', text: 'Precipitation, because the droplets described are already falling out of the sky toward the ground.' },
        { id: 'd', text: 'Collection, because the droplets described are gathering together into a single body of water.' },
      ],
      expectedAnswer: 'Condensation, because the water vapor is changing from a gas back into tiny liquid droplets.',
      hints: [
        'Notice which direction the water is changing: is it turning from a gas into a liquid, or from a liquid into a gas?',
        'The droplets described are still floating together in the sky, forming a cloud. They have not started falling yet, and they have not just gathered into a body of water on the ground.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-order-of-stages',
      kind: 'try_yourself',
      problem:
        'Water begins as liquid in a lake and evaporates. Starting from evaporation, which list correctly puts the remaining three stages of the water cycle in the order they actually happen next?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Precipitation, then condensation, then collection.' },
        { id: 'b', text: 'Condensation, then precipitation, then collection.', correct: true },
        { id: 'c', text: 'Collection, then condensation, then precipitation.' },
        { id: 'd', text: 'Condensation, then collection, then precipitation.' },
      ],
      expectedAnswer: 'Condensation, then precipitation, then collection.',
      hints: [
        'A cloud has to exist before anything can fall out of it, and a body of water can only receive water that has already fallen.',
        'Rule out any order where collection happens before precipitation, and any order where precipitation happens before condensation has formed the cloud.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-name-the-stage-collection',
      kind: 'try_yourself',
      problem:
        'Rain falls from a cloud onto a hillside. Streams carry the rainwater downhill until it gathers in a lake, where it will sit until the sun warms it enough to evaporate again. Which stage does the water reach once it is sitting in the lake?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Precipitation, because the water was still on its way down from the cloud just before it reached the lake.' },
        { id: 'b', text: 'Condensation, because the water changed from a gas back into a liquid earlier, somewhere along the way.' },
        { id: 'c', text: 'Collection, because the water has gathered into a lake and will stay there until it evaporates again.', correct: true },
        { id: 'd', text: 'Evaporation, because the description already says the water will evaporate once the sun warms it.' },
      ],
      expectedAnswer: 'Collection, because the water has gathered into a lake and will stay there until it evaporates again.',
      hints: [
        'Ask what is happening to the water right now, sitting in the lake, rather than what already happened to it earlier or what will happen to it later.',
        'The water already finished falling, and it already finished changing from vapor into liquid. What is left to name is what the water is doing while it sits there.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-disappears-and-one-time',
      kind: 'misconception_check',
      question:
        'A student says: "Once water evaporates, it disappears completely and is never seen again. Also, the four stages of the water cycle only happen one time, in one place, and then the whole process stops." What is wrong with each part of that?',
      commonErrors: [
        {
          answer: 'Once water evaporates, it disappears completely and is never seen again.',
          misconception:
            'Treating evaporation as water vanishing out of existence, because water vapor is invisible and the liquid is no longer where it used to be.',
          correctsTo:
            'Water does not disappear when it evaporates. It changes from a liquid into an invisible gas called water vapor, and that vapor stays part of the water cycle. It later cools into condensation, falls as precipitation, and gathers again in collection: the same water, still here, just changing form and location.',
        },
        {
          answer: 'The four stages only happen one time, in one place, and then stop.',
          misconception:
            'Thinking of the water cycle as a single trip with a finish line, rather than a repeating loop, because a story about a pond dropping and rain falling can sound like a one-time event.',
          correctsTo:
            'The water cycle repeats without stopping, and it runs in countless places on Earth at the same time. Water that collects in an ocean or a lake can evaporate again, and the same four stages, evaporation, condensation, precipitation, and collection, run again and again, with no starting point and no ending point.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The water cycle has four stages that always happen in the same order: evaporation, condensation, precipitation, and collection.',
        'Evaporation is energy from the sun warming liquid water in an ocean, lake, or river until it changes into invisible water vapor that rises into the air.',
        'Condensation is rising water vapor cooling and changing back into tiny liquid droplets, which cluster together to form a cloud.',
        'Precipitation is droplets inside a cloud growing too heavy for the air to hold up, so they fall to Earth\'s surface as rain, snow, sleet, or hail.',
        'Collection is fallen water gathering into oceans, lakes, rivers, and other bodies of water, ready to be warmed by the sun and evaporate again.',
        'The four stages form a loop with no starting point and no ending point: collection leads right back into evaporation, and the cycle runs again.',
        'Water never disappears during the water cycle. It only changes form and location as it moves through the four stages.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'The Water Cycle' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
