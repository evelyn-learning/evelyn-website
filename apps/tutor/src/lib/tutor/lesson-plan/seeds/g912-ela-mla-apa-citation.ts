/**
 * Grades 9-12 ELA — MLA & APA Citation.
 */

import type { LessonPlan } from '../types';

export const SEED_G912_ELA_MLA_APA_CITATION: LessonPlan = {
  id: 'evelyn.g912.ela.mla-apa-citation.v1',
  title: 'Grades 9-12 ELA — MLA & APA Citation',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ela',
  topic: 'g912-ela',
  locale: 'en',
  los: [
    {
      id: 'g912.ela.mla-apa-citation',
      description: 'Format citations correctly in MLA (humanities) and APA (social sciences) style; produce in-text citations and Works Cited / References lists.',
      standard: 'CCSS.ELA-LITERACY.W.11-12.8',
    },
  ],
  prerequisites: ['g912.ela.synthesis-essay'],
  followUps: ['g912.ela.annotated-bib'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Citation isn\'t busywork — it lets readers find your sources, signals professionalism, and protects you from plagiarism.',
      script: 'In college, your English papers will use MLA, your psychology papers APA, your history papers Chicago. Each format has different rules, but they all answer the same questions: who wrote it, what is it called, where was it published, when. Today we drill MLA + APA basics.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-citation',
      kind: 'concept',
      goal: 'MLA and APA — in-text + Works Cited/References + when to use each.',
      keyIdeas: [
        'WHEN TO CITE: any quote, paraphrase, summary, or specific idea from a source. Common knowledge does not need citation.',
        'MLA (Modern Language Association) — used in HUMANITIES (English, history, philosophy). Emphasises author + page.',
        'MLA in-text: (Smith 42) at end of sentence. With author already named: "Smith argues... (42)."',
        'MLA Works Cited entry — book: Last Name, First Name. Title of Book. Publisher, Year.',
        'MLA — article: Last Name, First Name. "Title of Article." Title of Journal, vol. #, no. #, Year, pp. #-#.',
        'APA (American Psychological Association) — used in SOCIAL SCIENCES (psych, sociology, education). Emphasises author + year.',
        'APA in-text: (Smith, 2024, p. 42) or "Smith (2024) argued..."',
        'APA References entry — book: Smith, J. (2024). Title of book. Publisher.',
        'APA — article: Smith, J. (2024). Title of article. Journal Name, 12(3), 42-58.',
        'COMMON ELEMENTS in both: Authors alphabetised, hanging indent, double-spaced.',
        'TOOLS: citation generators (Zotero, EasyBib) help, but ALWAYS verify formatting — generators make errors.',
      ],
      vocabulary: [
        { term: 'in-text citation', definition: 'a brief reference within the text linking to a full source listing at the end.' },
        { term: 'hanging indent', definition: 'first line flush left, subsequent lines indented; standard for Works Cited / References entries.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-citation',
      kind: 'worked_example',
      problem: 'Write the MLA and APA Works Cited / Reference entries for: a book by Jane Smith called "The Future of Cities" published by Random House in 2023.',
      steps: [
        'MLA: "Smith, Jane. The Future of Cities. Random House, 2023."',
        'APA: "Smith, J. (2023). The future of cities. Random House."',
        'Differences: MLA spells out first name; APA uses initial. MLA italicises title with traditional capitalisation; APA italicises with sentence case (only first word + proper nouns capitalised). MLA puts year after publisher; APA puts year in parentheses after author.',
      ],
      answer: 'MLA: "Smith, Jane. The Future of Cities. Random House, 2023." APA: "Smith, J. (2023). The future of cities. Random House."',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Write the MLA in-text citation for a quote from page 87 of a book by John Doe.',
      expectedAnswer: '(Doe 87)',
      responseFormat: 'free',
      hints: [
        'MLA in-text format: (Last Name page#).',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cite-everything',
      kind: 'misconception_check',
      question: 'A student cites "Water is wet (Smith 12)" in their paper. Why is this unnecessary?',
      commonErrors: [
        {
          answer: 'Citing common knowledge',
          misconception: 'Treating every fact as needing a citation, including widely known ones.',
          correctsTo: 'COMMON KNOWLEDGE doesn\'t require citation. "Water is wet", "Earth orbits the Sun", "WWII ended in 1945" — facts everyone in your educated audience knows. Cite when: 1) you used specific phrasing from a source, 2) the fact is contested or non-obvious, 3) the analysis or interpretation is the source\'s. When in doubt, cite — but don\'t over-cite trivia.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'MLA: humanities. APA: social sciences. Chicago: history.',
        'In-text: brief reference. Works Cited / References: full info.',
        'MLA emphasises author + page. APA emphasises author + year.',
        'Cite quotes, paraphrases, specific ideas. Skip common knowledge.',
        'Verify generator output — always.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does APA emphasise YEAR in citations more than MLA does?',
      hint: 'In social sciences, the recency of research matters enormously — a 2024 study may have superseded a 2014 one. APA puts the date in the in-text citation so readers immediately see how current the source is. Humanities (MLA) often cite older works whose value doesn\'t depreciate (Shakespeare, Plato), so date is less prominent. Citation conventions reflect what each field VALUES.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
