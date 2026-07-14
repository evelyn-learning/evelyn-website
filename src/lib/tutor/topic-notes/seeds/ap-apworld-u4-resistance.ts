/**
 * AP World History — Unit 4 CED 4.7-4.8: Resistance and Accommodation.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.resistance-accommodation.v1`. Covers Tokugawa Japan's
 * managed isolation, the Qing Canton System, Ottoman capitulations, maroon
 * communities, and Queen Nzinga's resistance to Portugal. CRITICAL: no
 * quotation marks are placed around any edict language anywhere in this
 * file — the Tokugawa edict is a described document with no confirmed
 * public-domain translation (see apworld-tokugawa-edict.ts), so all
 * content below paraphrases it in original prose, matching the plan.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_RESISTANCE: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.resistance-accommodation.v1',
  course: 'AP World History: Modern',
  cedUnit: 4,
  cedTopic: '4.7-4.8',
  cedTitle: 'Resistance and Accommodation',
  planId: 'evelyn.ap.apworld.resistance-accommodation.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.resistance-accommodation.v1' }],
  theory: [
    {
      loId: 'apworld.resistance-accommodation',
      kind: 'definition',
      title: 'sakoku',
      content:
        "The Tokugawa shogunate's policy, tightened through a series of directives culminating in the 1630s, of sharply restricting Japanese travel abroad and confining foreign trade to a small number of closely supervised locations.",
    },
    {
      loId: 'apworld.resistance-accommodation',
      kind: 'definition',
      title: 'Canton System',
      content:
        'The Qing policy, established in 1757, confining all European trade to the port of Guangzhou (Canton) and channeling it through licensed Chinese merchant guilds (the cohong).',
    },
    {
      loId: 'apworld.resistance-accommodation',
      kind: 'definition',
      title: 'capitulations',
      content:
        'Special trading privileges and legal exemptions the Ottoman Empire granted to certain European states, a deliberate policy of managed access rather than a loss of Ottoman sovereignty.',
    },
    {
      loId: 'apworld.resistance-accommodation',
      kind: 'event',
      title: 'Tokugawa restriction and the Dutch exception (paraphrase only)',
      content:
        'A series of Tokugawa directives, culminating in 1635, barred Japanese subjects from traveling abroad, treated returning from overseas as a serious offense, intensified enforcement against Christianity through incentives for informants, and concentrated foreign trade into a small number of closely supervised locations. By 1641, this policy narrowed permitted European trade to the Dutch alone, confined to the small artificial island of Dejima in Nagasaki harbor.',
    },
    {
      loId: 'apworld.resistance-accommodation',
      kind: 'event',
      title: 'the Qing Canton System',
      content:
        'The Kangxi and Qianlong emperors managed, rather than rejected, growing European trade demand. From 1757, the Qing state confined all European trade to Guangzhou (Canton), channeling it through licensed cohong merchant guilds — tight state supervision over the terms of access.',
    },
    {
      loId: 'apworld.resistance-accommodation',
      kind: 'event',
      title: 'Ottoman capitulations',
      content:
        'The Ottoman Empire granted certain European states trading privileges and legal exemptions (capitulations), especially earlier in this period from a position of strength — a deliberate policy of managed access, not a sign of weakness.',
    },
    {
      loId: 'apworld.resistance-accommodation',
      kind: 'event',
      title: 'maroon communities',
      content:
        'Enslaved people who escaped bondage across the Americas formed autonomous maroon communities (e.g., Palmares in Brazil, Jamaican Maroons) that sustained independence from colonial control, in some cases fighting off colonial expeditions for years and negotiating formal treaties recognizing autonomy.',
    },
    {
      loId: 'apworld.resistance-accommodation',
      kind: 'event',
      title: 'Queen Nzinga of Ndongo/Matamba',
      content:
        "From roughly the 1620s into the 1660s, Queen Nzinga led sustained resistance to Portuguese encroachment in West-Central Africa (present-day Angola), combining decades of warfare, shifting alliances, and diplomacy to preserve her states' independence.",
    },
    {
      loId: 'apworld.resistance-accommodation',
      kind: 'event',
      title: "Metacom's War (1675-1676, brief cross-reference)",
      content:
        "In New England, Metacom (King Philip) led a major armed Indigenous uprising against English colonial expansion — a reminder that armed resistance occurred in the Americas as well as in Africa and Asia.",
    },
    {
      loId: 'apworld.resistance-accommodation',
      kind: 'framework',
      title: 'managed access, not passive reception',
      content:
        "Tokugawa Japan, Qing China, and the Ottoman Empire all designed active systems for regulating the TERMS of European contact — restricting some things (travel, religion, unsupervised trade) while deliberately preserving narrow, controlled channels — rather than either fully rejecting or passively absorbing contact.",
    },
    {
      loId: 'apworld.resistance-accommodation',
      kind: 'trap',
      title: 'do not assume passive reception of European expansion',
      content:
        'Most non-European states actively regulated the terms of European contact well into this period — the large-scale shift toward European dominance of those terms mostly came later, with industrialization.',
    },
  ],
  methods: [
    {
      title: 'Discuss a described document without quoting it',
      when_to_use:
        'Use this whenever the source material is a DESCRIBED document (a prose summary rather than a verbatim translated text) — e.g. the Tokugawa edict, where no confirmed public-domain translation exists.',
      steps: [
        'Confirm the stimulus is a description, not a verbatim quotation, before writing anything about it.',
        "Paraphrase the document's content entirely in your own words — never place quotation marks around any language attributed to the original document.",
        'State what the document DID (its effects/provisions) rather than reproducing how it was worded.',
        "Connect the paraphrased content to the concept's causal claim (here: active management of contact terms) just as you would with a quoted primary source.",
      ],
      example: {
        problem:
          'A described document summarizes Tokugawa directives culminating in 1635 that barred Japanese travel abroad and narrowed foreign trade to supervised ports. How should this be discussed?',
        solution:
          "Describe what the directives did — restricted travel, intensified action against Christianity, concentrated trade into supervised locations — entirely in your own words, with no quotation marks around any specific edict wording, since no confirmed public-domain translation is used here.",
      },
      relatedLoIds: ['apworld.resistance-accommodation'],
    },
  ],
  pointers: [
    { content: 'NEVER quote the Tokugawa edict — it is a described document with no confirmed public-domain translation. Paraphrase its content in your own words, with no quotation marks around any edict language.', kind: 'gotcha' },
    { content: 'Non-European states mostly REGULATED, not passively received, European contact until industrialization — this is the #1 tested misconception for this topic.', kind: 'trap' },
    { content: 'Tokugawa sakoku (culminating 1635) and the Dutch confinement to Dejima (1641) are different dates — the edict restricted broadly; the Dejima confinement came a few years later as the policy\'s endpoint.', kind: 'tip' },
    { content: 'The Qing Canton System (1757) and Ottoman capitulations are both examples of MANAGED trade access, not outright rejection of European trade — don\'t describe either as an isolationist policy.', kind: 'tip' },
    { content: "Queen Nzinga's resistance (roughly 1620s-1660s) combined warfare AND diplomacy — don't reduce her to only a military figure.", kind: 'tip' },
    { content: "Metacom's War (1675-1676) is a brief cross-reference here, not the focus — the main comparative cases for this topic are Tokugawa Japan, Qing China, the Ottoman Empire, maroon communities, and Queen Nzinga.", kind: 'tip' },
  ],
};
