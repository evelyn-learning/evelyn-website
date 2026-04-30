/**
 * G11 — Research and citation: MLA format basics.
 *
 * In-text citations, Works Cited page, evaluating sources, avoiding
 * plagiarism. Foundational for college-level research papers.
 */

import type { LessonPlan } from '../types';

export const SEED_G11_ELA_RESEARCH_CITATION: LessonPlan = {
  id: 'evelyn.g11.ela.research.mla-citation.v1',
  title: 'MLA citation: in-text and Works Cited',
  curriculum: 'CCSS',
  grade: '11',
  subject: 'ela',
  topic: 'research',
  locale: 'en',
  los: [
    {
      id: 'ccss.ela.11-12.w.8',
      description: 'Gather relevant information from authoritative print and digital sources, integrate into the text, and avoid plagiarism by following a standard format for citation.',
      standard: 'CCSS.ELA-LITERACY.W.11-12.8',
    },
  ],
  prerequisites: ['ccss.ela.7.w.8'],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame citation as both intellectual honesty and scholarly conversation.',
      script: 'Citation isn\'t just a school rule. When you cite, you\'re doing two things: 1) Giving credit (avoiding plagiarism), 2) Joining a conversation — showing the reader who you read and where they can read it too.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-mla-basics',
      kind: 'concept',
      goal: 'In-text citation format + Works Cited basics + source evaluation.',
      keyIdeas: [
        'IN-TEXT CITATION (parenthetical): after a quote or paraphrase, add (Author Page). Example: (Smith 42). If author named in sentence, just (Page): "As Smith argues, ... (42)."',
        'WORKS CITED page: alphabetical list at the end. Each entry has author, title, source/container, publisher, date, location.',
        'BOOK format: Lastname, Firstname. *Title*. Publisher, Year.',
        'ARTICLE format: Lastname, Firstname. "Article Title." *Journal/Site Name*, Date, URL.',
        'PARAPHRASE vs QUOTE: paraphrase = your words restating the source\'s idea; still needs citation. Quote = exact words; needs quotation marks AND citation.',
        'SOURCE EVALUATION: prefer scholarly journals, books, government data over random websites. Check author credentials, publisher reputation, date, citations within.',
        'PLAGIARISM = using someone else\'s words or ideas without credit. Two kinds: 1) word-for-word copying without quotes, 2) paraphrasing without citation. Both are academic-integrity violations.',
      ],
      vocabulary: [
        { term: 'plagiarism', definition: 'using someone else\'s words or ideas without credit.' },
        { term: 'paraphrase', definition: 'restating someone else\'s idea in your own words; still requires citation.' },
        { term: 'Works Cited', definition: 'alphabetical list of all sources used at the end of an MLA paper.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-citation',
      kind: 'worked_example',
      problem: 'You\'re writing about climate change and want to use this fact from a 2023 NASA article on climate.nasa.gov by Dr. Maria Lopez: "Earth\'s temperature has risen 1.1°C since 1880." Show the in-text citation and Works Cited entry.',
      steps: [
        'PARAPHRASE option: "Since 1880, Earth has warmed about 1.1°C (Lopez)." (No page number — web article.)',
        'QUOTE option: "Earth\'s temperature has risen 1.1°C since 1880" (Lopez).',
        'Works Cited entry: Lopez, Maria. "Climate Change Indicators." *NASA*, 2023, climate.nasa.gov.',
        'Format: Author last-first → "Title in quotes" (article) → *Container italicized* → date → URL.',
      ],
      answer: 'in-text: (Lopez); WC: Lopez, Maria. "Climate Change Indicators." *NASA*, 2023, climate.nasa.gov.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You read a 2020 book by Robin Wall Kimmerer titled *Braiding Sweetgrass*, published by Milkweed Editions. You quote page 73. Write the in-text citation AND the Works Cited entry.',
      expectedAnswer: 'in-text: (Kimmerer 73); WC: Kimmerer, Robin Wall. *Braiding Sweetgrass*. Milkweed Editions, 2020.',
      responseFormat: 'free',
      hints: [
        'In-text needs author last name and page.',
        'Works Cited: lastname, firstname. *Title*. Publisher, Year.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-paraphrase-no-citation',
      kind: 'misconception_check',
      question: 'If you put an idea in your OWN words (paraphrase), do you still need to cite it?',
      commonErrors: [
        {
          answer: 'no',
          misconception: 'Skipping citation for paraphrased material.',
          correctsTo: 'YES — paraphrasing without citation is still plagiarism. The IDEA came from someone else; you owe them credit. Only "common knowledge" (widely known facts) doesn\'t need citation.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'In-text: (Author Page), at end of sentence.',
        'Works Cited: alphabetical, full source info.',
        'Paraphrase + quote BOTH need citation.',
        'Evaluate sources for credibility before using.',
        'Plagiarism = using ideas/words without credit. Includes accidental.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Is using AI like ChatGPT to draft text plagiarism? Why is this contested?',
      hint: 'No human author to cite, but the words aren\'t your own. Schools differ — some allow with disclosure, some ban entirely. Still evolving. The principle: be transparent about what you produced vs got help with.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
