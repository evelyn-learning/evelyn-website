/**
 * Grade 6 World Geography — Unit 7 CED 7.3: Reading a Thematic Map.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m6geo.reading-a-thematic-map.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M6GEO_U7_READING_A_THEMATIC_MAP: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m6geo.reading-a-thematic-map.v1',
  course: 'Grade 6 World Geography',
  cedUnit: 7,
  cedTopic: '7.3',
  cedTitle: 'Reading a Thematic Map',
  planId: 'evelyn.ms.m6geo.reading-a-thematic-map.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-09-03',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m6geo.reading-a-thematic-map.v1' }],
  theory: [
    { loId: 'm6geo.reading-a-thematic-map', content: `READ EVERY ENTRY IN THE KEY BEFORE READING THE MAP. A thematic map is built around one chosen topic, and its key is the printed list stating exactly what each color or symbol used on that map stands for. Before matching any single area, read the whole key from top to bottom, so every color or symbol already has a known meaning by the time you look for one on the map.` },
    { loId: 'm6geo.reading-a-thematic-map', content: `A KEY CAN BE A SHADED RANGE OR A SET OF SEPARATE SYMBOLS. A SHADED KEY uses different shades of one color, from light to dark, to stand for a range of amounts, such as low, medium, and high. A SYMBOL KEY uses a different picture or mark for each separate category, such as a wheat symbol for farming and a fish symbol for fishing, with no ranking implied between one symbol and another. Both kinds of key are read the same way: match, then look up the meaning.` },
    { loId: 'm6geo.reading-a-thematic-map', content: `THE ROUTINE: FIND THE AREA, MATCH ITS COLOR OR SYMBOL, THEN LOOK IT UP IN THE KEY. To answer a question about one named area, find that area in the description, note exactly which color or symbol it is listed as, find that same color or symbol listed in the key, and read off what the key says it means. To compare two or more areas, repeat the match-and-look-up step separately for each area first, and only then compare what the key says about each one.` },
    { loId: 'm6geo.reading-a-thematic-map', content: `A COLOR OR SYMBOL MEANS WHATEVER THAT MAP'S OWN KEY SAYS, AND NOTHING ELSE. In a shaded key, a darker shade stands for a bigger amount only because that map's key says so -- a different map's key could just as easily use dark for a small amount instead. In a symbol key, no symbol is naturally bigger or more important than another; each one is simply a different, separate category. A color or symbol read without checking its own map's key tells you nothing at all.` },
    { loId: 'm6geo.reading-a-thematic-map', content: `ONE MAP, ONE TOPIC, SO THE KEY ANSWERS QUESTIONS ABOUT THAT ONE TOPIC ONLY. Because a thematic map is built around a single chosen topic, its key can only answer a question about that same topic. A key built to show rainfall cannot tell you which area grows the most farmland, because farmland was never the topic that key was built to show.` },
    { loId: 'm6geo.reading-a-thematic-map', kind: 'definition', title: 'key', content: `the printed list on a thematic map stating exactly what each color or symbol used on that map stands for.` },
    { loId: 'm6geo.reading-a-thematic-map', kind: 'definition', title: 'shaded key', content: `a key that uses different shades of one color, from light to dark, to stand for a range of amounts such as low, medium, and high.` },
    { loId: 'm6geo.reading-a-thematic-map', kind: 'definition', title: 'symbol key', content: `a key that uses a separate picture or mark for each category shown, with no ranking implied between one symbol and another.` },
    { loId: 'm6geo.reading-a-thematic-map', kind: 'definition', title: 'category', content: `one named group listed inside a key, such as low, medium, or high, or a named type such as farming or fishing.` },
    { loId: 'm6geo.reading-a-thematic-map', kind: 'definition', title: 'data', content: `the specific facts a thematic map shows: one category or amount for each area on the map.` },
  ],
  methods: [
    {
      title: 'Worked shaded key match',
      steps: [
        `Read every entry in the key first, before looking at a single region: light yellow means low, medium orange means medium, and dark red means high.`,
        `Find the exact shade the question is asking about. The question asks for high population density, and the key states that dark red is the shade that means high.`,
        `Now scan the four named regions and note only their listed shade: North Verdalen is dark red, South Verdalen is light yellow, East Verdalen is medium orange, and West Verdalen is dark red.`,
        `Match each region's shade back to the key. North Verdalen and West Verdalen are both listed as dark red, so both match the key's entry for high population density. South Verdalen is light yellow, which the key lists as low, and East Verdalen is medium orange, which the key lists as medium, so neither one matches the question asked.`,
        `Check the answer by rewinding through the key one more time, entry by entry: dark red is high, and only North Verdalen and West Verdalen are listed as dark red. Nothing was skipped and nothing was added.`,
        `Now test a contrasting case, to be sure the routine depends on the key and not on which color looks the most striking. If the question had instead asked for medium population density, the answer would change completely: only East Verdalen is listed as medium orange, so East Verdalen alone would be the answer. The same four regions, the same map, a different key entry asked about, a different answer.`,
      ],
      example: { problem: `A thematic map of the invented country of Verdalen shows population density using three shades. Key: light yellow means low population density, medium orange means medium population density, and dark red means high population density. On the map, North Verdalen is shaded dark red, South Verdalen is shaded light yellow, East Verdalen is shaded medium orange, and West Verdalen is shaded dark red. According to the key, which region or regions of Verdalen have high population density?`, solution: `North Verdalen and West Verdalen, because the key states that dark red means high population density, and both regions are listed as dark red. South Verdalen is light yellow, which the key lists as low, and East Verdalen is medium orange, which the key lists as medium, so neither matches the question asked.` },
      relatedLoIds: ['m6geo.reading-a-thematic-map'],
    },
    {
      title: 'Worked symbol key not size',
      steps: [
        `State the wrong reasoning plainly. WRONG: "the biggest or boldest-looking symbol on the map means the biggest amount of something." This is a symbol key, and a symbol key lists separate categories, not a ranked amount, so no symbol is naturally more important than another one just because it looks bigger or bolder.`,
        `Read every entry in the key first: a wheat symbol means farming, a fish symbol means fishing, and a gear symbol means manufacturing. None of the three entries says anything about size, boldness, or amount.`,
        `Find Oakbend's listed symbol in the description: a gear symbol.`,
        `Match that symbol back to the key. A gear symbol means manufacturing is the main activity.`,
        `CORRECT: "Oakbend's main activity is manufacturing, according to the key -- not farming, and the size or boldness of a symbol says nothing about the amount of anything in a key like this one."`,
        `Test a contrasting case to check the routine, not just this one answer. Redfield and Millhaven are both marked with a wheat symbol. Since the key states that wheat means farming, both regions have farming as their main activity, even though they sit in separate parts of the map -- the very same symbol always means the very same thing everywhere it appears in that map's key.`,
      ],
      example: { problem: `A thematic map of the invented country of Marrowick shows each region's main economic activity using a symbol instead of a color. Key: a wheat symbol means farming is the main activity, a fish symbol means fishing is the main activity, and a gear symbol means manufacturing is the main activity. On the map, Northshore is marked with a fish symbol, Redfield is marked with a wheat symbol, Oakbend is marked with a gear symbol, and Millhaven is marked with a wheat symbol. A student says, "Oakbend must have the most farming, because the gear symbol looks the biggest and boldest on the map, so it must mean the biggest activity." Explain what is wrong with the student's reasoning, and state Oakbend's actual main activity according to the key.`, solution: `Oakbend's main activity is manufacturing, because the key states that a gear symbol means manufacturing. The size or boldness of a symbol means nothing in a symbol key like this one -- only the key's stated meaning does.` },
      relatedLoIds: ['m6geo.reading-a-thematic-map'],
    },
  ],
  pointers: [
    { content: `Students often say "A darker color on any thematic map always means a bigger amount of whatever the map is showing." — WRONG: "a darker shade always means a bigger amount, on every thematic map." CORRECT: "a shade means whatever that specific map's own key says it means, and only that." One map's key might use dark red for high population density, while a different map's key could just as easily use dark green for low rainfall instead. The key decides the meaning every time -- the shade by itself decides nothing.`, kind: 'common-error' },
    { content: `Students often say "Two regions marked with different symbols must still belong to the same category, since they are both symbols instead of colors." — A symbol key lists a separate category for each different symbol -- a wheat symbol and a cotton symbol stand for two different things, farming and cotton growing for example, in the same way that two different shades of blue can stand for two different rainfall amounts. Two regions match each other only when they are marked with the exact same symbol, never merely because both regions happen to use some symbol rather than a plain color.`, kind: 'common-error' },
    { content: `Before matching any single area, read every entry in the key first, so each color or symbol already has a known meaning.`, kind: 'tip' },
    { content: `A key can be a shaded range of one color, where a darker or lighter shade stands for a bigger or smaller amount, or a set of separate symbols, where each symbol stands for its own category rather than an amount.`, kind: 'tip' },
    { content: `To answer a question about one area: find that area, note its exact color or symbol, match it to the same color or symbol in the key, then read off what the key says it means.`, kind: 'tip' },
    { content: `To compare two or more areas, match each one to the key separately first, then compare what the key says about each -- never compare colors or symbols directly without checking the key.`, kind: 'tip' },
    { content: `A color or symbol means whatever that map's own key says it means, and nothing else. A different map's key can use the very same color or symbol for a completely different meaning.`, kind: 'tip' },
    { content: `A thematic map's key only answers questions about the one topic it was built to show; it cannot answer a question about a different topic that map never displayed.`, kind: 'tip' },
  ],
};
