/**
 * College Intro — Academic Research & Citation.
 *
 * Anchor plan for finding, evaluating, integrating, and citing
 * scholarly sources at the freshman level.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_ELA_ACADEMIC_RESEARCH: LessonPlan = {
  id: 'evelyn.college.ela.academic-research.v1',
  title: 'Academic Research & Citation — sources, integration, integrity',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'ela',
  topic: 'academic-research',
  locale: 'en',
  los: [
    {
      id: 'college.ela.academic-research',
      description: 'Find, evaluate, integrate, and cite scholarly sources to support an academic argument with attribution and integrity.',
      standard: 'COLLEGE-INFO-LIT',
    },
  ],
  prerequisites: ['college.ela.composition'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'College research is not "find five sources" — it is participating in a scholarly conversation.',
      script: 'When you cite a peer-reviewed article, you are not name-dropping. You are entering a long-running argument and saying "here is where I stand on this question, and here is who I am building on or pushing against." Today we cover the practical mechanics — search, evaluation, integration, citation — but the goal is to write essays that earn their place in the conversation.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-research',
      kind: 'concept',
      goal: 'Source types, search strategies, source evaluation, integration, citation styles, plagiarism, AI use.',
      keyIdeas: [
        'SOURCE HIERARCHY for academic argument: primary sources (data, original texts) > peer-reviewed scholarly articles > scholarly books > reputable journalism > general web. Match the source to the claim.',
        'WHERE TO SEARCH: your library\'s database (JSTOR, Project MUSE, Web of Science) — NOT just Google. Google Scholar is fine for tracking citations but lacks library access.',
        'CARS evaluation: Credibility (author credentials, institutional affiliation), Accuracy (citations, peer review), Reasonableness (acknowledges counter-evidence), Support (independently verifiable).',
        'SCHOLARLY CONVERSATION: when you find a great article, mine its bibliography (backward) and look at who cites it (forward, via Google Scholar "cited by"). This maps the conversation around your topic.',
        'INTEGRATING SOURCES: signal phrases name the source ("As Smith argues..."), embed the evidence (quote, paraphrase, summary), and follow with analysis showing how it supports YOUR argument.',
        'PARAPHRASE ≠ change a few words. A real paraphrase reproduces the meaning in your own sentence structure and vocabulary, with citation. Word-swapping is patchwriting and counts as plagiarism.',
        'CITATION STYLES: MLA (humanities — author/page), APA (social/natural sciences — author/year), Chicago (history — notes/bibliography). Use the one your discipline expects; be consistent.',
        'PLAGIARISM is academic theft and most universities treat it as a fail-the-course offense. AI-generated text without attribution is the new variant — disclose any AI use per your instructor\'s policy.',
        'NOTE-TAKING discipline: log full citation info AT THE TIME you read. Recovering it later is the most common cause of missed citations and accidental plagiarism.',
      ],
      vocabulary: [
        { term: 'peer review', definition: 'process by which scholarly articles are evaluated by independent experts before publication; key marker of scholarly credibility.' },
        { term: 'patchwriting', definition: 'paraphrase that swaps individual words while keeping the source\'s sentence structure; treated as plagiarism by most institutions.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-evaluation',
      kind: 'worked_example',
      problem: 'You\'re writing about adolescent screen time and depression. You find: (a) a 2018 peer-reviewed study in JAMA Pediatrics, (b) a 2024 magazine think-piece by a journalist citing the JAMA study, (c) a TikTok summarizing both. Which do you cite, and why?',
      steps: [
        'Tier them by source type: JAMA = peer-reviewed scholarly. Magazine = reputable journalism, secondary. TikTok = tertiary, no editorial control.',
        'Trace the chain: TikTok cites magazine cites JAMA. Always cite as close to the original as you can verify directly. Do not "cite a source you have not read."',
        'Read the JAMA article and cite IT. The magazine and TikTok summarized it (potentially with distortion or selective emphasis).',
        'When the JAMA finding has been challenged or updated by later studies, cite those too — academic writing tracks the conversation, not just the most-cited single result.',
        'If you only had access to the magazine and could not get the underlying study, you would cite the magazine ("as reported by Smith summarizing Johnson et al.") rather than misrepresent direct access. Honesty about what you read matters.',
      ],
      answer: 'Cite the JAMA study (read directly) plus any updates; treat the magazine and TikTok as discovery tools, not citable sources.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'You find a perfect quote in Wikipedia for your essay. The Wikipedia entry attributes it to a 2015 academic book. What do you do?',
      expectedAnswer: 'Locate the original 2015 book, verify the quote is accurate (Wikipedia gets quotes wrong), then cite the book — not Wikipedia. If the book is unavailable, you have to either find a different source or cite as "quoted in" Wikipedia, which signals to your reader that you did not verify the original.',
      responseFormat: 'free',
      hints: [
        'Cite as close to the original as you can directly verify.',
        'Wikipedia is a discovery tool, not a citable source for academic work.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-paraphrase',
      kind: 'misconception_check',
      question: 'A student copies a sentence from a source, swaps three nouns for synonyms, and adds a citation at the end. They believe this is a paraphrase. Why is this still plagiarism?',
      commonErrors: [
        {
          answer: 'They added a citation, so it is fine',
          misconception: 'Treating citation as a magic bullet that legitimizes any borrowed text.',
          correctsTo: 'Citation is necessary but not sufficient. A real paraphrase reproduces the meaning in YOUR sentence structure and YOUR vocabulary, then cites the source for the IDEA. Swapping words while keeping the original\'s sentence shape (subject, verb, clause order) is patchwriting — most universities classify it as plagiarism even with a citation. The fix: read the source, close it, write what you understood in your own sentence, then check back to make sure you got it right and add the citation.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Match source type to claim (primary > peer-reviewed > journalism > web).',
        'Search library databases, not just Google.',
        'CARS-evaluate every source.',
        'Cite the original you read; do not cite through summaries.',
        'Real paraphrase = your structure, your words, source\'s idea, citation.',
        'Citation style: pick what your discipline expects, be consistent.',
        'Disclose AI use per your instructor\'s policy.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does academic citation often look pedantic compared to journalism — and what would be lost if we dropped it?',
      hint: 'Citation lets readers verify, follow up, and dispute claims. It also distributes credit and accountability — if a finding is wrong, citation lets the field trace where the error originated. Drop it and the literature collapses into folk wisdom: "everyone knows" replaces "Smith 2018 found, replicated by Jones 2020." Journalism trades verifiability for readability because its primary audience is reading once, not building on the work.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
