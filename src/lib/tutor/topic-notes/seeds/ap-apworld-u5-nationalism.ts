/**
 * AP World History — Unit 5 CED 5.2 (nationalism strand): Nationalism and
 * National Unification.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.nationalism-unification.v1`. Covers Italian and German
 * unification (Cavour/Garibaldi, Bismarck) and Balkan/pan nationalisms
 * against multiethnic empires. Measured, exam-neutral tone throughout, per
 * Global Constraints.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_NATIONALISM: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.nationalism-unification.v1',
  course: 'AP World History',
  cedUnit: 5,
  cedTopic: '5.2',
  cedTitle: 'Nationalism and National Unification',
  planId: 'evelyn.ap.apworld.nationalism-unification.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.nationalism-unification.v1' }],
  theory: [
    {
      loId: 'apworld.nationalism-unification',
      kind: 'definition',
      title: 'realpolitik',
      content:
        "A politics of hard-nosed, calculated pursuit of state power and interest, associated with Bismarck's approach to German unification, prioritized over ideological consistency or idealism.",
    },
    {
      loId: 'apworld.nationalism-unification',
      kind: 'definition',
      title: 'pan-movement',
      content:
        'A 19th-century nationalist movement (e.g., Pan-Slavism, Pan-Germanism) seeking political unity among people sharing an ethnic or linguistic identity across existing state borders.',
    },
    {
      loId: 'apworld.nationalism-unification',
      kind: 'framework',
      title: 'nationalism from revolutionary citizenship',
      content:
        '19th-century nationalism grew out of the revolutionary-era idea that political legitimacy derives from "the nation" — citizens bound by shared identity and popular sovereignty — rather than from a monarch\'s dynastic claim, reframing loyalty around ethnic/linguistic/cultural identity.',
    },
    {
      loId: 'apworld.nationalism-unification',
      kind: 'event',
      title: 'Italian unification (1861-1870)',
      content:
        "Cavour (Piedmont-Sardinia) pursued diplomacy and calculated war, allying with France against Austria in 1859. Garibaldi's volunteer \"Red Shirts\" conquered Sicily and southern Italy in 1860, ceding the conquest to the Piedmontese crown. The Kingdom of Italy was proclaimed in 1861; Rome was added in 1870.",
    },
    {
      loId: 'apworld.nationalism-unification',
      kind: 'event',
      title: 'German unification (1871)',
      content:
        "Bismarck's realpolitik engineered three successive wars (Denmark, 1864; Austria, 1866; France, 1870-1871) that progressively isolated rivals and built Prussian-led unity. The German Empire was proclaimed at Versailles in January 1871, with the Prussian king as emperor.",
    },
    {
      loId: 'apworld.nationalism-unification',
      kind: 'event',
      title: 'Balkan nationalisms',
      content:
        'Nationalist movements among Serbs, Greeks, and Bulgarians sought independence from Ottoman rule across the 19th century, seeking to break a large multiethnic empire apart along national lines — the opposite direction from Italian/German unification.',
    },
    {
      loId: 'apworld.nationalism-unification',
      kind: 'event',
      title: 'Austro-Hungarian nationalist pressure',
      content:
        'Similar linguistic and ethnic nationalist pressures built within the multiethnic Austro-Hungarian Empire, a structural challenge its dynastic, multiethnic organization could not easily accommodate.',
    },
    {
      loId: 'apworld.nationalism-unification',
      kind: 'event',
      title: 'Zionism and pan-movements',
      content:
        'Zionism (associated with Theodor Herzl from the 1890s) sought a Jewish homeland; pan-movements such as Pan-Slavism and Pan-Germanism sought political unity among people sharing an ethnic/linguistic identity across existing borders — variations on the same nationalist logic at different scales.',
    },
    {
      loId: 'apworld.nationalism-unification',
      kind: 'framework',
      title: 'two roads to unification',
      content:
        "Italian unification combined top-down monarchical diplomacy (Cavour) with bottom-up popular volunteer mobilization (Garibaldi); German unification was almost entirely top-down, state-engineered (Bismarck/Prussian army), with far less role for popular movements.",
    },
    {
      loId: 'apworld.nationalism-unification',
      kind: 'trap',
      title: 'nation-states were recent constructions',
      content:
        'Before 1861/1871, neither "Italy" nor "Germany" existed as unified states — both were deliberately constructed through calculated 19th-century political and military processes, not the natural reassertion of ancient nations.',
    },
  ],
  methods: [
    {
      title: 'Compare two unification processes by mechanism, driver, and timing',
      when_to_use:
        'Use this when comparing Italian and German unification (or any two 19th-century nation-building processes).',
      steps: [
        'Identify the shared mechanism (e.g., both used deliberate war-making, not peaceful federation).',
        'Identify who drove the process (top-down monarchy/state vs. bottom-up popular/volunteer movement, or a combination of both).',
        'Identify the timing/sequencing (single campaign vs. a deliberately engineered sequence of wars).',
        'Connect to the broader pattern: existing monarchical states used nationalism and calculated war to absorb and unify smaller neighboring states.',
      ],
      example: {
        problem: 'Compare how Italy and Germany unified.',
        solution:
          "Both used calculated war; Italy combined Cavour's top-down diplomacy with Garibaldi's bottom-up volunteer conquest, while Germany was driven almost entirely top-down by Bismarck's engineered sequence of three wars.",
      },
      relatedLoIds: ['apworld.nationalism-unification'],
    },
  ],
  pointers: [
    { content: 'Nation-states were RECENT constructions, not ancient/natural units — this is the #1 tested misconception for this topic.', kind: 'trap' },
    { content: "Italy = Cavour (diplomacy/war) + Garibaldi (volunteer conquest); Germany = almost entirely Bismarck's realpolitik. Don't flatten these into \"the same process.\"", kind: 'tip' },
    { content: 'German unification wars in order: Denmark (1864) → Austria (1866) → France (1870-71) → German Empire proclaimed 1871. Keep the sequence straight.', kind: 'tip' },
    { content: 'Balkan/Austro-Hungarian nationalisms sought to BREAK large empires apart along ethnic lines — the opposite direction from Italian/German unification (combining small states into one).', kind: 'tip' },
    { content: "Rome was NOT part of the 1861 Kingdom of Italy — it was added in 1870, a separate, later date.", kind: 'gotcha' },
  ],
};
