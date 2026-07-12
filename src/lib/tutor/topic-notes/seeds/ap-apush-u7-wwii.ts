/**
 * AP US History — Unit 7 CED 7.13-7.15: World War II.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.wwii.v1`. Covers the path from neutrality through
 * Lend-Lease to Pearl Harbor, home-front mobilization, Japanese American
 * internment, wartime strategy, the atomic-bomb debate, and the Holocaust.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_WWII: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.wwii.v1',
  course: 'AP United States History',
  cedUnit: 7,
  cedTopic: '7.13-7.15',
  cedTitle: 'World War II',
  planId: 'evelyn.ap.apush.wwii.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.wwii.v1' }],
  theory: [
    {
      loId: 'apush.wwii',
      kind: 'framework',
      title: 'from neutrality to Lend-Lease',
      content:
        'Neutrality Acts (1935-1939) restricted arms sales/loans to belligerents; as Nazi aggression escalated, Congress and FDR eased restrictions, culminating in the Lend-Lease Act (March 1941), supplying the Allies with war materiel without immediate cash payment.',
    },
    {
      loId: 'apush.wwii',
      kind: 'definition',
      title: 'the Four Freedoms (January 1941)',
      content:
        'FDR\'s annual message named freedom of speech and expression, freedom of worship, freedom from want, and freedom from fear as freedoms a postwar world should secure everywhere — moral framing of American support for the Allies before formal war entry.',
    },
    {
      loId: 'apush.wwii',
      kind: 'event',
      title: 'Pearl Harbor and war entry (December 1941)',
      content:
        'Japan attacked the U.S. naval base at Pearl Harbor on December 7, 1941. Congress declared war on Japan the next day; Germany and Italy declared war on the U.S. days later, bringing full U.S. entry into both theaters.',
    },
    {
      loId: 'apush.wwii',
      kind: 'framework',
      title: 'home-front mobilization',
      content:
        '"Rosie the Riveter" symbolized women entering industrial jobs; the "Double V" campaign called for victory over fascism abroad and discrimination at home even as the military stayed segregated; the Bracero Program (1942) brought Mexican workers for wartime labor shortages.',
    },
    {
      loId: 'apush.wwii',
      kind: 'event',
      title: 'Japanese American internment (EO 9066, 1942)',
      content:
        'EO 9066 (February 1942) authorized military exclusion zones; used to forcibly remove and incarcerate roughly 120,000 Japanese Americans (majority U.S. citizens) without individual charges. Upheld in Korematsu v. United States (1944); acknowledged as an injustice under the Civil Liberties Act (1988).',
    },
    {
      loId: 'apush.wwii',
      kind: 'event',
      title: 'military strategy and turning points',
      content:
        'Allied strategy prioritized defeating Germany first. The Battle of Midway (June 1942) crippled Japan\'s carrier fleet; D-Day (June 6, 1944) opened a decisive Western European front.',
    },
    {
      loId: 'apush.wwii',
      kind: 'definition',
      title: 'the atomic-bomb decision — a genuine debate',
      content:
        'Truman authorized atomic bombings of Hiroshima (Aug 6, 1945) and Nagasaki (Aug 9, 1945). Historians debate whether this was necessary to avoid a costly invasion, or whether Japan was already near surrender and the bombings partly aimed to signal power to the USSR — presented as unresolved, not settled.',
    },
    {
      loId: 'apush.wwii',
      kind: 'event',
      title: 'the Holocaust',
      content:
        'As Allied forces advanced into Germany (1944-45), they discovered and liberated Nazi concentration and death camps, confirming the systematic genocide of some six million European Jews and other targeted groups.',
    },
  ],
  methods: [
    {
      title: 'Separate a document\'s formal (neutral) authorization language from its group-specific application',
      when_to_use:
        'Use this when analyzing an official order (e.g. EO 9066) whose text is broader or more neutral than how the authority it grants was actually used.',
      steps: [
        'Identify precisely what power the document\'s own text grants.',
        'Note whether the text names any specific group.',
        'Describe how the authority was ACTUALLY applied in practice (who, where, at what scale).',
        'State the gap between the neutral text and its specific application as part of the analysis.',
      ],
      example: {
        problem: 'Executive Order 9066\'s "any or all persons" language vs. its use against Japanese Americans specifically.',
        solution:
          'The order\'s text is formally race-neutral, but military commanders used it to exclude and incarcerate roughly 120,000 Japanese Americans specifically — not German or Italian nationals — despite the U.S. being at war with all three Axis powers.',
      },
      relatedLoIds: ['apush.wwii'],
    },
  ],
  pointers: [
    { content: 'Internment targeted people by ANCESTRY, not citizenship — the majority incarcerated were U.S. citizens (Nisei); do not describe internment as targeting only non-citizens.', kind: 'common-error' },
    { content: 'The atomic-bomb decision should be presented as a genuine historical debate (necessity vs. Japan-near-surrender/Soviet-signaling arguments), not a settled verdict either way.', kind: 'gotcha' },
    { content: 'Korematsu v. United States (1944) upheld internment\'s constitutionality — it was never formally overturned by the Court, though its reasoning was later repudiated. Do not describe it as overturned.', kind: 'edge-case' },
    { content: 'Key dates: Lend-Lease (March 1941), Pearl Harbor (Dec 7, 1941), EO 9066 (Feb 1942), Midway (June 1942), D-Day (June 6, 1944), atomic bombings (Aug 1945).', kind: 'tip' },
    { content: 'Present the Holocaust factually and measured — six million European Jews plus other targeted groups (Roma, disabled people, political prisoners) — as historical context for the war\'s stakes.', kind: 'tip' },
  ],
};
