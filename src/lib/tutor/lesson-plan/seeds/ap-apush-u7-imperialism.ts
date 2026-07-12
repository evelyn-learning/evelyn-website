/**
 * AP US History — CED Unit 7.2-7.3: American Imperialism.
 *
 * Period-7 fan-out content plan (follows the causes-of-revolution
 * calibration template — see ap-apush-u3-causes-of-revolution.ts for the
 * full rationale and docs/superpowers/specs/2026-07-10-ap-us-history-design.md
 * for the shared Passage/rubric infra this plan reuses).
 *
 * Opens Period 7's arc: the motives (economic, strategic, ideological) for
 * American overseas expansion, the Spanish-American War and its
 * territorial consequences, the Philippine-American War, anti-imperialist
 * opposition, the Open Door Policy in China, and the Panama Canal —
 * anchored by Theodore Roosevelt's "international police power" corollary
 * to the Monroe Doctrine (1904).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U7_IMPERIALISM: LessonPlan = {
  id: 'evelyn.ap.apush.imperialism.v1',
  title: 'U7.2-7.3 American Imperialism',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.imperialism',
      description:
        'Explain the economic, strategic, and ideological motives for American overseas expansion; explain the causes and consequences of the Spanish-American War and the Philippine-American War, including the Platt Amendment and anti-imperialist opposition; and explain the Open Door Policy and the acquisition of the Panama Canal Zone.',
      standard: 'AP-APUSH-7.2',
    },
  ],
  prerequisites: ['apush.gilded-politics-populism', 'apush.industrialization-big-business'],
  followUps: ['apush.progressivism'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see 1898 as the year the United States pivots from a continental power to an overseas one, and to see that pivot as contested at the time, not inevitable.',
      script:
        "In 1897, the United States owned no territory outside North America. By the end of 1898, it controlled Puerto Rico, Guam, and the Philippines, had annexed Hawaii, and was treating Cuba as a protectorate. That is an extraordinary amount of overseas expansion to happen in a single year — and it did not happen because Americans suddenly agreed expansion was a good idea. A serious, organized opposition movement — including some of the most famous people in the country — argued the entire project betrayed everything the United States was supposed to stand for. Today we're tracing why the U.S. reached overseas in the first place, how a war with Spain turned into an American empire, and why that empire was controversial from the moment it existed.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-imperialism',
      kind: 'concept',
      goal: 'Explain the motives for American overseas expansion, the Spanish-American and Philippine-American Wars and their consequences, anti-imperialist opposition, and the Open Door Policy and Panama Canal.',
      keyIdeas: [
        'MOTIVES FOR EXPANSION COMBINED THREE STRANDS: ECONOMIC (American industry, having matured after the Gilded Age, sought new overseas markets for its surplus output and sources of raw materials), STRATEGIC (naval theorist Alfred Thayer Mahan\'s "The Influence of Sea Power upon History" (1890) argued that great-power status required a modern navy and the overseas coaling stations and bases to support it), and IDEOLOGICAL (social-Darwinist and Anglo-Saxonist arguments framed expansion as a "civilizing mission," alongside a genuine missionary impulse to spread Christianity and American institutions).',
        'HAWAII: American businessmen, backed by U.S. Marines, overthrew Queen Liliuokalani in 1893; the United States formally annexed Hawaii in 1898 amid the broader wave of expansion, gaining a valuable mid-Pacific naval and coaling station.',
        'THE SPANISH-AMERICAN WAR (1898): a Cuban revolt against Spanish colonial rule, inflammatory ("yellow") press coverage of Spanish repression, and the unexplained explosion of the battleship USS Maine in Havana harbor (February 1898) pushed the United States into a short war against Spain that ended in a decisive American victory within months.',
        'THE TREATY OF PARIS (1898) AND ITS TERRITORIES: the peace treaty transferred Puerto Rico and Guam to the United States and ceded the Philippines to the U.S. for $20 million; Cuba was granted nominal independence but forced to accept the PLATT AMENDMENT (1901) into its own constitution, which allowed U.S. intervention in Cuban affairs and secured a permanent U.S. naval base at Guantanamo Bay — real but sharply limited sovereignty.',
        'THE PHILIPPINE-AMERICAN WAR (1899-1902): Filipino nationalists under Emilio Aguinaldo, who had fought Spain expecting independence, instead fought a prolonged, brutal guerrilla war against American occupation. The United States ultimately prevailed and governed the Philippines as a colony until independence was finally granted in 1946.',
        'ANTI-IMPERIALIST OPPOSITION WAS REAL AND ORGANIZED: the American Anti-Imperialist League — whose members included Mark Twain, Andrew Carnegie, and Samuel Gompers — argued that ruling overseas colonies without the consent of the governed directly contradicted America\'s own founding principles of self-government. The Treaty of Paris narrowly passed the Senate in 1899 only after a genuine political fight, not a rubber-stamp vote.',
        'THE OPEN DOOR POLICY (1899-1900): rather than carve out a formal American colony in China, as European powers and Japan were doing, Secretary of State John Hay issued the Open Door Notes, asking the other powers to preserve equal trading access to China for all nations and (in a later note) China\'s territorial integrity — an American preference for commercial access over direct colonial rule in East Asia.',
        'PANAMA AND THE CANAL: seeking a shortcut between the Atlantic and Pacific for both commercial and naval purposes, the United States backed a 1903 Panamanian revolt against Colombia (which had rejected American canal terms), quickly recognized the new Panamanian government, and secured rights to build the Panama Canal, which opened in 1914.',
      ],
      vocabulary: [
        {
          term: "Mahan's naval strategy",
          definition:
            'Alfred Thayer Mahan\'s argument (1890) that great-power status required a modern navy and the overseas coaling stations/bases needed to support it — an intellectual foundation for American naval expansion and overseas basing.',
        },
        {
          term: 'Platt Amendment (1901)',
          definition:
            "provision forced into Cuba's own constitution allowing U.S. intervention in Cuban affairs and securing a permanent U.S. naval base at Guantanamo Bay — Cuban independence was real but sharply limited.",
        },
        {
          term: 'Open Door Policy',
          definition:
            "Secretary of State John Hay's 1899-1900 notes asking other powers to preserve equal trading access to China (and later its territorial integrity), rather than the U.S. carving out its own formal Chinese colony.",
        },
        {
          term: 'Roosevelt Corollary (1904)',
          definition:
            'Theodore Roosevelt\'s extension of the Monroe Doctrine asserting the U.S. could exercise an "international police power" in the Western Hemisphere when a nation\'s "chronic wrongdoing" threatened stability.',
        },
        {
          term: 'American Anti-Imperialist League',
          definition:
            'organization (members included Mark Twain, Andrew Carnegie, and Samuel Gompers) that opposed American overseas colonial rule as a betrayal of the principle of government by consent of the governed.',
        },
      ],
      passageId: 'evelyn.passage.apush-roosevelt-corollary.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-roosevelt-corollary',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from Theodore Roosevelt\'s Fourth Annual Message to Congress (December 1904): "Chronic wrongdoing, or an impotence which results in a general loosening of the ties of civilized society, may in America, as elsewhere, ultimately require intervention by some civilized nation, and in the Western Hemisphere the adherence of the United States to the Monroe Doctrine may force the United States, however reluctantly, in flagrant cases of such wrongdoing or impotence, to the exercise of an international police power." What argument is Roosevelt making, and how does it extend earlier American foreign policy?',
      steps: [
        'SOURCE IT FIRST. Theodore Roosevelt, Fourth Annual Message to Congress, December 1904 — an official presidential statement of policy, delivered a year after the U.S. secured the Panama Canal rights and amid ongoing American involvement in Caribbean and Central American affairs.',
        'IDENTIFY THE CLAIM. Roosevelt argues that "chronic wrongdoing" or "impotence" by a Western Hemisphere nation — instability serious enough to invite European intervention — may force the United States to exercise an "international police power" in that nation\'s affairs, however reluctantly.',
        'CONNECT TO THE MONROE DOCTRINE. The original 1823 Monroe Doctrine warned European powers against further colonization or intervention in the Western Hemisphere. Roosevelt explicitly ties his argument to "the adherence of the United States to the Monroe Doctrine" — but he transforms a doctrine of exclusion (keeping Europe OUT) into a doctrine of assertive intervention (the U.S. stepping IN) — a real expansion of the original idea, not merely a restatement of it.',
        'CONNECT TO THE PERIOD\'S MOTIVES. This is the strategic and economic logic of imperialism applied specifically to the Western Hemisphere: preventing European intervention (which might threaten U.S. strategic interests, including the newly secured Panama Canal route) by asserting the U.S.\'s own right to intervene first.',
        'NOTE THE CAREFUL FRAMING. Roosevelt frames the "police power" as a reluctant last resort ("however reluctantly," "in flagrant cases") rather than a routine tool — rhetoric that presents an assertive, and to critics coercive, policy in restrained, responsible-sounding terms.',
        'STATE THE LINK TO THE COURSE THESIS. The Roosevelt Corollary shows the same expansionist and strategic motives that drove the Spanish-American War and the Panama Canal being formalized into a standing doctrine, one the United States invoked repeatedly to justify interventions in the Caribbean and Central America over the following decades.',
      ],
      answer:
        'Roosevelt argues that "chronic wrongdoing" or serious instability by a Western Hemisphere nation may force the United States, as a matter of upholding the Monroe Doctrine, to exercise an "international police power" over that nation\'s affairs. This extends the original 1823 Monroe Doctrine — which only warned European powers against intervening in the hemisphere — into a doctrine of assertive American intervention: instead of just keeping Europe out, the U.S. now claims the right to step in itself, partly to prevent the instability that might otherwise invite European intervention and threaten strategic U.S. interests like the newly secured Panama Canal route. Roosevelt\'s careful language ("however reluctantly," "flagrant cases") frames this expansive claim as a restrained last resort, but the corollary nonetheless became the standing justification for repeated U.S. interventions in the Caribbean and Central America in the following decades.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE motive for American overseas expansion in this era. (b) Briefly explain ONE specific event or policy that illustrates that motive in action. (c) Briefly explain ONE objection raised by American anti-imperialists to U.S. overseas expansion.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine motive for expansion — e.g. the search for overseas markets and raw materials, Mahan\'s naval-power argument for bases and coaling stations, or social-Darwinist/missionary "civilizing mission" ideology. No credit for a vague statement ("America wanted to be powerful") with no specific motive named.',
            modelResponse:
              'One motive for American overseas expansion was the strategic argument, associated with naval theorist Alfred Thayer Mahan, that great-power status required a modern navy and the overseas coaling stations and bases needed to support it.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific event or policy (Spanish-American War, Philippine-American War, Platt Amendment, Open Door Notes, Panama Canal acquisition) and connects it clearly to the motive named in (a). No credit for evidence unconnected to the stated motive.",
            modelResponse:
              "The United States backed a 1903 Panamanian revolt against Colombia and quickly secured rights to build the Panama Canal, gaining a strategically vital shortcut between the Atlantic and Pacific for both naval and commercial shipping — directly serving the strategic motive for a stronger, better-based American navy.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate anti-imperialist objection — e.g. that ruling colonies without the consent of the governed contradicted American founding principles of self-government, or that overseas empire risked entangling the U.S. in prolonged conflicts like the Philippine-American War. No credit for a vague or unsupported claim.',
            modelResponse:
              "Members of the American Anti-Imperialist League, including Mark Twain and Andrew Carnegie, argued that ruling the Philippines and other territories as colonies without the consent of the governed directly contradicted the founding American principle of self-government, making overseas empire a betrayal of the nation's own values rather than an expression of them.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-universally-popular',
      kind: 'misconception_check',
      question:
        'True or false: American imperialism at the turn of the twentieth century was universally popular, with little serious domestic opposition.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Assuming a policy that ultimately succeeded (territorial acquisition) faced no serious contemporary opposition, rather than recognizing genuine, organized political conflict over it.',
          correctsTo:
            'FALSE. American overseas expansion was genuinely controversial. The American Anti-Imperialist League — whose members included prominent figures like Mark Twain, Andrew Carnegie, and Samuel Gompers — organized specifically to oppose acquiring and ruling territories like the Philippines, arguing it contradicted the American principle of government by consent of the governed. The Treaty of Paris (1898), which ceded the Philippines to the United States, passed the Senate only narrowly in 1899 after a real political fight, not as a formality. The subsequent Philippine-American War (1899-1902), a prolonged and costly guerrilla conflict, further fueled domestic criticism of the imperial project. The AP exam rewards recognizing that expansion was a contested political choice, not a policy everyone agreed with.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Expansion combined economic (new markets/raw materials), strategic (Mahan\'s naval-power argument), and ideological (social-Darwinist "civilizing mission") motives.',
        'The Spanish-American War (1898) — triggered by the Cuban revolt, yellow journalism, and the USS Maine explosion — brought Puerto Rico, Guam, and the Philippines under U.S. control and made Cuba a limited protectorate under the Platt Amendment (1901).',
        'The Philippine-American War (1899-1902) showed U.S. rule was resisted, not welcomed, by Filipino nationalists under Aguinaldo; the American Anti-Imperialist League organized real domestic opposition to overseas empire.',
        'The Open Door Policy (1899-1900) sought equal trading access to China rather than a formal U.S. colony there; the Panama Canal (secured 1903, opened 1914) served strategic and commercial goals.',
        'The Roosevelt Corollary (1904) transformed the Monroe Doctrine from a policy of exclusion into a doctrine of assertive U.S. intervention ("international police power") in the Western Hemisphere.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '7',
    cedTopic: '7.2-7.3',
    cedTitle: 'American Imperialism',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-roosevelt-corollary.v1',
        chapter: '1904',
        note: 'Theodore Roosevelt, Fourth Annual Message to Congress — anchor document for the Roosevelt Corollary\'s "international police power" claim.',
      },
    ],
  },
};
