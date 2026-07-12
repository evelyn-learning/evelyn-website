/**
 * AP World History: Modern — CED Unit 6.7: Global Migration in the Age of
 * Empire.
 *
 * Follows the Silk Roads calibration template
 * (`ap-apworld-u2-silk-roads.ts`). concept = the historical argument
 * (post-abolition labor demand, industrialization, and empire together
 * produced several DISTINCT large-scale migration streams in 1750-1900,
 * not one uniform pattern); worked_example = reading a described data
 * table; try_yourself = a 3-point SAQ-style short-answer.
 *
 * Anchor stimulus: described data table of Indian indentured emigration by
 * destination, 1834-1917 — evelyn.passage.apworld-indenture-table.v1. This
 * table covers INDIAN indenture only (six destinations, 1,089,129 total);
 * Chinese indenture and transatlantic European migration are described
 * here as separate, real migration streams, but WITHOUT borrowing any
 * figures from this table.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U6_GLOBAL_MIGRATION: LessonPlan = {
  id: 'evelyn.ap.apworld.global-migration.v1',
  title: 'U6.7 Global Migration in the Age of Empire',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.global-migration',
      description:
        'Explain how post-abolition labor demand, industrialization, and empire together produced the era\'s major migration streams — Indian and Chinese indenture, transatlantic European migration, and global urbanization — and their social consequences, 1750-1900.',
      standard: 'AP-APWORLD-6.7',
    },
  ],
  prerequisites: ['apworld.economic-imperialism'],
  followUps: ['apworld.reform-responses'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Establish that 19th-century migration was not one story but several distinct, simultaneous streams driven by different causes.',
      script:
        "When people picture 19th-century migration, the image that usually comes to mind is European families crossing the Atlantic to a new life. That happened, on a huge scale — but it is only one thread. In the very same decades, over a million people left India under labor contracts to work on sugar plantations from the Caribbean to the Indian Ocean. Hundreds of thousands of Chinese laborers moved abroad through their own separate migration networks. And within countries, rural populations poured into fast-growing industrial cities. These were not the same migration, for the same reasons, under the same conditions — and treating them as one undifferentiated wave of \"migration\" misses exactly what the AP exam wants you to be able to distinguish.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-global-migration',
      kind: 'concept',
      goal: "Explain indenture as a post-abolition labor regime, distinguish Indian indenture, the Chinese diaspora, and transatlantic European migration as distinct streams, and explain migration's urbanization and social consequences (remittances, ethnic enclaves, nativist backlash).",
      keyIdeas: [
        'INDENTURE emerged as a labor regime specifically to fill the gap left by the ABOLITION of slavery across the British Empire (1833-34): plantation economies that had depended on enslaved labor needed a new large-scale, coercible workforce, and turned to INDENTURED SERVITUDE — workers, overwhelmingly recruited in India, signed multi-year contracts (often under conditions of limited real choice, given poverty and recruiting practices back home) binding them to work for a specific employer, frequently on sugar plantations, in exchange for passage, wages, and eventual return passage.',
        'INDIAN INDENTURE sent workers to destinations across the British Empire from 1834 into the early 20th century: sugar colonies in the Caribbean (British Guiana, Trinidad, Jamaica), the Indian Ocean (Mauritius), and settler colonies like Natal (South Africa) and Fiji. Conditions were frequently harsh — long hours, restrictive contracts, and limited legal protection — and historians have described the system as, in practice, a new form of coerced labor rather than genuinely free wage labor, even though it was legally distinct from chattel slavery.',
        'THE CHINESE DIASPORA of this era moved through LARGELY SEPARATE migration networks and destinations from Indian indenture: significant numbers of Chinese laborers migrated (some under indenture-like contracts, some more independently) to destinations including the Americas (including railroad and mining labor in the United States) and Southeast Asia, forming distinct and lasting overseas Chinese communities. This was a parallel, not identical, migration stream to Indian indenture — different origin, different destinations, different contractual and social patterns.',
        'TRANSATLANTIC EUROPEAN MIGRATION was the era\'s largest VOLUNTARY migration stream: tens of millions of Europeans crossed the Atlantic to the Americas (and to Australia) from roughly 1850 to 1914, driven by push factors (population growth outpacing land/jobs, and dislocation from industrialization and agricultural change) and pull factors (available land, industrial jobs, and, for some groups, religious or political freedom).',
        'URBANIZATION accompanied all of these streams and industrialization more broadly: rural populations worldwide moved into rapidly growing industrial and colonial-administrative cities in search of wage labor, reshaping social structures, housing conditions, and public-health challenges in cities on every continent.',
        "NATIVIST BACKLASH met migrant labor in several receiving societies: the United States' Chinese Exclusion Act (1882), for instance, barred further Chinese labor immigration in response to (often racially motivated) economic-competition anxieties among native-born workers — an example of the broader pattern in which migrant labor, however economically useful to employers, frequently provoked exclusionary political responses in receiving societies.",
        'MIGRANT COMMUNITIES built lasting institutions wherever they settled in large numbers: REMITTANCES (money sent home to family) connected migrant workers economically to their origin communities even across oceans, while ETHNIC ENCLAVES — communities like the Indian diaspora populations that remain prominent in Mauritius, Trinidad, Fiji, and Natal/South Africa today, or Chinese immigrant communities abroad — preserved language, religion, and social ties, becoming permanent features of the societies migrants settled in.',
      ],
      vocabulary: [
        {
          term: 'indentured servitude',
          definition:
            'a labor system in which a worker signs a multi-year contract binding them to a specific employer in exchange for passage, wages, and (often) eventual return passage — the dominant post-abolition labor regime on many British colonial plantations, filled overwhelmingly by Indian recruits after 1834.',
        },
        {
          term: 'diaspora',
          definition:
            "a population dispersed from its original homeland that maintains a shared identity and connections across its new locations — used here of the Chinese diaspora formed by 19th-century emigration to the Americas and Southeast Asia.",
        },
        {
          term: 'remittance',
          definition:
            'money sent by a migrant worker back to family or community in their country of origin, connecting migrant labor economically to the sending society even across long distances.',
        },
      ],
      passageId: 'evelyn.passage.apworld-indenture-table.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-indenture-table',
      kind: 'worked_example',
      problem:
        'Read this data table: Indian indentured emigration by destination, 1834-1917 — British Mauritius, 453,063; British Guiana, 238,909; Trinidad and Tobago, 147,596; British Jamaica, 36,412; Colony of Natal, 152,184; Colony of Fiji, 60,965; combined total across these six destinations, 1,089,129. What does this table reveal about the pattern of Indian indenture, and what should a careful reader keep in mind about how to use it?',
      steps: [
        'SOURCE THE TABLE. What is being counted, over what period, and by whom? This table counts DEPARTURES of Indian indentured laborers under contract to six British colonies from 1834 (the year after the abolition of slavery in the British Empire) to 1917 (the year Britain ended indenture recruitment) — a headcount of people leaving under indenture contracts, not a net-migration figure (some workers later returned to India under return-passage provisions).',
        'READ THE MAGNITUDES. Mauritius (453,063) and British Guiana (238,909) together account for roughly two-thirds of the combined 1,089,129 total — reflecting how early and how large-scale recruitment to these two sugar colonies was, compared to smaller destinations like Jamaica (36,412).',
        'NOTICE THE TIMING DIFFERENCE. Fiji\'s relatively small total (60,965) partly reflects that Fiji\'s indenture recruitment did not begin until 1879, decades after Mauritius and the Caribbean colonies were already established destinations — a reminder to connect a magnitude in a data table to WHEN that stream started, not just how large it grew.',
        'STATE THE TABLE\'S SCOPE PRECISELY. This total covers ONLY these six destinations and ONLY Indian indenture — it explicitly excludes smaller, separately tabulated Indian indenture streams (e.g. to Malaya, the Seychelles, East Africa) and it says nothing at all about the SEPARATE Chinese indentured/migrant labor streams of the same era, which followed different routes and are not counted here. A careful reader should never cite this table\'s 1,089,129 figure as "the" total of all 19th-century indenture, or as covering Chinese migration.',
        'CONNECT TO THE CONCEPT. The table is direct quantitative evidence for the concept\'s claim that Indian indenture became the dominant post-abolition labor regime across British sugar colonies specifically — supplying the coerced-but-contractual labor force that plantation economies needed once slavery was abolished, on a scale (over a million departures to these six destinations alone) large enough to permanently reshape the demographics of Mauritius, the Caribbean, Natal, and Fiji.',
      ],
      answer:
        "The table shows Indian indenture concentrated heavily in Mauritius and British Guiana (together roughly two-thirds of the six-destination total of 1,089,129), reflecting how early and extensively those sugar colonies recruited Indian labor after the 1834 abolition of slavery, while smaller or later-starting destinations like Fiji (indenture began only in 1879) and Jamaica received proportionally fewer workers. A careful reader must keep the table's SCOPE narrow: it counts only departures (not net migration, since some workers returned), only these six British destinations (excluding smaller Indian indenture streams elsewhere), and only INDIAN indenture — it says nothing about the separate Chinese migration streams of the same era. Within that scope, the table is strong quantitative evidence that Indian indenture became the dominant post-abolition labor regime on British sugar plantations on a scale — over a million people to these six destinations alone — large enough to permanently reshape those societies' demographics.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Using the data table above, identify which of the six destinations received the largest number of Indian indentured laborers. (b) Explain ONE reason post-abolition labor demand created the indenture system. (c) Explain ONE social consequence of large-scale migration (Indian, Chinese, or European) for either the sending or the receiving society.',
      responseFormat: 'frq',
      passageId: 'evelyn.passage.apworld-indenture-table.v1',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies British Mauritius (453,063) as the largest of the six listed destinations. No credit for a different destination or an unsupported figure.',
            modelResponse:
              'According to the table, British Mauritius received the largest number of Indian indentured laborers, at 453,063.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate mechanism connecting the 1833-34 abolition of slavery to the creation of the indenture system — e.g. plantation economies needing a replacement large-scale, coercible labor force. No credit for a vague or disconnected explanation.',
            modelResponse:
              'After Britain abolished slavery across its empire in 1833-34, sugar plantation economies that had depended on enslaved labor needed a new large-scale workforce, and turned to indentured servitude — multi-year labor contracts, recruited overwhelmingly from India — to replace it.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, historically accurate social consequence of migration — e.g. the formation of lasting ethnic enclaves/diaspora communities, remittances connecting migrants to their origin communities, or nativist backlash such as the Chinese Exclusion Act. No credit for a vague or unsupported claim.',
            modelResponse:
              "Large-scale Indian indenture left lasting ethnic-enclave communities in receiving societies — Indian-descended populations remain prominent in Mauritius, Trinidad, Fiji, and Natal (South Africa) today, preserving language and cultural ties that trace directly back to 19th-century indentured migration.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-only-european-migration',
      kind: 'misconception_check',
      question:
        'True or false: 19th-century global migration was overwhelmingly a European phenomenon — Europeans moving to the Americas and Australia.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Treating transatlantic European migration as the WHOLE story of 19th-century migration, missing the large, simultaneous, and historically distinct Indian indenture and Chinese diaspora streams the AP exam expects you to be able to name and distinguish.',
          correctsTo:
            "FALSE. Transatlantic European migration was the era's largest VOLUNTARY migration stream, but it was not the only major one. Indian indenture alone sent over a million contracted laborers to just six British colonies (Mauritius, British Guiana, Trinidad, Jamaica, Natal, and Fiji) between 1834 and 1917, filling the post-abolition labor gap on plantation economies. A separate, parallel Chinese diaspora migration — through its own distinct networks and destinations, including the Americas and Southeast Asia — was also substantial in this period. A complete account of 19th-century migration has to name these as DISTINCT streams, driven by different causes (post-abolition coerced labor demand versus voluntary settlement), not collapse them all into \"migration was mostly European.\"",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Indentured servitude emerged specifically to replace enslaved labor after the 1833-34 abolition of slavery across the British Empire.',
        'Indian indenture sent over a million workers to just six major British destinations (1834-1917), concentrated heavily in Mauritius and British Guiana — a separate stream from the Chinese diaspora migrations of the same era.',
        'Transatlantic European migration (c. 1850-1914) was the era\'s largest VOLUNTARY migration stream, driven by industrial-era push and pull factors.',
        'Urbanization accompanied all these streams as rural populations worldwide moved into growing industrial and colonial-administrative cities.',
        'Migration produced lasting remittance ties and ethnic-enclave communities — and also provoked nativist backlash, such as the United States\' 1882 Chinese Exclusion Act.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.7',
    cedTitle: 'Global Migration in the Age of Empire',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-indenture-table.v1',
        chapter: '1834-1917',
        note: 'Indian indentured emigration by destination (data table) — anchor stimulus for reading a described data table.',
      },
    ],
  },
};
