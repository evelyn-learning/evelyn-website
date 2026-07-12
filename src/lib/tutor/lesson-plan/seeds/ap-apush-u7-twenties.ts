/**
 * AP US History — CED Unit 7.9-7.10: The 1920s.
 *
 * Period-7 fan-out content plan (follows the causes-of-revolution
 * calibration template — see ap-apush-u3-causes-of-revolution.ts for the
 * full rationale). No passage is wired to this plan per the Period-7
 * block spec — the worked example is a document-free analysis connecting
 * three episodes of traditionalist backlash. Harlem Renaissance writers
 * (Hughes, Hurston) and their works are described only, with no verbatim
 * quotation, since their work is copyrighted and no Passage is seeded.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U7_TWENTIES: LessonPlan = {
  id: 'evelyn.ap.apush.twenties.v1',
  title: 'U7.9-7.10 The 1920s',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.twenties',
      description:
        'Explain the growth of the consumer economy and mass culture in the 1920s, including the Harlem Renaissance; and explain the conflict between modernism and tradition, including immigration restriction, the revived Ku Klux Klan, the Scopes Trial, and Prohibition.',
      standard: 'AP-APUSH-7.9',
    },
  ],
  prerequisites: ['apush.wwi'],
  followUps: ['apush.depression-new-deal'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Complicate the "Roaring Twenties" prosperity narrative and frame the decade as a genuine culture war between modernism and tradition, not just a party.',
      script:
        "The 1920s get remembered as the \"Roaring Twenties\" — flappers, jazz, radios, a booming stock market. All of that is real. But the same decade also saw the second Ku Klux Klan reach several million members, a state put a teacher on trial for teaching evolution, Congress slam the door on most immigration for the first time in American history, and American farmers sink into a depression nearly a decade before the rest of the country followed them into one. The 1920s were not simply prosperous and fun; they were a decade where a genuinely new, modern, urban culture collided head-on with people determined to defend an older, more traditional vision of America — and neither side entirely won.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-twenties',
      kind: 'concept',
      goal: 'Explain the 1920s consumer economy and mass culture, the Harlem Renaissance, and the conflict between modernism and tradition.',
      keyIdeas: [
        "THE CONSUMER ECONOMY: the 1920s saw genuine, broad-based industrial growth, mass-production techniques (epitomized by Henry Ford's automobile assembly line), rising real wages for many industrial and white-collar workers, and a new consumer culture built on installment buying (credit), radio and print advertising, and mass-produced household goods and automobiles.",
        'MASS CULTURE: radio broadcasting and Hollywood film became truly national mass media for the first time, creating shared celebrity culture and entertainment across regions in a way earlier print-only media could not.',
        "THE HARLEM RENAISSANCE: a flowering of African American literary, artistic, and musical creativity centered in New York's Harlem neighborhood, fueled partly by the Great Migration's concentration of Black artists, writers, and musicians in Northern cities. Writers such as Langston Hughes and Zora Neale Hurston, and musicians central to the era's jazz scene, produced influential work exploring Black identity, culture, and everyday experience.",
        'MODERNISM VS. TRADITION: the decade\'s cultural changes — new gender norms epitomized by the "flapper," urban migration, greater immigrant and Black cultural visibility, and challenges to traditional religious authority — provoked a sharp traditionalist backlash.',
        'IMMIGRATION RESTRICTION: nativist anxiety about cultural change, combined with a preceding wave of Southern and Eastern European immigration, produced the Emergency Quota Act (1921) and the more restrictive National Origins Act (Immigration Act of 1924), which set strict, national-origin-based quotas sharply favoring Northern and Western European immigrants and effectively barring most immigration from Asia.',
        'THE SECOND KU KLUX KLAN: revived in 1915 and reaching a peak membership of several million in the early-to-mid 1920s, this reconstituted Klan expanded its targets beyond Reconstruction-era anti-Black violence to include Catholics, Jews, and immigrants, and operated openly in parts of the North and Midwest, not only the South.',
        'THE SCOPES TRIAL (1925): in Dayton, Tennessee, teacher John Scopes was tried — and convicted, on a technicality later overturned — for violating a state law banning the teaching of evolution in public schools; the trial\'s national press coverage highlighted the clash between religious fundamentalism and modern science/secular education.',
        'PROHIBITION: the 18th Amendment (ratified 1919) and the Volstead Act banned the manufacture and sale of alcohol nationwide beginning in 1920; enforcement proved difficult and the ban fueled organized crime (bootlegging), a strain that contributed to Prohibition\'s eventual repeal by the 21st Amendment in 1933.',
        'THE FARM DEPRESSION: agricultural prices, which had risen during wartime demand, collapsed once European farms resumed production after the war, leaving American farmers in a prolonged depression throughout the supposedly prosperous 1920s — a crucial exception to the decade\'s general prosperity.',
      ],
      vocabulary: [
        {
          term: 'National Origins Act (1924)',
          definition:
            'immigration law setting strict, national-origin-based quotas sharply favoring Northern and Western European immigrants and effectively barring most immigration from Asia.',
        },
        {
          term: 'Harlem Renaissance',
          definition:
            "flowering of African American literary, artistic, and musical creativity centered in Harlem, New York, in the 1920s, fueled partly by the Great Migration's concentration of Black artists and writers in Northern cities.",
        },
        {
          term: 'Second Ku Klux Klan',
          definition:
            'Klan organization revived in 1915, reaching several million members in the early-to-mid 1920s and expanding its targets beyond Black Americans to include Catholics, Jews, and immigrants, operating openly outside the South.',
        },
        {
          term: 'Scopes Trial (1925)',
          definition:
            "Tennessee trial of teacher John Scopes for violating a state law banning the teaching of evolution; nationally covered clash between religious fundamentalism and modern science education.",
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-modernism-vs-tradition',
      kind: 'worked_example',
      problem:
        'Connect three episodes from the 1920s — the National Origins Act (1924), the revived Ku Klux Klan, and the Scopes Trial (1925) — as expressions of the SAME underlying conflict. What is that conflict, and how does each episode express it differently?',
      steps: [
        'IDENTIFY THE SHARED THREAD. Each episode responds to a perceived threat from cultural change: rapid immigration and religious/ethnic diversity (National Origins Act, Klan) or the spread of modern scientific ideas challenging traditional religious belief (Scopes Trial). All three represent a traditionalist reaction seeking to defend an older vision of American identity against a changing, more urban, more diverse, more secular country.',
        "THE NATIONAL ORIGINS ACT (1924) EXPRESSES IT THROUGH LAW. Congress used strict, national-origin-based immigration quotas to freeze the country's ethnic composition roughly where it had been decades earlier, favoring Northern and Western Europeans and effectively barring most immigration from Asia — a LEGAL mechanism for resisting demographic change.",
        "THE REVIVED KU KLUX KLAN EXPRESSES IT THROUGH SOCIAL/POLITICAL ORGANIZING. Unlike its Reconstruction-era predecessor, the 1920s Klan targeted Catholics and Jews as well as Black Americans, operated openly (including in Northern and Midwestern states, not just the South), and functioned partly as a political and social organization defending a vision of a Protestant, white, native-born America against a genuinely more diverse and urbanizing country.",
        "THE SCOPES TRIAL EXPRESSES IT THROUGH A COURTROOM CLASH OVER EDUCATION. Rather than targeting an ethnic or religious group directly, the trial pitted religious fundamentalism (biblical literalism about creation) against the teaching of evolutionary science in public schools — a fight over what ideas the next generation would be taught, not over who could enter the country or hold power locally.",
        "IDENTIFY THE COMMON RESULT AND ITS LIMITS. In each case, the traditionalist side won a real, if partial and temporary, victory: the National Origins Act stayed in force until 1965; Scopes was convicted (though on a technicality later overturned, and the broader cultural argument over evolution was not settled); the Klan's political influence, while large in the early-to-mid 1920s, later collapsed amid internal scandals. None of these fights ended the underlying tension between modernizing, urban culture and traditionalist reaction — they are best read as episodes in an ongoing conflict, not a final resolution either way.",
        "STATE THE LINK TO THE COURSE THESIS. The 1920s were not simply a decade of consumer prosperity and mass culture; that same modernizing change generated a genuine, organized traditionalist backlash expressed through law (immigration quotas), social/political organizing (the Klan), and courtroom conflict (Scopes) — three different channels for the same underlying cultural argument.",
      ],
      answer:
        'All three episodes express a traditionalist backlash against the same underlying force: the 1920s\' rapid cultural change (urbanization, ethnic and religious diversity, modern science) challenging an older vision of American identity. The National Origins Act (1924) expressed this through law, using national-origin quotas to freeze the country\'s ethnic composition and effectively bar most Asian immigration. The revived Ku Klux Klan expressed it through social and political organizing, targeting Catholics, Jews, and immigrants alongside Black Americans and operating openly well beyond the South. The Scopes Trial (1925) expressed it through a courtroom fight over public education, pitting religious fundamentalism against the teaching of evolutionary science. Each traditionalist side won a real but partial and temporary victory, showing these were episodes in an ongoing cultural conflict between modernizing change and traditionalist reaction, not a final resolution of it.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE feature of the 1920s consumer economy or mass culture. (b) Briefly explain ONE piece of evidence for the era's conflict between modernism and tradition. (c) Briefly explain ONE group of Americans who did NOT share in the decade's prosperity, and why.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine feature of the era\'s consumer economy or mass culture — e.g. mass production of automobiles, installment buying/credit, radio or Hollywood film as national mass media. No credit for a vague statement ("the economy grew") with no specific feature named.',
            modelResponse:
              "One feature of the 1920s consumer economy was the growth of installment buying, which let ordinary Americans purchase automobiles, radios, and household appliances on credit rather than paying the full price upfront, dramatically expanding who could afford these new mass-produced goods.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific piece of evidence for the modernism-vs-tradition conflict — e.g. the National Origins Act (1924), the revived Ku Klux Klan, or the Scopes Trial (1925) — and connects it clearly to that conflict. No credit for evidence unconnected to the stated conflict.',
            modelResponse:
              "The Scopes Trial (1925) put a Tennessee teacher on trial for violating a state law banning the teaching of evolution, and its national press coverage highlighted a direct clash between religious fundamentalism and the teaching of modern science in public schools.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically identifies a group that did not share in 1920s prosperity and explains why — e.g. American farmers, whose crop prices collapsed once European agriculture recovered after the war, leaving them in a prolonged farm depression throughout the decade. No credit for a vague or unsupported claim.',
            modelResponse:
              "American farmers did not share in the decade's prosperity: crop prices, which had risen during wartime demand, collapsed once European farms resumed production after the war, leaving many American farmers in a prolonged agricultural depression throughout the supposedly prosperous 1920s.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-prosperous-for-everyone',
      kind: 'misconception_check',
      question:
        'True or false: the 1920s were a decade of general prosperity shared broadly across American society.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Generalizing from the decade\'s highly visible consumer culture and mass media (automobiles, radio, Hollywood) to assume prosperity was evenly distributed, rather than recognizing significant groups left out of it.',
          correctsTo:
            "FALSE. While the 1920s did see real, broad-based industrial growth and a new consumer culture, prosperity was far from universal. American farmers endured a prolonged agricultural depression throughout the decade, as crop prices collapsed once European farms resumed production after World War I — nearly a decade before the rest of the country entered the Great Depression. Many industrial workers also did not share proportionally in the decade's wage and productivity gains. The AP exam rewards recognizing this uneven distribution rather than describing the 1920s as broadly and evenly prosperous.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "Genuine consumer-economy growth (mass production, installment credit, radio and film as national mass media) coexisted with a persistent farm depression throughout the decade — prosperity was uneven.",
        "The Harlem Renaissance produced influential Black literary, artistic, and musical work (Hughes, Hurston, and others) centered in Harlem, fueled by the Great Migration's concentration of Black artists in Northern cities.",
        'Immigration restriction (the 1924 National Origins Act), the revived Ku Klux Klan, and the Scopes Trial (1925) were three different expressions of the same traditionalist backlash against modernizing cultural change.',
        'Prohibition (18th Amendment, 1920) banned alcohol nationwide but proved hard to enforce and fueled organized crime, contributing to its 1933 repeal.',
        'The 1920s were not simply prosperous and fun — they were a decade of genuine cultural conflict between modernizing, urban change and traditionalist reaction.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7.9-7.10',
    cedTitle: 'The 1920s',
    sources: [{ type: 'plan', source: 'AP Plans Initiative — AP US History' }],
  },
};
