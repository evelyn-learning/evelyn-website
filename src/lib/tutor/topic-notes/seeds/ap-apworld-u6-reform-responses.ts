/**
 * AP World History — Unit 6 CED 6.2/6.4: Reform Responses to Imperial
 * Pressure.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.reform-responses.v1`. Covers the Ottoman Tanzimat, the
 * Qing Self-Strengthening Movement and New Policies, and the Meiji
 * Restoration/Charter Oath as reform responses to imperial pressure, and
 * why their outcomes diverged, 1839-1900.
 *
 * TRANSLATION NOTE: the Charter Oath entries below quote only Articles 1
 * and 5 of the seeded Griffis (1876) rendering, per the plan's caveat that
 * this translation's Articles 2-3 diverge from other standard translations.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_U6_REFORM_RESPONSES: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.reform-responses.v1',
  course: 'AP World History: Modern',
  cedUnit: 6,
  cedTopic: '6.2/6.4',
  cedTitle: 'Reform Responses to Imperial Pressure',
  planId: 'evelyn.ap.apworld.reform-responses.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.reform-responses.v1' }],
  theory: [
    {
      loId: 'apworld.reform-responses',
      kind: 'definition',
      title: 'Tanzimat',
      content:
        "The Ottoman Empire's sustained program of legal, administrative, and military modernization (1839-1876) — new law codes, expanded (in principle) legal equality regardless of religion, restructured taxation/provincial administration, and military reform — aimed at strengthening the central state and discouraging European intervention.",
    },
    {
      loId: 'apworld.reform-responses',
      kind: 'definition',
      title: 'Self-Strengthening Movement',
      content:
        "The Qing Dynasty's program (1860s-1890s) of adopting Western military and industrial technology as practical tools (new arsenals, shipyards, a modernized navy) while preserving the existing Confucian social and political order — narrower in scope than comparable Ottoman or Meiji reform.",
    },
    {
      loId: 'apworld.reform-responses',
      kind: 'definition',
      title: 'kokutai',
      content:
        '("national polity") the ideological frame under which Meiji Japan selectively adapted Western technology and institutions while centering a distinctly Japanese national identity on the emperor — evidence against treating Meiji modernization as simple "westernization."',
    },
    {
      loId: 'apworld.reform-responses',
      kind: 'event',
      title: 'Young Ottomans and the Constitution of 1876',
      content:
        'The Young Ottomans pushed the Tanzimat toward full constitutionalism, achieving the Kanun-i Esasi (1876) — the empire\'s first written constitution, establishing an elected parliament. Sultan Abdulhamid II suspended it within a few years, ruling by autocratic decree for decades afterward.',
    },
    {
      loId: 'apworld.reform-responses',
      kind: 'event',
      title: 'Qing New Policies (post-1901)',
      content:
        "Attempted much more sweeping change than Self-Strengthening had — military restructuring, a new education system, tentative steps toward constitutional government — in the aftermath of the Boxer Uprising's harsh settlement, but came too late and too slowly to reverse the dynasty's declining legitimacy; the Qing fell in 1911.",
    },
    {
      loId: 'apworld.reform-responses',
      kind: 'event',
      title: 'Charter Oath (April 1868), Article 1',
      content:
        'From the seeded Griffis (1876) rendering: "A deliberative assembly shall be formed, and all measures decided by public opinion." Issued months after the fall of the Tokugawa shogunate, committing the new Meiji government to consultative, not purely autocratic, governance from the outset.',
    },
    {
      loId: 'apworld.reform-responses',
      kind: 'event',
      title: 'Charter Oath (April 1868), Article 5',
      content:
        'From the same rendering: "Wisdom and ability should be sought after in all quarters of the world for the purpose of firmly establishing the foundations of the empire." An official mandate to pursue useful foreign knowledge, explicitly in service of Japanese national purposes — the seed of the later kokutai frame, not a renunciation of Japanese identity.',
    },
    {
      loId: 'apworld.reform-responses',
      kind: 'event',
      title: 'Meiji modernization program',
      content:
        'Consistent with the Charter Oath: abolished the old feudal domain system, built a modern conscript army/navy, established state-directed industry, overhauled education — comprehensive, top-down, and launched in one decisive break (1868) rather than a slower reorganization of an existing large state.',
    },
    {
      loId: 'apworld.reform-responses',
      kind: 'cause',
      title: 'why outcomes diverged',
      content:
        "Meiji Japan combined a small, cohesive reforming elite with a restored, symbolically unifying emperor and a single decisive founding break. The Ottoman and Qing empires governed larger, more diverse territories, carried heavier foreign debt, and faced entrenched autocratic/conservative factions (Abdulhamid II suspending the 1876 constitution; conservative Qing court politics limiting Self-Strengthening's scope) that repeatedly narrowed or reversed reform.",
    },
    {
      loId: 'apworld.reform-responses',
      kind: 'trap',
      title: 'translation-fidelity note on the Charter Oath',
      content:
        "The Charter Oath passage seeded here is William Elliot Griffis's 1876 \"in substance\" English rendering. Its Articles 2-3 diverge from other standard translations of the Oath — analysis should stay anchored on Articles 1 and 5, whose substance is stable across renderings, and should never present the Griffis wording of Articles 2-3 as THE canonical Oath.",
    },
  ],
  methods: [
    {
      title: 'Compare three reform programs\' scope and outcome',
      when_to_use:
        'Use when an FRQ or short-answer asks you to compare the Tanzimat, Self-Strengthening/New Policies, and the Meiji Restoration.',
      steps: [
        'Name the specific program and its dates for each state (Tanzimat 1839-1876; Self-Strengthening 1860s-1890s / New Policies post-1901; Meiji from 1868).',
        "Identify each program's SCOPE — narrow (technology/military only) vs. comprehensive (political + military + economic + educational).",
        'Identify the political structure behind the reform — a cohesive unifying elite/monarch vs. a larger, more internally divided or autocracy-constrained state.',
        'State the outcome — did the reform preserve/restore sovereignty, get reversed, or arrive too late?',
        'Explain the divergence by connecting scope + political structure to outcome, not by asserting one state was simply "more willing" to modernize.',
      ],
      example: {
        problem: 'Why did Meiji Japan achieve a more successful reform outcome than the Ottoman Tanzimat?',
        solution:
          'Meiji Japan combined a comprehensive, top-down program (military, economic, educational, and political) with a small, cohesive reforming elite unified around a restored emperor, launched in one decisive break in 1868. The Tanzimat was also substantial but operated within a larger, more internally divided empire where the 1876 constitution was suspended by Abdulhamid II within a few years — illustrating how entrenched autocratic power could reverse reform gains that Meiji Japan\'s political structure did not allow to happen.',
      },
      relatedLoIds: ['apworld.reform-responses'],
    },
  ],
  pointers: [
    { content: 'Quote ONLY Articles 1 and 5 of the Charter Oath from the seeded Griffis rendering — never present its Articles 2-3 wording as the canonical/official Oath text.', kind: 'trap' },
    { content: 'Meiji Japan did NOT simply "westernize" — kokutai framed modernization as selective adaptation in service of a distinctly Japanese national identity centered on the emperor.', kind: 'common-error' },
    { content: 'The Ottoman Constitution of 1876 was suspended within a few years by Abdulhamid II — a clean example that reform can be reversed by entrenched autocratic power even after real constitutional gains.', kind: 'tip' },
    { content: 'Self-Strengthening (1860s-1890s) was narrower than the Tanzimat or Meiji reform — technology/military tools grafted onto an unchanged political order — useful for a "why did outcomes diverge" prompt.', kind: 'tip' },
    { content: 'The Qing New Policies (post-1901) were more sweeping than Self-Strengthening but came too late to prevent the dynasty\'s fall in 1911 — "too little, too late" is a defensible, exam-safe framing.', kind: 'tip' },
  ],
};
