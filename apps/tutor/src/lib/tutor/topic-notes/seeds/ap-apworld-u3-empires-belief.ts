/**
 * AP World History — Unit 3 CED 3.3-3.4: Empires: Belief Systems /
 * Comparison in Land-Based Empires.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.empires-belief-systems.v1`. Covers the Ottoman-
 * Safavid Sunni-Shia rivalry, the Ottoman millet system, Akbar's
 * sulh-i-kul and Aurangzeb's reversal, Sikhism's emergence, monumental
 * religious architecture as legitimacy, and the Kangxi Emperor's
 * Confucian orthodoxy, 1450-1750.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_EMPIRES_BELIEF_SYSTEMS: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.empires-belief-systems.v1',
  course: 'AP World History: Modern',
  cedUnit: 3,
  cedTopic: '3.3-3.4',
  cedTitle: 'Empires: Belief Systems',
  planId: 'evelyn.ap.apworld.empires-belief-systems.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.empires-belief-systems.v1' }],
  theory: [
    {
      loId: 'apworld.empires-belief-systems',
      kind: 'definition',
      title: 'millet system',
      content:
        'The Ottoman practice of governing non-Muslim religious communities (Orthodox Christian, Jewish, Armenian Christian) as semi-autonomous bodies managing their own internal legal, educational, and religious affairs, in exchange for loyalty and the jizya tax — real, institutionalized pluralism, but with legally subordinate status to Muslims.',
    },
    {
      loId: 'apworld.empires-belief-systems',
      kind: 'definition',
      title: 'sulh-i-kul',
      content:
        '("universal peace/tolerance") Akbar\'s Mughal policy of religious pluralism: abolishing the jizya on non-Muslims, appointing Hindus to the highest ranks of Mughal administration, sponsoring interfaith discussion, and floating the syncretic court philosophy Din-i Ilahi (which never became a mass religion).',
    },
    {
      loId: 'apworld.empires-belief-systems',
      kind: 'definition',
      title: 'jizya',
      content:
        'A tax historically levied on non-Muslim subjects in Muslim-ruled states. Akbar abolished it as part of sulh-i-kul; his great-grandson Aurangzeb reimposed it in 1679, reversing that policy.',
    },
    {
      loId: 'apworld.empires-belief-systems',
      kind: 'event',
      title: 'Ottoman-Safavid Sunni-Shia rivalry',
      content:
        'The Ottoman Empire was officially Sunni; the Safavid Empire, founded by Shah Ismail I in 1501, imposed Twelver Shiism as Persia\'s state religion — a deliberate, top-down religious transformation that defined Safavid identity and sharpened recurring conflict with the Sunni Ottomans.',
    },
    {
      loId: 'apworld.empires-belief-systems',
      kind: 'event',
      title: "Aurangzeb's reversal (1679)",
      content:
        "Akbar's great-grandson Aurangzeb reimposed the jizya tax on non-Muslims in 1679 and pursued more orthodox Sunni religious policies — proof that Mughal religious policy was not fixed but swung across the dynasty depending on the ruler.",
    },
    {
      loId: 'apworld.empires-belief-systems',
      kind: 'event',
      title: "Sikhism's emergence and later militarization",
      content:
        'Founded by Guru Nanak in the Punjab around the turn of the 16th century as a distinct monotheistic faith drawing on and departing from Hindu and Muslim traditions, Sikhism began as a peaceful devotional movement. Facing later Mughal persecution, including the execution of Sikh Gurus, the Sikh community increasingly militarized, developing a martial religious-political identity by the later 17th/early 18th century.',
    },
    {
      loId: 'apworld.empires-belief-systems',
      kind: 'framework',
      title: 'monumental architecture as religious-political legitimacy',
      content:
        "Shah Jahan's Taj Mahal (1632-53) fused Quranic paradise-garden symbolism with an overt statement of imperial wealth and command of labor/resources. The Ottoman Süleymaniye Mosque (Istanbul, completed 1557, architect Mimar Sinan) served a parallel function for Suleiman the Magnificent. Even outside an Islamic context, rulers pursued comparable 'Versailles-class' architectural display — a technique of monarchical legitimation cutting across religious traditions.",
    },
    {
      loId: 'apworld.empires-belief-systems',
      kind: 'event',
      title: "the Kangxi Emperor's Confucian orthodoxy",
      content:
        'In Qing China, the Kangxi Emperor (r. 1661-1722) promoted Confucian moral orthodoxy — filial piety and social hierarchy chief among its values — as a tool of political legitimacy and social control, issuing a set of moral maxims meant to be read aloud to ordinary subjects. This was a non-monumental, textual/didactic route to the same underlying goal other rulers pursued through architecture.',
    },
    {
      loId: 'apworld.empires-belief-systems',
      kind: 'framework',
      title: 'belief systems as division and instrument, together',
      content:
        'Land-based empires used belief systems both as sources of internal division (the Ottoman-Safavid Sunni-Shia rivalry) and as instruments of rule (millets, sulh-i-kul, jizya, Confucian moral edicts, monumental religious architecture) — producing real but BOUNDED tolerance: institutionalized pluralism that never became full legal or political equality, and that a single ruler\'s decision could reverse.',
    },
    {
      loId: 'apworld.empires-belief-systems',
      kind: 'trap',
      title: 'tolerance existed pre-modern, but was bounded',
      content:
        'Do not treat religious tolerance as a purely modern invention — the Ottoman millet system and Akbar\'s sulh-i-kul institutionalized real pluralism centuries earlier. But also do not treat that pluralism as equivalent to modern legal equality: millet communities held subordinate legal status and paid the jizya, and Akbar\'s policy was reversed by Aurangzeb within a few generations.',
    },
  ],
  methods: [
    {
      title: 'Analyze a monumental-architecture document for religious/political legitimacy',
      when_to_use:
        'Use this on any described-visual document (a monument, mosque, or palace) presented as evidence of how a ruler used religious display to assert legitimacy.',
      steps: [
        'Identify the RELIGIOUS symbolism/imagery the structure uses (e.g. Quranic paradise-garden layout, calligraphy of scripture).',
        'Identify the POLITICAL statement made by scale, cost, or labor invested — what only a powerful ruler could command.',
        'Connect to a comparable case from another empire or later period (e.g. the Ottoman Süleymaniye Mosque, or later "Versailles-class" display).',
        "Note what the choice of imagery reveals about the ruler's own religious/political stance (e.g. explicitly Sunni Islamic display vs. a predecessor's more pluralistic policy).",
      ],
      example: {
        problem: 'What does the Taj Mahal reveal about Shah Jahan\'s legitimacy strategy?',
        solution:
          "Religious: the charbagh paradise-garden layout, drawn from Quranic imagery, stages the tomb as a gateway to Paradise. Political: a workforce of over 20,000 laboring more than two decades at an estimated cost near 32 million rupees is itself a display of imperial wealth and command of labor. Comparable case: the Ottoman Süleymaniye Mosque served a parallel dual function for Suleiman. Ruler's stance: an explicitly Sunni Islamic statement, narrower than Akbar's earlier sulh-i-kul pluralism.",
      },
      relatedLoIds: ['apworld.empires-belief-systems'],
    },
  ],
  pointers: [
    { content: 'Keep Akbar\'s sulh-i-kul (tolerance, jizya abolished) and Aurangzeb\'s reversal (jizya reimposed 1679) as a matched pair on FRQs — the same dynasty, opposite policies, a few generations apart.', kind: 'frq-vocab' },
    { content: 'The millet system was real pluralism, but subordinate, not equal, status — non-Muslim communities self-governed internally but still paid the jizya and held a legally lesser position.', kind: 'tip' },
    { content: "Sikhism's story has TWO phases: a peaceful devotional founding under Guru Nanak, then militarization under later Mughal persecution — don't describe it as martial from the start.", kind: 'tip' },
    { content: 'The Kangxi Sacred Edict text itself is not quoted in this baseline (reserved for MCQs) — describe Confucian moral orthodoxy as a legitimacy tool in your own words, without claiming to quote Kangxi\'s own 1670 wording.', kind: 'edge-case' },
    { content: 'Never present "religious tolerance is a modern invention" as true — but also never present millet/sulh-i-kul pluralism as equivalent to full legal equality. Both halves are testable.', kind: 'trap' },
    { content: 'Taj Mahal (Mughal) and Süleymaniye Mosque (Ottoman) are a ready-made cross-empire comparison for monumental religious-political architecture on an FRQ.', kind: 'tip' },
  ],
};
