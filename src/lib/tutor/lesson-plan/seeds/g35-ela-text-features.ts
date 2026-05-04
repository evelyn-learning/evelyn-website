/**
 * Grades 3-5 ELA — Text Features.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_TEXT_FEATURES: LessonPlan = {
  id: 'evelyn.g35.ela.text-features.v1',
  title: 'Grades 3-5 ELA — Text Features',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.text-features',
      description: 'Identify and use text features (headings, captions, bold words, glossaries, indices) to locate information.',
      standard: 'CCSS.ELA-LITERACY.RI.3.5',
    },
  ],
  prerequisites: ['g35.ela.figurative-language'],
  followUps: ['g35.ela.summarizing'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Text features are road signs in informational books — readers who use them find information faster and remember more.',
      script: 'Open a science textbook. Headings tell you what each section covers. Bold words signal key vocabulary. Captions explain pictures. The glossary defines hard words. The index points you to specific topics. Today we make these features work for you.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-features',
      kind: 'concept',
      goal: 'Common text features and how to use each.',
      keyIdeas: [
        'TITLE: tells the topic of the whole text.',
        'HEADING: introduces a section. Skim headings to preview the text.',
        'SUBHEADING: breaks a section into smaller parts.',
        'BOLD or ITALIC words: signal important terms — usually defined nearby or in the glossary.',
        'CAPTION: text accompanying a picture, chart, or diagram. Often contains key information not in the main text.',
        'DIAGRAM: a labelled drawing showing parts. Read the labels carefully.',
        'CHART/TABLE: organises information for comparison.',
        'TABLE OF CONTENTS: at the front of the book, lists chapters and pages.',
        'INDEX: at the back, alphabetical list of topics with page numbers — fastest way to find a specific topic.',
        'GLOSSARY: at the back, alphabetical list of important terms with definitions.',
        'SIDEBAR: a boxed-off block of related information; often a fun fact or "did you know" extension.',
        'STRATEGY for nonfiction: 1) Read title. 2) Skim headings to preview. 3) Read introduction. 4) Read sections. 5) Use index/glossary as needed.',
      ],
      vocabulary: [
        { term: 'caption', definition: 'short text that explains a picture or diagram.' },
        { term: 'glossary', definition: 'an alphabetical list of important words with definitions, usually at the end of a book.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-features',
      kind: 'worked_example',
      problem: 'You want to find information about WHALES in a book about ocean animals. Which text feature should you use first, and why?',
      steps: [
        'Question: do I want a specific topic, or a general overview?',
        'Specific topic = use the INDEX (alphabetical list of topics with page numbers).',
        'Look up "whales" in the index → find page numbers.',
        'Go to those pages directly. Saves you from flipping through the entire book.',
        'If "whales" isn\'t in the index, try "marine mammals" or check the table of contents for chapters that might contain whale info.',
      ],
      answer: 'Use the INDEX — fastest way to find specific topics.',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You meet the unfamiliar word "ecosystem" in a science book. Which text feature should you use to find its meaning?',
      expectedAnswer: 'Glossary',
      responseFormat: 'free',
      hints: [
        'Glossary is the alphabetical list of definitions.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-skip-features',
      kind: 'misconception_check',
      question: 'A student reads only the main paragraphs and skips the captions, sidebars, and diagrams. Why is this a mistake?',
      commonErrors: [
        {
          answer: 'Read only paragraphs',
          misconception: 'Treating sidebars and captions as "extras" rather than essential information.',
          correctsTo: 'Captions and sidebars often contain key information NOT in the main text — examples, statistics, fun facts that can appear on tests. Diagrams convey relationships words can\'t. Skipping these features means missing 20-30% of the book\'s content. Always read the full page including features.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Headings: preview content.',
        'Bold/italic: key terms (often in glossary).',
        'Captions: information about pictures and diagrams.',
        'Index (back): find specific topics.',
        'Glossary (back): word definitions.',
        'Always read sidebars and captions, not just paragraphs.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why do textbook authors use multiple text features (headings + diagrams + captions + sidebars) instead of just paragraphs?',
      hint: 'Different features serve different learning needs: visual learners use diagrams; quick-skim readers use headings; detail-oriented readers use captions and sidebars. Multiple features make information accessible in multiple ways and improve overall comprehension.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
