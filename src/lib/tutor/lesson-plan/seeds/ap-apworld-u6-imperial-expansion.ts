/**
 * AP World History: Modern — CED Unit 6.1/6.2: Ideologies and Tools of
 * Imperial Expansion.
 *
 * Follows the Silk Roads calibration template
 * (`ap-apworld-u2-silk-roads.ts`). concept = the historical argument (what
 * ideologies did European powers use to justify formal territorial
 * expansion after 1750, and what tools made rapid conquest possible?);
 * worked_example = annotated document analysis of the Berlin Conference's
 * regulatory clauses; try_yourself = a 3-point SAQ-style short-answer.
 *
 * Anchor text (concept): Rudyard Kipling, "The White Man's Burden" (1899) —
 * evelyn.passage.apworld-white-mans-burden.v1, presented as a primary source
 * OF civilizing-mission ideology (critical distance, not an endorsement).
 * Anchor text (worked example): General Act of the Berlin Conference (1885)
 * — evelyn.passage.apworld-berlin-act.v1, quoted only as the excerpt already
 * seeded (Article 5 free-trade clause; Articles 34-35 "effective
 * occupation" declaration).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APWORLD_U6_IMPERIAL_EXPANSION: LessonPlan = {
  id: 'evelyn.ap.apworld.imperial-expansion.v1',
  title: 'U6.1 Ideologies and Tools of Imperial Expansion',
  curriculum: 'AP',
  grade: '10',
  subject: 'ss',
  topic: 'ap-world-history',
  locale: 'en',
  los: [
    {
      id: 'apworld.imperial-expansion',
      description:
        'Explain the ideologies used to justify European imperial expansion and the technological and administrative tools that enabled the rapid territorial conquest of Africa and Asia in the period 1750-1900.',
      standard: 'AP-APWORLD-6.1',
    },
  ],
  prerequisites: [],
  followUps: ['apworld.imperial-resistance'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the speed and scale of the late-19th-century Scramble for Africa feel surprising, and set up the question of HOW such rapid conquest of huge, populous regions became possible.',
      script:
        "In 1870, European powers directly controlled maybe a tenth of the African continent — mostly coastal trading posts. By 1900, they controlled nearly all of it. That is one of the fastest changes in political control over that much territory and that many people in world history. It didn't happen because Europeans suddenly became far more numerous or wealthier than the states and empires they were conquering — Asante, the Sokoto Caliphate, Ethiopia, and the Qing Empire were all substantial, organized states. It happened because of a specific combination: new technologies that neutralized old disadvantages (disease, distance, firepower), and a set of ideological arguments that let conquest be framed, at home, as something other than naked land-grabbing. Today we take both apart — the tools, and the stories powers told about why they were using them.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-imperial-expansion',
      kind: 'concept',
      goal: "Explain the civilizing-mission and Social Darwinist ideologies used to justify formal imperial expansion, the technological tools (quinine, steamships, the Maxim gun) that enabled it, and the Scramble for Africa and India's Company-to-Raj transition as its two headline cases, 1750-1900.",
      keyIdeas: [
        "\"NEW IMPERIALISM\" (roughly 1870s-1914) is distinct from the earlier mercantile empires of 1450-1750: it meant direct, formal territorial rule over huge new areas of Africa and Asia, backed by industrial-era military and administrative power, and justified by a new set of ideological arguments rather than purely commercial motives.",
        "THE CIVILIZING MISSION (mission civilisatrice) was the claim that colonizing powers had a paternalistic DUTY to govern, Christianize, and \"improve\" colonized peoples, who were cast as unable to govern themselves. Rudyard Kipling's 1899 poem \"The White Man's Burden\" is the era's most widely read statement of this argument: it urges the reader to \"Take up the White Man's burden\" and \"seek another's profit, / And work another's gain\" — imperial rule reframed as a costly, thankless service performed FOR the colonized, not a taking. Kipling wrote it to urge the United States to take up colonial rule in the Philippines after the Spanish-American War; study it as a primary source revealing how imperial ideology represented itself, not as an accurate description of colonized peoples or of what colonial rule actually did.",
        "The poem also shows the RACIAL HIERARCHY built into that ideology: it describes colonized populations as \"Your new-caught, sullen peoples, / Half-devil and half-child\" — language that treats conquered peoples as simultaneously dangerous and immature, needing outside control. Reading this critically (not endorsing it) is the point: the AP exam expects you to analyze such language as evidence of the ERA'S ideology, and to be able to name it as paternalistic and racialized.",
        'SOCIAL DARWINISM was a second, related ideology: a misapplication of Darwin\'s biological theory of natural selection to nations and "races," framing conquest as evidence that the conquering power was simply more "fit" to survive and dominate. It gave imperial competition a pseudo-scientific gloss — a claim to be describing natural law rather than making a political choice.',
        'TOOLS OF EMPIRE made rapid conquest of huge, disease-prone, and previously inaccessible territories logistically possible: QUININE (derived from cinchona bark) let European soldiers and administrators survive prolonged exposure to malaria in tropical Africa, removing a disease barrier that had kept earlier European presence largely coastal; STEAMSHIPS, including shallow-draft river steamers, let colonial forces and traders penetrate deep inland along rivers like the Congo and Niger instead of depending on coastal ports; and the MAXIM GUN (the first practical, portable, rapid-firing machine gun, from the 1880s) gave small European forces a decisive firepower advantage in battles against much larger African and Asian armies.',
        'THE SCRAMBLE FOR AFRICA (roughly 1881-1914) was the rapid partition of nearly the entire African continent among European powers — by 1914 only Ethiopia and Liberia remained outside formal European control. It was driven by industrial-era competition for raw materials and markets, national prestige rivalries among European powers, and the ideologies above providing public justification.',
        "THE BERLIN CONFERENCE (1884-85), hosted by German Chancellor Otto von Bismarck with NO African rulers or representatives present, did not itself colonize anything — it set RULES among the European powers for how they would carve up and recognize each other's African claims, including a free-trade requirement for the Congo basin and a declaration that a claim would only be recognized if backed by \"effective occupation\" (actual, notified administrative presence), not just a flag on a map. This regulated the PACE and MANNER of the Scramble among competing European claimants.",
        "INDIA shows a different mechanism of expansion: from COMPANY TO RAJ. The British East India Company had ruled large parts of India as a chartered commercial company for a century before the 1857 Sepoy Rebellion (covered in the next topic) led the British Crown to dissolve Company rule in 1858 and assume direct, formal governmental control — the British Raj. This traces one path to \"new imperialism\": an originally commercial, indirect presence hardening into direct territorial rule.",
        'SETTLER COLONIES differed from colonies of rule like India or most of tropical Africa: places like Algeria (French settlement) or Kenya\'s highlands (British settlement) saw substantial permanent European populations settle on and often expropriate land, marginalizing indigenous populations economically and politically in ways that went beyond administrative extraction.',
      ],
      vocabulary: [
        {
          term: 'civilizing mission',
          definition:
            'the ideological claim that colonizing powers had a paternalistic duty to govern, Christianize, and "improve" colonized peoples — reframing conquest and rule as a service performed for, not a taking from, the colonized.',
        },
        {
          term: 'Social Darwinism',
          definition:
            'a misapplication of Darwin\'s biological theory of natural selection to nations and "races," used to frame imperial conquest as evidence of the conquering power\'s natural fitness to dominate.',
        },
        {
          term: 'effective occupation',
          definition:
            "the Berlin Conference's requirement (Chapter VI) that a European power's claim to African coastal territory be recognized by other powers only if backed by actual, notified administrative authority — not merely a declared claim.",
        },
        {
          term: 'Scramble for Africa',
          definition:
            'the rapid partition of nearly the entire African continent among European colonial powers, roughly 1881-1914, leaving only Ethiopia and Liberia outside formal European control by 1914.',
        },
      ],
      passageId: 'evelyn.passage.apworld-white-mans-burden.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-berlin-act',
      kind: 'worked_example',
      problem:
        'Analyze these excerpts from the General Act of the Berlin Conference on West Africa (1885): "Article 5 [...] No Power which exercises or shall exercise sovereign rights in the abovementioned regions shall be allowed to grant therein a monopoly or favour of any kind in matters of trade." and "Article 34 Any Power which henceforth takes possession of a tract of land on the coasts of the African continent outside of its present possessions, or which, being hitherto without such possessions, shall acquire them, as well as the Power which assumes a Protectorate there, shall accompany the respective act with a notification thereof, addressed to the other Signatory Powers of the present Act, in order to enable them, if need be, to make good any claims of their own. Article 35 The Signatory Powers of the present Act recognize the obligation to insure the establishment of authority in the regions occupied by them on the coasts of the African continent sufficient to protect existing rights, and, as the case may be, freedom of trade and of transit under the conditions agreed upon." What does this reveal about how the Scramble for Africa was regulated, and among whom?',
      steps: [
        'SOURCE IT FIRST. Who, when, why? The General Act was signed 26 February 1885 by fourteen powers, the Ottoman Empire among them, at a conference hosted by Bismarck in Berlin. No African state, ruler, or representative was present or party to it — a critical fact for reading what this document can and cannot tell us.',
        'IDENTIFY THE CLAIM. Article 5 bars any power exercising sovereignty in the Congo basin from granting "a monopoly or favour of any kind in matters of trade" — a free-trade rule binding on the SIGNATORY POWERS. Articles 34-35 require any power taking new African coastal territory to "notif[y]... the other Signatory Powers" and to actually "insure the establishment of authority" sufficient to protect rights and trade — not just declare a claim on paper.',
        'CONNECT TO THE REGULATION-AMONG-RIVALS CAUSE. Both clauses regulate competition BETWEEN European claimants, not relations between Europeans and Africans: Article 5 prevents any one power from locking out its rivals\' merchants once it controls the Congo basin; Articles 34-35 (\"effective occupation\") prevent a power from blocking rivals\' claims with an unbacked declaration, forcing claims to be backed by real, notified administrative presence.',
        'WEIGH WHAT THE DOCUMENT CANNOT TELL YOU. Because no African government or people is a party to the Act, it cannot be read as evidence of African consent, participation, or even awareness of these rules — it is solely a set of rules the European (and American) signatories imposed on THEMSELVES, to manage their own scramble for territory, over land whose existing inhabitants and polities were not consulted.',
        'CONNECT TO THE BROADER SCRAMBLE. "Effective occupation" is exactly why the Scramble moved as fast and as thoroughly as it did after 1885: a mere claim was no longer enough to hold territory against a rival power, so European governments raced to establish real administrative presence across the continent, accelerating formal conquest.',
        "STATE THE LINK TO THE COURSE THESIS. This document is direct evidence for the concept's claim that European expansion was regulated among the imperial powers themselves — Berlin didn't authorize colonization in some moral sense, it set the competitive rules under which the Scramble for Africa proceeded, with African polities and peoples entirely outside the negotiation.",
      ],
      answer:
        'The Berlin Act\'s Article 5 (barring trade monopolies in the Congo basin) and Articles 34-35 ("effective occupation") are rules the European and American signatories imposed on THEMSELVES to manage their own competition for African territory — no African government or ruler was a party to the Act. Article 5 kept the Congo basin open to all signatories\' merchants; "effective occupation" meant a claim only counted if backed by real, notified administrative presence, which is exactly why the Scramble accelerated so sharply after 1885: unbacked claims no longer held against a rival power. The document is strong evidence for how the Scramble was REGULATED among European rivals, and equally strong evidence of what it cannot show — any form of African consent or participation, since none of the affected African polities were represented at the conference.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        'SAQ practice. (a) Identify ONE ideology used to justify European imperial expansion, 1750-1900. (b) Explain how ONE technological or administrative tool enabled the rapid conquest of a large territory in this period. (c) Explain ONE way India\'s transition from East India Company rule to the British Raj illustrates a broader pattern of "new imperialism."',
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies ONE genuine imperial-era ideology — e.g. the civilizing mission or Social Darwinism. No credit for a vague statement with no identifiable specific ideology, or for an anachronistic/incorrect item.',
            modelResponse:
              'One ideology used to justify European imperial expansion was the civilizing mission, the claim that colonizing powers had a paternalistic duty to govern and "improve" colonized peoples.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate mechanism by which the named tool (e.g. quinine, steamships, the Maxim gun, or "effective occupation") enabled rapid territorial conquest. No credit for an explanation disconnected from a real tool of empire.',
            modelResponse:
              'Because quinine, derived from cinchona bark, let European soldiers and administrators survive prolonged exposure to malaria, it removed a disease barrier that had previously confined most European presence in Africa to coastal trading posts, allowing sustained penetration and occupation of the interior.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains how the Company-to-Raj transition (an originally commercial presence hardening into direct Crown rule after the 1857 rebellion) reflects the broader shift toward formal territorial control characteristic of new imperialism. No credit for a vague or unsupported claim.",
            modelResponse:
              "India's shift from East India Company rule to the British Raj in 1858 shows a broader pattern of new imperialism in which an originally commercial or indirect European presence hardened into direct, formal governmental control over vast new territory, rather than remaining limited to trade.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-technology-alone',
      kind: 'misconception_check',
      question:
        'True or false: European powers colonized Africa and Asia so quickly and completely purely because of their technological advantage — African and Asian political divisions and alliances had little to do with it.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Crediting tools like the Maxim gun and quinine as the SOLE explanation for the speed of conquest, missing that the AP exam expects a multi-causal account in which African and Asian political fragmentation and local alliances were just as essential to how conquest actually proceeded region by region.',
          correctsTo:
            "FALSE. Technology (quinine, steamships, the Maxim gun) was necessary but not sufficient. European forces were frequently small; they conquered as fast and as thoroughly as they did in large part because African and Asian regions were often politically fragmented into competing states, kingdoms, and factions, and because European powers actively recruited local allies, rival rulers, and auxiliary troops who fought alongside them for their own reasons (rivalry with a neighboring state, internal succession disputes, or perceived advantage). Where states were more unified and could deny European forces local allies — as Ethiopia demonstrated at Adwa in 1896 (next topic) — technological advantage alone did not guarantee a European victory. Explaining the speed of conquest requires combining the tools-of-empire story with the political-fragmentation-and-local-alliances story, not treating either alone as sufficient.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The civilizing mission and Social Darwinism were the two dominant ideologies used to justify formal imperial expansion — study Kipling\'s "White Man\'s Burden" as a primary source OF that ideology, not an endorsement of it.',
        'Quinine, steamships, and the Maxim gun were the key technological tools that let small European forces rapidly conquer and occupy huge, previously inaccessible territories.',
        'The Berlin Conference (1884-85) regulated competition AMONG European powers over Africa (free trade, "effective occupation") — no African government was present or party to it.',
        "India's shift from East India Company rule to the British Raj (1858) traces one path to new imperialism: a commercial presence hardening into direct formal rule.",
        'Conquest also depended on African/Asian political fragmentation and local allies, not technology alone — a key corrective to a purely technological explanation.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.1-6.2',
    cedTitle: 'Ideologies and Tools of Imperial Expansion',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP World History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-white-mans-burden.v1',
        chapter: '1899',
        note: 'Rudyard Kipling, "The White Man\'s Burden" — primary source of civilizing-mission ideology (critical distance, non-endorsing).',
      },
      {
        type: 'passage',
        book: 'evelyn.passage.apworld-berlin-act.v1',
        chapter: '1885',
        note: 'General Act of the Berlin Conference — anchor document for the worked example on regulating the Scramble for Africa among European powers.',
      },
    ],
  },
};
