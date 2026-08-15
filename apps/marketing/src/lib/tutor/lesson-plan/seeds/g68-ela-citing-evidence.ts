/**
 * Grades 6-8 ELA — Citing Evidence (Quote, Paraphrase, Cite).
 */

import type { LessonPlan } from '../types';

export const SEED_G68_ELA_CITING_EVIDENCE: LessonPlan = {
  id: 'evelyn.g68.ela.citing-evidence.v1',
  title: 'Grades 6-8 ELA — Citing Evidence',
  curriculum: 'CCSS',
  grade: '6-8',
  subject: 'ela',
  topic: 'g68-ela',
  locale: 'en',
  los: [
    {
      id: 'g68.ela.citing-evidence',
      description: 'Use direct quotes, paraphrases, and summaries to cite text-based evidence; format citations correctly.',
      standard: 'CCSS.ELA-LITERACY.RL.7.1',
    },
  ],
  prerequisites: ['g68.ela.narrative-developed'],
  followUps: ['g68.ela.sentence-variety'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Citing evidence proves your claims — and protects you from accidental plagiarism.',
      script: 'When you say "the author wants us to feel sympathy", a teacher\'s next question is "where in the text shows that?" Citing evidence answers that. Today we drill three citation moves: quote, paraphrase, summary — and how to format each.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-citing',
      kind: 'concept',
      goal: 'Three citation types + format + integration.',
      keyIdeas: [
        'DIRECT QUOTE: exact words in quotation marks. Use when the original phrasing matters or carries authority. "She walked away without a word" (12).',
        'PARAPHRASE: same idea, your words. Use for the bulk of evidence. The author shows the protagonist leaving silently (12).',
        'SUMMARY: condensed version of a longer passage. Useful for plot recap.',
        'IN-TEXT CITATION (MLA basic): (Author Last Name page#) at end. For literature without page numbers, use chapter or paragraph. (Smith 42) or (Smith ch. 3).',
        'INTEGRATING: don\'t drop quotes without context. Use SIGNAL PHRASES: "The author writes...", "As the narrator notes...", "When [character] says..."',
        'ANALYSIS after evidence: explain WHAT the evidence shows. Don\'t leave it floating.',
        'BLOCK QUOTES: for quotes longer than 4 lines, indent the whole quote, no quotation marks.',
        'WORKS CITED at end: full source info. Author. Title. Publisher, year.',
        'AVOID: stacking quotes without analysis. Avoid changing the meaning when you paraphrase.',
        'WHEN UNSURE — cite. Always over-cite rather than risk plagiarism.',
      ],
      vocabulary: [
        { term: 'paraphrase', definition: 'restating someone else\'s words in your own; still requires citation.' },
        { term: 'in-text citation', definition: 'a brief reference within the text pointing to a full source listing.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-cite',
      kind: 'worked_example',
      problem: 'Paraphrase and cite this quote from page 27 of a novel by Smith: "She had the kind of stillness that made other people\'s movements feel loud."',
      steps: [
        'Read the original. Identify the key idea: the character\'s calm makes others feel restless by contrast.',
        'Paraphrase in your own words: "Her calm demeanour seemed to amplify others\' fidgeting and noise (Smith 27)."',
        'Or with signal phrase: "Smith describes the protagonist\'s presence as so quiet that it ' + 'unsettled others around her (27)."',
        'Both are correct paraphrases with citation. The signal-phrase version is smoother.',
      ],
      answer: 'Smith describes... unsettled others (27). [or alternative paraphrase]',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Quote and cite this sentence: From page 5 of "The Lion King" by Disney Press: "It is time."',
      expectedAnswer: '"It is time" (Disney Press 5).',
      responseFormat: 'free',
      hints: [
        'Quotation marks for direct quote.',
        'Citation in parentheses with author/source + page.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-misquote',
      kind: 'misconception_check',
      question: 'A student paraphrases the line "She walked away without a word" as "She decided to leave because she was angry." Why might this be problematic?',
      commonErrors: [
        {
          answer: '"She decided to leave because she was angry"',
          misconception: 'Adding interpretive details ("decided", "because she was angry") that aren\'t in the original.',
          correctsTo: 'A paraphrase preserves the AUTHOR\'S meaning in your words. The original says NOTHING about why she left or her emotions. By adding "because she was angry", the paraphrase invents content. Better: "She left silently." Save interpretation for ANALYSIS, after the citation: "She walked away without a word" (12). The silence may suggest anger, but the text doesn\'t explicitly say so.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Three citation types: quote, paraphrase, summary — all need citation.',
        'In-text citation: (Author page).',
        'Signal phrases introduce evidence smoothly.',
        'Always analyse after citing — don\'t drop quotes.',
        'Paraphrase preserves meaning without inventing content.',
        'Works Cited list at end.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'When would you use a SUMMARY instead of a quote or paraphrase?',
      hint: 'Summary is best when you need to convey a LONG passage\'s gist quickly without dwelling on details. Example: "In the first half of the novel, the protagonist establishes herself as quiet and observant (Smith 1-50)." Saves space and pace; saves quote-power for moments of high emphasis. Use summary for context, paraphrase for the bulk of evidence, quotes for high-impact moments.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
