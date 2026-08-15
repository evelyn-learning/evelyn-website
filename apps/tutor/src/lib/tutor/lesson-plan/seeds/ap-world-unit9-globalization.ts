/**
 * AP World History — Unit 9: Globalization (1900-Present).
 *
 * Post-1991 world: tech revolution, climate, terrorism, China's rise,
 * pandemics, migration. The unit students often skip — but it appears in DBQs.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_WORLD_UNIT9_GLOBALIZATION: LessonPlan = {
  id: 'evelyn.ap.world.unit9-globalization.v1',
  title: 'AP World — Unit 9: Globalization (1900-Present)',
  curriculum: 'NCSS',
  grade: '11',
  subject: 'ss',
  topic: 'world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.unit9-globalization',
      description: 'Analyze the technological, economic, environmental, and cultural transformations of the late-20th and early-21st century, including digital revolution, neoliberal globalization, climate change, terrorism, and pandemics.',
      standard: 'AP-WORLD-9.1-9.7',
    },
  ],
  prerequisites: ['apworld.cold-war'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Unit 9 is small-weight but high-DBQ-relevance.',
      script: 'Unit 9 covers everything from 1900 to today, but heavy weight is on the post-1991 globalization era. Many students skip it because the AP exam treats it lightly in MCQs — but DBQs and LEQs that span "20th century" almost always anchor in this unit. Get fluent with the major economic, technological, and environmental shifts and you\'ll handle long-arc questions cleanly.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-economic-tech',
      kind: 'concept',
      goal: 'Neoliberal globalization + digital revolution.',
      keyIdeas: [
        'NEOLIBERALISM: late-20th-century economic policy framework — free trade, deregulation, privatization, capital mobility, reduced welfare state. Margaret Thatcher (UK 1979), Ronald Reagan (US 1981), Deng Xiaoping (China 1978 reform) marked global pivot.',
        'WASHINGTON CONSENSUS: package of neoliberal policies promoted by IMF + World Bank + US Treasury for developing countries — "structural adjustment programs."',
        'WTO (1995, replaced GATT): negotiated tariff reductions; admitted China 2001. Critics (anti-globalization protests, Seattle 1999) attacked labor + environmental disregard.',
        'NAFTA (1994): US-Canada-Mexico free trade. EU single market (1993, Maastricht Treaty). ASEAN economic integration. Regional blocs accelerate.',
        'CHINA\'S RISE: Deng\'s "Reform and Opening" 1978 → Special Economic Zones (Shenzhen) → joined WTO 2001 → world\'s 2nd largest economy by 2010, surpassed US in some measures by 2020s. Lifted ~800 million out of poverty.',
        'INDIA: 1991 economic liberalization (Narasimha Rao + Manmohan Singh) opened economy after decades of import-substitution. IT services boom (Bangalore, Hyderabad).',
        'DIGITAL REVOLUTION: personal computers (1980s), internet (popularized 1990s), mobile phones (2000s), smartphones + social media (2007 iPhone, Facebook 2004), AI (2020s). Compressed information flow.',
        'GREEN REVOLUTION (1960s-70s): high-yield wheat + rice varieties (Norman Borlaug) plus fertilizer + irrigation expanded global food supply, especially India + Mexico. Reduced famine but introduced ecological + inequality issues.',
        'CONTAINER SHIPPING (popularized 1960s+): standardized 20-foot containers slashed shipping costs ~90% over decades; foundation of modern global supply chains.',
      ],
      vocabulary: [
        { term: 'neoliberalism', definition: 'late-20th-century economic doctrine emphasizing free markets, deregulation, privatization, and reduced state economic role.' },
        { term: 'Washington Consensus', definition: 'package of neoliberal reforms (1989 Williamson) prescribed by IMF/World Bank for developing economies.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-environment-conflict',
      kind: 'concept',
      goal: 'Climate change, terrorism, migration, pandemics.',
      keyIdeas: [
        'CLIMATE CHANGE: anthropogenic global warming from CO₂ + methane emissions. Paris Agreement (2015) — voluntary national pledges to limit warming to 1.5-2°C. UN IPCC reports synthesize science.',
        'INDUSTRIAL EMISSIONS HISTORY: cumulative emissions concentrated in industrialized West (US, EU, Japan); China now largest annual emitter; debates over historic vs current responsibility.',
        'OZONE LAYER: chlorofluorocarbon (CFC)-driven depletion identified 1970s-80s; Montreal Protocol (1987) phased out CFCs — successful international environmental treaty, often contrasted with climate negotiations.',
        'OIL POLITICS: OPEC (1960) coordinates production; 1973 oil embargo against US/West for supporting Israel triggered global recession + reshaped energy politics. Persian Gulf wars (1991, 2003) tied to oil.',
        'TERRORISM: late-20th to 21st-century evolution of NON-STATE violence. Al-Qaeda (1988), 9/11 attacks (2001) on US, "War on Terror" (Afghanistan 2001-2021, Iraq 2003-2011). Rise of ISIS (2014-2017) in Syria/Iraq vacuum.',
        'MIGRATION FLOWS: rural-to-urban globally (urbanization crossed 50% in 2007), South-to-North economic migration (North Africa to EU, Mexico to US), refugee crises (Syrian war 2011+, Ukraine 2022+). Global diaspora communities.',
        'PANDEMICS: HIV/AIDS (1980s-present, ~40M dead, esp. Sub-Saharan Africa). SARS (2003). Ebola West Africa (2014-16). COVID-19 (2020-2022) — first true global mass-quarantine pandemic in modern history; ~7M+ deaths reported, massive economic disruption, vaccine + supply-chain reorganization.',
        'ANTI-GLOBALIZATION + POPULISM: 2008 financial crisis (US subprime → global recession) eroded faith in neoliberalism. Rise of populist movements: Brexit (2016), Trump (2016), Modi (India 2014), Bolsonaro (Brazil), Le Pen (France) — varied but often anti-immigrant, anti-trade, anti-establishment.',
      ],
      vocabulary: [
        { term: 'Paris Agreement', definition: '2015 UN climate treaty with voluntary national emissions pledges aiming to limit warming to 1.5-2°C.' },
        { term: 'War on Terror', definition: 'US-led international campaign post-9/11 (2001) including invasions of Afghanistan + Iraq and global counter-terror operations.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'concept-cultural-identity',
      kind: 'concept',
      goal: 'Cultural globalization + reactive identity politics.',
      keyIdeas: [
        'CULTURAL HOMOGENIZATION: global brands (McDonald\'s, Coca-Cola, Nike, Apple), Hollywood, English as global lingua franca. "McDonaldization" thesis (George Ritzer) — Western efficiency-rationalization spreading.',
        'GLOCALIZATION: global products adapted to local contexts (McDonald\'s in India sells McAloo Tikki, no beef). Counter-claim that globalization isn\'t pure Western imposition.',
        'SOFT POWER (Joseph Nye, 1990): cultural + ideological influence as form of national power. Hollywood + Silicon Valley as US soft power; K-pop + K-drama as South Korean soft power post-2010s; Bollywood for India.',
        'RELIGIOUS REVIVAL: contrary to mid-20th-century secularization predictions, religion grew in many regions late 20th century. Evangelical Christianity exploded in Latin America + Africa + South Korea. Political Islam (Iranian Revolution 1979, Afghanistan, Saudi state Wahhabism). Hindu nationalism in India (BJP). Israel/Palestine conflict religion-tied.',
        'WOMEN\'S RIGHTS: global expansion of legal rights, education, workforce participation. Persistent gaps (gender wage, political representation). Post-2017 #MeToo movement amplified by social media.',
        'LGBTQ+ RIGHTS: dramatic Western legal expansion (US Obergefell 2015), uneven globally — criminalization persists in many states.',
        'DECOLONIZATION OF KNOWLEDGE: post-2000s movements to revise university curricula + museums (e.g., African artifact repatriation debates).',
        'INDIGENOUS RIGHTS movements: UN Declaration on the Rights of Indigenous Peoples (2007); Amazon land defenders; climate justice intersection.',
      ],
      vocabulary: [
        { term: 'soft power', definition: 'a state\'s ability to influence others through cultural appeal, ideology, and example rather than coercion (Nye, 1990).' },
        { term: 'glocalization', definition: 'the adaptation of global products and ideas to local cultural contexts; counter-thesis to pure cultural homogenization.' },
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why is the post-1991 period sometimes called "the second great age of globalization" (the first being roughly 1870-1914)?',
      expectedAnswer: 'Both periods featured rapid declines in transport + communication costs, dramatic increases in cross-border trade and capital flows, and large-scale migration. 1870-1914: steamships + telegraph + gold standard + free-trade policies; collapse came with WWI + protectionism. 1991-onward: containerization + internet + neoliberal trade rules + WTO + capital mobility. Both eras were driven by political-economy ENABLERS (free-trade ideology, hegemonic power = Britain then, US now). Both saw RISING INEQUALITY within nations even as cross-border flows expanded. Critics argue the 2008 crisis + 2016 populism may mark the end of the second era, just as 1914 ended the first. Useful AP framing for "continuity and change" essays.',
      responseFormat: 'free',
      hints: [
        '1870-1914 had steamships + telegraph; 1991+ has containerization + internet.',
        'Both ended (or may end) with political backlash to inequality + foreign competition.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-globalization-irreversible',
      kind: 'misconception_check',
      question: 'Globalization is an irreversible historical trend — once integrated, economies stay integrated. True or false?',
      commonErrors: [
        {
          answer: 'true',
          misconception: 'Treating globalization as a one-way ratchet.',
          correctsTo: 'False. The 1870-1914 globalization era ENDED. WWI + interwar protectionism + Great Depression + WWII collapsed cross-border integration for 30+ years. By 1945, world trade as a share of GDP was BELOW 1913 levels and didn\'t recover until the 1970s. The post-1991 era has shown signs of REVERSAL too: 2008 financial crisis stalled integration; 2016+ populism + tariffs (US-China trade war 2018+); COVID-19 disrupted supply chains; Russia\'s invasion of Ukraine (2022) triggered sanctions decoupling. AP often uses this as a CCOT (continuity and change over time) test — globalization is a CYCLE, not a one-way trend. Knowing this is what separates a 4 from a 5.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Neoliberalism (Thatcher/Reagan/Deng late 1970s+) → free trade + privatization + WTO 1995.',
        'China and India liberalized economies (1978/1991); China surpassed Japan, neared US.',
        'Digital revolution: PC → internet → smartphone → AI; container shipping enabled physical globalization.',
        'Climate change (Paris 2015), terrorism (9/11 + War on Terror), pandemics (COVID-19 2020+).',
        'Globalization is reversible — 1914 collapse + 2016+ populism + 2020 pandemic = signs of cyclical change.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Why is the COVID-19 pandemic likely to be a major focus of AP DBQs in coming years even though it falls in Unit 9 (which is normally lightly tested)?',
      hint: 'COVID-19 will likely be a "DBQ magnet" because (1) it generated massive PRIMARY DOCUMENTS suitable for DBQ format (government statements, health agency reports, economic data, photographs); (2) it intersects EVERY major Unit 9 theme — globalization (supply chain disruption), technology (vaccine mRNA platform, telehealth, remote work), state capacity (varied responses), inequality (poor + minority populations hardest hit), climate intersection (zoonotic spillover); (3) it offers strong CCOT material — comparison to 1918 flu, Black Death, smallpox eradication; (4) it visibly affected almost every test-taker\'s lifetime, making it pedagogically engaging. Expect to see prompts asking about state-society relations during pandemics, or globalization\'s vulnerabilities to disease, with DBQ documents drawn from 2020-22 sources. Knowing the multidimensional impacts (not just deaths but also economic, technological, political) puts you ahead.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
