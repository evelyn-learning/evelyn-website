/**
 * AP World History: Modern — CED Unit 9.8-9.9: Global Culture, Human Rights,
 * and Migration.
 *
 * Follows the Unit-2 Vertical Slice's gold template (see
 * ap-apworld-u2-silk-roads.ts for the full rationale). Final stop in Unit 9:
 * multidirectional global popular-culture flows, the postwar human-rights
 * framework and rights movements, migration/refugee debates, religious
 * revival movements, and the post-9/11 security-vs-rights debate.
 *
 * Anchor texts: (1) the Universal Declaration of Human Rights (1948) —
 * evelyn.passage.apworld-udhr.v1 — REUSED from Unit 8, wired in the concept
 * segment as the founding document of the postwar universal-rights
 * framework; (2) President George W. Bush's September 20, 2001 address to
 * Congress — evelyn.passage.apush-bush-sept-2001.v1 — REUSED from the APUSH
 * catalog, wired in the worked example as a document showing the globalized
 * security-vs-rights debate that followed the September 11 attacks. Both
 * quoted only as the short excerpts already seeded; the Bush excerpt's three
 * non-adjacent segments are never bridged as if contiguous.
 *
 * Anti-apartheid and global-feminism movements are discussed only in
 * authored description; the 9/11 security-vs-rights discussion is framed as
 * a documented debate, not resolved by the plan.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U9_CULTURE_RIGHTS: LessonPlan = {
  id: 'evelyn.ap.apworld.culture-rights-migration.v1',
  title: 'U9.8-9.9 Global Culture, Human Rights, and Migration',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.culture-rights-migration',
      description:
        'Explain multidirectional flows of global popular culture, the postwar human-rights framework and rights movements (anti-apartheid, global feminism), migration and refugee debates, religious revival movements, and the globalized security-vs-rights debate following the September 11 attacks.',
      standard: 'AP-APWORLD-9.8',
    },
  ],
  prerequisites: ['apworld.environment-disease', 'apworld.global-economy'],
  followUps: [],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see late-twentieth-century global culture and rights as flowing in multiple directions and producing genuine, unresolved debates, not a single story moving outward from one center.',
      script:
        "Ask someone to picture \"global culture\" spreading after 1945, and a lot of people picture one direction: American movies and music reaching the rest of the world. That happened — but it's only half the picture. A dance-and-music genre born in South Korea became a worldwide phenomenon. Football, with roots across multiple continents, became the world's most popular sport. And the same postwar decades that globalized entertainment also globalized a genuinely new idea: that certain rights belong to every human being, everywhere, regardless of what their own government says. That idea reshaped movements from South Africa to global women's conferences — and, after September 11, 2001, it collided directly with urgent new security concerns. Today we're tracing culture, rights, and migration as they actually moved: in multiple directions, and often in tension with each other.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-culture-rights-migration',
      kind: 'concept',
      goal: 'Explain multidirectional global popular-culture flows, the UDHR and postwar human-rights movements, migration/refugee debates, religious revivals, and the post-9/11 security-vs-rights debate.',
      keyIdeas: [
        "THE UNIVERSAL DECLARATION OF HUMAN RIGHTS (1948): adopted by the United Nations General Assembly in the aftermath of World War II's atrocities, the UDHR proclaimed a set of rights — including equal dignity, freedom, and non-discrimination — as belonging to \"all members of the human family,\" a genuinely new claim that rights are universal rather than granted solely at each government's discretion. The UDHR is not legally binding by itself, but it became the foundation for later binding human-rights treaties and a shared reference point for rights movements worldwide.",
        "GLOBAL POPULAR CULTURE FLOWS IN MULTIPLE DIRECTIONS: Bollywood films, produced in India, reach large audiences across South Asia, the Middle East, and beyond; K-pop, originating in South Korea, became a global music and media phenomenon with fan bases on every continent; football (soccer), with roots and popularity spanning Europe, Latin America, Africa, and Asia, became the world's most widely followed sport. These flows show that cultural globalization moved outward from many different centers, not along a single path from one country to everywhere else.",
        "HUMAN-RIGHTS MOVEMENTS: the international anti-apartheid movement (described here, never quoted from any figure's writings) combined internal South African resistance with global pressure — including boycotts and diplomatic isolation — contributing to the end of apartheid and South Africa's first fully democratic elections in 1994. Global feminism gained institutional expression at UN-sponsored World Conferences on Women, most notably the 1995 Beijing conference, which brought delegates from across the world together around shared (if contested) goals for women's rights and gender equality.",
        "MIGRATION AND REFUGEE DEBATES: decolonization, conflict, and economic opportunity drove large-scale migration in the postwar decades, while wars and persecution produced large refugee populations requiring international response (coordinated partly through the UN's refugee agency, established in 1950). Debates over how many migrants and refugees to admit, and on what terms, became a persistent and genuinely contested political issue in many receiving countries.",
        "RELIGIOUS REVIVALS AND FUNDAMENTALISMS: across multiple faiths, the late twentieth century saw religious revival movements and more assertive fundamentalist currents responding, in different ways, to secularization, rapid social change, and globalization's pressures — a pattern documented across Christian, Islamic, Hindu, and Jewish contexts, not limited to any single tradition.",
        "SEPTEMBER 11, 2001 AND THE SECURITY-VS-RIGHTS DEBATE: the September 11, 2001 attacks on the United States prompted a global reassessment of the balance between national security and civil liberties/rights, including expanded surveillance and security powers in multiple countries and a documented, contested debate over how far such measures should extend — a debate historians and political scientists treat as ongoing rather than settled.",
        "TENSION, NOT A SINGLE STORY: cultural globalization, universal-rights claims, migration, and post-9/11 security concerns did not move in one simple direction — they produced ongoing debates (how open should borders be, how far should security measures extend, whose culture is influencing whom) that remain genuinely unresolved rather than concluded by any single event.",
      ],
      vocabulary: [
        {
          term: 'Universal Declaration of Human Rights (UDHR, 1948)',
          definition:
            'a UN General Assembly declaration proclaiming rights belonging to "all members of the human family," not legally binding by itself but foundational to later binding human-rights treaties and rights movements.',
        },
        {
          term: 'cultural hybridity',
          definition:
            'the pattern in which global popular culture (Bollywood, K-pop, football) flows outward from multiple centers and blends across borders, rather than moving in one direction from a single dominant source.',
        },
        {
          term: 'anti-apartheid movement',
          definition:
            "the combination of internal South African resistance and global pressure (boycotts, diplomatic isolation) that contributed to ending apartheid and South Africa's first fully democratic elections in 1994.",
        },
        {
          term: 'global feminism (Beijing, 1995)',
          definition:
            "the international women's-rights movement gaining institutional expression at UN World Conferences on Women, most notably the 1995 Beijing conference.",
        },
      ],
      passageId: 'evelyn.passage.apworld-udhr.v1',
      estimatedMinutes: 7,
    },
    {
      id: 'worked-bush-sept-2001',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from President George W. Bush\'s September 20, 2001 address to a joint session of Congress on the US response to the September 11 attacks: "On September the 11th, enemies of freedom committed an act of war against our country. . . . night fell on a different world, a world where freedom itself is under attack." Later in the same address, after a separate, non-contiguous passage: "I also want to speak tonight directly to Muslims throughout the world. We respect your faith. It\'s practiced freely by many millions of Americans, and by millions more in countries that America counts as friends. Its teachings are good and peaceful, and those who commit evil in the name of Allah blaspheme the name of Allah." And, after an audience-applause interjection: "The terrorists are traitors to their own faith, trying, in effect, to hijack Islam itself. The enemy of America is not our many Muslim friends; it is not our many Arab friends. Our enemy is a radical network of terrorists, and every government that supports them." Why does Bush pair a declaration that "freedom itself is under attack" with a direct, deliberate message distinguishing Muslims and Islam from the "enemy," and what does that pairing reveal about the security-vs-rights debate this speech opened?',
      steps: [
        'SOURCE IT FIRST. Bush is addressing a joint session of Congress on live national television, September 20, 2001, nine days after the September 11 attacks, at a moment when the US government was defining both its security response and its official framing of the attackers.',
        'IDENTIFY THE SECURITY CLAIM. Bush frames the attacks in the broadest possible terms — not simply an attack on the United States, but "a world where freedom itself is under attack" — language that justifies treating the response as a large-scale, sustained security effort rather than a narrow law-enforcement matter.',
        'IDENTIFY THE RIGHTS-PROTECTING MESSAGE. In the same address, Bush explicitly separates "the terrorists" and "a radical network" from "our many Muslim friends" and "our many Arab friends," stating plainly that Muslims\' "teachings are good and peaceful" and that the terrorists "blaspheme the name of Allah" — a direct, deliberate effort to prevent the security response from becoming a broader claim against Muslims or Arabs as a group.',
        'CONNECT THE TWO TO THE SECURITY-VS-RIGHTS DEBATE. Pairing an expansive framing of the threat with an explicit, targeted effort to protect one group\'s standing from that same framing shows the tension at the center of the post-9/11 debate: how to mount a broad security response to a real threat without that response sliding into rights violations or discrimination against people who share an identity with the attackers rather than their actions.',
        'STATE THE LINK TO THE COURSE THESIS. This speech does not resolve the security-vs-rights debate — it opens it, in real time, by simultaneously escalating the security framing and attempting to limit that framing\'s reach, a genuine tension that continued (in debates over surveillance, detention, and civil liberties) well beyond this single address.',
      ],
      answer:
        'Bush frames the attacks in sweeping terms — declaring that "night fell on a different world, a world where freedom itself is under attack" — language that justifies a large-scale, sustained security response rather than a narrow law-enforcement matter. In the same address, he pairs that framing with an explicit, deliberate message distinguishing "our many Muslim friends" and "our many Arab friends" from "a radical network of terrorists," stating that Muslims\' "teachings are good and peaceful" and that the terrorists "blaspheme the name of Allah" and are "traitors to their own faith." That pairing reveals the core tension of the security-vs-rights debate this speech opened: an expansive security framing carries real risk of sliding into rights violations or discrimination against people who share an identity with the attackers rather than their actions, and Bush\'s explicit effort to separate the two shows that tension being managed, not resolved, in real time. The debate over how far security measures should extend without infringing on rights continued well beyond this address, in later controversies over surveillance, detention, and civil liberties.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE way global popular culture flowed in a direction other than "Western culture outward" after 1945. (b) Explain ONE specific human-rights movement (anti-apartheid OR global feminism) and its outcome. (c) Explain ONE way the September 11, 2001 attacks opened a debate over balancing security and rights.',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies a genuine non-Western-outward cultural flow — e.g. K-pop from South Korea, Bollywood from India, or football\'s global popularity rooted in multiple continents. No credit for a vague or unsupported claim.',
            modelResponse:
              'K-pop, a music and media genre originating in South Korea, became a global phenomenon with fan bases on every continent, showing that global popular culture did not flow only outward from the West.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate human-rights movement and a real outcome — e.g. the anti-apartheid movement contributing to the end of apartheid and South Africa\'s 1994 democratic elections, or global feminism\'s institutional expression at the 1995 Beijing conference. No credit for a vague or unconnected claim.',
            modelResponse:
              "The international anti-apartheid movement combined internal South African resistance with global pressure, including boycotts and diplomatic isolation, contributing to the end of apartheid and South Africa's first fully democratic elections in 1994.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate way 9/11 opened a security-vs-rights debate — e.g. expanded government surveillance/security powers prompting debate over civil liberties, or the tension between broad security framing and protecting the rights of Muslim/Arab communities. No credit for a vague or unsupported claim.',
            modelResponse:
              "The September 11 attacks led the US government to expand surveillance and security powers, which opened a genuine, ongoing debate over how far such measures should extend without infringing on civil liberties or unfairly targeting Muslim and Arab communities based on the attackers' shared identity rather than their actions.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-cultural-globalization-erases-local',
      kind: 'misconception_check',
      question:
        'True or false: cultural globalization after 1945 erased local cultures, replacing them with a single homogeneous global (mainly Western) culture.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming cultural globalization is a one-way process of homogenization that erases local culture, rather than a multidirectional process that usually produces blended, hybrid forms alongside — not instead of — local culture.',
          correctsTo:
            "FALSE. The dominant pattern is cultural HYBRIDITY, not erasure. Global popular culture flowed outward from multiple centers, not just the West: Bollywood from India, K-pop from South Korea, football rooted across Europe, Latin America, Africa, and Asia. Local cultures generally blended with global influences — adapting, adopting, and re-exporting cultural forms — rather than simply disappearing. Religious revival movements across multiple faiths in the same era show local and traditional identities remaining, and in some cases strengthening, even as global cultural exchange intensified. Cultural globalization is better described as producing hybrid, blended forms in many directions at once than as a single culture erasing all others.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The UDHR (1948) proclaimed rights belonging to "all members of the human family" — a universal claim, not legally binding alone but foundational to later rights treaties and movements.',
        'Global popular culture flowed from multiple centers — Bollywood (India), K-pop (South Korea), football (rooted across several continents) — not only outward from the West.',
        "The anti-apartheid movement (ending 1994) and global feminism (institutionalized at Beijing, 1995) show postwar human-rights claims translating into real political movements and outcomes.",
        'Migration and refugee movements, driven by decolonization, conflict, and economic opportunity, produced persistent, genuinely contested political debates in receiving countries.',
        'September 11, 2001 opened an ongoing, documented debate over balancing security measures against civil liberties and against the rights of Muslim and Arab communities — a tension Bush\'s own address both escalated and tried to limit.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '9',
    cedTopic: '9.8-9.9',
    cedTitle: 'Global Culture, Human Rights, and Migration',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-udhr.v1',
        chapter: '1948',
        note: 'Universal Declaration of Human Rights (Preamble; Articles 1-2) — anchor document for the postwar universal-rights framework (reused from Unit 8).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-bush-sept-2001.v1',
        chapter: '2001',
        note: "Bush's September 20, 2001 address — anchor document for the globalized security-vs-rights debate after 9/11 (reused from the APUSH catalog).",
      },
    ],
  },
};
