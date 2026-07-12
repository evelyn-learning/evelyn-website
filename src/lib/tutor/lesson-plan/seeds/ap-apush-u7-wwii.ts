/**
 * AP US History — CED Unit 7.13-7.15: World War II.
 *
 * Period-7 fan-out content plan (follows the causes-of-revolution
 * calibration template — see ap-apush-u3-causes-of-revolution.ts for the
 * full rationale). Covers the path from neutrality through Lend-Lease to
 * Pearl Harbor, home-front mobilization, Japanese American internment,
 * military strategy, the atomic-bomb decision, and the Holocaust —
 * anchored by FDR's Four Freedoms speech (1941, concept) and Executive
 * Order 9066 (1942, worked example).
 *
 * Korematsu v. United States (1944) is discussed by DESCRIPTION only (no
 * Passage seeded for the case); EO 9066's excerpt is quoted only for its
 * operative authorization language, matching the passage's own scope. The
 * atomic-bomb decision is presented as a genuine, unresolved historical
 * debate rather than a settled verdict, per the block spec. Internment
 * and the Holocaust are presented factually and without embellishment.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U7_WWII: LessonPlan = {
  id: 'evelyn.ap.apush.wwii.v1',
  title: 'U7.13-7.15 World War II',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.wwii',
      description:
        'Explain the path from American neutrality through Lend-Lease to Pearl Harbor and U.S. entry into World War II; explain home-front mobilization and Japanese American internment; and explain wartime military strategy and the debate over the atomic-bomb decision.',
      standard: 'AP-APUSH-7.13',
    },
  ],
  prerequisites: ['apush.depression-new-deal'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame U.S. entry into WWII as a gradual tilt toward the Allies followed by a sudden, decisive shock, and set up the tension between wartime unity and wartime civil-liberties violations at home.',
      script:
        "For more than two years after World War II began in Europe in 1939, the United States was formally at peace — while, at the very same time, gradually supplying Britain with the ships, planes, and weapons that kept it in the fight. That careful middle position ended in a single morning: December 7, 1941, when Japan attacked Pearl Harbor, and the United States found itself fighting a two-ocean war seemingly overnight. What followed was the largest mobilization of American society in its history — and, within months, one of its most serious violations of Americans' civil liberties, when the government forced roughly 120,000 Japanese Americans, most of them citizens, from their homes without any individual charge. Today we're tracing both halves of that story: how the U.S. got into the war, and what the war demanded, and cost, at home.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-wwii',
      kind: 'concept',
      goal: 'Explain the path from neutrality to Pearl Harbor, home-front mobilization and Japanese American internment, wartime strategy, and the debate over the atomic-bomb decision.',
      keyIdeas: [
        'FROM NEUTRALITY TO LEND-LEASE: a series of Neutrality Acts (1935-1939) aimed to keep the U.S. out of another European war by restricting arms sales and loans to belligerents. As Nazi Germany\'s aggression escalated (invasion of Poland, September 1939) and Britain stood increasingly alone, Congress and FDR gradually eased these restrictions, culminating in the Lend-Lease Act (March 1941), which let the U.S. supply war materiel to Britain (and later the Soviet Union and others) without requiring immediate cash payment — a decisive, if still short-of-war, tilt toward the Allies.',
        'THE FOUR FREEDOMS (JANUARY 1941): in his annual message to Congress, FDR articulated four essential freedoms he argued a postwar world should secure for people everywhere — "freedom of speech and expression," freedom of worship, freedom from want, and freedom from fear — framing American support for the Allied cause in explicitly moral, universal terms even before the U.S. formally entered the war.',
        'PEARL HARBOR AND WAR ENTRY: seeking to secure resource-rich territory in Southeast Asia and remove the U.S. Pacific Fleet as an obstacle, Japan launched a surprise attack on the American naval base at Pearl Harbor, Hawaii, on December 7, 1941. Congress declared war on Japan the next day, and Germany and Italy (Japan\'s Axis allies) declared war on the United States days later, bringing the U.S. fully into both the Pacific and European theaters.',
        'HOME-FRONT MOBILIZATION: the war effort required an enormous mobilization of labor and industry. "Rosie the Riveter" became the era\'s iconic symbol of women entering industrial jobs vacated by men serving overseas. The "Double V" campaign, pushed by Black civil-rights leaders and the Black press, called for victory over fascism abroad AND over racial discrimination at home, even as the armed forces themselves remained racially segregated. The Bracero Program (begun 1942) brought Mexican agricultural and rail workers into the U.S. to address wartime labor shortages.',
        'JAPANESE AMERICAN INTERNMENT: citing military necessity, President Roosevelt signed Executive Order 9066 (February 1942), authorizing military commanders to exclude designated groups from military areas. Acting under this authority, the government forcibly removed and incarcerated roughly 120,000 Japanese Americans — the majority of them U.S. citizens — from the West Coast into inland camps for the duration of the war, without individualized charges or hearings. The Supreme Court upheld the program\'s constitutionality in Korematsu v. United States (1944); the incarceration was later officially acknowledged as a grave injustice, including a formal government apology and reparations payments under the Civil Liberties Act of 1988.',
        'MILITARY STRATEGY: Allied strategy prioritized defeating Germany first while containing Japan in the Pacific. Major turning points included the Battle of Midway (June 1942), which crippled Japan\'s carrier fleet and shifted momentum in the Pacific, and the D-Day invasion of Normandy (June 6, 1944), which opened a decisive Western European front against Germany.',
        'THE ATOMIC-BOMB DECISION: facing the prospect of a costly invasion of the Japanese home islands, President Truman authorized the use of atomic bombs on Hiroshima (August 6, 1945) and Nagasaki (August 9, 1945). Historians and the public have long debated this decision: some argue it was necessary to end the war quickly and avoid enormous American and Japanese casualties from an invasion; others argue Japan was already close to surrender, or that the bombings were partly aimed at demonstrating American power to the Soviet Union. This remains a genuine, unresolved historical argument rather than a settled verdict.',
        'THE HOLOCAUST: as Allied forces advanced into Germany in 1944-45, they discovered and liberated Nazi concentration and death camps, confirming the systematic genocide of some six million European Jews, along with Roma, disabled people, political prisoners, and other targeted groups, carried out by the Nazi regime — essential historical context for the war\'s moral stakes.',
      ],
      vocabulary: [
        {
          term: 'Lend-Lease Act (1941)',
          definition:
            'law letting the U.S. supply war materiel to Britain (and later the Soviet Union and others) without requiring immediate cash payment, a decisive tilt toward the Allies before formal U.S. entry into the war.',
        },
        {
          term: 'Four Freedoms',
          definition:
            "FDR's January 1941 articulation of freedom of speech and expression, freedom of worship, freedom from want, and freedom from fear as freedoms a postwar world should secure for people everywhere.",
        },
        {
          term: 'Executive Order 9066 / Korematsu',
          definition:
            "FDR's February 1942 order authorizing military exclusion zones, used to forcibly remove and incarcerate roughly 120,000 Japanese Americans; upheld by the Supreme Court in Korematsu v. United States (1944) and later acknowledged as a grave injustice (Civil Liberties Act, 1988).",
        },
        {
          term: 'Double V campaign',
          definition:
            "Black civil-rights and press campaign for victory over fascism abroad AND over racial discrimination at home, highlighting the contradiction of a segregated military fighting for freedom overseas.",
        },
      ],
      passageId: 'evelyn.passage.apush-four-freedoms.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-eo-9066',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Executive Order 9066 (February 19, 1942): "I hereby authorize and direct the Secretary of War, and the Military Commanders whom he may from time to time designate, whenever he or any designated Commander deems such action necessary or desirable, to prescribe military areas in such places and of such extent as he or the appropriate Military Commander may determine, from which any or all persons may be excluded, and with respect to which, the right of any person to enter, remain in, or leave shall be subject to whatever restrictions the Secretary of War or the appropriate Military Commander may impose in his discretion." What power does this order actually grant, and how was that power used?',
      steps: [
        'SOURCE IT FIRST. Executive Order 9066, signed by President Roosevelt on February 19, 1942, roughly ten weeks after Pearl Harbor — an official order authorizing military action, not a public speech.',
        'IDENTIFY WHAT THE ORDER ITSELF SAYS. The text authorizes the Secretary of War and designated military commanders to "prescribe military areas" of their own determination "from which any or all persons may be excluded," and to impose restrictions on any person\'s right to "enter, remain in, or leave" those areas "in his discretion." Notably, the order\'s own text does not name Japanese Americans specifically — it grants broad, race-neutral exclusionary authority to military commanders.',
        'DESCRIBE HOW THAT AUTHORITY WAS ACTUALLY USED. Military commanders used this broad authority to designate West Coast military areas and exclude Japanese Americans specifically from them — leading to the forced removal and incarceration of roughly 120,000 people, the large majority U.S. citizens, in inland camps for the duration of the war, without individualized charges or hearings.',
        'CONNECT TO KOREMATSU V. UNITED STATES (1944), DESCRIBED. Fred Korematsu challenged his conviction for defying the exclusion order; the Supreme Court upheld the program\'s constitutionality, reasoning that the wartime military necessity claimed by the government justified the exclusion, a ruling widely criticized by later legal scholars and historians and never actually overturned by the Court, though its reasoning has been repudiated in later cases.',
        'WEIGH THE GAP BETWEEN THE ORDER\'S LANGUAGE AND ITS EFFECT. The order\'s formally race-neutral wording ("any or all persons") stands in sharp contrast to how the authority was applied in practice — exclusively and specifically to Japanese Americans, not to German or Italian nationals or other groups, despite the U.S. also being at war with Germany and Italy.',
        'STATE THE LINK TO THE COURSE THESIS. Executive Order 9066 shows how a formally neutral grant of military authority became the legal basis for one of the most significant violations of American civil liberties in the twentieth century — carried out under a claim of wartime necessity the Supreme Court accepted in Korematsu, but that the government itself later officially acknowledged, decades afterward, as an injustice.',
      ],
      answer:
        'Executive Order 9066\'s own text grants a broad, formally race-neutral power: authorizing the Secretary of War and designated military commanders to prescribe military exclusion areas and restrict "any or all persons\'" movement in or out of them, at the commanders\' discretion. In practice, that authority was used specifically to exclude and forcibly remove Japanese Americans — roughly 120,000 people, most of them U.S. citizens — from West Coast military areas into inland incarceration camps for the duration of the war, without individualized charges or hearings, even though the order\'s wording did not name any group by race or ancestry. The Supreme Court upheld this program\'s constitutionality in Korematsu v. United States (1944), accepting the government\'s claim of wartime military necessity; the government later officially acknowledged the incarceration as a grave injustice under the Civil Liberties Act of 1988. The gap between the order\'s neutral language and its group-specific application is central to understanding how a wartime civil-liberties violation of this scale was carried out under a claim of legal authority.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE factor in the U.S. shift from neutrality toward entry into World War II. (b) Briefly explain ONE specific example of American home-front mobilization. (c) Briefly explain ONE way Japanese American internment represented a violation of civil liberties, despite the Supreme Court upholding it in Korematsu v. United States.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine factor — e.g. the Lend-Lease Act (1941) supplying the Allies, or the Japanese attack on Pearl Harbor (December 7, 1941). No credit for a vague statement ("the war got worse") with no specific factor named.',
            modelResponse:
              'One factor in the U.S. shift toward the Allies was the Lend-Lease Act (March 1941), which let the U.S. supply Britain and later the Soviet Union with war materiel without requiring immediate cash payment, a decisive tilt toward the Allied side even before formal U.S. entry into the war.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific home-front mobilization example (women entering industrial jobs / "Rosie the Riveter," the Bracero Program, the Double V campaign) and its significance. No credit for a vague or unsupported claim.',
            modelResponse:
              'One example of home-front mobilization was women entering industrial jobs in large numbers to replace men serving overseas, symbolized by the iconic "Rosie the Riveter," which was essential to sustaining wartime production of ships, planes, and munitions.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way internment violated civil liberties despite Korematsu — e.g. the large majority of those incarcerated were U.S. citizens, and none were charged with or convicted of any specific crime before being removed and confined. No credit for a vague or unsupported claim.',
            modelResponse:
              "Roughly 120,000 Japanese Americans were forcibly removed and incarcerated even though the large majority were U.S. citizens, and none were individually charged with, or convicted of, a specific crime before being confined — a group-based removal based on ancestry rather than any individualized evidence, which the government itself later formally acknowledged as an injustice under the Civil Liberties Act of 1988.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-internment-noncitizens-only',
      kind: 'misconception_check',
      question:
        'True or false: Japanese American internment during World War II targeted only non-citizens (Japanese immigrants ineligible for U.S. citizenship at the time), not American citizens.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming wartime detention only affected non-citizen "enemy aliens," rather than recognizing the program targeted people by ANCESTRY regardless of citizenship status.',
          correctsTo:
            'FALSE. The large majority of the roughly 120,000 people forcibly removed and incarcerated under Executive Order 9066 were U.S. citizens — many of them Nisei, the American-born children of Japanese immigrants. The program targeted people by ancestry and race, not by citizenship or any individualized evidence of disloyalty. This stands in sharp contrast to how the U.S. treated German and Italian nationals from the OTHER Axis countries: those groups faced more limited, individualized measures (case-by-case review of specific suspected individuals) rather than the sweeping, group-wide removal and incarceration applied to Japanese Americans regardless of citizenship. The AP exam rewards recognizing that citizenship did not protect Japanese Americans from internment, which is exactly why the program is regarded as such a serious civil-liberties violation.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Neutrality Acts (1935-1939) gave way to Lend-Lease (March 1941) as the U.S. gradually tilted toward the Allies before Japan\'s December 7, 1941 attack on Pearl Harbor brought full U.S. entry into the war.',
        'Home-front mobilization included women entering industrial jobs ("Rosie the Riveter"), the Bracero Program, and the Double V campaign for victory over fascism abroad and discrimination at home, even as the military remained segregated.',
        'Executive Order 9066 (February 1942) authorized the forced removal and incarceration of roughly 120,000 Japanese Americans, most of them citizens; the Supreme Court upheld the program in Korematsu v. United States (1944), later acknowledged as a grave injustice (1988).',
        'Allied strategy prioritized defeating Germany first; the Battle of Midway (1942) and D-Day (June 6, 1944) were decisive turning points. The atomic bombings of Hiroshima and Nagasaki (August 1945) remain a genuinely debated historical decision, not a settled verdict.',
        'The Holocaust — the systematic Nazi genocide of some six million European Jews and other targeted groups — was confirmed as Allied forces liberated concentration and death camps in 1944-45.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7.13-7.15',
    cedTitle: 'World War II',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-four-freedoms.v1',
        chapter: '1941',
        note: 'FDR, Four Freedoms speech — anchor document framing American support for the Allied cause in universal moral terms.',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-eo-9066.v1',
        chapter: '1942',
        note: 'Executive Order 9066 — anchor document for Japanese American internment, analyzed against Korematsu v. United States (described).',
      },
    ],
  },
};
