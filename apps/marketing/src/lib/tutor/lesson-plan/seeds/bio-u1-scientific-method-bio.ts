/**
 * Biology — Unit 1: Scientific Inquiry & Experimental Design in Biology.
 *
 * The skills plan that every later Biology unit leans on (NGSS SEP-3, SEP-4).
 * Almost every student error here is a BOOKKEEPING error about which quantity
 * the experimenter sets, which one they measure, and which ones they pin down —
 * so the concept segment is organized around that three-way sort, then around
 * the two interpretation traps (one group is not enough; a pattern is not a
 * cause). Worked examples stay on real biology: a fertilizer trial and a drug
 * trial with a placebo group.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_BIO_U1_SCIENTIFIC_METHOD_BIO: LessonPlan = {
  id: 'evelyn.hs.bio.scientific-method-bio.v1',
  title: 'Scientific Inquiry & Experimental Design in Biology',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'biology',
  locale: 'en',
  los: [
    {
      id: 'bio.scientific-method-bio',
      standard: 'BIO-1.2',
      description:
        'Design and evaluate a biological investigation by identifying the independent, dependent and controlled variables, distinguishing the control group from the experimental group, stating a testable if/then hypothesis, and judging whether sample size and study design support a causal claim (NGSS SEP-3, SEP-4).',
    },
  ],
  prerequisites: ['bio.characteristics-of-life'],
  followUps: ['bio.water-and-macromolecules'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame experimental design as the tool that decides which medical and agricultural claims are real.',
      script:
        'Every drug in your medicine cabinet had to beat a sugar pill in a controlled trial before anyone was allowed to sell it — and plenty of promising drugs lost. The same design decides whether a fertilizer really grows bigger crops, whether a wetland restoration really brings back the frogs, and whether a headline about coffee and liver disease means anything at all. In this lesson you learn the sort that makes an experiment trustworthy: what you change, what you measure, and what you refuse to let move. Every unit after this one is built on it.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-variables-and-controls',
      kind: 'concept',
      goal: 'The three variable roles, control vs experimental group, the if/then hypothesis, replication, and correlation vs causation.',
      keyIdeas: [
        'THE INDEPENDENT VARIABLE — the ONE thing the experimenter deliberately changes. In a fertilizer trial it is the amount of fertilizer; in a drug trial it is whether the volunteer gets the drug. If you cannot point to who set its value, it is not an independent variable.',
        'THE DEPENDENT VARIABLE — the outcome you MEASURE, which "depends" on the independent variable. Plant height in centimeters, number of asthma attacks per month, percentage of seeds that germinate. It always comes with a unit and a measuring instrument.',
        'CONTROLLED VARIABLES — every other factor you deliberately hold IDENTICAL across all groups: soil type, pot size, water volume, temperature, hours of light, age of the test organisms. These are not the "control group"; they are the conditions that make the comparison fair. Any factor that changes alongside the independent variable is a CONFOUNDING variable, and it ruins the experiment because you can no longer tell which change caused the result.',
        'CONTROL GROUP VS EXPERIMENTAL GROUP — the EXPERIMENTAL group receives the treatment; the CONTROL group is treated identically in every way except the treatment, and provides the baseline you compare against. In human trials the control group gets a PLACEBO — an identical pill or injection with no active drug — so that expectation, not chemistry, cannot explain a difference.',
        'THE HYPOTHESIS IS A TESTABLE IF/THEN PREDICTION — "IF bean plants receive more nitrogen fertilizer, THEN their average height after four weeks will increase." It names the independent variable, names the measured dependent variable, and could turn out false. "Fertilizer is good for plants" is not a hypothesis: nothing is measured and nothing could disprove it. A hypothesis is also NOT a guess you are trying to defend — an experiment that refutes it is a successful experiment.',
        'SAMPLE SIZE AND REPLICATION — one plant or one patient tells you almost nothing, because individual organisms vary for a hundred reasons. Use many individuals per group (REPLICATION within the study), report the AVERAGE rather than a single case, and expect independent researchers to repeat the whole study. Small samples are exactly how a random fluke gets mistaken for an effect.',
        'CORRELATION IS NOT CAUSATION — an OBSERVATIONAL study finds that two things vary together; only a controlled EXPERIMENT, where the researcher sets the independent variable and holds everything else steady, can show that one causes the other. When two variables are correlated, always ask whether a third factor drives both, or whether the causation runs backwards.',
      ],
      vocabulary: [
        { term: 'independent variable', definition: 'the single factor the experimenter deliberately changes between groups.' },
        { term: 'controlled variable', definition: 'a factor deliberately held identical across all groups so it cannot explain the results.' },
        { term: 'placebo', definition: 'an inactive treatment identical in appearance to the real one, given to the control group in a human trial.' },
        { term: 'confounding variable', definition: 'an uncontrolled factor that changes along with the independent variable, making the cause of a result impossible to identify.' },
      ],
      suggestedTools: ['show_table', 'show_diagram'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-fertilizer-trial',
      kind: 'worked_example',
      problem:
        'A researcher wants to know whether a nitrogen fertilizer increases bean plant growth. She plants 80 bean seeds of the same variety in identical pots of the same potting soil, and splits them into four groups of 20. Group 1 gets no fertilizer, group 2 gets 2 grams per week, group 3 gets 4 grams per week, group 4 gets 6 grams per week. All 80 pots sit in the same greenhouse at 22 °C with 14 hours of light per day and 200 mL of water every second day. After four weeks she measures the height of every plant in centimeters and averages each group. Identify the independent variable, the dependent variable, three controlled variables, and the control group, and state a testable hypothesis.',
      steps: [
        'Find what she SET: the weekly amount of fertilizer, deliberately assigned at four levels (0, 2, 4 and 6 grams). That is the independent variable.',
        'Find what she MEASURED at the end: plant height in centimeters after four weeks, averaged per group. That is the dependent variable.',
        'List what she deliberately held the SAME across all four groups: seed variety, pot and soil type, temperature (22 °C), light (14 hours per day), and water (200 mL every second day). Those are controlled variables — they are the reason any height difference can be blamed on the fertilizer.',
        'Find the baseline: group 1, the 20 plants receiving no fertilizer, is the control group. Groups 2, 3 and 4 are experimental groups. Note the sample size: 20 plants per group, so a single unusually tall plant cannot swing the group average.',
        'Write the hypothesis in if/then form, naming both variables and a measurable outcome: IF bean plants receive more weekly nitrogen fertilizer, THEN their average height after four weeks will be greater.',
      ],
      answer:
        'Independent variable: weekly grams of fertilizer (0, 2, 4, 6). Dependent variable: average plant height in cm after four weeks. Controlled variables include seed variety, soil and pot, 22 °C temperature, 14 hours of light, 200 mL water per two days. Control group: the 20 unfertilized plants. Hypothesis: IF bean plants receive more nitrogen fertilizer, THEN their average height after four weeks will increase.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-confounded-trial',
      kind: 'worked_example',
      problem:
        'A gardener tests the same fertilizer at home. He puts 3 fertilized tomato plants on a sunny south-facing windowsill and 3 unfertilized plants on a shaded shelf across the room, watering the windowsill plants whenever the soil looks dry and the shelf plants once a week. After three weeks the fertilized plants average 31 cm and the unfertilized plants average 18 cm. He concludes the fertilizer caused the extra growth. Explain why his conclusion is not supported, and describe how to fix the design.',
      steps: [
        'Name the intended independent variable: fertilizer or no fertilizer. Name the dependent variable: average plant height after three weeks. So far so good.',
        'Check whether anything ELSE differs between the two groups. It does — twice. The fertilized plants also got much more light, and they also got more water. Light and water are confounding variables: they changed along with the fertilizer.',
        'State the consequence precisely: the fertilized plants really did grow taller, but the extra 13 cm could be caused by the fertilizer, by the sunlight, by the water, or by any combination. The experiment cannot separate them, so it supports no causal claim about fertilizer at all.',
        'Check the sample size too: 3 plants per group. Tomato seedlings vary a lot on their own, so even a clean version of this design would need many more plants per group before an average difference means anything.',
        'Fix it: put ALL plants in the same light, give every plant the same measured volume of water on the same schedule, use the same soil and pot size and seedling age, and let fertilizer be the only difference — then raise each group to 20 or more plants and compare the group averages.',
      ],
      answer:
        'The trial is confounded: light and water differ between the groups along with the fertilizer, so the height difference cannot be attributed to fertilizer. Fix it by holding light, water, soil, pot and seedling age identical so fertilizer is the only variable that changes, and by using many more plants per group.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-dependent',
      kind: 'try_yourself',
      problem:
        'A student grows 40 identical radish seedlings in identical pots of the same soil. Ten plants receive 0 grams of fertilizer per week, ten receive 2 grams, ten receive 4 grams and ten receive 6 grams. Every pot gets 100 mL of water daily and 12 hours of light per day at the same temperature. After four weeks the student measures each plant with a ruler. Which of these is the DEPENDENT variable?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The weekly amount of fertilizer each group receives' },
        { id: 'b', text: 'The 12 hours of light each plant receives per day' },
        { id: 'c', text: 'The height of the plants in centimeters after four weeks', correct: true },
        { id: 'd', text: 'The number of plants placed in each of the four groups' },
      ],
      expectedAnswer: 'The height of the plants in centimeters after four weeks',
      hints: [
        'The dependent variable is the outcome you MEASURE at the end, not something the student decided in advance.',
        'The student sets the fertilizer amount, holds the light and water steady, and chooses the group sizes — only one quantity is read off a ruler after four weeks.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-placebo-purpose',
      kind: 'try_yourself',
      problem:
        'A medical team tests a new asthma drug on 200 volunteers. One hundred receive a capsule containing the drug; the other hundred receive an identical-looking capsule containing no drug. Neither group is told which capsule they received, and both groups are monitored the same way for six months. What is the purpose of the group receiving the capsule with no drug?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'It doubles the sample size, which is what makes the results reliable' },
        { id: 'b', text: 'It is the control group: it shows what happens without the drug, so any difference in the treated group can be attributed to the drug itself', correct: true },
        { id: 'c', text: 'It is the experimental group, because it is the group the researchers are comparing against' },
        { id: 'd', text: 'It tests a second hypothesis at the same time — whether swallowing capsules on its own relieves asthma' },
      ],
      expectedAnswer:
        'It is the control group: it shows what happens without the drug, so any difference in the treated group can be attributed to the drug itself',
      hints: [
        'Ask which group receives the treatment and which one is identical in every way EXCEPT the treatment.',
        'Without a baseline you cannot tell whether the treated volunteers improved because of the drug or because asthma varies with the seasons anyway.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-correlation-causation',
      kind: 'try_yourself',
      problem:
        'Researchers survey 5,000 adults and record how much coffee each one drinks. They find that the heaviest coffee drinkers have a noticeably lower rate of a certain liver disease than the people who drink none. A news headline announces that coffee prevents liver disease. What is the strongest reason this conclusion is not yet justified?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'A sample of 5,000 people is far too small for any pattern to show up' },
        { id: 'b', text: 'The correlation is strong, so causation is established — the headline is fine' },
        { id: 'c', text: 'Coffee intake should have been treated as the dependent variable and liver disease as the independent variable' },
        {
          id: 'd',
          text: 'Nobody assigned the coffee: this is an observational study with no controlled variables, so a third factor such as alcohol use or exercise could explain both the coffee habit and the lower disease rate',
          correct: true,
        },
      ],
      expectedAnswer:
        'Nobody assigned the coffee: this is an observational study with no controlled variables, so a third factor such as alcohol use or exercise could explain both the coffee habit and the lower disease rate',
      hints: [
        'Ask who set the independent variable. Did the researchers decide how much coffee each person drank, or did they just write down what people already did?',
        'When two things vary together, list the other ways heavy coffee drinkers might differ from non-drinkers — any of those could be the real cause.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-controlled-vs-control-group',
      kind: 'misconception_check',
      question:
        'A student writes: "My experiment had a control group, so all my variables were controlled — I gave the treated mice the new diet and housed them in the warm room, and the control mice ate the normal diet in the regular room." What went wrong?',
      commonErrors: [
        {
          answer: 'Having a control group means the experiment is controlled',
          misconception:
            'Collapsing two different ideas that share a word: the CONTROL GROUP (the untreated comparison group) and the CONTROLLED VARIABLES (every factor held identical across groups).',
          correctsTo:
            'A control group only helps if it is identical to the experimental group in every way EXCEPT the treatment. Here the two groups differ in diet AND in room temperature, so temperature is a confounding variable and any difference in the mice cannot be blamed on the diet. Fix it by housing both groups in the same room, at the same temperature, with the same cage size, light cycle and handling — leaving diet as the only difference.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Independent variable = what you CHANGE; dependent variable = what you MEASURE; controlled variables = everything you hold IDENTICAL.',
        'The control group gets no treatment (or a placebo) and is otherwise identical to the experimental group — it is the baseline you compare against.',
        'A hypothesis is a testable IF/THEN prediction naming both variables, and it must be capable of turning out false.',
        'Any factor that changes along with the independent variable is a confounding variable, and it makes the result uninterpretable.',
        'Use many individuals per group and compare averages; one organism is a story, not evidence.',
        'Correlation is not causation — only a controlled experiment, not an observational survey, can establish a cause.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'Scientific Inquiry & Experimental Design in Biology' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
