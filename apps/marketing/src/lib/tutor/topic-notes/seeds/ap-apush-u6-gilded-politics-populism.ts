/**
 * AP US History — Unit 6 CED 6.11-6.13: Gilded Age Politics and Populism.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.gilded-politics-populism.v1`. Covers patronage and the
 * Pendleton Act, the agrarian crisis and rise of the Grange, Farmers'
 * Alliances, and the Populist Party, and the 1896 election and
 * McKinley-era realignment — anchored by the Omaha Platform (1892).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_GILDED_POLITICS_POPULISM: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.gilded-politics-populism.v1',
  course: 'AP United States History',
  cedUnit: 6,
  cedTopic: '6.11-6.13',
  cedTitle: 'Gilded Age Politics and Populism',
  planId: 'evelyn.ap.apush.gilded-politics-populism.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.gilded-politics-populism.v1' }],
  theory: [
    {
      loId: 'apush.gilded-politics-populism',
      kind: 'event',
      title: 'political stalemate and the Pendleton Act (1883)',
      content:
        'National elections in the 1870s-1890s were extremely close, with narrow substantive differences between parties producing legislative gridlock despite high turnout. Federal jobs were largely distributed via the patronage "spoils system." After a disappointed office-seeker assassinated President Garfield (1881), the Pendleton Civil Service Act (1883) created a Civil Service Commission and competitive exams for many (not all) federal jobs — a partial reform.',
    },
    {
      loId: 'apush.gilded-politics-populism',
      kind: 'cause',
      title: 'the agrarian crisis',
      content:
        'Falling crop prices, a deflationary gold-backed money supply (making debts effectively harder to repay over time), high railroad shipping rates, and the crop-lien credit system combined to trap many American farmers (South and Great Plains especially) in worsening debt through the 1880s-1890s.',
    },
    {
      loId: 'apush.gilded-politics-populism',
      kind: 'framework',
      title: 'Grange to Alliances to Populists',
      content:
        'The Grange (1867) began as a farmers\' social/cooperative organization, pushing early state "Granger laws" regulating railroad rates. Farmers\' Alliances (1880s) built larger organizing networks and developed the "sub-treasury plan" (government-run warehouses for low-interest crop-backed loans). The People\'s (Populist) Party (1892) translated Alliance organizing into a national political party.',
    },
    {
      loId: 'apush.gilded-politics-populism',
      kind: 'event',
      title: 'the Omaha Platform (1892)',
      content:
        'The Populist Party\'s founding platform: preamble indicts "a nation brought to the verge of moral, political, and material ruin," with corruption reaching "the ballot-box, the Legislatures, the Congress," and "even the ermine of the bench." Demands: free and unlimited coinage of silver and gold at 16 to 1, the sub-treasury plan (or equivalent), and government ownership of the railroads.',
    },
    {
      loId: 'apush.gilded-politics-populism',
      kind: 'definition',
      title: 'free silver',
      content:
        'Policy of unlimited government coinage of silver alongside gold, favored by debt-burdened farmers and silver interests to expand the money supply, create inflation, and ease debt repayment — the era\'s defining money-supply fight against the gold standard.',
    },
    {
      loId: 'apush.gilded-politics-populism',
      kind: 'event',
      title: 'the 1896 election and realignment',
      content:
        'Democratic nominee William Jennings Bryan embraced free silver and won Populist Party endorsement (fusion ticket); Republican nominee William McKinley defended the gold standard and protective tariffs, with far greater campaign financing. McKinley\'s decisive win built a business/industrial-worker/urban coalition, giving Republicans national dominance for roughly the next three decades and ending the Populist Party as an independent force.',
    },
    {
      loId: 'apush.gilded-politics-populism',
      kind: 'trap',
      title: 'the Populists "won nothing" — false',
      content:
        'Although the Populist Party lost in 1896 and soon dissolved, several 1892 demands were enacted within about twenty years under different sponsorship: the graduated federal income tax (16th Amendment, 1913), direct election of U.S. senators (17th Amendment, 1913), the secret ballot, and sub-treasury-style farm-credit ideas later echoing in New Deal programs. Electoral defeat is not the same as policy defeat.',
    },
    {
      loId: 'apush.gilded-politics-populism',
      kind: 'definition',
      title: 'gold standard',
      content:
        'The monetary policy of backing currency solely with gold, favored by creditors, bankers, and much of the urban business and financial establishment because it kept currency "sound" and stable — the opposite pole from free silver in the era\'s defining money-supply debate. McKinley\'s 1896 campaign defended it alongside protective tariffs.',
    },
  ],
  methods: [
    {
      title: 'Connect a political platform\'s rhetoric to the specific material interests behind it',
      when_to_use:
        'Use this when analyzing any political platform or manifesto (e.g. the Omaha Platform) that opens with sweeping moral language before listing specific demands.',
      steps: [
        'Read the rhetorical frame first: what scale of crisis does the preamble claim (isolated grievance vs. systemic corruption)?',
        'List the specific demands and identify which material interests each one serves.',
        'Connect the sweeping rhetoric to the narrower material interests: does the "universal" moral claim map onto a specific economic constituency\'s needs?',
        'State both halves in the answer: the platform is authentic constituency advocacy AND framed in universal moral terms — name both rather than picking one.',
      ],
      example: {
        problem: 'Omaha Platform (1892): systemic-corruption preamble, then demands free silver and railroad nationalization.',
        solution:
          'Free silver eases debt-burdened farmers\' loan repayment under deflation; railroad nationalization targets a "public necessity" farmers depended on. Both demands map onto farmers\' specific material interests even as the preamble frames the crisis as affecting "the people" broadly.',
      },
      relatedLoIds: ['apush.gilded-politics-populism'],
    },
  ],
  pointers: [
    { content: 'Populists "lost the election, won the platform": name the SPECIFIC later-enacted reforms (16th/17th Amendments, secret ballot) rather than a vague "some ideas caught on."', kind: 'frq-vocab' },
    { content: 'Free silver (16 to 1) vs. gold standard is the defining 1896 fight — know WHO favored each side (debtor farmers/silver interests vs. creditors/bankers/business) and why.', kind: 'tip' },
    { content: 'The Pendleton Act (1883) only PARTIALLY replaced patronage — do not describe it as ending the spoils system outright.', kind: 'edge-case' },
    { content: 'Sequence: Grange (1867, cooperative/Granger laws) -> Farmers\' Alliances (1880s, sub-treasury plan) -> Populist Party (1892, Omaha Platform) -> 1896 fusion/defeat.', kind: 'tip' },
    { content: 'McKinley\'s 1896 coalition included industrial WORKERS worried free silver\'s inflation would erode real wages — not just business interests.', kind: 'common-error' },
  ],
};
