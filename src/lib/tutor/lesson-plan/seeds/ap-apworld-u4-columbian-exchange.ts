/**
 * AP World History: Modern — CED Unit 4.3: The Columbian Exchange.
 *
 * Unit-4 fan-out content plan, second in the within-unit chain
 * (maritime-exploration → columbian-exchange-global → maritime-empires →
 * atlantic-slave-trade → resistance-accommodation). concept = the historical
 * argument (how did biological exchange between the Americas and
 * Afro-Eurasia reshape demography and diet on every continent, and how did
 * the silver trade extend that exchange all the way to East Asia?);
 * worked_example = annotated reading of a described data table; try_yourself
 * = a 3-point SAQ-style short-answer.
 *
 * Anchor stimulus: a described data table of registered silver output for
 * Spanish America and Potosí, and the estimated share reaching Asia —
 * evelyn.passage.apworld-potosi-silver-table.v1. Figures used below are
 * exactly as stated in that seeded description (1550-1800 total; 1574-1735
 * Potosí city figure; 30-40% range to China) — do not substitute other
 * years or a single-point China-share figure.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U4_COLUMBIAN_EXCHANGE: LessonPlan = {
  id: 'evelyn.ap.apworld.columbian-exchange-global.v1',
  title: 'U4.3 The Columbian Exchange',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.columbian-exchange-global',
      description:
        'Explain the causes and global effects of the Columbian Exchange, including the transfer of crops, animals, and disease between the Americas and Afro-Eurasia, the demographic collapse of Indigenous American populations, and the silver trade linking Spanish America to Ming China.',
      standard: 'AP-APWORLD-4.3',
    },
  ],
  prerequisites: ['apworld.maritime-exploration'],
  followUps: ['apworld.maritime-empires'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the Columbian Exchange as a genuinely global, multi-continent event rather than an Atlantic-only transfer of a few crops.',
      script:
        "Picture a plate of food that feels deeply, unmistakably Italian: tomato sauce over pasta. Now picture Irish stew without the potato, or Sichuan cooking without the chili pepper. None of those crops existed anywhere in Afro-Eurasia before 1492 — every one of them came from the Americas. And it didn't only run one direction: American societies had never seen a horse, a pig, smallpox, or wheat before Europeans arrived, and the ecological shock of those arrivals reshaped an entire hemisphere's population within a century. This exchange didn't stop at the Atlantic, either — the same silver that Spain mined out of the Andes ended up, in enormous quantities, in the pockets of Chinese tax collectors on the other side of the planet. That's the scale we're working with in this unit.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-columbian-exchange',
      kind: 'concept',
      goal: 'Explain the biological transfers, demographic effects, and silver-driven global economic links of the Columbian Exchange.',
      keyIdeas: [
        'CROPS MOVED IN BOTH DIRECTIONS: American crops — maize, the potato, tomatoes, cacao, and others — spread across Afro-Eurasia after 1492, while Afro-Eurasian crops (wheat, sugar cane, rice) and domesticated animals (horses, cattle, pigs, sheep) spread into the Americas, none of which had existed there before.',
        "DEMOGRAPHIC CATASTROPHE IN THE AMERICAS: Indigenous American populations had no prior exposure and thus no acquired immunity to Afro-Eurasian diseases such as smallpox and measles, which arrived alongside European colonizers. The resulting epidemics killed the large majority of Indigenous people across the Americas within the century after contact — the deadliest demographic collapse associated with the encounter, and the central reason Spanish colonizers increasingly turned to imported enslaved African labor.",
        'POPULATION GROWTH ELSEWHERE: the same exchange that devastated the Americas fed population growth across Afro-Eurasia. High-calorie, adaptable American crops — especially maize and the potato — could be grown on marginal land unsuited to traditional Afro-Eurasian staples, expanding the food supply and contributing to population booms in places like China and parts of Europe.',
        'THE SILVER CIRCUIT LINKED THE EXCHANGE TO ASIA: massive silver deposits at Potosí (in present-day Bolivia, mined from 1545) made Spanish America the dominant source of world silver for two and a half centuries. That silver moved in two directions: across the Atlantic to Spain, and, via the Manila galleon route established in 1571, across the Pacific to China — where the Ming state was converting its tax system to require payment in silver (the mid-1500s Single Whip reform), creating enormous, sustained Chinese demand that pulled American silver eastward.',
        "ECONOMIC CONSEQUENCES OF THE SILVER FLOOD: the sheer volume of American silver entering circulation drove sustained price inflation in Spain (often called the Price Revolution) as the money supply grew faster than the supply of goods, and the effects of that silver-driven inflation were felt as far as Ottoman lands, whose economies were also linked into the same expanding monetary networks.",
        "THE COLUMBIAN EXCHANGE WAS NOT ATLANTIC-ONLY: because American silver was pulled across the Pacific to meet Ming China's tax-driven demand, the Columbian Exchange's economic consequences reached East Asia just as directly as they reached Western Europe — a genuinely global, not merely Atlantic, phenomenon.",
      ],
      vocabulary: [
        {
          term: 'Columbian Exchange',
          definition:
            'the transfer of crops, animals, diseases, and people between the Americas and Afro-Eurasia following 1492 contact, with effects on demography, diet, and economies on every continent involved.',
        },
        {
          term: 'Potosí',
          definition:
            'a massive silver-mining district (in present-day Bolivia), worked from 1545, whose registered output made Spanish America the dominant source of world silver for two and a half centuries.',
        },
        {
          term: 'Manila galleon',
          definition:
            'the Spanish trans-Pacific shipping route, established in 1571, that carried American silver from Acapulco to Manila for exchange into the Chinese economy.',
        },
      ],
      passageId: 'evelyn.passage.apworld-potosi-silver-table.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-potosi-silver-table',
      kind: 'worked_example',
      problem:
        'Analyze this data table description: total registered silver production across Spanish America, 1550-1800, was approximately 136,000 metric tons, on the order of 80 percent of the world\'s documented silver output over that span; within that total, approximately 18,000 metric tons over 1574-1735 is attributed to Potosí city; and historians estimate that somewhere between 30 and 40 percent of all American silver production, cumulatively, flowed onward to China, chiefly via the Manila galleon route established in 1571. What does this table reveal about the global reach of the silver trade, and how should a careful reader treat the 30-40 percent estimate?',
      steps: [
        'SOURCE IT FIRST. This is a described data table synthesizing published silver-production scholarship (registries and historical estimates), not a single eyewitness account — the task is to read what the compiled numbers show, not to evaluate a personal narrator\'s bias.',
        'IDENTIFY THE SCALE. Spanish America produced roughly 136,000 metric tons of silver, 1550-1800 — on the order of 80 percent of the world\'s documented output — with Potosí city alone contributing roughly 18,000 metric tons of that total over 1574-1735, confirming Potosí\'s central place within a hemispheric-scale industry.',
        'READ THE RANGE AS A RANGE, NOT A POINT ESTIMATE. The 30-40 percent figure for silver reaching China is explicitly presented as a range because published scholarly estimates genuinely diverge; a careful reader states it as "roughly a third to two-fifths," not as a single false-precise number like "35 percent."',
        "CONNECT TO THE CONCEPT'S GLOBAL CLAIM. A minority-but-substantial share of American silver — not a negligible trickle — moved across the Pacific specifically because Ming China's tax system had begun demanding payment in silver, showing that the Columbian Exchange's economic consequences reached East Asia by the same mechanism (the silver trade) that reached Spain.",
        'STATE THE LINK TO THE COURSE THESIS. The table is direct quantitative evidence against treating the Columbian Exchange as an Atlantic-only story: the same silver circuit that fueled Spanish price inflation also fed a documented, though appropriately range-bound, flow of silver into the Chinese economy.',
      ],
      answer:
        'The table shows Spanish America dominating world silver output — roughly 136,000 metric tons from 1550-1800, about 80 percent of documented world production — with Potosí city alone contributing roughly 18,000 metric tons of that total over 1574-1735. Because the 30-40 percent estimate for silver reaching China is presented as a range (reflecting genuine disagreement among historians), a careful reader states it as "roughly a third to two-fifths" rather than picking one false-precise number. That range still shows a substantial, not negligible, share of American silver moving across the Pacific via the Manila galleon route (established 1571) to meet Ming China\'s silver-based tax demand — direct quantitative evidence that the Columbian Exchange\'s economic reach extended well past the Atlantic world into East Asia.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE crop or disease that moved between the Americas and Afro-Eurasia as part of the Columbian Exchange. (b) Explain ONE effect of American silver on Ming China\'s economy. (c) Explain ONE effect of American silver on Spain\'s economy.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine item transferred as part of the Columbian Exchange, in the correct direction (e.g. maize/potato/tomato from the Americas, or smallpox/wheat/horses from Afro-Eurasia). No credit for a vague or directionally incorrect item.',
            modelResponse:
              'One item that moved as part of the Columbian Exchange was the potato, which spread from the Americas into Afro-Eurasia after 1492.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate effect of American silver on Ming China's economy — e.g. meeting the demand created by the Single Whip tax reform's requirement of silver payment, or being drawn in via the Manila galleon trade. No credit for a vague or unconnected claim.",
            modelResponse:
              "American silver, carried across the Pacific via the Manila galleon route established in 1571, met the enormous demand created by the Ming state's mid-1500s tax reform requiring taxes to be paid in silver, drawing a substantial share of world silver output into the Chinese economy.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate effect of American silver on Spain\'s economy — e.g. sustained price inflation (the Price Revolution) as the money supply grew faster than the supply of goods. No credit for a vague or unsupported claim.',
            modelResponse:
              "The massive influx of American silver into Spain drove sustained price inflation, sometimes called the Price Revolution, as the money supply grew faster than the underlying supply of goods.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-atlantic-only',
      kind: 'misconception_check',
      question:
        'True or false: the Columbian Exchange was essentially an Atlantic-only affair, transferring crops, diseases, and people only between the Americas and Western Europe/Africa.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Treating the Columbian Exchange as bounded by the Atlantic world, because the initial 1492 contact and the worst demographic effects were Atlantic-facing, and overlooking the silver trade\'s Pacific leg.',
          correctsTo:
            "FALSE. While the initial biological transfer (crops, disease, people) was Atlantic-facing, the Columbian Exchange's economic consequences reached East Asia through the silver trade: Potosí silver moved not only across the Atlantic to Spain but also across the Pacific via the Manila galleon route (established 1571) to meet Ming China's silver-based tax demand, with historians estimating that roughly 30-40 percent of all American silver production eventually flowed to China. The exchange's reach was genuinely global, not confined to the Atlantic.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Crops moved both directions: American crops (maize, potato, tomato, cacao) into Afro-Eurasia; Afro-Eurasian crops and animals (wheat, sugar, horses, cattle, pigs) into the Americas.',
        "Disease — especially smallpox — caused a demographic catastrophe among Indigenous Americans, who had no prior immunity, killing the large majority of the Indigenous population within a century of contact.",
        'American crops like maize and the potato helped fuel population growth across Afro-Eurasia, especially in China.',
        "Potosí silver (mined from 1545) moved both across the Atlantic to Spain (driving price inflation there) and across the Pacific, via the Manila galleon route (established 1571), to meet Ming China's silver-based tax demand.",
        'The Columbian Exchange was genuinely global, not Atlantic-only — the silver circuit tied Spanish America directly to the Chinese economy.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.3',
    cedTitle: 'The Columbian Exchange',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-potosi-silver-table.v1',
        chapter: '1550-1800',
        note: 'Registered Silver Output, Potosí and Spanish America (data table) — anchor described data table for the global silver circuit.',
      },
    ],
  },
};
