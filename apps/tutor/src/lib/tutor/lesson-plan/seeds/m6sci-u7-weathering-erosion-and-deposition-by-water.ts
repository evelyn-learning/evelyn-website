/**
 * Grade 6 Science (Earth & Space Science) — Water on Earth & Earth's Systems
 * Interacting: Weathering, Erosion & Deposition by Water.
 *
 * CONCEPT-LED lesson for the m6sci fan-out (DCI ESS2.A). The whole lesson is
 * one chain of three jobs done by moving water on rock and sediment: weather
 * it apart where it sits, erode (carry) the loosened pieces away, and deposit
 * them somewhere else. Every item traces that chain start to finish, or reads
 * a finished landform backward to recover which step built it, and the two
 * built landforms (a delta, a floodplain) and the one cut landform (a canyon)
 * are shown as opposite outcomes of the very same three processes.
 *
 * The two traps it is built to kill are (a) using "erosion" as a catch-all
 * word for the rock breaking apart in the first place, which is weathering's
 * job, and (b) assuming moving water drops its sediment where it is moving
 * FASTEST rather than where it SLOWS DOWN.
 *
 * SCOPE GUARD: this plan explains how moving water mechanically and
 * chemically weathers rock, erodes the loosened sediment, and deposits it to
 * build a delta or a floodplain, and separately how it erodes downward to
 * cut a canyon -- and nothing else. Because several close neighbors sit right
 * at this row's edges, the guard states what is deliberately EXCLUDED and
 * what is deliberately ALLOWED, and why:
 *   - UNIT 3's ROCK CYCLE (m6sci.the-rock-cycle) already introduced
 *     weathering, erosion and deposition as three of seven rock-cycle
 *     processes, using rain, ice, wind and temperature change together as
 *     generic agents, and this plan restates the same three definitions
 *     (weathering breaks rock apart where it sits; erosion carries the loose
 *     pieces away; deposition drops them somewhere else) on purpose, so the
 *     two lessons agree. This plan does not repeat the rock cycle's job of
 *     tracing a rock's TYPE through a chain of processes -- no rock is
 *     classified or transformed from one rock type to another anywhere in
 *     this file. Instead this plan narrows the same three processes to ONE
 *     agent, moving water, and adds the mechanical/chemical split and the
 *     named landforms that the rock-cycle lesson never covered.
 *   - UNIT 4's landforms-built-by-plate-motion (row 4.4) covers landforms
 *     built by the slow motion of tectonic plates -- mountains, rift valleys,
 *     and the like. This plan's landforms (delta, floodplain, canyon) are
 *     built entirely by moving water acting on already-existing rock and
 *     sediment; no plate, plate boundary, or mantle convection is named or
 *     implied anywhere in this file.
 *   - THE OTHER UNIT 7 ROWS are not repeated here. Row 7.1 (Earth's four
 *     spheres) and rows 7.2-7.3 (the water cycle's atmospheric half and its
 *     groundwater/runoff half) are a different lesson's job. This plan
 *     assumes water is already flowing across land as a river or stream and
 *     never traces where that water came from (evaporation, condensation,
 *     precipitation, infiltration) or where it goes afterward as groundwater.
 *   - WIND AND ICE, as AGENTS, are outside this row's scope: the curriculum
 *     line for this row specifies weathering, erosion and deposition BY
 *     WATER, so glaciers and wind are never named as the acting agent
 *     anywhere in this file, even though the rock-cycle lesson mentioned
 *     them in passing as other agents of weathering. (Water freezing INSIDE
 *     a crack of rock is still named, as ice wedging, because that is water
 *     acting through a temperature change, not ice or a glacier acting on
 *     its own.)
 *   - NO RATE OR DURATION FIGURE IS MULTIPLIED ANYWHERE IN THIS FILE. Every
 *     time span in this lesson is qualitative ("over many years", "over an
 *     extremely long stretch of time"); no centimeters-per-year or
 *     years-to-a-result figure is stated or computed, so there is no
 *     rate-times-duration arithmetic in this file to get wrong.
 *   - GRADE 8 PHYSICAL SCIENCE boundary: chemical weathering is described
 *     only as rainwater dissolving or weakening a mineral such as limestone
 *     -- no chemical formula, no acid-base reaction mechanism, and no
 *     particle-level account of dissolving appears anywhere in this file.
 *   - GRADE 7 LIFE SCIENCE boundary: no life-science content is in scope for
 *     this row, and none appears.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every river,
 * cliff, and landform in this file is written out in words, and every item
 * is solvable from the text printed inside it. Never write "see the
 * landscape diagram," and never assume the student has a stream table, a
 * rock sample, or a river to look at.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is
 * the-water-cycle-groundwater-and-runoff -> weathering-erosion-and-
 * deposition-by-water -> weather-versus-climate, per the lesson brief and
 * the fan-out contract's chain table.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6SCI_U7_WEATHERING_EROSION_AND_DEPOSITION_BY_WATER: LessonPlan = {
  id: 'evelyn.ms.m6sci.weathering-erosion-and-deposition-by-water.v1',
  title: 'Weathering, Erosion & Deposition by Water',
  curriculum: 'MS',
  grade: '6',
  subject: 'science',
  topic: 'grade-6-earth-space-science',
  locale: 'en',
  los: [
    {
      id: 'm6sci.weathering-erosion-and-deposition-by-water',
      standard: 'M6SCI-7.4',
      description:
        'Explain how moving water mechanically and chemically weathers rock, erodes and transports the resulting sediment, and deposits it to build new landforms (deltas, canyons, floodplains) -- distinct from the rock-type transformations covered in Unit 3 (DCI ESS2.A).',
    },
  ],
  prerequisites: ['m6sci.the-water-cycle-groundwater-and-runoff'],
  followUps: ['m6sci.weather-versus-climate'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor the whole lesson in a creek the student has probably already watched change.',
      script:
        'Think about a creek or a drainage ditch near your house after a hard rain. Before the storm it might have been clear, or barely running at all. During and right after the storm, it runs fast and brown, almost the color of chocolate milk. A day or two later, once the water has calmed back down, you might notice a thin layer of mud sitting in places where the water used to rush the fastest, and clearer water running over it. That brown color, and that leftover mud, are not two separate mysteries. They are two steps of the exact same story: water breaking rock and soil apart somewhere upstream, carrying the pieces along for the ride, and then leaving them behind once it calms down. Today we trace that whole story, from a crack in a rock to a brand new patch of land.',
      suggestedTools: ['show_diagram'],
      estimatedMinutes: 1,
    },
    {
      id: 'concept-water-shapes-the-land',
      kind: 'concept',
      goal: 'Install the three-job chain done by water, split weathering into mechanical and chemical, and name the landforms deposition and erosion build.',
      keyIdeas: [
        'THREE DIFFERENT JOBS, ONE AGENT: MOVING WATER. WEATHERING breaks rock apart right where it sits. EROSION carries the already-loosened pieces, called sediment, away from where they formed. DEPOSITION drops that carried sediment somewhere else. These are three separate jobs, not three names for the same thing, and water can do all three -- but never at the same moment, and never in the wrong order. Rock has to be weathered before there is anything loose for erosion to carry, and sediment has to be carried before deposition has anything to drop.',
        'MECHANICAL WEATHERING BY WATER breaks rock into smaller pieces of the exact same material -- nothing about what the rock is made of changes, only its size. Two common ways water does this: ICE WEDGING, where water seeps into a crack, freezes, and expands, forcing the crack a little wider each time it happens, until a piece finally breaks off; and simple GRINDING, where fast-moving water rolls rock fragments against a riverbed or against each other, chipping off small pieces the way a rock tumbler wears down stones.',
        'CHEMICAL WEATHERING BY WATER changes WHAT the rock is made of, not just its size. Rainwater picks up a small amount of carbon dioxide from the air on its way down and becomes slightly acidic. That weak acid can slowly dissolve certain minerals -- limestone is the clearest example -- widening cracks and hollowing out rock over time. The rock that comes out the other side is chemically different from what went in, which is what separates chemical weathering from mechanical weathering.',
        'EROSION BY WATER carries away the sediment that weathering has already loosened, and moving water is picky about what it can carry. Fast, powerful water -- a rushing mountain stream, a river in flood -- has enough force to carry large, heavy pieces like gravel along with smaller sand and mud. Slow-moving water can only keep small, light pieces like fine sand and mud suspended; it cannot carry gravel at all. How much power the water has decides how large a piece it can move.',
        'DEPOSITION BY WATER happens wherever moving water SLOWS DOWN, never where it is moving fastest. The instant water loses the speed it needs to keep carrying its load, it starts dropping sediment -- heaviest pieces first, because they need the most power to stay suspended, and lightest pieces last, because they can still be carried a little farther before the water finally gives them up too. Two landforms come from this: a DELTA, a fan of new land where a fast river slows sharply on reaching a larger, calmer body of water and dumps what it was carrying (the Mississippi River builds a real delta this way, where its current meets the calm water of the Gulf of Mexico); and a FLOODPLAIN, the flat strip of land beside a river that gains a new layer of mud every time the river rises over its banks, spreads out across flat ground, and slows to a crawl (the Nile River\'s floodplain formed this way, built up by its floods long before any dam controlled the river).',
        'A CANYON IS THE OPPOSITE OUTCOME OF THE SAME THREE PROCESSES. Instead of building new land somewhere else, erosion can cut land DOWN. When a river keeps carrying away the sediment that weathering keeps loosening from its own bed and walls, over an extremely long stretch of time, the river channel gets deeper and deeper relative to the rock on either side of it, until the land drops far below the surrounding rock layers -- a canyon (the Colorado River has cut the Grand Canyon this way). A canyon and a delta are not opposites in what CAUSES them; they are opposites in where the SEDIMENT ends up. A canyon is what is left behind once erosion has carried the sediment away. A delta is what erosion carried and deposition finally dropped.',
      ],
      vocabulary: [
        { term: 'mechanical weathering', definition: 'breaking rock into smaller pieces of the same material, without changing what the rock is made of, such as by ice wedging or by moving water grinding fragments together.' },
        { term: 'chemical weathering', definition: 'changing what a rock is made of, such as by rainwater slowly dissolving a mineral like limestone.' },
        { term: 'erosion', definition: 'the carrying away of loose sediment by moving water, from the place where weathering loosened it.' },
        { term: 'deposition', definition: 'the dropping of sediment that moving water was carrying, which happens wherever the water slows down.' },
        { term: 'delta', definition: 'new land built where a river slows sharply on reaching a larger, calmer body of water and deposits its sediment.' },
        { term: 'floodplain', definition: 'the flat land beside a river that is built up, layer by layer, by sediment deposited each time the river floods.' },
      ],
      suggestedTools: ['show_diagram', 'show_map'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-mountain-stream-to-delta',
      kind: 'worked_example',
      problem:
        'Every spring, snowmelt speeds up a mountain river. Where the fast water rushes over a rocky ledge, it repeatedly rolls small rocks against the ledge and against each other, chipping off gravel and sand. The river then carries that gravel and sand a long way downstream, out past the mountains and across flat land, until it finally reaches the calm, still water of a lake. Trace what happens to the rock at the ledge from start to finish, and name the landform that eventually forms where the river meets the lake.',
      steps: [
        'Start with the ledge. Fast water rolling rocks against the ledge and against each other, chipping off gravel and sand, is breaking rock apart right where it sits -- that is weathering, and specifically MECHANICAL weathering, because pieces are physically broken off without anything about the rock dissolving or chemically changing.',
        'The river then carrying that gravel and sand downstream, mile after mile, is a separate job: erosion. Erosion never breaks the rock -- weathering already did that at the ledge -- erosion only moves what is already loose.',
        'WRONG: "The river eroded the rock into gravel and sand at the ledge." CORRECT: "The river\'s rushing water weathered the rock into gravel and sand at the ledge; only afterward did erosion carry those loose pieces downstream." Naming the wrong process at the wrong step is the single most common mistake on this topic.',
        'Now follow the sediment to the lake. As the fast-flowing river reaches the calm, still lake water, it abruptly loses the push that let it carry gravel and sand -- calm standing water does not shove the river forward the way a steep mountain slope does. Losing that push is exactly the condition that causes deposition: moving water can only carry sediment as long as it keeps moving fast enough, and here it suddenly does not.',
        'The heaviest pieces -- the gravel -- drop out first, right where the river meets the lake. The lighter sand is carried a little farther into the calmer water before it, too, settles out.',
        'Repeated over many years, sediment builds up in a fan shape spreading out from the river\'s mouth into the lake. That built-up fan is a delta.',
        'Now run the two checks a science answer needs, because there is no arithmetic here to redo. First, look for clues of DIFFERENT KINDS that agree. The order of the story only makes sense one way -- pieces cannot be carried before they are broken loose, and cannot be dropped before they are carried. The sorting by size (gravel first, then sand) matches the general rule that heavier pieces need more moving power to stay suspended. And the location matches the rule too: deposition happens exactly where the water loses speed, which is exactly where the fast river meets the calm lake. Three different kinds of evidence, one answer.',
        'Second, change one condition and check that the answer moves with it. Suppose the river had instead kept flowing fast the whole way, straight into a narrow, steep gorge with no calm water anywhere in sight. Then nothing would ever slow the water down enough to drop its sediment, and no delta would form there at all -- the river would instead keep eroding and cutting the gorge deeper, the same process that carves a canyon rather than building a delta. Change the ending condition and the outcome changes with it.',
      ],
      answer:
        'Mechanical weathering breaks gravel and sand off the rocky ledge; erosion carries that sediment downstream; deposition drops it where the river\'s fast current meets the lake\'s calm water, building a delta.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-limestone-and-floodplain',
      kind: 'worked_example',
      problem:
        'Farther downstream, that same river flows past a limestone cliff for many years. Slightly acidic rainwater trickles into cracks in the limestone and slowly dissolves some of the rock, widening the cracks and eventually loosening chunks that fall into the river. Meanwhile, every few years during a heavy rainy season, the river rises over its banks and spreads a thin sheet of muddy water across the flat land beside it; the water then drains back into the channel days later, leaving a new layer of mud on the ground. Which kind of weathering loosened the limestone chunks, and what landform is being built beside the river by the repeated flooding?',
      steps: [
        'Look closely at what changed the limestone: rainwater DISSOLVED part of the rock. That is a chemical change -- the rock is not the same substance it was before, part of it has actually dissolved away -- so this is CHEMICAL weathering, not mechanical weathering.',
        'WRONG: "Water loosening rock is always mechanical weathering, because ice and rushing water break rock apart mechanically." CORRECT: "Whether weathering by water is mechanical or chemical depends on HOW the rock is changed: physically breaking into smaller pieces of the same material is mechanical, like ice wedging a crack wider; dissolving or chemically altering the rock is chemical, like rainwater dissolving limestone." The involvement of water does not decide which kind it is -- the kind of change does.',
        'Once the chunks fall loose into the river, carrying them away would be erosion -- but that is a separate step from the dissolving that loosened them in the first place.',
        'Now the flooding. Water spreading out of the channel across flat land loses speed immediately -- a thin sheet of water spread wide across flat ground moves far slower than the same water confined to a narrow channel. Losing that speed is what causes deposition, so the mud the floodwater was carrying settles out onto the land.',
        'This happens again every few years, each flood leaving one more thin layer of mud on top of the last. Built up over many floods, this creates the flat strip of built-up land beside the river called a floodplain.',
        'WRONG: "A river drops sediment wherever it happens to be flowing." CORRECT: "A river drops sediment specifically where it SLOWS DOWN -- confined in its channel it can keep carrying sediment for miles, but the moment it spreads out or empties into calmer water, it loses the power to keep carrying what it had."',
        'Now run the two checks. First, three clues of different kinds that agree: the mechanism (dissolving) matches the definition of chemical weathering; the location of the new mud, right where the water spread out and slowed, matches the deposition rule; and the fact that only fine mud gets deposited on the floodplain, rather than gravel, matches the earlier rule that slow water can only carry small, light pieces. Second, change one condition: if that same river, instead of spreading across flat land, stayed confined between steep canyon walls even during high water, it would keep moving fast and would keep eroding the canyon deeper rather than depositing mud beside it -- which is exactly why a canyon has bare rock walls while a floodplain has soft, layered soil.',
      ],
      answer:
        'Chemical weathering (the rainwater dissolved part of the limestone) loosened the chunks; the repeated flooding is building a floodplain, because the floodwater loses speed and drops its mud once it spreads out across the flat land.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-weathering-then-erosion',
      kind: 'try_yourself',
      problem:
        'A fast-moving mountain stream tumbles rocks along its bed, knocking small chips and grains loose from a boulder, then carries those loose chips and grains miles downstream before dropping them in a calm pool. Which two processes act on the boulder itself, in the order they happen?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Erosion knocking the chips and grains loose from the boulder, then weathering carrying them miles downstream, because erosion is the more forceful process and naturally comes first whenever water is moving fast.' },
        { id: 'b', text: 'Deposition knocking the chips and grains loose from the boulder, then erosion carrying them downstream, because deposition is what happens first whenever new loose sediment appears in a moving stream.' },
        { id: 'c', text: 'Erosion knocking the chips and grains loose from the boulder, then deposition carrying them downstream, because moving material away from its source is what erosion actually means, and deposition is simply that same carrying continued over a longer distance.' },
        { id: 'd', text: 'Weathering knocking the chips and grains loose from the boulder, then erosion carrying that loosened material downstream, because weathering breaks rock apart right where it sits and erosion is the separate job of moving what is already loose.', correct: true },
      ],
      expectedAnswer:
        'Weathering knocking the chips and grains loose from the boulder, then erosion carrying that loosened material downstream, because weathering breaks rock apart right where it sits and erosion is the separate job of moving what is already loose.',
      hints: [
        'Look at what happens right at the boulder first: something breaks small chips and grains loose from it before anything can carry them anywhere. Which process breaks rock apart where it sits?',
        'Once pieces are already loose, a separate job carries them away. Do not let one process name cover both jobs -- one of them only breaks, and the other only carries.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-delta-forms-where-water-slows',
      kind: 'try_yourself',
      problem:
        'A river carries sand and mud for miles at a good clip, then flows into a wide, calm bay and slows down sharply. Over many years, the sediment it drops there builds a new, fan-shaped patch of land stretching out from the river\'s mouth. What is this landform called, and why did the river drop its sediment at that spot?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A delta, because the river lost the fast-moving push it needs to keep carrying sand and mud once it spread out into the bay\'s calm, still water.', correct: true },
        { id: 'b', text: 'A canyon, because any place where moving water meets new, unmoving land cuts downward into that land, the same way a river slowly carves a canyon out of rock upstream.' },
        { id: 'c', text: 'A floodplain, because any flat new land that appears next to moving water is built the same way, whether the water spilled over its banks or emptied into a bay.' },
        { id: 'd', text: 'Nothing unusual -- rivers drop sediment fastest exactly where they are moving fastest, so the fan-shaped land is simply where the river happened to be moving quickest.' },
      ],
      expectedAnswer:
        'A delta, because the river lost the fast-moving push it needs to keep carrying sand and mud once it spread out into the bay\'s calm, still water.',
      hints: [
        'Think about what a river needs in order to keep carrying sand and mud: speed. What happens to that speed the instant the river spreads out into a wide, calm bay?',
        'Deposition happens where moving water slows down, not where it speeds up. Rule out any answer that has the river dropping sediment because it was moving fast.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-canyon-cut-by-erosion',
      kind: 'try_yourself',
      problem:
        'For an extremely long stretch of time, a river has kept cutting straight down through solid rock, carrying away the loosened rock as it goes, until the land there now sits thousands of feet below the rock layers on either side. What is this landform called, and which process is mainly responsible for cutting it that deep?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A delta, built up by deposition as the river dropped sediment on top of the land, raising it well above the surrounding rock layers instead of below them.' },
        { id: 'b', text: 'A canyon, cut mainly by erosion carrying away the loose rock that weathering keeps freeing from the riverbed and walls, deepening the valley over an extremely long stretch of time.', correct: true },
        { id: 'c', text: 'A floodplain, built when the river repeatedly overflowed its banks and buried the surrounding land under new layers of mud instead of cutting down into it.' },
        { id: 'd', text: 'A canyon, cut mainly because the moving water dissolves the solid rock the way rainwater dissolves limestone, without needing to physically carry any of the rock away.' },
      ],
      expectedAnswer:
        'A canyon, cut mainly by erosion carrying away the loose rock that weathering keeps freeing from the riverbed and walls, deepening the valley over an extremely long stretch of time.',
      hints: [
        'Compare the land described in the question with a delta or a floodplain: is the land here built UP above the surrounding rock, or cut DOWN below it? That comparison rules out two of the choices right away.',
        'Weathering loosens rock from the canyon\'s walls and floor, but something else still has to carry that loosened rock away for the canyon to keep getting deeper. Which process does the carrying?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-erosion-and-fastest-water',
      kind: 'misconception_check',
      question:
        'A student explains a muddy river after a storm this way: "The rushing water erodes the rocks into mud in the first place, and then it drops that mud wherever it happens to be flowing fastest." Two separate things are wrong here. What are they?',
      commonErrors: [
        {
          answer: 'The rushing water erodes the rocks into mud in the first place.',
          misconception:
            'Using "erosion" as a catch-all word for the rock breaking apart, because in everyday speech people often say water erodes rock to mean any kind of wearing down, not just the carrying step.',
          correctsTo:
            'Weathering is the process that breaks rock apart into loose sediment, whether by mechanical force (fast water grinding rock against rock, or water freezing and expanding in a crack) or by chemical change (rainwater dissolving part of a rock such as limestone). Erosion is a separate, later process: it carries sediment that weathering has already loosened. Rushing water can do both jobs, but they are not the same job -- the rock has to be broken apart before erosion has anything loose to carry.',
        },
        {
          answer: 'It drops that mud wherever it happens to be flowing fastest.',
          misconception:
            'Assuming that faster-moving, more powerful water is also the water most likely to let go of what it is carrying, because fast water feels like the more dramatic, active part of the process.',
          correctsTo:
            'Moving water deposits sediment exactly where it SLOWS DOWN, not where it speeds up. Fast water has the power to keep sediment suspended and moving; only once the water loses speed -- spreading out over flat land during a flood, or emptying into the calm water of a lake, bay, or ocean -- does it lose the power to keep carrying its load, and drop it. That is why deltas and floodplains form at exactly those slow, spread-out places, never where a river is rushing fastest.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Weathering breaks rock apart where it sits; erosion carries the loosened sediment away; deposition drops it somewhere else -- three different jobs, not one.',
        'Mechanical weathering breaks rock into smaller pieces of the same material (ice wedging a crack wider, or fast water grinding rock against rock). Chemical weathering changes what the rock is made of (rainwater dissolving part of a rock such as limestone).',
        'Moving water can carry larger, heavier pieces of sediment only while it keeps moving fast; slower water can only carry small, light pieces.',
        'Deposition happens wherever moving water slows down, never where it is moving fastest. Heaviest sediment drops first; lighter sediment travels farther before settling.',
        'A delta is new land built where a river slows abruptly on meeting a larger, calmer body of water and drops its sediment (for example, where the Mississippi River meets the Gulf of Mexico).',
        'A floodplain is the flat land beside a river that gets a new layer of sediment each time the river overflows its banks, spreads out, and slows down (for example, the Nile River\'s floodplain).',
        'A canyon forms the opposite way -- erosion keeps carrying away the sediment that weathering loosens from a riverbed and walls, cutting the land down deeper over an extremely long stretch of time (for example, the Grand Canyon, cut by the Colorado River).',
        'A canyon and a delta come from the very same three processes; a canyon is what erosion leaves behind, and a delta is what erosion carried away and deposition dropped somewhere else.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.4', cedTitle: 'Weathering, Erosion & Deposition by Water' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
