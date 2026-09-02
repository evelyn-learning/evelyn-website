/**
 * Grade 6 Science (Earth & Space Science) — How Ocean Currents Move Heat
 * Around the Globe.
 *
 * CONCEPT-LED row for the m6sci fan-out (NGSS MS-ESS2-6), Unit 8 Topic 3. The
 * lesson traces one repeatable idea: a surface current is a wide, slow-moving
 * river of ocean water that follows a fixed, repeating path, and whether it
 * counts as a WARM current or a COLD current depends on where it started
 * compared with the water it is currently flowing through -- not on a fixed
 * temperature. A current carries that comparison along its whole path, and
 * the ocean water sitting next to a coastline is part of that coastline's
 * climate, so a current can push a coastline's climate warmer or cooler than
 * its latitude alone would predict. The two named currents this row traces
 * are the Gulf Stream / North Atlantic Current (warm, warms northwestern
 * Europe) and the Labrador Current (cold, cools Newfoundland and Labrador).
 * The two traps it is built to kill are (a) assuming a current changes only
 * the ocean's temperature and never the climate people experience on land,
 * and (b) treating "warm" and "cold" as fixed labels rather than a
 * comparison that depends on where the water started.
 *
 * SCOPE GUARD: this plan traces a named current's ORIGIN and DIRECTION and
 * the resulting PATTERN OF MOTION that carries warm or cold water along a
 * coastline, and states the outcome for that coastline's climate at the
 * Earth-system level only -- "the warm water keeps the nearby air milder
 * than the latitude alone would predict," "the cold water keeps the nearby
 * air cooler than the latitude alone would predict" -- exactly the way row
 * 4.2's mantle-convection plan names the outcome of a pattern of motion
 * without teaching the mechanism behind it. Energy appears only as the
 * thing a current is carrying (warm or cold water), never as a quantity, a
 * law, or a step-by-step transfer process. The specific sentence that
 * follows naturally from "the warm current makes the coastal air milder"
 * and is deliberately NOT written anywhere in this file is: "The warm water
 * heats the coastal air because heat energy conducts from the warmer water
 * into the cooler air." Conduction, convection and radiation as the three
 * modes of heat transfer, any particle-level account of why warmer water
 * raises air temperature, and the word "heat" used as anything other than
 * the plain-English "the current carries warm or cold water" appear nowhere
 * in this file -- that mechanism is Grade 8 physical science.
 *   - WHAT DRIVES A CURRENT is out of scope by this row's own curriculum
 *     line. Wind patterns and Earth's rotation, which are what actually set
 *     a surface current's path, are never explained anywhere in this file.
 *     A current's direction and starting point are given as an observed fact
 *     to trace forward from, never derived from a cause.
 *   - GRADE 6 NEIGHBOR: row 8.2 (what determines a region's climate) owns
 *     latitude, elevation and distance from a large body of water as the
 *     GENERAL factors that set a region's climate; this row owns the
 *     ADDITIONAL, current-specific effect layered on top of those factors.
 *     Both worked examples in this file say so explicitly: take the current
 *     away, and a coastline's climate falls back to whatever its latitude,
 *     elevation and distance from the ocean would predict on their own --
 *     that is the line this row draws against 8.2, and it is stated, not
 *     just implied. Row 8.1 (weather versus climate) is touched only to
 *     distinguish a current's effect, which is a persistent climate pattern,
 *     from a single day's weather; row 8.4 (reading climate graphs) is not
 *     taught here.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: covered above -- the heat-transfer
 *     mechanism and the physics driving a current's flow are both named as
 *     excluded, and neither appears anywhere in this file.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every current,
 * coastline and comparison in this file is written out in words, and every
 * item is solvable from the text printed inside it. Never write "see the map
 * above", and never assume the student has a globe or an atlas open.
 *
 * NOTE ON ARITHMETIC: this row states a current's speed in one unit and asks
 * for it in another, which is the same shape of unit-conversion step flagged
 * elsewhere in this wave as the exact place a factor gets lost. The first
 * worked example writes both conversion steps out in full for that reason.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U8_HOW_OCEAN_CURRENTS_MOVE_HEAT_AROUND_THE_GLOBE: LessonPlan = {
  id: 'evelyn.ms.m6sci.how-ocean-currents-move-heat-around-the-globe.v1',
  title: 'How Ocean Currents Move Heat Around the Globe',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.how-ocean-currents-move-heat-around-the-globe',
      standard: 'M6SCI-8.3',
      description:
        "Trace how a named warm or cold ocean current changes the climate of the coastline it passes, using the current's surface direction and place of origin rather than the physics of what drives the current (NGSS MS-ESS2-6).",
    },
  ],
  prerequisites: ['m6sci.what-determines-a-regions-climate'],
  followUps: ['m6sci.reading-climate-graphs'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the lesson in a same-latitude, different-ocean-temperature surprise the student can imagine directly.',
      script:
        'Picture two beach trips, both in July. One family wades into the Pacific Ocean near San Diego, in Southern California, expecting water like a warm pool -- and gasps, because the water is shockingly cold. Another family, at almost the exact same time of year, wades into the ocean off the coast of South Carolina and finds water that feels almost like a warm bath. Here is the surprising part: San Diego and Charleston, South Carolina sit at almost exactly the same latitude. Same season, same distance from the equator, two completely different oceans. Latitude alone cannot explain that gap. Something else is happening offshore in each case -- and that same something else is why winters in parts of Europe are far milder than you would expect for how far north they sit, and why one stretch of the Canadian coast is famous for fog and drifting icebergs even though it sits at roughly the same latitude as mild, green England. That something is a system of currents that carry enormous, slow-moving rivers of warm and cold water around the globe. Today you learn to trace them.',
      suggestedTools: ['show_map'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-tracing-a-current',
      kind: 'concept',
      goal: "Build the origin-direction-effect picture for a surface current, and stop exactly at the coastline's climate outcome, not the mechanism behind it.",
      keyIdeas: [
        'A SURFACE CURRENT IS A RIVER WITHIN THE OCEAN, ON A FIXED PATH. Wide bands of ocean water move along the same repeating routes year after year, the way a river follows the same channel. Some of these surface currents start near the tropics, close to the equator. Others start near the poles, in cold Arctic or Antarctic waters. This lesson takes a current\'s starting point and direction as a given fact to trace forward from -- what sets that exact path in the first place is a topic for a later grade.',
        'WARM AND COLD ARE A COMPARISON, NOT A FIXED TEMPERATURE. A current is called a WARM CURRENT if its water is warmer than the ocean water it is currently flowing through, and a COLD CURRENT if its water is colder than the ocean water around it. This is a comparison at that spot, not a fixed number. A current can keep the label "warm" even far from the tropics, as long as it is still warmer than its surroundings there -- even if, by that point, the water itself would feel too cold to swim in comfortably.',
        'A CURRENT CARRIES ITS STARTING TEMPERATURE ALONG ITS WHOLE PATH. A current that starts near the tropics carries relatively warm water toward higher latitudes, and stays a warm current for as long as it stays warmer than what surrounds it. A current that starts near the poles carries relatively cold water toward lower latitudes, and stays a cold current the same way. Tracing a current is tracing that comparison along the current\'s route, from where it starts to wherever it is being described.',
        'THE OCEAN NEXT TO A COASTLINE IS PART OF THAT COASTLINE\'S CLIMATE. Warmer offshore water keeps the nearby air milder than the coastline\'s latitude alone would predict. Colder offshore water keeps the nearby air cooler than the coastline\'s latitude alone would predict. A current is what is moving the warmth or the cold from where it started to that stretch of coast; exactly how the warmth passes from the water into the air above it is not covered here -- that mechanism belongs to a later grade.',
        'TWO NAMED EXAMPLES. The Gulf Stream starts in warm water near the Gulf of Mexico and the Straits of Florida, flows north along the United States coast, then bends east across the North Atlantic Ocean as the North Atlantic Current, reaching the coast of northwestern Europe. That warm current is a major reason winters in places like the United Kingdom and Norway are far milder than most places at the same latitude. The Labrador Current starts in cold water near the Arctic and Baffin Bay and flows south along the coast of Newfoundland and Labrador, in eastern Canada -- keeping that stretch of coast colder and foggier than its latitude alone would suggest, even though it sits at roughly the same latitude as the mild United Kingdom coast.',
        'A CURRENT\'S EFFECT STACKS ON TOP OF LATITUDE, ELEVATION AND DISTANCE FROM WATER. The previous lesson covered the GENERAL factors that set a region\'s typical climate. A current does not replace those factors -- it adds an extra push on top of them, warmer or cooler, depending on which kind of current, if any, runs along that coastline. That is exactly why two coastlines at nearly the same latitude, like San Diego and Charleston, or Newfoundland and the United Kingdom, can end up with such different climates.',
      ],
      vocabulary: [
        { term: 'surface current', definition: 'a stream of ocean water at or near the surface that flows along a fairly fixed, repeating path.' },
        { term: 'warm current', definition: 'a surface current carrying water that is warmer than the ocean water it is currently flowing through.' },
        { term: 'cold current', definition: 'a surface current carrying water that is colder than the ocean water it is currently flowing through.' },
        { term: 'moderate', definition: 'to make a place\'s temperature extremes less severe -- for example, milder winters, cooler summers, or both.' },
      ],
      suggestedTools: ['show_map', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-gulf-stream-to-europe',
      kind: 'worked_example',
      problem:
        'The Gulf Stream starts in warm water near the Gulf of Mexico and the Straits of Florida, flows north along the United States East Coast, then bends east across the North Atlantic Ocean toward the coast of northwestern Europe. In the Straits of Florida, instruments show the current moving at about 2 meters every second. Trace what this current does to the climate of northwestern Europe, and work out about how many kilometers per hour that is.',
      steps: [
        'Start with the origin. The Gulf Stream begins in warm tropical and subtropical water near the Gulf of Mexico and the Straits of Florida.',
        'Now the direction. It flows north along the U.S. coast, then bends east across the Atlantic, carrying that warm water toward the higher-latitude coast of northwestern Europe.',
        'Because it stays warmer than the ocean water it passes through, even once it reaches the colder North Atlantic, it counts as a warm current the whole way.',
        'Apply the coastline rule from the concept segment. The water sitting next to northwestern Europe is warmer than the latitude alone would predict, so the nearby air stays milder than it otherwise would -- this is a major reason winters in the United Kingdom and Norway are far milder than most other places at the same latitude.',
        'This traces WHAT the current carries and WHERE it takes it -- not how the warmth passes from the water into the air once it arrives there. That step is left for a later grade.',
        'Now the speed. Write the rate as given: 2 meters per second. Multiply by the number of seconds in a minute: 2 meters/second x 60 seconds/minute = 120 meters/minute.',
        'Multiply by the number of minutes in an hour: 120 meters/minute x 60 minutes/hour = 7,200 meters/hour.',
        'Convert meters to kilometers by dividing by 1,000, since there are 1,000 meters in a kilometer: 7,200 meters / 1,000 = 7.2 kilometers per hour.',
        'Now run the two checks a science answer needs, since there is no shadow diagram to redraw and no equation to invert. First, three clues of DIFFERENT KINDS that agree. An origin clue: the water started in the warm tropics, so it is warmer than the cold North Atlantic it now flows through. A real-world comparison clue: places along this current\'s path, like the United Kingdom and coastal Norway, are known for winters far milder than other places at their latitude -- for example, milder than most of Canada at a similar distance from the equator. A consistency clue: the current follows the same route every year, so this is a steady, repeating effect, not a one-time event. Three different kinds of evidence, one answer.',
        'Second, change one thing and check that the answer moves with it. Suppose that after reaching the U.S. East Coast, the current curved south back toward the Caribbean instead of bending east toward Europe. Then no warm current would reach the coast of northwestern Europe, and that coastline\'s winter climate would fall back to whatever its latitude, elevation and distance from the ocean predict on their own -- colder than it actually is today. The answer moves when the current\'s path moves, which is what makes this an explanation and not just a fact stated twice.',
      ],
      answer:
        'The Gulf Stream carries warm water from the Gulf of Mexico north and then east to northwestern Europe, keeping that coastline\'s winters far milder than its latitude alone would predict. In the Straits of Florida the current moves at about 2 meters per second, which works out to about 7.2 kilometers per hour (2 m/s x 60 s/min = 120 m/min; 120 m/min x 60 min/hr = 7,200 m/hr; 7,200 m/hr / 1,000 = 7.2 km/hr).',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-labrador-current-contrast',
      kind: 'worked_example',
      problem:
        'Not far from where the Gulf Stream reaches the North Atlantic, the Labrador Current starts in cold water near the Arctic and Baffin Bay and flows south along the coast of Newfoundland and Labrador, in eastern Canada. A student claims: "Newfoundland is not much farther north than the United Kingdom, so its winter coastal climate should be about as mild." Evaluate that claim using the current\'s origin and direction.',
      steps: [
        'Start with the origin. The Labrador Current begins in cold water near the Arctic and Baffin Bay -- the opposite kind of starting point from the Gulf Stream.',
        'Now the direction. It flows south, carrying that cold water toward lower latitudes, past the coast of Newfoundland and Labrador.',
        'Because it stays colder than the ocean water it passes through, it counts as a cold current the whole way, just as the Gulf Stream stays a warm current the whole way.',
        'Apply the coastline rule. The water next to Newfoundland and Labrador is colder than the latitude alone would predict, so the nearby air stays cooler than it otherwise would. Where this cold current runs close to the warm Gulf Stream and North Atlantic Current near the Grand Banks, moist air passing over the warm water is cooled sharply as it crosses into the cold water, and its water vapor condenses -- which is a large part of why that stretch of coast is famous for thick fog.',
        'So the student\'s claim does not hold up. WRONG: "Places at similar latitudes always have similar climates." CORRECT: "Places at similar latitudes can have very different climates, depending on which kind of current, if any, runs along their coastlines."',
        'Newfoundland sits along a cold current\'s path, while the United Kingdom sits along a warm current\'s path -- that difference, not latitude, is why one coast is famous for mild winters and the other for cold, foggy ones.',
        'Now run the two checks a science answer needs. First, three clues of different kinds that agree. An origin clue: the Labrador Current\'s water starts near the Arctic, colder than the water it flows through farther south. A real-world clue: the Labrador coast is known for cold conditions, fog, and icebergs carried south by this same current, unlike the United Kingdom. A directional clue: the current runs south along that coast the same way every year, so the cooling effect is steady, not occasional.',
        'Second, change one thing and check the answer moves. If the Labrador Current instead started in warmer mid-Atlantic water and flowed north, it would count as a warm current, and Newfoundland\'s coast would gain a warming push similar to the one the United Kingdom actually gets -- moving its winter climate closer to the United Kingdom\'s instead of farther from it.',
      ],
      answer:
        'The claim is wrong. The United Kingdom sits along the path of the warm Gulf Stream and North Atlantic Current, which pushes its winter climate milder than its latitude predicts. Newfoundland and Labrador sit along the path of the cold Labrador Current instead, which pushes their winter climate cooler and foggier than their similar latitude would otherwise suggest. Similar latitude, very different current, very different climate.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-warm-current-effect',
      kind: 'try_yourself',
      problem:
        'A surface current starts in warm tropical water near the equator and flows toward higher latitudes, carrying that warm water along a coastline. What effect would this current most likely have on the coastline\'s climate?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'It would have no effect on the coastline\'s climate, because a current only changes the temperature of the ocean water itself, never the air or the land nearby.',
        },
        {
          id: 'b',
          text: 'It would cool the coastline, because any large body of moving water pulls warmth away from the land beside it no matter which direction the water is coming from.',
        },
        {
          id: 'c',
          text: 'It would change the coastline\'s day-to-day weather for a while as the current arrives, but its long-term climate pattern would stay exactly the same as before.',
        },
        {
          id: 'd',
          text: 'It would make the coastline\'s climate milder than its latitude alone would predict, because the warm offshore water keeps the nearby air warmer than it would otherwise be.',
          correct: true,
        },
      ],
      expectedAnswer:
        'It would make the coastline\'s climate milder than its latitude alone would predict, because the warm offshore water keeps the nearby air warmer than it would otherwise be.',
      hints: [
        'Start with the water right next to the coastline. Does a coastline\'s climate depend only on its latitude, or does the ocean touching it matter too?',
        'This current carries warm water, and it does not just pass by once -- it flows along that coastline the same way, year after year. What does "warmer water sitting offshore, every year" do to a coastline\'s usual climate, as opposed to its weather on any one day?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-classifying-a-cold-current',
      kind: 'try_yourself',
      problem:
        'The Labrador Current starts in cold water near the Arctic and Baffin Bay, then flows south along the coast of Newfoundland and Labrador, carrying that cold water toward lower latitudes. Which statement correctly classifies this current, and why?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'A cold current, because it carries water that stays colder than the ocean water it flows past as it moves toward lower latitudes.',
          correct: true,
        },
        {
          id: 'b',
          text: 'A warm current, because water near the Arctic is naturally the warmest water in the entire ocean before it has a chance to cool on its way south.',
        },
        {
          id: 'c',
          text: 'Neither warm nor cold, because a current can only be classified that way if its path touches the equator at some point.',
        },
        {
          id: 'd',
          text: 'A cold current only in winter, because summer sunlight warms the water enough for it to count as a warm current for part of the year.',
        },
      ],
      expectedAnswer:
        'A cold current, because it carries water that stays colder than the ocean water it flows past as it moves toward lower latitudes.',
      hints: [
        'A current\'s warm-or-cold label comes from comparing its water to the ocean around it at that latitude -- it is not about whether the water would feel warm or cold if you touched it.',
        'Follow this current\'s water back to where it started. Is water near the Arctic warmer or colder than the ocean it will pass through farther south, and does that comparison have any reason to flip with the seasons?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-reversed-current',
      kind: 'try_yourself',
      problem:
        'Suppose a current that normally starts in the tropics and flows toward a mid-latitude coastline suddenly reversed, so that it now starts near the poles and flows toward that same coastline instead. Based on how a current\'s starting point sets whether it counts as warm or cold, what would most likely happen to that coastline\'s climate?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Nothing would change, because a coastline\'s climate depends only on its latitude, and a current running past it does not add anything on top of that.',
        },
        {
          id: 'b',
          text: 'The current would now count as a cold current instead of a warm one, and the coastline\'s climate would likely turn cooler than it was before, not milder.',
          correct: true,
        },
        {
          id: 'c',
          text: 'The coastline would keep the same warm-current effect as before, because a current\'s warm-or-cold label depends on where it is right now, not on where its water started out.',
        },
        {
          id: 'd',
          text: 'The coastline\'s ocean water would change temperature, but the coastline\'s air and overall climate would stay exactly the same, since the ocean and the atmosphere do not affect each other.',
        },
      ],
      expectedAnswer:
        'The current would now count as a cold current instead of a warm one, and the coastline\'s climate would likely turn cooler than it was before, not milder.',
      hints: [
        'Go back to how a current earns the label warm or cold in the first place -- is that label about where the water started out, or about where the current happens to be sitting right now?',
        'Once you have decided the current\'s new label, use the coastline rule from earlier in this lesson: what does a current with that label do to the climate of the coastline it passes, compared with what the latitude alone would predict?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-water-only-and-fixed-label',
      kind: 'misconception_check',
      question:
        'A student says: "Ocean currents are interesting, but they only change the temperature of the water -- they do not really change the climate people experience on land. And a warm current is warm no matter where it travels." Two separate things are wrong in that statement. What are they?',
      commonErrors: [
        {
          answer: 'Currents only change the temperature of the water, not the climate people experience on land.',
          misconception:
            'Treating the ocean and the coastal atmosphere as two separate systems that do not affect each other, since the current itself is never seen or felt directly by someone standing on shore.',
          correctsTo:
            'The ocean water next to a coastline is part of that coastline\'s climate. When a current makes the nearby water warmer or colder than the coastline\'s latitude alone would predict, the air above that water is pushed warmer or cooler along with it, and that is what people on the coast actually experience. This is why coastal Norway and the United Kingdom, sitting along the warm Gulf Stream and North Atlantic Current, have far milder winters than most places at their latitude.',
        },
        {
          answer: 'A warm current is warm no matter where it travels.',
          misconception:
            'Treating "warm" as a fixed, permanent label attached to a current, rather than a comparison to the water it is currently flowing through.',
          correctsTo:
            'A current is classified warm or cold by comparing its water to the surrounding ocean at that latitude, not by a fixed temperature. A current carrying water that started near the tropics is still called a warm current far from the tropics, as long as it stays warmer than the colder water around it there -- even though, by that point, the water itself might feel far too cold to swim in comfortably.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A surface current is a wide band of ocean water that follows a fixed, repeating path -- some starting near the tropics, some starting near the poles.',
        'Warm and cold are a COMPARISON: a current is warm if it is warmer than the ocean water it is currently flowing through, and cold if it is colder, not by any fixed temperature.',
        'A current carries its starting temperature along its whole path, and keeps its warm or cold label as long as that comparison still holds true.',
        'The ocean water next to a coastline is part of that coastline\'s climate: warmer offshore water keeps nearby air milder than latitude alone would predict, and colder offshore water keeps it cooler.',
        'The warm Gulf Stream and North Atlantic Current keep northwestern Europe\'s winters far milder than most places at the same latitude.',
        'The cold Labrador Current keeps the coast of Newfoundland and Labrador colder and foggier than the United Kingdom, even at a similar latitude.',
        'A current\'s effect stacks on top of latitude, elevation and distance from water -- it does not replace those general factors, it adds to them.',
        'This lesson traces what a current carries and where it takes it -- not what makes the current move in the first place, which is a topic for a later grade.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: {
    cedUnit: '8',
    cedTopic: '8.3',
    cedTitle: 'How Ocean Currents Move Heat Around the Globe',
  },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
