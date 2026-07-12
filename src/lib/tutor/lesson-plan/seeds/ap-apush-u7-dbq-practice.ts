/**
 * AP US History — Period 7 DBQ Practice: the full Document-Based Question
 * essay (AP APUSH Free-Response Question 1).
 *
 * This is the essay-practice plan that closes out the Period-7 content arc
 * (imperialism 7.2-7.3, progressivism 7.4-7.5, WWI 7.6-7.8, the twenties
 * 7.9-7.10, the Depression and New Deal 7.11-7.12, WWII 7.13-7.15): students
 * now write ONE complete DBQ essay under real AP exam conditions, using a
 * genuine five-document packet, and are scored against the authentic AP
 * APUSH 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..5 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. Theodore Roosevelt, Fourth Annual Message to Congress / "Roosevelt
 *      Corollary" (1904) — evelyn.passage.apush-roosevelt-corollary.v1
 *   2. Woodrow Wilson, war message to Congress (1917) —
 *      evelyn.passage.apush-wilson-war-message.v1
 *   3. FDR, First Inaugural Address (1933) —
 *      evelyn.passage.apush-fdr-first-inaugural.v1
 *   4. FDR, Four Freedoms speech (1941) —
 *      evelyn.passage.apush-four-freedoms.v1
 *   5. Executive Order 9066 (1942) — evelyn.passage.apush-eo-9066.v1
 *
 * Document fidelity (see each passage's own docblock for the seeded
 * excerpt's exact scope): Document 1 states only the "international police
 * power" corollary claim, NOT the message's later, unseeded discussion of
 * Santo Domingo customs receivership — that specific application is outside
 * evidence. Document 2 is only Wilson's idealist framing of war aims ("no
 * selfish ends," "no conquest, no dominion"), NOT the message's earlier,
 * unseeded discussion of German submarine warfare. Document 3 is exactly
 * TWO non-adjacent spans from FDR's First Inaugural — "the only thing we
 * have to fear is fear itself" and, after an ellipsis, "action, and action
 * now ... put people to work ... direct recruiting by the Government
 * itself ... stimulate and reorganize the use of our great natural
 * resources" — they are NEVER adjacent in the source, and the famous phrase
 * "bold, persistent experimentation" is from FDR's 1932 Oglethorpe
 * University address, NEVER this inaugural; it is never quoted or
 * attributed to Document 3 anywhere in this plan. Document 4 is only the
 * four freedoms as FDR articulates them (speech/expression, worship, from
 * want, from fear) as aspirations for "the future days," not any specific
 * enacted policy. Document 5 is only Executive Order 9066's race-neutral
 * operative authorization text ("any or all persons may be excluded") —
 * its real-world application specifically to Japanese Americans is outside/
 * context knowledge, kept clearly separated from the document's own text
 * throughout this plan.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U7_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u7-dbq-practice.v1',
  title: 'Period 7 DBQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u7-dbq-practice',
      description:
        'Write a complete AP APUSH Document-Based Question essay from a five-document Period-7 packet evaluating the extent to which the role of the federal government in American life expanded in the period 1890-1945 — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP APUSH 7-point DBQ rubric.',
      standard: 'AP-APUSH-7-DBQ',
    },
  ],
  prerequisites: [
    'apush.imperialism',
    'apush.progressivism',
    'apush.wwi',
    'apush.twenties',
    'apush.depression-new-deal',
    'apush.wwii-era',
  ],
  followUps: [],
  estimatedMinutes: 58,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "Everything you've learned about Period 7 — the reach for overseas empire, the Progressive campaign to regulate business and expand democracy, a world war fought in idealistic terms, the boom-and-bust twenties, the New Deal's remaking of the federal government's economic role, and a second world war that mobilized American society (and violated American citizens' civil liberties) on an unprecedented scale — exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP US History exam, scored on the authentic 7-point rubric: Thesis (1), Contextualization (1), Evidence from the Documents (2), Evidence Beyond the Documents (1), Sourcing (1), and Complexity (1). You'll get five documents spanning 1904 to 1942. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument about how far, and how evenly, the federal government's role in American life actually expanded, and use the documents, plus what you already know, as evidence for it. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the five-document Period-7 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get five documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph ("Document 1 says X. Document 2 says Y.") instead of grouping documents around a claim.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not a simple list of "the government got bigger." A strong thesis for this packet might argue the federal government\'s role expanded across foreign policy, the domestic economy, and even individual citizens\' daily lives between 1890 and 1945, but that expansion arrived unevenly — sometimes as rhetoric and doctrine, sometimes as concrete new institutions and powers — and remained contested at every stage rather than following one smooth, uncontested path.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing how, before 1890, the federal government\'s peacetime role was narrow (tariffs, currency, land policy, minimal regulation of an industrializing economy), so that the sequence of crises this packet spans — an overseas empire, a world war, the Great Depression, a second world war — repeatedly pressured Washington to take on responsibilities it had never held before — in AT LEAST a full sentence of specific description, not a single vague phrase like "the government used to do less."',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0–2 points): 1 point for accurately describing the content of at least three documents; the full 2 points require using the content of AT LEAST FOUR of the five documents to SUPPORT the thesis\'s argument (the real AP threshold for this row) — e.g. grouping the Roosevelt Corollary (Doc 1) and Wilson\'s war message (Doc 2) as evidence that the federal government first expanded its ambitions in FOREIGN affairs, asserting a right to police the Western Hemisphere and later to remake the world "safe for democracy"; FDR\'s First Inaugural (Doc 3) as evidence the government then reached directly into the DOMESTIC economy, promising government-organized employment "treating the task as we would treat the emergency of a war"; and the Four Freedoms (Doc 4) alongside Executive Order 9066 (Doc 5) as evidence the government\'s expanded sense of responsibility for citizens\' economic security and its wartime authority over individuals\' movement and residence reached its furthest point by the early 1940s — one framed as universal aspiration, the other exercised as concrete, sweeping domestic power.',
        'ROW D — EVIDENCE BEYOND THE DOCUMENTS (0–1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the five documents, relevant to the argument and explained (not just named) — e.g. the Social Security Act (1935), which none of the five documents mentions, as evidence the federal government\'s expanded domestic economic role went well beyond emergency job creation (Doc 3) into a permanent, ongoing entitlement program restructuring citizens\' relationship to the government for the rest of their lives.',
        'ROW E — SOURCING (0–1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. the Roosevelt Corollary (Doc 1) was delivered as an official annual message to Congress, meaning it functions as a formal doctrine intended to justify future interventions in advance, which explains its careful, reluctant-sounding legal language ("however reluctantly," "flagrant cases"); FDR\'s First Inaugural (Doc 3) was delivered at the very depth of the banking crisis to a frightened public roughly a quarter of whom were unemployed, which explains why it moves from calming fear to demanding immediate government action; and Executive Order 9066 (Doc 5) is a formal executive order directed at military officials rather than the public, which explains its authorizing, legalistic tone and its formally race-neutral wording, in contrast to the persuasive public rhetoric of Docs 1-4.',
        'ROW F — COMPLEXITY (0–1 point): earned holistically for a nuanced argument that does things like explain both continuity AND change, corroborate multiple document types (an annual message, a war address, an inaugural speech, a state-of-the-union speech, an executive order) against each other, or explain multiple variables (e.g. that the expansion moved from rhetorical/doctrinal in foreign affairs (Docs 1-2, 4) to concrete and operational in domestic life (Docs 3, 5), and that the expansion was contested at each stage rather than uniformly accepted) — earned through the essay\'s overall argument, not from one clever sentence in isolation.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP APUSH DBQ scale, distinct from the AP Lang 6-point rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the five documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which the role of the federal government in American life expanded in the period 1890–1945." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least four of the five documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apush-roosevelt-corollary.v1',
        'evelyn.passage.apush-wilson-war-message.v1',
        'evelyn.passage.apush-fdr-first-inaugural.v1',
        'evelyn.passage.apush-four-freedoms.v1',
        'evelyn.passage.apush-eo-9066.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that the federal government\'s role in American life expanded across foreign policy, the domestic economy, and individual citizens\' daily lives between 1890 and 1945, but that this expansion arrived unevenly — sometimes as rhetoric and doctrine, sometimes as concrete new institutions and powers — and remained contested at every stage rather than following one smooth, uncontested path, or a comparably defensible complex claim with a clear line of reasoning. Contextualization situates the packet against the narrow pre-1890 federal peacetime role (tariffs, currency, land policy, minimal regulation of an industrializing economy), so that the sequence of crises this packet spans — an overseas empire, a world war, the Great Depression, a second world war — repeatedly pressured Washington to take on responsibilities it had never held before. The body groups at least four documents around the thesis rather than summarizing them in order: the Roosevelt Corollary\'s claim that the U.S. may need to exercise an "international police power" over Western Hemisphere nations guilty of "chronic wrongdoing" (Doc 1), together with Wilson\'s framing of U.S. entry into World War I as a mission so that "the world must be made safe for democracy" with "no selfish ends to serve" (Doc 2), show the federal government first expanding its ambitions in FOREIGN affairs, well beyond simply defending narrow national interests; FDR\'s First Inaugural, moving from calming a paralyzing "fear itself" to demanding "action, and action now" and promising the government would put people to work through "direct recruiting by the Government itself ... treating the task as we would treat the emergency of a war" (Doc 3), shows the government then reaching directly into the DOMESTIC economy in a way it never had in peacetime; and FDR\'s Four Freedoms, naming freedom from want as a "healthy peacetime life" the world should secure "everywhere" (Doc 4), alongside Executive Order 9066\'s authorization for military commanders to exclude "any or all persons" from designated areas and restrict their right to "enter, remain in, or leave" (Doc 5), show that by the early 1940s the government\'s expanded sense of responsibility reached both the rhetorical (an aspiration for global economic security) and the starkly operational (sweeping wartime authority over individuals\' movement and residence at home). Outside evidence brings in the Social Security Act (1935), which none of the five documents mentions, establishing permanent old-age pensions and unemployment insurance — a far more durable, ongoing expansion of the federal government\'s domestic economic role than the emergency job-creation Document 3 describes, restructuring millions of Americans\' relationship to the government for the rest of their lives. Sourcing explains that the Roosevelt Corollary (Doc 1) was delivered as a formal annual message to Congress, meaning it functions as an official doctrine meant to justify future interventions in advance, which explains its careful, reluctant-sounding legal language ("however reluctantly," "flagrant cases"); that FDR\'s First Inaugural (Doc 3) was delivered at the very depth of the banking crisis to a frightened public roughly a quarter of whom were unemployed, which explains why the address moves from reassurance to a direct demand for government action; and that Executive Order 9066 (Doc 5), as a formal executive order directed at military officials rather than the public, explains its authorizing, legalistic tone and its formally race-neutral wording, in sharp contrast to the persuasive public rhetoric of the other four documents. Complexity is shown by weighing how differently this expansion actually played out: rhetorical and doctrinal in foreign policy and in the Four Freedoms\' global aspirations (Docs 1, 2, 4) versus concrete and operational in the emergency job-creation of the New Deal and the wartime authority of Executive Order 9066 (Docs 3, 5) — and by noting the expansion was never uncontested, since Executive Order 9066\'s own formally race-neutral wording stood in sharp tension with how that authority was actually used against one specific group, showing that "expansion" of federal power and its exercise in a way consistent with American civil-liberties principles were two different things.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which the federal government\'s role in American life expanded, 1890-1945) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a simple list ("the government got bigger and did more things"). No credit (0/1) for a thesis that only restates the prompt, offers a list with no line of reasoning, or is not historically defensible.',
            modelResponse:
              'The federal government\'s role in American life expanded across foreign policy, the domestic economy, and individual citizens\' daily lives between 1890 and 1945, but that expansion arrived unevenly — sometimes as rhetoric and doctrine, sometimes as concrete new institutions and powers — and remained contested at every stage rather than following one smooth, uncontested path.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. the narrow pre-1890 federal peacetime role (tariffs, currency, land policy, minimal regulation of an industrializing economy) against which the period\'s repeated crises pressured the government to take on new responsibilities. No credit (0/1) for a single vague, unsupported phrase ("the government used to do less") or context copied from a document without independent elaboration.',
            modelResponse:
              'Before 1890, the federal government\'s peacetime role was narrow — largely limited to setting tariffs and currency policy, managing public land, and only minimally regulating an increasingly industrial economy — so the sequence of crises this period spans, from an overseas empire through a world war, the Great Depression, and a second world war, repeatedly pressured Washington to take on responsibilities it had never held before.',
          },
          {
            criterionId: 'C-doc-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST FOUR of the five documents, grouped to support an argument in response to the prompt (not summarized one at a time in isolation) — the real AP threshold for this row. 1/2: accurately describes the content of at least three documents, whether or not they clearly support an argument. 0/2: fewer than three documents used, or documents are misdescribed.',
            modelResponse:
              'The Roosevelt Corollary\'s claim to an "international police power" over Western Hemisphere nations guilty of "chronic wrongdoing" (Doc 1), together with Wilson\'s framing of U.S. entry into World War I so that "the world must be made safe for democracy" with "no selfish ends to serve" (Doc 2), show the government first expanding its ambitions in FOREIGN affairs. FDR\'s First Inaugural, moving from "fear itself" to demanding "action, and action now" and promising "direct recruiting by the Government itself" to put people to work "as we would treat the emergency of a war" (Doc 3), shows the government reaching directly into the DOMESTIC economy. The Four Freedoms\' naming of freedom from want as a "healthy peacetime life" owed to people "everywhere" (Doc 4), alongside Executive Order 9066\'s authorization to exclude "any or all persons" from designated areas (Doc 5), show the government\'s expanded sense of responsibility reaching both global economic aspiration and sweeping wartime authority over individuals at home.',
          },
          {
            criterionId: 'D-outside-evidence',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the five documents, relevant to the argument, and EXPLAINS its relevance (not just names it). No credit (0/1) for a vague reference with no specific evidence, or evidence that is simply named with no explanation of how it supports the thesis.',
            modelResponse:
              'The Social Security Act (1935), which none of the five documents mentions, established permanent old-age pensions and unemployment insurance — a far more durable, ongoing expansion of the federal government\'s domestic economic role than the emergency job-creation Document 3 describes, restructuring millions of Americans\' relationship to their government for the rest of their lives.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date without explaining relevance to the argument.',
            modelResponse:
              'The Roosevelt Corollary (Doc 1) was delivered as a formal annual message to Congress, meaning it functions as an official doctrine meant to justify future interventions in advance, which explains its careful, reluctant-sounding legal language ("however reluctantly," "flagrant cases"). FDR\'s First Inaugural (Doc 3) was delivered at the very depth of the banking crisis to a frightened public roughly a quarter of whom were unemployed, which explains why the address moves from reassurance to a direct demand for government action. Executive Order 9066 (Doc 5), as a formal executive order directed at military officials rather than the public, explains its authorizing, legalistic tone and its formally race-neutral wording, in sharp contrast to the persuasive public rhetoric of the other documents.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. explicitly weighing how unevenly the expansion played out across different domains, corroborating multiple document types against each other, or explaining more than one variable (here, rhetorical/doctrinal expansion versus concrete operational expansion, and the tension between an expanded power\'s formal wording and its actual use) — not from a single isolated clever sentence. No credit (0/1) if the essay treats "expansion" as a single flat verdict with no qualification or comparison.',
            modelResponse:
              'What complicates a simple "the government just kept growing" narrative is how differently that growth actually played out: expansion was often rhetorical and doctrinal in foreign policy and in the Four Freedoms\' global aspirations (Docs 1, 2, 4), but concrete and operational in the New Deal\'s emergency job-creation and Executive Order 9066\'s wartime authority (Docs 3, 5) — and it was never uncontested, since Executive Order 9066\'s own formally race-neutral wording stood in sharp tension with how that authority was actually used against one specific group, showing that the expansion of federal power and its exercise consistent with American civil-liberties principles were two very different things.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3 in order.',
        'For sourcing, ask: why did THIS author write THIS document for THIS audience, and how does that explain what it argues?',
        'Your outside-evidence fact should come from your own knowledge of the period, not be paraphrased from one of the five documents.',
        'A strong complexity move is contrasting rhetorical/doctrinal expansion (Docs 1, 2, 4) with concrete operational expansion (Docs 3, 5).',
        'Document 3 is TWO separate spans from FDR\'s First Inaugural, joined by an ellipsis — do not treat them as one continuous quote, and never attribute "bold, persistent experimentation" (a different, 1932 speech) to it.',
        'Document 5\'s own text never names Japanese Americans — its wording is formally race-neutral; how that authority was actually used is your own outside/context knowledge, not the document\'s content.',
      ],
      estimatedMinutes: 48,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The DBQ asks you to build YOUR OWN argument and use the documents (plus outside knowledge) as evidence — never summarize each document in its own paragraph.',
        'The 7-point rubric: Thesis (1); Contextualization (1); Evidence from the Documents (2, requires 4+ documents for full credit); Evidence Beyond the Documents (1, one explained outside fact); Sourcing (1, HIPP explained for 3+ documents); Complexity (1, earned holistically).',
        'Sourcing means explaining WHY a document\'s author/purpose/audience/situation matters to your argument — not just naming the author or date.',
        'A strong complexity move for this packet: rhetorical/doctrinal expansion (Docs 1, 2, 4) versus concrete operational expansion (Docs 3, 5).',
        'Document fidelity: Document 3 is two non-adjacent spans from FDR\'s First Inaugural ("bold, persistent experimentation" is NEVER this document); Document 5\'s excerpt is race-neutral authorization text only — its application to Japanese Americans is outside evidence, not the document\'s own content.',
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
    cedTitle: 'Period 7 DBQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Contextualization 1 / Evidence-Documents 2 / Evidence-Beyond 1 / Sourcing 1 / Complexity 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-roosevelt-corollary.v1',
        chapter: '1904',
        note: 'Theodore Roosevelt, Fourth Annual Message to Congress ("Roosevelt Corollary") — Document 1 of the five-document Period-7 packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-wilson-war-message.v1',
        chapter: '1917',
        note: 'Woodrow Wilson, war message to Congress — Document 2 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-fdr-first-inaugural.v1',
        chapter: '1933',
        note: 'FDR, First Inaugural Address — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-four-freedoms.v1',
        chapter: '1941',
        note: 'FDR, Four Freedoms speech — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-eo-9066.v1',
        chapter: '1942',
        note: 'Executive Order 9066 — Document 5 of the packet.',
      },
    ],
  },
};
