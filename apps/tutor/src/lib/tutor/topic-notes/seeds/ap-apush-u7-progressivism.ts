/**
 * AP US History — Unit 7 CED 7.4-7.5: The Progressive Movement.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.progressivism.v1`. Covers reform's municipal-to-state-
 * to-federal escalation, TR/Taft/Wilson's competing programs, the 16th-19th
 * Amendments and suffrage strategy, and Progressivism's limits on race.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_PROGRESSIVISM: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.progressivism.v1',
  course: 'AP United States History',
  cedUnit: 7,
  cedTopic: '7.4-7.5',
  cedTitle: 'The Progressive Movement',
  planId: 'evelyn.ap.apush.progressivism.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.progressivism.v1' }],
  theory: [
    {
      loId: 'apush.progressivism',
      kind: 'definition',
      title: 'muckrakers',
      content:
        'Journalists who investigated and publicized corporate abuse and government corruption in mass-circulation magazines, building public pressure for reform — e.g. Ida Tarbell on Standard Oil, Upton Sinclair on the meatpacking industry.',
    },
    {
      loId: 'apush.progressivism',
      kind: 'framework',
      title: 'municipal -> state -> federal escalation',
      content:
        'City-level reform (settlement houses like Hull House; city-commission/city-manager government) preceded state-level reform (Wisconsin\'s "Wisconsin Idea" under Robert La Follette: direct primaries, railroad regulation, expert commissions), which preceded comparable federal reform.',
    },
    {
      loId: 'apush.progressivism',
      kind: 'event',
      title: "Roosevelt's Square Deal",
      content:
        'TR distinguished "good" trusts from "bad" ones, pursuing selective antitrust suits; pushed the Pure Food and Drug Act and Meat Inspection Act (both 1906) and expanded federal conservation.',
    },
    {
      loId: 'apush.progressivism',
      kind: 'event',
      title: "Taft's split with progressive Republicans",
      content:
        'Taft filed more antitrust suits than TR but alienated progressives over the Payne-Aldrich Tariff (raised rates) and the Pinchot-Ballinger Affair (conservation dispute), fracturing the Republican coalition.',
    },
    {
      loId: 'apush.progressivism',
      kind: 'event',
      title: 'the election of 1912 and New Freedom',
      content:
        'The Republican split produced a four-way race (Taft, Roosevelt/"Bull Moose," Wilson, Debs); Wilson won and pursued the "New Freedom" — Underwood Tariff, Federal Reserve Act (1913), Clayton Antitrust Act and FTC (1914).',
    },
    {
      loId: 'apush.progressivism',
      kind: 'definition',
      title: 'the 16th-19th Amendments',
      content:
        'Income tax (16th, 1913), direct election of senators (17th, 1913), Prohibition (18th, ratified 1919), women\'s suffrage (19th, 1920) — four constitutional amendments marking the era.',
    },
    {
      loId: 'apush.progressivism',
      kind: 'framework',
      title: 'suffrage strategy: NAWSA vs. National Woman\'s Party',
      content:
        'NAWSA (Carrie Chapman Catt) pursued a dual state-by-state and federal-amendment strategy ("Winning Plan"); Alice Paul\'s National Woman\'s Party used direct-action tactics (picketing, hunger strikes). Both contributed to the 19th Amendment (1920).',
    },
    {
      loId: 'apush.progressivism',
      kind: 'trap',
      title: 'Progressivism\'s limits on race',
      content:
        'Southern "reforms" (literacy tests, poll taxes, grandfather clauses) disenfranchised Black voters; Plessy v. Ferguson (1896) segregation stood throughout the era. Du Bois\'s Niagara Movement (1905) and the NAACP (1909) resisted this pattern.',
    },
  ],
  methods: [
    {
      title: 'Compare two reformers\' competing solutions to the same problem',
      when_to_use:
        'Use this when a period offers two contemporaneous reformers/programs addressing the same problem differently (e.g. TR\'s regulation vs. Wilson\'s trust-busting).',
      steps: [
        'State the shared problem both sides agree needs a government response.',
        'Identify each side\'s specific proposed solution.',
        'Locate the exact point of disagreement — often a philosophical premise, not just a policy detail.',
        'Connect the disagreement to the movement\'s broader internal diversity.',
      ],
      example: {
        problem: 'Roosevelt\'s Square Deal (regulate trusts) vs. Wilson\'s New Freedom (break up trusts).',
        solution:
          'Both agreed big business needed a federal check, but disagreed on whether regulated bigness or restored competition was the right cure — evidence Progressivism was a diverse coalition, not one program.',
      },
      relatedLoIds: ['apush.progressivism'],
    },
  ],
  pointers: [
    { content: 'Progressivism was NOT a single unified movement — TR/Wilson disagreed on trusts, and the movement split the Republican Party in 1912.', kind: 'common-error' },
    { content: 'Southern "Progressive reforms" often meant Black disenfranchisement (literacy tests, poll taxes, grandfather clauses) — always name this limit when discussing Progressivism\'s scope.', kind: 'edge-case' },
    { content: 'Suffrage had TWO strategies (NAWSA state/federal vs. National Woman\'s Party direct action) — name both, not just one, for full credit.', kind: 'frq-vocab' },
    { content: 'Sequence of amendments: 16th & 17th (1913) -> 18th (1919) -> 19th (1920).', kind: 'tip' },
    { content: 'Taft actually filed MORE antitrust suits than TR — don\'t assume Taft was less progressive on trusts; his split with progressives was over tariffs and conservation.', kind: 'common-error' },
  ],
};
