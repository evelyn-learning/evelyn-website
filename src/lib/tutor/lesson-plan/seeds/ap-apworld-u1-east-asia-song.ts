/**
 * AP World History: Modern — CED Unit 1.1: Developments in East Asia.
 *
 * Unit-1 fan-out content plan, following the Unit-2 calibration template
 * (`ap-apworld-u2-silk-roads.ts`). concept = the historical argument (how
 * did the Song Dynasty's institutions and economy outlast the dynasty
 * itself, and how did the Mongol Yuan Dynasty both continue and reshape
 * that centralized Chinese statecraft, 1200-1450?); worked_example =
 * annotated document analysis; try_yourself = a 3-point SAQ-style
 * short-answer.
 *
 * Anchor text: Marco Polo, The Travels (Yule-Cordier trans., c. 1300), on
 * the palace of Kublai Khan at Cambaluc —
 * evelyn.passage.apworld-marco-polo-khan-court.v1. IMPORTANT FRAMING: the
 * excerpt describes the YUAN court (Kublai Khan), not the Song. The
 * worked_example and concept teach it as evidence of YUAN continuity of
 * large-scale, centralized Chinese-style imperial statecraft as seen by an
 * outside observer, taught against the SONG foundations (civil-service
 * exam system, Neo-Confucianism, commercial economy) that the Yuan
 * inherited and partially — not wholly — preserved. Stays consistent with
 * U2's established facts (`ap-apworld-u2-cultural-diffusion.ts`): the
 * Confucian civil-service exam culture diffused to Korea and Vietnam,
 * while Japan absorbed Neo-Confucian thought WITHOUT the exam bureaucracy.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U1_EAST_ASIA_SONG: LessonPlan = {
  id: 'evelyn.ap.apworld.east-asia-song.v1',
  title: 'U1.1 Developments in East Asia',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.east-asia-song',
      description:
        'Explain how the Song Dynasty\'s civil-service examination system, Neo-Confucianism, and commercial economy organized centralized rule in East Asia, and how the Mongol Yuan Dynasty continued — and modified — that centralized statecraft in the period 1200-1450.',
      standard: 'AP-APWORLD-1.1',
    },
  ],
  prerequisites: [],
  followUps: ['apworld.dar-al-islam'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the point that Song China\'s institutions outlasted the Song Dynasty itself — a foreign Mongol dynasty inherited and reshaped, but did not erase, centuries of Chinese statecraft.',
      script:
        "In 1279, Mongol armies finished conquering China, ending the Song Dynasty and installing Kublai Khan as emperor of a new dynasty, the Yuan. You might expect a foreign conquest like that to sweep away everything the conquered civilization had built. It didn't — not entirely. The Song had spent three centuries building one of the most sophisticated states on earth: a civil-service exam system that (in theory) opened government office to talent, a revived Confucian philosophy, and a booming commercial economy fed by faster-ripening rice. When Marco Polo arrived at Kublai Khan's court a few decades later, he described a palace of almost unimaginable scale and splendor — Mongol rule, wearing the clothes of Chinese imperial grandeur. The real story of this topic is what the Yuan kept from the Song, what they changed, and what a foreign visitor's awe can and can't tell us about which was which.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-song-yuan-continuity',
      kind: 'concept',
      goal: 'Explain how Song institutions (the civil-service exam, Neo-Confucianism, the commercial economy) organized centralized rule, and how Yuan rule after 1279 continued and modified that structure.',
      keyIdeas: [
        'THE SONG DYNASTY (960-1279) reunified China after earlier fragmentation and built one of the most centralized, bureaucratically sophisticated states of the medieval world, governed through an examination-selected civil service rather than hereditary regional lords.',
        'THE CIVIL-SERVICE EXAMINATION SYSTEM expanded dramatically under the Song: candidates were tested on mastery of the Confucian classics, and passing an exam — in principle open to any male subject regardless of birth — was the main path into government office. This was a genuine meritocratic IDEAL that rejected pure hereditary privilege as the only route to power, but in PRACTICE access still favored families wealthy enough to fund years of classical education, so real social mobility existed without the system being open to "all."',
        'NEO-CONFUCIANISM was a philosophical revival, developed further under Song scholars (notably Zhu Xi), that reworked classical Confucian ethics together with ideas responding to Buddhism and Daoism. It became the core curriculum tested on the civil-service exam, tying China\'s philosophical and bureaucratic systems tightly together.',
        "SONG'S COMMERCIAL ECONOMY was transformed by CHAMPA RICE, a fast-ripening, drought-resistant rice variety introduced from Champa (in what is now Vietnam), which allowed multiple harvests per year and drove substantial population growth. Combined with an expanding network of internal waterways, market towns, and highly urbanized cities, Song China built one of the most commercially developed economies in the medieval world.",
        'THE MONGOL CONQUEST of Song China was completed in 1279 under Kublai Khan, who founded the YUAN DYNASTY (1271-1368) — a Mongol-ruled dynasty that adopted a Chinese-style imperial name and, in visible ways, continued the scale and grandeur of centralized Chinese rule.',
        'YUAN CONTINUITY: Kublai Khan and his successors used elements of the existing Chinese administrative apparatus and preserved China\'s imperial scale and ceremony — the kind of splendor a foreign observer like Marco Polo could witness firsthand at Kublai\'s court.',
        'YUAN CHANGE: Mongol rulers also modified what they inherited. They maintained an ethnic hierarchy that reserved the most powerful government positions for Mongols and "Semu" (Central and West Asian) officials over native Chinese, and they suspended the civil-service examinations for years after the conquest, only partially restoring a reduced version of the exams in 1315.',
        'REGIONAL DIFFUSION OF THE SONG MODEL: Neo-Confucian thought and the exam-based bureaucratic model diffused beyond China\'s borders in this same era, but adoption varied — Korea and Vietnam went furthest, adopting Chinese-style civil-service examination culture, while Japan absorbed Neo-Confucian philosophy WITHOUT adopting the examination system, remaining governed by hereditary, military (samurai) rule rather than an exam-selected bureaucracy.',
        'THE COMBINED EFFECT: the Song built durable institutional and economic foundations — the exam system, Neo-Confucianism, a commercialized rice-fed economy — that outlasted the dynasty itself. Yuan rule, though foreign and hierarchical, continued to project the same scale of centralized Chinese statecraft that impressed outside observers like Marco Polo, even as it modified and partially suspended the very exam system that had defined Song governance.',
      ],
      vocabulary: [
        {
          term: 'civil-service examination',
          definition:
            'the Song-era system of testing candidates on mastery of the Confucian classics to select government officials — in principle open to any male subject regardless of birth, though in practice favoring families able to afford a classical education.',
        },
        {
          term: 'Neo-Confucianism',
          definition:
            'a philosophical revival, developed further under Song scholars such as Zhu Xi, reworking classical Confucian ethics together with ideas responding to Buddhism and Daoism; became the core curriculum of the civil-service exam.',
        },
        {
          term: 'champa rice',
          definition:
            "a fast-ripening, drought-resistant rice variety introduced from Champa (in what is now Vietnam) into Song China, whose shorter growing season allowed multiple harvests per year and helped drive substantial population growth.",
        },
        {
          term: 'Yuan Dynasty',
          definition:
            'the Mongol-ruled dynasty in China (1271-1368, founded by Kublai Khan) that continued the scale of centralized Chinese imperial rule while reserving top offices for Mongols and Semu officials and suspending, then partially restoring (1315), the civil-service examinations.',
        },
      ],
      passageId: 'evelyn.passage.apworld-marco-polo-khan-court.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-marco-polo-khan-court',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Marco Polo\'s account (Yule-Cordier translation) of the palace of the Great Kaan, Kublai Khan, at Cambaluc: "The Hall of the Palace is so large that it could easily dine 6000 people; and it is quite a marvel to see how many rooms there are besides. The building is altogether so vast, so rich, and so beautiful, that no man on earth could design anything superior to it. The outside of the roof also is all coloured with vermilion and yellow and green and blue and other hues, which are fixed with a varnish so fine and exquisite that they shine like crystal, and lend a resplendent lustre to the Palace as seen for a great way round. This roof is made too with such strength and solidity that it is fit to last for ever." What does this passage reveal about the continuity of centralized statecraft from Song to Yuan China, and what should a careful reader keep in mind about the source?',
      steps: [
        "SOURCE IT FIRST. Who, when, why? Marco Polo, a Venetian merchant who resided in Yuan China under Kublai Khan in the late 1200s, later dictating an account (Yule-Cordier translation, drawing on the c. 1300 original) meant to describe the wonders of Kublai's rule to a European audience with no comparable frame of reference.",
        'IDENTIFY THE CLAIM. Polo describes a Hall able to "dine 6000 people," calls the building "so vast, so rich, and so beautiful, that no man on earth could design anything superior to it," and praises the roof\'s coloring, finish, and durability — "fit to last for ever."',
        "CONNECT TO THE CONTINUITY-OF-STATECRAFT CAUSE. This splendor was produced under Mongol Yuan rule, not the Song, but on the same scale of centralized, resource-concentrating imperial authority that Song institutions had already built. Kublai Khan preserved a Chinese-style imperial name and imperial grandeur even as the Yuan's ruling elite remained foreign and ethnically stratified.",
        "CONNECT TO THE OUTSIDER'S-EYE-VIEW DETAIL. Because Polo has no prior 'Song-era' frame of reference, his awe is testimony to the SCALE of the imperial court he personally observed — it is NOT evidence about whether the civil-service exam system was intact at the time, which the Yuan had in fact suspended for years after the conquest.",
        "WEIGH THE SOURCE'S RELIABILITY. Polo's absolute language (\"no man on earth could design anything superior to it\") is the descriptive color of an impressed foreign merchant, not a technical architectural assessment — still valuable as evidence that Yuan rule maintained a visibly awe-inspiring, centralized imperial authority.",
        'STATE THE LINK TO THE COURSE THESIS. This passage is testimony to Yuan CONTINUITY of large-scale, centralized Chinese-style imperial statecraft — distinct from, and not evidence about, the separate question of what the Yuan changed (like the exam system) from Song governance.',
      ],
      answer:
        'Polo\'s account of Kublai Khan\'s palace at Cambaluc — a hall that could "dine 6000 people," built with a splendor "no man on earth could design anything superior to" — is direct testimony that Yuan rule continued the same scale of centralized, awe-inspiring imperial authority that Song China had built over three centuries, even though the ruling dynasty was now Mongol rather than Chinese. A careful reader should note that Polo\'s outsider amazement documents the VISIBLE SCALE of the court, not the state of specific Song institutions like the civil-service exam, which the Yuan actually suspended for years before partially restoring it in 1315 — the passage is evidence of continuity in imperial GRANDEUR, not proof of continuity in every Song-era institution.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE institution or economic practice that supported centralized Song Dynasty rule, 1200-1279. (b) Explain how ONE such institution or practice strengthened Song rule or the Song economy. (c) Explain ONE way the civil-service examination system\'s role changed under Mongol Yuan rule after 1279.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine Song institution or economic practice — e.g. the civil-service examination system, Neo-Confucianism, or champa rice / the commercial economy. No credit for a vague statement ("China was strong") with no identifiable specific item, or an anachronistic/incorrect one.',
            modelResponse:
              'One institution that supported centralized Song rule was the civil-service examination system, which selected government officials based on mastery of the Confucian classics.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate mechanism by which the named item strengthened Song rule or the economy — e.g. connects the exam system to a centrally trained, loyal bureaucracy, or champa rice to population growth via multiple harvests. No credit for an explanation disconnected from the item named in (a).',
            modelResponse:
              'Because officials were selected through a standardized exam on the Confucian classics rather than inherited from regional lords, the Song court built a bureaucracy whose members owed their positions to the central government and shared a common ideological training, which strengthened centralized rule over a vast territory.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, historically accurate change to the civil-service examination system under the Yuan — e.g. that the Yuan suspended the exams for years after 1279 and only partially restored them in 1315, or that Yuan rule reserved top offices for Mongols/Semu officials over exam-qualified Chinese scholars. No credit for a vague or unsupported claim.',
            modelResponse:
              'Under the Yuan Dynasty, the Mongol rulers suspended the civil-service examinations for years after completing their conquest in 1279, only partially restoring a reduced version of the exams in 1315, and reserved the most powerful government positions for Mongols and Central/West Asian (Semu) officials rather than exam-qualified Chinese scholars.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-exam-meritocracy',
      kind: 'misconception_check',
      question:
        'True or false: the Song civil-service examination system made imperial China a meritocracy fully open to all, regardless of wealth or family background.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Treating the exam system\'s formal, in-principle openness ("any male subject can sit the exam") as proof of actual, practical openness — missing that years of classical education required real family wealth.',
          correctsTo:
            "FALSE. The civil-service exam was open IN PRINCIPLE to any male subject who could pass it, regardless of birth — a genuine break from a system where office was purely hereditary. But in PRACTICE, preparing for the exam required years of expensive classical education in the Confucian curriculum, which only families with real wealth could typically afford for their sons. The result was more social mobility than a purely hereditary aristocracy would allow, but nowhere near an exam \"open to all\" — access remained heavily skewed toward already-wealthy families. On the AP exam, describe this as a meritocratic IDEAL with real but LIMITED practical mobility, not a fully open system.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Song Dynasty (960-1279) built centralized rule on the civil-service exam system, Neo-Confucianism, and a commercial economy fed by champa rice.',
        'The exam system was a meritocratic IDEAL open in principle to any male subject, but in practice favored wealthy families who could afford classical education.',
        'The Yuan Dynasty (1271-1368, Kublai Khan) continued the SCALE of centralized Chinese imperial rule (seen in Marco Polo\'s account of the Cambaluc palace) while reserving top offices for Mongols/Semu officials and suspending, then partially restoring (1315), the civil-service exams.',
        'Neo-Confucian thought and exam-based bureaucracy diffused to Korea and Vietnam (which adopted the exam system) but Japan absorbed Neo-Confucian ideas WITHOUT the exam bureaucracy, keeping hereditary, samurai rule.',
        "A foreign observer's awe at Yuan imperial scale is evidence of continuity in GRANDEUR, not proof that every specific Song institution (like the exam system) continued unchanged.",
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '1',
    cedTopic: '1.1',
    cedTitle: 'Developments in East Asia',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-marco-polo-khan-court.v1',
        chapter: 'c. 1300',
        note: 'Marco Polo, "The Travels" (Yule-Cordier trans.) — anchor document for Yuan continuity of centralized Chinese imperial statecraft.',
      },
    ],
  },
};
