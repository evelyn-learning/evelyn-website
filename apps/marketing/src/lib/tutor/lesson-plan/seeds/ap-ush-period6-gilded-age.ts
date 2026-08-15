/**
 * APUSH Period 6 — Gilded Age + Industrialization (1865-1898).
 *
 * Industrial growth, robber barons, immigration, urbanization, populism,
 * Western settlement + Native displacement. ~10-17% of exam.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_USH_PERIOD6_GILDED_AGE: LessonPlan = {
  id: 'evelyn.ap.ush.period6-gilded-age.v1',
  title: 'APUSH Period 6 — Gilded Age, Industrialization, Populism (1865-1898)',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.period6-gilded-age',
      description: 'Analyze the structural transformation of the US economy + society in 1865-1898: industrial concentration, immigration, urbanization, labor unrest, Western expansion + Native dispossession, and the Populist response.',
      standard: 'APUSH-6.1-6.13',
    },
  ],
  prerequisites: ['apush.reconstruction'],
  followUps: [],
  estimatedMinutes: 25,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Period 6 transformed America structurally.',
      script: 'In just three decades after the Civil War, the United States went from a mostly agrarian society to the world\'s largest industrial economy. The transformation was rapid, brutal, and uneven — the Gilded Age (Mark Twain\'s term, suggesting a thin gold layer over rotten metal) saw enormous wealth concentration alongside mass poverty, immigration on a scale never before seen, and the violent closing of the Western frontier. Get fluent here and Period 7\'s Progressive Era reactions become inevitable consequences.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-industrial-revolution',
      kind: 'concept',
      goal: 'Industrial growth + corporate consolidation.',
      keyIdeas: [
        'TRANSCONTINENTAL RAILROAD (1869): Promontory, Utah — Union Pacific (westward) + Central Pacific (eastward). Federal land grants + subsidies. Knit national market; transformed agriculture, time zones (railroads imposed standard time 1883), and Western settlement.',
        'STEEL: Bessemer process (1850s, popularized by Andrew Carnegie\'s US Steel). Cheap structural steel enabled skyscrapers, longer bridges, more rail. By 1900 US produced more steel than UK + Germany combined.',
        'OIL: Edwin Drake first commercial well (Pennsylvania 1859). John D. Rockefeller\'s STANDARD OIL (1870) used HORIZONTAL INTEGRATION (buying competitors) + railroad rebates to control 90% of US refining by 1880s.',
        'ELECTRICITY: Edison\'s incandescent bulb (1879), DC system. Tesla + Westinghouse\'s AC system won "war of currents" (1890s); enabled long-distance transmission. Electrification of cities + factories transformed daily life.',
        'CORPORATE FORMS: HORIZONTAL INTEGRATION (acquire competitors — Rockefeller). VERTICAL INTEGRATION (control supply chain end-to-end — Carnegie owned mines, ships, mills, distribution). TRUSTS (legal device combining multiple corporations under one board — Standard Oil 1882). HOLDING COMPANIES (parent owns shares of subsidiaries).',
        'MAJOR FIGURES: ANDREW CARNEGIE (steel; "Gospel of Wealth" essay 1889 — wealthy should live modestly + give philanthropically). JOHN D. ROCKEFELLER (oil; richest man in history adjusted for inflation). J.P. MORGAN (banking; bailed out US Treasury 1895; created US Steel 1901). CORNELIUS VANDERBILT (railroads + shipping).',
        'IDEOLOGY: SOCIAL DARWINISM (William Graham Sumner, applying Spencer\'s "survival of the fittest" to economy — justified inequality). LAISSEZ-FAIRE (government should not regulate). GOSPEL OF WEALTH (philanthropy by the rich justifies their wealth).',
        'GOVERNMENT RESPONSE: INTERSTATE COMMERCE ACT (1887) — first federal regulation of railroads. SHERMAN ANTITRUST ACT (1890) — banned "combinations in restraint of trade"; weakly enforced until Progressive Era.',
      ],
      vocabulary: [
        { term: 'horizontal integration', definition: 'business strategy of acquiring competitors in the same industry to gain market share + reduce competition (Standard Oil model).' },
        { term: 'vertical integration', definition: 'business strategy of controlling all stages of production from raw materials to distribution (Carnegie Steel model).' },
        { term: 'Gospel of Wealth', definition: 'Andrew Carnegie\'s 1889 essay arguing the wealthy have moral obligation to live modestly + give back via philanthropy.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-immigration-urban-labor',
      kind: 'concept',
      goal: 'Immigration, urbanization, labor unrest.',
      keyIdeas: [
        'IMMIGRATION: ~25 million arrived 1865-1915. Pre-1880 dominated by Northern Europe (German, Irish, British, Scandinavian — "OLD IMMIGRANTS"); post-1880 dominated by Southern + Eastern Europe (Italian, Polish, Russian-Jewish, Slavic — "NEW IMMIGRANTS") + Asian (Chinese in West).',
        'ELLIS ISLAND (NY, opened 1892): processed European immigrants on East Coast. ANGEL ISLAND (SF, 1910): processed Asian arrivals — much harsher detention.',
        'NATIVIST RESPONSE: anti-Catholic + anti-Jewish + anti-Asian sentiment. CHINESE EXCLUSION ACT (1882) — first federal law banning immigrants by NATIONALITY; renewed until 1943. American Protective Association (1887) anti-Catholic group.',
        'URBANIZATION: 1860 ~20% urban; 1920 ~50%. Cities exploded: NYC 1860 ~800K → 1900 ~3.4M. Chicago 1860 ~110K → 1900 ~1.7M.',
        'TENEMENTS: cramped multi-family housing in immigrant neighborhoods (Lower East Side NY). Jacob Riis\'s "How the Other Half Lives" (1890) photo-essay exposed conditions.',
        'POLITICAL MACHINES: urban patronage organizations exchanging services (jobs, housing assistance) for votes. TAMMANY HALL (NYC Democratic) under Boss William Tweed — corrupt but provided real services.',
        'LABOR ORGANIZING: KNIGHTS OF LABOR (Terence Powderly, peaked 1880s; included unskilled + women + Black workers; collapsed after Haymarket 1886). AMERICAN FEDERATION OF LABOR / AFL (Samuel Gompers, 1886; skilled craft unions; "bread-and-butter unionism" — wages + hours, not radical politics).',
        'KEY STRIKES: GREAT RAILROAD STRIKE 1877 (federal troops broke). HAYMARKET 1886 (Chicago anarchist bombing → labor movement set back, K of L blamed). HOMESTEAD 1892 (Carnegie\'s Frick crushed steelworkers using Pinkerton + state militia). PULLMAN 1894 (Eugene Debs led; federal injunction broke strike — In re Debs upheld federal authority).',
        'WORKING CONDITIONS: 60+ hour weeks, child labor common, no safety regulations, no compensation for injuries, immigrant wages below subsistence. Triangle Shirtwaist fire (1911) eventually catalyzed reform but post-Period 6.',
      ],
      vocabulary: [
        { term: 'new immigrants', definition: 'Southern + Eastern European migrants arriving 1880-1920; targeted by nativist sentiment + harder to assimilate per Anglo-American gatekeepers.' },
        { term: 'political machine', definition: 'urban patronage organization (e.g., Tammany Hall) exchanging social services for immigrant votes; corrupt but functional safety net.' },
        { term: 'AFL', definition: 'American Federation of Labor (1886, Gompers) — federation of skilled craft unions pursuing bread-and-butter goals; outlasted radical alternatives.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-west-populism',
      kind: 'concept',
      goal: 'Western settlement, Native dispossession, Populism.',
      keyIdeas: [
        'WESTERN MIGRATION: HOMESTEAD ACT (1862) — 160 acres free to settlers who improved land 5 years. Pacific Railroad Act, mining booms (Gold 1849 + 1859 Pikes Peak + 1874 Black Hills + 1896 Klondike). Cattle drives + open range (1865-1885). Barbed wire (1874) ended open range. By 1890 Census declared frontier "closed" — Frederick Jackson Turner\'s 1893 FRONTIER THESIS argued frontier had shaped American character.',
        'NATIVE DISPOSSESSION: continued post-Civil War with explicit federal policy. Treaties broken; reservations consolidated then reduced. Major military events: SAND CREEK MASSACRE (1864 CO), LITTLE BIGHORN (1876 — Custer killed by Lakota + Cheyenne under Sitting Bull + Crazy Horse), GHOST DANCE movement, WOUNDED KNEE MASSACRE (1890 SD — final major US Army action).',
        'DAWES SEVERALTY ACT (1887): broke up tribal land into individual 160-acre allotments, "surplus" sold to whites. Goal: ASSIMILATION. Effect: Native landholdings dropped from ~138 million acres to ~48 million by 1934. Catastrophic for tribal sovereignty.',
        'BISON SLAUGHTER: ~30 million pre-Civil War to ~1,000 by 1890s. Driven by hide hunters + railroad expansion + deliberate federal policy to undermine Plains Native economies.',
        'AGRICULTURE PROBLEMS: declining commodity prices (oversupply globally), high railroad freight rates, deflationary monetary policy (gold standard restricted money supply). Farmers squeezed.',
        'GRANGE MOVEMENT (1867): farmers\' organization, advocated cooperatives + state regulation of railroads. MUNN v. ILLINOIS (1877) upheld state regulation of grain elevators (later weakened by Wabash 1886).',
        'POPULIST/PEOPLE\'S PARTY (1892): emerged from Farmers\' Alliances. OMAHA PLATFORM (1892) demanded: free silver, graduated income tax, direct election of senators, secret ballot, 8-hour day, government ownership of railroads + telegraph + telephone, postal savings banks. Many planks adopted later.',
        'ELECTION OF 1896: William Jennings Bryan ("Cross of Gold" speech advocating free silver) Democratic+Populist nominee vs William McKinley (Republican, gold standard, business). McKinley won. Populist Party collapsed but agenda partly absorbed by Progressives.',
      ],
      vocabulary: [
        { term: 'Dawes Act', definition: '1887 law breaking tribal land into individual allotments; aimed at assimilation; reduced Native landholding by ~65% over decades.' },
        { term: 'Populism', definition: '1890s farmer-driven political movement (People\'s Party) demanding free silver, income tax, direct senate election, regulation of corporations.' },
        { term: 'Cross of Gold speech', definition: '1896 William Jennings Bryan address advocating free silver coinage; rhetorical highlight of Populist+Democratic fusion.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is the period 1865-1898 sometimes called "the Gilded Age" rather than "the Golden Age"?',
      expectedAnswer: 'Mark Twain coined "the Gilded Age" in his 1873 novel of the same name. GILDING means a thin layer of gold over base metal — applied to the era, it captured the SURFACE PROSPERITY (industrial wealth, new mansions, technological progress) hiding ROTTEN INTERIORS (mass poverty, child labor, political corruption, immigrant tenement misery, Native dispossession). The era saw immense wealth concentration in a few families while workers earned subsistence wages and ~10% of children worked in factories. The label is a critique, not a celebration. APUSH expects you to recognize this dual character — production + inequality, innovation + exploitation — when analyzing the period.',
      responseFormat: 'free',
      hints: [
        'Mark Twain\'s 1873 novel coined the phrase.',
        'Gilding = thin gold layer over base metal = surface vs reality.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-immigration-success',
      kind: 'misconception_check',
      question: 'Late-19th-century immigrants were uniformly welcomed, with most assimilating successfully into American society. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Romanticizing the "American melting pot."',
          correctsTo: 'False. Late-19th-century immigration was met with intense NATIVIST hostility, particularly toward "new immigrants" (Italians, Slavs, Jews, Greeks) and Asians. Chinese Exclusion Act (1882) was the FIRST federal immigration ban targeting a specific nationality — renewed repeatedly until 1943. Italian immigrants were often classified as racially distinct from "white"; lynchings of Italians occurred (New Orleans 1891). Catholic immigrants faced severe Protestant discrimination (American Protective Association). Eastern European Jews fleeing pogroms encountered antisemitism. The "melting pot" image papers over real ethnic conflict + segregated neighborhoods + generations-long assimilation friction. Many immigrants did succeed economically, but the path was not smooth, and many returned (return rates of 30-40% for Italians). APUSH expects nuance — discrimination was structural and routine, not exceptional.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Transcontinental RR 1869, Bessemer steel, oil/Standard Oil, electricity. Carnegie + Rockefeller + Morgan; Social Darwinism + Gospel of Wealth.',
        '~25M immigrants 1865-1915; "new immigrants" post-1880 from S/E Europe. Chinese Exclusion 1882. Tammany machines + Riis tenement exposés.',
        'Knights of Labor → AFL (Gompers). Strikes: 1877 RR, Haymarket 1886, Homestead 1892, Pullman 1894 — labor mostly lost.',
        'Western expansion: Homestead Act, RR. Native dispossession: Dawes 1887, Wounded Knee 1890. Frontier "closed" 1890.',
        'Populist Party 1892 Omaha Platform; Bryan "Cross of Gold" 1896 lost to McKinley.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why did the Populist Party collapse after 1896 even though many of its policy demands (income tax, direct election of senators, regulation of corporations) were later enacted?',
      hint: 'Populism\'s collapse came from FUSION + DEMOGRAPHIC LIMITS. By 1896 Bryan won the Democratic AND Populist nominations on a free-silver platform. When Bryan lost (electoral 271-176 to McKinley), the Populist Party lost its independent identity — its core platform planks were absorbed but its electoral coalition fractured. The deeper issue: Populists were primarily AGRARIAN — small farmers in the South + Plains. That coalition couldn\'t reach the URBAN INDUSTRIAL working class (whom Populists framed as different). Black Southerners faced Jim Crow disenfranchisement (Plessy 1896, white-supremacist constitutional rewrites in 1890s) that gutted potential biracial Southern Populism. By 1900 industrial growth had outpaced agriculture; the policy ideas survived but moved to the PROGRESSIVE coalition (urban middle class + later labor). APUSH often asks why the Populist platform succeeded ideologically but failed organizationally — exactly this distinction.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
