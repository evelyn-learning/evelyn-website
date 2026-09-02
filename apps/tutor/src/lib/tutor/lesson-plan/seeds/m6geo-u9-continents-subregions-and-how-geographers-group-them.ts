/**
 * Grade 6 World Geography — The World's Regions: Names & Locations: How
 * Geographers Group the World into Regions.
 *
 * CONCEPT-LED shape for the m6geo fan-out (National Geography Standard 1),
 * following the dispatch steering to use `m6geo-u3-earths-moving-plates.ts`
 * as the model: there is no procedure to run here, so the whole lesson
 * installs one picture -- geographers group neighboring countries into a
 * named REGION, smaller than a continent and bigger than one country,
 * because grouping makes a large world easier to study and talk about.
 *
 * SCOPE GUARD: this row explains ONLY the reasoning behind grouping --
 * THAT geographers group countries into named regions, and WHY (it makes a
 * big world easier to study), and THAT a region's border is a chosen
 * convention rather than a physical fact, so two sources can group the very
 * same countries differently without either being wrong. It names NO closed
 * typology of region kinds and NO framework for how people relate to their
 * surroundings -- the formal/functional/perceptual region typology and the
 * adapt/modify/depend human-environment-interaction framework are Grade 7's
 * `m7geo-u1-regions-and-place.ts` and neither appears anywhere in this file.
 * THE SPLIT THIS ROW OWNS VERSUS ITS OWN UNIT 9 SIBLINGS: this row never
 * locates a region relative to another region, an ocean, or a line, and it
 * never states or implies which countries belong inside a named region --
 * that locating work belongs entirely to rows 9.2 (`locating-the-americas`),
 * 9.3 (`locating-europe-africa-and-the-middle-east`), and 9.4
 * (`locating-asia-and-oceania`). This row's own concept segment says that
 * split out loud to the student (see keyIdea six), without naming a grade
 * level or promising a future lesson.
 *
 * WHAT IS DELIBERATELY ALLOWED, because this row's own hazard is the
 * heaviest convention-and-locality load in the course: naming Latin America
 * and the Middle East, verbatim from the signed scope line, purely as
 * EXAMPLES of region names a student may already have heard -- with no
 * claim anywhere in this file about which countries either one contains or
 * where either one sits on the globe. Also deliberately allowed, and
 * required by the hazard: stating OUT LOUD, as a named convention rather
 * than a bare fact, that a region's name and border can differ by source,
 * the same move `m6geo-u2-continents-and-oceans.ts` used for the
 * continent/ocean count. No named region's membership or exact border is
 * ever asserted as settled, and no country, culture, or region is
 * characterized by a trait of the people who live there (accuracy rule 5)
 * or treated as a single uniform thing (accuracy rule 8) -- this file simply
 * never describes what a region is like, only that regions are named and
 * why. Every other real-world claim about grouping uses invented countries
 * (Tenlow, Marisel, Duvane, Renmar, and the five countries in the second
 * worked example), which is both safer and a better test of whether the
 * student has learned the reasoning rather than memorized a real map.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea below is answerable by
 * DEFINE or IDENTIFY alone. There is no closed typology, no mechanism that
 * explains why a REGION works the way it does beyond the one-link "grouping
 * makes a big world easier to study," and nothing the student must reason
 * through more than one step at a time. Test 5 target: `m7geo-u1-regions-
 * and-place.ts`, read in full -- its "formal/functional/perceptual" and
 * "adapt/modify/depend" vocabulary appears nowhere here, and no sentence
 * below could be lifted into that file unnoticed.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice
 * 67% of the time, rising to 94% at difficulty 4; chance with four choices
 * is 25%). Every distractor below states a full wrong reason rather than a
 * bare wrong label, and no key was shortened to move this number. Measured
 * as a diagnostic, not as a score: choice character counts are item 1 -- a
 * (key) 122, b 123, c 135, d 128; item 2 -- a 106, b (key) 110, c 102, d
 * 140; item 3 -- a 127, b 118, c 154, d (key) 120. The key is the strictly
 * longest choice in ZERO of the three items, ranking fourth (of four),
 * second, and third by character count. Zero is not itself the target --
 * see the note in `m6geo-u3-earths-moving-plates.ts` -- but here it fell
 * out of giving every distractor its own full stated reason, several of
 * which needed a second clause to state that reason honestly, never from
 * trimming a key. Where the key does lead a choice (item 2's key leads
 * choice a by 4 characters), that margin is a tie, not a signal, by the
 * contract's own three-character rule. The three keys sit at ids a, b, and
 * d, which is the id set `(9 + 1) mod 4 = 2` requires, omitting c.
 *
 * NOTE ON prerequisites/followUps: the fan-out contract directs every
 * fan-out row to populate its real chain now from the signed curriculum's
 * row table, so both arrays below carry row 8.4's and row 9.2's real loIds
 * rather than the exemplars' registration-order-only empty arrays.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U9_CONTINENTS_SUBREGIONS_AND_HOW_GEOGRAPHERS_GROUP_THEM: LessonPlan = {
  id: 'evelyn.ms.m6geo.continents-subregions-and-how-geographers-group-them.v1',
  title: 'How Geographers Group the World into Regions',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.continents-subregions-and-how-geographers-group-them',
      standard: 'M6GEO-9.1',
      description:
        "Explain that geographers group countries into named world regions, such as Latin America or the Middle East, to make a large world easier to study -- pure naming and framing only, without the formal, functional, and perceptual region typology, which is Grade 7's regions-and-place lesson (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).",
    },
  ],
  prerequisites: ['m6geo.mapping-your-own-community'],
  followUps: ['m6geo.locating-the-americas'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make grouping-for-convenience feel familiar before the word "region" arrives, using a classroom scenario a student can picture.',
      script:
        'Your class starts getting pen-pal letters from students in dozens of different countries all over the world. Keeping one index card for every single country would fill your whole desk, and you would never remember which card was which. So your teacher pins the letters onto a bulletin board in a few big named clusters instead, putting countries that have something in common into the same cluster. Now, instead of remembering one fact about thirty different countries, you only have to remember a handful of facts about a handful of named groups. Geographers do exactly this with the entire world, and they call each named group a region. Today you find out why geographers group countries into regions in the first place, and how a region is different from a country or a continent.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-what-a-region-is-and-why-it-exists',
      kind: 'concept',
      goal: 'Install the definition of a region, its size relative to a country and a continent, the one-link reason grouping exists, and the fact that a region\'s border is a chosen convention rather than a physical fact -- plus the split between this lesson and the rows that locate regions.',
      keyIdeas: [
        "THE WORLD HAS A GREAT MANY COUNTRIES -- FAR TOO MANY TO STUDY OR TALK ABOUT ONE AT A TIME. To make a big, complicated world easier to study, geographers group several neighboring countries together and give the whole group one name. A group like this is called a REGION. A region sits between two sizes already familiar to you: it is bigger than a single country, and it is smaller than a whole continent.",
        "A REGION IS A GROUP, NOT A SINGLE PLACE AND NOT AN OFFICIAL GOVERNMENT. A country has its own government and its own borders set by law. A region is different: it is simply a name geographers use for a group of countries, and no single government runs an entire region. Two examples of region names people use are LATIN AMERICA and THE MIDDLE EAST -- names many people have already heard, each one standing for a whole group of countries at once.",
        "GEOGRAPHERS GROUP COUNTRIES INTO A REGION BECAUSE THOSE COUNTRIES SHARE SOMETHING IN COMMON. What is shared could be almost anything -- being near each other, sharing a history, speaking related languages, or having similar physical geography. Whatever the shared thing is, naming the group as one region lets people talk about all of those countries at once instead of listing every single one by name every time. That is the whole reason regions exist: they make a big world easier to study and talk about.",
        "A REGION'S BORDER IS A CHOICE, NOT A LINE THAT NATURE DREW. A continent's rough outline mostly follows a coastline, and a coastline is a physical fact. A region's border works differently: a person or an organization decided where to draw it, based on the shared trait they cared about. Because it is a choice, a region's border can sit in a slightly different place, or the region can go by a slightly different name, depending on who is doing the grouping and why.",
        "TWO SOURCES CAN GROUP THE VERY SAME COUNTRIES DIFFERENTLY, AND NEITHER ONE HAS TO BE WRONG. One source might group a set of countries by their shared physical geography. A different source might group that very same set of countries by something else entirely, such as trade or language. Both groupings can be useful at once, for different reasons -- the same way this course already found that geographers do not all count the same number of continents.",
        "THIS LESSON IS ABOUT THE REASON REGIONS GET GROUPED IN THE FIRST PLACE, NOT ABOUT EXACTLY WHERE ANY ONE REGION SITS ON THE GLOBE. Region names such as Latin America and the Middle East appear here only as examples of how a group of countries gets one shared name. Learning precisely which countries sit inside each of those regions, and where each region sits relative to the others, is a separate skill that uses directions and position words.",
      ],
      vocabulary: [
        { term: 'region', definition: 'a named group of two or more neighboring countries that geographers study together because the countries share something in common.' },
        { term: 'country', definition: 'an area of land with its own government, recognized as an independent nation.' },
        { term: 'continent', definition: "one of Earth's largest continuous areas of land, made up of many countries." },
        { term: 'convention', definition: 'a way of doing or naming something that a group of people has agreed on, which could reasonably have been done a different way.' },
        { term: 'border', definition: 'the edge that marks where one area, such as a country or a region, ends and the next one begins.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-nearness-is-not-enough',
      kind: 'worked_example',
      problem:
        'A mapmaker names a new region "the Amber Coast" for three imaginary countries: Tenlow, Marisel, and Duvane. All three of those countries touch the same sea, and all three ship most of their goods by boat to nearby ports. A student says: "The Amber Coast is a region because those three countries are next to each other on a map." Explain what the student\'s reason leaves out, and give the fuller reason for naming this a region.',
      steps: [
        'Read the student\'s reason first: the three countries are next to each other on a map. Being neighbors is true of the three countries, but it is not, by itself, what the mapmaker actually used to group them.',
        'Reread the setup for the trait the mapmaker actually named: all three countries touch the same sea, and all three ship most of their goods by boat. That shared trait, not simple nearness, is the reason stated for the grouping.',
        'WRONG: "The Amber Coast is a region just because those three countries happen to be next to each other." CORRECT: "The Amber Coast is a region because those three countries share a specific trait -- a coastline on the same sea and reliance on shipping by boat -- and the mapmaker grouped them for that reason."',
        'Test the correction against a contrasting case. Imagine a fourth country, Renmar, that also sits next to these three on the map but is landlocked, ships nothing by sea, and trades mainly overland. Would Renmar belong in the Amber Coast region under the mapmaker\'s stated reason?',
        'Renmar would not belong, even though it is nearby, because it lacks the shared trait the mapmaker actually used: a coastline on that sea and reliance on shipping by boat. This is the check to remember: nearness alone does not decide a region\'s border. The shared trait a source names is what decides it.',
      ],
      answer:
        'The student\'s reason only says the three countries are near each other. The mapmaker\'s fuller reason is that all three touch the same sea and ship most of their goods by boat, and that shared trait is what makes them a region together. A nearby country without that trait, such as landlocked Renmar, would not belong in the Amber Coast region.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-sources-two-reasons',
      kind: 'worked_example',
      problem:
        'A teacher\'s map divides five imaginary countries into two regions by climate: a warm, wet "Green Basin" region and a cooler, dry "High Plain" region. A travel guide divides that very same set of five countries into two different regions, grouped instead by which capital city\'s airport most travelers fly into. A student says: "The travel guide\'s regions must be wrong, since they do not match the teacher\'s map." Explain why the student\'s claim is mistaken.',
      steps: [
        'Name what each source actually grouped by. The teacher\'s map groups the five countries by climate. The travel guide groups the very same five countries by which airport travelers use. Those are two different shared traits, chosen for two different purposes.',
        'Ask whether a region\'s border is a fixed physical fact or a chosen convention. A region\'s border is a convention: a person or organization drew it around whatever trait mattered to them. It is not like a coastline, which is set by where land meets water no matter who is looking at it.',
        'WRONG: "The travel guide\'s regions must be wrong because they are different from the teacher\'s map." CORRECT: "Both groupings can be correct at the same time, because each one was drawn for a different reason -- climate for the teacher\'s map, and airport travel patterns for the travel guide."',
        'Test the correction against a contrasting case. Suppose a third source grouped those same five countries again, this time by language. Would that third grouping also be valid? Yes, as long as it is genuinely grouping the countries by a real shared trait -- language, in this case -- the same way the other two sources did.',
        'This is the check to remember. A single country can sit inside a different region depending on which shared trait is being used to group it, and that does not make any of the groupings wrong.',
      ],
      answer:
        'The student is treating the teacher\'s map as the one correct grouping, but a region\'s border is a chosen convention, not a fixed fact. The teacher\'s map groups the countries by climate, and the travel guide groups the very same countries by airport travel patterns. Both groupings can be correct at once, because each was drawn for a different reason.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-region-vs-country-vs-border',
      kind: 'try_yourself',
      problem: "Which choice best describes what geographers mean by a world region?",
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A named group of two or more neighboring countries that geographers study together because they share something in common.', correct: true },
        { id: 'b', text: 'A smaller kind of continent, covering a similarly huge stretch of land but simply given a different, smaller-sounding name.' },
        { id: 'c', text: 'A single country whose land area happens to be large enough that it gets studied on its own instead of being grouped with any neighbor.' },
        { id: 'd', text: "A line on a map that marks the exact spot where one country's own government ends and a neighboring country's government begins." },
      ],
      expectedAnswer: 'A named group of two or more neighboring countries that geographers study together because they share something in common.',
      hints: [
        'Think about how a region compares in size to a country and to a continent -- is it the same size as either one, or is it its own size in between?',
        'A continent is a huge landmass, a country has its own government, and a border is just an edge -- a region is a group of more than one country, grouped together for a shared reason.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-why-regions-get-named',
      kind: 'try_yourself',
      problem: 'Why do geographers group many countries together into a single named region?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Because every country inside one named region must directly touch every other country in that same region.' },
        { id: 'b', text: 'Because naming a large group of countries as one region makes a very big world easier to study and talk about.', correct: true },
        { id: 'c', text: "Because a region's border is set by nature, the same way a coastline is set by land meeting the ocean." },
        { id: 'd', text: 'Because every country inside one named region shares the exact same government and the exact same laws as every other country located in it.' },
      ],
      expectedAnswer: 'Because naming a large group of countries as one region makes a very big world easier to study and talk about.',
      hints: [
        'Ask what problem naming a large group of countries with one shared name actually solves for someone trying to study the world.',
        'Each of the other three choices makes a region sound more physically fixed or more officially governed than a chosen grouping actually is.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-two-sources-disagree',
      kind: 'try_yourself',
      problem:
        'A single country ends up placed inside two different named regions by two different sources. What is the most likely reason for that?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'One of the two sources must have made a mistake, because a country can only ever belong to a single named world region at once.' },
        { id: 'b', text: "The country's exact physical location on Earth must have changed between the time the two different sources were made." },
        { id: 'c', text: 'The two sources are actually naming two different continents rather than two different regions, and a continent covers far more land than any region does.' },
        { id: 'd', text: 'Each source grouped the country using a different shared trait or purpose, such as trade patterns compared with climate.', correct: true },
      ],
      expectedAnswer: 'Each source grouped the country using a different shared trait or purpose, such as trade patterns compared with climate.',
      hints: [
        'Ask what would actually have to happen in the real world for a country\'s location to change -- has anything like that happened here?',
        'A country is not the same thing as a continent, and a chosen grouping is allowed to differ from source to source without either source being wrong.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-regions-are-official-and-fixed',
      kind: 'misconception_check',
      question:
        'A student says: "Region names like Latin America and the Middle East are official names set by one organization, and every country fits into exactly one of them with no disagreement." What is wrong with that?',
      commonErrors: [
        {
          answer: 'Region names are official names set by a single organization, with no disagreement about which countries belong.',
          misconception:
            'Treating a human-made grouping convention as though it were an official, universally agreed-upon government designation -- the same mistake as treating a continent count as one official fixed number rather than a convention.',
          correctsTo:
            "Region names such as Latin America and the Middle East are conventions that different geographers, mapmakers, and organizations use, not official names handed down by one single authority. WRONG: \"there is one official, agreed-upon list of world regions that everyone uses.\" CORRECT: \"different sources can group the very same countries into regions a little differently, based on what shared trait or purpose they are grouping by.\"",
        },
        {
          answer: 'Every country fits into exactly one world region, with no disagreement possible.',
          misconception:
            "Assuming a region works like a country's own fixed government border rather than a chosen grouping, so a single country could not reasonably appear inside a different group depending on the trait being used.",
          correctsTo:
            'Because a region is grouped by whatever shared trait or purpose a source is using, the same country can appear inside a different region depending on which source and which purpose is being used. That does not mean one grouping is right and the other is wrong -- it means regions are a tool for studying the world, not a fixed line like a country\'s own border.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A region is a named group of two or more neighboring countries that geographers study together because the countries share something in common. It is bigger than a single country and smaller than a whole continent.',
        'A region is a grouping, not an official government -- no single government runs an entire region.',
        'Latin America and the Middle East are two examples of region names, used here only as examples of how a group of countries gets one shared name.',
        'Geographers group countries into a region because doing so makes a big, complicated world easier to study and talk about, using one name instead of listing every country separately.',
        "A region's border is a chosen convention, based on whatever shared trait a source cares about -- it is not a physical fact the way a coastline is.",
        'Two different sources can group the very same countries into regions differently, using different shared traits, and neither grouping has to be wrong.',
        'This lesson covers why regions get grouped, not exactly where any one region sits on the globe or exactly which countries belong inside it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.1', cedTitle: 'How Geographers Group the World into Regions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
