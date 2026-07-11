/**
 * AP English Language & Composition — Unit 3 FRQ Practice: the full
 * Synthesis essay (AP Lang Free-Response Question 1).
 *
 * This is the FRQ-practice plan (see project catalog convention) that
 * closes out Unit 3: after understanding the synthesis task (3.1), citing
 * and attributing sources (3.2), taking a position across sources (3.3),
 * integrating evidence (3.4), and building a synthesis line of reasoning
 * (3.5), students now write ONE complete Synthesis essay under real AP Lang
 * task conditions and are scored against the authentic AP Lang 6-point
 * rubric (Thesis 1 / Evidence & Commentary 4 / Sophistication 1 — the same
 * three-row scale as the Rhetorical Analysis and Argument FRQs, NOT the
 * STEM 9-point convention; see
 * docs/superpowers/specs/2026-07-10-ap-eng-lang-design.md D4/§2).
 *
 * Source packet (the NEW multi-source `passageIds` field — do NOT also set
 * `passageId`): three short public-domain speeches on the meaning of
 * American liberty and equality, resolved and labeled Source A/B/C for the
 * grader in array order (see src/lib/tutor/portal/adapters.ts
 * resolvePassageText — index 0 -> Source A, etc.):
 *   - Source A: Frederick Douglass, "What to the Slave Is the Fourth of
 *     July?" (1852) — evelyn.passage.douglass-fourth-of-july.v1
 *   - Source B: Patrick Henry, "Give Me Liberty or Give Me Death" (1775) —
 *     evelyn.passage.henry-give-me-liberty.v1
 *   - Source C: Abraham Lincoln, "The Gettysburg Address" (1863) —
 *     evelyn.passage.lincoln-gettysburg.v1
 * The teaching point is SYNTHESIS technique (using two-plus sources as
 * evidence for the student's OWN argument, not summarizing each in turn),
 * not the historical content of slavery/war the sources touch on — quotes
 * used here are limited to the short, already-published phrases used
 * elsewhere in the catalog's Unit 1/3 passages.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_ENGLANG_U3_FRQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.englang.u3-frq-practice.v1',
  title: 'U3 FRQ Practice — Synthesis Essay',
  curriculum: 'AP',
  grade: '11',
  subject: 'ela',
  topic: 'ap-english-language',
  locale: 'en',
  los: [
    {
      id: 'apenglang.u3-frq-practice',
      description:
        'Write a complete AP Lang Synthesis essay from a three-source packet — a defensible thesis on the issue, evidence-backed commentary that integrates at least two sources as support for the student\'s OWN line of reasoning (not a summary of each source), and sophistication — scored against the authentic AP Lang 6-point rubric.',
      standard: 'AP-ENGLANG-3-FRQ',
    },
  ],
  prerequisites: [
    'apenglang.the-synthesis-task',
    'apenglang.citing-attributing-sources',
    'apenglang.position-across-sources',
    'apenglang.integrating-evidence',
    'apenglang.synthesis-line-of-reasoning',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full Synthesis essay concrete before the student sits down to write one — and flag the one thing that trips students up most: using sources as evidence, not summarizing them.',
      script:
        "Every skill from this unit — understanding the synthesis task, citing and attributing sources, taking a position across sources, integrating evidence smoothly, and building a synthesis line of reasoning — exists to make ONE thing possible: writing a complete Synthesis essay under real exam conditions. That's FRQ 1 on the AP Lang exam, scored on the same 6-point rubric as the other two essays — Thesis (1 point), Evidence & Commentary (4 points), Sophistication (1 point). You'll get three short sources on American liberty and equality. Your job is NOT to summarize what each source says — it's to develop YOUR OWN argument and use at least two of the sources as evidence for it. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-frq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the AP Lang Synthesis task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: you\'re given an issue and several short sources. Write an essay that develops YOUR OWN position on the issue and uses at least two of the sources as evidence — this is the single most common way students lose points: summarizing each source one at a time instead of using them to build one argument.',
        'The essay must: (1) respond with a defensible thesis that takes a position on the issue, (2) select and use evidence from at least two sources to support that position, (3) explain HOW each source supports your line of reasoning (commentary, not just a citation), and (4) use appropriate grammar and control of language throughout.',
        'ROW A — THESIS (0–1 point): full credit requires a thesis that presents a defensible position on the issue itself (here: the meaning of American liberty and equality and the gap between its promise and practice) — not a description of what the sources say, not "the sources disagree," a position the STUDENT is taking.',
        'ROW B — EVIDENCE & COMMENTARY (0–4 points): the largest row. Full credit (4/4) requires the essay to use AT LEAST TWO sources, cited as Source A, B, or C, as evidence for the student\'s own line of reasoning, with commentary explaining how each source\'s content supports that reasoning — not just quoting a source and moving to the next one. A response that only uses one source, or that summarizes sources without connecting them to the student\'s argument, cannot earn full credit here.',
        'ROW C — SOPHISTICATION (0–1 point): earned holistically for things like explaining the complexity of the issue (e.g. that different eras and speakers invoked "liberty" for very different purposes), putting the sources in conversation with each other rather than treating them as a list, or employing a vivid and persuasive prose style throughout — NOT awarded for a few sophisticated-sounding words.',
        'The #1 scoring trap on the Synthesis essay is source-by-source summary: "Source A says X. Source B says Y. Source C says Z." A strong essay instead picks its OWN claim and pulls pieces from Source A and Source C (for example) into the SAME paragraph because they both support the SAME point.',
        'Total = 6 points, integer, summed across the three rows — the same authentic AP Lang scale used for the Rhetorical Analysis and Argument FRQs.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-synthesis',
      kind: 'try_yourself',
      problem:
        'The meaning of American liberty and equality — and the gap between its promise and its practice — has been argued over since the nation\'s founding. Carefully read the following three sources, including the introductory information for each. Then write an essay that develops your own position on the extent to which the American promise of liberty and equality has been fulfilled, synthesizing material from at least two of the sources to support your argument. In your response, do not simply summarize the sources individually. You should refer to the sources as Source A, Source B, or Source C.',
      responseFormat: 'frq',
      passageIds: [
        'evelyn.passage.douglass-fourth-of-july.v1',
        'evelyn.passage.henry-give-me-liberty.v1',
        'evelyn.passage.lincoln-gettysburg.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a defensible thesis that takes the student\'s own position on the gap between the promise and practice of American liberty (e.g. that the nation\'s founding rhetoric of liberty has always been most powerful not as a settled achievement but as a standard its speakers use to indict how far the country still falls short of it). The body then draws on AT LEAST TWO of the three sources as evidence for that SAME claim in the same paragraphs — for example, pairing Source A\'s (Douglass) direct indictment that the Fourth of July\'s "boasted liberty" is "an unholy license" for those still enslaved with Source C\'s (Lincoln) admission, on a former battlefield, that the nation still has "unfinished work" before its promise of equality is real — rather than describing each source in its own separate paragraph. A response could also bring in Source B (Henry) to show that even the Revolutionary generation invoked liberty as a demand still to be won ("if we wish to be free, we must fight!") rather than a right already secured, reinforcing the thesis that American liberty functions in all three texts as an aspiration used to criticize the present, not a settled fact. Commentary explains HOW each cited moment supports the student\'s claim, and cites sources as Source A/B/C. Sophistication is shown by putting sources in genuine conversation (e.g. noting that Douglass and Lincoln are answering the SAME gap between promise and practice from opposite sides of the Civil War, or that Henry\'s war-time urgency and Douglass\'s post-founding indictment both treat "liberty" as unfinished rather than achieved) rather than simply listing what each source contributes.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis presents a defensible position on the issue itself — the extent to which the American promise of liberty and equality has been fulfilled — not a description of what the sources say or a claim that "the sources have different views." No credit (0/1) for a thesis that only restates the prompt, describes the sources without taking the student\'s own position, or merely lists that the sources disagree without asserting what the student thinks.',
            modelResponse:
              'Across more than a century of American speech, "liberty" is invoked again and again not as a settled achievement to be celebrated but as an unfinished promise its own speakers use to indict how far the nation still falls short of it.',
          },
          {
            criterionId: 'B-evidence-commentary',
            maxPoints: 4,
            scoringCriteria:
              'Full credit (4/4): the essay uses evidence from AT LEAST TWO sources, cited as Source A, B, and/or C, woven into the SAME line of reasoning (not summarized one source at a time), with commentary explaining HOW each cited moment supports the student\'s thesis. 3/4: uses at least two sources with mostly-consistent commentary, but occasionally lapses into source-by-source summary or under-explains one citation. 2/4: uses sources (possibly only one, or two but disconnected from each other) with thin commentary that mostly restates what a source says rather than explaining how it supports the thesis. 1/4: minimal or largely irrelevant use of source material, or evidence that is only quoted with no explanation. 0/4: no use of the sources as evidence, or the essay only summarizes sources with no connection to a thesis.',
            modelResponse:
              'Source A makes this pattern explicit: Douglass tells his audience "This Fourth of July is yours, not mine," using the nation\'s own founding holiday to prove that its promise of liberty has never actually extended to everyone it claims to include — the celebration itself becomes his evidence that the promise is unfulfilled. Source C shows the same gap acknowledged from the other side of the conflict Douglass\'s indictment anticipates: Lincoln, standing on a battlefield, insists the dead have left the living "unfinished work" and a nation still needing "a new birth of freedom," which concedes — in the government\'s own voice — that the promise of equality is not yet real even after a war fought partly to secure it. Reading Source A against Source C shows the same admission made twice, decades apart and from opposite positions of power: American liberty is treated as an incomplete project, not an achieved one. Source B extends this further back: Patrick Henry\'s insistence that "if we wish to be free, we must fight" shows that even at the nation\'s founding, "liberty" was framed as something still to be won by struggle, not a status already secured — meaning the promise was unfinished from before the country even existed, a pattern Douglass and Lincoln each independently confirm from their own moments.',
          },
          {
            criterionId: 'C-sophistication',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically — e.g. the essay puts sources in genuine conversation rather than listing them (explaining what changes and what stays the same across eras), explains the added complexity of who is speaking and to what audience in each source, or sustains a precise, controlled prose style throughout. No credit (0/1) for merely inserting elevated vocabulary, an isolated sophisticated-sounding sentence unconnected to the essay\'s argument, or unclear/imprecise prose that undercuts the analysis.',
            modelResponse:
              'What makes this pattern more than coincidence is who is speaking in each case: a man once enslaved (Source A), a revolutionary demanding independence from an empire (Source B), and a wartime president burying soldiers who died over the very question of who counts as free (Source C) all reach for the identical move — treating liberty as a debt still owed rather than a gift already delivered — which suggests the unfinished promise is not a flaw in the founding rhetoric but the actual, persistent shape of it.',
          },
        ],
      },
      hints: [
        'Pick YOUR OWN claim about the issue first, then go looking for which sources support it — don\'t summarize Source A, then B, then C in order.',
        'Try pairing two sources in the SAME paragraph because they support the same point, rather than giving each source its own paragraph.',
        'Cite sources as "Source A," "Source B," or "Source C" — not by author name alone — so the grader can track your use of the packet.',
        'For each citation, explain WHY that moment supports your thesis, not just WHAT the source says.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The AP Lang Synthesis task asks you to develop YOUR OWN position and use at least two sources as evidence — never summarize each source in its own paragraph.',
        'The 6-point rubric: Thesis (1) — a defensible position on the issue; Evidence & Commentary (4) — at least two sources integrated into one line of reasoning, cited as Source A/B/C; Sophistication (1) — earned holistically, often by putting sources in conversation with each other.',
        'Quoting a source is not commentary — every citation needs an explanation of HOW it supports your claim.',
        'The #1 scoring trap is source-by-source summary; the fix is choosing a claim first and pulling evidence FOR that claim from wherever it appears in the packet.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3-FRQ',
    cedTitle: 'Unit 3 FRQ Practice — Synthesis Essay',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP Lang Synthesis FRQ (Question 1) task wording and 6-point rubric (Thesis 1 / Evidence & Commentary 4 / Sophistication 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.douglass-fourth-of-july.v1',
        chapter: '1852',
        note: 'Frederick Douglass, "What to the Slave Is the Fourth of July?" — Source A of the three-source synthesis packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.henry-give-me-liberty.v1',
        chapter: '1775',
        note: 'Patrick Henry, "Give Me Liberty or Give Me Death" — Source B of the three-source synthesis packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.lincoln-gettysburg.v1',
        chapter: '1863',
        note: 'Abraham Lincoln, "The Gettysburg Address" — Source C of the three-source synthesis packet.',
      },
    ],
  },
};
