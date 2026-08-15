/**
 * Grades 9-12 Social Studies — WWII & US Home Front.
 */

import type { LessonPlan } from '../types';

export const SEED_G912_SS_WWII_HOME_FRONT: LessonPlan = {
  id: 'evelyn.g912.ss.wwii-home-front.v1',
  title: 'Grades 9-12 SS — WWII & Home Front',
  curriculum: 'CCSS',
  grade: '9-12',
  subject: 'ss',
  topic: 'g912-ss',
  locale: 'en',
  los: [
    {
      id: 'g912.ss.wwii-home-front',
      description: 'Analyse the US home front during WWII — economic mobilisation, social changes, and contradictions including Japanese American internment.',
      standard: 'NCSS 9-12 Time, Continuity, Change',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'WWII transformed Americans at home — economy, gender roles, race, government — even as it transformed the world abroad.',
      script: 'In December 1941, the US entered WWII. By 1945, the country was unrecognisable. Women filled factories. African Americans organised for civil rights. Japanese Americans were imprisoned. The federal government grew massively. Today we drill the home-front transformation.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-home-front',
      kind: 'concept',
      goal: 'Economy + women/work + race + Japanese American internment + civil rights seeds.',
      keyIdeas: [
        'ECONOMIC MOBILISATION: government spent ~$300 billion on war. Factories converted from cars to tanks, planes, ships. Unemployment dropped to 1%.',
        'WAR PRODUCTION: GDP roughly doubled 1940-1945. The Depression effectively ended via war spending.',
        'RATIONING: gasoline, sugar, meat, rubber. Citizens received ration books. Victory gardens.',
        'WOMEN IN WORKFORCE: 6+ million women entered factories ("Rosie the Riveter"). Many became welders, machinists, riveters. Most lost these jobs after the war but expectations had shifted permanently.',
        'AFRICAN AMERICANS: Great Migration accelerated — Black families moved north for war jobs. A. Philip Randolph threatened march on Washington (1941); FDR responded with EXECUTIVE ORDER 8802 banning racial discrimination in defence industries — a major civil rights advance.',
        'TUSKEGEE AIRMEN, "Double V Campaign" (victory abroad + victory at home over racism). 1.2 million Black Americans served in (segregated) armed forces.',
        'JAPANESE AMERICAN INTERNMENT: Executive Order 9066 (Feb 1942) sent ~120,000 Japanese Americans (most US citizens) to internment camps. Based on race, not evidence. Lost homes, businesses, freedom.',
        'KOREMATSU v. US (1944): Supreme Court UPHELD internment as constitutional. Later (1988) the US formally apologised and paid reparations.',
        'PROPAGANDA: posters, films, radio promoted unity, war bonds, sacrifice.',
        'GOVERNMENT GREW: Office of War Information, Office of Price Administration, War Production Board. Lasted past the war.',
        'SOCIAL TRANSFORMATIONS: war economy ended Depression; opened doors to women, minorities (and slammed others); accelerated suburbanisation; built defence industries that became Cold War spine.',
        'NUCLEAR ERA: Manhattan Project (1942-45) developed atomic bomb. Dropped on Hiroshima, Nagasaki (Aug 1945). Forever changed war and politics.',
      ],
      vocabulary: [
        { term: 'Rosie the Riveter', definition: 'cultural icon representing American women who worked in factories and shipyards during WWII.' },
        { term: 'internment', definition: 'forced confinement; in WWII US, the imprisonment of Japanese Americans in camps.' },
        { term: 'war bond', definition: 'a debt security that citizens bought to fund the war and that the government repaid with interest.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-internment',
      kind: 'worked_example',
      problem: 'Why is Japanese American internment considered one of the worst US civil rights violations of the 20th century?',
      steps: [
        '120,000 people forcibly removed and imprisoned — based ENTIRELY on Japanese ancestry.',
        '~70,000 were US CITIZENS by birth. Held without trials, charges, or evidence of disloyalty.',
        'No comparable internment of German Americans or Italian Americans, despite war with those countries — race was the determining factor.',
        'Lost homes, businesses, savings — confiscated or sold cheaply during forced relocation.',
        'In 1988, the US government FORMALLY APOLOGISED and paid $20,000 reparations to each surviving internee. President Reagan signed the Civil Liberties Act.',
        'It stands as a reminder that constitutional rights can be suspended by government during fear, and that race-based suspicion is incompatible with US ideals.',
      ],
      answer: 'Mass imprisonment by race, no evidence, US citizens — major civil-liberties violation.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'How did WWII change WOMEN\'s role in the US workforce?',
      expectedAnswer: '6+ million women entered jobs traditionally held by men — factories, shipyards, transit, military auxiliary units. "Rosie the Riveter" symbolised this. After the war, most women lost these jobs to returning veterans, but the experience of women working in industrial roles changed expectations of what women could do — laying groundwork for later feminist movements.',
      responseFormat: 'free',
      hints: [
        'Women entered jobs they had been excluded from.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-unified',
      kind: 'misconception_check',
      question: 'A student says "WWII America was united against the enemy." What\'s missing?',
      commonErrors: [
        {
          answer: 'America was united in WWII',
          misconception: 'Romanticising wartime unity while ignoring contradictions.',
          correctsTo: 'America was MOSTLY united against external enemies — but DEEPLY divided on race. Black soldiers fought in segregated units. Japanese Americans were imprisoned. African Americans organised the Double V campaign demanding both wartime victory AND racial equality at home. Wartime "unity" coexisted with race-based discrimination. Honest history holds both: shared sacrifice AND continued injustice.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'War economy ended Depression. GDP doubled.',
        'Rosie the Riveter — 6M women in factories.',
        'Black Americans: war jobs, Tuskegee Airmen, Double V.',
        'Japanese American internment: 120,000 imprisoned by race.',
        'Korematsu (1944) upheld internment; 1988 US apology + reparations.',
        'Government grew massively. Manhattan Project → nuclear age.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'How did WWII\'s home front contribute to the post-war Civil Rights Movement?',
      hint: '1) Black servicemen returned home determined that "if I fought for democracy abroad, I deserve it here". 2) Demographic shift: Great Migration brought Black voters into Northern political power. 3) Executive Order 8802 (defence-industry desegregation) was a federal civil-rights precedent. 4) US could no longer credibly champion democracy abroad while practising segregation at home — a contradiction Cold War rivals exploited. The seeds of the 1950s-60s Civil Rights Movement were planted in WWII.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
