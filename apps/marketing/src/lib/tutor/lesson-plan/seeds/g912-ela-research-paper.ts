/**
 * Grades 9-12 ELA — Research Paper Structure.
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_RESEARCH_PAPER: LessonPlan = {
  id: 'evelyn.g912.ela.research-paper.v1',
  title: 'Grades 9-12 ELA — Research Paper Structure',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.research-paper',
      description: 'Plan and write an academic research paper with a clear thesis, structured argument, integrated sources, and academic voice.',
      standard: 'CCSS.ELA-LITERACY.W.11-12.7',
    },
  ],
  prerequisites: ['g912.ela.argument-analysis'],
  followUps: ['g912.ela.synthesis-essay'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'A research paper isn\'t just a long essay — it\'s a structured argument backed by sustained engagement with sources.',
      script: 'College demands research papers from day one. The high-school version trains the same muscles: focused thesis, multi-section argument, source integration, formal citation. Today we drill the structure that distinguishes academic writing from personal opinion.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-research-paper',
      kind: 'concept',
      goal: 'Components + structure + voice + integration.',
      keyIdeas: [
        'STRUCTURE: introduction (with thesis) → background section → multiple body sections (each developing one premise) → counterargument section → conclusion → works cited.',
        'THESIS: a debatable, focused, complex statement of position. Not "X is important" but "X is preferable to Y because of A, B, and C."',
        'BACKGROUND: orient the reader to the topic, key terminology, debate context.',
        'BODY SECTIONS: each develops ONE premise of the thesis. Topic sentence + evidence + analysis + transition.',
        'COUNTERARGUMENT: address opposing view + rebut. Demonstrates fair-mindedness.',
        'CONCLUSION: not a summary. Implications. So what? What should the reader DO with the argument?',
        'ACADEMIC VOICE: formal, third-person where possible, precise. Avoid contractions, slang, "I think."',
        'SOURCE INTEGRATION: signal phrase + quote/paraphrase + citation + analysis. Don\'t drop quotes; don\'t pile evidence without analysis.',
        'CITATION (MLA, APA, or Chicago — follow assignment): in-text citations + Works Cited / References / Bibliography.',
        'EVIDENCE TYPES: scholarly journal articles, books from academic publishers, reputable journalism, primary sources. Avoid blogs, Wikipedia, unsigned websites.',
      ],
      vocabulary: [
        { term: 'thesis', definition: 'the central, debatable claim that a research paper develops and defends.' },
        { term: 'works cited', definition: 'the alphabetised list of sources at the end of a paper, in MLA format (or References in APA).' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-thesis',
      kind: 'worked_example',
      problem: 'Improve this thesis: "Climate change is an important issue."',
      steps: [
        'Original is too vague — not debatable, not specific.',
        'Make it FOCUSED: which aspect of climate change?',
        'Make it DEBATABLE: a position someone could disagree with.',
        'Make it COMPLEX: include the WHY.',
        'Revised: "Although market-based incentives have driven much progress in renewable energy, government regulation remains essential to address climate change because voluntary efforts have proven insufficient at scale."',
        'Now it has a position (regulation needed), an acknowledgement of the other side (market incentives), and a reason (insufficient scale).',
      ],
      answer: 'A focused, debatable, complex thesis with concession structure.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Write a thesis statement for a paper arguing FOR mandatory civic education in high schools. (Make it debatable, focused, with a reason.)',
      expectedAnswer: 'Sample: "Mandatory civic education should be required in all high schools because declining youth voter turnout and limited understanding of government structure threaten democratic continuity."',
      responseFormat: 'free',
      hints: [
        'What\'s your position? (mandatory civic ed should be required)',
        'Why? (give 1-2 reasons)',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-thesis-fact',
      kind: 'misconception_check',
      question: 'A student writes thesis: "Climate change is happening." Why is this a weak research thesis?',
      commonErrors: [
        {
          answer: '"Climate change is happening"',
          misconception: 'Stating a fact as a thesis.',
          correctsTo: 'A thesis must be DEBATABLE. "Climate change is happening" is well-established scientific consensus — there\'s no opposing view to argue against in serious research. A thesis takes a position requiring defence: "The most effective response to climate change is X (rather than Y)" — now there\'s something to argue. Pick a debate, not a fact.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Structure: intro + thesis → background → body sections (one per premise) → counterargument → conclusion → works cited.',
        'Thesis: focused, debatable, complex.',
        'Academic voice: formal, third-person, precise.',
        'Integrate sources: signal phrase + quote/paraphrase + citation + analysis.',
        'Counterargument is required.',
        'Reputable sources only.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the COUNTERARGUMENT section often the strongest part of a research paper?',
      hint: 'Acknowledging opposing views shows the writer has done the homework. It pre-empts criticism. It builds credibility (ethos). It strengthens the actual argument by surviving challenge. Skipping counterargument signals weakness, intellectual cowardice, or laziness. Strong papers steel-man the opposition before refuting it.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
