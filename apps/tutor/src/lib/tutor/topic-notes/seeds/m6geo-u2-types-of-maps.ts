/**
 * Grade 6 World Geography — Unit 2 CED 2.2: Types of Maps.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.types-of-maps.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U2_TYPES_OF_MAPS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.types-of-maps.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 2,
  cedTopic: '2.2',
  cedTitle: 'Types of Maps',
  planId: 'evelyn.ms.m6geo.types-of-maps.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.types-of-maps.v1' }],
  theory: [
    { loId: 'm6geo.types-of-maps', content: `EVERY MAP IS BUILT AROUND ONE MAIN JOB. A map cannot show everything about a place at once without turning into a confusing mess, so a mapmaker picks one main purpose and builds the legend around it. Telling the three main kinds apart means learning what each one's legend is built to show.` },
    { loId: 'm6geo.types-of-maps', content: `A POLITICAL MAP SHOWS HUMAN-MADE BOUNDARIES AND PLACE NAMES. Its legend lists things such as country borders, state or province borders, a capital city marked with a special symbol such as a star inside a circle, and other city names. Different countries are often filled in with different flat colors, but those colors are only there to tell one country from its neighbor -- they do not stand for anything about the land itself.` },
    { loId: 'm6geo.types-of-maps', content: `A PHYSICAL MAP SHOWS THE NATURAL SHAPE OF THE LAND. Its legend lists colors that stand for elevation -- how high a point on the land sits -- with one color such as green for low flat land and another such as brown for mountains, plus symbols for rivers, lakes, and mountain peaks. A physical map's colors are doing a completely different job than a political map's colors: one shows height, the other only tells countries apart.` },
    { loId: 'm6geo.types-of-maps', content: `A THEMATIC MAP SHOWS ONE CHOSEN KIND OF DATA SPREAD ACROSS AN AREA. Its legend lists a single topic -- such as how much rain falls in a year, how many people live in an area, which crop farmers grow, or which language most people speak -- and uses color or symbols to show how that one topic changes from place to place. Rainfall is only one example of a thematic topic, not the definition of one.` },
    { loId: 'm6geo.types-of-maps', content: `THE SAME PLACE CAN APPEAR ON ALL THREE, SHOWING SOMETHING DIFFERENT EACH TIME. A single country can be the subject of a political map, a physical map, and a thematic map, and the three would not look alike, because each one is built around a different legend answering a different question.` },
    { loId: 'm6geo.types-of-maps', content: `CHOOSE BY WHAT THE LEGEND LISTS, NOT BY A NAME YOU REMEMBER. Given a question or a described legend, decide which kind of map fits by asking what information is actually listed: a boundary or a capital city points to political, the height or shape of the land points to physical, and one particular kind of data spread over an area points to thematic.` },
    { loId: 'm6geo.types-of-maps', kind: 'definition', title: 'political map', content: `a map built to show human-made boundaries, such as country and state borders, along with the names of places and capital cities.` },
    { loId: 'm6geo.types-of-maps', kind: 'definition', title: 'physical map', content: `a map built to show the natural shape of the land, using color to show elevation and symbols for features such as rivers, lakes, and mountains.` },
    { loId: 'm6geo.types-of-maps', kind: 'definition', title: 'thematic map', content: `a map built to show how one chosen kind of information, such as rainfall or population, is spread across an area.` },
    { loId: 'm6geo.types-of-maps', kind: 'definition', title: 'elevation', content: `how high a point on the land sits, usually described from low to high rather than measured on the spot.` },
  ],
  methods: [
    {
      title: 'Worked identify by the legend',
      steps: [
        `List what the legend actually contains before guessing a name: a color per country, a capital-city star, and border lines between countries.`,
        `Test physical map first. A physical map's legend lists elevation colors and natural features such as rivers and mountains. None of that appears here, so physical map is ruled out.`,
        `Test thematic map next. A thematic map's legend lists one chosen kind of data spread across an area, such as rainfall or population. Country colors, a capital marker, and borders are not a spread-out data topic, so thematic map is ruled out too.`,
        `Test political map last. Boundaries between countries and a symbol for each capital city are exactly the human-made, place-related information a political map is built to show. Every item in the legend fits.`,
        `Check the answer by re-reading the legend one more time, entry by entry, and confirming nothing is left unaccounted for. All three entries -- country colors, capital stars, and borders -- belong to the political-map job, and none of them belongs to the other two.`,
      ],
      example: { problem: `A map's legend lists these entries: a different flat color for each country, a star inside a circle marking each country's capital city, and thin black lines showing where one country ends and the next one begins. There is no color anywhere on the legend for how high or low the land sits. Which of the three kinds of maps is this, and how do you know?`, solution: `It is a political map, because its legend lists only boundaries between countries and a symbol for each capital city -- exactly the human-made boundary-and-place information a political map is built to show. Nothing in the legend shows the natural shape of the land or one chosen data topic, so it cannot be physical or thematic.` },
      relatedLoIds: ['m6geo.types-of-maps'],
    },
    {
      title: 'Worked color does not decide it alone',
      steps: [
        `State the wrong reasoning plainly. WRONG: "any map with different colors spread across it must be a physical map." The mistake is judging the map type from the fact that colors are used at all, instead of asking what those colors stand for.`,
        `Test what the colors mean here. A physical map's colors specifically stand for elevation, how high the land sits. This legend's colors stand for which crop is grown, not elevation, so physical map does not fit.`,
        `Test thematic map. Which crop is grown in an area is one chosen kind of information spread across an area, which is exactly what a thematic map is built to show. This matches.`,
        `CORRECT: "this is a thematic map, because its colors show one chosen topic -- which crop is grown -- not the natural shape of the land."`,
        `Check the reasoning with a contrasting case. Imagine the same three colors instead stood for low, medium, and high elevation. The map would then be physical instead, using the exact same colors. That confirms the real rule: it is never the fact that a map uses color that decides its type, only what the color is built to stand for.`,
      ],
      example: { problem: `A student looks at a map and says: "This map uses different colors spread across the whole country, so it must be a physical map." The legend actually reads: light yellow for areas that mostly grow wheat, medium green for areas that mostly grow rice, and dark green for areas that mostly grow corn. What is wrong with the student's reasoning, and which kind of map is this really?`, solution: `It is a thematic map, not a physical map. The student judged the map type by noticing colors at all, instead of asking what the colors stand for. Physical-map colors stand for elevation; this map's colors stand for which crop is grown in each area, a single chosen topic spread across an area, which is exactly the job of a thematic map.` },
      relatedLoIds: ['m6geo.types-of-maps'],
    },
  ],
  pointers: [
    { content: `Students often say "Any map with lots of different colors on it has to be a physical map." — WRONG: "colors alone make a map physical." CORRECT: "what the colors stand for is what decides the type." Elevation colors make a physical map, one chosen data topic's colors make a thematic map, and colors used only to tell countries apart make a political map. A thematic map about population, or a political map with a different color for each country, can use just as many colors as a physical map does.`, kind: 'common-error' },
    { content: `Students often say "A thematic map can only ever be about weather." — WRONG: "a thematic map only shows weather." CORRECT: "a thematic map can be built around almost any one chosen topic -- population, which crop is grown, which language is spoken, or rainfall are all valid examples. Rainfall is only one example of a thematic topic, never the definition of one."`, kind: 'common-error' },
    { content: `A political map shows human-made boundaries and place names: country and state borders, capital cities, and other city names. Its colors usually just tell one country from its neighbor.`, kind: 'tip' },
    { content: `A physical map shows the natural shape of the land: colors for elevation, from low to high, plus symbols for rivers, lakes, and mountains.`, kind: 'tip' },
    { content: `A thematic map shows one chosen kind of data spread across an area, such as rainfall, population, crops grown, or language spoken. Rainfall is only one example, not the definition.`, kind: 'tip' },
    { content: `The same place can appear on a political map, a physical map, and a thematic map, and all three can look completely different, because each is built around a different legend.`, kind: 'tip' },
    { content: `Choose the right kind of map by reading what its legend actually lists, never by guessing from a name or from the fact that it uses color.`, kind: 'tip' },
    { content: `A map using many colors is not automatically physical -- what the colors stand for is what decides the type.`, kind: 'tip' },
  ],
};
