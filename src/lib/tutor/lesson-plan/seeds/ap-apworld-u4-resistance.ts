/**
 * AP World History: Modern — CED Unit 4.7-4.8: Resistance and Accommodation.
 *
 * Unit-4 fan-out content plan, fifth and last in the within-unit chain
 * (maritime-exploration → columbian-exchange-global → maritime-empires →
 * atlantic-slave-trade → resistance-accommodation). concept = the
 * historical argument (how did non-European states and societies actively
 * regulate, rather than passively receive, European maritime expansion
 * before 1750?); worked_example = annotated reading of a described
 * document; try_yourself = a 3-point SAQ-style short-answer.
 *
 * Anchor stimulus: evelyn.passage.apworld-tokugawa-edict.v1, a DESCRIBED
 * DOCUMENT (original prose description of the 1635 Closed Country Edict;
 * no verbatim translated text is available under a confirmed public-domain
 * license — see that seed's doc comment). CRITICAL, enforced throughout
 * this file: no quotation marks are placed around any edict language,
 * anywhere (concept, worked example, try-yourself, misconception, recap,
 * metadata) — the edict's content is paraphrased in this plan's own words
 * exactly as the passage's described-document fullText does.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U4_RESISTANCE: LessonPlan = {
  id: 'evelyn.ap.apworld.resistance-accommodation.v1',
  title: 'U4.7 Resistance and Accommodation',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.resistance-accommodation',
      description:
        'Explain how non-European states and societies (Tokugawa Japan, Qing China, the Ottoman Empire, maroon communities, and African states such as Ndongo/Matamba under Queen Nzinga) actively resisted or managed the terms of European maritime expansion, 1450-1750.',
      standard: 'AP-APWORLD-4.7',
    },
  ],
  prerequisites: ['apworld.atlantic-slave-trade'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see non-European states as active regulators of contact with Europeans, not passive recipients of European expansion.',
      script:
        "It's tempting to picture the period 1450-1750 as one long story of Europeans arriving and everyone else simply reacting. Look closer at almost any specific case and a different pattern shows up. Japan's Tokugawa shogunate didn't get overrun by European traders — it deliberately closed most of the country to them in the 1630s, on its own terms, while carefully keeping one narrow channel open at a single supervised island. China's Qing emperors confined European merchants to a single port under close supervision rather than either welcoming or expelling them outright. A queen in West-Central Africa fought and negotiated with Portugal for decades without ever losing her throne. None of these were societies waiting to be acted upon — they were setting the rules of contact themselves, for as long as they had the power to do it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-resistance-accommodation',
      kind: 'concept',
      goal: 'Explain how Tokugawa Japan, Qing China, the Ottoman Empire, maroon communities, and African states actively regulated or resisted European maritime expansion.',
      keyIdeas: [
        'TOKUGAWA RESTRICTION AND THE DUTCH EXCEPTION: through a series of directives culminating in the 1630s, the Tokugawa shogunate sharply restricted contact between Japan and the outside world — barring Japanese subjects from traveling abroad, treating Christianity as a threat to be actively rooted out, and confining foreign merchant activity to a small number of closely supervised locations rather than letting it spread freely along the coast. By 1641, this policy (often called sakoku) had narrowed permitted European trade to the Dutch alone, who were confined to the small artificial island of Dejima in Nagasaki harbor, where they could be watched continuously and kept apart from the wider Japanese population. This was a Japanese state choosing, on its own terms, exactly how much contact to allow and with whom.',
        'QING CHINA AND THE CANTON SYSTEM: the Kangxi and Qianlong emperors managed, rather than rejected, growing European trade demand. From 1757, the Qing state confined all European trade to the single port of Guangzhou (Canton), channeling it through licensed Chinese merchant guilds (the cohong) who mediated between foreign traders and Chinese authorities — a system of tight state supervision and control over the terms of access, echoing the same logic of managed contact seen in Tokugawa Japan.',
        'OTTOMAN CAPITULATIONS AS MANAGED ACCESS: the Ottoman Empire granted certain European states special trading privileges and legal exemptions, known as capitulations, allowing regulated European merchant activity within Ottoman territory. Especially in the earlier part of this period, these were concessions granted from a position of Ottoman strength — a deliberate policy of managed access, not a sign of Ottoman weakness or loss of sovereignty.',
        'MAROON COMMUNITIES: across the Americas, enslaved people who escaped bondage formed autonomous maroon communities — for example Palmares in Brazil and communities of Jamaican Maroons — that sustained themselves independently of colonial control, in some cases fighting off colonial military expeditions for years and eventually negotiating formal treaties recognizing their autonomy.',
        "QUEEN NZINGA OF NDONGO/MATAMBA: from roughly the 1620s into the 1660s, Queen Nzinga led sustained resistance to Portuguese encroachment in West-Central Africa (the region of present-day Angola), combining decades of warfare, shifting alliances, and diplomacy to preserve her states' independence — a clear example of African state agency directed against European expansion rather than passive submission to it.",
        "A BRIEF CROSS-REFERENCE — METACOM'S WAR: in New England, Metacom (also known as King Philip) led a major armed Indigenous uprising against English colonial expansion in 1675-1676 — a reminder that armed resistance to European expansion occurred in the Americas as well as in Africa and Asia, alongside the diplomatic and administrative forms of resistance and accommodation covered above.",
      ],
      vocabulary: [
        {
          term: 'sakoku',
          definition:
            "the Tokugawa shogunate's policy, tightened through a series of directives culminating in the 1630s, of sharply restricting Japanese travel abroad and confining foreign trade to a small number of closely supervised locations.",
        },
        {
          term: 'Canton System',
          definition:
            'the Qing policy, established in 1757, confining all European trade to the port of Guangzhou (Canton) and channeling it through licensed Chinese merchant guilds (the cohong).',
        },
        {
          term: 'capitulations',
          definition:
            'special trading privileges and legal exemptions the Ottoman Empire granted to certain European states, a deliberate policy of managed access rather than a loss of Ottoman sovereignty.',
        },
        {
          term: 'maroon communities',
          definition:
            'autonomous communities formed by enslaved people who escaped colonial bondage in the Americas (e.g., Palmares in Brazil, the Jamaican Maroons), some of which sustained independence for years and negotiated formal treaties with colonial powers.',
        },
      ],
      passageId: 'evelyn.passage.apworld-tokugawa-edict.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-tokugawa-edict',
      kind: 'worked_example',
      problem:
        'A described document summarizes a series of Tokugawa shogunate directives, issued to the officials governing the port city of Nagasaki and culminating in 1635, that barred Japanese subjects from traveling abroad or returning if they had already left, intensified enforcement against Christianity through rewards for informants, and narrowed foreign trade to a small number of closely supervised ports — part of a broader policy that, by 1641, confined the last permitted European trading presence (the Dutch) to the small artificial island of Dejima in Nagasaki harbor. What does this reveal about the Tokugawa shogunate\'s approach to European contact, and how should this document be handled when discussing it?',
      steps: [
        'SOURCE IT FIRST. This is a described document — a prose summary of a series of Tokugawa directives, culminating in 1635, issued to the officials governing the port of Nagasaki. No specific translated wording is quoted; every detail below is paraphrased from the described content, and it should be discussed the same way — describing what the directives did, never quoting language attributed to them.',
        'IDENTIFY WHAT THE DIRECTIVES ACTUALLY DID. They stopped Japanese subjects from traveling abroad, treated returning from abroad as a serious offense, intensified enforcement against Christianity through incentives for informants, and concentrated foreign merchant activity into a small number of supervised locations rather than banning foreign trade outright.',
        'IDENTIFY WHAT WAS NOT DONE. Foreign trade was narrowed and supervised, not eliminated — the shogunate chose continued, tightly controlled contact with the Dutch (formalized by 1641 at Dejima) over total isolation, showing this was a policy of managed access, not simple xenophobic withdrawal.',
        "CONNECT TO THE CONCEPT'S CLAIM. This is direct evidence that the Tokugawa shogunate was actively setting and enforcing its own terms for contact with the outside world — barring what it saw as destabilizing (unrestricted travel and unsupervised religious activity) while preserving a narrow, closely watched channel for the trade it wanted to keep.",
        'STATE THE LINK TO THE COURSE THESIS. Rather than passively absorbing whatever level of European contact happened to arrive, the Tokugawa shogunate designed a deliberate, actively enforced system for managing that contact — the same underlying logic later visible in the Qing Canton System and Ottoman capitulations.',
      ],
      answer:
        "The described directives show the Tokugawa shogunate actively setting the terms of contact with the outside world rather than passively receiving it: Japanese subjects were barred from traveling abroad (with returning from abroad treated as a serious offense), enforcement against Christianity intensified through incentives for informants, and foreign merchant activity was concentrated into a small number of closely supervised locations rather than banned outright. Because foreign trade was narrowed and supervised rather than eliminated — continued, tightly controlled contact with the Dutch was formalized by 1641 at Dejima — this reflects a policy of managed access, not simple xenophobic withdrawal. When discussing this document, describe what the directives did in your own words rather than quoting any translated wording, since no confirmed public-domain translation of the edict is used here. The broader lesson: the shogunate was actively designing and enforcing its own system for managing European contact, the same underlying logic later visible in the Qing Canton System and Ottoman capitulations.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Identify ONE way the Tokugawa shogunate restricted contact with the outside world in the 1600s. (b) Explain ONE way a Qing emperor or the Canton System managed European trade access to China. (c) Explain ONE example of resistance or accommodation to European expansion by an African or American society or state, 1450-1750.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): correctly identifies ONE genuine restriction the Tokugawa shogunate imposed — e.g. barring Japanese travel abroad, treating Christianity as a threat to be rooted out, or confining foreign trade to a small number of supervised locations (culminating in the Dutch confinement to Dejima by 1641). Responses must describe the restriction in the student's own words, without quoting any specific translated edict wording. No credit for a vague or inaccurate restriction.",
            modelResponse:
              'One way the Tokugawa shogunate restricted contact with the outside world was by barring Japanese subjects from traveling abroad and treating anyone who returned after living overseas as having committed a serious offense.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way the Qing state (Kangxi/Qianlong) or the Canton System (from 1757) managed rather than banned European trade — e.g. confining trade to Guangzhou (Canton) and channeling it through licensed cohong merchant guilds. No credit for a vague or unconnected claim.',
            modelResponse:
              'From 1757, the Qing state confined all European trade to the single port of Guangzhou (Canton), requiring foreign merchants to conduct business through licensed Chinese merchant guilds (the cohong), which let Qing authorities closely supervise and control the terms of European trade access.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate example of African or American resistance/accommodation — e.g. Queen Nzinga\'s decades of resistance to Portugal in Ndongo/Matamba, maroon communities (Palmares, Jamaican Maroons), or Metacom\'s War (1675-1676). No credit for a vague or unsupported claim.',
            modelResponse:
              'Queen Nzinga of Ndongo and Matamba led sustained resistance to Portuguese encroachment in West-Central Africa from roughly the 1620s into the 1660s, combining warfare, shifting alliances, and diplomacy to preserve her states\' independence rather than passively submitting to Portuguese expansion.',
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-passive-reception',
      kind: 'misconception_check',
      question:
        'True or false: non-European states and societies mostly passively received European maritime expansion between 1450 and 1750, with little ability to shape the terms of contact.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Assuming European maritime expansion automatically dictated the terms of global contact everywhere, and overlooking non-European states' capacity to actively regulate, resist, or manage that contact until industrialization shifted the balance of power.",
          correctsTo:
            "FALSE. Most non-European states and societies actively regulated the terms of European contact well into this period. The Tokugawa shogunate designed a deliberate system restricting Japanese travel and confining supervised trade to Dejima by 1641; the Qing state confined European trade to Canton under the cohong system from 1757; the Ottoman Empire granted capitulations from a position of strength; maroon communities sustained independence from colonial control; and African rulers such as Queen Nzinga fought and negotiated with Portugal for decades. The large-scale shift toward European dominance of the terms of contact mostly came later, with industrialization.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        "The Tokugawa shogunate designed its own system for restricting contact — barring Japanese travel abroad, treating Christianity as a threat, and by 1641 confining supervised Dutch trade to Dejima.",
        "The Qing Canton System (from 1757) confined European trade to Guangzhou (Canton), managed through licensed cohong merchant guilds — control, not outright rejection, of trade.",
        'Ottoman capitulations granted European states trading privileges from a position of Ottoman strength — a policy choice, not a sign of weakness.',
        'Maroon communities (e.g., Palmares, Jamaican Maroons) sustained independence from colonial control, sometimes for years, and could negotiate formal treaties.',
        "Queen Nzinga's decades-long resistance to Portugal (roughly 1620s-1660s) and Metacom's War (1675-1676) show armed and diplomatic resistance to European expansion continuing well into this period.",
        'Non-European states mostly regulated European contact on their own terms until industrialization shifted the global balance of power — not passive acceptance.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.7-4.8',
    cedTitle: 'Resistance and Accommodation',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-tokugawa-edict.v1',
        chapter: '1635',
        note: 'Closed Country Edict of 1635 (described document) — anchor stimulus for Tokugawa managed-access policy; paraphrased throughout, never quoted.',
      },
    ],
  },
};
