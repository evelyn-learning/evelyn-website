/**
 * Grade 8 World Geography — GIS & Geospatial Reasoning: Change Detection from
 * Satellite Data.
 *
 * PROCEDURE-LED row (National Geography Standard 14), shaped on the
 * procedure-led exemplar `m8geo-u1-counts-rates-and-fair-comparison.ts`: the
 * concept segment is an ordered routine run over a described land-cover table
 * rather than a mental model, the first worked example runs the routine
 * straight through, the second repairs a wrong step, and both end by rewinding
 * the input and re-running on a contrasting case.
 *
 * THE ROUTINE, in the order it is always run:
 *   1. Check that both columns cover the same ground, and that each column
 *      adds to the area of the study zone.
 *   2. For each class, subtract: second-date hectares minus first-date
 *      hectares. Keep the sign.
 *   3. Check: the four changes must add to zero. If they do not, either a
 *      subtraction slipped or the two images do not see the same ground.
 *   4. Match the losses to the gains to name the likely conversion -- then
 *      use where the changed hectares SIT to choose between the readings the
 *      totals allow.
 *   5. State what this pair of images cannot show: anything narrower than one
 *      square of the picture, anything under cloud, and anything that
 *      happened and reversed inside the gap between the dates.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause each and where they are used,
 * that a picture taken from above records what is physically on the ground at
 * the moment it was taken (Grade 6, `m6geo-u7-satellite-images-and-aerial-
 * views.ts`), that physical geography is not fixed but changes over time
 * (Grade 6, `m6geo-u10-how-physical-geography-changes-over-time.ts`), and that
 * land is cleared, farmed and built on for ordinary reasons (Grade 7,
 * `m7geo-u7-latin-america-environment-issues.ts`). It re-teaches none of the
 * three: no keyIdea says what a satellite image is or how it differs from a
 * map, no keyIdea says that landscapes change, and no keyIdea gives a reason
 * why anybody clears land or traces the effects that follow. It ADDS
 * subtracting a two-date land-cover table class by class with signs, using the
 * must-add-to-zero balance as the check that catches both a slipped
 * subtraction and an unequal pair of images, re-basing both columns onto the
 * ground that both images actually see when cloud hides part of the second,
 * naming the most likely conversion from the loss and gain columns plus where
 * the changed hectares sit, separating net change from gross change, and
 * stating the three limits of a two-date comparison with the arithmetic that
 * shows each one. It names NO spectral band and NO classification algorithm,
 * and describes no software step: those belong to a high-school GIS elective
 * and the signed curriculum withholds them from the whole course by name. It
 * does NOT build or overlay thematic layers (row 2.1, `gis-layers-and-
 * overlay`; the words layer and overlay appear nowhere in the authored body),
 * does NOT apply a buffer around a feature to decide which locations fall
 * inside or outside it (row 2.2, `buffers-and-proximity`; the only two
 * distances in the body are the 20-meter width of one picture square and the
 * 10-meter width of a line of trees, both used to state the resolution limit
 * and neither used to decide inclusion), does NOT weight or score candidate
 * sites (row 2.3, `site-selection-with-weighted-criteria`), and does NOT
 * choose between denominators to test a claim (row 1.1, `counts-rates-and-
 * fair-comparison`): no count in this file is divided by a population or by a
 * land area to make a per-person or per-square-kilometer rate, and the body
 * contains exactly two divisions -- 10,000 square meters by 400 square meters,
 * giving the 25 squares that make a hectare, and 900 hectares by 9 years in
 * the misconception check, which exists precisely to say that the quotient is
 * NOT a rate. Three things ARE deliberately allowed, because
 * neighboring rows sit close and the line is worth drawing rather than
 * avoiding. (a) One division of a total change by the number of years in the
 * gap, in the misconception check, because the point being made IS the date-gap
 * limit -- an average across the gap is not a rate for any single year -- and
 * the file stops there: it reads no multi-year series and never distinguishes a
 * trend from year-to-year variability, which is row 7.2 (`reading-climate-
 * trend-data`). (b) Described locations for the changed hectares (which new
 * blocks adjoin the old forest edge, which adjoin the existing town), because
 * the class totals alone leave two conversion readings open and something has
 * to decide between them; this is reading one described scene at two dates, not
 * stacking separate data layers, and no layer is named or combined anywhere in
 * the file. (c) Naming a conversion by the ordinary things that appear in the
 * pictures -- new fields along a forest edge, new streets and roofs at a town
 * edge -- because a conversion has to be called something. The body goes no
 * further than naming them: it gives no reason why anybody cleared or built,
 * traces no effect that followed, states no trade-off, names no gainer and no
 * cost-bearer, and reaches no verdict on whether any change should have
 * happened.
 *
 * DEPTH FLOOR NOTE FOR THE FAN-OUT: every item here is answered by a computed
 * set of signed figures, a verdict about what an unbalanced total means, or a
 * reading of what a zero net change hides -- never by a definition. The Grade 7
 * seed named above was read next to this file: its keyIdeas are about WHY land
 * is modified and WHAT FOLLOWS (intended and unintended effects, the thin-soil
 * surprise, the trade-off frame), and not one of them is about measuring a
 * change from data. The closest pair was keyIdea 4 here (net change hides gross
 * change) against that file's idea that every modification has effects nobody
 * chose; keyIdea 4 survived because it is about what a subtraction can and
 * cannot recover, not about what clearing does to a place.
 *
 * ACCURACY NOTE: no real place is named anywhere in this file and no real
 * figure appears. Tavi Basin, Sennar Plain, Kessel Flats, Loring Basin and
 * Ardwell District are invented, and every hectare figure was written so the
 * arithmetic is clean and each wrong step lands on a visibly different number.
 * The only claims about the real world are that a picture taken from above
 * records what was physically on the ground at the moment it was taken (the
 * assumed premise, stated once in keyIdea 1), that cloud sits between the
 * camera and the ground so the ground beneath it is not in the picture, that a
 * picture from above is built from small squares of a fixed size on the ground
 * and each square carries one class, and that one hectare is 10,000 square
 * meters. The
 * study area's total is the same at both dates by construction, because the
 * analyst fixes the boundary before either image is classified, and that is
 * what makes the add-to-zero check work.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped Grade
 * 7 Geography bank the keyed answer was the strictly longest choice 67% of the
 * time, and 94% at difficulty 4; chance with four choices is 25%). The
 * per-item discipline is the point: every distractor is a nameable wrong STEP
 * -- the subtraction run the wrong way round, every difference read as a loss,
 * the conversion filled in from expectation instead of from the built-up row,
 * an unbalanced total blamed on arithmetic, an unbalanced total accepted as
 * normal, a study area assumed to have shrunk, a loss matched to a gain by size
 * alone, a zero net change read as nothing having happened, and a limit read as
 * total blindness. Measured as a diagnostic, not as a score: the key is the
 * strictly longest choice in 0 of the 3 items, and the three keys sit at ids b,
 * d and a -- the set `(2 + 4) mod 4 = 2` requires, omitting c. Item 2 reached
 * that number honestly rather than by tuning: its first draft had the key
 * longest by 76 characters (239 against 163, a 47% margin, which is the
 * visible gap controller ruling 16 says to close), so its three distractors
 * were grown to state their full wrong reason instead of a bare wrong label,
 * and the word "cloud" was then added to one of them because the stem used it
 * and the key was the only choice echoing it. Zero is NOT the target and was
 * not aimed at: the key ranks tied-longest, second and second by character
 * count and is the shortest choice in no item, so the tell has not been
 * inverted, and the meaningful measurement is the 120-item course rate taken
 * at registration, which should land near a quarter. Item 1's four
 * choices are four signed-number lists of the same shape and come out within
 * three characters of each other; that is parallel structure helping, and the
 * lists are ordered by wrong-step type, never by magnitude.
 *
 * NOTE ON BURNED EXAMPLES (controller ruling 36): the scope cell names the two
 * conversions -- forest to farmland, farmland to built-up -- inside part (i).
 * Those are the row's subject matter rather than a specimen, so they are not
 * burned; what is burned is a particular table, and all five described areas
 * here are fresh. No item stem, choice or answer appears in the hook, concept,
 * worked examples, misconception check or recap: the items use Kessel Flats,
 * Loring Basin and Ardwell District, and the teaching segments use Tavi Basin
 * and Sennar Plain only.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 2.3 -> 2.4 -> 3.1,
 * and both arrays below carry the real neighboring loIds, as the contract's
 * chain table requires. The two exemplars ship empty arrays because they were
 * registered alone and ahead of the fan-out; that is a registration-order
 * artifact and was not copied.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every table and every
 * described scene is written out in prose inside the segment that needs it, and
 * every item is solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U2_CHANGE_DETECTION_FROM_SATELLITE_DATA: LessonPlan = {
  id: 'evelyn.ms.m8geo.change-detection-from-satellite-data.v1',
  title: 'Change Detection from Satellite Data',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.change-detection-from-satellite-data',
      standard: 'M8GEO-2.4',
      description:
        'Given land-cover data for one area at two dates (hectares of forest, farmland, built-up land and water at each date), compute the change in each class, identify the most likely conversion (forest to farmland, farmland to built-up), and state the limits of the evidence: image resolution, cloud, and the gap between the dates (National Geography Standard 14: how human actions modify the physical environment).',
    },
  ],
  prerequisites: ['m8geo.site-selection-with-weighted-criteria'],
  followUps: ['m8geo.north-america-landform-regions'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Turn an argument about two pictures into a subtraction, so the need for counted classes arrives before any vocabulary does.',
      script:
        'Somebody posts two pictures of the same valley taken nine years apart from the same height, side by side, with the caption "look what they did to the forest". The green patch is smaller in the second one. Half the replies say it proves the forest is being wiped out and half say pictures prove nothing, and not one person in the argument has counted anything. Counting is what turns two pictures into evidence. Every hectare in each picture gets sorted into a class -- forest, farmland, built-up land, water -- and then you subtract one column from the other. That subtraction can tell you exactly how many hectares of forest went and what they turned into. It can also be read wrong in three specific ways, and two of those three ways look completely convincing. Today you get the routine, the one check that catches a bad subtraction, and the three sentences that have to go at the end of every honest answer.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-subtract-balance-and-limit',
      kind: 'concept',
      goal: 'Install the five-step change-detection routine over a two-date land-cover table, the add-to-zero balance check, the difference between net and gross change, and the three limits that belong in the answer.',
      keyIdeas: [
        'CHANGE IS A SUBTRACTION WITH A SIGN, AND THE SIGN IS HALF THE INFORMATION. A picture taken from above records what was physically on the ground at that moment, so a land-cover table turns each picture into one column: so many hectares of forest, so many of farmland, so many of built-up land, so many of water. The change in a class is the second-date figure minus the first-date figure, always in that order. A negative figure is a loss -- forest going from 3,600 hectares to 2,700 hectares is -900 hectares -- and a positive figure is a gain. Run the subtraction the other way round and every sign flips, which turns a cleared forest into a growing one, so fix the order before you write anything down: second date first, first date second.',
        'THE CHANGES MUST ADD TO ZERO, AND THAT IS THE CHECK THAT CATCHES EVERYTHING. The study area is the same piece of ground at both dates, because the analyst draws its boundary before either picture is classified, and every hectare inside it belongs to exactly one class. So the hectares one class loses are hectares some other class gained, and the four changes have to add to zero. When they do not, exactly two things can be wrong, and both are worth finding: a subtraction slipped, or the two pictures are not looking at the same ground. Add the four changes before you say a single word about what happened.',
        'MATCH THE LOSSES TO THE GAINS TO NAME THE LIKELY CONVERSION, BUT KNOW WHAT THE TOTALS CANNOT SETTLE. A CONVERSION is one patch of ground leaving one class and joining another, named by the class it left and the class it joined. If forest is the only class that lost hectares and farmland and built-up land both gained, then the lost forest is where those gains came from -- or the forest went to farmland and farmland handed the same amount on to the builders. Both readings fit the same four totals exactly, and a column of totals can never choose between them. What chooses is where the changed hectares sit: new fields lying along the old forest edge and new streets lying against the existing town are two different stories, and the pictures show which one it is.',
        'NET CHANGE HIDES GROSS CHANGE. The figure a subtraction gives you is the NET change: everything a class gained and everything it lost, already canceled against each other. A class can lose 400 hectares on one side and gain 400 on the other and come out at zero, and the table will show it standing perfectly still while 800 hectares of ground changed hands. So "no change in this class" is never a safe reading of a zero. It means the gains and the losses matched, which is a fact about the arithmetic and not a fact about the ground.',
        'THREE THINGS A PAIR OF PICTURES CANNOT SHOW, AND EACH ONE HAS ITS OWN SIGNATURE. RESOLUTION: a picture from above is built from small squares of a fixed size on the ground and each square is given one class, so anything narrower than a square never gets a class of its own. With squares 20 meters across, one square covers 400 square meters, and a hectare is 10,000 square meters, so it takes 25 squares to make one hectare -- and a line of trees 10 meters wide along a stream is thinner than a single square and cannot appear as forest at all. CLOUD: cloud sits between the camera and the ground, so the ground under it is simply not in the picture, and its signature is the total that will not balance. THE DATE GAP: two dates give you a difference and never a path, so anything that was cleared and grew back between them leaves no mark, and the change cannot be placed at any particular moment inside the gap.',
        'THE LIMITS ARE PART OF THE ANSWER, NOT AN APOLOGY AT THE END OF IT. A finished change-detection answer has three parts and is not finished without all three: the signed change in each class with the balance check shown, the most likely conversion with the evidence that picked it over the other reading, and the sentence saying what this particular pair of pictures could not have seen. An answer that gives only the first two sounds more certain than the data is, and an answer that gives only the third has measured nothing.',
      ],
      vocabulary: [
        {
          term: 'land-cover class',
          definition:
            'the category a patch of ground is put in by what is physically on it, assigned to every hectare of the study area so that the classes together account for the whole of it.',
        },
        {
          term: 'change detection',
          definition:
            'comparing the same study area at two dates class by class and reporting the signed difference in each class.',
        },
        {
          term: 'conversion',
          definition:
            'one patch of ground leaving one class and joining another, named by the class it left and the class it joined.',
        },
        {
          term: 'net change',
          definition:
            'a class figure at the second date minus its figure at the first, so that hectares gained and hectares lost have already canceled each other out.',
        },
        {
          term: 'gross change',
          definition:
            'the hectares that entered a class and the hectares that left it, counted as two separate figures instead of canceled into one.',
        },
        {
          term: 'resolution',
          definition:
            'the size on the ground of the smallest square a picture records, which fixes the narrowest feature that can be given a class of its own.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-routine',
      kind: 'worked_example',
      problem:
        'Run the routine straight through on a two-date table, and name the conversion.\n\n"The Tavi Basin study area covers 6,000 hectares. Two pictures of it were taken nine years apart, both cloud-free over the whole area.\n\nFirst picture: forest 3,600 hectares, farmland 1,500, built-up land 400, water 500.\n\nSecond picture: forest 2,700 hectares, farmland 2,100, built-up land 700, water 500.\n\nOn the ground: in the second picture the new fields lie in a band along the edge of the old forest, and the new streets and roofs lie against the edge of the town, on ground the first picture classified as farmland."',
      steps: [
        'Step one: check that both columns cover the same ground and that each one adds to the study area. First picture: 3,600 plus 1,500 is 5,100, plus 400 is 5,500, plus 500 is 6,000. Second picture: 2,700 plus 2,100 is 4,800, plus 700 is 5,500, plus 500 is 6,000. Both columns add to 6,000 hectares, and both pictures are cloud-free over the whole area, so the comparison is like for like.',
        'Step two: subtract, second date minus first date, class by class, keeping the sign. Forest: 2,700 minus 3,600 is -900 hectares. Farmland: 2,100 minus 1,500 is +600 hectares. Built-up land: 700 minus 400 is +300 hectares. Water: 500 minus 500 is 0.',
        'Step three: run the balance check. -900 plus 600 is -300, plus 300 is 0, plus 0 is 0. The four changes add to zero, so no subtraction slipped and the two pictures are seeing the same ground. Invert it as well: add each change back to its first-date figure and the second-date figure has to come back. 3,600 plus -900 is 2,700. 1,500 plus 600 is 2,100. 400 plus 300 is 700. 500 plus 0 is 500. All four return.',
        'Step four: match the losses to the gains. Forest is the only class that lost hectares, and it lost 900. The gains are 600 and 300, and 600 plus 300 is 900, so the gains account for the loss exactly. That is as far as the totals go, and it is not far enough: forest could have given 600 to farmland and 300 to the builders, or forest could have given all 900 to farmland while farmland handed 300 on to the builders. Both fit every number in the table.',
        'Step five: use where the changed hectares sit to choose between the two readings. The new fields lie along the old forest edge, so the farmland gain came out of the forest. The new streets and roofs lie against the town, on ground the first picture classified as farmland, so the built-up gain came out of farmland and not out of forest. The conversion is forest to farmland, 900 hectares, and farmland to built-up, 300 hectares. Check that against farmland: 1,500 plus 900 taken in, minus 300 handed on, is 2,100, which is exactly the second-date figure. WRONG: "Forest gave 600 hectares to farmland and 300 to the builders, because those are the two gains in the table." CORRECT: "Forest gave 900 hectares to farmland, and farmland passed 300 of its own hectares on to the builders -- the totals allow both readings and the picture shows which one happened."',
        'Notice what that does to the farmland row. Farmland reads +600, and 600 is nowhere near the whole story: 900 hectares came in and 300 went out. The net change is 600 and the gross change is 1,200 hectares of ground that changed class. The table showed one of those numbers and hid the other.',
        'Now rewind the input and read it backwards to be sure nothing was misread: water 500 and 500, built-up 400 then 700, farmland 1,500 then 2,100, forest 3,600 then 2,700. Then change ONE thing and run it again. Suppose everything in the table stayed the same and only the ground detail differed -- the new streets and roofs stood in the middle of what the first picture showed as forest, nowhere near the town. Now forest gave 600 hectares to farmland and 300 to the builders, farmland took in 600 and gave up nothing, and 1,500 plus 600 is 2,100, which still matches. Identical table, opposite conversion. That is the clearest possible demonstration that a column of totals constrains the answer without ever fixing it.',
      ],
      answer:
        'Both columns add to 6,000 hectares. The changes are forest -900, farmland +600, built-up land +300 and water 0, which add to zero, and adding each change back to its first-date figure returns every second-date figure. The gains account for the loss exactly, but two conversion readings fit those totals. The ground detail settles it: the new fields lie along the old forest edge and the new streets stand on ground the first picture classified as farmland, so 900 hectares of forest became farmland and 300 hectares of farmland became built-up land, which checks out as 1,500 plus 900 minus 300 equals 2,100. Farmland therefore has a net change of +600 and a gross change of 1,200. With the same table and the new streets standing in former forest instead, the reading becomes forest to farmland 600 and forest to built-up 300 -- the same numbers, the other conversion.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-repair-the-cloud-gap',
      kind: 'worked_example',
      problem:
        'A student ran the routine on a cloudy pair and got a figure that is too big. Find the step that went wrong, repair it, and say what the wrong number was actually measuring.\n\n"The Sennar Plain study area covers 4,000 hectares. The first picture is clear over the whole plain: forest 1,800 hectares, farmland 1,400, built-up land 500, water 300.\n\nThe second picture, taken twelve years later, has cloud sitting over 500 hectares of the plain. Over the 3,500 hectares it can see, it reads: forest 1,100 hectares, farmland 1,500, built-up land 600, water 300.\n\nOf the 500 hectares under the cloud, the first picture read 400 as forest and 100 as farmland."\n\nThe student wrote: "Forest 1,100 minus 1,800 is -700. Farmland 1,500 minus 1,400 is +100. Built-up 600 minus 500 is +100. Water 0. The plain lost 700 hectares of forest in twelve years."',
      steps: [
        'Check the subtractions first, because a wrong conclusion does not always come from a wrong subtraction. 1,100 minus 1,800 is -700. 1,500 minus 1,400 is +100. 600 minus 500 is +100. 300 minus 300 is 0. All four subtractions are right. The slip is not in the arithmetic.',
        'Run the balance check, which the student skipped. -700 plus 100 is -600, plus 100 is -500, plus 0 is -500. The four changes add to -500, not to zero, and the plain did not shrink: its boundary was drawn before either picture was classified, so it is 4,000 hectares on both dates. An unbalanced total of exactly -500 with 500 hectares under cloud is not a coincidence. The two columns are not covering the same ground -- the first column describes 4,000 hectares and the second describes 3,500.',
        'Repair it by re-basing both columns onto the ground both pictures actually see. Take the cloud-covered hectares out of the first column as well: of those 500, the first picture read 400 as forest and 100 as farmland. Forest: 1,800 minus 400 is 1,400. Farmland: 1,400 minus 100 is 1,300. Built-up land and water are untouched at 500 and 300. Check the new column: 1,400 plus 1,300 is 2,700, plus 500 is 3,200, plus 300 is 3,500, which matches the area the second picture can see.',
        'Re-run step two on the matched columns. Forest: 1,100 minus 1,400 is -300. Farmland: 1,500 minus 1,300 is +200. Built-up land: 600 minus 500 is +100. Water: 0. Now the balance check: -300 plus 200 is -100, plus 100 is 0. It closes. Invert as well: 1,400 plus -300 is 1,100, 1,300 plus 200 is 1,500, 500 plus 100 is 600, 300 plus 0 is 300. Every second-date figure returns.',
        'Give the verdict and say what the wrong number was. WRONG: "The plain lost 700 hectares of forest in twelve years." CORRECT: "Over the 3,500 hectares both pictures see, 300 hectares of forest went -- 200 to farmland and 100 to built-up land -- and the other 400 hectares of the apparent loss is forest that the first picture measured and the second picture could not see." The student\'s -700 was not a measurement of clearing at all. It was 300 hectares of real change plus 400 hectares of cloud, added together as though they were the same kind of thing.',
        'Rewind the input and read it backwards to confirm nothing was misread: 300 water at both dates, 500 then 600 built-up, 1,400 then 1,500 farmland over the whole plain, 1,800 then 1,100 forest over unequal ground, 500 hectares of cloud holding 400 forest and 100 farmland.',
        'Now change ONE input and run it again. Suppose the cloud covered the same 500 hectares, but the first picture had read all 500 of them as farmland and none as forest. Re-base: forest stays at 1,800, farmland becomes 1,400 minus 500, which is 900, and built-up and water stay at 500 and 300. Check the column: 1,800 plus 900 is 2,700, plus 500 is 3,200, plus 300 is 3,500. Now the changes are forest 1,100 minus 1,800, which is -700; farmland 1,500 minus 900, which is +600; built-up +100; water 0. Balance: -700 plus 600 is -100, plus 100 is 0. It closes, and this time the forest loss really is 700 hectares. Same second picture, same amount of cloud, completely different answer -- because what matters is not how much cloud there was but what the first picture had recorded underneath it.',
      ],
      answer:
        'The four subtractions were right and the columns were mismatched. The changes added to -500 instead of zero, which is exactly the 500 hectares of cloud, so the first column was describing 4,000 hectares while the second described 3,500. Taking the cloud-covered hectares out of the first column as well -- 400 forest and 100 farmland -- gives forest 1,400, farmland 1,300, built-up 500, water 300, which adds to 3,500. The matched changes are forest -300, farmland +200, built-up +100 and water 0, which balance to zero and invert correctly. The measured loss is 300 hectares of forest, not 700; the other 400 hectares is forest the second picture could not see. Had the cloud instead covered 500 hectares that the first picture read as farmland, the matched loss would have been the full 700, which shows the answer depends on what was under the cloud rather than on how much cloud there was.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-compute-the-changes',
      kind: 'try_yourself',
      problem:
        'The Kessel Flats study area covers 2,500 hectares and was pictured twice, six years apart, with no cloud on either date.\n\n"First picture: forest 1,000 hectares, farmland 900, built-up land 400, water 200.\n\nSecond picture: forest 700 hectares, farmland 1,050, built-up land 550, water 200."\n\nWhich set of changes is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Forest +300 hectares, farmland -150 hectares, built-up land -150 hectares, water 0 hectares' },
        { id: 'b', text: 'Forest -300 hectares, farmland +150 hectares, built-up land +150 hectares, water 0 hectares', correct: true },
        { id: 'c', text: 'Forest -300 hectares, farmland -150 hectares, built-up land -150 hectares, water 0 hectares' },
        { id: 'd', text: 'Forest -300 hectares, farmland +300 hectares, built-up land 0 hectares, water 0 hectares' },
      ],
      expectedAnswer: 'Forest -300 hectares, farmland +150 hectares, built-up land +150 hectares, water 0 hectares',
      hints: [
        'Subtract in one fixed order for every class: the second-date figure minus the first-date figure. Then add your four answers together and see what they come to.',
        'Add the four changes in each set. Only one set adds to zero, and the study area is the same 2,500 hectares on both dates, so any set that does not add to zero is wrong before you read it. Watch for the order of the subtraction flipping every sign, for a set that reads all three differences as losses, and for a set that sends the whole forest loss to farmland without ever reading the built-up row.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-unbalanced-total',
      kind: 'try_yourself',
      problem:
        'The Loring Basin study area covers 3,000 hectares.\n\n"First picture, clear over the whole basin: forest 1,700 hectares, farmland 900, built-up land 300, water 100.\n\nSecond picture, taken eight years later, with cloud over part of the basin: forest 1,200 hectares, farmland 1,000, built-up land 300, water 100."\n\nSubtracting class by class gives -500, +100, 0 and 0, which add to -400 rather than to zero. What does that tell you?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The basin itself lost 400 hectares between the two dates, because the study area is measured fresh from each picture and can come out a different size each time, so the shortfall is real ground and the change figures can stand as they are' },
        { id: 'b', text: 'One of the four subtractions was done wrong, because an unbalanced total always means a slipped figure, so redoing the four subtractions will bring the total back to zero without anything else having to change' },
        { id: 'c', text: 'Nothing is wrong at all: the cloud covers only a corner of the basin, and the four changes in a land-cover table are not expected to add to zero anyway, since each class is measured on its own and carries no arithmetic tie to the other three' },
        { id: 'd', text: 'The two pictures do not cover the same ground: 400 hectares that the first picture classified are under cloud in the second, so those hectares were not measured and both columns have to be re-based onto the 2,600 hectares both pictures see', correct: true },
      ],
      expectedAnswer: 'The two pictures do not cover the same ground: 400 hectares that the first picture classified are under cloud in the second, so those hectares were not measured and both columns have to be re-based onto the 2,600 hectares both pictures see',
      hints: [
        'Add each column up before you do anything else. The first picture accounts for 3,000 hectares. What does the second picture account for, and what is the difference between those two totals?',
        'The study area boundary is drawn before either picture is classified, so the area cannot come out a different size on the second date, and a total that misses zero by exactly the amount of missing ground is not a slipped subtraction. Check the subtractions anyway, then look for the ground that is in one column and not the other.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-net-change-hides',
      kind: 'try_yourself',
      problem:
        'The Ardwell District study area covers 5,000 hectares and was pictured twice, ten years apart, with no cloud on either date.\n\n"First picture: forest 2,000 hectares, farmland 2,200, built-up land 600, water 200.\n\nSecond picture: forest 1,600 hectares, farmland 2,200, built-up land 1,000, water 200.\n\nOn the ground: the new streets and roofs stand at the edge of the existing town, on ground the first picture classified as farmland, and the new fields lie in a band along the edge of the old forest."\n\nA report says: "Farmland did not change in Ardwell District." Which statement does the data actually support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Farmland gave up 400 hectares to built-up land and took in 400 hectares from forest, so a net change of zero is hiding 800 hectares of ground that changed class', correct: true },
        { id: 'b', text: 'Forest became built-up land directly, because forest lost exactly 400 hectares while built-up land gained exactly 400, and matching a loss to a gain of the same size is what names a conversion' },
        { id: 'c', text: 'Farmland really did not change, because a class that reads the same figure in both pictures has had nothing at all happen to the ground inside it' },
        { id: 'd', text: 'No conversion can be named from this data, because two pictures taken ten years apart cannot show which class any particular hectare belonged to' },
      ],
      expectedAnswer: 'Farmland gave up 400 hectares to built-up land and took in 400 hectares from forest, so a net change of zero is hiding 800 hectares of ground that changed class',
      hints: [
        'Work out the four changes first, then read the two sentences about where the new streets and the new fields actually sit. Those sentences say which class each patch of changed ground came out of.',
        'A zero in a change column means the gains and the losses matched, which is a fact about the arithmetic rather than a fact about the ground. Matching the forest loss to the built-up gain by size alone ignores where the new streets stand, and refusing to name any conversion throws away the one piece of evidence that settles it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-totals-fix-the-path-and-gap-gives-a-rate',
      kind: 'misconception_check',
      question:
        'Working on the Tavi Basin table -- forest 3,600 hectares then 2,700, farmland 1,500 then 2,100, built-up land 400 then 700, water 500 then 500, over a nine-year gap -- a student writes: "Forest lost 900 and farmland gained 600, so 600 hectares of forest became farmland and the other 300 became built-up land." Then: "Nine years, 900 hectares, so the forest was falling by 100 hectares a year." What is wrong with each?',
      commonErrors: [
        {
          answer: 'Forest lost 900 and farmland gained 600, so 600 hectares of forest became farmland and the other 300 became built-up land.',
          misconception:
            'Treating the column of totals as though it fixed the path the hectares took. The reading is arithmetically possible, and the student has stopped at the first possibility that balances instead of asking whether a second one balances just as well.',
          correctsTo:
            'A second reading fits the identical totals: forest gives all 900 hectares to farmland, and farmland hands 300 of its own hectares on to the builders. Check it -- 1,500 plus 900 minus 300 is 2,100, which is the second-date farmland figure, and forest 3,600 minus 900 is 2,700, and built-up 400 plus 300 is 700. Every number in the table is satisfied, and it is a different story about the ground. WRONG: "The gains in the table name the conversions." CORRECT: "The totals narrow the conversion to two readings and cannot choose between them; where the changed hectares sit is what chooses." In the Tavi Basin the new streets stand on ground the first picture classified as farmland, at the town edge, so the second reading is the one the evidence supports, and farmland turns out to have a net change of +600 while 1,200 hectares of its ground actually changed class.',
        },
        {
          answer: 'Nine years, 900 hectares, so the forest was falling by 100 hectares a year.',
          misconception:
            'Reading a difference between two dates as a rate that held throughout the gap. Two dates give a starting figure and an ending figure and nothing whatever about the shape of the line between them.',
          correctsTo:
            'The division is correct as far as it goes: 900 divided by 9 is 100, and the check is 100 times 9, which is 900. What is wrong is the word "was". That 100 is an average across the whole gap, not a rate that any single year was observed to have. The same two pictures are equally consistent with 900 hectares cleared in one year and nothing in the other eight, and with a patch cleared in year two that grew back by year seven, which leaves no mark at all because it is in the same class on both dates. WRONG: "900 hectares over nine years, so 100 hectares a year." CORRECT: "The forest lost 900 hectares across the nine years between the pictures, which averages 100 a year; the pictures cannot say when inside that gap it went, or whether it went steadily." To claim a rate you need dates in between, and this pair does not have any.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The change in a class is the second-date figure minus the first-date figure, in that order every time. Keep the sign: -900 hectares is a loss and +600 hectares is a gain.',
        'The four changes must add to zero, because the study area is the same ground at both dates. Add them before you interpret anything.',
        'A total that misses zero means one of exactly two things: a slipped subtraction, or two pictures that are not seeing the same ground. Cloud is the usual second cause, and the repair is to take the unseen hectares out of both columns and re-base.',
        'The losses and the gains narrow the conversion to a small number of readings and never choose between them. Where the changed hectares sit is what chooses.',
        'Net change hides gross change. A class can read zero while 400 hectares left it and 400 arrived, so a zero is a statement about the arithmetic and not about the ground.',
        'Anything narrower than one square of the picture never gets a class of its own, so a thin line of trees along a stream cannot appear as forest.',
        'Two dates give a difference, never a path. Dividing the change by the years gives an average across the gap, not a rate for any one year, and anything that changed and changed back inside the gap leaves no mark.',
        'A finished answer has three parts: the signed changes with the balance check, the conversion with the evidence that picked it, and the sentence saying what this pair of pictures could not see.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Change Detection from Satellite Data' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
