/**
 * Grade 8 World Geography — North America: People, Cities & Economy: North
 * America: Migration Flows.
 *
 * PROCEDURE-LED row 4.2 (National Geography Standard 9), shaped on
 * `m8geo-u1-counts-rates-and-fair-comparison.ts`. The concept segment is a
 * short ordered routine over a described origin-destination table rather than
 * a mental model; the first worked example runs the routine straight through
 * and then changes one line to flip the ranking; the second runs the
 * evaluation half, testing three offered explanations against the direction
 * the table shows. Every item is answered by a computed figure or by a named
 * region-in-the-data carrying its arithmetic, never by a definition.
 *
 * THE ROUTINE, in the order it is always run:
 *   1. Add the DEPARTURES for each region -- the lines that start at it.
 *   2. Add the ARRIVALS for each region -- the lines that end at it.
 *   3. Subtract: arrivals minus departures is the net. Positive is net
 *      receiving, negative is net sending, zero is an even trade.
 *   4. Check the whole table: total arrivals equals total departures, and the
 *      nets add to zero.
 *   5. Sort each stated reason by which region it describes, then TEST it
 *      against the direction: present at both ends, pointing the wrong way,
 *      or not in the data at all are the three ways it fails.
 *   Then change ONE line and run it again.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause where it is used, that a reason
 * describing the place people left is a push and a reason describing the place
 * they went is a pull (Grade 7, `m7geo-u3-migration-push-and-pull.ts`), and
 * re-teaches neither: that clause opens keyIdea 4 and is immediately subjected
 * to this row's own work ("a sorted list of reasons is not yet an
 * explanation"); no keyIdea has defining push and pull as its job, the
 * `vocabulary` list defines neither term, and the strings "voluntary",
 * "forced", "internal migration" and "international migration" -- the rest of
 * what that Grade 7 row taught -- appear nowhere in the authored body (checked
 * by grep against the finished file; the words in this comment are the guard,
 * not the body). It ADDS reading an origin-destination table in both
 * directions, computing in-migration, out-migration and net migration for
 * every region in it, identifying net sending and net receiving regions from
 * the sign, the whole-table self-check (total arrivals equals total
 * departures; the nets add to zero), and the three-way direction test that
 * decides which offered explanation the data supports. It STOPS SHORT of
 * intervening obstacles and chain migration and of the effects of a flow on
 * origin and destination (row 5.3 `migration-flows-and-their-effects`; the
 * strings "obstacle", "chain", "remittance" and "brain drain" appear nowhere
 * in the body), of the refugee / asylum-seeker / internally-displaced
 * definitions (row 5.4 `refugees-and-displacement`), of computing or comparing
 * densities (row 4.1 `north-america-population-patterns`; the string
 * "density" appears nowhere in the body), of measuring built-up area and
 * urban form (row 4.3 `north-america-metropolitan-regions`), of the
 * stage-numbered demographic transition model (`ap-human-geo-population.ts`),
 * and of every chronology of settlement or of an immigration era
 * (`g8-ss-immigration-industrial.ts`, `g8-ss-westward-expansion.ts`,
 * `ap-apush-*`) -- no date, era or named policy appears anywhere in this file.
 * Three things ARE deliberately allowed, because neighboring rows sit close
 * and the line has to be drawn rather than avoided: (a) two real North
 * American patterns are NAMED in words -- the decades-long movement within the
 * United States from the interior and the Northeast toward the South and the
 * West, and movement out of rural areas toward metropolitan areas -- which
 * accuracy rule 9 allows Unit 4 and which the scope cell asks for by name, but
 * every FIGURE in this file belongs to an invented, described region and no
 * real flow total, population or share appears anywhere; (b) the words "net
 * sending" and "net receiving" are this row's OWN vocabulary even though row
 * 5.3 also uses them, because 5.3 identifies senders and receivers in order to
 * evaluate effects while this row identifies them in order to test
 * explanations, and nothing in this file evaluates an effect on either end;
 * (c) one clause in the first misconception correction observes that a larger
 * region records larger figures on BOTH sides of its account -- that is a
 * warning against reading a departure count as a verdict, and it is not a
 * rate, because no count in this file is ever divided by anything.
 *
 * ACCURACY NOTE: every region carrying a number in this file is invented and
 * every figure was written for the arithmetic. The two real-world patterns
 * named above are named in words only, with no figure attached, and are stated
 * as patterns, never explained by a cause the file then asserts. Immigration
 * to the United States and Canada is handled as the scope cell requires --
 * arrivals from other countries are one more origin line in the same table,
 * counted, subtracted and checked, with no narrative -- and no policy, era,
 * agreement or debate is named at any depth. Sensitivity rules 4, 5 and 8 are
 * load-bearing in this row and are carried in the body, not only here: keyIdea
 * 6 says out loud that a flow table cannot support a sentence about what
 * people are like, the second worked example points at the 4,000 who moved the
 * other way under identical conditions as the proof that a region is not one
 * thing, the second misconception check makes "people from that region are the
 * restless type" the error being corrected, and the recap closes on it. No
 * region, group or person is ranked, characterized or graded anywhere.
 *
 * BURNED SPECIMENS (ruling 36): `los[0].description` is student-facing and
 * carries the scope cell's own concrete examples -- the interior-to-South-and-
 * West shift, rural-to-metropolitan movement, and immigration to the United
 * States and Canada. None of the three items may be answerable from them, so
 * all three are built on fresh invented tables (Merrow/Nye/Ospry, Tarn/Velde,
 * Redmont/Stowe/Tilbury). Do not "helpfully" rewrite an item onto one of the
 * burned examples later.
 *
 * CHECK MOVES: the first worked example uses "rewind the input, then test a
 * contrasting case" -- the table is re-read backwards and then one line is
 * changed so the two net receivers swap places. The second uses "three
 * independent clues of different kinds" -- the net arithmetic, the employment
 * conditions that move in opposite directions at the two ends, and the climate
 * line -- and carries the required arithmetic inversion as well (adding the
 * counterflow back to the net returns the gross flow).
 *
 * DEPTH FLOOR NOTE: read every keyIdea and notice what it is ABOUT. None of
 * them says what migration is, what a push factor is or why people move; every
 * one says what you DO with a table of moves -- add each direction, subtract,
 * check the total, test a reason against the direction, refuse a claim the
 * data cannot carry. The closest any keyIdea comes to the Grade 7 file is the
 * opening clause of keyIdea 4; it survives because the sentence exists to be
 * contradicted by the rest of the keyIdea, which is that sorting is the easy
 * half and the direction test is the row.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped Grade
 * 7 Geography bank the keyed answer was the strictly longest choice 67% of the
 * time, and 94% at difficulty 4; chance with four choices is 25%). The
 * PER-ITEM discipline is the point: every distractor here is a nameable wrong
 * STEP carrying its own figure -- the departures read as the loss, the
 * arrivals read as the gain, one arrival line used and the other dropped, the
 * total of arrivals read as a gain, two of six lines used and four left out, a
 * canceling pair of equal flows read as putting a region ahead, a condition
 * present at both ends, a condition pointing the wrong way, a condition not in
 * the data at all, and a counterflow read as making the question unanswerable.
 * Measured as a diagnostic, not as a score: the key is the strictly longest
 * choice in NONE of the three items, and zero is not the target -- chance
 * alone produces zero or one in a three-item file about 84% of the time, so
 * this number is not evidence that a technique worked, and the real
 * measurement is the 120-item course rate taken at registration, which should
 * land near a quarter. Ruling 16's inverse check was run and the file has NOT
 * flipped the tell: the key is the SECOND-longest of four in all three items,
 * and the gap to the longest choice is 1, 1 and 3 characters -- inside noise,
 * on margins no student could see, so nothing was grown or trimmed to move it.
 * The three keys sit at ids a, b and d -- the set `(4 + 2) mod 4 = 2`
 * requires, omitting c. The numeric choices in item 1 are ordered by the id
 * rule and never by magnitude (-2,000, -9,000, +7,000, -6,000).
 *
 * There are NO MAPS AND NO IMAGES in this course. Every table is written out
 * in prose inside the segment that needs it, and every item is solvable from
 * the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U4_NORTH_AMERICA_MIGRATION_FLOWS: LessonPlan = {
  id: 'evelyn.ms.m8geo.north-america-migration-flows.v1',
  title: 'North America: Migration Flows',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.north-america-migration-flows',
      standard: 'M8GEO-4.2',
      description:
        'Given an origin-destination table of moves between North American regions and a set of conditions in each region, identify net sending and net receiving regions, sort the stated reasons into push and pull, and evaluate which explanation the data supports for the long-running interior-to-South-and-West shift and for rural-to-metropolitan movement; treat immigration to the United States and Canada as flows read from data, never as a story (National Geography Standard 9: the characteristics, distribution and migration of human populations on Earth surface).',
    },
  ],
  prerequisites: ['m8geo.north-america-population-patterns'],
  followUps: ['m8geo.north-america-metropolitan-regions'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show one true direction of a two-direction count producing a false conclusion, before any vocabulary arrives.',
      script:
        'The school office posts a number at the end of the summer: sixty students left the district. That sounds like a school emptying out, and by lunchtime everybody has decided the school is shrinking. Then the second number goes up: eighty-five students arrived. Sixty out and eighty-five in is twenty-five more students than the school started with, so the school that was emptying out is the fullest it has been in years. Nothing about the sixty was untrue. It was half of a subtraction, read as though it were the answer. Every claim anyone makes about people moving -- out of a town, out of a whole region, into a city -- has that same shape and that same trap, and the numbers are bigger. Today you get the table that holds both directions, the subtraction that turns it into an answer, and the test that decides whether a reason somebody offers actually explains the way people went.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-read-the-flows-both-ways',
      kind: 'concept',
      goal: 'Install the routine for reading an origin-destination table both ways, the whole-table self-check, and the three-way test that an offered explanation has to survive.',
      keyIdeas: [
        'A FLOW TABLE IS READ IN TWO DIRECTIONS, AND ONE DIRECTION ON ITS OWN IS NEVER AN ANSWER. An origin-destination table lists moves: each line names the region a group of people left, the region they arrived in, and how many of them there were. Every region therefore appears in two kinds of line. Lines that START at the region are its DEPARTURES, also called out-migration. Lines that END at the region are its ARRIVALS, also called in-migration. Add each kind separately, from the whole table, before you say one word about the region. Calling a region a sender because a large number left it is the first wrong step in this entire subject, and it is the one that survives into grown-up headlines.',
        'NET MIGRATION IS ARRIVALS MINUS DEPARTURES, AND THE SIGN IS THE VERDICT. Subtract the departures from the arrivals for one region over one period. A positive result means the region ended with more people than it started with from moving, and it is a NET RECEIVING region. A negative result, written with a minus sign -- -1,200 people -- means a NET SENDING region. A result of zero means the region traded evenly and gained nobody, which is a real and common outcome, not a missing answer. The word "net" is carrying all the weight here: it means after the counterflow has been taken off. Two regions can send 10,000 people to each other in the same year and neither one is a sender.',
        'THE WHOLE TABLE CHECKS ITSELF, SO USE IT EVERY TIME. Every move in the table is one departure for one region and one arrival for another, so two things have to be true when you are finished. Total arrivals across the table equals total departures across the table. And the net figures of all the regions add to zero, because the people who left somewhere arrived somewhere. If your nets do not add to zero, you dropped a line or counted one twice, and you now know that before your conclusion does. The check costs one addition and it catches the mistake that otherwise travels all the way to the end.',
        'A SORTED LIST OF REASONS IS NOT YET AN EXPLANATION. Sorting is the easy half: a reason that describes the region people left is a push and a reason that describes the region they went to is a pull, so the question to ask of each reason is which region it is about. The hard half, and this row, is testing the sorted reasons against the direction the table actually shows. A candidate explanation survives only if the condition sits at the end of the flow its label claims -- a pull has to sit in the region that GAINED, and a push has to sit in the region that LOST. Until a reason has been held against the arithmetic, it is a guess with a label on it.',
        'THREE WAYS A CANDIDATE EXPLANATION FAILS, AND YOU CHECK FOR ALL THREE. First, the condition is present at BOTH ends: both regions have long winters, both have universities. The statement is perfectly true and it cannot explain why the flow ran one way rather than the other, which makes it the hardest failure to catch. Second, the condition points the WRONG WAY: housing is cheaper in the region that LOST people, so cheap housing cannot be what drew them to the expensive one. Third, the condition is not in the data at all, and you supplied it yourself from what you already believed. Run all three checks on every explanation anybody hands you, including the one you thought of first.',
        'A FLOW TABLE ANSWERS TWO QUESTIONS AND REFUSES A THIRD. It tells you how many people moved and between which regions, and, with the conditions written beside it, which offered explanation fits the direction. It does not tell you what the people who moved are like. A region is many places -- many communities, many languages, many kinds of work and many ways of living -- and a net figure is the balance of thousands of separate household decisions, so no table of moves can support a sentence that begins "people from that region are". There is a time limit on it too: one period of figures supports a claim about that period. Geographers describe a movement within the United States that has run for decades, from the interior and the Northeast toward the South and the West, and a long movement out of rural areas toward metropolitan areas, and a claim of that size rests on many periods of data all pointing the same way, never on one year. Arrivals from other countries are handled exactly like every other line: one more origin, counted, subtracted and checked, with no story attached to it.',
      ],
      vocabulary: [
        {
          term: 'origin-destination table',
          definition:
            'a table in which each line names the region a group of people left, the region they arrived in, and how many moved, so that both directions of every exchange are on the page.',
        },
        {
          term: 'in-migration',
          definition: 'the moves that end in a region, added up: the arrivals side of that region\'s account.',
        },
        {
          term: 'out-migration',
          definition: 'the moves that start in a region, added up: the departures side of that region\'s account.',
        },
        {
          term: 'net migration',
          definition:
            'arrivals minus departures for one region over one period, positive when the region gained people by moving and negative when it lost them.',
        },
        {
          term: 'counterflow',
          definition:
            'the moves running the opposite way between the same two regions, which have to be subtracted before either region can be called a sender or a receiver.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-net-from-a-flow-table',
      kind: 'worked_example',
      problem:
        'Read a one-year flow table both ways, name the net sending and the net receiving regions, and check the table against itself.\n\nThree regions of one country recorded every move between them for a year.\n\n"Adair to Byrne: 9,000. Adair to Corvel: 6,000. Byrne to Adair: 4,000. Byrne to Corvel: 5,000. Corvel to Adair: 2,000. Corvel to Byrne: 3,000."',
      steps: [
        'Add the departures first, which are the lines that START at each region. Adair: 9,000 to Byrne plus 6,000 to Corvel is 15,000 departures. Byrne: 4,000 plus 5,000 is 9,000 departures. Corvel: 2,000 plus 3,000 is 5,000 departures.',
        'Now add the arrivals, which are the lines that END at each region, and take them from the whole table rather than from the lines that happen to be easiest to see. Adair received 4,000 from Byrne and 2,000 from Corvel, which is 6,000 arrivals. Byrne received 9,000 from Adair and 3,000 from Corvel, which is 12,000. Corvel received 6,000 from Adair and 5,000 from Byrne, which is 11,000.',
        'Subtract, region by region, and read the sign. Adair: 6,000 arrivals minus 15,000 departures is -9,000, so Adair is a net sending region. Byrne: 12,000 minus 9,000 is 3,000, so Byrne is a net receiving region. Corvel: 11,000 minus 5,000 is 6,000, so Corvel is net receiving as well, and by twice as much as Byrne.',
        'Run the whole-table check before going one step further. Total departures: 15,000 plus 9,000 plus 5,000 is 29,000. Total arrivals: 6,000 plus 12,000 plus 11,000 is 29,000. They match, so every move has been counted exactly once. Now the nets: -9,000 plus 3,000 plus 6,000 is 0. Everybody who left a region arrived in another one, so zero is the only total the nets are allowed to have.',
        'Read the surprise in the table, because it is the reason for doing the arithmetic at all. The single largest flow anywhere in the table is the 9,000 who went from Adair to Byrne, which makes Byrne look like the big winner of the year. It is not. Byrne also sent 9,000 people out, while Corvel, which never appears in a flow bigger than 6,000, gained twice what Byrne gained. WRONG: "Byrne took in the biggest flow in the table, so Byrne gained the most." CORRECT: "Byrne gained 3,000 and Corvel gained 6,000, because a gain is arrivals minus departures, and Byrne sent 9,000 out while Corvel sent only 5,000."',
        'Rewind the input and read the table backwards to confirm the answer follows from it. Corvel shows up as an origin twice, for 2,000 and for 3,000, which is a small total; it shows up as a destination twice, for 6,000 and for 5,000, which is a much larger one. Small in the origin lines and large in the destination lines is exactly what a net receiver looks like, so the verdict comes from the table rather than from a hunch.',
        'Now change ONE line and run it again, so the result is not memorized as "Corvel wins". Suppose Byrne had sent only 1,000 people to Corvel instead of 5,000, and nothing else changed. Byrne departures become 4,000 plus 1,000, which is 5,000, and its arrivals are still 12,000, so its net is 12,000 minus 5,000, which is 7,000. Corvel arrivals become 6,000 plus 1,000, which is 7,000, against 5,000 departures, so its net is 2,000. Adair does not move at all: still -9,000. Check: -9,000 plus 7,000 plus 2,000 is 0, and total arrivals, 6,000 plus 12,000 plus 7,000, is 25,000, which matches total departures, 15,000 plus 5,000 plus 5,000. Byrne and Corvel have swapped places, and not one person arriving in Byrne changed. A ranking of regions is a balance, not a property of a region.',
      ],
      answer:
        'Adair is the net sending region at -9,000 (6,000 arrivals minus 15,000 departures). Byrne and Corvel are both net receiving, Byrne at 3,000 (12,000 minus 9,000) and Corvel at 6,000 (11,000 minus 5,000). The table checks out: 29,000 total arrivals equals 29,000 total departures, and the three nets add to zero. Byrne took in the largest single flow in the table and still gained half of what Corvel gained, because Byrne sent 9,000 people out. Changing one line -- Byrne to Corvel falling from 5,000 to 1,000 -- makes Byrne the larger gainer, at 7,000 against 2,000.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-which-explanation-the-data-supports',
      kind: 'worked_example',
      problem:
        'A newspaper offers three explanations for a flow. Test each one against the table and say which the data supports.\n\n"Over one year, 12,000 people moved from Region Dunmere to Region Selby, and 4,000 moved from Selby to Dunmere.\n\nDunmere: farm work has become more mechanized and the number of farm jobs has fallen for six years running. Winters are long and cold. Housing costs are among the lowest in the country. There are two universities.\n\nSelby: warehouses and hospitals opened recently and are hiring. Winters are mild. Housing costs are high and rising. There are two universities."\n\nThe three explanations offered: one, people moved for cheaper housing; two, people moved because of the universities; three, lost farm work pushed people out of Dunmere and new warehouse and hospital jobs pulled them into Selby.',
      steps: [
        'Settle the direction before reading a single reason, because a reason is only testable once you know which way the people went. Selby: 12,000 arrivals minus 4,000 departures is 8,000, so Selby is the net receiving region. Dunmere: 4,000 minus 12,000 is -8,000, so Dunmere is the net sending region. Check the pair: 8,000 plus -8,000 is 0. And invert the subtraction to be sure of it: add the counterflow back, 8,000 plus 4,000, and the 12,000 who left Dunmere for Selby comes straight back.',
        'Test explanation one against the direction. Cheaper housing is a pull, and a pull has to sit in the region that GAINED. Housing is cheapest in Dunmere, which lost 8,000 people, and it is high and rising in the region they moved to. The condition points the wrong way, so the data does not support the explanation. WRONG: "Housing is cheaper in Dunmere, so people moved for cheaper housing." CORRECT: "The people who moved went from the cheaper region to the more expensive one, so cheap housing cannot be what drew them."',
        'Test explanation two. Two universities in Dunmere, two universities in Selby. The condition is present at both ends, identical on the side people left and on the side they arrived at, so it cannot account for a flow that ran one way. It is a true statement that explains nothing about this table, and it is the failure that is hardest to catch, because there is nothing false in the sentence to notice.',
        'Test explanation three, one half at a time. Farm jobs falling for six years running describes Dunmere, the region people left, so it is a push and it sits at the correct end. Warehouses and hospitals hiring describes Selby, the region people arrived in, so it is a pull and it also sits at the correct end. Both halves point the way the 8,000 actually went, so this is the explanation the data supports.',
        'Now put the verdict on three clues of different kinds rather than on one. The arithmetic is the first kind: a net of 8,000 toward Selby, with the 4,000-person counterflow already subtracted out of it. The employment conditions are a second kind, and they are the only pair in the data that moves in opposite directions at the two ends -- work disappearing where people left, work appearing where they arrived. The climate line is a third and independent kind: mild winters describe Selby, the region that gained, so that condition at least points the right way, while the housing line points backwards and the university line is flat. One agreeing number is a hunch; three clues of different kinds, all pointing the same way, is evidence.',
        'Say the limit out loud, because the table cannot carry more than this. The data supports the third explanation and rules out the first two, for this year and this pair of regions. It does not show that each of the 12,000 people moved for work. Four thousand people moved the OTHER way under exactly the same stated conditions, which is the clearest possible sign that a region is not one thing and the people in it are not one kind of person. A net figure is a balance struck between thousands of separate decisions, and it never describes the people who made them.',
        'The same test runs on the patterns that matter most in North America: the movement within the United States that has run for decades from the interior and the Northeast toward the South and the West, and the movement out of rural areas toward metropolitan areas. Nothing about the test changes when the regions are real ones. What changes is how much data a claim of that size needs -- one year of figures can support a claim about one year, and a claim about decades needs many years of figures all pointing the same way.',
      ],
      answer:
        'The flow runs toward Selby: 12,000 minus 4,000 is a net of 8,000, and Dunmere is -8,000, which checks because 8,000 plus 4,000 returns the 12,000 gross flow. Cheaper housing fails the direction test, since housing is cheapest in the region people left. The universities fail because both regions have two, so the condition is identical at each end. The third explanation survives: falling farm work sits in the region people left, new warehouse and hospital hiring sits in the region they arrived in, and mild winters in Selby point the same way. The data supports it for this year and this pair of regions, and the 4,000 who moved the other way show that a net figure is a balance, not a statement about what a region\'s people are like.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-net-migration-figure',
      kind: 'try_yourself',
      problem:
        'Three regions recorded every move between them for one year.\n\n"Merrow to Nye: 7,000. Merrow to Ospry: 2,000. Nye to Merrow: 3,000. Nye to Ospry: 1,000. Ospry to Merrow: 4,000. Ospry to Nye: 6,000."\n\nWhat was Merrow\'s net migration for the year?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '-2,000 people: 7,000 arrivals against 9,000 departures, so Merrow ends the year behind', correct: true },
        { id: 'b', text: '-9,000 people: the 9,000 departures Merrow recorded, which is what the region lost' },
        { id: 'c', text: '+7,000 people: the 7,000 arrivals Merrow recorded, which is what the region gained' },
        { id: 'd', text: '-6,000 people: the 3,000 arrivals from Nye against the 9,000 departures Merrow recorded' },
      ],
      expectedAnswer: '-2,000 people: 7,000 arrivals against 9,000 departures, so Merrow ends the year behind',
      hints: [
        'A region shows up in this table in two kinds of line: the ones that start at it and the ones that end at it. Add each kind separately, from the whole table, before subtracting anything.',
        'Two of the six lines end at Merrow and two start at it, so a figure built from one line on either side has left a move out, and a figure built from one side only has left a whole direction out. Check yourself on the table as a whole: the three nets have to add to zero, because every departure is somebody else\'s arrival.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-which-explanation',
      kind: 'try_yourself',
      problem:
        '"Over one year, 5,000 people moved from Region Tarn to Region Velde, and 8,000 moved from Velde to Tarn.\n\nTarn: a hospital and a distribution center opened recently and are both hiring. Winters are long and cold. Housing costs about the same as in Velde.\n\nVelde: the mill that was the largest employer cut most of its workforce. Winters are long and cold. Housing costs about the same as in Tarn."\n\nWhich explanation does the data support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The long cold winters in Velde pushed people out, since a hard climate is a reason to leave the region a person lives in' },
        { id: 'b', text: 'Lost mill work in Velde pushed people out and new jobs in Tarn pulled them in, which is the direction the net of 3,000 runs', correct: true },
        { id: 'c', text: 'Cheaper housing in Tarn pulled people out of Velde, since a lower cost of living is a reason to choose a new region' },
        { id: 'd', text: 'Neither region can be called the receiver, because people moved in both directions and the two flows work against each other' },
      ],
      expectedAnswer: 'Lost mill work in Velde pushed people out and new jobs in Tarn pulled them in, which is the direction the net of 3,000 runs',
      hints: [
        'Work out the net first: one flow is 8,000 and the other is 5,000, so one region ended the year ahead by the difference. An explanation can only be tested once you know which way the people actually went.',
        'Put each offered reason through three checks. Is the condition present at BOTH ends, so that it cannot account for a one-way flow? Does it sit at the wrong end for the label it has been given? Is it in the data at all, or did somebody supply it? A counterflow, meanwhile, is not a reason to give up on the question -- subtracting it is the whole job.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-only-net-receiver',
      kind: 'try_yourself',
      problem:
        'Three regions recorded every move between them for one year.\n\n"Redmont to Stowe: 10,000. Redmont to Tilbury: 5,000. Stowe to Redmont: 10,000. Stowe to Tilbury: 2,000. Tilbury to Redmont: 1,000. Tilbury to Stowe: 2,000."\n\nWhich region is the only net receiving region for the year?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Stowe, at 12,000 arrivals, which is the largest number of arrivals any of the three regions recorded' },
        { id: 'b', text: 'Stowe, at a gain of 8,000: the 10,000 who arrived from Redmont, less the 2,000 who left Stowe for Tilbury' },
        { id: 'c', text: 'Redmont, because its 10,000 departures to Stowe came back as 10,000 arrivals from Stowe, and 1,000 more arrived' },
        { id: 'd', text: 'Tilbury, at a net gain of 4,000: 7,000 people arrived there and only 3,000 left, the one region ending ahead', correct: true },
      ],
      expectedAnswer: 'Tilbury, at a net gain of 4,000: 7,000 people arrived there and only 3,000 left, the one region ending ahead',
      hints: [
        'Add each region\'s arrivals and each region\'s departures separately, then subtract. The largest single flow in this table and the largest total of arrivals both belong to regions that also sent a great many people out.',
        'One of the three regions trades exactly evenly and lands on zero, which is neither sending nor receiving; your three nets have to add to zero, so use that to find it. A figure built from two of the six lines has left four lines out, and a total of arrivals on its own was never a gain.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-departures-as-loss-and-flows-as-character',
      kind: 'misconception_check',
      question:
        'A student is handed two regions\' totals for one year -- "Hale: 9,000 people moved in, 6,000 moved out. Ivor: 3,000 moved in, 2,000 moved out." -- and writes: "Hale lost 6,000 people, and three times as many left Hale as left Ivor, so Hale is emptying out fastest." Asked why it is emptying out, the student adds: "People from Hale are just the restless type." What is wrong with each sentence?',
      commonErrors: [
        {
          answer: 'Hale lost 6,000 people, and three times as many left Hale as left Ivor, so Hale is emptying out fastest.',
          misconception:
            'Reading the departures as if they were the whole account, so a count of people leaving is treated as the change in the region. The arrivals are sitting right beside the departures and never get subtracted from them.',
          correctsTo:
            'Net migration is arrivals minus departures, so do the subtraction for both regions. Hale: 9,000 minus 6,000 is 3,000, a net GAIN of 3,000; check by adding the departures back, 3,000 plus 6,000, which returns the 9,000 who arrived. Ivor: 3,000 minus 2,000 is 1,000, a net gain of 1,000; check, 1,000 plus 2,000 returns the 3,000 who arrived. Neither region is emptying out, and the one the student called the fastest-emptying is the one that grew the most. WRONG: "Six thousand left Hale, so Hale lost 6,000." CORRECT: "Hale gained 3,000, because 9,000 arrived and 6,000 left." The 6,000 is a true number being asked to do a job it cannot do: it is one direction of a two-direction account. And a larger region will record larger figures on BOTH sides, which is a second reason a departure count on its own settles nothing.',
        },
        {
          answer: 'People from Hale are just the restless type.',
          misconception:
            'Turning a count of moves into a description of a kind of person. The table records how many people moved and in which direction; the student has read it as though it also reported a shared temperament, and has then used that invented trait as the explanation.',
          correctsTo:
            'No flow table can support a sentence about what people are like, and neither can any other table in this course. Hale is a region, which means many communities, many kinds of work, many languages and many ways of living, and the figures say exactly this much: 9,000 people arrived, 6,000 left, and the balance is a gain of 3,000. Those 15,000 moves were 15,000 separate household decisions, and 9,000 of them were decisions to move IN, which by itself breaks the sentence. WRONG: "People from Hale are just the restless type." CORRECT: "Hale recorded 6,000 departures and 9,000 arrivals; to explain either figure, find the conditions the data states at each end and test them against the direction people actually moved." An explanation names conditions, never characters.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A flow table is read in two directions. Lines that start at a region are its departures; lines that end at it are its arrivals. Add each kind separately before saying anything about the region.',
        'Net migration is arrivals minus departures. Positive is net receiving, negative is net sending, and zero means the region traded evenly and gained nobody.',
        'Check the whole table every time: total arrivals equals total departures, and the nets of all the regions add to zero, because every departure is somebody else\'s arrival.',
        'The largest single flow into a region does not make it the biggest gainer. What the region sent out comes off first, and that is what "net" means.',
        'Sorting reasons into push and pull is the easy half. An explanation has to be held against the direction the table shows.',
        'Three ways an explanation fails: the condition is present at both ends, the condition points the wrong way, or the condition is not in the data at all.',
        'A flow table counts moves. It never says what the people who moved are like, and one period of figures supports a claim about that period only.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '4', cedTopic: '4.2', cedTitle: 'North America: Migration Flows' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
