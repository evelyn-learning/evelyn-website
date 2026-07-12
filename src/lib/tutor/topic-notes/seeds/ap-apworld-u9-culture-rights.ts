/**
 * AP World History — Unit 9 CED 9.8-9.9: Global Culture, Human Rights, and
 * Migration.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.culture-rights-migration.v1`. Covers multidirectional
 * global popular-culture flows, the UDHR and human-rights movements,
 * migration/refugee debates, religious revivals, and the post-9/11
 * security-vs-rights debate.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_U9_CULTURE_RIGHTS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.culture-rights-migration.v1',
  course: 'AP World History',
  cedUnit: 9,
  cedTopic: '9.8-9.9',
  cedTitle: 'Global Culture, Human Rights, and Migration',
  planId: 'evelyn.ap.apworld.culture-rights-migration.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.culture-rights-migration.v1' }],
  theory: [
    {
      loId: 'apworld.culture-rights-migration',
      kind: 'event',
      title: 'the Universal Declaration of Human Rights (1948)',
      content:
        'Adopted by the UN General Assembly after WWII\'s atrocities, the UDHR proclaimed rights belonging to "all members of the human family" — a genuinely new claim that rights are universal, not granted solely at each government\'s discretion. Not legally binding alone, but foundational to later binding treaties and rights movements.',
    },
    {
      loId: 'apworld.culture-rights-migration',
      kind: 'framework',
      title: 'global popular culture flows in multiple directions',
      content:
        "Bollywood (India) reaches large audiences across South Asia and beyond; K-pop (South Korea) became a global phenomenon; football, rooted across Europe, Latin America, Africa, and Asia, became the world's most followed sport. Cultural globalization moved outward from many centers, not one.",
    },
    {
      loId: 'apworld.culture-rights-migration',
      kind: 'event',
      title: 'the anti-apartheid movement',
      content:
        'Internal South African resistance combined with global pressure (boycotts, diplomatic isolation), contributing to the end of apartheid and South Africa\'s first fully democratic elections in 1994. Described here, never quoted from any figure\'s writings.',
    },
    {
      loId: 'apworld.culture-rights-migration',
      kind: 'event',
      title: 'global feminism and Beijing (1995)',
      content:
        "The international women's-rights movement gained institutional expression at UN World Conferences on Women, most notably the 1995 Beijing conference, bringing delegates worldwide together around shared (if contested) goals for gender equality.",
    },
    {
      loId: 'apworld.culture-rights-migration',
      kind: 'cause',
      title: 'migration and refugee debates',
      content:
        "Decolonization, conflict, and economic opportunity drove large-scale postwar migration; wars and persecution produced large refugee populations requiring international response (the UN's refugee agency, established 1950). How many migrants/refugees to admit, and on what terms, remained a persistent, contested political issue.",
    },
    {
      loId: 'apworld.culture-rights-migration',
      kind: 'event',
      title: 'religious revivals and fundamentalisms',
      content:
        'Across multiple faiths (Christian, Islamic, Hindu, Jewish), the late 20th century saw religious revival and more assertive fundamentalist currents responding to secularization, rapid social change, and globalization — a pattern not limited to any single tradition.',
    },
    {
      loId: 'apworld.culture-rights-migration',
      kind: 'event',
      title: 'September 11, 2001 and the security-vs-rights debate',
      content:
        'The 9/11 attacks prompted a global reassessment of the balance between security and civil liberties/rights, including expanded surveillance and security powers in multiple countries — a documented, contested, ongoing debate rather than one this course treats as settled.',
    },
    {
      loId: 'apworld.culture-rights-migration',
      kind: 'trap',
      title: 'hybridity, not erasure',
      content:
        'Cultural globalization did not erase local culture with a single homogeneous (Western) culture. Local cultures generally blended with global influences — adapting, adopting, re-exporting — producing hybrid forms in many directions rather than one culture replacing all others.',
    },
  ],
  methods: [
    {
      title: 'Analyze a post-9/11 security document for the security-vs-rights tension',
      when_to_use:
        'Use this when a document responds to a security crisis while also explicitly addressing a group whose rights or standing could be affected by the response, before concluding the document resolves the tension one way or the other.',
      steps: [
        'IDENTIFY THE SECURITY CLAIM: how broadly does the document frame the threat/response?',
        'IDENTIFY ANY EXPLICIT RIGHTS-PROTECTING LANGUAGE aimed at a specific group.',
        'CONNECT THE TWO: does pairing them show the tension being MANAGED, not resolved?',
        'AVOID CLAIMING THE DOCUMENT SETTLES THE DEBATE — treat it as one moment in an ongoing tension.',
      ],
      example: {
        problem:
          'Bush (Sept. 20, 2001) frames 9/11 as an attack on "freedom itself" while separately telling Muslims worldwide that terrorists "blaspheme the name of Allah." What does pairing these show?',
        solution:
          'An expansive security framing paired with an explicit effort to exempt Muslims/Arabs from that framing shows the security-vs-rights tension being actively managed in real time, not resolved — the debate over surveillance, detention, and civil liberties continued well beyond this address.',
      },
      relatedLoIds: ['apworld.culture-rights-migration'],
    },
  ],
  pointers: [
    { content: 'Cultural globalization produces HYBRIDITY, not erasure of local culture — K-pop, Bollywood, and football all flow from non-Western centers. This is the #1 tested misconception for this topic.', kind: 'trap' },
    { content: 'The UDHR (1948) is not legally binding by itself — it\'s foundational to LATER binding treaties. Don\'t call it a binding law on an SAQ.', kind: 'gotcha' },
    { content: 'Keep anti-apartheid (ended 1994) and Beijing/global feminism (1995) as two SEPARATE rights movements — don\'t merge them into one example.', kind: 'tip' },
    { content: '9/11\'s security-vs-rights debate is presented as ONGOING/CONTESTED in this course — frame FRQ answers as "opened a debate," not as a settled resolution either way.', kind: 'tip' },
    { content: 'Bush\'s Sept. 20, 2001 quotes are from three NON-ADJACENT parts of the same speech — don\'t quote them as one continuous passage.', kind: 'gotcha' },
  ],
};
