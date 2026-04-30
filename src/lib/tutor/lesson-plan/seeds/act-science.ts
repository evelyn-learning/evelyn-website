/**
 * ACT — Science: 40 questions, 35 minutes, 6-7 passages.
 *
 * The most-feared section because the name says "Science", but it
 * doesn't actually require scientific KNOWLEDGE — it tests
 * SCIENTIFIC REASONING with charts, graphs, and experiments.
 * Strategy: dive directly into questions, hunt for data in figures,
 * minimize reading.
 */

import type { LessonPlan } from '../types';

export const SEED_ACT_SCIENCE: LessonPlan = {
  id: 'evelyn.testprep.act.science.v1',
  title: 'ACT Science: Reasoning Through Data',
  curriculum: 'ACT',
  grade: '11',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.science',
      description: 'Apply data interpretation and scientific reasoning strategies to ACT Science.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe ACT Science from "memorize chemistry" to "read graphs fast".',
      script: 'Most students panic when they hear ACT Science — but here\'s the secret: ACT Science is not really a science test. It\'s a graph-and-data-reading test where the topics happen to be scientific. You don\'t need to know chemistry. You need to know how to read a graph and follow logic. Re-framing this section is half the battle.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-act-science',
      kind: 'concept',
      goal: 'Three passage types + question types + strategy.',
      keyIdeas: [
        'THREE passage types:',
        '  DATA REPRESENTATION (~30%): graphs, tables, charts. Read the data, answer questions about it. EASIEST — start here.',
        '  RESEARCH SUMMARIES (~50%): describe 2-3 experiments. Compare them, predict outcomes.',
        '  CONFLICTING VIEWPOINTS (~20%): two or more scientists/students offer competing explanations of the same phenomenon. ONE per test. HARDEST — most reading.',
        'STRATEGY:',
        '  Do passages OUT OF ORDER if you want — start with Data Representation (fastest), then Research, save Conflicting Viewpoints for last.',
        '  For Data Rep + Research: dive STRAIGHT to the questions. Read minimum text — just enough to identify what the experiment is testing. Most info is in the figures.',
        '  For Conflicting Viewpoints: you HAVE to read the viewpoints — figures alone won\'t answer.',
        'QUESTION TYPES:',
        '  DATA LOOKUP: find a value in a chart or graph. Easiest. Answer should be RIGHT THERE.',
        '  TREND: "as X increases, Y __" — read the direction in the graph.',
        '  EXPERIMENT design: "what was the controlled variable?" or "what would change if Y was halved?"',
        '  COMBINE figures: pull data from multiple charts to answer.',
        '  CONFLICTING VIEWPOINTS: "which scientist would agree with this statement?" — match to viewpoint.',
        'TIME BUDGET: ~5 minutes per passage. Conflicting viewpoints may take 6-7 min; dual data representations 4 min.',
        'YOU DO NOT need to memorize science facts. Only basic concepts (variables, controls, units like °C/grams). Everything else is in the passage.',
      ],
      vocabulary: [
        { term: 'data representation', definition: 'graph/chart-based ACT Science passage.' },
        { term: 'research summary', definition: 'experiment-based ACT Science passage.' },
        { term: 'conflicting viewpoints', definition: 'opposing-scientists passage type.' },
      ],
      suggestedTools: ['show_function_graph', 'show_table'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-trend',
      kind: 'worked_example',
      problem: 'A graph shows temperature on x-axis (10°C to 90°C) and reaction rate on y-axis. The line slopes up. Question: "Based on the graph, as temperature increases, the reaction rate ___."',
      steps: [
        'Read the graph: x = temp, y = rate, line goes UP left-to-right.',
        'Direction: as temperature increases, rate increases.',
        'Pick the answer that says "increases" or similar.',
        'No chemistry knowledge needed — just trend-reading.',
      ],
      answer: 'Increases',
      estimatedMinutes: 2,
    },
    {
      id: 'worked-controlled-variable',
      kind: 'worked_example',
      problem: 'Three experiments differ only in temperature; pH and concentration are kept the same in all three. Question: "What was a controlled variable in this study?"',
      steps: [
        'CONTROLLED variable = kept constant across experiments.',
        'INDEPENDENT variable = what was varied (temperature here).',
        'DEPENDENT variable = what was measured.',
        'Answer: pH (or concentration) — both were held constant. Temperature was the independent variable, NOT the controlled one.',
        'This is one of the most-tested ACT Science concepts. Know variable types.',
      ],
      answer: 'pH or concentration',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In an ACT Science passage, what should you read FIRST: the introduction text, or the figures and tables?',
      expectedAnswer: 'Figures and tables.',
      responseFormat: 'free',
      hints: [
        'Most data is in the figures.',
        'You can often answer questions without reading the intro at all.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-need-knowledge',
      kind: 'misconception_check',
      question: 'Mira says "I\'ll do badly on ACT Science because I haven\'t taken physics." Is that the right concern?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating ACT Science as content-knowledge dependent.',
          correctsTo: 'No. ACT Science requires very little prior science KNOWLEDGE. It tests data interpretation. Even if a passage uses fluid dynamics or genetics jargon, the data needed to answer is in the figures and tables. Strong test takers with NO physics background still ace ACT Science. The skill is REASONING + GRAPH READING.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three passage types: Data Rep, Research Summary, Conflicting Viewpoints.',
        '~5 min per passage. Conflicting Viewpoints last.',
        'Skip the intro text; dive into figures.',
        'Variables: independent (varied), dependent (measured), controlled (kept same).',
        'No deep science knowledge required — just reasoning.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'On the Conflicting Viewpoints passage, what\'s a quick technique for answering "which scientist would agree" questions?',
      hint: 'Annotate each viewpoint\'s 1-2 KEY claims as you read. Then for each question, match the question to whichever viewpoint\'s claim it fits.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
