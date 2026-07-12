/**
 * AP World History — Unit 3 CED 3.2: Empires: Administration.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.empires-administration.v1`. Covers the Ottoman
 * devshirme/janissary system and divan, the Mughal mansabdar/zamindar
 * system, Qing banners and the Confucian exam, Peter the Great's
 * service-state reforms, and tax farming vs. salaried bureaucracy as
 * four different solutions to the same elite-loyalty problem, 1450-1750.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_EMPIRES_ADMINISTRATION: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.empires-administration.v1',
  course: 'AP World History',
  cedUnit: 3,
  cedTopic: '3.2',
  cedTitle: 'Empires: Administration',
  planId: 'evelyn.ap.apworld.empires-administration.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.empires-administration.v1' }],
  theory: [
    {
      loId: 'apworld.empires-administration',
      kind: 'definition',
      title: 'devshirme',
      content:
        'The Ottoman levy of Christian boys from the Balkans, converted to Islam and trained for military (janissary) or administrative service purely on merit, with no independent hereditary power base. Busbecq, a Habsburg ambassador at Suleiman\'s court, confirmed this ethos: "No distinction is attached to birth among the Turks," and those who "receive the highest offices from the Sultan are for the most part the sons of shepherds or herdsmen."',
    },
    {
      loId: 'apworld.empires-administration',
      kind: 'definition',
      title: 'mansabdar / jagir',
      content:
        'A Mughal officeholder (mansabdar) granted the right to collect revenue from an assigned territory (a jagir) rather than owning land outright. Bernier records that the emperor "constitutes himself heir of all the Omrahs... and likewise of the Mansebdars" and "is proprietor of every acre of land in the kingdom" — so a mansabdar\'s rank and revenue right could not simply pass to his children as an independent hereditary estate.',
    },
    {
      loId: 'apworld.empires-administration',
      kind: 'definition',
      title: 'Table of Ranks (1722)',
      content:
        "Peter the Great's system ranking Russian nobles and officials by achieved military or civil office rather than birth alone, requiring lifelong state service as the price of noble status and allowing sufficiently high-achieving commoners to be ennobled.",
    },
    {
      loId: 'apworld.empires-administration',
      kind: 'framework',
      title: 'zamindar — the local hereditary layer beneath mansabdars',
      content:
        'Zamindars were local hereditary landholders and tax-collectors incorporated into Mughal revenue administration beneath the mansabdar system — a hybrid combining centrally appointed, non-hereditary elites (mansabdars) with locally rooted, hereditary intermediaries (zamindars).',
    },
    {
      loId: 'apworld.empires-administration',
      kind: 'framework',
      title: 'the Ottoman divan',
      content:
        "The imperial council, led by the Grand Vizier, that advised the Sultan and administered the empire's provinces, taxation, and law — staffed heavily by devshirme-trained officials whose careers depended entirely on the Sultan's continued favor.",
    },
    {
      loId: 'apworld.empires-administration',
      kind: 'event',
      title: 'Qing Eight Banners',
      content:
        'The hereditary Manchu (later also Mongol and Han) military-social units that formed the core of Qing military power after the 1644 conquest, holding distinct legal and social status from the ordinary Han Chinese population.',
    },
    {
      loId: 'apworld.empires-administration',
      kind: 'event',
      title: 'Qing continuation of the Confucian civil-service exam',
      content:
        "Unlike the Ottomans or Mughals, the Qing preserved the exam system inherited from earlier Chinese dynasties (including the Song, studied in Unit 1) to recruit Han Chinese scholar-officials — pairing a hereditary Manchu military elite (banners) with a nominally meritocratic Han civil elite.",
    },
    {
      loId: 'apworld.empires-administration',
      kind: 'framework',
      title: 'tax farming vs. salaried bureaucracy',
      content:
        'Tax farming — selling the right to collect regional taxes to a private financier who keeps a cut — was cheaper for the state up front but prone to extortion and weaker central oversight. A salaried bureaucracy, paid directly from the treasury, cost more up front but gave tighter central control. The Ottomans, Mughals, Qing, and Russia all relied on some mix of both.',
    },
    {
      loId: 'apworld.empires-administration',
      kind: 'framework',
      title: 'four different solutions to one problem',
      content:
        'Every empire faced the same core problem — building an elite loyal enough to administer/defend the state but not independent enough to threaten it — and solved it differently: the Ottomans manufactured a loyal elite from outsiders (devshirme); the Mughals granted non-hereditary revenue rights atop crown land ownership while co-opting local zamindars; the Qing paired a hereditary conquest elite (banners) with a meritocratic civil-exam bureaucracy; Russia compelled its EXISTING nobility into lifelong, rank-based service (Table of Ranks).',
    },
    {
      loId: 'apworld.empires-administration',
      kind: 'trap',
      title: 'no universal hereditary aristocracy',
      content:
        "Do not assume any of these empires relied primarily on a Western-European-style hereditary landed aristocracy. The Ottomans explicitly rejected birth as a qualification; the Mughals denied durable hereditary landholding via mansabdar/jagir; the Qing hybridized a hereditary conquest elite with a civil-exam bureaucracy; Russia compelled an EXISTING nobility into service rather than replacing or entrenching it unconditionally.",
    },
  ],
  methods: [
    {
      title: "Source and compare a document on imperial elite-control",
      when_to_use:
        "Use this on any unfamiliar primary-source excerpt describing how a land-based empire recruited, rewarded, or controlled its administrative/military elite, before making a claim about what the source shows or how it compares to another empire's system.",
      steps: [
        'H — HISTORICAL CONTEXT: who wrote this, when, and in what capacity (insider official, outside ambassador/traveler)?',
        'IDENTIFY THE CLAIM: what specific mechanism of elite recruitment, reward, or control does the excerpt describe?',
        "CONNECT TO THE EMPIRE'S OWN SYSTEM: name the specific institution (devshirme, mansabdar/jagir, banners, Table of Ranks) the excerpt illustrates.",
        "CONTRAST WITH ANOTHER EMPIRE'S SOLUTION: state how a DIFFERENT empire solved the same underlying problem (a loyal, non-hereditary-threat elite) by a different method.",
        'STATE THE SHARED PROBLEM: name the common goal (preventing an independent hereditary power base) both systems addressed.',
      ],
      example: {
        problem:
          'Analyze Bernier\'s claim that the Mughal emperor "constitutes himself heir of all the Omrahs... and likewise of the Mansebdars" and "is proprietor of every acre of land in the kingdom." How does this compare to the Ottoman devshirme system?',
        solution:
          "Context: Bernier, a French physician at Aurangzeb's court, writing for a European audience (Colbert). Claim: the crown's legal claim to a deceased officeholder's estate and to virtually all land. Connects to: the mansabdar/jagir system — revenue rights, not heritable land. Contrast: the Ottoman devshirme achieved a similar non-hereditary elite by recruiting outsiders from scratch, rather than legally denying inheritance to an existing nobility. Shared problem: preventing a hereditary elite from rivaling the center.",
      },
      relatedLoIds: ['apworld.empires-administration'],
    },
  ],
  pointers: [
    { content: 'Busbecq\'s "No distinction is attached to birth among the Turks" is the key quotable line for the Ottoman devshirme system on an FRQ.', kind: 'frq-vocab' },
    { content: "Bernier's account shows the Mughal crown claiming to INHERIT a mansabdar's estate at death — that's the mechanism preventing hereditary landed power, not simple state land ownership alone.", kind: 'tip' },
    { content: "Don't conflate mansabdar (centrally appointed, non-hereditary rank/jagir) with zamindar (local hereditary landholder/tax-collector) — they're two different layers of the same Mughal system.", kind: 'tip' },
    { content: 'The Qing paired TWO elite systems, not one: hereditary Manchu banners (military) alongside the inherited Han Confucian civil-exam bureaucracy (administration).', kind: 'tip' },
    { content: "Peter's Table of Ranks (1722) compelled Russia's EXISTING nobility into lifelong service — this is different in method from the Ottoman/Mughal systems, which built or reshaped an elite rather than compelling an already-existing one.", kind: 'tip' },
    { content: 'This LO is the #1 place to compare across empires on an FRQ: four different administrative solutions to the same elite-loyalty problem is a ready-made comparison paragraph.', kind: 'edge-case' },
  ],
};
