/**
 * AP World History: Modern — Unit 7 DBQ Practice: the full Document-Based
 * Question essay (AP World FRQ 1), closing out the Unit-7 content arc (WWI
 * as a global war 7.1-7.3, the Great Depression and interwar crisis 7.4-7.6,
 * WWII as a global war 7.7, and the legacies of the total-war century 7.8-7.9).
 *
 * Students write ONE complete DBQ essay under real AP exam conditions, using
 * a genuine five-document Unit-7 packet, and are scored against the
 * authentic AP World 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..5 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. Woodrow Wilson, Fourteen Points (1918) —
 *      evelyn.passage.apworld-fourteen-points.v1
 *   2. Treaty of Versailles, Article 231 and Article 22 (1919) —
 *      evelyn.passage.apworld-versailles.v1
 *   3. Indian Army Recruitment Poster (WWI, described visual) —
 *      evelyn.passage.apworld-wwi-propaganda-visual.v1
 *   4. Great Depression Indicators, 1929-1934 (described data table) —
 *      evelyn.passage.apworld-depression-table.v1
 *   5. FDR, Four Freedoms Speech (1941) — REUSE —
 *      evelyn.passage.apush-four-freedoms.v1
 *
 * GOTCHA GUARDED AGAINST (from the U6 DBQ review, and this unit's own
 * fidelity traps): every reference to document content below is checked
 * against each document's ACTUAL seeded fullText.
 *   - Fourteen Points (Doc 1) quoted only for Points I, V, XIV — Point V's
 *     "equal weight" colonial-claims language is the throughline for the
 *     essay's argument, never treated as a delivered outcome.
 *   - Versailles (Doc 2) Article 231 is the War Guilt Clause (Part VIII,
 *     Reparations); Article 22 is quoted as what it actually is — the
 *     Covenant of the League of Nations, incorporated as Part I of the
 *     treaty — never as if it sat in the reparations sections.
 *   - The poster (Doc 3) is a DESCRIBED visual: its caption is paraphrased
 *     in the sense IWM's catalogue gives it ("this soldier is defending
 *     India"), never presented as a verbatim quoted translation. The
 *     "more than 1.3 million men" figure is the seed's own figure — never
 *     inflated past it.
 *   - The Depression table (Doc 4) is scoped to its three rows exactly:
 *     world trade's ~66% gold-value contraction to ~1/3 of 1929's level
 *     (1929-1934), US unemployment 24.9% (1933), German unemployment ~30%
 *     (1932) — never conflated into a single unlabeled figure.
 *   - Four Freedoms (Doc 5) is dated 6 January 1941 and never treated as
 *     contemporaneous with an already-operating Lend-Lease Act, which
 *     Congress did not pass until March 1941 — the speech PRECEDES and
 *     helped build support for Lend-Lease, it does not describe it.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U7_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u7-dbq-practice.v1',
  title: 'Unit 7 DBQ Practice — Empires and Colonies Through Two World Wars',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u7-dbq-practice',
      description:
        'Write a complete AP World History Document-Based Question essay from a five-document Unit-7 packet on how the World Wars transformed the relationship between imperial powers and their colonies, 1900-1945 — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP World 7-point DBQ rubric.',
      standard: 'AP-APWORLD-7-DBQ',
    },
  ],
  prerequisites: [
    'apworld.wwi-global',
    'apworld.interwar-world',
    'apworld.wwii-global',
    'apworld.conflict-legacies',
  ],
  followUps: [],
  estimatedMinutes: 58,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "Everything you've learned about Unit 7 — the global scale of the First World War, the peace that followed it, the Great Depression's worldwide reach, the Second World War's even larger colonial mobilization, and the legacies both wars left behind — exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP World History exam, scored on the authentic 7-point rubric: Thesis (1), Contextualization (1), Evidence from the Documents (2), Evidence Beyond the Documents (1), Sourcing (1), and Complexity (1). You'll get five documents — a wartime speech, a peace treaty, a recruitment poster, an economic data table, and a second wartime speech — spanning almost half a century of imperial powers and their colonies. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument about how far the World Wars actually transformed that relationship, and use the documents, plus what you already know, as evidence for it. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the five-document Unit-7 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get five documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph ("Document 1 says X. Document 2 says Y.") instead of grouping documents around a claim.',
        'ROW A — THESIS/CLAIM (0-1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not a simple list of "colonies helped in the wars and some things changed." A strong thesis for this packet might argue that the World Wars transformed the imperial-colonial relationship substantially in rhetoric and expectation — through repeated wartime promises of self-determination and universal freedom — but only to a limited extent in the actual structure of empire by 1945, since both the peace settlement after WWI and the economic order of the interwar years reasserted imperial control, even as the accumulated gap between promise and reality built the political pressure that would drive decolonization after 1945.',
        'ROW B — CONTEXTUALIZATION (0-1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing how, by 1900, European powers already controlled vast colonial territories acquired through nineteenth-century imperial expansion (including the 1884-85 Berlin Conference\'s partition of Africa), built on colonial economies organized around resource extraction and export production — the pre-existing imperial order that both World Wars would test and, in different ways, strain — in AT LEAST a full sentence of specific description, not a single vague phrase like "empires existed before the wars."',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0-2 points): 1 point for accurately describing the content of at least three documents; the full 2 points require using the content of at least four of the five documents to SUPPORT the thesis\'s argument — e.g. grouping Wilson\'s Fourteen Points\' promise of "equal weight" for colonized populations\' interests (Doc 1) and FDR\'s promise of freedom from want and fear "everywhere in the world" (Doc 5) as two moments, a generation apart, when a wartime leader raised colonized peoples\' expectations of change; the Versailles mandate system\'s language of "tutelage" over peoples "not yet able to stand by themselves" (Doc 2) as evidence that the actual 1919 settlement fell short of Wilson\'s own promise; the recruitment poster\'s more than 1.3 million Indian soldiers mobilized "without the political self-determination promised elsewhere in wartime Allied propaganda" (Doc 3) as evidence that colonial manpower was extracted without matching political change; and the Depression table\'s roughly 66 percent collapse in world trade (Doc 4) as evidence that the interwar economic order kept colonial and commodity-exporting economies structurally dependent on the same imperial trade networks.',
        'ROW D — EVIDENCE BEYOND THE DOCUMENTS (0-1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the five documents, relevant to the argument and explained (not just named) — e.g. the January 1944 Brazzaville Conference, at which Free French colonial administrators proposed limited administrative reforms for French Africa but explicitly ruled out any move toward self-government or independence, showing that even amid a second world war fought partly in the name of freedom, a colonial power\'s own wartime reform proposals still stopped well short of self-determination — something none of the five documents themselves describe.',
        'ROW E — SOURCING (0-1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. Wilson (Doc 1) spoke to the US Congress in January 1918 while the war was still being fought, stating aspirational American war aims rather than a binding legal text, which explains why colonized peoples could read Point V as a real promise even though it committed no signatory to anything; the Versailles treaty (Doc 2) was drafted and signed in 1919 by the victorious Allied powers, chiefly Britain and France, who received most of the mandates it created, which explains why its language assigns "tutelage" to "advanced nations" rather than weighing colonized populations\' interests equally; the Bombay-printed poster (Doc 3) was produced by the British colonial administration for the specific PURPOSE of wartime recruitment, which explains why it emphasizes loyalty and defense of India rather than any future political change for Indians.',
        'ROW F — COMPLEXITY (0-1 point): earned holistically for a nuanced argument that does things like explain both the RHETORICAL and the STRUCTURAL registers of "transformation" separately, corroborate multiple document types (a speech, a treaty, a described visual, a described data table, a second speech) against each other, or explain multiple variables (e.g. that the relationship changed differently for colonial manpower, colonial economies, and colonial political rhetoric) — earned through the essay\'s overall argument, not from one clever sentence in isolation.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP World DBQ scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the five documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which the World Wars transformed the relationship between imperial powers and their colonies, 1900-1945." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least four of the five documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apworld-fourteen-points.v1',
        'evelyn.passage.apworld-versailles.v1',
        'evelyn.passage.apworld-wwi-propaganda-visual.v1',
        'evelyn.passage.apworld-depression-table.v1',
        'evelyn.passage.apush-four-freedoms.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that the World Wars transformed the imperial-colonial relationship substantially in rhetoric and expectation but only to a limited extent in actual structure by 1945, since both the WWI peace settlement and the interwar economic order reasserted imperial control, even as the accumulated gap between promise and reality built the pressure that would drive decolonization after 1945 — or a comparably defensible complex claim with a clear line of reasoning. Contextualization explains that by 1900, European powers already controlled vast colonial territories acquired through nineteenth-century imperial expansion, including the 1884-85 Berlin Conference\'s partition of Africa, built on colonial economies organized around resource extraction and export production — the pre-existing imperial order both wars would test. The body groups at least four documents around the thesis rather than summarizing them in order: Wilson\'s Fourteen Points, promising that colonized populations\' interests would have "equal weight with the equitable claims of the government whose title is to be determined" (Doc 1), and FDR\'s promise, a generation later, of freedom from want and freedom from fear "everywhere in the world" (Doc 5), together show two wartime moments when a US president\'s rhetoric raised colonized peoples\' expectations of real change; the Versailles mandate system\'s actual language, assigning "tutelage" over peoples "not yet able to stand by themselves under the strenuous conditions of the modern world" to "advanced nations" as Mandatories (Doc 2), shows how far the binding 1919 settlement fell short of Wilson\'s own promise; the recruitment poster\'s documentation that British India contributed more than 1.3 million men to Allied forces "without the political self-determination promised elsewhere in wartime Allied propaganda" (Doc 3) shows colonial manpower extracted without matching political change; and the Depression table\'s roughly 66 percent collapse in world trade\'s gold value between 1929 and 1934 (Doc 4) shows that the interwar economic order kept colonial and commodity-exporting economies structurally bound to the same imperial trade networks that predated the war. Outside evidence brings in the January 1944 Brazzaville Conference, at which Free French colonial administrators proposed limited administrative reforms for French Africa but explicitly ruled out any move toward self-government or independence, showing that even amid a second world war fought partly in the name of freedom, a colonial power\'s own wartime reform proposals still stopped well short of self-determination — an example none of the five documents themselves describe. Sourcing explains that Wilson (Doc 1) spoke to Congress in January 1918 while the war was still being fought, stating aspirational American war aims rather than a binding legal text, which explains why colonized peoples could read Point V as a real promise even though no signatory was bound by it; that the Versailles treaty (Doc 2) was drafted and signed in 1919 by the victorious Allied powers, chiefly Britain and France, who received most of the mandates it created, which explains why its language assigns guardianship rather than weighing colonized populations\' interests equally; and that the Bombay-printed poster (Doc 3) was produced by the British colonial administration for the specific purpose of wartime recruitment, which explains why it emphasizes loyalty and defense of India rather than any future political change. Complexity is shown by separating the RHETORICAL register of change (repeated, genuine-sounding promises of self-determination and universal freedom) from the STRUCTURAL register (the mandate system, continued economic dependency, and Brazzaville\'s limited reforms), arguing that the former changed a great deal across 1900-1945 while the latter changed comparatively little by 1945 itself, and corroborating very different document types — a speech, a treaty, a described visual, a described data table, a second speech — rather than treating "transformation" as a single uniform verdict.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which the World Wars transformed the relationship between imperial powers and their colonies, 1900-1945) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a single unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt, offers a list with no line of reasoning ("colonies helped in the wars and some things changed"), or is not historically defensible.',
            modelResponse:
              'The World Wars transformed the imperial-colonial relationship substantially in rhetoric and expectation — through repeated wartime promises of self-determination and universal freedom — but only to a limited extent in the actual structure of empire by 1945, since both the WWI peace settlement and the interwar economic order reasserted imperial control, even as the accumulated gap between promise and reality built the pressure that would drive decolonization after 1945.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. the vast colonial territories European powers already controlled by 1900 (including the 1884-85 Berlin Conference\'s partition of Africa) and the extraction-oriented colonial economies built on top of them. No credit (0/1) for a single vague, unsupported phrase ("empires existed before the wars") or context copied from a document without independent elaboration.',
            modelResponse:
              'By 1900, European powers already controlled vast colonial territories acquired through nineteenth-century imperial expansion, including the formal partition of Africa negotiated at the 1884-85 Berlin Conference, and had built colonial economies organized around resource extraction and export production — the pre-existing imperial order that both World Wars would go on to test in different ways.',
          },
          {
            criterionId: 'C-doc-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST FOUR of the five documents, grouped to support the essay\'s line of reasoning (not summarized one at a time in isolation). 1/2: accurately describes the content of at least three documents, whether or not they clearly support an argument. 0/2: fewer than three documents used, or documents are misdescribed.',
            modelResponse:
              'Wilson\'s promise that colonized populations\' interests would have "equal weight with the equitable claims of the government whose title is to be determined" (Doc 1) and FDR\'s promise, a generation later, of freedom from want and fear "everywhere in the world" (Doc 5) together show two wartime moments when presidential rhetoric raised colonized peoples\' expectations. The Versailles mandate system\'s actual language, assigning "tutelage" over peoples "not yet able to stand by themselves" to "advanced nations" (Doc 2), shows how far the binding 1919 settlement fell short of that promise. The recruitment poster\'s documentation that British India contributed more than 1.3 million men "without the political self-determination promised elsewhere in wartime Allied propaganda" (Doc 3) shows manpower extracted without matching political change, and the Depression table\'s roughly 66 percent collapse in world trade\'s gold value (Doc 4) shows colonial economies remaining structurally bound to imperial trade networks through the interwar years.',
          },
          {
            criterionId: 'D-outside-evidence',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the five documents, relevant to the argument, and EXPLAINS its relevance (not just names it). No credit (0/1) for a vague reference with no specific evidence, or evidence that is simply named with no explanation of how it supports the thesis.',
            modelResponse:
              'The January 1944 Brazzaville Conference, at which Free French colonial administrators proposed limited administrative reforms for French Africa but explicitly ruled out any move toward self-government or independence, shows that even amid a second world war fought partly in the name of freedom, a colonial power\'s own wartime reform proposals still stopped well short of self-determination — an example none of the five documents themselves describe.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date without explaining relevance to the argument.',
            modelResponse:
              'Wilson (Doc 1) spoke to Congress in January 1918 while the war was still being fought, stating aspirational American war aims rather than a binding legal text, which explains why colonized peoples could read Point V as a real promise even though no signatory was bound by it. The Versailles treaty (Doc 2) was drafted and signed in 1919 by the victorious Allied powers, chiefly Britain and France, who received most of the mandates it created, which explains why its language assigns guardianship rather than weighing colonized populations\' interests equally. The Bombay-printed poster (Doc 3) was produced by the British colonial administration for the specific purpose of wartime recruitment, which explains why it emphasizes loyalty and defense of India rather than any future political change for Indians.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. separating the rhetorical register of change from the structural register, corroborating multiple document types against each other, or explaining more than one variable (here, that the relationship changed differently for colonial manpower, colonial economies, and colonial political rhetoric) — not from a single isolated clever sentence. No credit (0/1) if the essay treats "transformation" as a single flat verdict with no qualification or comparison.',
            modelResponse:
              'What complicates a simple "the wars transformed empire" narrative is separating the RHETORICAL register of change — repeated, genuine-sounding wartime promises of self-determination and universal freedom, from Wilson in 1918 to FDR in 1941 — from the STRUCTURAL register, where the 1919 mandate system, continued economic dependency through the Depression, and even 1944 Brazzaville\'s limited reforms show comparatively little actual change in imperial control by 1945 itself, corroborated across very different document types: two speeches, a treaty, a described visual, and a described data table.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3 in order.',
        'For sourcing, ask: why did THIS author write THIS document for THIS audience, and how does that explain what it argues?',
        'Only quote what a document actually says — the poster (Doc 3) is a DESCRIBED visual whose caption is paraphrased, never a verbatim translation, and Article 22 (Doc 2) is Part I of the treaty (the League Covenant), not the reparations sections that contain Article 231.',
        'Four Freedoms (Doc 5) was delivered in January 1941, before Lend-Lease was signed into law in March 1941 — don\'t describe Lend-Lease as already operating when FDR spoke.',
        'Your outside-evidence fact should come from your own knowledge of the period, not be paraphrased from one of the five documents.',
      ],
      estimatedMinutes: 48,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The DBQ asks you to build YOUR OWN argument and use the documents (plus outside knowledge) as evidence — never summarize each document in its own paragraph.',
        'The 7-point rubric: Thesis (1); Contextualization (1); Evidence from the Documents (2, requires 4+ documents for full credit on a 5-doc packet); Evidence Beyond the Documents (1, one explained outside fact); Sourcing (1, HIPP explained for 3+ documents); Complexity (1, earned holistically).',
        'Only attribute to a document what it actually says — the poster (Doc 3) is a described visual with a paraphrased caption, and Article 22 (Doc 2) is Part I of the treaty (the League Covenant), never the reparations sections.',
        'A strong complexity move for this packet: separate the RHETORICAL register of change (repeated wartime promises) from the STRUCTURAL register (the mandate system, continued economic dependency) — the former shifted a great deal, the latter comparatively little by 1945.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7-DBQ',
    cedTitle: 'Unit 7 DBQ Practice — Empires and Colonies Through Two World Wars',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Contextualization 1 / Evidence-Documents 2 / Evidence-Beyond 1 / Sourcing 1 / Complexity 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-fourteen-points.v1',
        chapter: '1918',
        note: "Woodrow Wilson, Fourteen Points — Document 1 of the five-document Unit-7 packet.",
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-versailles.v1',
        chapter: '1919',
        note: 'Treaty of Versailles, Article 231 and Article 22 — Document 2 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-wwi-propaganda-visual.v1',
        chapter: '1918',
        note: 'Indian Army Recruitment Poster (described visual) — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-depression-table.v1',
        chapter: '1929-1934',
        note: 'Great Depression Indicators (described data table) — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-four-freedoms.v1',
        chapter: '1941',
        note: 'FDR, Four Freedoms Speech — Document 5 of the packet (cross-course reuse from AP US History).',
      },
    ],
  },
};
