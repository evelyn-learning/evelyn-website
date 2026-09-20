/**
 * Grade 8 World Geography — Population & Migration at Scale: Population
 * Pyramids & Dependency.
 *
 * PROCEDURE-LED row 5.1 (National Geography Standard 9), shaped on the
 * procedure-led exemplar `m8geo-u1-counts-rates-and-fair-comparison.ts`: the
 * concept segment is a short ordered routine over described percentages rather
 * than a mental model, the first worked example runs the routine straight
 * through, the second repairs a wrong denominator and then splits the result
 * open, and each worked example ends with an arithmetic inversion AND a
 * one-input contrasting case. Two traps this plan is built to kill: dividing
 * the dependent bands by the whole population instead of by the working-age
 * band, and reading two equal ratios as two equal situations.
 *
 * THE ROUTINE, in the order it is always run:
 *   1. Check the three bands add to 100.
 *   2. Add the under-15 band and the 65-and-over band -- that is the numerator.
 *   3. Divide by the working-age band and multiply by 100.
 *   4. Invert: ratio times the working-age band divided by 100 gives the
 *      dependent total back, and dependents plus working-age gives 100 back.
 *   Then split the numerator into its youth part and its old-age part, name
 *   the shape from the two outer bands, and change ONE band and run it again.
 *
 * SCOPE GUARD: this row ASSUMES, in one clause where it is used, that an age
 * structure sorts a population into the three bands under 15, 15 to 64, and 65
 * or older, and that the resulting structure can be described in words rather
 * than drawn (Grade 7, `m7geo-u3-population-growth-and-structure.ts`), and it
 * re-teaches neither: no keyIdea's job is to define an age structure -- keyIdea
 * 1 names the three bands in its opening clause as the premise and goes
 * straight to the division, and the vocabulary defines the bands only by the
 * role each one plays in that division (numerator, denominator), never as a
 * fact about populations. The Grade
 * 7 natural-increase mechanism is NOT used anywhere in this row -- the words
 * "births", "deaths" and "moves" occur only in the single sentence of keyIdea 6
 * (echoed in the recap and in worked example 1) that states what this routine
 * deliberately does NOT do. It ADDS computing the dependency ratio with the
 * working-age band as the denominator, splitting that ratio into a youth part
 * and an old-age part that add back to the whole, assigning the shape
 * (wide-based, column-shaped, top-heavy) by a stated numeric rule applied to
 * the two outer bands, showing that shape and ratio move independently of each
 * other, and quantifying the ten-year provision from the 5-to-14 slice that
 * crosses the working-age line. It names NO stage of the demographic
 * transition model; the words "stage" and "transition" appear nowhere in the
 * authored body, only in this guard (`ap-human-geo-population.ts`). Every
 * absence claim below is likewise scoped to the authored body, since this
 * guard and the chain loIds necessarily name the neighboring rows. It does NOT
 * estimate doubling time, use the rule of 70, or evaluate a projection against
 * its assumptions (row
 * 5.2, `m8geo.evaluating-population-projections`); it does NOT read a flow
 * table, sort push from pull, or name an intervening obstacle (row 5.3,
 * `m8geo.migration-flows-and-their-effects`); it does NOT classify a refugee,
 * an asylum seeker or an internally displaced person (row 5.4); and it applies
 * NO survival rate, fertility rate or cohort-component method, which is why no
 * future ratio is ever computed in this file.
 *
 * Three things ARE deliberately allowed, because neighbors sit close and the
 * line has to be drawn rather than avoided:
 * (a) A WRONG-DENOMINATOR repair is the spine of worked example 2 even though
 *     row 1.1 (`counts-rates-and-fair-comparison`) owns choosing a denominator.
 *     The difference is that nothing in this file reads a claim to CHOOSE a
 *     denominator: the ratio's definition fixes the denominator in advance, and
 *     the only question asked here is whether the student used the fixed one.
 * (b) The three shape words are used, although Grade 7 also names them, because
 *     here they are ASSIGNED from percentages by a stated rule (one outer band
 *     at least twice the other) and then used to say which dependent band the
 *     numerator sits in. No sentence in this file explains what a population
 *     pyramid looks like.
 * (c) One ten-year statement per worked example, quantified from the 5-to-14
 *     slice. It names who crosses the line and what must therefore be provided;
 *     it stops before any recomputed future ratio, which would be row 5.2's
 *     work and would need assumptions this routine does not make.
 *
 * The curriculum cell for this row carries all three parts -- positive
 * statement, lineage clause, withheld clause -- so nothing is missing from it.
 * Per ruling 32, the only concrete things part (i) names, and which are
 * therefore burned for items, are the three shape words, the ratio's own
 * recipe, and the provision list "schools, jobs, care for older people"; no
 * item here is answerable from the objective, because every item turns on
 * numbers the objective does not contain.
 *
 * DEPTH FLOOR NOTE FOR THE FAN-OUT: the Grade 7 file on this subject already
 * names the three bands, the words wide-based and top-heavy, and the
 * schools-versus-pensions consequence. That makes this row the easiest in the
 * unit to write below the floor. The test used here: every keyIdea was read
 * next to the Grade 7 keyIdeas, and the closest pair was keyIdea 3 here
 * ("name the shape from the two outer bands") against Grade 7's "a wide base
 * means a large share of people are children". KeyIdea 3 survived only after it
 * was rewritten to carry a numeric assignment rule and to end on the
 * shape-does-not-fix-the-ratio point, neither of which Grade 7 has; as first
 * drafted it defined the shapes and it was below the floor.
 *
 * ACCURACY NOTE: every country in this file is invented and every percentage
 * was written for the arithmetic. No real country, birth rate, death rate or
 * age structure appears anywhere. The only claims about the real world are the
 * standard definition of the dependency ratio and its age lines, the standard
 * youth and old-age split of it, and the fact that a population pyramid is the
 * usual graph of an age structure; all three are in the claim ledger. A
 * dependency ratio is a measurement of a structure, never a score for a place
 * or for the people in it, and the file says so in keyIdea 1, in the
 * misconception check and in the recap.
 *
 * ANSWER-CUE NOTE: written against deferred finding DF-3 (in the shipped Grade
 * 7 Geography bank the keyed answer was the strictly longest choice 67 percent
 * of the time, and 94 percent at difficulty 4; chance with four choices is 25
 * percent). Every distractor here is a nameable wrong STEP carrying its own
 * figure or criterion -- the dependent total divided by the whole population,
 * only one of the two outer bands on top, the structure named after the SMALLER
 * outer band, the shape read off the SIZE of the dependent group, the shape
 * declared unnameable without a drawing, the whole under-15 band counted as
 * crossing the line, the under-5 slice counted instead of the 5-to-14 slice,
 * the people leaving the band counted instead of the people entering it -- and
 * no key was built to be the longest choice BECAUSE it is the key. Measured as
 * a diagnostic and not as a score: the key is the strictly longest choice in
 * ONE of the three items (item 3, by 2 characters over the next longest, a
 * margin of under 2 percent and well inside the noise ruling 16 describes; it
 * was left alone deliberately). Zero is NOT the target; chance alone produces
 * zero or one in a three-item file about
 * 84 percent of the time, and the real measurement is the course-level rate
 * across all 40 files at registration. The three keys sit at ids b, d and a,
 * which is the id set `(5 + 1) mod 4 = 2` requires, omitting c. The four
 * numeric choices in item 1 share one unit clause and are ordered by the id
 * rule, never by magnitude.
 *
 * There are NO MAPS AND NO IMAGES in this course. A population pyramid is a
 * graph, and no student here is looking at one: every age structure is written
 * out as three percentages inside the item that needs it, and every item is
 * solvable from the words printed inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M8GEO_U5_POPULATION_PYRAMIDS_AND_DEPENDENCY: LessonPlan = {
  id: 'evelyn.ms.m8geo.population-pyramids-and-dependency.v1',
  title: 'Population Pyramids & Dependency',
  curriculum: 'MS',
  grade: '8',
  subject: 'social-studies',
  topic: 'grade-8-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm8geo.population-pyramids-and-dependency',
      standard: 'M8GEO-5.1',
      description:
        'Given an age structure as percentages in age bands for a country, describe whether the pyramid is wide-based, column-shaped or top-heavy, compute a dependency ratio (under-15 plus over-64 per 100 working-age people), and predict what the place must provide in ten years such as schools, jobs and care for older people (National Geography Standard 9: the characteristics, distribution and migration of human populations on Earth surface).',
    },
  ],
  prerequisites: ['m8geo.north-america-economic-regions-and-trade'],
  followUps: ['m8geo.evaluating-population-projections'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Put two places with an identical headline figure and opposite building projects side by side, so the need to open the figure up arrives before the recipe does.',
      script:
        'Two countries report the same line on the same form: 100 dependents for every 100 working-age people. Identical figure. Now look at what each one is actually building. Tolmarch is putting up classrooms as fast as it can pour concrete, and its elementary schools are running two shifts a day. Havren has closed three elementary schools in ten years and cannot hire nurses and home-care workers fast enough. Same number, opposite construction sites. That number is a dependency ratio, and it is easy to read wrong in two different ways at the same time: people read it as the share of a country that does not work, which it is not, and they read two equal ratios as two equal situations, which they are not either. Today you compute it properly, you split it open to see what it is made of, and you use what is inside it to say what a place has to have ready in ten years.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-the-ratio-and-its-parts',
      kind: 'concept',
      goal: 'Install the four-step ratio routine, the rule that fixes the denominator, the numeric rule for assigning the shape, the split of the numerator, and the ten-year crossing slice.',
      keyIdeas: [
        'THE DENOMINATOR IS THE WORKING-AGE BAND, NEVER THE WHOLE POPULATION. An age structure sorts a population into three bands -- under 15, 15 to 64, and 65 or older -- so the dependency ratio has one fixed recipe: add the two outer bands, divide by the middle band, multiply by 100, and read the answer as dependents for every 100 working-age people. The step that goes wrong most often is the division. Dividing by the whole population instead gives the SHARE of the population that falls outside the two age lines, which is a true figure answering a different question, and it is always the smaller of the two, because the working-age band is smaller than the whole population whenever anybody is a dependent. One country, two numbers, and they are not interchangeable: half dependents and half working-age is 50 percent dependent as a share, and 100 dependents per 100 working-age people as a ratio. And DEPENDENT here is a bookkeeping label set by two age lines and nothing else. It does not say that nobody under 15 or over 64 works, it does not say that anybody is a burden, and the ratio measures a structure, never the people standing inside it.',
        'THE ROUTINE, IN ORDER. One: check that the three bands add to 100, because a structure that does not add to 100 has a band missing or a digit wrong, and every later step inherits the error. Two: add the under-15 band and the 65-and-over band to get the numerator. Three: divide that by the working-age band and multiply by 100. Four: invert, twice. Multiply the ratio by the working-age band and divide by 100, and the dependent total has to come back; then add the dependent total to the working-age band, and 100 has to come back. If either check fails, the division went the wrong way round or a band was dropped on the way in.',
        'NAME THE SHAPE FROM THE TWO OUTER BANDS, NOT FROM THE MIDDLE ONE. The shape is a one-word summary of WHERE the numerator sits, and you assign it by setting the two dependent bands against each other. If one of them is at least twice the size of the other, the structure takes its name from the bigger one: WIDE-BASED when that is the under-15 band, TOP-HEAVY when it is the 65-and-over band. When the two outer bands are closer together than that, the structure is COLUMN-SHAPED -- 25 under 15, 50 working-age and 25 aged 65 or older is a column, because its two outer bands are the same size. Now notice what the shape is not. The shape compares the outer bands with each other; the ratio compares them with the middle band. So the shape does not fix the ratio and the ratio does not fix the shape, and you will see both halves of that in this lesson: a structure whose shape stays put while its ratio moves by 50, and a pair of structures with the same ratio and opposite shapes.',
        'A RATIO OF 100 MADE OF CHILDREN AND A RATIO OF 100 MADE OF OLDER ADULTS ARE NOT THE SAME SITUATION, SO SPLIT THE NUMERATOR. Run the same division twice more: once with only the under-15 band on top, which gives the YOUTH part, and once with only the 65-and-over band on top, which gives the OLD-AGE part. The two parts add back to the whole ratio, which is also a check on your arithmetic. A country at 45 under 15, 50 working-age and 5 aged 65 or older splits into 90 and 10. A country at 15 under 15, 50 working-age and 35 aged 65 or older splits into 30 and 70. Both of them report 100 dependents per 100 working-age people, and the two of them need opposite things built. The ratio tells you HOW MUCH; the split tells you WHAT OF; and a report that hands you only the ratio has handed you half of it.',
        'MOVING ONE BAND MOVES BOTH SIDES OF THE RATIO AT ONCE, WHICH IS WHY IT JUMPS. The three bands have to add to 100, so no band can grow without another one shrinking, and that is not a technicality -- it is the reason this figure moves so fast. Take ten of every 100 people out of the working-age band and put them in the 65-and-over band: the numerator gains ten and the denominator loses ten at the same moment, so 50 over 50 becomes 60 over 40, and the ratio goes from 100 to 150. Ten points of structure, fifty points of ratio. Hold on to that before you read anyone describing a ten-point shift as a small one.',
        'TO SAY WHAT A PLACE MUST PROVIDE IN TEN YEARS, FIND THE PEOPLE WHO CROSS A LINE IN TEN YEARS. The under-15 band does not arrive all at once. Only the people who are already 5 or older today are 15 or older ten years from now, so it is the 5-to-14 slice, not the whole band, that has to be met with work or training places within ten years, while the under-5 slice is still in a classroom at the end of that decade. Read the other end the same way: the 65-and-over band is the care, the clinics and the pensions that have to be ready now, not later. One warning that keeps this honest. Naming who crosses a line is a statement about which way the pressure runs; it is not a forecast of what the ratio will be, because births, deaths and moves all change the bands, and this routine assumes none of them.',
      ],
      vocabulary: [
        {
          term: 'dependency ratio',
          definition:
            'the under-15 band plus the 65-and-over band, divided by the working-age band and multiplied by 100, read as the number of dependents for every 100 working-age people.',
        },
        {
          term: 'working-age band',
          definition:
            'the share of a population between the two age lines the ratio uses, 15 and 64, which serves as the denominator of the ratio and as nothing else.',
        },
        {
          term: 'dependent bands',
          definition:
            'the two bands outside those age lines, under 15 and 65 or older, added together to form the numerator, whatever anybody in them actually does.',
        },
        {
          term: 'youth part of the ratio',
          definition:
            'the same division run with only the under-15 band on top, which says how much of the ratio comes from children.',
        },
        {
          term: 'old-age part of the ratio',
          definition:
            'the same division run with only the 65-and-over band on top, which adds to the youth part to give the whole ratio back.',
        },
        {
          term: 'column-shaped',
          definition:
            'an age structure whose two outer bands are close enough in size that neither is twice the other, so the structure is named after neither end.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-run-the-routine',
      kind: 'worked_example',
      problem:
        'Run the routine straight through, name the shape, and say what the place has to have ready in ten years.\n\n"Tolmarch: of every 100 people, 45 are under 15, 50 are 15 to 64, and 5 are 65 or older. Of the 45 who are under 15, 30 are aged 5 to 14 and 15 are under 5."',
      steps: [
        'Step one: check the bands. 45 plus 50 plus 5 is 100. Nothing is missing, so the structure can be worked. Check the slice too: 30 plus 15 is 45, which is the whole under-15 band.',
        'Step two: build the numerator. The dependent bands are the under-15 band and the 65-and-over band: 45 plus 5 is 50 dependents for every 100 people.',
        'Step three: divide by the working-age band and scale. 50 divided by 50 is 1, and 1 times 100 is 100. Tolmarch has 100 dependents for every 100 working-age people. WRONG: "50 dependents out of 100 people, so the ratio is 50 per 100." CORRECT: "50 dependents divided by the 50 people in the working-age band is 100 per 100 -- dividing by the whole population answers a different question, which is what share of the country falls outside the two age lines, and that share is 50 percent."',
        'Step four: invert, twice. 100 times 50 divided by 100 is 50, which is the dependent total back again. And 50 dependents plus 50 working-age is 100, which is the whole structure back again. The arithmetic closes.',
        'Now split the numerator, because 100 on its own does not say what to build. Youth part: 45 divided by 50 is 0.9, and 0.9 times 100 is 90. Old-age part: 5 divided by 50 is 0.1, and 0.1 times 100 is 10. Check the split: 90 plus 10 is 100, which is the whole ratio. Ninety of Tolmarch\'s 100 points of dependency are children.',
        'Name the shape from the two outer bands. The under-15 band is 45 and the 65-and-over band is 5, and 45 is nine times 5, which is far past twice, so the structure is WIDE-BASED. The middle band played no part in that decision.',
        'Say what has to be ready in ten years, and use the slice rather than the band. The 45 under 15 are in classrooms now, so classrooms and teachers are the present bill. Within ten years the 30 people per 100 who are aged 5 to 14 today will be 15 to 24, so Tolmarch needs work or training places for 30 of every 100 people it has today, on top of the 50 already in the working-age band. The 15 per 100 who are under 5 are still in school at the end of that decade. This says which way the pressure runs and does not forecast the ratio itself, because births, deaths and moves all change the bands and this routine assumes none of them.',
        'Rewind the input and read it backwards to confirm the verdict follows from the data. Nine times as many children as older adults, a dependent group that is exactly as large as the working-age group, and two-thirds of that dependent group already old enough to cross the working-age line within the decade. Wide-based, 100 per 100, and a jobs-and-training bill arriving in ten years. Every piece of that came off the three percentages.',
        'Now change ONE band and run it again. In an age structure the bands must add to 100, so moving one band moves another: take ten of every 100 people out of the working-age band and put them in the 65-and-over band, giving 45 under 15, 40 working-age and 15 aged 65 or older. Check: 45 plus 40 plus 15 is 100. Numerator: 45 plus 15 is 60. 60 divided by 40 is 1.5, and 1.5 times 100 is 150. Invert: 150 times 40 divided by 100 is 60, and 60 plus 40 is 100. The ratio moved from 100 to 150 on a ten-point change, because the ten points left the denominator and joined the numerator in the same move. And the shape did not move at all: 45 is three times 15, so the structure is still wide-based. Same shape, a ratio 50 points higher -- the shape and the ratio are answering different questions.',
      ],
      answer:
        'Tolmarch has 100 dependents for every 100 working-age people: 45 plus 5 is 50 dependents, and 50 divided by 50 times 100 is 100. The inversions close, since 100 times 50 divided by 100 is 50 and 50 plus 50 is 100. The split is 90 youth and 10 old-age, which add back to 100, so the dependency is almost entirely children, and the two outer bands, 45 against 5, make the structure wide-based. Tolmarch needs classrooms now and work or training places within ten years for the 30 people per 100 who are aged 5 to 14 today. Moving ten points from the working-age band into the 65-and-over band leaves the shape wide-based but takes the ratio from 100 to 150, because those ten points leave the denominator and join the numerator at once.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-repair-and-split',
      kind: 'worked_example',
      problem:
        'A student ran the routine on a second country and then drew a conclusion from the two ratios. Find the slip, repair it, say what the wrong number was actually measuring, and test the conclusion.\n\n"Havren: of every 100 people, 15 are under 15, 50 are 15 to 64, and 35 are 65 or older. Of the 15 who are under 15, 10 are aged 5 to 14 and 5 are under 5."\n\nThe student wrote: "Havren has 15 plus 35, which is 50 dependents out of 100 people, so the ratio is 50 per 100. Tolmarch came out at 100 per 100. Tolmarch therefore carries twice the load, and the two countries need the same kind of building program, only Tolmarch needs more of it."',
      steps: [
        'Check the bands before anything else. 15 plus 50 plus 35 is 100, and the slice checks too, since 10 plus 5 is 15. The data is sound, so the slip is in the handling.',
        'Check the numerator. 15 plus 35 is 50, and that part is right: the student added the two outer bands correctly.',
        'Find the slip in the denominator. The student divided 50 by 100, the whole population. The ratio is dependents for every 100 WORKING-AGE people, so the denominator is the middle band: 50 divided by 50 is 1, and 1 times 100 is 100 dependents per 100 working-age people. WRONG: "50 dependents out of 100 people, so the ratio is 50 per 100." CORRECT: "50 dependents divided by the 50 working-age people is a ratio of 100 per 100; 50 out of the whole 100 is the dependent SHARE, which is 50 percent."',
        'Say what the student\'s number actually was, because it was not nonsense. Fifty percent is the share of Havren that falls outside the two age lines, and it is true. It just cannot be compared with a figure that was divided by something else. That is the whole reason the wrong denominator is dangerous here: it does not produce an absurd number, it produces a believable one.',
        'Invert to confirm the repair. 100 times 50 divided by 100 is 50 dependents, and 50 plus 50 is 100. Both checks return, so the repaired ratio is right.',
        'Now test the conclusion, which was the bigger error. Havren is 100 per 100 and Tolmarch is 100 per 100. The ratios are not double and half -- they are identical. So split both. Havren youth part: 15 divided by 50 is 0.3, times 100 is 30. Havren old-age part: 35 divided by 50 is 0.7, times 100 is 70. Check: 30 plus 70 is 100. Tolmarch split 90 youth and 10 old-age. Same total, mirrored insides.',
        'Name each shape from the two outer bands. Havren: 35 against 15, and 35 is more than twice 15, so Havren is TOP-HEAVY. Tolmarch: 45 against 5, so Tolmarch is wide-based. WRONG: "Equal ratios mean the same building program, just scaled." CORRECT: "Equal ratios, opposite shapes: 70 of Havren\'s 100 points are people aged 65 or older, and 90 of Tolmarch\'s 100 points are children, so one country is building clinics, home care and pension capacity while the other is building classrooms."',
        'Finish with the ten-year line for Havren, from the slice. Ten people per 100 are aged 5 to 14 today, so 10 per 100 cross into the working-age band within ten years, against 30 per 100 in Tolmarch. Havren is not about to be handed a wave of new workers, and its 35 per 100 aged 65 or older are the provision it has to have ready now. Again, which way the pressure runs -- not a forecast of the ratio.',
        'Change ONE thing and run it again, and this time change the insides rather than the total. Suppose Havren\'s two outer bands were swapped: 35 under 15, 50 working-age, 15 aged 65 or older. Check: 35 plus 50 plus 15 is 100. Numerator: 35 plus 15 is 50. 50 divided by 50 times 100 is 100 -- the ratio did not move at all. But the split is now 70 youth and 30 old-age, which still adds to 100, and 35 is more than twice 15, so the shape has flipped to wide-based. In worked example 1 the shape held still while the ratio jumped 50 points; here the ratio holds still while the shape flips. Neither one is a substitute for the other, which is why the routine reports all three: the ratio, the split and the shape.',
      ],
      answer:
        'The numerator was right and the denominator was wrong. Dependents are divided by the working-age band, not by the whole population: 50 divided by 50 times 100 is 100 dependents per 100 working-age people, and the inversions close, since 100 times 50 divided by 100 is 50 and 50 plus 50 is 100. The student\'s 50 was the dependent share, 50 percent, which is true and answers a different question. The conclusion fails too: Havren and Tolmarch both come out at 100, so neither carries twice the other. Splitting them shows why they still need opposite things -- Havren is 30 youth and 70 old-age and its two outer bands, 35 against 15, make it top-heavy, while Tolmarch is 90 youth and 10 old-age and wide-based. Only 10 people per 100 cross into Havren\'s working-age band within ten years, against 30 in Tolmarch. Swapping Havren\'s outer bands leaves the ratio at 100 and flips the shape to wide-based.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-compute-the-ratio',
      kind: 'try_yourself',
      problem:
        '"Norlan: of every 100 people, 48 are under 15, 40 are 15 to 64, and 12 are 65 or older." What is Norlan\'s dependency ratio?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '60 dependents for every 100 working-age people' },
        { id: 'b', text: '150 dependents for every 100 working-age people', correct: true },
        { id: 'c', text: '30 dependents for every 100 working-age people' },
        { id: 'd', text: '120 dependents for every 100 working-age people' },
      ],
      expectedAnswer: '150 dependents for every 100 working-age people',
      hints: [
        'Add the two outer bands first, then look hard at what you are about to divide by. The ratio is counted for every 100 working-age people, so the working-age band is the denominator.',
        'Multiply your answer by 40 and divide by 100; the dependent total has to come back, and that total plus 40 has to come back to 100. Dividing by the whole 100 people, or putting only the under-15 band on top, or putting only the 65-and-over band on top, each produce a number that fails one of those two checks.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-same-ratio-different-shape',
      kind: 'try_yourself',
      problem:
        '"Tirreth: of every 100 people, 12 are under 15, 50 are 15 to 64, and 38 are 65 or older." "Sarnow: of every 100 people, 40 are under 15, 50 are 15 to 64, and 10 are 65 or older." Both countries work out to 100 dependents for every 100 working-age people. Which statement does the data support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Sarnow is top-heavy and Tirreth is wide-based, because a structure is named after the outer band that is smaller, the one the country has least of' },
        { id: 'b', text: 'Both are top-heavy, because 50 of every 100 people in each country fall outside the working-age band, and that load is what makes a structure top-heavy' },
        { id: 'c', text: 'Neither shape can be named from this data, because naming the shape of a pyramid needs the drawing itself and not a list of three percentages' },
        { id: 'd', text: 'Tirreth is top-heavy and Sarnow is wide-based, so the same ratio of 100 points to care for older people in one country and to classrooms in the other', correct: true },
      ],
      expectedAnswer: 'Tirreth is top-heavy and Sarnow is wide-based, so the same ratio of 100 points to care for older people in one country and to classrooms in the other',
      hints: [
        'The shape is assigned by setting the two outer bands against each other, not by looking at the middle band. In each country, is one outer band at least twice the other, and which one is it?',
        'Two countries can report the same ratio and be built the opposite way round, so a matching ratio settles nothing about shape. Naming a structure after its smaller outer band, reading the shape off the size of the dependent total, or holding that a shape cannot be named without a drawing all skip the one comparison that assigns it.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-ten-year-crossing',
      kind: 'try_yourself',
      problem:
        '"Valmere: of every 100 people, 36 are under 15, 50 are 15 to 64, and 14 are 65 or older. Of the 36 who are under 15, 24 are aged 5 to 14 and 12 are under 5." A planner needs to know how many people per 100 will have crossed into the working-age band within ten years. Which figure is it, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '24 per 100, the people who are aged 5 to 14 today, because every one of them turns 15 or older within the next ten years', correct: true },
        { id: 'b', text: '36 per 100, the whole under-15 band, because all of those children move up through the age bands as the ten years pass' },
        { id: 'c', text: '12 per 100, the people who are under 5 today, because they are the newest part of the band and the last of it to arrive' },
        { id: 'd', text: '14 per 100, the people who are 65 or older, because the room in the working-age band is made by the people leaving it' },
      ],
      expectedAnswer: '24 per 100, the people who are aged 5 to 14 today, because every one of them turns 15 or older within the next ten years',
      hints: [
        'Work out how old somebody has to be today in order to be 15 or older in ten years, then find the slice of the band that is already that old.',
        'The whole under-15 band is too many, because the youngest part of it is still under 15 when the ten years are up, and the 65-and-over band is the other end of the structure entirely. Only one slice crosses the line inside the decade.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-share-as-ratio-and-ratio-as-whole-story',
      kind: 'misconception_check',
      question:
        'A student looks at Tolmarch -- 45 under 15, 50 aged 15 to 64, 5 aged 65 or older -- and at Havren -- 15 under 15, 50 aged 15 to 64, 35 aged 65 or older -- and writes: "The dependency ratio is the percentage of a country that does not work, so both countries are at 50." Then: "And once two countries match on the ratio, there is nothing left in the age structure to tell them apart." What is wrong with each sentence?',
      commonErrors: [
        {
          answer: 'The dependency ratio is the percentage of a country that does not work, so both countries are at 50.',
          misconception:
            'Two errors stacked in one sentence. The denominator has been taken as the whole population rather than the working-age band, which turns the ratio into a share; and the age bands have been read as a statement about who works, when they are age lines and nothing more.',
          correctsTo:
            'Take the arithmetic first. In both countries the dependent bands add to 50 of every 100 people -- 45 plus 5 in Tolmarch, 15 plus 35 in Havren -- and the working-age band is 50. Dividing by the whole population gives 50 divided by 100, which is 0.50, the SHARE outside the two age lines, 50 percent. The ratio divides by the working-age band: 50 divided by 50 is 1, and 1 times 100 is 100 dependents for every 100 working-age people. Check: 100 times 50 divided by 100 is 50, and 50 plus 50 is 100. WRONG: "The ratio is 50." CORRECT: "The share is 50 percent and the ratio is 100 per 100, from the same two numbers, because they divide by different things." Then the wording. The bands are drawn at age 15 and age 65, and the ratio never asks whether anybody has a job. Plenty of people over 64 work and plenty of people in the working-age band do not; the ratio is a measurement of a structure, and it is not a statement about any person in it.',
        },
        {
          answer: 'Once two countries match on the ratio, there is nothing left in the age structure to tell them apart.',
          misconception:
            'Treating the ratio as a complete summary of the structure, when it is one division that deliberately throws away which of the two outer bands the dependents came from.',
          correctsTo:
            'Split the ratio and the difference reappears at once. Tolmarch youth part: 45 divided by 50 is 0.9, times 100 is 90. Tolmarch old-age part: 5 divided by 50 is 0.1, times 100 is 10. Check: 90 plus 10 is 100. Havren youth part: 15 divided by 50 is 0.3, times 100 is 30. Havren old-age part: 35 divided by 50 is 0.7, times 100 is 70. Check: 30 plus 70 is 100. Both countries report 100, and 90 of Tolmarch\'s points are children while 70 of Havren\'s are people aged 65 or older. The shapes say it too, from the two outer bands: 45 against 5 is wide-based, and 35 against 15 is top-heavy. WRONG: "Equal ratios, equal situations." CORRECT: "Equal ratios, opposite insides -- one country has to build classrooms and then work and training places, and the other has to build clinics, home care and pension capacity."',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The dependency ratio divides the two outer bands by the WORKING-AGE band and multiplies by 100. Dividing by the whole population instead gives the dependent share, which is a different, smaller and true figure answering a different question.',
        'Run the checks every time: the three bands add to 100, the ratio times the working-age band divided by 100 gives the dependent total back, and the dependent total plus the working-age band gives 100 back.',
        'Split the ratio into its youth part and its old-age part by running the same division with one outer band on top at a time. The two parts add back to the whole ratio, and they are what tells you which things to build.',
        'Assign the shape from the two outer bands only: wide-based when the under-15 band is at least twice the 65-and-over band, top-heavy when it is the other way round, column-shaped when neither is twice the other.',
        'Shape and ratio are answering different questions. A structure can keep its shape while its ratio moves 50 points, and two structures can share a ratio and have opposite shapes.',
        'Because the three bands must add to 100, moving ten points out of the working-age band adds ten to the numerator and takes ten off the denominator at once, which is why 50 over 50 becomes 60 over 40 and the ratio jumps from 100 to 150.',
        'For a ten-year question, use the slice that crosses the line: only the people already aged 5 to 14 today are in the working-age band within ten years. That says which way the pressure runs; it is not a forecast of the ratio, because births, deaths and moves all change the bands.',
        'Dependency is a measurement of a structure, never a score for a place or for the people in it. The age lines are bookkeeping, not a claim about who works.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '5', cedTopic: '5.1', cedTitle: 'Population Pyramids & Dependency' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
