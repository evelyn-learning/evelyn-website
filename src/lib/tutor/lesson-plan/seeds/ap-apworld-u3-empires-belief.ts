/**
 * AP World History: Modern — CED Unit 3.3-3.4: Empires: Belief Systems /
 * Comparison in Land-Based Empires.
 *
 * Unit-3 fan-out content plan, following the Unit-2 calibration template
 * (`ap-apworld-u2-silk-roads.ts`). concept = the historical argument (how
 * did land-based empires use belief systems both as sources of internal
 * rivalry and as instruments of rule — millets, sulh-i-kul, jizya,
 * Confucian moral orthodoxy, and monumental religious architecture —
 * producing real but bounded religious pluralism, 1450-1750?).
 *
 * Passage: concept anchor is the Taj Mahal described-visual —
 * evelyn.passage.apworld-taj-mahal.v1 — Shah Jahan's mausoleum (1632-53)
 * as a monumental statement of Mughal religious and political
 * legitimacy.
 *
 * NOTE: the Kangxi Sacred Edict passage (evelyn.passage.apworld-kangxi-
 * edict.v1) is reserved for the MCQ bank per the Unit-3 block and is
 * NOT quoted here; the Kangxi Emperor's use of Confucian moral orthodoxy
 * is described in this plan's own words only, with no quoted excerpt.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U3_EMPIRES_BELIEF_SYSTEMS: LessonPlan = {
  id: 'evelyn.ap.apworld.empires-belief-systems.v1',
  title: 'U3.3 Empires: Belief Systems',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.empires-belief-systems',
      description:
        'Explain how land-based empires used belief systems — including the Ottoman-Safavid Sunni-Shia rivalry, the Ottoman millet system, Mughal policies ranging from Akbar\'s sulh-i-kul to Aurangzeb\'s reimposition of the jizya, the emergence of Sikhism, and monumental religious architecture — both as sources of internal division and as instruments of rule, 1450-1750.',
      standard: 'AP-APWORLD-3.3',
    },
  ],
  prerequisites: ['apworld.empires-administration', 'apworld.dar-al-islam'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the point that religious tolerance in these empires was real but bounded, institutionalized rather than modern, and reversible by a single ruler.',
      script:
        "It's tempting to think of religious tolerance as a modern invention — something 18th-century Enlightenment thinkers or 20th-century constitutions came up with. But two centuries earlier, the Ottoman Empire was running a formal system that let Orthodox Christians, Jews, and Armenian Christians govern their own communities' internal affairs, and the Mughal emperor Akbar had abolished a tax on non-Muslims and appointed Hindus to his highest ranks of government. This was real, institutionalized pluralism — centuries before anyone used that word. But it was also bounded: it never meant full legal equality, and it could be undone in a single reign. Akbar's own great-grandson reversed almost all of it. This topic is about seeing both halves: real tolerance, real limits.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-empires-belief-systems',
      kind: 'concept',
      goal: 'Explain how the Ottoman-Safavid Sunni-Shia rivalry, the Ottoman millet system, Akbar\'s sulh-i-kul and Aurangzeb\'s reversal, the emergence of Sikhism, and monumental religious architecture together shaped how land-based empires used belief systems to divide and to rule, 1450-1750.',
      keyIdeas: [
        'THE OTTOMAN-SAFAVID SUNNI-SHIA RIVALRY: the Ottoman Empire was officially Sunni; the Safavid Empire, founded by Shah Ismail I in 1501, imposed TWELVER SHIISM as the state religion of Persia — a deliberate, top-down religious transformation that defined Safavid identity and sharpened recurring conflict with the Sunni Ottomans, often framed partly in sectarian terms.',
        "THE OTTOMAN MILLET SYSTEM governed large non-Muslim populations (Orthodox Christians, Jews, Armenian Christians) as semi-autonomous religious communities, each managing its own internal legal, educational, and religious affairs under its own religious leaders, in exchange for loyalty and the non-Muslim jizya tax. This institutionalized real religious pluralism — but as a legally SUBORDINATE status to Muslims, not full equality.",
        "AKBAR'S SULH-I-KUL: the Mughal emperor Akbar (r. 1556-1605) pursued sulh-i-kul (\"universal peace/tolerance\"), abolishing the jizya tax on non-Muslims, appointing Hindus to the highest ranks of Mughal administration (as mansabdars), and sponsoring interfaith religious discussions; he even floated Din-i Ilahi, a syncretic court philosophy blending elements of multiple faiths, though it never became a mass religion.",
        "AURANGZEB'S REVERSAL: Akbar's great-grandson Aurangzeb reversed this trajectory, REIMPOSING the jizya tax on non-Muslims in 1679 and pursuing more orthodox Sunni religious policies — a stark reminder that \"the\" Mughal approach to religious pluralism was not fixed, but swung across the dynasty depending on the ruler.",
        "SIKHISM'S EMERGENCE: founded by Guru Nanak in the Punjab region around the turn of the 16th century as a distinct monotheistic faith drawing on and departing from Hindu and Muslim traditions, Sikhism began as a peaceful devotional movement. Facing later Mughal persecution — including the execution of Sikh Gurus — the Sikh community increasingly militarized to defend itself, developing a martial religious-political identity by the later 17th and early 18th centuries.",
        "MONUMENTAL ARCHITECTURE AS RELIGIOUS-POLITICAL LEGITIMACY: rulers across these empires used monumental religious and commemorative architecture to display piety, wealth, and divine favor together. Shah Jahan's TAJ MAHAL (1632-53) fused Quranic paradise-garden symbolism with an overt statement of imperial wealth and command of labor and resources. The Ottoman SÜLEYMANIYE MOSQUE (Istanbul, completed 1557, architect Mimar Sinan) similarly proclaimed Suleiman's piety and imperial grandeur through a monumental imperial mosque complex. Even outside an Islamic context, rulers pursued comparable 'Versailles-class' architectural display — as Louis XIV would later do at Versailles — grand palace and court building as a technique of monarchical legitimation that cut across religious traditions.",
        "THE KANGXI EMPEROR'S CONFUCIAN ORTHODOXY: in Qing China, the Kangxi Emperor (r. 1661-1722) promoted Confucian moral orthodoxy — filial piety and social hierarchy chief among its values — as a tool of political legitimacy and social control, issuing a set of moral maxims (the Sacred Edict) meant to be read aloud to ordinary subjects. This was a different, non-monumental and textual/didactic route to the same underlying goal other rulers pursued through architecture: using a belief system to secure political loyalty and social order.",
        'THE COMBINED EFFECT: land-based empires used belief systems both as sources of internal division (the Ottoman-Safavid Sunni-Shia rivalry) and as instruments of rule (millets, sulh-i-kul, jizya, Confucian moral edicts, monumental religious architecture) — producing real but BOUNDED tolerance. Pluralism was institutionalized (millets, sulh-i-kul) without ever becoming full legal or political equality, and it could be reversed by a single ruler\'s decision, as Aurangzeb\'s reimposition of the jizya showed.',
      ],
      vocabulary: [
        {
          term: 'millet system',
          definition:
            "the Ottoman practice of governing non-Muslim religious communities (Orthodox Christian, Jewish, Armenian Christian) as semi-autonomous bodies managing their own internal legal and religious affairs, in exchange for loyalty and the jizya tax — real pluralism, but with legally subordinate status.",
        },
        {
          term: 'sulh-i-kul',
          definition:
            '("universal peace/tolerance") Akbar\'s Mughal policy of religious pluralism, including abolishing the jizya on non-Muslims and appointing Hindus to high administrative rank.',
        },
        {
          term: 'jizya',
          definition:
            'a tax historically levied on non-Muslim subjects in Muslim-ruled states; Akbar abolished it as part of sulh-i-kul, and Aurangzeb reimposed it in 1679.',
        },
        {
          term: 'Sikhism',
          definition:
            "a monotheistic faith founded by Guru Nanak in the Punjab around the turn of the 16th century, beginning as a peaceful devotional movement before militarizing in response to later Mughal persecution.",
        },
      ],
      passageId: 'evelyn.passage.apworld-taj-mahal.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-taj-mahal-legitimacy',
      kind: 'worked_example',
      problem:
        'Analyze this description of the Taj Mahal (1632-1653), the mausoleum complex Shah Jahan built at Agra for his wife Mumtaz Mahal: "A raised octagonal tomb chamber sits at the center of a symmetrical charbagh, a four-quadrant \'paradise garden\' divided by long reflecting channels — a layout drawn from Quranic descriptions of paradise, so that the building and its grounds together stage the tomb as a gateway to Paradise." The description also notes that "a workforce estimated at more than 20,000 masons, marble-workers, mosaicists, and calligraphers labored for over two decades, at a contemporary cost estimated near 32 million rupees." What does the Taj Mahal\'s design and construction reveal about how Shah Jahan used monumental architecture to assert religious and political legitimacy?',
      steps: [
        "SOURCE IT FIRST. The Taj Mahal was commissioned by the Mughal emperor Shah Jahan (r. 1628-1658) as a mausoleum for his wife Mumtaz Mahal, who died in 1631; construction ran 1632-1653.",
        'IDENTIFY THE RELIGIOUS-LEGITIMACY CLAIM. The charbagh (four-quadrant paradise garden) layout is drawn directly from Quranic descriptions of paradise, staging the tomb itself as a literal gateway to Paradise — a design choice that frames Shah Jahan\'s dynastic mourning in explicitly Islamic religious terms, tying his family\'s legitimacy to Quranic imagery available to any Muslim visitor who recognized it.',
        'IDENTIFY THE POLITICAL-LEGITIMACY CLAIM. The sheer scale — "more than 20,000 masons, marble-workers, mosaicists, and calligraphers" laboring "over two decades" at "a contemporary cost estimated near 32 million rupees" — is itself a political statement: only a ruler commanding immense wealth and labor across a vast empire could produce a monument at this scale, converting a private family loss into a permanent, empire-wide advertisement of Mughal power.',
        'CONNECT TO A COMPARABLE CASE. The Ottoman Süleymaniye Mosque (Istanbul, completed 1557) served a parallel function for Suleiman the Magnificent — proclaiming piety and imperial grandeur together through monumental religious architecture — showing this was a shared technique across land-based Muslim empires, later echoed in non-Islamic contexts by "Versailles-class" royal architectural display.',
        "CONTRAST WITH THE UNIT'S PLURALISM THEME. The Taj Mahal asserts legitimacy specifically through SUNNI Islamic imagery and patronage under Shah Jahan — a narrower, more explicitly religious statement than his grandfather Akbar's sulh-i-kul, and a preview of the further narrowing under Aurangzeb's reimposition of the jizya. It's a reminder that legitimation strategies could tilt toward one faith's display even in an empire ruling a religiously diverse population.",
        'STATE THE LINK TO THE COURSE THESIS. The Taj Mahal shows a Mughal emperor using monumental religious architecture to fuse religious and political legitimacy into a single, permanent statement — a technique paralleled by the Ottoman Süleymaniye and by later non-Islamic rulers\' own grand architectural display.',
      ],
      answer:
        "The Taj Mahal's charbagh layout — drawn from Quranic descriptions of paradise, staging the tomb as \"a gateway to Paradise\" — frames Shah Jahan's dynastic mourning in explicitly Islamic religious terms, while its scale (a workforce of over 20,000 laboring more than two decades, at an estimated cost near 32 million rupees) is itself a political statement: only an emperor commanding immense wealth and labor across a vast realm could build at this scale, converting private grief into an empire-wide advertisement of Mughal power. This dual religious-political function parallels the Ottoman Süleymaniye Mosque, built for Suleiman the Magnificent, and anticipates later non-Islamic rulers' own 'Versailles-class' architectural display of monarchical legitimacy. It also marks a narrower, more explicitly Sunni Islamic statement of legitimacy than Akbar's earlier sulh-i-kul pluralism — a shift that would continue under Aurangzeb's reimposition of the jizya.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Identify ONE example of institutionalized religious pluralism in a land-based empire, 1450-1750. (b) Explain how ONE ruler narrowed or reversed a policy of religious tolerance during this period. (c) Explain ONE way a belief system other than the empire's dominant state religion shaped politics or society in a land-based empire during this period.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine example of institutionalized religious pluralism — e.g. the Ottoman millet system or Akbar\'s sulh-i-kul (including abolition of the jizya and appointment of Hindus to high rank). No credit for a vague statement with no identifiable specific policy, or an anachronistic/incorrect one.',
            modelResponse:
              "One example of institutionalized religious pluralism was the Ottoman millet system, which let Orthodox Christian, Jewish, and Armenian Christian communities manage their own internal legal and religious affairs.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate way ONE ruler narrowed or reversed a tolerance policy — e.g. Aurangzeb's reimposition of the jizya in 1679, reversing Akbar's sulh-i-kul. No credit for a vague or disconnected claim.",
            modelResponse:
              "Aurangzeb reversed his grandfather Akbar's policy of sulh-i-kul by reimposing the jizya tax on non-Muslims in 1679 and pursuing more orthodox Sunni religious policies, showing that Mughal tolerance was not fixed across the dynasty.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, historically accurate way a non-dominant belief system shaped politics or society — e.g. Sikhism's emergence and later militarization in response to Mughal persecution, or Shia Islam's role in Safavid state identity and rivalry with the Sunni Ottomans. No credit for a vague or unsupported claim.",
            modelResponse:
              "Sikhism, founded by Guru Nanak in the Punjab, began as a peaceful devotional movement but militarized in response to later Mughal persecution, including the execution of Sikh Gurus, developing into a martial religious-political community by the early 18th century.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-tolerance-modern-invention',
      kind: 'misconception_check',
      question:
        'True or false: religious tolerance in the modern sense of institutionalized coexistence among different faiths within one state did not exist before the modern era — pre-modern land-based empires simply forced religious conformity on the populations they conquered.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Treating religious tolerance as a purely modern invention — missing that empires like the Ottomans and Mughals institutionalized real, if bounded, religious pluralism centuries before the modern era, while also assuming (incorrectly) that this institutionalized tolerance meant full legal equality.",
          correctsTo:
            "FALSE, but with an important qualification. Religious pluralism was genuinely institutionalized well before the modern era: the Ottoman millet system let non-Muslim communities govern their own internal affairs, and Akbar abolished the jizya and appointed Hindus to the highest ranks of Mughal government under his policy of sulh-i-kul. This was real, structured tolerance, not mere accident. But it was also BOUNDED, not equivalent to modern legal equality: millet communities held a legally subordinate status to Muslims and paid the jizya; Akbar's sulh-i-kul was reversed within a few generations when Aurangzeb reimposed the jizya in 1679. On the AP exam, hold both halves together — real, institutionalized pluralism existed centuries before the modern era, AND it remained bounded and reversible by a single ruler's decision.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Safavid Empire (founded 1501, Shah Ismail I) imposed Twelver Shiism as state religion, sharpening rivalry with the Sunni Ottomans.',
        "The Ottoman millet system let Orthodox Christian, Jewish, and Armenian Christian communities govern their own internal affairs, in exchange for loyalty and the jizya — real pluralism, but legally subordinate to Muslims.",
        "Akbar (r. 1556-1605) pursued sulh-i-kul: abolishing the jizya, appointing Hindus to high Mughal rank, and floating the syncretic Din-i Ilahi. Aurangzeb reversed this by reimposing the jizya in 1679.",
        "Sikhism, founded by Guru Nanak, began as a peaceful devotional movement and militarized later in response to Mughal persecution.",
        "The Taj Mahal (1632-53) and the Ottoman Süleymaniye Mosque (1557) both fused religious legitimacy with a political display of imperial wealth and power — a technique later echoed by non-Islamic rulers' own grand architectural display.",
        "Religious tolerance in these empires was real and institutionalized (millets, sulh-i-kul) but BOUNDED — never full legal equality, and reversible by a single ruler's decision.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '3',
    cedTopic: '3.3-3.4',
    cedTitle: 'Empires: Belief Systems',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-taj-mahal.v1',
        chapter: '1632-1653',
        note: "The Taj Mahal (described visual) — anchor document for monumental architecture as fused religious/political Mughal legitimacy.",
      },
    ],
  },
};
