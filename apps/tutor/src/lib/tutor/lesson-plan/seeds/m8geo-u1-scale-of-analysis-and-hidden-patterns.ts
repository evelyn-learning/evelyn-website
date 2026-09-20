/**
 * Grade 8 World Geography — Geographic Data & Spatial Analysis: Scale of
 * Analysis & Hidden Patterns.
 *
 * CONCEPT-LED row (National Geography Standard 3), shaped on the concept-led
 * exemplar `m8geo-u7-hazard-risk-exposure-and-vulnerability.ts`. The row
 * installs ONE idea -- a figure is always computed over a unit, and the unit
 * is a choice -- and then makes the student USE it on described records
 * twice: first by working the same library-access records at district,
 * regional and national scale and deciding which of two claims each scale
 * can settle, and second by holding four districts fixed and changing only
 * the way they are grouped, which makes a four-to-one pattern vanish. Every
 * item is answered by a computed figure or by a verdict that carries its
 * arithmetic, never by a definition.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause where it is used, that a
 * single figure for a whole place is an average that can hide what is inside
 * it (Grade 7, `m7geo-u3-population-distribution-and-density.ts`, where the
 * idea arrives as density, and `m7geo-u5-levels-of-development.ts`, where it
 * arrives as a national indicator), and re-teaches neither: the words
 * "density", "distribution" and "cluster" appear nowhere in the body, no
 * keyIdea defines an average, and the premise appears once among the six
 * keyIdeas, in a single sentence of keyIdea 1 that then says out loud that
 * the lesson starts one step later. No other use of the word "average" in
 * the body teaches that an average hides variation: the remaining thirteen
 * are the verb, naming either a wrong step or the averaging-away a merge
 * performs; the analytical term "weighted average" and its definition by the
 * operation that produces it; the scope cell's own wording carried verbatim
 * into `los[0].description`; and one item distractor plus its hint, which
 * turn on where an average of parts has to sit. It
 * ADDS computing the same measure at three sizes of unit from one
 * set of records, aggregating small units into a large one by adding the
 * counts and dividing once (rather than averaging the unit percentages),
 * naming which claims each scale can and cannot settle, reporting the spread
 * of the unit figures beside the middle figure, and re-grouping the same
 * districts to test whether a pattern survives the grouping. It STOPS SHORT
 * of the formal names for these two failures -- "fallacy", "modifiable" and
 * "areal" appear nowhere in the body, and the signed curriculum withholds
 * those names for a high-school or AP statistics treatment that no seed in
 * this library currently owns (`UNVERIFIED` for AP Statistics content) --
 * and of statistical inference of every kind: the body contains no
 * "significance", no "sampling", no "margin of error" and names no
 * distribution. It does NOT decide which denominator a claim needs or set
 * one rate against another under two denominators (row 1.1,
 * `counts-rates-and-fair-comparison`) -- it divides counts by a denominator
 * the data hands it and never chooses between two; it does NOT set or
 * re-draw class breaks or judge a map's classing (row 1.2,
 * `evaluating-a-choropleth`; the word "choropleth" occurs in the body only
 * inside the chain loId, which is unavoidable); and it does NOT evaluate a
 * map's projection, symbol sizing, color ordering or title (row 1.4,
 * `maps-as-arguments`) -- no map of any kind appears in this lesson, and the
 * body contains no "projection". Three things ARE deliberately allowed,
 * because neighboring rows sit close and the line has to be drawn precisely
 * rather than avoided: (a) percentages are computed throughout, although
 * CHOOSING the denominator belongs to row 1.1 -- here the denominator is
 * fixed and given in every case (households, homes, students) and the only
 * thing that varies is the AREAL UNIT the records are totaled over, which is
 * the scale effect this row owns and which row 1.1's own guard cedes to it;
 * (b) the word "region" is used for a group of districts as a unit of
 * aggregation, not as the formal/functional/perceptual typology, which is
 * Grade 7 material and is never named here; (c) the second worked example
 * changes the GROUPING and re-runs the arithmetic, which is this row's own
 * contrasting case and not a claim about how boundaries ought to be drawn.
 * Per ruling 33, this row's scope cell carries all three parts -- positive
 * statement, lineage clause and withheld clause -- so none was invented and
 * none is missing.
 *
 * BURNED CELL EXAMPLES (controller ruling 36): the signed scope cell names
 * two specimens -- a national average that is high while every district but
 * one is low, and a regional pattern that vanishes when districts are merged
 * -- and they travel into `los[0].description`. Both are therefore spent in
 * the TEACHING segments (worked example 1 and worked example 2 respectively)
 * and all three items are built on fresh specimens: an unequal-district
 * aggregation, a low national figure concealing one high district, and two
 * regions with identical figures built from very different districts. Do not
 * "helpfully" move a cell specimen into an item later.
 *
 * DEPTH FLOOR NOTE FOR THE FAN-OUT: read each keyIdea and notice what it is
 * ABOUT. None of them says what an average is or that an average hides
 * variation; every one says what you DO about it -- name the unit, add the
 * counts and divide once, match the claim to the scale, report the spread,
 * re-group and re-run, pick the scale from the decision. Test 5 was run
 * against `m7geo-u3-population-distribution-and-density.ts`, whose keyIdeas
 * include "DENSITY IS AN AVERAGE, AND AVERAGES HIDE CLUSTERING"; the closest
 * pair is that one against keyIdea 1 here, and keyIdea 1 survives because
 * its subject is the obligation to name the unit a figure was computed over
 * before reading it, with the average clause as its premise. The Grade 7
 * items were read too: all three of that file's items are answerable by
 * knowing what density and distribution mean, and none of the three items
 * below can be answered without working its numbers.
 *
 * ACCURACY NOTE: no real place is named anywhere in this file. Every
 * country, region, district and figure is invented, chosen so the arithmetic
 * is exact, and every measure is a measurement of service or access, never a
 * judgment about a place or the people in it -- the recap says so out loud.
 * The only claim about the real world is that the units geographers report
 * data over are drawn by people rather than found in nature, which is what
 * the word "district" means.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67
 * percent of the time, and 94 percent at difficulty 4; chance with four
 * choices is 25 percent). The per-item discipline is the point: every
 * distractor below states the full wrong STEP that produces it -- averaging
 * the unit percentages while ignoring unit size, promoting the largest
 * district to stand for the region, dividing the complement, reading a
 * country figure down onto a district, promoting the extreme district to
 * stand for the country, rejecting an average because no unit matches it,
 * comparing a district figure against a regional figure -- and no key was
 * built to be the longest choice BECAUSE it is the key. Measured as a
 * diagnostic and not as a score: the key is the strictly longest choice in
 * none of the three items. Zero is NOT the target; chance alone produces
 * zero or one in a three-item file about 84 percent of the time, and the
 * real measurement is the course-level rate over all 40 files at
 * registration. The three keys sit at ids c, d and b, which is the id set
 * `(1 + 3) mod 4 = 0` requires, omitting a; the four numeric choices in item
 * 1 are ordered by that id rule and never by magnitude.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 1.2 -> 1.3 ->
 * 1.4, and both arrays below carry the real neighboring loIds
 * (`m8geo.evaluating-a-choropleth` and `m8geo.maps-as-arguments`) as the
 * contract's chain table requires. The two exemplars ship empty arrays
 * because they were registered alone, ahead of the fan-out; that is a
 * registration-order artifact and was not copied here.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every table is written out
 * in prose inside the segment that needs it, every place is invented, and
 * every item is solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U1_SCALE_OF_ANALYSIS_AND_HIDDEN_PATTERNS: LessonPlan = {
  id: 'evelyn.ms.m8geo.scale-of-analysis-and-hidden-patterns.v1',
  title: 'Scale of Analysis & Hidden Patterns',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.scale-of-analysis-and-hidden-patterns',
      standard: 'M8GEO-1.3',
      description:
        'Given the same data aggregated at national, regional and local scale, compute or compare the figures at each scale and state which claims each scale can and cannot support: a national average that is high while every district but one is low, or a regional pattern that vanishes when districts are merged (National Geography Standard 3: how to analyze the spatial organization of people, places and environments).',
    },
  ],
  prerequisites: ['m8geo.evaluating-a-choropleth'],
  followUps: ['m8geo.maps-as-arguments'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put a true figure and a contradicting daily experience side by side, so the student needs the unit a figure was computed over before any vocabulary arrives.',
      script:
        'The town website says it plainly: 94 percent of homes in Ardley have a fast internet connection. You live in Ardley. Your video stops to load three times before it gives up, every night after seven, and so does everybody on your street. Somebody is lying, and the strange part is that nobody is. The town counted the homes in every district, added them up and divided once, and 94 percent came out true for Ardley. Your district was counted inside that figure and is not described by it. Every figure is computed over some unit -- a country, a region, a district, a street -- and the unit is a choice somebody made before you ever saw the number. Change the unit and the same records give you a different figure, and the claims the figure can settle change with it. Today you take one set of records, work it at three sizes of unit, and decide which claims survive at each one.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-scale-is-a-choice',
      kind: 'concept',
      goal: 'Install the moves that go with scale of analysis: name the unit, aggregate by adding counts and dividing once, match the claim to the scale, report the spread, re-group and re-run, and let the decision pick the scale.',
      keyIdeas: [
        'NAME THE UNIT BEFORE YOU READ THE FIGURE. One set of records -- how many households there are, and how many of them have the thing being measured -- can be totaled over a street, a district, a region or a whole country, and each size of unit produces a different figure from the very same records. A figure for a whole place is an average, and that is the premise this lesson starts from rather than the point of it: every one of those figures is correct, and none of them is a mistake. The work begins one step later. Say out loud which unit the number was computed over, because a figure with no unit named is not yet information, and then ask what a unit that size is able to say.',
        'TO GO FROM SMALL UNITS UP TO A BIG ONE, ADD THE COUNTS AND DIVIDE ONCE. Never average the unit percentages, because that quietly gives a tiny district the same weight as a huge one. A district of 30,000 households at 10 percent and a district of 10,000 households at 50 percent give 3,000 plus 5,000, which is 8,000 out of 40,000 households, or 20 percent for the two together. Averaging 10 and 50 gives 30 percent, which is the figure for no place on the table. The bigger the unit, the harder it pulls, and adding the counts is what makes it pull the right amount. Check the aggregation by multiplying back: 20 percent of 40,000 is 8,000.',
        'MATCH THE CLAIM TO THE SCALE, BECAUSE THAT IS WHERE CORRECT DATA GOES WRONG. A claim about the whole -- most households in the country are within walking distance of a stop -- is settled by the country figure and by nothing else. A claim about one household, one street or one district is settled only by the figure for the unit that household sits inside. The national figure never travels downward: it cannot tell you about a district, and a district figure never travels upward to stand for the country. So for each claim, name the unit the claim is about, then ask whether you have a figure computed over that unit. If you do not, the honest answer is that the data cannot settle it yet.',
        'THE UNITS WERE DRAWN BY SOMEBODY, SO A PATTERN CAN BE MADE TO APPEAR OR DISAPPEAR WITHOUT ANY DATA CHANGING. Group the same small districts one way and a pattern stands out; group them another way and it is gone. Pair every high district with a low one and the difference averages itself away inside each new unit; keep the high districts together and the difference is the first thing anybody sees. Neither grouping is a lie, and no household moved. So report the grouping along with the figure, and when a pattern is going to be acted on, test whether it survives a different grouping of the same units.',
        'REPORT THE SPREAD, NOT ONLY THE MIDDLE FIGURE. Beside any figure for a large unit, give the highest and the lowest of the units inside it and how many sit near each end. Two countries can both report 60 percent and be built completely differently: one where every district lands near 60, and one where a single large district at 90 percent carries four small districts sitting at 15. The middle figure is identical and the two countries need completely different plans, so a report that gives the middle figure alone has left out the part a planner uses.',
        'THE DECISION PICKS THE SCALE. How much to buy, build or ship for a whole country is a question about a total, and the national figure answers it. Where the next library, clinic or bus route goes is a question about places, and only the finest unit you have can answer that. When somebody hands you a figure at one scale and a decision at another, the move is to say which unit the decision needs a figure for, and to ask for that figure rather than stretching the one you were given.',
      ],
      vocabulary: [
        {
          term: 'scale of analysis',
          definition:
            'the size of the unit a figure is computed over -- street, district, region or country -- chosen by whoever makes the figure, before anybody reads it.',
        },
        {
          term: 'aggregate',
          definition:
            'to combine the records of several smaller units into one figure for a larger unit, by adding the counts and then dividing once.',
        },
        {
          term: 'weighted average',
          definition:
            'an average in which each unit counts in proportion to its size, which is exactly what adding the counts and dividing once produces.',
        },
        {
          term: 'grouping',
          definition:
            'the choice of which smaller units are combined into each larger one, made by whoever draws the boundary rather than by the data.',
        },
        {
          term: 'spread',
          definition:
            'the distance between the highest and the lowest figure among the units inside a larger unit, reported beside that larger unit\'s figure.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-three-scales-one-claim-each',
      kind: 'worked_example',
      problem:
        'Work one set of records at three sizes of unit, then decide which of two claims each scale can settle.\n\n"Mersaine has five districts and two regions. The Harbor region is the single district of Harbor. The Interior region is the other four districts: Kelm, Needle, Ostry and Pell.\n\nHarbor: 60,000 households, 54,000 of them within 2 kilometers of a public library.\n\nKelm, Needle, Ostry and Pell: 10,000 households each, 1,500 of them within 2 kilometers of a public library in each one."\n\nClaim A, from a national newspaper: "Most households in Mersaine live within 2 kilometers of a library." Claim B, from the same article: "A household in Ostry is probably within 2 kilometers of a library."',
      steps: [
        'Start at the finest unit, the district, because the coarser figures are built out of it. Harbor: 54,000 divided by 60,000 is 0.90, which is 90 percent. Kelm: 1,500 divided by 10,000 is 0.15, which is 15 percent, and Needle, Ostry and Pell are each 15 percent for the same reason. So the district figures are 90, 15, 15, 15 and 15.',
        'Move up to the regional unit by adding the counts and dividing once. The Harbor region holds one district, so it stays at 90 percent. The Interior region: 1,500 plus 1,500 plus 1,500 plus 1,500 is 6,000 households served, out of 10,000 plus 10,000 plus 10,000 plus 10,000, which is 40,000 households. 6,000 divided by 40,000 is 0.15, which is 15 percent.',
        'Move up to the national unit the same way. Served households: 54,000 plus 6,000 is 60,000. Total households: 60,000 plus 40,000 is 100,000. 60,000 divided by 100,000 is 0.60, which is 60 percent. WRONG: "Average the five district figures: 90 plus 15 plus 15 plus 15 plus 15 is 150, and 150 divided by 5 is 30 percent, so the national figure must be 30." CORRECT: "Add the counts and divide once: 60,000 served out of 100,000 households is 60 percent. The five districts are not the same size, so they cannot each count equally -- Harbor alone holds 60,000 of the 100,000 households."',
        'Invert every figure to check it. 90 percent of 60,000 is 54,000. 15 percent of 10,000 is 1,500, and four of those is 6,000. 15 percent of 40,000 is 6,000. 60 percent of 100,000 is 60,000, and 54,000 plus 6,000 is 60,000. Every count comes back, so no zero slipped.',
        'Now take the claims one at a time and name the unit each one is about. Claim A says "most households in Mersaine", which is a claim about the country, and the country figure is 60 percent. More than half of 100,000 households is more than 50,000, and 60,000 households are served, so claim A is SUPPORTED, at the national scale, and only there. Claim B says "a household in Ostry", which is a claim about one district, so it needs Ostry\'s own figure, which is 15 percent. Fifteen percent is not probable; 85 percent of households in Ostry are farther than 2 kilometers. Claim B is NOT SUPPORTED. Same records, same day, two claims, two scales, two different verdicts.',
        'Three clues of different kinds say the national figure describes one district and no other. First, where the served households are: 54,000 of the 60,000 served households sit in Harbor, and 54,000 divided by 60,000 is 0.90, so 90 percent of everything the library network reaches is in one district. Second, how much weight that district carries: Harbor holds 60,000 of the 100,000 households, which is 60 percent of the country, so its own figure nearly sets the national one by itself. Third, the spread across the units: the district figures run from 90 percent down to 15 percent, a spread of 75 percentage points, and four of the five districts sit at the bottom of it. One number is a hunch; three of different kinds, all pointing the same way, is evidence.',
        'Say the verdict in one line. The national figure of 60 percent is correct, it settles a national claim, and it describes exactly one of the five districts. A report that gives 60 percent and stops has told the truth and hidden the thing a planner needs: four districts at 15 percent.',
      ],
      answer:
        'District figures: Harbor 90 percent (54,000 divided by 60,000), and Kelm, Needle, Ostry and Pell 15 percent each (1,500 divided by 10,000). Regional figures: Harbor region 90 percent, Interior region 15 percent (6,000 divided by 40,000). National figure: 60 percent (60,000 divided by 100,000), not the 30 percent that averaging the five district percentages would give. Claim A is supported at the national scale, because 60,000 of 100,000 households is more than half. Claim B is not supported, because Ostry is a district and its own figure is 15 percent.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-regrouping-makes-a-pattern-vanish',
      kind: 'worked_example',
      problem:
        'Hold the data completely still and change only the grouping, then evaluate what happened to the pattern.\n\n"Callant is a county of four districts, each with 10,000 homes: Northwest, Northeast, Southwest and Southeast. Homes with no piped water connection: Northwest 800, Northeast 200, Southwest 800, Southeast 200.\n\nCallant runs its water service through two water boards, West (Northwest and Southwest) and East (Northeast and Southeast), and its schools through two school boards, North (Northwest and Northeast) and South (Southwest and Southeast)."',
      steps: [
        'District scale first. Northwest: 800 divided by 10,000 is 0.08, which is 8 percent. Northeast: 200 divided by 10,000 is 0.02, which is 2 percent. Southwest is 8 percent and Southeast is 2 percent, by the same division. The pattern at this scale is plain: the two western districts are at 8 percent and the two eastern districts are at 2 percent, which is four times as high in the west.',
        'County scale next. 800 plus 200 plus 800 plus 200 is 2,000 homes with no piped water, out of 40,000 homes. 2,000 divided by 40,000 is 0.05, which is 5 percent. At the county scale there is one figure and no pattern at all, and 5 percent is the figure for neither an 8 nor a 2.',
        'Regional scale, grouping one: the water boards. West: 800 plus 800 is 1,600 homes, out of 20,000 homes, and 1,600 divided by 20,000 is 0.08, which is 8 percent. East: 200 plus 200 is 400 homes out of 20,000, and 400 divided by 20,000 is 0.02, which is 2 percent. The four-to-one pattern survives this grouping exactly, because it keeps the two high districts together.',
        'Now change ONE input -- the grouping, and nothing else -- and run it again. Regional scale, grouping two: the school boards. North: 800 plus 200 is 1,000 homes out of 20,000, and 1,000 divided by 20,000 is 0.05, which is 5 percent. South: 800 plus 200 is 1,000 out of 20,000, which is 5 percent as well. The two regions are identical. The pattern has vanished, and not one home changed, and no number in the records changed. Each new unit was handed one high district and one low district, and the merge averaged the difference away inside it.',
        'Rewind the input and read the four district counts backwards to be sure nothing was misread: 200 Southeast, 800 Southwest, 200 Northeast, 800 Northwest. The two 800s are the two western districts. That is the whole explanation of both results: a grouping that keeps the 800s together shows the gap, and a grouping that splits them apart hides it.',
        'Invert to check the arithmetic. 8 percent of 20,000 is 1,600, and 2 percent of 20,000 is 400, so the water-board figures return their counts. 5 percent of 20,000 is 1,000, twice, so the school-board figures return theirs. 5 percent of 40,000 is 2,000, which is the county total, and 1,600 plus 400 is 2,000 while 1,000 plus 1,000 is 2,000 as well. Both groupings recover the same county total, which is what tells you the two answers are the same data and not two datasets.',
        'The verdict. WRONG: "North and South both report 5 percent, so the need for piped water is even across Callant." CORRECT: "North and South both report 5 percent because each of them contains one district at 8 percent and one at 2 percent; at the district scale the figures run from 2 to 8, and the western districts have four times the need of the eastern ones." Report the grouping with the figure, and before acting on a pattern, check whether it survives a different grouping of the same units.',
      ],
      answer:
        'District scale: Northwest 8 percent, Southwest 8 percent, Northeast 2 percent, Southeast 2 percent. County scale: 2,000 of 40,000 homes, which is 5 percent, showing no pattern. Grouped as water boards, West is 1,600 of 20,000, which is 8 percent, and East is 400 of 20,000, which is 2 percent, so the four-to-one pattern survives. Grouped as school boards, North is 1,000 of 20,000 and South is 1,000 of 20,000, both 5 percent, so the pattern vanishes entirely. The records never changed; only the grouping did, and both groupings add back to the same 2,000 homes.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-aggregate-unequal-districts',
      kind: 'try_yourself',
      problem:
        'A region reports the share of its students who walk to school, district by district.\n\n"Dunmere: 2,000 students, 80 percent walk. Estcote: 2,000 students, 50 percent walk. Fallow: 6,000 students, 20 percent walk."\n\nWhat is the figure for the region as a whole?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '50 percent, found by averaging the three district figures of 80, 50 and 20 percent and dividing that total by the three districts' },
        { id: 'b', text: '20 percent, found by taking the figure for Fallow, which holds more students than the other two districts put together' },
        { id: 'c', text: '38 percent, found by adding the walkers, 1,600 and 1,000 and 1,200, and dividing the 3,800 by the 10,000 students', correct: true },
        { id: 'd', text: '62 percent, found by adding the students in each district who do not walk and dividing that total by the 10,000 students' },
      ],
      expectedAnswer: '38 percent, found by adding the walkers, 1,600 and 1,000 and 1,200, and dividing the 3,800 by the 10,000 students',
      hints: [
        'The three districts are not the same size, so work out how many students actually walk in each one before you go anywhere near a regional percentage.',
        'Multiply each district share by that district\'s own number of students, add the three counts, then divide by the 10,000 students in the region and multiply your answer back by 10,000 to check it. Averaging the three percentages ignores how big each district is, taking the largest district figure lets one district stand for the region, and dividing the students who do not walk answers the opposite question.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-claim-does-the-scale-support',
      kind: 'try_yourself',
      problem:
        'Brisal has four districts with the same number of homes. The share of homes that are more than 30 minutes from the nearest clinic is 1 percent in Larrow, 1 percent in Meade, 2 percent in Nye and 20 percent in Orrin. For the country as a whole the figure is 6 percent. Which reading does the data support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Each district needs help sized for about 6 percent of its homes, because 6 percent is the figure for the country and every district sits inside the country' },
        { id: 'b', text: 'Every district needs help sized for 20 percent of its homes, because the highest district figure is the one that shows what the country is really like' },
        { id: 'c', text: 'The country figure must be wrong, because 6 percent is higher than the figure in three of the four districts and an average cannot sit above most of its parts' },
        { id: 'd', text: 'The country figure of 6 percent is right and describes no district: three districts sit at 1 or 2 percent, and the need is concentrated in Orrin at 20 percent', correct: true },
      ],
      expectedAnswer: 'The country figure of 6 percent is right and describes no district: three districts sit at 1 or 2 percent, and the need is concentrated in Orrin at 20 percent',
      hints: [
        'Check the country figure for yourself first: the four districts hold the same number of homes, so add the four district shares and divide by four. Then ask, for each reading, which unit it is making a claim about.',
        'One district at 20 percent alongside districts at 1, 1 and 2 percent is exactly what a country figure of 6 percent can be built from: 1 plus 1 plus 2 plus 20 is 24, and 24 divided by 4 is 6. A country figure does not describe each district, the highest district does not describe the country either, and an average of parts always sits between the lowest part and the highest one.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-same-figure-different-insides',
      kind: 'try_yourself',
      problem:
        'Nerith has two regions, and each region has two districts with the same number of homes. In the Sable region, the share of homes within a 10-minute walk of a bus stop is 70 percent in Alder and 30 percent in Brant. In the Torrin region it is 52 percent in Crale and 48 percent in Dunn. Both regions therefore report 50 percent. A transit report says: "The two regions are served equally well, and inside each region the service is about the same from district to district." Which reading does the data support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The report is right on both counts, because each region comes out at 50 percent and a regional figure covers every district that sits inside it' },
        { id: 'b', text: 'The report is right that both regions reach 50 percent and wrong about Sable, whose districts are 70 and 30 percent while Torrin\'s are 52 and 48', correct: true },
        { id: 'c', text: 'The report is wrong because Torrin is the better served region, since its 52 percent in Crale is higher than the 50 percent reported for Sable' },
        { id: 'd', text: 'The report is wrong because Sable cannot report 50 percent, since neither of the two districts inside it is anywhere near 50 percent on its own' },
      ],
      expectedAnswer: 'The report is right that both regions reach 50 percent and wrong about Sable, whose districts are 70 and 30 percent while Torrin\'s are 52 and 48',
      hints: [
        'Work out each region figure from its two districts, then compare the two districts inside a region with each other rather than with the region they sit in.',
        'Two regions can land on the same figure and be built from completely different districts: hold 70 and 30 next to 52 and 48. Reading a regional figure down onto its districts, comparing one district against a whole other region, and calling a regional figure impossible because no district matches it are three different ways of crossing scales.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-read-down-and-equal-groups',
      kind: 'misconception_check',
      question:
        'A student who has seen the Mersaine and Callant data writes two sentences. On Mersaine: "The country is at 60 percent, so my district is at about 60 percent too." On Callant: "North and South both come out at 5 percent, so the water problem is spread evenly across the county." What is wrong with each one?',
      commonErrors: [
        {
          answer: 'The country is at 60 percent, so my district is at about 60 percent too.',
          misconception:
            'Reading a figure downward onto a smaller unit, as though a country figure were a promise made to every district inside it. The student treats the national number as a description of each part, when it is a single weighted average of parts that can be nothing like each other.',
          correctsTo:
            'The national figure is a weighted average and it travels in one direction only: upward, out of the districts. In Mersaine, 60,000 of 100,000 households are within 2 kilometers of a library, which is 60 percent for the country. Harbor district is 54,000 of 60,000, which is 90 percent, and each of Kelm, Needle, Ostry and Pell is 1,500 of 10,000, which is 15 percent. WRONG: "The country is at 60 percent, so my district is about 60 percent." CORRECT: "The country is at 60 percent, and the district figures are 90, 15, 15, 15 and 15, so unless I am in Harbor my district is at 15 percent." To answer a claim about a district, get the figure computed over that district; the country figure cannot settle it, and no amount of correct national arithmetic will make it.',
        },
        {
          answer: 'North and South both come out at 5 percent, so the water problem is spread evenly across the county.',
          misconception:
            'Treating a grouping as if it came with the data. Two merged units matching each other is read as evidence about the ground, when it is evidence about which districts were put together, and the pattern inside each merged unit is never checked.',
          correctsTo:
            'The two figures match because of how the districts were paired, not because the county is even. North is Northwest at 800 homes plus Northeast at 200 homes, which is 1,000 of 20,000 homes, or 5 percent, and South is Southwest at 800 plus Southeast at 200, which is also 1,000 of 20,000, or 5 percent. Each of those two units was handed one district at 8 percent and one at 2 percent. Group the very same four districts as West and East instead and West is 1,600 of 20,000, which is 8 percent, against East at 400 of 20,000, which is 2 percent -- four times as high in the west, from records that never changed. WRONG: "The two regions match, so the county is even." CORRECT: "The two regions match because each contains one high district and one low district; at the district scale the figures run from 2 percent to 8 percent." Before believing a pattern, or believing that there is none, ask how the units were grouped and re-run the arithmetic on a different grouping.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every figure is computed over a unit, and the unit is a choice. Name the unit -- street, district, region, country -- before you read the number, because a figure with no unit named is not yet information.',
        'To aggregate small units into a big one, add the counts and divide once. Averaging the unit percentages gives a tiny district the same weight as a huge one: 90, 15, 15, 15 and 15 average to 30 percent, while the counts give 60,000 of 100,000, which is 60 percent.',
        'Match the claim to the scale. A claim about the country is settled by the country figure; a claim about a household or a district needs the figure for the unit it sits in. A national figure never travels down onto a district, and a district figure never travels up to stand for the country.',
        'Report the spread beside the middle figure: the highest unit, the lowest unit, and how many sit at each end. Two places reported at the same 60 percent can be built completely differently and need completely different plans.',
        'The groupings were drawn by somebody. Pair each high district with a low one and the difference averages away inside the new unit; keep the high districts together and it stands out. Callant is 8, 8, 2 and 2 at district scale, 8 against 2 grouped one way, and 5 against 5 grouped the other, from records that never changed.',
        'Check every aggregation by multiplying back: 8 percent of 20,000 homes is 1,600, and the groupings must all add back to the same county total.',
        'Let the decision pick the scale: a total to buy or ship is a national question, and where to put the next library, clinic or bus route is a question only the finest unit you have can answer.',
        'These figures measure service and access in a place. They are never a score for a place or for the people who live in it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.3', cedTitle: 'Scale of Analysis & Hidden Patterns' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
