/**
 * Grade 6 Science (Earth & Space Science) — Weather & the Atmosphere: How
 * Air-Mass Interactions Produce Severe Weather.
 *
 * CONCEPT-LED row in the m6sci fan-out (NGSS MS-ESS2-5). Neither exemplar
 * list at the top of the fan-out contract names this row explicitly, so this
 * file is shaped after the CONCEPT-LED exemplar (`m6sci-u2-phases-of-the-moon.ts`):
 * the lesson builds one picture -- which specific combination of conditions
 * (a strong lifting mechanism, warm moist air, and sometimes wind shear or
 * warm ocean water) produces which severe outcome -- rather than running one
 * fixed routine over a given diagram, and both worked examples run in
 * opposite directions (conditions to outcome, and outcome back to the
 * conditions that had to be present) the way the concept-led exemplar's two
 * worked examples do for moon phases.
 *
 * The two traps it is built to kill are (a) treating "front" and "storm" as
 * the same thing, so that any front is assumed to bring severe weather, and
 * (b) assuming a hurricane forms the same way a thunderstorm or tornado does
 * -- from two contrasting air masses colliding -- when a hurricane in fact
 * grows inside a single warm, moist air mass over warm ocean water, with no
 * front involved at all.
 *
 * SCOPE GUARD: this plan explains thunderstorms, tornadoes, and hurricanes as
 * the outcome of specific air-mass conditions, and stops at the phenomenon --
 * it never forecasts a real event or recommends a preparedness or mitigation
 * action. Because several close boundaries sit right next to this row, the
 * guard states what is deliberately EXCLUDED and, where useful, what is
 * deliberately ALLOWED at that edge, and why:
 *   - ROW 6.1 (layers and composition of the atmosphere) owns atmospheric
 *     composition and the troposphere/stratosphere/mesosphere/thermosphere
 *     structure. Neither appears anywhere in this file.
 *   - ROW 6.2 (air masses and fronts) owns air-mass source regions, general
 *     front classification, and the cold-front/warm-front weather pattern as
 *     a topic in its own right. This file assumes an air mass and a cold
 *     front are already-familiar ideas and uses a cold front only as one of
 *     several conditions that can trigger a thunderstorm; it does not
 *     re-teach source regions, how latitude and surface type set an air
 *     mass's temperature and moisture, or the warm front's slow, wide
 *     precipitation pattern, none of which this row needs. Consistent with
 *     that row's own shipped text, this file also never claims a warm front
 *     produces severe weather -- only a cold front's fast lift is named as a
 *     thunderstorm trigger, which is what that row's own worked example
 *     shows too.
 *   - ROW 6.3 (reading weather maps) owns map symbols, pressure centers, and
 *     predicting current conditions by reading a drawn map. No map, symbol,
 *     or map-reading routine appears anywhere in this file; every condition
 *     in every item is written out in words.
 *   - ROW 9.4 (forecasting and preparing for weather hazards) owns
 *     preparedness and mitigation action for a real storm. No safety
 *     instruction, evacuation guidance, shelter advice, or forecast
 *     probability for any specific event appears anywhere in this file --
 *     this plan only explains the conditions that produce each phenomenon.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: this file states THAT a cold
 *     front's incoming cold air forces warm, moist air upward quickly, THAT
 *     wind shear can tilt a spinning tube of air upright inside a storm, and
 *     THAT warm ocean water and low wind shear let clusters of thunderstorms
 *     organize into a hurricane. It does not explain WHY. No density
 *     comparison between cold and warm air appears anywhere in this file, no
 *     water vapor is ever said to condense or release energy, and no
 *     particle-level account of why warm air rises is given -- consistent
 *     with row 6.2's own boundary, which states the same cold-front lifting
 *     fact without a density explanation for the same reason. A hurricane's
 *     rotation and a tornado's rotation are described only as an observed
 *     structure and behavior, never explained by the Coriolis effect or by
 *     any force calculation, both of which are Grade 8.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *   - Exact storm statistics (wind-speed thresholds, intensity-category
 *     names, an ocean-temperature threshold, a specific storm's name or
 *     date) never appear. Every comparison of scale or duration in this
 *     file is qualitative ("hundreds of kilometers", "less than a
 *     kilometer", "minutes", "days"), not an invented precise figure.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every
 * condition, wind report, and storm structure in this file is written out in
 * words, and every item is solvable from the text printed inside it. Never
 * write "see the weather map above", and never assume the student can see a
 * front symbol, a radar image, or a satellite picture.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is
 * 6.3 (reading-weather-maps) -> 6.4 (this row) -> 7.1
 * (earths-four-spheres-interacting), per the fan-out contract's chain table
 * and this row's lesson brief. Both are populated below with the real
 * previous-row and next-row loIds rather than left empty, because all 40
 * rows in this batch are registered together and both neighbors will exist
 * by then.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U6_HOW_AIR_MASS_INTERACTIONS_PRODUCE_SEVERE_WEATHER: LessonPlan = {
  id: 'evelyn.ms.m6sci.how-air-mass-interactions-produce-severe-weather.v1',
  title: 'How Air-Mass Interactions Produce Severe Weather',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.how-air-mass-interactions-produce-severe-weather',
      standard: 'M6SCI-6.4',
      description:
        'Explain thunderstorms, tornadoes, and hurricanes as the product of specific air-mass interactions and conditions, describing the phenomenon rather than forecasting or mitigation strategy (preparedness and mitigation are Unit 9) (NGSS MS-ESS2-5).',
    },
  ],
  prerequisites: ['m6sci.reading-weather-maps'],
  followUps: ['m6sci.earths-four-spheres-interacting'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up the puzzle that two rotating storms -- a tornado and a hurricane -- are not two sizes of the same thing, and get the student curious about what actually separates them.',
      script:
        'You have probably heard both words used almost like they mean the same kind of trouble: tornado, hurricane. Both of them spin. Both of them show up on the news with warnings attached. It would be easy to guess that a hurricane is just a tornado that got bigger, or that a tornado is a hurricane that got smaller. Here is the strange part. A tornado is usually on the ground for only a few minutes, and a hurricane can last for days. A tornado\'s path is often narrower than a neighborhood, and a hurricane can be wider than a whole state. If they were really the same storm at different sizes, you would expect them to at least form the same way. They do not. Today you find out what specific conditions in the air actually produce a thunderstorm, what turns a thunderstorm into a tornado, and what produces a hurricane instead -- and why a hurricane is not built the way the other two are.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-conditions-and-outcomes',
      kind: 'concept',
      goal: 'Build the specific set of conditions behind each of the three outcomes, and separate the two that need a front from the one that does not.',
      keyIdeas: [
        'ORDINARY WEATHER TURNS SEVERE WHEN THE CONDITIONS STACK UP. Most days, a little bit of air rises, forms a small cloud, and that is the end of it. Weather turns severe when several conditions line up together: a strong push that lifts warm, moist air quickly, plenty of that warm, moist air to work with, and sometimes an additional condition in the wind itself. This lesson looks at exactly which combination of conditions produces a thunderstorm, which additional condition turns a thunderstorm into a tornado, and what different combination of conditions produces a hurricane.',
        'A THUNDERSTORM FORMS WHERE WARM, MOIST AIR IS LIFTED QUICKLY. Along a cold front, the incoming cold air moves in low and forces the warm, moist air ahead of it upward quickly. (This lesson states that the lifting happens, not why the cold air stays low while the warm air is pushed up -- that is a density and phase-change explanation that belongs to Grade 8 physical science.) Strong afternoon heating over land can lift warm, humid air on its own, with no front involved at all. Either way, once warm, moist air is forced upward quickly, it builds into towering clouds that can produce heavy rain, lightning, thunder, and gusty wind, often within an hour or two -- a thunderstorm.',
        'SOME THUNDERSTORMS DEVELOP A ROTATING UPDRAFT, AND THAT IS WHERE A TORNADO COMES FROM. When the wind blowing near the ground is noticeably different in speed or direction from the wind blowing higher up -- a difference called WIND SHEAR -- it can set up a spinning, roughly horizontal tube of air close to the ground. Inside a strong, long-lived, rotating thunderstorm called a SUPERCELL, the storm\'s powerful updraft can catch that spinning tube and tilt it upright. A TORNADO is a rapidly rotating column of air that reaches from the base of the storm cloud down to the ground. Not every thunderstorm has the wind shear needed for this, which is why most thunderstorms never produce a tornado.',
        'A HURRICANE GROWS WITHIN A SINGLE WARM, MOIST AIR MASS OVER THE OCEAN -- NOT FROM TWO AIR MASSES COLLIDING. Far from any front, over warm tropical ocean water, the ocean surface keeps adding moisture to the air above it. Where the wind at different heights is not blowing too differently from itself -- low wind shear -- clusters of thunderstorms over the ocean can organize instead of being pulled apart, growing over several days into one large, spinning storm system. At its center sits a calm, mostly cloud-free EYE, ringed by the EYEWALL, the band of thunderstorms that holds the storm\'s strongest winds and heaviest rain.',
        'SCALE AND DURATION SEPARATE THESE THREE, EVEN THOUGH TWO OF THEM SPIN. A tornado\'s path is narrow and it is on the ground for minutes. A single thunderstorm covers a town or two and lasts an hour or two. A hurricane spans hundreds of kilometers and can last for days. A hurricane weakens once it moves over land or over much cooler water, because it loses the steady supply of moisture from warm ocean water that was keeping its thunderstorms organized.',
        'FRONTS MATTER FOR TWO OF THESE AND NOT FOR THE THIRD. Thunderstorms, and the tornadoes that can form inside them, are typically tied to air masses meeting along a front. Hurricanes form the other way: inside one warm, moist tropical air mass, with no front involved at all. Knowing which severe weather you are looking at tells you which kind of condition to look for behind it -- a front and wind shear for the first two, or warm ocean water and low wind shear for the third.',
      ],
      vocabulary: [
        { term: 'severe weather', definition: 'weather strong enough to be hazardous, including thunderstorms with damaging wind or hail, tornadoes, and hurricanes.' },
        { term: 'wind shear', definition: 'a change in wind speed or wind direction between one height in the atmosphere and another.' },
        { term: 'supercell', definition: 'a strong, long-lived thunderstorm with a rotating updraft, and the kind of thunderstorm most likely to produce a tornado.' },
        { term: 'tornado', definition: 'a rapidly rotating column of air that extends from the base of a thunderstorm cloud down to the ground.' },
        { term: 'hurricane', definition: 'a large, organized, rotating storm system that forms over warm tropical ocean water and can span hundreds of kilometers and last for days.' },
        { term: 'eyewall', definition: 'the ring of thunderstorms surrounding a hurricane\'s calm center, holding the storm\'s strongest winds and heaviest rain.' },
      ],
      suggestedTools: ['show_diagram', 'show_flowchart'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-conditions-to-outcome',
      kind: 'worked_example',
      problem:
        'A humid, unusually warm air mass has been sitting over a region for two days. This afternoon, a cold front arrives from the west, and the incoming cold air moves in low and forces the warm, humid air upward quickly. A weather balloon shows the wind blowing gently from the south near the ground, but blowing much faster from the northwest at a height of several kilometers. What severe weather is most likely to develop this afternoon, and why?',
      steps: [
        'Start with the lifting mechanism. The cold front is forcing the warm, humid air upward quickly -- exactly the setup that turns ordinary humid air into a thunderstorm.',
        'Check the moisture and warmth on hand. The air mass has been warm and humid for two days, so there is plenty of moisture available to build tall storm clouds once it is lifted.',
        'Now look at the wind report at two different heights. Near the ground the wind is gentle and from the south. Higher up it is much faster and from the northwest. That is a clear change in both wind speed and wind direction with height -- wind shear.',
        'Wind shear like this can set up a spinning, roughly horizontal tube of air near the ground. Inside a strong thunderstorm, the storm\'s own updraft can tilt that spinning tube upright, which is how a tornado starts.',
        'Put the three findings together: strong lift from the front, plenty of warm moisture, and real wind shear. All three point past an ordinary thunderstorm toward a supercell -- a severe thunderstorm capable of producing a tornado.',
        'WRONG: "A cold front always produces a tornado." CORRECT: "A cold front lifting warm, moist air can produce a thunderstorm on its own; a tornado additionally needs enough wind shear to start the storm rotating, and that has to be checked separately."',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree: the mechanical lift from the front, the stored-up warmth and moisture, and the wind-speed-and-direction report are three different kinds of evidence, and all three point the same way. Second, change one thing and check that the answer moves: if the wind at both heights had been blowing from the same direction at a similar speed, there would be no wind shear, and the same warm, moist air and the same front would likely still produce a thunderstorm -- just without the added tornado risk.',
      ],
      answer:
        'A severe thunderstorm is likely, with a real chance of it producing a tornado, because warm, moist air, a strong lifting mechanism from the front, and a marked change in wind speed and direction between the surface and higher altitude are all present together.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-observation-to-conditions',
      kind: 'worked_example',
      problem:
        'A large storm system sitting over tropical ocean water has lasted for four days. It is hundreds of kilometers across. Near its center is a calm, mostly cloud-free area, and just outside that calm area is a ring holding the storm\'s heaviest rain and strongest wind. What kind of severe weather is this, and what conditions had to be present for it to form?',
      steps: [
        'Compare the size and the time span first. A tornado\'s path is usually far narrower than a town and it is on the ground for minutes, and a single thunderstorm covers at most a town or two for an hour or two. A storm hundreds of kilometers across that has lasted four days is neither of those.',
        'Match the described structure to what is left. A calm, mostly cloud-free center is an EYE, and a surrounding ring holding the storm\'s strongest winds and heaviest rain is an EYEWALL -- the structure of a hurricane.',
        'Because this is a hurricane, look for hurricane conditions rather than front conditions. A hurricane does not need two contrasting air masses meeting along a front. It grows inside one warm, moist air mass over warm tropical ocean water.',
        'State what had to be present: warm ocean water constantly adding moisture to the air above it, and low wind shear, so that the many thunderstorms inside the system could organize into one large rotating system instead of being pulled apart.',
        'WRONG: "It must have formed the same way a thunderstorm does, from two air masses colliding." CORRECT: "It formed inside a single warm, moist air mass over warm ocean water, with no front involved at all."',
        'Run the two checks. First, three different kinds of clues agree: the storm\'s huge size, its four-day duration, and its eye-and-eyewall structure all point to a hurricane rather than a tornado or an ordinary thunderstorm. Second, change one thing and check that the answer moves: if this same storm moved over land or over much colder water, it would be cut off from the warm ocean moisture that was organizing it, and it would weaken rather than staying this large and this well organized.',
      ],
      answer:
        'This is a hurricane. It required warm tropical ocean water supplying continuous moisture and low wind shear allowing many thunderstorms to organize into one large rotating system with an eye and an eyewall -- conditions that do not involve two air masses meeting along a front.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-thunderstorm-lift',
      kind: 'try_yourself',
      problem:
        'A cold front is approaching a region where the air near the ground is warm and moist. What happens as the front arrives, and why does this tend to produce a thunderstorm?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The cold air and the warm air simply mix evenly together, the way two temperatures of water blend when stirred into one glass, and the mixture cools off gradually with no strong effect on the weather.' },
        { id: 'b', text: 'The warm air sinks below the incoming cold air and gets trapped near the ground, as if the newly arriving air always ends up on top, which holds the moisture in place until it slowly clears.' },
        { id: 'c', text: 'The cold air moves in low and forces the warm, moist air upward quickly, and the fast-rising moist air builds into towering clouds with heavy rain.', correct: true },
        { id: 'd', text: 'The front acts like a wall that simply blocks the warm air from moving forward, so the moisture has nowhere to go and evaporates into clear skies.' },
      ],
      expectedAnswer: 'The cold air moves in low and forces the warm, moist air upward quickly, and the fast-rising moist air builds into towering clouds with heavy rain.',
      hints: [
        'Think about which air mass ends up moving in low, underneath, and which one gets pushed upward -- the lesson describes this same pattern for a cold front.',
        'Once warm, moist air is pushed upward quickly, ask what tends to happen to moist air that rises fast, rather than assuming it just sits in place or disappears.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-wind-shear-tornado',
      kind: 'try_yourself',
      problem:
        'A severe thunderstorm is already producing heavy rain and a strong updraft. A weather balloon shows wind blowing gently from the south near the ground, and wind blowing much faster from the west at a height of several kilometers. What does this difference between the two heights suggest, and what could it produce?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The difference means the storm is running out of moisture, the way a fire dies down once its fuel is used up, which usually causes a thunderstorm to weaken and fade within the hour.' },
        { id: 'b', text: 'The difference means two separate storms at different heights are about to merge into a single, calmer, more spread-out storm.' },
        { id: 'c', text: 'The difference has no real effect on the storm, because wind direction and speed only matter for the air moving right along the ground.' },
        { id: 'd', text: 'The difference is wind shear, and inside a strong storm it can tilt a spinning, roughly horizontal tube of air into a vertical one, producing a tornado.', correct: true },
      ],
      expectedAnswer: 'The difference is wind shear, and inside a strong storm it can tilt a spinning, roughly horizontal tube of air into a vertical one, producing a tornado.',
      hints: [
        'Look at what actually differs between the two wind reports -- it is not the moisture and it is not the number of storms, it is the wind itself, at two different heights.',
        'A change in wind speed and direction with height has a specific name in this lesson, and that name is tied to what can happen to a spinning tube of air inside a storm.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-hurricane-vs-thunderstorm',
      kind: 'try_yourself',
      problem:
        'A student claims that hurricanes form the exact same way that severe thunderstorms and tornadoes do -- two air masses with very different temperatures collide, and the collision forces one of them to rise quickly. Is the student correct about hurricanes?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'No. A hurricane grows within a single warm, moist air mass over warm tropical ocean water, and it does not require two contrasting air masses meeting along a front.', correct: true },
        { id: 'b', text: 'Yes, the collision works the same way in both cases; a hurricane simply happens to form over warm ocean water instead of over land.' },
        { id: 'c', text: 'No, because a hurricane instead forms when a mass of cold, dry air sinks rapidly down over warm tropical water, the reverse of the rising, moisture-fed air that actually builds a storm.' },
        { id: 'd', text: 'Yes, but in a hurricane the two colliding air masses are both cold, unlike the warm and cold air masses that meet ahead of an ordinary thunderstorm, and the collision still forces one mass upward.' },
      ],
      expectedAnswer: 'No. A hurricane grows within a single warm, moist air mass over warm tropical ocean water, and it does not require two contrasting air masses meeting along a front.',
      hints: [
        'Ask where a hurricane forms and how many separate air masses sit over that location, rather than assuming every kind of severe weather needs two air masses meeting.',
        'A hurricane is built from rising, organized thunderstorms, so an answer built around sinking air, or around a second cold air mass, cannot be the reason it forms.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-front-and-scale',
      kind: 'misconception_check',
      question:
        'One student says: "The cold front is going to hit us this afternoon, and that is basically the same thing as a tornado hitting us." A second student says: "A tornado is just a small hurricane." What is wrong with each statement?',
      commonErrors: [
        {
          answer: 'The cold front is basically the same thing as a tornado hitting us.',
          misconception:
            'Treating the boundary between two air masses as if it were a storm itself, because a front is the thing people notice right before the weather changes.',
          correctsTo:
            'A front is not a storm. It is the boundary where two air masses of different temperature meet. A cold front lifts warm, moist air quickly as it passes, and that lifting can trigger a thunderstorm, and in some cases a tornado inside that thunderstorm -- but the front is the cause of the lifting, not the storm, and not every cold front produces one.',
        },
        {
          answer: 'A tornado is just a small hurricane.',
          misconception:
            'Assuming two kinds of rotating severe weather must form the same way just because they both spin, rather than checking the specific conditions behind each one.',
          correctsTo:
            'A tornado forms when wind shear inside a single severe thunderstorm tips a spinning tube of air upright, over a path usually far narrower than a town and for only minutes. A hurricane forms separately, over warm tropical ocean water within one warm, moist air mass, growing over days into a system hundreds of kilometers across. They are both rotating, but they form under different conditions and at very different scales -- a tornado is not a smaller version of a hurricane.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Weather turns severe when the right conditions stack up together -- a strong lifting mechanism, plenty of warm, moist air, and sometimes wind shear.',
        'A thunderstorm forms where warm, moist air is lifted quickly -- most often by a cold front moving in low and forcing it up, or by strong daytime heating over land.',
        'A front is a boundary between two air masses, not a storm itself; the lifting it causes is what can produce the storm.',
        'A tornado can form inside a severe thunderstorm (a supercell) when wind shear -- a change in wind speed or direction with height -- tilts a spinning, roughly horizontal tube of air into a vertical one.',
        'A hurricane forms within a single warm, moist tropical air mass over warm ocean water, with low wind shear letting many thunderstorms organize into one large system with a calm eye and an intense eyewall -- not from two air masses colliding along a front.',
        'Hurricanes are far larger and last far longer than tornadoes, and they weaken once they move over land or much cooler water and lose their supply of ocean moisture.',
        'A tornado is not a small hurricane. Each forms from a different, specific combination of conditions.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.4', cedTitle: 'How Air-Mass Interactions Produce Severe Weather' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
