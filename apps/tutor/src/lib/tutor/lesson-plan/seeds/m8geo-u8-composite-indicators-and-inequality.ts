/**
 * Grade 8 World Geography — Globalization, Trade Networks & Development:
 * Composite Indicators & Inequality.
 *
 * PROCEDURE-LED row (National Geography Standard 11), shaped on the
 * procedure-led exemplar `m8geo-u1-counts-rates-and-fair-comparison.ts`: the
 * concept segment is an ordered routine over a described table rather than a
 * mental model, the first worked example runs the routine straight through and
 * then changes the list of indicators, the second runs the distribution half,
 * and every worked example ends with an arithmetic inversion AND a
 * one-input contrasting case. Three traps this plan is built to kill: adding
 * figures that are measured in different units, reading the rank scale upside
 * down (rank 1 is the best rank, so a LOWER average rank is the higher
 * position), and believing that two places with the same average must be alike
 * inside.
 *
 * THE PROCEDURE, in the order it is always run:
 *   1. For each indicator column, say which end gets rank 1 -- the larger
 *      figure for most indicators, the smaller figure for an indicator like
 *      people for each doctor.
 *   2. Rank each column separately, 1 to the best figure, and check that the
 *      column used each rank exactly once.
 *   3. Add each place's ranks and divide by the number of indicators. The
 *      lower average rank is the higher position on the composite.
 *   4. Invert: multiply each average back by the number of indicators to
 *      recover the total, and confirm the totals add to the whole table.
 *   Then change ONE thing -- add an indicator, or drop one -- and run it again.
 *   Separately, for distribution: divide the top fifth's share of income by
 *   the bottom fifth's share, and convert each share into an income per person
 *   by dividing it by 20 (a fifth of the people is 20 percent of them) and
 *   multiplying by the average.
 *
 * SCOPE GUARD (written last, against the finished body): this row ASSUMES that
 * geographers measure development with several indicators and that a composite
 * exists because no single indicator should decide the result (Grade 7,
 * `m7geo-u5-levels-of-development.ts`), and re-teaches neither. Checked clause
 * by clause against the body: no keyIdea defines an indicator or says what any
 * indicator measures -- keyIdea 2 names four of them only in order to fix which
 * END of each column gets rank 1, which is a step in the construction -- and
 * the reason a composite exists at all is never argued, only used. Nor does any
 * keyIdea argue in the abstract that one number cannot describe a country:
 * where the file touches that idea it converts it into arithmetic, with keyIdea
 * 4 saying exactly what a rank throws away (the size of the gap) and keyIdea 6
 * replacing the warning with a computed ratio and a dollar figure. The premise
 * surfaces twice, both times as an opening clause that is not the point of its
 * own sentence: keyIdea 1 notes that four indicators arrive in four different
 * units, and keyIdea 6 notes that an average reports how much there is. It ADDS
 * the construction itself: deciding which end of
 * each column gets rank 1, ranking every column separately, averaging the
 * ranks and inverting the average, checking the whole table against the column
 * totals, watching the order move when an indicator is added or dropped, and
 * computing the top-fifth-to-bottom-fifth income ratio along with the income
 * per person inside each fifth. It uses NO WEIGHTS: every indicator counts the
 * same, because weighting criteria and re-running a score with one weight
 * changed is row 2.3 (`site-selection-with-weighted-criteria`). It names NO
 * real published index and NO single-number inequality statistic -- the
 * Gini coefficient and the Lorenz curve are a high-school or AP statistics
 * treatment, and the signed curriculum withholds statistical machinery from
 * this course by name. It does NOT quantify the gain from specializing or
 * price a supply-chain backup (row 8.1,
 * `specialization-and-supply-chain-risk`), does NOT decide where a firm
 * locates (row 8.3, `where-factories-locate`), does NOT measure an access gap
 * by place and income group (row 8.4,
 * `connectivity-and-the-digital-divide`), and -- the closest neighbor -- does
 * NOT pick a criterion and decide which of two regions faces the greater
 * challenge on it, nor assemble the physical, population, economic and
 * connectivity dimensions that row 10.3
 * (`comparing-two-regions-with-indicators`) compares. Ordering places BY the
 * composite is the composite's output and is this row's; choosing a criterion
 * and judging who is worse off on it is 10.3's. Three things ARE deliberately
 * allowed because neighbors sit close: (a) indicators whose better end is
 * the SMALLER number -- people for each doctor in worked example 1, households
 * with no electricity in item 1, and children leaving school early named in
 * keyIdea 2 -- because deciding the direction of rank 1 is
 * a step inside building a composite and not a separate skill; (b) the
 * observation that changing the list of indicators changes the order, stated
 * here and worked with digits, because it is a LIST effect -- no denominator
 * is swapped (row 1.1) and no class break is redrawn (row 1.2); (c) saying out
 * loud, in keyIdea 1, in the misconception check and in the recap, that
 * ranking figures for a stated list is not ranking places, which accuracy rule
 * 4 requires of this row by name.
 *
 * ON THE SCOPE CELL'S THIRD PART (ruling 33): this row's cell has a positive
 * statement and a lineage clause, but its third part is NOT a withheld-model
 * clause. It reads "Measured, never ranked as a virtue (G7 contract rule 4)",
 * which is a sensitivity directive, not a boundary against a course above. The
 * withheld boundaries in the guard above were therefore derived from the
 * curriculum's "Explicitly excluded" list and from the neighboring rows, not
 * from the cell. Nothing is missing; do not hunt for it.
 *
 * ON RULING 32 AND 36 (burned examples): part (i) of the cell, which is copied
 * into `los[0].description` and is student-facing, names the MOVES (rank each
 * indicator, average the ranks, add or drop one, the top fifth against the
 * bottom fifth) but not one concrete specimen -- no country, no figure. So no
 * item specimen is burned by the description, and every place, indicator value
 * and share below was written fresh for this file. What the description DOES
 * give away is the definition of the inequality measure, so item 3 does not
 * ask what the measure is; it asks what two described distributions with the
 * same average support. One residual exposure, recorded rather than hidden:
 * the description states that two countries with equal averages CAN differ,
 * which weakens item 3 choice c ("neither is spread more widely") for a
 * student who has read the objective. Choices a, b and d all survive it,
 * because separating them needs the two ratios computed, and no rewrite of the
 * item can remove a clause the signed scope cell puts in the objective.
 *
 * DEPTH FLOOR NOTE FOR THE FAN-OUT: every item here is answered by a computed
 * figure or by a verdict with its arithmetic attached -- an average rank, what
 * a fifth indicator does to an order, which of two equal averages hides the
 * wider spread. Nothing asks what an indicator is, what a composite is for, or
 * why one number cannot describe a country. The test used on this file: the
 * Grade 7 keyIdeas in `m7geo-u5-levels-of-development.ts` were read next to
 * these six, and the closest pair was keyIdea 6 here against Grade 7's "one
 * number never describes a country, because an average hides what is inside
 * it". KeyIdea 6 survived because it does not stop at the warning: it cuts the
 * people into fifths, divides one share by the other, and converts both into
 * dollars per person, so the sentence could not be lifted into the Grade 7
 * file without the arithmetic looking out of place.
 *
 * ACCURACY NOTE: NO REAL COUNTRY, REGION OR PLACE IS NAMED ANYWHERE IN THIS
 * FILE, and no real figure appears. Every country is invented and every number
 * was written for the arithmetic, which is the strict reading accuracy rule 3
 * requires of a row that puts numbers in every item. Accuracy rule 4 governs
 * this row by name: the file ranks COLUMNS OF FIGURES for a stated list of
 * indicators and says so in three places, and it never calls a place better,
 * more advanced or more developed. Accuracy rule 8 is carried by the
 * distribution half itself -- two countries with identical averages are shown
 * to hold very different households -- and the recap says it. No group of
 * people is characterized (rule 5), no policy for changing a distribution is
 * proposed or evaluated, and no real dispute, agreement or current event is
 * named (rule 6). The only real-world claims in the file are definitional or
 * arithmetical and are in the report ledger.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped Grade
 * 7 Geography bank the keyed answer was the strictly longest choice 67% of the
 * time, and 94% at difficulty 4; chance with four choices is 25%). Every
 * distractor below states the full wrong STEP that produces it -- the column
 * ranked from the wrong end, the total reported without dividing, the best
 * rank reported as the composite, the new total divided by the old count of
 * indicators, the rank scale read upside down, the bottom-fifth share read
 * alone, the average treated as if it carried the spread -- and no key was
 * built to be the longest choice BECAUSE it is the key. Measured as a
 * diagnostic, not as a score: the key is the strictly longest choice in 0 of
 * the 3 items, and the three keys sit at ids d, a and b, which is the id set
 * `(8 + 2) mod 4 = 2` requires, omitting c. Zero is NOT the target, so ruling
 * 16's inversion check was run rather than celebrated, and the count is not
 * the inverted tell: measured lengths are item 1 a=148, b=121, c=117,
 * d=146(key); item 2 a=159(key), b=159, c=152, d=158; item 3 a=170,
 * b=159(key), c=154, d=154. The key is second-longest, joint-longest and
 * second-longest, never the shortest, and every margin is inside a handful of
 * characters -- nothing was grown or trimmed to move the number. The
 * meaningful measurement is the 120-item course rate taken at registration,
 * which should land near a quarter. Item 1's four choices are four average
 * ranks, each with a reason clause of the same shape, and they are ordered by
 * the id rule and never by magnitude.
 *
 * NOTE ON prerequisites/followUps: the chain for this row is 8.1 -> 8.2 -> 8.3,
 * and both arrays carry the real neighboring loIds
 * (`m8geo.specialization-and-supply-chain-risk` and
 * `m8geo.where-factories-locate`). The two exemplars ship empty arrays because
 * they were registered alone, ahead of the fan-out; that is a registration
 * artifact and was not copied.
 *
 * There are NO MAPS AND NO IMAGES in this course. Every table is written out in
 * prose inside the segment that needs it, every place is invented, and every
 * item is solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U8_COMPOSITE_INDICATORS_AND_INEQUALITY: LessonPlan = {
  id: 'evelyn.ms.m8geo.composite-indicators-and-inequality.v1',
  title: 'Composite Indicators & Inequality',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.composite-indicators-and-inequality',
      standard: 'M8GEO-8.2',
      description:
        'Given a table of four indicators for several countries, build a simple composite (rank each indicator, average the ranks), show how the result changes when an indicator is added or dropped, and interpret an inequality measure (the share of income held by the top fifth versus the bottom fifth) to explain why two countries with equal averages can differ (National Geography Standard 11: the patterns and networks of economic interdependence on Earth surface).',
    },
  ],
  prerequisites: ['m8geo.specialization-and-supply-chain-risk'],
  followUps: ['m8geo.where-factories-locate'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show a composite moving when the list behind it moves, using a scoring the student has already argued about, before any indicator vocabulary arrives.',
      script:
        'Your school runs a field day, and no event counts for more than another. Across the four scored events one team finishes first, first, third and third. A second team finishes second in every single event. Who takes the trophy? The organizers do the obvious thing: add each team\'s finishing places and divide by four. The first team gets 1 plus 1 plus 3 plus 3, which is 8, and 8 divided by 4 is 2. The second team gets 2 plus 2 plus 2 plus 2, which is 8, and 8 divided by 4 is 2 as well. A dead tie -- until somebody points out that the tug-of-war was left off the list. The first team came fourth in that one and the second team came second, so the totals become 12 and 10, and the averages become 12 divided by 5, which is 2.4, against 10 divided by 5, which is 2.0. The trophy moves, and nobody ran a single step differently. Geographers build a country\'s composite the same way, out of ranks on four or five indicators, and it has exactly that property. Today you build one from a table, you watch the order move when the list of indicators moves, and then you meet the thing no composite can see at all: how spread out the numbers are inside a country.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-build-the-composite-then-look-inside',
      kind: 'concept',
      goal: 'Install the four-step ranking routine, the direction rule, the upside-down rank scale, the two checks, the list effect, and the top-fifth-to-bottom-fifth ratio.',
      keyIdeas: [
        'RANK EACH COLUMN SEPARATELY, BECAUSE THE UNITS DO NOT ADD. Four indicators for the same places arrive in four different units -- dollars a year, years of life, years of schooling, percent of households -- and dollars plus years plus percent is not a quantity of anything, so a composite can never be made by adding the raw figures. Take one indicator at a time, put the places in order on that indicator alone, and write down the position: rank 1 for the best figure in the column, then 2, then 3. Ranking strips the units off and leaves a position, and positions can be averaged. Notice exactly what is being ranked: a column of figures, for a list of indicators somebody chose. Ranking figures is not ranking places, and this course never does the second one -- a composite is a measurement, never a verdict on a country or on the people who live in it.',
        'BEFORE YOU RANK A COLUMN, SAY WHICH END GETS RANK 1. For most indicators the larger figure is the better one: more years of schooling, a longer life expectancy, a larger share of households with a tap with clean water at home. For some the smaller figure is: the number of people sharing one doctor, the share of households with no electricity, the number of children who leave school early. Decide the direction out loud, column by column, before any number is written down. Then check the column: with three places it must contain 1, 2 and 3 exactly once, and with four places 1 through 4 exactly once. A column that gives two places the same rank is a column that was never really ranked.',
        'AVERAGE THE RANKS, AND REMEMBER THE SCALE RUNS BACKWARDS. Add each place\'s ranks and divide by the number of indicators: four ranks adding to 6 give 6 divided by 4, which is 1.5. A LOWER average rank is the HIGHER position on the composite, because rank 1 is the best rank -- the composite scale runs the opposite way from the figures underneath it, and that is the single easiest thing in this routine to get backwards. Then invert, twice. Multiply each average back by the number of indicators and the total has to come back: 1.5 times 4 is 6. And add the totals across the whole table: with three places every column adds to 1 plus 2 plus 3, which is 6, so four columns add to 24, and the three place totals must add to 24 as well. If they do not, a column was ranked from the wrong end or a rank was used twice.',
        'THE COMPOSITE KEEPS THE ORDER AND THROWS THE GAPS AWAY. A place ranked third on income might be a few dollars below second, or it might be at half of second, and the rank is 3 in both cases. That is the price of being able to combine dollars with years: the composite carries the ORDER on each indicator and nothing at all about how large the differences were. So a composite can put two places one step apart when the figures behind them are nearly identical, and one step apart when the figures behind them are miles apart. Say that out loud whenever you report one, because it is the first question a careful reader asks.',
        'CHANGE THE LIST OF INDICATORS AND THE ANSWER CHANGES, SO THE LIST IS PART OF THE RESULT. Add an indicator and every total gains a rank while every average is divided by a bigger number; drop an indicator and the opposite happens. A place that led on four indicators can tie, or fall behind, on five. That is not a flaw to be fixed -- it is what a composite is: the result of a decision about what to count. Two people who count honestly and count different things get different orders, and neither is lying. So a composite is always reported together with the list it was built from, and a composite quoted without its list cannot be checked by anybody.',
        'AN AVERAGE REPORTS HOW MUCH THERE IS; A DISTRIBUTION MEASURE REPORTS HOW IT IS SPREAD. Sort everybody in a country by income and cut them into five equal fifths, each holding a fifth of the people. The share of all the income that goes to the top fifth, and the share that goes to the bottom fifth, are two more figures, and the top share divided by the bottom share says how many times as much the top fifth receives: 36 percent against 9 percent is 36 divided by 9, which is 4 times; 50 percent against 5 percent is 10 times. Two countries with exactly the same income per person can sit at 4 times and at 10 times, and every indicator in the composite would be identical for them. To turn a share back into money, divide it by 20, because a fifth of the people is 20 percent of them, and multiply by the income per person. A country is never one thing inside, and this pair of numbers is how the spread gets measured instead of guessed.',
      ],
      vocabulary: [
        {
          term: 'rank',
          definition:
            'a place\'s position in one column of figures, counted from the end of that column the analyst named as best, so that 1 is the best position.',
        },
        {
          term: 'composite',
          definition:
            'one figure built from several indicators by ranking each indicator separately and averaging the ranks, which is what allows measurements in different units to be combined at all.',
        },
        {
          term: 'average rank',
          definition:
            'the total of a place\'s ranks divided by the number of indicators used; a lower average rank is a higher position on the composite.',
        },
        {
          term: 'income share',
          definition:
            'the percent of all the income in a place that goes to one group of its people, which reports how the total is spread rather than how large it is.',
        },
        {
          term: 'top-fifth to bottom-fifth ratio',
          definition:
            'the top fifth\'s share of income divided by the bottom fifth\'s share, giving how many times as much income the top fifth receives.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-build-and-move-the-composite',
      kind: 'worked_example',
      problem:
        'Build the composite for three invented countries, then evaluate what happens when a fifth indicator joins the list.\n\n"Adera: income per person $9,000 a year; life expectancy 78 years; 11 years of schooling for a typical adult; 96 percent of households have a tap with clean water at home.\n\nBellun: $15,000 a year; 71 years; 9 years; 88 percent.\n\nCorvale: $6,000 a year; 74 years; 13 years; 92 percent."',
      steps: [
        'Step one: name the direction for each of the four columns. More money, a longer life, more years of schooling and a larger share of households with clean water at home are all the larger-is-better direction, so in all four columns rank 1 goes to the largest figure. Say it before ranking anything, because the next worked table will not be this tidy.',
        'Step two: rank each column on its own. Income: $15,000, then $9,000, then $6,000, so Bellun 1, Adera 2, Corvale 3. Life expectancy: 78, then 74, then 71, so Adera 1, Corvale 2, Bellun 3. Schooling: 13, then 11, then 9, so Corvale 1, Adera 2, Bellun 3. Clean water: 96, then 92, then 88, so Adera 1, Corvale 2, Bellun 3. Each of the four columns used 1, 2 and 3 exactly once, which is the first check.',
        'Step three: add each country\'s four ranks and divide by 4. Adera: 2 plus 1 plus 2 plus 1 is 6, and 6 divided by 4 is 1.5. Bellun: 1 plus 3 plus 3 plus 3 is 10, and 10 divided by 4 is 2.5. Corvale: 3 plus 2 plus 1 plus 2 is 8, and 8 divided by 4 is 2.0.',
        'Step four: invert, both ways. Multiply back: 1.5 times 4 is 6, 2.5 times 4 is 10, 2.0 times 4 is 8, so all three totals return. Add across the table: 6 plus 10 plus 8 is 24, and four columns of three ranks each must add to 4 times 6, which is 24. The table closes.',
        'Now read the order, remembering that the scale runs backwards. Adera at 1.5 is first, Corvale at 2.0 is second, Bellun at 2.5 is third. WRONG: "Bellun has an average rank of 2.5, the biggest of the three, so Bellun comes out on top -- and it earns more than twice what Corvale earns." CORRECT: "Rank 1 is the best rank, so the lowest average is the highest position: Adera 1.5, then Corvale 2.0, then Bellun 2.5. Bellun leads on income by a wide margin and sits last on the other three columns, and the composite counts all four the same." And say what has actually been ordered: four columns of figures, for one chosen list of four indicators. Nobody has been graded.',
        'Rewind the input and read it backwards to confirm the order follows from the table. Corvale is last on money and first on schooling; Adera is second on money and first or second on everything else; Bellun is first on money and last on everything else. A country that is near the top of three columns out of four should come out ahead of a country that is at the bottom of three, and that is exactly what the averages say.',
        'Now change ONE thing and run the routine again. A fifth indicator joins the list: the number of people sharing one doctor -- Adera 900, Bellun 400, Corvale 1,200. This is the column where the direction matters: FEWER people for each doctor is the better figure, so rank 1 goes to the smallest number. Bellun 400 is 1, Adera 900 is 2, Corvale 1,200 is 3, and the column used 1, 2 and 3 once each. New totals: Adera 6 plus 2 is 8, and 8 divided by 5 is 1.6. Bellun 10 plus 1 is 11, and 11 divided by 5 is 2.2. Corvale 8 plus 3 is 11, and 11 divided by 5 is 2.2. Check by multiplying back: 1.6 times 5 is 8, 2.2 times 5 is 11, and the totals add to 8 plus 11 plus 11, which is 30, and five columns must add to 5 times 6, which is 30.',
        'Read what the change did, in both directions. Adding the doctor indicator leaves Adera first and closes the two-step gap between Corvale and Bellun completely: they were 2.0 against 2.5, and they are now tied at 2.2. Run it the other way and the same digits say the same thing: drop the doctor indicator from the five and the tie breaks again, with Corvale back at 2.0 ahead of Bellun at 2.5. Nothing about any country changed between those two answers -- not one figure in the table moved. What moved was the list.',
      ],
      answer:
        'On the four-indicator list the ranks are Adera 2, 1, 2, 1 for a total of 6 and an average of 1.5; Bellun 1, 3, 3, 3 for 10 and 2.5; Corvale 3, 2, 1, 2 for 8 and 2.0. Rank 1 is best, so the order is Adera, Corvale, Bellun. Multiplying each average back by 4 returns each total, and the totals add to 24, which is four columns of 6. Adding a fifth indicator -- people for each doctor, where the smaller figure ranks 1 -- gives Adera 8 and 1.6, Bellun 11 and 2.2, and Corvale 11 and 2.2, so Corvale and Bellun tie and the gap between them disappears. Dropping that indicator again restores Corvale ahead of Bellun. The figures never changed; the list did.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-same-average-different-spread',
      kind: 'worked_example',
      problem:
        'Two invented countries report the same income per person. Work out how differently that income is spread, and say what the composite would have shown.\n\n"Dunmere: income per person $12,000 a year. Sorted by income and cut into five equal fifths, the top fifth of the people receives 36 percent of all the income in the country and the bottom fifth receives 9 percent.\n\nEsketh: income per person $12,000 a year. The top fifth receives 50 percent and the bottom fifth receives 5 percent."',
      steps: [
        'Start with what the two countries share, because it is the whole point of the example. Income per person is $12,000 in both. On an income indicator they would tie, take the same rank, and contribute the same number to a composite. Every other indicator could tie too. So far the two countries are indistinguishable.',
        'Take the top-fifth to bottom-fifth ratio for each. Dunmere: 36 divided by 9 is 4, so the top fifth receives 4 times as much income as the bottom fifth. Esketh: 50 divided by 5 is 10, so the top fifth receives 10 times as much. Same average, and one country is spread two and a half times more widely than the other on this measure.',
        'Check that the shares are complete before trusting them. Dunmere: 36 plus 9 is 45, so the middle three fifths hold 100 minus 45, which is 55 percent. Esketh: 50 plus 5 is 55, so the middle three fifths hold 100 minus 55, which is 45 percent. Both countries add to 100 percent across all five fifths, so no share is missing and none was counted twice.',
        'Now turn the shares into money, which is where the size of the gap becomes visible. A fifth of the people is 20 percent of the people, so a group with 36 percent of the income and 20 percent of the people has 36 divided by 20, which is 1.8 times the average income: 1.8 times $12,000 is $21,600 for each person in Dunmere\'s top fifth. Dunmere\'s bottom fifth: 9 divided by 20 is 0.45, and 0.45 times $12,000 is $5,400. Esketh\'s top fifth: 50 divided by 20 is 2.5, and 2.5 times $12,000 is $30,000. Esketh\'s bottom fifth: 5 divided by 20 is 0.25, and 0.25 times $12,000 is $3,000.',
        'Invert the conversion to make sure no decimal slipped. $21,600 divided by $12,000 is 1.8, and 1.8 times 20 is 36, the share it came from. $3,000 divided by $12,000 is 0.25, and 0.25 times 20 is 5. And the dollar figures reproduce the ratios directly: $21,600 divided by $5,400 is 4, and $30,000 divided by $3,000 is 10, the same two numbers the shares gave.',
        'Say the verdict and say what it is not. WRONG: "Both countries report $12,000 per person, so a household in one is in about the same position as a household in the other." CORRECT: "Both countries report $12,000 per person, and inside that identical average Dunmere\'s bottom fifth has $5,400 each while Esketh\'s has $3,000 each -- a difference of $2,400 per person that the average and the composite are both blind to." The ratio measures how the income is spread. It does not say that either country is better or worse than the other, and it says nothing about anybody who lives in either one.',
        'Rewind the shares and read them backwards to confirm nothing was misread: Esketh 5 and 50, Dunmere 9 and 36; the smaller bottom share and the larger top share both belong to Esketh, which is why Esketh is the wider of the two. Now change ONE input. Suppose Esketh\'s top fifth received 40 percent instead of 50 and its bottom fifth 10 percent instead of 5, with the middle three fifths holding 100 minus 50, which is 50 percent. The ratio becomes 40 divided by 10, which is 4 -- the same as Dunmere. The bottom fifth is now 10 divided by 20, which is 0.5, and 0.5 times $12,000 is $6,000 for each person, double the $3,000 it was. Income per person did not move, the total income in Esketh did not move, and every rank in every composite would be exactly what it was before.',
      ],
      answer:
        'The two countries are identical on the average: $12,000 per person each, the same rank on an income indicator, the same contribution to a composite. They are not identical inside it. Dunmere\'s top fifth receives 36 percent against its bottom fifth\'s 9 percent, and 36 divided by 9 is 4 times; Esketh\'s is 50 against 5, and 50 divided by 5 is 10 times. In money, Dunmere runs $21,600 against $5,400 for each person and Esketh runs $30,000 against $3,000, and those pairs divide back to 4 and 10. Both sets of five shares add to 100 percent. If Esketh moved to 40 percent and 10 percent its ratio would become 4, matching Dunmere, while its income per person and every composite rank stayed exactly the same.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-average-rank-with-a-reversed-column',
      kind: 'try_yourself',
      problem:
        'Three invented countries -- Fennow, Gorrin and Hestal -- are compared on four indicators, each indicator ranked separately with rank 1 going to the best figure. On the first three indicators Gorrin ranked 1, 3 and 3. The fourth indicator is the share of households with no electricity: Fennow 4 percent, Gorrin 21 percent, Hestal 12 percent. What is Gorrin\'s average rank across all four indicators?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'An average rank of 2.0, because 21 percent is the largest figure in the electricity column, so Gorrin takes rank 1 on it and its four ranks add to 8' },
        { id: 'b', text: 'An average rank of 10, because the composite is the total a country\'s ranks come to once every indicator has been counted' },
        { id: 'c', text: 'An average rank of 1, because a composite reports the best rank a country reached on any single one of the indicators' },
        { id: 'd', text: 'An average rank of 2.5, because a smaller share with no electricity is the better figure, so Gorrin ranks 3 on it and 1 plus 3 plus 3 plus 3 is 10', correct: true },
      ],
      expectedAnswer: 'An average rank of 2.5, because a smaller share with no electricity is the better figure, so Gorrin ranks 3 on it and 1 plus 3 plus 3 plus 3 is 10',
      hints: [
        'Before you rank the fourth column, decide which end of it gets rank 1. Households with no electricity is one of the indicators where the smaller figure is the better one, so work out where 21 percent sits among 4, 12 and 21.',
        'Once the fourth rank is settled, add all four and divide by the number of indicators, then multiply your answer back by 4 and check the total returns. Ranking the electricity column from the larger end, stopping at the total without dividing, and reporting a country\'s best single rank are the three ways this comes out wrong.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-adding-an-indicator',
      kind: 'try_yourself',
      problem:
        'Four invented countries are compared on four indicators, each ranked separately from 1 for the best figure down to 4. Lorrim\'s four ranks are 1, 2, 1 and 2. Menath\'s are 2, 1, 3 and 2. A fifth indicator is then added to the list, and on it Lorrim ranks 4th and Menath ranks 1st. What does adding that indicator do to the comparison between these two countries?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Menath moves ahead of Lorrim: the totals become 10 and 9, so the averages become 2.0 and 1.8, and rank 1 is the best rank, so the lower average is now Menath\'s', correct: true },
        { id: 'b', text: 'Nothing changes and Lorrim keeps the lead it held at 1.5 against 2.0, because one added indicator cannot outweigh the four indicators that were already counted' },
        { id: 'c', text: 'Lorrim moves further ahead: its average climbs from 1.5 to 2.0 while Menath\'s falls from 2.0 to 1.8, and the higher average rank is the stronger showing' },
        { id: 'd', text: 'Menath moves ahead of Lorrim, whose average becomes 2.5 against Menath\'s 2.25, because the two new totals are still averaged over the four original indicators' },
      ],
      expectedAnswer: 'Menath moves ahead of Lorrim: the totals become 10 and 9, so the averages become 2.0 and 1.8, and rank 1 is the best rank, so the lower average is now Menath\'s',
      hints: [
        'Work out both averages twice: once over the four indicators, then again after adding the fifth rank to each total. The number you divide by has to change when the list changes.',
        'Then read the two new averages the right way round, because rank 1 is the best rank and the lower average is the higher position. Dividing the new totals by 4, or treating the bigger average as the better one, are the two steps that turn a correct total into a wrong verdict.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-same-average-different-shares',
      kind: 'try_yourself',
      problem:
        'Two invented countries, Irrune and Jalmar, both report income per person of $20,000 a year. In Irrune the top fifth of the people receives 48 percent of all the income and the bottom fifth receives 8 percent. In Jalmar the top fifth receives 42 percent and the bottom fifth receives 14 percent. Which statement does the data support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Jalmar is the more widely spread of the two, because its bottom fifth receives 14 percent against 8 percent in Irrune, and the larger bottom-fifth share is the larger gap' },
        { id: 'b', text: 'The two averages are equal, but Irrune\'s income is spread more widely: its top fifth receives 6 times what its bottom fifth receives, against 3 times in Jalmar', correct: true },
        { id: 'c', text: 'Neither country is spread more widely than the other, because both report income per person of $20,000 and an average is what reports how income is spread' },
        { id: 'd', text: 'Irrune must have the higher income per person of the two, because its top fifth receives 48 percent of all income while holding only a fifth of the people' },
      ],
      expectedAnswer: 'The two averages are equal, but Irrune\'s income is spread more widely: its top fifth receives 6 times what its bottom fifth receives, against 3 times in Jalmar',
      hints: [
        'The two averages are the same, so they cannot separate the countries. Divide the top-fifth share by the bottom-fifth share inside each country, and compare those two results with each other.',
        'To see what the ratios mean in money, divide a share by 20 and multiply by $20,000: Jalmar\'s bottom fifth comes to $14,000 for each person and Irrune\'s to $8,000. Reading the bottom share on its own, treating the equal averages as the answer, and reading a share of the income as if it changed the country\'s total are the three ways this goes wrong.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-upside-down-scale-and-equal-averages',
      kind: 'misconception_check',
      question:
        'A student finishes the Adera, Bellun and Corvale composite and writes: "Bellun scored 2.5, the highest of the three, so Bellun is the most developed country." Then, reading the Dunmere and Esketh figures: "Both countries are at $12,000 per person, so households in them are equally well off." What is wrong with each sentence?',
      commonErrors: [
        {
          answer: 'Bellun scored 2.5, the highest of the three, so Bellun is the most developed country.',
          misconception:
            'Two errors stacked in one sentence. The first is reading the rank scale upside down: an average rank is built from positions where 1 is the best, so a larger average is a lower position, not a higher score. The second is treating the result as a verdict on a country rather than as the order of four columns of figures for one chosen list of indicators.',
          correctsTo:
            'Take the arithmetic first. Adera\'s ranks add to 2 plus 1 plus 2 plus 1, which is 6, and 6 divided by 4 is 1.5. Corvale\'s add to 3 plus 2 plus 1 plus 2, which is 8, and 8 divided by 4 is 2.0. Bellun\'s add to 1 plus 3 plus 3 plus 3, which is 10, and 10 divided by 4 is 2.5. Rank 1 is the best rank, so the lowest average is the highest position and Bellun at 2.5 is LAST of the three, not first. WRONG: "Bellun scored 2.5, the highest of the three, so Bellun comes out on top." CORRECT: "Bellun has the highest average rank, which on this scale means the lowest position: Adera 1.5, Corvale 2.0, Bellun 2.5." Now the second half of the sentence, which no arithmetic can repair. What was ordered is four columns of figures, for a list of four indicators somebody chose -- and adding a fifth indicator, people for each doctor, pulls Bellun level with Corvale at 2.2. An order that a change to the list can rewrite is not a property of a country. Say what the measurement measures: on this list of indicators, these figures come in this order. A country is not more developed or less developed than another, and this course does not grade places or the people who live in them.',
        },
        {
          answer: 'Both countries are at $12,000 per person, so households in them are equally well off.',
          misconception:
            'Treating an average as if it carried the spread. The income per person is the total income divided by the total people, and that single division deliberately erases every difference between one person and another, so two countries can produce the same figure from completely different distributions.',
          correctsTo:
            'The average is genuinely equal, and the spread is not. Divide the top-fifth share by the bottom-fifth share inside each country: Dunmere is 36 divided by 9, which is 4 times, and Esketh is 50 divided by 5, which is 10 times. Put it in money by dividing each share by 20, because a fifth of the people is 20 percent of them, and multiplying by $12,000: Dunmere runs $21,600 for each person in the top fifth against $5,400 in the bottom fifth, and Esketh runs $30,000 against $3,000. Check the conversion by dividing back, $21,600 divided by $12,000 is 1.8 and 1.8 times 20 is 36. WRONG: "Same income per person, so the same situation inside." CORRECT: "Same income per person, and a bottom fifth living on $5,400 each in one country and $3,000 each in the other." An average and a distribution measure answer two different questions -- how much there is, and how it is spread -- and a country is never one thing inside, which is exactly why the second question has to be asked out loud.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Units do not add, so a composite is built by ranking each indicator column separately and averaging the positions, never by adding the raw figures.',
        'Name the direction before you rank a column: larger is better for schooling, life expectancy and clean water; smaller is better for people sharing one doctor or households with no electricity. Then check the column used each rank exactly once.',
        'A lower average rank is the higher position, because rank 1 is the best rank. The composite scale runs the opposite way from the figures underneath it.',
        'Two checks, every time: multiply each average back by the number of indicators to recover the total, and confirm the totals add to the number of columns times 1 plus 2 plus 3.',
        'The composite keeps the order and throws the gaps away, so it cannot tell you whether third place was just behind second or nowhere near it.',
        'Change the list and the answer changes: four indicators put Corvale at 2.0 ahead of Bellun at 2.5, and adding a fifth ties them both at 2.2. Report a composite with the list it was built from, or nobody can check it.',
        'An average says how much there is; the top fifth\'s share divided by the bottom fifth\'s share says how it is spread. Two countries at $12,000 per person can run 4 times and 10 times, so a country is never one thing inside.',
        'All of this ranks columns of figures for a chosen list of indicators. It is a measurement, never a score for a country or for the people who live there.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'Composite Indicators & Inequality' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
