/**
 * AP US History — CED Unit 4.8-4.9: Jacksonian Democracy.
 *
 * Period-4 content plan (follows the causes-of-revolution calibration
 * template — see ap-apush-u3-causes-of-revolution.ts for the full
 * rationale). Covers expanded white male suffrage and the spoils
 * system, the Bank War (Jackson's veto of the Second Bank's recharter),
 * the nullification crisis, and Indian Removal (the Trail of Tears and
 * Worcester v. Georgia) — the last discussed in measured, exam-neutral
 * tone per the Global Constraints.
 *
 * Anchor text: Andrew Jackson, Bank Veto Message (1832) —
 * evelyn.passage.apush-jackson-bank-veto.v1. Teaching point is Jackson's
 * populist framing of the Bank as a tool of "the rich and powerful"
 * (quoted only as the short excerpt already seeded; note the source
 * transcript renders dashes as bare hyphens, reproduced faithfully).
 *
 * Two misconception_check segments (the period block lists two distinct
 * traps for this plan): the myth that Jacksonian democracy extended
 * political rights to everyone, and the myth that the Bank veto was an
 * economically neutral policy dispute.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U4_JACKSONIAN_DEMOCRACY: LessonPlan = {
  id: 'evelyn.ap.apush.jacksonian-democracy.v1',
  title: 'U4.8 Jacksonian Democracy',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.jacksonian-democracy',
      description:
        'Explain the expansion of white male suffrage and the spoils system, the causes and effects of the Bank War and the nullification crisis, and the policy and human consequences of Indian Removal, including Worcester v. Georgia and the Trail of Tears.',
      standard: 'AP-APUSH-4.8',
    },
  ],
  prerequisites: ['apush.market-revolution'],
  followUps: ['apush.reform-awakening'],
  estimatedMinutes: 24,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame Jackson as a genuinely popular president who expanded political participation for some Americans while overseeing policies that dispossessed and excluded others.',
      script:
        "By the late 1820s, states were tearing down property requirements for voting, and huge crowds packed Andrew Jackson's inauguration — so many that they reportedly stood on White House furniture to get a better view of the new, self-styled \"people's president.\" Jackson genuinely expanded political participation for a large group of Americans. But that same Jackson, in the same years, vetoed the recharter of the national bank as a tool of privilege for the wealthy few, faced down a state that claimed the right to ignore federal law, and forced tens of thousands of Native Americans from their homelands — including defying a Supreme Court ruling that had sided against him. \"Democracy\" and \"exclusion\" expanded together. Today we're tracing both halves of that story.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-jacksonian-democracy',
      kind: 'concept',
      goal: 'Explain expanded white male suffrage and the spoils system, the Bank War, the nullification crisis, and Indian Removal.',
      keyIdeas: [
        "EXPANDED WHITE MALE SUFFRAGE: by the late 1820s and 1830s, most states had eliminated property-ownership requirements for voting, dramatically expanding the electorate — but ONLY for white men. Free Black men, in most states, faced growing restrictions on voting during this same period, and women of any race could not vote at all. \"Jacksonian democracy\" describes an expansion of political participation among white men specifically, alongside continued or worsening exclusion of others.",
        'THE SPOILS SYSTEM: Jackson replaced large numbers of federal officeholders with his own political supporters upon taking office, a practice his supporters defended as democratizing government service (rotating "the people" through office rather than a permanent elite) and critics condemned as rewarding party loyalty over competence.',
        'THE BANK WAR: Jackson viewed the Second Bank of the United States as an unaccountable institution serving wealthy elites and financial insiders at ordinary Americans\' expense. When Congress, prompted by Jackson\'s opponents, moved to recharter the Bank early (1832), Jackson vetoed it in populist terms — casting the Bank as a tool that let "the rich and powerful" bend government to their advantage. The veto was a central, defining issue of Jackson\'s decisive 1832 reelection victory.',
        'THE NULLIFICATION CRISIS (1832-33): South Carolina, angered by a high protective tariff it argued unfairly burdened the South, declared the tariff null and void within the state (the doctrine of NULLIFICATION, associated with Vice President John C. Calhoun) and threatened secession if the federal government tried to enforce it. Jackson — despite his states\'-rights sympathies on other issues — responded forcefully, obtaining the Force Bill authorizing federal enforcement, while Congress also passed a compromise tariff that lowered rates enough to defuse the immediate crisis.',
        "INDIAN REMOVAL — POLICY: the Indian Removal Act (1830) authorized the federal government to negotiate (and, in practice, coerce) treaties relocating Native American nations from the Southeast to territory west of the Mississippi. The Cherokee Nation challenged Georgia's authority over their lands in Worcester v. Georgia (1832); the Supreme Court ruled in the Cherokees' favor, holding that Georgia's laws had no force within Cherokee territory. Jackson's administration did not enforce the ruling, and the removal proceeded.",
        "INDIAN REMOVAL — HUMAN CONSEQUENCES: in the late 1830s, the forced relocation of the Cherokee and other nations — remembered as the TRAIL OF TEARS — resulted in thousands of deaths from exposure, disease, and starvation during the journey west. This is a documented human catastrophe with immense, lasting costs for the affected nations, discussed here in factual, measured terms rather than dramatized detail.",
      ],
      vocabulary: [
        {
          term: 'spoils system',
          definition:
            "the practice of a newly elected administration replacing federal officeholders with its own political supporters; expanded significantly under Jackson.",
        },
        {
          term: 'Bank War',
          definition:
            "Jackson's political and policy fight against the Second Bank of the United States, culminating in his 1832 veto of its recharter on the grounds that it served wealthy elites over ordinary Americans.",
        },
        {
          term: 'nullification',
          definition:
            "the doctrine, asserted by South Carolina in 1832-33 (associated with John C. Calhoun), that a state could declare a federal law void within its borders; defused by a combination of the Force Bill and a compromise tariff.",
        },
        {
          term: 'Indian Removal Act (1830)',
          definition:
            "federal law authorizing the government to negotiate and enforce the relocation of Native American nations from the Southeast to territory west of the Mississippi.",
        },
        {
          term: 'Worcester v. Georgia (1832)',
          definition:
            "Supreme Court ruling that Georgia's laws had no force within Cherokee territory; the Jackson administration did not enforce the decision, and removal proceeded regardless.",
        },
      ],
      passageId: 'evelyn.passage.apush-jackson-bank-veto.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-bank-veto',
      kind: 'worked_example',
      problem:
        "Analyze this excerpt from Jackson's Bank Veto Message (July 10, 1832): \"It is to be regretted that the rich and powerful too often bend the acts of government to their selfish purposes... but when the laws undertake to add to these natural and just advantages artificial distinctions, to grant titles, gratuities, and exclusive privileges, to make the rich richer and the potent more powerful, the humble members of society-the farmers, mechanics, and laborers-who have neither the time nor the means of securing like favors to themselves, have a right to complain of the injustice of their Government.\" What is Jackson arguing, and why was this framing politically effective?",
      steps: [
        'SOURCE IT FIRST. Andrew Jackson, July 10, 1832 — vetoing an early bill to recharter the Second Bank of the United States, in the middle of his reelection campaign against Bank supporter Henry Clay.',
        'IDENTIFY THE CLAIM. Jackson does not argue that distinctions in wealth or status are inherently wrong — he explicitly says such distinctions "will always exist under every just government." His objection is narrower and sharper: government should not ADD to natural advantages by granting "artificial distinctions" like exclusive privileges (such as the Bank\'s special charter) that make the already rich and powerful richer still.',
        'IDENTIFY WHO HE CLAIMS TO SPEAK FOR. Jackson explicitly names "the humble members of society-the farmers, mechanics, and laborers" as the people harmed by this kind of government-granted privilege, framing the Bank veto as defending ordinary working Americans against an entrenched financial elite.',
        "CONNECT TO JACKSONIAN DEMOCRACY MORE BROADLY. This populist framing — government as either serving elites through special privilege or serving \"the people\" by refusing to grant it — matches the same logic behind expanded white male suffrage and the spoils system: political and economic power should not be concentrated in an unaccountable few.",
        'EXPLAIN WHY IT WAS POLITICALLY EFFECTIVE. By casting a complex financial institution as a simple moral choice — ordinary farmers and laborers versus "the rich and powerful" — Jackson made a technical banking dispute into a populist referendum his broad electoral coalition could rally behind, which helps explain why the veto became a central, winning issue in his 1832 reelection.',
        'STATE THE LINK TO THE COURSE THESIS. The Bank veto shows Jacksonian democracy\'s populist logic in action: expanding political voice and economic protection for one group (white male farmers, mechanics, laborers) is presented as a direct confrontation with concentrated elite privilege — the same populist framing that shaped the spoils system and Jackson\'s broader appeal, even as the era\'s "democracy" excluded others entirely.',
      ],
      answer:
        "Jackson argues that while some inequality of wealth is natural and unavoidable under any just government, the federal government should not make it worse by granting \"artificial distinctions\" — exclusive privileges like the Bank's special charter — that benefit the already rich and powerful at the expense of \"the humble members of society-the farmers, mechanics, and laborers\" — Jackson's phrase for ordinary working Americans. This framing was politically effective because it turned a complicated banking and monetary policy dispute into a simple, moralized choice between ordinary working Americans and an entrenched financial elite, rallying Jackson's broad coalition and helping make the veto a central, winning issue in his 1832 reelection. The same populist logic — protecting ordinary (white, male) Americans from concentrated privilege — runs through Jacksonian democracy more broadly, even as the era's expanded political voice excluded free Black Americans, Native Americans, and women.",
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE specific policy or event of the Jacksonian era (the Bank veto, the nullification crisis, or Indian Removal). (b) Briefly explain ONE specific consequence of that policy or event. (c) Briefly explain ONE group whose political rights did NOT expand during the Jacksonian era, despite the period's association with expanding democracy.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine Jacksonian-era policy or event — Jackson\'s 1832 veto of the Bank recharter, South Carolina\'s nullification of the tariff (1832-33), or the Indian Removal Act (1830)/Trail of Tears. No credit for a vague statement with no specific policy or event named.',
            modelResponse:
              'One policy was Jackson\'s 1832 veto of the bill to recharter the Second Bank of the United States, which he argued served the interests of the rich and powerful rather than ordinary farmers, mechanics, and laborers.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              "Full credit (1): explains a specific, accurate consequence connected to the named policy or event — e.g. the Bank veto becoming a central issue in Jackson's 1832 reelection and contributing to the Bank's eventual closure, the Force Bill and compromise tariff defusing the nullification crisis, or the Trail of Tears causing thousands of deaths during forced relocation. No credit for a disconnected or vague consequence.",
            modelResponse:
              "The Indian Removal Act led to the forced relocation of the Cherokee and other Southeastern nations in the late 1830s — remembered as the Trail of Tears — which caused thousands of deaths from exposure, disease, and starvation during the journey west.",
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly identifies a specific group whose rights did not expand — free Black Americans (facing growing voting restrictions in many states), Native Americans (facing forced removal despite Worcester v. Georgia ruling in their favor), or women (still excluded from voting). No credit for a vague or incorrect group.',
            modelResponse:
              "Native Americans' rights did not expand during the Jacksonian era — the Indian Removal Act (1830) authorized their forced relocation, and even after the Supreme Court ruled in the Cherokees' favor in Worcester v. Georgia (1832), the Jackson administration did not enforce that ruling and removal proceeded regardless.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-jacksonian-democracy-universal',
      kind: 'misconception_check',
      question:
        'True or false: Jacksonian democracy expanded political rights and participation to all Americans, not just a specific group.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Treating the era\'s broad label ("Jacksonian democracy") as evidence that ALL groups gained political rights, rather than checking which specific group actually gained ground.',
          correctsTo:
            "FALSE. Jacksonian democracy specifically expanded political participation for white men — most states eliminated property requirements for voting during this period, and the electorate for white men grew dramatically. But other groups did not share in this expansion, and some lost ground: many states actively restricted or eliminated voting rights for free Black men during these same decades, Native Americans faced forced removal from their homelands (the Indian Removal Act, 1830, and the Trail of Tears) even after winning a favorable Supreme Court ruling in Worcester v. Georgia (1832), and women of any race could not vote anywhere in the country. \"Democracy\" expanding for one group and \"exclusion\" worsening for others happened simultaneously, not as separate stories.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-bank-veto-neutral',
      kind: 'misconception_check',
      question:
        "True or false: Jackson's veto of the Bank recharter was an economically neutral policy dispute with no real political stakes or consequences.",
      commonErrors: [
        {
          answer: 'true',
          misconception:
            'Treating a contested economic-policy fight as a dry technical disagreement, rather than recognizing it as a defining political and economic battle with real consequences.',
          correctsTo:
            "FALSE. The Bank veto was a defining political and economic confrontation, not a neutral technical dispute. Jackson framed it in sharply populist terms — the Bank as a tool letting \"the rich and powerful\" bend government to their advantage against ordinary farmers, mechanics, and laborers — and made it a central issue of his decisive 1832 reelection campaign against Bank supporter Henry Clay. It also had real economic consequences: without recharter, the Bank's national regulatory role over currency and credit ended, a change historians link to looser state-bank lending practices in the years that followed. Treating the veto as a dry, low-stakes policy footnote misses both its political centrality and its economic consequences.",
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Jacksonian democracy expanded voting rights for white men (ending property requirements) while free Black men faced growing restrictions and Native Americans faced forced removal.',
        'Jackson vetoed the Bank recharter (1832) in populist terms — the Bank as a tool of "the rich and powerful" against ordinary farmers, mechanics, and laborers — making it a central issue in his reelection.',
        'The nullification crisis (1832-33): South Carolina declared the federal tariff void; Jackson secured the Force Bill while Congress passed a compromise tariff to defuse the crisis.',
        'The Indian Removal Act (1830) authorized relocation of Southeastern nations; the Supreme Court sided with the Cherokee in Worcester v. Georgia (1832), but Jackson\'s administration did not enforce the ruling.',
        'The Trail of Tears (late 1830s) caused thousands of deaths from exposure, disease, and starvation during forced relocation — a documented human catastrophe, not a footnote.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '4',
    cedTopic: '4.8-4.9',
    cedTitle: 'Jacksonian Democracy',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-jackson-bank-veto.v1',
        chapter: '1832',
        note: "Jackson's Bank Veto Message — the populist case against the Second Bank as an engine of privilege for the wealthy.",
      },
    ],
  },
};
