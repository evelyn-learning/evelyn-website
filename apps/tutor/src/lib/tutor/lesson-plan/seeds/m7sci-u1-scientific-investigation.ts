/**
 * Grade 7 Science (Life Science) — Inquiry: Asking Questions & Planning
 * Investigations.
 *
 * The procedure-led skills row that every later unit leans on (NGSS MS-LS1-1,
 * and the practices of asking questions, planning and carrying out
 * investigations, and constructing explanations). One procedure runs the whole
 * lesson: sort the question into testable or not, turn it into an
 * If/then/because hypothesis that could turn out wrong, then plan what will be
 * measured, how many trials, and what will count as evidence.
 *
 * The trap it exists to kill is the belief that a hypothesis which turns out
 * wrong means the experiment failed. A disproved hypothesis is a successful,
 * informative result, and this file says so in four places on purpose.
 *
 * The word "prove" appears only inside WRONG labels. Evidence supports or does
 * not support a hypothesis; science does not prove things true.
 *
 * NOTE FOR FUTURE AUTHORS: there are NO IMAGES in this course. Every setup and
 * every set of results in this file is written out in words, and every item is
 * solvable from the text printed inside it. Never write "see the table above".
 */

import type { LessonPlan } from '../types';
import { MS_PACING_THRESHOLDS, MS_SOURCE } from './_ms-shared';

