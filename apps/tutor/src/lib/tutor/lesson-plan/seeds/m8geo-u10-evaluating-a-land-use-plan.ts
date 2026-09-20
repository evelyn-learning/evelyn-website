/**
 * Grade 8 World Geography — Capstone: Geographic Decisions: Evaluating a
 * Land-Use Plan.
 *
 * PROCEDURE-LED (shaped on `m8geo-u1-counts-rates-and-fair-comparison.ts`):
 * the concept segment is an ordered routine run over a described town, the
 * first worked example runs it straight through on two competing plans and
 * then changes ONE input — the criterion — and watches the winner flip, and
 * the second worked example repairs a half-finished verdict by giving the
 * cost an address. Row 10.2 is a synthesis row: it LEANS on Unit 2 (a stated
 * buffer, an overlay of parcels on a flood zone), Unit 7 (exposure as a count
 * inside a boundary) and Unit 4 (homes per hectare as urban form) and
 * RE-TEACHES none of them — each arrives as a single premise clause where it
 * is used.
 *
 * THE ROUTINE, in the order it is always run:
 *   1. Write the criterion as a test with a number in it, before reading
 *      either plan.
 *   2. Run both plans through the same three checks, parcel by parcel: what
 *      the plan builds on (the overlay against the flood zone), how many homes
 *      it puts inside that zone (the exposure count and its share), and how
 *      tightly it builds and how far that is from a road (the form check).
 *   3. Give the criterion verdict with the digits.
 *   4. Give the cost an address: ask every group what it had before and what
 *      it has after, and compare SHARES of each group, not counts.
 *   5. Invert the arithmetic, rewind the data, then change ONE input and run
 *      the whole thing again.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause each where it is used, that a
 * flood zone stated as the land within a distance of a river is a line every
 * parcel can be tested against (row 2.2 `m8geo-u2-buffers-and-proximity.ts`),
 * that separate layers of parcels, water and roads can be read against each
 * other (row 2.1 `m8geo-u2-gis-layers-and-overlay.ts`), that exposure is a
 * count inside the area a hazard reaches (row 7.1
 * `m8geo-u7-hazard-risk-exposure-and-vulnerability.ts`), that a share is a
 * count divided by the total it came out of (row 1.1), and that a planner
 * places roads, parks, farms and housing from land, water and resource facts
 * (Grade 6, `m6geo-u10-using-geography-to-plan-a-community.ts`) while rapid
 * growth puts pressure on land, housing and services (Grade 7,
 * `m7geo-u3-urbanization-and-settlement.ts`). It re-teaches none of them, and
 * the words were grepped against the finished body: "buffer" and "hazard"
 * occur exactly once each in the whole file, inside `los[0].description`,
 * where the signed scope cell's own wording is carried verbatim; "overlay" and
 * "exposure" occur only as the LABELS of check one and check two, with the
 * count named in the same clause where it is used; and "rate", "denominator",
 * "layer", "vulnerability", "risk" and "density" do not occur in any authored
 * field at all. No keyIdea defines a buffer, explains how a buffer is drawn
 * around a point or a line, defines a layer, defines a rate, or says what a
 * planner does. It ADDS turning a stated criterion into a numbered pass-or-
 * fail test, running two competing plans through the same three checks in the
 * same order, stating the criterion verdict with the digits, and then giving
 * the cost an address by comparing each group's loss as a share of that
 * group's own total. It names NO urban-structure model — no concentric zone,
 * sector or multiple-nuclei model, and no gentrification
 * (`ap-human-geo-urban.ts`). It does NOT construct or widen a buffer or decide
 * an on-the-line case (row 2.2), does NOT split criteria into must-haves and
 * weighted preferences or compute a weighted total (row 2.3
 * `m8geo-u2-site-selection-with-weighted-criteria.ts`), does NOT multiply
 * hazard by exposure by vulnerability (row 7.1), does NOT count by elevation
 * band or sort responses into protect, accommodate and retreat (row 7.3
 * `m8geo-u7-coastal-risk-and-sea-level.ts`), does NOT classify an action as
 * mitigation or adaptation or divide a price tag by the households an action
 * reaches (row 7.4 `m8geo-u7-mitigation-adaptation-and-resilience.ts`), does
 * NOT compare a population growth factor with a land growth factor (row 4.3
 * `m8geo-u4-north-america-metropolitan-regions.ts`), does NOT build a claim,
 * evidence and reasoning structure (row 10.1), does NOT compare two regions on
 * indicator tables (row 10.3), and does NOT project a trend forward or test an
 * assumption (row 10.4). Three things ARE deliberately allowed, because
 * neighboring rows sit close and the line is worth drawing precisely rather
 * than avoiding: (a) counting how many new homes fall inside a flood zone the
 * case already states, which is APPLYING a distance rule handed to the student
 * rather than constructing or evaluating one, and no parcel in this file sits
 * on the line; (b) exposure as a count and as a share of the town, used as the
 * input the criterion is written against and never multiplied into a risk
 * figure; (c) the homes-per-hectare division, which is the form half of this
 * row's three checks and is not a growth-factor comparison. No parcel boundary
 * anywhere in this file falls on a flood-zone line, so no on-the-line case --
 * row 2.2's -- arises to be decided. The scope
 * cell for this row carries a positive statement and a lineage clause but NO
 * withheld clause; the upper boundary above comes from the signed curriculum's
 * "Explicitly excluded" list, which names row 10.2 under urban-structure
 * models.
 *
 * DEPTH FLOOR NOTE FOR THE FAN-OUT: every keyIdea below is about what you DO
 * with a plan — write the test, run the checks in order, state the verdict
 * with digits, divide each loss by the group's own total, change an input and
 * re-run. None of them says what a plan is, what a planner does, or which land
 * suits which use, which is the Grade 6 row this one deepens. The pair that
 * came closest was keyIdea 2 here ("run both plans through the same three
 * checks") against that Grade 6 file's "the planner starts by gathering land,
 * water and resource facts before deciding anything"; keyIdea 2 survived
 * because it is a fixed comparison routine producing counts for two rival
 * plans, not the habit of looking before choosing.
 *
 * BURNED-SPECIMEN NOTE (ruling 32/36): `los[0].description` is student-facing
 * and this row's scope cell names no concrete specimen — only the material
 * types (parcels, a flood zone, a road network, three stakeholder groups) — so
 * nothing concrete is burned by the objective. Windrow, the Mallow River,
 * North Road, Plan Northbank and Plan Southfield are TEACHING specimens and
 * appear only in the hook, concept, both worked examples, the misconception
 * check and the recap. The three items use three towns of their own, which
 * appear nowhere else in the file: Tarrow with Braid Creek, Cobden, and
 * Pennick. The first draft of this file failed that rule in the other
 * direction and it was caught by listing every item specimen and grepping the
 * teaching segments for it: concept keyIdea 5 and recap line 5 carried "9 of
 * 12 fields is 75 percent against 12 of 300 plots, which is 4 percent", which
 * is item 2's specimen exactly, so item 2 was answerable from the concept
 * segment by recall. The teaching figures are now 8 of 10 against 25 of 500.
 * Do not move a teaching specimen into an item, or an item's specimen into a
 * teaching segment.
 *
 * CURRENCY NOTE: the brief lists 10.2 among the rows permitted to carry
 * currency. This file carries none, deliberately. Every cost here is measured
 * in the things the described town actually holds — fields, homes, hectares,
 * meters to a road — because the moment a plan's price is divided by the
 * households it reaches, the row is running row 7.4's move, and because the
 * counterintuitive edge this row needs (the small group whose whole holding is
 * taken) lives in shares, not in dollars.
 *
 * ACCURACY NOTE: no real place is named anywhere in this file and no real
 * place carries a number. Windrow, Tarrow, Cobden and Pennick are invented,
 * and every figure was written for the arithmetic. The only claims about the
 * real world are that a flood zone stated as the land within a distance of a
 * river is a boundary a parcel can be tested against, that a home inside it is
 * in the way of the water while a home outside it is not, and that land built
 * on for housing is no longer available for farming. Naming the group that
 * bears a plan's cost is a MEASUREMENT of what each group had before and has
 * after, never a judgment about the plan, the council or the people in any
 * group, and the file says so out loud in keyIdea 5, in the second worked
 * example and in the recap.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped Grade
 * 7 Geography bank the keyed answer was the strictly longest choice 67% of the
 * time, and 94% at difficulty 4; chance with four choices is 25%). The
 * PER-ITEM discipline is the point: every distractor here states the full
 * wrong STEP that produces it — the far edge of a parcel read as the whole
 * parcel, half a pass read as a pass, a refusal to measure, the count of
 * pieces taken read as the size of the bill, the size of a group read as the
 * size of its bill, a verdict that stops at the criterion, a verdict that
 * stops at the cost — and no key was built to be the longest choice BECAUSE it
 * is the key. Measured as a diagnostic, not as a score: the key is the
 * strictly longest choice in 0 of the 3 items, ranking first-equal, third and
 * second of four by character count (184 in a set of 179/184/182/184; 156 in
 * 189/160/156/151; 185 in 166/165/203/185). Zero is NOT the target and was not
 * aimed at -- the first measurement was 1 of 3 with the key SHORTEST in the
 * other two, which is the same tell inverted (ruling 16), so two keys gained a
 * load-bearing clause they were honestly missing (the 200-meter clear margin
 * that is the reason Upfield passes; the referent of the 4 percent) and one
 * distractor was made more diagnostic by naming the half of the verdict it
 * skips. The real measurement is the 120-item course rate taken at
 * registration. The three keys sit at ids b, c and d, which is the id set
 * `(10 + 2) mod 4 = 0` requires, omitting a.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every parcel, distance,
 * plan and group is written out in prose inside the segment that needs it, and
 * every item is solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U10_EVALUATING_A_LAND_USE_PLAN: LessonPlan = {
  id: 'evelyn.ms.m8geo.evaluating-a-land-use-plan.v1',
  title: 'Evaluating a Land-Use Plan',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.evaluating-a-land-use-plan',
      standard: 'M8GEO-10.2',
      description:
        'Given a town with parcels, a flood zone, a road network and three stakeholder groups, evaluate two zoning plans using buffer and overlay reasoning, hazard exposure and urban form, and state which plan better meets a stated criterion and which group bears its cost (National Geography Standard 18: how to apply geography to interpret the present and plan for the future).',
    },
  ],
  prerequisites: ['m8geo.building-a-geographic-argument'],
  followUps: ['m8geo.comparing-two-regions-with-indicators'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that "better plan" is not a verdict until a criterion is attached to it and the bill is given an address.',
      script:
        'Two plans for the same 300 new homes go up side by side on the wall at a town meeting, and within a minute half the room is saying one of them is better. Better at what? A plan is not better the way one phone is better than another. It is better against one stated test -- add the homes without putting more of them where the river floods, say, or add the homes within walking distance of a road -- and the same two plans can trade places the moment the test changes, without one meter of river or road moving. Then there is the half of the argument the room usually skips. Every plan that passes its test passes it by taking something from somebody: a field, a view, a short walk to the shops. That bill has an address, and the address is almost never the group shouting loudest. Today you run two rival plans through the same three checks, say which one meets the criterion with the figures in your hand, and then say out loud which group pays for it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-criterion-then-checks-then-address',
      kind: 'concept',
      goal: 'Install the routine: write the criterion as a numbered test, run both plans through the same three checks, state the verdict with digits, give the cost an address by shares, and re-run on a changed input.',
      keyIdeas: [
        'WRITE THE CRITERION AS A TEST WITH A NUMBER IN IT, BEFORE YOU READ EITHER PLAN. A council never asks which plan is good; it asks which plan does a stated job. "Add 300 homes and do not raise the number of homes inside the flood zone above the 30 there today" is a test: when a plan has been run, the flood-zone count either is 30 or it is not, and anybody can check which. "Protect the river" is not a test, because two people will read it two ways and neither can be shown wrong. So the first move is always the same: turn the stated criterion into a sentence with a number in it, write it down, and only then open the plans. Doing it in that order is what stops you from picking the plan you already liked and then reaching for the test it happens to pass.',
        'RUN BOTH PLANS THROUGH THE SAME THREE CHECKS, IN THE SAME ORDER, PARCEL BY PARCEL. Check one, the overlay: take each parcel the plan builds on and test it against the flood zone the case states, so that a parcel that begins beyond the stated distance is clear of it and a parcel that straddles the line is partly inside. Check two, the exposure count: how many of the new homes land inside that zone, and what share of the whole town is inside it once the plan is built. Check three, the form: the homes divided by the hectares they sit on, which says how tightly the plan builds, and the distance from those homes to a road, which says what the people living in them have to cross to reach anything. Three checks, both plans, same order, every time. One check never decides a plan, because the plan that wins check one is very often the plan that loses check three.',
        'STATE THE VERDICT WITH THE DIGITS, NOT WITH AN ADJECTIVE. Take two plans pinned up on a town-hall wall, Plan Northbank and Plan Southfield, and a criterion about homes inside the flood zone. "Plan Southfield is better on flooding" is a sentence nobody can check. "Plan Southfield holds the flood-zone count at 30 and Plan Northbank raises it to 180, which is six times as many" is a sentence anybody can check, and it is also the sentence that survives an argument. The rule is that every verdict carries the two figures it is comparing, and where a share makes the two comparable it carries the share as well: 30 homes out of 600 is 5 percent of the town inside the zone, and 180 out of 900 is 20 percent.',
        'A PLAN THAT PASSES ITS TEST STILL HAS A BILL, SO ASK EVERY GROUP WHAT IT HAD BEFORE AND WHAT IT HAS AFTER. The criterion verdict is half an evaluation. The other half is the address of the cost, and you find it the same mechanical way each time: list the groups the case names, and for each one write down the thing it holds before the plan and the thing it holds after. A group that holds the same before and after pays nothing, however large it is and however loudly it speaks. A group whose holding disappears pays everything, however small it is.',
        'COMPARE THE SHARE OF EACH GROUP, NOT THE COUNT, OR THE SMALL GROUP DISAPPEARS. Divide what each group lost by what that group had. Eight fields taken from a group that owned 10 is 8 divided by 10, which is 80 percent of everything that group had; 25 house lots taken from a group that owned 500 is 25 divided by 500, which is 5 percent. Multiply back to check: 80 percent of 10 is 8, and 5 percent of 500 is 25. The larger count is the far smaller bite, and reading the counts alone gets it exactly backwards. This is also where the language has to stay careful: saying that a cost lands on one group is a measurement of what was taken from whom, not a ruling that the plan is unfair or that the group deserves it. An evaluation hands the council a criterion result and an address; the council still has to decide.',
        'THE WINNER BELONGS TO THE CRITERION AND THE DATA, NOT TO THE PLAN, SO CHANGE ONE INPUT AND RUN IT AGAIN. Swap the criterion from flood-zone homes to walking distance from a road and two plans can swap places while every parcel, every meter and every home stays exactly where it was. Widen the flood zone by 100 meters and a parcel that was clear can become half inside. Neither change makes the earlier answer wrong; both show what the earlier answer actually depended on. So finish the routine by inverting the arithmetic -- multiply the homes-per-hectare figure back by the hectares and recover the homes -- and then re-running the whole comparison with one thing altered, so you learn the plan and not the outcome.',
      ],
      vocabulary: [
        {
          term: 'criterion',
          definition:
            'the stated job a plan has to do, rewritten with a number in it so that a finished plan either passes or fails and anybody can check which.',
        },
        {
          term: 'land-use plan',
          definition:
            'a decision about which parcel of land gets which use, written out parcel by parcel so that each choice can be tested against a criterion.',
        },
        {
          term: 'stakeholder group',
          definition:
            'a counted set of people a plan treats the same way, named and counted so that a cost can be given an address.',
        },
        {
          term: 'trade-off',
          definition:
            'what a plan gives up in order to meet its criterion, stated as the thing given up together with the group that gives it up.',
        },
        {
          term: 'homes per hectare',
          definition:
            'the number of homes divided by the hectares of land they sit on, which measures how tightly a plan builds rather than how much it builds.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-two-plans-against-one-criterion',
      kind: 'worked_example',
      problem:
        'Run the routine straight through on two rival plans, then change the criterion and run it again.\n\n"Windrow. The Mallow River runs east to west across the town, and the town rule states that the flood zone is the land within 200 meters of the river on either side. North Road runs east to west, 400 meters north of the river. Windrow has 600 homes today, and 30 of them stand inside the flood zone.\n\nTwo parcels are open for building. The river meadow is 10 hectares, running from the north bank back to 400 meters north, with North Road along its far edge. The south fields are 30 hectares, beginning 400 meters south of the river and running south; the 15 market-garden farms of Windrow work those 30 hectares, 2 hectares each.\n\nPlan Northbank puts all 300 new homes on the river meadow. Plan Southfield puts all 300 new homes on the south fields. In both plans the homes are spread evenly across the parcel."\n\nThe council criterion: add 300 homes and do not raise the number of homes inside the flood zone above the 30 there today.',
      steps: [
        'Step one: write the criterion as a test with a number in it. After the plan is built, Windrow must hold 600 plus 300, which is 900 homes, and the count of homes inside the flood zone must still be 30. Two numbers, both checkable. Write them down before opening either plan.',
        'Step two, check one for Plan Northbank -- the overlay. The river meadow runs from the bank back to 400 meters north, and the flood zone reaches 200 meters. So the flood zone covers 200 of the parcel\'s 400 meters of depth: 200 divided by 400 is 0.5, exactly half the parcel. The homes are spread evenly, so half of them are inside: 0.5 times 300 is 150 homes. Check by inverting: 150 doubled is 300, so the other half, 150 homes, is outside.',
        'Step two, check one for Plan Southfield. The south fields begin 400 meters south of the river and the flood zone reaches 200 meters south, so the nearest corner of the parcel sits 400 minus 200, which is 200 meters clear of the zone. No part of the parcel is inside it, so 0 of the 300 homes are inside.',
        'Step two, check two -- the exposure count and its share. Today: 30 homes inside out of 600, and 30 divided by 600 is 0.05, which is 5 percent of the town; check, 5 percent of 600 is 30. Under Plan Northbank: 30 plus 150 is 180 homes inside, out of 900, and 180 divided by 900 is 0.20, which is 20 percent; check, 20 percent of 900 is 180. The share of Windrow sitting inside the flood zone would go from 5 percent to 20 percent, and 20 divided by 5 is 4, so four times the share. Under Plan Southfield: the count stays at 30, out of 900 homes, which is one home in every 30.',
        'Step two, check three -- the form. Plan Northbank: 300 homes divided by 10 hectares is 30 homes per hectare; check, 30 times 10 is 300. Plan Southfield: 300 divided by 30 hectares is 10 homes per hectare; check, 10 times 30 is 300. Northbank builds three times as tightly, 30 against 10, on a third of the land. Distance to a road: North Road runs along the river meadow\'s far edge, so no Northbank home is more than 400 meters from it, while the nearest Southfield home is 400 meters south of the river plus the 400 meters from the river to the road, which is 800 meters.',
        'Step three: state the verdict with the digits. Plan Southfield meets the criterion -- 900 homes, and the flood-zone count held at 30. Plan Northbank fails it -- 900 homes, but 180 inside the flood zone, which is 180 divided by 30, or six times the figure the criterion allows. WRONG: "Plan Northbank is the better plan, because it puts the new homes beside the road where the town already is." CORRECT: "Plan Northbank is the closer plan to the road, at 400 meters against 800, and that is a real advantage, but the criterion asked about the flood-zone count, and Northbank raises it from 30 to 180 while Southfield holds it at 30."',
        'Rewind the input and read the data backwards to confirm nothing was misread. 15 farms at 2 hectares each is 15 times 2, which is 30 hectares, the size of the south fields. 30 homes inside the flood zone and 600 in the town leaves 600 minus 30, which is 570 outside it. The river meadow is 400 meters deep and the flood zone reaches 200, which is half. Every figure the verdict used comes back out of the description.',
        'Now change ONE input and run it again. Leave every parcel, meter and home exactly where it is, and swap the criterion to: add 300 homes with every new home within 500 meters of an existing road. Plan Northbank: the farthest home from North Road is the one on the bank, 400 meters away, and 400 is less than 500, so every Northbank home passes. Plan Southfield: the nearest home is 800 meters from North Road, and 800 is more than 500, so every Southfield home fails. The winner has flipped, and nothing moved except the sentence the council wrote down. That is why the criterion gets written first: it is not a formality, it is the thing that decides.',
      ],
      answer:
        'Against the stated criterion, Plan Southfield wins. Northbank puts half its parcel inside the flood zone -- 200 of the parcel\'s 400 meters of depth, so 150 of its 300 homes -- taking the town from 30 homes inside the zone to 180, which is 20 percent of the 900 homes against 5 percent of the 600 today. Southfield begins 200 meters clear of the zone and adds 0, holding the count at 30. On form, Northbank builds at 30 homes per hectare within 400 meters of North Road and Southfield at 10 homes per hectare 800 meters from it. Change the criterion to every new home within 500 meters of a road and the verdict reverses: Northbank\'s farthest home is 400 meters out and passes, Southfield\'s nearest is 800 and fails.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-give-the-cost-an-address',
      kind: 'worked_example',
      problem:
        'A verdict has been half written. Finish it, and repair the sentence that guesses at who pays.\n\nWindrow has three stakeholder groups: the 15 farm families who work the 30 hectares of the south fields, 2 hectares each; the 30 households whose homes already stand inside the flood zone; and the 570 households in the rest of the town. Plan Southfield, the plan that met the council criterion, builds on all 30 hectares of the south fields.\n\nA student writes: "Plan Southfield meets the criterion, so it is the plan, and it costs nobody anything -- not one person has to move house." A council member answers: "If it costs anybody, it costs the 570 households in the rest of town, because there are far more of them than there are farm families."',
      steps: [
        'Start by naming what is missing, because the student\'s first sentence is true. Southfield does meet the criterion. But meeting the criterion is half of an evaluation; the other half is the address of the cost, and "nobody" is an answer that has not been looked up. Go and look it up, group by group.',
        'Group one, the farm families. Before the plan: 15 farms working 30 hectares, 2 hectares each; check, 2 times 15 is 30. After the plan: the 300 homes cover all 30 hectares, so the farms work 0 hectares. That is 15 of 15 farms losing their land, and 15 divided by 15 is 1, which is 100 percent of the group.',
        'Group two, the 30 households already inside the flood zone. Before: 30 homes inside the zone. After: still 30, because Southfield adds none. Nothing is taken from them, 0 of 30, which is 0 percent -- and the criterion the plan met is the thing that keeps that figure at 30.',
        'Group three, the 570 households in the rest of town. Before: 570 homes. After: 570 homes. 0 of 570 taken, which is 0 percent. Check the group arithmetic: 30 plus 570 is 600, the town today, and 600 plus 300 is 900, the town after the plan.',
        'Now repair the council member\'s sentence. WRONG: "It costs the 570 households, because there are far more of them." CORRECT: "The 570 households lose nothing at all -- 0 of 570 -- and the 15 farm families lose 15 of 15, which is every field they work." The size of a group says how many people are in it. It says nothing about how much a plan takes from them, and here the largest group pays nothing while the smallest pays everything.',
        'Confirm the address with three clues of different kinds, because one is a hunch. First, what the plan removes: all 30 hectares of the south fields, which is every hectare the 15 farms work. Second, the before-and-after counts, group by group: 15 farms to 0, 30 flood-zone homes to 30, 570 homes to 570 -- one group changes and two do not. Third, where the benefit lands: holding the flood-zone count at 30 protects the 30 riverside households, and the 300 new homes go to people who do not live in Windrow yet, so no part of the benefit is specific to the farm families. Three kinds of evidence, all pointing at the same address. One number is a hunch; three of different kinds, all pointing the same way, is evidence.',
        'Say the finished verdict as two sentences, and say what it is not. Plan Southfield meets the criterion, holding the flood-zone count at 30 against the 180 Plan Northbank would leave; its cost lands on the 15 farm families, who lose 15 of 15 fields, while the other two groups lose nothing. That is a measurement of what each group had before and has after, not a ruling that the plan is unfair and not a claim about the farm families. An evaluation hands the council a criterion result and an address, and the deciding is still theirs.',
      ],
      answer:
        'The verdict was half written. Southfield does meet the criterion, but "it costs nobody" was never looked up and "it costs the largest group" is group size mistaken for a bill. Before and after, group by group: the farm families go from 15 farms on 30 hectares, 2 each, to 0, which is 15 of 15, or 100 percent of the group; the 30 flood-zone households go from 30 to 30, which is 0 of 30; the rest of town goes from 570 homes to 570, which is 0 of 570. The complete verdict: Plan Southfield meets the criterion, holding the flood-zone count at 30 against Northbank\'s 180, and its cost lands on the 15 farm families, who lose every field they work.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-which-plan-meets-the-criterion',
      kind: 'try_yourself',
      problem:
        'Tarrow must add 200 homes. The town rule states that the flood zone is the land within 300 meters of Braid Creek.\n\n"Plan Bankside puts all 200 homes on a block running from the creek bank back to 600 meters, with the homes spread evenly across it. Plan Upfield puts all 200 homes on a field that begins 500 meters from the creek and runs away from it."\n\nThe council criterion: add 200 homes and put no new home inside the flood zone. Which plan meets it?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Plan Bankside, because its block runs out to 600 meters while the flood zone reaches only 300, so the block as a whole sits beyond the zone and none of its 200 homes are inside it',
        },
        {
          id: 'b',
          text: 'Plan Upfield, because its field begins 500 meters from the creek, which is 200 meters clear of the 300-meter flood zone, so it adds 0 homes inside the zone while Plan Bankside adds 100',
          correct: true,
        },
        {
          id: 'c',
          text: 'Plan Bankside, because only 100 of its 200 homes fall inside the flood zone, so half the new homes are clear of the water and a plan that keeps half of them out has met the criterion',
        },
        {
          id: 'd',
          text: 'Neither plan, because both of them build somewhere within 600 meters of Braid Creek, and a criterion of no new homes in the flood zone cannot be met on a parcel that close to the water',
        },
      ],
      expectedAnswer:
        'Plan Upfield, because its field begins 500 meters from the creek, which is 200 meters clear of the 300-meter flood zone, so it adds 0 homes inside the zone while Plan Bankside adds 100',
      hints: [
        'The flood zone reaches a stated distance from the creek. Take each parcel in turn and ask where it begins and where it ends against that distance, before counting a single home.',
        'A parcel that begins beyond the stated distance has every home outside the zone. A parcel that begins at the bank straddles the line, and because the homes are spread evenly, the share inside is the share of the parcel\'s depth that is inside: 300 of 600 meters is half, and half of 200 is 100. Reading only the far edge of a block, counting half a pass as a pass, and deciding neither parcel can be measured are three ways of never making that comparison.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-group-bears-the-cost',
      kind: 'try_yourself',
      problem:
        'A plan in Cobden takes land from two groups.\n\n"The 12 orchard families own 12 fields between them, and the plan takes 9 of the 12. The 300 north-side households own 300 garden plots between them, and the plan takes 12 of the 300."\n\nA council member says the north-side households bear more of this plan\'s cost, because 12 plots is more than 9 fields. Measured against what each group had, which group bears more of the cost?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'The 300 north-side households, because the plan takes 12 plots from them against only 9 fields from the orchard families, and the group that loses more pieces of land bears more of the cost',
        },
        {
          id: 'b',
          text: 'The 300 north-side households, because there are 300 of them against 12 orchard families, so the same plan reaches far more people on the north side of the town',
        },
        {
          id: 'c',
          text: 'The 12 orchard families, because 9 of their 12 fields is 75 percent of what they had, against 12 of 300 plots, which is 4 percent of what the north side had',
          correct: true,
        },
        {
          id: 'd',
          text: 'The two groups bear it equally, because the plan takes land from both of them and a cost that lands on two groups at once is shared evenly between them',
        },
      ],
      expectedAnswer:
        'The 12 orchard families, because 9 of their 12 fields is 75 percent of what they had, against 12 of 300 plots, which is 4 percent of what the north side had',
      hints: [
        'Twelve is more than nine, and that settles which group loses more pieces of land. It does not settle which group loses more of what it had, and that is what the question asks.',
        'Divide what each group lost by what that group owned: the fields taken by 12, and the plots taken by 300. Check each by multiplying back -- 75 percent of 12 is 9, and 4 percent of 300 is 12. Counting the pieces taken, counting the people in each group, and calling a two-group cost equal are three ways of never dividing.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-the-complete-verdict',
      kind: 'try_yourself',
      problem:
        'Pennick must add 240 homes, and 20 of its homes stand inside the flood zone today.\n\n"Plan Railyard puts all 240 homes on the old rail yard, 700 meters from the river and clear of the flood zone, and closes the 4 workshops that use the yard -- all 4 of the workshops in Pennick. Plan Watermeadow puts all 240 homes on the water meadow, where 80 of them would fall inside the flood zone, and takes nothing from any existing group."\n\nThe council criterion: add 240 homes and hold the number of homes inside the flood zone at 20. Which statement is the complete verdict?',
      responseFormat: 'mcq',
      choices: [
        {
          id: 'a',
          text: 'Plan Watermeadow meets the criterion, because 80 of its 240 homes fall inside the flood zone and the other 160 do not, so most of the new homes are clear of the water',
        },
        {
          id: 'b',
          text: 'Plan Railyard meets the criterion and costs nobody anything, because the rail yard is already built on and the plan takes no home and no field away from any resident',
        },
        {
          id: 'c',
          text: 'Plan Watermeadow is the better plan, because it takes nothing from any existing group at all, and a plan whose cost lands on nobody is the one a town should choose, whatever the flood-zone count comes to',
        },
        {
          id: 'd',
          text: 'Plan Railyard meets the criterion, holding the flood-zone count at 20 against the 100 Watermeadow would leave, and its cost lands on the workshop group, which loses 4 of its 4 workshops',
          correct: true,
        },
      ],
      expectedAnswer:
        'Plan Railyard meets the criterion, holding the flood-zone count at 20 against the 100 Watermeadow would leave, and its cost lands on the workshop group, which loses 4 of its 4 workshops',
      hints: [
        'A verdict on a plan is two halves: which plan meets the stated criterion, with the figures, and which group pays for it, with the figures. Check each statement for both halves first, and only then check whether each half is right.',
        'Add each plan\'s new flood-zone homes to the 20 already there, then ask what each plan removes and from whom. A statement that reads 160 homes out of the zone as a pass, a statement that stops at the criterion and calls the cost nothing, and a statement that stops at the cost and never tests the criterion are each missing one of the two halves.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-better-without-a-test-and-biggest-group-pays',
      kind: 'misconception_check',
      question:
        'A student finishes the Windrow comparison and writes: "Plan Southfield is the better plan." Asked who pays for it, the student writes: "The cost falls on the 570 households in the rest of town, because there are far more of them than there are farm families." What is wrong with each sentence?',
      commonErrors: [
        {
          answer: 'Plan Southfield is the better plan.',
          misconception:
            'Treating better as a property a plan carries around with it, rather than a verdict against one stated test. A sentence like that cannot be checked, cannot be argued with, and quietly hides which test was used -- which is how a person ends up choosing the plan they already liked.',
          correctsTo:
            'Better at what? Against the criterion the council actually wrote -- add 300 homes and hold the flood-zone count at 30 -- Plan Southfield is the better plan, because it holds the count at 30 while Plan Northbank takes it to 30 plus 150, which is 180, and 180 divided by 30 is six times the allowed figure. Against a criterion of every new home within 500 meters of a road, the same two plans trade places: Northbank\'s farthest home is 400 meters from North Road and passes, while Southfield\'s nearest is 800 meters and fails. WRONG: "Plan Southfield is the better plan." CORRECT: "Plan Southfield is the better plan against this criterion, holding the flood-zone count at 30 against 180, and the answer would change if the criterion did."',
        },
        {
          answer: 'The cost falls on the 570 households in the rest of town, because there are far more of them.',
          misconception:
            'Reading the size of a group as the size of its bill, so the biggest group is assumed to bear the biggest cost even when the plan takes nothing whatever from it.',
          correctsTo:
            'Ask each group what it had before and what it has after, and divide the loss by that group\'s own total. The 570 households: 570 homes before, 570 after, so 0 of 570, which is 0 percent. The 30 households already inside the flood zone: 30 before, 30 after, so 0 of 30. The 15 farm families: 30 hectares before, 2 hectares each, and 0 after, so 15 of 15 fields, which is 100 percent of the group; check, 2 times 15 is 30 hectares. WRONG: "The biggest group bears the cost." CORRECT: "The cost lands on the 15 farm families, who lose every field they work, while the 570 households lose nothing." A group\'s size says how many people are in it, never how much a plan takes from them -- and naming the group that bears a cost is a measurement of before and after, not a ruling that the plan is unfair.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Write the criterion as a test with a number in it before you open either plan. "Hold the flood-zone count at 30" can be checked; "protect the river" cannot.',
        'Run both plans through the same three checks in the same order: the overlay against the stated flood zone, the exposure count and its share of the town, and the form -- homes per hectare and meters to a road.',
        'State the verdict with the digits and both figures: 30 against 180, 20 percent of the town against 5 percent, 30 homes per hectare against 10.',
        'Meeting the criterion is half an evaluation. The other half is the address of the cost, found by asking every group what it had before the plan and what it has after.',
        'Divide each group\'s loss by that group\'s own total. Eight of 10 fields is 80 percent while 25 of 500 house lots is 5 percent, so the larger count is the far smaller bite, and the largest group can pay nothing at all.',
        'Naming the group that bears a cost is a measurement of before and after, not a ruling that a plan is unfair. An evaluation hands the council a criterion result and an address; the deciding is theirs.',
        'Change one input and run it again. Swap the criterion and two plans can trade places while every parcel, meter and home stays exactly where it was.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '10', cedTopic: '10.2', cedTitle: 'Evaluating a Land-Use Plan' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
