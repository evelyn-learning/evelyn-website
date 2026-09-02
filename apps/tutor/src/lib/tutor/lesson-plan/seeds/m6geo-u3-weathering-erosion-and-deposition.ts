/**
 * Grade 6 World Geography — Earth's Physical Structure: Weathering, Erosion &
 * Deposition.
 *
 * PROCEDURE-LED row for the m6geo fan-out (National Geography Standard 7).
 * The student has a repeatable decision to run, not a single mental model:
 * read a description of an everyday scene and decide which ONE of the three
 * named processes it shows, by running three tests in order (did something
 * break apart where it sat; is an already-loose piece on the move; has a
 * carried piece come to rest somewhere new). The scope line asks for the
 * harder version of this skill on purpose -- choosing among all three rather
 * than reciting one definition in isolation -- so every worked example and
 * try_yourself item below gives a described scene and asks which of the three
 * fits, never "define weathering" on its own.
 *
 * CROSS-COURSE CONSISTENCY: the sibling Grade 6 SCIENCE course covers this
 * same vocabulary twice, at deeper and narrower depths --
 * `m6sci-u3-the-rock-cycle.ts` (weathering/erosion/deposition as three of
 * seven processes that transform one rock TYPE into another) and
 * `m6sci-u7-weathering-erosion-and-deposition-by-water.ts` (the same three
 * processes narrowed to ONE agent, moving water, with the mechanical/chemical
 * weathering split and the landforms -- delta, floodplain, canyon -- that
 * water erosion and deposition build). Both science files use the identical
 * three-part definition: weathering breaks a material apart where it sits;
 * erosion carries the already-loosened piece away; deposition drops it
 * somewhere else. This row restates that same definition on purpose, in the
 * same order, so the two courses never disagree about what the three words
 * mean. What is different is scope, not substance: this row is the GENERAL
 * case -- ANY natural force (wind, moving water, freezing and thawing ice),
 * ANY everyday material (a cracked sidewalk, a wooden post, loose sand,
 * gravel, dust), and the skill of telling the three processes apart from a
 * plain description, choosing among all three rather than recalling one
 * definition alone. The science water lesson is the deep, single-agent case;
 * this lesson is the wide, many-agent case. Neither file classifies a rock
 * type (that is `m6sci-u3-the-three-rock-types.ts` and this course's own row
 * 3.3, `the-rock-cycle`) and neither builds or names a landform.
 *
 * SCOPE GUARD: this row defines weathering, erosion, and deposition in
 * general terms and requires identifying which ONE of the three a described
 * everyday scene shows, choosing correctly among all three rather than
 * reciting a definition in isolation. It never enumerates a closed set of
 * CAUSES the way a mechanism would -- wind, water, and freeze-thaw ice appear
 * only as plain examples of a "natural force," never as an exhaustive typed
 * list, and mechanical versus chemical weathering (a closed two-way split
 * tied to HOW a material changes) never appears anywhere in this file. It
 * never builds or names a landform, and never ties any of the three
 * processes to a real place -- erosion and deposition as landform-*building*
 * mechanisms, tied to real rivers, coastlines, and the settlement-pattern
 * payoff, are Grade 7 (`m7geo-u2-landforms-and-water-features.ts`) and must
 * not appear here. Sideways, classifying a rock as igneous, sedimentary, or
 * metamorphic, and tracing the rock cycle's other four processes (melting,
 * cooling, compaction/cementation, heat and pressure), is this course's own
 * row 3.3 (`the-rock-cycle`) and is not repeated here -- no rock is
 * classified by type anywhere in this file. Two things ARE deliberately
 * allowed, because the neighboring rows sit close and the line has to be
 * drawn precisely rather than avoided: (a) naming freezing water, wind, and
 * moving water as plain examples of forces that can weather, erode, or
 * deposit material, without splitting weathering into a mechanical/chemical
 * typology; and (b) using the word "sediment" for a loose piece of material,
 * without classifying what kind of rock it is or was.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every item below is answered by DEFINE
 * or CLASSIFY -- given a description, decide which of three named processes
 * it shows. Nothing here asks HOW a force mechanically or chemically changes
 * a material, nothing here asks WHY a canyon or a delta forms, and nothing
 * builds a named landform. If a sentence you write for your own row would sit
 * comfortably in the Grade 7 landforms file, or would require the
 * mechanical/chemical weathering split, it is over the ceiling.
 *
 * THE STUDENT CANNOT SEE A MAP OR A DIAGRAM. Every scene in this file is a
 * plain description printed inside the item itself.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67
 * percent of the time, and 94 percent at difficulty 4; chance with four
 * choices is 25 percent). Every distractor below names a full, plausible
 * student reasoning rather than a short wrong label, and no key was built to
 * be the longest choice BECAUSE it is the key -- see the character counts in
 * the report. Zero is NOT the target; a course-wide zero is the same tell
 * inverted. The three keys sit at ids a, c and b, which is the id set
 * `(3 + 4) mod 4 = 3` requires, omitting d.
 *
 * NOTE ON prerequisites/followUps: this row's chain is 3.3 (`the-rock-cycle`)
 * -> 3.4 (this row) -> 4.1 (`major-landform-vocabulary`), per the lesson
 * brief and the fan-out contract's chain table.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U3_WEATHERING_EROSION_AND_DEPOSITION: LessonPlan = {
  id: 'evelyn.ms.m6geo.weathering-erosion-and-deposition.v1',
  title: 'Weathering, Erosion & Deposition',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.weathering-erosion-and-deposition',
      standard: 'M6GEO-3.4',
      description:
        'Define weathering, erosion, and deposition and correctly identify which process is at work in a described everyday example, choosing among all three rather than recalling one definition in isolation (National Geography Standard 7: the physical processes that shape the patterns of Earth\'s surface).',
    },
  ],
  prerequisites: ['m6geo.the-rock-cycle'],
  followUps: ['m6geo.major-landform-vocabulary'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that a single everyday scene often hides three different jobs, and that telling them apart takes more than noticing that something changed.',
      script:
        'Think about a chalk drawing on a driveway. First it just sits there, drying and flaking at the edges after a few sunny days. Then a light rain sends tiny chalk flakes sliding down the driveway in a thin stream of colored water. Then the rain lets up, the water slows down where the driveway meets the grass, and a faint smear of color is left sitting on the grass the next morning. Three things happened, in that order, and they were not the same thing: something broke apart, something got carried, and something got dropped off. Geographers use three different words for those three different jobs, and today you learn to spot which one a story is describing, every time, no matter what is breaking, moving, or settling.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-processes-three-tests',
      kind: 'concept',
      goal: 'Install the three definitions, the fixed order they can happen in, and the one test that identifies each from a plain description.',
      keyIdeas: [
        'THREE PROCESSES, AND THEY CAN ONLY HAPPEN IN ONE ORDER. WEATHERING breaks a material apart right where it already sits. EROSION carries an already-loose piece away, from one place to a different place. DEPOSITION drops a carried piece somewhere new. Nothing can be carried until it has broken loose, and nothing can be dropped in a new spot until it has been carried there -- so the order can only ever run weathering, then erosion, then deposition.',
        'THE TEST FOR WEATHERING: IS SOMETHING BREAKING APART WHERE IT ALREADY WAS? Weathering can be caused by many different things -- freezing water expanding inside a crack, wind carrying gritty dust that wears down a surface, or steady rubbing and drying over time. Whatever the cause, weathering never moves anything anywhere. If the loose piece is still sitting exactly where it broke off, that is weathering and nothing more.',
        'THE TEST FOR EROSION: IS AN ALREADY-LOOSE PIECE ON THE MOVE? Erosion is a natural force -- wind, moving water, or ice -- carrying material that is already broken loose, from one place toward a different place. Erosion never breaks anything apart on its own; it only moves what has already been loosened. If a piece is still traveling and has not yet been dropped anywhere, that is erosion and nothing more.',
        'THE TEST FOR DEPOSITION: HAS A CARRIED PIECE COME TO REST SOMEWHERE NEW? Deposition happens the instant a carrying force slows down or stops and lets go of what it was carrying. If a piece that was moving has now stopped and settled in a new spot, different from where it started, that is deposition.',
        'MOST DESCRIPTIONS SHOW ONLY ONE OF THE THREE AT A TIME. A description might catch a crack getting a little wider in the exact same place (weathering only), a loose piece still moving through the air or down a slope (erosion only), or a moving piece finally settling somewhere (deposition only). Do not assume all three happened just because something in a story is changing -- match the exact words to exactly one of the three tests above. A longer story can show two or even all three, one after another, but only if the words actually describe each step happening.',
        'MANY DIFFERENT FORCES AND MATERIALS CAN GO THROUGH ALL THREE. Wind, moving water, and freezing-and-thawing ice can each weather, erode, or deposit, depending on what they are doing in the story. And many different everyday materials can be weathered, eroded, or deposited -- not just rock, but sand, soil, gravel, dust, and even a crack in a brick or a piece of wood.',
      ],
      vocabulary: [
        { term: 'weathering', definition: 'the breaking apart of a material into smaller loose pieces, in the exact place it already was.' },
        { term: 'erosion', definition: 'the carrying of an already-loose piece of material from one place to a different place.' },
        { term: 'deposition', definition: 'the dropping of a carried piece of material in a new place, once the force carrying it slows down or stops.' },
        { term: 'sediment', definition: 'a loose piece of material -- such as broken rock, sand, soil, or dust -- that has been weathered, is being carried, or has been dropped somewhere new.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-crack-in-the-fence-post',
      kind: 'worked_example',
      problem:
        'A wooden fence post has stood in a garden for many years. Every summer, the hot sun dries the wood and makes a crack in it a little deeper, along the very same line as before. None of the splinters that break loose from the crack ever blow away or wash off anywhere -- every one of them stays wedged right in the crack, in the exact spot where it broke off. Which one of the three processes does this describe, and why do the other two not fit?',
      steps: [
        'Run the test for weathering first: is a solid material breaking apart in the exact place it already was? The wood is cracking a little deeper each summer, in the very same spot on the post, so yes -- something is breaking apart right where it sits.',
        'Run the test for erosion next: is an already-loose piece on the move, being carried from one place to a different place? The problem says the splinters do not blow away or wash off anywhere -- they never travel anywhere at all. Erosion does not fit.',
        'Run the test for deposition last: has a carried piece come to rest in a new spot, different from where it started? The splinters stay wedged in the exact place they broke free -- that is not a new spot, so deposition does not fit either.',
        'Only one test came back true: material breaking apart right where it sits. That is weathering.',
        'Check the answer by rewinding the story. Picture the fence post the summer it was built: the crack did not exist yet. Each summer the same drying-and-cracking step repeats and the crack grows a little, always in that one place. Nothing about that rewound picture involves anything traveling anywhere, which matches weathering and rules out erosion and deposition all over again.',
        'Now test a contrasting case. Suppose the story continued: after a splinter finally breaks free, a heavy rain washes it off the post and carries it down the block into a drainage ditch. That next sentence would add erosion to the story, because a loose piece would finally be traveling. But nothing in the original description says that happens, so only weathering is described here.',
      ],
      answer:
        'Weathering. The wood cracks a little more each summer in the exact spot it already was, and none of the loose splinters ever travel anywhere, so neither erosion (which needs something to be carried) nor deposition (which needs a carried piece to come to rest somewhere new) fits.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-wind-carries-and-drops-the-sand',
      kind: 'worked_example',
      problem:
        'A steady wind blows across the top of a small sand hill, picking up loose grains of sand that are already sitting free on the surface. The wind carries those grains through the air for a long stretch, moving them away from the hill. Farther along, the wind passes a low garden wall and slows down sharply on the other side of it. The sand grains the wind was carrying drop out of the air and pile up against the base of the wall. Identify every process shown in this story, in the order it happens, and explain why weathering is not one of them.',
      steps: [
        'Start at the sand hill. The grains are described as "already sitting free" before the wind ever touches them -- nothing here breaks a solid material apart. WRONG: "the wind picking up sand is weathering, because the sand is being disturbed." CORRECT: "weathering only happens when something solid cracks or breaks apart where it sits; picking up material that is already loose is not weathering, no matter how the material is being disturbed."',
        'Run the test for erosion on the middle of the story. The wind is carrying loose grains through the air, moving them from the hill to a different place. That matches the test for erosion exactly: an already-loose piece on the move.',
        'Run the test for deposition on the end of the story. The wind slows down sharply at the wall, and the grains it was carrying drop out of the air and pile up in a new spot. That matches the test for deposition exactly: a carried piece coming to rest.',
        'Put the story in order: erosion happens first, as the wind carries the loose sand away from the hill, and deposition happens second, as the wind slows and lets the sand go at the wall. No step ever breaks a solid material apart, so weathering never appears in this story at all.',
        'Check the answer by rewinding it. Before the wind reached the wall, the grains were still in the air, still moving -- that is erosion continuing, not deposition yet. Deposition only starts the instant the wind actually slows down.',
        'Now test a contrasting case. Suppose the wall were not there and the wind kept blowing at the same steady speed across a huge flat stretch of ground with nothing to slow it down. Then the sand would keep being carried and would never pile up at all -- deposition would not happen in that version, because nothing ever makes the wind lose its carrying power. Slowing down is the one condition that turns erosion into deposition.',
      ],
      answer:
        'Erosion happens first, as the wind carries the already-loose sand grains away from the hill, and deposition happens second, as the wind slows at the wall and drops the sand in a new pile. Weathering never appears, because the sand was already loose before the story starts -- nothing is described breaking apart.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-crack-in-the-brick-step',
      kind: 'try_yourself',
      problem:
        'A brick step outside a school entrance has a thin crack running across it. Every winter, water seeps into the crack, freezes, and pushes the crack open a little wider than it was the winter before. The small chips that break free from the edges of the crack stay sitting right inside it -- none of them ever fall out, wash away, or end up anywhere else. Which process does this describe?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Weathering, because the freezing water is breaking the brick apart right in the same spot where the crack already was, and none of the loose chips ever travel anywhere else.', correct: true },
        { id: 'b', text: 'Erosion, because the crack has been growing wider and wider for several winters in a row, and any change that keeps happening over many years counts as material being carried from place to place.' },
        { id: 'c', text: 'Deposition, because the loose chips are now resting inside the crack instead of being part of the solid brick, which counts as a piece coming to rest in a new location.' },
        { id: 'd', text: 'All three processes together, because a crack that keeps changing over several winters must eventually involve breaking, carrying, and settling at the same time.' },
      ],
      expectedAnswer:
        'Weathering, because the freezing water is breaking the brick apart right in the same spot where the crack already was, and none of the loose chips ever travel anywhere else.',
      hints: [
        'Ask whether any piece of brick actually traveled away from where it broke off, or whether it is still sitting exactly where it cracked.',
        'Erosion needs something to be carried from one place to another, and deposition needs something to be dropped in a new location -- neither happens if the loose piece never leaves the crack.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-stream-carries-the-gravel',
      kind: 'try_yourself',
      problem:
        'Loose gravel sits at the edge of a fast-moving stream, already broken free from the streambed long ago. The fast stream picks up that loose gravel and carries it tumbling along the streambed, farther and farther downstream. The stream is still flowing fast and the gravel is still tumbling along when the description ends. Which process does this describe?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Weathering, because the tumbling motion is slowly wearing the gravel down into smaller and smaller pieces as it moves along the streambed.' },
        { id: 'b', text: 'Deposition, because the gravel has already left its original spot at the edge of the stream and is now somewhere else by the time the description ends.' },
        { id: 'c', text: 'Erosion, because the fast stream is carrying gravel that was already loose, moving it from one place toward another place, without dropping it yet.', correct: true },
        { id: 'd', text: 'Weathering and deposition together, because gravel that has been tumbling for a long distance must have both broken down and come to rest somewhere along the way.' },
      ],
      expectedAnswer:
        'Erosion, because the fast stream is carrying gravel that was already loose, moving it from one place toward another place, without dropping it yet.',
      hints: [
        'The gravel is described as already broken free before the stream ever touches it. Ask whether anything is breaking apart here, or whether something already loose is simply being carried.',
        'The description says the stream and the gravel are both still moving when it ends -- nothing has slowed down or come to rest yet, so nothing has been dropped in a new place.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-wind-drops-the-dust-by-the-hedge',
      kind: 'try_yourself',
      problem:
        'A gusty wind carries a cloud of fine, dry dust across an open schoolyard. The dust was already loose on the ground before the wind picked it up. When the wind reaches a low, thick hedge at the edge of the yard, it slows down sharply and dies out almost completely. The dust the wind was carrying drops out of the air and settles into a thin layer on the ground right beside the hedge. Which process does this describe?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Erosion, because the wind is still technically present near the hedge, even though it has slowed down, so the dust must still be traveling along with whatever air is left moving.' },
        { id: 'b', text: 'Deposition, because the dust that the slowing wind was carrying has come to rest in a new place, on the ground beside the hedge.', correct: true },
        { id: 'c', text: 'Weathering, because the dust is spreading out into a thinner and thinner layer as it settles, which means it is being broken down into smaller pieces.' },
        { id: 'd', text: 'Erosion and weathering together, because a wind that slows down is still both carrying material and grinding it into finer dust at the very same time.' },
      ],
      expectedAnswer:
        'Deposition, because the dust that the slowing wind was carrying has come to rest in a new place, on the ground beside the hedge.',
      hints: [
        'Ask what happened to the dust once the wind slowed down: did the dust keep traveling, or did it stop moving and stay put in a new spot?',
        'Weathering breaks a material apart where it sits; nothing here describes anything breaking. The dust was already loose before it ever settled.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-erosion-catch-all-and-automatic-bundle',
      kind: 'misconception_check',
      question:
        'A student explains a rockslide behind their house this way: "A boulder cracks apart at the top of a slope and pieces roll downhill -- that whole cracking-and-rolling part is erosion. And once any piece of material starts moving, it always ends up broken into smaller pieces, carried somewhere else, and dropped in a new spot, all in the very same moment." Two separate things are wrong here. What are they?',
      commonErrors: [
        {
          answer: 'That whole cracking-and-rolling part is erosion.',
          misconception:
            'Using "erosion" as a catch-all word for any dramatic breaking-apart or wearing-away, because everyday speech often uses erosion loosely for any kind of destructive change.',
          correctsTo:
            'WRONG: "a boulder cracking apart at the top of a slope is erosion." CORRECT: "a boulder cracking apart right where it sits is weathering, because the breaking happens in the exact place the boulder already was. Erosion is a separate, later process: it only carries a piece that has already broken loose to a different place. A material has to be weathered before there is anything loose for erosion to carry."',
        },
        {
          answer: 'Once a piece of material starts moving, it always ends up broken into smaller pieces, carried somewhere else, and dropped in a new spot, all in the very same moment.',
          misconception:
            'Overgeneralizing the three separate processes into one automatic bundle that always happens together and all at once, instead of checking which single step a description actually shows.',
          correctsTo:
            'Weathering, erosion, and deposition are three separate steps, and a description can show just one of them at a time. A crack widening in place with nothing traveling anywhere shows only weathering. A loose piece still moving through the air or down a slope shows only erosion, with nothing yet dropped anywhere. A moving piece finally coming to rest in a new spot shows only deposition. Check the exact words in a description -- is something breaking apart, still on the move, or already settled -- rather than assuming all three happen automatically together.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Weathering breaks a material apart in the exact place it already was; it never carries anything anywhere.',
        'Erosion carries an already-loose piece from one place to a different place; it never breaks anything apart and has not yet dropped anything -- it is a piece still on the move.',
        'Deposition happens the instant the force carrying a piece slows down or stops and lets it settle in a new spot.',
        'The order can only run one way: weathering has to happen before erosion has anything loose to carry, and erosion has to happen before deposition has anything to drop.',
        'Many different forces -- wind, moving water, and freezing-and-thawing ice -- can weather, erode, or deposit material, and many different everyday materials -- rock, sand, soil, gravel, dust, even a crack in a brick or a piece of wood -- can be weathered, eroded, or deposited.',
        'A description usually shows only one of the three at a time. Check the exact words: is something breaking apart where it sits, already loose and still moving, or already come to rest somewhere new?',
        '"Erosion" is not a catch-all word for any wearing-away or breaking-down -- treating it that way is the most common mistake with these three words.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.4', cedTitle: 'Weathering, Erosion & Deposition' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
