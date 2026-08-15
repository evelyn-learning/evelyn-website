/**
 * AP USH — World War II.
 *
 * From neutrality to Pearl Harbor, mobilization, the home front, ending the war.
 */

import type { LessonPlan } from '../types';

export const SEED_AP_USH_WWII: LessonPlan = {
  id: 'evelyn.ap.ush.wwii.v1',
  title: 'World War II',
  curriculum: 'CollegeBoard',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.wwii',
      description: 'Trace US entry into WWII, wartime mobilization and home-front transformation, key military decisions, and the war\'s legacy in shaping postwar America.',
      standard: 'AP-USH-7.10-7.13',
    },
  ],
  prerequisites: ['apush.great-depression'],
  followUps: ['apush.cold-war'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'WWII as the event that finally ends the Depression and remakes America.',
      script: 'In 1940, the US is still digging out of the Depression. In 1945, it is the world\'s pre-eminent military and industrial power, holds the atomic bomb, and is about to lead the postwar order. Few periods transform a country so quickly. Understanding WWII is understanding how the modern US was built.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-arc',
      kind: 'concept',
      goal: 'Neutrality → entry → mobilization → home front → ending.',
      keyIdeas: [
        'NEUTRALITY (1939-41): Neutrality Acts (mid-1930s) reflected Depression-era isolationism. As Europe fell, FDR pushed Cash-and-Carry (1939), Destroyers-for-Bases deal (1940), Lend-Lease (1941) to support Britain without entering. The Atlantic Charter (Aug 1941) framed war aims with Churchill before US entered.',
        'PEARL HARBOR (Dec 7, 1941): Japanese surprise attack on Pacific Fleet. Killed ~2,400 Americans. FDR\'s "date which will live in infamy" speech. Congress declares war on Japan; Germany and Italy declare war on US three days later.',
        'TWO-FRONT WAR: Europe (Germany first strategy with Allies) and Pacific (island-hopping against Japan). Major events: D-Day (June 6, 1944) opens western front; Battle of the Bulge (winter 1944-45); VE Day (May 8, 1945). Pacific: Midway (1942) turning point; Iwo Jima, Okinawa.',
        'HOME FRONT MOBILIZATION: War Production Board converts industry. War bond drives finance the war. Rationing of food, gasoline, rubber. Income taxes broadened ("victory tax") — modern federal tax base born.',
        'WORKFORCE: 16 million Americans served in military. Women entered factories ("Rosie the Riveter") — 6 million joined workforce. African Americans got industrial jobs (Great Migration accelerates), but in segregated units in the military and unequal civilian conditions. A. Philip Randolph\'s threatened march pressured FDR to issue Executive Order 8802 (1941) banning discrimination in defense industries.',
        'JAPANESE INTERNMENT: Executive Order 9066 (1942) authorized relocation of ~120,000 Japanese Americans (mostly West Coast, mostly US citizens) to camps. Korematsu v. US (1944) upheld it. Civil-liberties low point; reparations issued in 1988.',
        'DIPLOMATIC PLANNING: Tehran (1943), Yalta (Feb 1945), Potsdam (Jul 1945) shaped postwar. Yalta — Stalin, Roosevelt, Churchill agreed on Soviet entry into Pacific war and free elections in Eastern Europe (Stalin later violated). UN founded 1945.',
        'ENDING THE WAR: FDR dies April 1945; Truman becomes president. Atomic bombs on Hiroshima (Aug 6) and Nagasaki (Aug 9) — 200,000+ killed. Japan surrenders Aug 15 (VJ Day). Use of the bomb still debated: did it shorten the war and save lives, or was a moral threshold crossed unnecessarily? Some scholars emphasize Soviet entry into the Pacific war (Aug 8) as equally decisive.',
      ],
      vocabulary: [
        { term: 'Lend-Lease', definition: '1941 program lending war materiel to Allied nations before US formal entry.' },
        { term: 'Executive Order 9066', definition: '1942 order authorizing the internment of Japanese Americans on the West Coast.' },
        { term: 'Manhattan Project', definition: 'secret US program (1942-46) that developed the atomic bomb.' },
      ],
      estimatedMinutes: 7,
    },
    {
      id: 'worked-mobilization',
      kind: 'worked_example',
      problem: 'Explain how WWII mobilization transformed the role of the federal government and the labor force.',
      steps: [
        'GOVERNMENT: federal spending and personnel exploded. War Production Board controlled industry; Office of Price Administration set prices and rationed goods; income tax extended to most workers via withholding. Federal share of GDP jumped permanently from ~10% (1940) to over 20%.',
        'LABOR FORCE: with 16 million in uniform, civilian shortages opened doors. Women in factories — 6 million joined paid workforce. African Americans moved north and west for industrial jobs (Second Great Migration). Labor unions made no-strike pledges in exchange for wage protections.',
        'ENDURING SHIFT: many of these changes — broad income tax, women in workforce, federal economic management — DID NOT roll back after the war. The war\'s legacy is a much larger and more active federal government and a more diverse paid workforce.',
        'COSTS: civil-liberties violations (Japanese internment), persistent racial segregation in armed forces and industry despite EO 8802, deferred consumer goods.',
        'CONTRAST WITH WWI: WWI also expanded government, but rolled back rapidly post-war. WWII\'s expansion was much more durable, partly because it was followed by Cold War mobilization rather than disarmament.',
      ],
      answer: 'Federal spending, regulation, and income taxation grew permanently; women + African Americans entered industrial workforce — durable changes that outlasted the war.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Why was the Yalta Conference (Feb 1945) so consequential for the postwar world?',
      expectedAnswer: 'At Yalta, Roosevelt, Churchill, and Stalin agreed to divide Germany into occupation zones, planned the United Nations, and Stalin promised to enter the Pacific war and to allow free elections in Eastern Europe. Stalin\'s violation of the elections promise effectively divided Europe and seeded the Cold War.',
      responseFormat: 'free',
      hints: [
        'Three leaders, three big topics: Germany, UN, Eastern Europe.',
        'What promise did Stalin break that mattered most for the Cold War?',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-pearl-harbor-cause',
      kind: 'misconception_check',
      question: 'Did Pearl Harbor come out of nowhere — a sudden, unmotivated Japanese attack?',
      commonErrors: [
        {
          answer: 'yes',
          misconception: 'Treating Pearl Harbor as bolt-from-blue without the prior diplomatic context.',
          correctsTo: 'No. The US had been escalating economic pressure on Japan since its 1937 invasion of China — culminating in a steel and oil embargo in summer 1941 that threatened to cripple Japan\'s war economy. Japan calculated it had to either retreat from China (politically impossible) or seize Southeast Asian oil — and the US Pacific Fleet was the threat to that move. Pearl Harbor was a high-stakes attempt to disable that threat. The attack was a strategic shock, not a strategic riddle.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'US shifts from neutrality (Lend-Lease) to total war after Pearl Harbor.',
        'Mobilization permanently expands federal government, broadens income tax, brings women + Black workers into industry.',
        'D-Day, Yalta, Manhattan Project, Hiroshima/Nagasaki — major points.',
        'Internment + segregation = civil-rights low; postwar civil-rights movement builds on wartime contradictions.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did WWII set up both the Civil Rights Movement AND the Cold War?',
      hint: 'WWII fought against Nazi racism made segregation at home harder to defend (Truman desegregates military 1948; Brown 1954 builds on this). WWII also left only two superpowers — the US and the USSR — and Yalta\'s broken promises plus US monopoly on the bomb (briefly) created the Cold War antagonism. The same victory created both moral pressure for civil rights and geopolitical pressure for the next conflict.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
