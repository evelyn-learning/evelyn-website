/**
 * AP US History — Period 8 DBQ Practice: the full Document-Based Question
 * essay (AP APUSH Free-Response Question 1).
 *
 * This is the essay-practice plan that closes out the Period-8 content arc
 * (Cold War origins 8.2-8.3, postwar society 8.4-8.6, the civil rights
 * movement 8.9-8.10, the Sixties/Great Society/Vietnam 8.7-8.8/8.11-8.13,
 * the crises of the 1970s 8.14-8.15): students write ONE complete DBQ essay
 * under real AP exam conditions, using a genuine 5-document packet, and are
 * scored against the authentic AP APUSH 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..5 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. Harry S. Truman, Address Before a Joint Session of Congress /
 *      "Truman Doctrine" (March 12, 1947) —
 *      evelyn.passage.apush-truman-doctrine.v1
 *   2. Dwight D. Eisenhower, Farewell Radio and Television Address
 *      (January 17, 1961) — evelyn.passage.apush-eisenhower-farewell.v1
 *   3. John F. Kennedy, Inaugural Address (January 20, 1961) —
 *      evelyn.passage.apush-jfk-inaugural.v1
 *   4. Lyndon B. Johnson, Remarks at the University of Michigan / "Great
 *      Society" speech (May 22, 1964) —
 *      evelyn.passage.apush-lbj-great-society.v1
 *   5. Brown v. Board of Education, Opinion of the Court (1954) —
 *      evelyn.passage.apgov-brown-opinion.v1 (REUSED from AP Gov Unit 3;
 *      here read as evidence of the federal courts acting as a
 *      Cold-War-era domestic actor, not re-litigated as a con-law holding)
 *
 * DOCUMENT FIDELITY: every modelResponse below attributes to each document
 * ONLY what its seeded excerpt actually contains. Two of the excerpts
 * (Doc 3 JFK, Doc 4 LBJ) contain an internal ellipsis joining
 * NON-ADJACENT segments of the delivered remarks — these are never treated
 * as continuous, unbroken prose. Doc 1 (Truman) never names Greece or
 * Turkey in its excerpt; that specific historical detail (and the naming
 * of "containment," the Marshall Plan, NATO, and NSC-68) is the student's
 * OUTSIDE evidence, kept clearly separated from document description.
 *
 * The teaching point is the DBQ TASK itself — thesis, contextualization,
 * document evidence, outside evidence, sourcing (HIPP), and complexity —
 * not new historical content; all quotes are the short, already-seeded
 * excerpts used elsewhere in the Period-8 catalog.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U8_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u8-dbq-practice.v1',
  title: 'Period 8 DBQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u8-dbq-practice',
      description:
        'Write a complete AP APUSH Document-Based Question essay from a five-document Period-8 packet — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP APUSH 7-point DBQ rubric.',
      standard: 'AP-APUSH-8-DBQ',
    },
  ],
  prerequisites: [
    'apush.cold-war-origins',
    'apush.postwar-society',
    'apush.civil-rights-movement',
    'apush.sixties-vietnam',
    'apush.seventies-crisis',
  ],
  followUps: [],
  estimatedMinutes: 58,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "Everything you've learned about Period 8 — the origins of the Cold War, postwar society, the civil rights movement, the Sixties and Vietnam, and the crises of the 1970s — exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP US History exam, scored on the authentic 7-point rubric: Thesis (1), Context (1), Evidence from the Documents (2), Outside Evidence (1), Sourcing (1), and Complexity (1). You'll get five documents spanning 1947 to 1964 — three presidential addresses, one farewell warning, and a Supreme Court opinion. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument about how the Cold War reshaped American government, and use the documents, plus what you already know, as evidence for it. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the five-document Period-8 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get five documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph ("Document 1 says X. Document 2 says Y.") instead of grouping documents around a claim.',
        'ROW A — THESIS (0-1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not a simple list of "the government grew during the Cold War." A strong thesis for this packet might argue the Cold War pushed the federal government to take on a far larger, more permanent role both abroad (an open-ended global security commitment) AND at home (a growing domestic footprint, from enforcing court-ordered desegregation to funding an ambitious social-welfare agenda), even as that expanded reach carried risks its own architects came to regret.',
        'ROW B — CONTEXT (0-1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing how wartime cooperation between the US and USSR broke down after 1945 over the fate of occupied Europe, hardening into an ideological rivalry between capitalist democracy and Communism by 1947 — in AT LEAST a full sentence of specific description, not a single vague phrase like "the Cold War was tense."',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0-2 points): 1 point for accurately describing the content of at least three documents; the full 2 points require using the content of at least four of the five documents to SUPPORT the thesis\'s argument — e.g. grouping Truman\'s universal commitment (Doc 1) and Kennedy\'s pledge to "pay any price, bear any burden" (Doc 3) as evidence of a sustained, presidentially renewed global commitment abroad; Eisenhower\'s warning about a permanent "military-industrial complex" reaching into "every city, every State house, every office of the Federal government" (Doc 2) as evidence the Cold War transformed government\'s role AT HOME, not just abroad; and Johnson\'s Great Society vision (Doc 4) alongside the Supreme Court\'s Brown opinion (Doc 5) as evidence that domestic government growth extended into civil rights enforcement and social welfare, not only defense.',
        'ROW D — OUTSIDE EVIDENCE (0-1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the five documents, relevant to the argument and explained (not just named) — e.g. NSC-68 (1950), the classified policy paper that recommended a dramatic, sustained expansion of US military spending to fund the containment commitment Truman announced in Doc 1 — which is exactly the growth Eisenhower is warning about eleven years later in Doc 2.',
        'ROW E — SOURCING (0-1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. Eisenhower\'s farewell address (Doc 2) was delivered by an outgoing, two-term president with no more elections to win, addressed directly to "the American people" as a warning rather than a policy proposal, which explains why he could candidly caution against the very defense establishment his own administration had helped build; Truman\'s address (Doc 1) was delivered to a joint session of Congress specifically to win support for an unprecedented peacetime foreign-aid commitment, which explains why he frames it in sweeping, universal terms rather than as a narrow, one-time request; Johnson\'s remarks (Doc 4) were a university commencement address delivered months before the actual Great Society legislation reached Congress, which explains why he pitches an expansive vision meant to build public appetite in advance of specific bills.',
        'ROW F — COMPLEXITY (0-1 point): earned holistically for a nuanced argument that does things like explain both continuity AND change, corroborate multiple document types (a congressional address, a farewell warning, an inaugural address, a commencement speech, a judicial opinion) against each other, or explain multiple variables (e.g. that the government\'s abroad and at-home transformations proceeded on different timelines and by different mechanisms) — earned through the essay\'s overall argument, not from one clever sentence in isolation.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP APUSH DBQ scale, distinct from the AP Lang 6-point rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the five documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which the Cold War transformed the role of the United States government at home and abroad in the period 1945–1980." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least four of the five documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apush-truman-doctrine.v1',
        'evelyn.passage.apush-eisenhower-farewell.v1',
        'evelyn.passage.apush-jfk-inaugural.v1',
        'evelyn.passage.apush-lbj-great-society.v1',
        'evelyn.passage.apgov-brown-opinion.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that the Cold War drove the federal government to a far larger, more permanent role both ABROAD — an open-ended global security commitment renewed by successive presidents — and AT HOME, where Cold-War-era federal capacity and legitimacy were increasingly turned toward domestic priorities from court-ordered desegregation to an ambitious social-welfare agenda, even though the resulting concentration of power troubled some of its own architects. Contextualization situates the packet in the collapse of the wartime US-Soviet alliance after 1945, as the two powers disagreed sharply over the fate of occupied Europe and the Soviet Union installed friendly Communist governments rather than allowing the free elections promised at Yalta, hardening by 1947 into the ideological standoff these documents respond to. The body groups at least four documents around the thesis rather than summarizing them in order: Truman\'s open-ended commitment to "support free peoples who are resisting attempted subjugation by armed minorities or by outside pressures" (Doc 1) and Kennedy\'s inaugural pledge that the country would "pay any price, bear any burden... to assure the survival and the success of liberty" (Doc 3) show the government renewing an expansive global commitment across three administrations; Eisenhower\'s warning that "this conjunction of an immense military establishment and a large arms industry" now reaches "every city, every State house, every office of the Federal government" through the "military-industrial complex" (Doc 2) shows the same Cold War commitment transformed government AT HOME, building a permanent domestic defense-industrial footprint; and Johnson\'s vision that "the Great Society... demands an end to poverty and racial injustice" and is "a challenge constantly renewed" (Doc 4), read alongside the Supreme Court\'s holding that segregated schools are "inherently unequal" under "the equal protection of the laws guaranteed by the Fourteenth Amendment" (Doc 5), together show the government\'s expanding domestic role reaching beyond defense spending into civil rights enforcement and social welfare. Outside evidence brings in NSC-68 (1950), the classified policy paper that recommended a dramatic, sustained expansion of US military spending to fund the containment commitment Truman announced in Doc 1 — evidence beyond the packet that explains exactly how the defense establishment grew large enough, by 1961, to trouble Eisenhower in Doc 2. Sourcing explains that Eisenhower\'s farewell address (Doc 2) was delivered by an outgoing two-term president with no further election to win, addressed as a warning directly to "the American people" rather than as a policy proposal, which explains why he could candidly caution against a military establishment his own administration had helped build; that Truman\'s address (Doc 1) was delivered to a joint session of Congress specifically to secure an unprecedented peacetime foreign-aid commitment, which explains why he frames the request in sweeping, universal terms about "alternative ways of life" rather than naming a one-time appropriation; and that Johnson\'s remarks (Doc 4) were a university commencement address delivered months before the actual Great Society legislation reached Congress, which explains its expansive, aspirational framing rather than a specific legislative pitch. Complexity is shown by explicitly weighing how the government\'s abroad and at-home transformations proceeded on different timelines and through different mechanisms — the abroad commitment renewed by successive presidents through speeches and treaties (Docs 1 and 3), the at-home commitment driven partly by defense spending Eisenhower himself questioned (Doc 2) and partly by a separate judicial and legislative track of civil-rights enforcement and social policy (Docs 4 and 5) — rather than treating "the Cold War transformed government" as a single uniform process.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which the Cold War transformed the role of the US government at home and abroad, 1945-1980) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a single unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt, offers a list with no line of reasoning ("the government changed a lot"), or is not historically defensible.',
            modelResponse:
              'The Cold War drove the United States government to take on a far larger, more permanent role both ABROAD — an open-ended global security commitment renewed by successive presidents — and AT HOME, where Cold-War-era federal capacity and legitimacy were increasingly directed toward domestic priorities from court-ordered desegregation to an ambitious social-welfare agenda, even as that expanded reach concerned some of its own architects.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. the breakdown of the wartime US-Soviet alliance after 1945 over the fate of occupied Europe, hardening into ideological rivalry by 1947. No credit (0/1) for a single vague, unsupported phrase ("times were tense") or context copied from a document without independent elaboration.',
            modelResponse:
              'The wartime alliance between the United States and the Soviet Union broke down soon after their joint defeat of Germany, as the two powers disagreed sharply over the fate of occupied Europe and the Soviet Union installed friendly Communist governments in Eastern Europe rather than allowing the free elections promised at the 1945 Yalta Conference, hardening by 1947 into the ideological standoff these documents respond to.',
          },
          {
            criterionId: 'C-doc-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST FOUR of the five documents, grouped to support the essay\'s line of reasoning (not summarized one at a time in isolation). 1/2: accurately describes the content of at least three documents, whether or not they clearly support an argument. 0/2: fewer than three documents used, or documents are misdescribed.',
            modelResponse:
              'Truman\'s open-ended commitment to "support free peoples who are resisting attempted subjugation by armed minorities or by outside pressures" (Doc 1) and Kennedy\'s inaugural pledge that the country would "pay any price, bear any burden... to assure the survival and the success of liberty" (Doc 3) show the government renewing an expansive global commitment across successive administrations. Eisenhower\'s warning that the "conjunction of an immense military establishment and a large arms industry" now reaches "every city, every State house, every office of the Federal government" through the "military-industrial complex" (Doc 2) shows that same Cold War commitment transforming government AT HOME. Johnson\'s vision that "the Great Society... demands an end to poverty and racial injustice" and is "a challenge constantly renewed" (Doc 4), alongside the Supreme Court\'s holding that segregated schools are "inherently unequal" under "the equal protection of the laws guaranteed by the Fourteenth Amendment" (Doc 5), together show the expanding domestic role reaching into civil rights enforcement and social welfare as well as defense.',
          },
          {
            criterionId: 'D-outside-evidence',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the five documents, relevant to the argument, and EXPLAINS its relevance (not just names it). No credit (0/1) for a vague reference with no specific evidence, or evidence that is simply named with no explanation of how it supports the thesis.',
            modelResponse:
              'NSC-68 (1950), a classified policy paper recommending a dramatic, sustained expansion of US military spending to contain Communism globally, is what actually funded the open-ended commitment Truman announced in Doc 1 — and it is exactly the resulting defense establishment that Eisenhower warns has grown large enough, by 1961, to reach "every city, every State house, every office of the Federal government" in Doc 2.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date without explaining relevance to the argument.',
            modelResponse:
              'Eisenhower\'s farewell address (Doc 2) was delivered by an outgoing, two-term president with no further election to win, addressed directly to "the American people" as a candid warning rather than a policy proposal, which explains why he could caution against a military establishment his own administration had helped build. Truman\'s address (Doc 1) was delivered to a joint session of Congress specifically to secure an unprecedented peacetime foreign-aid commitment, which explains why he frames the request in sweeping, universal terms about "alternative ways of life" rather than as a one-time appropriation. Johnson\'s remarks (Doc 4) were a university commencement address delivered months before the actual Great Society legislation reached Congress, which explains its expansive, aspirational framing rather than a specific legislative pitch.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. explicitly weighing continuity against change, corroborating multiple document types against each other, or explaining more than one variable (here, contrasting the government\'s abroad and at-home transformations) — not from a single isolated clever sentence. No credit (0/1) if the essay treats "the Cold War transformed government" as a single flat verdict with no qualification or comparison.',
            modelResponse:
              'What complicates a simple "the Cold War made government bigger" narrative is that the abroad and at-home transformations proceeded on different timelines and through different mechanisms: the abroad commitment was renewed directly by successive presidents through speeches and policy (Docs 1 and 3), while the at-home transformation ran along two separate tracks — a defense-spending track Eisenhower himself questioned (Doc 2), and a distinct judicial and legislative track of civil-rights enforcement and social welfare (Docs 4 and 5) — revealing that "the Cold War transformed government" describes several related but distinct processes, not one uniform expansion.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3 in order.',
        'For sourcing, ask: why did THIS author write THIS document for THIS audience, and how does that explain what it argues?',
        'Your outside-evidence fact should come from your own knowledge of the period, not be paraphrased from one of the five documents.',
        'A strong complexity move is separating the government\'s ABROAD transformation from its AT-HOME transformation — they didn\'t happen the same way or on the same timeline.',
      ],
      estimatedMinutes: 48,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The DBQ asks you to build YOUR OWN argument and use the documents (plus outside knowledge) as evidence — never summarize each document in its own paragraph.',
        'The 7-point rubric: Thesis (1); Context (1); Evidence from the Documents (2, requires 4+ of 5 documents for full credit); Outside Evidence (1, one explained outside fact); Sourcing (1, HIPP explained for 3+ documents); Complexity (1, earned holistically).',
        'Sourcing means explaining WHY a document\'s author/purpose/audience/situation matters to your argument — not just naming the author or date.',
        'A strong complexity move for this packet: the Cold War transformed government\'s role ABROAD (a renewed global commitment) and AT HOME (defense spending, civil rights enforcement, social welfare) through different mechanisms and timelines, not one uniform process.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '8',
    cedTopic: '8-DBQ',
    cedTitle: 'Period 8 DBQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Context 1 / Evidence-Documents 2 / Outside-Evidence 1 / Sourcing 1 / Complexity 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-truman-doctrine.v1',
        chapter: '1947',
        note: 'Truman Doctrine address — Document 1 of the five-document Period-8 packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-eisenhower-farewell.v1',
        chapter: '1961',
        note: 'Eisenhower Farewell Address ("military-industrial complex") — Document 2 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-jfk-inaugural.v1',
        chapter: '1961',
        note: 'JFK Inaugural Address — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-lbj-great-society.v1',
        chapter: '1964',
        note: 'LBJ "Great Society" remarks at the University of Michigan — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apgov-brown-opinion.v1',
        chapter: '1954',
        note: 'Brown v. Board of Education opinion (REUSED from AP Gov Unit 3) — Document 5 of the packet, read here as the federal courts acting as a Cold-War-era domestic actor.',
      },
    ],
  },
};
