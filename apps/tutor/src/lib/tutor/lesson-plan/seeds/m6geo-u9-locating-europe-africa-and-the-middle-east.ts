/**
 * Grade 6 World Geography — The World's Regions: Names & Locations: Locating
 * Europe, Africa & the Middle East.
 *
 * PROCEDURE-LED shape for the m6geo fan-out (National Geography Standard 1),
 * following the dispatch steering to use
 * `m6geo-u2-hemispheres-equator-and-prime-meridian.ts` as the model: locating
 * a named region is a small repeatable routine, not a mental model to build
 * from scratch. The routine this lesson installs:
 *
 *   1. Where does the region sit relative to the Mediterranean Sea -- right
 *      on its shore (which side), or separated from the sea by another
 *      region entirely?
 *   2. Which direction would you travel to reach each of the other two named
 *      regions from it?
 *
 * SCOPE GUARD: this row names and locates Europe, Sub-Saharan Africa, and
 * the Middle East relative to one another and to the Mediterranean Sea. It
 * says NOTHING about any region's climate, landscape, culture, history,
 * government, or economy -- no rainfall, no crops, no cities, no languages,
 * no religions, no politics, and no development. That content belongs to
 * Grade 7's regional sweep (`m7geo-u8-europe-physical-geography.ts`,
 * `m7geo-u8-europe-history-and-culture.ts`,
 * `m7geo-u8-europe-economy-and-union.ts`,
 * `m7geo-u9-africa-physical-geography.ts`,
 * `m7geo-u9-africa-history-and-culture.ts`,
 * `m7geo-u9-africa-middle-east-development.ts`, and
 * `m7geo-u9-middle-east-geography-and-resources.ts`) and appears nowhere in
 * this file. Two things ARE deliberately allowed, because they are the
 * facts that make locating possible at all, not descriptions of what a
 * region is like: (a) naming the Sahara, because "Sub-Saharan Africa" is
 * defined by its position relative to that desert and the region cannot be
 * located without saying so; and (b) naming the narrow sea gap between
 * Europe and Africa and the narrow land connection between Africa and the
 * Middle East, because whether a connection is water or land is itself a
 * locating fact, the same way the concept-led exemplar allows "earthquakes
 * and volcanoes cluster along plate edges" as a locating fact while
 * forbidding which edge produces which result. Neither the strait nor the
 * land connection is named as vocabulary here, because the general terms
 * for those landforms belong to Grade 6's own `coastal-and-connecting-
 * landforms` and `major-water-feature-vocabulary` rows (Unit 4), which use
 * invented examples on purpose; this file uses the real Europe-Africa gap
 * and the real Africa-Middle East connection only as locating anchors, in
 * plain words, without teaching the landform categories themselves.
 *
 * THE SENSITIVE PART: "Sub-Saharan Africa" and "the Middle East" are both
 * regions whose exact membership is genuinely disputed at the edges, and
 * this file follows row 9.1's own teaching -- a region's border is a chosen
 * convention, not a physical fact -- rather than settling the dispute. This
 * lesson uses one plain convention for each (Sub-Saharan Africa: south of
 * the Sahara; the Middle East: mainly east of the Mediterranean, including
 * the Arabian Peninsula) and says so out loud, and it names the two edge
 * cases directly instead of hiding them: Egypt sits north of the Sahara, so
 * this lesson's convention places it outside Sub-Saharan Africa, and it says
 * plainly that some sources instead group Egypt with the Middle East; Turkey
 * has land on the European side of a narrow strait, and this lesson says
 * plainly that some sources group Turkey with Europe while others group it
 * with the Middle East. Neither grouping is asserted as the one settled
 * answer anywhere in this file. "The Middle East" is also named as a label
 * people use, following row 9.1's and the Grade 7 file's own move, rather
 * than presented as a natural feature of the land.
 *
 * LOCALITY CARE: every position claim in this file is relative (north of,
 * south of, on the shore of, separated from) rather than a coordinate or a
 * distance. The one claim that could be misread as a measurement -- that the
 * Europe-Africa sea gap is narrow enough to see across on a clear day -- is
 * kept as a plain, long-settled, non-numeric observation, and no number
 * appears anywhere in the student-facing text.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea and every item below is
 * answerable by LOCATE or IDENTIFY. The two "so" clauses in the concept
 * segment (the sea gap being narrow enough to see across; the land
 * connection meaning no boat is needed) are each a single plain-language
 * link, never chained further. Test 5 target: the seven Grade 7 files named
 * above -- none of their climate, geology, culture, or resource content
 * appears here, and no sentence below could be lifted into any of them
 * unnoticed.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice
 * 67% of the time, rising to 94% at difficulty 4; chance with four choices is
 * 25%). Every distractor below states a full wrong reason rather than a bare
 * wrong label, and no key was shortened to move this number -- every edit
 * made to close a gap added an honest clause to a distractor's stated
 * reason, never trimmed a key. Measured as a diagnostic, not as a score:
 * choice character counts are item 1 -- a 138, b (key) 129, c 115, d 103;
 * item 2 -- a 172, b 171, c (key) 166, d 177; item 3 -- a 166, b 157,
 * c 178, d (key) 160. The key is the strictly longest choice in NONE of the
 * three items, ranking second, fourth (shortest of four), and third by
 * character count. Zero is not itself the target -- see the note in
 * `m6geo-u3-earths-moving-plates.ts` -- but here it held up under the
 * per-item check: item 2's and item 3's first drafts had their keys as the
 * longest choice, and each was fixed by giving the losing distractors a
 * fuller, equally honest stated reason (never by cutting the key), which is
 * exactly the fix the contract calls for. The three keys sit at ids b, c,
 * and d, which is the id set `(9 + 3) mod 4 = 0` requires, omitting a.
 *
 * NOTE ON prerequisites/followUps: the fan-out contract directs every
 * fan-out row to populate its real chain now from the signed curriculum's
 * row table, so both arrays below carry row 9.2's and row 9.4's real loIds.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every item is solvable
 * from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U9_LOCATING_EUROPE_AFRICA_AND_THE_MIDDLE_EAST: LessonPlan = {
  id: 'evelyn.ms.m6geo.locating-europe-africa-and-the-middle-east.v1',
  title: 'Locating Europe, Africa & the Middle East',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.locating-europe-africa-and-the-middle-east',
      standard: 'M6GEO-9.3',
      description:
        'Name and locate Europe, Sub-Saharan Africa, and the Middle East relative to one another and to the Mediterranean Sea (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).',
    },
  ],
  prerequisites: ['m6geo.locating-the-americas'],
  followUps: ['m6geo.locating-asia-and-oceania'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up a real, checkable gap between two continents before any region name arrives, and plant the confusion this lesson will resolve.',
      script:
        'Your cousin sends you a photo from a beach vacation in southern Spain. The caption says: "You can actually see land across the water from here -- that hazy line of hills is a whole different continent." You look closer. Past the open water there really is a faint line of hills. Your cousin is standing in Europe, looking straight across a narrow gap of sea at part of the continent of Africa. Two whole continents, close enough that you can see one from the other on a clear day. Now here is the twist your cousin does not know: that hazy strip is not the part of Africa called "Sub-Saharan Africa." It is somewhere else entirely. Today you find out exactly where Europe, Africa, and one more named region called the Middle East sit relative to each other, and relative to the sea that touches more than one of them.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-locating-the-three-regions',
      kind: 'concept',
      goal: 'Install the two-question routine for locating a region against the Mediterranean Sea and against the other two named regions, and name the edge cases plainly.',
      keyIdeas: [
        'THIS LESSON LOCATES THREE NAMED REGIONS, USING THE MEDITERRANEAN SEA AS THE SHARED ANCHOR. Europe is a continent. SUB-SAHARAN AFRICA and THE MIDDLE EAST are both regions in the sense from an earlier lesson: named groups of countries, drawn together by a convention someone chose rather than by a fixed physical line. Different sources draw the exact edges of Sub-Saharan Africa and the Middle East a little differently. This lesson uses one common convention for each, and says plainly, later in this lesson, exactly where sources differ.',
        'THE ROUTINE FOR LOCATING ONE OF THESE REGIONS IS TWO QUESTIONS, ALWAYS IN THIS ORDER. Question 1: does the region sit right on the shore of the Mediterranean Sea, and if so, on which side -- or is it separated from the sea by another region entirely? Question 2: which direction would you travel to reach each of the other two named regions from it?',
        'EUROPE SITS DIRECTLY ON THE NORTHERN SHORE OF THE MEDITERRANEAN SEA. The Mediterranean Sea has Europe along its northern edge and the continent of Africa along its southern edge. At the sea\'s western end, a narrow gap of open water separates Europe from Africa -- narrow enough that a person standing on one shore can see land on the other shore on a clear day. Even at that closest point, only water lies between the two continents there, not land.',
        'SUB-SAHARAN AFRICA DOES NOT TOUCH THE MEDITERRANEAN SEA AT ALL. The Sahara stretches across the northern part of the African continent. SUB-SAHARAN AFRICA is the name this lesson uses for the region south of the Sahara. That means the northern part of the African continent, the part that actually touches the Mediterranean coast, lies between Sub-Saharan Africa and the sea. So the hazy strip of land visible from southern Spain is part of Africa, but it sits at the continent\'s northern edge -- nowhere near Sub-Saharan Africa, which lies far to the south, beyond the Sahara.',
        'THE MIDDLE EAST SITS MAINLY TO THE EAST OF THE MEDITERRANEAN SEA. Most sources place the Middle East to the east of the Mediterranean, including the Arabian Peninsula and the countries near the sea\'s eastern end. Unlike the water-only gap between Europe and Africa, the Middle East is joined to the northeastern corner of Africa by a narrow strip of land, so someone there could travel between the two without crossing open water.',
        'TWO REAL PLACES SHOW WHY A REGION\'S EDGE IS A CHOICE, NOT A FIXED LINE. Egypt sits in the northeastern part of the African continent, north of the Sahara -- so under this lesson\'s convention, Egypt is outside Sub-Saharan Africa. Some sources instead group Egypt with the Middle East. Turkey is a second edge case: a small part of Turkey\'s land lies on the European side of a narrow strait, so some sources group Turkey with Europe, while other sources group Turkey with the Middle East instead. Neither grouping is the one official answer -- both are choices made by whoever is doing the grouping, the same as row one of this unit already found for regions in general.',
      ],
      vocabulary: [
        { term: 'region', definition: 'a named group of countries that geographers study together, with its border chosen by whoever is doing the grouping rather than fixed by nature.' },
        { term: 'Mediterranean Sea', definition: "a large sea with Europe along its northern coast and the continent of Africa along its southern coast, connected to the Atlantic Ocean at its western end." },
        { term: 'Sahara', definition: 'the desert that stretches across the northern part of the African continent.' },
        { term: 'Sub-Saharan Africa', definition: 'the region of the African continent that lies south of the Sahara.' },
        { term: 'Middle East', definition: "a region most sources place mainly to the east of the Mediterranean Sea, including the Arabian Peninsula and the countries near the sea's eastern end." },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-routine',
      kind: 'worked_example',
      problem:
        'A geography book says: "One country sits right on the northern shore of the Mediterranean Sea. A second country sits at the eastern end of that same sea, in the region called the Middle East." Using only this description, name which of this lesson\'s three regions the first country is in, and say which direction you would travel to get from the first country to the second.',
      steps: [
        'Run question 1 on the first country: it sits right on the Mediterranean\'s northern shore. Of the three regions in this lesson, Europe is the one that sits directly on that shore. So the first country is in Europe.',
        'The second country is already named as being in the Middle East, at the sea\'s eastern end.',
        'Run question 2: which direction from the first country (Europe, on the northern shore) to the second (the Middle East, at the eastern end)? Traveling from the northern shore toward the sea\'s eastern end means traveling east.',
        'Check the answer by reversing it. If you started at the second country instead and asked the direction back to the first, the answer should flip: west. It does, because east and west are opposite directions along the same sea, and reversing a trip always reverses its direction.',
        'Test a contrasting case so the idea does not overgeneralize. Would sailing straight south from the first country, instead of east, land you in Sub-Saharan Africa? No. Sailing south across the Mediterranean from Europe reaches the northern part of the African continent, north of the Sahara -- not yet Sub-Saharan Africa, which sits much farther south. Reaching a Mediterranean shore does not mean reaching every region that sea is used to locate.',
      ],
      answer:
        'The first country is in Europe, because Europe is the region that sits directly on the Mediterranean\'s northern shore. The direction from the first country to the second, in the Middle East at the sea\'s eastern end, is east. Sailing south instead would reach only the northern part of Africa, not Sub-Saharan Africa, which lies much farther south.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-two-claims-to-correct',
      kind: 'worked_example',
      problem:
        'Looking at the same photo your cousin sent from the beach in Spain, a student says: "That land I can see across the water must be Sub-Saharan Africa, since Spain is in Europe and Africa is right across the water. Also, since Egypt is on the African continent, Egypt must be part of Sub-Saharan Africa too." Correct both mistakes.',
      steps: [
        'Take the visible-land claim first. WRONG: "the land visible from southern Spain is Sub-Saharan Africa." Reread the definition: Sub-Saharan Africa is the region south of the Sahara. The land nearest to Spain, across that narrow gap, sits at the African continent\'s northern edge -- nowhere near the Sahara\'s southern side.',
        'CORRECT: "the land visible across that gap is part of the African continent, but it is at the continent\'s northern edge, not Sub-Saharan Africa, which lies far to the south, beyond the Sahara." Being on the continent of Africa and being inside the specific region called Sub-Saharan Africa are two different claims.',
        'Now take the Egypt claim the same way. WRONG: "Egypt is on the African continent, so Egypt must be part of Sub-Saharan Africa." Locate Egypt: it sits in the northeastern part of the African continent, north of the Sahara.',
        'CORRECT: "Egypt is on the African continent, but because it lies north of the Sahara, it is outside Sub-Saharan Africa under this lesson\'s convention. Some sources instead group Egypt with the Middle East."',
        'Check both corrections against a contrasting case: Europe. Europe sits directly on the Mediterranean\'s shore, with nothing between it and the sea. Sub-Saharan Africa is different -- the rest of the African continent lies between it and the sea. That is exactly why question 1 of the routine gives Europe and Sub-Saharan Africa two completely different answers, even though both are large regions on the same map.',
      ],
      answer:
        'The land visible from southern Spain is part of the African continent, but it is the continent\'s northern edge, not Sub-Saharan Africa, which lies far to the south beyond the Sahara. Egypt is on the African continent but sits north of the Sahara, so under this lesson\'s convention it is outside Sub-Saharan Africa -- some sources group Egypt with the Middle East instead.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-locate-sub-saharan-africa',
      kind: 'try_yourself',
      problem: 'Which statement correctly describes where Sub-Saharan Africa sits relative to the Mediterranean Sea?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sub-Saharan Africa lies directly on the southern shore of the Mediterranean Sea, so a ship sailing south from Europe would reach it first.' },
        { id: 'b', text: 'Sub-Saharan Africa lies south of the Sahara, with the rest of the African continent lying between it and the Mediterranean coast.', correct: true },
        { id: 'c', text: 'Sub-Saharan Africa sits at the eastern end of the Mediterranean Sea, in the area most sources call the Middle East.' },
        { id: 'd', text: "Sub-Saharan Africa forms the Mediterranean Sea's northern coast, on the same side of the sea as Europe." },
      ],
      expectedAnswer: 'Sub-Saharan Africa lies south of the Sahara, with the rest of the African continent lying between it and the Mediterranean coast.',
      hints: [
        'Ask what lies between the Mediterranean coast and Sub-Saharan Africa, using this lesson\'s definition of Sub-Saharan Africa.',
        'Three of these choices put Sub-Saharan Africa directly on the sea itself. Only one choice puts something else in between.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-africa-middle-east-connection',
      kind: 'try_yourself',
      problem: 'Which statement correctly describes how the Middle East connects to the African continent?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The Middle East is separated from Africa entirely by open ocean, with no place where dry land connects the two, so reaching one from the other means a very long sea voyage.' },
        { id: 'b', text: 'The Middle East lies to the west of Europe, on the far side of a different ocean altogether, much too far from any part of the African continent to share a border with it.' },
        { id: 'c', text: 'The Middle East is joined to the northeastern corner of Africa by a narrow strip of land, so the two can be reached from each other there without crossing open water.', correct: true },
        { id: 'd', text: 'The Middle East lies south of the Sahara, inside the very same region this lesson calls Sub-Saharan Africa, rather than being its own separate region near the Mediterranean Sea.' },
      ],
      expectedAnswer: 'The Middle East is joined to the northeastern corner of Africa by a narrow strip of land, so the two can be reached from each other there without crossing open water.',
      hints: [
        'Compare this connection with the Europe-Africa gap near Spain. Is the Africa-Middle East connection the same kind of gap, or a different kind?',
        'One of these choices puts land, not water, between the two. Only a strip of land lets someone cross without a boat.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-region-edges-are-conventions',
      kind: 'try_yourself',
      problem:
        'One mapmaker groups Turkey with the region of Europe, because a small part of Turkey\'s land lies on the European side of a narrow strait. A different mapmaker groups Turkey with the Middle East instead. What does this disagreement best show?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'One of the two mapmakers has made a factual mistake, since a real country can only ever belong to a single named world region, no matter how close to an edge it sits.' },
        { id: 'b', text: 'Turkey\'s true location on Earth has recently changed, which is why the two mapmakers, relying on different information, no longer agree on where to place it.' },
        { id: 'c', text: "Turkey does not actually sit anywhere near the Mediterranean Sea or the narrow strait either mapmaker mentions, so neither mapmaker's grouping is based on where Turkey really is." },
        { id: 'd', text: 'A region\'s border is a choice made by whoever is doing the grouping, so a country near the edge of a region can reasonably be grouped with more than one region.', correct: true },
      ],
      expectedAnswer: 'A region\'s border is a choice made by whoever is doing the grouping, so a country near the edge of a region can reasonably be grouped with more than one region.',
      hints: [
        'Think back to how a region\'s border gets drawn in the first place -- is it a fixed physical line, or a choice someone made?',
        'Two of these choices assume something about Turkey itself changed or is unclear. Only one choice is actually about how regions get grouped.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-official-list-and-same-kind-of-connection',
      kind: 'misconception_check',
      question:
        'A student says: "The Middle East has one official, agreed-upon list of countries that every source uses. And Europe and Africa are joined together by land, the same way Africa and the Middle East are." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'The Middle East has one official, agreed-upon list of countries that every source uses.',
          misconception:
            'Treating a human-made regional convention as though it were an official, fixed list -- the same mistake this unit\'s first lesson already named for regions in general, but here applied to two real edge cases: Egypt, grouped with the Middle East by some sources and with the rest of Africa by others, and Turkey, grouped with Europe by some sources and with the Middle East by others.',
          correctsTo:
            'Sub-Saharan Africa and the Middle East are both regions: named groups that different sources draw a little differently. Egypt sits north of the Sahara, so it is outside Sub-Saharan Africa under this lesson\'s convention, but some sources group Egypt with the Middle East instead. Turkey has land on the European side of a narrow strait, so some sources group Turkey with Europe while others group it with the Middle East. WRONG: "there is one official list everyone agrees on." CORRECT: "different sources draw the edges of these regions a little differently, and a country near an edge can reasonably be grouped more than one way."',
        },
        {
          answer: 'Europe and Africa are joined together by land, the same way Africa and the Middle East are.',
          misconception:
            'Noticing that Africa connects to the Middle East by land and assuming every connection near Africa works the same way, instead of checking each one separately.',
          correctsTo:
            'Europe and Africa are separated by the Mediterranean Sea, and even at their closest point, only a narrow gap of water lies between them, not land. Africa and the Middle East are different: a narrow strip of land joins them at the northeastern corner of Africa. WRONG: "Europe and Africa are joined by land, the same way Africa and the Middle East are." CORRECT: "only water separates Europe from Africa, even at their closest point, while land joins Africa to the Middle East."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Europe, Sub-Saharan Africa, and the Middle East are the three named regions in this lesson, located using the Mediterranean Sea as a shared anchor.',
        'Europe sits directly on the Mediterranean Sea\'s northern shore. At the sea\'s western end, a narrow gap of water separates Europe from Africa -- narrow enough to see across on a clear day, but still water, not land.',
        'Sub-Saharan Africa is the region south of the Sahara. It does not touch the Mediterranean Sea directly -- the rest of the African continent lies between Sub-Saharan Africa and the sea.',
        'The Middle East sits mainly to the east of the Mediterranean Sea, including the Arabian Peninsula and the countries near the sea\'s eastern end. A narrow strip of land joins the Middle East to the northeastern corner of Africa, so that connection is land, not water.',
        'Egypt sits north of the Sahara, so it is outside Sub-Saharan Africa under this lesson\'s convention. Some sources instead group Egypt with the Middle East.',
        'Turkey has land on the European side of a narrow strait, so some sources group Turkey with Europe and other sources group it with the Middle East. Neither grouping is the one official answer.',
        'A region\'s border is a choice made by whoever is doing the grouping, not a fixed physical line -- so a country near the edge, such as Egypt or Turkey, can reasonably be grouped more than one way.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '9', cedTopic: '9.3', cedTitle: 'Locating Europe, Africa & the Middle East' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
