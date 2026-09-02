/**
 * Grade 6 World Geography — Applying Geography to the World Today: Using
 * Geography to Plan a Community.
 *
 * PROCEDURE-LED lesson for the m6geo fan-out (National Geography Standard
 * 18), and the closing lesson of the course. The routine is a match: gather
 * the land, water, and resource facts about a piece of land, then match those
 * facts to what a planned use actually needs.
 *
 * THE ROUTINE, in the order it is always run:
 *   1. What are the land, water, and resource facts about this piece of
 *      land? (Is it flat or steep? Is water nearby, and can that water flood
 *      it? Does it offer a resource such as fertile soil?)
 *   2. Which use needs exactly those facts? A farm needs flat land, fertile
 *      soil, and a reliable water source. Housing needs flat land that stays
 *      dry. A road needs to connect two places people already travel
 *      between. A park can use land unsuited to farming or building.
 *   3. Name the fact that decides it. A preference is not a planning reason
 *      on its own.
 *
 * SCOPE GUARD: this row explains how a community planner reads land, water,
 * and resource facts across SEVERAL parcels to decide where roads, parks,
 * farms, and housing each go. It never names an economic system, a cost, a
 * profit, or a trade relationship -- resource-based economic activity and
 * levels of development are Grade 7 (`m7geo-u5-resources-and-economic-
 * activity.ts` and its Unit 5 neighbors) and must not appear here. It also
 * never invokes the formal/functional/perceptual region typology or the
 * adapt/modify/depend framework, which is a different Grade 7 lesson
 * (`m7geo-u1-regions-and-place.ts`). No single Grade 7 file teaches community
 * or urban planning as its own topic -- G7's regional sweep and its Unit 5
 * economics unit are the two nearest neighbors, and both were checked. What
 * IS deliberately allowed: naming that a piece of land near water can flood,
 * because that is a land-and-water FACT this row's reasoning needs, not an
 * economic or typological claim.
 *
 * THE SPLIT WITH ROW 10.1 (`geographic-reasoning-in-everyday-decisions`):
 * row 10.1 applies the SITE-AND-SITUATION pair from Unit 1 to locate ONE new
 * facility in one described scenario (its site: the exact spot; its
 * situation: what surrounds it). This row never uses the words "site" or
 * "situation" and is not about one facility. It is a planner weighing land,
 * water, and resource facts about SEVERAL parcels at once, matching each one
 * to a different use out of four (roads, parks, farms, housing). Row 10.1
 * asks "is this the right spot for this one thing"; this row asks "given
 * everything this community needs, which piece of land goes to which need."
 * (Row 10.1's own seed file had not landed in the seeds/ directory at the
 * time this file was written, so this split is drawn from the two rows'
 * signed scope sentences in `m6geo-CURRICULUM.md`, not from reading its
 * file.)
 *
 * REGISTER HAZARD -- planning decisions have winners and losers: every item
 * and worked example below keys its answer to a land, water, or resource
 * FACT (it floods; it has no soil; it already connects to a road), never to
 * which option is more popular, more scenic, or more fashionable. The second
 * worked example and the first misconception both stage a preference-based
 * claim on purpose and correct it with a fact, so the distinction is taught
 * directly rather than only avoided. Every parcel is invented (Foxwood,
 * Millbrook) and every land, water, and resource fact used is stated inside
 * the item -- there is no real-world locality claim anywhere in this file.
 *
 * DEPTH CEILING NOTE FOR THE FAN-OUT: every keyIdea and item stem is answered
 * by matching a stated fact to a stated need -- CLASSIFY, not MECHANISM. The
 * four land uses are a plain, closed vocabulary set named by this row's own
 * scope line (like landform vocabulary in Unit 4), not a mechanism's internal
 * typology. No "because" chain runs more than one link: land use needs are
 * stated as definitions ("a farm needs flat land, fertile soil, and water"),
 * never derived through an intermediate cause.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, and 94% at difficulty 4; chance with four choices is 25%).
 * Every distractor here states a full wrong reason -- a misapplied rule, an
 * overgeneralized fact, or a preference dressed as a reason -- rather than a
 * short wrong label, and no key was built to be the longest OR the shortest
 * choice BECAUSE it is the key. Measured as a diagnostic, not a score: the key
 * is the strictly longest choice in 0 of the 3 items, and is never the
 * strictly shortest choice either (see the character counts in the report
 * this file ships with -- the closest margin is 1 character). Zero is a
 * plausible chance outcome for a single three-item file (about 42% of files
 * land there by chance alone) and is not itself evidence the technique
 * over-corrected; see the note in `m6geo-u3-earths-moving-plates.ts` for why
 * the course-level rate, not this file's count, is the real measurement. The
 * three keys sit at ids a, b, and d -- the id set `(10 + 4) mod 4 = 2`
 * requires, omitting c.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every parcel's facts are
 * printed in the item text; nothing here asks the student to look at a map.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M6GEO_U10_USING_GEOGRAPHY_TO_PLAN_A_COMMUNITY: LessonPlan = {
  id: 'evelyn.ms.m6geo.using-geography-to-plan-a-community.v1',
  title: 'Using Geography to Plan a Community',
  curriculum: 'MS',
  grade: '6',
  subject: 'social-studies',
  topic: 'grade-6-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm6geo.using-geography-to-plan-a-community',
      standard: 'M6GEO-10.4',
      description:
        'Explain how a community planner uses information about land, water, and resources to decide where to place roads, parks, farms, and housing (National Geography Standard 18: how to apply geography to interpret the present and plan for the future).',
    },
  ],
  prerequisites: ['m6geo.how-physical-geography-changes-over-time'],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Shrink community planning down to a size an eleven-year-old already solves, before any vocabulary arrives.',
      script:
        'Imagine your family moves into a new house with a big, mostly empty backyard, and you get to help decide what goes where. One corner is flat and sunny. Another corner is shaded and a little damp because it sits low, near where rain collects. A narrow strip along the fence already has a path worn into it from the mail carrier walking through. You would not put a vegetable garden in the damp, shaded corner, and you would not pave the sunny flat spot just because it happens to be empty. You would look at what each spot is actually like, and match it to what it is good for. A person whose job is to do exactly that for an entire town is called a community planner, and today you learn how that planner reads land, water, and resources to decide where a road goes, where a park goes, where a farm goes, and where houses go.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-matching-land-to-a-use',
      kind: 'concept',
      goal: 'Install the three kinds of facts a planner gathers and what each of the four land uses needs from those facts.',
      keyIdeas: [
        'A COMMUNITY NEEDS SEVERAL DIFFERENT LAND USES AT ONCE, AND A PLANNER DECIDES WHICH PIECE OF LAND GETS WHICH ONE. A community needs roads to connect places, parks for shared outdoor space, farms to grow food, and housing for people to live in. A COMMUNITY PLANNER is the person who looks at the available LAND USE options for each piece of land and decides which use fits it best.',
        'THE PLANNER STARTS BY GATHERING LAND, WATER, AND RESOURCE FACTS ABOUT EACH PIECE OF LAND, BEFORE DECIDING ANYTHING. There are three kinds of facts to gather: what shape the land is (flat or steep, clear or rocky), what water is nearby and whether that water can rise and cover the land (a FLOODPLAIN), and what RESOURCE the land offers, such as FERTILE SOIL, useful stone, or nothing special at all.',
        "EACH LAND USE NEEDS DIFFERENT FACTS TO BE TRUE OF ITS LAND. A FARM needs flat land, fertile soil, and a reliable water source nearby. HOUSING needs land that is flat enough to build on and does not sit on a floodplain, so it stays dry. A ROAD needs to run across land that is fairly flat, and above all needs to connect two places people already travel between. A PARK can use land that does not suit farming or building, such as land that is steep, rocky, or sits right along the water's edge, since a park does not need flat, fertile, or dry ground the way the other three uses do.",
        'THE SAME LAND CAN SUIT ONE USE WELL AND SUIT ANOTHER POORLY. Flat, fertile land next to a steady stream suits a farm well, but if that same land also floods, it would be a poor spot for housing. Steep, rocky land poorly suits a farm or housing, but it can suit a park just fine.',
        'A GOOD PLANNING REASON NAMES A LAND, WATER, OR RESOURCE FACT. A planner explains a choice by pointing at a fact about the land itself: it floods, it has fertile soil, it already connects to a road. Saying that people would simply enjoy one choice more is not, by itself, a planning reason -- the facts about the land are what decide it.',
      ],
      vocabulary: [
        { term: 'community planner', definition: 'a person whose job is to decide how the different pieces of land in a community will be used.' },
        { term: 'land use', definition: 'the purpose a piece of land is put to, such as a road, a park, a farm, or housing.' },
        { term: 'resource', definition: 'something found in nature that people can use, such as fertile soil, water, or useful stone.' },
        { term: 'fertile soil', definition: 'soil that has the nutrients and structure that crops need to grow well.' },
        { term: 'floodplain', definition: 'low, flat land next to a river or stream that can fill with water when the water level rises.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-farm-or-park',
      kind: 'worked_example',
      problem:
        'The town of Foxwood has two open parcels left to plan. Parcel A is flat, has soil that has grown strong crops on nearby farms for years, and lies next to a stream that flows all year. Parcel B is a steep, rocky hillside next to a small lake, with almost no soil, but a wide view over the water. Foxwood needs one new farm and one new park. Using the land, water, and resource facts, decide which parcel becomes the farm and which becomes the park.',
      steps: [
        'List the facts for each parcel before choosing anything. Parcel A: flat, soil known to grow good crops, water available all year. Parcel B: steep, rocky, almost no soil, overlooks a lake.',
        'Check what a farm needs: flat land, fertile soil, and a nearby water source. Parcel A matches all three of these facts.',
        'Check whether Parcel B could work as the farm instead. Its steep, rocky ground with almost no soil fails two of the three needs, so Parcel B cannot become the farm no matter how much water sits nearby.',
        'Check what a park needs: land does not have to be flat, fertile, or easy to build on. Parcel B is steep and rocky, which rules it out for a farm or for housing, and its view over the lake makes it a pleasant place to spend time -- exactly the kind of land a park can use.',
        'Rewind the choice to check it holds up: could the two be swapped? Putting the park on Parcel A would leave good farmland sitting unused, and putting the farm on Parcel B is impossible because the ground cannot support crops. The land, water, and resource facts point the same way from either direction.',
        'Test a contrasting case so the routine is not overlearned: if a third parcel were flat, had no water nearby, and no soil worth mentioning, it would fit neither a farm nor a park especially well, but a road could still cross it, because a road is decided mainly by what it connects, not by the soil or water underneath it.',
      ],
      answer:
        'Parcel A becomes the farm, because it is flat, has fertile soil, and sits next to a steady water source. Parcel B becomes the park, because its steep, rocky ground does not suit a farm or housing, and its view over the lake still makes it useful.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-preference-vs-fact',
      kind: 'worked_example',
      problem:
        'A resident of Foxwood suggests: "The new housing should go right at the edge of the lake, because everyone loves waking up to a view of the water. The flat, dry field farther back, near the existing road, should become the farm instead, since it is out of the way." The field near the road has never grown crops and its soil is thin and sandy. The land at the lake\'s edge has flooded twice in the past five years. Explain what is wrong with the resident\'s plan, using the land, water, and resource facts.',
      steps: [
        'Separate the resident\'s reason from a land, water, or resource fact. WRONG: "everyone loves waking up to a view of the water" describes a preference, not a fact about the land itself.',
        'Check the lake-edge land against what housing needs: flat land that stays dry. The land has flooded twice in five years, so it fails the "stays dry" requirement no matter how nice the view is. CORRECT: housing should sit on land that does not flood.',
        'Check the field near the road against what a farm needs: flat land, fertile soil, and a water source. Its soil is thin and sandy, which is the opposite of fertile, so it fails a farm\'s needs even though it is flat.',
        'Check the same field against what housing needs instead: flat land, stays dry, and already connects to a road. It matches all three, so this field suits housing well, not farming.',
        'Rewind to check the correction: reread the resident\'s claim -- the reason given was a view, not a fact, and the one fact available (flooding) points the opposite way from the resident\'s plan.',
        'Test a contrasting case: if the lake-edge land had never flooded and stayed dry, the view would no longer disqualify it, and the same routine -- check the facts, not the preference -- would allow housing there. It is the flooding fact that rules it out, not the water view itself.',
      ],
      answer:
        'The housing should go on the field near the road, because it is flat, stays dry, and already connects to a road -- not because of a view. The lake-edge land has flooded twice in five years, so it fails what housing needs, and the sandy field\'s poor soil means it cannot become the farm either.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-farm-parcel',
      kind: 'try_yourself',
      problem:
        'A community planner is deciding where to place a new farm in the town of Millbrook. Parcel A is flat, has soil that has grown good crops in nearby fields for years, and sits next to a stream that flows year-round. Parcel B is a steep, rocky slope with almost no soil, next to the same stream. Which parcel should become the farm, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Parcel A, because it is flat, has fertile soil, and sits next to a steady water source.', correct: true },
        { id: 'b', text: 'Parcel B, because a rocky slope drains water away quickly, which matters more to crops than soil.' },
        { id: 'c', text: 'Parcel A, because a farm matters more to the town than a park on a steep hillside would.' },
        { id: 'd', text: 'Parcel B, because crops grow best when planted as far from a stream as possible.' },
      ],
      expectedAnswer: 'Parcel A, because it is flat, has fertile soil, and sits next to a steady water source.',
      hints: [
        'Check Parcel B against all three things a farm needs, not just one of them.',
        'Good drainage cannot grow a crop by itself if there is almost no soil, and a farm needs water nearby, not far away from it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-housing-parcel',
      kind: 'try_yourself',
      problem:
        'The Millbrook planning committee is deciding where to place new housing. Parcel C is flat, sits right at the edge of the stream, and has flooded during heavy rains twice in the past few years. Parcel D is also flat, sits a short walk from the same stream on higher ground that has never flooded, and already has a road running along one side. Which parcel should become the new housing, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Parcel C, because a view of the water makes a neighborhood more enjoyable to live in.' },
        { id: 'b', text: 'Parcel D, because it stays dry, unlike Parcel C, and it already connects to a road.', correct: true },
        { id: 'c', text: 'Parcel C, because flat land next to a stream is always the safest place to build.' },
        { id: 'd', text: 'Parcel D, because new housing should never be built anywhere near a stream at all.' },
      ],
      expectedAnswer: 'Parcel D, because it stays dry, unlike Parcel C, and it already connects to a road.',
      hints: [
        'Housing needs to stay dry. Ask which parcel the flooding fact actually rules out.',
        'Parcel D is still fairly near the stream, just farther back and higher up -- the deciding fact is that it does not flood, not that no stream is nearby at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-leftover-parcel',
      kind: 'try_yourself',
      problem:
        'Millbrook has one more piece of land left to plan: a steep, rocky patch of land beside a small pond, with almost no soil and ground too uneven for a building\'s foundation. What is the most sensible land use for this patch, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A farm, because a pond right next to the land would provide the water crops need to grow.' },
        { id: 'b', text: 'Housing, because building close to a pond gives residents a pleasant view every morning.' },
        { id: 'c', text: 'A road, because a road should always run along the edge of a body of water nearby.' },
        { id: 'd', text: 'A park, because the land does not suit farming or building but can still be enjoyed.', correct: true },
      ],
      expectedAnswer: 'A park, because the land does not suit farming or building but can still be enjoyed.',
      hints: [
        'Water nearby is only one of the facts a farm needs. Check the patch against the other two as well.',
        'The ground is described as too uneven for a building\'s foundation, which rules out housing regardless of how pleasant the pond might be.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-most-valuable-and-flooded-forever',
      kind: 'misconception_check',
      question:
        'A student says: "A park should always go on the flattest, most fertile land available, since that is the most valuable land in town. And once land floods one time, it can never be used for anything ever again." What is wrong with each half of that?',
      commonErrors: [
        {
          answer: 'A park should always go on the flattest, most fertile land available, since that is the most valuable land in town.',
          misconception:
            'Assuming the land that seems "best" in general (flat and fertile) should go to whichever use seems most important, rather than matching each piece of land to the use whose specific needs that land actually meets.',
          correctsTo:
            'A park does not need flat, fertile ground -- it can use land unsuited to farming or building, such as land that is steep or rocky. Flat, fertile land next to water is exactly what a farm needs, so giving it to a park instead would waste land a farm requires. WRONG: give the flattest, most fertile land to whichever use seems most valuable. CORRECT: match each piece of land to the use whose stated needs that land\'s own facts actually meet.',
        },
        {
          answer: 'Once land floods one time, it can never be used for anything ever again.',
          misconception:
            'Treating one flooding fact as ruling out every possible use for that land, instead of ruling out only the uses that specifically need to stay dry.',
          correctsTo:
            'Flooding rules out housing, because housing needs to stay dry. It does not rule out every use. A park can often still be enjoyed on land that floods sometimes, since nobody lives there permanently, and the same low ground next to a stream is often exactly where a farm wants to be, since it keeps the water source close by. The fact that decides a use is the fact that use actually needs, not one fact applied the same way to every use at once.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A community planner decides where roads, parks, farms, and housing each go by reading the land, water, and resource facts of each piece of land, not by which use seems most popular.',
        'Land facts fall into three kinds: the shape of the land (flat or steep), the water nearby and whether it can flood, and the resource the land offers, such as fertile soil.',
        'A farm needs flat land, fertile soil, and a reliable water source. Housing needs flat land that stays dry. A road needs to connect places people already travel between. A park can use land unsuited to farming or building.',
        'The same land can suit one use well and suit another poorly -- flat, fertile land near water is ideal for a farm but can be too flood-prone for housing.',
        'A good planning reason names a land, water, or resource fact. A preference, such as "people like the view," is not a planning reason on its own.',
        'One flooding fact rules out only the uses that need to stay dry -- it does not rule out every possible use for that land.',
        'This is the last lesson in the course, and it uses the same skill the course opened with: look closely at the facts about a place before deciding what belongs there.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.4', cedTitle: 'Using Geography to Plan a Community' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
