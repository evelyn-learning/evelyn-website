/**
 * AP US History — CED Unit 6.11-6.13: Gilded Age Politics and Populism.
 *
 * Period-6 content plan (follows the causes-of-revolution calibration
 * template — see ap-apush-u3-causes-of-revolution.ts for the full
 * rationale and docs/superpowers/specs/2026-07-10-ap-us-history-design.md
 * for the shared Passage/rubric infra this plan reuses).
 *
 * Closes Period 6's arc: patronage-driven political stalemate and its
 * limited civil-service reform (Pendleton Act), the agrarian crisis that
 * produced the Grange, Farmers' Alliances, and the Populist Party, and the
 * pivotal 1896 election. The Bryan "Cross of Gold" excerpt is reserved for
 * the MCQ bank per the period block (not quoted here); this plan's anchor
 * document is the Omaha Platform (1892).
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U6_GILDED_POLITICS_POPULISM: LessonPlan = {
  id: 'evelyn.ap.apush.gilded-politics-populism.v1',
  title: 'U6.11-6.13 Gilded Age Politics and Populism',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.gilded-politics-populism',
      description:
        'Explain the political stalemate and patronage system of Gilded Age politics and the limited civil-service reform that followed Garfield\'s assassination; explain the agrarian crisis and the rise of the Grange, Farmers\' Alliances, and the Populist Party; and evaluate the significance of the 1896 election and McKinley-era political realignment.',
      standard: 'AP-APUSH-6.11',
    },
  ],
  prerequisites: ['apush.labor-movement', 'apush.immigration-urbanization'],
  followUps: [],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Get the student to see the Populists as a movement that lost its central election but still reshaped what American government would later do.',
      script:
        "Here's a strange fact about the Populist Party: it never won the presidency, its 1896 alliance with the Democrats went down to defeat, and within a decade the party had essentially disappeared. By most measures, it lost. And yet: a graduated income tax, direct election of U.S. senators, and a secret ballot — three of the Populists' core 1892 demands — all became the law of the land within about twenty years of their defeat. How does a political movement lose its central fight and still get most of its platform enacted? That paradox is where we're headed today, by way of a farm crisis severe enough to convince Kansas and Nebraska wheat farmers that the entire national money system was rigged against them — and a political system so evenly divided between the two major parties that neither side could do much about it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-patronage-populism-1896',
      kind: 'concept',
      goal: 'Explain Gilded Age political stalemate and civil-service reform, the agrarian crisis and rise of Populism, and the significance of the 1896 election.',
      keyIdeas: [
        'POLITICAL STALEMATE: national elections in the 1870s-1890s were extremely close, with control of the presidency and Congress alternating frequently and neither major party holding durable, decisive majorities. High voter turnout coexisted with genuinely narrow substantive policy differences between the parties on many economic questions, producing a period of legislative gridlock on major issues even as party loyalty and turnout ran very high.',
        'PATRONAGE AND THE PENDLETON ACT (1883): federal government jobs were largely distributed through the "spoils system" — political patronage rewarding party loyalists rather than qualified applicants. After a disappointed office-seeker assassinated President James Garfield in 1881, Congress passed the Pendleton Civil Service Act (1883), creating a Civil Service Commission and requiring competitive exams for many federal jobs — a real but PARTIAL reform, since it initially covered only a minority of federal positions.',
        'THE FARM CRISIS: falling crop prices (driven partly by rising global agricultural production and by a tight, gold-backed money supply that produced deflation, making debts effectively harder to repay over time), high railroad shipping rates (with farmers often lacking competing rail lines to negotiate against), and the crop-lien credit system combined to trap many American farmers, especially in the South and Great Plains, in worsening debt through the 1880s and 1890s.',
        'FROM THE GRANGE TO THE ALLIANCES TO THE POPULISTS: the Grange (Patrons of Husbandry, founded 1867) began as a farmers\' social and cooperative-buying organization and pushed early state-level "Granger laws" regulating railroad rates. Farmers\' Alliances in the 1880s built larger regional organizing networks and cooperative enterprises, developing more ambitious policy proposals, including the "sub-treasury plan" (government-run warehouses providing farmers low-interest crop-backed loans). The People\'s (Populist) Party, formed in 1892, translated Alliance organizing into a national political party.',
        'THE OMAHA PLATFORM (1892): the Populist Party\'s founding platform opened with a sweeping indictment of the political and economic system — describing "a nation brought to the verge of moral, political, and material ruin" — and demanded a specific set of reforms: free and unlimited coinage of silver (at a 16-to-1 ratio to gold, to expand the money supply and ease farmers\' debt burdens), the sub-treasury plan or an equivalent government-backed farm credit system, and government ownership of the railroads to end discriminatory rate-setting.',
        'THE 1896 ELECTION: the money-supply question — free silver (favored by debt-burdened farmers and silver-mining interests, who wanted currency inflation) versus the gold standard (favored by creditors, bankers, and much of the urban business and financial establishment, who wanted stable, "sound" currency) — became the era\'s defining political fight. Democratic nominee William Jennings Bryan embraced free silver and won the Populist Party\'s endorsement as well, fusing the two parties\' tickets; Republican nominee William McKinley defended the gold standard and protective tariffs, backed by significantly greater campaign financing.',
        'MCKINLEY\'S VICTORY AND REALIGNMENT: McKinley won the 1896 election decisively, building a coalition of business interests, industrial workers (who worried free silver\'s inflation would erode wages), and much of the urban North and Midwest — a realignment that gave Republicans dominance in national politics for most of the next three decades and marked the effective end of the Populist Party as an independent political force.',
        'THE POPULISTS\' LONGER-TERM IMPACT: though the Populist Party itself collapsed after 1896, several of its 1892 demands were enacted within roughly twenty years under different political sponsorship — the graduated federal income tax (16th Amendment, 1913), direct election of U.S. senators (17th Amendment, 1913), and the secret ballot, along with the sub-treasury plan\'s general approach to farm credit later echoing in New Deal-era farm programs. The movement\'s electoral defeat in 1896 is not the same as its policy defeat.',
      ],
      vocabulary: [
        {
          term: 'Pendleton Civil Service Act (1883)',
          definition:
            'law creating a Civil Service Commission and requiring competitive exams for many federal jobs, passed after Garfield\'s assassination by a disappointed office-seeker; a partial reform of the patronage/spoils system.',
        },
        {
          term: 'sub-treasury plan',
          definition:
            "Farmers' Alliance proposal for government-run warehouses providing farmers low-interest, crop-backed loans, intended to ease dependence on the crop-lien system.",
        },
        {
          term: 'Omaha Platform (1892)',
          definition:
            "the Populist Party's founding platform, demanding free silver, government ownership of railroads, and farm-credit reform, opening with an indictment of a nation \"brought to the verge of moral, political, and material ruin.\"",
        },
        {
          term: 'free silver',
          definition:
            'the policy of unlimited government coinage of silver alongside gold, favored by debt-burdened farmers and silver interests to expand the money supply and ease debt repayment.',
        },
        {
          term: '1896 realignment',
          definition:
            "McKinley's 1896 victory over Bryan, building a business/industrial-worker/urban coalition that gave Republicans national political dominance for roughly three decades and ended the Populist Party as an independent force.",
        },
      ],
      passageId: 'evelyn.passage.apush-omaha-platform.v1',
      estimatedMinutes: 6,
    },
    {
      id: 'worked-omaha-platform',
      kind: 'worked_example',
      problem:
        'Analyze this excerpt from the Populist Party\'s Omaha Platform (1892): "The conditions which surround us best justify our co-operation; we meet in the midst of a nation brought to the verge of moral, political, and material ruin. Corruption dominates the ballot-box, the Legislatures, the Congress, and touches even the ermine of the bench... We demand free and unlimited coinage of silver and gold at the present legal ratio of 16 to 1... Transportation being a means of exchange and a public necessity, the government should own and operate the railroads in the interest of the people." What argument is this platform making, and what does it reveal about the Populists\' diagnosis of the era\'s problems?',
      steps: [
        'SOURCE IT FIRST. The founding platform of the newly formed People\'s (Populist) Party, adopted at its 1892 national convention in Omaha — written to launch a national political party, not merely to describe grievances.',
        'IDENTIFY THE RHETORICAL FRAME. The preamble does not describe a narrow policy dispute — it describes systemic "ruin," with corruption reaching the ballot box, the legislatures, Congress, and even the judiciary ("the ermine of the bench"). This is a claim that the ENTIRE political system, not just economic policy, has failed ordinary farmers and workers.',
        'CONNECT THE PREAMBLE TO THE SPECIFIC DEMANDS. Having diagnosed systemic corruption, the platform proposes concrete structural fixes rather than just complaints: free silver (16 to 1) to expand the money supply and ease farmers\' crushing debt burden under deflation, and government ownership of railroads to remove a "public necessity" from private corporate control the Populists believed was being abused through discriminatory rates.',
        'IDENTIFY WHO THIS SPEAKS FOR AND WHY. These demands map directly onto the material interests of debt-burdened farmers (free silver eases repaying loans made in scarcer, more valuable dollars) and farmers dependent on railroads to ship crops to market (government ownership targets the middleman they believed was extracting excessive rents). The platform speaks for a specific economic constituency, even while its preamble frames the crisis in universal moral terms ("the people").',
        'STATE THE LINK TO THE COURSE THESIS. The Omaha Platform shows the Populist movement translating a specific agrarian economic crisis (falling prices, debt, railroad rates) into a sweeping political argument about systemic corruption — and proposing structural, not incremental, remedies (currency reform, public ownership) as the answer.',
      ],
      answer:
        'The platform argues that the country\'s political system is systemically corrupt — not just economically mismanaged — with corruption reaching "the ballot-box, the Legislatures, the Congress," and even the judiciary. From that sweeping diagnosis, it proposes specific structural remedies: free and unlimited coinage of silver at 16 to 1 (to expand the money supply and ease debt-burdened farmers\' repayment terms under deflation) and government ownership of the railroads (to remove a "public necessity" farmers depended on from what they saw as abusive private corporate control). This reveals the Populists\' diagnosis: the era\'s economic hardship for farmers was not an unfortunate side effect of impersonal market forces, but the result of a corrupted political system serving corporate and financial interests at ordinary producers\' expense — which is why the platform reaches for major structural reforms (currency policy, public ownership) rather than smaller, incremental fixes.',
      estimatedMinutes: 5,
    },
    {
      id: 'try-saq',
      kind: 'try_yourself',
      problem:
        "SAQ practice. (a) Briefly describe ONE cause of the agrarian crisis that produced the Populist movement. (b) Briefly explain ONE demand from the Omaha Platform and how it addressed that crisis. (c) Briefly explain the significance of the 1896 election for American political alignment.",
      responseFormat: 'frq',
      rubric: {
        parts: [
          {
            criterionId: 'a',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): correctly and specifically describes a genuine cause of the agrarian crisis — e.g. falling crop prices combined with a deflationary, gold-backed money supply making debts harder to repay, high railroad shipping rates, or the crop-lien credit system trapping farmers in debt. No credit for a vague statement ("farmers were struggling") with no specific cause named.',
            modelResponse:
              'Falling crop prices combined with a tight, gold-backed money supply that produced deflation, meaning farmers had to repay debts in dollars that were effectively worth more over time than when they had borrowed, trapping many in worsening debt through the 1880s and 1890s.',
          },
          {
            criterionId: 'b',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains a specific, accurate Omaha Platform demand and connects it to the crisis — e.g. free silver (16 to 1) to expand the money supply and ease debt repayment, or government ownership of railroads to end discriminatory shipping rates. No credit for a disconnected or vague explanation.',
            modelResponse:
              'The Omaha Platform demanded free and unlimited coinage of silver at a 16-to-1 ratio to gold, which would expand the money supply and create inflation, directly addressing farmers\' debt crisis by making it easier to repay loans in less valuable, more plentiful dollars.',
          },
          {
            criterionId: 'c',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1): explains the specific, accurate significance of 1896 — e.g. McKinley\'s victory over Bryan built a business/urban/industrial-worker coalition that gave Republicans national dominance for roughly the next three decades and ended the Populist Party as an independent political force. No credit for a vague or unsupported claim.',
            modelResponse:
              "William McKinley's 1896 victory over William Jennings Bryan, who ran on free silver with Populist Party endorsement, built a coalition of business interests, industrial workers, and the urban North and Midwest that gave Republicans dominance in national politics for roughly the next three decades and marked the effective end of the Populist Party as an independent force.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: 'misconception-populists-won-nothing',
      kind: 'misconception_check',
      question:
        'True or false: because the Populist Party lost the 1896 election and soon disappeared, its political program achieved essentially nothing.',
      commonErrors: [
        {
          answer: 'true',
          misconception:
            "Equating a party's electoral defeat and organizational collapse with its policy program's total failure, rather than distinguishing between the party's political fate and the later fate of its specific demands.",
          correctsTo:
            'FALSE. Although the Populist Party lost the pivotal 1896 election and largely dissolved as an independent political force soon after, several of its core 1892 Omaha Platform demands were enacted within about twenty years under different political sponsorship: the graduated federal income tax (16th Amendment, 1913), the direct election of U.S. senators (17th Amendment, 1913), and the secret ballot all became law, and the sub-treasury plan\'s basic approach to farm credit influenced later New Deal-era agricultural programs. The Populists\' electoral defeat in 1896 should not be confused with a total defeat of their policy agenda — the AP exam rewards distinguishing a movement\'s immediate political fate from its longer-term policy legacy.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Gilded Age politics featured close elections and patronage-driven government; the Pendleton Act (1883, after Garfield\'s assassination) began — but only partially — replacing patronage with a merit-based civil service.',
        'The agrarian crisis (falling prices, deflation, railroad rates, the crop-lien system) drove farmers from the Grange (1867) to the Farmers\' Alliances (1880s) to the Populist Party (1892).',
        'The Omaha Platform (1892) diagnosed systemic political corruption and demanded free silver (16 to 1), a sub-treasury/farm-credit system, and government ownership of railroads.',
        '1896: Bryan (free silver, Democratic-Populist fusion) lost to McKinley (gold standard, tariffs), producing a Republican-dominant political realignment lasting roughly three decades.',
        'The Populists lost the 1896 election, but much of their program — the income tax, direct election of senators, the secret ballot — became law within about twenty years under other sponsorship. Electoral defeat is not the same as policy defeat.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6.11-6.13',
    cedTitle: 'Gilded Age Politics and Populism',
    sources: [
      { type: 'plan', source: 'AP Plans Initiative — AP US History' },
      {
        type: 'passage',
        book: 'evelyn.passage.apush-omaha-platform.v1',
        chapter: '1892',
        note: 'Omaha Platform — anchor document for the Populist Party\'s diagnosis and demands.',
      },
    ],
  },
};
