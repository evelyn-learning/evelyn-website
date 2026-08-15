/**
 * AP US History — Unit 7 CED 7.9-7.10: The 1920s.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.twenties.v1`. Covers the consumer economy and mass
 * culture, the Harlem Renaissance, and the conflict between modernism and
 * tradition (quotas, the Klan, Scopes, Prohibition, the farm depression).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_TWENTIES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.twenties.v1',
  course: 'AP United States History',
  cedUnit: 7,
  cedTopic: '7.9-7.10',
  cedTitle: 'The 1920s',
  planId: 'evelyn.ap.apush.twenties.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.twenties.v1' }],
  theory: [
    {
      loId: 'apush.twenties',
      kind: 'framework',
      title: 'the consumer economy',
      content:
        'Mass production (Ford\'s assembly line), rising real wages for many workers, and a new consumer culture built on installment buying (credit), advertising, and mass-produced automobiles and household goods.',
    },
    {
      loId: 'apush.twenties',
      kind: 'event',
      title: 'mass culture',
      content:
        'Radio broadcasting and Hollywood film became truly national mass media for the first time, creating shared celebrity culture and entertainment across regions.',
    },
    {
      loId: 'apush.twenties',
      kind: 'definition',
      title: 'the Harlem Renaissance',
      content:
        'A flowering of African American literary, artistic, and musical creativity centered in Harlem, fueled partly by the Great Migration; writers like Langston Hughes and Zora Neale Hurston, and jazz musicians, produced influential work on Black identity and experience.',
    },
    {
      loId: 'apush.twenties',
      kind: 'definition',
      title: 'the National Origins Act (1924)',
      content:
        'Following the 1921 Emergency Quota Act, this more restrictive law set strict, national-origin-based quotas sharply favoring Northern/Western Europeans and effectively barring most Asian immigration.',
    },
    {
      loId: 'apush.twenties',
      kind: 'event',
      title: 'the Second Ku Klux Klan',
      content:
        'Revived in 1915, reaching several million members in the early-to-mid 1920s; expanded targets beyond Black Americans to Catholics, Jews, and immigrants, and operated openly outside the South.',
    },
    {
      loId: 'apush.twenties',
      kind: 'event',
      title: 'the Scopes Trial (1925)',
      content:
        'Tennessee teacher John Scopes was tried (and convicted, on a technicality later overturned) for teaching evolution, illegal under state law; national coverage highlighted the clash between religious fundamentalism and modern science education.',
    },
    {
      loId: 'apush.twenties',
      kind: 'event',
      title: 'Prohibition',
      content:
        'The 18th Amendment (1919) and Volstead Act banned alcohol nationwide from 1920; enforcement proved difficult and fueled organized crime, contributing to repeal by the 21st Amendment in 1933.',
    },
    {
      loId: 'apush.twenties',
      kind: 'trap',
      title: 'the farm depression — prosperity was uneven',
      content:
        'Crop prices collapsed once European farms resumed production after WWI, leaving American farmers in a prolonged depression throughout the supposedly prosperous 1920s.',
    },
  ],
  methods: [
    {
      title: 'Connect several distinct episodes to one shared underlying conflict',
      when_to_use:
        'Use this when a period presents multiple separate events (a law, a social movement, a trial) that all express the same broader cultural tension.',
      steps: [
        'Name the shared underlying conflict or force each episode responds to.',
        'For each episode, identify the SPECIFIC mechanism through which it expresses that conflict (legal, social/political, educational, etc.).',
        'Note whether each episode\'s "win" was partial, temporary, or lasting.',
        'State that the episodes are different channels for one conflict, not unrelated events.',
      ],
      example: {
        problem: 'National Origins Act (1924), the revived Klan, and the Scopes Trial (1925).',
        solution:
          'All three express a traditionalist backlash against 1920s cultural change — expressed through law, social/political organizing, and a courtroom fight over education, respectively.',
      },
      relatedLoIds: ['apush.twenties'],
    },
  ],
  pointers: [
    { content: 'The 1920s were NOT prosperous for everyone — the farm depression persisted throughout the decade, nearly a decade before the rest of the country entered the Great Depression.', kind: 'common-error' },
    { content: 'Never quote Harlem Renaissance writers\' (Hughes, Hurston, etc.) copyrighted works directly — describe their themes and significance only.', kind: 'edge-case' },
    { content: 'The 1920s Klan targeted Catholics and Jews and immigrants, not only Black Americans, and operated openly in the North/Midwest, not only the South — a real change from the Reconstruction-era Klan.', kind: 'tip' },
    { content: 'Immigration restriction came in two steps: Emergency Quota Act (1921), then the more restrictive National Origins Act (1924) — know both dates.', kind: 'frq-vocab' },
    { content: 'Scopes was convicted (overturned later on a technicality) — do not describe the trial as an outright legal win for evolution/modern science.', kind: 'common-error' },
  ],
};
