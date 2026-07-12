/**
 * AP US Government & Politics — CED Unit 4.6-4.9: Ideology & Policy.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apgov.ideology-policy.v1`. Covers the liberal, conservative,
 * and libertarian ideological orientations and their general (non-fixed)
 * party alignment; fiscal policy (Keynesian vs. supply-side, exercised by
 * Congress and the President) vs. monetary policy (the Federal Reserve's
 * tools and independence); and ideology's role in social-policy debates.
 *
 * BALANCE NOTE: every ideology below (liberal, conservative, libertarian)
 * is described neutrally — what its adherents generally believe and why —
 * never as the "correct" or "incorrect" view, matching the source plan's
 * non-partisan framing. The same measured treatment applies to the
 * Keynesian/supply-side fiscal contrast.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APGOV_IDEOLOGY_POLICY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apgov.ideology-policy.v1',
  course: 'AP US Government & Politics',
  cedUnit: 4,
  cedTopic: '4.6-4.9',
  cedTitle: 'Ideology & Policy',
  planId: 'evelyn.ap.apgov.ideology-policy.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apgov.ideology-policy.v1' }],
  theory: [
    {
      loId: 'apgov.ideology-policy',
      kind: 'concept',
      title: 'ideology, defined',
      content:
        'A reasonably coherent set of beliefs about the proper role, size, and scope of government, spanning both economic and social policy. The three orientations below are described neutrally, as a political scientist would describe them — not ranked or advocated for.',
    },
    {
      loId: 'apgov.ideology-policy',
      kind: 'concept',
      title: 'liberal orientation',
      content:
        'Favors a more active government role in the economy — regulation of markets, a stronger social safety net, government programs aimed at reducing economic inequality — alongside generally more permissive positions on social/lifestyle issues (broader individual autonomy in personal matters). Liberals generally see government intervention as a legitimate, often necessary, tool for problems markets do not solve on their own.',
    },
    {
      loId: 'apgov.ideology-policy',
      kind: 'concept',
      title: 'conservative orientation',
      content:
        'Favors a more limited government role in the economy — lower taxes, less regulation, more reliance on markets and private enterprise — alongside generally more traditional or cautious positions on social/lifestyle issues, often emphasizing established institutions and gradual social change. Conservatives generally see excessive government intervention as more likely to create problems than to solve them.',
    },
    {
      loId: 'apgov.ideology-policy',
      kind: 'concept',
      title: 'libertarian orientation',
      content:
        'Favors a MINIMAL government role across BOTH economic and social/lifestyle policy — combining the economic preference for limited government and free markets (closer to the conservative economic position) with a strong preference for individual liberty on personal/social questions (closer to, or further than, the liberal social position). This combination — skepticism of government authority across the board, not selectively on one dimension — is what distinguishes libertarianism from a simple blend of the other two.',
    },
    {
      loId: 'apgov.ideology-policy',
      kind: 'concept',
      title: 'party-ideology alignment is a tendency, not a rule',
      content:
        'In contemporary American politics, the Democratic Party more often attracts liberal-leaning voters and candidates, and the Republican Party more often attracts conservative-leaning voters and candidates. Libertarian-leaning voters exist within both major parties and also organize as a separate, smaller Libertarian Party. These are general tendencies, not fixed categories: individual officeholders and voters in both parties hold a wide range of positions.',
    },
    {
      loId: 'apgov.ideology-policy',
      kind: 'definition',
      title: 'fiscal policy',
      content:
        'Government taxing and spending decisions, made by CONGRESS and the PRESIDENT (not the Federal Reserve), used to influence the overall economy. Two competing approaches: KEYNESIAN — actively managing total demand (increasing spending or cutting taxes to stimulate demand in a downturn); SUPPLY-SIDE — cutting taxes (particularly on business investment) and reducing regulation to increase the supply of goods and incentivize production. Both are approaches to the SAME lever, with different theories about which side of the economy to target.',
    },
    {
      loId: 'apgov.ideology-policy',
      kind: 'definition',
      title: 'monetary policy',
      content:
        'Management of the money supply and interest rates, controlled by the FEDERAL RESERVE ("the Fed") — an independent institution, NOT Congress or the President. Three classic tools: OPEN-MARKET OPERATIONS (buying/selling government securities to add or remove money from the banking system — the most frequently used tool); the DISCOUNT RATE (the rate the Fed charges banks that borrow directly from it — raising it tightens the money supply); RESERVE REQUIREMENTS (the share of deposits banks must hold rather than lend — raising it tightens the money supply).',
    },
    {
      loId: 'apgov.ideology-policy',
      kind: 'definition',
      title: 'Federal Reserve independence',
      content:
        'Fed governors serve long, staggered terms specifically designed to insulate monetary-policy decisions from short-term political pressure, so decisions rest on economic analysis rather than an elected official\'s reelection calendar. Neither Congress nor the President can directly override a specific Fed rate decision the way they could amend or veto ordinary legislation — even though the President nominates (and the Senate confirms) the Fed\'s leadership.',
    },
    {
      loId: 'apgov.ideology-policy',
      kind: 'concept',
      title: 'ideology in social policy',
      content:
        'The same liberal/conservative/libertarian framework that organizes economic-policy views also organizes positions on social-policy debates (e.g. criminal justice, education, personal/lifestyle regulation), though NOT always along identical lines to a person\'s economic-policy views — a voter\'s economic and social ideology do not always move together, part of why the libertarian orientation (minimal government on BOTH dimensions at once) is analytically distinct from simply averaging the liberal and conservative positions.',
    },
    {
      loId: 'apgov.ideology-policy',
      kind: 'trap',
      title: 'the Fed does not set fiscal policy',
      content:
        'Conflating the Federal Reserve\'s general role in the economy with the specific taxing-and-spending powers that belong to Congress and the President is one of the most common errors on this material. Quick check: if the action involves TAXES or government SPENDING, it\'s fiscal policy (Congress/President); if it involves INTEREST RATES or the MONEY SUPPLY, it\'s monetary policy (the Fed). The two are separate levers, run by separate institutions, sometimes used together in response to the same conditions.',
    },
  ],
  methods: [
    {
      title: 'Classify a policy action as fiscal or monetary, and by which approach',
      when_to_use:
        'Use this whenever a prompt describes a government or Fed action responding to economic conditions and asks what type it is.',
      steps: [
        'ASK WHICH INSTITUTION ACTED. Congress/the President -> fiscal policy. The Federal Reserve -> monetary policy.',
        'IF FISCAL, CHECK THE MECHANISM: boosting spending or cutting broad-based taxes to raise DEMAND -> Keynesian; cutting taxes on business investment or reducing regulation to raise SUPPLY/production -> supply-side.',
        'IF MONETARY, IDENTIFY THE TOOL: buying/selling securities -> open-market operations; changing the rate the Fed charges banks -> discount rate; changing the share of deposits banks must hold -> reserve requirements.',
        'DO NOT CONFLATE THE TWO LEVERS even when both respond to the same downturn — they operate through entirely separate institutions and tools.',
      ],
      example: {
        problem: 'Congress cuts middle-income taxes and raises infrastructure spending to fight a downturn. What kind of policy is this, and which approach?',
        solution:
          'Fiscal policy (Congress/President), reflecting the KEYNESIAN approach — actively managing aggregate demand through spending and tax changes.',
      },
      relatedLoIds: ['apgov.ideology-policy'],
    },
    {
      title: 'Match a described set of views to liberal, conservative, or libertarian',
      when_to_use:
        'Use this whenever a prompt describes a person\'s combined economic and social views and asks which ideological orientation fits.',
      steps: [
        'IDENTIFY THE ECONOMIC-POLICY PREFERENCE (more active government/regulation = liberal-leaning; more limited government/markets = conservative- or libertarian-leaning).',
        'IDENTIFY THE SOCIAL-POLICY PREFERENCE (more permissive/autonomy = liberal- or libertarian-leaning; more traditional/cautious = conservative-leaning).',
        'IF BOTH DIMENSIONS FAVOR MINIMAL GOVERNMENT, classify as LIBERTARIAN — the combination, not just one dimension, is the defining feature.',
        'DESCRIBE THE ORIENTATION NEUTRALLY, without labeling it correct or incorrect.',
      ],
      relatedLoIds: ['apgov.ideology-policy'],
    },
  ],
  pointers: [
    { content: 'The Fed sets MONETARY policy (money supply, interest rates); Congress/the President set FISCAL policy (taxes, spending) — never attribute tax or spending decisions to the Fed.', kind: 'trap' },
    { content: 'Libertarian is not simply "in between" liberal and conservative — it favors minimal government on BOTH economic AND social dimensions at once.', kind: 'trap' },
    { content: 'Keynesian and supply-side are both FISCAL-policy approaches (Congress/President) — don\'t treat one of them as monetary policy.', kind: 'tip' },
    { content: 'The Fed\'s independence (long, staggered governor terms) means neither Congress nor the President can directly override a specific rate decision the way they can amend or veto legislation.', kind: 'tip' },
    { content: 'Party-ideology alignment (Democrats-liberal, Republicans-conservative) is a general tendency, not a fixed rule — libertarian-leaning voters exist in both major parties.', kind: 'tip' },
    { content: 'Describe each ideology (liberal, conservative, libertarian) neutrally — what its adherents believe and why — never as the objectively "correct" position.', kind: 'tip' },
  ],
};
