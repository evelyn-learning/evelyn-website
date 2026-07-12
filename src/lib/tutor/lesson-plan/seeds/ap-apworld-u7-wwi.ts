/**
 * AP World History: Modern — CED Unit 7.1-7.3: World War I as a Global War.
 *
 * Follows the Silk Roads calibration template
 * (`ap-apworld-u2-silk-roads.ts`). concept = the historical argument (WWI
 * had multiple interlocking causes, was fought as a genuinely global total
 * war through colonial manpower and the Ottoman front, and its peace
 * settlement betrayed the self-determination principle it claimed to
 * honor); worked_example = annotated comparison of Wilson's Fourteen
 * Points against the Treaty of Versailles's mandate system; try_yourself =
 * a 3-point SAQ-style short-answer.
 *
 * Anchor text (concept): described WWI Indian Army recruitment poster —
 * evelyn.passage.apworld-wwi-propaganda-visual.v1. The poster's caption is
 * DESCRIBED (a factual paraphrase of its translated "sense"), never quoted
 * as if it were a verbatim translation.
 * Anchor texts (worked example): Wilson's Fourteen Points, Point V —
 * evelyn.passage.apworld-fourteen-points.v1 — set against the Treaty of
 * Versailles, Article 22 (the mandate system, Part I / Covenant of the
 * League of Nations) — evelyn.passage.apworld-versailles.v1. Both quoted
 * only as the excerpts already seeded.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U7_WWI: LessonPlan = {
  id: 'evelyn.ap.apworld.wwi-global.v1',
  title: 'U7.2 World War I as a Global War',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.wwi-global',
      description:
        'Explain the multiple interlocking causes of World War I, its conduct as a global total war involving colonial troops and labor, the Ottoman collapse and the Armenian genocide, and how the Treaty of Versailles and the mandate system departed from Wilsonian principles of self-determination, 1914-1919.',
      standard: 'AP-APWORLD-7.2',
    },
  ],
  prerequisites: ['apworld.imperial-expansion'],
  followUps: ['apworld.interwar-world'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Establish that WWI was fought far beyond the Western Front trenches most people picture, and preview the gap between wartime promises and the postwar peace.',
      script:
        "Picture World War I and you probably picture trenches in France and Belgium. That picture is real, but it is only one theater of a genuinely global war: soldiers and laborers from India, West Africa, and elsewhere in the colonized world fought and died in it; the Ottoman Empire collapsed under it, with catastrophic consequences for its Armenian population; and the peace that followed was negotiated in the name of a set of idealistic principles — including the idea that colonized peoples' own interests should matter. What actually happened to that principle once the war ended is one of the most consequential betrayals in the twentieth century, and it shapes almost everything covered in the rest of this unit.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-wwi-global',
      kind: 'concept',
      goal: 'Explain the MAIN causes of WWI and the alliance cascade that escalated a regional crisis into continental war, the war\'s character as a global total war fought partly through colonial manpower, the Ottoman collapse and the Armenian genocide, and the gap between Wilson\'s stated principles and the postwar mandate system.',
      keyIdeas: [
        'THE MAIN CAUSES (a standard mnemonic) identify four long-building conditions across Europe by 1914: MILITARISM (an arms race, especially the Anglo-German naval rivalry, and large standing armies with detailed mobilization plans), ALLIANCES (the Triple Alliance of Germany, Austria-Hungary, and Italy, versus the Triple Entente of France, Russia, and Britain), IMPERIALISM (colonial rivalries among the same powers, e.g. repeated crises over Morocco), and NATIONALISM (especially Slavic nationalism straining the multiethnic Austro-Hungarian and Ottoman empires in the Balkans). The assassination of Archduke Franz Ferdinand of Austria-Hungary by a Bosnian Serb nationalist at Sarajevo (28 June 1914) was the immediate TRIGGER, not the underlying cause.',
        'THE ALLIANCE CASCADE turned a Balkan crisis into a continental war in about five weeks: Austria-Hungary issued an ultimatum to Serbia, Russia mobilized in Serbia\'s defense, Germany declared war on Russia and then France (honoring its alliance with Austria-Hungary), and Germany\'s invasion of neutral Belgium (to reach France quickly) brought Britain into the war by early August 1914 — each power\'s alliance commitments pulling in the next.',
        'WWI (1914-1918) was fought as TOTAL WAR: belligerent governments redirected entire industrial economies to war production, imposed civilian rationing, and expanded state economic control far beyond anything in prior European wars.',
        "COLONIAL MANPOWER made this a genuinely GLOBAL war, not a purely European one. Britain and France mobilized colonial troops and labor on a huge scale: British India alone contributed more than 1.3 million men to Allied forces overseas by the 1918 armistice (a wartime recruitment poster distributed across India's linguistic regions, discussed below, is one artifact of that mobilization drive), while France recruited large numbers of West African soldiers, the tirailleurs sénégalais, who served on the Western Front and elsewhere. These colonial troops fought and died for imperial powers that had not extended them the political self-determination the war's rhetoric increasingly invoked.",
        "THE OTTOMAN EMPIRE entered the war allied with Germany and Austria-Hungary (the Central Powers) and fought on multiple fronts, including against British and British-colonial forces in the Middle East. During the war, the Ottoman government carried out systematic wartime deportations and mass killings of its Armenian population (1915-1923) — a documented state-organized campaign, not sporadic violence, that killed an estimated 600,000 to 1.5 million people. Ottoman defeat in the war led to the empire's territorial collapse and eventual partition among the victorious powers.",
        'WILSON\'S FOURTEEN POINTS (January 1918) articulated a set of American war aims, including a call for the "impartial adjustment of all colonial claims" giving colonized populations\' interests equal weight with the claims of the governing power, and a postwar "general association of nations." These principles raised real expectations among colonized peoples and subject nationalities that the postwar settlement would extend meaningful self-determination.',
        'THE MANDATE SYSTEM, established by Article 22 of the Covenant of the League of Nations (incorporated as Part I of the Treaty of Versailles, 1919), instead assigned the former German colonies and Ottoman territories to Allied "Mandatory" powers as a "sacred trust of civilisation," framing their populations as "not yet able to stand by themselves." In practice, this reallocated colonial-style control among the victors — chiefly Britain and France, who took mandates over former Ottoman territories including Iraq, Palestine, and Syria/Lebanon — under new legal language rather than genuine self-rule. The detailed gap between the Fourteen Points\' promise and the mandate system\'s reality is analyzed in the worked example below.',
      ],
      vocabulary: [
        {
          term: 'MAIN causes',
          definition:
            'a mnemonic for World War I\'s four interlocking long-term causes — Militarism, Alliances, Imperialism, Nationalism — distinct from the assassination of Archduke Franz Ferdinand, which was the immediate trigger.',
        },
        {
          term: 'total war',
          definition:
            'a form of warfare in which a belligerent state mobilizes its entire economy and society — industrial production, civilian rationing, expanded state control — toward the war effort, not just its armed forces.',
        },
        {
          term: 'mandate system',
          definition:
            "the arrangement under Article 22 of the League of Nations Covenant (Part I of the Treaty of Versailles, 1919) assigning former German colonies and Ottoman territories to Allied 'Mandatory' powers as a supposed 'sacred trust,' in practice extending imperial control under new legal cover rather than genuine self-determination.",
        },
        {
          term: 'Armenian genocide',
          definition:
            "the Ottoman government's systematic wartime deportation and mass killing of its Armenian population (1915-1923), which killed an estimated 600,000 to 1.5 million people.",
        },
      ],
      passageId: 'evelyn.passage.apworld-wwi-propaganda-visual.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-versailles-mandates',
      kind: 'worked_example',
      problem:
        'Compare these two documents. Wilson\'s Fourteen Points (January 1918), Point V: "A free, open-minded, and absolutely impartial adjustment of all colonial claims, based upon a strict observance of the principle that in determining all such questions of sovereignty the interests of the populations concerned must have equal weight with the equitable claims of the government whose title is to be determined." The Treaty of Versailles (1919), Article 22 of the League of Nations Covenant: "there should be applied the principle that the well-being and development of such peoples form a sacred trust of civilisation and that securities for the performance of this trust should be embodied in this Covenant. The best method of giving practical effect to this principle is that the tutelage of such peoples should be entrusted to advanced nations who by reason of their resources, their experience or their geographical position can best undertake this responsibility, and who are willing to accept it, and that this tutelage should be exercised by them as Mandatories on behalf of the League." What does the gap between these two documents reveal about the postwar settlement\'s treatment of colonized and formerly Ottoman-ruled peoples?',
      steps: [
        'SOURCE BOTH DOCUMENTS. Point V comes from Wilson\'s January 1918 address to Congress, delivered while the war was still being fought, stating American aims for the eventual peace. Article 22 comes from the actual treaty text signed in June 1919, after Germany\'s defeat, as part of the Covenant of the League of Nations (Part I of the Treaty of Versailles) — the legally binding instrument that resulted.',
        'IDENTIFY WILSON\'S PROMISE. Point V calls for colonial claims to be adjusted "impartially," with "the interests of the populations concerned" given EQUAL WEIGHT to "the equitable claims of the government" seeking title — a principle that treats colonized populations\' own interests as a legitimate, weighable factor, not an afterthought.',
        'IDENTIFY THE MANDATE REALITY. Article 22 instead frames the same populations as "peoples not yet able to stand by themselves under the strenuous conditions of the modern world" and assigns "tutelage" over them to "advanced nations" as "Mandatories" — guardianship language, not a claim-weighing process treating those populations\' interests as equal to anyone else\'s.',
        'CONNECT THE GAP TO PRACTICE. The mandates were assigned almost entirely to the same Allied imperial powers already practiced at colonial administration — chiefly Britain and France took mandates over former Ottoman territories (Iraq, Palestine, Syria, Lebanon) and former German colonies. "Impartial adjustment" weighing local interests equally became, in practice, a reallocation of imperial control among the victors, formalized under League of Nations oversight rather than ended by it.',
        'WEIGH WHAT THE COMPARISON SHOWS AND DOES NOT SHOW. This comparison demonstrates a real, documentable gap between a stated wartime principle and the actual postwar legal instrument — it does not by itself prove Wilson acted in bad faith personally; other Allied powers with their own colonial interests shaped the final treaty language he did not fully control.',
        'STATE THE LINK TO THE COURSE THESIS. Colonized and subject peoples who had contributed manpower and labor to the Allied war effort, and who had heard Wilson\'s promise of impartial, equally-weighted treatment, instead received a peace settlement that assigned their territories to new foreign administrators under guardianship language — a betrayal that fueled the anti-imperial political movements covered in the next topic.',
      ],
      answer:
        'Wilson\'s Fourteen Points promised that colonial claims would be adjusted "impartially," with the interests of colonized populations given EQUAL WEIGHT to the claims of governing powers. The Treaty of Versailles\'s Article 22 instead delivered guardianship: it labeled the same populations "not yet able to stand by themselves" and assigned their "tutelage" to "advanced nations" acting as Mandatories for the League. In practice, mandates went overwhelmingly to the same Allied imperial powers (chiefly Britain and France) already experienced in colonial rule, over former German colonies and former Ottoman territories such as Iraq, Palestine, Syria, and Lebanon — extending imperial control under new legal language rather than the equal-weighing process Wilson had promised. This comparison does not prove bad faith by Wilson personally, since other Allied powers shaped the final treaty text, but it does show a documentable gap between wartime promise and postwar reality — one that colonized peoples who had supplied manpower and labor to the war effort noticed immediately, fueling the anti-imperial ferment of the interwar period.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE of the MAIN causes of World War I. (b) Explain ONE way World War I was fought as a global war involving peoples or territories outside Europe. (c) Explain ONE way the mandate system established at Versailles departed from the principle Wilson stated in the Fourteen Points.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine MAIN cause — militarism, alliances, imperialism, or nationalism — or correctly names the assassination of Franz Ferdinand as the immediate trigger if explicitly distinguished from an underlying cause. No credit for a vague statement with no identifiable specific cause.',
            modelResponse:
              'One of the MAIN causes of World War I was the alliance system, which bound Germany, Austria-Hungary, and Italy together in the Triple Alliance, and France, Russia, and Britain together in the Triple Entente.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way WWI was a global war — e.g. colonial troops from India or West Africa, the Ottoman front in the Middle East, or Ottoman/Armenian consequences. No credit for a vague or unsupported claim.',
            modelResponse:
              'World War I was fought as a global war in part because Britain and France recruited large numbers of colonial troops, including more than 1.3 million men from British India, to serve on fronts far from their home countries.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate departure from the Fourteen Points\' Point V — e.g. that the mandate system assigned former colonies/territories to Allied powers as guardianship rather than weighing colonized populations\' interests equally. No credit for a vague or unsupported claim.',
            modelResponse:
              'Wilson\'s Fourteen Points promised that colonized populations\' interests would be weighed equally with the claims of the governing power, but the mandate system established by Article 22 of the Versailles treaty instead assigned former German and Ottoman territories to Allied powers as "tutelage," extending a form of colonial administration rather than genuine self-determination.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-purely-european',
      kind: 'misconception_check',
      question:
        'True or false: World War I was a purely European conflict, fought only among European powers on European soil.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Picturing WWI as confined to the Western Front trenches of France and Belgium, missing the war\'s colonial manpower, the Middle Eastern/Ottoman front, and Japan\'s participation — the AP exam expects recognition of WWI as a genuinely global conflict.',
          correctsTo:
            'FALSE. World War I was fought well beyond Europe. The Ottoman Empire, allied with Germany and Austria-Hungary, fought British and British-colonial forces across the Middle East, and its wartime collapse included the Armenian genocide (1915-1923). Britain and France mobilized colonial manpower on a massive scale — more than 1.3 million men from British India alone, plus the tirailleurs sénégalais recruited from West Africa — deploying them to fronts across Europe and the Middle East. Japan also entered the war against Germany, seizing German-held territory in the Pacific and China. Treating WWI as purely European erases the war\'s genuinely global scope and the colonial peoples whose manpower and labor sustained it.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The MAIN causes (Militarism, Alliances, Imperialism, Nationalism) set the stage; Franz Ferdinand\'s assassination (June 1914) was the trigger that the alliance system escalated into continental war within about five weeks.',
        'WWI was a global total war: British India contributed more than 1.3 million men, France recruited the tirailleurs sénégalais from West Africa, and the Ottoman front stretched the war into the Middle East.',
        'The Ottoman government carried out the Armenian genocide (1915-1923) during the war, killing an estimated 600,000 to 1.5 million people — a documented state campaign, not sporadic violence.',
        'Wilson\'s Fourteen Points (1918) promised colonized populations\' interests would be weighed equally with governing powers\' claims in postwar colonial adjustments.',
        'The Treaty of Versailles\'s mandate system (Article 22, 1919) instead assigned former German and Ottoman territories to Allied powers as "tutelage" — a documented betrayal of the self-determination principle that fueled interwar anti-imperial movements.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7.1-7.3',
    cedTitle: 'World War I as a Global War',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-wwi-propaganda-visual.v1',
        chapter: '1918',
        note: 'WWI Indian Army recruitment poster (described visual) — anchor for colonial manpower mobilization.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-fourteen-points.v1',
        chapter: '1918',
        note: "Wilson's Fourteen Points, Point V — anchor for the promise of impartial colonial-claims adjustment, contrasted in the worked example.",
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-versailles.v1',
        chapter: '1919',
        note: 'Treaty of Versailles, Article 22 (mandate system) — anchor for the postwar reality contrasted against the Fourteen Points.',
      },
    ],
  },
};
