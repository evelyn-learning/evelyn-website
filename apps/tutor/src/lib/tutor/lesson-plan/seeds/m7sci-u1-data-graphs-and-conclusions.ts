/**
 * Grade 7 Science (Life Science) — Practices: Reading Data, Graphs &
 * Drawing Conclusions.
 *
 * The procedure-led row that closes Unit 1 (NGSS science and engineering
 * practice: analyzing and interpreting data). One procedure runs the whole
 * lesson: pick the graph that fits the data, read the trend across the whole
 * set, then write a conclusion in three parts -- what the evidence shows, how
 * it answers the question, and what it does NOT show.
 *
 * The idea this row exists to install is CORRELATION IS NOT CAUSATION. Two
 * measurements rising together is a pattern, not a cause, and a third factor
 * behind both is the usual explanation. Everything else here supports that.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every table
 * and every graph in this file is written out in words, and every item is
 * solvable from the text printed inside it. Never write "look at the graph".
 * All numbers below are small, invented and classroom-scale -- they are
 * teaching examples, not real-world statistics.
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U1_DATA_GRAPHS_AND_CONCLUSIONS: LessonPlan = {
  id: 'evelyn.ms.m7sci.data-graphs-and-conclusions.v1',
  title: 'Reading Data, Graphs & Drawing Conclusions',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.data-graphs-and-conclusions',
      standard: 'M7SCI-1.4',
      description:
        'Choose the graph that fits a set of data, describe the overall trend rather than a single point, and write a conclusion that states what the evidence shows, answers the original question, and says what the evidence does not show -- including the rule that two measurements changing together does not establish that one caused the other (NGSS science and engineering practices: analyzing and interpreting data, and engaging in argument from evidence).',
    },
  ],
  prerequisites: ['m7sci.variables-and-controls'],
  followUps: ['m7sci.cell-theory-and-microscopes'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that an honest graph can still lead to a false conclusion, so the student wants the tools.',
      script:
        'Here is something a little unfair about graphs. A graph can be completely honest and still leave you believing something false. Imagine somebody measured every student in this school and wrote down two things: shoe size, and how many words per minute that student reads. In general, the students with the bigger feet read faster. The two go up together. So should you buy bigger shoes before the reading test? Obviously not. The older students have bigger feet AND more years of practice reading. Age is sitting quietly behind both numbers. Today you learn to read data properly: pick the graph that fits, follow the whole trend instead of one point, and write a conclusion that says what the evidence shows and, just as importantly, what it does not.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-reading-data',
      kind: 'concept',
      goal: 'Install graph choice, trend reading, axis scale, the three-part conclusion, and correlation versus causation.',
      keyIdeas: [
        'PICK THE GRAPH THAT FITS THE DATA. A BAR GRAPH compares separate groups that have nothing in between them -- four brands of paper towel, three types of soil, plants in the dark versus plants on the windowsill. A LINE GRAPH shows one thing changing over time or across a continuous measurement, because the space between the points means something real. Height measured every five days is a line graph. Four different brands is a bar graph, because there is no such thing as a brand halfway between brand A and brand B.',
        'READ THE TREND, NOT ONE POINT. A trend is the overall direction across ALL the data: going up, going down, or staying about the same. Real measurements wobble, so one reading that dips does not reverse a trend, and one reading that jumps does not create one. WRONG: "The plant is shrinking, because week 4 was lower than week 3." CORRECT: "The plant grew from 4 cm to 15 cm over six weeks, with one dip in week 4." Look at the first numbers, the last numbers, and the shape between them before you say anything.',
        'THE SCALE ON THE SIDE CHANGES HOW A GRAPH LOOKS, NOT WHAT IT MEANS. Two graphs can show the exact same numbers and one of them looks dramatic. If the side axis runs from 0 to 100, a rise from 61 to 64 looks tiny. If the side axis runs from 60 to 65, that same rise fills the whole page and looks enormous. Nothing about the plants changed. Always read the numbers printed on the axis before you decide an effect is big.',
        'A CONCLUSION HAS THREE PARTS. First, state what the evidence shows, using actual numbers from the data. Second, tie it back to the question that was asked, and say whether the data supports the hypothesis or not. Third, say what the evidence does NOT show -- what was not tested, what other explanation is still open. A conclusion without that third part is the kind that gets a scientist in trouble.',
        'A CONCLUSION IS WHAT THE DATA SAYS, NOT WHAT YOU HOPED. Results that disagree with your hypothesis are not a failed experiment and they are not evidence that you did it wrong. A hypothesis is a prediction being tested, and testing means it is allowed to lose. WRONG: "My plants in the dark grew taller, so I must have messed up." CORRECT: "My plants in the dark grew taller, which does not support my hypothesis. Here is the measurement, and here is what I would test next." Change your answer to match the data; never change the data to match your answer.',
        'CORRELATION IS NOT CAUSATION, AND THIS IS THE BIGGEST IDEA IN THE LESSON. When two things change together, that is a CORRELATION. It is a real pattern, and it is worth noticing. But it does not tell you that one caused the other. At a summer camp, the days with more ice cream sold were also the days with more sunburns. Ice cream does not burn skin. Hot sunny days do both: they send people to the ice cream stand AND they burn skin. That hidden third thing is called a confounding factor. There are always three possibilities behind a correlation -- A caused B, B caused A, or something else caused both -- and only a controlled test where you change one variable on purpose can tell them apart.',
      ],
      vocabulary: [
        { term: 'data', definition: 'the measurements or observations collected during an investigation.' },
        { term: 'trend', definition: 'the overall direction of a set of data, read across all the points rather than from one.' },
        { term: 'bar graph', definition: 'a graph that compares separate groups or categories.' },
        { term: 'line graph', definition: 'a graph that shows how one measurement changes over time or across a continuous range.' },
        { term: 'correlation', definition: 'a pattern where two measurements change together; it does not by itself mean one caused the other.' },
        { term: 'confounding factor', definition: 'a third thing that affects both measurements and can explain a correlation without either one causing the other.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-choose-and-read',
      kind: 'worked_example',
      problem:
        'A class grew one bean plant on a windowsill and measured its height every five days. The record is Day 0: 2 cm. Day 5: 5 cm. Day 10: 9 cm. Day 15: 14 cm. Which kind of graph fits this data, what does the graph look like, and what is the trend?',
      steps: [
        'Ask first what kind of data this is. Days are a continuous measurement -- Day 7 and Day 12 are real days that exist between the ones we measured. That means a LINE GRAPH, not a bar graph.',
        'Describe the graph in words so you know what you are picturing. Days run across the bottom, from 0 to 15. Height in centimeters runs up the side, from 0 to 15. The four plotted points sit at Day 0 and 2 cm, Day 5 and 5 cm, Day 10 and 9 cm, Day 15 and 14 cm, and a line connects them from lower left to upper right.',
        'Read the trend using the first and last numbers. The plant went from 2 cm to 14 cm over fifteen days, so the trend is a steady increase. It grew 12 cm in total.',
        'Now look at the shape between the points. From Day 0 to Day 5 it gained 3 cm. From Day 5 to Day 10 it gained 4 cm. From Day 10 to Day 15 it gained 5 cm. Each stretch is bigger than the one before, so the line is not straight -- it bends upward. The plant is growing, and growing a little faster as it goes.',
        'Check the axis scale before calling this dramatic. The side axis here runs from 0 to 15 cm, which is honest for a plant that ended at 14 cm. If somebody redrew the very same four numbers with a side axis running from 0 all the way up to 100 cm, that identical line would look almost flat. Not one plant would have grown a single millimeter more or less. The scale changes the picture, never the data.',
        'Write the conclusion in three parts. What the evidence shows: the plant grew from 2 cm to 14 cm over fifteen days, gaining more in each five-day stretch. How it answers the question: yes, the plant on the windowsill grew steadily across the whole two weeks. What it does NOT show: this was one plant with no comparison group, so the data does not show that the windowsill caused the growth, and it does not show what happens after Day 15.',
      ],
      answer:
        'A line graph, because days are continuous. The trend is a steady increase from 2 cm to 14 cm, gaining 3 cm, then 4 cm, then 5 cm, so growth speeds up slightly. The data does not show what caused the growth, because only one plant was measured and nothing was compared against it.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-correlation-not-causation',
      kind: 'worked_example',
      problem:
        'A counselor at one small summer camp kept a record for four days. Day 1: 4 cups of ice cream sold, 1 camper reported a sunburn. Day 2: 10 cups sold, 3 sunburns. Day 3: 18 cups sold, 6 sunburns. Day 4: 22 cups sold, 7 sunburns. A camper concludes: "Eating ice cream causes sunburn." Evaluate that conclusion and write a better one.',
      steps: [
        'Say what the numbers actually do, with no explanation attached yet. Cups sold rise 4, 10, 18, 22. Sunburns rise 1, 3, 6, 7. Every time one goes up, so does the other. That is a correlation, and it is real -- the camper is not imagining the pattern.',
        'Now separate the pattern from the cause. A correlation always leaves three possibilities open. Ice cream could cause sunburn. Sunburn could cause ice cream buying. Or some third thing could be causing both.',
        'Test the first possibility against what you already know. Ice cream is eaten; sunburn happens on skin from ultraviolet light. There is no way for a cold snack in your mouth to burn your arms. Reject it.',
        'Test the second. Could a sunburn make somebody want ice cream? It is a stretch, and the ice cream is bought at the stand during the day, before most burns are noticed. Weak at best.',
        'Test the third, which is almost always the answer. A hot, sunny day sends more campers to the ice cream stand AND delivers more ultraviolet light to unprotected skin. The weather is a confounding factor: it sits behind both columns and explains the whole pattern without either one causing the other.',
        'Write the honest conclusion in three parts. What the evidence shows: across these four days, days with higher ice cream sales also had more reported sunburns. How it answers the question: the two measurements are correlated. What it does NOT show: it does not show that ice cream causes sunburn, because sunny weather could raise both numbers, and nothing in this record was controlled.',
        'Say what a fair test would look like, because that is the move that settles it. You would need groups that are the same in every way except ice cream -- same sun, same time outdoors, same sunscreen -- and only then could you talk about cause.',
      ],
      answer:
        'The conclusion is wrong. The two numbers are correlated, but correlation is not causation. Hot sunny weather is a confounding factor that raises ice cream sales and sunburns at the same time. A defensible conclusion: on days with higher ice cream sales this camp also recorded more sunburns, and the data does not show what caused either one.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-choose-the-graph',
      kind: 'try_yourself',
      problem:
        'A student measures the temperature of a cup of hot water every two minutes as it cools, for twenty minutes, and wants to show how the temperature changed. Which graph fits this data best, and why?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Either graph works equally well, because both of them show numbers' },
        { id: 'b', text: 'A bar graph, because each reading is a separate group' },
        { id: 'c', text: 'A bar graph, because temperature is a number' },
        { id: 'd', text: 'A line graph, because one measurement is changing continuously over time', correct: true },
      ],
      expectedAnswer: 'A line graph, because one measurement is changing continuously over time',
      hints: [
        'Ask whether the space between two readings means something real. Is there a temperature at minute 5, in between the readings at minute 4 and minute 6?',
        'Bar graphs are for groups with nothing in between them, like four brands or three soil types. Time is not like that.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-trend-not-one-point',
      kind: 'try_yourself',
      problem:
        'A class measured the same plant once a week. Week 1: 4 cm. Week 2: 6 cm. Week 3: 9 cm. Week 4: 8 cm. Week 5: 12 cm. Week 6: 15 cm. Which statement describes the trend correctly?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The plant is shrinking, because week 4 is lower than week 3' },
        { id: 'b', text: 'The plant grew for three weeks and then started shrinking' },
        { id: 'c', text: 'There is no trend, because the numbers do not go up every single week' },
        { id: 'd', text: 'The plant grew overall, from 4 cm to 15 cm, with one dip at week 4 that does not change the upward trend', correct: true },
      ],
      expectedAnswer: 'The plant grew overall, from 4 cm to 15 cm, with one dip at week 4 that does not change the upward trend',
      hints: [
        'Compare the first number with the last number, then look at the shape of everything in between. Do not stop reading at the week that surprised you.',
        'A single reading that dips is normal in real measurement. Ask what the whole set does, not what one week did.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-correlation-not-causation',
      kind: 'try_yourself',
      problem:
        'In a school garden, the plots that got extra compost grew taller tomato plants than the plots that got none. Those same compost plots all happen to sit along the sunny south fence, and the plots with no compost sit in the shade of the building. Which conclusion does this evidence support?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Compost causes tomato plants to grow taller' },
        { id: 'b', text: 'Taller tomato plants cause gardeners to add more compost' },
        { id: 'c', text: 'Compost has no effect on how tall tomato plants grow' },
        { id: 'd', text: 'The compost plots grew taller plants, but sunlight could explain the difference too, so this data does not show what caused it', correct: true },
      ],
      expectedAnswer: 'The compost plots grew taller plants, but sunlight could explain the difference too, so this data does not show what caused it',
      hints: [
        'List everything that is different between the two sets of plots. Is compost really the only difference?',
        'When a second variable changes at the same time as the one you care about, the test is not fair and you cannot separate the two causes.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-two-lines-rising',
      kind: 'misconception_check',
      question:
        'A student writes this conclusion: "Every year our school had more students join band, and every year more students brought lunch from home. Both lines on my graph go up. Joining band makes students bring lunch from home." What is wrong with that conclusion?',
      commonErrors: [
        {
          answer: 'Both lines go up, so joining band makes students bring lunch from home.',
          misconception:
            'Treating two lines that rise together as cause and effect, because they look the same on the page. Two rising lines are a correlation, and a correlation is a pattern, not a cause.',
          correctsTo:
            'Ask what else changed over those same years. If the whole school got bigger, then almost every count in the school went up -- band, home lunches, library cards, lost jackets. Total enrollment is a confounding factor sitting behind both lines. The honest conclusion is that band membership and home lunches both increased over these years, and this data does not show that either one caused the other. The habit that fixes this permanently: every time two things rise together, name a third thing that could be raising both before you say the word "causes".',
        },
        {
          answer: 'My results did not match my hypothesis, so I must have done the experiment wrong.',
          misconception:
            'Treating a hypothesis as a target to hit rather than a prediction being tested, so any disagreement gets read as a mistake in the procedure.',
          correctsTo:
            'A hypothesis is allowed to be wrong -- that is the entire point of testing it. Data that disagrees with your prediction is a real result and it is often the most interesting one. You should check your procedure when something actually went wrong, like a spilled sample or a mismeasured cup, never just because you dislike the answer. Report the measurement you got, say plainly that it does not support the hypothesis, and say what you would test next.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Bar graph for separate groups; line graph for one thing changing over time or across a continuous range.',
        'Read the TREND across all the data. One dip is not shrinking, and one jump is not a pattern.',
        'Check the numbers printed on the axis. A steep-looking line can be a tiny change stretched across the page.',
        'A conclusion has three parts: what the evidence shows with real numbers, how it answers the question, and what it does NOT show.',
        'Results that disagree with your hypothesis are data, not mistakes. Change the answer to fit the evidence, never the reverse.',
        'CORRELATION IS NOT CAUSATION. Two things changing together leaves three options open: A caused B, B caused A, or a third factor caused both.',
        'More ice cream sold and more sunburns on the same days does not mean ice cream burns skin -- hot sunny weather raises both.',
        'Only a controlled test, where one variable is changed on purpose and everything else is held the same, can show cause.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.4', cedTitle: 'Reading Data, Graphs & Drawing Conclusions' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
