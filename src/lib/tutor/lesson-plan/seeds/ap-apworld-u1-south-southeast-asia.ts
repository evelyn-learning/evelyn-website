/**
 * AP World History: Modern — CED Unit 1.3: Developments in South and
 * Southeast Asia.
 *
 * Unit-1 fan-out content plan, following the Unit-2 calibration template
 * (`ap-apworld-u2-silk-roads.ts`). concept = the historical argument (how
 * did the Delhi Sultanate's rule over a Hindu-majority population, Hindu
 * and Buddhist successor states, and merchant/Sufi contact together shape
 * South and Southeast Asia, 1200-1450?); worked_example = annotated
 * document analysis; try_yourself = a 3-point SAQ-style short-answer.
 *
 * Anchor text: Ibn Battuta, The Travels of Ibn Batuta (Samuel Lee 1829
 * trans.), on his reception and appointment as qadi at the Delhi court of
 * Sultan Muhammad ibn Tughluq — evelyn.passage.apworld-ibn-battuta-delhi.v1.
 * DATE DISCIPLINE: Ibn Battuta served at Delhi in the 1330s; his account
 * (the Rihla) was completed via dictation c. 1355 — decades later — and
 * reaches us here through Samuel Lee's 1829 English translation. Keep the
 * visit, the document, and the translation dates distinct.
 *
 * Prerequisite wiring: `apworld.indian-ocean-trade` (U2) is wired as a
 * prerequisite per the Unit-1 block, since Chola/Vijayanagara maritime and
 * commercial links tie directly into that existing Unit-2 LO.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U1_SOUTH_SOUTHEAST_ASIA: LessonPlan = {
  id: 'evelyn.ap.apworld.south-southeast-asia.v1',
  title: 'U1.3 Developments in South and Southeast Asia',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.south-southeast-asia',
      description:
        'Explain how the Delhi Sultanate\'s rule over a Hindu-majority population, Hindu and Buddhist successor states, and merchant/Sufi contact along Indian Ocean trade routes shaped South and Southeast Asia in the period 1200-1450.',
      standard: 'AP-APWORLD-1.3',
    },
  ],
  prerequisites: ['apworld.dar-al-islam', 'apworld.indian-ocean-trade'],
  followUps: ['apworld.americas-africa-states'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the point that South and Southeast Asia in this period were religiously layered, not uniformly converted — a Muslim ruling dynasty over a Hindu-majority population, alongside independent Hindu and Buddhist states.',
      script:
        "Picture a Moroccan Muslim scholar walking into the throne room of a sultan in Delhi in the 1330s, being handed a robe of honor, a horse, and a government salary — all from a Turkic Muslim dynasty ruling over a population that remained overwhelmingly Hindu. That's the Delhi Sultanate: a genuine Muslim state, extending the Dar al-Islam's political reach into South Asia by conquest, but ruling a religious majority it never converted by force. Meanwhile, a few hundred miles to the south, an independent Hindu empire (Vijayanagara) was rising as a rival power, and across the sea in Southeast Asia, Hindu and Buddhist kingdoms — some built on temple complexes as spectacular as Angkor Wat — kept their own political and religious traditions running, connected to the wider world not by conquest but by trade winds and merchant contact.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-south-southeast-asia',
      kind: 'concept',
      goal: 'Explain how the Delhi Sultanate, Hindu and Buddhist successor states, and merchant/Sufi contact shaped South and Southeast Asia, 1200-1450.',
      keyIdeas: [
        'THE DELHI SULTANATE (established 1206, lasting to 1526) was a series of Turkic and Afghan Muslim dynasties ruling much of North India from Delhi — extending the same pattern seen across the Dar al-Islam: a Muslim political and military elite governing a population that remained majority Hindu.',
        'SULTAN MUHAMMAD IBN TUGHLUQ (r. 1325-1351) ruled Delhi during Ibn Battuta\'s service there. Contemporary and later accounts, including Ibn Battuta\'s own, describe him as capable of both extraordinary generosity and extreme severity — a combination later chroniclers used to characterize his reign as unpredictable, ruling through both patronage and fear.',
        "CHOLA LEGACY AND INDIAN OCEAN LINKS: before the Delhi Sultanate's rise, the Hindu Chola Empire of South India (9th-13th century) had built a powerful navy and extensive maritime and commercial links across the Indian Ocean into Southeast Asia. This legacy of South Indian seaborne power and cultural influence (Hindu temple architecture, Tamil merchant guilds) outlasted the Cholas themselves and tied South India economically into the wider Indian Ocean network.",
        'THE VIJAYANAGARA EMPIRE (founded 1336) arose in South India as a powerful, independent Hindu state — in part a political response to Delhi Sultanate expansion and the earlier decline of regional Hindu polities. It endured for centuries as a major Hindu political and cultural power in the Deccan, patronizing Hindu temple building and Sanskrit, Telugu, and Kannada literary culture.',
        "SOUTHEAST ASIA had its own major states straddling Hindu and Buddhist traditions, deeply tied to Indian Ocean maritime trade: SRIVIJAYA (a Buddhist maritime empire based in Sumatra, dominant earlier but declining by this period), MAJAPAHIT (a Hindu-Buddhist empire based in Java, at its height in the 14th century), and the KHMER EMPIRE (based at Angkor, in modern Cambodia). The Khmer's monumental temple complex ANGKOR WAT was built in the early 12th century originally as a Hindu temple dedicated to Vishnu before later being adapted for Buddhist worship — physical evidence of the religious layering (Hindu-to-Buddhist transition) characteristic of the region.",
        'SINHALA KINGDOMS on the island of Sri Lanka (predominantly Buddhist) maintained their own political and religious traditions across this period — another node connected to Indian Ocean trade and South Asian cultural influence without falling under Delhi Sultanate control.',
        "ISLAM'S SPREAD in South and Southeast Asia was overwhelmingly the work of MERCHANTS AND SUFI teachers operating through Indian Ocean trade contacts and gradual, often syncretic conversion — not primarily military conquest, even where a Muslim political state like the Delhi Sultanate did rule by force over a Hindu majority. Sufi orders built devotional practices and local networks that blended with, rather than violently displaced, existing religious life in coastal and inland Southeast Asia.",
        'THE COMBINED EFFECT: the Delhi Sultanate\'s military and political rule over a Hindu-majority North India, the Hindu Vijayanagara Empire\'s rise as a rival power, the Hindu-Buddhist maritime states of Southeast Asia (Majapahit, the Khmer), and the Buddhist Sinhala kingdoms together show a region whose POLITICS remained overwhelmingly organized around indigenous states — while Islam\'s real RELIGIOUS spread there came chiefly through peaceful merchant and Sufi contact riding the Indian Ocean network, not the sword.',
      ],
      vocabulary: [
        {
          term: 'Delhi Sultanate',
          definition:
            'a series of Turkic and Afghan Muslim dynasties (1206-1526) ruling much of North India from Delhi over a population that remained majority Hindu.',
        },
        {
          term: 'Vijayanagara Empire',
          definition:
            'a powerful, independent Hindu empire in South India, founded in 1336, that patronized Hindu temple building and Sanskrit/Telugu/Kannada literary culture for centuries.',
        },
        {
          term: 'Angkor Wat',
          definition:
            'the monumental temple complex of the Khmer Empire (Cambodia), built in the early 12th century originally as a Hindu temple dedicated to Vishnu before later adaptation for Buddhist worship.',
        },
        {
          term: 'Majapahit',
          definition:
            'a Hindu-Buddhist maritime empire based in Java, at its height in the 14th century, tied into Indian Ocean and Southeast Asian trade networks.',
        },
      ],
      passageId: 'evelyn.passage.apworld-ibn-battuta-delhi.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-ibn-battuta-delhi',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Ibn Battuta\'s account of his reception at the Delhi court of Sultan Muhammad ibn Tughluq: "On the third day after our arrival, each of the travellers presented himself at the gate of the palace; when the Emperor sent to inquire, whether there were any among us who wished to take office, either as a writer, a judge, or a magistrate; saying, that he would give such appointments. Each, of course, gave an answer suitable to his wishes. For my own part, I answered, I have no desire either for rule or writership; but the office both of judge and of magistrate, myself and my fathers have filled. These replies were carried to the Emperor, who commanded each person to be brought before him, and he then gave him such appointment as would suit him; bestowing on him, at the same time, a dress of honour, and a horse furnished with an ornamented saddle. He also gave him money, appointing likewise the amount of his salary, which was to be drawn from the treasury. … This Emperor was one of the most bountiful and splendidly munificent men (where he took); but in other cases, one of the most impetuous and inexorable: and very seldom indeed did it happen, that pardon followed his anger." What does this passage reveal about the Delhi Sultanate as a state, and what should a careful reader keep in mind about the source and its dates?',
      steps: [
        "SOURCE IT FIRST — AND KEEP THE DATES STRAIGHT. Ibn Battuta, a Moroccan Muslim legal scholar, arrived in Delhi and served for several years as qadi (judge) under Sultan Muhammad ibn Tughluq in the 1330s. His account of these experiences was completed as the Rihla around 1355 — decades after the events described — and reaches us here via Samuel Lee's 1829 English translation. Three distinct dates: the visit (1330s), the document (c. 1355), the translation (1829).",
        'IDENTIFY THE CLAIM. Ibn Battuta describes his own investiture ceremony — offered a post, then given "a dress of honour, and a horse furnished with an ornamented saddle," money, and a salary "drawn from the treasury" — and separately characterizes the Sultan overall as capable of being "one of the most bountiful and splendidly munificent men" yet also "one of the most impetuous and inexorable," with pardon rarely following his anger.',
        "CONNECT TO THE DELHI-SULTANATE-AS-STATE CAUSE. The ceremonial ritual — robes, a mount, a salary drawn from a functioning treasury — is evidence of an organized bureaucratic Muslim state apparatus, able to formally recruit and induct foreign-born scholars like Ibn Battuta into its administration, extending Dar al-Islam institutional and legal culture (qadis, madrasa-trained jurists) into South Asia.",
        "CONNECT TO THE RULER'S-UNPREDICTABILITY DETAIL. The contrast Ibn Battuta draws between the Sultan's generosity and severity is a recurring theme in accounts of Muhammad ibn Tughluq's reign, and matters for understanding a state that ruled a vast, mostly non-Muslim population through both patronage and fear.",
        "WEIGH THE SOURCE'S RELIABILITY. Ibn Battuta writes decades after his own service, as an insider who personally benefited from the Sultan's generosity — the appointment and gifts he describes were given directly to him — so his praise of \"bountiful\" generosity may partly reflect personal gratitude, while his broader characterization of severity is corroborated by other contemporary chroniclers of the reign.",
        'STATE THE LINK TO THE COURSE THESIS. This passage shows the Delhi Sultanate functioning as an organized, wealthy Muslim state administering a Hindu-majority population through both institutional integration (recruiting traveling foreign scholars into its bureaucracy) and stark, personally-administered severity.',
      ],
      answer:
        'Ibn Battuta\'s account of his own investiture — robes, a horse, money, and a treasury-funded salary — shows the Delhi Sultanate functioning as an organized Muslim bureaucratic state, formally recruiting a foreign-born legal scholar into its administration and extending Dar al-Islam institutional culture into South Asia. His characterization of Sultan Muhammad ibn Tughluq as both "bountiful" and "impetuous and inexorable" reveals a ruler who governed a mostly non-Muslim population through a mix of patronage and fear. A careful reader must keep the dates straight — Ibn Battuta served at Delhi in the 1330s, dictated his account around 1355, and it reaches us via Samuel Lee\'s 1829 translation — and should note that Ibn Battuta personally benefited from the Sultan\'s generosity, which may color his praise, even as his account of severity matches other contemporary chroniclers.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE Hindu or Buddhist political power in South or Southeast Asia (other than the Delhi Sultanate) active in the period 1200-1450. (b) Explain how ONE such power maintained itself politically or religiously alongside the spread of Muslim rule or trade in the region. (c) Explain ONE way Islam spread in South or Southeast Asia during this period.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine Hindu or Buddhist political power of the period — e.g. the Vijayanagara Empire, Majapahit, the Khmer Empire, or a Sinhala kingdom. No credit for a vague statement with no identifiable specific polity, or for an anachronistic/incorrect one.',
            modelResponse:
              'One Hindu political power of this period was the Vijayanagara Empire, founded in South India in 1336.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way the named power maintained itself politically or religiously — e.g. as a rival power to the Delhi Sultanate, or through continued temple-building and religious patronage. No credit for an explanation disconnected from the power named in (a).',
            modelResponse:
              'Vijayanagara maintained itself as an independent Hindu power partly in response to Delhi Sultanate expansion, building its own political and military strength in the Deccan while patronizing Hindu temple building and Sanskrit, Telugu, and Kannada literary culture, keeping Hindu political and religious life independent of Muslim rule.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, historically accurate mechanism of Islam\'s spread in the region — e.g. via merchants along Indian Ocean trade routes, or via Sufi teachers and syncretic conversion. No credit for a vague or unsupported claim, or for describing conquest as the PRIMARY mechanism of religious conversion.',
            modelResponse:
              "Islam spread in South and Southeast Asia primarily through Muslim merchants trading along Indian Ocean routes and Sufi teachers whose devotional practices blended with existing local religious life, leading to gradual, largely peaceful conversion rather than conversion by military conquest.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-islam-by-conquest',
      kind: 'misconception_check',
      question:
        'True or false: Islam spread in South and Southeast Asia primarily through military conquest.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Generalizing from the Delhi Sultanate's genuine military conquest of North India to the region's RELIGIOUS conversion as a whole — conflating political conquest by a Muslim ruling class with how ordinary populations actually came to adopt Islam.",
          correctsTo:
            'FALSE. The Delhi Sultanate did establish Muslim political rule over North India by conquest — that part is real. But conquest explains political CONTROL, not religious CONVERSION: the Sultanate ruled over a population that remained overwhelmingly Hindu, and it did not convert that population by force. Across South and Southeast Asia more broadly, Islam\'s actual religious spread came chiefly through MERCHANTS trading along Indian Ocean routes and SUFI teachers whose devotional practices blended with existing local religious life — a gradual, largely peaceful process, especially visible in Southeast Asian port societies that never had a conquering Muslim army at all. On the AP exam, keep political conquest (Delhi Sultanate) and religious conversion (merchants and Sufis) analytically distinct.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Delhi Sultanate (1206-1526) was a Turkic/Afghan Muslim dynasty ruling North India by conquest over a population that remained majority Hindu.',
        'Ibn Battuta served as qadi at Sultan Muhammad ibn Tughluq\'s Delhi court in the 1330s; his account (the Rihla) was completed c. 1355 and reaches us via Samuel Lee\'s 1829 translation — keep those three dates distinct.',
        'The Vijayanagara Empire (founded 1336) and the earlier Chola Empire\'s Indian Ocean maritime legacy show independent Hindu political and commercial power continuing alongside the Delhi Sultanate.',
        'Southeast Asia\'s major states — Srivijaya, Majapahit, the Khmer Empire (Angkor Wat, built as a Hindu temple then adapted for Buddhist worship) — and Sri Lanka\'s Sinhala kingdoms remained independent Hindu/Buddhist polities tied into Indian Ocean trade.',
        "Islam's religious spread in the region came chiefly through merchants and Sufi teachers, not conquest — even where a Muslim state like the Delhi Sultanate ruled by force.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.3',
    cedTitle: 'Developments in South and Southeast Asia',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-ibn-battuta-delhi.v1',
        chapter: 'c. 1355',
        note: 'Ibn Battuta, "The Travels of Ibn Batuta" (Samuel Lee trans.) — anchor document for the Delhi Sultanate as a Muslim state ruling a Hindu-majority population.',
      },
    ],
  },
};
