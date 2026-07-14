/**
 * AP World History — Unit 6 CED 6.4-6.6: Economic Imperialism and Informal
 * Empire.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.economic-imperialism.v1`. Covers the Opium Wars,
 * unequal treaties, extraterritoriality, spheres of influence, export
 * monocultures, and strategic infrastructure as mechanisms of economic
 * imperialism that stopped short of formal colonization, 1839-1900.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_U6_ECONOMIC_IMPERIALISM: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.economic-imperialism.v1',
  course: 'AP World History: Modern',
  cedUnit: 6,
  cedTopic: '6.4-6.6',
  cedTitle: 'Economic Imperialism and Informal Empire',
  planId: 'evelyn.ap.apworld.economic-imperialism.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.economic-imperialism.v1' }],
  theory: [
    {
      loId: 'apworld.economic-imperialism',
      kind: 'definition',
      title: 'extraterritoriality',
      content:
        "A privilege granted under China's unequal treaties whereby foreign nationals were tried under their own country's law by their own consular courts, rather than under Chinese law — a direct infringement on Qing legal sovereignty, established after the Treaty of Nanjing (1842).",
    },
    {
      loId: 'apworld.economic-imperialism',
      kind: 'definition',
      title: 'unequal treaty',
      content:
        'A treaty imposed on a militarily defeated or coerced state granting the stronger power one-sided commercial, legal, or territorial privileges. The Treaty of Nanjing (1842) is the model example: ceded Hong Kong, opened five treaty ports, and (via a supplement) granted extraterritoriality.',
    },
    {
      loId: 'apworld.economic-imperialism',
      kind: 'definition',
      title: 'informal empire',
      content:
        'A relationship in which one state dominates the economic and sometimes legal life of a nominally independent state without formal colonization or annexation — the standard framing for foreign leverage over late-Qing China, which was never formally colonized.',
    },
    {
      loId: 'apworld.economic-imperialism',
      kind: 'event',
      title: 'Lin Zexu, letter to Queen Victoria (1839)',
      content:
        'Qing Commissioner Lin Zexu appealed to reciprocity ("in your own country opium is prohibited with the utmost strictness and severity... this is a strong proof that you know full well how hurtful it is to mankind") and mutual dependence (naming "tea and rhubarb" as goods Britain "could not exist a single day without"), asking Britain not to profit from exporting a drug it banned at home. Written BEFORE the First Opium War, from a position of intact Qing sovereignty.',
    },
    {
      loId: 'apworld.economic-imperialism',
      kind: 'cause',
      title: 'First Opium War (1839-1842) and the Treaty of Nanjing (1842)',
      content:
        "Britain rejected Lin Zexu's appeal and, after Lin's enforcement disrupted the opium trade, went to war, winning decisively against outmatched Qing forces. The Treaty of Nanjing — China's first unequal treaty — ceded Hong Kong, opened five treaty ports, and (via supplement) established extraterritoriality.",
    },
    {
      loId: 'apworld.economic-imperialism',
      kind: 'event',
      title: 'Second Opium War (1856-1860)',
      content:
        'Fought by Britain and France against the Qing; deepened the concessions established at Nanjing — more treaty ports, legalized opium import, foreign legations in Beijing, continued extraterritorial privileges.',
    },
    {
      loId: 'apworld.economic-imperialism',
      kind: 'event',
      title: 'spheres of influence',
      content:
        'By the late 1800s, multiple foreign powers (Britain, France, Germany, Russia, Japan) each claimed exclusive economic privileges (railway concessions, mining rights, preferential trade) within designated zones of Chinese territory, without formal annexation — China\'s central government remained nominally sovereign but practically constrained.',
    },
    {
      loId: 'apworld.economic-imperialism',
      kind: 'event',
      title: 'export monocultures: guano and rubber',
      content:
        "Peru's 19th-century economy depended heavily on exporting guano (fertilizer), mined largely by coerced/indentured labor. Rubber became similarly dominant by century's end, most infamously in the Congo Free State (King Leopold II's personal possession), where rubber-profit pursuit was accompanied by well-documented, extreme forced-labor abuses and mass death — noted as a distinct, especially severe case, not typical of every rubber economy.",
    },
    {
      loId: 'apworld.economic-imperialism',
      kind: 'event',
      title: 'Suez Canal (1869) and the British occupation of Egypt (1882)',
      content:
        "The Suez Canal became such a critical trade shortcut that when Egypt's government fell into unsustainable debt partly from financing it, Britain used the debt crisis and a subsequent nationalist uprising as pretext to militarily occupy Egypt in 1882 — canal-driven debt converted into de facto foreign control while Egypt remained nominally an autonomous Ottoman province.",
    },
    {
      loId: 'apworld.economic-imperialism',
      kind: 'trap',
      title: 'informal empire vs. formal colonization',
      content:
        'China was never formally colonized — the Qing government remained nominally sovereign and in place throughout. Do not conflate real, humiliating loss of economic/legal sovereignty (extraterritoriality, treaty ports, spheres of influence) with formal annexation, which China never experienced.',
    },
  ],
  methods: [
    {
      title: 'Source and analyze a pre-conflict diplomatic appeal (HIPP)',
      when_to_use:
        'Use on any letter/appeal written before a conflict begins (e.g. Lin Zexu to Queen Victoria), before judging its argument or its failure to prevent war.',
      steps: [
        'H — HISTORICAL CONTEXT: what is the writer\'s position and leverage at the moment of writing — BEFORE or AFTER the conflict/treaty that follows?',
        'I — INTENDED AUDIENCE: who is being addressed, and on what shared standard is the appeal built?',
        'P — PURPOSE: state the purpose as a verb (persuade, appeal, warn) grounded in the specific arguments used (reciprocity, mutual dependence).',
        "P — POINT OF VIEW: does the writer's tone/position reflect genuine agency and intact sovereignty, or is this written from a position of weakness?",
        'CONNECT TO THE OUTCOME: explain why the appeal succeeded or failed, and what changed (treaty, war, concession) as a result.',
      ],
      example: {
        problem: 'What does Lin Zexu\'s 1839 letter reveal, and why did it fail to prevent war?',
        solution:
          "Lin argues by reciprocity (Britain's own opium ban proves it knows opium is harmful) and mutual dependence (China's exports Britain needs). Written before the First Opium War, from a position of full Qing sovereignty and genuine diplomatic agency. It failed not because the argument was weak, but because Britain rejected it in favor of protecting profitable trade — the war and Treaty of Nanjing that followed converted the dispute into China's first unequal treaty.",
      },
      relatedLoIds: ['apworld.economic-imperialism'],
    },
  ],
  pointers: [
    { content: 'China was NEVER formally colonized — always describe post-Opium-War China as "informal empire," not colonization, on the exam.', kind: 'trap' },
    { content: 'Extraterritoriality ≠ a treaty port ≠ a sphere of influence — these are three distinct mechanisms; name the specific one asked for, don\'t use them interchangeably.', kind: 'common-error' },
    { content: 'Lin Zexu\'s letter was written BEFORE the First Opium War — treat it as evidence of a moment of intact Qing agency, not evidence of Qing weakness.', kind: 'tip' },
    { content: 'The Congo Free State\'s rubber-driven forced-labor abuses under Leopold II were an especially severe case — don\'t generalize its atrocities as typical of every export-monoculture economy (e.g. Peru\'s guano trade) without qualification.', kind: 'tip' },
    { content: 'The Suez Canal example shows economic imperialism can be triggered by DEBT, not just trade or resource extraction — a useful non-China example to pair with the Opium Wars on a comparative FRQ.', kind: 'tip' },
  ],
};
