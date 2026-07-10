/**
 * AP English Language & Composition — CED Unit 3.4: Integrating Evidence,
 * Not Summarizing.
 *
 * The single most important synthesis skill: at the paragraph level, using
 * sources as EVIDENCE for the writer's own line of reasoning rather than
 * narrating what each source is "about" in sequence (the "book report"
 * trap). This topic asks students to integrate details from TWO sources into
 * ONE paragraph in service of ONE claim — the paragraph-grain rehearsal for
 * the full multi-source essay (a later pass).
 *
 * See docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md §2 for the
 * humanities segment semantics (try_yourself PARAGRAPH grain: responseFormat
 * 'free', rubric = Evidence + Commentary parts summing to 6) this plan
 * follows.
 *
 * Anchor texts: Abraham Lincoln, "The Gettysburg Address" (1863) —
 * evelyn.passage.lincoln-gettysburg.v1 (primary passageId) — and Patrick
 * Henry, "Give Me Liberty or Give Me Death" (1775) —
 * evelyn.passage.henry-give-me-liberty.v1, referenced in prose as the second
 * integrated source. Quotes are limited to the short structural/rhetorical
 * phrases already used as anchor evidence for these speeches elsewhere in
 * the course.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U3_INTEGRATING_EVIDENCE: LessonPlan = {
  id: 'evelyn.ap.englang.integrating-evidence.v1',
  title: 'U3.4 Integrating Evidence, Not Summarizing',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.integrating-evidence',
      description:
        'Build one paragraph that integrates specific evidence from two sources as support for a single claim, using commentary to explain how both details serve that claim rather than summarizing each source in turn.',
      standard: 'AP-ENGLANG-3.4',
    },
  ],
  prerequisites: ['apenglang.position-across-sources', 'apenglang.evidence-commentary'],
  followUps: ['apenglang.synthesis-line-of-reasoning'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get students to feel the difference between recapping two accounts and using both as proof for one verdict.',
      script:
        "Imagine two friends who both watched the same basketball game and each give you a quote about it afterward. You don't want a play-by-play recap of both — 'Friend one said the shooting was cold, friend two said the defense was sloppy' — and then stop. You want to use their specific comments as PROOF for your own verdict on why the team lost. Synthesis paragraphs work exactly this way: you pick one detail from one source and one detail from another, and you use BOTH, together, as evidence for a single claim of your own — even if the two sources aren't talking about exactly the same thing.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-integrating-two-sources',
      kind: 'concept',
      goal: 'Define what it means to integrate evidence from two sources in one paragraph, and name the book-report trap this skill replaces.',
      keyIdeas: [
        'INTEGRATING evidence from multiple sources means using ONE specific, selected detail from EACH source as proof for a SINGLE claim of the writer\'s own — not narrating what each source is "about" in sequence.',
        'THE BOOK-REPORT TRAP: a paragraph shaped like "Source A says... Also, Source B says... Additionally..." with no claim tying the sentences together. Delete any sentence and the paragraph\'s "argument" is unaffected, because there isn\'t one.',
        'A strong synthesis paragraph states the CLAIM FIRST, then pulls one relevant detail from each source, and uses COMMENTARY (the Unit 1 evidence-and-commentary skill) to explain how BOTH details serve the SAME claim — even when the two sources don\'t agree with each other.',
        'Using two sources together is often stronger than using one alone, specifically because it can show a PATTERN across different moments or authors, or let one source sharpen or complicate how the reader should read the other — that comparative move IS analysis, not summary.',
        "Synthesis commentary has extra work to do beyond single-source commentary: it must explain not just what each piece of evidence shows on its own, but WHY putting them together matters — whether the sources reinforce each other or productively complicate the same claim.",
        'THE DELETE TEST: could any sentence in the paragraph be removed without weakening the claim? If yes for any sentence, that sentence is decoration (summary), not integrated evidence.',
      ],
      vocabulary: [
        { term: 'integration', definition: 'using a specific detail from a source as direct evidence for the writer\'s own claim.' },
        { term: 'book-report trap', definition: 'narrating each source\'s content in sequence with no unifying claim tying the sentences together.' },
        { term: 'comparative evidence', definition: 'evidence from two sources used together to show a pattern or productively complicate one another.' },
        { term: 'synthesis commentary', definition: 'commentary that explains not only what each piece of evidence shows, but why combining sources serves the claim.' },
      ],
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-integrate-henry-lincoln',
      kind: 'worked_example',
      problem:
        'Build one paragraph supporting the claim that the promise of liberty has always demanded active defense rather than passive inheritance, drawing on BOTH Patrick Henry\'s 1775 speech (mentioned here in prose — the resolved text is evelyn.passage.henry-give-me-liberty.v1) and Abraham Lincoln\'s 1863 Gettysburg Address (evelyn.passage.lincoln-gettysburg.v1, also referenced in prose since this segment type carries no passageId field).',
      steps: [
        'WRITE THE TOPIC SENTENCE / CLAIM. The promise of liberty has never been something a nation simply inherits once and keeps automatically — each generation has had to actively defend or renew it.',
        'SELECT ONE DETAIL FROM HENRY. His declaration that "there is no longer any room for hope. If we wish to be free, we must fight!" — chosen because it treats liberty as something that must be seized through immediate action, not passively enjoyed.',
        'SELECT ONE DETAIL FROM LINCOLN. His description of "the unfinished work" and the demand for "increased devotion" to "a new birth of freedom" — chosen because, nearly a century after Henry, it treats liberty as still incomplete, requiring renewed effort rather than being a settled inheritance.',
        'COMMENT ON HOW EACH DETAIL SERVES THE CLAIM ON ITS OWN. Henry shows liberty demanded through urgent action in a single moment; Lincoln shows liberty as an ongoing project requiring renewal generations later.',
        "COMMENT ON WHY THE TWO TOGETHER SERVE THE SAME CLAIM. Despite an 88-year gap and completely different occasions (a call to arms vs. a memorial address), both speakers treat liberty as unfinished and effortful rather than automatic — the AGREEMENT across two very different moments is stronger evidence for the claim than either speech alone.",
        'CLOSE BY LINKING BACK TO THE CLAIM. Neither speaker treats liberty as something a nation simply has; each treats it as something that must be actively fought for or renewed.',
      ],
      answer:
        'The promise of liberty has never been something a nation simply inherits once and keeps automatically — each generation has had to actively defend or renew it. In 1775, Patrick Henry treats liberty as something that must be seized through immediate action, declaring "there is no longer any room for hope. If we wish to be free, we must fight!" — a demand that forecloses any option of simply waiting for freedom to arrive. Nearly a century later, Abraham Lincoln treats liberty not as won-and-done but as "unfinished work," calling for "increased devotion" to secure "a new birth of freedom" for a nation still testing whether it "can long endure." That two speakers, separated by 88 years and addressing entirely different occasions — a call to arms and a memorial for the dead — arrive at the same underlying claim is stronger evidence than either speech could offer alone: liberty is not a possession a nation holds passively, but a demand each generation must actively answer.',
      estimatedMinutes: 6,
    },
    {
      id: 'try-integrate-two-sources',
      kind: 'try_yourself',
      problem:
        'Using the passage evelyn.passage.lincoln-gettysburg.v1 together with Patrick Henry\'s 1775 speech evelyn.passage.henry-give-me-liberty.v1 (his climactic line "we must fight!" is the relevant detail if you need a reminder), write ONE paragraph that integrates a specific detail from EACH source as evidence for this claim: "Securing liberty has always required people willing to treat it as urgent, not guaranteed." Your paragraph must include commentary explaining HOW both details serve the claim and WHY putting the two sources together (rather than either alone) strengthens the case. Do not summarize each source in turn — build one argument.',
      responseFormat: 'free',
      passageId: 'evelyn.passage.lincoln-gettysburg.v1',
      rubric: {
        parts: [
          {
            criterionId: 'evidence',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): the paragraph cites specific, accurately-quoted or precisely-named evidence from BOTH sources relevant to the claim about liberty requiring urgency rather than being guaranteed (e.g. Henry's \"there is no longer any room for hope... we must fight!\" AND Lincoln's \"unfinished work,\" \"increased devotion,\" or \"a new birth of freedom\"). Partial credit (1-2) for evidence from only one of the two sources, or evidence from both that is vague or only loosely tied to the claim. No credit for no evidence, evidence that misquotes or misattributes either passage, or evidence irrelevant to the claim.",
            modelResponse:
              'Henry insists that "there is no longer any room for hope" and that "we must fight" immediately, while Lincoln, addressing an entirely different occasion generations later, calls the work of securing freedom still "unfinished" and demands "increased devotion" to complete it.',
          },
          {
            criterionId: 'commentary',
            maxPoints: 3,
            scoringCriteria:
              "Full credit (3): commentary explains HOW each piece of evidence supports the claim (Henry's evidence shows liberty demanded through immediate, urgent action; Lincoln's shows liberty treated as incomplete and requiring ongoing renewal) AND explicitly explains WHY combining the two sources — rather than using either alone — strengthens the argument (e.g. because two speakers separated by decades and addressing different occasions independently arrive at the same underlying claim, which is more persuasive than a single instance). Partial credit for commentary that explains each source's evidence separately but never explains why using both together matters, or that mostly restates the quotes without real analytical development. No credit for commentary absent or reduced to summarizing what each quote says with no explanation of how/why or why combining the sources matters.",
            modelResponse:
              "Henry's evidence shows liberty being demanded in a single urgent moment, treating any delay as itself dangerous; Lincoln's evidence shows liberty treated as a project still unfinished nearly a century later, requiring active renewal rather than passive enjoyment. That two speakers addressing completely different occasions — an armed uprising and a memorial for the dead — independently converge on the same idea, that liberty must be actively pursued rather than assumed, makes the claim harder to dismiss as one speaker's rhetorical flourish and more like a durable pattern across American history.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: 'misconception-book-report-paragraph',
      kind: 'misconception_check',
      question:
        'A student writes: "Henry says we must fight for liberty. Lincoln also talks about liberty and says the work is unfinished. Both sources discuss liberty." Is this a successful integration of two sources?',
      commonErrors: [
        {
          answer: 'yes',
          misconception:
            'Believing that mentioning both sources in the same paragraph, one after another, IS integration — the book-report trap at paragraph grain.',
          correctsTo:
            'No — this paragraph has no claim of its own. Delete any sentence ("Henry says we must fight for liberty") and the paragraph loses nothing, because it was never building toward a specific point — it was just listing what each source contains. Integrated evidence requires a claim stated up front, evidence from each source selected because it supports THAT specific claim, and commentary explaining not just what each source shows but why using them together (rather than each on its own) strengthens the case. "Both sources discuss liberty" is an observation about the sources, not a claim about liberty itself.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Integrating evidence means using one specific detail from EACH source as proof for a SINGLE claim — not narrating what each source is about in turn.',
        'The book-report trap: "Source A says... Source B also says..." with no unifying claim. Delete any sentence — if nothing is lost, it was decoration.',
        'Synthesis commentary must explain both HOW each detail supports the claim and WHY combining the sources (not either alone) strengthens the case.',
        'Sources used together can show a pattern across time/authors, or let one sharpen how you read the other — that comparison is analysis, not summary.',
        'State the claim first, then select evidence from each source because it serves that claim — never the reverse.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.4',
    cedTitle: 'Integrating Evidence, Not Summarizing',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP English Language' },
    ],
  },
};
