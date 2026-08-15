/**
 * AP US History — CED Unit 6.8-6.10: Immigration and Urbanization.
 *
 * Period-6 content plan (follows the causes-of-revolution calibration
 * template — see ap-apush-u3-causes-of-revolution.ts for the full
 * rationale and docs/superpowers/specs/2026-07-10-ap-us-history-design.md
 * for the shared Passage/rubric infra this plan reuses).
 *
 * TWO anchor texts:
 *  - concept: evelyn.passage.apush-immigration-table.v1, a described DHS
 *    data table on 1861-1900 immigration by decade and the shift in
 *    European sending regions. Per that passage's own docblock, the
 *    region-shift percentages (e.g. Southern/Eastern Europe rising from
 *    ~16% to ~43% of European immigration between the 1880s and 1890s)
 *    are shares of EUROPEAN immigration specifically, NOT of total
 *    immigration (which includes non-European arrivals, chiefly from
 *    Asia). Every reference to those percentages below preserves that
 *    scoping exactly.
 *  - worked_example: evelyn.passage.apush-chinese-exclusion.v1, the
 *    Chinese Exclusion Act's operative suspension text — used to analyze
 *    nativism aimed specifically at Chinese immigrants, distinct from the
 *    softer, more diffuse nativism aimed at Southern/Eastern European
 *    Catholics and Jews discussed via the data table.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U6_IMMIGRATION_URBANIZATION: LessonPlan = {
  id: 'evelyn.ap.apush.immigration-urbanization.v1',
  title: 'U6.8-6.10 Immigration and Urbanization',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.immigration-urbanization',
      description:
        'Explain the shift in immigrant origins and its effects on ethnic enclaves and urban political machines; explain the causes and limits of nativist responses, including the Chinese Exclusion Act; and explain urban reform responses including settlement houses.',
      standard: 'AP-APUSH-6.8',
    },
  ],
  prerequisites: ['apush.industrialization-big-business'],
  followUps: ['apush.gilded-politics-populism'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see nativism as a targeted response to specific groups, not a uniform reaction to "immigrants" as an undifferentiated category.',
      script:
        "By the 1890s, American cities were absorbing immigrants at a scale the country had never seen — and the loudest nativist backlash was not aimed evenly at everyone arriving. It was aimed disproportionately at specific groups: Catholics and Jews from Southern and Eastern Europe, and Chinese immigrants on the West Coast, while Protestant immigrants from Northern and Western Europe drew comparatively little organized hostility, even though all of them were, technically, \"immigrants.\" That's the pattern we're tracing today: who actually came in these decades, where they settled and how they built community and political power once they arrived, and exactly which groups nativist politics singled out — and why the difference matters for understanding this period accurately.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-new-immigrants-and-cities',
      kind: 'concept',
      goal: 'Explain the shift in immigrant origins shown by the immigration data, the growth of ethnic enclaves and urban political machines, and the rise of settlement houses as an urban reform response.',
      keyIdeas: [
        'THE SCALE OF IMMIGRATION: total immigration to the U.S. rose across these decades before dipping slightly at the end of the century — roughly 2.3 million arrivals in the 1860s, 2.8 million in the 1870s, peaking at roughly 5.2 million in the 1880s, then falling to roughly 3.7 million in the 1890s.',
        'THE SHIFT IN EUROPEAN SENDING REGIONS: within European immigration specifically — not total immigration — the balance of sending regions shifted decisively over the 1880s and 1890s. Southern and Eastern European arrivals (Italy, Austria-Hungary, Russia) rose from roughly 16 percent of that decade\'s European immigration in the 1880s to roughly 43 percent in the 1890s, while Northern and Western European arrivals (Germany, Ireland, the United Kingdom, Norway-Sweden) fell from roughly 76 percent to roughly 46 percent of European immigration over the same span. These are SHARES OF EUROPEAN IMMIGRATION — the "new immigrants" were becoming a larger slice of the European total, not necessarily a majority of ALL immigration, which also included substantial arrivals from Asia (chiefly China, then increasingly restricted after 1882) and elsewhere.',
        '"NEW IMMIGRANTS": the label historians use for this rising share of Southern and Eastern European arrivals — largely Catholic (Italians) and Jewish (from the Russian Empire and Austria-Hungary), often fleeing economic hardship, religious persecution (particularly Jewish immigrants fleeing pogroms in the Russian Empire), or political instability. They differed in religion, language, and (in nativist eyes) perceived "assimilability" from the largely Protestant "old immigrants" from Northern and Western Europe who had dominated earlier in the century.',
        'ETHNIC ENCLAVES: new immigrants settled disproportionately in dense urban neighborhoods organized around shared language, religion, and national origin (e.g. Manhattan\'s Lower East Side for Eastern European Jews, Little Italy neighborhoods) — providing mutual support, employment networks, and cultural continuity, but also concentrating poverty and overcrowding.',
        'URBAN POLITICAL MACHINES: organizations like New York\'s Tammany Hall built durable political power in immigrant-heavy cities by trading concrete services — jobs, help with landlords or the law, small emergency aid, naturalization assistance — for votes, run through ward-level "bosses" who knew their immigrant constituents personally. Machines were widely criticized for corruption (patronage, graft) but also provided real, otherwise-unavailable social services in an era before public welfare programs existed.',
        'NATIVISM WAS TARGETED, NOT UNIFORM: nativist organizations (like the American Protective Association, founded 1887) focused hostility specifically on Catholic and Jewish "new immigrants," portraying them as unassimilable or as economic threats to native-born workers. On the West Coast, nativism took an even sharper, explicitly race-based legal form aimed at Chinese immigrants, who had arrived in significant numbers from the 1850s onward (initially drawn by the Gold Rush, then railroad and mining labor).',
        'THE CHINESE EXCLUSION ACT (1882): the sharpest legal expression of nativism in this period — the first major federal law restricting immigration by nationality, suspending the immigration of Chinese laborers specifically, for ten years (later extended and made permanent until repealed in 1943). No comparable blanket restriction targeted any European immigrant group in this period, underscoring how nativism operated with sharply different intensity and legal force against different immigrant groups.',
        'SETTLEMENT HOUSES: reformers such as Jane Addams, who founded Hull House in Chicago in 1889, established community centers in immigrant neighborhoods offering childcare, English classes, healthcare, and recreational and cultural programs — a Progressive-era-adjacent reform response to urban poverty that worked directly with immigrant communities rather than through machine politics or restrictionist law.',
      ],
      vocabulary: [
        {
          term: '"new immigrants"',
          definition:
            'historians\' term for the rising share (within European immigration specifically) of Southern and Eastern European, largely Catholic and Jewish, arrivals from the 1880s onward.',
        },
        {
          term: 'ethnic enclave',
          definition:
            'a dense urban immigrant neighborhood organized around shared language, religion, or national origin, providing mutual support but often overcrowded and poor.',
        },
        {
          term: 'urban political machine',
          definition:
            'an organization (e.g. Tammany Hall) that traded jobs and services for votes in immigrant-heavy cities, run through ward-level "bosses."',
        },
        {
          term: 'Chinese Exclusion Act (1882)',
          definition:
            'first major federal law restricting immigration by nationality, suspending the immigration of Chinese laborers for ten years — the sharpest, most explicitly race-targeted form of nativism in this period.',
        },
        {
          term: 'settlement house',
          definition:
            'a community center (e.g. Jane Addams\'s Hull House, 1889) in an immigrant neighborhood offering childcare, education, and services as an urban reform response to poverty.',
        },
      ],
      passageId: 'evelyn.passage.apush-immigration-table.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-chinese-exclusion-act',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from the Chinese Exclusion Act (1882): "Be it enacted... That from and after the expiration of ninety days next after the passage of this act, and until the expiration of ten years next after the passage of this act, the coming of Chinese laborers to the United States be, and the same is hereby, suspended; and during such suspension it shall not be lawful for any Chinese laborer to come, or having so come after the expiration of said ninety days to remain within the United States." What does this text do, and how does it demonstrate that nativism in this period targeted specific groups rather than immigrants generally?',
      steps: [
        'SOURCE IT FIRST. This is the OPERATIVE legal text of an 1882 act of Congress — not rhetoric or opinion, but a binding federal statute with immediate legal force, ninety days after passage.',
        'IDENTIFY THE PRECISE SCOPE. The text suspends the immigration of "Chinese laborers" specifically — for ten years — and separately makes it unlawful for a Chinese laborer who arrived after the ninety-day window to REMAIN in the country. It names one specific national-origin group by name; it does not restrict immigration from any other country or region.',
        'CONNECT TO THE BROADER NATIVIST CONTEXT. Nativist hostility toward Southern and Eastern European "new immigrants" in this same period took the form of social prejudice, discriminatory hiring, and organizing by groups like the American Protective Association — but Congress did not pass any comparable blanket immigration ban targeting Italians, Jews, or any other European nationality in this period. The Chinese Exclusion Act is a categorically SHARPER response: an explicit, race/nationality-based federal law, not informal social prejudice.',
        'EXPLAIN WHY THE COMPARISON MATTERS. If nativism affected all immigrant groups equally, we would expect similarly binding federal restrictions on European immigration in the same decades — we do not see that until much later (the 1920s quota laws). The specific, targeted, and immediate legal force of the Chinese Exclusion Act shows that nativism in this period operated with sharply different intensity depending on the group targeted, with Chinese immigrants facing the harshest, most explicit legal exclusion.',
        'STATE THE LINK TO THE COURSE THESIS. This document is direct evidence that "nativism" in the Gilded Age was not one uniform reaction to immigration in general — it singled out specific groups (Chinese immigrants here, in the sharpest possible legal form) for exclusion well before comparable restrictions applied to European immigrant groups.',
      ],
      answer:
        'The excerpt is the binding operative text of a federal statute suspending the immigration of "Chinese laborers" specifically for ten years, and separately barring any Chinese laborer who arrives after a ninety-day grace period from remaining in the country. It names one national-origin group and restricts it directly by federal law — a categorically different, more severe response than the informal social prejudice and organized hostility (e.g. from groups like the American Protective Association) directed at Southern and Eastern European Catholic and Jewish immigrants in the same decades, which did not produce a comparable blanket congressional immigration ban until the 1920s. This contrast is direct evidence that nativism in this period was targeted rather than uniform: Chinese immigrants faced the sharpest, most explicit legal exclusion of any immigrant group in the Gilded Age, while "new immigrant" Europeans faced serious but comparatively less legally formalized hostility over the same span.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE way immigrant origins shifted between the 1880s and the 1890s. (b) Briefly explain ONE way immigrants organized urban community life or political power in response to arriving in American cities. (c) Briefly explain ONE limitation of the claim that nativism in this period targeted all immigrant groups equally.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes the shift within European immigration toward Southern and Eastern European origins (e.g. Italy, Austria-Hungary, Russia rising from roughly 16% to roughly 43% of European immigration between the 1880s and 1890s), scoped correctly as a share of EUROPEAN immigration. No credit for describing it as a share of total immigration or for a vague, unspecific claim.',
            modelResponse:
              'Between the 1880s and 1890s, Southern and Eastern European immigrants (from Italy, Austria-Hungary, and Russia) rose from roughly 16 percent to roughly 43 percent of European immigration, while Northern and Western European arrivals fell from roughly 76 percent to roughly 46 percent of European immigration over the same span.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate form of immigrant organization — e.g. ethnic enclaves providing mutual support, or urban political machines (e.g. Tammany Hall) trading jobs and services for votes. No credit for a vague or unsupported claim.',
            modelResponse:
              'Immigrants often settled in ethnic enclaves organized around shared language and national origin, such as the Lower East Side for Eastern European Jews, which provided mutual support, employment networks, and cultural continuity in an unfamiliar and often hostile new environment.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate limitation — e.g. the Chinese Exclusion Act (1882) imposed a binding federal ban on one specific national-origin group, a categorically sharper response than the social prejudice European "new immigrants" faced, showing nativism was not applied uniformly. No credit for a vague or unsupported claim.',
            modelResponse:
              'Nativism was not applied equally: the Chinese Exclusion Act (1882) imposed a binding federal law suspending Chinese laborers\' immigration specifically, while Southern and Eastern European "new immigrants" faced serious social prejudice and organized hostility (from groups like the American Protective Association) but no comparable congressional immigration ban until decades later, showing Chinese immigrants faced a sharper, more formalized form of exclusion.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-nativism-uniform',
      kind: 'misconception_check',
      question:
        'True or false: nativism in this period was a general hostility toward "immigrants" that applied roughly equally to all immigrant groups.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Treating "immigrants" as a single undifferentiated category and assuming nativist hostility was distributed evenly across all national-origin groups, rather than concentrated on specific groups with sharply different intensity.',
          correctsTo:
            'FALSE. Nativism in this period targeted specific groups with very different intensity. Chinese immigrants faced the sharpest response: the Chinese Exclusion Act (1882), a binding federal law suspending Chinese laborers\' immigration specifically — the first major federal immigration restriction based on nationality. Southern and Eastern European "new immigrants" (largely Catholic and Jewish) faced serious social prejudice and organized nativist hostility (e.g. from the American Protective Association) but no comparable congressional ban in this period. Northern and Western European immigrants, by contrast, faced comparatively little organized nativist hostility despite also being "immigrants." Describing nativism as evenly distributed erases this targeting, which the AP exam expects you to identify specifically (which groups, what form of hostility, and how severe).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Total immigration peaked in the 1880s (~5.2 million) before falling in the 1890s (~3.7 million); within EUROPEAN immigration specifically, Southern/Eastern European arrivals rose from ~16% to ~43% while Northern/Western European arrivals fell from ~76% to ~46% between the 1880s and 1890s.',
        'New immigrants (Southern/Eastern European, largely Catholic and Jewish) built ethnic enclaves for mutual support and were courted by urban political machines (e.g. Tammany Hall) trading services for votes.',
        'Nativism was targeted, not uniform: the Chinese Exclusion Act (1882) imposed the sharpest, most explicit legal restriction — a binding federal ban on one national-origin group — well before any comparable restriction on European immigrant groups.',
        'Settlement houses (e.g. Jane Addams\'s Hull House, 1889) offered a reform response to urban immigrant poverty distinct from machine politics or restrictionist law.',
        'Region-shift percentages describe shares of EUROPEAN immigration, not shares of total immigration (which also includes Asian arrivals, increasingly restricted after 1882) — keep that scoping precise.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.8-6.10',
    cedTitle: 'Immigration and Urbanization',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-immigration-table.v1',
        chapter: '1861-1900',
        note: 'U.S. Immigration by Decade data table — anchor for the sending-region shift, scoped to shares of European immigration.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-chinese-exclusion.v1',
        chapter: '1882',
        note: 'Chinese Exclusion Act — anchor document for targeted, race/nationality-based nativism.',
      },
    ],
  },
};
