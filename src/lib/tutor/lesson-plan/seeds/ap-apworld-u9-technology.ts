/**
 * AP World History: Modern — CED Unit 9.4-9.5: Technology, Communication,
 * and Health in the Age of Globalization.
 *
 * Follows the Unit-2 Vertical Slice's gold template (see
 * ap-apworld-u2-silk-roads.ts for the full rationale). Second stop in Unit 9:
 * the technological changes — the Green Revolution, medical advances,
 * jet travel, and the internet/mobile-phone revolution — that transformed
 * food production, health, movement, and communication after 1945, spreading
 * unevenly rather than diffusing at a single global pace.
 *
 * Anchor text: a described data table of global mobile-cellular subscriptions
 * and Internet use, 1990-2020 — evelyn.passage.apworld-ict-table.v1 — wired
 * in the concept segment as quantitative evidence of uneven, "leapfrogging"
 * technology diffusion, and re-examined closely in the worked example.
 *
 * Norman Borlaug is discussed only in authored description, with zero quoted
 * text, per the copyright/verbatim-source discipline (post-1928 figure).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U9_TECHNOLOGY: LessonPlan = {
  id: 'evelyn.ap.apworld.technology-communication.v1',
  title: 'U9.4-9.5 Technology, Communication, and Health',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.technology-communication',
      description:
        'Explain how the Green Revolution, medical advances, jet travel, and the internet/mobile-phone revolution transformed food production, health, and global communication after 1945, and how new technology diffused unevenly rather than at a single global pace.',
      standard: 'AP-APWORLD-9.4',
    },
  ],
  prerequisites: ['apworld.global-economy'],
  followUps: ['apworld.environment-disease'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see technological change after 1945 as uneven — arriving in different places by different routes, not on one universal timetable.',
      script:
        "Here's a pattern that surprises a lot of students: by the 2010s, many countries in sub-Saharan Africa had far more people using mobile phones than using landline telephones — not because they eventually caught up to landlines and then moved past them, but because many places never built out extensive landline networks at all. They jumped straight to mobile. That kind of \"skip a stage entirely\" pattern shows up again and again after 1945 — in farming, in medicine, in communication. Technology didn't spread evenly outward from wherever it was invented, like ripples on a pond. It arrived unevenly, sometimes decades apart, sometimes by unexpected shortcuts. Today we're tracing exactly how that uneven diffusion worked.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-technology-communication',
      kind: 'concept',
      goal: 'Explain the Green Revolution, key medical advances including smallpox eradication, jet travel, and internet/mobile-phone leapfrogging in the Global South as forms of uneven technological diffusion.',
      keyIdeas: [
        "THE GREEN REVOLUTION: from the 1940s through the 1960s, agricultural scientist Norman Borlaug (described here, never quoted) helped develop high-yield, disease-resistant wheat and rice varieties, paired with expanded irrigation and synthetic fertilizer use. Adopted widely across parts of Asia and Latin America, these methods sharply increased crop yields and helped several densely populated countries avoid predicted mass famines — though they also required capital for fertilizer and irrigation that not every farmer could access equally.",
        "MEDICAL ADVANCES: the spread of antibiotics and expanded vaccination programs after World War II sharply reduced deaths from infectious disease in much of the world. The World Health Organization's global vaccination campaign achieved the eradication of smallpox, certified in 1980 — the first, and so far only, human disease eliminated worldwide through deliberate public-health action.",
        "JET TRAVEL: commercial jet aircraft, widely adopted from the late 1950s onward, cut international travel times dramatically compared to propeller aircraft or ocean travel, making international business, tourism, and migration far more routine and accessible than in any earlier period.",
        "THE INTERNET AND MOBILE PHONES: computer networking and, later, the Internet developed from the 1960s-1990s, while mobile-cellular telephone networks expanded rapidly from the 1990s onward, together transforming global communication far faster than any earlier communication technology had spread.",
        "LEAPFROGGING IN THE GLOBAL SOUTH: rather than following the same sequence as wealthier countries — building extensive fixed telephone-line networks first, then adding mobile and internet access later — many countries across the Global South adopted mobile networks and mobile internet access directly, without first building out costly fixed-line infrastructure. This \"leapfrogging\" pattern let mobile technology reach large populations faster and more cheaply than a fixed-line-first path would have.",
        "DIFFUSION WAS UNEVEN, NOT UNIFORM: the Green Revolution reached some regions and crops far more than others; smallpox eradication required decades of sustained, coordinated global effort even after a vaccine already existed; and internet access, while spreading rapidly worldwide, still varied enormously by region and income level even by 2020. New technology consistently reached different places by different routes and at different speeds — never as one single, simultaneous global rollout.",
      ],
      vocabulary: [
        {
          term: 'Green Revolution',
          definition:
            'the development and spread, from the 1940s-1960s, of high-yield wheat and rice varieties paired with expanded irrigation and fertilizer use, sharply increasing crop yields across parts of Asia and Latin America.',
        },
        {
          term: 'smallpox eradication (1980)',
          definition:
            "the World Health Organization's global vaccination campaign that eliminated smallpox worldwide, certified in 1980 — the first human disease ever eradicated through deliberate public-health action.",
        },
        {
          term: 'leapfrogging',
          definition:
            'a pattern in which a country adopts a newer technology (like mobile networks) directly, skipping the older technology (fixed telephone lines) that wealthier countries built out first.',
        },
        {
          term: 'jet travel',
          definition:
            'commercial jet aircraft, widely adopted from the late 1950s, which cut international travel times dramatically and made international business, tourism, and migration far more routine.',
        },
      ],
      passageId: 'evelyn.passage.apworld-ict-table.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-ict-table',
      kind: 'worked_example',
      problem:
        'Analyze this data table: worldwide mobile-cellular subscriptions rose from about 11 million in 1990 to about 738 million in 2000, about 5.29 billion in 2010, and about 8.26 billion in 2020 — passing one subscription per person worldwide by the mid-2010s. Internet use is measured differently: no reliable single global figure exists for 1990 or 2000, so the earliest year shown is 2005 (15.6% of the world\'s population), rising to 28.4% in 2010, 39.9% in 2015, and 60.1% in 2020. Why does the table use a different starting year for each indicator, and what does the mobile-phone growth pattern suggest about how technology reached the Global South?',
      steps: [
        'SOURCE IT FIRST. This is a data table combining two related but separately tracked global indicators from the International Telecommunication Union: total mobile-cellular subscriptions, and the share of the world\'s population using the Internet.',
        'IDENTIFY WHY THE STARTING YEARS DIFFER. Mobile-subscription totals are reported back to 1990, but a single reliable global aggregate for Internet use is not published before 2005 — so the table honestly starts the internet-use row at 2005 rather than pretending an earlier figure exists, or misleadingly using 1990/2000 anyway.',
        'IDENTIFY THE HEADLINE PATTERN IN MOBILE GROWTH. Mobile subscriptions grew explosively and grew FIRST — passing one subscription per person worldwide by the mid-2010s, decades before internet use crossed the halfway mark of the world\'s population (shortly before 2020).',
        'CONNECT TO LEAPFROGGING. That gap — mobile phones reaching saturation well before the internet did — is consistent with the leapfrogging pattern: much of the Global South adopted mobile networks directly, without first building the fixed telephone-line and fixed-broadband infrastructure that had preceded mobile adoption in wealthier countries.',
        'STATE THE LINK TO THE COURSE THESIS. The table\'s two starting years and its growth pattern together support the concept\'s central claim: new communication technology did not diffuse evenly or on one timetable — it arrived by different routes (mobile-first vs. landline-first) and reached different milestones (subscription saturation vs. majority internet use) years or decades apart.',
      ],
      answer:
        'The table starts the internet-use row at 2005, later than the mobile-subscription row (1990), because no reliable single global aggregate for Internet use is published before 2005 — an honest limitation of the data rather than a misleading earlier estimate. The mobile-subscription figures show explosive, early growth: subscriptions passed one per person worldwide by the mid-2010s, well before Internet use crossed the halfway mark of the world\'s population shortly before 2020. That gap is consistent with the leapfrogging pattern discussed in the concept: much of the Global South adopted mobile networks and mobile internet access directly, without first building the costly fixed telephone-line infrastructure that had come first in wealthier countries — letting mobile technology reach large populations faster than a landline-first path would have allowed.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE technological or medical advance that transformed food production or health after 1945. (b) Explain ONE specific effect that advance had on human population or well-being. (c) Explain ONE way new communication technology diffused unevenly across different regions.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies a genuine post-1945 technological or medical advance — e.g. the Green Revolution, antibiotics/vaccines, or smallpox eradication. No credit for a vague statement ("medicine got better") with nothing specific named.',
            modelResponse:
              'One advance was the Green Revolution, the development of high-yield wheat and rice varieties paired with expanded irrigation and fertilizer use from the 1940s-1960s.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate effect connected to the advance in (a) — e.g. Green Revolution yields helping avoid predicted mass famines, or vaccination campaigns sharply reducing infectious-disease deaths. No credit for a vague or unconnected claim.',
            modelResponse:
              'The Green Revolution\'s higher crop yields helped several densely populated countries in Asia avoid the mass famines that population growth had been predicted to cause, though the benefits were not distributed equally to every farmer.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate example of uneven technology diffusion — e.g. mobile-phone leapfrogging in the Global South, or smallpox eradication requiring decades of coordinated effort. No credit for a vague or unsupported claim.",
            modelResponse:
              "Many countries in the Global South adopted mobile-phone networks directly, without first building extensive fixed telephone-line infrastructure the way wealthier countries had — a \"leapfrogging\" pattern that let mobile technology reach large populations faster than following the same sequence as richer countries would have.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-technology-diffuses-evenly',
      kind: 'misconception_check',
      question:
        'True or false: once a technology like mobile phones or high-yield crops existed, it spread to every region of the world at roughly the same pace and by the same route.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming that once invented, a technology diffuses evenly outward everywhere at the same speed, rather than by different routes and at different speeds depending on local infrastructure, wealth, and circumstances.',
          correctsTo:
            'FALSE. Technology consistently diffused unevenly and by different routes. The Green Revolution reached some crops and regions far more than others, and depended on farmers\' access to capital for fertilizer and irrigation. Smallpox eradication took the World Health Organization decades of sustained, coordinated campaigning even after a vaccine already existed. And mobile-phone and internet adoption followed completely different paths in different regions: much of the Global South "leapfrogged" straight to mobile networks, skipping the fixed-line infrastructure that had come first in wealthier countries — meaning the SAME technology reached different places by DIFFERENT routes, not on one uniform global timetable.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "The Green Revolution (1940s-1960s) paired high-yield crop varieties with irrigation and fertilizer, sharply raising yields across parts of Asia and Latin America but requiring capital not every farmer could access.",
        'Smallpox eradication, certified in 1980, was the first human disease ever eliminated worldwide, achieved only through decades of coordinated WHO vaccination campaigning.',
        'Jet travel, widely adopted from the late 1950s, made international travel and migration far more routine than in any earlier era.',
        'Mobile-cellular subscriptions passed one per person worldwide by the mid-2010s, well ahead of internet use crossing the halfway mark of the world\'s population.',
        'Much of the Global South "leapfrogged" straight to mobile networks and mobile internet, skipping the fixed-line infrastructure wealthier countries built out first — technology diffuses unevenly, not on one shared timetable.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '9',
    cedTopic: '9.4-9.5',
    cedTitle: 'Technology, Communication, and Health',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-ict-table.v1',
        chapter: '1990-2020',
        note: 'Global mobile-subscription and internet-use data table — anchor document for uneven, leapfrogging technology diffusion.',
      },
    ],
  },
};
