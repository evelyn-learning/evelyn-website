/**
 * AP US History — Period 5 DBQ Practice: the full Document-Based Question
 * essay (AP APUSH Free-Response Question 1).
 *
 * This is the essay-practice plan that closes out the Period-5 content arc
 * (manifest destiny and the Mexican-American War 5.2-5.3, the sectional
 * crisis 5.4-5.6, secession and the Civil War 5.7-5.8, emancipation 5.9,
 * Reconstruction 5.10-5.11): students now write ONE complete DBQ essay
 * under real AP exam conditions, using a genuine 5-document packet, and
 * are scored against the authentic AP APUSH 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..5 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. John L. O'Sullivan, "Annexation" (1845) —
 *      evelyn.passage.apush-osullivan-annexation.v1
 *   2. Frederick Douglass, "What to the Slave Is the Fourth of July?"
 *      (1852) — evelyn.passage.douglass-fourth-of-july.v1 (REUSED from the
 *      AP English Language catalog — not re-seeded)
 *   3. South Carolina, Declaration of the Immediate Causes of Secession
 *      (1860) — evelyn.passage.apush-sc-secession.v1
 *   4. Abraham Lincoln, the Emancipation Proclamation (1863) —
 *      evelyn.passage.apush-emancipation-proclamation.v1
 *   5. Abraham Lincoln, the Gettysburg Address (1863) —
 *      evelyn.passage.lincoln-gettysburg.v1 (REUSED from the AP English
 *      Language catalog — not re-seeded)
 *
 * Document fidelity: every modelResponse below attributes to a document
 * only what its seeded excerpt actually contains.
 *   - Doc 1 (O'Sullivan) contains no mention of slavery or race — only the
 *     providential-expansion claim ("manifest destiny... for the free
 *     development of our yearly multiplying millions").
 *   - Doc 4 (the Emancipation Proclamation) is quoted with care for its
 *     TWO distinct clauses: "shall be then, thenceforward, and forever
 *     free" is the excerpt's RECITAL of the September 22, 1862 preliminary
 *     proclamation's language (introduced by "That on the first day of
 *     January... shall be then...free"), while the operative January 1,
 *     1863 order-and-declare clause is "are, and henceforward shall be
 *     free." The excerpt also grounds the act in "military necessity," not
 *     a claim of blanket constitutional authority — and the excerpt does
 *     NOT include the list of exempted states/parishes (that fact is
 *     outside evidence, never attributed to the document's own content).
 *   - Doc 3 (the SC secession declaration) reproduces the source
 *     transcription artifact "have assume the right" verbatim wherever the
 *     document is directly quoted.
 *   - Broader facts not in the excerpts (the Thirteenth Amendment's text,
 *     "with malice toward none," the full scope of Reconstruction) are used
 *     only as outside evidence, clearly marked as such and never
 *     attributed to a document's own content.
 *
 * The teaching point is the DBQ TASK itself — thesis, contextualization,
 * document evidence, outside evidence, sourcing (HIPP), and complexity —
 * not new historical content; all quotes are the short, already-seeded
 * excerpts used elsewhere in the Period-5 catalog.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U5_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u5-dbq-practice.v1',
  title: 'Period 5 DBQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u5-dbq-practice',
      description:
        'Write a complete AP APUSH Document-Based Question essay from a five-document Period-5 packet on the extent to which the Civil War and Reconstruction transformed the meaning of American freedom, 1844-1877 — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP APUSH 7-point DBQ rubric.',
      standard: 'AP-APUSH-5-DBQ',
    },
  ],
  prerequisites: [
    'apush.manifest-destiny',
    'apush.sectional-crisis',
    'apush.secession-civil-war',
    'apush.emancipation',
    'apush.reconstruction',
  ],
  followUps: [],
  estimatedMinutes: 58,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "Everything you've learned about Period 5 — manifest destiny and the Mexican-American War, the sectional crisis over slavery in the territories, secession and the Civil War, emancipation, and Reconstruction — exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP US History exam, scored on the authentic 7-point rubric: Thesis (1), Contextualization (1), Evidence from the Documents (2), Evidence Beyond the Documents (1), Sourcing (1), and Complexity (1). You'll get five documents spanning 1845 to 1863. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument about how the Civil War and Reconstruction transformed the meaning of American freedom, and use the documents, plus what you already know, as evidence for it. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the five-document Period-5 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get five documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph ("Document 1 says X. Document 2 says Y.") instead of grouping documents around a claim.',
        'ROW A — THESIS/CLAIM (0-1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not a simple list of "some things changed and some didn\'t." A strong thesis for this packet might argue that the meaning of American freedom shifted from a racially bounded, providential ideal of expansion for white Americans into one the war legally transformed into freedom for millions of formerly enslaved people — a transformation that was real and substantial in law by 1865, yet remained bitterly contested and only unevenly secured in practice by the time Reconstruction ended in 1877.',
        'ROW B — CONTEXTUALIZATION (0-1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing how territorial expansion in the 1840s reopened the exact question of whether slavery would spread into new Western land, a fight that hardened through the 1850s (the Compromise of 1850, Kansas-Nebraska, Dred Scott) into the sectional crisis that produced secession and war — in AT LEAST a full sentence of specific description, not a single vague phrase like "the country was divided over slavery."',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0-2 points): 1 point for accurately describing the content of at least three documents; the full 2 points require using the content of at least four of the five documents to SUPPORT the thesis\'s argument — e.g. grouping O\'Sullivan\'s "manifest destiny" (Doc 1) and Douglass\'s "your shouts of liberty and equality, hollow mockery" (Doc 2) as evidence that antebellum "American freedom" was already a racially bounded, contested ideal; South Carolina\'s own declaration that non-slaveholding states had "denounced as sinful the institution of slavery" (Doc 3) as evidence secessionists defined their own freedom explicitly around the "right" to hold enslaved people as property; and the Emancipation Proclamation\'s order that persons in rebellion "are, and henceforward shall be free" (Doc 4) alongside Lincoln\'s Gettysburg call for "a new birth of freedom" (Doc 5) as evidence the war legally and rhetorically redefined freedom around Black Americans\' inclusion.',
        'ROW D — EVIDENCE BEYOND THE DOCUMENTS (0-1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the five documents, relevant to the argument and explained (not just named) — e.g. the Thirteenth Amendment (1865), which abolished slavery as a matter of constitutional law everywhere in the United States, including the border states and Union-occupied areas the war-measure Emancipation Proclamation itself did not reach.',
        'ROW E — SOURCING (0-1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. the South Carolina convention (Doc 3) drafted its declaration in December 1860, right after Lincoln\'s election, specifically to justify secession to other slave states and the wider public, which explains why it centers Northern interference with "domestic institutions" as its stated grievance; Lincoln issued the Emancipation Proclamation (Doc 4) as a wartime executive order under his war powers, closing by invoking "the considerate judgment of mankind," which explains why it grounds freedom in "military necessity" rather than a broader moral or constitutional claim; and Lincoln delivered the Gettysburg Address (Doc 5) at a battlefield cemetery dedication before a war-weary audience, which explains why it reframes the war\'s cost in universal terms of "a new birth of freedom" rather than as a narrower military accounting.',
        'ROW F — COMPLEXITY (0-1 point): earned holistically for a nuanced argument that does things like explain both continuity AND change, corroborate multiple document types (a magazine essay, an oration, a secession declaration, an executive war order, a memorial address) against each other, or explain multiple variables (e.g. that freedom changed dramatically in constitutional law by 1865 but remained incompletely realized in practice through Reconstruction\'s retreat by 1877) — earned through the essay\'s overall argument, not from one clever sentence in isolation.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP APUSH DBQ scale, distinct from the AP Lang 6-point rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the five documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which the Civil War and Reconstruction transformed the meaning of American freedom in the period 1844-1877." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least four of the five documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apush-osullivan-annexation.v1',
        'evelyn.passage.douglass-fourth-of-july.v1',
        'evelyn.passage.apush-sc-secession.v1',
        'evelyn.passage.apush-emancipation-proclamation.v1',
        'evelyn.passage.lincoln-gettysburg.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that between 1844 and 1877, the meaning of American freedom shifted from a racially bounded, providential ideal of expansion for white Americans into one the Civil War legally transformed into freedom for millions of formerly enslaved people — a transformation substantial in constitutional law by 1865, yet bitterly contested at every step and only unevenly secured in practice by the time Reconstruction ended in 1877, or a comparably defensible complex claim with a clear line of reasoning. Contextualization situates the packet in how territorial expansion in the 1840s reopened the question of whether slavery would spread into new Western land, a fight that hardened through the 1850s (the Compromise of 1850, the Kansas-Nebraska Act, Dred Scott) into the sectional crisis that produced secession and war. The body groups at least four of the five documents around the thesis rather than summarizing them in order: O\'Sullivan\'s claim that expansion was "manifest destiny... allotted by Providence for the free development of our yearly multiplying millions" (Doc 1) shows that antebellum "American freedom" was already articulated as a providential, exclusionary national ideal, one Frederick Douglass directly indicts a few years later when he tells his audience "this Fourth of July is yours, not mine" and that their "shouts of liberty and equality" are "hollow mockery" to an enslaved people (Doc 2); South Carolina\'s own secession declaration, protesting that the non-slaveholding states "have denounced as sinful the institution of slavery" and encouraged "our slaves to leave their homes" (Doc 3), shows secessionists defining their own vision of freedom explicitly around the right to hold enslaved people as property; and the Emancipation Proclamation\'s order that persons held as slaves in rebellious states "are, and henceforward shall be free" (Doc 4), paired with Lincoln\'s Gettysburg call for "a new birth of freedom" and government "of the people, by the people, for the people" (Doc 5), shows the war legally and rhetorically re-centering "freedom" around Black Americans\' inclusion for the first time. Outside evidence brings in the Thirteenth Amendment (1865), which abolished slavery as constitutional law across the entire United States — including the border states and Union-occupied areas the war-measure Emancipation Proclamation itself had not reached — completing in permanent law what the Proclamation had begun as a temporary military measure, a fact beyond anything the Proclamation excerpt itself describes. Sourcing explains that South Carolina\'s convention (Doc 3) drafted its declaration in December 1860, right after Lincoln\'s election, specifically to justify secession to other slave states and the wider public, which explains why it centers Northern interference with "domestic institutions" as its stated grievance; that Lincoln issued the Emancipation Proclamation (Doc 4) as a wartime executive order under his war powers, closing by invoking "the considerate judgment of mankind," which explains why it grounds freedom in "military necessity" rather than a broader constitutional claim; and that Lincoln delivered the Gettysburg Address (Doc 5) at a battlefield cemetery dedication before a war-weary Union audience, which explains why it reframes the war\'s mounting cost in universal terms of human equality rather than as a narrower military accounting. Complexity is shown by weighing continuity against change: the racially bounded freedom O\'Sullivan assumed in 1845 and Douglass exposed in 1852 (Docs 1-2) was defended explicitly, not incidentally, by the Confederacy\'s own founding document (Doc 3), and only the war itself broke that pattern, first as a military necessity (Doc 4) and then as a soaring national reframing (Doc 5) — yet the Compromise of 1877, which withdrew federal troops and ended Reconstruction enforcement, alongside the sharecropping system that left most freedpeople without land, shows that this hard-won legal transformation of freedom remained incompletely realized in the everyday lives of freedpeople by the period\'s close, so the "transformation" this prompt asks about was genuine and dramatic in law but partial and contested in practice.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which the Civil War and Reconstruction transformed the meaning of American freedom, 1844-1877) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a list with no line of reasoning ("some things changed and some didn\'t"). No credit (0/1) for a thesis that only restates the prompt, offers an unsupported list, or is not historically defensible.',
            modelResponse:
              'Between 1844 and 1877, the meaning of American freedom shifted from a racially bounded, providential ideal of expansion for white Americans into one the Civil War legally transformed into freedom for millions of formerly enslaved people — a transformation substantial in constitutional law by 1865, yet bitterly contested at every step and only unevenly secured in practice by the time Reconstruction ended in 1877.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. how territorial expansion in the 1840s reopened the question of slavery\'s spread into new Western land, hardening through the 1850s into sectional crisis. No credit (0/1) for a single vague, unsupported phrase ("the country was divided over slavery") or context copied from a document without independent elaboration.',
            modelResponse:
              'Territorial expansion in the 1840s reopened the exact question the country had tried to avoid — whether slavery would spread into new Western land — and that fight hardened through the 1850s, via the Compromise of 1850, the Kansas-Nebraska Act, and the Dred Scott decision, into the sectional crisis that produced secession and war.',
          },
          {
            criterionId: 'C-doc-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST FOUR of the five documents, grouped to support the essay\'s line of reasoning (not summarized one at a time in isolation). 1/2: accurately describes the content of at least three documents, whether or not they clearly support an argument. 0/2: fewer than three documents used, or documents are misdescribed.',
            modelResponse:
              'O\'Sullivan\'s claim that expansion was "manifest destiny... allotted by Providence for the free development of our yearly multiplying millions" (Doc 1) shows antebellum "American freedom" already articulated as an exclusionary national ideal, one Douglass directly indicts when he tells his audience "this Fourth of July is yours, not mine" and that their "shouts of liberty and equality" are "hollow mockery" (Doc 2). South Carolina\'s declaration that the non-slaveholding states "have denounced as sinful the institution of slavery" (Doc 3) shows secessionists defining their own freedom explicitly around the right to hold enslaved people as property. The Emancipation Proclamation\'s order that persons held as slaves in rebellious states "are, and henceforward shall be free" (Doc 4), paired with Lincoln\'s Gettysburg call for "a new birth of freedom" (Doc 5), shows the war legally and rhetorically re-centering freedom around Black Americans\' inclusion.',
          },
          {
            criterionId: 'D-outside-evidence',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the five documents, relevant to the argument, and EXPLAINS its relevance (not just names it). No credit (0/1) for a vague reference with no specific evidence, or evidence that is simply named with no explanation of how it supports the thesis.',
            modelResponse:
              'The Thirteenth Amendment (1865) abolished slavery as constitutional law across the entire United States — including the border states and Union-occupied areas the war-measure Emancipation Proclamation itself had not reached — completing in permanent constitutional law what the Proclamation had begun only as a temporary wartime measure.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date without explaining relevance to the argument.',
            modelResponse:
              'South Carolina\'s convention (Doc 3) drafted its declaration in December 1860, right after Lincoln\'s election, specifically to justify secession to other slave states and the wider public, which explains why it centers Northern interference with "domestic institutions" as its stated grievance. Lincoln issued the Emancipation Proclamation (Doc 4) as a wartime executive order under his war powers, closing by invoking "the considerate judgment of mankind," which explains why it grounds freedom in "military necessity" rather than a broader constitutional claim. Lincoln delivered the Gettysburg Address (Doc 5) at a battlefield cemetery dedication before a war-weary Union audience, which explains why it reframes the war\'s mounting cost in universal terms of human equality.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. explicitly weighing continuity against change, corroborating multiple document types against each other, or explaining more than one variable (here, contrasting a genuine legal transformation of freedom by 1865 with its incomplete realization in practice by 1877) — not from a single isolated clever sentence. No credit (0/1) if the essay treats "transformation" as a single flat verdict with no qualification or comparison.',
            modelResponse:
              'The racially bounded freedom O\'Sullivan assumed in 1845 and Douglass exposed in 1852 (Docs 1-2) was defended explicitly by the Confederacy\'s own founding document (Doc 3), and only the war broke that pattern, first as military necessity (Doc 4) and then as a soaring national reframing (Doc 5) — yet the Compromise of 1877, which withdrew federal troops and ended Reconstruction enforcement, alongside the sharecropping system that left most freedpeople without land, shows this legal transformation of freedom remained incompletely realized in practice by the period\'s close.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3, then 4, then 5 in order.',
        'For sourcing, ask: why did THIS author write THIS document for THIS audience, and how does that explain what it argues?',
        'Your outside-evidence fact should come from your own knowledge of the period, not be paraphrased from one of the five documents.',
        'A strong complexity move is contrasting how much the meaning of freedom changed in LAW by 1865 with how unevenly it was realized in PRACTICE by 1877.',
      ],
      estimatedMinutes: 48,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The DBQ asks you to build YOUR OWN argument and use the documents (plus outside knowledge) as evidence — never summarize each document in its own paragraph.',
        'The 7-point rubric: Thesis (1); Contextualization (1); Evidence from the Documents (2, requires 4+ of the 5 documents for full credit); Evidence Beyond the Documents (1, one explained outside fact); Sourcing (1, HIPP explained for 3+ documents); Complexity (1, earned holistically).',
        'Sourcing means explaining WHY a document\'s author/purpose/audience/situation matters to your argument — not just naming the author or date.',
        'A strong complexity move for this packet: the meaning of American freedom changed dramatically in constitutional law by 1865, but remained incompletely realized in practice through Reconstruction\'s retreat by 1877.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5-DBQ',
    cedTitle: 'Period 5 DBQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Contextualization 1 / Evidence-Documents 2 / Evidence-Beyond 1 / Sourcing 1 / Complexity 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-osullivan-annexation.v1',
        chapter: '1845',
        note: "John L. O'Sullivan, \"Annexation\" — Document 1 of the five-document Period-5 packet.",
      },
      {
        type: 'passage',
        book: 'evelyn.passage.douglass-fourth-of-july.v1',
        chapter: '1852',
        note: 'Frederick Douglass, "What to the Slave Is the Fourth of July?" — Document 2 of the packet (reused from the AP English Language catalog).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-sc-secession.v1',
        chapter: '1860',
        note: 'South Carolina, Declaration of the Immediate Causes of Secession — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-emancipation-proclamation.v1',
        chapter: '1863',
        note: 'Abraham Lincoln, the Emancipation Proclamation — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.lincoln-gettysburg.v1',
        chapter: '1863',
        note: 'Abraham Lincoln, the Gettysburg Address — Document 5 of the packet (reused from the AP English Language catalog).',
      },
    ],
  },
};
