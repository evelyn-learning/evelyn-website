/**
 * AP US History — Period 9 DBQ Practice: the full Document-Based Question
 * essay (AP APUSH Free-Response Question 1).
 *
 * This is the essay-practice plan that closes out the Period-9 content arc
 * (the conservative resurgence and end of the Cold War 9.2-9.3,
 * globalization/technology/immigration 9.4-9.5, America since 2001 9.6):
 * students write ONE complete DBQ essay under real AP exam conditions,
 * using a genuine 5-document packet, and are scored against the authentic
 * AP APUSH 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..5 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. Ronald Reagan, First Inaugural Address (January 20, 1981) —
 *      evelyn.passage.apush-reagan-inaugural.v1
 *   2. Ronald Reagan, Remarks on East-West Relations at the Brandenburg
 *      Gate (June 12, 1987) — evelyn.passage.apush-reagan-brandenburg.v1
 *   3. George W. Bush, Address Before a Joint Session of Congress
 *      (September 20, 2001) — evelyn.passage.apush-bush-sept-2001.v1
 *   4. Barack Obama, First Inaugural Address (January 20, 2009) —
 *      evelyn.passage.apush-obama-inaugural.v1
 *   5. Data table, legal immigration by region of origin, 1960s vs. 2000s
 *      (DHS/OHSS Yearbook of Immigration Statistics) —
 *      evelyn.passage.apush-immigration-origins-table.v1
 *
 * DOCUMENT FIDELITY: every modelResponse below attributes to each document
 * ONLY what its seeded excerpt actually contains. Doc 3 (Bush) is THREE
 * non-adjacent segments of the delivered address, joined by two elisions
 * in the seed passage itself — these are never treated as continuous,
 * unbroken prose, and are never quoted across the elision as if adjacent.
 * Doc 4 (Obama) is two non-adjacent paragraphs joined by one elision — also
 * never treated as continuous. Doc 5's figures are shares of LAWFUL
 * PERMANENT RESIDENT admissions specifically, not immigration as a whole.
 * Famous lines NOT present in the seeded excerpts (e.g. Reagan's "evil
 * empire," Bush's "axis of evil") are never attributed to a document; where
 * used at all they would only ever appear as the student's own OUTSIDE
 * evidence, clearly separated from document description — this plan's
 * outside-evidence row instead uses NAFTA (1994), which is not named in any
 * of the five documents.
 *
 * NON-PARTISAN FRAMING: the prompt asks about the changing US role in the
 * WORLD, not a domestic policy verdict — but the rubric is written so that
 * both "large extent of change" and "limited extent of change / continuity
 * in self-conception" are fully defensible, evidence-supported positions.
 *
 * The teaching point is the DBQ TASK itself — thesis, contextualization,
 * document evidence, outside evidence, sourcing (HIPP), and complexity —
 * not new historical content; all quotes are the short, already-seeded
 * excerpts used elsewhere in the Period-9 catalog.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U9_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u9-dbq-practice.v1',
  title: 'Period 9 DBQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u9-dbq-practice',
      description:
        'Write a complete AP APUSH Document-Based Question essay from a five-document Period-9 packet — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP APUSH 7-point DBQ rubric.',
      standard: 'AP-APUSH-9-DBQ',
    },
  ],
  prerequisites: [
    'apush.conservative-resurgence',
    'apush.globalization-tech',
    'apush.america-since-2001',
  ],
  followUps: [],
  estimatedMinutes: 58,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "Everything you've learned about Period 9 — the conservative resurgence and the end of the Cold War, globalization and technology reshaping the economy and immigration, and the crises of the post-2001 world — exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP US History exam, scored on the authentic 7-point rubric: Thesis (1), Context (1), Evidence from the Documents (2), Outside Evidence (1), Sourcing (1), and Complexity (1). You'll get five documents spanning 1981 to 2009 — two presidential speeches from Reagan, an address from Bush after September 11, an inaugural from Obama, and a data table on immigration. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument about how the United States' role in the world changed between 1980 and 2008, and use the documents, plus what you already know, as evidence for it. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the five-document Period-9 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get five documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph ("Document 1 says X. Document 2 says Y.") instead of grouping documents around a claim.',
        'ROW A — THESIS (0-1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not a simple list. A strong thesis for this packet might argue the United States\' role in the world changed substantially between 1980 and 2008 — from a superpower locked in ideological rivalry with a single rival toward a more assertive sole power confronting a diffuse new set of security threats and increasingly bound to the rest of the world through trade and migration — even as American leaders across that shift kept framing the nation\'s purpose in strikingly similar terms.',
        'ROW B — CONTEXT (0-1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing that before 1980, US Cold War strategy had, by the 1970s, settled into détente (negotiated coexistence and arms control with the Soviet Union rather than direct confrontation), a posture that critics going into the 1980 election argued had grown too accommodating — in AT LEAST a full sentence of specific description, not a single vague phrase like "the world was different before."',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0-2 points): 1 point for accurately describing the content of at least three documents; the full 2 points require using the content of at least four of the five documents to SUPPORT the thesis\'s argument — e.g. grouping Reagan\'s small-government inaugural diagnosis (Doc 1) with his direct Berlin Wall challenge to Gorbachev (Doc 2) as evidence of a more assertive, change-seeking Cold War posture; Bush\'s post-9/11 address (Doc 3) as evidence the chief external threat shifted from a rival superpower to a diffuse terrorist network; Obama\'s 2009 inaugural (Doc 4) as evidence of the position the US occupied at the period\'s close, squaring continued global leadership with real economic and military strain; and the immigration table (Doc 5) as evidence the US\'s changing global role extended to demographic and economic ties, not only diplomacy and war.',
        'ROW D — OUTSIDE EVIDENCE (0-1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the five documents, relevant to the argument and explained (not just named) — e.g. the North American Free Trade Agreement (1994), which eliminated most tariffs among the US, Canada, and Mexico and is not named in any of the five documents, yet is exactly the kind of deliberate economic-integration choice that the demographic shift in Doc 5 reflects from a different angle.',
        'ROW E — SOURCING (0-1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. Reagan\'s Brandenburg Gate remarks (Doc 2) were delivered standing at the Berlin Wall itself in front of a global audience, which explains the direct-address, challenge format ("Mr. Gorbachev, tear down this wall!") rather than a diplomatic communique; Bush\'s address (Doc 3) was delivered nine days after the attacks to a joint session of Congress and a global broadcast audience, at a moment the administration needed both domestic resolve and a broad international coalition, which explains why the same address escalates the war framing AND addresses Muslims worldwide directly; Obama\'s inaugural (Doc 4) was delivered in the genre built to pair honesty about circumstances with declared confidence, at the exact moment the financial crisis and two ongoing wars were most acute, which explains its blunt acknowledgment of crisis paired with resolve.',
        'ROW F — COMPLEXITY (0-1 point): earned holistically for a nuanced argument that does things like separate several DIFFERENT axes of change proceeding on different timelines (military/diplomatic posture, economic and demographic integration) while also noting a genuine CONTINUITY — the rhetorical self-conception of the US as defender of "freedom" against whichever adversary currently threatened it, present in Reagan (Docs 1-2), Bush (Doc 3), and Obama (Doc 4) alike — earned through the essay\'s overall argument, not from one clever sentence in isolation.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP APUSH DBQ scale, distinct from the AP Lang 6-point rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the five documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which the United States\' role in the world changed in the period 1980–2008." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least four of the five documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apush-reagan-inaugural.v1',
        'evelyn.passage.apush-reagan-brandenburg.v1',
        'evelyn.passage.apush-bush-sept-2001.v1',
        'evelyn.passage.apush-obama-inaugural.v1',
        'evelyn.passage.apush-immigration-origins-table.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that the United States\' role in the world changed substantially between 1980 and 2008 — from a superpower locked in ideological rivalry with a single rival, the Soviet Union, toward a more assertive sole power confronting a diffuse new set of security threats, and increasingly bound to the rest of the world through trade and migration — even though American leaders across that shift kept framing the nation\'s purpose in strikingly similar terms, as the world\'s leading defender of freedom against whatever adversary currently threatened it. Contextualization situates the packet in the pre-1980 baseline: by the 1970s, US Cold War strategy had settled into détente, a policy of negotiated coexistence and arms control with the Soviet Union rather than direct confrontation, a posture that critics going into the 1980 election argued had grown too accommodating. The body groups at least four documents around the thesis rather than summarizing them in order: Reagan\'s inaugural diagnosis that "government is not the solution to our problem; government is the problem" (Doc 1), paired with his direct challenge at the Berlin Wall seven years later — "Mr. Gorbachev, tear down this wall!" (Doc 2) — shows a more assertive, change-seeking posture toward the Cold War rival rather than a posture of simply managing the rivalry, helping bring the Cold War to its end within the period; Bush\'s address nine days after September 11, framing the attacks as "an act of war" in a "world where freedom itself is under attack" (Doc 3), shows that once the Cold War ended, the chief external threat shifted from a rival superpower to a diffuse, stateless terrorist network, even as the same "freedom" language carried over from the earlier confrontation; Obama\'s 2009 inaugural, acknowledging the nation was "at war against a far-reaching network of violence and hatred" while "our economy is badly weakened" (Doc 4), shows the position the US occupied at the end of the period, still claiming global leadership while confronting real material strain; and the immigration table (Doc 5), showing legal permanent immigration from Latin America and Asia together rising from about half of admissions in the 1960s to roughly three-quarters by the 2000s, shows the US\'s changing global role extended to demographic and economic ties, not only diplomacy and war. Outside evidence brings in the North American Free Trade Agreement (1994), which eliminated most tariffs among the US, Canada, and Mexico — evidence beyond the packet showing that the US\'s changing global position also reflected deliberate trade-policy choices, the same kind of economic integration Document 5\'s demographic data reflects from a different angle. Sourcing explains that Reagan\'s Brandenburg Gate remarks (Doc 2) were delivered standing at the Berlin Wall itself before a global audience, which explains the direct-address, challenge format rather than a diplomatic communique; that Bush\'s address (Doc 3) was delivered to a joint session of Congress and a global broadcast audience at a moment the administration needed both domestic resolve and a broad international coalition, which explains why the same speech escalates the war framing and directly addresses Muslims worldwide; and that Obama\'s inaugural (Doc 4) was delivered in the genre built to pair honesty about circumstances with declared confidence, at the exact moment the financial crisis and two wars were most acute, which explains its blunt acknowledgment of crisis paired with resolve. Complexity is shown by separating several distinct axes of change proceeding on different timelines — the military/diplomatic posture shifting from confronting one superpower rival to confronting a diffuse non-state network, and the economic/demographic position shifting through deliberate trade policy and a legal immigration system reoriented since 1965 — while also noting a genuine continuity: the rhetorical self-conception of the US as defender of "freedom" against whichever adversary currently threatened it, present across Reagan, Bush, and Obama alike, showing that "the US\'s role changed" describes real change in target, tools, and constraints alongside real continuity in self-narrative, not one uniform verdict.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which the United States\' role in the world changed, 1980-2008) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a single unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt, offers a list with no line of reasoning ("America changed a lot"), or is not historically defensible.',
            modelResponse:
              'The United States\' role in the world changed substantially between 1980 and 2008 — from a superpower locked in ideological rivalry with a single rival toward a more assertive sole power confronting a diffuse new set of security threats, and increasingly bound to the rest of the world through trade and migration — even as American leaders across that shift kept framing the nation\'s purpose in strikingly similar terms.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. the pre-1980 détente-era Cold War posture and the critique that it had grown too accommodating. No credit (0/1) for a single vague, unsupported phrase ("things were different before") or context copied from a document without independent elaboration.',
            modelResponse:
              'By the 1970s, US Cold War strategy had settled into détente — a policy of negotiated coexistence and arms control with the Soviet Union rather than direct confrontation — a posture that critics going into the 1980 election argued had grown too accommodating of Soviet expansion and left the US strategically behind.',
          },
          {
            criterionId: 'C-doc-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST FOUR of the five documents, grouped to support the essay\'s line of reasoning (not summarized one at a time in isolation). 1/2: accurately describes the content of at least three documents, whether or not they clearly support an argument. 0/2: fewer than three documents used, or documents are misdescribed.',
            modelResponse:
              'Reagan\'s inaugural diagnosis that "government is not the solution to our problem; government is the problem" (Doc 1), paired with his direct Berlin Wall challenge "Mr. Gorbachev, tear down this wall!" (Doc 2), shows a more assertive, change-seeking posture toward the Cold War rival. Bush\'s address framing September 11 as "an act of war" in a "world where freedom itself is under attack" (Doc 3) shows the chief external threat shifting, after the Cold War, from a rival superpower to a diffuse terrorist network. Obama\'s 2009 inaugural, acknowledging the nation was "at war against a far-reaching network of violence and hatred" while "our economy is badly weakened" (Doc 4), shows the strained position the US occupied at the period\'s end. The immigration table (Doc 5), showing Latin America and Asia together rising from roughly half to three-quarters of legal permanent immigration between the 1960s and 2000s, shows the US\'s changing role extended to demographic and economic ties as well.',
          },
          {
            criterionId: 'D-outside-evidence',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the five documents, relevant to the argument, and EXPLAINS its relevance (not just names it). No credit (0/1) for a vague reference with no specific evidence, or evidence that is simply named with no explanation of how it supports the thesis.',
            modelResponse:
              'The North American Free Trade Agreement (1994), which eliminated most tariffs on trade among the US, Canada, and Mexico, is not named in any of the five documents, yet is exactly the kind of deliberate economic-integration choice that Document 5\'s demographic shift reflects from a different angle — showing the US\'s changing global position extended to trade policy, not only rhetoric and war.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date without explaining relevance to the argument.',
            modelResponse:
              'Reagan\'s Brandenburg Gate remarks (Doc 2) were delivered standing at the Berlin Wall itself before a global audience, which explains the direct-address, challenge format rather than a diplomatic communique. Bush\'s address (Doc 3) was delivered nine days after the attacks to a joint session of Congress and a global broadcast audience, at a moment the administration needed both domestic resolve and a broad international coalition, which explains why the same speech escalates the war framing and directly addresses Muslims worldwide. Obama\'s inaugural (Doc 4) was delivered in a genre built to pair honesty about circumstances with declared confidence, at the exact moment the financial crisis and two wars were most acute, which explains its blunt acknowledgment of crisis paired with resolve.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. separating multiple distinct axes of change (here, military/diplomatic posture versus economic/demographic integration) while also identifying a genuine continuity — not from a single isolated clever sentence. No credit (0/1) if the essay treats "the US\'s role changed" as a single flat verdict with no qualification or comparison.',
            modelResponse:
              'What complicates a simple "America\'s role changed completely" narrative is that the military/diplomatic axis (from confronting one superpower rival to confronting a diffuse non-state network) and the economic/demographic axis (trade policy, a reoriented immigration system) shifted through different mechanisms and timelines, while the rhetorical self-conception of the US as defender of "freedom" against whichever adversary currently threatened it — present in Reagan, Bush, and Obama alike — remained strikingly continuous, revealing that "the US\'s role in the world changed" describes real change in target, tools, and constraints alongside real continuity in self-narrative, not one uniform process.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3 in order.',
        'For sourcing, ask: why did THIS author write THIS document for THIS audience, and how does that explain what it argues?',
        'Your outside-evidence fact should come from your own knowledge of the period, not be paraphrased from one of the five documents.',
        'A strong complexity move is separating the military/diplomatic change from the economic/demographic change, while also naming what stayed continuous (the "freedom" framing) across all three presidents.',
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
        'A strong complexity move for this packet: the US\'s role changed on the military/diplomatic axis AND the economic/demographic axis through different mechanisms, while its "freedom" self-conception stayed continuous across Reagan, Bush, and Obama.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '9',
    cedTopic: '9-DBQ',
    cedTitle: 'Period 9 DBQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Context 1 / Evidence-Documents 2 / Outside-Evidence 1 / Sourcing 1 / Complexity 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-reagan-inaugural.v1',
        chapter: '1981',
        note: 'Reagan First Inaugural Address — Document 1 of the five-document Period-9 packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-reagan-brandenburg.v1',
        chapter: '1987',
        note: 'Reagan Brandenburg Gate remarks ("tear down this wall") — Document 2 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-bush-sept-2001.v1',
        chapter: '2001',
        note: 'Bush address to Congress after September 11 — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-obama-inaugural.v1',
        chapter: '2009',
        note: 'Obama First Inaugural Address — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-immigration-origins-table.v1',
        chapter: '1960s-2000s',
        note: 'Legal immigration by region of origin data table — Document 5 of the packet.',
      },
    ],
  },
};
