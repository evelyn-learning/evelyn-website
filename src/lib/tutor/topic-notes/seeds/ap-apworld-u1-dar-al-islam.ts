/**
 * AP World History — Unit 1 CED 1.2: Developments in Dar al-Islam.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.dar-al-islam.v1`. Covers the fragmentation of
 * Abbasid political authority into regional successor states (Seljuk,
 * Mamluk, Delhi), the 1258 Mongol sack of Baghdad, and the
 * ulama/madrasa/Sufi networks that sustained cultural and religious
 * unity across the Dar al-Islam despite political fragmentation.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_DAR_AL_ISLAM: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.dar-al-islam.v1',
  course: 'AP World History: Modern',
  cedUnit: 1,
  cedTopic: '1.2',
  cedTitle: 'Developments in Dar al-Islam',
  planId: 'evelyn.ap.apworld.dar-al-islam.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.dar-al-islam.v1' }],
  theory: [
    {
      loId: 'apworld.dar-al-islam',
      kind: 'definition',
      title: 'Dar al-Islam',
      content:
        'The collective territories under Muslim rule and cultural influence — by 1200, stretching from Iberia and North Africa through the Middle East into Central and South Asia. A religiously and culturally connected zone, NOT a single unified political empire.',
    },
    {
      loId: 'apworld.dar-al-islam',
      kind: 'definition',
      title: 'ulama and madrasa',
      content:
        'The ulama (Muslim religious scholars) trained on a shared curriculum at madrasas (Islamic colleges) across vast distances, creating a common legal and intellectual culture that did not depend on any single political ruler\'s survival.',
    },
    {
      loId: 'apworld.dar-al-islam',
      kind: 'definition',
      title: 'Sufism',
      content:
        'A mystical tradition within Islam, organized into orders (tariqas) whose traveling teachers spread devotional practice far beyond the reach of any Muslim ruler\'s direct political control — a major vehicle for both cultural cohesion and further religious expansion.',
    },
    {
      loId: 'apworld.dar-al-islam',
      kind: 'event',
      title: 'Abbasid Caliphate\'s hollowed-out political power',
      content:
        'The Abbasid Caliphate, based in Baghdad since 750, was the nominal center of Sunni Islamic authority. By 1200, its ACTUAL political power over most of its claimed territory had already been hollowed out for centuries, ceded to regional dynasties that ruled independently.',
    },
    {
      loId: 'apworld.dar-al-islam',
      kind: 'event',
      title: 'regional successor states',
      content:
        'The Seljuk Turks built a powerful sultanate across Persia, Anatolia, and Iraq from the 11th century, for a time preserving the Abbasid caliph as a religious figurehead. The Mamluks, former slave-soldiers, seized power in Egypt in 1250, defeated the Mongols at Ain Jalut (1260), and hosted a ceremonial Abbasid caliph in Cairo after Baghdad\'s fall. The Delhi Sultanate (est. 1206) extended Muslim political rule into South Asia entirely independent of Baghdad.',
    },
    {
      loId: 'apworld.dar-al-islam',
      kind: 'event',
      title: 'the Mongol sack of Baghdad (1258)',
      content:
        'Hulegu\'s Mongol forces destroyed Baghdad and executed the last Baghdad-based Abbasid caliph — a genuine, dramatic rupture. This event ended a specific institution (a five-century political/religious center), not the Dar al-Islam\'s broader political or cultural life, which by then had many centers already independent of Baghdad.',
    },
    {
      loId: 'apworld.dar-al-islam',
      kind: 'event',
      title: 'earlier intellectual legacy continued to circulate',
      content:
        "The translation/synthesis tradition of Baghdad's House of Wisdom, the philosophy of Ibn Rushd (Averroes, writing in Iberia, whose commentaries on Aristotle later influenced European scholastic thought), and the mathematical legacy tied to al-Khwarizmi (source of the word \"algorithm\") remained part of a shared scholarly inheritance across the Dar al-Islam even as Baghdad's political-intellectual primacy declined.",
    },
    {
      loId: 'apworld.dar-al-islam',
      kind: 'cause',
      title: 'political fragmentation without cultural rupture',
      content:
        'Real political power in the Dar al-Islam fragmented into competing sultanates (Seljuk, Mamluk, Delhi, and others) and suffered a genuine rupture with Baghdad\'s fall in 1258 — but a shared religious and intellectual infrastructure (ulama, madrasas, Sufi networks) kept the wider Islamic world culturally and religiously connected across those political divisions.',
    },
    {
      loId: 'apworld.dar-al-islam',
      kind: 'trap',
      title: 'do not conflate Baghdad\'s fall with the end of Islamic unity',
      content:
        'The Abbasid caliphate\'s political collapse in 1258 ended ONE institution, not the Dar al-Islam\'s cultural or religious unity. Political power had already fragmented well before 1258, and some successor states (the Mamluks) even thrived after Baghdad\'s fall.',
    },
    {
      loId: 'apworld.dar-al-islam',
      kind: 'framework',
      title: 'separate political fragmentation from cultural/religious unity',
      content:
        'Two distinct historical threads: (1) POLITICAL — power fragmented into competing regional dynasties, culminating in Baghdad\'s violent destruction in 1258. (2) CULTURAL/RELIGIOUS — the ulama, madrasas, Sufi orders, the hajj, and a shared scholarly heritage sustained connection across the whole Dar al-Islam independent of any one ruler\'s fate. Keep these two threads analytically separate on any FRQ.',
    },
  ],
  methods: [
    {
      title: 'Evaluate a sweeping historical claim against political vs. cultural evidence',
      when_to_use:
        'Use this when a claim generalizes from one dramatic political event (like Baghdad\'s fall) to a conclusion about an entire civilization\'s unity or coherence.',
      steps: [
        'Identify what part of the claim is accurate (the specific event actually happened as described).',
        'Identify what the claim overreaches on (generalizing from one institution/event to the whole civilization).',
        'Cite political counterevidence (other states/dynasties unaffected, or thriving, after the event).',
        'Cite cultural/religious counterevidence (networks that did not depend on the affected institution).',
        'State a revised, more precise conclusion that keeps political and cultural claims analytically separate.',
      ],
      example: {
        problem: 'Evaluate: "Baghdad\'s fall in 1258 ended Islamic political and cultural unity."',
        solution:
          'Accurate: Baghdad\'s Abbasid caliphate was destroyed in 1258. Overreach: treating this as the end of ALL Islamic political/cultural coherence. Political counterevidence: the Mamluks (from 1250) defeated the Mongols in 1260 and hosted a ceremonial caliph in Cairo; the Delhi Sultanate and other polities were unaffected. Cultural counterevidence: ulama, madrasas, Sufi orders, and the hajj continued linking Muslims regardless of Baghdad\'s fate. Revised conclusion: a real political rupture for one institution, not the end of the Dar al-Islam\'s broader political life or cultural unity.',
      },
      relatedLoIds: ['apworld.dar-al-islam'],
    },
  ],
  pointers: [
    { content: 'Baghdad\'s Abbasid caliphate was already mostly ceremonial by 1200 — its 1258 destruction ended a specific institution, not the whole Dar al-Islam\'s political life.', kind: 'trap' },
    { content: 'The Mamluks (Egypt, from 1250) actually defeated the Mongols at Ain Jalut in 1260 — a thriving Muslim power AFTER Baghdad\'s fall, useful counterevidence on an FRQ.', kind: 'frq-vocab' },
    { content: 'Keep POLITICAL fragmentation (competing sultanates) analytically separate from CULTURAL/RELIGIOUS unity (ulama, madrasas, Sufism) — they did not rise and fall together.', kind: 'tip' },
    { content: 'Ibn Rushd (Averroes) and al-Khwarizmi represent an intellectual legacy that kept circulating across the Dar al-Islam even as Baghdad declined — good "outside evidence" names for an essay.', kind: 'tip' },
    { content: 'This LO is UNWIRED to a passage — there is no seeded primary source for this topic; the worked example is a claim-evaluation exercise, not a document quote.', kind: 'edge-case' },
  ],
};
