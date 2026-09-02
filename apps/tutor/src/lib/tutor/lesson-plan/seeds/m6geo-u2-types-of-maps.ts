/**
 * Grade 6 World Geography — Reading & Using Maps: Types of Maps.
 *
 * PROCEDURE-LED row for the m6geo fan-out (National Geography Standard 1).
 * The student has a repeatable decision to run, not a single mental model:
 * look at what a map's legend actually lists, then match that list to one of
 * three purposes. The scope line asks for the harder version of this skill on
 * purpose -- choosing correctly among all three kinds rather than recognizing
 * one by its name alone -- so every worked example and try_yourself item below
 * gives a legend or a need in words and asks which of the three kinds fits,
 * never "define a political map" in isolation.
 *
 * SCOPE GUARD: this row distinguishes a political map, a physical map, and a
 * thematic map by what each one's legend is built to show, and requires
 * choosing correctly among all three from a described legend or a described
 * need, not from recognizing one type by its name alone. It names no map
 * projection anywhere -- Mercator, equal-area, and compromise projections, and
 * choosing among them by purpose, are Grade 7
 * (`m7geo-u1-maps-globes-and-projections.ts`) and never appear here. Sideways,
 * this row uses the word legend without re-teaching it: naming and defining
 * the title, legend, compass rose, and scale bar belongs to Grade 6 row 2.1
 * (`parts-of-a-map`), and the seven continents and the ocean basins by name
 * belong to Grade 6 row 2.3 (`continents-and-oceans`); neither is repeated
 * here. Two things ARE deliberately allowed, because a neighboring row and a
 * later row both sit close: (a) naming elevation as the one thing a physical
 * map's colors stand for, without comparing the elevation of two real places,
 * which is Grade 6 row 4.4 (`reading-elevation-and-relief`); and (b)
 * describing what a thematic map's legend lists in general, without reading
 * one specific thematic map's key to answer a data question, which is Grade 6
 * row 7.3 (`reading-a-thematic-map`) and stays out of this file.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every item below is answered by
 * CLASSIFY -- given a legend or a need, decide which of three named kinds it
 * is. Nothing here asks why a mapmaker's projection distorts shape or area,
 * and nothing here asks the student to pick a projection for a purpose. If a
 * sentence you write for your own row would sit comfortably in the Grade 7
 * file on the same subject, it is over the ceiling.
 *
 * THE STUDENT CANNOT SEE A MAP. Every legend in this file is a plain list of
 * what a color or symbol stands for, printed inside the item itself.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67
 * percent of the time, and 94 percent at difficulty 4; chance with four
 * choices is 25 percent). Every distractor below states a full wrong reason
 * rather than a short wrong label, and no key was built to be the longest
 * choice BECAUSE it is the key -- see the character counts in the report.
 * Zero is NOT the target; a course-wide zero is the same tell inverted. The
 * three keys sit at ids c, b and d, which is the id set `(2 + 2) mod 4 = 0`
 * requires, omitting a.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U2_TYPES_OF_MAPS: LessonPlan = {
  id: 'evelyn.ms.m6geo.types-of-maps.v1',
  title: 'Types of Maps',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.types-of-maps',
      standard: 'M6GEO-2.2',
      description:
        'Distinguish a political map, a physical map, and a thematic map by what each is designed to show, choosing correctly among all three rather than recognizing one by name alone (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).',
    },
  ],
  prerequisites: ['m6geo.parts-of-a-map'],
  followUps: ['m6geo.continents-and-oceans'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that the same trip can be shown on completely different maps, each built for a different job.',
      script:
        'Picture a phone map app open during a long car trip. Tap one button and the screen shows town names, road names, and a line around every state. Tap another button and the whole screen changes color, green in the low flat places and brown up in the mountains, with a squiggly blue line for every river. Tap a third button and the screen turns into patches of color showing how much rain fell in each area last month. Same trip. Same phone. Three completely different maps, because each one was built to answer a different question. Today you learn to tell those three kinds apart just by looking at what each one is built to show -- and to pick the right one for a question before you even look at the map itself.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-three-kinds-of-maps',
      kind: 'concept',
      goal: "Install what each of the three map types is built to show and the habit of choosing by what a legend lists rather than by a map's name.",
      keyIdeas: [
        'EVERY MAP IS BUILT AROUND ONE MAIN JOB. A map cannot show everything about a place at once without turning into a confusing mess, so a mapmaker picks one main purpose and builds the legend around it. Telling the three main kinds apart means learning what each one\'s legend is built to show.',
        'A POLITICAL MAP SHOWS HUMAN-MADE BOUNDARIES AND PLACE NAMES. Its legend lists things such as country borders, state or province borders, a capital city marked with a special symbol such as a star inside a circle, and other city names. Different countries are often filled in with different flat colors, but those colors are only there to tell one country from its neighbor -- they do not stand for anything about the land itself.',
        "A PHYSICAL MAP SHOWS THE NATURAL SHAPE OF THE LAND. Its legend lists colors that stand for elevation -- how high a point on the land sits -- with one color such as green for low flat land and another such as brown for mountains, plus symbols for rivers, lakes, and mountain peaks. A physical map's colors are doing a completely different job than a political map's colors: one shows height, the other only tells countries apart.",
        "A THEMATIC MAP SHOWS ONE CHOSEN KIND OF DATA SPREAD ACROSS AN AREA. Its legend lists a single topic -- such as how much rain falls in a year, how many people live in an area, which crop farmers grow, or which language most people speak -- and uses color or symbols to show how that one topic changes from place to place. Rainfall is only one example of a thematic topic, not the definition of one.",
        'THE SAME PLACE CAN APPEAR ON ALL THREE, SHOWING SOMETHING DIFFERENT EACH TIME. A single country can be the subject of a political map, a physical map, and a thematic map, and the three would not look alike, because each one is built around a different legend answering a different question.',
        'CHOOSE BY WHAT THE LEGEND LISTS, NOT BY A NAME YOU REMEMBER. Given a question or a described legend, decide which kind of map fits by asking what information is actually listed: a boundary or a capital city points to political, the height or shape of the land points to physical, and one particular kind of data spread over an area points to thematic.',
      ],
      vocabulary: [
        { term: 'political map', definition: 'a map built to show human-made boundaries, such as country and state borders, along with the names of places and capital cities.' },
        { term: 'physical map', definition: "a map built to show the natural shape of the land, using color to show elevation and symbols for features such as rivers, lakes, and mountains." },
        { term: 'thematic map', definition: 'a map built to show how one chosen kind of information, such as rainfall or population, is spread across an area.' },
        { term: 'elevation', definition: 'how high a point on the land sits, usually described from low to high rather than measured on the spot.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-identify-by-the-legend',
      kind: 'worked_example',
      problem:
        "A map's legend lists these entries: a different flat color for each country, a star inside a circle marking each country's capital city, and thin black lines showing where one country ends and the next one begins. There is no color anywhere on the legend for how high or low the land sits. Which of the three kinds of maps is this, and how do you know?",
      steps: [
        'List what the legend actually contains before guessing a name: a color per country, a capital-city star, and border lines between countries.',
        "Test physical map first. A physical map's legend lists elevation colors and natural features such as rivers and mountains. None of that appears here, so physical map is ruled out.",
        "Test thematic map next. A thematic map's legend lists one chosen kind of data spread across an area, such as rainfall or population. Country colors, a capital marker, and borders are not a spread-out data topic, so thematic map is ruled out too.",
        'Test political map last. Boundaries between countries and a symbol for each capital city are exactly the human-made, place-related information a political map is built to show. Every item in the legend fits.',
        'Check the answer by re-reading the legend one more time, entry by entry, and confirming nothing is left unaccounted for. All three entries -- country colors, capital stars, and borders -- belong to the political-map job, and none of them belongs to the other two.',
      ],
      answer:
        'It is a political map, because its legend lists only boundaries between countries and a symbol for each capital city -- exactly the human-made boundary-and-place information a political map is built to show. Nothing in the legend shows the natural shape of the land or one chosen data topic, so it cannot be physical or thematic.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-color-does-not-decide-it-alone',
      kind: 'worked_example',
      problem:
        'A student looks at a map and says: "This map uses different colors spread across the whole country, so it must be a physical map." The legend actually reads: light yellow for areas that mostly grow wheat, medium green for areas that mostly grow rice, and dark green for areas that mostly grow corn. What is wrong with the student\'s reasoning, and which kind of map is this really?',
      steps: [
        'State the wrong reasoning plainly. WRONG: "any map with different colors spread across it must be a physical map." The mistake is judging the map type from the fact that colors are used at all, instead of asking what those colors stand for.',
        "Test what the colors mean here. A physical map's colors specifically stand for elevation, how high the land sits. This legend's colors stand for which crop is grown, not elevation, so physical map does not fit.",
        'Test thematic map. Which crop is grown in an area is one chosen kind of information spread across an area, which is exactly what a thematic map is built to show. This matches.',
        'CORRECT: "this is a thematic map, because its colors show one chosen topic -- which crop is grown -- not the natural shape of the land."',
        'Check the reasoning with a contrasting case. Imagine the same three colors instead stood for low, medium, and high elevation. The map would then be physical instead, using the exact same colors. That confirms the real rule: it is never the fact that a map uses color that decides its type, only what the color is built to stand for.',
      ],
      answer:
        'It is a thematic map, not a physical map. The student judged the map type by noticing colors at all, instead of asking what the colors stand for. Physical-map colors stand for elevation; this map\'s colors stand for which crop is grown in each area, a single chosen topic spread across an area, which is exactly the job of a thematic map.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-legend-without-a-name',
      kind: 'try_yourself',
      problem:
        "A map's legend lists these entries: light blue for areas that get under 20 inches of snow in a year, medium blue for 20 to 50 inches, and dark blue for more than 50 inches. There are no country borders and no elevation colors anywhere on this legend. Which kind of map is this?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A political map, because different shades of one color are being used here to divide one area of the map from another, the same way a political map\'s country colors work.' },
        { id: 'b', text: 'A physical map, because the colors on this legend are meant to show how high or low the land sits in each area, the same way elevation colors work on a physical map.' },
        { id: 'c', text: 'A thematic map, because the colors show one chosen kind of data -- how much snow falls in a year -- spread across different areas.', correct: true },
        { id: 'd', text: 'A map with no real type at all, because color by itself never proves what any map is actually showing, no matter what the legend says it stands for.' },
      ],
      expectedAnswer: 'A thematic map, because the colors show one chosen kind of data -- how much snow falls in a year -- spread across different areas.',
      hints: [
        'Look at what the legend actually lists, not just the fact that it uses color. Ask what the different shades are built to stand for.',
        'Shading that stands for a border would point to political, and shading that stands for how high the land sits would point to physical. Here the shading stands for a snowfall amount, one chosen topic spread across the map.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-choose-the-right-map-for-the-job',
      kind: 'try_yourself',
      problem:
        'A student wants to compare how mountainous two countries are by looking at a map. Which map would best show that?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A map whose legend lists a capital city marked with a star and thin lines separating each country from its neighbors, the same as any other political map.' },
        { id: 'b', text: 'A map whose legend lists colors for elevation, running from green at low elevation to brown at high elevation, along with symbols for mountain peaks.', correct: true },
        { id: 'c', text: 'A map whose legend lists colors showing how many people live in each square mile of land across the region.' },
        { id: 'd', text: 'A map whose legend lists colors showing the average amount of rain that falls in each region of the country every year.' },
      ],
      expectedAnswer: 'A map whose legend lists colors for elevation, running from green at low elevation to brown at high elevation, along with symbols for mountain peaks.',
      hints: [
        'Ask which map\'s legend would let you compare how high the land rises, not which map sounds the most detailed.',
        'A legend built around capital cities and borders answers a boundary question, and a legend built around population or rainfall answers a people or weather question -- neither one answers a height question.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-match-the-legend-to-the-question',
      kind: 'try_yourself',
      problem:
        "A map's legend lists three colors: light yellow for areas that receive under 10 inches of rain in a year, orange for areas that receive 10 to 30 inches, and dark red for areas that receive more than 30 inches. Which question could this map best answer?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Which country controls a piece of land along a shared border with its neighbor?' },
        { id: 'b', text: 'How high above the surrounding land does a nearby mountain range rise?' },
        { id: 'c', text: 'Which city in the region serves as that country\'s capital?' },
        { id: 'd', text: 'Which part of the region receives the most rain in a year?', correct: true },
      ],
      expectedAnswer: 'Which part of the region receives the most rain in a year?',
      hints: [
        'Match the question to the one topic the legend is actually built around, not to a topic the legend never mentions.',
        'A legend about yearly rainfall amounts cannot answer a question about borders, a capital city, or how high the land rises -- it only carries information about how much rain falls in each area.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-color-alone-and-one-topic-only',
      kind: 'misconception_check',
      question:
        'A student says: "Any map with lots of different colors on it has to be a physical map, since physical maps use color to show mountains and valleys. And a thematic map can only ever be about weather, since that is the example everybody uses." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'Any map with lots of different colors on it has to be a physical map.',
          misconception:
            'Noticing that physical maps use color and assuming that using color at all is the sign of a physical map, instead of asking what the colors are built to stand for.',
          correctsTo:
            'WRONG: "colors alone make a map physical." CORRECT: "what the colors stand for is what decides the type." Elevation colors make a physical map, one chosen data topic\'s colors make a thematic map, and colors used only to tell countries apart make a political map. A thematic map about population, or a political map with a different color for each country, can use just as many colors as a physical map does.',
        },
        {
          answer: 'A thematic map can only ever be about weather.',
          misconception:
            'Overgeneralizing from the one example heard most often -- rainfall or weather -- into thinking that is the only allowed topic for a thematic map.',
          correctsTo:
            'WRONG: "a thematic map only shows weather." CORRECT: "a thematic map can be built around almost any one chosen topic -- population, which crop is grown, which language is spoken, or rainfall are all valid examples. Rainfall is only one example of a thematic topic, never the definition of one."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A political map shows human-made boundaries and place names: country and state borders, capital cities, and other city names. Its colors usually just tell one country from its neighbor.',
        "A physical map shows the natural shape of the land: colors for elevation, from low to high, plus symbols for rivers, lakes, and mountains.",
        'A thematic map shows one chosen kind of data spread across an area, such as rainfall, population, crops grown, or language spoken. Rainfall is only one example, not the definition.',
        'The same place can appear on a political map, a physical map, and a thematic map, and all three can look completely different, because each is built around a different legend.',
        'Choose the right kind of map by reading what its legend actually lists, never by guessing from a name or from the fact that it uses color.',
        'A map using many colors is not automatically physical -- what the colors stand for is what decides the type.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.2', cedTitle: 'Types of Maps' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
