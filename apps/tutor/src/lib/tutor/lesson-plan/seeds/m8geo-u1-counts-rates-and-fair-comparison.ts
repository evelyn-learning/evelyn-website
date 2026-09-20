/**
 * Grade 8 World Geography — Geographic Data & Spatial Analysis: Counts, Rates
 * & Fair Comparison.
 *
 * PROCEDURE-LED exemplar for the m8geo fan-out (National Geography Standard
 * 1). The shape is deliberately different from the concept-led exemplar
 * (`m8geo-u7-hazard-risk-exposure-and-vulnerability.ts`): the concept segment
 * is a short ordered routine over described data rather than a mental model,
 * the first worked example runs the routine straight through on a claim, the
 * second re-runs it to repair a wrong denominator, and every answer ends with
 * an arithmetic inversion AND a one-input contrasting case. Two traps this
 * plan is built to kill: reading a count as if it were already a rate, and
 * believing that once a count has been divided by anything the comparison is
 * fair.
 *
 * THE PROCEDURE, in the order it is always run:
 *   1. Read the claim and name the denominator it needs (land, people, or
 *      each person).
 *   2. Divide each place's count by that denominator; scale to per 1,000
 *      where the figure would otherwise be an unreadable decimal.
 *   3. Compare the rates, never the counts, and give the verdict.
 *   4. Invert: multiply each rate back by its denominator and recover the
 *      count.
 *   Then change ONE input and run it again.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause each, that density is people
 * divided by land area (Grade 7, `m7geo-u3-population-distribution-and-
 * density.ts`) and that income per person is one indicator of many (Grade 7,
 * `m7geo-u5-levels-of-development.ts`), and re-teaches neither: no keyIdea in
 * this file defines density, distribution, an indicator or a composite, and
 * the phrase "a rate is a count divided by something" is the whole of the
 * premise, stated once inside keyIdea 1 where it is used. It ADDS choosing the
 * denominator FROM THE CLAIM, converting one described table into rates under
 * three denominators (per square kilometer, per 1,000 people, per capita),
 * testing a stated claim against the rate it actually needs, and showing that
 * the same table ranks the places one way under one denominator and the
 * opposite way under another. It names NO statistical-inference idea -- no
 * significance, no sampling, no margin of error -- because no middle-school
 * course owns those and the signed curriculum withholds them by name. It does
 * NOT class values or draw breaks (row 1.2, `evaluating-a-choropleth`), does
 * NOT merge or split areas to compare scales (row 1.3,
 * `scale-of-analysis-and-hidden-patterns`), and does NOT evaluate a map's
 * design (row 1.4, `maps-as-arguments`). Two things ARE deliberately allowed
 * because neighbors sit close: (a) the observation that one table gives two
 * opposite rankings under two denominators is stated here and worked with
 * digits, because it is a DENOMINATOR effect (this row's) and not a SCALE
 * effect (row 1.3's) -- no area is merged or subdivided anywhere in this
 * file; (b) keyIdea 6 says out loud that a count is sometimes the fair
 * comparison, because the routine's first step is reading the claim, and a
 * routine that always divides is not a routine, it is a habit.
 *
 * DEPTH FLOOR NOTE FOR THE FAN-OUT: every item in this lesson is answered by
 * a DECISION over described numbers -- which denominator, what rate, is the
 * claim supported. Nothing here asks what density is, what a rate is for, or
 * why people cluster. If a sentence you write for your own row would sit
 * comfortably in the Grade 7 file on the same subject, it is below the floor.
 * The test used on this file: the Grade 7 keyIdeas were read next to these
 * six, and the closest pair was keyIdea 2 here ("a count answers how many")
 * against Grade 7's "density is population divided by land area"; keyIdea 2
 * survived because it is about WHEN a count misleads, not what a rate is.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped Grade
 * 7 Geography bank the keyed answer was the strictly longest choice 67% of the
 * time, and 94% at difficulty 4; chance with four choices is 25%). The
 * PER-ITEM discipline is the point: every distractor here is a nameable wrong
 * STEP carrying its own figure or reason -- the count read as a rate, the
 * differences compared instead of the ratios, the refusal to compare because
 * the areas differ, the per-1,000 scaling forgotten, the division run the
 * wrong way round, the right rate read backwards -- and no key was built to
 * be the longest choice BECAUSE it is the key. Measured as a diagnostic, not
 * as a score: the key is the strictly longest in none of the three items, and
 * the three keys sit at ids b, d and a -- the id set `(1 + 1) mod 4 = 2`
 * requires, omitting c. Zero is NOT the target; the meaningful measurement is
 * the 120-item course rate at registration, which should land near a
 * quarter. The numeric item's four choices share one unit clause and come out
 * within four characters of each other; that is parallel structure helping,
 * not a guarantee, and the numeric choices are ordered by the id rule and
 * never by magnitude.
 *
 * NOTE ON prerequisites/followUps (`followUps` wired by the controller 2026-09-19 at course registration; `prerequisites` stays empty because 1.1 is the first row): the chain for this row is 1.1 -> 1.2, and
 * row 1.1 has no prerequisite. `lint-ms-plans` rejects a followUp that does
 * not resolve to a registered LO, and this exemplar is registered before row
 * 1.2 exists, so `followUps` stays empty until the full 40-row batch lands;
 * the controller wires `m8geo.evaluating-a-choropleth` in the registration
 * commit. Do NOT copy an empty followUps array into your own file.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every table is written out
 * in prose inside the item that needs it, every place is invented, and every
 * item is solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U1_COUNTS_RATES_AND_FAIR_COMPARISON: LessonPlan = {
  id: 'evelyn.ms.m8geo.counts-rates-and-fair-comparison.v1',
  title: 'Counts, Rates & Fair Comparison',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.counts-rates-and-fair-comparison',
      standard: 'M8GEO-1.1',
      description:
        'Given a table of counts and land areas or populations for several places, convert counts into rates (per square kilometer, per 1,000 people, per capita) and decide which comparison a stated claim actually needs, identifying when a raw count misleads (National Geography Standard 1: how to use maps and other geographic representations to acquire, process and report information).',
    },
  ],
  prerequisites: [],
  followUps: ['m8geo.evaluating-a-choropleth'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show a true count producing a false comparison, so the need for a denominator arrives before any vocabulary does.',
      script:
        'A local headline: "Ashby has three times as many potholes as Brill." That sounds like Ashby has a road problem. Now add the one fact the headline left out: Ashby has ten times as much road. Three times the potholes on ten times the road is fewer potholes on each kilometer, so the town with more potholes is the town with the smoother streets, and not a single pothole changed -- only what you divided by. That move, dividing a count by the right thing before you compare, is the whole lesson. Counts are easy to collect and easy to put in a headline, and they mislead the moment two places are different sizes. Today you get the routine that reads what a claim is really about, turns the count into the rate that claim needs, and then checks whether the claim survives.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-claim-names-the-denominator',
      kind: 'concept',
      goal: 'Install the four-step routine and the rule that the claim, not habit, fixes the denominator.',
      keyIdeas: [
        'THE CLAIM NAMES THE DENOMINATOR, SO READ THE CLAIM BEFORE YOU TOUCH THE TABLE. A rate is a count divided by something, and that something is the DENOMINATOR. Which one you use is not a matter of taste; it is fixed by what the claim is about. A claim about how packed the LAND is ("more crowded", "denser") needs land area under the count: people per square kilometer. A claim about how well the PEOPLE are served ("better coverage", "easier access") needs population under the count: doctors, buses or hectares of park per 1,000 people. A claim about how much each PERSON gets or spends ("more money behind each resident") needs the number of people under the count with no scaling: dollars per capita, which means per person. Say the denominator out loud before dividing anything.',
        'A COUNT ANSWERS "HOW MANY" AND NOTHING ELSE. Twelve thousand people is a real fact about a town, and it is the right figure when the question is how many school seats or bus passes the town needs. It becomes misleading only when it is used to compare two places of different size, because the bigger place wins every count automatically. "Ferris has more people" is a fact; "Ferris is more crowded" is a claim about people for each square kilometer, and a count cannot answer it. Whenever a claim compares places, and the places are not the same size, the count is the wrong tool and the rate is the right one.',
        'THE ROUTINE, IN ORDER. One: read the claim and name the denominator it needs. Two: for each place, divide the count by that denominator. Three: compare the rates, not the counts, and give a verdict on the claim. Four: check by inverting -- multiply each rate back by its denominator and make sure the original count comes back. If the count does not come back, the division went wrong somewhere, and it is nearly always a slipped zero.',
        'PER 1,000 IS A SCALING CHOICE, NOT A DIFFERENT KIND OF RATE. Dividing 24 doctors by 8,000 people gives 0.003 doctors per person, which is true and nearly impossible to read. Multiplying by 1,000 turns it into 3 doctors per 1,000 people, which is the same fact at a readable size. The scale is chosen for the reader, and the only rule is that every place in the comparison gets the same scale. Setting 3 per 1,000 against 0.002 per person is not wrong, but it is unreadable, and unreadable comparisons hide mistakes.',
        'THE SAME TABLE CAN RANK THE PLACES ONE WAY UNDER ONE DENOMINATOR AND THE OPPOSITE WAY UNDER ANOTHER, AND BOTH RANKINGS ARE TRUE. Sixty doctors on a small patch of land can be the densest cluster of doctors per square kilometer and, at the same time, the thinnest coverage per 1,000 residents, because the two rates answer two different questions. This is the reason the denominator has to come from the claim: pick it by habit instead and you can hand any claim the rate that flatters it. The test of a fair comparison is not whether the arithmetic is right -- both rates are right -- but whether the denominator matches what the claim is actually about.',
        'A RATE CAN ALSO BE THE WRONG TOOL. When the question really is a total -- how many vaccine doses to ship, how many desks to buy, how many buses a route needs on its first day -- the count is the answer, and dividing it by anything throws information away. The routine starts with reading the claim precisely because sometimes the honest verdict is: this claim is about a total, so the count is the fair comparison here.',
      ],
      vocabulary: [
        {
          term: 'rate',
          definition:
            'a count divided by a chosen denominator, so that places of different size can be compared on the same footing.',
        },
        {
          term: 'denominator',
          definition:
            'the quantity a count is divided by to make a rate -- land area, population, or the number of people -- and the thing the claim decides.',
        },
        {
          term: 'per capita',
          definition:
            'a rate whose denominator is the number of people and which is left unscaled, giving the amount for each one person.',
        },
        {
          term: 'per 1,000 people',
          definition:
            'a rate whose denominator is population, multiplied by 1,000 so that a small figure becomes readable.',
        },
        {
          term: 'raw count',
          definition: 'the total number of something in a place before any division has been done to it.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-routine',
      kind: 'worked_example',
      problem:
        'Run the routine straight through on a newspaper claim.\n\nThree towns sit in the same county. "Ferris: 12,000 people, 40 square kilometers. Galen: 4,500 people, 9 square kilometers. Holm: 6,000 people, 24 square kilometers." The county newspaper writes: "Ferris is the most crowded town in the county -- it has more people than Galen and Holm put together." Test the claim.',
      steps: [
        'Step one: read the claim and name the denominator. The claim is "most crowded". Crowded is about how packed the land is, so the denominator is land area, and the rate is people per square kilometer. Notice that the newspaper backed its claim with a count, and the count is even true: 4,500 plus 6,000 is 10,500, which is less than 12,000. A true count is still the wrong tool for a crowding claim.',
        'Step two: divide each count by its land area. Ferris: 12,000 people divided by 40 square kilometers is 300 people per square kilometer. Galen: 4,500 divided by 9 is 500 people per square kilometer. Holm: 6,000 divided by 24 is 250 people per square kilometer.',
        'Step three: compare the rates and give the verdict. Galen at 500 is the highest, Ferris at 300 is second, Holm at 250 is third. The claim is NOT supported: the town with the most people is not the most crowded, and the town with the FEWEST people is. WRONG: "Ferris has the most people, so it is the most crowded." CORRECT: "Galen has the most people for each square kilometer, so it is the most crowded, at 500 against 300 for Ferris and 250 for Holm."',
        'Step four: invert to check the arithmetic. 300 times 40 is 12,000. 500 times 9 is 4,500. 250 times 24 is 6,000. All three counts come back, so no zero slipped.',
        'Rewind the input and read it backwards. Galen has fewer than half the people of Ferris on less than a quarter of the land. Fewer people on much less land is exactly what a higher rate looks like, so the verdict follows from the table and not from a guess.',
        'Now change ONE input and run it again, so the result is not memorized as "the small town always wins". Suppose Galen had 18 square kilometers instead of 9, with the same 4,500 people. 4,500 divided by 18 is 250 people per square kilometer, and the check is 250 times 18, which is 4,500. Galen now ties Holm at 250, and Ferris at 300 becomes the most crowded -- the newspaper would be right, and for the wrong reason. Nobody moved; only the denominator changed. The count never moved either, which is exactly why the count could not have told you.',
      ],
      answer:
        'The claim is not supported. Crowding needs people per square kilometer: Ferris is 300 (12,000 divided by 40), Galen is 500 (4,500 divided by 9) and Holm is 250 (6,000 divided by 24), so Galen, the town with the fewest people, is the most crowded. Multiplying each rate back by its area returns each count. With Galen\'s land doubled to 18 square kilometers its rate halves to 250 and Ferris becomes the most crowded, which shows that the ranking lives in the denominator, not in the count.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-repair-the-denominator',
      kind: 'worked_example',
      problem:
        'A student ran the routine and got the denominator wrong. Find the slip, repair it, and say what the wrong number was actually measuring.\n\n"Marlow: 60 doctors, 30,000 people, 20 square kilometers. Nesbit: 24 doctors, 8,000 people, 12 square kilometers." The claim under test: "Residents of Nesbit have better access to a doctor than residents of Marlow." The student wrote: "Marlow: 60 divided by 20 is 3 doctors per square kilometer. Nesbit: 24 divided by 12 is 2 doctors per square kilometer. Marlow is higher, so the claim is false."',
      steps: [
        'Check the arithmetic first, because a wrong verdict is not always a wrong division. 60 divided by 20 is 3, and 3 times 20 is 60. 24 divided by 12 is 2, and 2 times 12 is 24. Both divisions are right. The slip is not in the arithmetic.',
        'Now go back to step one of the routine, which the student skipped: read the claim and name the denominator. The claim is about RESIDENTS and their access to a doctor. That is a claim about people, so the denominator has to be people, not land. The student divided by square kilometers, which answers a different question: how close together the doctors are.',
        'Re-run step two with the right denominator. Marlow: 60 doctors divided by 30,000 people is 0.002 doctors per person. Nesbit: 24 doctors divided by 8,000 people is 0.003 doctors per person. Those are true and unreadable, so scale both by 1,000: Marlow is 2 doctors per 1,000 people and Nesbit is 3 doctors per 1,000 people.',
        'Step three: compare and give the verdict. Nesbit at 3 per 1,000 is higher than Marlow at 2 per 1,000, so the claim IS supported. WRONG: "Marlow has 3 doctors per square kilometer against 2, so Marlow residents have better access." CORRECT: "Nesbit has 3 doctors for every 1,000 residents against 2 in Marlow, so Nesbit residents have better access, even though Marlow has more doctors in total and more doctors on each square kilometer."',
        'Step four: invert. 2 per 1,000 times 30 thousand people is 60 doctors. 3 per 1,000 times 8 thousand people is 24 doctors. Both counts come back.',
        'Say what the student\'s numbers were. They were not wrong numbers; they were right answers to a question nobody asked. Three doctors per square kilometer says Marlow\'s doctors sit closer together, which would matter if the claim were about how far a patient has to travel. It says nothing about how many patients each doctor is shared among. One table, two denominators, two opposite rankings, and both are true -- the claim decides which one counts.',
        'Change ONE input and run it again. Suppose Nesbit grew to 16,000 people with the same 24 doctors. 24 divided by 16,000 is 0.0015, which is 1.5 doctors per 1,000 people, and the check is 1.5 times 16, which is 24. Nesbit now falls below Marlow at 2, and the claim stops being supported. Not one doctor left town; the denominator doubled, so the rate halved.',
      ],
      answer:
        'The arithmetic was right and the denominator was wrong. The claim is about residents, so the count of doctors has to be divided by people: Marlow is 60 divided by 30,000, which is 2 doctors per 1,000 people, and Nesbit is 24 divided by 8,000, which is 3 per 1,000, so the claim is supported. The student\'s 3 and 2 doctors per square kilometer are correct figures for a different question, how close together the doctors are, and that question ranks the towns the opposite way. If Nesbit doubled to 16,000 people its rate would halve to 1.5 per 1,000 and the claim would fail.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-crowding-claim',
      kind: 'try_yourself',
      problem:
        '"Orrin: 9,000 people, 30 square kilometers. Pell: 6,000 people, 12 square kilometers." A blog post says: "Orrin is the more crowded of the two towns, since it has 3,000 more people." Does the data support the claim?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Supported: 9,000 is more than 6,000, and crowding is about how many people a town holds, so the bigger count settles it' },
        { id: 'b', text: 'Not supported: Orrin is 300 people per square kilometer and Pell is 500, so Pell is the more crowded town', correct: true },
        { id: 'c', text: 'Supported: Orrin has 3,000 more people and 18 more square kilometers, so it comes out ahead of Pell on both' },
        { id: 'd', text: 'Not supported: the two towns have different land areas, so their populations cannot be compared at all' },
      ],
      expectedAnswer: 'Not supported: Orrin is 300 people per square kilometer and Pell is 500, so Pell is the more crowded town',
      hints: [
        'Read the word "crowded" and ask what it is about: the number of people, or the people on each square kilometer? That names the denominator before you divide anything.',
        'Divide each population by its land area: 9,000 by 30 and 6,000 by 12, then multiply each result back to make sure the counts return. Trusting the bigger count, comparing the differences between the towns, or refusing to compare because the areas differ are three ways of never doing that division.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-per-thousand-rate',
      kind: 'try_yourself',
      problem:
        '"Quill: 45 firefighters, 15,000 people. Rennick: 30 firefighters, 6,000 people." A claim says Rennick gives its residents better firefighter coverage than Quill does. Compute the rate that claim needs for Rennick.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '200 firefighters per 1,000 people' },
        { id: 'b', text: '0.005 firefighters per 1,000 people' },
        { id: 'c', text: '30 firefighters per 1,000 people' },
        { id: 'd', text: '5 firefighters per 1,000 people', correct: true },
      ],
      expectedAnswer: '5 firefighters per 1,000 people',
      hints: [
        'The claim is about residents, so the denominator is people. Divide firefighters by population, then scale to per 1,000 so the figure is readable.',
        'Thirty divided by 6,000 is a small decimal, and the per-1,000 figure is that decimal times 1,000; check it by multiplying back by 6 thousand. Dividing the other way round gives people for each firefighter, not firefighters for each 1,000 people, and leaving the count alone gives no rate at all. For the comparison, Quill works out to 3 per 1,000.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-per-capita-claim',
      kind: 'try_yourself',
      problem:
        '"Sable: $1,350,000 a year on public libraries, 45,000 people. Torrin: $450,000 a year on public libraries, 9,000 people." A council member says: "Sable puts more library money behind each of its residents than Torrin does, since it spends three times as much." Does the data support the claim?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Not supported: Sable spends $30 per person and Torrin spends $50 per person, so Torrin puts more behind each resident', correct: true },
        { id: 'b', text: 'Supported: $1,350,000 is three times $450,000, and the claim is about money, so the two spending totals settle it' },
        { id: 'c', text: 'Supported: Sable has 36,000 more residents and spends $900,000 more, so it is ahead of Torrin on both figures' },
        { id: 'd', text: 'Supported: Sable spends $30 per person and Torrin spends $50 per person, and the lower figure means Sable stretches its money further' },
      ],
      expectedAnswer: 'Not supported: Sable spends $30 per person and Torrin spends $50 per person, so Torrin puts more behind each resident',
      hints: [
        'The claim says "behind each of its residents", and that names the denominator: the number of people, with no scaling. Divide each budget by its population.',
        '$1,350,000 divided by 45,000 and $450,000 divided by 9,000 give dollars per person; multiply each back by the population to recover the budget. Comparing the totals, comparing the differences, or reading the smaller per-person figure as the better one are the three ways this goes wrong.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-count-as-rate-and-any-denominator',
      kind: 'misconception_check',
      question:
        'A student compares two towns from a table -- "Ulm: 20,000 people, 50 square kilometers, 100 hectares of parks. Vance: 5,000 people, 5 square kilometers, 15 hectares of parks" -- and writes: "Ulm has four times the people, so it is four times as crowded. And for parks, any rate will do, so I divided park land by town area: Vance has more park for its size, so Vance residents get more park." What is wrong with each sentence?',
      commonErrors: [
        {
          answer: 'Ulm has four times the people, so it is four times as crowded.',
          misconception:
            'Treating a count as if it already were a rate. Four times the people is a true statement about the counts, and it says nothing about crowding until each count is divided by the land it sits on.',
          correctsTo:
            'Crowding is people for each square kilometer, so divide. Ulm: 20,000 divided by 50 is 400 people per square kilometer; check, 400 times 50 is 20,000. Vance: 5,000 divided by 5 is 1,000 people per square kilometer; check, 1,000 times 5 is 5,000. WRONG: "Ulm has four times the people, so it is four times as crowded." CORRECT: "Vance is the more crowded town, at 1,000 people per square kilometer against 400, even though Ulm has four times as many people, because Ulm also has ten times as much land." The count ranks the towns one way and the rate ranks them the other, and only the rate answers a crowding claim.',
        },
        {
          answer: 'Any rate will do, so park land divided by town area shows that Vance residents get more park.',
          misconception:
            'Believing that once a count has been divided by something, the comparison is fair. The division does make a rate, but the claim was about residents, and the student divided by land, so the rate answers a question the claim did not ask.',
          correctsTo:
            'The claim is "Vance residents get more park", which is about people, so the denominator is people. Ulm: 100 hectares divided by 20,000 people, scaled to per 1,000, is 5 hectares per 1,000 people; check, 5 times 20 is 100. Vance: 15 hectares divided by 5,000 people is 3 hectares per 1,000 people; check, 3 times 5 is 15. Ulm residents get more park, 5 per 1,000 against 3. The student\'s figures were not wrong: 100 divided by 50 is 2 hectares per square kilometer for Ulm, and 15 divided by 5 is 3 for Vance, so Vance does have more park for its land. That answers which town is greener for its size, not which residents get more park. WRONG: "Any rate will do." CORRECT: "The claim names the denominator, and a rate with the wrong denominator is a right answer to the wrong question."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Read the claim first. The claim names the denominator: land for crowding, people for coverage and access, each person for spending and income.',
        'A count answers only "how many". Comparing counts across places of different size is where a count misleads, because the bigger place wins every count.',
        'The routine: name the denominator, divide each count by it, compare the rates, then multiply each rate back to recover the count.',
        'Per 1,000 people is the same rate at a readable scale. Keep every place in a comparison on the same scale.',
        'One table can rank places one way per square kilometer and the opposite way per 1,000 people. Both are true; the claim decides which one is the fair comparison.',
        'Change one input and run it again. If doubling the land halves the rate while the count stands still, the count was never going to tell you.',
        'Sometimes the count is the fair comparison: when the question is a total, do not divide.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.1', cedTitle: 'Counts, Rates & Fair Comparison' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
