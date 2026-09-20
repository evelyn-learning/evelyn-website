/**
 * Grade 8 World Geography — Climate Risk, Hazards & Resilience: Reading
 * Climate Trend Data.
 *
 * PROCEDURE-LED row (National Geography Standard 7), shaped on the
 * procedure-led exemplar `m8geo-u1-counts-rates-and-fair-comparison.ts`: the
 * concept segment is a short ordered routine over described data, the first
 * worked example runs the routine straight through on a claim and ends with
 * the REWIND-AND-CONTRASTING-CASE check move, the second reaches a verdict
 * and ends with the THREE-INDEPENDENT-CLUES-OF-DIFFERENT-KINDS check move
 * (and carries a one-input contrasting case in addition). Every change, every
 * step and every per-place average is inverted where it is computed, and both
 * worked examples close their arithmetic.
 *
 * THE ROUTINE, in the order it is always run:
 *   1. Read the baseline and the sign. A departure is a difference from a
 *      chosen baseline; 0.0 means equal to it, not "nothing happened".
 *   2. STEP. Last block average minus first block average, divided by the
 *      number of GAPS between blocks (four decade averages give three gaps).
 *   3. SWING. A single year minus the average of its own block.
 *   4. Compare the step with the swing, and give the verdict on the claim --
 *      block averages settle a trend; a pair of single years never does.
 *   5. Invert: first average plus the change recovers the last average; the
 *      step times the gaps recovers the change.
 *   Then change ONE input and run it again. Where the figure covers many
 *   places, run the routine per place and confirm the differences from the
 *   overall figure cancel to zero.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause where it is used, that
 * climate is the long-run pattern while a single year is one wobble inside
 * it (Grade 7, `m7geo-u2-weather-climate-and-factors.ts`), and re-teaches
 * neither that distinction nor the five controls on climate: the premise
 * appears exactly once, as the opening clause of keyIdea 2 where it is used;
 * no other keyIdea, step, item or recap line touches that distinction, the
 * word weather does not occur in the authored body at all, and neither do
 * latitude, elevation, ocean current or rain shadow. It ADDS
 * computing a STEP from block averages (including the gaps-not-blocks
 * divisor), computing a SWING for a named year against its own block
 * average, measuring exactly what a cherry-picked pair of years buys (the
 * two swings added together), re-baselining a record to show that every
 * departure shifts together while no difference between them moves,
 * quantifying why ten-year averaging works (one unusual year moves its own
 * ten-year average by a tenth of its distance from the rest), and running
 * the routine per region so that an overall figure is read as an average
 * whose differences cancel to zero. It STOPS SHORT of radiative-forcing
 * arithmetic and of any attribution question -- nothing in this file weighs
 * how much heat a gas holds or works out how much of any record the
 * mechanism accounts for -- and of statistical inference: the words
 * significance, sample, trend line and error bar do not appear, and no item
 * asks whether a change is large enough to be believed. It does NOT count
 * exposure by elevation band or price a coastal response (row 7.3,
 * `coastal-risk-and-sea-level`), does NOT multiply hazard by exposure by
 * vulnerability or rank places by risk (row 7.1,
 * `hazard-risk-exposure-and-vulnerability`), does NOT classify an action as
 * mitigation or adaptation (row 7.4, `mitigation-adaptation-and-resilience`),
 * and names NO hazard region (row 3.4) and NO climate control by name (row
 * 3.2, `north-america-climate-controls-in-action`, whose own guard cedes the
 * mechanism paragraph to this row). Two things ARE deliberately allowed,
 * because the line has to be drawn rather than avoided: (a) keyIdea 6 is a
 * one-paragraph greenhouse mechanism at DEFINE depth -- sunlight warms the
 * surface, the surface gives off heat, certain gases hold some of it in,
 * more of those gases hold in more -- which is below this course's floor
 * everywhere else and is carried here alone, because no middle-school
 * science course owns it (`m6sci` 10.1-10.2 give the carbon cycle and the
 * evidence only; `m8sci` excludes climate by design) and this row's scope
 * line states the absorption; it is stated, never computed with, and no item
 * is answered by it; and (b) the far north, dry regions and low coasts are
 * named QUALITATIVELY in keyIdea 5 as places that do not get the same change
 * out of one overall figure, which this row's scope line states; the Arctic
 * is named once, in the objective, and carries no figure -- every FIGURE in
 * the file belongs to an invented station, country or region.
 *
 * The scope cell carries all three parts: the positive statement, a lineage
 * clause ("Deepens G7 2.3 ...") and a withheld clause ("no radiative-forcing
 * arithmetic; no attribution debate"). Parts two and three live in this
 * guard only.
 *
 * BURNED BY THE OBJECTIVE (ruling 32/36): `los[0].description` is rendered to
 * the student, so the concrete things it names are unavailable as item
 * answers -- the four series types, the coasts/dry regions/Arctic trio, the
 * sentence that one cold year does not reverse a warming trend, and the
 * mechanism's three gases. No item below is answered by any of them: item 1
 * keys on two subtractions against two decade averages, item 2 on a ratio of
 * a swing to a step, item 3 on an average of three regional figures. Do not
 * "helpfully" rewrite one of them into an item later.
 *
 * ACCURACY NOTE: every station, country and region in this file is invented
 * and every figure was written for the arithmetic. The only claims about the
 * real world are that the far north, dry regions and low coasts are not
 * changed equally by one overall figure (this row's scope line), that a
 * departure is a difference from a chosen baseline and that re-choosing the
 * baseline shifts all of them together (arithmetic), and the define-depth
 * mechanism in keyIdea 6. No real place carries a number anywhere.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, and 94% at difficulty 4; chance with four choices is 25%).
 * Every distractor states the full wrong STEP that produces it -- two single
 * years compared directly, a 0.0 departure read as a statement about the
 * whole record, extreme years offered as the fair way to compare decades,
 * four decade averages divided by four instead of by three gaps, a negative
 * figure subtracted as though it were positive, a swing measured from the
 * block average instead of from the coolest year, three regional figures
 * added instead of averaged. Measured as a diagnostic, not as a score: the
 * key is the strictly longest choice in ZERO of the three items (item 1's key
 * ranks second of four, item 2's second, item 3's joint-longest and so not
 * strictly longest), and -- against the inverted tell ruling 16 warns about --
 * the key is the SHORTEST choice in none of them either. Zero is NOT the
 * target and three items cannot
 * distinguish chance from bias; the meaningful figure is the 120-item course
 * rate taken at registration. The three keys sit at ids a, c and d, which is
 * the set `(7 + 2) mod 4 = 1` requires, omitting b. The numeric choices are
 * ordered by that id rule and never by magnitude.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every series is written out
 * in prose inside the segment that needs it, and every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U7_READING_CLIMATE_TREND_DATA: LessonPlan = {
  id: 'evelyn.ms.m8geo.reading-climate-trend-data.v1',
  title: 'Reading Climate Trend Data',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.reading-climate-trend-data',
      standard: 'M8GEO-7.2',
      description:
        'Given a multi-decade series (annual temperature departures, sea level, ice extent, frost-free days), distinguish a long-run trend from year-to-year variability, explain why one cold year does not reverse a warming trend and why climate is defined over decades, describe from regional data how impacts fall unevenly (coasts, dry regions, the Arctic), and explain in one paragraph how sunlight warms the surface, the surface gives off heat, certain gases in the air (carbon dioxide, water vapor and methane) hold some of that heat in, and more of those gases hold in more heat (National Geography Standard 7: the physical processes that shape the patterns of Earth\'s surface).',
    },
  ],
  prerequisites: ['m8geo.hazard-risk-exposure-and-vulnerability'],
  followUps: ['m8geo.coastal-risk-and-sea-level'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put a one-year argument next to a multi-decade record, and name the two numbers that settle it, before any vocabulary arrives.',
      script:
        'Every winter somebody posts a photo of a car buried to the mirrors in snow, captioned: so much for a warming world. Every summer somebody posts a cracked, dried-out field, captioned: there it is. Both posts are doing the same thing to a record that only says anything across decades -- they are reading one year off it. There is a test that settles arguments like that, and it is arithmetic you can already do. Any record of yearly figures gives you two numbers. The first is the STEP: how far the ten-year averages move from one decade to the next. The second is the SWING: how far a single year can sit above or below the average of its own decade. Today you compute both, on records written out for you, and you find out that the swing is usually the bigger of the two -- which is exactly why one cold year settles nothing, and why one hot year settles nothing either.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-step-and-swing',
      kind: 'concept',
      goal: 'Install the step-and-swing routine for reading a multi-decade series, the baseline rule that comes before it, and the per-place run that an overall figure hides.',
      keyIdeas: [
        'EVERY SERIES GIVES YOU TWO NUMBERS, AND YOU NEED BOTH OF THEM. The STEP is how far the multi-year averages move from one block to the next: subtract the earlier block average from the later one, then divide by the number of GAPS between the blocks -- four decade averages have three gaps between them, not four. The SWING is how far a single year sits from the average of its own block: subtract the block average from that year. The step is the trend. The swing is the year-to-year variability. Almost every argument about a climate record is somebody holding up one of these two numbers and calling it the other, so compute both before you say anything about the record.',
        'COMPARE BLOCKS OF YEARS, NEVER A PAIR OF YEARS, AND THE ARITHMETIC SHOWS WHY. Climate is the long-run pattern and a single year is one wobble inside it, so a record gets read in decade averages. Here is what happens when it does not. The swing is usually bigger than the step, so somebody who picks the warmest year from the early end and the coolest year from the late end can make a rising record produce a falling answer, and every figure they used is real. The size of that trick is not a mystery either: it is the two swings added together. So when a claim rests on two named years, do not argue about those years. Find the block averages and run the comparison again.',
        'READ THE BASELINE AND THE SIGN BEFORE YOU COMPARE ANYTHING. Yearly figures often arrive as DEPARTURES: how far each year sat above or below a fixed baseline average chosen for that record. A departure of -0.3 degrees does not mean the year was cold; it means the year averaged 0.3 degrees below that record baseline, and a hot desert year can have a negative departure. A departure of 0.0 does not mean nothing has happened; it means that year matched the baseline exactly. And because the baseline is a choice, re-choosing it shifts every departure in the record by the same amount and changes no difference between them -- which is why two records built on different baselines can be compared on their CHANGES and never on their departures set side by side.',
        'THE ROUTINE IS THE SAME FOR EVERY SERIES; ONLY THE DIRECTION THAT COUNTS CHANGES. Sea level in centimeters, ice extent in square kilometers, frost-free days in days, temperature departures in degrees: in every one of them you take block averages, subtract for the step, subtract again for the swing, and compare the two. What changes is which direction is the interesting one, and a falling series is read with exactly the same arithmetic as a rising one -- a step of -300 square kilometers of ice per decade is as much a trend as a step of +0.2 degrees, and the minus sign is the whole of the difference. Check the units before the arithmetic: days and degrees do not go into the same subtraction.',
        'ONE OVERALL FIGURE IS AN AVERAGE OF PLACES THAT MOVED BY DIFFERENT AMOUNTS, SO RUN THE ROUTINE PER PLACE. A single figure for a whole country is built by averaging its places, and averaging is exactly the operation that hides how far apart they are. Take each place, subtract the overall figure from it, and look at what is left: the amounts above and the amounts below have to cancel to zero, because that is what an average is. The far north, dry regions and low coasts do not get the same change out of one overall figure, so a plan written from the overall figure alone is wrong for most of the places it covers. The overall figure is arithmetic done ON the places, not a quantity each place holds.',
        'WHY A RECORD LIKE THIS TRENDS AT ALL, IN ONE PARAGRAPH. Sunlight passes through the air and warms the surface of the land and the sea. The warmed surface gives off heat of its own. Certain gases in the air -- carbon dioxide, water vapor and methane among them -- hold some of that heat in rather than letting all of it pass out to space, which is why the surface is warmer than it would be if the air held none of them. More of those gases in the air hold in more of that heat. That is the mechanism, and this lesson stops there: it does not weigh how much heat each gas holds, it does not work out how much of any particular record the mechanism accounts for, and no question below asks you to. It is here so that a trend you read in a record is not a mystery. The reading itself is still done with the step and the swing.',
      ],
      vocabulary: [
        {
          term: 'trend',
          definition:
            'the direction and size of the change in a series, found by subtracting an early block average from a later block average and dividing by the number of gaps between the blocks.',
        },
        {
          term: 'year-to-year variability',
          definition:
            'how far single years sit above and below the average of their own block, found by subtracting the block average from the year.',
        },
        {
          term: 'departure',
          definition:
            'a year written as the difference between that year and a fixed baseline average, so that a positive figure sits above the baseline and a negative figure sits below it.',
        },
        {
          term: 'baseline',
          definition:
            'the fixed average a record measures its departures from; re-choosing it shifts every departure by the same amount and changes none of the differences between them.',
        },
        {
          term: 'decade average',
          definition:
            'the average of the ten years in one block, used in place of any single year because one unusual year can move it by only a tenth of that year\'s own distance from the rest.',
        },
        {
          term: 'frost-free season',
          definition:
            'the count of days in a year between the last freeze of spring and the first freeze of the following fall.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-routine-on-a-series',
      kind: 'worked_example',
      problem:
        'Run the routine straight through on a claim built from two years.\n\nVellmar Station has kept a temperature record for forty years, and each year is written as a departure from the station long-run baseline. The sheet gives the average departure for each decade, oldest first: -0.2 degrees, 0.0 degrees, +0.2 degrees, +0.4 degrees. It also names two single years: the warmest year of the first decade, at +0.2 degrees, and the coolest year of the fourth decade, at +0.1 degrees.\n\nA post online sets those two years side by side: "Vellmar was warmer forty years ago than it is now, so whatever was happening at this station has reversed." Test the claim.',
      steps: [
        'Name the two numbers before touching the claim. The step is how far the decade averages move from one decade to the next. The swing is how far a single year sits from the average of its own decade. The post used two single years, which is neither of those, so expect it to be measuring the swing and calling it the step.',
        'Compute the step. Last decade average minus first: 0.4 minus -0.2 is 0.6 degrees across the record. Four decade averages have three gaps between them, so the step is 0.6 divided by 3, which is 0.2 degrees per decade. Check each gap by hand: -0.2 to 0.0 is 0.2, 0.0 to +0.2 is 0.2, +0.2 to +0.4 is 0.2. Three equal steps, all in the same direction.',
        'Compute the swing for each of the two years the post used. The warmest year of the first decade is +0.2 against a decade average of -0.2: 0.2 minus -0.2 is 0.4, so that year sits 0.4 degrees ABOVE its own decade. The coolest year of the fourth decade is +0.1 against a decade average of +0.4: 0.4 minus 0.1 is 0.3, so that year sits 0.3 degrees BELOW its own decade.',
        'Run the post comparison, then the right one. The post: 0.1 minus 0.2 is -0.1, a fall of 0.1 degrees. The decade averages: 0.4 minus -0.2 is 0.6, a rise of 0.6 degrees. WRONG: "The newer of the two years is the cooler one, so the station has cooled." CORRECT: "The decade averages rose 0.6 degrees, and the two years quoted are a high year and a low year taken from opposite ends of the record."',
        'Check that the two answers differ by exactly what the picking bought. The gap between them is 0.6 minus -0.1, which is 0.7 degrees. The two swings were 0.4 above and 0.3 below, and 0.4 plus 0.3 is 0.7. The arithmetic closes, so nothing was misread: the whole of the disagreement is the choice of those two years, and none of it is in the record.',
        'Invert every computation. First decade average plus the change: -0.2 plus 0.6 is +0.4, which is the fourth decade average, so the change is right. Step times gaps: 0.2 times 3 is 0.6, so the step is right. Post answer plus the picking: -0.1 plus 0.7 is 0.6, which returns the true change, so both swings are right.',
        'Say why the record is read in decades, with the ratio. One of those years sat 0.4 degrees from its own decade average while a whole decade of trend moves 0.2: 0.4 divided by 0.2 is 2, so one unusual year is worth two decades of the step. A pair of single years twenty years apart can therefore come out in either order while the record rises the whole time. A ten-year average cannot do that, because one unusual year is only one of the ten figures inside it.',
        'Rewind the input, then change one thing. Read the four decade averages backwards -- +0.4, +0.2, 0.0, -0.2 -- and each gap is 0.2 the other way, so nothing was misread. Now change ONE input: suppose the first decade had averaged +0.4 rather than -0.2, with the rest of the sheet unchanged. The record reads +0.4, 0.0, +0.2, +0.4, the change across it is 0.4 minus 0.4, which is 0.0, and the three gaps are -0.4, then +0.2, then +0.2. The honest verdict on that record is that it fell and climbed back and ended where it started. Same routine, opposite answer, which is what makes it a test rather than a conclusion hunting for data.',
      ],
      answer:
        'The claim is not supported. The decade averages are -0.2, 0.0, +0.2 and +0.4, so the record rose 0.6 degrees, which is a step of 0.2 degrees per decade across three gaps. The two years quoted are the warmest of the first decade, sitting 0.4 above its decade average, and the coolest of the fourth, sitting 0.3 below its own; picking that pair moves the answer by 0.4 plus 0.3, which is 0.7 degrees, and turns a rise of 0.6 into a fall of 0.1. One year can sit 0.4 from its decade average while a decade of trend moves only 0.2, which is why the record is read in decade averages and not in years.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-one-figure-three-regions',
      kind: 'worked_example',
      problem:
        'A single figure covers three places. Decide what it can and cannot say about each of them.\n\nValdon is made of three regions of equal area, and its national record says the country as a whole warmed 0.9 degrees from the first decade of the record to the latest. A regional newsletter writes: "Valdon has warmed 0.9 degrees, so every part of Valdon has the same 0.9 degrees of extra warmth and every part will see the same change in its growing season."\n\nThe three regional records give:\n\n"Norhalt, a far northern region where the ground freezes deep each winter: warmed 1.8 degrees; frost-free season 96 days in the first decade, 124 days in the latest.\n\nDunmar Basin, a dry inland region: warmed 0.6 degrees; frost-free season 180 days, then 192 days.\n\nBrackwater Coast, a low coastal plain: warmed 0.3 degrees; frost-free season 246 days, then 252 days."\n\nTest the claim.',
      steps: [
        'Confirm first that the national figure is the average of the three, because a claim can only be tested against a figure you understand. The regions are equal in area, so average them: 1.8 plus 0.6 plus 0.3 is 2.7, and 2.7 divided by 3 is 0.9 degrees. Invert: 0.9 times 3 is 2.7. The national figure is right. What is wrong is what the newsletter takes it to mean.',
        'First clue. Subtract the national figure from each region and see what the average was hiding. Norhalt: 1.8 minus 0.9 is +0.9. Dunmar Basin: 0.6 minus 0.9 is -0.3. Brackwater Coast: 0.3 minus 0.9 is -0.6. Those three differences have to cancel, because that is what an average is, and they do: 0.9 minus 0.3 minus 0.6 is 0.0. Not one of the three regions changed by the national figure, and the spread runs from 1.8 down to 0.3, which is a factor of 6, since 1.8 divided by 0.3 is 6.',
        'Second clue, from a different measurement entirely. The frost-free counts are days between freezes rather than degrees, and they come off a different record: Norhalt, 124 minus 96 is 28 days longer; Dunmar Basin, 192 minus 180 is 12 days longer; Brackwater Coast, 252 minus 246 is 6 days longer. Check by adding back: 96 plus 28 is 124, 180 plus 12 is 192, 246 plus 6 is 252.',
        'Third clue. The two measurements rank the three regions in the same order. By warming: Norhalt, then Dunmar Basin, then Brackwater Coast. By days gained: Norhalt 28, Dunmar Basin 12, Brackwater Coast 6 -- the same order. Two different quantities, read from two different records, putting the regions in one order is evidence; either one on its own would be a hunch.',
        'Give the verdict. WRONG: "Valdon warmed 0.9 degrees, so every part of Valdon warmed 0.9 degrees and every growing season changed alike." CORRECT: "The 0.9 degrees is the average of 1.8, 0.6 and 0.3, so Norhalt warmed twice the national figure and Brackwater Coast a third of it, and the frost-free seasons lengthened by 28, 12 and 6 days in the same order." Check both multiples: 1.8 divided by 0.9 is 2, and 0.9 divided by 3 is 0.3, so 0.3 is a third of the national figure.',
        'One number is a hunch; three of different kinds, all pointing the same way, is evidence. The national figure is arithmetic done ON the regions, not a quantity each region holds, so a single plan written from it would understate what Norhalt faces, at 1.8 degrees and 28 extra frost-free days, and overstate what Brackwater Coast faces, at 0.3 degrees and 6.',
        'Change ONE input and watch the national figure move with it. Suppose Norhalt had warmed 0.6 degrees rather than 1.8, with the other two unchanged. The average becomes 0.6 plus 0.6 plus 0.3, which is 1.5, divided by 3, which is 0.5 degrees. Invert: 0.5 times 3 is 1.5. The national figure would then be 0.5 and no region would sit far from it. Nothing about the country changed except one region, which is the point: the national figure is not a fact each region copies, it is what the regions add up to and divide down to.',
      ],
      answer:
        'The claim is not supported. The 0.9 degrees is the average of the three regional figures: 1.8 plus 0.6 plus 0.3 is 2.7, and 2.7 divided by 3 is 0.9, checked by 0.9 times 3 being 2.7. No region changed by 0.9. Norhalt warmed 1.8, twice the national figure; Brackwater Coast warmed 0.3, a third of it; and the differences from the average, +0.9, -0.3 and -0.6, cancel to zero as an average requires. A second measurement agrees: the frost-free season lengthened by 28 days in Norhalt, 12 in Dunmar Basin and 6 on Brackwater Coast, ranking the regions in the same order. The national figure is arithmetic done on the regions, not a change each region received.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-two-years-against-four-decades',
      kind: 'try_yourself',
      problem:
        'Kelbrin Station gives the average departure for each of the four decades in its record, oldest first: -0.3 degrees, -0.1 degrees, +0.1 degrees, +0.3 degrees. The sheet also names two single years: the warmest year of the first decade, at +0.1 degrees, and the coolest year of the fourth decade, at 0.0 degrees. A post sets those two years side by side and says the station has cooled. Does the data support the claim?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Not supported: the decade averages rose 0.6 degrees, from -0.3 to +0.3, and the two years quoted sit 0.4 above and 0.3 below their own decade averages',
          correct: true,
        },
        {
          id: 'b',
          text: 'Supported: 0.0 degrees is lower than +0.1 degrees, so the more recent of the two years is the cooler one and the record has turned downward',
        },
        {
          id: 'c',
          text: 'Not supported: a departure of 0.0 degrees means the station is sitting exactly at its baseline, so the record shows no change in either direction',
        },
        {
          id: 'd',
          text: 'Supported: taking the warmest year from one end and the coolest year from the other is the fair way to compare two decades, and that comparison gives a fall',
        },
      ],
      expectedAnswer:
        'Not supported: the decade averages rose 0.6 degrees, from -0.3 to +0.3, and the two years quoted sit 0.4 above and 0.3 below their own decade averages',
      hints: [
        'A pair of single years is the swing, not the step. Find the four decade averages and compare the first with the last before you look at either named year.',
        'Subtract the first decade average from the last for the change, then subtract each decade average from the year taken out of it for the swings. Comparing the two quoted years directly, reading one year at 0.0 as a statement about the whole record, and treating extreme years as the fair way to compare decades are three ways of never doing those subtractions.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-swing-against-step',
      kind: 'try_yourself',
      problem:
        'Thornvale Station has four decade averages in its record. The first decade averaged -0.4 degrees and the latest averaged +0.2 degrees. Within that latest decade the warmest year came in at +0.5 degrees and the coolest at -0.1 degrees. How does the swing between those two years compare with one decade of the step?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Twice the size of one decade of the step' },
        { id: 'b', text: 'Four times the size of one decade of the step' },
        { id: 'c', text: 'Three times the size of one decade of the step', correct: true },
        { id: 'd', text: 'One and a half times the size of one decade of the step' },
      ],
      expectedAnswer: 'Three times the size of one decade of the step',
      hints: [
        'Two subtractions and one division. The step is the last decade average minus the first, divided by the number of gaps between the four decade averages; the swing is the warmest year minus the coolest.',
        'Four decade averages have three gaps between them, not four. The coolest year is a negative figure, so subtracting it adds rather than takes away. And the swing runs from the coolest year to the warmest, not from the decade average up to the warmest.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-overall-figure-from-three-regions',
      kind: 'try_yourself',
      problem:
        'Ivrell is made of three regions of equal area. Over the same record, Rilmore Uplands warmed 1.6 degrees, Corden Basin warmed 0.5 degrees, and Westrey Coast warmed 0.3 degrees. What is the country-wide change for Ivrell?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '0.5 degrees, which is the middle one of the three figures' },
        { id: 'b', text: '2.4 degrees, which is the three figures added together' },
        { id: 'c', text: '1.6 degrees, which is the largest of the three figures' },
        { id: 'd', text: '0.8 degrees, which is the three figures shared out evenly', correct: true },
      ],
      expectedAnswer: '0.8 degrees, which is the three figures shared out evenly',
      hints: [
        'The three regions are equal in area, so the country-wide change is their average: add the three figures and divide by how many of them there are.',
        'Adding the three and stopping gives a figure larger than any one region, which no average can be; taking the largest gives the region that changed most, not the country; and the middle one of three figures is their average only when the three are evenly spaced, which these are not. Multiply your answer by 3 and confirm the total comes back.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-baseline-and-swing-as-noise',
      kind: 'misconception_check',
      question:
        'A student is looking at the Vellmar sheet -- decade averages of -0.2, 0.0, +0.2 and +0.4 degrees -- and says: "The second decade is at 0.0, so that was the normal decade and nothing had happened yet. And anyway, a single year can sit 0.4 degrees from its own decade average while the whole record only moved 0.6, so the 0.6 is just wobble." What is wrong with each half?',
      commonErrors: [
        {
          answer: 'The decade at 0.0 was the normal decade, so nothing had happened before it.',
          misconception:
            'Reading a departure of 0.0 as "nothing has happened" rather than as "equal to the baseline this record measures from", which treats one chosen stretch of years as the way the place is supposed to be.',
          correctsTo:
            'A departure says how far a figure sits from the record baseline, and the baseline is a chosen stretch of years, not a correct temperature. The second decade at 0.0 averaged exactly the baseline, and the first decade, at -0.2, averaged 0.2 degrees below it -- so something had already happened between them, namely 0.2 degrees. Re-choosing the baseline shows the rest at once: shift it so the first decade reads 0.0, and every figure moves up by that same 0.2, giving 0.0, +0.2, +0.4 and +0.6. The change across the record is then 0.6 minus 0.0, which is 0.6 degrees, and that is the same 0.6 as before, because 0.4 minus -0.2 is also 0.6. WRONG: "0.0 means nothing has happened." CORRECT: "0.0 means that decade matched the baseline, and the baseline is a choice that moves every departure together while changing no difference between them."',
        },
        {
          answer: 'A single year can be 0.4 degrees off, and the record only moved 0.6, so the 0.6 is just wobble.',
          misconception:
            'Comparing a swing, which is a property of one year, with a step, which is a difference between two ten-year averages, as though the two numbers were measured on the same thing.',
          correctsTo:
            'The two numbers describe different things, and the arithmetic says how different. A decade average is built from ten years, so one year sitting 0.4 degrees above the rest lifts that decade average by 0.4 divided by 10, which is 0.04 degrees -- one fifth of the 0.2 degrees the average moves from one decade to the next, since 0.2 divided by 0.04 is 5. That is what averaging ten years does to a wobble. Then look at direction: the three gaps in this record are 0.2, 0.2 and 0.2, every one of them the same way. A swing has no direction, which is what makes it a swing, so three equal moves in one direction are not one. WRONG: "The swing is large, so the step is noise." CORRECT: "One unusual year moves its own ten-year average by a tenth of its distance from the rest, and the three decade steps here all run the same way and by the same amount."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Every series gives two numbers: the STEP, how far the block averages move from one block to the next, and the SWING, how far a single year sits from the average of its own block. Compute both before you judge a claim.',
        'Four decade averages have three gaps between them. Divide the change across the record by the gaps, never by the number of blocks.',
        'Compare block averages, never a pair of years. Picking the warmest early year against the coolest late year moves the answer by the two swings added together, and can turn a rise into a fall using figures that are all real.',
        'A departure is a difference from a chosen baseline: 0.0 means equal to the baseline, a negative figure means below it, and re-choosing the baseline shifts every departure by the same amount while changing none of the differences.',
        'One unusual year moves its own ten-year average by a tenth of its distance from the rest, which is why a record is read in decades.',
        'The same arithmetic reads sea level, ice extent, frost-free days and temperature departures. Only the direction that counts changes, and the units have to match before you subtract.',
        'One overall figure is the average of places that moved by different amounts. Subtract it from each place and the amounts above and below cancel to zero, which is the proof that no single place has to equal it.',
        'Sunlight warms the surface, the surface gives off heat, and certain gases in the air -- carbon dioxide, water vapor and methane among them -- hold some of that heat in, so more of those gases hold in more heat.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '7', cedTopic: '7.2', cedTitle: 'Reading Climate Trend Data' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
