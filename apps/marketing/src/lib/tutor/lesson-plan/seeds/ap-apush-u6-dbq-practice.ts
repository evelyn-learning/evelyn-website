/**
 * AP US History — Period 6 DBQ Practice: the full Document-Based Question
 * essay (AP APUSH Free-Response Question 1).
 *
 * This is the essay-practice plan that closes out the Period-6 content arc
 * (the West and the New South 6.2-6.3, industrialization and big business
 * 6.4-6.6, the labor movement 6.7, immigration and urbanization 6.8-6.10,
 * Gilded Age politics and Populism 6.11-6.13): students now write ONE
 * complete DBQ essay under real AP exam conditions, using a genuine
 * five-document packet, and are scored against the authentic AP APUSH
 * 7-point DBQ rubric.
 *
 * Document packet (the `passageIds` field with `packetLabel:'document'` —
 * resolved and labeled Document 1..5 for the grader in array order, see
 * src/lib/tutor/portal/adapters.ts resolvePassageText):
 *   1. Andrew Carnegie, "Wealth" (1889) — evelyn.passage.apush-carnegie-wealth.v1
 *   2. People's Party, Omaha Platform (1892) — evelyn.passage.apush-omaha-platform.v1
 *   3. Chinese Exclusion Act (1882) — evelyn.passage.apush-chinese-exclusion.v1
 *   4. U.S. Immigration by Decade, 1861-1900 (data table) —
 *      evelyn.passage.apush-immigration-table.v1
 *   5. William Jennings Bryan, "Cross of Gold" speech (1896) —
 *      evelyn.passage.apush-cross-of-gold.v1
 *
 * Document fidelity (see each passage's own docblock for the seeded
 * excerpt's exact scope): Document 1 states only Carnegie's duty-to-
 * redistribute/trustee argument, NOT the essay's earlier, unseeded
 * Social-Darwinist defense of accumulation — that broader argument is
 * outside evidence, not Document 1's content. Document 2 is the Omaha
 * Platform's "verge of ruin" preamble plus the sub-treasury/free-silver
 * finance plank and the railroad-nationalization transportation plank —
 * NOT the full historical Populist program (e.g. the graduated income tax,
 * the secret ballot, or the initiative/referendum), which is outside
 * evidence if raised. Document 3 is only the Exclusion Act's ten-year
 * suspension of Chinese LABORER immigration, not its later renewals or the
 * 1892 Geary Act. Document 4's regional-shift percentages are shares of
 * EUROPEAN immigration specifically (Southern/Eastern vs. Northern/Western
 * Europe) — every reference to those percentages in this plan preserves
 * that scoping rather than treating them as shares of total immigration.
 * Document 5 is only Bryan's closing "cross of gold" lines, not the
 * speech's fuller free-silver economic argument (elided in the source
 * excerpt with an ellipsis).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U6_DBQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u6-dbq-practice.v1',
  title: 'Period 6 DBQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u6-dbq-practice',
      description:
        'Write a complete AP APUSH Document-Based Question essay from a five-document Period-6 packet evaluating the extent to which industrialization transformed American society, 1865-1898 — a defensible, historically complex thesis; contextualization of the broader period; document evidence used to support an argument (not summarized document-by-document); outside evidence beyond the documents; sourcing (HIPP) of at least three documents; and complex understanding — scored against the authentic AP APUSH 7-point DBQ rubric.',
      standard: 'AP-APUSH-6-DBQ',
    },
  ],
  prerequisites: [
    'apush.the-west-new-south',
    'apush.industrialization-big-business',
    'apush.labor-movement',
    'apush.immigration-urbanization',
    'apush.gilded-politics-populism',
  ],
  followUps: [],
  estimatedMinutes: 58,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full DBQ essay concrete before the student sits down to write one, and name the single biggest scoring trap: summarizing documents one at a time instead of using them as evidence for an argument.',
      script:
        "Everything you've learned about Period 6 — the closing of the West and the New South, the rise of big business, the labor movement's fight against industrial conditions, the new wave of immigration and the cities it built, and the Gilded Age political stalemate the Populists tried to break — exists to make ONE thing possible: writing a complete Document-Based Question essay under real exam conditions. That's FRQ 1 on the AP US History exam, scored on the authentic 7-point rubric: Thesis (1), Contextualization (1), Evidence from the Documents (2), Evidence Beyond the Documents (1), Sourcing (1), and Complexity (1). You'll get five documents spanning 1882 to 1896. Your job is NOT to walk through them one by one — it's to build YOUR OWN argument about how far industrialization actually transformed American society, and use the documents, plus what you already know, as evidence for it. Today you write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dbq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the DBQ task asks for and how the 7-point rubric awards points, row by row, using the five-document Period-6 packet as the concrete example.',
      keyIdeas: [
        'THE TASK: you get five documents on a historical question. Write an essay that develops YOUR OWN argument responding to the prompt and uses the documents (plus outside knowledge) as evidence — the single most common way students lose points is summarizing each document in its own paragraph ("Document 1 says X. Document 2 says Y.") instead of grouping documents around a claim.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — not a restatement of the prompt, not a simple list of "industrialization changed the economy and society." A strong thesis for this packet might argue industrialization transformed the economic and social structure of American life (new fortunes, new labor conditions, new cities, new immigrant populations) far more thoroughly than it transformed the two-party political system, which remained gridlocked and unresponsive until the political shocks of the mid-1890s.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires situating the argument in the broader historical situation relevant to the prompt — e.g. describing how the post-Civil War completion of the transcontinental railroad network, the exploitation of new natural resources (coal, iron ore, oil), and a fresh wave of foreign capital and labor together created the conditions for industrial takeoff at a speed and scale the country had never seen — in AT LEAST a full sentence of specific description, not a single vague phrase like "the economy grew a lot after the war."',
        'ROW C — EVIDENCE FROM THE DOCUMENTS (0–2 points): 1 point for accurately describing the content of at least three documents; the full 2 points require using the content of at least four documents to SUPPORT the thesis\'s argument (the real AP threshold for this row) — e.g. grouping Carnegie\'s "Wealth" (Doc 1) as evidence that new industrial fortunes were large enough to generate their own moral debate over what the wealthy owed society; the Omaha Platform (Doc 2) and Bryan\'s "Cross of Gold" (Doc 5) as evidence that the political system was eventually forced to respond to industrialization\'s economic pressures on farmers and debtors; and the Chinese Exclusion Act (Doc 3) alongside the immigration data table (Doc 4) as evidence that industrial-era immigration reshaped who came to America and provoked a nativist political backlash.',
        'ROW D — EVIDENCE BEYOND THE DOCUMENTS (0–1 point): full credit requires ONE additional piece of specific historical evidence, beyond anything in the five documents, relevant to the argument and explained (not just named) — e.g. the Homestead Strike (1892) or the Pullman Strike (1894), neither of which appears in this packet, as evidence that industrial labor conditions themselves — not just farm and currency grievances — generated organized, sometimes violent resistance to industrialization\'s social costs.',
        'ROW E — SOURCING (0–1 point): full credit requires explaining, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or audience (HIPP) is relevant to the argument — e.g. the Omaha Platform (Doc 2) was written by the People\'s Party to unify indebted farmers and laborers around a shared reform program ahead of the 1892 election, which explains its "verge of ruin" language and its specific demands for free silver and public ownership of railroads; Carnegie\'s "Wealth" (Doc 1) was written by one of the era\'s wealthiest industrialists for an educated magazine readership, which explains why he frames redistribution as a personal DUTY rather than a call for government regulation; the Chinese Exclusion Act (Doc 3) is a federal statute, meaning it reflects an official, binding government response to nativist political pressure rather than a private opinion.',
        'ROW F — COMPLEXITY (0–1 point): earned holistically for a nuanced argument that does things like explain both continuity AND change, corroborate multiple document types (an essay, a party platform, a federal statute, a data table, a speech) against each other, or explain multiple variables (e.g. that industrialization transformed the ECONOMIC and SOCIAL order quickly while the POLITICAL system lagged behind until the 1896 election) — earned through the essay\'s overall argument, not from one clever sentence in isolation.',
        'Total = 7 points, integer, summed across the six rows (Evidence from the Documents is worth 2) — the authentic AP APUSH DBQ scale, distinct from the AP Lang 6-point rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-full-essay-dbq',
      kind: 'try_yourself',
      problem:
        'Using the five documents below and your knowledge of the period, write an essay that responds to the following prompt: "Evaluate the extent to which industrialization transformed American society in the period 1865–1898." In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support an argument in response to the prompt using at least four of the five documents, (4) use at least one additional piece of specific historical evidence beyond what is in the documents, (5) explain how or why the point of view, purpose, historical situation, and/or audience of at least three documents is relevant to your argument (sourcing), and (6) demonstrate a complex understanding of the historical development that is the focus of the prompt.',
      responseFormat: 'frq',
      packetLabel: 'document',
      passageIds: [
        'evelyn.passage.apush-carnegie-wealth.v1',
        'evelyn.passage.apush-omaha-platform.v1',
        'evelyn.passage.apush-chinese-exclusion.v1',
        'evelyn.passage.apush-immigration-table.v1',
        'evelyn.passage.apush-cross-of-gold.v1',
      ],
      expectedAnswer:
        'A full-credit response opens with a thesis arguing that industrialization transformed the ECONOMIC and SOCIAL structure of American life — new industrial fortunes, new urban immigrant populations, new labor conditions — far more thoroughly and quickly than it transformed the POLITICAL system, which remained gridlocked between two closely matched parties until the economic pressures of the mid-1890s finally forced a political reckoning, or a comparably defensible complex claim with a clear line of reasoning. Contextualization situates the packet in the post-Civil War completion of the transcontinental railroad network and the large-scale exploitation of coal, iron, and oil, which together with a fresh wave of foreign capital and immigrant labor produced an industrial takeoff of unprecedented speed and scale in the three decades after 1865. The body groups at least four documents around the thesis rather than summarizing them in order: Carnegie\'s "Wealth" (Doc 1) shows that new industrial fortunes were now large enough to generate their own moral debate over what the wealthy owed society, since Carnegie insists the man of wealth is "strictly bound as a matter of duty" to administer his surplus as a "trust fund" for the community; the Omaha Platform\'s indictment of a nation on "the verge of moral, political, and material ruin" and its demands for free silver, a sub-treasury currency system, and government ownership of railroads (Doc 2), together with Bryan\'s refusal to let banks "crucify mankind upon a cross of gold" (Doc 5), show that industrialization\'s deflationary currency and concentrated rail power eventually pushed farmers and debtors to organize a direct political challenge; and the Chinese Exclusion Act\'s ten-year suspension of Chinese laborer immigration (Doc 3), read alongside the immigration data table\'s documentation of a decisive shift in European sending regions — from roughly 76 percent Northern/Western European in the 1880s to roughly 46 percent by the 1890s, with Southern/Eastern Europe\'s share of EUROPEAN arrivals rising from about 16 percent to about 43 percent over the same span (Doc 4) — together show that the industrial economy\'s demand for labor reshaped who came to America and provoked a nativist political backlash strong enough to become federal law. Outside evidence brings in the Homestead Strike of 1892, in which Carnegie Steel workers struck over wage cuts and were met with armed Pinkerton agents and then state militia, showing that industrial labor conditions themselves — not just farm and currency grievances — generated organized, sometimes violent resistance that goes beyond anything the five documents describe. Sourcing explains that the Omaha Platform (Doc 2) was written by the People\'s Party to unify indebted farmers and industrial laborers around a shared reform program ahead of the 1892 election, which explains both its apocalyptic "verge of ruin" language and its specific currency and railroad demands; that Carnegie\'s "Wealth" (Doc 1) was written by one of the era\'s wealthiest industrialists for an educated North American Review readership, which explains why he frames redistribution as a personal moral duty rather than as a call for government regulation of wealth; and that the Chinese Exclusion Act (Doc 3), as a federal statute, reflects an official, binding government response to nativist political pressure rather than a private opinion, which explains its blunt, unconditional suspension language. Complexity is shown by explicitly weighing how fast different parts of American life changed — arguing that the economic and social order was reshaped within a generation while the political party system, still built around Civil War-era loyalties and patronage, only responded to industrialization\'s pressures in the 1896 election that Bryan\'s speech (Doc 5) closes — rather than treating "transformation" as a single uniform verdict across economy, society, and politics alike.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim that responds to the prompt (the extent to which industrialization transformed American society, 1865-1898) AND establishes a line of reasoning for the essay to follow — not a restatement of the prompt, not a simple list ("there were economic and social changes"). No credit (0/1) for a thesis that only restates the prompt, offers a list with no line of reasoning, or is not historically defensible.',
            modelResponse:
              'Industrialization transformed the ECONOMIC and SOCIAL structure of American life — new fortunes, new urban immigrant populations, new labor conditions — far more thoroughly and quickly than it transformed the POLITICAL system, which stayed gridlocked between two closely matched parties until the economic pressures of the mid-1890s finally forced a political reckoning.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. the post-Civil War completion of the transcontinental railroad network and the large-scale exploitation of coal, iron, and oil that, combined with foreign capital and immigrant labor, produced an industrial takeoff of unprecedented speed. No credit (0/1) for a single vague, unsupported phrase ("the economy grew a lot") or context copied from a document without independent elaboration.',
            modelResponse:
              'After the Civil War, the completion of the transcontinental railroad network and the large-scale exploitation of coal, iron ore, and oil deposits — financed by a fresh wave of domestic and foreign capital and staffed by a growing pool of immigrant labor — together produced an industrial takeoff of a speed and scale the United States had never before experienced.',
          },
          {
            criterionId: 'C-doc-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses the content of AT LEAST FOUR of the five documents, grouped to support an argument in response to the prompt (not summarized one at a time in isolation) — the real AP threshold for this row. 1/2: accurately describes the content of at least three documents, whether or not they clearly support an argument. 0/2: fewer than three documents used, or documents are misdescribed.',
            modelResponse:
              'Carnegie\'s "Wealth" (Doc 1) shows new industrial fortunes were large enough to generate their own moral debate over what the wealthy owed society, since Carnegie insists the man of wealth is "strictly bound as a matter of duty" to administer his surplus as a "trust fund" for the community. The Omaha Platform\'s indictment of a nation on "the verge of moral, political, and material ruin" and its demands for free silver and government ownership of railroads (Doc 2), together with Bryan\'s refusal to let banks "crucify mankind upon a cross of gold" (Doc 5), show industrialization\'s currency and rail power eventually pushed farmers and debtors into direct political organizing. The Chinese Exclusion Act\'s suspension of Chinese laborer immigration (Doc 3), read against the data table\'s documentation of European immigration shifting from about 76 percent Northern/Western European in the 1880s to about 46 percent in the 1890s as Southern/Eastern Europe\'s share of European arrivals rose from roughly 16 to 43 percent (Doc 4), shows the industrial economy\'s labor demands reshaped immigration and provoked a nativist backlash that became federal law.',
          },
          {
            criterionId: 'D-outside-evidence',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): brings in ONE piece of specific historical evidence not found in any of the five documents, relevant to the argument, and EXPLAINS its relevance (not just names it). No credit (0/1) for a vague reference with no specific evidence, or evidence that is simply named with no explanation of how it supports the thesis.',
            modelResponse:
              'The Homestead Strike (1892), in which Carnegie Steel workers struck over wage cuts and were met first by armed Pinkerton agents and then by the Pennsylvania state militia, shows that industrial labor conditions themselves — not only farm debt and currency grievances — generated organized, sometimes violent resistance to industrialization\'s social costs, a dimension of the story none of the five documents directly describes.',
          },
          {
            criterionId: 'E-sourcing',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): explains, for AT LEAST THREE documents, how or why the document\'s point of view, purpose, historical situation, or intended audience (HIPP) is relevant to the argument being made — not just naming the author or date. No credit (0/1) for fewer than three documents sourced, or sourcing that only restates the author/date without explaining relevance to the argument.',
            modelResponse:
              'The Omaha Platform (Doc 2) was written by the People\'s Party to unify indebted farmers and industrial laborers around a shared reform program ahead of the 1892 election, which explains both its apocalyptic "verge of ruin" language and its specific currency and railroad demands. Carnegie\'s "Wealth" (Doc 1) was written by one of the era\'s wealthiest industrialists for an educated North American Review readership, which explains why he frames redistribution as a personal moral duty rather than a call for government regulation of wealth. The Chinese Exclusion Act (Doc 3), as a federal statute, reflects an official, binding government response to nativist political pressure rather than a private opinion, which explains its blunt, unconditional suspension language.',
          },
          {
            criterionId: 'F-complexity',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): earned holistically across the essay — e.g. explicitly weighing how fast different dimensions of American life changed, corroborating multiple document types against each other, or explaining more than one variable (here, contrasting rapid economic/social transformation with slower political transformation) — not from a single isolated clever sentence. No credit (0/1) if the essay treats "transformation" as a single flat verdict with no qualification or comparison.',
            modelResponse:
              'What complicates a simple "industrialization changed everything" narrative is how unevenly that change landed: the economic and social order was reshaped within a single generation — new fortunes debating their own moral obligations (Doc 1), new immigrant populations reshaping cities and provoking nativist law (Docs 3-4) — while the two-party political system, still organized around Civil War-era loyalties and patronage, only responded to industrialization\'s pressures in the 1896 election that Bryan\'s speech closes (Doc 5), revealing that "transformation" moved at very different speeds across the economy, society, and formal politics.',
          },
        ],
      },
      hints: [
        'Group documents around YOUR claim first — don\'t summarize Document 1, then 2, then 3 in order.',
        'For sourcing, ask: why did THIS author write THIS document for THIS audience, and how does that explain what it argues?',
        'Your outside-evidence fact should come from your own knowledge of the period, not be paraphrased from one of the five documents.',
        'A strong complexity move is contrasting what changed fast (economy, society) with what changed slowly (formal party politics, until 1896).',
        'When citing the immigration table, keep the percentages scoped to European immigration specifically — they are not shares of total immigration.',
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
        'A strong complexity move for this packet: economic and social change (Docs 1, 3, 4) moved faster than formal political change (Docs 2, 5), which only arrived with the 1896 election.',
        'Document fidelity: Carnegie\'s excerpt (Doc 1) argues a duty to redistribute, not a defense of unlimited accumulation; the immigration table\'s (Doc 4) percentages are shares of European immigration only.',
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
    cedTitle: 'Period 6 DBQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Document-Based Question (FRQ 1) task wording and 7-point rubric (Thesis 1 / Contextualization 1 / Evidence-Documents 2 / Evidence-Beyond 1 / Sourcing 1 / Complexity 1).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-carnegie-wealth.v1',
        chapter: '1889',
        note: 'Andrew Carnegie, "Wealth" — Document 1 of the five-document Period-6 packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-omaha-platform.v1',
        chapter: '1892',
        note: "People's Party, Omaha Platform — Document 2 of the packet.",
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-chinese-exclusion.v1',
        chapter: '1882',
        note: 'Chinese Exclusion Act — Document 3 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-immigration-table.v1',
        chapter: '1861-1900',
        note: 'U.S. Immigration by Decade data table — Document 4 of the packet.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-cross-of-gold.v1',
        chapter: '1896',
        note: 'William Jennings Bryan, "Cross of Gold" speech — Document 5 of the packet.',
      },
    ],
  },
};
