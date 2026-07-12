/**
 * AP World History: Modern — CED Unit 6.4-6.6: Economic Imperialism and
 * Informal Empire.
 *
 * Follows the Silk Roads calibration template
 * (`ap-apworld-u2-silk-roads.ts`). concept = the historical argument (how
 * did the Opium Wars and unequal treaties create an "informal empire" over
 * China that stopped short of formal colonization, and how did export
 * monocultures and strategic infrastructure extend economic imperialism
 * elsewhere?); worked_example = annotated document analysis; try_yourself
 * = a 3-point SAQ-style short-answer.
 *
 * Anchor text: Lin Zexu, letter to Queen Victoria (1839) —
 * evelyn.passage.apworld-lin-zexu.v1. Presented as a measured statement of
 * the Qing moral case against the opium trade on the eve of the First
 * Opium War, quoted only as the excerpt already seeded.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U6_ECONOMIC_IMPERIALISM: LessonPlan = {
  id: 'evelyn.ap.apworld.economic-imperialism.v1',
  title: 'U6.5 Economic Imperialism and Informal Empire',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.economic-imperialism',
      description:
        'Explain how the Opium Wars and unequal treaties created an informal economic empire over China, and how export monocultures and strategic infrastructure extended economic imperialism over other regions that were not formally colonized, 1750-1900.',
      standard: 'AP-APWORLD-6.5',
    },
  ],
  prerequisites: ['apworld.imperial-resistance'],
  followUps: ['apworld.global-migration'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Establish the distinction between formal colonization and informal economic domination, using China as the headline case.',
      script:
        "China was never colonized the way India or most of Africa was. No European flag was ever raised over Beijing; the Qing Dynasty governed China from the 1600s until 1912. And yet, by the late 1800s, foreign powers dictated China's tariffs, tried and punished their own citizens under their own laws on Chinese soil, and carved the country into overlapping zones of economic privilege. That is not formal colonization — it is something the era's economic historians call \"informal empire\": real, humiliating loss of economic sovereignty, achieved without ever formally annexing the territory. Understanding how that happened, starting with a drug, is the heart of this topic.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-economic-imperialism',
      kind: 'concept',
      goal: 'Explain how the Opium Wars produced unequal treaties and extraterritoriality that created an informal empire over China, and how spheres of influence, export monocultures, and strategic infrastructure extended economic imperialism to other regions without formal colonization.',
      keyIdeas: [
        "BY THE LATE 1830s, British merchants were exporting large and growing quantities of opium (grown in British India) into China in exchange for tea, silk, and other Chinese goods — reversing a previous silver-flow imbalance in China's favor, and creating a serious addiction and social crisis inside China. Qing Commissioner Lin Zexu was sent to Canton to suppress the trade; his 1839 letter to Queen Victoria appealed to Britain's OWN domestic ban on opium and to the mutual benefit of legitimate Anglo-Chinese trade (tea, rhubarb) to argue Britain should not profit from exporting a drug it forbade at home.",
        "BRITAIN REJECTED LIN'S APPEAL and, after Lin's enforcement measures disrupted the opium trade, went to war. THE FIRST OPIUM WAR (1839-1842) ended in a decisive British military victory over Qing forces, whose armed forces were badly outmatched by British steam-powered gunboats and modern weaponry.",
        "THE TREATY OF NANJING (1842) was the first of China's \"unequal treaties\": it ceded Hong Kong to Britain, opened five \"treaty ports\" to British trade and residence, and (via a supplementary agreement) granted EXTRATERRITORIALITY — British subjects in China would be tried under British law by British consular courts, not Chinese law, a direct infringement on Qing legal sovereignty.",
        "THE SECOND OPIUM WAR (1856-1860), fought by Britain and France against the Qing, extended these concessions further: more treaty ports, legalized opium import, foreign legations permitted in Beijing, and continued extraterritorial privileges — deepening, rather than starting, the pattern established at Nanjing.",
        "SPHERES OF INFLUENCE followed by the late 1800s: multiple foreign powers (Britain, France, Germany, Russia, Japan) each claimed exclusive economic privileges — railway concessions, mining rights, preferential trading access — within a designated zone of Chinese territory, without formally annexing it. China's central government remained nominally sovereign over the whole country, but its practical control over trade, legal jurisdiction, and infrastructure investment within these zones was sharply constrained.",
        'EXPORT MONOCULTURES extended economic imperialism to regions that also were not always formally colonized: Peru\'s 19th-century economy became heavily dependent on exporting GUANO (nutrient-rich seabird droppings used as fertilizer, mined largely by coerced and indentured labor) to industrializing economies; RUBBER became a similarly dominant export commodity by the century\'s end, most infamously in the Congo Free State, the personal colonial possession of Belgium\'s King Leopold II, where the pursuit of rubber profits was accompanied by well-documented, extreme forced-labor abuses and mass death among Congolese laborers — noted here factually as a distinct, especially severe case, not as typical of every rubber-exporting economy.',
        "STRATEGIC INFRASTRUCTURE extended foreign economic leverage even over formally independent states: the SUEZ CANAL (opened 1869, built with French engineering and financing along with the Egyptian government's investment) became such a critical shortcut for European trade with Asia that when Egypt's government fell into unsustainable debt partly from financing it, Britain used a debt crisis and a subsequent nationalist uprising as pretext to militarily occupy Egypt in 1882 — turning canal-driven debt into de facto foreign control while Egypt remained nominally an autonomous Ottoman province.",
        '"BANANA REPUBLICS" is the (originally derisive, now standard descriptive) term for small Central American states whose economies and even internal politics came to be dominated by foreign — chiefly American — agricultural companies exporting a single crop (bananas), illustrating how economic imperialism could operate through corporate, not just governmental, leverage over a nominally sovereign state.',
      ],
      vocabulary: [
        {
          term: 'extraterritoriality',
          definition:
            "a privilege granted under China's unequal treaties whereby foreign nationals were tried under their own country's law by their own consular courts, rather than under Chinese law — a direct infringement on Qing legal sovereignty.",
        },
        {
          term: 'unequal treaty',
          definition:
            'a treaty imposed on a militarily defeated or coerced state that granted the stronger power one-sided commercial, legal, or territorial privileges — the Treaty of Nanjing (1842) is the model example from this topic.',
        },
        {
          term: 'sphere of influence',
          definition:
            "a zone within a nominally sovereign country (most often used of late-Qing China) where one foreign power held exclusive economic privileges (railways, mining, trade access) without formally annexing the territory.",
        },
        {
          term: 'informal empire',
          definition:
            'a relationship in which one state dominates the economic and sometimes legal life of a nominally independent state without formal colonization or annexation — the standard framing historians use for foreign leverage over late-Qing China.',
        },
      ],
      passageId: 'evelyn.passage.apworld-lin-zexu.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-lin-zexu',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Commissioner Lin Zexu\'s 1839 letter to Queen Victoria: "We have heard that in your own country opium is prohibited with the utmost strictness and severity:---this is a strong proof that you know full well how hurtful it is to mankind. Since then you do not permit it to injure your own country, you ought not to have the injurious drug transferred to another country, and above all others, how much less to the Inner Land! [...] Not to speak of our tea and rhubarb, things which your foreign countries could not exist a single day without, if we of the Central Land were to grudge you what is beneficial, and not to compassionate your wants, then wherewithal could you foreigners manage to exist?" What argument is Lin making, and what should a careful reader keep in mind about the letter\'s historical moment?',
      steps: [
        'SOURCE IT FIRST. Who, when, why? Lin Zexu, the Qing imperial commissioner dispatched to Canton to suppress the opium trade, writing directly to Queen Victoria in 1839 — before the outbreak of the First Opium War, while Lin still hoped a direct moral and diplomatic appeal might resolve the crisis without conflict.',
        'IDENTIFY THE CLAIM. Lin argues by RECIPROCITY: Britain\'s own strict domestic prohibition on opium ("this is a strong proof that you know full well how hurtful it is to mankind") is evidence Britain knows opium is harmful — so exporting it to China while banning it at home is a double standard Lin asks Britain to correct.',
        'IDENTIFY THE SECOND ARGUMENT. Lin also appeals to mutual economic dependence, pointedly naming "tea and rhubarb" as Chinese exports "your foreign countries could not exist a single day without" — framing Anglo-Chinese trade as something China could weaponize (by withholding beneficial goods) but has chosen not to, in implicit contrast to Britain\'s opium exports.',
        'CONNECT TO THE INFORMAL-EMPIRE ARGUMENT. This letter represents the moment BEFORE informal empire was imposed on China — Lin is negotiating from a position where Qing sovereignty over its own trade and legal jurisdiction is still fully intact, appealing to Britain\'s own standards rather than facing a fait accompli. The war and unequal treaties that followed are precisely what ended this position.',
        "WEIGH THE LETTER'S TONE AND MOMENT. Lin's tone is measured and appeals to shared moral standards and mutual interest, not confrontation — a diplomatic rather than a purely accusatory approach. Read this as a moment of GENUINE Qing agency and moral argument, not as evidence of weakness or naivete: the letter fails to prevent war not because the argument was poorly made, but because Britain rejected it in favor of protecting profitable trade.",
        "STATE THE LINK TO THE COURSE THESIS. Lin's letter captures the moral case against the opium trade at the precise historical hinge point — before the First Opium War (1839-1842) and the Treaty of Nanjing (1842) converted a trade dispute into the first of China's unequal treaties and the beginning of extraterritoriality and informal empire.",
      ],
      answer:
        'Lin Zexu makes two connected arguments: a RECIPROCITY argument (Britain\'s own strict domestic ban on opium proves Britain knows it is harmful, so exporting it to China is a double standard) and a MUTUAL-DEPENDENCE argument (China supplies goods like "tea and rhubarb" that Britain needs, and has chosen not to weaponize that leverage, in implicit contrast to Britain\'s conduct). A careful reader should note this letter was written BEFORE the First Opium War, from a position of intact Qing sovereignty and genuine diplomatic agency — its measured, appeal-to-shared-standards tone reflects a real attempt to resolve the crisis without conflict, not weakness. Britain\'s rejection of this appeal, followed by war and the Treaty of Nanjing (1842), is the hinge point at which China\'s position shifted from full sovereignty to the informal empire of unequal treaties and extraterritoriality.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE mechanism of economic imperialism used against China or another region, 1750-1900 (e.g. an unequal treaty provision, a sphere of influence, or an export monoculture). (b) Explain how that mechanism disadvantaged the dependent economy or state. (c) Explain ONE way China\'s experience differed from formal colonization elsewhere in this period.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine mechanism of economic imperialism — e.g. extraterritoriality, a treaty port, a sphere of influence, or an export monoculture like guano or rubber. No credit for a vague statement with no identifiable specific mechanism, or an anachronistic/incorrect item.',
            modelResponse:
              "One mechanism of economic imperialism was extraterritoriality, granted to Britain under China's unequal treaties after the First Opium War.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way the named mechanism disadvantaged the dependent economy or state — e.g. loss of legal jurisdiction, forced-labor conditions in an export economy, or debt leverage. No credit for an explanation disconnected from the item named in (a).',
            modelResponse:
              'Extraterritoriality meant foreign nationals in China were tried under their own consular courts rather than Chinese law, directly infringing on Qing legal sovereignty and removing the Qing government\'s ability to hold foreign residents accountable under its own legal system.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, historically accurate distinction between China's informal empire and formal colonization elsewhere (e.g. India or Africa) — e.g. the Qing government remained nominally sovereign and in place, unlike direct colonial administration. No credit for a vague or unsupported claim.",
            modelResponse:
              'Unlike India or most of colonized Africa, China was never formally annexed or placed under direct foreign administration — the Qing government remained nominally sovereign and continued to govern the country, even as foreign powers dictated trade terms, held extraterritorial legal privileges, and carved out exclusive spheres of economic influence.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-china-formally-colonized',
      kind: 'misconception_check',
      question:
        'True or false: China was formally colonized by foreign powers in the late 19th century, the same way India and most of Africa were.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Conflating the very real loss of economic and legal sovereignty China experienced (extraterritoriality, treaty ports, spheres of influence) with FORMAL colonization — missing the AP exam's specific distinction between informal and formal empire.",
          correctsTo:
            "FALSE. China kept its own government, the Qing Dynasty, which continued to rule the country until 1912 — no foreign power annexed Chinese territory as a colony the way Britain annexed India or European powers annexed most of Africa. What China experienced instead is called INFORMAL EMPIRE: after the Opium Wars, unequal treaties gave foreign powers extraterritorial legal privileges, control over tariffs, treaty ports, and (by the late 1800s) exclusive spheres of economic influence carved out region by region — a serious, humiliating loss of practical sovereignty, but achieved without formal annexation or direct foreign administration replacing the Qing government. Keep the two forms of empire — formal colonization and informal economic domination — distinct on the exam.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Lin Zexu's 1839 letter to Queen Victoria made a measured reciprocity/mutual-dependence argument against the opium trade — before the First Opium War, from a position of intact Qing sovereignty.",
        'The First Opium War (1839-1842) and the Treaty of Nanjing (1842) began the pattern of unequal treaties: treaty ports, ceded territory (Hong Kong), and extraterritoriality.',
        'The Second Opium War (1856-1860) deepened these concessions; by the late 1800s, foreign powers carved China into overlapping spheres of influence.',
        'Export monocultures (guano, rubber — including the especially severe Congo Free State abuses) and strategic infrastructure (the Suez Canal, leading to British occupation of Egypt in 1882) extended economic imperialism beyond China.',
        'China was never formally colonized — the Qing government remained nominally sovereign throughout, making this "informal empire," distinct from direct colonial rule.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.4-6.6',
    cedTitle: 'Economic Imperialism and Informal Empire',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-lin-zexu.v1',
        chapter: '1839',
        note: 'Lin Zexu, letter to Queen Victoria — anchor document for the moral case against the opium trade on the eve of the First Opium War.',
      },
    ],
  },
};
