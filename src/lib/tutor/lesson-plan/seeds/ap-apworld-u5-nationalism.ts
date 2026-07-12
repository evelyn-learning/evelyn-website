/**
 * AP World History: Modern — CED Unit 5.2 (nationalism strand): Nationalism
 * and National Unification.
 *
 * Unit-5 fan-out content plan, third in the within-unit chain
 * (enlightenment → atlantic-revolutions → nationalism-unification →
 * industrial-revolution → industrial-society). No passage is wired here per
 * the unit spec — the teaching point is a structural comparison (two
 * different roads to unification, Italian and German) built from the
 * concept's own facts rather than a primary-source analysis. concept = the
 * historical argument (how did revolutionary-era ideas of popular
 * sovereignty and citizenship feed 19th-century nationalism, and why did
 * Italy and Germany unify through such different combinations of diplomacy,
 * popular mobilization, and war?); worked_example = a structured comparison
 * exercise; try_yourself = a 3-point SAQ-style short-answer.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U5_NATIONALISM: LessonPlan = {
  id: 'evelyn.ap.apworld.nationalism-unification.v1',
  title: 'U5.2b Nationalism and National Unification',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.nationalism-unification',
      description:
        'Explain how revolutionary-era ideas of popular sovereignty fed 19th-century nationalism, the Italian and German unification processes (Cavour, Garibaldi, Bismarck), and Balkan nationalist movements against multiethnic empires.',
      standard: 'AP-APWORLD-5.2b',
    },
  ],
  prerequisites: ['apworld.atlantic-revolutions'],
  followUps: ['apworld.industrial-revolution'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see 19th-century nation-states as recently constructed political projects, not ancient, natural units.',
      script:
        "Before 1861, there was no country called \"Italy\" — the peninsula was a patchwork of separate kingdoms, duchies, and Austrian-controlled territories, most of whose inhabitants didn't think of themselves primarily as \"Italian\" at all. Before 1871, the same was true of \"Germany\": dozens of separate German-speaking states, the largest being Prussia and Austria, with no single German nation-state uniting them. Both of these very recent, deliberately constructed nations emerged within a decade of each other, through startlingly different combinations of backroom diplomacy, popular volunteer armies, and calculated war. Meanwhile, in the multiethnic Ottoman and Austro-Hungarian empires, nationalist movements were pulling in the opposite direction — trying to break large empires apart along ethnic and linguistic lines rather than stitch smaller states together. This unit traces both directions of that same 19th-century nationalist logic.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-nationalism-unification',
      kind: 'concept',
      goal: 'Explain the revolutionary roots of 19th-century nationalism, the Italian and German unification processes, and Balkan nationalist movements against multiethnic empires.',
      keyIdeas: [
        'NATIONALISM\'S ROOTS IN REVOLUTIONARY CITIZENSHIP: 19th-century nationalism grew out of the revolutionary-era idea that political legitimacy derives from "the nation" — a body of citizens bound by shared identity and popular sovereignty — rather than from a monarch\'s dynastic claim to a territory. This reframed loyalty around ethnic, linguistic, and cultural identity rather than allegiance to a ruling house.',
        'ITALIAN UNIFICATION (1861-1870): the Kingdom of Piedmont-Sardinia\'s prime minister, Camillo di Cavour, pursued unification chiefly through diplomacy and calculated war — allying with France against Austria in 1859 to seize northern Italian territory. In 1860, Giuseppe Garibaldi led a volunteer force (the "Red Shirts") that conquered Sicily and southern Italy, then ceded his conquests to the Piedmontese crown rather than ruling them himself. The Kingdom of Italy was proclaimed in 1861; Rome, the last major holdout, was added in 1870.',
        "GERMAN UNIFICATION (1871) THROUGH BISMARCK'S REALPOLITIK: Prussian minister-president Otto von Bismarck pursued unification through realpolitik — hard-nosed, calculated pursuit of state power over ideological consistency — engineering three successive wars (against Denmark, 1864; against Austria, 1866; against France, 1870-1871) that progressively isolated Austria and France while building Prussian-led German unity. The German Empire was proclaimed at Versailles in January 1871, with the Prussian king as German emperor.",
        'TWO DIFFERENT ROADS TO THE SAME OUTCOME: Italian unification combined top-down monarchical diplomacy (Cavour) with bottom-up popular volunteer mobilization (Garibaldi); German unification was almost entirely a top-down, state-engineered process driven by Bismarck and the Prussian army, with much less role for popular volunteer movements. Both, however, used deliberate war-making to force unification rather than relying on peaceful federation.',
        'BALKAN NATIONALISMS AGAINST MULTIETHNIC EMPIRES: nationalist movements among Balkan peoples (including Serbs, Greeks, and Bulgarians) sought independence from Ottoman rule across the 19th century, while similar linguistic and ethnic nationalist pressures built within the multiethnic Austro-Hungarian Empire. Unlike Italian and German unification, which combined smaller states into a larger nation-state, these movements generally sought to break large multiethnic empires apart along national lines — a structural challenge those empires\' dynastic, multiethnic organization could not easily accommodate.',
        'BRIEF CROSS-REFERENCE — ZIONISM AND PAN-MOVEMENTS: the same era produced Zionism, a Jewish nationalist movement (associated with Theodor Herzl from the 1890s) seeking a Jewish homeland, and broader "pan-movements" such as Pan-Slavism and Pan-Germanism, which sought political unity among people sharing an ethnic or linguistic identity across existing state borders — variations on the same underlying nationalist logic applied at different scales.',
      ],
      vocabulary: [
        {
          term: 'realpolitik',
          definition:
            "a politics of hard-nosed, calculated pursuit of state power and interest, associated with Bismarck's approach to German unification, prioritized over ideological consistency or idealism.",
        },
        {
          term: 'unification (Italy/Germany)',
          definition:
            'the 19th-century process by which previously separate states/territories (Italian kingdoms and duchies; German-speaking states) were combined into single nation-states — Italy by 1861 (Rome, 1870); Germany in 1871.',
        },
        {
          term: 'pan-movement',
          definition:
            'a 19th-century nationalist movement (e.g., Pan-Slavism, Pan-Germanism) seeking political unity among people sharing an ethnic or linguistic identity across existing state borders.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-italy-vs-germany',
      kind: 'worked_example',
      problem:
        "Compare the road to Italian unification (Cavour's 1859 alliance with France against Austria, combined with Garibaldi's 1860 volunteer conquest of Sicily and southern Italy, culminating in the 1861 Kingdom of Italy and the 1870 addition of Rome) with the road to German unification (Bismarck's engineering of three successive wars — against Denmark in 1864, Austria in 1866, and France in 1870-1871 — culminating in the 1871 proclamation of the German Empire at Versailles). What structural similarity and what structural difference does this comparison reveal about 19th-century unification nationalism?",
      steps: [
        "IDENTIFY THE SHARED MECHANISM. Both unifications were achieved through deliberate war-making rather than peaceful federation: Cavour's alliance with France produced a war against Austria (1859); Bismarck deliberately engineered three separate wars (1864, 1866, 1870-71) to isolate rivals and build Prussian-led unity. Neither nation unified through voluntary confederation alone.",
        'IDENTIFY THE KEY STRUCTURAL DIFFERENCE — WHO DROVE THE PROCESS. Italian unification combined TWO different forces: Cavour\'s top-down diplomatic/military maneuvering from the Piedmontese monarchy, AND Garibaldi\'s bottom-up popular volunteer conquest (the "Red Shirts") of Sicily and the south, with Garibaldi voluntarily ceding his conquests to the Piedmontese crown. German unification, by contrast, was almost entirely top-down — Bismarck and the Prussian state and army drove the entire process, with far less role for independent popular volunteer movements.',
        "IDENTIFY THE TIMING DIFFERENCE. Italian unification unfolded over roughly a decade (1859-1870, from the war with Austria to the addition of Rome); German unification was compressed into a tighter sequence of three wars across seven years (1864-1871), each war building directly on the diplomatic isolation created by the previous one — a hallmark of Bismarck's realpolitik.",
        "CONNECT TO THE BROADER PATTERN. Both cases show 19th-century nationalism could be harnessed by a existing monarchical state (Piedmont-Sardinia; Prussia) to absorb and unify smaller neighboring states through calculated war — but the presence (Italy) or relative absence (Germany) of an independent popular/volunteer nationalist movement marks a real structural difference in HOW unification was achieved, even though both arrived at similar outcomes: a new, unified nation-state under an existing monarchy.",
      ],
      answer:
        "Both unifications share a core mechanism: deliberate war-making, not peaceful federation, drove the process — Cavour's 1859 war against Austria and Bismarck's engineered sequence of three wars (1864, 1866, 1870-71) alike. The structural difference is in who drove the process. Italian unification combined Cavour's top-down diplomatic and military maneuvering from the Piedmontese monarchy with Garibaldi's separate, bottom-up popular volunteer conquest of Sicily and southern Italy — conquests Garibaldi then ceded to the Piedmontese crown rather than keeping for himself. German unification was almost entirely top-down: Bismarck and the Prussian state and army engineered the entire sequence, with far less role for any independent popular nationalist movement. Both cases show an existing monarchical state (Piedmont-Sardinia; Prussia) using calculated war to absorb and unify smaller neighboring states into a single new nation-state, but the presence versus relative absence of a genuinely popular volunteer movement marks a real structural difference in how that outcome was reached.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Identify ONE method Cavour or Garibaldi used to advance Italian unification. (b) Explain ONE way Bismarck's realpolitik advanced German unification. (c) Explain ONE way Balkan nationalism challenged the Ottoman or Austro-Hungarian empire.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): correctly identifies ONE genuine method used by Cavour (diplomatic alliance with France, 1859 war with Austria) or Garibaldi (volunteer Red Shirt conquest of Sicily/southern Italy, 1860, ceded to Piedmont). No credit for a vague or inaccurate claim.",
            modelResponse:
              "Cavour, prime minister of Piedmont-Sardinia, allied with France against Austria in 1859 to seize northern Italian territory as part of the unification process.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way Bismarck\'s realpolitik advanced German unification — e.g. engineering successive wars (Denmark 1864, Austria 1866, France 1870-71) to isolate rivals and build Prussian-led unity. No credit for a vague or unconnected claim.',
            modelResponse:
              "Bismarck engineered a sequence of three wars — against Denmark (1864), Austria (1866), and France (1870-1871) — each one isolating a rival power and building momentum toward Prussian-led German unification, proclaimed at Versailles in 1871.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way Balkan (or comparable multiethnic-empire) nationalism challenged the Ottoman or Austro-Hungarian empire — e.g. Serbian, Greek, or Bulgarian independence movements seeking to break away along ethnic/national lines. No credit for a vague or unsupported claim.',
            modelResponse:
              'Balkan nationalist movements, including Serbian, Greek, and Bulgarian independence movements, sought to break away from Ottoman rule along ethnic and national lines throughout the 19th century, challenging the multiethnic, dynastic basis of Ottoman imperial authority.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-ancient-nations',
      kind: 'misconception_check',
      question:
        'True or false: nation-states like Italy and Germany were ancient, natural political units that simply reasserted themselves in the 19th century.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Projecting the modern existence of \"Italy\" and \"Germany\" as unified nation-states backward in time, and assuming their 19th-century unification was the natural reassertion of a long-standing nation rather than a deliberately constructed, recent political project.",
          correctsTo:
            "FALSE. Before 1861, \"Italy\" was a patchwork of separate kingdoms, duchies, and Austrian-controlled territories; before 1871, \"Germany\" was a collection of separate German-speaking states. Both were deliberately constructed through calculated 19th-century political and military processes — Cavour's diplomacy and Garibaldi's volunteer conquest in Italy's case; Bismarck's engineered wars in Germany's case — not the natural reassertion of ancient nations. Most 19th-century nation-states, and the nationalist movements (including Balkan movements and pan-movements) that helped build or challenge them, were recent constructions, not primordial political facts.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        '19th-century nationalism reframed political legitimacy around the nation/citizenry rather than dynastic monarchy — a direct descendant of revolutionary-era popular sovereignty.',
        'Italian unification (1861, Rome 1870) combined Cavour\'s top-down diplomacy/war (1859, allied with France against Austria) with Garibaldi\'s bottom-up volunteer conquest of the south (1860).',
        "German unification (1871, proclaimed at Versailles) was driven almost entirely top-down by Bismarck's realpolitik through three engineered wars (Denmark 1864, Austria 1866, France 1870-71).",
        'Balkan nationalist movements (Serbian, Greek, Bulgarian) sought to break the multiethnic Ottoman (and, similarly, Austro-Hungarian) empire apart along national lines — the opposite direction from Italian/German unification.',
        'Zionism and pan-movements (Pan-Slavism, Pan-Germanism) applied the same underlying nationalist logic across existing state borders.',
        'Most 19th-century nation-states were recent, deliberately constructed political projects, not ancient, natural units.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '5',
    cedTopic: '5.2',
    cedTitle: 'Nationalism and National Unification',
    sources: [{ type: 'plan', source: 'AP Plans Initiative — AP World History' }],
  },
};
