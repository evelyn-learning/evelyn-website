/**
 * Grade 7 Science — Unit 1 CED 1.4: Reading Data, Graphs & Drawing Conclusions.
 *
 * Auto-extracted from the corresponding lesson plan
 * (evelyn.ms.m7sci.data-graphs-and-conclusions.v1). Hand-edit freely after extraction; bump
 * baselineVersion when you make material changes.
 *
 * Pointer-gen pass (scripts/gen-topic-notes-pointers.ts) enriches the
 * pointers section via Opus when run on this baseline.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_M7SCI_U1_DATA_GRAPHS_AND_CONCLUSIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.ms.m7sci.data-graphs-and-conclusions.v1',
  course: 'Grade 7 Science',
  cedUnit: 1,
  cedTopic: '1.4',
  cedTitle: 'Reading Data, Graphs & Drawing Conclusions',
  planId: 'evelyn.ms.m7sci.data-graphs-and-conclusions.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-08-21',
  sources: [{ type: 'plan', planId: 'evelyn.ms.m7sci.data-graphs-and-conclusions.v1' }],
  theory: [
    { loId: 'm7sci.data-graphs-and-conclusions', content: `PICK THE GRAPH THAT FITS THE DATA. A BAR GRAPH compares separate groups that have nothing in between them -- four brands of paper towel, three types of soil, plants in the dark versus plants on the windowsill. A LINE GRAPH shows one thing changing over time or across a continuous measurement, because the space between the points means something real. Height measured every five days is a line graph. Four different brands is a bar graph, because there is no such thing as a brand halfway between brand A and brand B.` },
    { loId: 'm7sci.data-graphs-and-conclusions', content: `READ THE TREND, NOT ONE POINT. A trend is the overall direction across ALL the data: going up, going down, or staying about the same. Real measurements wobble, so one reading that dips does not reverse a trend, and one reading that jumps does not create one. WRONG: "The plant is shrinking, because week 4 was lower than week 3." CORRECT: "The plant grew from 4 cm to 15 cm over six weeks, with one dip in week 4." Look at the first numbers, the last numbers, and the shape between them before you say anything.` },
    { loId: 'm7sci.data-graphs-and-conclusions', content: `THE SCALE ON THE SIDE CHANGES HOW A GRAPH LOOKS, NOT WHAT IT MEANS. Two graphs can show the exact same numbers and one of them looks dramatic. If the side axis runs from 0 to 100, a rise from 61 to 64 looks tiny. If the side axis runs from 60 to 65, that same rise fills the whole page and looks enormous. Nothing about the plants changed. Always read the numbers printed on the axis before you decide an effect is big.` },
    { loId: 'm7sci.data-graphs-and-conclusions', content: `A CONCLUSION HAS THREE PARTS. First, state what the evidence shows, using actual numbers from the data. Second, tie it back to the question that was asked, and say whether the data supports the hypothesis or not. Third, say what the evidence does NOT show -- what was not tested, what other explanation is still open. A conclusion without that third part is the kind that gets a scientist in trouble.` },
    { loId: 'm7sci.data-graphs-and-conclusions', content: `A CONCLUSION IS WHAT THE DATA SAYS, NOT WHAT YOU HOPED. Results that disagree with your hypothesis are not a failed experiment and they are not evidence that you did it wrong. A hypothesis is a prediction being tested, and testing means it is allowed to lose. WRONG: "My plants in the dark grew taller, so I must have messed up." CORRECT: "My plants in the dark grew taller, which does not support my hypothesis. Here is the measurement, and here is what I would test next." Change your answer to match the data; never change the data to match your answer.` },
    { loId: 'm7sci.data-graphs-and-conclusions', content: `CORRELATION IS NOT CAUSATION, AND THIS IS THE BIGGEST IDEA IN THE LESSON. When two things change together, that is a CORRELATION. It is a real pattern, and it is worth noticing. But it does not tell you that one caused the other. At a summer camp, the days with more ice cream sold were also the days with more sunburns. Ice cream does not burn skin. Hot sunny days do both: they send people to the ice cream stand AND they burn skin. That hidden third thing is called a confounding factor. There are always three possibilities behind a correlation -- A caused B, B caused A, or something else caused both -- and only a controlled test where you change one variable on purpose can tell them apart.` },
    { loId: 'm7sci.data-graphs-and-conclusions', kind: 'definition', title: 'data', content: 'the measurements or observations collected during an investigation.' },
    { loId: 'm7sci.data-graphs-and-conclusions', kind: 'definition', title: 'trend', content: `the overall direction of a set of data, read across all the points rather than from one.` },
    { loId: 'm7sci.data-graphs-and-conclusions', kind: 'definition', title: 'bar graph', content: 'a graph that compares separate groups or categories.' },
    { loId: 'm7sci.data-graphs-and-conclusions', kind: 'definition', title: 'line graph', content: `a graph that shows how one measurement changes over time or across a continuous range.` },
    { loId: 'm7sci.data-graphs-and-conclusions', kind: 'definition', title: 'correlation', content: `a pattern where two measurements change together; it does not by itself mean one caused the other.` },
    { loId: 'm7sci.data-graphs-and-conclusions', kind: 'definition', title: 'confounding factor', content: `a third thing that affects both measurements and can explain a correlation without either one causing the other.` },
  ],
  methods: [
    {
      title: 'Worked choose and read',
      steps: [
        `Ask first what kind of data this is. Days are a continuous measurement -- Day 7 and Day 12 are real days that exist between the ones we measured. That means a LINE GRAPH, not a bar graph.`,
        `Describe the graph in words so you know what you are picturing. Days run across the bottom, from 0 to 15. Height in centimeters runs up the side, from 0 to 15. The four plotted points sit at Day 0 and 2 cm, Day 5 and 5 cm, Day 10 and 9 cm, Day 15 and 14 cm, and a line connects them from lower left to upper right.`,
        `Read the trend using the first and last numbers. The plant went from 2 cm to 14 cm over fifteen days, so the trend is a steady increase. It grew 12 cm in total.`,
        `Now look at the shape between the points. From Day 0 to Day 5 it gained 3 cm. From Day 5 to Day 10 it gained 4 cm. From Day 10 to Day 15 it gained 5 cm. Each stretch is bigger than the one before, so the line is not straight -- it bends upward. The plant is growing, and growing a little faster as it goes.`,
        `Check the axis scale before calling this dramatic. The side axis here runs from 0 to 15 cm, which is honest for a plant that ended at 14 cm. If somebody redrew the very same four numbers with a side axis running from 0 all the way up to 100 cm, that identical line would look almost flat. Not one plant would have grown a single millimeter more or less. The scale changes the picture, never the data.`,
        `Write the conclusion in three parts. What the evidence shows: the plant grew from 2 cm to 14 cm over fifteen days, gaining more in each five-day stretch. How it answers the question: yes, the plant on the windowsill grew steadily across the whole two weeks. What it does NOT show: this was one plant with no comparison group, so the data does not show that the windowsill caused the growth, and it does not show what happens after Day 15.`,
      ],
      example: { problem: `A class grew one bean plant on a windowsill and measured its height every five days. The record is Day 0: 2 cm. Day 5: 5 cm. Day 10: 9 cm. Day 15: 14 cm. Which kind of graph fits this data, what does the graph look like, and what is the trend?`, solution: `A line graph, because days are continuous. The trend is a steady increase from 2 cm to 14 cm, gaining 3 cm, then 4 cm, then 5 cm, so growth speeds up slightly. The data does not show what caused the growth, because only one plant was measured and nothing was compared against it.` },
      relatedLoIds: ['m7sci.data-graphs-and-conclusions'],
    },
    {
      title: 'Worked correlation not causation',
      steps: [
        `Say what the numbers actually do, with no explanation attached yet. Cups sold rise 4, 10, 18, 22. Sunburns rise 1, 3, 6, 7. Every time one goes up, so does the other. That is a correlation, and it is real -- the camper is not imagining the pattern.`,
        `Now separate the pattern from the cause. A correlation always leaves three possibilities open. Ice cream could cause sunburn. Sunburn could cause ice cream buying. Or some third thing could be causing both.`,
        `Test the first possibility against what you already know. Ice cream is eaten; sunburn happens on skin from ultraviolet light. There is no way for a cold snack in your mouth to burn your arms. Reject it.`,
        `Test the second. Could a sunburn make somebody want ice cream? It is a stretch, and the ice cream is bought at the stand during the day, before most burns are noticed. Weak at best.`,
        `Test the third, which is almost always the answer. A hot, sunny day sends more campers to the ice cream stand AND delivers more ultraviolet light to unprotected skin. The weather is a confounding factor: it sits behind both columns and explains the whole pattern without either one causing the other.`,
        `Write the honest conclusion in three parts. What the evidence shows: across these four days, days with higher ice cream sales also had more reported sunburns. How it answers the question: the two measurements are correlated. What it does NOT show: it does not show that ice cream causes sunburn, because sunny weather could raise both numbers, and nothing in this record was controlled.`,
        `Say what a fair test would look like, because that is the move that settles it. You would need groups that are the same in every way except ice cream -- same sun, same time outdoors, same sunscreen -- and only then could you talk about cause.`,
      ],
      example: { problem: `A counselor at one small summer camp kept a record for four days. Day 1: 4 cups of ice cream sold, 1 camper reported a sunburn. Day 2: 10 cups sold, 3 sunburns. Day 3: 18 cups sold, 6 sunburns. Day 4: 22 cups sold, 7 sunburns. A camper concludes: "Eating ice cream causes sunburn." Evaluate that conclusion and write a better one.`, solution: `The conclusion is wrong. The two numbers are correlated, but correlation is not causation. Hot sunny weather is a confounding factor that raises ice cream sales and sunburns at the same time. A defensible conclusion: on days with higher ice cream sales this camp also recorded more sunburns, and the data does not show what caused either one.` },
      relatedLoIds: ['m7sci.data-graphs-and-conclusions'],
    },
  ],
  pointers: [
    { content: `Students often say "Both lines go up, so joining band makes students bring lunch from home." — Ask what else changed over those same years. If the whole school got bigger, then almost every count in the school went up -- band, home lunches, library cards, lost jackets. Total enrollment is a confounding factor sitting behind both lines. The honest conclusion is that band membership and home lunches both increased over these years, and this data does not show that either one caused the other. The habit that fixes this permanently: every time two things rise together, name a third thing that could be raising both before you say the word "causes".`, kind: 'common-error' },
    { content: `Students often say "My results did not match my hypothesis, so I must have done the experiment wrong." — A hypothesis is allowed to be wrong -- that is the entire point of testing it. Data that disagrees with your prediction is a real result and it is often the most interesting one. You should check your procedure when something actually went wrong, like a spilled sample or a mismeasured cup, never just because you dislike the answer. Report the measurement you got, say plainly that it does not support the hypothesis, and say what you would test next.`, kind: 'common-error' },
    { content: `Bar graph for separate groups; line graph for one thing changing over time or across a continuous range.`, kind: 'tip' },
    { content: `Read the TREND across all the data. One dip is not shrinking, and one jump is not a pattern.`, kind: 'tip' },
    { content: `Check the numbers printed on the axis. A steep-looking line can be a tiny change stretched across the page.`, kind: 'tip' },
    { content: `A conclusion has three parts: what the evidence shows with real numbers, how it answers the question, and what it does NOT show.`, kind: 'tip' },
    { content: `Results that disagree with your hypothesis are data, not mistakes. Change the answer to fit the evidence, never the reverse.`, kind: 'tip' },
    { content: `CORRELATION IS NOT CAUSATION. Two things changing together leaves three options open: A caused B, B caused A, or a third factor caused both.`, kind: 'tip' },
    { content: `More ice cream sold and more sunburns on the same days does not mean ice cream burns skin -- hot sunny weather raises both.`, kind: 'tip' },
    { content: `Only a controlled test, where one variable is changed on purpose and everything else is held the same, can show cause.`, kind: 'tip' },
    { content: `Don't say "causes" unless one variable was changed on purpose while everything else stayed the same. If you only *observed* two numbers moving together, the honest word is **correlated** — "X and Y increased together."`, kind: 'vocab-note' },
    { content: `Two lines going up on the same graph is not proof of anything. Before you write "causes," name one third thing that could be pushing both up (hotter weather, more students, more sunlight). If you can name one, you can't claim cause.`, kind: 'common-error' },
    { content: `One low reading does not flip a trend. Week 4 dipping from 9 cm to 8 cm inside a run of 4 → 15 cm is still growth. Compare the FIRST and LAST numbers, then describe the wobble as a detail: "grew overall, with one dip at week 4."`, kind: 'common-error' },
    { content: `Ask: is there anything real *between* my categories? Days 5 and 10 have a Day 7 in between → line graph. Brand A and Brand B have no brand in between → bar graph. "Over time" almost always means line.`, kind: 'tip' },
    { content: `Read the numbers on the side axis before calling a change big. A line that shoots to the top of the page might be a rise from 61 to 64 on an axis that starts at 60. Changing the scale changes the picture, never the data.`, kind: 'gotcha' },
    { content: `"My data didn't match my hypothesis" is not the same as "I did it wrong." Only recheck your procedure if something actually went wrong — a spill, a misread ruler. Write the number you got and say plainly that it does not support the hypothesis.`, kind: 'common-error' },
    { content: `A conclusion isn't finished until you write the third part: what the data does NOT show. Even a perfect upward line from one plant can't tell you what caused the growth if nothing was compared against it.`, kind: 'tip' },
    { content: `Watch for two variables that got changed together by accident. The compost plots were also the sunny plots — so compost and sunlight are tangled, and the taller tomatoes could be from either. Two changes at once means no cause can be named.`, kind: 'edge-case' },
  ],
};
