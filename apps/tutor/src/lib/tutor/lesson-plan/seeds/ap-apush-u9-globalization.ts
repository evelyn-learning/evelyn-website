/**
 * AP US History — CED Unit 9.4-9.5: Globalization, Technology, and a
 * Changing America.
 *
 * Period-9 content plan (follows the Period-3 calibration template — see
 * ap-apush-u3-causes-of-revolution.ts for the full rationale). Second stop
 * in Period 9: trade liberalization and deindustrialization, the personal
 * computer/internet revolution, the post-1965 shift in immigration
 * demographics, Clinton-era budget and welfare policy, and rising
 * inequality.
 *
 * NON-PARTISAN FRAMING NOTE: NAFTA/trade liberalization is presented with
 * both the consumer/export-market benefit and the manufacturing-job-loss
 * critique as recognized positions. This period's misconception —
 * "globalization affected all regions and workers alike" — is corrected
 * directly in the misconception_check.
 *
 * DATA-TABLE STIMULUS (Quantitative Analysis document type): the anchor is
 * evelyn.passage.apush-immigration-origins-table.v1, a text DESCRIPTION of
 * a data table (DHS/OHSS Yearbook of Immigration Statistics, Table 2), not
 * a literary excerpt — so the worked example restates its figures rather
 * than quoting continuous prose. Per that passage's own docblock, the
 * reported shares are of persons obtaining LAWFUL PERMANENT RESIDENT
 * status specifically (not all immigration, temporary visas, refugees
 * counted separately, or the undocumented population) — that scoping is
 * preserved throughout this plan. Figures used below (1960s: Europe 35%,
 * Asia 11%, Latin America 39%, other 15%; 2000s: Europe 13%, Asia 34%,
 * Latin America 41%, other 12%) are drawn only from that seeded
 * description.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U9_GLOBALIZATION: LessonPlan = {
  id: 'evelyn.ap.apush.globalization-tech.v1',
  title: 'U9.4-9.5 Globalization, Technology, and a Changing America',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.globalization-tech',
      description:
        'Explain the causes and effects of trade liberalization (NAFTA, the WTO) and deindustrialization, the personal computer/internet revolution, the post-1965 shift in immigration demographics, Clinton-era budget surpluses and welfare reform, and rising economic inequality.',
      standard: 'AP-APUSH-9.4',
    },
  ],
  prerequisites: ['apush.conservative-resurgence'],
  followUps: ['apush.america-since-2001'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the 1990s as the decade the US economy and American society were reorganized around global trade, new technology, and a genuinely new immigrant population — with real winners and real losers.',
      script:
        "In 1990, most Americans made phone calls on landlines, bought goods made mostly in the United States, and lived in a country still shaped demographically by waves of European immigration from decades earlier. By 2000, the internet was reshaping how people worked and communicated, a new trade agreement had erased most tariffs between the US, Canada, and Mexico, and the largest group of new immigrants was arriving not from Europe but from Latin America and Asia. None of this happened evenly — some regions and workers gained a great deal, others lost manufacturing jobs and never fully recovered. Today we trace how trade, technology, and immigration reshaped the country in a single decade, and why the changes landed so differently depending on where you lived and what you did for work.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-globalization-tech',
      kind: 'concept',
      goal: 'Explain NAFTA/WTO trade liberalization and deindustrialization, the PC/internet revolution, the post-1965 immigration demographic shift, Clinton-era budget and welfare policy, and rising inequality.',
      keyIdeas: [
        'NAFTA AND THE WTO: the North American Free Trade Agreement (negotiated under President George H.W. Bush, signed into law by President Clinton, effective 1994) removed most tariffs on trade among the United States, Canada, and Mexico. The United States also joined the World Trade Organization (founded 1995, succeeding the older GATT framework), part of a broader post-Cold War push toward global trade liberalization. Supporters point to lower consumer prices and expanded export markets for US firms; critics point to job losses in manufacturing regions as production shifted to lower-wage locations abroad — both are recognized historical positions.',
        'DEINDUSTRIALIZATION: US manufacturing employment declined significantly from its mid-20th-century peak as production increasingly moved overseas or was automated, a structural shift that hit the industrial Midwest and Northeast ("Rust Belt") hardest while other regions and sectors grew. This was part of a broader long-term shift toward a service- and information-based US economy, not a single-decade event.',
        'THE PERSONAL COMPUTER AND INTERNET: personal computer ownership grew rapidly through the 1980s-90s (Apple, IBM PC, Microsoft Windows), and the 1990s saw the commercialization and mass adoption of the internet (the World Wide Web, web browsers, early e-commerce) — a transformation in communication, business, and information access that became a defining feature of the era\'s economy and daily life.',
        "THE POST-1965 IMMIGRATION DEMOGRAPHIC SHIFT: the Immigration and Nationality Act of 1965 abolished the national-origins quota system that had favored European immigration since the 1920s, replacing it with a system emphasizing family reunification and occupational skills. This legal change was the underlying driver behind a demographic shift, increasingly visible by the 1990s-2000s, toward a larger share of immigrants arriving from Latin America and Asia rather than Europe.",
        "CLINTON-ERA BUDGET AND WELFARE POLICY: the Clinton administration (1993-2001) pursued deficit reduction that, combined with strong 1990s economic growth (including from the tech and trade expansions above), produced federal budget surpluses by the late 1990s — a marked change from the deficits of the 1980s. Clinton also signed the Personal Responsibility and Work Opportunity Reconciliation Act (1996), replacing the prior open-ended federal cash-assistance program with time-limited, work-requirement-based block grants to states — a significant, and still debated, change to the social safety net.",
        "RISING INEQUALITY: even amid strong aggregate economic growth in the 1990s and 2000s, income and wealth gains were not evenly distributed. Earnings for workers without a college degree grew more slowly than for highly educated or specialized workers, a trend economists attribute to a combination of factors — technological change (automation reducing demand for some kinds of labor), globalization (production shifting to lower-wage locations), and declining private-sector union membership — presented here as a documented, multi-causal trend, not a single explanation.",
      ],
      vocabulary: [
        {
          term: 'NAFTA',
          definition:
            'the North American Free Trade Agreement (effective 1994), removing most tariffs on trade among the US, Canada, and Mexico; credited by supporters with lower prices and expanded exports, criticized by others for manufacturing job losses.',
        },
        {
          term: 'deindustrialization',
          definition:
            'the long-term decline in US manufacturing employment as production shifted overseas or automated, hitting the industrial Midwest and Northeast ("Rust Belt") especially hard.',
        },
        {
          term: 'Immigration and Nationality Act of 1965',
          definition:
            'law abolishing the national-origins quota system that had favored European immigration since the 1920s, replacing it with family-reunification and skills-based criteria — the legal driver of the later shift toward Latin American and Asian immigration.',
        },
        {
          term: 'welfare reform (1996)',
          definition:
            "the Personal Responsibility and Work Opportunity Reconciliation Act, signed by Clinton, replacing open-ended federal cash assistance with time-limited, work-requirement-based state block grants.",
        },
        {
          term: 'inequality (wage gap)',
          definition:
            'the widening gap in earnings growth between college-educated/specialized workers and workers without a college degree during the 1990s-2000s, attributed to a combination of technological change, globalization, and declining unionization.',
        },
      ],
      passageId: 'evelyn.passage.apush-immigration-origins-table.v1',
      estimatedMinutes: 8,
    },
    {
      id: 'worked-immigration-table',
      kind: 'worked_example',
      problem:
        'Analyze this data table, adapted from the Department of Homeland Security\'s Yearbook of Immigration Statistics (Table 2), showing the share of persons obtaining LAWFUL PERMANENT RESIDENT status ("green cards") by region of origin, comparing fiscal years 1960-1969 to fiscal years 2000-2009: in the 1960s (roughly 3.2 million total), about 35% came from Europe, 11% from Asia, 39% from Latin America, and the remaining 15% from Canada, Africa, Oceania, and other/unspecified origins; in the 2000s (roughly 10.3 million total), about 13% came from Europe, 34% from Asia, 41% from Latin America, and the remaining 12% from the same other-origin category. (a) Identify the most significant change in the regional composition of these admissions between the two periods. (b) Explain ONE specific legal cause of that change. (c) Identify ONE thing this specific table does NOT tell you about immigration to the United States in this period.',
      steps: [
        "SOURCE IT AND NOTE ITS SCOPE. This table counts only persons obtaining LAWFUL PERMANENT RESIDENT status (green cards) — it does not count temporary visa holders, refugees and asylees (who are sometimes tallied separately in DHS data), or the undocumented population. Any conclusion drawn from it applies to legal permanent immigration specifically, not immigration to the US as a whole.",
        "READ THE SHIFT. Europe's share fell by more than half, from 35% in the 1960s to 13% in the 2000s. Asia's share roughly tripled, from 11% to 34%. Latin America's share grew modestly in relative terms (39% to 41%) but, combined with Asia's growth, meant the two regions together went from a minority of admissions (50%) to a clear majority (75%) — a shift from a European-majority pattern to a Latin American/Asian-majority one.",
        'CONNECT TO THE LEGAL CAUSE. The Immigration and Nationality Act of 1965 abolished the national-origins quota system that had favored European immigration since the 1920s, replacing it with family-reunification and skills-based criteria. This legal change removed the structural preference for European immigrants — it is the specific legislative cause historians point to for why the compositional shift shown in this table became possible, even though the full shift took decades to fully appear.',
        "IDENTIFY WHAT THE TABLE DOES NOT SHOW. Because it counts only lawful permanent resident admissions, it says nothing directly about temporary (non-immigrant) visa holders, refugees and asylees processed through separate humanitarian channels, or the size or composition of the undocumented population — all of which are also part of the broader immigration story of this period but are not captured by this specific table.",
        'STATE THE LINK TO THE COURSE THESIS. The 1965 Act is a good example of a policy change whose full demographic effect was not immediate — the compositional shift this table documents took until the 2000s to fully register, illustrating how legal changes and their social effects can unfold on very different timescales.',
      ],
      answer:
        "The most significant change is a shift from a European-majority pattern of legal permanent immigration to one dominated by Latin America and Asia: Europe's share fell from 35% to 13% while Asia's share roughly tripled (11% to 34%), and Latin America and Asia together rose from half of admissions to about three-quarters. The specific legal cause is the Immigration and Nationality Act of 1965, which abolished the national-origins quota system that had favored European immigrants since the 1920s and replaced it with family-reunification and skills-based criteria, removing the structural preference for Europe that had shaped admissions for decades. This particular table does not show temporary visa holders, refugees and asylees processed through separate channels, or the undocumented population — it counts only lawful permanent resident admissions, so its findings should not be generalized to immigration as a whole.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE economic effect of trade liberalization (such as NAFTA) on the United States since 1980. (b) Briefly explain ONE specific piece of historical evidence that supports your answer to (a). (c) Briefly explain ONE demographic change in American society during this period and ONE cause of that change.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes ONE genuine economic effect of trade liberalization — e.g. expanded export markets and lower consumer prices, OR manufacturing job losses in specific US regions as production shifted abroad. Either the benefit or the critique earns full credit; no credit for a vague, unsupported claim.',
            modelResponse:
              'One economic effect of trade liberalization was job losses in US manufacturing regions, as NAFTA (effective 1994) and other trade agreements made it easier for companies to shift production to lower-wage locations abroad, contributing to deindustrialization especially in the Midwest and Northeast.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific piece of historical evidence connected clearly to the effect named in (a). No credit for evidence unconnected to the stated effect or too generic to verify.',
            modelResponse:
              'NAFTA removed most tariffs on trade among the US, Canada, and Mexico starting in 1994, and the "Rust Belt" region of the industrial Midwest and Northeast saw sustained manufacturing-employment decline in the years that followed, evidence historians and economists connect to the broader shift of production to lower-cost locations.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate demographic change and its cause — e.g. the shift toward a larger share of immigrants from Latin America and Asia, caused by the Immigration and Nationality Act of 1965 ending the national-origins quota system. No credit for a vague or unconnected demographic claim.',
            modelResponse:
              "One demographic change was a shift in the origin of legal immigrants toward Latin America and Asia and away from Europe, caused by the Immigration and Nationality Act of 1965, which abolished the national-origins quota system that had favored European immigration since the 1920s and replaced it with family-reunification and skills-based admission criteria.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-globalization-uniform',
      kind: 'misconception_check',
      question:
        'True or false: globalization and the trade/technology changes of this period affected all US regions and workers roughly the same way.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Treating a national-level economic trend (aggregate growth, expanded trade) as though its effects were evenly distributed, rather than recognizing that the same period produced very different outcomes depending on region, industry, and education level.',
          correctsTo:
            'FALSE. The effects of trade liberalization, deindustrialization, and technological change were highly UNEVEN. Regions with heavy manufacturing employment, especially in the industrial Midwest and Northeast ("Rust Belt"), experienced sustained job losses and slower recoveries, while other regions and the growing technology sector saw significant gains. By education level, workers without a college degree saw earnings grow much more slowly than highly educated or specialized workers over these decades — a gap economists attribute to a combination of automation, globalization, and declining unionization, not any single cause. Describing this period as a uniform national experience of growth (or of loss) erases the real regional and educational divergence that is central to understanding why the period\'s politics grew more contentious over economic policy.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'NAFTA (1994) and WTO membership (1995) lowered trade barriers — expanded exports/lower prices for some, manufacturing job losses in specific regions for others; both are recognized positions, not a settled verdict.',
        'Deindustrialization hit the "Rust Belt" hardest as part of a longer-term shift toward a service/information economy, not a single-decade event.',
        'The personal computer and the commercialized internet transformed communication, business, and daily life through the 1980s-90s.',
        'The Immigration Act of 1965 ended the national-origins quota system favoring Europe — the legal cause behind the shift toward Latin American/Asian-majority legal immigration visible by the 2000s (recall the table\'s scope: lawful permanent residents only).',
        "Clinton-era deficit reduction plus 1990s growth produced late-decade budget surpluses; 1996 welfare reform replaced open-ended cash assistance with time-limited, work-requirement state block grants — both changes remain historically debated.",
        'Rising inequality (widening gap between college-educated and non-college-educated worker earnings) is a multi-causal trend — technological change, globalization, and declining unionization together, not one single cause.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '9',
    cedTopic: '9.4-9.5',
    cedTitle: 'Globalization, Technology, and a Changing America',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-immigration-origins-table.v1',
        chapter: '1960s-2000s',
        note: 'Described data table (DHS/OHSS Yearbook of Immigration Statistics, Table 2) — lawful permanent resident admissions by region of origin; anchor for the concept and worked example.',
      },
    ],
  },
};
