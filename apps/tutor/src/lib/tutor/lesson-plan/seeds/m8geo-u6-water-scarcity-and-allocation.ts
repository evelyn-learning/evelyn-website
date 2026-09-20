/**
 * Grade 8 World Geography — Resources, Energy & Sustainability: Water
 * Scarcity & Allocation.
 *
 * PROCEDURE-LED, shaped on the procedure-led exemplar
 * `m8geo-u1-counts-rates-and-fair-comparison.ts`: the concept segment is an
 * ordered routine run over a basin rather than a mental model, the first
 * worked example runs the balance and the scarcity test straight through, the
 * second runs three allocation rules over the same numbers and then re-runs
 * two of them on a dry year. Every computed figure is shown as a line of
 * arithmetic, and every allocation is inverted by adding the deliveries back
 * to the supply.
 *
 * THE PROCEDURE, in the order it is always run:
 *   1. Add every user's demand. Compare the total with the available flow.
 *   2. Subtract: shortfall = total demand - available flow. Divide the
 *      shortfall by TOTAL DEMAND to get the share of the promises that
 *      cannot be kept.
 *   3. For each user who is short, run the test: if more water arrived in
 *      the basin, would this user get some? Yes = physical. No = economic.
 *   4. Run the allocation rule exactly as written and list what each user
 *      receives.
 *   5. Invert: add the deliveries. They must come to the available flow.
 *   Then change ONE input -- the flow, or the rule -- and run it again.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause where it is used, that a
 * renewable flow can still be used up when more is taken than arrives (Grade
 * 7, `m7geo-u5-resources-and-economic-activity.ts`), that what an upstream
 * user does changes what reaches a downstream user and that aridity
 * concentrates settlement near fresh water (Grade 7,
 * `m7geo-u9-middle-east-geography-and-resources.ts`), and that a resource
 * sitting across a line is a predictable cause of dispute (Grade 7,
 * `m7geo-u6-borders-and-conflict.ts`). It re-teaches none of the three: the
 * renewal premise is a single opening clause inside keyIdea 1 and is never a
 * keyIdea of its own, no keyIdea explains upstream and downstream or why dry
 * regions settle along rivers, and the word dispute appears nowhere in the
 * authored body. It ADDS computing the basin balance with the digits shown,
 * reading the shortfall as a share of TOTAL DEMAND rather than of the supply,
 * running three named allocation rules as written and checking that the
 * deliveries add back to the available flow, telling physical from economic
 * scarcity by a counterfactual test rather than by how short a user is, and
 * evaluating a rule by who bears the shortage in a dry year.
 *
 * It STOPS SHORT of water-cycle and groundwater mechanics, which `m6sci` U7
 * (`the-water-cycle-groundwater-and-runoff`) owns: no aquifer, no recharge,
 * no water table, no infiltration, and no account of where the flow comes
 * from -- the flow is a measured figure the item hands you. It names no real
 * river, basin, reservoir, water agreement or authority anywhere outside this
 * comment, per accuracy rules 2, 3 and 6. It runs no state / nation /
 * nation-state or supranational-organization analysis
 * (`ap-human-geo-political.ts`). Sideways: no segment asks which cause a
 * disagreement rests on or which resolution mechanism fits (row 9.1
 * `analyzing-a-boundary-dispute`), no segment designs or scores a cooperation
 * arrangement or argues why acting alone fails on a shared resource (row 9.3
 * `transboundary-problems-and-cooperation`), no footprint or carrying-capacity
 * balance is computed (row 6.3), no energy source is compared (row 6.2), and
 * the availability / access / stability framework for food is never installed
 * (row 6.4).
 *
 * Three things ARE deliberately allowed, because neighbors sit close:
 * (a) the access-versus-availability idea is worked here FOR WATER, because
 * this row's own scope line defines economic scarcity as water that exists
 * but cannot be reached or paid for; it is never generalized to food and the
 * three food-security words are not used, which keeps row 6.4 intact.
 * (b) A price in dollars appears (tanker water at $8 for 1,000 liters against
 * $1 on the canal, and $6 against $1 in item 3) because "cannot be paid for"
 * is half of the scope line's own definition; it is one ratio each time and
 * no project is costed or ranked by cost, which is rows 9.4 and 10.2.
 * (c) A marsh at the river mouth is carried as a USER with a stated demand
 * and receives nothing under two of the three rules. That is an allocation
 * outcome computed from a rule, not an ecological claim: no consequence for
 * any living thing is asserted anywhere, which leaves `bio-u9-*` and row 6.3
 * untouched.
 *
 * The curriculum's scope cell for this row carries all three parts -- the
 * positive statement, the lineage clause and the withheld clause -- so
 * nothing is missing to declare.
 *
 * BURNED SPECIMENS (ruling 32/36): part (i) is copied into
 * `los[0].description`, which the student reads, and it names the three rules
 * and glosses both kinds of scarcity ("not enough water"; "water exists but
 * cannot be reached or paid for"). So no item is answerable by the gloss
 * alone. Item 3 does not ask which label fits; it asks what a proposed
 * supply increase would do for one user, which needs the unclaimed-water
 * figure printed in the stem. Do not "helpfully" rewrite any item into a
 * which-kind-of-scarcity-is-this question, and do not build an item whose key
 * is a rule's definition.
 *
 * ACCURACY NOTE: the row is structured on a Colorado-type basin, as the
 * signed curriculum instructs -- a mountain-fed river crossing dry country,
 * promises written against a flow estimate that was too high, upstream
 * diversions taken first, a downstream orchard and a river-mouth marsh
 * carrying the loss. Every river, settlement, figure and price in the file is
 * invented for the arithmetic, and the real river is named nowhere but this
 * sentence. Six basins are used -- Kestrel (both worked examples), Marrow
 * (item 1), Aldon (item 2), Ovrell (item 3), and the two unnamed basins in
 * the misconception check -- and no two share a name. Round figures such as
 * 150, 300 and 450 DO recur across them, deliberately, because the arithmetic
 * has to stay clean; what never recurs is a scenario, so no item reuses a
 * teaching segment's basin, users or question (ruling 22).
 *
 * No user is characterized: farms, towns, orchards and a marsh are described
 * only by their position, their demand and the date on which they first took
 * water, and the file says out loud that none of the three rules involves a
 * mistake. The two words it would be easiest to slide back down into Grade 7
 * teaching, upstream and downstream, appear in a worked example, a hint and
 * the objective, and in no keyIdea.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped
 * Grade 7 Geography bank the keyed answer was the strictly longest choice 67%
 * of the time, and 94% at difficulty 4; chance with four choices is 25%).
 * The PER-ITEM discipline is the point: every distractor is a nameable wrong
 * STEP carrying its own figure -- the shortfall divided by the supply, the
 * delivered share read as the shortage, the largest single demand compared
 * with the flow instead of the sum, a written share paid in full out of water
 * that is not there, a proportional cut run where the rule says fixed shares,
 * a shortfall split equally three ways, a basin total assumed to reach an
 * unconnected user, a volume compared with a population, and a refusal to
 * compare. Measured as a diagnostic and not as a score: the key is the
 * strictly longest choice in ONE of the three items -- item 1, and by two
 * characters out of 152, which is inside noise. The first draft measured 2 of
 * 3 with item 1's key also the strictly SHORTEST choice by 25%, which is the
 * same cue inverted (ruling 16); the repair was to give item 1's key the
 * reason clause its three distractors already carried, and to let item 2's
 * and item 3's distractors state their wrong step in full. No key was
 * trimmed. The three keys sit at ids a, b and c -- the set
 * `(6 + 1) mod 4 = 3` requires, omitting d. Zero is not the target; the real measurement is the
 * 120-item course rate taken at registration.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every basin is written out
 * in prose inside the segment that uses it, and every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U6_WATER_SCARCITY_AND_ALLOCATION: LessonPlan = {
  id: 'evelyn.ms.m8geo.water-scarcity-and-allocation.v1',
  title: 'Water Scarcity & Allocation',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.water-scarcity-and-allocation',
      standard: 'M8GEO-6.1',
      description:
        'Given a river basin with upstream and downstream users, annual flow, and each user\'s stated demand, compute whether demand exceeds supply, distinguish physical scarcity (not enough water) from economic scarcity (water exists but cannot be reached or paid for), and evaluate allocation rules (fixed shares, priority by first use, proportional cuts in dry years) by who bears a shortage (National Geography Standard 16: the changes that occur in the meaning, use, distribution and importance of resources).',
    },
  ],
  prerequisites: ['m8geo.refugees-and-displacement'],
  followUps: ['m8geo.comparing-energy-sources'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put a basin whose promises exceed its river in front of the student, so that the question "who goes short" arrives before any rule is named.',
      script:
        'Here is a number that should not be possible. A river carries 1,200 million cubic meters of water a year. The written promises to take water out of it add up to 1,500. Nobody stole anything and nobody made an arithmetic mistake. The promises were written one at a time, each one reasonable on its own, against an estimate of the flow that turned out to be too high -- and once they are all on paper, the basin has to answer a question the paperwork never answered. Which 300 million cubic meters do not get delivered, and to whom? Three rules answer that question, all three are defensible, and they hand the shortage to three different groups of people. Today you compute the shortfall, run each rule, and work out exactly who ends up dry under each one.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-balance-scarcity-and-rules',
      kind: 'concept',
      goal: 'Install the balance arithmetic, the test that separates the two kinds of scarcity, and the three allocation rules as operations that can be run and checked.',
      keyIdeas: [
        'START WITH THE BALANCE, AND READ THE SHORTFALL AGAINST TOTAL DEMAND. A river\'s flow arrives fresh every year and can still be promised out past what arrives, so the first move in any basin is arithmetic: add every user\'s demand, then subtract the flow available for use. If the demands come to 1,500 million cubic meters a year and the river delivers 1,200, the shortfall is 300. Now say what that 300 is a share OF, because the denominator changes the sentence. 300 divided by the total demand of 1,500 is 0.20, which is 20 percent, and it means every promise in the basin is 20 percent bigger than the water standing behind it. 300 divided by the supply of 1,200 is 25 percent, which is also true and answers a different question -- how much extra water the basin would need. When the claim is about the promises, the denominator is total demand.',
        'THE SHORTFALL IS ONE NUMBER FOR THE WHOLE BASIN, AND IT DOES NOT SAY WHO GOES SHORT. That is the allocation rule\'s job. An allocation rule is a written procedure that turns one basin-wide supply into an amount for every user, and two basins with identical flow, identical users and identical demands can produce completely different lists of who goes dry, because the rules are different. No arithmetic error is involved in either one. So evaluating a rule is never a question of whether the sums are right. It is the question of who the rule puts at the end of the line, and how much the user at the end of the line loses.',
        'RUN EACH RULE EXACTLY AS WRITTEN, THEN ADD THE DELIVERIES BACK. Three rules cover most basins, and each one is an operation you can carry out. FIXED SHARES: every user holds a written volume and takes it as the water passes, so the users the river reaches first take theirs in full and whoever is last takes what is left. PRIORITY BY FIRST USE: the oldest use is filled completely, then the next oldest, until the water runs out, so the newest uses get nothing -- and the order is by when a user first took water, never by how much a user asks for or where the user sits on the river. PROPORTIONAL CUTS: divide the available flow by the total demand to get one percentage, then give every user that percentage of what it asked for. Whichever rule you run, finish by adding the deliveries. They have to come to the available flow exactly, and if they come to more, the rule was run wrong or some water was counted twice.',
        'TELL THE TWO KINDS OF SCARCITY APART WITH A TEST, NOT WITH HOW SHORT SOMEONE IS. Ask one question about the user who is short: if more water arrived in the basin this year, would this user get some of it? If the answer is yes, the shortage is PHYSICAL -- the basin does not carry enough for the demands on it. If the answer is no, because no canal or pipeline reaches them or the delivered price is past what they can pay, the shortage is ECONOMIC, and the water is already there. The test matters because the fix follows the diagnosis. A physical shortage moves only when demand falls or supply rises. An economic shortage does not move at all when supply rises, because a bigger reservoir sends the extra water down the canals that already exist, to the users already connected to them.',
        'EVERY RULE PROTECTS SOMEONE AND EXPOSES SOMEONE, AND THE DRY YEAR IS WHERE YOU SEE IT. In an average year a rule can look tolerable to every user, because the shortfall is small and everybody still receives something. Drop the flow and the rule shows its shape. A rule made of fixed volumes hands the whole of the additional loss to whoever is last in line, so that user\'s delivery can fall to zero while the users above them do not lose a drop. A proportional rule moves every user down together. Neither is automatically the better rule, and that is exactly why you run both: an allocation rule is evaluated on the dry-year numbers, because the average year is the year it was designed to survive.',
        'A USER WITH NOTHING IN WRITING BEARS THE SHORTAGE FIRST, AND IS THE EASIEST ONE TO MISS IN THE ARITHMETIC. The river channel itself, a marsh at the mouth, a fishery below the last diversion: each of those has a need you can put a number on, and under any rule that fills written shares first it receives whatever is left over, which in a short year is nothing. The arithmetic still balances, because the deliveries still add to the supply -- so a basin can come out perfectly balanced on paper and still have a user at zero. Before calling a rule workable, list every user the basin has, not every user the rule names, and check what each one actually receives.',
      ],
      vocabulary: [
        {
          term: 'river basin',
          definition:
            'all the land whose water drains into one river system, which is why every user in it is dividing up a single annual flow.',
        },
        {
          term: 'available flow',
          definition:
            'the volume of water a river carries past a point in a year that can be taken for use, and the supply every allocation is divided out of.',
        },
        {
          term: 'shortfall',
          definition:
            'the amount by which the demands on a basin exceed its available flow, found by adding the demands and subtracting the flow.',
        },
        {
          term: 'physical scarcity',
          definition:
            'a shortage that remains once the whole flow has been divided out, because the demands add up to more water than the basin carries.',
        },
        {
          term: 'economic scarcity',
          definition:
            'a shortage that remains for a user while water is still available in the basin, because nothing delivers it to them or the delivered price is past what they can pay.',
        },
        {
          term: 'allocation rule',
          definition:
            'the written procedure that turns one basin-wide supply into an amount for each user, and so decides who bears a shortage.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-balance-and-two-scarcities',
      kind: 'worked_example',
      problem:
        'Work out whether this basin can meet its demands, and then work out what kind of shortage each user faces.\n\n"The Kestrel River rises in mountains and flows west across dry country. Measured where it leaves the mountains, the flow available for use averages 1,200 million cubic meters a year. Four users draw on it. In the order the water passes them: Adder Valley Farms, which asks for 600 million cubic meters a year; the city of Brackwell, which asks for 300; Corran Orchards, 450; and the Kestrel Marshes at the river mouth, whose stated need is 150.\n\nThe town of Dunmere, 4,000 people, sits in the same basin on a bluff 300 meters above the river and 40 kilometers from the nearest canal. No pipeline reaches it. Dunmere households buy water from tanker trucks at $8 for 1,000 liters. Households beside the canal pay $1 for the same 1,000 liters."',
      steps: [
        'Add the demands before anything else, because a basin balance is a sum and a subtraction and nothing more. 600 plus 300 is 900, plus 450 is 1,350, plus 150 is 1,500. Total demand is 1,500 million cubic meters a year against an available flow of 1,200.',
        'Subtract to get the shortfall. 1,500 minus 1,200 is 300 million cubic meters a year that the promises call for and the river does not carry.',
        'Say what the 300 is a share of, because the denominator changes the sentence. 300 divided by 1,500 is 0.20, which is 20 percent: every promise in this basin is 20 percent bigger than the water standing behind it. WRONG: "The shortfall is 300 out of the 1,200 the river carries, so the basin is 25 percent short of its promises." CORRECT: "300 divided by the total demand of 1,500 is 20 percent, which is the share of the promises that cannot be kept. 300 divided by the supply of 1,200 is 25 percent, which is a true figure answering a different question -- how much extra water the basin would need in order to keep them."',
        'Invert both figures. 1,200 plus 300 is 1,500, so the supply and the shortfall rebuild the demand. 20 percent of 1,500 is 300, so the share rebuilds the shortfall. And 25 percent of 1,200 is also 300, which is exactly why each percentage has to be labeled with what it was divided by: the same 300 sits underneath both of them.',
        'Diagnose the basin, then diagnose Dunmere, running the same test each time: if more water arrived in the basin this year, would this user get some of it? For Adder Valley, Brackwell, Corran and the marshes the answer is yes, because all four sit on the river or on its canals and a bigger flow is a bigger delivery. The basin\'s 300 million cubic meter shortfall is PHYSICAL scarcity. For Dunmere the answer is no. Dunmere stands 300 meters above the river with no pipeline, so extra water in the channel runs past below the town and nothing about the town changes.',
        'Check Dunmere with three clues of different kinds, because one clue is a hunch. First, a volume: the basin delivers 1,200 million cubic meters a year, so water is being moved in quantity nearby. Second, a piece of geometry: the nearest canal is 40 kilometers away and 300 meters below the town, and no pipeline closes that gap. Third, a price: Dunmere pays $8 for 1,000 liters against $1 on the canal, and 8 divided by 1 is 8, so the same water costs eight times as much by the time it reaches a Dunmere household. A volume, a distance and a price are three different kinds of evidence, and all three point the same way -- Dunmere faces ECONOMIC scarcity.',
        'Now change ONE input and run it again, which is also the sharpest test of both diagnoses. Suppose a wet year brings the available flow to 1,600 million cubic meters. 1,600 minus 1,500 is a surplus of 100: every written demand is met in full and the physical shortage is gone. Dunmere is still 40 kilometers from the canal, still 300 meters above the river, and still paying $8 for 1,000 liters. One kind of scarcity vanished with the extra water and the other did not move at all, which is the whole reason for keeping them apart.',
      ],
      answer:
        'Total demand is 1,500 million cubic meters a year (600 plus 300 plus 450 plus 150) against 1,200 available, so the shortfall is 300. That is 20 percent of total demand (300 divided by 1,500), not the 25 percent you get by dividing by the supply. The basin\'s shortfall is PHYSICAL scarcity, because more water in the river would reach all four users on it. Dunmere faces ECONOMIC scarcity: water is being delivered in quantity 40 kilometers away and 300 meters below the town, no pipeline reaches it, and tanker water costs $8 for 1,000 liters against $1 on the canal, which is eight times as much. In a wet year of 1,600 the physical shortfall turns into a surplus of 100 and Dunmere\'s shortage does not change.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-three-rules-and-a-dry-year',
      kind: 'worked_example',
      problem:
        'Three allocation rules, one basin, the same 300 million cubic meters of shortfall. Work out what each user receives under each rule, say who bears the shortage, and then test two of the rules on a dry year.\n\n"The Kestrel River again: 1,200 million cubic meters a year available, and demands of 600 for Adder Valley Farms, 300 for the city of Brackwell, 450 for Corran Orchards and 150 for the Kestrel Marshes, which come to 1,500. The water passes the users in that order, Adder Valley first and the marshes last.\n\nThe basin keeps a record of when each user first took water. Corran Orchards was first, then Brackwell, then Adder Valley Farms. The marshes hold no written share and have no recorded date."',
      steps: [
        'Rule one, FIXED SHARES: each user holds a written volume equal to its demand and takes it as the water passes. Adder Valley takes 600, leaving 1,200 minus 600, which is 600. Brackwell takes 300, leaving 300. Corran asks for 450 and 300 is what is there, so Corran takes 300 and is short 150. The marshes take what is left, which is nothing, and are short 150. Add the deliveries: 600 plus 300 plus 300 plus 0 is 1,200, the whole supply. Add the losses: 150 plus 150 is 300, the whole shortfall. Corran loses 150 of the 450 it asked for, which is one third of its demand, and the marshes lose all 150 of theirs.',
        'Rule two, PRIORITY BY FIRST USE: fill the oldest use completely, then the next oldest, until the water runs out. The order here is Corran, then Brackwell, then Adder Valley, and it is not the order the water flows in. Corran takes 450, leaving 750. Brackwell takes 300, leaving 450. Adder Valley asks for 600 and receives 450, so it is short 150. The marshes have no recorded use and receive nothing, short 150. Add the deliveries: 450 plus 300 plus 450 plus 0 is 1,200. WRONG: "Adder Valley is the farthest upstream, so Adder Valley is served first." CORRECT: "This rule orders users by when each first took water, not by where each sits, and Adder Valley is the newest use of the three, so Adder Valley is the one that goes short."',
        'Rule three, PROPORTIONAL CUTS: one percentage for everybody. Divide the available flow by the total demand: 1,200 divided by 1,500 is 0.8, so every user receives 80 percent of what it asked for and takes a 20 percent cut. Adder Valley: 80 percent of 600 is 480. Brackwell: 80 percent of 300 is 240. Corran: 80 percent of 450 is 360. The marshes: 80 percent of 150 is 120. Add the deliveries: 480 plus 240 plus 360 plus 120 is 1,200. Add the cuts: 120 plus 60 plus 90 plus 30 is 300.',
        'Now put the three lists beside one another and answer the real question, which is not what the arithmetic is but who bears the shortage. Under fixed shares the whole 300 falls on Corran and the marshes, the last two users the water reaches. Under priority by first use the whole 300 falls on Adder Valley and the marshes, the two newest uses, and the orchard that went short under the first rule is now filled completely. Under proportional cuts nobody escapes and nobody is wiped out: the 300 is split 120, 60, 90 and 30. One basin, one shortfall, three different answers, and not one of the three involves a mistake.',
        'Rewind the input and read it backwards to be sure nothing was misread: 150 for the marshes, 450 for Corran, 300 for Brackwell, 600 for Adder Valley. 150 plus 450 is 600, plus 300 is 900, plus 600 is 1,500. The available flow is 1,200. Those are the two figures all three rules were run on.',
        'Change ONE input -- the flow -- and run two of the rules again. A dry year brings the available flow to 900 million cubic meters. FIXED SHARES: Adder Valley takes its written 600, leaving 300; Brackwell takes its written 300, leaving nothing; Corran receives 0 and the marshes receive 0. Adder Valley and Brackwell lose nothing at all, and Corran falls from 300 in the average year to 0. PROPORTIONAL CUTS: 900 divided by 1,500 is 0.6, so every user receives 60 percent -- Adder Valley 360, Brackwell 180, Corran 270, the marshes 90 -- and 360 plus 180 plus 270 plus 90 is 900. Every user\'s delivery falls by exactly a quarter from the average year: 480 to 360, 240 to 180, 360 to 270, 120 to 90.',
        'That is the evaluation, and it could not have been made on the average-year numbers, where both rules still delivered something to almost everybody. Losing an extra 300 between two users and losing it across four users are not the same event, and the rule decided which one happened. A fixed-volume rule concentrates a dry year on whoever is last in line; a proportional rule spreads it. Which one a basin should choose is an argument about who can absorb a loss, but the arithmetic settles what each rule actually does, and that is the part you can check.',
      ],
      answer:
        'Fixed shares: Adder Valley 600, Brackwell 300, Corran 300, the marshes 0, so the whole 300 shortfall falls on the last two users the water reaches. Priority by first use: Corran 450, Brackwell 300, Adder Valley 450, the marshes 0, so the whole 300 falls on the newest uses, which moves it from Corran onto Adder Valley. Proportional cuts: 1,200 divided by 1,500 is 80 percent for everybody, giving 480, 240, 360 and 120, and splitting the 300 as 120, 60, 90 and 30. Every list adds back to 1,200. In a dry year of 900 the fixed-share rule takes Corran from 300 to 0 while Adder Valley and Brackwell lose nothing, and the proportional rule drops every user to 60 percent of demand.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-compute-the-shortfall',
      kind: 'try_yourself',
      problem:
        '"The Marrow River basin has an available flow of 750 million cubic meters a year. Three users draw on it: Velden Farms asks for 600 million cubic meters a year, the town of Tolvey asks for 250, and Nessing Marsh has a stated need of 150." A basin report says the demands cannot all be met. By how much, and what share of the promises does that shortfall represent?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Demand comes to 1,000 and the flow is 750, so the shortfall is 250, which is 25 percent, because 250 divided by the total demand of 1,000 is one quarter', correct: true },
        { id: 'b', text: 'Demand comes to 1,000 and the flow is 750, so the shortfall is 250, which is 33 percent, because 250 divided by the 750 the river carries is one third' },
        { id: 'c', text: 'Demand comes to 1,000 and the flow is 750, so the basin is 75 percent short of its promises, because 750 divided by 1,000 is 75 percent' },
        { id: 'd', text: 'There is no shortfall at all, because the largest user asks for 600 and the river carries 750, which covers that demand with room to spare' },
      ],
      expectedAnswer: 'Demand comes to 1,000 and the flow is 750, so the shortfall is 250, which is 25 percent, because 250 divided by the total demand of 1,000 is one quarter',
      hints: [
        'Add all three demands first, then subtract the available flow. The difference is the shortfall.',
        'Once you have the shortfall, decide what to divide it by: the promises add up to one number and the river carries another, and only one of those is what the promises add up to. Dividing by the flow, dividing the flow by the demand, and checking the flow against a single user instead of the sum are three different ways to miss it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-run-the-fixed-share-rule',
      kind: 'try_yourself',
      problem:
        '"The Aldon River passes three users in this order: Werrin Farms, then the town of Marbeck, then Draymoor Orchards. Each holds a written share -- Werrin 450 million cubic meters a year, Marbeck 150, Draymoor 150 -- and the rule says every user takes its written share in full as the water passes it. This year the available flow is 600 million cubic meters." How much does Draymoor Orchards receive?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '150 million cubic meters, the full written share, because a written share is the promise the rule exists to keep whatever the flow turns out to be' },
        { id: 'b', text: '0 million cubic meters: Werrin takes 450 and Marbeck takes 150, which uses up the whole 600 before the water reaches Draymoor', correct: true },
        { id: 'c', text: '120 million cubic meters, which is 80 percent of 150, the same percentage cut applied to every user in the basin' },
        { id: 'd', text: '100 million cubic meters, because the shortfall of 150 is split equally and each of the three users gives up 50' },
      ],
      expectedAnswer: '0 million cubic meters: Werrin takes 450 and Marbeck takes 150, which uses up the whole 600 before the water reaches Draymoor',
      hints: [
        'Run the rule exactly as it is written: follow the water downstream and hand each user its written share in full until the flow is used up.',
        'Add the two upstream shares and subtract them from the flow before you look at Draymoor at all. Paying the full written share regardless, cutting every user by the same percentage, and splitting the shortfall equally are three other rules, and this basin is not running any of them.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-diagnose-and-test-a-fix',
      kind: 'try_yourself',
      problem:
        '"The Ovrell River has 900 million cubic meters a year available for use, and the written demands on it add up to 700, so 200 flows past the last diversion every year with no user for it. The village of Torrow, 3,000 people, sits 25 kilometers from the river behind a ridge. No canal or pipeline reaches Torrow, and its households buy water from tanker trucks at $6 for 1,000 liters while households beside the canal pay $1 for the same amount. The basin authority proposes to enlarge its reservoir so that 150 million cubic meters more can be delivered each year." What does the data support about what that would do for Torrow?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Torrow would receive a share of the extra 150, because water added to a basin is shared out among all of the basin\'s users, and Torrow sits inside the Ovrell basin exactly like the users already taking water' },
        { id: 'b', text: 'Torrow\'s shortage would end, because 150 million cubic meters is far more water than 3,000 people could use in a year, so there would be plenty left over for the village once the existing users had taken their share' },
        { id: 'c', text: 'Torrow would receive none of it: 200 million cubic meters already flows past unclaimed while Torrow goes short, so what keeps water from Torrow is the missing pipeline and the $6 price, not the amount in the river', correct: true },
        { id: 'd', text: 'Nothing can be said from this data, because a flow measured in million cubic meters and a price measured in dollars for 1,000 liters are different kinds of figure and cannot be set against each other' },
      ],
      expectedAnswer: 'Torrow would receive none of it: 200 million cubic meters already flows past unclaimed while Torrow goes short, so what keeps water from Torrow is the missing pipeline and the $6 price, not the amount in the river',
      hints: [
        'Run the test on Torrow: if more water arrived in the basin, would Torrow get some of it? Look for the sentence in the data that says what already happens to water nobody has claimed.',
        'The basin is already leaving water unclaimed while Torrow goes short, so the amount in the river is not what is stopping it. Assuming a basin total reaches every user, comparing a volume with a population, and refusing to compare the figures at all are three ways of skipping the test.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-equal-percent-and-priority-order',
      kind: 'misconception_check',
      question:
        'A student is given two basins to work. In the first, the available flow is 400 million cubic meters a year, three users ask for 300, 150 and 50, and the rule is a proportional cut; the student writes: "A proportional cut is the equal rule, so all three users end up with the same amount of water." In the second, the flow is 500, Larrow Farms asks for 350, the town of Quennet asks for 100 and Rilby Mill asks for 150, and the rule is priority by first use, with Quennet the oldest use, Rilby next and Larrow the newest; the student writes: "Larrow Farms asks for the most, so priority puts Larrow first." What is wrong with each?',
      commonErrors: [
        {
          answer: 'A proportional cut is the equal rule, so all three users end up with the same amount of water.',
          misconception:
            'Reading an equal percentage as an equal volume. The cut is the same size for everyone only while it is measured as a share; measured in water it is largest for the user that asked for the most, and the deliveries stay as unequal as the demands were.',
          correctsTo:
            'Run it with the digits. The demands add to 300 plus 150 plus 50, which is 500, against an available flow of 400, so the shortfall is 100 and the cut is 100 divided by 500, which is 20 percent. Every user receives 80 percent of what it asked for: 80 percent of 300 is 240, 80 percent of 150 is 120, and 80 percent of 50 is 40. Check it both ways: 240 plus 120 plus 40 is 400, the whole supply, and the cuts of 60, 30 and 10 add to 100, the whole shortfall. WRONG: "Everyone is cut the same, so everyone ends up with the same." CORRECT: "Everyone is cut by the same 20 percent, which is 60 million cubic meters for the largest user and 10 for the smallest, so what a proportional rule equalizes is the percentage, never the water."',
        },
        {
          answer: 'Larrow Farms asks for the most, so priority puts Larrow first.',
          misconception:
            'Ordering the users by the size of their demand instead of by when each first took water. Priority by first use is an order in time, and nothing in it looks at how much a user asks for or where on the river the user sits.',
          correctsTo:
            'The order is Quennet, then Rilby, then Larrow, because that is the order in which they first took water. Fill the oldest completely: Quennet receives its 100, leaving 500 minus 100, which is 400. Rilby receives its 150, leaving 250. Larrow asks for 350 and 250 is what is there, so Larrow receives 250 and bears the whole shortage, which is 350 minus 250, or 100. Check: 100 plus 150 plus 250 is 500, the whole supply, and the demands of 100 plus 150 plus 350 come to 600, so the shortfall is 600 minus 500, which is 100 -- the same 100 that Larrow lost. WRONG: "The biggest user is served first." CORRECT: "The oldest use is served first, and under this rule the largest user can be the one that goes short, because it happens to be the newest."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Start with the balance: add every user\'s demand, subtract the available flow, and the difference is the shortfall.',
        'Divide the shortfall by TOTAL DEMAND to say what share of the promises cannot be kept. Dividing it by the supply is a true figure that answers a different question.',
        'The shortfall is one number for the whole basin and says nothing about who goes short. The allocation rule decides that.',
        'Fixed shares: each user takes its written volume as the water passes, and whoever is last takes what is left. Priority by first use: the oldest use is filled first and the newest gets nothing, ordered by date and never by size or position. Proportional cuts: available flow divided by total demand gives one percentage for everybody.',
        'Whichever rule you run, add the deliveries back. They have to come to the available flow exactly.',
        'Physical or economic: if more water arrived in the basin, would this user get some? Yes means physical, and only demand or supply can move it. No means economic, and the fix is a pipeline or a price, because a bigger reservoir sends its water to the users who are already connected.',
        'Evaluate a rule on the dry-year numbers. A fixed-volume rule can take the last user to zero while the users above lose nothing; a proportional rule moves everyone down together.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'Water Scarcity & Allocation' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
