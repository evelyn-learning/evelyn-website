/**
 * Grade 8 World Geography — Geographic Data & Spatial Analysis: Evaluating a
 * Choropleth Map.
 *
 * PROCEDURE-LED row (National Geography Standard 1), shaped on the
 * procedure-led exemplar `m8geo-u1-counts-rates-and-fair-comparison.ts`: the
 * concept segment is a short ordered routine run over a described map rather
 * than a mental model, the first worked example runs the routine straight
 * through and then re-draws one break, the second re-runs it on the same
 * places shaded two different ways, and every worked example ends with an
 * arithmetic inversion AND a one-input contrasting case. Two traps this plan
 * is built to kill: reading a shared shade as a statement that two values are
 * close, and reading a count map as though it answered a per-resident
 * question.
 *
 * THE ROUTINE, in the order it is always run:
 *   1. Read the key: write down the break values, and find the sentence that
 *      says WHAT is being shaded -- a count, or a rate.
 *   2. Place every region's value in its class, then count the regions in the
 *      classes back and confirm the total is the whole map.
 *   3. Compare two numbers the shading hides: the within-class range, and the
 *      gap across the break next to it.
 *   4. Re-draw ONE break, re-place every value, and see which pairs split and
 *      which pairs join.
 *   5. Judge the stated conclusion: class membership is what a choropleth is
 *      reliable about; distance between two values is not.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause each, that a thematic map
 * carries a key stating what each shade stands for and that the key is read
 * before the map (Grade 6, `m6geo-u7-reading-a-thematic-map.ts`) and that a
 * legend is one of the elements a map reader checks first (Grade 7,
 * `m7geo-u1-map-elements-scale-and-direction.ts`), and re-teaches neither.
 * The whole of that premise is ONE clause inside keyIdea 1 -- "and a map key
 * states what each shade stands for" -- placed where it is used and repeated
 * nowhere: grepped against the finished body, the words "legend" and
 * "thematic" do not occur at all, no keyIdea instructs the student to read
 * the key first as a habit (keyIdea 5 sends them to one specific sentence of
 * the key, the one naming the shaded quantity, as a step of this row's own
 * routine), and the large-scale/small-scale rule is named nowhere in the
 * body. It ADDS placing
 * each region's value in its class from the stated break values and checking
 * by counting the class members back to the number of regions; computing the
 * within-class range and the gap across the neighboring break and comparing
 * the two; re-drawing ONE break and re-placing every value so the pattern
 * moves while the data stands still; reading the same places once as a count
 * map and once as a rate map and naming which regions swap classes; and
 * judging a stated conclusion by separating what a choropleth is reliable
 * about (class membership) from what it is not (how far apart two values
 * are). It STOPS SHORT of cartographic software and color theory, which this
 * row's scope line withholds: no color is chosen, named or evaluated
 * anywhere, the shades are described only as darker and lighter because an
 * ordered set of tones cannot be described otherwise, and no software
 * procedure appears (a high-school GIS elective owns those, per the signed
 * curriculum's excluded list). It also does not install the named
 * classification typology -- the words equal interval, quantile and natural
 * breaks appear nowhere; every classing scheme in this file is described in
 * plain words. Sideways: it does NOT choose a denominator from a claim or
 * teach how to build a rate (row 1.1,
 * `m8geo-u1-counts-rates-and-fair-comparison.ts`), it does NOT merge, split
 * or re-aggregate any area to compare scales of analysis (row 1.3,
 * `scale-of-analysis-and-hidden-patterns`), and it does NOT compare two maps
 * that differ in projection, symbol sizing, color ordering, title wording or
 * what they leave out (row 1.4, `maps-as-arguments`) -- the only design
 * choices this file evaluates are where the breaks fall and which quantity is
 * being shaded.
 *   Three things ARE deliberately allowed, because neighboring rows sit
 * close. (a) The count-versus-rate contrast is worked with digits here,
 * because this row's own scope cell names "mapping a count instead of a rate
 * changes the pattern shown"; the division is shown so that the second map
 * can exist, but the denominator is always STATED in words -- in the second
 * worked example by the key of the second map, and in the third item by the
 * choices and by the second hint -- and no item asks the student to work out
 * which denominator a claim needs, which is row 1.1's question. (b) The
 * second worked example changes one denominator and watches a region swap
 * classes on the rate map while the count map does not move at all -- that is
 * one input changed and the routine re-run, this row's contrasting case, and
 * not a re-aggregation of areas. (c) A conclusion is judged supported or not
 * supported in this file, which sounds like row 1.4's job; the line is that
 * every conclusion here is tested against the break values and the shaded
 * quantity, and never against a projection, a symbol size, a color order or a
 * title.
 *
 * The scope cell for this row carries all three parts (positive statement,
 * lineage clause, withheld clause), so nothing is missing from it.
 *
 * DEPTH FLOOR NOTE FOR THE FAN-OUT: read the six keyIdeas and notice what
 * each one is ABOUT. Not one of them is about matching a shade to a key
 * entry, and none says what a thematic map shows -- every one says what you
 * DO with a classed map: place, count back, subtract, re-draw, swap the
 * shaded quantity, judge. What a key is gets a single subordinate clause
 * inside keyIdea 1, where it is used, and is never a keyIdea of its own. The
 * test used on this
 * file: the Grade 6 keyIdeas from `m6geo-u7-reading-a-thematic-map.ts` were
 * read next to these six, and the closest pair was keyIdea 1 here ("a
 * choropleth shows classes, not values") against the Grade 6 line "a color
 * means whatever that map's own key says". KeyIdea 1 survived because it is
 * about what the shading THROWS AWAY and what has to be written down before a
 * pattern can be read, not about where meaning comes from.
 *
 * ACCURACY NOTE: no real place carries a number anywhere in this file. Every
 * county, country, district and figure is invented and was written for the
 * arithmetic. No real place is named at all. The only claims about the world
 * outside the invented data are conventions of the artifact itself -- that a
 * mapmaker chooses the number of classes and where each one begins and ends,
 * and that shading a whole area one tone replaces its value with its class --
 * and both are in the claim ledger.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, and 94% at difficulty 4; chance with four choices is 25%). The
 * PER-ITEM discipline is the point: every distractor states the full wrong
 * STEP that produces it -- a shared shade read as closeness, a mapmaker's
 * break read as a dividing line in the data, a re-classed map read as new
 * measurements, breaks believed to be fixed by a rule, a count map read as a
 * per-resident answer, a refusal to compare places of different size -- and
 * no key was built to be the longest choice BECAUSE it is the key. Measured
 * as a diagnostic, not as a score: the key is the strictly longest choice in
 * TWO of the three items, by 9 characters out of 152 (item 1) and 13 out of
 * 147 (item 2) -- margins of 5.9% and 8.8%, both inside the noise band the
 * controller's ruling 16 describes, so neither was edited; item 3's key is
 * the SHORTEST of its four, because its reason clause is a three-figure
 * comparison while every distractor carries a longer wrong reason. Chance
 * alone produces two-of-three about 14% of the time, so this number is a
 * diagnostic for the 120-item course rate taken at registration and not
 * evidence about this file. The two verdict items are deliberately split two
 * "Not supported" against two "Supported" so that the odd verdict out is
 * never the key. The three keys sit at ids a, b and c, which is the id set
 * `(1 + 2) mod 4 = 3` requires, omitting d.
 *
 * NOTE ON SPECIMENS: no place, value or class scheme used in a try_yourself
 * item appears in any teaching segment. The hook, the two worked examples and
 * the misconception check use Halbury County, Anselm, Torvin and Quarl; the
 * three items use Vantry, Ostley and Ravelin, and share nothing with them.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every map in this file is
 * written out in prose -- its classes, its break values and each region's
 * value -- inside the segment that needs it, and every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U1_EVALUATING_A_CHOROPLETH: LessonPlan = {
  id: 'evelyn.ms.m8geo.evaluating-a-choropleth.v1',
  title: 'Evaluating a Choropleth Map',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.evaluating-a-choropleth',
      standard: 'M8GEO-1.2',
      description:
        'Given a choropleth (its classes, their break values, and the value of each region), determine which regions share a class, explain how re-drawing the class breaks or mapping a count instead of a rate changes the pattern shown, and judge whether the map supports a stated conclusion (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).',
    },
  ],
  prerequisites: ['m8geo.counts-rates-and-fair-comparison'],
  followUps: ['m8geo.scale-of-analysis-and-hidden-patterns'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show a shaded map producing a split that is not in its own printed numbers, so the need to check the break values arrives before any vocabulary does.',
      script:
        'A news site posts a map of Halbury County shaded in four tones for the share of homes with fast internet, and the story under it says the county is split, with a well-served east and a left-behind west. The numbers sit in a list beside it, and they do not say that. Two districts on opposite sides of the split, one in the darkest tone and one in the tone just below it, are 3 points apart: 61 and 58. Two districts in the SAME darkest tone, which the story treats as one well-served group, are 20 points apart: 61 and 81. Nobody faked anything and nobody measured anything wrong. Somebody chose the values where one tone stops and the next begins, and those choices drew the split the story is about. Today you get the routine that takes a shaded map apart -- places every value in its class, finds what the shading is hiding, moves a break to see what moves with it -- and then decides whether a conclusion somebody drew from that map survives.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-classes-breaks-and-what-the-shading-hides',
      kind: 'concept',
      goal: 'Install the five-step routine over a classed map and the rule that the pattern on a choropleth is made by the data and the break values together.',
      keyIdeas: [
        'A CHOROPLETH SHOWS CLASSES, NOT VALUES, SO WRITE DOWN THE BREAKS BEFORE YOU READ ANY PATTERN. A choropleth shades each whole area one tone according to which band of values that area falls into, and a map key states what each shade stands for. That means the shading carries exactly one fact about an area: which band its value landed in. It does not carry the value. Two areas shaded alike are somewhere inside the same band and can sit at opposite ends of it; two areas shaded differently are in different bands and can sit a hair apart across the line between them. The pattern you are about to read off the tones was produced by two things together -- the numbers, and the places somebody decided to cut them -- so both go on your paper before you say a single word about the pattern.',
        'PLACE EVERY VALUE IN ITS CLASS, THEN COUNT THE AREAS BACK. A class is stated as a lower bound and an upper bound: "40 up to but not including 60". A value belongs to the class whose lower bound it reaches and whose upper bound it does not reach, so 59 is in that class and 60 is in the next one up. Work through every area, one at a time, and write the class beside its value. Then invert: add up how many areas you put in each class and check that the total is the number of areas on the map. If the total comes out one too high, a value sitting exactly on a break got placed twice; one too low, and an area was skipped.',
        'SUBTRACT TWICE: THE RANGE INSIDE A CLASS, AND THE GAP ACROSS THE BREAK BESIDE IT. The within-class range is the highest value in a class minus the lowest value in that class, and it is precisely the part of the data the map does not show, because everything inside it is drawn identically. The gap across a break is the lowest value above the break minus the highest value below it, and it is the difference the map draws as a visible edge. Do both subtractions. When the gap across the break comes out SMALLER than the range inside the class next to it, the map is showing you an edge that is smaller than a difference it is hiding, and any conclusion about a sharp divide there is a conclusion about the break, not about the places.',
        'RE-DRAW ONE BREAK, RE-PLACE EVERY VALUE, AND SEE WHAT MOVES. The way to find out whether a grouping is in the data or in the classing is to change one break value and run step two again on the same untouched numbers. If a pair that shared a tone now splits, and a pair that was split now shares, the grouping belonged to the breaks. This does not make the first map a lie -- both maps place every value correctly, and a mapmaker has to cut the numbers somewhere. What it makes false is a conclusion that treats one set of breaks as the only way the data could have been cut.',
        'A COUNT MAP AND A RATE MAP OF THE SAME PLACES ARE DIFFERENT MAPS, AND THE BIG AREA IS DARK ON THE FIRST ONE ALMOST AUTOMATICALLY. A rate is a count divided by a stated denominator, so shading the count answers "how many are here" while shading the rate answers "how many for each resident". Those two maps can put one area in the darkest class and near the lightest class, because the area with the most of something very often has the most of it for the plain reason that it is the biggest. So the first step of the routine has a second half: find the sentence that says what quantity is being shaded, and hold on to it, because every conclusion drawn from the map has to be a conclusion about THAT quantity.',
        'JUDGE A CONCLUSION BY SORTING WHAT THE MAP IS RELIABLE ABOUT FROM WHAT IT IS NOT. A choropleth is exactly reliable about class membership: an area drawn in a class really does have a value inside that class, and one drawn outside it really does not. It is not reliable about distance, because every value inside a class is drawn the same. So a conclusion shaped like "this area is at least 50" survives, while a conclusion shaped like "these two are about the same" or "there is a sharp divide along this line" has to be checked against the printed values and the break values before you accept it. Say which of the two shapes the conclusion has, then check it.',
      ],
      vocabulary: [
        {
          term: 'choropleth',
          definition:
            'a map that sorts every area into a class by its value and shades the whole area with that class\'s tone, so what the map displays is the class and not the value.',
        },
        {
          term: 'class',
          definition:
            'a band of values grouped together and drawn alike, stated as a lower bound the value must reach and an upper bound it must not reach.',
        },
        {
          term: 'class break',
          definition:
            'the value where one class ends and the next begins, chosen by the mapmaker before any shading and never fixed by the data.',
        },
        {
          term: 'classing',
          definition:
            'the whole set of choices about how many classes to use and where to cut between them, made once and applied to every area on the map.',
        },
        {
          term: 'within-class range',
          definition:
            'the highest value inside one class minus the lowest value inside it: the difference the map draws as no difference at all.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-routine-and-move-a-break',
      kind: 'worked_example',
      problem:
        'Run the routine straight through on a described map, then move one break.\n\nA choropleth of the invented country of Anselm shades each of its five districts by the percent of that district\'s land that is farmland. The key lists four classes: under 40 percent; 40 up to but not including 60 percent; 60 up to but not including 80 percent; and 80 percent or more, which is the darkest tone.\n\n"Doverly: 38 percent. Eastmere: 59 percent. Fenhollow: 61 percent. Grasholt: 78 percent. Haldane: 88 percent."\n\nA farming report says: "The map shows that Fenhollow and Grasholt are close to each other in farmland, and that Eastmere is well behind Fenhollow." Test the report.',
      steps: [
        'Step one: write down the breaks and the shaded quantity. The breaks are at 40, 60 and 80, and the quantity is a percent of each district\'s own land, so no district is dark merely for being large. Both halves of step one are now on paper.',
        'Step two: place every value. Doverly at 38 is under 40, so it is in the lightest class. Eastmere at 59 reaches 40 and does not reach 60, so it is in the second class. Fenhollow at 61 and Grasholt at 78 both reach 60 and neither reaches 80, so both are in the third class. Haldane at 88 reaches 80, so it is in the darkest class.',
        'Invert the placement by counting back. One district in the lightest class, one in the second, two in the third, one in the darkest: 1 plus 1 plus 2 plus 1 is 5, and Anselm has five districts. Nothing was placed twice and nothing was skipped.',
        'Step three: subtract twice. The within-class range of the third class is 78 minus 61, which is 17 points, and the map draws those two districts identically. The gap across the break at 60 is 61 minus 59, which is 2 points, and the map draws that as an edge between two different tones. So the difference the map shows is 2 and the difference the map hides is 17.',
        'Now test the first half of the report. WRONG: "Fenhollow and Grasholt carry the same tone, so they are close in farmland." CORRECT: "Fenhollow is at 61 percent and Grasholt is at 78 percent, which is 17 points apart -- they share a class because the class is 20 points wide, not because their farmland is alike."',
        'Test the second half. WRONG: "Eastmere is in a lighter class than Fenhollow, so Eastmere is well behind it." CORRECT: "Eastmere is at 59 percent and Fenhollow is at 61 percent, 2 points apart -- they are drawn in different tones because the break at 60 happened to fall between them." The report is not supported on either half, and the two halves fail in opposite directions.',
        'Step four: re-draw ONE break and re-place every value, so the pattern is not memorized as a fact about these districts. Move the break at 60 up to 65 and change nothing else. Doverly at 38 is still under 40. Eastmere at 59 and Fenhollow at 61 now both reach 40 and neither reaches 65, so they share the second class. Grasholt at 78 reaches 65 and does not reach 80, so it stands alone in the third. Haldane at 88 is still in the darkest. Count back: 1 plus 2 plus 1 plus 1 is 5 districts again.',
        'Rewind the input and read the five values backwards against the new classes to be sure nothing was misread: 88 is 80 or more; 78 reaches 65 and not 80; 61 reaches 40 and not 65; 59 reaches 40 and not 65; 38 is under 40. On the new map Eastmere and Fenhollow share a tone and Fenhollow and Grasholt do not -- the exact reverse of the first map, from five numbers that never moved. Step five: the conclusion the report drew was a conclusion about where the break sat.',
      ],
      answer:
        'The report is not supported, on both halves. Fenhollow at 61 percent and Grasholt at 78 percent share the third class but are 17 points apart, which is the within-class range the map hides; Eastmere at 59 percent and Fenhollow at 61 percent are in different classes but only 2 points apart, which is the break at 60 falling between them. Placing the five values gives 1, 1, 2 and 1 districts across the four classes, which counts back to 5. Moving the single break at 60 up to 65 puts Eastmere and Fenhollow in one class and leaves Grasholt alone, reversing both groupings without changing one number.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-count-map-against-rate-map',
      kind: 'worked_example',
      problem:
        'The same four places, shaded two ways. Decide whether the conclusion survives.\n\nThe invented country of Torvin has four districts. "Ashgate: 60 public health clinics, 300,000 residents. Brinmoor: 24 clinics, 60,000 residents. Caldren: 9 clinics, 90,000 residents. Dunreath: 12 clinics, 20,000 residents."\n\nThe first map shades each district by its NUMBER of clinics, in three classes: under 10; 10 up to but not including 50; and 50 or more, the darkest. The second map shades the same districts by CLINICS PER 10,000 RESIDENTS, in three classes: under 2; 2 up to but not including 5; and 5 or more, the darkest.\n\nA health board writes: "Ashgate is the darkest district on the map, so Ashgate is the best-served district in Torvin for clinics." Test it.',
      steps: [
        'Step one on the first map: the breaks are at 10 and 50, and the shaded quantity is a count of clinics. Place the values. Caldren at 9 is under 10. Dunreath at 12 and Brinmoor at 24 both reach 10 and neither reaches 50. Ashgate at 60 reaches 50, so Ashgate alone is in the darkest class. Count back: 1 plus 2 plus 1 is 4 districts.',
        'Step one on the second map: the breaks are at 2 and 5, and the shaded quantity is clinics for every 10,000 residents. Work out each rate, since the denominator is stated. Ashgate: 300,000 residents contains 30 lots of 10,000, and 60 divided by 30 is 2 clinics per 10,000. Brinmoor: 60,000 contains 6 lots of 10,000, and 24 divided by 6 is 4. Caldren: 90,000 contains 9 lots, and 9 divided by 9 is 1. Dunreath: 20,000 contains 2 lots, and 12 divided by 2 is 6.',
        'Invert every division before placing anything. 2 times 30 is 60, which returns Ashgate\'s clinics. 4 times 6 is 24, which returns Brinmoor\'s. 1 times 9 is 9, Caldren\'s. 6 times 2 is 12, Dunreath\'s. All four counts come back, so no zero slipped.',
        'Step two on the second map. Caldren at 1 is under 2. Ashgate at 2 and Brinmoor at 4 both reach 2 and neither reaches 5. Dunreath at 6 reaches 5, so Dunreath alone is in the darkest class. Count back: 1 plus 2 plus 1 is 4 districts again.',
        'Step three, and here it is a swap rather than a subtraction. Ashgate goes from the darkest class on the count map to the middle class on the rate map. Dunreath goes from the middle class to the darkest. Caldren stays lightest and Brinmoor stays in the middle. Two of four districts changed class, and not one measurement changed with them.',
        'Step five: judge the conclusion. WRONG: "Ashgate holds 60 clinics, more than any other district, so Ashgate is the best served." CORRECT: "Ashgate holds the most clinics and also holds the most residents to share them: 2 clinics for every 10,000 people, against 6 in Dunreath and 4 in Brinmoor. On clinics for each resident Ashgate is third of the four." The conclusion is not supported. It was read off a map that shades how many clinics a district holds, and it is a claim about how well residents are served.',
        'Rewind the input, then change ONE thing. Read the four lines backwards to confirm them: 12 and 20,000; 9 and 90,000; 24 and 60,000; 60 and 300,000. Now suppose Ashgate had 100,000 residents instead of 300,000, with the same 60 clinics. 100,000 contains 10 lots of 10,000, and 60 divided by 10 is 6 clinics per 10,000; check, 6 times 10 is 60. Ashgate now reaches 5 and joins Dunreath in the darkest class of the rate map -- while the count map does not move at all, because Ashgate still has exactly 60 clinics. One input changed, one map changed, the other stood still. That is the sharpest way to see that the two maps are answering two different questions.',
      ],
      answer:
        'The conclusion is not supported. The first map shades a count, and Ashgate is darkest on it because it holds 60 clinics. On clinics per 10,000 residents the figures are Ashgate 2 (60 divided by 30 lots of 10,000), Brinmoor 4 (24 divided by 6), Caldren 1 (9 divided by 9) and Dunreath 6 (12 divided by 2), each of which multiplies back to its count. On the rate map Dunreath alone is darkest and Ashgate falls to the middle class, so two of the four districts swap classes between the two maps. Changing only Ashgate\'s residents to 100,000 lifts its rate to 6 and moves it into the darkest class of the rate map while leaving the count map untouched.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-shared-class-is-not-closeness',
      kind: 'try_yourself',
      problem:
        'A choropleth of the invented country of Vantry shades each district by the percent of its land under tree cover. The key lists three classes: under 25 percent; 25 up to but not including 50 percent; and 50 percent or more.\n\n"Mirren: 18 percent. Ilmar: 26 percent. Jorn: 48 percent. Kesh: 49 percent. Lowe: 51 percent."\n\nA report says: "The map groups Ilmar, Jorn and Kesh into one class, so those three districts have similar tree cover." Does the data support the report?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Not supported: Ilmar at 26 percent and Kesh at 49 percent share a class but sit 23 points apart, while Kesh and Lowe are in different classes just 2 points apart', correct: true },
        { id: 'b', text: 'Supported: the three districts are drawn in the same tone, and a shared tone on a choropleth means the values grouped inside it are close to one another' },
        { id: 'c', text: 'Supported: Ilmar, Jorn and Kesh all come in under 50 percent while Lowe comes in over it, so the map has found the real dividing line in the data' },
        { id: 'd', text: 'Not supported: no conclusion can be checked against a choropleth at all, because shading a whole district one tone throws that district\'s value away' },
      ],
      expectedAnswer: 'Not supported: Ilmar at 26 percent and Kesh at 49 percent share a class but sit 23 points apart, while Kesh and Lowe are in different classes just 2 points apart',
      hints: [
        'Do the two subtractions before you decide anything: the highest value in that shared class minus the lowest value in it, and then the value just above the break at 50 minus the value just below it.',
        'One subtraction comes out much larger than the other. Trusting a shared tone as a statement about closeness, treating a mapmaker\'s break as a line the data itself drew, and refusing to check the map even though every value is printed beside it are three ways of never doing those subtractions.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-redraw-the-break',
      kind: 'try_yourself',
      problem:
        'Two choropleths of the invented country of Ostley shade its five districts by average annual rainfall in centimeters. The values are the same on both maps: "Anwyl: 30. Brackin: 44. Corrow: 46. Delvin: 61. Elber: 79."\n\nThe first map uses three classes: under 40; 40 up to but not including 60; and 60 or more. The second map uses three classes: under 35; 35 up to but not including 45; and 45 or more.\n\nWhich statement about the two maps is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The second map must rest on newer rainfall measurements, because Corrow leaves the class it shared with Brackin and joins the class holding Delvin' },
        { id: 'b', text: 'The same five unchanged values are grouped differently: Brackin and Corrow share a class on the first map, while on the second map Corrow joins Delvin and Elber', correct: true },
        { id: 'c', text: 'The first map is the correct one of the two, because its breaks fall on 40 and 60 and a mapmaker has to set every break at a multiple of twenty' },
        { id: 'd', text: 'The two maps have to agree on every district, because a choropleth shades a district by that district\'s own value and no value changed between them' },
      ],
      expectedAnswer: 'The same five unchanged values are grouped differently: Brackin and Corrow share a class on the first map, while on the second map Corrow joins Delvin and Elber',
      hints: [
        'Place all five values on the first map, write the class beside each one, then place the same five values again on the second map. Compare the two lists of classes, not the two lists of numbers.',
        'Only one thing differs between the two maps, and it is not the data. Reading a re-classed map as fresh measurements, believing a break has to land on a round number, and expecting the shading to follow the value directly are three ways of missing what sits between a value and its tone.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-count-map-conclusion',
      kind: 'try_yourself',
      problem:
        'A choropleth of the invented country of Ravelin shades each district by its NUMBER of public sports fields, in three classes: under 20; 20 up to but not including 60; and 60 or more, the darkest.\n\n"Hallick: 90 fields, 300,000 residents. Ingle: 40 fields, 50,000 residents. Jessop: 15 fields, 150,000 residents."\n\nA council report says: "Hallick is shaded darkest, so Hallick residents are the best supplied with sports fields in Ravelin." Does the data support the report?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Supported: Hallick holds 90 sports fields against 40 in Ingle and 15 in Jessop, and the darkest class on this map is the one holding the largest count' },
        { id: 'b', text: 'Not supported: Hallick has 300,000 residents against 50,000 and 150,000, so districts this different in size cannot be set beside one another at all' },
        { id: 'c', text: 'Not supported: the map shades a count, and on fields per 10,000 residents Hallick is 3, against 8 in Ingle and 1 in Jessop', correct: true },
        { id: 'd', text: 'Supported: Hallick is shaded darkest, and a choropleth shades each district by that district\'s own value, so the shading settles the question' },
      ],
      expectedAnswer: 'Not supported: the map shades a count, and on fields per 10,000 residents Hallick is 3, against 8 in Ingle and 1 in Jessop',
      hints: [
        'Find the sentence that says what quantity the tones stand for, then read the report and ask whether it is a claim about that same quantity or about something else.',
        'Every figure needed for the other quantity is printed in the data: divide each count of fields by the number of 10,000-resident lots in that district. Trusting the darkest tone, accepting the largest count, and refusing to compare places of different size all skip that division.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-shared-tone-and-total-distrust',
      kind: 'misconception_check',
      question:
        'A choropleth of the invented country of Quarl shades four districts by the percent of their roads that are paved, in three classes: under 50 percent; 50 up to but not including 75 percent; and 75 percent or more. "Umber: 49 percent. Sennet: 52 percent. Tressick: 74 percent. Vellan: 81 percent." A student writes: "Sennet and Tressick carry the same tone, so their figures are nearly the same." Then, a moment later: "Actually the mapmaker could have cut the classes anywhere, so a choropleth cannot be trusted for anything." What is wrong with each sentence?',
      commonErrors: [
        {
          answer: 'Sennet and Tressick carry the same tone, so their figures are nearly the same.',
          misconception:
            'Reading a shared class as a statement about how close two values are. The tone reports only which band a value landed in, and a band is wide, so two districts drawn alike can sit at opposite ends of it.',
          correctsTo:
            'Do the two subtractions. Inside the middle class, Tressick is at 74 percent and Sennet is at 52 percent: 74 minus 52 is 22 points, and the map draws that as no difference at all. Across the break at 50, Sennet is at 52 and Umber is at 49: 52 minus 49 is 3 points, and the map draws that as a visible edge. Place all four values back to check the classing: 49 is under 50; 52 and 74 both reach 50 and neither reaches 75; 81 reaches 75. One plus two plus one is 4, which is every district in Quarl. WRONG: "Same tone, so nearly the same." CORRECT: "Same class, 22 points apart, while the pair the map separates is 3 points apart." A shared tone tells you the band; only the printed values tell you the distance.',
        },
        {
          answer: 'The mapmaker could have cut the classes anywhere, so a choropleth cannot be trusted for anything.',
          misconception:
            'Over-correcting from "the breaks were chosen" to "nothing on the map is reliable", which throws away the one thing a choropleth is exactly right about and leaves the student with no way to read a map at all.',
          correctsTo:
            'A choropleth is exactly reliable about class membership and unreliable about distance, and the repair is to keep conclusions in the shape it can support. Tressick\'s tone supports "Tressick is at least 50 percent paved and under 75 percent", and 74 is inside that band, so that conclusion is true. It does not support "Tressick is close to Sennet". Test it by moving one break: cut the lowest class at 53 instead of 50 and Sennet at 52 joins Umber in the lightest class while Tressick stands alone in the middle. Count back: two plus one plus one is 4 districts. The membership claim about Tressick changes to "at least 53 and under 75" and is still true of the data, while the closeness claim was never supported by either map. WRONG: "The breaks were chosen, so the map is worthless." CORRECT: "The breaks were chosen, so read class membership off the map and read distance off the values."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A choropleth displays the class, not the value. Write down the break values and the value of every area before you say anything about the pattern.',
        'Step one has two halves: the breaks, and what quantity is being shaded. A count map and a rate map of the same places are two different maps.',
        'Place each value in the class whose lower bound it reaches and whose upper bound it does not reach, then count the class members back to the number of areas on the map.',
        'Subtract twice. The within-class range is what the map hides; the gap across the break is what the map shows. When the gap is smaller than the range, the visible divide belongs to the break.',
        'Re-draw one break and re-place every value. Pairs that split and pairs that join tell you the grouping was in the classing, not in the data.',
        'Shading a count puts the biggest area in the darkest class almost by itself, because the place with the most of something is very often simply the largest place.',
        'Class membership is what a choropleth is reliable about. Distance between two values is not. Judge every conclusion by which of those two shapes it has.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'Evaluating a Choropleth Map' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
