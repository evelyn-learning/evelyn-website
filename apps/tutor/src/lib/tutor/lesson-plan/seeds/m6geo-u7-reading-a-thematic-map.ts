/**
 * Grade 6 World Geography — Geographic Technology & Data Skills: Reading a
 * Thematic Map.
 *
 * PROCEDURE-LED row for the m6geo fan-out (National Geography Standard 1).
 * The student has a repeatable routine to run, not a mental model to build:
 * read every entry in a thematic map's key first, find the one area a
 * question asks about, match that area's color or symbol to the key, then
 * read off what the key says it means. Comparing two or more areas repeats
 * that match-and-look-up step separately for each one before comparing what
 * the key says, never comparing colors or symbols directly.
 *
 * SCOPE GUARD: this row takes as already known that a thematic map exists and
 * uses color or symbols to show one chosen topic -- that is Grade 6 row 2.2
 * (`types-of-maps.ts`), whose own SCOPE GUARD already reserves this exact
 * skill for this file: "describing what a thematic map's legend lists in
 * general, without reading one specific thematic map's key to answer a data
 * question, which is Grade 6 row 7.3." This row is that reserved skill: given
 * one specific thematic map's key and a specific described map, answer a
 * question about the data it shows. It does not re-teach what a thematic map
 * is, does not re-teach the word legend (row 2.1, `parts-of-a-map`, owns
 * that), and never asks the student to choose among political, physical, and
 * thematic maps.
 *   Unit 7 (Geographic Technology & Data Skills) has no Grade 7 counterpart
 * anywhere in the shipped `m7geo-*` course -- the fan-out contract's own
 * progression rationale states this is genuinely new ground, so there is no
 * Grade 7 file to run the fifth depth-ceiling test against. The boundary this
 * row actually has to hold is sideways, against its own next-door neighbor:
 * row 7.4 (`reading-geographic-graphs-and-charts`) owns reading a bar graph, a
 * pie chart, or a table of numbers and answering a comparison question built
 * from them. This row never prints a bar graph, a pie chart, or a data table,
 * never asks the student to add, average, or rank more than the categories a
 * key itself lists, and never uses a numeric response format -- every
 * question here is answered by finding a match in a key, not by computing a
 * statistic. What IS deliberately allowed, because the two skills sit close:
 * a key's categories are sometimes plainly ordered (a shaded key running
 * light to dark for low to high), and reading that order to answer "which
 * area has the higher category" is this row's job, stopping the instant any
 * actual arithmetic, total, or average would be needed -- that next step is
 * row 7.4's.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every item below is answered by
 * IDENTIFY or LOCATE -- find the named area, find its listed color or symbol,
 * find that same color or symbol in the key, read off the one thing the key
 * says it means. Nothing here explains why a mapmaker chose one color over
 * another, and nothing here builds a named, closed typology of thematic-map
 * styles -- "shaded key" and "symbol key" below are simply the two techniques
 * named in this row's own scope line ("uses color or symbols"), described
 * only well enough to run the same reading routine on either one, never as an
 * official classification system with rules of its own.
 *
 * THE INVENTED-PLACE DEFAULT, TAKEN ALL THE WAY: every country, region, and
 * data value in this file is invented for this lesson. None of it is a
 * checkable claim about the real world -- the skill being tested is reading a
 * key, and an invented map tests that skill exactly as well as a real one
 * while carrying zero risk of a stale or wrong fact. No real country, region,
 * city, or geographic feature is named anywhere in this file.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67
 * percent of the time, and 94 percent at difficulty 4; chance with four
 * choices is 25 percent). Every distractor below states a full wrong reason
 * rather than a short wrong label, and no key choice was built to be the
 * longest choice BECAUSE it is the key -- see the character counts in the
 * report. Zero is NOT the target; a course-wide zero is the same tell
 * inverted. The three correct choices sit at ids a, d, and b in that item
 * order -- the id set `(7 + 3) mod 4 = 2` requires, omitting c.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every color, symbol, and
 * key entry in this file is written out in words precise enough to reason
 * from, and every item is solvable entirely from the text printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U7_READING_A_THEMATIC_MAP: LessonPlan = {
  id: 'evelyn.ms.m6geo.reading-a-thematic-map.v1',
  title: 'Reading a Thematic Map',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.reading-a-thematic-map',
      standard: 'M6GEO-7.3',
      description:
        "Read a described thematic map that uses color or symbols to show one kind of information and use its key to answer a question about the data shown (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).",
    },
  ],
  prerequisites: ['m6geo.how-gps-finds-your-location'],
  followUps: ['m6geo.reading-geographic-graphs-and-charts'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make finding and reading the printed key feel like the whole job, before any vocabulary arrives.',
      script:
        'Picture a family trip to a theme park. The app on your phone shows a map of the whole park, and every area is shaded a different color: green for a short wait, yellow for a medium wait, and red for a long wait. You do not walk all the way across the park to find out which line is worst. You find your area on the map, check its color, and look up what that color means in a little box printed at the bottom of the screen. That box is doing all the real work, and it is called a key. Today you learn exactly how to read a key like that on any map that uses color or symbols to show one kind of information, and how to use it to answer a real question about the data the map is showing.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reading-the-key',
      kind: 'concept',
      goal: 'Install the read-the-key-first habit and the fixed routine for matching an area to a key entry, for both a shaded key and a symbol key.',
      keyIdeas: [
        "READ EVERY ENTRY IN THE KEY BEFORE READING THE MAP. A thematic map is built around one chosen topic, and its key is the printed list stating exactly what each color or symbol used on that map stands for. Before matching any single area, read the whole key from top to bottom, so every color or symbol already has a known meaning by the time you look for one on the map.",
        "A KEY CAN BE A SHADED RANGE OR A SET OF SEPARATE SYMBOLS. A SHADED KEY uses different shades of one color, from light to dark, to stand for a range of amounts, such as low, medium, and high. A SYMBOL KEY uses a different picture or mark for each separate category, such as a wheat symbol for farming and a fish symbol for fishing, with no ranking implied between one symbol and another. Both kinds of key are read the same way: match, then look up the meaning.",
        "THE ROUTINE: FIND THE AREA, MATCH ITS COLOR OR SYMBOL, THEN LOOK IT UP IN THE KEY. To answer a question about one named area, find that area in the description, note exactly which color or symbol it is listed as, find that same color or symbol listed in the key, and read off what the key says it means. To compare two or more areas, repeat the match-and-look-up step separately for each area first, and only then compare what the key says about each one.",
        "A COLOR OR SYMBOL MEANS WHATEVER THAT MAP'S OWN KEY SAYS, AND NOTHING ELSE. In a shaded key, a darker shade stands for a bigger amount only because that map's key says so -- a different map's key could just as easily use dark for a small amount instead. In a symbol key, no symbol is naturally bigger or more important than another; each one is simply a different, separate category. A color or symbol read without checking its own map's key tells you nothing at all.",
        "ONE MAP, ONE TOPIC, SO THE KEY ANSWERS QUESTIONS ABOUT THAT ONE TOPIC ONLY. Because a thematic map is built around a single chosen topic, its key can only answer a question about that same topic. A key built to show rainfall cannot tell you which area grows the most farmland, because farmland was never the topic that key was built to show.",
      ],
      vocabulary: [
        { term: 'key', definition: "the printed list on a thematic map stating exactly what each color or symbol used on that map stands for." },
        { term: 'shaded key', definition: "a key that uses different shades of one color, from light to dark, to stand for a range of amounts such as low, medium, and high." },
        { term: 'symbol key', definition: "a key that uses a separate picture or mark for each category shown, with no ranking implied between one symbol and another." },
        { term: 'category', definition: "one named group listed inside a key, such as low, medium, or high, or a named type such as farming or fishing." },
        { term: 'data', definition: "the specific facts a thematic map shows: one category or amount for each area on the map." },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-shaded-key-match',
      kind: 'worked_example',
      problem:
        "A thematic map of the invented country of Verdalen shows population density using three shades. Key: light yellow means low population density, medium orange means medium population density, and dark red means high population density. On the map, North Verdalen is shaded dark red, South Verdalen is shaded light yellow, East Verdalen is shaded medium orange, and West Verdalen is shaded dark red. According to the key, which region or regions of Verdalen have high population density?",
      steps: [
        "Read every entry in the key first, before looking at a single region: light yellow means low, medium orange means medium, and dark red means high.",
        "Find the exact shade the question is asking about. The question asks for high population density, and the key states that dark red is the shade that means high.",
        "Now scan the four named regions and note only their listed shade: North Verdalen is dark red, South Verdalen is light yellow, East Verdalen is medium orange, and West Verdalen is dark red.",
        "Match each region's shade back to the key. North Verdalen and West Verdalen are both listed as dark red, so both match the key's entry for high population density. South Verdalen is light yellow, which the key lists as low, and East Verdalen is medium orange, which the key lists as medium, so neither one matches the question asked.",
        "Check the answer by rewinding through the key one more time, entry by entry: dark red is high, and only North Verdalen and West Verdalen are listed as dark red. Nothing was skipped and nothing was added.",
        "Now test a contrasting case, to be sure the routine depends on the key and not on which color looks the most striking. If the question had instead asked for medium population density, the answer would change completely: only East Verdalen is listed as medium orange, so East Verdalen alone would be the answer. The same four regions, the same map, a different key entry asked about, a different answer.",
      ],
      answer:
        "North Verdalen and West Verdalen, because the key states that dark red means high population density, and both regions are listed as dark red. South Verdalen is light yellow, which the key lists as low, and East Verdalen is medium orange, which the key lists as medium, so neither matches the question asked.",
      estimatedMinutes: 3,
    },
    {
      id: 'worked-symbol-key-not-size',
      kind: 'worked_example',
      problem:
        "A thematic map of the invented country of Marrowick shows each region's main economic activity using a symbol instead of a color. Key: a wheat symbol means farming is the main activity, a fish symbol means fishing is the main activity, and a gear symbol means manufacturing is the main activity. On the map, Northshore is marked with a fish symbol, Redfield is marked with a wheat symbol, Oakbend is marked with a gear symbol, and Millhaven is marked with a wheat symbol. A student says, \"Oakbend must have the most farming, because the gear symbol looks the biggest and boldest on the map, so it must mean the biggest activity.\" Explain what is wrong with the student's reasoning, and state Oakbend's actual main activity according to the key.",
      steps: [
        "State the wrong reasoning plainly. WRONG: \"the biggest or boldest-looking symbol on the map means the biggest amount of something.\" This is a symbol key, and a symbol key lists separate categories, not a ranked amount, so no symbol is naturally more important than another one just because it looks bigger or bolder.",
        "Read every entry in the key first: a wheat symbol means farming, a fish symbol means fishing, and a gear symbol means manufacturing. None of the three entries says anything about size, boldness, or amount.",
        "Find Oakbend's listed symbol in the description: a gear symbol.",
        "Match that symbol back to the key. A gear symbol means manufacturing is the main activity.",
        "CORRECT: \"Oakbend's main activity is manufacturing, according to the key -- not farming, and the size or boldness of a symbol says nothing about the amount of anything in a key like this one.\"",
        "Test a contrasting case to check the routine, not just this one answer. Redfield and Millhaven are both marked with a wheat symbol. Since the key states that wheat means farming, both regions have farming as their main activity, even though they sit in separate parts of the map -- the very same symbol always means the very same thing everywhere it appears in that map's key.",
      ],
      answer:
        "Oakbend's main activity is manufacturing, because the key states that a gear symbol means manufacturing. The size or boldness of a symbol means nothing in a symbol key like this one -- only the key's stated meaning does.",
      estimatedMinutes: 3,
    },
    {
      id: 'try-shaded-key-comparison',
      kind: 'try_yourself',
      problem:
        "A thematic map of the invented country of Bellmere shows average yearly rainfall using three shades of blue. Key: light blue means low rainfall, medium blue means medium rainfall, and dark blue means high rainfall. On the map, Ashford is shaded dark blue, Brindle is shaded light blue, Corwin is shaded medium blue, and Dunmore is shaded dark blue. Which statement is true according to the key?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Ashford and Dunmore are both in the high rainfall category, because the key lists dark blue as high rainfall and both regions are shaded dark blue.', correct: true },
        { id: 'b', text: 'Brindle has more rainfall than Corwin, because light blue looks like a brighter and more eye-catching color than the duller shade of medium blue.' },
        { id: 'c', text: 'Corwin and Dunmore are in the same rainfall category, because both regions happen to be shaded some shade of blue instead of some other color entirely.' },
        { id: 'd', text: 'Ashford has less rainfall than Brindle, because a darker shade is assumed to always mean a smaller amount, no matter what any particular key actually states.' },
      ],
      expectedAnswer: 'Ashford and Dunmore are both in the high rainfall category, because the key lists dark blue as high rainfall and both regions are shaded dark blue.',
      hints: [
        "Read every entry in the key first: which shade stands for low, which stands for medium, and which stands for high.",
        "A shade's own look -- how bright or how dark it seems -- means nothing until you check what this particular key says that exact shade stands for. Two regions match only if the key lists them under the same category.",
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-symbol-key-matching',
      kind: 'try_yourself',
      problem:
        "A thematic map of the invented country of Fairview shows each region's main crop using a symbol. Key: a corn symbol means corn is the main crop, an apple symbol means apple orchards are the main crop, and a cotton symbol means cotton is the main crop. On the map, Fairhaven is marked with an apple symbol, Millbrook is marked with a corn symbol, Stonegate is marked with a cotton symbol, and Ashwell is marked with a corn symbol. Which two regions grow the same main crop, according to the key?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Fairhaven and Stonegate, because both of their symbols happen to use a similar rounded outline shape on this particular map.' },
        { id: 'b', text: 'Millbrook and Fairhaven, because the two regions happen to be listed right next to each other in the written description.' },
        { id: 'c', text: 'Stonegate and Ashwell, because a cotton symbol and a corn symbol both represent some general kind of farming on this map.' },
        { id: 'd', text: 'Millbrook and Ashwell, because the key lists a corn symbol as corn, and both regions are marked with that same corn symbol.', correct: true },
      ],
      expectedAnswer: 'Millbrook and Ashwell, because the key lists a corn symbol as corn, and both regions are marked with that same corn symbol.',
      hints: [
        "Read every entry in the key first: what does a corn symbol mean, what does an apple symbol mean, and what does a cotton symbol mean, and nothing else.",
        "Two regions match each other only if they are marked with the exact same symbol. Being described near each other, or having symbols that look similarly shaped, does not make two regions match.",
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-shaded-key-single-lookup',
      kind: 'try_yourself',
      problem:
        "A thematic map of the invented country of Fenmark shows each region's main land use using three colors. Key: green means forest, brown means farmland, and tan means desert. On the map, Windmere is shaded brown, Thistledown is shaded tan, Corvale is shaded green, and Ashbrook is shaded brown. According to the key, what is the main land use shown in Ashbrook?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Desert, because tan is the shade that looks closest to brown among the three colors used on this particular key.' },
        { id: 'b', text: 'Farmland, because the key lists brown as farmland, and Ashbrook is shaded brown.', correct: true },
        { id: 'c', text: 'Forest, because a region shaded any color other than tan is assumed to default to forest on a land-use key.' },
        { id: 'd', text: 'It cannot be determined, because no color on any thematic map key can ever stand for a specific land use.' },
      ],
      expectedAnswer: 'Farmland, because the key lists brown as farmland, and Ashbrook is shaded brown.',
      hints: [
        "Find Ashbrook in the description and note exactly which color it is listed as, before checking the key at all.",
        "The key lists exactly one meaning for each color. Match Ashbrook's listed color to that one meaning, rather than guessing from how close one shade looks to another.",
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-darker-always-means-more-and-any-symbol-matches',
      kind: 'misconception_check',
      question:
        'A student says: "A darker color on any thematic map always means a bigger amount of whatever the map is showing. And two regions marked with different symbols must still belong to the same category, since they are both symbols instead of colors." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'A darker color on any thematic map always means a bigger amount of whatever the map is showing.',
          misconception:
            "Noticing that one particular key used a dark shade for the high category and assuming every thematic map's key must work the exact same way, instead of checking that specific map's own key each time.",
          correctsTo:
            "WRONG: \"a darker shade always means a bigger amount, on every thematic map.\" CORRECT: \"a shade means whatever that specific map's own key says it means, and only that.\" One map's key might use dark red for high population density, while a different map's key could just as easily use dark green for low rainfall instead. The key decides the meaning every time -- the shade by itself decides nothing.",
        },
        {
          answer: 'Two regions marked with different symbols must still belong to the same category, since they are both symbols instead of colors.',
          misconception:
            "Treating \"uses a symbol instead of a color\" as if that were itself one category, rather than recognizing that a symbol key lists several separate categories, each with its own distinct symbol.",
          correctsTo:
            "A symbol key lists a separate category for each different symbol -- a wheat symbol and a cotton symbol stand for two different things, farming and cotton growing for example, in the same way that two different shades of blue can stand for two different rainfall amounts. Two regions match each other only when they are marked with the exact same symbol, never merely because both regions happen to use some symbol rather than a plain color.",
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Before matching any single area, read every entry in the key first, so each color or symbol already has a known meaning.",
        "A key can be a shaded range of one color, where a darker or lighter shade stands for a bigger or smaller amount, or a set of separate symbols, where each symbol stands for its own category rather than an amount.",
        "To answer a question about one area: find that area, note its exact color or symbol, match it to the same color or symbol in the key, then read off what the key says it means.",
        "To compare two or more areas, match each one to the key separately first, then compare what the key says about each -- never compare colors or symbols directly without checking the key.",
        "A color or symbol means whatever that map's own key says it means, and nothing else. A different map's key can use the very same color or symbol for a completely different meaning.",
        "A thematic map's key only answers questions about the one topic it was built to show; it cannot answer a question about a different topic that map never displayed.",
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.3', cedTitle: 'Reading a Thematic Map' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
