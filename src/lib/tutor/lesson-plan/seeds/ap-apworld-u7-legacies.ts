/**
 * AP World History: Modern — CED Unit 7.8-7.9: Legacies of Total War —
 * Atrocities, Refugees, and Human Rights.
 *
 * Follows the Silk Roads calibration template
 * (`ap-apworld-u2-silk-roads.ts`). concept = the historical argument (the
 * century's mass atrocities followed documented state or organizational
 * planning rather than spontaneous eruption, and the World Wars produced
 * lasting refugee and human-rights institutions while critically
 * weakening European imperial power); worked_example = a document-free
 * traced causal chain (mirrors the Unit-6 imperial-resistance template);
 * try_yourself = a 3-point SAQ-style short-answer.
 *
 * NO wired passage — this topic is deliberately left unanchored to a
 * specific primary source in the Unit-7 content-plan set (see
 * docs/superpowers/sdd/unit-7-block.md). The UDHR itself is wired to MCQs
 * in a later task, not here. All atrocities are described factually, one
 * line of scale each, with zero graphic detail.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U7_LEGACIES: LessonPlan = {
  id: 'evelyn.ap.apworld.conflict-legacies.v1',
  title: 'U7.8 Legacies of Total War: Atrocities, Refugees, and Human Rights',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.conflict-legacies',
      description:
        "Explain the twentieth century's pattern of documented, state-planned mass atrocities, the refugee and human-rights institutions (Nuremberg, the UDHR) that emerged from the World Wars, and how both wars weakened European imperial power and set the stage for decolonization.",
      standard: 'AP-APWORLD-7.8',
    },
  ],
  prerequisites: ['apworld.wwii-global'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the century of total war as leaving two intertwined legacies — a recurring pattern of planned mass atrocity, and a new (imperfect) set of international institutions built partly in response to it — and preview the pressure both wars put on European empire.',
      script:
        "By 1945, the twentieth century had already produced two of history's most devastating state-organized mass killings, and it was not finished. What's easy to miss, looking at the Armenian genocide, the Holocaust, and the genocides that followed later in the century, is that none of them were spontaneous explosions of hatred — every one of them followed documented planning by the state or organization that carried it out. At the same time, the same wars that produced these atrocities also produced the first serious international attempts to hold individuals accountable for them, and to state, in writing, what rights every human being should have. And both wars left the European empires that had dominated the globe for a century economically drained, militarily exposed, and morally undermined — setting up the wave of decolonization this course turns to next.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-conflict-legacies',
      kind: 'concept',
      goal: 'Explain the documented state-planning pattern behind the century\'s major mass atrocities, the refugee and human-rights institutions (Nuremberg, the UDHR, the Refugee Convention) that emerged from the World Wars, and how both wars weakened European imperial power.',
      keyIdeas: [
        "THE TWENTIETH CENTURY'S TOTAL-WAR PATTERN extended beyond battlefields into state-organized mass atrocities against civilian populations — in every case examined here, following DOCUMENTED planning, not spontaneous violence. The OTTOMAN GOVERNMENT's wartime deportations and killings of Armenians (1915-1923), covered earlier in this unit, killed an estimated 600,000 to 1.5 million people.",
        'THE HOLOCAUST, covered earlier in this unit, was Nazi Germany\'s systematic murder of six million Jews and millions of others. Its DOCUMENTED planning is captured concretely by the WANNSEE CONFERENCE (January 1942), where senior Nazi officials coordinated the bureaucratic machinery of what they called the "Final Solution" — a paper record that leaves no room to describe the Holocaust as a spontaneous eruption of hatred rather than an organized state program.',
        'IN CAMBODIA, the KHMER ROUGE regime under Pol Pot (1975-1979) pursued a radical program of forced agrarian collectivization, killing an estimated 1.7 to 2 million people — roughly a quarter of Cambodia\'s population — through executions, forced labor, and starvation, organized through the regime\'s own documented administrative structure (known as Angkar, "the Organization").',
        "IN RWANDA, in 1994, a Hutu extremist-led government and organized militia forces (the Interahamwe) killed an estimated 800,000 people, most of them ethnic Tutsi, in roughly 100 days. This genocide was preceded by years of documented extremist propaganda (including radio broadcasts) and organized militia training — planning, not a sudden, unplanned outburst of ethnic violence.",
        'REFUGEE REGIMES emerged directly from the massive displacement the World Wars produced. The scale of that displacement led the international community to build new legal frameworks, culminating in the United Nations 1951 Refugee Convention, which defined refugee status and the obligations of states offering asylum — a direct institutional legacy of WWII-era displacement.',
        'THE NUREMBERG TRIALS (1945-1946) tried surviving senior Nazi officials before an international military tribunal, establishing that INDIVIDUALS — not just states — could be held criminally responsible for crimes against humanity, genocide, and aggressive war, and that "just following orders" was not, by itself, a complete legal defense. This legal precedent fed directly into the UN General Assembly\'s adoption of the UNIVERSAL DECLARATION OF HUMAN RIGHTS (UDHR, 1948), which articulated a broad, aspirational set of universal human-rights standards intended to help prevent a recurrence of WWII-era atrocities — examined further in the worked example below.',
        "BOTH WORLD WARS CRITICALLY WEAKENED EUROPEAN IMPERIAL POWER — economically (enormous war debts and destroyed infrastructure), militarily (depleted forces and resources), and morally (colonial troops who had fought for Allied 'freedom' and 'self-determination' rhetoric returned home asking why those principles did not apply to their own countries, while Japan's wartime conquests in Southeast Asia had visibly exposed European colonial weakness in Asia). This combined weakening set the stage for the decolonization wave covered in the next unit.",
      ],
      vocabulary: [
        {
          term: 'crimes against humanity',
          definition:
            'a category of international criminal charge, established at the Nuremberg Trials (1945-1946), holding individuals — not just states — legally responsible for large-scale atrocities against civilian populations.',
        },
        {
          term: 'genocide (state-planning pattern)',
          definition:
            'the deliberate, large-scale destruction of a national, ethnic, racial, or religious group; the Armenian genocide, the Holocaust, the Cambodian genocide, and the Rwandan genocide each followed documented state or organizational planning rather than spontaneous violence.',
        },
        {
          term: 'Universal Declaration of Human Rights (UDHR, 1948)',
          definition:
            "a UN General Assembly declaration (not a binding treaty or court) articulating a broad, aspirational set of universal human-rights standards, drafted partly in direct response to WWII-era atrocities and informed by the Nuremberg Trials' precedent of individual criminal responsibility.",
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-nuremberg-to-udhr',
      kind: 'worked_example',
      problem:
        "The Nuremberg Trials (1945-1946) and the UN's Universal Declaration of Human Rights (1948) are often cited together as a single 'legacy of WWII,' but they are two distinct kinds of institution addressing two distinct problems. What did Nuremberg specifically establish, and how did that feed into the UDHR?",
      steps: [
        'IDENTIFY WHAT NUREMBERG WAS. An international military tribunal (with judges from the US, UK, USSR, and France) trying surviving senior Nazi officials on specific criminal charges — crimes against peace, war crimes, and crimes against humanity — a JUDICIAL proceeding assigning individual criminal guilt after the fact.',
        'IDENTIFY NUREMBERG\'S KEY LEGAL PRECEDENT. That "following superior orders" is not, by itself, a complete defense against a charge of committing atrocities — establishing that individual officials can be held criminally responsible even when acting under government authority.',
        'IDENTIFY WHAT THE UDHR WAS. A UN General Assembly DECLARATION, adopted in 1948 — not a binding treaty, and not a court — articulating a broad, aspirational, PROSPECTIVE list of universal rights, rather than assigning criminal guilt for specific past acts.',
        "CONNECT THE TWO. Nuremberg demonstrated, through an actual functioning tribunal, that the international community COULD hold individuals accountable for atrocities on a basis transcending national sovereignty; the UDHR then attempted to state, in advance and for everyone, what baseline rights and protections should exist — so that future violations could be named and judged against a documented, agreed-upon standard rather than only through an ad hoc tribunal assembled after the fact.",
        'WEIGH WHAT NEITHER FULLY SOLVED. Nuremberg\'s authority was created and enforced only by the victorious Allied powers — a longstanding, real criticism sometimes called "victor\'s justice." The UDHR is a non-binding declaration, not an enforceable treaty or court, so it created a moral and political reference point rather than an immediately enforceable global legal mechanism.',
        'STATE THE LINK TO THE COURSE THESIS. Nuremberg\'s precedent (individuals can be held criminally responsible for atrocities) and the UDHR\'s articulation (a universal, prospective baseline of rights) together form the era\'s twin legal legacies — even though neither, by itself, prevented the later documented, planned genocides in Cambodia and Rwanda covered above.',
      ],
      answer:
        "Nuremberg (1945-1946) was a JUDICIAL tribunal that tried individual Nazi officials and established that individuals — not just states — could be held criminally responsible for atrocities, and that following orders was not a complete defense. The UDHR (1948) was a different kind of instrument: a UN General Assembly DECLARATION, not a binding treaty or court, stating in advance a broad, universal, aspirational list of human rights, drafted partly in direct response to WWII atrocities and informed by Nuremberg's precedent. Connecting them: Nuremberg proved accountability was legally possible; the UDHR then tried to state, prospectively, the standard future violations would be judged against. Neither fully solved the underlying problem — Nuremberg's authority came only from the victors ('victor's justice'), and the UDHR remains non-binding — which is part of why documented, planned genocides recurred later in the century, in Cambodia and Rwanda.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE twentieth-century mass atrocity discussed in this topic and briefly describe its documented planning. (b) Explain ONE international legal or institutional legacy that emerged from the World Wars (Nuremberg, the UDHR, or the Refugee Convention). (c) Explain ONE way the World Wars weakened European imperial power and contributed to postwar decolonization pressure.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine mass atrocity (the Armenian genocide, the Holocaust, the Cambodian genocide, or the Rwandan genocide) and names a specific, accurate piece of evidence for documented planning. No credit for a vague statement with no identifiable specific atrocity or evidence.',
            modelResponse:
              'One mass atrocity was the Rwandan genocide (1994), which followed years of documented extremist propaganda, including radio broadcasts, and organized militia training by the Interahamwe before the killing began.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate institutional legacy — e.g. Nuremberg's individual-criminal-responsibility precedent, the UDHR's articulation of universal rights, or the 1951 Refugee Convention. No credit for a vague or unsupported claim.",
            modelResponse:
              "One institutional legacy of the World Wars was the Nuremberg Trials (1945-1946), which established that individuals could be held criminally responsible for crimes against humanity even when acting under government authority.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, historically accurate way the World Wars weakened European imperial power — e.g. war debt and destroyed infrastructure, or returning colonial troops questioning why "self-determination" rhetoric did not apply to their own countries. No credit for a vague or unsupported claim.',
            modelResponse:
              "The World Wars weakened European imperial power in part because colonial troops who had fought for the Allied cause, invoking rhetoric of freedom and self-determination, returned home questioning why those same principles did not apply to their own colonized countries — building political pressure for postwar decolonization.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-spontaneous-genocide',
      kind: 'misconception_check',
      question:
        'True or false: genocides such as the Holocaust, the Cambodian genocide, and the Rwandan genocide were spontaneous outbursts of ethnic or religious hatred rather than planned actions.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Treating mass killing as an unplanned eruption of pre-existing hatred, missing that the AP exam expects recognition of the documented state or organizational planning behind each major twentieth-century genocide.',
          correctsTo:
            'FALSE. Each genocide covered in this unit followed documented planning by the state or organization that carried it out. The Holocaust\'s bureaucratic coordination is captured concretely at the Wannsee Conference (1942), where Nazi officials organized the machinery of the "Final Solution." The Khmer Rouge organized Cambodia\'s killings through its own documented administrative structure (Angkar). Rwanda\'s 1994 genocide was preceded by years of documented extremist propaganda and organized militia training by the Interahamwe. In every case, an organized state or organizational structure planned and directed the killing — treating any of them as a spontaneous eruption of hatred erases the documented evidence of deliberate planning.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Every mass atrocity in this unit — the Armenian genocide, the Holocaust, the Cambodian genocide, and the Rwandan genocide — followed documented state or organizational planning, not spontaneous violence.",
        'The Wannsee Conference (1942) documents the Holocaust\'s bureaucratic planning; Cambodia\'s Angkar and Rwanda\'s Interahamwe similarly show organized planning behind their respective genocides.',
        'The 1951 Refugee Convention emerged directly from WWII-era mass displacement, defining refugee status and asylum obligations.',
        'Nuremberg (1945-1946) established individual criminal responsibility for atrocities; the UDHR (1948) then articulated a prospective, universal (but non-binding) standard of human rights — two distinct legal legacies.',
        "Both World Wars weakened European imperial power economically, militarily, and morally — including colonial troops returning home to ask why 'self-determination' rhetoric excluded their own countries — setting the stage for decolonization.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7.8-7.9',
    cedTitle: 'Legacies of Total War: Atrocities, Refugees, and Human Rights',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
    ],
  },
};
