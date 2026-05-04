/**
 * Grades 3-5 ELA — Research Basics.
 */

import type { LessonPlan } from '../types';

export const SEED_G35_ELA_RESEARCH_BASICS: LessonPlan = {
  id: 'evelyn.g35.ela.research-basics.v1',
  title: 'Grades 3-5 ELA — Research Basics',
  curriculum: 'CCSS',
  grade: '3-5',
  subject: 'ela',
  topic: 'g35-ela',
  locale: 'en',
  los: [
    {
      id: 'g35.ela.research-basics',
      description: 'Identify reliable sources, take notes in own words, and provide simple citations.',
      standard: 'CCSS.ELA-LITERACY.W.4.7',
    },
  ],
  prerequisites: ['g35.ela.commas-quotes'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Doing research is a skill — knowing where to look and how to record what you find separates strong students.',
      script: 'You\'re writing a report on sharks. Where do you start? Google? A library book? Wikipedia? Each source has different reliability. Today we drill how to choose, how to take notes, and how to credit your sources.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-research',
      kind: 'concept',
      goal: 'Source evaluation + note-taking + citations.',
      keyIdeas: [
        'PRIMARY SOURCES: original. Diaries, photographs, interviews, original data.',
        'SECONDARY SOURCES: written ABOUT primary sources. Encyclopedia articles, textbooks, reviews.',
        'EVALUATING SOURCES (CRAAP test): Currency (recent?), Relevance (matches topic?), Authority (who wrote it?), Accuracy (facts checkable?), Purpose (informing or selling?).',
        'RELIABLE SOURCES at this level: encyclopedias (Britannica, Encyclopedia Smithsonian), library databases, official .gov / .edu websites, well-known news outlets.',
        'WIKIPEDIA: useful for OVERVIEW and finding sources, but always check the citations and verify with other sources.',
        'NOTES IN YOUR OWN WORDS: don\'t copy sentences. Read, then write what you remember. Forces understanding and avoids plagiarism.',
        'CITATIONS: tell readers where you got information. Simple format for grades 3-5: Author. "Title." Source, date.',
        'PLAGIARISM: copying without credit. Even unintentional. Always paraphrase + cite.',
        'CROSS-CHECK: at least 2-3 sources for any important fact. If sources disagree, that\'s a research finding to report.',
      ],
      vocabulary: [
        { term: 'reliable source', definition: 'a source whose information is accurate, current, and from an authority on the topic.' },
        { term: 'plagiarism', definition: 'using someone else\'s words or ideas without giving credit.' },
        { term: 'citation', definition: 'a note telling the reader where information came from.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-research',
      kind: 'worked_example',
      problem: 'Imagine you\'re researching the planet Mars. Evaluate this source: "Some random blog from 2010 with no author listed." Should you use it?',
      steps: [
        'Apply the CRAAP test:',
        'Currency — 2010 is over a decade old. Mars science has advanced (Curiosity rover landed 2012, Perseverance 2021). May be outdated.',
        'Relevance — depends on topic.',
        'Authority — no author listed → no way to check expertise.',
        'Accuracy — can\'t verify without other sources.',
        'Purpose — unclear without more context.',
        'Verdict: SKIP. Look for: NASA.gov, Encyclopedia Britannica, recent textbook. Reliable, current, authoritative.',
      ],
      answer: 'Skip the unreliable source; use NASA.gov or other authoritative source.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Take this fact: "Saturn has 145 moons." How would you note this in your own words and create a simple citation? (Source: Encyclopedia Britannica, "Saturn", 2024.)',
      expectedAnswer: 'Note (paraphrased): "Saturn has more than a hundred moons — 145 confirmed as of 2024." Citation: Encyclopedia Britannica. "Saturn." 2024.',
      responseFormat: 'free',
      hints: [
        'Re-write in your own words.',
        'Citation format: source name, title, date.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-copy-paste',
      kind: 'misconception_check',
      question: 'A student copies sentences directly from a website into their report. They include the URL at the end. Is this proper research?',
      commonErrors: [
        {
          answer: 'Copy + URL is fine',
          misconception: 'Believing a citation alone justifies copying without quotation marks.',
          correctsTo: 'Copying word-for-word IS plagiarism unless you put the copied text in QUOTATION MARKS and cite the source. The proper move: read the source, close the tab, write what you understood in your own words, then cite. If you must use exact words, use quotation marks. Citing without quotes for copied content is still considered plagiarism in most schools.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'CRAAP test sources: Currency, Relevance, Authority, Accuracy, Purpose.',
        'Reliable: .gov, .edu, encyclopedias, recognised news.',
        'Wikipedia: starting point, not final source.',
        'Notes IN YOUR OWN WORDS to avoid plagiarism.',
        'Cite every source you use.',
        'Cross-check important facts in 2-3 sources.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Two sources give different answers to the same question. What do you do?',
      hint: 'Consult a third source as a tiebreaker. Check publication dates — newer info might supersede older. Check authority — is one source from a clear expert? If facts genuinely conflict, REPORT THE DISAGREEMENT in your writing — it\'s honest and shows critical thinking. Researchers face this regularly; admitting uncertainty is part of the work.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
