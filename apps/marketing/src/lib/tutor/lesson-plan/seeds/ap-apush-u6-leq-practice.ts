/**
 * AP US History — Period 6 LEQ Practice: the full Long Essay Question
 * (AP APUSH Free-Response Question 2/3/4 — the LEQ).
 *
 * Unlike the DBQ, the LEQ gives NO documents — the student argues entirely
 * from their own historical knowledge of the period. This plan intentionally
 * sets no `passageId`/`passageIds` on the try_yourself segment.
 *
 * Prompt targets the labor movement's and farmers'/Populists' responses to
 * industrialization (LOs 6.4-6.6 industrialization, 6.7 labor, 6.11-6.13
 * Gilded Age politics/Populism), scored against the authentic AP APUSH
 * 6-point LEQ rubric.
 */

import type { LessonPlan } from '../types';
import { AP_PACING_THRESHOLDS, AP_SOURCE } from './_ap-shared';

export const SEED_AP_APUSH_U6_LEQ_PRACTICE: LessonPlan = {
  id: 'evelyn.ap.apush.u6-leq-practice.v1',
  title: 'Period 6 LEQ Practice',
  curriculum: 'AP',
  grade: '11',
  subject: 'ss',
  topic: 'ap-us-history',
  locale: 'en',
  los: [
    {
      id: 'apush.u6-leq-practice',
      description:
        'Write a complete AP APUSH Long Essay Question response evaluating the extent to which farmers and industrial workers responded effectively to industrialization in the period 1865-1898 — a defensible thesis with a line of reasoning, contextualization, specific evidence drawn from the student\'s own knowledge, and historical reasoning/analysis — scored against the authentic AP APUSH 6-point LEQ rubric.',
      standard: 'AP-APUSH-6-LEQ',
    },
  ],
  prerequisites: [
    'apush.the-west-new-south',
    'apush.industrialization-big-business',
    'apush.labor-movement',
    'apush.immigration-urbanization',
    'apush.gilded-politics-populism',
  ],
  followUps: [],
  estimatedMinutes: 48,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the stakes of a timed, full LEQ essay concrete before the student sits down to write one, and flag the key difference from the DBQ: there are no documents — every piece of evidence has to come from what the student already knows.',
      script:
        "You've now studied how industrialization reshaped the American economy, how workers organized against harsh factory and mine conditions, and how struggling farmers built the Populist movement to fight back at the ballot box. Today you put that knowledge to the test in the Long Essay Question — FRQ 2, 3, or 4 on the AP US History exam, scored on the authentic 6-point rubric: Thesis (1), Contextualization (1), Evidence (2), and Analysis and Reasoning (2). Here's the big difference from a DBQ: there are NO documents. Every piece of evidence in your essay has to come from your own knowledge of the period. You write the whole essay and get scored the way an AP reader would score it.",
      estimatedMinutes: 2,
    },
    {
      id: 'concept-leq-task-and-rubric',
      kind: 'concept',
      goal: 'Frame exactly what the LEQ task asks for and how the 6-point rubric awards points, row by row.',
      keyIdeas: [
        'THE TASK: evaluate a historical claim using ONLY your own knowledge — no documents are provided. The single most common way students lose points is listing facts about the period without connecting them to an argument, or writing evidence with no analysis of why it matters.',
        'ROW A — THESIS/CLAIM (0–1 point): full credit requires a thesis that makes a historically defensible claim responding to the prompt AND establishes a line of reasoning — e.g. taking a clear position on the EXTENT (largely effective, largely ineffective, or effective in some ways but not others) to which farmers and industrial workers responded effectively to industrialization, not a vague restatement of the prompt.',
        'ROW B — CONTEXTUALIZATION (0–1 point): full credit requires describing, in at least a full sentence, a broader context relevant to the prompt — e.g. that the post-Civil War industrial boom concentrated unprecedented economic power in a small number of corporations and banks, while both industrial wage labor and commercial farming became newly dependent on national markets, railroads, and credit that neither workers nor farmers individually controlled, which explains why both groups turned to organized collective action.',
        'ROW C — EVIDENCE (0–2 points): 1 point for including at least two specific, accurate historical facts relevant to the topic; the full 2 points require using specific evidence to support an argument in response to the prompt — e.g. the Knights of Labor\'s broad, inclusive membership versus the American Federation of Labor\'s narrower, skilled-trades "bread and butter" strategy; the Great Railroad Strike of 1877, the Haymarket affair (1886), the Homestead Strike (1892), and the Pullman Strike (1894) as major labor actions, several met with government-backed force or injunctions; the Grange, then the Farmers\' Alliances, evolving into the People\'s (Populist) Party; and the Populists\' 1892 Omaha Platform demands (free silver, a sub-treasury system, government ownership of railroads) followed by the party\'s near-total absorption into the Democratic Party after backing William Jennings Bryan in 1896.',
        'ROW D — ANALYSIS AND REASONING (0–2 points): 1 point for using historical reasoning (e.g. comparison, causation, continuity/change) to frame the argument; the full 2 points require that reasoning to be used to support an argument that fully addresses the prompt, weighing evidence on both sides where relevant — e.g. comparing how labor unions achieved real but narrow, unevenly enforced gains (the AFL\'s durability versus the Knights\' collapse after Haymarket, and repeated federal court injunctions and troop deployments against strikers) against how the Populists achieved a larger SHORT-TERM political voice (winning several state offices and over a million votes in 1892) but ultimately failed as an independent party after 1896, even as many of their specific demands (a graduated income tax, direct election of senators, currency reform) became law only decades later — not just cataloging each movement\'s actions without connecting them to a verdict on effectiveness.',
        'Total = 6 points, integer, summed across the four rows (Evidence and Analysis/Reasoning are each worth 2) — the authentic AP APUSH LEQ scale, distinct from the 7-point DBQ rubric used elsewhere in the catalog.',
      ],
      estimatedMinutes: 4,
    },
    {
      id: 'try-full-essay-leq',
      kind: 'try_yourself',
      problem:
        'Evaluate the extent to which farmers and industrial workers responded effectively to industrialization in the period from 1865 to 1898. In your response you should do the following: (1) respond to the prompt with a historically defensible thesis or claim that establishes a line of reasoning, (2) describe a broader historical context relevant to the prompt (contextualization), (3) support your argument with specific and relevant evidence, and (4) use historical reasoning to explain the relationships between the pieces of evidence and connect them to your argument (analysis and reasoning).',
      responseFormat: 'frq',
      expectedAnswer:
        'A full-credit response opens with a thesis arguing, for example, that both farmers and industrial workers organized real, sustained collective responses to industrialization, but that neither achieved lasting institutional power in this period — labor unions won scattered, unevenly enforced gains before government force repeatedly broke their largest strikes, while the Populists built a genuinely mass political movement only to be absorbed into the Democratic Party after 1896, with many of their specific demands enacted only in later decades. Contextualization explains that the post-Civil War industrial boom concentrated unprecedented economic power in a small number of corporations, banks, and railroads, while both industrial wage labor and commercial farming became newly dependent on national markets, credit, and rail rates that neither workers nor farmers individually controlled — the shared condition that pushed both groups toward organized collective action. The evidence section develops specific facts connected to the thesis: the Knights of Labor built a broad, inclusive membership (skilled and unskilled workers, women, Black workers) but collapsed in public support after being wrongly associated with the 1886 Haymarket bombing, while the American Federation of Labor\'s narrower, skilled-trades "bread and butter" strategy of higher wages and shorter hours proved more durable; major strikes including the Great Railroad Strike of 1877, Homestead (1892), and Pullman (1894) were each broken by state militias, federal troops, or court injunctions, showing government power consistently sided with capital; meanwhile the Grange evolved into the Farmers\' Alliances and then the People\'s (Populist) Party, whose 1892 Omaha Platform demanded free silver, a sub-treasury currency system, and government ownership of railroads, and whose candidate won over a million votes and several states in 1892; and after backing William Jennings Bryan\'s free-silver campaign in 1896, the Populist Party was largely absorbed into the Democrats and disappeared as an independent political force. Analysis and reasoning uses comparison to weigh the two movements against a shared verdict on effectiveness: labor unions achieved real but narrow and unevenly enforced gains — the AFL\'s survival versus the Knights\' collapse, and repeated federal intervention against strikers, shows organized labor could win specific battles but not yet reshape the government\'s basic alignment with business — while the Populists achieved a larger short-term political voice, genuinely frightening the two major parties in 1892, but their absorption into the Democrats after 1896 shows that voice did not translate into lasting independent power, even though the delayed adoption of Populist-style reforms (a graduated income tax, direct election of senators, and later currency and banking reforms) in the Progressive Era shows their program was ultimately vindicated on a longer timescale than either movement achieved within this period.',
      rubric: {
        parts: [
          {
            criterionId: 'A-thesis',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): the thesis makes a historically defensible claim responding to the prompt (the extent to which farmers and industrial workers responded effectively to industrialization, 1865-1898) AND establishes a line of reasoning for the essay to follow — a clear position on the extent of effectiveness, not a restatement of the prompt or an unsupported assertion with no reasoning attached. No credit (0/1) for a thesis that only restates the prompt or is not historically defensible.',
            modelResponse:
              'Both farmers and industrial workers organized real, sustained collective responses to industrialization, but neither achieved lasting institutional power in this period: labor unions won scattered, unevenly enforced gains before government force repeatedly broke their largest strikes, while the Populists built a genuinely mass political movement only to be absorbed into the Democratic Party after 1896, with many of their specific demands enacted only in later decades.',
          },
          {
            criterionId: 'B-context',
            maxPoints: 1,
            scoringCriteria:
              'Full credit (1/1): describes, in at least a full sentence of specific historical detail, a broader context relevant to the prompt — e.g. that the post-Civil War industrial boom concentrated unprecedented economic power in corporations, banks, and railroads, making both wage labor and commercial farming newly dependent on national markets and credit neither group individually controlled. No credit (0/1) for a single vague, unsupported phrase with no specific historical detail.',
            modelResponse:
              'The post-Civil War industrial boom concentrated unprecedented economic power in a small number of corporations, banks, and railroads, while both industrial wage labor and commercial farming became newly dependent on national markets, credit, and rail rates that neither workers nor farmers individually controlled — the shared condition that pushed both groups toward organized collective action.',
          },
          {
            criterionId: 'C-evidence',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses specific, accurate historical evidence (e.g. Knights of Labor vs. AFL strategy, the 1877/Haymarket/Homestead/Pullman labor actions, the Grange-Alliance-Populist progression, the 1892 Omaha Platform, the Populists\' post-1896 decline) to support an argument in response to the prompt. 1/2: includes at least two specific, accurate facts relevant to the topic, whether or not they are clearly used to support an argument. 0/2: fewer than two specific facts, or evidence that is inaccurate or not relevant to the topic.',
            modelResponse:
              'The Knights of Labor built a broad, inclusive membership but collapsed in public support after being wrongly linked to the 1886 Haymarket bombing, while the AFL\'s narrower, skilled-trades "bread and butter" strategy proved more durable; major strikes including the Great Railroad Strike of 1877, Homestead (1892), and Pullman (1894) were each broken by state militias, federal troops, or court injunctions; the Grange evolved into the Farmers\' Alliances and then the People\'s (Populist) Party, whose 1892 Omaha Platform demanded free silver, a sub-treasury system, and government ownership of railroads and won over a million votes that year; and after backing Bryan\'s 1896 free-silver campaign, the Populist Party was largely absorbed into the Democrats and disappeared as an independent force.',
          },
          {
            criterionId: 'D-analysis',
            maxPoints: 2,
            scoringCriteria:
              'Full credit (2/2): uses historical reasoning (e.g. comparison) to connect the evidence into an argument that fully addresses the prompt, weighing evidence on both sides where relevant and explaining WHY the pieces of evidence relate to a verdict on effectiveness. 1/2: uses some historical reasoning to frame the response, but the connections between evidence and argument are inconsistent or only partially developed. 0/2: evidence is listed with no explanation of how it relates to the argument, or no historical reasoning is used.',
            modelResponse:
              'Comparing the two movements against a shared verdict on effectiveness shows labor unions achieved real but narrow and unevenly enforced gains — the AFL\'s survival versus the Knights\' collapse, and repeated federal intervention against strikers, shows organized labor could win specific battles but not yet reshape the government\'s basic alignment with business — while the Populists achieved a larger short-term political voice that genuinely frightened both major parties in 1892, but their absorption into the Democrats after 1896 shows that voice did not translate into lasting independent power, even though the eventual adoption of Populist-style reforms (a graduated income tax, direct election of senators, currency reform) in the Progressive Era shows their program was ultimately vindicated on a longer timescale than either movement achieved within this period.',
          },
        ],
      },
      hints: [
        'Take a clear position on the EXTENT of effectiveness — "largely effective," "largely ineffective," or "effective in some ways, not others" — rather than just listing pros and cons.',
        'Since there are no documents, every piece of evidence needs to come from what you already know about the period — be specific (name the actual union, strike, platform, or law), not general.',
        'Comparison is a strong reasoning tool here: how did labor\'s results differ from the Populists\' results, and why?',
        'A nuanced thesis (real short-term organizing successes, but limited lasting institutional power in THIS period) tends to score better than an all-or-nothing claim.',
      ],
      estimatedMinutes: 40,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The LEQ has NO documents — every piece of evidence has to come from your own knowledge of the period.',
        'The 6-point rubric: Thesis (1); Contextualization (1); Evidence (2, requires evidence used to SUPPORT an argument for full credit); Analysis and Reasoning (2, requires explaining HOW evidence connects, not just listing facts).',
        'Comparison is a strong reasoning tool here: labor\'s narrow, unevenly enforced gains versus the Populists\' larger but short-lived political voice.',
        'A nuanced thesis (organized, sometimes effective resistance, but no lasting institutional power within 1865-1898) tends to score better than an all-or-nothing claim.',
      ],
      estimatedMinutes: 2,
    },
  ],
  source: AP_SOURCE,
  schemaVersion: 1,
  pacingThresholds: AP_PACING_THRESHOLDS,
  metadata: {
    cedUnit: '6',
    cedTopic: '6-LEQ',
    cedTitle: 'Period 6 LEQ Practice',
    sources: [
      {
        type: 'frq-style',
        source: 'AP Plans Initiative author',
        note: 'Modeled on the authentic AP APUSH Long Essay Question task wording and 6-point rubric (Thesis 1 / Contextualization 1 / Evidence 2 / Analysis-Reasoning 2).',
      },
    ],
  },
};
