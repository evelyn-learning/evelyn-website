/**
 * Grade 6 Science (Earth & Space Science) — Weather & the Atmosphere: Layers
 * & Composition of the Atmosphere.
 *
 * CONCEPT-LED fan-out row for m6sci (DCI ESS2.D, foundational to
 * MS-ESS2-5; no NGSS performance expectation names atmospheric layering
 * directly). The student builds one mental model -- Earth wrapped in a
 * single blanket of gas that scientists divide into four layers by altitude
 * and by which direction temperature trends as you climb through each one
 * -- and separately learns what that blanket is made of by volume. The two
 * traps this row is built to kill are (a) assuming the air we breathe is
 * mostly oxygen, when it is actually about 78 percent nitrogen and about 21
 * percent oxygen, and (b) assuming temperature simply keeps falling in a
 * straight line the whole way up, when the real pattern alternates: falls,
 * rises, falls, rises again across the four layers.
 *
 * SCOPE GUARD: this plan identifies the troposphere, stratosphere,
 * mesosphere and thermosphere by their approximate altitude ranges and
 * temperature trend, and states the atmosphere's major gas composition by
 * volume. It does not teach anything about air masses, fronts, weather
 * maps, or severe weather -- those are rows 6.2, 6.3 and 6.4 in this same
 * unit, and none of that content appears here. For WHY temperature rises or
 * falls between layers, this plan draws exactly the line the fan-out
 * contract's Content-scope table draws for this specific row: it names, as
 * one bare causal fact, that the stratosphere contains ozone which absorbs
 * incoming ultraviolet radiation from the sun, and that this absorption is
 * why temperature rises with altitude there -- and goes no further. It does
 * not explain how that absorption becomes heat, does not treat radiation as
 * a heat-transfer mode, and does not mention wavelength or the
 * electromagnetic spectrum. The mesosphere's and thermosphere's own
 * temperature reversals are NOT given this treatment: for those two layers
 * the plan states only the alternating pattern (falls, then rises) as an
 * observed fact, because no equivalent named-mechanism allowance exists for
 * them in the contract. GRADE 7 LIFE SCIENCE boundary: no life-science
 * content is in scope for this row, and none appears -- there is no mention
 * of the biosphere, living things, ecosystems, or any biological process.
 * GRADE 8 PHYSICAL SCIENCE boundary, beyond the ozone/ultraviolet naming
 * above: this plan never mentions particle motion, kinetic theory, radiation
 * as a heat-transfer mode, wavelength, or the electromagnetic spectrum.
 * GRAVITY appears a few times (the concept's opening key idea, the
 * "atmosphere" vocabulary definition, and the recap), and everywhere it
 * appears it is the same qualitative claim already established at row 1.3
 * -- gravity holds the atmosphere against Earth -- with no force law and no
 * calculation.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course, and no
 * apparatus either -- no lamp, no balloon, no jar, no thermometer the
 * student holds. Every altitude, range and comparison in this file is
 * written out in words and anchored to something the student can reason
 * about from the text alone (a commercial airplane's cruising altitude, the
 * International Space Station's orbit), never a physical demonstration.
 * Never write "see the diagram above" or assume the student has any kit.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U6_LAYERS_AND_COMPOSITION_OF_THE_ATMOSPHERE: LessonPlan = {
  id: 'evelyn.ms.m6sci.layers-and-composition-of-the-atmosphere.v1',
  title: 'Layers & Composition of the Atmosphere',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.layers-and-composition-of-the-atmosphere',
      standard: 'M6SCI-6.1',
      description:
        'Identify the troposphere, stratosphere, mesosphere, and thermosphere by their approximate altitude ranges and temperature trend, and state the atmosphere\'s major gas composition by volume (DCI ESS2.D, foundational to MS-ESS2-5; no NGSS performance expectation names atmospheric layering directly).',
    },
  ],
  prerequisites: ['m6sci.mass-extinctions-as-time-markers'],
  followUps: ['m6sci.air-masses-and-fronts'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use a strange, checkable fact the student has probably brushed against (airplane cruising cold, the ISS orbiting through "thin air") to set up the idea that the atmosphere is not one uniform blanket.',
      script:
        'Commercial airplanes cruise at around 10 to 12 kilometers above the ground, and right around there something strange is already happening to the air outside the plane. On the way up, the temperature has been falling the entire time, dropping to around minus 50 degrees Celsius or colder by that altitude -- and then, just a little higher, the falling stops and the temperature starts climbing again, even though there is no ground, no ocean, and no flame anywhere nearby to warm it. Farther out still, past where any airplane flies, the International Space Station circles Earth at around 400 kilometers up, moving through air so thin it barely counts as air at all. It is the same planet and the same single blanket of gas the whole way, but the trip from the ground to the space station crosses four very different layers, and temperature does not simply fall the higher you go. Today you build the picture of what those four layers are, in what order, and what the air is actually made of.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-layers-and-composition',
      kind: 'concept',
      goal: 'Name the four layers in order with their approximate altitude ranges and alternating temperature trend, and state the major gas composition of dry air by volume.',
      keyIdeas: [
        'GRAVITY HOLDS THE WHOLE BLANKET IN PLACE, AND IT IS LAYERED. Earth\'s atmosphere is a thin layer of gases held against the surface by gravity -- the same pull that keeps the Moon in its orbit, just acting on gas instead of rock. Scientists divide it into four layers, named troposphere, stratosphere, mesosphere and thermosphere, in that order from the ground outward. Each layer is identified by its approximate altitude range and by which direction temperature trends as you climb through it.',
        'TROPOSPHERE -- FROM THE GROUND TO ABOUT 12 KILOMETERS. This is the layer of weather, clouds, and the air people and animals breathe; it holds almost all of the atmosphere\'s water vapor. Through it, temperature falls steadily the higher you go. It is not exactly 12 kilometers everywhere -- it is thinner over the poles, at around 8 kilometers, and thicker over the equator, at around 16 kilometers, with 12 kilometers used as a typical value for the whole planet.',
        'STRATOSPHERE -- FROM ABOUT 12 TO ABOUT 50 KILOMETERS. Here the trend flips: temperature rises the higher you go, the opposite of the troposphere just below it. This layer contains ozone that absorbs incoming ultraviolet radiation from the sun, and that absorption is why temperature rises with altitude here. Commercial airplanes cruise near the bottom of this layer.',
        'MESOSPHERE -- FROM ABOUT 50 TO ABOUT 85 KILOMETERS. The trend flips again here: temperature falls with altitude, and it keeps falling until this layer reaches the coldest part of the entire atmosphere, near its top.',
        'THERMOSPHERE -- FROM ABOUT 85 KILOMETERS OUTWARD, WITH NO SINGLE SHARP TOP. The trend flips one more time: temperature rises again, and by the measure scientists use for temperature, this is the hottest of the four layers. It reaches out hundreds of kilometers and gradually thins into space with no exact edge. The International Space Station orbits inside this layer, at around 400 kilometers up.',
        'COMPOSITION -- WHAT THE AIR IS ACTUALLY MADE OF. By volume, dry air is about 78 percent nitrogen and about 21 percent oxygen -- those two gases alone add up to about 99 percent of the air (78 + 21 = 99). The remaining roughly 1 percent is a mix of other gases, mostly argon, with carbon dioxide making up only a small part of that last one percent.',
      ],
      vocabulary: [
        { term: 'atmosphere', definition: 'the whole blanket of gases surrounding Earth, held in place by gravity.' },
        { term: 'troposphere', definition: 'the lowest layer of the atmosphere, reaching from the ground to about 12 kilometers, where temperature falls with altitude and almost all weather happens.' },
        { term: 'stratosphere', definition: 'the layer above the troposphere, from about 12 to about 50 kilometers, where temperature rises with altitude.' },
        { term: 'mesosphere', definition: 'the layer above the stratosphere, from about 50 to about 85 kilometers, where temperature falls with altitude again, reaching the coldest part of the atmosphere near its top.' },
        { term: 'thermosphere', definition: 'the outermost of the four layers covered here, beginning around 85 kilometers and reaching hundreds of kilometers outward, where temperature rises again and reaches its highest values.' },
      ],
      suggestedTools: ['show_labeled_image', 'show_table'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-altitude-to-layer',
      kind: 'worked_example',
      problem:
        'A science rocket launches straight up from the ground. Using altitude alone, name which of the four layers it is passing through at each of these three moments, and say whether the temperature there is trending colder or warmer as the rocket climbs: 5 kilometers up, 30 kilometers up, and 70 kilometers up.',
      steps: [
        'Start with the four altitude ranges from the concept: troposphere from the ground to about 12 kilometers, stratosphere from about 12 to about 50 kilometers, mesosphere from about 50 to about 85 kilometers, and thermosphere from about 85 kilometers outward.',
        '5 kilometers up falls inside the troposphere\'s range (0 to about 12 kilometers). In the troposphere, temperature falls with altitude, so it is trending colder at this point.',
        '30 kilometers up falls inside the stratosphere\'s range (about 12 to about 50 kilometers). In the stratosphere, temperature rises with altitude, so it is trending warmer at this point -- the opposite trend from the layer just below it.',
        '70 kilometers up falls inside the mesosphere\'s range (about 50 to about 85 kilometers). In the mesosphere, temperature falls again with altitude, so it is trending colder at this point.',
        'Check this three ways, using different kinds of evidence each time. First, altitude: each of the three numbers (5, 30, 70) sits cleanly inside one range and not near a boundary, so there is no ambiguity about which layer it belongs to. Second, the trend pattern: the three trends line up as colder, warmer, colder, which matches the down-up-down-up pattern across the four layers, not a random mix. Third, order: 5 is less than 30 is less than 70, and troposphere-stratosphere-mesosphere is the correct order outward from the ground, so the layers named do not skip or reverse.',
        'Now change one number and see if the answer moves. If the third reading had been taken at 90 kilometers instead of 70, it would fall in the thermosphere\'s range instead of the mesosphere\'s, and the trend at that point would be warmer, not colder -- the answer changes because the evidence changed.',
      ],
      answer:
        '5 kilometers: troposphere, trending colder. 30 kilometers: stratosphere, trending warmer. 70 kilometers: mesosphere, trending colder.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-trend-to-boundary',
      kind: 'worked_example',
      problem:
        'Scientists tracking a research rocket\'s instruments see the temperature falling steadily the entire way up from the ground. At an altitude of about 12 kilometers, the falling stops, and from that point on the temperature starts rising steadily as the rocket keeps climbing. Which two layers meet at this point, and which one is the rocket about to enter?',
      steps: [
        'Start with the layer below the switch. Temperature was falling steadily from the ground up to about 12 kilometers, and that falling trend is exactly what defines the troposphere.',
        'WRONG: "The rocket keeps climbing, so the air must keep getting colder no matter what." CORRECT: temperature trends are tied to which layer the rocket is in, not simply to altitude increasing forever. The troposphere gets colder with height, but the layer directly above it gets warmer with height instead.',
        'Now use the trend reversal itself as the clue for the boundary. A switch from a falling trend to a rising trend, at about 12 kilometers, is exactly the pattern that marks the top of the troposphere and the start of the stratosphere.',
        'So the rocket is about to enter the stratosphere, where temperature rises with altitude instead of falling.',
        'Check this three ways, using different kinds of evidence each time. First, altitude: about 12 kilometers matches the troposphere\'s known upper range. Second, trend: the falling-to-rising switch is the specific signature of this particular boundary, not any of the other three. Third, order: the troposphere is the layer closest to the ground, so the very first boundary a rocket crosses on the way up has to be this one, not a higher one.',
        'Now change which kind of switch happens, and see if the answer moves. Suppose instead the rocket\'s readings had been rising steadily up to about 50 kilometers, then started falling from that point onward. That is the opposite type of switch, at a different altitude, and it marks a different boundary altogether: the top of the stratosphere and the start of the mesosphere.',
      ],
      answer:
        'The troposphere and the stratosphere meet here, and the rocket is about to enter the stratosphere. The falling-to-rising switch at about 12 kilometers matches the boundary between these two specific layers, not any other boundary in the atmosphere.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-composition',
      kind: 'try_yourself',
      problem: 'Which two gases make up about 99 percent of Earth\'s atmosphere by volume?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Oxygen and carbon dioxide, because those are the two gases people usually name first when asked what is in the air we breathe.' },
        { id: 'b', text: 'Nitrogen and argon, because both are gases that do not readily react with other substances, and nitrogen is already known to be common.' },
        { id: 'c', text: 'Oxygen and nitrogen dioxide, because nitrogen dioxide sounds like it should be closely related to plain nitrogen gas.' },
        { id: 'd', text: 'Nitrogen and oxygen, because together they make up about 99 percent of the air by volume, with nitrogen at about 78 percent and oxygen at about 21 percent.', correct: true },
      ],
      expectedAnswer: 'Nitrogen and oxygen, because together they make up about 99 percent of the air by volume, with nitrogen at about 78 percent and oxygen at about 21 percent.',
      hints: [
        'One of the two gases you are looking for is completely tasteless, colorless, and something you never think about -- which might be exactly why it is easy to forget it is the most abundant gas of all.',
        'Add the percentages for the pair you are considering. If a pair does not come close to totaling 99 percent, it is not the pair this question is asking about.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-layer-is-warming',
      kind: 'try_yourself',
      problem:
        'A rocket\'s instruments show temperature falling steadily from the ground up to about 12 kilometers, then rising steadily from about 12 kilometers up to about 50 kilometers. In which layer is the temperature rising with altitude?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The stratosphere, because temperature increases with altitude there once the troposphere\'s steady drop ends at about 12 kilometers.', correct: true },
        { id: 'b', text: 'The troposphere, because the problem describes the temperature falling near the ground, and falling temperature is the troposphere\'s known pattern -- so that has to be the layer being asked about.' },
        { id: 'c', text: 'The mesosphere, because 12 to 50 kilometers is closer to the mesosphere\'s usual altitude range than to the stratosphere\'s.' },
        { id: 'd', text: 'The thermosphere, because it is the outermost of the four layers, and outer layers must be warmer for being nearer to the sun.' },
      ],
      expectedAnswer: 'The stratosphere, because temperature increases with altitude there once the troposphere\'s steady drop ends at about 12 kilometers.',
      hints: [
        'Reread the two altitude ranges given in the problem and match each one to the layer that sits there -- the ranges themselves tell you which layer is which.',
        'Look specifically at which of the two ranges given (0 to 12 kilometers, or 12 to 50 kilometers) is the one where the trend flips from falling to rising, and ask which layer occupies that second range.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-boundary-as-range',
      kind: 'try_yourself',
      problem:
        'A student says: "The boundary between the troposphere and the stratosphere sits at exactly 12 kilometers everywhere on Earth, like a line drawn around the globe." Is this accurate, and why or why not?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Yes, because every layer of the atmosphere has a fixed altitude that does not change from place to place.' },
        { id: 'b', text: 'No, because the troposphere is thinner over the poles and thicker over the equator, so the boundary sits at a different altitude depending on where you are.', correct: true },
        { id: 'c', text: 'No, because the troposphere does not have a top boundary at all; it blends directly into the stratosphere with no way to tell where one ends and the other begins.' },
        { id: 'd', text: 'Yes, because scientists have measured the boundary precisely enough that 12 kilometers is treated as an exact value in every calculation.' },
      ],
      expectedAnswer: 'No, because the troposphere is thinner over the poles and thicker over the equator, so the boundary sits at a different altitude depending on where you are.',
      hints: [
        'Real atmospheric boundaries are found by measuring where a temperature trend changes, not by drawing a line at one fixed number. Does that trend reversal happen at the same altitude everywhere on Earth?',
        'The troposphere\'s own thickness is different at the poles than at the equator -- roughly 8 kilometers versus roughly 16 kilometers. If the layer\'s thickness is not one fixed number, can the boundary that caps it be one fixed number either?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-oxygen-and-straight-line-cooling',
      kind: 'misconception_check',
      question:
        'A student says: "The air we breathe is mostly oxygen, and since the atmosphere is one gas blanket, it must just keep getting colder in a straight line the higher up you go, all the way to space." Two separate things are wrong with that sentence. What are they?',
      commonErrors: [
        {
          answer: 'The air we breathe is mostly oxygen.',
          misconception:
            'Assuming the gas our bodies specifically need must be the most abundant one, since it is the gas people talk about and depend on for breathing.',
          correctsTo:
            'Nitrogen is actually the most abundant gas in dry air, at about 78 percent. Oxygen is second, at about 21 percent. Together those two make up about 99 percent of the air, with the remaining roughly 1 percent being a mix of other gases, mostly argon, with carbon dioxide making up only a small part of that last 1 percent. Oxygen matters enormously for breathing, but mattering to us is not the same as being the most common gas in the air.',
        },
        {
          answer: 'The atmosphere just keeps getting colder in a straight line, all the way to space.',
          misconception:
            'Assuming that because the ground is warm and space is cold, temperature must fall in one steady line the entire way between them.',
          correctsTo:
            'Temperature does not fall the whole way up. It falls through the troposphere (the ground up to about 12 kilometers), then rises through the stratosphere (about 12 to about 50 kilometers), then falls again through the mesosphere (about 50 to about 85 kilometers), then rises again through the thermosphere (from about 85 kilometers outward). The pattern goes down, up, down, up across the four layers, not down the whole way.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The atmosphere is a thin blanket of gases held to Earth by gravity, divided into four layers by altitude and temperature trend: troposphere, stratosphere, mesosphere, thermosphere, in that order outward from the ground.',
        'The troposphere reaches from the ground up to about 12 kilometers (thinner over the poles, thicker over the equator), and temperature falls steadily with altitude through it. This is the layer with weather and the air we breathe.',
        'The stratosphere runs from about 12 to about 50 kilometers. It contains ozone that absorbs incoming ultraviolet radiation from the sun, which is why temperature rises with altitude through it -- the opposite trend from the troposphere below it.',
        'The mesosphere runs from about 50 to about 85 kilometers, where temperature falls again, reaching the coldest part of the whole atmosphere near its top.',
        'The thermosphere begins around 85 kilometers and stretches outward hundreds of kilometers with no single sharp top; temperature rises again there, and it is the hottest of the four layers. The International Space Station orbits inside it.',
        'Layer boundaries are not sharp lines. They are transition zones, and the exact altitude of each one shifts depending on latitude and other conditions.',
        'By volume, dry air is about 78 percent nitrogen and about 21 percent oxygen -- those two gases alone make up about 99 percent of the air. The remaining roughly 1 percent is a mix of other gases, mostly argon, with carbon dioxide only a small part of that last 1 percent.',
        'Temperature does not fall in a straight line all the way up. It goes down, up, down, up across the four layers, not down the whole way to space.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'Layers & Composition of the Atmosphere' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
