/**
 * AP US History — CED Unit 7.11-7.12: The Great Depression and the New Deal.
 *
 * Period-7 fan-out content plan (follows the causes-of-revolution
 * calibration template — see ap-apush-u3-causes-of-revolution.ts for the
 * full rationale). Covers the causes of the Depression, Hoover's limited
 * response, FDR's Hundred Days and the "3 Rs," the Second New Deal, the
 * court-packing fight, critics from left and right, and the New Deal
 * coalition's limits — anchored by FDR's First Inaugural Address (1933).
 *
 * CRITICAL: the passage's seeded excerpt is "the only thing we have to
 * fear is fear itself" (paragraph 1) and, after an ellipsis, "action, and
 * action now" (a later paragraph) — TWO separate spans from the SAME
 * address, joined by an ellipsis in the source passage. They are quoted
 * here exactly as the passage presents them (never smoothed into one
 * continuous, adjacent quote). The phrase "bold, persistent
 * experimentation" is from FDR's 1932 Oglethorpe University address, NOT
 * the First Inaugural — it is deliberately NOT quoted or attributed to
 * this document anywhere in this plan.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U7_DEPRESSION_NEW_DEAL: LessonPlan = {
  id: 'evelyn.ap.apush.depression-new-deal.v1',
  title: 'U7.11-7.12 The Great Depression and the New Deal',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.depression-new-deal',
      description:
        "Explain the causes of the Great Depression and Hoover's limited response; explain FDR's Hundred Days and the New Deal's relief, recovery, and reform programs, including the Wagner Act and Social Security Act; and evaluate the court-packing fight, critics from left and right, and the limits of the New Deal coalition.",
      standard: 'AP-APUSH-7.11',
    },
  ],
  prerequisites: ['apush.twenties'],
  followUps: ['apush.wwii-era'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame the New Deal as a rapid, improvisational response to an unprecedented crisis, not a single coherent program planned in advance.',
      script:
        "When Franklin Roosevelt took office in March 1933, roughly a quarter of the American workforce was unemployed, thousands of banks had failed, and the outgoing president had spent three years insisting the crisis would resolve itself. Roosevelt did not walk into office with one master plan. In his first hundred days, his administration pushed an extraordinary burst of emergency legislation through Congress — so much of it, so fast, that historians still argue about how coherent the New Deal actually was as a single program versus a rapid, improvisational response to an emergency. Today we're tracing what caused the Depression, why Hoover's limited response failed to contain it, what Roosevelt actually did, and why even his own supporters didn't all agree the New Deal went far enough — or too far.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-depression-new-deal',
      kind: 'concept',
      goal: "Explain the causes of the Great Depression, Hoover's limited response, FDR's Hundred Days and New Deal programs, the court-packing fight, and the New Deal's critics and limits.",
      keyIdeas: [
        'CAUSES OF THE GREAT DEPRESSION: the stock market crash of October 1929 exposed and accelerated deeper structural weaknesses — excessive speculation (including buying stock "on margin," with borrowed money), an unstable banking system of thousands of small, poorly regulated banks vulnerable to runs, the farm depression that had persisted through the 1920s, and badly uneven distribution of income that limited broad consumer demand.',
        "HOOVER'S LIMITED RESPONSE: President Hoover, committed to limited federal intervention and voluntary cooperation, eventually authorized some federal action — the Reconstruction Finance Corporation (1932) lent to banks and businesses — but resisted direct federal relief to individuals, which critics saw as too little, too late. The Bonus Army (1932) — WWI veterans marching on Washington to demand early payment of a promised bonus — was forcibly dispersed by the U.S. Army, badly damaging Hoover's public standing before the 1932 election.",
        'FDR\'S FIRST HUNDRED DAYS (1933): elected in 1932, Franklin Roosevelt moved with unprecedented speed once inaugurated in March 1933, pushing a wave of emergency legislation through Congress in his famous "Hundred Days," organized loosely around the "3 Rs": RELIEF (immediate aid for the unemployed and suffering), RECOVERY (getting the economy moving again), and REFORM (fixing the structural flaws that caused the crash).',
        'ALPHABET PROGRAMS (1933): relief and recovery agencies created rapidly included the Civilian Conservation Corps (CCC, employing young men in conservation work), the Federal Emergency Relief Administration (FERA), the Agricultural Adjustment Act (AAA, paying farmers to reduce production and raise prices), the National Recovery Administration (NRA, setting industry codes on wages/prices/production, later ruled unconstitutional), and the Tennessee Valley Authority (TVA, building dams and providing electricity to a poor rural region).',
        'THE SECOND NEW DEAL (1935): a shift toward more lasting structural reform included the Wagner Act (1935, guaranteeing workers the right to unionize and bargain collectively, and creating the National Labor Relations Board) and the Social Security Act (1935, creating old-age pensions and unemployment insurance) — both still in force today, unlike most of the 1933 "alphabet" agencies.',
        "THE COURT-PACKING FIGHT (1937): after the conservative-majority Supreme Court struck down several early New Deal measures (including the NRA and AAA) as unconstitutional, FDR proposed a plan to add up to six additional justices to the Court. The plan failed in Congress even among many of Roosevelt's own allies and is widely seen as a political misstep, though the Court's rulings shifted to a more favorable posture toward New Deal legislation around the same time regardless.",
        'CRITICS FROM LEFT AND RIGHT: the New Deal drew criticism from the political right, who saw it as a dangerous, unprecedented expansion of federal power and deficit spending threatening free enterprise (embodied in groups like the American Liberty League), and from the political left and populist demagogues, who argued it did not go far enough — Louisiana Senator Huey Long\'s "Share Our Wealth" plan proposed much more aggressive wealth redistribution, and Dr. Francis Townsend proposed generous universal old-age pensions, both pressuring FDR toward the more redistributive Second New Deal.',
        "THE NEW DEAL COALITION AND ITS LIMITS: the New Deal built a durable Democratic coalition of urban workers, labor unions, and racial and ethnic minorities in Northern cities alongside white Southerners, but many programs were administered in ways that limited benefits for African Americans (e.g. Social Security's initial exclusion of agricultural and domestic workers, occupational categories dominated by Black workers in much of the country) and, in various programs, offered women lower relief wages or fewer opportunities than men — a genuine limit on the New Deal's reach even as it reshaped American government's role.",
      ],
      vocabulary: [
        {
          term: 'Hundred Days / "3 Rs"',
          definition:
            'the burst of emergency legislation FDR pushed through Congress starting March 1933, organized loosely around Relief (immediate aid), Recovery (restarting the economy), and Reform (fixing structural causes of the crash).',
        },
        {
          term: 'Wagner Act (1935)',
          definition:
            "Second New Deal law guaranteeing workers the right to unionize and bargain collectively, and creating the National Labor Relations Board to enforce it.",
        },
        {
          term: 'Social Security Act (1935)',
          definition:
            'Second New Deal law creating old-age pensions and unemployment insurance; initially excluded agricultural and domestic workers, limiting its reach for many Black Americans.',
        },
        {
          term: 'court-packing plan (1937)',
          definition:
            "FDR's failed proposal to add up to six justices to the Supreme Court after it struck down early New Deal measures (NRA, AAA) as unconstitutional; widely seen as a political misstep.",
        },
      ],
      passageId: 'evelyn.passage.apush-fdr-first-inaugural.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-fdr-inaugural',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from FDR\'s First Inaugural Address (March 4, 1933): "So, first of all, let me assert my firm belief that the only thing we have to fear is fear itself—nameless, unreasoning, unjustified terror which paralyzes needed efforts to convert retreat into advance. ... This Nation is asking for action, and action now. Our greatest primary task is to put people to work." What is FDR arguing in each of these two passages, and how do they work together to justify the approach his administration was about to take?',
      steps: [
        'SOURCE IT FIRST. Franklin D. Roosevelt, First Inaugural Address, March 4, 1933 — delivered at the depth of the banking crisis, days before Roosevelt would declare a national "bank holiday," to an anxious public roughly a quarter of whom were unemployed.',
        'IDENTIFY THE FIRST CLAIM ("fear itself"). Roosevelt argues the country\'s deepest problem is psychological as much as economic: paralyzing, "unreasoning" fear that itself prevents the "efforts to convert retreat into advance." This is a direct rhetorical move to restore public confidence BEFORE describing any specific policy.',
        'IDENTIFY THE SECOND CLAIM ("action, and action now"). Later in the same address — note the ellipsis marking that this is a SEPARATE passage, not the sentence immediately following the first — Roosevelt shifts from diagnosing fear to demanding "action, and action now," naming putting people to work as the "greatest primary task." This is where the speech moves from reassurance to a call for concrete federal action.',
        'CONNECT THE TWO PASSAGES. Together, they form a two-step rhetorical strategy: first calm the fear that paralyzes people and markets alike, then use that restored confidence to justify immediate, assertive federal action — exactly the posture FDR\'s administration would take days later with the bank holiday and, within weeks, the flood of Hundred Days legislation.',
        'NOTE A COMMON MISATTRIBUTION TO AVOID. The famous phrase "bold, persistent experimentation" is often (incorrectly) associated with this inaugural address — it actually comes from a DIFFERENT FDR speech, at Oglethorpe University in 1932, before he was president. It should not be quoted as part of the First Inaugural.',
        "STATE THE LINK TO THE COURSE THESIS. This inaugural address set the psychological and rhetorical stage for the Hundred Days: calm the fear, then demand action — a pattern the alphabet programs that followed within weeks put directly into practice.",
      ],
      answer:
        'In the first passage, Roosevelt argues the country\'s deepest immediate problem is a paralyzing, "unreasoning" fear that itself blocks the "efforts to convert retreat into advance" — a rhetorical move to restore public confidence. In the second passage, from later in the same address (marked by an ellipsis, not adjacent to the first), Roosevelt shifts to demanding "action, and action now," naming putting people back to work as the nation\'s "greatest primary task." Together these two passages form a two-step strategy: first calm the paralyzing fear, then use the restored confidence to justify the immediate, assertive federal action his administration would take within days (the bank holiday) and weeks (the Hundred Days legislation). Note that the well-known phrase "bold, persistent experimentation" comes from a different FDR speech — Oglethorpe University, 1932 — not this inaugural address.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE cause of the Great Depression. (b) Briefly explain ONE specific New Deal program and the problem it was designed to address. (c) Briefly explain ONE criticism the New Deal drew from EITHER the political left or the political right.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine cause of the Depression — e.g. stock speculation (including buying on margin), an unstable, poorly regulated banking system prone to runs, the persistent 1920s farm depression, or uneven income distribution limiting consumer demand. No credit for a vague statement ("the stock market crashed") with no underlying structural cause named.',
            modelResponse:
              "One cause of the Great Depression was an unstable banking system made up of thousands of small, poorly regulated banks, which were highly vulnerable to bank runs once public confidence collapsed after the October 1929 stock market crash.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate New Deal program (CCC, AAA, NRA, TVA, Wagner Act, Social Security Act) and connects it to the problem it addressed. No credit for a disconnected or vague explanation.',
            modelResponse:
              "The Social Security Act (1935) created old-age pensions and unemployment insurance, addressing the problem of elderly and unemployed Americans having no reliable safety net once the Depression wiped out savings and jobs.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate criticism from the left (e.g. Huey Long\'s "Share Our Wealth" plan arguing the New Deal did not redistribute wealth aggressively enough) or the right (e.g. the American Liberty League arguing the New Deal dangerously expanded federal power and deficit spending). No credit for a vague or unsupported claim.',
            modelResponse:
              "From the political left, Louisiana Senator Huey Long criticized the New Deal as insufficiently redistributive, proposing his own \"Share Our Wealth\" plan for much more aggressive wealth redistribution than Roosevelt's actual programs provided.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-new-deal-ended-depression',
      kind: 'misconception_check',
      question:
        'True or false: the New Deal ended the Great Depression.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Crediting the New Deal with fully ending the Depression, when mass unemployment persisted throughout the 1930s and full economic recovery came from a different, later cause.",
          correctsTo:
            'FALSE. The New Deal provided real relief, meaningful recovery, and lasting structural reform (the Wagner Act, Social Security), but it did NOT end the Great Depression. Unemployment remained high throughout the 1930s, and a sharp recession hit again in 1937-38 after New Deal spending was cut back. Full economic recovery came only with the massive government spending and full-employment industrial mobilization of World War II after 1941 — not from New Deal programs themselves. The AP exam rewards distinguishing what the New Deal actually achieved (relief, partial recovery, lasting reform) from the much larger, later cause (wartime mobilization) that ended the Depression outright.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "The Depression's causes included stock speculation, an unstable banking system, the persistent 1920s farm depression, and uneven income distribution; Hoover's limited, voluntary-cooperation response (including forcibly dispersing the 1932 Bonus Army) proved inadequate.",
        'FDR\'s Hundred Days (1933) launched relief/recovery/reform "alphabet" programs (CCC, AAA, NRA, TVA); the Second New Deal (1935) added lasting structural reforms — the Wagner Act and Social Security Act.',
        "FDR's 1937 court-packing plan, a response to the Supreme Court striking down early New Deal measures, failed in Congress and is seen as a political misstep.",
        'Critics attacked the New Deal from the right (dangerous expansion of federal power — the American Liberty League) and the left (not redistributive enough — Huey Long, Francis Townsend).',
        'The New Deal coalition (urban workers, labor, Northern minorities, white Southerners) was durable but limited: many programs offered reduced benefits to African Americans and women. The New Deal did not end the Depression — full recovery came from World War II mobilization spending.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7.11-7.12',
    cedTitle: 'The Great Depression and the New Deal',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-fdr-first-inaugural.v1',
        chapter: '1933',
        note: 'FDR, First Inaugural Address — anchor document for "fear itself" and the "action, and action now" call for federal action.',
      },
    ],
  },
};
