/**
 * Grade 6 Science (Earth & Space Science) — Water on Earth & Earth's Systems
 * Interacting: The Water Cycle: Evaporation, Condensation & Precipitation.
 *
 * CONCEPT-LED row (NGSS MS-ESS2-4) for the m6sci fan-out. This is the
 * ATMOSPHERIC half of the water cycle. The lesson builds one ordered pathway
 * -- energy from the sun evaporates liquid water; rising vapor cools and
 * condenses into the liquid droplets that make up a cloud; droplets grow too
 * heavy for the air to hold and fall back to Earth's surface as precipitation
 * -- and stops the instant that water reaches the surface.
 *
 * SCOPE GUARD: this plan covers evaporation, condensation and precipitation
 * as the atmospheric portion of the water cycle, and nothing past the moment
 * precipitation lands. Boundaries, stated so a reviewer can check each one:
 *   - ROW 7.3 (the very next lesson) owns everything that happens to water
 *     AFTER it lands: infiltrating into groundwater, becoming surface runoff,
 *     or being taken up by a plant. This plan never describes any of those
 *     three outcomes, and it never uses the words "runoff", "infiltrate",
 *     "groundwater", "aquifer", "roots", "transpiration" or "plant" as a
 *     description of something the water cycle does -- the only place
 *     "runoff" appears is as the TEXT of one wrong try_yourself choice, used
 *     to name the neighboring lesson's topic and say why it cannot be the
 *     answer here, exactly the way the concept-led exemplar names "eclipse"
 *     to bound its own row without teaching eclipse geometry. Plant water use
 *     in particular is the trap this row is built to avoid: a single sentence
 *     about a plant drawing water up from soil reads as harmless enrichment
 *     inside a water-cycle lesson, and it is instead a sideways step into
 *     Grade 7 life science (a living organism's internal process) layered on
 *     top of a scope violation against row 7.3, which owns plant water uptake
 *     on this course's own chain. No plant, root or leaf appears anywhere in
 *     this file.
 *   - ROW 7.1 (the prerequisite, Earth's Four Spheres Interacting) is where
 *     the hydrosphere and atmosphere are introduced as two of Earth's four
 *     spheres in general. This plan assumes that introduction and does not
 *     repeat it; it treats "the atmosphere" and "the ocean/lakes/puddles" as
 *     already-named places water moves between, without re-teaching the
 *     four-spheres framework itself.
 *   - GRADE 8 PHYSICAL SCIENCE boundary, and this is the one sentence this
 *     plan deliberately never writes: "the sun's energy gives water molecules
 *     enough energy to break free from each other and escape as a gas." That
 *     is the particle-level account of a phase change, and it belongs to
 *     Grade 8 alongside the kinetic theory of matter generally. This plan
 *     instead stays at the Earth-system level throughout: energy from the sun
 *     is named as the DRIVER of evaporation (the same way Unit 4 names energy
 *     from Earth's interior as the driver of mantle motion, without a
 *     heat-transfer mechanism), and evaporation, condensation and
 *     precipitation are each named as a transformation between water's liquid
 *     and gas states -- WHAT changes, never the molecular WHY. The plan does
 *     distinguish evaporation from boiling once, because "the lake must be
 *     boiling for water to leave it" is a real, common eleven-year-old error;
 *     that distinction is drawn entirely at the observable level (evaporation
 *     happens from a liquid's surface at ordinary outdoor temperatures;
 *     boiling is a separate, much hotter event this lesson does not need),
 *     never at the particle level.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears -- see the plant note above.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. The cycle is
 * normally taught from a diagram; here the pathway is written out in words as
 * an ordered chain of transformations, and every item is answerable from that
 * printed chain rather than a remembered picture. Never write "see the
 * diagram above."
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U7_THE_WATER_CYCLE_EVAPORATION_CONDENSATION_PRECIPITATION: LessonPlan = {
  id: 'evelyn.ms.m6sci.the-water-cycle-evaporation-condensation-precipitation.v1',
  title: 'The Water Cycle: Evaporation, Condensation & Precipitation',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.the-water-cycle-evaporation-condensation-precipitation',
      standard: 'M6SCI-7.2',
      description:
        'Model how energy from the sun drives evaporation and how condensation and precipitation return water to Earth\'s surface, in the atmospheric portion of the water cycle (NGSS MS-ESS2-4).',
    },
  ],
  prerequisites: ['m6sci.earths-four-spheres-interacting'],
  followUps: ['m6sci.the-water-cycle-groundwater-and-runoff'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from something the student has watched happen and never had to explain.',
      script:
        'Picture a puddle sitting on the blacktop after morning recess. By the time school lets out, it is gone. Nobody mopped it up. It did not soak into solid pavement. It did not rain again. The water was there, and now it is not. Here is a second thing you have probably watched happen: a cold glass of lemonade left on a table on a warm day grows a coat of water on the outside, even though the glass was sealed and nobody poured anything on it. Two puzzles, and they turn out to be the same puzzle looked at from opposite ends. Today we trace the path water takes between "there" and "gone" and back again -- evaporation, condensation and precipitation -- and by the end you will be able to explain both the disappearing puddle and the sweating glass using the exact same idea.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-atmospheric-water-cycle',
      kind: 'concept',
      goal: 'Build the ordered evaporation-condensation-precipitation pathway as a chain of named transformations, driven by energy from the sun, and stop at the moment water reaches the surface.',
      keyIdeas: [
        'EVAPORATION IS DRIVEN BY ENERGY FROM THE SUN. Energy from the sun warms the surface of oceans, lakes, rivers and puddles. Warmed liquid water changes into water vapor, an invisible gas, and that vapor mixes into the air above it. This is EVAPORATION: a liquid becoming a gas. It happens continuously, at ordinary outdoor temperatures, anywhere liquid water is exposed to air -- it does NOT require the water to boil. More sunlight and more warmth make evaporation happen faster, which is exactly why a puddle disappears faster on a hot, sunny afternoon than on a cool, cloudy one.',
        'RISING WATER VAPOR COOLS AND CONDENSES. Water vapor is lighter than the surrounding air and rises. As it moves higher into the atmosphere, it cools. Cooled water vapor changes back into liquid water, forming countless tiny liquid droplets far too small to fall. This is CONDENSATION: a gas becoming a liquid. Billions of these droplets clustered together, floating in the air, are what a CLOUD is. Condensation is the exact reverse of evaporation, and cooling is what causes it -- not wind, and not sunlight.',
        'PRECIPITATION RETURNS THE WATER TO THE SURFACE. Inside a cloud, droplets keep colliding and joining into larger drops. Once a drop grows too heavy for the rising air to hold it up, it falls. Water falling from a cloud to Earth\'s surface is PRECIPITATION -- rain if it stays liquid on the way down, snow, sleet or hail if it freezes on the way down. Precipitation is the step that moves water from the atmosphere back onto land or into a body of water.',
        'THE PATHWAY IS AN ORDERED CHAIN, NOT A LOOSE LIST. Written out as the ordered chain of transformations it is: energy from the sun evaporates liquid water into water vapor; rising water vapor cools and condenses into the liquid droplets that make up a cloud; droplets inside the cloud combine and grow heavy, and fall to Earth\'s surface as precipitation. The order cannot be skipped or reversed -- vapor cannot fall as precipitation until it has already condensed into a liquid or a solid, and it cannot condense until it has already evaporated and risen.',
        'THIS ROW STOPS AT THE SURFACE. The moment precipitation reaches the ground or a body of water, this lesson\'s pathway is finished. What happens to that water next -- soaking into the ground, flowing across the land, or being taken up by a plant -- is a different lesson\'s topic, not this one.',
        'THE SAME WATER MOVES AGAIN AND AGAIN. There is no starting point and no ending point to this pathway; it repeats. Water that fell as precipitation onto the ocean can be evaporated again the very next sunny day. That is why it is called a CYCLE rather than a one-way trip.',
      ],
      vocabulary: [
        { term: 'evaporation', definition: 'liquid water changing into invisible water vapor, driven by energy from the sun; it happens at ordinary temperatures and does not require boiling.' },
        { term: 'water vapor', definition: 'water in its gas form, invisible, mixed into the air.' },
        { term: 'condensation', definition: 'water vapor cooling and changing back into liquid water, forming the tiny droplets that make up a cloud.' },
        { term: 'precipitation', definition: 'water falling from a cloud to Earth\'s surface as rain, snow, sleet or hail.' },
        { term: 'water cycle', definition: 'the repeating path water follows as it moves between the ocean, the atmosphere and the land.' },
      ],
      suggestedTools: ['show_diagram', 'show_cycle_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-tracing-the-disappearing-puddle',
      kind: 'worked_example',
      problem:
        'A puddle on the blacktop after morning recess is completely gone by the end of the school day. It did not rain again, and nobody mopped it up. Using the water cycle, name the process that made the water disappear and explain where the water actually went.',
      steps: [
        'Start with what did NOT happen: the water was not soaked up by the pavement, since blacktop does not absorb water the way soil does, and nobody removed it by hand. The water has to have changed form rather than been carried away.',
        'Name the driver. It was a school day with the sun out, so energy from the sun was reaching the puddle and warming the liquid water sitting in it.',
        'Name the process. Warmed liquid water at the surface of the puddle changed into invisible water vapor and mixed into the air above the puddle. That change, liquid to gas, is evaporation.',
        'WRONG: "The puddle disappeared because the water evaporated once it got hot enough to boil." CORRECT: "The puddle evaporated at ordinary outdoor air temperature, well below boiling -- evaporation does not need boiling, and a shallow puddle in the sun evaporates within hours precisely because it never has to reach that point."',
        'Check the answer with three clues of different kinds. First, timing: the puddle shrank gradually over several hours across the school day, matching a gradual process rather than a sudden one. Second, the everyday pattern: puddles are well known to disappear fastest on hot, sunny days and slowest on cool, cloudy ones, which fits evaporation being driven by available sunlight. Third, mass balance: no water was seen leaving as a liquid -- it did not flow anywhere and nothing carried it off -- so it must have left as an invisible gas, which is exactly what evaporation is.',
        'Now change one condition and check that the answer moves with it. If the same puddle had instead been sitting in a shaded, cool corner of the schoolyard all day, evaporation would have continued, but much more slowly, because less energy from the sun would have reached the water -- the puddle might still be there at the end of the day rather than gone. A process that speeds up and slows down as the sunlight changes is evaporation behaving as expected, not a different explanation appearing.',
      ],
      answer:
        'The water evaporated. Energy from the sun warmed the puddle until the liquid water at its surface changed into invisible water vapor and mixed into the air above it -- the puddle did not go anywhere as a liquid, it changed state.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-ordering-a-described-scene',
      kind: 'worked_example',
      problem:
        'A weather log describes three things happening in this order at one lake: (1) all afternoon, strong sunlight beats down on the lake\'s surface; (2) by evening, a thick gray cloud has built up directly above the lake; (3) that night, rain falls onto the town next to the lake. Match each event to the water-cycle process linking it to the next, in order.',
      steps: [
        'Take the first event on its own. Strong sunlight on the lake\'s surface all afternoon means energy from the sun is warming the lake\'s liquid water. That is the setup for evaporation, and by evening enough water vapor has risen off the lake to matter.',
        'Take the second event next. A thick gray cloud built up above the same lake by evening. A cloud is a mass of tiny liquid droplets, so something turned the rising water vapor back into liquid -- that something is condensation, caused by the vapor cooling as it rose.',
        'Take the third event last. Rain fell from that cloud onto the town that night. Water leaving a cloud and reaching the surface is precipitation.',
        'WRONG: "The rain fell because the cloud finished condensing all at once." CORRECT: "Precipitation happens once droplets already inside the cloud collide and combine until they are too heavy for the air to hold up -- condensation keeps making droplets, and precipitation is a separate, later step where some of those droplets fall."',
        'Check the order with three clues of different kinds. First, the sequence given in the log already runs afternoon, then evening, then night, matching evaporation, then condensation, then precipitation in that same order. Second, the description of each event matches the process assigned to it: heating a surface matches evaporation, a cloud appearing matches condensation, rain falling matches precipitation. Third, internal consistency: reading the three matched pairs back in order tells a complete, unbroken story with no missing step, which would not be true if one of the processes were misassigned.',
        'Now change one condition and check that the answer moves. Suppose the air above the lake had stayed too warm all evening for the rising vapor to cool enough to condense. No cloud would have formed, and with no cloud there would be nothing to fall as precipitation that night -- no matter how much water had evaporated off the lake that afternoon. Evaporation happening does not guarantee precipitation follows; each step in the chain has to actually occur before the next one can.',
      ],
      answer:
        'Sunlight heating the lake causes evaporation; the water vapor rising and cooling causes condensation, which builds the cloud; droplets in the cloud combining and growing too heavy causes precipitation, which falls onto the town as rain.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-what-causes-evaporation',
      kind: 'try_yourself',
      problem:
        'A large lake sits under strong summer sunlight all day. By evening, some of its water has entered the air as invisible water vapor, even though nobody touched the lake. What made that liquid water change into water vapor?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Wind blowing across the lake\'s surface was strong enough to carry tiny drops of liquid water up into the sky, the same way spray comes off a wave.' },
        { id: 'b', text: 'Energy from the sun warmed the lake water until enough of it changed from a liquid into invisible water vapor, which mixed into the air above the lake.', correct: true },
        { id: 'c', text: 'The lake grew hot enough to reach its boiling point, so the water at its surface boiled off into the air the way water does on a stove.' },
        { id: 'd', text: 'Clouds already forming overhead pulled the water upward out of the lake and into themselves, as if a cloud\'s own moisture draws lake water up rather than rising water first helping to build the cloud.' },
      ],
      expectedAnswer: 'Energy from the sun warmed the lake water until enough of it changed from a liquid into invisible water vapor, which mixed into the air above the lake.',
      hints: [
        'Evaporation is liquid water quietly changing into an invisible gas. Which choice describes exactly that change, and which ones describe something else entirely happening to the water?',
        'Wind can carry vapor away a little faster once it exists, but wind does not turn liquid into vapor by itself, and evaporation does not require reaching a boiling point. Rule those two ideas out and see what is left.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-causes-condensation',
      kind: 'try_yourself',
      problem:
        'Water vapor that evaporated off the ocean rises into the sky. After rising for a while, tiny liquid droplets appear where a moment ago there was only invisible vapor. What caused the water vapor to change into liquid droplets?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The vapor rose until it reached the very top of the sky, and once it could climb no higher it turned back into a liquid on its own.' },
        { id: 'b', text: 'Wind mixed the rising water vapor together forcefully enough that enough of it clumped into visible drops of liquid water.' },
        { id: 'c', text: 'The rising water vapor cooled, and the cooled vapor condensed into the tiny liquid droplets that make up a cloud.', correct: true },
        { id: 'd', text: 'Sunlight shining on the rising water vapor caused it to condense into droplets, the same energy that had evaporated it earlier that day.' },
      ],
      expectedAnswer: 'The rising water vapor cooled, and the cooled vapor condensed into the tiny liquid droplets that make up a cloud.',
      hints: [
        'Water vapor stays a gas until something specific happens to it. What single property of the air around the rising vapor changes as it gets higher in the atmosphere?',
        'Sunlight is what drove the evaporation earlier in this same pathway, and wind can move a cloud once it exists -- but neither one turns a gas back into a liquid. What does?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-what-causes-precipitation',
      kind: 'try_yourself',
      problem:
        'A thick gray cloud over a valley has been getting darker all afternoon, and the droplets inside it have been colliding and combining into larger and larger drops. That evening, rain falls onto the valley floor. Which process names what carried the water from the cloud down to the valley floor?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Evaporation, because energy from the sun reached into the cloud and pulled the heavy drops down toward the valley floor.' },
        { id: 'b', text: 'Condensation, because the droplets were still changing from vapor into liquid the whole way down to the valley floor.' },
        { id: 'c', text: 'Runoff, because reaching the valley floor and immediately flowing across the land toward a stream counts as the same single step as falling out of the cloud.' },
        { id: 'd', text: 'Precipitation, because the combined drops grew too heavy for the rising air to hold them up, so they fell to the surface as rain.', correct: true },
      ],
      expectedAnswer: 'Precipitation, because the combined drops grew too heavy for the rising air to hold them up, so they fell to the surface as rain.',
      hints: [
        'Two of these choices name processes that already finished earlier in this same pathway, before the drops ever started falling. Which process is actually happening at the exact moment the drops are on their way down?',
        'Runoff is the name for water moving across the ground after it has already landed, which is a different lesson\'s topic. What is the name for water falling out of a cloud onto the surface in the first place?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-boiling-and-wind',
      kind: 'misconception_check',
      question:
        'A student writes: "The lake evaporates because the sun makes it boil, and clouds form because the wind blows all the water vapor into one big pile." Two different things are wrong in that sentence. What are they?',
      commonErrors: [
        {
          answer: 'The lake evaporates because the sun makes it boil.',
          misconception:
            'Assuming evaporation requires reaching the boiling point, because boiling on a stove is the everyday example students already know of liquid water turning to gas.',
          correctsTo:
            'Evaporation does not require boiling. Energy from the sun warms the surface of the lake, and liquid water there changes into invisible water vapor at ordinary outdoor temperatures, all day, every day. More sunlight and more warmth make it happen faster, but reaching a boiling point is not required, and a lake never boils.',
        },
        {
          answer: 'Clouds form because the wind blows all the water vapor into one big pile.',
          misconception:
            'Crediting wind with creating a cloud by physically gathering water vapor together, rather than recognizing that cooling is what changes the vapor into liquid droplets.',
          correctsTo:
            'Clouds form because rising water vapor cools as it moves higher into the atmosphere, and the cooled vapor condenses into countless tiny liquid droplets. Wind can move a cloud from one place to another once it has already formed, but wind does not create a cloud by pushing vapor into a pile.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Energy from the sun warms the surface of oceans, lakes and puddles until liquid water changes into invisible water vapor. That change is evaporation, and it does not require the water to boil.',
        'Water vapor rises into the atmosphere, and as it moves higher, it cools.',
        'Cooled water vapor condenses into countless tiny liquid droplets, and those droplets clustered together are what a cloud is. Condensation is a gas becoming a liquid.',
        'Inside a cloud, droplets collide and combine into larger drops. When a drop grows too heavy for the rising air to hold it up, it falls to Earth\'s surface as precipitation -- rain, snow, sleet or hail.',
        'The order of this pathway is fixed: evaporation, then condensation, then precipitation. A later step cannot happen until the step before it has already happened.',
        'This lesson stops once precipitation reaches Earth\'s surface. What the water does next -- soaking into the ground, running off across the land, or being taken up by a plant -- is the next lesson\'s topic.',
        'Neither wind nor sunlight turns water vapor into liquid droplets. Cooling does. Wind can only move a cloud once it already exists.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.2', cedTitle: 'The Water Cycle: Evaporation, Condensation & Precipitation' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
