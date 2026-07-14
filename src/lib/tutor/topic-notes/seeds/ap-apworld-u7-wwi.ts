/**
 * AP World History — Unit 7 CED 7.1-7.3: World War I as a Global War.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.wwi-global.v1`. Covers the MAIN causes and alliance
 * cascade, WWI's character as a global total war (colonial manpower, the
 * Ottoman front, the Armenian genocide), and the gap between Wilson's
 * Fourteen Points and the Versailles mandate system, 1914-1919.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_U7_WWI: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.wwi-global.v1',
  course: 'AP World History: Modern',
  cedUnit: 7,
  cedTopic: '7.1-7.3',
  cedTitle: 'World War I as a Global War',
  planId: 'evelyn.ap.apworld.wwi-global.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.wwi-global.v1' }],
  theory: [
    {
      loId: 'apworld.wwi-global',
      kind: 'definition',
      title: 'MAIN causes',
      content:
        "A mnemonic for WWI's four interlocking long-term causes: Militarism (arms race, Anglo-German naval rivalry), Alliances (Triple Alliance: Germany/Austria-Hungary/Italy vs. Triple Entente: France/Russia/Britain), Imperialism (colonial rivalries, e.g. Morocco crises), Nationalism (Slavic nationalism straining Austria-Hungary and the Ottoman Empire). Distinct from the assassination of Archduke Franz Ferdinand (28 June 1914), the immediate trigger.",
    },
    {
      loId: 'apworld.wwi-global',
      kind: 'definition',
      title: 'total war',
      content:
        'A form of warfare mobilizing a belligerent state\'s entire economy and society — industrial production, civilian rationing, expanded state control — not just its armed forces.',
    },
    {
      loId: 'apworld.wwi-global',
      kind: 'definition',
      title: 'mandate system',
      content:
        "The arrangement under Article 22 of the League of Nations Covenant (Part I of the Treaty of Versailles, 1919), assigning former German colonies and Ottoman territories to Allied 'Mandatory' powers as a 'sacred trust,' in practice extending imperial control under new legal cover rather than genuine self-determination.",
    },
    {
      loId: 'apworld.wwi-global',
      kind: 'event',
      title: 'the alliance cascade (July-August 1914)',
      content:
        "Austria-Hungary's ultimatum to Serbia → Russia mobilized in Serbia's defense → Germany declared war on Russia, then France → Germany's invasion of Belgium brought Britain in — a Balkan crisis escalated into continental war within about five weeks via the alliance system.",
    },
    {
      loId: 'apworld.wwi-global',
      kind: 'event',
      title: 'colonial manpower',
      content:
        'British India contributed more than 1.3 million men to Allied forces overseas by the 1918 armistice; France recruited large numbers of West African soldiers, the tirailleurs sénégalais, for the Western Front and elsewhere — WWI fought as a genuinely global, not purely European, war.',
    },
    {
      loId: 'apworld.wwi-global',
      kind: 'event',
      title: 'Ottoman collapse and the Armenian genocide (1915-1923)',
      content:
        'The Ottoman Empire fought on the side of the Central Powers; during the war its government carried out systematic, documented deportations and mass killings of its Armenian population, killing an estimated 600,000 to 1.5 million people. Ottoman defeat led to the empire\'s territorial collapse and partition.',
    },
    {
      loId: 'apworld.wwi-global',
      kind: 'event',
      title: "Wilson's Fourteen Points, Point V (January 1918)",
      content:
        'Called for "impartial adjustment of all colonial claims," with "the interests of the populations concerned" given equal weight to "the equitable claims of the government" seeking title — raising expectations of genuine self-determination for colonized peoples.',
    },
    {
      loId: 'apworld.wwi-global',
      kind: 'event',
      title: 'Treaty of Versailles, Article 22 (1919)',
      content:
        'Instead framed the same populations as "not yet able to stand by themselves" and assigned "tutelage" over them to "advanced nations" as Mandatories — guardianship language, not equal-weight adjustment. Mandates went chiefly to Britain and France over former Ottoman territories (Iraq, Palestine, Syria, Lebanon) and former German colonies.',
    },
    {
      loId: 'apworld.wwi-global',
      kind: 'trap',
      title: 'the Fourteen Points / mandate-system gap',
      content:
        'Wilson\'s Point V promised colonized populations\' interests would count EQUALLY with the governing power\'s claims; Article 22 delivered guardianship assigned mainly to the same imperial powers already practiced at colonial rule. Cite the specific clauses, not a vague "the peace betrayed its promises."',
    },
  ],
  methods: [
    {
      title: 'Compare a wartime statement of principle against the actual postwar treaty text',
      when_to_use:
        'Use whenever an FRQ or short-answer asks how a stated wartime aim (e.g. the Fourteen Points) compares to what the peace settlement actually delivered.',
      steps: [
        'Source both documents: when was each written, and what kind of document is each (aspirational address vs. binding treaty text)?',
        'Identify the specific promise in the earlier document — quote its key clause.',
        'Identify the specific provision in the later document that addresses the same subject — quote its key clause.',
        'State the gap precisely: what language changed, and in whose favor?',
        'Connect the gap to who actually benefited in practice (which powers received the assigned territories/mandates).',
      ],
      example: {
        problem: 'How does the Versailles mandate system (Article 22) compare to the promise in Wilson\'s Fourteen Points, Point V?',
        solution:
          'Point V promised colonized populations\' interests would count equally with the governing power\'s claims. Article 22 instead framed those populations as needing "tutelage" from "advanced nations," and mandates went chiefly to Britain and France over former Ottoman and German territory — a reallocation of imperial control under new legal language, not equal-weight adjustment.',
      },
      relatedLoIds: ['apworld.wwi-global'],
    },
  ],
  pointers: [
    { content: 'WWI was NOT a purely European war — the Ottoman front, British Indian and West African colonial troops, and Japan\'s entry all made it global.', kind: 'trap' },
    { content: 'Keep the MAIN causes (long-term, structural) distinct from Franz Ferdinand\'s assassination (the immediate trigger) — an FRQ may ask for either.', kind: 'tip' },
    { content: 'The Armenian genocide (1915-1923) is a documented state campaign, not sporadic violence — cite it factually, one line of scale (600,000-1.5 million).', kind: 'tip' },
    { content: 'Quote Point V and Article 22 precisely when contrasting them — "impartial adjustment... equal weight" vs. "tutelage... sacred trust" are the load-bearing phrases.', kind: 'tip' },
    { content: "Mandates were assigned almost entirely to the SAME Allied imperial powers (Britain, France) already experienced at colonial rule — don't describe the mandate system as ending imperial control.", kind: 'common-error' },
  ],
};
