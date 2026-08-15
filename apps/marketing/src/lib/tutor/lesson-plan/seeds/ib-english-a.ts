/**
 * IB DP English A — anchor plan covering the assessment shape and the
 * close-reading habits the course rewards.
 */

import type { LessonPlan } from '../types';

export const SEED_IB_ENGLISH_A: LessonPlan = {
  id: 'evelyn.ibdp.english-a.v1',
  title: 'IB English A — Language & Literature core moves',
  curriculum: 'IB-DP',
  grade: '11-12',
  subject: 'ela',
  topic: 'ib-english-a',
  locale: 'en',
  los: [
    {
      id: 'ibdp.english-a.core',
      description: 'Identify the core analytical moves the IB English A course rewards across Paper 1 (guided analysis), Paper 2 (comparative essay), Individual Oral, and HL Essay.',
      standard: 'IB-DP-ENG-A',
    },
  ],
  prerequisites: ['g912.ela.literary-devices'],
  followUps: [],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'IB English A rewards close reading + global perspective + clear structure — and penalizes plot summary.',
      script: 'Examiners read thousands of essays. The ones that score 6s and 7s share a shape: a clear interpretive claim up front, close-reading evidence that earns each move, and explicit links between technique and meaning. The ones that score 4s and below share a shape too — usually plot summary with adjectives. Today we drill the high-band moves.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ib-eng',
      kind: 'concept',
      goal: 'Assessment shape, close reading, comparative essay structure, global issues, the seven assessment criteria.',
      keyIdeas: [
        'ASSESSMENT components (Lang & Lit): Paper 1 (guided textual analysis on an unseen non-literary text — 1h15 SL / 2h15 HL), Paper 2 (comparative essay on two studied works), Individual Oral (10-min on global issue + 1 literary + 1 non-literary text), HL Essay (1500-word independent study).',
        'TEN MARKS each, four criteria for Paper 1: A (understanding & interpretation), B (analysis & evaluation), C (focus & organisation), D (language). Memorise the criteria — they tell you exactly what examiners reward.',
        'CLOSE READING habit: identify a feature (diction, syntax, figurative language, structural pattern, layout, register), explain how it WORKS on the reader, link it to the text\'s broader meaning. Three moves in one sentence.',
        'AVOID FEATURE-SPOTTING. "The poet uses a metaphor in line 3" is not analysis. "The poet\'s metaphor of the harbour as a mouth makes the city seem to consume incoming ships, reinforcing the poem\'s anxiety about migration" — feature, function, meaning.',
        'COMPARATIVE essay (Paper 2): organise by ARGUMENT, not by text. Weak: "In Text A... In Text B..." Strong: "Both texts use unreliable narration to..., but where A withholds information for sympathy, B withholds it for menace."',
        'GLOBAL ISSUES (Lang & Lit): the IO requires a global issue — power, beliefs, science, culture, identity. Choose one that genuinely lets you compare your two extracts; do not retrofit.',
        'CONTEXT used precisely. Citing context (historical, cultural, biographical) earns marks ONLY when it changes the reading. Generic context dumps ("Shakespeare lived in Elizabethan England") get penalised.',
        'TIME MANAGEMENT: Paper 1 SL — 30 min plan / 40 min write / 5 check; Paper 2 — 30 min plan / 60 min write / 15 check. Plan time is non-negotiable.',
      ],
      vocabulary: [
        { term: 'guided analysis', definition: 'Paper 1 task type: an unseen text plus a guiding question that focuses your analysis. The guiding question is not a constraint — it is your starting line.' },
        { term: 'global issue', definition: 'a wide-reach question (e.g. power, identity, culture) used to frame the Individual Oral; must connect both chosen extracts.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-paper1',
      kind: 'worked_example',
      problem: 'You are given an unseen 200-word advertisement for a luxury watch. The guiding question is "How does the advertisement construct an idea of timeless prestige?". Sketch the opening of your analysis.',
      steps: [
        'Read the text twice. First read for sense; second read for technique. Annotate.',
        'Identify 3-4 features that genuinely answer the guiding question. Common: lexical choices ("heritage," "since 1875"), syntax (short fragments for declarative authority), visual layout (sparse white space), implied audience (second-person address presumed wealthy).',
        'Open with an interpretive claim, NOT a description. Weak: "The advertisement uses many techniques to sell the watch." Strong: "The advertisement constructs prestige not by promising features but by inviting the reader into an inherited identity — a community of past owners the watch implicitly extends."',
        'Body paragraphs follow the CLAIM → EVIDENCE → ANALYSIS pattern. Each feature is named, quoted, and linked back to the prestige claim.',
        'Close by widening: how does the cumulative effect of these techniques position the consumer? What ideology of luxury is embedded?',
        'Examiner takeaway: the analysis answered the guiding question with an INTERPRETIVE claim, not feature-spotting.',
      ],
      answer: 'Strong opening: thesis-driven interpretive claim that connects techniques to constructed prestige.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A Paper 2 prompt asks: "Compare how two works you have studied use setting to develop a central idea." For two novels you know well, draft a thesis sentence that organises the essay by ARGUMENT, not by text.',
      expectedAnswer: 'Sample (using "Beloved" and "The Remains of the Day"): "Both novels use restricted, haunted spaces — Sethe\'s 124 and Stevens\'s Darlington Hall — to externalise unresolved historical guilt; but where Morrison weaponises setting against the present, Ishiguro uses it to insulate his narrator from the past." (One sentence, names both works, names the comparison axis, names the differentiating move.)',
      responseFormat: 'free',
      hints: [
        'Comparative essays must compare by ARGUMENT axis, not by text-then-text.',
        'A strong thesis names the SAME thing both works do, and then the DIFFERENCE in how they do it.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'misconception-context-dump',
      kind: 'misconception_check',
      question: 'A student opens their Paper 2 essay with two paragraphs of background on Atwood\'s biography and the political context of "The Handmaid\'s Tale." Why does this likely cost marks?',
      commonErrors: [
        {
          answer: 'Demonstrating contextual knowledge gets credit',
          misconception: 'Treating context as inherently valuable rather than as evidence in service of an interpretive claim.',
          correctsTo: 'Context earns marks under criterion A (knowledge/understanding) only when it changes the reading. Two paragraphs of biographical/political background BEFORE any analysis signals "I am running down what I memorised" rather than "I am analysing." It also burns time you need for the comparison itself. The fix: weave context in at the moment it matters — "Atwood\'s emphasis on textile production is sharpened by the Cold-War context of US Christian-right ascendency she wrote into" — context is then doing analytical work, not sitting as a preamble.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Memorise the assessment criteria — they tell you what to do.',
        'Feature → function → meaning, in one analytical move.',
        'Open with an interpretive claim, never plot summary.',
        'Comparative essays organise by argument axis, not by text.',
        'Context earns marks only when it changes the reading.',
        'Plan time is non-negotiable.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why does the IO require a "global issue" rather than a free choice of theme?',
      hint: 'A global issue forces you to argue for a question that has reach beyond the individual text — testing whether you can move from close textual evidence to broader cultural meaning, which is the core skill the course is assessing. Free-choice themes ("loss in poetry") tend to invite vague comparisons; global issues ("how language constructs racialised identity") force you to commit to a specific line of argument that two texts can genuinely both speak to.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
