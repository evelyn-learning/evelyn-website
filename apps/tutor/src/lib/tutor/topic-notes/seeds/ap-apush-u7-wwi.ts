/**
 * AP US History — Unit 7 CED 7.6-7.8: World War I.
 *
 * Hand-authored baseline mirroring the lesson plan `evelyn.ap.apush.wwi.v1`.
 * Covers the path from neutrality to war, wartime mobilization of opinion
 * and suppression of dissent, the Great Migration, and the fight over the
 * Fourteen Points and the Treaty of Versailles.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_WWI: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.wwi.v1',
  course: 'AP United States History',
  cedUnit: 7,
  cedTopic: '7.6-7.8',
  cedTitle: 'World War I',
  planId: 'evelyn.ap.apush.wwi.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.wwi.v1' }],
  theory: [
    {
      loId: 'apush.wwi',
      kind: 'event',
      title: 'American neutrality (1914-1917)',
      content:
        'Wilson proclaimed neutrality when WWI broke out in Europe (1914), though U.S. trade and loans overwhelmingly favored the Allies (Britain and France) over the Central Powers.',
    },
    {
      loId: 'apush.wwi',
      kind: 'cause',
      title: 'submarine warfare and the path to war',
      content:
        'German unrestricted submarine warfare, including the sinking of the Lusitania (May 1915, over 100 American deaths), provoked outrage. Germany resumed the policy in early 1917, a calculated gamble to defeat Britain before U.S. intervention could matter.',
    },
    {
      loId: 'apush.wwi',
      kind: 'definition',
      title: 'the Zimmermann Telegram',
      content:
        'Intercepted early-1917 German proposal offering to help Mexico reclaim Texas, New Mexico, and Arizona if it allied with Germany against the U.S. — further inflamed American opinion just before war entry.',
    },
    {
      loId: 'apush.wwi',
      kind: 'event',
      title: 'war entry (April 1917)',
      content:
        'Wilson asked Congress for a declaration of war on April 2, 1917, framing entry in idealist terms ("the world must be made safe for democracy") rather than mere retaliation; Congress declared war within days.',
    },
    {
      loId: 'apush.wwi',
      kind: 'framework',
      title: 'mobilizing opinion and suppressing dissent',
      content:
        'The Committee on Public Information (George Creel) produced pro-war propaganda. The Espionage Act (1917) and Sedition Act (1918) criminalized wartime dissent; upheld by the Supreme Court in Schenck v. United States (1919).',
    },
    {
      loId: 'apush.wwi',
      kind: 'definition',
      title: 'the Great Migration',
      content:
        'Wartime industrial labor demand plus the near-halt of European immigration pulled hundreds of thousands of African Americans from the rural South to Northern/Midwestern industrial cities beginning around 1916.',
    },
    {
      loId: 'apush.wwi',
      kind: 'framework',
      title: "Fourteen Points vs. Treaty of Versailles",
      content:
        'Wilson\'s Fourteen Points (January 1918) proposed self-determination, open diplomacy, and a League of Nations. The actual Treaty of Versailles (1919), shaped by punitive Allied demands, imposed harsh reparations and a war-guilt clause — falling well short of Wilson\'s vision.',
    },
    {
      loId: 'apush.wwi',
      kind: 'event',
      title: 'the Senate rejects Versailles',
      content:
        'Republican "Reservationists" (Henry Cabot Lodge) wanted conditions on Article X\'s collective-security obligations; "Irreconcilables" opposed the League outright. The Senate rejected the treaty in 1919-1920 after Wilson refused compromise reservations.',
    },
  ],
  methods: [
    {
      title: 'Weigh idealistic rhetoric against a document\'s underlying material causes',
      when_to_use:
        'Use this when a leader frames a policy (e.g. war entry) in universal moral terms while concrete, self-interested causes are also present.',
      steps: [
        'Identify the concrete, self-interested causes (e.g. submarine attacks, direct territorial threats).',
        'Identify the idealistic/moral framing offered alongside them.',
        'Ask what expectation the idealistic framing sets for the outcome.',
        'Check whether the actual outcome meets or falls short of that framing, and why.',
      ],
      example: {
        problem: 'Wilson\'s war message ("no conquest, no dominion") vs. the actual Treaty of Versailles.',
        solution:
          'Wilson\'s idealistic framing set a high moral bar; the punitive Versailles treaty, shaped by Allied demands for retribution, fell well short of it — a lasting tension between rhetoric and outcome.',
      },
      relatedLoIds: ['apush.wwi'],
    },
  ],
  pointers: [
    { content: 'The U.S. did NOT fight from 1914 — it stayed neutral until April 1917, nearly three years after the war began in Europe.', kind: 'common-error' },
    { content: 'Two distinct causes pushed the U.S. to war: submarine warfare (Lusitania, 1917 resumption) AND the Zimmermann Telegram — name both for full credit.', kind: 'frq-vocab' },
    { content: 'Espionage Act (1917) and Sedition Act (1918) are separate laws, one year apart — both criminalized wartime dissent; keep them APUSH-internal (Schenck), not AP Gov First Amendment doctrine.', kind: 'edge-case' },
    { content: 'The Great Migration began around 1916, driven by wartime labor demand and halted European immigration — a demographic shift setting up the 1920s Harlem Renaissance.', kind: 'tip' },
    { content: 'Distinguish the Fourteen Points (Wilson\'s proposal) from the Treaty of Versailles (the actual, more punitive settlement) — they are not the same document.', kind: 'common-error' },
  ],
};
