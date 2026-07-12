/**
 * AP US History — Unit 7 CED 7.11-7.12: The Great Depression and the New
 * Deal.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.depression-new-deal.v1`. Covers the causes of the
 * Depression, Hoover's limited response, FDR's Hundred Days and the "3
 * Rs," the Second New Deal, the court-packing fight, critics from left and
 * right, and the New Deal coalition's limits.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_DEPRESSION_NEW_DEAL: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.depression-new-deal.v1',
  course: 'AP United States History',
  cedUnit: 7,
  cedTopic: '7.11-7.12',
  cedTitle: 'The Great Depression and the New Deal',
  planId: 'evelyn.ap.apush.depression-new-deal.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.depression-new-deal.v1' }],
  theory: [
    {
      loId: 'apush.depression-new-deal',
      kind: 'cause',
      title: 'causes of the Great Depression',
      content:
        'The October 1929 stock market crash exposed deeper weaknesses: speculation (buying stock "on margin"), an unstable, poorly regulated banking system prone to runs, the persistent 1920s farm depression, and uneven income distribution limiting consumer demand.',
    },
    {
      loId: 'apush.depression-new-deal',
      kind: 'event',
      title: "Hoover's limited response",
      content:
        'Hoover authorized some federal action (Reconstruction Finance Corporation, 1932) but resisted direct relief to individuals. The Bonus Army (1932) — WWI veterans demanding early bonus payment — was forcibly dispersed by the Army, damaging Hoover before the 1932 election.',
    },
    {
      loId: 'apush.depression-new-deal',
      kind: 'definition',
      title: 'the Hundred Days and the "3 Rs"',
      content:
        'FDR (inaugurated March 1933) pushed a burst of emergency legislation organized loosely around Relief (immediate aid), Recovery (restarting the economy), and Reform (fixing structural causes).',
    },
    {
      loId: 'apush.depression-new-deal',
      kind: 'framework',
      title: 'alphabet programs (1933)',
      content:
        'CCC (conservation jobs), FERA (relief), AAA (paying farmers to cut production), NRA (industry codes, later ruled unconstitutional), TVA (dams/electricity for a poor rural region).',
    },
    {
      loId: 'apush.depression-new-deal',
      kind: 'definition',
      title: 'the Second New Deal (1935): Wagner Act and Social Security Act',
      content:
        'The Wagner Act guaranteed workers\' right to unionize/bargain collectively (created the NLRB); the Social Security Act created old-age pensions and unemployment insurance — both still in force today, unlike most 1933 agencies.',
    },
    {
      loId: 'apush.depression-new-deal',
      kind: 'event',
      title: 'the court-packing fight (1937)',
      content:
        'After the Court struck down the NRA and AAA as unconstitutional, FDR proposed adding up to six justices; the plan failed even among his allies and is seen as a political misstep.',
    },
    {
      loId: 'apush.depression-new-deal',
      kind: 'framework',
      title: 'critics from left and right',
      content:
        'The right (American Liberty League) saw dangerous federal overreach and deficit spending; the left/populists (Huey Long\'s "Share Our Wealth," Francis Townsend\'s pension plan) argued the New Deal did not go far enough, pressuring FDR toward the Second New Deal.',
    },
    {
      loId: 'apush.depression-new-deal',
      kind: 'trap',
      title: "the New Deal coalition's limits",
      content:
        'The coalition (urban workers, labor, Northern minorities, white Southerners) was durable but limited: Social Security initially excluded agricultural/domestic workers (disproportionately Black), and women often received lower relief wages or fewer opportunities.',
    },
  ],
  methods: [
    {
      title: 'Read a two-part speech excerpt with an ellipsis as two distinct, non-adjacent claims',
      when_to_use:
        'Use this when a passage excerpt joins two spans from different parts of the same document with an ellipsis (e.g. FDR\'s First Inaugural).',
      steps: [
        'Treat the text before and after the ellipsis as two SEPARATE claims, not one continuous sentence.',
        'Identify what each span argues on its own.',
        'Ask how the two claims work together rhetorically (e.g. reassurance, then a call to action).',
        'Never invent a smoothed, adjacent version of the quote, and never attribute a phrase from a DIFFERENT speech to this document.',
      ],
      example: {
        problem: 'FDR\'s First Inaugural: "fear itself" ... "action, and action now."',
        solution:
          'First claim diagnoses paralyzing fear; second (separate, later) claim demands immediate federal action — together, a two-step strategy of reassurance then action. "Bold, persistent experimentation" is a DIFFERENT 1932 speech, not this one.',
      },
      relatedLoIds: ['apush.depression-new-deal'],
    },
  ],
  pointers: [
    { content: 'The New Deal did NOT end the Depression — unemployment stayed high through the 1930s (a 1937-38 recession followed spending cuts); WWII mobilization spending ended it.', kind: 'common-error' },
    { content: 'Never attribute "bold, persistent experimentation" to FDR\'s First Inaugural — it is from his 1932 Oglethorpe University address.', kind: 'gotcha' },
    { content: 'The court-packing plan (1937) FAILED in Congress — do not describe it as succeeding or as adding justices to the Court.', kind: 'edge-case' },
    { content: 'Name BOTH left and right critics when asked for New Deal criticism: American Liberty League (right) vs. Huey Long/Francis Townsend (left).', kind: 'frq-vocab' },
    { content: 'Wagner Act and Social Security Act (both 1935, Second New Deal) are still in force today — distinguish these from the 1933 "alphabet" agencies, several of which were struck down or discontinued.', kind: 'tip' },
  ],
};
