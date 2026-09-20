/**
 * Grade 8 World Geography — Population & Migration at Scale: Evaluating
 * Population Projections.
 *
 * PROCEDURE-LED row 5.2 (National Geography Standard 9), shaped on the
 * procedure-led exemplar `m8geo-u1-counts-rates-and-fair-comparison.ts`: the
 * concept segment is a short ordered routine run over a described rate rather
 * than a mental model, the first worked example runs the routine straight
 * through on a headline, the second runs it twice on one town under two
 * assumption sets and finds which assumption the headline is resting on, and
 * each worked example ends with an arithmetic inversion AND a one-input
 * contrasting case. Three traps this plan is built to kill: reading a doubling
 * time as a date, looking for the arithmetic error when two projections of the
 * same place disagree, and running the rule of 70 once on a rate that is
 * expected to slide.
 *
 * THE ROUTINE, in the order it is always run:
 *   1. Read the growth rate as a number of percent per year.
 *   2. Divide 70 by that number. The answer is the doubling time in years,
 *      and it is an estimate.
 *   3. Invert: multiply the doubling time by the rate and 70 has to come back.
 *   4. Restore the condition -- "IF the rate holds at R percent a year, the
 *      place doubles in about T years" -- because that is the step a headline
 *      drops.
 *   Then compare a second projection by its ASSUMPTIONS rather than by its
 *   answer, switch the assumptions off one at a time to see which one is
 *   carrying the claim, and where the rate is expected to slide, run the
 *   division at each end and report the bracket.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause where it is used, that a growth
 * rate is a speed rather than a size, and that a population changes by births
 * and deaths plus migration (Grade 7, `m7geo-u3-population-growth-and-
 * structure.ts`), and it re-teaches neither. The speed-not-size premise opens
 * keyIdea 1's body and exists there only to explain why a division is needed
 * at all; no keyIdea in the authored body defines a birth rate, a death rate
 * or net migration, the phrase "natural increase" appears nowhere in the body,
 * and the only thing said anywhere about a growth rate itself is that single
 * premise clause. "Birth rate" and "deaths" occur only where a projection's
 * assumption is being named, switched off, or supplied as the premise for what
 * a growth rate is made of.
 * It ADDS the rule-of-70 division and its inversion, the proportional (never
 * step-for-step) relation between a rate and a doubling time, restoring the
 * conditional to a stated headline, comparing two projections of one place by
 * the single assumption they do not share, testing which assumption a headline
 * is resting on by removing them one at a time, and reporting a bracket when
 * the rate is not one rate. It names NO stage of the demographic transition
 * model -- the words "stage" and "transition" appear nowhere in the authored
 * body, only in this guard (`ap-human-geo-population.ts`). It uses NO
 * exponential-function notation and no symbolic formula of any kind
 * (`alg1-u6-exponential-functions.ts`, `alg1-u6-exponential-growth-decay.ts`),
 * and NO cohort-component method: no survival rate, no fertility rate and no
 * age band is applied to anything anywhere in this file. Every absence claim
 * here is scoped to the AUTHORED BODY, since this guard and the chain loIds
 * necessarily name the neighboring rows.
 *
 * It does NOT compute a dependency ratio, split a ratio into a youth and an
 * old-age part, or name a structure wide-based, column-shaped or top-heavy
 * (row 5.1, `m8geo.population-pyramids-and-dependency`); it does NOT read a
 * flow table, sort reasons into push and pull, name an intervening obstacle or
 * a chain, or evaluate an effect on an origin or a destination (row 5.3,
 * `m8geo.migration-flows-and-their-effects`); it does NOT classify a refugee,
 * an asylum seeker or an internally displaced person (row 5.4); and it does
 * NOT evaluate a plan by how it performs when its assumption turns out wrong,
 * which is the capstone row 10.4 (`scenario-analysis-for-a-changing-place`) --
 * this row names the assumption, prices it in years, and stops there.
 *
 * Three things ARE deliberately allowed, because neighbors sit close and the
 * line has to be drawn rather than avoided:
 * (a) NET MIGRATION appears as one component of a growth rate and as an
 *     assumption to switch on and off, because this row's scope cell names
 *     "with versus without net migration" as one of the two assumption pairs
 *     it must compare. It enters as a single percent-per-year figure and
 *     nothing more: no flow between places is read, no reason for moving is
 *     sorted, and no effect of migration on a sending or a receiving place is
 *     evaluated, all of which are row 5.3's. The school buildings that appear
 *     in three of the headlines here are what a PROJECTION gets used for, and
 *     they are never worked as an effect attributed to the arrivals.
 * (b) THE BRACKET -- running the division at each end of a sliding rate and
 *     reporting a range -- is this row's, not row 10.4's, because it is forced
 *     by the rule of 70 itself: the division takes one steady rate, so a rate
 *     that slides has no single answer. The bracket is reported and left
 *     there; no plan is scored against it.
 * (c) ONE first-year head-count contrast in worked example 1 (adding the same
 *     480 people every year would take 50 years; the rule of 70 says about
 *     35), because that single comparison is what makes the wrong step
 *     visible. No compounded series, no year-by-year table and no repeated
 *     multiplication appears anywhere in this file.
 *
 * The curriculum cell for this row carries all three parts -- positive
 * statement, lineage clause, withheld clause -- so nothing is missing from it.
 * Per rulings 32 and 36, the concrete things part (i) names, and which are
 * therefore burned for items, are the rule of 70 itself, the phrase "constant
 * versus falling birth rate" and the phrase "with versus without net
 * migration". Those are the row's subject matter rather than specimens with
 * answers, and no item here is answerable from the objective: every item turns
 * on a rate or a pair of projections the objective does not contain.
 *
 * DEPTH FLOOR NOTE FOR THE FAN-OUT: the Grade 7 file on this subject already
 * teaches that a growth rate is a speed and not a size, complete with a
 * WRONG/CORRECT pair about a falling rate. That makes keyIdea 1 the sentence
 * in this file most likely to sink below the floor. The test used here: every
 * keyIdea was read next to the Grade 7 keyIdeas, and the closest pair was
 * keyIdea 1 here against Grade 7's "A GROWTH RATE IS A SPEED, NOT A SIZE".
 * KeyIdea 1 survived only because the speed clause is a subordinate premise
 * and the keyIdea's job is the division and its inversion; an early draft of
 * the worked example also carried the Grade 7 sentence "it is still growing,
 * only more slowly" almost verbatim and it was cut for that reason. Nothing in
 * this file asks what a growth rate is, what migration is, or why a population
 * changes.
 *
 * ACCURACY NOTE: every town in this file is invented and every figure was
 * written for the arithmetic. No real country, town, growth rate, birth rate
 * or migration figure appears anywhere. The only claims about the real world
 * are the rule of 70 itself and the fact that 70 is a rounded number giving an
 * estimate; both are in the claim ledger with their grounds. A growth rate and
 * a doubling time are measurements of a speed, never a score for a place or
 * for the people living in it, and the file says so in keyIdea 2 and in the
 * recap.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped Grade
 * 7 Geography bank the keyed answer was the strictly longest choice 67 percent
 * of the time, and 94 percent at difficulty 4; chance with four choices is 25
 * percent). Every distractor here is a nameable wrong STEP carrying its own
 * figure or reason -- 70 multiplied by the rate instead of divided by it, 100
 * divided by the rate because a percent a year sounds like 100 percent
 * eventually, the rate doubled first because the question says double, an
 * assumption gap read as an arithmetic mistake, the assumption the two teams
 * AGREE on named as the disputed one, a conditional figure dismissed as worth
 * nothing, the two doubling times averaged into one printable number, the
 * faster end printed alone -- and no key was built to be the longest choice
 * BECAUSE it is the key. Item 2 carries a deliberate mirror distractor, which
 * states the key's own shape with the other assumption in it, so that the item
 * cannot be answered by picking the most reasonable-sounding stance without
 * reading whose assumption list says what. Measured as a diagnostic and not as
 * a score: the key is the strictly longest choice in ONE of the three items
 * (item 3, by 4 characters over the next longest, a margin of 2.6 percent and
 * well inside the noise ruling 16 describes; it was left alone deliberately).
 * Zero is NOT the target. The three keys sit at ids b, c and a, which is the
 * id set `(5 + 2) mod 4 = 3` requires, omitting d. The four numeric choices in
 * item 1 share one unit clause and are ordered by the id rule, never by
 * magnitude.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every rate, every projection
 * and every headline is written out in words inside the segment that needs it,
 * and every item is solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U5_EVALUATING_POPULATION_PROJECTIONS: LessonPlan = {
  id: 'evelyn.ms.m8geo.evaluating-population-projections.v1',
  title: 'Evaluating Population Projections',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.evaluating-population-projections',
      standard: 'M8GEO-5.2',
      description:
        'Given a growth rate, estimate doubling time with the rule of 70, compare two projections built on different assumptions (constant versus falling birth rate; with versus without net migration), and explain why a projection is a conditional statement rather than a prediction and which assumption a stated headline depends on (National Geography Standard 9: the characteristics, distribution and migration of human populations on Earth surface).',
    },
  ],
  prerequisites: ['m8geo.population-pyramids-and-dependency'],
  followUps: ['m8geo.migration-flows-and-their-effects'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put a decision that has already been made in front of the student and show that it rests on a dropped condition, before any arithmetic arrives.',
      script:
        'A headline in a town paper: Kestrel is set to double in size. Underneath it, a photograph of the field behind the middle school, because the county wants to put a second school building on it. Nobody in Kestrel voted on that field. A number decided it, and the number came out of one division that anybody in this room can do in about four seconds. Here is the part the headline left off. That division holds the town\'s growth rate perfectly still for the whole stretch, and a growth rate is the one thing that does not hold still: the arrivals who make up half of it can stop coming when the work that brought them finishes, and the birth rate can drift down. Change either one and the same division gives a completely different answer, and the field stays a field. So today you do two things. First the division, which turns a speed into a number of years. Then the harder half: put the dropped condition back, and work out which condition the whole story is resting on.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-rate-to-time-and-the-condition',
      kind: 'concept',
      goal: 'Install the rule-of-70 routine with its inversion, the proportional relation between rate and time, the conditional form of a projection, and the two moves that evaluate one: compare the assumptions, and take them away one at a time.',
      keyIdeas: [
        'TURN THE RATE INTO A TIME WITH ONE DIVISION, THEN CHECK IT BY MULTIPLYING BACK. A growth rate is a speed rather than a size, so on its own it never says WHEN a place reaches a particular number. The rule of 70 turns the speed into a time in one step: divide 70 by the growth rate written as a number of percent per year, and the answer is roughly the number of years the population takes to double. A place growing at 2 percent a year doubles in 70 divided by 2, which is about 35 years. Check every one of these by multiplying back, because a slipped decimal point is invisible inside a division and obvious in the check: 35 times 2 is 70. And the 70 is a rounded number, so the answer is an estimate. It belongs in a sentence as "about 35 years" and never as "exactly 35 years".',
        'THE TIME AND THE RATE MOVE IN PROPORTION, NOT IN STEP. Doubling the rate always halves the doubling time, and that is the whole behavior of the division. Run it three times: 1 percent gives 70 years, 2 percent gives 35 years, 4 percent gives 17.5 years. Each check closes, since 70 times 1, 35 times 2 and 17.5 times 4 all come back to 70. Now look at what each percentage point bought. Going from 1 percent to 2 added one point and took 35 years off the answer; going from 2 percent to 4 added two points and took only 17.5 years off. One percentage point is worth an enormous number of years at the slow end and very few at the fast end, which is why the same small change in the rate matters far more to a slow-growing place than to one already growing fast. Neither end is better than the other: the rate is a measurement and the doubling time is a planning figure, never a score for a town or for the people in it.',
        'A PROJECTION SAYS IF, AND A PREDICTION SAYS WILL. A doubling time is not a date. The division holds the rate still for the entire stretch, and nothing about a growth rate promises to do that, so the answer only means anything with its condition attached. "IF this place keeps growing at 2 percent a year, it doubles in about 35 years" is a projection, and it can be tested, because it names the thing that has to stay true. "This place will double in 35 years" is a prediction, and the arithmetic does not support it. Restoring that condition is a step of the routine rather than a caution added at the end, because the condition is exactly the part a headline drops.',
        'WHEN TWO PROJECTIONS OF ONE PLACE DISAGREE, COMPARE THE ASSUMPTIONS AND NOT THE ANSWERS. Two teams working on the same town will publish two different doubling times, and the division is almost never where they part company -- both teams do the same division, and both checks close. They part company on what they held fixed. One holds the birth rate where it is and the other has it falling. One counts net migration, the people moving in minus the people moving out, and the other leaves it out because the work that brought the arrivals is ending. Set the assumption lists side by side and find the line the two teams do not share; that line, not the arithmetic, is worth the entire gap between the answers.',
        'TO FIND THE ASSUMPTION A HEADLINE IS RESTING ON, TAKE THE ASSUMPTIONS AWAY ONE AT A TIME. A projection usually rests on more than one condition, and the conditions almost never carry equal weight. So switch one off, run the division again, and watch the answer: the assumption whose removal moves the number furthest is the one the headline is resting on, and it is the one to ask hard questions about. This is worth doing even when the reflex answer feels obvious, because the reflex is often wrong -- the assumption everybody argues over can turn out to be worth eight years while the quiet one nobody mentions is worth fifty.',
        'A RATE THAT DOES NOT HOLD STILL IS NOT ONE RATE, SO REPORT A RANGE. The division takes a single steady rate, so when a place is growing at one rate now and is expected to be growing at a slower one later, you cannot run the rule of 70 once and print the answer. Run it at each end instead and report the bracket: at 4 percent about 17.5 years, at 1 percent about 70 years, so somewhere between those two. That bracket is not the method failing. It is the assumption made visible, and it is the honest output, because a planner who builds for the fast end and gets the slow one has paid for buildings that stand empty, while one who builds for the slow end and gets the fast one has children with nowhere to sit.',
      ],
      vocabulary: [
        {
          term: 'doubling time',
          definition:
            'the number of years a population takes to reach twice its present size while it keeps growing at one stated rate, estimated by dividing 70 by that rate.',
        },
        {
          term: 'rule of 70',
          definition:
            'the division that turns a growth rate in percent per year into a doubling time in years, 70 divided by the rate, which gives an estimate and never an exact figure.',
        },
        {
          term: 'projection',
          definition:
            'a figure worked out from stated assumptions, which says what follows if those assumptions hold rather than what will happen.',
        },
        {
          term: 'assumption',
          definition:
            'a condition a projection holds fixed while it runs, such as a rate that stays where it is or migration counted at its present level, and the thing to name before the answer is read.',
        },
        {
          term: 'net migration',
          definition:
            'the number of people moving into a place minus the number moving out over the same period, added to the change from births and deaths to give the growth rate.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-routine',
      kind: 'worked_example',
      problem:
        'Run the routine straight through on a newspaper claim, and name what the claim left out.\n\n"Marran has 24,000 people, and its population grew by 2 percent over the past year. The town paper prints a headline: Marran will have 48,000 people in 35 years, and the town is on course to double."',
      steps: [
        'Step one: read the rate and be clear about what it is a rate of. Two percent a year means two more people each year for every 100 already living there, which on 24,000 people is 480 people in the first year -- 2 percent of 24,000 is 480, and the check is 480 divided by 24,000, which is 0.02, or 2 percent. That is a speed, and the headline is asking for a time. The size it is heading for is twice 24,000, which is 48,000, and the paper has that part right.',
        'Step two: divide 70 by the rate. 70 divided by 2 is 35. At 2 percent a year Marran takes about 35 years to go from 24,000 people to 48,000.',
        'Step three: invert. 35 times 2 is 70, so the division closes and no decimal point slipped on the way through.',
        'Step four: restore the condition, which is the step the headline skipped. WRONG: "Marran will have 48,000 people in 35 years." CORRECT: "If Marran keeps growing at 2 percent a year for the whole stretch, it reaches about 48,000 people in about 35 years." The arithmetic is identical in both sentences. The difference is that the second one can be checked, because it names the thing that has to stay true for the number to arrive.',
        'Rewind the input and read it backwards, to be sure the answer follows from the data rather than from a habit. A town adding 480 people to a base of 24,000 is adding one fiftieth of itself in the first year, and one fiftieth is 2 percent, which is where the rate came from. Something adding a fiftieth of itself every year plainly does not need a century to double, so an answer of about 35 years is the right order of size. Now notice the trap sitting right next to it. Adding 480 people every single year would take 24,000 divided by 480, which is 50 years, not 35. WRONG: "2 percent a year means 100 percent in 50 years." CORRECT: "2 percent a year doubles the town in about 35 years, because each year the 2 percent is charged on the new total rather than on the old one, so the 480 does not stay 480." The rule of 70 gives the shorter answer for exactly that reason.',
        'Now change ONE input and run it again, so that 35 years is not memorized as a fact about Marran. Suppose the next count comes in and the growth rate is 1 percent rather than 2. 70 divided by 1 is 70 years, and the check is 70 times 1, which is 70. Halving the rate doubled the time, from about 35 years to about 70. Nobody left Marran and the town did not shrink; one input moved, and the second school the headline was arguing for now has a whole lifetime to arrive in instead of half of one. The date was never a fact about the town. It was a fact about the rate somebody assumed.',
      ],
      answer:
        'The paper has the size right and the time unsupported, because it dropped the condition. The rule of 70 gives 70 divided by 2, which is about 35 years to go from 24,000 people to 48,000, and the check closes because 35 times 2 is 70. Written honestly it reads: if Marran keeps growing at 2 percent a year, it reaches about 48,000 people in about 35 years. Adding the first year\'s 480 people every year instead would take 50 years, since 24,000 divided by 480 is 50, which is why the percent has to be charged on the new total. And if the rate turns out to be 1 percent, the same division gives 70 divided by 1, which is about 70 years, so one percentage point is worth about 35 years here.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-two-projections-one-town',
      kind: 'worked_example',
      problem:
        'Two teams project the same town and publish different answers. Find where they part company, work out which assumption the headline is resting on, and then say what happens if the birth rate does not hold either.\n\n"Oskett has 60,000 people. Both teams agree on the recent figures: births and deaths on their own are adding 2.5 percent a year, and net migration has been adding 600 more people a year on top of that. The county team assumes both of those carry on. The regional team assumes the arrivals stop, because the construction work that brought them is finishing, while births and deaths carry on as they are. The county newspaper prints: Oskett will pass 120,000 people within 20 years, so the county should buy the land for a second high school now."',
      steps: [
        'Put the two teams on the same footing first, by turning the migration figure into a rate. The division takes one number and that number is a percent per year, so a head count of arrivals has to be converted: 600 people a year on a town of 60,000 is 600 divided by 60,000, which is 0.01, or 1 percent a year. Check by going the other way: 1 percent of 60,000 is 600. Migration is worth 1 percent a year here and births and deaths are worth 2.5 percent.',
        'Run the county team\'s projection. Their assumptions give 2.5 percent plus 1 percent, which is a growth rate of 3.5 percent a year. 70 divided by 3.5 is 20, and the check is 20 times 3.5, which is 70. Twice 60,000 is 120,000, so the county team\'s 20 years and the newspaper\'s 120,000 people are the same claim stated twice.',
        'Run the regional team\'s projection. Their assumptions take the migration away and leave 2.5 percent a year. 70 divided by 2.5 is 28, and the check is 28 times 2.5, which is 70. Same town, same division, same day, and an answer 8 years further out.',
        'Say where they part company, and be exact about it. Neither team made an arithmetic mistake: both divisions close under their own check. The two teams differ on ONE line of their assumption lists, whether the arrivals keep coming, and that one line is worth the whole gap of 8 years. WRONG: "They cannot both be right, so one of those teams divided wrong." CORRECT: "Both divisions are right, and the answers differ because the assumption lists differ -- so the thing to argue about is whether the arrivals keep coming, not the arithmetic."',
        'Now answer the question the headline forces, by taking the assumptions away one at a time. Take migration away and leave births and deaths at 2.5 percent: the answer goes from 20 years to 28 years, so that assumption is worth 8 years. Now take the other one away instead. Suppose births fall until they only balance deaths, so births and deaths add nothing, while migration holds at 1 percent: 70 divided by 1 is 70 years, and the check is 70 times 1, which is 70. That assumption is worth 50 years. The headline is resting far more heavily on births and deaths than on the arrivals everybody in town is arguing about, and a reader who only interrogates the migration line has checked the smaller of the two conditions.',
        'Rewind the inputs and read them backwards to confirm nothing was misread: 60,000 people, 2.5 percent from births and deaths, 600 arrivals a year which is 1 percent, giving 3.5 percent together. Three pieces of evidence agree that the county figure is the fastest of the three answers on the table -- it uses the largest rate of the three, 3.5 against 2.5 and 1; it gives the shortest time, 20 years against 28 and 70; and it is the only one of the three that needs BOTH assumptions to hold at once. A headline quotes the fastest projection, and the fastest projection is the one with the most conditions attached.',
        'Now change ONE input and run it again, and this time change the one the two teams both held fixed. Suppose the births-and-deaths part neither stays at 2.5 percent nor goes to nothing, but slides down across the decades while migration holds at 1 percent. Then there is no single rate to divide by, and the rule of 70 cannot be run once. Run it at each end instead: at the top the rate is 3.5 percent, giving 70 divided by 3.5, which is 20 years, and at the bottom it is 1 percent, giving 70 divided by 1, which is 70 years. The honest output is a bracket -- somewhere between about 20 and about 70 years -- and the width of that bracket is not vagueness. It is the assumption, finally written down where a planner can see it.',
      ],
      answer:
        'The 600 arrivals are 1 percent a year, since 600 divided by 60,000 is 0.01 and 1 percent of 60,000 is 600. The county team assumes 2.5 percent plus 1 percent, so 70 divided by 3.5 is about 20 years, checked by 20 times 3.5 being 70. The regional team assumes 2.5 percent alone, so 70 divided by 2.5 is about 28 years, checked by 28 times 2.5 being 70. Both divisions are right and the teams differ on one assumption, worth 8 years. Removing the other assumption instead -- births falling until they only balance deaths, leaving migration at 1 percent -- gives 70 divided by 1, which is about 70 years, worth 50. So the 20-year headline rests far more on births and deaths than on the arrivals. If the births-and-deaths part slides rather than holding or stopping, there is no single rate and the honest answer is the bracket from about 20 to about 70 years.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-doubling-time',
      kind: 'try_yourself',
      problem:
        'Brannoch has 8,000 people, and its population grew by 5 percent over the past year. If Brannoch keeps growing at 5 percent a year, about how long does it take to reach 16,000 people?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'about 350 years' },
        { id: 'b', text: 'about 14 years', correct: true },
        { id: 'c', text: 'about 7 years' },
        { id: 'd', text: 'about 20 years' },
      ],
      expectedAnswer: 'about 14 years',
      hints: [
        'The rule of 70 is a single division, and the growth rate goes underneath the 70 rather than on top of it. Write that division down before you look at the choices again.',
        'Check whatever you get by multiplying it by 5: the 70 has to come back. Multiplying 70 by the rate instead, dividing 100 by the rate because 5 percent a year sounds like 100 percent after twenty of them, and doubling the rate first because the question asks about doubling each produce one of the other figures, and each one fails that check.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-assumption',
      kind: 'try_yourself',
      problem:
        'Dunmere has 12,000 people and is growing fast. Two teams publish projections of it. The county team assumes the growth rate of the past three years, 7 percent a year, keeps running, and reports that Dunmere doubles to 24,000 in about 10 years. The regional team assumes that the arrivals who make up half of that growth stop coming, leaving 3.5 percent a year, and reports about 20 years. The town paper prints: Dunmere will have 24,000 people within 10 years, so the middle school needs a second building now. Which statement does the data support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'One of the two teams has divided wrong, because 70 divided by 7 and 70 divided by 3.5 cannot both be correct figures for one town in one year' },
        { id: 'b', text: 'The 10-year date is resting on births and deaths keeping up, because that is the line the two teams do not share and the arrivals are counted in both projections' },
        { id: 'c', text: 'The 10-year date is resting on the arrivals continuing, because the same division without them gives 20 years, twice as long a wait', correct: true },
        { id: 'd', text: 'Neither projection can be used for the decision, because a figure that depends on an assumption is only a guess and a guess cannot justify a building' },
      ],
      expectedAnswer: 'The 10-year date is resting on the arrivals continuing, because the same division without them gives 20 years, twice as long a wait',
      hints: [
        'Both teams ran the same division on the same town. Find the one line in each team\'s assumptions that the other team does not share, because that line is where the two answers come from.',
        'Then test the headline by switching that line off and reading the other team\'s figure. Deciding that one team must have divided wrong, naming as the disputed line the one the two teams actually agree on, or holding that a figure with a condition attached is worth nothing to a planner all skip that test.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-rate-that-slides',
      kind: 'try_yourself',
      problem:
        'Calder is a small town of 3,000 people that has grown by 10 percent a year for three years, since a large construction project opened nearby. The county expects the rate to fall to 1.4 percent a year once the project finishes. A report prints one figure: Calder doubles in about 7 years. What is the honest reading of Calder\'s doubling time?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'About 7 years at the rate Calder has now and about 50 years at the lower one, so the answer is the range between them and the report quotes only its fastest end', correct: true },
        { id: 'b', text: 'About 7 years, because the rule of 70 is always run on the rate a place has now, and a rate that has not actually fallen yet cannot be put into the division' },
        { id: 'c', text: 'About 28.5 years, because 7 years and 50 years average out to that, and an average of the two doubling times is the single fairest figure to print' },
        { id: 'd', text: 'No doubling time can be given for Calder at all, because the rule of 70 needs a rate that stays put and this town has been given two different ones' },
      ],
      expectedAnswer: 'About 7 years at the rate Calder has now and about 50 years at the lower one, so the answer is the range between them and the report quotes only its fastest end',
      hints: [
        'The division takes one rate. Ask what Calder\'s single rate is across the whole stretch, and if there is not one, ask what can still be done with the two rates you were handed.',
        'Run the division separately at each rate and put the two answers side by side. Averaging them into one number, printing only the faster one, or refusing to answer at all each throw away something those two figures tell a planner.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-projection-as-prediction-and-gap-as-error',
      kind: 'misconception_check',
      question:
        'A student reads a projection for Marran -- 24,000 people, growing at 2 percent a year, doubling in about 35 years -- and writes: "So Marran will have 48,000 people in 35 years." Then, looking at the two Oskett projections of 20 years and 28 years, the student writes: "They cannot both be right, so one of those teams made a mistake in the division." What is wrong with each sentence?',
      commonErrors: [
        {
          answer: 'Marran will have 48,000 people in 35 years.',
          misconception:
            'Reading a projection as a prediction. The division is correct, but it was run with the growth rate held perfectly still for the whole 35 years, and the sentence quietly promises on the rate\'s behalf that it will do that.',
          correctsTo:
            'The arithmetic stands: 70 divided by 2 is about 35 years, and the check closes, since 35 times 2 is 70. What the sentence drops is the condition the division ran on. WRONG: "Marran will have 48,000 people in 35 years." CORRECT: "If Marran keeps growing at 2 percent a year, it reaches about 48,000 people in about 35 years." Then price the condition, so that the difference is not just a wording point. At 1 percent a year the same division gives 70 divided by 1, which is about 70 years, and the check is 70 times 1, which is 70. One percentage point off the rate moves the answer by about 35 years, so the date was never a fact about Marran. It was a fact about the rate somebody assumed, and the honest sentence is the one that says so.',
        },
        {
          answer: 'Two different doubling times for one town means one of the teams divided wrong.',
          misconception:
            'Hunting for the disagreement inside the arithmetic, when two projections of the same place differ because they were run on different assumptions, and the division is the one part both teams share.',
          correctsTo:
            'Check both divisions and both of them close. The county team assumed 2.5 percent from births and deaths plus 1 percent from migration, which is 3.5 percent: 70 divided by 3.5 is 20 years, and 20 times 3.5 is 70. The regional team assumed the arrivals stop, leaving 2.5 percent: 70 divided by 2.5 is 28 years, and 28 times 2.5 is 70. Neither division is wrong. WRONG: "Two answers, so one of them is a mistake." CORRECT: "Two answers, so there are two assumption lists, and the question to settle is the one line they do not share -- whether the arrivals keep coming." And once that is the question, the two figures become useful together rather than one of them being thrown away: a planner reads them as a bracket, about 20 years at the fast end and about 28 at the slow end, and buys land that still works at the later date.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Doubling time is one division: 70 divided by the growth rate in percent per year. Check every one by multiplying back, because the doubling time times the rate has to come back to 70.',
        'The answer is an estimate, because 70 is a rounded number. Say "about 35 years", never "exactly 35 years".',
        'Rate and time move in proportion, not in step. Doubling the rate halves the time, so one percentage point is worth a great many years at the slow end and very few at the fast end.',
        'A projection says IF and a prediction says WILL. Write the condition into the sentence, because the condition is the part a headline drops.',
        'When two projections of one place disagree, the division is almost never where they part company. Set the assumption lists side by side and name the one line they do not share.',
        'To find the assumption a headline is resting on, switch the assumptions off one at a time and see which one moves the answer furthest. The quiet assumption can be worth 50 years while the one everybody argues about is worth 8.',
        'A rate that slides is not one rate. Run the division at each end and report the bracket; the width of the bracket is the assumption, made visible.',
        'A growth rate and a doubling time are measurements of a speed. Fast growth and slow growth are measured here, never ranked, and neither is a score for a town or for the people in it.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.2', cedTitle: 'Evaluating Population Projections' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
