/**
 * AP World History: Modern — CED Unit 1.2: Developments in Dar al-Islam.
 *
 * Unit-1 fan-out content plan, following the Unit-2 calibration template
 * (`ap-apworld-u2-silk-roads.ts`). concept = the historical argument (how
 * did the Dar al-Islam's political authority fragment into competing
 * successor states after 1200, while ulama/madrasa/Sufi networks kept it
 * culturally and religiously connected, 1200-1450?).
 *
 * UNWIRED per the Unit-1 block: no passage is anchored to this topic. The
 * worked_example is therefore a structured claim-evaluation exercise
 * (identify what's accurate / what's overreach / counterevidence /
 * revised conclusion) rather than a source-quote analysis, since there is
 * no seeded excerpt to quote from.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U1_DAR_AL_ISLAM: LessonPlan = {
  id: 'evelyn.ap.apworld.dar-al-islam.v1',
  title: 'U1.2 Developments in Dar al-Islam',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.dar-al-islam',
      description:
        'Explain how the fragmentation of Abbasid caliphal authority and the rise of new Muslim political and military powers shaped the Dar al-Islam, and how intellectual and religious networks sustained cultural unity across the Islamic world in the period 1200-1450.',
      standard: 'AP-APWORLD-1.2',
    },
  ],
  prerequisites: ['apworld.east-asia-song'],
  followUps: ['apworld.south-southeast-asia'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the point that the Dar al-Islam stayed a connected civilization even as its political authority fragmented and, in Baghdad\'s case, was violently destroyed.',
      script:
        "In 1258, Mongol forces sacked Baghdad and killed the last Abbasid caliph there — a five-century-old center of Islamic political and religious authority, gone in weeks. It sounds like it should be the end of a civilization. It wasn't. By 1258, the Abbasid caliph in Baghdad had already been a mostly ceremonial figure for a long time, with real political power held by regional sultans elsewhere in the Muslim world. And after Baghdad fell, the wider Dar al-Islam — the Islamic world, from Iberia to India — kept functioning as a connected civilization: new Muslim states rose to fill the political gap, and a shared network of scholars, teachers, and legal traditions that had never depended on any one caliph's survival kept the Islamic world culturally and religiously linked. This topic is about telling those two stories apart: a real political rupture, and a cultural unity that outlived it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-dar-al-islam-fragmentation-unity',
      kind: 'concept',
      goal: 'Explain how Abbasid political authority fragmented into competing Muslim successor states, and how ulama, madrasa, and Sufi networks sustained the Dar al-Islam\'s cultural and religious unity despite that fragmentation, 1200-1450.',
      keyIdeas: [
        'THE DAR AL-ISLAM ("house/abode of Islam") refers to the collective territories under Muslim rule and cultural influence — by 1200, stretching from Iberia and North Africa through the Middle East into Central and South Asia. It was a religiously and culturally connected zone, NOT a single unified political empire, even at moments when one caliphate claimed nominal authority over all of it.',
        'THE ABBASID CALIPHATE, based in Baghdad since 750, was the nominal center of Sunni Islamic political and religious authority. By 1200, however, its ACTUAL political power over most of its claimed territory had already been hollowed out for centuries, ceded to regional dynasties that ruled independently while sometimes still naming the caliph in Friday prayers as a mark of religious legitimacy.',
        'REGIONAL SUCCESSOR STATES held the real political and military power: the SELJUK TURKS built a powerful sultanate across Persia, Anatolia, and Iraq from the 11th century, administering through their own sultan while, for a time, preserving the Abbasid caliph as a religious figurehead. Later, the MAMLUKS — a ruling caste of former slave-soldiers based in Egypt — seized power in 1250, defeated the Mongol advance at Ain Jalut (1260), and hosted a ceremonial Abbasid caliph in Cairo after Baghdad\'s fall.',
        'THE MONGOL SACK OF BAGHDAD (1258): Hulegu\'s Mongol forces destroyed the city and executed the last Baghdad-based Abbasid caliph — a genuine, dramatic rupture that ended a five-century-old political and religious center. This event ended a specific INSTITUTION, not the Dar al-Islam\'s broader political or cultural life, which by then had many centers of power already independent of Baghdad.',
        'THE DELHI SULTANATE (established 1206) extended the same pattern into South Asia: a Turkic Muslim military dynasty ruling a large, mostly non-Muslim (Hindu-majority) population, entirely independent of events in Baghdad — further evidence that political power in the Dar al-Islam was already dispersed across many regional centers well before 1258.',
        'THE ULAMA (Muslim religious scholars) and a shared network of MADRASAS (Islamic colleges) trained jurists and scholars on a common curriculum across vast distances, creating a shared legal and intellectual culture that did not depend on any single political ruler\'s survival. Scholars, texts, and students circulated across political boundaries via trade routes, the hajj, and a shared Arabic scholarly language.',
        'SUFISM (Islamic mysticism) grew into a major religious and social force in this period, organized into orders (tariqas) whose traveling teachers spread Islamic devotional practice far beyond the reach of any Muslim ruler\'s direct political control — an especially important vehicle for both cultural cohesion within the Dar al-Islam and further religious expansion beyond it.',
        "EARLIER INTELLECTUAL LEGACY continued to circulate and be built upon even as Baghdad's political-intellectual primacy declined: the translation and synthesis tradition associated with Baghdad's House of Wisdom, the philosophy of Ibn Rushd (Averroes, writing in Iberia) whose commentaries on Aristotle later influenced European scholastic thought, and the mathematical legacy tied to al-Khwarizmi (whose name gives us the word \"algorithm\" and who helped transmit algebra) remained part of a shared scholarly inheritance across the Dar al-Islam.",
        'THE COMBINED EFFECT: real POLITICAL power in the Dar al-Islam fragmented into competing sultanates and dynasties (Seljuk, Mamluk, Delhi, and others), and suffered a genuine, violent rupture with Baghdad\'s fall in 1258 — but a shared religious and intellectual infrastructure (ulama, madrasas, Sufi networks, a common scholarly heritage) kept the wider Islamic world culturally and religiously connected across those political divisions.',
      ],
      vocabulary: [
        {
          term: 'Dar al-Islam',
          definition:
            'the collective territories under Muslim political rule and cultural influence — a religiously and culturally connected zone, not a single unified political empire.',
        },
        {
          term: 'ulama',
          definition:
            'the body of Muslim religious scholars whose shared legal and religious training, transmitted through a common madrasa curriculum, connected the Dar al-Islam across political boundaries.',
        },
        {
          term: 'madrasa',
          definition:
            'an Islamic institution of higher learning training scholars and jurists on a shared curriculum, forming a network that linked distant parts of the Dar al-Islam independent of any single political ruler.',
        },
        {
          term: 'Sufism',
          definition:
            'a mystical tradition within Islam, organized into orders (tariqas) whose traveling teachers spread devotional practice and helped extend Islam\'s reach beyond areas of direct Muslim political control.',
        },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-baghdad-claim-evaluation',
      kind: 'worked_example',
      problem:
        'A student claims: "Because the Mongols sacked Baghdad and killed the last Abbasid caliph there in 1258, Islamic civilization lost its political AND cultural unity after that date." Evaluate this claim using what you know about political and religious developments across the Dar al-Islam, 1200-1450.',
      steps: [
        "IDENTIFY WHAT'S ACCURATE IN THE CLAIM. The 1258 Mongol destruction of Baghdad and execution of the last Baghdad-based Abbasid caliph is a real, well-documented rupture — it ended a specific institution's roughly five-century run as a political and religious center.",
        "IDENTIFY WHAT THE CLAIM OVERREACHES ON. The claim conflates the loss of ONE political institution (the Baghdad-based caliphate) with the loss of the ENTIRE Dar al-Islam's political and cultural coherence. But Abbasid political power over most of its nominal territory had already been hollowed out for centuries before 1258, ceded to regional dynasties like the Seljuks.",
        'CITE COUNTEREVIDENCE — POLITICAL CONTINUITY ELSEWHERE. Other Muslim-ruled polities were unaffected by Baghdad\'s fall or grew stronger afterward: the Mamluks in Egypt (who had seized power in 1250) defeated the Mongols at Ain Jalut in 1260, halting their advance, and hosted a ceremonial Abbasid caliph in Cairo; the Delhi Sultanate in South Asia and various Muslim polities in North Africa and Iberia continued entirely independent of Baghdad\'s fate.',
        "CITE COUNTEREVIDENCE — CULTURAL/RELIGIOUS CONTINUITY. The ulama and the shared madrasa curriculum, Sufi orders, the hajj, and a common Arabic scholarly tradition (including still-circulating work associated with scholars like Ibn Rushd and the mathematical legacy tied to al-Khwarizmi) continued to link Muslims across huge distances — none of this depended on the Baghdad caliph's political survival.",
        'STATE A REVISED CONCLUSION. 1258 ended a specific political institution centered in Baghdad, not the Dar al-Islam\'s broader political life (which already had many centers of power) or its cultural and religious unity (sustained by non-political networks). The exam-ready distinction is POLITICAL fragmentation without CULTURAL rupture.',
      ],
      answer:
        'The claim is half right and half overreach. It is accurate that the 1258 Mongol sack of Baghdad and execution of the last Baghdad-based Abbasid caliph ended a real, five-century-old political and religious institution — a genuine rupture. But it overreaches by treating that as the end of the Dar al-Islam\'s POLITICAL and CULTURAL unity as a whole. Politically, power had already fragmented into competing regional dynasties (the Seljuks earlier, the Mamluks in Egypt from 1250, the Delhi Sultanate from 1206) long before 1258, and some of these — the Mamluks in particular — actually defeated the Mongol advance in 1260 and kept a ceremonial Abbasid caliph in Cairo. Culturally and religiously, the ulama\'s shared madrasa curriculum, Sufi orders, the hajj, and a common Arabic scholarly heritage kept the wider Islamic world connected independent of any single caliph\'s survival. The accurate conclusion: 1258 was a real political rupture for one institution, not the end of the Dar al-Islam\'s broader political life or its cultural unity.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE Muslim-ruled political entity, other than the Abbasid Caliphate, that exercised power somewhere in the Dar al-Islam in the period 1200-1450. (b) Explain how ONE such political entity maintained or extended Muslim political power despite the fragmentation of Abbasid central authority. (c) Explain ONE way religious or intellectual networks (e.g. the ulama, madrasas, or Sufism) sustained connections across the Dar al-Islam despite that political fragmentation.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine Muslim-ruled political entity of the period — e.g. the Seljuk Sultanate, the Mamluk Sultanate, or the Delhi Sultanate. No credit for a vague statement with no identifiable specific polity, or for an anachronistic/incorrect one.',
            modelResponse:
              'One Muslim-ruled political entity of this period was the Mamluk Sultanate, based in Egypt.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way the named entity maintained or extended Muslim political power — e.g. defeating the Mongols, ruling a large non-Muslim population, or hosting a ceremonial caliph. No credit for an explanation disconnected from the entity named in (a).',
            modelResponse:
              "The Mamluks, a ruling caste of former slave-soldiers, seized power in Egypt in 1250 and defeated the Mongol advance at the Battle of Ain Jalut in 1260, preserving independent Muslim political power in Egypt and the Levant even as the Mongols destroyed Baghdad's caliphate.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, historically accurate way religious or intellectual networks sustained connections across the Dar al-Islam — e.g. the ulama\'s shared madrasa curriculum, the hajj, or Sufi orders. No credit for a vague or unsupported claim.',
            modelResponse:
              'The ulama trained scholars and jurists on a shared curriculum at madrasas across the Islamic world, creating a common legal and intellectual culture that connected Muslims from Iberia to India regardless of which political ruler controlled a given region.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-baghdad-fall-ended-unity',
      kind: 'misconception_check',
      question:
        "True or false: the Abbasid caliphate's political collapse in 1258 ended Islamic cultural unity across the Dar al-Islam.",
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Conflating the collapse of ONE political institution (the Baghdad-based Abbasid caliphate) with the collapse of the Dar al-Islam\'s broader cultural and religious unity — missing that political fragmentation and cultural cohesion were sustained by entirely different mechanisms.',
          correctsTo:
            "FALSE. The Mongol destruction of Baghdad and execution of the last Baghdad-based Abbasid caliph in 1258 was a real political rupture — but it ended a specific institution, not the Dar al-Islam's cultural or religious unity. Political power across the Dar al-Islam had already fragmented into competing regional sultanates (Seljuk, later Mamluk, Delhi, and others) well before 1258, and some of these polities — notably the Mamluks — thrived after Baghdad's fall, even defeating the Mongols in 1260. Meanwhile, the ulama's shared madrasa curriculum, Sufi orders, the hajj, and a common scholarly heritage kept the wider Islamic world religiously and intellectually connected across all of these political divisions. On the AP exam, keep POLITICAL fragmentation (real, ongoing since well before 1258) analytically separate from CULTURAL/RELIGIOUS unity (sustained by non-political networks) — the two did not rise and fall together.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Dar al-Islam was a religiously and culturally connected zone, not a single unified political empire — political power was already dispersed among regional dynasties well before 1258.',
        'The Seljuk Sultanate, the Mamluk Sultanate (Egypt, from 1250), and the Delhi Sultanate (South Asia, from 1206) are all examples of Muslim political power exercised independent of the Baghdad caliphate.',
        "The Mongol sack of Baghdad (1258) ended the Abbasid caliphate as a political-religious center there — a real rupture, but one institution's end, not the end of the Dar al-Islam's political or cultural life.",
        'The ulama and shared madrasa curriculum, Sufi orders (tariqas), and the hajj sustained a common religious and intellectual culture across the Dar al-Islam independent of any single ruler.',
        'Scholarly legacies (e.g. Ibn Rushd\'s philosophy, al-Khwarizmi\'s mathematics) continued to circulate across the Dar al-Islam even as Baghdad\'s political-intellectual primacy declined.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.2',
    cedTitle: 'Developments in Dar al-Islam',
    sources: [{ type: 'plan', source: 'AP Plans Initiative — AP World History' }],
  },
};
