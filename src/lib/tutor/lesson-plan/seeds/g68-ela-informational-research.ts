/**
 * Grades 6-8 ELA — Informational Writing (Research-Based).
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_INFORMATIONAL_RESEARCH: LessonPlan = {
  id: 'evelyn.g68.ela.informational-research.v1',
  title: 'Grades 6-8 ELA — Research-Based Informational Writing',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.informational-research',
      description: 'Conduct a focused inquiry, integrate multiple credible sources, and produce informational writing with appropriate citation.',
      standard: 'CCSS.ELA-LITERACY.W.7.7',
    },
  ],
  prerequisites: ['g68.ela.counterclaim'],
  followUps: ['g68.ela.narrative-developed'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Research papers in middle school separate students who can and can\'t handle high school — the bar rises here.',
      script: 'A 6th-grade research paper might be 2 pages with 2 sources. An 8th-grade paper might be 5 pages with 5 sources. The skills scale: focused question, evidence integration, formal citation, synthesis. Today we drill the workflow that produces strong research writing.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-research-writing',
      kind: 'concept',
      goal: 'Research workflow + integration + citation.',
      keyIdeas: [
        'WORKFLOW: 1) Pick focused topic. 2) Form a research question. 3) Find 3-5 credible sources. 4) Take notes by source (note-cards or digital). 5) Outline. 6) Draft. 7) Revise + cite.',
        'CREDIBLE SOURCES (CRAAP test): Currency, Relevance, Authority, Accuracy, Purpose. Encyclopedias, peer-reviewed journals, .gov / .edu websites.',
        'INTEGRATING SOURCES: 1) Direct quote (exact words in quotation marks). 2) Paraphrase (own words, restating idea). 3) Summary (own words, big-picture). All three need citations.',
        'SIGNAL PHRASES: introduce evidence with phrases like "According to...", "The author of X claims...", "Research from Y shows..."',
        'IN-TEXT CITATION (basic MLA): (Author Last Name page#) at end of sentence. "Climate change accelerates global drought (Smith 42)."',
        'WORKS CITED at end: alphabetical list of all sources used, with full publication info.',
        'AVOID: dumping quotes without context. Every quote needs introduction + analysis.',
        'SYNTHESIS: showing how multiple sources connect. "While X argues..., Y\'s research suggests..."',
        'PLAGIARISM: even unintentional. Always cite. When in doubt, cite.',
      ],
      vocabulary: [
        { term: 'paraphrase', definition: 'restating someone else\'s ideas in your own words; still requires citation.' },
        { term: 'synthesis', definition: 'combining ideas from multiple sources to form a new understanding.' },
        { term: 'in-text citation', definition: 'a brief reference inside the text pointing to a full source listed at the end.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-integrate',
      kind: 'worked_example',
      problem: 'Take this fact and integrate it into a research paragraph: "Pandas are endangered with about 1,800 left in the wild." (Source: WWF, 2023.)',
      steps: [
        'Topic sentence first: "Giant pandas remain one of Earth\'s most vulnerable mammals."',
        'Signal phrase: "According to the World Wildlife Fund (2023),"',
        'Integrate fact: "approximately 1,800 wild pandas remain — a slight increase from past years thanks to habitat conservation efforts."',
        'Reasoning/synthesis: "While 1,800 represents progress, the population is still classified as vulnerable, and continued habitat loss in Sichuan poses an ongoing threat."',
        'Citation: "(WWF 2023)" at the end of the fact-bearing sentence.',
        'Combined: "Giant pandas remain one of Earth\'s most vulnerable mammals. According to the World Wildlife Fund (2023), approximately 1,800 wild pandas remain... a slight increase... (WWF 2023)."',
      ],
      answer: 'Smooth integration with topic sentence, signal phrase, citation, and synthesis.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Paraphrase this sentence in your own words and add a citation: "Honey bees pollinate one-third of the food we eat." (Source: USDA, 2022.)',
      expectedAnswer: 'Paraphrase: "Honey bees are responsible for pollinating roughly 33% of human food crops (USDA 2022)."',
      responseFormat: 'free',
      hints: [
        'Restate in own words, don\'t copy.',
        'Add (USDA 2022) at the end.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-quote-dump',
      kind: 'misconception_check',
      question: 'A student writes: "\\"Pandas are endangered. There are 1,800 left.\\" According to WWF." What is wrong with this integration?',
      commonErrors: [
        {
          answer: 'Quote followed by citation only',
          misconception: 'Treating a quote as self-explanatory; failing to introduce or analyse it.',
          correctsTo: 'Quotes need INTRODUCTION (signal phrase) and ANALYSIS (your interpretation). Better: "The status of pandas reflects fragile progress. According to WWF, \'approximately 1,800 wild pandas remain\' (WWF 2023). This number, while up from previous decades, still represents a vulnerable population." The integration sandwich: introduce → quote → analyse.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Workflow: question → sources → notes → outline → draft → cite.',
        'CRAAP test for source quality.',
        'Three integration types: quote, paraphrase, summary — all need citation.',
        'Signal phrases introduce evidence.',
        'Works Cited at end with full source info.',
        'Sandwich: introduce → quote/paraphrase → analyse.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How might you SYNTHESISE two sources that disagree on the effectiveness of a policy?',
      hint: 'Acknowledge both views: "While Smith (2021) argues the policy improved test scores by 8%, Lopez\'s 2023 follow-up found only 2% improvement after demographic controls. The discrepancy suggests the policy\'s effect may be smaller than initial reports indicated, though the direction (positive) is consistent." Synthesis explains DIFFERENCES, not just lists them.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
