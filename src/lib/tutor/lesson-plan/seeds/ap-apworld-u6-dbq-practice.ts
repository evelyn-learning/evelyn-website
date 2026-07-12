/**
 * AP World History: Modern — Unit 6 DBQ Practice: the full Document-Based
 * Question essay (AP World FRQ 1), closing out the Unit-6 content arc
 * (ideologies/tools of imperial expansion 6.1, resistance and accommodation
 * 6.3, economic imperialism 6.4-6.6, global migration 6.7, and reform
 * responses 6.2/6.4).
 *
 * Students write ONE complete DBQ essay under real AP exam conditions, using
 * a genuine five-document Unit-6 packet, and are scored against the
 * authentic AP World 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..5 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. Rudyard Kipling, "The White Man's Burden" (1899) —
 *      evelyn.passage.apworld-white-mans-burden.v1
 *   2. Lin Zexu, letter to Queen Victoria (1839) —
 *      evelyn.passage.apworld-lin-zexu.v1
 *   3. General Act of the Berlin Conference (1885) —
 *      evelyn.passage.apworld-berlin-act.v1
 *   4. Indian Indentured Emigration by Destination (data table, 1834-1917) —
 *      evelyn.passage.apworld-indenture-table.v1
 *   5. The Charter Oath (1868) —
 *      evelyn.passage.apworld-meiji-charter-oath.v1
 *
 * GOTCHA GUARDED AGAINST (from the U2 DBQ review, and this unit's own
 * fidelity traps): every reference to document content below is checked
 * against each document's ACTUAL seeded fullText.
 *   - Kipling (Doc 1) is treated throughout as a primary source OF imperial
 *     ideology, never as an endorsed description of colonized peoples.
 *   - Lin Zexu (Doc 2) is quoted only for its actual argument (Britain's own
 *     prohibition of opium at home, and Anglo-Chinese trade's mutual
 *     benefit) — never for the Opium War's outcome, which the excerpt does
 *     not narrate.
 *   - Berlin Act (Doc 3) is limited to its seeded clauses: Article 5
 *     (no trade monopoly) and Articles 34-35 (notification and effective
 *     occupation) — never treated as if it authorized conquest or divided
 *     territory outright, which it does not do.
 *   - The indenture table (Doc 4) is scoped to Indian indenture across six
 *     named destinations (Mauritius, British Guiana, Trinidad and Tobago,
 *     Jamaica, Natal, Fiji), total 1,089,129 — never inflated into "the"
 *     grand total of all indentured migration, which the passage itself
 *     disclaims.
 *   - The Charter Oath (Doc 5) is Griffis's "in substance" 1868 rendering:
 *     only Article 1 (a deliberative assembly, public opinion) and Article 5
 *     (seeking wisdom throughout the world) are quoted or attributed as
 *     canonical text; Articles 2-3 are never treated as settled translation.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U6_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apworld.u6-dbq-practice.v1',
  title: 'Unit 6 DBQ Practice — Consequences of Industrialization',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.u6-dbq-practice',
      description:
        'Write a complete AP World History Document-Based Question essay from a five-document Unit-6 packet on the terms of European imperial expansion, 1750-1900 — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP World 7-point DBQ rubric.',
      standard: 'AP-APWORLD-6-DBQ',
    },
  ],
  prerequisites: [
    'apworld.imperial-expansion',
    'apworld.imperial-resistance',
    'apworld.economic-imperialism',
    'apworld.global-migration',
    'apworld.reform-responses',
  ],
  followUps: [],
  estimatedMinutes: 58,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "Everything you've learned about Unit 6 — the ideologies and tools that drove imperial expansion, the resistance movements that met it, the economic structures of informal and formal empire, the migrations it set in motion, and the reform movements that answered it — exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP World History exam, scored on the authentic 7-point rubric: Thesis (1), Contextualization (1), Evidence from the Documents (2), Evidence Beyond the Documents (1), Sourcing (1), and Complexity (1). You'll get five documents — a poem, a diplomatic letter, a treaty, a data table, and a political charter — spanning a century and a half of imperial expansion. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument about how far Asian and African states shaped the terms of that expansion and use the documents, plus what you already know, as evidence for it. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the five-document Unit-6 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get five documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph ("Document 1 says X. Document 2 says Y.") instead of grouping documents around a claim.',
        'ROW A — THESIS/CLAIM (0-1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not a simple list of "Europeans expanded and some places resisted." A strong thesis for this packet might argue that Asian and African states shaped the terms of European expansion substantially — through diplomatic appeals that put moral pressure on imperial powers, through treaty frameworks that regulated (without preventing) the Scramble, and through their own reform programs that determined whether expansion took a formal or informal shape — even though it could not, in most cases, prevent expansion outright.',
        'ROW B — CONTEXTUALIZATION (0-1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing how the Industrial Revolution gave European powers a decisive military and economic edge (steamships, quinine, the Maxim gun) by the 1870s-80s, while the earlier mercantile-era balance of power between European trading companies and strong Asian/African states had persisted for centuries before that — the shared technological and political turning point that made this era of formal territorial conquest possible in the first place — in AT LEAST a full sentence of specific description, not a single vague phrase like "Europe got stronger."',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0-2 points): 1 point for accurately describing the content of at least three documents; the full 2 points require using the content of at least four of the five documents to SUPPORT the thesis\'s argument — e.g. grouping Lin Zexu\'s 1839 appeal to Britain\'s own domestic opium ban (Doc 2) and the Charter Oath\'s promise to seek "wisdom and ability... in all quarters of the world" (Doc 5) as evidence of Asian states asserting moral or diplomatic agency in the terms of contact; the Berlin Act\'s notification and "effective occupation" requirements (Doc 3) as evidence that African territorial claims still had to be formally justified among the powers rather than simply seized; the indenture table\'s 1,089,129 Indian laborers across six colonies (Doc 4) as evidence of the economic labor regime that expansion produced; and Kipling\'s "White Man\'s Burden" (Doc 1) as evidence of the ideological framing used to justify the whole project.',
        'ROW D — EVIDENCE BEYOND THE DOCUMENTS (0-1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the five documents, relevant to the argument and explained (not just named) — e.g. Ethiopia\'s decisive military victory over Italy at the Battle of Adwa in 1896, which forced European recognition of Ethiopian independence and shows African agency shaping the terms of expansion by force rather than diplomacy alone, something none of the five documents themselves describe.',
        'ROW E — SOURCING (0-1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. Lin Zexu (Doc 2) wrote as the Qing imperial commissioner charged with suppressing the opium trade, addressing Queen Victoria directly to appeal to Britain\'s own stated values just before the First Opium War, which explains his focus on moral consistency rather than legal argument; Kipling (Doc 1) wrote in 1899 to urge the United States toward colonial rule in the Philippines, which explains why the poem frames conquest as a costly duty rather than a material gain; the Berlin Act\'s plenipotentiaries (Doc 3) represented fourteen competing powers (the Ottoman Empire among them) negotiating rules to avoid conflict AMONG THEMSELVES, which explains why the Act regulates procedure (notification, effective occupation) rather than the treatment of African peoples.',
        'ROW F — COMPLEXITY (0-1 point): earned holistically for a nuanced argument that does things like explain both the limits AND the reality of Asian/African agency, corroborate multiple document types (poem, diplomatic letter, treaty text, data table, political charter) against each other, or explain multiple variables (e.g. that agency looked different in a Qing diplomatic appeal, a Japanese state-directed reform program, and an African labor migration) — earned through the essay\'s overall argument, not from one clever sentence in isolation.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP World DBQ scale.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the five documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which Asian and African states shaped the terms of European imperial expansion, 1750-1900." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least four of the five documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apworld-white-mans-burden.v1',
        'evelyn.passage.apworld-lin-zexu.v1',
        'evelyn.passage.apworld-berlin-act.v1',
        'evelyn.passage.apworld-indenture-table.v1',
        'evelyn.passage.apworld-meiji-charter-oath.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that Asian and African states shaped the terms of European expansion substantially — through diplomatic appeals that put moral pressure on imperial powers, through treaty frameworks that regulated (without preventing) the Scramble, and through state-directed reform programs that determined whether expansion took a formal or informal shape — even though that shaping could not, in most cases, prevent expansion outright, or a comparably defensible complex claim with a clear line of reasoning. Contextualization explains that the Industrial Revolution gave European powers a decisive military and economic edge by the 1870s-80s — steamships that could travel African rivers, quinine that suppressed malaria\'s toll on European soldiers and administrators, and the Maxim gun\'s firepower advantage — a sharp break from the earlier mercantile-era centuries in which European trading companies had operated on more equal terms with strong Asian and African states. The body groups at least four documents around the thesis rather than summarizing them in order: Lin Zexu\'s 1839 letter appealing to Britain\'s own domestic prohibition of opium — "Since then you do not permit it to injure your own country, you ought not to have the injurious drug transferred to another country" (Doc 2) — and the Charter Oath\'s promise that "wisdom and ability should be sought after in all quarters of the world" (Doc 5) together show Asian states asserting moral and diplomatic agency over the terms of contact, one through appeal and one through selective adaptation; the Berlin Act\'s requirement that any new African coastal claim be accompanied by "a notification thereof, addressed to the other Signatory Powers" and by "the establishment of authority... sufficient to protect existing rights" (Doc 3) shows that even at the height of the Scramble, African territorial claims still had to clear a formal procedural bar among competing powers rather than being simply seized; the indenture table\'s combined total of 1,089,129 Indian laborers transported to six colonies under indenture (Doc 4) shows the specific economic labor regime that filled the vacuum left by the abolition of slavery; and Kipling\'s "White Man\'s Burden," urging readers to "seek another\'s profit, / And work another\'s gain" (Doc 1), shows the ideological framing built to justify the whole project as a duty rather than a taking. Outside evidence brings in Ethiopia\'s decisive military victory over Italy at the Battle of Adwa in 1896, which forced European recognition of Ethiopian independence and shows African agency shaping the terms of expansion by force rather than diplomacy alone — an outcome none of the five documents themselves describe. Sourcing explains that Lin Zexu (Doc 2) wrote as the Qing commissioner charged with suppressing the opium trade, addressing Queen Victoria directly just before the First Opium War to appeal to Britain\'s own stated values, which explains his focus on moral consistency; that Kipling (Doc 1) wrote in 1899 specifically to urge the United States toward colonial rule in the Philippines, which explains why the poem frames conquest as a costly duty rather than a material gain; and that the Berlin Act\'s plenipotentiaries (Doc 3) represented fourteen competing powers (the Ottoman Empire among them) negotiating rules to avoid conflict AMONG THEMSELVES, which explains why the Act regulates procedure rather than the treatment of African peoples. Complexity is shown by explicitly weighing the limits of Asian/African agency against its reality — arguing that Lin Zexu\'s appeal, however morally forceful, did not prevent the First Opium War, while Ethiopia\'s battlefield victory did force real recognition — and by corroborating very different document types (a poem, a diplomatic letter, a treaty text, a data table, a political charter) against one another rather than treating "shaping the terms" as a single uniform verdict.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which Asian and African states shaped the terms of European imperial expansion, 1750-1900) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a single unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt, offers a list with no line of reasoning ("expansion happened and some places resisted"), or is not historically defensible.',
            modelResponse:
              'Asian and African states shaped the terms of European imperial expansion substantially — through diplomatic appeals that pressured imperial powers morally, through treaty frameworks that regulated (without preventing) the Scramble, and through state-directed reform programs that determined whether expansion took a formal or informal shape — even though that shaping rarely stopped expansion outright.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. the Industrial Revolution\'s technological and military edge (steamships, quinine, the Maxim gun) that broke from the more balanced mercantile-era relationships of the prior centuries. No credit (0/1) for a single vague, unsupported phrase ("Europe got stronger") or context copied from a document without independent elaboration.',
            modelResponse:
              'By the 1870s-80s, the Industrial Revolution had given European powers a decisive military and economic edge over the Asian and African states they had previously traded with on more equal terms — steamships that could navigate African rivers, quinine that suppressed malaria\'s toll on European personnel, and the Maxim gun\'s firepower advantage — a sharp technological break from the centuries of more balanced mercantile-era contact that preceded it.',
          },
          {
            criterionId: 'C-doc-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST FOUR of the five documents, grouped to support the essay\'s line of reasoning (not summarized one at a time in isolation). 1/2: accurately describes the content of at least three documents, whether or not they clearly support an argument. 0/2: fewer than three documents used, or documents are misdescribed.',
            modelResponse:
              'Lin Zexu\'s 1839 letter appeals to Britain\'s own domestic prohibition of opium — "Since then you do not permit it to injure your own country, you ought not to have the injurious drug transferred to another country" (Doc 2) — while the Charter Oath promises that "wisdom and ability should be sought after in all quarters of the world" (Doc 5), together showing Asian states asserting agency over the terms of contact through appeal and through selective adaptation. The Berlin Act\'s requirement that a new African claim be accompanied by "a notification thereof, addressed to the other Signatory Powers" and by "the establishment of authority... sufficient to protect existing rights" (Doc 3) shows African claims still had to clear a formal procedural bar among competing powers. The indenture table\'s combined total of 1,089,129 Indian laborers across six colonies (Doc 4) shows the specific labor regime that filled the post-abolition economic vacuum, and Kipling\'s "White Man\'s Burden" (Doc 1) shows the ideological framing built to justify the whole project as duty rather than taking.',
          },
          {
            criterionId: 'D-outside-evidence',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the five documents, relevant to the argument, and EXPLAINS its relevance (not just names it). No credit (0/1) for a vague reference with no specific evidence, or evidence that is simply named with no explanation of how it supports the thesis.',
            modelResponse:
              'Ethiopia\'s decisive military victory over Italy at the Battle of Adwa in 1896 forced European recognition of Ethiopian independence, showing African agency shaping the terms of expansion by force on the battlefield rather than by diplomacy alone — an outcome none of the five documents themselves describe, since none of them narrate a military engagement.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date without explaining relevance to the argument.',
            modelResponse:
              'Lin Zexu (Doc 2) wrote as the Qing commissioner charged with suppressing the opium trade, addressing Queen Victoria directly just before the First Opium War to appeal to Britain\'s own stated domestic values, which explains his focus on moral consistency rather than legal argument. Kipling (Doc 1) wrote in 1899 specifically to urge the United States toward colonial rule in the Philippines after the Spanish-American War, which explains why the poem frames conquest as a costly, thankless duty rather than a material gain. The Berlin Act\'s plenipotentiaries (Doc 3) represented fourteen competing powers (the Ottoman Empire among them) negotiating rules to avoid conflict among themselves, which explains why the Act regulates notification and effective occupation procedure rather than the treatment of African peoples.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. explicitly weighing the limits of Asian/African agency against its reality, corroborating multiple document types against each other, or explaining more than one variable (here, that agency looked different in a Qing diplomatic appeal, a Japanese reform program, and an African labor migration) — not from a single isolated clever sentence. No credit (0/1) if the essay treats "shaping the terms" as a single flat verdict with no qualification or comparison.',
            modelResponse:
              'What complicates a simple "Asian and African states shaped the terms" narrative is weighing the limits of that shaping against its reality — Lin Zexu\'s morally forceful appeal (Doc 2) did not prevent the First Opium War, while Ethiopia\'s battlefield victory at Adwa did force real diplomatic recognition — corroborated across very different document types: a poem, a diplomatic letter, a treaty text, a data table, and a political charter, each showing agency operating through a different mechanism (ideology, appeal, procedure, labor, reform) rather than a single uniform story.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3 in order.',
        'For sourcing, ask: why did THIS author write THIS document for THIS audience, and how does that explain what it argues?',
        'Only quote what a document actually says — the indenture table (Doc 4) covers Indian indenture to six named destinations, not a grand total of all indentured migration; the Charter Oath (Doc 5) is only reliably quotable for Articles 1 and 5.',
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
        'Only attribute to a document what it actually says — the indenture table (Doc 4) is Indian indenture to six named colonies only, and the Charter Oath (Doc 5) is reliably quotable only for Articles 1 and 5.',
        'A strong complexity move for this packet: weigh the LIMITS of Asian/African agency (Lin Zexu\'s appeal did not stop the Opium War) against its REALITY (Ethiopia\'s victory at Adwa did).',
      ],
      estimatedMinutes: 3,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6-DBQ',
    cedTitle: 'Unit 6 DBQ Practice — Consequences of Industrialization',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP World History Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Contextualization 1 / Evidence-Documents 2 / Evidence-Beyond 1 / Sourcing 1 / Complexity 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-white-mans-burden.v1',
        chapter: '1899',
        note: 'Rudyard Kipling, "The White Man\'s Burden" — Document 1 of the five-document Unit-6 packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-lin-zexu.v1',
        chapter: '1839',
        note: 'Lin Zexu, letter to Queen Victoria — Document 2 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-berlin-act.v1',
        chapter: '1885',
        note: 'General Act of the Berlin Conference — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-indenture-table.v1',
        chapter: '1834-1917',
        note: 'Indian Indentured Emigration by Destination (data table) — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-meiji-charter-oath.v1',
        chapter: '1868',
        note: 'The Charter Oath — Document 5 of the packet.',
      },
    ],
  },
};
