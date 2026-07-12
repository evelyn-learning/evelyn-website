/**
 * AP World History — Unit 1 CED 1.3: Developments in South and Southeast
 * Asia.
 *
 * Hand-authored baseline mirroring the lesson plan
 * `evelyn.ap.apworld.south-southeast-asia.v1`. Covers the Delhi
 * Sultanate's rule over a Hindu-majority population, Hindu/Buddhist
 * successor and neighboring states (Vijayanagara, Srivijaya, Majapahit,
 * the Khmer Empire, Sinhala kingdoms), and merchant/Sufi-driven Islamic
 * conversion.
 */

import type { TopicNotesBaseline } from '../types';

export const BASELINE_AP_APWORLD_SOUTH_SOUTHEAST_ASIA: TopicNotesBaseline = {
  baselineId: 'evelyn.ap.apworld.south-southeast-asia.v1',
  course: 'AP World History',
  cedUnit: 1,
  cedTopic: '1.3',
  cedTitle: 'Developments in South and Southeast Asia',
  planId: 'evelyn.ap.apworld.south-southeast-asia.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-12',
  sources: [{ type: 'plan', planId: 'evelyn.ap.apworld.south-southeast-asia.v1' }],
  theory: [
    {
      loId: 'apworld.south-southeast-asia',
      kind: 'definition',
      title: 'Delhi Sultanate',
      content:
        'A series of Turkic and Afghan Muslim dynasties (1206-1526) ruling much of North India from Delhi over a population that remained majority Hindu — extending the Dar al-Islam\'s political reach into South Asia without converting that population by force.',
    },
    {
      loId: 'apworld.south-southeast-asia',
      kind: 'definition',
      title: 'Vijayanagara Empire',
      content:
        'A powerful, independent Hindu empire in South India, founded in 1336 partly in response to Delhi Sultanate expansion, that patronized Hindu temple building and Sanskrit/Telugu/Kannada literary culture for centuries.',
    },
    {
      loId: 'apworld.south-southeast-asia',
      kind: 'definition',
      title: 'Angkor Wat',
      content:
        'The monumental temple complex of the Khmer Empire (Cambodia), built in the early 12th century originally as a Hindu temple dedicated to Vishnu before later adaptation for Buddhist worship — physical evidence of the region\'s Hindu-to-Buddhist religious layering.',
    },
    {
      loId: 'apworld.south-southeast-asia',
      kind: 'event',
      title: 'Sultan Muhammad ibn Tughluq (r. 1325-1351)',
      content:
        'Ruled Delhi during Ibn Battuta\'s service there. Contemporary and later accounts describe him as capable of both extraordinary generosity and extreme severity — a ruler who governed through both patronage and fear.',
    },
    {
      loId: 'apworld.south-southeast-asia',
      kind: 'event',
      title: 'Chola legacy and Indian Ocean links',
      content:
        'The Hindu Chola Empire of South India (9th-13th century) built a powerful navy and extensive maritime/commercial links across the Indian Ocean into Southeast Asia. This legacy of South Indian seaborne power (Hindu temple architecture, Tamil merchant guilds) outlasted the Cholas and tied South India into the wider Indian Ocean network (see `apworld.indian-ocean-trade`).',
    },
    {
      loId: 'apworld.south-southeast-asia',
      kind: 'event',
      title: 'Southeast Asian maritime states',
      content:
        'Srivijaya (a Buddhist maritime empire, Sumatra, dominant earlier but declining by this period), Majapahit (a Hindu-Buddhist empire, Java, at its height in the 14th century), and the Khmer Empire (Angkor) were all deeply tied to Indian Ocean maritime trade, alongside Sri Lanka\'s Buddhist Sinhala kingdoms.',
    },
    {
      loId: 'apworld.south-southeast-asia',
      kind: 'event',
      title: 'Ibn Battuta at the Delhi court',
      content:
        'Ibn Battuta describes his own investiture: given "a dress of honour, and a horse furnished with an ornamented saddle," money, and a salary "drawn from the treasury" — evidence of an organized bureaucratic Muslim state recruiting foreign-born scholars. He separately calls the Sultan "one of the most bountiful and splendidly munificent men... but in other cases, one of the most impetuous and inexorable."',
    },
    {
      loId: 'apworld.south-southeast-asia',
      kind: 'cause',
      title: 'Islam spread via merchants and Sufis, not conquest',
      content:
        'Islam\'s religious spread in South and Southeast Asia was overwhelmingly the work of merchants and Sufi teachers operating through Indian Ocean trade contacts and gradual, often syncretic conversion — not primarily military conquest, even where a Muslim political state (the Delhi Sultanate) did rule by force over a Hindu majority.',
    },
    {
      loId: 'apworld.south-southeast-asia',
      kind: 'trap',
      title: 'keep three Ibn Battuta dates straight',
      content:
        'Ibn Battuta served at Delhi in the 1330s; his account (the Rihla) was completed via dictation c. 1355 — decades later; it reaches us via Samuel Lee\'s 1829 English translation. Do not conflate the visit, the document, and the translation dates.',
    },
    {
      loId: 'apworld.south-southeast-asia',
      kind: 'trap',
      title: 'political conquest vs. religious conversion',
      content:
        'The Delhi Sultanate DID establish Muslim political rule by conquest — that part is real. But conquest explains political control, not religious conversion: the Sultanate ruled a population that stayed majority Hindu, and broader regional conversion came chiefly through merchants and Sufis, not the sword.',
    },
    {
      loId: 'apworld.south-southeast-asia',
      kind: 'framework',
      title: 'religious layering across South and Southeast Asia',
      content:
        'The region shows a politics dominated by indigenous (Hindu/Buddhist) states — Vijayanagara, Srivijaya, Majapahit, the Khmer, the Sinhala kingdoms — running alongside a Muslim political state (Delhi) ruling a Hindu majority, while Islam\'s actual religious spread came chiefly through peaceful merchant/Sufi contact riding the Indian Ocean network.',
    },
  ],
  methods: [
    {
      title: 'Source and analyze a Delhi-court document (HIPP), with date discipline',
      when_to_use:
        'Use this on any Ibn Battuta or similar traveler excerpt describing the Delhi Sultanate, before making any claim about what the text shows.',
      steps: [
        'H — HISTORICAL CONTEXT: keep the visit date, the document\'s completion date, and the translation date separate (for Ibn Battuta: 1330s visit, c. 1355 Rihla, 1829 Lee translation).',
        'I — INTENDED AUDIENCE / P — PURPOSE: who is the account for, and what does the writer want it to do?',
        "P — POINT OF VIEW: does the writer have a personal stake (e.g. Ibn Battuta personally received the gifts he describes)?",
        'CONNECT TO THE STATE-AS-INSTITUTION CAUSE: does the detail show organized bureaucratic capacity (ceremony, treasury, salaries)?',
        'CONNECT TO THE RULER\'S-CHARACTER DETAIL: does the account balance generosity against severity, and is that corroborated elsewhere?',
      ],
      example: {
        problem: 'Ibn Battuta describes being given robes, a horse, and a treasury salary upon appointment at Delhi. What does this show, and what should a careful reader note?',
        solution:
          'It shows the Delhi Sultanate functioning as an organized Muslim bureaucratic state capable of formally inducting a foreign scholar into its administration. A careful reader should note Ibn Battuta personally benefited from this generosity, which may color his praise, and should keep the 1330s visit, the c. 1355 Rihla, and the 1829 Lee translation dates distinct.',
      },
      relatedLoIds: ['apworld.south-southeast-asia'],
    },
  ],
  pointers: [
    { content: 'Ibn Battuta visited/served at Delhi in the 1330s, dictated the Rihla c. 1355, translated by Samuel Lee in 1829 — three distinct dates, never collapse them.', kind: 'trap' },
    { content: 'The Delhi Sultanate ruling by conquest is a POLITICAL fact; it does not mean Islam spread religiously by conquest — merchants and Sufis drove most conversion in the region.', kind: 'trap' },
    { content: 'Angkor Wat was built as a HINDU temple (early 12th c.) before later Buddhist adaptation — a concrete example of the region\'s religious layering, good for an FRQ.', kind: 'frq-vocab' },
    { content: 'Vijayanagara (founded 1336) is a Hindu state that rose partly IN RESPONSE to Delhi Sultanate expansion — useful for a "state responses to Muslim rule" prompt.', kind: 'tip' },
    { content: 'The Chola Empire\'s Indian Ocean maritime legacy (9th-13th c.) is the historical bridge tying this topic\'s prerequisite, `apworld.indian-ocean-trade`, into South Asia.', kind: 'tip' },
  ],
};
