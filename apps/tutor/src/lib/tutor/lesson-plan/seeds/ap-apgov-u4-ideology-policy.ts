/**
 * AP US Government & Politics — CED Unit 4.6-4.9: Ideology & Policy.
 *
 * Unit-4 content plan (follows the Unit-1/2/3 calibration template — see
 * ap-apgov-u1-federalism.ts for the shared Passage/rubric infra this plan
 * reuses). Closes Unit 4's public-opinion walk: the socialization lesson
 * covered how opinions FORM, the polling lesson covered how they're
 * MEASURED, and this lesson covers how they get organized into competing
 * political IDEOLOGIES and how those ideologies shape policy debates.
 *
 * Covers the liberal, conservative, and libertarian ideological
 * orientations; party-ideology alignment; fiscal policy (Keynesian vs.
 * supply-side approaches, exercised by Congress and the President) versus
 * monetary policy (the Federal Reserve's tools — open-market operations,
 * the discount rate, reserve requirements — and its independence); and
 * ideology's influence on social policy debates.
 *
 * BALANCE NOTE: every ideology discussed below (liberal, conservative,
 * libertarian) is presented descriptively — what its adherents generally
 * believe and why — never as the "correct" or "incorrect" view. The same
 * measured, non-partisan framing applies to the Keynesian/supply-side
 * fiscal-policy contrast. NO WIRED PASSAGE — no Task-1..11 passage models
 * ideological platforms or fiscal/monetary policy debate, so none is
 * cited here.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APGOV_U4_IDEOLOGY_POLICY: LessonPlan = {
  id: 'evelyn.ap.apgov.ideology-policy.v1',
  title: 'U4.6-4.9 Ideology & Policy',
  curriculum: 'AP',
  grade: '12',
  subject: 'ss',
  topic: 'ap-us-government',
  locale: 'en',
  los: [
    {
      id: 'apgov.ideology-policy',
      description:
        'Describe the liberal, conservative, and libertarian ideological orientations and their general alignment with the major political parties; distinguish fiscal policy (Keynesian vs. supply-side approaches) from monetary policy (the Federal Reserve\'s tools and its independence); and explain how ideology shapes social-policy debates.',
      standard: 'AP-APGOV-4.6/4.7/4.8/4.9',
    },
  ],
  prerequisites: ['apgov.public-opinion-measurement'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see "liberal," "conservative," and "libertarian" as internally coherent, describable belief systems rather than vague labels or insults, and to notice that most people mixing up "the Fed" with fiscal policy are making a specific, correctable category error.',
      script:
        "The last two lessons covered how opinions form and how they get measured. Today: how do individual opinions get organized into a broader political IDEOLOGY — a reasonably consistent set of beliefs about the proper role of government? You'll hear \"liberal,\" \"conservative,\" and \"libertarian\" thrown around constantly, often as labels rather than as actual descriptions of what someone believes. Our job today isn't to decide which of these is right — it's to describe, accurately and fairly, what each one actually holds, the way a textbook would, not the way a cable news shouting match would. Then we turn to something almost everyone gets wrong at least once: when the economy struggles, who's actually in charge of fixing it — Congress and the President, or \"the Fed\"? They are NOT the same lever, they don't pull in the same way, and mixing them up is one of the most common mistakes on this material.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-ideology-parties-fiscal-monetary',
      kind: 'concept',
      goal: 'Describe the liberal, conservative, and libertarian ideological orientations and their general party alignment; distinguish fiscal policy (Keynesian vs. supply-side) from monetary policy (the Fed\'s tools and independence); and explain ideology\'s role in social-policy debates.',
      keyIdeas: [
        'IDEOLOGY, DEFINED: a reasonably coherent set of beliefs about the proper role, size, and scope of government, spanning both economic and social policy. The three orientations below are described neutrally here — as a political scientist would describe them — not ranked or advocated for.',
        'LIBERAL ORIENTATION (as generally used in American politics): favors a more active government role in the economy — regulation of markets, a stronger social safety net, and government programs aimed at reducing economic inequality — alongside generally more permissive positions on social/lifestyle issues (favoring broader individual autonomy in personal and social matters). Liberals generally see government intervention as a legitimate, often necessary, tool for addressing problems markets do not solve on their own.',
        'CONSERVATIVE ORIENTATION: favors a more limited government role in the economy — lower taxes, less regulation, more reliance on markets and private enterprise — alongside generally more traditional or cautious positions on social/lifestyle issues, often emphasizing established institutions and gradual, rather than rapid, social change. Conservatives generally see excessive government intervention as more likely to create problems (inefficiency, dependency, unintended consequences) than to solve them.',
        'LIBERTARIAN ORIENTATION: favors a MINIMAL government role across BOTH economic and social/lifestyle policy — combining the economic preference for limited government and free markets (closer to the conservative economic position) with a strong preference for individual liberty on personal/social questions (closer to, or further than, the liberal social position). Libertarians are generally skeptical of government authority across the board, not selectively on economic OR social issues alone — this combination is what distinguishes the libertarian orientation from a simple blend of the other two.',
        'PARTY-IDEOLOGY ALIGNMENT (A GENERAL TENDENCY, NOT A RULE): in contemporary American politics, the Democratic Party more often attracts liberal-leaning voters and candidates, and the Republican Party more often attracts conservative-leaning voters and candidates. Libertarian-leaning voters exist within both major parties and also organize as a separate, much smaller Libertarian Party. These are general tendencies, not fixed categories — individual voters and officeholders in both major parties hold a wide range of positions, and plenty of self-described moderates and independents do not fit neatly into either party\'s typical ideological profile.',
        'FISCAL POLICY: government taxing and spending decisions, made by CONGRESS and the PRESIDENT (not the Federal Reserve), used to influence the overall economy. FISCAL POLICY HAS TWO COMPETING APPROACHES commonly discussed in this unit: the KEYNESIAN approach holds that government should actively manage total demand in the economy — increasing spending or cutting taxes to stimulate demand during a downturn, and potentially pulling back during strong growth — treating deliberate, active fiscal intervention as a normal and necessary economic tool. The SUPPLY-SIDE approach instead emphasizes cutting taxes (particularly on business investment and production) and reducing regulation to increase the SUPPLY of goods and services and incentivize investment, holding that a more favorable environment for producers benefits the broader economy. Both are approaches to the SAME lever (fiscal policy) with different theories about which side of the economy to target.',
        'MONETARY POLICY — A DIFFERENT LEVER ENTIRELY: monetary policy is the management of the money supply and interest rates, and it is controlled by the FEDERAL RESERVE ("the Fed") — an independent institution, NOT Congress or the President. The Fed\'s three classic tools: OPEN-MARKET OPERATIONS (buying or selling government securities to add or remove money from the banking system — its most frequently used tool); the DISCOUNT RATE (the interest rate the Fed charges banks that borrow directly from it — raising it discourages bank borrowing and tends to tighten the money supply, lowering it does the opposite); and RESERVE REQUIREMENTS (the percentage of deposits banks must hold in reserve rather than lend out — raising the requirement reduces how much banks can lend, tightening the money supply).',
        'THE FED\'S INDEPENDENCE: Federal Reserve governors serve long, staggered terms specifically designed to insulate monetary-policy decisions from short-term political pressure — the idea being that decisions about interest rates and the money supply should rest on economic analysis rather than on an elected official\'s reelection calendar. This independence is also why the common claim that the President or Congress "sets" monetary policy is inaccurate: the Fed\'s structure is deliberately built to keep monetary policy at arm\'s length from the elected branches, even though the President nominates (and the Senate confirms) the Fed\'s leadership.',
        'IDEOLOGY IN SOCIAL POLICY: the same liberal/conservative/libertarian framework that organizes economic-policy views also organizes positions on social-policy debates (e.g. criminal justice policy, education policy, personal/lifestyle regulation), though NOT always along the identical economic-policy lines — a voter\'s economic-policy ideology and social-policy ideology do not always move together, which is part of why the libertarian orientation (limited government on BOTH dimensions at once) is analytically distinct from simply averaging the liberal and conservative positions.',
      ],
      vocabulary: [
        {
          term: 'ideology (political)',
          definition:
            'a reasonably coherent set of beliefs about the proper role, size, and scope of government across economic and social policy.',
        },
        {
          term: 'libertarian orientation',
          definition:
            'a political orientation favoring minimal government across both economic policy (free markets, low regulation) and social/lifestyle policy (broad individual liberty) — distinct from favoring limited government on only one dimension.',
        },
        {
          term: 'fiscal policy',
          definition:
            "government taxing and spending decisions made by Congress and the President, used to influence the overall economy; includes competing Keynesian (demand-management) and supply-side (production-incentive) approaches.",
        },
        {
          term: 'monetary policy',
          definition:
            "management of the money supply and interest rates, controlled by the independent Federal Reserve — not Congress or the President — through tools including open-market operations, the discount rate, and reserve requirements.",
        },
        {
          term: 'Federal Reserve independence',
          definition:
            "the Fed's structural insulation (long, staggered governor terms) from short-term political pressure, intended to base monetary-policy decisions on economic analysis rather than electoral considerations.",
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-fiscal-vs-monetary-recession-response',
      kind: 'worked_example',
      problem:
        'The national economy enters a sharp downturn. Three separate actions are proposed in response: (1) Congress passes, and the President signs, a bill temporarily increasing government spending on infrastructure projects and cutting taxes for middle-income households, aiming to boost overall demand in the economy. (2) A different lawmaker instead proposes cutting taxes on business investment and reducing regulations on production, arguing this will increase the economy\'s productive capacity. (3) Separately, the Federal Reserve lowers the discount rate and begins purchasing government securities on the open market. (a) Classify each of the three actions as fiscal or monetary policy, and identify which institution is responsible for each. (b) Of the two fiscal-policy proposals, identify which reflects a Keynesian approach and which reflects a supply-side approach, and explain the reasoning behind each. (c) Explain why the Federal Reserve\'s independence means the third action is not "vetoed" or directly overridden by Congress or the President the way ordinary legislation could be.',
      steps: [
        'CLASSIFY EACH ACTION (PART A). Action 1 (Congress and the President increasing spending and cutting taxes) is FISCAL POLICY, made by the legislative and executive branches. Action 2 (cutting business taxes, reducing regulation) is ALSO fiscal policy — it is still a tax-and-spending-adjacent decision made through Congress, just a different approach. Action 3 (the Fed lowering the discount rate and buying securities) is MONETARY POLICY, made by the independent Federal Reserve — a completely separate institution from Congress and the President.',
        'CLASSIFY THE TWO FISCAL APPROACHES (PART B). Action 1 — boosting government spending and cutting middle-income taxes specifically to increase overall DEMAND during a downturn — reflects the KEYNESIAN approach: deliberately managing aggregate demand through active fiscal intervention. Action 2 — cutting taxes on business investment and reducing regulation to expand the economy\'s productive capacity — reflects the SUPPLY-SIDE approach: incentivizing production and investment rather than directly boosting demand.',
        'EXPLAIN THE FED\'S INDEPENDENCE (PART C). The Federal Reserve is structurally independent: its governors serve long, staggered terms specifically so monetary-policy decisions are insulated from short-term political pressure. Congress and the President cannot directly override a specific Fed rate decision the way they could amend or veto a piece of fiscal legislation — the Fed\'s decisions on tools like the discount rate and open-market operations are made by the Fed\'s own governors, based on their independent economic judgment, not through the ordinary legislative process.',
        'DO NOT CONFLATE THE TWO LEVERS. Even though all three actions respond to the same downturn, they operate through entirely separate institutions and separate policy tools — fiscal policy through Congress/the President\'s taxing-and-spending power, monetary policy through the Fed\'s control of the money supply and interest rates. A response that describes the Fed as "setting fiscal policy," or Congress as "setting the discount rate," has confused the two levers.',
      ],
      answer:
        'Actions 1 and 2 are both FISCAL policy, made by Congress and the President; Action 3 is MONETARY policy, made by the independent Federal Reserve. Of the two fiscal actions, Action 1 (boosting spending and cutting middle-income taxes to raise demand) reflects the KEYNESIAN approach, while Action 2 (cutting business taxes and regulation to expand productive capacity) reflects the SUPPLY-SIDE approach. Because the Federal Reserve is structurally independent — its governors serve long, staggered terms designed to insulate monetary decisions from short-term political pressure — Congress and the President cannot directly override or veto the Fed\'s discount-rate or open-market-operations decisions the way they could amend or veto ordinary fiscal legislation; the Fed\'s decisions rest on its own governors\' independent judgment.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-concept-application',
      kind: 'try_yourself',
      problem:
        "Concept Application practice. A voter describes her views this way: \"I think the government should stay out of how businesses run and keep taxes low, but I also don't think the government has any business regulating people's personal or lifestyle choices either.\" Separately, in response to slowing economic growth, a news report states: \"The President is under pressure to convince the Federal Reserve to cut taxes on middle-income families.\" (a) Identify which of the three ideological orientations covered in this lesson (liberal, conservative, libertarian) best matches the voter's described views, and explain why using BOTH the economic and social parts of her statement. (b) Identify the factual error in the news report's sentence, and correct it. (c) Explain, using the concept of Federal Reserve independence, why the news report's premise — that the President could directly convince the Fed to take a specific action — somewhat overstates how much control an elected official actually has over the Fed's decisions.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): identifies the LIBERTARIAN orientation and explains it using both the economic (government should stay out of business/taxes) AND social (no regulation of personal/lifestyle choices) parts of her statement, noting that combining minimal government on both dimensions is the libertarian hallmark. No credit for identifying liberal or conservative, or for using only one half of her statement.',
            modelResponse:
              "Her views best match the LIBERTARIAN orientation. She favors limited government on the economic dimension (staying out of how businesses operate, keeping taxes low) AND on the social dimension (no government regulation of personal or lifestyle choices) — combining minimal government across both areas at once is the defining feature of the libertarian orientation, distinguishing it from conservative views (limited government economically, but often more traditional on social policy) or liberal views (more government involvement economically, more permissive socially).",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): identifies that tax policy is FISCAL policy, controlled by Congress and the President, not the Federal Reserve — the report incorrectly attributes a tax decision to the Fed. Correction must state that the President/Congress, not the Fed, would set tax policy. No credit for a response that treats the sentence as accurate or misidentifies the error.',
            modelResponse:
              'The factual error is attributing tax policy to the Federal Reserve. Cutting taxes is a FISCAL policy tool, controlled by Congress and the President — not something the Federal Reserve does. The corrected statement would be that the President is under pressure to work with Congress to cut taxes on middle-income families, or, if referring to the Fed at all, that the President might want the Fed to lower interest rates (a monetary policy tool), not cut taxes.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains that the Fed\'s independence (long, staggered governor terms designed to insulate it from short-term political pressure) means the President cannot directly order or control a specific Fed decision, even though the President nominates Fed leadership. No credit for a response that claims the President has no connection at all to the Fed, or that omits the independence/insulation reasoning.',
            modelResponse:
              "The Federal Reserve is structurally independent: its governors serve long, staggered terms specifically to insulate monetary-policy decisions from short-term political pressure, so the President cannot simply direct the Fed to take a specific action the way the President can push Congress on fiscal legislation. While the President does nominate (and the Senate confirms) the Fed's leadership, day-to-day monetary-policy decisions rest with the Fed's own governors exercising independent judgment, which is why the news report's framing overstates direct presidential control over the Fed.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-fed-sets-fiscal-policy',
      kind: 'misconception_check',
      question:
        'True or false: the Federal Reserve sets fiscal policy, such as federal tax rates and government spending levels.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Conflating the Federal Reserve\'s role in the economy generally with the specific, separate powers of taxing and spending, which belong to a different set of institutions entirely.',
          correctsTo:
            "FALSE. The Federal Reserve does NOT set fiscal policy. FISCAL policy — federal tax rates and government spending levels — is controlled by CONGRESS and the PRESIDENT, through the ordinary legislative process. The Federal Reserve instead controls MONETARY policy: the money supply and interest rates, using tools like open-market operations, the discount rate, and reserve requirements. The two are separate levers, run by separate institutions, often used at the same time in response to the same economic conditions (as in this lesson's worked example) — but mixing up which institution controls which lever is one of the most common errors on this material. A quick check: if the action involves TAXES or government SPENDING, it's fiscal policy (Congress/President); if it involves INTEREST RATES or the MONEY SUPPLY, it's monetary policy (the Fed).",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Liberal, conservative, and libertarian are described neutrally here as distinct, coherent orientations: liberal favors more active government economically and more permissive government socially; conservative favors limited government economically and more traditional government socially; libertarian favors minimal government on BOTH dimensions at once.',
        'Party-ideology alignment is a general tendency, not a fixed rule: Democrats more often lean liberal, Republicans more often lean conservative, and libertarian-leaning voters exist in both major parties and their own smaller party.',
        'FISCAL policy (taxing/spending) is set by Congress and the President; it includes competing Keynesian (active demand management) and supply-side (production/investment incentives) approaches — both are still fiscal policy.',
        'MONETARY policy (the money supply and interest rates) is set by the independent FEDERAL RESERVE, using open-market operations, the discount rate, and reserve requirements — a completely separate lever from fiscal policy, run by a separate, independent institution.',
        'The Fed\'s independence (long, staggered governor terms) insulates monetary-policy decisions from short-term political pressure — neither Congress nor the President can directly override a specific Fed decision the way they can amend or veto fiscal legislation.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.6-4.9',
    cedTitle: 'Ideology & Policy',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US Government & Politics' },
    ],
  },
};
