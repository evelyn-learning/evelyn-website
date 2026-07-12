/**
 * AP US History — Unit 6 CED 6.8-6.10: Immigration and Urbanization.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.immigration-urbanization.v1`. Covers the shift in
 * immigrant origins, ethnic enclaves, urban political machines, targeted
 * nativism (Chinese Exclusion Act), and settlement houses.
 *
 * Data-table scoping: the region-shift percentages describe shares of
 * EUROPEAN immigration specifically, not shares of total immigration.
 * Preserved exactly per the seeded passage's own docblock.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_IMMIGRATION_URBANIZATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.immigration-urbanization.v1',
  course: 'AP United States History',
  cedUnit: 6,
  cedTopic: '6.8-6.10',
  cedTitle: 'Immigration and Urbanization',
  planId: 'evelyn.ap.apush.immigration-urbanization.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.immigration-urbanization.v1' }],
  theory: [
    {
      loId: 'apush.immigration-urbanization',
      kind: 'definition',
      title: '"new immigrants"',
      content:
        'Historians\' term for the rising share (within EUROPEAN immigration specifically) of Southern and Eastern European, largely Catholic (Italian) and Jewish (Russian Empire, Austria-Hungary), arrivals from the 1880s onward — distinct from the largely Protestant "old immigrants" from Northern/Western Europe.',
    },
    {
      loId: 'apush.immigration-urbanization',
      kind: 'shifter-list',
      title: 'the European sending-region shift (1880s to 1890s)',
      content:
        'SCOPED TO SHARES OF EUROPEAN IMMIGRATION, not total immigration: Southern/Eastern Europe (Italy, Austria-Hungary, Russia) rose from roughly 16% to roughly 43% of European immigration; Northern/Western Europe (Germany, Ireland, UK, Norway-Sweden) fell from roughly 76% to roughly 46% of European immigration over the same span. Total immigration (all regions) peaked in the 1880s (~5.2M) and fell in the 1890s (~3.7M) — a separate figure from the regional-share shift.',
    },
    {
      loId: 'apush.immigration-urbanization',
      kind: 'definition',
      title: 'ethnic enclave',
      content:
        'A dense urban immigrant neighborhood organized around shared language, religion, or national origin (e.g. Lower East Side for Eastern European Jews, Little Italy neighborhoods) — mutual support and cultural continuity, but concentrated poverty and overcrowding.',
    },
    {
      loId: 'apush.immigration-urbanization',
      kind: 'definition',
      title: 'urban political machine',
      content:
        'An organization (e.g. Tammany Hall) trading jobs and services (naturalization help, small emergency aid, help with landlords/law) for votes in immigrant-heavy cities, run through ward-level "bosses." Criticized for corruption but provided real services before public welfare existed.',
    },
    {
      loId: 'apush.immigration-urbanization',
      kind: 'event',
      title: 'the Chinese Exclusion Act (1882)',
      content:
        'First major federal law restricting immigration by nationality: suspended immigration of Chinese laborers specifically for ten years (later extended, permanent until repealed 1943). The seeded excerpt is the operative Section 1 suspension text. No comparable blanket federal ban targeted any European immigrant group in this period.',
    },
    {
      loId: 'apush.immigration-urbanization',
      kind: 'definition',
      title: 'settlement house',
      content:
        'A community center in an immigrant neighborhood offering childcare, English classes, healthcare, and cultural programs — e.g. Jane Addams\'s Hull House (Chicago, 1889). A reform response to urban poverty distinct from machine politics or restrictionist law.',
    },
    {
      loId: 'apush.immigration-urbanization',
      kind: 'framework',
      title: 'nativism was targeted, not uniform',
      content:
        'Nativist organizations (e.g. American Protective Association, 1887) focused on Catholic/Jewish "new immigrants" through social prejudice; the Chinese Exclusion Act (1882) is a categorically sharper, race/nationality-based FEDERAL LAW aimed specifically at Chinese immigrants. No comparable European-targeted federal ban existed in this period. Northern/Western European immigrants faced comparatively little organized nativist hostility.',
    },
    {
      loId: 'apush.immigration-urbanization',
      kind: 'trap',
      title: 'do not confuse "share of European immigration" with "share of total immigration"',
      content:
        'The rising Southern/Eastern European share is measured against the EUROPEAN total for that decade, which excludes Asian and other non-European arrivals. Never restate these percentages as if they describe all immigration to the U.S.',
    },
  ],
  methods: [
    {
      title: 'Read a described immigration data table without conflating scoping levels',
      when_to_use:
        'Use this whenever a data table breaks a total into regional/national subcategories across multiple decades — before quoting any percentage, check whether it is a share of the GRAND total or a share of one SUBSET (here, European arrivals only).',
      steps: [
        'Identify the table\'s total category (all immigration) and any narrower subset it also breaks down (European immigration by sending region).',
        'For each percentage cited, state explicitly what it is a share OF (e.g. "43% of European immigration," not "43% of immigration").',
        'Cross-check: do the subset\'s percentages need to sum to 100% of the grand total? If not (e.g. because non-European arrivals are excluded from the regional breakdown), do not claim they do.',
        'When writing an SAQ/DBQ response, always restate the scoping phrase ("of European immigration") rather than dropping it for brevity.',
      ],
      example: {
        problem:
          'The table shows Southern/Eastern European immigration rising from ~16% to ~43% "of European immigration" between the 1880s and 1890s.',
        solution:
          'Restate exactly: this is a share of EUROPEAN immigration for each decade, not a share of all U.S. immigration (which also includes Asian arrivals, restricted after 1882). Dropping the "of European immigration" qualifier is a scoping error.',
      },
      relatedLoIds: ['apush.immigration-urbanization'],
    },
  ],
  pointers: [
    { content: 'Always restate region-shift percentages as shares of EUROPEAN immigration — never drop that qualifier or imply it describes total U.S. immigration.', kind: 'gotcha' },
    { content: 'Nativism was targeted, not uniform: the Chinese Exclusion Act (1882) is a binding federal law naming one group; European "new immigrant" nativism was serious but not codified into a comparable federal ban in this period.', kind: 'trap' },
    { content: 'Total immigration peaked in the 1880s (~5.2M) and fell in the 1890s (~3.7M) — a separate fact from the regional-share shift within European arrivals; do not merge the two trends.', kind: 'edge-case' },
    { content: 'Settlement houses (Hull House, 1889) are an urban REFORM response — keep them distinct from political machines, which are a POWER-BROKERING response to the same immigrant communities.', kind: 'frq-vocab' },
    { content: 'The Chinese Exclusion Act (1882) is the sharpest, earliest example of race/nationality-based federal immigration law — a strong anchor citation for any nativism prompt.', kind: 'tip' },
  ],
};
