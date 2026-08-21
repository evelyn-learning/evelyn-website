/**
 * Grade 7 World Geography — Human Geography: Population Growth & Age Structure.
 *
 * Concept-led row (National Geography Standard 9), shaped on the m7geo
 * exemplar m7geo-u3-migration-push-and-pull.ts and following its unit sibling
 * m7geo-u3-population-distribution-and-density.ts. The row turns on two
 * discriminations: NATURAL INCREASE is births minus deaths, and a GROWTH RATE
 * is a speed, not a size. Age structure is then read as a description of who
 * lives in a place by age band, and what that implies a place will need.
 *
 * NOTE FOR FUTURE AUTHORS, and this one matters:
 *   1. NO REAL COUNTRY'S BIRTH RATE, DEATH RATE, GROWTH RATE, POPULATION OR
 *      MEDIAN AGE APPEARS ANYWHERE IN THIS FILE, and no real country is named
 *      in any item. Every rate and every age structure in here belongs to an
 *      invented country. These figures change every year and a confidently
 *      wrong statistic is the failure mode for this course.
 *   2. A birth rate is never a problem and never a virtue. High-birth-rate and
 *      low-birth-rate countries are NOT ranked, compared for merit, or blamed
 *      for anything. Age structures are measured, never graded, and the people
 *      of no place are characterized.
 *   3. Migration belongs to row 3.3. It is named here as the OTHER input to
 *      population change and then left alone.
 *
 * There are also NO MAPS AND NO IMAGES in this course. Geographers usually
 * draw an age structure as a population pyramid; here every age structure is
 * written out in words, and every item is solvable from the words printed
 * inside it.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7GEO_U3_POPULATION_GROWTH_AND_STRUCTURE: LessonPlan = {
  id: 'evelyn.ms.m7geo.population-growth-and-structure.v1',
  title: 'Population Growth & Age Structure',
  curriculum: 'MS',
  grade: '7',
  subject: 'social-studies',
  topic: 'grade-7-world-geography',
  locale: 'en',
  los: [
    {
      id: 'm7geo.population-growth-and-structure',
      standard: 'M7GEO-3.2',
      description:
        'Explain how a population changes by comparing its birth rate and its death rate to find natural increase, distinguish the size of a population from the rate at which it is growing, and read an age structure described in words to say what a place is likely to need (National Geography Standard 9: the characteristics, distribution and migration of human populations on Earth surface).',
    },
  ],
  prerequisites: ['m7geo.population-distribution-and-density'],
  followUps: ['m7geo.migration-push-and-pull'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Anchor age structure in something the student has already noticed about a place, before any vocabulary.',
      script:
        'Think about two neighborhoods you have been to. In one of them, the park is full on a Saturday, there is a line at the ice cream window, and the elementary school needed a second building. In the other one, the same park is quiet, the school has empty classrooms, and most of the neighbors on the street have grown-up children who live somewhere else. Both places have people in them. What is different is WHO those people are -- how many are kids, how many are working adults, how many are older. Geographers can describe a whole country that way, and once you can read that description, you can say what a place is going to need before it needs it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-growth-and-age-structure',
      kind: 'concept',
      goal: 'Install birth rate and death rate, natural increase, the rate-versus-size distinction, and how to read an age structure without judging it.',
      keyIdeas: [
        'TWO NUMBERS DRIVE A POPULATION. The BIRTH RATE is how many babies are born in a year for every 1,000 people in a place. The DEATH RATE is how many people die in a year for every 1,000 people. Both are counted the same way, out of the same 1,000, which is exactly what makes them comparable.',
        'NATURAL INCREASE IS BIRTHS MINUS DEATHS. Subtract the death rate from the birth rate. If the answer is a positive number, more people are being born than are dying and the population grows on its own. If it is a negative number, the population shrinks on its own. The word natural means only that this part of the change comes from births and deaths, and nothing else.',
        'BIRTHS AND DEATHS ARE NOT THE WHOLE STORY. The other input is MIGRATION -- people moving in and people moving out. A country can have more deaths than births and still gain people if enough people move in, and it can have more births than deaths and still lose people if enough people move out. Migration is the whole of the next lesson, so for today simply remember that total population change equals natural increase plus whatever migration does.',
        'A GROWTH RATE IS A SPEED, NOT A SIZE. This is the trap in this lesson. The growth rate tells you how FAST a population is changing, not how big it is. If a country reports that its growth rate has fallen from one year to the next, but the rate is still above zero, the population is still getting bigger -- it is just adding fewer people each year than it used to. WRONG: "The growth rate went down, so the population went down." CORRECT: "The growth rate went down, so the population is still growing, only more slowly." A population shrinks only when the rate goes BELOW zero.',
        'AGE STRUCTURE IS WHO LIVES SOMEWHERE, SORTED BY AGE. Geographers usually split a population into three bands: under 15, 15 to 64, and 65 or older. Geographers draw this as a graph called a population pyramid, but you can read it perfectly well in words. A WIDE BASE means a large share of people are children. An EVEN structure means the three bands are closer to balanced. A TOP-HEAVY structure means a large share of people are 65 or older.',
        'AGE STRUCTURE PREDICTS WHAT A PLACE WILL NEED, AND IT IS A MEASUREMENT, NOT A GRADE. A wide base means classrooms, teachers, and then jobs for all those young people once they finish school. A top-heavy structure means hospitals, home care, and pensions for people who have retired. Neither one is better than the other and neither one is a problem to be scored. A high birth rate is not a fault and not a virtue, and no age structure makes the people who live there any particular way. Age structures also differ from country to country and change over time inside the same country, so never assume one you have seen is the one everywhere.',
      ],
      vocabulary: [
        {
          term: 'birth rate',
          definition: 'the number of babies born in a year for every 1,000 people in a place.',
        },
        {
          term: 'death rate',
          definition: 'the number of people who die in a year for every 1,000 people in a place.',
        },
        {
          term: 'natural increase',
          definition: 'the birth rate minus the death rate, which is population change from births and deaths alone.',
        },
        {
          term: 'growth rate',
          definition: 'how fast a population is changing, which is a speed rather than a size.',
        },
        {
          term: 'age structure',
          definition: 'the share of a population that falls into each age band, such as under 15, 15 to 64, and 65 or older.',
        },
        {
          term: 'population pyramid',
          definition: 'the graph geographers use to show an age structure, which can also be described in words.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-natural-increase',
      kind: 'worked_example',
      problem:
        'Find the natural increase of an invented country and say what it means, then say what you still do not know.\n\n"In Ostvale last year there were about 21 births for every 1,000 people, and about 9 deaths for every 1,000 people."',
      steps: [
        'Name the two numbers first. The birth rate is 21 per 1,000. The death rate is 9 per 1,000. Both are counted out of the same 1,000 people, so they can be compared directly.',
        'Apply the definition: natural increase equals the birth rate minus the death rate.',
        '21 minus 9 equals 12. Ostvale has a natural increase of 12 per 1,000 people per year.',
        'Read what the sign of that number means. It is positive, so more people were born in Ostvale than died there, and the population grows from births and deaths alone.',
        'Say it in plain words to check yourself: for every 1,000 people in Ostvale, the country ended the year with about 12 more people than births and deaths started it with.',
        'Now the honest limit. Natural increase is only one of the two inputs. You still do not know whether people moved into Ostvale or out of it, so you cannot yet say what happened to the total population. Migration is the other input, and it is the next lesson.',
      ],
      answer:
        'The natural increase is 12 per 1,000 people per year, because 21 minus 9 equals 12. The number is positive, so births outnumbered deaths and the population grew from births and deaths alone. What the natural increase does not tell you is migration, so it does not by itself settle what happened to the total population.',
      estimatedMinutes: 4,
    },
    {
      id: 'worked-read-age-structure',
      kind: 'worked_example',
      problem:
        'Read two age structures written out in words, describe the shape of each, and say what each place is likely to need. Neither country is a real one.\n\n"Marovia: of every 100 people, about 35 are under 15, about 60 are 15 to 64, and about 5 are 65 or older."\n\n"Verendal: of every 100 people, about 15 are under 15, about 63 are 15 to 64, and about 22 are 65 or older."',
      steps: [
        'Take one country at a time and compare the top band with the bottom band. In Marovia, 35 out of every 100 people are under 15 and only 5 are 65 or older. Many more children than older adults.',
        'Name that shape. A large share of children and a small share of older adults is a WIDE BASE.',
        'Turn the shape into needs. Those 35 children out of every 100 are in school now or will be soon, so Marovia needs classrooms and teachers. Then follow them forward ten or fifteen years: they will all be looking for work at once, so Marovia will need jobs for young adults.',
        'Now Verendal. Only 15 out of every 100 are under 15, while 22 out of every 100 are 65 or older. More older adults than children, which is a TOP-HEAVY structure.',
        'Turn that shape into needs as well. A large share of Verendal has already retired or will soon, so the pressure lands on healthcare, home care and pensions rather than on school buildings.',
        'Last, watch your language. WRONG: "Marovia has too many children and Verendal is better off." CORRECT: "Marovia and Verendal have different age structures, so they need different things." An age structure is a measurement of who lives somewhere. It is not a score, and it says nothing about what anyone who lives there is like.',
      ],
      answer:
        'Marovia has a wide base, with about 35 of every 100 people under 15 and only about 5 aged 65 or older, so it is likely to need schools and teachers now and jobs for young adults later. Verendal is top-heavy, with about 22 of every 100 people aged 65 or older and only about 15 under 15, so it is likely to need healthcare, care at home and pensions. Neither structure is better than the other; they simply call for different things.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-natural-increase',
      kind: 'try_yourself',
      problem:
        'Country A has about 18 births each year for every 1,000 people and about 11 deaths each year for every 1,000 people. Which statement about Country A is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Its natural increase is 29 per 1,000, found by adding the births and the deaths.' },
        { id: 'b', text: 'Its natural increase is 7 per 1,000, so deaths outnumber births.' },
        { id: 'c', text: 'Its natural increase is 7 per 1,000, so births outnumber deaths.', correct: true },
        { id: 'd', text: 'It has no natural increase, because births and deaths always cancel each other out.' }
      ],
      expectedAnswer: 'Its natural increase is 7 per 1,000, so births outnumber deaths.',
      hints: [
        'Natural increase is one subtraction: the birth rate minus the death rate. Do that subtraction before you read the choices again.',
        'Two choices give the same number and disagree about what it means. Ask which rate was the bigger one to begin with.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-rate-versus-size',
      kind: 'try_yourself',
      problem:
        'Country B reports that its population growth rate is lower this year than it was ten years ago. The rate is still above zero. What is happening to the population of Country B?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It is shrinking, because the growth rate has fallen.' },
        { id: 'b', text: 'More people are now dying there each year than are being born.' },
        { id: 'c', text: 'It stopped changing on the day the growth rate began to fall.' },
        { id: 'd', text: 'It is still growing, but it adds fewer people each year than it used to.', correct: true }
      ],
      expectedAnswer: 'It is still growing, but it adds fewer people each year than it used to.',
      hints: [
        'A growth rate is a speed, not a size. A car slowing down is still moving forward.',
        'The question tells you the rate is still above zero. Ask what would have to be true of the rate for a population to actually shrink.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-age-structure',
      kind: 'try_yourself',
      problem:
        'In the invented country of Selvia, of every 100 people about 38 are under 15, about 57 are 15 to 64, and about 5 are 65 or older. Which statement best describes what Selvia is likely to need over the next fifteen years?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Mostly pensions and care for older adults, because most Selvians are 65 or older.' },
        { id: 'b', text: 'School places now, and then jobs for young adults as those children grow up.', correct: true },
        { id: 'c', text: 'The same things as every other country, because age structure is alike everywhere.' },
        { id: 'd', text: 'There is no way to tell, because an age structure says nothing about what a place will need.' }
      ],
      expectedAnswer: 'School places now, and then jobs for young adults as those children grow up.',
      hints: [
        'Compare the bottom band with the top band. Out of every 100 people, how many are under 15, and how many are 65 or older?',
        'Once you have named the shape, walk the children forward in time. Where are 38 out of every 100 people going to be in fifteen years?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-growth-inputs-and-structure',
      kind: 'misconception_check',
      question:
        'A student writes: "A country grows when babies are born there, so if you know the birth rate you know whether the population is growing." What has gone wrong?',
      commonErrors: [
        {
          answer: 'If you know the birth rate, you know whether the population is growing.',
          misconception:
            'Treating births as the only way a population changes. The student has one of the three inputs and is treating it as the whole calculation.',
          correctsTo:
            'A birth rate on its own settles nothing. First it has to be compared with the DEATH RATE, because natural increase is births minus deaths -- a place can have a high birth rate and still not grow naturally if its death rate is higher. Second, births and deaths are not the only inputs. MIGRATION moves people in and out. WRONG: "Births tell you whether a population is growing." CORRECT: "Total population change equals natural increase, which is births minus deaths, plus whatever migration adds or takes away." Two of the three numbers are missing from the student sentence.',
        },
        {
          answer: 'Since older people live in every country, every country has about the same age structure.',
          misconception:
            'Assuming age structure is a constant rather than something that differs from place to place and changes over time within one place.',
          correctsTo:
            'Age structures differ a great deal. One country can have close to twice as large a share of people under 15 as another, and a country with a wide base today can have a much more even structure decades later as its birth rate and death rate change. That is exactly why geographers bother to measure it. Read each age structure from the numbers you are given rather than from one you saw before, and remember that the reading is a description of what a place will need -- not a score, and not a claim about the people who live there.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The birth rate and the death rate are both counted per 1,000 people per year, which is what makes them comparable.',
        'Natural increase equals births minus deaths. Positive means the population grows on its own; negative means it shrinks on its own.',
        'Migration is the other input. Total population change equals natural increase plus what migration adds or takes away.',
        'A growth rate is a speed, not a size. A falling growth rate that is still above zero means growth is slowing, not that the population is shrinking.',
        'Age structure splits a population into under 15, 15 to 64, and 65 or older. A wide base means many children; a top-heavy structure means many older adults.',
        'A wide base points to schools and later to jobs; a top-heavy structure points to healthcare and pensions. Age structure is measured, never graded, and it says nothing about what the people of a place are like.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'Population Growth & Age Structure' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
