/**
 * AP World History: Modern — CED Unit 6.2/6.4: Reform Responses to Imperial
 * Pressure.
 *
 * Follows the Silk Roads calibration template
 * (`ap-apworld-u2-silk-roads.ts`). concept = the historical argument
 * (Ottoman, Qing, and Japanese reformers all attempted state-directed
 * modernization to preserve or restore sovereignty under imperial
 * pressure, but achieved sharply different outcomes); worked_example =
 * annotated document analysis; try_yourself = a 3-point SAQ-style
 * short-answer.
 *
 * Anchor text: the Charter Oath (1868) — evelyn.passage.apworld-meiji-charter-oath.v1.
 * CRITICAL TRANSLATION NOTE: the seeded passage is William Elliot Griffis's
 * 1876 "in substance" English rendering of the five articles. Its Articles
 * 2-3 diverge from the wording of other standard translations of the
 * Charter Oath. Teaching here is anchored on Articles 1 (deliberative
 * assembly / public opinion) and 5 (knowledge sought throughout the world),
 * which are stable across renderings; Articles 2-4 are described only in
 * general terms, never quoted as if Griffis's specific wording were THE
 * canonical Oath. See the worked example for the explicit translation-
 * fidelity caveat.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U6_REFORM_RESPONSES: LessonPlan = {
  id: 'evelyn.ap.apworld.reform-responses.v1',
  title: 'U6.4 Reform Responses to Imperial Pressure',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.reform-responses',
      description:
        'Compare the Ottoman Tanzimat, the Qing Self-Strengthening Movement and New Policies, and the Meiji Restoration as state-directed reform responses to imperial pressure, and explain why their outcomes diverged, 1839-1900.',
      standard: 'AP-APWORLD-6.4b',
    },
  ],
  prerequisites: ['apworld.global-migration'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Set up reform as a THIRD kind of response to imperial pressure, alongside expansion and resistance, and preview the puzzle of divergent outcomes.',
      script:
        "So far this unit has covered two responses to imperial pressure: expansion (the powers doing the conquering) and resistance (armed and religious pushback against them). There's a third response, attempted by three of the era's major non-Western states at almost the same time: reform from within. The Ottoman Empire, Qing China, and Japan each tried, starting within a few decades of one another, to modernize their militaries, economies, and even their governments — specifically to avoid the fate of India or Africa. Only one of the three succeeded well enough to avoid formal colonization AND start reversing the unequal treaties imposed on it. Figuring out why is one of the richest comparative questions in the whole AP World course.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-reform-responses',
      kind: 'concept',
      goal: 'Compare the Ottoman Tanzimat, the Qing Self-Strengthening Movement and New Policies, and the Meiji Restoration as reform responses to imperial pressure, and explain why Meiji Japan achieved comprehensive modernization while Ottoman and Qing reform efforts fell short.',
      keyIdeas: [
        'THE TANZIMAT ("Reorganization," 1839-1876) was the Ottoman Empire\'s sustained program of legal, administrative, and military modernization: new law codes, expanded (in principle) legal equality for subjects regardless of religion, restructured taxation and provincial administration, and Western-style military reform — all aimed at strengthening the central state and demonstrating enough "civilized" governance (by contemporary European standards) to discourage direct European intervention.',
        'THE YOUNG OTTOMANS pushed the Tanzimat toward full constitutionalism, achieving the OTTOMAN CONSTITUTION OF 1876 (the Kanun-i Esasi) — the empire\'s first written constitution, establishing an elected parliament. It was short-lived: Sultan Abdulhamid II suspended it within a few years and ruled by autocratic decree for decades afterward, illustrating how far a reform could go on paper before entrenched autocratic power reversed it.',
        'THE QING SELF-STRENGTHENING MOVEMENT (1860s-1890s) pursued a narrower strategy, summarized by reformers themselves as adopting Western military and industrial technology as practical TOOLS while preserving the existing Confucian social and political order — new arsenals, shipyards, and a modernized navy were built, but without comparably deep reform of Qing political institutions.',
        "THE QING NEW POLICIES (after 1901, in the aftermath of the Boxer Uprising and its harsh settlement) attempted much more sweeping change than Self-Strengthening had — military restructuring, a new education system, and tentative steps toward constitutional government — but came too late and too slowly to reverse the dynasty's declining legitimacy and control, and the Qing Dynasty fell in 1911.",
        'THE MEIJI RESTORATION (from 1868) took a different path from the start. Months after the fall of the Tokugawa shogunate, the new government issued the CHARTER OATH (April 1868) — a five-article statement of founding principle. Its most consequential and durable articles promised that "a deliberative assembly shall be formed, and all measures decided by public opinion" (Article 1) and that "wisdom and ability should be sought after in all quarters of the world for the purpose of firmly establishing the foundations of the empire" (Article 5) — a government committing itself, from the outset, to consultative governance and to deliberately seeking useful foreign knowledge rather than rejecting it.',
        'MEIJI JAPAN THEN PURSUED SWEEPING, TOP-DOWN MODERNIZATION consistent with that charter: abolishing the old feudal domain system, building a modern conscript army and navy, establishing state-directed industry, overhauling education, and — crucially — doing all of this under a SELECTIVE adaptation frame known as KOKUTAI ("national polity"): Western technology, institutions, and knowledge were deliberately adopted and adapted, but reframed within a distinctly Japanese ideological structure centered on the emperor as a unifying national symbol, not simply copied wholesale from the West.',
        'WHY THE OUTCOMES DIVERGED: Meiji Japan combined a relatively small, cohesive reforming elite with a restored, symbolically unifying emperor and a reform program launched in a single decisive break (1868) rather than a slower, contested reorganization of an existing, much larger and more internally divided state. The Ottoman and Qing empires, by contrast, governed larger, more diverse territories, carried heavier foreign debt burdens, and faced entrenched autocratic or conservative factions (Abdulhamid II suspending the 1876 constitution; conservative Qing court politics limiting Self-Strengthening\'s scope) that repeatedly narrowed or reversed reform. By the 1890s-1900s, Japan was strong enough to begin successfully revising the unequal treaties imposed on it and to avoid formal colonization entirely — an outcome Ottoman and Qing reform, though real and substantial, did not fully achieve.',
      ],
      vocabulary: [
        {
          term: 'Tanzimat',
          definition:
            'the Ottoman Empire\'s sustained program of legal, administrative, and military modernization (1839-1876), aimed at strengthening the central state and discouraging European intervention.',
        },
        {
          term: 'Self-Strengthening Movement',
          definition:
            'the Qing Dynasty\'s program (1860s-1890s) of adopting Western military and industrial technology as practical tools while preserving the existing Confucian social and political order.',
        },
        {
          term: 'Charter Oath (1868)',
          definition:
            'the five-article statement of founding principle issued by the new Meiji government months after the fall of the Tokugawa shogunate, promising (Article 1) deliberative, public-opinion-based government and (Article 5) the pursuit of knowledge and ability "in all quarters of the world."',
        },
        {
          term: 'kokutai',
          definition:
            '("national polity") the ideological frame under which Meiji Japan selectively adapted Western technology and institutions while centering a distinctly Japanese national identity on the emperor — evidence against the idea that Meiji Japan simply "westernized."',
        },
      ],
      passageId: 'evelyn.passage.apworld-meiji-charter-oath.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-charter-oath',
      kind: 'worked_example',
      problem:
        'Analyze these two articles of the Meiji government\'s Charter Oath (1868), rendered here from a 19th-century American translation: "1. A deliberative assembly shall be formed, and all measures decided by public opinion." and "5. Wisdom and ability should be sought after in all quarters of the world for the purpose of firmly establishing the foundations of the empire." What do these articles reveal about the new Meiji government\'s intentions, and what should a careful reader keep in mind about this translation?',
      steps: [
        "SOURCE IT FIRST. Who, when, why? This rendering comes from William Elliot Griffis's The Mikado's Empire (1st ed. 1876), an American educator who lived in Japan from 1870-74 — a widely reproduced 19th-century English rendering of the five-article oath issued by the new Meiji government in April 1868, months after the fall of the Tokugawa shogunate.",
        'IDENTIFY THE CLAIM IN EACH ARTICLE. Article 1 commits the new government to a "deliberative assembly" with "all measures decided by public opinion" — a promise of consultative, not purely autocratic, governance. Article 5 commits it to seeking "wisdom and ability... in all quarters of the world" to "firmly establish the foundations of the empire" — an explicit, official mandate to pursue useful foreign knowledge rather than reject it as a threat to tradition.',
        "WEIGH THE TRANSLATION CAREFULLY. Griffis's rendering is described in his own text as giving the Oath's sense \"in substance,\" and it is only one of several English translations of this document; its middle articles (2-3) in particular differ in specific wording from other standard translations. This lesson deliberately anchors its analysis on Articles 1 and 5, whose substance (a deliberative, public-opinion-oriented government; deliberate pursuit of outside knowledge) is consistent across renderings — a careful reader should not treat any one 19th-century American rendering's exact phrasing of every article as fixed, official wording of the Oath.",
        "CONNECT TO THE KOKUTAI ARGUMENT. Article 5's pursuit of outside knowledge is not the same as wholesale Westernization: the Oath frames that pursuit as being FOR \"the foundations of the empire\" — i.e., in service of a specifically Japanese state and monarchy, not a renunciation of Japanese identity. This is the seed of the kokutai frame explored later in the concept: selective adoption of useful foreign knowledge, subordinated to a national purpose.",
        "STATE THE LINK TO THE COURSE THESIS. Read together, Articles 1 and 5 show the new Meiji government committing itself, within months of taking power, to two things few other 19th-century reform programs combined so early and so explicitly: some form of consultative governance, and an official, unapologetic mandate to seek out foreign expertise — a founding orientation that helps explain why Meiji reform proceeded further and faster than the Tanzimat or Self-Strengthening.",
      ],
      answer:
        'Article 1 of the Charter Oath commits the new Meiji government to a "deliberative assembly" with "all measures decided by public opinion" — a promise of consultative governance. Article 5 commits it to seeking "wisdom and ability... in all quarters of the world," explicitly in service of "firmly establishing the foundations of the empire" — a mandate to pursue foreign knowledge for specifically Japanese national purposes, not to abandon Japanese identity, which is the seed of the later kokutai framing. A careful reader should note this rendering, from William Elliot Griffis\'s The Mikado\'s Empire (1876), gives the Oath\'s sense "in substance" and its middle articles diverge from other translations, so analysis here is deliberately anchored on Articles 1 and 5, whose substance is stable across renderings. Together, these two articles show the new government committing early and explicitly to consultative governance and to deliberately seeking outside expertise — a founding orientation that helps explain why Meiji reform went further than the Tanzimat or Self-Strengthening.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Identify ONE reform program undertaken by the Ottoman Empire, Qing China, or Japan in response to imperial pressure, 1839-1900. (b) Explain ONE way that program aimed to strengthen the state or preserve its sovereignty. (c) Explain ONE reason Meiji Japan's reforms achieved outcomes that the Tanzimat or the Self-Strengthening Movement did not.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine reform program — e.g. the Tanzimat, the Ottoman Constitution of 1876, the Self-Strengthening Movement, the Qing New Policies, or the Meiji Restoration/Charter Oath. No credit for a vague statement with no identifiable specific program, or an anachronistic/incorrect item.',
            modelResponse:
              "One reform program undertaken in response to imperial pressure was the Ottoman Tanzimat (1839-1876), a sustained program of legal, administrative, and military modernization.",
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way the named program aimed to strengthen the state or preserve sovereignty — e.g. discouraging European intervention by demonstrating "civilized" governance, or building modern military capacity. No credit for an explanation disconnected from the program named in (a).',
            modelResponse:
              'The Tanzimat aimed to strengthen the Ottoman state by modernizing its legal codes, taxation, and military along European lines, intending to demonstrate enough centralized, "civilized" governance by contemporary European standards to discourage direct European intervention.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, historically accurate reason for Meiji Japan's more successful outcome — e.g. a cohesive reforming elite unified around a restored emperor, a single decisive founding break (1868) versus a slower contested reorganization, or comparatively lower internal political fragmentation than the Ottoman or Qing empires faced. No credit for a vague or unsupported claim.",
            modelResponse:
              "Meiji Japan combined a relatively small, cohesive reforming elite with a restored emperor who served as a unifying national symbol, allowing comprehensive top-down reform launched in one decisive break in 1868 — whereas the Ottoman and Qing empires governed larger, more internally divided territories where entrenched autocratic or conservative factions (such as Sultan Abdulhamid II suspending the 1876 constitution) repeatedly narrowed or reversed reform efforts.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-japan-simply-westernized',
      kind: 'misconception_check',
      question:
        'True or false: Meiji Japan modernized by simply westernizing — adopting Western institutions and abandoning Japanese tradition and identity.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Collapsing Meiji Japan\'s selective, purposeful adaptation of useful Western technology and institutions into a claim that Japan simply copied the West wholesale — missing the AP exam\'s expected kokutai framing, in which modernization was explicitly in service of a distinctly Japanese national identity, not a replacement for it.',
          correctsTo:
            "FALSE. Meiji Japan did adopt a great deal of Western military, industrial, and institutional technology — but under the KOKUTAI (\"national polity\") frame, that adoption was SELECTIVE and purposeful, not wholesale imitation. The Charter Oath's own Article 5 frames the pursuit of outside \"wisdom and ability\" as being explicitly for \"firmly establishing the foundations of the empire\" — i.e., in service of a specifically Japanese state, centered on the emperor as a unifying national symbol that was preserved and even strengthened, not discarded. Meiji reformers borrowed institutions and technologies they judged useful while deliberately maintaining a distinct Japanese national identity — the opposite of simply becoming culturally Western.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The Ottoman Tanzimat (1839-1876) and its Constitution of 1876 (soon suspended by Abdulhamid II) modernized Ottoman law and administration but could not fully reverse relative decline.',
        'The Qing Self-Strengthening Movement (1860s-1890s) adopted Western technology as a tool while preserving the existing political order; the later New Policies (post-1901) attempted more but came too late — the dynasty fell in 1911.',
        'The Meiji Charter Oath (1868) committed the new government early to consultative governance (Article 1) and to seeking outside knowledge (Article 5) — quote only the seeded 19th-century American rendering, which diverges from other translations in its middle articles.',
        'Meiji modernization was SELECTIVE, under the kokutai frame — adopting useful Western technology/institutions while centering a distinct Japanese identity on the emperor, not simply "westernizing."',
        'By the 1890s-1900s, Japan\'s comprehensive reform let it begin revising the unequal treaties imposed on it and avoid formal colonization — an outcome Ottoman and Qing reform did not fully achieve.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.2/6.4',
    cedTitle: 'Reform Responses to Imperial Pressure',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-meiji-charter-oath.v1',
        chapter: '1868',
        note: 'The Charter Oath (Griffis translation, 1876) — anchor document, analysis restricted to Articles 1 and 5 per the translation-fidelity caveat.',
      },
    ],
  },
};
