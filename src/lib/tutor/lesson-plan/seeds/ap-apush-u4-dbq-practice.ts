/**
 * AP US History — Period 4 DBQ Practice: the full Document-Based Question
 * essay (AP APUSH Free-Response Question 1).
 *
 * This is the essay-practice plan that closes out the Period-4 content arc
 * (the Jefferson era 4.2, the Market Revolution 4.5, Jacksonian democracy
 * 4.8, religion and reform 4.10, slavery in the South 4.12): students now
 * write ONE complete DBQ essay under real AP exam conditions, using a
 * genuine 5-document packet, and are scored against the authentic AP APUSH
 * 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..5 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. Thomas Jefferson, First Inaugural Address (1801) —
 *      evelyn.passage.apush-jefferson-inaugural.v1
 *   2. James Monroe, Seventh Annual Message to Congress / the Monroe
 *      Doctrine (1823) — evelyn.passage.apush-monroe-doctrine.v1
 *   3. Andrew Jackson, Bank Veto Message (1832) —
 *      evelyn.passage.apush-jackson-bank-veto.v1
 *   4. Declaration of Sentiments, Seneca Falls Convention (1848) —
 *      evelyn.passage.apush-seneca-falls.v1
 *   5. William Lloyd Garrison, The Liberator No. 1 (1831) —
 *      evelyn.passage.apush-garrison-liberator.v1
 *
 * Document fidelity: every modelResponse below attributes to a document only
 * what its seeded excerpt actually contains. The Jackson excerpt's bare
 * hyphens ("society-the farmers", "laborers-who") are reproduced exactly as
 * seeded, not corrected to em dashes. Broader facts not in the excerpts
 * (Indian Removal, the expansion of white male suffrage generally, the
 * Nullification Crisis) are used only as outside evidence, clearly marked as
 * such and never attributed to a document's own content.
 *
 * The teaching point is the DBQ TASK itself — thesis, contextualization,
 * document evidence, outside evidence, sourcing (HIPP), and complexity —
 * not new historical content; all quotes are the short, already-seeded
 * excerpts used elsewhere in the Period-4 catalog.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U4_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u4-dbq-practice.v1',
  title: 'Period 4 DBQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u4-dbq-practice',
      description:
        'Write a complete AP APUSH Document-Based Question essay from a five-document Period-4 packet on the extent to which democratic ideals expanded in American society, 1800-1848 — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP APUSH 7-point DBQ rubric.',
      standard: 'AP-APUSH-4-DBQ',
    },
  ],
  prerequisites: [
    'apush.jefferson-era',
    'apush.market-revolution',
    'apush.jacksonian-democracy',
    'apush.reform-awakening',
    'apush.slavery-south',
  ],
  followUps: [],
  estimatedMinutes: 58,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "Everything you've learned about Period 4 — Jefferson's Revolution of 1800 and the Monroe Doctrine, the Market Revolution, Jacksonian democracy and the Bank War, the reform movements the Second Great Awakening inspired, and the hardening slave system in the South — exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP US History exam, scored on the authentic 7-point rubric: Thesis (1), Contextualization (1), Evidence from the Documents (2), Evidence Beyond the Documents (1), Sourcing (1), and Complexity (1). You'll get five documents spanning 1801 to 1848. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument about how far democratic ideals actually expanded, and use the documents, plus what you already know, as evidence for it. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the five-document Period-4 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get five documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph ("Document 1 says X. Document 2 says Y.") instead of grouping documents around a claim.',
        'ROW A — THESIS/CLAIM (0-1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not a simple list of "some things expanded and some didn\'t." A strong thesis for this packet might argue that democratic ideals expanded substantially within FORMAL WHITE MALE POLITICS — a more tolerant, anti-elite politics of "the common man" — while efforts to extend the same natural-rights logic to women and enslaved African Americans remained vocal but largely blocked.',
        'ROW B — CONTEXTUALIZATION (0-1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing how, after the bitterly contested election of 1800 and the Federalist Party\'s collapse, most states removed property qualifications for white male voting by the 1820s-30s, creating a genuinely mass democratic politics that this packet\'s documents both reflect and contest — in AT LEAST a full sentence of specific description, not a single vague phrase like "democracy was growing."',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0-2 points): 1 point for accurately describing the content of at least three documents; the full 2 points require using the content of at least four of the five documents to SUPPORT the thesis\'s argument — e.g. grouping Jefferson\'s inaugural (Doc 1) and Jackson\'s bank veto (Doc 3) as evidence that formal politics grew more tolerant of dissent and more openly anti-elite; Monroe\'s message (Doc 2) as evidence the nation projected republican self-government as a hemispheric ideal worth defending; and the Seneca Falls Declaration (Doc 4) and Garrison\'s Liberator (Doc 5) as evidence that reformers pushed the same natural-rights logic toward groups the political system of Docs 1 and 3 still excluded.',
        'ROW D — EVIDENCE BEYOND THE DOCUMENTS (0-1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the five documents, relevant to the argument and explained (not just named) — e.g. the Indian Removal Act (1830) and the Trail of Tears, which show that even as Jackson\'s rhetoric championed "the humble members of society," his administration forcibly removed Native nations from their homelands, a group the "expansion" this packet documents did not reach at all.',
        'ROW E — SOURCING (0-1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. Jefferson\'s inaugural (Doc 1) was delivered just after the bitterly partisan election of 1800 specifically to reassure defeated Federalists a peaceful transfer of power between rival parties was possible, which explains its conciliatory "we are all republicans, we are all federalists" framing; Jackson\'s veto message (Doc 3) was published for the public in the middle of his 1832 reelection campaign against Bank supporter Henry Clay, which explains why it casts a technical banking dispute as ordinary farmers and laborers versus "the rich and powerful"; and the Declaration of Sentiments (Doc 4) was drafted by delegates at a convention convened specifically to launch a women\'s rights movement, which explains why it deliberately mirrors the Declaration of Independence\'s language to expose a contradiction in the nation\'s founding claims.',
        'ROW F — COMPLEXITY (0-1 point): earned holistically for a nuanced argument that does things like explain both continuity AND change, corroborate multiple document types (two presidential addresses, an executive veto message, a convention declaration, a newspaper editorial) against each other, or explain multiple variables (e.g. that political-ideal expansion for white men moved much further and faster than social-ideal expansion for women and enslaved Americans) — earned through the essay\'s overall argument, not from one clever sentence in isolation.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP APUSH DBQ scale, distinct from the AP Lang 6-point rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the five documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which democratic ideals expanded in American society in the period 1800-1848." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least four of the five documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apush-jefferson-inaugural.v1',
        'evelyn.passage.apush-monroe-doctrine.v1',
        'evelyn.passage.apush-jackson-bank-veto.v1',
        'evelyn.passage.apush-seneca-falls.v1',
        'evelyn.passage.apush-garrison-liberator.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that between 1800 and 1848, democratic ideals expanded substantially within FORMAL POLITICS for white men — a more tolerant, openly anti-elite "politics of the common man" — while efforts to extend that same logic of natural rights and government by consent to women and enslaved African Americans, though vocal and growing, remained largely blocked, making the era\'s democratic expansion real but uneven, or a comparably defensible complex claim with a clear line of reasoning. Contextualization situates the packet in the collapse of the Federalist Party after the contested election of 1800 and the subsequent removal, by most states through the 1820s-30s, of property qualifications for white male voting — creating a genuinely mass democratic politics that this packet\'s documents both reflect and contest. The body groups at least four of the five documents around the thesis rather than summarizing them in order: Jefferson\'s promise that "we are all Republicans, we are all Federalists" (Doc 1) and his pledge to a government that will not "take from the mouth of labor the bread it has earned" show a president reframing a bitter partisan victory as tolerance for opposition and a defense of ordinary labor; Jackson\'s veto message, warning that "the rich and powerful too often bend the acts of government to their selfish purposes" and championing "the humble members of society-the farmers, mechanics, and laborers-who have neither the time nor the means of securing like favors to themselves" (Doc 3), shows this anti-elite, pro-common-man politics hardening into an explicit governing philosophy three decades later; Monroe\'s declaration that the American continents are "henceforth not to be considered as subjects for future colonization by any European powers" (Doc 2) shows the nation projecting its self-government as a hemispheric ideal worth actively defending; and the Declaration of Sentiments\' claim that "all men and women are created equal" with government "deriving their just powers from the consent of the governed" (Doc 4), alongside Garrison\'s vow that "I will not retreat a single inch -- AND I WILL BE HEARD" (Doc 5), show reformers pushing that same founding-era logic toward groups the political system of Docs 1 and 3 still excluded. Outside evidence brings in the Indian Removal Act (1830) and the Trail of Tears, which show that even as Jackson\'s own rhetoric championed "the humble members of society," his administration forcibly removed the Cherokee and other Southeastern nations from their homelands, defying a favorable Supreme Court ruling in the process — a group this era\'s "democratic expansion" did not reach at all, and a fact beyond anything the bank-veto excerpt itself describes. Sourcing explains that Jefferson\'s inaugural (Doc 1) was delivered just after the bitterly partisan election of 1800, aimed at reassuring defeated Federalists that a peaceful transfer of power between rival parties was possible, which explains its conciliatory framing; that Jackson\'s veto message (Doc 3) was issued for public consumption in the middle of his 1832 reelection campaign against Bank supporter Henry Clay, which explains why it casts a technical banking dispute as ordinary farmers and laborers versus "the rich and powerful"; and that the Declaration of Sentiments (Doc 4) was drafted by delegates, principally Elizabeth Cady Stanton, at a convention convened specifically to launch a women\'s rights movement, which explains why it deliberately mirrors the Declaration of Independence\'s language and structure to expose a contradiction in the nation\'s own founding claims. Complexity is shown by weighing how unevenly this expansion landed: political ideals for white men were genuinely reinvented into an anti-elite, tolerant mass politics (Docs 1 and 3), and the nation extended a version of that self-government ideal outward as foreign policy (Doc 2), while social ideals about who counted as an equal citizen barely moved for women and enslaved Americans in the same period, since Docs 4 and 5 show reformers still having to DEMAND, rather than already possess, the rights Docs 1-3 already took for granted among white men.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which democratic ideals expanded in American society, 1800-1848) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a list with no line of reasoning ("some things expanded and some didn\'t"). No credit (0/1) for a thesis that only restates the prompt, offers an unsupported list, or is not historically defensible.',
            modelResponse:
              'Between 1800 and 1848, democratic ideals expanded substantially within formal politics for white men — a more tolerant, openly anti-elite "politics of the common man" — while efforts to extend that same logic of natural rights and consent to women and enslaved African Americans, though vocal and growing, remained largely blocked.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. the Federalist Party\'s collapse after the contested election of 1800 and the removal of property qualifications for white male voting across most states by the 1820s-30s. No credit (0/1) for a single vague, unsupported phrase ("democracy was growing") or context copied from a document without independent elaboration.',
            modelResponse:
              'After the bitterly contested election of 1800 hastened the Federalist Party\'s collapse, most states spent the following three decades eliminating property-ownership requirements for voting, creating a genuinely mass democratic politics for white men that the documents in this packet both reflect and, in the case of women and enslaved Americans, directly contest.',
          },
          {
            criterionId: 'C-doc-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST FOUR of the five documents, grouped to support the essay\'s line of reasoning (not summarized one at a time in isolation). 1/2: accurately describes the content of at least three documents, whether or not they clearly support an argument. 0/2: fewer than three documents used, or documents are misdescribed.',
            modelResponse:
              'Jefferson\'s pledge that "we are all Republicans, we are all Federalists" and that government should not "take from the mouth of labor the bread it has earned" (Doc 1) frames a bitter partisan victory as tolerance and a defense of ordinary labor. Jackson\'s veto message, attacking government privilege for "the rich and powerful" and defending "the humble members of society-the farmers, mechanics, and laborers" (Doc 3), shows that same anti-elite politics hardening into governing philosophy three decades later. Monroe\'s declaration that the hemisphere is "not to be considered as subjects for future colonization by any European powers" (Doc 2) projects the nation\'s self-government as a hemispheric ideal. The Declaration of Sentiments\' claim that "all men and women are created equal" with government "deriving their just powers from the consent of the governed" (Doc 4) and Garrison\'s vow that he "will not retreat a single inch" (Doc 5) show reformers pushing that same logic toward groups the political system of Docs 1 and 3 still excluded.',
          },
          {
            criterionId: 'D-outside-evidence',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the five documents, relevant to the argument, and EXPLAINS its relevance (not just names it). No credit (0/1) for a vague reference with no specific evidence, or evidence that is simply named with no explanation of how it supports the thesis.',
            modelResponse:
              'The Indian Removal Act (1830) and the resulting Trail of Tears show that even as Jackson\'s own rhetoric championed "the humble members of society," his administration forcibly removed the Cherokee and other Southeastern nations from their homelands — defying a favorable Supreme Court ruling in Worcester v. Georgia in the process — demonstrating that this era\'s democratic expansion excluded Native nations entirely, a fact beyond anything the bank-veto excerpt itself describes.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date without explaining relevance to the argument.',
            modelResponse:
              'Jefferson\'s First Inaugural (Doc 1) was delivered just after the bitterly partisan election of 1800, aimed at reassuring defeated Federalists that a peaceful transfer of power between rival parties was possible, which explains its conciliatory framing. Jackson\'s veto message (Doc 3) was issued for public consumption in the middle of his 1832 reelection campaign against Bank supporter Henry Clay, which explains why it casts a technical banking dispute as ordinary farmers and laborers versus "the rich and powerful." The Declaration of Sentiments (Doc 4) was drafted by delegates, principally Elizabeth Cady Stanton, at a convention convened specifically to launch a women\'s rights movement, which explains why it deliberately mirrors the Declaration of Independence\'s language to expose a contradiction in the nation\'s own founding claims.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. explicitly weighing continuity against change, corroborating multiple document types against each other, or explaining more than one variable (here, contrasting political expansion for white men with stalled social expansion for women and enslaved Americans) — not from a single isolated clever sentence. No credit (0/1) if the essay treats "expansion" as a single flat verdict with no qualification or comparison.',
            modelResponse:
              'What complicates a simple "democracy expanded" narrative is how unevenly that expansion landed: political ideals for white men were genuinely reinvented into a tolerant, anti-elite mass politics (Docs 1 and 3), and the nation even extended a version of that self-government ideal outward as foreign policy (Doc 2), while social ideals about who counted as an equal citizen barely moved for women and enslaved Americans across the same near-half-century, since Docs 4 and 5 show reformers still having to DEMAND rights that white men in Docs 1 and 3 already exercised.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3, then 4, then 5 in order.',
        'For sourcing, ask: why did THIS author write THIS document for THIS audience, and how does that explain what it argues?',
        'Your outside-evidence fact should come from your own knowledge of the period, not be paraphrased from one of the five documents.',
        'A strong complexity move is contrasting what expanded quickly (formal politics for white men) with what stayed largely blocked (rights for women and enslaved Americans).',
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
        'A strong complexity move for this packet: democratic ideals expanded fast within formal white-male politics, but stayed largely blocked for women and enslaved Americans over the same period.',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4-DBQ',
    cedTitle: 'Period 4 DBQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Contextualization 1 / Evidence-Documents 2 / Evidence-Beyond 1 / Sourcing 1 / Complexity 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-jefferson-inaugural.v1',
        chapter: '1801',
        note: 'Thomas Jefferson, First Inaugural Address — Document 1 of the five-document Period-4 packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-monroe-doctrine.v1',
        chapter: '1823',
        note: 'James Monroe, Seventh Annual Message to Congress (the Monroe Doctrine) — Document 2 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-jackson-bank-veto.v1',
        chapter: '1832',
        note: 'Andrew Jackson, Bank Veto Message — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-seneca-falls.v1',
        chapter: '1848',
        note: 'Declaration of Sentiments, Seneca Falls Convention — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-garrison-liberator.v1',
        chapter: '1831',
        note: 'William Lloyd Garrison, The Liberator No. 1 — Document 5 of the packet.',
      },
    ],
  },
};
