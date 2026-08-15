/**
 * AP US History — Unit 5 CED 5.2-5.3: Manifest Destiny and the
 * Mexican-American War.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apush.manifest-destiny.v1`. Covers Texas annexation, the
 * Oregon settlement, the Mexican-American War and the Mexican Cession,
 * the Wilmot Proviso, the Gold Rush, and the contested nature of
 * manifest destiny ideology — anchored by John L. O'Sullivan's
 * "Annexation" (1845).
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APUSH_MANIFEST_DESTINY: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apush.manifest-destiny.v1',
  course: 'AP United States History',
  cedUnit: 5,
  cedTopic: '5.2-5.3',
  cedTitle: 'Manifest Destiny and the Mexican-American War',
  planId: 'evelyn.ap.apush.manifest-destiny.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-11',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apush.manifest-destiny.v1' }],
  theory: [
    {
      loId: 'apush.manifest-destiny',
      kind: 'definition',
      title: 'manifest destiny',
      content:
        'The belief, named by John O\'Sullivan\'s 1845 essay "Annexation," that the United States was providentially destined to expand across the continent. It was a contested political argument advanced by expansionist Democrats to justify specific annexations already underway, not a preexisting national consensus.',
    },
    {
      loId: 'apush.manifest-destiny',
      kind: 'definition',
      title: 'Mexican Cession',
      content:
        "The roughly half of Mexico's territory — including California and the future New Mexico, Arizona, Nevada, and Utah — ceded to the United States under the Treaty of Guadalupe Hidalgo (1848), which ended the Mexican-American War in exchange for a US payment and assumption of some claims.",
    },
    {
      loId: 'apush.manifest-destiny',
      kind: 'definition',
      title: 'Wilmot Proviso',
      content:
        'David Wilmot\'s 1846 proposal to ban slavery in any territory acquired from Mexico. It repeatedly passed the House (Northern population majority) but failed in the Senate (even slave/free balance) and never became law — but it revealed that territorial expansion had reopened the fight over slavery\'s spread.',
    },
    {
      loId: 'apush.manifest-destiny',
      kind: 'event',
      title: 'Texas annexation (1845)',
      content:
        'American settlers moved into Mexican Texas through the 1820s-30s; cultural and political tensions, including over slavery (which Mexico had abolished), produced the Texas Revolution (1836) and a decade of independence. The US annexed Texas by congressional joint resolution in 1845 — the very question O\'Sullivan\'s essay defended against foreign objection.',
    },
    {
      loId: 'apush.manifest-destiny',
      kind: 'event',
      title: 'the Oregon Treaty (1846)',
      content:
        'The US and Britain had jointly occupied the Oregon Country since 1818. Expansionist Democrats campaigned in 1844 on "Fifty-Four Forty or Fight," demanding the whole territory. The dispute was resolved diplomatically, not by war: the Oregon Treaty (1846) split the territory at the 49th parallel.',
    },
    {
      loId: 'apush.manifest-destiny',
      kind: 'event',
      title: 'the Mexican-American War (1846-1848)',
      content:
        'Texas annexation created a border dispute (US claimed the Rio Grande; Mexico maintained the Nueces River). President Polk sent troops into the disputed zone, provoking a clash he used to seek a war declaration in 1846. The war ended with the Treaty of Guadalupe Hidalgo (1848) and the Mexican Cession.',
    },
    {
      loId: 'apush.manifest-destiny',
      kind: 'event',
      title: 'the California Gold Rush (1848-49)',
      content:
        "Gold was discovered at Sutter's Mill in January 1848, just before Guadalupe Hidalgo was signed. The resulting migration swelled California's population so fast it applied for statehood as a FREE state within two years, forcing Congress to confront the territorial-slavery question immediately — setting up the Compromise of 1850 crisis.",
    },
    {
      loId: 'apush.manifest-destiny',
      kind: 'event',
      title: "\"Annexation\" (John L. O'Sullivan, 1845)",
      content:
        'O\'Sullivan\'s Democratic Review essay argued Texas annexation should be lifted above "party dissensions" because other nations (Britain, France) had interfered in "a spirit of hostile interference" — and in doing so coined "manifest destiny," a phrase treating contested expansion as providentially self-evident rather than as one argument among several genuinely being fought over.',
    },
    {
      loId: 'apush.manifest-destiny',
      kind: 'framework',
      title: 'reading "manifest destiny" as an argument, not a fact',
      content:
        'Calling expansion "manifest" (obvious) and "allotted by Providence" is itself a rhetorical move that forecloses debate — it does not describe a preexisting consensus. Britain and France\'s real diplomatic engagement with independent Texas (partly over British antislavery interest) is recast by O\'Sullivan as illegitimate "interference," evidence the claim was contested, not settled.',
    },
    {
      loId: 'apush.manifest-destiny',
      kind: 'trap',
      title: 'manifest destiny was contested, not uncontested',
      content:
        "Whigs broadly opposed the Mexican War as an unnecessary, presidentially provoked conflict; Whig congressman Abraham Lincoln's 1847 Spot Resolutions publicly challenged Polk's justification; abolitionists and antislavery Northerners opposed the war specifically fearing it would expand slave territory — a fear the Wilmot Proviso fight then confirmed. Do not describe manifest destiny as a universal American belief.",
    },
    {
      loId: 'apush.manifest-destiny',
      kind: 'framework',
      title: 'expansion reopened the slavery question',
      content:
        "Each new acquisition (Texas, the Mexican Cession) forced Congress to decide whether slavery would extend into it. The Wilmot Proviso's repeated failure in the Senate, and California's free-state statehood bid after the Gold Rush, show this was not a side issue — it was the central political consequence of territorial expansion in this period.",
    },
  ],
  methods: [
    {
      title: 'Source and analyze an expansionist argument (HIPP)',
      when_to_use:
        'Use this on any 1840s-50s primary source that argues FOR a specific US territorial acquisition, before accepting its framing (providential, inevitable, uncontested) at face value.',
      steps: [
        'H — HISTORICAL CONTEXT: what specific, still-contested policy question was live when this was written?',
        'I — INTENDED AUDIENCE: who is the writer trying to persuade, and toward what specific political outcome?',
        'P — PURPOSE: state the purpose as a verb (settle a partisan dispute, preempt foreign objection, justify a war) not a topic.',
        "P — POINT OF VIEW: whose specific political or economic interest does the writer's framing serve?",
        'IDENTIFY WHAT THE RHETORIC IS DOING. Language like "manifest," "providential," or "inevitable" is itself an argument that forecloses debate — treat it as evidence of contestation, not proof of consensus.',
      ],
      example: {
        problem:
          'Reconstruct the argument of O\'Sullivan\'s "Annexation" (1845): expansion is "manifest destiny... allotted by Providence," and other nations\' involvement is "hostile interference."',
        solution:
          'Historical context: written in 1845 while Texas annexation remained a genuinely contested question domestically and diplomatically. Purpose: to recast a partisan and diplomatic dispute as a matter of national destiny under threat, foreclosing debate. Point of view: an expansionist Democratic editor defending a specific annexation already voted on by Congress. The providential language is the argument, not a neutral fact — real opposition (Whigs, antislavery Northerners) and real foreign diplomatic activity (Britain/France with independent Texas) existed and are recast here as illegitimate.',
      },
      relatedLoIds: ['apush.manifest-destiny'],
    },
  ],
  pointers: [
    { content: '"Manifest destiny" names a contested 1845 political argument, not a description of a preexisting national consensus — never write it as though all Americans agreed.', kind: 'trap' },
    { content: 'The Oregon dispute was settled by treaty (1846, 49th parallel), not war — do not confuse it with the Mexican-American War.', kind: 'tip' },
    { content: 'The Wilmot Proviso never became law (it passed the House repeatedly but failed in the Senate) — know that it failed, but still mattered as evidence of reopened sectional conflict.', kind: 'trap' },
    { content: 'Texas annexation (1845) preceded and caused the Mexican-American War (1846-48); the Mexican Cession (1848, Guadalupe Hidalgo) is the war\'s territorial result — keep the sequence straight.', kind: 'tip' },
    { content: 'The Gold Rush (1848-49) is the direct link forward to the Compromise of 1850 — California\'s rapid free-state statehood bid forced the territorial-slavery question immediately.', kind: 'tip' },
  ],
};