export const SEED_M7SCI_U1_SCIENTIFIC_INVESTIGATION: LessonPlan = {
  id: 'evelyn.ms.m7sci.scientific-investigation.v1',
  title: 'Asking Questions & Planning Investigations',
  curriculum: 'MS',
  grade: '7',
  subject: 'science',
  topic: 'grade-7-life-science',
  locale: 'en',
  los: [
    {
      id: 'm7sci.scientific-investigation',
      standard: 'M7SCI-1.2',
      description:
        'Tell a testable question apart from one that cannot be answered with evidence, write a hypothesis in If/then/because form that could turn out to be wrong, and plan an investigation that names what will be measured, how many trials will be run, and what will count as evidence (NGSS MS-LS1-1, and the science and engineering practices of asking questions, planning and carrying out investigations, and constructing explanations).',
    },
  ],
  prerequisites: ['m7sci.characteristics-of-living-things'],
  followUps: ['m7sci.variables-and-controls'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Start from a real windowsill argument the student could settle today, and make the sorting of questions feel useful rather than picky.',
      script:
        'There are two plants on the classroom windowsill. One of them is noticeably taller than the other. Someone says the tall one is nicer. Someone else says the tall one gets more sun. Only one of those two claims can be settled by going and looking, and that is the whole difference this lesson is about. A science question is one you can gather evidence about. Today you learn how to spot those, how to turn one into a hypothesis that could turn out to be wrong, and how to plan an investigation that would actually answer it. Along the way we fix the biggest misunderstanding in all of science: that being wrong means you failed.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-asking-and-planning',
      kind: 'concept',
      goal: 'Install testable versus untestable, the If/then/because hypothesis, falsifiability, the value of a disproved hypothesis, and the three planning decisions.',
      keyIdeas: [
        'A TESTABLE QUESTION IS ONE YOU CAN GATHER EVIDENCE ABOUT. Ask yourself: could I go and collect something -- a measurement, a count, a careful observation -- that would answer this? WRONG: "Which plant on the windowsill is the prettiest?" That is an opinion, and no measurement settles it, so it is not a science question at all. CORRECT: "Do the plants closest to the window grow taller than the plants at the back of the room?" You can measure that with a ruler. Questions about what is right or fair, and questions about what an animal feels inside, are not testable either, because there is nothing you can go and measure.',
        'A HYPOTHESIS IS A PROPOSED EXPLANATION, NOT A GUESS. A guess is a name you pull out of the air. A hypothesis says what you think will happen AND gives the reason you think it. The shape that keeps you honest is: IF something is changed, THEN something measurable will happen, BECAUSE of a reason. Example: IF bean seeds are kept in a warm room, THEN they will sprout in fewer days than seeds kept in a cold room, BECAUSE seeds sprout faster when they are warmer.',
        'A HYPOTHESIS HAS TO BE ABLE TO TURN OUT WRONG. Before you start, you should be able to say what result would count AGAINST your idea. If nothing you can imagine would count against it, the hypothesis is not doing any work. "Plants like good conditions" cannot be wrong, because nothing measurable is named. "The warm seeds will sprout in fewer days" can be wrong, because the cold seeds might sprout first.',
        'A HYPOTHESIS THAT TURNS OUT WRONG IS A SUCCESSFUL RESULT. This is the most important idea in the lesson. If your evidence does not support your hypothesis, you have learned something real: that explanation is not the right one, and nobody has to test it again. WRONG: "My hypothesis was wrong, so my experiment failed." CORRECT: "My evidence did not support my hypothesis, so I know more than I did yesterday." Notice the wording too. Evidence SUPPORTS or DOES NOT SUPPORT an idea. Science does not prove things true, and a scientist who says "my experiment proved it" is overclaiming.',
        'PLANNING MEANS MAKING THREE DECISIONS BEFORE YOU TOUCH ANYTHING. First, WHAT WILL YOU MEASURE, in what unit, with what instrument: days until the first sprout, height in centimeters with a ruler, number of mealworms on the dark side counted every minute. Second, HOW MANY TRIALS: never one seed against one seed, because a single seed can be a dud for reasons that have nothing to do with your idea. Ten in each group lets you compare averages. Third, WHAT WILL COUNT AS EVIDENCE, decided in advance: "if the warm seeds average fewer days, that supports my hypothesis; if the two groups average about the same, it does not." Deciding afterward is how people fool themselves.',
        'THERE IS NO SINGLE FIXED SCIENTIFIC METHOD IN A LOCKED ORDER. Real investigation loops and backtracks. You start measuring and discover your ruler is the wrong tool, so you change the plan. Your results surprise you, so you go back and ask a better question. You notice something you were not looking for and it becomes the next investigation. The numbered list on a poster is a summary of the moves, not a recipe you must follow top to bottom exactly once.',
      ],
      vocabulary: [
        { term: 'testable question', definition: 'a question you can answer by gathering evidence, such as a measurement or a count.' },
        { term: 'hypothesis', definition: 'a proposed explanation that predicts a measurable result and could turn out to be wrong.' },
        { term: 'evidence', definition: 'the observations and measurements you actually collect, which support or do not support a hypothesis.' },
        { term: 'trial', definition: 'one run of an investigation; several trials are used so a single odd result cannot decide the answer.' },
        { term: 'observation', definition: 'something you notice using your senses or an instrument, recorded as it happened rather than as you hoped.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-question-to-hypothesis',
      kind: 'worked_example',
      problem:
        'Maya looks at the classroom windowsill and asks, "Which plant is the prettiest?" Her teacher asks her for a science question instead. Turn what Maya is curious about into a testable question, and then write a hypothesis for it.',
      steps: [
        'Test the original question first. Ask what Maya could go and measure to settle it. There is nothing. Two people can look at the same two plants and disagree forever, and no ruler, scale or timer breaks the tie. It is an opinion question, so it is not testable.',
        'Find the measurable thing hiding underneath. Maya noticed that one plant is bigger than the other, and the bigger one sits right against the glass. Size and position are both things you can measure.',
        'Write the testable question so that it names what gets measured: "Do the plants kept on the windowsill grow taller than the plants kept on the shelf at the back of the room?" Now the answer comes from a ruler, not from a preference.',
        'Turn it into a hypothesis using If, then, because. IF bean plants are kept on the windowsill, THEN after three weeks they will be taller in centimeters than plants kept at the back of the room, BECAUSE plants near the window receive more light.',
        'Check that the hypothesis could be wrong. It could: the back-of-the-room plants might end up taller, or the two groups might come out about the same height. Because a result exists that would count against it, this hypothesis is doing real work.',
        'Notice what changed. The word prettiest disappeared and the words taller, centimeters and three weeks appeared. That swap, from an opinion word to a measurement word, is the whole move.',
      ],
      answer:
        'Testable question: do plants kept on the windowsill grow taller than plants kept at the back of the room? Hypothesis: IF bean plants are kept on the windowsill, THEN after three weeks they will be taller in centimeters than plants kept at the back of the room, BECAUSE plants near the window receive more light. The original question was untestable because prettiness cannot be measured.',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-plan-the-investigation',
      kind: 'worked_example',
      problem:
        'Ben has noticed that bread goes moldy quickly on the kitchen counter and slowly in the refrigerator. His question is: does bread grow mold in fewer days at room temperature than in the refrigerator? His hypothesis is: IF a slice of bread is left at room temperature, THEN mold will appear on it in fewer days than on a slice kept in the refrigerator, BECAUSE mold grows faster when it is warm. Plan an investigation that could actually answer his question.',
      steps: [
        'Decide what will be measured, and in what unit. The measurement is the number of days until the first spot of mold is visible on a slice. Ben will look at every slice once a day, at about the same time, and write down the day for each one.',
        'Decide how many trials. One slice on the counter against one slice in the refrigerator is not enough, because a single slice might carry more mold spores by chance. Ben uses six slices at room temperature and six in the refrigerator, all from the same loaf, and will compare the average number of days for each group.',
        'Decide what counts as evidence, and decide it now rather than later. If the room-temperature slices average clearly fewer days than the refrigerator slices, that supports the hypothesis. If the two groups average about the same, or the refrigerator slices go moldy sooner, the evidence does not support it.',
        'Sanity-check the plan against the question. The question was about days until mold appears, and the plan measures days until mold appears. Those match, so the results will actually answer what was asked.',
        'Suppose the results come back like this. Room-temperature slices: 4, 5, 4, 6, 5, 4 days. Refrigerator slices: 11, 13, 12, 14, 12, 12 days. The room-temperature average is about 5 days and the refrigerator average is about 12 days, so the evidence supports the hypothesis.',
        'Write the conclusion carefully. CORRECT: "The evidence supports the hypothesis that bread grows mold in fewer days at room temperature." WRONG: "This proves that cold stops mold." Ben tested one loaf in one kitchen, and evidence supports an explanation rather than proving it.',
      ],
      answer:
        'Measure the number of days until the first visible mold spot, checking once a day. Use six slices from the same loaf at room temperature and six in the refrigerator, then compare the group averages. Decide in advance that clearly fewer days at room temperature supports the hypothesis and that similar averages do not. With averages of about 5 days and about 12 days, the evidence supports the hypothesis -- it does not prove it.',
      estimatedMinutes: 3,
    },
    {
      id: 'try-testable-question',
      kind: 'try_yourself',
      problem:
        'A class keeps mealworms in a shallow tray. Which of these questions is a TESTABLE science question?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Which mealworm in the tray is the cutest?' },
        { id: 'b', text: 'What do the mealworms feel when the lamp is switched on?' },
        { id: 'c', text: 'Should our class be allowed to keep mealworms in the classroom?' },
        { id: 'd', text: 'Do more mealworms end up on the covered end of the tray than on the brightly lit end?', correct: true },
      ],
      expectedAnswer: 'Do more mealworms end up on the covered end of the tray than on the brightly lit end?',
      hints: [
        'For each question, ask yourself what you could go and collect that would answer it. A count, a measurement, or a careful observation all work.',
        'Questions about what is cutest are opinions, questions about what should be allowed are about rules, and there is no instrument that reads out what an insect feels inside.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-write-hypothesis',
      kind: 'try_yourself',
      problem:
        'Rosa has a testable question: do bean seeds sprout in fewer days in a warm room than in a cold room? Which of these is the best hypothesis for that question?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'I think the warm seeds will be better than the cold seeds.' },
        { id: 'b', text: 'Do bean seeds sprout faster when they are kept warm?' },
        {
          id: 'c',
          text: 'If bean seeds are kept in a warm room, then they will sprout in fewer days than seeds kept in a cold room, because seeds sprout faster when they are warmer.',
          correct: true,
        },
        { id: 'd', text: 'Bean seeds are interesting plants to grow on a windowsill.' },
      ],
      expectedAnswer:
        'If bean seeds are kept in a warm room, then they will sprout in fewer days than seeds kept in a cold room, because seeds sprout faster when they are warmer.',
      hints: [
        'A hypothesis is a statement, not a question, and it has three parts: If something is changed, then something measurable happens, because of a reason.',
        'Check each choice for a measurable result. The word better is not measurable, and a choice that is still a question has not been turned into a hypothesis yet.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-plan-the-trials',
      kind: 'try_yourself',
      problem:
        'Rosa now has to plan her seed investigation. Which plan would give her the best evidence about whether bean seeds sprout in fewer days in a warm room?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Put one seed in the warm room and one seed in the cold room, and see which one sprouts first.' },
        { id: 'b', text: 'Put twenty seeds in the warm room, record how many days each one takes to sprout, and compare that with how she remembers the seeds doing last year.' },
        { id: 'c', text: 'Put ten seeds in the warm room and ten seeds in the cold room, and at the end decide by eye which group looks healthier.' },
        {
          id: 'd',
          text: 'Put ten seeds in the warm room and ten seeds in the cold room, and record the number of days each seed takes to sprout.',
          correct: true,
        },
      ],
      expectedAnswer:
        'Put ten seeds in the warm room and ten seeds in the cold room, and record the number of days each seed takes to sprout.',
      hints: [
        'Check the plan against the three planning decisions: what gets measured, how many trials, and what will count as evidence.',
        'One seed against one seed can be decided by a single dud. Looking healthier is not a measurement. A memory from last year is not recorded data, and it leaves her with no cold group at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-wrong-means-failed',
      kind: 'misconception_check',
      question:
        'Dev predicted that mealworms would gather at the warm end of a tray. He ran the investigation carefully and the mealworms spread out evenly instead. He writes, "My experiment failed because my hypothesis was wrong, so I will run it again until it works." What went wrong in his thinking?',
      commonErrors: [
        {
          answer: 'My hypothesis was wrong, so my experiment failed.',
          misconception:
            'Treating the hypothesis as something you are supposed to defend, so that any result disagreeing with it counts as a mistake by the experimenter.',
          correctsTo:
            'An experiment fails when the plan does not answer the question -- the wrong thing was measured, or only one trial was run. Dev did neither of those. He asked a testable question, made a prediction that could be wrong, collected evidence, and found out that warmth is not what gathers those mealworms. That is a successful investigation with a useful result, and it is real information nobody had before. Rerunning it until it agrees with him would be the actual failure, because it throws away the honest evidence. Watch the words too. WRONG: "The results proved my hypothesis." CORRECT: "The evidence supports my hypothesis" or "the evidence does not support my hypothesis." Science does not prove things true.',
        },
        {
          answer: 'I did the six steps of the scientific method in order, so my investigation must be correct.',
          misconception:
            'Believing there is one rigid scientific method that runs top to bottom exactly once, so following the list is what makes work scientific.',
          correctsTo:
            'The poster list is a summary of the moves scientists make, not a recipe. Real investigation loops and backtracks constantly: you change the plan when the measurement turns out to be impossible, you go back and ask a sharper question when the results surprise you, and you often notice something you were not looking for. What makes work scientific is that the question is testable, the evidence is collected honestly, and the conclusion follows from the evidence -- not the order the steps were done in.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A testable question is one you can gather evidence about. Prettiest, cutest and should are not science questions.',
        'A hypothesis is a proposed explanation, not a guess. Write it as If something is changed, then something measurable happens, because of a reason.',
        'A hypothesis must be able to turn out wrong. If no imaginable result would count against it, it is not doing any work.',
        'A hypothesis that turns out wrong is a successful, informative result -- not a failed experiment.',
        'Evidence supports or does not support a hypothesis. Science does not prove things true.',
        'Plan three things before you start: what you will measure and in what unit, how many trials, and what will count as evidence.',
        'One seed, one slice or one mealworm is a story. Several trials compared as averages are evidence.',
        'There is no single fixed order of steps. Real investigation loops and backtracks.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: MS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '1', cedTopic: '1.2', cedTitle: 'Asking Questions & Planning Investigations' },
  pacingThresholds: MS_PACING_THRESHOLDS,
};
