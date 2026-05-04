/**
 * Grades 9-12 ELA — Annotated Bibliography.
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_ANNOTATED_BIB: LessonPlan = {
  id: 'evelyn.g912.ela.annotated-bib.v1',
  title: 'Grades 9-12 ELA — Annotated Bibliography',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.annotated-bib',
      description: 'Construct an annotated bibliography: each entry includes a citation plus a 100-200 word summary, evaluation, and reflection on usefulness.',
      standard: 'CCSS.ELA-LITERACY.W.11-12.7',
    },
  ],
  prerequisites: ['g912.ela.mla-apa-citation'],
  followUps: ['g912.ela.logical-fallacies'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'An annotated bibliography is the research paper\'s blueprint — done well, the actual paper writes itself.',
      script: 'Imagine a research paper as a building. Sources are the materials. An annotated bibliography is your inventory: each material listed, described, evaluated for fit. Once that\'s done, drafting the paper is mostly assembly. Today we drill the entry format.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-anbib',
      kind: 'concept',
      goal: 'Entry components + evaluation criteria + format.',
      keyIdeas: [
        'AN ANNOTATED BIBLIOGRAPHY = list of sources + ANNOTATION (description + evaluation) under each.',
        'CITATION: in your assigned style (MLA, APA, etc.).',
        'ANNOTATION (100-200 words typical) usually has 3 parts:',
        '1) SUMMARY: what is the source about? Main argument, evidence used, scope. (1-3 sentences.)',
        '2) EVALUATION: how credible is the source? Author qualifications, peer-reviewed?, biases? (2-3 sentences.)',
        '3) REFLECTION / RELEVANCE: how does this source fit YOUR research? Which questions does it answer? Which gaps does it reveal? (2-3 sentences.)',
        'ENTRIES are alphabetised by author last name (like Works Cited).',
        'HANGING INDENT: first line of citation flush left; subsequent lines indented. Annotation indented entirely.',
        'PURPOSE: helps you remember what each source said, evaluate quality, and decide which to USE in the paper.',
        'COMMON ERROR: writing the SUMMARY in the source\'s voice ("In this article, the author argues X"). Better: in YOUR voice, third-person.',
        'AVOID: vague evaluations ("This source is good"). Specify WHY it\'s good or weak.',
      ],
      vocabulary: [
        { term: 'annotation', definition: 'a brief paragraph (100-200 words) summarising and evaluating a source.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-anbib',
      kind: 'worked_example',
      problem: 'Write a sample annotated bibliography entry for a source on smartphone use in schools.',
      steps: [
        'CITATION (MLA): Smith, Jane. "The Smartphone in the Classroom." Education Today, vol. 45, no. 3, 2024, pp. 22-31.',
        'SUMMARY: "Smith examines policies regulating smartphone use in 12 American school districts, analysing both the rationale for restrictions and academic outcomes. She argues that blanket bans tend to fail in implementation, while structured-use policies (smartphones for specific tasks only) yield modest improvements in classroom focus."',
        'EVALUATION: "Smith is a professor of education policy at NYU with prior peer-reviewed work on classroom technology. Her data is drawn from district-published reports, which limits independent verification. The article appears in a respected journal but is not peer-reviewed in the traditional sense."',
        'RELEVANCE: "This source is highly relevant to my research question about smartphone policy effectiveness. Her analysis of structured-use policies will support my thesis that blanket bans miss nuance. Her acknowledgement of data limits will inform my discussion of evidence quality."',
      ],
      answer: 'Citation + summary + evaluation + relevance.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Write the EVALUATION component (2-3 sentences) for a source written by a non-academic blogger with no scholarly credentials.',
      expectedAnswer: 'Sample: "The author has no formal academic credentials in the field, and the blog is self-published without peer review. While the article is engagingly written, it lacks citations and relies on personal anecdote rather than systematic evidence. I will use this source cautiously, primarily to capture lay perspective rather than as authoritative evidence."',
      responseFormat: 'free',
      hints: [
        'Note credentials (or lack of them).',
        'Note presence/absence of evidence.',
        'Note how this affects how YOU\'ll use it.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-source-voice',
      kind: 'misconception_check',
      question: 'A student\'s annotation begins: "In this article, the author would like to argue that..." Why is this awkward?',
      commonErrors: [
        {
          answer: '"In this article, the author would like to argue..."',
          misconception: 'Borrowing the source\'s voice instead of summarising in your own academic voice.',
          correctsTo: 'Annotations are written in YOUR voice as a researcher. Use third-person and direct verbs: "Smith argues that..." or "The article examines..." Avoid "would like to" (uncertain) and "in this article" (filler). Strong annotation: "Smith argues that smartphone restrictions in classrooms should be structured rather than absolute."',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Citation + annotation per entry.',
        'Annotation: summary + evaluation + relevance to your research.',
        'Alphabetise by author last name.',
        'Hanging indent.',
        'Write in YOUR voice; specify WHY a source is strong or weak.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How does an annotated bibliography help PREVENT plagiarism?',
      hint: 'By forcing you to engage with each source and write summaries IN YOUR OWN WORDS, the annotation builds the muscle of paraphrasing rather than copying. When you reach the drafting stage, you already have the source\'s ideas in your voice. You\'re less likely to accidentally lift phrases. The bibliography also creates a clear record of where each idea came from.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
