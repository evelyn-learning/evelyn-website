/**
 * AP World History: Modern — CED Unit 9.1-9.3: The Globalizing Economy.
 *
 * Follows the Unit-2 Vertical Slice's gold template (see
 * ap-apworld-u2-silk-roads.ts for the full rationale). First stop in Unit 9
 * (1900-present, Globalization): the postwar institutions and forces —
 * Bretton Woods, GATT/WTO, multinational supply chains, China's reform era,
 * the Asian Tigers, and periodic financial crises — that built an
 * increasingly interconnected global economy after 1945.
 *
 * Anchor text: a described data table combining world container-port
 * throughput and merchandise export value, 1980-2020 —
 * evelyn.passage.apworld-trade-container-table.v1 — wired in the concept
 * segment as quantitative evidence of the trade growth the concept
 * describes, and re-examined closely in the worked example.
 *
 * Deng Xiaoping is discussed only in authored description, with zero
 * quoted text, per the copyright/verbatim-source discipline (post-1928
 * figure). Globalization/inequality debates are presented as positions,
 * not resolved by the plan.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U9_GLOBAL_ECONOMY: LessonPlan = {
  id: 'evelyn.ap.apworld.global-economy.v1',
  title: 'U9.1-9.3 The Globalizing Economy',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.global-economy',
      description:
        'Explain how postwar institutions (Bretton Woods, GATT/WTO), multinational supply chains, and divergent national development paths (China\'s reform era, the Asian Tigers) built an increasingly interconnected global economy after 1945, including periodic financial crises and debates over globalization\'s costs and benefits.',
      standard: 'AP-APWORLD-9.1',
    },
  ],
  prerequisites: ['apworld.cold-war-global', 'apworld.end-cold-war'],
  followUps: ['apworld.technology-communication'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see "globalization" as a specific, datable set of institutions and choices, not a vague, inevitable force.',
      script:
        "It's tempting to talk about \"globalization\" like it's the weather — something that just happens to the world. But the postwar global economy was built, piece by piece, out of specific decisions: a 1944 conference that created new financial institutions, a 1947 trade agreement, national governments choosing to open (or not open) their economies, and container ships that made shipping a T-shirt across an ocean cheaper than trucking it across a state. Some of those choices paid off spectacularly. Some produced deep new inequalities. Today we're tracing how a genuinely interconnected world economy got built after 1945 — and why people still argue fiercely about whether it was worth it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-global-economy',
      kind: 'concept',
      goal: 'Explain the Bretton Woods system, GATT/WTO, multinational supply chains, China\'s reform era and the Asian Tigers, the 1997 and 2008 financial crises, and the debates over globalization\'s costs and benefits.',
      keyIdeas: [
        "BRETTON WOODS (1944): before World War II had even ended, Allied representatives meeting at Bretton Woods, New Hampshire, created new international financial institutions — the International Monetary Fund (IMF, to stabilize currency exchange and lend to countries in financial distress) and the World Bank (to fund postwar reconstruction and later development) — designed to prevent a repeat of the currency chaos and trade collapse of the 1930s.",
        "GATT (1947) TO WTO (1995): the General Agreement on Tariffs and Trade committed signatory countries to a series of negotiating rounds that progressively lowered tariffs and other trade barriers. In 1995, GATT was replaced by the World Trade Organization (WTO), a permanent institution with a formal dispute-resolution process — a shift from a temporary agreement to a standing body of global trade governance.",
        "MULTINATIONAL CORPORATIONS AND SUPPLY CHAINS: falling trade barriers, cheaper shipping (container ports handled a small fraction of today's volume as recently as 1980), and cheaper telecommunications let multinational corporations split production across many countries — designing a product in one country, sourcing components from several others, and assembling it in yet another — rather than manufacturing entirely within one national economy.",
        "CHINA'S REFORM ERA (FROM 1978): under Deng Xiaoping (described here, never quoted), China shifted from strict central planning toward market-oriented reforms and Special Economic Zones open to foreign investment, beginning in 1978. Over the following decades this reoriented China toward export manufacturing and produced historically rapid economic growth, integrating China deeply into global supply chains.",
        "THE ASIAN TIGERS: South Korea, Taiwan, Singapore, and Hong Kong pursued export-led industrialization from the 1960s onward — manufacturing for global markets rather than protecting domestic industry behind tariffs — and achieved rapid economic growth that made them a widely cited model of outward-looking development.",
        "PERIODIC CRISES REVEALED THE SYSTEM'S INTERCONNECTION: the 1997 Asian financial crisis began with currency collapses in Thailand and spread rapidly across East and Southeast Asian economies, showing how closely linked regional capital markets had become. The 2008 global financial crisis, triggered by a US mortgage-market collapse, spread to banks and economies worldwide within months — a stark demonstration that a crisis in one major economy could no longer stay contained to that economy alone.",
        "GLOBALIZATION DEBATED, NOT SETTLED: supporters point to falling global poverty rates, cheaper consumer goods, and rapid growth in previously poor regions (China, the Asian Tigers). Critics point to job losses in industries that faced new low-wage competition, rising inequality within many countries even as poverty fell between countries, and the vulnerability that interconnected financial systems created (1997, 2008). Both sets of claims are genuinely contested among economists and historians, not a settled verdict.",
      ],
      vocabulary: [
        {
          term: 'Bretton Woods System',
          definition:
            'the international financial institutions (the IMF and World Bank) created at a 1944 conference to stabilize currency exchange and fund postwar reconstruction and development, intended to prevent a repeat of the 1930s trade and currency collapse.',
        },
        {
          term: 'GATT / WTO',
          definition:
            'the General Agreement on Tariffs and Trade (1947), a series of rounds progressively lowering trade barriers, replaced in 1995 by the World Trade Organization (WTO), a permanent institution with a formal dispute-resolution process.',
        },
        {
          term: 'Asian Tigers',
          definition:
            'South Korea, Taiwan, Singapore, and Hong Kong — economies that pursued export-led industrialization from the 1960s onward and achieved rapid growth manufacturing for global markets rather than protecting domestic industry.',
        },
        {
          term: 'multinational corporation (MNC)',
          definition:
            'a company that splits production across multiple countries — design, component sourcing, and assembly in different national economies — made practical by falling trade barriers and cheaper shipping and telecommunications.',
        },
      ],
      passageId: 'evelyn.passage.apworld-trade-container-table.v1',
      estimatedMinutes: 7,
    },
    {
      id: 'worked-trade-container-table',
      kind: 'worked_example',
      problem:
        'Analyze this data table: world container port throughput (a physical-volume measure) rose from about 36 million TEU in 1980 to about 792 million TEU in 2020 — roughly a twenty-two-fold increase. Over the same span, world merchandise exports, measured in current (not inflation-adjusted) US dollars, rose from about $2.0 trillion to about $17.7 trillion — roughly a nine-fold increase, with the dollar figure flattening somewhat after 2010 even as container volume kept climbing. Which indicator more reliably shows how much the PHYSICAL volume of world trade actually grew, and why does the other indicator understate that growth after 2010?',
      steps: [
        'SOURCE IT FIRST. This is a data table combining two different kinds of measurement of world trade at the same four points in time (1980, 2000, 2010, 2020) — one tracking physical cargo volume, the other tracking the dollar value of exported goods.',
        'IDENTIFY WHAT EACH INDICATOR ACTUALLY MEASURES. Container port throughput counts physical units of cargo (twenty-foot-equivalent units, TEU) handled at ports — a measure unaffected by prices. Merchandise export value in current dollars mixes together the physical quantity of goods traded AND whatever commodity prices and currency exchange rates happened to be in that year.',
        'IDENTIFY THE INDICATOR THAT MORE RELIABLY SHOWS PHYSICAL GROWTH. Container throughput is the more reliable indicator of physical trade growth, because it is not distorted by price or currency changes — its twenty-two-fold rise reflects an actual, comparable increase in the volume of goods physically shipped.',
        'EXPLAIN WHY THE DOLLAR FIGURE UNDERSTATES GROWTH AFTER 2010. The nominal export-value figure flattens somewhat after 2010 because falling commodity prices and exchange-rate effects held down the dollar total in those years, even though the physical volume of goods shipped kept climbing — the price/currency component of the dollar figure was working against the underlying volume growth in that period.',
        'STATE THE LINK TO THE COURSE THESIS. The two measures together show a system that grew in the volume of things actually shipped (evidence of a genuinely more interconnected physical economy) far more consistently than the dollar-value figures alone would suggest — exactly the kind of nuance a document-based question expects a student to draw from a quantitative source rather than reading only its headline trend.',
      ],
      answer:
        'Container port throughput is the more reliable indicator of how much world trade actually grew in physical terms, because it counts units of cargo (TEU) handled at ports and is unaffected by prices — its rise from about 36 million to about 792 million TEU (roughly twenty-two-fold) reflects a real, comparable increase in the physical volume of goods shipped. World merchandise export value in current dollars, by contrast, mixes real volume growth together with whatever commodity prices and exchange rates happened to be in a given year; that is why its nine-fold rise flattens somewhat after 2010 — falling commodity prices and currency effects held down the dollar total even as the physical volume of goods shipped kept climbing. Reading the dollar figure alone would understate how much world trade actually grew after 2010; the container-volume figure corrects for that limitation.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE postwar international institution created to manage the global economy. (b) Explain ONE way a specific national economy (China\'s reform era OR an Asian Tiger) pursued export-oriented growth after 1945. (c) Explain ONE way a financial crisis (1997 OR 2008) revealed how interconnected the global economy had become.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies a genuine postwar international economic institution — e.g. the IMF, the World Bank, GATT, or the WTO. No credit for a vague statement ("an international group") with no specific institution named.',
            modelResponse:
              'One institution was the International Monetary Fund (IMF), created at the 1944 Bretton Woods conference to stabilize currency exchange and lend to countries facing financial distress.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate example of export-oriented growth — e.g. China's post-1978 market reforms and Special Economic Zones under Deng Xiaoping, or an Asian Tiger's (South Korea, Taiwan, Singapore, Hong Kong) export-led industrialization. No credit for a vague or unconnected example.",
            modelResponse:
              "South Korea pursued export-led industrialization from the 1960s onward, building manufacturing industries oriented toward global markets rather than protecting domestic industry behind tariffs, which contributed to its rapid postwar economic growth.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way a named crisis revealed global economic interconnection — e.g. the 1997 Asian financial crisis spreading from Thailand across the region, or the 2008 crisis spreading from a US mortgage-market collapse to banks worldwide. No credit for a vague or unsupported claim.',
            modelResponse:
              'The 2008 global financial crisis began with a collapse in the US mortgage market but spread to banks and economies worldwide within months, showing that a crisis originating in one major economy could no longer stay contained to that economy alone.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-globalization-westernization',
      kind: 'misconception_check',
      question:
        'True or false: economic globalization after 1945 mainly meant Western capital and goods flowing outward into the rest of the world, with production and investment moving in essentially one direction.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming globalization is a one-directional process where Western economies simply export capital and goods to everywhere else, rather than a multidirectional system of supply chains and capital flows.',
          correctsTo:
            "FALSE. Multinational supply chains, capital, and manufacturing moved in MULTIPLE directions, not just outward from the West. China's post-1978 reforms turned it into a major exporter TO the West and elsewhere; the Asian Tigers built export industries that reshaped global manufacturing; and by the 2000s, capital, components, and finished goods were flowing among Asian, European, American, and other economies in complex, multidirectional supply chains — not along a single Western-to-everywhere-else path. Treating globalization as only Westernization erases the degree to which non-Western economies became major producers, exporters, and sources of investment in their own right.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Bretton Woods conference (1944) created the IMF and World Bank before World War II had even ended, aiming to prevent a repeat of 1930s currency and trade chaos.',
        'GATT (1947) progressively lowered trade barriers through negotiating rounds; it was replaced by the permanent WTO in 1995.',
        "China's reform era (from 1978, under Deng Xiaoping) and the Asian Tigers' export-led industrialization (from the 1960s) both integrated major Asian economies deeply into global supply chains.",
        'The 1997 Asian financial crisis and the 2008 global financial crisis each showed how quickly a shock in one economy could spread across an interconnected global financial system.',
        "Globalization's costs and benefits are genuinely debated, not settled: falling global poverty and cheaper goods on one side, job losses and rising within-country inequality on the other.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '9',
    cedTopic: '9.1-9.3',
    cedTitle: 'The Globalizing Economy',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-trade-container-table.v1',
        chapter: '1980-2020',
        note: 'World container-throughput and merchandise-export data table — anchor document for physical vs. nominal-dollar trade growth.',
      },
    ],
  },
};
