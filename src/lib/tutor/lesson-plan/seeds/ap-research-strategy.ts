/**
 * AP Research — academic paper + presentation strategy.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_RESEARCH_STRATEGY: LessonPlan = {
  id: 'evelyn.ap.research.strategy.v1',
  title: 'AP Research paper + presentation strategy',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ela',
  topic: 'test-prep',
  locale: 'en',
  los: [
    {
      id: 'apresearch.strategy',
      description: 'Plan and execute a year-long AP Research investigation: question, methodology, literature review, original data collection or analysis, written paper, oral defense.',
      standard: 'AP-RESEARCH',
    },
  ],
  prerequisites: ['apseminar.strategy'],
  followUps: [],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'AP Research is your first real academic paper.',
      script: 'AP Research is the second half of the AP Capstone diploma. The whole year goes into ONE original research project — your topic, your method, your paper. By May you\'ll have a 4000-5000 word academic paper with a literature review, methodology, results, and discussion. Plus a 15-20 minute presentation and oral defense. This is closer to a college thesis than to any other AP.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-process',
      kind: 'concept',
      goal: 'The research process and scoring components.',
      keyIdeas: [
        'COMPONENT 1 — ACADEMIC PAPER (75% of score): 4000-5000 words. Sections: Introduction (with research question + significance), Literature Review, Methodology, Results, Discussion + Conclusion, References, Appendices.',
        'COMPONENT 2 — PRESENTATION + ORAL DEFENSE (25%): 15-20 min talk presenting your work; followed by ~10 min Q&A from a panel.',
        'CHOOSING A QUESTION: NARROW + ANSWERABLE + ORIGINAL. Avoid "Is climate change real?" (too broad, settled). Try "How does coastal city X\'s flood-resilience messaging affect resident preparedness behavior?" Specific population, measurable variable.',
        'LITERATURE REVIEW: 25-40 sources, mostly peer-reviewed. Synthesize the EXISTING knowledge, identify the GAP your research fills. Not a list — a thematic argument about what\'s known and what\'s missing.',
        'METHODOLOGY: clearly justified. Quantitative (surveys, experiments, data analysis), Qualitative (interviews, case studies, ethnography), or Mixed. Explain WHY this method fits your question. Address ethics (IRB approval if humans involved).',
        'DATA COLLECTION: be realistic about access and time. A 9-month project can\'t do a 5-year longitudinal study. Pilot first.',
        'ANALYSIS: present results clearly with tables/graphs. Don\'t overstate findings — small samples mean limited generalizability.',
        'DISCUSSION: connect your findings BACK to the literature. Did you confirm prior work? Conflict with it? Reveal a new angle? Acknowledge limitations honestly.',
        'CITATIONS: APA most common in social science / psych; MLA in humanities; Chicago in history. Pick one + be consistent.',
        'ETHICS: IRB review at your school for research with human participants. Consent forms required. Anonymize data.',
      ],
      vocabulary: [
        { term: 'literature review', definition: 'a thematic synthesis of existing research on your topic, identifying the gap your study fills.' },
        { term: 'methodology', definition: 'the specific approach and techniques used to collect and analyze your data.' },
        { term: 'IRB', definition: 'Institutional Review Board — committee that approves research involving human participants.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-question',
      kind: 'worked_example',
      problem: 'Refine a vague research interest into a specific, answerable question.',
      steps: [
        'STARTING INTEREST: "I want to study social media."',
        'TOO BROAD. "Social media" covers everything from TikTok to LinkedIn. "Study" doesn\'t specify what.',
        'NARROW THE TOPIC: "I want to study how Instagram affects teens." Better, but still broad — what about Instagram? What aspect of teens?',
        'SPECIFY THE VARIABLE: "I want to study how time spent on Instagram is associated with body-image perception in 14-17-year-olds."',
        'ADD CONTEXT: "...in suburban US high-school students attending district X."',
        'REFINE TO RESEARCHABLE: "Among 14-17-year-old students at District X high schools, is daily time on Instagram correlated with self-reported body-image satisfaction?"',
        'NOW you have: a specific population, measurable IV (Instagram time), measurable DV (body-image self-report), feasible scope.',
        'METHOD likely: anonymous survey + descriptive statistics + correlation analysis. Maybe interviews for nuance.',
      ],
      answer: 'Specific population + measurable variable + feasible method = a researchable question.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why does AP Research weight the WRITTEN PAPER (75%) more than the presentation (25%)?',
      expectedAnswer: 'The paper is the rigorous academic product — every claim must be supported, methodology justified, limitations addressed. It demonstrates research, writing, and reasoning skills in the form universities most care about. The presentation tests communication of those findings, which is important but secondary to whether the underlying work is rigorous. Plus, the paper is reviewed by trained scorers blind to the presenter; the presentation is more subjective.',
      responseFormat: 'free',
      hints: [
        'What does college academic work look like — papers or presentations?',
        'Which one is harder to score consistently across thousands of students?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-prove',
      kind: 'misconception_check',
      question: 'Is the goal of AP Research to PROVE your hypothesis is correct?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating research as advocacy.',
          correctsTo: 'No. The goal is to INVESTIGATE rigorously. A paper that finds NO effect, or unexpected results, is just as valuable as one that confirms the hypothesis — sometimes more. Treating the project as advocacy biases data collection and interpretation. Strong AP Research papers show honest engagement with whatever the data say, including limitations and contradictions. "Failure to confirm" is a finding.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'One year, one paper (4000-5000 words), one presentation + defense.',
        'Sections: Intro, Lit Review, Methodology, Results, Discussion, References.',
        'Question: narrow + answerable + original. Method: justified to question.',
        'Honesty over advocacy. Limitations are part of rigor.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the literature review often the hardest part for AP Research students?',
      hint: 'It requires reading 25+ peer-reviewed sources you may not initially understand, then SYNTHESIZING them into a coherent thematic argument — not just summarizing each. Identifying the actual gap your project fills (vs claiming a gap that doesn\'t exist) takes serious time. Most students underestimate the time. Best practice: annotate sources monthly all year, not in February.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
